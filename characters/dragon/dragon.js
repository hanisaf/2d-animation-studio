// Dragon: a round, friendly, flying dragon based on the two reference pictures.
// dragon(x, y, s, options) draws at a floor point and returns screen-pixel anchors.
// Local y points down; the feet are at 0 and the horns reach about -27.

const DR = {
  ink: '#284334', green: '#258343', greenLight: '#369B50', greenDark: '#176737',
  belly: '#A8DB67', bellyLight: '#C7EA86', bellyDark: '#79BA4D',
  wing: '#83CF5A', wingLight: '#A9E67A', wingRib: '#278548',
  teal: '#40B7A3', tealLight: '#75D7C3', horn: '#E6D477', hornDark: '#B9A952',
  eye: '#FFFEF6', pupil: '#14251D', cheek: '#E17D9B', mouth: '#522D3D', tongue: '#ED8C9B',
};
const DRAGON_UNIT = 6.3;       // ~170 world units from paws to horns

function dragon(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, flight = clamp(o.fly || 0);
  const lw = clamp(s * .16, 1.6, 5.5) / s;
  const breathe = o.breathe === false ? 0 : .12 * wob(t, .32);
  const tail = (o.tailSwing ?? 0) + .3 * wob(t, .65);
  const wings = clamp(o.wings ?? lerp(.26, 1, flight));
  const flap = o.flap ?? (flight ? wob(t, 2.4) : .12 * wob(t, .8));
  const rise = o.jump ?? 0;

  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) {
    const shadow = 1 - clamp(rise / 18) * .55;
    ellipse(0, .35, 9.6 * shadow, 1.15 * shadow, { fill: 'rgba(34,51,32,.22)', stroke: null });
  }
  X.translate(0, -rise);
  if (o.rot) { X.translate(0, -9); X.rotate(o.rot); X.translate(0, 9); }
  if (o.sq) X.scale(1 + o.sq * .4, 1 - o.sq);
  if (o.lean) { X.translate(0, -8); X.rotate(o.lean); X.translate(0, 8); }

  withBoil(o.boil ?? .65, () => {
    // Silhouette from back to front: tail and spines, wings, haunches, body, paws, face.
    drTail(tail, lw, A);
    drBackSpikes(lw);
    drWing(-1, wings, flap, lw, A);
    drWing(1, wings, flap, lw, A);

    ellipse(5.6, -5.7 + breathe, 4.9, 5.6, { fill: DR.greenDark, stroke: DR.ink, lw });
    drFoot(7.2, lerp(-.4, -3.2, flight), 1, lw, flight);
    drFoot(-5.6, lerp(-.35, -2.6, flight), -1, lw, flight);

    // Round pear-shaped body, with a long neck growing out of its front edge.
    shape([[-5.9, -3], [-7.2, -7], [-5.9, -12.8], [-3.9, -16.7],
      [-1.5, -17.6], [1.6, -15.1], [5.6, -13.5], [9.1, -10.7],
      [10.1, -6], [8.5, -2.7], [5.7, -.9], [1.2, -1.1], [-3.8, -1.1]],
      { fill: DR.green, stroke: DR.ink, lw, smooth: .75 });
    ellipse(5.3, -6.4, 3.2, 4.6, { fill: 'rgba(17,93,42,.16)', stroke: null });
    drBelly(lw, breathe);

    // Forelegs remain visible in a hover: they tuck up and the claws dangle.
    for (const sd of [-1, 1]) {
      const fx = sd < 0 ? -5.2 : 1.0, fy = lerp(-.4, -5.8, flight);
      shape([[sd < 0 ? -5.5 : 1.1, -10.1], [fx + sd * .7, -9.5],
        [fx + sd * .45, -3.5], [fx + sd * .95, fy], [fx - sd * 1.1, fy + .35],
        [fx - sd * 1.35, -3.7]], { fill: DR.greenLight, stroke: DR.ink, lw, smooth: .7 });
      drClaws(fx, fy, sd, lw);
      A[sd < 0 ? 'pawL' : 'pawR'] = toPx(fx, fy);
    }

    // Horns are behind the face, so their bases disappear into the head.
    drHorn(-5.8, -23.6, -.25, lw);
    drHorn(1.2, -24.2, .15, lw);
    shape([[-3.3, -26.9], [-2.1, -25.9], [-1.7, -23.6], [-3.1, -24.2]],
      { fill: DR.teal, stroke: DR.ink, lw, smooth: .45 });

    X.save(); X.translate(-2.7, -19.5); X.rotate(o.headTilt ?? .05 * wob(t, .7)); X.translate(2.7, 19.5);
    drHead(o, t, lw, A);
    X.restore();
  });
  A.belly = toPx(-2.2, -8.8);
  A.top = toPx(-2.7, -27);
  X.restore();
  if (o.question) drQuestion(A.head, s, t, o.question);
  return A;
}

function drTail(swing, lw, A) {
  X.save(); X.translate(8.3, -4.6); X.rotate(swing * .11);
  shape([[0, -3], [3.1, -2.9], [6.2, -.5], [7.5, 2.4], [6.4, 4.1],
    [3.4, 4.7], [.9, 3.8], [1.8, 2.2], [4.5, 2.3], [4.6, 1.4],
    [1.9, .5], [-.8, .7]], { fill: DR.greenDark, stroke: DR.ink, lw, smooth: .7 });
  shape([[6.5, 2.2], [7.4, 3.9], [5.4, 4.6], [3.4, 4.7], [1.5, 3.8],
    [3.8, 3.6], [5.4, 2.8]], { fill: DR.belly, stroke: DR.ink, lw: lw * .6, smooth: .6 });
  for (let i = 0; i < 3; i++) {
    const tx = 2.5 + i * 1.35, ty = -2.4 + i * .5;
    shape([[tx - .7, ty], [tx, ty - 1.55 + .15 * i], [tx + .8, ty + .2]],
      { fill: DR.teal, stroke: DR.ink, lw: lw * .7, smooth: .4 });
  }
  A.tailTip = toPx(14.8, -.7);
  X.restore();
}

function drBackSpikes(lw) {
  for (let i = 0; i < 5; i++) {
    const x = 1.7 + i * 1.55, y = -15.1 + i * 1.1;
    shape([[x - .8, y + .4], [x, y - 2.0 + .15 * i], [x + 1.15, y + .45]],
      { fill: i % 2 ? DR.teal : DR.tealLight, stroke: DR.ink, lw: lw * .8, smooth: .35 });
  }
}

function drWing(sd, spread, flap, lw, A) {
  const root = [sd * 1.9, -14.9];
  const elbow = [sd * lerp(4.4, 7.2, spread), -19.1 - spread * 1.8 - flap * 1.2];
  const peak = [sd * lerp(7.0, 12.2, spread), -21.4 - spread * 5.2 - flap * 4.5];
  const tip = [sd * lerp(9.8, 18.0, spread), -18.8 - spread * 4.0 - flap * 4.7];
  const low = [sd * lerp(8.2, 15.8, spread), -11.4 - spread * 1.8 - flap * 2.5];
  const middle = [sd * lerp(5.9, 10.9, spread), -11.4 + spread * 1.2 - flap * 1.8];
  X.beginPath(); X.moveTo(...root); X.lineTo(...elbow); X.lineTo(...peak); X.lineTo(...tip);
  X.quadraticCurveTo(sd * lerp(8.9, 14.3, spread), -16.1 - spread - flap * 2.7, ...low);
  X.quadraticCurveTo(sd * lerp(7.1, 11.7, spread), -15.5 - flap * 1.9, ...middle);
  X.quadraticCurveTo(sd * lerp(3.5, 7.2, spread), -12.7, ...root); X.closePath();
  paintPath({ fill: DR.wing, stroke: DR.ink, lw });
  shape([root, elbow, peak, [sd * lerp(8.0, 11.8, spread), -17.2 - spread * 1.9 - flap * 2.1]],
    { fill: DR.wingLight, stroke: null, alpha: .36 });
  line([root, elbow, peak], { stroke: DR.wingRib, lw: lw * 1.25, smooth: .25 });
  line([elbow, tip], { stroke: DR.wingRib, lw: lw * 1.1 });
  line([elbow, middle], { stroke: DR.wingRib, lw: lw });
  line([elbow, low], { stroke: DR.wingRib, lw: lw * .85 });
  circle(elbow[0], elbow[1], .55, { fill: DR.greenLight, stroke: DR.ink, lw: lw * .7 });
  A[sd < 0 ? 'wingTipL' : 'wingTipR'] = toPx(...tip);
}

function drFoot(x, y, sd, lw, flight) {
  ellipse(x, y - 2.1, 2.6, 3.8 - flight * .5, { fill: DR.greenDark, stroke: DR.ink, lw });
  ellipse(x + sd * .35, y + .05, 2.7, 1.25, { fill: DR.greenLight, stroke: DR.ink, lw });
  drClaws(x + sd * .35, y + .15, sd, lw);
}

function drClaws(x, y, sd, lw) {
  for (let i = -1; i <= 1; i++) {
    const cx = x + i * .88 + sd * .35;
    shape([[cx - .42, y + .15], [cx + .1, y - .3], [cx + .58, y + .15],
      [cx + .3, y + 1.55], [cx - .05, y + 1.25]],
      { fill: DR.teal, stroke: DR.ink, lw: lw * .75, smooth: .45 });
  }
}

function drBelly(lw, breathe) {
  const p = [[-5.9, -13.2], [-4.5, -16.2], [-1.8, -16.5], [.1, -13.5],
    [.8, -9.0], [.7, -4.5], [-.9, -2.3], [-3.7, -2.8], [-5.8, -6.4]];
  shape(p, { fill: DR.belly, stroke: DR.ink, lw, smooth: .8 });
  X.save(); tracePath(p, true, .8); X.clip();
  ellipse(-3.5, -10, 2.3 + breathe, 6.7, { fill: 'rgba(239,255,184,.2)', stroke: null });
  for (const yy of [-14.0, -11.4, -8.7, -6.0, -3.8]) {
    line([[-6.3, yy + .8], [-3.3, yy + 1.2], [.65, yy + .5]],
      { stroke: DR.bellyDark, lw: lw * .85, smooth: true, alpha: .75 });
  }
  X.restore();
}

function drHorn(x, y, rot, lw) {
  X.save(); X.translate(x, y); X.rotate(rot);
  shape([[-.85, .7], [-.92, -1.0], [-.5, -2.7], [0, -4.1], [.65, -2.4],
    [.88, -.8], [.9, .7]], { fill: DR.horn, stroke: DR.ink, lw, smooth: .55 });
  line([[-.75, -1.0], [.72, -.8]], { stroke: DR.hornDark, lw: lw * .9, smooth: true });
  line([[-.65, -2.1], [.58, -1.95]], { stroke: DR.hornDark, lw: lw * .8, smooth: true });
  X.restore();
}

function drHead(o, t, lw, A) {
  const turn = clamp(o.turn || 0, -1, 1), tx = turn * .55;
  // Rounded brow and cheeks, then the big soft muzzle in front.
  shape([[-7.9, -22.2], [-7.2, -24.3], [-5.1, -25.1], [-2.3, -25],
    [.9, -24.1], [2.7, -22.1], [2.8, -19.1], [1.0, -16.8],
    [-3.1, -16.1], [-6.8, -18.1]],
    { fill: DR.greenLight, stroke: DR.ink, lw, smooth: .8 });
  ellipse(-4.7, -23.0, 2.0, .85, { fill: 'rgba(181,234,138,.27)', stroke: null });

  const eyeKind = o.eyes || 'open';
  for (const [i, ex] of [-4.9, -.55].entries()) {
    const ey = -21.9, side = i ? 1 : -1;
    let kind = eyeKind === 'wink' && i === 1 ? 'happy' : eyeKind;
    if (kind === 'happy' || kind === 'closed') {
      line([[ex - 1.25, ey + .3], [ex, ey + (kind === 'happy' ? -.55 : .55)], [ex + 1.25, ey + .3]],
        { stroke: DR.ink, lw: lw * 1.8, smooth: true });
    } else {
      ellipse(ex + tx * .25, ey, 1.52, kind === 'wide' ? 2.35 : 2.0,
        { fill: DR.eye, stroke: DR.ink, lw });
      const ix = ex + tx * .25 + clamp(o.lookX || 0, -1, 1) * .47;
      const iy = ey + .2 + clamp(o.lookY || 0, -1, 1) * .45;
      circle(ix, iy, .99, { fill: DR.pupil, stroke: null });
      circle(ix - .33, iy - .45, .37, { fill: '#FFFFFF', stroke: null });
      circle(ix + .33, iy + .35, .15, { fill: '#FFFFFF', stroke: null });
      const b = o.blink ?? (frac((t + i * .23) / 3.3) < .045 ?
        Math.sin(frac((t + i * .23) / 3.3) / .045 * Math.PI) : 0);
      if (b > .02) shape(rectPts(ex - 1.6, ey - 2.2, 3.2, b * 4.2),
        { fill: DR.greenLight, stroke: null });
    }
    const by = ey - 2.5 - (o.brows === 'up' ? .55 : 0);
    line([[ex - 1.1, by + .35 * side * turn], [ex, by - .22], [ex + 1.1, by + .12]],
      { stroke: DR.greenDark, lw: lw * 1.35, smooth: true });
    A[i ? 'eyeR' : 'eyeL'] = toPx(ex, ey);
  }

  shape([[-8.3, -18.7], [-6.9, -19.6], [-4.8, -19.2], [-2.9, -18.4],
    [.1, -19], [2.0, -18], [2.1, -16.1], [.8, -14.7], [-2.4, -14.3],
    [-5.8, -14.9], [-8.1, -16.4]],
    { fill: DR.greenLight, stroke: DR.ink, lw, smooth: .78 });
  ellipse(-6.6, -17.0, .35, .47, { fill: DR.greenDark, stroke: null, rot: -.25 });
  ellipse(.65, -17.2, .35, .45, { fill: DR.greenDark, stroke: null, rot: .25 });
  if (o.cheeks !== false) {
    ellipse(-7.3, -16.4, .65, .45, { fill: rgba(DR.cheek, .65), stroke: null });
    ellipse(1.35, -16.0, .55, .4, { fill: rgba(DR.cheek, .55), stroke: null });
  }
  const mouth = o.mouth || 'smile';
  if (mouth === 'open' || mouth === 'grin' || mouth === 'o') {
    const w = mouth === 'o' ? 1.15 : 2.9, h = mouth === 'o' ? 1.2 : mouth === 'grin' ? 1.35 : 1.8;
    ellipse(-3.2 + tx, -15.4, w, h, { fill: DR.mouth, stroke: DR.ink, lw: lw * .8 });
    if (mouth !== 'o') {
      ellipse(-3.15 + tx, -14.75, w * .63, .43, { fill: DR.tongue, stroke: null });
      line([[-3.2 - w * .65 + tx, -16.25], [-3.2 + w * .65 + tx, -16.25]],
        { stroke: DR.eye, lw: lw * .65, smooth: true });
    }
  } else if (mouth === 'pout') {
    line([[-4.5 + tx, -15.2], [-3.0 + tx, -14.95], [-1.6 + tx, -15.2]],
      { stroke: DR.ink, lw: lw * 1.05, smooth: true });
  } else {
    line([[-6.1 + tx, -16.1], [-4.8 + tx, -15.45], [-2.8 + tx, -15.1],
      [-1.0 + tx, -15.55], [.3 + tx, -16.2]],
      { stroke: DR.ink, lw: lw * 1.1, smooth: true });
  }
  A.head = toPx(-2.8, -21.0);
  A.mouth = toPx(-3.0 + tx, -15.3);
}

// Pure pose helper: speed changes wingbeat rate; lift sets height in local units.
function dragonFlight(t, { speed = 2.4, lift = 6, phase = 0 } = {}) {
  const beat = wob(t, speed, phase);
  return { fly: 1, wings: 1, flap: beat, jump: lift + .65 * beat,
    tailSwing: .9 * wob(t, speed * .5, phase + .2), headTilt: -.06 + .04 * wob(t, speed * .5),
    mouth: 'grin', eyes: 'happy' };
}

function drQuestion(head, s, t, k) {
  const [x, y] = head, bob = Math.sin(t * 3) * s * .2;
  overlay(() => {
    X.save(); X.globalAlpha = clamp(k); X.font = `600 ${Math.max(22, s * 2.4)}px ${FONT_TALK}`;
    X.textAlign = 'center'; X.lineWidth = Math.max(2, s * .23); X.strokeStyle = DR.ink;
    X.strokeText('?', x + s * 7.5, y - s * 5 + bob);
    X.fillStyle = DR.teal; X.fillText('?', x + s * 7.5, y - s * 5 + bob); X.restore();
  });
}

CHARACTERS.dragon = {
  draw: dragon, unit: DRAGON_UNIT, palette: DR, size: [38, 40],
  poses: {
    'rest': (x, y, s, t) => dragon(x, y, s, {}),
    'curious': (x, y, s, t) => dragon(x, y, s, { headTilt: -.2, eyes: 'wide', brows: 'up', lookX: .65, lookY: -.4, question: 1, wings: .38 }),
    'listening': (x, y, s, t) => dragon(x, y, s, { headTilt: .22, lookX: -.5, mouth: 'smile', wings: .22 }),
    'thinking': (x, y, s, t) => dragon(x, y, s, { headTilt: -.12, lookY: -.8, eyes: 'wide', mouth: 'pout', question: .8 }),
    'hello!': (x, y, s, t) => dragon(x, y, s, { wings: .72, flap: .35 + .25 * wob(t, 1.5), eyes: 'happy', mouth: 'grin' }),
    'giggle': (x, y, s, t) => dragon(x, y, s, { sq: .1 * Math.abs(wob(t, 2)), headTilt: .08, eyes: 'happy', mouth: 'open', tailSwing: .8 }),
    'surprised': (x, y, s, t) => dragon(x, y, s, { eyes: 'wide', mouth: 'o', brows: 'up', wings: .7, flap: .3, jump: .7 }),
    'shy': (x, y, s, t) => dragon(x, y, s, { headTilt: .18, lookX: -.75, lookY: .55, mouth: 'pout', wings: .12, tailSwing: -.8 }),
    'wings open': (x, y, s, t) => dragon(x, y, s, { wings: 1, flap: .25, eyes: 'wide', mouth: 'grin' }),
    'hover': (x, y, s, t) => dragon(x, y, s, { ...dragonFlight(t, { lift: 5 }), eyes: 'open' }),
    'fly': (x, y, s, t) => dragon(x, y, s, dragonFlight(t, { speed: 2.8, lift: 8 })),
    'land': (x, y, s, t) => { const k = 1 - ease(seg(frac(t / 3) * 3, 0, 1.4)); dragon(x, y, s,
      { fly: k, wings: lerp(.25, 1, k), flap: wob(t, 2.2) * k, jump: 5 * k, sq: .16 * (1 - k) * kick(frac(t / 3) * 3, 1.4, 6), mouth: 'smile' }); },
  },
};
