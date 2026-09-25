// studio/export.js: export scenes to MP4 right in the browser, no image frames on disk.
//
// Each frame is painted with the same drawFrame() the renderer uses, handed to the browser's WebCodecs H.264 encoder
// straight from the canvas, and muxed into an MP4 by mp4-muxer (node_modules/mp4-muxer). It is frame-exact (not a
// screen recording) and usually faster than real time. Needs Chrome / Edge 94+ (WebCodecs).
// Audio: each scene's `audio` file is decoded, resampled to 48 kHz stereo, trimmed/padded to the scene length and
// encoded as AAC (or Opus). Loading audio needs http:// — run `npm run studio` (serve.mjs); under file:// it is skipped.
//
//   const blob = await exportVideo({ scenes: ['scene01_juggling'], bitrate: 8e6, onProgress: (p, msg) => …, signal })

async function exportVideo({ scenes, fps, bitrate = 8e6, onProgress = () => {}, signal } = {}) {
  if (!('VideoEncoder' in window)) throw new Error('This browser has no WebCodecs video encoder. Use Chrome or Edge, or render with: node render.mjs --build');
  if (!window.Mp4Muxer) throw new Error('mp4-muxer is not loaded. Run: npm install');
  const list = scenes.map(id => { const s = SCENES[id]; if (!s) throw new Error('unknown scene ' + id); return s; });
  fps = fps ?? list[0].fps ?? 24;
  const counts = list.map(s => Math.ceil(s.duration * fps - 1e-6)), total = counts.reduce((a, b) => a + b, 0);
  const warnings = [], stop = () => { if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError'); };

  // ---- audio (optional) ----
  onProgress(0, 'Preparing audio…');
  const SR = 48000, tracks = [];
  for (let i = 0; i < list.length; i++) tracks.push(await sceneAudio(list[i], counts[i] / fps, SR, warnings));
  const hasAudio = tracks.some(tr => tr.real);
  let aCfg = null;
  if (hasAudio) {
    for (const c of [{ codec: 'mp4a.40.2', mux: 'aac' }, { codec: 'opus', mux: 'opus' }]) {
      const cfg = { codec: c.codec, sampleRate: SR, numberOfChannels: 2, bitrate: 192000 };
      if ('AudioEncoder' in window && (await AudioEncoder.isConfigSupported(cfg)).supported) { aCfg = { ...c, cfg }; break; }
    }
    if (!aCfg) warnings.push('no AAC/Opus audio encoder in this browser: exported without sound');
  }

  // ---- video encoder: best H.264 profile the browser supports at 1080p ----
  let vCfg = null;
  for (const codec of ['avc1.640028', 'avc1.4d0028', 'avc1.42002a']) {
    const cfg = { codec, width: W, height: H, bitrate, framerate: fps, avc: { format: 'avc' } };
    if ((await VideoEncoder.isConfigSupported(cfg)).supported) { vCfg = cfg; break; }
  }
  if (!vCfg) throw new Error('This browser cannot encode H.264 at 1920×1080');

  const muxer = new Mp4Muxer.Muxer({
    target: new Mp4Muxer.ArrayBufferTarget(), fastStart: 'in-memory', firstTimestampBehavior: 'offset',
    video: { codec: 'avc', width: W, height: H, frameRate: fps },
    audio: aCfg ? { codec: aCfg.mux, numberOfChannels: 2, sampleRate: SR } : undefined,
  });
  let encErr = null;
  const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: e => { encErr = e; } });
  venc.configure(vCfg);

  // ---- paint + encode every frame ----
  const canvas = X.canvas, us = 1e6 / fps, t0 = performance.now();
  let n = 0;
  try {
    for (let si = 0; si < list.length; si++) {
      const sc = list[si]; useScene(sc.id);
      for (let i = 0; i < counts[si]; i++, n++) {
        stop(); if (encErr) throw encErr;
        drawFrame(i / fps, sc);
        const frame = new VideoFrame(canvas, { timestamp: Math.round(n * us), duration: Math.round(us) });
        venc.encode(frame, { keyFrame: n % (fps * 2) === 0 });
        frame.close();
        while (venc.encodeQueueSize > 6) await new Promise(r => setTimeout(r, 1));
        if (n % 6 === 0) {
          const el = (performance.now() - t0) / 1000, eta = (total - n) * el / Math.max(1, n);
          onProgress(n / total, `${sc.title || sc.id} · frame ${n + 1}/${total} · ${(n / el || 0).toFixed(0)} fps · ~${eta.toFixed(0)} s left`);
          await new Promise(r => setTimeout(r, 0));                     // let the page repaint the progress bar
        }
      }
    }
    await venc.flush(); if (encErr) throw encErr;
  } finally { if (venc.state !== 'closed') venc.close(); }

  // ---- audio encode ----
  if (aCfg) {
    onProgress(1, 'Encoding audio…');
    const len = tracks.reduce((a, tr) => a + tr.L.length, 0), L = new Float32Array(len), R = new Float32Array(len);
    let o = 0; for (const tr of tracks) { L.set(tr.L, o); R.set(tr.R, o); o += tr.L.length; }
    const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: e => { encErr = e; } });
    aenc.configure(aCfg.cfg);
    for (let i = 0; i < len; i += 1024) {
      stop();
      const m = Math.min(1024, len - i), data = new Float32Array(m * 2);
      data.set(L.subarray(i, i + m), 0); data.set(R.subarray(i, i + m), m);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: m, numberOfChannels: 2, timestamp: Math.round(i / SR * 1e6), data });
      aenc.encode(ad); ad.close();
    }
    await aenc.flush(); aenc.close(); if (encErr) throw encErr;
  }

  muxer.finalize();
  const blob = new Blob([muxer.target.buffer], { type: 'video/mp4' });
  blob.warnings = warnings; blob.frames = total; blob.seconds = (performance.now() - t0) / 1000;
  return blob;
}

// One scene's sound as 48 kHz stereo, exactly `seconds` long (silence if it has none or it can't be loaded).
async function sceneAudio(sc, seconds, SR, warnings) {
  const len = Math.round(seconds * SR), silent = { L: new Float32Array(len), R: new Float32Array(len), real: false };
  if (!sc.audio) return silent;
  if (location.protocol === 'file:') { warnings.push(`${sc.id}: audio skipped under file:// — open the studio with "npm run studio" to include it`); return silent; }
  try {
    const res = await fetch(sc.audio);
    if (!res.ok) { if (res.status !== 404) warnings.push(`${sc.id}: audio ${sc.audio} (${res.status})`); return silent; }
    const ctx = new OfflineAudioContext(2, len, SR), buf = await ctx.decodeAudioData(await res.arrayBuffer());
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination); src.start();
    const out = await ctx.startRendering();
    return { L: out.getChannelData(0), R: out.getChannelData(1), real: true };
  } catch (e) { warnings.push(`${sc.id}: could not decode ${sc.audio} (${e.message})`); return silent; }
}

function downloadBlob(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
