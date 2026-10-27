// scenes/talent_show/scene23_secret_potion/props.js: the props for "The Secret Potion" (all prefixed sp, since every script shares one scope).
//   spBench(P, o)                        the wooden team bench in front of the scoreboard end (world, through the camera P)
//   spPotion(x, y, s, o)                 the SECRET POTION flask: broccoli juice with unsweet tea (screen; s = px per flask unit, ~8 units tall)
//   spCube(x, y, s, t, o)                Danny's Rubik's cube, twisting (screen; s = px per cube unit, ~3 units wide)
//   spCard(text, k, o)                   a full-frame title card (MEANWHILE…, AND SO, FOR A WEEK…) or a day tag (MONDAY…)

const SP_BENCH = { x0: 230, x1: 670, z0: 1945, z1: 1975, seat: 44 };

// An axis-aligned box with back-face culling (the same idea as the sets' box()).
function spBox(P, x0, x1, y0, y1, z0, z1, col, lw = 1.2) {
  const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .2), front: col, side: mixCol(col, '#000000', .15) } : col, cam = P.cam;
  const face = (pts, fill) => { const q = P.poly(pts); if (q) shape(q, { fill, stroke: PAL.ink, lwPx: clamp(lw * cam.f / 1000, .7, 3.5) }); };
  if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.front);
  if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.front);
  if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
  if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
  if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
}

function spBench(P) {
  const b = SP_BENCH, wood = { top: '#E6BB82', front: '#C99459', side: '#9C6B37' }, steel = { top: '#B9C1C8', front: '#7C858D', side: '#5C656D' };
  for (const x of [b.x0 + 20, b.x1 - 34]) { spBox(P, x, x + 14, 0, b.seat - 6, b.z0 + 4, b.z0 + 10, steel, .9); spBox(P, x, x + 14, 0, b.seat - 6, b.z1 - 10, b.z1 - 4, steel, .9); spBox(P, x, x + 14, 10, 16, b.z0 + 4, b.z1 - 4, steel, .8); }
  spBox(P, b.x0, b.x1, b.seat - 6, b.seat, b.z0, b.z1, wood);
  const st = P.line([[b.x0 + 4, b.seat + .3, b.z0 + 15], [b.x1 - 4, b.seat + .3, b.z0 + 15]]); if (st) line(st, { stroke: 'rgba(110,70,38,.45)', lwPx: 1 });
}

// The potion flask, held at screen (x, y) = the bottom of the flask. o: { ang, level 0..1 (how full), open (cork out), grip }.
function spPotion(x, y, s, o = {}) {
  const t = o.t ?? T, lw = clamp(s * .14, 1, 3.5) / s, ink = PAL.ink, lvl = clamp(o.level ?? 1);
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s, s); if (o.grip) X.translate(0, 2.2);   // grip: (x, y) is the middle of the bulb
  const body = ellPts(0, -2.2, 2.3, 2.2, 28), neck = [[-.75, -5.6], [.75, -5.6], [.75, -3.9], [-.75, -3.9]];
  X.save(); tracePath(body, true); X.rect(-.75, -5.6, 1.5, 2); X.clip();
  const top = lerp(.1, -5.4, lvl);                                                   // liquid surface (stays level as the flask tips)
  X.save(); X.rotate(-(o.ang || 0)); X.fillStyle = linGrad(0, top, 0, 1, [[0, '#8FB04A'], [.55, '#6D8A34'], [1, '#55452A']]); X.fillRect(-6, top, 12, 12); X.restore();
  for (let i = 0; i < 5; i++) { const ph = frac(t * .6 + i * .23), by = lerp(-.4, Math.max(top, -4), ph); circle(-1.2 + i * .6 + .2 * Math.sin(t * 3 + i), by, .16 + .1 * hash(i), { fill: 'rgba(230,255,190,.75)', stroke: null }); }
  X.restore();
  shape(body, { fill: 'rgba(225,245,235,.18)', stroke: ink, lw });
  shape(neck, { fill: 'rgba(225,245,235,.18)', stroke: ink, lw });
  ellipse(-1.1, -3.1, .35, .8, { fill: 'rgba(255,255,255,.55)', stroke: null, rot: -.4 });
  if (!o.open) { shape([[-.9, -5.5], [.9, -5.5], [.75, -6.9], [-.75, -6.9]], { fill: '#C69560', stroke: ink, lw }); line([[-.5, -6.2], [.5, -6.2]], { stroke: '#8A6136', lw: lw * .7 }); }
  // the label: SECRET POTION, a little broccoli
  shape([[-1.7, -3.0], [1.7, -3.0], [1.8, -1.0], [-1.8, -1.0]], { fill: '#FFF8E4', stroke: ink, lw: lw * .8 });
  X.fillStyle = '#5B7A24'; X.font = `700 .5px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('SECRET', .45, -2.45); X.fillText('POTION', .45, -1.6);
  line([[-1.25, -1.3], [-1.25, -2.0]], { stroke: '#7FA34B', lw: lw * 1.2 });
  for (const [dx, dy] of [[-.25, -2.3], [.25, -2.3], [0, -2.6]]) circle(-1.25 + dx, dy, .28, { fill: '#6FA03A', stroke: ink, lw: lw * .5 });
  X.restore();
}

// Danny's Rubik's cube at screen (x, y) = its centre. The top layer turns a quarter every so often and the colours shuffle.
function spCube(x, y, s, t, o = {}) {
  const COLS = ['#E8443A', '#F7F4EA', '#3E7BD8', '#F2C230', '#4CB050', '#F08A2C'], lw = clamp(s * .12, .8, 2.5) / s, ink = PAL.ink;
  const step = Math.floor(t / (o.rate || .7)), f = frac(t / (o.rate || .7)), turn = ease(seg(f, 0, .35));
  const col = (i, j, face) => COLS[Math.floor(hash(step * 7.1 + i * 3.3 + j * 5.7 + face * 11.3) * 6)];
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s, s);
  // the front face (3 × 3), the top face as a squashed parallelogram; the top row of the front slides as the layer turns
  shape([[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]], { fill: '#1E1E24', stroke: ink, lw });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const sh = j === 0 ? turn * .6 : 0;
    shape(rectPts(-1.4 + i + sh, -1.4 + j, .8, .8), { fill: col(i, j, 0), stroke: null });
  }
  const tp = [[-1.5, -1.5], [1.5, -1.5], [2.1, -2.3], [-.9, -2.3]];
  shape(tp, { fill: '#1E1E24', stroke: ink, lw });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const u = -1.4 + i + .6 * (j + .5) / 2 * 1.2, v = -1.6 - j * .38; shape([[u, v], [u + .8, v], [u + 1.0, v - .28], [u + .2, v - .28]], { fill: col(i, j, 1), stroke: null }); }
  X.restore();
}

// A title card over the whole frame (k 0..1 animates it in and out) or, with o.tag, a small day tag in the top-left corner.
function spCard(text, k, o = {}) {
  if (k <= .01) return;
  overlay(() => {
    X.save();
    if (o.tag) {
      const c = backOut(clamp(k * 1.4)); X.translate(250, 120); X.rotate(-.06); X.scale(c, c);
      shape(rectPts(-200, -55, 400, 110), { fill: o.col || '#FFF4EC', stroke: PAL.ink, lwPx: 7 });
      X.font = `70px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 12; X.strokeStyle = PAL.ink; X.strokeText(text, 0, 6); X.fillStyle = o.ink || '#2E8F94'; X.fillText(text, 0, 6);
    } else {
      X.globalAlpha = clamp(k * 2); X.fillStyle = 'rgba(31,53,102,.55)'; X.fillRect(0, 0, W, H); X.globalAlpha = 1;
      const c = backOut(clamp(k * 1.6)); X.translate(W / 2, H / 2); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-560, -110, 1120, 220), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 9 });
      X.font = `104px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 16; X.strokeStyle = PAL.ink; X.strokeText(text, 0, 10); X.fillStyle = '#F4C431'; X.fillText(text, 0, 10);
    }
    X.restore();
  });
}
