// Scene 35 props: game night on the coffee table, the two full-frame game inserts, the snores and the bubbles.
//   gnTableGames(P, t, o)          both games lying on the living-room coffee table (perspective): the Oligarchy board on the
//                                  +X half, the Crazy Dolphins pile and stacks on the −X half. o.towers (0..1) grows Danny's towers.
//   gnOligarchy(t, o)              full frame, top-down: the Oligarchy board, tokens, towers, money piles. o: { roll, hops, from,
//                                  roller: 'safadi' | 'danny', pay, payN, bank: { safadi, danny, housam } (bills), towers }
//   gnDolphins(t, o)               full frame, top-down: the Crazy Dolphins pile. o.flips: [{ at, who, col }], o.slaps: [{ at, who, soft }]
//   gnZzz(x, y, size, t, ph, k)    three snoring Z's drifting up from (x, y)
//   gnThought(x, y, rx, ry, k, t, fn, o)  a cloud thought bubble centred at (x, y) with a trail of puffs toward o.tail; fn() paints inside
//   gnJuice / gnLecture / gnRobot (x, y, s, t)   the kids' guesses, drawn inside little thought bubbles
//   gnDream(x, y, r, t, k)         the twins' dream: a swirling, glowing cloud of stars and question marks
const GN = {
  ink: PAL.ink, wood: '#B97A48', woodDk: '#8E5A33', woodLt: '#D39A63', board: '#F6F0DA', boardEdge: '#1F7A4E', gold: '#E8C35A',
  bill: '#9ED39A', billDk: '#5E9E5B',
  card: { blue: '#3A9AE0', pink: '#F27FB8', purple: '#9B6BC0', green: '#4CBF6A', orange: '#F5A040' },
  sleeve: { safadi: '#C9A66B', danny: '#353969', housam: '#F1F0EA', jenna: '#F7CBDD', alma: '#F4EEDF', sami: '#F4F6F8' },
  cuff: { safadi: '#B08E55', danny: '#8BB1D9', housam: '#425DA0', jenna: '#EFA8C6', alma: '#9B6BC0', sami: '#5B8FD0' },
  skin: { safadi: '#F3C6A8', danny: '#E5B393', housam: '#DCA887', jenna: '#DFB197', alma: '#F6C9AC', sami: '#E7B48F' },
};
// Oligarchy street colours, one per side of the board (bottom, left, top, right), two groups per side
const GN_STREETS = [['#8B5A3C', '#8B5A3C', '#8B5A3C', '#7FC8F0', '#7FC8F0', '#7FC8F0', '#7FC8F0'], ['#E05AA8', '#E05AA8', '#E05AA8', '#F28B30', '#F28B30', '#F28B30', '#F28B30'],
  ['#4CBF6A', '#4CBF6A', '#4CBF6A', '#E8D24A', '#E8D24A', '#E8D24A', '#E8D24A'], ['#D84040', '#D84040', '#D84040', '#3E5BC8', '#3E5BC8', '#3E5BC8', '#3E5BC8']];

// ---------- a wooden tabletop (full-frame inserts) ----------
function gnTabletop(t) {
  const dx = 10 * Math.sin(t * .4), dy = 6 * Math.sin(t * .33);
  X.fillStyle = linGrad(0, 0, 0, H, [[0, GN.woodLt], [1, GN.wood]]); X.fillRect(0, 0, W, H);
  for (let i = 0; i < 24; i++) {                                                // plank seams and grain
    const y = i * 52 + dy + (hash(i) - .5) * 10;
    line([[0, y], [W, y + 6 * Math.sin(i)]], { stroke: rgba(GN.woodDk, i % 4 ? .18 : .45), lwPx: i % 4 ? 2 : 4 });
    if (i % 3 === 0) ellipse(200 + hash(i + 9) * 1500 + dx, y + 24, 60 + 50 * hash(i + 3), 9, { fill: null, stroke: rgba(GN.woodDk, .2), lwPx: 2 });
  }
  X.fillStyle = radGrad(W / 2, H / 2, 300, W * .8, [[0, 'rgba(255,240,210,0)'], [1, 'rgba(60,30,20,.35)']]); X.fillRect(0, 0, W, H);   // vignette
}

// ---------- an arm reaching in from off-frame, ending in a cartoon hand ----------
// pose: 'fist' (holding dice), 'palm' (flat, fingers spread: a slap), 'pinch' (holding a card or bill)
function gnArm(x0, y0, x1, y1, who, pose = 'fist', o = {}) {
  const w = o.w ?? 120, ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0), sq = o.sq ?? 1;
  X.save(); X.translate(x1, y1); X.rotate(ang);
  shape(rectPts(-len - 40, -w / 2, len - w * .35 + 40, w), { fill: GN.sleeve[who], stroke: GN.ink, lwPx: 7, smooth: .15 });   // the sleeve
  shape(rectPts(-w * .55, -w * .52, w * .26, w * 1.04), { fill: GN.cuff[who], stroke: GN.ink, lwPx: 6, smooth: .2 });
  const sk = GN.skin[who];
  if (pose === 'palm') {
    X.scale(1, sq);
    for (let i = 0; i < 4; i++) { const fy = (i - 1.5) * w * .27; shape(rectPts(w * .1, fy - w * .11, w * .62 - Math.abs(i - 1.5) * w * .08, w * .22), { fill: sk, stroke: GN.ink, lwPx: 6, smooth: .5 }); }
    shape(rectPts(-w * .15, -w * .55 - w * .3, w * .4, w * .24), { fill: sk, stroke: GN.ink, lwPx: 6, smooth: .5 });   // thumb
    ellipse(w * .05, 0, w * .42, w * .5, { fill: sk, stroke: GN.ink, lwPx: 6 });
  } else {
    ellipse(w * .08, 0, w * .44, w * .46, { fill: sk, stroke: GN.ink, lwPx: 6 });
    for (let i = 0; i < 3; i++) line([[w * .22, (i - 1) * w * .2], [w * .45, (i - 1) * w * .22]], { stroke: rgba(GN.ink, .6), lwPx: 4 });
    if (pose === 'pinch') shape(rectPts(w * .1, -w * .58, w * .28, w * .22), { fill: sk, stroke: GN.ink, lwPx: 5, smooth: .5 });
  }
  X.restore();
}

// ---------- dice ----------
const GN_PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
function gnDie(x, y, s, rot, n) {
  X.save(); X.translate(x, y); X.rotate(rot);
  shape(rectPts(-s / 2 + 5, -s / 2 + 9, s, s), { fill: rgba(GN.ink, .25), stroke: null, smooth: .25 });
  shape(rectPts(-s / 2, -s / 2, s, s), { fill: '#FFFDF6', stroke: GN.ink, lwPx: 5, smooth: .25 });
  for (const [px, py] of GN_PIPS[n]) circle(px * s * .25, py * s * .25, s * .085, { fill: GN.ink, stroke: null });
  X.restore();
}
// two dice thrown from (x0, y0), tumbling to rest at (x1, y1) by t0 + 1; faces n1, n2 when they land
function gnDice(t, t0, x0, y0, x1, y1, n1, n2) {
  const u = seg(t, t0, t0 + 1), e = easeOut(u);
  for (let d = 0; d < 2; d++) {
    const ox = d ? 70 : -40, oy = d ? -30 : 40, bx = lerp(x0 + ox, x1 + ox, e), by = lerp(y0 + oy, y1 + oy, e) - 90 * Math.abs(Math.sin(u * Math.PI * 2.5)) * (1 - u);
    const spin = (1 - e) * (d ? 9 : -11), s = 86 * (1 + .35 * Math.abs(Math.sin(u * Math.PI * 2.5)) * (1 - u));
    gnDie(bx, by, s, spin + (d ? .3 : -.2), u < 1 ? 1 + Math.floor(hash(Math.floor(t * 14) + d * 7) * 6) : (d ? n2 : n1));
  }
}

// ---------- Oligarchy (full frame) ----------
const GN_OB = { cx: 800, cy: 540, side: 880, corner: 124 };
function gnSpace(i) {                                                           // centre of board space i (0 = GO, bottom-right; clockwise)
  const { cx, cy, side, corner } = GN_OB, h = side / 2, cell = (side - 2 * corner) / 7, i32 = ((i % 32) + 32) % 32, sideN = Math.floor(i32 / 8), k = i32 % 8;
  const along = k === 0 ? -h + corner / 2 : -h + corner + (k - .5) * cell, edge = h - corner / 2;
  // walk: bottom (right → left), left (bottom → top), top (left → right), right (top → bottom)
  if (sideN === 0) return [cx - along, cy + edge, 0];
  if (sideN === 1) return [cx - edge, cy - along, Math.PI / 2];
  if (sideN === 2) return [cx + along, cy - edge, Math.PI];
  return [cx + edge, cy + along, -Math.PI / 2];
}
function gnTower(x, y, s, col, k = 1) {                                        // a little tower seen from above (with a dropped shadow and a side)
  if (k <= 0) return; s *= backOut(k);
  shape(rectPts(x - s * .45 + 6, y - s * .45 + 10, s * .9, s * .9), { fill: rgba(GN.ink, .25), stroke: null });
  shape([[x - s * .45, y + s * .45], [x + s * .45, y + s * .45], [x + s * .45, y + s * .65], [x - s * .45, y + s * .65]], { fill: mixCol(col, '#000', .3), stroke: GN.ink, lwPx: 4 });
  shape(rectPts(x - s * .45, y - s * .45, s * .9, s * .9), { fill: col, stroke: GN.ink, lwPx: 4 });
  shape(rectPts(x - s * .2, y - s * .2, s * .4, s * .4), { fill: mixCol(col, '#fff', .3), stroke: GN.ink, lwPx: 3 });
}
function gnToken(kind, x, y, s, lift = 0) {
  const sc = 1 + .5 * lift;
  ellipse(x + 8 + 30 * lift, y + 10 + 40 * lift, s * .5, s * .42, { fill: rgba(GN.ink, .25 * (1 - lift * .6)), stroke: null });
  X.save(); X.translate(x, y - 50 * lift); X.scale(sc, sc);
  if (kind === 'safadi') {                                                      // a tan pawn with a gold mortarboard
    circle(0, 0, s * .45, { fill: '#C9A66B', stroke: GN.ink, lwPx: 5 });
    shape([[0, -s * .42], [s * .42, -s * .05], [0, s * .32], [-s * .42, -s * .05]], { fill: '#2A2530', stroke: GN.ink, lwPx: 4 });
    circle(0, -s * .05, s * .08, { fill: GN.gold, stroke: null });
  } else if (kind === 'housam') {                                               // a soccer ball
    circle(0, 0, s * .45, { fill: '#FFFFFF', stroke: GN.ink, lwPx: 5 });
    shape(starPts(0, 0, s * .18, .8, 5, 0), { fill: GN.ink, stroke: null });
    for (let i = 0; i < 5; i++) { const a = i * TAU / 5 - Math.PI / 2; circle(Math.cos(a) * s * .36, Math.sin(a) * s * .36, s * .07, { fill: GN.ink, stroke: null }); }
  } else {                                                                      // Danny: a red race car
    shape(rectPts(-s * .5, -s * .28, s, s * .56), { fill: '#E03C3C', stroke: GN.ink, lwPx: 5, smooth: .4 });
    for (const [wx, wy] of [[-.3, -.32], [.3, -.32], [-.3, .32], [.3, .32]]) shape(rectPts(wx * s - s * .1, wy * s - s * .06, s * .2, s * .12), { fill: GN.ink, stroke: null });
    shape(rectPts(-s * .12, -s * .18, s * .28, s * .36), { fill: '#BFE6FF', stroke: GN.ink, lwPx: 3, smooth: .3 });
  }
  X.restore();
}
function gnBills(x, y, n, t, label, col) {                                     // a fanned stack of play money with its owner's name
  for (let i = 0; i < Math.ceil(n); i++) {
    const fx = x + (hash(i * 3 + 1) - .5) * 40, fy = y - i * 7, r = (hash(i * 5 + 2) - .5) * .4;
    X.save(); X.translate(fx, fy); X.rotate(r);
    shape(rectPts(-110, -55, 220, 110), { fill: i % 2 ? GN.bill : '#B6E0A8', stroke: GN.ink, lwPx: 4, smooth: .08 });
    if (i >= Math.ceil(n) - 1) { shape(rectPts(-90, -38, 180, 76), { fill: null, stroke: GN.billDk, lwPx: 3 });
      X.font = `46px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = GN.billDk; X.fillText('$500', 0, 4); }
    X.restore();
  }
  X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = 9; X.strokeStyle = GN.ink; X.strokeText(label, x, y + 100); X.fillStyle = col; X.fillText(label, x, y + 100);
}
function gnOligarchy(t, o = {}) {
  gnTabletop(t);
  const { cx, cy, side, corner } = GN_OB, h = side / 2, cell = (side - 2 * corner) / 7;
  X.save(); X.translate(4 * Math.sin(t * .5), 3 * Math.sin(t * .4));
  shape(rectPts(cx - h + 14, cy - h + 20, side, side), { fill: rgba(GN.ink, .3), stroke: null });
  shape(rectPts(cx - h - 16, cy - h - 16, side + 32, side + 32), { fill: GN.boardEdge, stroke: GN.ink, lwPx: 7 });
  shape(rectPts(cx - h, cy - h, side, side), { fill: GN.board, stroke: GN.ink, lwPx: 5 });
  shape(rectPts(cx - h + corner, cy - h + corner, side - 2 * corner, side - 2 * corner), { fill: '#DCEFD9', stroke: GN.ink, lwPx: 5 });
  for (let i = 0; i < 32; i++) {                                                // the spaces
    const [x, y, a] = gnSpace(i), k = i % 8;
    X.save(); X.translate(x, y); X.rotate(a);
    if (k === 0) { shape(rectPts(-corner / 2, -corner / 2, corner, corner), { fill: null, stroke: GN.ink, lwPx: 4 });
      X.font = `34px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = ['#D84040', '#3E5BC8', '#1F7A4E', '#E05AA8'][i / 8];
      X.fillText(['GO', 'JAIL', 'PARK', 'TAX'][i / 8], 0, 0);
    } else {
      shape(rectPts(-cell / 2, -corner / 2, cell, corner), { fill: null, stroke: GN.ink, lwPx: 3 });
      shape(rectPts(-cell / 2, -corner / 2, cell, corner * .28), { fill: GN_STREETS[Math.floor(i / 8)][k - 1], stroke: GN.ink, lwPx: 3 });
    }
    X.restore();
  }
  X.save(); X.translate(cx, cy); X.rotate(-.6);                                // the centre: the title over a coin stack
  for (let i = 0; i < 4; i++) ellipse(-150, 120 - i * 22, 70, 26, { fill: i % 2 ? '#F2CF62' : '#E3B53E', stroke: GN.ink, lwPx: 4 });
  X.font = `120px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = 18; X.strokeStyle = GN.ink; X.strokeText('OLIGARCHY', 0, -10); X.fillStyle = GN.gold; X.fillText('OLIGARCHY', 0, -10);
  X.restore();
  // Danny's red towers (spaces 10, 11) and Housam's green houses (spaces 17–19)
  const tw = o.towers ?? 1;
  for (const [i, n] of [[10, 2], [11, 3]]) { const [x, y] = gnSpace(i); for (let j = 0; j < n; j++) gnTower(x - 22 + (j % 2) * 44, y - 30 + Math.floor(j / 2) * 44 + 20, 40, '#E03C3C', seg(tw, j * .2, j * .2 + .5)); }
  for (const i of [17, 18, 19]) { const [x, y] = gnSpace(i); gnTower(x, y + 26, 38, '#4CBF6A'); }
  // tokens: Housam and Danny sit still; the professor's hops from o.from by o.hops spaces
  const [hx, hy] = gnSpace(21); gnToken('housam', hx, hy + 6, 56);
  const [dx, dy] = gnSpace(27); gnToken('danny', dx, dy, 58);
  const from = o.from ?? 8, hops = o.hops || [];
  let pos = from, lift = 0;
  hops.forEach(at => { const u = seg(t, at, at + .26); if (u >= 1) pos++; else if (u > 0) { pos += ease(u); lift = Math.sin(Math.PI * u); } });
  const p0 = gnSpace(Math.floor(pos)), p1 = gnSpace(Math.floor(pos) + 1), f = pos - Math.floor(pos);
  gnToken('safadi', lerp(p0[0], p1[0], f) + 14, lerp(p0[1], p1[1], f) - 24, 60, lift);
  X.restore();
  // the money piles beside the board
  const bank = o.bank || {};
  gnBills(1590, 230, bank.danny ?? 8, t, 'DANNY', '#E03C3C');
  gnBills(1590, 520, bank.housam ?? 6, t, 'HOUSAM', '#5AD07A');
  gnBills(1590, 810, bank.safadi ?? 6, t, 'PROFESSOR', GN.gold);
  // a payment: bills slide from the professor's pile to Danny's
  for (const [at, n] of o.pay || []) for (let j = 0; j < n; j++) {
    const u = ease(seg(t, at + j * .3, at + j * .3 + .5)); if (u <= 0 || u >= 1) continue;
    X.save(); X.translate(lerp(1590, 1590, u) + 180 * Math.sin(Math.PI * u), lerp(800, 230, u)); X.rotate(.3 * Math.sin(u * 6));
    shape(rectPts(-110, -55, 220, 110), { fill: GN.bill, stroke: GN.ink, lwPx: 4, smooth: .08 }); X.restore();
  }
  // the roll: dice from the roller's hand onto the board
  if (o.roll != null) {
    const r = o.roll, who = o.roller || 'safadi', from = who === 'safadi' ? [380, 1150] : [1180, -80], hand = who === 'safadi' ? [560, 930] : [1060, 150];
    const reach = on2(t, r - .6, r + .5, .35);
    if (reach > 0) gnArm(from[0], from[1], lerp(from[0], hand[0], reach), lerp(from[1], hand[1], reach), who, t < r ? 'fist' : 'palm', { w: 150 });
    if (t > r) gnDice(t, r, hand[0], hand[1], 760, 600, o.dice?.[0] ?? 1, o.dice?.[1] ?? 2);
  }
}
const on2 = (t, a, b, r) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));

// ---------- Crazy Dolphins (full frame) ----------
function gnDolphinShape(x, y, s, col, flip = 1) {                              // a leaping dolphin silhouette
  X.save(); X.translate(x, y); X.scale(s * flip, s);
  shape([[-1, .25], [-.55, -.25], [0, -.42], [.55, -.3], [.95, -.05], [.62, .08], [.2, .12], [-.4, .3]], { fill: col, stroke: GN.ink, lwPx: 4, smooth: true });
  shape([[-.05, -.38], [.05, -.75], [.25, -.35]], { fill: col, stroke: GN.ink, lwPx: 4 });
  shape([[-.95, .25], [-1.3, .0], [-1.25, .5]], { fill: col, stroke: GN.ink, lwPx: 4 });
  circle(.55, -.16, .07, { fill: GN.ink, stroke: null });
  X.restore();
}
const GN_CW = 230, GN_CH = 320;
function gnCard(x, y, rot, col, face = true, sx = 1) {
  X.save(); X.translate(x, y); X.rotate(rot); X.scale(Math.max(.02, sx), 1);
  shape(rectPts(-GN_CW / 2 + 6, -GN_CH / 2 + 10, GN_CW, GN_CH), { fill: rgba(GN.ink, .22), stroke: null, smooth: .12 });
  shape(rectPts(-GN_CW / 2, -GN_CH / 2, GN_CW, GN_CH), { fill: '#FFFDF6', stroke: GN.ink, lwPx: 5, smooth: .12 });
  if (face) {
    shape(rectPts(-GN_CW / 2 + 16, -GN_CH / 2 + 16, GN_CW - 32, GN_CH - 32), { fill: GN.card[col], stroke: GN.ink, lwPx: 3, smooth: .1 });
    gnDolphinShape(0, 10, 82, '#FFFFFF');
    for (let i = 0; i < 3; i++) circle(-60 + i * 22, -100 + (i % 2) * 14, 9, { fill: 'rgba(255,255,255,.7)', stroke: null });
  } else {
    shape(rectPts(-GN_CW / 2 + 16, -GN_CH / 2 + 16, GN_CW - 32, GN_CH - 32), { fill: '#2E8BD8', stroke: GN.ink, lwPx: 3, smooth: .1 });
    for (let i = 0; i < 4; i++) line([[-80, -110 + i * 70], [80, -80 + i * 70]], { stroke: 'rgba(255,255,255,.35)', lwPx: 10 });
    X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFE45C'; X.fillText('CD', 0, 0);
  }
  X.restore();
}
const GN_SEAT = { jenna: [380, -60], alma: [260, 1160], sami: [2020, 640] };    // where each player's arm comes from
const GN_STACK = { jenna: [470, 230], alma: [430, 880], sami: [1560, 690] };    // each player's face-down stack
const GN_PILE = [960, 560];
function gnDolphins(t, o = {}) {
  gnTabletop(t);
  const flips = (o.flips || []).filter(f => t > f.at), slaps = o.slaps || [];
  const jolt = slaps.reduce((a, s) => a + kick(t, s.at + .12, 8) * (s.soft ? .2 : 1), 0);
  // the players' stacks
  for (const who of ['jenna', 'alma', 'sami']) { const [x, y] = GN_STACK[who]; for (let i = 0; i < 5; i++) gnCard(x + i * 2, y - i * 4, (who === 'sami' ? -.25 : .2) + (hash(i) - .5) * .1, 'blue', false); }
  // the face-up pile underneath (a few old cards)
  for (let i = 0; i < 4; i++) gnCard(GN_PILE[0] + (hash(i + 20) - .5) * 60, GN_PILE[1] + (hash(i + 30) - .5) * 40, (hash(i + 40) - .5) * .8, ['orange', 'purple', 'pink', 'green'][i]);
  // the flipped cards: each flies from its player's stack and turns over onto the pile (the last two stay visible, offset)
  const all = (o.flips || []);
  all.forEach((f, i) => {
    const u = seg(t, f.at, f.at + .4); if (u <= 0) return;
    const e = easeOut(u), [sx, sy] = GN_STACK[f.who], tx = GN_PILE[0] + (i % 2 ? 70 : -50) + jolt * 20 * (i % 2 ? 1 : -1), ty = GN_PILE[1] + (i % 2 ? 30 : -20) - jolt * 30;
    const x = lerp(sx, tx, e), y = lerp(sy, ty, e) - 120 * Math.sin(Math.PI * u), flipK = Math.cos(Math.PI * u);
    gnCard(x, y, lerp(.3, (i % 2 ? .15 : -.12), e), f.col, flipK < 0, Math.abs(flipK) * (1 + .2 * Math.sin(Math.PI * u)));
  });
  // the slaps: a flat hand comes down on the pile (later hands land on top)
  slaps.forEach((s, i) => {
    const down = ease(seg(t, s.at - .14, s.at)), up = s.stay ? 0 : ease(seg(t, s.at + (s.hold ?? 1.6), s.at + (s.hold ?? 1.6) + .4));
    const k = down * (1 - up); if (k <= 0) return;
    const [ox, oy] = GN_SEAT[s.who], dir = Math.atan2(oy - GN_PILE[1], ox - GN_PILE[0]), tx = GN_PILE[0] + Math.cos(dir) * 60 + (i ? 30 : 0), ty = GN_PILE[1] + Math.sin(dir) * 60 + (i ? -20 : 0);
    gnArm(ox, oy, lerp(ox, tx, k), lerp(oy, ty, k), s.who, 'palm', { w: 140, sq: 1 - .15 * kick(t, s.at, 10) });
    if (!s.soft && t > s.at && t < s.at + .7) sfx('SLAP!', tx + (i ? 160 : -140), ty - 230, 90, '#FFE45C', t - s.at, { life: .7 });
  });
  // a reaching hand holding the next card, just before each flip
  all.forEach(f => { const k = on2(t, f.at - .35, f.at + .25, .2); if (k <= 0) return;
    const [ox, oy] = GN_SEAT[f.who], [sx, sy] = GN_STACK[f.who]; gnArm(ox, oy, lerp(ox, sx, k), lerp(oy, sy, k), f.who, 'pinch', { w: 150 }); });
}

// ---------- both games on the coffee table (perspective) ----------
function gnTableGames(P, t, o = {}) {
  const Y = 38.6, quad = (x0, x1, z0, z1, y = Y) => P.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]);
  const lw = clamp(1.4 * P.k(340), 1, 3);
  // Oligarchy on the +X half
  const b = quad(14, 104, 300, 378), bi = quad(26, 92, 312, 366);
  if (b) { shape(b, { fill: GN.boardEdge, stroke: GN.ink, lwPx: lw }); shape(quad(18, 100, 304, 374), { fill: GN.board, stroke: null }); if (bi) shape(bi, { fill: '#DCEFD9', stroke: GN.ink, lwPx: lw * .7 }); }
  for (let i = 0; i < 7; i++) { const x = 26 + i * 66 / 7; const q = quad(x, x + 66 / 7, 304, 311); if (q) shape(q, { fill: GN_STREETS[0][i], stroke: null }); const q2 = quad(x, x + 66 / 7, 367, 374); if (q2) shape(q2, { fill: GN_STREETS[2][i], stroke: null }); }
  const box = (x, z, s, h, col) => { const [sx, sy, k] = P.p(x, Y, z); const w = s * k, hh = h * k; shape(rectPts(sx - w / 2, sy - hh, w, hh), { fill: col, stroke: GN.ink, lwPx: lw * .7 }); };
  const tw = o.towers ?? 1;
  for (let j = 0; j < 3; j++) if (tw > j * .25) box(70 + j * 7, 312, 5, 7 + 4 * Math.min(1, (tw - j * .25) * 3), '#E03C3C');
  for (let j = 0; j < 3; j++) box(32 + j * 8, 368, 5, 5, '#4CBF6A');
  // play money: little piles at the near corners
  const bills = (x, z, n) => { for (let i = 0; i < n; i++) { const q = quad(x - 7, x + 7, z - 4, z + 4, Y + i * .6); if (q) shape(q, { fill: i % 2 ? GN.bill : '#B6E0A8', stroke: GN.ink, lwPx: lw * .5 }); } };
  bills(96, 290, Math.round(o.danny ?? 6)); bills(20, 290, Math.round(o.safadi ?? 6));
  // Crazy Dolphins on the −X half: the pile in the middle, a stack by each player
  const card = (x, z, a, col) => { const c = Math.cos(a), s = Math.sin(a), at = (u, v) => [x + u * c - v * s, Y + .3, z + u * s + v * c];
    const q = P.poly([at(-7, -10), at(7, -10), at(7, 10), at(-7, 10)]); if (q) shape(q, { fill: GN.card[col] || col, stroke: GN.ink, lwPx: lw * .6 }); };
  card(-60, 340, .3, 'orange'); card(-56, 338, -.2, 'pink');
  if (o.top) card(-52, 342, .1, o.top);
  card(-95, 320, 0, '#2E8BD8'); card(-24, 318, .2, '#2E8BD8'); card(-70, 372, -.1, '#2E8BD8');
}

// ---------- snores ----------
function gnZzz(x, y, size, t, ph = 0, k = 1) {
  if (k <= 0) return;
  overlay(() => {
    X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    for (let i = 0; i < 3; i++) {
      const u = ((t * .45 + ph + i / 3) % 1), a = k * Math.sin(Math.PI * u), s = .55 + .7 * u;
      X.save(); X.translate(x + 60 * u * size / 60 + 10 * Math.sin(u * 7 + ph), y - 150 * u * size / 60); X.scale(s, s); X.rotate(-.2);
      X.globalAlpha = a; X.lineWidth = size * .16; X.strokeStyle = GN.ink; X.strokeText('Z', 0, 0); X.fillStyle = '#7FA6F0'; X.fillText('Z', 0, 0);
      X.restore();
    }
  });
}

// ---------- thought bubbles ----------
function gnThought(x, y, rx, ry, k, t, fn, o = {}) {
  if (k <= 0) return;
  overlay(() => {
    const s = backOut(clamp(k, 0, 1)), puffs = 11, fill = o.fill || '#FFFDF6';
    if (o.tail) for (let i = 0; i < 3; i++) { const u = (i + 1) / 4, tx = lerp(o.tail[0], x, u * .7), ty = lerp(o.tail[1], y + ry * .8, u * .9);
      if (k > u * .5) circle(tx, ty, (6 + i * 7) * s * (o.tailK ?? 1), { fill, stroke: GN.ink, lwPx: 5 }); }
    X.save(); X.translate(x, y); X.scale(s, s);
    if (o.glow) { X.fillStyle = radGrad(0, 0, 0, rx * 1.6, [[0, rgba(o.glow, .55)], [1, rgba(o.glow, 0)]]); X.fillRect(-rx * 2, -ry * 2, rx * 4, ry * 4); }
    const pts = [];
    for (let i = 0; i < puffs; i++) { const a = i / puffs * TAU + .02 * Math.sin(t * 2 + i); pts.push([Math.cos(a) * rx, Math.sin(a) * ry]); }
    for (const [px, py] of pts) circle(px, py, Math.min(rx, ry) * .42, { fill, stroke: GN.ink, lwPx: 6 });
    for (const [px, py] of pts) circle(px, py, Math.min(rx, ry) * .42 - 3, { fill, stroke: null });
    ellipse(0, 0, rx, ry, { fill, stroke: null });
    X.save(); X.beginPath(); X.ellipse(0, 0, rx * 1.08, ry * 1.08, 0, 0, TAU); X.clip(); fn(); X.restore();
    X.restore();
  });
}
// a glass of broccoli juice (Danny's guess)
function gnJuice(x, y, s, t) {
  shape([[x - 30 * s, y - 50 * s], [x + 30 * s, y - 50 * s], [x + 24 * s, y + 50 * s], [x - 24 * s, y + 50 * s]], { fill: '#E9F6F7', stroke: GN.ink, lwPx: 4 });
  shape([[x - 27 * s, y - 25 * s], [x + 27 * s, y - 25 * s], [x + 24 * s, y + 48 * s], [x - 24 * s, y + 48 * s]], { fill: '#6FBF3A', stroke: null });
  for (let i = 0; i < 3; i++) circle(x + (i - 1) * 14 * s, y - 8 * s + (i % 2) * 22 * s - 6 * s * Math.sin(t * 3 + i), 4 * s, { fill: '#A9E27A', stroke: null });
  for (const [bx, by] of [[38, -60], [52, -42], [44, -78]]) circle(x + bx * s, y + by * s, 14 * s, { fill: '#4C9A2A', stroke: GN.ink, lwPx: 3 });   // a broccoli floret on the rim
  line([[x + 18 * s, y - 80 * s], [x + 10 * s, y + 10 * s]], { stroke: '#FF7A9A', lwPx: 6 * s });   // a straw
}
// a tiny lecture: a chalkboard, and three tiny listeners fast asleep (Jenna's guess)
function gnLecture(x, y, s, t) {
  shape(rectPts(x - 70 * s, y - 70 * s, 140 * s, 80 * s), { fill: '#2F4A3A', stroke: '#8E5A33', lwPx: 6 * s });
  X.font = `${26 * s}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#F2F2E6'; X.fillText('ζ(s) = 0', x, y - 30 * s);
  for (let i = 0; i < 3; i++) { const hx = x + (i - 1) * 46 * s, hy = y + 40 * s;
    circle(hx, hy, 15 * s, { fill: ['#F6C9AC', '#DCA887', '#E5B393'][i], stroke: GN.ink, lwPx: 3 });
    line([[hx - 7 * s, hy - 1 * s], [hx - 2 * s, hy - 1 * s]], { stroke: GN.ink, lwPx: 2.5 }); line([[hx + 2 * s, hy - 1 * s], [hx + 7 * s, hy - 1 * s]], { stroke: GN.ink, lwPx: 2.5 });
    X.font = `${16 * s}px ${FONT_SFX}`; X.fillStyle = '#5A7BD0'; X.fillText('z', hx + 14 * s, hy - 22 * s - 4 * s * Math.sin(t * 3 + i)); }
}
// a tiny Robo-Safadi (Housam's guess)
function gnRobot(x, y, s, t) {
  const bob = 4 * s * Math.sin(t * 5);
  shape(rectPts(x - 34 * s, y - 20 * s + bob, 68 * s, 64 * s), { fill: '#B8C2CC', stroke: GN.ink, lwPx: 4, smooth: .15 });
  shape(rectPts(x - 30 * s, y - 72 * s + bob, 60 * s, 48 * s), { fill: '#D7DEE5', stroke: GN.ink, lwPx: 4, smooth: .2 });
  for (const ex of [-12, 12]) circle(x + ex * s, y - 50 * s + bob, 7 * s, { fill: '#FF4040', stroke: GN.ink, lwPx: 2 });
  line([[x, y - 72 * s + bob], [x, y - 88 * s + bob]], { stroke: GN.ink, lwPx: 4 }); circle(x, y - 90 * s + bob, 5 * s, { fill: '#FFC857', stroke: GN.ink, lwPx: 2 });
  for (const sx of [-1, 1]) line([[x + sx * 34 * s, y + bob], [x + sx * 54 * s, y - 20 * s + bob + 6 * s * Math.sin(t * 8 + sx)]], { stroke: GN.ink, lwPx: 6 * s });
}
// the twins' dream: swirling stars and a big question mark in a glowing mist
function gnDream(x, y, r, t, k) {
  X.fillStyle = radGrad(x, y, 0, r * 1.3, [[0, rgba('#FFF2B8', .9 * k)], [.5, rgba('#C7A6FF', .55 * k)], [1, rgba('#7FB8FF', .25 * k)]]); X.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * (i % 2 ? .8 : -.6), rr = r * (.3 + .5 * hash(i)), sz = r * (.05 + .05 * hash(i + 4));
    shape(starPts(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .7, sz, .45, 5, t * 2 + i), { fill: rgba(['#FFFFFF', '#FFE066', '#BFD8FF'][i % 3], k), stroke: null }); }
  X.save(); X.translate(x, y); X.rotate(.08 * Math.sin(t * 1.5)); const qs = 1 + .06 * Math.sin(t * 3);
  X.scale(qs, qs); X.globalAlpha = k;
  X.font = `${r * .9}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = r * .1; X.strokeStyle = GN.ink; X.strokeText('?', 0, r * .05); X.fillStyle = '#B07CFF'; X.fillText('?', 0, r * .05);
  X.restore();
}
