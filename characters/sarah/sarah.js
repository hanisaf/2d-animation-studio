// Sarah: a rebellious ninth grader, woodworker, texter, and volleyball player.
// Floor origin (x,y); s = pixels per local unit. All animation is a pure function of t.
const SR = {
  ink: '#382A29', skin: '#EAB293', skinShade: '#C98973', skinLight: '#FFDBC1',
  hair: '#594332', hairShade: '#3D3025', hairLight: '#89664E',
  hoodie: '#D6A4A3', hoodieShade: '#B77F83', hoodieLight: '#EAC1B9',
  pants: '#D4D7DD', pantsShade: '#A2A7B2', shoe: '#F7F3E9', sole: '#D7D3CB',
  iris: '#68422C', white: '#FFFCF5', lip: '#BE726B', gold: '#EACB69',
  phone: '#54445F', screen: '#B9E8DF', wood: '#C99559', woodShade: '#92603B',
  steel: '#ADB7C1', red: '#EF303E',
};
const SARAH_UNIT = 4.8; // ~168 world units tall: teenage proportions.

function sarah(x, y, s, o = {}) {
  const t = o.t ?? T, lw = clamp(s * .14, 1.5, 5) / s, A = {};
  const rage = clamp(o.rebellion || 0), air = o.jump || 0;
  const hands = {};
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) ellipse(0, .2, 4 * (1 - clamp(air / 10) * .4), .65,
    { fill: 'rgba(40,28,30,.2)', stroke: null });
  X.translate(0, -air);
  if (o.rot) { X.translate(0, -16); X.rotate(o.rot); X.translate(0, 16); }
  if (o.sq) X.scale(1 + o.sq * .4, 1 - o.sq);
  withBoil(o.boil ?? .4, () => {
    const dy = o.dy || 0;
    // Two-bone jogger legs and canvas sneakers.
    for (const sd of [-1, 1]) {
      const hip = [sd * 1.4, -12.6 + dy];
      const target = o[sd < 0 ? 'footL' : 'footR'] || [sd * 1.65, -1.05];
      const kPref = o[sd < 0 ? 'kneeDirL' : 'kneeDirR'] || [sd * .3, .2];
      const { joint, end } = ik2(hip, target, 5.7, 5.9, kPref);
      srLimb([hip, joint, end], 2.15, SR.pants, lw);
      line([[hip[0] + sd * .65, hip[1]], [joint[0] + sd * .65, joint[1]], [end[0] + sd * .5, end[1] - .8]],
        { stroke: SR.pantsShade, lw: .25, smooth: true });
      const shoeRot = o[sd < 0 ? 'shoeRotL' : 'shoeRotR'] ?? (end[1] < -1.8 ? sd * clamp((-1.8 - end[1]) * .12, 0, .45) : 0);
      X.save(); X.translate(...end); X.rotate(shoeRot);
      shape(rectPts(-1.02, -.65, 2.04, .72), { fill: SR.pantsShade, stroke: SR.ink, lw, smooth: .3 });
      for (let i = -.7; i <= .7; i += .35) line([[i, -.5], [i, -.05]], { stroke: SR.pants, lw: .09 });
      X.scale(sd, 1);
      shape([[-.8, 0], [-.65, -.3], [.6, -.27], [1.6, .4], [1.75, .82], [.9, 1.05], [-.8, .9]],
        { fill: SR.shoe, stroke: SR.ink, lw, smooth: .6 });
      line([[-.75, .65], [.85, .78], [1.68, .64]], { stroke: SR.lip, lw: .13, smooth: true });
      for (let i = 0; i < 4; i++) line([[-.4 + i * .17, -.1 + i * .14], [.4 + i * .17, -.02 + i * .14]],
        { stroke: SR.ink, lw: .1 });
      X.restore();
      A[sd < 0 ? 'footL' : 'footR'] = toPx(...end);
      A[sd < 0 ? 'kneeL' : 'kneeR'] = toPx(...joint);
    }
    X.save(); X.translate(0, dy);
    shape([[-2.55, -14], [2.55, -14], [2.7, -11.7], [1, -11.5], [0, -12.1], [-1, -11.5], [-2.7, -11.7]],
      { fill: SR.pants, stroke: SR.ink, lw, smooth: .3 });
    X.restore();
    X.save(); X.translate(0, dy); X.translate(0, -13); X.rotate(o.lean || 0); X.translate(0, 13);
    const headTransform = () => { X.translate(0, -28); X.rotate(o.tilt || 0); };
    X.save(); headTransform(); srHair(o, t, lw, rage, false); X.restore();
    // Hood sits behind the shoulders; gold chain and drawstrings sit over the chest.
    shape([[-2.2, -23], [-1.6, -25.3], [1.2, -25.6], [3.2, -24.5], [3.5, -22.6]],
      { fill: SR.hoodieShade, stroke: SR.ink, lw, smooth: .8 });
    shape(rectPts(-.85, -25.3, 1.7, 3.4), { fill: SR.skin, stroke: SR.ink, lw, smooth: .3 });
    ellipse(0, -24.4, .86, .4, { fill: SR.skinShade, stroke: null });
    srHoodie(lw);
    A.chest = toPx(0, -20); A.belly = toPx(0, -15.5);
    X.save(); headTransform(); srHead(o, t, lw, A, rage); X.restore();
    const drawArm = sd => {
      const key = sd < 0 ? 'handL' : 'handR';
      const target = o[key] || [sd * 2.9, -14.9];
      // Natural shoulder elevation when reaching overhead so arms clear her head cleanly.
      const lift = clamp((-23.5 - target[1]) / 8.5, 0, 1);
      const sh = [sd * (3.05 - .45 * lift), -22.25 - 1.95 * lift];
      const ePref = o[sd < 0 ? 'elbowL' : 'elbowR'] || [sd * 2, .4];
      const { joint, end } = ik2(sh, target, 4.95, 5.05, ePref);
      srLimb([sh, joint, end], 1.85, SR.hoodie, lw);
      line([[joint[0] - sd * .6, joint[1] - .35], [joint[0], joint[1] - .6], [joint[0] + sd * .5, joint[1] - .35]],
        { stroke: SR.hoodieShade, lw: .15, smooth: true });
      const ang = o[sd < 0 ? 'handAngL' : 'handAngR'] ?? Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      X.save(); X.translate(...end); X.rotate(ang);
      shape(rectPts(-.55, -.98, .7, 1.96), { fill: SR.hoodieShade, stroke: SR.ink, lw, smooth: .25 });
      srHand(o[sd < 0 ? 'handPoseL' : 'handPoseR'] || 'open', lw, sd);
      X.restore(); hands[key] = end; A[key] = toPx(...end);
    };
    const isRaised = sd => ((o[sd < 0 ? 'handL' : 'handR'] || [0, -14.9])[1] < -23.5) || !!o.armsFront;
    for (const sd of [-1, 1]) if (!isRaised(sd)) drawArm(sd);
    // Front waves overlap the sweatshirt, like the supplied reference; raised arms clear the hair cleanly.
    X.save(); headTransform(); srHair(o, t, lw, rage, true); X.restore();
    for (const sd of [-1, 1]) if (isRaised(sd)) drawArm(sd);
    if (o.phone) {
      X.save(); X.translate(...hands.handR); X.rotate(-.13);
      srPhone(t, lw);
      // Thumb tapping the lower screen makes the texting action visible.
      ellipse(-.45 + .12 * wob(t, 3), .35 + .1 * wob(t, 4), .27, .18,
        { fill: SR.skin, stroke: SR.ink, lw: lw * .5 });
      X.restore();
    }
    if (o.woodworking) {
      srWorkbench(t, lw);
      X.save(); X.translate(...hands.handR); X.rotate(.12 * wob(t, 1.5));
      srSaw(lw); X.restore();
    }
    if (rage > .01) {
      for (const sd of [-1, 1]) {
        const dx = sd * (5.4 + .15 * wob(t, 5));
        line([[dx, -29], [dx + sd * .8, -30.1], [dx + sd * .3, -30.3], [dx + sd * 1.1, -31.5]],
          { stroke: rgba(SR.red, rage), lw: .22 });
      }
    }
    X.restore();
  });
  X.restore(); return A;
}

function srLimb(points, width, fill, lw) {
  withBoil(0, () => {
    line(points, { stroke: SR.ink, lw: width + 2 * lw });
    line(points, { stroke: fill, lw: width });
  });
}
function srHand(kind, lw, sd = 1) {
  if (kind === 'fist') {
    shape([[0, -.52], [.62, -.56], [1.02, -.22], [1.0, .34], [.55, .56], [0, .48]],
      { fill: SR.skin, stroke: SR.ink, lw, smooth: .65 });
    line([[.38, -.16], [.84, -.16]], { stroke: SR.skinShade, lw: .13 });
    line([[.38, .12], [.8, .12]], { stroke: SR.skinShade, lw: .11 });
    return;
  }
  if (kind === 'palm') {
    shape([[0, -.52], [.62, -.6], [1.05, -.25], [1.05, .32], [.55, .58], [0, .48]],
      { fill: SR.skin, stroke: SR.ink, lw, smooth: .65 });
    for (let i = 0; i < 4; i++) {
      const f = i - 1.5, len = 1.48 - Math.abs(f) * .12;
      srLimb([[.76, f * .22], [len, f * .33]], .22, SR.skin, lw * .45);
    }
    srLimb([[.28, .36], [.78, .92]], .25, SR.skin, lw * .45);
    return;
  }
  if (kind === 'set') {
    // Cupped overhead volleyball setting hand: arched fingertips + inward thumb forming the setting cradle.
    shape([[0, -.48], [.58, -.55], [.98, -.18], [.95, .3], [.48, .5], [0, .44]],
      { fill: SR.skin, stroke: SR.ink, lw, smooth: .65 });
    for (let i = 0; i < 4; i++) {
      const f = i - 1.5;
      srLimb([[.75, f * .19], [1.15, f * .28 - .06], [1.42, f * .32 + .12]], .2, SR.skin, lw * .42);
    }
    srLimb([[.28, sd * .35], [.78, sd * .76], [1.08, sd * .62]], .23, SR.skin, lw * .42);
    return;
  }
  shape([[0, -.48], [.55, -.55], [.95, -.2], [.95, .3], [.5, .52], [0, .45]],
    { fill: SR.skin, stroke: SR.ink, lw, smooth: .65 });
  for (let i = 0; i < 3; i++) srLimb([[.7, -.25 + i * .23], [1.15 + .1 * (i === 1), -.35 + i * .3]], .2, SR.skin, lw * .45);
  srLimb([[.25, .3], [.65, .8]], .23, SR.skin, lw * .45);
}
function srHoodie(lw) {
  const body = [[-1.4, -23.5], [-3.1, -22.8], [-3.4, -20], [-3.15, -15], [-3.3, -12.8],
    [-2.5, -12.3], [0, -12.1], [2.5, -12.3], [3.3, -12.8], [3.15, -15], [3.4, -20], [3.1, -22.8], [1.4, -23.5], [0, -22.5]];
  shape(body, { fill: SR.hoodie, stroke: SR.ink, lw, smooth: .55 });
  shape([[-3.05, -19.7], [-2.5, -17], [-2.6, -13.2], [-3.15, -12.8]],
    { fill: SR.hoodieShade, stroke: null, smooth: .6 });
  shape([[-3.2, -13.4], [0, -13.05], [3.2, -13.4], [3.25, -12.5], [0, -12.1], [-3.25, -12.5]],
    { fill: SR.hoodieShade, stroke: SR.ink, lw: lw * .65, smooth: .4 });
  shape([[-1.6, -17], [1.6, -17], [2.25, -14.2], [0, -13.9], [-2.25, -14.2]],
    { fill: SR.hoodie, stroke: SR.ink, lw: lw * .7, smooth: .25 });
  line([[-1.6, -17], [1.6, -17]], { stroke: SR.hoodieLight, lw: .2 });
  for (const sd of [-1, 1]) {
    line([[sd * 1.15, -23], [sd * .95, -21], [sd * .9, -18.3]], { stroke: SR.ink, lw: .24, smooth: true });
    line([[sd * 1.15, -23], [sd * .95, -21], [sd * .9, -18.3]], { stroke: SR.hoodieLight, lw: .12, smooth: true });
    shape(rectPts(sd * .9 - .09, -18.4, .18, .45), { fill: SR.hoodieShade, stroke: SR.ink, lw: lw * .5 });
  }
  const chain = [[-1, -23.7], [-.85, -22.5], [-.6, -21.5], [0, -21.25], [.6, -22], [1.1, -23.7]];
  line(chain, { stroke: SR.ink, lw: .4, smooth: true });
  line(chain, { stroke: SR.gold, lw: .26, smooth: true });
}

// Upright rebellion hair blends from the normal wavy silhouette without randomness.
function srHair(o, t, lw, rage, front) {
  const swing = (o.hairSwing || 0) + .07 * wob(t, .5);
  if (!front) {
    const normal = [[0, -6.8], [2.6, -6.3], [3.9, -4.8], [4.25, -1], [4.7, 2], [4.1, 4.8],
      [5, 7.4], [4.1, 10.8], [3.1, 9.9], [2, 11.2], [0, 10], [-2.5, 11], [-4.5, 10.4],
      [-4, 7.7], [-4.8, 5.5], [-4.1, 3.2], [-4.55, .6], [-4.1, -3.7], [-2.6, -6.2]];
    const spikes = [[0, -10.2], [1.7, -7], [3.5, -10], [3.3, -5.3], [5.7, -7.8], [4.2, -2.6],
      [6, -3.5], [4.4, 1.2], [3.1, 2], [2, 2.5], [0, 2], [-2.5, 2.5], [-4.5, 2],
      [-5.6, -.5], [-4.3, -2.5], [-6, -5], [-4.1, -5.1], [-3.5, -9.2], [-1.8, -6.8]];
    const mass = normal.map((p, i) => mixPt(p, spikes[i], rage));
    shape(mass, { fill: SR.hair, stroke: SR.ink, lw, smooth: .55 * (1 - rage) });
    return;
  }
  for (const sd of [-1, 1]) {
    const wave = u => sd * .45 * Math.sin(u * 12 + sd) + swing * u * u;
    const outer = [[0, -6.6], [sd * 2.1, -6.4], [sd * 3.65, -4.5], [sd * 4, -1]];
    const inner = [];
    for (let i = 1; i <= 12; i++) {
      const u = i / 12, y = -1 + u * 11;
      outer.push([sd * (4 + .2 * u) + wave(u), lerp(y, -3 + u * 5, rage)]);
      inner.unshift([sd * (3.05 + .5 * u) + wave(u), lerp(y - .45, -3.3 + u * 5, rage)]);
    }
    inner.push([sd * 3.1, -2.4], [sd * 2.7, -4.3], [sd * 1.1, -5.2], [0, -5.8]);
    const curtain = [...outer, ...inner];
    shape(curtain, { fill: SR.hair, stroke: SR.ink, lw, smooth: .6 });
    X.save(); tracePath(curtain, true, .6); X.clip();
    for (let k = 0; k < 3; k++) {
      const strand = [[sd * (.3 + k * .4), -6.1], [sd * (2 + k * .4), -5.2], [sd * (3.35 + k * .25), -2]];
      for (let i = 0; i <= 12; i++) { const u = i / 12;
        strand.push([sd * (3.4 + k * .27) + wave(u), lerp(-1 + u * 11, -3 + u * 5, rage)]);
      }
      line(strand, { stroke: k === 1 ? SR.hairShade : SR.hairLight, lw: k === 1 ? .12 : .19, smooth: true });
    }
    X.restore();
  }
}
function srHead(o, t, lw, A, rage) {
  const turn = clamp(o.turn || 0, -1, 1) * .5;
  const face = [[0, -5.9], [2.7, -4.5], [3.3, -2.3], [3.2, .5], [2.65, 2], [1.4, 3.15],
    [0, 3.65], [-1.4, 3.15], [-2.65, 2], [-3.2, .5], [-3.3, -2.3], [-2.7, -4.5]];
  shape(face, { fill: SR.skin, stroke: SR.ink, lw, smooth: .8 });
  for (const sd of [-1, 1]) {
    const cx = sd * 1.55 + turn, cy = -1.2;
    A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(cx, cy);
    srEye(cx, cy, sd, o, t, lw, rage);
    const angry = rage || (o.brows === 'angry' ? 1 : 0), up = o.brows === 'up' ? -.35 : 0;
    line([[cx - sd * .83, -2.55 + .5 * angry + up], [cx + sd * .1, -2.8 + up], [cx + sd * .85, -2.55 - .25 * angry + up]],
      { stroke: SR.hairShade, lw: .25, smooth: true });
    ellipse(sd * 2.1 + turn, .6, .5, .22, { fill: rgba(SR.lip, .17), stroke: null });
  }
  line([[turn - .3, -.3], [turn - .42, .35], [turn - .1, .52], [turn + .35, .49]],
    { stroke: SR.skinShade, lw: .18, smooth: true });
  const mouth = o.mouth || (rage ? 'frown' : 'grin');
  if (mouth === 'shout') {
    ellipse(turn, 1.75, 1.25, 1.2, { fill: SR.ink, stroke: SR.ink, lw: lw * .75 });
    shape(rectPts(turn - .83, .75, 1.66, .4), { fill: SR.white, stroke: null });
    ellipse(turn, 2.4, .7, .3, { fill: SR.lip, stroke: null });
  } else if (mouth === 'grin' || mouth === 'open') {
    const opening = [[turn - 1.25, 1.1], [turn, 1.35], [turn + 1.25, 1.1], [turn + .7, 2.05], [turn, 2.22], [turn - .7, 2.05]];
    shape(opening, { fill: SR.lip, stroke: SR.ink, lw: lw * .75, smooth: .6 });
    X.save(); tracePath(opening, true, .6); X.clip();
    shape([[turn - 1.2, 1.1], [turn + 1.2, 1.1], [turn + .55, 1.7], [turn - .55, 1.7]],
      { fill: SR.white, stroke: null, smooth: .5 }); X.restore();
  } else {
    const frown = mouth === 'frown', flat = mouth === 'flat';
    line([[turn - 1.05, 1.6], [turn, flat ? 1.6 : frown ? 1.3 : 1.95], [turn + 1.05, mouth === 'smirk' ? 1.25 : 1.6]],
      { stroke: SR.ink, lw, smooth: true });
  }
  A.head = toPx(0, 0); A.mouth = toPx(turn, 1.7); A.top = toPx(0, lerp(-6.8, -10.2, rage));
}
function srEye(cx, cy, sd, o, t, lw, rage) {
  const kind = o.eyes || 'open';
  const ph = (t + .7 + (o.blinkSeed || 0)) % 3.7;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (kind === 'closed' || kind === 'happy' || (kind === 'wink' && sd > 0)) {
    line([[cx - .8, cy], [cx, cy + (kind === 'happy' ? -.3 : .3)], [cx + .8, cy]],
      { stroke: SR.ink, lw: lw * 1.4, smooth: true }); return;
  }
  const ry = kind === 'wide' ? .83 : .57;
  const lid = [[cx - .84, cy], [cx - .4, cy - ry], [cx + .4, cy - ry], [cx + .84, cy], [cx + .3, cy + .4], [cx - .3, cy + .4]];
  shape(lid, { fill: rage ? '#FFC5BB' : SR.white, stroke: SR.ink, lw: lw * .7, smooth: .7 });
  X.save(); tracePath(lid, true, .7); X.clip();
  const ix = cx + .22 * clamp(o.lookX || 0, -1, 1), iy = cy + .15 * clamp(o.lookY || 0, -1, 1);
  circle(ix, iy, .46, { fill: mixCol(SR.iris, SR.red, rage), stroke: null });
  circle(ix, iy, .27, { fill: rage ? '#740815' : SR.ink, stroke: null });
  circle(ix - .14, iy - .2, .14, { fill: SR.white, stroke: null });
  if (rage) shape([[cx - sd * 1, cy - .65], [cx + sd * 1, cy - .65], [cx - sd * 1, cy + .1]],
    { fill: SR.skin, stroke: SR.ink, lw: lw * .7 });
  if (blink > .01) shape(rectPts(cx - 1, cy - 1, 2, (1.5 * blink)), { fill: SR.skin, stroke: null });
  X.restore();
  line(lid.slice(0, 4).map(([x,y]) => [x, lerp(y, cy, blink)]), { stroke: SR.ink, lw: lw * 1.35, smooth: true });
  for (let i = 0; i < 3; i++) line([[cx + sd * (.58 + i * .1), cy - .18], [cx + sd * (.7 + i * .13), cy - .55]],
    { stroke: SR.ink, lw: lw * .65 });
}

function srPhone(t, lw) {
  shape(rectPts(-.85, -2.25, 1.7, 2.9), { fill: SR.phone, stroke: SR.ink, lw, smooth: .2 });
  shape(rectPts(-.66, -1.94, 1.32, 2.17), { fill: SR.screen, stroke: null, smooth: .1 });
  line([[-.2, -2.08], [.2, -2.08]], { stroke: SR.white, lw: .08 });
  for (let i = 0; i < 3; i++) shape(rectPts(i % 2 ? -.15 : -.52, -1.55 + i * .48, .66, .27),
    { fill: i % 2 ? '#74BBA8' : SR.white, stroke: null, smooth: .2 });
  for (let i = 0; i < 3; i++) circle(-.25 + i * .25, -.05, .06 + .025 * wob(t, 3, i), { fill: SR.phone, stroke: null });
}
function srWorkbench(t, lw) {
  for (const sd of [-1, 1]) shape(rectPts(sd * 4.8 - .4, -13.3, .8, 13.3),
    { fill: SR.woodShade, stroke: SR.ink, lw });
  shape(rectPts(-6.4, -14.2, 12.8, 1.1), { fill: SR.wood, stroke: SR.ink, lw, smooth: .1 });
  shape(rectPts(-4.4, -14.85, 9.5, .65), { fill: '#E7BB82', stroke: SR.ink, lw: lw * .7 });
  for (let i = 0; i < 4; i++) line([[-4, -14.68 + i * .1], [-1, -14.65 + i * .1], [4.7, -14.7 + i * .1]],
    { stroke: SR.woodShade, lw: .04, smooth: true });
  shape(rectPts(-3.9, -14.7, .45, 1.6), { fill: SR.steel, stroke: SR.ink, lw: lw * .6 });
  for (let i = 0; i < 7; i++) {
    const age = frac(t * 1.8 + i / 7), k = Math.sin(age * Math.PI);
    if (k > .05) line([[2 + age * 2.6, -14.6 + age * 2], [2.2 + age * 2.6, -14.5 + age * 2]],
      { stroke: rgba(SR.woodShade, k), lw: .12 });
  }
}
function srSaw(lw) {
  shape([[-.6, -.6], [.6, -.6], [.75, .55], [-.6, .6]], { fill: SR.woodShade, stroke: SR.ink, lw, smooth: .3 });
  shape(rectPts(-.3, -.32, .55, .58), { fill: SR.skin, stroke: SR.ink, lw: lw * .5, smooth: .2 });
  const teeth = [[.6, -.4], [4.2, -.15], [4.5, .55]];
  for (let i = 12; i >= 0; i--) teeth.push([.7 + i * .28, i % 2 ? .7 : .5]);
  shape(teeth, { fill: SR.steel, stroke: SR.ink, lw: lw * .6 });
}
const SARAH_BALL_R = 2.75; // Regulation volleyball scale relative to Sarah's ~35-unit teenage frame.
function sarahVolleyball(x, y, s, o = {}) {
  const r = o.radius ?? SARAH_BALL_R, lw = clamp(s * .13, 1.4, 4.4) / s;
  const sq = clamp(o.squash || 0, 0, .28);
  X.save(); X.translate(x, y); X.scale(s, s);
  if (sq > .001) {
    const a = o.squashAng || 0;
    X.rotate(a); X.scale(1 - sq, 1 + sq * .85); X.rotate(-a);
  }
  // Base warm-white sphere fill, clipped curved tournament panels, world-locked shading, and crisp outer ink ring.
  circle(0, 0, r, { fill: SR.white, stroke: null });
  X.save(); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.clip();
  X.save(); X.rotate(o.spin || 0);
  for (let i = 0; i < 3; i++) {
    X.save(); X.rotate(i * TAU / 3);
    // Blue outer curved swirl band
    shape([[0, 0], [.28 * r, -.42 * r], [.68 * r, -.86 * r], [1.06 * r, -.68 * r],
      [1.06 * r, -.18 * r], [.62 * r, -.38 * r], [.22 * r, -.12 * r]],
      { fill: '#3B74BA', stroke: SR.ink, lw: lw * .52, smooth: .55 });
    // Golden-yellow companion swirl band
    shape([[0, 0], [.22 * r, -.12 * r], [.62 * r, -.38 * r], [1.06 * r, -.18 * r],
      [1.02 * r, .34 * r], [.58 * r, .08 * r], [.18 * r, .14 * r]],
      { fill: '#F2C344', stroke: SR.ink, lw: lw * .52, smooth: .55 });
    // Subtle inner panel seam across the cream stripe
    line([[.12 * r, .12 * r], [.42 * r, .45 * r], [.62 * r, .98 * r]],
      { stroke: SR.ink, lw: lw * .45, smooth: true });
    X.restore();
  }
  X.restore();
  // Soft spherical shading crescent + specular highlight (world-aligned so light stays steady while spinning).
  shape([[.75 * r, -.85 * r], [1.1 * r, -.2 * r], [.95 * r, .85 * r], [.05 * r, 1.15 * r],
    [-.85 * r, .8 * r], [-.55 * r, .58 * r], [.22 * r, .68 * r], [.65 * r, .22 * r]],
    { fill: 'rgba(42,30,52,.17)', stroke: null, smooth: .7 });
  ellipse(-.36 * r, -.38 * r, .32 * r, .2 * r, { fill: 'rgba(255,255,255,.65)', stroke: null, rot: -.55 });
  X.restore();
  circle(0, 0, r, { fill: null, stroke: SR.ink, lw });
  X.restore();
}

// Phase helpers for athletic volleyball cycles (pure functions of t; aligned so t=1.1 showcases iconic poses).
function srVolleySetState(t, k = 1) {
  const u = frac((t - .72) / 1.25); // u ≈ 0.30 at t=1.1: hands pushing up cleanly under the ball!
  const catchW = u < .28 ? ease(u / .28) : u < .5 ? 1 - ease((u - .28) / .22) : 0;
  const pushW = u >= .24 && u < .56 ? Math.sin(seg(u, .24, .56) * Math.PI) : 0;
  const airU = u >= .32 ? seg(u, .32, 1.0) : 0;
  const arc = airU > 0 ? 4 * airU * (1 - airU) : 0; // true parabolic gravity arc
  const dy = (1.1 + 1.15 * catchW - .85 * pushW) * k;
  const jump = .85 * k * pushW;
  const handY = -33.2 + .55 * catchW - 1.55 * pushW;
  const handX = 2.35 + .2 * catchW - .35 * pushW;
  const pose = {
    handL: [-handX, handY], handR: [handX, handY],
    elbowL: [-3.4, .45], elbowR: [3.4, .45],
    handPoseL: 'set', handPoseR: 'set',
    handAngL: -1.18 + .15 * pushW, handAngR: -Math.PI + 1.18 - .15 * pushW,
    footL: [-3.0, -1.05], footR: [2.6, -1.05],
    kneeDirL: [-.75, .2], kneeDirR: [.75, .2],
    dy, jump, lean: -.04 - .03 * pushW, tilt: -.12 - .04 * arc,
    lookY: -.95, brows: 'up', mouth: pushW > .35 ? 'grin' : 'smile',
    hairSwing: .55 * pushW - .25 * catchW, armsFront: true,
  };
  return { pose, arc, pushW, catchW };
}

function srVolleySpikeState(t, k = 1) {
  const u = frac((t - .34) / 1.35); // u ≈ 0.56 at t=1.1: peak airborne smash contact!
  // 0..0.22 load crouch · 0.22..0.52 jump + bow-and-arrow cock · 0.52..0.74 smash + follow-through · 0.74..1.0 land
  const load = u < .24 ? Math.sin(seg(u, 0, .24) * Math.PI) : 0;
  const airU = u >= .18 && u <= .84 ? seg(u, .18, .84) : 0;
  const jump = airU > 0 ? 6.4 * k * Math.pow(Math.sin(airU * Math.PI), .78) : 0;
  const cock = u >= .20 && u <= .58 ? Math.sin(seg(u, .20, .58) * Math.PI) : 0;
  const smash = u >= .48 && u <= .72 ? Math.sin(seg(u, .48, .72) * Math.PI) : 0;
  const hit = u >= .52 && u <= .64 ? Math.sin(seg(u, .52, .64) * Math.PI) : 0;
  const follow = u >= .58 && u <= .84 ? Math.sin(seg(u, .58, .84) * Math.PI) : 0;
  const land = u >= .80 ? Math.sin(seg(u, .80, 1.0) * Math.PI) : 0;

  const dy = (1.9 * load + 1.3 * land) * k;
  const tuck = clamp(jump / (6.4 * Math.max(k, .01)));
  // Dynamic mid-air leg tuck (front knee drives up-left, trailing leg bends sharply back-right).
  const footL = [lerp(-2.5, -3.5, tuck), lerp(-1.05, -4.3, tuck)];
  const footR = [lerp(2.4, 3.6, tuck), lerp(-1.05, -5.4, tuck)];

  // Bow-and-arrow guide arm (left) → pulls down across hip for smash torque; hitting arm (right) cocks high then whips across.
  const handL = kf(u, [
    [0, [-4.2, -16.8]], [.18, [-5.0, -15.8]], [.38, [-4.8, -28.0]],
    [.54, [-5.6, -17.2]], [.66, [-5.2, -16.2]], [.84, [-4.0, -16.5]], [1, [-4.2, -16.8]],
  ], ease);
  const handR = kf(u, [
    [0, [4.2, -16.8]], [.18, [5.0, -15.6]], [.36, [6.2, -29.8]],
    [.49, [5.8, -32.8]], [.56, [5.5, -33.4]], [.66, [6.6, -26.5]],
    [.76, [3.8, -19.0]], [.88, [4.2, -16.8]], [1, [4.2, -16.8]],
  ], ease);
  const handAngR = kf(u, [
    [0, 1.1], [.36, -1.9], [.49, -1.55], [.56, -.95], [.66, -.2], [.76, .7], [1, 1.1],
  ], ease);

  const pose = {
    handL, handR,
    elbowL: [-3.2, .6], elbowR: [3.8, -.8 * cock + .6 * follow],
    handPoseL: smash > .2 ? 'fist' : 'open', handPoseR: 'palm',
    handAngR,
    footL, footR,
    kneeDirL: [lerp(-.5, -1.8, tuck), lerp(.2, -.6, tuck)],
    kneeDirR: [lerp(.5, -.9, tuck), lerp(.2, .9, tuck)],
    shoeRotL: .48 * tuck, shoeRotR: .65 * tuck,
    dy, jump,
    lean: .11 * load - .15 * cock + .16 * smash + .06 * follow + .08 * land,
    rot: -.05 * cock + .07 * smash,
    tilt: -.14 * (cock + smash) + .06 * load,
    lookX: .55, lookY: u < .62 ? -.85 : .45,
    brows: u > .32 && u < .74 ? 'angry' : 'up',
    mouth: smash > .25 ? 'shout' : 'grin',
    hairSwing: (-1.7 * cock + 2.3 * smash + .8 * follow) * k,
    sq: .06 * land,
  };
  return { pose, u, jump, hit, smash, cock };
}

// Ability options can be spread into sarah(), with normal pose overrides afterwards.
function sarahAbility(t, ability, o = {}) {
  const k = clamp(o.k ?? 1), q = wob(t, 1.5);
  if (ability === 'texting') return { phone: true, handL: [-.5, -18.5], handR: [.65, -18.3], lookY: .8, tilt: .08, mouth: 'smirk', handPoseR: 'fist' };
  if (ability === 'woodworking') return { woodworking: true, handL: [-2.8, -15], handR: [1 + .85 * k * q, -15.5], handPoseL: 'fist', handPoseR: 'fist', lean: .035, lookY: .8, mouth: 'flat' };
  if (ability === 'rebellion') return { rebellion: k, handL: [-5, -16.5], handR: [5, -16.5], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', mouth: 'frown', tilt: .025 * k * wob(t, 7), dy: .15 * k * Math.abs(q), footL: [-2.2, -1.05], footR: [2.2, -1.05] };
  if (ability === 'volleyball set') return srVolleySetState(t, k).pose;
  if (ability === 'volleyball spike') return srVolleySpikeState(t, k).pose;
  return {};
}
function sarahPerform(x, y, s, t, ability, o = {}) {
  const k = clamp(o.k ?? 1);
  if (ability === 'volleyball set') {
    const st = srVolleySetState(t, k);
    const pose = { ...st.pose, ...o, t };
    const dir = pose.flip ? -1 : 1;
    const A = sarah(x, y, s, pose);
    // Anchor ball directly to Sarah's cupped hands so contact is always exact across scale, crouch, and flip.
    const hx = (A.handL[0] + A.handR[0]) * .5, hy = (A.handL[1] + A.handR[1]) * .5;
    const r = o.radius ?? SARAH_BALL_R;
    const bx = hx + dir * .35 * Math.sin(st.arc * Math.PI) * s;
    const by = hy - (r + .6 + 4.0 * k * st.arc) * s;
    const sq = st.catchW > .6 ? (st.catchW - .6) * .22 : 0;
    sarahVolleyball(bx, by, s, { radius: r, spin: t * 2.2 * dir, squash: sq, squashAng: Math.PI / 2 });
    if (st.pushW > .35) {
      const a = (st.pushW - .35) / .65;
      X.save(); X.translate(hx, hy - 1.1 * s); X.scale(s, s);
      for (const sd of [-1, 1]) {
        line([[sd * 1.9, .1], [sd * 2.55, -.95]], { stroke: rgba(SR.ink, .55 * a), lw: .18, smooth: true });
      }
      X.restore();
    }
    return A;
  }
  if (ability === 'volleyball spike') {
    const st = srVolleySpikeState(t, k);
    const pose = { ...st.pose, ...o, t };
    const dir = pose.flip ? -1 : 1;
    const A = sarah(x, y, s, pose);
    const r = o.radius ?? SARAH_BALL_R;
    // Motion arc whoosh trailing her smashing palm during the whip-through.
    if (st.smash > .15) {
      X.save(); X.translate(x, y - (pose.jump || 0) * s); X.scale(s * dir, s);
      const a = clamp((st.smash - .15) / .65);
      line([[5.8, -32.8], [7.2, -31.0], [7.4, -27.2]], { stroke: rgba('#FFF6E5', .8 * a), lw: .65, smooth: true });
      line([[4.9, -33.6], [6.7, -31.5], [7.0, -27.8]], { stroke: rgba(SR.gold, .65 * a), lw: .26, smooth: true });
      X.restore();
    }
    // Ball trajectory: high set-up arc into her raised palm at u=0.56, then fast downward smash + floor bounce!
    let bx, by, sq = 0, sqAng = .5;
    if (st.u < .55) {
      const p = st.u / .55;
      bx = x + dir * lerp(8.8, 6.9, ease(p)) * s;
      by = y - (lerp(33.5, 40.4, ease(p)) + 2.0 * Math.sin(p * Math.PI)) * s;
    } else if (st.u < .61) {
      // Exact contact against her striking palm!
      bx = A.handR[0] + dir * (r * .78) * s;
      by = A.handR[1] - (r * .28) * s;
      sq = .2 * st.hit;
      sqAng = dir * .65;
    } else if (st.u < .80) {
      // Smashed sharply down-forward toward the court floor!
      const p = (st.u - .61) / .19;
      bx = x + dir * lerp(7.6, 11.4, p) * s;
      by = y - lerp(39.2, r + .1, p * p) * s;
      sq = p > .88 ? (p - .88) / .12 * .22 : 0;
      sqAng = Math.PI / 2;
    } else {
      // Crisp floor bounce back up for the next set-up loop!
      const p = (st.u - .80) / .20;
      bx = x + dir * lerp(11.4, 8.8, ease(p)) * s;
      by = y - lerp(r + .1, 33.5, easeOut(p)) * s;
    }
    sarahVolleyball(bx, by, s, { radius: r, spin: t * (st.u > .55 && st.u < .85 ? 9 : 2.6) * dir, squash: sq, squashAng: sqAng });
    // Crisp comic starburst right on smash contact.
    if (st.hit > .25) {
      const ia = (st.hit - .25) / .75;
      X.save(); X.translate(A.handR[0] + dir * .6 * s, A.handR[1] - .4 * s); X.scale(s, s);
      for (let i = 0; i < 6; i++) {
        const ang = i * TAU / 6 + .3;
        line([[Math.cos(ang) * 1.1, Math.sin(ang) * 1.1], [Math.cos(ang) * (2.3 + .7 * ia), Math.sin(ang) * (2.3 + .7 * ia)]],
          { stroke: rgba(SR.gold, .9 * ia), lw: .26 });
      }
      X.restore();
    }
    return A;
  }
  const pose = { ...sarahAbility(t, ability, o), ...o, t };
  return sarah(x, y, s, pose);
}
CHARACTERS.sarah = {
  draw: sarah, unit: SARAH_UNIT, palette: SR, size: [20, 44],
  poses: {
    'rest': (x,y,s,t) => sarah(x,y,s,{t}),
    'hello': (x,y,s,t) => sarah(x,y,s,{t, handL:[-2.9,-15], handR:[6.8 + .75*wob(t,2), -28.5 + .25*wob(t,4)], handPoseR:'palm', handAngR:-1.15 + .22*wob(t,2), brows:'up', mouth:'grin', tilt:-.06}),
    'hands on hips': (x,y,s,t) => sarah(x,y,s,{t, handL:[-3.2,-14.6], handR:[3.2,-14.6], elbowL:[-3.5,-.2], elbowR:[3.5,-.2], footL:[-2.1,-1.05], footR:[1.5,-1.05], lean:-.04, tilt:.06, mouth:'smirk'}),
    'unimpressed': (x,y,s,t) => sarah(x,y,s,{t, handL:[1.8,-17.8], handR:[-1.8,-17.5], elbowL:[-3,.6], elbowR:[3,.6], footR:[2.1,-1.05], lookX:.75, lookY:-.12, mouth:'flat', lean:.03, tilt:-.11}),
    'texting on phone': (x,y,s,t) => sarahPerform(x,y,s,t,'texting'),
    'woodworking': (x,y,s,t) => sarahPerform(x,y,s,t,'woodworking'),
    'volleyball set': (x,y,s,t) => sarahPerform(x,y,s,t,'volleyball set'),
    'volleyball spike': (x,y,s,t) => sarahPerform(x,y,s,t,'volleyball spike'),
    'rebellion bout': (x,y,s,t) => sarahPerform(x,y,s,t,'rebellion'),
    'cooling down': (x,y,s,t) => sarah(x,y,s,{t, rebellion:.5+.5*wob(t,.2), handPoseL:'fist', handPoseR:'fist', mouth:'flat'}),
  },
};
