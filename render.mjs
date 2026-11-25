// render.mjs: paint scenes in headless Chrome (studio.html) and compile them to video with ffmpeg.
//
//   node render.mjs --list                                         list the registered scenes
//   node render.mjs --scene=scene01_juggling --sheet=1,4,8,12 [--cols=3] [--w=640] [--out=out/check/a.jpg]   contact sheet
//   node render.mjs --scene=scene01_juggling --stills=5,12.5 [--out=out/stills]                            full-res PNGs
//   node render.mjs --scene=scene01_juggling --clip=6:12                                                   quick preview MP4 of a time range
//   node render.mjs --scene=scene01_juggling --frames [=a:b] [--workers=6] [--resume]                      all frames → out/<scene>/frames
//   node render.mjs --scene=scene01_juggling --encode                                                      frames (+ audio) → out/<scene>/<scene>.mp4
//   node render.mjs --scene=scene01_juggling --build [--workers=6] [--bitrate=14000000] [--encoder=webcodecs|ffmpeg]  parallel render → MP4
//   node render.mjs --movie [--skip-build]                                                                 build every scene in REGISTRY.movie, join → out/movie.mp4
//   node render.mjs --modelsheet=jester_fester [--t=1.1]                                                   a character's model sheet (excluding fight poses) → out/check/
//   node render.mjs --location=dces [--character=jester_fester] [--spot=…] [--cols=3] [--w=640] [--t=1] [--only=Aerial,Keeper] [--variant=Messy]   every camera preset of a set (or those whose name contains one of --only) on one sheet → out/check/
//   node render.mjs --doctor                                                                               check this machine: Node, Chrome, ffmpeg, fonts, a test render
//
// Options: --chrome=<path> (or $CHROME) · --fps=<n> overrides the scene fps · --bitrate=<bps> (WebCodecs, default 14000000) ·
//          --encoder=webcodecs|ffmpeg (default webcodecs with automatic piped-ffmpeg fallback) · --crf=<n> / --preset=<name> (ffmpeg encoder) ·
//          --no-m2 / --no-m3 disables M2/M3 visual FX · FFMPEG=<path> to use a specific ffmpeg.
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { createReadStream, createWriteStream, mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync, rmSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { cpus } from 'node:os';
import { REGISTRY, SERIES } from './scripts/registry.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const CHROME = args.chrome || process.env.CHROME || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(p => existsSync(p));
const FFMPEG = process.env.FFMPEG || (spawnSync('ffmpeg', ['-version']).status === 0 ? 'ffmpeg' : (await import('ffmpeg-static')).default);

const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(`${cmd} exited ${c}`)) : ok()); });
const times = s => String(s).split(',').map(Number);
const pad = i => String(i).padStart(5, '0');

if (args.list) {
  console.log('characters:', REGISTRY.characters.join(', '));
  console.log('locations: ', REGISTRY.locations.join(', '));
  for (const sid of REGISTRY.series) console.log(`series:     ${sid} (${SERIES[sid].title} · ${SERIES[sid].category}): ${SERIES[sid].scenes.join(', ')}`);
  console.log('movie:     ', REGISTRY.movie.join(' → '));
  process.exit(0);
}

// ---------- ephemeral local HTTP server for static assets + binary uploads (zero Base64/CDP overhead) ----------
const ROOT = resolve('.');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2',
};
const uploadSlots = new Map(); // token -> { file, atomic } | { stream }
let nextSlot = 1, server = null, baseUrl = null;
function regFileSlot(file, atomic = false) {
  const token = String(nextSlot++);
  uploadSlots.set(token, { file, atomic });
  return { token, url: `${baseUrl}/__upload?slot=${token}` };
}
function regStreamSlot(stream) {
  const token = String(nextSlot++);
  uploadSlots.set(token, { stream });
  return { token, url: `${baseUrl}/__upload?slot=${token}` };
}
function freeSlot(token) { uploadSlots.delete(token); }

async function ensureServer() {
  if (server) return baseUrl;
  server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    if (req.method === 'POST' && u.pathname === '/__upload') {
      const slot = uploadSlots.get(u.searchParams.get('slot'));
      if (!slot) { res.writeHead(404).end('unknown slot'); return; }
      if (slot.stream) {
        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('error', e => { res.writeHead(500).end(e.message); });
        req.on('end', () => {
          const buf = Buffer.concat(chunks);
          const done = () => { res.writeHead(200).end('ok'); };
          if (slot.stream.write(buf)) done();
          else slot.stream.once('drain', done);
        });
        return;
      }
      mkdirSync(dirname(slot.file), { recursive: true });
      const dest = slot.atomic ? slot.file + '.tmp' : slot.file;
      const ws = createWriteStream(dest);
      let aborted = false;
      const abortUpload = () => {
        if (aborted) return;
        aborted = true;
        ws.destroy();
        if (slot.atomic) try { rmSync(dest, { force: true }); } catch {}
      };
      req.on('aborted', abortUpload);
      req.on('error', abortUpload);
      req.pipe(ws);
      ws.on('finish', () => {
        if (aborted || !req.complete) {
          if (slot.atomic) try { rmSync(dest, { force: true }); } catch {}
          if (!res.writableEnded) res.writeHead(499).end('upload aborted');
          return;
        }
        try { if (slot.atomic) renameSync(dest, slot.file); res.writeHead(200).end('ok'); }
        catch (e) { res.writeHead(500).end(e.message); }
      });
      ws.on('error', e => { if (!res.writableEnded) res.writeHead(500).end(e.message); });
      return;
    }
    const p = decodeURIComponent(u.pathname);
    let f = normalize(join(ROOT, p));
    if (f !== ROOT && !f.startsWith(ROOT + sep)) { res.writeHead(403).end('forbidden'); return; }
    let st;
    try {
      st = statSync(f);
      if (st.isDirectory()) { f = join(f, 'index.html'); st = statSync(f); }
      if (!st.isFile()) throw 0;
    } catch { res.writeHead(404).end('not found: ' + p); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(f).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-store' });
    createReadStream(f).pipe(res);
  });
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  return baseUrl;
}

let browser = null, browserLaunch = null, lastBrowserExit = null;
async function ensureBrowser() {
  if (browser?.connected) return browser;
  if (!browserLaunch) {
    lastBrowserExit = null;
    browserLaunch = puppeteer.launch({
      executablePath: CHROME, headless: true, protocolTimeout: 0,
      args: ['--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'],
    }).then(b => {
      browser = b;
      const proc = b.process?.();
      if (proc) proc.once('exit', (code, signal) => { lastBrowserExit = { code, signal }; });
      b.once('disconnected', () => { if (browser === b) browser = null; });
      return b;
    }).finally(() => { browserLaunch = null; });
  }
  return browserLaunch;
}
function isBrowserDisconnectError(e) {
  if (!browser?.connected) return true;
  if (e?.name === 'ConnectionClosedError' || e?.name === 'TargetCloseError') return true;
  return /Connection closed|Target closed|Session closed|Browser has disconnected/i.test(e?.message || '');
}
async function safeClosePage(page) {
  if (!page || page.isClosed?.()) return;
  try { await page.close(); } catch {}
}
async function openPage(sceneId, tag = '') {
  await ensureServer();
  const b = await ensureBrowser();
  const page = await b.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  const fxQ = [
    (args['no-m2'] || args.m2 === '0' || args.m2 === 'false') ? '&m2=0' : '',
    (args['no-m3'] || args.m3 === '0' || args.m3 === 'false') ? '&m3=0' : '',
  ].join('');
  await page.goto(`${baseUrl}/studio.html?render&scene=${sceneId}${fxQ}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  const info = await page.evaluate(id => window.setScene(id), sceneId);
  return { page, info };
}
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

async function soundtrackPath(page, info, id) {
  if (!info.synthesizedAudio) return info.audio && existsSync(info.audio) ? info.audio : null;
  console.log(`synthesizing soundtrack for ${id}`);
  const path = `out/${id}/soundtrack.wav`;
  mkdirSync(dirname(path), { recursive: true });
  const slot = regFileSlot(path, true);
  try {
    const ok = await page.evaluate((sceneId, url) => window.uploadAudioWav(sceneId, url), id, slot.url);
    return ok ? path : null;
  } finally { freeSlot(slot.token); }
}

function splitChunks(startFrame, endFrame, maxWorkers, maxChunkFrames = Infinity) {
  const total = endFrame - startFrame;
  const minByWorkers = Math.min(maxWorkers, Math.ceil(total / 24));
  const minBySize = Number.isFinite(maxChunkFrames) ? Math.ceil(total / maxChunkFrames) : 1;
  const count = Math.max(1, minByWorkers, minBySize);
  const chunks = [];
  for (let w = 0; w < count; w++) {
    const a = startFrame + Math.floor(w * total / count);
    const b = startFrame + Math.floor((w + 1) * total / count);
    if (b > a) chunks.push({ w, startFrame: a, endFrame: b });
  }
  return chunks;
}

async function muxParts({ parts, sound, info, duration, out, audioStart = 0 }) {
  mkdirSync(dirname(out), { recursive: true });
  const videoIn = parts.length === 1
    ? ['-i', parts[0]]
    : (() => {
        const listPath = join(dirname(parts[0]), 'list.txt');
        writeFileSync(listPath, parts.map(p => `file '${resolve(p)}'`).join('\n'));
        return ['-f', 'concat', '-safe', '0', '-i', listPath];
      })();
  const audioIn = sound
    ? [...(audioStart > 0 ? ['-ss', String(audioStart)] : []), '-i', sound]
    : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo'];
  if (!sound && info?.audio) console.log(`(audio ${info.audio} not found, using silence)`);
  await run(FFMPEG, [
    '-y', '-loglevel', 'error', ...videoIn, ...audioIn,
    '-map', '0:v', '-map', '1:a', '-t', String(duration),
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
    '-movflags', '+faststart', out,
  ]);
}

// ---------- fast parallel build (WebCodecs default + automatic piped-ffmpeg fallback, zero disk JPEGs) ----------
async function buildScene(id, {
  workers = Math.max(2, Math.min(8, cpus().length - 2)),
  bitrate = +(args.bitrate || 14000000),
  encoder = args.encoder || 'webcodecs',
  crf = String(args.crf || 17),
  preset = String(args.preset || 'medium'),
  startSec = 0,
  endSec = null,
  out = `out/${id}/${id}.mp4`,
} = {}) {
  const start = Date.now();
  const { page: page0, info } = await openPage(id, '#0');
  const fps = +(args.fps || info.fps);
  const totalSceneFrames = Math.ceil(info.duration * fps - 1e-6);
  const startFrame = Math.max(0, Math.round(startSec * fps));
  const endFrame = endSec == null ? totalSceneFrames : Math.min(totalSceneFrames, Math.round(endSec * fps));
  const nFrames = endFrame - startFrame;
  if (nFrames <= 0) { await safeClosePage(page0); throw new Error(`invalid frame range for ${id}`); }

  const codec = encoder === 'ffmpeg' ? null : await page0.evaluate((fps, bitrate) => window.probeVideoCodec({ fps, bitrate }), fps, bitrate);
  const useWebCodecs = !!codec;
  if (encoder !== 'ffmpeg' && !useWebCodecs) console.log(`${id}: WebCodecs H.264 unavailable, falling back to piped ffmpeg`);

  const maxChunkFrames = Math.max(48, Math.round(fps * 10));
  const chunks = splitChunks(startFrame, endFrame, workers, maxChunkFrames);
  const partsDir = `out/${id}/parts_${Date.now()}`;
  mkdirSync(partsDir, { recursive: true });
  const parts = chunks.map(c => `${partsDir}/part_${String(c.w).padStart(3, '0')}.mp4`);
  const poolSize = Math.max(1, Math.min(workers, chunks.length));
  console.log(`${id}: building ${nFrames} frames (${poolSize} worker${poolSize > 1 ? 's' : ''}, ${chunks.length} chunk${chunks.length > 1 ? 's' : ''}, ${useWebCodecs ? `WebCodecs ${codec}` : `piped libx264 crf=${crf}`})`);

  const isPartReady = idx => existsSync(parts[idx]) && statSync(parts[idx]).size > 0;
  let sound = info.synthesizedAudio ? null : (info.audio && existsSync(info.audio) ? info.audio : null);
  let soundDone = !info.synthesizedAudio;
  let initialPage = page0;
  let stalledRetries = 0;
  try {
    while (true) {
      const pending = chunks.map((_, idx) => idx).filter(idx => !isPartReady(idx));
      if (!pending.length && soundDone) break;
      const beforeDone = chunks.length - pending.length + (soundDone ? 1 : 0);
      let cursor = 0, needAudio = !soundDone;
      const activeWorkers = Math.max(1, Math.min(workers, pending.length + (needAudio ? 1 : 0)));
      const results = await Promise.allSettled(Array.from({ length: activeWorkers }, async (_, w) => {
        let page = null;
        if (w === 0 && initialPage && !initialPage.isClosed?.() && browser?.connected) {
          page = initialPage;
          initialPage = null;
        } else {
          page = (await openPage(id, '#' + w)).page;
        }
        try {
          if (w === 0 && needAudio) {
            needAudio = false;
            sound = await soundtrackPath(page, info, id);
            soundDone = true;
          }
          while (cursor < pending.length) {
            const idx = pending[cursor++];
            const ch = chunks[idx], partPath = parts[idx];
            if (useWebCodecs) {
              const slot = regFileSlot(partPath, true);
              try {
                await page.evaluate(
                  (opts, url) => window.uploadVideoRange(opts, url),
                  { id, startFrame: ch.startFrame, endFrame: ch.endFrame, fps, bitrate, codec },
                  slot.url,
                );
              } finally { freeSlot(slot.token); }
            } else {
              const tmpPath = partPath + '.tmp';
              const ff = spawn(FFMPEG, [
                '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
                '-c:v', 'libx264', '-preset', preset, '-crf', crf, '-pix_fmt', 'yuv420p', tmpPath,
              ], { stdio: ['pipe', 'inherit', 'inherit'] });
              const ffDone = new Promise((ok, bad) => { ff.on('error', bad); ff.on('close', c => c ? bad(new Error(`ffmpeg worker #${w} exited ${c}`)) : ok()); });
              const slot = regStreamSlot(ff.stdin);
              try {
                for (let f = ch.startFrame; f < ch.endFrame; f++) {
                  await page.evaluate((t, url) => window.renderBlobTo(t, url, 'image/jpeg', .95), f / fps, slot.url);
                }
              } catch (e) {
                freeSlot(slot.token); ff.stdin.end();
                await ffDone.catch(() => {});
                rmSync(tmpPath, { force: true });
                throw e;
              } finally { freeSlot(slot.token); if (!ff.stdin.writableEnded) ff.stdin.end(); }
              await ffDone;
              renameSync(tmpPath, partPath);
            }
          }
        } finally {
          await safeClosePage(page);
        }
      }));
      const failed = results.find(r => r.status === 'rejected');
      if (failed) {
        const err = failed.reason;
        if (initialPage) { await safeClosePage(initialPage); initialPage = null; }
        const remaining = chunks.filter((_, idx) => !isPartReady(idx)).length;
        const afterDone = chunks.length - remaining + (soundDone ? 1 : 0);
        if (!isBrowserDisconnectError(err)) throw err;
        if (remaining === 0 && soundDone) break;
        if (afterDone <= beforeDone && ++stalledRetries > 1) {
          const exitNote = lastBrowserExit ? ` (exit code=${lastBrowserExit.code}, signal=${lastBrowserExit.signal})` : '';
          throw new Error(`browser disconnected without progress${exitNote}: ${err.message}. Try --workers=4 or --chrome="<path to Edge/Chromium>"`);
        }
        if (afterDone > beforeDone) stalledRetries = 0;
        const exitNote = lastBrowserExit ? ` (code=${lastBrowserExit.code}${lastBrowserExit.signal ? `, signal=${lastBrowserExit.signal}` : ''})` : '';
        const todo = [remaining && `${remaining} chunk${remaining > 1 ? 's' : ''}`, !soundDone && 'soundtrack'].filter(Boolean).join(' + ');
        console.log(`${id}: browser exited mid-build${exitNote}, relaunching for remaining ${todo}…`);
        if (browser) { try { await browser.close(); } catch {} browser = null; }
      }
    }

    await muxParts({ parts, sound, info, duration: nFrames / fps, out, audioStart: startFrame / fps });
    const sec = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`wrote ${out}  (${sec} s, ${((Date.now() - start) / nFrames).toFixed(1)} ms/frame)`);
    return out;
  } finally {
    if (initialPage) await safeClosePage(initialPage);
    rmSync(partsDir, { recursive: true, force: true });
  }
}

// ---------- legacy frame-by-frame pipeline (--frames / --resume / --encode) ----------
async function renderFrames(id, range, { workers = Math.max(2, Math.min(8, cpus().length - 2)), resume = false } = {}) {
  const dir = `out/${id}/frames`;
  const { page: page0, info } = await openPage(id, '#0');
  const fps = +(args.fps || info.fps), n = Math.ceil(info.duration * fps - 1e-6);
  if (!resume && !range) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const [a, b] = range ? String(range).split(':').map(Number) : [0, info.duration];
  const first = Math.round(a * fps), last = Math.min(n - 1, Math.round(b * fps) - 1), todo = [];
  for (let i = first; i <= last; i++) { const f = `${dir}/f${pad(i)}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${id}: ${todo.length} frames to paint (${last - first + 1 - todo.length} already done), ${workers} workers`);
  if (!todo.length) { await safeClosePage(page0); return { info, fps }; }
  let next = 0, done = 0; const start = Date.now();
  const count = Math.min(workers, todo.length);
  await Promise.all(Array.from({ length: count }, async (_, w) => {
    const page = w === 0 ? page0 : (await openPage(id, '#' + w)).page;
    try {
      while (next < todo.length) {
        const i = todo[next++], f = `${dir}/f${pad(i)}.jpg`;
        const slot = regFileSlot(f, true);
        try {
          await page.evaluate((t, url) => window.renderBlobTo(t, url, 'image/jpeg', .95), i / fps, slot.url);
        } finally { freeSlot(slot.token); }
        if (++done % 48 === 0 || done === todo.length) {
          const el = (Date.now() - start) / 1000;
          console.log(`  frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame  eta ${((todo.length - done) * el / done).toFixed(0)} s`);
        }
      }
    } finally { await safeClosePage(page); }
  }));
  return { info, fps };
}
async function encode(id) {
  const { page, info } = await openPage(id);
  const fps = +(args.fps || info.fps), dir = `out/${id}/frames`, out = `out/${id}/${id}.mp4`;
  const n = readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
  if (!n) { await safeClosePage(page); throw new Error(`no frames in ${dir}: run --frames first`); }
  const sound = await soundtrackPath(page, info, id);
  await safeClosePage(page);
  const audio = sound ? ['-i', sound] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo'];
  if (!sound && info.audio) console.log(`(audio ${info.audio} not found, using silence)`);
  console.log(`encoding ${n} frames → ${out}`);
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${dir}/f%05d.jpg`, ...audio,
    '-map', '0:v', '-map', '1:a', '-t', String(n / fps), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', out]);
  console.log('wrote ' + out);
  return out;
}

try {
  if (args.doctor) {
    const ok = (good, msg, fix = '') => console.log(`${good ? '✔' : '✘'} ${msg}${!good && fix ? `\n    → ${fix}` : ''}`);
    const major = +process.versions.node.split('.')[0];
    ok(major >= 18, `Node.js ${process.versions.node}`, 'install Node.js 18 or newer (https://nodejs.org)');
    ok(existsSync('node_modules/puppeteer-core'), 'npm packages installed', 'run: npm install');
    ok(!!CHROME && existsSync(CHROME), `Chrome: ${CHROME || 'not found'}`, 'install Google Chrome, or pass --chrome=<path> / set CHROME=<path>');
    const ff = spawnSync(FFMPEG, ['-version']); ok(ff.status === 0, `ffmpeg: ${FFMPEG} (${String(ff.stdout).split('\n')[0].split(' ').slice(0, 3).join(' ')})`, 'run: npm install (ffmpeg-static), or install ffmpeg / set FFMPEG=<path>');
    if (CHROME && existsSync(CHROME)) {
      try {
        const id = REGISTRY.movie[0], { page, info } = await openPage(id);
        ok(true, `studio loads · ${REGISTRY.characters.length} characters, ${REGISTRY.locations.length} locations, ${REGISTRY.scenes.length} scenes · "${info.id}" is ${info.duration}s @ ${info.fps} fps`);
        const fonts = await page.evaluate(() => [document.fonts.check('600 50px Fredoka'), document.fonts.check('50px "Luckiest Guy"')]);
        ok(fonts.every(Boolean), 'web fonts (Fredoka, Luckiest Guy) loaded', 'fonts come from Google Fonts: connect to the internet (offline renders fall back to Chalkboard SE / system fonts)');
        const codec = await page.evaluate(() => window.probeVideoCodec());
        ok(!!codec, `WebCodecs H.264 encoder: ${codec || 'unavailable (will fall back to piped ffmpeg)'}`, 'use Google Chrome for hardware/WebCodecs acceleration');
        mkdirSync('out/check', { recursive: true });
        const t0 = Date.now(); writeFileSync('out/check/doctor.png', await frameOf(page, Math.min(9.5, info.duration / 2), 'image/png'));
        ok(true, `test frame rendered → out/check/doctor.png (${Date.now() - t0} ms)`);
      } catch (e) { ok(false, 'studio / render test failed: ' + e.message, 'open studio.html in Chrome and look at the error shown on the page'); }
    }
  } else {
    const sceneId = args.scene || REGISTRY.movie[0];
    if (!args.movie && !args.modelsheet && !args.location && !REGISTRY.scenes.includes(sceneId)) { console.error(`unknown scene "${sceneId}". Registered: ${REGISTRY.scenes.join(', ')}`); process.exitCode = 1; }
    else if (args.location) {
      const id = String(args.location), out = args.out || `out/check/location_${id}.jpg`;
      if (!REGISTRY.locations.includes(id)) { console.error(`unknown location "${id}". Registered: ${REGISTRY.locations.join(', ')}`); process.exitCode = 1; }
      else {
        const { page } = await openPage(REGISTRY.movie[0]); mkdirSync(dirname(out), { recursive: true });
        await page.evaluate((id, who) => Promise.all([loadAsset('location', id), who && loadAsset('character', who)]), id, args.character || null);
        const url = await page.evaluate((id, o) => {
          const loc = LOCATIONS[id], cams = Object.entries(loc.cameras || {}).filter(([n]) => !o.only || o.only.some(q => n.toLowerCase().includes(q.toLowerCase()))), h = Math.round(o.w * 9 / 16), sc = document.createElement('canvas');
          sc.width = o.cols * o.w; sc.height = Math.ceil(cams.length / o.cols) * h; const c = sc.getContext('2d');
          cams.forEach(([name, cam], i) => {
            paintFrame(o.t, t => drawLocationView(loc, cam, t, { character: o.character, spot: o.spot, variant: o.variant }));
            const x = (i % o.cols) * o.w, y = Math.floor(i / o.cols) * h;
            c.drawImage(X.canvas, x, y, o.w, h); c.font = '16px sans-serif'; c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, c.measureText(name).width + 12, 24); c.fillStyle = '#fff'; c.fillText(name, x + 6, y + 17);
          });
          return sc.toDataURL('image/jpeg', .88);
        }, id, { cols: +(args.cols || 3), w: +(args.w || 640), t: +(args.t || 1), character: args.character || null, spot: args.spot || null, variant: args.variant || null, only: args.only ? String(args.only).split(',') : null });
        writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
        console.log(out);
      }
    } else if (args.modelsheet) {
      const who = String(args.modelsheet), out = args.out || `out/check/modelsheet_${who}.png`;
      if (!REGISTRY.characters.includes(who)) { console.error(`unknown character "${who}". Registered: ${REGISTRY.characters.join(', ')}`); process.exitCode = 1; }
      else {
        const { page } = await openPage(REGISTRY.movie[0]); mkdirSync(dirname(out), { recursive: true });
        await page.evaluate(who => loadAsset('character', who), who);
        const url = await page.evaluate((who, t) => { paintFrame(t, t => drawModelSheet(CHARACTERS[who], t)); return X.canvas.toDataURL('image/png'); }, who, +(args.t || 1.1));
        writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
        console.log(out);
      }
    } else if (args.sheet) {
      const { page } = await openPage(sceneId), out = args.out || `out/check/${sceneId}.jpg`; mkdirSync(dirname(out), { recursive: true });
      const { url, ms } = await page.evaluate((ts, c, w) => window.renderSheet(ts, c, w), times(args.sheet), +(args.cols || 3), +(args.w || 640));
      writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
      console.log(`${out}  ms/frame: ${ms.join(' ')}`);
    } else if (args.stills) {
      const { page } = await openPage(sceneId), out = args.out || `out/${sceneId}/stills`; mkdirSync(out, { recursive: true });
      for (const s of times(args.stills)) {
        const t0 = Date.now(), f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`;
        writeFileSync(f, await frameOf(page, s, 'image/png')); console.log(`${f}  ${Date.now() - t0} ms`);
      }
    } else if (args.clip) {
      const [a, b] = String(args.clip).split(':').map(Number);
      if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b <= a) throw new Error(`invalid clip range ${args.clip}`);
      const out = args.out || `out/${sceneId}/clip_${a}-${b}.mp4`;
      await buildScene(sceneId, {
        workers: args.workers ? +args.workers : Math.min(4, Math.max(1, cpus().length - 2)),
        bitrate: +(args.bitrate || 10000000),
        encoder: args.encoder || 'webcodecs',
        crf: String(args.crf || 20),
        preset: String(args.preset || 'veryfast'),
        startSec: a, endSec: b, out,
      });
    } else if (args.frames) {
      await renderFrames(sceneId, args.frames === true ? null : args.frames, { workers: args.workers && +args.workers, resume: !!args.resume });
    } else if (args.encode) {
      await encode(sceneId);
    } else if (args.build) {
      await buildScene(sceneId, { workers: args.workers && +args.workers });
    } else if (args.movie) {
      const parts = [];
      for (const id of REGISTRY.movie) {
        parts.push(args['skip-build'] ? `out/${id}/${id}.mp4` : await buildScene(id, { workers: args.workers && +args.workers }));
      }
      mkdirSync('out', { recursive: true });
      writeFileSync('out/movie_list.txt', parts.map(p => `file '${resolve(p)}'`).join('\n'));
      await run(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'out/movie_list.txt', '-c', 'copy', '-movflags', '+faststart', 'out/movie.mp4']);
      console.log(`wrote out/movie.mp4 (${parts.length} scene${parts.length > 1 ? 's' : ''})`);
    } else {
      console.log('nothing to do: see the usage at the top of render.mjs, or run with --list');
    }
  }
} finally {
  if (browser) try { await browser.close(); } catch {}
  if (server) await new Promise(ok => server.close(ok));
}
