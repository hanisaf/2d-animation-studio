// characters/alma/alma.js: Alma, a cute girl with super dance powers (see reference.webp, README.md).
//
// alma(x, y, s, o) → anchors
//   (x, y) screen point on the floor between the feet · s = px per local unit. She is ~23.8 units tall (feet to hair top),
//   so in a perspective set use s = ALMA_UNIT * P.k(Z) (she is ~120 world units tall: a kid).
//
// Local units: feet y = 0, y points DOWN (up is negative). Hips −4.2, shoulders −9.4, chin −11.6, head centre −16.0, hair top ≈ −23.8.
// Chibi proportions: the head (with its long wavy hair) is about half her height and twice as wide as her body.
//
// Pose     dy (hip drop; + = crouch) · lean (torso, rad) · tilt (head, rad) · turn (head −1..1) · rot (whole body, about the belly)
//          jump (units off the floor) · sq (squash; negative stretches) · flip · spin (rad: twirl about her vertical axis; she shows
//          her back while cos(spin) < 0) · hairSwing (−1..1: the hair swings out to that side) · breathe (default on)
// Limbs    handL / handR: [x, y] wrist targets in local units (L = screen-left) · handPoseL / handPoseR: 'open' | 'palm' | 'point' | 'fist'
//          footL / footR: ankle targets (rest [∓0.9, −0.55])
// Face     eyes: open | wide | happy | closed | wink | squeeze | star | heart · lookX / lookY (−1..1) · blink (0..1, auto if unset)
//          brows: normal | up | worried | angry · mouth: smile | grin | open | o | O | flat | frown | smirk | wobble · blush (0..1, default .8)
// Powers   power (0..1): the dance aura: a glowing rainbow dance-floor ring that pulses on the beat, twinkling sparkles and music
//          notes floating up around her. Pair it with almaDance(t, move) for the moves.
// Extras   emote: '?' | '!' | 'sweat' | 'music' | 'heart' with emoteK (0..1 pop) · boil (px)
//
// Returns anchors in screen px: { head, mouth, top, eyeL, eyeR, chest, belly, handL, handR, footL, footR }
//
// Also: almaDance(t, move, { bpm, k }) → pose options for a dance move, to spread into alma():
//   move: 'bounce' | 'sway' | 'disco' | 'twirl' | 'star jump' | 'floss' | 'arm wave'. bpm (default 112) sets the tempo, k (0..1) the energy.
// almaSkip(p, k): skip-cycle pose options (p = steps travelled). almaLollipop(x, y, s, { ang, bite }): her swirly lollipop prop.

const AL = {
  ink: '#3B2530', skin: '#F6C9AC', skinDk: '#E2A487', skinLt: '#FCE0CD', cheek: '#F29A8E', nose: '#EFA893',
  hair: '#5B3C2D', hairDk: '#43291F', hairLt: '#7B5541', purple: '#8F5CB3', purpleLt: '#B48AD0', clip: '#6F8FCB', clipDk: '#4F6DA6',
  eyeW: '#FFFDF7', iris: '#8A5024', irisDk: '#5B3014', lash: '#2B1B18', brow: '#6A4431', mouth: '#8A2E3C', tongue: '#EE8595', lip: '#E88C86',
  sweater: '#F4EEDF', sweaterDk: '#DCD2BE', rainbow: ['#9B6BC0', '#C7A6DB', '#84A98C'],
  jeans: '#4F6E9F', jeansDk: '#3D5782', jeansLt: '#7F9CC7', shoe: '#F2EDE2', shoeTop: '#5D5470',
  glow: '#E9B8FF', gold: '#FFD66B',
};
const ALMA_UNIT = 5.0;      // world units per local unit
const AL_HIP = -4.2;
const AL_NOTES = ['♪', '♫', '♪', '♬', '♫', '♪'];

function alma(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, pw = clamp(o.power || 0);
  const lw = clamp(s * .17, 1.6, 5.5) / s;
  X.save();
  X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (pw > .01) alFloor(pw, t);
  const air = o.jump || 0;
  if (!o.noShadow) { const f = 1 - clamp(air / 14) * .55; ellipse(0, .12, 3.2 * f, .6 * f, { fill: 'rgba(40,20,30,.28)', stroke: null }); }
  if (pw > .01) alAura(pw, t);
  X.translate(0, -air);
  if (o.rot) { X.translate(0, -8); X.rotate(o.rot); X.translate(0, 8); }
  if (o.sq) X.scale(1 + o.sq * .55, 1 - o.sq);
  const cs = Math.cos(o.spin || 0), back = cs < 0;
  if (o.spin) X.scale(Math.sign(cs || 1) * Math.max(.14, Math.abs(cs)), 1);
  if (pw > .01) alSparkles(pw, t, false);

  withBoil(o.boil ?? .7, () => {
    const hipY = AL_HIP + (o.dy || 0), lean = o.lean || 0, cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];   // torso-local → body-local
    const br = o.breathe === false ? 0 : wob(t, .25) * .05;
    const headT = () => { X.translate(0, hipY); X.rotate(lean); X.translate(0, -6.2); X.rotate(o.tilt || 0); X.translate(0, -5.6); };
    const swing = (o.hairSwing ?? 0) + wob(t, .45) * .06;

    // ---- the long hair behind her ----
    if (!back) { X.save(); headT(); alBackHair(swing, t, lw); X.restore(); }

    // ---- legs + sneakers ----
    [[-1, o.footL || [-.9, -.55]], [1, o.footR || [.9, -.55]]].forEach(([sd, f]) => {
      const hp = tl(sd * .85, -.1), { joint, end } = ik2(hp, f, 1.95, 1.9, [sd * .15, .1]);
      alLimb([hp, joint, end], 1.55, AL.jeans, lw);
      alCuff(end, joint, lw);
      alShoe(end, sd, lw);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
    });

    // ---- torso: the cream sweatshirt with the rainbow ----
    X.save(); X.translate(0, hipY); X.rotate(lean); X.scale(1 + br * .3, 1 + br);
    shape(rectPts(-.85, -7.9, 1.7, 1.9), { fill: AL.skin, stroke: AL.ink, lw });              // neck
    shape(rectPts(-.85, -7.9, 1.7, .7), { fill: rgba(AL.skinDk, .5), stroke: null });
    alSweater(lw, back);
    A.chest = toPx(0, -3); A.belly = toPx(0, -1.2);
    X.restore();

    // ---- head: face and front curtains, or the back of her head while twirling ----
    X.save(); headT();
    if (back) { alBackHair(swing, t, lw, true); A.head = toPx(0, 0); A.mouth = toPx(0, 3.4); A.eyeL = A.eyeR = A.head; }
    else alHead(o, t, lw, A, swing);
    X.restore();

    // ---- arms (in front of the body) ----
    [[-1, o.handL || [-3.4, -4.9], o.handPoseL || 'open'], [1, o.handR || [3.4, -4.9], o.handPoseR || 'open']].forEach(([sd, tg, pose]) => {
      const sh = tl(sd * 2.55, -5.3), { joint, end } = ik2(sh, tg, 2.55, 2.35, [sd * .25, 1]);
      alLimb([sh, joint, end], 1.6, AL.sweater, lw);
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      alHand(end, ang, sd, pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang) * .5, end[1] + Math.sin(ang) * .5);
    });
  });
  if (pw > .01) alSparkles(pw, t, true);
  A.top = toPx(0, -23.8);
  X.restore();
  if (pw > .01) alNotes(pw, t, A, s);
  if (o.emote && (o.emoteK ?? 1) > .02) alEmote(o.emote, A, s, o.emoteK ?? 1, t);
  return A;
}

function alLimb(pts, w, col, lw) {
  if (JIT) { const a = JIT / pxScale(); pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  withBoil(0, () => { line(pts, { stroke: AL.ink, lw: w + lw * 2 }); line(pts, { stroke: col, lw: w }); });
}
// rolled-up jeans cuff just above the ankle
function alCuff(end, knee, lw) {
  const a = Math.atan2(end[1] - knee[1], end[0] - knee[0]);
  X.save(); X.translate(end[0], end[1]); X.rotate(a - Math.PI / 2);
  shape(rectPts(-.88, -.95, 1.76, .6), { fill: AL.jeansLt, stroke: AL.ink, lw, smooth: .3 });
  X.restore();
}
// Sneaker seen from the front: cream sole and toe cap, purple-grey upper, white laces.
function alShoe(a, sd, lw) {
  X.save(); X.translate(a[0] + sd * .05, a[1]); X.scale(sd, 1);
  shape([[-.8, .1], [-.75, -.35], [-.3, -.55], [.45, -.5], [.85, -.1], [.95, .45], [.7, .7], [-.1, .72], [-.7, .55]], { fill: AL.shoeTop, stroke: AL.ink, lw, smooth: .8 });
  shape([[-.8, .25], [.95, .3], [.95, .5], [.7, .72], [-.1, .74], [-.72, .6]], { fill: AL.shoe, stroke: AL.ink, lw, smooth: .5 });
  shape([[-.1, .05], [.6, .05], [.75, .3], [-.05, .3]], { fill: AL.shoe, stroke: null });
  [-.28, -.05].forEach(y => line([[-.3, y], [.3, y]], { stroke: '#FFFFFF', lw: lw * 1.1 }));
  X.restore();
}

function alSweater(lw, back) {
  const body = [[-1.25, -6.35], [-2.6, -5.9], [-3.2, -4.8], [-3.15, -2.5], [-3.2, -.5], [-3.05, .35], [0, .45], [3.05, .35], [3.2, -.5], [3.15, -2.5], [3.2, -4.8], [2.6, -5.9], [1.25, -6.35], [0, -6.0]];
  shape(body, { fill: AL.sweater, stroke: AL.ink, lw, smooth: .45 });
  X.save(); tracePath(body, true, .45); X.clip();
  withBoil(0, () => {
    [-1, 1].forEach(sd => shape([[sd * 3.4, -6.5], [sd * 2.5, -6.5], [sd * 2.3, .6], [sd * 3.4, .6]], { fill: rgba(AL.sweaterDk, .45), stroke: null }));
    shape(rectPts(-3.4, -.55, 6.8, 1.2), { fill: AL.sweaterDk, stroke: null });                       // ribbed hem
    for (let x = -3; x <= 3; x += .3) line([[x, -.5], [x, .45]], { stroke: rgba('#C2B69E', .6), lw: lw * .5 });
  });
  X.restore();
  line([[-3.1, -.55], [3.1, -.55]], { stroke: AL.ink, lw: lw * .8 });
  if (back) return;
  // ribbed crew collar
  shape([[-1.3, -6.35], [0, -5.75], [1.3, -6.35], [1.05, -6.7], [0, -6.2], [-1.05, -6.7]], { fill: AL.sweaterDk, stroke: AL.ink, lw, smooth: .5 });
  // the rainbow, and a line of tiny script above it
  AL.rainbow.forEach((c, i) => {
    const r = 1.25 - i * .33, a = []; for (let j = 0; j <= 16; j++) { const an = Math.PI + j / 16 * Math.PI; a.push([Math.cos(an) * r, -2.5 + Math.sin(an) * r]); }
    line(a, { stroke: AL.ink, lw: .32 + lw * 1.6 }); line(a, { stroke: c, lw: .32 });
  });
  const sc = []; for (let i = 0; i <= 26; i++) { const u = i / 26; sc.push([-1.6 + u * 3.2, -4.15 - Math.sin(u * Math.PI) * .25 + Math.sin(u * 40) * .07]); }
  line(sc, { stroke: rgba('#2E3550', .75), lw: lw * .7 });
}

// Back hair: the long wavy mass behind the head and shoulders (head-local, origin at the face centre). As `front`, it is the
// back of her head (shown while she twirls away from camera).
function alBackHair(swing, t, lw, front = false) {
  const side = sd => {
    const pts = []; for (let i = 0; i <= 14; i++) {
      const u = i / 14, y = -1 + u * 11.4, w = sd * (6.0 + 2.3 * u + 1.05 * Math.sin(u * 8.5 + t * 1.3 + sd) * Math.min(1, u * 2.5)) + swing * 3 * u * u;
      pts.push([w, y]);
    } return pts;
  };
  const R = side(1), L = side(-1), bottom = [];
  bottom.push([R[14][0] + .35, 10.5], [R[14][0] - .3, 11.0]);
  for (let i = 1; i < 12; i++) { const u = i / 12, x = lerp(R[14][0] - .6, L[14][0] + .6, u); bottom.push([x, 10.6 - 1.6 * Math.sin(u * Math.PI) + .7 * Math.abs(Math.sin(u * TAU * 2.5 + t * .5)) + swing * 1.2 * Math.sin(u * Math.PI)]); }
  bottom.push([L[14][0] + .3, 11.0], [L[14][0] - .35, 10.5]);
  const top = [[-5.9, -1], [-5.9, -4.4], [-4.5, -7.2], [-1.6, -8.35], [1.6, -8.35], [4.6, -7.2], [5.95, -4.4], [5.9, -1]];
  const mass = [...top, ...R.slice(1), ...bottom, ...L.slice(1).reverse()];
  shape(mass, { fill: AL.hair, stroke: AL.ink, lw, smooth: .6 });
  X.save(); tracePath(mass, true, .6); X.clip();
  withBoil(0, () => {
    // wavy strands with purple streaks
    for (let k = 0; k < 16; k++) {                   // sculpted wavy bands, a few purple streaks among them
      const sd = k % 2 ? 1 : -1, x0 = sd * (2.9 + (k >> 1) * .52), pts = [];
      for (let i = 0; i <= 20; i++) { const u = i / 20, y = -6.5 + u * 16.6; pts.push([x0 + sd * 2.3 * u + 1.05 * Math.sin(u * 8.5 + t * 1.3 + sd + k * .05) * Math.min(1, u * 2.5) + swing * 3 * u * u, y]); }
      const purple = k === 4 || k === 7 || k === 13;
      line(pts, { stroke: purple ? AL.purple : k % 3 === 0 ? AL.hairLt : AL.hairDk, lw: purple ? .34 : k % 3 === 0 ? .3 : .13, smooth: true, alpha: purple ? .9 : .75 });
    }
    if (front) {                                   // the crown seen from behind: parting swirl + clip
      line([[0, -8.2], [0, -3], [.3, 2]], { stroke: AL.hairDk, lw: .18, smooth: true });
      ellipse(0, -3.2, 3.8, 3.2, { fill: rgba(AL.hairLt, .35), stroke: null });
    }
  });
  X.restore();
}

function alHead(o, t, lw, A, swing) {
  const turn = o.turn || 0, tx = turn * .9;
  // ears peek under the hair
  [-1, 1].forEach(sd => shape(ellPts(sd * 4.95 - turn * .5, 1.4, .55, .8, 12), { fill: AL.skin, stroke: AL.ink, lw, smooth: true }));
  const face = [[0, -5.9], [3.5, -5.2], [4.8, -2.5], [5.05, .6], [4.6, 2.7], [3.2, 3.95], [1.4, 4.4], [0, 4.45], [-1.4, 4.4], [-3.2, 3.95], [-4.6, 2.7], [-5.05, .6], [-4.8, -2.5], [-3.5, -5.2]];
  shape(face, { fill: AL.skin, stroke: AL.ink, lw, smooth: true });
  X.save(); tracePath(face, true, true); X.clip();
  withBoil(0, () => { ellipse(0, 4.4, 3.6, 1.1, { fill: rgba(AL.skinDk, .22), stroke: null }); ellipse(-1 + tx * .4, -2.9, 2.0, .9, { fill: rgba(AL.skinLt, .3), stroke: null }); });
  X.restore();
  // cheeks
  const bl = o.blush ?? .8;
  if (bl > .01) [-1, 1].forEach(sd => ellipse(sd * 3.3 + tx * .5, 2.1, 1.15, .72, { fill: rgba(AL.cheek, .45 * bl), stroke: null }));
  // eyes + brows
  const eyeX = [-2.6 + tx, 2.6 + tx];
  eyeX.forEach((ex, i) => alEye(ex, .5, o, i === 0, lw, t, 1 - Math.abs(turn) * (turn * (i ? -1 : 1) > 0 ? .22 : 0)));
  A.eyeL = toPx(eyeX[0], .5); A.eyeR = toPx(eyeX[1], .5);
  alBrows(eyeX, o, lw);
  // a little button nose
  X.save(); X.translate(tx * 1.15, 0);
  ellipse(0, 2.4, .5, .4, { fill: AL.nose, stroke: null });
  line([[-.55, 2.45], [-.45, 2.8], [-.15, 2.85]], { stroke: AL.ink, lw: lw * .9, smooth: true });
  line([[.55, 2.45], [.45, 2.8], [.15, 2.85]], { stroke: AL.ink, lw: lw * .9, smooth: true });
  circle(-.18, 2.2, .16, { fill: 'rgba(255,255,255,.7)', stroke: null });
  X.restore();
  alMouth(o.mouth || 'smile', tx, lw);
  A.mouth = toPx(tx, 3.4); A.head = toPx(0, 0);
  // front curtains of hair: a parting just right of centre, framing the face down past the jaw
  const part = .8;
  [-1, 1].forEach(sd => {
    const w = u => 1.0 * Math.sin(u * 8.5 + t * 1.3 + sd) * Math.min(1, u * 2) + swing * 2.2 * u * u, pts = [];
    const outer = [[part, -8.25], [sd * 2.2 + part * .4, -8.1], [sd * 4.5, -6.9], [sd * 5.8, -4.3], [sd * 6.1, -1]];
    for (let i = 1; i <= 8; i++) { const u = i / 8; outer.push([sd * (6.1 + .9 * u) + w(u), -1 + u * 10.5]); }
    const inner = [];
    for (let i = 8; i >= 1; i--) { const u = i / 8; inner.push([sd * (5.0 + .6 * u) + w(u) * .8, -1.6 + u * 9.2]); }
    inner.push([sd * 4.75, -2.6], [sd * 3.9, -4.6], [sd * 2.3 + part * .3, -5.75], [part, -6.05]);
    const c = [...outer, ...inner];
    shape(c, { fill: AL.hair, stroke: AL.ink, lw, smooth: .55 });
    X.save(); tracePath(c, true, .55); X.clip();
    withBoil(0, () => {
      for (let k = 0; k < 4; k++) {
        const s0 = [];
        for (let i = 0; i <= 14; i++) { const u = i / 14; s0.push([lerp(part + sd * (1 + k * .9), sd * (5.2 + k * .35), Math.min(1, u * 2.2)) + (u > .45 ? w((u - .45) / .55) : 0), -7.9 + k * .2 + u * 16]); }
        const purple = (sd < 0 && k === 1) || (sd > 0 && k === 2);
        line(s0, { stroke: purple ? AL.purple : k % 2 ? AL.hairDk : AL.hairLt, lw: purple ? .3 : .14, smooth: true, alpha: purple ? .9 : .7 });
      }
    });
    X.restore();
  });
  // the blue clip on screen-left
  X.save(); X.translate(-4.35, -5.0); X.rotate(-.95);
  shape([[-1.0, -.32], [.95, -.32], [1.05, 0], [.95, .32], [-1.0, .32], [-1.1, 0]], { fill: AL.clip, stroke: AL.ink, lw, smooth: .6 });
  line([[-.7, -.05], [.7, -.05]], { stroke: AL.clipDk, lw: lw * .8 });
  X.restore();
}

function alEye(cx, cy, o, isLeft, lw, t, narrow) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = isLeft ? 'open' : 'happy';
  const rx = 1.28 * narrow, ry = 1.42;
  if (kind === 'happy') return line([[cx - 1.0, cy + .35], [cx, cy - .55], [cx + 1.0, cy + .35]], { stroke: AL.lash, lw: lw * 2.2, smooth: true });
  if (kind === 'closed') { line([[cx - 1.0, cy], [cx, cy + .45], [cx + 1.0, cy]], { stroke: AL.lash, lw: lw * 2.2, smooth: true }); return; }
  if (kind === 'squeeze') { const d = isLeft ? 1 : -1; return line([[cx - d * .85, cy - .6], [cx + d * .6, cy], [cx - d * .85, cy + .6]], { stroke: AL.lash, lw: lw * 2.2 }); }
  if (kind === 'star' || kind === 'heart') {
    const pts = kind === 'star' ? starPts(cx, cy, 1.25, .5, 5) : [[cx, cy + 1.05], [cx - 1.15, cy - .05], [cx - .95, cy - .8], [cx - .35, cy - .95], [cx, cy - .45], [cx + .35, cy - .95], [cx + .95, cy - .8], [cx + 1.15, cy - .05]];
    shape(pts, { fill: kind === 'star' ? AL.gold : '#F06C8E', stroke: AL.ink, lw, smooth: kind === 'heart' ? .5 : false });
    circle(cx - .35, cy - .35, .2, { fill: '#FFFFFF', stroke: null });
    return;
  }
  const R = kind === 'wide' ? 1.1 : 1;
  ellipse(cx, cy, rx * R, ry * R, { fill: AL.eyeW, stroke: AL.ink, lw });
  const lx = clamp(o.lookX || 0, -1, 1), ly = clamp(o.lookY || 0, -1, 1), ir = kind === 'wide' ? .78 : .95;
  const ix = cx + lx * .32 * narrow, iy = cy + .1 + ly * .38;
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx * R, ry * R, 0, 0, TAU); X.clip();
  withBoil(0, () => {
    circle(ix, iy, ir, { fill: radGrad(ix, iy + ir * .3, ir * .2, ir, [[0, '#B8763A'], [1, AL.iris]]), stroke: null });
    circle(ix, iy, ir * .62, { fill: AL.lash, stroke: null });
    circle(ix + ir * .32, iy - ir * .38, ir * .3, { fill: '#FFFFFF', stroke: null });
    circle(ix - ir * .3, iy + ir * .35, ir * .12, { fill: '#FFFFFF', stroke: null });
    const ph = (t + 2.1 + (o.blinkSeed || 0)) % 3.1, b = o.blink ?? (ph < .15 ? Math.sin(ph / .15 * Math.PI) : 0);
    if (b > .02) shape(rectPts(cx - 1.6, cy - 1.7, 3.2, .3 + 3.2 * b), { fill: AL.skin, stroke: null });
  });
  X.restore();
  // upper lid with lashes and a little flick at the outer corner
  const sd = isLeft ? -1 : 1;
  line([[cx - rx * R, cy - .1], [cx - rx * .5 * R, cy - ry * R * .92], [cx + rx * .5 * R, cy - ry * R * .92], [cx + rx * R, cy - .1]], { stroke: AL.lash, lw: lw * 2.3, smooth: .9 });
  line([[cx + sd * rx * R * .92, cy - .45], [cx + sd * (rx * R + .45), cy - .85]], { stroke: AL.lash, lw: lw * 1.9 });
  line([[cx + sd * rx * R * .72, cy - .95], [cx + sd * (rx * R + .25), cy - 1.35]], { stroke: AL.lash, lw: lw * 1.5 });
}

function alBrows(eyeX, o, lw) {
  const kind = o.brows || 'normal';
  eyeX.forEach((ex, i) => {
    const sd = i ? 1 : -1, up = kind === 'up' ? .45 : 0, inner = kind === 'worried' ? -.45 : kind === 'angry' ? .45 : 0, y = -2.15 - up;
    shape([[ex - sd * 1.05, y + .25 + inner], [ex + sd * .1, y - .35 + inner * .3], [ex + sd * 1.25, y + .1], [ex + sd * 1.2, y + .35], [ex + sd * .1, y - .05 + inner * .3], [ex - sd * 1.05, y + .5 + inner]],
      { fill: AL.brow, stroke: null, smooth: .6 });
  });
}

function alMouth(kind, tx, lw) {
  X.save(); X.translate(tx, 1.9);
  const dark = { fill: AL.mouth, stroke: AL.ink, lw };
  if (kind === 'smile') {
    line([[-1.75, 1.2], [-.9, 1.65], [0, 1.78], [.9, 1.65], [1.75, 1.2]], { stroke: AL.ink, lw: lw * 1.3, smooth: true });
    ellipse(0, 1.95, .7, .15, { fill: rgba(AL.lip, .45), stroke: null });
    [-1, 1].forEach(sd => line([[sd * 1.72, 1.05], [sd * 1.9, 1.35]], { stroke: AL.ink, lw: lw * .9 }));
  } else if (kind === 'grin' || kind === 'open') {
    const pts = kind === 'grin' ? [[-1.5, 1.2], [0, 1.4], [1.5, 1.2], [1.0, 2.2], [0, 2.5], [-1.0, 2.2]] : [[-.75, 1.3], [0, 1.2], [.75, 1.3], [.75, 2.0], [0, 2.55], [-.75, 2.0]];
    X.save(); tracePath(pts, true, .8); X.fillStyle = AL.mouth; X.fill(); X.clip();
    withBoil(0, () => { shape(rectPts(-1.7, 1.05, 3.4, kind === 'grin' ? .45 : .32), { fill: '#FFFDF7', stroke: null }); ellipse(0, 2.5, .75, .45, { fill: AL.tongue, stroke: null }); });
    X.restore();
    shape(pts, { stroke: AL.ink, lw, smooth: .8 });
  } else if (kind === 'o') ellipse(0, 1.7, .32, .38, dark);
  else if (kind === 'O') ellipse(0, 1.85, .58, .72, dark);
  else if (kind === 'flat') line([[-.8, 1.6], [.8, 1.6]], { stroke: AL.ink, lw: lw * 1.4 });
  else if (kind === 'frown') line([[-1.1, 2.0], [-.55, 1.6], [0, 1.5], [.55, 1.6], [1.1, 2.0]], { stroke: AL.ink, lw: lw * 1.4, smooth: true });
  else if (kind === 'smirk') line([[-1.0, 1.6], [0, 1.72], [1.15, 1.25]], { stroke: AL.ink, lw: lw * 1.4, smooth: true });
  else if (kind === 'wobble') line([[-1, 1.7], [-.6, 1.45], [-.2, 1.75], [.2, 1.45], [.6, 1.75], [1, 1.5]], { stroke: AL.ink, lw: lw * 1.3, smooth: true });
  X.restore();
}

function alHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  const ink = { stroke: AL.ink, lw: .28 + lw * 2 }, skin = { stroke: AL.skin, lw: .28 };
  shape(ellPts(-.1, 0, .32, .78, 12), { fill: AL.sweaterDk, stroke: AL.ink, lw, smooth: true });          // ribbed cuff
  if (pose === 'fist') {
    shape([[.1, -.42], [.5, -.5], [.85, -.34], [.95, 0], [.85, .36], [.45, .48], [.1, .38]], { fill: AL.skin, stroke: AL.ink, lw, smooth: .9 });
  } else {
    const f = pose === 'palm' ? [[-.6, .55], [-.2, .62], [.2, .6], [.55, .5], [-1.45, .45]] : pose === 'point' ? [[0, .85]] : [[-.25, .5], [-.05, .56], [.15, .54], [.35, .47], [-1.1, .38]];
    const fingers = f.map(([a, l]) => [[.45, 0], [.45 + Math.cos(a) * (.3 + l), Math.sin(a) * (.3 + l)]]);
    withBoil(0, () => {
      fingers.forEach(g => line(g, ink)); circle(.45, 0, .45, { stroke: AL.ink, lw: lw * 2 });
      fingers.forEach(g => line(g, skin)); circle(.45, 0, .45, { fill: AL.skin, stroke: null });
      if (pose === 'point') shape(ellPts(.62, .1, .38, .34, 12), { fill: AL.skin, stroke: AL.ink, lw, smooth: true });
    });
  }
  X.restore();
}

// ---------- the dance powers ----------
function alFloor(k, tt) {
  const b = pulse(tt, 5), hue = tt * 60;
  X.save(); X.globalCompositeOperation = 'lighter';
  ellipse(0, .1, 6.5 + 1.2 * b, 1.3 + .25 * b, { fill: radGrad(0, .1, .5, 6.5, [[0, `hsla(${hue % 360},90%,75%,${.35 * k})`], [1, 'hsla(0,0%,100%,0)']]), stroke: null });
  X.restore();
  for (let i = 0; i < 3; i++) {
    const r = 3.4 + i * 1.3 + b * .6, c = `hsla(${(hue + i * 110) % 360},85%,70%,${(.75 - i * .2) * k})`;
    ellipse(0, .1, r, r * .2, { fill: null, stroke: c, lw: .22 });
  }
}
function alAura(k, t) {
  circle(0, -12, 12, { fill: radGrad(0, -12, 1, 12, [[0, rgba('#FFE3F4', .45 * k)], [.55, rgba(AL.glow, .2 * k)], [1, rgba(AL.glow, 0)]]), stroke: null });
}
function alSparkles(k, t, front) {
  for (let i = 0; i < 12; i++) {
    const a = t * .7 + i / 12 * TAU, depth = Math.sin(a);
    if ((depth > 0) !== front) continue;
    const tw = Math.max(0, Math.sin(t * 4 + i * 1.7)), x = Math.cos(a) * (7.5 + (i % 3)), y = -11 + depth * 1.2 + ((i * 5) % 9 - 4) * 1.6 + Math.sin(t * 1.3 + i) * .6;
    const r = (.35 + .5 * tw) * k * (front ? 1 : .7);
    if (r > .05) shape(starPts(x, y, r, .32, 4, t * 2 + i), { fill: [AL.gold, '#FFFFFF', AL.purpleLt, '#9FE0C2'][i % 4], stroke: AL.ink, lw: .08 });
  }
}
function alNotes(k, t, A, s) {
  const [hx, hy] = A.head;
  overlay(() => {
    X.save(); X.textAlign = 'center'; X.textBaseline = 'middle';
    for (let i = 0; i < AL_NOTES.length; i++) {
      const age = frac(t * .45 + i / AL_NOTES.length), sd = i % 2 ? 1 : -1;
      const x = hx + sd * s * (6.5 + 3 * age) + Math.sin(age * 7 + i) * s * .8, y = hy + s * (6 - 16 * age), size = s * (2.2 + .6 * (i % 3));
      X.globalAlpha = k * Math.sin(age * Math.PI); X.font = `${size}px ${FONT_SFX}`;
      X.lineWidth = size * .12; X.strokeStyle = AL.ink; X.strokeText(AL_NOTES[i], x, y);
      X.fillStyle = [AL.purple, '#84A98C', '#F06C8E', AL.clip][i % 4]; X.fillText(AL_NOTES[i], x, y);
    }
    X.restore();
  });
}
function alEmote(kind, A, s, k, t) {
  const [hx, hy] = A.head, x = hx + s * 6.8, y = hy - s * 7.5, pop = backOut(k);
  if (kind === 'sweat') {
    const [sx, sy] = [hx + s * 5.2, hy - s * 2.6 + (1 - k) * s];
    overlay(() => { X.save(); X.translate(sx, sy); X.scale(pop * s * 1.2, pop * s * 1.2); shape([[0, -.9], [.45, .1], [0, .5], [-.45, .1]], { fill: '#8FD3F0', stroke: AL.ink, lwPx: 3, smooth: .7 }); X.restore(); });
    return;
  }
  const txt = { '?': '?', '!': '!', '!?': '!?', music: '♪', heart: '♥' }[kind] ?? kind;
  const col = kind === 'heart' ? '#F06C8E' : kind === 'music' ? AL.purple : PAL.goldLt;
  overlay(() => {
    X.save(); X.translate(x, y + wob(t, 1.5) * s * .25); X.rotate(.12 + wob(t, 1.1) * .06); X.scale(pop, pop);
    const size = s * 4.2; X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.lineJoin = 'round'; X.lineWidth = size * .14; X.strokeStyle = AL.ink; X.strokeText(txt, 0, 0);
    X.fillStyle = col; X.fillText(txt, 0, 0); X.restore();
  });
}

// Dance moves: pose options for alma() as a pure function of t. { bpm, k (energy 0..1) }
function almaDance(t, move, o = {}) {
  const b = t * (o.bpm ?? 112) / 60, k = o.k ?? 1, S = Math.sin, P = Math.PI, hop = Math.abs(S(b * P));
  const face = { eyes: 'happy', mouth: 'grin', brows: 'up' };
  switch (move) {
    case 'bounce': return { ...face, dy: .45 * k * hop, jump: .3 * k * hop, tilt: .07 * k * S(b * P), hairSwing: .35 * k * S(b * P),
      handL: [-3.1, -6.2 - 1.2 * hop * k], handR: [3.1, -6.2 - 1.2 * hop * k], handPoseL: 'fist', handPoseR: 'fist' };
    case 'sway': { const sw = S(b * P / 2); return { ...face, eyes: 'closed', mouth: 'smile', lean: .09 * k * sw, tilt: .12 * k * sw, hairSwing: .6 * k * sw,
      handL: [-5.0 + .6 * sw, -10.8 - .8 * sw], handR: [5.0 + .6 * sw, -10.8 + .8 * sw], handPoseL: 'palm', handPoseR: 'palm' }; }
    case 'disco': { const up = frac(b / 2) < .5; return { ...face, mouth: up ? 'O' : 'grin', eyes: 'open', lookX: up ? .7 : -.4, lookY: up ? -.8 : .3, dy: .3 * hop,
      lean: (up ? -.07 : .07) * k, hairSwing: (up ? -.4 : .4) * k, handR: up ? [4.9, -13.4] : [-1.6, -3.3], handPoseR: 'point', handL: [-2.6, -4.6], handPoseL: 'fist',
      footR: up ? [1.3, -.55] : [.7, -1.1] }; }
    case 'twirl': { const sp = b * P; return { ...face, spin: sp, hairSwing: .9 * k * S(sp), dy: .2, handL: [-5.3, -9.6], handR: [5.3, -9.6], handPoseL: 'palm', handPoseR: 'palm',
      footL: [-.4, -.55], footR: [.5, -1.5] }; }
    case 'star jump': { const j = S(frac(b / 2) * P), sq = kick(frac(b / 2), 0, 14) * .15; return { ...face, mouth: j > .5 ? 'open' : 'grin', jump: 3.2 * k * j, sq: sq - .06 * j,
      handL: mixPt([-3.2, -5.2], [-5.0, -12.2], j), handR: mixPt([3.2, -5.2], [5.0, -12.2], j), handPoseL: 'palm', handPoseR: 'palm',
      footL: mixPt([-.9, -.55], [-2.1, -.8], j), footR: mixPt([.9, -.55], [2.1, -.8], j), hairSwing: .15 * S(b * P) }; }
    case 'floss': { const f = S(b * P); return { ...face, mouth: 'grin', eyes: 'open', lookX: -f * .5, lean: -.08 * k * f, dy: .15,
      handL: [-.6 + 2.6 * f * k, -4.4], handR: [.6 + 2.6 * f * k, -4.4], handPoseL: 'fist', handPoseR: 'fist', hairSwing: -.45 * k * f }; }
    case 'arm wave': { const w = u => S(b * P + u); return { ...face, tilt: .08 * w(0), hairSwing: .3 * w(.5), dy: .2 * hop,
      handL: [-4.7, -9.8 - 2.2 * w(0) * k], handR: [4.7, -9.8 - 2.2 * w(P) * k], handPoseL: 'palm', handPoseR: 'palm' }; }
  }
  return {};
}

// Skip cycle: pose options for alma() at phase p (steps; one hop-step per 1.0) with amount k (0 = standing, 1 = full skip).
// Tie p to the distance travelled (p = distance / stride) so the feet never slide.
function almaSkip(p, k = 1) {
  const sn = Math.sin(p * Math.PI), a = Math.abs(sn);
  return {
    jump: .7 * k * a * a, dy: .25 * k * (1 - a), hairSwing: .18 * k * sn, tilt: .04 * k * sn,
    footL: [-.9, -.55 - 1.5 * k * Math.max(0, sn)], footR: [.9, -.55 - 1.5 * k * Math.max(0, -sn)],
    handL: [-3.5 + .3 * k * a, -4.9 - 1.4 * k * Math.max(0, -sn)], handR: [3.5 - .3 * k * a, -4.9 - 1.4 * k * Math.max(0, sn)],
  };
}

// Her big swirly lollipop, in screen px: (x, y) = where the hand grips the stick, s = px per Alma unit.
// o: { ang (stick angle from straight up, rad), bite (0..1: a bite missing) }
function almaLollipop(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s, s);
  const lw = clamp(s * .17, 1.6, 5.5) / s;
  line([[0, 1.2], [0, -4.6]], { stroke: AL.ink, lw: .42 + lw * 2 }); line([[0, 1.2], [0, -4.6]], { stroke: '#FBF7F0', lw: .42 });
  const cy = -6.6, R = 2.1;
  circle(0, cy, R, { fill: '#F7B6D2', stroke: AL.ink, lw });
  X.save(); X.beginPath(); X.arc(0, cy, R, 0, TAU); X.clip();
  const sp = []; for (let i = 0; i <= 60; i++) { const a = i * .32, r = i / 60 * R; sp.push([Math.cos(a) * r, cy + Math.sin(a) * r]); }
  withBoil(0, () => { line(sp, { stroke: AL.purple, lw: .42, smooth: true }); line(sp.map(([px, py]) => [px * .9, cy + (py - cy) * .9]), { stroke: '#FFFFFF', lw: .18, smooth: true }); });
  if (o.bite) circle(R * .95, cy - R * .6, R * .45 * o.bite, { fill: '#F4EEDF', stroke: null });
  X.restore();
  circle(-.8, cy - .9, .45, { fill: 'rgba(255,255,255,.75)', stroke: null });
  X.restore();
}

// Registration for the studio's character browser (poses are also its model sheet).
CHARACTERS.alma = {
  draw: alma, unit: ALMA_UNIT, palette: AL, size: [17, 25],
  poses: {
    'rest': (x, y, s, t) => alma(x, y, s, {}),
    'hi!': (x, y, s, t) => alma(x, y, s, { handR: [4.2 + .5 * wob(t, 1.6), -12.2], handPoseR: 'palm', mouth: 'grin', brows: 'up', tilt: .06, hairSwing: .1 }),
    'talk': (x, y, s, t) => alma(x, y, s, { mouth: lipFlap(t, frac(t * .5) < .7, 'smile'), brows: 'up', handR: [3.5, -7.4], handPoseR: 'palm', turn: .2 }),
    'giggle': (x, y, s, t) => { const k = Math.abs(Math.sin(t * 12)); alma(x, y, s, { handL: [-.6, -10.6], handR: [.6, -10.6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: k > .5 ? 'grin' : 'smile', dy: .25 * k, tilt: -.1, blush: 1 }); },
    'surprised': (x, y, s, t) => alma(x, y, s, { eyes: 'wide', mouth: 'O', brows: 'up', handL: [-1.1, -11.6], handR: [1.1, -11.6], handPoseL: 'palm', handPoseR: 'palm' }),
    'wink': (x, y, s, t) => alma(x, y, s, { eyes: 'wink', mouth: 'grin', handR: [3.9, -9.2], handPoseR: 'point', brows: 'up', tilt: .08 }),
    'shy': (x, y, s, t) => alma(x, y, s, { handL: [-.5, -4.6], handR: [.5, -4.6], handPoseL: 'fist', handPoseR: 'fist', lookX: -.6, lookY: .5, mouth: 'smile', tilt: -.12, blush: 1, footR: [.5, -.9] }),
    'sad': (x, y, s, t) => alma(x, y, s, { mouth: 'frown', brows: 'worried', lookY: .7, dy: .2, tilt: .08, emote: 'sweat', emoteK: 1 }),
    'skip': (x, y, s, t) => { const A = alma(x, y, s, { ...almaSkip(t * 2.4), handR: [3.1, -6.4], handPoseR: 'fist', mouth: 'grin', eyes: 'happy', turn: .15 }); almaLollipop(A.handR[0], A.handR[1], s, { ang: .15 }); },
    'dance: bounce': (x, y, s, t) => alma(x, y, s, almaDance(t, 'bounce')),
    'dance: disco': (x, y, s, t) => alma(x, y, s, almaDance(t, 'disco')),
    'dance: twirl': (x, y, s, t) => alma(x, y, s, almaDance(t, 'twirl')),
    'dance: star jump': (x, y, s, t) => alma(x, y, s, almaDance(t, 'star jump')),
    'dance: floss': (x, y, s, t) => alma(x, y, s, almaDance(t, 'floss')),
    'super dance': (x, y, s, t) => alma(x, y, s, { ...almaDance(t, 'arm wave'), power: 1, eyes: 'star' }),
  },
};
