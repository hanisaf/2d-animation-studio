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
    // Two-bone jogger legs and canvas sneakers.
    for (const sd of [-1, 1]) {
      const hip = [sd * 1.4, -12.6 + (o.dy || 0)];
      const target = o[sd < 0 ? 'footL' : 'footR'] || [sd * 1.65, -1.05];
      const { joint, end } = ik2(hip, target, 5.7, 5.9, [sd * .3, .2]);
      srLimb([hip, joint, end], 2.15, SR.pants, lw);
      line([[hip[0] + sd * .65, hip[1]], [joint[0] + sd * .65, joint[1]], [end[0] + sd * .5, end[1] - .8]],
        { stroke: SR.pantsShade, lw: .25, smooth: true });
      X.save(); X.translate(...end);
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
    shape([[-2.55, -14], [2.55, -14], [2.7, -11.7], [1, -11.5], [0, -12.1], [-1, -11.5], [-2.7, -11.7]],
      { fill: SR.pants, stroke: SR.ink, lw, smooth: .3 });
    X.save(); X.translate(0, o.dy || 0); X.translate(0, -13); X.rotate(o.lean || 0); X.translate(0, 13);
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
    for (const sd of [-1, 1]) {
      const key = sd < 0 ? 'handL' : 'handR';
      const target = o[key] || [sd * 2.9, -14.9];
      const { joint, end } = ik2([sd * 3.05, -22.25], target, 4.6, 4.7, [sd * 2, .4]);
      srLimb([[sd * 3.05, -22.25], joint, end], 1.85, SR.hoodie, lw);
      line([[joint[0] - sd * .6, joint[1] - .35], [joint[0], joint[1] - .6], [joint[0] + sd * .5, joint[1] - .35]],
        { stroke: SR.hoodieShade, lw: .15, smooth: true });
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      X.save(); X.translate(...end); X.rotate(ang);
      shape(rectPts(-.55, -.98, .7, 1.96), { fill: SR.hoodieShade, stroke: SR.ink, lw, smooth: .25 });
      srHand(o[sd < 0 ? 'handPoseL' : 'handPoseR'] || 'open', lw);
      X.restore(); hands[key] = end; A[key] = toPx(...end);
    }
    // Front waves overlap the sweatshirt, like the supplied reference.
    X.save(); headTransform(); srHair(o, t, lw, rage, true); X.restore();
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
function srHand(kind, lw) {
  shape([[0, -.48], [.55, -.55], [.95, -.2], [.95, .3], [.5, .52], [0, .45]],
    { fill: SR.skin, stroke: SR.ink, lw, smooth: .65 });
  if (kind === 'fist') {
    line([[.4, -.1], [.8, -.1]], { stroke: SR.skinShade, lw: .12 });
  } else {
    for (let i = 0; i < 3; i++) srLimb([[.7, -.25 + i * .23], [1.15 + .1 * (i === 1), -.35 + i * .3]], .2, SR.skin, lw * .45);
    srLimb([[.25, .3], [.65, .8]], .23, SR.skin, lw * .45);
  }
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
  if (mouth === 'grin' || mouth === 'open') {
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
function sarahVolleyball(x, y, s, o = {}) {
  X.save(); X.translate(x, y); X.scale(s, s); X.rotate(o.spin || 0);
  const r = o.radius ?? 1.35, lw = clamp(s * .12, 1.2, 4) / s;
  circle(0, 0, r, { fill: SR.white, stroke: SR.ink, lw });
  X.save(); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.clip();
  for (let i = 0; i < 3; i++) {
    X.save(); X.rotate(i * TAU / 3);
    shape([[0, 0], [.35, -.85 * r], [r, -.9 * r], [r, -.35 * r], [.45 * r, .25 * r]],
      { fill: i === 1 ? '#E9C85C' : '#6386B4', stroke: SR.ink, lw: lw * .6, smooth: .6 });
    line([[0, 0], [-.6 * r, -.55 * r], [-.7 * r, -r]], { stroke: SR.ink, lw: lw * .6, smooth: true }); X.restore();
  }
  X.restore(); X.restore();
}

// Ability options can be spread into sarah(), with normal pose overrides afterwards.
function sarahAbility(t, ability, o = {}) {
  const k = clamp(o.k ?? 1), q = wob(t, 1.5), hop = Math.max(0, Math.sin(t * Math.PI * 1.6));
  if (ability === 'texting') return { phone: true, handL: [-.5, -18.5], handR: [.65, -18.3], lookY: .8, tilt: .08, mouth: 'smirk', handPoseR: 'fist' };
  if (ability === 'woodworking') return { woodworking: true, handL: [-2.8, -15], handR: [1 + .85 * k * q, -15.5], handPoseL: 'fist', handPoseR: 'fist', lean: .035, lookY: .8, mouth: 'flat' };
  if (ability === 'rebellion') return { rebellion: k, handL: [-5, -16.5], handR: [5, -16.5], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', mouth: 'frown', tilt: .025 * k * wob(t, 7), dy: .15 * k * Math.abs(q), footL: [-2.2, -1.05], footR: [2.2, -1.05] };
  if (ability === 'volleyball set') return { handL: [-2.2, -29.5], handR: [2.2, -29.5], handPoseL: 'palm', handPoseR: 'palm', lookY: -.9, jump: .8 * k * hop, mouth: 'smile' };
  if (ability === 'volleyball spike') return { handL: [-4.4, -24], handR: [3.7, -29.5 + 2 * q], handPoseR: 'palm', jump: 3 * k * hop, lean: -.08, lookY: -.7, mouth: 'grin', hairSwing: .5 * hop };
  return {};
}
function sarahPerform(x, y, s, t, ability, o = {}) {
  const pose = { ...sarahAbility(t, ability, o), ...o, t };
  const A = sarah(x, y, s, pose);
  if (ability === 'volleyball set' || ability === 'volleyball spike') {
    const set = ability === 'volleyball set';
    sarahVolleyball(x + (set ? .5 * wob(t, 1) : 4.1 + .8 * wob(t, 1.5)) * s,
      y - ((set ? 36 + .8 * Math.abs(wob(t, 1.5)) : 34.5 + 1.6 * wob(t, 1.5)) + (pose.jump || 0)) * s, s, { spin: t * 2 });
  }
  return A;
}
CHARACTERS.sarah = {
  draw: sarah, unit: SARAH_UNIT, palette: SR, size: [18, 40],
  poses: {
    'rest': (x,y,s,t) => sarah(x,y,s,{t}),
    'hello': (x,y,s,t) => sarah(x,y,s,{t, handR:[5,-27 + .3*wob(t,2)], brows:'up', mouth:'grin'}),
    'hands on hips': (x,y,s,t) => sarah(x,y,s,{t, handL:[-2.9,-15], handR:[2.9,-15], mouth:'smirk'}),
    'unimpressed': (x,y,s,t) => sarah(x,y,s,{t, lookX:.7, mouth:'flat', tilt:-.1}),
    'texting on phone': (x,y,s,t) => sarahPerform(x,y,s,t,'texting'),
    'woodworking': (x,y,s,t) => sarahPerform(x,y,s,t,'woodworking'),
    'volleyball set': (x,y,s,t) => sarahPerform(x,y,s,t,'volleyball set'),
    'volleyball spike': (x,y,s,t) => sarahPerform(x,y,s,t,'volleyball spike'),
    'rebellion bout': (x,y,s,t) => sarahPerform(x,y,s,t,'rebellion'),
    'cooling down': (x,y,s,t) => sarah(x,y,s,{t, rebellion:.5+.5*wob(t,.2), handPoseL:'fist', handPoseR:'fist', mouth:'flat'}),
  },
};
