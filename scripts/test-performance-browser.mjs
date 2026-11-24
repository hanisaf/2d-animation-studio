// Cache correctness, focus-pull determinism, set SVG fallback, and CPU frame timings.
// Optional local before/after comparison: --baseline=out/performance-baseline
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = resolve('.'), output = resolve('out/performance-test');
const baseline = process.argv.find(a => a.startsWith('--baseline='))?.slice(11);
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css' })[extname(path)] || 'application/octet-stream');
    res.end(await readFile(path));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/studio.html?render`);
  await page.waitForFunction(() => window.ready);
  const checks = await page.evaluate(async () => {
    const check = (condition, message) => { if (!condition) throw Error(message); };
    await requireScene('scene01_juggling'); useScene('scene01_juggling');
    const canvas = document.querySelector('#out');
    const image = () => canvas.toDataURL();
    let calls = 0;
    const painter = () => { calls++; X.fillStyle = '#A3294B'; X.fillRect(200, 200, 300, 180); };
    const cached = (dx = 0, blur = 0) => paintFrame(0, () => {
      X.translate(dx, 0); staticLayer('test', painter, { blur });
    }, { transparent: true });
    cached(); const first = image(); cached();
    check(calls === 1 && first === image(), 'Static cache hit must skip painter and preserve pixels');
    cached(120); const shifted = image();
    check(calls === 2 && first !== shifted, 'Transform change must invalidate cache');
    paintFrame(0, () => { X.translate(120, 0); painter(); }, { transparent: true });
    check(image() === shifted, 'Cached translated layer must match uncached drawing');
    cached(0, 1.5); check(_STATIC_LAYERS.size === 3, 'Blur change must invalidate cache');
    const blurred = image();
    paintFrame(0, () => layer(painter, { blur: 1.5 }), { transparent: true });
    check(image() === blurred, 'Cached and live blur must have the same screen-space softness');
    const beforeFx = calls;
    SCENE.fx = { m2: false }; cached();
    check(calls === beforeFx + 1, 'Effective scene feature flags must invalidate cache');
    delete SCENE.fx;
    for (let i = 0; i < 7; i++) cached(i * 10);
    check(_STATIC_LAYERS.size === 4, 'Static cache must remain bounded');
    useScene('scene01_juggling'); check(_STATIC_LAYERS.size === 0, 'Scene selection must clear static caches');
    let bypasses = 0;
    paintFrame(0, () => { staticLayer(null, () => bypasses++); staticLayer(null, () => bypasses++); }, { transparent: true });
    check(bypasses === 2, 'Null cache key must bypass caching');

    const focus = blur => paintFrame(0, () => layer(() => {
      X.fillStyle = '#FBF3E7'; X.fillRect(0, 0, W, H);
      for (let x = 20; x < W; x += 25) { X.fillStyle = x % 2 ? '#A3294B' : '#467A60'; X.fillRect(x, 80, 7, 900); }
    }, { blur }), { transparent: true });
    for (const blur of [0, .5, .8, 1, 1.25, 1.5, 1.8, 2]) {
      focus(blur); const a = image(); focus(2.4); focus(blur);
      check(a === image(), `Focus blur ${blur} must not depend on previous frames`);
    }
    check(_blurScale(.5) === 1 && _blurScale(1.5) === .5, 'Blur resolution endpoints');
    for (let b = .51; b <= 1.5; b += .01) {
      check(Math.abs(_blurScale(b) - _blurScale(b - .01)) < .008, 'Blur resolution must ramp smoothly');
    }
    focus(1.5); check(_layers[0].width === 960 && _layers[0].height === 540, '1.5px blur must render at half resolution');

    let subjectCalls = 0;
    const anchors = { foot: [900, 700] }, outer = X;
    paintFrame(0, () => {
      const result = castShadow(() => {
        subjectCalls++; X.fillStyle = '#A3294B'; X.fillRect(850, 400, 100, 300); return anchors;
      }, 900, 700, { blur: 2 });
      check(result === anchors && X === outer, 'Shadow pass must preserve anchors and restore the context');
    }, { transparent: true });
    check(subjectCalls === 1 && _layers[2].width === 960 && _layers[2].height === 540,
      'Shadow painter must run once, with the actual blur baked into a half-res canvas');

    // A synthetic character entry exercises the actual SVG-export context shim with the whole set.
    const entry = { size: [1920, 1080], draw: () => {
      const P = persp({ x: 0, y: 180, z: 0, f: 1000, hy: 450 });
      staticLayer('svg-set', () => throneRoom.back(P, 1.25), { blur: 1.5 });
    } };
    const svg = await exportCharacterSvg({ entry }).text();
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    check(!doc.querySelector('parsererror, image') && !/NaN|Infinity/.test(svg), 'Set caches must bypass to valid pure-vector SVG');
    return 'PASS: cache reuse, transforms, effective FX, blur keys, bounded eviction, scene clearing, null-key bypass, out-of-order focus pulls, cached/live blur parity, half-res shadow blur, anchors, and pure-vector throne-room SVG.';
  });
  console.log(checks);
  const sample = async (label, target) => {
    const result = await target.evaluate(async () => {
      const results = [];
      for (const [id, times] of [
        ['scene01_juggling', [1, 4, 8, 12, 18, 25]],
        ['scene14_offside_trap', [1, 5, 10]],
        ['scene74_thanksgiving_feast', [1, 5, 10]],
        ['scene76_day_on_ice', [5, 24, 40]],
      ]) {
        await requireScene(id); useScene(id);
        const canvas = document.querySelector('#out');
        const sheet = document.createElement('canvas'); sheet.width = times.length * 480; sheet.height = 270;
        const c = sheet.getContext('2d'), ms = [], orderDifferences = [];
        // Warm caches and finish raster work before timing repeated frames.
        for (const t of times) drawFrame(t);
        X.getImageData(0, 0, W, H);
        for (let round = 0; round < 5; round++) {
          const start = performance.now();
          for (const t of times) drawFrame(t);
          X.getImageData(0, 0, W, H);
          ms.push((performance.now() - start) / times.length);
        }
        for (const [i, t] of times.entries()) {
          drawFrame(t); const expected = X.getImageData(0, 0, W, H).data;
          drawFrame(times[(i + 1) % times.length]); drawFrame(t);
          const actual = X.getImageData(0, 0, W, H).data;
          let changed = 0, max = 0;
          for (let p = 0; p < expected.length; p++) {
            const d = Math.abs(expected[p] - actual[p]);
            if (d) { changed++; max = Math.max(max, d); }
          }
          if (changed) orderDifferences.push({ time: t, changedChannels: changed, maxChannelDelta: max });
          c.drawImage(canvas, i * 480, 0, 480, 270);
        }
        results.push({ id, times, medianMsPerFrame: [...ms].sort((a, b) => a - b)[2], samples: ms, orderDifferences, sheet: sheet.toDataURL() });
      }
      return results;
    });
    await mkdir(output, { recursive: true });
    for (const row of result) {
      await writeFile(resolve(output, `${label}-${row.id}.png`), Buffer.from(row.sheet.split(',')[1], 'base64'));
      delete row.sheet;
    }
    return result;
  };
  const current = await sample('after', page);
  await page.close();
  let before;
  if (baseline) {
    const old = await browser.newPage();
    const paths = { '/engine/core.js': 'core.js', '/engine/timeline.js': 'timeline.js', '/locations/throne_room/throne_room.js': 'throne_room.js' };
    const sources = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([path, file]) => [path, await readFile(resolve(baseline, file), 'utf8')])));
    await old.setRequestInterception(true);
    old.on('request', req => {
      const source = sources[new URL(req.url()).pathname];
      if (source) req.respond({ status: 200, contentType: 'text/javascript', body: source });
      else req.continue();
    });
    await old.goto(`http://127.0.0.1:${server.address().port}/studio.html?render`);
    await old.waitForFunction(() => window.ready);
    before = await sample('before', old);
    await old.close();
  }
  const summary = { chrome: await browser.version(), cpuCanvas: true, current, before };
  await writeFile(resolve(output, 'timings.json'), JSON.stringify(summary, null, 2) + '\n');
  for (const [i, row] of current.entries()) console.log(`${row.id}: ${row.medianMsPerFrame.toFixed(2)} ms/frame` +
    (before ? ` (before ${before[i].medianMsPerFrame.toFixed(2)}, ${(before[i].medianMsPerFrame / row.medianMsPerFrame).toFixed(2)}×)` : ''));
  assert.equal(current.length, 4);
  // Match the project's export parity tolerance for minor Canvas raster-cache rounding.
  for (const row of current) for (const d of row.orderDifferences) {
    assert.ok(d.changedChannels < 128 && d.maxChannelDelta <= 32, `${row.id}@${d.time}: frame-order pixel parity`);
  }
  console.log(`PASS: deterministic representative scene frames; contact sheets and timings in ${output}`);
} finally {
  await browser?.close();
  await new Promise(r => server.close(r));
}
