// scenes/book_fair/scene22_you_shall_see/props.js: the book-fair dressing, props and motion-graphics backdrops for scene 22 (prefix ys).
// Screen-space props take (x, y) in px and a size w (px). World props take the perspective camera P.
const YS = {
  ink: '#2B1A26', cream: '#FFF4D6', paper: '#FFFDF6', gold: '#F2C14E', goldDk: '#C8922A', goldLt: '#FFE48A',
  pink: '#F48FB8', pinkDk: '#D2618F', pinkLt: '#FFD3E6', violet: '#5B2E86', violetDk: '#2C1446', sky: '#7FE3FF',
  booger: '#8CCB3A', boogerDk: '#5E9A1E', fire: '#FF8A2A', red: '#E0584E', blue: '#3E6FB0', green: '#4FA478',
};

// ---------- motion-graphics backdrops ----------
function ysSunburst(cx, cy, t, c1, c2, n = 18, spin = .2) {
  shape(rectPts(-60, -60, W + 120, H + 120), { fill: c1, stroke: null });
  const a0 = t * spin, R = 2600;
  for (let i = 0; i < n; i++) { const a = a0 + i / n * TAU, b = a + TAU / n / 2;
    shape([[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R], [cx + Math.cos(b) * R, cy + Math.sin(b) * R]], { fill: c2, stroke: null }); }
}
function ysDots(col, alpha, gap, r, t) {
  X.save(); X.globalAlpha = alpha; X.fillStyle = col;
  const off = (t * 20) % gap;
  for (let y = -gap; y < H + gap; y += gap) for (let x = -gap; x < W + gap; x += gap) {
    X.beginPath(); X.arc(x + off + ((y / gap) % 2 ? gap / 2 : 0), y + off * .5, r, 0, TAU); X.fill(); }
  X.restore();
}
// A soft cone of light from (x, top) down to a pool of width w at y = floorY.
function ysSpot(x, top, floorY, w, col = '#FFF1C8', a = .22) {
  X.save(); X.globalCompositeOperation = 'lighter';
  shape([[x - 50, top], [x + 50, top], [x + w / 2, floorY], [x - w / 2, floorY]], { fill: rgba(col, a), stroke: null });
  ellipse(x, floorY, w / 2, w * .09, { fill: rgba(col, a * 1.1), stroke: null });
  X.restore();
}
// Paper confetti and loose pages raining down, from t0. kind: 'paper' (bits) | 'pages' (sheets) | 'mixed'.
function ysConfetti(t, t0, kind = 'paper', n = 60, cols = ['#F2C14E', '#F48FB8', '#7FE3FF', '#8CCB3A', '#B48AE0', '#FF8A2A']) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) {
    const age = t - t0 - hash(i) * 1.2; if (age < 0) continue;
    const x = (hash(i * 3.1) * 1.2 - .1) * W + Math.sin(age * 2 + i) * 40, y = -60 + age * (180 + hash(i * 7) * 220);
    if (y > H + 80) continue;
    const page = kind === 'pages' || (kind === 'mixed' && i % 3 === 0), rot = age * (2 + hash(i * 5) * 4) + i;
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(1, Math.cos(age * 5 + i));
    if (page) { shape(rectPts(-22, -28, 44, 56), { fill: YS.paper, stroke: YS.ink, lwPx: 2 }); for (let j = 0; j < 4; j++) line([[-14, -16 + j * 10], [14, -16 + j * 10]], { stroke: '#9AA7B0', lwPx: 2 }); }
    else shape(rectPts(-9, -5, 18, 10), { fill: cols[i % cols.length], stroke: null });
    X.restore();
  }
}
// A word that slams in from big and wobbles (title cards, BONK).
function ysSlam(txt, x, y, size, fill, t, t0, rot = 0, o = {}) {
  const age = t - t0; if (age < 0 || (o.life && age > o.life)) return;
  const out = o.life ? 1 - clamp((age - o.life + .25) / .25) : 1;
  const k = age < .16 ? lerp(2.6, 1, easeIn(age / .16)) : 1 + .08 * boing(t, t0 + .16, 3, 6);
  X.save(); X.translate(x, y); X.rotate(rot + .04 * boing(t, t0 + .16, 2, 5)); X.scale(k, k); X.globalAlpha = clamp(age / .08) * out;
  X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = size * .2; X.strokeStyle = YS.ink; X.fillStyle = YS.ink; X.strokeText(txt, size * .06, size * .08); X.fillText(txt, size * .06, size * .08);
  X.strokeText(txt, 0, 0); X.fillStyle = fill; X.fillText(txt, 0, 0);
  X.restore();
}
// The page-turn wipe: a page sweeps across the frame (u 0..1) with a curled edge and a shadow. dir 1 = left to right.
function ysPageWipe(u, dir = 1, col = YS.cream) {
  if (u <= 0 || u >= 1) return;
  overlay(() => {
    const e = ease(u), x = dir > 0 ? lerp(-500, W + 500, e) : lerp(W + 500, -500, e), sk = 220;
    X.save();
    const pts = dir > 0 ? [[-600, 0], [x + sk, 0], [x - sk, H], [-600, H]] : [[W + 600, 0], [x - sk, 0], [x + sk, H], [W + 600, H]];
    const vis = u < .5 ? pts : (dir > 0 ? [[x + sk - 700, 0], [x + sk, 0], [x - sk, H], [x - sk - 700, H]] : [[x - sk + 700, 0], [x - sk, 0], [x + sk, H], [x + sk + 700, H]]);
    shape(vis, { fill: col, stroke: YS.ink, lwPx: 6 });
    for (let i = 1; i < 9; i++) { const yy = i * H / 9, xx = lerp(x + sk * dir, x - sk * dir, i / 9) - dir * 120; line([[xx - dir * 520, yy], [xx - dir * 40, yy]], { stroke: 'rgba(120,140,160,.35)', lwPx: 4 }); }
    X.restore();
  });
}

// ---------- the book-fair dressing (world space) ----------
// The BOOK FAIR banner across the back wall, above the mural and the bookcases (P: a reading-view camera, dir −1).
function ysBanner(P, t) {
  P.plane(6, k => {
    X.save(); X.scale(P.dir, 1);
    const sw = Math.sin(t * 1.3) * 3;
    shape([[-330, -372 + sw], [330, -372 - sw], [320, -300 - sw], [0, -292], [-320, -300 + sw]], { fill: '#C0443F', stroke: YS.ink, lwPx: 2.5, smooth: .15 });
    shape([[-330, -372 + sw], [-372, -350], [-330, -316]], { fill: '#8E2E2A', stroke: YS.ink, lwPx: 2 });
    shape([[330, -372 - sw], [372, -350], [330, -316]], { fill: '#8E2E2A', stroke: YS.ink, lwPx: 2 });
    X.font = `44px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = 7; X.strokeStyle = YS.ink; X.strokeText('DCES BOOK FAIR', 0, -346); X.fillStyle = YS.goldLt; X.fillText('DCES BOOK FAIR', 0, -346);
    X.font = `19px ${FONT_SFX}`; X.lineWidth = 4; X.strokeText('WRITING COMPETITION · JUDGE: HER ROYAL HIGHNESS', 0, -314); X.fillStyle = YS.paper; X.fillText('WRITING COMPETITION · JUDGE: HER ROYAL HIGHNESS', 0, -314);
    X.restore();
  });
}
// The rolling library ladder, leaning on the back bookcase at world X (rails 50 apart), foot at Z 130, top at Z 46.
function ysLadder(P, xL = -470, h = 250) {
  const rails = [xL - 25, xL + 25], top = [46, h], foot = [130, 0];
  const pt = (x, f) => P.p(x, lerp(foot[1], top[1], f), lerp(foot[0], top[0], f));
  rails.forEach(x => { const a = pt(x, 0), b = pt(x, 1); line([[a[0], a[1]], [b[0], b[1]]], { stroke: '#7A4A26', lwPx: Math.max(3, 9 * a[2]) }); line([[a[0], a[1]], [b[0], b[1]]], { stroke: '#B97F4C', lwPx: Math.max(2, 5 * a[2]) }); });
  for (let i = 1; i < 9; i++) { const f = i / 9, a = pt(rails[0], f), b = pt(rails[1], f); line([[a[0], a[1]], [b[0], b[1]]], { stroke: '#7A4A26', lwPx: Math.max(3, 7 * a[2]) }); }
  rails.forEach(x => { const a = pt(x, 0); circle(a[0], a[1], 6 * a[2], { fill: '#59626A', stroke: YS.ink, lwPx: 2 }); });
}
// Where a foot sits on the ladder's rung f (0 = floor, 1 = top), world coords.
const ysLadderAt = (f, xL = -470, h = 250) => ({ x: xL, y: lerp(0, h, f), z: lerp(130, 46, f) + 22 });

// Pearl's pink-and-gold throne, wheeled in from the castle. (x, y) = screen point under the front of the seat, k = px per world unit.
// Seat top is 95 world units up. Faces screen-right.
function ysThrone(x, y, k, t, o = {}) {
  const u = k, seatY = y - 95 * u;
  X.save(); X.translate(x, y); if (o.flip) X.scale(-1, 1);
  // back
  shape([[-70 * u, -95 * u], [-80 * u, -250 * u], [-40 * u, -300 * u], [0, -318 * u], [40 * u, -300 * u], [80 * u, -250 * u], [70 * u, -95 * u]], { fill: YS.pink, stroke: YS.ink, lwPx: 3, smooth: .35 });
  shape([[-50 * u, -110 * u], [-58 * u, -240 * u], [0, -290 * u], [58 * u, -240 * u], [50 * u, -110 * u]], { fill: YS.pinkLt, stroke: YS.pinkDk, lwPx: 2, smooth: .35 });
  for (let i = -1; i <= 1; i++) circle(i * 30 * u, -200 * u + Math.abs(i) * 14 * u, 7 * u, { fill: YS.gold, stroke: YS.ink, lwPx: 1.5 });
  shape(starPts(0, -318 * u, 26 * u, .45, 5), { fill: YS.gold, stroke: YS.ink, lwPx: 2.5 });
  // legs and seat
  [-60, 60].forEach(lx => shape(rectPts(lx * u - 8 * u, -70 * u, 16 * u, 70 * u), { fill: YS.goldDk, stroke: YS.ink, lwPx: 2.5 }));
  shape(rectPts(-82 * u, -98 * u, 164 * u, 30 * u), { fill: YS.gold, stroke: YS.ink, lwPx: 3, smooth: .2 });
  shape([[-78 * u, -98 * u], [78 * u, -98 * u], [70 * u, -116 * u], [-70 * u, -116 * u]], { fill: '#E7457C', stroke: YS.ink, lwPx: 2.5, smooth: .3 });
  // armrests
  [-1, 1].forEach(sd => shape([[sd * 72 * u, -98 * u], [sd * 90 * u, -150 * u], [sd * 84 * u, -160 * u], [sd * 64 * u, -112 * u]], { fill: YS.gold, stroke: YS.ink, lwPx: 2.5, smooth: .3 }));
  // castors (it was wheeled in)
  [-60, 60].forEach(lx => circle(lx * u, -4 * u, 9 * u, { fill: '#59626A', stroke: YS.ink, lwPx: 2 }));
  X.restore();
  return [x, seatY];
}

// ---------- books ----------
// A closed book seen from the front. o: { col, title: [lines], sub, face: 'safadi' | 'fester', ang, k (pop scale), spine }
function ysBook(x, y, w, o = {}) {
  const k = o.k ?? 1; if (k <= .01) return;
  const h = w * (o.aspect ?? 1.36), col = o.col || YS.blue;
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(k, k);
  shape(rectPts(-w / 2 + w * .06, -h / 2 + w * .05, w, h), { fill: '#F4EEDD', stroke: YS.ink, lwPx: 2 });
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: col, stroke: YS.ink, lwPx: Math.max(2, w * .025) });
  shape(rectPts(-w / 2, -h / 2, w * .1, h), { fill: 'rgba(0,0,0,.2)', stroke: null });
  X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  const txt = (s, ty, size, fill) => { X.font = `${size}px ${FONT_SFX}`; const m = X.measureText(s).width, sc = Math.min(1, w * .82 / m);
    X.save(); X.translate(w * .04, ty); X.scale(sc, sc); X.lineWidth = Math.max(2, size * .18); X.strokeStyle = YS.ink; X.strokeText(s, 0, 0); X.fillStyle = fill; X.fillText(s, 0, 0); X.restore(); };
  (o.title || []).forEach((s, i) => txt(s, -h * .38 + i * w * .14, w * .12, o.titleCol || YS.paper));
  if (o.face === 'safadi') {
    const fy = h * .04, fr = w * .26, cx = w * .04;
    circle(cx, fy, fr, { fill: '#F3C6A8', stroke: YS.ink, lwPx: 2 });
    shape([[cx - fr, fy - fr * .1], [cx - fr * .8, fy - fr * .85], [cx + fr * .3, fy - fr * 1.05], [cx + fr, fy - fr * .3], [cx + fr * .5, fy - fr * .55], [cx - fr * .3, fy - fr * .5]], { fill: '#2E221D', stroke: YS.ink, lwPx: 1.5, smooth: .4 });
    [-1, 1].forEach(sd => circle(cx + sd * fr * .35, fy + fr * .05, fr * .1, { fill: YS.ink, stroke: null }));
    line([[cx - fr * .35, fy + fr * .45], [cx, fy + fr * .6], [cx + fr * .35, fy + fr * .45]], { stroke: YS.ink, lwPx: 2 });
  }
  if (o.face === 'fester') {                                                  // a crayon jester (Jenna drew it), with a ball on its head
    const fy = h * .06, fr = w * .2, cx = w * .04;
    shape([[cx - fr * 1.2, fy - fr * .6], [cx - fr * 1.6, fy - fr * 1.9], [cx, fy - fr * 1.1], [cx + fr * 1.6, fy - fr * 1.9], [cx + fr * 1.2, fy - fr * .6]], { fill: '#7A3FA0', stroke: YS.ink, lwPx: 2, smooth: .3 });
    circle(cx, fy, fr, { fill: '#F6CDB0', stroke: YS.ink, lwPx: 2 });
    [-1, 1].forEach(sd => circle(cx + sd * fr * .38, fy - fr * .05, fr * .12, { fill: YS.ink, stroke: null }));
    line([[cx - fr * .45, fy + fr * .35], [cx, fy + fr * .65], [cx + fr * .45, fy + fr * .35]], { stroke: YS.ink, lwPx: 2, smooth: true });
    circle(cx + fr * .2, fy - fr * 2.3, fr * .42, { fill: '#F29A3A', stroke: YS.ink, lwPx: 2 });
    txt('BONK!', fy - fr * 3.0 - w * .05, w * .1, YS.goldLt);
  }
  if (o.sub) txt(o.sub, h * .38, w * (o.sub.length > 9 ? .11 : .14), o.subCol || YS.goldLt);
  X.restore();
}
const YS_SBOOK = [['MATHEMATICS', '#3E6FB0'], ['PHYSICS', '#C0443F'], ['ASTRONOMY', '#4A3A8C']];
const ysSafadiBook = (x, y, w, i, o = {}) => ysBook(x, y, w, { col: YS_SBOOK[i][1], title: ['PROFESSOR SAFADI', 'EXPLAINS'], sub: YS_SBOOK[i][0], face: 'safadi', ...o });
const ysFesterBook = (x, y, w, o = {}) => ysBook(x, y, w, { col: '#F2C14E', titleCol: '#7A3FA0', title: ['THE STORY', 'OF MY LIFE'], sub: 'by Fester (& friends)', subCol: YS.paper, face: 'fester', ...o });
const ysBoogerBook = (x, y, w, o = {}) => ysBook(x, y, w, { col: YS.booger, title: ["DR. SAMI'S BIG", 'BOOK OF'], sub: 'BOOGERS', subCol: '#FFF7B0', ...o });

// An open book (a spread) seen from the front: two pages, fn(side, pw, ph) draws on each page in page coords.
function ysOpenBook(x, y, w, ang, fn, o = {}) {
  const pw = w / 2, ph = w * .66;
  X.save(); X.translate(x, y); X.rotate(ang);
  shape([[-pw - 14, -ph / 2 - 10], [pw + 14, -ph / 2 - 10], [pw + 14, ph / 2 + 16], [0, ph / 2 + 24], [-pw - 14, ph / 2 + 16]], { fill: o.cover || '#F2C14E', stroke: YS.ink, lwPx: 4 });
  [-1, 1].forEach(sd => {
    shape([[0, -ph / 2 + 6], [sd * pw * .5, -ph / 2 - 6], [sd * pw, -ph / 2], [sd * pw, ph / 2], [sd * pw * .5, ph / 2 + 6], [0, ph / 2 + 10]], { fill: YS.paper, stroke: YS.ink, lwPx: 3, smooth: .25 });
    X.save(); X.translate(sd * pw / 2, 0); fn && fn(sd, pw, ph); X.restore();
  });
  line([[0, -ph / 2 + 6], [0, ph / 2 + 10]], { stroke: 'rgba(43,26,38,.5)', lwPx: 3 });
  X.restore();
}

// Dragon's pop-up book: the spread, with 3, 6 and 9 rising as paper towers (k 0..1). burnt 0..1 chars it.
function ysPopup(x, y, w, k, burnt = 0, t = T) {
  const char = c => mixCol(c, '#2A1E1A', burnt * .85);
  ysOpenBook(x, y, w, 0, (sd, pw, ph) => { line([[-pw * .3, ph * .25], [pw * .3, ph * .25]], { stroke: char('#C9C3B4'), lwPx: 4 }); }, { cover: char('#4E9A3A') });
  [[3, -.3, '#E0584E'], [6, 0, '#3E6FB0'], [9, .3, '#F2C14E']].forEach(([n, fx, col], i) => {
    const r = backOut(seg(k, i * .2, i * .2 + .45)); if (r <= 0) return;
    const bx = x + fx * w, by = y - w * .05, hh = w * (.22 + .1 * i) * r, bw = w * .16;
    shape([[bx - bw / 2, by], [bx - bw / 2, by - hh], [bx + bw / 2, by - hh], [bx + bw / 2, by]], { fill: char(col), stroke: YS.ink, lwPx: 3 });
    X.save(); X.translate(bx, by - hh - bw * .45); X.rotate(.06 * Math.sin(t * 3 + i)); X.font = `${bw * 1.0}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = bw * .16; X.strokeStyle = YS.ink; X.strokeText(String(n), 0, 0); X.fillStyle = char(YS.paper); X.fillText(String(n), 0, 0); X.restore();
  });
  if (burnt > .2) for (let i = 0; i < 5; i++) {                               // smoke curls
    const a = frac(t * .6 + i * .2), sx = x + (hash(i) - .5) * w * .8, sy = y - w * .3 - a * w * .7;
    X.save(); X.globalAlpha = (1 - a) * .6 * burnt; circle(sx + Math.sin(a * 6 + i) * 20, sy, w * (.05 + a * .08), { fill: '#8C8A92', stroke: null }); X.restore();
  }
}
// A puff of dragon flame from (x, y) toward ang, length L, strength k.
function ysFlame(x, y, ang, L, k, t = T) {
  if (k <= .01) return;
  X.save(); X.translate(x, y); X.rotate(ang);
  for (let i = 0; i < 9; i++) {
    const f = i / 8, r = L * (.08 + .14 * f) * k, px = L * f * k + Math.sin(t * 30 + i) * 6, py = Math.sin(t * 24 + i * 2) * L * .05 * f;
    circle(px, py, r, { fill: i % 3 === 0 ? '#FFF3C4' : i % 3 === 1 ? '#FFB23A' : YS.fire, stroke: YS.ink, lwPx: 2.5, alpha: .95 });
  }
  X.restore();
}

// One loose manuscript page. text: a short line on it ('EAT YOUR BROCCOLI', a chapter number…).
function ysPage(x, y, w, rot, text, o = {}) {
  const h = w * 1.3;
  X.save(); X.translate(x, y); X.rotate(rot); if (o.flipY) X.scale(1, o.flipY);
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: o.col || YS.paper, stroke: YS.ink, lwPx: Math.max(1.5, w * .02) });
  if (text) { X.font = `${w * .11}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = o.ink || '#2E8C3A';
    const lines = text.split('\n'); lines.forEach((s, i) => X.fillText(s, 0, -h * .3 + i * w * .15)); }
  for (let i = 0; i < 5; i++) line([[-w * .35, h * .02 + i * h * .08], [w * .35, h * .02 + i * h * .08]], { stroke: 'rgba(110,120,130,.45)', lwPx: Math.max(1, w * .015) });
  X.restore();
}

// The crown-shaped trophy (the prize). (x, y) = base centre, w = width.
function ysTrophy(x, y, w, t = T, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.rot || 0);
  shape(rectPts(-w * .35, -w * .2, w * .7, w * .2), { fill: '#8E5D33', stroke: YS.ink, lwPx: 3 });
  shape([[-w * .1, -w * .2], [w * .1, -w * .2], [w * .06, -w * .42], [-w * .06, -w * .42]], { fill: YS.goldDk, stroke: YS.ink, lwPx: 3 });
  ysCrown(0, -w * .42, w * .9, t);
  X.restore();
}
// A crown: (x, y) = middle of its base band, w = width.
function ysCrown(x, y, w, t = T, rot = 0) {
  X.save(); X.translate(x, y); X.rotate(rot);
  shape([[-w / 2, 0], [-w / 2, -w * .55], [-w * .25, -w * .28], [0, -w * .65], [w * .25, -w * .28], [w / 2, -w * .55], [w / 2, 0]], { fill: YS.gold, stroke: YS.ink, lwPx: Math.max(2, w * .04) });
  shape(rectPts(-w / 2, -w * .16, w, w * .16), { fill: YS.goldDk, stroke: YS.ink, lwPx: Math.max(2, w * .03) });
  [[-w / 2, -w * .55], [0, -w * .65], [w / 2, -w * .55]].forEach(([cx, cy]) => circle(cx, cy, w * .07, { fill: YS.pink, stroke: YS.ink, lwPx: 2 }));
  circle(0, -w * .08, w * .06, { fill: YS.sky, stroke: YS.ink, lwPx: 2 });
  const g = .5 + .5 * Math.sin(t * 5); X.save(); X.globalAlpha = .5 * g; shape(starPts(w * .3, -w * .45, w * .08, .35, 4), { fill: '#FFFFFF', stroke: null }); X.restore();
  X.restore();
}
// The professor's briefcase, labelled.
function ysBag(x, y, w, open = 0) {
  const h = w * .7;
  X.save(); X.translate(x, y);
  shape([[-w * .18, -h], [-w * .18, -h - w * .14], [w * .18, -h - w * .14], [w * .18, -h]], { fill: null, stroke: '#4A2E1C', lwPx: Math.max(3, w * .05) });
  shape(rectPts(-w / 2, -h, w, h), { fill: '#7A4A26', stroke: YS.ink, lwPx: 3, smooth: .1 });
  shape([[-w / 2, -h], [w / 2, -h], [w / 2, -h + h * .3 * (1 - open)], [-w / 2, -h + h * .3 * (1 - open)]], { fill: '#8E5A30', stroke: YS.ink, lwPx: 2.5 });
  X.font = `${w * .12}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = YS.goldLt; X.fillText('PROFESSOR', 0, -h * .4);
  X.restore();
}

// Housam's borrowed chalkboard: the ladder, the dotted fall, h = 2 m, g = 9.8, t = √(2h/g) ≈ 0.64 s. k 0..1 chalks it on.
function ysMathBoard(x, y, w, k, t = T) {
  const h = w * .62, c = '#F4F1E6', step = (a, b) => ease(seg(k, a, b));
  if (k <= 0) return;
  const pop = backOut(seg(k, 0, .12));
  X.save(); X.translate(x, y); X.scale(pop, pop);
  X.save(); X.globalCompositeOperation = 'lighter'; shape(rectPts(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40), { fill: 'rgba(127,227,255,.14)', stroke: null, smooth: .1 }); X.restore();
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#24443A', stroke: '#8E5D33', lwPx: 14 });
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: null, stroke: YS.ink, lwPx: 3 });
  const ch = (pts, a, b, o = {}) => { const u = step(a, b); if (u > 0) line(polySlice(pts, 0, u), { stroke: c, lwPx: w * .008, ...o }); };
  // ladder on the left
  const lx = -w * .36, lb = h * .38, lt = -h * .32;
  ch([[lx - w * .03, lb], [lx - w * .01, lt]], .1, .2); ch([[lx + w * .05, lb], [lx + w * .07, lt]], .12, .22);
  for (let i = 0; i < 6; i++) { const f = i / 5, yy = lerp(lb, lt, f); ch([[lx - w * .03 + f * w * .02, yy], [lx + w * .05 + f * w * .02, yy]], .2 + i * .015, .24 + i * .015); }
  // stick Danny on top, the ball, the dotted fall to a stick Fester
  const fx = -w * .12;
  ch(ellPts(lx + w * .03, lt - h * .08, w * .025, w * .025, 16).concat([ellPts(lx + w * .03, lt - h * .08, w * .025, w * .025, 16)[0]]), .3, .36);
  ch([[lx + w * .05, lt - h * .03], [fx - w * .02, lt - h * .05]], .34, .38);
  const ballU = step(.4, .55), by = lerp(lt - h * .05, h * .08, ballU * ballU);
  if (ballU > 0) circle(fx, by, w * .018, { fill: '#F29A3A', stroke: c, lwPx: 2 });
  for (let i = 0; i < 8; i++) { const f = i / 8; if (f < ballU) circle(fx, lerp(lt - h * .05, h * .08, f * f), w * .004, { fill: c, stroke: null }); }
  ch(ellPts(fx, h * .14, w * .03, w * .03, 16).concat([ellPts(fx, h * .14, w * .03, w * .03, 16)[0]]), .45, .5);
  ch([[fx, h * .17], [fx, h * .32], [fx - w * .03, h * .4]], .48, .52); ch([[fx, h * .32], [fx + w * .03, h * .4]], .5, .53);
  // h = 2 m bracket
  ch([[lx - w * .07, lb], [lx - w * .07, lt]], .55, .6, { dash: [8, 8] });
  // the formulas on the right
  X.font = `${w * .05}px ${FONT_SFX}`; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillStyle = c;
  const tx = (s, yy, a, col = c) => { const u = step(a, a + .08); if (u <= 0) return; X.save(); X.globalAlpha = u; X.fillStyle = col; X.fillText(s, w * .02, yy); X.restore(); };
  tx('h = 2 m', -h * .3, .58); tx('g = 9.8 m/s²', -h * .14, .66); tx('t = √(2h / g)', h * .02, .74); tx('t ≈ 0.64 s', h * .2, .84, '#FFE066');
  const ring = step(.9, 1);
  if (ring > 0) shape(ellPts(w * .19, h * .2, w * .16 * ring + 1, h * .1 * ring + 1, 28, -.05), { fill: null, stroke: '#FFE066', lwPx: w * .006 });
  X.restore();
}
