// scenes/cleaning_up/scene31_cleaning_up_4/props.js: painted backdrops, effects and props for "Robots vs. Titans".
// Everything is drawn in screen px and is a pure function of its arguments (and t). Names are prefixed rvt (Robots vs. Titans).

const RVT = {
  ink: '#2A1726', cream: '#FFF8EC', marble: '#FAF4E6', marbleSh: '#E3D6BE', marbleDk: '#C9B89A',
  terra: '#D9733A', terraLt: '#EE9A5C', terraDk: '#A9502A', black: '#1E1210', gold: '#F2C440', goldDk: '#B98A22',
  roof: '#C9653E', roofDk: '#9A4527', wall: '#F7F1E6', wallSh: '#E4D9C6', cypress: '#3F6B3A', cypressDk: '#2C4F2A',
  olive: '#8FA66A', oliveDk: '#64804A', rock: '#D6C29A', rockDk: '#B59D72', rockLt: '#E8D9B6',
  sea: '#2F8FC4', seaLt: '#7CC6E6', seaDk: '#1D5F96', foam: '#EAFBFF', red: '#FF2E2E', steel: '#BAC4CA', steelDk: '#8C98A0', brass: '#D9A441', brassDk: '#9C6E22',
};
// Sky palettes: [top, middle, horizon], plus tints for the city (wall, roof, rock, sea) so each mood paints the same Athens.
const RVT_MOOD = {
  dawn:   { sky: ['#6FA8E0', '#F4C9A8', '#FFE2B0'], sun: '#FFF1C4', tint: null, sea: ['#3D8FC0', '#8CCDE6'] },
  day:    { sky: ['#4F9FE3', '#9ED0F0', '#D6EEF8'], sun: '#FFF6D0', tint: null, sea: ['#2F8FC4', '#7CC6E6'] },
  alarm:  { sky: ['#4A0E1E', '#C2341E', '#FF8A3A'], sun: '#FFD07A', tint: ['#FF6A3A', .28], sea: ['#7A2A3A', '#D86A4A'] },
  sunset: { sky: ['#3A1B5C', '#D9483A', '#FFB24A'], sun: '#FFE07A', tint: ['#FF7A3A', .22], sea: ['#5A3A7A', '#F08A5A'] },
  storm:  { sky: ['#0E1430', '#26305A', '#4A5A82'], sun: null, tint: ['#24305A', .45], sea: ['#18284A', '#3E5A86'] },
  gold:   { sky: ['#7FB8E8', '#FFD9A0', '#FFF0C8'], sun: '#FFF6D0', tint: ['#FFC870', .12], sea: ['#3A9AD0', '#9CDCF0'] },
  night:  { sky: ['#0A0A24', '#1C1C4A', '#3A2E66'], sun: null, tint: ['#1C1C4A', .55], sea: ['#141C3E', '#2E3E70'] },
};
const rvtTint = (c, m) => m && m.tint ? mixCol(c, m.tint[0], m.tint[1]) : c;

// ---------- skies ----------
function rvtSky(m) { const [a, b, c] = m.sky; shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, -40, 0, H, [[0, a], [.62, b], [1, c]]), stroke: null }); }
function rvtSun(x, y, r, col, glow = 1) {
  circle(x, y, r * 3, { fill: radGrad(x, y, r * .6, r * 3, [[0, rgba(col, .45 * glow)], [1, rgba(col, 0)]]), stroke: null });
  circle(x, y, r, { fill: col, stroke: null });
}
function rvtClouds(t, y, n, col, o = {}) {
  const sp = o.speed ?? 12, s0 = o.s ?? 1;
  for (let i = 0; i < n; i++) {
    const L = W + 700, x = ((hash(i * 5.3 + (o.seed || 0)) * L + t * sp * (.6 + hash(i) * .8)) % L) - 350, yy = y + (hash(i * 2.7) - .5) * (o.spread ?? 160), s = s0 * (.7 + hash(i * 1.9) * .7);
    [[0, 0, 70], [60, -20, 55], [-60, -10, 50], [110, 8, 40], [-110, 10, 38]].forEach(([dx, dy, r]) => circle(x + dx * s, yy + dy * s, r * s, { fill: col, stroke: null }));
  }
}
function rvtStars(t, n = 120, yMax = H * .75, seed = 3) {
  for (let i = 0; i < n; i++) {
    const x = hash(i * 3.1 + seed) * W, y = hash(i * 7.7 + seed) * yMax, tw = .5 + .5 * Math.sin(t * (1.5 + hash(i) * 3) + i), r = 1.1 + hash(i * 1.3) * 2.4;
    circle(x, y, r * (.6 + .4 * tw), { fill: rgba('#FFF6D8', .4 + .6 * tw), stroke: null });
  }
}
function rvtSunburst(cx, cy, t, c1, c2, n = 18, spin = .15) {
  shape(rectPts(-40, -40, W + 80, H + 80), { fill: c1, stroke: null });
  for (let i = 0; i < n; i++) { const a0 = i / n * TAU + t * spin, a1 = a0 + TAU / n / 2;
    shape([[cx, cy], [cx + Math.cos(a0) * 3000, cy + Math.sin(a0) * 3000], [cx + Math.cos(a1) * 3000, cy + Math.sin(a1) * 3000]], { fill: c2, stroke: null }); }
}
function rvtSpeedLines(cx, cy, t, col, n = 40, r0 = 380) {
  for (let i = 0; i < n; i++) { const a = hash(i * 3.3 + Math.floor(t * 12)) * TAU, r1 = r0 + hash(i * 1.1 + Math.floor(t * 12)) * 200, w = 4 + 10 * hash(i * 7.1);
    shape([[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a + .012 * w / 4) * 2400, cy + Math.sin(a + .012 * w / 4) * 2400], [cx + Math.cos(a - .012 * w / 4) * 2400, cy + Math.sin(a - .012 * w / 4) * 2400]], { fill: col, stroke: null }); }
}
// a forked lightning bolt from (x0, y0) to (x1, y1)
function rvtLightning(x0, y0, x1, y1, seed, w, col = '#FFFBE0', k = 1) {
  if (k <= .01) return;
  const pts = [[x0, y0]], n = 9;
  for (let i = 1; i < n; i++) { const u = i / n; pts.push([lerp(x0, x1, u) + (hash(seed + i * 3.7) - .5) * 140, lerp(y0, y1, u) + (hash(seed + i * 1.3) - .5) * 30]); }
  pts.push([x1, y1]);
  X.save(); X.globalAlpha = k; X.globalCompositeOperation = 'lighter';
  line(pts, { stroke: rgba(col, .35), lwPx: w * 4 }); X.restore();
  X.save(); X.globalAlpha = k; line(pts, { stroke: col, lwPx: w }); const m = pts[4]; line([m, [m[0] + 120 * (hash(seed) - .3), m[1] + 140], [m[0] + 60, m[1] + 260]], { stroke: col, lwPx: w * .6 }); X.restore();
}

// ---------- Athens ----------
// The Parthenon, front on: (x, y) = centre of the top step, w = width in px. m = mood (tints it); o.glow lights it.
function rvtParthenon(x, y, w, m, o = {}) {
  const u = w / 100, mar = rvtTint(RVT.marble, m), sh = rvtTint(RVT.marbleSh, m), dk = rvtTint(RVT.marbleDk, m), lw = clamp(u * .5, .8, 3);
  X.save(); X.translate(x, y);
  shape(rectPts(-54 * u, 0, 108 * u, 4 * u), { fill: sh, stroke: RVT.ink, lwPx: lw }); shape(rectPts(-51 * u, -3 * u, 102 * u, 3 * u), { fill: mar, stroke: RVT.ink, lwPx: lw });
  shape(rectPts(-46 * u, -34 * u, 92 * u, 31 * u), { fill: dk, stroke: null });
  for (let i = 0; i < 8; i++) { const cx = -42 * u + i * 12 * u;
    shape([[cx - 3.6 * u, -3 * u], [cx - 3.0 * u, -33 * u], [cx + 3.0 * u, -33 * u], [cx + 3.6 * u, -3 * u]], { fill: mar, stroke: RVT.ink, lwPx: lw });
    line([[cx + 1.4 * u, -5 * u], [cx + 1.1 * u, -31 * u]], { stroke: sh, lwPx: lw * 1.2 }); }
  shape(rectPts(-48 * u, -40 * u, 96 * u, 7 * u), { fill: mar, stroke: RVT.ink, lwPx: lw });
  for (let i = 0; i < 16; i++) shape(rectPts(-46 * u + i * 5.9 * u, -39 * u, 2.2 * u, 4.5 * u), { fill: sh, stroke: null });
  shape([[-50 * u, -40 * u], [0, -52 * u], [50 * u, -40 * u]], { fill: mar, stroke: RVT.ink, lwPx: lw });
  shape([[-42 * u, -41.5 * u], [0, -50 * u], [42 * u, -41.5 * u]], { fill: sh, stroke: null });
  X.restore();
}
// The Acropolis: a rocky flat-topped hill with the Parthenon on it. (x, y) = foot centre, w = width of the hill.
function rvtAcropolis(x, y, w, m, o = {}) {
  const h = w * .28, rock = rvtTint(RVT.rock, m), dk = rvtTint(RVT.rockDk, m), lt = rvtTint(RVT.rockLt, m);
  const pts = [[x - w * .5, y], [x - w * .42, y - h * .55], [x - w * .34, y - h * .8], [x - w * .26, y - h], [x + w * .28, y - h], [x + w * .36, y - h * .78], [x + w * .44, y - h * .5], [x + w * .5, y]];
  shape(pts, { fill: rock, stroke: RVT.ink, lwPx: 2, smooth: .15 });
  shape([[x - w * .26, y - h], [x + w * .28, y - h], [x + w * .26, y - h * .88], [x - w * .24, y - h * .9]], { fill: lt, stroke: null });
  for (let i = 0; i < 7; i++) { const sx = x + (hash(i * 4.1) - .5) * w * .7, sy = y - h * (.2 + .5 * hash(i * 2.2));
    shape([[sx - 30, sy], [sx, sy - 14], [sx + 34, sy + 4]], { fill: dk, stroke: null, alpha: .6 }); }
  for (let i = 0; i < 9; i++) { const sx = x + (hash(i * 7.3) - .5) * w * .85, sy = y - h * .12 * hash(i); circle(sx, sy, 14 + 10 * hash(i * 3), { fill: rvtTint(RVT.olive, m), stroke: null }); }
  rvtParthenon(x + w * .02, y - h + 2, w * .36, m, o);
  // the Propylaea gateway and the little Erechtheion
  shape(rectPts(x - w * .24, y - h - w * .045, w * .06, w * .045), { fill: rvtTint(RVT.marble, m), stroke: RVT.ink, lwPx: 1.5 });
  shape(rectPts(x + w * .2, y - h - w * .035, w * .05, w * .035), { fill: rvtTint(RVT.marbleSh, m), stroke: RVT.ink, lwPx: 1.5 });
  return { top: [x + w * .02, y - h], h };
}
// A row of white houses with terracotta roofs, olive bushes and cypresses along yBase. s = house size, scroll = px to the left.
function rvtTown(yBase, s, m, o = {}) {
  const scroll = (o.scroll || 0) - (o.x0 ?? -40) - 40, gap = s * 1.25, n = Math.ceil(((o.x1 ?? W + 40) - (o.x0 ?? -40) + 600) / gap) + 2, seed = o.seed || 1;
  const wall = rvtTint(RVT.wall, m), wsh = rvtTint(RVT.wallSh, m), roof = rvtTint(RVT.roof, m), rdk = rvtTint(RVT.roofDk, m);
  for (let j = 0; j < n; j++) {
    const i = j + Math.floor(scroll / gap), x = i * gap - scroll - 200 + hash(i * 3.3 + seed) * s * .3, hh = s * (.55 + .5 * hash(i * 1.7 + seed)), ww = s * (.8 + .4 * hash(i * 2.9 + seed));
    if (hash(i * 5.1 + seed) < .22) { const ch = s * (1.1 + .6 * hash(i)); shape([[x, yBase], [x + s * .14, yBase - ch], [x + s * .28, yBase]], { fill: rvtTint(RVT.cypress, m), stroke: RVT.ink, lwPx: 1.5, smooth: .3 }); continue; }
    shape(rectPts(x, yBase - hh, ww, hh), { fill: wall, stroke: RVT.ink, lwPx: 1.6 });
    shape(rectPts(x + ww * .62, yBase - hh, ww * .38, hh), { fill: wsh, stroke: null });
    shape([[x - s * .06, yBase - hh], [x + ww * .5, yBase - hh - s * .2], [x + ww + s * .06, yBase - hh]], { fill: roof, stroke: RVT.ink, lwPx: 1.6 });
    line([[x + ww * .5, yBase - hh - s * .2], [x + ww + s * .06, yBase - hh]], { stroke: rdk, lwPx: 2 });
    shape(rectPts(x + ww * .2, yBase - hh * .55, ww * .16, hh * .26), { fill: rvtTint('#3E5A8A', m), stroke: null });
    if (hash(i * 9.1 + seed) > .5) shape(rectPts(x + ww * .52, yBase - hh * .42, ww * .2, hh * .42), { fill: rvtTint('#7A4A30', m), stroke: null });
    if (hash(i * 6.2 + seed) > .55) circle(x + ww + s * .1, yBase - s * .12, s * .16, { fill: rvtTint(RVT.olive, m), stroke: RVT.ink, lwPx: 1.2 });
  }
}
// The sea band from y down to yb with moving wave lines.
function rvtSea(y, yb, t, m, o = {}) {
  const [c0, c1] = m.sea, x0 = o.x0 ?? -40, x1 = o.x1 ?? W + 40, span = x1 - x0 + 300;
  shape(rectPts(x0, y, x1 - x0, yb - y), { fill: linGrad(0, y, 0, yb, [[0, c1], [1, c0]]), stroke: null });
  for (let r = 0; r < 7; r++) { const yy = y + 10 + r * r * (yb - y) / 50, sp = 20 + r * 14;
    for (let i = 0; i < Math.ceil(span / 230); i++) { const x = x0 + ((i * 230 + r * 97 + t * sp) % span) - 150, w = 30 + r * 12;
      line([[x, yy], [x + w * .5, yy - 3 - r * .6], [x + w, yy]], { stroke: rgba('#FFFFFF', .45), lwPx: 2 + r * .5, smooth: true }); } }
}
// A full painted skyline: sky, sun, clouds, hills, the Acropolis, the town and (optionally) the sea.
// o: { horizon, acroX, acroW, sun: [x, y], sea: true/false, scroll, townS }
function rvtSkyline(t, m, o = {}) {
  const hz = o.horizon ?? 760, x0 = o.x0 ?? -40, x1 = o.x1 ?? W + 40;
  if (o.sky !== false) rvtSky(m);
  if (m === RVT_MOOD.night) rvtStars(t, 140, hz - 100);
  if (m.sun && o.sun !== false) rvtSun(...(o.sun || [1500, hz - 330]), o.sunR ?? 70, m.sun);
  rvtClouds(t, hz - 450, 5, m === RVT_MOOD.storm ? '#3A4670' : m === RVT_MOOD.night ? rgba('#3A3A70', .6) : rgba('#FFFFFF', m === RVT_MOOD.alarm || m === RVT_MOOD.sunset ? .25 : .75), { s: .9, seed: 2 });
  // far ridge (Mount Hymettus)
  const ridge = []; for (let x = x0; x <= x1; x += 40) ridge.push([x, hz - 120 - 60 * Math.sin(x / 600 + 1) - 30 * Math.sin(x / 230)]);
  shape([[x0, hz + 40], ...ridge, [x1, hz + 40]], { fill: rvtTint('#A9B7C4', m), stroke: null });
  const A = o.acro === false ? null : rvtAcropolis(o.acroX ?? 700 - (o.scroll || 0) * .3, hz + 10, o.acroW ?? 900, m);
  const yb = o.bottom ?? H + 40;
  if (o.sea) rvtSea(hz, yb, t, m, { x0, x1 });
  else { shape(rectPts(x0, hz, x1 - x0, yb - hz), { fill: rvtTint('#DCC496', m), stroke: null }); if (o.town !== false) rvtTown(hz + 40, o.townS ?? 90, m, { scroll: o.scroll || 0, seed: 3, x0, x1 }); }
  return A;
}
// A Doric column for foreground framing: (x, y) = base centre, h tall, w wide.
function rvtColumn(x, y, h, w, m, o = {}) {
  const mar = rvtTint(RVT.marble, m), sh = rvtTint(RVT.marbleSh, m);
  shape([[x - w * .5, y], [x - w * .42, y - h], [x + w * .42, y - h], [x + w * .5, y]], { fill: mar, stroke: RVT.ink, lwPx: 3 });
  for (let i = 1; i < 5; i++) line([[x - w * .5 + i * w / 5, y - 4], [x - w * .42 + i * w * .84 / 5, y - h + 4]], { stroke: sh, lwPx: 3 });
  shape(rectPts(x - w * .62, y - h - w * .22, w * 1.24, w * .22), { fill: mar, stroke: RVT.ink, lwPx: 3 });
  shape(rectPts(x - w * .7, y - h - w * .36, w * 1.4, w * .16), { fill: sh, stroke: RVT.ink, lwPx: 3 });
  if (o.broken) shape([[x - w * .42, y - h], [x - w * .2, y - h - w * .3], [x + w * .1, y - h - w * .1], [x + w * .42, y - h - w * .25]], { fill: mar, stroke: RVT.ink, lwPx: 3 });
}
// A clay amphora: (x, y) = base, h tall. o.wobble tilts it, o.water shows trembling water in the mouth.
function rvtAmphora(x, y, h, o = {}) {
  const k = h / 100;
  X.save(); X.translate(x, y); X.rotate(o.rot || 0); X.scale(k, k);
  shape([[-8, 0], [-26, -30], [-24, -62], [-12, -78], [-10, -92], [10, -92], [12, -78], [24, -62], [26, -30], [8, 0]], { fill: o.fill || RVT.terra, stroke: RVT.ink, lwPx: 3, smooth: .35 });
  shape(rectPts(-24, -58, 48, 20), { fill: RVT.black, stroke: null, alpha: .85 });
  for (let i = 0; i < 6; i++) line([[-22 + i * 8, -42], [-18 + i * 8, -54]], { stroke: RVT.terraLt, lwPx: 3 });
  [-1, 1].forEach(sd => line([[sd * 11, -86], [sd * 24, -82], [sd * 22, -66]], { stroke: RVT.ink, lwPx: 5, smooth: true }));
  ellipse(0, -92, 12, 4, { fill: o.water ? '#3E8FC0' : RVT.terraDk, stroke: RVT.ink, lwPx: 2.5 });
  X.restore();
}

// ---------- the vacuum beam ----------
// A swirling cone from the hatch (hx, hy) down to (gx, gy): w0 wide at the top, w1 at the bottom. k 0..1 = power.
function rvtVortex(hx, hy, gx, gy, w0, w1, t, k = 1, col = '#FF5A5A') {
  if (k <= .01) return;
  const ang = Math.atan2(gy - hy, gx - hx) - Math.PI / 2, len = Math.hypot(gx - hx, gy - hy);
  X.save(); X.translate(hx, hy); X.rotate(ang);
  X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = .55 * k;
  shape([[-w0 / 2, 0], [w0 / 2, 0], [w1 / 2, len], [-w1 / 2, len]], { fill: linGrad(0, 0, 0, len, [[0, rgba(col, .75)], [1, rgba(col, .15)]]), stroke: null });
  X.restore();
  X.save(); X.globalAlpha = .8 * k;
  for (let i = 0; i < 22; i++) {
    const ph = frac(hash(i * 2.1) - t * (.9 + hash(i) * .6)), y = len * ph, w = lerp(w0, w1, ph), a = t * 7 + i * 2.4;
    const x0 = Math.sin(a) * w * .45, x1 = Math.sin(a + .9) * w * .45;
    line([[x0, y], [lerp(x0, x1, .5), y + 18 + 30 * ph], [x1, y + 40 * ph]], { stroke: i % 3 ? rgba('#FFE0D0', .7) : rgba('#FFFFFF', .9), lwPx: 3 + 4 * ph, smooth: true });
  }
  X.restore();
  // ground ring
  ellipse(0, len, w1 * .55 * (1 + .06 * Math.sin(t * 14)), w1 * .12, { fill: rgba(col, .25 * k), stroke: rgba(col, .8 * k), lwPx: 4 });
  X.restore();
}

// ---------- the vase look: terracotta grounds, meanders, black figures ----------
function rvtTerracotta(t, o = {}) {
  shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, H / 2, 200, 1300, [[0, RVT.terraLt], [1, RVT.terraDk]]), stroke: null });
  for (let i = 0; i < 60; i++) circle(hash(i * 3.7) * W, hash(i * 9.3) * H, 2 + 6 * hash(i), { fill: rgba('#7A3416', .12), stroke: null });
}
// A Greek key (meander) band across the frame at y, h tall.
function rvtMeander(y, h, col = RVT.black, bg = null, scroll = 0) {
  if (bg) shape(rectPts(-40, y, W + 80, h), { fill: bg, stroke: null });
  const u = h / 6, step = u * 6;
  X.save(); X.beginPath(); X.rect(-40, y, W + 80, h); X.clip();
  for (let x = -step - (scroll % step); x < W + step; x += step)
    line([[x, y + 5 * u], [x, y + u], [x + 4 * u, y + u], [x + 4 * u, y + 4 * u], [x + 2 * u, y + 4 * u], [x + 2 * u, y + 2.5 * u], [x + 3 * u, y + 2.5 * u]], { stroke: col, lwPx: u * .9, cap: 'square' });
  line([[-40, y + .3 * u], [W + 40, y + .3 * u]], { stroke: col, lwPx: u * .6 }); line([[-40, y + 5.7 * u], [W + 40, y + 5.7 * u]], { stroke: col, lwPx: u * .6 });
  X.restore();
}
// Paint fn() as black figures (every pixel it draws goes black), with a thin incised highlight offset.
function rvtBlackFigure(fn, o = {}) {
  layer(fn, { filter: 'brightness(0)' + (o.alpha != null ? ` opacity(${o.alpha})` : '') });
}
// The amphora silhouette (x, y = centre of the belly, s = scale ≈ px per unit, the belly ≈ 10 units wide). Returns the
// belly panel rectangle for black-figure painting; paint inside with rvtVaseClip.
function rvtVasePts(x, y, s) {
  return [[0, 7.2], [-1.5, 6.9], [-2.6, 6.2], [-4.6, 3.8], [-5.2, 0], [-4.8, -2.8], [-3.4, -4.6], [-1.8, -5.4], [-1.5, -6.6], [-2.2, -7.4],
          [2.2, -7.4], [1.5, -6.6], [1.8, -5.4], [3.4, -4.6], [4.8, -2.8], [5.2, 0], [4.6, 3.8], [2.6, 6.2], [1.5, 6.9]].map(([a, b]) => [x + a * s, y + b * s]);
}
function rvtVase(x, y, s, t, o = {}) {
  const pts = rvtVasePts(x, y, s);
  // handles
  [-1, 1].forEach(sd => line([[x + sd * 1.7 * s, y - 6.2 * s], [x + sd * 4.3 * s, y - 6.6 * s], [x + sd * 4.4 * s, y - 4.6 * s], [x + sd * 3.6 * s, y - 3.8 * s]], { stroke: RVT.black, lwPx: s * .55, smooth: true }));
  shape(pts, { fill: radGrad(x - 1.5 * s, y - 1.5 * s, s, s * 7, [[0, RVT.terraLt], [1, RVT.terra]]), stroke: RVT.black, lwPx: s * .22, smooth: .4 });
  // black neck, foot and shoulder bands
  X.save(); tracePath(pts, true, .4); X.clip();
  shape(rectPts(x - 6 * s, y - 8 * s, 12 * s, 3.4 * s), { fill: RVT.black, stroke: null });
  shape(rectPts(x - 6 * s, y + 3.9 * s, 12 * s, 4 * s), { fill: RVT.black, stroke: null });
  for (let i = 0; i < 11; i++) { const rx = x - 5 * s + i * s; shape([[rx, y + 3.9 * s], [rx + .5 * s, y + 5.2 * s], [rx + s, y + 3.9 * s]], { fill: RVT.terra, stroke: null }); }
  if (o.panel) { X.save(); X.beginPath(); X.rect(x - 4.6 * s, y - 4.2 * s, 9.2 * s, 7.8 * s); X.clip(); o.panel(); X.restore(); }
  // shine
  shape([[x - 3.8 * s, y - 2.2 * s], [x - 3.2 * s, y - 3.4 * s], [x - 2.6 * s, y - 1 * s], [x - 3.3 * s, y + 1.4 * s]], { fill: rgba('#FFFFFF', .22), stroke: null, smooth: true });
  X.restore();
  shape(pts, { fill: null, stroke: RVT.black, lwPx: s * .22, smooth: .4 });
}

// ---------- machinery ----------
function rvtGear(x, y, r, teeth, ang, col = RVT.brass, dk = RVT.brassDk) {
  const pts = []; for (let i = 0; i < teeth * 4; i++) { const a = ang + i / (teeth * 4) * TAU, q = i % 4 < 2 ? r : r * .82; pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
  shape(pts, { fill: col, stroke: RVT.ink, lwPx: 4 });
  circle(x, y, r * .62, { fill: dk, stroke: RVT.ink, lwPx: 3 });
  for (let i = 0; i < 5; i++) { const a = ang + i / 5 * TAU; circle(x + Math.cos(a) * r * .4, y + Math.sin(a) * r * .4, r * .1, { fill: col, stroke: RVT.ink, lwPx: 2 }); }
  circle(x, y, r * .16, { fill: RVT.steel, stroke: RVT.ink, lwPx: 3 });
}

// ---------- water ----------
function rvtBubble(x, y, r, t, o = {}) {
  circle(x, y, r, { fill: rgba('#BFF4FF', o.fill ?? .22), stroke: rgba('#FFFFFF', .9), lwPx: Math.max(2, r * .05) });
  ellipse(x - r * .38, y - r * .4, r * .22, r * .12, { fill: rgba('#FFFFFF', .8), stroke: null, rot: -.6 });
  X.save(); X.globalCompositeOperation = 'lighter'; circle(x + r * .3, y + r * .35, r * .5, { fill: rgba(['#FFB0D0', '#B0FFD8', '#B0D8FF'][Math.floor(hash(r) * 3)], .12), stroke: null }); X.restore();
}
function rvtSplash(x, y, r, age, o = {}) {
  if (age < 0 || age > 1.2) return;
  const k = easeOut(age / 1.2), col = o.col || '#CFF6FF', ink = o.ink || '#2E6FA0';
  for (let i = 0; i < 18; i++) {
    const a = -Math.PI * (.08 + .84 * hash(i * 2.3)), sp = r * (.6 + .8 * hash(i * 1.7)), px = x + Math.cos(a) * sp * k * 1.4, py = y + Math.sin(a) * sp * k * 1.6 + r * 1.8 * k * k;
    X.save(); X.globalAlpha = 1 - seg(age, .7, 1.2); ellipse(px, py, r * .07 * (1 - k * .4), r * .1 * (1 - k * .4), { fill: col, stroke: ink, lwPx: 2 }); X.restore();
  }
  X.save(); X.globalAlpha = 1 - k; ellipse(x, y, r * (.4 + 1.2 * k), r * (.1 + .3 * k), { fill: null, stroke: col, lwPx: 6 }); X.restore();
}
// A rising water column (for Neptune's entrance and the seven spouts): (x, y) = base, h tall, w wide; k 0..1 grows it.
function rvtWaterColumn(x, y, w, h, t, k = 1, o = {}) {
  if (k <= .01) return;
  const hh = h * k, sway = o.sway ?? 0, pts = [], back = [];
  for (let i = 0; i <= 12; i++) { const u = i / 12, ww = w * (1 - .55 * u) * (1 + .08 * Math.sin(t * 9 + u * 8)), cx = x + sway * Math.sin(u * 3 + t * 2) * w * .3;
    pts.push([cx - ww / 2, y - hh * u]); back.unshift([cx + ww / 2, y - hh * u]); }
  shape([...pts, ...back], { fill: linGrad(x - w, 0, x + w, 0, [[0, '#2E8FC4'], [.5, '#8FE0F8'], [1, '#2E8FC4']]), stroke: '#1D5F96', lwPx: 4, smooth: .3 });
  for (let i = 0; i < 8; i++) { const u = frac(hash(i * 3.1) - t * 1.4), yy = y - hh * u; line([[x - w * .25 * (1 - u * .5), yy], [x + w * .2 * (1 - u * .5), yy - 20]], { stroke: rgba('#FFFFFF', .7), lwPx: 4 }); }
  // the crown of spray at the top
  for (let i = 0; i < 10; i++) { const a = -Math.PI * (.1 + .8 * i / 9), d = w * (.4 + .3 * Math.sin(t * 8 + i)); circle(x + Math.cos(a) * d, y - hh + Math.sin(a) * d * .7, w * .14, { fill: '#DDF8FF', stroke: '#2E6FA0', lwPx: 2.5 }); }
}
// A curling wave crest travelling right (flip with o.dir = -1): (x, y) = trough under the curl, h tall.
function rvtWave(x, y, h, t, o = {}) {
  const d = o.dir ?? 1;
  X.save(); X.translate(x, y); X.scale(d, 1);
  const body = [[-h * 2.6, 0], [-h * 1.6, -h * .4], [-h * .7, -h * .9], [0, -h], [h * .5, -h * .82], [h * .62, -h * .55], [h * .35, -h * .48], [h * .3, -h * .3], [h * .9, 0]];
  shape(body, { fill: linGrad(0, -h, 0, 0, [[0, '#7CD0F0'], [1, '#2F8FC4']]), stroke: '#1D5F96', lwPx: 5, smooth: .5 });
  for (let i = 0; i < 9; i++) { const a = -Math.PI * .9 + i * .28; circle(Math.cos(a) * h * .45 + h * .05, -h * .62 + Math.sin(a) * h * .4, h * (.08 + .03 * Math.sin(t * 10 + i)), { fill: RVT.foam, stroke: '#2E6FA0', lwPx: 2 }); }
  line([[-h * 2.2, -h * .3], [-h * 1.2, -h * .6], [-h * .4, -h * .8]], { stroke: rgba('#FFFFFF', .7), lwPx: 5, smooth: true });
  X.restore();
}
// A waterspout twisting up from the sea: (x, y) = base, h tall; k grows it.
function rvtWaterspout(x, y, h, t, k, o = {}) {
  if (k <= .01) return;
  const hh = h * k, pts = [], back = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14, w = lerp(o.w0 ?? 40, o.w1 ?? 130, u * u), cx = x + Math.sin(u * 4 + t * 3 + x) * 30 * u;
    pts.push([cx - w / 2, y - hh * u]); back.unshift([cx + w / 2, y - hh * u]); }
  shape([...pts, ...back], { fill: rgba('#9FDDF2', .85), stroke: '#2E6FA0', lwPx: 3, smooth: .3 });
  for (let i = 0; i < 6; i++) { const u = frac(i / 6 + t * .8), yy = y - hh * u, w = lerp(o.w0 ?? 40, o.w1 ?? 130, u * u); line([[x - w * .4, yy], [x + w * .4, yy - 14]], { stroke: rgba('#FFFFFF', .75), lwPx: 3 }); }
  ellipse(x, y, (o.w0 ?? 40) * 2.2, 18, { fill: rgba('#EAFBFF', .8), stroke: null });
}
// A dust puff ring (stomps): age 0.. .
function rvtDust(x, y, r, age, col = '#E8D2A6') {
  if (age < 0 || age > 1.2) return;
  const k = easeOut(age / 1.2);
  for (let i = 0; i < 12; i++) { const a = Math.PI + i / 11 * Math.PI, d = r * (.4 + k);
    X.save(); X.globalAlpha = (1 - k) * .95; circle(x + Math.cos(a) * d * 1.6, y + Math.sin(a) * d * .35, r * (.28 + .3 * k) * (.8 + .4 * hash(i)), { fill: col, stroke: rgba('#7A5A3A', .6), lwPx: 2 }); X.restore(); }
}

// ---------- story props ----------
// The temple of Apollo at Delphi with ΓΝΩΘΙ ΣΕΑΥΤΟΝ on the architrave lighting up: k 0..1 = how many letters are lit.
function rvtDelphi(x, y, w, t, k, o = {}) {
  const u = w / 100;
  X.save(); X.translate(x, y);
  shape(rectPts(-55 * u, 0, 110 * u, 6 * u), { fill: '#E8E0F8', stroke: '#2A1A4A', lwPx: 3 });
  for (let i = 0; i < 6; i++) { const cx = -40 * u + i * 16 * u; shape([[cx - 4 * u, 0], [cx - 3.4 * u, -40 * u], [cx + 3.4 * u, -40 * u], [cx + 4 * u, 0]], { fill: '#F4EEFF', stroke: '#2A1A4A', lwPx: 3 }); }
  shape(rectPts(-50 * u, -52 * u, 100 * u, 12 * u), { fill: '#2A1A4A', stroke: '#2A1A4A', lwPx: 3 });
  shape([[-54 * u, -52 * u], [0, -68 * u], [54 * u, -52 * u]], { fill: '#F4EEFF', stroke: '#2A1A4A', lwPx: 3 });
  const txt = 'ΓΝΩΘΙ ΣΕΑΥΤΟΝ', n = Math.floor(k * txt.length + 1e-6);
  X.font = `${9 * u}px Georgia, "Times New Roman", serif`; X.textAlign = 'left'; X.textBaseline = 'middle';
  const tw = X.measureText(txt).width; let cx = -tw / 2;
  for (let i = 0; i < txt.length; i++) { const ch = txt[i], cw = X.measureText(ch).width, on = i < n;
    X.save(); if (on) { X.shadowColor = '#FFD66B'; X.shadowBlur = 24; }
    X.fillStyle = on ? '#FFE9A0' : 'rgba(244,238,255,.18)'; X.fillText(ch, cx, -46 * u); X.restore(); cx += cw; }
  X.restore();
}
// The papyrus map for the race to the baths: k 0..1 = race progress.
function rvtMap(t, k, faces) {
  shape(rectPts(-40, -40, W + 80, H + 80), { fill: '#3A2418', stroke: null });
  const pap = [[120, 110], [W - 120, 90], [W - 100, 960], [130, 980]];
  shape(pap, { fill: '#F2E4BE', stroke: '#7A5A3A', lwPx: 6, smooth: .04 });
  for (let i = 0; i < 40; i++) circle(150 + hash(i * 2.2) * (W - 300), 120 + hash(i * 4.4) * 830, 4 + 14 * hash(i), { fill: rgba('#C9A86A', .2), stroke: null });
  // coast and the sea
  shape([[W - 100, 90], [W - 420, 160], [W - 520, 420], [W - 380, 700], [W - 460, 960], [W - 100, 960]], { fill: '#9CCFE0', stroke: '#5A7A8A', lwPx: 4, smooth: .4 });
  for (let i = 0; i < 6; i++) line([[W - 360 + i * 30, 300 + i * 90], [W - 330 + i * 30, 290 + i * 90], [W - 300 + i * 30, 300 + i * 90]], { stroke: '#5A8A9A', lwPx: 3, smooth: true });
  // landmarks: the Acropolis (left), the agora (centre-left), the baths (right by the sea)
  X.save(); X.translate(330, 340); X.scale(.9, .9); shape([[-110, 60], [-70, -10], [80, -10], [120, 60]], { fill: '#D9C29A', stroke: '#7A5A3A', lwPx: 4 }); rvtParthenon(0, -10, 130, null); X.restore();
  ellipse(560, 640, 120, 60, { fill: '#E8D7AE', stroke: '#7A5A3A', lwPx: 4, dash: [12, 10] });
  X.save(); X.translate(1360, 520); shape(rectPts(-90, -60, 180, 90), { fill: '#F7F1E6', stroke: '#7A5A3A', lwPx: 4 }); [-50, 0, 50].forEach(dx => shape([[dx - 18, 30], [dx - 18, -20], [dx, -40], [dx + 18, -20], [dx + 18, 30]], { fill: '#9CCFE0', stroke: '#7A5A3A', lwPx: 3, smooth: .3 })); X.restore();
  // the dotted route
  const route = [[560, 640], [700, 760], [900, 780], [1060, 680], [1200, 600], [1330, 560]];
  line(route, { stroke: '#A23A2A', lwPx: 6, dash: [6, 18], smooth: true });
  // the X at the baths
  X.save(); X.translate(1360, 470); X.rotate(.1 * Math.sin(t * 6)); line([[-26, -26], [26, 26]], { stroke: '#C2341E', lwPx: 12 }); line([[26, -26], [-26, 26]], { stroke: '#C2341E', lwPx: 12 }); X.restore();
  return route;
}
function rvtBroom(x, y, s, ang = 0) {
  X.save(); X.translate(x, y); X.rotate(ang); X.scale(s, s);
  line([[0, -14], [0, 6]], { stroke: '#8A5A34', lwPx: s * 1 });
  shape([[-3.2, 6], [3.2, 6], [4.6, 13], [-4.6, 13]], { fill: '#E8C46A', stroke: RVT.ink, lwPx: Math.max(2, s * .3) });
  for (let i = 0; i < 6; i++) line([[-3.6 + i * 1.45, 8], [-4.2 + i * 1.7, 13]], { stroke: '#B8902E', lwPx: Math.max(1.5, s * .2) });
  X.restore();
}
function rvtDuck(x, y, s, t) {
  X.save(); X.translate(x, y + Math.sin(t * 3) * s * .4); X.rotate(.08 * Math.sin(t * 2.2)); X.scale(s, s);
  ellipse(0, 0, 5, 3, { fill: '#FFD43B', stroke: RVT.ink, lwPx: Math.max(2, s * .35) });
  circle(3.2, -3.2, 2.2, { fill: '#FFD43B', stroke: RVT.ink, lwPx: Math.max(2, s * .35) });
  shape([[5, -3.4], [7.2, -3.0], [5, -2.4]], { fill: '#FF8A2A', stroke: RVT.ink, lwPx: Math.max(1.5, s * .25) });
  circle(3.8, -3.8, .4, { fill: RVT.ink, stroke: null });
  X.restore();
}
// Comedy and tragedy masks (for the theatre): kind 0 comedy, 1 tragedy.
function rvtMask(x, y, s, kind, rot = 0) {
  X.save(); X.translate(x, y); X.rotate(rot); X.scale(s, s);
  shape([[-5, -6], [5, -6], [6, 0], [4, 5], [0, 7], [-4, 5], [-6, 0]], { fill: kind ? '#E8E0F0' : '#FFE9A0', stroke: RVT.ink, lwPx: 3, smooth: .6 });
  [-1, 1].forEach(sd => shape(kind ? [[sd * 3.6, -2], [sd * 1.2, -1.2], [sd * 2.4, -.4]] : [[sd * 3.6, -1.2], [sd * 1.2, -2], [sd * 2.4, -.4]], { fill: RVT.ink, stroke: null }));
  line(kind ? [[-2.4, 4], [0, 2.6], [2.4, 4]] : [[-2.6, 2.4], [0, 4.4], [2.6, 2.4]], { stroke: RVT.ink, lwPx: 4, smooth: true });
  X.restore();
}
// A firework burst at (x, y) launched at t0.
function rvtFirework(x, y, t, t0, col, r = 160) {
  const a = t - t0; if (a < 0 || a > 2) return;
  if (a < .45) { const u = a / .45; circle(x, lerp(H, y, easeOut(u)), 5, { fill: '#FFF6D0', stroke: null }); return; }
  const k = easeOut((a - .45) / 1.0), fade = 1 - seg(a, 1.1, 2);
  X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = fade;
  for (let i = 0; i < 24; i++) { const an = i / 24 * TAU, d = r * k; line([[x + Math.cos(an) * d * .7, y + Math.sin(an) * d * .7 + 30 * k * k], [x + Math.cos(an) * d, y + Math.sin(an) * d + 40 * k * k]], { stroke: col, lwPx: 4 }); }
  X.restore();
}
// Falling confetti: olive leaves and rainbow paper from t0.
function rvtConfetti(t, t0, n = 60) {
  if (t < t0) return;
  const cols = ['#FF6A8A', '#FFC94A', '#7CE07A', '#6FD3FF', '#C79BFF', '#8FA66A'];
  for (let i = 0; i < n; i++) {
    const x = hash(i * 3.3) * W + Math.sin(t * 2 + i) * 40, y = -40 + ((t - t0) * (160 + 140 * hash(i * 1.7)) + hash(i * 7.1) * 300) % (H + 120), r = t * (2 + 3 * hash(i)) + i;
    X.save(); X.translate(x, y); X.rotate(r); X.scale(1, Math.cos(r * 1.3));
    if (i % 4 === 0) shape([[-12, 0], [0, -6], [12, 0], [0, 6]], { fill: '#8FA66A', stroke: RVT.ink, lwPx: 1.5, smooth: true });
    else shape(rectPts(-8, -5, 16, 10), { fill: cols[i % cols.length], stroke: null });
    X.restore();
  }
}
// The soap bar (pink, shiny). (x, y) centre, w wide.
function rvtSoap(x, y, w, rot = 0, glow = 0) {
  X.save(); X.translate(x, y); X.rotate(rot);
  if (glow > .01) { X.save(); X.globalCompositeOperation = 'lighter'; circle(0, 0, w * 2.2, { fill: radGrad(0, 0, w * .2, w * 2.2, [[0, rgba('#FFD6F0', .8 * glow)], [1, rgba('#FFD6F0', 0)]]), stroke: null }); X.restore(); }
  shape(rectPts(-w / 2, -w * .3, w, w * .6), { fill: '#F7A8C8', stroke: RVT.ink, lwPx: Math.max(2, w * .06), smooth: .3 });
  shape(rectPts(-w * .35, -w * .2, w * .4, w * .12), { fill: 'rgba(255,255,255,.6)', stroke: null, smooth: .3 });
  X.restore();
}
// A big title word: ink outline, drop shadow, slams in from scale 3 at time t0.
function rvtSlam(txt, x, y, size, fill, t, t0, rot = 0, o = {}) {
  const age = t - t0; if (age < 0) return;
  const k = age < .18 ? lerp(3, 1, easeIn(age / .18)) : 1 + .08 * boing(t, t0 + .18, 3, 6);
  X.save(); X.translate(x, y); X.rotate(rot + .04 * boing(t, t0 + .18, 2, 5)); X.scale(k, k); X.globalAlpha = clamp(age / .1) * (o.alpha ?? 1);
  X.font = `${size}px ${o.font || FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = size * .2; X.strokeStyle = o.ink || RVT.black; X.strokeText(txt, size * .06, size * .08); X.fillStyle = o.ink || RVT.black; X.fillText(txt, size * .06, size * .08);
  X.strokeText(txt, 0, 0); X.fillStyle = fill; X.fillText(txt, 0, 0);
  X.restore();
}
// A wave wipe (cyan water sweeping across) for chapter breaks: u 0..1.
function rvtWaterWipe(u, dir = 1) {
  if (u <= 0 || u >= 1) return;
  overlay(() => {
    const k = ease(u), cover = k < .5 ? k * 2 : 2 - k * 2, lead = k < .5;
    X.save(); if (dir < 0) { X.translate(W, 0); X.scale(-1, 1); }
    const x0 = lead ? -200 : lerp(-200, W + 400, (k - .5) * 2), x1 = lead ? lerp(-200, W + 400, k * 2) : W + 400;
    const pts = []; for (let y = -40; y <= H + 40; y += 40) pts.push([x1 + 60 * Math.sin(y / 90 + u * 20), y]);
    const back = []; for (let y = H + 40; y >= -40; y -= 40) back.push([x0 - 60 * Math.sin(y / 90 + u * 20), y]);
    shape([...pts, ...back], { fill: linGrad(0, 0, W, 0, [[0, '#1D5F96'], [.5, '#2F8FC4'], [1, '#7CD0F0']]), stroke: null });
    line(pts, { stroke: RVT.foam, lwPx: 18, smooth: true });
    X.restore();
  });
}
