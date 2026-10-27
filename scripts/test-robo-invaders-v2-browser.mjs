import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const portableDir = await mkdtemp(join(tmpdir(), 'robo-invaders-v2-'));
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
await page.setViewport({width:1200,height:1100});
await page.goto(`http://127.0.0.1:${port}/studio.html`, {waitUntil:'networkidle0'});
await page.waitForFunction(() => window.ready && window.studio);
await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}), page.click('a[href="games/robo-invaders-v2/index.html"]')]);
assert.deepEqual(errors, []);
// Copy only the three distribution files and block every network request.
const portableFile = join(portableDir, 'robo-invaders-v2.html');
await copyFile('games/robo-invaders-v2/index.html', portableFile);
for (const file of ['style.css', 'runtime.js']) await copyFile('games/robo-invaders-v2/' + file, join(portableDir, file));
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
await page.click('#start');
const beforeMove = await playerCenter();
await page.keyboard.down('Space'); await page.keyboard.down('ArrowLeft');
await new Promise(r=>setTimeout(r,1500)); await page.keyboard.up('ArrowLeft'); await page.keyboard.up('Space');
assert.ok(await playerCenter() < beforeMove - 200, 'keyboard moves Neptune left');
await page.keyboard.press('KeyP');
assert.equal(await page.$eval('#overlay-title',e=>e.textContent),'On a little break.');
await page.click('#start');
assert.equal(await page.$eval('#overlay',e=>e.hidden),true);

await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await page.click('#restart');
await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const beforeTouch = await playerCenter();
const touchSession = await page.createCDPSession();
const touchPoints = await page.$$eval('[data-control="right"], [data-control="fire"]', buttons => buttons.map((button,id) => {
  const r=button.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,id:id+1};
}));
await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints});
assert.equal(await page.$eval('[data-control="right"]', e=>e.classList.contains('active')),true);
assert.equal(await page.$eval('[data-control="fire"]', e=>e.classList.contains('active')),true);
await new Promise(r=>setTimeout(r,500));
await touchSession.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
assert.ok(await playerCenter() > beforeTouch + 150, 'touch moves Neptune while firing');
assert.equal(await page.$eval('[data-control="right"]',e=>e.classList.contains('active')),false);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), true);
await page.screenshot({path: '/tmp/robo-v2-mobile.png',fullPage:true});
await page.setViewport({width:1200,height:1000});
await page.click('#restart');
await page.screenshot({path: '/tmp/robo-v2-desktop.png',fullPage:true});
assert.deepEqual(errors, []);
assert.deepEqual(requests, []);
console.log('Browser checks passed: standalone HTML/CSS/JS outside repository with networking blocked, studio link, rendering, start, keyboard controls, pause/resume, restart, mobile layout, touch input.');
} finally { await browser?.close(); server.kill(); await rm(portableDir, { recursive: true, force: true }); }
