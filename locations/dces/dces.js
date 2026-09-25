// locations/dces/dces.js: Dove Creek Elementary School, seen from the street (see reference_*.webp, README.md).
//
// An outdoor 3D set in one-point perspective (engine/persp.js). World units: a person is ~170 tall (1 unit ≈ 1 cm).
//   dces.back(P, t, o)    sky, ground, road, the school and everything farther than o.splitZ (default: everything). Call first.
//   dces.front(P, t, o)   props nearer than o.splitZ (median trees, signs, bollards, piers…). Call after the characters.
// o: { splitZ, wind (0..2, default 1: tree sway and flag flutter) }
//
// Layout (world): the entry block's facade is the plane Z = 2600, X ±1150, parapet Y 470. Brick piers at X ±600, Z 2300
// hold the arched canopy (X ±840, Z 2230–2600, Y 600 → 800) with the DOVE CREEK ELEMENTARY sign. Entry plaza X ±610,
// Z 2150–2600; front sidewalk Z 2050–2150; drop-off road Z 1350–1990 with a crosswalk X ±300; grass median Z 1180–1350;
// parking lot Z 380–1180. Gable-roofed classroom wings: left X −2600…−1500 (front Z 2700), right X 1500…2500 (Z 2900)
// and X 2900…3900 (Z 3300). Tree line Z 5600–8200, water tower X 2600, Z 9500. Stage mark: X 0, Z 2200 (dces.MARK).

const dces = (() => {
  const FZ = 2600, BW = 1150, PAR = 470;                                     // entry block: facade plane, half width, parapet
  const PIER_X = 600, PIER_Z = 2245, PIER_W = 110, PIER_H = 545;             // brick piers (front face Z, width, top of brick)
  const CAN = { hw: 840, y0: 600, rise: 200, z0: 2230, z1: FZ };             // arched entrance canopy
  const canY = x => CAN.y0 + CAN.rise * (1 - (x / CAN.hw) ** 2);
  const ROAD = [1350, 1990], WALK = [2050, 2150], LOT = [380, 1180], MED = [1180, 1350], PLAZA = 610, XW = 4600;
  const CHORD = 585;                                                         // truss bottom chord height
  const C = {
    sky: '#3F78BC', skyLo: '#A9C8E3', cloud: '#F4F8FC',
    grass: '#98B566', grassLt: '#B3C98A', grassDk: '#86A357', mulch: '#7E5E45',
    conc: '#D8D6CE', concDk: '#BCB9AF', curb: '#E6E4DD', asph: '#6D7585', asphDk: '#5B6372', paint: '#F4F3EE', hcBlue: '#2F66B3',
    brick: '#A4533F', brickDk: '#86412F', brickLt: '#BA6750', brickSide: '#8E4636', mortar: '#CFAE9C',
    stone: '#E7E0D2', stoneDk: '#C6BCA8', flat: '#DCD8CF', flatDk: '#C4BFB4',
    glass: '#28363E', glassLt: '#557180', frame: '#2A2F33',
    steel: '#2E3A42', steelLt: '#46545D', roof: '#93A7BC', roofLt: '#B2C2D2', roofDk: '#6D8299', soffit: '#C9D1D8', soffitDk: '#A9B3BD',
    leaf: '#3D7A36', leafMid: '#57973F', leafLt: '#7DB656', trunk: '#6A4E3B', shrub: '#3F7A38', shrubLt: '#62A04A',
    tower: '#A9D6DA', towerDk: '#7FB2B9', unit: '#D5D8DA', unitDk: '#A9AFB3',
    line: '#3D3237',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .7, 5);

  // ---------- brick: a flat colour, with a coursed pattern faded in as the wall gets close (no shimmer at a distance) ----------
  const _brick = new WeakMap();
  function brickPattern() {
    if (_brick.has(X)) return _brick.get(X);
    const s = 4, bw = 24, bh = 7.5, cols = 10, rows = 12, cv = document.createElement('canvas');
    cv.width = cols * bw * s; cv.height = rows * bh * s;
    const g = cv.getContext('2d'); g.fillStyle = C.mortar; g.fillRect(0, 0, cv.width, cv.height);
    for (let r = 0; r < rows; r++) for (let c = -1; c <= cols; c++) {
      g.fillStyle = mixCol(C.brickDk, C.brickLt, .15 + .7 * hash(r * 17.3 + c * 5.1 + 3));
      g.fillRect((c * bw + (r % 2 ? bw / 2 : 0) + .6) * s, (r * bh + .6) * s, (bw - 1.2) * s, (bh - 1.2) * s);
    }
    const pat = X.createPattern(cv, 'repeat'); pat.setTransform(new DOMMatrix().scale(1 / s));
    _brick.set(X, pat); return pat;
  }
  function brick(pts, k, fill = C.brick) {                                    // pts in plane units
    S(pts, { fill, stroke: null });
    const a = clamp((k - .2) / .45) * .85;
    if (a > .01) S(pts, { fill: brickPattern(), stroke: null, alpha: a });
  }

  // ---------- facade pieces (plane units: x = X, y = −Y) ----------
  function win(x, sill, w, h, k) {
    const y0 = -sill, y1 = -sill - h;
    S(rectPts(x - w / 2 - 10, y0, w + 20, 12), { fill: C.stone });                         // sill
    const arc = []; for (let i = 0; i <= 12; i++) { const u = i / 12; arc.push([x - w / 2 - 12 + u * (w + 24), y1 - 16 - 9 * Math.sin(u * Math.PI)]); }
    S([...arc, [x + w / 2 + 12, y1 + 2], [x - w / 2 - 12, y1 + 2]], { fill: C.stone });        // segmental stone head
    S(rectPts(x - w / 2, y1, w, h), { fill: C.frame });
    S(rectPts(x - w / 2 + 6, y1 + 6, w - 12, h - 12), { fill: linGrad(0, y1, 0, y0, [[0, C.glassLt], [.45, C.glass], [1, '#1E282E']]), stroke: null });
    X.save(); X.globalAlpha = .18; S([[x - w / 2 + 6, y1 + h * .55], [x - w / 2 + 6, y1 + 6], [x - w / 2 + w * .45, y1 + 6]], { fill: '#FFFFFF', stroke: null }); X.restore();
    line([[x, y1 + 4], [x, y0 - 4]], { stroke: C.frame, lwPx: px2(k, 5) });
    line([[x - w / 2 + 4, y1 + h * .38], [x + w / 2 - 4, y1 + h * .38]], { stroke: C.frame, lwPx: px2(k, 4) });
  }
  const px2 = (k, w) => clamp(w * k, .8, 6);
  function door(x, w, h, k, arched = false) {
    const y1 = -h;
    if (arched) {
      const a = []; for (let i = 0; i <= 14; i++) { const an = Math.PI * i / 14; a.push([x - Math.cos(an) * (w / 2 + 16), y1 - Math.sin(an) * (w / 2 + 16) * .55]); }
      S([[x - w / 2 - 16, 0], ...a, [x + w / 2 + 16, 0]], { fill: C.stone });
      const g = []; for (let i = 0; i <= 14; i++) { const an = Math.PI * i / 14; g.push([x - Math.cos(an) * w / 2, y1 - Math.sin(an) * w / 2 * .55]); }
      S([[x - w / 2, 0], ...g, [x + w / 2, 0]], { fill: C.frame });
    } else {
      S(rectPts(x - w / 2 - 14, y1 - 28, w + 28, 24), { fill: C.stone });
      S(rectPts(x - w / 2, y1, w, h), { fill: C.frame });
    }
    for (const sd of [-1, 1]) {
      const lx = x + sd * w / 4, lw = w / 2 - 14;
      S(rectPts(lx - lw / 2, y1 + 8, lw, h - 14), { fill: linGrad(0, y1, 0, 0, [[0, C.glassLt], [.5, C.glass], [1, '#1B2429']]), stroke: null });
      line([[x + sd * 10, y1 + h * .42], [x + sd * 10, y1 + h * .62]], { stroke: '#B9C0C4', lwPx: px2(k, 3) });
    }
    line([[x, y1 + 2], [x, 0]], { stroke: C.frame, lwPx: px2(k, 4) });
  }
  function coping(x0, x1, h) { S(rectPts(x0 - 6, -h - 4, x1 - x0 + 12, 18), { fill: C.stone }); }
  function baseCourse(x0, x1) { line([[x0, -96], [x1, -96]], { stroke: C.stoneDk, lwPx: 2 }); }

  // ---------- solids ----------
  // An axis-aligned box: only the faces turned toward the camera. col: { front, side, top }
  function box(P, x0, x1, y0, y1, z0, z1, col) {
    const c = P.cam;
    if (c.y > y1) S(P.poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]), { fill: col.top });
    if (c.x < x0) S(P.poly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]), { fill: col.side });
    if (c.x > x1) S(P.poly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]), { fill: col.side });
    if (c.z < z0) S(P.poly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]), { fill: col.front });
  }
  const UNIT = { front: C.unit, side: C.unitDk, top: '#E6E8E9' };
  function roofUnit(P, x, z, y) {
    box(P, x - 60, x + 60, y, y + 55, z - 45, z + 45, UNIT);
    if (P.cam.y > y + 55) for (const dx of [-28, 28]) { const q = P.floorCircle(x + dx, z, 20, y + 56, 14); if (q) S(q, { fill: '#8E969B', lwPx: .8 }); }
  }
  // Flat-roofed brick block. b: { x0, x1, z0, z1, h, sideZ1 (exposed side depth), units: [[x, z]], face(k) extra facade art }
  function flatBlock(P, b) {
    const c = P.cam, sz = b.sideZ1 ?? b.z1;
    if (c.y > b.h) {
      S(P.poly([[b.x0, b.h, b.z0], [b.x1, b.h, b.z0], [b.x1, b.h, b.z1], [b.x0, b.h, b.z1]]), { fill: C.flat });
      const inset = P.poly([[b.x0 + 25, b.h + .5, b.z0 + 25], [b.x1 - 25, b.h + .5, b.z0 + 25], [b.x1 - 25, b.h + .5, b.z1 - 25], [b.x0 + 25, b.h + .5, b.z1 - 25]]);
      if (inset) S(inset, { fill: null, stroke: C.flatDk, lwPx: 1 });
    }
    (b.units || []).forEach(([x, z]) => roofUnit(P, x, z, b.h));
    for (const [sx, vis] of [[b.x0, c.x < b.x0], [b.x1, c.x > b.x1]]) if (vis) {
      S(P.poly([[sx, 0, b.z0], [sx, 0, sz], [sx, b.h, sz], [sx, b.h, b.z0]]), { fill: C.brickSide });
      const cp = P.poly([[sx, b.h - 14, b.z0], [sx, b.h - 14, sz], [sx, b.h + 4, sz], [sx, b.h + 4, b.z0]]); if (cp) S(cp, { fill: C.stoneDk });
      for (let z = b.z0 + 220; z < sz - 120; z += 330) sideWindow(P, sx, z, 110, 170, 60);
    }
    if (c.z < b.z0) P.plane(b.z0, k => {
      brick(rectPts(b.x0, -b.h, b.x1 - b.x0, b.h), k);
      S(rectPts(b.x0, -b.h, b.x1 - b.x0, b.h), { fill: null });
      baseCourse(b.x0, b.x1); coping(b.x0, b.x1, b.h);
      (b.wins || []).forEach(x => win(x, 110, b.winW || 120, b.winH || 170, k));
      b.face?.(k);
    });
  }
  function sideWindow(P, x, z, w, h, sill) {
    const q = P.poly([[x, sill, z - w / 2], [x, sill, z + w / 2], [x, sill + h, z + w / 2], [x, sill + h, z - w / 2]]); if (!q) return;
    S(q, { fill: C.frame });
    const g = P.poly([[x, sill + 8, z - w / 2 + 8], [x, sill + 8, z + w / 2 - 8], [x, sill + h - 8, z + w / 2 - 8], [x, sill + h - 8, z - w / 2 + 8]]); if (g) S(g, { fill: C.glass, stroke: null });
    const s = P.poly([[x, sill - 10, z - w / 2 - 8], [x, sill - 10, z + w / 2 + 8], [x, sill, z + w / 2 + 8], [x, sill, z - w / 2 - 8]]); if (s) S(s, { fill: C.stone, lwPx: .8 });
  }

  // Gable-roofed classroom wing, gable end facing the street. w: { x0, x1, z0, z1, he (eave), hr (ridge) }
  function gableWing(P, w, t) {
    const c = P.cam, xm = (w.x0 + w.x1) / 2, hw = (w.x1 - w.x0) / 2, OH = 40, zf = w.z0 - 30, zb = w.z1 + 30;
    for (const [sx, vis] of [[w.x0, c.x < w.x0], [w.x1, c.x > w.x1]]) if (vis) {
      S(P.poly([[sx, 0, w.z0], [sx, 0, w.z1], [sx, w.he, w.z1], [sx, w.he, w.z0]]), { fill: C.brickSide });
      for (let z = w.z0 + 260; z < w.z1 - 150; z += 360) sideWindow(P, sx, z, 120, 150, 110);
      const sof = P.poly([[sx, w.he, w.z0], [sx, w.he, w.z1], [sx + Math.sign(sx - xm) * OH, w.he - 12, zb], [sx + Math.sign(sx - xm) * OH, w.he - 12, zf]]);
      if (sof && c.y < w.he) S(sof, { fill: C.soffitDk });
    }
    P.plane(w.z0, k => {
      const pent = [[w.x0, 0], [w.x1, 0], [w.x1, -w.he], [xm, -w.hr], [w.x0, -w.he]];
      brick(pent, k); S(pent, { fill: null });
      baseCourse(w.x0, w.x1);
      line([[w.x0, -w.he + 30], [w.x1, -w.he + 30]], { stroke: C.stoneDk, lwPx: px2(k, 3) });
      [-.74, -.5, .5, .74].forEach(u => win(xm + u * hw, 110, 110, 160, k));
      door(xm, 170, 240, k, true);
      const oy = -(w.he + (w.hr - w.he) * .4);                                   // oculus vent
      circle(xm, oy, 46, { fill: C.stone, stroke: C.line, lwPx: 1.2 });
      circle(xm, oy, 32, { fill: C.frame, stroke: C.line, lwPx: 1 });
      for (let i = -2; i <= 2; i++) line([[xm - 28 * Math.cos(Math.asin(i / 3)), oy + i * 10], [xm + 28 * Math.cos(Math.asin(i / 3)), oy + i * 10]], { stroke: '#56636B', lwPx: px2(k, 2) });
    });
    // roof slopes (seen from above), then the rake boards along the gable edge (always)
    for (const sd of [-1, 1]) {
      const xe = sd < 0 ? w.x0 - OH : w.x1 + OH, ye = w.he - 12, above = c.y > ye + (w.hr + 14 - ye) * (c.x - xe) / (xm - xe);
      if (!above) continue;
      const q = P.poly([[xe, ye, zf], [xm, w.hr + 14, zf], [xm, w.hr + 14, zb], [xe, ye, zb]]);
      if (!q) continue;
      S(q, { fill: sd < 0 ? C.roofLt : C.roof });
      X.save(); X.globalAlpha = .35;
      for (let z = zf + 45; z < zb; z += 60) { const l = P.line([[xe, ye, z], [xm, w.hr + 14, z]]); if (l) line(l, { stroke: C.roofDk, lwPx: .8 }); }
      X.restore();
    }
    const ridge = P.line([[xm, w.hr + 14, zf], [xm, w.hr + 14, zb]]); if (ridge && c.y > w.hr) line(ridge, { stroke: C.roofDk, lwPx: px(P, 3) });
    P.plane(zf, k => {
      const rake = [[w.x0 - OH, -(w.he - 12)], [xm, -(w.hr + 14)], [w.x1 + OH, -(w.he - 12)]];
      line(rake, { stroke: C.line, lwPx: px2(k, 24) }); line(rake, { stroke: C.roofDk, lwPx: px2(k, 20) });
      line(rake.map(([x, y]) => [x, y + 8]), { stroke: C.roof, lwPx: px2(k, 6) });
    });
  }

  // ---------- the entrance: piers, canopy, truss, sign ----------
  function pier(P, x) {
    const x0 = x - PIER_W / 2, x1 = x + PIER_W / 2, z0 = PIER_Z, z1 = PIER_Z + PIER_W;
    box(P, x0, x1, 0, PIER_H, z0, z1, { front: C.brick, side: C.brickSide, top: C.stone });
    P.plane(z0, k => { brick(rectPts(x0, -PIER_H, PIER_W, PIER_H), k); S(rectPts(x0, -PIER_H, PIER_W, PIER_H), { fill: null }); line([[x0, -96], [x1, -96]], { stroke: C.stoneDk, lwPx: 1.5 }); });
    box(P, x0 - 10, x1 + 10, PIER_H, PIER_H + 22, z0 - 10, z1 + 10, { front: C.stone, side: C.stoneDk, top: '#F1ECE2' });
  }
  function canopy(P, t) {
    const n = 28, xs = []; for (let i = 0; i <= n; i++) xs.push(-CAN.hw + i * 2 * CAN.hw / n);
    // back supports standing on the roof, and the beams from the piers back to the facade
    for (const x of [-PIER_X, PIER_X]) { const q = P.line([[x, PAR, FZ + 40], [x, canY(x), FZ + 40]]); if (q) line(q, { stroke: C.steel, lwPx: px(P, 5) }); }
    for (let i = 0; i < n; i++) {
      const xa = xs[i], xb = xs[i + 1], ya = canY(xa), yb = canY(xb), below = P.cam.y < (ya + yb) / 2;
      const q = P.poly([[xa, ya, CAN.z0], [xb, yb, CAN.z0], [xb, yb, CAN.z1], [xa, ya, CAN.z1]]); if (!q) continue;
      const shade = below ? mixCol(C.soffitDk, C.soffit, .5 + .5 * Math.cos((xa + xb) / 2 / CAN.hw * 1.4)) : mixCol(C.roofDk, C.roofLt, .5 + .5 * Math.sin((xa + xb) / 2 / CAN.hw));
      S(q, { fill: shade, stroke: shade, lwPx: 1 });
      const r = P.line([[xa, ya - (below ? 1 : -1), CAN.z0], [xa, ya - (below ? 1 : -1), CAN.z1]]); if (r) line(r, { stroke: below ? C.soffitDk : C.roofDk, lwPx: .9, alpha: .7 });
    }
    if (P.cam.y < CAN.y0 + CAN.rise) for (const x of [-330, 330]) {                          // soffit lights
      const q = P.poly([[x - 40, canY(x) - 2, 2380], [x + 40, canY(x) - 2, 2380], [x + 40, canY(x) - 2, 2420], [x - 40, canY(x) - 2, 2420]]);
      if (q) S(q, { fill: '#FBFBF6', stroke: C.soffitDk, lwPx: .8 });
    }
    for (const x of [-PIER_X, PIER_X, -CAN.hw + 60, CAN.hw - 60]) {                       // beams under the canopy, front to back
      const y = Math.abs(x) === PIER_X ? CHORD : canY(x) - 8, q = P.line([[x, y, CAN.z0 + 12], [x, y, FZ]]);
      if (q) { line(q, { stroke: C.line, lwPx: px(P, 7) }); line(q, { stroke: C.steelLt, lwPx: px(P, 5) }); }
    }
    P.plane(CAN.z0 + 12, k => {                                                             // the front truss
      const m = (a, b) => { line([a, b], { stroke: C.line, lwPx: px2(k, 13) }); line([a, b], { stroke: C.steel, lwPx: px2(k, 10) }); };
      const A = x => [x, -canY(x) + 6];
      m([-760, -CHORD], [760, -CHORD]);
      for (const sd of [-1, 1]) {
        m([sd * PIER_X, -PIER_H], A(sd * PIER_X));
        m([sd * 300, -CHORD], A(sd * 300));
        m([sd * PIER_X, -CHORD], [0, -canY(0) + 6]);
        m([sd * PIER_X, -CHORD], A(sd * 780));
        m([sd * 760, -CHORD], A(sd * 760));
        m([0, -CHORD], A(sd * 150));
      }
      m([0, -CHORD], A(0));
    });
    // fascia along the front edge of the arch
    const top = [], bot = []; for (const x of xs) { top.push([x, canY(x) + 6, CAN.z0]); bot.push([x, canY(x) - 18, CAN.z0]); }
    const f = P.poly([...top, ...bot.reverse()]); if (f) S(f, { fill: '#39464E', stroke: C.line, lwPx: 1.2 });
    const g = P.line(top); if (g) line(g, { stroke: '#6D7D87', lwPx: px(P, 1.5) });
    // the sign board
    P.plane(CAN.z0 + 4, k => {
      S(rectPts(-470, -618, 940, 70), { fill: linGrad(0, -618, 0, -548, [[0, '#35414A'], [1, '#262F35']]), stroke: C.line, lwPx: 1.4 });
      X.fillStyle = '#E9EEF1'; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.font = '600 44px "Avenir Next", "Gill Sans", "Futura", "Helvetica Neue", sans-serif';
      X.fillText('DOVE CREEK ELEMENTARY', 0, -581, 880);
    });
  }

  // ---------- nature and props ----------
  function tree(P, x, z, h, t, seed, wind) {
    P.plane(z, k => {
      const sw = wob(t, .16 + hash(seed) * .08, hash(seed + 1)) * h * .012 * wind;
      S([[x - h * .03, 0], [x + h * .03, 0], [x + h * .02 + sw * .5, -h * .52], [x - h * .02 + sw * .5, -h * .52]], { fill: C.trunk, lwPx: px2(k, 1.6) });
      const cy = -h * .7, r = h * .27, blobs = [];
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + hash(seed + i) * .6, d = r * (.45 + .25 * hash(seed + i * 3)); blobs.push([x + sw + Math.cos(a) * d, cy + Math.sin(a) * d * .9, r * (.48 + .18 * hash(seed + i * 7))]); }
      blobs.push([x + sw, cy, r * .7]);
      blobs.forEach(([bx, by, br]) => circle(bx, by, br, { fill: C.leaf, stroke: C.line, lwPx: px2(k, 1.4) }));
      blobs.forEach(([bx, by, br]) => circle(bx, by, br * .96, { fill: C.leaf, stroke: null }));
      blobs.forEach(([bx, by, br], i) => { if (by < cy + r * .2) circle(bx - br * .18, by - br * .2, br * .62, { fill: C.leafMid, stroke: null }); });
      blobs.forEach(([bx, by, br], i) => { if (by < cy - r * .1 && bx < x + sw + r * .3) circle(bx - br * .3, by - br * .35, br * .28, { fill: C.leafLt, stroke: null }); });
    });
  }
  function shade(P, x, z, r) { const q = P.floorCircle(x + r * .25, z + r * .35, r, .4, 24); if (q) S(q, { fill: 'rgba(40,60,20,.22)', stroke: null }); }
  function shrubRow(P, x0, x1, z, t, seed) {
    P.plane(z, k => {
      const n = Math.max(2, Math.round((x1 - x0) / 58));
      for (let pass = 0; pass < 2; pass++) for (let i = 0; i <= n; i++) {
        const x = lerp(x0, x1, i / n), r = 34 + 8 * hash(seed + i), y = -r * .9 - 4 * wob(t, .3, hash(seed + i));
        if (pass === 0) circle(x, y, r, { fill: C.shrub, stroke: C.line, lwPx: px2(k, 1.2) });
        else { circle(x, y, r * .95, { fill: C.shrub, stroke: null }); circle(x - r * .25, y - r * .3, r * .5, { fill: C.shrubLt, stroke: null }); }
      }
    });
  }
  function planter(P, x, z, t) {
    const rim = P.floorCircle(x, z, 42, 70, 20), base = P.floorCircle(x, z, 42, 0, 20); if (!rim || !base) return;
    S(base.filter((_, i) => i <= 10).concat(rim.filter((_, i) => i <= 10).reverse()), { fill: C.stone });
    S(rim, { fill: '#5B4636' });
    P.plane(z, k => { for (let i = 0; i < 5; i++) circle(x - 26 + i * 13, -95 - 16 * Math.sin(i / 4 * Math.PI) - 2 * wob(t, .3, i * .2), 24, { fill: i % 2 ? C.shrubLt : C.shrub, stroke: C.line, lwPx: px2(k, 1) }); });
  }
  function bollard(P, x, z) {
    P.plane(z, k => { S(rectPts(x - 9, -92, 18, 92), { fill: linGrad(x - 9, 0, x + 9, 0, [[0, '#1F262A'], [.4, '#4A565D'], [1, '#1F262A']]), lwPx: px2(k, 1) }); ellipse(x, -92, 9, 4, { fill: '#56636B', stroke: null }); });
  }
  function parkingSign(P, x, z) {
    P.plane(z, k => {
      line([[x, 0], [x, -230]], { stroke: '#8E989E', lwPx: px2(k, 4) });
      S(rectPts(x - 22, -250, 44, 50), { fill: C.hcBlue, stroke: '#F4F6F8', lwPx: px2(k, 2) });
      X.fillStyle = '#FFFFFF'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = 'bold 36px "Helvetica Neue", Arial, sans-serif'; X.fillText('P', x, -224);
    });
  }
  function flagpole(P, x, z, t, wind) {
    P.plane(z, k => {
      line([[x, 0], [x, -1380]], { stroke: C.line, lwPx: px2(k, 7) }); line([[x, 0], [x, -1380]], { stroke: '#D6DCE0', lwPx: px2(k, 5) });
      circle(x, -1390, 10, { fill: '#E0B650', stroke: C.line, lwPx: 1 });
      const fw = 190, fh = 115, top = -1370, wave = (u, v) => [x + u * fw, top + v * fh + wob(t * wind, 1.1, -u * 1.2) * 12 * u * wind + u * 8];
      const edge = (v, a, b) => { const o = []; for (let i = 0; i <= 10; i++) o.push(wave(lerp(a, b, i / 10), v)); return o; };
      for (let s = 0; s < 7; s++) S([...edge(s / 7, 0, 1), ...edge((s + 1) / 7, 0, 1).reverse()], { fill: s % 2 ? '#F7F4EE' : '#C8323F', stroke: null });
      S([...edge(0, 0, .42), ...edge(4 / 7, 0, .42).reverse()], { fill: '#2F4A87', stroke: null });
      S([...edge(0, 0, 1), ...edge(1, 0, 1).reverse()], { fill: null, stroke: C.line, lwPx: 1 });
    });
  }
  function waterTower(P, x, z, t) {
    P.plane(z, k => {
      X.translate(x, 0); X.scale(1.3, 1.3); X.translate(-x, 0); k *= 1.3;
      const lw = px2(k, 12), leg = (a, b) => { line([a, b], { stroke: C.towerDk, lwPx: lw * 1.3 }); line([a, b], { stroke: C.tower, lwPx: lw }); };
      const L = [[-420, 0, -250, 2220], [420, 0, 250, 2220], [-160, 0, -95, 2220], [160, 0, 95, 2220]];
      for (let i = 0; i < 4; i++) { const y0 = i * 555, y1 = y0 + 555, xa = f => lerp(420, 250, f / 2220); line([[-xa(y0), -y0], [xa(y1), -y1]], { stroke: C.towerDk, lwPx: lw * .5 }); line([[xa(y0), -y0], [-xa(y1), -y1]], { stroke: C.towerDk, lwPx: lw * .5 }); line([[-xa(y1), -y1], [xa(y1), -y1]], { stroke: C.towerDk, lwPx: lw * .6 }); }
      L.forEach(([a, b, c, d]) => leg([x + a, -b], [x + c, -d]));
      line([[x, -2200], [x, 0]], { stroke: C.towerDk, lwPx: lw * 1.4 });
      S([[x - 400, -2320], [x + 400, -2320], [x + 120, -2170], [x - 120, -2170]], { fill: C.towerDk, lwPx: px2(k, 2) });
      S(rectPts(x - 400, -2720, 800, 400), { fill: linGrad(x - 400, 0, x + 400, 0, [[0, C.towerDk], [.35, '#C9ECEE'], [1, C.towerDk]]), lwPx: px2(k, 2) });
      ellipse(x, -2720, 400, 70, { fill: '#BFE3E6', stroke: C.line, lwPx: px2(k, 2) });
      S([[x - 400, -2720], [x, -2860], [x + 400, -2720]], { fill: '#B7DEE2', smooth: .6, lwPx: px2(k, 2) });
      line([[x - 440, -2330], [x + 440, -2330]], { stroke: C.towerDk, lwPx: lw * .7 });
      X.fillStyle = '#4E7F88'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '700 110px "Avenir Next", "Futura", sans-serif';
      X.fillText('DOVE', x, -2580); X.fillText('CREEK', x, -2460);
    });
  }
  function clouds(P, t) {
    for (let i = 0; i < 5; i++) {
      const z = 60000, x = -40000 + i * 21000 + hash(i * 9) * 8000 + t * 250, y = 9000 + hash(i * 5) * 6000;
      P.plane(z, k => { for (let j = 0; j < 5; j++) ellipse(x + (j - 2) * 1500, -y - Math.sin(j / 4 * Math.PI) * 1100, 1900, 1200, { fill: C.cloud, stroke: null, alpha: .55 }); });
    }
  }

  // ---------- ground ----------
  function quad(P, x0, x1, z0, z1, y, o) { const q = P.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]); if (q) S(q, { stroke: null, ...o }); return q; }
  function ground(P, t) {
    const zn = P.cam.z + 16, far = 40000, [, yh] = P.p(0, 0, far), c0 = Math.max(zn, 0);
    quad(P, -far, far, zn, far, 0, { fill: linGrad(0, yh, 0, H + 300, [[0, C.grassLt], [.25, C.grass], [1, C.grassDk]]) });
    X.save(); X.globalAlpha = .12;                                                  // mowing stripes on the lawns
    for (let x = -3000; x < 3000; x += 240) quad(P, x, x + 120, 2150, 2480, .1, { fill: '#FFFFFF' });
    X.restore();
    // parking lot + median + road + sidewalks
    quad(P, -XW, XW, LOT[0], LOT[1], .2, { fill: C.asph });
    quad(P, -XW, XW, LOT[1], LOT[1] + 18, .3, { fill: C.curb, stroke: C.concDk, lwPx: .8 });
    quad(P, -far, far, ROAD[0] - 18, ROAD[0], .3, { fill: C.curb, stroke: C.concDk, lwPx: .8 });
    quad(P, -far, far, ROAD[0], ROAD[1], .2, { fill: linGrad(0, P.p(0, 0, ROAD[1])[1], 0, P.p(0, 0, Math.max(ROAD[0], zn))[1] + 1, [[0, C.asphDk], [1, C.asph]]) });
    quad(P, -far, far, ROAD[1], ROAD[1] + 18, .3, { fill: C.curb, stroke: C.concDk, lwPx: .8 });
    quad(P, -XW, XW, WALK[0], WALK[1], .3, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    quad(P, -PLAZA, PLAZA, WALK[1], FZ, .3, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    quad(P, -230, 230, LOT[1], ROAD[0], .35, { fill: C.conc, stroke: C.concDk, lwPx: .8 });           // walk across the median
    quad(P, -230, 230, ROAD[1], WALK[0], .35, { fill: C.conc, stroke: C.concDk, lwPx: .8 });
    for (const sd of [-1, 1]) quad(P, sd > 0 ? PLAZA : -BW, sd > 0 ? BW : -PLAZA, FZ - 120, FZ, .35, { fill: C.mulch });
    // joints
    X.save(); X.globalAlpha = .5;
    for (let x = -XW; x <= XW; x += 150) { const l = P.line([[x, .4, WALK[0]], [x, .4, WALK[1]]]); if (l) line(l, { stroke: C.concDk, lwPx: .8 }); }
    for (let x = -PLAZA; x <= PLAZA; x += 203) { const l = P.line([[x, .4, WALK[1]], [x, .4, FZ]]); if (l) line(l, { stroke: C.concDk, lwPx: .8 }); }
    for (let z = WALK[1]; z < FZ; z += 150) { const l = P.line([[-PLAZA, .4, z], [PLAZA, .4, z]]); if (l) line(l, { stroke: C.concDk, lwPx: .8 }); }
    X.restore();
    // canopy shadow on the plaza
    quad(P, -CAN.hw * .85, CAN.hw * .85, CAN.z0 + 110, FZ, .45, { fill: 'rgba(30,40,50,.16)' });
    // road markings: dashed centre line, crosswalk, stop bars
    for (let x = -12000; x < 12000; x += 600) if (Math.abs(x + 150) > 500) quad(P, x, x + 300, 1664, 1676, .4, { fill: C.paint });
    for (let x = -300; x < 300; x += 120) quad(P, x + 4, x + 64, ROAD[0] + 16, ROAD[1] - 16, .4, { fill: C.paint });
    for (const [z, a, b] of [[1520, 360, 2600], [1820, -2600, -360]]) quad(P, a, b, z - 10, z + 10, .4, { fill: C.paint, alpha: .8 });
    // parking stalls with curb stops and accessible bays by the walk
    for (let i = 0; i <= 32; i++) {
      const x = -4320 + i * 270; if (Math.abs(x) < 230) continue;
      quad(P, x - 5, x + 5, 700, LOT[1], .4, { fill: C.paint });
      const cx = x + 135; if (i < 32 && Math.abs(cx) > 250) quad(P, cx - 80, cx + 80, 1120, 1140, 12, { fill: C.curb, stroke: C.concDk, lwPx: .6 });
    }
    for (const sd of [-1, 1]) hcSymbol(P, sd * 385, 940);
  }
  function hcSymbol(P, x, z) {
    quad(P, x - 70, x + 70, z - 70, z + 70, .45, { fill: C.hcBlue });
    const g = (pts) => { const l = P.line(pts.map(([u, v]) => [x + u, .5, z - v])); if (l) line(l, { stroke: '#FFFFFF', lwPx: px(P, 2.4) }); };
    const q = P.floorCircle(x - 6, z - 42, 9, .5, 12); if (q) S(q, { fill: '#FFFFFF', stroke: null });
    g([[-8, 28], [-8, -2], [20, -2], [30, -30]]); g([[-8, 12], [14, 12]]);
    const a = []; for (let i = 0; i <= 14; i++) { const an = -.4 + i / 14 * 4.6; a.push([-10 + Math.cos(an) * 26, -14 + Math.sin(an) * 26]); } g(a);
  }

  // ---------- the buildings ----------
  const WINGS = [
    { x0: -2600, x1: -1500, z0: 2700, z1: 6100, he: 420, hr: 660 },
    { x0: 1500, x1: 2500, z0: 2900, z1: 6300, he: 420, hr: 650 },
    { x0: 2900, x1: 3900, z0: 3300, z1: 6500, he: 420, hr: 650 },
  ];
  const BLOCKS = {
    core: { x0: -1300, x1: 1300, z0: 3400, z1: 5200, h: 720, units: [[-700, 3600], [-250, 3650], [300, 3600], [800, 3700]], wins: [], face: k => line([[-1300, -560], [1300, -560]], { stroke: C.stoneDk, lwPx: px2(k, 4) }) },
    entry: { x0: -BW, x1: BW, z0: FZ, z1: 3400, sideZ1: 2800, h: PAR, units: [[-500, 3000], [350, 3100]], wins: [-1010, -790, -300, 300, 790, 1010], face: entryFace },
    linkL: { x0: -1500, x1: -BW, z0: 2800, z1: 3400, h: 430, wins: [-1400, -1250], winW: 70, winH: 200 },
    linkR: { x0: BW, x1: 1500, z0: 2800, z1: 3400, h: 430, wins: [1250, 1400], winW: 70, winH: 200 },
  };
  function entryFace(k) {
    for (const sd of [-1, 1]) {                                                    // pilasters framing the entrance bay
      const x = sd * 470;
      brick(rectPts(x - 38, -PAR - 22, 76, PAR + 22), k, C.brickLt); S(rectPts(x - 38, -PAR - 22, 76, PAR + 22), { fill: null });
      S(rectPts(x - 44, -PAR - 34, 88, 14), { fill: C.stone });
    }
    S(rectPts(-432, -PAR - 22, 864, 22), { fill: C.brick, stroke: null }); coping(-432, 432, PAR + 22);
    door(0, 200, 250, k);
    S(rectPts(-12, -312, 24, 14), { fill: C.stoneDk, stroke: null });
  }

  // ---------- items: depth sorted by distance to the camera, split into back and front layers by z ----------
  const BG_TREES = (() => { const a = []; for (let i = 0; i < 96; i++) a.push({ x: -9600 + i * 200 + (hash(i * 2.3) - .5) * 160, z: 5600 + hash(i * 5.7) * 2600, h: 1150 + hash(i * 1.9) * 650, s: i }); return a; })();
  const near = (P, x0, x1, z0, z1) => Math.hypot(clamp(P.cam.x, x0, x1) - P.cam.x, clamp(P.cam.z, z0, z1) - P.cam.z);
  function items(P, t, o) {
    const L = [], wind = o.wind ?? 1, add = (x0, x1, z0, z1, draw) => L.push({ z: z0, d: near(P, x0, x1, z0, z1), draw });
    BG_TREES.forEach(tr => add(tr.x, tr.x, tr.z, tr.z, () => tree(P, tr.x, tr.z, tr.h, t, tr.s, wind)));
    add(2600, 2600, 9500, 9500, () => waterTower(P, 2600, 9500, t));
    WINGS.forEach(w => add(w.x0, w.x1, w.z0, w.z1, () => gableWing(P, w, t)));
    Object.values(BLOCKS).forEach(b => add(b.x0, b.x1, b.z0, b.z1, () => flatBlock(P, b)));
    add(-CAN.hw, CAN.hw, CAN.z0, CAN.z1, () => canopy(P, t));
    for (const sd of [-1, 1]) {
      add(sd * PIER_X - 55, sd * PIER_X + 55, PIER_Z, PIER_Z + PIER_W, () => pier(P, sd * PIER_X));
      add(sd * (PIER_X - 105), sd * (PIER_X - 105), 2275, 2275, () => planter(P, sd * (PIER_X - 105), 2275, t));
      add(Math.min(sd * 660, sd * 1120), Math.max(sd * 660, sd * 1120), FZ - 60, FZ - 60, () => shrubRow(P, sd * 660, sd * 1120, FZ - 60, t, sd * 10));
      add(sd * 700, sd * 700, 2130, 2130, () => bollard(P, sd * 700, 2130));
      add(sd * 540, sd * 540, 1215, 1215, () => parkingSign(P, sd * 540, 1215));
    }
    WINGS.forEach((w, i) => add(w.x0 + 80, w.x1 - 80, w.z0 - 45, w.z0 - 45, () => { shrubRow(P, w.x0 + 80, (w.x0 + w.x1) / 2 - 150, w.z0 - 45, t, 30 + i); shrubRow(P, (w.x0 + w.x1) / 2 + 150, w.x1 - 80, w.z0 - 45, t, 40 + i); }));
    add(1350, 1350, 2300, 2300, () => flagpole(P, 1350, 2300, t, wind));
    [[-2100, 1265, 620], [-900, 1265, 560], [900, 1265, 580], [2100, 1265, 640], [-3400, 2350, 700], [3300, 2400, 680]].forEach(([x, z, h], i) =>
      add(x, x, z, z, () => { shade(P, x, z, h * .3); tree(P, x, z, h, t, 200 + i * 7, wind); }));
    return L.sort((a, b) => b.d - a.d);
  }

  return {
    MARK: { x: 0, z: 2200 }, FZ, BW, ROAD, LOT,
    back(P, t, o = {}) {
      X.fillStyle = linGrad(0, P.cam.hy - 1400, 0, P.cam.hy, [[0, C.sky], [1, C.skyLo]]); X.fillRect(0, 0, W, H);
      clouds(P, t); ground(P, t);
      const split = o.splitZ ?? -Infinity;
      for (const it of items(P, t, o)) if (it.z > split) it.draw();
    },
    front(P, t, o = {}) {
      const split = o.splitZ ?? -Infinity;
      for (const it of items(P, t, o)) if (it.z <= split) it.draw();
    },
  };
})();

// Registration for the studio's location browser: named spots + camera presets (paste-ready for scene code).
// (Title, description and reference art live in asset.js / README.md.)
LOCATIONS.dces = Object.assign(dces, {
  spots: {
    'Entrance mark': { x: 0, y: 0, z: 2200 },
    'Under the canopy': { x: -160, y: 0, z: 2480 },
    'Front sidewalk': { x: -700, y: 0, z: 2100 },
    'Crosswalk': { x: 0, y: 0, z: 1670 },
    'Median walk': { x: 0, y: 0, z: 1265 },
    'Flagpole': { x: 1250, y: 0, z: 2330 },
    'Parking lot': { x: 500, y: 0, z: 560 },
  },
  cameras: {
    'Entrance': { x: 0, y: 200, z: 1150, f: 1000, hy: 600 },
    'Street wide': { x: 0, y: 330, z: -700, f: 1400, hy: 520 },
    'On the mark': { x: 0, y: 130, z: 1500, f: 1000, hy: 700 },
    'Medium': { x: 0, y: 120, z: 1820, f: 1000, hy: 640 },
    'Crosswalk': { x: -120, y: 150, z: 1000, f: 900, hy: 600 },
    'Low hero': { x: 150, y: 50, z: 1900, f: 800, hy: 700 },
    'Parking lot': { x: 600, y: 160, z: 200, f: 1000, hy: 560 },
    'Aerial': { x: 0, y: 2200, z: -1600, f: 900, hy: -100 },
  },
});
