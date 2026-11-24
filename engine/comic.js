// engine/comic.js: shared comic page layout, panel framing, lettering primitives, and multi-edition renderer.
// Used by studio.html (interactive + ?render), headless build scripts (scripts/build_comic.mjs), and every comic.js.

const COMIC_INK = '#3B2530';
const FONT_COMIC = '"Fredoka", "Comic Sans MS", "Chalkboard SE", system-ui, sans-serif';
const FONT_DISPLAY = '"Luckiest Guy", "Fredoka", Impact, sans-serif';

let _panelOx = 0, _panelOy = 0;

function toPanelLocal(pt) {
  return pt ? [pt[0] - _panelOx, pt[1] - _panelOy] : null;
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapLines(text, maxW, font) {
  X.save();
  X.font = font;
  const paragraphs = String(text).split('\n');
  const lines = [];
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(''); continue; }
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (cur && X.measureText(test).width > maxW) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
  }
  X.restore();
  return lines;
}

function drawPanelFrame(x, y, w, h, paintFn, opts = {}) {
  const ink = opts.ink || COMIC_INK;
  const shadow = opts.shadow !== false;
  const border = opts.border !== false;
  const borderWidth = opts.borderWidth ?? 6;

  if (shadow) {
    X.save();
    X.fillStyle = opts.shadowColor || 'rgba(59, 37, 48, 0.14)';
    X.fillRect(x + 6, y + 6, w, h);
    X.restore();
  }

  X.save();
  X.beginPath();
  X.rect(x, y, w, h);
  X.clip();
  X.translate(x, y);
  const prevOx = _panelOx, prevOy = _panelOy;
  _panelOx = x; _panelOy = y;
  try {
    paintFn(w, h);
  } finally {
    _panelOx = prevOx; _panelOy = prevOy;
  }
  X.restore();

  if (border) {
    X.save();
    X.strokeStyle = ink;
    X.lineWidth = borderWidth;
    X.lineJoin = 'miter';
    X.strokeRect(x, y, w, h);
    X.restore();
  }
}

function drawCaptionBox(text, x, y, opts = {}) {
  const ink = opts.ink || COMIC_INK;
  const fontSize = opts.size || 24;
  const padX = opts.padX ?? 16;
  const padY = opts.padY ?? 9;
  const maxW = opts.maxW || 0;
  const font = `700 ${fontSize}px ${FONT_COMIC}`;
  const lines = maxW ? wrapLines(text, maxW, font) : String(text).split('\n');
  const lh = fontSize * 1.2;

  X.save();
  X.font = font;
  const tw = Math.max(...lines.map(l => X.measureText(l).width));
  const bw = tw + padX * 2;
  const bh = Math.max(fontSize, lines.length * lh) + padY * 2;
  const bx = opts.align === 'right' ? x - bw : opts.align === 'center' ? x - bw / 2 : x;

  X.fillStyle = 'rgba(59, 37, 48, 0.22)';
  X.fillRect(bx + 4, y + 4, bw, bh);

  X.fillStyle = opts.fill || '#FFF1A8';
  X.strokeStyle = ink;
  X.lineWidth = opts.borderWidth ?? 4;
  X.fillRect(bx, y, bw, bh);
  X.strokeRect(bx, y, bw, bh);

  X.fillStyle = opts.color || ink;
  X.textAlign = 'left';
  X.textBaseline = 'middle';
  lines.forEach((l, i) => {
    const ly = y + bh / 2 - ((lines.length - 1) * lh) / 2 + i * lh + 1;
    X.fillText(l, bx + padX, ly);
  });
  X.restore();
}

function drawSpeechBubble(text, cx, cy, tx, ty, opts = {}) {
  const ink = opts.ink || COMIC_INK;
  const size = opts.size || 25;
  const maxW = opts.maxW || 280;
  const font = `${opts.weight || 600} ${size}px ${FONT_COMIC}`;
  const lines = opts.lines || wrapLines(text, maxW, font);

  X.save();
  X.font = font;
  const widths = lines.map(l => X.measureText(l).width);
  const textW = Math.max(...widths);
  const lh = size * 1.22;
  const padX = opts.padX ?? size * 0.9;
  const padY = opts.padY ?? size * 0.65;
  const rx = Math.max(textW / 2 + padX, opts.minRx ?? 54);
  const ry = Math.max((lines.length * lh) / 2 + padY, opts.minRy ?? 32);

  const hasTail = tx != null && ty != null && opts.tail !== false;
  const fill = opts.fill || '#FFFDF8';

  let tailPts = null;
  if (hasTail) {
    const ang = Math.atan2(ty - cy, tx - cx);
    const dist = Math.hypot(tx - cx, ty - cy);
    const rim = a => [cx + Math.cos(a) * rx * 0.86, cy + Math.sin(a) * ry * 0.86];
    const spread = opts.tailSpread ?? 0.2;
    const b1 = rim(ang - spread);
    const b2 = rim(ang + spread);
    const tipLen = Math.max(0, dist - (opts.tailGap ?? 10));
    const tip = [cx + Math.cos(ang) * tipLen, cy + Math.sin(ang) * tipLen];
    const curve = opts.tailCurve ?? 14;
    const mid = [
      lerp(b1[0], tip[0], 0.55) + Math.cos(ang + Math.PI / 2) * curve,
      lerp(b1[1], tip[1], 0.55) + Math.sin(ang + Math.PI / 2) * curve,
    ];
    tailPts = [b1, mid, tip, b2];
  }

  const traceTail = () => {
    if (!tailPts) return;
    X.beginPath();
    X.moveTo(tailPts[0][0], tailPts[0][1]);
    X.quadraticCurveTo(tailPts[1][0], tailPts[1][1], tailPts[2][0], tailPts[2][1]);
    X.lineTo(tailPts[3][0], tailPts[3][1]);
    X.closePath();
  };

  // Drop shadow
  X.save();
  X.translate(5, 6);
  X.fillStyle = 'rgba(59, 37, 48, 0.18)';
  X.beginPath();
  X.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  X.fill();
  if (tailPts) { traceTail(); X.fill(); }
  X.restore();

  // Thick outer ink stroke on both shapes (union look)
  X.strokeStyle = ink;
  X.lineWidth = opts.borderWidth ?? 8.5;
  X.lineJoin = 'round';
  X.beginPath();
  X.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  X.stroke();
  if (tailPts) { traceTail(); X.stroke(); }

  // Interior fill (hides inner seam)
  X.fillStyle = fill;
  X.beginPath();
  X.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  X.fill();
  if (tailPts) { traceTail(); X.fill(); }

  // Text
  X.fillStyle = opts.color || ink;
  X.textAlign = 'center';
  X.textBaseline = 'middle';
  lines.forEach((l, i) => {
    const ly = cy - ((lines.length - 1) * lh) / 2 + i * lh + 1;
    X.fillText(l, cx, ly);
  });
  X.restore();
}

function drawComicSfx(text, x, y, opts = {}) {
  const ink = opts.ink || COMIC_INK;
  const size = opts.size || 46;
  const rot = opts.rot ?? -0.1;
  X.save();
  X.translate(x, y);
  X.rotate(rot);
  X.font = `700 ${size}px ${FONT_DISPLAY}`;
  X.textAlign = opts.align || 'center';
  X.textBaseline = 'middle';
  X.lineJoin = 'round';
  X.lineWidth = Math.max(8, size * 0.22);
  X.strokeStyle = ink;
  X.strokeText(text, 3, 4);
  X.strokeStyle = opts.outline || '#FFFDF8';
  X.lineWidth = Math.max(6, size * 0.16);
  X.strokeText(text, 0, 0);
  X.fillStyle = opts.fill || '#FF6E8E';
  X.fillText(text, 0, 0);
  X.strokeStyle = ink;
  X.lineWidth = 2.6;
  X.strokeText(text, 0, 0);
  X.restore();
}

function drawPageMasthead(masthead, { width, margin, ink = COMIC_INK }) {
  if (!masthead) return;
  const titleY = masthead.titleY ?? 86;
  const subtitleY = masthead.subtitleY ?? 84;
  const ruleY = masthead.ruleY ?? 98;
  X.save();
  X.fillStyle = masthead.color || ink;
  X.font = `700 ${masthead.titleSize || 46}px ${FONT_DISPLAY}`;
  X.textAlign = 'left';
  X.textBaseline = 'alphabetic';
  if (masthead.title) X.fillText(masthead.title, margin + 2, titleY);
  if (masthead.subtitle) {
    X.font = `600 ${masthead.subtitleSize || 20}px ${FONT_COMIC}`;
    X.fillStyle = masthead.subtitleColor || '#735361';
    X.textAlign = 'right';
    X.fillText(masthead.subtitle, width - margin, subtitleY);
  }
  if (masthead.rule !== false) {
    line([[margin, ruleY], [width - margin, ruleY]], { stroke: ink, lwPx: 4 });
  }
  X.restore();
}

function drawImageCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale, sh = h / scale;
  const sx = (iw - sw) / 2, sy = (ih - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawImageContain(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const scale = Math.min(w / iw, h / ih);
  const dw = iw * scale, dh = ih * scale;
  const dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
  ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
}

// Render a 1920x1080 3D LOCATIONS.* scene into an arbitrary panel rectangle without mutating global W / H.
let _comicLocCanvas = null;
function drawLocationInPanel(pw, ph, render1080pFn) {
  if (!_comicLocCanvas) {
    _comicLocCanvas = document.createElement('canvas');
    _comicLocCanvas.width = W;
    _comicLocCanvas.height = H;
  }
  const prevX = X;
  const ctx = _comicLocCanvas.getContext('2d');
  if (typeof _trackCtx === 'function') _trackCtx(ctx);
  X = ctx;
  try {
    X.setTransform(1, 0, 0, 1, 0, 0);
    X.clearRect(0, 0, W, H);
    X.save();
    render1080pFn(W, H);
    X.restore();
  } finally {
    X = prevX;
  }
  drawImageCover(X, _comicLocCanvas, 0, 0, pw, ph);
}

// Resolve normalized panel fractions (0 < v <= 1), negative edge offsets (v < 0 -> dim + v), or literal pixels (> 1).
function _panelCoord(v, dim) {
  if (v == null) return null;
  if (v > 0 && v <= 1) return v * dim;
  if (v < 0) return dim + v;
  return v;
}

function drawPanelLettering(panel, pw, ph, opts = {}) {
  const L = panel.lettering;
  if (L) {
    for (const c of L.captions || []) {
      drawCaptionBox(c.text, _panelCoord(c.x, pw), _panelCoord(c.y, ph), { ...opts, ...c });
    }
    for (const s of L.sfx || []) {
      drawComicSfx(s.text, _panelCoord(s.x, pw), _panelCoord(s.y, ph), { ...opts, ...s });
    }
    for (const b of L.bubbles || []) {
      drawSpeechBubble(
        b.text,
        _panelCoord(b.cx, pw),
        _panelCoord(b.cy, ph),
        _panelCoord(b.tx, pw),
        _panelCoord(b.ty, ph),
        { ...opts, ...b }
      );
    }
  }
  if (typeof panel.drawLettering === 'function') {
    panel.drawLettering(pw, ph);
  }
}

// Deterministic layout solver shared by Studio rendering, clean panel exports, and Gemini aspect-ratio matching.
function computePageLayout(comicDef, pageIndex = 0) {
  const page = comicDef.pages?.[pageIndex];
  if (!page) throw new Error(`comic "${comicDef.id || '?'}" has no page at index ${pageIndex}`);
  const bookMeta = (typeof BOOKS !== 'undefined' && comicDef.book && BOOKS[comicDef.book]) || null;
  const width = page.width ?? comicDef.width ?? bookMeta?.size?.width ?? 1700;
  const height = page.height ?? comicDef.height ?? bookMeta?.size?.height ?? 2200;
  const margin = page.margin ?? comicDef.margin ?? 52;
  const bottomMargin = page.bottomMargin ?? comicDef.bottomMargin ?? 54;
  const gutter = page.gutter ?? comicDef.gutter ?? 20;
  const innerW = width - margin * 2;
  const topY = page.topY ?? (page.masthead ? (page.masthead.bottom ?? 116) : margin);

  const rows = page.rows || [];
  const totalGutterY = Math.max(0, rows.length - 1) * gutter;
  const fixedH = rows.reduce((sum, r) => sum + (r.height > 0 ? r.height : 0), 0);
  const flexRows = rows.filter(r => !(r.height > 0));
  const totalWeightY = flexRows.reduce((sum, r) => sum + (r.weight ?? 1), 0);
  const availH = Math.max(0, height - topY - bottomMargin - totalGutterY - fixedH);

  let y = topY;
  let flexUsedY = 0;
  let flexIdxY = 0;
  let panelIndex = 0;
  const panels = [];

  rows.forEach((row, rowIndex) => {
    let rh;
    if (row.height > 0) {
      rh = row.height;
    } else {
      flexIdxY++;
      if (flexIdxY === flexRows.length) {
        rh = Math.max(40, availH - flexUsedY);
      } else {
        rh = Math.max(40, Math.floor(availH * ((row.weight ?? 1) / (totalWeightY || 1))));
        flexUsedY += rh;
      }
    }

    const rowPanels = row.panels || [];
    const totalGutterX = Math.max(0, rowPanels.length - 1) * gutter;
    const fixedW = rowPanels.reduce((sum, p) => sum + (p.width > 0 ? p.width : 0), 0);
    const flexPanels = rowPanels.filter(p => !(p.width > 0));
    const totalWeightX = flexPanels.reduce((sum, p) => sum + (p.weight ?? 1), 0);
    const availW = Math.max(0, innerW - totalGutterX - fixedW);

    let x = margin;
    let flexUsedX = 0;
    let flexIdxX = 0;

    rowPanels.forEach((panel, colIndex) => {
      let pw;
      if (panel.width > 0) {
        pw = panel.width;
      } else {
        flexIdxX++;
        if (flexIdxX === flexPanels.length) {
          pw = Math.max(40, availW - flexUsedX);
        } else {
          pw = Math.max(40, Math.floor(availW * ((panel.weight ?? 1) / (totalWeightX || 1))));
          flexUsedX += pw;
        }
      }
      const id = panel.id || `panel-${String(panelIndex + 1).padStart(2, '0')}`;
      panels.push({
        id,
        panel,
        index: panelIndex,
        rowIndex,
        colIndex,
        x,
        y,
        w: pw,
        h: rh,
      });
      x += pw + gutter;
      panelIndex++;
    });

    y += rh + gutter;
  });

  return {
    pageId: page.id || `page-${String(pageIndex + 1).padStart(2, '0')}`,
    page,
    width,
    height,
    margin,
    gutter,
    topY,
    panels,
  };
}

// Extract structured verbatim dialogue / captions / SFX from declarative panels (used by Gemini page-mode prompts).
function extractPageScript(comicDef, pageIndex = 0) {
  const layout = computePageLayout(comicDef, pageIndex);
  return {
    pageId: layout.pageId,
    masthead: layout.page.masthead || null,
    panels: layout.panels.map(({ id, index, w, h, panel }) => ({
      id,
      index: index + 1,
      width: w,
      height: h,
      cast: panel.cast || null,
      prompt: panel.prompt || '',
      captions: (panel.lettering?.captions || []).map(c => c.text),
      bubbles: (panel.lettering?.bubbles || []).map(b => ({ speaker: b.speaker || '', text: b.text })),
      sfx: (panel.lettering?.sfx || []).map(s => s.text),
    })),
  };
}

function renderComicPage(canvas, comicDef, pageIndex = 0, opts = {}) {
  const layout = computePageLayout(comicDef, pageIndex);
  const { page, width, height, margin, panels } = layout;
  const edition = opts.edition || 'studio';
  const lettering = opts.lettering !== false;
  const panelFilter = opts.panelIndex != null ? opts.panelIndex : null;
  const ink = page.ink || comicDef.ink || COMIC_INK;
  const paper = page.paper || comicDef.paper || '#FFFDF7';
  const images = opts.images || {};
  const mode = opts.mode || (images.panels && Object.keys(images.panels).length ? 'panel' : 'page');

  const prevX = X;
  const target = panelFilter != null ? panels[panelFilter] : null;
  if (panelFilter != null && !target) {
    throw new Error(`panelIndex ${panelFilter} out of range for "${comicDef.id}" page ${pageIndex + 1} (${panels.length} panels)`);
  }

  const cw = target ? target.w : width;
  const ch = target ? target.h : height;
  if (canvas.width !== cw) canvas.width = cw;
  if (canvas.height !== ch) canvas.height = ch;

  const ctx = canvas.getContext('2d');
  if (typeof _trackCtx === 'function') _trackCtx(ctx);
  X = ctx;

  try {
    T = 0;
    if (typeof boilSeed === 'function') boilSeed(0);
    if (typeof OVERLAYS !== 'undefined') OVERLAYS = [];
    if (typeof CAM !== 'undefined') CAM = null;
    if (typeof JIT !== 'undefined') JIT = 0;
    if (typeof LIGHT !== 'undefined') LIGHT = null;
    if (typeof GRADE !== 'undefined') GRADE = null;

    X.setTransform(1, 0, 0, 1, 0, 0);
    X.globalAlpha = 1;
    X.globalCompositeOperation = 'source-over';

    // Single-panel borderless view / export mode (used by Studio panel switcher, build_comic.mjs --panels, and per-panel Gemini mode)
    if (target) {
      X.fillStyle = paper;
      X.fillRect(0, 0, cw, ch);
      const prevOx = _panelOx, prevOy = _panelOy;
      _panelOx = 0; _panelOy = 0;
      try {
        const panelImg = edition === 'illustrated' ? images.panels?.[target.id] : null;
        if (panelImg) {
          drawImageCover(X, panelImg, 0, 0, cw, ch);
          if (lettering) drawPanelLettering(target.panel, cw, ch, { ink });
        } else if (edition === 'illustrated' && images.page) {
          // Crop the matching panel rectangle from the full-page illustrated image (already contains illustrated lettering)
          const iw = images.page.naturalWidth || images.page.width;
          const ih = images.page.naturalHeight || images.page.height;
          if (iw && ih) {
            const scale = Math.min(width / iw, height / ih);
            const dx = (width - iw * scale) / 2;
            const dy = (height - ih * scale) / 2;
            const sx = (target.x - dx) / scale;
            const sy = (target.y - dy) / scale;
            const sw = target.w / scale;
            const sh = target.h / scale;
            X.drawImage(images.page, sx, sy, sw, sh, 0, 0, cw, ch);
          }
        } else {
          if (typeof target.panel.draw === 'function') {
            target.panel.draw(cw, ch);
          }
          if (lettering) {
            drawPanelLettering(target.panel, cw, ch, { ink });
          }
        }
      } finally {
        _panelOx = prevOx; _panelOy = prevOy;
      }
      return layout;
    }

    // Full page paper background
    X.fillStyle = paper;
    X.fillRect(0, 0, width, height);

    // Full-page illustrated mode
    if (edition === 'illustrated' && mode === 'page' && images.page) {
      drawImageContain(X, images.page, 0, 0, width, height);
      return layout;
    }

    // Decorative outer page hairline border
    if (page.outerBorder !== false && comicDef.outerBorder !== false) {
      X.save();
      X.strokeStyle = 'rgba(59, 37, 48, 0.14)';
      X.lineWidth = 2;
      X.strokeRect(24, 24, width - 48, height - 48);
      X.restore();
    }

    // Optional masthead header
    drawPageMasthead(page.masthead, { width, margin, ink });

    // Panels (Studio mode, or Illustrated per-panel mode with crisp vector frames + lettering)
    for (const slot of panels) {
      const panelImg = edition === 'illustrated' ? images.panels?.[slot.id] : null;
      drawPanelFrame(slot.x, slot.y, slot.w, slot.h, (pw, ph) => {
        if (panelImg) {
          drawImageCover(X, panelImg, 0, 0, pw, ph);
        } else if (typeof slot.panel.draw === 'function') {
          slot.panel.draw(pw, ph);
        }
        if (lettering) {
          drawPanelLettering(slot.panel, pw, ph, { ink });
        }
      }, { ink, ...(slot.panel.frame || {}) });
    }
  } finally {
    X = prevX;
  }

  return layout;
}
