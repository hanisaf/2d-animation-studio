// scenes/talent_show/scene25_cube_drops/props.js: the props for "The Cube Drops" (all prefixed cd, since every script shares one scope).
// The talent-show dressing (judges' table, chairs, banner, score cards, title tags) is scene 24's, from its props.js (cb…).
//   cdCube(x, y, s, o)                   a Rubik's cube that can be scrambled or solved (screen; s = px per sticker, 3 wide)
//                                        o: { solve 0..1, seed, twist 0..1, row, ang, glow }
//   cdHands(x, y, s, t, o)               Danny's two hands gripping the close-up cube from the sides (screen, same s)
//   cdTrophy(x, y, h, kind, k, t)        a golden trophy: (x, y) = the bottom of its base, h = height px, kind 'rope' | 'ball' | 'cube'

const CD_FACE = ['#E8443A', '#F7F4EA', '#3E7BD8'];                               // solved: front red, top white, side blue
const CD_COLS = ['#E8443A', '#F7F4EA', '#3E7BD8', '#F2C230', '#4CB050', '#F08A2C'];

// The cube in local sticker units: the front face spans (−1.5, −1.5)…(1.5, 1.5); the top and right faces recede up and right.
function cdCube(x, y, s, o = {}) {
  const ink = PAL.ink, D = [.8, -.8], lw = clamp(s * .06, .8, 4) / s, solve = o.solve ?? 1, seed = o.seed ?? 1;
  const faces = [
    { o: [-1.5, -1.5], u: [1, 0], v: [0, 1] },                                // front
    { o: [-1.5 + D[0], -1.5 + D[1]], u: [1, 0], v: [-D[0] / 3, -D[1] / 3] },  // top (rows run from the back edge to the front)
    { o: [1.5, -1.5], u: [D[0] / 3, D[1] / 3], v: [0, 1] },                   // right side
  ];
  const at = (f, a, b) => [f.o[0] + a * f.u[0] + b * f.v[0], f.o[1] + a * f.u[1] + b * f.v[1]];
  const col = (fi, i, j) => {
    if (i === 1 && j === 1) return CD_FACE[fi];                               // centres never move
    const h = hash(seed * 13.7 + fi * 31.1 + i * 3.3 + j * 7.9);
    return hash(fi * 5.3 + i * 11.1 + j * 2.9 + 4.4) < solve ? CD_FACE[fi] : CD_COLS[Math.floor(h * 6)];
  };
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s, s);
  if (o.glow) { X.save(); X.globalCompositeOperation = 'lighter'; ellipse(.4, -.4, 3.4, 3.4, { fill: rgba('#FFF1A8', .08 * o.glow), stroke: null }); X.restore(); }
  faces.forEach((f, fi) => {
    shape([at(f, 0, 0), at(f, 3, 0), at(f, 3, 3), at(f, 0, 3)], { fill: '#1E1E24', stroke: ink, lw: lw * 1.6 });
    const shade = fi === 0 ? 0 : fi === 1 ? .12 : .22;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      // the twisting row of the front face slides sideways (and is clipped to the face)
      const slide = fi === 0 && j === (o.row ?? 0) ? (o.twist || 0) : 0, e = .09;
      const pts = [at(f, i + e + slide, j + e), at(f, i + 1 - e + slide, j + e), at(f, i + 1 - e + slide, j + 1 - e), at(f, i + e + slide, j + 1 - e)];
      if (slide) { X.save(); X.beginPath(); X.rect(-1.5, -1.5, 3, 3); X.clip(); }
      shape(pts, { fill: mixCol(col(fi, i, j), '#1E1E24', shade), stroke: null, smooth: .25 });
      if (fi === 0) shape([at(f, i + e + .12 + slide, j + e + .1), at(f, i + .45 + slide, j + e + .1), at(f, i + e + .12 + slide, j + .4)], { fill: 'rgba(255,255,255,.35)', stroke: null });
      if (slide) {                                                            // the sticker sliding in from the far side
        const back = [at(f, i - 3 + e + slide, j + e), at(f, i - 2 - e + slide, j + e), at(f, i - 2 - e + slide, j + 1 - e), at(f, i - 3 + e + slide, j + 1 - e)];
        shape(back, { fill: col(2, i, j), stroke: null, smooth: .25 });
        X.restore();
      }
    }
  });
  X.restore();
}

// Danny's hands holding the close-up cube: navy sleeves with yellow cuffs, mitten palms on the sides, thumbs on the front.
function cdHands(x, y, s, t, o = {}) {
  const ink = PAL.ink, skin = '#E5B393', jig = o.jig || 0;
  for (const sd of [-1, 1]) {
    const dy = jig * .25 * Math.sin(t * 40 + sd), hx = x + sd * 1.75 * s, hy = y + (.4 + dy) * s;
    shape([[hx + sd * .2 * s, hy + .2 * s], [hx + sd * 1.6 * s, hy + 2.6 * s], [hx + sd * 2.9 * s, hy + 2.2 * s], [hx + sd * 1.1 * s, hy - .5 * s]], { fill: '#353969', stroke: ink, lwPx: 3, smooth: .3 });
    shape([[hx + sd * 1.25 * s, hy + 2.45 * s], [hx + sd * 2.0 * s, hy + 3.05 * s], [hx + sd * 2.5 * s, hy + 2.55 * s], [hx + sd * 1.8 * s, hy + 1.95 * s]], { fill: '#E8CF74', stroke: ink, lwPx: 2.5, smooth: .3 });
    ellipse(hx, hy, .62 * s, 1.0 * s, { fill: skin, stroke: ink, lwPx: 3 });
    for (let f = 0; f < 3; f++) ellipse(hx - sd * .35 * s, hy - (.55 - f * .42) * s, .3 * s, .2 * s, { fill: skin, stroke: ink, lwPx: 2.2 });
    const tw = jig * .2 * Math.sin(t * 46 + sd * 2);
    ellipse(x + sd * (1.22 + tw) * s, y + (.15 + dy) * s, .26 * s, .46 * s, { fill: skin, stroke: ink, lwPx: 2.5 });
  }
}

// A golden trophy. kind sets what stands on top: a jumping rope, a soccer ball, or a little solved Rubik's cube.
function cdTrophy(x, y, h, kind, k = 1, t = T) {
  if (k <= .01) return;
  const ink = PAL.ink, gold = '#F2C14E', goldDk = '#C98F1E', goldLt = '#FFE48A', lw = Math.max(1.5, h * .025);
  X.save(); X.translate(x, y); X.scale(k, k);
  const u = h / 10;                                                           // the trophy is 10 u tall, base at y 0
  shape(rectPts(-2.2 * u, -1.6 * u, 4.4 * u, 1.6 * u), { fill: '#6B3E26', stroke: ink, lwPx: lw, smooth: .1 });            // the wooden base
  shape(rectPts(-1.4 * u, -1.25 * u, 2.8 * u, .8 * u), { fill: goldLt, stroke: ink, lwPx: lw * .7 });                    // the name plate
  shape(rectPts(-1.5 * u, -2.3 * u, 3.0 * u, .7 * u), { fill: goldDk, stroke: ink, lwPx: lw });
  shape([[-.35 * u, -2.3 * u], [.35 * u, -2.3 * u], [.25 * u, -3.6 * u], [-.25 * u, -3.6 * u]], { fill: gold, stroke: ink, lwPx: lw });
  ellipse(0, -3.7 * u, .9 * u, .3 * u, { fill: goldDk, stroke: ink, lwPx: lw });
  for (const sd of [-1, 1]) {                                                 // the handles: an ink line under a gold one
    const hp = [[sd * 1.6 * u, -7.0 * u], [sd * 2.6 * u, -6.9 * u], [sd * 2.5 * u, -5.4 * u], [sd * 1.2 * u, -4.8 * u]];
    shape(hp, { fill: null, stroke: ink, lwPx: lw * 3.2, smooth: .5, closed: false });
    shape(hp, { fill: null, stroke: gold, lwPx: lw * 1.6, smooth: .5, closed: false });
  }
  shape([[-1.9 * u, -7.2 * u], [1.9 * u, -7.2 * u], [1.5 * u, -5.2 * u], [.6 * u, -4.1 * u], [-.6 * u, -4.1 * u], [-1.5 * u, -5.2 * u]], { fill: gold, stroke: ink, lwPx: lw * 1.2, smooth: .3 });   // the cup
  shape([[-1.2 * u, -6.9 * u], [-.8 * u, -6.9 * u], [-.7 * u, -4.8 * u], [-.95 * u, -5.1 * u]], { fill: 'rgba(255,255,255,.45)', stroke: null, smooth: .3 });
  ellipse(0, -7.2 * u, 1.9 * u, .32 * u, { fill: goldDk, stroke: ink, lwPx: lw });
  // the topper
  const ty = -8.3 * u;
  if (kind === 'ball') {
    circle(0, ty, 1.05 * u, { fill: '#FFFDF6', stroke: ink, lwPx: lw });
    shape(starPts(0, ty, .42 * u, 1, 5).filter((_, i) => i % 2 === 0), { fill: '#2A2230', stroke: null });
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; line([[Math.cos(a) * .42 * u, ty + Math.sin(a) * .42 * u], [Math.cos(a) * 1.0 * u, ty + Math.sin(a) * 1.0 * u]], { stroke: '#2A2230', lwPx: lw * .7 }); }
  } else if (kind === 'cube') {
    cdCube(-.25 * u, ty + .1 * u, .55 * u, { solve: 1 });
  } else {                                                                    // a jumping rope: two handles and a loop of rope
    shape([[-1.1 * u, ty + .6 * u], [-1.6 * u, ty - .9 * u], [0, ty - 1.9 * u], [1.6 * u, ty - .9 * u], [1.1 * u, ty + .6 * u]], { fill: null, stroke: '#E25C8E', lwPx: lw * 1.4, smooth: .6, closed: false });
    for (const sd of [-1, 1]) { X.save(); X.translate(sd * 1.05 * u, ty + .9 * u); X.rotate(sd * .25); shape(rectPts(-.22 * u, -.5 * u, .44 * u, 1.0 * u), { fill: '#3E7BD8', stroke: ink, lwPx: lw * .8, smooth: .4 }); X.restore(); }
  }
  // glints
  for (let i = 0; i < 3; i++) {
    const tw = Math.max(0, Math.sin(t * 3.2 + i * 2.1));
    if (tw > .2) shape(starPts((-1.6 + i * 1.6) * u, (-6.4 - i * .9) * u - (i === 1 ? 2.6 * u : 0), .5 * u * tw, .3, 4), { fill: '#FFFBE0', stroke: null });
  }
  X.restore();
}
