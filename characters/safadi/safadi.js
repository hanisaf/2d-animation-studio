// characters/safadi/safadi.js: Professor Safadi, the professor with super explanatory powers (see reference.jpg, README.md).
//
// safadi(x, y, s, o) → anchors
//   (x, y) screen point on the floor between the feet · s = px per local unit. He is ~29.5 units tall (feet to hair top),
//   so in a perspective set use s = SAFADI_UNIT * P.k(Z) (he is ~177 world units tall).
//
// Local units: feet y = 0, y points DOWN (up is negative). Hips −8.0, shoulders −15.4, chin −17.0, head centre −23.0, hair top ≈ −29.5.
// A big bobble head (≈ 40% of his height) on a tan three-piece suit, white shirt, red tie, brown oxfords. Front view.
//
// Pose     dy (hip drop; + = crouch) · lean (torso, rad) · tilt (head, rad) · turn (head −1..1) · rot (whole body, about the belly)
//          jump (units off the floor) · sq (squash; negative stretches) · flip · breathe (default on)
// Limbs    handL / handR: [x, y] wrist targets in local units (L = screen-left) · footL / footR: ankle targets (rest [∓1.25, −0.8])
//          handPoseL / handPoseR: 'open' | 'palm' (spread, presenting) | 'point' (index finger) | 'fist' | 'thumb' | 'pointer'
//          pointerAng (screen angle of the pointer stick, rad; default up and outward) · pointerLen (units, default 7.5)
// Face     eyes: open | wide | happy | closed | wink | squeeze | narrow | glow · lookX / lookY (−1..1) · blink (0..1, auto if unset)
//          brows: normal | up | worried | angry | quizzical | focused · mouth: smile | grin | open | o | O | flat | frown | smirk | teeth | wobble
//          blush (0..1)
// Powers   power (0..1): the explanatory aura: golden-cyan glow, rays, glowing hands and a ring of chalk formulas orbiting him
//          bulb (0..1): an idea light bulb pops on above his head
// Extras   emote: '?' | '!' | 'sweat' | 'music' | 'heart' with emoteK (0..1 pop) · boil (px)
//
// Returns anchors in screen px: { head, mouth, top, eyeL, eyeR, chest, belly, handL, handR, pointerTip, bulb }
//
// Also: safadiBoard(x, y, w, k, t, { kind, title }): his floating holographic chalkboard (screen px; k 0..1 = appear + draw).
//   kind: 'graph' | 'steps' | 'atom' | 'bulb' | 'story' | 'plate' (healthy plate) | 'crash' (sugar spike vs steady veggies).
//   safadiWalk(p, k): walk-cycle pose options (p = steps travelled, k = stride amount).

const SF = {
  ink: '#3B2530', skin: '#F3C6A8', skinDk: '#D99D80', skinLt: '#FBDCC6', cheek: '#EE9A8E', lip: '#D88579',
  hair: '#2E221D', hairLt: '#4D3A30', brow: '#2A1D18', eyeW: '#FFFDF7', iris: '#6B3A1F',
  suit: '#D4B68C', suitDk: '#B7966B', suitLt: '#E4CDA7', shirt: '#F8F6F1', shirtDk: '#D9D4CB', tie: '#C3222F', tieDk: '#8E1621',
  shoe: '#6E3B22', shoeDk: '#4A2515', shoeLt: '#8C5436', button: '#3A2A22', mouth: '#6E1F2E', tongue: '#EE7F8C',
  glow: '#7FE3FF', glowGold: '#FFD66B', chalk: '#FFFDF4', board: '#23433A', boardDk: '#193029',
};
const SAFADI_UNIT = 6.0;    // world units per local unit
const SF_HIP = -8.0;
const SF_CHALK = '"Chalkboard SE", "Chalkduster", "Comic Sans MS", "Fredoka", sans-serif';

function safadi(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, pw = clamp(o.power || 0);
  const lw = clamp(s * .15, 1.6, 5.5) / s;
  X.save();
  X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  const air = o.jump || 0;
  if (!o.noShadow) { const f = 1 - clamp(air / 22) * .55; ellipse(0, .15, 4.2 * f, .8 * f, { fill: 'rgba(40,20,30,.28)', stroke: null }); }
  X.translate(0, -air);
  if (o.rot) { X.translate(0, -12); X.rotate(o.rot); X.translate(0, 12); }
  if (o.sq) X.scale(1 + o.sq * .55, 1 - o.sq);
  if (pw > .01) { sfAura(pw, t); sfGlyphs(pw, t, false); }

  withBoil(o.boil ?? .7, () => {
    const hipY = SF_HIP + (o.dy || 0), lean = o.lean || 0, cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];   // torso-local → body-local
    const br = o.breathe === false ? 0 : wob(t, .22) * .06;

    // ---- legs + shoes ----
    [[-1, o.footL || [-1.25, -.8]], [1, o.footR || [1.25, -.8]]].forEach(([sd, f]) => {
      const hp = tl(sd * 1.15, -.2), { joint, end } = ik2(hp, f, 3.75, 3.7, [sd * .15, .1]);
      sfLimb([hp, joint, end], 2.05, SF.suit, lw);
      line([[lerp(hp[0], joint[0], .1) + sd * .15, lerp(hp[1], joint[1], .1)], [joint[0] + sd * .12, joint[1]], [end[0] + sd * .1, end[1] - .6]], { stroke: SF.suitDk, lw: lw * .8 });
      sfShoe(end, sd, lw);
    });

    // ---- torso: jacket, shirt, tie, vest, lapels ----
    X.save(); X.translate(0, hipY); X.rotate(lean); X.scale(1 + br * .3, 1 + br);
    sfJacket(lw);
    A.chest = toPx(0, -6.5); A.belly = toPx(0, -2.5);
    shape(rectPts(-.75, -9.4, 1.5, 1.2), { fill: SF.skin, stroke: SF.ink, lw });          // neck

    // ---- head ----
    X.save(); X.translate(0, -8.9); X.rotate(o.tilt || 0); X.scale(1.1, 1.1); X.translate(0, -5.55);
    sfHead(o, t, lw, A);
    X.restore();
    X.restore();

    // ---- arms (in front of the body) ----
    [[-1, o.handL || [-4.4, -8.1], o.handPoseL || 'open'], [1, o.handR || [4.4, -8.1], o.handPoseR || 'open']].forEach(([sd, tg, pose]) => {
      const sh = tl(sd * 2.95, -7.2), { joint, end } = ik2(sh, tg, 3.75, 3.45, [sd * .25, 1]);
      sfLimb([sh, joint, end], 1.55, SF.suit, lw);
      line([[sh[0] - sd * .1, sh[1] + .5], [joint[0] - sd * .35, joint[1]]], { stroke: SF.suitDk, lw: lw * .8 });
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      if (pw > .01) circle(end[0] + Math.cos(ang) * .6, end[1] + Math.sin(ang) * .6, 2.2, { fill: radGrad(end[0] + Math.cos(ang) * .6, end[1] + Math.sin(ang) * .6, 0, 2.2, [[0, rgba(SF.glow, .55 * pw)], [1, rgba(SF.glow, 0)]]), stroke: null });
      const tip = sfHand(end, ang, sd, pose, lw, o, pw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang) * .6, end[1] + Math.sin(ang) * .6);
      if (tip) A.pointerTip = tip;
    });
  });
  if (pw > .01) sfGlyphs(pw, t, true);
  if ((o.bulb || 0) > .01) sfBulb(clamp(o.bulb), t, lw, A);
  A.top = toPx(0, -29.5);
  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .02) sfEmote(o.emote, A, s, o.emoteK ?? 1, t);
  return A;
}

// A limb as one stroked path: ink underlay, then colour. Points are jittered once so the layers stay aligned.
function sfLimb(pts, w, col, lw) {
  if (JIT) { const a = JIT / pxScale(); pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  withBoil(0, () => { line(pts, { stroke: SF.ink, lw: w + lw * 2 }); line(pts, { stroke: col, lw: w }); });
}

// Brown oxford seen from the front, toes turned slightly out.
function sfShoe(a, sd, lw) {
  X.save(); X.translate(a[0] + sd * .1, a[1]); X.scale(sd, 1);
  shape([[-1.0, .05], [-.95, -.55], [-.4, -.85], [.55, -.8], [1.1, -.35], [1.3, .35], [.95, .9], [-.1, .95], [-.85, .7]], { fill: SF.shoe, stroke: SF.ink, lw, smooth: .8 });
  shape([[-.55, -.75], [.45, -.72], [.55, -.05], [-.5, -.1]], { fill: SF.shoeDk, stroke: SF.ink, lw: lw * .7, smooth: .5 });
  [[-.2, -.55], [.2, -.55], [-.2, -.3], [.2, -.3]].forEach(([x, y]) => circle(x, y, .07, { fill: SF.shoeLt, stroke: null }));
  line([[-.2, -.55], [.2, -.3]], { stroke: SF.shoeLt, lw: lw * .6 }); line([[.2, -.55], [-.2, -.3]], { stroke: SF.shoeLt, lw: lw * .6 });
  ellipse(.55, .3, .3, .16, { fill: 'rgba(255,230,210,.35)', stroke: null, rot: -.3 });
  X.restore();
}

// Jacket, vest, shirt, tie and lapels in torso-local units (origin: hip centre).
function sfJacket(lw) {
  const body = [[-3.25, -7.75], [-3.4, -6.2], [-3.05, -3.2], [-2.95, -.9], [-3.05, .45], [-1.2, .6], [-.3, .45], [0, .05], [.3, .45], [1.2, .6], [3.05, .45], [2.95, -.9], [3.05, -3.2], [3.4, -6.2], [3.25, -7.75], [2.2, -8.3], [.85, -8.6], [-.85, -8.6], [-2.2, -8.3]];
  shape(body, { fill: SF.suit, stroke: SF.ink, lw, smooth: .35 });
  // side shading
  X.save(); tracePath(body, true, .35); X.clip();
  withBoil(0, () => [-1, 1].forEach(sd => shape([[sd * 3.6, -8], [sd * 2.6, -8], [sd * 2.3, .8], [sd * 3.6, .8]], { fill: rgba(SF.suitDk, .35), stroke: null })));
  X.restore();
  // the V: shirt, tie, vest
  const V = [[-.85, -8.6], [.85, -8.6], [0, -3.3]];
  shape(V, { fill: SF.shirt, stroke: null });
  shape([[-.32, -8.45], [.32, -8.45], [.22, -7.85], [-.22, -7.85]], { fill: SF.tie, stroke: SF.ink, lw: lw * .8 });
  shape([[-.22, -7.85], [.22, -7.85], [.45, -5.7], [0, -5.0], [-.45, -5.7]], { fill: SF.tie, stroke: SF.ink, lw: lw * .8 });
  line([[.05, -7.6], [.2, -5.8]], { stroke: SF.tieDk, lw: lw * .7 });
  shape([[-.55, -6.95], [-.24, -6.95], [0, -5.15], [.24, -6.95], [.55, -6.95], [0, -3.3]], { fill: SF.suitLt, stroke: SF.ink, lw: lw * .8 });
  circle(0, -4.45, .13, { fill: SF.button, stroke: null });
  // shirt collar points
  [-1, 1].forEach(sd => shape([[sd * .85, -8.62], [sd * .12, -8.5], [sd * .55, -7.85]], { fill: SF.shirt, stroke: SF.ink, lw: lw * .8 }));
  // notch lapels
  [-1, 1].forEach(sd => {
    shape([[sd * .88, -8.62], [sd * 1.4, -8.4], [sd * 1.5, -7.6], [sd * 1.25, -7.45], [sd * 2.05, -7.2], [sd * 1.3, -5.0], [sd * .15, -3.25], [0, -3.3]],
      { fill: SF.suitLt, stroke: SF.ink, lw });
  });
  circle(.12, -3.2, .22, { fill: SF.button, stroke: SF.ink, lw: lw * .6 });
  // pocket flaps + breast welt
  [-1, 1].forEach(sd => shape(rectPts(sd * 1.95 - .8, -1.95, 1.6, .5), { fill: SF.suit, stroke: SF.ink, lw: lw * .8 }));
  line([[1.55, -5.75], [2.45, -5.95]], { stroke: SF.ink, lw: lw * .9 });
}

function sfHead(o, t, lw, A) {
  const turn = o.turn || 0, tx = turn * .8;
  // ears
  [-1, 1].forEach(sd => {
    const ex = sd * 3.9 - turn * .45;
    shape(ellPts(ex, .7, .55, .95, 14), { fill: SF.skin, stroke: SF.ink, lw, smooth: true });
    line([[ex - sd * .05, .2], [ex + sd * .2, .7], [ex, 1.2]], { stroke: SF.skinDk, lw: lw * .8, smooth: true });
  });
  // face
  const face = [[0, -5.0], [2.8, -4.4], [3.8, -2.2], [3.95, .4], [3.7, 2.6], [2.9, 4.4], [1.5, 5.25], [0, 5.45], [-1.5, 5.25], [-2.9, 4.4], [-3.7, 2.6], [-3.95, .4], [-3.8, -2.2], [-2.8, -4.4]];
  shape(face, { fill: SF.skin, stroke: SF.ink, lw, smooth: true });
  X.save(); tracePath(face, true, true); X.clip();
  withBoil(0, () => {
    ellipse(0, 4.6, 3.2, 1.3, { fill: rgba(SF.skinDk, .22), stroke: null });          // jaw shade
    ellipse(-1.2 + tx * .4, -2.4, 1.6, .8, { fill: rgba(SF.skinLt, .5), stroke: null });  // forehead light
  });
  X.restore();
  // hair: side part on screen-left, a flick over the forehead on the right, short sideburns
  const hair = [[-3.95, .45], [-4.1, -1.6], [-3.8, -3.6], [-2.75, -5.15], [-1.0, -5.85], [.8, -5.9], [2.55, -5.45], [3.65, -4.3], [4.1, -2.4], [3.98, .45], [3.62, .4], [3.45, -1.8], [3.0, -2.85], [2.35, -3.0], [2.05, -2.6], [1.8, -3.15], [.9, -3.3], [-.3, -3.2], [-1.6, -3.25], [-2.8, -2.95], [-3.4, -1.8], [-3.62, .4]]
    .map(([x, y]) => [x - turn * .35, y]);
  shape(hair, { fill: SF.hair, stroke: SF.ink, lw, smooth: .45 });
  withBoil(0, () => {
    line([[-1.9, -5.25], [-.2, -5.5], [1.6, -5.2]].map(([x, y]) => [x - turn * .35, y]), { stroke: SF.hairLt, lw: lw * 1.6, smooth: true });
    line([[-2.1, -4.55], [-2.35, -3.6]].map(([x, y]) => [x - turn * .35, y]), { stroke: SF.hairLt, lw: lw * 1.1 });   // the part
  });
  // cheeks
  const bl = o.blush ?? .35;
  if (bl > .01) [-1, 1].forEach(sd => ellipse(sd * 2.5 + tx * .5, 2.2, .75, .42, { fill: rgba(SF.cheek, .5 * bl), stroke: null }));
  // eyes + brows
  const eyeX = [-1.6 + tx, 1.6 + tx];
  eyeX.forEach((ex, i) => sfEye(ex, .05, o, i === 0, lw, t, 1 - Math.abs(turn) * (turn * (i ? -1 : 1) > 0 ? .25 : 0)));
  A.eyeL = toPx(eyeX[0], .05); A.eyeR = toPx(eyeX[1], .05);
  sfBrows(eyeX, o, lw);
  // nose: a broad soft bulb with nostril wings
  X.save(); X.translate(tx * 1.1, 0);
  ellipse(0, 1.75, .78, .62, { fill: SF.skin, stroke: null });
  line([[-.95, 1.65], [-1.0, 2.05], [-.65, 2.3], [-.3, 2.2]], { stroke: SF.ink, lw, smooth: true });
  line([[.95, 1.65], [1.0, 2.05], [.65, 2.3], [.3, 2.2]], { stroke: SF.ink, lw, smooth: true });
  line([[-.3, 2.38], [0, 2.46], [.3, 2.38]], { stroke: SF.skinDk, lw, smooth: true });
  line([[.25, .1], [.38, 1.0]], { stroke: rgba(SF.skinDk, .8), lw: lw * .9 });
  circle(-.15, 1.45, .2, { fill: rgba(SF.skinLt, .8), stroke: null });
  X.restore();
  // mouth
  sfMouth(o.mouth || 'smile', tx, lw);
  A.mouth = toPx(tx, 3.3); A.head = toPx(0, 0);
}

function sfEye(cx, cy, o, isLeft, lw, t, narrow) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = isLeft ? 'open' : 'happy';
  const rx = .74 * narrow, ry = .5;
  if (kind === 'happy') return line([[cx - .7, cy + .25], [cx, cy - .35], [cx + .7, cy + .25]], { stroke: SF.ink, lw: lw * 1.8, smooth: true });
  if (kind === 'closed') return line([[cx - .7, cy], [cx, cy + .3], [cx + .7, cy]], { stroke: SF.ink, lw: lw * 1.8, smooth: true });
  if (kind === 'squeeze') { const d = isLeft ? 1 : -1; return line([[cx - d * .6, cy - .42], [cx + d * .42, cy], [cx - d * .6, cy + .42]], { stroke: SF.ink, lw: lw * 1.8 }); }
  const R = kind === 'wide' ? 1.25 : 1, glow = kind === 'glow';
  const alm = [[cx - rx * R, cy + .05], [cx - rx * .4 * R, cy - ry * R], [cx + rx * .45 * R, cy - ry * R * 1.02], [cx + rx * R, cy], [cx + rx * .4 * R, cy + ry * .8 * R], [cx - rx * .45 * R, cy + ry * .8 * R]];
  shape(alm, { fill: glow ? '#E9FBFF' : SF.eyeW, stroke: SF.ink, lw, smooth: .8 });
  const lx = clamp(o.lookX || 0, -1, 1), ly = clamp(o.lookY || 0, -1, 1), ir = kind === 'wide' ? .3 : .36;
  const ix = cx + lx * .34 * narrow, iy = cy + ly * .18;
  X.save(); tracePath(alm, true, .8); X.clip();
  withBoil(0, () => {
    if (glow) { circle(ix, iy, ir * 1.1, { fill: SF.glow, stroke: null }); circle(ix, iy, ir * .5, { fill: '#FFFFFF', stroke: null }); }
    else {
      circle(ix, iy, ir, { fill: SF.iris, stroke: null });
      circle(ix, iy, ir * .52, { fill: SF.ink, stroke: null });
      circle(ix - ir * .38, iy - ir * .4, ir * .28, { fill: '#FFFFFF', stroke: null });
    }
    // eyelid: auto-blink every ~3.9 s unless o.blink is given; 'narrow' = half-lidded
    const ph = (t + .6 + (o.blinkSeed || 0)) % 3.9, b = Math.max(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0), kind === 'narrow' ? .45 : 0);
    if (b > .02) shape(rectPts(cx - 1.2, cy - 1.2, 2.4, .7 + 1.1 * b), { fill: SF.skin, stroke: null });
    if (b > .02) line([[cx - rx * R, cy - .5 + b], [cx + rx * R, cy - .5 + b]], { stroke: SF.ink, lw: lw * 1.3 });
  });
  X.restore();
  line([[cx - rx * R - .05, cy + .02], [cx - rx * .4 * R, cy - ry * R - .04], [cx + rx * .45 * R, cy - ry * R - .05], [cx + rx * R + .05, cy - .02]], { stroke: SF.ink, lw: lw * 1.6, smooth: .8 });
  if (glow) circle(cx, cy, 1.1, { fill: radGrad(cx, cy, 0, 1.1, [[0, rgba(SF.glow, .5)], [1, rgba(SF.glow, 0)]]), stroke: null });
}

// Thick dark tapered brows. quizzical = one up (screen-right), one level; focused = low and flat.
function sfBrows(eyeX, o, lw) {
  const kind = o.brows || 'normal';
  eyeX.forEach((ex, i) => {
    const sd = i ? 1 : -1;
    let up = kind === 'up' ? .4 : kind === 'focused' ? -.18 : 0, inner = kind === 'worried' ? -.4 : kind === 'angry' ? .38 : 0;
    if (kind === 'quizzical') { up = i ? .55 : -.05; inner = i ? -.1 : .15; }
    const y = -1.05 - up, a = [ex - sd * .75, y + inner], m = [ex + sd * .1, y - .28 + inner * .35], b = [ex + sd * .95, y + .12];
    shape([a, m, b, [b[0] - sd * .05, b[1] + .12], [m[0], m[1] + .36], [a[0], a[1] + .38]], { fill: SF.brow, stroke: SF.ink, lw: lw * .6, smooth: .6 });
  });
}

function sfMouth(kind, tx, lw) {
  X.save(); X.translate(tx, 1.35);
  const dark = { fill: SF.mouth, stroke: SF.ink, lw };
  if (kind === 'smile') {
    ellipse(0, 2.1, .75, .2, { fill: rgba(SF.lip, .45), stroke: null });
    line([[-1.5, 1.55], [-.75, 1.85], [0, 1.92], [.75, 1.85], [1.5, 1.55]], { stroke: SF.ink, lw: lw * 1.4, smooth: true });
  } else if (kind === 'grin' || kind === 'open') {
    const pts = kind === 'grin' ? [[-1.55, 1.5], [0, 1.65], [1.55, 1.5], [1.05, 2.5], [0, 2.8], [-1.05, 2.5]] : [[-.8, 1.55], [0, 1.45], [.8, 1.55], [.8, 2.3], [0, 2.85], [-.8, 2.3]];
    X.save(); tracePath(pts, true, .8); X.fillStyle = SF.mouth; X.fill(); X.clip();
    withBoil(0, () => {
      shape(rectPts(-1.7, 1.3, 3.4, kind === 'grin' ? .55 : .4), { fill: '#FFFDF7', stroke: null });
      ellipse(0, 2.8, .8, .45, { fill: SF.tongue, stroke: null });
    });
    X.restore();
    shape(pts, { stroke: SF.ink, lw, smooth: .8 });
  } else if (kind === 'o') ellipse(0, 2.0, .35, .42, dark);
  else if (kind === 'O') ellipse(0, 2.15, .62, .78, dark);
  else if (kind === 'flat') line([[-.9, 1.85], [.9, 1.85]], { stroke: SF.ink, lw: lw * 1.5 });
  else if (kind === 'frown') line([[-1.3, 2.25], [-.65, 1.8], [0, 1.7], [.65, 1.8], [1.3, 2.25]], { stroke: SF.ink, lw: lw * 1.5, smooth: true });
  else if (kind === 'smirk') line([[-1.1, 1.85], [0, 1.95], [1.25, 1.45]], { stroke: SF.ink, lw: lw * 1.5, smooth: true });
  else if (kind === 'wobble') line([[-1.1, 1.95], [-.65, 1.7], [-.2, 2.0], [.2, 1.7], [.65, 2.0], [1.1, 1.75]], { stroke: SF.ink, lw: lw * 1.4, smooth: true });
  else if (kind === 'teeth') {
    shape([[-1.2, 1.5], [1.2, 1.5], [1.1, 2.3], [-1.1, 2.3]], { fill: '#FFFDF7', stroke: SF.ink, lw, smooth: .3 });
    line([[-1.15, 1.9], [1.15, 1.9]], { stroke: SF.ink, lw: lw * .8 });
    [-.6, 0, .6].forEach(x => line([[x, 1.52], [x, 2.28]], { stroke: SF.ink, lw: lw * .7 }));
  }
  X.restore();
}

// Hand at wrist p, pointing along ang. Returns the pointer tip (screen px) when holding the pointer.
function sfHand(p, ang, sd, pose, lw, o, pw) {
  let tip = null;
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  const ink = { stroke: SF.ink, lw: .38 + lw * 2 }, skin = { stroke: SF.skin, lw: .38 };
  shape(ellPts(-.05, 0, .3, .66, 12), { fill: SF.shirt, stroke: SF.ink, lw, smooth: true });            // shirt cuff
  if (pose === 'open' || pose === 'palm' || pose === 'thumb' || pose === 'point') {
    const f = pose === 'open' ? [[-.25, .8], [-.05, .9], [.15, .86], [.35, .74], [-1.1, .55]]
      : pose === 'palm' ? [[-.6, .8], [-.22, .92], [.14, .88], [.5, .72], [-1.45, .62]]
      : pose === 'thumb' ? [[-1.7, .85]] : [[0, 1.25]];
    const fingers = f.map(([a, l]) => [[.6, 0], [.6 + Math.cos(a) * (.38 + l), Math.sin(a) * (.38 + l)]]);
    withBoil(0, () => {
      fingers.forEach(g => line(g, ink)); circle(.6, 0, .6, { stroke: SF.ink, lw: lw * 2 });
      fingers.forEach(g => line(g, skin)); circle(.6, 0, .6, { fill: SF.skin, stroke: null });
      if (pose === 'thumb' || pose === 'point') shape(ellPts(.85, .12, .5, .45, 12), { fill: SF.skin, stroke: SF.ink, lw, smooth: true });
    });
  } else {        // fist / pointer: a chunky mitten with finger creases
    shape([[.1, -.55], [.65, -.66], [1.12, -.45], [1.25, 0], [1.12, .48], [.6, .64], [.1, .5]], { fill: SF.skin, stroke: SF.ink, lw, smooth: .9 });
    [-.2, .1, .38].forEach(y => line([[.84, y], [1.15, y + .03]], { stroke: SF.skinDk, lw: lw * .8 }));
    if (pose === 'pointer') {
      X.restore(); X.save(); X.translate(p[0], p[1]);                                    // the stick, in body space
      const a = o.pointerAng ?? (sd > 0 ? -1.05 : -Math.PI + 1.05), L = o.pointerLen ?? 7.5, c = [Math.cos(ang) * .7, Math.sin(ang) * .7];
      const e = [c[0] + Math.cos(a) * L, c[1] + Math.sin(a) * L], b0 = [c[0] - Math.cos(a) * .9, c[1] - Math.sin(a) * .9];
      withBoil(0, () => {
        line([b0, e], { stroke: SF.ink, lw: .34 + lw * 2 }); line([b0, mixPt(b0, e, .45)], { stroke: '#5B3A2A', lw: .34 }); line([mixPt(b0, e, .45), e], { stroke: '#C9CED3', lw: .22 });
        if (pw > .01) circle(e[0], e[1], 1.3, { fill: radGrad(e[0], e[1], 0, 1.3, [[0, rgba(SF.glow, .8 * pw)], [1, rgba(SF.glow, 0)]]), stroke: null });
        circle(e[0], e[1], .28, { fill: SF.tie, stroke: SF.ink, lw });
      });
      tip = toPx(e[0], e[1]);
      shape(ellPts(c[0], c[1], .62, .6, 12), { fill: SF.skin, stroke: SF.ink, lw, smooth: true });     // fingers wrapped over it
    }
  }
  X.restore();
  return tip;
}

// ---------- the explanatory powers ----------
function sfAura(k, t) {
  X.save();
  circle(0, -15, 15, { fill: radGrad(0, -15, 2, 15, [[0, rgba(SF.glowGold, .45 * k)], [.5, rgba(SF.glow, .22 * k)], [1, rgba(SF.glow, 0)]]), stroke: null });
  X.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .25, w = .09;
    shape([[0, -15], [Math.cos(a - w) * 13, -15 + Math.sin(a - w) * 13], [Math.cos(a + w) * 13, -15 + Math.sin(a + w) * 13]], { fill: rgba(SF.glowGold, .045 * k), stroke: null });
  }
  X.restore();
}
const SF_GLYPHS = ['E=mc²', 'π', '∑', '√x', 'a²+b²', '?→!', '∫', 'Δ', '1+1=2', '∞'];
function sfGlyphs(k, t, front) {
  const m = X.getTransform(), sc = pxScale();
  for (let i = 0; i < SF_GLYPHS.length; i++) {
    const a = t * .8 + i / SF_GLYPHS.length * TAU, depth = Math.sin(a);
    if ((depth > 0) !== front) continue;
    const lx = Math.cos(a) * 8.6, ly = -14.5 + depth * 1.6 + Math.sin(a * 2 + i) * .9 - (i % 3) * 2.2;
    const px = m.a * lx + m.c * ly + m.e, py = m.b * lx + m.d * ly + m.f, size = sc * (1.25 + .35 * depth) * (.6 + .4 * k);
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    X.globalAlpha = k * (front ? .95 : .55); X.font = `700 ${size}px ${SF_CHALK}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.shadowColor = SF.glow; X.shadowBlur = size * .45; X.fillStyle = SF.chalk; X.fillText(SF_GLYPHS[i], px, py);
    X.restore();
  }
}
function sfBulb(k, t, lw, A) {
  const p = backOut(k), cx = 0, cy = -33.2;
  X.save(); X.translate(cx, cy); X.scale(p, p);
  X.save(); X.globalCompositeOperation = 'lighter';
  circle(0, 0, 3.4, { fill: radGrad(0, 0, .5, 3.4, [[0, 'rgba(255,230,120,.55)'], [1, 'rgba(255,230,120,0)']]), stroke: null });
  X.restore();
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .42, r0 = 1.9, r1 = 2.6 + .25 * wob(t, 2, i * .2); line([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], { stroke: '#F2B634', lw: lw * 1.6 }); }
  shape([[-.55, .95], [-1.25, 0], [-1.3, -.8], [-.7, -1.45], [0, -1.6], [.7, -1.45], [1.3, -.8], [1.25, 0], [.55, .95]], { fill: '#FFE68A', stroke: SF.ink, lw, smooth: .85 });
  line([[-.3, .9], [-.35, -.2], [0, -.55], [.35, -.2], [.3, .9]], { stroke: '#E0A020', lw: lw * .9, smooth: true });
  circle(-.55, -.75, .25, { fill: '#FFFFFF', stroke: null });
  shape(rectPts(-.6, .95, 1.2, .75), { fill: '#AEB5BA', stroke: SF.ink, lw });
  [1.2, 1.45].forEach(y => line([[-.6, y], [.6, y]], { stroke: SF.ink, lw: lw * .7 }));
  shape([[-.3, 1.7], [.3, 1.7], [0, 2.05]], { fill: '#6E767B', stroke: SF.ink, lw: lw * .7 });
  X.restore();
  A.bulb = toPx(cx, cy);
}

function sfEmote(kind, A, s, k, t) {
  const [hx, hy] = A.head, x = hx + s * 5.2, y = hy - s * 6.4, pop = backOut(k);
  if (kind === 'sweat') {
    const [sx, sy] = [hx + s * 4.2, hy - s * 2.2 + (1 - k) * s];
    overlay(() => { X.save(); X.translate(sx, sy); X.scale(pop * s, pop * s); shape([[0, -.9], [.45, .1], [0, .5], [-.45, .1]], { fill: '#8FD3F0', stroke: SF.ink, lwPx: 3, smooth: .7 }); X.restore(); });
    return;
  }
  const txt = { '?': '?', '!': '!', '!?': '!?', music: '♪', heart: '♥' }[kind] ?? kind;
  const col = kind === 'heart' ? SF.cheek : kind === 'music' ? PAL.blue : PAL.goldLt;
  overlay(() => {
    X.save(); X.translate(x, y + wob(t, 1.5) * s * .2); X.rotate(.12 + wob(t, 1.1) * .06); X.scale(pop, pop);
    const size = s * 3.6; X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.lineJoin = 'round'; X.lineWidth = size * .14; X.strokeStyle = SF.ink; X.strokeText(txt, 0, 0);
    X.fillStyle = col; X.fillText(txt, 0, 0); X.restore();
  });
}

// His floating holographic chalkboard: screen px centre (x, y), width w. k 0..1: pops in (0–.2), then the drawing
// chalks itself on (.2–1). o: { kind: 'graph' | 'steps' | 'atom' | 'bulb' | 'story', title }
function safadiBoard(x, y, w, k, t, o = {}) {
  if (k <= 0) return;
  const h = w * .62, pop = backOut(seg(k, 0, .2)), d = seg(k, .2, 1), kind = o.kind || 'graph';
  X.save(); X.translate(x, y + wob(t, .35) * w * .01); X.scale(pop, pop); X.translate(-w / 2, -h / 2);
  X.save(); X.shadowColor = SF.glow; X.shadowBlur = w * .06;
  shape([[0, 0], [w, 0], [w, h], [0, h]], { fill: linGrad(0, 0, 0, h, [[0, SF.board], [1, SF.boardDk]]), stroke: SF.glow, lwPx: Math.max(2, w * .012) });
  X.restore();
  shape([[w * .03, h * .05], [w * .97, h * .05], [w * .97, h * .95], [w * .03, h * .95]], { fill: null, stroke: rgba(SF.glow, .35), lwPx: 1.5 });
  const U = w / 100, ch = { stroke: SF.chalk, lwPx: Math.max(2, U * .9) }, part = (pts, a, b) => { const f = seg(d, a, b); if (f > 0) line(f < 1 ? polySlice(pts, 0, f) : pts, ch); };
  X.save(); X.shadowColor = SF.glow; X.shadowBlur = U * 1.2;
  const label = (txt, lx, ly, size, a) => { if (d < a) return; X.globalAlpha = seg(d, a, a + .12); X.font = `700 ${size * U}px ${SF_CHALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = SF.chalk; X.fillText(txt, lx * U, ly * U); X.globalAlpha = 1; };
  if (o.title) label(o.title, 50, 9, 7, 0);
  const top = o.title ? 17 : 8;
  if (kind === 'graph') {
    part([[12 * U, top * U], [12 * U, 56 * U], [90 * U, 56 * U]], 0, .3);
    const c = []; for (let i = 0; i <= 30; i++) { const u = i / 30; c.push([(14 + u * 72) * U, (52 - 34 * u * u - 4 * Math.sin(u * 9) * (1 - u)) * U]); } part(c, .3, .85);
    if (d > .85) circle(86 * U, 18 * U, 2 * U * backOut(seg(d, .85, 1)), { fill: SF.glowGold, stroke: SF.chalk, lwPx: 1.5 });
  } else if (kind === 'steps') {
    [0, 1, 2].forEach(i => {
      const bx = (8 + i * 32) * U, a = i * .3;
      part([[bx, (top + 14) * U], [bx + 22 * U, (top + 14) * U], [bx + 22 * U, (top + 34) * U], [bx, (top + 34) * U], [bx, (top + 14) * U]], a, a + .15);
      label(String(i + 1), 19 + i * 32, top + 24, 11, a + .12);
      if (i < 2) part([[bx + 24 * U, (top + 24) * U], [bx + 30 * U, (top + 24) * U], [bx + 27 * U, (top + 21) * U], [bx + 30 * U, (top + 24) * U], [bx + 27 * U, (top + 27) * U]], a + .15, a + .3);
    });
  } else if (kind === 'atom') {
    const cx = 50 * U, cy = (top + 24) * U;
    [0, 1, 2].forEach(i => { const e = ellPts(cx, cy, 30 * U, 9 * U, 40, i * Math.PI / 3); part([...e, e[0]], i * .22, i * .22 + .3); });
    if (d > .3) circle(cx, cy, 4 * U, { fill: SF.glowGold, stroke: SF.chalk, lwPx: 1.5 });
    if (d > .8) [0, 1, 2].forEach(i => { const a = t * 3 + i * 2.1, r = i * Math.PI / 3, ex = Math.cos(a) * 30 * U, ey = Math.sin(a) * 9 * U; circle(cx + ex * Math.cos(r) - ey * Math.sin(r), cy + ex * Math.sin(r) + ey * Math.cos(r), 1.8 * U, { fill: SF.glow, stroke: null }); });
  } else if (kind === 'bulb') {
    const cx = 50 * U, cy = (top + 20) * U, R = 15 * U, b = []; for (let i = 0; i <= 30; i++) { const a = Math.PI * .75 + i / 30 * Math.PI * 1.5; b.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
    part([[cx - 7 * U, cy + 20 * U], ...b, [cx + 7 * U, cy + 20 * U], [cx - 7 * U, cy + 20 * U]], 0, .5);
    part([[cx - 6 * U, cy + 24 * U], [cx + 6 * U, cy + 24 * U]], .5, .6);
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .45; part([[cx + Math.cos(a) * 20 * U, cy + Math.sin(a) * 20 * U], [cx + Math.cos(a) * 27 * U, cy + Math.sin(a) * 27 * U]], .6 + i * .05, .7 + i * .05); }
  } else if (kind === 'story') {
    const cx = 50 * U, cy = (top + 26) * U;
    part([[cx, cy - 16 * U], [cx - 16 * U, cy - 20 * U], [cx - 34 * U, cy - 16 * U], [cx - 34 * U, cy + 14 * U], [cx - 16 * U, cy + 10 * U], [cx, cy + 14 * U], [cx, cy - 16 * U]], 0, .35);
    part([[cx, cy - 16 * U], [cx + 16 * U, cy - 20 * U], [cx + 34 * U, cy - 16 * U], [cx + 34 * U, cy + 14 * U], [cx + 16 * U, cy + 10 * U], [cx, cy + 14 * U]], .2, .5);
    for (let i = 0; i < 4; i++) { part([[cx - 29 * U, cy + (-10 + i * 6) * U], [cx - 6 * U, cy + (-10 + i * 6) * U]], .5 + i * .06, .6 + i * .06); part([[cx + 6 * U, cy + (-10 + i * 6) * U], [cx + 29 * U, cy + (-10 + i * 6) * U]], .62 + i * .06, .72 + i * .06); }
    if (d > .9) [[-42, -8], [42, -8], [42, 9]].forEach(([dx, dy], i) => shape(starPts(cx + dx * U, cy + dy * U, 3 * U * backOut(seg(d, .9 + i * .03, 1)), .45, 5), { fill: SF.glowGold, stroke: SF.chalk, lwPx: 1.2 }));
  } else if (kind === 'plate') {                                   // the healthy plate: veggies, fruit, grains, protein
    const cx = 50 * U, cy = (top + 23) * U, R = 21 * U, pop = i => backOut(seg(d, .35 + i * .14, .5 + i * .14));
    const ring = ellPts(cx, cy, R, R * .78, 40); part([...ring, ring[0]], 0, .2);
    part([[cx - R, cy], [cx + R, cy]], .2, .28); part([[cx, cy - R * .78], [cx, cy + R * .78]], .26, .34);
    const at = (dx, dy, i, fn) => { const k = pop(i); if (k <= 0) return; X.save(); X.translate(cx + dx * U, cy + dy * U); X.scale(k * U, k * U); fn(); X.restore(); };
    const o2 = { stroke: SF.ink, lwPx: 1.5 };
    at(-10, -8, 0, () => { line([[0, 5], [0, 0]], { stroke: '#7FB069', lwPx: Math.max(2, U * 1.2) }); [[-3, -1], [0, -3], [3, -1], [-1.5, -3.5], [1.8, -3.2]].forEach(([x, y]) => circle(x, y, 2.6, { fill: '#5E9E4A', ...o2 })); });
    at(10, -7, 1, () => { circle(0, 0, 5, { fill: '#D9443A', ...o2 }); line([[0, -4.6], [.6, -7]], { stroke: '#6B4A2A', lwPx: 2 }); ellipse(2.2, -6.2, 2, 1, { fill: '#7FB069', stroke: SF.ink, lwPx: 1, rot: -.4 }); circle(-1.8, -1.8, 1.1, { fill: 'rgba(255,255,255,.6)', stroke: null }); });
    at(-10, 8, 2, () => { shape([[-5, 4], [-5, -2], [-4, -5], [0, -6], [4, -5], [5, -2], [5, 4]], { fill: '#E8B96A', ...o2, smooth: .4 }); shape([[-3.6, 3], [-3.6, -1.6], [0, -4.2], [3.6, -1.6], [3.6, 3]], { fill: '#F6DDA8', stroke: null, smooth: .4 }); });
    at(10, 8, 3, () => { ellipse(0, 0, 6, 4.5, { fill: '#FFFDF4', ...o2 }); circle(.5, -.3, 2.2, { fill: '#F5B82E', ...o2 }); });
    [['veggies', 14, top + 15], ['fruit', 86, top + 15], ['grains', 14, top + 31], ['protein', 86, top + 31]].forEach(([w, lx, ly], i) => label(w, lx, ly, 4.6, .45 + i * .14));
  } else if (kind === 'crash') {                                   // sugar: a spike and a crash · veggies: steady energy
    part([[10 * U, top * U], [10 * U, 56 * U], [92 * U, 56 * U]], 0, .15);
    const candy = [], veg = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; candy.push([(12 + u * 78) * U, (50 - 34 * Math.exp(-((u - .28) ** 2) / .012) + (u > .28 ? 10 * seg(u, .28, .6) : 0)) * U]); veg.push([(12 + u * 78) * U, (46 - 16 * (1 - Math.exp(-u * 3))) * U]); }
    const f1 = seg(d, .15, .6), f2 = seg(d, .55, .95);
    X.save(); X.shadowColor = '#FF8FB8';
    if (f1 > 0) line(f1 < 1 ? polySlice(candy, 0, f1) : candy, { stroke: '#FF9BC4', lwPx: Math.max(2, U * 1.1) });
    X.restore();
    if (f2 > 0) line(f2 < 1 ? polySlice(veg, 0, f2) : veg, { stroke: '#9FE08A', lwPx: Math.max(2, U * 1.1) });
    label('ZOOM!', 34, top + 1, 5.5, .3); label('CRASH', 62, 62 - 4, 5, .55); label('veggies: steady', 76, 34, 4.2, .9);
  }
  X.restore();
  X.restore();
}

// Walk cycle: pose options for safadi() at walk phase p (steps; one step per 1.0) with amount k (0 = standing, 1 = full stride).
// Tie p to the distance travelled (p = distance / stride) so the feet never slide. Measured, professorial stride.
function safadiWalk(p, k = 1) {
  const sn = Math.sin(p * Math.PI), a = Math.abs(sn);
  return {
    footL: [-1.25 + .12 * k * sn, -.8 - 1.1 * k * Math.max(0, sn)], footR: [1.25 + .12 * k * sn, -.8 - 1.1 * k * Math.max(0, -sn)],
    dy: -.22 * k * a + .1 * k, tilt: .018 * k * sn, lean: .012 * k * sn,
    handL: [-4.35 + .25 * k * a, -8.1 - .75 * k * sn], handR: [4.35 - .25 * k * a, -8.1 + .75 * k * sn],
  };
}

// Registration for the studio's character browser (poses are also its model sheet).
const sfTalk = t => lipFlap(t, frac(t * .5) < .7, 'smile');
CHARACTERS.safadi = {
  draw: safadi, unit: SAFADI_UNIT, palette: SF, size: [13, 31],
  poses: {
    'rest': (x, y, s, t) => safadi(x, y, s, {}),
    'talk': (x, y, s, t) => safadi(x, y, s, { mouth: sfTalk(t), brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm', turn: .2, tilt: .03 * wob(t, .7) }),
    'explain': (x, y, s, t) => safadi(x, y, s, { mouth: sfTalk(t), brows: 'up', handL: [-5.3 - .3 * wob(t, 1.2), -12.4], handR: [5.3 + .3 * wob(t, 1.2, .5), -12.4], handPoseL: 'palm', handPoseR: 'palm', lean: .03 }),
    'point up': (x, y, s, t) => safadi(x, y, s, { handR: [5.8, -21.4], handPoseR: 'point', mouth: 'open', brows: 'up', lookX: .5, lookY: -.8, tilt: -.05 }),
    'pointer': (x, y, s, t) => safadi(x, y, s, { handR: [4.4, -12.2], handPoseR: 'pointer', pointerAng: -.95 + .08 * wob(t, .8), mouth: 'smile', brows: 'up', lookX: .6, lookY: -.5 }),
    'thinking': (x, y, s, t) => safadi(x, y, s, { handR: [.8, -16.1], handPoseR: 'fist', handL: [.6, -10.6], handPoseL: 'fist', brows: 'quizzical', mouth: 'flat', lookX: -.6, lookY: -.7, eyes: 'narrow', tilt: -.06 }),
    'idea!': (x, y, s, t) => safadi(x, y, s, { bulb: 1, eyes: 'wide', brows: 'up', mouth: 'grin', handR: [5.8, -21.4], handPoseR: 'point', dy: -.2 }),
    'super explain': (x, y, s, t) => {
      const A = safadi(x, y, s, { power: 1, eyes: 'glow', brows: 'up', mouth: 'grin', handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', jump: .6 + .4 * wob(t, .6) });
      return A;
    },
    'surprised': (x, y, s, t) => safadi(x, y, s, { eyes: 'wide', mouth: 'O', brows: 'up', handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', dy: -.2 }),
    'laugh': (x, y, s, t) => { const k = Math.abs(Math.sin(t * 13)); safadi(x, y, s, { handL: [-2.2, -9.5], handR: [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'squeeze', mouth: k > .5 ? 'grin' : 'open', dy: .4 * k, tilt: -.08 }); },
    'wink': (x, y, s, t) => safadi(x, y, s, { eyes: 'wink', mouth: 'grin', handR: [5.2, -13.6], handPoseR: 'thumb', brows: 'up' }),
    'walk': (x, y, s, t) => safadi(x, y, s, { ...safadiWalk(t * 1.6), mouth: 'smile', turn: -.15 }),
    'shrug': (x, y, s, t) => safadi(x, y, s, { handL: [-5.0, -13.4], handR: [5.0, -13.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: 'smirk', tilt: .12, emote: '?', emoteK: 1 }),
  },
};
