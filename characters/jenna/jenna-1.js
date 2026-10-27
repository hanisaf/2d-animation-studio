// characters/jenna/jenna.js: Jenna, Alma's funny 9-year-old cousin.
// Description and look live in README.md; reference art next to it.
//
// jenna(x, y, s, o) → anchors. (x, y) = floor point between the feet (screen px), s = px per local unit.

const JENNA_UNIT = 5.0;   // world units per local unit
const JENNA_SCALE = 1.06; // a small overall size increase, including the face

const JE = {
  ink: '#41291F',
  skin: '#F7CBB0', skinDk: '#E4AC91', cheek: '#EAA99F', nose: '#DDA790',
  hair: '#543522', hairDk: '#392418', hairLt: '#87583B',
  shirt: '#F5D6D9', shirtDk: '#DDB0BC',
  skirtBase: '#DFA4AE', skirtTulle: '#F1C1C8',
  shoe: '#F2B8C6', shoeTop: '#E6A5B5', shoeSole: '#FFFFFF', sock: '#FFFFFF',
  clip: '#DFA0C4',
  eyeW: '#FFFFFF', iris: '#684331', lash: '#140A05', brow: '#382012', mouth: '#9C3D49', tongue: '#E88494', teeth: '#FFFFFF',
  graphic: { butterfly: '#D66D9F', flowerY: '#F0E675', flowerG: '#9BD687', flowerB: '#688AB5', flowerP: '#F2A2CA' }
};

function jenna(x, y, s, o = {}) {
  s *= JENNA_SCALE;
  const t = o.t ?? T, A = {}, lw = clamp(s * .12, 1.2, 5.0) / s;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  
  const air = o.jump || 0;
  if (!o.noShadow) { const f = 1 - clamp(air / 14) * .55; ellipse(0, .12, 3.2 * f, .6 * f, { fill: 'rgba(40,20,30,.28)', stroke: null }); }

  X.translate(0, -air);
  if (o.sq) X.scale(1 + o.sq * .55, 1 - o.sq);

  withBoil(o.boil ?? .7, () => {
    // Reference proportions: expressive child face and a knee-length tulle skirt.
    const hipY = -10.0 + (o.dy || 0), lean = o.lean || 0, cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];
    const headT = () => { X.translate(0, hipY); X.rotate(lean); X.translate(0, -6.0); X.rotate(o.tilt || 0); X.translate(0, -6.35); };

    // Legs
    [[-1, o.footL || [-1.25, -.65]], [1, o.footR || [1.25, -.65]]].forEach(([sd, f]) => {
      const hp = tl(sd * 1.1, 0), { joint, end } = ik2(hp, f, 4.75, 4.75, [sd * .15, 1]);
      jeLimb([hp, joint, end], 1.6, JE.skin, lw);
      jeSockAndShoe(end, sd, lw);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
    });

    // Torso & Skirt
    X.save(); X.translate(0, hipY); X.rotate(lean);
    // Neck
    shape([[-.95, -8.3], [.95, -8.3], [1.15, -6.7], [0, -6.3], [-1.15, -6.7]], { fill: JE.skin, stroke: JE.ink, lw, smooth: .4 });
    shape([[-.95, -8.3], [.95, -8.3], [.9, -7.5], [0, -7.15]], { fill: JE.skinDk, stroke: null, smooth: .4 });
    // Skirt back/underskirt
    const skirtW = 3.65;
    const skirtL = 5.5; 
    shape([[-2.5, -0.5], [2.5, -0.5], [skirtW, skirtL], [-skirtW, skirtL]], { fill: JE.skirtBase, stroke: JE.ink, lw, smooth: .2 });
    // Tulle skirt layers
    shape([[-2.5, -0.5], [2.5, -0.5], [skirtW + 0.3, skirtL + 0.3], [-(skirtW + 0.3), skirtL + 0.3]], { fill: rgba(JE.skirtTulle, .85), stroke: JE.ink, lw, smooth: .2 });
    X.save();
    tracePath([[-2.5, -.5], [2.5, -.5], [skirtW + .3, skirtL + .3], [-skirtW - .3, skirtL + .3]], true, .2); X.clip();
    for (let i = -4; i <= 4; i++) {
      line([[i * .53, 0], [i * .85, skirtL + .4]], { stroke: rgba(JE.skirtBase, .6), lw: .22 });
      line([[i * .53 + .12, 0], [i * .85 + .17, skirtL + .4]], { stroke: rgba('#FFF3EF', .45), lw: .14 });
    }
    X.restore();
    // Shirt
    X.save(); X.scale(1.4, 1.15); jeShirt(lw / 1.4); X.restore();
    A.chest = toPx(0, -5.5); A.belly = toPx(0, -2);
    X.restore();

    // Arms (in front)
    [[-1, o.handL || tl(-2.65, -1.1), o.handPoseL || 'hip'], [1, o.handR || tl(2.65, -1.1), o.handPoseR || 'hip']].forEach(([sd, tg, pose]) => {
      const sh = tl(sd * 3.0, -6.3), { joint, end } = ik2(sh, tg, 3.5, 3.5, [sd * 1, 0.5]);
      jeLimb([sh, joint, end], 1.05, JE.skin, lw);
      // Sleeve (over upper arm)
      const slvEnd = mixPt(sh, joint, .45);
      const slvW = 1.65;
      line([sh, slvEnd], { stroke: JE.ink, lw: slvW + lw * 2, lineCap: 'round' });
      line([sh, slvEnd], { stroke: JE.shirt, lw: slvW, lineCap: 'round' });
      const sleeveAngle = Math.atan2(joint[1] - sh[1], joint[0] - sh[0]);
      const cuff = [-Math.sin(sleeveAngle) * slvW * .46, Math.cos(sleeveAngle) * slvW * .46];
      line([[slvEnd[0] - cuff[0], slvEnd[1] - cuff[1]], [slvEnd[0] + cuff[0], slvEnd[1] + cuff[1]]], { stroke: JE.shirtDk, lw: lw * .8 });
      // Hand
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      jeHand(end, ang, sd, pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang)*.5, end[1] + Math.sin(ang)*.5);
    });

    // Head
    X.save(); headT(); X.scale(1.25, 1.25);
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
      { stroke: '#A94478', lw: .055, smooth: true });
    line([[sd * .08, .12], [sd * .42, .66]], { stroke: '#B45080', lw: .055 });
    line([[0, -.08], [sd * .15, -.42]], { stroke: '#7FAA82', lw: .04 });
  });
  line([[0, -.14], [0, .6]], { stroke: '#7FAA82', lw: .1 });
  X.restore();
}

function jeShirt(lw) {
  const body = [[-1.8, -.5], [-2.05, -1.5], [-1.9, -3], [-2.2, -6], [-1.2, -6.5],
    [0, -6.2], [1.2, -6.5], [2.2, -6], [1.9, -3], [2.05, -1.5], [1.8, -.5], [0, -.3]];
  shape(body, { fill: JE.shirt, stroke: JE.ink, lw, smooth: .4 });
  shape([[-1.05, -6.42], [-.95, -5.95], [0, -5.7], [.95, -5.95], [1.05, -6.42], [0, -6.12]], { fill: JE.shirt, stroke: JE.ink, lw: lw * .8, smooth: .5 });
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
  // Portrait curves use landmarks from the supplied reference (55 px per head unit).
  // Keep the facial curves steady while the surrounding rig retains its drawing boil.
  withBoil(0, () => {
    const edge = lw * .65;
    [-1, 1].forEach(sd => {
      X.save(); X.translate(-turn * .2, 0);
      if (sd > 0) { X.translate(.12, 0); X.scale(-1, 1); }
      jePortraitPath([['M', 544, 399], ['C', 525, 375, 508, 390, 510, 422],
        ['C', 510, 460, 518, 488, 541, 495], ['C', 554, 496, 556, 473, 551, 451], ['Z']],
        { fill: JE.skin, stroke: JE.ink, lw: edge });
      jePortraitPath([['M', 522, 406], ['C', 516, 423, 526, 444, 536, 453],
        ['C', 524, 455, 532, 470, 536, 476]], { stroke: JE.ink, lw: edge * .7 });
      jePortraitPath([['M', 524, 407], ['C', 533, 408, 542, 425, 545, 440]],
        { stroke: JE.ink, lw: edge * .7 });
      X.restore();
    });
    const face = [['M', 699, 237], ['C', 674, 241, 650, 252, 621, 250],
      ['C', 580, 271, 552, 323, 546, 384], ['C', 540, 425, 544, 481, 557, 519],
      ['C', 570, 566, 612, 602, 666, 605], ['C', 719, 608, 767, 581, 783, 550],
      ['C', 809, 517, 819, 471, 818, 423], ['C', 817, 368, 804, 313, 780, 282],
      ['C', 748, 269, 711, 261, 699, 237], ['Z']];
    jePortraitPath(face, { fill: JE.skin, stroke: JE.ink, lw: edge });
    // Narrow temple and jaw shadows give the face the reference's warm volume.
    X.save(); jePortraitPath(face); X.clip();
    jePortraitPath([['M', 556, 315], ['C', 544, 397, 548, 481, 568, 525],
      ['C', 590, 568, 624, 599, 665, 616], ['C', 619, 607, 569, 562, 551, 517],
      ['C', 530, 453, 532, 358, 556, 315], ['Z']], { fill: JE.skinDk, stroke: null });
    jePortraitPath([['M', 781, 288], ['C', 818, 372, 818, 459, 795, 519],
      ['C', 780, 556, 750, 584, 728, 596], ['C', 778, 574, 811, 529, 829, 462],
      ['L', 828, 319], ['Z']], { fill: JE.skinDk, stroke: null });
    X.restore();
    const blush = o.blush ?? .6;
    if (blush > .01) [-1, 1].forEach(sd => ellipse(sd * 1.65 + tx * .5, 1.55, .65, .38,
      { fill: rgba(JE.cheek, .35 * blush), stroke: null }));

    X.save(); X.translate(tx, 0);
    // Angular, tapered brows form clear peaks above each eye.
    const lift = -.3 + (o.brows === 'up' ? -.28 : o.brows === 'worried' ? -.12 : 0);
    X.save(); X.translate(0, lift);
    jePortraitPath([['M', 563, 366], ['L', 598, 336], ['L', 646, 361],
      ['L', 640, 370], ['L', 599, 350], ['L', 565, 372], ['Z']],
      { fill: '#67422F', stroke: JE.ink, lw: edge * .5 });
    jePortraitPath([['M', 707, 363], ['L', 753, 339], ['L', 794, 370],
      ['L', 791, 376], ['L', 752, 353], ['L', 713, 372], ['Z']],
      { fill: '#67422F', stroke: JE.ink, lw: edge * .5 });
    X.restore();
    jeEye((610 - 680) / 55, (395 - 400) / 55, { ...o, t }, true, edge);
    jeEye((744 - 680) / 55, (398 - 400) / 55, { ...o, t }, false, edge);
    // Alma's simple button nose keeps the expression light and readable.
    ellipse(-.09, 1.3, .28, .2, { fill: rgba(JE.nose, .5), stroke: null });
    line([[-.4, 1.28], [-.35, 1.48], [-.2, 1.53]], { stroke: JE.ink, lw: edge * .9, smooth: true });
    line([[.3, 1.28], [.25, 1.48], [.1, 1.53]], { stroke: JE.ink, lw: edge * .9, smooth: true });
    circle(-.19, 1.18, .09, { fill: 'rgba(255,255,255,.65)', stroke: null });
    X.restore();
    jeMouth(o.mouth || 'grin', tx, edge);
    A.eyeL = toPx((610 - 680) / 55 + tx, (395 - 400) / 55);
    A.eyeR = toPx((744 - 680) / 55 + tx, (398 - 400) / 55);
    A.mouth = toPx(tx - .07, 2.32); A.head = toPx(0, 0);
  });

  // Rounded forehead waves and the little centre-part curl frame the portrait.
  jePortraitPath([['M', 718, 161], ['C', 701, 141, 663, 146, 636, 164],
    ['C', 596, 171, 570, 192, 557, 224], ['C', 531, 249, 511, 277, 514, 307],
    ['C', 521, 332, 503, 340, 513, 370], ['L', 539, 413],
    ['C', 535, 374, 547, 350, 558, 332], ['C', 573, 303, 583, 269, 606, 256],
    ['C', 631, 247, 658, 249, 677, 239], ['C', 666, 267, 650, 278, 633, 265],
    ['C', 652, 292, 677, 263, 688, 247], ['C', 695, 238, 700, 237, 704, 237],
    ['C', 705, 208, 708, 183, 718, 161], ['Z']], { fill: JE.hair, stroke: JE.ink, lw: lw * .65 });
  jePortraitPath([['M', 718, 161], ['C', 741, 145, 770, 169, 794, 184],
    ['C', 823, 200, 837, 223, 841, 248], ['C', 865, 270, 865, 300, 858, 324],
    ['C', 872, 351, 860, 382, 819, 432], ['C', 831, 386, 808, 340, 798, 321],
    ['C', 783, 302, 773, 284, 771, 269], ['C', 742, 277, 719, 259, 708, 239],
    ['C', 698, 217, 707, 181, 718, 161], ['Z']], { fill: JE.hair, stroke: JE.ink, lw: lw * .65 });
  const waves = [
    [['M', 576, 208], ['C', 589, 181, 622, 203, 644, 189], ['C', 671, 177, 697, 191, 698, 217]],
    [['M', 592, 211], ['C', 595, 246, 637, 254, 664, 233]],
    [['M', 562, 239], ['C', 565, 268, 589, 268, 605, 255]],
    [['M', 540, 266], ['C', 528, 299, 551, 309, 569, 292]],
    [['M', 529, 309], ['C', 523, 329, 543, 338, 553, 327]],
    [['M', 719, 215], ['C', 727, 239, 754, 252, 776, 237]],
    [['M', 731, 239], ['C', 752, 275, 787, 268, 799, 250]],
    [['M', 781, 278], ['C', 786, 309, 811, 321, 831, 309]],
    [['M', 807, 321], ['C', 824, 331, 834, 348, 830, 370]],
  ];
  waves.forEach(path => jePortraitPath(path, { stroke: JE.hairDk, lw: lw * .75 }));
  [
    [['M', 642, 175], ['C', 656, 163, 677, 161, 688, 172]],
    [['M', 644, 184], ['C', 660, 174, 679, 174, 690, 183]],
    [['M', 657, 201], ['C', 670, 196, 681, 202, 686, 211]],
    [['M', 632, 217], ['C', 642, 232, 662, 238, 675, 230]],
    [['M', 539, 283], ['C', 536, 298, 542, 302, 551, 301]],
    [['M', 521, 349], ['C', 529, 343, 540, 342, 544, 334]],
    [['M', 732, 180], ['C', 748, 172, 763, 178, 771, 185]],
    [['M', 721, 204], ['C', 735, 194, 752, 200, 765, 210]],
    [['M', 722, 217], ['C', 735, 211, 745, 214, 750, 221]],
    [['M', 837, 341], ['C', 847, 352, 844, 369, 839, 379]],
  ].forEach(path => jePortraitPath(path, { stroke: JE.hairLt, lw: lw * .55 }));

  // Interlocking waves make a loose, curly ponytail over the right shoulder.
  shape([[2.25, 1.95], [3.1, 2.2], [3.62, 2.85], [3.4, 3.5], [4.0, 3.85],
    [3.75, 4.65], [4.05, 5.25], [3.55, 6.05], [3.15, 6.9], [2.5, 6.65],
    [2.15, 5.8], [2.35, 4.8], [2.05, 3.65]], { fill: JE.hair, stroke: JE.ink, lw, smooth: .8 });
  [[2.75, 2.95, 1], [3.25, 3.8, -1], [2.65, 4.65, 1], [3.25, 5.25, -1], [2.7, 6.0, 1]].forEach(([cx, cy, sd]) => {
    const curl = [[cx - sd * .38, cy + .55], [cx - sd * .5, cy], [cx, cy - .5],
      [cx + sd * .55, cy - .25], [cx + sd * .5, cy + .2], [cx, cy + .45], [cx - sd * .2, cy + .15]];
    line(curl, { stroke: JE.hairDk, lw: .28, smooth: .9 });
    line(curl.map(([px, py]) => [px + .08, py - .06]), { stroke: JE.hairLt, lw: .1, smooth: .9 });
  });
  // Four butterfly clips: orange and violet at the left, green and pink at the right.
  jeClip(-2.26, -3.5, .55, lw, '#F39945');
  jeClip(-2.65, -3.12, .55, lw, '#8785D5');
  jeClip(2.47, -2.75, -.35, lw, '#98CC80');
  jeClip(2.82, -1.85, .12, lw, '#E876B6');
}

function jeClip(x, y, ang, lw, color = JE.clip) {
  X.save(); X.translate(x, y); X.rotate(ang);
  [-1, 1].forEach(sd => {
    ellipse(sd * .18, -.12, .15, .28, { fill: color, stroke: JE.ink, lw: lw * .6, rot: sd * .35 });
    ellipse(sd * .16, .2, .12, .18, { fill: color, stroke: JE.ink, lw: lw * .6, rot: -sd * .3 });
  });
  line([[0, -.26], [0, .31]], { stroke: JE.hairDk, lw: .065 });
  X.restore();
}

// Draw cubic portrait paths in reference-image coordinates, mapped into the existing head rig.
function jePortraitPath(commands, style) {
  X.beginPath();
  for (const [kind, ...p] of commands) {
    const q = p.map((v, i) => (v - (i % 2 ? 400 : 680)) / 55);
    if (kind === 'M') X.moveTo(...q);
    else if (kind === 'L') X.lineTo(...q);
    else if (kind === 'C') X.bezierCurveTo(...q);
    else if (kind === 'Z') X.closePath();
  }
  if (style) paintPath(style);
}

function jeEye(cx, cy, o, isLeft, lw) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = isLeft ? 'open' : 'happy';
  const rx = .67, ry = kind === 'wide' ? .8 : .64;
  const ph = ((o.t ?? T) + .8) % 3.4;
  const blink = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (kind === 'happy' || kind === 'closed' || blink > .96) {
    line([[cx - rx, cy + .12], [cx, cy + (kind === 'happy' ? -.25 : .18)], [cx + rx, cy + .12]],
      { stroke: JE.ink, lw: lw * 1.8, smooth: true }); return;
  }
  ellipse(cx, cy, rx, ry, { fill: '#FFFDF7', stroke: JE.ink, lw });
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); X.clip();
  const ix = cx + clamp(o.lookX || 0, -1, 1) * .2;
  const iy = cy + .05 + clamp(o.lookY || 0, -1, 1) * .18;
  const ir = kind === 'wide' ? .37 : .45;
  circle(ix, iy, ir, { fill: radGrad(ix, iy + ir * .3, ir * .2, ir, [[0, '#94633F'], [1, JE.iris]]), stroke: null });
  circle(ix, iy, ir * .62, { fill: '#2E201B', stroke: null });
  circle(ix - ir * .3, iy - ir * .38, ir * .26, { fill: '#FFFFFF', stroke: null });
  circle(ix + ir * .3, iy + ir * .35, ir * .1, { fill: '#FFFFFF', stroke: null });
  if (blink > .01) shape(rectPts(cx - rx - .1, cy - ry - .1, 2 * rx + .2, (2 * ry + .2) * blink), { fill: JE.skin, stroke: null });
  X.restore();
  line([[cx - rx, cy - .04], [cx - rx * .5, cy - ry * .92], [cx + rx * .5, cy - ry * .92], [cx + rx, cy - .04]],
    { stroke: JE.ink, lw: lw * 1.9, smooth: .9 });
  const sd = isLeft ? -1 : 1;
  line([[cx + sd * rx * .92, cy - .22], [cx + sd * (rx + .16), cy - .4]], { stroke: JE.ink, lw: lw * 1.4 });
}

function jeMouth(kind, tx, lw) {
  X.save(); X.translate(tx, 0);
  if (kind === 'grin') {
    // A single tooth band and a small tongue echo Alma's cheerful cartoon grin.
    const smile = [[-1.18, 2.02], [-.08, 2.18], [1.05, 2.02], [.73, 2.6], [-.08, 2.83], [-.88, 2.6]];
    shape(smile, { fill: JE.mouth, stroke: JE.ink, lw: lw * 1.2, smooth: .65 });
    X.save(); tracePath(smile, true, .65); X.clip();
    shape(rectPts(-1.25, 1.97, 2.5, .38), { fill: '#FFFDF7', stroke: null });
    ellipse(-.08, 2.84, .5, .22, { fill: JE.tongue, stroke: null });
    X.restore();
  } else if (kind === 'smile') {
    jePortraitPath([['M', 614, 516], ['C', 645, 537, 703, 539, 736, 515]], { stroke: JE.ink, lw, fill: null });
  } else if (kind === 'open') {
    ellipse(-.07, 2.4, .64, .65, { fill: '#492A22', stroke: JE.ink, lw });
    X.save(); X.beginPath(); X.ellipse(-.07, 2.4, .64, .65, 0, 0, TAU); X.clip();
    shape(rectPts(-.8, 1.76, 1.5, .26), { fill: JE.teeth, stroke: null });
    ellipse(-.07, 2.94, .4, .22, { fill: JE.tongue, stroke: null }); X.restore();
  } else if (kind === 'o') {
    ellipse(-.07, 2.3, .26, .34, { fill: '#492A22', stroke: JE.ink, lw });
  } else {
    line([[-.65, 2.2], [.5, 2.2]], { stroke: JE.ink, lw });
  }
  X.restore();
}

function jeHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  if (pose === 'hip') {
    shape([[0, -.35], [.45, -.3], [.85, -.12], [1, .12], [.8, .24], [.35, .2], [0, .3]], { fill: JE.skin, stroke: JE.ink, lw, smooth: .5 });
    line([[.35, -.1], [.78, .08]], { stroke: JE.skinDk, lw: lw * .7 });
  } else if (pose === 'fist') {
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
  draw: jenna, unit: JENNA_UNIT, palette: JE, size: [16, 29],
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
