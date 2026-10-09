// locations/house/house.js: a two-storey red-brick family house seen across its front lawn (see reference_front.jpg, README.md).
//
// An outdoor 3D set in one-point perspective (engine/persp.js). World units: a person is ~170 tall (1 unit ≈ 1 cm).
//   house.back(P, t, o)    sky, lawn, the house and everything farther than o.splitZ (default: everything). Call first.
//   house.front(P, t, o)   props nearer than o.splitZ (bushes, clover, flowers, grass tufts). Call after the characters.
// o: { splitZ, night (0..1: a starry night sky and moon, the set tinted night-blue, lit windows, door and lantern glowing),
//      wind (0..2, default 1: tree, bush and flower sway), season ('summer' default | 'autumn': orange, red and gold
//      trees, a warmer lawn, fallen leaves on the grass and leaves drifting down in front of everything) }
//
// Layout (world): the main block's facade is the plane Z = 3000, X −760…380, eaves Y 560, side-gabled roof with its ridge
// at Y 850, Z 3450. A cream-sided cross gable (X −460…220, peak X −120) sits over the porch. Brick chimney on the left end
// (X −880…−760). Front porch X −480…260, Z 2700–3000, four columns, roof Y 300 → 380. The right wing (X 380…1150) steps
// forward to Z 2880 with its gable to the street (eaves Y 300, ridge Y 720). Mulch beds and shrubs along the front;
// garden walk Z 2600–2680 from the porch steps to the right; lawn from there to the camera. Stage mark X 0, Z 2000.

const house = (() => {
  const FZ = 3000, X0 = -760, X1 = 380, EAVE = 560, RIDGE = 930, RZ = 3420, BZ = 3900;   // main block
  const XG0 = -460, XG1 = 220, XGM = -120, GZ = 2985;                                       // cross gable
  const WG = { x0: 380, x1: 1150, z0: 2880, z1: 3900, he: 300, hr: 720 };                    // right wing
  const PO = { x0: -480, x1: 260, z0: 2700, y0: 300, y1: 380, cols: [-440, -220, 20, 225] };  // porch
  const WALK = [2600, 2680], OH = 40;
  const C = {
    sky: '#4D93D9', skyLo: '#BFE0F4', cloud: '#FFFFFF', cloudSh: '#DCE7F3',
    grass: '#7DB443', grassLt: '#A8CF62', grassDk: '#5E9A30', blade: '#4F8A28', bladeLt: '#B6DA6C',
    clover: '#3E8B3A', cloverLt: '#69AE52', bloom: '#C0569A', bloomLt: '#E58CC3', mulch: '#8A4A34', mulchDk: '#6E3828',
    brick: '#B4553F', brickDk: '#93412F', brickLt: '#C96B52', brickSide: '#9C4734', mortar: '#D9B8A3',
    trim: '#EFE6D2', trimDk: '#CFC3A8', siding: '#E3D4B2', sidingDk: '#C7B58F',
    roof: '#655B55', roofLt: '#7D7169', roofDk: '#463E3A',
    shutter: '#2E3038', shutterLt: '#454852', glass: '#2E3D4A', glassLt: '#7E97A8', curtain: '#F3EEE4',
    door: '#F2EEE6', conc: '#D9D3C6', concDk: '#BDB5A5',
    leaf: '#3F8A3A', leafMid: '#5AA544', leafLt: '#86C25A', trunk: '#6B4E3A',
    shrub: '#3C7F35', shrubLt: '#62A44B', lime: '#9CC24A', limeLt: '#C8E07A', limeDk: '#6E9A33',
    red: '#8E2A33', redLt: '#B84A4F',
    line: '#3D2E30',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  let LIT = null;                                                       // at night: lit windows / lamps to glow after the tint
  const lit = (x, y, w, h, kind = 'win') => { if (LIT) LIT.push({ m: X.getTransform(), x, y, w, h, kind }); };
  const px2 = (k, w) => clamp(w * k, .8, 7);
  const lwAt = (P, z, w) => clamp(w * P.k(z), .8, 9);

  // ---------- brick: flat colour plus a coursed pattern that fades in as the wall gets close ----------
  const _brick = new WeakMap();
  function brickPattern() {
    if (_brick.has(X)) return _brick.get(X);
    const s = 4, bw = 22, bh = 7.5, cols = 10, rows = 12, cv = document.createElement('canvas');
    cv.width = cols * bw * s; cv.height = rows * bh * s;
    const g = cv.getContext('2d'); g.fillStyle = C.mortar; g.fillRect(0, 0, cv.width, cv.height);
    for (let r = 0; r < rows; r++) for (let c = -1; c <= cols; c++) {
      g.fillStyle = mixCol(C.brickDk, C.brickLt, .1 + .8 * hash(r * 13.7 + c * 7.3 + 11));
      g.fillRect((c * bw + (r % 2 ? bw / 2 : 0) + .7) * s, (r * bh + .7) * s, (bw - 1.4) * s, (bh - 1.4) * s);
    }
    const pat = X.createPattern(cv, 'repeat'); pat.setTransform(new DOMMatrix().scale(1 / s));
    _brick.set(X, pat); return pat;
  }
  function brick(pts, k, fill = C.brick) {
    S(pts, { fill, stroke: null });
    const a = clamp((k - .15) / .4) * .9;
    if (a > .01) S(pts, { fill: brickPattern(), stroke: null, alpha: a });
  }

  // An axis-aligned box: only the faces turned toward the camera. col: { front, side, top }
  function box(P, x0, x1, y0, y1, z0, z1, col) {
    const c = P.cam;
    if (c.y > y1) S(P.poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]), { fill: col.top });
    if (c.x < x0) S(P.poly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]), { fill: col.side });
    if (c.x > x1) S(P.poly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]), { fill: col.side });
    if (c.z < z0) P.plane(z0, k => { if (col.brick) brick(rectPts(x0, -y1, x1 - x0, y1 - y0), k, col.front); S(rectPts(x0, -y1, x1 - x0, y1 - y0), { fill: col.brick ? null : col.front }); });
  }

  // ---------- facade pieces (plane units: x = X, y = −Y) ----------
  // Double-hung window, six over six, with lace curtains, a soldier-course lintel and optional black louvred shutters.
  function win(x, sill, w, h, k, shutters = true) {
    const y0 = -sill, y1 = -sill - h, lw = px2(k, 3);
    S(rectPts(x - w / 2 - 6, y1 - 20, w + 12, 20), { fill: C.brickDk, lwPx: px2(k, 1) });          // lintel
    for (let i = 1; i < 8; i++) line([[x - w / 2 - 6 + i * (w + 12) / 8, y1 - 20], [x - w / 2 - 6 + i * (w + 12) / 8, y1]], { stroke: C.mortar, lwPx: px2(k, 1), alpha: .7 });
    S(rectPts(x - w / 2, y1, w, h), { fill: C.trim, lwPx: px2(k, 1.4) });
    const gx = x - w / 2 + 7, gw = w - 14, gy = y1 + 7, gh = h - 14;
    S(rectPts(gx, gy, gw, gh), { fill: LIT ? linGrad(0, gy, 0, gy + gh, [[0, '#FFE6A6'], [1, '#F2A84A']]) : linGrad(0, gy, 0, gy + gh, [[0, C.glassLt], [.35, C.glass], [1, '#1F2A33']]), stroke: null });
    lit(gx, gy, gw, gh);
    for (const sd of [-1, 1]) {                                                                       // curtains
      const cx = sd < 0 ? gx : gx + gw, cw = gw * .3 * sd;
      S([[cx, gy], [cx + cw, gy], [cx + cw * .55, gy + gh * .45], [cx + cw * .8, gy + gh], [cx, gy + gh]], { fill: C.curtain, stroke: null, alpha: .9, smooth: true });
    }
    X.save(); X.globalAlpha = .22; S([[gx, gy + gh * .5], [gx, gy], [gx + gw * .45, gy]], { fill: '#FFFFFF', stroke: null }); X.restore();
    line([[gx, gy + gh / 2], [gx + gw, gy + gh / 2]], { stroke: C.trim, lwPx: lw * 1.6 });             // meeting rail
    for (const f of [1 / 3, 2 / 3]) line([[gx + gw * f, gy], [gx + gw * f, gy + gh]], { stroke: C.trim, lwPx: lw });
    for (const f of [.25, .75]) line([[gx, gy + gh * f], [gx + gw, gy + gh * f]], { stroke: C.trim, lwPx: lw });
    S(rectPts(x - w / 2 - 10, y0, w + 20, 10), { fill: C.trim, lwPx: px2(k, 1) });                   // sill
    if (shutters) for (const sd of [-1, 1]) {
      const sw = w * .44, sx = sd < 0 ? x - w / 2 - 8 - sw : x + w / 2 + 8;
      S(rectPts(sx, y1 - 2, sw, h + 4), { fill: C.shutter, lwPx: px2(k, 1.2) });
      for (let yy = y1 + 10; yy < y0 - 6; yy += 11) line([[sx + 5, yy], [sx + sw - 5, yy]], { stroke: C.shutterLt, lwPx: px2(k, 2) });
      line([[sx + 3, y1 + h / 2], [sx + sw - 3, y1 + h / 2]], { stroke: '#1C1E24', lwPx: px2(k, 3) });
    }
  }
  function frontDoor(x, k, t) {
    const w = 100, h = 215, y1 = -h - 25;
    S(rectPts(x - w / 2 - 50, y1 - 26, w + 100, h + 26), { fill: C.trim, lwPx: px2(k, 1.4) });       // surround with sidelights
    S(rectPts(x - w / 2 - 60, y1 - 38, w + 120, 14), { fill: C.trim, lwPx: px2(k, 1.2) });
    for (const sd of [-1, 1]) { const sx = x + sd * (w / 2 + 25); S(rectPts(sx - 15, y1 + 10, 30, h - 30), { fill: linGrad(0, y1, 0, -25, [[0, C.glassLt], [1, C.glass]]), lwPx: px2(k, 1) }); }
    S(rectPts(x - w / 2, y1, w, h), { fill: C.door, lwPx: px2(k, 1.4) });
    S(rectPts(x - w / 2 + 12, y1 + 12, w - 24, h * .55), { fill: LIT ? '#F7C46A' : linGrad(0, y1, 0, y1 + h * .55, [[0, C.glassLt], [1, C.glass]]), lwPx: px2(k, 1) });
    lit(x - w / 2 + 12, y1 + 12, w - 24, h * .55);
    for (const f of [1 / 3, 2 / 3]) line([[x - w / 2 + 12 + (w - 24) * f, y1 + 12], [x - w / 2 + 12 + (w - 24) * f, y1 + 12 + h * .55]], { stroke: C.door, lwPx: px2(k, 3) });
    line([[x - w / 2 + 12, y1 + 12 + h * .275], [x + w / 2 - 12, y1 + 12 + h * .275]], { stroke: C.door, lwPx: px2(k, 3) });
    for (const yy of [y1 + h * .7, y1 + h * .86]) S(rectPts(x - w / 2 + 14, yy, w - 28, h * .12), { fill: null, stroke: C.trimDk, lwPx: px2(k, 1) });
    circle(x + w / 2 - 14, y1 + h * .6, 5, { fill: '#C9A445', stroke: C.line, lwPx: px2(k, .8) });
    S(rectPts(x - 26, -25 - h * .62, 52, 14), { fill: '#B9B2A4', stroke: null, alpha: .5 });          // mail slot
    lantern(x - w / 2 - 80, y1 + 40, k, t);
  }
  function lantern(x, y, k, t) {
    S(rectPts(x - 4, y - 8, 8, 14), { fill: C.shutter, stroke: null });
    S([[x - 14, y + 6], [x + 14, y + 6], [x + 11, y + 42], [x - 11, y + 42]], { fill: LIT ? '#FFF1B8' : '#F4D98A', lwPx: px2(k, 1) });
    lit(x - 14, y + 6, 28, 36, 'lamp');
    S([[x - 18, y + 6], [x, y - 6], [x + 18, y + 6]], { fill: C.shutter, lwPx: px2(k, 1) });
    S(rectPts(x - 13, y + 42, 26, 5), { fill: C.shutter, stroke: null });
  }
  function rakeBand(xa, ye, xm, yr, xb, d = 46) {                          // fascia + soffit under a gable's rake boards
    S([[xa, -ye], [xm, -yr], [xb, -ye], [xb, -ye + d * .5], [xm, -yr + d], [xa, -ye + d * .5]], { fill: C.trim, stroke: null });
  }
  function eaveShadow(x0, x1, y, depth = 60) { S(rectPts(x0, -y, x1 - x0, depth), { fill: linGrad(0, -y, 0, -y + depth, [[0, 'rgba(40,20,20,.35)'], [1, 'rgba(40,20,20,0)']]), stroke: null }); }

  // ---------- roofs ----------
  // Shingle courses: lines along the slope at constant height (u runs eave → ridge).
  function courses(P, a, b, c, d, n, col, alpha = .4) {        // a,b: eave ends; d,c: ridge ends
    X.save(); X.globalAlpha = alpha;
    for (let i = 1; i < n; i++) { const u = i / n, l = P.line([a.map((v, j) => lerp(v, d[j], u)), b.map((v, j) => lerp(v, c[j], u))]); if (l) line(l, { stroke: col, lwPx: .9 }); }
    X.restore();
  }
  function slope(P, a, b, c, d, fill, n) { const q = P.poly([a, b, c, d]); if (!q) return; S(q, { fill }); courses(P, a, b, c, d, n, C.roofDk); }
  function edge(P, pts, z, w = 16) {                              // dark shingle edge over a cream fascia
    const l = P.line(pts), f = P.line(pts.map(([x, y, zz]) => [x, y - 14, zz])); if (!l) return;
    if (f) line(f, { stroke: C.trim, lwPx: lwAt(P, z, w * .7) });
    line(l, { stroke: C.line, lwPx: lwAt(P, z, w) + 1.5 }); line(l, { stroke: C.roofDk, lwPx: lwAt(P, z, w) });
  }

  // ---------- the main block ----------
  function mainBlock(P, t) {
    const c = P.cam, ez = FZ - OH, xl = X0 - OH, xr = X1 + OH;
    if (c.y > RIDGE) slope(P, [xl, EAVE, BZ + OH], [xr, EAVE, BZ + OH], [xr, RIDGE, RZ], [xl, RIDGE, RZ], C.roofDk, 8);
    if (c.x < X0) {                                                                       // left end: brick wall + gable
      const q = P.poly([[X0, 0, FZ], [X0, 0, BZ], [X0, EAVE, BZ], [X0, RIDGE, RZ], [X0, EAVE, FZ]]); if (q) S(q, { fill: C.brickSide });
      for (const z of [3250, 3650]) { const w = P.poly([[X0, 330, z - 50], [X0, 330, z + 50], [X0, 500, z + 50], [X0, 500, z - 50]]); if (w) S(w, { fill: C.glass, stroke: C.trim, lwPx: 2 }); }
    }
    P.plane(FZ, k => {
      const wall = rectPts(X0, -EAVE, X1 - X0, EAVE);
      brick(wall, k); S(wall, { fill: null });
      eaveShadow(X0, X1, EAVE);
      [[-560, true], [-320, false], [-100, true], [110, false], [280, false]].forEach(([x, sh]) => win(x, 335, 100, 170, k, sh));
      win(-590, 95, 105, 175, k, true); win(130, 95, 100, 170, k, false); win(320, 95, 80, 170, k, true);
      frontDoor(-90, k, t);
      line([[X0, -24], [X1, -24]], { stroke: C.brickDk, lwPx: px2(k, 3) });                // water table
      const dx = X1 - 22; S(rectPts(dx - 8, -EAVE + 4, 16, EAVE - 10), { fill: C.trim, lwPx: px2(k, 1) });   // downspout
      S([[dx - 8, -6], [dx + 8, -6], [dx + 22, 0], [dx - 14, 0]], { fill: C.trim, lwPx: px2(k, 1) });
    });
    slope(P, [xl, EAVE, ez], [xr, EAVE, ez], [xr, RIDGE, RZ], [xl, RIDGE, RZ], C.roof, 9);    // front slope
    edge(P, [[xl, EAVE, ez], [xl, RIDGE, RZ], [xl, EAVE, BZ + OH]], RZ);
    edge(P, [[xl, EAVE, ez], [xr, EAVE, ez]], ez, 10);
    // cross gable: cream siding pediment, round vent, cornice; its two roof slopes run back to the main ridge
    const GP = RIDGE + 20, GE = EAVE + 10;
    for (const [xe, fill] of [[XG0 - OH, C.roofLt], [XG1 + OH, C.roof]]) {
      const a = [xe, GE, GZ - OH], b = [XGM, GP, GZ - OH], d = [XGM, GP, RZ];
      const q = P.poly([a, b, d]); if (q) { S(q, { fill }); courses(P, a, b, b, d, 1, C.roofDk); }
      X.save(); X.globalAlpha = .35; for (let i = 1; i < 7; i++) { const u = i / 7, l = P.line([[lerp(xe, XGM, u), lerp(GE, GP, u), GZ - OH], [lerp(xe, XGM, u), lerp(GE, GP, u), lerp(GZ - OH, RZ, u)]]); if (l) line(l, { stroke: C.roofDk, lwPx: .9 }); } X.restore();
    }
    P.plane(GZ, k => {
      const ped = [[XG0, -EAVE - 34], [XG1, -EAVE - 34], [XGM, -GP + 6]];
      S(ped, { fill: C.siding });
      X.save(); tracePath(ped, true); X.clip();
      for (let y = -EAVE - 34; y > -GP; y -= 16) { line([[XG0, y], [XG1, y]], { stroke: C.sidingDk, lwPx: px2(k, 1.6) }); line([[XG0, y - 3], [XG1, y - 3]], { stroke: '#F1E7CF', lwPx: px2(k, 1), alpha: .7 }); }
      X.restore();
      S(ped, { fill: null });
      const vy = -EAVE - 34 - (GP - EAVE - 34) * .45;                                              // round gable vent
      circle(XGM, vy, 38, { fill: C.trim, lwPx: px2(k, 1.4) });
      circle(XGM, vy, 28, { fill: '#D8CCB2', lwPx: px2(k, 1) });
      for (let i = -2; i <= 2; i++) { const hw = 26 * Math.cos(Math.asin(i / 2.7)); line([[XGM - hw, vy + i * 10], [XGM + hw, vy + i * 10]], { stroke: C.sidingDk, lwPx: px2(k, 2.4) }); }
      S(rectPts(XG0 - 12, -EAVE - 36, XG1 - XG0 + 24, 26), { fill: C.trim, lwPx: px2(k, 1.2) });       // cornice
      S(rectPts(XG0 - 20, -EAVE - 10, XG1 - XG0 + 40, 12), { fill: C.trimDk, lwPx: px2(k, 1) });
    });
    P.plane(GZ - 6, k => rakeBand(XG0 - OH, GE, XGM, GP, XG1 + OH));
    edge(P, [[XG0 - OH, GE, GZ - 6], [XGM, GP, GZ - 6], [XG1 + OH, GE, GZ - 6]], GZ, 18);
    chimney(P);
  }
  function chimney(P) {
    const B = { front: C.brick, side: C.brickSide, top: C.mortar, brick: true };
    box(P, -885, -755, 0, 520, 3060, 3240, B);
    const sh = P.poly([[-885, 520, 3060], [-755, 520, 3060], [-775, 600, 3060], [-865, 600, 3060]]); if (sh) S(sh, { fill: C.brickDk });
    box(P, -865, -775, 600, 1000, 3070, 3230, B);
    box(P, -880, -760, 1000, 1030, 3055, 3245, { front: C.brickDk, side: '#7A3426', top: '#5A2A20' });
  }

  // ---------- the right wing: brick gable to the street ----------
  function wing(P, t) {
    const c = P.cam, w = WG, xm = (w.x0 + w.x1) / 2, zf = w.z0 - OH, zb = w.z1;
    for (const [sx, vis] of [[w.x0, c.x < w.x0], [w.x1, c.x > w.x1]]) if (vis) {
      const q = P.poly([[sx, 0, w.z0], [sx, 0, zb], [sx, w.he, zb], [sx, w.he, w.z0]]); if (q) S(q, { fill: C.brickSide });
      if (sx === w.x1) for (const z of [3300, 3650]) { const g = P.poly([[sx, 90, z - 50], [sx, 90, z + 50], [sx, 260, z + 50], [sx, 260, z - 50]]); if (g) S(g, { fill: C.glass, stroke: C.trim, lwPx: 2 }); }
    }
    for (const sd of [-1, 1]) {
      const xe = sd < 0 ? w.x0 - OH : w.x1 + OH, ye = w.he - 12, above = c.y > ye + (w.hr + 12 - ye) * (c.x - xe) / (xm - xe);
      if (above) slope(P, [xe, ye, zf], [xe, ye, zb], [xm, w.hr + 12, zb], [xm, w.hr + 12, zf], sd < 0 ? C.roofLt : C.roof, 8);
    }
    P.plane(w.z0, k => {
      const pent = [[w.x0, 0], [w.x1, 0], [w.x1, -w.he], [xm, -w.hr], [w.x0, -w.he]];
      brick(pent, k); S(pent, { fill: null });
      eaveShadow(w.x0, w.x1, w.he, 40);
      win(715, 95, 100, 175, k); win(985, 95, 100, 175, k); win(xm + 30, 390, 85, 150, k);
      const vy = -(w.hr - 70); S([[xm + 30 - 22, vy + 14], [xm + 30, vy - 8], [xm + 30 + 22, vy + 14]], { fill: C.trim, lwPx: px2(k, 1) });
      line([[w.x0, -24], [w.x1, -24]], { stroke: C.brickDk, lwPx: px2(k, 3) });
      S(rectPts(w.x0 + 14, -w.he + 4, 16, w.he - 10), { fill: C.trim, lwPx: px2(k, 1) });             // downspout
    });
    const zr = w.z0 - 6;                                                                    // rake boards flush with the gable
    P.plane(zr, k => rakeBand(w.x0 - OH, w.he - 12, xm, w.hr + 12, w.x1 + OH));
    edge(P, [[w.x0 - OH, w.he - 12, zr], [xm, w.hr + 12, zr], [w.x1 + OH, w.he - 12, zr]], zr, 18);
  }

  // ---------- the porch ----------
  function porch(P, t) {
    const c = P.cam, p = PO, zf = p.z0, ze = zf - 20;
    const fl = P.poly([[p.x0, 25, zf], [p.x1, 25, zf], [p.x1, 25, FZ], [p.x0, 25, FZ]]); if (fl && c.y > 25) S(fl, { fill: C.conc });
    box(P, p.x0, p.x1, 0, 25, zf, FZ, { front: C.concDk, side: C.concDk, top: C.conc });
    box(P, -170, 0, 0, 13, zf - 45, zf, { front: C.concDk, side: C.concDk, top: C.conc });          // step
    if (c.y < p.y0) { const q = P.poly([[p.x0, p.y0, ze], [p.x1, p.y0, ze], [p.x1, p.y0, FZ], [p.x0, p.y0, FZ]]); if (q) S(q, { fill: '#E4DCCB' }); }
    for (const x of p.cols) P.plane(zf + 25, k => {                                                     // columns
      S(rectPts(x - 15, -p.y0 + 30, 30, p.y0 - 55), { fill: linGrad(x - 15, 0, x + 15, 0, [[0, '#F7F2E6'], [.6, C.trim], [1, C.trimDk]]), lwPx: px2(k, 1.2) });
      S(rectPts(x - 21, -50, 42, 25), { fill: C.trim, lwPx: px2(k, 1) });
      S(rectPts(x - 21, -p.y0 + 20, 42, 14), { fill: C.trim, lwPx: px2(k, 1) });
    });
    const a = [p.x0 - 30, p.y0 + 10, ze - 15], b = [p.x1 + 30, p.y0 + 10, ze - 15], cc = [p.x1 + 30, p.y1 + 10, FZ], d = [p.x0 - 30, p.y1 + 10, FZ];
    slope(P, a, b, cc, d, C.roof, 5);
    for (const sd of [-1, 1]) { const xe = sd < 0 ? a[0] : b[0], q = P.poly([[xe, p.y0 + 10, ze - 15], [xe, p.y1 + 10, FZ], [xe, p.y0 - 30, FZ], [xe, p.y0 - 30, ze - 15]]); if (q && sd * (c.x - xe) > 0) S(q, { fill: C.trimDk }); }
    P.plane(ze - 15, k => {                                                                             // beam + gutter
      S(rectPts(p.x0 - 30, -p.y0 - 10, p.x1 - p.x0 + 60, 40), { fill: C.trim, lwPx: px2(k, 1.4) });
      line([[p.x0 - 30, -p.y0 - 12], [p.x1 + 30, -p.y0 - 12]], { stroke: C.roofDk, lwPx: px2(k, 6) });
      S(rectPts(p.x1 + 6, -p.y0 + 30, 14, p.y0 - 30), { fill: C.trim, lwPx: px2(k, 1) });               // downspout
    });
  }

  // ---------- landscaping ----------
  function puffs(P, x, z, w, h, seed, t, wind, cols, n = 18, r0 = .22) {     // round-lobed bush (lime or green)
    P.plane(z, k => {
      const sw = wob(t, .25, hash(seed)) * 4 * wind, B = [];
      for (let i = 0; i < n; i++) {
        const u = hash(seed + i * 3.1), v = hash(seed + i * 7.7), bx = x + (u - .5) * w * .85, top = h * Math.sqrt(1 - (2 * (bx - x) / w) ** 2);
        B.push([bx + sw * v, -(top * (.35 + .55 * v)), w * r0 * (.7 + .4 * hash(seed + i))]);
      }
      B.sort((a, b) => a[1] - b[1]).reverse();
      B.forEach(([bx, by, r]) => circle(bx, by, r, { fill: cols[0], stroke: C.line, lwPx: px2(k, 1.2) }));
      B.forEach(([bx, by, r]) => { circle(bx, by, r * .96, { fill: cols[0], stroke: null }); circle(bx - r * .22, by - r * .25, r * .6, { fill: cols[1], stroke: null }); });
      B.forEach(([bx, by, r], i) => { if (i % 3 === 0) circle(bx - r * .35, by - r * .4, r * .22, { fill: cols[2], stroke: null }); });
    });
  }
  const AUTUMN = [['#C2602A', '#DE8838', '#F2B45A'], ['#A3352C', '#C8513A', '#E57D58'], ['#C49428', '#E0B840', '#F4D670'], ['#B5752E', '#D69A42', '#EDC36A'], [C.leaf, C.leafMid, C.leafLt]];
  function tree(P, x, z, h, t, seed, wind, autumn) {
    const [lf, lm, ll] = autumn ? AUTUMN[Math.floor(hash(seed * 3.7 + 1) * AUTUMN.length)] : [C.leaf, C.leafMid, C.leafLt];
    P.plane(z, k => {
      const sw = wob(t, .16 + hash(seed) * .08, hash(seed + 1)) * h * .012 * wind;
      S([[x - h * .035, 0], [x + h * .035, 0], [x + h * .02 + sw * .5, -h * .5], [x - h * .02 + sw * .5, -h * .5]], { fill: C.trunk, lwPx: px2(k, 1.6) });
      const cy = -h * .68, r = h * .3, B = [];
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + hash(seed + i) * .6, d = r * (.45 + .25 * hash(seed + i * 3)); B.push([x + sw + Math.cos(a) * d, cy + Math.sin(a) * d * .85, r * (.48 + .18 * hash(seed + i * 7))]); }
      B.push([x + sw, cy, r * .72]);
      B.forEach(([bx, by, br]) => circle(bx, by, br, { fill: lf, stroke: C.line, lwPx: px2(k, 1.4) }));
      B.forEach(([bx, by, br]) => circle(bx, by, br * .96, { fill: lf, stroke: null }));
      B.forEach(([bx, by, br]) => { if (by < cy + r * .2) circle(bx - br * .18, by - br * .2, br * .62, { fill: lm, stroke: null }); });
      B.forEach(([bx, by, br]) => { if (by < cy - r * .1 && bx < x + sw + r * .3) circle(bx - br * .3, by - br * .35, br * .28, { fill: ll, stroke: null }); });
    });
  }
  function gnome(P, x, z) {
    P.plane(z, k => {
      const lw = px2(k, 1);
      S([[x - 11, 0], [x + 11, 0], [x + 9, -18], [x - 9, -18]], { fill: '#3D6CB0', lwPx: lw });
      S([[x - 10, -16], [x + 10, -16], [x + 8, -34], [x - 8, -34]], { fill: '#4C8B3E', lwPx: lw });
      S([[x - 8, -32], [x + 8, -32], [x, -14]], { fill: '#F4F1EA', lwPx: lw, smooth: .3 });
      circle(x, -36, 6, { fill: '#F2C6A0', lwPx: lw });
      S([[x - 9, -38], [x + 9, -38], [x + 3, -66]], { fill: '#D23A35', lwPx: lw });
    });
  }
  function gazingBall(P, x, z, r, col) {
    P.plane(z, k => { circle(x, -r, r, { fill: radGrad(x - r * .35, -r * 1.35, r * .1, r * 1.1, [[0, '#FFFFFF'], [.3, col], [1, mixCol(col, '#101830', .5)]]), lwPx: px2(k, 1) }); });
  }
  function clover(P, x, z, s, seed, t, wind, bloom) {
    P.plane(z, k => {
      const sw = wob(t, .4, hash(seed)) * 2 * wind;
      for (let i = 0; i < 3; i++) {                                                     // three trifoliate sprigs
        const lx = x + (i - 1) * 7 * s, ly = -(5 + 4 * hash(seed + i)) * s;
        line([[lx, 0], [lx + sw * .5, ly]], { stroke: C.clover, lwPx: px2(k, .9) });
        for (let j = 0; j < 3; j++) { const a = -Math.PI / 2 + (j - 1) * 2.1 + hash(seed + i + j) * .3; ellipse(lx + sw * .5 + Math.cos(a) * 3.2 * s, ly + Math.sin(a) * 2 * s, 3.4 * s, 2.4 * s, { rot: a, fill: j === 1 ? C.cloverLt : C.clover, stroke: C.line, lwPx: px2(k, .6) }); }
      }
      if (bloom) {
        const by = -26 * s, bx = x + sw * 2;
        line([[x, 0], [x + 2 * s, by * .5], [bx, by]], { stroke: C.clover, lwPx: px2(k, 1.2), smooth: true });
        circle(bx, by, 6 * s, { fill: C.bloom, stroke: C.line, lwPx: px2(k, .8) });
        for (let j = 0; j < 7; j++) { const a = j / 7 * TAU; circle(bx + Math.cos(a) * 3.2 * s, by + Math.sin(a) * 3.6 * s - 1.5 * s, 2 * s, { fill: j % 2 ? C.bloomLt : C.bloom, stroke: null }); }
      }
    });
  }
  function tufts(P, z, t, wind) {                                                       // a row of grass blades, only near the camera
    P.plane(z, k => {
      const zi = Math.round(z / 45), x0 = P.cam.x - 1.3 * P.depth(z), x1 = P.cam.x + 1.3 * P.depth(z);
      for (let i = Math.floor(x0 / 55); i <= x1 / 55; i++) {
        const sd = zi * 131 + i * 17, x = i * 55 + (hash(sd) - .5) * 40, hh = 7 + 6 * hash(sd + 1), sw = wob(t, .45, hash(sd + 2)) * 2 * wind;
        for (let j = -1; j <= 1; j++) line([[x + j * 2.5, 0], [x + j * 4 + sw, -hh * (1 - .25 * Math.abs(j))]], { stroke: (i + j) % 3 ? C.blade : C.bladeLt, lwPx: px2(k, 1.6) });
      }
    });
  }
  function clouds(P, t) {
    const set = [[-34000, 16000, 2.4], [-6000, 23000, 1.6], [16000, 15000, 2.6], [36000, 21000, 1.8], [-58000, 22000, 2.0]];
    set.forEach(([x0, y, s], i) => P.plane(60000, () => {
      const x = x0 + t * 260;
      const B = [[-2600, 0, 1500], [-900, -900, 2000], [900, -1300, 2300], [2700, -300, 1600], [0, 300, 1700]];
      B.forEach(([dx, dy, r]) => circle(x + dx * s, -y + dy * s, r * s, { fill: C.cloudSh, stroke: null }));
      B.forEach(([dx, dy, r]) => circle(x + dx * s - 200 * s, -y + dy * s - 250 * s, r * s * .9, { fill: C.cloud, stroke: null }));
      S(rectPts(x - 4200 * s, -y + 200 * s, 8400 * s, 1400 * s), { fill: C.cloudSh, stroke: null });
    }));
  }

  // ---------- ground ----------
  function quad(P, x0, x1, z0, z1, y, o) { const q = P.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]); if (q) S(q, { stroke: null, ...o }); return q; }
  function bed(P, x0, x1, zb, zf, seed) {                                                // mulch bed with a wavy front edge
    const pts = [[x0, .3, zb]]; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([lerp(x0, x1, u), .3, zf - Math.sin(u * Math.PI) * 60 + (hash(seed + i) - .5) * 20]); }
    pts.push([x1, .3, zb]);
    const q = P.poly(pts); if (q) S(q, { fill: C.mulch, stroke: C.mulchDk, lwPx: 1 });
  }
  function ground(P, t, autumn) {
    const zn = P.cam.z + 16, far = 40000, [, yh] = P.p(0, 0, far), g = c => autumn ? mixCol(c, '#B9A23E', .22) : c;
    quad(P, -far, far, zn, far, 0, { fill: linGrad(0, yh, 0, H + 200, [[0, g('#9CC75A')], [.2, g(C.grassLt)], [.55, g(C.grass)], [1, g(C.grassDk)]]) });
    X.save(); X.globalAlpha = .1;                                                       // mowing stripes
    for (let x = -3000; x < 3600; x += 300) quad(P, x, x + 150, Math.max(zn, 200), WALK[0], .1, { fill: '#FFFFFF' });
    X.restore();
    bed(P, -1300, -480, FZ, 2700, 1); bed(P, -480, 260, 2700, 2700, 2); bed(P, 260, 1400, WG.z0, 2760, 3);
    quad(P, -170, 0, WALK[1], PO.z0 - 45, .4, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    quad(P, -170, 3200, WALK[0], WALK[1], .5, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    X.save(); X.globalAlpha = .5; for (let x = -170; x < 3200; x += 120) { const l = P.line([[x, .6, WALK[0]], [x, .6, WALK[1]]]); if (l) line(l, { stroke: C.concDk, lwPx: .8 }); } X.restore();
    quad(P, 1400, 2300, WALK[1], 3600, .3, { fill: C.conc, stroke: C.concDk, lwPx: .8 });                      // driveway beside the wing
    const sh = P.poly([[-1300, .6, 2700], [-560, .6, 2700], [-480, .6, 2560], [-1000, .6, 2520]]); if (sh) S(sh, { fill: 'rgba(30,60,10,.18)', stroke: null });
    if (autumn) for (let i = 0; i < 260; i++) {                                         // fallen leaves on the lawn
      const x = -2600 + hash(i * 4.1 + 7) * 5600, z = 120 + hash(i * 8.3 + 2) * 2450; if (P.depth(z) < 40) continue;
      const a = hash(i * 2.9) * TAU, r = 7 + 4 * hash(i * 1.3), q = P.poly([[x + Math.cos(a) * r, .6, z + Math.sin(a) * r], [x - Math.sin(a) * r * .5, .6, z + Math.cos(a) * r * .5], [x - Math.cos(a) * r, .6, z - Math.sin(a) * r], [x + Math.sin(a) * r * .5, .6, z - Math.cos(a) * r * .5]]);
      if (q) S(q, { fill: AUTUMN[i % 4][i % 3 === 0 ? 0 : 1], stroke: null });
    }
  }
  function fallingLeaves(P, t, wind) {                                                // leaves drifting down (world-fixed, so they don't slide with the camera)
    for (let i = 0; i < 46; i++) {
      const x0 = -2400 + hash(i * 3.3 + 5) * 5200, z = 300 + hash(i * 6.7 + 1) * 3000, per = 7 + 5 * hash(i * 1.1), ph = frac(t / per + hash(i * 2.2));
      const y = 900 * (1 - ph), x = x0 + Math.sin(t * 1.4 + i) * 45 + ph * 260 * wind, col = AUTUMN[i % 4][1 + (i % 2)];
      if (P.depth(z) < 60) continue;
      P.plane(z, k => { X.translate(x, -y); X.rotate(t * (1.2 + hash(i) * 2) * (i % 2 ? 1 : -1)); X.scale(1, .45 + .55 * Math.abs(Math.sin(t * 2.3 + i)));
        ellipse(0, 0, 9, 5, { fill: col, stroke: C.line, lwPx: px2(k, .8) }); line([[-9, 0], [9, 0]], { stroke: C.line, lwPx: px2(k, .6), alpha: .6 }); });
    }
  }

  // ---------- items: depth sorted by distance to the camera, split into back and front layers by z ----------
  const BG_TREES = (() => { const a = []; for (let i = 0; i < 60; i++) a.push({ x: -7000 + i * 240 + (hash(i * 2.3) - .5) * 180, z: 4400 + hash(i * 5.7) * 2400, h: 900 + hash(i * 1.9) * 600, s: i }); return a; })();
  const LAWN = (() => {                                                                  // clover patches, some in bloom
    const a = []; for (let i = 0; i < 170; i++) { const x = -2400 + hash(i * 3.3) * 5200, z = 150 + hash(i * 6.1) * 2350; a.push({ x, z, s: .8 + .6 * hash(i * 2.2), bloom: hash(i * 9.9) < .3, seed: 500 + i }); }
    a.push({ x: -420, z: 1700, s: 1.6, bloom: true, seed: 901 }, { x: -340, z: 1740, s: 1.4, bloom: true, seed: 902 }, { x: -520, z: 1760, s: 1.5, bloom: false, seed: 903 }, { x: 1150, z: 1780, s: 1.3, bloom: false, seed: 904 });
    return a;
  })();
  // ---------- night ----------
  function nightSky(P, t, nt) {
    X.fillStyle = linGrad(0, P.cam.hy - 1300, 0, P.cam.hy, [[0, mixCol(C.sky, '#0A0E2E', nt)], [.7, mixCol(C.skyLo, '#26285E', nt)], [1, mixCol(C.skyLo, '#4A3A6E', nt)]]); X.fillRect(0, 0, W, H);
    P.plane(60000, () => {                                                // stars and the moon sit on a far plane, so they parallax like the clouds
      for (let i = 0; i < 160; i++) { const x = -70000 + hash(i * 3.1) * 140000, y = 6000 + hash(i * 7.7) * 42000, tw = .6 + .4 * Math.sin(t * (1 + hash(i)) * 3 + i);
        circle(x, -y, (90 + 120 * hash(i * 1.3)) * tw, { fill: rgba('#FFF8E0', .9 * nt), stroke: null }); }
      const mx = 15000, my = -27000;
      circle(mx, my, 9000, { fill: radGrad(mx, my, 2500, 9000, [[0, rgba('#FFF2C4', .35 * nt)], [1, rgba('#FFF2C4', 0)]]), stroke: null });
      circle(mx, my, 2600, { fill: rgba('#FFF2C4', nt), stroke: null });
      for (const [dx, dy, r] of [[-700, -500, 420], [500, 300, 300], [-200, 800, 220]]) circle(mx + dx, my + dy, r, { fill: rgba('#E8D9A6', .8 * nt), stroke: null });
    });
  }
  function nightTint(nt) {                                                  // inside a layer: darken and blue only what was painted
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'source-atop';
    X.fillStyle = `rgba(14,18,60,${(.62 * nt).toFixed(3)})`; X.fillRect(0, 0, W, H); X.restore();
  }
  function nightLights(nt, t) {                                             // warm light back on top: windows, the door, the lantern
    for (const L of LIT) {
      const flick = L.kind === 'lamp' ? .9 + .1 * Math.sin(t * 13 + L.x) : 1;
      X.save(); X.setTransform(L.m); X.globalCompositeOperation = 'lighter';
      X.fillStyle = `rgba(255,170,70,${(.5 * nt * flick).toFixed(3)})`; X.fillRect(L.x, L.y, L.w, L.h);
      const cx = L.x + L.w / 2, cy = L.y + L.h / 2, r = Math.max(L.w, L.h) * (L.kind === 'lamp' ? 4 : 1.3);
      X.fillStyle = radGrad(cx, cy, 0, r, [[0, `rgba(255,170,70,${(.35 * nt * flick).toFixed(3)})`], [1, 'rgba(255,170,70,0)']]); X.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      X.restore();
    }
  }
  const near = (P, x0, x1, z0, z1) => Math.hypot(clamp(P.cam.x, x0, x1) - P.cam.x, clamp(P.cam.z, z0, z1) - P.cam.z);
  function items(P, t, o) {
    const L = [], wind = o.wind ?? 1, add = (x0, x1, z0, z1, draw) => L.push({ z: z0, d: near(P, x0, x1, z0, z1), draw });
    const au = o.season === 'autumn';
    BG_TREES.forEach(tr => add(tr.x, tr.x, tr.z, tr.z, () => tree(P, tr.x, tr.z, tr.h, t, tr.s, wind, au)));
    [[-2300, 3300, 950], [-1700, 4000, 1100], [2200, 3800, 1000], [2900, 3200, 820]].forEach(([x, z, h], i) => add(x, x, z, z, () => tree(P, x, z, h, t, 300 + i * 7, wind, au)));
    add(-2600, -1350, 2950, 2950, () => puffs(P, -1950, 2950, 1300, 210, 70, t, wind, [C.shrub, C.shrubLt, C.leafLt], 22, .14));    // neighbour hedge
    add(X0, X1, FZ, BZ, () => mainBlock(P, t));
    add(WG.x0, WG.x1, WG.z0, WG.z1, () => wing(P, t));
    add(PO.x0, PO.x1, PO.z0, FZ, () => porch(P, t));
    add(-1250, -560, 2760, 2760, () => puffs(P, -930, 2760, 640, 300, 10, t, wind, [C.lime, C.limeLt, '#E4F0A8'], 26, .16));
    add(-760, -480, 2820, 2820, () => puffs(P, -620, 2820, 300, 230, 20, t, wind, [C.shrub, C.shrubLt, C.leafLt], 12));
    add(130, 460, 2800, 2800, () => puffs(P, 290, 2800, 330, 190, 30, t, wind, [C.shrub, C.shrubLt, C.leafLt], 14));
    add(560, 1150, 2830, 2830, () => puffs(P, 860, 2830, 620, 150, 50, t, wind, [C.shrub, C.shrubLt, C.leafLt], 20, .14));
    add(1150, 1420, 2840, 2840, () => puffs(P, 1290, 2840, 280, 200, 60, t, wind, [C.red, C.redLt, '#D9787A'], 14));
    add(470, 470, 2730, 2730, () => gnome(P, 470, 2730));
    add(420, 420, 2735, 2735, () => gazingBall(P, 420, 2735, 13, '#5D8FD0'));
    add(350, 350, 2720, 2720, () => gazingBall(P, 350, 2720, 9, '#B49AD6'));
    LAWN.forEach(c => add(c.x, c.x, c.z, c.z, () => clover(P, c.x, c.z, c.s, c.seed, t, wind, c.bloom)));
    for (let z = Math.ceil((P.cam.z + 40) / 45) * 45; z < Math.min(P.cam.z + 900, WALK[0]); z += 45) add(P.cam.x, P.cam.x, z, z, () => tufts(P, z, t, wind));
    return L.sort((a, b) => b.d - a.d);
  }

  return {
    MARK: { x: 0, z: 2000 }, FZ, WALK, PORCH: PO, WING: WG,
    back(P, t, o = {}) {
      const nt = clamp(o.night || 0), split = o.splitZ ?? -Infinity;
      if (nt > 0) nightSky(P, t, nt);
      else { X.fillStyle = linGrad(0, P.cam.hy - 1300, 0, P.cam.hy, [[0, C.sky], [1, C.skyLo]]); X.fillRect(0, 0, W, H); clouds(P, t); }
      const body = () => { ground(P, t, o.season === 'autumn'); for (const it of items(P, t, o)) if (it.z > split) it.draw(); };
      if (nt > 0) { LIT = []; layer(() => { body(); nightTint(nt); }, { filter: `saturate(${(1 - .3 * nt).toFixed(2)})` }); nightLights(nt, t); LIT = null; }
      else body();
    },
    front(P, t, o = {}) {
      const nt = clamp(o.night || 0), split = o.splitZ ?? -Infinity;
      const body = () => { for (const it of items(P, t, o)) if (it.z <= split) it.draw(); if (o.season === 'autumn') fallingLeaves(P, t, o.wind ?? 1); };
      if (nt > 0) layer(() => { body(); nightTint(nt); }, { filter: `saturate(${(1 - .3 * nt).toFixed(2)})` }); else body();
    },
  };
})();

// Registration for the studio's location browser: named spots + camera presets (paste-ready for scene code).
LOCATIONS.house = Object.assign(house, {
  spots: {
    'Front lawn': { x: 0, y: 0, z: 2000 },
    'On the porch': { x: -90, y: 25, z: 2860 },
    'Porch steps': { x: -85, y: 0, z: 2620 },
    'Garden walk': { x: 900, y: 0, z: 2640 },
    'By the gnome': { x: 580, y: 0, z: 2660 },
    'Driveway': { x: 1850, y: 0, z: 2400 },
    'Lawn corner': { x: -900, y: 0, z: 1500 },
  },
  cameras: {
    'Front': { x: 200, y: 60, z: 1650, f: 1000, hy: 800 },
    'Street wide': { x: 200, y: 170, z: -400, f: 1000, hy: 600 },
    'On the lawn': { x: 0, y: 110, z: 1300, f: 1000, hy: 700 },
    'Medium': { x: 0, y: 120, z: 1600, f: 1000, hy: 640 },
    'Porch': { x: 150, y: 150, z: 2150, f: 1000, hy: 600 },
    'Garden walk': { x: 750, y: 130, z: 1950, f: 1000, hy: 640 },
    'Clover close': { x: -380, y: 22, z: 1600, f: 900, hy: 820 },
    'Low hero': { x: 300, y: 35, z: 1100, f: 800, hy: 800 },
    'Aerial': { x: 200, y: 1800, z: -1200, f: 1000, hy: -60 },
  },
});
