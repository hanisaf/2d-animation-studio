// Integration check: real studio exports, then isolated players with networking blocked.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve('.'), output = resolve('out/javascript-export-test-' + Date.now());
await mkdir(output, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/plain' };
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!path.startsWith(root + '/') && !path.startsWith(root + '\\')) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    res.end(await readFile(path));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
let browser;
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const studio = await browser.newPage();
  const errors = []; studio.on('pageerror', e => errors.push(e.message));
  await studio.evaluateOnNewDocument(() => {
    window.testOfflineContexts = [];
    const NativeOffline = window.OfflineAudioContext;
    window.OfflineAudioContext = class extends NativeOffline { constructor(...args) { super(...args); testOfflineContexts.push(this); } };
  });
  await studio.goto(base + '/studio.html?scene=scene01_juggling', { waitUntil: 'networkidle0' });
  await studio.waitForFunction(() => window.ready && window.studio);
  assert.equal(await studio.locator('#exp-js-silent').wait().then(() => true), true);
  assert.equal(await studio.locator('#exp-js-sound').wait().then(() => true), true);
  const downloads = await studio.createCDPSession();
  await downloads.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  await studio.click('#exp-js-silent');
  await studio.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Saved scene01_juggling.silent.js'), { timeout: 120000 });
  let silent;
  for (let i = 0; i < 100; i++) {
    try { silent = await readFile(resolve(output, 'scene01_juggling.silent.js'), 'utf8'); break; }
    catch { await new Promise(r => setTimeout(r, 100)); }
  }
  assert.ok(silent?.includes('window.SafadiScenes'));
  assert.ok(!silent.includes('function buildSceneAudio'));
  await studio.click('#exp-js-sound');
  try { await studio.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Saved scene01_juggling.with-sound.js'), { timeout: 60000 }); }
  catch(error) { console.error(await studio.evaluate(() => ({ status: document.querySelector('#status').textContent, contexts: testOfflineContexts.map(c => ({state:c.state,currentTime:c.currentTime,length:c.length})) }))); throw error; }
  let sound;
  for (let i = 0; i < 100; i++) {
    try { sound = await readFile(resolve(output, 'scene01_juggling.with-sound.js'), 'utf8'); break; }
    catch { await new Promise(r => setTimeout(r, 100)); }
  }
  assert.ok(sound);
  assert.ok(!sound.includes('function buildSceneAudio'));
  assert.ok(sound.includes('data:audio/wav;base64,'));
  // Reproduce embedding in an actual index.html, including deferred head scripts.
  const embed = await browser.newPage();
  embed.on('pageerror', e => errors.push(e.message));
  await embed.setRequestInterception(true);
  embed.on('request', req => { if (/^https?:/.test(req.url())) req.abort(); else req.continue(); });
  await writeFile(resolve(output, 'index.html'), '<!doctype html><html><head><script defer src="scene01_juggling.silent.js" data-mount="#animation" data-autoplay="false"></script></head><body><div id="animation"></div></body></html>');
  await embed.goto(pathToFileURL(resolve(output, 'index.html')).href);
  await embed.waitForFunction(() => document.querySelector('#animation')?.firstChild?.shadowRoot?.querySelector('canvas'));
  assert.equal(await embed.evaluate(() => MyScene.id), 'scene01_juggling');
  await embed.evaluate(async () => { window.embedded = await document.querySelector('script').scenePlayer; embedded.seek(8); });
  assert.equal(await embed.evaluate(() => embedded.currentTime), 8);
  await embed.close();
  const expected = await studio.evaluate(() => { useScene('scene01_juggling'); drawFrame(8); return X.canvas.toDataURL(); });

  const page = await browser.newPage(), requests = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setRequestInterception(true);
  page.on('request', req => { if (/^(data:|blob:)/.test(req.url())) req.continue(); else { requests.push(req.url()); req.abort(); } });
  await page.setContent('<div id="first" style="width:640px"></div><div id="second" style="width:320px"></div>');
  await page.addScriptTag({ content: silent });
  const result = await page.evaluate(async () => {
    window.first = await SafadiScenes.scene01_juggling.mount('#first', { autoplay: false });
    window.second = await SafadiScenes.scene01_juggling.mount('#second', { autoplay: false });
    first.seek(8); second.seek(2);
    return { frame: first.canvas.toDataURL(), time: first.currentTime, second: second.currentTime, width: first.canvas.clientWidth, sounds: SafadiScenes.scene01_juggling.sound };
  });
  await writeFile(resolve(output, 'expected.png'), Buffer.from(expected.split(',')[1], 'base64'));
  await writeFile(resolve(output, 'actual.png'), Buffer.from(result.frame.split(',')[1], 'base64'));
  const diff = await page.evaluate(async (a, b) => {
    async function pixels(url) { const bin = atob(url.split(',')[1]); const bytes = Uint8Array.from(bin, c => c.charCodeAt(0)); const img = await createImageBitmap(new Blob([bytes], { type: 'image/png' })); const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0); return ctx.getImageData(0, 0, cv.width, cv.height).data; }
    const x = await pixels(a), y = await pixels(b); let count = 0, max = 0;
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) { count++; max = Math.max(max, Math.abs(x[i] - y[i])); }
    return { count, max };
  }, result.frame, expected);
  // Separate GPU canvas surfaces can differ by a few edge antialiasing samples.
  assert.ok(diff.count < 128 && diff.max <= 32, 'export must visually match studio: ' + JSON.stringify(diff));
  assert.equal(result.time, 8); assert.equal(result.second, 2); assert.equal(result.width, 640); assert.equal(result.sounds, false);
  const controls = await page.evaluate(() => {
    const root = document.querySelector('#first').firstChild.shadowRoot;
    const slider = root.querySelector('.seek'); slider.value = '5'; slider.dispatchEvent(new Event('input'));
    const speed = root.querySelector('.speed'); speed.value = '2'; speed.dispatchEvent(new Event('change'));
    return { time: first.currentTime, speed: first.playbackRate, muted: first.muted, disabled: root.querySelector('.mute').disabled, max: slider.max };
  });
  assert.deepEqual(controls, { time: 5, speed: 2, muted: true, disabled: true, max: '30' });
  await page.evaluate(() => { first.setPlaybackRate(1); first.seek(8); });
  await page.evaluate(() => first.play());
  await new Promise(r => setTimeout(r, 300));
  assert.ok(await page.evaluate(() => first.currentTime > 8 && second.currentTime === 2));
  await page.evaluate(() => { first.pause(); first.seek(9999); });
  assert.equal(await page.evaluate(() => first.currentTime === first.duration), true);
  await page.evaluate(() => { first.destroy(); first.destroy(); second.destroy(); });
  assert.equal(await page.evaluate(() => document.querySelector('#first').children.length), 0);
  await page.evaluate(async () => { window.looped = await SafadiScenes.scene01_juggling.mount('#first', { autoplay: false, loop: true }); looped.seek(looped.duration - .05); await looped.play(); });
  await page.waitForFunction(() => looped.playing && looped.currentTime < 1);
  await page.evaluate(() => looped.destroy());
  // Track the actual HTML audio element, with runtime synthesis unavailable.
  await page.evaluate(() => {
    const NativeAudio = window.Audio;
    window.Audio = function(...args) { window.lastAudio = new NativeAudio(...args); return window.lastAudio; };
    window.OfflineAudioContext = undefined;
  });
  console.log('Both bundles exported. Checking real audio playback...');
  await page.addScriptTag({ content: sound });
  await page.evaluate(async () => { window.voiced = await MyScene.mount('#first', { autoplay: false }); voiced.seek(8); });
  assert.equal(await page.evaluate(() => voiced.muted && lastAudio.muted), true);
  await page.click('#first >>> .play');
  await page.waitForFunction(() => voiced.playing && voiced.currentTime > 8.1);
  // Unmute DURING playback; merely advancing the visual clock is not evidence of sound.
  await page.click('#first >>> .mute');
  await page.waitForFunction(() => !voiced.muted && !lastAudio.muted && !lastAudio.paused && lastAudio.currentTime > 8.1 && document.querySelector('#first').firstChild.shadowRoot.querySelector('.status').textContent === '', { timeout: 5000 });
  const signal = await page.evaluate(() => {
    const bytes = Uint8Array.from(atob(lastAudio.src.split(',')[1]), c => c.charCodeAt(0));
    const view = new DataView(bytes.buffer); let peak = 0;
    for (let i = 44; i < bytes.length; i += 64) peak = Math.max(peak, Math.abs(view.getInt16(i, true)));
    return { peak, sampleRate: view.getUint32(24, true), channels: view.getUint16(22, true) };
  });
  assert.ok(signal.peak > 100, 'Embedded soundtrack must contain non-silent samples');
  assert.equal(signal.sampleRate, 48000); assert.equal(signal.channels, 2);
  await page.click('#first >>> .mute');
  assert.equal(await page.evaluate(() => voiced.playing && voiced.muted && lastAudio.muted && lastAudio.paused), true);
  await page.click('#first >>> .mute');
  await page.waitForFunction(() => !lastAudio.paused && !lastAudio.muted, { timeout: 5000 });
  await page.evaluate(() => voiced.setPlaybackRate(1.5));
  assert.equal(await page.evaluate(() => lastAudio.playbackRate), 1.5);
  assert.deepEqual(await page.evaluate(() => [...document.querySelector('#first').firstChild.shadowRoot.querySelector('.speed').options].map(option => option.textContent)), ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x']);
  await page.evaluate(() => { voiced.pause(); voiced.seek(voiced.duration - .1); });
  await page.click('#first >>> .play');
  await page.waitForFunction(() => !voiced.playing && voiced.currentTime === voiced.duration);
  await page.evaluate(() => voiced.destroy());

  // Verify the full-length dialysis lesson's exported audio, not only the short jester scene.
  console.log('Short-scene embedded audio and unmute passed. Exporting full lesson...');
  await studio.bringToFront();
  await studio.evaluate(() => {
    window.testOfflineContexts = [];
    const NativeOffline = window.OfflineAudioContext;
    window.OfflineAudioContext = class extends NativeOffline { constructor(...args) { super(...args); testOfflineContexts.push(this); } };
    studio.select('scene', 'scene17_access_recirculation');
  });
  await studio.click('#exp-js-sound');
  try {
    await studio.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Saved scene17_access_recirculation.with-sound.js'), { timeout: 60000 });
  } catch(error) {
    console.error(await studio.evaluate(() => ({ status: document.querySelector('#status').textContent, contexts: testOfflineContexts.map(c => ({ state: c.state, currentTime: c.currentTime, length: c.length })) })));
    throw error;
  }
  let lesson;
  for (let i = 0; i < 100; i++) {
    try { lesson = await readFile(resolve(output, 'scene17_access_recirculation.with-sound.js'), 'utf8'); break; }
    catch { await new Promise(r => setTimeout(r, 100)); }
  }
  assert.ok(lesson?.includes('data:audio/wav;base64,'));
  console.log('Full lesson soundtrack embedded. Checking playback...');
  await page.bringToFront();
  await page.addScriptTag({ content: lesson });
  await page.evaluate(async () => { window.lesson = await MyScene.mount('#first', { autoplay: false }); lesson.seek(32); });
  await page.click('#first >>> .play');
  await page.waitForFunction(() => lesson.playing && lesson.currentTime > 32.1);
  await page.click('#first >>> .mute');
  await page.waitForFunction(() => !lesson.muted && !lastAudio.muted && !lastAudio.paused && lastAudio.currentTime > 32.1 && document.querySelector('#first').firstChild.shadowRoot.querySelector('.status').textContent === '', { timeout: 5000 });
  assert.equal(await page.evaluate(() => Math.round(lastAudio.duration)), 168);
  await page.evaluate(() => lesson.destroy());
  const joins = await studio.evaluate(async () => {
    const sample = { duration: 24, music: { bpm: 100, tonic: 60, motif: [0,2,4,7], chords: [0,5], sections: [{ at:0, energy:.2 }, { at:12, energy:.4 }] },
      dialogue: [{ at:10.8, speaker:'sami', text:'This line crosses the rendering boundary without changing the voice.', cps:18 }] };
    const chunked = await buildSceneAudio(sample, 24000), full = await buildSceneAudioChunk(sample, 24000);
    let squared = 0, max = 0; const a=chunked.getChannelData(0), b=full.getChannelData(0);
    for (let i=0;i<a.length;i++) { const difference=Math.abs(a[i]-b[i]); squared+=difference*difference; max=Math.max(max,difference); }
    return { length:a.length, rms:Math.sqrt(squared/a.length), max };
  });
  assert.equal(joins.length, 24 * 24000);
  assert.ok(joins.rms < .006, 'Chunk boundaries must preserve music and speech: ' + JSON.stringify(joins));

  assert.deepEqual(requests, [], 'downloaded scripts must make no network requests');

  // Every scene must initialize and draw without depending on another scene's globals.
  const ids = await studio.evaluate(() => REGISTRY.scenes);
  for (const id of ids.filter(id => id !== 'scene01_juggling')) {
    const source = await studio.evaluate(async id => (await exportSceneJavaScript({ id })).text(), id);
    await page.addScriptTag({ content: source });
    assert.equal(await page.evaluate(() => MyScene.id), id);
    const times = await studio.evaluate(id => { const sc = SCENES[id]; return sc.shots.flatMap(([start], i) => { const end = sc.shots[i + 1]?.[0] ?? sc.duration; return [start, (start + end) / 2]; }).concat(sc.duration); }, id);
    await page.evaluate(async (id, times) => { const p = await MyScene.mount('#first', { autoplay: false }); for (const time of times) p.seek(time); p.destroy(); }, id, times);
  }
  const cancelled = await studio.evaluate(async () => { const c = new AbortController(); c.abort(); try { await exportSceneJavaScript({ id: 'scene01_juggling', signal: c.signal }); return false; } catch (e) { return e.name === 'AbortError'; } });
  assert.equal(cancelled, true);
  assert.deepEqual(errors, []);
  console.log('PASS: both export controls, downloaded files, frame parity, offline fonts, pre-rendered non-silent audio, unmute during playback for short and 168-second scenes, independent instances, playback/seek/end/destroy, all ' + ids.length + ' scenes, and cancellation.');
} finally {
  await browser?.close();
  await new Promise(r => server.close(r));
}
