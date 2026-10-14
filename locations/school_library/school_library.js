// locations/school_library/school_library.js: the school library at Dove Creek Elementary (see README.md).
//
// A 3D interior in one-point perspective (engine/persp.js), built like the science room to be shot from BOTH ends:
//   desk view     cameras with dir: 1 (the default) stand among the reading tables and look toward +Z: the circulation desk,
//                 the BOOK OF THE MONTH board, LIBRARY letters, the card catalog with Hoot the owl, the NEW BOOKS display.
//   reading view  cameras with dir: -1 stand by the desk and look back toward −Z: the reading tables with their green lamps,
//                 the tall back bookcases, the READING IS AN ADVENTURE mural, the story corner and the picture-book bins.
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   schoolLibrary.back(P, t, o)    walls, floor, ceiling, sunbeams and every piece farther than o.splitZ (default: everything). Call first.
//   schoolLibrary.front(P, t, o)   pieces nearer than o.splitZ (tables, chairs, desk…). Call after the characters.
//                                  With o.toZ it stops at that depth, for several characters at different depths (far → near).
//   schoolLibrary.table(n, x, side) → { x, y, z } where a reader stands at reading-table row n (1 = nearer the desk).
//                                  side −1 (default) = the back side, for the reading view; side 1 = the desk side, for the desk view.
//                                  Either way the table stands between the reader and the camera and hides their legs.
// o: { splitZ, toZ, sun: 0..1 (sunbeams and dust motes through the windows; default 1, 0 for a grey day or after school),
//      lamps: 0..1 (glow of the green table lamps; default .5), ding: 0..1 (the desk bell jumps: feed it a kick()),
//      board(t): draw your own BOOK OF THE MONTH board content. Local coords: origin at the board's top-left, world units, y down;
//      the board is schoolLibrary.BOARD.w × BOARD.h (560 × 130) and the content is clipped to it. }
//
// Layout (world): side walls X = ±600, back wall Z = 0, front wall Z = 1400, ceiling Y = 380.
// Reading tables: two rows of two (X −450…−150 and 150…450, a centre aisle between). Row n's table runs
// Z FIRST − (n−1)·300 − 110 … FIRST − (n−1)·300 (FIRST = 900), top Y 68; a chair on each long side of every table.
// Circulation desk X ±280, Z 1080–1170, top Y 100. BOOK OF THE MONTH board X ±280, Y 150…280 on the front wall.
// Card catalog X −590…−440 and NEW BOOKS display X 420…590, both against the front wall. Book cart X 380…500, Z 1150–1210.
// Bookcases line the left wall (Z 140…1020) and the back wall (X ±170…590); windows with low shelves under them on the right wall.

const schoolLibrary = (() => {
  const HW = 600, BACK = 0, FRONT = 1400, CEIL = 380;
  const ROWS = 2, ROW_D = 300, FIRST = 900, TABLE_D = 110, TABLE_H = 68, TABLES = [[-450, -150], [150, 450]];
  const DESK = { x0: -280, x1: 280, z0: 1080, z1: 1170, h: 100 };
  const BOARD = { x: -280, y: 280, w: 560, h: 130 };                                      // y = top edge (world Y)
  const LSHELF = { z0: 140, z1: 1020, d: 48, h: 240 }, RSHELF = { z0: 180, z1: 1120, d: 44, h: 100 };
  const BSHELF = { x: [[-590, -170], [170, 590]], z1: 44, h: 260 };
  const CAT = { x0: -590, x1: -440, z0: 1320, h: 130 }, NEWB = { x0: 420, x1: 590, z0: 1330, h: 200 };
  const CART = { x0: 380, x1: 500, z0: 1150, z1: 1210 }, BINS = { x0: 170, x1: 470, z0: 190, z1: 250, h: 58 };
  const RUG = { x: -340, z: 250, r: 150 }, WINDOWS = [[220, 440], [540, 760], [860, 1080]], WIN_Y = [130, 320];
  const C = {
    wall: '#F3E7D0', wallDk: '#DCCBAE', wallLt: '#DDEBF1', ceil: '#F6F3EA', ceilDk: '#DEDACB', lamp: '#FFFCEA',
    carpet: '#5E8FA8', carpetDk: '#4D7C95', carpetLt: '#7BA9BF', base: '#7A5634',
    wood: '#C68E56', woodDk: '#966537', woodLt: '#DCAE78', woodXd: '#6E4626', oak: '#E2BC86', oakDk: '#B98E59',
    green: '#2F7D55', greenLt: '#4FA478', brass: '#D4A64A', brassDk: '#A87E2C',
    board: '#C9925C', boardDk: '#A9763F', paper: '#FFFDF6', steel: '#7C858D', steelLt: '#A9B2BA', steelDk: '#59626A',
    sky: '#8CC8EC', skyLt: '#DDF0FA', frame: '#F4F1E8', frameDk: '#C9C3B4', tree: '#6DAE4B', treeDk: '#4F8C38', treeLt: '#94C962',
    door: '#B97F4C', doorDk: '#8E5D33', navy: '#22305A', navyLt: '#33467A',
    red: '#E0584E', orange: '#F29A3A', yellow: '#F4CD3A', lime: '#8CCB5A', blue: '#4C8FD8', purple: '#9A6AD0', pink: '#EE7FB0', teal: '#3FB3A8',
    line: '#4A3F45',
  };
  const BOOKS = ['#C0443F', '#3E6FB0', '#E3B65E', '#5AA544', '#8A5BB8', '#E07B39', '#2E8C86', '#D9667F', '#4A5A8C', '#9C6B3E', '#F0D36A', '#6E9E3A'];
  const BRIGHT = [C.red, C.orange, C.yellow, C.lime, C.blue, C.purple, C.pink, C.teal];
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.3, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 5);
  const tableFront = n => FIRST - (n - 1) * ROW_D;                                        // n = 1..ROWS

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
  // A camera-facing cut-out at a world point, drawn in world units with y pointing down (props, beanbags, the owl…).
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  // Text and pictures on a reverse-angle plane would read mirrored: draw them through this.
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const label = (txt, x, y, size, col, weight = 700) => { X.font = `${weight} ${size}px ${FONT_TALK}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  // A flat shape on a side wall (the plane X = x), given as [z, y] points.
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const wline = (P, x, pts) => P.line(pts.map(([z, y]) => [x, y, z]));
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }

  // A shelf's worth of book spines between u0 and u1, standing on a shelf at height 0: [{ u, w, h, col, band }]. Deterministic.
  function bookRow(u0, u1, hMax, seed) {
    const out = []; let u = u0 + 2;
    for (let i = 0; u < u1 - 6; i++) {
      const k = hash(seed * 13.7 + i * 3.1), w = Math.min(7 + k * 9, u1 - 2 - u), h = hMax * (.62 + .36 * hash(seed + i * 5.3));
      if (hash(seed * 2.9 + i) < .07) { u += 10 + k * 8; continue; }                    // a gap where a book is out on loan
      out.push({ u, w, h, col: BOOKS[Math.floor(hash(seed * 7.3 + i * 1.9) * BOOKS.length)], band: hash(i + seed * 4.1) < .5 });
      u += w + .6;
    }
    return out;
  }
  // The same row painted in plane space (u right, y down from the shelf at y).
  function paintBooks(u0, u1, y, hMax, seed, lw) {
    for (const b of bookRow(u0, u1, hMax, seed)) {
      S(rectPts(b.u, y - b.h, b.w, b.h), { fill: b.col, lwPx: lw });
      if (b.band) S(rectPts(b.u, y - b.h * .78, b.w, b.h * .1), { fill: 'rgba(255,240,200,.55)', stroke: null });
    }
  }

  // ---------- desk and table props (sprite-space: world units, y down, origin on the surface they stand on) ----------
  function openBook(t, w, col, ph) {
    // an open book lying flat-ish toward the camera; now and then a page lifts and turns
    S([[-w, -2], [0, 0], [w, -2], [w, -6], [0, -4], [-w, -6]], { fill: col, lwPx: 1 });
    S([[-w + 1, -6], [0, -4], [0, -9], [-w + 1, -11]], { fill: C.paper, lwPx: .9 });
    S([[w - 1, -6], [0, -4], [0, -9], [w - 1, -11]], { fill: C.paper, lwPx: .9 });
    for (let i = 1; i < 4; i++) { line([[-w + 4, -10 + i * 1.3], [-3, -8.6 + i * 1.3]], { stroke: 'rgba(80,80,90,.35)', lwPx: .6 }); line([[3, -8.6 + i * 1.3], [w - 4, -10 + i * 1.3]], { stroke: 'rgba(80,80,90,.35)', lwPx: .6 }); }
    const f = seg(frac(t / 7 + ph), 0, .14);                                               // one page turn every 7 s, staggered
    if (f > 0 && f < 1) { const a = ease(f) * Math.PI, x = Math.cos(a) * (w - 1), y = -9 - Math.sin(a) * w * .55; S([[0, -4], [0, -9], [x, y], [x, y + 5]], { fill: '#FFFFFF', lwPx: .9 }); }
  }
  function bookStack(cols) {
    let y = 0;
    cols.forEach((c, i) => { const w = 26 - i * 2 + (i % 2) * 3, h = 4.5 + (i % 3); S(rectPts(-w / 2 + (i % 2 ? 1.5 : -1.5), y - h, w, h), { fill: c, lwPx: .9 }); S(rectPts(w / 2 - 3 + (i % 2 ? 1.5 : -1.5), y - h + 1, 2, h - 2), { fill: C.paper, stroke: null }); y -= h; });
  }
  function greenLamp(lit) {
    S(ellPts(0, -1.5, 9, 2.6), { fill: C.brass, lwPx: 1 });
    line([[0, -2], [0, -24]], { stroke: C.brassDk, lwPx: 2.2 });
    if (lit > .01) { X.save(); X.globalCompositeOperation = 'lighter'; ellipse(0, -16, 34 * (.6 + lit * .6), 20 * (.6 + lit * .6), { fill: `rgba(255,220,130,${(.22 * lit).toFixed(3)})`, stroke: null }); X.restore(); }
    S([[-16, -22], [16, -22], [12, -31], [-12, -31]], { fill: C.green, lwPx: 1.1 });
    S([[-16, -22], [16, -22], [15, -24], [-15, -24]], { fill: lit > .01 ? '#FFF3C4' : C.greenLt, stroke: null });
    line([[-8, -29], [6, -29]], { stroke: 'rgba(255,255,255,.4)', lwPx: 1.2 });
    line([[6, -22], [6, -14]], { stroke: C.brassDk, lwPx: .8 }); circle(6, -13, 1.2, { fill: C.brass, stroke: null });   // pull chain
  }
  function monitor(screenSide) {
    S(rectPts(-12, -4, 24, 4), { fill: '#3B4048', lwPx: 1 }); S(rectPts(-3, -14, 6, 10), { fill: '#3B4048', lwPx: 1 });
    S(rectPts(-30, -52, 60, 40), { fill: '#3B4048', lwPx: 1.2 });
    if (screenSide) {                                                                     // the catalogue search screen (seen from behind the desk)
      S(rectPts(-27, -49, 54, 34), { fill: '#DCEBFA', stroke: null });
      S(rectPts(-27, -49, 54, 6), { fill: C.blue, stroke: null });
      S(rectPts(-22, -40, 34, 5), { fill: '#FFFFFF', stroke: C.steel, lwPx: .6 });
      for (let i = 0; i < 3; i++) S(rectPts(-22, -31 + i * 5, 40 - i * 8, 2.4), { fill: '#8FA9C8', stroke: null });
    } else S(rectPts(-24, -48, 48, 30), { fill: '#4A5058', stroke: null });
  }
  function stamp() {
    S(rectPts(-12, -3, 24, 3), { fill: C.navy, lwPx: .9 }); S(rectPts(-10, -4, 20, 1.5), { fill: '#6F3A9E', stroke: null });   // ink pad
    S(rectPts(16, -6, 12, 6), { fill: C.woodDk, lwPx: .9 }); S(rectPts(19.5, -14, 5, 8), { fill: C.steelLt, lwPx: .8 }); circle(22, -17, 4, { fill: C.red, lwPx: .9 });
  }
  function pencilCup() {
    [[-3, C.yellow, -.2], [0, C.blue, .05], [3, C.red, .25]].forEach(([dx, c, a]) => { X.save(); X.translate(dx, -10); X.rotate(a); S(rectPts(-1.2, -14, 2.4, 14), { fill: c, lwPx: .7 }); X.restore(); });
    S([[-6, -14], [6, -14], [5, 0], [-5, 0]], { fill: C.teal, lwPx: .9 });
  }
  function deskBell(t, ding) {
    const j = ding * Math.sin(t * 60) * 2.5, up = ding * 3;
    S(ellPts(0, -1.5, 9, 2.5), { fill: '#3B4048', lwPx: .9 });
    X.save(); X.translate(0, -up); X.rotate(j * .04);
    S([[-8, -3], [8, -3], [6, -9], [0, -12], [-6, -9]], { fill: C.brass, lwPx: 1, smooth: true });
    line([[0, -12], [0, -15]], { stroke: C.brassDk, lwPx: 1.6 }); circle(0, -16, 1.6, { fill: C.brassDk, stroke: null });
    X.restore();
    if (ding > .05) for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * .7; line([[Math.cos(a) * 14, -10 + Math.sin(a) * 14], [Math.cos(a) * (14 + 8 * ding), -10 + Math.sin(a) * (14 + 8 * ding)]], { stroke: C.yellow, lwPx: 1.6, cap: 'round' }); }
  }
  function owl(t) {
    // Hoot, the library's plush owl, perched on the card catalog. He blinks.
    const bl = frac(t / 4.3) > .96 || frac(t / 4.3 + .5) > .985;
    S(ellPts(0, -20, 16, 20, 24), { fill: '#9A6E42', lwPx: 1.2 });
    S(ellPts(0, -14, 10, 12, 20), { fill: '#E8D3AE', stroke: null });
    for (let i = 0; i < 3; i++) line([[-5 + i * 5, -12], [-3 + i * 5, -9], [-1 + i * 5, -12]], { stroke: '#B98E59', lwPx: .8 });
    S([[-15, -36], [-12, -46], [-6, -38]], { fill: '#9A6E42', lwPx: 1 }); S([[15, -36], [12, -46], [6, -38]], { fill: '#9A6E42', lwPx: 1 });
    for (const s of [-1, 1]) {
      circle(s * 6.5, -29, 6.5, { fill: '#FFFFFF', lwPx: 1 });
      if (bl) line([[s * 6.5 - 4, -29], [s * 6.5 + 4, -29]], { stroke: C.line, lwPx: 1.4 }); else circle(s * 6.5 + wob(t, .2) * .8, -29, 2.6, { fill: '#2A2E33', stroke: null });
    }
    S([[-2, -24], [2, -24], [0, -20]], { fill: C.orange, lwPx: .8 });
    S([[-10, -38], [10, -38], [7, -42], [-7, -42]], { fill: C.navy, lwPx: .9 }); S(rectPts(-5, -47, 10, 6), { fill: C.navy, lwPx: .9 });   // graduation cap
    line([[5, -46], [11, -40]], { stroke: C.yellow, lwPx: 1.2 });
    for (const s of [-1, 1]) S([[s * 4 - 3, 0], [s * 4 + 3, 0], [s * 4, -3]], { fill: C.orange, lwPx: .7 });
  }
  function plant(t, h, ph) {
    S([[-10, -18], [10, -18], [7.5, 0], [-7.5, 0]], { fill: '#D9774E', lwPx: 1 });
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * .32 + wob(t, .3, ph + i * .1) * .05, l = h * (.65 + .35 * hash(i + ph));
      S([[0, -18], [Math.cos(a - .12) * l * .5, -18 + Math.sin(a - .12) * l * .5], [Math.cos(a) * l, -18 + Math.sin(a) * l], [Math.cos(a + .12) * l * .5, -18 + Math.sin(a + .12) * l * .5]], { fill: i % 2 ? C.tree : C.treeLt, lwPx: .9 });
    }
  }
  function beanbag(col) {
    S([[-34, 0], [-38, -14], [-26, -32], [0, -40], [24, -34], [38, -16], [34, 0]], { fill: col, lwPx: 1.4, smooth: true });
    S([[-16, -26], [6, -32], [20, -22], [0, -18]], { fill: mixCol(col, '#000000', .18), stroke: null, smooth: true });      // the dent
    ellipse(-18, -24, 8, 4, { fill: 'rgba(255,255,255,.35)', stroke: null, rot: -.4 });
  }
  function faceOutBook(w, h, col, i) {
    S(rectPts(-w / 2, -h, w, h), { fill: col, lwPx: 1 });
    S(rectPts(-w / 2 + 3, -h + 4, w - 6, h * .3), { fill: 'rgba(255,255,255,.75)', stroke: null });
    const k = i % 3;
    if (k === 0) circle(0, -h * .35, w * .2, { fill: C.yellow, lwPx: .8 });                // a sun
    if (k === 1) S(starPts(0, -h * .35, w * .22), { fill: '#FFFFFF', lwPx: .8 });         // a star
    if (k === 2) S([[-w * .3, -h * .18], [0, -h * .55], [w * .3, -h * .18]], { fill: C.lime, lwPx: .8 });   // a hill
  }

  // ---------- the shell ----------
  function floor(P, o) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]);
    if (q) S(q, { fill: C.carpet, stroke: null });
    // carpet squares, slightly mottled
    const T = 100;
    for (let i = 0; i < 12; i++) for (let j = 0; j < 14; j++) if ((i + j) % 2) {
      const x0 = -HW + i * T, z0 = j * T, r = P.poly([[x0, 0, z0], [x0 + T, 0, z0], [x0 + T, 0, z0 + T], [x0, 0, z0 + T]]);
      if (r) S(r, { fill: hash(i * 3 + j * 7) < .5 ? C.carpetDk : '#5687A0', stroke: null });
    }
    // the round story rug: rainbow rings
    [C.red, C.orange, C.yellow, C.lime, C.blue, C.purple].forEach((c, i) => { const r = P.floorCircle(RUG.x, RUG.z, RUG.r * (1 - i * .15), .4 + i * .01, 40); if (r) S(r, { fill: c, stroke: i ? null : C.line, lwPx: px(P, 1) }); });
    // sunlight falling on the floor from each window
    const sun = clamp(o.sun ?? 1);
    if (sun > .01) for (const [z0, z1] of WINDOWS) {
      const s = P.poly([[HW, .8, z0], [HW, .8, z1], [HW - 360, .8, z1 - 140], [HW - 360, .8, z0 - 140]]);
      if (s) S(s, { fill: `rgba(255,236,170,${(.28 * sun).toFixed(3)})`, stroke: null });
    }
  }
  function sunbeams(P, o) {
    const sun = clamp(o.sun ?? 1);
    if (sun < .01) return;
    for (const [z0, z1] of WINDOWS) {
      const b = P.poly([[HW, WIN_Y[1], z0], [HW, WIN_Y[1], z1], [HW - 360, 0, z1 - 140], [HW - 360, 0, z0 - 140]]);
      if (b) S(b, { fill: `rgba(255,240,190,${(.1 * sun).toFixed(3)})`, stroke: null });
    }
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]);
    if (q) S(q, { fill: C.ceil, stroke: null });
    for (let z = 100; z < FRONT; z += 120) { const r = P.line([[-HW, CEIL, z], [HW, CEIL, z]]); if (r) line(r, { stroke: C.ceilDk, lwPx: px(P, 1) }); }
    for (let z = 180; z < FRONT - 100; z += 300) for (const x of [-320, 0, 320]) {
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
      if (sd < 0) leftWall(P, x); else for (const [z0, z1] of WINDOWS) wallWindow(P, x, z0, z1, WIN_Y[0], WIN_Y[1], t);
    }
  }
  function wallWindow(P, x, z0, z1, y0, y1, t) {
    const q = wrect(P, x, z0, z1, y0, y1); if (!q) return;
    clipTo(q, () => {
      S(q, { fill: linGrad(0, Math.min(...q.map(v => v[1])), 0, Math.max(...q.map(v => v[1])), [[0, C.sky], [1, C.skyLt]]), stroke: null });
      // the schoolyard outside: trees and hedges, a little parallax for free because they sit beyond the wall
      const xo = x + 500, sw = wob(t, .25) * 6;
      const gr = P.poly([[xo, -400, -800], [xo, -400, 2800], [xo, 70, 2800], [xo, 70, -800]]); if (gr) S(gr, { fill: C.treeLt, stroke: null });
      for (let i = 0; i < 26; i++) {
        const cz = -700 + i * 135 + hash(i + 2) * 50 + (i % 3 === 1 ? sw : 0), cy = 100 + hash(i + 6) * 130, r = 70 + hash(i + 11) * 45, col = [C.treeDk, C.tree, C.treeLt][i % 3];
        const b = P.poly(Array.from({ length: 20 }, (_, i) => { const a = i / 20 * TAU; return [xo, cy + Math.sin(a) * r * .8, cz + Math.cos(a) * r]; }));
        if (b) S(b, { fill: col, stroke: null });
      }
    });
    S(q, { fill: null, stroke: C.frame, lwPx: px(P, 5) });
    for (const l of [wline(P, x, [[(z0 + z1) / 2, y0], [(z0 + z1) / 2, y1]]), wline(P, x, [[z0, y0 + (y1 - y0) * .62], [z1, y0 + (y1 - y0) * .62]])]) if (l) line(l, { stroke: C.frame, lwPx: px(P, 3) });
    const gl = wpoly(P, x, [[z0 + 20, y0 + 40], [z0 + 50, y0 + 40], [z0 + 120, y1 - 20], [z0 + 90, y1 - 20]]); if (gl) S(gl, { fill: 'rgba(255,255,255,.3)', stroke: null });
  }
  function leftWall(P, x) {
    // door at the front, with a small window and a room sign; a READ! pennant above the bookcases
    const d = wrect(P, x, 1130, 1260, 0, 215); if (d) S(d, { fill: C.door, stroke: C.frameDk, lwPx: px(P, 5) });
    const dw = wrect(P, x, 1155, 1200, 120, 190); if (dw) S(dw, { fill: C.skyLt, stroke: C.doorDk, lwPx: px(P, 1.5) });
    const h = wrect(P, x, 1240, 1250, 100, 106); if (h) S(h, { fill: C.steelLt, lwPx: px(P, 1) });
    const sg = wrect(P, x, 1280, 1330, 150, 180); if (sg) S(sg, { fill: C.green, lwPx: px(P, 1) });
    BRIGHT.forEach((c, i) => { const z = 200 + i * 100, f = wpoly(P, x, [[z, 330], [z + 80, 330], [z + 40, 285]]); if (f) S(f, { fill: c, lwPx: px(P, 1) }); });
    const st = wline(P, x, [[170, 334], [1030, 334]]); if (st) line(st, { stroke: C.line, lwPx: px(P, 1.2) });
  }

  // Front wall (Z = 1400): only seen from the desk view.
  function frontWall(P, t, o) {
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null });
      S(rectPts(-HW, -12, 2 * HW, 12), { fill: C.base, stroke: null });
      // BOOK OF THE MONTH cork board
      const x = BOARD.x, y = -BOARD.y;
      S(rectPts(x - 12, y - 38, BOARD.w + 24, BOARD.h + 50), { fill: C.woodDk, lwPx: 1.4 });
      label('BOOK OF THE MONTH', 0, y - 18, 22, C.paper);
      S(rectPts(x, y, BOARD.w, BOARD.h), { fill: C.board, stroke: C.boardDk, lwPx: 1 });
      X.save(); X.beginPath(); X.rect(x, y, BOARD.w, BOARD.h); X.clip();
      for (let i = 0; i < 30; i++) circle(x + BOARD.w * hash(i * 2.1), y + BOARD.h * hash(i * 5.3), 1.4, { fill: C.boardDk, stroke: null });
      X.translate(x, y);
      if (o.board) o.board(t);
      else {
        // a big cover in the middle, two smaller ones and a few pinned "I loved it!" cards
        const cover = (cx, cy, w, h, col, star) => { S(rectPts(cx - w / 2, cy - h / 2, w, h), { fill: col, lwPx: 1.2 }); S(rectPts(cx - w / 2 + 6, cy - h / 2 + 8, w - 12, h * .22), { fill: 'rgba(255,255,255,.8)', stroke: null }); if (star) S(starPts(cx, cy + h * .14, w * .22), { fill: C.yellow, lwPx: 1 }); else circle(cx, cy + h * .14, w * .2, { fill: C.lime, lwPx: 1 }); circle(cx, cy - h / 2 + 3, 3, { fill: C.red, stroke: null }); };
        cover(280, 66, 86, 110, C.purple, true);
        cover(170, 70, 62, 84, C.teal, false); cover(390, 70, 62, 84, C.orange, false);
        [[40, 30, '#FFF3A8'], [80, 86, '#CFEAFF'], [470, 32, '#FFD9E6'], [512, 88, '#DFF5C9']].forEach(([cx, cy, c], i) => {
          S([[cx - 26, cy - 18], [cx + 26, cy - 16], [cx + 25, cy + 18], [cx - 25, cy + 17]], { fill: c, lwPx: .9 });
          for (let r = 0; r < 3; r++) line([[cx - 18, cy - 6 + r * 7], [cx + 16 - r * 6, cy - 6 + r * 7]], { stroke: BRIGHT[(i * 2 + r) % 8], lwPx: 1.4 });
          circle(cx, cy - 15, 2.5, { fill: BRIGHT[(i + 4) % 8], stroke: null });
        });
      }
      X.restore();
      // LIBRARY letter cards across the top
      'LIBRARY'.split('').forEach((ch, i) => {
        const cx = -150 + i * 50, cy = -345 + (i % 2) * 6;
        S(rectPts(cx - 21, cy - 22, 42, 44), { fill: BRIGHT[i % 8], lwPx: 1.2 });
        label(ch, cx, cy + 2, 32, '#FFFFFF');
      });
      clock(230, -345, 26, t);
      // QUIET PLEASE sign (left) and an owl READ poster (right)
      S(rectPts(-470, -300, 150, 70), { fill: '#FFFFFF', stroke: C.blue, lwPx: 3 });
      circle(-445, -265, 18, { fill: C.yellow, lwPx: 1.2 });
      circle(-451, -269, 2, { fill: C.line, stroke: null }); circle(-439, -269, 2, { fill: C.line, stroke: null });
      line([[-445, -262], [-445, -250]], { stroke: C.line, lwPx: 2.4, cap: 'round' });           // finger to the lips: shhh
      label('QUIET', -375, -276, 17, C.blue); label('PLEASE', -375, -255, 15, C.blue);
      S(rectPts(330, -315, 130, 150), { fill: C.navy, lwPx: 1.4 });
      for (let i = 0; i < 10; i++) circle(340 + hash(i) * 110, -305 + hash(i + 7) * 40, 1, { fill: '#FFFFFF', stroke: null });
      X.save(); X.translate(395, -200); X.scale(1.5, 1.5); owl(0); X.restore();
      label('WHOO’S', 395, -298, 15, C.yellow); label('READING?', 395, -180, 15, C.yellow);
    });
  }
  function clock(x, y, r, t) {
    circle(x, y, r, { fill: '#FFFFFF', stroke: C.line, lwPx: 3 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[x + Math.sin(a) * r * .75, y - Math.cos(a) * r * .75], [x + Math.sin(a) * r * .88, y - Math.cos(a) * r * .88]], { stroke: C.line, lwPx: i % 3 ? 1 : 2.2 }); }
    const hand = (a, l, w, col) => line([[x, y], [x + Math.sin(a) * l, y - Math.cos(a) * l]], { stroke: col, lwPx: w, cap: 'round' });
    hand(TAU * (1 / 12 + t / 43200), r * .45, 3.5, C.line); hand(TAU * (25 / 60 + t / 3600), r * .7, 2.4, C.line); hand(TAU * Math.floor(t) / 60, r * .8, 1.2, C.red);
    circle(x, y, 2.5, { fill: C.line, stroke: null });
  }

  // Back wall (Z = 0): only seen from the reading view.
  function backWall(P, t) {
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wallLt, stroke: null });
      S(rectPts(-HW, -12, 2 * HW, 12), { fill: C.base, stroke: null });
      // the mural between the bookcases: a reading tree with a little dragon curled up in it, under a sky of stars
      const m = { x: -160, y: -330, w: 320, h: 318 };
      S(rectPts(m.x, m.y, m.w, m.h), { fill: linGrad(0, m.y, 0, m.y + m.h, [[0, '#BFE3F5'], [.7, '#E8F5E0'], [1, '#CFE8B8']]), stroke: C.woodDk, lwPx: 2 });
      X.save(); X.beginPath(); X.rect(m.x, m.y, m.w, m.h); X.clip();
      S([[-160, -40], [-60, -70], [40, -55], [160, -80], [160, -12], [-160, -12]], { fill: C.lime, stroke: null, smooth: true });
      S([[-14, -12], [-10, -120], [-30, -170], [-4, -140], [6, -180], [12, -135], [36, -160], [16, -110], [18, -12]], { fill: C.woodDk, lwPx: 1.4 });
      [[-60, -190, 62], [0, -225, 70], [60, -185, 58], [-30, -150, 50], [40, -150, 48]].forEach(([cx, cy, r], i) => S(ellPts(cx, cy, r, r * .8, 22, i), { fill: [C.tree, C.treeLt, C.tree, C.treeDk, C.treeLt][i], lwPx: 1.2 }));
      // the dragon, reading on a branch
      S([[24, -160], [64, -168], [80, -150], [60, -140], [28, -144]], { fill: '#7BC67E', lwPx: 1.2, smooth: true });
      circle(78, -164, 11, { fill: '#7BC67E', lwPx: 1.2 }); circle(81, -166, 2, { fill: C.line, stroke: null });
      S([[70, -174], [72, -184], [76, -175]], { fill: C.yellow, lwPx: .8 });
      S([[22, -150], [8, -158], [14, -146]], { fill: '#7BC67E', lwPx: 1 });
      X.save(); X.translate(66, -146); openBook(0, 12, C.red, 0); X.restore();
      // floating letters drifting up out of the book
      for (let i = 0; i < 5; i++) { const ph = frac(t * .08 + i / 5); readable(P, 66 + Math.sin(ph * 6 + i) * 18, -160 - ph * 120, () => { X.globalAlpha = Math.sin(ph * Math.PI); label('ABCabc'[i], 0, 0, 16, BRIGHT[i % 8]); X.globalAlpha = 1; }); }
      X.restore();
      S(rectPts(-150, -322, 300, 40), { fill: C.paper, lwPx: 1.2 });
      readable(P, 0, -311, () => label('READING IS AN', 0, 0, 15, C.navy));
      readable(P, 0, -292, () => label('ADVENTURE!', 0, 0, 19, C.red));
      // section signs above the bookcases
      S(rectPts(-470, -345, 200, 36), { fill: C.purple, lwPx: 1.2 }); readable(P, -370, -327, () => label('STORY CORNER', 0, 1, 18, '#FFFFFF'));
      S(rectPts(270, -345, 200, 36), { fill: C.teal, lwPx: 1.2 }); readable(P, 370, -327, () => label('FICTION A–Z', 0, 1, 18, '#FFFFFF'));
    });
  }

  // ---------- depth-sorted pieces ----------
  // A tall bookcase against the back wall; books on five shelves.
  function backShelf(P, [x0, x1], seed) {
    const s = BSHELF;
    box(P, x0, x1, 0, s.h, BACK, s.z1, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.woodLt });
    if (P.cam.z <= s.z1) return;
    P.plane(s.z1, () => {
      S(rectPts(x0 + 8, -s.h + 8, x1 - x0 - 16, s.h - 16), { fill: C.woodXd, stroke: null });
      for (let r = 0; r < 5; r++) {
        const y = -s.h + 8 + (r + 1) * 49;
        paintBooks(x0 + 10, x1 - 10, y - 4, 40, seed + r * 11, px(P, .7));
        S(rectPts(x0 + 8, y - 4, x1 - x0 - 16, 6), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
      }
    });
  }
  // The bookcases along the left wall: one long run, four shelves of spines facing the room.
  function leftShelf(P) {
    const s = LSHELF, x0 = -HW, x1 = -HW + s.d;
    box(P, x0, x1, 0, s.h, s.z0, s.z1, { nz: C.woodDk, pz: C.woodDk, side: C.wood, top: C.woodLt }, { skip: 'side' });
    if (P.cam.x <= x1) return;
    const q = wrect(P, x1, s.z0, s.z1, 0, s.h); if (q) S(q, { fill: C.wood, lwPx: px(P, 1.2) });
    const inner = wrect(P, x1, s.z0 + 8, s.z1 - 8, 8, s.h - 8); if (inner) S(inner, { fill: C.woodXd, stroke: null });
    for (let r = 0; r < 5; r++) {
      const yb = 8 + r * 46.4;
      for (const b of bookRow(s.z0 + 10, s.z1 - 10, 38, 300 + r * 17)) { const k = wrect(P, x1, b.u, b.u + b.w, yb + 4, yb + 4 + b.h); if (k) S(k, { fill: b.col, lwPx: px(P, .6) }); }
      const sh = wrect(P, x1, s.z0 + 8, s.z1 - 8, yb, yb + 5); if (sh) S(sh, { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
    }
    for (let z = s.z0 + 220; z < s.z1 - 50; z += 220) { const u = wrect(P, x1, z - 4, z + 4, 0, s.h); if (u) S(u, { fill: C.wood, stroke: C.woodDk, lwPx: px(P, .8) }); }
  }
  // Low shelves under the windows: two shelves of picture books, a window-seat top with cushions.
  function windowShelf(P, t) {
    const s = RSHELF, x0 = HW - s.d, x1 = HW;
    box(P, x0, x1, 0, s.h, s.z0, s.z1, { nz: C.oakDk, pz: C.oakDk, side: C.oak, top: C.oak }, { skip: 'side' });
    if (P.cam.x >= x0) return;
    const q = wrect(P, x0, s.z0, s.z1, 0, s.h); if (q) S(q, { fill: C.oak, lwPx: px(P, 1.2) });
    const inner = wrect(P, x0, s.z0 + 6, s.z1 - 6, 6, s.h - 8); if (inner) S(inner, { fill: C.woodDk, stroke: null });
    for (let r = 0; r < 2; r++) {
      const yb = 6 + r * 45;
      for (const b of bookRow(s.z0 + 8, s.z1 - 8, 36, 500 + r * 23)) { const k = wrect(P, x0, b.u, b.u + b.w, yb + 4, yb + 4 + b.h); if (k) S(k, { fill: b.col, lwPx: px(P, .6) }); }
      const sh = wrect(P, x0, s.z0 + 6, s.z1 - 6, yb, yb + 5); if (sh) S(sh, { fill: C.oak, stroke: C.oakDk, lwPx: px(P, .8) });
    }
    const top = P.poly([[x0 - 4, s.h, s.z0 - 4], [x1, s.h, s.z0 - 4], [x1, s.h, s.z1 + 4], [x0 - 4, s.h, s.z1 + 4]]); if (top) S(top, { fill: C.oak, lwPx: px(P, 1) });
    WINDOWS.forEach(([z0, z1], i) => box(P, x0 + 4, x1 - 2, s.h, s.h + 12, z0 + 10, z1 - 10, BRIGHT[[1, 4, 6][i]], { lwPx: px(P, 1) }));   // cushions
  }
  // Reading table: oak top on four legs, a green lamp in the middle and books lying open.
  function readingTable(P, t, n, [a, b], o) {
    const zf = tableFront(n), zb = zf - TABLE_D, L = 12;
    for (const lx of [a + 14, b - 14 - L]) for (const lz of [zb + 12, zf - 12 - L]) box(P, lx, lx + L, 0, TABLE_H - 7, lz, lz + L, { nz: C.oakDk, pz: C.oakDk, side: C.woodDk, top: C.oak }, { lwPx: px(P, .9) });
    box(P, a + 14, b - 14, TABLE_H - 16, TABLE_H - 7, zb + 12, zf - 12, { nz: C.oakDk, pz: C.oakDk, side: C.oakDk, top: C.oak }, { lwPx: px(P, .9) });   // apron
    box(P, a, b, TABLE_H - 7, TABLE_H, zb, zf, { nz: C.oakDk, pz: C.oakDk, side: C.woodDk, top: C.oak });
    const y = TABLE_H, zm = zb + TABLE_D / 2, side = a < 0 ? 0 : 1, k = (n - 1) * 2 + side;
    const aisle = a < 0 ? b - 36 : a + 36, outer = a < 0 ? a + 60 : b - 60, mid = (a + b) / 2;   // the lamp stands at the aisle end, clear of a reader at the middle
    sprite(P, aisle, y, zm, () => greenLamp(clamp(o.lamps ?? .5)));
    sprite(P, outer, y, zm - 18, () => k % 2 ? bookStack([BOOKS[k + 1], BOOKS[k + 4], BOOKS[k + 7]]) : openBook(t, 16, BOOKS[(k * 5 + 2) % 12], k * .27 + .5));
    sprite(P, mid, y, zm, () => openBook(t, 18, BOOKS[(k * 3) % 12], k * .27));
  }
  // A school chair: four legs, a coloured plastic seat, a backrest on the side away from the table (back = ±1 in Z).
  function chair(P, x, z, back, col) {
    const w = 18, h = 40, bz = z + back * 16, parts = [
      { d: P.depth(bz), fn: () => { box(P, x - w, x + w, h + 8, h + 34, bz - 2, bz + 2, col, { lwPx: px(P, 1) }); for (const sx of [-w + 3, w - 3]) { const l = P.line([[x + sx, h, bz], [x + sx, h + 10, bz]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 2) }); } } },
      { d: P.depth(z), fn: () => {
        for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l = P.line([[x + dx * (w - 3), 0, z + dz * 14], [x + dx * (w - 3), h, z + dz * 14]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 2.2) }); }
        box(P, x - w, x + w, h, h + 5, z - 16, z + 16, col, { lwPx: px(P, 1) });
      } },
    ];
    parts.sort((p, q) => q.d - p.d).forEach(p => p.fn());
  }
  function desk(P, t, o) {
    const D = DESK;
    box(P, D.x0, D.x1, 0, D.h - 7, D.z0 + 4, D.z1, { nz: C.wood, pz: C.woodDk, side: C.woodDk, top: C.wood });
    if (P.cam.z < D.z0) P.plane(D.z0 + 4, () => {                                         // front panel toward the readers
      for (let i = 0; i < 5; i++) S(rectPts(D.x0 + 14 + i * 108, -D.h + 22, 100, D.h - 34), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, 1) });
      S(rectPts(-110, -D.h + 30, 220, 34), { fill: C.green, stroke: C.paper, lwPx: px(P, 2) });
      label('CHECK OUT HERE', 0, -D.h + 47, 19, C.paper);
      S(rectPts(150, -D.h + 34, 100, 30), { fill: C.navy, lwPx: px(P, 1) });                // book return slot
      S(rectPts(160, -D.h + 50, 80, 6), { fill: '#141820', stroke: null });
      label('RETURNS', 200, -D.h + 42, 11, C.paper);
    });
    if (P.cam.z > D.z1) P.plane(D.z1, () => {                                              // drawers on the librarian's side
      for (let i = 0; i < 4; i++) { const x = D.x0 + 20 + i * 132; S(rectPts(x, -D.h + 16, 120, 30), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, 1) }); S(rectPts(x + 50, -D.h + 29, 20, 4), { fill: C.brass, stroke: null }); }
    });
    box(P, D.x0 - 8, D.x1 + 8, D.h - 7, D.h, D.z0, D.z1 + 6, { nz: C.woodDk, pz: C.woodDk, side: C.woodDk, top: C.woodLt });
    const y = D.h, zm = (D.z0 + D.z1) / 2;
    sprite(P, -170, y, zm + 10, () => monitor(P.dir < 0));
    sprite(P, -70, y, zm - 10, () => pencilCup());
    sprite(P, 40, y, zm - 6, () => stamp());
    sprite(P, 140, y, zm, () => bookStack([C.red, C.teal, C.yellow, C.purple, C.blue]));
    sprite(P, 225, y, zm - 12, () => deskBell(t, clamp(o.ding || 0)));
  }
  function cardCatalog(P, t) {
    const c = CAT;
    box(P, c.x0, c.x1, 0, c.h, c.z0, FRONT, { nz: C.oak, pz: C.oak, side: C.oakDk, top: C.oak });
    if (P.cam.z < c.z0) P.plane(c.z0, () => {
      for (let r = 0; r < 5; r++) for (let i = 0; i < 4; i++) {
        const x = c.x0 + 8 + i * 34.5, y = -c.h + 8 + r * 24;
        S(rectPts(x, y, 31, 21), { fill: C.woodLt, stroke: C.oakDk, lwPx: px(P, .8) });
        S(rectPts(x + 9, y + 4, 13, 5), { fill: C.paper, stroke: null }); S(rectPts(x + 12, y + 12, 7, 3), { fill: C.brass, stroke: null });
      }
    });
    sprite(P, (c.x0 + c.x1) / 2 - 30, c.h, (c.z0 + FRONT) / 2, () => owl(t));
    sprite(P, (c.x0 + c.x1) / 2 + 40, c.h, (c.z0 + FRONT) / 2, () => plant(t, 38, 1.1));
  }
  function newBooks(P, t) {
    const n = NEWB;
    box(P, n.x0, n.x1, 0, n.h, n.z0, FRONT, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.woodLt });
    if (P.cam.z >= n.z0) return;
    P.plane(n.z0, () => {
      S(rectPts(n.x0 + 8, -n.h + 8, n.x1 - n.x0 - 16, n.h - 16), { fill: C.woodXd, stroke: null });
      S(rectPts(n.x0 + 16, -n.h + 14, n.x1 - n.x0 - 32, 26), { fill: C.red, lwPx: px(P, 1) });
      label('NEW BOOKS!', (n.x0 + n.x1) / 2, -n.h + 28, 16, '#FFFFFF');
      for (let r = 0; r < 3; r++) {
        const y = -n.h + 50 + r * 50 + 44;
        S(rectPts(n.x0 + 8, y, n.x1 - n.x0 - 16, 5), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
        for (let i = 0; i < 3; i++) { X.save(); X.translate(n.x0 + 38 + i * 48, y); X.rotate((i - 1) * .04); faceOutBook(34, 42, BRIGHT[(r * 3 + i + 2) % 8], r + i); X.restore(); }
      }
    });
  }
  function bookCart(P) {
    const c = CART, wh = 14;
    for (const x of [c.x0 + 8, c.x1 - 8]) for (const z of [c.z0 + 6, c.z1 - 6]) sprite(P, x, 0, z, () => { circle(0, -5, 5, { fill: '#2A2E33', lwPx: .8 }); circle(0, -5, 1.6, { fill: C.steelLt, stroke: null }); });
    for (const [y0, y1] of [[wh, wh + 6], [wh + 50, wh + 56]]) box(P, c.x0, c.x1, y0, y1, c.z0, c.z1, { nz: C.red, pz: C.red, side: '#B8433B', top: '#EC7A70' }, { lwPx: px(P, 1) });
    for (const x of [c.x0, c.x1 - 4]) for (const z of [c.z0, c.z1 - 4]) box(P, x, x + 4, wh, wh + 100, z, z + 4, C.steel, { lwPx: px(P, .7) });
    // books standing on each level, spines toward whichever end the camera is at
    for (const [yb, seed] of [[wh + 6, 70], [wh + 56, 90]]) {
      const zf = P.cam.z < c.z0 ? c.z0 + 6 : c.z1 - 6;
      for (const b of bookRow(c.x0 + 4, c.x1 - 4, 34, seed)) { const q = P.poly([[b.u, yb, zf], [b.u + b.w, yb, zf], [b.u + b.w, yb + b.h, zf], [b.u, yb + b.h, zf]]); if (q) S(q, { fill: b.col, lwPx: px(P, .6) }); }
    }
    const hd = P.line([[c.x1 - 2, wh + 100, c.z0 + 2], [c.x1 - 2, wh + 100, c.z1 - 2]]); if (hd) line(hd, { stroke: C.steelDk, lwPx: px(P, 3) });
  }
  function pictureBins(P) {
    const b = BINS;
    box(P, b.x0, b.x1, 0, b.h, b.z0, b.z1, { nz: C.yellow, pz: C.yellow, side: '#D9B22A', top: '#F8DD70' });
    if (P.cam.z > b.z1) P.plane(b.z1, () => { for (let i = 0; i < 3; i++) S(rectPts(b.x0 + 10 + i * 96, -b.h + 10, 88, b.h - 20), { fill: BRIGHT[[0, 4, 3][i]], stroke: '#B8902A', lwPx: px(P, 1) }); });
    for (let i = 0; i < 6; i++) sprite(P, b.x0 + 28 + i * 49, b.h, (b.z0 + b.z1) / 2, () => { X.rotate((hash(i + 3) - .5) * .25); faceOutBook(40, 50 + hash(i) * 10, BRIGHT[(i * 3) % 8], i); });
  }
  // Paper bunting strung across the room under the ceiling; each flag sways on its own.
  function bunting(P, t, z, ph) {
    const n = 16, pts = [];
    for (let i = 0; i <= n; i++) { const x = -HW + i * (2 * HW / n), sag = Math.sin(i / n * Math.PI) * 40; pts.push([x, CEIL - 20 - sag, z]); }
    const st = P.line(pts); if (st) line(st, { stroke: C.line, lwPx: px(P, 1) });
    for (let i = 0; i < n; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], sw = wob(t, .4, ph + i * .13) * 10;
      const f = P.poly([[ax + 6, ay, z], [bx - 6, by, z], [(ax + bx) / 2, (ay + by) / 2 - 34, z + sw]]); if (f) S(f, { fill: BRIGHT[i % 8], lwPx: px(P, .8) });
    }
  }
  // Dust motes drifting in the sunbeams.
  function motes(P, t, z0, z1, sun) {
    for (let i = 0; i < 9; i++) {
      const ph = frac(t * (.03 + .02 * hash(i + z0)) + hash(i * 2.7 + z0)), f = hash(i * 4.1 + z0);
      const y = lerp(10, WIN_Y[1] - 20, frac(ph + f)), x = HW - (WIN_Y[1] - y) / WIN_Y[1] * 360 * (.3 + .7 * f) - 20, z = lerp(z0, z1, hash(i * 1.3 + z0)) - (WIN_Y[1] - y) / WIN_Y[1] * 140 + wob(t, .2, i) * 12;
      sprite(P, x, y, z, () => circle(0, 0, 1.6, { fill: `rgba(255,250,220,${(.75 * sun * Math.sin(frac(ph + f) * Math.PI)).toFixed(3)})`, stroke: null }));
    }
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the room.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri }), sun = clamp(o.sun ?? 1);
    for (let n = 1; n <= ROWS; n++) {
      const zf = tableFront(n), zb = zf - TABLE_D;
      for (const tb of TABLES) {
        add(zb, zf, () => readingTable(P, t, n, tb, o), 1);
        const cx = (tb[0] + tb[1]) / 2;
        [[-75, zb - 70, -1], [75, zb - 70, -1], [-75, zf + 70, 1], [75, zf + 70, 1]].forEach(([dx, z, bk], i) => add(z - 18, z + 18, () => chair(P, cx + dx, z, bk, BRIGHT[(n * 3 + i + (tb[0] < 0 ? 0 : 4)) % 8]), 0));
      }
    }
    add(DESK.z0, DESK.z1, () => desk(P, t, o), 1);
    add(CAT.z0, FRONT, () => cardCatalog(P, t), 0);
    add(NEWB.z0, FRONT, () => newBooks(P, t), 0);
    add(CART.z0, CART.z1, () => bookCart(P), 0);
    for (const [i, sx] of BSHELF.x.entries()) add(BACK, BSHELF.z1, () => backShelf(P, sx, 40 + i * 60), 0);
    add(LSHELF.z0, LSHELF.z1, () => leftShelf(P), -1);
    add(RSHELF.z0, RSHELF.z1, () => windowShelf(P, t), -1);
    add(BINS.z0, BINS.z1, () => pictureBins(P), 0);
    [[-430, 200, C.red], [-250, 170, C.blue], [-350, 360, C.lime]].forEach(([x, z, c]) => add(z, z, () => sprite(P, x, 0, z, () => beanbag(c)), 0));
    add(1180, 1190, () => sprite(P, -540, 0, 1185, () => { X.scale(1.4, 1.4); plant(t, 70, 2.3); }), 0);
    for (const [z, ph] of [[420, 0], [820, .5]]) add(z, z, () => bunting(P, t, z, ph), 2);
    if (sun > .01) for (const [z0, z1] of WINDOWS) add(z0 - 140, z1, () => motes(P, t, z0, z1, sun), 2);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 1240 }, HW, BACK, FRONT, CEIL, FIRST, ROWS, ROW_D, TABLE_H, BOARD, DESK, CAT, NEWB, CART,
    tableFront,
    table: (n, x = 0, side = -1) => ({ x, y: 0, z: side < 0 ? tableFront(n) - TABLE_D - 30 : tableFront(n) + 30 }),
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P, o); ceiling(P); sideWalls(P, t); backWall(P, t); frontWall(P, t, o); sunbeams(P, o);
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
// Desk cameras look toward the circulation desk (dir 1); reading-room cameras stand by the desk and look back (dir: -1).
LOCATIONS.school_library = Object.assign(schoolLibrary, {
  spots: {
    'Circulation desk (librarian)': { x: 0, y: 0, z: 1240 },
    'In front of the desk': { x: 0, y: 0, z: 1010 },
    'By the card catalog': { x: -380, y: 0, z: 1260 },
    'By the book cart': { x: 330, y: 0, z: 1180 },
    'Table 1 · left': schoolLibrary.table(1, -300),
    'Table 1 · right': schoolLibrary.table(1, 300),
    'Table 2 · left': schoolLibrary.table(2, -300),
    'Table 2 · right': schoolLibrary.table(2, 300),
    'Table 1 · left (desk side)': schoolLibrary.table(1, -300, 1),
    'Table 1 · right (desk side)': schoolLibrary.table(1, 300, 1),
    'Center aisle': { x: 0, y: 0, z: 700 },
    'Story corner': { x: -330, y: 0, z: 280 },
    'Picture-book bins': { x: 320, y: 0, z: 320 },
    'By the windows': { x: 470, y: 0, z: 650 },
    'By the bookcases': { x: -470, y: 0, z: 640 },
    'Doorway': { x: -500, y: 0, z: 1195 },
  },
  cameras: {
    'Desk · wide from the back': { x: 0, y: 170, z: 40, f: 700, hy: 560, dir: 1 },
    'Desk · medium': { x: 0, y: 140, z: 880, f: 1000, hy: 560, dir: 1 },
    'Desk · close': { x: 0, y: 135, z: 1010, f: 1100, hy: 600, dir: 1 },
    'Desk · board': { x: 0, y: 170, z: 760, f: 900, hy: 700, dir: 1 },
    'Desk · card catalog': { x: -400, y: 130, z: 980, f: 1000, hy: 600, dir: 1 },
    'Desk · new books': { x: 380, y: 140, z: 960, f: 1000, hy: 600, dir: 1 },
    'Tables · bookcase side': { x: -350, y: 150, z: 350, f: 900, hy: 560, dir: 1 },
    'Reading room · from the desk': { x: 0, y: 180, z: 1370, f: 700, hy: 520, dir: -1 },
    'Reading room · table 1 left': { x: -300, y: 125, z: 1050, f: 1000, hy: 600, dir: -1 },
    'Reading room · table 1 right': { x: 300, y: 125, z: 1050, f: 1000, hy: 600, dir: -1 },
    'Reading room · over the tables': { x: 0, y: 200, z: 1000, f: 1000, hy: 470, dir: -1 },
    'Reading room · story corner': { x: -200, y: 175, z: 560, f: 800, hy: 470, dir: -1 },
    'Reading room · picture books': { x: 200, y: 165, z: 560, f: 800, hy: 500, dir: -1 },
    'Reading room · mural': { x: 0, y: 170, z: 620, f: 900, hy: 600, dir: -1 },
    'Reading room · window seat': { x: 220, y: 140, z: 1080, f: 900, hy: 570, dir: -1 },
  },
});
