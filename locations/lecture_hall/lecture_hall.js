// locations/lecture_hall/lecture_hall.js: a tiered university lecture hall (see README.md).
//
// A 3D set in one-point perspective (engine/persp.js), built to be shot from BOTH ends:
//   podium view     cameras with dir: 1 (the default) sit up in the rows and look toward +Z: the stage, lectern, boards, screen.
//   classroom view  cameras with dir: -1 stand on the stage and look back toward −Z: the rising rows of seats and the back wall.
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   lectureHall.back(P, t, o)   walls, floor and every piece farther than o.splitZ (default: everything). Call first.
//   lectureHall.front(P, t, o)  pieces nearer than o.splitZ (rows, desks, seats, lectern…). Call after the characters.
//                               With o.toZ it stops at that depth, for several characters in different rows (far → near):
//     back(P, t, { splitZ: a.z }); draw(a); front(P, t, { splitZ: a.z, toZ: b.z }); draw(b); front(P, t, { splitZ: b.z });
//   lectureHall.seat(n, x, lift) → { x, y, z } where a student sits in row n (1 = front). The desk in front hides the legs;
//                               lift (world units) raises a small character (Alma) so more than her head clears the desk.
// o: { splitZ, screen: 0..1 (how far the projection screen is pulled down; default 1), projector: 0..1 (screen glow; default 1),
//      boardL(t), boardR(t), slide(t): draw your own chalk / slide content. Local coords: origin at the surface's top-left,
//      world units, y down; the surface size is lectureHall.BOARD_L / BOARD_R / SCREEN (w, h). Content is clipped to it. }
//
// Layout (world): side walls X = ±850, back wall Z = 0, front wall Z = 2300, ceiling Y = 1150.
// Eight tiered rows (row 1 at the front): row n's step runs Z FIRST − n·160 … FIRST − (n−1)·160 (FIRST = 1400) at Y = n·48.
// Seat blocks X −820…−330 · −230…230 · 330…820, stepped aisles between them. Top landing Z 0…120, Y 432.
// Flat floor ("the pit") Z 1400–1880; stage Z 1880–2300, X ±720, Y 40. Lectern at X −420, Z 1895–1965.
// Boards on the front wall: left X −800…−340, right X 340…800, Y 250…800; projection screen X ±300 below a roller at Y 1000.

const lectureHall = (() => {
  const HW = 850, BACK = 0, FRONT = 2300, CEIL = 1150;
  const ROWS = 8, ROW_D = 160, RISE = 48, FIRST = 1400, LAND_Z = FIRST - ROWS * ROW_D, LAND_Y = ROWS * RISE;
  const BLOCKS = [[-820, -330], [-230, 230], [330, 820]], AISLES = [[-330, -230], [230, 330]];
  const STAGE = { hw: 720, z0: 1880, y: 40 }, LECTERN = { x: -420, w: 110, z0: 1895, z1: 1965, h: 64 };
  const TABLE = { x: 330, w: 260, z0: 2040, z1: 2130, h: 76 };
  const BOARD_L = { x: -800, y: 800, w: 460, h: 550 }, BOARD_R = { x: 340, y: 800, w: 460, h: 550 };   // y = top edge (world Y)
  const SCREEN = { x: -300, y: 990, w: 600, h: 620 };                                                    // fully pulled down
  const C = {
    wall: '#E4DDD0', wallDk: '#CFC6B6', wallLt: '#EEE9DF', ceil: '#F2EFE8', ceilDk: '#DAD4C8', lamp: '#FFFBE6',
    wood: '#B98552', woodLt: '#D2A06B', woodDk: '#8C5E34', slat: '#A5714A',
    carpet: '#58687F', carpetLt: '#6D7E96', carpetDk: '#46546A', nosing: '#E3B65E',
    seat: '#C0443F', seatLt: '#D8605A', seatDk: '#93302D', shell: '#5B4A44', shellDk: '#45372F',
    board: '#2F5B4B', boardDk: '#26493D', alu: '#BCC1C7', aluDk: '#8C9299', chalk: '#F3F1E6',
    screen: '#F7F6F1', screenDk: '#D9D6CD', casing: '#ECECEA',
    stage: '#C89A62', stageLt: '#DDB27D', stageDk: '#A77A46',
    sky: '#9FD0EC', skyLt: '#E1F2FA', frame: '#7F8990', exit: '#2E9B55', steel: '#6C747C',
    line: '#4A3F45',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.3, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 5);
  const rowY = n => n * RISE, rowFront = n => FIRST - (n - 1) * ROW_D;     // n = 1..ROWS

  // ---------- a box with back-face culling (the building block of the set) ----------
  // col: one colour, or { top, nz (faces −Z, toward the back wall), pz (faces +Z, toward the stage), side, bot }
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
  // Text and pictures on a reverse-angle plane would read mirrored: draw them through this.
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };

  // ---------- the shell: ceiling, walls, floor ----------
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]);
    if (q) S(q, { fill: C.ceil, stroke: null });
    for (let z = 200; z < FRONT - 100; z += 330) for (const x of [-520, 0, 520]) {         // recessed light panels
      const l = P.poly([[x - 150, CEIL - 1, z], [x + 150, CEIL - 1, z], [x + 150, CEIL - 1, z + 130], [x - 150, CEIL - 1, z + 130]]);
      if (l) S(l, { fill: C.lamp, stroke: C.ceilDk, lwPx: px(P, 2) });
    }
    for (let z = BACK + 330; z < FRONT; z += 330) { const r = P.line([[-HW, CEIL, z], [HW, CEIL, z]]); if (r) line(r, { stroke: C.ceilDk, lwPx: px(P, 1.4) }); }
  }

  function sideWalls(P, t) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = P.poly([[x, 0, BACK], [x, 0, FRONT], [x, CEIL, FRONT], [x, CEIL, BACK]]);
      if (q) S(q, { fill: C.wall, stroke: null });
      const cr = P.line([[x, CEIL - 40, BACK], [x, CEIL - 40, FRONT]]); if (cr) line(cr, { stroke: C.wallDk, lwPx: px(P, 3) });
      // a wood dado that climbs with the rows
      const dado = [[x, 0, FRONT], [x, 150, FRONT], [x, 150, FIRST]];
      for (let n = 1; n <= ROWS; n++) dado.push([x, rowY(n) + 150, rowFront(n)], [x, rowY(n) + 150, rowFront(n) - ROW_D]);
      dado.push([x, LAND_Y + 150, BACK], [x, 0, BACK]);
      const d = P.poly(dado); if (d) S(d, { fill: C.woodLt, stroke: null });
      const rail = P.line(dado.slice(1, -1)); if (rail) line(rail, { stroke: C.woodDk, lwPx: px(P, 2.5) });
      if (sd < 0) {
        // left wall: acoustic slat panels, and a door down at the front
        for (let z = 260; z < 1400; z += 380) slatPanel(P, x, z, z + 300, 560, 1000);
        wallDoor(P, x, 1540, 1720, 0, 230);
      } else {
        // right wall: tall windows full of daylight
        for (let z = 260; z < 1500; z += 330) wallWindow(P, x, z, z + 230, 560, 1010, t);
        wallDoor(P, x, 1540, 1720, 0, 230);
      }
    }
  }
  function slatPanel(P, x, z0, z1, y0, y1) {
    const q = P.poly([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]]); if (!q) return;
    S(q, { fill: C.wood, lwPx: px(P, 1.4) });
    for (let z = z0 + 20; z < z1; z += 20) { const l = P.line([[x, y0 + 6, z], [x, y1 - 6, z]]); if (l) line(l, { stroke: C.slat, lwPx: px(P, 1.6) }); }
  }
  function wallWindow(P, x, z0, z1, y0, y1, t) {
    const q = P.poly([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]]); if (!q) return;
    S(q, { fill: linGrad(0, q[2][1], 0, q[0][1], [[0, C.sky], [1, C.skyLt]]), stroke: C.frame, lwPx: px(P, 5) });
    const glare = P.poly([[x, y0 + 60, z0 + 40], [x, y0 + 250, z0 + 40], [x, y1 - 40, z0 + 150], [x, y1 - 230, z0 + 150]]);
    if (glare) S(glare, { fill: 'rgba(255,255,255,.35)', stroke: null });
    const mid = P.line([[x, y0, (z0 + z1) / 2], [x, y1, (z0 + z1) / 2]]); if (mid) line(mid, { stroke: C.frame, lwPx: px(P, 3) });
    const tr = P.line([[x, y0 + (y1 - y0) * .72, z0], [x, y0 + (y1 - y0) * .72, z1]]); if (tr) line(tr, { stroke: C.frame, lwPx: px(P, 3) });
  }
  function wallDoor(P, x, z0, z1, y0, h) {
    const q = P.poly([[x, y0, z0], [x, y0, z1], [x, y0 + h, z1], [x, y0 + h, z0]]); if (!q) return;
    S(q, { fill: C.woodDk, stroke: C.frame, lwPx: px(P, 4) });
    const m = P.line([[x, y0, (z0 + z1) / 2], [x, y0 + h, (z0 + z1) / 2]]); if (m) line(m, { stroke: C.line, lwPx: px(P, 1.5) });
    const s = P.poly([[x, y0 + h + 30, z0 + 50], [x, y0 + h + 30, z1 - 50], [x, y0 + h + 62, z1 - 50], [x, y0 + h + 62, z0 + 50]]);
    if (s) S(s, { fill: C.exit, lwPx: px(P, 1) });                                    // EXIT sign, seen edge-on
  }

  // The back wall (Z = 0), only seen from the classroom view: doors at the top landing, the projection booth, a clock.
  function backWall(P, t) {
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wallLt, stroke: null });
      S(rectPts(-HW, -LAND_Y - 150, 2 * HW, 150), { fill: C.woodLt, stroke: null });
      line([[-HW, -LAND_Y - 150], [HW, -LAND_Y - 150]], { stroke: C.woodDk, lwPx: px(P, 2.5) });
      for (const x of [-620, 620]) {
        S(rectPts(x - 80, -LAND_Y - 235, 160, 235), { fill: C.woodDk, stroke: C.frame, lwPx: px(P, 4) });
        line([[x, -LAND_Y], [x, -LAND_Y - 235]], { stroke: C.line, lwPx: 1.5 });
        S(rectPts(x - 42, -LAND_Y - 290, 84, 34), { fill: C.exit, lwPx: 1.2 });
        readable(P, x, -LAND_Y - 273, () => { X.font = `700 22px ${FONT_TALK}`; X.fillStyle = '#F2FFF4'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('EXIT', 0, 1); });
      }
      // projection booth window with the projector's glow
      S(rectPts(-190, -860, 380, 120), { fill: linGrad(0, -860, 0, -740, [[0, '#2A3440'], [1, '#3B4A5A']]), stroke: C.frame, lwPx: 5 });
      circle(-110, -800, 26, { fill: radGrad(-110, -800, 2, 26, [[0, 'rgba(255,250,215,.95)'], [1, 'rgba(255,250,215,0)']]), stroke: null });
      // wall clock (the second hand ticks with scene time)
      readable(P, 0, -1010, () => {
        circle(0, 0, 62, { fill: '#FFFFFF', stroke: C.line, lwPx: 5 });
        for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[Math.sin(a) * 48, -Math.cos(a) * 48], [Math.sin(a) * 56, -Math.cos(a) * 56]], { stroke: C.line, lwPx: i % 3 ? 1.5 : 3 }); }
        const hand = (a, r, w, col) => line([[0, 0], [Math.sin(a) * r, -Math.cos(a) * r]], { stroke: col, lwPx: w, cap: 'round' });
        hand(TAU * (10 / 12 + t / 43200), 30, 5, C.line); hand(TAU * (7 / 60 + t / 3600), 46, 3.5, C.line); hand(TAU * Math.floor(t) / 60, 50, 1.5, '#C0443F');
        circle(0, 0, 4, { fill: C.line, stroke: null });
      });
    });
  }

  // The front wall (Z = 2300), only seen from the podium view: two chalkboards and the pull-down projection screen.
  function frontWall(P, t, o) {
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null });
      S(rectPts(-HW, -170, 2 * HW, 170), { fill: C.woodLt, stroke: null });
      line([[-HW, -170], [HW, -170]], { stroke: C.woodDk, lwPx: px(P, 2.5) });
      board(BOARD_L, o.boardL, t, 0); board(BOARD_R, o.boardR, t, 1);
      screen(o, t);
      // speakers high in the corners
      for (const x of [-760, 760]) S(rectPts(x - 45, -1080, 90, 130), { fill: '#3A3F46', lwPx: 1.4 });
    });
  }
  function board(b, draw, t, which) {
    const x = b.x, y = -b.y;
    S(rectPts(x - 16, y - 16, b.w + 32, b.h + 32), { fill: C.alu, lwPx: 1.6 });
    S(rectPts(x, y, b.w, b.h), { fill: linGrad(x, y, x + b.w, y + b.h, [[0, C.board], [1, C.boardDk]]), stroke: C.aluDk, lwPx: 1.2 });
    X.save(); X.beginPath(); X.rect(x, y, b.w, b.h); X.clip();
    for (let i = 0; i < 5; i++) {                                                        // old eraser smudges
      const cx = x + b.w * hash(i * 3.1 + which), cy = y + b.h * hash(i * 7.7 + which * 2);
      ellipse(cx, cy, 90 + 70 * hash(i + 9), 26 + 16 * hash(i + 4), { fill: 'rgba(240,240,225,.07)', stroke: null, rot: -.2 + .4 * hash(i + which) });
    }
    if (draw) { X.translate(x, y); draw(t); }
    X.restore();
    S(rectPts(x - 20, y + b.h + 14, b.w + 40, 14), { fill: C.aluDk, lwPx: 1.2 });           // chalk tray
    S(rectPts(x + 40, y + b.h + 6, 34, 9), { fill: C.chalk, lwPx: .8 }); S(rectPts(x + b.w - 90, y + b.h + 4, 60, 12), { fill: '#6B5A4E', lwPx: .8 });
  }
  function screen(o, t) {
    const d = clamp(o.screen ?? 1), glow = clamp(o.projector ?? 1) * d, s = SCREEN, h = s.h * d;
    S(rectPts(s.x - 30, -s.y - 26, s.w + 60, 30), { fill: C.casing, lwPx: 1.6 });             // roller casing
    if (d < .01) return;
    S(rectPts(s.x, -s.y + 4, s.w, h), { fill: mixCol(C.screenDk, C.screen, .4 + .6 * glow), stroke: '#2B2B2B', lwPx: 2 });
    if (o.slide && d > .98) { X.save(); X.beginPath(); X.rect(s.x + 16, -s.y + 20, s.w - 32, h - 50); X.clip(); X.translate(s.x + 16, -s.y + 20); o.slide(t); X.restore(); }
    if (glow > .01) X.fillStyle = radGrad(0, -s.y + h / 2, 20, s.w * .7, [[0, `rgba(255,255,240,${.35 * glow})`], [1, 'rgba(255,255,240,0)']]), X.fillRect(s.x, -s.y + 4, s.w, h);
    S(rectPts(s.x - 6, -s.y + h - 6, s.w + 12, 12), { fill: '#3A3A3A', lwPx: 1 });                 // weighted bottom bar
    circle(0, -s.y + h + 20, 7, { fill: '#3A3A3A', stroke: null }); line([[0, -s.y + h + 6], [0, -s.y + h + 14]], { stroke: '#3A3A3A', lwPx: 1.5 });
  }

  function pit(P) {
    const q = P.poly([[-HW, 0, FIRST], [HW, 0, FIRST], [HW, 0, FRONT], [-HW, 0, FRONT]]);
    if (q) S(q, { fill: C.carpet, stroke: null });
  }

  // ---------- depth-sorted pieces ----------
  // A row's step: seat blocks at full height, aisles split into two half-steps, plus the brass nosing on every edge.
  function rowStep(P, n) {
    const y = rowY(n), zf = rowFront(n), zb = zf - ROW_D, h = RISE / 2, col = { top: C.carpetLt, pz: C.carpetDk, nz: C.carpetDk, side: C.carpetDk };
    const segs = [[-HW, BLOCKS[0][1]], ...BLOCKS.slice(1, -1), [BLOCKS[2][0], HW]];
    for (const [a, b] of segs) box(P, a, b, 0, y, zb, zf, col, { skip: 'side', stroke: C.carpetDk });
    for (const [a, b] of AISLES) {
      box(P, a, b, 0, y, zb, zf - ROW_D / 2, col, { skip: 'side', stroke: C.carpetDk });
      box(P, a, b, 0, y - h, zf - ROW_D / 2, zf, col, { skip: 'side', stroke: C.carpetDk });
      // the little wall where a block rises above the aisle's lower half-step
      for (const [xe, faces] of [[a, P.cam.x > a], [b, P.cam.x < b]]) if (faces) {
        const q = P.poly([[xe, y - h, zf - ROW_D / 2], [xe, y - h, zf], [xe, y, zf], [xe, y, zf - ROW_D / 2]]); if (q) S(q, { fill: C.carpetDk, stroke: null });
      }
      const n1 = P.line([[a, y - h, zf], [b, y - h, zf]]), n2 = P.line([[a, y, zf - ROW_D / 2], [b, y, zf - ROW_D / 2]]);
      [n1, n2].forEach(l => l && line(l, { stroke: C.nosing, lwPx: px(P, 3) }));
      if (P.cam.z > zf) { const [sx, sy, k] = P.p((a + b) / 2, y - h - 10, zf); circle(sx, sy, clamp(4 * k, 1, 6), { fill: '#FFE9A8', stroke: null }); }   // step light
    }
    for (const [a, b] of segs) { const l = P.line([[a, y, zf], [b, y, zf]]); if (l) line(l, { stroke: C.nosing, lwPx: px(P, 3) }); }
  }
  // A row's long writing desk: a modesty panel facing the stage, and the desk top.
  function rowDesk(P, n, [a, b]) {
    const y = rowY(n), zf = rowFront(n);
    box(P, a, b, y, y + 48, zf - 14, zf - 6, { nz: C.woodDk, pz: C.wood, side: C.woodDk, top: C.woodLt });
    box(P, a - 6, b + 6, y + 48, y + 56, zf - 58, zf - 2, { nz: C.woodDk, pz: C.woodDk, side: C.woodDk, top: C.woodLt });
  }
  // A row's flip seats: red cushion toward the stage, dark shell behind.
  function rowSeats(P, n, [a, b]) {
    const y = rowY(n), zb = rowFront(n) - ROW_D, cnt = Math.floor((b - a) / 61), gap = (b - a) / cnt;
    const xs = []; for (let i = 0; i < cnt; i++) xs.push(a + gap * (i + .5));
    xs.sort((p, q) => Math.abs(q - P.cam.x) - Math.abs(p - P.cam.x));                // far seats first
    for (const x of xs) {
      box(P, x - 25, x + 25, y + 36, y + 90, zb + 16, zb + 27, { pz: C.seat, nz: C.shell, side: C.shellDk, top: C.shell, bot: C.shellDk });
      box(P, x - 24, x + 24, y + 28, y + 37, zb + 27, zb + 72, { pz: C.seatDk, nz: C.shellDk, side: C.seatDk, top: C.seatLt, bot: C.shellDk });
      box(P, x + gap / 2 - 4, x + gap / 2 + 4, y, y + 50, zb + 22, zb + 70, { pz: C.shellDk, nz: C.shellDk, side: C.shell, top: C.shell });
    }
  }
  function stage(P) {
    box(P, -STAGE.hw, STAGE.hw, 0, STAGE.y, STAGE.z0, FRONT, { top: C.stageLt, nz: C.stage, pz: C.stage, side: C.stageDk }, { skip: 'pz' });
    const e = P.line([[-STAGE.hw, STAGE.y, STAGE.z0], [STAGE.hw, STAGE.y, STAGE.z0]]); if (e) line(e, { stroke: C.stageDk, lwPx: px(P, 3) });
    for (const sd of [-1, 1]) for (let i = 0; i < 2; i++)                               // two steps up at each end
      box(P, sd > 0 ? STAGE.hw : -STAGE.hw - 90, sd > 0 ? STAGE.hw + 90 : -STAGE.hw, 0, STAGE.y * (i + 1) / 2, STAGE.z0 + 60 + i * 50, STAGE.z0 + 260, C.stage);
  }
  function lectern(P) {
    const L = LECTERN, y = STAGE.y;
    box(P, L.x - L.w / 2, L.x + L.w / 2, y, y + L.h, L.z0, L.z1, { nz: C.wood, pz: C.woodDk, side: C.woodDk, top: C.woodLt });
    box(P, L.x - L.w / 2 - 8, L.x + L.w / 2 + 8, y + L.h, y + L.h + 8, L.z0 - 8, L.z1 + 6, { nz: C.woodDk, pz: C.woodDk, side: C.woodDk, top: C.woodLt });
    if (P.cam.z < L.z0) {                                                               // crest on the front
      const [sx, sy, k] = P.p(L.x, y + L.h * .55, L.z0), r = 26 * k;
      S([[sx - r, sy - r], [sx + r, sy - r], [sx + r, sy + r * .2], [sx, sy + r * 1.2], [sx - r, sy + r * .2]], { fill: '#2F4E86', stroke: '#E3B65E', lwPx: clamp(3 * k, 1, 4) });
      S([[sx - r * .55, sy - r * .45], [sx, sy - r * .2], [sx + r * .55, sy - r * .45], [sx + r * .55, sy + r * .3], [sx, sy + r * .55], [sx - r * .55, sy + r * .3]], { fill: '#F4EFE2', stroke: null });
      line([[sx, sy - r * .2], [sx, sy + r * .55]], { stroke: '#2F4E86', lwPx: clamp(1.5 * k, .6, 2) });
    }
    const [mx, my, k] = P.p(L.x + 42, y + L.h + 8, L.z0 + 14), [ex, ey] = P.p(L.x + 36, y + L.h + 46, L.z0 + 4);      // gooseneck mic
    line([[mx, my], [lerp(mx, ex, .3), lerp(my, ey, .8)], [ex, ey]], { stroke: '#2A2A2A', lwPx: clamp(3 * k, 1, 4), smooth: true });
    circle(ex, ey, clamp(6 * k, 1.5, 8), { fill: '#2A2A2A', stroke: null });
  }
  function table(P) {
    const T = TABLE, y = STAGE.y;
    box(P, T.x - T.w / 2, T.x + T.w / 2, y + T.h - 8, y + T.h, T.z0, T.z1, { nz: C.woodDk, pz: C.woodDk, side: C.woodDk, top: C.woodLt });
    for (const dx of [-1, 1]) box(P, T.x + dx * (T.w / 2 - 14) - 5, T.x + dx * (T.w / 2 - 14) + 5, y, y + T.h - 8, T.z0 + 8, T.z1 - 8, C.steel);
    // an open laptop and a coffee mug
    box(P, T.x - 60, T.x + 10, y + T.h, y + T.h + 3, T.z0 + 18, T.z0 + 62, { nz: '#9EA4AA', pz: '#9EA4AA', side: '#80868C', top: '#B9BEC3' });
    box(P, T.x - 60, T.x + 10, y + T.h + 3, y + T.h + 50, T.z0 + 60, T.z0 + 63, { nz: '#2F3A48', pz: '#9EA4AA', side: '#80868C', top: '#B9BEC3' });
    box(P, T.x + 55, T.x + 72, y + T.h, y + T.h + 20, T.z0 + 30, T.z0 + 47, { nz: '#C0443F', pz: '#C0443F', side: '#93302D', top: '#4A2E22' });
  }
  function projector(P) {
    box(P, -5, 5, 1020, CEIL, 1098, 1108, C.steel);
    box(P, -45, 45, 985, 1020, 1070, 1140, { nz: '#E6E6E4', pz: '#D2D2D0', side: '#C4C4C2', top: '#F0F0EE', bot: '#BDBDBB' });
    if (P.cam.z > 1140) { const [sx, sy, k] = P.p(0, 1002, 1140); circle(sx, sy, clamp(11 * k, 1.5, 14), { fill: '#3A4452', stroke: C.line, lwPx: 1 }); }
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the hall.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri });
    for (let n = 1; n <= ROWS; n++) {
      const zf = rowFront(n), zb = zf - ROW_D;
      add(zb, zf, () => rowStep(P, n), 0);
      for (const bl of BLOCKS) add(zf - 58, zf - 2, () => rowDesk(P, n, bl), 1);
      for (const bl of BLOCKS) add(zb + 16, zb + 72, () => rowSeats(P, n, bl), 1);
    }
    add(BACK, LAND_Z, () => box(P, -HW, HW, 0, LAND_Y, BACK, LAND_Z, { top: C.carpetLt, pz: C.carpetDk, side: C.carpetDk }, { skip: 'side', stroke: C.carpetDk }), 0);
    add(STAGE.z0, FRONT, () => stage(P), 0);
    add(LECTERN.z0, LECTERN.z1, () => lectern(P), 1);
    add(TABLE.z0, TABLE.z1, () => table(P), 1);
    add(1070, 1140, () => projector(P), 1);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 2000 }, HW, BACK, FRONT, CEIL, FIRST, ROWS, ROW_D, RISE, BOARD_L, BOARD_R, SCREEN, LECTERN, STAGE,
    rowY, rowFront,
    seat: (n, x = 0, lift = 0) => ({ x, y: rowY(n) + lift, z: rowFront(n) - 112 }),   // where a student sits in row n (1 = front)
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      ceiling(P); sideWalls(P, t); backWall(P, t); frontWall(P, t, o); pit(P);
      const d = !Number.isFinite(o.splitZ) ? -Infinity : P.depth(o.splitZ);             // ±Infinity / unset = draw everything
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
// Podium cameras look toward the stage (dir 1); classroom cameras stand at the front and look back at the rows (dir: -1).
LOCATIONS.lecture_hall = Object.assign(lectureHall, {
  spots: {
    'Stage center': { x: 0, y: 40, z: 2000 },
    'Lectern': { x: -420, y: 40, z: 1995 },
    'At the left board': { x: -470, y: 40, z: 2200 },
    'At the right board': { x: 470, y: 40, z: 2200 },
    'Front floor': { x: 0, y: 0, z: 1650 },
    'Row 1 · center': lectureHall.seat(1, 0),
    'Row 2 · left': lectureHall.seat(2, -520),
    'Row 3 · center': lectureHall.seat(3, 110),
    'Row 3 · center (small, lifted)': lectureHall.seat(3, 110, 30),
    'Row 4 · right': lectureHall.seat(4, 560),
    'Row 6 · center': lectureHall.seat(6, -60),
    'Aisle, row 5': { x: -280, y: lectureHall.rowY(5), z: lectureHall.rowFront(5) - 120 },
    'Top landing': { x: 0, y: 384, z: 60 },
  },
  cameras: {
    'Podium · from the back row': { x: 0, y: 600, z: 60, f: 900, hy: 470, dir: 1 },
    'Podium · mid rows': { x: 120, y: 360, z: 800, f: 1000, hy: 560, dir: 1 },
    'Podium · lectern': { x: -300, y: 200, z: 1450, f: 1000, hy: 650, dir: 1 },
    'Podium · boards': { x: 0, y: 420, z: 1150, f: 900, hy: 540, dir: 1 },
    'Classroom · from the stage': { x: 0, y: 230, z: 2250, f: 900, hy: 470, dir: -1 },
    'Classroom · from the lectern': { x: -380, y: 280, z: 2060, f: 900, hy: 430, dir: -1 },
    'Classroom · front rows': { x: 0, y: 190, z: 1800, f: 1000, hy: 580, dir: -1 },
    'Classroom · upper rows': { x: 250, y: 440, z: 1150, f: 1000, hy: 540, dir: -1 },
  },
});
