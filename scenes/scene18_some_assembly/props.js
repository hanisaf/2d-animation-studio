// scenes/scene18_some_assembly/props.js: the workshop props of scene 18 (all drawn in world units through a projected point).
//
//   saWrench(x, y, s, ang)                 a big chrome adjustable wrench gripped at screen (x, y); s = px per world unit
//   saStepStool(P, X, Z)                   a two-step kid's step stool, top at Y 34 (SA_STOOL_H)
//   saPartsBox(P, X, Z, t)                 a cardboard box "ROBOT PARTS" with a spare gripper, springs and a coiled cable
//   saEasel(P, X, Z, t, { flip, front, back })   a rolling whiteboard on a stand. flip 0→1 spins the board over its axle;
//                                          front(t) / back(t) draw the two faces (local: world units, origin top-left, y down,
//                                          SA_BOARD.w × SA_BOARD.h). The back face shows once flip passes .5.
//   saMarker(text, x, y, size, k, col)     marker lettering, revealed left to right by k (0..1)

const SA_STOOL_H = 34, SA_BOARD = { w: 230, h: 136, y: 64 };   // board: width, height, bottom edge Y
const SA = { ink: '#3B2530', chrome: '#C9D1D6', chromeDk: '#8D979E', chromeLt: '#EEF2F4', stool: '#F2B33D', stoolDk: '#C98A1E',
  card: '#C99A63', cardDk: '#A57A47', cardLt: '#DDB47F', board: '#FCFDFB', frame: '#9AA3AA', marker: '#2F5FB0', red: '#D9473F', green: '#3E9A4E' };

function saWrench(x, y, s, ang) {
  X.save(); X.translate(x, y); X.rotate(ang); X.scale(s, s);
  shape([[-4, -3.2], [44, -3.6], [44, 3.6], [-4, 3.2]], { fill: SA.chrome, stroke: SA.ink, lwPx: 2 });
  line([[0, -1.2], [40, -1.4]], { stroke: SA.chromeLt, lwPx: 2 });
  shape([[40, -9], [58, -11], [62, -5], [50, -4.5], [50, 4.5], [62, 5], [58, 11], [40, 9]], { fill: SA.chromeDk, stroke: SA.ink, lwPx: 2 });
  circle(46, 0, 2.2, { fill: SA.chromeLt, stroke: SA.ink, lwPx: 1.2 });
  X.restore();
}

function saStepStool(P, x, z) {
  const h = SA_STOOL_H, w = 46, d = 30, q = (X0, X1, Y0, Y1, Z0, Z1, col) => {
    const f = P.poly([[X0, Y1, Z0], [X1, Y1, Z0], [X1, Y1, Z1], [X0, Y1, Z1]]); if (f) shape(f, { fill: mixCol(col, '#FFFFFF', .2), stroke: SA.ink, lwPx: 1.4 });
    const fr = P.poly([[X0, Y0, Z0], [X1, Y0, Z0], [X1, Y1, Z0], [X0, Y1, Z0]]); if (fr && P.cam.z < Z0) shape(fr, { fill: col, stroke: SA.ink, lwPx: 1.4 });
  };
  q(x - w / 2, x + w / 2, 0, h * .5, z - d / 2 - 14, z + d / 2, SA.stoolDk);            // lower step
  q(x - w / 2, x + w / 2, 0, h, z - d / 2, z + d / 2, SA.stool);                         // top
  const [sx, sy, k] = P.p(x, h * .5, z - d / 2); circle(sx, sy + 8 * k, 4 * k, { fill: '#FFFFFF', stroke: null, alpha: .6 });
}

function saPartsBox(P, x, z, t) {
  const w = 70, h = 46, d = 50;
  const top = P.poly([[x - w / 2, h, z - d / 2], [x + w / 2, h, z - d / 2], [x + w / 2, h, z + d / 2], [x - w / 2, h, z + d / 2]]);
  if (top) shape(top, { fill: '#5B4330', stroke: SA.ink, lwPx: 1.4 });
  // what's sticking out: a spare gripper arm, a spring, a coiled cable
  const [gx, gy, k] = P.p(x - 14, h, z);
  X.save(); X.translate(gx, gy); X.scale(k, k); X.rotate(-.35 + .03 * Math.sin(t * 1.3));
  shape(rectPts(-4, -40, 8, 40), { fill: RS.metal, stroke: SA.ink, lwPx: 1.4 });
  for (let i = 0; i < 5; i++) line([[-4, -8 - i * 7], [4, -8 - i * 7]], { stroke: RS.metalDk, lwPx: 1 });
  shape([[-7, -40], [-9, -52], [-3, -47]], { fill: RS.metalDk, stroke: SA.ink, lwPx: 1.2 }); shape([[7, -40], [9, -52], [3, -47]], { fill: RS.metalDk, stroke: SA.ink, lwPx: 1.2 });
  X.restore();
  const [cx, cy] = P.p(x + 16, h, z); const sp = []; for (let i = 0; i <= 40; i++) { const a = i * .55; sp.push([cx + Math.cos(a) * 6 * k, cy - i * .6 * k + Math.sin(a) * 2.5 * k]); }
  line(sp, { stroke: '#D9473F', lwPx: clamp(2 * k, 1, 4), smooth: true });
  const fr = P.poly([[x - w / 2, 0, z - d / 2], [x + w / 2, 0, z - d / 2], [x + w / 2, h, z - d / 2], [x - w / 2, h, z - d / 2]]);
  if (fr) shape(fr, { fill: SA.card, stroke: SA.ink, lwPx: 1.4 });
  const fl = P.poly([[x - w / 2, h, z - d / 2], [x + w / 2, h, z - d / 2], [x + w / 2 - 6, h + 16, z - d / 2 - 14], [x - w / 2 + 6, h + 16, z - d / 2 - 14]]);
  if (fl) shape(fl, { fill: SA.cardLt, stroke: SA.ink, lwPx: 1.4 });
  P.plane(z - d / 2, () => { X.font = `700 9px ${FONT_TALK}`; X.fillStyle = SA.cardDk; X.textAlign = 'center'; X.fillText('ROBOT PARTS', x, -h * .45); X.fillText('⚙ FRAGILE ⚙', x, -h * .2); });
}

function saEasel(P, x, z, t, o = {}) {
  if (!P.visible(z)) return;
  const [sx, sy, k] = P.p(x, 0, z), B = SA_BOARD;
  X.save(); X.translate(sx, sy); X.scale(k, k);
  // stand: two side posts on wheeled feet, an axle at the board's middle
  for (const sd of [-1, 1]) {
    const px = sd * (B.w / 2 + 8);
    line([[px, -6], [px, -(B.y + B.h + 12)]], { stroke: SA.frame, lwPx: clamp(5 * k, 1.5, 9) });
    line([[px - 22, -6], [px + 22, -6]], { stroke: SA.frame, lwPx: clamp(5 * k, 1.5, 9) });
    for (const dx of [-20, 20]) circle(px + dx, -3, 3.5, { fill: '#3B4048', stroke: null });
  }
  const f = o.flip || 0, c = Math.cos(f * Math.PI), my = -(B.y + B.h / 2);
  X.save(); X.translate(0, my); X.scale(1, Math.max(Math.abs(c), .02)); X.translate(0, -my);
  const x0 = -B.w / 2, y0 = -(B.y + B.h);
  shape(rectPts(x0 - 6, y0 - 6, B.w + 12, B.h + 12), { fill: SA.frame, stroke: SA.ink, lwPx: 1.6 });
  shape(rectPts(x0, y0, B.w, B.h), { fill: c >= 0 ? SA.board : '#F7FBFF', stroke: null });
  X.save(); X.beginPath(); X.rect(x0, y0, B.w, B.h); X.clip(); X.translate(x0, y0);
  if (c >= 0) o.front && o.front(t);                                                                         // the girls' blueprint
  else o.back && o.back(t);                                                                                  // Housam's side
  X.restore();
  line([[x0 + 12, y0 + 10], [x0 + 60, y0 + 70]], { stroke: 'rgba(255,255,255,.75)', lwPx: clamp(9 * k, 2, 18) });
  X.restore();
  shape(rectPts(-B.w / 2 + 20, -B.y + 4, 60, 6), { fill: SA.frame, stroke: SA.ink, lwPx: 1 });             // marker tray
  for (const [i, col] of [[0, SA.marker], [1, SA.red], [2, SA.green]]) shape(rectPts(-B.w / 2 + 26 + i * 18, -B.y + 1, 14, 4), { fill: col, stroke: null });
  X.restore();
}

// Marker text, revealed left to right by k. Draw inside a board face (local units).
function saMarker(text, x, y, size, k, col = SA.marker, align = 'left') {
  if (k <= 0) return;
  X.save(); X.font = `700 ${size}px ${FONT_TALK}`; const w = X.measureText(text).width, x0 = align === 'center' ? x - w / 2 : x;
  X.beginPath(); X.rect(x0 - 2, y - size, (w + 4) * clamp(k), size * 1.6); X.clip();
  X.fillStyle = col; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.fillText(text, x0, y);
  X.restore();
}
