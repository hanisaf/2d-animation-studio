// characters/jester_fester/jester_fester.js: Jester Fester, the court jester (see reference.webp and README.md).
//
// jester(x, y, s, o) → anchors
//   (x, y) screen point on the floor between the feet · s = px per jester unit. He is ~27 units tall (feet to hat tip),
//   so in a perspective set use s = JF_UNIT * P.k(Z) (JF_UNIT = world units per jester unit; he is ~170 world units tall).
//
// Local units: feet y = 0, y points DOWN (up is negative). Hips at y -8.4, shoulders -13.3, head centre -17.3, hat tips ≈ -26.
//
// Pose     dy (hip drop; + = crouch) · lean (torso, rad) · tilt (head, rad) · turn (head -1..1) · rot (whole body, about the
//          belly) · jump (units off the floor) · sq (squash; negative stretches) · flip · sway (tunic hem swing)
// Limbs    handL / handR: [x, y] wrist targets in local units (L = screen-left) · handPoseL / handPoseR: 'open' | 'cup' | 'fist' | 'thumb'
//          footL / footR: [x, y] ankle targets (rest: [∓1.25, -0.85])
// Face     eyes: open | wide | happy | closed | squeeze | swirl | x | star | wink · lookX / lookY (-1..1) · blink (0..1, auto if unset)
//          brows: normal | up | worried | angry · mouth: smile | grin | open | o | O | flat | frown | wobble | teeth | smirk · blush (default on)
// Hat      hatSway [dx, dy] (tips swing) · hatDroop (0..1, the points flop down: sad) · hatAskew (rad) · hatLift · hatDrop
// Extras   stars (0..1 dizzy stars) · emote: '?' | '!' | '!?' | 'sweat' | 'music' | 'heart' with emoteK (0..1 pop) · boil (px)
//
// Returns anchors in screen px: { head, mouth, hatTip, hatTipL, hatTipR, handL, handR, belly, top }

const JF = {
  ink: '#3B2530', skin: '#F7CBAA', skinDk: '#E3A487', cheek: '#F08A86', nose: '#F29A84', hair: '#6A3B22', hairLt: '#8E5534',
  eyeW: '#FFFDF7', iris: '#7A4422', brow: '#5A3020',
  crimson: '#A8284C', crimsonDk: '#7C1B38', gold: '#E4AE3E', goldDk: '#B07E22', blue: '#4568B5', plum: '#6E2D5E',
  shoe: '#8E5234', shoeDk: '#5E3420', bell: '#F3C54F', mouth: '#6E1F2E', tongue: '#EE7F8C',
  pom: ['#3F5FC4', '#4FAA4F', '#EF8B2C'],
};
const JF_UNIT = 6.3;        // world units per jester unit
const JF_HIP = -8.4;

function jester(x, y, s, o = {}) {
  const t = o.t ?? T, A = {};
  const lw = clamp(s * .15, 1.6, 5.5) / s;                        // outline width in local units (~constant px)
  X.save();
  X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  const air = o.jump || 0;
  if (!o.noShadow) { const f = 1 - clamp(air / 22) * .55; ellipse(0, .15, 4 * f, .75 * f, { fill: 'rgba(40,20,30,.28)', stroke: null }); }
  X.translate(0, -air);
  if (o.rot) { X.translate(0, -11); X.rotate(o.rot); X.translate(0, 11); }
  if (o.sq) X.scale(1 + o.sq * .55, 1 - o.sq);

  withBoil(o.boil ?? .7, () => {
    const hipY = JF_HIP + (o.dy || 0), lean = o.lean || 0, cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];   // torso-local → body-local

    // ---- legs + shoes ----
    [[-1, o.footL || [-1.25, -.85]], [1, o.footR || [1.25, -.85]]].forEach(([sd, f]) => {
      const hp = tl(sd * .8, .3), { joint, end } = ik2(hp, f, 4.0, 3.95, [sd, .1]);
      jfLimb([hp, joint, end], 1.15, JF.crimson, [[.08, .2], [.32, .44], [.56, .68], [.8, .92]], JF.blue, lw);
      jfShoe(end, sd, lw, t);
    });

    // ---- torso (neck, tunic, collar) ----
    X.save(); X.translate(0, hipY); X.rotate(lean);
    shape(rectPts(-.45, -6.5, .9, 1.6), { fill: JF.skin, stroke: JF.ink, lw });
    jfTunic(o, t, lw);
    A.belly = toPx(0, -2);

    // ---- head ----
    X.save(); X.translate(0, -6.0); X.rotate(o.tilt || 0); X.translate(0, -2.95);
    jfHead(o, t, lw, A);
    X.restore();
    X.restore();

    // ---- arms (in front of the body) ----
    [[-1, o.handL || [-3.3, -8.4], o.handPoseL || 'open'], [1, o.handR || [3.3, -8.4], o.handPoseR || 'open']].forEach(([sd, tg, pose]) => {
      const sh = tl(sd * 1.95, -4.85), { joint, end } = ik2(sh, tg, 2.75, 2.55, [sd, .6]);
      jfLimb([sh, joint, end], 1.1, JF.crimson, [[.12, .26], [.4, .54], [.7, .84]], JF.gold, lw);
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      jfHand(end, ang, sd, pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0], end[1]);
    });
  });
  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .02) jfEmote(o.emote, A, s, o.emoteK ?? 1, t);
  return A;
}

// A limb as one stroked path: ink underlay, colour, then stripes. Points are jittered once so the layers stay aligned.
function jfLimb(pts, w, col, bands, bandCol, lw) {
  if (JIT) { const a = JIT / pxScale(); pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  withBoil(0, () => {
    line(pts, { stroke: JF.ink, lw: w + lw * 2 });
    line(pts, { stroke: col, lw: w });
    for (const [a, b] of bands) line(polySlice(pts, a, b), { stroke: bandCol, lw: w - lw * .2, cap: 'butt' });
  });
}

function jfShoe(a, sd, lw, t) {
  X.save(); X.translate(a[0], a[1]); X.scale(sd, 1);
  shape([[-.75, .85], [-.95, .25], [-.5, -.35], [.45, -.25], [1.3, .05], [1.95, -.3], [2.3, -.95], [2.0, -1.15], [1.85, -.65], [1.55, .4], [.8, .85]],
    { fill: JF.shoe, stroke: JF.ink, lw, smooth: .75 });
  line([[-.5, .55], [.9, .6], [1.4, .35]], { stroke: JF.shoeDk, lw: lw * .8, smooth: true });
  jfBell(2.12, -1.3, .32, lw, wob(t, 2.3, sd) * .3);
  shape(ellPts(0, -.3, .78, .34, 14), { fill: JF.crimson, stroke: JF.ink, lw, smooth: true });
  X.restore();
}

function jfBell(x, y, r, lw, swing = 0) {
  X.save(); X.translate(x, y); X.rotate(swing);
  circle(0, 0, r, { fill: JF.bell, stroke: JF.ink, lw });
  line([[-r * .55, r * .25], [r * .55, r * .25]], { stroke: JF.goldDk, lw: lw * .8 });
  circle(-r * .35, -r * .35, r * .22, { fill: '#FFF6D8', stroke: null });
  X.restore();
}

function jfTunic(o, t, lw) {
  const sw = (o.sway ?? 0) + wob(t, .8) * .08;                          // hem swing
  const hem = [[-3.05, 1.95], [-2.25, .95], [-1.5, 2.15], [-.75, 1.0], [0, 2.25], [.75, 1.0], [1.5, 2.15], [2.25, .95], [3.05, 1.95]]
    .map(([x, y]) => [x + sw * (y + 5.2) * .12, y]);
  const pts = [[-2.05, -5.05], [-2.05, -3.9], [-1.8, -2.3], [-2.35, .1], ...hem, [2.35, .1], [1.8, -2.3], [2.05, -3.9], [2.05, -5.05], [1.0, -5.45], [0, -5.2], [-1.0, -5.45]];
  // stripes, clipped to the tunic
  X.save(); tracePath(pts, true, false); X.clip();
  const b = [-3.4, -1.95, -.62, .62, 1.95, 3.4], cols = [JF.crimson, JF.gold, JF.blue, JF.gold, JF.crimson];
  withBoil(0, () => {
    for (let i = 0; i < 5; i++) shape([[b[i] * .72, -6], [b[i + 1] * .72, -6], [b[i + 1] * 1.22 + sw * .9, 2.6], [b[i] * 1.22 + sw * .9, 2.6]], { fill: cols[i], stroke: null });
    for (let i = 1; i < 5; i++) line([[b[i] * .72, -5.6], [b[i] * 1.22 + sw * .9, 2.4]], { stroke: 'rgba(255,240,210,.75)', lw: .07, dash: [.28, .22], cap: 'butt' });
    shape([[-2.4, -1.2], [2.4, -1.2], [2.6, -.6], [-2.6, -.6]], { fill: 'rgba(60,20,40,.12)', stroke: null });   // soft belt shadow
  });
  X.restore();
  shape(pts, { stroke: JF.ink, lw });
  // bells on the hem points
  [0, 2, 4, 6, 8].forEach((i, k) => jfBell(hem[i][0], hem[i][1] + .4, .36, lw, sw * .8 + wob(t, 2.1, k * .3) * .15));
  // ruffled collar
  const col = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10, r = i % 2 ? 1.0 : 1.25; col.push([-Math.cos(a) * 1.6 * r, -5.35 + Math.sin(a) * .75 * r]); }
  shape([...col, [1.3, -5.7], [-1.3, -5.7]], { fill: JF.crimson, stroke: JF.ink, lw, smooth: .5 });
  line(col.slice(2, 9).map(([x, y]) => [x * .8, y - .08]), { stroke: JF.gold, lw: .12, dash: [.2, .2], smooth: true });
}

function jfHead(o, t, lw, A) {
  const turn = o.turn || 0, tx = turn * .75;
  // ears
  [-1, 1].forEach(sd => {
    const ex = sd * 2.9 - turn * .35;
    shape(ellPts(ex, .2, .6, .8, 14), { fill: JF.skin, stroke: JF.ink, lw, smooth: true });
    line([[ex - sd * .05, -.2], [ex + sd * .2, .15], [ex, .5]], { stroke: JF.skinDk, lw: lw * .8, smooth: true });
  });
  // head
  shape([[0, -3.1], [2.2, -2.5], [3.0, -.6], [2.8, 1.3], [1.7, 2.75], [0, 3.2], [-1.7, 2.75], [-2.8, 1.3], [-3.0, -.6], [-2.2, -2.5]],
    { fill: JF.skin, stroke: JF.ink, lw, smooth: true });
  // side hair tufts
  [-1, 1].forEach(sd => shape([[sd * 2.3, -2.2], [sd * 3.35, -1.95], [sd * 2.95, -1.45], [sd * 3.5, -1.05], [sd * 2.85, -.75], [sd * 3.1, -.3], [sd * 2.55, -.55], [sd * 2.4, -1.6]].map(([x, y]) => [x - turn * .3, y]),
    { fill: JF.hair, stroke: JF.ink, lw, smooth: .35 }));
  // cheeks
  if (o.blush !== false) [-1, 1].forEach(sd => ellipse(sd * 1.95 + tx * .6, .95, .62, .38, { fill: rgba(JF.cheek, .55), stroke: null }));
  // eyes + brows
  const eyeX = [-1.15 + tx, 1.15 + tx];
  eyeX.forEach((ex, i) => jfEye(ex, -.3, o, i === 0, lw, t, 1 - Math.abs(turn) * (turn * (i ? -1 : 1) > 0 ? .25 : 0)));
  jfBrows(eyeX, o, lw);
  // nose
  ellipse(.05 + tx * 1.15, .6, .62, .52, { fill: JF.nose, stroke: JF.ink, lw });
  circle(-.12 + tx * 1.15, .42, .16, { fill: 'rgba(255,255,255,.7)', stroke: null });
  // mouth
  jfMouth(o.mouth || 'smile', tx, lw);
  A.mouth = toPx(tx, 1.7); A.head = toPx(0, 0);
  // fringe under the headband
  shape([[-2.55, -1.95], [-2.2, -1.3], [-1.75, -1.85], [-1.1, -1.1], [-.6, -1.8], [.05, -1.15], [.55, -1.8], [1.15, -1.2], [1.65, -1.85], [2.15, -1.35], [2.55, -1.95], [2.4, -2.4], [-2.4, -2.4]].map(([x, y]) => [x + tx * .4, y]),
    { fill: JF.hair, stroke: JF.ink, lw, smooth: .25 });
  // hat
  X.save(); X.translate(0, -2.4 - (o.hatLift || 0) + (o.hatDrop || 0)); X.rotate(o.hatAskew || 0);
  jfHat(o, t, lw, A);
  X.restore();
  if (o.stars > .02) jfStars(o.stars, t, lw);
  A.top = toPx(0, -4);
}

function jfEye(cx, cy, o, isLeft, lw, t, narrow) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = isLeft ? 'open' : 'happy';
  const rx = .8 * narrow, ry = 1.02;
  if (kind === 'happy') return line([[cx - .62, cy + .3], [cx, cy - .38], [cx + .62, cy + .3]], { stroke: JF.ink, lw: lw * 1.7, smooth: true });
  if (kind === 'closed') return line([[cx - .62, cy], [cx, cy + .35], [cx + .62, cy]], { stroke: JF.ink, lw: lw * 1.7, smooth: true });
  if (kind === 'squeeze') { const d = isLeft ? 1 : -1; return line([[cx - d * .55, cy - .45], [cx + d * .4, cy], [cx - d * .55, cy + .45]], { stroke: JF.ink, lw: lw * 1.7 }); }
  const R = kind === 'wide' ? 1.15 : 1;
  ellipse(cx, cy, rx * R, ry * R, { fill: JF.eyeW, stroke: JF.ink, lw });
  if (kind === 'x') { line([[cx - .45, cy - .5], [cx + .45, cy + .5]], { stroke: JF.ink, lw: lw * 1.6 }); line([[cx + .45, cy - .5], [cx - .45, cy + .5]], { stroke: JF.ink, lw: lw * 1.6 }); return; }
  if (kind === 'swirl') {
    const sp = []; for (let i = 0; i <= 26; i++) { const a = i * .55 + t * 9 * (isLeft ? 1 : -1), r = .08 + i * .026; sp.push([cx + Math.cos(a) * r * narrow, cy + Math.sin(a) * r * 1.2]); }
    return line(sp, { stroke: JF.ink, lw: lw * 1.1, smooth: true });
  }
  if (kind === 'star') { shape(starPts(cx, cy, .62, .45, 5), { fill: JF.gold, stroke: JF.ink, lw }); return; }
  const lx = clamp(o.lookX || 0, -1, 1), ly = clamp(o.lookY || 0, -1, 1), ir = kind === 'wide' ? .36 : .5;
  const ix = cx + lx * .32 * narrow, iy = cy + ly * .42;
  withBoil(0, () => {
    circle(ix, iy, ir, { fill: JF.iris, stroke: null });
    circle(ix, iy, ir * .55, { fill: JF.ink, stroke: null });
    circle(ix - ir * .38, iy - ir * .42, ir * .3, { fill: '#FFFFFF', stroke: null });
  });
  // eyelid (blink): auto-blinks every ~3.4 s unless o.blink is given
  const ph = (t + 1.3 + (o.blinkSeed || 0)) % 3.4, b = o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0);
  if (b > .02) {
    X.save(); X.beginPath(); X.ellipse(cx, cy, rx * R + .02, ry * R + .02, 0, 0, TAU); X.clip();
    withBoil(0, () => shape(rectPts(cx - 1.2, cy - 1.3, 2.4, 2.5 * b), { fill: JF.skin, stroke: null }));
    X.restore();
    line([[cx - rx * R, cy - ry * R + 2 * ry * R * b], [cx, cy - ry * R + 2 * ry * R * b + .12], [cx + rx * R, cy - ry * R + 2 * ry * R * b]], { stroke: JF.ink, lw: lw * 1.2, smooth: true });
  }
}

function jfBrows(eyeX, o, lw) {
  const kind = o.brows || 'normal', up = kind === 'up' ? .35 : 0;
  eyeX.forEach((ex, i) => {
    const sd = i ? 1 : -1, inner = kind === 'worried' ? -.35 : kind === 'angry' ? .35 : 0, y = -1.62 - up;
    line([[ex - sd * .6, y + inner], [ex, y - .18 + inner * .4], [ex + sd * .65, y + .05]], { stroke: JF.brow, lw: lw * 1.8, smooth: true });
  });
}

function jfMouth(kind, tx, lw) {
  X.save(); X.translate(tx, 0);
  const dark = { fill: JF.mouth, stroke: JF.ink, lw };
  if (kind === 'smile') {
    line([[-1.3, 1.05], [-.7, 1.62], [0, 1.82], [.7, 1.62], [1.3, 1.05]], { stroke: JF.ink, lw: lw * 1.5, smooth: true });
    line([[-1.45, .95], [-1.2, 1.2]], { stroke: JF.ink, lw }); line([[1.45, .95], [1.2, 1.2]], { stroke: JF.ink, lw });
  } else if (kind === 'grin' || kind === 'open') {
    const pts = kind === 'grin' ? [[-1.4, 1.1], [0, 1.28], [1.4, 1.1], [.95, 2.15], [0, 2.5], [-.95, 2.15]] : [[-.7, 1.25], [0, 1.15], [.7, 1.25], [.72, 2.0], [0, 2.55], [-.72, 2.0]];
    X.save(); tracePath(pts, true, .8); X.fillStyle = JF.mouth; X.fill(); X.clip();
    withBoil(0, () => {
      if (kind === 'grin') shape(rectPts(-1.6, .9, 3.2, .55), { fill: '#FFFDF7', stroke: null });
      ellipse(0, 2.45, .75, .45, { fill: JF.tongue, stroke: null });
    });
    X.restore();
    shape(pts, { stroke: JF.ink, lw, smooth: .8 });
  } else if (kind === 'o') ellipse(0, 1.75, .32, .4, dark);
  else if (kind === 'O') ellipse(0, 1.85, .55, .68, dark);
  else if (kind === 'flat') line([[-.75, 1.62], [.75, 1.62]], { stroke: JF.ink, lw: lw * 1.5 });
  else if (kind === 'frown') line([[-1.2, 2.0], [-.6, 1.55], [0, 1.45], [.6, 1.55], [1.2, 2.0]], { stroke: JF.ink, lw: lw * 1.5, smooth: true });
  else if (kind === 'smirk') line([[-1.0, 1.45], [0, 1.72], [1.15, 1.2]], { stroke: JF.ink, lw: lw * 1.5, smooth: true });
  else if (kind === 'wobble') line([[-1, 1.7], [-.6, 1.45], [-.2, 1.75], [.2, 1.45], [.6, 1.75], [1, 1.5]], { stroke: JF.ink, lw: lw * 1.4, smooth: true });
  else if (kind === 'teeth') {
    shape([[-1.1, 1.3], [1.1, 1.3], [1.0, 2.05], [-1.0, 2.05]], { fill: '#FFFDF7', stroke: JF.ink, lw, smooth: .3 });
    line([[-1.05, 1.67], [1.05, 1.67]], { stroke: JF.ink, lw: lw * .8 });
    [-.55, 0, .55].forEach(x => line([[x, 1.32], [x, 2.02]], { stroke: JF.ink, lw: lw * .7 }));
  }
  X.restore();
}

// Hat group origin: top of the head (headband centre). Tips can swing (hatSway) and idle-bob.
function jfHat(o, t, lw, A) {
  const sw = o.hatSway || [0, 0], dr = o.hatDroop || 0, droop = [[-1.6, 3.4], [2.6, 3.2], [1.6, 3.4]];
  const bob = i => [wob(t, .9, i * .31) * .2 * (1 - dr) + sw[0] * [1.1, .7, 1.1][i] + droop[i][0] * dr, wob(t, 1.2, i * .53) * .14 * (1 - dr) + sw[1] * [.8, 1, .8][i] + droop[i][1] * dr];
  const tip = (base, i) => { const d = bob(i); return [base[0] + d[0], base[1] + d[1]]; };
  const mid = (base, i, f = .5) => { const d = bob(i); return [base[0] + d[0] * f, base[1] + d[1] * f]; };
  const tL = tip([-5.5, -5.2], 0), tM = tip([.25, -6.9], 1), tR = tip([5.4, -5.0], 2);
  const lobes = [
    { pts: [[-3.1, -.2], mid([-4.5, -1.9], 0), tL, mid([-2.7, -3.9], 0), [-.5, -.6]], col: JF.plum, tipP: tL, pom: JF.pom[0], deco: 'diamond', dc: JF.gold, i: 0 },
    { pts: [[.5, -.6], mid([2.8, -3.8], 2), tR, mid([4.5, -1.8], 2), [3.1, -.2]], col: JF.gold, tipP: tR, pom: JF.pom[2], deco: 'diamond', dc: JF.plum, i: 2 },
    { pts: [[-1.2, -.5], mid([-1.35, -3.6], 1), tM, mid([1.45, -3.7], 1), [1.2, -.5]], col: JF.crimson, tipP: tM, pom: JF.pom[1], deco: 'zig', dc: JF.gold, i: 1 },
  ];
  for (const L of lobes) {
    shape(L.pts, { fill: L.col, stroke: JF.ink, lw, smooth: .9 });
    const c = polyAt([L.pts[0], L.pts[1], L.tipP], .5), c2 = polyAt([L.pts[4], L.pts[3], L.tipP], .5), m = mixPt(c, c2, .5);
    if (L.deco === 'diamond') shape([[m[0], m[1] - .55], [m[0] + .4, m[1]], [m[0], m[1] + .55], [m[0] - .4, m[1]]], { fill: L.dc, stroke: JF.ink, lw: lw * .7 });
    else line([[m[0] - .4, m[1] + 1.2], [m[0] + .35, m[1] + .6], [m[0] - .35, m[1]], [m[0] + .3, m[1] - .6], [m[0] - .25, m[1] - 1.2]], { stroke: L.dc, lw: lw * 1.1 });
  }
  // pompoms with bells
  for (const L of [lobes[0], lobes[1], lobes[2]]) {
    const [px, py] = L.tipP, fl = [];
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? .98 : 1.18; fl.push([px + Math.cos(a) * r, py + Math.sin(a) * r]); }
    shape(fl, { fill: L.pom, stroke: JF.ink, lw, smooth: .9 });
    for (let i = 0; i < 4; i++) { const a = i * 1.7 + .4; line([[px + Math.cos(a) * .35, py + Math.sin(a) * .35], [px + Math.cos(a) * .75, py + Math.sin(a) * .7]], { stroke: 'rgba(40,20,40,.35)', lw: lw * .8 }); }
    jfBell(px, py + .35, .4, lw, wob(t, 1.8, L.i * .4) * .25);
  }
  A.hatTipL = toPx(...tL); A.hatTip = toPx(tM[0], tM[1] - 1.1); A.hatTipR = toPx(...tR);
  // headband (over the lobe bases)
  const band = [[-3.15, .75], [-1.5, .5], [0, .45], [1.5, .5], [3.15, .75], [3.2, -.25], [1.5, -.55], [0, -.6], [-1.5, -.55], [-3.2, -.25]];
  shape(band, { fill: JF.crimson, stroke: JF.ink, lw, smooth: .5 });
  line([[-2.9, .25], [-1.5, 0], [0, -.05], [1.5, 0], [2.9, .25]], { stroke: JF.gold, lw: lw * .9, dash: [.3, .25], smooth: true });
}

function jfStars(k, t, lw) {
  for (let i = 0; i < 3; i++) {
    const a = t * 5 + i * TAU / 3, x = Math.cos(a) * 3.9, y = -3.4 + Math.sin(a) * .9;
    shape(starPts(x, y, .62 * k, .45, 5, a), { fill: JF.bell, stroke: JF.ink, lw });
  }
}

function jfHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  const ink = { stroke: JF.ink, lw: .36 + lw * 2 }, skin = { stroke: JF.skin, lw: .36 };
  // cuff
  shape(ellPts(-.05, 0, .32, .62, 12), { fill: JF.crimson, stroke: JF.ink, lw, smooth: true });
  if (pose === 'open' || pose === 'thumb') {
    const fingers = pose === 'open' ? [[-.5, .75], [-.17, .88], [.16, .84], [.48, .68], [-1.35, .6]] : [[-1.7, .8]];
    const tips = fingers.map(([a, l]) => [[.55, 0], [.55 + Math.cos(a) * (.35 + l), Math.sin(a) * (.35 + l)]]);
    withBoil(0, () => {
      tips.forEach(f => line(f, ink)); circle(.55, 0, .56, { stroke: JF.ink, lw: lw * 2 });
      tips.forEach(f => line(f, skin)); circle(.55, 0, .56, { fill: JF.skin, stroke: null });
      if (pose === 'thumb') shape(ellPts(.75, 0, .45, .42, 12), { fill: JF.skin, stroke: JF.ink, lw, smooth: true });
    });
  } else {        // cup / fist: a chunky mitten with finger creases
    shape([[.1, -.5], [.6, -.62], [1.05, -.42], [1.18, 0], [1.05, .45], [.55, .6], [.1, .45]], { fill: JF.skin, stroke: JF.ink, lw, smooth: .9 });
    [-.2, .1, .38].forEach(y => line([[.78, y], [1.08, y + .03]], { stroke: JF.skinDk, lw: lw * .8 }));
    shape(ellPts(.55, -.55, .3, .2, 10), { fill: JF.skin, stroke: JF.ink, lw: lw * .8, smooth: true });
  }
  X.restore();
}

function jfEmote(kind, A, s, k, t) {
  const [hx, hy] = A.head, x = hx + s * 4.2, y = hy - s * 6.2, pop = backOut(k);
  if (kind === 'sweat') {
    const [sx, sy] = [hx + s * 3.2, hy - s * 1.8 + (1 - k) * s];
    overlay(() => { X.save(); X.translate(sx, sy); X.scale(pop * s, pop * s); shape([[0, -.9], [.45, .1], [0, .5], [-.45, .1]], { fill: '#8FD3F0', stroke: JF.ink, lwPx: 3, smooth: .7 }); X.restore(); });
    return;
  }
  const txt = { '?': '?', '!': '!', '!?': '!?', music: '♪', heart: '♥' }[kind] ?? kind;
  const col = kind === 'heart' ? JF.cheek : kind === 'music' ? JF.pom[0] : JF.bell;
  overlay(() => {
    X.save(); X.translate(x, y + wob(t, 1.5) * s * .2); X.rotate(.12 + wob(t, 1.1) * .06); X.scale(pop, pop);
    const size = s * 3.4; X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.lineJoin = 'round'; X.lineWidth = size * .14; X.strokeStyle = JF.ink; X.strokeText(txt, 0, 0);
    X.fillStyle = col; X.fillText(txt, 0, 0); X.restore();
  });
}

// Registration for the studio's character browser (poses are also its model sheet).
// Each pose draws Fester standing at (x, y) with scale s at time t; juggling poses add their balls.
const jfJuggle = (n, tau, h) => (x, y, s, t) => {
  const c = cascade(t, { n, tau, h });
  jester(x, y, s, { handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup', lookY: -.8, lookX: c.balls.reduce((a, b) => (b.y < a.y ? b : a)).x / 4, mouth: 'grin', dy: .2 + .2 * Math.sin(c.s * Math.PI) ** 2 });
  c.balls.forEach(b => jugglerBall(x + b.x * s, y + b.y * s, BALL_R * s, b.col, b.rot));
};
CHARACTERS.jester_fester = {
  draw: jester, unit: JF_UNIT, palette: JF, size: [13, 28],
  poses: {
    'rest': (x, y, s, t) => jester(x, y, s, {}),
    'ta-da': (x, y, s, t) => jester(x, y, s, { handL: [-5.2, -15.5], handR: [5.2, -15.5], eyes: 'happy', mouth: 'grin', dy: .3 }),
    'juggle 3': jfJuggle(3, .34, 13),
    'juggle 5': jfJuggle(5, .26, 18),
    'talk': (x, y, s, t) => jester(x, y, s, { mouth: lipFlap(t, true), brows: 'up', handR: [4.6, -12], handL: [-3, -8.5], turn: .3 }),
    'laugh': (x, y, s, t) => { const k = Math.abs(Math.sin(t * 15)); jester(x, y, s, { handL: [-1.9, -10.6], handR: [1.9, -10.6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'squeeze', mouth: k > .5 ? 'grin' : 'open', dy: .5 * k, tilt: -.1 }); },
    'shrug': (x, y, s, t) => jester(x, y, s, { handL: [-4.4, -13.2], handR: [4.4, -13.2], brows: 'worried', mouth: 'smirk', tilt: .15, dy: -.2, emote: '?', emoteK: 1 }),
    'wink': (x, y, s, t) => jester(x, y, s, { eyes: 'wink', mouth: 'grin', handR: [3.6, -12.6], handPoseR: 'thumb' }),
    'surprised': (x, y, s, t) => jester(x, y, s, { eyes: 'wide', mouth: 'O', brows: 'up', hatLift: 1.2, lookY: -1, handL: [-4, -11], handR: [4, -11] }),
    'dizzy': (x, y, s, t) => jester(x, y, s, { eyes: 'swirl', mouth: 'wobble', stars: 1, hatAskew: .35, dy: .8, lean: .1 * wob(t, .7), tilt: .15 * wob(t, .5) }),
    'sad (fired)': (x, y, s, t) => jester(x, y, s, { mouth: 'frown', brows: 'worried', lookY: .7, hatDroop: 1, dy: .4, emote: 'sweat', emoteK: 1 }),
    'somersault': (x, y, s, t) => jester(x, y, s, { rot: t * 4, footL: [-1, -5], footR: [1, -5], handL: [-2.5, -14], handR: [2.5, -14], eyes: 'squeeze', mouth: 'grin', jump: 4 }),
  },
};
