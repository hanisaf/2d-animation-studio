// Scene 28 props: the three board games the kids bring to the play date.
//   cuGame(kind, x, y, w, ang, o)       a box held up, its lid facing us: centre (x, y) in screen px, width w px, rotation ang
//   cuGameFloor(P, kind, X, Z, size, rot) the same box lying on the floor of a perspective set (size = width in world units)
// kind: 'dolphins' (Danny's Crazy Dolphins), 'oligarchy' (Housam's Oligarchy), 'rainbow' (Jenna's Rainbow Race)
const CU_GAMES = {
  dolphins: { title: ['CRAZY', 'DOLPHINS'], box: '#2E8BD8', boxDk: '#1C5E9E', rim: '#7FD3FF', ink: '#FFE45C' },
  oligarchy: { title: ['OLIGARCHY'], box: '#1F7A4E', boxDk: '#155637', rim: '#E8C35A', ink: '#FFF4D6' },
  rainbow: { title: ['RAINBOW', 'RACE'], box: '#B66CE0', boxDk: '#8446A8', rim: '#FFD1EC', ink: '#FFFFFF' },
};

function cuTitle(lines, w, h, ink) {                                          // the box title, bold with an ink outline
  const n = lines.length, size = Math.min(h * (n > 1 ? .22 : .26), w * (n > 1 ? .2 : .14));
  X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  lines.forEach((s, i) => {
    const y = -h * .2 + (i - (n - 1) / 2) * size * .95;
    X.lineWidth = size * .2; X.strokeStyle = PAL.ink; X.strokeText(s, 0, y);
    X.fillStyle = ink; X.fillText(s, 0, y);
  });
}

// the lid art, in a w × h box centred on the origin
function cuArt(kind, w, h, t) {
  const g = CU_GAMES[kind], lw = Math.max(1.2, w * .012);
  if (kind === 'dolphins') {
    for (let i = 0; i < 3; i++) {                                             // the sea, in bands of waves
      const y0 = h * (.12 + i * .11), pts = [[-w * .46, h * .46]];
      for (let j = 0; j <= 12; j++) pts.push([-w * .46 + j * w * .92 / 12, y0 + Math.sin(j * 1.6 + i + t * 2) * h * .025]);
      pts.push([w * .46, h * .46]);
      shape(pts, { fill: ['#4FB3F0', '#3A9AE0', '#2A7FC8'][i], stroke: null });
    }
    X.save(); X.translate(w * .05, h * .1 + Math.sin(t * 3) * h * .03); X.rotate(-.35);   // a goofy pink dolphin leaping out
    shape([[-w * .26, h * .02], [-w * .1, -h * .12], [w * .14, -h * .1], [w * .26, -h * .02], [w * .12, h * .06], [-w * .14, h * .07]], { fill: '#F48FC0', stroke: PAL.ink, lwPx: lw, smooth: true });
    shape([[w * .2, -h * .05], [w * .32, -h * .03], [w * .2, 0]], { fill: '#F48FC0', stroke: PAL.ink, lwPx: lw });
    shape([[-w * .03, -h * .11], [w * .02, -h * .22], [w * .06, -h * .1]], { fill: '#E46FA8', stroke: PAL.ink, lwPx: lw });
    shape([[-w * .24, h * .01], [-w * .34, -h * .08], [-w * .32, h * .08]], { fill: '#E46FA8', stroke: PAL.ink, lwPx: lw });
    for (const [ex, er] of [[w * .12, h * .045], [w * .17, h * .035]]) { circle(ex, -h * .05, er, { fill: '#fff', stroke: PAL.ink, lwPx: lw * .7 }); circle(ex + er * .3 * Math.sin(t * 9), -h * .05, er * .45, { fill: PAL.ink, stroke: null }); }
    X.restore();
    for (const [bx, by, r] of [[-w * .32, h * .28, .03], [-w * .24, h * .2, .02], [w * .34, h * .26, .025]]) circle(bx, by, h * r, { fill: 'rgba(255,255,255,.75)', stroke: '#fff', lwPx: lw * .5 });
  } else if (kind === 'oligarchy') {
    X.save(); X.translate(0, h * .2);                                         // a fat gold coin stack and a top hat
    for (let i = 0; i < 4; i++) ellipse(-w * .2, h * .14 - i * h * .06, w * .12, h * .045, { fill: i % 2 ? '#F2CF62' : '#E3B53E', stroke: PAL.ink, lwPx: lw * .8 });
    for (let i = 0; i < 3; i++) ellipse(w * .02, h * .14 - i * h * .06, w * .1, h * .04, { fill: i % 2 ? '#F2CF62' : '#E3B53E', stroke: PAL.ink, lwPx: lw * .8 });
    shape(rectPts(w * .14, -h * .1, w * .2, h * .2), { fill: '#2A2530', stroke: PAL.ink, lwPx: lw });
    ellipse(w * .24, h * .1, w * .17, h * .04, { fill: '#2A2530', stroke: PAL.ink, lwPx: lw });
    shape(rectPts(w * .14, h * .02, w * .2, h * .035), { fill: '#C93A3A', stroke: null });
    X.restore();
    shape(rectPts(-w * .44, -h * .43, w * .88, h * .86), { fill: null, stroke: g.rim, lwPx: lw * 1.6 });
  } else {
    const cols = ['#FF6B6B', '#FFB347', '#FFE66D', '#6BD68A', '#5AB4F0'];      // a rainbow road to a gold star
    cols.forEach((c, i) => { const r = w * (.42 - i * .045); X.beginPath(); X.arc(0, h * .42, r, Math.PI, 0); X.arc(0, h * .42, r - w * .045, 0, Math.PI, true); X.closePath(); X.fillStyle = c; X.fill(); });
    shape(starPts(0, h * .18, h * .1, .45, 5, -Math.PI / 2 + .2 * Math.sin(t * 2)), { fill: '#FFD84A', stroke: PAL.ink, lwPx: lw });
    for (let i = 0; i < 5; i++) circle(-w * .38 + i * w * .19, -h * .4 + (i % 2) * h * .05, h * .02, { fill: '#fff', stroke: null });
  }
}

function cuGame(kind, x, y, w, ang = 0, o = {}) {
  const g = CU_GAMES[kind], h = w * .7, d = w * .09, lw = Math.max(1.5, w * .018), t = o.t ?? T;
  X.save(); X.translate(x, y); X.rotate(ang); if (o.scale) X.scale(o.scale, o.scale);
  shape([[-w / 2, h / 2], [w / 2, h / 2], [w / 2, h / 2 + d], [-w / 2, h / 2 + d]], { fill: g.boxDk, stroke: PAL.ink, lwPx: lw });   // the box's thickness
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: g.box, stroke: PAL.ink, lwPx: lw });
  X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); cuArt(kind, w, h, t); X.restore();
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: null, stroke: PAL.ink, lwPx: lw });
  cuTitle(g.title, w, h, g.ink);
  X.restore();
}

// lying on the floor: the box's top face as a floor quad, its lid painted on with the same art
function cuGameFloor(P, kind, x, z, size, rot = 0) {
  const g = CU_GAMES[kind], hw = size / 2, hd = size * .35, ht = size * .09;
  const c = Math.cos(rot), s = Math.sin(rot), at = (u, v, y) => [x + u * c - v * s, y, z + u * s + v * c];
  const top = P.poly([at(-hw, -hd, ht), at(hw, -hd, ht), at(hw, hd, ht), at(-hw, hd, ht)]);
  const near = P.poly(P.dir > 0 ? [at(-hw, -hd, 0), at(hw, -hd, 0), at(hw, -hd, ht), at(-hw, -hd, ht)] : [at(-hw, hd, 0), at(hw, hd, 0), at(hw, hd, ht), at(-hw, hd, ht)]);
  if (!top) return;
  const lw = clamp(1.6 * P.k(z), 1, 4);
  if (near) shape(near, { fill: g.boxDk, stroke: PAL.ink, lwPx: lw });
  shape(top, { fill: g.box, stroke: PAL.ink, lwPx: lw });
  const [cx, cy, k] = P.p(x, ht, z), w = size * k, ys = top.map(p => p[1]);   // the title, squashed onto the lid
  X.save(); X.translate(cx, cy); X.scale(1, clamp((Math.max(...ys) - Math.min(...ys)) / (w * .7), .2, 1));
  cuTitle(g.title, w, w * .7, g.ink); X.restore();
}
