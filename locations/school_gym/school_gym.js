// locations/school_gym/school_gym.js: the gymnasium at Dove Creek Elementary (see README.md).
//
// A 3D interior in one-point perspective (engine/persp.js), built like the library to be shot from BOTH ends:
//   scoreboard view  cameras with dir: 1 (the default) look toward +Z: the wall-mounted hoop, the DOVES scoreboard,
//                    the blue wall pads, the GO DOVES! banner and the caged clock.
//   stage view       cameras with dir: -1 look back toward −Z: the ceiling-hung hoop and the school stage behind it,
//                    with red curtains that open on a painted castle backdrop (for the school play).
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   schoolGym.back(P, t, o)    walls, floor, ceiling, stage and every piece farther than o.splitZ (default: everything). Call first.
//   schoolGym.front(P, t, o)   pieces nearer than o.splitZ (hoops, bleachers, ball cart…). Call after the characters.
//                              With o.toZ it stops at that depth, for several characters at different depths (far → near).
//   schoolGym.bleacher(row, z) → { x, y, z } where a spectator sits on bleacher row 0…3 (0 = the lowest, nearest the court).
//   schoolGym.rim(end)         → { x, y, z } the centre of a rim: end 1 = the scoreboard hoop, −1 = the stage hoop (for ball arcs).
// o: { splitZ, toZ, lights: 0..1 (the hanging gym lights and the shine on the floor; default 1), sun: 0..1 (beams through the
//      high windows; default .7), score: { home, guest } (default 0–0), clock: seconds on the game clock (default 600 = 10:00),
//      period (default 1), buzzer: 0..1 (the scoreboard flashes and its horn lights blink: feed it a kick()),
//      swish: 0..1 (the scoreboard hoop's net flips up and the rim shakes: feed it a kick()), swishStage: the same for the stage hoop,
//      curtain: 0..1 (the stage curtains open; default 0 = closed), stageHoopUp: 0..1 (winches the stage hoop up toward the
//      ceiling, out of the way for assemblies and plays; default 0 = down), rope: 0..1 (the climbing rope swings; default a gentle sway) }
//
// Layout (world): side walls X = ±1000, stage back wall Z = 0, proscenium wall Z = 300, front (scoreboard) wall Z = 2600, ceiling Y = 720.
// Court X ±760, baselines Z 400 and 2500, half-court line Z 1450, centre circle r 180. Keys X ±185, 580 deep; three-point arcs r 630.
// Rims Y 280: the stage hoop hangs from the ceiling (board Z 512–520, rim centre Z 545); the scoreboard hoop is wall-mounted (board Z 2380–2388, rim Z 2355).
// Stage X ±560, Z 0–330, top Y 100; opening X ±520, Y 100…440; curtains at Z 120. Bleachers on the left wall X −1000…−800, Z 900–2150.
// High windows on the right wall Y 470…650. Ball cart, climbing rope and folded mats along the right wall.

const schoolGym = (() => {
  const HW = 1000, BACK = 0, PROS = 300, FRONT = 2600, CEIL = 720;
  const COURT = { x: 760, z0: 400, z1: 2500 }, MID = 1450, KEY = 185, FT = 580, CIRC = 180, ARC = 630, HOOP_OFF = 160;
  const RIM_Y = 280, RIM_R = 23, BOARD = { w: 90, y0: 250, y1: 355 };
  const HOOPS = { [-1]: { face: 520, zc: 545, z0: 512, z1: 520 }, [1]: { face: 2380, zc: 2355, z0: 2380, z1: 2388 } };
  const STAGE = { x: 560, open: 520, z1: 330, h: 100, top: 440, curtainZ: 120 };
  const BL = { x0: -800, d: 50, rise: 38, seat: 40, rows: 4, z0: 900, z1: 2150 };
  const WINDOWS = [[620, 900], [1020, 1300], [1420, 1700], [1820, 2100]], WIN_Y = [470, 650];
  const CART = { x0: 820, x1: 940, z0: 1700, z1: 1780 }, MATS = { x0: 860, z0: 2040, z1: 2260, h: 64 }, ROPE = { x: 880, z: 1150 };
  const TRUSS = [600, 1100, 1600, 2100], LIGHT_X = [-500, 0, 500];
  const C = {
    wall: '#EFE6D6', wallDk: '#D8CCB6', block: '#E4DCCB', blockDk: '#CFC5B2', ceil: '#D9DDE0', ceilDk: '#BCC2C7',
    maple: '#E9BE80', mapleDk: '#D7A866', mapleLt: '#F3D4A0', apron: '#2E8F94', apronDk: '#257A7F', key: '#3AA3A8',
    court: '#1F3566', teal: '#2E8F94', tealLt: '#4FB5B8', navy: '#1F3566', navyLt: '#33508A', gold: '#F4C431', goldDk: '#C99A1E',
    pad: '#2C5DA8', padDk: '#224A87', wood: '#C99459', woodDk: '#9C6B37', woodLt: '#E0B47E', woodXd: '#6F4826',
    steel: '#7C858D', steelLt: '#A9B2BA', steelDk: '#56606A', glass: '#EAF4FA', orange: '#EE7A2A', orangeDk: '#C45A16',
    sky: '#8CC8EC', skyLt: '#DDF0FA', frame: '#F4F1E8', frameDk: '#C9C3B4', door: '#4E7FB0', doorDk: '#3A6390',
    red: '#C8323A', redDk: '#8F1F28', redLt: '#E25A5F', velvet: '#B4263A', velvetDk: '#7C1426', velvetLt: '#D8495A',
    ball: '#E07431', ballDk: '#A84E1A', play: '#D9433E', cone: '#F28C28', mat: '#3C6FC0', matDk: '#2B5498',
    green: '#6DAE4B', greenLt: '#94C962', greenDk: '#4F8C38', paper: '#FFFDF6', led: '#FF4B3A', amber: '#FFB23A',
    line: '#4A3F45',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.3, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 5);

  // ---------- building blocks (the same toolkit as the library) ----------
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
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const label = (txt, x, y, size, col, weight = 700, font = FONT_TALK) => { X.font = `${weight} ${size}px ${font}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const wline = (P, x, pts) => P.line(pts.map(([z, y]) => [x, y, z]));
  const fpoly = (P, pts, y = .4) => P.poly(pts.map(([x, z]) => [x, y, z]));               // a flat shape on the floor, [x, z] points
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  // A painted court line: each segment becomes a thin quad on the floor, so lines get thinner with distance like real paint.
  function courtLine(P, pts, w = 5, col = C.court) {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1], L = Math.hypot(bx - ax, bz - az) || 1, nx = -(bz - az) / L * w / 2, nz = (bx - ax) / L * w / 2;
      const q = fpoly(P, [[ax + nx, az + nz], [bx + nx, bz + nz], [bx - nx, bz - nz], [ax - nx, az - nz]], .8);
      if (q) S(q, { fill: col, stroke: null });
    }
  }
  const arcPts = (cx, cz, r, a0, a1, n = 28) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.cos(a) * r, cz + Math.sin(a) * r]; });

  // ---------- the floor ----------
  function floor(P, o) {
    const all = fpoly(P, [[-HW, PROS], [HW, PROS], [HW, FRONT], [-HW, FRONT]], 0); if (all) S(all, { fill: C.apron, stroke: null });
    const c = COURT, q = fpoly(P, [[-c.x, c.z0], [c.x, c.z0], [c.x, c.z1], [-c.x, c.z1]], .2);
    if (q) S(q, { fill: C.maple, stroke: null });
    // maple boards running the length of the court, with staggered butt joints
    for (let x = -c.x + 32, i = 0; x < c.x; x += 32, i++) {
      const l = P.line([[x, .3, c.z0], [x, .3, c.z1]]); if (l) line(l, { stroke: i % 3 ? 'rgba(170,120,60,.28)' : 'rgba(170,120,60,.42)', lwPx: px(P, .7) });
      for (let z = c.z0 + 140 + hash(i) * 300; z < c.z1 - 40; z += 420) { const j = P.line([[x - 32, .3, z], [x, .3, z]]); if (j) line(j, { stroke: 'rgba(170,120,60,.25)', lwPx: px(P, .6) }); }
      if (hash(i * 3.3) < .3) { const s = fpoly(P, [[x - 32, c.z0], [x, c.z0], [x, c.z1], [x - 32, c.z1]], .25); if (s) S(s, { fill: 'rgba(255,240,210,.18)', stroke: null }); }
    }
    // painted keys and the centre circle
    for (const end of [-1, 1]) {
      const zb = end < 0 ? c.z0 : c.z1, zf = zb - end * FT;
      const k = fpoly(P, [[-KEY, zb], [KEY, zb], [KEY, zf], [-KEY, zf]], .5); if (k) S(k, { fill: C.key, stroke: null });
    }
    const cc = P.floorCircle(0, MID, CIRC, .5, 40); if (cc) S(cc, { fill: C.key, stroke: null });
    const ci = P.floorCircle(0, MID, CIRC - 26, .6, 40); if (ci) S(ci, { fill: C.mapleLt, stroke: null });
    dove(P);
    // the lines
    courtLine(P, [[-c.x, c.z0], [c.x, c.z0], [c.x, c.z1], [-c.x, c.z1], [-c.x, c.z0]], 7);
    courtLine(P, [[-c.x, MID], [c.x, MID]], 6);
    courtLine(P, arcPts(0, MID, CIRC, 0, TAU, 40));
    for (const end of [-1, 1]) {
      const zb = end < 0 ? c.z0 : c.z1, zf = zb - end * FT, zc = zb - end * HOOP_OFF;
      courtLine(P, [[-KEY, zb], [-KEY, zf], [KEY, zf], [KEY, zb]]);
      courtLine(P, end < 0 ? arcPts(0, zf, CIRC, 0, Math.PI, 20) : arcPts(0, zf, CIRC, Math.PI, TAU, 20));
      for (let i = 0; i < 6; i++) { const a = end < 0 ? Math.PI + i / 6 * Math.PI : i / 6 * Math.PI, b = a + Math.PI / 12; courtLine(P, arcPts(0, zf, CIRC, a, b, 3), 4); }   // the dashed half
      const arc = end < 0 ? arcPts(0, zc, ARC, 0, Math.PI, 36) : arcPts(0, zc, ARC, Math.PI, TAU, 36);
      courtLine(P, [[ARC * (end < 0 ? 1 : -1), zb], ...arc, [ARC * (end < 0 ? -1 : 1), zb]], 5);
      for (const s of [-1, 1]) for (const d of [70, 160, 250]) courtLine(P, [[s * KEY, zb - end * d], [s * (KEY + 22), zb - end * d]], 6);   // lane hash marks
    }
    // the shine of the gym lights on the varnish
    const lit = clamp(o.lights ?? 1);
    if (lit > .01) for (const z of TRUSS) for (const x of LIGHT_X) {
      for (const [r, a] of [[220, .07], [120, .09]]) { const g = P.floorCircle(x, z + 60, r, 1, 28); if (g) S(g, { fill: `rgba(255,255,240,${(a * lit).toFixed(3)})`, stroke: null }); }
    }
    // sunlight from the high windows
    const sun = clamp(o.sun ?? .7);
    if (sun > .01) for (const [z0, z1] of WINDOWS) { const s = fpoly(P, [[HW - 280, z0 - 220], [HW - 280, z1 - 220], [HW - 700, z1 - 380], [HW - 700, z0 - 380]], 1.1); if (s) S(s, { fill: `rgba(255,236,170,${(.22 * sun).toFixed(3)})`, stroke: null }); }
  }
  // The DOVES logo in the centre circle: a white dove with a gold olive sprig, painted on the floor (x right, z away from the scoreboard end).
  function dove(P) {
    const at = (pts, s = 1) => fpoly(P, pts.map(([u, v]) => [u * s, MID + v * s]), .7);
    const body = at([[-95, -6], [-60, -30], [-10, -38], [40, -30], [72, -10], [96, 4], [118, 6], [98, 18], [70, 20], [30, 34], [-20, 32], [-60, 18], [-112, 34], [-100, 6]]);
    if (body) S(body, { fill: '#FFFFFF', stroke: C.navy, lwPx: px(P, 1.4), smooth: true });
    const wing = at([[-30, 4], [-2, 70], [36, 104], [40, 54], [22, 6]]); if (wing) S(wing, { fill: '#F4F7FB', stroke: C.navy, lwPx: px(P, 1.2), smooth: true });
    const eye = P.floorCircle(78, MID + 4, 5, .8, 10); if (eye) S(eye, { fill: C.navy, stroke: null });
    const beak = at([[104, 10], [130, 14], [106, 2]]); if (beak) S(beak, { fill: C.gold, stroke: C.navy, lwPx: px(P, .9) });
    const sprig = at([[124, 12], [150, 30], [140, 34], [126, 18]]); if (sprig) S(sprig, { fill: C.green, stroke: null });
  }

  // ---------- the shell ----------
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, PROS], [HW, CEIL, PROS], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]); if (q) S(q, { fill: C.ceil, stroke: null });
    for (let x = -HW + 60; x < HW; x += 60) { const l = P.line([[x, CEIL, PROS], [x, CEIL, FRONT]]); if (l) line(l, { stroke: C.ceilDk, lwPx: px(P, .9) }); }   // corrugated deck
  }
  function sideWalls(P, t, o) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = wrect(P, x, PROS, FRONT, 0, CEIL); if (q) S(q, { fill: C.wall, stroke: null });
      const b = wrect(P, x, PROS, FRONT, 0, 240); if (b) S(b, { fill: C.block, stroke: null });
      for (let y = 20; y < 240; y += 20) { const l = wline(P, x, [[PROS, y], [FRONT, y]]); if (l) line(l, { stroke: C.blockDk, lwPx: px(P, .7) }); }
      for (const [y0, y1, c] of [[240, 262, C.teal], [262, 270, C.gold]]) { const s = wrect(P, x, PROS, FRONT, y0, y1); if (s) S(s, { fill: c, stroke: null }); }
      if (sd < 0) leftWall(P, x); else rightWall(P, x, t);
    }
  }
  function leftWall(P, x) {
    // double doors at the scoreboard end, with push bars and little windows; a drinking fountain beside them
    const d = wrect(P, x, 2380, 2560, 0, 220); if (d) S(d, { fill: C.door, stroke: C.frameDk, lwPx: px(P, 5) });
    const m = wline(P, x, [[2470, 0], [2470, 220]]); if (m) line(m, { stroke: C.doorDk, lwPx: px(P, 2) });
    for (const z of [2400, 2490]) { const w = wrect(P, x, z + 18, z + 52, 130, 190); if (w) S(w, { fill: C.skyLt, stroke: C.doorDk, lwPx: px(P, 1.4) }); const bar = wrect(P, x, z + 4, z + 66, 100, 108); if (bar) S(bar, { fill: C.steelLt, lwPx: px(P, 1) }); }
    // DCES pennants above the bleachers
    [C.navy, C.teal, C.gold, C.navy, C.teal].forEach((c, i) => {
      const z = 980 + i * 230, p = wpoly(P, x, [[z, 610], [z + 150, 610], [z + 150, 470], [z + 75, 430], [z, 470]]); if (p) S(p, { fill: c, lwPx: px(P, 1.2) });
      const s = wpoly(P, x, [[z + 20, 590], [z + 130, 590], [z + 130, 580], [z + 20, 580]]); if (s) S(s, { fill: c === C.gold ? C.navy : C.gold, stroke: null });
      const st = wpoly(P, x, starPts(0, 0, 32).map(([u, v]) => [z + 75 + u, 515 - v])); if (st) S(st, { fill: c === C.gold ? C.navy : '#FFFFFF', lwPx: px(P, .8) });
    });
  }
  function rightWall(P, x, t) {
    for (const [z0, z1] of WINDOWS) {
      const q = wrect(P, x, z0, z1, WIN_Y[0], WIN_Y[1]); if (!q) continue;
      clipTo(q, () => {
        S(q, { fill: linGrad(0, Math.min(...q.map(v => v[1])), 0, Math.max(...q.map(v => v[1])), [[0, C.sky], [1, C.skyLt]]), stroke: null });
        for (let i = 0; i < 4; i++) { const cz = z0 + frac(t * .004 + hash(i + z0)) * (z1 - z0 + 200) - 100, cy = 560 + hash(i * 3 + z0) * 70; const cl = wpoly(P, x + 300, ellPts(cz, cy, 60, 16, 14)); if (cl) S(cl, { fill: 'rgba(255,255,255,.85)', stroke: null }); }
        const tr = wpoly(P, x + 400, Array.from({ length: 14 }, (_, i) => [z0 - 200 + i * (z1 - z0 + 400) / 13, 360 + (i % 2) * 60 + hash(i + z0) * 40]).concat([[z1 + 200, 0], [z0 - 200, 0]]));
        if (tr) S(tr, { fill: C.greenDk, stroke: null });
      });
      S(q, { fill: null, stroke: C.frame, lwPx: px(P, 5) });
      for (let k = 1; k < 4; k++) { const l = wline(P, x, [[lerp(z0, z1, k / 4), WIN_Y[0]], [lerp(z0, z1, k / 4), WIN_Y[1]]]); if (l) line(l, { stroke: C.frame, lwPx: px(P, 2.4) }); }
      const h = wline(P, x, [[z0, (WIN_Y[0] + WIN_Y[1]) / 2], [z1, (WIN_Y[0] + WIN_Y[1]) / 2]]); if (h) line(h, { stroke: C.frame, lwPx: px(P, 2.4) });
    }
    // a fire alarm and a thermostat
    const fa = wrect(P, x, 1350, 1380, 150, 190); if (fa) S(fa, { fill: C.red, lwPx: px(P, 1) });
    const th = wrect(P, x, 2300, 2330, 140, 166); if (th) S(th, { fill: C.paper, lwPx: px(P, 1) });
  }
  function sunbeams(P, o) {
    const sun = clamp(o.sun ?? .7); if (sun < .01) return;
    for (const [z0, z1] of WINDOWS) {
      const b = P.poly([[HW, WIN_Y[1], z0], [HW, WIN_Y[1], z1], [HW - 700, 0, z1 - 380], [HW - 700, 0, z0 - 380]]);
      if (b) S(b, { fill: `rgba(255,240,190,${(.07 * sun).toFixed(3)})`, stroke: null });
    }
  }

  // Front wall (Z = 2600): seen from the scoreboard view.
  function frontWall(P, t, o) {
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null });
      S(rectPts(-HW, -240, 2 * HW, 240), { fill: C.block, stroke: null });
      for (let y = 20; y < 240; y += 20) line([[-HW, -y], [HW, -y]], { stroke: C.blockDk, lwPx: .8 });
      S(rectPts(-HW, -262, 2 * HW, 22), { fill: C.teal, stroke: null }); S(rectPts(-HW, -270, 2 * HW, 8), { fill: C.gold, stroke: null });
      // blue safety pads under the hoop
      for (let i = 0; i < 12; i++) { S(rectPts(-720 + i * 120, -200, 120, 200), { fill: i % 2 ? C.pad : mixCol(C.pad, '#ffffff', .06), stroke: C.padDk, lwPx: 1.4 }); }
      scoreboard(P, t, o);
      // GO DOVES! banner (left) and the caged clock (right)
      S(rectPts(-760, -600, 300, 110), { fill: C.navy, stroke: C.gold, lwPx: 4 });
      readable(P, -610, -560, () => label('GO', 0, 0, 34, C.gold, 700, FONT_SFX));
      readable(P, -610, -520, () => label('DOVES!', 0, 0, 40, '#FFFFFF', 700, FONT_SFX));
      clock(P, 610, -560, 42, t);
      // posters between the pads and the scoreboard
      S(rectPts(-560, -420, 170, 130), { fill: C.paper, stroke: C.teal, lwPx: 3 });
      S(starPts(-475, -372, 30), { fill: C.gold, lwPx: 1.2 });
      readable(P, -475, -322, () => label('BE A GOOD', 0, 0, 17, C.navy)); readable(P, -475, -302, () => label('SPORT!', 0, 0, 19, C.red));
      S(rectPts(390, -420, 170, 130), { fill: C.paper, stroke: C.orange, lwPx: 3 });
      [-40, 0, 40].forEach((dx, i) => { circle(475 + dx, -380, 13, { fill: [C.red, C.gold, C.tealLt][i], lwPx: 1 }); S(rectPts(475 + dx - 12, -366, 24, 30), { fill: [C.red, C.gold, C.tealLt][i], lwPx: 1 }); });
      line([[440, -352], [510, -352]], { stroke: C.line, lwPx: 2.2, cap: 'round' });                        // arms linked
      readable(P, 475, -306, () => label('TEAMWORK', 0, 0, 19, C.navy));
    });
  }
  function scoreboard(P, t, o) {
    const x = -280, y = -690, w = 560, h = 210, buzz = clamp(o.buzzer || 0), sc = o.score || {}, home = sc.home ?? 0, guest = sc.guest ?? 0;
    const flash = buzz > .02 && Math.sin(t * 40) > 0;
    S(rectPts(x - 10, y - 10, w + 20, h + 20), { fill: C.navy, lwPx: 2 });
    S(rectPts(x, y, w, h), { fill: '#15181E', stroke: null });
    S(rectPts(x, y, w, 40), { fill: C.teal, stroke: null });
    readable(P, 0, y + 21, () => label('DOVE CREEK DOVES', 0, 0, 26, C.gold, 700, FONT_SFX));
    const glow = (fn, col, a) => { X.save(); X.shadowColor = col; X.shadowBlur = 18 * a; fn(); X.restore(); };
    const lit = flash ? 1.4 : 1;
    const digits = (n, cx, cy, size, col) => readable(P, cx, cy, () => {
      label('88', 0, 0, size, 'rgba(255,255,255,.06)', 400, FONT_SFX);                                // the unlit segments
      glow(() => label(String(Math.max(0, Math.round(n))).padStart(2, ' '), 0, 0, size, col, 400, FONT_SFX), col, lit);
    });
    readable(P, x + 100, y + 64, () => label('HOME', 0, 0, 22, '#FFFFFF')); readable(P, x + w - 100, y + 64, () => label('GUEST', 0, 0, 22, '#FFFFFF'));
    digits(home, x + 100, y + 136, 82, C.led); digits(guest, x + w - 100, y + 136, 82, C.led);
    const s = Math.max(0, Math.round(o.clock ?? 600)), mm = String(Math.floor(s / 60)).padStart(2, '0'), ss = String(s % 60).padStart(2, '0');
    readable(P, 0, y + 96, () => { label('88:88', 0, 0, 54, 'rgba(255,255,255,.06)', 400, FONT_SFX); glow(() => label(`${mm}:${ss}`, 0, 0, 54, C.amber, 400, FONT_SFX), C.amber, lit); });
    readable(P, 0, y + 150, () => label('PERIOD', 0, 0, 15, '#FFFFFF'));
    readable(P, 0, y + 180, () => glow(() => label(String(o.period ?? 1), 0, 0, 34, C.amber, 400, FONT_SFX), C.amber, lit));
    for (const sx of [-1, 1]) circle(sx * (w / 2 - 22), y + 22, 9, { fill: flash ? '#FFE36A' : '#5A4A20', stroke: C.line, lwPx: 1 });   // horn lights
    if (flash) { X.save(); X.globalCompositeOperation = 'lighter'; S(rectPts(x, y, w, h), { fill: `rgba(255,200,120,${(.18 * buzz).toFixed(3)})`, stroke: null }); X.restore(); }
  }
  function clock(P, x, y, r, t) {
    circle(x, y, r + 6, { fill: C.steelLt, stroke: C.line, lwPx: 2 });
    circle(x, y, r, { fill: '#FFFFFF', stroke: C.line, lwPx: 2.5 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[x + Math.sin(a) * r * .75, y - Math.cos(a) * r * .75], [x + Math.sin(a) * r * .88, y - Math.cos(a) * r * .88]], { stroke: C.line, lwPx: i % 3 ? 1 : 2.4 }); }
    const hand = (a, l, w, col) => { const d = P.dir; line([[x, y], [x + d * Math.sin(a) * l, y - Math.cos(a) * l]], { stroke: col, lwPx: w, cap: 'round' }); };
    hand(TAU * (10 / 12 + t / 43200), r * .45, 3.6, C.line); hand(TAU * (10 / 60 + t / 3600), r * .7, 2.4, C.line); hand(TAU * Math.floor(t) / 60, r * .8, 1.2, C.red);
    circle(x, y, 2.5, { fill: C.line, stroke: null });
    for (let i = -3; i <= 3; i++) line([[x + i * r / 3.2, y - r - 6], [x + i * r / 3.2, y + r + 6]], { stroke: 'rgba(80,90,100,.55)', lwPx: 1.2 });   // the wire cage
    for (let i = -3; i <= 3; i++) line([[x - r - 6, y + i * r / 3.2], [x + r + 6, y + i * r / 3.2]], { stroke: 'rgba(80,90,100,.55)', lwPx: 1.2 });
  }

  // ---------- the stage (Z 0–330, seen only from the stage view) ----------
  function stage(P, t, o) {
    const s = STAGE, cur = clamp(o.curtain || 0);
    // the stage house behind the proscenium: back wall with the painted castle backdrop, dark side walls
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: '#3A2E3A', stroke: null });
      backdrop(P, t);
    });
    for (const sd of [-1, 1]) { const q = wrect(P, sd * s.open, BACK, PROS, 0, CEIL); if (q) S(q, { fill: '#2E2430', stroke: null }); }
    const top = P.poly([[-s.open, s.h, BACK], [s.open, s.h, BACK], [s.open, s.h, PROS], [-s.open, s.h, PROS]]); if (top) S(top, { fill: C.wood, stroke: null });
    for (let x = -s.open + 40; x < s.open; x += 40) { const l = P.line([[x, s.h + .3, BACK], [x, s.h + .3, PROS]]); if (l) line(l, { stroke: 'rgba(110,70,38,.35)', lwPx: px(P, .7) }); }
    // the main curtain at Z 120: two red velvet halves that draw apart
    const hw = s.open * (1 - .84 * ease(cur));
    for (const sd of [-1, 1]) {
      const xo = sd * s.open, xi = sd * (s.open - hw), n = 9;
      const q = P.poly([[xo, s.h, s.curtainZ], [xi, s.h, s.curtainZ], [xi, s.top, s.curtainZ], [xo, s.top, s.curtainZ]]); if (!q) continue;
      S(q, { fill: C.velvet, stroke: C.velvetDk, lwPx: px(P, 1.2) });
      for (let i = 1; i < n; i++) {
        const x = lerp(xo, xi, i / n), sw = Math.sin(t * 1.3 + i) * 2;
        const f = P.poly([[x - 6, s.h, s.curtainZ], [x + 6, s.h, s.curtainZ], [x + 3 + sw, s.top, s.curtainZ], [x - 3 + sw, s.top, s.curtainZ]]); if (f) S(f, { fill: C.velvetDk, stroke: null });
        const g = P.poly([[x + 10, s.h + 4, s.curtainZ], [x + 16, s.h + 4, s.curtainZ], [x + 14, s.top - 10, s.curtainZ], [x + 9, s.top - 10, s.curtainZ]]); if (g) S(g, { fill: 'rgba(255,140,150,.25)', stroke: null });
      }
    }
    // the valance across the top of the opening, scalloped, with gold fringe
    const v = []; for (let i = 0; i <= 26; i++) { const x = lerp(-s.open, s.open, i / 26); v.push([x, s.top - 50 + (i % 2 ? 12 : 0), PROS - 8]); }
    const val = P.poly([[-s.open, s.top + 4, PROS - 8], [s.open, s.top + 4, PROS - 8], ...v.reverse()]); if (val) S(val, { fill: C.velvetLt, stroke: C.velvetDk, lwPx: px(P, 1.2) });
    const fr = P.line(v); if (fr) line(fr, { stroke: C.gold, lwPx: px(P, 3) });
  }
  // The painted backdrop for the school play: a storybook castle on a hill, with paper stars hanging in front.
  function backdrop(P, t) {
    const x = -500, y = -440, w = 1000, h = 340;
    S(rectPts(x, y, w, h), { fill: linGrad(0, y, 0, y + h, [[0, '#7DB9E8'], [.75, '#CDE8F6'], [1, '#E8F3D8']]), stroke: null });
    S([[-500, -100], [-500, -170], [-300, -210], [-60, -180], [200, -220], [500, -160], [500, -100]], { fill: C.greenLt, stroke: C.line, lwPx: 1.4, smooth: true });
    readable(P, 0, 0, () => {
      S(rectPts(-110, -330, 220, 140), { fill: '#E6D8C2', lwPx: 1.6 });
      for (const cx of [-140, 140]) { S(rectPts(cx - 34, -380, 68, 190), { fill: '#DCCBB0', lwPx: 1.6 }); S([[cx - 42, -380], [cx + 42, -380], [cx, -440]], { fill: '#9A6AD0', lwPx: 1.4 }); }
      for (let i = 0; i < 6; i++) S(rectPts(-110 + i * 40, -346, 22, 16), { fill: '#E6D8C2', lwPx: 1.2 });
      S([[-32, -190], [-32, -246], [0, -270], [32, -246], [32, -190]], { fill: C.woodDk, lwPx: 1.4 });
      S([[140, -440], [140, -470], [168, -460], [140, -452]], { fill: C.redLt, lwPx: 1 });
    });
    circle(-380, -380, 34, { fill: '#FFE07A', stroke: C.line, lwPx: 1.4 });
    for (let i = 0; i < 5; i++) { const sx = -420 + i * 210, sy = -300 + (i % 2) * 40 + wob(t, .3, i * .2) * 6; line([[sx, y], [sx, sy - 18]], { stroke: 'rgba(60,50,60,.5)', lwPx: 1 }); S(starPts(sx, sy, 18), { fill: C.gold, lwPx: 1 }); }
  }
  // The proscenium wall (Z = 300) with the stage opening, then the apron and the stage front.
  function proscenium(P, t) {
    const s = STAGE;
    P.plane(PROS, () => {
      for (const r of [rectPts(-HW, -CEIL, HW - s.open, CEIL), rectPts(s.open, -CEIL, HW - s.open, CEIL), rectPts(-s.open, -CEIL, 2 * s.open, CEIL - s.top)]) S(r, { fill: C.wall, stroke: null });
      for (const [x0, x1] of [[-HW, -s.open], [s.open, HW]]) { S(rectPts(x0, -240, x1 - x0, 240), { fill: C.block, stroke: null }); for (let y = 20; y < 240; y += 20) line([[x0, -y], [x1, -y]], { stroke: C.blockDk, lwPx: .8 }); S(rectPts(x0, -262, x1 - x0, 22), { fill: C.teal, stroke: null }); S(rectPts(x0, -270, x1 - x0, 8), { fill: C.gold, stroke: null }); }
      S([[-s.open - 24, 0], [-s.open - 24, -s.top - 24], [s.open + 24, -s.top - 24], [s.open + 24, 0], [s.open, 0], [s.open, -s.top], [-s.open, -s.top], [-s.open, 0]], { fill: C.woodLt, stroke: C.woodDk, lwPx: 1.6 });
      S(rectPts(-300, -s.top - 120, 600, 76), { fill: C.navy, stroke: C.gold, lwPx: 4 });
      readable(P, 0, -s.top - 82, () => label('DOVE CREEK ELEMENTARY', 0, 0, 34, C.gold, 700, FONT_SFX));
      for (const sx of [-1, 1]) { S(rectPts(sx * 760 - 50, -160, 100, 150), { fill: C.pad, stroke: C.padDk, lwPx: 1.4 }); }   // pads on the corners
    });
    // the apron and the stage front (panels, DCES lettering)
    const top = P.poly([[-s.x, s.h, PROS], [s.x, s.h, PROS], [s.x, s.h, s.z1], [-s.x, s.h, s.z1]]); if (top) S(top, { fill: C.woodLt, stroke: C.woodDk, lwPx: px(P, 1) });
    P.plane(s.z1, () => {
      S(rectPts(-s.x, -s.h, 2 * s.x, s.h), { fill: C.navy, lwPx: 1.6 });
      for (let i = 0; i < 7; i++) S(rectPts(-s.x + 14 + i * 158, -s.h + 14, 146, s.h - 26), { fill: C.navyLt, stroke: '#16264A', lwPx: 1 });
      S(rectPts(-s.x, -s.h, 2 * s.x, 10), { fill: C.woodLt, stroke: C.woodDk, lwPx: 1 });
      readable(P, 0, -s.h / 2 + 4, () => label('★  D C E S  ★', 0, 0, 38, C.gold, 700, FONT_SFX));
    });
    // stairs up the right-hand side (screen-left in the stage view)
    box(P, s.x, s.x + 90, 0, 66, 140, 300, { nz: C.navy, pz: C.navy, side: C.navyLt, top: C.woodLt });
    box(P, s.x + 90, s.x + 180, 0, 33, 140, 300, { nz: C.navy, pz: C.navy, side: C.navyLt, top: C.woodLt });
    const rail = P.line([[s.x + 170, 70, 300], [s.x + 80, 150, 300], [s.x + 10, 150, 300]]); if (rail) line(rail, { stroke: C.steelDk, lwPx: px(P, 2.4) });
  }

  // ---------- depth-sorted pieces ----------
  // A basketball hoop: the backboard, the orange rim and a net that flips up on a swish. end 1 = the scoreboard hoop, −1 = the stage hoop.
  function hoop(P, t, end, o) {
    const h = HOOPS[end], up = end < 0 ? ease(clamp(o.stageHoopUp || 0)) * 280 : 0, b = { ...BOARD, y0: BOARD.y0 + up, y1: BOARD.y1 + up }, ry = RIM_Y + up, sw = clamp(end > 0 ? o.swish || 0 : o.swishStage || 0);
    // supports: wall braces at the scoreboard end, a ceiling frame over the stage
    const steel = (pts, w = 3.2) => { const l = P.line(pts); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, w) }); };
    if (end > 0) for (const sx of [-60, 60]) { steel([[sx, 300, FRONT], [sx, 300, h.z1]]); steel([[sx, 480, FRONT], [sx, b.y1, h.z1]]); }
    else for (const sx of [-70, 70]) { steel([[sx, b.y1, h.z0], [sx, CEIL, h.z0 - 60]]); steel([[sx, b.y1, h.z0], [sx, CEIL, h.z0 + 120]], 2.4); }
    // the board: white with an orange border and shooter's square on whichever face the camera sees
    box(P, -b.w, b.w, b.y0, b.y1, h.z0, h.z1, { nz: C.glass, pz: C.glass, side: C.steelLt, top: C.steelLt, bot: C.steelLt }, { lwPx: px(P, 1.6) });
    const fz = P.cam.z < h.z0 ? h.z0 : h.z1;
    const ring = (x0, x1, y0, y1, w) => { for (const pts of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]) { const l = P.line(pts.map(([x, y]) => [x, y, fz])); if (l) line(l, { stroke: C.orange, lwPx: px(P, w) }); } };
    ring(-b.w + 6, b.w - 6, b.y0 + 6, b.y1 - 6, 2.6); ring(-30, 30, ry + 6, ry + 50, 2.4);
    // rim bracket, then the net (back strands, rim, front strands)
    const shake = sw * Math.sin(t * 50) * 2;
    const br = P.poly([[-12, ry - 10, fz], [12, ry - 10, fz], [8, ry, h.zc - end * RIM_R], [-8, ry, h.zc - end * RIM_R]]); if (br) S(br, { fill: C.orangeDk, lwPx: px(P, 1) });
    const N = 12, drop = 46 - sw * 26, rb = 13 + sw * 8, lean = Math.sin(t * 22) * sw * 6;
    const rimPt = a => [Math.cos(a) * RIM_R, ry + shake, h.zc + Math.sin(a) * RIM_R];
    const botPt = a => [Math.cos(a) * rb + lean, ry - drop, h.zc + Math.sin(a) * rb];
    const midPt = a => { const r = rimPt(a), q = botPt(a); return [lerp(r[0], q[0], .5) * 1.04, lerp(r[1], q[1], .5), lerp(r[2], q[2], .5)]; };
    const strands = near => { for (let i = 0; i < N; i++) { const a = i / N * TAU, nearSide = (Math.sin(a) * -P.dir) > 0; if (nearSide !== near) continue; const a2 = a + TAU / N / 2; const l = P.line([rimPt(a), midPt(a2), botPt(a)]); if (l) line(l, { stroke: 'rgba(255,255,255,.95)', lwPx: px(P, 1.2) }); const l2 = P.line([rimPt(a + TAU / N), midPt(a2), botPt(a + TAU / N)]); if (l2) line(l2, { stroke: 'rgba(235,235,240,.9)', lwPx: px(P, 1) }); } };
    strands(false);
    const rim = P.poly(Array.from({ length: 24 }, (_, i) => rimPt(i / 24 * TAU))); if (rim) S(rim, { fill: null, stroke: C.orange, lwPx: px(P, 3.4) });
    strands(true);
    const bot = P.poly(Array.from({ length: 16 }, (_, i) => botPt(i / 16 * TAU))); if (bot) S(bot, { fill: null, stroke: 'rgba(255,255,255,.9)', lwPx: px(P, 1) });
  }
  // Wooden pull-out bleachers along the left wall: four rising rows, drawn from the wall toward the court.
  function bleachers(P) {
    for (let r = BL.rows - 1; r >= 0; r--) {
      const xb = BL.x0 - r * BL.d, xa = xb - BL.d, y = BL.seat + r * BL.rise;
      box(P, xa, xb, 0, y - 8, BL.z0, BL.z1, { nz: C.woodXd, pz: C.woodXd, side: C.woodDk, top: C.wood }, { lwPx: px(P, 1) });
      box(P, xa + 8, xb, y - 8, y, BL.z0, BL.z1, { nz: C.woodDk, pz: C.woodDk, side: C.woodLt, top: C.woodLt }, { lwPx: px(P, 1) });
      for (let z = BL.z0 + 250; z < BL.z1 - 50; z += 250) { const l = P.line([[xb, 2, z], [xb, y - 10, z]]); if (l) line(l, { stroke: C.woodXd, lwPx: px(P, 1) }); }
    }
    for (const z of [BL.z0, BL.z1]) { const l = P.line([[BL.x0, 40, z], [BL.x0, 90, z], [-HW + 10, 90 + BL.rows * BL.rise, z]]); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, 2.6) }); }
  }
  function basketball(r = 12, spin = 0) {
    circle(0, -r, r, { fill: C.ball, lwPx: 1.1 });
    X.save(); X.translate(0, -r); X.rotate(spin);
    line([[-r, 0], [r, 0]], { stroke: '#3A2418', lwPx: .9 }); line([[0, -r], [0, r]], { stroke: '#3A2418', lwPx: .9 });
    line([[-r * .7, -r * .7], [-r * .3, 0], [-r * .7, r * .7]], { stroke: '#3A2418', lwPx: .9, smooth: true }); line([[r * .7, -r * .7], [r * .3, 0], [r * .7, r * .7]], { stroke: '#3A2418', lwPx: .9, smooth: true });
    X.restore(); ellipse(-r * .35, -r * 1.45, r * .3, r * .18, { fill: 'rgba(255,255,255,.35)', stroke: null });
  }
  function playBall(r = 14) { circle(0, -r, r, { fill: C.play, lwPx: 1.1 }); for (let i = -1; i <= 1; i++) line([[-r * .9, -r + i * 5], [r * .9, -r + i * 5]], { stroke: 'rgba(120,20,20,.35)', lwPx: .8 }); ellipse(-r * .35, -r * 1.45, r * .3, r * .18, { fill: 'rgba(255,255,255,.35)', stroke: null }); }
  // The ball cart: a steel rack on casters with two shelves of basketballs and a bin of red playground balls.
  function ballCart(P) {
    const c = CART;
    for (const x of [c.x0 + 8, c.x1 - 8]) for (const z of [c.z0 + 6, c.z1 - 6]) sprite(P, x, 0, z, () => { circle(0, -5, 5, { fill: '#2A2E33', lwPx: .8 }); circle(0, -5, 1.6, { fill: C.steelLt, stroke: null }); });
    for (const y of [12, 62]) box(P, c.x0, c.x1, y, y + 4, c.z0, c.z1, C.steel, { lwPx: px(P, .8) });
    for (const x of [c.x0, c.x1 - 3]) for (const z of [c.z0, c.z1 - 3]) box(P, x, x + 3, 12, 120, z, z + 3, C.steelDk, { lwPx: px(P, .6) });
    const zf = P.cam.z < c.z0 ? c.z0 + 14 : c.z1 - 14, zb = P.cam.z < c.z0 ? c.z1 - 14 : c.z0 + 14;
    for (const [y, f] of [[16, playBall], [66, basketball]]) for (const z of [zb, zf]) for (let i = 0; i < 4; i++) sprite(P, c.x0 + 16 + i * 29, y, z, () => f(13, i * .7));
    const rail = P.line([[c.x0, 120, c.z0], [c.x1, 120, c.z0], [c.x1, 120, c.z1], [c.x0, 120, c.z1], [c.x0, 120, c.z0]]); if (rail) line(rail, { stroke: C.steelDk, lwPx: px(P, 2) });
  }
  // Folded blue tumbling mats stacked against the right wall (Jenna's favourite corner).
  function mats(P) {
    const m = MATS;
    for (let i = 0; i < 4; i++) {
      const y0 = i * 16, x0 = m.x0 + (i % 2) * 6;
      box(P, x0, HW - 6, y0, y0 + 16, m.z0 + (i % 2) * 8, m.z1 - (i % 2) * 4, { nz: C.matDk, pz: C.matDk, side: C.mat, top: mixCol(C.mat, '#ffffff', .15) }, { lwPx: px(P, 1) });
    }
    for (let k = 1; k < 4; k++) { const z = lerp(m.z0, m.z1, k / 4), l = P.line([[m.x0 + 6, 64.3, z], [HW - 6, 64.3, z]]); if (l) line(l, { stroke: C.matDk, lwPx: px(P, 1) }); }
  }
  function cones(P) {
    [[700, 2150], [700, 1950], [690, 1300]].forEach(([x, z], i) => sprite(P, x, 0, z, () => {
      S([[-14, 0], [14, 0], [12, -3], [-12, -3]], { fill: C.cone, lwPx: .9 });
      S([[-9, -3], [9, -3], [2, -30], [-2, -30]], { fill: C.cone, lwPx: .9 });
      S([[-6.5, -12], [6.5, -12], [5, -18], [-5, -18]], { fill: '#FFFFFF', stroke: null });
    }));
  }
  // The climbing rope, hung from the ceiling by the windows, with knots every 60 units. It sways.
  function rope(P, t, o) {
    const sw = o.rope == null ? wob(t, .18) * 6 : clamp(o.rope) * Math.sin(t * 2.6) * 60;
    const at = y => { const f = (CEIL - y) / CEIL; return [ROPE.x + sw * f * f, y, ROPE.z + sw * .3 * f * f]; };
    const pts = []; for (let y = CEIL; y >= 30; y -= 30) pts.push(at(y));
    const l = P.line(pts); if (l) line(l, { stroke: '#B88B4E', lwPx: px(P, 4.5) });
    for (let y = 90; y < CEIL - 60; y += 60) { const [x, , z] = at(y); sprite(P, x, y, z, () => ellipse(0, 0, 4.5, 6, { fill: '#9C7440', lwPx: .8 })); }
    const b = P.line([[ROPE.x - 30, CEIL, ROPE.z], [ROPE.x + 30, CEIL, ROPE.z]]); if (b) line(b, { stroke: C.steelDk, lwPx: px(P, 3) });
  }
  // A steel roof truss across the gym with three caged high-bay lights hanging from it.
  function truss(P, t, z, o) {
    const lit = clamp(o.lights ?? 1), y0 = CEIL - 70, steel = (pts, w) => { const l = P.line(pts); if (l) line(l, { stroke: C.steelDk, lwPx: px(P, w) }); };
    steel([[-HW, CEIL - 6, z], [HW, CEIL - 6, z]], 2.6); steel([[-HW, y0, z], [HW, y0, z]], 2.6);
    const zz = []; for (let i = 0; i <= 20; i++) zz.push([-HW + i * 100, i % 2 ? CEIL - 6 : y0, z]); steel(zz, 1.4);
    for (const x of LIGHT_X) {
      steel([[x, y0, z], [x, y0 - 50, z]], 1.4);
      sprite(P, x, y0 - 50, z, () => {
        S([[-22, 0], [22, 0], [34, 30], [-34, 30]], { fill: '#9AA3AB', lwPx: 1.1 });
        if (lit > .01) { X.save(); X.globalCompositeOperation = 'lighter'; ellipse(0, 34, 70 * (.6 + .4 * lit), 30 * (.6 + .4 * lit), { fill: `rgba(255,250,215,${(.35 * lit).toFixed(3)})`, stroke: null }); X.restore(); }
        S(ellPts(0, 31, 34, 6, 18), { fill: lit > .01 ? mixCol('#B8BEC4', '#FFFDE6', lit) : '#B8BEC4', lwPx: 1 });
        for (let i = -2; i <= 2; i++) line([[i * 13, 31], [i * 9, 44]], { stroke: C.steelDk, lwPx: .8 });                     // wire cage
        S(ellPts(0, 44, 20, 3, 12), { fill: null, stroke: C.steelDk, lwPx: .8 });
      });
    }
  }
  // The EXIT sign sticks out from the left wall over the doors, so it's always readable from down the gym.
  function exitSign(P) {
    sprite(P, -HW + 30, 270, 2470, () => { S(rectPts(-30, -16, 60, 30), { fill: '#FFFFFF', lwPx: 1.1 }); label('EXIT', 0, -1, 17, '#D7262E', 700); line([[-30, -16], [-30, -28]], { stroke: C.steelDk, lwPx: 1.2 }); });
  }
  function fountain(P) {
    box(P, -HW, -HW + 44, 70, 100, 2240, 2310, { nz: C.steelLt, pz: C.steelLt, side: C.steel, top: '#C9D0D6' }, { lwPx: px(P, 1) });
    box(P, -HW, -HW + 20, 0, 70, 2260, 2290, C.steel, { lwPx: px(P, .8) });
  }

  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri });
    add(HOOPS[-1].z0, HOOPS[-1].zc + RIM_R, () => hoop(P, t, -1, o), 1);
    add(HOOPS[1].zc - RIM_R, HOOPS[1].z1, () => hoop(P, t, 1, o), 1);
    add(BL.z0, BL.z1, () => bleachers(P), -1);
    add(CART.z0, CART.z1, () => ballCart(P), 0);
    add(MATS.z0, MATS.z1, () => mats(P), -1);
    add(1300, 2150, () => cones(P), 0);
    add(ROPE.z, ROPE.z, () => rope(P, t, o), 0);
    add(2240, 2310, () => fountain(P), -1);
    add(2470, 2470, () => exitSign(P), 0);
    for (const z of TRUSS) add(z, z, () => truss(P, t, z, o), 2);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: MID }, HW, BACK, PROS, FRONT, CEIL, COURT, MID, KEY, FT, RIM_Y, STAGE, BL, CART,
    bleacher: (row, z = 1500) => ({ x: BL.x0 - row * BL.d - BL.d / 2, y: BL.seat + row * BL.rise, z }),
    rim: end => ({ x: 0, y: RIM_Y, z: HOOPS[end < 0 ? -1 : 1].zc }),
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      ceiling(P); sideWalls(P, t, o); floor(P, o);
      if (P.dir < 0) { stage(P, t, o); proscenium(P, t); } else frontWall(P, t, o);
      sunbeams(P, o);
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

// Registration for the studio's location browser: named spots + camera presets (paste-ready for scene code).
// Scoreboard cameras look toward the scoreboard hoop (dir 1); stage cameras look back at the stage (dir: -1).
LOCATIONS.school_gym = Object.assign(schoolGym, {
  spots: {
    'Center court': { x: 0, y: 0, z: 1450 },
    'Free-throw line · scoreboard hoop': { x: 0, y: 0, z: 1920 },
    'Under the scoreboard hoop': { x: 0, y: 0, z: 2250 },
    'Free-throw line · stage hoop': { x: 0, y: 0, z: 980 },
    'Sideline · bleacher side': { x: -650, y: 0, z: 1450 },
    'Sideline · window side': { x: 650, y: 0, z: 1450 },
    'Bleachers · front row': schoolGym.bleacher(0),
    'Bleachers · top row': schoolGym.bleacher(3),
    'By the ball cart': { x: 760, y: 0, z: 1640 },
    'Climbing rope': { x: 850, y: 0, z: 1130 },
    'Tumbling mats': { x: 790, y: 0, z: 2150 },
    'On stage': { x: 0, y: 100, z: 210 },
    'On stage · left': { x: -260, y: 100, z: 210 },
    'On stage · right': { x: 260, y: 100, z: 210 },
    'Doorway': { x: -900, y: 0, z: 2470 },
  },
  cameras: {
    'Scoreboard · wide from the baseline': { x: 0, y: 190, z: 590, f: 700, hy: 520, dir: 1 },
    'Scoreboard · center court': { x: 0, y: 150, z: 1000, f: 1000, hy: 580, dir: 1 },
    'Scoreboard · close': { x: 0, y: 135, z: 1220, f: 1100, hy: 600, dir: 1 },
    'Scoreboard · free throw': { x: 0, y: 140, z: 1500, f: 1100, hy: 560, dir: 1 },
    'Scoreboard · hoop': { x: 0, y: 220, z: 1750, f: 1000, hy: 600, dir: 1 },
    'Scoreboard · scoreboard': { x: 0, y: 260, z: 1500, f: 1100, hy: 820, dir: 1 },
    'Scoreboard · bleachers': { x: 250, y: 200, z: 600, f: 800, hy: 520, dir: 1 },
    'Scoreboard · ball cart & rope': { x: 560, y: 150, z: 900, f: 900, hy: 560, dir: 1 },
    'Stage · wide from the scoreboard end': { x: 0, y: 200, z: 2320, f: 700, hy: 500, dir: -1 },
    'Stage · from center court': { x: 0, y: 165, z: 1450, f: 900, hy: 520, dir: -1 },
    'Stage · performer': { x: 0, y: 190, z: 500, f: 600, hy: 480, dir: -1 },
    'Stage · hoop': { x: 0, y: 220, z: 1150, f: 1000, hy: 600, dir: -1 },
    'Stage · bleachers': { x: 300, y: 200, z: 2300, f: 800, hy: 520, dir: -1 },
  },
});
