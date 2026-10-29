// characters/dr_g/dr_g.js: the rig for Dr. G. Description and look live in README.md; reference art next to it.
//
// dr_g(x, y, s, o) → anchors. (x, y) = floor point between the feet (screen px), s = px per local unit.
// Local units: feet at y 0, up is negative; she is about 38.6 units tall (big cartoon head in a white hijab).
// Pose   t, dy, lean, tilt, turn, rot, jump, sq, flip
//        handL / handR: local IK targets · footL / footR: local IK targets
//        handPoseL / handPoseR: 'open' | 'wave' | 'point' | 'fist' | 'grip' (grip is automatic when holding something)
//        front: { L, R } draws that arm over the hijab (automatic when the hand is up by her face)
// Face   eyes: 'open' | 'wide' | 'happy' | 'closed' | 'wink' | 'narrow' · brows: 'normal' | 'up' | 'worried' | 'stern'
//        mouth: 'smile' | 'grin' | 'open' | 'o' | 'flat' | 'frown' · lookX, lookY (-1..1) · blink (omit for auto-blink)
// Props  holdL / holdR: 'clipboard' | 'apple' | 'broccoli' | 'donut' | 'flower' | 'pencil' | 'spoon' | 'chestpiece'
//        prop: 'book' | 'pot' | 'oud' (two-handed) · clip: { rot, dx, dy, ticks } · noJunk: true (red no-sign on the donut)
// FX     hearts, notes, sparkle, nature, letters, rules (0..1 strengths) · brooch: true (pearl hijab pin)
// Returns anchors in screen px: { head, top, mouth, eyeL, eyeR, chest, belly, handL, handR, kneeL, kneeR, footL, footR, prop }

const DR_G_UNIT = 4.4;   // world units per local unit: about 170 world units tall
const DG = {
  ink: '#2B2430', skin: '#F5BE9A', shade: '#D98E6B', blush: '#EE8C82', lip: '#C85F5E', brow: '#3A2A24', iris: '#3B2A22',
  hijab: '#F6F6F9', fold: '#D6D7E0', light: '#FFFFFF',
  coat: '#FBFBFD', coatShade: '#DDE0E8', sweater: '#2F3E63', dot: '#DCE3F0',
  pants: '#3B3E4B', shoe: '#59606E', stripe: '#A9AFBA', sole: '#3E434F',
  scope: '#7A3E86', metal: '#C9CDD6', gold: '#E5B94A', board: '#B9946A', paper: '#FFFDF4',
  apple: '#E0473F', leaf: '#5DAE4B', green: '#3F8F3A', donut: '#F08DB5', dough: '#D9A066',
  book: '#9C3D45', wood: '#A36B3F', pot: '#8A93A3', note: '#8E5BB5', petal: '#F49AC1', no: '#E2322F',
};
let DG_FLIP = false;

function dgLimb(points, width, fill, lw) {
  withBoil(0, () => {
    line(points, { stroke: DG.ink, lw: width + lw * 2 });
    line(points, { stroke: fill, lw: width });
  });
}
function dgText(str, x, y, size, col, weight = 700) {
  X.save(); X.translate(x, y); X.scale((DG_FLIP ? -1 : 1) * size / 20, size / 20);
  X.font = `${weight} 20px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = col;
  X.fillText(str, 0, 0); X.restore();
}
function dgHeart(x, y, r, alpha = 1, col = DG.blush) {
  shape([[x, y + r * .8], [x - r, y], [x - r * .85, y - r * .65], [x - r * .35, y - r * .8],
    [x, y - r * .4], [x + r * .35, y - r * .8], [x + r * .85, y - r * .65], [x + r, y]],
  { fill: rgba(col, alpha), stroke: null, smooth: .7 });
}
function dgNote(x, y, r, alpha, col) {
  ellipse(x, y, r, r * .72, { fill: rgba(col, alpha), stroke: null, rot: -.35 });
  line([[x + r * .9, y - r * .2], [x + r * .9, y - r * 3.2], [x + r * 2, y - r * 2.6]], { stroke: rgba(col, alpha), lw: r * .35 });
}

// Hands in arm-local space: +x runs from the wrist to the fingertips. thumb = which side (+1/-1) the thumb sits on.
function dgHand(p, angle, lw, kind, thumb) {
  X.save(); X.translate(...p); X.rotate(angle); X.scale(1.25, 1.25 * thumb);
  if (kind === 'wave') {
    const fingers = [-.66, -.22, .2, .6].map((a, i) => [[.8, 0], [.8 + [1.35, 1.6, 1.55, 1.3][i] * Math.cos(a), [1.35, 1.6, 1.55, 1.3][i] * Math.sin(a)]]);
    const th = [[.45, -.4], [.75, -1.45]];
    withBoil(0, () => {
      for (const f of [...fingers, th]) line(f, { stroke: DG.ink, lw: .42 + lw * 2 });
      ellipse(.7, 0, .78, .7, { fill: DG.ink, stroke: null });
      for (const f of [...fingers, th]) line(f, { stroke: DG.skin, lw: .42 });
      ellipse(.7, 0, .78 - lw, .7 - lw, { fill: DG.skin, stroke: null });
    });
    line([[1.2, -.5], [1.4, -.68]], { stroke: DG.gold, lw: .16 });
  } else if (kind === 'point') {
    shape([[-.3, -.5], [.6, -.6], [.95, -.25], [.95, .45], [.3, .6], [-.3, .25]], { fill: DG.skin, stroke: DG.ink, lw, smooth: .6 });
    withBoil(0, () => {
      line([[.7, -.35], [1.9, -.42]], { stroke: DG.ink, lw: .34 + lw * 2 });
      line([[.7, -.35], [1.9, -.42]], { stroke: DG.skin, lw: .34 });
    });
    shape([[.3, .3], [.75, .75], [.35, .85]], { fill: DG.skin, stroke: DG.ink, lw: lw * .8, smooth: .5 });
  } else if (kind === 'fist' || kind === 'grip') {
    shape([[-.3, -.55], [.6, -.6], [1, -.25], [1, .45], [.35, .62], [-.3, .25]], { fill: DG.skin, stroke: DG.ink, lw, smooth: .6 });
    for (let i = 0; i < 3; i++) line([[.65, -.3 + i * .25], [.95, -.28 + i * .25]], { stroke: DG.shade, lw: .08 });
    if (kind === 'grip') shape([[.15, .35], [.6, .78], [.95, .6]], { fill: DG.skin, stroke: DG.ink, lw: lw * .8, smooth: .5, closed: false });
  } else {
    shape([[-.3, -.5], [.55, -.55], [1.6, -.32], [1.8, .05], [1.55, .38], [.7, .5], [.38, .9], [-.3, .22]],
      { fill: DG.skin, stroke: DG.ink, lw, smooth: .6 });
    for (let i = 0; i < 3; i++) line([[.7, -.22 + i * .2], [1.42, -.17 + i * .17]], { stroke: DG.shade, lw: .07 });
    line([[1.05, -.38], [1.12, -.08]], { stroke: DG.gold, lw: .14 });
  }
  X.restore();
}

// ---- held props: drawn at the hand (under the fingers), upright in body space ----
function dgHeld(item, p, side, lw, t, o) {
  const [x, y] = p;
  X.save(); X.translate(x, y);
  if (item === 'clipboard') {
    const c = o.clip || {}, ticks = c.ticks ?? 2;
    X.translate(c.dx ?? -side * .3, c.dy ?? -1.7); X.rotate(c.rot ?? side * .32);
    shape(rectPts(-1.65, -2.35, 3.3, 4.7), { fill: DG.board, stroke: DG.ink, lw, smooth: .08 });
    shape(rectPts(-1.3, -1.95, 2.6, 4), { fill: DG.paper, stroke: null });
    for (let i = 0; i < 4; i++) {
      const yy = -1.1 + i * .85;
      shape(rectPts(-1.05, yy - .22, .44, .44), { fill: null, stroke: DG.fold, lw: .07 });
      line([[-.4, yy], [1, yy]], { stroke: DG.fold, lw: .12 });
      if (i < ticks) line([[-1, yy - .02], [-.82, yy + .2], [-.5, yy - .32]], { stroke: DG.green, lw: .13 });
    }
    shape(rectPts(-.65, -2.6, 1.3, .6), { fill: DG.metal, stroke: DG.ink, lw: lw * .7, smooth: .2 });
    circle(0, -2.45, .14, { fill: DG.ink, stroke: null });
  } else if (item === 'apple') {
    X.translate(0, -1.05);
    shape([[0, -.75], [.6, -1], [1.05, -.5], [1.05, .35], [.55, .95], [0, .8], [-.55, .95], [-1.05, .35], [-1.05, -.5], [-.6, -1]],
      { fill: DG.apple, stroke: DG.ink, lw, smooth: .8 });
    ellipse(-.45, -.35, .2, .3, { fill: 'rgba(255,255,255,.55)', stroke: null, rot: .4 });
    line([[0, -.75], [.1, -1.35]], { stroke: DG.wood, lw: .16 });
    shape([[.1, -1.15], [.6, -1.55], [.95, -1.3], [.45, -1.05]], { fill: DG.leaf, stroke: DG.ink, lw: lw * .6, smooth: .6 });
  } else if (item === 'broccoli') {
    shape([[-.35, .3], [.35, .3], [.45, -1.4], [-.45, -1.4]], { fill: '#9CCB6B', stroke: DG.ink, lw, smooth: .2 });
    for (const [cx, cy, r] of [[-.9, -1.8, .7], [.9, -1.8, .7], [0, -2.5, .85], [-.5, -1.4, .55], [.5, -1.4, .55]])
      circle(cx, cy, r, { fill: DG.green, stroke: DG.ink, lw: lw * .8 });
    for (let i = 0; i < 6; i++) circle(-.8 + i * .32, -2.1 + .35 * Math.sin(i * 2), .1, { fill: '#62B254', stroke: null });
  } else if (item === 'donut') {
    X.translate(0, -1.5); X.scale(1.35, 1.35);
    circle(0, 0, 1.15, { fill: DG.dough, stroke: DG.ink, lw });
    shape(ellPts(0, -.05, 1, .95, 14).map((q, i) => [q[0] + (i % 2 ? .06 : -.06), q[1] + (i % 3 ? .05 : .12)]),
      { fill: DG.donut, stroke: null, smooth: .7 });
    circle(0, 0, .38, { fill: DG.paper, stroke: DG.ink, lw: lw * .8 });
    const sp = ['#FFE36E', '#7FD3F7', '#FFFFFF', '#A86FDB'];
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4, r = .6 + .2 * hash(i);
      line([[r * Math.cos(a), r * Math.sin(a)], [r * Math.cos(a) + .15, r * Math.sin(a) + .08]], { stroke: sp[i % 4], lw: .1 });
    }
    if (o.noJunk) {
      circle(0, 0, 1.7, { fill: null, stroke: DG.no, lw: .32 });
      line([[-1.2, -1.2], [1.2, 1.2]], { stroke: DG.no, lw: .32 });
    }
  } else if (item === 'flower') {
    line([[0, .2], [.2, -1.5], [.1, -3]], { stroke: DG.green, lw: .16, smooth: true });
    shape([[.15, -1.4], [.8, -1.9], [.9, -1.4]], { fill: DG.leaf, stroke: DG.ink, lw: lw * .6, smooth: .6 });
    for (let i = 0; i < 6; i++) {
      const a = i * TAU / 6 + t * .4;
      ellipse(.1 + .45 * Math.cos(a), -3.1 + .45 * Math.sin(a), .38, .26, { fill: DG.petal, stroke: DG.ink, lw: lw * .55, rot: a });
    }
    circle(.1, -3.1, .27, { fill: DG.gold, stroke: DG.ink, lw: lw * .6 });
  } else if (item === 'pencil') {
    X.rotate(side * .5 + .9);
    shape(rectPts(-.2, -1.8, .4, 2.6), { fill: '#F6C744', stroke: DG.ink, lw: lw * .7 });
    shape([[-.2, .8], [.2, .8], [0, 1.35]], { fill: '#F2D3A8', stroke: DG.ink, lw: lw * .7 });
    shape(rectPts(-.2, -2.2, .4, .4), { fill: DG.petal, stroke: DG.ink, lw: lw * .7 });
  } else if (item === 'spoon') {
    X.rotate(side * .28);
    shape(rectPts(-.17, -1.2, .34, 5.2), { fill: DG.wood, stroke: DG.ink, lw: lw * .7, smooth: .2 });
    ellipse(0, 4.4, .5, .75, { fill: DG.wood, stroke: DG.ink, lw: lw * .7 });
  } else if (item === 'chestpiece') {
    circle(.2, -.3, .62, { fill: DG.metal, stroke: DG.ink, lw });
    circle(.2, -.3, .35, { fill: '#EEF0F4', stroke: null });
  }
  X.restore();
}

// ---- two-handed props ----
function dgBook(hands, lw, t) {
  const m = mixPt(hands.handL, hands.handR, .5), w = Math.max(5, Math.abs(hands.handR[0] - hands.handL[0]) + 1.4);
  X.save(); X.translate(m[0], m[1] - 1.2);
  shape([[-w / 2 - .2, -1.9], [0, -1.5], [w / 2 + .2, -1.9], [w / 2 + .2, 1.6], [0, 2], [-w / 2 - .2, 1.6]], { fill: DG.book, stroke: DG.ink, lw });
  for (const sd of [-1, 1]) {
    shape([[0, -1.3], [sd * w / 2, -1.75], [sd * w / 2, 1.4], [0, 1.8]], { fill: DG.paper, stroke: DG.ink, lw: lw * .7 });
    for (let i = 0; i < 5; i++) line([[sd * .45, -.9 + i * .55], [sd * (w / 2 - .4), -1.15 + i * .52]], { stroke: DG.fold, lw: .1 });
  }
  const turn = frac(t * .25);   // a page lifts and turns every four seconds
  if (turn > .75) {
    const k = ease((turn - .75) / .25), x = w / 2 * Math.cos(k * Math.PI);
    shape([[0, -1.3], [x, -1.75 - Math.sin(k * Math.PI) * .9], [x, 1.4 - Math.sin(k * Math.PI) * .9], [0, 1.8]], { fill: '#FFF8E6', stroke: DG.ink, lw: lw * .6 });
  }
  line([[0, -1.3], [0, 1.8]], { stroke: DG.ink, lw: lw * .7 });
  X.restore();
  return toPx(m[0], m[1] - 1.2);
}
function dgPot(t, lw) {
  X.save(); X.translate(0, -11.3);
  for (let i = 0; i < 4; i++) {
    const u = frac(t * .45 + i / 4), x = -1.8 + i * 1.2 + .5 * Math.sin(t * 2 + i * 2);
    line([[x, -1.4 - u * 1], [x + .4 * Math.sin(u * 6 + i), -2.6 - u * 3], [x - .3, -3.6 - u * 4]],
      { stroke: `rgba(255,255,255,${(Math.sin(u * Math.PI) * .75).toFixed(3)})`, lw: .4, smooth: true });
  }
  for (const sd of [-1, 1]) shape([[sd * 3.2, -1], [sd * 4.3, -1.1], [sd * 4.3, -.3], [sd * 3.2, -.2]], { fill: DG.ink, stroke: DG.ink, lw, smooth: .3 });
  shape([[-3.4, -1.4], [3.4, -1.4], [3.2, 2.2], [2.6, 2.7], [-2.6, 2.7], [-3.2, 2.2]], { fill: DG.pot, stroke: DG.ink, lw, smooth: .25 });
  ellipse(0, -1.4, 3.4, .55, { fill: '#F2A65A', stroke: DG.ink, lw });
  for (let i = 0; i < 5; i++) {   // soup veggies bobbing: carrot, peas, greens
    const a = t * 1.3 + i * 1.3;
    circle(2.4 * Math.cos(a) * .9, -1.4 + .3 * Math.sin(a), .22, { fill: i % 2 ? '#7BC46B' : '#F07A3A', stroke: null });
  }
  line([[-2.6, .3], [2.6, .3]], { stroke: '#A9B1BE', lw: .18 });
  X.restore();
}
function dgOud(t, lw) {
  // Pear-shaped oud held across the body: bowl low on her right (screen left), neck rising to screen right.
  X.save(); X.translate(-.8, -15.3); X.rotate(-.62);
  shape([[5.6, -.32], [9.4, -.26], [9.4, .26], [5.6, .32]], { fill: '#5B3A26', stroke: DG.ink, lw });
  shape([[9.2, -.38], [10.7, -.75], [11.1, -.2], [9.4, .32]], { fill: DG.wood, stroke: DG.ink, lw: lw * .8, smooth: .2 });
  for (let i = 0; i < 3; i++) circle(9.8 + i * .4, -.62 + i * .13, .14, { fill: DG.gold, stroke: DG.ink, lw: lw * .4 });
  shape([[-4.1, 0], [-3.4, -2.5], [-1.2, -3.3], [2.4, -2.3], [5.9, -.5], [5.9, .5], [2.4, 2.3], [-1.2, 3.3], [-3.4, 2.5]],
    { fill: DG.wood, stroke: DG.ink, lw, smooth: .75 });
  for (let i = 1; i < 5; i++) line([[-3.9 + i * .15, -2 + i * .9 - 2.2], [5.4, -.35 + i * .14]], { stroke: '#8B5530', lw: .08, smooth: true });
  shape([[-3.2, -1], [-2.3, -1.15], [-2.3, 1.15], [-3.2, 1]], { fill: '#5B3A26', stroke: DG.ink, lw: lw * .6 });
  for (const [cx, r] of [[.6, .85], [2.6, .45]]) {
    circle(cx, 0, r, { fill: '#4A2C1C', stroke: DG.ink, lw: lw * .6 });
    for (let i = 0; i < 6; i++) circle(cx + r * .6 * Math.cos(i * TAU / 6), r * .6 * Math.sin(i * TAU / 6), r * .14, { fill: DG.gold, stroke: null });
  }
  const buzz = .05 * Math.sin(t * 40);
  for (let i = 0; i < 4; i++) line([[-2.6, -.36 + i * .24], [9.3, -.18 + i * .12 + buzz * (i % 2 ? 1 : -1)]], { stroke: '#F1E2B8', lw: .05 });
  X.restore();
}

// ---- effects ----
function dgHearts(t, k) {
  for (let i = 0; i < 6; i++) {
    const u = frac(t * .3 + i / 6), a = Math.sin(u * Math.PI) * k;
    dgHeart((i % 2 ? 1 : -1) * (5 + u * 2.5) + .4 * Math.sin(t * 2 + i), -21 - u * 15, .4 + u * .3, a, i % 3 ? DG.blush : DG.petal);
  }
}
function dgNotes(t, k) {
  const cols = [DG.note, DG.gold, DG.scope, '#5C9BD6'];
  for (let i = 0; i < 7; i++) {
    const u = frac(t * .28 + i / 7), a = Math.sin(u * Math.PI) * k, sd = i % 2 ? 1 : -1;
    dgNote(sd * (5.5 + u * 3.5) + 1.2 * Math.sin(t * 1.6 + i * 2), -16 - u * 22, .42 + .1 * (i % 3), a, cols[i % 4]);
  }
}
function dgSparkle(t, k) {
  for (let i = 0; i < 8; i++) {
    const ph = frac(t * .7 + hash(i)), a = Math.sin(ph * Math.PI) * k, ang = i * TAU / 8 + .3;
    const x = Math.cos(ang) * (7 + 1.5 * hash(i + 4)), y = -21 + Math.sin(ang) * 15;
    shape(starPts(x, y, .5 + .5 * Math.sin(ph * Math.PI), .28, 4), { fill: rgba(i % 2 ? DG.gold : '#F4A8D0', a), stroke: null });
  }
}
function dgNature(t, k, lw, A) {
  for (let i = 0; i < 6; i++) {   // drifting leaves
    const u = frac(t * .18 + i / 6), a = Math.sin(u * Math.PI) * k, x = -9 + 18 * hash(i * 3) + 1.5 * Math.sin(t * 1.4 + i), y = -38 + u * 30;
    X.save(); X.translate(x, y); X.rotate(t * 1.5 + i);
    shape([[-.55, 0], [0, -.35], [.55, 0], [0, .35]], { fill: rgba(i % 3 ? DG.leaf : '#E8A33D', a), stroke: null, smooth: .8 });
    line([[-.5, 0], [.5, 0]], { stroke: rgba(DG.green, a), lw: .06 }); X.restore();
  }
  const bx = 6.5 + 2 * Math.sin(t * .9), by = -28 + 1.6 * Math.sin(t * 1.7), flap = .25 + .75 * Math.abs(Math.sin(t * 9));
  X.save(); X.translate(bx, by); X.rotate(.15 * Math.sin(t * 1.7));
  for (const sd of [-1, 1]) {
    ellipse(sd * .55 * flap, -.3, .6 * flap, .55, { fill: rgba('#F3A83B', k), stroke: rgba(DG.ink, k), lw: lw * .5 });
    ellipse(sd * .4 * flap, .35, .4 * flap, .35, { fill: rgba('#F07B5A', k), stroke: rgba(DG.ink, k), lw: lw * .5 });
  }
  line([[0, -.6], [0, .6]], { stroke: rgba(DG.ink, k), lw: .16 });
  X.restore();
  A.butterfly = toPx(bx, by);
}
function dgLetters(t, k) {
  const L = ['A', 'b', 'C', '“', 'ق', 'Ω'];
  for (let i = 0; i < 6; i++) {
    const u = frac(t * .22 + i / 6), a = Math.sin(u * Math.PI) * k;
    if (a < .02) continue;
    X.save(); X.globalAlpha *= a;
    dgText(L[i], (i % 2 ? 1 : -1) * (2.5 + u * 4), -22 - u * 12, 1.4, i % 2 ? DG.book : DG.note, 600);
    X.restore();
  }
}
function dgRules(t, k, lw) {
  if (k < .02) return;
  X.save(); X.globalAlpha *= k; X.translate(8.6, -31 + .3 * Math.sin(t * 2)); X.rotate(.06 * Math.sin(t * 1.3));
  shape(rectPts(-2.7, -2.4, 5.4, 4.9), { fill: DG.paper, stroke: DG.ink, lw, smooth: .12 });
  shape(rectPts(-2.7, -2.4, 5.4, 1.3), { fill: DG.scope, stroke: DG.ink, lw, smooth: .12 });
  dgText('RULES', 0, -1.72, 1.0, DG.light, 800);
  for (let i = 0; i < 3; i++) {
    const yy = -.35 + i * .95, on = frac(t * .4) * 3.6 > i;
    dgText(String(i + 1), -1.95, yy, .75, DG.scope, 800);
    line([[-1.4, yy], [1.4, yy]], { stroke: DG.fold, lw: .16 });
    if (on) shape(starPts(2, yy, .38, .45), { fill: DG.gold, stroke: null });
  }
  X.restore();
}

function dr_g(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, lw = clamp(s * .14, 1.4, 5) / s;
  DG_FLIP = !!o.flip;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) ellipse(0, .2, 4.6, .7, { fill: 'rgba(45,30,55,.18)', stroke: null });
  X.translate(0, -(o.jump || 0));
  if (o.rot) { X.translate(0, -19); X.rotate(o.rot); X.translate(0, 19); }
  if (o.sq) X.scale(1 + o.sq * .4, 1 - o.sq);
  withBoil(o.boil ?? .35, () => {
    // ---- legs: charcoal trousers and grey slip-ons with two pale stripes ----
    for (const sd of [-1, 1]) {
      const foot = o[sd < 0 ? 'footL' : 'footR'] || [sd * 1.6, -.9];
      const hip = [sd * 1.45, -13 + (o.dy || 0)];
      const { joint, end } = ik2(hip, foot, 6.1, 6.15, [sd, 0]);
      dgLimb([hip, joint, end], 2.35, DG.pants, lw);
      line([[joint[0] + sd * .5, joint[1] - .4], [joint[0], joint[1] + .4]], { stroke: DG.ink, lw: .1 });
      X.save(); X.translate(...end); X.scale(sd, 1);
      shape([[-1.15, -.75], [.5, -.8], [1.8, .05], [1.95, .7], [.5, .95], [-1.15, .8]], { fill: DG.shoe, stroke: DG.ink, lw, smooth: .45 });
      line([[-1.1, .72], [.4, .88], [1.9, .66]], { stroke: DG.sole, lw: .3, smooth: true });
      for (let i = 0; i < 2; i++) line([[-.2 + i * .1, -.55 + i * .35], [1.35 + i * .1, .02 + i * .3]], { stroke: DG.stripe, lw: .16, smooth: true });
      X.restore();
      A[sd < 0 ? 'footL' : 'footR'] = toPx(...end);
      A[sd < 0 ? 'kneeL' : 'kneeR'] = toPx(...joint);
    }
    X.save(); X.translate(0, o.dy || 0); X.translate(0, -13); X.rotate(o.lean || 0); X.translate(0, 13);
    // ---- torso: trouser waist, navy polka-dot sweater, open white lab coat ----
    shape([[-2.75, -14.2], [2.75, -14.2], [2.8, -12.2], [0, -11.6], [-2.8, -12.2]], { fill: DG.pants, stroke: DG.ink, lw, smooth: .3 });
    const sweater = [[-2.4, -24.8], [2.4, -24.8], [3, -20], [2.85, -13.1], [-2.85, -13.1], [-3, -20]];
    shape(sweater, { fill: DG.sweater, stroke: DG.ink, lw, smooth: .3 });
    X.save(); tracePath(sweater, true, .3); X.clip();
    for (let r = 0; r < 12; r++) for (let c = 0; c < 6; c++) circle(-2.7 + c * 1.1 + (r % 2) * .55, -24.4 + r * .95, .16, { fill: DG.dot, stroke: null });
    X.restore();
    line([[-2.8, -13.9], [0, -13.75], [2.8, -13.9]], { stroke: DG.ink, lw: .1, smooth: true });
    for (const sd of [-1, 1]) {
      const panel = [[sd * 1.25, -24.9], [sd * 4.6, -24], [sd * 4.85, -20], [sd * 4.45, -14], [sd * 4.95, -7.5],
        [sd * 1.35, -7.4], [sd * 1.5, -12.6], [sd * 1.95, -17.2], [sd * 2.05, -22.4]];
      shape(panel, { fill: DG.coat, stroke: DG.ink, lw, smooth: .25 });
      line([[sd * 4.2, -22], [sd * 4.1, -15], [sd * 4.5, -8.3]], { stroke: DG.coatShade, lw: .45, smooth: true });
      line([[sd * 1.3, -24.6], [sd * 2.6, -20.6], [sd * 1.95, -17.2]], { stroke: DG.ink, lw: .1, smooth: .4 });
      shape([[sd * 1.3, -24.6], [sd * 2.6, -20.6], [sd * 2.05, -22.4]], { fill: DG.coatShade, stroke: null });
      shape(rectPts(sd > 0 ? 1.95 : -4.3, -11.8, 2.35, 2.5), { fill: DG.coat, stroke: DG.ink, lw: lw * .7, smooth: .15 });
      line([[sd > 0 ? 2.05 : -4.2, -11.2], [sd > 0 ? 4.2 : -2.05, -11.2]], { stroke: DG.coatShade, lw: .12 });
    }
    for (let i = 0; i < 3; i++) circle(1.85, -16.4 + i * 2.6, .2, { fill: DG.light, stroke: DG.ink, lw: lw * .6 });
    dgText('Dr. G', 2.85, -18.2, .8, DG.ink, 800);
    A.chest = toPx(0, -20); A.belly = toPx(0, -15);

    // ---- stethoscope: purple tube around the neck, chest piece on her right (screen left) ----
    const pieceHand = o.holdL === 'chestpiece' ? 'handL' : o.holdR === 'chestpiece' ? 'handR' : null;
    const hands = {}, arms = {};
    for (const sd of [-1, 1]) {
      const key = sd < 0 ? 'handL' : 'handR', root = [sd * 4.05, -23.3];
      const target = o[key] || [sd * 4.4, -13.6], { joint, end } = ik2(root, target, 5, 4.9, o[sd < 0 ? 'elbowL' : 'elbowR'] || [sd, .9]);
      arms[key] = { sd, root, joint, end }; hands[key] = end;
    }
    const piece = pieceHand ? [hands[pieceHand][0] + .2, hands[pieceHand][1] - .3] : [-2.55, -19.3];
    withBoil(0, () => {
      const left = [[-1.7, -24.8], [-2.25, -22.5], [mixPt([-2.25, -22.5], piece, .5)[0] - .3, mixPt([-2.25, -22.5], piece, .5)[1] + .6], [piece[0], piece[1] - .5]];
      line(left, { stroke: DG.ink, lw: .3 + lw * 2, smooth: true }); line(left, { stroke: DG.scope, lw: .3, smooth: true });
      const right = [[1.7, -24.8], [1.95, -22.6], [2, -21.2]];
      line(right, { stroke: DG.ink, lw: .3 + lw * 2, smooth: true }); line(right, { stroke: DG.scope, lw: .3, smooth: true });
      for (const dx of [-.55, .55]) {
        const ear = [[2, -21.2], [2 + dx * .7, -20.3], [2 + dx * .8, -19.6]];
        line(ear, { stroke: DG.ink, lw: .16 + lw * 2, smooth: true }); line(ear, { stroke: DG.metal, lw: .16, smooth: true });
      }
    });
    if (!pieceHand) { circle(...piece, .62, { fill: DG.metal, stroke: DG.ink, lw }); circle(...piece, .35, { fill: '#EEF0F4', stroke: null }); }

    // ---- arms: white coat sleeves with navy sweater cuffs ----
    const front = o.front || {};
    const isFront = key => front[key[4]] ?? (hands[key][1] < -23.5 && Math.abs(hands[key][0]) < 4.6);
    const drawArm = key => {
      const { sd, root, joint, end } = arms[key], angle = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      dgLimb([root, joint, end], 2.25, DG.coat, lw);
      line([[joint[0] - sd * .6, joint[1] - .2], [joint[0], joint[1] - .5], [joint[0] + sd * .6, joint[1] - .1]], { stroke: DG.coatShade, lw: .14, smooth: true });
      X.save(); X.translate(...end); X.rotate(angle);
      shape(rectPts(-.75, -1.12, .55, 2.24), { fill: DG.coat, stroke: DG.ink, lw: lw * .8 });
      shape(rectPts(-.25, -.85, .45, 1.7), { fill: DG.sweater, stroke: DG.ink, lw: lw * .7 });
      X.restore();
      const item = o[sd < 0 ? 'holdL' : 'holdR'];
      if (item) dgHeld(item, end, sd, lw, t, o);
      const kind = o[sd < 0 ? 'handPoseL' : 'handPoseR'] || (item ? 'grip' : 'open');
      dgHand(end, angle, lw, kind, Math.cos(angle) * sd >= 0 ? -1 : 1);
      A[key] = toPx(...end);
    };
    if (o.prop === 'oud') dgOud(t, lw);
    if (o.prop === 'pot') dgPot(t, lw);
    if (o.prop === 'book') A.prop = dgBook(hands, lw, t);
    for (const key of ['handL', 'handR']) if (!isFront(key)) drawArm(key);
    if (o.prop === 'pot') { A.prop = toPx(0, -12.7); }

    // ---- head: white hijab framing a round face, big Pixar-style eyes ----
    X.save(); X.translate(0, -27); X.rotate(o.tilt || 0); X.translate(0, -5);
    shape([[0, -6.5], [3.8, -5.7], [5.3, -2.7], [5.4, 1.4], [4.9, 4.8], [5.05, 7], [3.9, 8.3], [1.4, 8.8], [-1.4, 8.8], [-3.9, 8.3], [-5.05, 7], [-4.9, 4.8], [-5.4, 1.4], [-5.3, -2.7], [-3.8, -5.7]],
      { fill: DG.hijab, stroke: DG.ink, lw, smooth: .75 });
    line([[-4.3, 5], [-2.6, 6.6], [0, 7.2], [2.6, 6.6], [4.3, 5]], { stroke: DG.fold, lw: .3, smooth: true });
    line([[-4.4, 7.1], [-2, 8.2], [1.4, 8.3], [3.9, 7.5]], { stroke: DG.fold, lw: .22, smooth: true });
    line([[3.3, -4.9], [4.6, -2.2], [4.7, 2]], { stroke: DG.fold, lw: .25, smooth: true });
    const turn = clamp(o.turn || 0, -1, 1) * .5;
    shape([[turn, -4.85], [2.95 + turn, -4.3], [4.2 + turn * .5, -2], [4.35 + turn * .5, .7], [3.9, 3.3], [2.4 + turn * .5, 5], [turn * .5, 5.6], [-2.4 + turn * .5, 5], [-3.9, 3.3], [-4.35 + turn * .5, .7], [-4.2 + turn * .5, -2], [-2.95 + turn, -4.3]],
      { fill: DG.fold, stroke: null, smooth: .8 });
    const face = [[turn, -4.4], [2.6 + turn, -3.95], [3.65 + turn * .5, -2], [3.85 + turn * .5, .6], [3.4 + turn * .5, 2.75], [2.05 + turn * .5, 4.25], [turn * .5, 4.8], [-2.05 + turn * .5, 4.25], [-3.4 + turn * .5, 2.75], [-3.85 + turn * .5, .6], [-3.65 + turn * .5, -2], [-2.6 + turn, -3.95]];
    shape(face, { fill: DG.skin, stroke: DG.ink, lw: lw * .85, smooth: .8 });
    if (o.brooch) {
      circle(3.9, 4.6, .45, { fill: '#FFF6F0', stroke: DG.ink, lw: lw * .6 });
      circle(3.75, 4.45, .14, { fill: DG.light, stroke: null });
      for (let i = 0; i < 6; i++) circle(3.9 + .62 * Math.cos(i * TAU / 6), 4.6 + .62 * Math.sin(i * TAU / 6), .14, { fill: DG.gold, stroke: null });
    }
    for (const sd of [-1, 1]) {
      const cx = sd * 1.65 + turn, cy = -.3;
      dgEye(cx, cy, sd, o, t, lw); A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(cx, cy);
      const b = o.brows || 'normal', up = b === 'up' ? -.4 : 0, tw = b === 'worried' ? -.4 : b === 'stern' ? .38 : 0;
      // brow: a tapered arch, inner end lifted for worried, lowered for stern
      const inner = [cx - sd * .95, -2.5 + up + tw], peak = [cx + sd * .15, -3.05 + up + tw * .3], outer = [cx + sd * 1.15, -2.55 + up];
      shape([inner, peak, outer, [cx + sd * .15, -2.8 + up + tw * .3], [inner[0], inner[1] + .2]], { fill: DG.brow, stroke: null, smooth: .5 });
      ellipse(sd * 2.7 + turn * .7, 1.75, .85, .5, { fill: rgba(DG.blush, .38), stroke: null });
    }
    line([[turn * 1.1 + .15, .3], [turn * 1.1 + .4, 1.3], [turn * 1.1 - .05, 1.55]], { stroke: DG.shade, lw: .16, smooth: true });
    ellipse(turn * 1.1, 1.2, .45, .32, { fill: rgba(DG.shade, .25), stroke: null });
    const mouth = o.mouth || 'smile', mx = turn * .9, my = 2.75;
    if (mouth === 'open' || mouth === 'o') {
      const rx = mouth === 'o' ? .48 : .8, ry = mouth === 'o' ? .58 : .62;
      ellipse(mx, my, rx, ry, { fill: '#5A2630', stroke: DG.ink, lw: lw * .6 });
      ellipse(mx, my + ry * .45, rx * .55, ry * .3, { fill: DG.blush, stroke: null });
    } else if (mouth === 'grin') {
      const pts = [[mx - 1.35, my - .45], [mx, my - .25], [mx + 1.35, my - .45], [mx + .7, my + .6], [mx - .7, my + .6]];
      shape(pts, { fill: '#7A2E38', stroke: DG.ink, lw: lw * .8, smooth: .6 });
      X.save(); tracePath(pts, true, .6); X.clip();
      shape(rectPts(mx - 1.4, my - .55, 2.8, .55), { fill: DG.light, stroke: null });
      ellipse(mx, my + .62, .6, .3, { fill: DG.blush, stroke: null }); X.restore();
    } else if (mouth === 'smile') {
      shape([[mx - 1.15, my - .35], [mx, my + .1], [mx + 1.15, my - .35], [mx + .5, my + .4], [mx - .5, my + .4]], { fill: DG.lip, stroke: DG.ink, lw: lw * .6, smooth: .7 });
      line([[mx - .9, my - .12], [mx, my + .12], [mx + .9, my - .12]], { stroke: DG.light, lw: .16, smooth: true });
    } else line([[mx - .8, my], [mx, mouth === 'flat' ? my : my - .32], [mx + .8, my]], { stroke: DG.ink, lw: lw * .9, smooth: true });
    A.head = toPx(0, 0); A.top = toPx(0, -6.6); A.mouth = toPx(mx, my);
    X.restore();

    for (const key of ['handL', 'handR']) if (isFront(key)) drawArm(key);
    if (o.hearts) dgHearts(t, clamp(o.hearts));
    if (o.notes) dgNotes(t, clamp(o.notes));
    if (o.sparkle) dgSparkle(t, clamp(o.sparkle));
    if (o.nature) dgNature(t, clamp(o.nature), lw, A);
    if (o.letters) dgLetters(t, clamp(o.letters));
    if (o.rules) dgRules(t, clamp(o.rules), lw);
    X.restore();
  });
  X.restore(); DG_FLIP = false; return A;
}
function dgEye(cx, cy, sd, o, t, lw) {
  const kind = o.eyes || 'open', ph = ((t + .9) % 3.9 + 3.9) % 3.9;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (kind === 'closed' || kind === 'happy' || (kind === 'wink' && sd > 0) || blink > .92) {
    line([[cx - .95, cy + .1], [cx, cy + (kind === 'happy' ? -.45 : .35)], [cx + .95, cy + .1]], { stroke: DG.ink, lw: lw * 1.5, smooth: true });
    line([[cx + sd * .85, cy + .05], [cx + sd * 1.2, cy - .2]], { stroke: DG.ink, lw: lw * .9 });
    return;
  }
  const ry = (kind === 'wide' ? 1.38 : kind === 'narrow' ? .55 : 1.2) * (1 - blink), rx = kind === 'wide' ? 1.1 : 1.02;
  const pts = ellPts(cx, cy, rx, ry, 20);
  shape(pts, { fill: DG.light, stroke: DG.ink, lw: lw * .6, smooth: true });
  X.save(); tracePath(pts, true, true); X.clip();
  const ix = cx + .25 * clamp(o.lookX || 0, -1, 1), iy = cy + .1 + .25 * clamp(o.lookY || 0, -1, 1), ir = kind === 'wide' ? .7 : .84;
  circle(ix, iy, ir, { fill: DG.iris, stroke: null });
  circle(ix, iy, ir * .58, { fill: '#140E10', stroke: null });
  circle(ix - .27, iy - .3, .22, { fill: DG.light, stroke: null });
  circle(ix + .25, iy + .25, .1, { fill: DG.light, stroke: null });
  X.restore();
  line(ellPts(cx, cy, rx, ry, 20).slice(10, 21).concat([[cx + rx, cy]]), { stroke: DG.ink, lw: lw * 1.6, smooth: true });
  line([[cx + sd * rx * .9, cy - ry * .35], [cx + sd * (rx + .35), cy - ry * .75]], { stroke: DG.ink, lw: lw * 1.1 });
  line([[cx + sd * rx * .7, cy - ry * .7], [cx + sd * (rx + .1), cy - ry * 1.12]], { stroke: DG.ink, lw: lw * .9 });
}

function dr_gAbility(t, ability, o = {}) {
  const k = clamp(o.k ?? 1), breathe = .1 * Math.sin(t * 2);
  const clipboard = { holdL: 'clipboard', handL: [-4.3, -16] };
  switch (ability) {
    case 'kind': return { handL: [-.9, -19.4], handR: [.9, -19.4], handPoseL: 'fist', handPoseR: 'fist', hearts: k * .8,
      eyes: 'happy', mouth: 'smile', tilt: .1 + .03 * Math.sin(t * 1.6), lean: .03, dy: breathe };
    case 'rules': return { ...clipboard, handR: [6.8, -28.6 + .25 * Math.sin(t * 5)], handPoseR: 'point', elbowR: [1, 1], rules: k,
      brows: 'up', mouth: Math.sin(t * 8) > .3 ? 'open' : 'smile', tilt: -.05, dy: breathe };
    case 'checklist': {
      const tick = frac(t * .8), stroke = tick < .4 ? Math.sin(tick / .4 * Math.PI) : 0;
      return { holdL: 'clipboard', handL: [-2.2, -17.6], clip: { rot: .05, dx: 1.4, dy: -1.6, ticks: 1 + Math.floor(t * .8) % 4 },
        holdR: 'pencil', handR: [.4 + stroke * .6, -19.3 + stroke * .5], lookY: .9, lookX: -.3, tilt: .08, mouth: 'smile' };
    }
    case 'healthy': return { holdL: 'apple', handL: [-5.6, -21 + .3 * Math.sin(t * 3)], holdR: 'broccoli', handR: [5.7, -23.5 + .3 * Math.sin(t * 3 + 1)],
      mouth: 'grin', brows: 'up', eyes: 'wide', sparkle: k * .6, dy: .15 * Math.abs(Math.sin(t * 3)) * -1 };
    case 'junk': {
      const wag = Math.sin(t * 8);
      return { holdL: 'donut', noJunk: true, handL: [-6.3, -18], handR: [7 + .6 * wag, -28.4], handPoseR: 'point', elbowR: [1, 1],
        brows: 'stern', mouth: 'flat', eyes: 'narrow', lookX: -.7, tilt: -.06 + .03 * wag, turn: -.3 };
    }
    case 'reading': return { prop: 'book', handL: [-2.6, -18.6], handR: [2.6, -18.6], letters: k, lookY: .9, tilt: .1 + .03 * Math.sin(t),
      mouth: 'smile', dy: breathe };
    case 'cooking': {
      const a = t * 4;
      return { prop: 'pot', handL: [-4.2, -12.3], handPoseL: 'grip', holdR: 'spoon', handR: [.9 + 1.1 * Math.cos(a), -16.9 + .35 * Math.sin(a)],
        lookY: .8, tilt: .06 * Math.sin(t * 2), mouth: 'grin', eyes: Math.sin(t * .9) > .6 ? 'happy' : 'open', dy: breathe };
    }
    case 'fashion': {
      const sway = Math.sin(t * 2.2);
      return { handR: [3.5, -14.6], handPoseR: 'fist', handL: [-7.6, -21.5 + .3 * sway], handPoseL: 'wave', brooch: true, sparkle: k,
        eyes: 'wink', mouth: 'grin', turn: .35, tilt: -.1 + .03 * sway, lean: -.04 + .03 * sway, footR: [.4, -.9], footL: [-1.9, -.9] };
    }
    case 'nature': return { holdR: 'flower', handR: [1.7, -25.2 + .2 * Math.sin(t * 1.3)], front: { R: true }, elbowR: [.3, 1], handL: [-6.2, -18 + .4 * Math.sin(t * 1.5)],
      handPoseL: 'open', nature: k, eyes: Math.sin(t * .8) > -.3 ? 'happy' : 'open', mouth: 'smile', tilt: .1, lookX: .6, dy: breathe };
    case 'music': {
      const strum = Math.sin(t * 12), sway = Math.sin(t * 2.4);
      return { prop: 'oud', handL: [-1.4 + .3 * strum, -15.4 + .35 * strum], handPoseL: 'grip', handR: [4.9, -20.9], handPoseR: 'grip',
        notes: k, eyes: 'closed', mouth: 'smile', tilt: .12 * sway, lean: .04 * sway, dy: .12 * Math.abs(Math.sin(t * 2.4)) };
    }
    case 'checkup': return { holdL: 'chestpiece', handL: [-6.4, -20 + .2 * Math.sin(t * 2)], handR: [4.4, -13.6],
      brows: 'up', mouth: 'smile', lookX: -.8, tilt: -.08, turn: -.4, lean: -.03 };
    case 'thinking': return { ...clipboard, handR: [1.5, -26.3], handPoseR: 'point', front: { R: true }, elbowR: [.3, 1],
      lookX: .7, lookY: -.7, tilt: .09, mouth: 'flat', brows: 'up' };
    case 'hips': return { handL: [-3.3, -14.6], handR: [3.3, -14.6], handPoseL: 'fist', handPoseR: 'fist', elbowL: [-1, -.25], elbowR: [1, -.25], brows: 'stern', eyes: 'narrow',
      mouth: Math.sin(t * 1.3) > .5 ? 'smile' : 'flat', tilt: .05 * Math.sin(t * 1.5), footL: [-2.1, -.9], footR: [2.1 - Math.max(0, Math.sin(t * 6)) * .2, -.9 - Math.max(0, Math.sin(t * 6)) * .5] };
  }
  return {};
}
function dr_gPerform(x, y, s, t, ability, o = {}) {
  return dr_g(x, y, s, { ...dr_gAbility(t, ability, o), ...o, t });
}

CHARACTERS.dr_g = {
  draw: dr_g, unit: DR_G_UNIT, palette: DG, size: [24, 41],
  poses: {
    'rest': (x, y, s, t) => dr_g(x, y, s, { t, holdL: 'clipboard', handL: [-4.3, -16], dy: .1 * Math.sin(t * 2) }),
    'hello': (x, y, s, t) => dr_g(x, y, s, { t, holdL: 'clipboard', handL: [-4.3, -16], handR: [6.2 + .5 * Math.sin(t * 7), -25.8], handPoseR: 'wave', mouth: 'grin', brows: 'up', tilt: -.05 }),
    'talk': (x, y, s, t) => dr_g(x, y, s, { t, holdL: 'clipboard', handL: [-4.3, -16], handR: [6, -20 + .5 * Math.sin(t * 3)], mouth: lipFlap(t, true, 'smile'), tilt: .04 * Math.sin(t * 2) }),
    'kind teacher': (x, y, s, t) => dr_gPerform(x, y, s, t, 'kind'),
    'rule number one': (x, y, s, t) => dr_gPerform(x, y, s, t, 'rules'),
    'checklist': (x, y, s, t) => dr_gPerform(x, y, s, t, 'checklist'),
    'healthy snack': (x, y, s, t) => dr_gPerform(x, y, s, t, 'healthy'),
    'no junk food': (x, y, s, t) => dr_gPerform(x, y, s, t, 'junk'),
    'reading': (x, y, s, t) => dr_gPerform(x, y, s, t, 'reading'),
    'cooking': (x, y, s, t) => dr_gPerform(x, y, s, t, 'cooking'),
    'fashionista': (x, y, s, t) => dr_gPerform(x, y, s, t, 'fashion'),
    'nature walk': (x, y, s, t) => dr_gPerform(x, y, s, t, 'nature'),
    'oud music': (x, y, s, t) => dr_gPerform(x, y, s, t, 'music'),
    'checkup': (x, y, s, t) => dr_gPerform(x, y, s, t, 'checkup'),
    'thinking': (x, y, s, t) => dr_gPerform(x, y, s, t, 'thinking'),
    'hands on hips': (x, y, s, t) => dr_gPerform(x, y, s, t, 'hips'),
  },
};
