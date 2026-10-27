import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import puppeteer from 'puppeteer-core';
const root = resolve('.');
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.html': 'text/html' })[extname(path)] || 'text/plain');
    res.end(await readFile(path));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/studio.html`);
  await page.waitForFunction(() => window.ready && window.studio);
  const results = await page.evaluate(async () => {
    studio.select('character', REGISTRY.characters[0]);
    if (!document.querySelector('#exp-svg')) throw Error('Missing SVG export button');
    const backdrop = document.querySelector('#bd');
    backdrop.value = 'transparent'; backdrop.dispatchEvent(new Event('change'));
    const entry = CHARACTERS[REGISTRY.characters[0]], pose = poseNames(entry)[0];
    for (const sheet of [false, true]) {
      paintFrame(0, t => sheet ? drawModelSheet(entry, t, { transparent: true })
        : drawCharacterView(entry, pose, t, { location: 'transparent' }), { transparent: true });
      if (X.getImageData(0, 0, 1, 1).data[3] !== 0) throw Error('Transparent backdrop has opaque pixels at the corner');
      const pixels = X.getImageData(0, 0, W, H).data;
      if (!pixels.some((v, i) => i % 4 === 3 && v > 0)) throw Error('Character is missing');
    }
    paintFrame(0, t => drawCharacterView(entry, pose, t));
    if (X.getImageData(0, 0, 1, 1).data[3] !== 255) throw Error('Paper backdrop is no longer opaque');
    const gif = await exportCharacterGif({ entry, pose, view: 'pose', backdrop: 'transparent', zoom: 1, duration: 1 });
    const url = URL.createObjectURL(gif), image = new Image();
    image.src = url; await image.decode();
    const probe = document.createElement('canvas'); probe.width = 960; probe.height = 540;
    const probeContext = probe.getContext('2d'); probeContext.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    if (probeContext.getImageData(0, 0, 1, 1).data[3] !== 0) throw Error('GIF lost transparency');
    const results = [];
    for (const [id, entry] of Object.entries(CHARACTERS)) {
      for (const pose of poseNames(entry)) {
        const before = X;
        const blob = exportCharacterSvg({ entry, pose, time: 1.25 });
        if (X !== before) throw Error('Drawing context was not restored');
        const text = await blob.text();
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        if (doc.querySelector('parsererror') || !doc.querySelector('path') || doc.querySelector('image') || /NaN|Infinity/.test(text)) throw Error(`Invalid vector SVG: ${id}/${pose}`);
        results.push(`${id}/${pose}`);
      }
      const sheet = await exportCharacterSvg({ entry, view: 'sheet' }).text();
      if (!sheet.includes('viewBox="0 0 1920 1080"')) throw Error('Missing viewBox');
    }
    return results;
  });
  assert.ok(results.length);
  console.log(`SVG export passed for ${results.length} character poses and all model sheets.`);
} finally {
  await browser?.close();
  await new Promise(r => server.close(r));
}
