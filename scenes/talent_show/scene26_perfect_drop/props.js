// scenes/talent_show/scene26_perfect_drop/props.js: the props for "The Perfect Drop" (all prefixed pd, since every script shares one scope).
// It also borrows from earlier scenes, which must stay registered: scene 22's backdrops, throne, crown and confetti (ys…),
// scene 24's judges' table, chairs and score cards (cb…), and scene 25's cube, hands and trophies (cd…).
//   pdMic(x, y, s, ang, o)          Pearl's golden microphone, held at (x, y), pointing along ang (s = px per Pearl unit)
//   pdGuitar(x, y, s, ang, t)       Fester's jester guitar: a gold-and-crimson flying V with juggling-ball inlays
//   pdDrums(x, y, k, t, o)          a drum kit (k = px per world unit; (x, y) = the floor under the bass drum)
//   pdPotion(x, y, h, o)            the "SECRET POTION" (broccoli juice), with a red NO stamp when o.no > 0
//   pdSign(x, y, w, text, o)        a road sign on a post (SHORTCUT →), knocked flat by o.fall
//   pdTestPaper(x, y, w, t, o)      THE HARDEST TEST, with an A+ stamped on it at o.stamp
//   pdCalendar(x, y, w, day, o)     a tear-off calendar page (MON…FRI)
//   pdCape(A, s, t, o)              a superhero cape behind a kid, from its chest anchor
//   pdCubeWall(cx, cy, size, k, t)  a giant 3×3 cube face whose stickers snap to solved as k goes 0 → 1
//   pdPaperCrown(x, y, w, col, t)   a paper party crown
//   pdBeams(t, cols, o)             concert light beams sweeping down from the rig
//   pdBanner(P, t)                  ★ THE PERFECT DROP ★ banner over the stage
//   pdPuddle(x, y, w, k, t)         the puddle Neptune rises from
//   pdTitle(t, t0, o)               the title card: THE PERFECT DROP
const PD = { ink: '#2B1A26', gold: '#F2C14E', goldDk: '#B98A22', goldLt: '#FFE48A', pink: '#E26AA6', pinkLt: '#FFB3D9', sky: '#7FE3FF', cream: '#FFF4E0',
  mesh: '#3A3340', red: '#D83A3A', green: '#6FBF3A', broccoli: '#4E9A3A', water: '#7FE3FF', waterDk: '#2EB2EE' };

// ---------- the microphone ----------
// Held at (x, y) (the bottom of the grip, in Pearl's flipper); the grille points along ang. s = px per Pearl unit.
function pdMic(x, y, s, ang, o = {}) {
  const L = 5.2 * s, r = 1.25 * s, lw = Math.max(1.5, s * .22);
  X.save(); X.translate(x, y); X.rotate(ang);
  if (o.glow) { X.save(); X.globalCompositeOperation = 'lighter'; circle(L + r * .4, 0, r * 3.2, { fill: radGrad(L + r * .4, 0, 0, r * 3.2, [[0, rgba('#FFF1A8', .35 * o.glow)], [1, rgba('#FFF1A8', 0)]]), stroke: null }); X.restore(); }
  // the grip: a tapered black handle with a gold band
  shape([[-.2 * s, -.48 * s], [L - .6 * s, -.78 * s], [L - .6 * s, .78 * s], [-.2 * s, .48 * s]], { fill: linGrad(0, -s, 0, s, [[0, '#4A4452'], [.45, '#2A2430'], [1, '#17131C']]), stroke: PD.ink, lwPx: lw, smooth: .15 });
  shape(rectPts(L * .62, -.82 * s, .5 * s, 1.64 * s), { fill: PD.gold, stroke: PD.ink, lwPx: lw * .8 });
  if (o.light !== false) circle(L * .35, 0, .2 * s, { fill: o.light === 'red' ? '#FF5A5A' : '#7CFF8A', stroke: null });
  // the grille: a gold ball with a mesh
  const gx = L + r * .35;
  circle(gx, 0, r, { fill: radGrad(gx - r * .35, -r * .35, r * .1, r * 1.1, [[0, '#FFF6C8'], [.5, PD.gold], [1, PD.goldDk]]), stroke: PD.ink, lwPx: lw });
  X.save(); X.beginPath(); X.arc(gx, 0, r * .92, 0, TAU); X.clip();
  for (let i = -3; i <= 3; i++) { line([[gx + i * r * .3, -r], [gx + i * r * .3, r]], { stroke: 'rgba(90,60,20,.55)', lwPx: Math.max(.8, lw * .35) }); line([[gx - r, i * r * .3], [gx + r, i * r * .3]], { stroke: 'rgba(90,60,20,.55)', lwPx: Math.max(.8, lw * .35) }); }
  X.restore();
  line([[gx - r * .95, 0], [gx + r * .95, 0]], { stroke: PD.goldDk, lwPx: lw * .9 });
  ellipse(gx - r * .35, -r * .45, r * .28, r * .16, { fill: 'rgba(255,255,255,.75)', stroke: null, rot: -.5 });
  X.restore();
  return [x + Math.cos(ang) * (gx + r), y + Math.sin(ang) * (gx + r)];           // the tip of the grille
}

// ---------- Fester's guitar ----------
// (x, y) = where the neck meets the body; ang = the neck's angle (≈ −.5 points it up and to the right). s = px per jester unit.
function pdGuitar(x, y, s, ang, t = T, o = {}) {
  const lw = Math.max(1.5, s * .22);
  X.save(); X.translate(x, y); X.rotate(ang);
  // body: a flying V in crimson and gold
  shape([[1.2 * s, 0], [-5.8 * s, -3.6 * s], [-6.6 * s, -2.4 * s], [-2.6 * s, 0], [-6.6 * s, 2.4 * s], [-5.8 * s, 3.6 * s]], { fill: linGrad(-6 * s, -3 * s, 0, 3 * s, [[0, '#C0243C'], [.5, '#E0445A'], [1, '#7A1F52']]), stroke: PD.ink, lwPx: lw, smooth: .12 });
  shape([[.2 * s, 0], [-4.8 * s, -2.6 * s], [-5.2 * s, -2.0 * s], [-2.2 * s, 0], [-5.2 * s, 2.0 * s], [-4.8 * s, 2.6 * s]], { fill: null, stroke: PD.gold, lwPx: lw * .8, smooth: .12 });
  // juggling-ball inlays
  [['#E8443A', -3.6, -1.6], ['#3E7BD8', -3.0, 0], ['#F2C230', -3.6, 1.6]].forEach(([c, bx, by]) => circle(bx * s, by * s, .42 * s, { fill: c, stroke: PD.ink, lwPx: lw * .5 }));
  shape(rectPts(-1.6 * s, -1.0 * s, .6 * s, 2.0 * s), { fill: '#2A2430', stroke: PD.ink, lwPx: lw * .6 });          // the bridge
  // neck + headstock
  shape(rectPts(0, -.42 * s, 8.2 * s, .84 * s), { fill: '#7A4A26', stroke: PD.ink, lwPx: lw });
  for (let i = 1; i < 8; i++) line([[i * s, -.4 * s], [i * s, .4 * s]], { stroke: PD.goldLt, lwPx: Math.max(.8, lw * .35) });
  shape([[8.2 * s, -.6 * s], [9.9 * s, -1.0 * s], [10.2 * s, .2 * s], [8.2 * s, .6 * s]], { fill: PD.gold, stroke: PD.ink, lwPx: lw });
  // strings, buzzing when played
  const buzz = o.strum ? o.strum * .12 * s * Math.sin(t * 90) : 0;
  for (let i = -1; i <= 1; i++) line([[-1.3 * s, i * .22 * s], [4 * s, i * .22 * s + buzz], [8.2 * s, i * .22 * s]], { stroke: 'rgba(255,255,240,.85)', lwPx: Math.max(.7, lw * .25), smooth: .5 });
  X.restore();
}

// ---------- Robo-Safadi's drum kit ----------
function pdDrums(x, y, k, t, o = {}) {
  const u = k, lw = Math.max(1.5, u * 1.6), hitL = o.hitL || 0, hitR = o.hitR || 0, kick = o.kick || 0;
  X.save(); X.translate(x, y);
  // cymbals on stands
  for (const [sx, sy, hit] of [[-78, -150, hitL], [80, -165, hitR]]) {
    line([[sx * u, 0], [sx * u, sy * u]], { stroke: '#8A8F98', lwPx: lw });
    X.save(); X.translate(sx * u, sy * u); X.rotate(.12 * Math.sin(t * 40) * hit - .12);
    ellipse(0, 0, 34 * u, 7 * u, { fill: linGrad(-34 * u, 0, 34 * u, 0, [[0, '#C98F1E'], [.5, '#FFE48A'], [1, '#C98F1E']]), stroke: PD.ink, lwPx: lw * .8 });
    X.restore();
  }
  // toms and snare
  for (const [tx, ty, r] of [[-38, -96, 20], [36, -100, 22], [-66, -62, 22]]) {
    shape(rectPts((tx - r) * u, ty * u, 2 * r * u, 24 * u), { fill: '#D23A5A', stroke: PD.ink, lwPx: lw * .8 });
    ellipse(tx * u, ty * u, r * u, 6 * u, { fill: '#F7F1E4', stroke: PD.ink, lwPx: lw * .8 });
  }
  // the bass drum, with a DCES dove on the head
  const b = 1 + .05 * kick;
  ellipse(0, -46 * u, 46 * u * b, 46 * u * b, { fill: '#D23A5A', stroke: PD.ink, lwPx: lw });
  ellipse(0, -46 * u, 38 * u * b, 38 * u * b, { fill: '#F7F1E4', stroke: PD.ink, lwPx: lw * .8 });
  X.font = `${16 * u}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#2E8F94'; X.fillText('DOVES', 0, -44 * u);
  X.restore();
}

// ---------- the secret potion ----------
function pdPotion(x, y, h, o = {}) {
  const u = h / 10, lw = Math.max(1.5, h * .025);
  X.save(); X.translate(x, y); X.rotate(o.ang || 0);
  shape([[-2.4 * u, 0], [2.4 * u, 0], [2.6 * u, -5.2 * u], [1.0 * u, -6.6 * u], [1.0 * u, -8.6 * u], [-1.0 * u, -8.6 * u], [-1.0 * u, -6.6 * u], [-2.6 * u, -5.2 * u]], { fill: rgba('#DDF5E0', .9), stroke: PD.ink, lwPx: lw, smooth: .25 });
  shape([[-2.3 * u, -.2 * u], [2.3 * u, -.2 * u], [2.5 * u, -4.4 * u + .2 * u * Math.sin(T * 5)], [-2.5 * u, -4.4 * u - .2 * u * Math.sin(T * 5)]], { fill: '#7DBE3A', stroke: null, smooth: .2 });
  for (let i = 0; i < 4; i++) circle((-1.2 + i * .8) * u, (-1.4 - (i % 2) * 1.2) * u, .25 * u, { fill: 'rgba(255,255,255,.6)', stroke: null });
  shape(rectPts(-1.25 * u, -9.6 * u, 2.5 * u, 1.1 * u), { fill: '#8A5A34', stroke: PD.ink, lwPx: lw * .8 });            // the cork
  // a broccoli floret poking out
  circle(-.3 * u, -10.4 * u, .8 * u, { fill: PD.broccoli, stroke: PD.ink, lwPx: lw * .6 }); circle(.5 * u, -10.7 * u, .7 * u, { fill: '#5FAF45', stroke: PD.ink, lwPx: lw * .6 });
  // the label
  shape(rectPts(-2.1 * u, -3.9 * u, 4.2 * u, 2.2 * u), { fill: PD.cream, stroke: PD.ink, lwPx: lw * .7, smooth: .1 });
  X.font = `${.62 * u}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#4A7A1E';
  X.fillText('SECRET', 0, -3.2 * u); X.fillText('POTION', 0, -2.4 * u);
  if (o.no > 0) {                                                               // a red NO stamp slams on
    const k = backOut(clamp(o.no)), sc = lerp(2.2, 1, k);
    X.save(); X.translate(0, -4 * u); X.rotate(-.25); X.scale(sc, sc); X.globalAlpha = clamp(o.no * 3);
    circle(0, 0, 4.4 * u, { fill: null, stroke: PD.red, lwPx: lw * 2.6 });
    line([[-3.1 * u, -3.1 * u], [3.1 * u, 3.1 * u]], { stroke: PD.red, lwPx: lw * 2.6 });
    X.restore();
  }
  X.restore();
}

// ---------- the shortcut sign ----------
function pdSign(x, y, w, text, o = {}) {
  const h = w * .32, lw = Math.max(2, w * .012), fall = o.fall || 0;
  X.save(); X.translate(x, y); X.rotate(-fall * 1.45);
  shape(rectPts(-w * .03, -w * 1.05, w * .06, w * 1.05), { fill: '#9AA2AA', stroke: PD.ink, lwPx: lw });
  shape([[-w * .5, -w * 1.05 - h], [w * .38, -w * 1.05 - h], [w * .55, -w * 1.05 - h / 2], [w * .38, -w * 1.05], [-w * .5, -w * 1.05]], { fill: o.col || '#F2C230', stroke: PD.ink, lwPx: lw * 1.4 });
  X.font = `${h * .48}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = PD.ink;
  X.fillText(text, -w * .02, -w * 1.05 - h / 2 + h * .04);
  X.restore();
}

// ---------- the hardest test ----------
function pdTestPaper(x, y, w, t = T, o = {}) {
  const h = w * 1.3, lw = Math.max(2, w * .01);
  X.save(); X.translate(x, y); X.rotate(o.ang || 0);
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#FFFDF6', stroke: PD.ink, lwPx: lw * 1.6 });
  X.font = `${w * .085}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#3E6FB0';
  X.fillText('THE HARDEST TEST', 0, -h * .4);
  X.font = `${w * .05}px ${FONT_TALK}`; X.fillStyle = PD.ink; X.textAlign = 'left';
  ['1. What beats a shortcut?', '2. Is there a magic drink?', '3. How do you learn the HOW?', '4. Who is the best judge?'].forEach((q, i) => {
    X.fillText(q, -w * .42, -h * .26 + i * h * .16);
    line([[-w * .38, -h * .26 + i * h * .16 + h * .07], [w * .3, -h * .26 + i * h * .16 + h * .07]], { stroke: 'rgba(60,60,80,.35)', lwPx: lw * .6 });
    if (o.check > i * .25) line([[w * .3, -h * .26 + i * h * .16 + h * .02], [w * .35, -h * .26 + i * h * .16 + h * .06], [w * .43, -h * .26 + i * h * .16 - h * .04]], { stroke: '#2E9C4A', lwPx: lw * 2.2 });
  });
  const handw = ['practice!', 'no!', 'practice!', 'Pearl ♥'];
  X.font = `${w * .055}px ${SF_CHALK}`; X.fillStyle = '#C0443F';
  handw.forEach((a, i) => { if (o.check > i * .25 + .1) X.fillText(a, -w * .3, -h * .26 + i * h * .16 + h * .055); });
  if (o.stamp > 0) {
    const k = backOut(clamp(o.stamp)), sc = lerp(2.5, 1, k);
    X.save(); X.translate(w * .22, h * .3); X.rotate(-.18); X.scale(sc, sc); X.globalAlpha = clamp(o.stamp * 4);
    circle(0, 0, w * .2, { fill: rgba('#FFE48A', .5), stroke: PD.red, lwPx: lw * 3 });
    X.font = `${w * .2}px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = PD.red; X.fillText('A+', 0, w * .01);
    X.restore();
  }
  X.restore();
}

// ---------- a calendar page ----------
function pdCalendar(x, y, w, day, o = {}) {
  const h = w * 1.15, lw = Math.max(2, w * .012);
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(1, o.flip ?? 1);
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#FFFDF6', stroke: PD.ink, lwPx: lw * 1.5, smooth: .04 });
  shape(rectPts(-w / 2, -h / 2, w, h * .3), { fill: o.col || '#D23A5A', stroke: PD.ink, lwPx: lw * 1.5 });
  for (let i = -2; i <= 2; i++) circle(i * w * .18, -h / 2, w * .035, { fill: '#59626A', stroke: PD.ink, lwPx: lw * .6 });
  X.font = `${w * .2}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF6';
  X.fillText(day, 0, -h * .35);
  X.font = `${w * .42}px ${FONT_SFX}`; X.fillStyle = PD.ink; X.fillText(o.num || '1', 0, h * .12);
  if (o.mark) { X.font = `${w * .18}px ${FONT_SFX}`; X.fillStyle = o.mark === '✓' ? '#2E9C4A' : PD.red; X.fillText(o.mark, w * .3, h * .36); }
  X.restore();
}

// ---------- Danny's superhero cape (behind him: draw it before the kid) ----------
function pdCape(x, y, s, t, o = {}) {
  const flap = Math.sin(t * 9) * .8, lw = Math.max(1.5, s * .22), L = (o.len || 13) * s;
  const wd = (o.wind ?? 1) * s;                                              // the wind blows it out to screen-left
  const pts = [[-2.6 * s, 0], [2.6 * s, 0], [4.0 * s - 4 * wd + flap * s, L * .5], [3.0 * s - 9 * wd + flap * 1.6 * s, L + flap * s * .6], [-8.0 * s - 9 * wd + flap * 1.2 * s, L * .7 - flap * s * .4], [-5.6 * s - 4 * wd + flap * .6 * s, L * .4]];
  X.save(); X.translate(x, y);
  shape(pts, { fill: linGrad(0, 0, 0, L, [[0, '#E0443A'], [1, '#A82A30']]), stroke: PD.ink, lwPx: lw, smooth: .35 });
  X.restore();
}

// ---------- the giant cube face ----------
// A 3×3 sticker wall (size = its width in px). k 0..1: stickers snap to solved one by one (each pops as it lands).
function pdCubeWall(cx, cy, size, k, t, o = {}) {
  const g = size / 3, lw = Math.max(3, size * .012), col = o.col || '#E8443A';
  X.save(); X.translate(cx, cy); X.rotate(o.ang || 0);
  shape(rectPts(-size / 2 - g * .08, -size / 2 - g * .08, size + g * .16, size + g * .16), { fill: '#1E1E24', stroke: PD.ink, lwPx: lw, smooth: .06 });
  const order = [4, 0, 8, 2, 6, 1, 7, 3, 5];
  for (let n = 0; n < 9; n++) {
    const i = order[n] % 3, j = Math.floor(order[n] / 3), lk = seg(k, n / 9, (n + 1) / 9), solved = lk >= 1 || order[n] === 4;
    const c = solved ? col : CD_COLS[Math.floor(hash(n * 7.7 + (o.seed || 0)) * 6)];
    const pop = solved && lk < 1.01 ? 1 + .18 * kick(k * 9, n + 1, 5) : 1;
    X.save(); X.translate((i - 1) * g, (j - 1) * g); X.scale(pop, pop);
    shape(rectPts(-g * .43, -g * .43, g * .86, g * .86), { fill: c, stroke: PD.ink, lwPx: lw * .6, smooth: .12 });
    shape(rectPts(-g * .34, -g * .38, g * .3, g * .12), { fill: 'rgba(255,255,255,.4)', stroke: null, smooth: .3 });
    X.restore();
  }
  X.restore();
}

// ---------- a paper crown ----------
function pdPaperCrown(x, y, w, col = PD.gold, t = T, rot = 0) {
  const h = w * .5, lw = Math.max(1.5, w * .04);
  X.save(); X.translate(x, y); X.rotate(rot);
  shape([[-w / 2, 0], [-w / 2, -h], [-w / 4, -h * .5], [0, -h * 1.1], [w / 4, -h * .5], [w / 2, -h], [w / 2, 0]], { fill: col, stroke: PD.ink, lwPx: lw });
  [-w / 2, 0, w / 2].forEach((px, i) => circle(px, i === 1 ? -h * 1.1 : -h, w * .07, { fill: ['#E26AA6', '#7FE3FF', '#8CCB3A'][i], stroke: PD.ink, lwPx: lw * .6 }));
  X.restore();
}

// ---------- concert beams ----------
// cols: beam colours; o: { n, a (alpha), y0 (rig height on screen), spread, speed, phase }
function pdBeams(t, cols = ['#FF6FB0', '#7FE3FF', '#FFE066'], o = {}) {
  const n = o.n || 6, a = o.a ?? .16, y0 = o.y0 ?? -60, speed = o.speed ?? .9;
  X.save(); X.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x0 = W * (i + .5) / n, ang = Math.PI / 2 + (o.spread ?? .5) * Math.sin(t * speed + i * 1.7 + (o.phase || 0));
    const L = H * 1.5, wd = .1, x1 = x0 + Math.cos(ang - wd) * L, y1 = y0 + Math.sin(ang - wd) * L, x2 = x0 + Math.cos(ang + wd) * L, y2 = y0 + Math.sin(ang + wd) * L;
    shape([[x0 - 6, y0], [x0 + 6, y0], [x2, y2], [x1, y1]], { fill: linGrad(x0, y0, (x1 + x2) / 2, (y1 + y2) / 2, [[0, rgba(cols[i % cols.length], a * 1.6)], [1, rgba(cols[i % cols.length], 0)]]), stroke: null });
  }
  X.restore();
}

// ---------- the banner over the stage ----------
function pdBanner(P, t) {
  const z = 312, sw = 3 * Math.sin(t * 1.1);
  if (!P.visible(z)) return;
  P.plane(z, () => {
    X.save(); X.scale(P.dir, 1);
    for (const sx of [-1, 1]) line([[sx * 300, -470], [sx * 300, -442 - sw * sx]], { stroke: '#56606A', lwPx: 1.5 });
    shape([[-330, -442 - sw], [330, -442 + sw], [322, -384 + sw], [0, -376], [-322, -384 - sw]], { fill: '#7A3FA0', stroke: PAL.ink, lwPx: 2.4, smooth: .15 });
    shape([[-330, -442 - sw], [-366, -420], [-330, -398]], { fill: '#5E2E80', stroke: PAL.ink, lwPx: 2 });
    shape([[330, -442 + sw], [366, -420], [330, -398]], { fill: '#5E2E80', stroke: PAL.ink, lwPx: 2 });
    X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = 7; X.strokeStyle = PAL.ink; X.strokeText('★ THE PERFECT DROP ★', 0, -408); X.fillStyle = '#FFE48A'; X.fillText('★ THE PERFECT DROP ★', 0, -408);
    X.restore();
  });
}

// ---------- the puddle ----------
function pdPuddle(x, y, w, k, t) {
  if (k <= 0) return;
  const rx = w / 2 * k, ry = w * .12 * k;
  shape(ellPts(x, y, rx, ry, 40).map(([px, py], i) => [px + Math.sin(i * 1.7 + t * 2) * rx * .04, py]), { fill: rgba(PD.waterDk, .55), stroke: rgba('#1E3657', .7), lwPx: 2, smooth: .8 });
  ellipse(x - rx * .25, y - ry * .3, rx * .35, ry * .25, { fill: 'rgba(255,255,255,.45)', stroke: null });
  for (let i = 0; i < 3; i++) { const a = frac(t * .8 + i / 3); ellipse(x, y, rx * (.2 + .8 * a), ry * (.2 + .8 * a), { fill: null, stroke: rgba('#FFFFFF', .5 * (1 - a)), lwPx: 2 }); }
}

// ---------- the title card ----------
function pdTitle(t, t0, o = {}) {
  const a = t - t0; if (a < 0) return;
  const out = 1 - ease(seg(a, (o.life || 2.6) - .4, o.life || 2.6)); if (out <= 0) return;
  overlay(() => {
    X.save(); X.globalAlpha = out; X.translate(W / 2, o.y || H * .3);
    const k = backOut(seg(a, 0, .35)); X.scale(k, k); X.rotate(-.04);
    X.font = `150px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = 26; X.strokeStyle = PD.ink; X.strokeText('THE PERFECT DROP', 0, 0);
    X.fillStyle = linGrad(0, -70, 0, 70, [[0, '#FFF3B0'], [.5, PD.gold], [1, '#E08A1E']]); X.fillText('THE PERFECT DROP', 0, 0);
    X.font = `48px ${FONT_SFX}`; X.lineWidth = 10; X.strokeText('starring PRINCESS PEARL', 0, 110); X.fillStyle = PD.pinkLt; X.fillText('starring PRINCESS PEARL', 0, 110);
    X.restore();
  });
}
