// CPU Canvas benchmark, including raster completion and light/dark pixel comparisons.
// Run: node scripts/benchmark-paper-grain.mjs
import puppeteer from 'puppeteer-core';
import { readFile } from 'node:fs/promises';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--no-sandbox', '--disable-gpu'],
});
try {
  const page = await browser.newPage();
  await page.setContent('<canvas width="1920" height="1080"></canvas>');
  for (const file of ['engine/core.js', 'engine/timeline.js']) {
    await page.addScriptTag({ content: await readFile(file, 'utf8') });
  }
  const result = await page.evaluate(() => {
    const ctx = document.querySelector('canvas').getContext('2d');
    // Freeze the pre-optimization tile so rerunning after adoption still compares the same two algorithms.
    const multiply = _GRAIN_SEEDS.map(seed => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 256;
      const c = cv.getContext('2d'), data = c.createImageData(256, 256), r = mulberry(seed);
      for (let i = 0; i < data.data.length; i += 4) {
        const v = 255 - (r() < .5 ? r() * r() * 22 : 0);
        data.data[i] = data.data[i + 1] = v; data.data[i + 2] = v - 2; data.data[i + 3] = 255;
      }
      c.putImageData(data, 0, 0); return cv;
    });
    const alpha = multiply.map(tile => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 256;
      const c = cv.getContext('2d'), data = tile.getContext('2d').getImageData(0, 0, 256, 256);
      for (let i = 0; i < data.data.length; i += 4) {
        const a = 255 - data.data[i];
        data.data[i] = data.data[i + 1] = data.data[i + 2] = 0; data.data[i + 3] = a;
      }
      c.putImageData(data, 0, 0); return cv;
    });
    for (const [i, tile] of alpha.entries()) {
      const expected = tile.getContext('2d').getImageData(0, 0, 256, 256).data;
      const actual = _makeGrainTile(_GRAIN_SEEDS[i]).getContext('2d').getImageData(0, 0, 256, 256).data;
      if (expected.some((v, p) => v !== actual[p])) throw Error('Production grain differs from benchmark candidate');
    }
    const patterns = { multiply: multiply.map(cv => ctx.createPattern(cv, 'repeat')),
      'source-over': alpha.map(cv => ctx.createPattern(cv, 'repeat')) };
    const paint = (mode, frame, color, amount = 1) => {
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
      const ox = Math.floor(hash(frame * 3.17 + 1) * 256), oy = Math.floor(hash(frame * 7.31 + 5) * 256);
      ctx.save(); ctx.globalCompositeOperation = mode; ctx.globalAlpha = amount;
      ctx.translate(-ox, -oy); ctx.fillStyle = patterns[mode][frame & 3]; ctx.fillRect(ox, oy, W, H); ctx.restore();
    };
    const pixels = [];
    for (const color of ['#FFFDF8', '#1E1418', '#A3294B', '#467A60']) for (const amount of [0.25, 1]) {
      paint('multiply', 7, color, amount); const a = ctx.getImageData(0, 0, W, H).data;
      paint('source-over', 7, color, amount); const b = ctx.getImageData(0, 0, W, H).data;
      let sum = 0, max = 0;
      for (let i = 0; i < a.length; i++) { const d = Math.abs(a[i] - b[i]); sum += d; max = Math.max(max, d); }
      pixels.push({ color, amount, maxChannelDelta: max, meanChannelDelta: sum / a.length });
    }
    const times = { multiply: [], 'source-over': [] }, count = 32;
    // Alternate order to limit warm-up / thermal bias. Readback completes each batch's raster work.
    for (let round = 0; round < 9; round++) {
      const modes = round & 1 ? ['source-over', 'multiply'] : ['multiply', 'source-over'];
      for (const mode of modes) {
        const start = performance.now();
        for (let frame = 0; frame < count; frame++) paint(mode, frame, frame & 1 ? '#1E1418' : '#FFFDF8');
        ctx.getImageData(0, 0, W, H);
        const ms = (performance.now() - start) / count;
        if (round) times[mode].push(ms);
      }
    }
    const median = a => { const b = [...a].sort((x, y) => x - y); return (b[3] + b[4]) / 2; };
    const msPerFrame = Object.fromEntries(Object.entries(times).map(([mode, a]) => [mode, median(a)]));
    return { msPerFrame, speedup: msPerFrame.multiply / msPerFrame['source-over'], pixels, samples: times };
  });
  console.log(JSON.stringify({ chrome: await browser.version(), platform: process.platform, cpuCanvas: true, ...result }, null, 2));
} finally {
  await browser.close();
}
