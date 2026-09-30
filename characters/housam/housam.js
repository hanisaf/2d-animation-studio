// Housam: a soccer-playing teenager with a knack for mathematics.
// (x, y) is the floor point between his feet; s is pixels per local unit.
// Feet are y=0, the jersey hem is y=-10, eyes are near y=-25, hair top is y=-32.
// All movement is a pure function of pose options and time.

const HO = {
  ink: '#3B2530', skin: '#DCA887', skinShade: '#BC8068', skinLight: '#F3C5A6',
  cheek: '#D88B78', hair: '#282027', hairShade: '#17151B', hairLight: '#554149',
  brow: '#34252B', eyeWhite: '#FFF9F2', iris: '#754622', irisLight: '#B17A40',
  mouth: '#843C45', jersey: '#F1F0EA', jerseyShade: '#D5D8DB', blue: '#425DA0',
  blueDark: '#2C4684', crest: '#5D8795', shorts: '#363641', shortsLight: '#52515D',
  shoe: '#F8F7F2', shoeShade: '#D7D8DC', ball: '#FBFBF7',
};
const HOUSAM_UNIT = 5.25; // ~168 world units tall

function housam(x, y, s, o = {}) {
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
      hoLimb([hip, joint, end], .94, HO.skin, lw);
      // A soft knee cap and slim ankle keep the teenage silhouette.
      circle(joint[0], joint[1], .39, { fill: HO.skin, stroke: null });
      line([[joint[0] - sd * .1, joint[1] + .5], [end[0], end[1]]], { stroke: rgba(HO.skinShade, .35), lw: .16 });
      hoShoe(end, sd, lw);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
      A[sd < 0 ? 'kneeL' : 'kneeR'] = toPx(joint[0], joint[1]);
    });

    // Shorts and torso lean together about the hips.
    X.save(); X.translate(0, dy); X.translate(0, -8.6); X.rotate(o.lean || 0); X.translate(0, 8.6);
    hoShorts(lw);
    const breath = o.breathe === false ? 0 : .025 * wob(t, .35);
    X.save(); X.translate(0, -14); X.scale(1 + breath, 1 + breath); X.translate(0, 14);
    hoJersey(lw);
    A.chest = toPx(0, -15.2); A.belly = toPx(0, -11.3);
    X.restore();

    // Neck and head have a separate tilt control.
    shape(rectPts(-.82, -20.1, 1.64, 2.1), { fill: HO.skin, stroke: HO.ink, lw, smooth: .3 });
    ellipse(0, -18.7, .85, .28, { fill: rgba(HO.skinShade, .4), stroke: null });
    X.save(); X.translate(0, -25.3); X.rotate(o.tilt || 0);
    hoHead(o, t, lw, A);
    A.top = toPx(0, -6.7);
    X.restore();

    // Arms use two-bone IK; sleeves stop above the elbows.
    [[-1, o.handL || [-4.05, -10.7], o.handPoseL || 'open'],
      [1, o.handR || [4.05, -10.7], o.handPoseR || 'open']].forEach(([sd, target, pose]) => {
      const shoulder = [sd * 2.9, -17.45];
      const { joint, end } = ik2(shoulder, target, 3.45, 3.7, [sd * .8, .25]);
      hoLimb([shoulder, joint, end], .89, HO.skin, lw);
      const cuff = mixPt(shoulder, joint, .6);
      hoLimb([shoulder, cuff], 1.53, HO.jersey, lw);
      line([mixPt(shoulder, cuff, .24), mixPt(shoulder, cuff, .8)], { stroke: HO.blue, lw: .18 });
      line([[cuff[0] - sd * .61, cuff[1]], [cuff[0] + sd * .61, cuff[1]]], { stroke: HO.jerseyShade, lw: .13 });
      const angle = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      hoHand(end, angle, sd, pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0], end[1]);
    });
    X.restore();
  });
  X.restore();
  return A;
}

function hoLimb(points, width, fill, lw) {
  withBoil(0, () => {
    line(points, { stroke: HO.ink, lw: width + lw * 1.8 });
    line(points, { stroke: fill, lw: width });
  });
}

function hoShorts(lw) {
  const outline = [[-2.65, -10.1], [2.65, -10.1], [2.75, -6.65], [.5, -6.65], [0, -8.15], [-.5, -6.65], [-2.75, -6.65]];
  shape(outline, { fill: HO.shorts, stroke: HO.ink, lw, smooth: .3 });
  shape([[-2.65, -10], [-1.7, -9.95], [-1.65, -7], [-2.73, -6.75]], { fill: rgba(HO.shortsLight, .6), stroke: null });
  line([[0, -9.9], [0, -8.15]], { stroke: rgba('#9B9AA6', .5), lw: .11 });
  line([[-2.6, -7.0], [-.62, -7.0]], { stroke: HO.shortsLight, lw: .16 });
  line([[.62, -7.0], [2.6, -7.0]], { stroke: HO.shortsLight, lw: .16 });
}

function hoJersey(lw) {
  const body = [[-1.2, -18.4], [-2.85, -18.2], [-3.35, -16.45], [-3.15, -10.05],
    [-2.25, -9.88], [0, -9.92], [2.25, -9.88], [3.15, -10.05], [3.35, -16.45], [2.85, -18.2], [1.2, -18.4]];
  shape(body, { fill: HO.jersey, stroke: HO.ink, lw, smooth: .4 });
  X.save(); tracePath(body, true, .4); X.clip();
  shape([[-3.45, -18.6], [-2.75, -18.6], [-2.75, -9.7], [-3.45, -9.7]], { fill: HO.blue, stroke: null });
  shape([[2.75, -18.6], [3.45, -18.6], [3.45, -9.7], [2.75, -9.7]], { fill: HO.blue, stroke: null });
  shape([[-3.25, -10.6], [3.25, -10.6], [3.25, -9.84], [-3.25, -9.84]], { fill: rgba(HO.jerseyShade, .42), stroke: null });
  X.restore();
  // Crew neck and the double shoulder piping from the reference.
  shape([[-1.16, -18.47], [0, -17.95], [1.16, -18.47], [.9, -18.75], [0, -18.29], [-.9, -18.75]],
    { fill: HO.blue, stroke: HO.ink, lw: lw * .65, smooth: .5 });
  [-1, 1].forEach(sd => {
    line([[sd * 1.25, -18.5], [sd * 2.45, -18.16], [sd * 3.1, -17.25]], { stroke: HO.blue, lw: .25, smooth: true });
    line([[sd * 1.45, -18.72], [sd * 2.62, -18.36], [sd * 3.23, -17.44]], { stroke: HO.blue, lw: .12, smooth: true });
  });
  // Small soccer shield on his left chest (screen-right).
  shape([[1.22, -16.7], [2.25, -16.7], [2.27, -15.75], [1.74, -15.38], [1.2, -15.75]],
    { fill: HO.crest, stroke: HO.blueDark, lw: .12 });
  shape([[1.35, -16.56], [2.1, -16.56], [2.09, -15.82], [1.74, -15.55], [1.37, -15.82]],
    { fill: HO.jersey, stroke: null });
  circle(1.73, -16.12, .28, { fill: HO.ball, stroke: HO.blueDark, lw: .09 });
  shape(starPts(1.73, -16.12, .15, .7, 5), { fill: HO.blueDark, stroke: null });
}

function hoShoe(p, sd, lw) {
  X.save(); X.translate(p[0], p[1]); X.scale(sd, 1);
  shape([[-.7, -.22], [-.48, -.63], [.17, -.75], [.64, -.43], [1.03, .03], [.98, .43], [.49, .62], [-.55, .53], [-.83, .23]],
    { fill: HO.shoe, stroke: HO.ink, lw, smooth: .55 });
  shape([[-.85, .28], [-.4, .47], [.47, .47], [1.01, .26], [.98, .52], [.48, .72], [-.6, .62]],
    { fill: HO.shoeShade, stroke: HO.ink, lw: lw * .75, smooth: .35 });
  [-.38, -.17, .04].forEach(v => line([[-.28, v], [.32, v + .07]], { stroke: HO.shoeShade, lw: .11 }));
  X.restore();
}

function hoHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  const palm = [[-.2, -.48], [.35, -.54], [.79, -.3], [.9, .16], [.56, .55], [0, .49]];
  shape(palm, { fill: HO.skin, stroke: HO.ink, lw, smooth: .7 });
  if (pose === 'fist') {
    line([[.54, -.17], [.79, -.11]], { stroke: HO.skinShade, lw: .1 });
  } else if (pose === 'point') {
    hoLimb([[.65, -.16], [1.55, -.19]], .23, HO.skin, lw * .55);
  } else {
    const spread = pose === 'palm' ? .3 : .13;
    [[.7, -.29], [.85, -.06], [.84, .17]].forEach(([ex, ey], i) => {
      const v = i - 1;
      hoLimb([[ex, ey], [ex + .45, ey + v * spread]], .19, HO.skin, lw * .45);
    });
    hoLimb([[.1, .33], [.5, .82]], .24, HO.skin, lw * .45);
  }
  X.restore();
}

function hoHead(o, t, lw, A) {
  const turn = clamp(o.turn || 0, -1, 1), shift = turn * .62;
  [-1, 1].forEach(sd => {
    ellipse(sd * 4.63 - turn * .23, .68, .75, 1.12, { fill: HO.skin, stroke: HO.ink, lw });
    ellipse(sd * 4.84 - turn * .23, .75, .3, .54, { fill: rgba(HO.skinShade, .46), stroke: null });
  });
  const face = [[0, -5.3], [3.35, -4.8], [4.55, -2.8], [4.7, .55], [4.27, 2.65], [3.25, 4.17],
    [1.42, 5.0], [0, 5.1], [-1.42, 5.0], [-3.25, 4.17], [-4.27, 2.65], [-4.7, .55], [-4.55, -2.8], [-3.35, -4.8]];
  shape(face, { fill: HO.skin, stroke: HO.ink, lw, smooth: .8 });
  X.save(); tracePath(face, true, .8); X.clip();
  ellipse(-1.8, -2.7, 2.5, 1.4, { fill: rgba(HO.skinLight, .32), stroke: null });
  ellipse(0, 5, 3.6, 1.25, { fill: rgba(HO.skinShade, .25), stroke: null });
  X.restore();
  [-1, 1].forEach(sd => ellipse(sd * 3.18 + shift * .35, 2.28, .9, .47, { fill: rgba(HO.cheek, .21 * (o.blush ?? 1)), stroke: null }));

  [-1, 1].forEach(sd => {
    const ex = sd * 2.12 + shift, ey = .16;
    hoEye(ex, ey, o, t, sd, lw);
    A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(ex, ey);
    const brow = o.brows || 'normal';
    const raise = brow === 'up' ? -.52 : brow === 'focused' ? .25 : brow === 'worried' ? (sd < 0 ? -.36 : .05) : 0;
    const inner = brow === 'focused' ? .34 : brow === 'worried' ? -.2 : 0;
    shape([[ex - .92, -1.72 + raise], [ex - .26, -2.03 + raise + inner], [ex + .53, -1.95 + raise],
      [ex + .92, -1.66 + raise], [ex + .48, -1.55 + raise], [ex - .3, -1.62 + raise]],
    { fill: HO.brow, stroke: HO.ink, lw: lw * .6, smooth: .5 });
  });
  // A small nose and the soft, confident smile in the reference.
  ellipse(shift * 1.12, 2.01, .44, .36, { fill: HO.skinShade, stroke: null, alpha: .43 });
  circle(shift * 1.12 - .14, 1.87, .14, { fill: rgba(HO.skinLight, .8), stroke: null });
  hoMouth(o.mouth || 'smile', shift, lw);
  A.mouth = toPx(shift, 3.36); A.head = toPx(0, 0);

  // Tousled dark hair: rounded crown, irregular short fringe, sculpted strands.
  const hair = [[-4.5, -1.15], [-4.85, -3.2], [-4.15, -5.24], [-3.25, -6.03], [-2.15, -6.31],
    [-1.4, -6.08], [-.65, -6.64], [.42, -6.48], [1.2, -6.15], [2.08, -6.34], [3.08, -5.86],
    [4.05, -4.95], [4.48, -3.68], [4.38, -.95], [3.9, -1.9], [3.2, -3.55], [2.3, -3.62],
    [1.62, -3.02], [1.07, -3.77], [.35, -3.5], [-.37, -3.08], [-1.13, -3.33],
    [-2.1, -2.7], [-3.02, -2.47], [-3.87, -1.68]];
  shape(hair, { fill: HO.hair, stroke: HO.ink, lw, smooth: .45 });
  withBoil(0, () => {
    line([[-3.75, -4.4], [-2.48, -5.55], [-.8, -5.83], [.95, -5.52]], { stroke: HO.hairLight, lw: .31, smooth: true, alpha: .75 });
    line([[.45, -6.05], [2.2, -5.84], [3.67, -4.76]], { stroke: HO.hairLight, lw: .25, smooth: true, alpha: .7 });
    line([[-2.96, -4.32], [-1.83, -3.25]], { stroke: HO.hairShade, lw: .26 });
    line([[2.38, -4.71], [1.06, -3.65]], { stroke: HO.hairShade, lw: .25 });
  });
}

function hoEye(cx, cy, o, t, sd, lw) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = sd > 0 ? 'closed' : 'open';
  if (kind === 'happy' || kind === 'closed') {
    line([[cx - 1.05, cy + .17], [cx, cy + (kind === 'happy' ? -.44 : .37)], [cx + 1.05, cy + .17]],
      { stroke: HO.ink, lw: lw * 1.8, smooth: true });
    return;
  }
  if (kind === 'squeeze') {                              // screwed shut: > <
    const d = sd < 0 ? 1 : -1;
    line([[cx - d * .85, cy - .6], [cx + d * .6, cy], [cx - d * .85, cy + .6]], { stroke: HO.ink, lw: lw * 1.9 });
    return;
  }
  const wide = kind === 'wide' ? 1.15 : 1, rx = 1.2, ry = 1.33 * wide;
  ellipse(cx, cy, rx, ry, { fill: HO.eyeWhite, stroke: HO.ink, lw });
  const ix = cx + clamp(o.lookX || 0, -1, 1) * .35, iy = cy + .08 + clamp(o.lookY || 0, -1, 1) * .3;
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); X.clip();
  circle(ix, iy, .86, { fill: HO.iris, stroke: null });
  circle(ix, iy - .19, .57, { fill: HO.irisLight, stroke: null, alpha: .55 });
  circle(ix, iy, .58, { fill: HO.hairShade, stroke: null });
  circle(ix - .32, iy - .39, .28, { fill: '#FFFFFF', stroke: null });
  circle(ix + .31, iy + .31, .1, { fill: '#FFFFFF', stroke: null });
  const ph = (t + .8 + (o.blinkSeed || 0)) % 3.4;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (blink > .02) shape(rectPts(cx - 1.4, cy - 1.55, 2.8, 2.45 * blink), { fill: HO.skin, stroke: null });
  X.restore();
  line([[cx - 1.12, cy - .34], [cx - .72, cy - 1.12 * wide], [cx + .25, cy - 1.31 * wide], [cx + 1.08, cy - .53]],
    { stroke: HO.ink, lw: lw * 1.15, smooth: true });
}

function hoMouth(kind, x, lw) {
  if (kind === 'smile' || kind === 'smirk') {
    const right = kind === 'smirk' ? 2.87 : 3.24;
    line([[x - 1.1, 2.8], [x - .5, 3.13], [x + .2, 3.22], [x + 1.12, right]],
      { stroke: HO.mouth, lw: lw * 1.35, smooth: true });
  } else if (kind === 'grin' || kind === 'open') {
    shape([[x - 1.25, 2.7], [x, 2.89], [x + 1.3, 2.7], [x + .9, 3.73], [x, 3.94], [x - .9, 3.73]],
      { fill: HO.mouth, stroke: HO.ink, lw, smooth: .7 });
    if (kind === 'grin') shape(rectPts(x - 1.04, 2.7, 2.08, .48), { fill: HO.eyeWhite, stroke: null });
  } else if (kind === 'o') ellipse(x, 3.25, .36, .5, { fill: HO.mouth, stroke: HO.ink, lw });
  else if (kind === 'flat') line([[x - .83, 3.21], [x + .83, 3.21]], { stroke: HO.mouth, lw: lw * 1.25 });
  else if (kind === 'frown') line([[x - 1, 3.55], [x, 3.04], [x + 1, 3.55]], { stroke: HO.mouth, lw: lw * 1.25, smooth: true });
  else if (kind === 'wobble') line([[x - 1.1, 3.3], [x - .65, 3.05], [x - .2, 3.35], [x + .2, 3.05], [x + .65, 3.35], [x + 1.1, 3.1]], { stroke: HO.mouth, lw: lw * 1.3, smooth: true });
}

// Screen-space prop: x,y are the ball centre and s is Housam's pixel scale.
function housamBall(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.spin || 0); X.scale(s, s);
  const r = o.radius ?? 1.35, lw = clamp(s * .11, 1.2, 4) / s;
  circle(0, 0, r, { fill: HO.ball, stroke: HO.ink, lw });
  shape(starPts(0, 0, r * .48, .86, 5), { fill: HO.shorts, stroke: HO.ink, lw: lw * .65 });
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * TAU / 5, px = Math.cos(a) * r * .48, py = Math.sin(a) * r * .48;
    const edge = [Math.cos(a) * r * .9, Math.sin(a) * r * .9];
    line([[px, py], edge], { stroke: HO.ink, lw: lw * .7 });
  }
  circle(-r * .35, -r * .46, r * .22, { fill: 'rgba(255,255,255,.55)', stroke: null });
  X.restore();
}

// Screen-space notebook, held near a hand anchor to show his mathematical side.
function housamNotebook(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.ang ?? -.12); X.scale(s, s);
  const lw = clamp(s * .1, 1.2, 4) / s;
  shape([[-1.4, -1.65], [1.3, -1.65], [1.3, 1.6], [-1.4, 1.6]], { fill: '#F6F3E9', stroke: HO.blueDark, lw });
  line([[-1.05, -1.55], [-1.05, 1.48]], { stroke: '#D59393', lw: .08 });
  [-.92, -.36, .2, .76, 1.32].forEach(v => line([[-1.25, v], [1.18, v]], { stroke: '#B7CBE3', lw: .07 }));
  X.fillStyle = HO.blueDark; X.font = 'bold 1.03px serif'; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.fillText('x² + y²', .05, -.54); X.fillText('= r²', .05, .52);
  X.restore();
}

// Pose options for a short controlled dribble cycle; p is distance divided by stride.
function housamDribble(p, k = 1) {
  const q = Math.sin(p * Math.PI), lift = Math.max(0, q), other = Math.max(0, -q);
  return {
    footL: [-1.55 + .5 * k * q, -1.05 - 2.0 * k * lift],
    footR: [1.55 + .5 * k * q, -1.05 - 2.0 * k * other],
    handL: [-4.25, -12.0 + .7 * k * q], handR: [4.25, -12.0 - .7 * k * q],
    lean: -.045 * k, tilt: .025 * k * q, dy: .15 * k * Math.abs(q),
  };
}

CHARACTERS.housam = {
  draw: housam, unit: HOUSAM_UNIT, palette: HO, size: [14, 33],
  poses: {
    'rest': (x, y, s, t) => housam(x, y, s),
    'hello': (x, y, s, t) => housam(x, y, s, { handR: [4.7 + .22 * wob(t, 1.5), -24.3], handPoseR: 'palm', mouth: 'grin', brows: 'up', tilt: -.05 }),
    'ready': (x, y, s, t) => { housamBall(x + 4.2 * s, y - 1.35 * s, s); return housam(x, y, s, { handL: [-4.7, -12.7], handR: [4.7, -12.7], footL: [-2, -1.05], footR: [2, -1.05], brows: 'focused', mouth: 'smirk', dy: .38 }); },
    'dribble': (x, y, s, t) => { const p = t * 2; housamBall(x + (2.9 + .6 * Math.sin(p * Math.PI)) * s, y - (1.35 + .2 * Math.abs(Math.sin(p * Math.PI))) * s, s, { spin: t * 3 }); return housam(x, y, s, { ...housamDribble(p), brows: 'focused', mouth: 'smile', lookY: .55 }); },
    'kick': (x, y, s, t) => { const q = Math.sin(t * 2.2) * .3; housamBall(x + (5.9 + q) * s, y - 2.5 * s, s, { spin: t * 5 }); return housam(x, y, s, { footR: [4.7, -3.7], footL: [-1.75, -1.05], handL: [-5, -14.5], handR: [4.7, -15.4], lean: -.15, rot: -.035, mouth: 'grin', brows: 'focused' }); },
    'juggle': (x, y, s, t) => { const h = 2.1 + 2.1 * Math.abs(Math.sin(t * 3.1)); const A = housam(x, y, s, { footR: [2.4, -2.1], handL: [-4.9, -13], handR: [4.8, -13], mouth: 'grin', lookY: .75 }); housamBall(x + 3.7 * s, y - h * s, s, { spin: t * 4 }); return A; },
    'thinking': (x, y, s, t) => housam(x, y, s, { handR: [1.1, -21.2], handPoseR: 'fist', handL: [-3.6, -11.8], brows: 'focused', mouth: 'flat', lookX: -.55, lookY: -.6, tilt: .08 }),
    'math genius': (x, y, s, t) => { const A = housam(x, y, s, { handL: [-2.6, -15.2], handR: [4.6, -22.6], handPoseR: 'point', brows: 'up', mouth: 'grin', lookY: -.2 }); housamNotebook(A.handL[0] + .1 * s, A.handL[1] - 1.15 * s, s); return A; },
    'eureka!': (x, y, s, t) => { const A = housam(x, y, s, { handR: [4.1, -24], handPoseR: 'point', eyes: 'wide', brows: 'up', mouth: 'grin', jump: .35 + .2 * wob(t, .7) }); X.save(); X.fillStyle = HO.blueDark; X.font = `${Math.max(26, s * 2)}px serif`; X.textAlign = 'center'; X.fillText('π', A.head[0] + 6.4 * s, A.top[1] + 2.1 * s); X.restore(); return A; },
    'laugh': (x, y, s, t) => housam(x, y, s, { eyes: 'happy', mouth: 'open', handL: [-4.1, -14.1], handR: [4.1, -14.1], tilt: -.1, dy: .18 * Math.abs(Math.sin(t * 10)) }),
    'surprised': (x, y, s, t) => housam(x, y, s, { eyes: 'wide', brows: 'up', mouth: 'o', handL: [-4.3, -15], handR: [4.3, -15], handPoseL: 'palm', handPoseR: 'palm' }),
  },
};
