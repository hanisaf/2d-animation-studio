#!/usr/bin/env node
// scripts/build_comic.mjs
// Renders Studio PNGs, clean borderless per-panel PNGs, and multi-page print PDFs for any registered comic
// by driving studio.html?render in headless Chrome.
//
// Usage:
//   node scripts/build_comic.mjs <comic_id> [--page=1] [--no-lettering] [--panels] [--pdf] [--edition=studio|illustrated|both]

import { createServer } from 'node:http';
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { REGISTRY, comicDir } from './registry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};

export function findChrome(explicit) {
  const chrome = explicit || process.env.CHROME || [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(p => existsSync(p));
  if (!chrome || !existsSync(chrome)) {
    throw new Error('Chrome not found. Install Chrome/Chromium or set CHROME=<path>.');
  }
  return chrome;
}

function startEphemeralServer() {
  const uploadSlots = new Map();
  let nextSlot = 1;
  const server = createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    if (req.method === 'POST' && u.pathname === '/__upload') {
      const slot = uploadSlots.get(u.searchParams.get('slot'));
      if (!slot) { res.writeHead(404).end('unknown slot'); return; }
      mkdirSync(dirname(slot.file), { recursive: true });
      const dest = slot.file + '.tmp';
      const ws = createWriteStream(dest);
      req.pipe(ws);
      ws.on('finish', () => {
        try { renameSync(dest, slot.file); res.writeHead(200).end('ok'); }
        catch (e) { res.writeHead(500).end(e.message); }
      });
      ws.on('error', e => res.writeHead(500).end(e.message));
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
    res.writeHead(200, {
      'Content-Type': MIME[extname(f).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': 'no-store',
    });
    createReadStream(f).pipe(res);
  });
  return new Promise(ok => {
    server.listen(0, '127.0.0.1', () => {
      const baseUrl = `http://127.0.0.1:${server.address().port}`;
      ok({
        server,
        baseUrl,
        regSlot(file) {
          const token = String(nextSlot++);
          uploadSlots.set(token, { file });
          return { token, url: `${baseUrl}/__upload?slot=${token}`, free: () => uploadSlots.delete(token) };
        },
      });
    });
  });
}

function pdfSizeOptions(size = {}) {
  const trim = String(size.trim || '').toLowerCase();
  if (trim === 'letter') return { format: 'Letter', cssSize: 'letter portrait' };
  if (trim === 'a4') return { format: 'A4', cssSize: 'A4 portrait' };
  if (trim === 'legal') return { format: 'Legal', cssSize: 'legal portrait' };
  const dpi = size.dpi || 200;
  const wIn = (size.width || 1700) / dpi;
  const hIn = (size.height || 2200) / dpi;
  return { width: `${wIn.toFixed(2)}in`, height: `${hIn.toFixed(2)}in`, cssSize: `${wIn.toFixed(2)}in ${hIn.toFixed(2)}in` };
}

async function writeMultiPagePdf(browser, pagesData, pdfPath, title, size) {
  const { cssSize, ...pdfOpts } = pdfSizeOptions(size);
  mkdirSync(dirname(pdfPath), { recursive: true });
  const printPage = await browser.newPage();
  try {
    const imgsHtml = pagesData
      .map((p, i) => `<div class="page"><img src="${p.dataUrl}" alt="${title} — Page ${i + 1}"></div>`)
      .join('\n');
    await printPage.setContent(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  @page { size: ${cssSize}; margin: 0.2in; }
  html, body { margin: 0; padding: 0; background: #fff; }
  .page { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; break-after: page; page-break-after: always; }
  .page:last-child { break-after: auto; page-break-after: auto; }
  img { max-width: 100%; max-height: 100%; width: auto; height: auto; display: block; object-fit: contain; }
</style>
</head>
<body>
${imgsHtml}
</body>
</html>`, { waitUntil: 'load' });
    await printPage.pdf({
      path: pdfPath,
      ...pdfOpts,
      printBackground: true,
      margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
    });
  } finally {
    await printPage.close();
  }
}

export async function buildComic(comicId, opts = {}) {
  if (!REGISTRY.comics?.includes(comicId)) {
    throw new Error(`Unknown comic "${comicId}". Registered comics: ${(REGISTRY.comics || []).join(', ') || '(none)'}`);
  }
  const dir = resolve(ROOT, comicDir(comicId));
  const studioDir = join(dir, 'studio');
  const outDir = join(dir, 'out');
  const chrome = findChrome(opts.chrome);
  const { server, baseUrl, regSlot } = await startEphemeralServer();

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      protocolTimeout: 0,
      args: ['--no-sandbox', '--disable-renderer-backgrounding'],
    });
    const page = await browser.newPage();
    page.on('pageerror', err => console.error('Page error:', err.message));
    await page.goto(`${baseUrl}/studio.html?render&comic=${encodeURIComponent(comicId)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForFunction(() => window.ready === true, { timeout: 30000 });
    const info = await page.evaluate(() => window.comicInfo());

    const totalPages = info.pages.length;
    const pageIndices = opts.page != null
      ? [Number(opts.page) - 1]
      : Array.from({ length: totalPages }, (_, i) => i);
    for (const idx of pageIndices) {
      if (!Number.isInteger(idx) || idx < 0 || idx >= totalPages) {
        throw new Error(`Invalid page ${idx + 1} for "${comicId}" (valid: 1..${totalPages})`);
      }
    }

    const lettering = opts.lettering !== false;
    const wantPanels = opts.panels === true || (opts.panels == null && info.illustration?.mode === 'panel');
    const edition = opts.edition || 'both';
    const wantPdf = !!opts.pdf;
    const rendered = { pages: [], panels: [], pdfs: [] };

    if (!opts.infoOnly) {
      mkdirSync(studioDir, { recursive: true });
      for (const pageIdx of pageIndices) {
        const pageLayout = info.pages[pageIdx].layout;
        const pagePng = join(studioDir, `${pageLayout.pageId}.png`);
        if (opts.renderPages !== false) {
          const slot = regSlot(pagePng);
          try {
            await page.evaluate(
              (idx, url, letFlag) => window.renderComicPageTo(idx, url, { edition: 'studio', lettering: letFlag }),
              pageIdx, slot.url, lettering
            );
          } finally {
            slot.free();
          }
          rendered.pages.push({ pageIndex: pageIdx, pageId: pageLayout.pageId, path: pagePng });
          if (!opts.quiet) console.log(`✔ Wrote ${pagePng}`);
        }

        if (wantPanels) {
          for (const p of pageLayout.panels) {
            if (opts.panel != null && p.index + 1 !== Number(opts.panel) && p.id !== String(opts.panel)) continue;
            const panelPng = join(studioDir, `${pageLayout.pageId}_${p.id}.png`);
            const slot = regSlot(panelPng);
            try {
              await page.evaluate(
                (idx, url, pIdx) => window.renderComicPageTo(idx, url, { edition: 'studio', lettering: false, panelIndex: pIdx }),
                pageIdx, slot.url, p.index
              );
            } finally {
              slot.free();
            }
            rendered.panels.push({ pageIndex: pageIdx, pageId: pageLayout.pageId, panelIndex: p.index, panelId: p.id, path: panelPng });
            if (!opts.quiet) console.log(`✔ Wrote ${panelPng}`);
          }
        }
      }

      if (wantPdf) {
        if (edition === 'studio' || edition === 'both') {
          const pdfPages = [];
          for (const pageIdx of pageIndices) {
            const pageId = info.pages[pageIdx].layout.pageId;
            const pngPath = join(studioDir, `${pageId}.png`);
            const dataUrl = existsSync(pngPath)
              ? `data:image/png;base64,${readFileSync(pngPath).toString('base64')}`
              : await page.evaluate((idx, letFlag) => window.renderComicPageDataUrl(idx, { edition: 'studio', lettering: letFlag }), pageIdx, lettering);
            pdfPages.push({ dataUrl });
          }
          const pdfPath = join(outDir, 'studio.pdf');
          await writeMultiPagePdf(browser, pdfPages, pdfPath, `${info.title} (Studio Edition)`, info.size);
          rendered.pdfs.push({ edition: 'studio', path: pdfPath });
          if (!opts.quiet) console.log(`✔ Wrote ${pdfPath}`);
        }

        if (edition === 'illustrated' || edition === 'both') {
          const illPages = info.illustrated?.pages || {};
          const hasAnyIll = pageIndices.some(idx => {
            const pid = info.pages[idx].layout.pageId;
            const pd = illPages[pid];
            return Boolean(pd?.image || Object.keys(pd?.panels || {}).length);
          });
          if (hasAnyIll) {
            const pdfPages = [];
            for (const pageIdx of pageIndices) {
              const dataUrl = await page.evaluate(
                (idx, letFlag) => window.renderComicPageDataUrl(idx, { edition: 'illustrated', lettering: letFlag }),
                pageIdx, lettering
              );
              pdfPages.push({ dataUrl });
            }
            const pdfPath = join(outDir, 'illustrated.pdf');
            await writeMultiPagePdf(browser, pdfPages, pdfPath, `${info.title} (Illustrated Edition)`, info.size);
            rendered.pdfs.push({ edition: 'illustrated', path: pdfPath });
            if (!opts.quiet) console.log(`✔ Wrote ${pdfPath}`);
          } else if (edition === 'illustrated') {
            throw new Error(`Comic "${comicId}" has no illustrated edition yet. Run scripts/illustrate_comic.mjs first.`);
          }
        }
      }
    }

    return { info, dir, studioDir, outDir, rendered };
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

// ---------- CLI entry ----------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const comicId = argv.find(a => !a.startsWith('--'));
  if (!comicId || argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: node scripts/build_comic.mjs <comic_id> [--page=1] [--no-lettering] [--panels] [--pdf] [--edition=studio|illustrated|both]');
    console.log('Registered comics:', (REGISTRY.comics || []).join(', ') || '(none)');
    process.exit(comicId ? 0 : 1);
  }
  const flag = name => {
    const pref = `--${name}=`;
    const hit = argv.find(a => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };
  const opts = {
    page: flag('page') != null ? Number(flag('page')) : undefined,
    lettering: !argv.includes('--no-lettering'),
    panels: argv.includes('--panels') ? true : undefined,
    pdf: argv.includes('--pdf'),
    edition: flag('edition') || 'both',
    chrome: flag('chrome'),
  };
  await buildComic(comicId, opts);
}
