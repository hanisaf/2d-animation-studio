// locations/roman_bath/roman_bath.js: an ancient bathhouse in old Greece, for Housam's "Eureka!" story (see README.md).
//
// A sunny marble hall in one-point perspective (engine/persp.js). Looking in (dir: 1, toward +Z): a round marble bathtub on a
// low dais in the foreground, Ionic colonnades down both sides with dolphin-and-wave frescoes on the walls behind, a big
// sunken pool at the back with a bronze lion-head fountain, and three tall arches onto a blue sea, hills, cypresses and a
// temple on a hill. ΛΟΥΤΡΑ ("baths") is carved over the arches. Steam drifts off the water; sunbeams fall through the arches.
// Everything is drawn back-to-front by distance from the camera (P.depth), so it also works looking back out (dir: -1).
//
//   romanBath.back(P, t, o)    sky, walls, floor and every piece farther than o.splitZ (default: everything). Call first.
//   romanBath.front(P, t, o)   pieces nearer than o.splitZ (stops at o.toZ if given). Call after the characters.
// o: { splitZ, toZ,
//      bather: fn()     draws whoever sits in the tub: called between the tub's back half (rim, far water) and its front half
//                       (near water, soap foam and the outer wall), so they sit IN the water. Stand them on the floor at TUB.
//      foam: 0..1       soap bubbles on the tub water (default .7)
//      ripple: t0       scene time of a splash: rings spread across the tub water from then on
//      steam: 0..1      steam off the tub and the pool (default 1) }
// Pass the same o to back() and front().
//
// Layout (world): floor Y = 0. Hall X ±520, back wall Z = 1500 (arches at X −300, 0, 300, 190 wide, 330 tall), front wall
// Z = −420 (one door arch). Colonnades at X ±380, columns at Z 160, 560, 960, 1360, 360 tall under an architrave (Y 360–400).
// Tub: centre (0, 480), radius 95, rim Y 78, water Y 64, on a dais r 128 (Y 8). Pool: X ±300, Z 860–1300, lion fountain
// at (0, 1335). Amphorae (−320, 420) and (310, 760), a bench with towels (300, 330), a lemon tree (−315, 820).

const romanBath = (() => {
  const HW = 520, BACK = 1500, FRONT = -420, CEIL = 470, COL_X = 380, COL_H = 360, COLS = [160, 560, 960, 1360];
  const TUB = { x: 0, z: 480, r: 95, rim: 78, water: 64, dais: 128 }, POOL = { x0: -300, x1: 300, z0: 860, z1: 1300 };
  const ARCHES = [-300, 0, 300], ARCH_W = 190, ARCH_H = 330, LION = { x: 0, z: 1335 };
  const C = {
    sky: '#5FA8E6', skyLo: '#CBE8F7', sea: '#2F8FC4', seaLt: '#7CC6E6', hill: '#A9C77A', hillDk: '#86A85C', cypress: '#3F6B3A', cypressDk: '#2C4F2A',
    marble: '#FAF6EE', marbleSh: '#E9E1D2', marbleDk: '#D6CBB7', vein: '#D9CFC2',
    wall: '#F4DEC0', wallDk: '#E5C9A3', fresco: '#E7845A', frescoDk: '#B95A3A', frescoBlue: '#4E9BC7',
    tileA: '#F3E6CF', tileB: '#E7CDA6', tileC: '#C8734E', grout: '#D7BE98',
    water: '#5CC6D9', waterLt: '#A6E6EE', waterDk: '#2E97B3', foam: '#FFFFFF', foamSh: '#D5EEF6',
    bronze: '#B9803E', bronzeDk: '#7E4F22', gold: '#E3B03A', terra: '#C9653E', terraDk: '#9A4527', leaf: '#5E9E45', leafDk: '#3F7A30', lemon: '#F6D24A',
    towel: '#F2EDE2', towelStripe: '#4C86A8', line: '#7A5A4A', sun: '#FFF3C2',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  // a leaping dolphin for the wall frescoes: snout, back, dorsal fin, tail flukes, belly (wall units, v up)
  const DOLPHIN = [[-62, 4], [-52, 12], [-30, 22], [-14, 26], [-6, 40], [4, 26], [26, 20], [46, 10], [58, 18], [66, 16], [60, 4], [68, -8], [58, -6], [46, 2], [24, 6], [0, 6], [-26, 4], [-46, 0]];
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 4.5);

  // ---------- building blocks ----------
  // An axis-aligned box with back-face culling. col: one colour, or { top, nz, pz, side }
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .2), nz: col, pz: col, side: mixCol(col, '#000000', .08) } : col;
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.1);
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, lwPx: lw }); };
    if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz);
    if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz);
    if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
  }
  // A camera-facing cut-out at a world point, drawn in world units with y pointing down. fn gets k (px per unit).
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  const ring = (cx, cz, r, y, a0 = 0, a1 = TAU, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]; });
  // the half of a horizontal circle on the camera's side (near) or away from it (far), as world points
  const half = (P, cx, cz, r, y, near) => { const a0 = P.dir > 0 ? Math.PI : 0; return ring(cx, cz, r, y, near ? a0 : a0 + Math.PI, near ? a0 + Math.PI : a0 + TAU, 24); };
  function clipTo(q, fn) { if (!q) return; X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  function shadow(P, x, z, r) { const q = P.floorCircle(x, z, r, .3, 18); if (q) shape(q, { fill: 'rgba(120,80,50,.16)', stroke: null }); }

  // ---------- the view through the arches (a far backdrop, so it slides behind the arches as the camera moves) ----------
  function landscape(P, t) {
    P.plane(4200, () => {
      X.fillStyle = linGrad(0, -2600, 0, -300, [[0, C.sky], [1, C.skyLo]]); X.fillRect(-6000, -4000, 12000, 3800);
      circle(1500, -1900, 180, { fill: radGrad(1500, -1900, 60, 520, [[0, rgba(C.sun, .95)], [.35, rgba(C.sun, .5)], [1, rgba(C.sun, 0)]]), stroke: null });
      circle(1500, -1900, 110, { fill: '#FFF8D8', stroke: null });
      [[-2200, -2100, 1.2], [600, -2500, 1], [-600, -1700, .8], [2600, -1500, .9]].forEach(([x, y, s], i) => {
        const dx = 40 * Math.sin(t * .05 + i);
        shape(ellPts(x + dx, y, 260 * s, 70 * s, 18), { fill: 'rgba(255,255,255,.92)', stroke: null, smooth: true });
        shape(ellPts(x + dx + 150 * s, y - 40 * s, 170 * s, 70 * s, 18), { fill: 'rgba(255,255,255,.92)', stroke: null, smooth: true });
      });
      X.fillStyle = C.sea; X.fillRect(-6000, -300, 12000, 600);                                        // the sea
      for (let i = 0; i < 26; i++) { const x = -4000 + hash(i) * 8000, y = -260 + hash(i + 9) * 220, w = 60 + hash(i + 3) * 120;
        line([[x + 30 * Math.sin(t * .6 + i), y], [x + w + 30 * Math.sin(t * .6 + i), y]], { stroke: rgba(C.seaLt, .8), lwPx: 2 }); }
      shape([[-6000, 300], [-6000, -60], [-3300, -420], [-2200, -250], [-1500, -520], [-400, -320], [-6000, 300]], { fill: C.hillDk, stroke: null, smooth: .5 });
      shape([[600, 300], [1100, -260], [2200, -700], [3100, -500], [4200, -820], [6000, -300], [6000, 300]], { fill: C.hill, stroke: null, smooth: .4 });
      // the temple on the hill
      X.save(); X.translate(2350, -690); X.scale(.9, .9);
      shape([[-260, 0], [260, 0], [260, -26], [-260, -26]], { fill: C.marble, stroke: C.line, lwPx: 1.5 });
      for (let i = 0; i < 7; i++) shape(rectPts(-230 + i * 75, -210, 26, 184), { fill: C.marble, stroke: C.line, lwPx: 1.2 });
      shape([[-270, -210], [270, -210], [270, -240], [-270, -240]], { fill: C.marble, stroke: C.line, lwPx: 1.5 });
      shape([[-280, -240], [0, -330], [280, -240]], { fill: C.marbleSh, stroke: C.line, lwPx: 1.5 });
      X.restore();
      [[-3000, -330], [-2550, -280], [-1700, -480], [-900, -360], [900, -150], [1300, -320], [3400, -560], [3800, -620]].forEach(([x, y], i) => {
        const h = 300 + hash(i * 3) * 160;
        shape([[x, y - h], [x + 46, y - h * .55], [x + 40, y], [x - 40, y], [x - 46, y - h * .55]], { fill: i % 2 ? C.cypress : C.cypressDk, stroke: null, smooth: .6 });
      });
    });
  }

  // ---------- the hall ----------
  function floor(P) {
    const q = P.poly([[-HW, 0, FRONT], [HW, 0, FRONT], [HW, 0, BACK], [-HW, 0, BACK]]); if (!q) return;
    S(q, { fill: C.tileA, stroke: null });
    const step = 104;
    for (let i = -5; i < 5; i++) for (let j = Math.floor(FRONT / step); j < BACK / step; j++) {           // a checker of big marble tiles
      if ((i + j) & 1) continue;
      const z0 = j * step, z1 = z0 + step; if (P.depth(z0) < 0 && P.depth(z1) < 0) continue;
      const t = P.poly([[i * step, 0, z0], [(i + 1) * step, 0, z0], [(i + 1) * step, 0, z1], [i * step, 0, z1]]); if (t) shape(t, { fill: C.tileB, stroke: null });
    }
    for (let i = -5; i <= 5; i++) { const l = P.line([[i * step, .1, FRONT], [i * step, .1, BACK]]); if (l) line(l, { stroke: C.grout, lwPx: 1 }); }
    for (let z = FRONT; z <= BACK; z += step) { const l = P.line([[-HW, .1, z], [HW, .1, z]]); if (l) line(l, { stroke: C.grout, lwPx: 1 }); }
    // terracotta border strips along the colonnades
    for (const sd of [-1, 1]) { const b = P.poly([[sd * (COL_X - 40), .2, FRONT], [sd * (COL_X + 40), .2, FRONT], [sd * (COL_X + 40), .2, BACK], [sd * (COL_X - 40), .2, BACK]]); if (b) S(b, { fill: C.tileC, stroke: null }); }
    // sunbeams through the arches
    X.save(); X.globalCompositeOperation = 'lighter';
    for (const ax of ARCHES) { const b = P.poly([[ax - 80, .3, BACK], [ax + 80, .3, BACK], [ax + 40, .3, 300], [ax - 200, .3, 300]]); if (b) shape(b, { fill: rgba('#FFE9B0', .13), stroke: null }); }
    X.restore();
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, FRONT], [HW, CEIL, FRONT], [HW, CEIL, BACK], [-HW, CEIL, BACK]]); if (q) S(q, { fill: C.wallDk, stroke: null });
    for (let z = -400; z <= BACK; z += 200) { const l = P.line([[-HW, CEIL - .5, z], [HW, CEIL - .5, z]]); if (l) line(l, { stroke: C.marbleDk, lwPx: px(P, 6) }); }
  }
  function sideWalls(P) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = P.poly([[x, 0, FRONT], [x, 0, BACK], [x, CEIL, BACK], [x, CEIL, FRONT]]); if (!q) continue;
      S(q, { fill: C.wall });
      const band = (y0, y1, col) => { const b = P.poly([[x, y0, FRONT], [x, y0, BACK], [x, y1, BACK], [x, y1, FRONT]]); if (b) S(b, { fill: col, stroke: null }); };
      band(0, 70, C.marbleSh); band(170, 250, C.frescoBlue);
      // a running wave (the fresco), and leaping dolphins
      const wave = []; for (let z = FRONT; z <= BACK; z += 20) wave.push([x, 190 + 18 * Math.sin(z / 40), z]);
      const wl = P.line(wave); if (wl) line(wl, { stroke: '#FFFFFF', lwPx: px(P, 3), smooth: true });
      for (let z = -200; z < BACK; z += 330) {
        const d = P.poly(DOLPHIN.map(([u, v]) => [x, 205 + v, z + u]));                    // (u along the wall, v up)
        if (d) S(d, { fill: C.fresco, stroke: C.frescoDk, lwPx: px(P, 1.2), smooth: .4 });
      }
    }
  }
  function backWall(P, t) {
    if (!P.visible(BACK)) return;
    P.plane(BACK, () => {
      X.beginPath(); X.rect(-HW, -CEIL, HW * 2, CEIL);
      for (const ax of ARCHES) { X.moveTo(ax - ARCH_W / 2, 0); X.lineTo(ax - ARCH_W / 2, -ARCH_H + ARCH_W / 2); X.arc(ax, -ARCH_H + ARCH_W / 2, ARCH_W / 2, Math.PI, 0); X.lineTo(ax + ARCH_W / 2, 0); X.closePath(); }
      X.fillStyle = C.wall; X.fill('evenodd'); X.strokeStyle = C.line; X.lineWidth = 2; X.stroke();
      for (const ax of ARCHES) {                                                         // marble arch frames with a keystone
        X.beginPath(); X.arc(ax, -ARCH_H + ARCH_W / 2, ARCH_W / 2 + 12, Math.PI, 0); X.arc(ax, -ARCH_H + ARCH_W / 2, ARCH_W / 2, 0, Math.PI, true); X.closePath();
        X.fillStyle = C.marble; X.fill(); X.stroke();
        shape([[ax - 14, -ARCH_H - 14], [ax + 14, -ARCH_H - 14], [ax + 10, -ARCH_H + 6], [ax - 10, -ARCH_H + 6]], { fill: C.marbleSh, stroke: C.line, lwPx: 1.5 });
        for (const sd of [-1, 1]) shape(rectPts(ax + sd * (ARCH_W / 2 + 6) - 6, -ARCH_H + ARCH_W / 2, 12, ARCH_H - ARCH_W / 2), { fill: C.marble, stroke: C.line, lwPx: 1.5 });
      }
      shape(rectPts(-HW, -CEIL, HW * 2, 70), { fill: C.marbleSh, stroke: C.line, lwPx: 1.5 });                // the frieze
      X.font = `800 46px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.save(); X.scale(P.dir, 1);
      X.fillStyle = C.frescoDk; X.fillText('Λ Ο Υ Τ Ρ Α', 0, -CEIL + 36); X.restore();
      for (let x = -HW + 30; x < HW; x += 60) if (Math.abs(x) > 170) circle(x, -CEIL + 36, 9, { fill: C.frescoBlue, stroke: C.line, lwPx: 1.2 });
    });
  }
  function frontWall(P) {
    if (!P.visible(FRONT)) return;
    P.plane(FRONT, () => {
      X.beginPath(); X.rect(-HW, -CEIL, HW * 2, CEIL); X.moveTo(-110, 0); X.lineTo(-110, -200); X.arc(0, -200, 110, Math.PI, 0); X.lineTo(110, 0); X.closePath();
      X.fillStyle = C.wall; X.fill('evenodd'); X.strokeStyle = C.line; X.lineWidth = 2; X.stroke();
    });
  }

  // ---------- the pieces ----------
  function column(P, x, z) {
    box(P, x - 34, x + 34, 0, 18, z - 34, z + 34, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleDk });   // plinth
    sprite(P, x, 0, z, k => {
      const lw = clamp(1.2 / k, .3, 3), w = 22;
      shape([[-w, -18], [w, -18], [w - 2, -COL_H + 26], [-w + 2, -COL_H + 26]], { fill: linGrad(-w, 0, w, 0, [[0, C.marbleDk], [.35, C.marble], [.7, C.marble], [1, C.marbleSh]]), stroke: C.line, lwPx: 1.2 });
      for (let i = -3; i <= 3; i++) line([[i * 6, -24], [i * 5.6, -COL_H + 30]], { stroke: rgba(C.vein, .9), lw });     // flutes
      shape(rectPts(-w - 6, -30, 2 * w + 12, 12), { fill: C.marble, stroke: C.line, lwPx: 1.2 });                        // base mouldings
      shape(rectPts(-w - 8, -COL_H + 14, 2 * w + 16, 12), { fill: C.marble, stroke: C.line, lwPx: 1.2 });               // the Ionic capital
      for (const sd of [-1, 1]) { circle(sd * (w + 4), -COL_H + 26, 9, { fill: C.marble, stroke: C.line, lwPx: 1.2 }); circle(sd * (w + 4), -COL_H + 26, 3.5, { fill: C.marbleSh, stroke: C.line, lwPx: 1 }); }
      shape(rectPts(-w - 12, -COL_H, 2 * w + 24, 14), { fill: C.marble, stroke: C.line, lwPx: 1.2 });
    });
  }
  function architrave(P, sd) {
    const x = sd * COL_X;
    box(P, x - 40, x + 40, COL_H, COL_H + 40, FRONT, BACK, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleSh });
    if (sd * P.cam.x < COL_X) { const l = P.line([[x - sd * 40, COL_H + 14, FRONT], [x - sd * 40, COL_H + 14, BACK]]); if (l) line(l, { stroke: C.gold, lwPx: px(P, 2.5) }); }
  }
  function pool(P, t) {
    const { x0, x1, z0, z1 } = POOL;
    const rim = P.poly([[x0 - 30, .5, z0 - 30], [x1 + 30, .5, z0 - 30], [x1 + 30, .5, z1 + 30], [x0 - 30, .5, z1 + 30]]); if (rim) S(rim, { fill: C.marble });
    const q = P.poly([[x0, 1, z0], [x1, 1, z0], [x1, 1, z1], [x0, 1, z1]]); if (!q) return;
    S(q, { fill: C.water });
    clipTo(q, () => {
      for (let i = 0; i < 18; i++) {                                                       // sparkles and caustic lines
        const x = lerp(x0, x1, hash(i * 1.7)), z = lerp(z0, z1, hash(i * 2.9)), w = 30 + 30 * hash(i);
        const l = P.line([[x - w + 10 * Math.sin(t * 1.3 + i), 1.2, z], [x + w + 10 * Math.sin(t * 1.3 + i), 1.2, z + 6 * Math.sin(t + i)]]);
        if (l) line(l, { stroke: rgba(C.waterLt, .8), lwPx: px(P, 2.2) });
      }
      for (let r = 0; r < 3; r++) { const f = frac(t * .35 + r / 3), g = P.floorCircle(LION.x, z1 - 40, 20 + 110 * f, 1.4, 28); if (g) shape(g, { fill: null, stroke: rgba('#FFFFFF', .55 * (1 - f)), lwPx: px(P, 2) }); }
    });
  }
  function lionFountain(P, t) {
    const { x, z } = LION;
    box(P, x - 45, x + 45, 0, 120, z - 18, z + 18, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleDk });
    sprite(P, x, 92, z - 19, k => {
      shape(ellPts(0, 0, 30, 28, 22), { fill: C.bronzeDk, stroke: C.line, lwPx: 1.2, smooth: true });             // the mane
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; shape(ellPts(Math.cos(a) * 26, Math.sin(a) * 24, 9, 7, 10, a), { fill: C.bronze, stroke: C.line, lwPx: 1, smooth: true }); }
      shape(ellPts(0, 2, 18, 19, 18), { fill: C.bronze, stroke: C.line, lwPx: 1.2, smooth: true });
      for (const sd of [-1, 1]) circle(sd * 7, -4, 2.6, { fill: '#2A1A10', stroke: null });
      shape(ellPts(0, 10, 7, 5, 12), { fill: '#3A2210', stroke: C.line, lwPx: 1, smooth: true });                   // the open mouth
    });
    const pts = []; for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([x, 88 - 88 * u * u, z - 19 - 120 * u]); }    // the spout of water
    const l = P.line(pts); if (l) { line(l, { stroke: rgba(C.waterLt, .85), lwPx: px(P, 10), smooth: true }); line(l, { stroke: rgba('#FFFFFF', .7), lwPx: px(P, 3), smooth: true }); }
    const sp = P.floorCircle(x, z - 139, 14 + 4 * Math.sin(t * 9), 1.6, 16); if (sp) shape(sp, { fill: rgba('#FFFFFF', .7), stroke: null });
  }
  function amphora(P, x, z, col) {
    shadow(P, x, z, 28);
    sprite(P, x, 0, z, () => {
      const body = [[0, -2], [14, -10], [26, -40], [24, -70], [12, -88], [10, -100], [16, -106], [-16, -106], [-10, -100], [-12, -88], [-24, -70], [-26, -40], [-14, -10]];
      shape(body, { fill: col, stroke: C.line, lwPx: 1.4, smooth: .6 });
      for (const sd of [-1, 1]) line([[sd * 11, -100], [sd * 26, -98], [sd * 22, -78]], { stroke: col, lwPx: 5, smooth: true });
      shape([[-24, -58], [24, -58], [25, -48], [-25, -48]], { fill: '#2B1A14', stroke: null });
      for (let i = 0; i < 3; i++) shape(ellPts(-14 + i * 14, -53, 4, 3, 8), { fill: col, stroke: null });
    });
  }
  function bench(P) {
    const x = 300, z = 330;
    box(P, x - 40, x + 40, 0, 40, z - 90, z + 90, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleDk });
    box(P, x - 30, x + 30, 40, 52, z - 40, z + 20, { top: C.towel, nz: C.towel, pz: C.towel, side: C.marbleSh });     // folded towels
    box(P, x - 28, x + 28, 52, 62, z - 36, z + 14, { top: C.towel, nz: C.towelStripe, pz: C.towelStripe, side: C.towelStripe });
  }
  function lemonTree(P, x, z) {
    shadow(P, x, z, 40);
    sprite(P, x, 0, z, () => {
      shape([[-34, -60], [34, -60], [26, 0], [-26, 0]], { fill: C.terra, stroke: C.line, lwPx: 1.4 });
      shape(rectPts(-38, -68, 76, 12), { fill: C.terraDk, stroke: C.line, lwPx: 1.4 });
      line([[0, -68], [-3, -140], [4, -190]], { stroke: '#7E5434', lwPx: 7 });
      [[-40, -200], [30, -210], [0, -240], [-25, -170], [35, -170]].forEach(([cx, cy]) => shape(ellPts(cx, cy, 46, 38, 16), { fill: C.leaf, stroke: C.leafDk, lwPx: 1.4, smooth: true }));
      [[-30, -195], [22, -222], [40, -175], [-8, -168], [6, -246], [-45, -165]].forEach(([cx, cy]) => circle(cx, cy, 7, { fill: C.lemon, stroke: C.line, lwPx: 1 }));
    });
  }

  // ---------- the tub ----------
  // The back half (dais, far rim, the water) before the bather, the front half (near water, foam, outer wall) after.
  function tubBack(P, t, o) {
    const { x, z, r, rim, water, dais } = TUB;
    const d = P.floorCircle(x, z, dais, 8, 40); if (d) S(d, { fill: C.marbleSh });
    const outer = P.poly(ring(x, z, r, rim)), inner = P.poly(ring(x, z, r - 10, rim));
    if (outer) S(outer, { fill: C.marble });
    if (inner) S(inner, { fill: C.waterDk });
    clipTo(inner, () => {
      const w = P.poly(ring(x, z, r - 10, water)); if (w) shape(w, { fill: C.water, stroke: null });
      if (o.ripple != null && t > o.ripple) for (let i = 0; i < 3; i++) {
        const f = clamp((t - o.ripple) * .9 - i * .25); if (f <= 0 || f >= 1) continue;
        const g = P.poly(ring(x, z, 15 + (r - 20) * f, water + .5)); if (g) shape(g, { fill: null, stroke: rgba('#FFFFFF', .8 * (1 - f)), lwPx: px(P, 3) });
      }
      foam(P, t, o, false);
    });
  }
  function tubFront(P, t, o) {
    const { x, z, r, rim, water } = TUB;
    const inner = P.poly(ring(x, z, r - 10, rim));
    clipTo(inner, () => {                                                                  // the near water hides the bather's legs
      const w = P.poly(half(P, x, z, r - 10, water, true)); if (w) shape(w, { fill: rgba(C.water, .82), stroke: null });
      const l = P.line(half(P, x, z, r - 10, water, true).slice(4, 21).map(([a, b, c]) => [a, b + .2, c + (c - z) * -.25])); if (l) line(l, { stroke: rgba(C.waterLt, .9), lwPx: px(P, 2.5), smooth: true });
      foam(P, t, o, true);
    });
    // the outer wall, face by face (only the ones facing the camera)
    const n = 40;
    for (let i = 0; i < n; i++) {
      const a0 = i / n * TAU, a1 = (i + 1) / n * TAU, am = (a0 + a1) / 2;
      const cx = x + Math.cos(am) * r, cz = z + Math.sin(am) * r;
      if ((Math.cos(am) * (P.cam.x - cx) + Math.sin(am) * (P.cam.z - cz)) <= 0) continue;
      const q = P.poly([[x + Math.cos(a0) * r, 8, z + Math.sin(a0) * r], [x + Math.cos(a1) * r, 8, z + Math.sin(a1) * r], [x + Math.cos(a1) * r, rim, z + Math.sin(a1) * r], [x + Math.cos(a0) * r, rim, z + Math.sin(a0) * r]]);
      const lit = .5 + .5 * Math.cos(am + 2.2);
      if (q) shape(q, { fill: mixCol(C.marbleDk, C.marble, lit), stroke: mixCol(C.marbleDk, C.marble, lit), lwPx: 1 });
    }
    const nr = half(P, x, z, r, rim, true), nb = half(P, x, z, r, 8, true);
    const sil = P.line(nb); if (sil) line(sil, { stroke: C.line, lwPx: px(P, 1.4) });
    for (const [y, col, w] of [[rim - 12, C.gold, 5], [22, C.gold, 3]]) { const g = P.line(half(P, x, z, r + .5, y, true)); if (g) line(g, { stroke: col, lwPx: px(P, w) }); }
    // the near half of the rim, on top
    const lip = P.poly([...nr, ...half(P, x, z, r - 10, rim, true).reverse()]); if (lip) S(lip, { fill: C.marble, lwPx: px(P, 1.2) });
    // steam
    const k = o.steam ?? 1; if (k > .01) {
      X.save();
      for (let i = 0; i < 6; i++) {
        const f = frac(t * .18 + i / 6), sx = x - 60 + 120 * hash(i * 4.1) + 25 * Math.sin(t * .8 + i), [qx, qy, qk] = P.p(sx, rim + 20 + 180 * f, z);
        if (!P.visible(z)) break;
        shape(ellPts(qx, qy, (24 + 30 * f) * qk, (34 + 40 * f) * qk, 14), { fill: rgba('#FFFFFF', .22 * k * Math.sin(Math.PI * f)), stroke: null, smooth: true });
      }
      X.restore();
    }
  }
  // soap bubbles: a ring of foam round the edge, in clumps (far half, then near half)
  function foam(P, t, o, near) {
    const { x, z, r, water } = TUB, k = o.foam ?? .7; if (k < .02) return;
    for (let i = 0; i < 60; i++) {
      if (hash(i * 5.3) > k + .1) continue;
      const a = hash(i * 1.9) * TAU, rr = (r - 18) * (.55 + .45 * Math.sqrt(hash(i * 3.7))), bx = x + Math.cos(a) * rr, bz = z + Math.sin(a) * rr;
      if (((bz - z) * P.dir < 0) !== near) continue;
      const [qx, qy, qk] = P.p(bx, water + 2, bz), s = (5 + 7 * hash(i * 2.3)) * qk * (1 + .06 * Math.sin(t * 3 + i));
      circle(qx, qy - s * .4, s, { fill: C.foam, stroke: C.foamSh, lwPx: 1.2 });
      circle(qx - s * .35, qy - s * .75, s * .28, { fill: 'rgba(255,255,255,.95)', stroke: null });
    }
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the hall.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri });
    add(POOL.z0 - 30, POOL.z1 + 30, () => pool(P, t), -2);
    add(LION.z - 18, LION.z + 18, () => lionFountain(P, t), -1);
    for (const sd of [-1, 1]) { add(BACK, BACK, () => architrave(P, sd), -3); for (const cz of COLS) add(cz, cz, () => column(P, sd * COL_X, cz), 0); }
    add(TUB.z, TUB.z, () => { tubBack(P, t, o); if (o.bather) o.bather(); tubFront(P, t, o); }, 1);
    add(420, 420, () => amphora(P, -320, 420, C.terra), 1);
    add(760, 760, () => amphora(P, 310, 760, '#C77B45'), 1);
    add(240, 420, () => bench(P), 0);
    add(820, 820, () => lemonTree(P, -315, 820), 1);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 480 }, TUB, POOL, HW, BACK, FRONT, COL_X, COLS,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      landscape(P, t); ceiling(P); backWall(P, t); frontWall(P); sideWalls(P); floor(P);
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

// Registration for the studio's location browser: named spots and camera presets (paste-ready for scene code).
LOCATIONS.roman_bath = Object.assign(romanBath, {
  spots: {
    'In the tub': { x: 0, y: 0, z: 480 },
    'Beside the tub (left)': { x: -175, y: 0, z: 440 },
    'Beside the tub (right)': { x: 175, y: 0, z: 440 },
    'Left colonnade': { x: -300, y: 0, z: 760 },
    'Pool edge': { x: 0, y: 0, z: 820 },
  },
  cameras: {
    'Wide · the hall': { x: 0, y: 200, z: -280, f: 820, hy: 540, dir: 1 },
    'Tub · medium': { x: 0, y: 160, z: 110, f: 1000, hy: 600, dir: 1 },
    'Tub · close': { x: 0, y: 150, z: 260, f: 1050, hy: 560, dir: 1 },
    'Side · the colonnade': { x: -260, y: 160, z: 60, f: 820, hy: 560, dir: 1 },
    'Reverse · from the pool': { x: 0, y: 180, z: 1150, f: 760, hy: 560, dir: -1 },
  },
});
