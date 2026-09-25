// render.mjs: paint scenes in headless Chrome (studio.html) and compile them to video with ffmpeg.
//
//   node render.mjs --list                                         list the registered scenes
//   node render.mjs --scene=scene01_juggling --sheet=1,4,8,12 [--cols=3] [--w=640] [--out=out/check/a.jpg]   contact sheet
//   node render.mjs --scene=scene01_juggling --stills=5,12.5 [--out=out/stills]                            full-res PNGs
//   node render.mjs --scene=scene01_juggling --clip=6:12                                                   quick preview MP4 of a time range
//   node render.mjs --scene=scene01_juggling --frames [=a:b] [--workers=6] [--resume]                      all frames → out/<scene>/frames
//   node render.mjs --scene=scene01_juggling --encode                                                      frames (+ audio) → out/<scene>/<scene>.mp4
//   node render.mjs --scene=scene01_juggling --build                                                       --frames then --encode
//   node render.mjs --movie [--skip-build]                                                                 build every scene in REGISTRY.movie, join → out/movie.mp4
//   node render.mjs --modelsheet=jester_fester [--t=1.1]                                                   a character's model sheet (all poses) → out/check/
//   node render.mjs --doctor                                                                               check this machine: Node, Chrome, ffmpeg, fonts, a test render
//
// Options: --chrome=<path> (or $CHROME) · --fps=<n> overrides the scene fps · FFMPEG=<path> to use a specific ffmpeg.
import puppeteer from 'puppeteer-core';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cpus } from 'node:os';
import vm from 'node:vm';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const REGISTRY = vm.runInNewContext(readFileSync('registry.js', 'utf8') + ';REGISTRY');
const CHROME = args.chrome || process.env.CHROME || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(p => existsSync(p));
const FFMPEG = process.env.FFMPEG || (spawnSync('ffmpeg', ['-version']).status === 0 ? 'ffmpeg' : (await import('ffmpeg-static')).default);

const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(`${cmd} exited ${c}`)) : ok()); });
const times = s => String(s).split(',').map(Number);
const pad = i => String(i).padStart(5, '0');

if (args.list) {
  console.log('characters:', REGISTRY.characters.join(', '));
  console.log('locations: ', REGISTRY.locations.join(', '));
  console.log('scenes:    ', REGISTRY.scenes.join(', '));
  console.log('movie:     ', REGISTRY.movie.join(' → '));
  process.exit(0);
}

let browser = null;
async function openPage(sceneId, tag = '') {
  browser ??= await puppeteer.launch({
    executablePath: CHROME, headless: true, protocolTimeout: 0,
    args: ['--allow-file-access-from-files', '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'],
  });
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + `?render&scene=${sceneId}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  const info = await page.evaluate(id => window.setScene(id), sceneId);
  return { page, info };
}
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

// ---------- whole-scene pipeline ----------
async function renderFrames(id, range, { workers = Math.max(2, Math.min(8, cpus().length - 2)), resume = false } = {}) {
  const dir = `out/${id}/frames`;
  const { page: probe, info } = await openPage(id); await probe.close();
  const fps = +(args.fps || info.fps), n = Math.ceil(info.duration * fps - 1e-6);
  if (!resume && !range) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const [a, b] = range ? String(range).split(':').map(Number) : [0, info.duration];
  const first = Math.round(a * fps), last = Math.min(n - 1, Math.round(b * fps) - 1), todo = [];
  for (let i = first; i <= last; i++) { const f = `${dir}/f${pad(i)}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${id}: ${todo.length} frames to paint (${last - first + 1 - todo.length} already done), ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  await Promise.all(Array.from({ length: Math.min(workers, todo.length) }, async (_, w) => {
    const { page } = await openPage(id, '#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${dir}/f${pad(i)}.jpg`;
      writeFileSync(f + '.tmp', await frameOf(page, i / fps, 'image/jpeg', .95)); renameSync(f + '.tmp', f);
      if (++done % 48 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`  frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame  eta ${((todo.length - done) * el / done).toFixed(0)} s`);
      }
    }
    await page.close();
  }));
  return { info, fps };
}
async function encode(id) {
  const { page, info } = await openPage(id); await page.close();
  const fps = +(args.fps || info.fps), dir = `out/${id}/frames`, out = `out/${id}/${id}.mp4`;
  const n = readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
  if (!n) throw new Error(`no frames in ${dir}: run --frames first`);
  const audio = info.audio && existsSync(info.audio) ? ['-i', info.audio] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo'];
  if (info.audio && !existsSync(info.audio)) console.log(`(audio ${info.audio} not found, using silence)`);
  console.log(`encoding ${n} frames → ${out}`);
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${dir}/f%05d.jpg`, ...audio,
    '-map', '0:v', '-map', '1:a', '-t', String(n / fps), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', out]);
  console.log('wrote ' + out);
  return out;
}

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
      mkdirSync('out/check', { recursive: true });
      const t0 = Date.now(); writeFileSync('out/check/doctor.png', await frameOf(page, Math.min(9.5, info.duration / 2), 'image/png'));
      ok(true, `test frame rendered → out/check/doctor.png (${Date.now() - t0} ms)`);
    } catch (e) { ok(false, 'studio / render test failed: ' + e.message, 'open studio.html in Chrome and look at the error shown on the page'); }
  }
  if (browser) await browser.close();
  process.exit(0);
}

const sceneId = args.scene || REGISTRY.movie[0];
if (!args.movie && !args.modelsheet && !REGISTRY.scenes.includes(sceneId)) { console.error(`unknown scene "${sceneId}". Registered: ${REGISTRY.scenes.join(', ')}`); process.exit(1); }

if (args.modelsheet) {
  // A character's model sheet (every registered pose) as a PNG: --modelsheet=jester_fester [--t=1.1] [--out=…]
  const who = String(args.modelsheet), { page } = await openPage(REGISTRY.movie[0]), out = args.out || `out/check/modelsheet_${who}.png`;
  if (!REGISTRY.characters.includes(who)) { console.error(`unknown character "${who}". Registered: ${REGISTRY.characters.join(', ')}`); process.exit(1); }
  mkdirSync(dirname(out), { recursive: true });
  const url = await page.evaluate((who, t) => { paintFrame(t, t => drawModelSheet(CHARACTERS[who], t)); return X.canvas.toDataURL('image/png'); }, who, +(args.t || 1.1));
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(out);
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
  const { page, info } = await openPage(sceneId), fps = +(args.fps || info.fps);
  const [a, b] = String(args.clip).split(':').map(Number), out = args.out || `out/${sceneId}/clip_${a}-${b}.mp4`; mkdirSync(dirname(out), { recursive: true });
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((b - a) * fps), start = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await frameOf(page, a + i / fps, 'image/jpeg', .9);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(`wrote ${out}  (${((Date.now() - start) / n).toFixed(0)} ms/frame)`);
} else if (args.frames) {
  await renderFrames(sceneId, args.frames === true ? null : args.frames, { workers: args.workers && +args.workers, resume: !!args.resume });
} else if (args.encode) {
  await encode(sceneId);
} else if (args.build) {
  await renderFrames(sceneId, null, { workers: args.workers && +args.workers, resume: !!args.resume });
  await encode(sceneId);
} else if (args.movie) {
  const parts = [];
  for (const id of REGISTRY.movie) {
    if (!args['skip-build']) { await renderFrames(id, null, { workers: args.workers && +args.workers }); }
    parts.push(await encode(id));
  }
  mkdirSync('out', { recursive: true });
  writeFileSync('out/movie_list.txt', parts.map(p => `file '${resolve(p)}'`).join('\n'));
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'out/movie_list.txt', '-c', 'copy', '-movflags', '+faststart', 'out/movie.mp4']);
  console.log(`wrote out/movie.mp4 (${parts.length} scene${parts.length > 1 ? 's' : ''})`);
} else {
  console.log('nothing to do: see the usage at the top of render.mjs, or run with --list');
}
if (browser) await browser.close();
