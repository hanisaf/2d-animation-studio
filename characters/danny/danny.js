// Danny: a funny six-year-old who loves soccer and Minecraft.
// (x, y) is the floor point between his feet; s is pixels per local unit.
// Feet are y=0, the jersey hem is y=-10, eyes are near y=-22, hair top is y=-29.
// All movement is a pure function of pose options and time.

const DN = {
  ink: '#3B2530', skin: '#f0dbcf', skinShade: '#ded4d0', skinLight: '#F8CFB0',
  cheek: '#D88B78', hair: '#2f2623', hairShade: '#231e1e', hairLight: '#57443B',
  brow: '#34252B', eyeWhite: '#FFF9F2', iris: '#754622', irisLight: '#B17A40',
  mouth: '#843C45', jersey: '#353969', jerseyShade: '#282D55', blue: '#8BB1D9',
  blueDark: '#2C4684', crest: '#5D8795', shorts: '#426E92', shortsLight: '#638AAD',
  shoe: '#854831', shoeShade: '#4A3028', yellow: '#E8CF74', ball: '#FBFBF7',
};
const DANNY_UNIT = 4.2; // ~122 world units tall

function danny(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, lw = clamp(s * .13, 1.5, 5) / s;
  const dy = o.dy || 0, air = o.jump || 0;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) {
    const q = 1 - clamp(air / 12) * .4;
    ellipse(0, .18, 3.7 * q, .68 * q, { fill: 'rgba(32,26,38,.22)', stroke: null });
  }
  X.translate(0, -air);
  if (o.rot) { X.translate(0, -10); X.rotate(o.rot); X.translate(0, 10); }
  if (o.sq) X.scale(1 + o.sq * .45, 1 - o.sq);

  withBoil(o.boil ?? .45, () => {
    // Independent ankle targets allow a planted foot, run cycle, kick, and juggle.
    [[-1, o.footL || [-1.5, -1.05]], [1, o.footR || [1.5, -1.05]]].forEach(([sd, target]) => {
      const hip = [sd * 1.25, -8.25 + dy];
      const { joint, end } = ik2(hip, target, 3.5, 3.76, [sd * .55, .12]);
      dnLimb([hip, joint, end], 2.0, DN.shorts, lw);
      // Rounded denim knees and seams follow the two-bone leg rig.
      circle(joint[0], joint[1], .9, { fill: DN.shorts, stroke: null });
      line([[joint[0] - sd * .1, joint[1] + .5], [end[0], end[1]]], { stroke: rgba(DN.shortsLight, .65), lw: .16 });
      dnShoe(end, sd, lw);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
      A[sd < 0 ? 'kneeL' : 'kneeR'] = toPx(joint[0], joint[1]);
    });

    // Shorts and torso lean together about the hips.
    X.save(); X.translate(0, dy); X.translate(0, -8.6); X.rotate(o.lean || 0); X.translate(0, 8.6);
    dnJeans(lw);
    const breath = o.breathe === false ? 0 : .025 * wob(t, .35);
    X.save(); X.translate(0, -14); X.scale(1 + breath, 1 + breath); X.translate(0, 14);
    dnPolo(lw);
    A.chest = toPx(0, -13.5); A.belly = toPx(0, -11.3);
    X.restore();

    // Neck and head have a separate tilt control.
    shape(rectPts(-.82, -17.1, 1.64, 2.1), { fill: DN.skin, stroke: DN.ink, lw, smooth: .3 });
    ellipse(0, -15.7, .85, .28, { fill: rgba(DN.skinShade, .4), stroke: null });
    X.save(); X.translate(0, -22.3); X.rotate(o.tilt || 0);
    dnHead(o, t, lw, A);
    A.top = toPx(0, -6.7);
    X.restore();

    // Arms use two-bone IK; sleeves stop above the elbows.
    [[-1, o.handL || [-3.5, -9.8], o.handPoseL || 'open'],
      [1, o.handR || [3.5, -9.8], o.handPoseR || 'open']].forEach(([sd, target, pose]) => {
      const shoulder = [sd * 2.7, -14.45];
      const { joint, end } = ik2(shoulder, target, 2.5, 3.0, [sd * .8, .25]);
      dnLimb([shoulder, joint, end], .89, DN.skin, lw);
      const cuff = mixPt(shoulder, joint, .6);
      dnLimb([shoulder, cuff], 1.53, DN.jersey, lw);
      
      line([[cuff[0] - sd * .61, cuff[1]], [cuff[0] + sd * .61, cuff[1]]], { stroke: DN.yellow, lw: .3 });
      const angle = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      dnHand(end, angle, sd, pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0], end[1]);
    });
    X.restore();
  });
  X.restore();
  return A;
}

function dnLimb(points, width, fill, lw) {
  withBoil(0, () => {
    line(points, { stroke: DN.ink, lw: width + lw * 1.8 });
    line(points, { stroke: fill, lw: width });
  });
}

function dnJeans(lw) {
  shape([[-2.65, -10.1], [2.65, -10.1], [2.55, -7.5], [.6, -7.5], [0, -8.2], [-.6, -7.5], [-2.55, -7.5]],
    { fill: DN.shorts, stroke: null, smooth: .3 });
  line([[-2.65, -10.1], [2.65, -10.1]], { stroke: DN.ink, lw });
  line([[.1, -9.8], [.1, -8.3], [.6, -8.6], [.6, -9.8]], { stroke: '#B69A6D', lw: .1, smooth: true });
  [-1, 1].forEach(sd => line([[sd * 2.5, -9.7], [sd * 1.85, -8.95], [sd * 1.2, -9.05]], { stroke: DN.shortsLight, lw: .14, smooth: true }));
}


function dnPolo(lw) {
  const body = [[-1.1, -15.5], [-2.6, -15.2], [-3.05, -13.8], [-2.95, -10.05],
    [-2.1, -9.85], [0, -9.8], [2.1, -9.85], [2.95, -10.05], [3.05, -13.8], [2.6, -15.2], [1.1, -15.5]];
  shape(body, { fill: DN.jersey, stroke: DN.ink, lw, smooth: .4 });
  X.save(); tracePath(body, true, .4); X.clip();
  shape(rectPts(-3.2, -13.0, 6.4, 1.55), { fill: DN.blue, stroke: null });
  shape(rectPts(-3.2, -10.65, 6.4, 1), { fill: DN.yellow, stroke: null });
  line([[-2.5, -10.05], [0, -9.98], [2.5, -10.05]], { stroke: '#CCB661', lw: .12, smooth: true });
  X.restore();
  shape([[-1.06, -15.6], [-.2, -15.02], [.55, -14.7], [.3, -13.7], [-.25, -13.7], [-.4, -14.7]],
    { fill: DN.blue, stroke: DN.ink, lw: lw * .6 });
  [-1, 1].forEach(sd => shape([[sd * .82, -15.85], [sd * 1.4, -15.3], [sd * 1.18, -14.65], [sd * .15, -15.1]],
    { fill: DN.blue, stroke: DN.ink, lw: lw * .65, smooth: .18 }));
  circle(.02, -14.62, .12, { fill: '#F4EBD1', stroke: null });
  circle(.02, -14.05, .12, { fill: '#F4EBD1', stroke: null });
  // Tiny stitched horse-and-rider emblem, echoing the reference polo.
  ellipse(1.85, -13.8, .35, .16, { fill: '#EDE6C9', stroke: null });
  line([[1.57, -13.8], [1.45, -13.4]], { stroke: '#EDE6C9', lw: .12 });
  line([[2.08, -13.8], [2.18, -13.4]], { stroke: '#EDE6C9', lw: .12 });
  line([[2.05, -13.8], [2.18, -14.15], [2.35, -14.1]], { stroke: '#EDE6C9', lw: .14 });
  line([[1.85, -13.8], [1.82, -14.28], [2.2, -14.55]], { stroke: '#EDE6C9', lw: .12 });
  circle(1.82, -14.4, .12, { fill: '#EDE6C9', stroke: null });
}


function dnShoe(p, sd, lw) {
  X.save(); X.translate(p[0], p[1]); X.scale(sd * 1.35, 1.35);
  shape([[-.7, -.22], [-.48, -.63], [.17, -.75], [.64, -.43], [1.03, .03], [.98, .43], [.49, .62], [-.55, .53], [-.83, .23]],
    { fill: DN.shoe, stroke: DN.ink, lw, smooth: .55 });
  shape([[-.85, .28], [-.4, .47], [.47, .47], [1.01, .26], [.98, .52], [.48, .72], [-.6, .62]],
    { fill: DN.shoeShade, stroke: DN.ink, lw: lw * .75, smooth: .35 });
  line([[-.45, -.12], [.05, -.22], [.55, -.05]], { stroke: '#B77A55', lw: .12, smooth: true });
  line([[-.35, .1], [.38, .16]], { stroke: DN.shoeShade, lw: .19 });
  X.restore();
}

function dnHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  const palm = [[-.2, -.48], [.35, -.54], [.79, -.3], [.9, .16], [.56, .55], [0, .49]];
  shape(palm, { fill: DN.skin, stroke: DN.ink, lw, smooth: .7 });
  if (pose === 'fist') {
    line([[.54, -.17], [.79, -.11]], { stroke: DN.skinShade, lw: .1 });
  } else if (pose === 'point') {
    dnLimb([[.65, -.16], [1.55, -.19]], .23, DN.skin, lw * .55);
  } else {
    const spread = pose === 'palm' ? .3 : .13;
    [[.7, -.29], [.85, -.06], [.84, .17]].forEach(([ex, ey], i) => {
      const v = i - 1;
      dnLimb([[ex, ey], [ex + .45, ey + v * spread]], .19, DN.skin, lw * .45);
    });
    dnLimb([[.1, .33], [.5, .82]], .24, DN.skin, lw * .45);
  }
  X.restore();
}

function dnHead(o, t, lw, A) {
  const turn = clamp(o.turn || 0, -1, 1), shift = turn * .62;
  [-1, 1].forEach(sd => {
    ellipse(sd * 4.63 - turn * .23, .68, .75, 1.12, { fill: DN.skin, stroke: DN.ink, lw });
    ellipse(sd * 4.84 - turn * .23, .75, .3, .54, { fill: rgba(DN.skinShade, .46), stroke: null });
  });
  const face = [[0, -5.3], [3.35, -4.8], [4.55, -2.8], [4.7, .55], [4.27, 2.65], [3.25, 4.17],
    [1.42, 5.0], [0, 5.1], [-1.42, 5.0], [-3.25, 4.17], [-4.27, 2.65], [-4.7, .55], [-4.55, -2.8], [-3.35, -4.8]];
  shape(face, { fill: DN.skin, stroke: DN.ink, lw, smooth: .8 });
  X.save(); tracePath(face, true, .8); X.clip();
  ellipse(-1.8, -2.7, 2.5, 1.4, { fill: rgba(DN.skinLight, .32), stroke: null });
  ellipse(0, 5, 3.6, 1.25, { fill: rgba(DN.skinShade, .25), stroke: null });
  X.restore();
  [-1, 1].forEach(sd => ellipse(sd * 3.18 + shift * .35, 2.28, .9, .47, { fill: rgba(DN.cheek, .21 * (o.blush ?? 1)), stroke: null }));

  [-1, 1].forEach(sd => {
    const ex = sd * 2.12 + shift, ey = .16;
    dnEye(ex, ey, o, t, sd, lw);
    A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(ex, ey);
    const brow = o.brows || 'normal';
    const raise = brow === 'up' ? -.52 : brow === 'focused' ? .25 : brow === 'worried' ? (sd < 0 ? -.36 : .05) : 0;
    const inner = brow === 'focused' ? .34 : brow === 'worried' ? -.2 : 0;
    shape([[ex - .92, -1.72 + raise], [ex - .26, -2.03 + raise + inner], [ex + .53, -1.95 + raise],
      [ex + .92, -1.66 + raise], [ex + .48, -1.55 + raise], [ex - .3, -1.62 + raise]],
    { fill: DN.brow, stroke: DN.ink, lw: lw * .6, smooth: .5 });
  });
  // A small nose and the soft, confident smile in the reference.
  ellipse(shift * 1.12, 2.01, .44, .36, { fill: DN.skinShade, stroke: null, alpha: .43 });
  circle(shift * 1.12 - .14, 1.87, .14, { fill: rgba(DN.skinLight, .8), stroke: null });
  dnMouth(o.mouth || 'smile', shift, lw);
  A.mouth = toPx(shift, 3.36); A.head = toPx(0, 0);

  // Smooth side part and swept quiff from Danny's reference.
  const hair = [[-4.5, -1.0], [-4.86, -3.2], [-4.05, -5.23], [-2.8, -6.15],
    [-1.0, -6.65], [1.2, -6.6], [2.8, -5.95], [3.1, -4.65], [4.0, -4.7],
    [4.65, -3.55], [4.4, -.8], [3.95, -1.75], [3.55, -3.7], [2.5, -4.05],
    [1.35, -4.18], [.1, -3.7], [-1.2, -3.23], [-2.5, -3.45], [-3.35, -2.5], [-4.1, -1.65]];
  shape(hair, { fill: DN.hair, stroke: DN.ink, lw, smooth: .55 });
  withBoil(0, () => {
    line([[-4.05, -3.7], [-2.9, -4.15], [-1.6, -4.5], [.05, -5.55], [1.7, -5.85], [2.6, -5.5]],
      { stroke: DN.hairLight, lw: .28, smooth: true, alpha: .7 });
    line([[-2.9, -3.7], [-1.4, -3.9], [.5, -4.85], [2.6, -4.9]],
      { stroke: DN.hairLight, lw: .18, smooth: true, alpha: .55 });
    line([[3.45, -4.2], [4.02, -3.0], [4.05, -1.8]], { stroke: DN.hairLight, lw: .2, smooth: true });
  });
}

function dnEye(cx, cy, o, t, sd, lw) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = sd > 0 ? 'closed' : 'open';
  if (kind === 'happy' || kind === 'closed') {
    line([[cx - 1.05, cy + .17], [cx, cy + (kind === 'happy' ? -.44 : .37)], [cx + 1.05, cy + .17]],
      { stroke: DN.ink, lw: lw * 1.8, smooth: true });
    return;
  }
  if (kind === 'squeeze') {                              // screwed shut: > <
    const d = sd < 0 ? 1 : -1;
    line([[cx - d * .85, cy - .6], [cx + d * .6, cy], [cx - d * .85, cy + .6]], { stroke: DN.ink, lw: lw * 1.9 });
    return;
  }
  const wide = kind === 'wide' ? 1.15 : 1, rx = 1.2, ry = 1.33 * wide;
  ellipse(cx, cy, rx, ry, { fill: DN.eyeWhite, stroke: DN.ink, lw });
  const ix = cx + clamp(o.lookX || 0, -1, 1) * .35, iy = cy + .08 + clamp(o.lookY || 0, -1, 1) * .3;
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); X.clip();
  circle(ix, iy, .86, { fill: DN.iris, stroke: null });
  circle(ix, iy - .19, .57, { fill: DN.irisLight, stroke: null, alpha: .55 });
  circle(ix, iy, .58, { fill: DN.hairShade, stroke: null });
  circle(ix - .32, iy - .39, .28, { fill: '#FFFFFF', stroke: null });
  circle(ix + .31, iy + .31, .1, { fill: '#FFFFFF', stroke: null });
  const ph = (t + .8 + (o.blinkSeed || 0)) % 3.4;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (blink > .02) shape(rectPts(cx - 1.4, cy - 1.55, 2.8, 2.45 * blink), { fill: DN.skin, stroke: null });
  X.restore();
  line([[cx - 1.12, cy - .34], [cx - .72, cy - 1.12 * wide], [cx + .25, cy - 1.31 * wide], [cx + 1.08, cy - .53]],
    { stroke: DN.ink, lw: lw * 1.15, smooth: true });
}

function dnMouth(kind, x, lw) {
  if (kind === 'smile' || kind === 'smirk') {
    const right = kind === 'smirk' ? 2.87 : 3.24;
    line([[x - 1.1, 2.8], [x - .5, 3.13], [x + .2, 3.22], [x + 1.12, right]],
      { stroke: DN.mouth, lw: lw * 1.35, smooth: true });
  } else if (kind === 'grin' || kind === 'open') {
    shape([[x - 1.25, 2.7], [x, 2.89], [x + 1.3, 2.7], [x + .9, 3.73], [x, 3.94], [x - .9, 3.73]],
      { fill: DN.mouth, stroke: DN.ink, lw, smooth: .7 });
    if (kind === 'grin') shape(rectPts(x - 1.04, 2.7, 2.08, .48), { fill: DN.eyeWhite, stroke: null });
  } else if (kind === 'o') ellipse(x, 3.25, .36, .5, { fill: DN.mouth, stroke: DN.ink, lw });
  else if (kind === 'flat') line([[x - .83, 3.21], [x + .83, 3.21]], { stroke: DN.mouth, lw: lw * 1.25 });
  else if (kind === 'frown') line([[x - 1, 3.55], [x, 3.04], [x + 1, 3.55]], { stroke: DN.mouth, lw: lw * 1.25, smooth: true });
  else if (kind === 'wobble') line([[x - 1.1, 3.3], [x - .65, 3.05], [x - .2, 3.35], [x + .2, 3.05], [x + .65, 3.35], [x + 1.1, 3.1]], { stroke: DN.mouth, lw: lw * 1.3, smooth: true });
}

// Screen-space prop: x,y are the ball centre and s is Danny's pixel scale.
function dannyBall(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.spin || 0); X.scale(s, s);
  const r = o.radius ?? 1.35, lw = clamp(s * .11, 1.2, 4) / s;
  circle(0, 0, r, { fill: DN.ball, stroke: DN.ink, lw });
  shape(starPts(0, 0, r * .48, .86, 5), { fill: DN.ink, stroke: DN.ink, lw: lw * .65 });
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * TAU / 5, px = Math.cos(a) * r * .48, py = Math.sin(a) * r * .48;
    const edge = [Math.cos(a) * r * .9, Math.sin(a) * r * .9];
    line([[px, py], edge], { stroke: DN.ink, lw: lw * .7 });
  }
  circle(-r * .35, -r * .46, r * .22, { fill: 'rgba(255,255,255,.55)', stroke: null });
  X.restore();
}

// Screen-space grass block: an optional Minecraft-inspired building prop.
function dannyBlock(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s, s);
  const lw = clamp(s * .1, 1.2, 4) / s;
  shape([[-1.35, -.7], [0, -1.4], [1.35, -.7], [0, 0]], { fill: '#76AF42', stroke: DN.ink, lw });
  shape([[-1.35, -.7], [0, 0], [0, 1.5], [-1.35, .8]], { fill: '#98643D', stroke: DN.ink, lw });
  shape([[0, 0], [1.35, -.7], [1.35, .8], [0, 1.5]], { fill: '#724A30', stroke: DN.ink, lw });
  shape([[-1.35, -.7], [0, 0], [0, .4], [-.45, .17], [-.45, .02], [-.9, -.17], [-.9, -.02], [-1.35, -.25]], { fill: '#5E9736', stroke: null });
  shape([[0, 0], [1.35, -.7], [1.35, -.25], [.9, -.03], [.9, -.18], [.45, .05], [.45, .22], [0, .4]], { fill: '#467B2F', stroke: null });
  [[-.98, .18], [-.5, .63], [.4, .72], [.94, .18]].forEach(([bx, by], i) =>
    shape(rectPts(bx, by, .22, .2), { fill: i % 2 ? '#B88352' : '#5C3D29', stroke: null }));
  X.restore();
}

// Pose options for a short controlled dribble cycle; p is distance divided by stride.
function dannyDribble(p, k = 1) {
  const q = Math.sin(p * Math.PI), lift = Math.max(0, q), other = Math.max(0, -q);
  return {
    footL: [-1.55 + .5 * k * q, -1.05 - 2.0 * k * lift],
    footR: [1.55 + .5 * k * q, -1.05 - 2.0 * k * other],
    handL: [-4.25, -12.0 + .7 * k * q], handR: [4.25, -12.0 - .7 * k * q],
    lean: -.045 * k, tilt: .025 * k * q, dy: .15 * k * Math.abs(q),
  };
}

// Viewer-facing laptop so the Scratch blocks remain visible at pose-preview scale.
function dannyLaptop(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.scale(s, s);
  const lw = clamp(s * .1, 1.2, 4) / s, open = o.open ?? 1;
  shape([[-4.2, 0], [4.2, 0], [4.8, 2], [-4.8, 2]], { fill: '#AAB8CC', stroke: DN.ink, lw });
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      shape(rectPts(-3.65 + col * .74 - row * .08, .3 + row * .35, .56, .22), { fill: '#45516B', stroke: null });
    }
  }
  shape(rectPts(-.85, 1.4, 1.7, .4), { fill: '#DCE5EF', stroke: null });
  line([[-4.8, 2], [4.8, 2]], { stroke: '#697B96', lw: .18 });
  // The lid unfolds from the hinge; at zero it covers the keyboard.
  X.save(); X.scale(1, 1 - 3 * open);
  shape(rectPts(-4.2, 0, 8.4, 2), { fill: '#45516B', stroke: DN.ink, lw });
  X.restore();
  if (open > .05) {
    X.save(); X.scale(1, open);
    shape(rectPts(-3.85, -3.65, 7.7, 3.3), { fill: '#F6F8FC', stroke: null });
    shape(rectPts(-3.85, -3.65, 7.7, .6), { fill: '#855CD6', stroke: null });
    X.fillStyle = '#FFFFFF'; X.font = 'bold .43px sans-serif'; X.textAlign = 'left';
    X.fillText('Scratch', -3.57, -3.22);
    shape([ [2.3, -3.5], [2.3, -3.12], [2.75, -3.25], [2.3, -3.38] ], { fill: '#63CD78', stroke: null });
    circle(3.18, -3.31, .14, { fill: '#F47777', stroke: null });
    shape(rectPts(-3.85, -3.05, 1.05, 2.7), { fill: '#E2E8F2', stroke: null });
    ['#FFBF00', '#4C97FF', '#9966FF', '#FFAB19'].forEach((col, i) => {
      shape(rectPts(-3.7, -2.85 + i * .57, .74, .3), { fill: col, stroke: null });
    });
    // Interlocking event, control, motion, and looks blocks.
    const labels = ['when flag clicked', 'repeat 10', 'move 10 steps', 'say Hello!'];
    ['#FFBF00', '#FFAB19', '#4C97FF', '#9966FF'].forEach((col, i) => {
      const bx = -2.48 + (i > 1 ? .22 : 0), by = -2.83 + i * .55;
      shape([[bx, by], [bx + .3, by], [bx + .4, by + .1], [bx + .75, by + .1],
        [bx + .85, by], [bx + 2.9, by], [bx + 2.9, by + .5], [bx + .85, by + .5],
        [bx + .75, by + .6], [bx + .4, by + .6], [bx + .3, by + .5], [bx, by + .5]],
      { fill: col, stroke: null });
      X.fillStyle = '#FFFFFF'; X.font = 'bold .25px sans-serif';
      X.fillText(labels[i], bx + .12, by + .34);
    });
    shape(rectPts(1.05, -2.87, 2.5, 2.3), { fill: '#FFFFFF', stroke: '#CDD6E4', lw: .06 });
    // A little orange cat on the Scratch stage.
    const catX = 2.25 + .18 * Math.sin((o.t ?? 0) * 3);
    ellipse(catX, -1.25, .45, .35, { fill: '#FF9D32', stroke: null });
    shape([[catX - .42, -1.68], [catX - .38, -2.22], [catX - .1, -2.02],
      [catX + .15, -2.02], [catX + .4, -2.22], [catX + .45, -1.68]], { fill: '#FF9D32', stroke: null });
    ellipse(catX, -1.74, .45, .35, { fill: '#FF9D32', stroke: null });
    [-1, 1].forEach(sd => circle(catX + sd * .18, -1.83, .07, { fill: DN.ink, stroke: null }));
    line([[catX + .35, -1.23], [catX + .72, -1.35], [catX + .7, -1.63]], { stroke: '#FF9D32', lw: .16, smooth: true });
    X.restore();
  }
  X.restore();
}

function dannyIdea(x, y, s, t, glow = 1) {
  X.save(); X.translate(x, y); X.scale(s, s);
  const lw = clamp(s * .1, 1.2, 4) / s;
  circle(0, 0, 2.15, { fill: rgba('#FFD45C', (.12 + .04 * wob(t, 1)) * glow), stroke: null });
  ellipse(0, -.2, 1.05, 1.2, { fill: mixCol('#E2D9B8', '#FFE477', glow), stroke: DN.ink, lw });
  shape(rectPts(-.5, .65, 1, .65), { fill: '#AAB8CC', stroke: DN.ink, lw });
  line([[-.45, .97], [.45, .97]], { stroke: '#697B96', lw: .12 });
  line([[-.35, -.2], [0, .18], [.35, -.2]], { stroke: '#D29128', lw: .13 });
  if (glow > .01) {
    for (let i = 0; i < 5; i++) {
      const a = Math.PI + i * Math.PI / 4;
      line([[Math.cos(a) * 1.65, Math.sin(a) * 1.65 - .2],
        [Math.cos(a) * 2.2, Math.sin(a) * 2.2 - .2]], { stroke: '#E9AB32', lw: .18, alpha: glow });
    }
  }
  X.restore();
}

// Six-second loop: pull out, open, type, then close and tuck away.
function dannyProgrammer(x, y, s, t) {
  const p = ((t % 6) + 6) % 6;
  const pull = ease(seg(p, 0, .8)) * (1 - ease(seg(p, 5.3, 6)));
  const open = ease(seg(p, .65, 1.35)) * (1 - ease(seg(p, 4.95, 5.4)));
  const typing = ease(seg(p, 1.3, 1.6)) * (1 - ease(seg(p, 4.7, 5)));
  const laptopX = lerp(4.3, 0, pull), laptopY = lerp(-8.5, -12.2, pull);
  const handL = mixPt([-3.5, -9.8], [-1.9, laptopY + 1.05 + .13 * wob(t, 5)], pull);
  const handR = [laptopX + 1.9, laptopY + 1.05 - .13 * wob(t, 5) * typing];
  const A = danny(x, y, s, { t, handL, handR, handPoseL: 'fist', handPoseR: 'fist',
    lookY: .8 * open, brows: typing ? 'focused' : 'up', mouth: 'smile', breathe: false });
  X.save(); X.globalAlpha *= pull;
  dannyLaptop(x + laptopX * s, y + laptopY * s, s, { open, t });
  // Keep typing hands in front of the keyboard, using the rig's actual endpoints.
  [A.handL, A.handR].forEach((hand, i) => {
    X.save(); X.translate(hand[0], hand[1]); X.scale(s, s);
    ellipse(0, 0, .62, .32, { fill: DN.skin, stroke: DN.ink, lw: clamp(s * .1, 1.2, 4) / s });
    for (let finger = 0; finger < 3; finger++) {
      line([[-.3 + finger * .22, -.1], [-.3 + finger * .22, .14 + .06 * typing * wob(t, 5, i * .5)]],
        { stroke: DN.skinShade, lw: .08 });
    }
    X.restore();
  });
  X.restore();
  dannyIdea(A.top[0], A.top[1] - 2.7 * s, s, t, open);
  return A;
}

CHARACTERS.danny = {
  draw: danny, unit: DANNY_UNIT, palette: DN, size: [14, 30],
  poses: {
    'rest': (x, y, s, t) => danny(x, y, s, { t, mouth: 'grin' }),
    'hello': (x, y, s, t) => danny(x, y, s, { t, handR: [4.1 + .22 * wob(t, 1.5), -19.2], handPoseR: 'palm', mouth: 'grin', brows: 'up', tilt: -.05 }),
    'pockets': (x, y, s, t) => danny(x, y, s, { t, handL: [-2.0, -9.5], handR: [2.0, -9.5], handPoseL: 'fist', handPoseR: 'fist', mouth: 'grin' }),
    'ready': (x, y, s, t) => { dannyBall(x + 4.2 * s, y - 1.35 * s, s); return danny(x, y, s, { t, handL: [-4.2, -11.7], handR: [4.2, -11.7], footL: [-2, -1.05], footR: [2, -1.05], brows: 'focused', mouth: 'smirk', dy: .38 }); },
    'dribble': (x, y, s, t) => { const p = t * 2; dannyBall(x + (2.9 + .6 * Math.sin(p * Math.PI)) * s, y - (1.35 + .2 * Math.abs(Math.sin(p * Math.PI))) * s, s, { spin: t * 3 }); return danny(x, y, s, { ...dannyDribble(p), t, brows: 'focused', mouth: 'smile', lookY: .55 }); },
    'kick': (x, y, s, t) => { dannyBall(x + (5.9 + .3 * Math.sin(t * 2.2)) * s, y - 2.5 * s, s, { spin: t * 5 }); return danny(x, y, s, { t, footR: [4.7, -3.7], footL: [-1.75, -1.05], handL: [-4.5, -13.5], handR: [4.3, -14.4], lean: -.15, rot: -.035, mouth: 'grin', brows: 'focused' }); },
    'builder': (x, y, s, t) => { const A = danny(x, y, s, { t, handL: [-3.2, -13], handR: [3.2, -13], handPoseL: 'fist', handPoseR: 'fist', mouth: 'grin', lookY: .5 }); dannyBlock(A.handL[0], A.handL[1] - .7 * s, s, { ang: -.1 }); return A; },
    'block tower': (x, y, s, t) => { for (let i = 0; i < 3; i++) dannyBlock(x + 5.5 * s, y - (1.5 + 1.5 * i) * s, s); return danny(x, y, s, { t, handR: [4.4, -11.5], handPoseR: 'point', mouth: 'grin', brows: 'up', lookX: .7 }); },
    'programmer': dannyProgrammer,
    'goofy': (x, y, s, t) => danny(x, y, s, { t, eyes: 'wink', mouth: 'grin', handL: [-4.5, -15.6], handR: [4.5, -15.6], handPoseL: 'palm', handPoseR: 'palm', tilt: .13 * Math.sin(t * 3), lean: -.06 }),
    'goal!': (x, y, s, t) => danny(x, y, s, { t, handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: 1.2 * Math.abs(Math.sin(t * 3)) }),
    'laugh': (x, y, s, t) => danny(x, y, s, { t, eyes: 'happy', mouth: 'open', handL: [-3.5, -12.1], handR: [3.5, -12.1], tilt: -.1, dy: .18 * Math.abs(Math.sin(t * 10)) }),
    'surprised': (x, y, s, t) => danny(x, y, s, { t, eyes: 'wide', brows: 'up', mouth: 'o', handL: [-4.3, -14], handR: [4.3, -14], handPoseL: 'palm', handPoseR: 'palm' }),
  },
};
