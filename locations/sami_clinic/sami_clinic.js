// locations/sami_clinic/sami_clinic.js: Doctor Sami's clinic office (see README.md).
//
// A 3D interior in one-point perspective (engine/persp.js), built like the science room to be shot from BOTH ends:
//   desk view   cameras with dir: 1 (the default) stand by the exam table and look toward +Z: Dr. Sami's desk (a beating heart
//               model, a sticker jar, a computer), the X-ray light box, the eye chart, the healthy-plate poster, the sink
//               and the balance-beam scale with the giraffe growth chart.
//   exam view   cameras with dir: -1 stand behind the desk and look back toward −Z: the exam table with its paper roll, the
//               heart monitor, the fruit-and-veg mobile, the privacy curtain, the kids' corner and the window with blinds.
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   samiClinic.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   samiClinic.front(P, t, o)   pieces nearer than o.splitZ (desk, chairs, exam table…). Call after the characters.
//                               With o.toZ it stops at that depth, for several characters at different depths (far → near).
// o: { splitZ, toZ, bpm: the heart monitor's rate and the heart model's beat (default 72; 0 switches the monitor off),
//      curtain: 0..1 (the privacy curtain, 0 = bunched open at the wall, 1 = drawn across the exam table; default 0),
//      blinds: 0..1 (window blinds, 1 = slats open, 0 = shut; default .75),
//      xray(t): draw your own X-ray on the light box (default: a cartoon chest X-ray). Local coords: origin at the box's top-left,
//               world units, y down; the screen is samiClinic.XRAY.w × XRAY.h (200 × 130) and the content is clipped to it. }
//
// Layout (world): side walls X = ±480, back wall Z = 0, front wall Z = 1100, ceiling Y = 330.
// Desk X ±200, Z 790–870, top Y 76; Dr. Sami's chair behind it; two visitor chairs in front (Z 680). X-ray box and eye chart on
// the front wall; sink counter in the front-left corner; scale and growth chart front-right. Exam table X −200…120, Z 30–130
// against the back wall, heart monitor beside it; curtain track at Z 230; kids' corner back right. Window right wall, door left.

const samiClinic = (() => {
  const HW = 480, BACK = 0, FRONT = 1100, CEIL = 330;
  const DESK = { x0: -200, x1: 200, z0: 790, z1: 870, h: 76 }, CHAIR = { x: 0, z: 1010 };
  const XRAY = { x: -270, y: 285, w: 200, h: 130 };                                       // y = top edge (world Y)
  const SINK = { x0: -470, x1: -300, z0: 1040, h: 90 }, SCALE = { x: 385, z: 1020 };
  const EXAM = { x0: -200, x1: 120, z0: 30, z1: 130, h: 80 }, MON = { x: 250, y: 255, w: 130, h: 85 };
  const TRACK = { z: 230, x0: -470, x1: 170 }, MOBILE = { x: -40, z: 85, y: 215 };
  const KIDS = { x: 345, z: 230 }, TOYBOX = { x0: 360, x1: 470, z0: 10, z1: 80 };
  const WIN = { z0: 380, z1: 760, y0: 110, y1: 290 }, DOOR = { z0: 820, z1: 950 }, GROW = { z0: 880, z1: 1050 };
  const C = {
    wall: '#E4F4EE', wallDk: '#C9E3DA', wallLt: '#F2FAF7', stripe: '#7ECFC0', stripe2: '#F7B267',
    ceil: '#F7F8F5', ceilDk: '#DCDFD8', lamp: '#FFFCEA',
    floor: '#D6E2E8', floorDk: '#BCCCD6', speck: '#9DB1BE',
    white: '#FBFCFC', whiteDk: '#DDE3E6', mint: '#8AE5B3', mintDk: '#5CC08E', teal: '#3FA7A0', tealDk: '#2C7F7A', tealLt: '#6CC6BE',
    scrub: '#4C86A8', scrubDk: '#36678A', steel: '#8C969E', steelLt: '#BAC3CA', steelDk: '#5F6A73', chrome: '#D5DCE1',
    wood: '#E2BC86', woodDk: '#B98E59', paper: '#FFFDF6', screen: '#12202A', ecg: '#5CFF9D',
    sky: '#8CC8EC', skyLt: '#DDF0FA', tree: '#6DAE4B', treeDk: '#4F8C38', treeLt: '#94C962', door: '#9FC6E0', doorDk: '#6F9DBE',
    curtain: '#B6DDF2', curtainDk: '#8CC2E0',
    lime: '#8CCB5A', red: '#E0584E', orange: '#F29A3A', yellow: '#F4CD3A', green: '#6DBE57', blue: '#4C8FD8', purple: '#9A6AD0', pink: '#EE7FB0',
    line: '#3B2530',
  };
  const BRIGHT = [C.red, C.orange, C.yellow, C.green, C.blue, C.purple, C.pink, C.teal];
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.3, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 5);
  const beat = (t, bpm) => bpm > 0 ? Math.exp(-frac(t * bpm / 60) * 7) : 0;              // 1 on each heartbeat, decays

  // ---------- building blocks ----------
  // An axis-aligned box with back-face culling. col: one colour, or { top, nz (faces −Z), pz (faces +Z), side, bot }
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .18), nz: col, pz: col, side: mixCol(col, '#000000', .12) } : col;
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.2), stroke = o.stroke === undefined ? C.line : o.stroke, skip = o.skip || '';
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, stroke: stroke || fill, lwPx: stroke ? lw : .6 }); };
    if (cam.z < z0 && !skip.includes('nz')) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz ?? c.pz);
    if (cam.z > z1 && !skip.includes('pz')) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz ?? c.nz);
    if (cam.x < x0 && !skip.includes('side')) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1 && !skip.includes('side')) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1 && !skip.includes('top')) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
    if (cam.y < y0 && !skip.includes('bot')) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.bot ?? c.side);
  }
  // A camera-facing cut-out at a world point, drawn in world units with y pointing down.
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
  function heart(cx, cy, r, col, o = {}) {
    S([[cx, cy + r], [cx - r * 1.1, cy - r * .1], [cx - r * .95, cy - r * .75], [cx - r * .45, cy - r * .95], [cx, cy - r * .55], [cx + r * .45, cy - r * .95], [cx + r * .95, cy - r * .75], [cx + r * 1.1, cy - r * .1]], { fill: col, smooth: true, ...o });
  }

  // ---------- props (sprite-space: world units, y down, origin on the surface they stand on) ----------
  function heartModel(t, bpm) {
    const b = 1 + .14 * beat(t, bpm);
    S(ellPts(0, -1.5, 10, 2.6), { fill: C.steelDk, lwPx: .9 }); line([[0, -2], [0, -14]], { stroke: C.steel, lwPx: 1.8 });
    X.save(); X.translate(0, -26); X.scale(b, b);
    heart(0, 0, 12, C.red, { lwPx: 1.1 });
    S([[-3, -9], [-2, -16], [2, -16], [3, -9]], { fill: C.blue, lwPx: .8 });                // the aorta, in blue (it's a model)
    S([[4, -8], [8, -14], [10, -12], [7, -6]], { fill: C.purple, lwPx: .8 });
    ellipse(-5, -3, 3.5, 2.2, { fill: 'rgba(255,255,255,.45)', stroke: null, rot: -.5 });
    X.restore();
  }
  function stickerJar(t) {
    S([[-12, -30], [12, -30], [13, -2], [10, 0], [-10, 0], [-13, -2]], { fill: 'rgba(215,236,248,.75)', stroke: '#6E8796', lwPx: 1.1 });
    for (let i = 0; i < 9; i++) { const x = -8 + (i % 3) * 8 + hash(i) * 2, y = -6 - Math.floor(i / 3) * 7; S(starPts(x, y, 3.6, .5, 5, hash(i + 3)), { fill: BRIGHT[i % 8], lwPx: .6 }); }
    S(rectPts(-13, -34, 26, 5), { fill: C.mint, lwPx: .9 });
    S(rectPts(-9, -20, 18, 8), { fill: C.paper, lwPx: .6 }); label('BRAVE!', 0, -16, 4.6, C.red);
  }
  function computer(screenSide, t, bpm) {
    S(rectPts(-10, -4, 20, 4), { fill: C.steelDk, lwPx: .9 }); S(rectPts(-3, -14, 6, 10), { fill: C.steelDk, lwPx: .9 });
    S(rectPts(-30, -52, 60, 40), { fill: '#2E3640', lwPx: 1.2 });
    if (screenSide) {                                                                    // the patient chart, with a growth curve
      S(rectPts(-27, -49, 54, 34), { fill: '#EAF7F2', stroke: null }); S(rectPts(-27, -49, 54, 6), { fill: C.teal, stroke: null });
      line([[-22, -18], [-10, -24], [0, -28], [12, -33], [22, -36]], { stroke: C.blue, lwPx: 1.2 });
      heart(-17, -38, 3, C.red, { stroke: null }); S(rectPts(-11, -40, 18, 2.4), { fill: '#8FB5A6', stroke: null });
    } else { S(rectPts(-24, -48, 48, 30), { fill: '#3A444F', stroke: null }); S(starPts(0, -33, 6, .5), { fill: C.mint, stroke: null }); }
  }
  function prescriptionPad() {
    S([[-14, 0], [14, 0], [12, -2], [-12, -2]], { fill: C.paper, lwPx: .8 });
    line([[-8, -1.5], [8, -1.5]], { stroke: C.teal, lwPx: .6 });
    S([[16, -1], [30, -4], [31, -2.6], [17, .4]], { fill: C.scrub, lwPx: .6 });                // a pen
  }
  function penCup() {
    [[-3, C.red, -.15], [1, C.blue, .1], [4, C.green, .3]].forEach(([dx, c, a]) => { X.save(); X.translate(dx, -10); X.rotate(a); S(rectPts(-1, -13, 2, 13), { fill: c, lwPx: .6 }); X.restore(); });
    S([[-6, -14], [6, -14], [5, 0], [-5, 0]], { fill: C.mint, lwPx: .9 });
  }
  function rubberDuck() {
    S([[-10, 0], [10, 0], [12, -6], [6, -10], [-8, -9], [-11, -5]], { fill: C.yellow, lwPx: 1, smooth: true });
    circle(6, -13, 5.5, { fill: C.yellow, lwPx: 1 }); S([[10, -13], [15, -12], [10, -11]], { fill: C.orange, lwPx: .7 });
    circle(7.5, -14.5, 1, { fill: C.line, stroke: null });
    S(rectPts(-2, -10, 6, 3), { fill: '#FFFFFF', lwPx: .5 }); line([[1, -10], [1, -7]], { stroke: C.red, lwPx: .6 }); line([[-1.5, -8.5], [3.5, -8.5]], { stroke: C.red, lwPx: .6 });   // a tiny bandage
  }
  function soapPump() { S(rectPts(-5, -16, 10, 16), { fill: C.pink, lwPx: .8 }); S(rectPts(-1.5, -22, 3, 6), { fill: C.white, lwPx: .7 }); line([[0, -22], [6, -22]], { stroke: C.white, lwPx: 2 }); }
  function gloveBox(col) { S(rectPts(-12, -14, 24, 14), { fill: C.white, lwPx: .9 }); S(rectPts(-12, -5, 24, 5), { fill: col, stroke: null }); S(ellPts(0, -14, 6, 1.6), { fill: col, lwPx: .6 }); S([[-3, -14], [0, -20], [3, -14]], { fill: col, lwPx: .6 }); }
  function cottonJar(col, kind) {
    S(rectPts(-8, -22, 16, 22), { fill: 'rgba(215,236,248,.75)', stroke: '#6E8796', lwPx: 1 }); S(rectPts(-8.5, -26, 17, 4), { fill: col, lwPx: .8 });
    if (kind === 0) for (let i = 0; i < 5; i++) circle(-4 + (i % 3) * 4, -5 - Math.floor(i / 3) * 6, 3.4, { fill: '#FFFFFF', lwPx: .5 });
    else if (kind === 1) for (let i = 0; i < 5; i++) S(rectPts(-5 + i * 2.2, -24, 1.6, 22), { fill: C.wood, lwPx: .4 });
    else for (let i = 0; i < 4; i++) S(rectPts(-6, -6 - i * 5, 12, 3.4), { fill: '#F4D7B8', lwPx: .5 });
  }
  function teddy() {
    for (const s of [-1, 1]) circle(s * 9, -32, 5, { fill: '#B98552', lwPx: 1 });
    S(ellPts(0, -12, 13, 12), { fill: '#B98552', lwPx: 1.1 }); S(ellPts(0, -10, 7, 7), { fill: '#E2BC86', stroke: null });
    circle(0, -28, 11, { fill: '#B98552', lwPx: 1.1 }); S(ellPts(0, -25, 5, 3.6), { fill: '#E2BC86', lwPx: .7 });
    circle(-4, -30, 1.3, { fill: C.line, stroke: null }); circle(4, -30, 1.3, { fill: C.line, stroke: null }); circle(0, -26.5, 1.4, { fill: C.line, stroke: null });
    for (const s of [-1, 1]) circle(s * 9, -3, 5, { fill: '#B98552', lwPx: 1 });
    X.save(); X.translate(-6, -34); X.rotate(-.5); S(rectPts(-6, -2, 12, 4), { fill: '#FFFFFF', lwPx: .6 }); X.restore();   // a bandage on his head
    S([[-2, -18], [-7, -21], [-7, -15]], { fill: C.red, lwPx: .6 }); S([[2, -18], [7, -21], [7, -15]], { fill: C.red, lwPx: .6 });   // bow tie
  }
  function blocks() {
    [[-14, 0, C.red, 'A'], [-2, 0, C.blue, 'B'], [-8, -11, C.yellow, 'C'], [12, 0, C.green, '1']].forEach(([x, y, c, ch]) => { S(rectPts(x - 5.5, y - 11, 11, 11), { fill: c, lwPx: .8 }); label(ch, x, y - 5.3, 7, '#FFFFFF'); });
  }
  // A fruit or vegetable for the mobile (centred on its hanging point).
  function food(k, t) {
    if (k === 0) { circle(0, 2, 9, { fill: C.red, lwPx: 1 }); line([[0, -7], [1, -11]], { stroke: '#6E4626', lwPx: 1.4 }); S(ellPts(5, -9, 4, 2, 10, -.4), { fill: C.green, lwPx: .7 }); }
    if (k === 1) { line([[0, -4], [0, 10]], { stroke: '#4F8C38', lwPx: 3.5 }); [[-6, -4], [6, -4], [0, -9], [-3, 1], [4, 1]].forEach(([x, y]) => circle(x, y, 5.5, { fill: '#4F9A3C', lwPx: .8 })); }   // broccoli, naturally
    if (k === 2) { S([[-4, -8], [4, -8], [0, 14]], { fill: C.orange, lwPx: 1, smooth: false }); for (const a of [-.4, 0, .4]) line([[0, -8], [Math.sin(a) * 6, -15]], { stroke: C.green, lwPx: 1.6 }); }
    if (k === 3) { S([[-10, -4], [-2, 4], [8, 2], [11, -6], [7, -1], [-2, 0]], { fill: C.yellow, lwPx: 1, smooth: true }); }
    if (k === 4) { S([[-7, -4], [7, -4], [0, 9]], { fill: C.red, lwPx: 1, smooth: true }); S([[-6, -4], [0, -9], [6, -4]], { fill: C.green, lwPx: .7 }); for (let i = 0; i < 4; i++) circle(-3 + (i % 2) * 6 - (i > 1 ? 1.5 : 0), -1 + Math.floor(i / 2) * 4, .7, { fill: C.yellow, stroke: null }); }
  }

  // ---------- the shell ----------
  function floor(P) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]);
    if (q) S(q, { fill: C.floor, stroke: null });
    const T = 80;
    for (let i = 0; i <= 12; i++) { const l = P.line([[-HW + i * T, 0, BACK], [-HW + i * T, 0, FRONT]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, 1) }); }
    for (let z = 0; z <= FRONT; z += T) { const l = P.line([[-HW, 0, z], [HW, 0, z]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, 1) }); }
    for (let i = 0; i < 160; i++) { const x = -HW + hash(i * 1.3) * 2 * HW, z = hash(i * 2.7 + 5) * FRONT; if (!P.visible(z)) continue; const [sx, sy, k] = P.p(x, 0, z); ellipse(sx, sy, 1.4 * k, .5 * k, { fill: C.speck, stroke: null }); }
    // a trail of coloured footprint stickers from the door to the exam table
    for (let i = 0; i < 9; i++) {
      const f = i / 8, x = lerp(-400, -40, f) + (i % 2 ? 14 : -14), z = lerp(880, 200, f), col = BRIGHT[i % 8];
      const p = P.poly(Array.from({ length: 10 }, (_, j) => { const a = j / 10 * TAU; return [x + Math.cos(a) * 8, .3, z + Math.sin(a) * 13]; })); if (p) S(p, { fill: col, stroke: null });
      for (let j = 0; j < 3; j++) { const d = P.floorCircle(x - 6 + j * 6, z - 17, 3, .3, 8); if (d) S(d, { fill: col, stroke: null }); }
    }
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]);
    if (q) S(q, { fill: C.ceil, stroke: null });
    for (let z = 100; z < FRONT; z += 120) { const r = P.line([[-HW, CEIL, z], [HW, CEIL, z]]); if (r) line(r, { stroke: C.ceilDk, lwPx: px(P, 1) }); }
    for (const z of [420, 780]) for (const x of [-220, 220]) { const l = P.poly([[x - 90, CEIL - 1, z], [x + 90, CEIL - 1, z], [x + 90, CEIL - 1, z + 60], [x - 90, CEIL - 1, z + 60]]); if (l) S(l, { fill: C.lamp, stroke: C.ceilDk, lwPx: px(P, 1.6) }); }
  }
  function sideWalls(P, t, o) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = wrect(P, x, BACK, FRONT, 0, CEIL);
      if (q) S(q, { fill: C.wall, stroke: null });
      const bs = wrect(P, x, BACK, FRONT, 0, 12); if (bs) S(bs, { fill: C.teal, stroke: null });
      for (const [y, c] of [[150, C.stripe], [158, C.stripe2]]) { const s = wrect(P, x, BACK, FRONT, y, y + 6); if (s) S(s, { fill: c, stroke: null }); }
      if (sd > 0) { wallWindow(P, x, t, o); growthChart(P, x); }
      else leftWall(P, x, t);
    }
  }
  function wallWindow(P, x, t, o) {
    const W_ = WIN, q = wrect(P, x, W_.z0, W_.z1, W_.y0, W_.y1); if (!q) return;
    const open = clamp(o.blinds ?? .75);
    clipTo(q, () => {
      S(q, { fill: linGrad(0, Math.min(...q.map(v => v[1])), 0, Math.max(...q.map(v => v[1])), [[0, C.sky], [1, C.skyLt]]), stroke: null });
      const xo = x + 500, sw = wob(t, .25) * 6;
      const gr = P.poly([[xo, -400, -800], [xo, -400, 2800], [xo, 70, 2800], [xo, 70, -800]]); if (gr) S(gr, { fill: C.treeLt, stroke: null });
      for (let i = 0; i < 18; i++) {
        const cz = -300 + i * 120 + hash(i + 4) * 50 + (i % 3 === 1 ? sw : 0), cy = 100 + hash(i + 8) * 130, r = 70 + hash(i + 13) * 45;
        const b = P.poly(Array.from({ length: 20 }, (_, j) => { const a = j / 20 * TAU; return [xo, cy + Math.sin(a) * r * .8, cz + Math.cos(a) * r]; }));
        if (b) S(b, { fill: [C.treeDk, C.tree, C.treeLt][i % 3], stroke: null });
      }
      // the blinds: slats that close up as `blinds` goes to 0
      const n = 14, sh = (W_.y1 - W_.y0) / n;
      for (let i = 0; i < n; i++) { const y = W_.y1 - (i + 1) * sh, h = lerp(sh * 1.02, sh * .22, open), s = wrect(P, x - 2, W_.z0, W_.z1, y + sh - h, y + sh); if (s) S(s, { fill: '#F4F6F6', stroke: C.whiteDk, lwPx: px(P, .6) }); }
      for (const zz of [W_.z0 + 60, W_.z1 - 60]) { const c = wline(P, x - 3, [[zz, W_.y0], [zz, W_.y1]]); if (c) line(c, { stroke: C.whiteDk, lwPx: px(P, .8) }); }
    });
    S(q, { fill: null, stroke: C.white, lwPx: px(P, 5) });
    const hr = wrect(P, x - 3, W_.z0 - 6, W_.z1 + 6, W_.y1, W_.y1 + 12); if (hr) S(hr, { fill: C.white, lwPx: px(P, 1) });   // headrail
    const cd = wline(P, x - 4, [[W_.z1 - 14, W_.y1], [W_.z1 - 14, W_.y0 + 30]]); if (cd) line(cd, { stroke: C.steel, lwPx: px(P, 1) });
    const sill = wrect(P, x, W_.z0 - 15, W_.z1 + 15, W_.y0 - 8, W_.y0); if (sill) S(sill, { fill: C.white, lwPx: px(P, 1) });
    // a cactus and a pothos on the sill
    for (const [z, k] of [[W_.z0 + 50, 0], [W_.z1 - 50, 1]]) sprite(P, x - 14, W_.y0, z, () => {
      S([[-7, -12], [7, -12], [5.5, 0], [-5.5, 0]], { fill: k ? C.white : C.orange, lwPx: .9 });
      if (k) for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .5 + wob(t, .3, i * .2) * .05; line([[0, -12], [Math.cos(a) * 16, -12 + Math.sin(a) * 12 + 8 * Math.abs(i - 2)]], { stroke: C.treeDk, lwPx: 1.2, smooth: true }); S(ellPts(Math.cos(a) * 16, -12 + Math.sin(a) * 12 + 8 * Math.abs(i - 2), 4, 3, 10), { fill: C.tree, lwPx: .7 }); }
      else { S([[-4, -12], [-4, -30], [0, -34], [4, -30], [4, -12]], { fill: C.green, lwPx: .9, smooth: true }); S([[4, -20], [9, -22], [9, -27], [6, -27], [6, -23], [4, -23]], { fill: C.green, lwPx: .8 }); circle(0, -35, 2, { fill: C.pink, stroke: null }); }
    });
  }
  // The giraffe growth chart on the right wall, near the scale: coloured bands every 20 units up to 200.
  function growthChart(P, x) {
    const G = GROW, xi = x - 1, zc = (G.z0 + G.z1) / 2;
    const bg = wrect(P, xi, G.z0, G.z1, 10, 215); if (bg) S(bg, { fill: '#FFF6DA', lwPx: px(P, 1) });
    for (let i = 0; i < 10; i++) { const s = wrect(P, xi, G.z0 + 6, G.z0 + 26, 10 + i * 20, 30 + i * 20); if (s) S(s, { fill: BRIGHT[i % 8], stroke: null }); const tk = wline(P, xi, [[G.z0 + 26, 30 + i * 20], [G.z0 + 40, 30 + i * 20]]); if (tk) line(tk, { stroke: C.line, lwPx: px(P, 1) }); }
    // the giraffe: legs, body, a long neck up the chart and a smiling head at the top
    for (const dz of [-28, -12, 18, 34]) { const l = wrect(P, xi, zc + dz, zc + dz + 9, 10, 60); if (l) S(l, { fill: C.yellow, lwPx: px(P, .9) }); }
    const body = wpoly(P, xi, [[zc - 34, 60], [zc + 46, 60], [zc + 50, 90], [zc - 30, 96]]); if (body) S(body, { fill: C.yellow, lwPx: px(P, 1) });
    const neck = wpoly(P, xi, [[zc + 28, 90], [zc + 46, 90], [zc + 30, 190], [zc + 16, 188]]); if (neck) S(neck, { fill: C.yellow, lwPx: px(P, 1) });
    const head = wpoly(P, xi, [[zc + 8, 186], [zc + 38, 190], [zc + 50, 200], [zc + 34, 210], [zc + 10, 204]]); if (head) S(head, { fill: C.yellow, lwPx: px(P, 1) });
    for (const [z, y] of [[zc - 14, 78], [zc + 10, 82], [zc + 32, 74], [zc + 32, 120], [zc + 26, 150], [zc + 22, 175]]) { const sp = wpoly(P, xi - .5, [[z - 6, y - 5], [z + 6, y - 6], [z + 7, y + 5], [z - 5, y + 6]]); if (sp) S(sp, { fill: '#C98A3A', stroke: null }); }
    for (const dz of [16, 26]) { const o = wline(P, xi, [[zc + dz, 208], [zc + dz - 2, 218]]); if (o) line(o, { stroke: C.line, lwPx: px(P, 1.6) }); }
    const e = P.p(xi - .5, 200, zc + 34); if (P.visible(zc + 34)) circle(e[0], e[1], clamp(2 * e[2], .8, 6), { fill: C.line, stroke: null });
  }
  function leftWall(P, x, t) {
    // the door (with a little round window), and a WASH YOUR HANDS poster with soap bubbles
    const d = wrect(P, x, DOOR.z0, DOOR.z1, 0, 215); if (d) S(d, { fill: C.door, stroke: C.white, lwPx: px(P, 5) });
    const dw = P.poly(Array.from({ length: 16 }, (_, j) => { const a = j / 16 * TAU; return [x, 165 + Math.sin(a) * 20, (DOOR.z0 + DOOR.z1) / 2 + Math.cos(a) * 20]; })); if (dw) S(dw, { fill: C.skyLt, stroke: C.doorDk, lwPx: px(P, 1.5) });
    const h = wrect(P, x, DOOR.z0 + 12, DOOR.z0 + 30, 98, 104); if (h) S(h, { fill: C.steelLt, lwPx: px(P, 1) });
    const p = wrect(P, x, 590, 730, 175, 285); if (p) S(p, { fill: '#DDF3FF', stroke: C.blue, lwPx: px(P, 3) });
    for (const sd of [-1, 1]) { const hand = wpoly(P, x, [[660 + sd * 8, 195], [660 + sd * 40, 205], [660 + sd * 46, 240], [660 + sd * 30, 252], [660 + sd * 12, 236]]); if (hand) S(hand, { fill: '#F3C6A8', lwPx: px(P, 1) }); }
    for (let i = 0; i < 9; i++) { const ph = frac(t * .25 + hash(i)), z = 610 + hash(i * 3.1) * 100, y = 200 + ph * 75, r = 4 + hash(i + 2) * 5; const b = P.poly(Array.from({ length: 12 }, (_, j) => { const a = j / 12 * TAU; return [x, y + Math.sin(a) * r, z + Math.cos(a) * r]; })); if (b) S(b, { fill: `rgba(255,255,255,${(.8 * (1 - ph)).toFixed(3)})`, stroke: `rgba(76,143,216,${(.8 * (1 - ph)).toFixed(3)})`, lwPx: px(P, .8) }); }
    // the wall diagnostic set by the exam table: a blood-pressure gauge and an otoscope on their hooks
    const ds = wrect(P, x, 300, 430, 140, 230); if (ds) S(ds, { fill: C.whiteDk, lwPx: px(P, 1.2) });
    const g = P.poly(Array.from({ length: 16 }, (_, j) => { const a = j / 16 * TAU; return [x + 1, 195 + Math.sin(a) * 18, 340 + Math.cos(a) * 18]; })); if (g) S(g, { fill: '#FFFFFF', stroke: C.steelDk, lwPx: px(P, 1.6) });
    const nd = wline(P, x + 1, [[340, 195], [340 + 12 * Math.cos(1 + .3 * wob(t, .5)), 195 + 12 * Math.sin(1 + .3 * wob(t, .5))]]); if (nd) line(nd, { stroke: C.red, lwPx: px(P, 1.4) });
    const cuff = wline(P, x + 1, [[340, 177], [355, 160], [372, 172], [365, 190], [380, 205]]); if (cuff) line(cuff, { stroke: C.steelDk, lwPx: px(P, 1.6) });
    const ot = wrect(P, x + 1, 395, 410, 160, 215); if (ot) S(ot, { fill: C.steelDk, lwPx: px(P, 1) });
    const oh = wrect(P, x + 1, 392, 413, 215, 225); if (oh) S(oh, { fill: C.chrome, lwPx: px(P, 1) });
  }

  // Front wall (Z = 1100): only seen from the desk view.
  function frontWall(P, t, o) {
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null });
      S(rectPts(-HW, -12, 2 * HW, 12), { fill: C.teal, stroke: null });
      S(rectPts(-HW, -156, 2 * HW, 6), { fill: C.stripe, stroke: null }); S(rectPts(-HW, -164, 2 * HW, 6), { fill: C.stripe2, stroke: null });
      // the sign
      S(rectPts(-110, -318, 220, 36), { fill: C.teal, lwPx: 1.4 });
      heart(-88, -300, 9, C.red, { lwPx: 1 }); heart(88, -300, 9, C.red, { lwPx: 1 });
      label("DR. SAMI'S CLINIC", 0, -299, 19, '#FFFFFF');
      // the X-ray light box
      const x = XRAY.x, y = -XRAY.y;
      S(rectPts(x - 10, y - 10, XRAY.w + 20, XRAY.h + 24), { fill: C.steelLt, lwPx: 1.4 });
      S(rectPts(x, y, XRAY.w, XRAY.h), { fill: '#EEF8FF', stroke: C.steel, lwPx: 1 });
      X.save(); X.beginPath(); X.rect(x, y, XRAY.w, XRAY.h); X.clip(); X.translate(x, y);
      if (o.xray) o.xray(t);
      else {
        S(rectPts(40, 8, 120, 116), { fill: '#16222C', lwPx: .8 });
        const bone = 'rgba(235,245,255,.92)';
        for (let i = 0; i < 6; i++) for (const s of [-1, 1]) line([[100 + s * 6, 32 + i * 13], [100 + s * 30, 28 + i * 13], [100 + s * 48, 40 + i * 14]], { stroke: bone, lwPx: 3.2, smooth: true });
        S(rectPts(96, 20, 8, 96), { fill: bone, stroke: null });
        line([[66, 22], [100, 16], [134, 22]], { stroke: bone, lwPx: 3 });                    // collarbones
        heart(108, 84, 13, 'rgba(255,140,140,.35)', { stroke: null });
        S(starPts(146, 20, 6, .45), { fill: C.yellow, lwPx: .6 });                              // a gold star: "all clear!"
      }
      X.restore();
      S(rectPts(x + XRAY.w - 18, y + XRAY.h + 2, 10, 6), { fill: C.mint, lwPx: .6 });           // power switch
      // the eye chart
      S(rectPts(110, -300, 110, 175), { fill: '#FFFFFF', lwPx: 1.4 });
      [['E', 30], ['F P', 20], ['T O Z', 14], ['L P E D', 10.5], ['P E C F D', 8], ['E D F C Z P', 6.4]].forEach(([s, sz], i) => label(s, 165, -280 + i * 22 + (i ? 4 : 0), sz, i === 5 ? C.red : C.line, 800));
      // healthy-plate poster
      S(rectPts(270, -300, 150, 120), { fill: '#FFF8E8', stroke: C.green, lwPx: 2.5 });
      label('HEALTHY PLATE', 345, -287, 12, C.green);
      circle(335, -235, 36, { fill: '#FFFFFF', lwPx: 1.2 });
      [[C.green, 0], [C.red, 1], [C.orange, 2], [C.purple, 3]].forEach(([c, i]) => { const a0 = i * Math.PI / 2 - Math.PI / 2; S([[335, -235], ...Array.from({ length: 9 }, (_, j) => { const a = a0 + j / 8 * Math.PI / 2; return [335 + Math.cos(a) * 33, -235 + Math.sin(a) * 33]; })], { fill: c, lwPx: .8 }); });
      circle(395, -228, 12, { fill: C.blue, lwPx: 1 }); circle(395, -228, 8, { fill: '#FFFFFF', stroke: null });   // a glass of milk
      // a clock with a smiling face
      circle(-360, -270, 26, { fill: '#FFFFFF', stroke: C.teal, lwPx: 3.5 });
      const hand = (a, l, w, c) => line([[-360, -270], [-360 + Math.sin(a) * l, -270 - Math.cos(a) * l]], { stroke: c, lwPx: w, cap: 'round' });
      hand(TAU * (2 / 12 + t / 43200), 12, 3, C.line); hand(TAU * (15 / 60 + t / 3600), 19, 2.2, C.line); hand(TAU * Math.floor(t) / 60, 21, 1, C.red);
      circle(-360, -270, 2.4, { fill: C.line, stroke: null });
      // the diploma
      S(rectPts(-30, -255, 100, 72), { fill: C.woodDk, lwPx: 1.2 }); S(rectPts(-24, -249, 88, 60), { fill: C.paper, stroke: C.yellow, lwPx: 1.4 });
      label('M.D.', 20, -235, 13, C.line); line([[-8, -220], [48, -220]], { stroke: '#8A7A6A', lwPx: 1.2 }); line([[-2, -212], [42, -212]], { stroke: '#8A7A6A', lwPx: 1 }); circle(52, -200, 6, { fill: C.red, lwPx: .7 });
      // the paper-towel dispenser over the sink
      S(rectPts(-440, -230, 70, 60), { fill: C.white, lwPx: 1.2 }); S(rectPts(-422, -172, 34, 16), { fill: '#FFFFFF', lwPx: .8 });
    });
  }

  // Back wall (Z = 0): only seen from the exam view.
  function backWall(P, t, o) {
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wallLt, stroke: null });
      S(rectPts(-HW, -12, 2 * HW, 12), { fill: C.teal, stroke: null });
      S(rectPts(-HW, -156, 2 * HW, 6), { fill: C.stripe, stroke: null }); S(rectPts(-HW, -164, 2 * HW, 6), { fill: C.stripe2, stroke: null });
      // the heart monitor: an ECG trace that scrolls with t, a beating heart and the rate
      const bpm = o.bpm ?? 72, m = MON, mx = m.x - m.w / 2, my = -m.y;
      S(rectPts(mx - 8, my - 8, m.w + 16, m.h + 16), { fill: '#3A4450', lwPx: 1.4 });
      S(rectPts(mx, my, m.w, m.h), { fill: bpm > 0 ? C.screen : '#232A31', stroke: null });
      S(rectPts(m.x - 12, my + m.h + 8, 24, 10), { fill: C.steelDk, lwPx: 1 });                         // the wall bracket
      if (bpm > 0) {
        const span = 3, pts = [];
        for (let i = 0; i <= 120; i++) {
          const u = i / 120, ph = frac((t - (1 - u) * span) * bpm / 60);
          const v = ph < .08 ? .12 * Math.sin(ph / .08 * Math.PI) : ph < .14 ? 0 : ph < .16 ? -.18 : ph < .19 ? 1 : ph < .22 ? -.32 : ph < .3 ? 0 : ph < .42 ? .22 * Math.sin((ph - .3) / .12 * Math.PI) : 0;
          pts.push([mx + 6 + u * (m.w * .62), my + m.h * .55 - v * m.h * .38]);
        }
        line(pts, { stroke: C.ecg, lwPx: 1.6 });
        const [ex, ey] = pts[pts.length - 1]; circle(ex, ey, 2.2, { fill: '#E9FFF1', stroke: null });
        const b = 1 + .25 * beat(t, bpm);
        X.save(); X.translate(mx + m.w * .82, my + m.h * .32); X.scale(b, b); heart(0, 0, 8, C.red, { stroke: null }); X.restore();
        readable(P, mx + m.w * .82, my + m.h * .72, () => label(String(Math.round(bpm)), 0, 0, 18, C.ecg));
      }
      // a shelf of jars over the exam table, a GERMS poster and a STAY HEALTHY banner
      S(rectPts(-190, -256, 260, 6), { fill: C.white, lwPx: 1 });
      S(rectPts(-420, -300, 120, 120), { fill: '#FFFFFF', stroke: C.green, lwPx: 2.5 });
      const gx = -360, gy = -238;
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .4; line([[gx + Math.cos(a) * 22, gy + Math.sin(a) * 22], [gx + Math.cos(a) * 31, gy + Math.sin(a) * 31]], { stroke: C.green, lwPx: 2.4, cap: 'round' }); circle(gx + Math.cos(a) * 32, gy + Math.sin(a) * 32, 3, { fill: C.green, stroke: null }); }
      circle(gx, gy, 23, { fill: C.lime, lwPx: 1.4 });
      circle(gx - 8, gy - 4, 4, { fill: '#FFFFFF', lwPx: .8 }); circle(gx + 8, gy - 4, 4, { fill: '#FFFFFF', lwPx: .8 }); circle(gx - 7, gy - 4, 1.8, { fill: C.line, stroke: null }); circle(gx + 9, gy - 4, 1.8, { fill: C.line, stroke: null });
      line([[gx - 8, gy + 8], [gx, gy + 5], [gx + 8, gy + 8]], { stroke: C.line, lwPx: 1.6 });
      readable(P, gx, -288, () => label('GERMS!', 0, 0, 14, C.green));
      readable(P, gx, -193, () => label('WASH THEM AWAY', 0, 0, 9, C.blue));
      S(rectPts(-230, -320, 300, 32), { fill: C.orange, lwPx: 1.2 });
      readable(P, -80, -304, () => label('STAY HEALTHY!', 0, 1, 19, '#FFFFFF'));
    });
  }

  // ---------- depth-sorted pieces ----------
  function desk(P, t, o) {
    const D = DESK, bpm = o.bpm ?? 72;
    box(P, D.x0, D.x0 + 100, 0, D.h - 6, D.z0 + 4, D.z1, C.white);
    box(P, D.x1 - 100, D.x1, 0, D.h - 6, D.z0 + 4, D.z1, C.white);
    box(P, D.x0 + 100, D.x1 - 100, 26, D.h - 6, D.z0 + 4, D.z0 + 10, { nz: C.mint, pz: C.mintDk, side: C.mintDk, top: C.mint });   // modesty panel
    if (P.cam.z < D.z0) P.plane(D.z0 + 4, () => {                                        // pedestal fronts toward the patients
      for (const a of [D.x0, D.x1 - 100]) { S(rectPts(a + 10, -D.h + 16, 80, D.h - 30), { fill: C.mint, stroke: C.mintDk, lwPx: px(P, 1) }); heart(a + 50, -D.h / 2 + 2, 9, C.red, { lwPx: px(P, .8) }); }
    });
    if (P.cam.z > D.z1) P.plane(D.z1, () => {                                            // drawers on Dr. Sami's side
      for (const a of [D.x0, D.x1 - 100]) for (let i = 0; i < 3; i++) { S(rectPts(a + 8, -D.h + 12 + i * 20, 84, 17), { fill: '#F2F5F6', stroke: C.whiteDk, lwPx: px(P, 1) }); S(rectPts(a + 40, -D.h + 19 + i * 20, 20, 3), { fill: C.teal, stroke: null }); }
    });
    box(P, D.x0 - 8, D.x1 + 8, D.h - 6, D.h, D.z0 - 4, D.z1 + 4, { nz: C.wood, pz: C.wood, side: C.woodDk, top: C.wood });
    const y = D.h, zm = (D.z0 + D.z1) / 2;
    sprite(P, -140, y, zm + 10, () => computer(P.dir < 0, t, bpm));
    sprite(P, -60, y, zm - 14, () => prescriptionPad());
    sprite(P, 50, y, zm + 10, () => penCup());
    sprite(P, 100, y, zm - 6, () => stickerJar(t));
    sprite(P, 160, y, zm + 6, () => heartModel(t, bpm));
    sprite(P, -95, y, zm + 18, () => rubberDuck());
  }
  // Dr. Sami's rolling desk chair: five-star base, gas lift, blue seat and back (the back toward +Z).
  function deskChair(P) {
    const { x, z } = CHAIR, h = 48, col = { nz: C.scrub, pz: C.scrubDk, side: C.scrubDk, top: '#6FA2C2' };
    const base = () => {
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3, l = P.line([[x, 8, z], [x + Math.cos(a) * 30, 3, z + Math.sin(a) * 30]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 3) }); const w = P.p(x + Math.cos(a) * 30, 3, z + Math.sin(a) * 30); if (P.visible(z + Math.sin(a) * 30)) circle(w[0], w[1], clamp(3.5 * w[2], 1, 8), { fill: '#2A2E33', stroke: null }); }
      const g = P.line([[x, 8, z], [x, h - 6, z]]); if (g) line(g, { stroke: C.steel, lwPx: px(P, 4) });
      box(P, x - 26, x + 26, h - 8, h, z - 24, z + 22, col, { lwPx: px(P, 1) });
    };
    const back = () => box(P, x - 24, x + 24, h + 8, h + 80, z + 24, z + 32, col, { lwPx: px(P, 1) });
    if (P.depth(z + 32) > P.depth(z - 24)) { back(); base(); } else { base(); back(); }
  }
  // A visitor chair facing the desk (its back toward −Z).
  function visitorChair(P, x, z, col) {
    const w = 22, h = 42, bz = z - 20, dark = mixCol(col, '#000000', .2);
    const legs = () => { for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l = P.line([[x + dx * (w - 3), 0, z + dz * 17], [x + dx * (w - 3), h, z + dz * 17]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 2.2) }); } };
    const seat = () => box(P, x - w, x + w, h, h + 6, z - 20, z + 20, { nz: col, pz: col, side: dark, top: mixCol(col, '#ffffff', .2) }, { lwPx: px(P, 1) });
    const back = () => { box(P, x - w, x + w, h + 12, h + 50, bz - 4, bz, { nz: col, pz: col, side: dark, top: mixCol(col, '#ffffff', .2) }, { lwPx: px(P, 1) }); for (const sx of [-w + 3, w - 3]) { const l = P.line([[x + sx, h + 6, bz - 2], [x + sx, h + 12, bz - 2]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 2) }); } };
    (P.depth(bz) > P.depth(z) ? [back, legs, seat] : [legs, seat, back]).forEach(f => f());
  }
  function sink(P, t) {
    const s = SINK;
    box(P, s.x0, s.x1, 0, s.h - 6, s.z0, FRONT, { nz: C.white, pz: C.white, side: C.whiteDk, top: C.white });
    if (P.cam.z < s.z0) P.plane(s.z0, () => { for (let i = 0; i < 2; i++) { S(rectPts(s.x0 + 8 + i * 82, -s.h + 18, 76, s.h - 30), { fill: '#F2F5F6', stroke: C.whiteDk, lwPx: px(P, 1) }); S(rectPts(s.x0 + 40 + i * 82, -s.h + 26, 12, 3), { fill: C.teal, stroke: null }); } });
    box(P, s.x0 - 4, s.x1 + 4, s.h - 6, s.h, s.z0 - 6, FRONT, { nz: '#C9D3D8', pz: '#C9D3D8', side: '#B4C0C6', top: '#DCE4E8' });
    const bowl = P.floorCircle(-385, 1072, 26, s.h + .3, 20); if (bowl) S(bowl, { fill: '#9EB0BA', stroke: C.steelDk, lwPx: px(P, 1) });
    sprite(P, -385, s.h, 1094, () => { line([[0, 0], [0, -24], [4, -30], [14, -28], [16, -20]], { stroke: C.chrome, lwPx: 2.6, smooth: true }); });
    sprite(P, -445, s.h, 1080, () => soapPump());
    sprite(P, -330, s.h, 1080, () => gloveBox(C.blue));
    sprite(P, -330, s.h + 14, 1082, () => gloveBox(C.purple));
    box(P, s.x0, s.x1, 210, 285, 1065, FRONT, { nz: C.white, pz: C.white, side: C.whiteDk, top: C.white, bot: C.whiteDk });   // wall cupboard
    if (P.cam.z < 1065) P.plane(1065, () => { for (let i = 0; i < 2; i++) { S(rectPts(s.x0 + 6 + i * 82, -280, 78, 65), { fill: '#F2F5F6', stroke: C.whiteDk, lwPx: px(P, 1) }); heart(s.x0 + 45 + i * 82, -250, 8, i ? C.blue : C.red, { stroke: null }); } });
  }
  // The balance-beam scale with its height rod; the poise weight slides a little now and then.
  function scale(P, t) {
    const { x, z } = SCALE;
    box(P, x - 32, x + 32, 0, 9, z - 30, z + 30, { nz: C.steelLt, pz: C.steelLt, side: C.steel, top: '#2F353B' });
    box(P, x - 6, x + 6, 9, 150, z + 22, z + 30, C.steelLt, { lwPx: px(P, 1) });
    box(P, x - 2, x + 2, 150, 205, z + 24, z + 28, C.chrome, { lwPx: px(P, .7) });
    sprite(P, x, 150, z + 26, () => {
      const p = 6 + 6 * Math.sin(t * .7) * Math.sin(t * .23);
      S(rectPts(-38, -6, 76, 5), { fill: C.chrome, lwPx: .9 }); S(rectPts(-38, -13, 76, 5), { fill: C.chrome, lwPx: .9 });
      for (let i = 0; i <= 8; i++) line([[-34 + i * 8.5, -6], [-34 + i * 8.5, -4]], { stroke: C.line, lwPx: .5 });
      S(rectPts(-30 + p * 2, -15, 8, 9), { fill: C.steelDk, lwPx: .7 }); S(rectPts(-12 + p * 3, -8, 6, 7), { fill: C.steelDk, lwPx: .7 });
      S([[38, -13], [44, -10], [38, -7]], { fill: C.steelDk, lwPx: .7 });
    });
    sprite(P, x, 205, z + 26, () => S(rectPts(-2, -2, 26, 4), { fill: C.chrome, lwPx: .8 }));   // the headpiece
  }
  // The exam table along the back wall: cabinet base, padded top, raised head end, a paper strip and its roll, a step stool.
  function examTable(P, t) {
    const E = EXAM, pad = { nz: C.teal, pz: C.teal, side: C.tealDk, top: C.tealLt };
    box(P, E.x0 + 10, E.x1 - 10, 0, E.h - 25, E.z0 + 8, E.z1 - 8, C.white);
    if (P.cam.z > E.z1) P.plane(E.z1 - 8, () => { for (let i = 0; i < 3; i++) { const w = (E.x1 - E.x0 - 40) / 3, x0 = E.x0 + 15 + i * (w + 5); S(rectPts(x0, -E.h + 30, w, E.h - 40), { fill: '#F2F5F6', stroke: C.whiteDk, lwPx: px(P, 1) }); S(rectPts(x0 + w / 2 - 8, -E.h + 36, 16, 3), { fill: C.teal, stroke: null }); } });
    box(P, E.x0, E.x1, E.h - 25, E.h, E.z0, E.z1, pad);
    // the head end tilts up
    const hx = E.x0 + 70, head = P.poly([[E.x0, E.h + 30, E.z0 + 4], [hx, E.h, E.z0 + 4], [hx, E.h, E.z1 - 4], [E.x0, E.h + 30, E.z1 - 4]]);
    if (head) S(head, { fill: C.tealLt, lwPx: px(P, 1) });
    const hf = P.poly([[E.x0, E.h, E.z1 - 4], [E.x0, E.h + 30, E.z1 - 4], [hx, E.h, E.z1 - 4]]); if (hf && P.cam.z > E.z1) S(hf, { fill: C.teal, lwPx: px(P, 1) });
    // the paper strip pulled down the table, and its roll at the head end
    const pp = P.poly([[E.x0 + 4, E.h + 31, E.z0 + 30], [hx, E.h + 1.2, E.z0 + 30], [E.x1 - 6, E.h + 1.2, E.z0 + 30], [E.x1 - 6, E.h + 1.2, E.z1 - 30], [hx, E.h + 1.2, E.z1 - 30], [E.x0 + 4, E.h + 31, E.z1 - 30]]); if (pp) S(pp, { fill: '#FFFFFF', stroke: C.whiteDk, lwPx: px(P, .7) });
    sprite(P, E.x0 - 2, E.h + 20, (E.z0 + E.z1) / 2, () => { S(ellPts(0, 0, 8, 8), { fill: '#FFFFFF', lwPx: 1 }); circle(0, 0, 3, { fill: C.steelLt, lwPx: .7 }); });
    box(P, -60, 30, 0, 26, E.z1 + 4, E.z1 + 46, { nz: C.steelLt, pz: C.steelLt, side: C.steel, top: '#2F353B' }, { lwPx: px(P, 1) });   // step stool
  }
  // The privacy curtain on its ceiling track: o.curtain 0 = bunched at the left wall, 1 = drawn across.
  function curtain(P, t, o) {
    const T_ = TRACK, f = clamp(o.curtain || 0), x1 = lerp(T_.x0 + 50, T_.x1, ease(f)), n = Math.max(4, Math.round((x1 - T_.x0) / 26));
    const tr = P.line([[T_.x0, CEIL - 12, T_.z], [T_.x1, CEIL - 12, T_.z]]); if (tr) line(tr, { stroke: C.steel, lwPx: px(P, 2.5) });
    const pts = [];
    for (let i = 0; i <= n; i++) pts.push(lerp(T_.x0, x1, i / n));
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[i + 1], dz = (i % 2 ? 7 : -7) * (1 - f * .4), sw = wob(t, .2, i * .17) * 3;
      const q = P.poly([[a, CEIL - 14, T_.z], [b, CEIL - 14, T_.z + dz], [b + sw, 30, T_.z + dz], [a + sw, 30, T_.z]]);
      if (q) S(q, { fill: i % 2 ? C.curtainDk : C.curtain, lwPx: px(P, .8) });
    }
    const mesh = P.poly([[T_.x0, CEIL - 14, T_.z], [x1, CEIL - 14, T_.z], [x1, CEIL - 50, T_.z], [T_.x0, CEIL - 50, T_.z]]); if (mesh) S(mesh, { fill: 'rgba(255,255,255,.55)', stroke: C.whiteDk, lwPx: px(P, .7) });
    for (let i = 0; i < 6; i++) { const x = lerp(T_.x0 + 20, x1 - 20, (i + .5) / 6); sprite(P, x, 140 + (i % 2) * 40, T_.z, () => heart(0, 0, 6, rgba(C.pink, .7), { stroke: null })); }
  }
  function mobile(P, t) {
    const M = MOBILE;
    const top = P.line([[M.x, CEIL, M.z], [M.x, M.y + 10, M.z]]); if (top) line(top, { stroke: 'rgba(80,70,75,.55)', lwPx: px(P, .8) });
    return [0, 1, 2, 3, 4].map(i => {
      const a = t * .25 + i / 5 * TAU, x = M.x + Math.cos(a) * 60, z = M.z + Math.sin(a) * 45, y = M.y - 20 - (i % 2) * 18;
      return { z, draw: () => { const s = P.line([[M.x, M.y + 10, M.z], [x, M.y + 4, z], [x, y + 10, z]]); if (s) line(s, { stroke: 'rgba(80,70,75,.55)', lwPx: px(P, .7) }); sprite(P, x, y, z, () => { X.rotate(wob(t, .4, i * .3) * .15); X.scale(1.6, 1.6); food(i, t); }); } };
    });
  }
  function kidsCorner(P, t) {
    const { x, z } = KIDS, h = 40;
    const ped = P.line([[x, 0, z], [x, h, z]]); if (ped) line(ped, { stroke: C.white, lwPx: px(P, 5) });
    const t0 = P.floorCircle(x, z, 45, h - 4, 28), t1 = P.floorCircle(x, z, 45, h, 28);
    if (t0) S(t0, { fill: C.yellow, lwPx: px(P, 1) }); if (t1) S(t1, { fill: '#F8DD70', lwPx: px(P, 1) });
    sprite(P, x - 4, h, z, () => blocks());
    sprite(P, x + 26, h, z - 14, () => { S(rectPts(-8, -2, 16, 2), { fill: '#FFFFFF', lwPx: .6 }); [C.red, C.blue, C.green].forEach((c, i) => S(rectPts(-7 + i * 5, -14, 3, 12), { fill: c, lwPx: .4 })); });   // crayons and paper
  }
  // A child-size chair facing the kids' table (its back away from the table, toward +Z).
  function tinyChair(P, x, z, col) {
    const c = { nz: col, pz: col, side: mixCol(col, '#000000', .15), top: mixCol(col, '#ffffff', .2) }, h = 24, bz = z + 13;
    const legs = () => { for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l = P.line([[x + dx * 11, 0, z + dz * 11], [x + dx * 11, h, z + dz * 11]]); if (l) line(l, { stroke: mixCol(col, '#000000', .3), lwPx: px(P, 2.4) }); } };
    const seat = () => box(P, x - 14, x + 14, h, h + 5, z - 14, z + 14, c, { lwPx: px(P, 1) });
    const back = () => box(P, x - 14, x + 14, h + 5, h + 34, bz - 3, bz + 1, c, { lwPx: px(P, 1) });
    (P.depth(bz) > P.depth(z) ? [back, legs, seat] : [legs, seat, back]).forEach(f => f());
  }
  function toyBox(P, t) {
    const b = TOYBOX;
    box(P, b.x0, b.x1, 0, 50, b.z0, b.z1, { nz: C.red, pz: C.red, side: '#B8433B', top: '#EC7A70' });
    if (P.cam.z > b.z1) P.plane(b.z1, () => { readable(P, (b.x0 + b.x1) / 2, -26, () => label('TOYS', 0, 0, 16, '#FFFFFF')); });
    sprite(P, (b.x0 + b.x1) / 2, 50, (b.z0 + b.z1) / 2, () => { X.scale(1.6, 1.6); teddy(); });
  }
  function jarShelf(P) {
    [[-160, 0, C.blue], [-110, 1, C.mint], [-60, 2, C.pink], [20, 0, C.yellow]].forEach(([x, k, c]) => sprite(P, x, 256, 14, () => cottonJar(c, k)));
  }
  function plant(P, t) {
    sprite(P, -430, 0, 760, () => { X.scale(1.4, 1.4);
      S([[-12, -22], [12, -22], [9, 0], [-9, 0]], { fill: C.white, lwPx: 1 });
      for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .26 + wob(t, .25, i * .1) * .04, l = 50 * (.55 + .45 * hash(i + 3)), cx = Math.cos(a) * l, cy = -22 + Math.sin(a) * l; line([[0, -22], [cx, cy]], { stroke: C.treeDk, lwPx: 1.2 }); S(ellPts(cx, cy, 9, 6, 14, a), { fill: i % 2 ? C.tree : C.treeDk, lwPx: .8 }); }
    });
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the room.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri });
    add(DESK.z0, DESK.z1, () => desk(P, t, o), 1);
    add(CHAIR.z - 30, CHAIR.z + 32, () => deskChair(P), 0);
    [[-110, C.orange], [110, C.blue]].forEach(([x, c]) => add(660, 700, () => visitorChair(P, x, 680, c), 0));
    add(SINK.z0, FRONT, () => sink(P, t), 0);
    add(SCALE.z - 30, SCALE.z + 30, () => scale(P, t), 0);
    add(EXAM.z0, EXAM.z1 + 46, () => examTable(P, t), 1);
    add(10, 20, () => jarShelf(P), 0);
    add(TRACK.z - 8, TRACK.z + 8, () => curtain(P, t, o), 2);
    for (const m of mobile(P, t)) add(m.z, m.z, m.draw, 2);
    add(KIDS.z - 45, KIDS.z + 45, () => kidsCorner(P, t), 1);
    [[KIDS.x - 70, KIDS.z + 20, C.green], [KIDS.x + 60, KIDS.z + 60, C.purple]].forEach(([x, z, c]) => add(z - 14, z + 14, () => tinyChair(P, x, z, c), 0));
    add(TOYBOX.z0, TOYBOX.z1, () => toyBox(P, t), 0);
    add(750, 770, () => plant(P, t), 0);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 940 }, HW, BACK, FRONT, CEIL, DESK, XRAY, EXAM, MON, TRACK, SCALE, SINK,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P); ceiling(P); sideWalls(P, t, o); backWall(P, t, o); frontWall(P, t, o);
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
// Desk cameras look toward Dr. Sami's desk (dir 1); exam cameras stand behind the desk and look back at the exam table (dir: -1).
LOCATIONS.sami_clinic = Object.assign(samiClinic, {
  spots: {
    'At the desk (Dr. Sami)': { x: 0, y: 0, z: 940 },
    'In front of the desk': { x: 0, y: 0, z: 600 },
    'At the X-ray box': { x: -270, y: 0, z: 980 },
    'On the scale': { x: 385, y: 0, z: 1010 },
    'By the growth chart': { x: 420, y: 0, z: 930 },
    'At the sink': { x: -385, y: 0, z: 980 },
    'Reading the eye chart': { x: 150, y: 0, z: 480 },
    'By the exam table': { x: -40, y: 0, z: 200 },
    'Head of the exam table': { x: -250, y: 0, z: 110 },
    'Kids corner': { x: 330, y: 0, z: 330 },
    'By the window': { x: 400, y: 0, z: 570 },
    'Doorway': { x: -420, y: 0, z: 885 },
  },
  cameras: {
    'Desk · wide from the exam table': { x: 0, y: 165, z: 280, f: 650, hy: 560, dir: 1 },
    'Desk · medium': { x: 0, y: 140, z: 580, f: 1000, hy: 570, dir: 1 },
    'Desk · close': { x: 0, y: 140, z: 700, f: 1100, hy: 590, dir: 1 },
    'Desk · X-ray box': { x: -230, y: 160, z: 700, f: 1000, hy: 660, dir: 1 },
    'Desk · eye chart': { x: 160, y: 165, z: 720, f: 1000, hy: 660, dir: 1 },
    'Desk · scale and growth chart': { x: 250, y: 140, z: 650, f: 950, hy: 590, dir: 1 },
    'Desk · sink': { x: -300, y: 140, z: 700, f: 1000, hy: 600, dir: 1 },
    'Exam · from the desk': { x: 0, y: 175, z: 1070, f: 650, hy: 520, dir: -1 },
    'Exam · medium': { x: -40, y: 140, z: 620, f: 1000, hy: 580, dir: -1 },
    'Exam · table close': { x: -60, y: 130, z: 480, f: 1000, hy: 600, dir: -1 },
    'Exam · heart monitor': { x: 150, y: 175, z: 520, f: 1000, hy: 660, dir: -1 },
    'Exam · kids corner': { x: 250, y: 130, z: 640, f: 1000, hy: 600, dir: -1 },
    'Exam · window': { x: 200, y: 150, z: 980, f: 850, hy: 560, dir: -1 },
  },
});
