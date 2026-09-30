// characters/jenna/jenna.js: Jenna, Alma's funny 9-year-old cousin.
// Description and look live in README.md; reference art next to it.
//
// jenna(x, y, s, o) → anchors. (x, y) = floor point between the feet (screen px), s = px per local unit.

const JENNA_UNIT = 5.0;   // world units per local unit

const JE = {
  ink: '#3B2530',
  skin: '#dabaa8', skinDk: '#ceb7ac', cheek: '#E39D8D', nose: '#C98D74',
  hair: '#4E372A', hairDk: '#30231D', hairLt: '#785640',
  shirt: '#F2CCD2', shirtDk: '#DDB0BC',
  skirtBase: '#DFA4AE', skirtTulle: '#F1C1C8',
  shoe: '#F2B8C6', shoeTop: '#E6A5B5', shoeSole: '#FFFFFF', sock: '#FFFFFF',
  clip: '#DFA0C4',
  eyeW: '#FFFFFF', iris: '#80502B', lash: '#140A05', brow: '#382012', mouth: '#9C3D49', tongue: '#E88494', teeth: '#FFFFFF',
  graphic: { butterfly: '#D66D9F', flowerY: '#F0E675', flowerG: '#9BD687', flowerB: '#688AB5', flowerP: '#F2A2CA' }
};

function jenna(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, lw = clamp(s * .12, 1.2, 5.0) / s;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  
  const air = o.jump || 0;
  if (!o.noShadow) { const f = 1 - clamp(air / 14) * .55; ellipse(0, .12, 3.2 * f, .6 * f, { fill: 'rgba(40,20,30,.28)', stroke: null }); }

  X.translate(0, -air);
  if (o.sq) X.scale(1 + o.sq * .55, 1 - o.sq);

  withBoil(o.boil ?? .7, () => {
    // Reference proportions: expressive child face and a knee-length tulle skirt.
    const hipY = -11.5 + (o.dy || 0), lean = o.lean || 0, cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];
    const headT = () => { X.translate(0, hipY); X.rotate(lean); X.translate(0, -6.0); X.rotate(o.tilt || 0); X.translate(0, -4.0); };

    // Legs
    [[-1, o.footL || [-1.25, -.65]], [1, o.footR || [1.25, -.65]]].forEach(([sd, f]) => {
      const hp = tl(sd * 1.1, 0), { joint, end } = ik2(hp, f, 5.5, 5.5, [sd * .15, 1]);
      jeLimb([hp, joint, end], 1.6, JE.skin, lw);
      jeSockAndShoe(end, sd, lw);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
    });

    // Torso & Skirt
    X.save(); X.translate(0, hipY); X.rotate(lean);
    // Neck
    shape(rectPts(-.6, -7.0, 1.2, 1.5), { fill: JE.skin, stroke: JE.ink, lw });
    // Skirt back/underskirt
    const skirtW = 3.15;
    const skirtL = 5.5; 
    shape([[-1.8, -0.5], [1.8, -0.5], [skirtW, skirtL], [-skirtW, skirtL]], { fill: JE.skirtBase, stroke: JE.ink, lw, smooth: .2 });
    // Tulle skirt layers
    shape([[-1.8, -0.5], [1.8, -0.5], [skirtW + 0.3, skirtL + 0.3], [-(skirtW + 0.3), skirtL + 0.3]], { fill: rgba(JE.skirtTulle, .85), stroke: JE.ink, lw, smooth: .2 });
    X.save();
    tracePath([[-1.8, -.5], [1.8, -.5], [skirtW + .3, skirtL + .3], [-skirtW - .3, skirtL + .3]], true, .2); X.clip();
    for (let i = -4; i <= 4; i++) {
      line([[i * .4, 0], [i * .76, skirtL + .4]], { stroke: rgba(JE.skirtBase, .6), lw: .22 });
      line([[i * .4 + .12, 0], [i * .76 + .17, skirtL + .4]], { stroke: rgba('#FFF3EF', .45), lw: .14 });
    }
    X.restore();
    // Shirt
    jeShirt(lw);
    A.chest = toPx(0, -5.5); A.belly = toPx(0, -2);
    X.restore();

    // Arms (in front)
    [[-1, o.handL || [-2.05, -12.0], o.handPoseL || 'fist'], [1, o.handR || [2.05, -12.0], o.handPoseR || 'fist']].forEach(([sd, tg, pose]) => {
      const sh = tl(sd * 2.2, -5.5), { joint, end } = ik2(sh, tg, 3.5, 3.5, [sd * 1, 0.5]);
      jeLimb([sh, joint, end], 1.2, JE.skin, lw);
      // Sleeve (over upper arm)
      const slvEnd = mixPt(sh, joint, .45);
      const slvW = 1.4;
      line([sh, slvEnd], { stroke: JE.ink, lw: slvW + lw * 2, lineCap: 'round' });
      line([sh, slvEnd], { stroke: JE.shirt, lw: slvW, lineCap: 'round' });
      // Hand
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      jeHand(end, ang, sd, pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang)*.5, end[1] + Math.sin(ang)*.5);
    });

    // Head
    X.save(); headT(); X.scale(1.17, 1.08);
    jeHead(o, t, lw, A);
    A.top = toPx(0, -4.6);
    X.restore();

  });
  X.restore();
  return A;
}

function jeLimb(pts, w, col, lw) {
  if (JIT) { const a = JIT / pxScale(); pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  line(pts, { stroke: JE.ink, lw: w + lw * 2, lineJoin: 'round', lineCap: 'round' });
  line(pts, { stroke: col, lw: w, lineJoin: 'round', lineCap: 'round' });
}

function jeSockAndShoe(a, sd, lw) {
  X.save(); X.translate(a[0], a[1]); X.scale(sd * 1.15, 1);
  // Sock
  shape(rectPts(-.7, -1.8, 1.4, 1.8), { fill: JE.sock, stroke: JE.ink, lw });
  line([[-.7, -1.8], [.7, -1.8]], { stroke: '#DAD6D1', lw: .2 });
  for (let i = -2; i <= 2; i++) line([[i * .22, -1.75], [i * .22, -1.4]], { stroke: '#DAD6D1', lw: .06 });
  // Shoe (slip-on)
  shape([[-.9, -.2], [-.75, -1.0], [-.2, -1.2], [.5, -1.1], [1.1, -.4], [1.2, .4], [.9, .6], [-.2, .6], [-.9, .4]], { fill: JE.shoe, stroke: JE.ink, lw, smooth: .6 });
  // Sole
  line([[-1.0, .3], [1.2, .3]], { stroke: JE.ink, lw: lw });
  shape([[-1.0, .3], [1.2, .3], [.9, .6], [-.2, .6], [-.9, .4]], { fill: JE.shoeSole, stroke: null, smooth: .4 });
  // Elastic detail
  shape([[0, -1.1], [.2, -.8], [.4, -1.1]], { fill: '#E6A8B8', stroke: null });
  X.restore();
}

function jeFlower(x, y, r, color, center) {
  for (let i = 0; i < 6; i++) {
    const a = i * TAU / 6;
    X.save(); X.translate(x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55); X.rotate(a);
    ellipse(0, 0, r * .5, r * .25, { fill: color, stroke: null }); X.restore();
  }
  circle(x, y, r * .24, { fill: center, stroke: null });
}

function jeButterfly(x, y, size, ang = 0) {
  X.save(); X.translate(x, y); X.rotate(ang); X.scale(size, size);
  [-1, 1].forEach(sd => {
    shape([[0, 0], [sd * .75, -1.05], [sd * 1.15, -.9], [sd * .94, -.3], [sd * .25, .12]],
      { fill: JE.graphic.butterfly, stroke: null, smooth: .55 });
    shape([[0, .05], [sd * .8, .18], [sd * .68, .92], [sd * .3, .83]],
      { fill: JE.graphic.flowerP, stroke: null, smooth: .6 });
    line([[sd * .1, -.02], [sd * .67, -.75], [sd * .88, -.7], [sd * .35, -.2]],
      { stroke: '#EFB7CC', lw: .05, smooth: true });
    line([[sd * .08, .12], [sd * .42, .66]], { stroke: '#E1A6BA', lw: .05 });
    line([[0, -.08], [sd * .15, -.42]], { stroke: '#7FAA82', lw: .04 });
  });
  line([[0, -.14], [0, .6]], { stroke: '#7FAA82', lw: .1 });
  X.restore();
}

function jeShirt(lw) {
  const body = [[-1.8, -.5], [-2.05, -1.5], [-1.9, -3], [-2.2, -6], [-1.2, -6.5],
    [0, -6.2], [1.2, -6.5], [2.2, -6], [1.9, -3], [2.05, -1.5], [1.8, -.5], [0, -.3]];
  shape(body, { fill: JE.shirt, stroke: JE.ink, lw, smooth: .4 });
  line([[-.75, -6.4], [0, -6.07], [.75, -6.4]], { stroke: JE.shirtDk, lw: .17, smooth: true });
  X.save(); tracePath(body, true, .4); X.clip();
  withBoil(0, () => {
    line([[-1.85, -.75], [0, -.62], [1.85, -.75]], { stroke: JE.shirtDk, lw: .09, smooth: true });
    jeFlower(-1.1, -4.92, .58, JE.graphic.flowerY, JE.graphic.butterfly);
    jeFlower(.02, -5.12, .68, JE.graphic.flowerG, JE.graphic.butterfly);
    jeFlower(1.45, -5.4, .34, '#E9AB58', '#F8D991');
    jeFlower(-.77, -3.65, .62, '#EBAAB9', '#E9AB58');
    jeFlower(.25, -3.94, .36, JE.graphic.flowerB, '#F2D1DC');
    jeFlower(1.15, -2.95, .66, JE.graphic.flowerG, JE.graphic.butterfly);
    jeFlower(-1.25, -1.72, .37, JE.graphic.flowerB, '#F2D1DC');
    jeFlower(1.28, -1.62, .5, JE.graphic.flowerY, JE.graphic.butterfly);
    jeFlower(.62, -2.15, .28, '#E9AB58', '#F8D991');
    jeButterfly(1.0, -4.65, .63, .18);
    jeButterfly(-.36, -2.45, .83, -.18);
  });
  X.restore();
}

function jeHead(o, t, lw, A) {
  const turn = clamp(o.turn || 0, -1, 1), tx = turn * .45;
  
  // Hair is tied back, leaving both ears visible.
  shape([[0, -4.35], [2.05, -3.9], [3.05, -2.2], [2.87, 1.0], [-2.87, 1.0], [-3.05, -2.2], [-2.05, -3.9]],
    { fill: JE.hair, stroke: JE.ink, lw, smooth: .65 });
  [-1, 1].forEach(sd => {
    ellipse(sd * 2.86 - turn * .2, .8, .55, .84, { fill: JE.skin, stroke: JE.ink, lw });
    ellipse(sd * 2.98 - turn * .2, .85, .23, .44, { fill: rgba(JE.skinDk, .55), stroke: null });
  });

  // Face Shape: Wider, squarer/rounder jawline
  const face = [[0, -3.0], [2.2, -2.5], [2.8, 0], [2.5, 2.5], [1.2, 3.5], [0, 3.8], [-1.2, 3.5], [-2.5, 2.5], [-2.8, 0], [-2.2, -2.5]];
  shape(face, { fill: JE.skin, stroke: JE.ink, lw, smooth: true });
  
  // Cheeks
  const bl = o.blush ?? .8;
  if (bl > .01) [-1, 1].forEach(sd => ellipse(sd * 1.8 + tx * .5, 1.4, .9, .6, { fill: rgba(JE.cheek, .4 * bl), stroke: null }));

  // Eyes: Almond shaped, wider spacing
  const eyeX = [-1.1 + tx, 1.1 + tx];
  eyeX.forEach((ex, i) => jeEye(ex, -.2, { ...o, t }, i === 0, lw));
  A.eyeL = toPx(eyeX[0], -0.2); A.eyeR = toPx(eyeX[1], -0.2);

  // Soft arched eyebrows and a small shaded nose.
  eyeX.forEach(ex => {
    const lift = o.brows === 'up' ? -.28 : o.brows === 'worried' ? -.12 : 0;
    line([[ex - .65, -1.3 + lift], [ex, -1.55 + lift], [ex + .65, -1.3 + lift]],
      { stroke: JE.hairLt, lw: .2, smooth: true });
  });
  ellipse(tx * 1.1, 1.12, .34, .25, { fill: rgba(JE.nose, .65), stroke: null });
  ellipse(tx * 1.1 - .08, 1.02, .15, .08, { fill: '#F2C7AA', stroke: null });

  // Mouth: Wide, toothy smile
  jeMouth(o.mouth || 'grin', tx, lw);
  A.mouth = toPx(tx, 2.4); A.head = toPx(0, 0);

  // Short waves around the forehead, with a part just right of centre.
  shape([[.6, -3.65], [-.6, -4.48], [-2.0, -4.17], [-2.9, -3.18], [-2.88, -.45],
    [-2.5, -1.12], [-2.25, -2.33], [-1.4, -2.5], [-.6, -2.91], [.18, -3.12]],
    { fill: JE.hair, stroke: JE.ink, lw, smooth: .5 });
  shape([[.5, -3.65], [1.4, -4.17], [2.54, -3.58], [3, -2.34], [2.76, -.38],
    [2.48, -1.3], [2.03, -2.45], [1.2, -2.94]],
    { fill: JE.hair, stroke: JE.ink, lw, smooth: .55 });
  line([[-2.58, -2.6], [-2.0, -3.45], [-1.0, -3.73], [-.3, -3.37]], { stroke: JE.hairLt, lw: .14, smooth: true });
  line([[.9, -3.66], [1.9, -3.3], [2.55, -2.23]], { stroke: JE.hairLt, lw: .14, smooth: true });
  line([[-1.55, -2.58], [-.92, -2.48], [-.3, -3.05]], { stroke: JE.hairDk, lw: .13, smooth: true });

  // Curly side ponytail rests over her right shoulder.
  shape([[2.42, 2.03], [3.6, 2.38], [4.05, 4.6], [3.7, 6.83], [2.85, 7.1], [2.32, 5.5], [2.21, 3.35]],
    { fill: JE.hair, stroke: JE.ink, lw, smooth: .6 });
  [[2.7, 2.65], [3.35, 3.0], [2.75, 3.7], [3.65, 3.9], [2.9, 4.7], [3.65, 5.1], [2.75, 5.8], [3.35, 6.3]].forEach(([cx, cy], i) => {
    ellipse(cx, cy, .5, .62, { fill: i % 2 ? JE.hair : JE.hairLt, stroke: JE.hairDk, lw: lw * .65 });
    line([[cx - .18, cy - .3], [cx + .2, cy - .18], [cx + .21, cy + .2], [cx - .12, cy + .29]],
      { stroke: i % 2 ? JE.hairLt : JE.hair, lw: .12, smooth: true });
  });
  jeClip(-2.4, -2.72, -.42, lw);
  jeClip(2.55, -1.96, .3, lw);
}

function jeClip(x, y, ang, lw) {
  X.save(); X.translate(x, y); X.rotate(ang);
  [-1, 1].forEach(sd => {
    ellipse(sd * .18, -.12, .17, .27, { fill: JE.clip, stroke: null });
    ellipse(sd * .17, .2, .15, .19, { fill: '#E9B2D2', stroke: null });
  });
  line([[0, -.26], [0, .31]], { stroke: '#EED999', lw: .08 });
  X.restore();
}

function jeEye(cx, cy, o, isLeft, lw) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = isLeft ? 'open' : 'happy';
  const rx = .92, ry = kind === 'wide' ? .9 : .75;
  if (kind === 'happy' || kind === 'closed') {
    line([[cx - rx, cy + .12], [cx, cy + (kind === 'happy' ? -.22 : .18)], [cx + rx, cy + .12]],
      { stroke: JE.lash, lw: lw * 1.5, smooth: true }); return;
  }
  ellipse(cx, cy, rx, ry, { fill: JE.eyeW, stroke: JE.ink, lw: lw * .7 });
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); X.clip();
  const ix = cx + clamp(o.lookX || 0, -1, 1) * .22, iy = cy + .06 + clamp(o.lookY || 0, -1, 1) * .17;
  circle(ix, iy, .56, { fill: JE.iris, stroke: null });
  circle(ix, iy, .34, { fill: JE.lash, stroke: null });
  circle(ix - .18, iy - .22, .16, { fill: '#FFFFFF', stroke: null });
  circle(ix + .18, iy + .17, .06, { fill: '#FFFFFF', stroke: null });
  const ph = ((o.t ?? T) + .8) % 3.4;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (blink > .01) shape(rectPts(cx - 1, cy - ry - .1, 2, (ry * 2 + .2) * blink), { fill: JE.skin, stroke: null });
  X.restore();
  line([[cx - rx, cy -.1], [cx -.35, cy - ry], [cx + .3, cy - ry], [cx + rx, cy -.1]],
    { stroke: JE.hairDk, lw: lw * 1.2, smooth: true });
}

function jeMouth(kind, tx, lw) {
  X.save(); X.translate(tx, 2.4);
  if (kind === 'smile') {
    line([[-.8, -.1], [0, .1], [.8, -.1]], { stroke: JE.ink, lw: lw * 1.5, smooth: true });
    line([[-.7, -.15], [-.8, -.1]], { stroke: JE.ink, lw: lw });
    line([[.7, -.15], [.8, -.1]], { stroke: JE.ink, lw: lw });
  } else if (kind === 'grin' || kind === 'open') {
    // Wide toothy smile
    const pts = kind === 'grin' ? [[-1.1, 0], [0, .1], [1.1, 0], [.75, .6], [0, .8], [-.75, .6]] : [[-.6, .1], [0, 0], [.6, .1], [.5, .8], [0, 1.0], [-.5, .8]];
    shape(pts, { fill: JE.mouth, stroke: JE.ink, lw, smooth: .4 });
    X.save(); tracePath(pts, true, .4); X.clip();
    // Teeth block
    shape(rectPts(-1.2, -.1, 2.4, kind === 'grin' ? .3 : .25), { fill: JE.teeth, stroke: null });
    // Teeth separator
    line([[-1.0, .2], [1.0, .2]], { stroke: rgba(JE.ink, .3), lw: lw*.8 });
    ellipse(0, .8, .5, .3, { fill: JE.tongue, stroke: null });
    X.restore();
  } else if (kind === 'o') {
    ellipse(0, .2, .25, .3, { fill: JE.mouth, stroke: JE.ink, lw });
  } else {
    line([[-.6, .1], [.6, .1]], { stroke: JE.ink, lw: lw * 1.5 });
  }
  X.restore();
}

function jeHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  if (pose === 'fist') {
     shape([[.1, -.3], [.4, -.4], [.7, -.2], [.8, 0], [.7, .2], [.3, .3], [.1, .2]], { fill: JE.skin, stroke: JE.ink, lw, smooth: .6 });
  } else {
     const f = pose === 'palm' ? [[-.4, .4], [-.1, .5], [.2, .4], [.5, .3], [-1.0, .3]] : [[-.2, .3], [0, .4], [.2, .4], [.4, .3], [-1.0, .2]];
     const fingers = f.map(([a, l]) => [[.3, 0], [.3 + Math.cos(a) * (.2 + l), Math.sin(a) * (.2 + l)]]);
     fingers.forEach(g => line(g, { stroke: JE.ink, lw: .2 + lw * 2 }));
     circle(.3, 0, .3, { stroke: JE.ink, lw: lw * 2 });
     fingers.forEach(g => line(g, { stroke: JE.skin, lw: .2 }));
     circle(.3, 0, .3, { fill: JE.skin, stroke: null });
  }
  X.restore();
}

function jennaDance(t, move, o = {}) {
  const b = t * (o.bpm ?? 112) / 60, k = o.k ?? 1, S = Math.sin, P = Math.PI, hop = Math.abs(S(b * P));
  const face = { eyes: 'happy', mouth: 'grin', brows: 'up' };
  switch (move) {
    case 'bounce': return { ...face, dy: .45 * k * hop, jump: .3 * k * hop, tilt: .07 * k * S(b * P),
      handL: [-3.1, -13.5 - 1.2 * hop * k], handR: [3.1, -13.5 - 1.2 * hop * k], handPoseL: 'fist', handPoseR: 'fist' };
    case 'sway': { const sw = S(b * P / 2); return { ...face, eyes: 'closed', mouth: 'smile', lean: .09 * k * sw, tilt: .12 * k * sw,
      handL: [-5.0 + .6 * sw, -19.0 - .8 * sw], handR: [5.0 + .6 * sw, -19.0 + .8 * sw], handPoseL: 'palm', handPoseR: 'palm' }; }
    case 'disco': { const up = frac(b / 2) < .5; return { ...face, mouth: up ? 'open' : 'grin', eyes: 'open', lookX: up ? .7 : -.4, lookY: up ? -.8 : .3, dy: .3 * hop,
      lean: (up ? -.07 : .07) * k, handR: up ? [4.9, -23.0] : [-1.6, -10.5], handPoseR: 'point', handL: [-2.6, -11.5], handPoseL: 'fist',
      footR: up ? [1.3, -.55] : [.7, -1.1] }; }
    case 'twirl': { const sp = b * P; return { ...face, spin: sp, dy: .2, handL: [-5.3, -17.5], handR: [5.3, -17.5], handPoseL: 'palm', handPoseR: 'palm',
      footL: [-.4, -.55], footR: [.5, -1.5] }; }
    case 'star jump': { const j = S(frac(b / 2) * P), sq = kick(frac(b / 2), 0, 14) * .15; return { ...face, mouth: j > .5 ? 'open' : 'grin', jump: 3.2 * k * j, sq: sq - .06 * j,
      handL: mixPt([-3.2, -12.5], [-5.0, -22.0], j), handR: mixPt([3.2, -12.5], [5.0, -22.0], j), handPoseL: 'palm', handPoseR: 'palm',
      footL: mixPt([-.9, -.55], [-2.1, -.8], j), footR: mixPt([.9, -.55], [2.1, -.8], j) }; }
    case 'floss': { const f = S(b * P); return { ...face, mouth: 'grin', eyes: 'open', lookX: -f * .5, lean: -.08 * k * f, dy: .15,
      handL: [-.6 + 2.6 * f * k, -11.5], handR: [.6 + 2.6 * f * k, -11.5], handPoseL: 'fist', handPoseR: 'fist' }; }
    case 'arm wave': { const w = u => S(b * P + u); return { ...face, tilt: .08 * w(0), dy: .2 * hop,
      handL: [-4.7, -17.5 - 2.2 * w(0) * k], handR: [4.7, -17.5 - 2.2 * w(P) * k], handPoseL: 'palm', handPoseR: 'palm' }; }
  }
  return {};
}

function jennaSkip(p, k = 1) {
  const sn = Math.sin(p * Math.PI), a = Math.abs(sn);
  return {
    jump: .7 * k * a * a, dy: .25 * k * (1 - a), tilt: .04 * k * sn,
    footL: [-.9, -.55 - 1.5 * k * Math.max(0, sn)], footR: [.9, -.55 - 1.5 * k * Math.max(0, -sn)],
    handL: [-3.5 + .3 * k * a, -11.5 - 1.4 * k * Math.max(0, -sn)], handR: [3.5 - .3 * k * a, -11.5 - 1.4 * k * Math.max(0, sn)],
  };
}

CHARACTERS.jenna = {
  draw: jenna, unit: JENNA_UNIT, palette: JE, size: [14, 28],
  poses: {
    'rest': (x, y, s, t) => jenna(x, y, s, {}),
    'hi!': (x, y, s, t) => jenna(x, y, s, { handR: [4.2 + .5 * wob(t, 1.6), -19.0], handPoseR: 'palm', mouth: 'grin', brows: 'up', tilt: .06 }),
    'talk': (x, y, s, t) => jenna(x, y, s, { mouth: lipFlap(t, frac(t * .5) < .7, 'smile'), brows: 'up', handR: [3.5, -14.5], handPoseR: 'palm', turn: .2 }),
    'giggle': (x, y, s, t) => { const k = Math.abs(Math.sin(t * 12)); jenna(x, y, s, { handL: [-.6, -19.0], handR: [.6, -19.0], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: k > .5 ? 'grin' : 'smile', dy: .25 * k, tilt: -.1, blush: 1 }); },
    'surprised': (x, y, s, t) => jenna(x, y, s, { eyes: 'wide', mouth: 'o', brows: 'up', handL: [-1.1, -21.0], handR: [1.1, -21.0], handPoseL: 'palm', handPoseR: 'palm' }),
    'wink': (x, y, s, t) => jenna(x, y, s, { eyes: 'wink', mouth: 'grin', handR: [3.9, -17.5], handPoseR: 'point', brows: 'up', tilt: .08 }),
    'shy': (x, y, s, t) => jenna(x, y, s, { handL: [-.5, -12.0], handR: [.5, -12.0], handPoseL: 'fist', handPoseR: 'fist', lookX: -.6, lookY: .5, mouth: 'smile', tilt: -.12, blush: 1, footR: [.5, -.9] }),
    'sad': (x, y, s, t) => jenna(x, y, s, { mouth: 'o', lookY: .7, dy: .2, tilt: .08 }),
    'skip': (x, y, s, t) => jenna(x, y, s, { ...jennaSkip(t * 2.4), handR: [3.1, -14.0], handPoseR: 'fist', mouth: 'grin', eyes: 'happy', turn: .15 }),
    'dance: bounce': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'bounce')),
    'dance: disco': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'disco')),
    'dance: twirl': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'twirl')),
    'dance: star jump': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'star jump')),
    'dance: floss': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'floss')),
    'super dance': (x, y, s, t) => jenna(x, y, s, { ...jennaDance(t, 'arm wave'), eyes: 'happy' }),
  },
};
