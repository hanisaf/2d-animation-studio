// scenes/lectures/scene27_dynamics_of_mirroring/board.js: the twelve chalk panels on the lecture hall's big board.
//
//   mbBoard(t)      draws the board content for scene time t (pass it as lectureHall.back(P, t, { bigBoard: mbBoard })).
//   mbSlideAt(t)    → { n, start }: the panel on the board at time t (1–12) and when it started.
//
// Board-local coords: origin at the board's top-left, world units, y down, 1320 × 680 (lectureHall.BIG_BOARD).
// Every panel is a pure function of time. A panel starts with its first dialogue line (asset.js `slide`), and each
// element chalks itself on when the line that mentions it begins: b(i) = seconds since the panel's i-th line began.
// When the panel changes, an eraser sweeps the old one off (MB_ERASE seconds before the new one starts).
const MB_LINES = ASSETS.scene.scene27_dynamics_of_mirroring.dialogue;
const MB_COUNT = 12, MB_W = 1320, MB_H = 680, MB_ERASE = 1.1;
const MB = { chalk: '#F3F1E6', dim: 'rgba(243,241,230,.5)', faint: 'rgba(243,241,230,.22)', gold: '#FFE18A', cyan: '#8CE8F2',
  pink: '#FFAFC0', green: '#A9F0A8', orange: '#FFC98A' };

// line start times per panel: MB_BEATS[n] = [at of its 1st line, 2nd line, …]
const MB_BEATS = (() => { const b = {}; for (const l of MB_LINES) (b[l.slide] ??= []).push(l.at); return b; })();
function mbSlideAt(t) {
  let n = 1;
  for (let i = 2; i <= MB_COUNT; i++) if (t >= MB_BEATS[i][0] - .35) n = i;
  return { n, start: MB_BEATS[n][0] };
}

// ---------- chalk primitives ----------
// Text that writes itself on left to right: k 0..1 is how much is written.
function mbText(txt, x, y, size, col = MB.chalk, k = 1, align = 'left', weight = 600) {
  if (k <= 0) return;
  X.save(); X.font = `${weight} ${size}px ${FONT_TALK}`; X.textBaseline = 'middle'; X.textAlign = 'left';
  const w = X.measureText(txt).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  if (k < 1) { X.beginPath(); X.rect(x0 - 4, y - size, (w + 8) * k, size * 2); X.clip(); }
  X.fillStyle = col; X.globalAlpha *= .93; X.fillText(txt, x0, y);
  X.globalAlpha *= .3; X.fillText(txt, x0 + .9, y - .7);                       // a dusty second pass
  X.restore();
}
// A chalk stroke that draws itself along the path.
function mbLine(pts, k = 1, col = MB.chalk, lw = 4, o = {}) {
  if (k <= 0 || pts.length < 2) return;
  const p = k >= 1 ? pts : polySlice(pts, 0, k);
  line(p, { stroke: col, lw, alpha: o.alpha ?? .9, dash: o.dash, smooth: o.smooth });
}
function mbArrow(pts, k = 1, col = MB.chalk, lw = 4, o = {}) {
  mbLine(pts, k, col, lw, o);
  if (k < .97) return;
  const n = pts.length, [x1, y1] = pts[n - 1], [x0, y0] = o.smooth && n > 2 ? polyAt(pts, .96) : pts[n - 2], a = Math.atan2(y1 - y0, x1 - x0), h = o.head ?? 16;
  line([[x1 - h * Math.cos(a - .45), y1 - h * Math.sin(a - .45)], [x1, y1], [x1 - h * Math.cos(a + .45), y1 - h * Math.sin(a + .45)]], { stroke: col, lw, alpha: .9 });
}
function mbCircle(cx, cy, r, k = 1, col = MB.chalk, lw = 4, fill) {
  if (k <= 0) return;
  if (fill && k >= 1) circle(cx, cy, r, { fill, stroke: null });
  X.beginPath(); X.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(k));
  X.save(); X.globalAlpha *= .9; X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; X.stroke(); X.restore();
}
function mbRect(x, y, w, h, k = 1, col = MB.chalk, lw = 4, fill) {
  if (k <= 0) return;
  if (fill && k >= 1) shape(rectPts(x, y, w, h), { fill, stroke: null });
  mbLine([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], k, col, lw);
}
const mbFill = (pts, col, a = 1) => shape(pts, { fill: col, stroke: null, alpha: a });
// reveal helper: 0..1 over `dur` seconds once beat time b passes `delay`
const mbK = (b, delay = 0, dur = .9) => ease(seg(b, delay, delay + dur));

// ---------- the frame every panel shares ----------
function mbHeader(n, title, k) {
  mbText(String(n).padStart(2, '0') + ' / ' + MB_COUNT, 44, 52, 30, MB.cyan, k, 'left', 700);
  mbText(title, 190, 52, 46, MB.chalk, k, 'left', 700);
  mbLine([[44, 92], [1276, 92]], k, MB.faint, 3);
}
function mbFooter(n, k) {
  for (let i = 0; i < MB_COUNT; i++) {
    const on = i + 1 === n, past = i + 1 < n;
    circle(52 + i * 26, 648, on ? 8 : 5, { fill: on ? MB.gold : past ? MB.dim : null, stroke: on ? null : MB.faint, lw: 2, alpha: k });
  }
  mbText('Safadi & Tiwana · Dynamics of Mirroring · JAIS 2026', 1276, 648, 22, MB.faint, k, 'right', 500);
}

// ---------- small reusable doodles ----------
const mbDev = (x, y, s, col = MB.chalk, k = 1, fill) => mbRect(x - s / 2, y - s / 2, s, s, k, col, 3.5, fill);   // developer ■
const mbNode = (x, y, r, col = MB.chalk, k = 1, fill) => mbCircle(x, y, r, k, col, 3.5, fill);                    // class / file ○
function mbGrid(x, y, cw, ch, k, o = {}) {                                     // the 2×2 of mirroring archetypes
  const lab = o.size ?? 26;
  mbRect(x, y, cw * 2, ch * 2, k, MB.chalk, 4);
  mbLine([[x + cw, y], [x + cw, y + ch * 2]], k, MB.chalk, 3); mbLine([[x, y + ch], [x + cw * 2, y + ch]], k, MB.chalk, 3);
  mbText('Team structure', x + cw, y - 62, lab + 2, MB.cyan, k, 'center', 700);
  mbText('Monolithic', x + cw / 2, y - 26, lab, MB.dim, k, 'center'); mbText('Modular', x + cw * 1.5, y - 26, lab, MB.dim, k, 'center');
  X.save(); X.translate(x - 86, y + ch); X.rotate(-Math.PI / 2); mbText('Project architecture', 0, 0, lab + 2, MB.pink, k, 'center', 700); X.restore();
  X.save(); X.translate(x - 36, y + ch / 2); X.rotate(-Math.PI / 2); mbText('Monolithic', 0, 0, lab, MB.dim, k, 'center'); X.restore();
  X.save(); X.translate(x - 36, y + ch * 1.5); X.rotate(-Math.PI / 2); mbText('Modular', 0, 0, lab, MB.dim, k, 'center'); X.restore();
}
// cell centres of the 2×2: A top-left, B top-right, C bottom-left, D bottom-right
const mbCell = (x, y, cw, ch) => ({ A: [x + cw / 2, y + ch / 2], B: [x + cw * 1.5, y + ch / 2], C: [x + cw / 2, y + ch * 1.5], D: [x + cw * 1.5, y + ch * 1.5] });
// a curved arrow between two cells, bowed sideways by `bow`
function mbHop(a, b, bow, k, col, lw = 5, shrink = 46) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const p0 = [a[0] + ux * shrink, a[1] + uy * shrink], p2 = [b[0] - ux * shrink, b[1] - uy * shrink];
  const m = [(p0[0] + p2[0]) / 2 - uy * bow, (p0[1] + p2[1]) / 2 + ux * bow];
  const pts = []; for (let i = 0; i <= 16; i++) { const s = i / 16; pts.push([(1 - s) ** 2 * p0[0] + 2 * s * (1 - s) * m[0] + s * s * p2[0], (1 - s) ** 2 * p0[1] + 2 * s * (1 - s) * m[1] + s * s * p2[1]]); }
  mbArrow(pts, k, col, lw, { head: 18 });
}

// ---------- the twelve panels: fn(u, b, n) — u = seconds since the panel began, b(i) = seconds since its i-th line ----------
const MB_PANELS = {
  1(u, b) {                                                                     // title
    mbText('Dynamics of Mirroring', 660, 190, 96, MB.gold, mbK(u, .1, 1.6), 'center', 700);
    mbText('Temporal sequencing of mirror-misting and mirror-focusing', 660, 278, 36, MB.chalk, mbK(u, 1.4, 1.4), 'center', 500);
    mbText('in open-source evolution', 660, 324, 36, MB.chalk, mbK(u, 2.4, .9), 'center', 500);
    mbLine([[360, 372], [960, 372]], mbK(u, 3, .8), MB.faint, 3);
    mbText('Hani Safadi  &  Amrit Tiwana', 660, 420, 42, MB.cyan, mbK(u, 3.4, 1.2), 'center', 700);
    mbText('Journal of the Association for Information Systems · 2026', 660, 468, 28, MB.dim, mbK(u, 4.2, 1.2), 'center', 500);
    // "a little misalignment": a wave that keeps rolling
    const k = mbK(b(2), .4, 1.6), wave = [];
    for (let i = 0; i <= 60; i++) { const x = 380 + i * 9.33; wave.push([x, 560 - 34 * Math.sin(i / 60 * TAU * 2.5 - u * 1.4)]); }
    mbLine(wave, k, MB.pink, 5, { smooth: true });
    mbText('misalign → realign → evolve', 660, 618, 28, MB.pink, mbK(b(2), 1.6, 1), 'center', 600);
  },

  2(u, b) {                                                                     // the mirroring hypothesis
    mbHeader(2, 'The mirroring hypothesis', mbK(u, 0, .8));
    const kL = mbK(u, .4, 1.2), kR = mbK(b(1), .2, 1.2), rows = [200, 335, 470], names = ['UI', 'Logic', 'Data'];
    mbText('TEAM  · who works with whom', 290, 140, 28, MB.cyan, kL, 'center', 700);
    mbText('PRODUCT  · what depends on what', 1010, 140, 28, MB.pink, kR, 'center', 700);
    rows.forEach((y, i) => {                                                     // developer pairs, one per module
      mbLine([[230, y], [350, y]], kL, MB.cyan, 4); mbDev(210, y, 40, MB.cyan, kL); mbDev(370, y, 40, MB.cyan, kL);
      mbRect(900, y - 42, 220, 84, kR, MB.pink, 4); mbText(names[i], 1010, y, 34, MB.chalk, kR, 'center', 700);
    });
    // Alice on the UI, Bob on the data layer
    const kA = mbK(b(2), .3, .8), kB = mbK(b(2), 2, .8);
    mbDev(210, 200, 40, MB.gold, kA, 'rgba(255,225,138,.35)'); mbText('Alice', 140, 200, 30, MB.gold, kA, 'right', 700);
    mbDev(210, 470, 40, MB.gold, kB, 'rgba(255,225,138,.35)'); mbText('Bob', 140, 470, 30, MB.gold, kB, 'right', 700);
    // module dependencies = the interfaces
    const kI = mbK(b(1), 1, .8), glow = mbK(b(3), .2, .6);
    for (const [y0, y1] of [[242, 293], [377, 428]]) mbArrow([[1010, y0], [1010, y1]], kI, glow ? mixCol(MB.pink, MB.gold, glow) : MB.pink, 4 + 2 * glow);
    mbText('interfaces', 1150, 335, 28, MB.gold, glow, 'left', 700);
    // the mirror between them, and the correspondence
    const kM = mbK(b(4), .1, 1);
    mbLine([[650, 160], [650, 560]], kM, MB.chalk, 5);
    mbText('mirror', 650, 590, 28, MB.chalk, kM, 'center', 700);
    rows.forEach((y, i) => mbArrow([[410, y], [880, y]], mbK(b(4), .6 + i * .35, .7), MB.gold, 3, { dash: [10, 10] }));
    mbText('✓ saves scarce attention     ✓ mirrored systems tend to succeed', 660, 600, 30, MB.green, mbK(b(5), .5, 1.6), 'center', 600);
  },

  3(u, b) {                                                                     // the puzzle
    mbHeader(3, 'The puzzle: where is the mirror in open source?', mbK(u, 0, .9));
    mbText('Open-source software is…', 70, 170, 36, MB.chalk, mbK(u, .4, .9), 'left', 600);
    mbText('✓ modular code', 100, 240, 36, MB.green, mbK(b(0), 1.6, .7));
    mbText('✓ specialized developers', 100, 300, 36, MB.green, mbK(b(1), .3, .9));
    mbText('⇒ expect strong mirroring', 100, 380, 38, MB.gold, mbK(b(1), 1.8, .9), 'left', 700);
    // a donut that fills to 56 %
    const cx = 960, cy = 330, r = 150, k = mbK(b(2), .6, 1.6), f = .56 * k;
    mbCircle(cx, cy, r, mbK(b(2), 0, .8), MB.faint, 26);
    if (f > 0) { X.save(); X.beginPath(); X.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * f); X.strokeStyle = MB.pink; X.lineWidth = 26; X.globalAlpha = .9; X.stroke(); X.restore(); }
    mbText(Math.round(56 * k) + '%', cx, cy, 76, MB.pink, mbK(b(2), .6, .4), 'center', 700);
    mbText('of studies of open collaboration', cx, 518, 28, MB.chalk, mbK(b(2), 1.4, 1), 'center');
    mbText('find NO support for mirroring', cx, 552, 28, MB.chalk, mbK(b(2), 2.2, 1), 'center', 700);
    mbText('Colfer & Baldwin (2016)', cx, 590, 22, MB.dim, mbK(b(2), 3, .6), 'center', 500);
    mbText('?', 470, 500, 140 + 6 * Math.sin(u * 3), MB.gold, mbK(b(3), .4, .4), 'center', 700);
  },

  4(u, b) {                                                                     // snapshot or movie?
    mbHeader(4, 'Snapshot… or movie?', mbK(u, 0, .7));
    mbText('Explanation 1: the code itself coordinates the people', 70, 150, 32, MB.dim, mbK(b(0), .4, 1.4));
    mbText('Explanation 2: digital tools replace sitting together', 70, 200, 32, MB.dim, mbK(b(1), .4, 1.4));
    // a single polaroid
    const kS = mbK(b(2), .4, 1);
    mbRect(150, 280, 280, 250, kS, MB.chalk, 4); mbRect(170, 300, 240, 170, kS, MB.faint, 3);
    mbCircle(290, 400, 14, kS, MB.cyan, 4, 'rgba(140,232,242,.4)');
    mbText('snapshot = state', 290, 568, 32, MB.cyan, mbK(b(2), 1.2, .8), 'center', 700);
    // a film strip where the dot rises and falls
    const kF = mbK(b(3), .2, 1.2), fx = 560, fy = 280;
    mbRect(fx, fy, 660, 250, kF, MB.chalk, 4);
    for (let i = 0; i < 12; i++) { mbRect(fx + 20 + i * 54, fy + 12, 26, 16, kF, MB.faint, 2); mbRect(fx + 20 + i * 54, fy + 222, 26, 16, kF, MB.faint, 2); }
    for (let i = 0; i < 4; i++) {
      const x = fx + 20 + i * 160; mbRect(x, fy + 42, 140, 166, kF, MB.faint, 3);
      const ph = i * 1.7 + u * 1.6, y = fy + 125 - 52 * Math.sin(ph);
      if (kF > .9) mbCircle(x + 70, y, 14, 1, Math.cos(ph) > 0 ? MB.green : MB.pink, 4, 'rgba(255,255,255,.15)');
    }
    mbText('movie = dynamics', fx + 330, 568, 32, MB.gold, mbK(b(3), 1, .8), 'center', 700);
  },

  5(u, b) {                                                                     // state vs dynamics
    mbHeader(5, 'Mirroring: state and dynamics', mbK(u, 0, .8));
    // the Q ruler: project Q fixed-ish, team Q drifting around it
    const kR = mbK(b(1), 0, 1.2), x0 = 90, x1 = 650, y = 220;
    mbLine([[x0, y], [x1, y]], kR, MB.chalk, 4);
    for (let i = 0; i <= 10; i++) mbLine([[x0 + i * 56, y - (i % 5 ? 8 : 16)], [x0 + i * 56, y + (i % 5 ? 8 : 16)]], kR, MB.chalk, 3);
    mbText('0  monolithic', x0, y + 46, 26, MB.dim, kR, 'left'); mbText('modular  1', x1, y + 46, 26, MB.dim, kR, 'right');
    mbText('modularity Q', x0, y - 82, 30, MB.chalk, kR, 'left', 700);
    const qp = .57, qt = .57 + .26 * Math.sin(u * .9) * mbK(b(2), 0, 1), kM = mbK(b(1), 1.2, .6);
    const mark = (q, col, lab, up) => { const x = x0 + q * (x1 - x0); mbFill([[x, y + (up ? -10 : 10)], [x - 13, y + (up ? -34 : 34)], [x + 13, y + (up ? -34 : 34)]], col, kM); mbText(lab, x, y + (up ? -50 : 78), 24, col, kM, 'center', 700); };
    mark(qp, MB.pink, 'project', true); mark(qt, MB.cyan, 'team', false);
    // the state formula and a live read-out
    const kE = mbK(b(0), .8, 1.6);
    mbText('Mirroring state', 720, 150, 32, MB.gold, kE, 'left', 700);
    mbText('= 1 − |Qproject − Qteam| / (Qproject + Qteam)', 720, 200, 26, MB.chalk, kE);
    const st = 1 - Math.abs(qp - qt) / (qp + qt);
    mbText('now: ' + st.toFixed(2) + (st > .93 ? '  mirrored ✓' : ''), 720, 258, 30, st > .93 ? MB.green : MB.dim, mbK(b(2), .3, .6), 'left', 600);
    // the dynamics: state over quarters, green going up (focusing), pink going down (misting)
    const kT = mbK(b(3), .2, 1.6), gx = 90, gy = 360, gw = 1140, gh = 200;
    mbLine([[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], kT, MB.chalk, 3);
    mbText('state', gx - 12, gy - 18, 24, MB.dim, kT, 'left'); mbText('quarters →', gx + gw, gy + gh + 30, 24, MB.dim, kT, 'right');
    const vals = [.45, .7, .4, .62, .3, .55, .8, .5, .74, .42, .66, .85, .58, .78];
    const pts = vals.map((v, i) => [gx + 40 + i * 82, gy + gh - v * gh]);
    for (let i = 1; i < pts.length; i++) {
      const up = vals[i] > vals[i - 1], show = up ? mbK(b(4), .2 + i * .08, .4) : mbK(b(5), .2 + i * .08, .4);
      mbLine([pts[i - 1], pts[i]], kT > .99 ? 1 : 0, MB.faint, 4);
      mbLine([pts[i - 1], pts[i]], show, up ? MB.green : MB.pink, 6);
    }
    mbText('↑ mirror focusing', 760, gy - 22, 30, MB.green, mbK(b(4), 0, .8), 'left', 700);
    mbText('↓ mirror misting', 1010, gy - 22, 30, MB.pink, mbK(b(5), 0, .8), 'left', 700);
  },

  6(u, b) {                                                                     // four archetypes
    mbHeader(6, 'Four states, eight moves', mbK(u, 0, .7));
    const gx = 300, gy = 210, cw = 250, ch = 180, C = mbCell(gx, gy, cw, ch), kG = mbK(b(0), .3, 1.4);
    mbGrid(gx, gy, cw, ch, kG);
    const hi = mbK(b(1), .2, .6), lo = mbK(b(2), 1, .6);
    mbFill(rectPts(gx + 4, gy + 4, cw - 8, ch - 8), 'rgba(169,240,168,.16)', hi); mbFill(rectPts(gx + cw + 4, gy + ch + 4, cw - 8, ch - 8), 'rgba(169,240,168,.16)', hi);
    mbFill(rectPts(gx + cw + 4, gy + 4, cw - 8, ch - 8), 'rgba(255,175,192,.14)', lo); mbFill(rectPts(gx + 4, gy + ch + 4, cw - 8, ch - 8), 'rgba(255,175,192,.14)', lo);
    for (const [q, lab, col, k] of [['A', 'mirrored', MB.green, hi], ['D', 'mirrored', MB.green, hi], ['B', 'mismatch', MB.pink, lo], ['C', 'mismatch', MB.pink, lo]]) {
      mbText(q, C[q][0], C[q][1] - 22, 64, MB.chalk, kG, 'center', 700);
      mbText(lab, C[q][0], C[q][1] + 42, 26, col, k, 'center', 600);
    }
    // misting: out of A and D; focusing: back in
    const kM = mbK(b(3), .2, .8), kF = mbK(b(3), 1.8, .8);
    mbHop(C.A, C.B, -40, kM, MB.pink); mbHop(C.D, C.C, -40, kM, MB.pink);
    mbHop(C.B, C.D, -40, kF, MB.green); mbHop(C.C, C.A, -40, kF, MB.green);
    // the legend of all eight moves
    const kL = mbK(b(4), .2, 1), lx = 900;
    mbText('Mirror focusing', lx, 230, 32, MB.green, kL, 'left', 700);
    mbText('B→A   C→A   B→D   C→D', lx, 276, 30, MB.chalk, mbK(b(4), .6, 1));
    mbText('Mirror misting', lx, 370, 32, MB.pink, mbK(b(4), 1.4, 1), 'left', 700);
    mbText('A→B   A→C   D→B   D→C', lx, 416, 30, MB.chalk, mbK(b(4), 1.8, 1));
    // a project wandering the grid: A → B → D → C → A …
    if (kF > .99) {
      const path = [C.A, C.B, C.D, C.C], s = (u * .45) % 4, i = Math.floor(s), f = ease(clamp((s - i) * 1.6)), a = path[i], c = path[(i + 1) % 4];
      mbCircle(lerp(a[0], c[0], f) + 70, lerp(a[1], c[1], f) - 50, 12, 1, MB.gold, 4, 'rgba(255,225,138,.5)');
    }
  },

  7(u, b) {                                                                     // the data
    mbHeader(7, 'Watching it happen: the data', mbK(u, 0, .8));
    const stat = (x, num, unit, lab, k, col) => {
      mbRect(x - 175, 140, 350, 210, k, MB.faint, 3);
      mbText(num(k), x, 215, 72, col, k > 0 ? 1 : 0, 'center', 700);
      mbText(unit, x, 280, 30, MB.chalk, k, 'center', 600); mbText(lab, x, 318, 24, MB.dim, k, 'center', 500);
    };
    const count = (n, k) => Math.round(n * k).toLocaleString('en-US');
    stat(250, k => count(1279, k), 'Java projects', 'random sample from GitHub', mbK(b(1), .2, 1.4), MB.gold);
    stat(660, k => count(20, k) + ' yrs', 'of commit history', 'each project since its first commit', mbK(b(1), 1.5, 1), MB.cyan);
    stat(1070, k => count(25947, k), 'project-quarters', 'every codebase rebuilt each quarter', mbK(b(2), .8, 1.6), MB.pink);
    // a row of quarterly codebases, scanned one by one
    const kQ = mbK(b(2), 0, 1.2);
    for (let i = 0; i < 16; i++) {
      const x = 110 + i * 70, lit = Math.floor(u * 3) % 16 === i;
      mbRect(x, 410, 46, 60, kQ, lit ? MB.gold : MB.faint, 3, lit ? 'rgba(255,225,138,.25)' : null);
      for (let j = 0; j < 3; j++) mbLine([[x + 9, 426 + j * 13], [x + 37 - 8 * hash(i * 3 + j), 426 + j * 13]], kQ, lit ? MB.gold : MB.faint, 2);
      if (i % 4 === 0) mbText('Q' + (1 + (i / 4)), x + 23, 494, 20, MB.dim, kQ, 'center');
    }
    mbText('no surveys → only source code + commit logs', 660, 572, 34, MB.green, mbK(b(3), .5, 1.4), 'center', 700);
  },

  8(u, b) {                                                                     // three networks
    mbHeader(8, 'Three networks every quarter', mbK(u, 0, .8));
    const kA = mbK(b(1), 0, 1.4), kB = mbK(b(2), 0, 1.4), kC = mbK(b(3), 0, 1.4);
    // (a) architecture: classes in three clusters
    const ax = 230, ay = 330, cls = [];
    [[-90, -60], [80, -70], [0, 90]].forEach(([cx, cy], c) => { for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + c; cls.push([ax + cx + 44 * Math.cos(a), ay + cy + 44 * Math.sin(a), c]); } });
    cls.forEach((p, i) => cls.forEach((q, j) => { if (j > i && p[2] === q[2] && (j - i) % 2) mbLine([p, q], kA, MB.faint, 3); }));
    mbLine([cls[1], cls[6]], kA, MB.faint, 3); mbLine([cls[7], cls[9]], kA, MB.faint, 3);
    cls.forEach(p => mbNode(p[0], p[1], 13, MB.pink, kA));
    mbText('(a) architecture', ax, 495, 30, MB.pink, kA, 'center', 700); mbText('classes · uses / inherits', ax, 530, 24, MB.dim, kA, 'center');
    // (b) activity: developers commit to files
    const bx = 660, devs = [[570, 210], [630, 210], [690, 210], [750, 210]], files = [];
    for (let i = 0; i < 8; i++) files.push([555 + i * 30, 430]);
    const commits = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1], [1, 2], [1, 4], [2, 5], [2, 6], [3, 6], [3, 7]];
    commits.forEach(([d, f], i) => mbLine([devs[d], files[f]], mbK(b(2), .3 + i * .08, .5), MB.faint, 2.5));
    devs.forEach(p => mbDev(p[0], p[1], 30, MB.cyan, kB)); files.forEach(p => mbNode(p[0], p[1], 11, MB.chalk, kB));
    mbText('(b) activity', bx, 495, 30, MB.chalk, kB, 'center', 700); mbText('developers → files they change', bx, 530, 24, MB.dim, kB, 'center');
    // (c) team: developers linked when they change the same file
    const cx = 1090, tp = [[1010, 270], [1090, 230], [1060, 390], [1160, 380]];
    mbLine([tp[0], tp[1]], kC, MB.cyan, 6); mbLine([tp[2], tp[3]], kC, MB.cyan, 4);
    tp.forEach(p => mbDev(p[0], p[1], 34, MB.cyan, kC, 'rgba(140,232,242,.18)'));
    mbText('(c) team', cx, 495, 30, MB.cyan, kC, 'center', 700); mbText('developers · co-change a file', cx, 530, 24, MB.dim, kC, 'center');
    for (const [x, y] of [[440, 330], [880, 330]]) mbArrow([[x, y], [x + 50, y]], kC, MB.dim, 3);
    // which network measures what
    const kQ = mbK(b(4), .2, 1);
    mbText('Q(a) → project architecture', ax, 590, 28, MB.pink, kQ, 'center', 700);
    mbText('Q(c) → team structure', cx, 590, 28, MB.cyan, mbK(b(4), 2.2, 1), 'center', 700);
  },

  9(u, b) {                                                                     // finding 1
    mbHeader(9, 'Finding 1 · the mirror oscillates', mbK(u, 0, .8));
    // mirror focusing per quarter: up, down, up, down…
    const gx = 80, gy = 180, gw = 700, mid = 360, kG = mbK(b(0), .4, 1);
    mbLine([[gx, mid], [gx + gw, mid]], kG, MB.chalk, 3); mbLine([[gx, gy], [gx, 540]], kG, MB.chalk, 3);
    mbText('focusing ↑', gx + 12, gy + 6, 24, MB.green, kG); mbText('misting ↓', gx + 12, 530, 24, MB.pink, kG);
    for (let i = 0; i < 14; i++) {
      const v = (i % 2 ? -1 : 1) * (.45 + .5 * hash(i + 7)), h = v * 150 * mbK(b(0), .8 + i * .1, .35), x = gx + 30 + i * 48;
      mbFill(rectPts(x, Math.min(mid, mid - h), 30, Math.abs(h)), v > 0 ? 'rgba(169,240,168,.75)' : 'rgba(255,175,192,.75)');
    }
    mbText('quarters →', gx + gw, 572, 24, MB.dim, kG, 'right');
    // the two PVAR coefficients
    const card = (y, lab, val, note, col, k) => { mbRect(840, y, 400, 150, k, MB.faint, 3); mbText(lab, 1040, y + 32, 26, MB.chalk, k, 'center', 600); mbText(val, 1040, y + 82, 54, col, k, 'center', 700); mbText(note, 1040, y + 126, 24, MB.dim, k, 'center'); };
    card(150, 'state(t−1) → state(t)', '+0.096', 'a little sticky', MB.cyan, mbK(b(1), .3, 1));
    card(340, 'focusing(t−1) → focusing(t)', '−0.414', 'up, then down, then up', MB.pink, mbK(b(2), 2.2, 1));
    mbText('weak in a snapshot ≠ weak in motion', 660, 600, 34, MB.gold, mbK(b(3), .6, 1.4), 'center', 700);
  },

  10(u, b) {                                                                    // finding 2
    mbHeader(10, 'Finding 2 · focusing drives evolution', mbK(u, 0, .8));
    // the two kinds of evolution, with little file doodles
    const kS = mbK(b(1), .2, 1), kM = mbK(b(2), .2, 1);
    for (let i = 0; i < 4; i++) mbRect(80 + i * 40, 130, 30, 40, kS, i === 3 ? MB.green : i === 0 ? MB.pink : MB.faint, 3);
    mbText('+', 175, 115, 30, MB.green, kS, 'center', 700); mbText('−', 95, 115, 30, MB.pink, kS, 'center', 700);
    mbText('System-wide: files added or removed', 250, 152, 30, MB.chalk, kS);
    mbRect(80, 200, 30, 40, kM, MB.faint, 3); for (let j = 0; j < 3; j++) mbLine([[86, 210 + j * 10], [104, 210 + j * 10]], kM, MB.gold, 2);
    mbText('Module-level: code rewritten inside files', 250, 222, 30, MB.chalk, kM);
    // coefficient bars: focusing pushes evolution up, a static mirroring state pushes it down
    const base = 400, sc = 500, groups = [['system-wide', .048, -.179, 260], ['module-level', .098, -.378, 600]];
    mbLine([[160, base], [840, base]], mbK(b(3), 0, .8), MB.chalk, 3);
    for (const [lab, f, s, x] of groups) {
      const kf = mbK(b(3), .5, 1.2), ks = mbK(b(4), .6, 1.2), hf = f * sc * kf, hs = -s * sc * ks;
      mbFill(rectPts(x, base - hf, 70, hf), 'rgba(169,240,168,.8)'); mbFill(rectPts(x + 90, base, 70, hs), 'rgba(255,175,192,.8)');
      if (kf > .9) mbText('+' + f.toFixed(3), x + 35, base - hf - 22, 24, MB.green, 1, 'center', 700);
      if (ks > .9) mbText(s.toFixed(3), x + 125, base + hs + 22, 24, MB.pink, 1, 'center', 700);
      mbText(lab, x + 80, 300, 26, MB.chalk, mbK(b(3), 0, .8), 'center', 600);
    }
    mbText('■ mirror focusing', 880, 330, 28, MB.green, mbK(b(3), .5, .8), 'left', 700);
    mbText('■ static mirroring state', 880, 380, 28, MB.pink, mbK(b(4), .4, .8), 'left', 700);
    // the mirroring trap: the static state freezes the project
    const kT = mbK(b(4), 2.6, 1);
    mbText('the mirroring trap', 1040, 480, 36, MB.gold, kT, 'center', 700);
    const kF = mbK(b(5), .3, 1);
    for (let i = 0; i < 3; i++) {                                              // little snowflakes
      const sx = 930 + i * 110, sy = 560 + 10 * Math.sin(u * 1.5 + i);
      for (let a = 0; a < 3; a++) mbLine([[sx - 18 * Math.cos(a * Math.PI / 3), sy - 18 * Math.sin(a * Math.PI / 3)], [sx + 18 * Math.cos(a * Math.PI / 3), sy + 18 * Math.sin(a * Math.PI / 3)]], kF, MB.cyan, 3);
    }
    mbText('frozen', 1040, 610, 26, MB.cyan, kF, 'center', 600);
  },

  11(u, b) {                                                                    // finding 3
    mbHeader(11, 'Finding 3 · direction matters', mbK(u, 0, .8));
    const gx = 230, gy = 220, cw = 200, ch = 150, C = mbCell(gx, gy, cw, ch), kG = mbK(b(0), .3, 1.2);
    mbGrid(gx, gy, cw, ch, kG, { size: 22 });
    for (const q of 'ABCD') mbText(q, C[q][0], C[q][1], 54, q === 'D' ? MB.gold : MB.chalk, kG, 'center', 700);
    const kD = mbK(b(1), .4, .6);
    mbRect(gx + cw + 8, gy + ch + 8, cw - 16, ch - 16, kD, MB.gold, 5, 'rgba(255,225,138,.12)');
    mbHop(C.B, C.D, -50, mbK(b(2), .2, .8), MB.green, 7); mbHop(C.C, C.D, 50, mbK(b(2), 1, .8), MB.green, 7);
    mbHop(C.B, C.A, 40, mbK(b(3), .3, .8), MB.green, 3);
    // the evidence: split-sample coefficients (system-wide / module-level)
    const tx = 760, kT = mbK(b(1), 1, .8);
    mbText('focusing →', tx, 170, 26, MB.dim, kT); mbText('system', tx + 210, 170, 26, MB.dim, kT, 'center'); mbText('module', tx + 370, 170, 26, MB.dim, kT, 'center');
    const row = (y, mv, s1, s2, col1, col2, k) => {
      mbText(mv, tx, y, 36, MB.chalk, k, 'left', 700); mbText(s1, tx + 210, y, 32, col1, k, 'center', 700); mbText(s2, tx + 370, y, 32, col2, k, 'center', 700);
      mbLine([[tx, y + 32], [tx + 450, y + 32]], k, MB.faint, 2);
    };
    row(240, 'B → D', '+.267 ✓', '+.452 ✓', MB.green, MB.green, mbK(b(2), .4, .8));
    row(320, 'C → D', '+.127 ✓', '+.239 ✓', MB.green, MB.green, mbK(b(2), 1.4, .8));
    row(400, 'B → A', '—', '+.211 ✓', MB.dim, MB.green, mbK(b(3), .5, .8));
    row(480, 'C → A', '—', '—', MB.dim, MB.dim, mbK(b(3), 1.6, .8));
    mbText('the payoff: a modular team on modular code', 660, 590, 32, MB.gold, mbK(b(2), 2.4, 1.4), 'center', 700);
  },

  12(u, b) {                                                                    // takeaways
    mbHeader(12, 'Orchestrating oscillations', mbK(u, 0, .8));
    // the cycle: mist (explore) ↔ focus (exploit), spiralling upward = evolution
    const cx = 330, cy = 340, kC = mbK(b(1), .2, 1.2), kF = mbK(b(2), .2, 1.2), spin = u * .5;
    const arc = (a0, a1, r) => { const p = []; for (let i = 0; i <= 24; i++) { const a = a0 + (a1 - a0) * i / 24; p.push([cx + r * Math.cos(a), cy + r * .62 * Math.sin(a)]); } return p; };
    mbArrow(arc(.15, Math.PI - .15, 190), kC, MB.pink, 6, { smooth: true });
    mbArrow(arc(Math.PI + .15, TAU - .15, 190), kF, MB.green, 6, { smooth: true });
    mbText('MIST', cx, cy + 165, 36, MB.pink, kC, 'center', 700); mbText('explore · tinker · learn', cx, cy + 205, 24, MB.chalk, kC, 'center');
    mbText('FOCUS', cx, cy - 165, 36, MB.green, kF, 'center', 700); mbText('put the learning to work', cx, cy - 205, 24, MB.chalk, kF, 'center');
    if (kF > .99) mbCircle(cx + 190 * Math.cos(spin), cy + 118 * Math.sin(spin), 12, 1, MB.gold, 4, 'rgba(255,225,138,.6)');
    // antifragile
    const kA = mbK(b(3), 3, .5), pop = backOut(seg(b(3), 3, 3.4));
    if (kA > 0) { X.save(); X.translate(cx, cy); X.rotate(-.08); X.scale(pop, pop); mbRect(-150, -34, 300, 68, 1, MB.gold, 5, 'rgba(255,225,138,.12)'); mbText('ANTIFRAGILE', 0, 0, 42, MB.gold, 1, 'center', 700); X.restore(); }
    // for managers
    mbText('For managers:', 700, 180, 32, MB.cyan, mbK(b(4), .2, .7), 'left', 700);
    mbText("don't lock the mirror in place —", 700, 228, 30, MB.chalk, mbK(b(4), 1, 1.2));
    mbText('leave room for bottom-up tinkering', 700, 270, 30, MB.chalk, mbK(b(4), 2.2, 1.2));
    // the closing line
    mbText('Not optimizing configurations…', 700, 390, 38, MB.chalk, mbK(b(5), .4, 1.8), 'left', 600);
    mbText('…but orchestrating oscillations.', 700, 450, 44, MB.gold, mbK(b(6), .3, 1.6), 'left', 700);
    const kQ = mbK(b(6), 2.6, 1.4);
    mbText('"An oscillation is required to set a mechanism in motion."', 1000, 548, 24, MB.dim, kQ, 'center', 500);
    mbText('— Carlo Rovelli', 1000, 582, 22, MB.dim, kQ, 'center', 500);
  },
};

function mbBoard(t) {
  const { n, start } = mbSlideAt(t), beats = MB_BEATS[n];
  const b = i => t - (beats[i] ?? 1e9), u = t - start + .35;
  withBoil(0, () => {
    // the previous panel is wiped off by an eraser sweeping left to right
    const next = MB_BEATS[n + 1]?.[0], e = next ? seg(t, next - .35 - MB_ERASE, next - .35) : 0;
    if (e > 0) {
      const ex = lerp(-120, MB_W + 120, ease(e));
      X.save(); X.beginPath(); X.rect(ex, 0, MB_W, MB_H); X.clip(); MB_PANELS[n](u, b, n); if (n > 1) mbFooter(n, 1); X.restore();
      X.fillStyle = linGrad(ex - 160, 0, ex, 0, [[0, 'rgba(240,240,225,0)'], [1, 'rgba(240,240,225,.13)']]); X.fillRect(ex - 160, 0, 160, MB_H);
      shape(rectPts(ex - 30, 0, 60, MB_H), { fill: 'rgba(240,240,225,.06)', stroke: null });
    } else {
      MB_PANELS[n](u, b, n);
      mbFooter(n, n > 1 ? 1 : mbK(u, 5, 1));
    }
  });
}
