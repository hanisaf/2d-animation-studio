// locations/throne_room/throne_room.js: the royal throne room (see reference_hall.jpg, reference_throne.jpg, README.md).
//
// A 3D set drawn in one-point perspective (engine/persp.js). World units: the jester is ~170 tall.
//   throneRoom.back(P, t, o)   paint the room: everything farther than o.splitZ (default: everything). Call first.
//   throneRoom.front(P, t, o)  paint the pieces nearer than o.splitZ (near columns). Call after the characters.
//   throneRoom.chandelierSlot(t, o, i, which = 0) → [X, Y, Z] world point on chandelier `which`'s ring (i = 0..4),
//                               e.g. where juggling balls get stuck. Follows the chandelier's swing.
// o: { splitZ, chandKick: [t0, strength] (knock a chandelier swinging; which = 0 is the near one), beams (0..1 light shafts) }
//
// Layout (world): side walls X = ±800, back wall Z = 2400, cornice Y = 1000, vaulted ceiling up to ~1260.
// Carpet runner X ±160 from the camera to the dais. Stage mark (where performers stand): X 0, Z 1200 (throneRoom.MARK).
// Columns X ±520 at Z 620 / 1050 / 1500 / 1950; galleries + staircases along both side walls; fountains X ±400, Z 1650.

const throneRoom = (() => {
  const HW = 800, BACK = 2400, WALL_H = 1000, VAULT = 260, COL_X = 520, COL_R = 46;
  const COL_Z = [620, 1050, 1500, 1950], GAL_X = 640, GAL_Y = 520, GAL_Z = 1350, ST_Z0 = 880;
  const CHAND = [{ x: 0, z: 1300, y: 760, len: 480, r: 120 }, { x: 0, z: 2000, y: 800, len: 440, r: 100 }];
  const C = {
    wall: '#EFCFBE', wallDk: '#DDB29E', side: '#E8C3AF', sideDk: '#D7AC98', ceil: '#F5E8DD', ceilDk: '#E3CDBD', rib: '#FBF3EA',
    col: '#F7EFE4', colDk: '#D9C5B1', floor: '#2F5E48', floorLt: '#467A60', floorDk: '#1F4434', swirl: '#6C9B82',
    carpet: '#90BAA1', carpetDk: '#6F9C83', gold: '#DDA83E', goldLt: '#F5D27C', goldDk: '#A97B22', crimson: '#A3294B', crimsonDk: '#7C1B38',
    bannerG: '#3F7A58', petal: '#E79AA8', throne: '#C44D7A', throneDk: '#96335A', throneLt: '#E07BA1', finial: '#B98AD9', cream: '#FBF3E7', water: '#7FD3D6',
    line: '#6B4A52', dark: '#8E6468',
  };
  const vY = x => WALL_H + VAULT * Math.pow(Math.max(0, 1 - (x / HW) ** 2), .55);   // ceiling height across the room
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.6, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .8, 6);                       // line widths scale a little with the lens

  // ---------- big surfaces ----------
  function ceiling(P, t) {
    const z0 = P.cam.z - 200, zs = []; for (let z = z0; z < BACK; z += 180) zs.push(z); zs.push(BACK);
    for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < 16; i++) {
      const xa = -HW + i * 100, xb = xa + 100, sh = 1 - Math.abs((xa + 50) / HW);
      const q = P.poly([[xa, vY(xa), zs[j]], [xb, vY(xb), zs[j]], [xb, vY(xb), zs[j + 1]], [xa, vY(xa), zs[j + 1]]]);
      const c = mixCol(C.ceilDk, C.ceil, .35 + .65 * sh);
      if (q) shape(q, { fill: c, stroke: c, lwPx: 1.2 });
    }
    // ribs: transverse arches at the bays, diagonals across each bay, and the ridge
    const arch = z => { const a = []; for (let i = 0; i <= 24; i++) { const x = -HW + i * HW / 12; a.push([x, vY(x), z]); } return a; };
    const bays = [450, 900, 1350, 1800, 2250];
    for (let b = 0; b < bays.length; b++) {
      const r = P.line(arch(bays[b])); if (r) { line(r, { stroke: C.ceilDk, lwPx: px(P, 7) }); line(r, { stroke: C.rib, lwPx: px(P, 3.5) }); }
      const za = bays[b] - 450, zb = bays[b];
      for (const dir of [1, -1]) {
        const d = []; for (let i = 0; i <= 20; i++) { const x = dir * (-HW + i * HW / 10); d.push([x, vY(x), lerp(za, zb, i / 20)]); }
        const q = P.line(d); if (q) line(q, { stroke: C.ceilDk, lwPx: px(P, 3) });
      }
    }
    const ridge = P.line([[0, vY(0), z0], [0, vY(0), BACK]]); if (ridge) line(ridge, { stroke: C.ceilDk, lwPx: px(P, 3) });
  }

  function backWall(P, t) {
    P.plane(BACK, k => {
      const top = []; for (let i = 0; i <= 32; i++) { const x = -HW + i * HW / 16; top.push([x, -vY(x)]); }
      S([[-HW, 0], [HW, 0], ...top.reverse()], { fill: linGrad(0, -1200, 0, 0, [[0, C.wallDk], [.25, C.wall], [1, C.wall]]), stroke: null });
      // window glow on the wall
      ellipse(0, -560, 520, 560, { fill: radGrad(0, -560, 50, 560, [[0, 'rgba(255,246,225,.55)'], [1, 'rgba(255,246,225,0)']]), stroke: null });
      // slim columns framing the window, banners, window, sill
      [-330, 330].forEach(x => slimColumn(x, 0, 950));
      [-470, 470].forEach(x => banner(x, -800, 120, 400, C.bannerG, C.petal, t));
      stainedGlass(t);
      S(rectPts(-300, -150, 600, 26), { fill: C.cream });
      // cornice
      S(rectPts(-HW, -WALL_H - 10, 2 * HW, 34), { fill: C.cream, stroke: null });
      line([[-HW, -WALL_H + 24], [HW, -WALL_H + 24]], { stroke: C.gold, lwPx: 2 });
    });
  }

  function stainedGlass(t) {
    const path = () => { X.beginPath(); X.moveTo(-250, -150); X.lineTo(-250, -820); X.bezierCurveTo(-250, -960, -120, -1040, 0, -1085); X.bezierCurveTo(120, -1040, 250, -960, 250, -820); X.lineTo(250, -150); X.closePath(); };
    X.save(); path(); X.clip();
    const sky = ['#BFE0EC', '#F4C6D2', '#F8E7C8', '#D8CBEA', '#CDE9D9', '#F9D6E0'], grass = ['#9CC49A', '#B8D6A8', '#86B386', '#A9CFA0'];
    for (let x = -250, i = 0; x < 250; x += 50, i++) for (let y = -1100, j = 0; y < -150; y += 50, j++) {
      const g = y > -430, pal = g ? grass : sky, c = pal[Math.floor(hash(i * 31 + j * 7) * pal.length)];
      X.fillStyle = c; X.fillRect(x, y, 50, 50);
    }
    // shimmer: a slow band of light sweeping across the glass
    const sx = -400 + ((t * 90) % 900);
    X.fillStyle = linGrad(sx - 120, 0, sx + 120, 0, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]); X.fillRect(-260, -1100, 520, 960);
    // castle
    const tower = (x, w, y0, h, cone, win) => {
      S(rectPts(x - w / 2, y0 - h, w, h), { fill: '#FAF1E4', lwPx: 1.4 });
      S([[x - w / 2 - 8, y0 - h], [x + w / 2 + 8, y0 - h], [x, y0 - h - cone]], { fill: '#E88FAE', lwPx: 1.4 });
      if (win) S(rectPts(x - 6, y0 - h * .7, 12, 22), { fill: '#8FC8E0', lwPx: 1 });
    };
    tower(-205, 34, -430, 120, 70, true); tower(205, 34, -430, 120, 70, true);
    tower(-130, 50, -430, 190, 95, true); tower(130, 50, -430, 190, 95, true);
    S(rectPts(-180, -560, 360, 130), { fill: '#FAF1E4', lwPx: 1.4 });
    tower(0, 76, -430, 260, 120, true);
    S([[-30, -430], [30, -430], [30, -480], [0, -505], [-30, -480]], { fill: '#C9A27A', lwPx: 1.2 });
    // the zigzag bolt
    const bolt = [[210, -1060], [120, -860], [175, -845], [70, -650], [120, -640], [30, -470]];
    line(bolt, { stroke: C.line, lwPx: 22 }); line(bolt, { stroke: '#BDE6F2', lwPx: 16 });
    // lead lines
    X.strokeStyle = 'rgba(90,70,80,.45)'; X.lineWidth = 1.6; X.beginPath();
    for (let x = -250; x <= 250; x += 50) { X.moveTo(x, -1100); X.lineTo(x, -150); }
    for (let y = -1100; y <= -150; y += 50) { X.moveTo(-260, y); X.lineTo(260, y); }
    X.stroke();
    X.restore();
    // frame + mullions
    [-85, 85].forEach(x => line([[x, -150], [x, -930]], { stroke: C.gold, lwPx: 3 }));
    path(); X.lineJoin = 'round'; X.strokeStyle = C.line; X.lineWidth = 22; X.stroke(); X.strokeStyle = C.gold; X.lineWidth = 15; X.stroke(); X.strokeStyle = C.goldLt; X.lineWidth = 4; X.stroke();
  }

  function slimColumn(x, y0, h) {
    S(rectPts(x - 26, y0 - 30, 52, 30), { fill: C.col });
    S(rectPts(x - 18, y0 - h, 36, h - 30), { fill: linGrad(x - 18, 0, x + 18, 0, [[0, C.colDk], [.4, C.col], [1, C.colDk]]) });
    S(rectPts(x - 26, y0 - h - 26, 52, 26), { fill: C.gold });
  }

  function banner(x, y, w, h, col, deco, t) {
    const sw = wob(t, .25, x * .01) * 6;
    S([[x - w / 2, y], [x + w / 2, y], [x + w / 2 + sw, y + h], [x + sw, y + h + 55], [x - w / 2 + sw, y + h]], { fill: col, stroke: C.gold, lwPx: 5 });
    line([[x - w / 2 - 14, y - 4], [x + w / 2 + 14, y - 4]], { stroke: C.goldDk, lwPx: 8 });
    const cx = x + sw * .6, cy = y + h * .62;
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circle(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15, 11, { fill: deco, stroke: C.line, lwPx: 1 }); }
    circle(cx, cy, 8, { fill: C.gold, stroke: null });
  }

  function sideWalls(P, t) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, z0 = P.cam.z - 200;
      const q = P.poly([[x, 0, z0], [x, 0, BACK], [x, WALL_H, BACK], [x, WALL_H, z0]]);
      if (q) S(q, { fill: C.side, stroke: null });
      // wainscot + rail
      const w = P.poly([[x, 0, z0], [x, 0, BACK], [x, 220, BACK], [x, 220, z0]]); if (w) S(w, { fill: '#F2DECD', stroke: null });
      const r = P.line([[x, 220, z0], [x, 220, BACK]]); if (r) line(r, { stroke: C.gold, lwPx: px(P, 3) });
      const cn = P.poly([[x, WALL_H - 30, z0], [x, WALL_H - 30, BACK], [x, WALL_H, BACK], [x, WALL_H, z0]]); if (cn) S(cn, { fill: C.cream, stroke: null });
      // arched doorways under the gallery and tall windows above it
      [1700, 2150].forEach(z => wallArch(P, x, z, 110, 0, 360, C.dark, true));
      [1600, 2050].forEach(z => wallArch(P, x, z, 60, 640, 230, '#86D0D2', false));
      // crimson banners on the near walls
      [480, 1150].forEach((z, i) => wallBanner(P, x, z, 95, 900, 380, t, i));
    }
  }
  function wallArch(P, x, z, hw, y0, h, fill, door) {
    const pts = [[x, y0, z - hw], [x, y0 + h, z - hw]];
    for (let i = 1; i < 10; i++) { const a = Math.PI * i / 10; pts.push([x, y0 + h + Math.sin(a) * hw * .9, z - Math.cos(a) * hw]); }
    pts.push([x, y0 + h, z + hw], [x, y0, z + hw]);
    const q = P.poly(pts); if (!q) return;
    S(q, { fill, stroke: C.cream, lwPx: px(P, 7) });
    if (door) { const g = P.poly(pts.map(([a, b, c]) => [a, b * .98, c])); if (g) S(g, { fill: 'rgba(60,30,40,.25)', stroke: null }); }
  }
  function wallBanner(P, x, z, hw, top, h, t, i) {
    const sw = wob(t, .22, i * .7) * 8, xi = x - Math.sign(x) * 3;
    const q = P.poly([[xi, top, z - hw], [xi, top, z + hw], [xi, top - h, z + hw + sw], [xi, top - h - 60, z + sw], [xi, top - h, z - hw + sw]]);
    if (!q) return;
    S(q, { fill: C.crimson, stroke: C.gold, lwPx: px(P, 6) });
    [[0, 16], [-16, -10], [16, -10]].forEach(([dz, dy]) => {
      if (!P.visible(z + dz)) return;
      const [cx, cy, k] = P.p(xi, top - h * .62 + dy, z + sw * .6 + dz);
      ellipse(cx, cy, 11 * k * .45, 11 * k, { fill: C.gold, stroke: C.line, lwPx: 1 });
    });
  }
  function gallery(P, sd) {
    const gx = sd * GAL_X, x = sd * HW;
    const under = P.poly([[x, GAL_Y - 40, GAL_Z], [gx, GAL_Y - 40, GAL_Z], [gx, GAL_Y - 40, BACK], [x, GAL_Y - 40, BACK]]); if (under) S(under, { fill: C.sideDk, stroke: null });
    const face = P.poly([[gx, GAL_Y - 40, GAL_Z], [gx, GAL_Y, GAL_Z], [gx, GAL_Y, BACK], [gx, GAL_Y - 40, BACK]]); if (face) S(face, { fill: C.cream });
    const endF = P.poly([[x, GAL_Y - 40, GAL_Z], [gx, GAL_Y - 40, GAL_Z], [gx, GAL_Y, GAL_Z], [x, GAL_Y, GAL_Z]]); if (endF) S(endF, { fill: C.col });
    // balustrade
    for (let z = GAL_Z + 20; z < BACK; z += 48) { const b = P.poly([[gx, GAL_Y, z - 7], [gx, GAL_Y, z + 7], [gx, GAL_Y + 85, z + 7], [gx, GAL_Y + 85, z - 7]]); if (b) S(b, { fill: C.col, lwPx: 1 }); }
    const rail = P.poly([[gx, GAL_Y + 85, GAL_Z], [gx, GAL_Y + 85, BACK], [gx, GAL_Y + 105, BACK], [gx, GAL_Y + 105, GAL_Z]]); if (rail) S(rail, { fill: C.cream });
    const hr = P.line([[gx, GAL_Y + 105, GAL_Z], [gx, GAL_Y + 105, BACK]]); if (hr) line(hr, { stroke: C.gold, lwPx: px(P, 3) });
  }
  function stairs(P, sd) {
    const x0 = sd * HW, x1 = sd * GAL_X, n = 13, rise = GAL_Y / n, run = (GAL_Z - ST_Z0) / n;
    const prof = [[ST_Z0, 0]];
    for (let i = 0; i < n; i++) { const z = ST_Z0 + i * run; prof.push([z, (i + 1) * rise], [z + run, (i + 1) * rise]); }
    prof.push([GAL_Z, 0]);
    for (let i = n - 1; i >= 0; i--) {
      const z = ST_Z0 + i * run, y = (i + 1) * rise;
      const riser = P.poly([[x0, y - rise, z], [x1, y - rise, z], [x1, y, z], [x0, y, z]]); if (riser) S(riser, { fill: '#EFE2D4', lwPx: 1 });
      if (y < P.cam.y) { const tread = P.poly([[x0, y, z], [x1, y, z], [x1, y, z + run], [x0, y, z + run]]); if (tread) S(tread, { fill: C.cream, lwPx: 1 }); }
    }
    const side = P.poly(prof.map(([z, y]) => [x1, y, z])); if (side) S(side, { fill: C.col, lwPx: 1.4 });
    const rail = P.line([[x1, 95, ST_Z0], [x1, GAL_Y + 105, GAL_Z]]); if (rail) { line(rail, { stroke: C.goldDk, lwPx: px(P, 6) }); line(rail, { stroke: C.gold, lwPx: px(P, 3.5) }); }
    const post = P.poly([[x1, 0, ST_Z0 - 10], [x1, 0, ST_Z0 + 10], [x1, 110, ST_Z0 + 10], [x1, 110, ST_Z0 - 10]]); if (post) S(post, { fill: C.gold });
  }

  function floor(P, t) {
    const z0 = P.cam.z - 200, [, yh] = P.p(0, 0, BACK);
    const q = P.poly([[-HW, 0, z0], [HW, 0, z0], [HW, 0, BACK], [-HW, 0, BACK]]);
    if (q) S(q, { fill: linGrad(0, yh, 0, H + 200, [[0, C.floorLt], [1, C.floorDk]]), stroke: null });
    // tile grid
    X.save(); X.globalAlpha = .55;
    for (let x = -HW; x <= HW; x += 200) { const l = P.line([[x, 0, z0], [x, 0, BACK]]); if (l) line(l, { stroke: C.floorDk, lwPx: 1.4 }); }
    for (let z = 0; z < BACK; z += 200) { const l = P.line([[-HW, 0, z], [HW, 0, z]]); if (l) line(l, { stroke: C.floorDk, lwPx: 1.4 }); }
    X.restore();
    // marble swirls (skip the carpet)
    X.save(); X.globalAlpha = .6;
    for (let xi = -4; xi < 4; xi++) for (let zi = 0; zi < 12; zi++) {
      const cx = xi * 200 + 100, cz = zi * 200 + 100; if (Math.abs(cx) < 200 || cz < P.cam.z + 60) continue;
      const sp = [], ph = hash(xi * 13 + zi) * TAU;
      for (let i = 0; i <= 16; i++) { const a = ph + i * .5, r = 70 - i * 3.6; sp.push([cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r]); }
      const l = P.line(sp); if (l) line(l, { stroke: C.swirl, lwPx: 1.3, smooth: true });
    }
    X.restore();
    for (const gx of [-560, -360, 360, 560]) { const l = P.line([[gx, 0, z0], [gx, 0, BACK]]); if (l) line(l, { stroke: C.gold, lwPx: px(P, 2.2) }); }
    // carpet runner
    const cz1 = BACK - 560 * .55 - 30, cp = P.poly([[-160, .5, z0], [160, .5, z0], [160, .5, cz1], [-160, .5, cz1]]);
    if (cp) S(cp, { fill: linGrad(0, yh, 0, H + 200, [[0, C.carpet], [1, C.carpetDk]]), stroke: null });
    for (const cx of [-160, -138, 138, 160]) { const l = P.line([[cx, .6, z0], [cx, .6, cz1]]); if (l) line(l, { stroke: Math.abs(cx) > 150 ? C.gold : 'rgba(250,240,200,.6)', lwPx: px(P, Math.abs(cx) > 150 ? 3 : 1.5) }); }
    // petals: a few rings of flowers and loose petals on the runner
    for (let i = 0; i < 46; i++) {
      const pz = 350 + hash(i * 3.1) * 1700, pxx = (hash(i * 7.7) - .5) * 250;
      if (pz - P.cam.z < 80) continue;
      const [sx, sy, k] = P.p(pxx, .7, pz), r = 9 * k, squash = clamp(P.cam.y / (pz - P.cam.z) * 1.4, .12, .8);
      X.save(); X.translate(sx, sy); X.scale(1, squash); X.rotate(hash(i) * TAU);
      for (let j = 0; j < 5; j++) { const a = j / 5 * TAU; ellipse(Math.cos(a) * r * .9, Math.sin(a) * r * .9, r * .75, r * .5, { fill: C.petal, stroke: null, rot: a }); }
      circle(0, 0, r * .35, { fill: '#F7E2A0', stroke: null });
      X.restore();
    }
  }

  function dais(P, t) {
    for (let i = 0; i < 3; i++) {
      const R = 560 - 90 * i, y1 = 36 * (i + 1), y0 = y1 - 36, arc = y => { const a = []; for (let j = 0; j <= 24; j++) { const an = Math.PI * j / 24; a.push([R * Math.cos(an), y, BACK - R * .55 * Math.sin(an)]); } return a; };
      const riser = P.poly([...arc(y1), ...arc(y0).reverse()]); if (riser) S(riser, { fill: '#EADCCB' });
      const top = P.poly([...arc(y1), [-R, y1, BACK], [R, y1, BACK]]); if (top) S(top, { fill: '#FBF4EA' });
    }
    const rug = []; for (let j = 0; j <= 20; j++) { const a = Math.PI * j / 20; rug.push([300 * Math.cos(a), 109, BACK - 20 - 300 * .5 * Math.sin(a)]); }
    const rq = P.poly(rug); if (rq) S(rq, { fill: C.carpet, stroke: C.gold, lwPx: 2 });
    P.plane(BACK - 110, () => { X.translate(0, -108); throne(t); });
  }

  // The throne, in world units, feet at (0, 0) and y up = negative.
  function throne(t) {
    const g = { fill: C.gold, stroke: C.line, lwPx: 1.6 };
    [-112, 112].forEach(x => { S(rectPts(x - 16, -60, 32, 50), g); ellipse(x, -8, 22, 12, g); });
    S(rectPts(-140, -118, 280, 62), { fill: linGrad(0, -118, 0, -56, [[0, C.goldLt], [1, C.gold]]), stroke: C.line, lwPx: 1.6 });
    // back panel: pointed arch
    const back = [[-112, -150], [-112, -390], [-80, -440], [0, -478], [80, -440], [112, -390], [112, -150]];
    S(back, { fill: linGrad(0, -478, 0, -150, [[0, C.throneLt], [.5, C.throne], [1, C.throneDk]]) });
    X.save(); tracePath(back, true, false); X.clip();
    X.strokeStyle = 'rgba(255,215,230,.55)'; X.lineWidth = 2; X.beginPath();
    for (let d = -600; d < 600; d += 46) { X.moveTo(d, -480); X.lineTo(d + 340, -140); X.moveTo(d, -480); X.lineTo(d - 340, -140); }
    X.stroke();
    for (let y = -455; y < -150; y += 46) for (let x = -115 + ((y / 46) % 2 ? 23 : 0); x < 115; x += 46) circle(x, y, 3.2, { fill: C.goldLt, stroke: null });
    X.restore();
    X.lineJoin = 'round'; tracePath(back, true, false); X.strokeStyle = C.line; X.lineWidth = 20; X.stroke(); X.strokeStyle = C.gold; X.lineWidth = 14; X.stroke();
    // rope edges, finials
    for (let y = -170; y > -400; y -= 17) [-126, 126].forEach(x => ellipse(x, y, 11, 9, { fill: C.gold, stroke: C.line, lwPx: 1 }));
    [[-84, -452], [-50, -474], [-17, -486], [17, -486], [50, -474], [84, -452]].forEach(([x, y]) => {
      S([[x, y - 26], [x + 11, y - 8], [x, y + 2], [x - 11, y - 8]], { fill: C.finial, smooth: .8, lwPx: 1.2 });
      circle(x - 3, y - 12, 3, { fill: 'rgba(255,255,255,.7)', stroke: null });
    });
    // seat cushion + arms
    S([[-124, -150], [124, -150], [132, -118], [-132, -118]], { fill: C.throne, smooth: .3 });
    [-1, 1].forEach(sd => {
      S([[sd * 112, -250], [sd * 172, -262], [sd * 184, -236], [sd * 150, -226], [sd * 146, -128], [sd * 126, -128], [sd * 126, -226], [sd * 112, -226]], g);
      circle(sd * 176, -250, 12, g);
    });
  }

  function beams(P, t, k) {
    if (k <= 0) return;
    X.save(); X.globalCompositeOperation = 'lighter';
    [[-170, -60, 0], [-40, 60, 1], [90, 190, 2]].forEach(([a, b, i]) => {
      const q = P.poly([[a, 850, BACK - 5], [b, 850, BACK - 5], [b * 2.4 + 60, 0, 700], [a * 2.4 - 60, 0, 700]]);
      if (q) S(q, { fill: `rgba(255,236,205,${(.055 + .025 * wob(t, .15, i * .3)) * k})`, stroke: null });
    });
    X.restore();
    // dust motes drifting in the light
    for (let i = 0; i < 40; i++) {
      const z = 900 + hash(i) * 1300, y = (hash(i + 3) * 700 + t * (12 + hash(i + 9) * 18)) % 700 + 60, x = (hash(i + 5) - .5) * 360 * (1 + (BACK - z) / 1200) + wob(t, .2, i * .1) * 20;
      if (!P.visible(z)) continue;
      const [sx, sy, kk] = P.p(x, y, z), a = .35 + .35 * wob(t, .5, hash(i + 11));
      circle(sx, sy, Math.max(1, 2.2 * kk), { fill: `rgba(255,248,225,${a * k})`, stroke: null });
    }
  }

  // ---------- items (depth sorted, split between back and front layers) ----------
  function column(P, x, z) {
    P.plane(z, () => {
      const r = COL_R;
      S(rectPts(x - r * 1.45, -44, r * 2.9, 44), { fill: C.col });
      S(rectPts(x - r * 1.25, -64, r * 2.5, 22), { fill: C.col, smooth: false });
      S(rectPts(x - r, -950, 2 * r, 888), { fill: linGrad(x - r, 0, x + r, 0, [[0, C.colDk], [.35, C.col], [.6, '#FFFBF4'], [1, C.colDk]]) });
      S(rectPts(x - r * 1.2, -975, r * 2.4, 28), { fill: C.gold });
      for (let i = 0; i < 5; i++) circle(x - r * .96 + i * r * .48, -960, r * .2, { fill: C.goldLt, stroke: C.line, lwPx: 1 });
      S([[x - r * 1.5, -1005], [x + r * 1.5, -1005], [x + r * 1.2, -975], [x - r * 1.2, -975]], { fill: C.col });
    });
  }
  function fountain(P, x, z, t) {
    const rim = y => P.floorCircle(x, z, 105, y, 28);
    const outer = rim(55), base = rim(0);
    if (!outer || !base) return;
    const front = base.filter((_, i) => i <= 14).concat(outer.filter((_, i) => i <= 14).reverse());
    S(front, { fill: C.col }); S(outer, { fill: C.cream });
    const water = P.floorCircle(x, z, 88, 50, 28); if (water) S(water, { fill: C.water, stroke: null });
    P.plane(z, k => {
      S(rectPts(x - 10, -150, 20, 100), { fill: C.col, lwPx: 1.2 });
      ellipse(x, -150, 36, 10, { fill: C.cream, stroke: C.line, lwPx: 1.2 });
      for (let j = 0; j < 6; j++) {                                    // arcing jets with droplets
        const dir = j < 3 ? -1 : 1, spread = 30 + (j % 3) * 18, pts = [];
        for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([x + dir * spread * u * 1.6, -160 - 60 * Math.sin(u * Math.PI * .8) + 110 * u * u]); }
        line(pts, { stroke: 'rgba(170,230,240,.9)', lwPx: 2.2, smooth: true });
        const u = frac(t * 1.3 + j * .17); circle(x + dir * spread * u * 1.6, -160 - 60 * Math.sin(u * Math.PI * .8) + 110 * u * u, 3.5, { fill: '#E6FAFF', stroke: null });
      }
    });
  }
  function swing(t, o, which) {
    const c = CHAND[which]; let a = .018 * wob(t, .23, which * .4);
    const kk = o.chandKick; if (kk && which === 0 && t > kk[0]) a += (kk[1] ?? .14) * Math.exp(-(t - kk[0]) * 1.3) * Math.sin((t - kk[0]) * 5.2);
    return a;
  }
  function chandelier(P, t, o, which) {
    const c = CHAND[which], a = swing(t, o, which), topY = vY(c.x) - 10;
    P.plane(c.z, k => {
      X.save(); X.translate(c.x, -topY); X.rotate(a); X.translate(0, topY);     // pivot at the ceiling
      const ry = c.y, r = c.r;
      for (let y = -topY; y < -ry - 60; y += 22) ellipse(c.x, y + 11, 5, 11, { stroke: C.goldDk, lwPx: 1.4 });
      ellipse(c.x, -ry - 55, 22, 14, { fill: C.gold, stroke: C.line, lwPx: 1.2 });
      // arms up to the candles
      const cand = []; for (let i = 0; i < 7; i++) { const an = Math.PI * (i + .5) / 7; cand.push([c.x - Math.cos(an) * r, -ry - 30 + Math.sin(an) * 14]); }
      cand.forEach(([cx, cy]) => line([[c.x, -ry + 12], [lerp(c.x, cx, .7), -ry + 22], [cx, cy + 6]], { stroke: C.goldDk, lwPx: 4, smooth: true }));
      ellipse(c.x, -ry, r, 20, { fill: null, stroke: C.line, lwPx: 8 }); ellipse(c.x, -ry, r, 20, { fill: null, stroke: C.gold, lwPx: 5 });
      // crystal drops
      for (let i = 0; i < 9; i++) { const dx = -r * .9 + i * r * .225, dy = -ry + 20 * Math.sqrt(1 - (dx / r) ** 2) + 8; line([[c.x + dx, dy - 6], [c.x + dx, dy + 6]], { stroke: 'rgba(230,240,255,.8)', lwPx: 1 }); S([[c.x + dx, dy + 6], [c.x + dx + 5, dy + 14], [c.x + dx, dy + 22], [c.x + dx - 5, dy + 14]], { fill: 'rgba(235,245,255,.85)', lwPx: .8 }); }
      S([[c.x - 40, -ry + 10], [c.x + 40, -ry + 10], [c.x, -ry + 70]], { fill: C.gold, lwPx: 1.4, smooth: .4 });
      circle(c.x, -ry + 74, 9, { fill: C.goldLt, stroke: C.line, lwPx: 1 });
      // candles + flickering flames with a glow
      cand.forEach(([cx, cy], i) => {
        S(rectPts(cx - 6, cy - 40, 12, 40), { fill: C.cream, lwPx: 1 });
        ellipse(cx, cy + 2, 14, 5, { fill: C.gold, stroke: C.line, lwPx: 1 });
        const fl = 1 + .15 * wob(t, 5 + i, hash(i)) + .1 * wob(t, 11, i * .3);
        circle(cx, cy - 52, 26, { fill: radGrad(cx, cy - 52, 2, 26, [[0, 'rgba(255,220,140,.55)'], [1, 'rgba(255,220,140,0)']]), stroke: null });
        S([[cx, cy - 40], [cx + 5, cy - 47], [cx, cy - 40 - 18 * fl], [cx - 5, cy - 47]], { fill: '#FFC24A', stroke: '#E07A2C', lwPx: 1, smooth: .8 });
      });
      X.restore();
    });
  }
  function chandelierSlot(t, o, i, which = 0) {
    const c = CHAND[which], a = swing(t, o || {}, which), topY = vY(c.x) - 10;
    const an = Math.PI * (i + 1) / 6, lx = -Math.cos(an) * c.r * .8, ly = c.y + 9;       // local, before the swing
    const d = topY - ly, rx = lx * Math.cos(a) - d * Math.sin(a), ry = lx * Math.sin(a) + d * Math.cos(a);   // rotate about the pivot
    return [c.x + rx, topY - ry, c.z - 30];
  }

  function items(P, t, o) {
    const list = [];
    for (const z of COL_Z) for (const sd of [-1, 1]) list.push({ z, draw: () => column(P, sd * COL_X, z) });
    for (const sd of [-1, 1]) list.push({ z: 1650, draw: () => fountain(P, sd * 400, 1650, t) });
    CHAND.forEach((c, i) => list.push({ z: c.z, draw: () => chandelier(P, t, o, i) }));
    return list.sort((a, b) => b.z - a.z);
  }

  return {
    MARK: { x: 0, z: 1200 }, BACK, HW,
    back(P, t, o = {}) {
      X.fillStyle = C.side; X.fillRect(0, 0, W, H);
      ceiling(P, t); backWall(P, t); sideWalls(P, t); floor(P, t);
      for (const sd of [-1, 1]) { gallery(P, sd); stairs(P, sd); }
      dais(P, t); beams(P, t, o.beams ?? 1);
      const split = o.splitZ ?? -Infinity;
      for (const it of items(P, t, o)) if (it.z > split) it.draw();
    },
    front(P, t, o = {}) {
      const split = o.splitZ ?? -Infinity;
      for (const it of items(P, t, o)) if (it.z <= split) it.draw();
    },
    chandelierSlot,
  };
})();

// Registration for the studio's location browser: named spots + camera presets (paste-ready for scene code).
// (Title, description and reference art live in asset.js / README.md.)
LOCATIONS.throne_room = Object.assign(throneRoom, {
  // named places characters stand or sit (world X, Y of the surface, Z): used by the studio's stand-in and handy in scenes
  spots: {
    'Stage mark': { x: 0, y: 0, z: 1200 },
    'Before the dais': { x: -200, y: 0, z: 1880 },
    'Throne seat': { x: 0, y: 258, z: 2275 },
    'Left gallery': { x: -720, y: 520, z: 1700 },
  },
  cameras: {
    'Wide hall': { x: 0, y: 170, z: -250, f: 1000, hy: 540 },
    'Stage mark': { x: 0, y: 120, z: 820, f: 1000, hy: 640 },
    'Throne close-up': { x: -60, y: 330, z: 1985, f: 1000, hy: 644 },
    'Chandelier': { x: 0, y: 110, z: 940, f: 1000, hy: 2200 },
    'Left gallery': { x: -380, y: 420, z: 700, f: 850, hy: 560 },
    'Low & grand': { x: 0, y: 40, z: 200, f: 800, hy: 700 },
  },
});
