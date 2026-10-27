// locations/living_room/living_room.js: the family living room inside the red-brick house (see README.md).
//
// A warm, lived-in family room in one-point perspective (engine/persp.js), built like Alma's bedroom to be shot from BOTH ends:
//   TV view     cameras with dir: 1 (the default) stand by the sofa and look toward +Z: the big TV over the media console
//               (game console, two controllers), the board-game shelves on the right, a floor lamp and a fiddle-leaf fig on
//               the left; the curtained window and the armchair on the left wall; the archway to the hall on the right wall.
//   sofa view   cameras with dir: -1 stand by the TV and look back toward −Z: the blue sofa with its cushions, the family
//               portrait between two sconces, the side table and floor lamp, the archway (screen-left), the window (screen-right).
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   livingRoom.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   livingRoom.front(P, t, o)   pieces nearer than o.splitZ (the coffee table, the armchair…). Call after the characters.
//                               With o.toZ it stops at that depth, for several characters at different depths (far → near).
// o: { splitZ, toZ, lamp: 0..1 (the floor lamp, the sconces and the table lamp; default .5),
//      night: 0..1 (the window turns from a sunny garden to a starry night; default 0), fan: false stops the ceiling fan,
//      tv: false | true | fn(t)  (off, the default; on, a cartoon; or your own picture: fn draws in TV units, origin at the
//                                 screen's top-left, y down, clipped to livingRoom.TV.w × TV.h = 250 × 140) }
// Pass the same o to back() and front().
//
// Layout (world): side walls X = ±450, back (sofa) wall Z = 0, front (TV) wall Z = 1000, ceiling Y = 290, chair rail Y 95.
// TV X ±125, Y 120…260 over the console X ±200, Z 950–1000. Board-game shelves X 250…440, Z 955–1000. Sofa X ±220,
// Z 30–135 (seat Y 44). Coffee table X ±110, Z 300–380. Rug X ±270, Z 190–640. Window: left wall Z 420–760; armchair
// X −430…−330, Z 560–680. Archway: right wall Z 140–400, the hall and the stairs behind it. Ceiling fan at (0, 500).

const livingRoom = (() => {
  const HW = 450, BACK = 0, FRONT = 1000, CEIL = 290, RAIL = 95;
  const TV = { x0: -125, x1: 125, y0: 120, y1: 260, w: 250, h: 140 }, CONSOLE = { x0: -200, x1: 200, z0: 950, h: 52 };
  const SHELF = { x0: 250, x1: 440, z0: 955, h: 230 }, SOFA = { x0: -220, x1: 220, z0: 30, z1: 135, seat: 44, back: 98 };
  const TABLE = { x0: -110, x1: 110, z0: 300, z1: 380, h: 38 }, RUG = { x0: -270, x1: 270, z0: 190, z1: 640 };
  const WIN = { z0: 420, z1: 760, y0: 100, y1: 250 }, ARM = { x0: -430, x1: -330, z0: 560, z1: 680 }, ARCH = { z0: 140, z1: 400, h: 230 };
  const FAN = { x: 0, z: 520 };
  const C = {
    wall: '#EFE4D0', wallDk: '#E2D3BA', trim: '#FFFDF7', trimDk: '#E3D8C6', sage: '#B5C7A0', sageDk: '#8FA67A', ceil: '#FBF6EC',
    floor: '#C99A66', floorLt: '#D8AE7E', floorDk: '#A87C4E',
    rug: '#C8664B', rugDk: '#A44E38', navy: '#2F4A6B', cream: '#F3E3C3',
    sofa: '#5C7FA8', sofaDk: '#45668C', sofaLt: '#7C9CC2', mustard: '#E7B54A', coral: '#E9806A',
    wood: '#8A5A3B', woodDk: '#6A4129', woodLt: '#A9744E', tv: '#1C1F26', tvDk: '#0F1115', steel: '#9AA3AC',
    leaf: '#5E9E45', leafDk: '#3F7A32', pot: '#D9785A', sky: '#9DD3F2', skyLt: '#E1F3FC', tree: '#7FBF5C', treeDk: '#5E9E45',
    gold: '#E8B84A', bulb: '#FFE28A', hall: '#E6D6BC', hallDk: '#CDBB9C', white: '#FFFFFF', red: '#D9534F', line: '#5E4A44',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 4.5);
  const WOOD = { top: C.woodLt, nz: C.wood, pz: C.wood, side: C.woodDk };
  const SOFAC = { top: C.sofaLt, nz: C.sofa, pz: C.sofa, side: C.sofaDk };

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
  const label = (txt, x, y, size, col, weight = 700) => { X.font = `${weight} ${size}px ${FONT_TALK}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const fpoly = (P, y, pts) => P.poly(pts.map(([x, z]) => [x, y, z]));
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  function glowAt(x, y, rx, ry, col, a) { if (a < .01) return; X.save(); X.globalCompositeOperation = 'lighter'; ellipse(x, y, rx, ry, { fill: radGrad(x, y, 0, Math.max(rx, ry), [[0, rgba(col, a)], [1, rgba(col, 0)]]), stroke: null }); X.restore(); }
  const lwk = k => clamp(k * .32, .5, 1.6);

  // ---------- small props (sprite space: world units, y down, origin on the surface under the prop) ----------
  const PROP = {
    plant(lw, t) {                                                                       // a fiddle-leaf fig in a terracotta pot
      S([[-14, 0], [14, 0], [17, -26], [-17, -26]], { fill: C.pot, stroke: C.line, lwPx: lw });
      S(rectPts(-18, -30, 36, 5), { fill: mixCol(C.pot, '#000', .1), stroke: C.line, lwPx: lw });
      line([[0, -30], [-2, -90], [3, -140]], { stroke: C.woodDk, lwPx: lw * 2, smooth: true });
      for (let i = 0; i < 11; i++) { const y = -60 - i * 9, sd = i % 2 ? 1 : -1, sw = wob(t, .25, i) * 2, x = sd * (10 + hash(i) * 8);
        ellipse(x + sw, y, 11, 7, { fill: i % 3 ? C.leaf : C.leafDk, stroke: C.line, lwPx: lw * .8, rot: sd * .5 }); }
    },
    floorLamp(lw, lit) {
      glowAt(0, -160, 80, 60, '#FFE4B0', .5 * lit);
      ellipse(0, -1, 14, 3.5, { fill: C.woodDk, stroke: C.line, lwPx: lw }); line([[0, 0], [0, -150]], { stroke: C.woodDk, lwPx: lw * 2.4 });
      S([[-20, -148], [20, -148], [14, -176], [-14, -176]], { fill: lit > .05 ? '#FFF3D6' : C.cream, stroke: C.line, lwPx: lw });
    },
    tableLamp(lw, lit) {
      glowAt(0, -40, 50, 36, '#FFE4B0', .45 * lit);
      ellipse(0, -10, 8, 10, { fill: C.sage, stroke: C.line, lwPx: lw }); line([[0, -18], [0, -28]], { stroke: C.woodDk, lwPx: lw * 1.5 });
      S([[-13, -26], [13, -26], [9, -44], [-9, -44]], { fill: lit > .05 ? '#FFF3D6' : C.cream, stroke: C.line, lwPx: lw });
    },
    gameConsole(lw) {
      S(rectPts(-22, -8, 44, 8), { fill: '#F2F2F0', stroke: C.line, lwPx: lw }); S(rectPts(-20, -6, 10, 2), { fill: '#5AA9E6', stroke: null });
      circle(14, -4, 1.4, { fill: '#7CFF9B', stroke: null });
    },
    controller(lw, col) {
      S([[-9, -1], [-11, -5], [-7, -8], [7, -8], [11, -5], [9, -1], [5, -3], [-5, -3]], { fill: col, stroke: C.line, lwPx: lw, smooth: .4 });
      for (const [x, c] of [[4, '#E9806A'], [6.5, '#5AA9E6']]) circle(x, -5.5, 1, { fill: c, stroke: null });
      S(rectPts(-6.5, -6.2, 3, 1), { fill: '#333', stroke: null }); S(rectPts(-5.5, -7.2, 1, 3), { fill: '#333', stroke: null });
    },
    remote(lw) { S(rectPts(-3, -2, 6, 2), { fill: '#2A2D33', stroke: C.line, lwPx: lw }); },
    fruitBowl(lw) {
      for (const [x, y, r, c] of [[-6, -9, 5, '#E54B4B'], [3, -10, 5.5, '#F2A33A'], [-1, -13, 4.5, '#9BCB4A'], [8, -8, 4, '#E54B4B']]) circle(x, y, r, { fill: c, stroke: C.line, lwPx: lw * .8 });
      S([[-14, -8], [14, -8], [9, 0], [-9, 0]], { fill: C.cream, stroke: C.line, lwPx: lw });
    },
    magazines(lw) { S(rectPts(-12, -2, 24, 2), { fill: C.coral, stroke: C.line, lwPx: lw }); S(rectPts(-10, -4, 22, 2), { fill: '#5AA9E6', stroke: C.line, lwPx: lw }); },
    mug(lw) { S([[-4, -9], [4, -9], [3.5, 0], [-3.5, 0]], { fill: C.mustard, stroke: C.line, lwPx: lw }); ellipse(5.5, -5, 2, 2.6, { fill: null, stroke: C.line, lwPx: lw }); },
    frame(lw, kind) {                                                                    // a small standing photo
      S(rectPts(-7, -18, 14, 18), { fill: C.woodDk, stroke: C.line, lwPx: lw }); S(rectPts(-5, -16, 10, 14), { fill: kind ? '#CFE7F5' : '#F5E1CF', stroke: null });
      circle(-1.5, -10, 2, { fill: '#E9C3A0', stroke: null }); circle(2, -9, 1.6, { fill: '#C98A5E', stroke: null });
    },
    vase(lw) { S([[-4, 0], [4, 0], [6, -10], [2, -18], [-2, -18], [-6, -10]], { fill: '#5AA9E6', stroke: C.line, lwPx: lw, smooth: .4 }); for (const [x, c] of [[-4, C.coral], [0, C.mustard], [4, '#F4A8C8']]) { line([[0, -18], [x, -28]], { stroke: C.leafDk, lwPx: lw }); circle(x, -29, 2.6, { fill: c, stroke: C.line, lwPx: lw * .6 }); } },
  };

  // ---------- room shell ----------
  function wallPlane(P, x0, x1) {                                                        // on a z-plane: cream over a sage wainscot, white rail and skirting
    S(rectPts(x0, -CEIL, x1 - x0, CEIL), { fill: C.wall, stroke: null });
    S(rectPts(x0, -RAIL, x1 - x0, RAIL), { fill: C.sage, stroke: null });
    for (let x = x0 + 16; x < x1 - 60; x += 90) S(rectPts(x, -RAIL + 18, 70, RAIL - 36), { fill: null, stroke: C.sageDk, lwPx: px(P, 1.1) });
    S(rectPts(x0, -RAIL - 5, x1 - x0, 7), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .8) });
    S(rectPts(x0, -12, x1 - x0, 12), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .8) });
    S(rectPts(x0, -CEIL, x1 - x0, 12), { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .8) });   // crown moulding
  }
  function floor(P) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]); if (q) S(q, { fill: C.floor, stroke: null });
    for (let i = 0; i <= 20; i++) { const x = -HW + i * 45, l = P.line([[x, 0, BACK], [x, 0, FRONT]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .9) }); }
    for (let i = 0; i < 20; i++) for (let z = (hash(i + 9) * 240) | 0; z < FRONT; z += 240) {
      const l = P.line([[-HW + i * 45, 0, z], [-HW + i * 45 + 45, 0, z]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .7) });
      if (hash(i * 7 + z) < .3) { const p = fpoly(P, .2, [[-HW + i * 45 + 2, z + 4], [-HW + i * 45 + 43, z + 4], [-HW + i * 45 + 43, z + 130], [-HW + i * 45 + 2, z + 130]]); if (p) S(p, { fill: C.floorLt, stroke: null, alpha: .45 }); }
    }
    // the rug: a terracotta field, a navy border, a cream medallion and diamonds
    const R = RUG, rq = (inset, y) => fpoly(P, y, [[R.x0 + inset, R.z0 + inset], [R.x1 - inset, R.z0 + inset], [R.x1 - inset, R.z1 - inset], [R.x0 + inset, R.z1 - inset]]);
    for (const [ins, col, y] of [[0, C.navy, .3], [14, C.cream, .4], [22, C.rug, .5]]) { const r = rq(ins, y); if (r) S(r, { fill: col, stroke: ins ? null : C.line, lwPx: px(P, .9) }); }
    const cz = (R.z0 + R.z1) / 2, md = fpoly(P, .6, [[0, cz - 150], [150, cz], [0, cz + 150], [-150, cz]]); if (md) S(md, { fill: C.cream, stroke: null });
    const mi = fpoly(P, .7, [[0, cz - 100], [100, cz], [0, cz + 100], [-100, cz]]); if (mi) S(mi, { fill: C.navy, stroke: null });
    const mc = P.floorCircle(0, cz, 34, .8, 24); if (mc) S(mc, { fill: C.mustard, stroke: null });
    for (const [x, z] of [[-200, R.z0 + 60], [200, R.z0 + 60], [-200, R.z1 - 60], [200, R.z1 - 60]]) { const d = fpoly(P, .6, [[x, z - 26], [x + 26, z], [x, z + 26], [x - 26, z]]); if (d) S(d, { fill: C.cream, stroke: null }); }
  }
  function ceiling(P) { const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]); if (q) S(q, { fill: C.ceil, stroke: null }); }
  function sideWall(P, x, t, o) {
    const q = wrect(P, x, BACK, FRONT, 0, CEIL); if (q) S(q, { fill: C.wall, stroke: null });
    const wn = wrect(P, x, BACK, FRONT, 0, RAIL); if (wn) S(wn, { fill: C.sage, stroke: null });
    for (let z = 24; z < FRONT - 70; z += 100) { if (x > 0 && z + 80 > ARCH.z0 - 10 && z < ARCH.z1 + 10) continue; if (x < 0 && z + 80 > ARM.z0 - 20 && z < ARM.z1) continue;
      const p = wrect(P, x, z, z + 80, 18, RAIL - 18); if (p) S(p, { fill: null, stroke: C.sageDk, lwPx: px(P, 1) }); }
    for (const [y0, y1] of [[RAIL - 5, RAIL + 2], [0, 12], [CEIL - 12, CEIL]]) { const r = wrect(P, x, BACK, FRONT, y0, y1); if (r) S(r, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, .7) }); }
    if (x < 0) wallWindow(P, x, t, o); else { archway(P, x, t, o); gallery(P, x); }
  }
  function wallWindow(P, x, t, o) {
    const w = WIN, q = wrect(P, x, w.z0, w.z1, w.y0, w.y1), nt = clamp(o.night || 0); if (!q) return;
    clipTo(q, () => {
      const top = Math.min(...q.map(v => v[1])), bot = Math.max(...q.map(v => v[1]));
      S(q, { fill: linGrad(0, top, 0, bot, [[0, mixCol(C.sky, '#1B2550', nt)], [1, mixCol(C.skyLt, '#3A4A7A', nt)]]), stroke: null });
      if (nt > .5) for (let i = 0; i < 14; i++) { const p = P.p(x, w.y0 + 60 + hash(i + 3) * 80, w.z0 + hash(i) * (w.z1 - w.z0)); circle(p[0], p[1], 1.6 * p[2], { fill: '#FFF8D8', stroke: null }); }
      for (let i = 0; i < 7; i++) { const cz = w.z0 + i * 55 + hash(i) * 20, cy = w.y0 + 8 + hash(i + 8) * 24, r = 34 + hash(i + 2) * 16;
        const b = wpoly(P, x, Array.from({ length: 16 }, (_, j) => { const a = j / 16 * TAU; return [cz + Math.cos(a) * r + (i % 2 ? wob(t, .2, i) * 2 : 0), cy + Math.sin(a) * r * .7]; }));
        if (b) S(b, { fill: mixCol(i % 2 ? C.tree : C.treeDk, '#1C2A3A', nt * .7), stroke: null }); }
    });
    S(q, { fill: null, stroke: C.trim, lwPx: px(P, 6) });
    for (const f of [1 / 3, 2 / 3]) { const l = P.line([[x, w.y0, lerp(w.z0, w.z1, f)], [x, w.y1, lerp(w.z0, w.z1, f)]]); if (l) line(l, { stroke: C.trim, lwPx: px(P, 3) }); }
    const l = P.line([[x, (w.y0 + w.y1) / 2, w.z0], [x, (w.y0 + w.y1) / 2, w.z1]]); if (l) line(l, { stroke: C.trim, lwPx: px(P, 3) });
    const sill = wrect(P, x, w.z0 - 14, w.z1 + 14, w.y0 - 8, w.y0); if (sill) S(sill, { fill: C.trim, stroke: C.trimDk, lwPx: px(P, 1) });
    for (const [za, zb] of [[w.z0 - 70, w.z0 + 10], [w.z1 - 10, w.z1 + 70]]) {           // long mustard curtains
      const xi = x + 3, sway = wob(t, .12, za) * 2, c = wpoly(P, xi, [[za, CEIL - 20], [zb, CEIL - 20], [zb + sway, 10], [za, 10]]); if (c) S(c, { fill: C.mustard, lwPx: px(P, 1) });
      for (let k = 1; k < 4; k++) { const f = P.line([[xi, CEIL - 22, lerp(za, zb, k / 4)], [xi, 12, lerp(za, zb, k / 4) + sway]]); if (f) line(f, { stroke: mixCol(C.mustard, '#000', .18), lwPx: px(P, 1.2) }); }
    }
    const rod = P.line([[x + 4, CEIL - 20, w.z0 - 80], [x + 4, CEIL - 20, w.z1 + 80]]); if (rod) line(rod, { stroke: C.woodDk, lwPx: px(P, 3) });
  }
  // The archway to the hall: a real opening, with the hall floor, the stairs going up and the front door behind it.
  function archway(P, x, t, o) {
    const A = ARCH, pts = [[A.z0, 0]]; for (let i = 0; i <= 12; i++) { const a = Math.PI - i / 12 * Math.PI; pts.push([(A.z0 + A.z1) / 2 + Math.cos(a) * (A.z1 - A.z0) / 2, A.h - 40 + Math.sin(a) * 40]); } pts.push([A.z1, 0]);
    const q = wpoly(P, x, pts); if (!q) return;
    clipTo(q, () => {
      const HX = x + 280, nt = clamp(o.night || 0);
      const fw = wrect(P, HX, A.z0 - 200, A.z1 + 200, 0, CEIL + 120); if (fw) S(fw, { fill: C.hall, stroke: null });
      const hf = P.poly([[x, 0, A.z0 - 200], [HX, 0, A.z0 - 200], [HX, 0, A.z1 + 200], [x, 0, A.z1 + 200]]); if (hf) S(hf, { fill: C.floorDk, stroke: null });
      const dr = wrect(P, HX - .5, 300, 390, 0, 210); if (dr) S(dr, { fill: C.trim, stroke: C.line, lwPx: px(P, 1) });              // the front door
      const gl = wrect(P, HX - 1, 320, 370, 120, 190); if (gl) S(gl, { fill: mixCol('#CFE7F5', '#2A3A66', nt), stroke: C.line, lwPx: px(P, .8) });
      const kn = P.p(HX - 2, 100, 318); if (P.visible(318)) circle(kn[0], kn[1], 2.4 * kn[2], { fill: C.gold, stroke: null });
      for (let i = 0; i < 9; i++) box(P, x + 60, HX, i * 24, i * 24 + 24, 60, 380 - i * 28, { top: C.woodLt, nz: C.trim, pz: C.trim, side: C.wood }, { lwPx: px(P, .7) });   // the stairs, rising toward −Z
      const ban = P.line([[x + 60, 90, 380], [x + 60, 90 + 9 * 24, 380 - 9 * 28]]); if (ban) line(ban, { stroke: C.woodDk, lwPx: px(P, 3) });
      for (let i = 0; i < 9; i++) { const b = P.line([[x + 60, i * 24 + 24, 366 - i * 28], [x + 60, i * 24 + 90, 366 - i * 28]]); if (b) line(b, { stroke: C.trim, lwPx: px(P, 1.6) }); }
      S(q, { fill: 'rgba(80,50,30,.12)', stroke: null });                                // the hall is a touch darker
    });
    S(q, { fill: null, stroke: C.trim, lwPx: px(P, 7) });
  }
  function gallery(P, x) {                                                               // family photos up the right wall
    [[520, 130, 600, 200, '#F5E1CF'], [620, 150, 680, 230, '#CFE7F5'], [700, 120, 790, 190, '#E5F0D6'], [610, 110, 670, 140, '#F4D9E4'], [810, 140, 870, 210, '#F5E1CF']].forEach(([za, ya, zb, yb, f], i) => {
      const fr = wrect(P, x - 1, za, zb, ya, yb); if (!fr) return; S(fr, { fill: i % 2 ? C.woodDk : C.trim, stroke: C.line, lwPx: px(P, .9) });
      const ph = wrect(P, x - 1.5, za + 6, zb - 6, ya + 6, yb - 6); if (ph) S(ph, { fill: f, stroke: null });
      for (let j = 0; j < 2 + i % 2; j++) { const fc = P.p(x - 2, ya + (yb - ya) * .5, za + (zb - za) * (.3 + j * .25)); if (P.visible(za)) circle(fc[0], fc[1], 5 * fc[2], { fill: ['#E9C3A0', '#C98A5E', '#DCA887'][j], stroke: null }); }
    });
  }
  // Front wall (Z = 1000): the TV on the wall. Only seen from the TV view.
  function tvWall(P, t, o) {
    P.plane(FRONT, () => {
      wallPlane(P, -HW, HW);
      const T = TV; S(rectPts(T.x0 - 8, -T.y1 - 8, T.w + 16, T.h + 16), { fill: C.tv, stroke: C.line, lwPx: px(P, 1.2) });
      X.save(); X.beginPath(); X.rect(T.x0, -T.y1, T.w, T.h); X.clip(); X.translate(T.x0, -T.y1);
      if (P.dir < 0) X.scale(1, 1);
      if (typeof o.tv === 'function') o.tv(t);
      else if (o.tv) tvCartoon(t);
      else { X.fillStyle = linGrad(0, 0, T.w, T.h, [[0, '#2B3038'], [1, C.tvDk]]); X.fillRect(0, 0, T.w, T.h); S([[30, 0], [80, 0], [20, T.h], [-30, T.h]], { fill: 'rgba(255,255,255,.06)', stroke: null }); }
      X.restore();
      if (o.tv) { X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = radGrad(0, -T.y0 - T.h / 2, 40, 260, [[0, 'rgba(140,200,255,.18)'], [1, 'rgba(140,200,255,0)']]); X.fillRect(-300, -T.y1 - 140, 600, 420); X.restore(); }
      circle(T.x1 - 6, -T.y0 + 4, 1.6, { fill: o.tv ? '#7CFF9B' : '#E85A5A', stroke: null });
    });
  }
  function tvCartoon(t) {                                                                // the default picture: a dolphin leaping over the waves
    const T = TV; X.fillStyle = linGrad(0, 0, 0, T.h, [[0, '#8FD3FF'], [1, '#E6F7FF']]); X.fillRect(0, 0, T.w, T.h);
    circle(200, 30, 14, { fill: '#FFE66B', stroke: null });
    const sea = [[0, T.h], [0, 100]]; for (let i = 0; i <= 25; i++) sea.push([i * 10, 100 + 5 * Math.sin(i * .9 + t * 3)]); sea.push([T.w, T.h]); S(sea, { fill: '#3A9BD9', stroke: null });
    const u = frac(t * .4), dx = lerp(-30, T.w + 30, u), dy = 100 - 70 * Math.sin(Math.PI * u);
    X.save(); X.translate(dx, dy); X.rotate(-.9 + 1.8 * u); ellipse(0, 0, 22, 9, { fill: '#2EB2EE', stroke: '#1E3657', lwPx: 1.5 }); S([[-20, 0], [-30, -8], [-30, 8]], { fill: '#2EB2EE', stroke: '#1E3657', lwPx: 1.2 }); circle(12, -3, 1.6, { fill: '#111', stroke: null }); X.restore();
  }
  // Back wall (Z = 0), behind the sofa: the family portrait between two sconces. Only seen from the sofa view.
  function sofaWall(P, t, o) {
    const lit = clamp(o.lamp ?? .5);
    P.plane(BACK, () => {
      wallPlane(P, -HW, HW);
      S(rectPts(-110, -250, 220, 120), { fill: C.gold, stroke: C.line, lwPx: px(P, 1.2) });                                  // the family portrait
      S(rectPts(-100, -240, 200, 100), { fill: '#CFE7F5', stroke: null });
      S([[-100, -140], [-100, -165], [-40, -175], [30, -168], [100, -178], [100, -140]], { fill: '#A9D18E', stroke: null });
      [[-62, '#E9C3A0', 24, '#3A2A22', C.navy], [-22, '#DCA887', 19, '#282027', '#F1F0EA'], [14, '#F2C9A8', 18, '#5A2E6E', '#B678E0'], [52, '#E9C3A0', 24, '#3A2A22', C.coral]].forEach(([x, skin, r, hair, shirt]) => {
        const hy = -168 - r;                                                             // a smiling family, shoulders up
        S([[x - r * .9, -140], [x - r * .8, hy + r * 1.1], [x + r * .8, hy + r * 1.1], [x + r * .9, -140]], { fill: shirt, stroke: C.line, lwPx: px(P, .6), smooth: .3 });
        circle(x, hy, r * .62, { fill: skin, stroke: C.line, lwPx: px(P, .6) });
        S([[x - r * .64, hy - r * .05], [x - r * .5, hy - r * .55], [x, hy - r * .7], [x + r * .5, hy - r * .55], [x + r * .64, hy - r * .05], [x + r * .3, hy - r * .35], [x - r * .3, hy - r * .35]], { fill: hair, stroke: null, smooth: .4 });
        for (const sd of [-1, 1]) circle(x + sd * r * .22, hy + r * .02, r * .07, { fill: '#2A1E22', stroke: null });
        line([[x - r * .2, hy + r * .22], [x, hy + r * .32], [x + r * .2, hy + r * .22]], { stroke: '#2A1E22', lwPx: px(P, .8), smooth: true }); });
      for (const x of [-200, 200]) {                                                    // sconces
        glowAt(x, -205, 60, 46, '#FFE4B0', .55 * lit);
        S(rectPts(x - 4, -200, 8, 20), { fill: C.gold, stroke: C.line, lwPx: px(P, .7) }); S([[x - 12, -200], [x + 12, -200], [x + 8, -224], [x - 8, -224]], { fill: lit > .05 ? '#FFF3D6' : C.cream, stroke: C.line, lwPx: px(P, .8) });
      }
      readable(P, 0, -122, () => label('HOME SWEET HOME', 0, 0, 13, C.woodDk, 700));
    });
  }

  // ---------- furniture ----------
  function sofa(P) {
    const F = SOFA;
    box(P, F.x0, F.x1, 0, 8, F.z0 + 6, F.z1 - 6, C.woodDk);                                // feet
    box(P, F.x0 + 22, F.x1 - 22, 8, F.seat - 12, F.z0 + 30, F.z1, SOFAC);                   // base
    for (let i = 0; i < 3; i++) { const a = F.x0 + 22 + i * (F.x1 - F.x0 - 44) / 3; box(P, a + 1, a + (F.x1 - F.x0 - 44) / 3 - 1, F.seat - 12, F.seat, F.z0 + 30, F.z1 + 4, SOFAC); }   // seat cushions
    box(P, F.x0 + 10, F.x1 - 10, 8, F.back, F.z0, F.z0 + 30, SOFAC);                        // back
    for (const [a, b] of [[F.x0, F.x0 + 24], [F.x1 - 24, F.x1]]) box(P, a, b, 8, F.seat + 18, F.z0, F.z1 + 2, SOFAC);   // arms
    for (const [x, c, r] of [[-150, C.mustard, -.12], [-60, C.coral, .06], [150, C.mustard, .1]])                         // throw cushions
      sprite(P, x, F.seat, F.z0 + 34, k => { X.rotate(r); S([[-20, 0], [-22, -30], [0, -33], [22, -30], [20, 0], [0, 2]], { fill: c, stroke: C.line, lwPx: lwk(k), smooth: .5 }); });
    sprite(P, 90, F.seat, F.z0 + 60, k => { S([[-34, 0], [-30, -6], [30, -8], [34, 0], [20, 3], [-20, 3]], { fill: '#F3E3C3', stroke: C.line, lwPx: lwk(k), smooth: .4 }); for (let i = -2; i <= 2; i++) line([[i * 12, -6], [i * 12 + 2, 2]], { stroke: C.coral, lwPx: lwk(k) * 1.5 }); });   // a folded throw
  }
  function sideTable(P, x, lit) {
    box(P, x - 28, x + 28, 0, 56, 40, 96, WOOD);
    sprite(P, x - 6, 56, 70, k => PROP.tableLamp(lwk(k), lit));
    sprite(P, x + 16, 56, 62, k => PROP.mug(lwk(k)));
  }
  function coffeeTable(P) {
    const T = TABLE;
    for (const [x, z] of [[T.x0 + 8, T.z0 + 8], [T.x1 - 8, T.z0 + 8], [T.x0 + 8, T.z1 - 8], [T.x1 - 8, T.z1 - 8]]) box(P, x - 4, x + 4, 0, T.h - 6, z - 4, z + 4, WOOD, { lwPx: px(P, .7) });
    box(P, T.x0 + 6, T.x1 - 6, 8, 12, T.z0 + 6, T.z1 - 6, WOOD, { lwPx: px(P, .7) });       // the lower shelf
    box(P, T.x0, T.x1, T.h - 6, T.h, T.z0, T.z1, WOOD);
    sprite(P, -50, T.h, (T.z0 + T.z1) / 2, k => PROP.fruitBowl(lwk(k)));
    sprite(P, 30, T.h, T.z0 + 22, k => { X.rotate(.3); PROP.remote(lwk(k)); });
    sprite(P, 60, T.h, T.z1 - 24, k => PROP.magazines(lwk(k)));
    sprite(P, 0, 12, (T.z0 + T.z1) / 2, k => { [C.coral, '#5AA9E6', '#1F7A4E'].forEach((c, i) => S(rectPts(-24 + i * 3, -6 * (i + 1), 46, 6), { fill: c, stroke: C.line, lwPx: lwk(k) })); });   // board games under the table
  }
  function mediaConsole(P) {
    const M = CONSOLE;
    box(P, M.x0, M.x1, 0, 8, M.z0 + 4, FRONT - 2, C.woodDk);
    box(P, M.x0, M.x1, 8, M.h, M.z0, FRONT, WOOD);
    if (P.cam.z < M.z0) P.plane(M.z0 - .5, () => { for (let i = 0; i < 3; i++) { const a = M.x0 + 10 + i * 128; S(rectPts(a, -M.h + 8, 120, M.h - 18), { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, .9) }); circle(a + 60, -M.h / 2 - 2, 2.2, { fill: C.gold, stroke: null }); } });
    sprite(P, -60, M.h, 975, k => PROP.gameConsole(lwk(k)));
    sprite(P, 40, M.h, 966, k => PROP.controller(lwk(k), '#2A2D33'));
    sprite(P, 80, M.h, 972, k => { X.rotate(.2); PROP.controller(lwk(k), '#E9806A'); });
    sprite(P, -150, M.h, 975, k => PROP.vase(lwk(k)));
    sprite(P, 150, M.h, 975, k => PROP.frame(lwk(k), 1));
  }
  // The board-game shelves right of the TV: the kids' games (Crazy Dolphins, Oligarchy, Rainbow Race…) and a few books.
  function gameShelves(P) {
    const B = SHELF, x0 = B.x0, x1 = B.x1;
    box(P, x0, x1, 0, B.h, B.z0, FRONT, { top: C.trim, nz: C.trim, pz: C.trim, side: C.trimDk });
    if (P.cam.z >= B.z0) return;
    P.plane(B.z0 - .5, () => {
      S(rectPts(x0 + 6, -B.h + 6, x1 - x0 - 12, B.h - 12), { fill: C.wallDk, stroke: C.line, lwPx: px(P, .8) });
      for (const y of [56, 112, 168]) S(rectPts(x0 + 6, -y - 4, x1 - x0 - 12, 5), { fill: C.trim, stroke: C.line, lwPx: px(P, .6) });
      const games = [['#2E8BD8', 'CRAZY DOLPHINS'], ['#1F7A4E', 'OLIGARCHY'], ['#B66CE0', 'RAINBOW RACE'], ['#E9806A', 'CHESS'], ['#E7B54A', 'PUZZLE']];
      games.forEach(([c, t], i) => { const y = -10 - i * 9; S(rectPts(x0 + 16 + (i % 2) * 6, y - 8, 120, 8), { fill: c, stroke: C.line, lwPx: px(P, .6) }); readable(P, x0 + 76 + (i % 2) * 6, y - 4, () => label(t, 0, 0, 5.4, '#FFFFFF')); });
      for (let i = 0; i < 12; i++) { const h = 34 + hash(i) * 14; S(rectPts(x0 + 14 + i * 13, -60 - h, 11, h), { fill: [C.navy, C.coral, C.mustard, C.sage, '#5AA9E6', C.wood][i % 6], stroke: C.line, lwPx: px(P, .5) }); }
      readable(P, x0 + 50, -118, () => PROP.frame(px(P, .6), 0)); readable(P, x0 + 130, -118, () => PROP.vase(px(P, .6)));
      S(rectPts(x0 + 30, -205, 130, 30), { fill: '#F2F0EA', stroke: C.line, lwPx: px(P, .6) }); readable(P, x0 + 95, -190, () => label('FAMILY GAME NIGHT', 0, 0, 9, C.coral));
    });
  }
  function armchair(P) {
    const A = ARM, col = { top: '#E5A07A', nz: C.coral, pz: C.coral, side: mixCol(C.coral, '#000', .12) };
    box(P, A.x0 + 8, A.x1, 0, 6, A.z0 + 8, A.z1 - 8, C.woodDk);
    box(P, A.x0 + 18, A.x1, 6, 40, A.z0 + 14, A.z1 - 14, col);
    box(P, A.x0, A.x0 + 22, 6, 105, A.z0 + 6, A.z1 - 6, col);                                 // the back, against the wall
    for (const [a, b] of [[A.z0, A.z0 + 18], [A.z1 - 18, A.z1]]) box(P, A.x0 + 10, A.x1, 6, 62, a, b, col);
    sprite(P, A.x0 + 40, 40, (A.z0 + A.z1) / 2, k => S([[-16, 0], [-18, -26], [0, -28], [18, -26], [16, 0]], { fill: C.navy, stroke: C.line, lwPx: lwk(k), smooth: .5 }));
  }
  function fan(P, t, o) {
    const y = CEIL - 34, rod = P.line([[FAN.x, CEIL, FAN.z], [FAN.x, y, FAN.z]]); if (rod) line(rod, { stroke: C.woodDk, lwPx: px(P, 2) });
    const a0 = o.fan === false ? .4 : t * TAU * .7;
    for (let i = 0; i < 4; i++) { const a = a0 + i * TAU / 4, ca = Math.cos(a), sa = Math.sin(a), pt = (u, v) => [FAN.x + u * ca - v * sa, FAN.z + u * sa + v * ca];
      const b = fpoly(P, y, [pt(14, -9), pt(95, -14), pt(100, 0), pt(95, 14), pt(14, 9)]); if (b) S(b, { fill: C.woodLt, stroke: C.line, lwPx: px(P, .8) }); }
    const hub = P.floorCircle(FAN.x, FAN.z, 16, y - 4, 16); if (hub) S(hub, { fill: C.gold, stroke: C.line, lwPx: px(P, .8) });
  }

  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri }), lit = clamp(o.lamp ?? .5);
    add(SOFA.z0, SOFA.z1, () => sofa(P), 0);
    add(40, 96, () => sideTable(P, -280, lit), 0);
    add(70, 70, () => sprite(P, 290, 0, 70, k => PROP.floorLamp(lwk(k), lit)), 1);
    add(TABLE.z0, TABLE.z1, () => coffeeTable(P), 0);
    add(CONSOLE.z0, FRONT, () => mediaConsole(P), 0);
    add(SHELF.z0, FRONT, () => gameShelves(P), -1);
    add(960, 960, () => sprite(P, -340, 0, 960, k => PROP.floorLamp(lwk(k), lit * .6)), 1);
    add(930, 930, () => sprite(P, -400, 0, 930, k => PROP.plant(lwk(k), t)), 1);
    add(ARM.z0, ARM.z1, () => armchair(P), -1);
    add(FAN.z, FAN.z, () => fan(P, t, o), 4);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 470 }, HW, BACK, FRONT, CEIL, TV, CONSOLE, SHELF, SOFA, TABLE, RUG, WIN, ARM, ARCH, props: PROP,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P); ceiling(P); for (const x of [-HW, HW]) sideWall(P, x, t, o); sofaWall(P, t, o); tvWall(P, t, o);
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

// Registration for the studio's location browser: spots, camera presets (paste-ready for scene code) and versions.
// TV cameras look toward the TV wall (dir 1); sofa cameras stand by the TV and look back (dir: -1).
LOCATIONS.living_room = Object.assign(livingRoom, {
  variants: { Day: { night: 0 }, 'TV on': { tv: true }, Evening: { night: 1, lamp: 1, tv: true } },
  spots: {
    'Middle of the rug': { x: 0, y: 0, z: 470 },
    'On the sofa · left': { x: -130, y: 44, z: 90 },
    'On the sofa · middle': { x: 0, y: 44, z: 90 },
    'On the sofa · right': { x: 130, y: 44, z: 90 },
    'In front of the sofa': { x: 0, y: 0, z: 220 },
    'In front of the TV': { x: 0, y: 0, z: 820 },
    'By the game shelves': { x: 300, y: 0, z: 860 },
    'By the window': { x: -330, y: 0, z: 480 },
    'In the archway': { x: 400, y: 0, z: 270 },
  },
  cameras: {
    'TV · wide from the sofa': { x: 0, y: 165, z: 120, f: 620, hy: 560, dir: 1 },
    'TV · medium': { x: 0, y: 130, z: 480, f: 900, hy: 590, dir: 1 },
    'TV · game shelves': { x: 230, y: 140, z: 620, f: 1000, hy: 600, dir: 1 },
    'TV · window and armchair': { x: -150, y: 140, z: 250, f: 700, hy: 560, dir: 1 },
    'Sofa · wide from the TV': { x: 0, y: 170, z: 960, f: 620, hy: 540, dir: -1 },
    'Sofa · medium': { x: 0, y: 125, z: 700, f: 900, hy: 590, dir: -1 },
    'Sofa · close': { x: 0, y: 110, z: 400, f: 1000, hy: 620, dir: -1 },
    'Sofa · archway': { x: 160, y: 140, z: 760, f: 800, hy: 570, dir: -1 },
  },
});
