#!/usr/bin/env node
// scripts/illustrate_comic.mjs
// Generates Gemini Nano Banana 2.1 illustrated editions for any registered comic (full-page or per-panel mode),
// with SHA-1 content caching, historical takes in illustrated/takes/, active/approved promotion, and manifest.js generation.
//
// Usage:
//   GEMINI_API_KEY=... node scripts/illustrate_comic.mjs <comic_id> [--page=1] [--panel=5] [--mode=page|panel] [--resolution=2K] [--force] [--approve=<take_id>] [--dry-run]

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { REGISTRY, BOOKS, comicDir } from './registry.mjs';
import { buildComic } from './build_comic.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Load .env if GEMINI_API_KEY is not already set
function loadDotEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (k && process.env[k] == null && v) process.env[k] = v;
  }
}

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const SUPPORTED_ASPECT_RATIOS = [
  '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4',
  '9:16', '16:9', '21:9', '1:4', '4:1', '1:8', '8:1',
];

export function pickAspectRatio(w, h) {
  const target = w / Math.max(1, h);
  let best = '3:4', bestErr = Infinity;
  for (const label of SUPPORTED_ASPECT_RATIOS) {
    const [rw, rh] = label.split(':').map(Number);
    const err = Math.abs(Math.log(target / (rw / rh)));
    if (err < bestErr) { bestErr = err; best = label; }
  }
  return best;
}

function readAssetMeta(relPath) {
  let meta = null;
  const full = join(ROOT, relPath);
  if (!existsSync(full)) return null;
  vm.runInNewContext(readFileSync(full, 'utf8'), { asset: m => { meta = m; } }, { filename: relPath });
  return meta;
}

function resolveCharacterRefs(castIds, bookMeta) {
  const out = [];
  const seenPaths = new Set();
  for (const cid of castIds || []) {
    // 1. Prefer book-specific castBible character reference (painted in book style)
    const bibleEntry = bookMeta?.castBible?.[cid];
    if (bibleEntry?.ref) {
      const abs = resolve(ROOT, bibleEntry.ref);
      if (existsSync(abs) && MIME_BY_EXT[extname(abs).toLowerCase()] && !seenPaths.has(abs)) {
        seenPaths.add(abs);
        out.push({ id: cid, title: bibleEntry.name || cid, path: abs, rel: relative(ROOT, abs) });
        continue;
      }
    }
    // 2. Fallback to registered characters/<id>/asset.js reference image
    const meta = readAssetMeta(`characters/${cid}/asset.js`);
    const ref = meta?.refs?.[0];
    if (!ref) continue;
    const abs = join(ROOT, 'characters', cid, ref);
    if (existsSync(abs) && MIME_BY_EXT[extname(abs).toLowerCase()] && !seenPaths.has(abs)) {
      seenPaths.add(abs);
      out.push({ id: cid, title: meta.title || cid, path: abs, rel: relative(ROOT, abs) });
    }
  }
  return out;
}

function resolveLocationRefs(locationIds, bookMeta) {
  const out = [];
  const seenPaths = new Set();
  for (const lid of locationIds || []) {
    const locPath = bookMeta?.locationRefs?.[lid];
    if (!locPath) continue;
    const abs = resolve(ROOT, locPath);
    if (existsSync(abs) && MIME_BY_EXT[extname(abs).toLowerCase()] && !seenPaths.has(abs)) {
      seenPaths.add(abs);
      out.push({ id: lid, label: `Location reference: ${lid}`, path: abs, rel: relative(ROOT, abs) });
    }
  }
  return out;
}

function selectCastBibleEntries(bookMeta, castIds) {
  const bible = bookMeta?.castBible || {};
  const keys = Object.keys(bible);
  if (!keys.length) return [];
  const matched = [];
  const seen = new Set();
  for (const cid of castIds || []) {
    if (bible[cid] && !seen.has(cid)) {
      seen.add(cid);
      matched.push(bible[cid]);
    }
  }
  // If specific sub-cast IDs matched (e.g. ['eve', 'eve_dad']), return only those;
  // otherwise (e.g. comic only listed a pack ID like 'palm_pals'), include all book castBible entries.
  return matched.length ? matched : keys.map(k => bible[k]);
}

function formatConsistencyLines({ castBibleEntries = [], invariants = [], locationRefs = [], continuityRef = null }) {
  const lines = [];
  if (locationRefs.length) {
    lines.push(`- Match the room layout, lighting, and palette of the location reference(s): ${locationRefs.map(l => l.id).join(', ')}.`);
  }
  if (continuityRef) {
    lines.push(`- Maintain seamless character proportions, brushwork, and palette continuity with the previous illustrated page (${continuityRef.rel}).`);
  }
  if (castBibleEntries.length) {
    lines.push('', 'Character design lock (MUST remain 100% consistent across every panel and page):');
    for (const c of castBibleEntries) {
      const parts = [c.description].filter(Boolean);
      if (c.traits?.length) parts.push(`Key traits: ${c.traits.join('; ')}`);
      if (c.avoid?.length) parts.push(`NEVER: ${c.avoid.join('; ')}`);
      lines.push(`- ${c.name} (${c.id}): ${parts.join('. ')}`);
    }
  }
  if (invariants.length) {
    lines.push('', 'Strict book-wide visual invariants:');
    for (const rule of invariants) lines.push(`- ${rule}`);
  }
  return lines;
}

export function collectReferences({
  blueprintPath,
  styleRefs,
  castIds,
  locationIds = [],
  prevPageRef = null,
  bookMeta = null,
  maxTotal = 14,
  maxStyle = 4,
  maxChars = 4,
  maxLocations = 3,
}) {
  const refs = [{ kind: 'blueprint', label: 'Studio layout blueprint', path: blueprintPath, rel: relative(ROOT, blueprintPath) }];
  const seenPaths = new Set([resolve(blueprintPath)]);
  const warnings = [];

  const validStyle = (styleRefs || [])
    .map(r => resolve(ROOT, r))
    .filter(p => existsSync(p) && MIME_BY_EXT[extname(p).toLowerCase()] && !seenPaths.has(p));
  if (validStyle.length > maxStyle) {
    warnings.push(`Capped book style refs from ${validStyle.length} to ${maxStyle}.`);
  }
  for (const p of validStyle.slice(0, maxStyle)) {
    seenPaths.add(p);
    refs.push({ kind: 'style', label: 'Book art style reference', path: p, rel: relative(ROOT, p) });
  }

  const charRefs = resolveCharacterRefs(castIds, bookMeta).filter(c => !seenPaths.has(c.path));
  if (charRefs.length > maxChars) {
    warnings.push(`Capped character refs from ${charRefs.length} (${charRefs.map(c => c.id).join(', ')}) to Gemini's ${maxChars}-character limit.`);
  }
  for (const c of charRefs.slice(0, maxChars)) {
    seenPaths.add(c.path);
    refs.push({ kind: 'character', id: c.id, label: `Character reference: ${c.title}`, path: c.path, rel: c.rel });
  }

  const locRefs = resolveLocationRefs(locationIds, bookMeta).filter(l => !seenPaths.has(l.path));
  if (locRefs.length > maxLocations) {
    warnings.push(`Capped location refs from ${locRefs.length} (${locRefs.map(l => l.id).join(', ')}) to ${maxLocations}.`);
  }
  for (const l of locRefs.slice(0, maxLocations)) {
    seenPaths.add(l.path);
    refs.push({ kind: 'location', id: l.id, label: l.label, path: l.path, rel: l.rel });
  }

  if (prevPageRef) {
    const absPrev = resolve(ROOT, prevPageRef);
    if (existsSync(absPrev) && MIME_BY_EXT[extname(absPrev).toLowerCase()] && !seenPaths.has(absPrev)) {
      seenPaths.add(absPrev);
      refs.push({ kind: 'continuity', label: 'Previous illustrated page continuity anchor', path: absPrev, rel: relative(ROOT, absPrev) });
    }
  }

  if (refs.length > maxTotal) {
    warnings.push(`Trimmed total references from ${refs.length} to ${maxTotal}.`);
    refs.length = maxTotal;
  }
  return { refs, warnings };
}

export function buildPagePrompt({
  bookStylePrompt,
  comicStylePrompt,
  pageScript,
  charRefs = [],
  locationRefs = [],
  continuityRef = null,
  castBibleEntries = [],
  invariants = [],
}) {
  const lines = [
    'Illustrate this complete comic book page as a cohesive, finished storybook illustration.',
    'Style direction:',
    bookStylePrompt || 'Warm hand-painted children’s storybook comic illustration, clean warm-ink linework, expressive faces.',
  ];
  if (comicStylePrompt) lines.push(comicStylePrompt);
  lines.push(
    '',
    'Strict layout and fidelity requirements:',
    '- Follow the FIRST reference image (Studio layout blueprint) for exact panel grid geometry, panel borders, character poses, outfits, props, facial expressions, and camera framing.',
    '- Match the visual medium, brushwork, color palette, and lighting of the book style reference image(s).',
  );
  if (charRefs.length) {
    lines.push(`- Preserve exact character likenesses from the character references: ${charRefs.map(c => c.label.replace('Character reference: ', '')).join(', ')}.`);
  }
  lines.push(...formatConsistencyLines({ castBibleEntries, invariants, locationRefs, continuityRef }));
  lines.push('- Render all comic lettering cleanly and legibly with exact spelling matching this script:');
  if (pageScript.masthead?.title) {
    lines.push(`  Masthead title: "${pageScript.masthead.title}"${pageScript.masthead.subtitle ? ` | Subtitle: "${pageScript.masthead.subtitle}"` : ''}`);
  }
  for (const p of pageScript.panels) {
    const bits = [];
    if (p.location) bits.push(`Setting: ${p.location}`);
    if (p.captions.length) bits.push(`Captions: ${p.captions.map(t => `"${t}"`).join(', ')}`);
    if (p.sfx.length) bits.push(`SFX: ${p.sfx.map(t => `"${t}"`).join(', ')}`);
    if (p.bubbles.length) bits.push(`Dialogue: ${p.bubbles.map(b => `${b.speaker ? b.speaker + ': ' : ''}"${b.text}"`).join(' | ')}`);
    lines.push(`  Panel ${p.index} (${p.id}): ${bits.length ? bits.join(' · ') : '(visual only, no text)'}`);
  }
  return lines.join('\n');
}

export function buildPanelPrompt({
  bookStylePrompt,
  comicStylePrompt,
  panelScript,
  charRefs = [],
  locationRefs = [],
  continuityRef = null,
  castBibleEntries = [],
  invariants = [],
}) {
  const lines = [
    'Illustrate this single comic panel as a full-bleed finished storybook illustration.',
    'Style direction:',
    bookStylePrompt || 'Warm hand-painted children’s storybook comic illustration, clean warm-ink linework, expressive faces.',
  ];
  if (comicStylePrompt) lines.push(comicStylePrompt);
  if (panelScript.location) lines.push('', `Setting: ${panelScript.location}`);
  if (panelScript.prompt) lines.push('', `Scene description: ${panelScript.prompt}`);
  lines.push(
    '',
    'Strict fidelity & clean-art requirements:',
    '- Follow the FIRST reference image (Studio panel blueprint) for exact composition, character poses, outfits, props, expressions, and background placement.',
    '- Match the visual medium, brushwork, and color palette of the book style reference image(s).',
  );
  if (charRefs.length) {
    lines.push(`- Preserve exact character likenesses from the character references: ${charRefs.map(c => c.label.replace('Character reference: ', '')).join(', ')}.`);
  }
  lines.push(...formatConsistencyLines({ castBibleEntries, invariants, locationRefs, continuityRef }));
  lines.push(
    '- Fill the entire frame edge-to-edge (full bleed).',
    '- DO NOT draw any panel borders, frames, speech bubbles, caption boxes, sound effects, or text of any kind (vector lettering will be composited on top).',
  );
  return lines.join('\n');
}

function computeContentHash({ model, mode, resolution, aspectRatio, thinkingLevel, prompt, refs }) {
  const h = createHash('sha1');
  h.update([model, mode, resolution, aspectRatio, thinkingLevel || '', prompt].join('\0'));
  for (const r of refs) {
    h.update('\0' + r.kind + '\0');
    h.update(readFileSync(r.path));
  }
  return h.digest('hex').slice(0, 12);
}

async function callGeminiImage({ apiKey, model, prompt, refs, aspectRatio, resolution }) {
  const parts = [];
  for (const r of refs) {
    const mimeType = MIME_BY_EXT[extname(r.path).toLowerCase()];
    parts.push({ inlineData: { mimeType, data: readFileSync(r.path).toString('base64') } });
  }
  parts.push({ text: prompt });

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio, imageSize: resolution },
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    const imgPart = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
    if (res.ok && imgPart) {
      return {
        buffer: Buffer.from(imgPart.inlineData.data, 'base64'),
        mimeType: imgPart.inlineData.mimeType || 'image/png',
      };
    }
    const retryable = res.status === 429 || res.status >= 500 || !res.status;
    if (!retryable || attempt >= 5) {
      throw new Error(`Gemini image generation failed (${res.status}): ${json.error?.message || JSON.stringify(json).slice(0, 240)}`);
    }
    const retrySec = parseFloat(JSON.stringify(json).match(/"retryDelay":"([\d.]+)s"/)?.[1] || '0');
    const waitMs = retrySec > 0 ? (retrySec + 1) * 1000 : 3000 * attempt;
    console.log(`  retrying in ${(waitMs / 1000).toFixed(0)}s (HTTP ${res.status} ${json.error?.status || ''})`);
    await new Promise(r => setTimeout(r, waitMs));
  }
}

function writeManifestJs(comicId, illDir, index) {
  const manifestData = {
    updatedAt: index.updatedAt || new Date().toISOString(),
    mode: index.mode || 'page',
    pages: {},
  };
  for (const [pageId, p] of Object.entries(index.pages || {})) {
    const panels = {};
    for (const [panelId, pn] of Object.entries(p.panels || {})) {
      panels[panelId] = {
        active: pn.active || 'approved',
        image: pn.image || null,
        takes: (pn.takes || []).map(t => ({
          id: t.id, image: t.image, hash: t.hash, model: t.model, resolution: t.resolution, aspectRatio: t.aspectRatio, createdAt: t.createdAt,
        })),
      };
    }
    manifestData.pages[pageId] = {
      active: p.active || 'approved',
      image: p.image || null,
      takes: (p.takes || []).map(t => ({
        id: t.id, image: t.image, hash: t.hash, model: t.model, resolution: t.resolution, aspectRatio: t.aspectRatio, createdAt: t.createdAt,
      })),
      panels,
    };
  }
  const content = `// Generated by scripts/illustrate_comic.mjs for ${comicId}.\ncomicIllustrations(${JSON.stringify(manifestData, null, 2)});\n`;
  writeFileSync(join(illDir, 'manifest.js'), content);
}

function ensureAssetIllustratedField(comicDirAbs) {
  const assetPath = join(comicDirAbs, 'asset.js');
  if (!existsSync(assetPath)) return;
  const src = readFileSync(assetPath, 'utf8');
  if (/\billustrated\s*:/.test(src)) return;
  const updated = src.replace(/(\n\s*files\s*:[^\n]+\n)/, `$1  illustrated: 'illustrated/manifest.js',\n`);
  if (updated !== src) writeFileSync(assetPath, updated);
}

function loadOrInitIndex(illDir, comicInfo) {
  const indexPath = join(illDir, 'index.json');
  if (existsSync(indexPath)) {
    return JSON.parse(readFileSync(indexPath, 'utf8'));
  }
  // Seed from existing manifest.js if present (e.g., migrated ice_skating comic)
  const manifestPath = join(illDir, 'manifest.js');
  if (existsSync(manifestPath)) {
    let seeded = null;
    vm.runInNewContext(readFileSync(manifestPath, 'utf8'), { comicIllustrations: d => { seeded = d; } });
    if (seeded) return { updatedAt: seeded.updatedAt, mode: seeded.mode || comicInfo.illustration?.mode || 'page', pages: seeded.pages || {} };
  }
  return { updatedAt: new Date().toISOString(), mode: comicInfo.illustration?.mode || 'page', pages: {} };
}

export async function illustrateComic(comicId, opts = {}) {
  loadDotEnv();
  if (!REGISTRY.comics?.includes(comicId)) {
    throw new Error(`Unknown comic "${comicId}". Registered comics: ${(REGISTRY.comics || []).join(', ') || '(none)'}`);
  }
  const bookId = REGISTRY.comicBook[comicId];
  const bookMeta = BOOKS[bookId];
  const dirAbs = resolve(ROOT, comicDir(comicId));
  const illDir = join(dirAbs, 'illustrated');
  const takesDir = join(illDir, 'takes');
  const indexPath = join(illDir, 'index.json');

  // Inspect comic metadata & ensure Studio PNGs are up to date (unless --approve only)
  const assetMeta = readAssetMeta(`${comicDir(comicId)}/asset.js`) || {};
  const defaultMode = assetMeta.illustration?.mode || bookMeta?.defaults?.illustration?.mode || 'page';
  const mode = opts.mode || (opts.panel != null ? 'panel' : defaultMode);
  if (mode !== 'page' && mode !== 'panel') throw new Error(`Invalid mode "${mode}" (expected "page" or "panel")`);

  if (opts.approve) {
    const idx = loadOrInitIndex(illDir, { illustration: { mode } });
    const pageId = `page-${String(opts.page || 1).padStart(2, '0')}`;
    const pageEntry = idx.pages?.[pageId];
    if (!pageEntry) throw new Error(`No takes recorded for ${pageId}`);
    let bucket = pageEntry;
    let activeRel = `illustrated/${pageId}.png`;
    if (opts.panel != null) {
      const panelKey = Object.keys(pageEntry.panels || {}).find((k, i) => k === String(opts.panel) || i + 1 === Number(opts.panel));
      if (!panelKey) throw new Error(`No panel takes recorded for panel "${opts.panel}" on ${pageId}`);
      bucket = pageEntry.panels[panelKey];
      activeRel = `illustrated/${pageId}_${panelKey}.png`;
    }
    const take = (bucket.takes || []).find(t => t.id === opts.approve || t.hash === opts.approve);
    if (!take) throw new Error(`Take "${opts.approve}" not found. Available: ${(bucket.takes || []).map(t => t.id).join(', ') || '(none)'}`);
    const takeAbs = join(dirAbs, take.image);
    if (!existsSync(takeAbs)) throw new Error(`Take file missing on disk: ${takeAbs}`);
    copyFileSync(takeAbs, join(dirAbs, activeRel));
    bucket.active = take.id;
    bucket.image = activeRel;
    idx.updatedAt = new Date().toISOString();
    mkdirSync(illDir, { recursive: true });
    writeFileSync(indexPath, JSON.stringify(idx, null, 2));
    writeManifestJs(comicId, illDir, idx);
    ensureAssetIllustratedField(dirAbs);
    console.log(`✔ Approved take "${take.id}" → ${activeRel}`);
    return { ok: true, approved: take.id, generated: 0, cached: 0 };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!opts.dryRun && !apiKey) {
    throw new Error('GEMINI_API_KEY is not set (export GEMINI_API_KEY=... or add it to .env)');
  }

  const built = await buildComic(comicId, {
    page: opts.page,
    panel: opts.panel,
    lettering: mode === 'page',
    panels: mode === 'panel',
    renderPages: mode === 'page',
    pdf: false,
    quiet: !!opts.quiet,
    chrome: opts.chrome,
  });
  const info = built.info;
  const model = opts.model || info.illustration?.model || 'gemini-nano-banana-2.1';
  const resolution = opts.resolution || info.illustration?.resolution || '2K';
  const thinkingLevel = info.illustration?.thinkingLevel || 'medium';
  const bookStylePrompt = bookMeta?.style?.prompt || '';
  const comicStylePrompt = info.illustration?.stylePrompt || '';
  const styleRefs = bookMeta?.style?.refs || [];
  const invariants = bookMeta?.invariants || [];
  const chainPreviousPage = opts.chainPreviousPage ?? (
    assetMeta.illustration?.chainPreviousPage ?? bookMeta?.defaults?.illustration?.chainPreviousPage ?? false
  );

  const index = loadOrInitIndex(illDir, info);
  index.mode = mode;

  const pageIndices = opts.page != null
    ? [Number(opts.page) - 1]
    : Array.from({ length: info.pages.length }, (_, i) => i);

  let generated = 0, cached = 0;
  const dryReport = [];

  for (const pageIdx of pageIndices) {
    const pageObj = info.pages[pageIdx];
    const pageId = pageObj.layout.pageId;
    index.pages[pageId] ??= { active: 'approved', image: null, takes: [], panels: {} };
    const prevPageId = pageIdx > 0 ? info.pages[pageIdx - 1]?.layout?.pageId : null;
    const prevPageCand = chainPreviousPage && prevPageId ? join(illDir, `${prevPageId}.png`) : null;
    const prevPageRef = prevPageCand && existsSync(prevPageCand) ? prevPageCand : null;

    if (mode === 'page') {
      const blueprintPath = join(built.studioDir, `${pageId}.png`);
      const explicitPageCast = [
        ...(pageObj.script.cast || []),
        ...pageObj.script.panels.flatMap(p => p.cast || []),
      ];
      const pageCast = [...new Set(explicitPageCast.length ? explicitPageCast : (info.cast || []))];
      const pageLocations = [...new Set([
        ...(pageObj.script.location ? [pageObj.script.location] : []),
        ...pageObj.script.panels.map(p => p.location).filter(Boolean),
      ])];
      const { refs, warnings } = collectReferences({
        blueprintPath,
        styleRefs,
        castIds: pageCast,
        locationIds: pageLocations,
        prevPageRef,
        bookMeta,
      });
      for (const w of warnings) console.warn(`⚠ ${w}`);
      const aspectRatio = pickAspectRatio(pageObj.layout.width, pageObj.layout.height);
      const castBibleEntries = selectCastBibleEntries(bookMeta, pageCast);
      const prompt = buildPagePrompt({
        bookStylePrompt,
        comicStylePrompt,
        pageScript: pageObj.script,
        charRefs: refs.filter(r => r.kind === 'character'),
        locationRefs: refs.filter(r => r.kind === 'location'),
        continuityRef: refs.find(r => r.kind === 'continuity') || null,
        castBibleEntries,
        invariants,
      });
      const hash = computeContentHash({ model, mode, resolution, aspectRatio, thinkingLevel, prompt, refs });
      const hash8 = hash.slice(0, 8);
      const bucket = index.pages[pageId];
      const existing = (bucket.takes || []).find(t => t.hash === hash && existsSync(join(dirAbs, t.image)));

      if (opts.dryRun) {
        dryReport.push({
          target: pageId, mode, model, resolution,
          size: `${pageObj.layout.width}x${pageObj.layout.height}`,
          aspectRatio, hash, cached: Boolean(existing),
          refs: refs.map(r => ({ kind: r.kind, rel: r.rel })),
          castBibleKeys: castBibleEntries.map(c => c.id),
          invariantsCount: invariants.length,
          warnings,
          promptPreview: prompt.slice(0, 320),
        });
        continue;
      }

      mkdirSync(takesDir, { recursive: true });
      const activeRel = `illustrated/${pageId}.png`;
      if (!opts.force && existing) {
        copyFileSync(join(dirAbs, existing.image), join(dirAbs, activeRel));
        bucket.active = existing.id;
        bucket.image = activeRel;
        cached++;
        console.log(`↷ Cache hit for ${pageId} (${existing.id}, ${hash8})`);
      } else {
        console.log(`✦ Illustrating ${comicId}/${pageId} (${model}, ${resolution}, ${aspectRatio}, ${refs.length} refs)…`);
        const { buffer } = await callGeminiImage({ apiKey, model, prompt, refs, aspectRatio, resolution });
        const takeNum = (bucket.takes?.length || 0) + 1;
        const takeId = `v${takeNum}`;
        const takeRel = `illustrated/takes/${pageId}_${hash8}.png`;
        writeFileSync(join(dirAbs, takeRel), buffer);
        copyFileSync(join(dirAbs, takeRel), join(dirAbs, activeRel));
        bucket.takes = [...(bucket.takes || []), {
          id: takeId, image: takeRel, hash, model, resolution, aspectRatio, createdAt: new Date().toISOString(),
        }];
        bucket.active = takeId;
        bucket.image = activeRel;
        generated++;
        console.log(`✔ Wrote ${activeRel} (take ${takeId})`);
      }
    } else {
      // Per-panel mode
      index.pages[pageId].panels ??= {};
      for (const pLayout of pageObj.layout.panels) {
        if (opts.panel != null && pLayout.index + 1 !== Number(opts.panel) && pLayout.id !== String(opts.panel)) continue;
        const panelScript = pageObj.script.panels[pLayout.index];
        const targetId = `${pageId}_${pLayout.id}`;
        const blueprintPath = join(built.studioDir, `${targetId}.png`);
        const panelCast = panelScript.cast?.length ? panelScript.cast : (pageObj.script.cast?.length ? pageObj.script.cast : (info.cast || []));
        const panelLocations = panelScript.location ? [panelScript.location] : (pageObj.script.location ? [pageObj.script.location] : []);
        const { refs, warnings } = collectReferences({
          blueprintPath,
          styleRefs,
          castIds: panelCast,
          locationIds: panelLocations,
          prevPageRef: null,
          bookMeta,
        });
        for (const w of warnings) console.warn(`⚠ [${pLayout.id}] ${w}`);
        const aspectRatio = pickAspectRatio(pLayout.w, pLayout.h);
        const castBibleEntries = selectCastBibleEntries(bookMeta, panelCast);
        const prompt = buildPanelPrompt({
          bookStylePrompt,
          comicStylePrompt,
          panelScript,
          charRefs: refs.filter(r => r.kind === 'character'),
          locationRefs: refs.filter(r => r.kind === 'location'),
          continuityRef: null,
          castBibleEntries,
          invariants,
        });
        const hash = computeContentHash({ model, mode, resolution, aspectRatio, thinkingLevel, prompt, refs });
        const hash8 = hash.slice(0, 8);
        const bucket = (index.pages[pageId].panels[pLayout.id] ??= { active: 'approved', image: null, takes: [] });
        const existing = (bucket.takes || []).find(t => t.hash === hash && existsSync(join(dirAbs, t.image)));

        if (opts.dryRun) {
          dryReport.push({
            target: targetId, mode, model, resolution,
            size: `${pLayout.w}x${pLayout.h}`,
            aspectRatio, hash, cached: Boolean(existing),
            refs: refs.map(r => ({ kind: r.kind, rel: r.rel })),
            castBibleKeys: castBibleEntries.map(c => c.id),
            invariantsCount: invariants.length,
            warnings,
            promptPreview: prompt.slice(0, 260),
          });
          continue;
        }

        mkdirSync(takesDir, { recursive: true });
        const activeRel = `illustrated/${targetId}.png`;
        if (!opts.force && existing) {
          copyFileSync(join(dirAbs, existing.image), join(dirAbs, activeRel));
          bucket.active = existing.id;
          bucket.image = activeRel;
          cached++;
          console.log(`↷ Cache hit for ${targetId} (${existing.id}, ${hash8})`);
        } else {
          console.log(`✦ Illustrating ${comicId}/${targetId} (${model}, ${resolution}, ${aspectRatio}, ${refs.length} refs)…`);
          const { buffer } = await callGeminiImage({ apiKey, model, prompt, refs, aspectRatio, resolution });
          const takeNum = (bucket.takes?.length || 0) + 1;
          const takeId = `v${takeNum}`;
          const takeRel = `illustrated/takes/${targetId}_${hash8}.png`;
          writeFileSync(join(dirAbs, takeRel), buffer);
          copyFileSync(join(dirAbs, takeRel), join(dirAbs, activeRel));
          bucket.takes = [...(bucket.takes || []), {
            id: takeId, image: takeRel, hash, model, resolution, aspectRatio, createdAt: new Date().toISOString(),
          }];
          bucket.active = takeId;
          bucket.image = activeRel;
          generated++;
          console.log(`✔ Wrote ${activeRel} (take ${takeId})`);
        }
      }
    }
  }

  if (opts.dryRun) {
    console.log(JSON.stringify({ comicId, mode, model, resolution, targets: dryReport }, null, 2));
    return { ok: true, dryRun: true, targets: dryReport, generated: 0, cached: 0 };
  }

  index.updatedAt = new Date().toISOString();
  mkdirSync(illDir, { recursive: true });
  writeFileSync(indexPath, JSON.stringify(index, null, 2));
  writeManifestJs(comicId, illDir, index);
  ensureAssetIllustratedField(dirAbs);
  console.log(`✔ Updated ${relative(ROOT, join(illDir, 'manifest.js'))} (generated: ${generated}, cached: ${cached})`);
  return { ok: true, generated, cached };
}

// ---------- CLI entry ----------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const comicId = argv.find(a => !a.startsWith('--'));
  if (!comicId || argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: GEMINI_API_KEY=... node scripts/illustrate_comic.mjs <comic_id> [--page=1] [--panel=5] [--mode=page|panel] [--resolution=2K] [--force] [--approve=<take_id>] [--dry-run]');
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
    panel: flag('panel'),
    mode: flag('mode'),
    resolution: flag('resolution'),
    model: flag('model'),
    approve: flag('approve'),
    force: argv.includes('--force'),
    dryRun: argv.includes('--dry-run'),
    chrome: flag('chrome'),
  };
  try {
    await illustrateComic(comicId, opts);
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}
