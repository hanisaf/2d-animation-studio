#!/usr/bin/env node
// scripts/test-comics.mjs: automated verification for the Safadi Studio Comics Engine.
// Covers Node registry expansion, Studio UI (Studio/Illustrated/Side-by-Side + 1920x1080 restoration),
// headless build_comic.mjs (--panels --pdf), illustrate_comic.mjs (--dry-run page & panel modes),
// and index.html 3-card landing entrypoints.

import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { REGISTRY, BOOKS, comicDir } from './registry.mjs';
import { buildComic, findChrome } from './build_comic.mjs';
import { illustrateComic, pickAspectRatio } from './illustrate_comic.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
};

// 1. Node registry & books verification
assert.ok(REGISTRY.books.includes('sami_and_jenna'), 'sami_and_jenna book registered');
assert.ok(REGISTRY.comics.includes('ice_skating'), 'ice_skating comic registered');
assert.equal(REGISTRY.comicBook.ice_skating, 'sami_and_jenna');
assert.equal(comicDir('ice_skating'), 'comics/sami_and_jenna/ice_skating');
assert.ok(BOOKS.sami_and_jenna.style.refs.length >= 1, 'book style_refs configured');
for (const ref of BOOKS.sami_and_jenna.style.refs) {
  assert.ok(existsSync(join(ROOT, ref)), `style ref exists: ${ref}`);
}

// 2. index.html 3-card verification
const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
assert.ok(indexHtml.includes('href="studio.html"'), 'Movies card link present');
assert.ok(indexHtml.includes('href="studio.html?comic=ice_skating"'), 'Comics card link present');
assert.ok(indexHtml.includes('href="games/"'), 'Games card link present');
assert.ok(existsSync(join(ROOT, 'comics/sami_and_jenna/ice_skating/illustrated/page-01.png')), 'Comics card preview image exists');
assert.ok(existsSync(join(ROOT, 'COMIC_GUIDE.md')), 'COMIC_GUIDE.md exists');
console.log('✔ Registry, book manifests, COMIC_GUIDE.md, and index.html 3-card checks passed');

// 3. Aspect-ratio snapping checks
assert.equal(pickAspectRatio(1700, 2200), '3:4');
assert.equal(pickAspectRatio(1596, 378), '4:1');
assert.equal(pickAspectRatio(518, 358), '3:2');

// 4. Studio browser verification
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  if (u.pathname === '/api/capabilities') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ local: true, geminiConfigured: false }));
    return;
  }
  const f = normalize(join(ROOT, decodeURIComponent(u.pathname)));
  if (f !== ROOT && !f.startsWith(ROOT + sep)) return res.writeHead(403).end();
  try {
    const target = statSync(f).isDirectory() ? join(f, 'index.html') : f;
    res.writeHead(200, { 'Content-Type': MIME[extname(target).toLowerCase()] || 'application/octet-stream' });
    res.end(readFileSync(target));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ['--no-sandbox'] });

try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });

  await page.goto(`${baseUrl}/studio.html?comic=ice_skating`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.ready === true && window.studio?.S?.mode === 'comic', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 200));

  const comicState = await page.evaluate(() => ({
    mode: studio.S.mode,
    id: studio.S.id,
    w: document.querySelector('#out').width,
    h: document.querySelector('#out').height,
    ar: document.querySelector('.stage').style.getPropertyValue('--stage-ar'),
    hasIll: studio.S.comic.images?.hasIllustrated,
    refineDisabled: document.querySelector('#comic-refine')?.disabled,
    comicsNavCount: document.querySelectorAll('#list-comics li[data-mode="comic"]').length,
  }));
  assert.equal(comicState.mode, 'comic');
  assert.equal(comicState.id, 'ice_skating');
  assert.equal(comicState.w, 1700);
  assert.equal(comicState.h, 2200);
  assert.equal(comicState.ar, '1700 / 2200');
  assert.equal(comicState.hasIll, true);
  assert.equal(comicState.refineDisabled, true);
  assert.ok(comicState.comicsNavCount >= 1);

  // Switch through Illustrated, Side by Side, Fit Width, and Lettering toggle
  await page.click('[data-cview="illustrated"]');
  await new Promise(r => setTimeout(r, 100));
  await page.click('[data-cview="split"]');
  await page.click('[data-cfit="width"]');
  await page.click('#comic-lettering');
  await new Promise(r => setTimeout(r, 150));
  const splitCheck = await page.evaluate(() => ({
    view: studio.S.comic.view,
    fit: studio.S.comic.fit,
    lettering: studio.S.comic.lettering,
    compareHidden: document.querySelector('#out-compare').hidden,
    cw: document.querySelector('#out-compare').width,
    ch: document.querySelector('#out-compare').height,
    fitWidth: document.querySelector('.stage').classList.contains('comic-fit-width'),
  }));
  assert.equal(splitCheck.view, 'split');
  assert.equal(splitCheck.fit, 'width');
  assert.equal(splitCheck.lettering, false);
  assert.equal(splitCheck.compareHidden, false);
  assert.equal(splitCheck.cw, 1700);
  assert.equal(splitCheck.ch, 2200);
  assert.equal(splitCheck.fitWidth, true);

  // Verify character cross-link mentions Ice Skating Adventure
  await page.evaluate(() => studio.select('character', 'jenna'));
  await new Promise(r => setTimeout(r, 150));
  const charState = await page.evaluate(() => ({
    mode: studio.S.mode,
    w: document.querySelector('#out').width,
    h: document.querySelector('#out').height,
    hasComicLink: Boolean(document.querySelector('[data-go="comic:ice_skating"]')),
    compareHidden: document.querySelector('#out-compare').hidden,
  }));
  assert.equal(charState.mode, 'character');
  assert.equal(charState.w, 1920);
  assert.equal(charState.h, 1080);
  assert.equal(charState.hasComicLink, true);
  assert.equal(charState.compareHidden, true);

  // Switch to a scene and confirm 1920x1080 & 16/9 restoration
  await page.evaluate(() => studio.select('scene', 'scene01_juggling'));
  await new Promise(r => setTimeout(r, 150));
  const sceneState = await page.evaluate(() => ({
    mode: studio.S.mode,
    w: document.querySelector('#out').width,
    h: document.querySelector('#out').height,
    ar: document.querySelector('.stage').style.getPropertyValue('--stage-ar'),
  }));
  assert.equal(sceneState.mode, 'scene');
  assert.equal(sceneState.w, 1920);
  assert.equal(sceneState.h, 1080);
  assert.equal(sceneState.ar, '16 / 9');

  const realErrors = errors.filter(e => !e.includes('fonts.googleapis.com'));
  assert.deepEqual(realErrors, [], 'Unexpected Studio errors: ' + realErrors.join('; '));
  console.log('✔ Studio UI comic view, split/fit/lettering toggles, cross-links, and 1920×1080 restoration passed');
} finally {
  await browser.close();
  server.close();
}

// 5. Headless buildComic (--panels --pdf)
const built = await buildComic('ice_skating', { panels: true, pdf: true, quiet: true });
assert.equal(built.rendered.pages.length, 2);
assert.equal(built.rendered.panels.length, 11);
assert.equal(built.rendered.pdfs.length, 2);
for (const item of [...built.rendered.pages, ...built.rendered.panels, ...built.rendered.pdfs]) {
  assert.ok(statSync(item.path).size > 4000, `non-empty output: ${item.path}`);
}
console.log('✔ build_comic.mjs (--panels --pdf) passed (2 page PNGs, 11 clean panel PNGs, 2 PDFs)');

// 6. illustrateComic --dry-run (page + panel modes)
const dryPage = await illustrateComic('ice_skating', { dryRun: true, mode: 'page', quiet: true });
assert.equal(dryPage.targets.length, 2);
assert.equal(dryPage.targets[0].aspectRatio, '3:4');
assert.ok(dryPage.targets[0].refs.length <= 14);
assert.ok(dryPage.targets[0].refs.filter(r => r.kind === 'character').length <= 4);

const dryPanel = await illustrateComic('ice_skating', { dryRun: true, mode: 'panel', panel: 5, quiet: true });
assert.equal(dryPanel.targets.length, 1);
assert.equal(dryPanel.targets[0].aspectRatio, '4:1');
assert.ok(dryPanel.targets[0].refs.length <= 14);
assert.ok(dryPanel.targets[0].refs.filter(r => r.kind === 'character').length <= 4);
console.log('✔ illustrate_comic.mjs --dry-run (page + panel modes) passed');

console.log('ALL COMICS ENGINE TESTS PASSED!');
