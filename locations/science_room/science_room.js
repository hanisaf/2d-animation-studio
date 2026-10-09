// locations/science_room/science_room.js: the school science room at Dove Creek Elementary (see README.md).
//
// A 3D interior in one-point perspective (engine/persp.js), built like the lecture hall to be shot from BOTH ends:
//   teacher view    cameras with dir: 1 (the default) stand among the lab benches and look toward +Z: the demo bench,
//                   whiteboard, periodic table, fume hood, specimen cabinet and Mr. Bones the skeleton.
//   classroom view  cameras with dir: -1 stand at the front and look back toward −Z: the student lab benches and stools,
//                   the back wall (shelves of jars, solar-system poster, little lab coats on hooks).
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   scienceRoom.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   scienceRoom.front(P, t, o)   pieces nearer than o.splitZ (benches, stools, props…). Call after the characters.
//                                With o.toZ it stops at that depth, for several characters at different depths (far → near).
//   scienceRoom.bench(n, x)      → { x, y, z } where a student stands behind lab bench row n (1 = front). The bench hides the legs.
// o: { splitZ, toZ, bubbling: 0..1 (Bunsen flame, bubbles, steam and fizz; default 1), bones: 0..1 (Mr. Bones rattles: feed it a kick()),
//      rows: how many student bench rows to draw, counted from the back (default 3; 2 clears the front row for a workshop floor),
//      board(t): draw your own whiteboard content. Local coords: origin at the board's top-left, world units, y down;
//      the board is scienceRoom.WB.w × WB.h (680 × 150) and the content is clipped to it. }
//
// Layout (world): side walls X = ±560, back wall Z = 0, front wall Z = 1400, ceiling Y = 360.
// Student benches: three rows of two (X −470…−110 and 110…470, a centre aisle between). Row n's bench runs
// Z FIRST − (n−1)·270 − 80 … FIRST − (n−1)·270 (FIRST = 860), top Y 80; two stools behind each bench.
// Teacher's demo bench X ±300, Z 1080–1160, top Y 94. Whiteboard X ±340, Y 85…235 on the front wall, periodic table above.
// Specimen cabinet X −545…−370 and fume hood X 350…545, both against the front wall (Z 1320/1300 … 1400).
// Windows on the right wall (Z 250…1050) above a windowsill counter; door, bulletin board and aquarium on the left wall.

const scienceRoom = (() => {
  const HW = 560, BACK = 0, FRONT = 1400, CEIL = 360;
  const ROWS = 3, ROW_D = 270, FIRST = 860, BENCH_D = 80, BENCH_H = 72, BENCHES = [[-470, -110], [110, 470]];
  const DEMO = { x0: -300, x1: 300, z0: 1080, z1: 1160, h: 80 };
  const WB = { x: -340, y: 235, w: 680, h: 150 };                                       // y = top edge (world Y)
  const CAB = { x0: -545, x1: -370, z0: 1330, h: 250 }, HOOD = { x0: 350, x1: 545, z0: 1300, h: 250 };
  const SHELF = { x0: -545, x1: -230, z1: 45, h: 270 };
  const LCOUNTER = { z0: 220, z1: 1000, d: 60, h: 86 }, RCOUNTER = { z0: 180, z1: 1120, d: 60, h: 86 };
  const TANK = { z0: 600, z1: 800, h: 62 }, MOBILE = { x: 0, z: 620 };
  const C = {
    wall: '#E8F0E2', wallDk: '#CFDCC6', wallLt: '#F5E8CB', ceil: '#F4F3EC', ceilDk: '#DCDBD0', lamp: '#FFFCEA',
    tile: '#EFE8D6', tileAlt: '#CBDCC2', base: '#5D8C7A',
    cab: '#78B5C3', cabLt: '#9CCCD6', cabDk: '#55909F', top: '#2F353B', topLt: '#4A535B',
    lam: '#E9E3D3', lamDk: '#CFC6B2', wood: '#C99A66', woodDk: '#9A6E42', woodLt: '#DDB584',
    board: '#FBFCFA', alu: '#BCC1C7', aluDk: '#8C9299', cork: '#C9925C', corkDk: '#A9763F',
    glass: 'rgba(205,232,244,.55)', glassLn: '#5E7684', steel: '#7C858D', steelLt: '#A9B2BA', steelDk: '#59626A', brass: '#D4A64A',
    sky: '#8CC8EC', skyLt: '#DDF0FA', frame: '#F4F1E8', frameDk: '#C9C3B4', tree: '#6DAE4B', treeDk: '#4F8C38', treeLt: '#94C962',
    bone: '#F5EFDC', boneDk: '#D8CDB0', water: '#8FD0DF', waterDk: '#5FAFC4', sand: '#E8CF95',
    door: '#C98F5A', doorDk: '#A26F40', navy: '#22305A', navyLt: '#33467A',
    red: '#E0584E', orange: '#F29A3A', yellow: '#F4CD3A', green: '#6DBE57', blue: '#4C8FD8', purple: '#9A6AD0', pink: '#EE7FB0',
    line: '#4A3F45',
  };
  const LIQ = [C.green, C.blue, C.purple, C.pink, C.orange, C.red, C.yellow];
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.3, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 5);
  const benchFront = n => FIRST - (n - 1) * ROW_D;                                       // n = 1..ROWS

  // ---------- building blocks ----------
  // An axis-aligned box with back-face culling. col: one colour, or { top, nz (faces −Z), pz (faces +Z), side, bot }
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .18), nz: col, pz: col, side: mixCol(col, '#000000', .14) } : col;
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.2), stroke = o.stroke === undefined ? C.line : o.stroke, skip = o.skip || '';
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, stroke: stroke || fill, lwPx: stroke ? lw : .6 }); };
    if (cam.z < z0 && !skip.includes('nz')) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz ?? c.pz);
    if (cam.z > z1 && !skip.includes('pz')) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz ?? c.nz);
    if (cam.x < x0 && !skip.includes('side')) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1 && !skip.includes('side')) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1 && !skip.includes('top')) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
    if (cam.y < y0 && !skip.includes('bot')) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.bot ?? c.side);
  }
  // A camera-facing cut-out at a world point, drawn in world units with y pointing down (props, the skeleton, fish…).
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  // Text and pictures on a reverse-angle plane would read mirrored: draw them through this.
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  // A flat shape on a side wall (the plane X = x), given as [z, y] points.
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const wline = (P, x, pts) => P.line(pts.map(([z, y]) => [x, y, z]));
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }

  // ---------- lab glassware and props (sprite-space: world units, y down, origin on the surface they stand on) ----------
  function beaker(w, h, lev, col) {
    S(rectPts(-w / 2, -h, w, h), { fill: C.glass, stroke: C.glassLn, lwPx: 1.1 });
    S(rectPts(-w / 2 + 1, -h * lev, w - 2, h * lev - 1), { fill: col, stroke: null, alpha: .85 });
    line([[-w / 2 + 2.5, -h + 3], [-w / 2 + 2.5, -3]], { stroke: 'rgba(255,255,255,.85)', lwPx: 1.2 });
    for (let i = 1; i < 4; i++) line([[w / 2 - 4, -h * i / 4], [w / 2 - 1.5, -h * i / 4]], { stroke: C.glassLn, lwPx: .8 });
    line([[-w / 2 - 1.5, -h], [w / 2 + 1, -h]], { stroke: C.glassLn, lwPx: 1.4 });
  }
  function erlenmeyer(w, h, lev, col) {
    const n = w * .32, sh = h * .55, at = y => lerp(w / 2, n / 2, clamp(-y / sh));      // half-width at height −y
    S([[-w / 2, 0], [w / 2, 0], [n / 2, -sh], [n / 2, -h], [-n / 2, -h], [-n / 2, -sh]], { fill: C.glass, stroke: C.glassLn, lwPx: 1.1 });
    const ly = -h * lev; S([[-w / 2 + 1, -1], [w / 2 - 1, -1], [at(ly) - 1, ly], [-at(ly) + 1, ly]], { fill: col, stroke: null, alpha: .85 });
    line([[-w / 2 + 4, -3], [-n / 2 + 1, -sh + 2]], { stroke: 'rgba(255,255,255,.85)', lwPx: 1.2 });
    line([[-n / 2 - 1.5, -h], [n / 2 + 1.5, -h]], { stroke: C.glassLn, lwPx: 1.4 });
  }
  // Bubbles rising through a liquid: a pure function of t (each bubble loops on its own phase).
  function bubbles(t, n, x0, x1, yBot, yTop, r, amt, seed = 0) {
    if (amt < .01) return;
    for (let i = 0; i < n; i++) {
      const ph = frac(t * (.6 + .5 * hash(i + seed)) + hash(i * 3.3 + seed)), x = lerp(x0, x1, hash(i * 7.1 + seed)) + wob(t, 2, hash(i)) * r;
      circle(x, lerp(yBot, yTop, ph), r * (.5 + .7 * hash(i * 1.7 + seed)) * amt, { fill: 'rgba(255,255,255,.7)', stroke: null });
    }
  }
  function steam(t, x, y, n, amt, col = '255,255,255', rise = 60) {
    if (amt < .01) return;
    for (let i = 0; i < n; i++) {
      const ph = frac(t * .4 + i / n), r = 3 + ph * 11;
      circle(x + Math.sin(ph * 5 + i * 2) * 7 * ph, y - ph * rise, r, { fill: `rgba(${col},${(.5 * (1 - ph) * amt).toFixed(3)})`, stroke: null });
    }
  }
  function burner(t, amt) {
    S(ellPts(0, -1.5, 9, 3), { fill: C.steelDk, lwPx: 1 });
    S(rectPts(-2.6, -22, 5.2, 20), { fill: C.steelLt, lwPx: 1 });
    line([[3, -6], [12, -4]], { stroke: C.orange, lwPx: 2.2 });                                 // gas hose
    if (amt < .01) return;
    const h = (15 + 2.5 * wob(t, 6.3) + 1.5 * wob(t, 11.7, .4)) * amt, sw = 1.2 * wob(t, 4.1, .2);
    S([[-4, -22], [sw, -22 - h], [4, -22]], { fill: 'rgba(90,150,255,.75)', stroke: null, smooth: true });
    S([[-2, -22], [sw * .6, -22 - h * .55], [2, -22]], { fill: 'rgba(200,230,255,.9)', stroke: null, smooth: true });
  }
  function roundFlask(t, r, col, amt) {
    const cy = -r;
    S(rectPts(-r * .28, cy - r * 1.9, r * .56, r * 1.1), { fill: C.glass, stroke: C.glassLn, lwPx: 1.1 });
    circle(0, cy, r, { fill: C.glass, stroke: C.glassLn, lwPx: 1.1 });
    X.save(); X.beginPath(); X.arc(0, cy, r - 1, 0, TAU); X.clip();
    X.fillStyle = rgba(col, .85); X.fillRect(-r, cy - r * .15 + wob(t, 3) * .8 * amt, 2 * r, 2 * r);
    bubbles(t * 1.6, 9, -r * .6, r * .6, cy + r * .8, cy - r * .2, 1.6, amt, 5);
    X.restore();
    line([[-r * .55, cy - r * .5], [-r * .7, cy + r * .1]], { stroke: 'rgba(255,255,255,.85)', lwPx: 1.4, smooth: true });
    steam(t, 0, cy - r * 1.9, 4, amt);
  }
  function ringStand(h, ry) {
    S(rectPts(-18, -3, 36, 3), { fill: C.steelDk, lwPx: 1 });
    line([[-12, -3], [-12, -h]], { stroke: C.steel, lwPx: 2.4 });
    line([[-12, -ry], [0, -ry]], { stroke: C.steel, lwPx: 1.8 });
    S(ellPts(0, -ry, 9, 2.4), { fill: null, stroke: C.steelDk, lwPx: 1.6 });
  }
  function tubeRack(cols) {
    S(rectPts(-26, -14, 52, 4), { fill: C.woodLt, lwPx: 1 });
    S(rectPts(-26, -3, 52, 3), { fill: C.wood, lwPx: 1 });
    for (const sx of [-24, 22]) S(rectPts(sx, -14, 2.5, 14), { fill: C.woodDk, lwPx: .8 });
    cols.forEach((c, i) => {
      const x = -19 + i * 10;
      S([[x - 3, -26], [x + 3, -26], [x + 3, -3], [x, 0], [x - 3, -3]], { fill: C.glass, stroke: C.glassLn, lwPx: 1, smooth: false });
      S([[x - 2.4, -13 + i % 2 * 3], [x + 2.4, -13 + i % 2 * 3], [x + 2.4, -3], [x, -.6], [x - 2.4, -3]], { fill: c, stroke: null });
    });
    S(rectPts(-26, -16, 52, 3), { fill: C.woodLt, lwPx: 1 });
  }
  function microscope() {
    S([[-14, 0], [14, 0], [12, -5], [-12, -5]], { fill: '#3B4048', lwPx: 1 });
    S([[-3, -5], [6, -5], [10, -26], [8, -40], [2, -38], [3, -24]], { fill: C.board, lwPx: 1 });          // arm
    S(rectPts(-12, -16, 20, 3), { fill: '#3B4048', lwPx: 1 });                                          // stage
    S([[-9, -24], [-3, -48], [3, -46], [-3, -22]], { fill: '#3B4048', lwPx: 1 });                        // tube
    S(rectPts(-4.5, -54, 6, 8), { fill: '#3B4048', lwPx: 1 });
    circle(6, -26, 3, { fill: C.steelLt, lwPx: .8 });
  }
  function goggles(col = C.blue) {
    S([[-11, -6], [11, -6], [12, -1], [3, -1], [0, -3], [-3, -1], [-12, -1]], { fill: 'rgba(210,235,250,.8)', stroke: col, lwPx: 1.6 });
  }
  function plantPot(t, h, ph, kind = 0) {
    S([[-6, -10], [6, -10], [4.5, 0], [-4.5, 0]], { fill: kind ? '#E8E2D6' : '#D9774E', lwPx: 1 });
    const sw = wob(t, .35, ph) * 1.5;
    line([[0, -10], [sw * .4, -10 - h * .6], [sw, -10 - h]], { stroke: C.treeDk, lwPx: 1.4, smooth: true });
    for (let i = 0; i < 3; i++) {
      const y = -10 - h * (.45 + i * .25), s = i % 2 ? 1 : -1, x = sw * (.4 + i * .25);
      S(ellPts(x + s * 5, y, 5.5, 2.6, 12, s * -.5), { fill: i === 2 ? C.treeLt : C.tree, lwPx: .9 });
    }
  }
  function volcano(t, amt) {
    S([[-24, 0], [24, 0], [7, -28], [-7, -28]], { fill: '#A8754A', lwPx: 1.1 });
    S([[-14, -10], [-8, -18], [-11, -8]], { fill: '#8A5C36', stroke: null });
    const o = (.6 + .4 * wob(t, .5)) * amt;
    if (o > .02) S([[-7, -28], [-5, -28 + 9 * o], [-8, -16 * o - 12], [-3, -27], [2, -14 * o - 13], [4, -27], [7, -28], [5, -31 - 4 * o], [-5, -31 - 4 * o]], { fill: C.red, lwPx: 1, smooth: true });
    if (amt > .01) for (let i = 0; i < 5; i++) { const ph = frac(t * .9 + i / 5); circle(Math.sin(i * 2.3) * 8 * ph, -32 - ph * 22, 2.5 * (1 - ph) + .5, { fill: rgba(C.orange, 1 - ph), stroke: null }); }
  }
  function rocks() {
    [[-10, '#9C9187'], [0, '#C47B5A'], [10, '#7F8C9A']].forEach(([x, c], i) => S(ellPts(x, -3, 4.5, 3.2, 10, i), { fill: c, lwPx: .9 }));
    S(ellPts(22, -2, 9, 1.4), { fill: C.woodDk, stroke: null });                                      // a magnifier lying down
    circle(13, -3, 6, { fill: 'rgba(210,235,250,.7)', stroke: C.line, lwPx: 1.2 });
  }
  function gasTap() {
    S(rectPts(-2, -7, 4, 7), { fill: C.brass, lwPx: .8 }); line([[0, -6], [6, -6]], { stroke: C.brass, lwPx: 2 });
  }

  // ---------- the shell ----------
  function floor(P) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]);
    if (q) S(q, { fill: C.tile, stroke: null });
    const T = 80;
    for (let i = 0; i < 14; i++) for (let j = 0; j < 18; j++) if ((i + j) % 2) {
      const x0 = -HW + i * T, z0 = j * T, x1 = Math.min(x0 + T, HW), z1 = Math.min(z0 + T, FRONT);
      const r = P.poly([[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]]); if (r) S(r, { fill: C.tileAlt, stroke: null });
    }
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]);
    if (q) S(q, { fill: C.ceil, stroke: null });
    for (let z = 80; z < FRONT; z += 120) { const r = P.line([[-HW, CEIL, z], [HW, CEIL, z]]); if (r) line(r, { stroke: C.ceilDk, lwPx: px(P, 1) }); }
    for (let z = 160; z < FRONT - 100; z += 300) for (const x of [-300, 0, 300]) {
      const l = P.poly([[x - 90, CEIL - 1, z], [x + 90, CEIL - 1, z], [x + 90, CEIL - 1, z + 60], [x - 90, CEIL - 1, z + 60]]);
      if (l) S(l, { fill: C.lamp, stroke: C.ceilDk, lwPx: px(P, 1.6) });
    }
  }
  function sideWalls(P, t) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = wrect(P, x, BACK, FRONT, 0, CEIL);
      if (q) S(q, { fill: C.wall, stroke: null });
      const bs = wrect(P, x, BACK, FRONT, 0, 12); if (bs) S(bs, { fill: C.base, stroke: null });
      const cr = wline(P, x, [[BACK, CEIL - 14], [FRONT, CEIL - 14]]); if (cr) line(cr, { stroke: C.wallDk, lwPx: px(P, 2.5) });
      if (sd < 0) leftWall(P, x, t); else for (const [z0, z1] of [[250, 450], [550, 750], [850, 1050]]) wallWindow(P, x, z0, z1, 100, 300, t);
    }
  }
  function wallWindow(P, x, z0, z1, y0, y1, t) {
    const q = wrect(P, x, z0, z1, y0, y1); if (!q) return;
    clipTo(q, () => {
      S(q, { fill: linGrad(0, Math.min(...q.map(v => v[1])), 0, Math.max(...q.map(v => v[1])), [[0, C.sky], [1, C.skyLt]]), stroke: null });
      // the schoolyard outside: a tree and hedges, a little parallax for free because they sit beyond the wall
      const xo = x + Math.sign(x) * 500, sw = wob(t, .25) * 6;
      const gr = P.poly([[xo, -400, -800], [xo, -400, 2800], [xo, 60, 2800], [xo, 60, -800]]); if (gr) S(gr, { fill: C.treeLt, stroke: null });
      for (let i = 0; i < 26; i++) {
        const cz = -700 + i * 135 + hash(i) * 50 + (i % 3 === 1 ? sw : 0), cy = 90 + hash(i + 4) * 130, r = 70 + hash(i + 9) * 45, col = [C.treeDk, C.tree, C.treeLt][i % 3];
        const b = P.poly(Array.from({ length: 20 }, (_, i) => { const a = i / 20 * TAU; return [xo, cy + Math.sin(a) * r * .8, cz + Math.cos(a) * r]; }));
        if (b) S(b, { fill: col, stroke: null });
      }
      const g = P.poly([[x, y0, z0], [x, y0, z1], [x, y0 + 20, z1], [x, y0 + 20, z0]]); if (g) S(g, { fill: 'rgba(255,255,255,.25)', stroke: null });
    });
    S(q, { fill: null, stroke: C.frame, lwPx: px(P, 5) });
    for (const l of [wline(P, x, [[(z0 + z1) / 2, y0], [(z0 + z1) / 2, y1]]), wline(P, x, [[z0, y0 + (y1 - y0) * .62], [z1, y0 + (y1 - y0) * .62]])]) if (l) line(l, { stroke: C.frame, lwPx: px(P, 3) });
    const gl = wpoly(P, x, [[z0 + 20, y0 + 40], [z0 + 50, y0 + 40], [z0 + 120, y1 - 20], [z0 + 90, y1 - 20]]); if (gl) S(gl, { fill: 'rgba(255,255,255,.3)', stroke: null });
  }
  function leftWall(P, x, t) {
    // door at the front, with a small window and a room sign
    const d = wrect(P, x, 1170, 1290, 0, 215); if (d) S(d, { fill: C.door, stroke: C.frameDk, lwPx: px(P, 5) });
    const dw = wrect(P, x, 1195, 1235, 120, 190); if (dw) S(dw, { fill: C.skyLt, stroke: C.doorDk, lwPx: px(P, 1.5) });
    const h = wrect(P, x, 1270, 1280, 100, 106); if (h) S(h, { fill: C.steelLt, lwPx: px(P, 1) });
    const sg = wrect(P, x, 1300, 1345, 150, 180); if (sg) S(sg, { fill: C.blue, lwPx: px(P, 1) });
    // cork bulletin board with the class's pinned work
    const cb = wrect(P, x, 480, 960, 115, 245); if (cb) S(cb, { fill: C.cork, stroke: C.red, lwPx: px(P, 4) });
    for (let i = 0; i < 9; i++) {
      const z = 500 + (i % 5) * 90 + hash(i) * 14, y = i < 5 ? 175 : 125, w = 54 + hash(i + 3) * 18, hh = 50 + hash(i + 8) * 12;
      const p = wpoly(P, x, [[z, y], [z + w, y + 3], [z + w - 2, y + hh], [z - 2, y + hh - 2]]);
      if (p) S(p, { fill: ['#FFFFFF', '#FFF3A8', '#CFEAFF', '#FFD9E6', '#DFF5C9'][i % 5], lwPx: px(P, .9) });
      const sc = wline(P, x, [[z + 8, y + hh * .7], [z + w * .7, y + hh * .62]]); if (sc) line(sc, { stroke: LIQ[i % 7], lwPx: px(P, 1.5) });
      const [sx, sy, k] = P.p(x, y + hh - 4, z + w / 2); if (P.visible(z)) circle(sx, sy, clamp(3 * k, 1, 4), { fill: LIQ[(i + 3) % 7], stroke: null });
    }
    // safety poster: GOGGLES ON!
    const sp = wrect(P, x, 290, 420, 130, 240); if (sp) S(sp, { fill: C.yellow, lwPx: px(P, 1.4) });
    const gg = wpoly(P, x, [[305, 190], [405, 190], [410, 165], [365, 165], [355, 175], [345, 165], [300, 165]]); if (gg) S(gg, { fill: 'rgba(210,235,250,.95)', stroke: C.navy, lwPx: px(P, 2) });
    for (const y of [215, 145]) { const l = wline(P, x, [[315, y], [395, y]]); if (l) line(l, { stroke: C.navy, lwPx: px(P, 3) }); }
  }

  // Front wall (Z = 1400): only seen from the teacher view.
  function frontWall(P, t, o) {
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null });
      S(rectPts(-HW, -12, 2 * HW, 12), { fill: C.base, stroke: null });
      // whiteboard + marker tray
      const x = WB.x, y = -WB.y;
      S(rectPts(x - 10, y - 10, WB.w + 20, WB.h + 20), { fill: C.alu, lwPx: 1.4 });
      S(rectPts(x, y, WB.w, WB.h), { fill: linGrad(x, y, x + WB.w, y + WB.h, [[0, '#FFFFFF'], [1, '#EEF2F2']]), stroke: C.aluDk, lwPx: 1 });
      X.save(); X.beginPath(); X.rect(x, y, WB.w, WB.h); X.clip();
      for (let i = 0; i < 4; i++) ellipse(x + WB.w * hash(i * 2.1), y + WB.h * hash(i * 5.3), 70, 14, { fill: 'rgba(120,150,190,.06)', stroke: null, rot: -.15 });
      line([[x + 60, y + 18], [x + 300, y + 130]], { stroke: 'rgba(255,255,255,.7)', lwPx: 14 });
      if (o.board) { X.translate(x, y); o.board(t); }
      X.restore();
      S(rectPts(x - 14, y + WB.h + 8, WB.w + 28, 8), { fill: C.aluDk, lwPx: 1 });
      [C.blue, C.red, C.green, C.navy].forEach((c, i) => S(rectPts(x + 30 + i * 22, y + WB.h + 2, 16, 6), { fill: c, lwPx: .7 }));
      S(rectPts(x + WB.w - 70, y + WB.h + 1, 34, 8), { fill: '#3B4048', lwPx: .7 });
      periodicTable(-125, -348);
      // SCIENCE letter cards
      'SCIENCE'.split('').forEach((ch, i) => {
        const cx = -318 + i * 26, cy = -300 + (i % 2) * 5;
        S(rectPts(cx - 11, cy - 13, 22, 26), { fill: LIQ[i % 7], lwPx: 1 });
        X.font = `700 17px ${FONT_TALK}`; X.fillStyle = '#FFFFFF'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(ch, cx, cy + 1);
      });
      clock(200, -300, 28, t);
      // atom poster above the cabinet, lab rules above the hood
      S(rectPts(-520, -345, 130, 80), { fill: C.navy, lwPx: 1.2 });
      for (let i = 0; i < 3; i++) ellipse(-455, -305, 40, 12, { fill: null, stroke: '#9FD6FF', lwPx: 1.4, rot: i * Math.PI / 3 + t * .2 });
      circle(-455, -305, 7, { fill: C.red, stroke: null });
      S(rectPts(380, -345, 140, 82), { fill: '#FFFFFF', stroke: C.green, lwPx: 2.5 });
      X.font = `700 13px ${FONT_TALK}`; X.fillStyle = C.green; X.textAlign = 'center'; X.fillText('LAB RULES', 450, -330);
      for (let i = 0; i < 3; i++) { circle(398, -312 + i * 16, 3, { fill: LIQ[i], stroke: null }); line([[408, -312 + i * 16], [500 - i * 12, -312 + i * 16]], { stroke: '#8A8F96', lwPx: 2 }); }
    });
  }
  function periodicTable(x, y) {
    const cw = 13.4, ch = 9.4, w = 18 * cw + 8, h = 9 * ch + 18;
    S(rectPts(x - 4, y - 4, w, h + 8), { fill: '#FFFFFF', lwPx: 1.2 });
    const col = (r, c) => c === 0 ? '#F28C82' : c === 1 ? '#F6B26B' : c >= 12 && c <= 16 && r >= c - 11 ? '#B7DD8E' : c === 17 ? '#9FD6FF' : c >= 2 && c <= 11 ? '#F9E08B' : '#C7B6E8';
    for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) {
      if (r === 0 && c > 0 && c < 17) continue;
      if ((r === 1 || r === 2) && c > 1 && c < 12) continue;
      S(rectPts(x + c * cw, y + 8 + r * ch, cw - 1.5, ch - 1.5), { fill: col(r, c), stroke: null });
    }
    for (let r = 0; r < 2; r++) for (let c = 2; c < 16; c++) S(rectPts(x + 1.5 * cw + c * cw, y + 12 + (7.3 + r) * ch, cw - 1.5, ch - 1.5), { fill: r ? '#F5B8D2' : '#F9C9DF', stroke: null });
  }
  function clock(x, y, r, t) {
    circle(x, y, r, { fill: '#FFFFFF', stroke: C.line, lwPx: 3 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[x + Math.sin(a) * r * .75, y - Math.cos(a) * r * .75], [x + Math.sin(a) * r * .88, y - Math.cos(a) * r * .88]], { stroke: C.line, lwPx: i % 3 ? 1 : 2.2 }); }
    const hand = (a, l, w, col) => line([[x, y], [x + Math.sin(a) * l, y - Math.cos(a) * l]], { stroke: col, lwPx: w, cap: 'round' });
    hand(TAU * (10 / 12 + t / 43200), r * .45, 3.5, C.line); hand(TAU * (10 / 60 + t / 3600), r * .7, 2.4, C.line); hand(TAU * Math.floor(t) / 60, r * .8, 1.2, C.red);
    circle(x, y, 2.5, { fill: C.line, stroke: null });
  }

  // Back wall (Z = 0): only seen from the classroom view.
  function backWall(P, t) {
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wallLt, stroke: null });
      S(rectPts(-HW, -12, 2 * HW, 12), { fill: C.base, stroke: null });
      // solar-system poster
      S(rectPts(-175, -295, 300, 165), { fill: linGrad(0, -295, 0, -130, [[0, C.navy], [1, C.navyLt]]), lwPx: 1.5 });
      for (let i = 0; i < 14; i++) circle(-165 + hash(i) * 280, -285 + hash(i + 20) * 145, .9 + hash(i + 5), { fill: '#FFFFFF', stroke: null });
      circle(-175, -212, 46, { fill: C.yellow, stroke: null });
      [[-100, 4, '#B9A28C'], [-78, 6, '#E8C27A'], [-52, 6.5, C.blue], [-28, 5, C.red], [10, 14, '#E2A86B'], [52, 11, '#E8CF95'], [84, 8, '#9FD6FF'], [108, 7.5, '#5B7FE0']].forEach(([px_, r, c], i) => {
        circle(px_, -212, r, { fill: c, stroke: null });
        if (i === 5) ellipse(px_, -212, r * 1.9, r * .45, { fill: null, stroke: '#F4E2B8', lwPx: 1.5, rot: -.3 });
      });
      readable(P, -25, -150, () => { X.font = `700 15px ${FONT_TALK}`; X.fillStyle = '#FFFFFF'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('OUR SOLAR SYSTEM', 0, 0); });
      // banner
      S(rectPts(-160, -340, 280, 32), { fill: C.orange, lwPx: 1.2 });
      readable(P, -20, -324, () => { X.font = `700 19px ${FONT_TALK}`; X.fillStyle = '#FFFFFF'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('STAY CURIOUS!', 0, 1); });
      // little lab coats and goggles on a row of hooks
      S(rectPts(180, -214, 350, 8), { fill: C.woodDk, lwPx: 1 });
      for (let i = 0; i < 4; i++) {
        const cx = 225 + i * 88, sw = wob(t, .3, i * .27) * 1.2;
        circle(cx, -210, 3, { fill: C.steelLt, stroke: C.line, lwPx: .8 });
        S([[cx - 14, -206], [cx + 14, -206], [cx + 28 + sw, -110], [cx + 24 + sw, -86], [cx - 24 + sw, -86], [cx - 28 + sw, -110]], { fill: '#FFFFFF', lwPx: 2 });
        S([[cx + 6, -200], [cx + 14, -206], [cx + 28 + sw, -110], [cx + 24 + sw, -86], [cx + 12 + sw, -86]], { fill: '#E3E9EE', stroke: null });
        S([[cx - 10, -206], [cx, -170], [cx + 10, -206]], { fill: '#E6E8E4', lwPx: 1 });
        line([[cx, -170], [cx + sw * .8, -88]], { stroke: '#C9CCC6', lwPx: 1.2 });
        S(rectPts(cx - 20 + sw * .6, -130, 12, 12), { fill: null, stroke: '#C9CCC6', lwPx: 1 });
        if (i < 3) X.save(), X.translate(cx + 44, -185), goggles(LIQ[(i + 1) % 7]), X.restore();
      }
      S(rectPts(380, -60, 60, 60), { fill: C.blue, lwPx: 1.2 }); S(rectPts(450, -60, 60, 60), { fill: C.green, lwPx: 1.2 });   // trash + recycling
    });
  }

  // ---------- depth-sorted pieces ----------
  function studentBench(P, t, n, [a, b], o) {
    const zf = benchFront(n), zb = zf - BENCH_D;
    box(P, a, b, 0, BENCH_H - 6, zb + 4, zf - 4, { nz: C.cabDk, pz: C.cab, side: C.cabDk, top: C.cab });
    if (P.cam.z > zf) P.plane(zf - 4, () => {                                                 // doors toward the teacher
      for (let i = 0; i < 4; i++) { const w = (b - a - 30) / 4, x = a + 10 + i * (w + 3.3); S(rectPts(x, -BENCH_H + 14, w, BENCH_H - 26), { fill: C.cabLt, stroke: C.cabDk, lwPx: px(P, 1) }); S(rectPts(x + w / 2 - 6, -BENCH_H + 20, 12, 3), { fill: C.steelLt, stroke: null }); }
    });
    box(P, a - 6, b + 6, BENCH_H - 6, BENCH_H, zb, zf, { nz: C.top, pz: C.top, side: C.top, top: C.topLt });
    const y = BENCH_H, zm = zb + 50, side = a < 0 ? 0 : 1, kind = (n - 1) * 2 + side;
    sprite(P, (a + b) / 2, y, zb + 12, () => gasTap());
    if (kind === 0) { sprite(P, a + 90, y, zm, () => tubeRack([C.green, C.pink, C.blue, C.yellow])); sprite(P, b - 80, y, zm - 10, () => goggles(C.red)); }
    if (kind === 1) { sprite(P, a + 80, y, zm, () => microscope()); sprite(P, b - 100, y, zm, () => beaker(16, 22, .5, C.blue)); }
    if (kind === 2) { sprite(P, a + 120, y, zm, () => volcano(t, clamp(o.bubbling ?? 1))); sprite(P, b - 70, y, zm, () => goggles(C.green)); }
    if (kind === 3) { sprite(P, a + 90, y, zm, () => erlenmeyer(22, 30, .35, C.purple)); sprite(P, a + 125, y, zm + 6, () => beaker(14, 18, .6, C.orange)); }
    if (kind === 4) sprite(P, a + 110, y, zm, () => rocks());
    if (kind === 5) { sprite(P, b - 110, y, zm, () => plantPot(t, 22, 1.3, 1)); sprite(P, a + 90, y, zm, () => tubeRack([C.orange, C.purple, C.green])); }
  }
  // A lab stool: four splayed legs, a foot ring and a round coloured seat.
  function stool(P, x, z, col) {
    const r = 15, h = 56;
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l = P.line([[x + dx * r * 1.15, 0, z + dz * r * 1.15], [x + dx * r * .6, h, z + dz * r * .6]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 2.4) }); }
    const ring = P.floorCircle(x, z, r * 1, 20, 16); if (ring) S(ring, { fill: null, stroke: C.steel, lwPx: px(P, 1.6) });
    const s0 = P.floorCircle(x, z, r, h - 5, 20), s1 = P.floorCircle(x, z, r, h, 20);
    if (s0) S(s0, { fill: mixCol(col, '#000000', .25), lwPx: px(P, 1) });
    if (s1) S(s1, { fill: col, lwPx: px(P, 1) });
  }
  function demoBench(P, t, o) {
    const D = DEMO, amt = clamp(o.bubbling ?? 1);
    box(P, D.x0, D.x1, 0, D.h - 8, D.z0 + 4, D.z1 - 4, { nz: C.cab, pz: C.cabDk, side: C.cabDk, top: C.cab });
    if (P.cam.z < D.z0) P.plane(D.z0 + 4, () => {                                                // doors and an atom badge toward the students
      for (let i = 0; i < 6; i++) { const w = 88, x = D.x0 + 14 + i * 96; if (i === 2 || i === 3) continue; S(rectPts(x, -D.h + 22, w, D.h - 34), { fill: C.cabLt, stroke: C.cabDk, lwPx: px(P, 1) }); S(rectPts(x + w / 2 - 8, -D.h + 30, 16, 3), { fill: C.steelLt, stroke: null }); }
      circle(0, -44, 30, { fill: '#FFFFFF', stroke: C.cabDk, lwPx: px(P, 1.5) });
      for (let i = 0; i < 3; i++) ellipse(0, -44, 24, 8, { fill: null, stroke: C.blue, lwPx: px(P, 1.6), rot: i * Math.PI / 3 });
      circle(0, -44, 4.5, { fill: C.red, stroke: null });
    });
    box(P, D.x0 - 8, D.x1 + 8, D.h - 8, D.h, D.z0, D.z1, { nz: C.top, pz: C.top, side: C.top, top: C.topLt });
    const y = D.h, zm = (D.z0 + D.z1) / 2;
    const sk = P.poly([[200, y + .5, D.z0 + 15], [280, y + .5, D.z0 + 15], [280, y + .5, D.z1 - 15], [200, y + .5, D.z1 - 15]]); if (sk) S(sk, { fill: '#1E2328', stroke: C.steel, lwPx: px(P, 1) });
    sprite(P, 240, y, D.z1 - 10, () => { line([[0, 0], [0, -26], [3, -32], [14, -30], [16, -22]], { stroke: C.steelLt, lwPx: 2.6, smooth: true }); });
    sprite(P, -230, y, zm, () => microscope());
    sprite(P, -130, y, zm, () => { ringStand(78, 40); X.save(); X.translate(0, -40); roundFlask(t, 13, C.green, amt); X.restore(); burner(t, amt); });
    sprite(P, 90, y, zm - 6, () => tubeRack([C.pink, C.blue, C.yellow, C.purple]));
    sprite(P, 150, y, zm, () => erlenmeyer(26, 36, .4, C.purple));
    sprite(P, -30, y, zm + 10, () => { beaker(18, 24, .55, C.orange); bubbles(t, 4, -6, 6, -3, -12, 1.4, amt, 9); });
  }
  function skeleton(P, t, o) {
    sprite(P, -440, 0, 1250, () => {
      const sw = wob(t, .22) * .025 + .14 * clamp(o.bones || 0) * Math.sin(t * 17);
      S(ellPts(0, -2, 22, 4), { fill: C.steelDk, lwPx: 1 });
      for (const dx of [-16, 0, 16]) circle(dx, -2, 3, { fill: '#2A2E33', stroke: null });
      line([[0, -4], [0, -172]], { stroke: C.steel, lwPx: 2.4 });
      line([[0, -172], [6, -176]], { stroke: C.steel, lwPx: 2 });
      X.save(); X.translate(0, -170); X.rotate(sw); X.translate(0, 170);
      const B = { fill: C.bone, stroke: C.line, lwPx: 1.1 };
      // legs
      for (const s of [-1, 1]) {
        S([[s * 6, -86], [s * 9, -48], [s * 6.5, -46], [s * 3.5, -86]], B); circle(s * 8, -46, 3, B);
        S([[s * 8, -44], [s * 9, -8], [s * 6.5, -8], [s * 5.8, -44]], B);
        S([[s * 5, -8], [s * 14, -6], [s * 14, -3], [s * 5, -3]], B);
      }
      S([[-14, -96], [14, -96], [10, -82], [0, -86], [-10, -82]], B);                                 // pelvis
      for (let i = 0; i < 6; i++) S(rectPts(-2.4, -98 - i * 6.2, 4.8, 4.6), B);                        // spine
      for (let i = 0; i < 5; i++) { const y = -128 + i * 6.5, w = 15 - Math.abs(i - 1.5) * 1.8; line([[-w, y + 3], [-w * .6, y - 2], [0, y - 3], [w * .6, y - 2], [w, y + 3]], { stroke: C.boneDk, lwPx: 3.6, smooth: true }); line([[-w, y + 3], [-w * .6, y - 2], [0, y - 3], [w * .6, y - 2], [w, y + 3]], { stroke: C.bone, lwPx: 2, smooth: true }); }
      line([[0, -140], [0, -106]], { stroke: C.bone, lwPx: 3 });
      S([[-17, -140], [17, -140], [17, -136], [-17, -136]], B);                                       // shoulders
      for (const s of [-1, 1]) {                                                                       // arms (one waving a little)
        const wv = s > 0 ? wob(t, .5) * .15 : 0;
        X.save(); X.translate(s * 17, -138); X.rotate(s * .08 + wv);
        S(rectPts(-1.8, 0, 3.6, 30), B); circle(0, 31, 2.4, B); S(rectPts(-1.6, 32, 3.2, 26), B);
        S(ellPts(0, 62, 4, 5), B); X.restore();
      }
      line([[0, -146], [0, -141]], { stroke: C.bone, lwPx: 3.5 });
      S([[-11, -160], [-11, -172], [-6, -180], [6, -180], [11, -172], [11, -160], [7, -152], [-7, -152]], { ...B, smooth: true });   // skull
      S(ellPts(-4.5, -164, 3.4, 3.8), { fill: '#2A2E33', stroke: null }); S(ellPts(4.5, -164, 3.4, 3.8), { fill: '#2A2E33', stroke: null });
      S([[0, -160], [-1.6, -157], [1.6, -157]], { fill: '#2A2E33', stroke: null });
      for (let i = -2; i <= 2; i++) line([[i * 2.2, -155], [i * 2.2, -152]], { stroke: C.line, lwPx: .8 });
      X.restore();
    });
  }
  function specimenCabinet(P) {
    const c = CAB;
    box(P, c.x0, c.x1, 0, c.h, c.z0, FRONT, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.woodLt });
    if (P.cam.z >= c.z0) return;
    P.plane(c.z0, () => {
      S(rectPts(c.x0 + 8, -c.h + 8, c.x1 - c.x0 - 16, c.h - 90), { fill: 'rgba(225,240,245,.95)', stroke: C.woodDk, lwPx: px(P, 1.4) });
      for (const sy of [-c.h + 8 + 50, -c.h + 8 + 105]) S(rectPts(c.x0 + 8, sy, c.x1 - c.x0 - 16, 4), { fill: C.woodDk, stroke: null });
      const jars = [[-525, -c.h + 58, 18, 30, C.green], [-498, -c.h + 58, 16, 22, C.yellow], [-470, -c.h + 58, 20, 36, C.blue], [-440, -c.h + 58, 14, 20, C.pink], [-410, -c.h + 58, 18, 26, C.orange],
        [-522, -c.h + 113, 22, 40, '#A5C97A'], [-492, -c.h + 113, 14, 24, C.purple], [-460, -c.h + 113, 24, 30, C.red], [-425, -c.h + 113, 18, 38, '#9FD6FF'], [-395, -c.h + 113, 14, 18, C.green],
        [-520, -c.h + 168, 26, 34, '#E8CF95'], [-485, -c.h + 168, 18, 26, C.blue], [-450, -c.h + 168, 20, 38, C.green], [-415, -c.h + 168, 22, 22, C.orange]];
      for (const [x, y, w, h, col] of jars) {
        S(rectPts(x - w / 2, y - h, w, h), { fill: rgba(col, .7), stroke: C.glassLn, lwPx: px(P, .9) });
        S(rectPts(x - w / 2 - 1, y - h - 4, w + 2, 4), { fill: '#3B4048', stroke: null });
        S(rectPts(x - w / 2 + 3, y - h * .6, w - 6, h * .25), { fill: '#FFFFFF', stroke: null, alpha: .85 });
      }
      line([[(c.x0 + c.x1) / 2, -c.h + 8], [(c.x0 + c.x1) / 2, -90]], { stroke: C.woodDk, lwPx: px(P, 1.6) });
      for (let i = 0; i < 2; i++) S(rectPts(c.x0 + 10 + i * 82, -80, 76, 70), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, 1) });
    });
  }
  function fumeHood(P, t, o) {
    const h = HOOD, amt = clamp(o.bubbling ?? 1);
    box(P, h.x0, h.x1, 0, h.h, h.z0, FRONT, { nz: '#E9ECEC', pz: '#E9ECEC', side: '#C9CFD1', top: '#F4F6F6' });
    if (P.cam.z >= h.z0) return;
    P.plane(h.z0, () => {
      S(rectPts(h.x0 + 6, -88, h.x1 - h.x0 - 12, 80), { fill: C.cab, stroke: C.cabDk, lwPx: px(P, 1) });
      S(rectPts(h.x0 + 10, -200, h.x1 - h.x0 - 20, 106), { fill: linGrad(0, -200, 0, -94, [[0, '#FFFBEA'], [1, '#E0E8E8']]), stroke: C.steel, lwPx: px(P, 2) });
      // inside: a fizzing green experiment venting upward
      const bx = 440; X.save(); X.translate(bx, -96); erlenmeyer(30, 42, .45, C.green); X.restore();
      bubbles(t, 6, bx - 9, bx + 9, -100, -112, 1.6, amt, 2);
      X.save(); X.beginPath(); X.rect(h.x0 + 10, -200, h.x1 - h.x0 - 20, 106); X.clip(); steam(t, bx, -138, 5, amt, '170,230,150', 70); X.restore();
      S(rectPts(h.x0 + 10, -200, h.x1 - h.x0 - 20, 72), { fill: 'rgba(190,225,240,.35)', stroke: C.steelDk, lwPx: px(P, 1.6) });   // the raised sash
      S(rectPts(h.x0 + 40, -132, h.x1 - h.x0 - 80, 4), { fill: C.steelDk, stroke: null });
      S(rectPts(h.x0 + 4, -h.h + 6, h.x1 - h.x0 - 8, 40), { fill: '#DADFE0', stroke: C.steel, lwPx: px(P, 1) });
      for (let i = 0; i < 8; i++) S(rectPts(h.x0 + 20 + i * 20, -h.h + 14, 12, 4), { fill: C.steelDk, stroke: null });
      X.font = `700 13px ${FONT_TALK}`; X.fillStyle = C.steelDk; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('FUME HOOD', (h.x0 + h.x1) / 2, -h.h + 34);
    });
  }
  function shelves(P) {
    const s = SHELF;
    box(P, s.x0, s.x1, 0, s.h, BACK, s.z1, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.woodLt });
    if (P.cam.z <= s.z1) return;
    P.plane(s.z1, () => {
      S(rectPts(s.x0 + 8, -s.h + 8, s.x1 - s.x0 - 16, s.h - 16), { fill: '#8D6540', stroke: null });
      for (let r = 0; r < 4; r++) {
        const y = -s.h + 8 + (r + 1) * 63;
        S(rectPts(s.x0 + 8, y - 4, s.x1 - s.x0 - 16, 5), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
        let x = s.x0 + 16;
        for (let i = 0; x < s.x1 - 30; i++) {
          const k = hash(r * 31 + i * 7.7), w = r === 3 ? 9 + k * 5 : 14 + k * 14, h = r === 3 ? 38 + k * 14 : 18 + hash(i + r * 9) * 28, col = r === 3 ? ['#C0443F', '#3E6FB0', '#E3B65E', '#5AA544', '#8A5BB8'][i % 5] : LIQ[(i + r * 2) % 7];
          if (r === 3) S(rectPts(x, y - 4 - h, w, h), { fill: col, lwPx: px(P, .8) });                 // books on the bottom shelf
          else { S(rectPts(x, y - 4 - h, w, h), { fill: rgba(col, .65), stroke: C.glassLn, lwPx: px(P, .8) }); S(rectPts(x - 1, y - 8 - h, w + 2, 4), { fill: '#3B4048', stroke: null }); }
          x += w + 6 + hash(i + r) * 6;
        }
      }
    });
  }
  function sideCounter(P, sd, c) {
    const x0 = sd < 0 ? -HW : HW - c.d, x1 = sd < 0 ? -HW + c.d : HW;
    box(P, x0, x1, 0, c.h - 5, c.z0, c.z1, { nz: C.cabDk, pz: C.cabDk, side: C.cab, top: C.cab });
    box(P, x0, x1 + (sd < 0 ? 4 : 0) - (sd > 0 ? 4 : 0), c.h - 5, c.h, c.z0 - 4, c.z1 + 4, { nz: C.lamDk, pz: C.lamDk, side: C.lamDk, top: C.lam });
    const xf = sd < 0 ? x1 : x0;                                                                   // cabinet doors on the room side
    if (sd * P.cam.x < sd * xf) for (let z = c.z0 + 10; z < c.z1 - 60; z += 70) { const q = wrect(P, xf, z, z + 62, 12, c.h - 14); if (q) S(q, { fill: C.cabLt, stroke: C.cabDk, lwPx: px(P, 1) }); }
  }
  function aquarium(P, t) {
    const x0 = -HW + 6, x1 = -HW + 54, y0 = LCOUNTER.h, y1 = y0 + TANK.h, { z0, z1 } = TANK;
    box(P, x0, x1, y0, y1, z0, z1, { nz: C.water, pz: C.water, side: C.water, top: C.waterDk }, { stroke: C.glassLn });
    box(P, x0, x1, y0, y0 + 8, z0, z1, { nz: C.sand, pz: C.sand, side: C.sand, top: C.sand }, { stroke: null, skip: 'top' });
    for (let i = 0; i < 4; i++) { const z = z0 + 30 + i * 45; sprite(P, (x0 + x1) / 2, y0 + 8, z, () => line([[0, 0], [wob(t, .4, i * .3) * 3, -18], [wob(t, .4, i * .3 + .2) * 4, -34 - i * 4]], { stroke: C.treeDk, lwPx: 2.4, smooth: true })); }
    for (let i = 0; i < 3; i++) {
      const s = t * (.07 + i * .02) + i * .33, z = lerp(z0 + 25, z1 - 25, .5 + .5 * Math.sin(s * TAU)), dz = Math.cos(s * TAU), y = y0 + 22 + i * 12 + wob(t, .5, i) * 3;
      sprite(P, (x0 + x1) / 2 + (i - 1) * 10, y, z, () => { X.scale(dz * P.dir >= 0 ? 1 : -1, 1); S([[-6, 0], [0, -4], [6, 0], [0, 4]], { fill: [C.orange, C.yellow, C.pink][i], lwPx: .9, smooth: true }); S([[-6, 0], [-11, -4], [-11, 4]], { fill: [C.orange, C.yellow, C.pink][i], lwPx: .9 }); circle(3, -1, .9, { fill: C.line, stroke: null }); });
    }
    sprite(P, (x0 + x1) / 2, y0 + 8, z0 + 160, () => bubbles(t, 5, -2, 2, 0, -50, 1.6, 1, 4));
    const rim = P.line([[x1, y1, z0], [x1, y1, z1]]); if (rim) line(rim, { stroke: C.line, lwPx: px(P, 3) });
  }
  function globe(P, t) {
    sprite(P, -HW + 30, LCOUNTER.h, 330, () => {
      S(ellPts(0, -2, 10, 2.5), { fill: C.woodDk, lwPx: 1 }); line([[0, -2], [0, -10]], { stroke: C.woodDk, lwPx: 2.4 });
      X.save(); X.translate(0, -28); X.rotate(.4);
      circle(0, 0, 16, { fill: C.blue, lwPx: 1.2 });
      X.save(); X.beginPath(); X.arc(0, 0, 15.5, 0, TAU); X.clip();
      for (let i = 0; i < 3; i++) { const x = ((frac(t * .05 + i / 3) * 2 - 1) * 26); S(ellPts(x, -6 + i * 6, 6, 4 + i, 10, i), { fill: C.green, stroke: null }); }
      X.restore();
      S(ellPts(0, 0, 19, 19, 24), { fill: null, stroke: C.brass, lwPx: 1.4 });
      X.restore();
    });
  }
  function sprouts(P, t) {
    for (let i = 0; i < 6; i++) sprite(P, HW - 30, RCOUNTER.h, 260 + i * 150, () => plantPot(t, 6 + i * 6, i * .4, i % 2));
  }
  // The solar-system mobile: each body hangs on its own string and orbits the sun slowly (and is depth-sorted on its own).
  const BODIES = [[45, 270, 4, '#B9A28C'], [65, 262, 6, '#E8C27A'], [85, 268, 6.5, C.blue], [105, 258, 5, C.red], [130, 250, 13, '#E2A86B'], [152, 262, 11, '#E8CF95'], [172, 256, 8, '#9FD6FF'], [190, 266, 8, '#5B7FE0']];
  const bodyAt = (i, t) => { const [r] = BODIES[i], a = t * .12 * (1.6 - i * .12) + i * 1.9; return [MOBILE.x + Math.cos(a) * r, MOBILE.z + Math.sin(a) * r * .9]; };
  function hanging(P, x, y, z, rad, col, ring) {
    const s = P.line([[x, CEIL, z], [x, y + rad, z]]); if (s) line(s, { stroke: 'rgba(80,70,75,.55)', lwPx: px(P, .8) });
    sprite(P, x, y, z, () => {
      circle(0, 0, rad, { fill: col, lwPx: 1.1 });
      ellipse(-rad * .35, -rad * .35, rad * .35, rad * .25, { fill: 'rgba(255,255,255,.45)', stroke: null });
      if (ring) ellipse(0, 0, rad * 1.9, rad * .45, { fill: null, stroke: '#F4E2B8', lwPx: 2, rot: -.25 });
    });
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the room.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri });
    for (let n = 1 + ROWS - clamp(Math.round(o.rows ?? ROWS), 0, ROWS); n <= ROWS; n++) {
      const zf = benchFront(n);
      for (const bl of BENCHES) {
        add(zf - BENCH_D, zf, () => studentBench(P, t, n, bl, o), 1);
        for (const [i, dx] of [[0, -90], [1, 90]]) { const x = (bl[0] + bl[1]) / 2 + dx, z = zf - 150; add(z - 16, z + 16, () => stool(P, x, z, [C.red, C.yellow, C.blue, C.green][(n + i + (bl[0] < 0 ? 0 : 2)) % 4]), 0); }
      }
    }
    add(DEMO.z0, DEMO.z1, () => demoBench(P, t, o), 1);
    add(CAB.z0, FRONT, () => specimenCabinet(P), 0);
    add(HOOD.z0, FRONT, () => fumeHood(P, t, o), 0);
    add(BACK, SHELF.z1, () => shelves(P), 0);
    add(1240, 1260, () => skeleton(P, t, o), 1);
    add(LCOUNTER.z0, LCOUNTER.z1, () => sideCounter(P, -1, LCOUNTER), -1);
    add(RCOUNTER.z0, RCOUNTER.z1, () => sideCounter(P, 1, RCOUNTER), -1);
    add(TANK.z0, TANK.z1, () => aquarium(P, t), 0);
    add(320, 340, () => globe(P, t), 0);
    add(1100, 1110, () => sprouts(P, t), -1);
    add(MOBILE.z, MOBILE.z, () => hanging(P, MOBILE.x, 285, MOBILE.z, 22, C.yellow), 2);
    BODIES.forEach(([, y, r, col], i) => { const [x, z] = bodyAt(i, t); add(z, z, () => hanging(P, x, y, z, r, col, i === 5), 2); });
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 1230 }, HW, BACK, FRONT, CEIL, FIRST, ROWS, ROW_D, BENCH_H, WB, DEMO, HOOD, CAB,
    benchFront,
    bench: (n, x = 0) => ({ x, y: 0, z: benchFront(n) - BENCH_D - 30 }),               // where a student stands behind row n
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P); ceiling(P); sideWalls(P, t); backWall(P, t); frontWall(P, t, o);
      const d = !Number.isFinite(o.splitZ) ? -Infinity : P.depth(o.splitZ);               // ±Infinity / unset = draw everything
      for (const it of items(P, t, o)) if (it.key > d) it.draw();
    },
    front(P, t, o = {}) {
      if (!Number.isFinite(o.splitZ)) return;
      const d = P.depth(o.splitZ), stop = o.toZ == null ? -Infinity : P.depth(o.toZ);
      for (const it of items(P, t, o)) if (it.key <= d && it.key > stop) it.draw();
    },
  };
})();

// Registration for the studio's location browser: named spots + camera presets (paste-ready for scene code).
// Teacher cameras look toward the demo bench and whiteboard (dir 1); classroom cameras stand at the front and look back (dir: -1).
LOCATIONS.science_room = Object.assign(scienceRoom, {
  spots: {
    'Demo bench (teacher)': { x: 0, y: 0, z: 1230 },
    'In front of the demo bench': { x: 0, y: 0, z: 960 },
    'At the whiteboard': { x: -200, y: 0, z: 1320 },
    'At the fume hood': { x: 430, y: 0, z: 1220 },
    'By Mr. Bones': { x: -330, y: 0, z: 1250 },
    'Bench 1 · left': scienceRoom.bench(1, -290),
    'Bench 1 · right': scienceRoom.bench(1, 290),
    'Bench 2 · left': scienceRoom.bench(2, -290),
    'Bench 2 · right': scienceRoom.bench(2, 290),
    'Bench 3 · center-left': scienceRoom.bench(3, -200),
    'Center aisle': { x: 0, y: 0, z: 560 },
    'Doorway': { x: -470, y: 0, z: 1230 },
    'By the window': { x: 430, y: 0, z: 700 },
    'By the aquarium': { x: -430, y: 0, z: 700 },
  },
  cameras: {
    'Teacher · wide from the back': { x: 0, y: 165, z: 40, f: 700, hy: 560, dir: 1 },
    'Teacher · medium': { x: 0, y: 135, z: 900, f: 1000, hy: 560, dir: 1 },
    'Teacher · demo close': { x: -130, y: 125, z: 980, f: 1000, hy: 560, dir: 1 },
    'Teacher · whiteboard': { x: 0, y: 160, z: 760, f: 900, hy: 680, dir: 1 },
    'Teacher · fume hood': { x: 330, y: 140, z: 960, f: 1000, hy: 600, dir: 1 },
    'Teacher · Mr. Bones': { x: -420, y: 130, z: 900, f: 1000, hy: 600, dir: 1 },
    'Classroom · from the board': { x: 0, y: 175, z: 1370, f: 700, hy: 520, dir: -1 },
    'Classroom · bench 1 left': { x: -290, y: 125, z: 1040, f: 1000, hy: 600, dir: -1 },
    'Classroom · bench 1 right': { x: 290, y: 125, z: 1040, f: 1000, hy: 600, dir: -1 },
    'Classroom · bench 2 (over the front row)': { x: 0, y: 190, z: 980, f: 1000, hy: 470, dir: -1 },
    'Classroom · back benches': { x: 150, y: 130, z: 720, f: 1000, hy: 580, dir: -1 },
    'Classroom · aquarium': { x: -360, y: 150, z: 1020, f: 1000, hy: 600, dir: -1 },
    'Classroom · back wall': { x: 0, y: 165, z: 560, f: 900, hy: 560, dir: -1 },
  },
});
