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
browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
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
assert.deepEqual(await page.$eval('#game', e => [e.width, e.height]), [1920, 1280]);
assert.equal(await page.$eval('#game', e => e.getContext('2d').getImageData(1919, 1279, 1, 1).data[3]), 255);
const sprite = await page.evaluate(() => new Promise(resolve => {
  const ctx = document.getElementById('game').getContext('2d'), original = ctx.drawImage;
  ctx.drawImage = function(image, ...args) {
    ctx.drawImage = original;
    resolve({ cache: [image.width, image.height], display: args.slice(-2) });
    return original.call(this, image, ...args);
  };
}));
assert.deepEqual(sprite, { cache: [250, 250], display: [125, 125] });
await page.click('#start'); await page.keyboard.down('Space'); await page.keyboard.down('ArrowLeft');
await new Promise(r=>setTimeout(r,1500)); await page.keyboard.up('ArrowLeft'); await page.keyboard.up('Space');
await page.keyboard.press('KeyP');
assert.equal(await page.$eval('#overlay-title',e=>e.textContent),'On a little break.');
await page.click('#start');
assert.equal(await page.$eval('#overlay',e=>e.hidden),true);

await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await page.click('#restart');
await page.$eval('[data-control="fire"]', e=>e.dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,bubbles:true})));
await new Promise(r=>setTimeout(r,500));
await page.$eval('[data-control="fire"]', e=>e.dispatchEvent(new PointerEvent('pointerup',{pointerId:1,bubbles:true})));

assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), true);
assert.deepEqual(errors, []);
assert.deepEqual(requests, []);
console.log('Browser checks passed: standalone HTML/CSS/JS outside repository with networking blocked, studio link, rendering, start, keyboard controls, pause/resume, restart, mobile layout, touch input.');
} finally { await browser?.close(); server.kill(); await rm(portableDir, { recursive: true, force: true }); }
