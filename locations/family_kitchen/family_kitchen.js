// locations/family_kitchen/family_kitchen.js: the open-plan kitchen and dining room of the Safadi home (see README.md).
//
// One long room in one-point perspective (engine/persp.js), built like the living room to be shot from BOTH ends:
//   kitchen view  cameras with dir: 1 (the default) look toward +Z at the cooking wall (Z = 1300): sage cabinets under a
//                 butcher-block counter, the big range with a glass oven door and a hood, the sink under the garden window,
//                 the fridge covered in drawings; the kitchen island in the middle of the room under two pendant lamps.
//   dining view   cameras with dir: -1 look back toward −Z at the dining wall (Z = 0): the long table for twelve under a
//                 chandelier, the sideboard and the family picture, the autumn window (screen-left), the archway (screen-right).
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   family_kitchen.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   family_kitchen.front(P, t, o)   pieces nearer than o.splitZ (the island, the table…). Call after the characters.
//                                   With o.toZ it stops at that depth, for several characters at different depths (far → near).
// o (pass the same o to back() and front(); every option is documented in README.md):
//   time: 'morning' | 'day' | 'evening' · lamps 0..1 · oven: { on, glow, door, smoke, dial } · mess 0..1 · thanksgiving
//   tableItems · islandItems · counterItems · nearChairs · steam 0..1 · smoke 0..1 (ceiling haze, defaults to oven.smoke)
//   hooks: inOven(P, t) · onIsland(P, t) · onCounter(P, t) · onTable(P, t) · onSideboard(P, t)
//
// Layout (world): side walls X = ±600, dining wall Z = 0, cooking wall Z = 1300, ceiling Y = 300, chair rail Y 92.
// Counter X −600…400, Z 1235–1300, top Y 92. Range X ±60 (oven door X ±52, Y 12…70, Z 1230). Sink X −260. Fridge X 410…545.
// Island X ±170, Z 850–950, top Y 92. Table X ±440, Z 200–310, top Y 76. Sideboard X ±240, Z 0–50. Archway X −600, Z 480–760.

const family_kitchen = (() => {
  const HW = 600, BACK = 0, FRONT = 1300, CEIL = 300, RAIL = 92;
  const COUNTER = { x0: -600, x1: 400, y: 92, z0: 1235, z1: 1300 };
  const OVEN = { x: 0, x0: -60, x1: 60, z: 1230, back: 1292, y0: 12, y1: 70, w: 104, h: 58, top: 92,
    door: { x0: -52, x1: 52, y0: 12, y1: 70 }, glass: { x0: -40, x1: 40, y0: 24, y1: 60 }, inside: { x: 0, y: 22, z: 1262 }, rack: 22 };
  const SINK = { x: -260, x0: -302, x1: -218, y: 92, z0: 1246, z1: 1290, z: 1268 };
  const KWIN = { x0: -360, x1: -160, y0: 118, y1: 242 };
  const FRIDGE = { x: 478, x0: 410, x1: 545, y: 212, z0: 1215, z1: 1300 };
  const HOOD = { x0: -66, x1: 66, y0: 168, y1: 216, z: 1248 };
  const ISLAND = { x0: -170, x1: 170, y: 92, z0: 850, z1: 950 };
  const TABLE = { x0: -440, x1: 440, y: 76, z0: 200, z1: 310 };
  const SIDEBOARD = { x0: -240, x1: 240, y: 88, z0: 0, z1: 50 };
  const DWIN = { z0: 90, z1: 420, y0: 96, y1: 248 }, ARCH = { z0: 480, z1: 760, h: 236 };
  const BACKDOOR = { z0: 700, z1: 830, h: 212 }, CHALK = { z0: 800, z1: 940, y0: 120, y1: 210 }, PANTRY = { z0: 1010, z1: 1130, h: 212 };
  const LAMPS = [{ x: -90, z: 900, y: 214 }, { x: 90, z: 900, y: 214 }], CHAND = { x: 0, z: 255, y: 214 };
  const CLOCK = { x: -260, y: 268, r: 17 };
  // Seated guests: a standing rig placed at (x, y, z) reads as seated behind the table. y = seatY(height) sinks it.
  const seatY = h => Math.round(110 - .7 * h);                                    // 177 tall → −14 · 120 (a kid on a booster) → +26
  const SEATS = [{ x: 412, z: 214, end: 'head' }];
  for (let i = 0; i < 10; i++) SEATS.push({ x: 315 - i * 70, z: 165 });
  SEATS.push({ x: -412, z: 214, end: 'foot' });
  SEATS.forEach((s, i) => Object.assign(s, { i, y: seatY(177), side: s.end || 'far' }));
  const MARK = { x: 0, z: 1020 };                                                 // behind the island, facing the kitchen cameras

  const C0 = {
    wall: '#F1E6D2', wallDk: '#E3D4BA', trim: '#FFFDF7', trimDk: '#E3D8C6', sage: '#A9C196', sageDk: '#86A273', sageLt: '#C2D6B0',
    ceil: '#FBF6EC', floor: '#CC9C66', floorLt: '#DDB27F', floorDk: '#A97D4D', tile: '#FBF8F1', tileLn: '#E4DCCB',
    block: '#D9A764', blockDk: '#B98547', blockLt: '#E9C189', wood: '#8A5A3B', woodDk: '#6A4129', woodLt: '#AE7A51',
    cream: '#F6EAD0', steel: '#C3CCD3', steelDk: '#8E99A3', steelLt: '#E9EEF2', chrome: '#DDE4EA', enamel: '#FBF7EE', enamelDk: '#E4DCCB',
    copper: '#D7814B', copperDk: '#A65A2E', copperLt: '#F2A877', glass: '#2D2A33', black: '#2A2328',
    rug: '#C7643F', rugDk: '#9E4A2D', mustard: '#E7B54A', coral: '#E9806A', navy: '#2F4A6B', red: '#D9534F', redDk: '#A8352F',
    orange: '#F08A2C', orangeLt: '#FFB25E', gold: '#E8B84A', leaf: '#5E9E45', leafDk: '#3F7A32', plum: '#7B3F5E',
    pumpkin: '#EE8A2C', pumpkinDk: '#C8641A', bulb: '#FFE28A', hall: '#E9DAC0', white: '#FFFFFF', line: '#5E4A44',
  };
  const TIMES = {
    morning: { sky: ['#F9C98F', '#FCE8C6'], tint: '#FFD9A0', tintK: .06, sun: .55, lamps: .2, dusk: 0 },
    day: { sky: ['#8FCDF0', '#E1F3FC'], tint: '#FFFFFF', tintK: 0, sun: .4, lamps: 0, dusk: 0 },
    evening: { sky: ['#3B2E66', '#E0784E'], tint: '#5B3A55', tintK: .16, sun: 0, lamps: 1, dusk: 1 },
  };
  let C = C0;                                                                            // the palette for the current time of day
  const palCache = {};
  function palette(time) {
    const T = TIMES[time] || TIMES.day; if (!T.tintK) return C0;
    if (palCache[time]) return palCache[time];
    const p = {}; for (const k in C0) p[k] = k === 'bulb' || k === 'white' ? C0[k] : mixCol(C0[k], T.tint, T.tintK); return (palCache[time] = p);
  }
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 700, .6, 4.5);
  const lwk = k => clamp(k * .32, .5, 1.6);

  // ---------- building blocks (as in the living room) ----------
  const _boxCols = new Map(), _colCache = new Map();
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    let c = col;
    if (typeof col === 'string') {
      c = _boxCols.get(col);
      if (!c) { c = { top: mixCol(col, '#ffffff', .18), nz: col, pz: col, side: mixCol(col, '#000000', .1) }; _boxCols.set(col, c); }
    }
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.1), stroke = o.stroke === undefined ? C.line : o.stroke;
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, stroke: stroke || fill, lwPx: stroke ? lw : .6 }); };
    if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz ?? c.pz);
    if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz ?? c.nz);
    if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
    if (cam.y < y0) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.bot ?? c.side);
  }
  const COL = (c, k = .1) => {
    const key = c + '|' + k; let v = _colCache.get(key);
    if (!v) { v = { top: mixCol(c, '#ffffff', .2), nz: c, pz: c, side: mixCol(c, '#000000', k) }; _colCache.set(key, v); }
    return v;
  };
  function sprite(P, x, y, z, fn) { if (!P.visible(z)) return; const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore(); }
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const label = (txt, x, y, size, col, weight = 700, font = FONT_TALK) => { X.font = `${weight} ${size}px ${font}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const fpoly = (P, y, pts) => P.poly(pts.map(([x, z]) => [x, y, z]));
  const frect = (P, y, x0, x1, z0, z1) => fpoly(P, y, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]);
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  function glowAt(x, y, rx, ry, col, a) { if (a < .01) return; X.save(); X.globalCompositeOperation = 'lighter'; ellipse(x, y, rx, ry, { fill: radGrad(x, y, 0, Math.max(rx, ry), [[0, rgba(col, a)], [1, rgba(col, 0)]]), stroke: null }); X.restore(); }
  const ovenOpt = o => ({ on: false, glow: null, door: 0, smoke: 0, dial: null, ...(o.oven || {}) });
  const ovenGlow = ov => clamp(ov.glow ?? (ov.on ? .75 : 0));
  const lampsOf = o => clamp(o.lamps ?? (TIMES[o.time] || TIMES.day).lamps);

  // ---------- small props (sprite space: world units, y down, origin on the surface under the prop) ----------
  const PROP = {
    fruitBowl(lw) {
      for (const [x, y, r, c] of [[-7, -9, 5, '#E54B4B'], [3, -10, 5.5, '#F2A33A'], [-1, -14, 4.5, '#9BCB4A'], [8, -8, 4, '#E54B4B'], [-11, -7, 4, '#F2C440']]) circle(x, y, r, { fill: c, stroke: C.line, lwPx: lw * .8 });
      S([[-15, -8], [15, -8], [10, 0], [-10, 0]], { fill: C.sage, stroke: C.line, lwPx: lw });
    },
    toaster(lw) {
      S([[-14, 0], [-15, -16], [-12, -20], [12, -20], [15, -16], [14, 0]], { fill: C.chrome, stroke: C.line, lwPx: lw, smooth: .3 });
      for (const x of [-6, 6]) S(rectPts(x - 4, -21, 8, 2), { fill: '#3A3438', stroke: null });
      S(rectPts(15, -12, 3, 3), { fill: '#3A3438', stroke: null }); line([[-10, -14], [8, -14]], { stroke: C.white, lwPx: lw * 1.4, alpha: .8 });
    },
    knifeBlock(lw) {
      for (const [x, a] of [[-4, -.35], [0, -.25], [4, -.15], [-1, -.05]]) { X.save(); X.translate(x, -20); X.rotate(a); S(rectPts(-1.6, -9, 3.2, 9), { fill: '#2A2328', stroke: null }); X.restore(); }
      S([[-9, 0], [-12, -18], [7, -24], [10, 0]], { fill: C.woodLt, stroke: C.line, lwPx: lw });
    },
    mixer(lw, col) {                                                                    // a stand mixer with a steel bowl
      S([[-14, 0], [16, 0], [16, -5], [-14, -5]], { fill: col, stroke: C.line, lwPx: lw, smooth: .2 });
      S([[8, -5], [14, -5], [13, -32], [8, -32]], { fill: col, stroke: C.line, lwPx: lw, smooth: .2 });
      S([[-18, -26], [14, -34], [16, -26], [-14, -20]], { fill: col, stroke: C.line, lwPx: lw, smooth: .4 });
      S([[-12, -5], [6, -5], [8, -18], [-14, -18]], { fill: C.steelLt, stroke: C.line, lwPx: lw, smooth: .2 });
      line([[-4, -20], [-4, -12]], { stroke: C.steelDk, lwPx: lw * 1.5 });
    },
    jar(lw, col, h = 12) { S([[-4, 0], [4, 0], [4, -h], [-4, -h]], { fill: 'rgba(230,240,245,.8)', stroke: C.line, lwPx: lw }); S(rectPts(-3.4, -h * .7, 6.8, h * .7), { fill: col, stroke: null }); S(rectPts(-4.5, -h - 3, 9, 3), { fill: C.woodLt, stroke: C.line, lwPx: lw * .8 }); },
    utensils(lw) {                                                                        // a crock of wooden spoons and a whisk
      line([[-3, -12], [-6, -30]], { stroke: C.woodLt, lwPx: lw * 2 }); ellipse(-6.4, -32, 2.4, 3.6, { fill: C.woodLt, stroke: C.line, lwPx: lw * .7, rot: -.2 });
      line([[2, -12], [4, -32]], { stroke: C.steelDk, lwPx: lw * 1.6 }); for (const r of [3, 2]) ellipse(4.4, -34, r, 5, { fill: null, stroke: C.steelDk, lwPx: lw * .8 });
      line([[0, -12], [-1, -28]], { stroke: '#E9806A', lwPx: lw * 2.2 });
      S([[-7, 0], [7, 0], [8, -13], [-8, -13]], { fill: C.navy, stroke: C.line, lwPx: lw }); line([[-7, -6], [7, -6]], { stroke: C.cream, lwPx: lw });
    },
    pot(lw, r = 12, col) { col = col || C.copper; S([[-r, -r * .9], [r, -r * .9], [r * .9, 0], [-r * .9, 0]], { fill: col, stroke: C.line, lwPx: lw, smooth: .25 }); ellipse(0, -r * .9, r, r * .25, { fill: mixCol(col, '#000', .25), stroke: C.line, lwPx: lw }); for (const sd of [-1, 1]) line([[sd * r, -r * .7], [sd * (r + 4), -r * .75]], { stroke: C.line, lwPx: lw * 1.6 }); },
    plant(lw, t) { S([[-7, 0], [7, 0], [8, -10], [-8, -10]], { fill: C.coral, stroke: C.line, lwPx: lw }); for (let i = 0; i < 7; i++) { const a = -1.3 + i * .43 + wob(t, .2, i) * .05; ellipse(Math.cos(a - Math.PI / 2) * 0 + Math.sin(a) * 9, -14 - Math.cos(a) * 6, 4, 7, { fill: i % 2 ? C.leaf : C.leafDk, stroke: C.line, lwPx: lw * .6, rot: a }); } },
    cuttingBoard(lw) { S([[-22, 0], [22, 0], [22, -2.5], [-22, -2.5]], { fill: C.blockLt, stroke: C.line, lwPx: lw }); circle(18, -1.2, .9, { fill: C.blockDk, stroke: null }); },
    bowl(lw, col = '#5AA9E6') { S([[-12, -9], [12, -9], [7, 0], [-7, 0]], { fill: col, stroke: C.line, lwPx: lw, smooth: .2 }); ellipse(0, -9, 12, 2.4, { fill: mixCol(col, '#fff', .3), stroke: C.line, lwPx: lw * .8 }); },
    rollingPin(lw) { S(rectPts(-12, -5, 24, 5), { fill: C.blockLt, stroke: C.line, lwPx: lw, smooth: .3 }); for (const sd of [-1, 1]) S(rectPts(sd * 12 + (sd < 0 ? -6 : 0), -3.6, 6, 2.4), { fill: C.woodLt, stroke: C.line, lwPx: lw * .7 }); },
    flourBag(lw, spilt) {
      S([[-9, 0], [9, 0], [10, -22], [6, -25], [-6, -25], [-10, -22]], { fill: '#F6F0E2', stroke: C.line, lwPx: lw, smooth: .2 });
      S(rectPts(-7, -16, 14, 7), { fill: C.navy, stroke: null }); label('FLOUR', 0, -12.5, 3.6, '#fff', 800);
      if (spilt) for (let i = 0; i < 6; i++) ellipse(14 + i * 4, -.5, 5 + hash(i) * 4, 1.4, { fill: 'rgba(255,255,255,.9)', stroke: null });
    },
    candle(lw, lit, t, i) {
      S(rectPts(-2, -16, 4, 16), { fill: '#FFF3DC', stroke: C.line, lwPx: lw * .8 }); S([[-4, 0], [4, 0], [3, -2], [-3, -2]], { fill: C.gold, stroke: C.line, lwPx: lw * .7 });
      if (lit) { const f = 1 + .15 * wob(t, 3.1, i * .37) + .08 * wob(t, 7.3, i); glowAt(0, -21, 14 * f, 14 * f, '#FFC66B', .55); S([[0, -17], [-2.2 * f, -21], [0, -27 * f + 2], [2.2 * f, -21]], { fill: '#FFC24A', stroke: null, smooth: .5 }); S([[0, -17.5], [-1, -20], [0, -23], [1, -20]], { fill: '#FFF6C8', stroke: null, smooth: .5 }); }
    },
    glass(lw) { S([[-3, -12], [3, -12], [2.4, -5], [.5, -4], [.5, -1], [3, 0], [-3, 0], [-.5, -1], [-.5, -4], [-2.4, -5]], { fill: 'rgba(225,240,250,.6)', stroke: C.line, lwPx: lw * .7 }); S([[-2.5, -10], [2.5, -10], [2.2, -6], [-2.2, -6]], { fill: 'rgba(196,40,60,.55)', stroke: null }); },
    pumpkin(lw, r = 8, col) { col = col || C.pumpkin; ellipse(0, -r * .8, r, r * .8, { fill: col, stroke: C.line, lwPx: lw }); for (const f of [-.5, 0, .5]) ellipse(f * r, -r * .8, r * .28, r * .76, { fill: null, stroke: mixCol(col, '#000', .2), lwPx: lw * .8 }); S([[-1, -r * 1.55], [-1.6, -r * 1.95], [1.6, -r * 2], [1.2, -r * 1.55]], { fill: '#6E7B3A', stroke: C.line, lwPx: lw * .8 }); },
    cornucopia(lw) {                                                                       // the horn of plenty spilling fruit and gourds
      S([[18, -2], [-6, -2], [-16, -8], [-24, -16], [-30, -14], [-26, -9], [-16, -2], [-14, 2], [8, 6], [22, 2], [24, -10], [20, -20], [12, -24], [2, -20]], { fill: '#C9934E', stroke: C.line, lwPx: lw, smooth: .4 });
      for (let i = 0; i < 5; i++) line([[-14 + i * 7, -6 - i * 2.4], [-10 + i * 7, 4 - i]], { stroke: '#9C6A32', lwPx: lw * .9 });
      [[26, -6, 6, '#F08A2C'], [32, -2, 5, '#D9452F'], [22, 2, 5, '#9BCB4A'], [36, 3, 4, '#F2C440'], [29, 5, 4.5, '#7B3F5E'], [15, 4, 5.5, '#EE8A2C']].forEach(([x, y, r, c]) => circle(x, y, r, { fill: c, stroke: C.line, lwPx: lw * .8 }));
      for (const [x, y] of [[33, -10], [36, -7], [38, -11]]) circle(x, y, 2.2, { fill: '#7B3F8E', stroke: C.line, lwPx: lw * .5 });
      for (const [x, a] of [[-4, -.4], [10, .5], [40, .3]]) { X.save(); X.translate(x, 6); X.rotate(a); S([[0, 0], [-6, -3], [-10, 0], [-6, 3]], { fill: ['#E8742A', '#D9452F', '#F2B33A'][Math.abs(x) % 3], stroke: C.line, lwPx: lw * .6 }); X.restore(); }
    },
    gravyBoat(lw) { S([[-10, -7], [8, -7], [14, -10], [9, -2], [4, 0], [-6, 0]], { fill: C.enamel, stroke: C.line, lwPx: lw, smooth: .3 }); ellipse(-13, -5, 3, 3.5, { fill: null, stroke: C.line, lwPx: lw }); ellipse(0, -7, 8, 1.6, { fill: '#8A5530', stroke: null }); },
    dish(lw, col) { ellipse(0, -2, 16, 4, { fill: C.enamel, stroke: C.line, lwPx: lw }); ellipse(0, -4, 11, 3.5, { fill: col, stroke: C.line, lwPx: lw * .6 }); for (let i = 0; i < 4; i++) circle(-7 + i * 4.5, -5.5 - hash(i) * 1.5, 2.2, { fill: mixCol(col, '#fff', .25), stroke: null }); },
    breadBasket(lw) { S([[-12, -6], [12, -6], [9, 0], [-9, 0]], { fill: '#C9934E', stroke: C.line, lwPx: lw }); for (const x of [-6, 0, 6]) ellipse(x, -8, 4.5, 3.5, { fill: '#E8B06A', stroke: C.line, lwPx: lw * .7 }); },
    pan(lw) { ellipse(0, -2, 13, 3.5, { fill: '#2E2A30', stroke: C.line, lwPx: lw }); line([[12, -2], [28, -4]], { stroke: '#2E2A30', lwPx: lw * 3 }); },
    lid(lw) { ellipse(0, -1, 12, 3, { fill: C.steel, stroke: C.line, lwPx: lw }); circle(0, -4, 2, { fill: C.black, stroke: null }); },
    spoon(lw) { line([[-12, 0], [6, -1]], { stroke: C.woodLt, lwPx: lw * 2 }); ellipse(9, -1, 4, 2, { fill: C.woodLt, stroke: C.line, lwPx: lw * .6 }); },
    eggs(lw) { for (const [x, r] of [[-6, -.3], [3, .5]]) { X.save(); X.translate(x, -1); X.rotate(r); S([[-3, 0], [-3.5, -3], [0, -4], [3.5, -3], [3, 0]], { fill: '#FFF8EE', stroke: C.line, lwPx: lw * .6 }); S([[-3, 0], [-2, -1.5], [-1, 0], [0, -1.6], [1, 0], [2, -1.4], [3, 0]], { fill: null, stroke: C.line, lwPx: lw * .5 }); X.restore(); } ellipse(12, -.4, 6, 1.6, { fill: '#F7C531', stroke: null }); },
  };

  // ---------- room shell ----------
  function wallBand(P, x0, x1, o = {}) {                                                  // on a z-plane: cream over a sage wainscot, white rail, skirting and crown
    S(rectPts(x0, -CEIL, x1 - x0, CEIL), { fill: C.wall, stroke: null });
    if (!o.noWainscot) { S(rectPts(x0, -RAIL, x1 - x0, RAIL), { fill: C.sage, stroke: null });
      for (let x = x0 + 16; x < x1 - 60; x += 90) S(rectPts(x, -RAIL + 18, 70, RAIL - 36), { fill: null, stroke: C.sageDk, lwPx: px(P, 1.1) });
      S(rectPts(x0, -RAIL - 5, x1 - x0, 7), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .8) }); S(rectPts(x0, -12, x1 - x0, 12), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .8) }); }
    S(rectPts(x0, -CEIL, x1 - x0, 12), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .8) });
  }
  const FLOOR_JOINTS = [];
  for (let i = 0; i < 24; i++) for (let z = (hash(i + 9) * 260) | 0; z < FRONT; z += 260) {
    FLOOR_JOINTS.push({ x0: -HW + i * 50, z, light: hash(i * 7 + z) < .3 });
  }
  function floor(P, o) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]); if (q) S(q, { fill: C.floor, stroke: null });
    const sc = pxScale();
    X.strokeStyle = C.floorDk; X.lineCap = 'round'; X.lineJoin = 'round';
    X.lineWidth = px(P, .9) / sc; X.beginPath();
    for (let i = 0; i <= 24; i++) { const x = -HW + i * 50, l = P.line([[x, 0, BACK], [x, 0, FRONT]]); if (l) { X.moveTo(l[0][0], l[0][1]); X.lineTo(l[1][0], l[1][1]); } }
    X.stroke();
    X.lineWidth = px(P, .7) / sc; X.beginPath();
    for (let k = 0; k < FLOOR_JOINTS.length; k++) {
      const { x0, z } = FLOOR_JOINTS[k], l = P.line([[x0, 0, z], [x0 + 50, 0, z]]);
      if (l) { X.moveTo(l[0][0], l[0][1]); X.lineTo(l[1][0], l[1][1]); }
    }
    X.stroke();
    X.save(); X.globalAlpha *= .45; X.fillStyle = C.floorLt; X.beginPath();
    for (let k = 0; k < FLOOR_JOINTS.length; k++) {
      const { x0, z, light } = FLOOR_JOINTS[k]; if (!light) continue;
      const p = frect(P, .2, x0 + 2, x0 + 48, z + 4, z + 150);
      if (p) { X.moveTo(p[0][0], p[0][1]); for (let j = 1; j < p.length; j++) X.lineTo(p[j][0], p[j][1]); X.closePath(); }
    }
    X.fill(); X.restore();
    // the dining rug: rust field, cream border, mustard diamonds
    for (const [ins, col, y] of [[0, C.rugDk, .3], [16, C.cream, .4], [26, C.rug, .5]]) { const r = frect(P, y, -540 + ins, 540 - ins, 70 + ins, 450 - ins); if (r) S(r, { fill: col, stroke: ins ? null : C.line, lwPx: px(P, .9) }); }
    for (let i = 0; i < 9; i++) { const x = -440 + i * 110; for (const z of [110, 410]) { const d = fpoly(P, .6, [[x, z - 16], [x + 16, z], [x, z + 16], [x - 16, z]]); if (d) S(d, { fill: C.mustard, stroke: null }); } }
    // a striped runner in front of the sink
    const rr = frect(P, .4, -350, -170, 1120, 1225); if (rr) S(rr, { fill: C.navy, stroke: C.line, lwPx: px(P, .8) });
    for (let i = 0; i < 4; i++) { const s = frect(P, .5, -350, -170, 1135 + i * 24, 1145 + i * 24); if (s) S(s, { fill: C.cream, stroke: null }); }
    const T = TIMES[o.time] || TIMES.day;                                                // sun patches from the windows
    if (T.sun > 0) {
      const a = T.sun * .5, sp = fpoly(P, .9, [[HW, DWIN.z0 + 40], [HW, DWIN.z1 - 20], [180, DWIN.z1 + 140], [180, DWIN.z0 + 160]]);
      if (sp) { X.save(); X.globalCompositeOperation = 'lighter'; S(sp, { fill: rgba('#FFE7B0', a * .7), stroke: null }); X.restore(); }
    }
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]); if (q) S(q, { fill: C.ceil, stroke: null });
    for (const z of [520, 700]) { const b = P.poly([[-HW, CEIL, z], [HW, CEIL, z], [HW, CEIL, z + 30], [-HW, CEIL, z + 30]]); if (b) S(b, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .7) }); }
  }
  // A garden view (orange autumn trees) into a clip region, sky by time of day.
  function garden(P, top, bot, l, r, t, o, seed) {
    const T = TIMES[o.time] || TIMES.day;
    X.fillStyle = linGrad(0, top, 0, bot, [[0, T.sky[0]], [1, T.sky[1]]]); X.fillRect(l - 5, top - 5, r - l + 10, bot - top + 10);
    if (T.dusk) for (let i = 0; i < 6; i++) circle(lerp(l, r, hash(i + seed)), lerp(top, (top + bot) / 2, hash(i * 3 + seed)), 1.4, { fill: '#FFF6D0', stroke: null });
    else circle(lerp(l, r, .78), lerp(top, bot, .22), (bot - top) * .08, { fill: T.sun > .5 ? '#FFD27A' : '#FFF4B8', stroke: null });
    const h = bot - top, w = r - l, gy = bot - h * .22;
    S([[l - 5, gy], [r + 5, gy], [r + 5, bot + 5], [l - 5, bot + 5]], { fill: mixCol('#9CB65A', '#3A2A40', T.dusk * .5), stroke: null });
    for (let i = 0; i < 9; i++) { const fx = l + i * w / 8; S(rectPts(fx - w * .008, gy - h * .1, w * .016, h * .14), { fill: mixCol('#FFF8EC', '#7A6A80', T.dusk * .4), stroke: null }); }
    line([[l, gy - h * .07], [r, gy - h * .07]], { stroke: mixCol('#FFF8EC', '#7A6A80', T.dusk * .4), lwPx: Math.max(1, h * .012) });
    const LV = ['#E8742A', '#D9452F', '#F2B33A', '#C8641A', '#F08A2C'];
    for (let i = 0; i < 6; i++) {
      const cx = l + (i + .3 + hash(i + seed) * .5) * w / 5.5, ch = h * (.32 + hash(i * 2 + seed) * .18), cr = w * (.09 + hash(i + 4 + seed) * .05), sw = wob(t, .18, i + seed) * cr * .04;
      S(rectPts(cx - cr * .08, gy - ch * .55, cr * .16, ch * .55 + 2), { fill: mixCol('#6F4A30', '#2A2030', T.dusk * .5), stroke: null });
      for (let j = 0; j < 4; j++) circle(cx + (j - 1.5) * cr * .4 + sw, gy - ch * .7 - (j % 2) * cr * .35, cr * (.55 + hash(j + i) * .2), { fill: mixCol(LV[(i + j) % 5], '#3A2A50', T.dusk * .45), stroke: null });
    }
    for (let i = 0; i < 5; i++) { const u = frac(t * .07 + hash(i * 5 + seed)), lx = lerp(l, r, hash(i + 11 + seed)) + Math.sin(t * 1.3 + i) * w * .04, ly = lerp(top, bot, u);
      ellipse(lx, ly, w * .012, w * .007, { fill: LV[i % 5], stroke: null, rot: t * 2 + i }); }
  }
  function steamFog(q, amt) { if (amt < .01) return; S(q, { fill: rgba('#FFFFFF', .55 * amt), stroke: null }); }

  // The cooking wall (Z = 1300): tiles, the sink window, the clock, the hood chimney, shelves and the sign.
  function cookWall(P, t, o) {
    const T = TIMES[o.time] || TIMES.day, mess = clamp(o.mess || 0), ov = ovenOpt(o);
    P.plane(FRONT, () => {
      wallBand(P, -HW, HW, { noWainscot: true });
      S(rectPts(-HW, -150, HW * 2, 60), { fill: C.tile, stroke: null });                  // white subway tile backsplash
      const sc = pxScale();
      X.strokeStyle = C.tileLn; X.lineCap = 'round';
      X.lineWidth = px(P, .6) / sc; X.beginPath();
      for (let y = 92; y < 150; y += 9) { X.moveTo(-HW, -y); X.lineTo(HW, -y); }
      X.stroke();
      X.lineWidth = px(P, .5) / sc; X.beginPath();
      for (let r = 0; r < 7; r++) for (let x = -HW + (r % 2) * 9; x < HW; x += 18) { X.moveTo(x, -92 - r * 9); X.lineTo(x, -101 - r * 9); }
      X.stroke();
      // the window over the sink
      const w = KWIN; S(rectPts(w.x0 - 8, -w.y1 - 8, w.x1 - w.x0 + 16, w.y1 - w.y0 + 16), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, 1) });
      X.save(); X.beginPath(); X.rect(w.x0, -w.y1, w.x1 - w.x0, w.y1 - w.y0); X.clip(); garden(P, -w.y1, -w.y0, w.x0, w.x1, t, o, 3);
      steamFog(rectPts(w.x0, -w.y1, w.x1 - w.x0, w.y1 - w.y0), clamp(o.steam || 0)); X.restore();
      line([[(w.x0 + w.x1) / 2, -w.y1], [(w.x0 + w.x1) / 2, -w.y0]], { stroke: C.trim, lwPx: px(P, 4) });
      line([[w.x0, -(w.y0 + w.y1) / 2], [w.x1, -(w.y0 + w.y1) / 2]], { stroke: C.trim, lwPx: px(P, 4) });
      S(rectPts(w.x0 - 14, -w.y0 - 2, w.x1 - w.x0 + 28, 7), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .9) });   // the sill
      readable(P, w.x0 + 22, -w.y0 - 2, () => PROP.plant(px(P, .8), t)); readable(P, w.x1 - 26, -w.y0 - 2, () => PROP.jar(px(P, .8), '#F2C440', 10));
      // café curtains: a gingham valance
      const vy = -w.y1 - 4; S([[w.x0 - 16, vy - 6], [w.x1 + 16, vy - 6], [w.x1 + 16, vy + 22], ...Array.from({ length: 9 }, (_, i) => [lerp(w.x1 + 16, w.x0 - 16, (i + .5) / 9), vy + 22 + (i % 2 ? 0 : 6)]), [w.x0 - 16, vy + 22]], { fill: C.coral, stroke: C.line, lwPx: px(P, .9), smooth: .2 });
      for (let x = w.x0 - 12; x < w.x1 + 12; x += 12) line([[x, vy - 5], [x, vy + 22]], { stroke: rgba('#FFFFFF', .45), lwPx: px(P, 2.5) });
      // the wall clock over the window
      const K = CLOCK; circle(K.x, -K.y, K.r + 2, { fill: C.woodDk, stroke: C.line, lwPx: px(P, 1) }); circle(K.x, -K.y, K.r - 1, { fill: C.cream, stroke: C.line, lwPx: px(P, .6) });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[K.x + Math.sin(a) * (K.r - 4), -K.y - Math.cos(a) * (K.r - 4)], [K.x + Math.sin(a) * (K.r - 2), -K.y - Math.cos(a) * (K.r - 2)]], { stroke: C.line, lwPx: px(P, .6) }); }
      const hr = (TIMES[o.time] ? { morning: 8, day: 13, evening: 18 }[o.time] : 13) + t / 3600, ha = hr / 12 * TAU * P.dir, ma = frac(hr) * TAU * P.dir;
      line([[K.x, -K.y], [K.x + Math.sin(ha) * K.r * .5, -K.y - Math.cos(ha) * K.r * .5]], { stroke: C.line, lwPx: px(P, 1.4) });
      line([[K.x, -K.y], [K.x + Math.sin(ma) * K.r * .8, -K.y - Math.cos(ma) * K.r * .8]], { stroke: C.line, lwPx: px(P, 1) });
      const sa = (t % 60) / 60 * TAU * P.dir; line([[K.x, -K.y], [K.x + Math.sin(sa) * K.r * .82, -K.y - Math.cos(sa) * K.r * .82]], { stroke: C.red, lwPx: px(P, .6) });
      // the hood chimney (the hood itself is a 3D piece) and its scorch mark
      S(rectPts(-30, -CEIL + 12, 60, CEIL - 12 - HOOD.y1), { fill: C.steel, stroke: C.line, lwPx: px(P, 1) });
      line([[-22, -CEIL + 14], [-22, -HOOD.y1]], { stroke: C.steelLt, lwPx: px(P, 2) });
      if (mess > .05 || ov.smoke > .3) { const k = Math.max(mess, (ov.smoke - .3) * 1.2); S([[-80, -HOOD.y1], [-50, -HOOD.y1 - 40 * k], [-20, -HOOD.y1 - 22 * k], [0, -HOOD.y1 - 62 * k], [24, -HOOD.y1 - 30 * k], [52, -HOOD.y1 - 48 * k], [84, -HOOD.y1]], { fill: rgba('#2A2026', .75 * clamp(k)), stroke: null, smooth: .5 }); }
      // the spice rack on the backsplash (right of the range)
      S(rectPts(110, -142, 150, 4), { fill: C.woodLt, stroke: C.line, lwPx: px(P, .7) }); S(rectPts(110, -120, 150, 4), { fill: C.woodLt, stroke: C.line, lwPx: px(P, .7) });
      ['#C8641A', '#D9452F', '#5E9E45', '#E8B84A', '#8A5530', '#E9806A', '#7B3F5E', '#3F7A32'].forEach((c, i) => { readable(P, 120 + i * 18, -142, () => PROP.jar(px(P, .6), c, 11)); readable(P, 124 + i * 18, -120, () => PROP.jar(px(P, .6), ['#F2C440', '#9BCB4A', '#C8641A', '#FFFFFF'][i % 4], 9)); });
      // the copper pots on a rail (left of the window)
      line([[-560, -142], [-400, -142]], { stroke: C.copperDk, lwPx: px(P, 2.4) });
      [[-545, 'ladle'], [-520, 13], [-490, 'whisk'], [-465, 10], [-438, 'spatula'], [-415, 8]].forEach(([x, k], i) => {
        line([[x, -142], [x, -132]], { stroke: C.steelDk, lwPx: px(P, .8) });
        if (typeof k === 'number') { readable(P, x, -132 + k * 1.8 + 8, () => { X.rotate(wob(t, .3, i) * .02); PROP.pot(px(P, .8), k); }); }
        else if (k === 'ladle') { line([[x, -132], [x, -110]], { stroke: C.steelDk, lwPx: px(P, 1.5) }); ellipse(x, -106, 5, 4, { fill: C.steel, stroke: C.line, lwPx: px(P, .6) }); }
        else if (k === 'whisk') { line([[x, -132], [x, -122]], { stroke: C.steelDk, lwPx: px(P, 1.5) }); for (const r of [4, 2.5]) ellipse(x, -113, r, 9, { fill: null, stroke: C.steelDk, lwPx: px(P, .6) }); }
        else { line([[x, -132], [x, -114]], { stroke: C.woodDk, lwPx: px(P, 1.5) }); S(rectPts(x - 5, -114, 10, 10), { fill: '#3A3438', stroke: C.line, lwPx: px(P, .6) }); }
      });
      // KISS THE COOK, over the right upper cabinets
      S(rectPts(130, -292, 140, 30), { fill: C.cream, stroke: C.line, lwPx: px(P, 1), smooth: .1 }); readable(P, 200, -277, () => label('KISS THE COOK', 0, 0, 13, C.redDk, 800));
      readable(P, 141, -277, () => { S([[0, 4], [-6, -2], [-3, -6], [0, -3], [3, -6], [6, -2]], { fill: C.red, stroke: null, smooth: .3 }); });
      if (o.thanksgiving) bunting(P, -HW + 20, HW - 20, 268, t, 0, 'GIVE THANKS');
      if (mess > .05) splats(P, mess, 1, [[-590, 150, 120, 240], [-140, 150, 200, 290], [270, 150, 390, 250], [-600, 92, 600, 150]]);
    });
  }
  // The dining wall (Z = 0): the family picture, two sconces, a plate rail. Only seen from the dining view.
  function dineWall(P, t, o) {
    const lit = lampsOf(o);
    P.plane(BACK, () => {
      wallBand(P, -HW, HW);
      S(rectPts(-HW, -210, HW * 2, 5), { fill: C.woodLt, stroke: C.line, lwPx: px(P, .7) });                                // a plate rail
      [-520, -440, -360, 360, 440, 520].forEach((x, i) => { circle(x, -228, 18, { fill: C.enamel, stroke: C.line, lwPx: px(P, .8) }); circle(x, -228, 12, { fill: null, stroke: [C.navy, C.coral, C.sage][i % 3], lwPx: px(P, 1.6) }); });
      S(rectPts(-140, -282, 280, 150), { fill: C.gold, stroke: C.line, lwPx: px(P, 1.2) });                                  // the family picture
      S(rectPts(-128, -270, 256, 126), { fill: '#F8D9A8', stroke: null });
      S([[-128, -144], [-128, -175], [-60, -186], [20, -178], [128, -190], [128, -144]], { fill: '#E8A05A', stroke: null });
      [[-90, '#E9C3A0', 22, '#3A2A22', C.navy], [-52, '#DCA887', 20, '#282027', '#F1F0EA'], [-14, '#F2C9A8', 16, '#5A2E6E', '#B678E0'], [20, '#E9C3A0', 15, '#3A2A22', C.orange], [56, '#DCA887', 21, '#3A2A22', C.coral], [92, '#C98A5E', 17, '#2A1E1A', C.leaf]].forEach(([x, skin, r, hair, shirt]) => {
        const hy = -172 - r;
        S([[x - r * .9, -144], [x - r * .8, hy + r * 1.1], [x + r * .8, hy + r * 1.1], [x + r * .9, -144]], { fill: shirt, stroke: C.line, lwPx: px(P, .6), smooth: .3 });
        circle(x, hy, r * .62, { fill: skin, stroke: C.line, lwPx: px(P, .6) });
        S([[x - r * .64, hy - r * .05], [x - r * .5, hy - r * .55], [x, hy - r * .7], [x + r * .5, hy - r * .55], [x + r * .64, hy - r * .05], [x + r * .3, hy - r * .35], [x - r * .3, hy - r * .35]], { fill: hair, stroke: null, smooth: .4 });
        for (const sd of [-1, 1]) circle(x + sd * r * .22, hy + r * .02, r * .07, { fill: '#2A1E22', stroke: null });
        line([[x - r * .2, hy + r * .22], [x, hy + r * .32], [x + r * .2, hy + r * .22]], { stroke: '#2A1E22', lwPx: px(P, .8), smooth: true });
      });
      readable(P, 0, -262, () => label('THE SAFADIS', 0, 0, 10, C.woodDk, 800));
      for (const x of [-230, 230]) {                                                                                        // sconces
        glowAt(x, -190, 60, 46, '#FFE4B0', .6 * lit);
        S(rectPts(x - 4, -185, 8, 20), { fill: C.gold, stroke: C.line, lwPx: px(P, .7) }); S([[x - 12, -185], [x + 12, -185], [x + 8, -209], [x - 8, -209]], { fill: lit > .05 ? '#FFF3D6' : C.cream, stroke: C.line, lwPx: px(P, .8) });
      }
      if (o.thanksgiving) { bunting(P, -HW + 20, HW - 20, 292, t, 2, 'HAPPY THANKSGIVING'); garland(P, -250, 250, 96, t); }
      if (clamp(o.mess || 0) > .5) splats(P, (o.mess - .5) * 2, 7, [[-600, 20, -260, 90], [260, 20, 600, 90]]);
    });
  }
  // A pennant string across a wall plane, with letters (readable from either view).
  function bunting(P, x0, x1, y, t, seed, text) {
    const n = text.length + 4, pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([lerp(x0, x1, u), -y + 22 * Math.sin(Math.PI * u) + 1.2 * Math.sin(t * 1.4 + u * 6 + seed)]); }
    line(pts, { stroke: C.line, lwPx: px(P, .9) });
    const COLS = [C.orange, C.gold, C.redDk, C.cream, C.leaf, C.plum];
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[i + 1], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 26];
      S([a, b, m], { fill: COLS[(i + seed) % COLS.length], stroke: C.line, lwPx: px(P, .7) });
      const ci = P.dir > 0 ? i - 2 : n - 3 - i, ch = text[ci]; if (ch && ch !== ' ') readable(P, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 9, () => label(ch, 0, 0, 11, (i + seed) % COLS.length === 3 ? C.redDk : '#FFFDF6', 800, FONT_SFX)); }
  }
  // An autumn garland of leaves, little pumpkins and berries along the sideboard top (wall plane).
  function garland(P, x0, x1, y, t) {
    const pts = []; for (let i = 0; i <= 20; i++) pts.push([lerp(x0, x1, i / 20), -y - 4 - 6 * Math.sin(i / 20 * Math.PI * 4)]);
    line(pts, { stroke: '#6E7B3A', lwPx: px(P, 1.4), smooth: true });
    const LV = ['#E8742A', '#D9452F', '#F2B33A', '#C8641A'];
    pts.forEach(([x, yy], i) => { ellipse(x, yy, 9, 5, { fill: LV[i % 4], stroke: C.line, lwPx: px(P, .5), rot: hash(i) * 3 }); if (i % 5 === 2) readable(P, x, yy + 6, () => PROP.pumpkin(px(P, .6), 7)); if (i % 3 === 1) circle(x + 5, yy - 3, 2.2, { fill: C.redDk, stroke: null }); });
  }
  // Mess splats on a wall plane: rects [x0, y0, x1, y1] in world X / Y where they may land.
  function splats(P, amt, seed, areas) {
    const COLS = ['#F6F0E2', '#E8742A', '#B5532A', '#F7C531', '#FFFFFF', '#8A4A2A'];
    areas.forEach(([x0, y0, x1, y1], a) => {
      const n = Math.round(amt * (4 + (x1 - x0) / 90));
      for (let i = 0; i < n; i++) { const h = seed * 31 + a * 7 + i, x = lerp(x0, x1, hash(h)), y = lerp(y0, y1, hash(h + .5)), r = 4 + hash(h + .2) * 7, c = COLS[(i + a) % COLS.length];
        const pts = Array.from({ length: 10 }, (_, j) => { const an = j / 10 * TAU, rr = r * (j % 2 ? .55 : 1) * (.8 + hash(h + j) * .4); return [x + Math.cos(an) * rr, -y + Math.sin(an) * rr]; });
        S(pts, { fill: c, stroke: null, alpha: .9, smooth: .3 });
        if (hash(h + .9) < .5) S([[x - 1.5, -y], [x + 1.5, -y], [x + 1, -y + r * 2.4], [x, -y + r * 2.8], [x - 1, -y + r * 2.4]], { fill: c, stroke: null, alpha: .9, smooth: .3 });   // a drip
      }
    });
  }
  function sideWall(P, x, t, o) {
    const q = wrect(P, x, BACK, FRONT, 0, CEIL); if (q) S(q, { fill: C.wall, stroke: null });
    const holes = x > 0 ? [[DWIN.z0 - 30, DWIN.z1 + 30], [BACKDOOR.z0 - 10, BACKDOOR.z1 + 10], [FRIDGE.z0 - 10, FRONT]] : [[ARCH.z0 - 10, ARCH.z1 + 10], [PANTRY.z0 - 10, PANTRY.z1 + 10], [COUNTER.z0 - 10, FRONT]];
    const wn = wrect(P, x, BACK, FRONT, 0, RAIL); if (wn) S(wn, { fill: C.sage, stroke: null });
    for (let z = 24; z < FRONT - 70; z += 100) { if (holes.some(([a, b]) => z + 80 > a && z < b)) continue; const p = wrect(P, x, z, z + 80, 18, RAIL - 18); if (p) S(p, { fill: null, stroke: C.sageDk, lwPx: px(P, 1) }); }
    for (const [y0, y1] of [[RAIL - 5, RAIL + 2], [0, 12], [CEIL - 12, CEIL]]) { const r = wrect(P, x, BACK, FRONT, y0, y1); if (r) S(r, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .7) }); }
    if (x > 0) { diningWindow(P, x, t, o); backDoor(P, x, t, o); calendar(P, x); } else { archway(P, x, t, o); chalkboard(P, x, o); pantryDoor(P, x); }
  }
  function diningWindow(P, x, t, o) {
    const w = DWIN, q = wrect(P, x, w.z0, w.z1, w.y0, w.y1), T = TIMES[o.time] || TIMES.day; if (!q) return;
    clipTo(q, () => { const top = Math.min(...q.map(v => v[1])), bot = Math.max(...q.map(v => v[1])), l = Math.min(...q.map(v => v[0])), r = Math.max(...q.map(v => v[0])); garden(P, top, bot, l, r, t, o, 9); steamFog(q, clamp(o.steam || 0) * .7); });
    S(q, { fill: null, stroke: C.trim, lwPx: px(P, 6) });
    for (const f of [1 / 3, 2 / 3]) { const l = P.line([[x, w.y0, lerp(w.z0, w.z1, f)], [x, w.y1, lerp(w.z0, w.z1, f)]]); if (l) line(l, { stroke: C.trim, lwPx: px(P, 3) }); }
    const l = P.line([[x, (w.y0 + w.y1) / 2 + 20, w.z0], [x, (w.y0 + w.y1) / 2 + 20, w.z1]]); if (l) line(l, { stroke: C.trim, lwPx: px(P, 3) });
    const sill = wrect(P, x, w.z0 - 14, w.z1 + 14, w.y0 - 8, w.y0); if (sill) S(sill, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, 1) });
    for (const [za, zb] of [[w.z0 - 70, w.z0 + 6], [w.z1 - 6, w.z1 + 70]]) {             // mustard curtains tied back
      const xi = x - 3, sway = wob(t, .12, za) * 2, c = wpoly(P, xi, [[za, CEIL - 22], [zb, CEIL - 22], [zb + sway - (za < w.z0 ? 0 : 30), 120], [(za + zb) / 2, 70], [za, 10]]);
      if (c) S(c, { fill: C.mustard, lwPx: px(P, 1), smooth: .15 });
      const tb = P.p(xi, 122, (za + zb) / 2); if (P.visible((za + zb) / 2)) circle(tb[0], tb[1], 4 * tb[2], { fill: C.coral, stroke: C.line, lwPx: px(P, .7) });
    }
    const rod = P.line([[x - 4, CEIL - 22, w.z0 - 80], [x - 4, CEIL - 22, w.z1 + 80]]); if (rod) line(rod, { stroke: C.woodDk, lwPx: px(P, 3) });
    if (T.sun > 0) { const beam = P.poly([[x, w.y1, w.z0], [x, w.y1, w.z1], [x - 420, 0, w.z1 + 140], [x - 420, 0, w.z0 + 160]]); if (beam) { X.save(); X.globalCompositeOperation = 'lighter'; S(beam, { fill: rgba('#FFE7B0', T.sun * .12), stroke: null }); X.restore(); } }
  }
  function backDoor(P, x, t, o) {                                                         // the back door to the garden (kitchen view, right wall)
    const D = BACKDOOR, fr = wrect(P, x, D.z0 - 8, D.z1 + 8, 0, D.h + 8); if (!fr) return; S(fr, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, 1) });
    const d = wrect(P, x - .5, D.z0, D.z1, 0, D.h); if (d) S(d, { fill: C.sage, stroke: C.line, lwPx: px(P, 1) });
    const g = wrect(P, x - 1, D.z0 + 16, D.z1 - 16, 105, D.h - 14); if (g) { clipTo(g, () => { const top = Math.min(...g.map(v => v[1])), bot = Math.max(...g.map(v => v[1])), l = Math.min(...g.map(v => v[0])), r = Math.max(...g.map(v => v[0])); garden(P, top, bot, l, r, t, o, 21); }); S(g, { fill: null, stroke: C.trim, lwPx: px(P, 3) }); }
    const mid = P.line([[x - 1.2, 105, (D.z0 + D.z1) / 2], [x - 1.2, D.h - 14, (D.z0 + D.z1) / 2]]); if (mid) line(mid, { stroke: C.trim, lwPx: px(P, 2) });
    for (const y of [20, 60]) { const p = wrect(P, x - 1, D.z0 + 16, D.z1 - 16, y, y + 30); if (p) S(p, { fill: null, stroke: C.sageDk, lwPx: px(P, .9) }); }
    const kn = P.p(x - 3, 98, D.z0 + 14); if (P.visible(D.z0)) circle(kn[0], kn[1], 2.6 * kn[2], { fill: C.gold, stroke: C.line, lwPx: px(P, .5) });
    const mat = frect(P, .4, x - 70, x - 4, D.z0, D.z1); if (mat) S(mat, { fill: C.woodDk, stroke: C.line, lwPx: px(P, .7) });
  }
  function calendar(P, x) {
    const q = wrect(P, x - 1, 940, 1010, 120, 200); if (!q) return; S(q, { fill: '#FFFDF6', stroke: C.line, lwPx: px(P, .8) });
    const hd = wrect(P, x - 1.2, 940, 1010, 182, 200); if (hd) S(hd, { fill: C.orange, stroke: null });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const cell = wrect(P, x - 1.3, 946 + c * 12.5, 955 + c * 12.5, 128 + r * 13, 136 + r * 13); if (cell) S(cell, { fill: r === 1 && c === 3 ? C.redDk : C.wallDk, stroke: null }); }
    const tb = wrect(P, x - 1.4, 960, 990, 160, 176); if (tb) { const p = P.p(x - 1.5, 168, 975); if (P.visible(975)) { X.save(); X.translate(p[0], p[1]); X.scale(p[2], p[2]); PROP.pumpkin(.7, 5); X.restore(); } }
  }
  function chalkboard(P, x, o) {                                                          // the menu board (kitchen view, left wall)
    const B = CHALK, fr = wrect(P, x + 1, B.z0 - 6, B.z1 + 6, B.y0 - 6, B.y1 + 6); if (!fr) return; S(fr, { fill: C.woodLt, stroke: C.line, lwPx: px(P, .9) });
    const b = wrect(P, x + 1.5, B.z0, B.z1, B.y0, B.y1); if (b) S(b, { fill: '#2F4A40', stroke: null });
    for (let i = 0; i < 4; i++) {                                                        // chalk scribbles (a heading, then three list lines)
      const y = B.y1 - 14 - i * 19, len = i ? 60 + hash(i + (o.thanksgiving ? 5 : 0)) * 50 : 70, pts = [];
      for (let j = 0; j <= 12; j++) pts.push([x + 2, y + Math.sin(j * 2.1 + i) * 3, B.z0 + 22 + len * j / 12]);
      const l = P.line(pts); if (l) line(l, { stroke: i ? '#F4F1E6' : C.mustard, lwPx: px(P, i ? 1.3 : 2), smooth: true });
      if (i) { const d = P.p(x + 2, y, B.z0 + 14); if (P.visible(B.z0)) circle(d[0], d[1], 1.6 * d[2], { fill: '#F4F1E6', stroke: null }); }
    }
    const tray = wrect(P, x + 3, B.z0, B.z1, B.y0 - 8, B.y0 - 4); if (tray) S(tray, { fill: C.woodLt, stroke: C.line, lwPx: px(P, .6) });
  }
  function pantryDoor(P, x) {
    const D = PANTRY, fr = wrect(P, x, D.z0 - 8, D.z1 + 8, 0, D.h + 8); if (!fr) return; S(fr, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, 1) });
    const d = wrect(P, x + .5, D.z0, D.z1, 0, D.h); if (d) S(d, { fill: C.cream, stroke: C.line, lwPx: px(P, 1) });
    for (const [y0, y1] of [[20, 90], [110, 196]]) { const p = wrect(P, x + 1, D.z0 + 14, D.z1 - 14, y0, y1); if (p) S(p, { fill: null, stroke: C.trimDk, lwPx: px(P, 1) }); }
    const sg = wrect(P, x + 1.2, D.z0 + 30, D.z1 - 30, 150, 172); if (sg) S(sg, { fill: C.woodDk, stroke: null });
    const kn = P.p(x + 3, 100, D.z1 - 14); if (P.visible(D.z1)) circle(kn[0], kn[1], 2.6 * kn[2], { fill: C.gold, stroke: C.line, lwPx: px(P, .5) });
  }
  // The archway to the hall and the living room: a real opening, with a glimpse of the blue sofa.
  function archway(P, x, t, o) {
    const A = ARCH, pts = [[A.z0, 0]]; for (let i = 0; i <= 12; i++) { const a = Math.PI - i / 12 * Math.PI; pts.push([(A.z0 + A.z1) / 2 + Math.cos(a) * (A.z1 - A.z0) / 2, A.h - 50 + Math.sin(a) * 50]); } pts.push([A.z1, 0]);
    const q = wpoly(P, x, pts); if (!q) return;
    clipTo(q, () => {
      const HX = x - 380, lit = lampsOf(o);
      const fw = wrect(P, HX, A.z0 - 300, A.z1 + 300, 0, CEIL + 100); if (fw) S(fw, { fill: C.hall, stroke: null });
      const wn = wrect(P, HX + .5, A.z0 - 300, A.z1 + 300, 0, 95); if (wn) S(wn, { fill: C.sage, stroke: null });
      const hf = P.poly([[x, 0, A.z0 - 300], [HX, 0, A.z0 - 300], [HX, 0, A.z1 + 300], [x, 0, A.z1 + 300]]); if (hf) S(hf, { fill: C.floorDk, stroke: null });
      box(P, HX + 10, HX + 110, 8, 44, A.z0 + 20, A.z1 - 20, { top: '#7C9CC2', nz: '#5C7FA8', pz: '#5C7FA8', side: '#45668C' }, { lwPx: px(P, .8) });   // the living-room sofa
      box(P, HX + 10, HX + 40, 8, 98, A.z0 + 20, A.z1 - 20, { top: '#7C9CC2', nz: '#5C7FA8', pz: '#5C7FA8', side: '#45668C' }, { lwPx: px(P, .8) });
      const lp = P.p(HX + 60, 170, A.z1 - 30); if (P.visible(A.z1)) glowAt(lp[0], lp[1], 60 * lp[2], 50 * lp[2], '#FFE4B0', .5 * lit);
      const fp = wrect(P, HX + 1, A.z0 + 60, A.z1 - 60, 140, 230); if (fp) S(fp, { fill: C.gold, stroke: C.line, lwPx: px(P, .8) });
      S(q, { fill: 'rgba(80,50,30,.12)', stroke: null });
    });
    S(q, { fill: null, stroke: C.trim, lwPx: px(P, 7) });
  }

  // ---------- the kitchen pieces ----------
  // Base cabinets: a sage run with doors and drawers, toe kick, butcher-block top. x0..x1 world X.
  function baseRun(P, x0, x1, t, o) {
    const C2 = COUNTER;
    box(P, x0, x1, 0, 8, C2.z0 + 4, C2.z1, { top: C.black, nz: '#4A3A3E', pz: '#4A3A3E', side: '#3A2E32' }, { lwPx: px(P, .6) });
    box(P, x0, x1, 8, 86, C2.z0, C2.z1, COL(C.sage), { lwPx: px(P, .9) });
    if (P.cam.z < C2.z0) P.plane(C2.z0 - .4, () => {
      const n = Math.max(1, Math.round((x1 - x0) / 60)), w = (x1 - x0) / n;
      for (let i = 0; i < n; i++) { const a = x0 + i * w;
        S(rectPts(a + 3, -84, w - 6, 16), { fill: C.sageLt, stroke: C.sageDk, lwPx: px(P, .8) }); line([[a + w / 2 - 8, -76], [a + w / 2 + 8, -76]], { stroke: C.steelDk, lwPx: px(P, 2) });
        S(rectPts(a + 3, -64, w - 6, 52), { fill: C.sage, stroke: C.sageDk, lwPx: px(P, .8) }); S(rectPts(a + 9, -58, w - 18, 40), { fill: null, stroke: C.sageDk, lwPx: px(P, .7) });
        circle(a + (i % 2 ? 10 : w - 10), -52, 1.8, { fill: C.steelDk, stroke: null }); }
    });
    box(P, x0 - 2, x1 + 2, 86, 92, C2.z0 - 5, C2.z1, { top: C.block, nz: C.blockDk, pz: C.blockDk, side: C.blockDk }, { lwPx: px(P, .9) });
    if (P.cam.y > 92) for (let x = x0 + 20; x < x1; x += 22) { const l = P.line([[x, 92.1, C2.z0 - 5], [x, 92.1, C2.z1]]); if (l) line(l, { stroke: rgba(C.blockDk, .35), lwPx: px(P, .6) }); }
  }
  function sink(P, t, o) {
    const s = SINK;
    if (P.cam.y > 92) { const b = frect(P, 92.3, s.x0, s.x1, s.z0, s.z1); if (b) S(b, { fill: C.steelDk, stroke: C.line, lwPx: px(P, .8) });
      const i = frect(P, 92.4, s.x0 + 5, s.x1 - 5, s.z0 + 4, s.z1 - 4); if (i) S(i, { fill: C.steel, stroke: null }); const d = P.floorCircle(s.x, s.z, 3, 92.5, 10); if (d) S(d, { fill: '#3A3438', stroke: null }); }
    sprite(P, s.x, 92, s.z1 + 4, k => { const lw = lwk(k);                              // the gooseneck faucet
      line([[0, 0], [0, -26], [4, -32], [12, -32], [15, -26], [15, -22]], { stroke: C.line, lwPx: lw * 6, smooth: .5 }); line([[0, 0], [0, -26], [4, -32], [12, -32], [15, -26], [15, -22]], { stroke: C.chrome, lwPx: lw * 4, smooth: .5 });
      for (const sd of [-1, 1]) { S(rectPts(sd * 9 - 2, -6, 4, 6), { fill: C.chrome, stroke: C.line, lwPx: lw * .6 }); } });
    sprite(P, s.x0 - 40, 92, 1270, k => { const lw = lwk(k);                                // a dish rack with plates
      S(rectPts(-20, -6, 40, 6), { fill: C.steelLt, stroke: C.line, lwPx: lw }); for (let i = 0; i < 5; i++) ellipse(-12 + i * 6, -14, 2, 11, { fill: [C.enamel, C.sageLt, C.enamel, '#CFE7F5', C.enamel][i], stroke: C.line, lwPx: lw * .6 }); });
    sprite(P, s.x1 + 18, 92, 1275, k => { const lw = lwk(k); S([[-3, 0], [3, 0], [3, -14], [1.5, -18], [-1.5, -18], [-3, -14]], { fill: '#7CC8A0', stroke: C.line, lwPx: lw }); S(rectPts(-1.2, -21, 2.4, 3), { fill: C.white, stroke: C.line, lwPx: lw * .6 }); });   // dish soap
  }
  function range(P, t, o) {
    const R = OVEN, ov = ovenOpt(o), g = ovenGlow(ov), z0 = R.z, D = R.door, open = clamp(ov.door);
    box(P, R.x0, R.x1, 0, 8, z0 + 4, FRONT - 2, '#3A3438', { lwPx: px(P, .6) });
    box(P, R.x0, R.x1, 8, 88, z0, FRONT - 2, { top: C.enamel, nz: C.enamel, pz: C.enamel, side: C.enamelDk });
    box(P, R.x0, R.x1, 88, 92, z0, FRONT - 2, { top: '#2E2A30', nz: '#3A3438', pz: '#3A3438', side: '#3A3438' }, { lwPx: px(P, .8) });   // the cooktop
    box(P, R.x0, R.x1, 92, 120, FRONT - 14, FRONT - 2, { top: C.enamel, nz: C.enamel, pz: C.enamel, side: C.enamelDk }, { lwPx: px(P, .8) });   // the backguard
    if (P.cam.z < FRONT - 14) P.plane(FRONT - 14.4, () => { readable(P, 0, -106, () => { S(rectPts(-18, -6, 36, 12), { fill: '#1E2A26', stroke: C.line, lwPx: px(P, .6), smooth: .2 }); label(ov.on ? '350°' : '12:00', 0, .5, 7, ov.on ? '#FF8A4A' : '#7CFF9B', 800); }); });
    if (P.cam.y > 92) for (const [bx, bz, r] of [[-30, 1250, 13], [30, 1250, 13], [-30, 1280, 10], [30, 1280, 10]]) {
      const b = P.floorCircle(bx, bz, r, 92.2, 18); if (b) S(b, { fill: '#45404A', stroke: '#1E1A1E', lwPx: px(P, .7) });
      const b2 = P.floorCircle(bx, bz, r * .55, 92.3, 14); if (b2) S(b2, { fill: null, stroke: '#1E1A1E', lwPx: px(P, .7) }); }
    if (P.cam.z >= z0) return;
    // the cavity (seen through the glass, or through the opening when the door is down)
    const cav = P.poly([[D.x0 + 4, D.y0 + 2, z0], [D.x1 - 4, D.y0 + 2, z0], [D.x1 - 4, D.y1 - 2, z0], [D.x0 + 4, D.y1 - 2, z0]]);
    const interior = () => {
      const bk = P.poly([[D.x0 + 4, D.y0 + 2, R.back], [D.x1 - 4, D.y0 + 2, R.back], [D.x1 - 4, D.y1 - 2, R.back], [D.x0 + 4, D.y1 - 2, R.back]]);
      const dark = mixCol('#2B2228', '#FF7A2A', g * .55);
      if (cav) S(cav, { fill: mixCol('#1E181C', '#B8481E', g * .6), stroke: null });
      const fl = P.poly([[D.x0 + 4, D.y0 + 2, z0], [D.x1 - 4, D.y0 + 2, z0], [D.x1 - 4, D.y0 + 2, R.back], [D.x0 + 4, D.y0 + 2, R.back]]); if (fl) S(fl, { fill: mixCol('#2B2228', '#FF9A4A', g * .4), stroke: null });
      const tp = P.poly([[D.x0 + 4, D.y1 - 2, z0], [D.x1 - 4, D.y1 - 2, z0], [D.x1 - 4, D.y1 - 2, R.back], [D.x0 + 4, D.y1 - 2, R.back]]); if (tp) S(tp, { fill: mixCol('#151114', '#E85A1E', g * .5), stroke: null });
      if (bk) S(bk, { fill: dark, stroke: null });
      if (g > .05) { const el = P.line([[D.x0 + 8, D.y1 - 5, R.back - 4], [D.x1 - 8, D.y1 - 5, R.back - 4]]); if (el) line(el, { stroke: mixCol('#7A2A10', '#FF5A1A', g), lwPx: px(P, 3) }); }
      for (const rz of [z0 + 8, R.back - 6]) { const rk = P.line([[D.x0 + 6, R.rack, rz], [D.x1 - 6, R.rack, rz]]); if (rk) line(rk, { stroke: C.steelDk, lwPx: px(P, 1.4) }); }
      for (let i = 0; i < 7; i++) { const x = D.x0 + 10 + i * 14, rk = P.line([[x, R.rack, z0 + 8], [x, R.rack, R.back - 6]]); if (rk) line(rk, { stroke: C.steelDk, lwPx: px(P, .9) }); }
      if (typeof o.inOven === 'function') o.inOven(P, t);
      if (g > .05 && cav) { const c = cav.reduce((a, p) => [a[0] + p[0] / cav.length, a[1] + p[1] / cav.length], [0, 0]); glowAt(c[0], c[1], 130 * P.k(z0) * .4, 70 * P.k(z0) * .4, '#FF9A3A', .3 * g); }
    };
    if (cav) clipTo(cav, interior);
    if (cav) S(cav, { fill: null, stroke: '#1E181C', lwPx: px(P, 1.2) });
    // the door, hinged at its bottom edge, swinging down toward the camera
    const ang = open * Math.PI / 2, hh = D.y1 - D.y0, dp = (u, v) => [D.y0 + Math.cos(ang) * v + 0 * u, z0 - Math.sin(ang) * v - .5];
    const quad = (x0, x1, v0, v1, dz = 0) => { const [ya, za] = dp(0, v0), [yb, zb] = dp(0, v1); return P.poly([[x0, ya, za - dz], [x1, ya, za - dz], [x1, yb, zb - dz], [x0, yb, zb - dz]]); };
    const dq = quad(D.x0, D.x1, 0, hh); if (dq) S(dq, { fill: C.enamel, stroke: C.line, lwPx: px(P, 1) });
    const G = R.glass, gq = quad(G.x0, G.x1, G.y0 - D.y0, G.y1 - D.y0, .3);
    if (gq) { if (open < .02 && cav) { clipTo(gq, interior); } else S(gq, { fill: mixCol('#2D2A33', '#C05A2A', g * .5), stroke: null });
      S(gq, { fill: rgba('#2D2A33', open < .02 ? .45 - g * .25 : .6), stroke: null });
      clipTo(gq, () => { const c = gq; S([lerp2(c[3], c[2], .15), lerp2(c[3], c[2], .35), lerp2(c[0], c[1], .2), lerp2(c[0], c[1], 0)], { fill: 'rgba(255,255,255,.18)', stroke: null }); });
      S(gq, { fill: null, stroke: '#1E181C', lwPx: px(P, 1.2) }); }
    const hq = quad(D.x0 + 14, D.x1 - 14, hh - 6, hh - 3, 3); if (hq) S(hq, { fill: C.chrome, stroke: C.line, lwPx: px(P, .9) });   // the handle
    // the control strip: four knobs and the big dial
    P.plane(z0 - .4, () => { S(rectPts(R.x0 + 4, -86, R.x1 - R.x0 - 8, 12), { fill: C.enamelDk, stroke: C.line, lwPx: px(P, .6) });
      for (const kx of [-48, -36, 36, 48]) { circle(kx, -80, 4, { fill: C.chrome, stroke: C.line, lwPx: px(P, .6) }); line([[kx, -80], [kx, -83.5]], { stroke: C.line, lwPx: px(P, .8) }); }
      const da = (ov.dial ?? (ov.on ? .6 : 0)) * 4.4 - 2.2; circle(0, -80, 7, { fill: '#2E2A30', stroke: C.line, lwPx: px(P, .8) }); circle(0, -80, 5, { fill: C.chrome, stroke: null });
      line([[0, -80], [Math.sin(da) * 5 * P.dir, -80 - Math.cos(da) * 5]], { stroke: C.red, lwPx: px(P, 1.4) });
      if (ov.on) circle(-22, -80, 1.8, { fill: '#FF6A3A', stroke: null }); S(rectPts(R.x0 + 4, -8, R.x1 - R.x0 - 8, 4), { fill: C.enamelDk, stroke: null }); });
    if (g > .05) { const p = P.p(0, 40, z0 - 10); glowAt(p[0], p[1] + 30 * p[2], 140 * p[2], 60 * p[2], '#FF8A3A', .25 * g * (1 + open)); }
  }
  const lerp2 = (a, b, f) => [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
  function hood(P, t, o) {
    const H = HOOD;
    const q = P.poly([[H.x0, H.y0, H.z], [H.x1, H.y0, H.z], [30, H.y1, 1280], [-30, H.y1, 1280]]); if (q) S(q, { fill: C.steel, stroke: C.line, lwPx: px(P, 1) });
    if (P.cam.y < H.y0) { const b = P.poly([[H.x0, H.y0, H.z], [H.x1, H.y0, H.z], [H.x1, H.y0, FRONT], [H.x0, H.y0, FRONT]]); if (b) S(b, { fill: C.steelDk, stroke: C.line, lwPx: px(P, .8) }); }
    box(P, H.x0 - 2, H.x1 + 2, H.y0 - 6, H.y0, H.z - 2, FRONT, { top: C.steelLt, nz: C.steelLt, pz: C.steelLt, side: C.steel }, { lwPx: px(P, .8) });
    const ov = ovenOpt(o), lit = ov.on || lampsOf(o) > .3; if (lit) { const p = P.p(0, H.y0 - 6, 1270); glowAt(p[0], p[1] + 20 * p[2], 60 * p[2], 30 * p[2], '#FFE4B0', .4); }
    const l = P.line([[H.x0 + 20, H.y0 + 14, H.z + 4], [H.x1 - 20, H.y0 + 14, H.z + 4]]); if (l) line(l, { stroke: C.steelLt, lwPx: px(P, 1.6) });
  }
  function uppers(P, x0, x1, y0 = 150, y1 = 256) {
    box(P, x0, x1, y0, y1, 1265, FRONT, COL(C.sage), { lwPx: px(P, .9) });
    if (P.cam.z < 1265) P.plane(1564.6, () => { const n = Math.max(1, Math.round((x1 - x0) / 55)), w = (x1 - x0) / n;
      for (let i = 0; i < n; i++) { const a = x0 + i * w; S(rectPts(a + 3, -y1 + 4, w - 6, y1 - y0 - 8), { fill: C.sage, stroke: C.sageDk, lwPx: px(P, .8) });
        S(rectPts(a + 10, -y1 + 12, w - 20, y1 - y0 - 24), { fill: i % 2 ? C.sageLt : 'rgba(225,240,245,.75)', stroke: C.sageDk, lwPx: px(P, .7) });
        if (!(i % 2)) for (let j = 0; j < 3; j++) S(rectPts(a + 13 + j * 9, -y0 - 18 - (j % 2) * 4, 7, 10 + (j % 2) * 4), { fill: [C.coral, C.navy, C.mustard][j], stroke: null, alpha: .5 });
        circle(a + (i % 2 ? 9 : w - 9), -y0 - 12, 1.8, { fill: C.steelDk, stroke: null }); } });
    box(P, x0 - 3, x1 + 3, y1, y1 + 6, 1260, FRONT, COL(C.trim), { lwPx: px(P, .7) });
  }
  function fridge(P, t, o) {
    const F = FRIDGE;
    box(P, F.x0, F.x1, 0, F.y, F.z0, F.z1, { top: C.enamel, nz: '#F3EFE6', pz: '#F3EFE6', side: C.enamelDk });
    uppers(P, F.x0, F.x1, F.y + 6, 270);
    if (P.cam.z >= F.z0) return;
    P.plane(F.z0 - .4, () => {
      const xa = F.x0, xb = F.x1, w = xb - xa;
      line([[xa + 3, -140], [xb - 3, -140]], { stroke: C.enamelDk, lwPx: px(P, 1.6) });
      for (const [y0, y1] of [[-200, -150], [-130, -40]]) { S(rectPts(xa + 8, y0, 5, y1 - y0), { fill: C.chrome, stroke: C.line, lwPx: px(P, .7), smooth: .3 }); }
      readable(P, (xa + xb) / 2, -204, () => label('Frost', 0, 0, 7, C.steelDk, 700));
      // the kids' drawings and magnets
      const pics = [[xa + 22, -196, 36, 30, 0], [xa + 70, -188, 40, 32, 1], [xa + 28, -128, 44, 36, 2], [xa + 80, -120, 36, 44, 3], [xa + 24, -82, 40, 30, 4], [xa + 74, -66, 42, 34, 5], [xa + 40, -36, 34, 26, 6]];
      pics.forEach(([x, y, pw, ph, k], i) => { X.save(); X.translate(x + pw / 2, y + ph / 2); X.rotate((hash(i + 3) - .5) * .18); X.translate(-pw / 2, -ph / 2);
        S(rectPts(0, 0, pw, ph), { fill: ['#FFFDF6', '#FFF3C8', '#E6F3FF', '#FFFDF6', '#FCE4EC', '#FFFDF6', '#EAF6DE'][k], stroke: C.line, lwPx: px(P, .5) }); kidArt(k, pw, ph, px(P, .9));
        circle(pw / 2, 2, 2.6, { fill: [C.red, C.navy, C.mustard, C.leaf, C.coral, C.plum, C.orange][i], stroke: C.line, lwPx: px(P, .4) }); X.restore(); });
      [[xa + 120, -170, C.red], [xa + 118, -100, C.leaf], [xa + 64, -146, C.mustard]].forEach(([x, y, c]) => { circle(x, y, 3.4, { fill: c, stroke: C.line, lwPx: px(P, .5) }); });
      readable(P, xa + 116, -40, () => { ['A', 'B', 'C'].forEach((ch, i) => label(ch, i * 7 - 7, 0, 9, [C.red, C.navy, C.leaf][i], 600, FONT_SFX)); });
    });
  }
  function kidArt(k, w, h, lw) {                                                          // crayon drawings (local px: 0..w, 0..h)
    const ink = '#2A1E22';
    if (k === 0) { circle(w * .78, h * .28, h * .16, { fill: '#F7C531', stroke: null }); S([[0, h], [w * .35, h * .45], [w * .7, h]], { fill: '#5E9E45', stroke: null }); line([[w * .2, h * .6], [w * .2, h * .85]], { stroke: ink, lwPx: lw }); circle(w * .2, h * .52, h * .08, { fill: null, stroke: ink, lwPx: lw }); }
    else if (k === 1) { [C.red, C.orange, '#F7C531', C.leaf, '#5AA9E6', C.plum].forEach((c, i) => { X.beginPath(); X.arc(w / 2, h * .95, w * (.42 - i * .055), Math.PI, TAU); X.strokeStyle = c; X.lineWidth = w * .05; X.stroke(); }); }
    else if (k === 2) { S([[w * .2, h * .9], [w * .2, h * .5], [w * .5, h * .25], [w * .8, h * .5], [w * .8, h * .9]], { fill: '#E9806A', stroke: ink, lwPx: lw }); S(rectPts(w * .43, h * .65, w * .14, h * .25), { fill: '#6A4129', stroke: null }); circle(w * .12, h * .2, h * .08, { fill: '#F7C531', stroke: null }); }
    else if (k === 3) { ellipse(w / 2, h * .55, w * .3, h * .22, { fill: '#C8641A', stroke: ink, lwPx: lw }); for (let i = 0; i < 5; i++) { const a = -2.6 + i * .5; line([[w / 2, h * .45], [w / 2 + Math.cos(a) * w * .4, h * .45 + Math.sin(a) * h * .4]], { stroke: [C.red, C.orange, '#F7C531', C.leaf, '#5AA9E6'][i], lwPx: lw * 2.4 }); } circle(w * .68, h * .45, h * .06, { fill: C.red, stroke: null }); }   // a hand turkey
    else if (k === 4) { for (let i = 0; i < 3; i++) { const x = w * (.25 + i * .25); circle(x, h * .4, h * .1, { fill: null, stroke: ink, lwPx: lw }); line([[x, h * .5], [x, h * .78]], { stroke: ink, lwPx: lw }); line([[x - w * .07, h * .6], [x + w * .07, h * .6]], { stroke: ink, lwPx: lw }); } }
    else if (k === 5) { S(starPts(w / 2, h / 2, h * .36, .45), { fill: '#F7C531', stroke: ink, lwPx: lw }); }
    else { S([[w * .1, h * .7], [w * .45, h * .4], [w * .9, h * .5], [w * .6, h * .8]], { fill: '#5AA9E6', stroke: ink, lwPx: lw, smooth: .5 }); circle(w * .7, h * .52, h * .05, { fill: ink, stroke: null }); }
  }
  function counterProps(P, t, o) {
    if (o.counterItems === false) return;
    const y = 92;
    sprite(P, -500, y, 1272, k => PROP.mixer(lwk(k), C.red));
    sprite(P, -420, y, 1280, k => PROP.utensils(lwk(k)));
    sprite(P, 120, y, 1275, k => PROP.toaster(lwk(k)));
    sprite(P, 190, y, 1270, k => PROP.fruitBowl(lwk(k)));
    sprite(P, 300, y, 1278, k => PROP.knifeBlock(lwk(k)));
    sprite(P, 352, y, 1282, k => { PROP.jar(lwk(k), '#F6F0E2', 16); });
    sprite(P, 375, y, 1284, k => { PROP.jar(lwk(k), '#8A5530', 13); });
    sprite(P, -120, y, 1280, k => { X.rotate(-.05); PROP.cuttingBoard(lwk(k)); });
  }
  function island(P, t, o) {
    const I = ISLAND, mess = clamp(o.mess || 0);
    box(P, I.x0 + 6, I.x1 - 6, 0, 8, I.z0 + 6, I.z1 - 6, { top: C.black, nz: '#4A3A3E', pz: '#4A3A3E', side: '#3A2E32' }, { lwPx: px(P, .6) });
    box(P, I.x0 + 6, I.x1 - 6, 8, 85, I.z0 + 6, I.z1 - 6, COL(C.sage, .12), { lwPx: px(P, .9) });
    const faceZ = P.cam.z < I.z0 ? I.z0 + 5.6 : P.cam.z > I.z1 ? I.z1 - 5.6 : null;
    if (faceZ != null) P.plane(faceZ, () => {
      const n = 4, w = (I.x1 - I.x0 - 12) / n;
      for (let i = 0; i < n; i++) { const a = I.x0 + 6 + i * w; S(rectPts(a + 4, -80, w - 8, 66), { fill: C.sage, stroke: C.sageDk, lwPx: px(P, .9) }); S(rectPts(a + 12, -72, w - 24, 50), { fill: null, stroke: C.sageDk, lwPx: px(P, .8) });
        circle(a + w / 2, -76, 1.8, { fill: C.steelDk, stroke: null }); }
      if (P.cam.z < I.z0) { // a tea towel over the front
        S([[40, -86], [70, -86], [72, -42], [38, -42]], { fill: '#FFFDF6', stroke: C.line, lwPx: px(P, .8) }); for (const y of [-52, -48]) line([[38.5, y], [71.5, y]], { stroke: C.red, lwPx: px(P, 1.4) }); }
      if (mess > .05) splats(P, mess, 3, [[I.x0 + 10, 14, I.x1 - 10, 80]]);
    });
    box(P, I.x0, I.x1, 85, I.y, I.z0, I.z1, { top: C.block, nz: C.blockDk, pz: C.blockDk, side: C.blockDk }, { lwPx: px(P, 1) });
    if (P.cam.y > I.y) for (let x = I.x0 + 18; x < I.x1; x += 20) { const l = P.line([[x, I.y + .1, I.z0], [x, I.y + .1, I.z1]]); if (l) line(l, { stroke: rgba(C.blockDk, .35), lwPx: px(P, .6) }); }
    if (o.islandItems !== false) {                                                       // the ends are dressed; the middle (X −110…110) stays clear for scene props
      sprite(P, -148, I.y, 890, k => PROP.bowl(lwk(k), '#E9806A'));
      sprite(P, -140, I.y, 925, k => PROP.rollingPin(lwk(k)));
      sprite(P, 145, I.y, 905, k => { X.scale(.8, .8); PROP.utensils(lwk(k)); });
    }
    if (mess > .05 && P.cam.y > I.y) flour(P, I.y + .3, I.x0 + 10, I.x1 - 10, I.z0 + 8, I.z1 - 8, mess, 5);
    if (typeof o.onIsland === 'function') o.onIsland(P, t);
  }
  function stool(P, x, z) {                                                               // a bar stool at the island's end
    for (const [dx, dz] of [[-12, -12], [12, -12], [-12, 12], [12, 12]]) { const l = P.line([[x + dx * 1.2, 0, z + dz * 1.2], [x + dx * .7, 64, z + dz * .7]]); if (l) line(l, { stroke: C.woodDk, lwPx: px(P, 2.4) }); }
    const r = P.line([[x - 14, 26, z - 14], [x + 14, 26, z - 14]]); if (r) line(r, { stroke: C.woodDk, lwPx: px(P, 1.6) });
    const s = P.floorCircle(x, z, 17, 66, 20); if (s) S(s, { fill: C.mustard, stroke: C.line, lwPx: px(P, .9) });
    box(P, x - 16, x + 16, 62, 66, z - 16, z + 16, COL(C.mustard), { lwPx: px(P, .7) });
  }
  // Flour drifts on a horizontal surface.
  function flour(P, y, x0, x1, z0, z1, amt, seed) {
    const n = Math.round(4 + amt * 10);
    for (let i = 0; i < n; i++) { const h = seed * 17 + i, x = lerp(x0, x1, hash(h)), z = lerp(z0, z1, hash(h + .3)), r = 4 + hash(h + .6) * 11 * amt;
      const q = P.poly(Array.from({ length: 10 }, (_, j) => { const a = j / 10 * TAU, rr = r * (.7 + hash(h + j) * .5); return [x + Math.cos(a) * rr, y, z + Math.sin(a) * rr * .8]; }));
      if (q) S(q, { fill: 'rgba(255,252,244,.55)', stroke: null, smooth: true }); }
  }
  function pendant(P, L, lit) {
    const cord = P.line([[L.x, CEIL, L.z], [L.x, L.y + 18, L.z]]); if (cord) line(cord, { stroke: C.black, lwPx: px(P, 1.2) });
    sprite(P, L.x, L.y, L.z, k => { const lw = lwk(k);
      glowAt(0, 6, 80, 60, '#FFE4B0', .5 * lit);
      S([[-20, 0], [-16, -10], [-6, -17], [6, -17], [16, -10], [20, 0]], { fill: C.sage, stroke: C.line, lwPx: lw, smooth: .3 });
      S(rectPts(-3, -22, 6, 6), { fill: C.copper, stroke: C.line, lwPx: lw * .7 });
      ellipse(0, 0, 20, 3.2, { fill: lit > .05 ? '#FFF3C8' : C.sageDk, stroke: C.line, lwPx: lw * .8 }); ellipse(0, 1.5, 6, 3, { fill: lit > .05 ? C.bulb : C.cream, stroke: null }); });
  }

  // ---------- the dining pieces ----------
  function chair(P, x, z, facing, o = {}) {                                              // facing: +1 the seat's front faces +Z (far-side chairs), −1 faces −Z
    const sz0 = facing > 0 ? z - 22 : z - 20, sz1 = sz0 + 42, bz = facing > 0 ? sz0 : sz1 - 4, w = 21, col = { top: C.woodLt, nz: C.wood, pz: C.wood, side: C.woodDk };
    for (const [dx, dz] of [[-w + 3, sz0 + 3], [w - 3, sz0 + 3], [-w + 3, sz1 - 3], [w - 3, sz1 - 3]]) box(P, x + dx - 2, x + dx + 2, 0, 44, dz - 2, dz + 2, col, { lwPx: px(P, .6) });
    box(P, x - w, x + w, 42, 48, sz0, sz1, col, { lwPx: px(P, .8) });
    if (o.cushion) box(P, x - w + 3, x + w - 3, 48, 51, sz0 + 3, sz1 - 3, COL(o.cushion), { lwPx: px(P, .6) });
    for (const dx of [-w + 2, w - 2]) box(P, x + dx - 2.4, x + dx + 2.4, 48, o.tall ? 150 : 124, bz, bz + 4, col, { lwPx: px(P, .7) });
    box(P, x - w, x + w, o.tall ? 134 : 110, o.tall ? 150 : 124, bz, bz + 4, col, { lwPx: px(P, .7) });
    for (let i = -2; i <= 2; i++) box(P, x + i * 6 - 1.2, x + i * 6 + 1.2, 48, o.tall ? 134 : 110, bz + .5, bz + 3.5, col, { lwPx: px(P, .5) });
  }
  function table(P, t, o) {
    const T = TABLE, tg = !!o.thanksgiving;
    const legs = [[T.x0 + 16, T.z0 + 14], [T.x1 - 16, T.z0 + 14], [T.x0 + 16, T.z1 - 14], [T.x1 - 16, T.z1 - 14], [0, T.z0 + 14], [0, T.z1 - 14]];
    for (const [x, z] of legs) box(P, x - 5, x + 5, 0, T.y - 10, z - 5, z + 5, { top: C.woodLt, nz: C.wood, pz: C.wood, side: C.woodDk }, { lwPx: px(P, .7) });
    box(P, T.x0 + 10, T.x1 - 10, T.y - 14, T.y - 6, T.z0 + 8, T.z1 - 8, { top: C.wood, nz: C.wood, pz: C.wood, side: C.woodDk }, { lwPx: px(P, .7) });   // the apron
    box(P, T.x0, T.x1, T.y - 6, T.y, T.z0, T.z1, { top: C.woodLt, nz: C.wood, pz: C.wood, side: C.woodDk });
    const cloth = o.cloth ?? (tg ? 'long' : false);
    if (cloth) {                                                                         // a cream tablecloth (short: a hanging edge; long: to the floor) and a burnt-orange runner
      const drop = cloth === 'long' ? T.y - 3 : 22; box(P, T.x0 - 4, T.x1 + 4, T.y - drop, T.y + .6, T.z0 - 4, T.z1 + 4, { top: '#FBF3E2', nz: '#F2E6CC', pz: '#F2E6CC', side: '#E6D6B6' }, { lwPx: px(P, .8) });
      const hemZ = P.cam.z > T.z1 ? T.z1 + 4.2 : P.cam.z < T.z0 ? T.z0 - 4.2 : null;
      if (hemZ != null) P.plane(hemZ, () => {                                            // soft folds and an orange hem band with little red leaves
        const yb = -(T.y - drop), xa = T.x0 - 4, xb = T.x1 + 4;
        for (let x = xa + 22; x < xb - 10; x += 44) S([[x - 7, -T.y + 2], [x + 7, -T.y + 2], [x + 12, yb], [x - 12, yb]], { fill: 'rgba(200,170,120,.16)', stroke: null });
        S(rectPts(xa, yb - 9, xb - xa, 6), { fill: C.pumpkin, stroke: null }); S(rectPts(xa, yb - 2.5, xb - xa, 2.5), { fill: C.gold, stroke: null });
        for (let x = xa + 18; x < xb; x += 36) ellipse(x, yb - 6, 3.6, 2, { fill: C.redDk, stroke: null, rot: .5 });
        S(rectPts(xa, -T.y, xb - xa, 1.5), { fill: 'rgba(160,130,90,.25)', stroke: null });
      });
      const r = frect(P, T.y + .8, T.x0 + 30, T.x1 - 30, (T.z0 + T.z1) / 2 - 20, (T.z0 + T.z1) / 2 + 20); if (r) S(r, { fill: C.pumpkinDk, stroke: C.line, lwPx: px(P, .7) });
      const r2 = frect(P, T.y + .9, T.x0 + 34, T.x1 - 34, (T.z0 + T.z1) / 2 - 14, (T.z0 + T.z1) / 2 + 14); if (r2) S(r2, { fill: null, stroke: C.gold, lwPx: px(P, .8) });
    } else if (P.cam.y > T.y) for (let x = T.x0 + 30; x < T.x1; x += 34) { const l = P.line([[x, T.y + .1, T.z0], [x, T.y + .1, T.z1]]); if (l) line(l, { stroke: rgba(C.woodDk, .3), lwPx: px(P, .6) }); }
    if (o.tableItems !== false) tableItems(P, t, o);
    if (typeof o.onTable === 'function') o.onTable(P, t);
  }
  function tableItems(P, t, o) {
    const T = TABLE, y = T.y + (o.thanksgiving ? 1 : 0), cz = (T.z0 + T.z1) / 2, lit = lampsOf(o) > .3 || !!o.thanksgiving;
    const sorted = (arr) => arr.sort((a, b) => P.depth(b[1]) - P.depth(a[1]));
    if (!o.thanksgiving) {                                                               // an ordinary day: placemats, a vase and the fruit bowl
      const it = [];
      SEATS.forEach(s => { if (s.end) return; it.push([() => { const m = frect(P, y + .4, s.x - 22, s.x + 22, T.z0 + 6, T.z0 + 36); if (m) S(m, { fill: C.sageLt, stroke: C.line, lwPx: px(P, .6) }); }, T.z0 + 20]); });
      it.push([() => sprite(P, -60, y, cz, k => PROP.fruitBowl(lwk(k))), cz]);
      it.push([() => sprite(P, 60, y, cz, k => { const lw = lwk(k); S([[-4, 0], [4, 0], [6, -10], [2, -18], [-2, -18], [-6, -10]], { fill: '#5AA9E6', stroke: C.line, lwPx: lw, smooth: .4 }); for (const [x, c] of [[-4, C.coral], [0, C.mustard], [4, '#F4A8C8']]) { line([[0, -18], [x, -28]], { stroke: C.leafDk, lwPx: lw }); circle(x, -29, 2.6, { fill: c, stroke: C.line, lwPx: lw * .6 }); } }), cz]);
      sorted(it).forEach(([f]) => f()); return;
    }
    const it = [];
    // twelve place settings: plate, napkin, fork and knife, a glass
    SEATS.forEach((s, i) => {
      const pz = s.end ? cz : T.z0 + 24, pxx = s.end ? (s.x > 0 ? T.x1 - 28 : T.x0 + 28) : s.x;
      it.push([() => {
        const ch = P.floorCircle(pxx, pz, 17, y + .5, 22); if (ch) S(ch, { fill: C.gold, stroke: C.line, lwPx: px(P, .6) });
        const pl = P.floorCircle(pxx, pz, 14, y + .8, 22); if (pl) S(pl, { fill: C.enamel, stroke: C.line, lwPx: px(P, .6) });
        const pi = P.floorCircle(pxx, pz, 9, y + .9, 18); if (pi) S(pi, { fill: null, stroke: [C.pumpkinDk, C.leaf, C.plum][i % 3], lwPx: px(P, .7) });
        const nap = frect(P, y + .7, pxx - 26, pxx - 19, pz - 10, pz + 10); if (nap) S(nap, { fill: [C.pumpkin, C.redDk, C.mustard][i % 3], stroke: C.line, lwPx: px(P, .5) });
        const kn = P.line([[pxx + 20, y + .8, pz - 10], [pxx + 20, y + .8, pz + 10]]); if (kn) line(kn, { stroke: C.steelDk, lwPx: px(P, 1.2) });
      }, pz]);
      it.push([() => sprite(P, pxx + 18, y, pz + (s.end ? 22 : 18), k => PROP.glass(lwk(k))), pz + 20]);
    });
    // the feast down the middle: the centrepiece cornucopia, pumpkins, candles, side dishes (the turkey is the scene's)
    it.push([() => sprite(P, 0, y, cz - 4, k => { X.scale(1.05, 1.05); PROP.cornucopia(lwk(k)); }), cz - 4]);
    [[-60, C.pumpkin, 9], [70, '#F2C440', 7], [-95, '#FFF3DC', 7], [100, C.pumpkinDk, 8]].forEach(([x, c, r]) => it.push([() => sprite(P, x, y, cz + 6, k => PROP.pumpkin(lwk(k), r, c)), cz + 6]));
    [-150, -120, 140, 170, -330, 330].forEach((x, i) => it.push([() => sprite(P, x, y, cz - 6 + (i % 2) * 10, k => PROP.candle(lwk(k), lit, t, i)), cz - 6 + (i % 2) * 10]));
    [[-240, '#5E9E45'], [240, '#F2C440'], [-390, C.pumpkin]].forEach(([x, c]) => it.push([() => sprite(P, x, y, cz, k => PROP.dish(lwk(k), c)), cz]));
    it.push([() => sprite(P, 300, y, cz + 4, k => PROP.breadBasket(lwk(k))), cz + 4]);
    it.push([() => sprite(P, -200, y, cz + 10, k => PROP.gravyBoat(lwk(k))), cz + 10]);
    sorted(it).forEach(([f]) => f());
  }
  function sideboard(P, t, o) {
    const B = SIDEBOARD;
    box(P, B.x0 + 6, B.x1 - 6, 0, 10, B.z0 + 4, B.z1 - 4, C.woodDk, { lwPx: px(P, .6) });
    box(P, B.x0, B.x1, 10, B.y - 5, B.z0, B.z1, { top: C.woodLt, nz: C.wood, pz: C.wood, side: C.woodDk });
    if (P.cam.z > B.z1) P.plane(B.z1 + .4, () => { const n = 4, w = (B.x1 - B.x0) / n;
      for (let i = 0; i < n; i++) { const a = B.x0 + i * w; S(rectPts(a + 4, -B.y + 9, w - 8, 14), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .8) }); circle(a + w / 2, -B.y + 16, 1.8, { fill: C.gold, stroke: null });
        S(rectPts(a + 4, -B.y + 27, w - 8, B.y - 42), { fill: C.wood, stroke: C.woodDk, lwPx: px(P, .8) }); S(rectPts(a + 12, -B.y + 34, w - 24, B.y - 56), { fill: null, stroke: C.woodLt, lwPx: px(P, .7) }); } });
    box(P, B.x0 - 4, B.x1 + 4, B.y - 5, B.y, B.z0, B.z1 + 4, { top: C.woodLt, nz: C.woodDk, pz: C.woodDk, side: C.woodDk }, { lwPx: px(P, .8) });
    if (o.tableItems !== false) {
      const lit = lampsOf(o);
      sprite(P, -190, B.y, 26, k => { const lw = lwk(k); glowAt(0, -40, 50, 36, '#FFE4B0', .45 * lit); ellipse(0, -10, 8, 10, { fill: C.sage, stroke: C.line, lwPx: lw }); line([[0, -18], [0, -28]], { stroke: C.woodDk, lwPx: lw * 1.5 }); S([[-13, -26], [13, -26], [9, -44], [-9, -44]], { fill: lit > .05 ? '#FFF3D6' : C.cream, stroke: C.line, lwPx: lw }); });
      if (o.thanksgiving) { sprite(P, 120, B.y, 26, k => PROP.pumpkin(lwk(k), 12)); sprite(P, 160, B.y, 30, k => PROP.pumpkin(lwk(k), 8, '#F2C440')); sprite(P, 40, B.y, 26, k => { X.scale(.9, .9); PROP.breadBasket(lwk(k)); }); }
      else { sprite(P, 140, B.y, 26, k => PROP.bowl(lwk(k), C.navy)); sprite(P, 60, B.y, 26, k => PROP.plant(lwk(k), t)); }
    }
    if (typeof o.onSideboard === 'function') o.onSideboard(P, t);
  }
  function chandelier(P, t, o) {
    const L = CHAND, lit = lampsOf(o), cord = P.line([[L.x, CEIL, L.z], [L.x, L.y + 30, L.z]]); if (cord) line(cord, { stroke: C.black, lwPx: px(P, 1.4) });
    const ring = P.floorCircle(L.x, L.z, 46, L.y, 28); if (ring) S(ring, { fill: null, stroke: C.black, lwPx: px(P, 2.2) });
    const arms = []; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3; arms.push([L.x + Math.cos(a) * 46, L.z + Math.sin(a) * 46, i]); }
    arms.sort((a, b) => P.depth(b[1]) - P.depth(a[1]));
    for (const [x, z, i] of arms) { const l = P.line([[L.x, L.y + 30, L.z], [x, L.y, z]]); if (l) line(l, { stroke: C.black, lwPx: px(P, 1.1) });
      sprite(P, x, L.y, z, k => { const lw = lwk(k); glowAt(0, -14, 30, 26, '#FFD9A0', .22 * lit); S(rectPts(-2.4, -12, 4.8, 12), { fill: '#FFF3DC', stroke: C.line, lwPx: lw * .7 }); ellipse(0, -15, 2.6, 4, { fill: lit > .05 ? C.bulb : C.cream, stroke: C.line, lwPx: lw * .5 }); }); }
  }

  // ---------- smoke and mess ----------
  function smokePuff(x, y, r, a, dark) { if (a < .01) return; const c = mixCol('#B9B3B8', '#3A3438', dark);
    for (let j = 0; j < 5; j++) circle(x + Math.cos(j * 1.3) * r * .55, y + Math.sin(j * 2.1) * r * .3, r * (.55 + hash(j) * .25), { fill: rgba(c, a * .55), stroke: null }); }
  function smokeItems(P, t, o, add) {
    const ov = ovenOpt(o), sm = clamp(ov.smoke), haze = clamp(o.smoke ?? sm);
    if (sm > .01) for (let i = 0; i < 18; i++) {                                         // the plume: out of the door top, up the hood, along the ceiling
      const u = frac(t * .22 + hash(i * 3.1)), sx = (hash(i) - .5) * 70, y = lerp(OVEN.y1, CEIL - 20, Math.min(1, u * 1.6)), sp = Math.max(0, u * 1.6 - 1) / .6;
      const z = OVEN.z - 10 - sp * 600 * (.4 + hash(i + 2) * .6), x = sx + Math.sin(t * .7 + i) * 18 + (hash(i + 5) - .5) * sp * 700, r = 16 + u * 50;
      if (P.depth(z) < 120) continue;
      add(z, z, () => sprite(P, x, y, z, () => smokePuff(0, 0, r, sm * (1 - u * .5) * (u < .08 ? u / .08 : 1), .7)), 3);
    }
    if (haze > .01) for (let iz = 0; iz < 9; iz++) for (let ix = 0; ix < 7; ix++) {     // the ceiling haze: a layer under the ceiling, deeper with more smoke
      const z = 50 + iz * 150 + hash(ix + iz * 7) * 50, x = -540 + ix * 180 + Math.sin(t * .15 + iz + ix) * 30, y = CEIL - 22 - haze * 34 * hash(ix * 3 + iz), r = 34 + haze * 46;
      if (P.depth(z) < 260) continue;                                                      // no giant puffs in the lens
      add(z, z, () => sprite(P, x, y, z, () => smokePuff(0, 0, r, haze * .32, .5)), 3);
    }
  }
  function messItems(P, t, o, add) {
    const m = clamp(o.mess || 0); if (m < .05) return;
    add(1100, 1100, () => flour(P, .8, -400, 300, 1000, 1200, m, 11), -2);
    add(700, 700, () => flour(P, .8, -250, 250, 600, 800, m * .7, 13), -2);
    const floorThings = [[-230, 990, 'pot', .1], [220, 1000, 'pan', .25], [-60, 760, 'lid', .35], [120, 780, 'spoon', .45], [-330, 1080, 'flourBag', .2], [300, 1120, 'eggs', .55], [-120, 1020, 'pot', .65], [60, 1150, 'bowl', .75]];
    for (const [x, z, k, th] of floorThings) if (m > th) add(z, z, () => sprite(P, x, 0, z, kk => { const lw = lwk(kk); X.rotate((hash(x) - .5) * .3); if (k === 'pot') PROP.pot(lw, 12, hash(z) > .5 ? C.copper : C.steel); else if (k === 'flourBag') { X.rotate(-1.2); PROP.flourBag(lw, true); } else if (k === 'bowl') { X.rotate(Math.PI); X.translate(0, 9); PROP.bowl(lw, '#5AA9E6'); } else PROP[k](lw); }), 1);
    add(1260, 1260, () => { if (P.cam.y > 92) flour(P, 92.4, -590, 390, 1245, 1295, m, 17); }, 2);
  }

  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri }), lit = lampsOf(o);
    // kitchen end
    add(COUNTER.z0, FRONT, () => { baseRun(P, COUNTER.x0, OVEN.x0, t, o); sink(P, t, o); }, 0);
    add(COUNTER.z0, FRONT, () => baseRun(P, OVEN.x1, COUNTER.x1, t, o), 0);
    add(OVEN.z, FRONT, () => range(P, t, o), 0);
    add(1265, FRONT, () => { uppers(P, -600, KWIN.x0 - 22); uppers(P, KWIN.x1 + 22, HOOD.x0 - 10); uppers(P, HOOD.x1 + 10, FRIDGE.x0 - 6); }, 1);
    add(HOOD.z, FRONT, () => hood(P, t, o), 2);
    add(COUNTER.z0, FRONT, () => { counterProps(P, t, o); if (typeof o.onCounter === 'function') o.onCounter(P, t); }, 3);
    add(FRIDGE.z0, FRIDGE.z1, () => fridge(P, t, o), 0);
    add(ISLAND.z0, ISLAND.z1, () => island(P, t, o), 0);
    add(900, 900, () => stool(P, 215, 900), -1);
    for (const L of LAMPS) add(L.z, L.z, () => pendant(P, L, lit), 4);
    // dining end
    add(SIDEBOARD.z0, SIDEBOARD.z1, () => sideboard(P, t, o), 0);
    SEATS.forEach(s => { if (s.end) add(s.z - 30, s.z - 30, () => chair(P, s.x, s.z - 2, 1, { tall: true, cushion: o.thanksgiving ? C.redDk : C.mustard }), 0); else add(s.z - 40, s.z - 40, () => chair(P, s.x, s.z - 10, 1, { cushion: o.thanksgiving ? C.pumpkinDk : null }), 0); });
    add(TABLE.z0, TABLE.z1, () => table(P, t, o), 1);
    if (o.nearChairs) for (let i = 0; i < 10; i++) { const x = 315 - i * 70; add(TABLE.z1 + 50, TABLE.z1 + 50, () => chair(P, x, TABLE.z1 + 30, -1, {}), 0); }
    add(CHAND.z, CHAND.z, () => chandelier(P, t, o), 4);
    add(120, 120, () => sprite(P, 540, 0, 120, k => { const lw = lwk(k); S([[-14, 0], [14, 0], [17, -26], [-17, -26]], { fill: C.coral, stroke: C.line, lwPx: lw }); line([[0, -26], [-2, -90], [3, -130]], { stroke: C.woodDk, lwPx: lw * 2, smooth: true }); for (let i = 0; i < 11; i++) { const y = -56 - i * 8, sd = i % 2 ? 1 : -1; ellipse(sd * (10 + hash(i) * 8) + wob(t, .25, i) * 2, y, 11, 7, { fill: i % 3 ? C.leaf : C.leafDk, stroke: C.line, lwPx: lw * .8, rot: sd * .5 }); } }), 1);
    if (o.thanksgiving) add(830, 830, () => { sprite(P, -560, 0, 830, k => { PROP.pumpkin(lwk(k), 22); }); sprite(P, -540, 0, 870, k => PROP.pumpkin(lwk(k), 14, '#F2C440')); }, 1);
    smokeItems(P, t, o, add); messItems(P, t, o, add);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.filter(it => it.key > 15).sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK, HW, BACK, FRONT, CEIL, RAIL, COUNTER, OVEN, SINK, KWIN, FRIDGE, HOOD, ISLAND, TABLE, SIDEBOARD, DWIN, ARCH, BACKDOOR, PANTRY, CHALK, LAMPS, CHAND, SEATS, seatY,
    BEHIND_ISLAND: { x: 0, z: 1020 }, props: PROP,
    // Draw a seated guest: clips fn() to above the table's far edge so a sunk rig never shows under the table.
    seated(P, seat, fn) { const y = P.p(seat?.x ?? 0, TABLE.y, TABLE.z0)[1]; X.save(); X.beginPath(); X.rect(-4 * W, -4 * H, 9 * W, y + 4 * H); X.clip(); try { return fn(); } finally { X.restore(); } },
    palette: o => palette((o || {}).time),
    back(P, t, o = {}) {
      C = palette(o.time);
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P, o); ceiling(P); for (const x of [-HW, HW]) sideWall(P, x, t, o); dineWall(P, t, o); cookWall(P, t, o);
      const d = !Number.isFinite(o.splitZ) ? -Infinity : P.depth(o.splitZ);
      for (const it of items(P, t, o)) if (it.key > d) it.draw();
    },
    front(P, t, o = {}) {
      if (!Number.isFinite(o.splitZ)) return;
      C = palette(o.time);
      const d = P.depth(o.splitZ), stop = o.toZ == null ? -Infinity : P.depth(o.toZ);
      for (const it of items(P, t, o)) if (it.key <= d && it.key > stop) it.draw();
    },
  };
})();

// Registration for the studio's location browser: spots, camera presets (paste-ready for scene code) and versions.
// Kitchen cameras look toward the cooking wall (dir 1); dining cameras look back toward the dining wall (dir: -1).
LOCATIONS.family_kitchen = Object.assign(family_kitchen, {
  variants: {
    Day: { time: 'day' },
    Morning: { time: 'morning' },
    Evening: { time: 'evening' },
    Thanksgiving: { time: 'evening', thanksgiving: true },
    'Oven on': { time: 'day', oven: { on: true, glow: .9 } },
    'Kitchen disaster': { time: 'day', thanksgiving: true, mess: 1, steam: .6, oven: { on: true, glow: 1, door: .7, smoke: 1 } },
  },
  spots: {
    'Behind the island': { x: 0, y: 0, z: 1020 },
    'Behind the island · left': { x: -95, y: 0, z: 1020 },
    'Behind the island · right': { x: 95, y: 0, z: 1020 },
    'In front of the island': { x: 0, y: 0, z: 770 },
    'At the oven': { x: 0, y: 0, z: 1160 },
    'At the sink': { x: -260, y: 0, z: 1170 },
    'At the fridge': { x: 478, y: 0, z: 1130 },
    'By the back door': { x: 520, y: 0, z: 765 },
    'Middle of the room': { x: 0, y: 0, z: 580 },
    'In the archway': { x: -560, y: 0, z: 620 },
    'In front of the table': { x: 0, y: 0, z: 420 },
    'Head of the table (seat 0)': { x: 412, y: -14, z: 214 },
    'Table · seat 3': { x: 105, y: -14, z: 165 },
    'Table · seat 6': { x: -105, y: -14, z: 165 },
    'Foot of the table (seat 11)': { x: -412, y: -14, z: 214 },
  },
  cameras: {
    'Kitchen · wide': { x: 0, y: 165, z: 420, f: 620, hy: 530, dir: 1 },
    'Kitchen · island medium': { x: 0, y: 140, z: 560, f: 1000, hy: 590, dir: 1 },
    'Kitchen · island close': { x: 0, y: 140, z: 700, f: 1000, hy: 560, dir: 1 },
    'Kitchen · oven close-up': { x: 0, y: 72, z: 1080, f: 1000, hy: 590, dir: 1 },
    'Kitchen · sink and window': { x: -220, y: 150, z: 850, f: 900, hy: 560, dir: 1 },
    'Kitchen · fridge': { x: 380, y: 140, z: 860, f: 900, hy: 560, dir: 1 },
    'Dining · table wide': { x: 0, y: 175, z: 820, f: 620, hy: 540, dir: -1 },
    'Dining · table medium': { x: 0, y: 140, z: 820, f: 950, hy: 560, dir: -1 },
    'Dining · table close': { x: 0, y: 125, z: 620, f: 1000, hy: 580, dir: -1 },
    'Dining · head of table': { x: 330, y: 125, z: 560, f: 1000, hy: 600, dir: -1 },
    'Dining · foot of table': { x: -330, y: 125, z: 560, f: 1000, hy: 600, dir: -1 },
    'Dining · archway': { x: -250, y: 150, z: 820, f: 700, hy: 560, dir: -1 },
  },
});
