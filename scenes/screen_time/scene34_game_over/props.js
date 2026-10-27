// Scene 34 props: a full-frame laptop (bezel + the player's shoulder), the DIFFICULTY dial tiny Clawd turns, the twins' rigged
// video games, and the twins' laptop lids with their winking game-sprite.
//   goLaptop(t, fn, o)            a full-frame laptop: the bezel and keyboard deck; fn(w, h) paints a 1600 × 900 screen.
//                                 o.shoulder: 'safadi' | 'sami' adds the player's shoulder and the back of his head in the foreground.
//   goDial(x, y, r, k, t)         a DIFFICULTY dial (game units): k 0..1 sweeps EASY → SUPER HARD, with tiny Clawd gripping the knob.
//   goRoboHard(w, h, t, t0)       ROBO INVASION rigged super-hard: the robots sprint and rain bolts; King Neptune is hit; GAME OVER (6 s from t0).
//   goSoccerHard(w, h, t, t0)     WORLD CHAMPION rigged: little Housam tackles little Sami, Danny passes, Jenna scores; KIDS WIN (6.4 s from t0).
//   goLid(x, y, w, sticker, t, o) a twin's laptop lid toward us, bottom edge at (x, y): o.red (light goes red), o.peek (a winking Clawd),
//                                 o.shut (0..1 folds it down), o.glow (0..1 screen-light intensity).
// Shared with earlier scenes: stArcade / stFaceGlow / ST_WC (scene 32's props.js). Scenes 32 must stay registered before this one.
const GO = { ink: PAL.ink, green: '#5AF78E', red: '#FF5A5A', amber: '#FFC857', clay: '#D97757', cyan: '#7FE3FF', text: '#E9EEF8' };

// ---------- the laptop frame ----------
function goLaptop(t, fn, o = {}) {
  X.fillStyle = radGrad(W / 2, H * .45, 200, W * .75, [[0, o.wall || '#463C44'], [1, '#191519']]); X.fillRect(0, 0, W, H);
  const sx = 260, sy = 90, sw = 1400, sh = 788, b = 34, bob = 3 * Math.sin(t * 1.7);
  X.save(); X.translate(0, bob);
  shape(rectPts(sx - b, sy - b, sw + 2 * b, sh + 2 * b), { fill: '#2B2F36', stroke: GO.ink, lwPx: 6, smooth: .03 });
  shape([[sx - b - 60, sy + sh + b], [sx + sw + b + 60, sy + sh + b], [sx + sw + b + 140, H + 40], [sx - b - 140, H + 40]], { fill: '#B9C0C8', stroke: GO.ink, lwPx: 6 });   // keyboard deck
  for (let r = 0; r < 2; r++) for (let i = 0; i < 13; i++) shape(rectPts(sx + 50 + i * 100 + r * 34, sy + sh + b + 26 + r * 52, 82, 40), { fill: '#E4E8EC', stroke: rgba(GO.ink, .5), lwPx: 2, smooth: .18 });
  circle(sx + sw / 2, sy - b / 2, 5, { fill: '#10141A', stroke: null });                                      // the camera
  X.save(); X.beginPath(); X.rect(sx, sy, sw, sh); X.clip(); X.translate(sx, sy); X.scale(sw / 1600, sh / 900);
  withBoil(0, () => fn(1600, 900));
  X.fillStyle = 'rgba(255,255,255,.05)'; X.beginPath(); X.moveTo(300, 0); X.lineTo(600, 0); X.lineTo(240, 900); X.lineTo(-60, 900); X.fill();   // glare
  X.restore(); X.restore();
  if (o.shoulder) {                                                                                           // the player's shoulder, foreground
    const coat = o.shoulder === 'sami' ? '#F4F6F8' : '#C9A66B', hair = o.shoulder === 'sami' ? '#2A2220' : '#3A2A22', sway = 7 * Math.sin(t * 1.3);
    shape([[-60, H + 20], [-40, H - 230], [150, H - 300], [430 + sway, H - 230], [580, H + 20]], { fill: coat, stroke: GO.ink, lwPx: 7, smooth: .5 });
    ellipse(240 + sway, H - 380, 200, 220, { fill: hair, stroke: GO.ink, lwPx: 7 });
    for (let i = 0; i < 4; i++) line([[150 + i * 56 + sway, H - 560 + i * 10], [170 + i * 56 + sway, H - 290]], { stroke: rgba('#FFFFFF', .08), lwPx: 8 });
    ellipse(432 + sway, H - 380, 28, 48, { fill: o.shoulder === 'sami' ? '#E7B48F' : '#F3C6A8', stroke: GO.ink, lwPx: 5 });   // an ear
  }
}

// ---------- the DIFFICULTY dial ----------
// A little gauge in the game's corner; k sweeps the needle from EASY to SUPER HARD and tiny Clawd grips the knob.
function goDial(x, y, r, k, t) {
  X.save(); X.translate(x, y);
  circle(0, 0, r * 1.25, { fill: rgba('#0B1020', .82), stroke: GO.cyan, lwPx: 4 });
  const A0 = Math.PI * 1.15, A1 = -Math.PI * .15;                                                             // left (easy) to right (hard)
  for (let i = 0; i <= 4; i++) { const a = lerp(A0, A1, i / 4); line([[Math.cos(a) * r * .78, Math.sin(a) * r * .78], [Math.cos(a) * r, Math.sin(a) * r]], { stroke: [GO.green, GO.green, GO.amber, GO.red, GO.red][i], lwPx: 5 }); }
  const na = lerp(A0, A1, clamp(k));                                                                          // the needle
  line([[0, 0], [Math.cos(na) * r * .92, Math.sin(na) * r * .92]], { stroke: '#FFFFFF', lwPx: 6 });
  circle(0, 0, r * .18, { fill: '#C8CED8', stroke: GO.ink, lwPx: 3 });
  stArcade('DIFFICULTY', 0, r * 1.7, r * .5, GO.cyan);
  stArcade(k > .85 ? 'SUPER HARD!' : k > .4 ? 'HARD' : 'EASY', 0, -r * 1.65, r * .55, k > .85 ? GO.red : GO.amber);
  const bob = .14 * r * Math.sin(t * 9);                                                                      // tiny Clawd on the knob
  clawd(Math.cos(na) * r * .5, Math.sin(na) * r * .5 - r * .3 + bob, r * .12, { t, noShadow: true, boil: 0, holo: 1, eyes: 'narrow', mouth: 'cat', aL: 1.3, aR: -1.3, bounce: .3 });
  X.restore();
}

// ---------- ROBO INVASION, rigged super-hard ----------
// Reuses scene 32's layout idea, redrawn here so it can run faster and let the robots win. GAME OVER at 5.3 s.
const GO_RI_BOLTS = [[.5, 0], [.9, 2], [1.3, 4], [1.6, 1], [2.0, 5], [2.3, 3], [2.7, 0], [3.0, 2], [3.3, 4], [3.6, 1], [3.9, 5], [4.2, 3]];
const GO_NEP_HITS = [1.7, 3.1, 4.4];                                                                          // Neptune is struck
function goRoboHard(w, h, t, t0) {
  const d = Math.max(0, t - t0), over = d > 5.3, step = Math.floor(d * 112 / 60 * 2);                         // marches twice as fast
  X.fillStyle = linGrad(0, 0, 0, h, [[0, '#1A0710'], [1, '#3A0E1E']]); X.fillRect(0, 0, w, h);               // an angry red field
  for (let i = 0; i < 90; i++) { const y = frac(hash(i + 20) + d * .12 * (1 + hash(i))) * h; circle(hash(i) * w, y, 1 + 2 * hash(i * 3), { fill: rgba('#FFC0C0', .4 + .5 * hash(i * 7)), stroke: null }); }
  shape(rectPts(0, 862, w, 8), { fill: GO.red, stroke: null });
  const odd = step % 2, dn = Math.min(300, 26 * Math.floor(d * 4));                                           // they charge downward fast
  const botXY = (r, c) => [360 + c * 150 + (odd ? 24 : -24), 150 + r * 120 + dn];
  if (!over) for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    const [x, y] = botXY(r, c);
    roboSafadi(x, y, 6, { t, noShadow: true, boil: 0, eyes: 'open', red: 1, mouth: 'teeth', brows: 'angry', jump: .3 * pulse(t),
      handL: odd ? [-6, -20] : [-6.5, -14], handR: odd ? [6.5, -14] : [6, -20], handPoseL: 'claw', handPoseR: 'claw', antenna: odd ? .3 : -.3 });
  }
  for (const [tb, c] of GO_RI_BOLTS) { const u = seg(d, tb, tb + .7); if (u <= 0 || u >= 1) continue; const [x, y] = botXY(0, c);
    const by = lerp(y + 10, 880, u); shape([[x - 6, by - 26], [x + 6, by - 16], [x - 6, by - 6], [x + 6, by + 4]], { fill: null, stroke: '#FF8A4A', lwPx: 7, closed: false }); }
  // King Neptune: cornered, hit again and again
  const hits = GO_NEP_HITS.filter(th => d > th).length, shake = GO_NEP_HITS.some(th => d > th && d < th + .3) ? 10 * Math.sin(d * 60) : 0;
  if (!over) { const nx = 800 + 120 * Math.sin(d * 2);
    neptune(nx + shake, 860, 12, { t, sit: 1, trident: true, tridentAng: -1.4, eyes: hits >= 2 ? 'wide' : 'worried', brows: 'worried', mouth: hits >= 2 ? 'O' : 'frown', headTilt: -.1, power: 0, boil: 0,
      sq: hits ? .12 * Math.sin(d * 30) : 0 });
    for (const th of GO_NEP_HITS) { const u = seg(d, th, th + .4); if (u > 0 && u < 1) { shape(starPts(nx + shake, 780, 90 * backOut(seg(u, 0, .5)) * (1 - seg(u, .6, 1)), .4, 10, u * 3), { fill: '#FFE066', stroke: GO.red, lwPx: 4 });
      stArcade('OW!', nx + shake, 700 - 30 * u, 56, GO.red); } }
  }
  stArcade('SCORE 000120', 40, 40, 44, '#FFFFFF', 'left'); stArcade('ROBO INVASION', w / 2, 40, 46, GO.red);
  stArcade('LIVES: ' + Math.max(0, 3 - hits), w - 40, 40, 44, '#FFE066', 'right');
  if (d < 2.4) goDial(w - 230, 250, 90, clamp(seg(d, .3, 1.6)), t);                                           // tiny Clawd cranks it up
  if (over) {
    const p = backOut(seg(d, 5.3, 5.7));
    X.fillStyle = rgba('#000000', .55 * clamp(p * 2)); X.fillRect(0, 0, w, h);
    X.save(); X.translate(w / 2, h * .46); X.scale(p, p); stArcade('GAME OVER', 0, 0, 170, GO.red); stArcade('THE INVADERS WIN', 0, 115, 48, '#FFFFFF'); X.restore();
  }
}

// ---------- WORLD CHAMPION, rigged: the kids beat little Sami. KIDS WIN at 5.1 s ----------
const GO_WC_DEF = [['housam', 760], ['danny', 1280], ['jenna', 1820]], GO_WC_KEEP = 150, GO_WC_SCORE = [4.0, 5.1];
function goSoccerHard(w, h, t, t0) {
  const WC = ST_WC, UNIT = { housam: HOUSAM_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT }, RIG = { housam, danny, jenna };
  const d = Math.max(0, t - t0), SC = GO_WC_SCORE.map(x => x), bounce = (x, f, ph = 0) => Math.abs(Math.sin(x * f + ph));
  // little Sami runs the wrong way: he is driven back toward his own goal (on the left) as the kids swarm.
  const samiGX = kf(d, [[0, 2250], [SC[0], 400]], x => x), cx = clamp(samiGX - 520, 0, WC.len - w), gx = x => x - cx, goal = d > SC[1];
  // the stands and crowd (cheering for the kids)
  X.fillStyle = linGrad(0, 0, 0, 300, [[0, '#2C3E78'], [1, '#4A5EA0']]); X.fillRect(0, 0, w, 330);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 46; i++) {
    const x = frac(i / 46 - cx / 2400 * (1 + row * .1)) * (w + 80) - 40, hj = goal ? 18 * bounce(t, 9, i) : 6 * bounce(t, 4, i * 1.3 + row);
    const y = 90 + row * 62 - hj, col = ['#F2C94C', '#E8572E', '#FFFFFF', '#3BE07A', '#D0508E', '#7FD3FF'][Math.floor(hash(i * 7 + row) * 6)];
    circle(x, y + 22, 22, { fill: col, stroke: '#0B0B14', lwPx: 2 }); circle(x, y - 6, 13, { fill: ['#F2C9A8', '#C98A5E', '#8A5A35'][Math.floor(hash(i + row * 3) * 3)], stroke: '#0B0B14', lwPx: 2 });
  }
  // the pitch
  X.fillStyle = '#3FA34D'; X.fillRect(0, 330, w, h - 330);
  for (let s = Math.floor(cx / 200) * 200; s < cx + w; s += 200) if ((s / 200) % 2 === 0) { X.fillStyle = '#4CB55A'; X.fillRect(gx(s), 330, 200, h - 330); }
  line([[0, 360], [w, 360]], { stroke: '#FFFFFF', lwPx: 6 });
  // Sami's goal is on the LEFT; little Alma is NOT keeping it this time, so the kids score freely
  const g0 = gx(GO_WC_KEEP);
  for (let j = 0; j < 10; j++) line([[g0, 470 + j * 30], [g0 - 120, 480 + j * 30]], { stroke: rgba('#FFFFFF', .5), lwPx: 2 });
  shape(rectPts(g0 - 8, 460, 16, WC.ground - 450), { fill: '#FFFFFF', stroke: '#0B0B14', lwPx: 3 }); shape(rectPts(g0 - 128, 452, 136, 16), { fill: '#FFFFFF', stroke: '#0B0B14', lwPx: 3 });
  // the three kids chase little Sami down and take the ball
  for (const [n, dx] of GO_WC_DEF) {
    const chase = ease(seg(d, 0, SC[0])), x = gx(lerp(dx, GO_WC_KEEP + 360, chase)), s = UNIT[n] * WC.G;
    if (x < -200 || x > w + 200) continue;
    const o = { t, noShadow: true, boil: 0, lookX: clamp((gx(samiGX) - x) / 400, -.9, .9), eyes: 'wide', mouth: 'grin', brows: 'angry',
      handL: [-5, -15], handR: [5, -15], handPoseL: 'open', handPoseR: 'open', giraffe: false, ...RIG[n] && {} };
    if (n === 'housam') Object.assign(o, { ...housamDribble(x / 46, 1), lean: .1 });
    if (n === 'danny') Object.assign(o, { ...dannyDribble(x / 40, 1), lean: .1 });
    if (n === 'jenna') Object.assign(o, { ...jennaSkip(x / 40, 1) });
    RIG[n](x, WC.ground, s, o);
  }
  // little Housam's slide tackle spins little Sami around
  const tackle = seg(d, 1.4, 2.0);
  const so = goal ? { eyes: 'squeeze', mouth: 'O', brows: 'worried', handL: [-6, -24], handR: [6, -24], handPoseL: 'open', handPoseR: 'open', dy: 1, lookX: -.3 }
    : tackle > 0 && tackle < 1 ? { spin: TAU * tackle, eyes: 'squeeze', mouth: 'O', brows: 'worried', handL: [-6, -18], handR: [6, -18], handPoseL: 'open', handPoseR: 'open' }
      : { ...samiWalk(samiGX / 52, 1), flip: true, lookX: -.5, brows: 'worried', mouth: 'frown', eyes: 'wide' };
  const SA = sami(gx(samiGX), WC.ground, SAMI_UNIT * WC.G, { t, noShadow: true, boil: 0, ...so });
  if (!goal) { const mk = SA.top[1] - 40 + 6 * Math.sin(t * 6);                                               // the P1 marker over the loser
    shape([[gx(samiGX) - 18, mk - 26], [gx(samiGX) + 18, mk - 26], [gx(samiGX), mk]], { fill: '#FFE066', stroke: '#0B0B14', lwPx: 3 }); stArcade('P1', gx(samiGX), mk - 52, 36, '#FFE066'); }
  // the ball: driven toward Sami's goal and tucked in
  let bx, by;
  if (d < SC[0]) { const u = d / SC[0]; bx = gx(lerp(2200, GO_WC_KEEP + 200, u)) + 40; by = WC.ground - 30 - 24 * Math.abs(Math.sin(u * 8 * Math.PI)); }
  else if (d < SC[1]) { const u = seg(d, SC[0], SC[1]); bx = lerp(gx(GO_WC_KEEP + 200), g0 + 30, u); by = lerp(WC.ground - 30, 540, u) - 300 * Math.sin(Math.PI * u); }
  else { const u = easeIn(seg(d, SC[1], SC[1] + .4)); bx = g0 + 20; by = lerp(540, WC.ground - 30, u); }
  housamBall(bx, by, 12, { spin: t * 8 });
  // the HUD
  shape(rectPts(30, 24, 440, 70), { fill: rgba('#0B0B14', .75), stroke: '#FFFFFF', lwPx: 3, smooth: .1 });
  stArcade(`SAMI  0 - ${goal ? 1 : 0}  KIDS`, 250, 60, 40, '#FFFFFF');
  stArcade('WORLD CHAMPION', w / 2, h - 44, 44, '#FFE066');
  if (d < 2.4) goDial(230, 250, 90, clamp(seg(d, .3, 1.6)), t);
  if (goal) {
    const p = backOut(seg(d, SC[1], SC[1] + .4));
    for (let i = 0; i < 60; i++) { const u = frac(hash(i) + (d - SC[1]) * .5), x = hash(i * 3) * w, y = u * h * 1.1 - 40; shape(rectPts(x, y, 14, 8), { fill: ['#F2C94C', '#E8572E', '#3BE07A', '#7FD3FF', '#D0508E'][i % 5], stroke: null }); }
    X.save(); X.translate(w / 2, h * .42); X.rotate(-.05 + .03 * Math.sin(t * 8)); X.scale(p, p); stArcade('KIDS WIN!', 0, 0, 200, frac(t * 4) < .5 ? '#FFE066' : '#7CFF9B'); X.restore();
  }
}

// ---------- the twins' laptop lids (seen from behind, on their laps) ----------
function goLid(x, y, w, sticker, t, o = {}) {
  const h = w * .66, shut = clamp(o.shut || 0), col = o.red ? mixCol('#C9CED4', GO.red, .3) : '#C9CED4';
  X.save(); X.translate(x, y); X.scale(1, 1 - shut * .92);                                                    // fold the lid down
  shape(rectPts(-w / 2, -h, w, h), { fill: col, stroke: PAL.ink, lwPx: Math.max(1.5, w * .02), smooth: .05 });
  if (sticker === 'bulb') { circle(0, -h * .55, w * .09, { fill: '#F2C440', stroke: PAL.ink, lwPx: 1.2 }); shape(rectPts(-w * .045, -h * .43, w * .09, w * .06), { fill: '#9AA3AC', stroke: null }); }
  else shape(starPts(0, -h * .5, w * .1, .5), { fill: '#AEE6CB', stroke: PAL.ink, lwPx: 1.2 });
  X.restore();
  if (shut < .3) { const col2 = o.red ? GO.red : '#9FD4FF';
    X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = radGrad(x, y - h * 1.4, 0, w * .9, [[0, rgba(col2, (o.glow ?? .2) * (1 - shut * 3))], [1, rgba(col2, 0)]]); X.fillRect(x - w, y - h * 2.4, 2 * w, 2 * w); X.restore(); }
  if ((o.peek || 0) > .01 && shut < .3) {                                                                     // tiny Clawd peeks over the lid and winks
    const pop = backOut(clamp(o.peek)); clawd(x + w * .2, y - h - w * .1 - pop * w * .1, w * .11 * pop, { t, noShadow: true, boil: 0, holo: 1, eyes: 'wink', mouth: 'grin', aR: 1.6, bounce: .3 });
  }
}
