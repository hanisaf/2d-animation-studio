// scenes/book_fair/scene21b_dolphin_royalty/props.js: the girls' real books, redrawn in code from the photos in reference/.
//
//   dryCover(kind, x, y, w, ang, o)  a book centred on (x, y), `w` px wide, rotated `ang`.
//       kind: 'gold' (Alma's "Dolphin Royalty coloring book with mini poster!") | 'green' (Jenna's, with the servant dolphin)
//             | 'poster' (the mini poster: "Pearl" in a red jewel, "mama" in a pencil diamond, "frag")
//       o: { k (pop-in scale 0..1), shadow (default true), draw (0..1: the marker lines draw on), t }
//   dryPop(cx, cy, r, k, t, fn)      a sparkly story cloud (screen px), the picture `fn` painted inside it
//   dryCrayon(x, y, len, ang, col)   a wax crayon, its tip at (x, y)
//   dryPaper(P, X, Y, Z, w, d, ang, o)  a sheet of paper lying flat on a table top (world units), with scribbled lines
// Each cover is drawn in the pixel space of its photo (gold 1290 × 2000, green 1400 × 2048, poster 2000 × 1360), so the
// shapes below can be checked against the reference. Pure functions of their arguments, like the rest of the engine.

const DRY = { paper: '#FBFAF4', shade: '#E9E4D8', staple: '#9AA0A6', gold: '#B98A2E', green: '#55A232', purple: '#7A3E9C',
  pencil: '#6E6A66', red: '#B3151E', orange: '#EE7A1F', yellow: '#F4E43C', pink: '#F07AAE', pinkLt: '#F3A6CC', grass: '#4FB848',
  blue: '#1F4FA8', blueLt: '#3FA8E0', violet: '#6B2C9A', lime: '#2E9A2E', brown: '#8A3A1A' };
const DRY_HAND = '"Chalkboard SE", "Comic Sans MS", "Marker Felt", cursive';
const DRY_SIZE = { gold: [1290, 2000], green: [1400, 2048], poster: [2000, 1360] };

// ---------- kid lettering ----------
// handwriting: every letter its own size, tilt and baseline, squeezed to `w` px wide
function dryScrawl(txt, x, y, size, col, o = {}) {
  X.save(); X.font = `${o.weight || 400} ${size}px ${DRY_HAND}`; X.textAlign = 'left'; X.textBaseline = 'alphabetic';
  const ws = [...txt].map(ch => X.measureText(ch).width), tot = ws.reduce((a, b) => a + b, 0), sx = o.w ? o.w / tot : 1;
  let cx = x; const seed = o.seed ?? txt.length * 7;
  [...txt].forEach((ch, i) => {
    const w = ws[i] * sx, j = hash(seed + i * 3.1);
    X.save(); X.translate(cx + w / 2, y + (j - .5) * size * .1); X.rotate((hash(seed + i * 5.7) - .5) * .2); X.scale(sx * (1 + (j - .5) * .14), 1 + (j - .5) * .14);
    X.fillStyle = col; X.fillText(ch, -ws[i] / 2, 0); X.restore();
    cx += w;
  });
  X.restore();
}
// fat bubble letters: an outline, a fat fill, then the letter; `cols` per letter (or one colour), `ink` the outline
function dryBubble(txt, x, y, size, cols, ink, o = {}) {
  X.save(); X.font = `600 ${size}px ${FONT_TALK}`; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.lineJoin = 'round';
  let cx = x;
  [...txt].forEach((ch, i) => {
    const col = Array.isArray(cols) ? cols[i % cols.length] : cols, w = X.measureText(ch).width, r = (hash(i * 4.3 + 1) - .5) * .12;
    X.save(); X.translate(cx + w / 2, y); X.rotate(r);
    const fat = o.fat ?? 1;
    X.lineWidth = size * .2 * fat; X.strokeStyle = ink; X.strokeText(ch, -w / 2, 0);
    X.lineWidth = size * .14 * fat; X.strokeStyle = col || DRY.paper; X.strokeText(ch, -w / 2, 0);
    X.fillStyle = col || DRY.paper; X.fillText(ch, -w / 2, 0);
    if (o.inner) { X.lineWidth = size * .018; X.strokeStyle = ink; X.strokeText(ch, -w / 2, 0); }
    X.restore();
    cx += w * (o.track ?? 1.02);
  });
  X.restore();
}

// ---------- crayon and marker ----------
// a crayon-coloured region: a pale wash, then waxy hatching clipped to the shape, with paper showing through
function dryColor(pts, col, o = {}) {
  const seed = o.seed ?? pts.length * 13, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), gap = o.gap ?? 14, ang = o.ang ?? -.9;
  shape(pts, { fill: rgba(col, o.wash ?? .55), stroke: null, smooth: o.smooth });
  X.save(); tracePath(pts, true, o.smooth ?? false); X.clip();
  const c = Math.cos(ang), s = Math.sin(ang), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + gap;
  X.strokeStyle = col; X.lineCap = 'round';
  for (let i = 0, d = -R; d < R; d += gap, i++) {
    X.globalAlpha = .55 + .4 * hash(seed + i); X.lineWidth = gap * (.8 + .5 * hash(seed + i * 1.7));
    const ox = cx - s * d + (hash(seed + i * 2.3) - .5) * gap, oy = cy + c * d;
    X.beginPath(); X.moveTo(ox - c * R, oy - s * R); X.lineTo(ox + c * R, oy + s * R); X.stroke();
  }
  X.restore();
}
const dryInk = (pts, col, lw, o = {}) => line(o.closed === false ? pts : [...pts, pts[0]], { stroke: col, lw, smooth: o.smooth ?? .4 });
// a kid's scribble-out: tall narrow loops marching along, between a top and a bottom edge (functions of x)
function dryLoops(xa, xb, top, bot, n, col, lw, seed = 1) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = lerp(xa, xb, i / n), j = hash(seed + i);
    pts.push([x + (j - .5) * 30, top(x) + (hash(seed + i * 3) - .5) * 60], [x + 18 + (j - .5) * 30, bot(x) + (hash(seed + i * 7) - .5) * 70]);
  }
  line(pts, { stroke: col, lw, smooth: .5 });
}
function dryStar(cx, cy, r, col, seed, o = {}) {
  const pts = starPts(cx, cy, r, .42, 5, -Math.PI / 2 + (hash(seed) - .5) * .3).map((p, i) => [p[0] + (hash(seed + i) - .5) * r * .15, p[1] + (hash(seed + i * 2) - .5) * r * .15]);
  dryColor(pts, col, { seed, gap: 16, wash: o.wash ?? .5 });
  if (o.sketch) for (let i = 0; i < 3; i++) dryInk(pts.map(p => [p[0] + (hash(seed + i * 9) - .5) * 14, p[1] + (hash(seed + i * 11) - .5) * 14]), col, 5);
}

// ---------- the three pieces of paper ----------
function drySheet(w, h, o) {
  shape(rectPts(0, 0, w, h), { fill: DRY.paper, stroke: rgba('#3B2530', .5), lw: 4 });
  if (o.fold) { shape(rectPts(0, 0, o.fold, h), { fill: rgba('#D8D2C4', .35), stroke: null }); line([[o.fold, 0], [o.fold + 6, h]], { stroke: rgba('#9C9488', .5), lw: 4 }); }
  (o.staples || []).forEach(([x, y]) => { line([[x, y], [x + 3, y + 100]], { stroke: DRY.staple, lw: 7 }); line([[x - 4, y + 2], [x - 1, y + 98]], { stroke: '#D9DEE2', lw: 2 }); });
}
function dryGold(t, d) {
  const [w, h] = DRY_SIZE.gold, G = DRY.gold;
  drySheet(w, h, { fold: 150, staples: [[86, 210], [130, 930], [126, 1690]] });
  // the scribbled-out middle of the page (a kid's change of plan) and the title above it
  if (d > .2) {
    dryLoops(60, 900, () => 600, x => 1000 + 50 * Math.sin(x * .01), 36, G, 7, 3);
    dryLoops(640, 1250, x => lerp(320, 40, seg(x, 640, 1000)), x => 1010 + 50 * Math.sin(x * .013), 26, G, 7, 9);
    X.save(); X.globalAlpha = .9; dryLoops(680, 960, () => 340, () => 700, 34, '#A07020', 9, 21); X.restore();
  }
  dryScrawl('Dolphin', 210, 300, 230, G, { w: 660, seed: 4 });
  dryScrawl('royalty', 230, 510, 120, G, { w: 400, seed: 8 });
  dryScrawl('Coloring', 720, 1215, 120, G, { w: 380, seed: 12 });
  dryScrawl('book', 760, 1320, 120, G, { w: 250, seed: 17 });
  dryScrawl('with mini', 800, 1795, 120, G, { w: 470, seed: 22 });
  dryScrawl('Poster!', 830, 1945, 140, G, { w: 380, seed: 27 });
  // the crowned rainbow dolphin, standing on her tail
  const pc = [[440, 1360], [452, 1300], [478, 1338], [500, 1296], [520, 1334], [540, 1310], [530, 1380]];
  dryColor(pc, DRY.yellow, { seed: 31 }); dryInk(pc, G, 6);
  [[442, 1268], [472, 1258], [500, 1270]].forEach(([x, y]) => ellipse(x, y, 12, 18, { fill: DRY.pinkLt, stroke: null }));
  const head = [[470, 1345], [540, 1312], [600, 1330], [640, 1405], [640, 1475], [560, 1505], [470, 1475], [450, 1400]];
  const beakT = [[620, 1425], [730, 1402], [900, 1420], [968, 1472], [860, 1470], [640, 1472]], beakB = [[640, 1480], [860, 1478], [965, 1482], [870, 1528], [700, 1542], [640, 1532]];
  const flipL = [[452, 1420], [405, 1470], [392, 1560], [420, 1665], [446, 1600]];
  const bodyP = [[446, 1500], [560, 1505], [572, 1600], [535, 1700], [512, 1860], [470, 1895], [430, 1862], [440, 1700]];
  const bodyG = [[560, 1530], [640, 1535], [652, 1690], [640, 1880], [580, 1895], [530, 1860], [540, 1700]];
  const fin = [[640, 1650], [720, 1640], [752, 1690], [720, 1742], [650, 1742]];
  dryColor(head, DRY.orange, { seed: 33 }); dryColor(flipL, DRY.violet, { seed: 34 }); dryColor(bodyP, DRY.pink, { seed: 35 }); dryColor(bodyG, DRY.lime, { seed: 36 }); dryColor(fin, DRY.yellow, { seed: 37 });
  for (const b of [beakT, beakB]) { dryColor(b, DRY.yellow, { seed: 38 }); X.save(); tracePath(b); X.clip(); dryColor(rectPts(735, 1380, 260, 180), DRY.violet, { seed: 39 }); X.restore(); }
  line([[548, 1380], [568, 1356], [590, 1392]], { stroke: '#7A3A10', lw: 9 });                                       // a dark mark on her head
  [head, beakT, beakB, flipL, bodyP, bodyG, fin].forEach(p => dryInk(p, G, 6));
  line([[730, 1404], [728, 1470]], { stroke: G, lw: 5 }); line([[720, 1480], [716, 1540]], { stroke: G, lw: 5 });
}
function dryGreen(t, d) {
  const [w, h] = DRY_SIZE.green, G = DRY.green, I = DRY.purple;
  drySheet(w, h, { fold: 120, staples: [] });
  shape([[95, 0], [205, 0], [180, 520], [140, 560]], { fill: '#EFEDEA', stroke: rgba('#3B2530', .4), lw: 3 });         // the folded flap
  dryScrawl('Dolphin', 150, 240, 190, G, { w: 440, seed: 41 });
  if (d > .2) { dryLoops(650, 860, () => 140, () => 225, 18, G, 6, 44); dryColor(rectPts(650, 150, 210, 75), G, { seed: 45, gap: 10, wash: .7 }); }
  dryScrawl('royalty.', 900, 270, 170, G, { w: 380, seed: 47 });
  line([[100, 340], [700, 352], [1310, 398]], { stroke: G, lw: 6, smooth: .5 });
  dryStar(185, 700, 140, DRY.yellow, 51); dryStar(1052, 725, 150, DRY.yellow, 52, { sketch: true, wash: .25 }); dryStar(1010, 1405, 150, DRY.yellow, 53, { sketch: true, wash: .3 });
  // the little blue royal (crowned) above the servant
  const blue = [[482, 600], [560, 580], [622, 622], [640, 680], [722, 662], [732, 722], [650, 762], [640, 822], [600, 872], [530, 872], [502, 792], [470, 700]];
  dryColor(blue, DRY.blue, { seed: 55, wash: .85, gap: 10 }); dryInk(blue, '#173C86', 5);
  line([[600, 690], [700, 690], [720, 720]], { stroke: '#1E6B3A', lw: 9 }); line([[640, 780], [662, 800]], { stroke: '#123468', lw: 10 });
  line([[492, 610], [500, 560], [522, 600], [538, 556], [552, 600], [570, 566], [574, 616]], { stroke: '#1E6B3A', lw: 7 });
  circle(585, 640, 7, { fill: '#123468', stroke: null });
  // the servant: a long yellow dolphin with an orange belly that says so
  const body = [[250, 1172], [330, 1200], [298, 1130], [470, 1150], [620, 1068], [800, 1002], [1000, 985], [1060, 912], [1112, 962], [1180, 992], [1252, 1032],
    [1232, 1082], [1100, 1092], [1000, 1122], [870, 1192], [850, 1250], [796, 1292], [790, 1212], [640, 1232], [480, 1242], [340, 1222], [252, 1262]];
  const dorsal = [[618, 1000], [640, 925], [702, 946], [800, 1002]];
  const belly = [[480, 1240], [560, 1130], [800, 1062], [1000, 1052], [1060, 1092], [1000, 1122], [870, 1192], [640, 1230]];
  dryColor(body, DRY.yellow, { seed: 57 }); dryColor(dorsal, DRY.yellow, { seed: 58 }); dryColor(belly, DRY.orange, { seed: 59, wash: .75 });
  dryInk(body, I, 5, { smooth: .3 }); dryInk(dorsal, I, 5, { closed: false });
  line([[1000, 1052], [1070, 1092], [1200, 1062]], { stroke: I, lw: 6, smooth: .4 }); circle(1082, 982, 7, { fill: I, stroke: null });
  X.save(); X.translate(700, 1182); X.rotate(-.06); dryScrawl('servent', -130, 0, 90, DRY.brown, { w: 260, seed: 61 }); X.restore();
  // the rainbow dolphin with a flower, bottom left
  const rb = [[382, 1472], [440, 1452], [500, 1522], [520, 1642], [510, 1782], [480, 1902], [452, 1992], [420, 1952], [400, 1802], [372, 1642], [352, 1542]];
  dryColor(rb, DRY.pink, { seed: 63 }); X.save(); tracePath(rb); X.clip();
  dryColor(rectPts(400, 1440, 60, 600), DRY.orange, { seed: 64 }); dryColor(rectPts(455, 1440, 80, 600), DRY.blueLt, { seed: 65 }); dryColor(rectPts(380, 1560, 160, 40), DRY.violet, { seed: 66 });
  X.restore(); dryInk(rb, I, 5);
  const bk = [[472, 1532], [562, 1520], [662, 1542], [652, 1584], [562, 1602], [482, 1592]];
  dryColor(bk, DRY.orange, { seed: 67 }); X.save(); tracePath(bk); X.clip(); dryColor(rectPts(470, 1500, 200, 52), DRY.lime, { seed: 68 }); X.restore(); dryInk(bk, '#5A2A12', 5);
  line([[372, 1460], [380, 1420], [400, 1450], [414, 1410], [428, 1452]], { stroke: '#A07020', lw: 6 }); dryColor([[372, 1460], [380, 1420], [400, 1450], [414, 1410], [428, 1452], [430, 1480], [376, 1484]], DRY.yellow, { seed: 69 });
  line([[560, 1700], [566, 1800]], { stroke: DRY.lime, lw: 6 }); line([[564, 1760], [590, 1740]], { stroke: DRY.lime, lw: 5 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ellipse(560 + 20 * Math.cos(a), 1690 + 20 * Math.sin(a), 12, 12, { fill: '#8A4FC0', stroke: null }); }
  circle(560, 1690, 10, { fill: '#5A2A12', stroke: null });
  // grass along the bottom, and the title
  for (let i = 0; i < 44; i++) { const x = 130 + i * 28 + (hash(i + 70) - .5) * 14, top = 1820 + (i > 20 ? 30 : 0) + hash(i + 71) * 110;
    line([[x, 2048], [x + (hash(i + 72) - .5) * 10, top]], { stroke: DRY.grass, lw: 16 + 10 * hash(i + 73) }); }
  dryScrawl('Coloring', 950, 1660, 110, G, { w: 300, seed: 75 }); dryScrawl('book', 1000, 1762, 110, G, { w: 180, seed: 78 });
}
function dryPoster(t, d) {
  const [w, h] = DRY_SIZE.poster, Pn = DRY.pencil;
  drySheet(w, h, {});
  const pen = (a, b) => line([a, b], { stroke: Pn, lw: 3.5 });
  // the red jewel under "Pearl", its facets running down to a point
  const gem = [[262, 520], [322, 402], [1082, 300], [1090, 530], [1042, 622], [722, 762], [302, 782], [257, 562]];
  dryColor(gem, DRY.red, { seed: 81, wash: .85, gap: 10 });
  [[302, 782], [430, 770], [560, 765], [700, 760], [850, 700], [960, 650], [1042, 622]].forEach(p => pen(p, [632, 962]));
  [[560, 500], [700, 470], [840, 430], [950, 400]].forEach((p, i) => pen(p, [[440, 770], [560, 765], [700, 760], [850, 700]][i]));
  dryBubble('P', 205, 612, 460, DRY.violet, DRY.violet);
  dryBubble('ea', 448, 560, 300, DRY.pinkLt, '#9A3F8A', { inner: true });
  dryBubble('r', 890, 520, 270, DRY.yellow, DRY.yellow); dryBubble('l', 1010, 530, 380, DRY.orange, DRY.orange);
  // the pencil diamond with "mama" inside
  const top = [1555, 75], bot = [1582, 992], L = [1240, 620], R = [1952, 552], tb = [[1440, 205], [1810, 200]], bb = [[1450, 826], [1722, 826]];
  pen(tb[0], tb[1]); pen(bb[0], bb[1]); pen(tb[0], L); pen(tb[1], R); pen(L, bb[0]); pen(R, bb[1]);
  for (let i = 0; i <= 6; i++) { const x = lerp(tb[0][0], tb[1][0], i / 6); pen(top, [x, 203]); pen([x, 203], [lerp(L[0], R[0], i / 6), lerp(L[1], R[1], i / 6) + 80]); }
  for (let i = 0; i <= 6; i++) pen([lerp(bb[0][0], bb[1][0], i / 6), 826], bot);
  dryBubble('ma', 1215, 650, 220, DRY.yellow, '#F6B6CC', { track: .98, fat: .5 }); dryBubble('ma', 1500, 650, 220, DRY.orange, '#F6B6CC', { track: .98, fat: .5 });
  // "frag" twice: once in pencil, once in outlined bubble letters with a green f, and the second jewel's lines
  [[1250, 1260], [1340, 1250], [1460, 1250], [1560, 1240], [1660, 1250]].forEach(p => pen([1110, 800], p));
  dryScrawl('Frag', 70, 1240, 220, Pn, { w: 460, seed: 85 }); dryScrawl('m', 750, 1140, 170, Pn, { w: 140, seed: 88 });
  dryBubble('frag', 990, 1300, 330, null, DRY.violet, { inner: true });
  X.save(); X.beginPath(); X.rect(1000, 960, 230, 150); X.clip(); dryBubble('f', 990, 1300, 330, DRY.lime, DRY.violet, { inner: true }); X.restore();
}
function dryCover(kind, x, y, w, ang = 0, o = {}) {
  const k = o.k ?? 1; if (k <= .01) return;
  const [pw, ph] = DRY_SIZE[kind], s = w / pw * k;
  X.save(); X.translate(x, y); X.rotate(ang); X.scale(s, s); X.translate(-pw / 2, -ph / 2);
  if (o.shadow !== false) { X.save(); X.translate(pw * .025, pw * .03); shape(rectPts(0, 0, pw, ph), { fill: 'rgba(40,20,30,.28)', stroke: null }); X.restore(); }
  if (kind !== 'poster') { X.save(); X.translate(pw * .012, pw * .012); shape(rectPts(0, 0, pw, ph), { fill: DRY.shade, stroke: rgba('#3B2530', .4), lw: 4 }); X.restore(); }   // the pages under the cover
  withBoil(0, () => (kind === 'gold' ? dryGold : kind === 'green' ? dryGreen : dryPoster)(o.t ?? T, o.draw ?? 1));
  X.restore();
}

// ---------- the story cloud ----------
function dryPop(cx, cy, r, k, t, fn) {
  if (k <= .01) return;
  const R = r * k, bumps = [];
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; bumps.push([cx + Math.cos(a) * R * 1.05, cy + Math.sin(a) * R * .82]); }
  bumps.forEach(([x, y], i) => circle(x, y, R * (.24 + .05 * Math.sin(t * 3 + i)), { fill: rgba('#FFFFFF', .9), stroke: null }));
  ellipse(cx, cy, R * 1.08, R * .86, { fill: radGrad(cx, cy, R * .2, R * 1.1, [[0, '#FFFFFF'], [.7, '#FFF8EC'], [1, '#FCEBD5']]), stroke: null });
  X.save(); X.beginPath(); X.ellipse(cx, cy, R * 1.08, R * .86, 0, 0, TAU); X.clip(); fn(); X.restore();
  for (let i = 0; i < 7; i++) {                                                             // sparkles around the rim
    const a = t * .7 + i / 7 * TAU, tw = .5 + .5 * Math.sin(t * 6 + i * 2.3);
    shape(starPts(cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 1.0, R * (.05 + .05 * tw), .35, 4), { fill: [PAL.goldLt, '#F7A8D0', '#A8DCF7'][i % 3], stroke: null });
  }
}
function dryCrayon(x, y, len, ang, col) {
  const w = len * .2;
  X.save(); X.translate(x, y); X.rotate(ang);
  shape([[0, 0], [len * .18, -w / 2], [len * .18, w / 2]], { fill: col, stroke: PAL.ink, lwPx: 1.5 });
  shape(rectPts(len * .18, -w / 2, len * .82, w), { fill: col, stroke: PAL.ink, lwPx: 1.5 });
  shape(rectPts(len * .32, -w / 2, len * .5, w), { fill: rgba('#FFFFFF', .35), stroke: null });                    // the paper wrapper
  line([[len * .36, -w / 2], [len * .36, w / 2]], { stroke: PAL.ink, lwPx: 1.2 }); line([[len * .78, -w / 2], [len * .78, w / 2]], { stroke: PAL.ink, lwPx: 1.2 });
  X.restore();
}
// a sheet of paper flat on a table top (world units): corners projected through P, with lines written on it so far (n 0..1)
function dryPaper(P, x, y, z, w, d, ang, o = {}) {
  const c = Math.cos(ang), s = Math.sin(ang), at = (u, v) => P.p(x + u * c - v * s, y + .5, z + u * s + v * c);
  const q = [at(-w / 2, -d / 2), at(w / 2, -d / 2), at(w / 2, d / 2), at(-w / 2, d / 2)].map(p => [p[0], p[1]]);
  shape(q, { fill: o.col || '#FFFDF6', stroke: PAL.ink, lwPx: 1.5 });
  const n = o.n ?? 0, rows = 6;
  for (let i = 0; i < rows; i++) {
    const f = clamp(n * rows - i); if (f <= 0) break;
    const v = -d / 2 + d * (i + 1) / (rows + 1), a = at(-w * .38, v), b = at(-w * .38 + w * .76 * f * (.7 + .3 * hash(i + (o.seed || 0))), v);
    line([[a[0], a[1]], [b[0], b[1]]], { stroke: o.ink || '#5A6A8A', lwPx: 1.6 });
  }
  if (o.doodle) { const m = at(0, 0); o.doodle(m[0], m[1], P.k(z)); }
  return q;
}
