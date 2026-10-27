// locations/housam_bedroom/housam_bedroom.js: Housam's bedroom, tidy or messy (see README.md).
//
// A soccer-and-maths teenager's room in one-point perspective (engine/persp.js), built like Alma's bedroom to be shot from BOTH ends:
//   bed view    cameras with dir: 1 (the default) stand by the door and look toward +Z: the navy bed with its soccer-ball duvet
//               under a framed #10 jersey and DOVES pennants, a soccer-ball clock on the nightstand, the window and the mini goal
//               on the left, the trophy shelves on the left wall by the bed, the desk with his laptop under a whiteboard of
//               maths on the right, the wardrobe; a soccer-pitch rug in the middle.
//   door view   cameras with dir: -1 stand at the foot of the bed and look back toward −Z: the door with its sign, a stadium
//               poster, the chest of drawers with a ball and cleats on top, the laundry hamper, the desk (screen-left).
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   housamBedroom.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   housamBedroom.front(P, t, o)   pieces nearer than o.splitZ. Call after the characters. With o.toZ it stops at that depth.
// o: { splitZ, toZ, messy: 0..1 (0 = tidy, the default; 1 = balls, cleats, socks, jerseys and crumpled maths everywhere;
//                                in between, the mess builds up piece by piece),
//      lamp: 0..1 (the soccer-ball ceiling lamp, the desk lamp and the laptop glow; default .5), night: 0..1 (the window),
//      board(t): your own whiteboard (origin at its top-left, world units, y down, clipped to housamBedroom.BOARD.w × h = 200 × 110),
//      laptop: false closes the laptop }
// Pass the same o to back() and front().
//
// Layout (world): side walls X = ±340, back (door) wall Z = 0, front (bed) wall Z = 880, ceiling Y = 280, a navy stripe at Y 118…134.
// Bed X −115…105, Z 670–872 against the front wall, mattress top Y 48. Nightstand X 130…190, Z 810–870. Rug (a soccer pitch)
// X ±150, Z 250–630. Left wall: window Z 260–520 (Y 105…235) over the mini goal (X −340…−285, Z 290–490); trophy shelves Z 580–820.
// Right wall: desk X 250…340, Z 300–520 (gaming chair at X 195…240), whiteboard Z 310–510, Y 115…225; wardrobe Z 600–830.
// Back wall: chest of drawers X −300…−150, stadium poster, hamper (−100, 30), door X 170…270.

const housamBedroom = (() => {
  const HW = 340, BACK = 0, FRONT = 880, CEIL = 280, STRIPE = [118, 134];
  const BED = { x0: -115, x1: 105, z0: 670, z1: 872, h: 48 }, STAND = { x0: 130, x1: 190, z0: 810, z1: 870, h: 52 };
  const RUG = { x0: -150, x1: 150, z0: 250, z1: 630 }, WIN = { z0: 260, z1: 520, y0: 105, y1: 235 }, GOAL = { x0: -340, x1: -285, z0: 290, z1: 490, h: 70 };
  const TROPHY = { z0: 580, z1: 820 }, DESK = { x0: 250, z0: 300, z1: 520, h: 72 }, CHAIR = { x0: 195, x1: 240, z0: 375, z1: 445 };
  const BOARD = { z0: 310, z1: 510, y0: 115, y1: 225, w: 200, h: 110 }, WARD = { x0: 270, z0: 600, z1: 830, h: 230 };
  const DRAWERS = { x0: -300, x1: -150, z1: 50, h: 90 }, DOOR = { x0: 170, x1: 270, h: 205 };
  const C = {
    wall: '#DCE8F4', wallLt: '#E9F1F9', navy: '#24406E', navyDk: '#182D52', navyLt: '#3E5F96', blue: '#425DA0', sky: '#9DD3F2', skyLt: '#E1F3FC',
    white: '#FBFBF8', whiteSh: '#ECEDE8', whiteDk: '#D6D9D2', ceil: '#F6F9FC',
    floor: '#D9B98F', floorLt: '#E6CBA6', floorDk: '#BE9A6E',
    grass: '#4CAF50', grassLt: '#5FC063', gold: '#F2C440', goldDk: '#B98A22', silver: '#C9D1D8', bronze: '#C98A5A',
    orange: '#D97757', red: '#D9534F', green: '#3F9B4F', yellow: '#F6D24A', ink: '#20242C', tree: '#7FBF5C', treeDk: '#5E9E45',
    wood: '#A8774E', woodDk: '#7E5434', chalkBlue: '#2F5DB0', chalkRed: '#C8403A', line: '#3E4A5E',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 4.5);
  const WHITE = { top: C.white, nz: C.whiteSh, pz: C.whiteSh, side: C.whiteDk };
  const NAVY = { top: C.navyLt, nz: C.navy, pz: C.navy, side: C.navyDk };

  // ---------- building blocks (as in Alma's bedroom) ----------
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .18), nz: col, pz: col, side: mixCol(col, '#000000', .1) } : col;
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.1), stroke = o.stroke === undefined ? C.line : o.stroke;
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, stroke: stroke || fill, lwPx: stroke ? lw : .6 }); };
    if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz ?? c.pz);
    if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz ?? c.nz);
    if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
    if (cam.y < y0) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.bot ?? c.side);
  }
  function sprite(P, x, y, z, fn) { if (!P.visible(z)) return; const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore(); }
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const label = (txt, x, y, size, col, weight = 700, font = FONT_TALK) => { X.font = `${weight} ${size}px ${font}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const fpoly = (P, y, pts) => P.poly(pts.map(([x, z]) => [x, y, z]));
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  function glowAt(x, y, rx, ry, col, a) { if (a < .01) return; X.save(); X.globalCompositeOperation = 'lighter'; ellipse(x, y, rx, ry, { fill: radGrad(x, y, 0, Math.max(rx, ry), [[0, rgba(col, a)], [1, rgba(col, 0)]]), stroke: null }); X.restore(); }
  function shadow(P, x, z, r, y = .3) { const q = P.floorCircle(x, z, r, y, 16); if (q) shape(q, { fill: 'rgba(40,50,80,.16)', stroke: null }); }
  const lwk = k => clamp(k * .32, .5, 1.6);

  // ---------- props (sprite space: world units, y down, origin on the surface under the prop) ----------
  function ballPts(cx, cy, r, lw) {                                                       // a classic black-and-white soccer ball
    circle(cx, cy, r, { fill: C.white, stroke: C.ink, lwPx: lw });
    S(Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i / 5 * TAU; return [cx + Math.cos(a) * r * .34, cy + Math.sin(a) * r * .34]; }), { fill: C.ink, stroke: null });
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i / 5 * TAU + Math.PI / 5; X.save(); X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.clip();
      S(Array.from({ length: 5 }, (_, j) => { const b = j / 5 * TAU; return [cx + Math.cos(a) * r * .95 + Math.cos(b) * r * .28, cy + Math.sin(a) * r * .95 + Math.sin(b) * r * .28]; }), { fill: C.ink, stroke: null }); X.restore(); }
  }
  const PROP = {
    ball(lw) { ballPts(0, -11, 11, lw); ellipse(-4, -16, 3, 2, { fill: 'rgba(255,255,255,.55)', stroke: null, rot: -.5 }); },
    trophy(lw, col, h = 1) {
      S(rectPts(-7, -4, 14, 4), { fill: C.woodDk, stroke: C.line, lwPx: lw }); S(rectPts(-2, -12 * h, 4, 8 * h), { fill: col, stroke: C.line, lwPx: lw });
      S([[-9, -12 * h], [9, -12 * h], [7, -24 * h], [-7, -24 * h]], { fill: col, stroke: C.line, lwPx: lw, smooth: .3 });
      for (const sd of [-1, 1]) ellipse(sd * 9.5, -20 * h, 2.6, 3.4, { fill: null, stroke: col, lwPx: lw * 1.6 });
      S(starPts(0, -18 * h, 2.6, .45), { fill: '#FFFFFF', stroke: null });
    },
    medal(lw, col) { line([[-3, -16], [0, -6], [3, -16]], { stroke: C.red, lwPx: lw * 1.8 }); circle(0, -4, 3.4, { fill: col, stroke: C.line, lwPx: lw }); },
    cleats(lw) { for (const sd of [-1, 1]) { S([[sd * 2, 0], [sd * 2, -6], [sd * 6, -8], [sd * 13, -4], [sd * 14, 0]], { fill: C.ink, stroke: C.line, lwPx: lw, smooth: .3 }); line([[sd * 4, -5], [sd * 11, -3]], { stroke: C.yellow, lwPx: lw * 1.5 }); } },
    sock(lw) { S([[-8, -4], [-8, -12], [-3, -12], [-3, -4], [5, -3.5], [6, 0], [-7, 0]], { fill: C.white, stroke: C.line, lwPx: lw, smooth: .3 }); S(rectPts(-8, -12, 5, 2.5), { fill: C.blue, stroke: null }); },
    jersey(lw, num = '10') { S([[-14, -1], [-12, -10], [-18, -12], [-12, -16], [-4, -14], [4, -15], [12, -16], [18, -11], [12, -9], [14, -1], [0, 0]], { fill: C.white, stroke: C.line, lwPx: lw, smooth: .3 }); label(num, 0, -7, 8, C.blue, 800); },
    paper(lw, crumpled) {
      if (crumpled) { circle(0, -5, 5, { fill: '#F7F5EE', stroke: C.line, lwPx: lw }); line([[-3, -6], [0, -3], [3, -7]], { stroke: C.whiteDk, lwPx: lw }); return; }
      S([[-11, 0], [11, -1], [12, -2], [-10, -1]], { fill: '#F7F5EE', stroke: C.line, lwPx: lw });
    },
    book(lw, col) { S(rectPts(-11, -4, 22, 4), { fill: col, stroke: C.line, lwPx: lw }); S(rectPts(-10, -3, 20, 1.2), { fill: '#FFFFFF', stroke: null }); },
    laptop(lw, open, glow) {                                                              // seen from the lid side: Housam's laptop with the Clawd sticker
      if (!open) { S([[-20, 0], [20, 0], [19, -3], [-19, -3]], { fill: C.silver, stroke: C.line, lwPx: lw }); S(rectPts(-4, -2.6, 8, 2), { fill: C.orange, stroke: null }); return; }
      glowAt(0, -14, 40, 24, '#BFE0FF', .35 * glow);
      S([[-21, 0], [21, 0], [19, -3], [-19, -3]], { fill: '#A9B3BC', stroke: C.line, lwPx: lw });
      S(rectPts(-19, -28, 38, 25), { fill: C.silver, stroke: C.line, lwPx: lw });
      S(rectPts(-5, -19, 10, 8), { fill: C.orange, stroke: C.line, lwPx: lw * .6 }); for (const sd of [-1, 1]) S(rectPts(sd * 2.2 - .8, -17, 1.6, 2), { fill: C.ink, stroke: null });   // Clawd
    },
    rubik(lw) { const cs = [C.red, C.yellow, C.green, C.blue, C.white, C.orange]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) S(rectPts(-4.5 + i * 3, -9 + j * 3, 3, 3), { fill: cs[Math.floor(hash(i * 3 + j) * 6)], stroke: C.ink, lwPx: lw * .5 }); },
    deskLamp(lw, lit) {
      glowAt(10, -26, 40, 26, '#FFF1C8', .45 * lit);
      ellipse(0, -1.5, 8, 2.4, { fill: C.navy, stroke: C.line, lwPx: lw }); line([[0, -2], [-4, -22], [8, -32]], { stroke: C.navy, lwPx: lw * 2 });
      S([[4, -36], [16, -30], [13, -24], [3, -28]], { fill: C.navy, stroke: C.line, lwPx: lw });
    },
    clock(lw, t) { ballPts(0, -10, 10, lw); line([[0, -10], [0, -16]], { stroke: C.red, lwPx: lw * 1.4 }); const a = t * TAU / 60; line([[0, -10], [Math.sin(a) * 7, -10 - Math.cos(a) * 7]], { stroke: C.red, lwPx: lw }); },
    pencilCup(lw) { for (const [x, c] of [[-2.5, C.red], [0, C.blue], [2.5, C.yellow]]) line([[x, -8], [x * 1.4, -17]], { stroke: c, lwPx: lw * 2.2 }); S([[-4.5, 0], [4.5, 0], [5, -9], [-5, -9]], { fill: C.navy, stroke: C.line, lwPx: lw }); },
  };
  function prop(P, name, x, y, z, rot = 0, sc = 1, ...args) {
    if (y < 1) shadow(P, x, z, 12 * sc);
    sprite(P, x, y, z, k => { X.rotate(rot); X.scale(sc, sc); PROP[name](lwk(k), ...args); });
  }

  // ---------- room shell ----------
  function wallPlane(P, x0, x1) {                                                         // on a z-plane: pale blue, a navy stripe, white skirting
    S(rectPts(x0, -CEIL, x1 - x0, CEIL), { fill: C.wall, stroke: null });
    S(rectPts(x0, -STRIPE[1], x1 - x0, STRIPE[1] - STRIPE[0]), { fill: C.navy, stroke: null });
    S(rectPts(x0, -STRIPE[0] + 2, x1 - x0, 4), { fill: C.white, stroke: null });
    S(rectPts(x0, -12, x1 - x0, 12), { fill: C.white, stroke: C.whiteDk, lwPx: px(P, .8) });
  }
  function floor(P) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]); if (q) S(q, { fill: C.floor, stroke: null });
    for (let i = 0; i <= 16; i++) { const x = -HW + i * 42.5, l = P.line([[x, 0, BACK], [x, 0, FRONT]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .9) }); }
    for (let i = 0; i < 16; i++) for (let z = (hash(i + 2) * 220) | 0; z < FRONT; z += 220) { const l = P.line([[-HW + i * 42.5, 0, z], [-HW + i * 42.5 + 42.5, 0, z]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .7) }); }
    // the rug: a little soccer pitch, striped, with its white lines
    const R = RUG, rq = fpoly(P, .4, [[R.x0, R.z0], [R.x1, R.z0], [R.x1, R.z1], [R.x0, R.z1]]); if (rq) S(rq, { fill: C.grass, stroke: C.line, lwPx: px(P, .9) });
    for (let i = 0; i < 6; i += 2) { const z0 = R.z0 + i * (R.z1 - R.z0) / 6, s = fpoly(P, .5, [[R.x0, z0], [R.x1, z0], [R.x1, z0 + (R.z1 - R.z0) / 6], [R.x0, z0 + (R.z1 - R.z0) / 6]]); if (s) S(s, { fill: C.grassLt, stroke: null }); }
    const wl = (pts) => { const l = P.line(pts.map(([x, z]) => [x, .7, z])); if (l) line(l, { stroke: '#FFFFFF', lwPx: px(P, 2.2) }); };
    const cz = (R.z0 + R.z1) / 2, ins = 14;
    wl([[R.x0 + ins, R.z0 + ins], [R.x1 - ins, R.z0 + ins], [R.x1 - ins, R.z1 - ins], [R.x0 + ins, R.z1 - ins], [R.x0 + ins, R.z0 + ins]]);
    wl([[R.x0 + ins, cz], [R.x1 - ins, cz]]);
    const cc = P.floorCircle(0, cz, 44, .7, 32); if (cc) S(cc, { fill: null, stroke: '#FFFFFF', lwPx: px(P, 2.2) });
    for (const [za, sg] of [[R.z0 + ins, 1], [R.z1 - ins, -1]]) wl([[-60, za], [-60, za + sg * 50], [60, za + sg * 50], [60, za]]);
  }
  function ceiling(P, lit) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]); if (q) S(q, { fill: C.ceil, stroke: null });
    const x = 0, z = 450, y = CEIL - 60, cord = P.line([[x, CEIL, z], [x, y + 22, z]]); if (cord) line(cord, { stroke: C.line, lwPx: px(P, 1) });
    sprite(P, x, y, z, () => { glowAt(0, 0, 110, 80, '#FFF4D6', .32 * lit); ballPts(0, 0, 21, 1.1); });   // the soccer-ball lamp
  }
  function sideWall(P, x, t, o) {
    const q = wrect(P, x, BACK, FRONT, 0, CEIL); if (q) S(q, { fill: C.wall, stroke: null });
    const st = wrect(P, x, BACK, FRONT, STRIPE[0], STRIPE[1]); if (st) S(st, { fill: C.navy, stroke: null });
    const sk = wrect(P, x, BACK, FRONT, 0, 12); if (sk) S(sk, { fill: C.white, stroke: C.whiteDk, lwPx: px(P, .7) });
    if (x < 0) { wallWindow(P, x, t, o); trophyShelves(P, x); } else whiteboard(P, x, t, o);
  }
  function wallWindow(P, x, t, o) {
    const w = WIN, q = wrect(P, x, w.z0, w.z1, w.y0, w.y1), nt = clamp(o.night || 0); if (!q) return;
    clipTo(q, () => {
      const top = Math.min(...q.map(v => v[1])), bot = Math.max(...q.map(v => v[1]));
      S(q, { fill: linGrad(0, top, 0, bot, [[0, mixCol(C.sky, '#1B2550', nt)], [1, mixCol(C.skyLt, '#3A4A7A', nt)]]), stroke: null });
      if (nt > .5) for (let i = 0; i < 12; i++) { const p = P.p(x, w.y0 + 50 + hash(i + 3) * 80, w.z0 + hash(i) * (w.z1 - w.z0)); circle(p[0], p[1], 1.6 * p[2], { fill: '#FFF8D8', stroke: null }); }
      for (let i = 0; i < 6; i++) { const cz = w.z0 + i * 52 + hash(i) * 20, cy = w.y0 + 8 + hash(i + 8) * 22, r = 30 + hash(i + 2) * 14;
        const b = wpoly(P, x, Array.from({ length: 16 }, (_, j) => { const a = j / 16 * TAU; return [cz + Math.cos(a) * r + (i % 2 ? wob(t, .2, i) * 2 : 0), cy + Math.sin(a) * r * .7]; }));
        if (b) S(b, { fill: mixCol(i % 2 ? C.tree : C.treeDk, '#1C2A3A', nt * .7), stroke: null }); }
    });
    S(q, { fill: null, stroke: C.white, lwPx: px(P, 5) });
    const mz = (w.z0 + w.z1) / 2, l = P.line([[x, w.y0, mz], [x, w.y1, mz]]); if (l) line(l, { stroke: C.white, lwPx: px(P, 3) });
    for (let i = 0; i < 8; i++) { const yy = w.y1 - 6 - i * 7, sl = wrect(P, x + 2, w.z0 + 4, w.z1 - 4, yy - 4, yy); if (sl) S(sl, { fill: C.navyLt, stroke: null, alpha: .9 }); }   // the blind, half up
    const sill = wrect(P, x, w.z0 - 12, w.z1 + 12, w.y0 - 7, w.y0); if (sill) S(sill, { fill: C.white, stroke: C.whiteDk, lwPx: px(P, 1) });
  }
  function trophyShelves(P, x) {
    const T = TROPHY;
    for (const y of [150, 200]) {
      const s = wrect(P, x, T.z0, T.z1, y - 5, y); if (s) S(s, { fill: C.white, stroke: C.line, lwPx: px(P, .8) });
      const tp = P.poly([[x, y, T.z0], [x + 24, y, T.z0], [x + 24, y, T.z1], [x, y, T.z1]]); if (tp && P.cam.y > y) S(tp, { fill: C.whiteSh, stroke: C.line, lwPx: px(P, .7) });
    }
    [[600, 150, 'gold', 1.2], [650, 150, 'silver', 1], [700, 150, 'gold', 1.5], [750, 150, 'bronze', 1], [795, 150, 'gold', 1.1], [615, 200, 'silver', 1.1], [680, 200, 'gold', 1.3], [760, 200, 'gold', 1]]
      .forEach(([z, y, c, h]) => prop(P, 'trophy', x + 12, y, z, 0, 1.5, C[c], h));
    for (const [z, c] of [[630, 'gold'], [710, 'silver'], [790, 'bronze']]) { const p = P.p(x + 1, 120 + 8, z); if (P.visible(z)) { X.save(); X.translate(p[0], p[1]); X.scale(p[2] * 1.4, p[2] * 1.4); PROP.medal(1, C[c]); X.restore(); } }
  }
  // The whiteboard over the desk: angles and trajectories, his favourite kind of maths.
  function whiteboard(P, x, t, o) {
    const B = BOARD, xs = x - 1, fr = wrect(P, xs, B.z0 - 6, B.z1 + 6, B.y0 - 6, B.y1 + 6); if (!fr) return;
    S(fr, { fill: C.silver, stroke: C.line, lwPx: px(P, 1) });
    const q = wrect(P, xs - .5, B.z0, B.z1, B.y0, B.y1); if (!q) return;
    S(q, { fill: '#FFFFFF', stroke: null });
    clipTo(q, () => {
      // draw in board units on the wall: map (u, v) with u along +Z from z0, v down from y1
      const at = (u, v) => P.p(xs - 1, B.y1 - v, B.z0 + u);
      if (o.board) { const [ox, oy] = at(0, 0), [ux, uy] = at(B.w, 0), [vx, vy] = at(0, B.h); X.save(); X.transform((ux - ox) / B.w, (uy - oy) / B.w, (vx - ox) / B.h, (vy - oy) / B.h, ox, oy); o.board(t); X.restore(); return; }
      const pl = pts => { const l = pts.map(([u, v]) => at(u, v)); line(l.map(p => [p[0], p[1]]), { stroke: C.chalkBlue, lwPx: px(P, 1.6), smooth: true }); };
      const txt = (s, u, v, size, col) => { const [a, b, kk] = at(u, v); X.save(); X.translate(a, b); X.scale(.6, 1); label(s, 0, 0, size * kk, col, 700); X.restore(); };   // squashed onto the side wall
      pl([[14, 92], [180, 92]]); pl([[14, 92], [14, 14]]);                              // axes
      pl(Array.from({ length: 21 }, (_, i) => { const u = 14 + i * 7.6; return [u, 92 - 70 * Math.sin(Math.PI * i / 20)]; }));   // the trajectory of a ball
      [[30, 'θ'], [100, 'h max'], [170, 'GOAL!']].forEach(([u, s], i) => txt(s, u, i === 1 ? 14 : i === 2 ? 80 : 80, 11, i === 2 ? C.chalkRed : C.chalkBlue));
      txt('x² + y² = r²', 60, 104, 10, C.chalkRed);
      txt('v = d / t', 150, 30, 10, C.chalkBlue);
    });
    for (const [u, c] of [[40, C.chalkBlue], [60, C.chalkRed], [80, C.green]]) { const p = P.p(xs - 2, B.y0 - 3, B.z0 + u); if (P.visible(B.z0 + u)) circle(p[0], p[1], 2.4 * p[2], { fill: c, stroke: C.line, lwPx: px(P, .5) }); }   // markers on the tray
  }
  // Front wall (Z = 880), behind the bed: the framed #10 jersey and DOVES pennants. Only seen from the bed view.
  function frontWall(P, t) {
    P.plane(FRONT, () => {
      wallPlane(P, -HW, HW);
      S(rectPts(-55, -258, 110, 110), { fill: C.navyDk, stroke: C.line, lwPx: px(P, 1.2) }); S(rectPts(-48, -251, 96, 96), { fill: C.wallLt, stroke: null });
      readable(P, 0, -200, () => {                                                       // the jersey, pinned flat
        S([[-30, 38], [-26, -12], [-44, -16], [-36, -36], [-12, -40], [0, -32], [12, -40], [36, -36], [44, -16], [26, -12], [30, 38]], { fill: C.white, stroke: C.line, lwPx: px(P, 1), smooth: .15 });
        for (const sd of [-1, 1]) line([[sd * 36, -36], [sd * 44, -16]], { stroke: C.blue, lwPx: px(P, 3) });
        S(rectPts(-30, 12, 60, 8), { fill: C.blue, stroke: null }); label('HOUSAM', 0, -16, 9, C.blue, 800); label('10', 0, 2, 22, C.blue, 800, FONT_SFX);
      });
      for (const [x0, txt, col] of [[-250, 'DOVES', C.navy], [150, 'GOAL!', C.red]]) {  // pennants
        readable(P, x0 + 50, -230, () => { S([[-50, -16], [50, 0], [-50, 16]], { fill: col, stroke: C.line, lwPx: px(P, 1) }); label(txt, -14, 0, 11, C.white, 800); });
        line([[x0, -246], [x0, -214]], { stroke: C.woodDk, lwPx: px(P, 2) });
      }
    });
  }
  // Back wall (Z = 0), the door end. Only seen from the door view.
  function backWall(P, t) {
    P.plane(BACK, () => {
      wallPlane(P, -HW, HW);
      const d = DOOR;
      S(rectPts(d.x0 - 10, -d.h - 10, d.x1 - d.x0 + 20, d.h + 10), { fill: C.white, stroke: C.line, lwPx: px(P, 1) });
      S(rectPts(d.x0, -d.h, d.x1 - d.x0, d.h), { fill: C.whiteSh, stroke: C.line, lwPx: px(P, 1) });
      for (const [y, h] of [[-d.h + 16, 90], [-d.h + 118, 70]]) S(rectPts(d.x0 + 14, y, d.x1 - d.x0 - 28, h), { fill: null, stroke: C.whiteDk, lwPx: px(P, 1.4) });
      circle(d.x0 + 14, -98, 4.5, { fill: C.silver, stroke: C.line, lwPx: px(P, .8) });
      readable(P, (d.x0 + d.x1) / 2, -d.h + 56, () => { S(rectPts(-36, -18, 72, 36), { fill: C.yellow, stroke: C.line, lwPx: px(P, 1) }); label('GENIUS', 0, -6, 10, C.ink, 800); label('AT WORK', 0, 8, 9, C.red, 800); });   // the door sign
      // a stadium poster: floodlights over a pitch, PRACTICE MAKES PERFECT
      S(rectPts(-70, -240, 170, 110), { fill: C.navyDk, stroke: C.line, lwPx: px(P, 1.2) });
      readable(P, 15, -185, () => {
        S([[-80, 50], [-60, 6], [60, 6], [80, 50]], { fill: C.grass, stroke: null }); line([[0, 6], [0, 50]], { stroke: '#FFFFFF', lwPx: px(P, 1) });
        for (const sd of [-1, 1]) { line([[sd * 70, 6], [sd * 70, -40]], { stroke: C.silver, lwPx: px(P, 1.4) }); glowAt(sd * 70, -42, 22, 14, '#FFF7CC', .6); S(rectPts(sd * 70 - 7, -46, 14, 6), { fill: '#FFF7CC', stroke: null }); }
        label('PRACTICE MAKES', 0, -28, 11, C.white, 800); label('PERFECT', 0, -12, 15, C.yellow, 800, FONT_SFX);
      });
    });
  }

  // ---------- furniture ----------
  function bed(P, m) {
    const B = BED;
    if (P.cam.z < B.z1) P.plane(B.z1 - 2, () => { S(rectPts(B.x0 - 6, -112, B.x1 - B.x0 + 12, 112), { fill: C.navy, stroke: C.line, lwPx: px(P, 1.2) }); S(rectPts(B.x0 + 8, -100, B.x1 - B.x0 - 16, 40), { fill: C.navyLt, stroke: null }); });
    box(P, B.x0, B.x1, 6, 28, B.z0, B.z1 - 6, NAVY);
    box(P, B.x0 + 4, B.x1 - 4, 28, 44, B.z0 + 4, B.z1 - 10, WHITE);
    const duv = { top: C.blue, nz: C.blue, pz: C.blue, side: mixCol(C.blue, '#000', .15) };
    if (m < .5) box(P, B.x0 - 5, B.x1 + 5, 38, 50, B.z0 - 3, B.z1 - 62, duv);
    else box(P, B.x0 - 5, B.x1 + 5, 38, 52, B.z0 + 50, B.z1 - 90, duv);                    // kicked down the bed
    if (P.cam.y > 50) for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const z = (m < .5 ? B.z0 + 20 : B.z0 + 70) + j * 40; if (z > B.z1 - 70) continue; const d = P.floorCircle(B.x0 + 25 + i * 55 + (j % 2) * 22, z, 7, 50.4, 12); if (d) S(d, { fill: C.white, stroke: null }); }   // ball print
    sprite(P, -5, 50, B.z1 - 30, k => S([[-46, -2], [-46, -20], [0, -22], [46, -20], [46, -2], [0, 0]], { fill: C.white, stroke: C.line, lwPx: lwk(k), smooth: .5 }));
    if (m < .5) prop(P, 'ball', 55, 50, B.z1 - 50, 0, 1.4);                                 // a plush ball on the pillow
  }
  function footboard(P) {
    const B = BED; if (P.cam.z >= B.z0) return;
    P.plane(B.z0 - 4, () => { S(rectPts(B.x0 - 4, -40, B.x1 - B.x0 + 8, 40), { fill: C.navy, stroke: C.line, lwPx: px(P, 1.2) }); readable(P, (B.x0 + B.x1) / 2, -20, () => label('10', 0, 0, 22, C.white, 800, FONT_SFX)); });
  }
  function nightstand(P, t) {
    const N = STAND; box(P, N.x0, N.x1, 0, N.h, N.z0, N.z1, WHITE);
    if (P.cam.z < N.z0) P.plane(N.z0 - .5, () => { S(rectPts(N.x0 + 6, -N.h + 8, N.x1 - N.x0 - 12, 20), { fill: C.navy, stroke: C.line, lwPx: px(P, .9) }); circle((N.x0 + N.x1) / 2, -N.h + 18, 2.4, { fill: C.silver, stroke: null }); });
    prop(P, 'clock', N.x0 + 20, N.h, (N.z0 + N.z1) / 2, 0, 1, t);
    prop(P, 'book', N.x1 - 16, N.h, (N.z0 + N.z1) / 2 + 6, .2, 1, C.red);
  }
  function miniGoal(P) {
    const G = GOAL, net = (pts) => { const q = P.poly(pts); if (q) S(q, { fill: 'rgba(255,255,255,.4)', stroke: null }); };
    net([[G.x0, 0, G.z0], [G.x0, G.h, G.z0], [G.x0, G.h, G.z1], [G.x0, 0, G.z1]]);
    for (let i = 1; i < 8; i++) { const l = P.line([[G.x0 + 1, 0, lerp(G.z0, G.z1, i / 8)], [G.x0 + 1, G.h, lerp(G.z0, G.z1, i / 8)]]); if (l) line(l, { stroke: 'rgba(120,130,150,.7)', lwPx: px(P, .8) }); }
    for (let i = 1; i < 5; i++) { const l = P.line([[G.x0 + 1, i * G.h / 5, G.z0], [G.x0 + 1, i * G.h / 5, G.z1]]); if (l) line(l, { stroke: 'rgba(120,130,150,.7)', lwPx: px(P, .8) }); }
    prop(P, 'ball', -315, 0, 360, 0, 1.3); prop(P, 'ball', -305, 0, 430, .5, 1.1);
    for (const z of [G.z0, G.z1]) { const p = P.line([[G.x1, 0, z], [G.x1, G.h, z], [G.x0, G.h, z]]); if (p) { line(p, { stroke: C.line, lwPx: px(P, 5.5) }); line(p, { stroke: '#FFFFFF', lwPx: px(P, 3.5) }); } }
    const bar = P.line([[G.x1, G.h, G.z0], [G.x1, G.h, G.z1]]); if (bar) { line(bar, { stroke: C.line, lwPx: px(P, 5.5) }); line(bar, { stroke: '#FFFFFF', lwPx: px(P, 3.5) }); }
  }
  function desk(P, o) {
    const D = DESK, lit = clamp(o.lamp ?? .5);
    for (const z of [D.z0 + 8, D.z1 - 8]) box(P, D.x0 + 4, D.x0 + 12, 0, D.h - 6, z - 4, z + 4, NAVY, { lwPx: px(P, .8) });
    box(P, D.x0 + 10, HW, 14, D.h - 6, D.z1 - 70, D.z1 - 4, WHITE);
    if (P.cam.x < D.x0) for (let i = 0; i < 2; i++) { const p = wrect(P, D.x0 + 9.5, D.z1 - 64, D.z1 - 10, 20 + i * 24, 40 + i * 24); if (p) S(p, { fill: C.navy, stroke: C.line, lwPx: px(P, .8) }); }
    box(P, D.x0, HW, D.h - 6, D.h, D.z0, D.z1, WHITE);
    const y = D.h, xc = (D.x0 + HW) / 2;
    prop(P, 'laptop', xc - 8, y, D.z0 + 110, 0, 1.1, o.laptop !== false, lit);
    prop(P, 'deskLamp', xc + 10, y, D.z1 - 30, 0, 1, lit);
    prop(P, 'pencilCup', xc + 18, y, D.z0 + 30, 0, 1);
    prop(P, 'rubik', xc - 10, y, D.z0 + 40, .3, 1);
    for (let i = 0; i < 3; i++) prop(P, 'book', xc + 8, y + i * 4, D.z1 - 70, (i - 1) * .1, 1, [C.blue, C.green, C.orange][i]);
  }
  function gamingChair(P) {
    const c = CHAIR, blk = { top: '#4A5A78', nz: '#34425E', pz: '#34425E', side: '#2A3550' };
    const base = () => { box(P, (c.x0 + c.x1) / 2 - 3, (c.x0 + c.x1) / 2 + 3, 4, 38, (c.z0 + c.z1) / 2 - 3, (c.z0 + c.z1) / 2 + 3, C.silver, { lwPx: px(P, .6) }); const st = P.floorCircle((c.x0 + c.x1) / 2, (c.z0 + c.z1) / 2, 28, 3, 10); if (st) S(st, { fill: '#2A303C', stroke: C.line, lwPx: px(P, .7) }); box(P, c.x0, c.x1, 38, 48, c.z0, c.z1, blk); };
    const back = () => { box(P, c.x0 - 8, c.x0, 46, 128, c.z0 + 12, c.z1 - 12, blk); for (const xx of [c.x0 - 8.5, c.x0 + .5]) { const st = wrect(P, xx, c.z0 + 26, c.z1 - 26, 52, 124); if (st) S(st, { fill: C.red, stroke: null }); } };
    if (P.cam.x < c.x0) { back(); base(); } else { base(); back(); }
  }
  function wardrobe(P) {
    const Wd = WARD, mid = (Wd.z0 + Wd.z1) / 2;
    box(P, Wd.x0, HW, 0, Wd.h, Wd.z0, Wd.z1, NAVY);
    if (P.cam.x < Wd.x0) {
      for (const [a, b] of [[Wd.z0 + 8, mid - 2], [mid + 2, Wd.z1 - 8]]) { const d = wrect(P, Wd.x0 - .5, a, b, 14, Wd.h - 12); if (d) S(d, { fill: C.navyLt, stroke: C.line, lwPx: px(P, .9) }); }
      for (const z of [mid - 10, mid + 10]) { const k = P.p(Wd.x0 - 2, 118, z); if (P.visible(z)) circle(k[0], k[1], 3 * k[2], { fill: C.silver, stroke: C.line, lwPx: px(P, .6) }); }
    }
    prop(P, 'ball', 300, Wd.h, mid - 40, 0, 1.2);
  }
  function drawers(P) {
    const D = DRAWERS; box(P, D.x0, D.x1, 0, D.h, BACK, D.z1, WHITE);
    if (P.cam.z > D.z1) P.plane(D.z1 + .5, () => { for (let i = 0; i < 3; i++) { S(rectPts(D.x0 + 8, -D.h + 8 + i * 26, D.x1 - D.x0 - 16, 22), { fill: C.navy, stroke: C.line, lwPx: px(P, .9) }); for (const f of [.3, .7]) circle(lerp(D.x0, D.x1, f), -D.h + 19 + i * 26, 2.4, { fill: C.silver, stroke: null }); } });
    prop(P, 'ball', D.x0 + 30, D.h, 26, 0, 1.2); prop(P, 'cleats', D.x1 - 40, D.h, 28, 0, 1.3);
  }
  function hamper(P, m) {
    const x = -100, z = 30; box(P, x - 22, x + 22, 0, 52, z - 18, z + 18, { top: '#E8DCC0', nz: '#D9C79F', pz: '#D9C79F', side: '#C4B184' });
    if (m > .2) prop(P, 'sock', x, 52, z, .3, 1.2);
  }

  // ---------- the mess: [prop, x, y, z, rot, scale, threshold, extra] ----------
  const MESS = [
    ['ball', 70, 0, 300, 0, 1.4, .1], ['ball', -210, 0, 640, 0, 1.2, .5], ['cleats', -60, 0, 210, .3, 1.4, .2], ['cleats', 180, 0, 640, -.4, 1.3, .7],
    ['sock', 120, 0, 420, .4, 1.4, .25], ['sock', -150, 0, 160, -.6, 1.4, .6], ['sock', 40, 50, 760, .2, 1.3, .8],
    ['jersey', -40, 0, 560, .1, 1.5, .3, '10'], ['jersey', 200, 0, 250, -.2, 1.4, .65, '7'], ['jersey', -80, 50, 720, .2, 1.3, .9, '10'],
    ['paper', 230, 0, 340, 0, 1.3, .15, true], ['paper', 260, 0, 450, 0, 1.2, .35, true], ['paper', 150, 0, 520, 0, 1.3, .55, true], ['paper', 210, 0, 560, .3, 1.5, .45, false],
    ['book', -120, 0, 380, .5, 1.5, .4, C.green], ['book', 90, 0, 600, -.7, 1.4, .75, C.orange], ['rubik', -20, 0, 280, .6, 1.4, .85],
  ];

  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri }), m = clamp(+o.messy || 0);
    add(BED.z0, BED.z1, () => bed(P, m), 0);
    add(BED.z0 - 4, BED.z0 - 4, () => footboard(P), 3);
    add(STAND.z0, STAND.z1, () => nightstand(P, t), 0);
    add(GOAL.z0, GOAL.z1, () => miniGoal(P), -1);
    add(DESK.z0, DESK.z1, () => desk(P, o), 0);
    add(CHAIR.z0, CHAIR.z1, () => gamingChair(P), 1);
    add(WARD.z0, WARD.z1, () => wardrobe(P), -1);
    add(BACK, DRAWERS.z1, () => drawers(P), 0);
    add(12, 48, () => hamper(P, m), 0);
    MESS.forEach(([name, x, y, z, r, sc, th, extra]) => { if (m >= th) add(z, z, () => prop(P, name, x, y, z, r, sc, extra), 2); });
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 440 }, HW, BACK, FRONT, CEIL, BED, DESK, BOARD, GOAL, WARD, RUG, CHAIR, props: PROP,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P); ceiling(P, clamp(o.lamp ?? .5)); for (const x of [-HW, HW]) sideWall(P, x, t, o); backWall(P, t); frontWall(P, t);
      const d = !Number.isFinite(o.splitZ) ? -Infinity : P.depth(o.splitZ);
      for (const it of items(P, t, o)) if (it.key > d) it.draw();
    },
    front(P, t, o = {}) {
      if (!Number.isFinite(o.splitZ)) return;
      const d = P.depth(o.splitZ), stop = o.toZ == null ? -Infinity : P.depth(o.toZ);
      for (const it of items(P, t, o)) if (it.key <= d && it.key > stop) it.draw();
    },
  };
})();

// Registration for the studio's location browser: spots, camera presets (paste-ready for scene code) and the two versions.
// Bed cameras look toward the bed (dir 1); door cameras stand at the foot of the bed and look back (dir: -1).
LOCATIONS.housam_bedroom = Object.assign(housamBedroom, {
  variants: { Tidy: { messy: 0 }, Messy: { messy: 1 }, Night: { night: 1, lamp: 1 } },
  spots: {
    'Centre circle': { x: 0, y: 0, z: 440 },
    'Sitting on the bed': { x: -5, y: 48, z: 770 },
    'At the desk': { x: 205, y: 0, z: 410 },
    'In the mini goal': { x: -290, y: 0, z: 390 },
    'By the trophies': { x: -250, y: 0, z: 700 },
    'By the window': { x: -240, y: 0, z: 330 },
    'By the wardrobe': { x: 210, y: 0, z: 700 },
    'Doorway': { x: 220, y: 0, z: 50 },
  },
  cameras: {
    'Bed · wide from the door': { x: 0, y: 165, z: 30, f: 620, hy: 560, dir: 1 },
    'Bed · medium': { x: 0, y: 120, z: 250, f: 900, hy: 590, dir: 1 },
    'Desk and whiteboard': { x: 60, y: 140, z: 200, f: 900, hy: 580, dir: 1 },
    'Trophies and goal': { x: -100, y: 130, z: 200, f: 800, hy: 570, dir: 1 },
    'Floor · ball\'s-eye': { x: 0, y: 30, z: 150, f: 760, hy: 470, dir: 1 },
    'Door · from the bed': { x: 0, y: 170, z: 660, f: 620, hy: 540, dir: -1 },
    'Door · medium': { x: 40, y: 130, z: 420, f: 900, hy: 590, dir: -1 },
  },
});
