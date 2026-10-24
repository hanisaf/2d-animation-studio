// locations/ancient_athens/ancient_athens.js: the agora of ancient Athens below the Acropolis, for Safadi's "Know thyself"
// story (scene 30; see README.md).
//
// An open-air square in one-point perspective (engine/persp.js). Looking in (dir: 1, toward +Z): a paved limestone agora
// with a round stepped speaker's platform (the bema) in the middle, a Doric stoa (a long roofed colonnade) down the left,
// olive trees, a marble bench and a column topped by Athena's owl on the right, and at the back a terrace wall with steps,
// cypresses, and the Acropolis on its rocky hill with the Parthenon on top. Looking back (dir: −1): the town's white houses
// and terracotta roofs, hills and the sea. Clouds drift, swallows wheel, olive leaves sway, the owl blinks and turns its head.
// Everything is drawn back-to-front by distance from the camera (P.depth), so it works from either end.
//
//   ancientAthens.back(P, t, o)    sky, backdrops, ground, stoa walls and every piece farther than o.splitZ. Call first.
//   ancientAthens.front(P, t, o)   pieces nearer than o.splitZ (stops at o.toZ if given). Call after the characters.
// o: { splitZ, toZ, birds: 0..1 (swallows in the sky, default 1) }. Pass the same o to back() and front().
//
// Layout (world): ground Y = 0. Agora paving X ±760, Z −600..1700. Bema: centre (0, 620), steps r 140 (Y 0–9) and
// r 105 (Y 9–18). Stoa: back wall X −760, Z −40..1440, columns at X −560, Z 100..1300 every 300, 300 tall, roof Y 300–360.
// Terrace wall Z 1700–1740 (Y 0–70) with steps X ±130. Olive trees (450, 260), (560, 1080), (−330, 1420).
// Bench (430, 520–720). Owl column (300, 1300). Amphorae (−430, 140), (−460, 920). Scroll basket (130, 540).

const ancientAthens = (() => {
  const PAVE_X = 760, PAVE_Z0 = -600, PAVE_Z1 = 1700, BEMA = { x: 0, z: 620, r1: 140, r2: 105, h1: 9, h2: 18 };
  const STOA = { wall: -760, colX: -560, cols: [100, 400, 700, 1000, 1300], h: 300, roof: 360, z0: -40, z1: 1440 };
  const TERRACE = { z: 1700, d: 40, h: 70, stair: 130 }, FAR = 3200, OWL = { x: 300, z: 1300, h: 230 };
  const C = {
    sky: '#4F9FE3', skyLo: '#D6EEF8', sun: '#FFF3C2', cloud: 'rgba(255,255,255,.93)',
    rock: '#D6C29A', rockDk: '#B59D72', rockLt: '#E8D9B6', shrub: '#7E9A55', shrubDk: '#5E7A3E', ridge: '#A9B7C4', ridgeDk: '#8E9DAE',
    earth: '#DCC496', earthDk: '#C9AE7C', grass: '#A9B66A', pave: '#EFE4CC', paveDk: '#DCCDAE', joint: '#CDBB98',
    marble: '#FAF6EE', marbleSh: '#E9E1D2', marbleDk: '#D6CBB7', vein: '#D9CFC2', temple: '#F3EAD8', templeSh: '#D8CBB0',
    wall: '#F1E0C2', wallDk: '#E0C9A2', red: '#B9533A', redDk: '#8E3A27', blue: '#3F6FB0', gold: '#E3B03A',
    roof: '#C9653E', roofDk: '#9A4527', house: '#F7F1E6', houseSh: '#E4D9C6',
    sea: '#2F8FC4', seaLt: '#7CC6E6', cypress: '#3F6B3A', cypressDk: '#2C4F2A',
    olive: '#8FA66A', oliveDk: '#64804A', oliveLt: '#B7C994', bark: '#7A5F48', barkDk: '#57412F', fruit: '#4A3A55',
    owl: '#9C8467', owlDk: '#6E5A44', owlLt: '#D8C8A8', terra: '#C9653E', wicker: '#C99A5A', wickerDk: '#9B7038', papyrus: '#F2E4BE',
    line: '#7A5A4A',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 4.5);

  // ---------- building blocks (as in roman_bath.js) ----------
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .2), nz: col, pz: col, side: mixCol(col, '#000000', .08) } : col;
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.1);
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, lwPx: lw }); };
    if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz);
    if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz);
    if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
    if (cam.y < y0) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.bottom ?? c.side);
  }
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  function shadow(P, x, z, r, a = .16) { const q = P.floorCircle(x, z, r, .3, 18); if (q) shape(q, { fill: `rgba(120,90,50,${a})`, stroke: null }); }
  const cloud = (x, y, s) => { shape(ellPts(x, y, 260 * s, 70 * s, 18), { fill: C.cloud, stroke: null, smooth: true }); shape(ellPts(x + 150 * s, y - 40 * s, 170 * s, 70 * s, 18), { fill: C.cloud, stroke: null, smooth: true }); };
  const cypress = (x, y, h, col) => shape([[x, y - h], [x + 46, y - h * .55], [x + 40, y], [x - 40, y], [x - 46, y - h * .55]], { fill: col, stroke: null, smooth: .6 });

  // ---------- the sky (screen space) ----------
  function sky(P, t) {
    const hy = P.cam.hy;
    X.fillStyle = linGrad(0, Math.min(0, hy - 900), 0, hy, [[0, C.sky], [1, C.skyLo]]); X.fillRect(0, 0, W, H);
  }
  // ---------- the backdrops: the Acropolis ahead, the town and the sea behind ----------
  function acropolis(P, t) {
    P.plane(FAR, () => {
      if (P.dir > 0) {
        circle(-2300, -2300, 110, { fill: '#FFF8D8', stroke: null });
        circle(-2300, -2300, 200, { fill: radGrad(-2300, -2300, 60, 560, [[0, rgba(C.sun, .9)], [.4, rgba(C.sun, .4)], [1, rgba(C.sun, 0)]]), stroke: null });
      }
      [[-2600, -2000, 1.1], [500, -2500, 1], [2400, -1900, .9], [-900, -2700, .7]].forEach(([x, y, s], i) => cloud(x + 50 * Math.sin(t * .05 + i), y, s));
      // Mount Hymettus, a long blue ridge far behind
      shape([[-6000, 0], [-6000, -380], [-3800, -620], [-2000, -540], [-400, -700], [1600, -560], [3600, -760], [6000, -420], [6000, 0]], { fill: C.ridge, stroke: null, smooth: .5 });
      shape([[-6000, 0], [-6000, -200], [-3000, -330], [-800, -260], [2000, -360], [6000, -240], [6000, 0]], { fill: C.ridgeDk, stroke: null, smooth: .5 });
      // the rock of the Acropolis: cliffs, ledges and shrubs, with the old wall round the top
      X.save(); X.translate(250, 0);
      const rock = [[-2900, 0], [-2500, -220], [-2150, -420], [-1900, -720], [-1650, -900], [1650, -920], [1950, -760], [2250, -470], [2650, -200], [3000, 0]];
      shape(rock, { fill: C.rock, stroke: C.line, lwPx: 1.5, smooth: .25 });
      X.save(); tracePath(rock, true, .25); X.clip();
      for (let i = 0; i < 16; i++) { const x = -2100 + i * 270 + 60 * hash(i), y = -880 + 120 * hash(i + 3); line([[x, y], [x - 30 + 60 * hash(i + 7), y + 260 + 200 * hash(i + 5)]], { stroke: C.rockDk, lwPx: 1.5 }); }
      shape([[-2900, 0], [-2300, -260], [-1500, -360], [-400, -300], [800, -380], [1900, -300], [3000, 0]], { fill: rgba(C.rockDk, .45), stroke: null, smooth: .5 });
      for (let i = 0; i < 22; i++) { const x = -2600 + 5200 * hash(i * 2.3), y = -60 - 380 * hash(i * 4.1); shape(ellPts(x, y, 90 + 60 * hash(i), 45, 12), { fill: i % 3 ? C.shrub : C.shrubDk, stroke: null, smooth: true }); }
      X.restore();
      shape(rectPts(-1700, -1000, 3400, 90), { fill: C.rockLt, stroke: C.line, lwPx: 1.3 });                         // the wall round the top
      for (let x = -1680; x < 1700; x += 120) line([[x, -1000], [x, -910]], { stroke: C.rockDk, lwPx: 1 });
      // the Propylaea (the gateway, left) and the little Erechtheion
      X.save(); X.translate(-1350, -1000);
      shape(rectPts(-260, -40, 520, 40), { fill: C.temple, stroke: C.line, lwPx: 1.2 });
      for (let i = 0; i < 6; i++) shape(rectPts(-230 + i * 88, -230, 34, 190), { fill: C.temple, stroke: C.line, lwPx: 1 });
      shape(rectPts(-270, -270, 540, 40), { fill: C.temple, stroke: C.line, lwPx: 1.2 });
      shape([[-270, -270], [0, -340], [270, -270]], { fill: C.templeSh, stroke: C.line, lwPx: 1.2 });
      X.restore();
      X.save(); X.translate(-700, -1000);
      shape(rectPts(-200, -170, 400, 170), { fill: C.templeSh, stroke: C.line, lwPx: 1.1 });
      for (let i = 0; i < 4; i++) shape(rectPts(-180 + i * 110, -200, 40, 200), { fill: C.temple, stroke: C.line, lwPx: 1 });
      shape(rectPts(-210, -230, 420, 34), { fill: C.temple, stroke: C.line, lwPx: 1.1 });
      X.restore();
      // the Parthenon: steps, eight columns, the frieze, the pediment
      X.save(); X.translate(500, -1000);
      const PW = 1500, CH = 430;
      for (let i = 0; i < 3; i++) shape(rectPts(-PW / 2 - 40 + i * 14, -22 * (i + 1), PW + 80 - i * 28, 22), { fill: C.temple, stroke: C.line, lwPx: 1.2 });
      shape(rectPts(-PW / 2 + 40, -66 - CH, PW - 80, CH), { fill: C.templeSh, stroke: null });                          // the shadowed cella behind
      for (let i = 0; i < 8; i++) {
        const cx = -PW / 2 + 70 + i * (PW - 140) / 7;
        shape([[cx - 46, -66], [cx + 46, -66], [cx + 38, -66 - CH], [cx - 38, -66 - CH]], { fill: linGrad(cx - 46, 0, cx + 46, 0, [[0, C.templeSh], [.4, C.temple], [1, C.temple]]), stroke: C.line, lwPx: 1.1 });
        for (const d of [-16, 0, 16]) line([[cx + d, -72], [cx + d * .85, -60 - CH]], { stroke: rgba(C.templeSh, .9), lwPx: 1 });
        shape(rectPts(cx - 54, -66 - CH - 26, 108, 26), { fill: C.temple, stroke: C.line, lwPx: 1 });
      }
      shape(rectPts(-PW / 2 - 10, -66 - CH - 106, PW + 20, 80), { fill: C.temple, stroke: C.line, lwPx: 1.2 });     // architrave and frieze
      for (let x = -PW / 2 + 20; x < PW / 2; x += 80) shape(rectPts(x, -66 - CH - 86, 26, 40), { fill: rgba(C.blue, .55), stroke: null });   // triglyphs
      shape([[-PW / 2 - 30, -66 - CH - 106], [0, -66 - CH - 290], [PW / 2 + 30, -66 - CH - 106]], { fill: C.temple, stroke: C.line, lwPx: 1.3 });
      shape([[-PW / 2 + 60, -66 - CH - 122], [0, -66 - CH - 262], [PW / 2 - 60, -66 - CH - 122]], { fill: rgba(C.red, .25), stroke: null });
      X.restore();
      X.restore();                                                                                                 // (the hill's offset)
      // cypresses and olives at the foot of the hill
      [[-3300, 0, 360], [-2950, 0, 300], [-1100, 0, 420], [-800, 0, 330], [1400, 0, 380], [3100, 0, 420], [3400, 0, 330]].forEach(([x, y, h], i) => cypress(x, y, h, i % 2 ? C.cypress : C.cypressDk));
      for (let i = 0; i < 12; i++) shape(ellPts(-3600 + 7200 * hash(i * 5.7), -40, 140 + 60 * hash(i), 70, 14), { fill: i % 2 ? C.olive : C.oliveDk, stroke: null, smooth: true });
      shape(rectPts(-7000, 0, 14000, 3000), { fill: C.earth, stroke: null });
    });
  }
  function town(P, t) {
    P.plane(-FAR, () => {
      [[-2200, -2200, 1], [700, -2600, .8], [2600, -2000, 1.1]].forEach(([x, y, s], i) => cloud(x + 50 * Math.sin(t * .05 + i), y, s));
      X.fillStyle = C.sea; X.fillRect(-7000, -260, 14000, 260);                                                        // the sea, toward Piraeus
      for (let i = 0; i < 22; i++) { const x = -4000 + hash(i) * 8000, y = -230 + hash(i + 9) * 200, w = 60 + hash(i + 3) * 120;
        line([[x + 30 * Math.sin(t * .6 + i), y], [x + w + 30 * Math.sin(t * .6 + i), y]], { stroke: rgba(C.seaLt, .8), lwPx: 2 }); }
      shape([[-7000, 0], [-7000, -300], [-4200, -560], [-2600, -380], [-1600, -200], [-7000, 0]], { fill: C.ridge, stroke: null, smooth: .5 });
      shape([[1200, 0], [2000, -420], [3200, -620], [4400, -460], [7000, -300], [7000, 0]], { fill: C.ridgeDk, stroke: null, smooth: .4 });
      // a little temple on a low hill (the Hephaisteion)
      shape([[-1800, 0], [-1300, -260], [-200, -320], [500, -150], [900, 0]], { fill: C.rock, stroke: C.line, lwPx: 1.3, smooth: .5 });
      X.save(); X.translate(-700, -310); X.scale(.7, .7);
      shape(rectPts(-300, -30, 600, 30), { fill: C.temple, stroke: C.line, lwPx: 1.5 });
      for (let i = 0; i < 7; i++) shape(rectPts(-270 + i * 85, -250, 30, 220), { fill: C.temple, stroke: C.line, lwPx: 1.2 });
      shape(rectPts(-310, -290, 620, 40), { fill: C.temple, stroke: C.line, lwPx: 1.5 });
      shape([[-320, -290], [0, -390], [320, -290]], { fill: C.templeSh, stroke: C.line, lwPx: 1.5 });
      X.restore();
      // the town: white houses with terracotta roofs, in rows
      for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) {
        const seed = row * 31 + i, x = -4200 + i * 540 + 200 * hash(seed), w = 260 + 160 * hash(seed + 1), h = 150 + 110 * hash(seed + 2), y = -20 + row * 90;
        if (row === 0 && x > -1700 && x < 700) continue;                                                              // leave the temple hill clear
        shape(rectPts(x - w / 2, y - h, w, h), { fill: hash(seed + 3) < .3 ? C.houseSh : C.house, stroke: C.line, lwPx: 1.1 });
        shape([[x - w / 2 - 20, y - h], [x, y - h - 70], [x + w / 2 + 20, y - h]], { fill: hash(seed + 4) < .5 ? C.roof : C.roofDk, stroke: C.line, lwPx: 1.1 });
        shape(rectPts(x - 22, y - 80, 44, 80), { fill: C.barkDk, stroke: null });
        if (hash(seed + 5) < .5) shape(rectPts(x + w / 4 - 18, y - h + 40, 36, 36), { fill: C.barkDk, stroke: null });
      }
      [[-4600, 260, 380], [-3400, 270, 320], [3000, 260, 400], [4300, 270, 330]].forEach(([x, y, h], i) => cypress(x, y, h, i % 2 ? C.cypress : C.cypressDk));
      shape(rectPts(-7000, 250, 14000, 3000), { fill: C.earth, stroke: null });
    });
  }
  function swallows(P, t, o) {
    const k = o.birds ?? 1; if (k < .05) return;
    for (let i = 0; i < 5; i++) {
      if (hash(i * 7.7) > k) continue;
      const u = frac(t * .04 + hash(i)), x = lerp(-2400, 2400, u) * (i % 2 ? 1 : -1), y = 520 + 160 * hash(i * 2) + 60 * Math.sin(t * .9 + i), z = (P.cam.z + 1600 * P.dir);
      if (!P.visible(z)) continue;
      const [sx, sy, s] = P.p(P.cam.x + x, P.cam.y + y - 150, z), fl = Math.sin(t * 9 + i * 2) * 6 * s;
      line([[sx - 16 * s, sy - fl], [sx - 5 * s, sy], [sx, sy + 3 * s], [sx + 5 * s, sy], [sx + 16 * s, sy - fl]], { stroke: '#3A3448', lwPx: Math.max(1.4, 3 * s), smooth: true });
    }
  }

  // ---------- the ground: open earth, then the paved agora ----------
  function ground(P) {
    const g = P.poly([[-7000, 0, -FAR], [7000, 0, -FAR], [7000, 0, FAR], [-7000, 0, FAR]]); if (g) shape(g, { fill: C.earth, stroke: null });
    for (let i = 0; i < 26; i++) {                                                                                  // dry grass patches off the paving
      const x = (hash(i * 3.3) < .5 ? -1 : 1) * (PAVE_X + 80 + 1600 * hash(i * 1.7)), z = lerp(-FAR, FAR, hash(i * 2.9));
      const q = P.floorCircle(x, z, 70 + 90 * hash(i), .1, 14); if (q) shape(q, { fill: rgba(C.grass, .55), stroke: null });
    }
    const q = P.poly([[-PAVE_X, .2, PAVE_Z0], [PAVE_X, .2, PAVE_Z0], [PAVE_X, .2, PAVE_Z1], [-PAVE_X, .2, PAVE_Z1]]); if (!q) return;
    S(q, { fill: C.pave, stroke: C.earthDk });
    const step = 130;                                                                                              // big slabs in staggered rows
    for (let j = Math.floor(PAVE_Z0 / step); j < PAVE_Z1 / step; j++) {
      const z0 = j * step, z1 = Math.min(z0 + step, PAVE_Z1); if (P.depth(z1) < 15) continue;
      const l = P.line([[-PAVE_X, .3, z0], [PAVE_X, .3, z0]]); if (l) line(l, { stroke: C.joint, lwPx: 1 });
      for (let x = -PAVE_X + (j & 1 ? step / 2 : 0); x < PAVE_X; x += step) {
        const v = P.line([[x, .3, Math.max(z0, P.cam.z + 16 * P.dir)], [x, .3, z1]]); if (v && P.depth(z0) > 15) line(v, { stroke: C.joint, lwPx: 1 });
        if (hash(x * .37 + j * 1.3) < .12) { const s = P.poly([[x + 4, .25, z0 + 4], [x + step - 4, .25, z0 + 4], [x + step - 4, .25, z1 - 4], [x + 4, .25, z1 - 4]]); if (s) shape(s, { fill: rgba(C.paveDk, .6), stroke: null }); }
      }
    }
  }

  // ---------- the stoa (a Doric colonnade down the left side) ----------
  function stoaBack(P) {
    const { wall, colX, h, roof, z0, z1 } = STOA;
    const fl = P.poly([[wall, 16, z0], [colX + 40, 16, z0], [colX + 40, 16, z1], [wall, 16, z1]]); if (fl) S(fl, { fill: C.paveDk, stroke: null });
    if (P.cam.x > wall) {
      const q = P.poly([[wall, 0, z0], [wall, 0, z1], [wall, roof, z1], [wall, roof, z0]]); if (q) S(q, { fill: C.wall });
      const band = (y0, y1, col) => { const b = P.poly([[wall, y0, z0], [wall, y0, z1], [wall, y1, z1], [wall, y1, z0]]); if (b) S(b, { fill: col, stroke: null }); };
      band(16, 90, C.red); band(90, 98, C.redDk); band(250, 270, C.blue);
      for (let z = z0 + 150; z < z1; z += 300) {                                                                   // painted panels and doors
        const d = P.poly([[wall + .5, 16, z - 45], [wall + .5, 16, z + 45], [wall + .5, 190, z + 45], [wall + .5, 190, z - 45]]); if (d) S(d, { fill: C.barkDk });
        const p = P.poly([[wall + .5, 120, z + 90], [wall + .5, 120, z + 200], [wall + .5, 220, z + 200], [wall + .5, 220, z + 90]]); if (p) S(p, { fill: C.wallDk });
      }
    }
    if (P.cam.y < h) { const c = P.poly([[wall, h, z0], [colX + 40, h, z0], [colX + 40, h, z1], [wall, h, z1]]); if (c) S(c, { fill: C.wallDk, stroke: null }); }
    // the end walls of the stoa
    for (const ze of [z0, z1]) if ((P.cam.z - ze) * (ze === z0 ? -1 : 1) > 0) {
      const q = P.poly([[wall, 0, ze], [colX + 40, 0, ze], [colX + 40, roof, ze], [wall, roof, ze]]); if (q) S(q, { fill: C.wallDk });
    }
  }
  function stoaRoof(P) {
    const { wall, colX, h, roof, z0, z1 } = STOA;
    box(P, colX - 40, colX + 40, h, h + 38, z0, z1, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marble, });          // the architrave
    if (P.cam.x > colX + 40) for (let z = z0 + 20; z < z1; z += 75) {                                              // triglyphs
      const q = P.poly([[colX + 40.5, h + 6, z], [colX + 40.5, h + 6, z + 22], [colX + 40.5, h + 32, z + 22], [colX + 40.5, h + 32, z]]); if (q) shape(q, { fill: C.blue, stroke: C.line, lwPx: px(P, .8) });
    }
    box(P, wall - 20, colX + 60, h + 38, roof, z0 - 20, z1 + 20, { top: C.roof, nz: C.roofDk, pz: C.roofDk, side: C.roofDk, bottom: C.wallDk });   // the tiled roof edge
    if (P.cam.x > colX + 60) for (let z = z0; z <= z1; z += 90) sprite(P, colX + 60, roof, z, () => {                      // antefixes along the eaves
      shape([[-9, 0], [-8, -12], [0, -18], [8, -12], [9, 0]], { fill: C.marble, stroke: C.line, lwPx: 1, smooth: .4 });
      circle(0, -9, 2.6, { fill: C.red, stroke: null });
    });
  }
  function doric(P, x, z, h, o = {}) {
    box(P, x - 32, x + 32, 0, o.base ?? 16, z - 32, z + 32, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleDk });
    sprite(P, x, o.base ?? 16, z, k => {
      const lw = clamp(1.2 / k, .3, 3), w0 = 24, w1 = 19, top = -(h - (o.base ?? 16));
      shape([[-w0, 0], [w0, 0], [w1, top + 22], [-w1, top + 22]], { fill: linGrad(-w0, 0, w0, 0, [[0, C.marbleDk], [.35, C.marble], [.7, C.marble], [1, C.marbleSh]]), stroke: C.line, lwPx: 1.2 });
      for (let i = -3; i <= 3; i++) line([[i * 6.4, -4], [i * 5, top + 26]], { stroke: rgba(C.vein, .9), lw });                         // flutes
      shape([[-w1, top + 22], [w1, top + 22], [w1 + 10, top + 10], [-w1 - 10, top + 10]], { fill: C.marble, stroke: C.line, lwPx: 1.2 });   // the echinus
      shape(rectPts(-w1 - 14, top, 2 * w1 + 28, 10), { fill: C.marble, stroke: C.line, lwPx: 1.2 });                                       // the abacus
    });
  }

  // ---------- the pieces ----------
  function bema(P) {
    const { x, z, r1, r2, h1, h2 } = BEMA;
    for (const [r, y0, y1] of [[r1, 0, h1], [r2, h1, h2]]) {
      shadow(P, x, z, r + 8, .12);
      const n = 36;
      for (let i = 0; i < n; i++) {                                                                                // the round riser, face by face
        const a0 = i / n * TAU, a1 = (i + 1) / n * TAU, am = (a0 + a1) / 2, cx = x + Math.cos(am) * r, cz = z + Math.sin(am) * r;
        if ((Math.cos(am) * (P.cam.x - cx) + Math.sin(am) * (P.cam.z - cz)) <= 0) continue;
        const q = P.poly([[x + Math.cos(a0) * r, y0, z + Math.sin(a0) * r], [x + Math.cos(a1) * r, y0, z + Math.sin(a1) * r], [x + Math.cos(a1) * r, y1, z + Math.sin(a1) * r], [x + Math.cos(a0) * r, y1, z + Math.sin(a0) * r]]);
        const lit = .5 + .5 * Math.cos(am + 2.2); if (q) shape(q, { fill: mixCol(C.marbleDk, C.marble, lit), stroke: mixCol(C.marbleDk, C.marble, lit), lwPx: 1 });
      }
      const top = P.floorCircle(x, z, r, y1, 40); if (top) S(top, { fill: C.marble, lwPx: px(P, 1.2) });
    }
    const ring = P.floorCircle(x, z, r2 - 22, h2 + .2, 40); if (ring) shape(ring, { fill: null, stroke: C.vein, lwPx: px(P, 1.5) });
  }
  function oliveTree(P, x, z, s, t, seed) {
    shadow(P, x, z, 120 * s, .18);
    sprite(P, x, 0, z, () => {
      X.save(); X.scale(s, s);
      shape([[-26, 0], [-16, -60], [-30, -120], [-10, -170], [8, -150], [20, -190], [34, -170], [16, -110], [30, -50], [34, 0]], { fill: C.bark, stroke: C.line, lwPx: 1.4, smooth: .5 });   // the gnarled trunk
      line([[-10, -40], [4, -90], [-6, -140]], { stroke: C.barkDk, lwPx: 2, smooth: true });
      line([[-20, -150], [-90, -210]], { stroke: C.bark, lwPx: 10 }); line([[24, -170], [100, -230]], { stroke: C.bark, lwPx: 9 });
      const sway = 4 * Math.sin(t * 1.1 + seed);
      [[-110, -240, 80, 52], [100, -260, 86, 54], [0, -300, 100, 62], [-60, -330, 70, 46], [60, -340, 74, 46], [-150, -200, 54, 36], [150, -210, 56, 36]].forEach(([cx, cy, rx, ry], i) => {
        const dx = sway * (1 - cy / -400) * (i % 2 ? 1 : .7);
        shape(ellPts(cx + dx, cy + 8, rx, ry, 18), { fill: C.oliveDk, stroke: null, smooth: true });
        shape(ellPts(cx + dx, cy, rx, ry, 18), { fill: C.olive, stroke: C.oliveDk, lwPx: 1.2, smooth: true });
        for (let j = 0; j < 6; j++) { const a = hash(seed + i * 7 + j) * TAU, rr = .7 * hash(seed + i + j * 3);                       // silvery leaves
          shape(ellPts(cx + dx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr, 9, 3.5, 8, a), { fill: C.oliveLt, stroke: null }); }
        if (i < 5 && hash(seed * 3 + i) < .6) circle(cx + dx + rx * (hash(seed + i * 3) - .5) * 1.2, cy + ry * (hash(seed + i * 5) - .2) * .6, 3, { fill: C.fruit, stroke: null });
      });
      X.restore();
    });
  }
  function owlColumn(P, t) {
    const { x, z, h } = OWL;
    box(P, x - 36, x + 36, 0, 24, z - 36, z + 36, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleDk });
    sprite(P, x, 24, z, k => {
      const top = -(h - 24), w = 18;
      shape([[-w, 0], [w, 0], [w - 2, top + 16], [-w + 2, top + 16]], { fill: linGrad(-w, 0, w, 0, [[0, C.marbleDk], [.4, C.marble], [1, C.marbleSh]]), stroke: C.line, lwPx: 1.2 });
      for (let i = -2; i <= 2; i++) line([[i * 6, -4], [i * 5.4, top + 20]], { stroke: rgba(C.vein, .9), lw: clamp(1.2 / k, .3, 3) });
      shape(rectPts(-w - 8, top + 4, 2 * w + 16, 12), { fill: C.marble, stroke: C.line, lwPx: 1.2 });
      for (const sd of [-1, 1]) { circle(sd * (w + 3), top + 16, 7, { fill: C.marble, stroke: C.line, lwPx: 1.1 }); circle(sd * (w + 3), top + 16, 2.6, { fill: C.marbleSh, stroke: null }); }
      shape(rectPts(-w - 10, top - 6, 2 * w + 20, 10), { fill: C.marble, stroke: C.line, lwPx: 1.2 });
      // Athena's owl: it blinks and now and then turns its head
      X.save(); X.translate(0, top - 6);
      shape([[-16, 0], [-20, -22], [-14, -40], [14, -40], [20, -22], [16, 0]], { fill: C.owl, stroke: C.line, lwPx: 1.3, smooth: .6 });
      shape([[-9, -4], [-11, -20], [0, -28], [11, -20], [9, -4]], { fill: C.owlLt, stroke: null, smooth: .6 });
      for (let i = 0; i < 5; i++) line([[-6 + i * 3, -10 - (i % 2) * 6], [-4.5 + i * 3, -8 - (i % 2) * 6]], { stroke: C.owlDk, lwPx: 1 });
      const ph = t % 7, turn = ph > 4.2 && ph < 5.6 ? Math.sin((ph - 4.2) / 1.4 * Math.PI) * .45 : 0, blink = (t + .7) % 3.3 < .14;
      X.translate(turn * 12, -46);
      shape([[-17, 4], [-19, -14], [-14, -24], [-9, -18], [9, -18], [14, -24], [19, -14], [17, 4], [0, 8]], { fill: C.owl, stroke: C.line, lwPx: 1.3, smooth: .5 });
      for (const sd of [-1, 1]) {
        circle(sd * 7 + turn * 4, -6, 6.4, { fill: C.owlLt, stroke: C.owlDk, lwPx: 1 });
        if (blink) line([[sd * 7 + turn * 4 - 5, -6], [sd * 7 + turn * 4 + 5, -6]], { stroke: C.owlDk, lwPx: 1.6 });
        else { circle(sd * 7 + turn * 4, -6, 4, { fill: '#F2C23A', stroke: null }); circle(sd * 7 + turn * 4, -6, 2.2, { fill: '#1E1614', stroke: null }); }
      }
      shape([[-2.4 + turn * 4, -2], [2.4 + turn * 4, -2], [turn * 4, 3]], { fill: '#E3A53A', stroke: C.line, lwPx: .8 });
      X.restore();
      for (const sd of [-1, 1]) line([[sd * 5, top - 6], [sd * 8, top - 2]], { stroke: '#E3A53A', lwPx: 2 });
    });
  }
  function bench(P) {
    const x = 430, z = 620;
    box(P, x - 30, x + 30, 0, 36, z - 80, z - 50, C.marbleDk); box(P, x - 30, x + 30, 0, 36, z + 50, z + 80, C.marbleDk);
    box(P, x - 40, x + 40, 36, 50, z - 100, z + 100, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleSh });
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
  function scrollBasket(P) {
    const x = 130, z = 540;
    shadow(P, x, z, 26);
    sprite(P, x, 0, z, () => {
      [[-10, -10], [0, -14], [10, -8], [4, 2]].forEach(([dx, dr], i) => {                                          // rolled scrolls standing up
        shape(rectPts(dx - 6, -66 + dr, 12, 40), { fill: C.papyrus, stroke: C.line, lwPx: 1 });
        shape(ellPts(dx, -66 + dr, 6, 2.6, 10), { fill: mixCol(C.papyrus, C.wicker, .3), stroke: C.line, lwPx: .9 });
        line([[dx - 6, -50 + dr], [dx + 6, -50 + dr]], { stroke: i % 2 ? C.red : C.blue, lwPx: 1.6 });
      });
      shape([[-22, -36], [22, -36], [18, 0], [-18, 0]], { fill: C.wicker, stroke: C.line, lwPx: 1.3 });
      for (let i = 1; i < 4; i++) line([[-22 + i, -36 + i * 9], [22 - i, -36 + i * 9]], { stroke: C.wickerDk, lwPx: 1.1 });
    });
  }
  // a little house in the lower town (between the terrace and the hill): white walls, a terracotta roof, a dark door
  function farHouse(P, x, z, w, h, seed) {
    sprite(P, x, 0, z, () => {
      shape(rectPts(-w / 2, -h, w, h), { fill: hash(seed) < .3 ? C.houseSh : C.house, stroke: C.line, lwPx: 1.2 });
      shape([[-w / 2 - 14, -h], [0, -h - 50], [w / 2 + 14, -h]], { fill: hash(seed + 1) < .5 ? C.roof : C.roofDk, stroke: C.line, lwPx: 1.2 });
      shape(rectPts(-16, -60, 32, 60), { fill: C.barkDk, stroke: null });
      if (hash(seed + 2) < .6) shape(rectPts(w / 4 - 12, -h + 26, 24, 24), { fill: C.barkDk, stroke: null });
    });
  }
  function terrace(P) {
    const { z, d, h, stair } = TERRACE;
    box(P, -900, -stair, 0, h, z, z + d, { top: C.rockLt, nz: C.rock, pz: C.rock, side: C.rockDk });
    box(P, stair, 900, 0, h, z, z + d, { top: C.rockLt, nz: C.rock, pz: C.rock, side: C.rockDk });
    for (let i = 0; i < 5; i++) box(P, -stair, stair, 0, (i + 1) * h / 5, z - 60 + i * 20 + 20, z + d, { top: C.marble, nz: C.marbleSh, pz: C.marbleSh, side: C.marbleDk });
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the square.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri });
    add(TERRACE.z, TERRACE.z + TERRACE.d, () => terrace(P), -2);
    for (let i = 0; i < 6; i++) { const cx = -800 + i * 330 + 80 * hash(i), cz = 2000 + 500 * hash(i * 3);
      add(cz, cz, () => sprite(P, cx, 0, cz, () => cypress(0, 0, 300 + 120 * hash(i * 5), i % 2 ? C.cypress : C.cypressDk)), -1); }
    for (let i = 0; i < 30; i++) { const hx = -2600 + i * 180 + 120 * hash(i * 1.3), hz = 2000 + 1000 * hash(i * 2.1);
      if (Math.abs(hx) < 220) continue;                                                                           // keep the path up the hill clear
      add(hz, hz, () => farHouse(P, hx, hz, 240 + 140 * hash(i * 3.1), 150 + 100 * hash(i * 4.3), i), -1);
      if (hash(i * 6.7) < .6) { const ox = hx + 140, oz = hz - 60; add(oz, oz, () => sprite(P, ox, 0, oz, () => { shape(ellPts(0, -70, 90, 60, 16), { fill: C.oliveDk, stroke: null, smooth: true }); shape(ellPts(-10, -80, 70, 44, 16), { fill: C.olive, stroke: null, smooth: true }); line([[0, 0], [0, -30]], { stroke: C.bark, lwPx: 8 }); }), -1); }
    }
    add(STOA.z1, STOA.z1, () => stoaRoof(P), -3);
    for (const cz of STOA.cols) add(cz, cz, () => doric(P, STOA.colX, cz, STOA.h), 0);
    add(BEMA.z - BEMA.r1, BEMA.z + BEMA.r1, () => bema(P), -1);
    add(OWL.z, OWL.z, () => owlColumn(P, t), 0);
    add(260, 260, () => oliveTree(P, 450, 260, 1, t, 1), 1);
    add(1080, 1080, () => oliveTree(P, 560, 1080, 1.15, t, 2), 1);
    add(1420, 1420, () => oliveTree(P, -330, 1420, .95, t, 3), 1);
    add(520, 720, () => bench(P), 0);
    add(140, 140, () => amphora(P, -430, 140, C.terra), 1);
    add(920, 920, () => amphora(P, -460, 920, '#C77B45'), 1);
    add(540, 540, () => scrollBasket(P), 1);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: BEMA.z }, BEMA, STOA, OWL, PAVE_X,
    back(P, t, o = {}) {
      sky(P, t); acropolis(P, t); town(P, t); swallows(P, t, o); ground(P); stoaBack(P);
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
LOCATIONS.ancient_athens = Object.assign(ancientAthens, {
  spots: {
    'On the bema': { x: 0, y: 18, z: 620 },
    'Student 1 (far left)': { x: -250, y: 0, z: 430 },
    'Student 2': { x: -130, y: 0, z: 370 },
    'Student 3 (centre)': { x: 0, y: 0, z: 345 },
    'Student 4': { x: 130, y: 0, z: 370 },
    'Student 5 (far right)': { x: 250, y: 0, z: 430 },
    'In the stoa': { x: -640, y: 16, z: 600 },
    'Under the olive tree': { x: 380, y: 0, z: 300 },
  },
  cameras: {
    'Wide · the agora': { x: 0, y: 210, z: -180, f: 820, hy: 560, dir: 1 },
    'Sage · low angle': { x: 0, y: 80, z: 380, f: 900, hy: 700, dir: 1 },
    'Sage · medium': { x: 0, y: 150, z: 360, f: 1000, hy: 490, dir: 1 },
    'Students · reverse': { x: 0, y: 170, z: 700, f: 820, hy: 540, dir: -1 },
    'Side · from the stoa': { x: -470, y: 170, z: 240, f: 850, hy: 560, dir: 1 },
  },
});
