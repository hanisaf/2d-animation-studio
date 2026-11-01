// scenes/lectures/scene49_py01_analytics_pipeline/lecture_kit.js: the shared kit for the Python lectures (scenes 49–63).
//
// Each Python lecture is the lecture hall's big chalkboard, painted solid black (lectureHall `blackBoard`), with
// white chalk and UGA red. There are no characters: the board is the whole show, and the narration is a voice-over
// recorded separately (the script and its cue times are in each scene's README.md).
// Later lectures borrow this file with `uses: ['scene49_py01_analytics_pipeline']` in their asset.js.
//
//   lkTiming(narration, pace)   → the narration lines with `at` (start, s) and `dur` (s), from word counts.
//                                 pace: { wps: words per second, gap: s between lines, panelGap: extra s before a new
//                                 panel, lead: s before the first line, minDur }. A line's `pause` adds silence after it.
//   lecture({ narration, pace, module, title, footer, panels })  registers the scene. panels[n - 1] = { title, draw(u, b) }:
//                                 u = seconds since the panel began, b(i) = seconds since its i-th line began.
//                                 Panel 1 is the title card (no header). Every panel is a pure function of time.
//
// Board-local coords: origin at the board's top-left, world units, y down, 1320 × 680 (lectureHall.BIG_BOARD).
// Chalk helpers: lkText, lkCode (monospace), lkLine, lkArrow, lkCircle, lkRect, lkCell (a notebook cell), lkTable,
// lkCheck, lkCross; lkK(b, delay, dur) is a 0..1 reveal once a beat passes `delay`.
const LK = {
  chalk: '#F6F6F2', dim: 'rgba(246,246,242,.58)', faint: 'rgba(246,246,242,.24)', ghost: 'rgba(246,246,242,.08)',
  red: '#E4002B', redDk: '#BA0C2F', redFill: 'rgba(228,0,43,.20)', chalkFill: 'rgba(246,246,242,.07)',
};
const LK_W = 1320, LK_H = 680, LK_ERASE = 1.1;
const LK_MONO = '"Fira Mono", "Menlo", "Consolas", monospace';

// ---------- timing: the narration is a voice-over, so each line gets time from its word count ----------
const lkWords = s => s.replace(/[*_`]/g, '').trim().split(/\s+/).filter(Boolean).length;
function lkTiming(narration, pace = {}) {
  const p = { wps: 2.45, gap: .55, panelGap: 1.3, lead: 5, minDur: 1.4, ...pace };
  let t = p.lead, prev = null;
  return narration.map(l => {
    if (prev) t += prev.dur + p.gap + (prev.pause ?? 0) + (l.panel !== prev.panel ? p.panelGap : 0);
    const out = { ...l, at: +t.toFixed(2), dur: +Math.max(p.minDur, lkWords(l.text) / p.wps).toFixed(2) };
    return (prev = out);
  });
}

// ---------- chalk primitives (board coords) ----------
const lkK = (b, delay = 0, dur = .9) => ease(seg(b, delay, delay + dur));
function lkText(txt, x, y, size, col = LK.chalk, k = 1, align = 'left', weight = 600, font = FONT_TALK) {
  if (k <= 0 || !txt) return 0;
  X.save(); X.font = `${weight} ${size}px ${font}`; X.textBaseline = 'middle'; X.textAlign = 'left';
  const w = X.measureText(txt).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  if (k < 1) { X.beginPath(); X.rect(x0 - 4, y - size, (w + 8) * k, size * 2); X.clip(); }
  X.fillStyle = col; X.globalAlpha *= .94; X.fillText(txt, x0, y);
  X.globalAlpha *= .28; X.fillText(txt, x0 + .9, y - .7);                       // a dusty second pass
  X.restore();
  return w;
}
const lkCode = (txt, x, y, size, col = LK.chalk, k = 1, align = 'left') => lkText(txt, x, y, size, col, k, align, 500, LK_MONO);
// Width of a string, for laying out several coloured pieces on one line.
function lkMeasure(txt, size, weight = 600, font = FONT_TALK) { X.save(); X.font = `${weight} ${size}px ${font}`; const w = X.measureText(txt).width; X.restore(); return w; }
// A line of code in several colours: parts = [[text, colour], …]; k writes it on left to right.
function lkCodeParts(parts, x, y, size, k = 1) {
  if (k <= 0) return;
  const total = parts.reduce((s, [txt]) => s + lkMeasure(txt, size, 500, LK_MONO), 0);
  X.save(); if (k < 1) { X.beginPath(); X.rect(x - 4, y - size, (total + 8) * k, size * 2); X.clip(); }
  let cx = x; for (const [txt, col] of parts) { lkCode(txt, cx, y, size, col ?? LK.chalk); cx += lkMeasure(txt, size, 500, LK_MONO); }
  X.restore();
}
function lkLine(pts, k = 1, col = LK.chalk, lw = 4, o = {}) {
  if (k <= 0 || pts.length < 2) return;
  line(k >= 1 ? pts : polySlice(pts, 0, k), { stroke: col, lw, alpha: o.alpha ?? .92, dash: o.dash, smooth: o.smooth });
}
function lkArrow(pts, k = 1, col = LK.chalk, lw = 4, o = {}) {
  lkLine(pts, k, col, lw, o);
  if (k < .97) return;
  const n = pts.length, [x1, y1] = pts[n - 1], [x0, y0] = o.smooth && n > 2 ? polyAt(pts, .96) : pts[n - 2], a = Math.atan2(y1 - y0, x1 - x0), h = o.head ?? 16;
  line([[x1 - h * Math.cos(a - .45), y1 - h * Math.sin(a - .45)], [x1, y1], [x1 - h * Math.cos(a + .45), y1 - h * Math.sin(a + .45)]], { stroke: col, lw, alpha: .92 });
}
function lkCircle(cx, cy, r, k = 1, col = LK.chalk, lw = 4, fill, ry) {
  if (k <= 0) return;
  if (fill && k >= 1) ellipse(cx, cy, r, ry ?? r, { fill, stroke: null });
  X.beginPath(); X.ellipse(cx, cy, r, ry ?? r, 0, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(k));
  X.save(); X.globalAlpha *= .92; X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; X.stroke(); X.restore();
}
function lkRect(x, y, w, h, k = 1, col = LK.chalk, lw = 4, fill, o = {}) {
  if (k <= 0) return;
  if (fill && k >= 1) shape(rectPts(x, y, w, h), { fill, stroke: null });
  lkLine([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], k, col, lw, o);
}
// A hand-drawn loop around something (an imperfect ellipse that overshoots its start).
function lkLoop(cx, cy, rx, ry, k = 1, col = LK.red, lw = 5) {
  const pts = []; for (let i = 0; i <= 40; i++) { const a = -2.2 + i / 40 * (TAU + .5), r = 1 + .05 * Math.sin(i * .9); pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
  lkLine(pts, k, col, lw, { smooth: true });
}
const lkCheck = (x, y, s, k = 1, col = LK.chalk) => lkLine([[x - s * .5, y], [x - s * .12, y + s * .4], [x + s * .55, y - s * .45]], k, col, Math.max(3, s * .14));
const lkCross = (x, y, s, k = 1, col = LK.red) => { lkLine([[x - s / 2, y - s / 2], [x + s / 2, y + s / 2]], clamp(k * 2), col, Math.max(3, s * .14)); lkLine([[x + s / 2, y - s / 2], [x - s / 2, y + s / 2]], clamp(k * 2 - 1), col, Math.max(3, s * .14)); };
// A numbered badge: a red disc with a white number.
function lkBadge(n, x, y, r, k = 1) { if (k <= 0) return; X.save(); X.globalAlpha *= k; circle(x, y, r, { fill: LK.redDk, stroke: null }); X.restore(); lkText(String(n), x, y + 1, r * 1.2, LK.chalk, k, 'center', 700); }
// A notebook cell: the `In [n]:` prompt on the left, a framed box, one or more code lines, and optional output below.
// o: { n (counter, or ' '), lines: [string | parts], size, k (box), kc (code), ko (output), out: [string], md (a Markdown
// cell: no prompt), hl (highlight the counter in red) }. Returns the y below the cell.
function lkCell(x, y, w, o = {}) {
  const size = o.size ?? 28, lh = size * 1.45, lines = o.lines ?? [], h = Math.max(1, lines.length) * lh + size * .9, k = o.k ?? 1;
  if (!o.md) lkCode(`In [${o.n ?? ' '}]:`, x - 14, y + h / 2, size * .82, o.hl ? LK.red : LK.dim, k, 'right');
  lkRect(x, y, w, h, k, o.md ? LK.faint : LK.dim, 3, o.md ? null : LK.chalkFill);
  lines.forEach((ln, i) => {
    const kc = clamp((o.kc ?? 1) * lines.length - i), cy = y + size * .45 + lh * (i + .5);
    if (Array.isArray(ln)) lkCodeParts(ln, x + 18, cy, size, kc);
    else if (o.md) lkText(ln, x + 18, cy, size, LK.chalk, kc, 'left', 600);
    else lkCode(ln, x + 18, cy, size, LK.chalk, kc);
  });
  let yy = y + h;
  (o.out ?? []).forEach((ln, i) => { lkCode(ln, x + 18, yy + lh * (i + .7), size, LK.red, clamp((o.ko ?? 1) * o.out.length - i)); });
  if (o.out?.length) yy += lh * (o.out.length + .4);
  return yy;
}
// A small table: cols = [{ label, w, align }], rows = [[cells]]; kRow(i) = reveal of row i (header uses kRow(-1)).
function lkTable(x, y, cols, rows, o = {}) {
  const size = o.size ?? 24, rh = o.rh ?? size * 1.7, kRow = o.kRow ?? (() => 1), mono = o.mono ?? true;
  const W = cols.reduce((s, c) => s + c.w, 0);
  const cell = (txt, cx, cw, cy, col, k, align, head) => {
    const ax = align === 'right' ? cx + cw - 12 : align === 'center' ? cx + cw / 2 : cx + 12;
    if (head || !mono) lkText(txt, ax, cy, size, col, k, align ?? 'left', head ? 700 : 600); else lkCode(txt, ax, cy, size, col, k, align ?? 'left');
  };
  let cx = x; const kh = kRow(-1);
  cols.forEach(c => { cell(c.label, cx, c.w, y + rh / 2, o.headCol ?? LK.red, kh, c.align, true); cx += c.w; });
  lkLine([[x, y + rh], [x + W, y + rh]], kh, LK.chalk, 3);
  rows.forEach((r, i) => {
    const k = kRow(i), cy = y + rh * (i + 1.5), hl = o.hl?.(i);
    if (hl && k > 0) lkRect(x - 6, y + rh * (i + 1) + 3, W + 12, rh - 6, k, LK.red, 3, LK.redFill);
    let cx2 = x; r.forEach((v, j) => { cell(String(v), cx2, cols[j].w, cy, hl ? LK.chalk : cols[j].col ?? LK.chalk, k, cols[j].align); cx2 += cols[j].w; });
  });
  return y + rh * (rows.length + 1);
}

// ---------- the lecture ----------
// Registers the scene: board painter, panel changes (an eraser sweep), cameras and shots, all from the narration timing.
function lecture(def) {
  const HALL = LOCATIONS.lecture_hall, BB = HALL.BIG_BOARD;
  const LINES = lkTiming(def.narration, def.pace), COUNT = def.panels.length;
  const BEATS = {}; for (const l of LINES) (BEATS[l.panel] ??= []).push(l.at);
  const last = LINES[LINES.length - 1], END = last.at + last.dur + (def.tail ?? 4.5);
  const panelStart = n => BEATS[n][0];
  function slideAt(t) { let n = 1; for (let i = 2; i <= COUNT; i++) if (t >= panelStart(i) - .35) n = i; return n; }

  function header(n, k) {
    lkBadge(String(n).padStart(2, '0'), 64, 56, 30, k);
    lkText(def.panels[n - 1].title, 114, 56, 44, LK.chalk, k, 'left', 700);
    lkLine([[40, 98], [1280, 98]], k, LK.redDk, 3);
  }
  function footer(n, k) {
    for (let i = 0; i < COUNT; i++) {
      const on = i + 1 === n, past = i + 1 < n;
      circle(52 + i * 24, 650, on ? 7.5 : 4.5, { fill: on ? LK.red : past ? LK.dim : null, stroke: on ? null : LK.faint, lw: 2, alpha: k });
    }
    lkText(def.footer, 1278, 650, 21, LK.faint, k, 'right', 600);
  }
  function drawPanel(n, t) {
    const beats = BEATS[n], b = i => t - (beats[i] ?? 1e9), u = n === 1 ? t - 1 : t - beats[0] + .35;   // the title card starts chalking as the camera pushes in
    def.panels[n - 1].draw(u, b);
    if (n > 1) { header(n, lkK(u, 0, .8)); footer(n, 1); } else footer(n, lkK(u, 4, 1));
  }
  function board(t) {
    const n = slideAt(t), next = BEATS[n + 1]?.[0], e = next ? seg(t, next - .35 - LK_ERASE, next - .35) : 0;
    withBoil(0, () => {
      if (e <= 0) return drawPanel(n, t);
      const ex = lerp(-140, LK_W + 140, ease(e));                               // an eraser sweeps the panel off, left to right
      X.save(); X.beginPath(); X.rect(ex, 0, LK_W, LK_H); X.clip(); drawPanel(n, t); X.restore();
      X.fillStyle = linGrad(ex - 170, 0, ex, 0, [[0, 'rgba(246,246,242,0)'], [1, 'rgba(246,246,242,.10)']]); X.fillRect(ex - 170, 0, 170, LK_H);
    });
  }

  // ---------- cameras: the board always takes centre stage ----------
  // full(): the whole board fills the frame. (bx, by) is the board point at the centre of the frame, `w` the board width
  // in screen px; the camera dollies straight at the board.
  const BOARD_Z = 2300, boardPt = (bx, by) => [BB.x + bx, BB.y - by];
  function frame(bx, by, w) {
    const k = w / LK_W, f = 1000, z = BOARD_Z - f / k, [X0, Y0] = boardPt(bx, by);
    return { x: X0, y: Y0, z, f, hy: H / 2 };
  }
  const FULL = [LK_W / 2, LK_H / 2 + 6, 1700];
  const WIDE = { x: 0, y: 430, z: 640, f: 1000, hy: 575 };
  const mixCam = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k), f: lerp(a.f, b.f, k), hy: lerp(a.hy, b.hy, k) });
  function paint(t, cam) {
    const P = persp(cam);
    HALL.back(P, t, { bigBoard: board, blackBoard: true, screen: 0, projector: 0 });
  }
  // a gentle drift so the camera is never still: d = ±1 picks the direction
  const drift = (lt, d) => frame(FULL[0] + d * (6 - .45 * lt), FULL[1], FULL[2] + .9 * lt);
  const shots = [];
  // opening: from the empty rows, push in until the board fills the frame
  const inDur = Math.min(7, panelStart(1) + 3);
  shots.push([0, (t, lt) => paint(t, mixCam(WIDE, frame(...FULL), ease(seg(lt, .6, inDur))))]);
  // every panel: one drifting full-board shot, alternating direction; optional focus shots on a region of the board
  for (let n = 2; n <= COUNT; n++) shots.push([panelStart(n) - .35, (t, lt) => paint(t, drift(lt, n % 2 ? 1 : -1))]);
  shots.push([inDur, (t, lt) => paint(t, drift(lt + inDur, -1))]);
  for (const fz of def.focus ?? []) {                                          // { panel, line, to: line, rect: [x, y, w, h] }
    const a = BEATS[fz.panel][fz.line] - .3, b = fz.to !== undefined ? BEATS[fz.panel][fz.to] - .3 : null;
    const [rx, ry, rw, rh] = fz.rect, w = Math.min(2300, LK_W / rw * 1500, LK_W / rh * 900);   // the region fills most of the frame
    const k = w / LK_W, hx = W / 2 / k, hy = H / 2 / k;                       // keep the frame on the board (its black frame may show)
    const cx = clamp(rx + rw / 2, hx - 22, LK_W - hx + 22), cy = clamp(ry + rh / 2, hy - 20, LK_H - hy + 20);
    shots.push([a, (t, lt) => paint(t, frame(cx - .4 * clamp(lt, 0, 20), cy, w * (1 + .0012 * clamp(lt, 0, 20))))]);
    if (b) shots.push([b, (t, lt) => paint(t, drift(lt, fz.panel % 2 ? -1 : 1))]);
  }
  // closing: pull back to the wide shot and fade to black
  const outAt = last.at + last.dur + .8;
  shots.push([outAt, (t, lt, dur) => {
    paint(t, mixCam(frame(...FULL), WIDE, ease(seg(lt, 0, dur - .6))));
    const k = seg(lt, dur - 1.6, dur); if (k > 0) overlay(() => { X.fillStyle = `rgba(0,0,0,${k.toFixed(3)})`; X.fillRect(0, 0, W, H); });
  }]);
  // the opening: fade in from black
  const open0 = shots[0][1]; shots[0][1] = (t, lt, dur) => { open0(t, lt, dur); const k = 1 - seg(lt, 0, .9); if (k > 0) overlay(() => { X.fillStyle = `rgba(0,0,0,${k.toFixed(3)})`; X.fillRect(0, 0, W, H); }); };

  return scene({ duration: Math.ceil(END), fps: 24, bpm: 80, shots, narration: LINES });
}
