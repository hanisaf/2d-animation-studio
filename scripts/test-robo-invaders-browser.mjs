import { checkGameTouch } from './check-game-touch.mjs';
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const portableDir = await mkdtemp(join(tmpdir(), 'robo-invaders-'));
const probe = createServer();
await new Promise(r => probe.listen(0, '127.0.0.1', r));
const port = probe.address().port;
await new Promise(r => probe.close(r));
const server = spawn(process.execPath, ['serve.mjs', String(port)], { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
let browser;
try {
browser = await puppeteer.launch({ executablePath: process.env.CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.evaluateOnNewDocument(() => {
  window.playedSounds = [];
  const original = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function(...args) {
    window.playedSounds.push(this.type);
    return original.apply(this, args);
  };
});
await page.setViewport({width:1200,height:1100});
await page.goto(`http://127.0.0.1:${port}/studio.html`, {waitUntil:'networkidle0'});
await page.waitForFunction(() => window.ready && window.studio);
await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}), page.click('a[href="games/robo-invaders/index.html"]')]);
assert.deepEqual(errors, []);
// Copy only the three distribution files and block every network request.
const portableFile = join(portableDir, 'robo-invaders.html');
await copyFile('games/robo-invaders/index.html', portableFile);
for (const file of ['style.css', 'runtime.js']) await copyFile('games/robo-invaders/' + file, join(portableDir, file));
const requests = [];
await page.setRequestInterception(true);
page.on('request', request => {
  if (/^https?:/.test(request.url())) { requests.push(request.url()); request.abort(); }
  else request.continue();
});
await page.goto(pathToFileURL(portableFile).href, { waitUntil: 'load' });
assert.deepEqual(errors, []);
assert.deepEqual(requests, []);
assert.equal(await page.$eval('#state-label', e => e.textContent), 'READY WHEN YOU ARE');
const painted = await page.$eval('#game', e => [...e.getContext('2d').getImageData(0, 0, 1, 1).data]);
assert.equal(painted[3], 255);
assert.deepEqual(await page.$eval('#game', e => [e.width, e.height]), [1920, 1080]);
assert.equal(await page.$eval('#game', e => e.getContext('2d').getImageData(1919, 1079, 1, 1).data[3]), 255);
const sprite = await page.evaluate(() => new Promise(resolve => {
  const ctx = document.getElementById('game').getContext('2d'), original = ctx.drawImage;
  ctx.drawImage = function(image, ...args) {
    ctx.drawImage = original;
    resolve({ cache: [image.width, image.height], display: args.slice(-2) });
    return original.call(this, image, ...args);
  };
}));
assert.deepEqual(sprite, { cache: [220, 220], display: [110, 110] });
const playerCenter = () => page.$eval('#game', canvas => {
  const { width:w, height:h } = canvas, data = canvas.getContext('2d').getImageData(0,0,w,h).data;
  let sum = 0, count = 0;
  for (let y=Math.floor(h*.76); y<h*.95; y+=2) for (let x=0; x<w; x+=2) {
    const i=(y*w+x)*4;
    if (data[i]<110 && data[i+1]>110 && data[i+2]>170 && data[i+2]>data[i+1]*1.1) { sum+=x; count++; }
  }
  return sum/count;
});
assert.deepEqual(await page.$$eval('.hero-card span', options => options.map(o => o.textContent)),
  ['Neptune', 'Jester Fester', 'Professor Safadi', 'Dr Sami', 'Housam', 'Alma', 'Danny', 'Jenna']);
const heroImages = new Set();
for (const id of ['safadi', 'sami', 'housam', 'alma', 'danny', 'jenna', 'jester_fester', 'neptune']) {
  await page.click(`[data-hero="${id}"]`);
  assert.equal(await page.$eval('#hero-name', e => e.textContent), await page.$eval(`[data-hero="${id}"] span`, e => e.textContent));
  await page.evaluate(() => {
    window.heroFrames = [];
    const original = document.createElement.bind(document);
    document.createElement = (...args) => {
      const element = original(...args);
      if (args[0] === 'canvas') window.heroFrames.push(element);
      return element;
    };
    window.restoreCreateElement = () => { document.createElement = original; };
  });
  await page.click('#confirm-hero');
  const cache = await page.evaluate(() => {
    window.restoreCreateElement();
    const releasedPrevious = !window.previousHeroFrames || window.previousHeroFrames.every(frame => frame.width === 0 && frame.height === 0);
    window.previousHeroFrames = window.heroFrames;
    const hashes = new Set();
    const frames = window.heroFrames.map(frame => {
      const { width, height } = frame;
      const data = frame.getContext('2d').getImageData(0, 0, width, height).data;
      let clipped = false, hash = 0;
      for (let x = 0; x < width; x++) {
        if (data[x * 4 + 3] || data[((height - 1) * width + x) * 4 + 3]) clipped = true;
      }
      for (let y = 0; y < height; y++) {
        if (data[y * width * 4 + 3] || data[(y * width + width - 1) * 4 + 3]) clipped = true;
      }
      for (let i = 0; i < data.length; i += 16) hash = (Math.imul(hash, 31) + data[i] + data[i + 1] + data[i + 2] + data[i + 3]) | 0;
      hashes.add(hash);
      return { width, height, clipped, painted: data.some((value, i) => i % 4 === 3 && value > 0) };
    });
    window.heroFrames = [];
    return { frames, unique: hashes.size, releasedPrevious };
  });
  assert.ok(cache.releasedPrevious, `${id}: release the previous hero's pixel buffers`);
  assert.equal(cache.frames.length, 48, `${id}: cache the animation before play`);
  assert.ok(cache.unique > 1, `${id}: preserve animated artwork`);
  assert.ok(cache.frames.every(f => f.width === 448 && f.height === 448 && f.painted && !f.clipped), `${id}: cache contains complete artwork at 2× density`);
  const liveCurves = await page.evaluate(() => new Promise(resolve => {
    const context = document.getElementById('game').getContext('2d'), original = context.bezierCurveTo;
    let count = 0;
    context.bezierCurveTo = function(...args) { count++; return original.apply(this, args); };
    requestAnimationFrame(() => requestAnimationFrame(() => { context.bezierCurveTo = original; resolve(count); }));
  }));
  assert.equal(liveCurves, 0, `${id}: gameplay copies sprites without redrawing rig curves`);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await page.$eval('#fighter-select', e => e.hidden), true);
  heroImages.add(await page.$eval('#game', c => c.toDataURL()));
  await page.click('#restart');
  assert.ok(await page.evaluate(() => window.previousHeroFrames.every(frame => frame.width === 448 && frame.height === 448)), `${id}: restart reuses the existing cache`);
  await page.click('#choose-hero');
  assert.equal(await page.$eval('#fighter-select', e => e.hidden), false);
}
assert.equal(heroImages.size, 8, 'every hero renders different artwork');
await page.screenshot({path: '/tmp/robo-v2-hero-picker.png',fullPage:true});
await page.focus('[data-hero="neptune"]');
await page.keyboard.press('ArrowRight');
assert.equal(await page.$eval('.hero-card[aria-pressed="true"]', e => e.dataset.hero), 'jester_fester');
await page.keyboard.press('ArrowLeft');
assert.equal(await page.$eval('.hero-card[aria-pressed="true"]', e => e.dataset.hero), 'neptune');
await page.keyboard.press('Enter');
assert.equal(await page.$eval('#fighter-select', e => e.hidden), true);
await page.click('#choose-hero');
await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await page.screenshot({path: '/tmp/robo-v2-hero-picker-mobile.png',fullPage:true});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), true);
await page.click('[data-hero="jester_fester"]');
assert.equal(await page.$eval('#hero-name', e => e.textContent), 'Jester Fester');
await page.click('[data-hero="neptune"]');
await page.setViewport({width:1200,height:1100});
await page.click('#confirm-hero');
const beforeMove = await playerCenter();
await page.keyboard.down('Space'); await page.keyboard.down('ArrowLeft');
await new Promise(r=>setTimeout(r,1500)); await page.keyboard.up('ArrowLeft'); await page.keyboard.up('Space');
const sounds = await page.evaluate(() => window.playedSounds);
assert.ok(sounds.includes('square'), 'firing plays a shot sound');
assert.ok(sounds.includes('sawtooth'), 'robot collision plays a hit sound');
await page.click('#sound');
assert.equal(await page.$eval('#sound', e => e.getAttribute('aria-pressed')), 'false');
const soundCount = await page.evaluate(() => window.playedSounds.length);
await page.focus('#game'); await page.keyboard.down('Space');
await new Promise(r => setTimeout(r, 300)); await page.keyboard.up('Space');
assert.equal(await page.evaluate(() => window.playedSounds.length), soundCount, 'mute silences effects');
await page.click('#sound'); await page.focus('#game');
assert.ok(await playerCenter() < beforeMove - 200, 'keyboard moves Neptune left');
await page.keyboard.press('KeyP');
assert.equal(await page.$eval('#overlay-title',e=>e.textContent),'On a little break.');
await page.click('#start');
assert.equal(await page.$eval('#overlay',e=>e.hidden),true);

await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await page.click(await page.$eval('#fighter-select', e => e.hidden) ? '#restart' : '#confirm-hero');
await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const beforeTouch = await playerCenter();
const touchSession = await page.createCDPSession();
const touchPoints = await page.$$eval('.joystick, [data-control="fire"]', buttons => buttons.map((button,id) => {
  const r=button.getBoundingClientRect(); return {x:r.x+r.width*(button.classList.contains('joystick')?.8:.5),y:r.y+r.height/2,id:id+1};
}));
await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints});
assert.equal(await page.$eval('.joystick', e=>e.classList.contains('active')),true);
assert.equal(await page.$eval('[data-control="fire"]', e=>e.classList.contains('active')),true);
await new Promise(r=>setTimeout(r,700));
await touchSession.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
const afterTouch = await playerCenter();
assert.ok(afterTouch > beforeTouch + 150, `touch moves Neptune while firing: ${beforeTouch} → ${afterTouch}`);
assert.equal(await page.$eval('.joystick',e=>e.classList.contains('active')),false);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), true);
await page.screenshot({path: '/tmp/robo-v2-mobile.png',fullPage:true});
await checkGameTouch(page, 'robo-invaders');
await page.setViewport({width:1200,height:1000});
await page.click(await page.$eval('#fighter-select', e => e.hidden) ? '#restart' : '#confirm-hero');
await page.screenshot({path: '/tmp/robo-v2-desktop.png',fullPage:true});
assert.deepEqual(errors, []);
assert.deepEqual(requests, []);
console.log('Browser checks passed: standalone HTML/CSS/JS outside repository with networking blocked, studio link, rendering, start, keyboard controls, pause/resume, restart, mobile layout, touch input.');
} finally { await browser?.close(); server.kill(); await rm(portableDir, { recursive: true, force: true }); }
