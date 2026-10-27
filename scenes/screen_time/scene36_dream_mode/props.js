// Scene 36 props: the dream's four game worlds and their game furniture. Everything draws in screen px, full frame.
//   dmChar(who, cx, cy, headR, o)      any cast rig placed so its head centre sits at (cx, cy) with head radius headR (portraits, cockpits)
//   dmBG(c0, c1, c2) · dmStars(t, n, vx, vy, o) · dmGrid(t, col, o)          backgrounds: gradient, streaming stars, a neon floor grid
//   dmCRT(t, k, fn)                    a chunky CRT; fn(w, h) paints its 1400 × 790 screen; k 0..1 is the power-on
//   dmCard(t, t0, n, title, sub, col, bg)   a WORLD n title card (bounce-in title, typed subtitle)
//   dmSlam / dmPop / dmBar / dmLetterbox / dmPixelWipe / dmCursor / dmCartridge     game text, health bars, transitions, menus
//   dmShip(x, y, s, col, t, o)         a little rocket, nose to the right; o.pilots: [who…] sit in the dome
//   dmFormula / dmBroccoli / dmBoom    bullets, bombs and explosions
//   dmStadium(t, o) · dmGoalFrame(x, y, s)   a floodlit stadium (side view) and a goal
//   dmBlock(x, y, B, kind) · dmBlockWorld(t, B, o) · dmCreeper(x, y, B, t, o) · dmCube(x, y, R, t, k)   Craft Blocks
//   dmPlanet(x, y, r, o) · dmArena(t, o)                Fight Planet
//   dmClock(x, y, r, t, o)             the final boss: a giant angry alarm clock
// Shared with earlier scenes: stArcade (scene 32), rvtSunburst / rvtSpeedLines / rvtLightning / rvtConfetti / rvtFirework (scene 31).
const DM = {
  ink: PAL.ink, night: '#0B0820', neon: '#FF4FD8', cyan: '#4FF0FF', gold: '#FFD84A', mint: '#5CF2B0', red: '#FF4A4A',
  p1: '#FFD84A', p2: '#5CF2B0', kids: { housam: '#4A7BFF', alma: '#B678E0', jenna: '#F08AC0', danny: '#35C2C2' },
};
const DM_RIG = { safadi, sami, housam, alma, jenna, danny, robo: roboSafadi, neptune, clawd, jester, pearl, dragon };
const DM_BASE = {                                                             // a pleasant default pose per rig
  safadi: { mouth: 'smile' }, sami: { mouth: 'smile' }, housam: { mouth: 'smile', giraffe: false }, alma: { mouth: 'smile' }, jenna: { mouth: 'smile', giraffe: false }, danny: { mouth: 'smile' },
  robo: { eyes: 'open', mouth: 'smile', hum: false }, neptune: { sit: 1, trident: true, mouth: 'grin' }, clawd: { eyes: 'happy', mouth: 'smile' },
  jester: { mouth: 'grin' }, pearl: { sit: 1, mouth: 'smile' }, dragon: { mouth: 'grin', wings: .6 },
};
// Place a rig by its head: measure it once at s = 1, then scale and offset so the head centre lands on (cx, cy).
function dmChar(who, cx, cy, headR, o = {}) {
  const fn = DM_RIG[who], opts = { t: T, noShadow: true, boil: .5, ...DM_BASE[who], ...o };
  const A = measure(() => { X.setTransform(1, 0, 0, 1, 0, 0); return fn(0, 0, 1, opts); }), top = A.top || A.crown || A.hatTip || [A.head[0], A.head[1] - 5];
  const r1 = Math.max(1, Math.hypot(top[0] - A.head[0], top[1] - A.head[1])), s = headR / r1;
  return fn(cx - A.head[0] * s, cy - A.head[1] * s, s, opts);
}

// ---------- backgrounds ----------
function dmBG(c0, c1, c2 = c1) { X.fillStyle = linGrad(0, 0, 0, H, [[0, c0], [.6, c1], [1, c2]]); X.fillRect(0, 0, W, H); }
function dmStars(t, n = 120, vx = -300, vy = 0, o = {}) {
  for (let i = 0; i < n; i++) {
    const sp = .3 + hash(i * 1.7) * 1.2, x = ((hash(i) * (W + 200) + vx * sp * t) % (W + 200) + W + 200) % (W + 200) - 100,
      y = ((hash(i + 40) * H + vy * sp * t) % H + H) % H, r = (o.r ?? 2.2) * sp, str = o.streak ?? 0;
    if (str > 0) line([[x, y], [x - vx * sp * str, y - vy * sp * str]], { stroke: rgba(o.col || '#FFFFFF', .5 + .4 * hash(i * 3)), lwPx: r });
    else circle(x, y, r * (.7 + .3 * Math.sin(t * 5 + i)), { fill: rgba(o.col || '#FFFFFF', .5 + .5 * hash(i * 3)), stroke: null });
  }
}
function dmGrid(t, col = DM.neon, o = {}) {                                    // a synthwave floor grid scrolling toward us
  const hy = o.hy ?? H * .62;
  X.fillStyle = linGrad(0, hy, 0, H, [[0, rgba(col, .0)], [1, rgba(col, .18)]]); X.fillRect(0, hy, W, H - hy);
  for (let i = -16; i <= 16; i++) line([[W / 2 + i * 40, hy], [W / 2 + i * 260, H]], { stroke: rgba(col, .55), lwPx: 2 });
  for (let j = 0; j < 14; j++) { const u = frac(j / 14 + t * .35), y = hy + (H - hy) * u * u; line([[0, y], [W, y]], { stroke: rgba(col, .25 + .5 * u), lwPx: 1 + 2 * u }); }
}

// ---------- the CRT ----------
const DM_SCR = { x: 260, y: 110, w: 1400, h: 790 };
function dmCRT(t, k, fn) {
  dmBG('#1A1426', '#0E0A16');
  const { x, y, w, h } = DM_SCR, b = 60;
  shape(rectPts(x - b - 20, y - b - 20, w + 2 * b + 40, h + 2 * b + 120), { fill: '#C9C1B4', stroke: DM.ink, lwPx: 8, smooth: .04 });   // the plastic case
  shape(rectPts(x - b, y - b, w + 2 * b, h + 2 * b), { fill: '#2B2730', stroke: DM.ink, lwPx: 6, smooth: .05 });
  for (let i = 0; i < 6; i++) line([[x + w - 300 + i * 40, y + h + b + 30], [x + w - 300 + i * 40, y + h + b + 75]], { stroke: rgba(DM.ink, .5), lwPx: 6 });   // the speaker grille
  circle(x + 40, y + h + b + 52, 16, { fill: k > .05 ? '#FF5A5A' : '#5A2A2A', stroke: DM.ink, lwPx: 3 });                           // the power light
  X.save(); X.beginPath(); X.roundRect(x, y, w, h, 40); X.clip();
  X.fillStyle = '#05040A'; X.fillRect(x, y, w, h);
  const vis = clamp(k * 1.6), hh = h * Math.max(.006, easeOut(seg(k, .35, 1)));                                                   // power-on: a line opens into the picture
  if (vis > 0) {
    X.save(); X.beginPath(); X.rect(x, y + h / 2 - hh / 2, w * clamp(k * 3), hh); X.clip();
    X.save(); X.translate(x, y); withBoil(0, () => fn(w, h)); X.restore();
    X.restore();
    if (k < 1) { X.fillStyle = rgba('#FFFFFF', .8 * (1 - seg(k, .4, 1))); X.fillRect(x, y + h / 2 - hh / 2, w * clamp(k * 3), hh); }
  }
  for (let yy = y; yy < y + h; yy += 6) { X.fillStyle = 'rgba(0,0,0,.12)'; X.fillRect(x, yy, w, 2); }                          // scanlines
  X.fillStyle = radGrad(x + w / 2, y + h / 2, h * .45, h * 1.05, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.55)']]); X.fillRect(x, y, w, h);
  X.fillStyle = 'rgba(255,255,255,.05)'; X.beginPath(); X.moveTo(x + 200, y); X.lineTo(x + 520, y); X.lineTo(x + 160, y + h); X.lineTo(x - 160, y + h); X.fill();
  X.restore();
}

// ---------- game text ----------
function dmSlam(txt, x, y, size, col, t, t0, life = 1.6, o = {}) {
  const a = t - t0; if (a < 0 || a > life) return;
  const k = backOut(seg(a, 0, .3)) * (1 + .08 * kick(t, t0 + .3, 9)), fade = 1 - seg(a, life - .25, life);
  X.save(); X.translate(x + (o.shake ? (hash(Math.floor(t * 24)) - .5) * o.shake : 0), y); X.rotate((o.rot ?? -.05) + .02 * Math.sin(a * 9)); X.scale(k, k); X.globalAlpha = fade;
  stArcade(txt, 0, 0, size, col); X.restore();
}
function dmPop(txt, x, y, size, col, t, t0, life = 1) {
  const a = t - t0; if (a < 0 || a > life) return;
  X.save(); X.globalAlpha = 1 - seg(a, life * .6, life); X.translate(x, y - 90 * easeOut(a / life)); const k = backOut(seg(a, 0, .2)); X.scale(k, k);
  stArcade(txt, 0, 0, size, col); X.restore();
}
function dmBar(x, y, w, h, k, col, label, right = false) {                    // a health bar; right: drains toward the right edge
  shape(rectPts(x - 6, y - 6, w + 12, h + 12), { fill: '#16121E', stroke: DM.ink, lwPx: 5 });
  shape(rectPts(x, y, w, h), { fill: '#5A1E28', stroke: null });
  const kw = w * clamp(k); if (kw > 1) shape(rectPts(right ? x + w - kw : x, y, kw, h), { fill: linGrad(0, y, 0, y + h, [[0, mixCol(col, '#FFFFFF', .35)], [1, col]]), stroke: null });
  if (label) { X.save(); stArcade(label, right ? x + w : x, y - 34, 40, '#FFFFFF', right ? 'right' : 'left'); X.restore(); }
}
function dmLetterbox(k) { if (k <= 0) return; X.fillStyle = '#000'; X.fillRect(0, 0, W, 130 * k); X.fillRect(0, H - 130 * k, W, 130 * k); }
function dmPixelWipe(u, col = '#000000', o = {}) {                            // pixel squares sweep across: u 0 → 1 covers, 1 → 2 uncovers
  if (u <= 0 || u >= 2) return;
  const S = o.size ?? 96;
  for (let gx = 0; gx < W / S + 1; gx++) for (let gy = 0; gy < H / S + 1; gy++) {
    const d = (gx / (W / S) * .7 + gy / (H / S) * .3) * .8 + hash(gx * 7 + gy * 13) * .2;
    const on = u < 1 ? u > d : u - 1 < d; if (!on) continue;
    X.fillStyle = col; X.fillRect(gx * S, gy * S, S + 1, S + 1);
  }
}
function dmCursor(x, y, w, h, label, col, t) {                               // a blinking selection frame with its player tag
  const p = 1 + .04 * Math.sin(t * 12);
  X.save(); X.translate(x + w / 2, y + h / 2); X.scale(p, p);
  shape(rectPts(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20), { fill: null, stroke: col, lwPx: 12 });
  shape([[-24, -h / 2 - 60], [24, -h / 2 - 60], [0, -h / 2 - 22]], { fill: col, stroke: DM.ink, lwPx: 4 });
  stArcade(label, 0, -h / 2 - 90, 46, col);
  X.restore();
}
function dmCartridge(x, y, w, label, col, t, art) {                           // a game cartridge with its label art
  const h = w * 1.15;
  shape(rectPts(x - w / 2, y - h / 2, w, h), { fill: '#4A4652', stroke: DM.ink, lwPx: 6, smooth: .06 });
  for (let i = 0; i < 5; i++) line([[x - w * .3 + i * w * .15, y - h / 2 + 12], [x - w * .3 + i * w * .15, y - h / 2 + 40]], { stroke: rgba('#000', .35), lwPx: 6 });
  shape(rectPts(x - w * .42, y - h * .3, w * .84, h * .62), { fill: col, stroke: DM.ink, lwPx: 4, smooth: .04 });
  X.save(); X.beginPath(); X.rect(x - w * .42, y - h * .3, w * .84, h * .62); X.clip(); art(x, y, w * .84, h * .62); X.restore();
  stArcade(label, x, y + h * .4, w * .1, '#FFFFFF');
}

// ---------- World 1: space ----------
function dmShip(x, y, s, col, t, o = {}) {                                    // body ~6s long; the dome sits on top; pilots inside
  X.save(); X.translate(x, y); X.rotate(o.tilt || 0); X.scale(o.flip ? -1 : 1, 1);
  const fl = 1 + .3 * Math.sin(t * 40 + x);                                   // the flame
  shape([[-3 * s, -.5 * s], [-(4.4 + 1.2 * fl) * s, 0], [-3 * s, .5 * s]], { fill: '#FFB43A', stroke: null });
  shape([[-3 * s, -.28 * s], [-(3.8 + .7 * fl) * s, 0], [-3 * s, .28 * s]], { fill: '#FFF2A8', stroke: null });
  shape([[-3.2 * s, -.9 * s], [-3.9 * s, -1.9 * s], [-2.2 * s, -.9 * s]], { fill: mixCol(col, '#000', .25), stroke: DM.ink, lwPx: 4 });   // fins
  shape([[-3.2 * s, .9 * s], [-3.9 * s, 1.9 * s], [-2.2 * s, .9 * s]], { fill: mixCol(col, '#000', .25), stroke: DM.ink, lwPx: 4 });
  shape([[-3.2 * s, -1 * s], [1.6 * s, -1 * s], [3.2 * s, 0], [1.6 * s, 1 * s], [-3.2 * s, 1 * s]], { fill: col, stroke: DM.ink, lwPx: 5, smooth: .35 });
  shape([[-2.6 * s, .3 * s], [1.8 * s, .3 * s], [2.6 * s, .05 * s]], { fill: null, stroke: rgba('#FFFFFF', .45), lwPx: 4, closed: false });
  for (let i = 0; i < 3; i++) circle(-1.9 * s + i * .7 * s, .55 * s, .14 * s, { fill: '#FFE066', stroke: DM.ink, lwPx: 2 });
  X.restore();
  const pilots = o.pilots || [], n = pilots.length, dr = s * (n > 1 ? 1.25 : 1.05), dx = x + (o.flip ? .3 : -.3) * s, dy = y - .9 * s;
  if (n) {                                                                    // the glass dome with the pilots' heads and shoulders
    X.save(); X.beginPath(); X.ellipse(dx, dy, dr * (n > 1 ? 1.5 : 1), dr, 0, Math.PI, 0); X.closePath(); X.clip();
    X.fillStyle = rgba('#BFF3FF', .35); X.fillRect(dx - dr * 2, dy - dr * 2, dr * 4, dr * 2);
    pilots.forEach((p, i) => { const px = dx + (n > 1 ? (i - .5) * dr * 1.15 : 0); dmChar(p.who, px, dy - dr * .38, dr * .52, p.o || {}); });
    X.restore();
    X.save(); X.beginPath(); X.ellipse(dx, dy, dr * (n > 1 ? 1.5 : 1), dr, 0, Math.PI, 0); X.closePath();
    X.lineWidth = 5; X.strokeStyle = DM.ink; X.stroke(); X.restore();
    shape([[dx - dr * .6 * (n > 1 ? 1.5 : 1), dy - dr * .55], [dx - dr * .3 * (n > 1 ? 1.5 : 1), dy - dr * .8]], { fill: null, stroke: rgba('#FFFFFF', .7), lwPx: 6, closed: false });
  }
}
function dmFormula(x, y, size, txt, t) {                                      // a glowing formula bullet
  X.save(); X.globalCompositeOperation = 'lighter';
  X.fillStyle = radGrad(x, y, 0, size * 1.3, [[0, rgba('#FFE89A', .8)], [1, rgba('#FFB43A', 0)]]); X.fillRect(x - size * 1.4, y - size * 1.4, size * 2.8, size * 2.8);
  X.restore();
  stArcade(txt, x, y, size, '#FFF4C8');
}
function dmBroccoli(x, y, s, rot = 0) {
  X.save(); X.translate(x, y); X.rotate(rot);
  shape([[-.25 * s, 0], [.25 * s, 0], [.18 * s, 1.1 * s], [-.18 * s, 1.1 * s]], { fill: '#9BD46A', stroke: DM.ink, lwPx: 3 });
  for (const [bx, by, r] of [[-.45, -.1, .42], [.45, -.1, .42], [0, -.45, .5], [-.2, .1, .35], [.25, .12, .35]]) circle(bx * s, by * s, r * s, { fill: '#3E9A35', stroke: DM.ink, lwPx: 3 });
  for (const [bx, by] of [[-.4, -.25], [.1, -.6], [.5, -.2]]) circle(bx * s, by * s, .1 * s, { fill: '#6CC24A', stroke: null });
  X.restore();
}
function dmBoom(x, y, r, u, col = '#FFE066') {                                // an explosion: u 0..1 over its life
  if (u <= 0 || u >= 1) return;
  const p = backOut(seg(u, 0, .35)) * (1 - seg(u, .7, 1));
  shape(starPts(x, y, r * p, .45, 12, u * 2), { fill: col, stroke: '#E8572E', lwPx: 5 });
  shape(starPts(x, y, r * .55 * p, .5, 10, -u * 3), { fill: '#FFFFFF', stroke: null });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + x, d = r * (.4 + 1.2 * easeOut(u)); shape(rectPts(x + Math.cos(a) * d - 9, y + Math.sin(a) * d - 9 + 80 * u * u, 18, 18), { fill: '#B9C2CC', stroke: DM.ink, lwPx: 2 }); }
}
function dmPlanet(x, y, r, o = {}) {
  const c0 = o.c0 || '#FFB46B', c1 = o.c1 || '#D2472E';
  if (o.ring) { X.save(); X.translate(x, y); X.rotate(o.ringAng ?? -.25); X.scale(1, .26); X.beginPath(); X.arc(0, 0, r * 1.9, Math.PI, TAU); X.lineWidth = r * .22; X.strokeStyle = rgba(o.ring, .85); X.stroke(); X.restore(); }
  circle(x, y, r, { fill: radGrad(x - r * .35, y - r * .35, r * .1, r * 1.15, [[0, c0], [1, c1]]), stroke: DM.ink, lwPx: o.lw ?? 5 });
  for (let i = 0; i < (o.craters ?? 3); i++) circle(x + (hash(i + r) - .5) * r * 1.1, y + (hash(i * 3 + r) - .5) * r * 1.1, r * (.1 + .1 * hash(i * 7)), { fill: rgba('#000000', .15), stroke: null });
  if (o.ring) { X.save(); X.translate(x, y); X.rotate(o.ringAng ?? -.25); X.scale(1, .26); X.beginPath(); X.arc(0, 0, r * 1.9, 0, Math.PI); X.lineWidth = r * .22; X.strokeStyle = rgba(o.ring, .9); X.stroke(); X.restore(); }
}

// ---------- World 2: the stadium (side view; the pitch scrolls by cx) ----------
function dmStadium(t, o = {}) {
  const cx = o.cx || 0, cheer = o.cheer || 0, ground = o.ground ?? 860;
  dmBG('#0E1838', '#1E2C5E', '#26386E');
  for (const fx of [260, 1660]) {                                              // floodlights
    X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = radGrad(fx, 70, 0, 520, [[0, 'rgba(255,250,220,.55)'], [1, 'rgba(255,250,220,0)']]); X.fillRect(fx - 600, 0, 1200, 700); X.restore();
    shape(rectPts(fx - 90, 40, 180, 60), { fill: '#E8E4D8', stroke: DM.ink, lwPx: 4 });
    for (let i = 0; i < 4; i++) circle(fx - 60 + i * 40, 70, 14, { fill: '#FFFBE0', stroke: DM.ink, lwPx: 2 });
  }
  for (let row = 0; row < 5; row++) {                                           // the crowd
    shape(rectPts(0, 180 + row * 64, W, 64), { fill: row % 2 ? '#2C3E78' : '#33468A', stroke: null });
    for (let i = 0; i < 40; i++) {
      const x = ((i / 40 * (W + 100) - cx * (.2 + row * .04)) % (W + 100) + W + 100) % (W + 100) - 50, hj = (6 + 16 * cheer) * Math.abs(Math.sin(t * (4 + 5 * cheer) + i * 1.3 + row));
      const y = 210 + row * 64 - hj, col = ['#F2C94C', '#E8572E', '#FFFFFF', '#3BE07A', '#D0508E', '#7FD3FF'][Math.floor(hash(i * 7 + row) * 6)];
      circle(x, y + 18, 20, { fill: col, stroke: '#0B0B14', lwPx: 2 }); circle(x, y - 8, 12, { fill: ['#F2C9A8', '#C98A5E', '#8A5A35'][Math.floor(hash(i + row * 3) * 3)], stroke: '#0B0B14', lwPx: 2 });
      if (cheer > .3 && hash(i * 5 + row) > .7) line([[x + 14, y + 6], [x + 22, y - 26 - 8 * Math.sin(t * 9 + i)]], { stroke: '#0B0B14', lwPx: 3 });
    }
  }
  shape(rectPts(0, 500, W, 30), { fill: '#16224A', stroke: null });
  for (let i = 0; i < 6; i++) { const x = ((i * 380 - cx * .9) % 2280 + 2280) % 2280 - 180;                                    // ad boards
    shape(rectPts(x, 504, 340, 22), { fill: ['#E8572E', '#3BE07A', '#FFD84A'][i % 3], stroke: DM.ink, lwPx: 2 });
    X.save(); stArcade(['EAT YOUR VEGGIES', 'SLEEP 8 HOURS', 'PLAY TOGETHER'][i % 3], x + 170, 515, 18, '#0B0B14'); X.restore(); }
  X.fillStyle = '#3FA34D'; X.fillRect(0, 530, W, H - 530);
  for (let s = Math.floor(cx / 240) * 240 - 240; s < cx + W + 240; s += 240) if (Math.round(s / 240) % 2 === 0) { X.fillStyle = '#4CB55A'; X.fillRect(s - cx, 530, 240, H - 530); }
  line([[0, 560], [W, 560]], { stroke: rgba('#FFFFFF', .85), lwPx: 6 });
  return ground;
}
function dmGoalFrame(x, ground, s, front = false) {                          // a goal, side-on; s: px per world unit-ish
  const h = 240 * s, d = 160 * s;
  if (!front) { for (let i = 0; i < 9; i++) line([[x + i * d / 8, ground - h], [x + i * d / 8 + 20 * s, ground]], { stroke: rgba('#FFFFFF', .5), lwPx: 2 });
    for (let j = 0; j < 9; j++) line([[x, ground - h + j * h / 8], [x + d, ground - h + j * h / 8 + 10 * s]], { stroke: rgba('#FFFFFF', .5), lwPx: 2 }); return; }
  shape(rectPts(x - 9, ground - h - 4, 18, h + 4), { fill: '#FFFFFF', stroke: DM.ink, lwPx: 3 });
  shape(rectPts(x - 9, ground - h - 10, d + 18, 18), { fill: '#FFFFFF', stroke: DM.ink, lwPx: 3 });
}

// ---------- World 3: blocks ----------
const DM_BLK = {
  grass: ['#5BC24A', '#8A5A35'], dirt: ['#9A6A45', '#7A4F2E'], stone: ['#A8A8B0', '#85858F'], wood: ['#C8954E', '#9E6E33'], pink: ['#FFD1EC', '#F08AC0'],
  gold: ['#FFE066', '#E3B53E'], glass: ['#D8F4FF', '#A8DCF0'], leaf: ['#4FAF45', '#3A8A33'], white: ['#FFFFFF', '#E0E0E0'], red: ['#FF6060', '#D83A3A'],
  orange: ['#FFA040', '#E07A20'], yellow: ['#FFE860', '#E0C030'], green: ['#60D060', '#3AA03A'], blue: ['#4A8AFF', '#2E62D0'],
};
function dmBlock(x, y, B, kind, o = {}) {                                     // a cube seen from the front with a lit top strip; (x, y) top-left
  const [top, side] = DM_BLK[kind] || DM_BLK.stone, k = o.k ?? 1; if (k <= 0) return;
  X.save(); X.translate(x + B / 2, y + B / 2); const sc = backOut(k); X.scale(sc, sc); X.translate(-B / 2, -B / 2);
  shape(rectPts(0, 0, B, B), { fill: side, stroke: rgba('#000', .3), lwPx: 2 });
  shape(rectPts(0, 0, B, B * (kind === 'grass' ? .3 : .16)), { fill: top, stroke: null });
  for (let i = 0; i < 4; i++) shape(rectPts(B * (.15 + .6 * hash(i + x * .01)), B * (.35 + .5 * hash(i * 3 + y * .01)), B * .12, B * .12), { fill: rgba('#000', .12), stroke: null });
  X.restore();
}
function dmBlockWorld(t, B, o = {}) {                                          // sky, sun, square clouds, a meadow of blocks; returns the ground line
  const ox = o.ox || 0, gy = o.ground ?? H - 3 * B;
  dmBG(o.sky0 || '#6EC0FF', o.sky1 || '#BDE6FF');
  shape(rectPts(W * .8, H * .1, B * 1.6, B * 1.6), { fill: '#FFE66B', stroke: null });
  for (let i = 0; i < 5; i++) { const cx = ((i * 520 + t * 30) % (W + 600)) - 300; shape(rectPts(cx, H * (.08 + .07 * (i % 3)), B * 3, B * .9), { fill: '#FFFFFF', stroke: null }); shape(rectPts(cx + B * .6, H * (.08 + .07 * (i % 3)) - B * .5, B * 1.6, B * .6), { fill: '#FFFFFF', stroke: null }); }
  for (let i = -2; i < W / B + 2; i++) {                                      // distant hills
    const hh = 3 + Math.round(1.5 + 1.5 * Math.sin(i * .45 + 1) + Math.sin(i * 1.3));
    for (let j = 0; j < hh; j++) shape(rectPts(i * B * .6 - (ox * .3) % (B * .6), gy - (j + 1) * B * .6, B * .6, B * .6), { fill: j === hh - 1 ? '#8FD07A' : '#9FC2A0', stroke: null });
  }
  for (let i = -1; i < W / B + 2; i++) for (let j = 0; j < 4; j++) dmBlock(i * B - (ox % B), gy + j * B, B, j === 0 ? 'grass' : j < 2 ? 'dirt' : 'stone');
  return gy;
}
function dmCreeper(x, y, B, t, o = {}) {                                       // the Broccreeper: a green block body, a broccoli crown; (x, y) its feet
  const sw = 1 + (o.swell || 0) * (.18 + .1 * Math.sin(t * 30)), flash = o.swell > .2 && Math.sin(t * 24) > 0;
  X.save(); X.translate(x, y); X.scale(sw, sw);
  const body = flash ? '#FFFFFF' : '#4FAF45', dk = flash ? '#E8E8E8' : '#3A8A33';
  shape(rectPts(-B * .45, -B * 1.1, B * .9, B * 1.1), { fill: body, stroke: DM.ink, lwPx: 4 });
  for (const fx of [-.4, .05]) shape(rectPts(fx * B, -B * .3, B * .35, B * .3), { fill: dk, stroke: DM.ink, lwPx: 3 });
  shape(rectPts(-B * .5, -B * 2.1, B, B), { fill: body, stroke: DM.ink, lwPx: 4 });
  for (const ex of [-.32, .08]) shape(rectPts(ex * B, -B * 1.8, B * .24, B * .24), { fill: '#0B0B14', stroke: null });
  shape([[-.14 * B, -1.5 * B], [.14 * B, -1.5 * B], [.14 * B, -1.3 * B], [.26 * B, -1.3 * B], [.26 * B, -1.12 * B], [-.26 * B, -1.12 * B], [-.26 * B, -1.3 * B], [-.14 * B, -1.3 * B]], { fill: '#0B0B14', stroke: null });
  X.restore();
  dmBroccoli(x, y - B * 2.1 * sw - B * .3, B * .45, .1 * Math.sin(t * 3));
}
// a Rubik's cube in an easy isometric view: (x, y) centre, R the half-width; k 0..1 = solved-ness (faces settle to one colour)
const DM_CUBE_COL = ['red', 'blue', 'yellow', 'green', 'orange', 'white'];
function dmCube(x, y, R, t, k, o = {}) {
  const Hc = R * 1.1;
  const faces = [{ c: 2, pts: (u, v) => [x + (u - v) * R, y - R + (u + v) * R * .5] },                                          // top
    { c: 0, pts: (u, v) => [x - R + u * R, y - R * .5 + u * R * .5 + v * Hc] },                                                  // left
    { c: 1, pts: (u, v) => [x + u * R, y - u * R * .5 + v * Hc] }];                                                              // right
  faces.forEach((f, fi) => {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const scr = DM_CUBE_COL[Math.floor(hash(fi * 9 + i * 3 + j + (o.seed || 0)) * 6)], solved = DM_CUBE_COL[f.c];
      const col = hash(fi * 31 + i * 7 + j * 3) < k ? solved : scr;
      const p = [f.pts(i / 3, j / 3), f.pts((i + 1) / 3, j / 3), f.pts((i + 1) / 3, (j + 1) / 3), f.pts(i / 3, (j + 1) / 3)];
      shape(p, { fill: DM_BLK[col][fi === 0 ? 0 : 1], stroke: '#14101A', lwPx: Math.max(3, R * .035) });
    }
  });
}

// ---------- World 4: Fight Planet ----------
function dmArena(t, o = {}) {
  dmBG('#2A0E4A', '#8A2E5A', '#E8743A');
  dmStars(t, 70, -10, 0, { r: 1.6 });
  dmPlanet(W * .72, H * .3, 230, { c0: '#9AD8FF', c1: '#3A6AD0', ring: '#FFE7A8', ringAng: -.2 + (o.tilt || 0), craters: 4 });
  dmPlanet(W * .14, H * .16, 60, { c0: '#E0FFB0', c1: '#6AB04A', craters: 2, lw: 3 });
  const gy = o.ground ?? 860;
  shape([[0, gy - 40], [W * .3, gy - 70], [W * .7, gy - 55], [W, gy - 80], [W, H], [0, H]], { fill: '#B0482A', stroke: DM.ink, lwPx: 5, smooth: .4 });
  shape([[0, gy], [W, gy], [W, H], [0, H]], { fill: linGrad(0, gy, 0, H, [[0, '#E8743A'], [1, '#B04A28']]), stroke: null });
  for (let i = 0; i < 9; i++) ellipse(120 + i * 220 + 40 * hash(i), gy + 60 + 80 * hash(i * 3), 60 + 40 * hash(i * 5), 14, { fill: rgba('#7A2618', .35), stroke: null });
  return gy;
}

// ---------- the final boss ----------
function dmClock(x, y, r, t, o = {}) {
  const ring = o.ring || 0, sh = ring * 18 * Math.sin(t * 60), hurt = o.hurt || 0;
  X.save(); X.translate(x + sh, y); X.rotate(ring * .06 * Math.sin(t * 50));
  for (const sd of [-1, 1]) {                                                   // the twin bells and the hammer
    X.save(); X.rotate(sd * .62); circle(0, -r * 1.08, r * .32, { fill: '#E8C35A', stroke: DM.ink, lwPx: 7 }); shape(rectPts(-r * .06, -r * .9, r * .12, r * .14), { fill: '#8A6A2A', stroke: DM.ink, lwPx: 4 }); X.restore();
  }
  X.save(); X.rotate(ring * .5 * Math.sin(t * 70)); shape(rectPts(-r * .04, -r * 1.25, r * .08, r * .3), { fill: '#6A6A72', stroke: DM.ink, lwPx: 4 }); circle(0, -r * 1.28, r * .07, { fill: '#6A6A72', stroke: DM.ink, lwPx: 4 }); X.restore();
  for (const sd of [-1, 1]) shape([[sd * r * .55, r * .75], [sd * r * .85, r * 1.15], [sd * r * .55, r * 1.12]], { fill: '#8A6A2A', stroke: DM.ink, lwPx: 6 });   // feet
  circle(0, 0, r, { fill: o.col || '#E8483A', stroke: DM.ink, lwPx: 9 });
  circle(0, 0, r * .84, { fill: mixCol('#FFF8E8', '#FF8080', hurt), stroke: DM.ink, lwPx: 6 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[Math.cos(a) * r * .72, Math.sin(a) * r * .72], [Math.cos(a) * r * .8, Math.sin(a) * r * .8]], { stroke: DM.ink, lwPx: i % 3 ? 4 : 9 }); }
  // the angry face: brows, eyes, a toothy grimace
  for (const sd of [-1, 1]) {
    circle(sd * r * .3, -r * .18, r * .15, { fill: '#FFFFFF', stroke: DM.ink, lwPx: 5 });
    circle(sd * r * .3 + r * .03 * Math.sin(t * 3), -r * .15, r * .07, { fill: o.eyeCol || '#C81E1E', stroke: null });
    line([[sd * r * .48, -r * .42], [sd * r * .14, -r * .3]], { stroke: DM.ink, lwPx: 12 });
  }
  shape(rectPts(-r * .32, r * .2, r * .64, r * .22), { fill: '#FFFFFF', stroke: DM.ink, lwPx: 5, smooth: .1 });
  for (let i = 1; i < 5; i++) line([[-r * .32 + i * r * .128, r * .2], [-r * .32 + i * r * .128, r * .42]], { stroke: DM.ink, lwPx: 3 });
  const hA = (o.time ?? t * .2) * TAU, mA = hA * 12;                            // the hands
  line([[0, 0], [Math.sin(hA) * r * .38, -Math.cos(hA) * r * .38]], { stroke: DM.ink, lwPx: 10 });
  line([[0, 0], [Math.sin(mA) * r * .6, -Math.cos(mA) * r * .6]], { stroke: DM.ink, lwPx: 6 });
  circle(0, 0, r * .05, { fill: DM.ink, stroke: null });
  X.restore();
  if (ring > .2) for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * .9; X.save(); X.globalAlpha = ring * (.5 + .5 * Math.sin(t * 20 + i));
    for (let j = 0; j < 3; j++) { X.beginPath(); X.arc(x, y - r * 1.1, r * (1.5 + j * .25 + .1 * frac(t * 3)), a - .25, a + .25); X.lineWidth = 8; X.strokeStyle = '#FFE066'; X.stroke(); } X.restore(); }
}

// ---------- the video-game look: a post-process over the finished frame ----------
// dmGameFX(t, { pixel, crt, levels }) re-renders whatever is on the canvas:
//   pixel   ≥ 1: the frame is shrunk by this factor and blown back up with nearest-neighbour (chunky pixels)
//   levels  colour levels per channel after pixelating (e.g. 6 for a limited 16-bit palette; 0 = off)
//   crt     0..1: RGB split, barrel curvature, phosphor bloom, scanlines, an aperture mask, vignette, rounded corners, flicker
// Run it after the shot (and its overlays) are painted and before anything that should stay crisp, like the karaoke.
const DM_FXC = {};
function dmCanvas(key, w, h) {
  const c = DM_FXC[key] ??= document.createElement('canvas');
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  const g = c.getContext('2d', { willReadFrequently: key === 'small' }); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  return [c, g];
}
function dmGameFX(t, o = {}) {
  const px = o.pixel || 1, crt = clamp(o.crt || 0), src = X.canvas, CW = src.width, CH = src.height;
  if (px <= 1.01 && crt <= .01) return;
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.filter = 'none';
  const [F, f] = dmCanvas('frame', CW, CH);
  if (px > 1.01) {                                                              // pixelate: average down, nearest-neighbour up
    const sw = Math.max(8, Math.round(CW / px)), sh = Math.max(8, Math.round(CH / px)), [S, s] = dmCanvas('small', sw, sh);
    s.imageSmoothingEnabled = true; s.imageSmoothingQuality = 'medium'; s.drawImage(src, 0, 0, sw, sh);
    if (o.levels) { const d = s.getImageData(0, 0, sw, sh), a = d.data, q = 255 / (o.levels - 1);
      for (let i = 0; i < a.length; i += 4) { a[i] = Math.round(a[i] / q) * q; a[i + 1] = Math.round(a[i + 1] / q) * q; a[i + 2] = Math.round(a[i + 2] / q) * q; }
      s.putImageData(d, 0, 0); }
    f.imageSmoothingEnabled = false; f.drawImage(S, 0, 0, CW, CH);
  } else f.drawImage(src, 0, 0);
  if (crt <= .01) { X.globalCompositeOperation = 'copy'; X.drawImage(F, 0, 0); X.restore(); return; }
  // RGB split: the red channel nudged right, green+blue nudged left
  const off = 3 * crt, [R, r] = dmCanvas('red', CW, CH), [B, b] = dmCanvas('cyan', CW, CH);
  r.drawImage(F, 0, 0); r.globalCompositeOperation = 'multiply'; r.fillStyle = '#FF0000'; r.fillRect(0, 0, CW, CH);
  b.drawImage(F, 0, 0); b.globalCompositeOperation = 'multiply'; b.fillStyle = '#00FFFF'; b.fillRect(0, 0, CW, CH);
  const [G, g] = dmCanvas('split', CW, CH);
  g.fillStyle = '#000'; g.fillRect(0, 0, CW, CH); g.globalCompositeOperation = 'lighter'; g.drawImage(B, -off, 0); g.drawImage(R, off, 0);
  // barrel curvature: squeeze each row toward the middle, then each column
  const k = .055 * crt, [Q, q] = dmCanvas('rows', CW, CH), STEP = 4;
  q.fillStyle = '#000'; q.fillRect(0, 0, CW, CH);
  for (let y = 0; y < CH; y += STEP) { const v = (y + STEP / 2) / CH * 2 - 1, sx = 1 - k * v * v; q.drawImage(G, 0, y, CW, STEP, CW * (1 - sx) / 2, y, CW * sx, STEP); }
  X.globalCompositeOperation = 'source-over'; X.fillStyle = '#05040A'; X.fillRect(0, 0, CW, CH);
  for (let x = 0; x < CW; x += STEP) { const u = (x + STEP / 2) / CW * 2 - 1, sy = 1 - k * u * u; X.drawImage(Q, x, 0, STEP, CH, x, CH * (1 - sy) / 2, STEP, CH * sy); }
  // phosphor bloom
  const [L, l] = dmCanvas('bloom', CW / 4, CH / 4); l.filter = 'blur(3px)'; l.drawImage(src, 0, 0, CW / 4, CH / 4);
  X.globalCompositeOperation = 'screen'; X.globalAlpha = .28 * crt; X.drawImage(L, 0, 0, CW, CH); X.globalAlpha = 1;
  // scanlines and a faint aperture mask
  X.globalCompositeOperation = 'multiply';
  DM_FXC.scan ??= (() => { const [c, cg] = dmCanvas('scanTile', 6, 4); cg.fillStyle = '#FFFFFF'; cg.fillRect(0, 0, 6, 4); cg.fillStyle = '#8A8A8A'; cg.fillRect(0, 2, 6, 2);
    ['#FFD6D6', '#D6FFD6', '#D6D6FF'].forEach((c2, i) => { cg.fillStyle = c2; cg.globalCompositeOperation = 'multiply'; cg.fillRect(i * 2, 0, 2, 4); }); return X.createPattern(c, 'repeat'); })();
  X.globalAlpha = .55 * crt; X.fillStyle = DM_FXC.scan; X.fillRect(0, 0, CW, CH); X.globalAlpha = 1;
  // vignette, a rolling bright band and a flicker
  X.globalCompositeOperation = 'source-over';
  X.fillStyle = radGrad(CW / 2, CH / 2, CH * .45, CH * 1.05, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${.6 * crt})`]]); X.fillRect(0, 0, CW, CH);
  const band = frac(t * .12) * (CH + 400) - 200;
  X.fillStyle = linGrad(0, band - 120, 0, band + 120, [[0, 'rgba(255,255,255,0)'], [.5, `rgba(255,255,255,${.05 * crt})`], [1, 'rgba(255,255,255,0)']]); X.fillRect(0, band - 120, CW, 240);
  X.fillStyle = `rgba(255,255,255,${.025 * crt * hash(Math.floor(t * 24))})`; X.fillRect(0, 0, CW, CH);
  // the screen's rounded corners
  X.fillStyle = '#05040A'; X.beginPath(); X.rect(0, 0, CW, CH); X.roundRect(CW * .012 * crt, CH * .02 * crt, CW * (1 - .024 * crt), CH * (1 - .04 * crt), 70 * crt); X.fill('evenodd');
  X.restore();
}
