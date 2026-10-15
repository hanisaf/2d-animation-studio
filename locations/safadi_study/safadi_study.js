// locations/safadi_study/safadi_study.js: Professor Safadi's study at home (see README.md).
//
// A 3D interior in one-point perspective (engine/persp.js), built like the science room to be shot from BOTH ends:
//   desk view      cameras with dir: 1 (the default) stand by the fire and look toward +Z: the big partners desk (lamp, laptop,
//                  Newton's cradle, a mug of tea), the chalkboard full of primes, diplomas, the grandfather clock.
//   fireside view  cameras with dir: -1 stand behind the desk and look back toward −Z: the fireplace and its mantel, the
//                  two leather armchairs and the chess table, the rug, the bookcases and the rolling library ladder.
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   safadiStudy.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   safadiStudy.front(P, t, o)   pieces nearer than o.splitZ (desk, chairs, globe…). Call after the characters.
//                                With o.toZ it stops at that depth, for several characters at different depths (far → near).
// o: { splitZ, toZ, fire: 0..1 (the fireplace; default 1, 0 = cold hearth), lamp: 0..1 (desk lamp + pendant glow; default .6),
//      night: 0..1 (the window goes from afternoon to a starry night; default 0), cradle: Newton's cradle swings (default true),
//      board(t): draw your own chalkboard content. Local coords: origin at the board's top-left, world units, y down;
//      the board is safadiStudy.BOARD.w × BOARD.h (500 × 160) and the content is clipped to it. }
//
// Layout (world): side walls X = ±450, back wall Z = 0, front wall Z = 1100, ceiling Y = 340. Wainscot panelling up to Y 110.
// Desk X ±220, Z 760–860, top Y 78; desk chair behind it (Z 985–1050). Chalkboard X ±250, Y 130…290 on the front wall.
// Grandfather clock X −435…−345 against the front wall. Fireplace X ±150 on the back wall, mantel at Y 150.
// Armchairs at X ±230, Z 215–305, facing each other across a chess table at (0, 270). Rug X ±300, Z 230–700.
// Left wall: bookcases Z 150–950 with a ladder. Right wall: a curtained window (Z 380–760) and the door (Z 860–990).

const safadiStudy = (() => {
  const HW = 450, BACK = 0, FRONT = 1100, CEIL = 340, WAIN = 110;
  const DESK = { x0: -220, x1: 220, z0: 760, z1: 860, h: 78 };
  const BOARD = { x: -250, y: 290, w: 500, h: 160 };                                     // y = top edge (world Y)
  const CLOCK = { x0: -435, x1: -345, z0: 1045, h: 240 }, CHAIR = { x0: -45, x1: 45, z0: 985, z1: 1050 };
  const FIRE = { x0: -150, x1: 150, z1: 40, h: 150 }, MANTEL = { x0: -175, x1: 175, y: 150, z1: 58 };
  const BCASE = { x: [[-440, -190], [190, 440]], z1: 38, h: 280 }, LSHELF = { z0: 150, z1: 950, d: 45, h: 320 };
  const ARM = { x: 230, z0: 215, z1: 305 }, RUG = { x0: -300, x1: 300, z0: 230, z1: 700 }, GLOBE = { x: -320, z: 690 };
  const WIN = { z0: 380, z1: 760, y0: 110, y1: 300 }, DOOR = { z0: 860, z1: 990 }, LADDER = { z: 560 };
  const C = {
    wall: '#3E6B5A', wallDk: '#2F5547', wallLt: '#4D7D6A', pan: '#7A4A2A', panLt: '#94603A', panDk: '#5C3620',
    ceil: '#EDE4D2', ceilDk: '#D3C7AE', beam: '#6E4325', floor: '#8A5530', floorLt: '#A06540', floorDk: '#6E4024',
    wood: '#8B5631', woodDk: '#663C1F', woodLt: '#A86C40', woodXd: '#3E2412', leather: '#8E2F27', leatherDk: '#6C211B', leatherLt: '#AE4A3E',
    rug: '#9C2F2F', rugDk: '#6E1F24', rugNavy: '#24365E', rugGold: '#D9A845', rugCream: '#EFD9AE',
    brass: '#D4A64A', brassDk: '#A87E2C', brassLt: '#F0CF7A', stone: '#B9AE9C', stoneDk: '#948873', soot: '#231A16',
    chalk: '#FFFDF4', board: '#23433A', boardDk: '#183129', paper: '#FFFDF6', steel: '#7C858D', steelLt: '#A9B2BA',
    sky: '#8CC8EC', skyLt: '#DDF0FA', nightSky: '#14193A', nightLt: '#2D3770', tree: '#6DAE4B', treeDk: '#4F8C38', treeLt: '#94C962',
    curtain: '#7E1F2C', curtainDk: '#5E1520', glow: '#7FE3FF', gold: '#FFD66B',
    red: '#E0584E', orange: '#F29A3A', yellow: '#F4CD3A', blue: '#4C8FD8', purple: '#9A6AD0', teal: '#3FB3A8', lime: '#8CCB5A',
    line: '#3B2530',
  };
  const BOOKS = ['#7E1F2C', '#24365E', '#2F5547', '#8A5530', '#C69A3E', '#5A3A6E', '#9C4A2A', '#3A5E7E', '#6E6A2A', '#B5563F', '#2E2A26', '#A7853F'];
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.3, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 5);

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
  // A camera-facing cut-out at a world point, drawn in world units with y pointing down (props on the desk and mantel…).
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  // Text and pictures on a reverse-angle plane would read mirrored: draw them through this.
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const label = (txt, x, y, size, col, font = FONT_TALK, weight = 700) => { X.font = `${weight} ${size}px ${font}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  // A flat shape on a side wall (the plane X = x), given as [z, y] points.
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const wline = (P, x, pts) => P.line(pts.map(([z, y]) => [x, y, z]));
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  function glowAt(x, y, rx, ry, col, a) { if (a < .01) return; X.save(); X.globalCompositeOperation = 'lighter'; ellipse(x, y, rx, ry, { fill: radGrad(x, y, 0, Math.max(rx, ry), [[0, rgba(col, a)], [1, rgba(col, 0)]]), stroke: null }); X.restore(); }

  // A shelf's worth of book spines between u0 and u1: [{ u, w, h, col, band }]. Deterministic.
  function bookRow(u0, u1, hMax, seed) {
    const out = []; let u = u0 + 2;
    for (let i = 0; u < u1 - 6; i++) {
      const k = hash(seed * 13.7 + i * 3.1), w = Math.min(7 + k * 10, u1 - 2 - u), h = hMax * (.66 + .32 * hash(seed + i * 5.3));
      if (hash(seed * 2.9 + i) < .06) { u += 14 + k * 10; continue; }
      out.push({ u, w, h, col: BOOKS[Math.floor(hash(seed * 7.3 + i * 1.9) * BOOKS.length)], band: hash(i + seed * 4.1) < .6 });
      u += w + .6;
    }
    return out;
  }
  function paintBooks(u0, u1, y, hMax, seed, lw) {
    for (const b of bookRow(u0, u1, hMax, seed)) {
      S(rectPts(b.u, y - b.h, b.w, b.h), { fill: b.col, lwPx: lw });
      if (b.band) for (const f of [.15, .8]) S(rectPts(b.u, y - b.h * f - 1, b.w, 2), { fill: C.brassLt, stroke: null, alpha: .8 });   // gilt bands
    }
  }

  // ---------- props (sprite-space: world units, y down, origin on the surface they stand on) ----------
  function deskLamp(lit) {
    S(ellPts(0, -2, 11, 3), { fill: C.brass, lwPx: 1 });
    line([[0, -3], [0, -40]], { stroke: C.brassDk, lwPx: 2.6 });
    glowAt(0, -38, 50, 34, '#FFD98A', .35 * lit);
    S([[-16, -34], [16, -34], [10, -56], [-10, -56]], { fill: lit > .05 ? '#FFF1C8' : '#EADBB8', lwPx: 1.2 });
    for (let i = -2; i <= 2; i++) line([[i * 6, -34], [i * 4, -56]], { stroke: 'rgba(160,120,70,.35)', lwPx: .7 });
    S(ellPts(0, -34, 16, 2.5), { fill: lit > .05 ? '#FFE9A8' : '#D9C49A', lwPx: .9 });
  }
  function laptop(screenSide) {
    S([[-30, 0], [30, 0], [27, -4], [-27, -4]], { fill: '#B9BEC4', lwPx: 1 });
    S(rectPts(-28, -40, 56, 36), { fill: '#C9CED4', lwPx: 1.1 });
    if (screenSide) {                                                                    // seen from behind the desk: tonight's slides
      S(rectPts(-25, -37, 50, 30), { fill: '#1E2A44', stroke: null });
      label('PRIMES', 0, -32, 6, C.gold);
      line([[-20, -11], [-12, -14], [-4, -16], [4, -22], [12, -24], [20, -30]], { stroke: C.glow, lwPx: 1.2 });
    } else {                                                                             // the lid, with a light-bulb sticker
      circle(0, -24, 5, { fill: C.gold, lwPx: .8 }); S(rectPts(-2.5, -19, 5, 4), { fill: C.steelLt, lwPx: .6 });
    }
  }
  function mug(t, steamy) {
    S([[-8, -18], [8, -18], [7, 0], [-7, 0]], { fill: C.paper, lwPx: 1.1 });
    S(ellPts(11, -10, 4, 5), { fill: null, stroke: C.line, lwPx: 1.6 });
    label('?!', 0, -9, 8, C.red);
    if (steamy) for (let i = 0; i < 3; i++) { const ph = frac(t * .45 + i / 3); circle(Math.sin(ph * 6 + i) * 4, -20 - ph * 26, 2.5 + ph * 4, { fill: `rgba(255,255,255,${(.45 * (1 - ph)).toFixed(3)})`, stroke: null }); }
  }
  function newtonsCradle(t, on) {
    const A = .55, w = Math.sin(t * TAU / 1.1), aR = on ? A * Math.max(0, w) : 0, aL = on ? -A * Math.max(0, -w) : 0;
    S(rectPts(-24, -3, 48, 3), { fill: C.woodDk, lwPx: .9 });
    for (const sx of [-21, 21]) line([[sx, -3], [sx, -34]], { stroke: C.steel, lwPx: 1.6 });
    line([[-21, -34], [21, -34]], { stroke: C.steel, lwPx: 1.6 });
    for (let i = 0; i < 5; i++) {
      const x = -8 + i * 4, a = i === 0 ? aL : i === 4 ? aR : 0, bx = x + Math.sin(a) * 22, by = -34 + Math.cos(a) * 22;
      line([[x, -34], [bx, by]], { stroke: 'rgba(80,80,90,.7)', lwPx: .6 });
      circle(bx, by + 2, 2, { fill: C.steelLt, lwPx: .7 });
    }
  }
  function paperStack() {
    for (let i = 0; i < 4; i++) S(rectPts(-18 + i * .8, -2 - i * 1.6, 36, 1.6), { fill: i % 2 ? '#F3EEDF' : C.paper, lwPx: .6 });
    line([[-12, -9], [14, -10]], { stroke: C.red, lwPx: 1.4 });                           // a red pen on top
  }
  function penCup() {
    [[-3, C.line, -.15], [1, C.red, .1], [4, C.brass, .3]].forEach(([dx, c, a]) => { X.save(); X.translate(dx, -10); X.rotate(a); S(rectPts(-1, -13, 2, 13), { fill: c, lwPx: .6 }); X.restore(); });
    S([[-6, -14], [6, -14], [6, 0], [-6, 0]], { fill: C.woodDk, lwPx: .9 });
  }
  function bookPile(cols) {
    let y = 0;
    cols.forEach((c, i) => { const w = 30 - i * 3, h = 5 + (i % 2); S(rectPts(-w / 2 + (i % 2 ? 2 : -1), y - h, w, h), { fill: c, lwPx: .9 }); S(rectPts(w / 2 - 3 + (i % 2 ? 2 : -1), y - h + 1, 2, h - 2), { fill: C.rugCream, stroke: null }); y -= h; });
  }
  function candle(t, lit, ph) {
    S(ellPts(0, -1, 6, 2), { fill: C.brass, lwPx: .8 }); S(rectPts(-1.6, -14, 3.2, 13), { fill: C.brassDk, lwPx: .7 });
    S(rectPts(-2.5, -30, 5, 16), { fill: '#F7F0DC', lwPx: .8 });
    if (lit > .01) { const f = 1 + .15 * wob(t, 5.3, ph); glowAt(0, -35, 14, 14, '#FFC860', .5 * lit); S([[-2, -30], [0, -30 - 8 * f], [2, -30]], { fill: C.orange, stroke: null, smooth: true }); }
  }
  function photoFrame(w, h, scene) {
    S(rectPts(-w / 2, -h, w, h), { fill: C.brass, lwPx: 1 });
    S(rectPts(-w / 2 + 3, -h + 3, w - 6, h - 6), { fill: scene ? '#BFE3F5' : '#F5E6C8', stroke: null });
    if (scene) { S([[-w / 2 + 3, -6], [0, -h * .45], [w / 2 - 3, -6]], { fill: C.lime, stroke: null }); circle(w * .2, -h * .7, 3, { fill: C.yellow, stroke: null }); }
    else { circle(-4, -h * .55, 4, { fill: '#F3C6A8', stroke: null }); circle(5, -h * .5, 3.2, { fill: '#F3C6A8', stroke: null }); S(rectPts(-9, -h * .4, 18, h * .32), { fill: '#D4B68C', stroke: null }); }
  }
  function trophy() {
    S(rectPts(-8, -6, 16, 6), { fill: C.woodDk, lwPx: .8 }); S(rectPts(-2, -14, 4, 8), { fill: C.brass, lwPx: .7 });
    S([[-9, -30], [9, -30], [6, -18], [0, -14], [-6, -18]], { fill: C.brassLt, lwPx: .9, smooth: true });
    for (const s of [-1, 1]) S(ellPts(s * 10, -25, 3, 4), { fill: null, stroke: C.brassDk, lwPx: 1.2 });
  }
  function hourglass(t) {
    const f = frac(t / 20);
    S(rectPts(-7, -2, 14, 2), { fill: C.woodDk, lwPx: .7 }); S(rectPts(-7, -24, 14, 2), { fill: C.woodDk, lwPx: .7 });
    S([[-5, -22], [5, -22], [0, -12], [5, -2], [-5, -2], [0, -12]], { fill: 'rgba(220,235,245,.6)', stroke: C.line, lwPx: .7 });
    S([[-4 * (1 - f), -20 + 8 * f], [4 * (1 - f), -20 + 8 * f], [0, -12]], { fill: C.rugGold, stroke: null });
    S([[-4.5, -2.5], [4.5, -2.5], [0, -2.5 - 6 * f]], { fill: C.rugGold, stroke: null });
    line([[0, -12], [0, -3]], { stroke: C.rugGold, lwPx: .5 });
  }
  function plant(t, h, ph) {
    S([[-12, -22], [12, -22], [9, 0], [-9, 0]], { fill: '#C46A42', lwPx: 1 });
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i - 4) * .26 + wob(t, .25, ph + i * .1) * .04, l = h * (.55 + .45 * hash(i + ph)), cx = Math.cos(a) * l, cy = -22 + Math.sin(a) * l;
      line([[0, -22], [cx, cy]], { stroke: C.treeDk, lwPx: 1.2 });
      S(ellPts(cx, cy, 9, 6, 14, a), { fill: i % 2 ? C.tree : C.treeDk, lwPx: .8 });
    }
  }

  // ---------- the shell ----------
  function floor(P, t, o) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]);
    if (q) S(q, { fill: C.floor, stroke: null });
    // planks running front to back, joints staggered
    for (let i = 0; i <= 18; i++) { const x = -HW + i * 50, l = P.line([[x, 0, BACK], [x, 0, FRONT]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, 1) }); }
    for (let i = 0; i < 18; i++) for (let z = (hash(i) * 220) | 0; z < FRONT; z += 220) {
      const l = P.line([[-HW + i * 50, 0, z], [-HW + i * 50 + 50, 0, z]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .8) });
      if (hash(i * 3 + z) < .3) { const p = P.poly([[-HW + i * 50 + 2, .2, z + 4], [-HW + i * 50 + 48, .2, z + 4], [-HW + i * 50 + 48, .2, z + 120], [-HW + i * 50 + 2, .2, z + 120]]); if (p) S(p, { fill: C.floorLt, stroke: null, alpha: .35 }); }
    }
    // the rug: navy border, red field, gold medallion
    const R = RUG, r = (m, y, col, st) => { const p = P.poly([[R.x0 + m, y, R.z0 + m], [R.x1 - m, y, R.z0 + m], [R.x1 - m, y, R.z1 - m], [R.x0 + m, y, R.z1 - m]]); if (p) S(p, { fill: col, stroke: st ? C.line : null, lwPx: px(P, 1) }); };
    r(0, .4, C.rugNavy, true); r(18, .5, C.rugGold); r(24, .6, C.rug);
    for (let i = 0; i < 10; i++) { const z = R.z0 + 40 + i * ((R.z1 - R.z0 - 80) / 9); for (const x of [R.x0 + 9, R.x1 - 9]) { const d = P.floorCircle(x, z, 5, .55, 8); if (d) S(d, { fill: C.rugCream, stroke: null }); } }
    const mz = (R.z0 + R.z1) / 2;
    for (const [rad, col] of [[110, C.rugNavy], [92, C.rugGold], [70, C.rugDk], [40, C.rugCream], [18, C.rugNavy]]) { const d = P.floorCircle(0, mz, rad, .7, 8); if (d) S(d, { fill: col, stroke: null }); }
    for (const [x, z] of [[R.x0 + 60, R.z0 + 60], [R.x1 - 60, R.z0 + 60], [R.x0 + 60, R.z1 - 60], [R.x1 - 60, R.z1 - 60]]) { const d = P.floorCircle(x, z, 26, .7, 4); if (d) S(d, { fill: C.rugGold, stroke: null }); }
    // firelight on the floor in front of the hearth
    const fire = clamp(o.fire ?? 1);
    if (fire > .01) { const g = P.p(0, 0, 160); if (P.visible(160)) glowAt(g[0], g[1], 260 * g[2], 70 * g[2], '#FF9A40', .28 * fire * (1 + .08 * wob(t, 3.1))); }
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]);
    if (q) S(q, { fill: C.ceil, stroke: null });
    for (const z of [180, 460, 740, 1000]) box(P, -HW, HW, CEIL - 20, CEIL, z - 14, z + 14, { nz: C.beam, pz: C.beam, side: C.beam, bot: mixCol(C.beam, '#000000', .15) }, { lwPx: px(P, 1) });
  }
  function sideWalls(P, t, o) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = wrect(P, x, BACK, FRONT, 0, CEIL);
      if (q) S(q, { fill: C.wall, stroke: null });
      const wn = wrect(P, x, BACK, FRONT, 0, WAIN); if (wn) S(wn, { fill: C.pan, stroke: null });
      for (let z = 40; z < FRONT - 60; z += 120) { const p = wrect(P, x, z, z + 95, 20, WAIN - 22); if (p) S(p, { fill: C.panLt, stroke: C.panDk, lwPx: px(P, 1) }); }
      const rail = wrect(P, x, BACK, FRONT, WAIN - 8, WAIN); if (rail) S(rail, { fill: C.panDk, stroke: null });
      const cr = wrect(P, x, BACK, FRONT, CEIL - 26, CEIL - 20); if (cr) S(cr, { fill: C.panDk, stroke: null });
      if (sd > 0) { wallWindow(P, x, t, o); door(P, x); }
    }
  }
  function wallWindow(P, x, t, o) {
    const W_ = WIN, n = clamp(o.night || 0), q = wrect(P, x, W_.z0, W_.z1, W_.y0, W_.y1); if (!q) return;
    clipTo(q, () => {
      const top = Math.min(...q.map(v => v[1])), bot = Math.max(...q.map(v => v[1]));
      S(q, { fill: linGrad(0, top, 0, bot, [[0, mixCol(C.sky, C.nightSky, n)], [1, mixCol(C.skyLt, C.nightLt, n)]]), stroke: null });
      const xo = x + 500, sw = wob(t, .2) * 5;
      if (n > .05) {                                                                      // stars and a moon
        for (let i = 0; i < 40; i++) { const z = W_.z0 + hash(i + 50) * (W_.z1 - W_.z0); if (!P.visible(z)) continue; const s = P.p(x + 40, 215 + hash(i) * 85, z); circle(s[0], s[1], (.8 + hash(i + 9) * 1.4) * (.6 + .4 * wob(t, .4 + hash(i), hash(i))), { fill: `rgba(255,250,220,${n.toFixed(3)})`, stroke: null }); }
        const mz = W_.z0 + (W_.z1 - W_.z0) * .3; if (P.visible(mz)) { const m = P.p(x + 40, 262, mz); circle(m[0], m[1], 20 * m[2], { fill: rgba('#FFF4C8', n), stroke: null }); circle(m[0] + 7 * m[2], m[1] - 4 * m[2], 16 * m[2], { fill: mixCol(C.sky, C.nightSky, n), stroke: null, alpha: n }); }
      }
      const gr = P.poly([[xo, -400, -800], [xo, -400, 2800], [xo, 60, 2800], [xo, 60, -800]]); if (gr) S(gr, { fill: mixCol(C.treeLt, '#1E3324', n), stroke: null });
      for (let i = 0; i < 18; i++) {
        const cz = -300 + i * 120 + hash(i + 2) * 50 + (i % 3 === 1 ? sw : 0), cy = 90 + hash(i + 6) * 140, r = 70 + hash(i + 11) * 45;
        const b = P.poly(Array.from({ length: 20 }, (_, j) => { const a = j / 20 * TAU; return [xo, cy + Math.sin(a) * r * .8, cz + Math.cos(a) * r]; }));
        if (b) S(b, { fill: mixCol([C.treeDk, C.tree, C.treeLt][i % 3], '#15261B', n * .85), stroke: null });
      }
    });
    S(q, { fill: null, stroke: C.paper, lwPx: px(P, 5) });
    for (const l of [wline(P, x, [[(W_.z0 + W_.z1) / 2, W_.y0], [(W_.z0 + W_.z1) / 2, W_.y1]]), wline(P, x, [[W_.z0, (W_.y0 + W_.y1) / 2], [W_.z1, (W_.y0 + W_.y1) / 2]])]) if (l) line(l, { stroke: C.paper, lwPx: px(P, 3) });
    const sill = wrect(P, x, W_.z0 - 20, W_.z1 + 20, W_.y0 - 10, W_.y0); if (sill) S(sill, { fill: C.woodLt, lwPx: px(P, 1) });
    // velvet curtains, tied back, and a pelmet
    for (const [za, zb, dir] of [[W_.z0 - 60, W_.z0 + 30, 1], [W_.z1 - 30, W_.z1 + 60, -1]]) {
      const zi = dir > 0 ? zb : za, zo = dir > 0 ? za : zb, xi = x - 4, sway = wob(t, .15, dir) * 3;
      const c = wpoly(P, xi, [[zo, CEIL - 30], [zi, CEIL - 30], [zi - dir * 30 + sway, 170], [zi + sway, 30], [zo, 30]]); if (c) S(c, { fill: C.curtain, lwPx: px(P, 1.2), smooth: false });
      for (let k = 1; k < 3; k++) { const f = wline(P, xi, [[lerp(zo, zi, k / 3), CEIL - 32], [lerp(zo, zi - dir * 30, k / 3), 170], [lerp(zo, zi, k / 3), 34]]); if (f) line(f, { stroke: C.curtainDk, lwPx: px(P, 1.6) }); }
      const tie = wrect(P, xi - 1, Math.min(zo, zi - dir * 30) + 4, Math.max(zo, zi - dir * 30) - 4, 160, 172); if (tie) S(tie, { fill: C.brass, lwPx: px(P, .8) });
    }
    const pel = wrect(P, x - 6, W_.z0 - 70, W_.z1 + 70, CEIL - 60, CEIL - 28); if (pel) S(pel, { fill: C.curtainDk, lwPx: px(P, 1.2) });
  }
  function door(P, x) {
    const d = wrect(P, x, DOOR.z0, DOOR.z1, 0, 220); if (d) S(d, { fill: C.woodDk, stroke: C.panDk, lwPx: px(P, 6) });
    for (const [y0, y1] of [[20, 100], [120, 200]]) for (const [z0, z1] of [[DOOR.z0 + 14, DOOR.z0 + 60], [DOOR.z0 + 70, DOOR.z1 - 14]]) { const p = wrect(P, x, z0, z1, y0, y1); if (p) S(p, { fill: C.wood, stroke: C.woodXd, lwPx: px(P, 1) }); }
    const h = P.p(x, 105, DOOR.z0 + 18); if (P.visible(DOOR.z0 + 18)) circle(h[0], h[1], clamp(4 * h[2], 1.5, 8), { fill: C.brass, lwPx: px(P, 1) });
  }

  // Front wall (Z = 1100): only seen from the desk view.
  function frontWall(P, t, o) {
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null });
      S(rectPts(-HW, -WAIN, 2 * HW, WAIN), { fill: C.pan, stroke: null });
      for (let x = -HW + 20; x < HW - 60; x += 110) S(rectPts(x, -WAIN + 20, 90, WAIN - 42), { fill: C.panLt, stroke: C.panDk, lwPx: px(P, 1) });
      S(rectPts(-HW, -WAIN, 2 * HW, 8), { fill: C.panDk, stroke: null });
      S(rectPts(-HW, -CEIL + 20, 2 * HW, 6), { fill: C.panDk, stroke: null });
      // the chalkboard, in a wooden frame with a chalk ledge
      const x = BOARD.x, y = -BOARD.y;
      S(rectPts(x - 12, y - 12, BOARD.w + 24, BOARD.h + 24), { fill: C.woodDk, lwPx: 1.4 });
      S(rectPts(x, y, BOARD.w, BOARD.h), { fill: linGrad(x, y, x + BOARD.w, y + BOARD.h, [[0, C.board], [1, C.boardDk]]), stroke: C.woodXd, lwPx: 1 });
      X.save(); X.beginPath(); X.rect(x, y, BOARD.w, BOARD.h); X.clip();
      for (let i = 0; i < 5; i++) ellipse(x + BOARD.w * hash(i * 2.3), y + BOARD.h * hash(i * 4.1), 80, 18, { fill: 'rgba(255,255,255,.04)', stroke: null, rot: -.1 });
      X.translate(x, y);
      if (o.board) o.board(t);
      else {
        const ch = 'rgba(255,253,244,.92)';
        label('ζ(s) = Σ 1/nˢ', 120, 34, 30, ch, FONT_TALK, 600);
        label('2  3  5  7  11  13  17  19  23  29 …', 150, 78, 20, ch, FONT_TALK, 500);
        label('Re(s) = ½ ?', 120, 120, 24, C.gold, FONT_TALK, 600);
        line([[300, 140], [300, 20]], { stroke: ch, lwPx: 1.6 }); line([[300, 140], [480, 140]], { stroke: ch, lwPx: 1.6 });
        const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([300 + u * 175, 140 - (u * 95 + 6 * Math.sin(u * 23))]); }
        line(pts, { stroke: C.glow, lwPx: 2 });
        S(rectPts(420, 20, 54, 30), { fill: null, stroke: ch, lwPx: 1.4 }); label('π(x)', 447, 35, 15, ch);
      }
      X.restore();
      S(rectPts(x - 16, y + BOARD.h + 8, BOARD.w + 32, 8), { fill: C.woodDk, lwPx: 1 });
      [C.chalk, C.gold, C.chalk, C.glow].forEach((c, i) => S(rectPts(x + 30 + i * 18, y + BOARD.h + 3, 13, 5), { fill: c, lwPx: .6 }));
      S(rectPts(x + BOARD.w - 70, y + BOARD.h + 1, 32, 8), { fill: '#C9B48A', lwPx: .7 });  // the eraser
      // framed diplomas either side
      for (const [cx, cy] of [[-300, -240], [330, -240], [330, -165]]) {
        S(rectPts(cx - 44, cy - 32, 88, 64), { fill: C.woodXd, lwPx: 1.2 }); S(rectPts(cx - 38, cy - 26, 76, 52), { fill: C.paper, stroke: C.brass, lwPx: 1.5 });
        line([[cx - 26, cy - 14], [cx + 26, cy - 14]], { stroke: '#5A4A3A', lwPx: 2.4 });
        for (let r = 0; r < 2; r++) line([[cx - 24, cy - 2 + r * 7], [cx + 24 - r * 10, cy - 2 + r * 7]], { stroke: 'rgba(90,74,58,.5)', lwPx: 1 });
        circle(cx + 20, cy + 16, 6, { fill: C.red, lwPx: .8 });
      }
      S(rectPts(280, -125, 100, 18), { fill: C.brass, lwPx: 1 }); label('Prof. Safadi', 330, -116, 12, C.woodXd, FONT_TALK, 700);
    });
  }

  // Back wall (Z = 0): only seen from the fireside view. The chimney breast, the painting over the mantel.
  function backWall(P, t) {
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wallLt, stroke: null });
      S(rectPts(-HW, -WAIN, 2 * HW, WAIN), { fill: C.pan, stroke: null });
      S(rectPts(-HW, -CEIL + 20, 2 * HW, 6), { fill: C.panDk, stroke: null });
      // the painting: a golden spiral over a calm sea, in a gilt frame
      S(rectPts(-120, -310, 240, 130), { fill: C.brass, lwPx: 1.6 });
      S(rectPts(-108, -298, 216, 106), { fill: linGrad(0, -298, 0, -192, [[0, '#F6D9A8'], [.6, '#E9A86B'], [1, '#3A5E7E']]), stroke: C.brassDk, lwPx: 1 });
      S([[-108, -220], [-40, -228], [40, -218], [108, -226], [108, -192], [-108, -192]], { fill: '#2E4D6E', stroke: null, smooth: true });
      const sp = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * 3.2 * Math.PI, r = 2.2 * Math.pow(1.618, a / (Math.PI / 2)); sp.push([20 + Math.cos(-a) * r, -245 + Math.sin(-a) * r]); }
      line(sp, { stroke: C.gold, lwPx: 2.2 });
    });
  }

  // ---------- depth-sorted pieces ----------
  function fireplace(P, t, o) {
    const F = FIRE, fire = clamp(o.fire ?? 1);
    box(P, F.x0, F.x1, 0, F.h, BACK, F.z1, { nz: C.stone, pz: C.stone, side: C.stoneDk, top: C.stone });
    box(P, -170, 170, 0, 5, F.z1, F.z1 + 60, { nz: C.stoneDk, pz: C.stoneDk, side: C.stoneDk, top: C.stone }, { lwPx: px(P, 1) });   // hearth slab
    if (P.cam.z > F.z1) P.plane(F.z1, () => {
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) S(rectPts(F.x0 + 6 + j * 245 - (i % 2) * 6, -F.h + 6 + i * 24, 45, 20), { fill: hash(i + j * 7) < .5 ? C.stone : '#C7BDAA', stroke: C.stoneDk, lwPx: px(P, .7) });
      // the firebox: a dark arch with logs and a living fire
      const ar = [[-95, 0], [-95, -80], [-80, -100], [-40, -112], [40, -112], [80, -100], [95, -80], [95, 0]];
      S(ar, { fill: C.soot, stroke: C.stoneDk, lwPx: px(P, 2), smooth: false });
      X.save(); tracePath(ar, true, false); X.clip();
      glowAt(0, -10, 100, 60, '#FF7A20', .5 * fire);
      for (const [x0, x1, y] of [[-60, 50, -8], [-40, 64, -16]]) { S([[x0, y], [x1, y - 3], [x1, y + 6], [x0, y + 8]], { fill: '#6A3B1E', lwPx: px(P, 1) }); circle(x1, y + 1.5, 4.5, { fill: '#C79A62', lwPx: px(P, .8) }); }
      if (fire > .01) for (let i = 0; i < 7; i++) {
        const x = -48 + i * 16, h = (40 + 26 * hash(i)) * fire * (1 + .25 * wob(t, 2.1 + hash(i) * 1.5, hash(i * 3))), sw = 6 * wob(t, 1.3 + hash(i), i * .2);
        S([[x - 11, -14], [x + sw * .5, -14 - h * .6], [x + sw, -14 - h], [x + 11, -14]], { fill: rgba(C.orange, .9), stroke: null, smooth: true });
        S([[x - 6, -14], [x + sw * .4, -14 - h * .45], [x + 6, -14]], { fill: rgba(C.yellow, .95), stroke: null, smooth: true });
      }
      if (fire > .01) for (let i = 0; i < 6; i++) { const ph = frac(t * .7 + i / 6); circle(-30 + hash(i) * 60 + Math.sin(ph * 9 + i) * 8, -20 - ph * 90, 1.6 * (1 - ph), { fill: rgba(C.yellow, 1 - ph), stroke: null }); }
      X.restore();
      S(rectPts(-100, -4, 200, 4), { fill: '#3B3330', stroke: null });
      for (let i = 0; i < 9; i++) line([[-90 + i * 22.5, -4], [-90 + i * 22.5, -40]], { stroke: '#2A2420', lwPx: px(P, 2) });   // the fire screen
      line([[-92, -40], [92, -40]], { stroke: '#2A2420', lwPx: px(P, 2) });
    });
    // the mantel shelf and what lives on it
    const M = MANTEL;
    box(P, M.x0, M.x1, M.y, M.y + 12, BACK, M.z1, { nz: C.woodDk, pz: C.wood, side: C.woodDk, top: C.woodLt });
    const y = M.y + 12, z = M.z1 - 20, lit = clamp(o.lamp ?? .6);
    sprite(P, -145, y, z, () => candle(t, lit, 0));
    sprite(P, -105, y, z, () => photoFrame(32, 40, false));
    sprite(P, -55, y, z, () => trophy());
    sprite(P, 55, y, z, () => hourglass(t));
    sprite(P, 100, y, z, () => photoFrame(36, 30, true));
    sprite(P, 145, y, z, () => candle(t, lit, 1.3));
  }
  // A built-in bookcase either side of the chimney.
  function backCase(P, [x0, x1], seed) {
    const s = BCASE;
    box(P, x0, x1, 0, s.h, BACK, s.z1, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.woodLt });
    if (P.cam.z <= s.z1) return;
    P.plane(s.z1, () => {
      S(rectPts(x0 + 8, -s.h + 8, x1 - x0 - 16, s.h - 16), { fill: C.woodXd, stroke: null });
      for (let r = 0; r < 5; r++) {
        const y = -s.h + 8 + (r + 1) * 52.8;
        paintBooks(x0 + 10, x1 - 10, y - 4, 42, seed + r * 11, px(P, .7));
        S(rectPts(x0 + 8, y - 4, x1 - x0 - 16, 6), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
      }
    });
  }
  // The bookcases along the left wall, floor to cornice.
  function leftShelf(P) {
    const s = LSHELF, x0 = -HW, x1 = -HW + s.d;
    box(P, x0, x1, 0, s.h, s.z0, s.z1, { nz: C.woodDk, pz: C.woodDk, side: C.wood, top: C.woodLt }, { skip: 'side' });
    if (P.cam.x <= x1) return;
    const q = wrect(P, x1, s.z0, s.z1, 0, s.h); if (q) S(q, { fill: C.wood, lwPx: px(P, 1.2) });
    const inner = wrect(P, x1, s.z0 + 8, s.z1 - 8, 8, s.h - 12); if (inner) S(inner, { fill: C.woodXd, stroke: null });
    for (let r = 0; r < 6; r++) {
      const yb = 8 + r * 50;
      for (const b of bookRow(s.z0 + 10, s.z1 - 10, 42, 300 + r * 17)) {
        const k = wrect(P, x1, b.u, b.u + b.w, yb + 4, yb + 4 + b.h); if (k) S(k, { fill: b.col, lwPx: px(P, .6) });
        if (b.band) { const g = wrect(P, x1, b.u, b.u + b.w, yb + 4 + b.h * .8, yb + 6 + b.h * .8); if (g) S(g, { fill: C.brassLt, stroke: null, alpha: .7 }); }
      }
      const sh = wrect(P, x1, s.z0 + 8, s.z1 - 8, yb, yb + 5); if (sh) S(sh, { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
    }
    for (let z = s.z0 + 200; z < s.z1 - 50; z += 200) { const u = wrect(P, x1, z - 5, z + 5, 0, s.h); if (u) S(u, { fill: C.wood, stroke: C.woodDk, lwPx: px(P, .8) }); }
    const rl = P.line([[x1 + 6, s.h - 8, s.z0], [x1 + 6, s.h - 8, s.z1]]); if (rl) line(rl, { stroke: C.brass, lwPx: px(P, 3) });   // ladder rail
  }
  function ladder(P) {
    const z = LADDER.z, xt = -HW + LSHELF.d + 6, xb = xt + 80, top = LSHELF.h - 8;
    const rail = dz => { const q = P.poly([[xb - 5, 0, z + dz], [xb + 5, 0, z + dz], [xt + 5, top, z + dz], [xt - 5, top, z + dz]]); if (q) S(q, { fill: C.woodLt, lwPx: px(P, 1.2) }); };
    const rungs = () => { for (let i = 1; i < 8; i++) { const f = i / 8, x = lerp(xb, xt, f), y = top * f, l = P.line([[x, y, z - 22], [x, y, z + 22]]); if (l) { line(l, { stroke: C.line, lwPx: px(P, 5) }); line(l, { stroke: C.brassLt, lwPx: px(P, 3) }); } } };
    const [far, near] = P.depth(z - 22) > P.depth(z + 22) ? [-22, 22] : [22, -22];
    rail(far); rungs(); rail(near);
    for (const dz of [-22, 22]) { const w = P.p(xb, 4, z + dz); if (P.visible(z + dz)) circle(w[0], w[1], clamp(4 * w[2], 1, 9), { fill: C.brass, lwPx: px(P, .8) }); }
  }
  function desk(P, t, o) {
    const D = DESK, lit = clamp(o.lamp ?? .6);
    for (const [a, b] of [[D.x0, D.x0 + 120], [D.x1 - 120, D.x1]]) box(P, a, b, 0, D.h - 8, D.z0 + 4, D.z1 - 4, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.wood });   // two pedestals
    box(P, D.x0 + 120, D.x1 - 120, D.h - 26, D.h - 8, D.z0 + 4, D.z1 - 4, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.wood });   // the centre drawer
    if (P.cam.z < D.z0) P.plane(D.z0 + 4, () => {                                       // panelled front toward the room
      for (const a of [D.x0, D.x1 - 120]) S(rectPts(a + 12, -D.h + 18, 96, D.h - 34), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, 1) });
      S(rectPts(D.x0 + 132, -D.h + 12, 2 * D.x1 - 264, 12), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) });
    });
    if (P.cam.z > D.z1) P.plane(D.z1 - 4, () => {                                       // drawers on Safadi's side
      for (const a of [D.x0, D.x1 - 120]) for (let i = 0; i < 3; i++) { S(rectPts(a + 10, -D.h + 14 + i * 21, 100, 18), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, 1) }); S(rectPts(a + 52, -D.h + 21 + i * 21, 16, 4), { fill: C.brass, stroke: null }); }
    });
    box(P, D.x0 - 10, D.x1 + 10, D.h - 8, D.h, D.z0 - 6, D.z1 + 6, { nz: C.woodDk, pz: C.woodDk, side: C.woodDk, top: C.woodLt });
    const blot = P.poly([[-90, D.h + .4, D.z0 + 18], [90, D.h + .4, D.z0 + 18], [90, D.h + .4, D.z1 - 12], [-90, D.h + .4, D.z1 - 12]]); if (blot) S(blot, { fill: C.curtainDk, stroke: C.leatherDk, lwPx: px(P, 1) });
    const y = D.h, zm = (D.z0 + D.z1) / 2;
    sprite(P, -185, y, zm + 10, () => deskLamp(lit));
    sprite(P, -110, y, zm + 6, () => laptop(P.dir < 0));
    sprite(P, -150, y, zm - 25, () => bookPile([C.curtain, C.rugNavy, C.wallDk, C.brassDk]));
    sprite(P, -15, y, zm - 8, () => paperStack());
    sprite(P, 60, y, zm + 14, () => penCup());
    sprite(P, 110, y, zm - 10, () => mug(t, o.tea !== false));   // o.tea: false = the tea has gone cold (no steam)
    sprite(P, 175, y, zm + 4, () => newtonsCradle(t, o.cradle !== false));
  }
  function deskChair(P) {
    const c = CHAIR, h = 48, wood = { nz: C.woodDk, pz: C.woodDk, side: C.woodDk, top: C.wood };
    const back = () => { box(P, c.x0 - 4, c.x1 + 4, h, 150, c.z1 - 14, c.z1, { nz: C.leather, pz: C.leatherDk, side: C.leatherDk, top: C.leatherLt });
      if (P.cam.z < c.z1 - 14) P.plane(c.z1 - 14, () => { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) circle(-30 + i * 30, -140 + j * 26, 2, { fill: C.leatherDk, stroke: null }); }); };
    const seat = () => { for (const [x, z] of [[c.x0 + 6, c.z0 + 6], [c.x1 - 6, c.z0 + 6], [c.x0 + 6, c.z1 - 6], [c.x1 - 6, c.z1 - 6]]) box(P, x - 4, x + 4, 0, h - 10, z - 4, z + 4, wood, { lwPx: px(P, .7) });
      box(P, c.x0, c.x1, h - 10, h, c.z0, c.z1 - 14, { nz: C.leather, pz: C.leather, side: C.leatherDk, top: C.leatherLt }); };
    if (P.depth(c.z1) > P.depth(c.z0)) { back(); seat(); } else { seat(); back(); }
  }
  // A leather club armchair facing the middle of the room (sd = −1 on the left, +1 on the right).
  function armchair(P, sd) {
    const xo = sd * (ARM.x + 45), xi = sd * (ARM.x - 45), { z0, z1 } = ARM, lo = Math.min(xo, xi), hi = Math.max(xo, xi);
    const L = { nz: C.leather, pz: C.leather, side: C.leatherDk, top: C.leatherLt };
    const bx0 = sd < 0 ? lo : hi - 18, bx1 = sd < 0 ? lo + 18 : hi;
    const back = () => box(P, bx0, bx1, 0, 118, z0, z1, L);
    const arm = z => () => box(P, lo, hi, 0, 72, z, z + 18, L);
    const seat = () => { box(P, lo + (sd < 0 ? 18 : 0), hi - (sd > 0 ? 18 : 0), 0, 40, z0 + 18, z1 - 18, { ...L, top: C.leather }); box(P, lo + (sd < 0 ? 18 : 0), hi - (sd > 0 ? 18 : 0), 40, 52, z0 + 18, z1 - 18, { ...L, top: C.leatherLt }, { lwPx: px(P, .9) }); };
    const near = P.depth(z0) < P.depth(z1) ? z0 : z1 - 18, far = near === z0 ? z1 - 18 : z0;
    const backFirst = sd * P.cam.x < sd * bx0;                                            // the camera is on the room side of the back
    (backFirst ? [back, arm(far), seat, arm(near)] : [arm(far), seat, arm(near), back]).forEach(f => f());
  }
  function chessTable(P, t) {
    const x = 0, z = 270, h = 56;
    const ped = P.line([[x, 0, z], [x, h, z]]); if (ped) line(ped, { stroke: C.woodDk, lwPx: px(P, 6) });
    const foot = P.floorCircle(x, z, 22, 1, 3); if (foot) S(foot, { fill: C.woodDk, lwPx: px(P, 1) });
    const top0 = P.floorCircle(x, z, 40, h - 4, 28), top1 = P.floorCircle(x, z, 40, h, 28);
    if (top0) S(top0, { fill: C.woodDk, lwPx: px(P, 1) }); if (top1) S(top1, { fill: C.wood, lwPx: px(P, 1) });
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const q = P.poly([[x - 24 + i * 8, h + .3, z - 24 + j * 8], [x - 16 + i * 8, h + .3, z - 24 + j * 8], [x - 16 + i * 8, h + .3, z - 16 + j * 8], [x - 24 + i * 8, h + .3, z - 16 + j * 8]]); if (q) S(q, { fill: (i + j) % 2 ? C.rugCream : C.woodXd, stroke: null }); }
    [[-14, -14, 1, 1], [6, -6, 0, 0], [14, 10, 1, 0], [-6, 14, 0, 1]].forEach(([dx, dz, w, king]) => sprite(P, x + dx, h, z + dz, () => {
      const col = w ? C.rugCream : C.woodXd;
      S([[-3, 0], [3, 0], [2, -4], [1.4, -9 - king * 3], [-1.4, -9 - king * 3], [-2, -4]], { fill: col, lwPx: .7 });
      circle(0, -10.5 - king * 3, 2.4, { fill: col, lwPx: .7 }); if (king) line([[0, -15.5], [0, -19]], { stroke: col, lwPx: 1.4 });
    }));
  }
  function grandfatherClock(P, t) {
    const c = CLOCK;
    box(P, c.x0, c.x1, 0, c.h, c.z0, FRONT, { nz: C.woodDk, pz: C.woodDk, side: C.woodXd, top: C.wood });
    if (P.cam.z >= c.z0) return;
    P.plane(c.z0, () => {
      const cx = (c.x0 + c.x1) / 2;
      S([[c.x0 - 4, -c.h], [cx, -c.h - 16], [c.x1 + 4, -c.h]], { fill: C.woodDk, lwPx: px(P, 1) });   // pediment
      S(rectPts(c.x0 + 8, -c.h + 12, c.x1 - c.x0 - 16, 64), { fill: C.wood, stroke: C.woodXd, lwPx: px(P, 1) });
      circle(cx, -c.h + 44, 26, { fill: C.rugCream, stroke: C.brass, lwPx: px(P, 3) });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; circle(cx + Math.sin(a) * 20, -c.h + 44 - Math.cos(a) * 20, i % 3 ? .9 : 1.8, { fill: C.line, stroke: null }); }
      const hand = (a, l, w) => line([[cx, -c.h + 44], [cx + Math.sin(a) * l, -c.h + 44 - Math.cos(a) * l]], { stroke: C.line, lwPx: w, cap: 'round' });
      hand(TAU * (4 / 12 + t / 43200), 11, 2.6); hand(TAU * (40 / 60 + t / 3600), 17, 1.8);
      // the trunk window and the pendulum (one beat per second)
      const wy = -c.h + 90, wh = 110;
      S(rectPts(c.x0 + 16, wy, c.x1 - c.x0 - 32, wh), { fill: C.woodXd, stroke: C.brass, lwPx: px(P, 1.4) });
      X.save(); X.beginPath(); X.rect(c.x0 + 16, wy, c.x1 - c.x0 - 32, wh); X.clip();
      const a = Math.sin(t * Math.PI) * .22;
      X.save(); X.translate(cx, wy); X.rotate(a); line([[0, 0], [0, wh - 24]], { stroke: C.brassDk, lwPx: 1.6 }); circle(0, wh - 20, 11, { fill: C.brass, stroke: C.brassDk, lwPx: 1.2 }); circle(-3, wh - 23, 3, { fill: C.brassLt, stroke: null }); X.restore();
      X.restore();
      S(rectPts(c.x0 + 4, -36, c.x1 - c.x0 - 8, 32), { fill: C.wood, stroke: C.woodXd, lwPx: px(P, 1) });
    });
  }
  function globe(P, t) {
    const { x, z } = GLOBE;
    for (const a of [0, 2.1, 4.2]) { const l = P.line([[x + Math.cos(a) * 26, 0, z + Math.sin(a) * 26], [x, 60, z]]); if (l) line(l, { stroke: C.woodDk, lwPx: px(P, 3) }); }
    sprite(P, x, 92, z, () => {
      X.save(); X.rotate(.4);
      circle(0, 0, 30, { fill: '#5B8FC0', lwPx: 1.4 });
      X.save(); X.beginPath(); X.arc(0, 0, 29.5, 0, TAU); X.clip();
      for (let i = 0; i < 4; i++) { const xx = (frac(t * .03 + i / 4) * 2 - 1) * 46; S(ellPts(xx, -10 + i * 7, 10, 6 + i * 2, 12, i), { fill: '#C9B27A', stroke: null }); }
      X.restore();
      S(ellPts(0, 0, 36, 36, 30), { fill: null, stroke: C.brass, lwPx: 2.4 });
      X.restore();
    });
  }
  function pendant(P, lit) {
    const x = 0, z = 470, y = CEIL - 90;
    const ch = P.line([[x, CEIL - 20, z], [x, y + 20, z]]); if (ch) line(ch, { stroke: C.brassDk, lwPx: px(P, 1.4) });
    sprite(P, x, y, z, () => {
      glowAt(0, 18, 120, 70, '#FFD98A', .25 * lit);
      S([[-34, 20], [34, 20], [20, 0], [-20, 0]], { fill: lit > .05 ? '#F9E2A8' : '#D9C49A', lwPx: 1.4 });
      S(ellPts(0, 20, 34, 5), { fill: lit > .05 ? '#FFF4CF' : '#C9B48A', lwPx: 1 });
      S(rectPts(-6, -6, 12, 6), { fill: C.brass, lwPx: .9 });
    });
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the room.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri }), lit = clamp(o.lamp ?? .6);
    add(DESK.z0, DESK.z1, () => desk(P, t, o), 1);
    add(CHAIR.z0, CHAIR.z1, () => deskChair(P), 0);
    add(BACK, MANTEL.z1, () => fireplace(P, t, o), 1);
    for (const [i, sx] of BCASE.x.entries()) add(BACK, BCASE.z1, () => backCase(P, sx, 40 + i * 60), 0);
    add(LSHELF.z0, LSHELF.z1, () => leftShelf(P), -1);
    add(LADDER.z - 22, LADDER.z + 22, () => ladder(P), 1);
    for (const sd of [-1, 1]) add(ARM.z0, ARM.z1, () => armchair(P, sd), 0);
    add(240, 300, () => chessTable(P, t), 1);
    add(CLOCK.z0, FRONT, () => grandfatherClock(P, t), 0);
    add(GLOBE.z - 30, GLOBE.z + 30, () => globe(P, t), 0);
    add(1040, 1060, () => sprite(P, 385, 0, 1050, () => { X.scale(1.5, 1.5); plant(t, 70, 1.7); }), 0);
    add(470, 470, () => pendant(P, lit), 2);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 930 }, HW, BACK, FRONT, CEIL, BOARD, DESK, CLOCK, FIRE, MANTEL, ARM, RUG,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P, t, o); ceiling(P); sideWalls(P, t, o); backWall(P, t); frontWall(P, t, o);
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
// Desk cameras look toward the desk and chalkboard (dir 1); fireside cameras stand behind the desk and look back (dir: -1).
LOCATIONS.safadi_study = Object.assign(safadiStudy, {
  spots: {
    'At the desk (Safadi)': { x: 0, y: 0, z: 930 },
    'In front of the desk': { x: 0, y: 0, z: 650 },
    'At the chalkboard': { x: 300, y: 0, z: 990 },
    'By the grandfather clock': { x: -300, y: 0, z: 980 },
    'By the globe': { x: -250, y: 0, z: 620 },
    'Middle of the rug': { x: 0, y: 0, z: 480 },
    'Beside the left armchair': { x: -230, y: 0, z: 370 },
    'Beside the right armchair': { x: 230, y: 0, z: 370 },
    'At the fireplace': { x: 0, y: 0, z: 150 },
    'By the bookcases': { x: -330, y: 0, z: 480 },
    'By the window': { x: 340, y: 0, z: 570 },
    'Doorway': { x: 370, y: 0, z: 925 },
  },
  cameras: {
    'Desk · wide from the fire': { x: 0, y: 165, z: 60, f: 650, hy: 560, dir: 1 },
    'Desk · medium': { x: 0, y: 140, z: 560, f: 1000, hy: 570, dir: 1 },
    'Desk · close': { x: 0, y: 140, z: 690, f: 1100, hy: 590, dir: 1 },
    'Desk · chalkboard': { x: 0, y: 175, z: 520, f: 900, hy: 700, dir: 1 },
    'Desk · grandfather clock': { x: -260, y: 150, z: 660, f: 1000, hy: 600, dir: 1 },
    'Desk · bookcase side': { x: -250, y: 150, z: 240, f: 800, hy: 560, dir: 1 },
    'Fireside · from the desk': { x: 0, y: 175, z: 1070, f: 650, hy: 520, dir: -1 },
    'Fireside · medium': { x: 0, y: 140, z: 720, f: 1000, hy: 580, dir: -1 },
    'Fireside · mantel': { x: 0, y: 165, z: 470, f: 1000, hy: 640, dir: -1 },
    'Fireside · left armchair': { x: -120, y: 130, z: 640, f: 1000, hy: 600, dir: -1 },
    'Fireside · right armchair': { x: 120, y: 130, z: 640, f: 1000, hy: 600, dir: -1 },
    'Fireside · window': { x: 200, y: 150, z: 900, f: 850, hy: 560, dir: -1 },
    'Fireside · bookcases and ladder': { x: -300, y: 150, z: 900, f: 800, hy: 560, dir: -1 },
  },
});
