// scenes/book_fair/scene21c_book_fair/props.js: the book fair's stands, Safadi's books, his chalkboard, and the story clouds.
//
//   bfStand(P, x, z, t, o)         a fair stand (world units, centred on x, front edge at z): a tablecloth table, a banner on two
//                                   poles, and the books on top. o: { kind: 'kids' | 'safadi', stock 0..1, soldOut 0..1, banner }
//   bfSafadiBook(x, y, w, ang, sub)  one of Safadi's books (screen px): navy cover, gold title, his face, a subject icon
//   bfBoard(kind, x, y, w, k, t)    his floating chalkboard (screen px): 'primes' | 'count' | 'zeta' | 'strip' (from scene 06)
//   bfStory(kind, lt, x, y, w, h)   a little story playing inside a cloud: the throne room at (x, y), w × h px.
//                                   kind: 'juggle' (scene 01: the tumble, the juggling, the chandelier, the bonks) | 'fired' (scene 02)
// Pure functions of their arguments, like the rest of the engine.

const BF = { cloth: '#E25A5A', clothDk: '#B23E46', clothB: '#4168B8', clothBDk: '#2E4C8E', wood: '#B98552', woodDk: '#8A5E36', top: '#F3E6CC',
  pole: '#7A5A3A', navy: '#23315E', gold: '#E7C25A', chalk: '#F4F0E6', board: '#2E4A3C', boardDk: '#22382D', cyan: '#8CE8F2', ink: '#3B2530' };
const BF_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

// a world-space box: six faces, painted far to near
function bfBox(P, x0, x1, y0, y1, z0, z1, col, side, top) {
  const q = (pts, fill) => shape(pts.map(([x, y, z]) => { const p = P.p(x, y, z); return [p[0], p[1]]; }), { fill, stroke: BF.ink, lwPx: 1.4 });
  q([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], side);
  const camX = P.cam.x;
  if (camX < x0) q([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], side);
  if (camX > x1) q([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], side);
  if (P.cam.y > y1) q([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], top);
  q([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col);
}
const BF_STAND = { w: 240, d: 46, h: 56 };
function bfStand(P, x, z, t, o = {}) {
  const { w, d, h } = BF_STAND, x0 = x - w / 2, x1 = x + w / 2, kids = o.kind === 'kids';
  const c = kids ? [BF.cloth, BF.clothDk] : [BF.clothB, BF.clothBDk];
  // the banner poles and banner (behind the table)
  const pole = sx => { const a = P.p(sx, 0, z + d), b = P.p(sx, 205, z + d); line([[a[0], a[1]], [b[0], b[1]]], { stroke: BF.pole, lwPx: Math.max(2, 4 * P.k(z)) }); };
  pole(x0 + 10); pole(x1 - 10);
  const bl = P.p(x0 + 10, 200, z + d), br = P.p(x1 - 10, 160, z + d), k = P.k(z + d);
  shape([[bl[0], bl[1]], [br[0], bl[1]], [br[0], br[1]], [bl[0], br[1]]], { fill: kids ? '#FFF4D6' : '#FDF6E8', stroke: BF.ink, lwPx: 2 });
  X.save(); X.font = `${30 * k}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.fillStyle = kids ? '#D0508E' : BF.navy; X.fillText(o.banner || '', (bl[0] + br[0]) / 2, (bl[1] + br[1]) / 2 + 2 * k, (br[0] - bl[0]) * .92); X.restore();
  if (kids) for (let i = 0; i < 6; i++) { const u = (i + .5) / 6, bx = lerp(bl[0], br[0], u); shape(starPts(bx, bl[1] - 4 * k, 5 * k, .45), { fill: ['#F7D57A', '#F7A8D0', '#A8DCF7'][i % 3], stroke: null }); }
  // the table: cloth front and top
  bfBox(P, x0, x1, 0, h, z, z + d, c[0], c[1], BF.top);
  for (let i = 1; i < 6; i++) { const a = P.p(x0 + w * i / 6, h, z), b = P.p(x0 + w * i / 6, 4, z); line([[a[0], a[1]], [b[0], b[1]]], { stroke: rgba('#000000', .12), lwPx: 2 }); }
  // the books on top
  const stock = o.stock ?? 1, n = Math.round(10 * stock);
  for (let i = 0; i < 10; i++) {
    if (i >= n) continue;
    const bx = x0 + 26 + (i % 5) * ((w - 52) / 4) + (i < 5 ? 10 : 0), bz = z + (i < 5 ? 30 : 10), [sx, sy] = P.p(bx, h, bz), bw = 19 * P.k(bz);
    if (kids) dryCover(i % 2 ? 'green' : 'gold', sx, sy - bw * .72, bw, (hash(i) - .5) * .12, { shadow: false });
    else bfSafadiBook(sx, sy - bw * .72, bw, (hash(i) - .5) * .1, ['MATH', 'PHYSICS', 'ASTRO'][i % 3]);
  }
  // SOLD OUT!
  const so = o.soldOut ?? 0;
  if (so > .01) { const [sx, sy] = P.p(x, 182, z + d), kk = P.k(z + d) * .55 * backOut(so);
    X.save(); X.translate(sx, sy); X.rotate(-.12); X.scale(kk, kk);
    shape(rectPts(-95, -26, 190, 52), { fill: '#FFE066', stroke: BF.ink, lwPx: 4, smooth: .1 });
    X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#C0443F'; X.fillText('SOLD OUT!', 0, 3); X.restore(); }
}
function bfSafadiBook(x, y, w, ang, sub) {
  const h = w * 1.4;
  X.save(); X.translate(x, y); X.rotate(ang);
  shape(rectPts(-w / 2 + w * .05, -h / 2 + w * .05, w, h), { fill: '#F4EEDD', stroke: BF.ink, lwPx: 1.2 });
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: BF.navy, stroke: BF.ink, lwPx: 1.6 });
  shape(rectPts(-w * .42, -h * .44, w * .84, h * .2), { fill: BF.gold, stroke: null });
  circle(0, h * .05, w * .2, { fill: '#E9C3A0', stroke: BF.ink, lwPx: 1 });                                 // his big face
  shape([[-w * .2, -h * .02], [-w * .1, -h * .12], [w * .12, -h * .12], [w * .2, -h * .02]], { fill: '#3A2A22', stroke: null });
  X.font = `700 ${w * .13}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = BF.navy;
  X.fillText('PROF. SAFADI', 0, -h * .37, w * .8);
  X.fillStyle = BF.gold; X.font = `700 ${w * .16}px ${FONT_TALK}`; X.fillText(sub, 0, h * .36, w * .84);
  X.restore();
}

// ---------- the chalkboard (adapted from scene 06's lesson boards) ----------
function bfChalk(text, x, y, size, col = BF.chalk) { X.save(); X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = `700 ${size}px ${FONT_TALK}`; X.fillText(text, x, y); X.restore(); }
function bfBoard(kind, x, y, w, k, t) {
  if (k <= .01) return;
  const h = w * .62, pop = backOut(clamp(k / .2)), draw = clamp((k - .2) / .8), s = w / 600;
  X.save(); X.translate(x, y); X.scale(pop, pop); X.translate(-w / 2, -h / 2);
  shape(rectPts(-10 * s, -10 * s, w + 20 * s, h + 20 * s), { fill: '#8A5E36', stroke: BF.ink, lwPx: 3 });
  shape(rectPts(0, 0, w, h), { fill: linGrad(0, 0, 0, h, [[0, BF.board], [1, BF.boardDk]]), stroke: null });
  X.scale(s, s);                                                                // board units: 600 × 372
  const title = { primes: 'THE PRIME RHYTHM', count: 'COUNTING PRIMES', zeta: 'A NEW LENS: ZETA', strip: 'THE QUESTION' }[kind];
  bfChalk(title, 300, 38, 34, BF.gold); line([[30, 64], [570, 64]], { stroke: BF.cyan, lwPx: 2 });
  if (kind === 'primes') for (let n = 1; n <= 30; n++) {
    const col = (n - 1) % 10, row = Math.floor((n - 1) / 10), cx = 48 + col * 56, cy = 110 + row * 70, pr = BF_PRIMES.includes(n);
    const lit = pr && draw > BF_PRIMES.indexOf(n) / 10;
    circle(cx, cy, 22, { fill: lit ? BF.gold : 'rgba(255,255,255,.07)', stroke: pr ? BF.gold : 'rgba(255,255,255,.25)', lwPx: lit ? 3 : 1.5 });
    bfChalk(String(n), cx, cy + 2, 22, lit ? BF.ink : BF.chalk);
  }
  if (kind === 'primes') bfChalk('no fixed beat between primes', 300, 335, 26, BF.cyan);
  if (kind === 'count') {
    const x0 = 70, y0 = 320, ww = 480, hh = 220, xp = n => x0 + (n - 1) / 29 * ww, yp = c => y0 - c / 10 * hh;
    line([[x0, y0 - hh], [x0, y0], [x0 + ww, y0]], { stroke: BF.chalk, lwPx: 3 });
    const upto = Math.max(2, Math.floor(2 + draw * 28)), st = [[xp(1), yp(0)]];
    for (let n = 2; n <= upto; n++) { const b = BF_PRIMES.filter(p => p < n).length, a = b + (BF_PRIMES.includes(n) ? 1 : 0); st.push([xp(n), yp(b)], [xp(n), yp(a)]); }
    line(st, { stroke: BF.gold, lwPx: 5 });
    if (draw > .6) { const cv = []; for (let n = 2; n <= 30; n += .5) cv.push([xp(n), yp(.65 + 9.15 * ((n - 1) / 29) ** .77)]); line(cv, { stroke: BF.cyan, lwPx: 4, smooth: true }); }
    bfChalk('steps', 160, 350, 24, BF.gold); bfChalk('smooth trend', 440, 350, 24, BF.cyan);
  }
  if (kind === 'zeta') {
    X.save(); X.globalAlpha *= draw;
    for (let i = 0; i < 6; i++) { const cx = 70 + i * 46, cy = 170 + 20 * Math.sin(i * 1.2); circle(cx, cy, 20, { fill: 'rgba(140,232,242,.16)', stroke: BF.cyan, lwPx: 2 }); bfChalk(String(i + 1), cx, cy, 20); }
    line([[350, 170], [410, 170]], { stroke: BF.gold, lwPx: 5 }); shape([[420, 170], [404, 160], [404, 180]], { fill: BF.gold, stroke: null });
    circle(490, 170, 70, { fill: 'rgba(255,225,138,.15)', stroke: BF.gold, lwPx: 5 }); bfChalk('ζ(s)', 490, 172, 50, BF.gold);
    bfChalk('a mathematical machine', 300, 290, 28); bfChalk('that studies prime patterns', 300, 330, 24, BF.cyan);
    X.restore();
  }
  if (kind === 'strip') {
    const xs = [150, 300, 450];
    shape(rectPts(xs[0], 90, xs[2] - xs[0], 210), { fill: 'rgba(140,232,242,.09)', stroke: BF.cyan, lwPx: 2 });
    for (let i = 0; i < 3; i++) { line([[xs[i], 90], [xs[i], 300]], { stroke: i === 1 ? BF.gold : BF.cyan, lwPx: i === 1 ? 6 : 2 }); bfChalk(['0', '1/2', '1'][i], xs[i], 330, 30, i === 1 ? BF.gold : BF.chalk); }
    [130, 175, 220, 265].forEach((yy, i) => { const p = backOut(clamp(draw * 5 - i)); if (p > 0) circle(xs[1], yy, 11 * p, { fill: BF.gold, stroke: BF.chalk, lwPx: 2 }); });
    bfChalk('ALL the interesting zeros here?', 300, 80, 24, BF.gold);
  }
  X.restore();
}

// ---------- the story clouds: the throne room, as Alma tells it ----------
const BF_TR = { FZ: 1200, PZ: null, SEAT_Y: 258 };
function bfStory(kind, lt, x, y, w, h) {
  const R = LOCATIONS.throne_room;
  const k = Math.max(w / W, h / H);
  X.save(); X.beginPath(); X.rect(x - w / 2, y - h / 2, w, h); X.clip(); X.translate(x - W * k / 2, y - H * k / 2); X.scale(k, k);
  const ov = OVERLAYS.length;
  if (kind === 'juggle') bfJuggle(R, lt); else bfFired(R, lt);
  OVERLAYS.length = ov;                                                         // nothing from inside the cloud may paint over the frame
  X.restore();
}
function bfJuggle(R, lt) {
  // 0–4.6 tumble in and ta-da · 4.6–9.5 juggling · 9.5–11.6 the fling: the balls lodge in the chandelier · 13.8, 14.4, 15.0 the bonks
  const cam = { x: 0, y: 150, z: 760, f: 1000, hy: 520 }, P = persp(cam), FZ = R.MARK.z, ROOM = { splitZ: FZ, chandKick: [11.0, 1] };
  R.back(P, lt, ROOM);
  const fx = lt < 3 ? lerp(-420, 0, ease(seg(lt, .2, 3))) : 0, [sx, sy, k] = P.p(fx, 0, FZ), s = JF_UNIT * k;
  let o = { t: lt, eyes: 'happy', mouth: 'grin' };
  if (lt < 3) o = { ...o, rot: -TAU * 2 * ease(seg(lt, .2, 2.8)), jump: 4 * Math.sin(Math.PI * seg(lt, .2, 2.8)) };
  else if (lt < 4.6) o = { ...o, handL: [-6, -24], handR: [6, -24], handPoseL: 'open', handPoseR: 'open', jump: 1.2 * kick(lt, 3.0, 6) };
  const c = cascade(lt, { n: 3, tau: .3, h: 14, t0: 4.8 });
  const juggling = lt > 4.6 && lt < 9.6;
  if (juggling) o = { ...o, handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup', lookY: -.5 };
  if (lt > 9.6 && lt < 13.6) o = { ...o, handL: [-5.4, -25], handR: [5.4, -25], handPoseL: 'open', handPoseR: 'open', lookY: -1, mouth: lt > 11.6 ? 'o' : 'grin', eyes: lt > 11.6 ? 'wide' : 'happy' };
  const bonks = [13.8, 14.4, 15.0];
  if (lt > 13.6) o = { ...o, eyes: lt > 13.8 ? 'swirl' : 'wide', mouth: 'wobble', stars: lt > 13.8 ? 1 : 0, handL: [-3.6, -11], handR: [3.6, -11], sq: .15 * Math.max(...bonks.map(b => kick(lt, b, 8))), lookY: -1 };
  const A = jester(sx, sy, s, o);
  if (juggling) c.balls.forEach(b => jugglerBall(sx + b.x * s, sy + b.y * s, BALL_R * s, b.col, b.rot));
  for (let i = 0; i < 3; i++) {                                                // the fling, the chandelier, the drop
    const slot = R.chandelierSlot(lt, ROOM, i), [cx, cy] = P.p(...slot), head = [A.hatTip[0], A.hatTip[1]];
    let p = null;
    if (lt > 9.6 && lt < 11.0) { const u = seg(lt, 9.6, 11.0); p = mixPt(A.handR, [cx, cy], easeOut(u)); p[1] -= 120 * Math.sin(Math.PI * u) * k; }
    else if (lt >= 11.0 && lt < bonks[i] - .35) p = [cx, cy];
    else if (lt >= bonks[i] - .35 && lt < bonks[i]) p = mixPt([cx, cy], head, easeIn(seg(lt, bonks[i] - .35, bonks[i])));
    else if (lt >= bonks[i] && lt < bonks[i] + .8) { const v = seg(lt, bonks[i], bonks[i] + .8); p = [head[0] + (i - 1 || 1) * 260 * v * k, head[1] - 200 * k * Math.sin(Math.PI * v) + 300 * k * v * v]; }
    if (p) jugglerBall(p[0], p[1], BALL_R * s, JUGGLE_COLS[i], lt * 4);
  }
  R.front(P, lt, ROOM);
  bonks.forEach(b => { if (lt > b && lt < b + .6) bfPow('BONK!', A.hatTip[0] + 120, A.hatTip[1] - 60, 110 * backOut(seg(lt, b, b + .15))); });
}
function bfFired(R, lt) {
  // 0–3.6 bored Pearl, Fester tumbles in · 3.6 the chicken joke · 6.6 "…why?" · 8.0 the punchline · 10.6 FIRED! · 14.2 the sigh
  const PZ = R.BACK - 125, FX = -200, FZ = 1880, cam = { x: -90, y: 210, z: 1260, f: 1000, hy: 540 }, P = persp(cam), ROOM = { splitZ: FZ };
  R.back(P, lt, ROOM);
  const [px, py, pk] = P.p(0, BF_TR.SEAT_Y, PZ), fired = lt > 10.6 && lt < 14.0;
  pearl(px, py, PP_UNIT * pk, { t: lt, sit: 1, flip: true, wag: .22 * wob(lt, .45), eyes: fired ? 'angry' : lt > 8.4 && lt < 10.6 ? 'bored' : 'bored', mouth: lt < 2.4 ? 'yawn' : fired ? 'open' : lt > 6.6 && lt < 7.6 ? 'o' : 'flat',
    point: fired ? 1 : 0, pointAng: -.2, headTilt: lt > 12 ? .3 : 0, brows: fired ? 'angry' : 'flat' });
  const enter = seg(lt, .4, 3.0), fx = lerp(-650, FX, ease(enter)), [sx, sy, k] = P.p(fx, 0, FZ), s = JF_UNIT * k;
  let o = { t: lt, eyes: 'happy', mouth: 'grin', handL: [-6, -24], handR: [6, -24], handPoseL: 'open', handPoseR: 'open' };
  if (lt < 3) o = { ...o, rot: -TAU * ease(enter), jump: 3 * Math.sin(Math.PI * enter) };
  if (lt > 3.6 && lt < 8.0) o = { ...o, handR: [5, -20], handL: [-3.6, -11], mouth: lipFlap(lt, lt < 6.2, 'grin'), eyes: 'open', lookX: .6 };
  if (lt > 8.0 && lt < 10.6) o = { ...o, eyes: 'happy', mouth: 'open', handL: [-4, -14], handR: [4, -14], dy: .4 * Math.abs(Math.sin(lt * 10)) };
  if (lt > 10.6) o = { ...o, eyes: lt < 11.4 ? 'wide' : 'open', mouth: lt > 14 ? 'flat' : 'o', handL: [-3.6, -11], handR: [3.6, -11], hatDroop: ease(seg(lt, 11.2, 12.6)), brows: 'worried', lookX: .6 };
  jester(sx, sy, s, o);
  R.front(P, lt, ROOM);
  if (lt > 10.6 && lt < 11.4) bfPow('FIRED!', px - 260, py - 180, 120 * backOut(seg(lt, 10.6, 10.8)));
}
function bfPow(txt, x, y, size) {
  X.save(); X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = size * .14; X.strokeStyle = BF.ink; X.strokeText(txt, x, y); X.fillStyle = '#FFE066'; X.fillText(txt, x, y); X.restore();
}
