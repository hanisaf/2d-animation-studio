// Self-contained scene bundles. Source stays ordinary JavaScript: no eval or remote runtime.
async function exportSceneJavaScript({ id, sound = false, signal, onProgress = () => {} }) {
  if (!ASSETS.scene[id]) throw new Error('Unknown scene ' + id);
  const sc = await requireScene(id);
  if (location.protocol === 'file:') throw new Error('Start the studio with npm run studio to export JavaScript');
  const stop = () => { if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError'); };
  const read = async path => {
    stop(); const res = await fetch(path, { signal });
    if (!res.ok) throw new Error('Could not bundle ' + path + ' (HTTP ' + res.status + ')');
    return res.text();
  };
  const dataURL = blob => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob);
  });
  stop();
  // Start rendering during export, before file fetches, so audio preparation
  // overlaps bundling. Reuse a finished or in-progress studio render.
  const soundtrack = sound && (sc.music || sc.dialogue?.length) ? synthesizeSceneAudio(sc) : null;
  soundtrack?.catch(() => {}); // Awaited and reported by this export below.
  onProgress(0, 'Bundling drawing engine and scene…');
  const code = await Promise.all(['engine/core.js', 'engine/persp.js', 'engine/callout.js', 'engine/timeline.js'].map(read));
  // Bundle only the scene's actual cast, locations, transitive asset `uses`, and helper scenes
  // (everything except scene.js from borrowed scenes) in canonical studio load order.
  const depList = sceneDeps(id);
  const assets = depList.map(([kind, aid]) => {
    const a = ASSETS[kind][aid];
    if (!a) throw new Error(id + ' uses unknown ' + kind + ' ' + aid);
    return kind === 'scene' && aid !== id ? { ...a, files: a.files.filter(f => f !== 'scene.js') } : a;
  });
  for (let i = 0; i < assets.length; i++) {
    const a = assets[i], meta = { ...a, refs: [], docs: null, audio: null };
    if (!sound) delete meta.music; // dialogue text is also used by speech bubbles
    code.push('CURRENT_ASSET = ' + JSON.stringify({ kind: a.kind, id: a.id, dir: a.dir }) + ';\nasset(' + JSON.stringify(meta) + ');');
    code.push(...await Promise.all(a.files.map(f => read(a.dir + '/' + f))));
    onProgress(.1 + .5 * (i + 1) / assets.length, 'Bundling ' + a.title + '…');
  }
  code.push('CURRENT_ASSET = null;');
  let audio = null;
  if (sound) {
    if (sc.music || sc.dialogue?.length) {
      onProgress(.65, 'Rendering and compressing soundtrack...');
      const buffer = await soundtrack;
      stop();
      if (!buffer) throw new Error('Scene soundtrack could not be rendered');
      const blob = typeof sceneCompressedAudioBlob === 'function' ? await sceneCompressedAudioBlob(buffer) : sceneWavBlob(buffer);
      audio = await dataURL(blob);
    } else if (sc.audio) {
      const res = await fetch(sc.audio, { signal });
      if (!res.ok) throw new Error('Could not embed soundtrack (HTTP ' + res.status + ')');
      audio = await dataURL(await res.blob());
    }
  }
  onProgress(.7, 'Embedding fonts…');
  // Freeze the exact font stylesheet and all its subsets into the download.
  const fonts = [];
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (!link.href.startsWith('https://fonts.googleapis.com/')) continue;
    const css = await read(link.href);
    for (const match of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
      const block = match[1], prop = name => block.match(new RegExp(name + '\\s*:\\s*([^;]+)'))?.[1].trim();
      const url = prop('src')?.match(/url\((['"]?)(.*?)\1\)/)?.[2];
      if (!url) throw new Error('Could not find font file in stylesheet');
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error('Could not embed font (HTTP ' + res.status + ')');
      fonts.push({ family: prop('font-family').replace(/['"]/g, ''), src: await dataURL(await res.blob()),
        descriptors: { weight: prop('font-weight') || 'normal', style: prop('font-style') || 'normal',
          unicodeRange: prop('unicode-range') || 'U+0-10FFFF' } });
    }
  }
  if (!fonts.length) throw new Error('Scene fonts were not found; reload the studio before exporting');
  stop(); onProgress(1, 'JavaScript ready');
  const config = { id, sound: sound && !!audio, audio, fonts, fx: { m2: FX.m2, m3: FX.m3 } };
  const source = '// Safadi Animation Studio — ' + id + (sound ? ' (with sound)' : ' (without sound)') + '\n' +
    '// Embed: <script src="' + id + (sound ? '.with-sound.js' : '.silent.js') + '" data-mount="#animation" data-loop="true"></script>\n' +
    '(function () {\n"use strict";\nconst config = ' + JSON.stringify(config) + ';\n' +
    'let fontReady;\nasync function createPlayer(target, options = {}) {\n' + code.join('\n;\n') + '\n' +
    sceneJavaScriptPlayer.toString() + '\nreturn await sceneJavaScriptPlayer(config, target, options, () => fontReady ||= Promise.all(config.fonts.map(async f => { const cache = (window.SafadiScenes._fonts ||= Object.create(null)); const k = f.family + "|" + f.descriptors.weight + "|" + f.descriptors.style + "|" + f.descriptors.unicodeRange; return cache[k] ||= (async () => { const face = new FontFace(f.family, "url(" + f.src + ")", f.descriptors); await face.load(); document.fonts.add(face); })(); })));\n}\n' +
    'window.SafadiScenes ||= Object.create(null);\nwindow.SafadiScenes[config.id] = Object.freeze({ id: config.id, mount: createPlayer, sound: config.sound });\n' +
    'window.MyScene = window.SafadiScenes[config.id];\n' +
    sceneJavaScriptAutoMount.toString() + '\nsceneJavaScriptAutoMount(document.currentScript, window.MyScene);\n})();\n';
  return new Blob([source], { type: 'text/javascript;charset=utf-8' });
}

// Companion test page that mounts an exported standalone scene script from the same folder (works over file://).
function sceneJavaScriptHtmlBlob({ id, scriptName, title = id }) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #141118; font-family: system-ui, sans-serif; color: #f4efe8; }
    main { width: min(100vw - 32px, 1120px); }
    h1 { margin: 0 0 12px; font-size: 16px; font-weight: 600; opacity: .85; }
  </style>
</head>
<body>
  <main>
    <h1>${esc(title)}</h1>
    <div id="animation"></div>
  </main>
  <script src="${esc(scriptName)}" data-mount="#animation"></script>
</body>
</html>
`;
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

// Serialized into each bundle inside its private engine scope.
async function sceneJavaScriptPlayer(config, target, options, loadFonts) {
  const host = typeof target === 'string' ? document.querySelector(target) : target;
  if (!host || typeof host.appendChild !== 'function') throw new Error('Scene mount target was not found');
  await loadFonts();
  const box = document.createElement('div'), root = box.attachShadow({ mode: 'open' });
  root.innerHTML = '<style>:host{display:block}canvas{display:block;width:100%;height:auto;aspect-ratio:16/9}.controls{display:flex;align-items:center;gap:5px;padding:5px 0;font:12px system-ui}.controls[hidden]{display:none}button,select{box-sizing:border-box;font:inherit;min-height:28px;padding:3px 7px;cursor:pointer;border:1px solid #c9cdd3;border-radius:5px;background:#fff;color:#263442}button:disabled{cursor:default;opacity:.55}.seek{flex:1;min-width:40px;margin:0;accent-color:#247b69}.time{font-variant-numeric:tabular-nums;white-space:nowrap;font-size:11px}.status{display:block;font:12px system-ui}.status:empty{display:none}</style><canvas></canvas><div class="controls"><button class="play" type="button" aria-label="Play">Play</button><input class="seek" type="range" min="0" step="0.01" value="0" aria-label="Seek playback"><span class="time"></span><button class="mute" type="button" aria-label="Unmute" aria-pressed="true">Unmute</button><select class="speed" aria-label="Playback speed"><option value="0.5">0.5x</option><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></div><span class="status" role="status"></span>';
  const canvas = root.querySelector('canvas'), button = root.querySelector('.play'), status = root.querySelector('.status');
  const slider = root.querySelector('.seek'), muteButton = root.querySelector('.mute'), speed = root.querySelector('.speed'), time = root.querySelector('.time');
  canvas.width = W; canvas.height = H; canvas.setAttribute('aria-label', SCENES[config.id].title || config.id);
  if (typeof setFx === 'function') setFx({ m2: options.m2 ?? config.fx?.m2 ?? true, m3: options.m3 ?? config.fx?.m3 ?? true });
  X = canvas.getContext('2d'); useScene(config.id);
  const sc = SCENE, fps = sc.fps || 24;
  let t = 0, playing = false, destroyed = false, raf = 0, origin = 0, generation = 0, lastFrame = -1;
  let muted = options.muted !== false, playbackRate = 1;
  let audio = config.sound ? new Audio() : null, audioBlobUrl = null, soundActive = false, soundGeneration = 0;
  let useWebAudio = false, webAudioCtx = null, webAudioBuf = null, webAudioSrc = null, webAudioStartCtx = 0, webAudioStartPos = 0, webAudioActive = false;
  function decodeAudioDataUrl(url) {
    if (!url || !url.startsWith('data:')) return null;
    const comma = url.indexOf(','), meta = url.slice(5, comma), mime = meta.split(';')[0] || 'audio/mp4';
    const bin = atob(url.slice(comma + 1)), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { mime, bytes };
  }
  slider.max = String(sc.duration);
  muteButton.disabled = !audio;
  if (!audio) { muteButton.textContent = 'No sound'; muteButton.setAttribute('aria-label', 'This export has no sound'); }
  if (audio) {
    audio.preload = 'auto'; audio.muted = muted; audio.playbackRate = playbackRate;
    audio.onerror = () => { if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') useWebAudio = true; };
    if (config.audio) {
      let src = config.audio;
      if (src.startsWith('data:') && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        try {
          const decoded = decodeAudioDataUrl(src);
          if (decoded) { audioBlobUrl = URL.createObjectURL(new Blob([decoded.bytes], { type: decoded.mime })); src = audioBlobUrl; }
        } catch {}
      }
      audio.src = src;
    }
  }
  if (options.controls === false) root.querySelector('.controls').hidden = true;
  const formatTime = seconds => Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  function syncControls() {
    slider.value = String(t); slider.setAttribute('aria-valuetext', formatTime(t) + ' of ' + formatTime(sc.duration));
    time.textContent = formatTime(t) + ' / ' + formatTime(sc.duration);
    button.setAttribute('aria-label', button.textContent);
    if (audio) { muteButton.textContent = muted ? 'Unmute' : 'Mute'; muteButton.setAttribute('aria-label', muteButton.textContent); muteButton.setAttribute('aria-pressed', String(muted)); }
  }
  const draw = () => { lastFrame = Math.floor(t * fps); drawFrame(Math.min(t, sc.duration - 1e-6)); syncControls(); };
  function currentClock(now = performance.now()) {
    if (webAudioActive && webAudioCtx) return clamp(webAudioStartPos + (webAudioCtx.currentTime - webAudioStartCtx) * playbackRate, 0, sc.duration);
    return clamp(soundActive && audio?.src && !audio.paused ? audio.currentTime : (now / 1000 - origin) * playbackRate, 0, sc.duration);
  }
  function resetClock() { origin = performance.now() / 1000 - t / playbackRate; }
  function stopWebAudio() {
    webAudioActive = false;
    if (webAudioSrc) { try { webAudioSrc.stop(); webAudioSrc.disconnect(); } catch {} webAudioSrc = null; }
  }
  async function startWebAudio(token) {
    const AC = typeof AudioContext !== 'undefined' ? AudioContext : (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : null);
    if (!AC || !config.audio) return false;
    webAudioCtx ||= new AC();
    if (webAudioCtx.state === 'suspended') await webAudioCtx.resume();
    if (!webAudioBuf) {
      const decoded = decodeAudioDataUrl(config.audio);
      if (!decoded) return false;
      webAudioBuf = await webAudioCtx.decodeAudioData(decoded.bytes.buffer.slice(0));
    }
    if (destroyed || !playing || muted || token !== soundGeneration) return true;
    stopWebAudio();
    t = currentClock(); resetClock();
    const src = webAudioCtx.createBufferSource();
    src.buffer = webAudioBuf;
    src.playbackRate.value = playbackRate;
    src.connect(webAudioCtx.destination);
    webAudioStartPos = t;
    webAudioStartCtx = webAudioCtx.currentTime;
    if (t < webAudioBuf.duration) src.start(0, t);
    webAudioSrc = src; webAudioActive = true; soundActive = true; status.textContent = '';
    return true;
  }
  async function startSound() {
    if (!audio || muted || !playing || destroyed) return;
    const token = ++soundGeneration;
    // The soundtrack is embedded at export; call play inside the click gesture.
    t = currentClock(); resetClock(); soundActive = false; stopWebAudio(); audio.pause();
    status.textContent = 'Starting sound...';
    try {
      if (useWebAudio) {
        if (await startWebAudio(token)) return;
      }
      if (!audio.src) { status.textContent = ''; return; }
      t = currentClock(); resetClock();
      try { audio.currentTime = t; } catch {}
      audio.muted = false; audio.playbackRate = playbackRate;
      await audio.play();
      if (destroyed || !playing || muted || token !== soundGeneration) {
        if (destroyed || !playing || muted) audio.pause();
        return;
      }
      soundActive = true; status.textContent = '';
    } catch (error) {
      if (destroyed || token !== soundGeneration) return;
      // Safari/WebKit rejects data:/blob: audio/mp4 on file:// in HTMLAudioElement with NotSupportedError; fall back to Web Audio API.
      if (error.name === 'NotSupportedError' || error.name === 'AbortError') {
        try {
          useWebAudio = true;
          if (await startWebAudio(token)) return;
        } catch (webErr) { error = webErr; }
      }
      soundActive = false; stopWebAudio(); audio.pause();
      status.textContent = error.name === 'NotAllowedError' ? 'Sound blocked. Click Unmute to retry.' : 'Sound failed: ' + error.message;
      // Return to muted playback so Unmute can retry from a user gesture.
      muted = true; audio.muted = true; syncControls();
    }
  }
  function pause() {
    if (playing) { t = currentClock(); resetClock(); }
    generation++; soundGeneration++; playing = false; soundActive = false;
    stopWebAudio(); audio?.pause(); cancelAnimationFrame(raf); button.textContent = 'Play'; syncControls();
  }
  async function play() {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (playing) return;
    generation++;
    if (t >= sc.duration) t = 0;
    resetClock(); playing = true; status.textContent = '';
    button.textContent = 'Pause'; draw(); raf = requestAnimationFrame(tick);
    if (!muted) await startSound();
  }
  function tick(now) {
    if (!playing || destroyed) return;
    t = currentClock(now);
    if (t >= sc.duration || (soundActive && !webAudioActive && audio?.ended)) {
      t = sc.duration; pause(); draw();
      if (options.loop) { t = 0; play().catch(() => {}); }
      else { button.textContent = 'Replay'; syncControls(); }
      return;
    }
    if (Math.floor(t * fps) !== lastFrame) draw();
    raf = requestAnimationFrame(tick);
  }
  function seek(seconds) {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (!Number.isFinite(seconds)) throw new Error('Seek time must be finite');
    t = clamp(seconds, 0, sc.duration); resetClock();
    if (webAudioActive && playing && !muted) { stopWebAudio(); startWebAudio(++soundGeneration).catch(() => {}); }
    else if (audio?.src) { try { audio.currentTime = t; } catch {} }
    draw();
  }
  function setMuted(value) {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (playing) { t = currentClock(); resetClock(); }
    muted = Boolean(value);
    if (audio) {
      audio.muted = muted;
      if (muted) { soundGeneration++; soundActive = false; stopWebAudio(); audio.pause(); status.textContent = ''; }
      else if (playing) startSound();
    }
    syncControls();
  }
  function setPlaybackRate(value) {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (!Number.isFinite(value) || value < .25 || value > 4) throw new Error('Playback speed must be between 0.25 and 4');
    if (playing) t = currentClock();
    playbackRate = value; origin = performance.now() / 1000 - t / playbackRate;
    if (webAudioActive && webAudioSrc && webAudioCtx) {
      webAudioStartPos = t; webAudioStartCtx = webAudioCtx.currentTime;
      webAudioSrc.playbackRate.value = playbackRate;
    }
    if (audio) audio.playbackRate = playbackRate;
    if (![...speed.options].some(option => Number(option.value) === value)) {
      const option = document.createElement('option'); option.value = String(value); option.textContent = value + 'x'; speed.appendChild(option);
    }
    speed.value = String(value); draw();
  }
  function destroy() {
    if (destroyed) return;
    pause(); destroyed = true;
    if (webAudioCtx) { try { webAudioCtx.close(); } catch {} webAudioCtx = null; webAudioBuf = null; }
    if (audioBlobUrl) { try { URL.revokeObjectURL(audioBlobUrl); } catch {} audioBlobUrl = null; }
    if (audio) { audio.removeAttribute('src'); audio.load(); }
    if (typeof disposeCalloutCache === 'function') disposeCalloutCache();
    if (typeof clearStaticLayers === 'function') clearStaticLayers();
    if (typeof _layers !== 'undefined') {
      for (let i = 0; i < _layers.length; i++) if (_layers[i]) { _layers[i].width = 0; _layers[i].height = 0; }
      _layers.length = 0;
    }
    canvas.width = 0; canvas.height = 0;
    box.remove();
  }
  button.onclick = () => { if (playing) pause(); else play().catch(() => {}); };
  slider.oninput = () => seek(Number(slider.value));
  muteButton.onclick = () => setMuted(!muted);
  speed.onchange = () => setPlaybackRate(Number(speed.value));
  if (options.playbackRate !== undefined) setPlaybackRate(options.playbackRate);
  host.appendChild(box); draw();
  if (options.autoplay !== false) play().catch(() => {});
  return { play, pause, seek, destroy, setMuted, setPlaybackRate, canvas, get muted() { return muted; }, get playbackRate() { return playbackRate; }, get currentTime() { return t; }, get duration() { return sc.duration; }, get playing() { return playing; } };
}

// Read attributes from the actual downloaded script; no scene identifier to copy or guess.
function sceneJavaScriptAutoMount(script, entry) {
  if (!script?.dataset.mount) return;
  const start = () => {
    script.scenePlayer = entry.mount(script.dataset.mount, {
      autoplay: script.dataset.autoplay !== 'false',
      loop: script.dataset.loop === 'true',
      controls: script.dataset.controls !== 'false',
      muted: script.dataset.muted !== 'false',
      playbackRate: script.dataset.speed === undefined ? 1 : Number(script.dataset.speed),
      m2: script.dataset.m2 === undefined ? undefined : script.dataset.m2 !== 'false',
      m3: script.dataset.m3 === undefined ? undefined : script.dataset.m3 !== 'false'
    });
    script.scenePlayer.catch(error => console.error('Could not embed scene ' + entry.id + ':', error));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
