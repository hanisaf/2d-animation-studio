// Danny: a funny six-year-old who loves soccer and Minecraft.
// (x, y) is the floor point between his feet; s is pixels per local unit.
// Feet are y=0, the jersey hem is y=-10, eyes are near y=-22, hair top is y=-29.
// All movement is a pure function of pose options and time.

const DN = {
  ink: '#3B2530', skin: '#F5D2BC', skinShade: '#D6A18C', skinLight: '#FFEADB',
  cheek: '#D88B78', hair: '#49372C', hairShade: '#30251F', hairLight: '#705342',
  brow: '#49372C', eyeWhite: '#FFFDF8', iris: '#4A2D20', irisLight: '#79503A',
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
    const earX = sd * 4.35 - turn * .23;
    ellipse(earX, 1.05, .63, 1.22, { fill: DN.skin, stroke: DN.ink, lw, rot: sd * .2 });
    shape([[earX - sd * .1, 1.8], [earX + sd * .3, 1.5], [earX + sd * .33, .32],
      [earX - sd * .12, .13], [earX - sd * .27, .8], [earX, 1.15]],
      { fill: rgba(DN.skinShade, .7), stroke: DN.ink, lw: lw * .55, smooth: .65 });
  });
  const face = [[0, -5.3], [3.15, -4.6], [3.94, -2.65], [4.05, .45], [3.74, 2.6],
    [2.9, 3.95], [1.35, 4.95], [0, 5.18], [-1.35, 4.95], [-2.9, 3.95],
    [-3.74, 2.6], [-4.05, .45], [-3.94, -2.65], [-3.15, -4.6]];
  shape(face, { fill: DN.skin, stroke: DN.ink, lw, smooth: .8 });
  X.save(); tracePath(face, true, .8); X.clip();
  ellipse(-1.7, -2.6, 2.35, 1.45, { fill: rgba(DN.skinLight, .12), stroke: null });
  shape([[2.95, -3.2], [3.85, -1.8], [3.8, 1.9], [3.1, 3.55], [2.75, 3.8],
    [3.2, 1.6], [3.35, -.6]], { fill: rgba(DN.skinShade, .19), stroke: null, smooth: .7 });
  X.restore();
  [-1, 1].forEach(sd => ellipse(sd * 2.9 + shift * .35, 2.1, .65, .32,
    { fill: rgba(DN.cheek, .12 * (o.blush ?? 1)), stroke: null }));

  [-1, 1].forEach(sd => {
    const ex = sd * 1.78 + shift, ey = -.35;
    dnEye(ex, ey, o, t, sd, lw);
    A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(ex, ey);
    const brow = o.brows || 'normal';
    const raise = brow === 'up' ? -.52 : brow === 'focused' ? .25 : brow === 'worried' ? -.25 : 0;
    const inner = brow === 'focused' ? .34 : brow === 'worried' ? -.2 : 0;
    // Mirror the high outer arch and broad, rounded inner end of each brow.
    shape([[ex - sd * 1.05, -1.52 + raise + inner], [ex - sd * .85, -1.9 + raise + inner],
      [ex - sd * .1, -2.04 + raise], [ex + sd * .65, -1.89 + raise],
      [ex + sd * 1.13, -1.38 + raise], [ex + sd * .45, -1.62 + raise],
      [ex - sd * .3, -1.64 + raise]],
      { fill: DN.brow, stroke: DN.ink, lw: lw * .5, smooth: .65 });
  });
  // Soft bridge, rounded nose tip, and short nostril contours.
  shape([[shift + .36, -.85], [shift + .49, .25], [shift + .77, 1.25],
    [shift + .41, 1.62], [shift - .15, 1.55], [shift - .48, 1.3], [shift + .05, 1.17]],
    { fill: rgba(DN.skinShade, .3), stroke: null, smooth: .8 });
  line([[shift - .82, .98], [shift - .87, 1.41], [shift - .61, 1.52]],
    { stroke: DN.ink, lw: lw * .65, smooth: true });
  line([[shift - .57, 1.4], [shift - .28, 1.48], [shift + .09, 1.68],
    [shift + .4, 1.56], [shift + .64, 1.37], [shift + .83, 1.35], [shift + .86, 1.02]],
    { stroke: DN.ink, lw: lw * .7, smooth: true });
  ellipse(shift - .17, .97, .1, .2, { fill: rgba(DN.skinLight, .8), stroke: null });
  dnMouth(o.mouth || 'smile', shift, lw);
  A.mouth = toPx(shift, 2.94); A.head = toPx(0, 0);

  // Tousled, swept waves frame the forehead and taper into the sideburns.
  const hair = [[-3.9, 1.05], [-4.25, .05], [-4.65, -1.5], [-4.68, -2.9],
    [-4.08, -4.25], [-3.65, -5.45], [-2.6, -6.15], [-1.7, -6.22],
    [-.7, -6.75], [.55, -6.72], [1.3, -6.4], [2.18, -6.5], [3.05, -5.9],
    [3.32, -5.1], [3.95, -4.65], [4.08, -3.83], [4.68, -2.95],
    [4.85, -2.02], [4.4, -2.35], [4.62, -1.3], [4.35, -.2], [3.9, .65],
    [3.95, -1.25], [3.54, -2.05], [3.14, -3.75], [2.56, -3.42],
    [1.67, -3.68], [1.15, -4.45], [.51, -4.13], [-.2, -4.17],
    [-.9, -3.83], [-1.92, -3.84], [-2.85, -3.31], [-2.86, -2.63],
    [-3.25, -2.91], [-3.58, -2.08], [-3.97, -.42]];
  shape(hair, { fill: DN.hair, stroke: DN.ink, lw, smooth: .65 });
  withBoil(0, () => {
    const waves = [
      [[-4.25, -1.55], [-3.8, -2.4], [-3.74, -3.6], [-3.05, -4.52], [-2.22, -4.95]],
      [[-3.03, -2.97], [-3.2, -3.75], [-2.49, -4.49], [-1.61, -5.13], [-1.27, -5.65]],
      [[-2.62, -3.62], [-1.6, -4.05], [-.82, -4.72], [-.7, -5.43]],
      [[-2.11, -5.27], [-1.6, -6.0], [-.73, -6.3], [.1, -6.12]],
      [[-.12, -4.25], [.52, -4.72], [.57, -5.36], [.22, -5.77]],
      [[.7, -4.15], [1.45, -4.49], [1.7, -5.16], [1.54, -5.59]],
      [[.56, -5.46], [1.31, -6.01], [2.21, -6.0], [2.8, -5.42], [2.74, -4.7]],
      [[1.99, -5.27], [2.04, -4.51], [2.65, -3.99], [3.27, -4.02], [3.58, -4.41]],
      [[3.92, -1.38], [4.05, -2.16], [3.69, -3.12], [3.64, -3.66]],
    ];
    waves.forEach(points => {
      line(points.map(([x, y]) => [x - .1, y - .13]),
        { stroke: DN.hairLight, lw: .19, smooth: true, alpha: .65 });
      line(points, { stroke: DN.hairShade, lw: lw * .8, smooth: true });
    });
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
  const wide = kind === 'wide' ? 1.85 : 1, rx = .94, ry = .4 * wide;
  const lid = [[cx - rx, cy + .12], [cx - .48, cy - ry * .75], [cx + .06, cy - ry],
    [cx + .59, cy - ry * .5], [cx + rx, cy + .07], [cx + .43, cy + ry * .5],
    [cx - .38, cy + ry * .56]];
  shape(lid, { fill: DN.eyeWhite, stroke: null, smooth: .75 });
  const ix = cx + clamp(o.lookX || 0, -1, 1) * .32;
  const iy = cy + clamp(o.lookY || 0, -1, 1) * .18;
  X.save(); tracePath(lid, true, .75); X.clip();
  circle(ix, iy, .4 * (kind === 'wide' ? 1.1 : 1), { fill: DN.iris, stroke: null });
  circle(ix, iy + .03, .24, { fill: DN.hairShade, stroke: null });
  circle(ix - .13, iy - .19, .12, { fill: '#FFFFFF', stroke: null });
  X.restore();
  const ph = (t + .8 + (o.blinkSeed || 0)) % 3.4;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (blink > .02) {
    X.save(); tracePath(lid, true, .75); X.clip();
    shape(rectPts(cx - 1.1, cy - ry - .1, 2.2, (ry * 1.56 + .1) * blink),
      { fill: DN.skin, stroke: null });
    X.restore();
  }
  const upper = lid.slice(0, 5).map(([x, y]) => [x, lerp(y, cy + .12, blink)]);
  line(upper, { stroke: DN.ink, lw: lw * .85, smooth: true });
  line([[cx - .96, cy - ry - .1], [cx - .45, cy - ry - .43],
    [cx + .2, cy - ry - .46], [cx + .86, cy - ry - .22]],
    { stroke: DN.ink, lw: lw * .6, smooth: true });
}

function dnMouth(kind, x, lw) {
  if (kind === 'smile' || kind === 'grin' || kind === 'smirk') {
    const lift = kind === 'smirk' ? -.18 : 0;
    shape([[x - 1.61, 2.45], [x - .75, 2.27], [x, 2.34], [x + .66, 2.23],
      [x + 1.61, 2.38 + lift], [x + .9, 3.17], [x, 3.42], [x - .92, 3.16]],
      { fill: '#C9766B', stroke: null, smooth: .75 });
    const opening = [[x - 1.61, 2.45], [x - .7, 2.59], [x, 2.61],
      [x + .75, 2.55], [x + 1.61, 2.38 + lift], [x + .82, 2.97],
      [x, 3.1], [x - .8, 2.94]];
    shape(opening, { fill: DN.hairShade, stroke: DN.ink, lw: lw * .65, smooth: .65 });
    X.save(); tracePath(opening, true, .65); X.clip();
    shape([[x - 1.4, 2.4], [x + 1.4, 2.35 + lift], [x + .7, 2.83],
      [x, 2.9], [x - .75, 2.8]], { fill: DN.eyeWhite, stroke: null, smooth: .5 });
    X.restore();
    [-1, 1].forEach(sd => line([[x + sd * 1.67, 2.28], [x + sd * 1.72, 2.45], [x + sd * 1.72, 2.59]],
      { stroke: DN.skinShade, lw: lw * 1.15, smooth: true }));
    line([[x - .38, 3.64], [x, 3.68], [x + .4, 3.62]], { stroke: DN.ink, lw: lw * .5, smooth: true });
  } else if (kind === 'open') {
    shape([[x - 1.25, 2.5], [x, 2.69], [x + 1.3, 2.5], [x + .9, 3.73], [x, 3.94], [x - .9, 3.73]],
      { fill: DN.mouth, stroke: DN.ink, lw, smooth: .7 });
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
    'goofy': (x, y, s, t) => danny(x, y, s, { t, eyes: 'wink', mouth: 'grin', handL: [-4.5, -15.6], handR: [4.5, -15.6], handPoseL: 'palm', handPoseR: 'palm', tilt: .13 * Math.sin(t * 3), lean: -.06 }),
    'goal!': (x, y, s, t) => danny(x, y, s, { t, handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: 1.2 * Math.abs(Math.sin(t * 3)) }),
    'laugh': (x, y, s, t) => danny(x, y, s, { t, eyes: 'happy', mouth: 'open', handL: [-3.5, -12.1], handR: [3.5, -12.1], tilt: -.1, dy: .18 * Math.abs(Math.sin(t * 10)) }),
    'surprised': (x, y, s, t) => danny(x, y, s, { t, eyes: 'wide', brows: 'up', mouth: 'o', handL: [-4.3, -14], handR: [4.3, -14], handPoseL: 'palm', handPoseR: 'palm' }),
  },
};
