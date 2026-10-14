// Reference-based doctor rig. Local height stays 30 units for existing scenes.
const PATRICK_UNIT = 6;
const PT = {
  ink: '#3E3432', skin: '#EABB9E', skinShade: '#CE947C', skinLight: '#F7D0B4',
  shirt: '#A9C7DB', shirtShade: '#7F9EB7', shirtLight: '#C9DFEC',
  trousers: '#C6AE8A', trouserShade: '#A48C70', hair: '#49362C', hairLight: '#70513C',
  shoe: '#754A34', sole: '#49362D', metal: '#C5CCD0', tube: '#36464D',
};
function patrick(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, lw = clamp(s * .10, 1.25, 3) / s;
  const fill = (pts, color, smooth = .65) => shape(pts, { fill: color, stroke: PT.ink, lw, smooth });
  const detail = (pts, color = PT.ink, width = .07) => line(pts, { stroke: color, lw: width, smooth: true });
  const pocket = !o.handL, holding = !o.handR;
  const hands = [o.handL || [-2.55, -13.15], o.handR || [2.65, -19.0]];
  X.save(); X.translate(x, y); X.scale(s, s);
  ellipse(.1, -.04, 4.5, .38, { fill: 'rgba(62,52,50,.14)', stroke: null });
  X.translate(0, .045 * Math.sin(t * 2));

  // Long khaki trousers, a relaxed stance and leather lace-up shoes.
  fill([[-2.6, -15.2], [2.6, -15.2], [2.65, -11.8], [2.32, -7.5], [2.38, -2.0],
    [2.65, -1.0], [.65, -.9], [.45, -2.3], [.55, -8.2], [.15, -11.6],
    [-.55, -8.1], [-1.15, -2.0], [-1.05, -.85], [-3.0, -.85], [-3.05, -2], [-2.55, -8]], PT.trousers, .3);
  shape([[-2.45, -14.3], [-1.65, -14], [-1.25, -11], [-1.85, -6], [-2.6, -2], [-2.95, -2]], { fill: PT.trouserShade, stroke: null, smooth: .5, alpha: .45 });
  shape([[1.4, -12], [2.4, -13], [2.15, -7.5], [2.25, -2], [1.55, -2], [1.5, -8]], { fill: PT.trouserShade, stroke: null, smooth: .5, alpha: .4 });
  detail([[.3, -14.7], [.35, -12.4], [-.15, -11.5]], PT.trouserShade);
  detail([[-1.35, -10], [-1.85, -6.3], [-2.2, -2.7]], PT.trouserShade);
  detail([[1.2, -9.7], [1.2, -5.8], [1.65, -2.6]], PT.trouserShade);
  detail([[-2.95, -1.4], [-2, -1.6], [-1.12, -1.4]]);
  detail([[.6, -1.45], [1.55, -1.65], [2.5, -1.4]]);
  [-1, 1].forEach(side => {
    X.save(); X.translate(side < 0 ? -2.05 : 1.8, -.6);
    const toe = side < 0 ? -.2 : 1.1;
    fill([[-.8, -.7], [.6, -.65], [.95, -.15], [toe + 1, .15], [toe + 1.05, .5], [-.8, .5], [-1, .2]], PT.shoe, .45);
    detail([[-.95, .34], [0, .48], [toe + 1, .34]], PT.sole, .12);
    detail([[-.45, -.1], [.35, -.2], [.72, .06]], '#A77552', .10);
    for (let i = 0; i < 3; i++) detail([[-.35, -.36 + i * .16], [.25, -.4 + i * .16]], PT.sole);
    X.restore();
  });

  // Shirt tucked into a visible brown belt, with an open pointed collar.
  fill([[-1.3, -23.25], [-3.25, -22.15], [-3.1, -19.7], [-2.6, -15.1],
    [-.6, -14.8], [2.6, -15.05], [3.0, -19.7], [3.25, -22.1], [1.15, -23.2]], PT.shirt);
  shape([[-3.0, -21.5], [-2.0, -20.5], [-1.6, -16], [-2.5, -15.25]], { fill: PT.shirtShade, stroke: null, smooth: .6, alpha: .5 });
  shape([[1.75, -21.7], [2.9, -21.4], [2.5, -15.3], [1.9, -16.1]], { fill: PT.shirtShade, stroke: null, smooth: .6, alpha: .35 });
  fill([[-2.65, -15.15], [2.65, -15.15], [2.65, -14.65], [-2.65, -14.65]], PT.sole, .05);
  shape(rectPts(.1, -15.12, .75, .47), { fill: PT.metal, stroke: PT.ink, lw: lw * .65, smooth: .1 });
  shape(rectPts(.25, -15.01, .45, .24), { fill: PT.sole, stroke: null });
  [-1.9, 1.9].forEach(bx => shape(rectPts(bx, -15.25, .18, .75), { fill: PT.trousers, stroke: PT.ink, lw: lw * .5 }));
  detail([[-2.5, -14.8], [-1.95, -13.5], [-2.65, -12.7]], PT.trouserShade, .1);
  fill([[-.9, -24.4], [.95, -24.4], [.85, -22.7], [.05, -22.05], [-1.0, -22.9]], PT.skin);
  shape([[-.9, -24.1], [.95, -24.1], [.85, -23.3], [.15, -23.05], [-.9, -23.6]], { fill: PT.skinShade, stroke: null });
  fill([[-1, -23.3], [.05, -22.1], [-.8, -21.8], [-1.55, -22.7]], PT.shirtLight, .1);
  fill([[.95, -23.3], [.05, -22.1], [.85, -21.8], [1.35, -22.6]], PT.shirtLight, .1);
  detail([[.05, -22.1], [.35, -20.5], [.42, -15.25]], PT.shirtShade);
  for (let by = -21; by < -15.5; by += 1.05) circle(.48, by, .085, { fill: PT.metal, stroke: PT.shirtShade, lw: .04 });
  detail([[-2, -16.15], [-1.2, -15.8], [-.3, -15.9]], PT.shirtShade);

  // Stethoscope earpieces and the U-shaped tubing sit over the shirt.
  detail([[-1.15, -23.05], [-1.8, -21.55], [-1.55, -20.5]], PT.tube, .22);
  detail([[1.1, -23.05], [1.65, -21.5], [1.85, -19.55]], PT.tube, .22);
  detail([[-1.55, -20.5], [-2.3, -20.3], [-2.25, -18.9], [-1.55, -17.6], [-.65, -17.55], [-.65, -18.6], [-1.0, -20.1], [-1.55, -20.5]], PT.tube, .18);
  detail([[-2.1, -19.4], [-1.7, -18], [-1.35, -17.7]], PT.metal, .10);
  detail([[-1.05, -19.6], [-.8, -18.3], [-.85, -17.7]], PT.metal, .10);
  const chest = holding ? [2.15, -19.55] : [1.95, -18.85];
  detail([[1.85, -19.55], [1.6, -18.45], chest], PT.tube, .15);
  circle(chest[0], chest[1], .48, { fill: PT.metal, stroke: PT.ink, lw });
  circle(chest[0], chest[1], .30, { fill: '#E1E6E7', stroke: PT.shirtShade, lw: .06 });

  // Rolled sleeves follow two-bone arms; default left hand disappears into the pocket.
  [-1, 1].forEach(side => {
    const h = hands[side < 0 ? 0 : 1], root = [side * 3, -21.6];
    const reach = side > 0 && holding ? 3.1 : 4.2;
    const arm = ik2(root, h, reach, reach, [side, .45]);
    const path = [root, arm.joint, arm.end];
    X.save();
    if (side < 0 && pocket) {
      X.beginPath(); X.rect(-20, -40, 40, 26.8); X.clip();
    }
    line(path, { stroke: PT.ink, lw: 1.48, smooth: .35 });
    line(path, { stroke: PT.skin, lw: 1.25, smooth: .35 });
    const sleeve = polySlice(path, 0, .65);
    line(sleeve, { stroke: PT.ink, lw: 1.78, smooth: .35 });
    line(sleeve, { stroke: PT.shirt, lw: 1.53, smooth: .35 });
    const c0 = polyAt(path, .57), c1 = polyAt(path, .67);
    const angle = Math.atan2(c1[1] - c0[1], c1[0] - c0[0]);
    const nx = -Math.sin(angle) * .84, ny = Math.cos(angle) * .84;
    fill([[c0[0] + nx, c0[1] + ny], [c1[0] + nx, c1[1] + ny],
      [c1[0] - nx, c1[1] - ny], [c0[0] - nx, c0[1] - ny]], PT.shirtLight, .1);
    X.restore();
    if (!(side < 0 && pocket)) {
      ellipse(arm.end[0], arm.end[1], .62, .76, { fill: PT.skin, stroke: PT.ink, lw, rot: side * -.25 });
      detail([[h[0] - .3, h[1] - .25], [h[0] + .35, h[1] - .12]], PT.skinShade);
      detail([[h[0] - .28, h[1]], [h[0] + .32, h[1] + .1]], PT.skinShade);
      detail([[h[0] - .2, h[1] + .25], [h[0] + .25, h[1] + .33]], PT.skinShade);
    } else {
      detail([[-3.15, -13.2], [-2.6, -13.15], [-1.95, -12.6]], PT.ink, .10);
    }
    A[side < 0 ? 'handL' : 'handR'] = toPx(...arm.end);
  });

  // Narrow adult face, brown side part, dark eyes and the reference's soft smile.
  X.save(); X.translate(0, -26.4); X.rotate(o.tilt || 0);
  [-1, 1].forEach(side => {
    ellipse(side * 1.85, .2, .42, .68, { fill: PT.skin, stroke: PT.ink, lw });
    detail([[side * 1.94, -.05], [side * 2.08, .12], [side * 1.95, .45]], PT.skinShade);
  });
  fill([[-1.75, -1.75], [-.75, -2.35], [.8, -2.25], [1.72, -1.6], [1.8, .25],
    [1.55, 1.7], [.75, 2.55], [-.2, 2.65], [-1.25, 2.0], [-1.7, .8]], PT.skin, .75);
  shape([[1.45, -.9], [1.75, .3], [1.5, 1.65], [.7, 2.4], [-.1, 2.5], [.7, 1.95], [1.15, .8]], { fill: PT.skinShade, stroke: null, smooth: .7, alpha: .35 });
  const blink = clamp(o.blink ?? Math.pow(Math.max(0, Math.cos((t + .65) * 1.7)), 32));
  [-1, 1].forEach(side => {
    const ex = side * .82, ey = -.32, ry = Math.max(.025, .36 * (1 - blink));
    ellipse(ex, ey, .48, ry, { fill: '#FFF9EE', stroke: PT.ink, lw: lw * .65 });
    if (blink < .8) {
      ellipse(ex + .06, ey, .22, Math.min(.29, ry), { fill: '#604D36', stroke: null });
      ellipse(ex + .06, ey, .12, Math.min(.23, ry), { fill: PT.ink, stroke: null });
      circle(ex, ey - .1, .065 * (1 - blink), { fill: '#FFFFFF', stroke: null });
    }
    const angry = o.brows === 'angry' ? -side * .2 : 0;
    detail([[ex - .49, -.9 - angry], [ex -.05, -1.06], [ex + .43, -.94 + angry]], PT.hair, .19);
    detail([[ex - .4, .25], [ex + .27, .3]], PT.skinShade, .055);
  });
  detail([[.16, -.36], [.23, .44], [.55, .73], [.3, .86], [-.13, .8]], PT.skinShade, .09);
  detail([[-.7, .8], [-.91, 1.1], [-.86, 1.45]], PT.skinShade, .06);
  detail([[.87, .9], [1.07, 1.3]], PT.skinShade, .06);
  const m = o.mouth || 'smile';
  if (['open', 'o', 'O', 'grin'].includes(m)) {
    ellipse(.12, 1.45, ['o', 'O'].includes(m) ? .25 : .64, m === 'grin' ? .22 : .38, { fill: '#6C3934', stroke: PT.ink, lw: lw * .7 });
    if (m === 'grin') shape(rectPts(-.36, 1.27, .96, .16), { fill: '#FFF9EE', stroke: null });
  } else detail([[-.62, 1.28], [.04, m === 'smile' || m === 'smirk' ? 1.52 : 1.28], [.8, 1.27]], '#805247', .095);
  detail([[-.35, 1.83], [.2, 1.93], [.61, 1.83]], PT.skinShade, .055);
  fill([[-1.8, .05], [-2.0, -1.6], [-1.6, -2.65], [-1.25, -2.85], [-1.05, -3.4],
    [-.85, -3.02], [.05, -3.45], [1.15, -3.25], [1.95, -2.65], [2.15, -2.4],
    [1.8, -2.4], [1.86, -.4], [1.55, -.65], [1.45, -2.15], [.6, -2.18],
    [-.75, -2.6], [-1.3, -1.9], [-1.5, -.1]], PT.hair, .4);
  detail([[-1.2, -2.75], [-.3, -3.05], [.8, -2.95], [1.7, -2.55]], PT.hairLight, .11);
  detail([[-1, -2.62], [-.25, -2.7], [.75, -2.4], [1.5, -2.35]], PT.hairLight, .07);
  detail([[-1.55, -2.5], [-1.78, -1.6], [-1.7, -.6]], PT.hairLight, .085);
  A.head = toPx(0, 0); A.mouth = toPx(.12, 1.45); A.top = toPx(.05, -3.45);
  X.restore(); X.restore(); return A;
}
CHARACTERS.patrick = {
  draw: patrick, unit: PATRICK_UNIT, size: [14, 31], palette: PT,
  poses: {
    rest: (x, y, s, t) => patrick(x, y, s, { t }),
    phone: (x, y, s, t) => patrick(x, y, s, { t, handR: [6, -22], mouth: 'flat' }),
    warning: (x, y, s, t) => patrick(x, y, s, { t, handR: [6, -22], handL: [-5, -15], brows: 'angry', mouth: lipFlap(t, true, 'flat') }),
  },
};
