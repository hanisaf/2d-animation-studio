// locations/soccer_field/soccer_field.js: a county park soccer field (see README.md).
//
// An outdoor 3D set in one-point perspective (engine/persp.js), built to be shot from BOTH ends of the pitch:
//   dir: 1 (default)  cameras look up the pitch toward +Z (the far goal, scoreboard and tree line)
//   dir: -1           cameras look back toward −Z (the near goal, the snack bar side, the tree line behind it)
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   soccerField.back(P, t, o)   sky, hills, turf, markings, and every piece farther than o.splitZ (default: everything).
//   soccerField.front(P, t, o)  pieces nearer than o.splitZ (goal nets, fences, benches, fans…). Call after the characters.
//                               With o.toZ it stops at that depth, for several characters at different depths (far → near):
//     back(P, t, { splitZ: a.z }); draw(a); front(P, t, { splitZ: a.z, toZ: b.z }); draw(b); front(P, t, { splitZ: b.z });
// o: { splitZ, toZ, wind (0..2, default 1: trees, flags), crowd (0..1 how full the stands are, default .3), cheer (0..1, default 0),
//      score: [home, guest], home / guest (scoreboard names), clock (seconds or a string; omitted = no clock) }
// Ground shadows fall along SUN; distant trees fade toward the horizon (hazeK).
//
// Layout (world; 1 unit ≈ 1 cm, a person is ~170 tall): X right, Y up (turf = 0), Z along the pitch.
// Pitch: south goal line Z 0, north goal line Z 9000, touchlines X ±2750, halfway Z 4500. Regulation boxes: penalty area 4032 × 1650,
// goal area 1832 × 550, penalty spot 1100 out, centre circle r 915. Goals 732 wide × 244 high, net 190 deep (south net toward −Z).
// Low barrier rail X ±3500; tall ball-stop fence behind each goal at Z −1000 and Z 10000. Bleachers left (front row X −3900, two
// sections Z 1900–4300 and 4700–7100). Team shelters right (X 3000–3440, Z 3000–3700 blue, 5300–6000 red). Snack bar right
// (X 4300–5700, Z 1500–2900). Scoreboard beyond the north fence (X 2100, Z 10500). Parking lot behind the south fence
// (X −3300…2300, Z −2450…−1350) with the COUNTY PARK sign. Light poles at X ±3800/−4700, Z 1500 and 7500.

const soccerField = (() => {
  const LEN = 9000, HW = 2750, MID = LEN / 2, LW = 12;
  const GW = 732, GH = 244, ND = 190;
  const FX = 3500, ENDS = [-1000, 10000];
  const BL = { xf: -3900, rows: 4, rd: 85, rise: 46, secs: [[1900, 4300], [4700, 7100]] };
  const SHELTERS = [{ z0: 3000, z1: 3700, col: '#2F62A8' }, { z0: 5300, z1: 6000, col: '#B83A3A' }];
  const SNACK = { x0: 4300, x1: 5700, z0: 1500, z1: 2900, h: 320 };
  const BOARD = { x: 2100, z: 10500 };
  const LOT = { x0: -3300, x1: 2300, z0: -2450, z1: -1350 };                 // parking lot behind the south fence
  const SUN = { x: .42, z: -.3 };                                            // ground shadow offset per unit of height
  const C = {
    sky: '#3F78BC', skyLo: '#B4CFE6', cloud: '#F4F8FC', hillFar: '#9DB6C6', hillNear: '#86A783',
    lawn: '#8DB05C', lawnLt: '#A6C374', lawnDk: '#799A4B', pitch: '#5FA24A', pitchB: '#6DB053', worn: '#8C7A4E',
    paint: '#FBFBF5', conc: '#D8D6CE', concDk: '#BCB9AF', path: '#C7B896', pathDk: '#A99A78',
    alu: '#D4DADE', aluDk: '#98A2A9', aluSh: '#7B858D', steel: '#5B646B', galv: '#A6AFB5', white: '#F6F6F0', whiteDk: '#C5C5BC',
    block: '#DDD6C4', blockDk: '#BDB5A0', roof: '#5B6B78', roofDk: '#46545F', accent: '#2F62A8', door: '#9B3B2F', glass: '#2E3D48',
    awning: '#C5453A', awning2: '#F2EBDD', wood: '#B58A58', woodDk: '#8C6440', bin: '#3F5F4A', cone: '#EE7A2C',
    trunk: '#6A4E3B', leaf: '#3D7A36', leafMid: '#57973F', leafLt: '#7DB656', asph: '#6D7585', asphDk: '#5B6372',
    line: '#3D3237',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .7, 5);
  const px2 = (k, w) => clamp(w * k, .8, 6);
  const quad = (P, x0, x1, z0, z1, y, o) => { const q = P.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]); if (q) S(q, { stroke: null, ...o }); return q; };
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const text = (str, size, col, o = {}) => { X.font = `700 ${size}px ${FONT_TALK}`; X.fillStyle = col; X.textAlign = o.align || 'center'; X.textBaseline = 'middle'; X.fillText(str, 0, 0); };

  // ---------- a box with back-face culling ----------
  // col: one colour, or { top, nz (faces −Z), pz (faces +Z), side, bot }
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
  // Distance haze: far things fade toward the pale horizon sky.
  const hazeK = (P, z) => clamp((P.depth(z) - 6000) / 30000) * .55;
  const hz = (col, a) => a > .005 ? mixCol(col, C.skyLo, a) : col;

  // ---------- ground shadows ----------
  // Every caster is a set of 3D points pushed down the sun vector onto the turf; its 2D hull (in X, Z) is the shadow.
  // All shadows go into one path and are filled once, so overlaps don't double-darken.
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const cast = ([x, y, z]) => [x + y * SUN.x, z + y * SUN.z];
  function shadowCasters() {
    const S3 = [], bx = (x0, x1, y0, y1, z0, z1) => S3.push([[x0, y0, z0], [x1, y0, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z0], [x1, y1, z0], [x0, y1, z1], [x1, y1, z1]]);
    const pl = (x, z, h, r = 8) => bx(x - r, x + r, 0, h, z - r, z + r);
    for (const [e, s] of [[0, 1], [LEN, -1]]) {
      for (const sd of [-1, 1]) { pl(sd * GW / 2, e, GH, 6); pl(sd * GW / 2, e - s * ND, GH * .8, 4); }
      bx(-GW / 2, GW / 2, GH - 12, GH, e - 6, e + 6);
    }
    for (const [a, b] of BL.secs) for (let n = 0; n < BL.rows; n++) bx(BL.xf - BL.rd * (n + 1), BL.xf - BL.rd * n, 0, 48 + BL.rise * n, a, b);
    for (const sh of SHELTERS) { bx(2970, 3460, 235, 251, sh.z0 - 30, sh.z1 + 30); bx(3430, 3440, 0, 235, sh.z0, sh.z1); }
    bx(SNACK.x0, SNACK.x1, 0, SNACK.h + 24, SNACK.z0, SNACK.z1);
    for (const dx of [-320, 320]) pl(BOARD.x + dx, BOARD.z, 380, 14);
    bx(BOARD.x - 380, BOARD.x + 380, 380, 720, BOARD.z - 18, BOARD.z + 18);
    for (const [x, z] of LIGHTS) { pl(x, z, 1800, 18); bx(x - 190, x + 190, 1800, 2030, z - 30, z + 30); }
    for (const e of ENDS) for (let x = -FX; x <= FX; x += 300) pl(x, e, 470, 5);
    for (const sx of [-1, 1]) for (const e of [0, LEN]) pl(sx * HW, e, 150, 3);
    return S3;
  }
  let _casters = null;
  function shadows(P, t) {
    const polys = [];
    for (const pts of (_casters ??= shadowCasters())) polys.push(hull(pts.map(cast)));
    for (const tr of TREES) {                                                 // canopy ellipse + trunk
      const cx = tr.x + tr.h * .7 * SUN.x, cz = tr.z + tr.h * .7 * SUN.z, r = tr.h * .27, e = [];
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; e.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r * .8]); }
      polys.push(e, hull([[tr.x - 20, tr.z], [tr.x + 20, tr.z], ...[[tr.x - 15, tr.h * .5, tr.z], [tr.x + 15, tr.h * .5, tr.z]].map(cast)]));
    }
    for (const c of CARS) polys.push(hull([[c.x - 88, c.z - 210], [c.x + 88, c.z - 210], [c.x - 88, c.z + 210], [c.x + 88, c.z + 210], ...[[c.x - 80, 150, c.z - 100], [c.x + 80, 150, c.z - 100], [c.x - 80, 150, c.z + 90], [c.x + 80, 150, c.z + 90]].map(cast)]));
    X.beginPath();
    for (const h of polys) {
      if (h.length < 3) continue;
      const q = P.poly(h.map(([x, z]) => [x, .6, z])); if (!q) continue;
      X.moveTo(q[0][0], q[0][1]); for (let i = 1; i < q.length; i++) X.lineTo(q[i][0], q[i][1]); X.closePath();
    }
    X.fillStyle = 'rgba(28,52,24,.24)'; X.fill('nonzero');
  }

  // A thin pole: a vertical line in the world, width in world units.
  function pole(P, x, y0, y1, z, w, col) { const l = P.line([[x, y0, z], [x, y1, z]]); if (l) line(l, { stroke: col, lwPx: clamp(w * P.k(z), .8, 9) }); }

  // ---------- sky, hills, clouds ----------
  function clouds(P, t) {
    const z = P.cam.z + P.dir * 60000;
    for (let i = 0; i < 6; i++) {
      const x = -45000 + i * 18000 + hash(i * 9) * 8000 + t * 250, y = 8500 + hash(i * 5) * 6000;
      P.plane(z, k => { for (let j = 0; j < 5; j++) ellipse(x + (j - 2) * 1500, -y - Math.sin(j / 4 * Math.PI) * 1100, 1900, 1200, { fill: C.cloud, stroke: null, alpha: .55 }); });
    }
  }
  function hills(P) {
    [[72000, C.hillFar, 3200, 1400, 2], [52000, C.hillNear, 2100, 900, 7]].forEach(([d, col, amp, amp2, seed]) => {
      P.plane(P.cam.z + P.dir * d, () => {
        const pts = [[-90000, 400]];
        for (let x = -90000; x <= 90000; x += 3000) pts.push([x, -(amp * .55 + amp * .45 * Math.sin(x / 14000 + seed) + amp2 * Math.sin(x / 5200 + seed * 2.3))]);
        pts.push([90000, 400]); S(pts, { fill: col, stroke: null });
      });
    });
  }

  // ---------- the ground ----------
  function ground(P, t) {
    const far = 90000, hy = P.cam.hy, wide = 90000;
    quad(P, -wide, wide, P.cam.z - far, P.cam.z + far, 0, { fill: linGrad(0, hy, 0, H + 300, [[0, C.lawnLt], [.2, C.lawn], [1, C.lawnDk]]) });
    // turf: mowing stripes across the pitch, a margin around the touchlines
    const X0 = HW + 250, Z0 = -250, Z1 = LEN + 250;
    quad(P, -X0, X0, Z0, Z1, .1, { fill: C.pitch });
    for (let i = 0; i < 12; i++) if (i % 2) quad(P, -X0, X0, i ? i * 750 : Z0, i === 11 ? Z1 : (i + 1) * 750, .15, { fill: C.pitchB });
    // worn patches: goal mouths, penalty spots and the centre spot
    for (const [x, z, r, a] of [[0, 220, 330, .3], [0, LEN - 220, 330, .3], [0, 1100, 140, .3], [0, LEN - 1100, 140, .3], [0, MID, 120, .22]]) {
      const q = P.floorCircle(x, z, r, .2, 28); if (q) S(q, { fill: C.worn, stroke: null, alpha: a });
    }
    // spectator paths outside the barrier, and the apron in front of the stands
    for (const sd of [-1, 1]) quad(P, sd > 0 ? FX : -FX - 400, sd > 0 ? FX + 400 : -FX, ENDS[0], ENDS[1], .2, { fill: C.path });
    for (const [a, b] of BL.secs) quad(P, BL.xf - 20, BL.xf + 380, a - 100, b + 100, .3, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    for (const sh of SHELTERS) quad(P, 2950, 3460, sh.z0 - 60, sh.z1 + 60, .3, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    quad(P, SNACK.x0 - 200, SNACK.x1 + 200, SNACK.z0 - 300, SNACK.z1 + 200, .3, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    // parking lot behind the south fence, and the drive out to the road on the left
    quad(P, LOT.x0, LOT.x1, LOT.z0, LOT.z1, .25, { fill: C.asph, stroke: C.asphDk, lwPx: .8 });
    quad(P, -wide, LOT.x0, LOT.z0 + 350, LOT.z0 + 750, .25, { fill: C.asph });
    for (let x = LOT.x0 + 150; x <= LOT.x1 - 100; x += 280) {
      quad(P, x - 5, x + 5, LOT.z1 - 480, LOT.z1 - 10, .35, { fill: C.paint, alpha: .85 });
      quad(P, x - 5, x + 5, LOT.z0 + 10, LOT.z0 + 480, .35, { fill: C.paint, alpha: .85 });
    }
    for (let x = -wide; x < LOT.x0; x += 700) quad(P, x, x + 350, LOT.z0 + 544, LOT.z0 + 556, .35, { fill: '#E9C94A', alpha: .9 });
    for (const sd of [-1, 1]) quad(P, sd > 0 ? FX : -FX - 400, sd > 0 ? FX + 400 : -FX, LOT.z1, ENDS[0], .3, { fill: C.path });   // the side paths run on to the lot
    markings(P);
    shadows(P, t);
  }
  // White paint: each segment is a real 12-wide quad on the turf, plus a hairline so it never vanishes at a distance.
  function ln(P, pts, closed = false) {
    const n = pts.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], d = Math.hypot(dx, dz) || 1, nx = -dz / d * LW / 2, nz = dx / d * LW / 2;
      const q = P.poly([[a[0] + nx, .5, a[1] + nz], [b[0] + nx, .5, b[1] + nz], [b[0] - nx, .5, b[1] - nz], [a[0] - nx, .5, a[1] - nz]]);
      if (q) { S(q, { fill: C.paint, stroke: null }); if (LW * q[0][2] < 1.4) { const l = P.line([[a[0], .5, a[1]], [b[0], .5, b[1]]]); if (l) line(l, { stroke: C.paint, lwPx: .9, alpha: .8 }); } }
    }
  }
  const arcPts = (cx, cz, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.sin(a) * r, cz + Math.cos(a) * r]; });
  function spot(P, x, z) { const q = P.floorCircle(x, z, 22, .5, 10); if (q) S(q, { fill: C.paint, stroke: null }); }
  function markings(P) {
    ln(P, [[-HW, 0], [HW, 0], [HW, LEN], [-HW, LEN]], true);
    ln(P, [[-HW, MID], [HW, MID]]);
    ln(P, arcPts(0, MID, 915, 0, TAU, 48));
    spot(P, 0, MID);
    for (const e of [0, LEN]) {
      const s = e ? -1 : 1;                                                   // s: direction into the pitch
      ln(P, [[-2016, e], [-2016, e + s * 1650], [2016, e + s * 1650], [2016, e]]);
      ln(P, [[-916, e], [-916, e + s * 550], [916, e + s * 550], [916, e]]);
      spot(P, 0, e + s * 1100);
      const a0 = Math.acos(550 / 915);                                        // the D: the part of the arc outside the box
      ln(P, arcPts(0, e + s * 1100, 915, -a0, a0, 16).map(([x, z]) => [x, e + s * 1100 + (z - (e + s * 1100)) * s]));
      for (const sx of [-1, 1]) { const q = arcPts(sx * HW, e, 100, 0, TAU, 12); ln(P, q.filter(([x, z]) => Math.abs(x) <= HW + 1 && s * (z - e) >= -1)); }
    }
  }

  // ---------- goals ----------
  function netFace(P, a, b, c, d, nu, nv, alpha = .32) {                      // corners in order around the face; a→b and d→c are the u edges
    const q = P.poly([a, b, c, d]); if (!q) return;
    S(q, { fill: 'rgba(255,255,255,.07)', stroke: null });
    const mix = (p, r, f) => [lerp(p[0], r[0], f), lerp(p[1], r[1], f), lerp(p[2], r[2], f)];
    for (let i = 1; i < nu; i++) { const l = P.line([mix(a, b, i / nu), mix(d, c, i / nu)]); if (l) line(l, { stroke: C.white, lwPx: .7, alpha }); }
    for (let j = 1; j < nv; j++) { const l = P.line([mix(a, d, j / nv), mix(b, c, j / nv)]); if (l) line(l, { stroke: C.white, lwPx: .7, alpha }); }
  }
  function goal(P, z, s) {                                                    // s = +1 south goal (net toward −Z), −1 north goal
    const zb = z - s * ND, NH = GH * .8, hw = GW / 2, front = s * (P.cam.z - z) > 0;
    const nets = () => {
      netFace(P, [-hw, 0, zb], [hw, 0, zb], [hw, NH, zb], [-hw, NH, zb], 24, 8);                       // back
      for (const sd of [-1, 1]) netFace(P, [sd * hw, 0, z], [sd * hw, 0, zb], [sd * hw, NH, zb], [sd * hw, GH, z], 6, 8);   // sides
      netFace(P, [-hw, GH, z], [hw, GH, z], [hw, NH, zb], [-hw, NH, zb], 24, 6);                          // top
    };
    const frame = () => {
      const wh = { top: C.white, nz: C.white, pz: C.white, side: C.whiteDk, bot: C.whiteDk };
      for (const sd of [-1, 1]) {
        box(P, sd * hw - 6, sd * hw + 6, 0, GH, z - 6, z + 6, wh, { lwPx: px(P, .9) });
        box(P, sd * hw - 4, sd * hw + 4, 0, NH, zb - 4, zb + 4, wh, { lwPx: px(P, .9) });                 // rear uprights
        box(P, sd * hw - 3, sd * hw + 3, 0, 6, Math.min(z, zb), Math.max(z, zb), wh, { lwPx: px(P, .9) });  // ground bars
      }
      box(P, -hw - 6, hw + 6, GH - 12, GH, z - 6, z + 6, wh, { lwPx: px(P, .9) });
    };
    if (front) { nets(); frame(); } else { frame(); nets(); }
  }
  function cornerFlag(P, x, z, t, wind) {
    P.plane(z, k => {
      const sw = wob(t, .9, hash(x + z)) * 10 * wind, wv = wob(t, 1.7, hash(x)) * 6 * wind;
      line([[x, 0], [x, -150]], { stroke: '#F2EBDD', lwPx: px2(k, 3) });
      S([[x, -150], [x + 34 + sw, -142 + wv], [x, -122]], { fill: '#F2A93B', lwPx: px2(k, 1.2) });
    });
  }

  // ---------- fences, barrier rails ----------
  function sideBarrier(P, x, z0, z1) {                                        // low white pipe rail along a touchline
    const h = 120, q = P.poly([[x, 0, z0], [x, h, z0], [x, h, z1], [x, 0, z1]]);
    for (let z = z0; z <= z1 + 1; z += 400) pole(P, x, 0, h, z, 5, C.whiteDk);
    for (const y of [h, h * .55]) { const l = P.line([[x, y, z0], [x, y, z1]]); if (l) line(l, { stroke: C.white, lwPx: clamp(5 * P.k((z0 + z1) / 2), 1, 5) }); }
    if (q) S(q, { fill: 'rgba(210,220,225,.06)', stroke: null });
  }
  function endFence(P, z, x0, x1) {                                           // tall ball-stop chain link behind a goal
    const h = 450, q = P.poly([[x0, 0, z], [x1, 0, z], [x1, h, z], [x0, h, z]]);
    if (q) S(q, { fill: 'rgba(190,205,212,.16)', stroke: null });
    for (let y = 60; y < h; y += 60) { const l = P.line([[x0, y, z], [x1, y, z]]); if (l) line(l, { stroke: C.galv, lwPx: .7, alpha: .3 }); }
    for (let x = x0; x <= x1 + 1; x += 300) pole(P, x, 0, h + 20, z, 7, C.steel);
    const r = P.line([[x0, h, z], [x1, h, z]]); if (r) line(r, { stroke: C.steel, lwPx: clamp(7 * P.k(z), 1, 6) });
    const b = P.line([[x0, 12, z], [x1, 12, z]]); if (b) line(b, { stroke: C.steel, lwPx: clamp(5 * P.k(z), 1, 5) });
  }
  function banners(P, z, x0, x1) {                                            // fabric windscreens on the pitch side of an end fence
    if (P.dir * (z - P.cam.z) <= 0) return;
    const s = z > MID ? -1 : 1;                                               // the banner faces into the pitch
    if (s * (P.cam.z - z) < 0) return;
    P.plane(z + s * -3, () => {
      [[x0 + 300, '#2E6A4A', 'COUNTY PARKS & REC'], [x0 + 1500, '#2F62A8', 'SOCCER FIELD 2'], [x0 + 2700, '#B83A3A', 'PLAY FAIR']].forEach(([x, col, str]) => {
        if (x + 1000 > x1) return;
        S(rectPts(x, -330, 1000, 150), { fill: col, lwPx: 1.2 });
        readable(P, x + 500, -255, () => text(str, 62, '#F6F6F0'));
      });
    });
  }

  // ---------- bleachers ----------
  const FAN_COL = ['#C0443F', '#2F62A8', '#E2A93B', '#4DA650', '#8A5CA8', '#F2EBDD', '#EE8A2C', '#3B2530'], SKIN = ['#F2C9A5', '#D9A278', '#B57A52', '#8A5A3A'];
  const PANTS = ['#3E5A86', '#2F3B52', '#B8A37A', '#3B3B40', '#6B7C8F'], HAIR = ['#3B2530', '#6A4A2E', '#B58A4A', '#20181C', '#9A9A9A'];
  // A seated spectator (a billboard facing the camera): seat at (x, y, z), feet on the footboard below.
  function fan(P, x, y, z, seed, t, cheer) {
    const [sx, sy, k0] = P.p(x, y, z); if (k0 < .025 || sx < -200 || sx > W + 200) return;
    const kid = hash(seed + 11) < .18, k = k0 * (kid ? .72 : .9 + hash(seed + 12) * .2), lw = px2(k0, 1.2), ol = { lwPx: lw };
    const sk = SKIN[Math.floor(hash(seed + 5) * SKIN.length)], sh = FAN_COL[Math.floor(hash(seed + 1) * FAN_COL.length)], pa = PANTS[Math.floor(hash(seed + 3) * PANTS.length)];
    const hairC = HAIR[Math.floor(hash(seed + 8) * HAIR.length)], style = Math.floor(hash(seed + 9) * 4);   // 0 short, 1 long, 2 cap, 3 bun
    const eager = hash(seed + 4), c = cheer * clamp(eager * 1.6 - .2) * Math.max(0, wob(t, 1.4 + hash(seed) * .9, hash(seed + 2)));
    const stand = cheer > .6 && eager > .75 ? cheer : 0, lift = (c * 10 + stand * 16) * k, by = sy - lift;
    const lean = wob(t, .11 + hash(seed + 6) * .05, hash(seed + 7)) * 2 * k;                                 // idle sway
    // legs in true 3D: thighs forward over the seat edge (+X, toward the pitch), shins down to the footboard of the row below
    const ks = kid ? .72 : 1, sc = k / k0, dz = sd => sd * 9 * sc;
    for (const sd of [-1, 1]) {
      const hip = [sx + sd * 9 * k, sy - 6 * k], kn = P.p(x + 40 * ks, y + 2 + stand * 30, z + dz(sd)), ft = P.p(x + (46 - stand * 10) * ks, y - 42 * ks + stand * 16, z + dz(sd));
      line([hip, [kn[0], kn[1]], [ft[0], ft[1]]], { stroke: pa, lwPx: 11 * k + 1, cap: 'round' });
      ellipse(ft[0] + 3 * k * Math.sign(ft[0] - sx || 1), ft[1], 8 * k, 4.5 * k, { fill: '#2A2A2E', stroke: null });
    }
    // torso
    const tx = sx + lean, tw = 20 * k, th = 50 * k;
    S([[tx - tw, by - 4 * k], [tx - tw * .95, by - th + 8 * k], [tx - tw * .6, by - th], [tx + tw * .6, by - th], [tx + tw * .95, by - th + 8 * k], [tx + tw, by - 4 * k]], { fill: sh, ...ol, smooth: .35 });
    // arms: resting on the knees, or up when cheering (some wave a scarf)
    const up = c > .15 || stand, arm = (sd, hand) => line([[tx + sd * tw * .85, by - th + 12 * k], hand], { stroke: sh, lwPx: 7 * k + 1, cap: 'round' });
    for (const sd of [-1, 1]) {
      const hand = up ? [tx + sd * (22 + 8 * c) * k, by - th - (26 + 14 * c) * k] : [sx + sd * 13 * k, sy + 2 * k];
      arm(sd, hand); circle(hand[0], hand[1], 4.5 * k, { fill: sk, stroke: null });
      if (up && sd > 0 && hash(seed + 13) < .3) {                                                           // scarf
        const w = wob(t, 2.2, hash(seed)) * 8 * k;
        S([[hand[0], hand[1]], [hand[0] + 34 * k, hand[1] - 6 * k + w], [hand[0] + 34 * k, hand[1] + 6 * k + w], [hand[0], hand[1] + 7 * k]], { fill: hash(seed + 14) < .5 ? '#2F62A8' : '#B83A3A', ...ol });
      }
    }
    // head and hair
    const hx = tx + lean * .5, hy = by - th - 13 * k, hr = 12.5 * k;
    if (style === 1) S([[hx - hr * 1.05, hy], [hx - hr * 1.1, hy + hr * 1.5], [hx + hr * 1.1, hy + hr * 1.5], [hx + hr * 1.05, hy]], { fill: hairC, stroke: null });
    circle(hx, hy, hr, { fill: sk, ...ol });
    if (style === 2) {
      const cap = hash(seed + 15) < .5 ? '#2F62A8' : '#B83A3A';
      S([[hx - hr * 1.02, hy - hr * .25], [hx - hr * .9, hy - hr * .9], [hx, hy - hr * 1.15], [hx + hr * .9, hy - hr * .9], [hx + hr * 1.02, hy - hr * .25]], { fill: cap, ...ol, smooth: .5 });
      ellipse(hx + hr * .35, hy - hr * .22, hr * .75, hr * .2, { fill: cap, ...ol });
    } else {
      ellipse(hx, hy - hr * .55, hr * 1.02, hr * .55, { fill: hairC, stroke: null });
      if (style === 3) circle(hx, hy - hr * 1.15, hr * .45, { fill: hairC, stroke: null });
    }
    if (k0 > .35) { circle(hx - hr * .35, hy + hr * .05, 1.4 * k, { fill: '#2A2A2E', stroke: null }); circle(hx + hr * .35, hy + hr * .05, 1.4 * k, { fill: '#2A2A2E', stroke: null }); }
  }
  function bleacherChunk(P, z0, z1, t, o) {
    const { xf, rows, rd, rise } = BL, top = n => 48 + rise * n, order = [...Array(rows).keys()];
    if (P.cam.x > xf) order.reverse();                                        // camera on the pitch side: back rows first
    const col = { top: C.alu, side: C.aluDk, nz: C.aluSh, pz: C.aluSh, bot: C.aluSh };
    for (const n of order) {
      const x0 = xf - rd * (n + 1), x1 = xf - rd * n;
      box(P, x0, x1, 0, top(n), z0, z1, col, { stroke: C.aluSh, lwPx: px(P, 1) });
      const l = P.line([[x1, top(n) - 30, z0], [x1, top(n) - 30, z1]]); if (l) line(l, { stroke: C.aluSh, lwPx: px(P, 1.6), alpha: .7 });
      const m = P.line([[(x0 + x1) / 2 + 8, top(n), z0], [(x0 + x1) / 2 + 8, top(n), z1]]); if (m) line(m, { stroke: C.aluSh, lwPx: px(P, 1.2), alpha: .6 });
      if (o.crowd > 0) {
        const seats = [];
        for (let z = z0 + 45; z < z1 - 20; z += 62) { const id = z * .13 + n * 7.31; if (hash(id) < o.crowd) seats.push([z + (hash(id + 1) - .5) * 20, id]); }
        seats.sort((a, b) => Math.abs(b[0] - P.cam.z) - Math.abs(a[0] - P.cam.z));                        // far fans first
        for (const [z, id] of seats) fan(P, x1 - 40, top(n), z, id, t, o.cheer);
      }
    }
    const bx = xf - rd * rows, yb = top(rows - 1);                            // back guard rail
    for (let z = z0; z <= z1 + 1; z += 190) pole(P, bx, yb, yb + 105, z, 4, C.aluSh);
    for (const dy of [105, 55]) { const l = P.line([[bx, yb + dy, z0], [bx, yb + dy, z1]]); if (l) line(l, { stroke: C.aluDk, lwPx: px(P, 3.5) }); }
  }

  // ---------- team shelters ----------
  function shelter(P, sh) {
    const x0 = 3000, x1 = 3440, z0 = sh.z0, z1 = sh.z1, hgt = 235;
    const glassCol = 'rgba(190,220,232,.28)', gl = pts => { const q = P.poly(pts); if (q) S(q, { fill: glassCol, stroke: C.steel, lwPx: px(P, 1.6) }); };
    gl([[x1, 0, z0], [x1, 0, z1], [x1, hgt, z1], [x1, hgt, z0]]);                                              // back panel
    for (const z of [z0, z1]) gl([[x0, 0, z], [x1, 0, z], [x1, hgt, z], [x0, hgt, z]]);                        // end panels
    box(P, 3290, 3400, 40, 50, z0 + 60, z1 - 60, { top: C.wood, nz: C.woodDk, pz: C.woodDk, side: C.woodDk }); // the bench
    box(P, 3390, 3400, 50, 100, z0 + 60, z1 - 60, { top: C.wood, nz: C.woodDk, pz: C.woodDk, side: C.wood });  // its back
    for (const z of [z0 + 120, z1 - 120]) box(P, 3330, 3350, 0, 40, z - 6, z + 6, C.steel);
    box(P, 3300, 3380, 0, 22, z0 + 250, z0 + 420, { top: mixCol(sh.col, '#ffffff', .3), nz: sh.col, pz: sh.col, side: mixCol(sh.col, '#000000', .2) }, { lwPx: px(P, .9) });   // kit bags
    box(P, 3310, 3370, 0, 18, z1 - 330, z1 - 200, { top: '#5A5A60', nz: '#3B3B40', pz: '#3B3B40', side: '#2F2F34' }, { lwPx: px(P, .9) });
    box(P, 3320, 3365, 50, 100, z0 + 70, z0 + 115, { top: '#F6F6F0', nz: '#EE7A2C', pz: '#EE7A2C', side: '#C9611E' }, { lwPx: px(P, .9) });   // water cooler on the bench
    for (const z of [z0, (z0 + z1) / 2, z1]) box(P, x0 - 4, x0 + 4, 0, hgt, z - 4, z + 4, C.steel);             // front posts
    box(P, x0 - 30, x1 + 20, hgt, hgt + 16, z0 - 30, z1 + 30, { top: mixCol(sh.col, '#ffffff', .2), nz: sh.col, pz: sh.col, side: mixCol(sh.col, '#000000', .2) });
  }

  // ---------- snack bar ----------
  function snackBar(P, t) {
    const b = SNACK, cx = { top: C.roof, nz: C.block, pz: C.blockDk, side: C.blockDk };
    box(P, b.x0, b.x1, 0, b.h, b.z0, b.z1, cx, { stroke: C.line });
    const band = P.poly([[b.x0 - .5, b.h - 60, b.z0], [b.x0 - .5, b.h - 60, b.z1], [b.x0 - .5, b.h - 20, b.z1], [b.x0 - .5, b.h - 20, b.z0]]);
    if (band && P.cam.x < b.x0) S(band, { fill: C.accent, stroke: null });
    box(P, b.x0 - 40, b.x1 + 40, b.h, b.h + 24, b.z0 - 40, b.z1 + 40, { top: mixCol(C.roof, '#ffffff', .15), nz: C.roofDk, pz: C.roofDk, side: C.roofDk });
    box(P, b.x0 + 200, b.x0 + 300, b.h + 24, b.h + 70, b.z0 + 300, b.z0 + 420, C.galv);                          // roof vent
    if (P.cam.x < b.x0) {                                                     // the serving window with its striped awning, on the pitch side
      const w0 = b.z0 + 420, w1 = b.z0 + 1020, x = b.x0 - .5;
      const win = P.poly([[x, 105, w0], [x, 105, w1], [x, 225, w1], [x, 225, w0]]); if (win) S(win, { fill: C.glass, lwPx: px(P, 2.5) });
      const sill = P.poly([[x, 100, w0 - 20], [x - 24, 100, w0 - 20], [x - 24, 100, w1 + 20], [x, 100, w1 + 20]]); if (sill) S(sill, { fill: C.wood, lwPx: px(P, 1.2) });
      for (let i = 0; i < 8; i++) {
        const za = lerp(w0 - 40, w1 + 40, i / 8), zb2 = lerp(w0 - 40, w1 + 40, (i + 1) / 8);
        const aw = P.poly([[x, 260, za], [x, 260, zb2], [x - 70, 205, zb2], [x - 70, 205, za]]); if (aw) S(aw, { fill: i % 2 ? C.awning2 : C.awning, lwPx: px(P, 1) });
      }
      const door = P.poly([[x, 0, b.z1 - 260], [x, 0, b.z1 - 110], [x, 205, b.z1 - 110], [x, 205, b.z1 - 260]]); if (door) S(door, { fill: C.door, lwPx: px(P, 2.5) });
    }
    if (P.cam.z < b.z0) P.plane(b.z0, k => {                                  // the street-side face: door, signs
      S(rectPts(b.x0 + 60, -250, 200, 250), { fill: C.door, lwPx: px2(k, 2.5) });
      circle(b.x0 + 160, -140, 6, { fill: '#DCC073', stroke: null });
      S(rectPts(b.x0 + 360, -300, 720, 80), { fill: C.accent, lwPx: px2(k, 1.6) });
      readable(P, b.x0 + 720, -260, () => text('SNACK BAR', 58, '#F6F6F0'));
      S(rectPts(b.x0 + 60, -290, 200, 34), { fill: '#F2EBDD', lwPx: px2(k, 1.2) });
      readable(P, b.x0 + 160, -273, () => text('RESTROOMS', 22, '#3D3237'));
      S(rectPts(b.x0 + 1180, -260, 140, 190), { fill: '#F2EBDD', lwPx: px2(k, 1.2) });                    // a schedule board
      for (let i = 0; i < 5; i++) line([[b.x0 + 1200, -235 + i * 34], [b.x0 + 1300 - (i % 2) * 30, -235 + i * 34]], { stroke: '#8A8478', lwPx: px2(k, 3) });
    });
  }
  function picnicTable(P, x, z) {
    const wd = { top: C.wood, nz: C.woodDk, pz: C.woodDk, side: C.woodDk };
    box(P, x - 90, x + 90, 72, 78, z - 40, z + 40, wd, { lwPx: px(P, .8) });
    for (const dz of [-70, 70]) box(P, x - 90, x + 90, 42, 47, z + dz - 14, z + dz + 14, wd, { lwPx: px(P, .8) });
    for (const dx of [-70, 70]) box(P, x + dx - 5, x + dx + 5, 0, 72, z - 60, z + 60, C.woodDk, { lwPx: px(P, .8) });
  }

  // ---------- scoreboard, light poles, small props ----------
  function scoreboard(P, t, o) {
    const { x, z } = BOARD, w = 760, y0 = 380, y1 = 720, frontSide = P.cam.z < z, [hs, gs] = o.score || [0, 0];
    const clock = o.clock == null ? null : typeof o.clock === 'number' ? `${Math.floor(o.clock / 60)}:${String(Math.floor(o.clock % 60)).padStart(2, '0')}` : String(o.clock);
    for (const dx of [-w / 2 + 60, w / 2 - 60]) box(P, x + dx - 14, x + dx + 14, 0, y0, z - 14, z + 14, C.steel);
    box(P, x - w / 2, x + w / 2, y0, y1, z - 18, z + 18, { top: C.roofDk, nz: '#26313A', pz: '#26313A', side: C.roofDk });
    if (frontSide) P.plane(z - 18, k => {
      S(rectPts(x - w / 2 + 14, -y1 + 14, w - 28, y1 - y0 - 28), { fill: '#1B242C', stroke: null });
      readable(P, x, -y1 + 52, () => text('COUNTY PARKS', 34, '#F2D27A'));
      if (clock) { S(rectPts(x - 80, -y1 + 150, 160, 76), { fill: '#10171D', stroke: '#3A4752', lwPx: px2(k, 2) }); readable(P, x, -y1 + 190, () => text(clock, 52, '#F2D27A')); }
      for (const [sx, lab, v] of [[-w / 4 - 30, o.home || 'HOME', hs], [w / 4 + 30, o.guest || 'GUEST', gs]]) {
        readable(P, x + sx, -y1 + 96, () => text(lab, 28, '#C9D6DE'));
        readable(P, x + sx, -y1 + 190, () => text(String(v), 118, '#FF5A3C'));
      }
    });
  }
  function lightPole(P, x, z, t) {
    const hgt = 1800, s = x > 0 ? -1 : 1;                                     // the lamp bank aims at the pitch
    box(P, x - 18, x + 18, 0, hgt, z - 18, z + 18, { top: C.galv, nz: C.galv, pz: C.aluDk, side: C.aluDk }, { lwPx: px(P, 1) });
    P.plane(z - 22, k => {
      S(rectPts(x - 190, -hgt - 230, 380, 250), { fill: '#3A444C', lwPx: px2(k, 1.6) });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) circle(x - 135 + c * 90, -hgt - 185 + r * 80, 27, { fill: '#FFF8D8', stroke: C.line, lwPx: px2(k, 1) });
    });
  }
  function cones(P) {
    [[-2500, 1900], [-2500, 2250], [-2500, 2600], [-2500, 2950]].forEach(([x, z]) => {
      const [sx, sy, k] = P.p(x, 0, z); if (k < .03) return;
      S([[sx - 16 * k, sy], [sx + 16 * k, sy], [sx + 4 * k, sy - 38 * k], [sx - 4 * k, sy - 38 * k]], { fill: C.cone, lwPx: px2(k, 1.2) });
      line([[sx - 11 * k, sy - 13 * k], [sx + 11 * k, sy - 13 * k]], { stroke: '#F6F6F0', lwPx: px2(k, 4) });
    });
  }
  function ballBag(P, x, z) {
    const [sx, sy, k] = P.p(x, 0, z); if (k < .03) return;
    ellipse(sx, sy - 22 * k, 34 * k, 24 * k, { fill: '#3F5F4A', lwPx: px2(k, 1.4) });
    for (const dx of [-14, 8, 22]) circle(sx + dx * k, sy - 40 * k, 13 * k, { fill: '#F6F6F0', lwPx: px2(k, 1.2) });
  }
  function bin(P, x, z) {
    const wd = { top: '#2C4636', nz: C.bin, pz: C.bin, side: '#31503E' };
    box(P, x - 30, x + 30, 0, 90, z - 30, z + 30, wd, { lwPx: px(P, 1) });
  }

  // ---------- parking lot: cars and the park sign ----------
  const CAR_COL = ['#C0443F', '#E8E6E0', '#3A3F46', '#4166B8', '#9AA3AB', '#2E6A4A', '#D9C27A', '#6E2A5A'];
  const CARS = (() => {
    const a = [];
    for (let i = 0; i < 20; i++) {
      const row = i % 2, slot = Math.floor(i / 2) * 2 + (hash(i * 4.1) < .5 ? 0 : 1), x = LOT.x0 + 290 + slot * 280;
      if (hash(i * 7.7 + 3) < .3 || x > LOT.x1 - 150) continue;
      a.push({ x, z: row ? LOT.z1 - 245 : LOT.z0 + 245, col: CAR_COL[Math.floor(hash(i * 2.9) * CAR_COL.length)], van: hash(i * 5.3) < .3, s: i });
    }
    return a;
  })();
  function car(P, c) {
    const { x, z } = c, hw = 84, L = 200, body = { top: mixCol(c.col, '#ffffff', .22), nz: c.col, pz: c.col, side: mixCol(c.col, '#000000', .15) }, lwp = { lwPx: px(P, 1) };
    const yb = 78, yr = c.van ? 170 : 138, zf = c.van ? z + 150 : z + 95, zr = c.van ? z - L + 20 : z - 115;   // roof from zr to zf; nose toward +Z
    const rf0 = c.van ? zr : z - 80, rf1 = c.van ? zf - 25 : z + 55, iw = hw - 12, gl = '#33434F', face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, ...lwp }); };
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(P, x + dx * 68 - 13, x + dx * 68 + 13, 0, 32, z + dz * 125 - 30, z + dz * 125 + 30, '#26262A', lwp);
    box(P, x - hw, x + hw, 16, yb, z - L, z + L, body, lwp);
    // the cabin: a prism with a slanted windshield (+Z) and rear window (−Z); only the faces turned to the camera
    const cab = [[zr, yb], [rf0, yr], [rf1, yr], [zf, yb]];
    for (const sd of [-1, 1]) if (sd * (P.cam.x - x) > iw) {
      face(cab.map(([zz, yy]) => [x + sd * iw, yy, zz]), body.side);
      face([[x + sd * iw, yb + 8, zr + 30], [x + sd * iw, yr - 10, rf0 + 12], [x + sd * iw, yr - 10, rf1 - 12], [x + sd * iw, yb + 8, zf - 30]], gl);
    }
    if (P.cam.z > zf || P.cam.y > yr) face([[x - iw, yb, zf], [x + iw, yb, zf], [x + iw, yr, rf1], [x - iw, yr, rf1]], gl);
    if (P.cam.z < zr || P.cam.y > yr) face([[x - iw, yb, zr], [x + iw, yb, zr], [x + iw, yr, rf0], [x - iw, yr, rf0]], gl);
    if (P.cam.y > yr) face([[x - iw, yr, rf0], [x + iw, yr, rf0], [x + iw, yr, rf1], [x - iw, yr, rf1]], body.top);
    for (const dz of [-1, 1]) {                                               // headlights toward the pitch (+Z), tail lights toward the trees
      const lz = z + dz * L; if (dz > 0 ? P.cam.z <= lz : P.cam.z >= lz) continue;
      for (const sd of [-1, 1]) face([[x + sd * 50, 50, lz], [x + sd * 74, 50, lz], [x + sd * 74, 66, lz], [x + sd * 50, 66, lz]], dz > 0 ? '#F4EFD6' : '#B8302B');
    }
  }
  function parkSign(P, x, z) {
    for (const dx of [-200, 200]) box(P, x + dx - 10, x + dx + 10, 0, 260, z - 10, z + 10, C.woodDk, { lwPx: px(P, 1) });
    box(P, x - 260, x + 260, 110, 250, z - 8, z + 8, { top: C.wood, nz: '#2E5A3E', pz: '#2E5A3E', side: C.woodDk }, { lwPx: px(P, 1.2) });
    const side = P.cam.z > z ? z + 8.5 : P.cam.z < z ? z - 8.5 : null; if (side == null) return;
    P.plane(side, k => {
      S(rectPts(x - 244, -244, 488, 128), { fill: null, stroke: '#E9DFC4', lwPx: px2(k, 3) });
      readable(P, x, -206, () => text('COUNTY PARK', 46, '#F2EBDD'));
      readable(P, x, -150, () => text('SOCCER FIELDS · PICNIC AREA', 22, '#E9DFC4'));
    });
  }

  const LIGHTS = [[-4700, 1500], [-4700, 7500], [3800, 1500], [3800, 7500]];

  // ---------- trees ----------
  function tree(P, x, z, h, t, seed, wind) {
    const [sx] = P.p(x, 0, z); if (sx < -500 || sx > W + 500) return;
    const a = hazeK(P, z), cT = hz(C.trunk, a), cL = hz(C.leaf, a), cM = hz(C.leafMid, a), cH = hz(C.leafLt, a), cO = hz(C.line, a * .8);
    P.plane(z, k => {
      const sw = wob(t, .16 + hash(seed) * .08, hash(seed + 1)) * h * .012 * wind;
      S([[x - h * .03, 0], [x + h * .03, 0], [x + h * .02 + sw * .5, -h * .52], [x - h * .02 + sw * .5, -h * .52]], { fill: cT, stroke: cO, lwPx: px2(k, 1.6) });
      const cy = -h * .7, r = h * .27, blobs = [];
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + hash(seed + i) * .6, d = r * (.45 + .25 * hash(seed + i * 3)); blobs.push([x + sw + Math.cos(a) * d, cy + Math.sin(a) * d * .9, r * (.48 + .18 * hash(seed + i * 7))]); }
      blobs.push([x + sw, cy, r * .7]);
      blobs.forEach(([bx, by, br]) => circle(bx, by, br, { fill: cL, stroke: cO, lwPx: px2(k, 1.4) }));
      blobs.forEach(([bx, by, br]) => circle(bx, by, br * .96, { fill: cL, stroke: null }));
      blobs.forEach(([bx, by, br]) => { if (by < cy + r * .2) circle(bx - br * .18, by - br * .2, br * .62, { fill: cM, stroke: null }); });
      blobs.forEach(([bx, by, br]) => { if (by < cy - r * .1 && bx < x + sw + r * .3) circle(bx - br * .3, by - br * .35, br * .28, { fill: cH, stroke: null }); });
    });
  }
  const TREES = (() => {
    const a = [];
    for (let i = 0; i < 64; i++) a.push({ x: -13000 + i * 410 + (hash(i * 2.3) - .5) * 300, z: -2600 - hash(i * 5.7) * 3200, h: 900 + hash(i * 1.9) * 800 });          // behind the south end
    for (let i = 0; i < 64; i++) a.push({ x: -13000 + i * 410 + (hash(i * 3.3 + 40) - .5) * 300, z: 12200 + hash(i * 4.7) * 3200, h: 900 + hash(i * 2.9) * 800 });   // behind the north end
    for (let i = 0; i < 22; i++) for (const sd of [-1, 1]) a.push({ x: sd * (7600 + hash(i * 6.1 + sd) * 3200), z: -1500 + i * 560 + (hash(i * 8.3 + sd) - .5) * 300, h: 800 + hash(i * 3.3 + sd) * 800 });  // beside the pitch
    return a.map((t, i) => ({ ...t, s: i }));
  })();

  // ---------- items: depth sorted by far edge, split into back / front by splitZ ----------
  function items(P, t, o) {
    const L = [], wind = o.wind ?? 1, add = (za, zb, draw, pri = 0) => L.push({ za, zb, draw, pri });
    TREES.forEach(tr => { if (!(P.cam.y > tr.h && P.depth(tr.z) < 1600)) add(tr.z, tr.z, () => tree(P, tr.x, tr.z, tr.h, t, tr.s, wind)); });   // no canopy blob right under an aerial camera
    for (const row of [LOT.z0 + 245, LOT.z1 - 245]) add(row - 210, row + 210, () => CARS.filter(c => c.z === row).sort((a, b) => Math.abs(b.x - P.cam.x) - Math.abs(a.x - P.cam.x)).forEach(c => car(P, c)));
    add(LOT.z1 + 150, LOT.z1 + 150, () => parkSign(P, -2600, LOT.z1 + 150), 1);
    add(BOARD.z, BOARD.z, () => scoreboard(P, t, o), 1);
    for (const e of ENDS) { for (let x = -FX; x < FX; x += 1750) add(e, e, () => endFence(P, e, x, Math.min(x + 1750, FX))); add(e, e, () => banners(P, e, -FX, FX), 1); }
    for (let z = ENDS[0]; z < ENDS[1]; z += 1000) for (const sd of [-1, 1]) add(z, z + 1000, () => sideBarrier(P, sd * FX, z, Math.min(z + 1000, ENDS[1])));
    for (const [z0, z1] of BL.secs) for (let z = z0; z < z1 - 1; z += 600) add(z, Math.min(z + 600, z1), () => bleacherChunk(P, z, Math.min(z + 600, z1), t, o));
    SHELTERS.forEach(sh => add(sh.z0 - 30, sh.z1 + 30, () => shelter(P, sh), 1));
    add(SNACK.z0 - 40, SNACK.z1 + 40, () => snackBar(P, t), 0);
    add(4150, 4250, () => picnicTable(P, 4050, 1300), 1);
    add(1300, 1300, () => picnicTable(P, 3950, 1350), 1);
    for (const [x, z] of LIGHTS) add(z, z, () => lightPole(P, x, z, t), 0);
    add(-ND, 0, () => goal(P, 0, 1), 2);
    add(LEN, LEN + ND, () => goal(P, LEN, -1), 2);
    for (const sx of [-1, 1]) for (const e of [0, LEN]) add(e, e, () => cornerFlag(P, sx * HW, e, t, wind), 1);
    add(1900, 2950, () => cones(P), 1);
    add(2600, 2600, () => ballBag(P, -3000, 3800), 1);
    add(3900, 3900, () => bin(P, -3350, 3900), 1);
    add(5100, 5100, () => bin(P, 3300, 4500), 1);
    for (const it of L) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return L.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  const withDefaults = o => ({ crowd: .3, cheer: 0, ...o });
  return {
    MARK: { x: 0, z: 1800 }, LEN, HW, MID, GW, GH, FX, ENDS, BL,
    back(P, t, o = {}) {
      o = withDefaults(o);
      X.fillStyle = linGrad(0, P.cam.hy - 1400, 0, P.cam.hy, [[0, C.sky], [1, C.skyLo]]); X.fillRect(0, 0, W, H);
      clouds(P, t); hills(P); ground(P, t);
      const d = !Number.isFinite(o.splitZ) ? -Infinity : P.depth(o.splitZ);             // ±Infinity / unset = draw everything
      for (const it of items(P, t, o)) if (it.key > d) it.draw();
    },
    front(P, t, o = {}) {
      o = withDefaults(o);
      if (!Number.isFinite(o.splitZ)) return;
      const d = P.depth(o.splitZ), stop = o.toZ == null ? -Infinity : P.depth(o.toZ);
      for (const it of items(P, t, o)) if (it.key <= d && it.key > stop) it.draw();
    },
  };
})();

// Registration for the studio's location browser: named spots + camera presets (paste-ready for scene code).
// dir: 1 looks up the pitch toward the north goal; dir: -1 looks back toward the south goal.
LOCATIONS.soccer_field = Object.assign(soccerField, {
  spots: {
    'Edge of the box': { x: 0, y: 0, z: 1800 },
    'Centre spot': { x: 0, y: 0, z: 4500 },
    'Penalty spot (south)': { x: 0, y: 0, z: 1100 },
    'Penalty spot (north)': { x: 0, y: 0, z: 7900 },
    'Goalkeeper (south goal)': { x: 0, y: 0, z: 90 },
    'Goalkeeper (north goal)': { x: 0, y: 0, z: 8910 },
    'Corner flag (south right)': { x: 2650, y: 0, z: 100 },
    'Touchline, halfway': { x: 2650, y: 0, z: 4500 },
    'Home bench': { x: 3230, y: 50, z: 3350 },
    'Away bench': { x: 3230, y: 50, z: 5650 },
    'Bleachers · row 2': { x: -4074, y: 94, z: 3000 },
    'Snack bar window': { x: 4200, y: 0, z: 1930 },
    'Behind the south goal': { x: 0, y: 0, z: -450 },
  },
  cameras: {
    'Behind south goal · down the pitch': { x: 0, y: 150, z: -520, f: 900, hy: 560, dir: 1 },
    'Low · grass level': { x: 250, y: 30, z: -450, f: 900, hy: 650, dir: 1 },
    'Keeper\'s view': { x: 0, y: 160, z: 150, f: 1000, hy: 540, dir: 1 },
    'Penalty kick': { x: 0, y: 130, z: 1500, f: 1300, hy: 600, dir: -1 },
    'Striker\'s shoulder': { x: -350, y: 170, z: 2300, f: 1000, hy: 560, dir: -1 },
    'Midfield · centre circle': { x: 0, y: 150, z: 3300, f: 1000, hy: 570, dir: 1 },
    'Midfield · reverse': { x: 0, y: 150, z: 5700, f: 1000, hy: 570, dir: -1 },
    'Corner kick': { x: 2100, y: 120, z: -650, f: 1000, hy: 600, dir: 1 },
    'Touchline · bench side': { x: 3050, y: 150, z: 1600, f: 900, hy: 540, dir: 1 },
    'Stands · along the bleachers': { x: -3620, y: 210, z: 1350, f: 900, hy: 540, dir: 1 },
    'Stands · from the far touchline': { x: 2900, y: 260, z: 6900, f: 1000, hy: 520, dir: -1 },
    'Scoreboard end': { x: 700, y: 170, z: 7300, f: 1000, hy: 470, dir: 1 },
    'Behind north goal · reverse': { x: 0, y: 150, z: 9520, f: 900, hy: 560, dir: -1 },
    'Aerial · behind goal': { x: 0, y: 2800, z: -3400, f: 900, hy: 60, dir: 1 },
    'Aerial · reverse': { x: 0, y: 2400, z: 10300, f: 850, hy: -150, dir: -1 },
    'Aerial · high overhead': { x: 0, y: 9000, z: -6000, f: 800, hy: -150, dir: 1 },
  },
});
