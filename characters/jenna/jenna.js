// characters/jenna/jenna.js: Jenna, Alma's funny 9-year-old cousin.
// Description and look live in README.md; reference art next to it.
//
// jenna(x, y, s, o) → anchors. (x, y) = floor point between the feet (screen px), s = px per local unit.

const JENNA_UNIT = 5.0;   // world units per local unit
const JENNA_SCALE = 1.06; // a small overall size increase, including the face

const JE = {
  ink: '#29221F',
  skin: '#F4C09E', skinDk: '#CC8F76', cheek: '#DE9991', nose: '#BB806A',
  hair: '#543722', hairDk: '#201C19', hairLt: '#51443A',
  shirt: '#F5D6D9', shirtDk: '#DDB0BC',
  skirtBase: '#DFA4AE', skirtTulle: '#F1C1C8',
  shoe: '#F2B8C6', shoeTop: '#E6A5B5', shoeSole: '#FFFFFF', sock: '#FFFFFF',
  clip: '#DFA0C4',
  eyeW: '#FFFFFF', iris: '#201C19', lash: '#140A05', brow: '#302924', mouth: '#9C3D49', lip: '#D68A92', tongue: '#E88494', teeth: '#FFFFFF',
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

    // The plush follows the left hand through every pose and the whole-body transform.
    const hasGiraffe = o.giraffe !== false;
    // Arms (in front)
    [[-1, o.handL || tl(hasGiraffe ? -1.6 : -2.65, hasGiraffe ? -3.4 : -1.1), o.handPoseL || (hasGiraffe ? 'grip' : 'hip')], [1, o.handR || tl(2.65, -1.1), o.handPoseR || 'hip']].forEach(([sd, tg, pose]) => {
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
      if (sd < 0 && hasGiraffe) {
        X.save(); X.translate(end[0] + .3, end[1]); X.rotate(lean);
        jeGiraffe(lw); A.giraffe = toPx(0, -2.55); X.restore();
        jeHand(end, 0, sd, 'grip', lw);
      } else jeHand(end, ang, sd, pose, lw);
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
    // A broad forehead and gently tapered oval jaw match the illustrated portrait.
    const face = [['M', 731, 244], ['C', 700, 234, 654, 239, 623, 255],
      ['C', 574, 277, 549, 327, 546, 384], ['C', 542, 432, 547, 485, 561, 521],
      ['C', 580, 558, 623, 586, 670, 590], ['C', 714, 593, 753, 572, 778, 540],
      ['C', 805, 516, 817, 470, 814, 423], ['C', 814, 365, 800, 313, 777, 283],
      ['C', 760, 264, 746, 249, 731, 244], ['Z']];
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
    const blush = o.blush ?? .18;
    if (blush > .01) [-1, 1].forEach(sd => ellipse(sd * 1.65 + tx * .5, 1.55, .65, .38,
      { fill: rgba(JE.cheek, .35 * blush), stroke: null }));

    X.save(); X.translate(tx, 0);
    // Thick, gently angled brows with rounded inner ends.
    const lift = o.brows === 'up' ? -.28 : o.brows === 'worried' ? -.12 : 0;
    X.save(); X.translate(0, lift - .22);
    jePortraitPath([['M', 563, 351], ['C', 583, 327, 601, 326, 620, 334],
      ['C', 635, 340, 648, 346, 647, 358], ['C', 643, 367, 629, 356, 615, 349],
      ['C', 593, 338, 577, 343, 563, 351], ['Z']],
      { fill: JE.brow, stroke: JE.ink, lw: edge * .5 });
    jePortraitPath([['M', 710, 354], ['C', 709, 343, 724, 340, 740, 340],
      ['C', 769, 339, 786, 347, 792, 368], ['C', 777, 351, 754, 354, 727, 357],
      ['C', 718, 359, 711, 359, 710, 354], ['Z']],
      { fill: JE.brow, stroke: JE.ink, lw: edge * .5 });
    X.restore();
    jeEye((610 - 680) / 55, (395 - 400) / 55, { ...o, t }, true, edge);
    jeEye((744 - 680) / 55, (398 - 400) / 55, { ...o, t }, false, edge);
    // A gentle bridge and rounded tip, with subtle nostril marks.
    jePortraitPath([['M', 677, 421], ['C', 675, 442, 664, 461, 664, 474]],
      { stroke: rgba(JE.nose, .45), lw: edge * .65 });
    ellipse(-.07, 1.38, .38, .23, { fill: rgba(JE.nose, .38), stroke: null });
    line([[-.43, 1.43], [-.27, 1.57], [-.12, 1.58]],
      { stroke: JE.ink, lw: edge * .8, smooth: true });
    line([[.32, 1.44], [.21, 1.57], [.08, 1.58]],
      { stroke: JE.ink, lw: edge * .8, smooth: true });
    ellipse(-.07, 1.26, .13, .065, { fill: 'rgba(255,255,255,.28)', stroke: null });
    X.restore();
    jeMouth(o.mouth || 'grin', tx, edge);
    A.eyeL = toPx((610 - 680) / 55 + tx, (395 - 400) / 55);
    A.eyeR = toPx((744 - 680) / 55 + tx, (398 - 400) / 55);
    A.mouth = toPx(tx, 2.45); A.head = toPx(0, 0);
  });

  // Off-centre part and a long, loose sweep over the left temple.
  jePortraitPath([['M', 736, 166], ['C', 695, 143, 643, 148, 603, 172],
    ['C', 557, 185, 531, 222, 519, 260], ['C', 503, 293, 507, 331, 503, 365],
    ['C', 496, 393, 515, 428, 540, 440], ['C', 523, 414, 531, 383, 550, 359],
    ['C', 572, 327, 583, 298, 607, 280], ['C', 639, 258, 677, 259, 705, 241],
    ['C', 718, 229, 728, 217, 735, 203], ['C', 739, 191, 741, 178, 736, 166], ['Z']],
    { fill: JE.hair, stroke: JE.ink, lw: lw * .65 });
  jePortraitPath([['M', 736, 166], ['C', 777, 161, 814, 188, 831, 222],
    ['C', 853, 252, 857, 286, 849, 317], ['C', 857, 352, 843, 389, 816, 425],
    ['C', 823, 391, 811, 357, 801, 327], ['C', 787, 305, 774, 282, 768, 259],
    ['C', 760, 239, 743, 234, 731, 244], ['C', 739, 215, 744, 186, 736, 166], ['Z']],
    { fill: JE.hair, stroke: JE.ink, lw: lw * .65 });
  const waves = [
    [['M', 725, 174], ['C', 673, 160, 601, 192, 568, 236]],
    [['M', 721, 190], ['C', 676, 181, 618, 210, 590, 246]],
    [['M', 713, 211], ['C', 675, 234, 615, 237, 585, 277]],
    [['M', 580, 236], ['C', 541, 269, 544, 305, 522, 343]],
    [['M', 574, 286], ['C', 562, 322, 526, 347, 527, 384]],
    [['M', 746, 181], ['C', 786, 189, 815, 218, 821, 259]],
    [['M', 750, 210], ['C', 786, 230, 779, 279, 810, 313]],
    [['M', 818, 282], ['C', 842, 326, 822, 362, 831, 380]],
  ];
  waves.forEach(path => jePortraitPath(path, { stroke: JE.hairDk, lw: lw * .75 }));
  waves.slice(0, 6).forEach(path => {
    X.save(); X.translate(.08, -.08);
    jePortraitPath(path, { stroke: rgba(JE.hairLt, .65), lw: lw * .4 }); X.restore();
  });
  // Smooth low ponytail falls over her right shoulder (viewer left).
  shape([[-2.35, 1.5], [-3.15, 2.3], [-3.55, 3.75], [-3.35, 5.0],
    [-2.8, 5.65], [-3.0, 6.8], [-2.65, 8.1], [-1.9, 8.8], [-1.95, 7.35],
    [-2.25, 6.1], [-2.0, 5.25], [-1.85, 3.9], [-2.0, 2.7]],
    { fill: JE.hair, stroke: JE.ink, lw: lw * .85, smooth: .65 });
  [[-2.9, -2.55], [-2.5, -2.2]].forEach(([outer, inner]) => {
    line([[inner, 2.2], [outer, 3.75], [outer + .15, 4.8], [-2.55, 5.55]],
      { stroke: JE.hairLt, lw: .11, smooth: .8 });
    line([[-2.6, 5.95], [outer + .2, 7.1], [-2.1, 8.3]],
      { stroke: JE.hairLt, lw: .09, smooth: .8 });
  });
  // Pink ribbon tied around the ponytail.
  shape([[-2.62, 5.65], [-3.65, 5.25], [-3.8, 5.8], [-3.4, 6.15], [-2.62, 5.85]],
    { fill: '#EE9CB8', stroke: JE.ink, lw: lw * .7, smooth: .45 });
  shape([[-2.6, 5.7], [-1.65, 5.2], [-1.4, 5.8], [-1.85, 6.1], [-2.6, 5.85]],
    { fill: '#EE9CB8', stroke: JE.ink, lw: lw * .7, smooth: .45 });
  shape([[-2.7, 5.9], [-3.25, 7.3], [-2.8, 7.1], [-2.5, 7.4], [-2.4, 6.0]],
    { fill: '#EE9CB8', stroke: JE.ink, lw: lw * .7 });
  shape([[-2.5, 5.9], [-1.6, 6.95], [-1.65, 6.45], [-1.3, 6.4], [-2.35, 5.8]],
    { fill: '#EE9CB8', stroke: JE.ink, lw: lw * .7 });
  circle(-2.55, 5.75, .2, { fill: '#E988A8', stroke: JE.ink, lw: lw * .7 });

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

// Alma's rounded eyes and lashes, scaled to Jenna's portrait proportions.
function jeEye(cx, cy, o, isLeft, lw) {
  X.save(); X.translate(cx, cy); X.scale(.56, .56);
  jeEyeShape(0, 0, o, isLeft, lw / .56, o.t ?? T, 1);
  X.restore();
}

function jeEyeShape(cx, cy, o, isLeft, lw, t, narrow) {
  let kind = o.eyes || 'open';
  if (kind === 'wink') kind = isLeft ? 'open' : 'happy';
  const rx = 1.28 * narrow, ry = 1.42;
  if (kind === 'happy') return line([[cx - 1.0, cy + .35], [cx, cy - .55], [cx + 1.0, cy + .35]], { stroke: JE.lash, lw: lw * 2.2, smooth: true });
  if (kind === 'closed') { line([[cx - 1.0, cy], [cx, cy + .45], [cx + 1.0, cy]], { stroke: JE.lash, lw: lw * 2.2, smooth: true }); return; }
  if (kind === 'squeeze') { const d = isLeft ? 1 : -1; return line([[cx - d * .85, cy - .6], [cx + d * .6, cy], [cx - d * .85, cy + .6]], { stroke: JE.lash, lw: lw * 2.2 }); }
  if (kind === 'star' || kind === 'heart') {
    const pts = kind === 'star' ? starPts(cx, cy, 1.25, .5, 5) : [[cx, cy + 1.05], [cx - 1.15, cy - .05], [cx - .95, cy - .8], [cx - .35, cy - .95], [cx, cy - .45], [cx + .35, cy - .95], [cx + .95, cy - .8], [cx + 1.15, cy - .05]];
    shape(pts, { fill: kind === 'star' ? JE.graphic.flowerY : '#F06C8E', stroke: JE.ink, lw, smooth: kind === 'heart' ? .5 : false });
    circle(cx - .35, cy - .35, .2, { fill: '#FFFFFF', stroke: null });
    return;
  }
  const R = kind === 'wide' ? 1.1 : 1;
  ellipse(cx, cy, rx * R, ry * R, { fill: JE.eyeW, stroke: JE.ink, lw });
  const lx = clamp(o.lookX || 0, -1, 1), ly = clamp(o.lookY || 0, -1, 1), ir = kind === 'wide' ? .78 : .95;
  const ix = cx + lx * .32 * narrow, iy = cy + .1 + ly * .38;
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx * R, ry * R, 0, 0, TAU); X.clip();
  withBoil(0, () => {
    circle(ix, iy, ir, { fill: radGrad(ix, iy + ir * .3, ir * .2, ir, [[0, '#B8763A'], [1, JE.iris]]), stroke: null });
    circle(ix, iy, ir * .62, { fill: JE.lash, stroke: null });
    circle(ix + ir * .32, iy - ir * .38, ir * .3, { fill: '#FFFFFF', stroke: null });
    circle(ix - ir * .3, iy + ir * .35, ir * .12, { fill: '#FFFFFF', stroke: null });
    const ph = (t + 2.1 + (o.blinkSeed || 0)) % 3.1, b = o.blink ?? (ph < .15 ? Math.sin(ph / .15 * Math.PI) : 0);
    if (b > .02) shape(rectPts(cx - 1.6, cy - 1.7, 3.2, .3 + 3.2 * b), { fill: JE.skin, stroke: null });
  });
  X.restore();
  // upper lid with lashes and a little flick at the outer corner
  const sd = isLeft ? -1 : 1;
  line([[cx - rx * R, cy - .1], [cx - rx * .5 * R, cy - ry * R * .92], [cx + rx * .5 * R, cy - ry * R * .92], [cx + rx * R, cy - .1]], { stroke: JE.lash, lw: lw * 2.3, smooth: .9 });
  line([[cx + sd * rx * R * .92, cy - .45], [cx + sd * (rx * R + .45), cy - .85]], { stroke: JE.lash, lw: lw * 1.9 });
  line([[cx + sd * rx * R * .72, cy - .95], [cx + sd * (rx * R + .25), cy - 1.35]], { stroke: JE.lash, lw: lw * 1.5 });
}

function jeMouth(kind, tx, lw) {
  // Match Alma's smile shapes while keeping them below Jenna's nose.
  X.save(); X.translate(tx, 1.1); X.scale(.72, .72); lw /= .72;
  const dark = { fill: JE.mouth, stroke: JE.ink, lw };
  if (kind === 'smile') {
    line([[-1.75, 1.2], [-.9, 1.65], [0, 1.78], [.9, 1.65], [1.75, 1.2]], { stroke: JE.ink, lw: lw * 1.3, smooth: true });
    ellipse(0, 1.95, .7, .15, { fill: rgba(JE.lip, .45), stroke: null });
    [-1, 1].forEach(sd => line([[sd * 1.72, 1.05], [sd * 1.9, 1.35]], { stroke: JE.ink, lw: lw * .9 }));
  } else if (kind === 'grin' || kind === 'open') {
    const pts = kind === 'grin' ? [[-1.5, 1.2], [0, 1.4], [1.5, 1.2], [1.0, 2.2], [0, 2.5], [-1.0, 2.2]] : [[-.75, 1.3], [0, 1.2], [.75, 1.3], [.75, 2.0], [0, 2.55], [-.75, 2.0]];
    X.save(); tracePath(pts, true, .8); X.fillStyle = JE.mouth; X.fill(); X.clip();
    withBoil(0, () => { shape(rectPts(-1.7, 1.05, 3.4, kind === 'grin' ? .45 : .32), { fill: JE.teeth, stroke: null }); ellipse(0, 2.5, .75, .45, { fill: JE.tongue, stroke: null }); });
    X.restore();
    shape(pts, { stroke: JE.ink, lw, smooth: .8 });
  } else if (kind === 'o') ellipse(0, 1.7, .32, .38, dark);
  else if (kind === 'O') ellipse(0, 1.85, .58, .72, dark);
  else if (kind === 'flat') line([[-.8, 1.6], [.8, 1.6]], { stroke: JE.ink, lw: lw * 1.4 });
  else if (kind === 'frown') line([[-1.1, 2.0], [-.55, 1.6], [0, 1.5], [.55, 1.6], [1.1, 2.0]], { stroke: JE.ink, lw: lw * 1.4, smooth: true });
  else if (kind === 'smirk') line([[-1.0, 1.6], [0, 1.72], [1.15, 1.25]], { stroke: JE.ink, lw: lw * 1.4, smooth: true });
  else if (kind === 'wobble') line([[-1, 1.7], [-.6, 1.45], [-.2, 1.75], [.2, 1.45], [.6, 1.75], [1, 1.5]], { stroke: JE.ink, lw: lw * 1.3, smooth: true });
  X.restore();
}

// Yellow plush giraffe, drawn upright with the hand wrapped around its long neck.
function jeGiraffe(lw) {
  const yellow = '#F9D64E', gold = '#F4AE38', cream = '#F4E6AF';
  const style = { fill: yellow, stroke: JE.ink, lw: lw * .9, smooth: .65 };
  // Four soft legs and orange hooves sit below the pear-shaped body.
  [-1, 1].forEach(sd => {
    ellipse(sd * .82, 3.25, .43, .93, { ...style, rot: sd * -.22 });
    ellipse(sd * .86, 3.84, .43, .46, { fill: gold, stroke: JE.ink, lw: lw * .8, rot: sd * -.2 });
  });
  shape([[-.43, -1.55], [.43, -1.55], [.48, .65], [1.03, 2.35], [.82, 3.5],
    [0, 3.8], [-.85, 3.48], [-1.02, 2.36], [-.5, .65]], style);
  [-1, 1].forEach(sd => {
    ellipse(sd * .46, -.05, .17, .26, { fill: gold, stroke: null, rot: sd * .3 });
    ellipse(sd * .8, 2.25, .22, .35, { fill: gold, stroke: null, rot: sd * -.4 });
    ellipse(sd * .56, 3.6, .46, .69, { ...style, rot: sd * -.18 });
    ellipse(sd * .58, 4.0, .45, .43, { fill: gold, stroke: JE.ink, lw: lw * .85 });
    // Orange ossicones and wide, floppy ears.
    ellipse(sd * .38, -3.0, .18, .46, { fill: gold, stroke: JE.ink, lw: lw * .85, rot: sd * .25 });
    shape([[sd * .55, -2.45], [sd * 1.19, -2.98], [sd * 1.28, -2.55], [sd * .78, -1.95]], style);
  });
  ellipse(0, -2.05, .83, .91, style);
  [-1, 1].forEach(sd => ellipse(sd * .29, -2.35, .07, .13, { fill: JE.ink, stroke: null }));
  ellipse(0, -1.72, .76, .63, { fill: cream, stroke: JE.ink, lw: lw * .85 });
  [-1, 1].forEach(sd => ellipse(sd * .2, -1.92, .045, .07, { fill: JE.ink, stroke: null }));
  line([[-.52, -1.64], [-.3, -1.38], [0, -1.3], [.3, -1.38], [.52, -1.64]],
    { stroke: JE.ink, lw: lw * .85, smooth: .8 });
  line([[-.65, 2.75], [-.38, 3.08]], { stroke: '#D4A22E', lw: lw * .65 });
  line([[.65, 2.75], [.38, 3.08]], { stroke: '#D4A22E', lw: lw * .65 });
}

function jeHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  if (pose === 'grip') {
    shape([[-.2, -.35], [.25, -.48], [.83, -.36], [1.05, -.1], [.96, .18],
      [.62, .36], [.15, .4], [-.2, .26]], { fill: JE.skin, stroke: JE.ink, lw, smooth: .65 });
    line([[.2, -.12], [.85, -.06]], { stroke: JE.skinDk, lw: lw * .7 });
    line([[.2, .12], [.78, .16]], { stroke: JE.skinDk, lw: lw * .7 });
  } else if (pose === 'hip') {
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

// Tiny story illustrations shared by the thought bubbles and the sketch pad.
function jeComicIdea(kind, progress = 1) {
  X.save(); X.beginPath(); X.rect(-1.65, -1.5, 3.3 * clamp(progress), 3); X.clip();
  const ink = { stroke: JE.ink, lw: .08 };
  if (kind === 'cat') {
    shape([[-.4, -.1], [-1.4, .4], [-1.05, 1.0], [.35, .55]], { fill: '#E97F9E', ...ink });
    ellipse(0, .35, .42, .6, { fill: '#EDB75D', ...ink });
    shape([[-.6, -.25], [-.57, -1.1], [-.15, -.78], [.2, -.78], [.58, -1.1], [.6, -.25]],
      { fill: '#EDB75D', ...ink });
    ellipse(0, -.35, .62, .5, { fill: '#EDB75D', ...ink });
    shape(rectPts(-.49, -.57, .98, .22), { fill: '#8667C9', stroke: null });
    [-1, 1].forEach(sd => circle(sd * .25, -.46, .065, { fill: '#FFFFFF', stroke: null }));
    line([[-.18, -.15], [0, -.05], [.18, -.15]], ink);
    line([[.4, .45], [.9, .75], [1.15, .35]], { stroke: '#EDB75D', lw: .16, smooth: true });
    line([[-1.4, -.8], [-.95, -.8]], { stroke: '#8667C9', lw: .09 });
  } else {
    circle(.9, -.65, .48, { fill: '#F6DF8A', ...ink });
    circle(1.02, -.76, .1, { fill: '#D5B965', stroke: null });
    circle(.75, -.49, .07, { fill: '#D5B965', stroke: null });
    X.save(); X.translate(-.35, .05); X.rotate(.45);
    shape([[-.24, .62], [0, 1.2], [.24, .62]], { fill: '#FFB64E', stroke: null });
    shape([[-.35, .15], [-.7, .75], [0, .52], [.7, .75], [.35, .15]], { fill: '#DC85A9', ...ink });
    shape([[0, -1.1], [.4, -.45], [.35, .65], [-.35, .65], [-.4, -.45]], { fill: '#E5EFF9', ...ink });
    circle(0, -.2, .2, { fill: '#83B9DC', ...ink }); X.restore();
    [[-1.2, -.9], [1.35, .6]].forEach(([px, py]) => shape(starPts(px, py, .15), { fill: '#C7A057', stroke: null }));
  }
  X.restore();
}

function jeComicPad(x, y, s, progress) {
  X.save(); X.translate(x, y); X.scale(s, s);
  const lw = clamp(s * .1, 1.2, 4) / s;
  shape(rectPts(-3.85, -3.15, 7.7, 6.3), { fill: '#9A79B9', stroke: JE.ink, lw });
  shape(rectPts(-3.6, -2.95, 7.05, 5.85), { fill: '#FFFCF2', stroke: JE.ink, lw: lw * .65 });
  for (let i = 0; i < 9; i++) {
    line([[-3.98, -2.6 + i * .61], [-3.46, -2.6 + i * .61]], { stroke: '#5C526B', lw: .13 });
  }
  X.fillStyle = '#8667C9'; X.font = 'bold .42px sans-serif'; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.fillText('JENNA’S COMICS', 0, -2.47);
  [[-3.12, 'cat'], [.22, 'space']].forEach(([px, kind], i) => {
    shape(rectPts(px, -1.9, 3.05, 3.05), { fill: '#FFFFFF', stroke: JE.ink, lw: .09 });
    X.save(); X.translate(px + 1.53, -.38); X.scale(.83, .83);
    jeComicIdea(kind, seg(progress, i * .35, i * .35 + .35)); X.restore();
  });
  const final = seg(progress, .7, 1);
  if (final > 0) {
    X.save(); X.beginPath(); X.rect(-3.15, 1.35, 6.4 * final, 1.15); X.clip();
    shape(starPts(-1.85, 1.94, .55, .7, 9), { fill: '#FFE382', stroke: '#B68449', lw: .05 });
    X.fillStyle = JE.ink; X.font = 'bold .29px sans-serif'; X.fillText('POW!', -1.85, 1.94);
    X.font = 'bold .31px sans-serif'; X.fillText('Next stop: the Moon!', 1.0, 1.94); X.restore();
  }
  X.restore();
}

function jeComicThought(x, y, s, kind, pop, t) {
  if (pop < .01) return;
  X.save(); X.translate(x, y); X.scale(s * pop, s * pop);
  const pts = Array.from({ length: 48 }, (_, i) => {
    const a = i * TAU / 48, bump = 1 + .05 * Math.cos(a * 12);
    return [Math.cos(a) * 3.5 * bump, Math.sin(a) * 2.45 * bump];
  });
  const style = { fill: '#FFFDFA', stroke: '#8C6A9C', lw: .11 };
  shape(pts, { ...style, smooth: true });
  const sd = kind === 'cat' ? 1 : -1;
  circle(sd * 2.55, 2.2, .32, style); circle(sd * 2.05, 2.9, .17, style);
  X.save(); X.translate(0, -.25 + .07 * wob(t, .7)); jeComicIdea(kind); X.restore();
  X.fillStyle = '#68507C'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = 'bold .44px sans-serif';
  X.fillText(kind === 'cat' ? 'SUPER CAT!' : 'MOON QUEST!', 0, 1.57);
  X.restore();
}

function jeComicBulb(x, y, s, t, glow) {
  X.save(); X.translate(x, y); X.scale(s, s);
  circle(0, 0, 1.65, { fill: rgba('#FFD969', (.14 + .03 * wob(t)) * glow), stroke: null });
  ellipse(0, -.15, .77, .91, { fill: mixCol('#E5DDBF', '#FFE481', glow), stroke: JE.ink, lw: .1 });
  shape(rectPts(-.36, .54, .72, .48), { fill: '#B9B1C8', stroke: JE.ink, lw: .1 });
  line([[-.25, -.17], [0, .1], [.25, -.17]], { stroke: '#CB923A', lw: .1 });
  line([[-.32, .78], [.32, .78]], { stroke: '#756B83', lw: .1 });
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + i * Math.PI / 4;
    line([[Math.cos(a) * 1.2, Math.sin(a) * 1.2], [Math.cos(a) * 1.65, Math.sin(a) * 1.65]],
      { stroke: '#DDA237', lw: .14, alpha: glow });
  }
  X.restore();
}

// Eight-second story loop. Props use the rig's internal scale and screen anchors.
function jennaBrainstormComics(x, y, s, t) {
  const p = ((t % 8) + 8) % 8, ps = s * JENNA_SCALE;
  const pull = ease(seg(p, 0, .9)) * (1 - ease(seg(p, 7.1, 8)));
  const drawing = ease(seg(p, 1, 1.3)) * (1 - ease(seg(p, 6.7, 7.1)));
  const progress = seg(p, 1.3, 6.5);
  const padX = lerp(-5.0, -.35, pull), padY = lerp(-9, -12.5, pull);
  const strokeX = lerp(-2.4, 2.1, frac(progress * 3)) + .1 * wob(t, 3);
  const strokeY = progress < .7 ? -13.2 + .3 * wob(t, 2) : -10.7 + .12 * wob(t, 2);
  const A = jenna(x, y, s, { t, giraffe: false,
    handL: mixPt([-3.4, -10.8], [padX - 3.65, padY + .3], pull), handPoseL: 'grip',
    handR: mixPt([3.2, -11.3], [strokeX + .55, strokeY - .55], drawing), handPoseR: 'grip',
    lookY: .8 * drawing, brows: drawing ? 'focused' : 'up', mouth: 'smile' });
  X.save(); X.globalAlpha *= pull;
  jeComicPad(x + padX * ps, y + padY * ps, ps, progress);
  // Redraw the supporting hand above the pad's spiral binding.
  X.save(); X.translate(A.handL[0], A.handL[1]); X.scale(ps, ps);
  jeHand([0, 0], -.15, -1, 'grip', .1); X.restore();
  X.save(); X.translate(A.handR[0], A.handR[1]); X.scale(ps, ps);
  line([[-.65, .65], [1.05, -1.05]], { stroke: JE.ink, lw: .25 });
  line([[-.49, .49], [.9, -.9]], { stroke: '#F4CC65', lw: .17 });
  line([[.91, -.91], [1.08, -1.08]], { stroke: '#E88FA8', lw: .22 });
  jeHand([-.45, -.05], -.6, 1, 'grip', .1); X.restore(); X.restore();
  const fade = 1 - ease(seg(p, 6.9, 7.5));
  jeComicBulb(A.top[0], A.top[1] - 2.1 * ps, ps, t, ease(seg(p, .65, 1.4)) * fade);
  jeComicThought(A.top[0] - 8 * ps, A.top[1] - .7 * ps, ps, 'cat', ease(seg(p, 1.4, 1.9)) * fade, t);
  jeComicThought(A.top[0] + 8 * ps, A.top[1] - .7 * ps, ps, 'space', ease(seg(p, 2.5, 3)) * fade, t);
  return A;
}

CHARACTERS.jenna = {
  // Include the brainstorming thought bubbles and bulb in preview/model-sheet framing.
  draw: jenna, unit: JENNA_UNIT, palette: JE, size: [27, 36],
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
    'brainstorming:comics': jennaBrainstormComics,
    'dance: bounce': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'bounce')),
    'dance: disco': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'disco')),
    'dance: twirl': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'twirl')),
    'dance: star jump': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'star jump')),
    'dance: floss': (x, y, s, t) => jenna(x, y, s, jennaDance(t, 'floss')),
    'super dance': (x, y, s, t) => jenna(x, y, s, { ...jennaDance(t, 'arm wave'), eyes: 'happy' }),
  },
};
