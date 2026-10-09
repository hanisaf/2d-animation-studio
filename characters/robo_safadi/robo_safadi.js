// characters/robo_safadi/robo_safadi.js: Robo-Safadi, the robot professor Alma and Jenna dreamed up for Halloween (README.md).
//
// roboSafadi(x, y, s, o) → anchors
//   (x, y) screen point on the floor between the feet · s = px per local unit. He is ~31.5 units tall (feet to antenna ball),
//   ~29.5 to the top of his hair plate, like Safadi, so in a set use s = ROBO_SAFADI_UNIT * P.k(Z) (≈ 189 world units with the antenna).
//
// Local units: feet y = 0, y points DOWN (up is negative). Hips −8.5, shoulders −15.8, chin −17.4, head centre −22.6,
// hair top ≈ −29.6, antenna ball ≈ −31.4. A big box head (≈ 40% of his height) on a tan "suit" chest, flex-tube arms, boxy legs.
//
// Pose     dy (hip drop; + = crouch) · lean (torso, rad) · tilt (head, rad) · turn (head −1..1: the face slides to that side)
//          jump (units off the floor) · rot (whole body, about the belly) · sq (squash) · flip · hum (default on: a faint idle vibration)
// Limbs    handL / handR: [x, y] wrist targets (L = screen-left) · handPoseL / handPoseR: 'open' | 'palm' | 'point' | 'fist' | 'claw'
//          footL / footR: ankle targets (rest [∓1.3, −0.9]) · broccoli: 'L' | 'R' (holds a broccoli in that hand)
// Face     eyes: open | wide | happy | closed | squint | off | x (malfunction) | heart · lookX / lookY (−1..1) · blink (0..1, auto)
//          brows: normal | up | worried | angry | quizzical · mouth: smile | grin | open | o | O | flat | frown | smirk | teeth
//          (lipFlap works as usual: the LED mouth lights up in that shape)
// Powers   red (0..1): ACTIVATE: the eyes, mouth and antenna switch from cool cyan to glowing red · scan (0..1): a red scanning beam
//          from the eyes to the floor in the look direction · steam (0..1): puffs from the ear vents · hover (0..1): legs tuck, jets fire,
//          he rises · glitch (0..1): sparks, a twitch and static over the face · antenna (rad: lean of the antenna; it also bobs on jumps)
// Extras   emote: '?' | '!' | '!?' | 'oil' (a drop of oil: his sweat) | 'music' | 'heart' with emoteK (0..1 pop) · boil (px)
//
// Returns anchors in screen px: { head, mouth, top, antenna, eyeL, eyeR, chest, belly, handL, handR, footL, footR }
// Also: roboSafadiWalk(p, k) → pose options for a stiff robot march (p = steps travelled, k = 0..1 amount), to spread into roboSafadi().

const ROBO_SAFADI_UNIT = 6.0;   // world units per local unit (Safadi's scale)
const RS = {
  ink: '#3B2530', metal: '#BAC4CA', metalLt: '#DCE3E7', metalDk: '#8C98A0', metalDkr: '#6A757D', bezel: '#2A3036',
  hair: '#2E221D', hairLt: '#4D3A30', suit: '#D4B68C', suitDk: '#B7966B', suitLt: '#E4CDA7', shirt: '#F2F0EA', tie: '#C3222F', tieDk: '#8E1621',
  shoe: '#6E3B22', shoeDk: '#4A2515', led: '#BFF3FF', ledDk: '#3FA9C9', red: '#FF2E2E', redLt: '#FF9A9A', jet: '#FFB23A', broccoli: '#5E9E4A', stem: '#7FB069',
};
const RS_HIP = -8.5;

function roboSafadi(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, red = clamp(o.red || 0), hov = clamp(o.hover || 0), gl = clamp(o.glitch || 0);
  const lw = clamp(s * .15, 1.6, 5.5) / s, ledC = mixCol(RS.led, RS.red, red), ledD = mixCol(RS.ledDk, '#9E1010', red);
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  const air = (o.jump || 0) + hov * (3 + .35 * Math.sin(t * 3.1));
  if (!o.noShadow) { const f = 1 - clamp(air / 22) * .55; ellipse(0, .15, 4.3 * f, .8 * f, { fill: 'rgba(40,20,30,.28)', stroke: null }); }
  X.translate(0, -air);
  if (gl > .01) { const f = Math.floor(t * 18); X.translate((hash(f) - .5) * .5 * gl, (hash(f + 3) - .5) * .3 * gl); X.rotate((hash(f + 7) - .5) * .06 * gl); }
  if (o.rot) { X.translate(0, -12); X.rotate(o.rot); X.translate(0, 12); }
  if (o.sq) X.scale(1 + o.sq * .55, 1 - o.sq);
  const hum = o.hum === false ? 0 : .04 * Math.sin(t * 47);

  withBoil(o.boil ?? .6, () => {
    const hipY = RS_HIP + (o.dy || 0) + hum, lean = o.lean || 0, cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];

    // ---- legs: boxy pistons, knee bolts, oxford-block feet; with hover they tuck up over the jets ----
    [[-1, o.footL || [-1.3, -.9]], [1, o.footR || [1.3, -.9]]].forEach(([sd, f0]) => {
      const f = mixPt(f0, [sd * .9, -3.4], hov), hp = tl(sd * 1.25, -.1), { joint, end } = ik2(hp, f, 4.1, 3.8, [sd * .12, .1]);
      rsTube([hp, joint], 2.3, RS.suit, lw); rsTube([joint, end], 1.9, RS.suitDk, lw);
      line([[hp[0] + sd * .45, hp[1] + .3], [joint[0] + sd * .4, joint[1]]], { stroke: RS.suitLt, lw: lw * .9 });
      circle(joint[0], joint[1], .62, { fill: RS.metal, stroke: RS.ink, lw: lw * .9 }); circle(joint[0], joint[1], .2, { fill: RS.metalDkr, stroke: null });
      rsFoot(end, sd, lw);
      if (hov > .02) rsJet(end[0], end[1] + .9, hov, t, sd);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
    });

    // ---- torso: a tan metal box painted like Safadi's suit ----
    X.save(); X.translate(0, hipY); X.rotate(lean);
    rsTorso(lw, t, red);
    A.chest = toPx(0, -6.6); A.belly = toPx(0, -2.6);
    for (let i = 0; i < 3; i++) shape(rectPts(-.95 - i * .05, -9.3 + i * .38, 1.9 + i * .1, .42), { fill: i % 2 ? RS.metalDk : RS.metal, stroke: RS.ink, lw: lw * .8 });   // the accordion neck

    // ---- head ----
    X.save(); X.translate(0, -9.1); X.rotate(o.tilt || 0); X.translate(0, -5.0);
    rsHead(o, t, lw, A, red, ledC, ledD);
    X.restore();
    X.restore();

    // ---- arms: flex tubes in front of the body ----
    [[-1, o.handL || [-4.6, -8.2], o.handPoseL || 'open'], [1, o.handR || [4.6, -8.2], o.handPoseR || 'open']].forEach(([sd, tg, pose]) => {
      const sh = tl(sd * 3.55, -7.3), { joint, end } = ik2(sh, tg, 3.8, 3.5, [sd * .25, 1]);
      circle(sh[0], sh[1], .95, { fill: RS.suitDk, stroke: RS.ink, lw });
      rsFlex([sh, joint], 1.25, lw); rsFlex([joint, end], 1.15, lw);
      circle(joint[0], joint[1], .55, { fill: RS.metal, stroke: RS.ink, lw: lw * .9 });
      const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
      if ((sd < 0 && o.broccoli === 'L') || (sd > 0 && o.broccoli === 'R')) rsBroccoli(end[0] + Math.cos(ang) * .7, end[1] + Math.sin(ang) * .7 - .4, lw, t);
      rsHand(end, ang, sd, (sd < 0 && o.broccoli === 'L') || (sd > 0 && o.broccoli === 'R') ? 'fist' : pose, lw);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang) * .7, end[1] + Math.sin(ang) * .7);
    });
  });
  if (clamp(o.steam || 0) > .01) rsSteam(clamp(o.steam), t, A, s);
  if (gl > .01) rsSparks(gl, t);
  A.top = toPx(0, -29.6);
  X.restore();
  if (clamp(o.scan || 0) > .01) rsScan(clamp(o.scan), A, s, t, o.lookX || 0, y);
  if (o.emote && (o.emoteK ?? 1) > .02) rsEmote(o.emote, A, s, o.emoteK ?? 1, t);
  return A;
}

// ---------- body parts ----------
function rsTube(pts, w, col, lw) {
  if (JIT) { const a = JIT / pxScale(); pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  withBoil(0, () => { line(pts, { stroke: RS.ink, lw: w + lw * 2, lineCap: 'butt' }); line(pts, { stroke: col, lw: w, lineCap: 'butt' }); });
}
// A ribbed flexible arm segment: a metal tube with rings across it.
function rsFlex(pts, w, lw) {
  withBoil(0, () => {
    line(pts, { stroke: RS.ink, lw: w + lw * 2 }); line(pts, { stroke: RS.metalDk, lw: w });
    const [a, b] = pts, L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n = Math.max(3, Math.round(L / .45));
    for (let i = 1; i < n; i++) { const cx = a[0] + ux * L * i / n, cy = a[1] + uy * L * i / n; line([[cx - uy * w * .5, cy + ux * w * .5], [cx + uy * w * .5, cy - ux * w * .5]], { stroke: i % 2 ? RS.metalLt : RS.metalDkr, lw: lw * .9 }); }
  });
}
function rsFoot(a, sd, lw) {
  X.save(); X.translate(a[0] + sd * .15, a[1]); X.scale(sd, 1);
  shape([[-1.1, .1], [-1.0, -.7], [.7, -.75], [1.5, -.2], [1.55, .95], [-1.1, .95]], { fill: RS.shoe, stroke: RS.ink, lw, smooth: .25 });
  shape([[-.85, -.6], [.5, -.62], [.6, -.05], [-.8, -.05]], { fill: RS.shoeDk, stroke: null });
  for (const bx of [-.6, .9]) circle(bx, .55, .14, { fill: RS.metal, stroke: null });
  X.restore();
}
function rsJet(x, y, k, t, sd) {                                           // hover thrusters under the feet
  const fl = 1 + .25 * Math.sin(t * 37 + sd) + .15 * Math.sin(t * 61);
  shape(rectPts(x - .7, y - .2, 1.4, .5), { fill: RS.metalDkr, stroke: RS.ink, lwPx: 1.5 });
  X.save(); X.globalAlpha = k;
  shape([[x - .65, y + .3], [x + .65, y + .3], [x, y + 3.2 * k * fl]], { fill: RS.jet, stroke: null, smooth: .5 });
  shape([[x - .35, y + .3], [x + .35, y + .3], [x, y + 1.9 * k * fl]], { fill: '#FFF3C4', stroke: null, smooth: .5 });
  X.restore();
}
function rsTorso(lw, t, red) {
  const body = [[-3.45, -8.5], [-3.6, -6.4], [-3.35, -3.2], [-3.25, .5], [3.25, .5], [3.35, -3.2], [3.6, -6.4], [3.45, -8.5], [1.4, -8.95], [-1.4, -8.95]];
  shape(body, { fill: linGrad(-3.6, 0, 3.6, 0, [[0, RS.suitDk], [.35, RS.suit], [.7, RS.suitLt], [1, RS.suitDk]]), stroke: RS.ink, lw, smooth: .2 });
  line([[-3.3, -.4], [3.3, -.4]], { stroke: RS.suitDk, lw: lw * 1.2 });                                          // belt seam
  [[-2.9, -8.1], [2.9, -8.1], [-2.85, .0], [2.85, .0]].forEach(([rx, ry]) => circle(rx, ry, .16, { fill: RS.metalLt, stroke: RS.ink, lw: lw * .5 }));
  shape([[-.95, -8.9], [.95, -8.9], [0, -3.4]], { fill: RS.shirt, stroke: RS.ink, lw: lw * .8 });                 // the shirt plate
  shape([[-.34, -8.75], [.34, -8.75], [.24, -8.1], [-.24, -8.1]], { fill: RS.tie, stroke: RS.ink, lw: lw * .8 });
  shape([[-.24, -8.1], [.24, -8.1], [.5, -5.8], [0, -5.0], [-.5, -5.8]], { fill: linGrad(0, -8, 0, -5, [[0, RS.tie], [1, RS.tieDk]]), stroke: RS.ink, lw: lw * .8 });
  [-1, 1].forEach(sd => shape([[sd * .95, -8.92], [sd * 1.55, -8.6], [sd * 2.1, -7.1], [sd * 1.35, -5.2], [sd * .15, -3.3], [0, -3.4]], { fill: RS.suitLt, stroke: RS.ink, lw }));
  for (const by of [-2.6, -1.4]) circle(0, by, .18, { fill: RS.metalDkr, stroke: null });
  shape(rectPts(1.75, -6.6, 1.25, .75), { fill: RS.bezel, stroke: RS.ink, lw: lw * .7 });                         // the breast-pocket status panel
  for (let i = 0; i < 3; i++) { const on = hash(Math.floor(t * 3) * 7 + i) > .45; circle(2.0 + i * .38, -6.22, .12, { fill: on ? mixCol('#7CFF9B', RS.red, red) : '#2E4A3A', stroke: null }); }
}

// The box head, in head-local units (origin: head centre; −5.0 is the hair line, +4.6 the chin).
function rsHead(o, t, lw, A, red, ledC, ledD) {
  const tn = clamp(o.turn || 0, -1, 1), fx = tn * 1.1, R = 1.3, x0 = -5.7, x1 = 5.7, y0 = -5.4, y1 = 4.6;
  const box = []; for (const [cx, cy, a0] of [[x1 - R, y0 + R, -Math.PI / 2], [x1 - R, y1 - R, 0], [x0 + R, y1 - R, Math.PI / 2], [x0 + R, y0 + R, Math.PI]]) for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * Math.PI / 2; box.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
  // ears: hex bolts with vents (behind the box edge)
  for (const sd of [-1, 1]) { const ex = sd * (5.85 - tn * sd * .25);
    shape(ellPts(ex, -.3, 1.0, 1.1, 6, Math.PI / 6), { fill: RS.metalDk, stroke: RS.ink, lw });
    shape(ellPts(ex, -.3, .52, .56, 6, Math.PI / 6), { fill: RS.metal, stroke: RS.ink, lw: lw * .7 }); }
  // the antenna (drawn first so the hair sits over its base)
  const bob = (o.antenna || 0) + .12 * Math.sin(t * 2.3) - .02 * (o.jump || 0), tip = [fx * .4 + Math.sin(bob) * 2.6, -7.5 - Math.cos(bob) * 2.6];
  line([[fx * .4, -6.9], [fx * .4 + Math.sin(bob) * 1.3, -7.5 - Math.cos(bob) * 1.3], tip], { stroke: RS.ink, lw: lw * 2.6, smooth: .5 });
  line([[fx * .4, -6.9], [fx * .4 + Math.sin(bob) * 1.3, -7.5 - Math.cos(bob) * 1.3], tip], { stroke: RS.metalDk, lw: lw * 1.2, smooth: .5 });
  const blink = .55 + .45 * Math.max(0, Math.sin(t * 4)), aCol = mixCol('#7FE3FF', RS.red, red);
  circle(tip[0], tip[1], 1.1, { fill: radGrad(tip[0], tip[1], .1, 1.1, [[0, rgba(aCol, .55 * blink)], [1, rgba(aCol, 0)]]), stroke: null });
  circle(tip[0], tip[1], .55, { fill: mixCol(RS.metalLt, aCol, blink), stroke: RS.ink, lw: lw * .8 });
  A.antenna = toPx(tip[0], tip[1]);
  // the box
  shape(box, { fill: linGrad(-5, -5, 5, 5, [[0, RS.metalLt], [.45, RS.metal], [1, RS.metalDk]]), stroke: RS.ink, lw: lw * 1.2 });
  X.save(); tracePath(box, true); X.clip();
  withBoil(0, () => {
    shape([[x1 - 1.4 + fx * .3, y0], [x1 + 1, y0], [x1 + 1, y1], [x1 - 1.1 + fx * .3, y1]], { fill: rgba(RS.metalDkr, .35), stroke: null });   // the shaded side
    line([[x0, 3.5], [x1, 3.5]], { stroke: RS.metalDk, lw: lw * .9 });                                          // jaw seam
    line([[-1.8 + fx, 3.5], [-1.8 + fx, y1]], { stroke: RS.metalDk, lw: lw * .7 }); line([[1.8 + fx, 3.5], [1.8 + fx, y1]], { stroke: RS.metalDk, lw: lw * .7 });
  });
  X.restore();
  [[x0 + .7, 3.9], [x1 - .7, 3.9], [x0 + .7, -1.0], [x1 - .7, -1.0]].forEach(([rx, ry]) => circle(rx, ry, .17, { fill: RS.metalLt, stroke: RS.ink, lw: lw * .5 }));
  // the hair plate: Safadi's side part (screen-left) and the flick, moulded in dark enamel
  const hair = [[x0 - .15, -2.6], [x0 - .25, -5.0], [-4.4, -6.6], [-1.6, -7.2], [1.6, -7.15], [4.4, -6.5], [x1 + .25, -5.0], [x1 + .15, -2.4],
    [4.6, -3.5], [2.2, -3.75], [-.2 + fx * .3, -3.9], [-1.3 + fx * .3, -3.3], [-1.9 + fx * .3, -4.0], [-3.9, -3.7], [-5.0, -3.0]];
  shape(hair, { fill: RS.hair, stroke: RS.ink, lw, smooth: .3 });
  line([[-4.6, -5.6], [-1.2, -6.6], [2.8, -6.4]], { stroke: RS.hairLt, lw: lw * 1.4, smooth: .5 });
  line([[-2.2 + fx * .3, -7.0], [-1.6 + fx * .3, -4.1]], { stroke: '#1B1411', lw: lw * .9 });                 // the parting
  // brows: thick bars
  const bk = o.brows || 'normal';
  [-1, 1].forEach(sd => {
    let up = bk === 'up' ? .45 : 0, rot = bk === 'angry' ? -sd * .32 : bk === 'worried' ? sd * .28 : 0;
    if (bk === 'quizzical') { up = sd > 0 ? .6 : -.05; rot = sd > 0 ? -.12 : .1; }
    const bx = sd * 2.1 + fx, by = -2.45 - up;
    X.save(); X.translate(bx, by); X.rotate(rot); shape(rectPts(-1.25, -.3, 2.5, .62), { fill: RS.hair, stroke: RS.ink, lw: lw * .8, smooth: .2 }); X.restore();
  });
  // eyes: square LED screens
  const ek = o.eyes || 'open', ph = (t + .9) % 4.3, bl = o.blink ?? (ph < .14 ? Math.sin(ph / .14 * Math.PI) : 0);
  const lx = clamp(o.lookX || 0, -1, 1), ly = clamp(o.lookY || 0, -1, 1);
  [-1, 1].forEach(sd => {
    const cx = sd * 2.1 + fx * (sd * tn > 0 ? 1.15 : .85), cy = -.65, w = 2.35, h = 2.0;
    shape(rectPts(cx - w / 2 - .22, cy - h / 2 - .22, w + .44, h + .44), { fill: RS.bezel, stroke: RS.ink, lw: lw * .9, smooth: .15 });
    A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(cx, cy);
    if (ek === 'off') { shape(rectPts(cx - w / 2, cy - h / 2, w, h), { fill: '#1A1E22', stroke: null }); line([[cx - w * .3, cy - h * .3], [cx - w * .1, cy - h * .4]], { stroke: 'rgba(255,255,255,.25)', lw: lw * .8 }); return; }
    X.save();
    if (red > .05) { X.shadowColor = RS.red; X.shadowBlur = 14 * red * pxScale() / 4; }
    const screen = mixCol('#163B48', '#5A0D0D', red);
    shape(rectPts(cx - w / 2, cy - h / 2, w, h), { fill: screen, stroke: null });
    const L = (pts, wd = .45) => line(pts, { stroke: ledC, lw: wd, lineCap: 'round' });
    const eh = (1 - bl) * (ek === 'squint' ? .45 : 1);
    if (ek === 'happy') L([[cx - .75, cy + .3], [cx, cy - .45], [cx + .75, cy + .3]]);
    else if (ek === 'closed' || eh < .15) L([[cx - .8, cy + .1], [cx + .8, cy + .1]]);
    else if (ek === 'x') { L([[cx - .7, cy - .6], [cx + .7, cy + .6]]); L([[cx + .7, cy - .6], [cx - .7, cy + .6]]); }
    else if (ek === 'heart') shape([[cx, cy + .75], [cx - .85, cy - .05], [cx - .6, cy - .6], [cx, cy - .3], [cx + .6, cy - .6], [cx + .85, cy - .05]], { fill: ledC, stroke: null, smooth: .5 });
    else {
      const pw = ek === 'wide' ? .7 : 1.05, phh = (ek === 'wide' ? .7 : 1.15) * eh;
      shape(rectPts(cx - w / 2 + .12, cy - h / 2 + .12, w - .24, h - .24), { fill: rgba(ledC, .22), stroke: null });
      shape(rectPts(cx + lx * .45 - pw / 2, cy + ly * .32 - phh / 2, pw, phh), { fill: ledC, stroke: null });
    }
    for (let yy = cy - h / 2 + .2; yy < cy + h / 2; yy += .32) line([[cx - w / 2, yy], [cx + w / 2, yy]], { stroke: 'rgba(0,0,0,.18)', lw: .08 });   // scan lines
    X.restore();
  });
  if (red > .05) [-1, 1].forEach(sd => { const cx = sd * 2.1 + fx * (sd * tn > 0 ? 1.15 : .85), cy = -.65;   // the red glow around the eyes
    X.save(); X.globalAlpha = .45 * red; circle(cx, cy, 2.6, { fill: radGrad(cx, cy, .2, 2.6, [[0, rgba(RS.red, .9)], [1, rgba(RS.red, 0)]]), stroke: null }); X.restore(); });
  // the nose: a small metal wedge
  shape([[-.5 + fx * 1.05, .65], [.5 + fx * 1.05, .65], [.7 + fx * 1.05, 1.55], [-.7 + fx * 1.05, 1.55]], { fill: RS.metalDk, stroke: RS.ink, lw: lw * .8 });
  // the mouth: an LED display over a speaker grill
  const mx = fx * 1.0, my = 2.55, mw = 4.4, mh = 1.35;
  shape(rectPts(mx - mw / 2, my - mh / 2, mw, mh), { fill: mixCol('#12181C', '#2A0808', red), stroke: RS.ink, lw: lw * .9, smooth: .15 });
  for (let i = 1; i < 11; i++) line([[mx - mw / 2 + i * mw / 11, my - mh / 2 + .12], [mx - mw / 2 + i * mw / 11, my + mh / 2 - .12]], { stroke: 'rgba(255,255,255,.07)', lw: .1 });
  rsMouth(o.mouth || 'smile', mx, my, mw, mh, ledC, ledD, t);
  A.head = toPx(fx * .6, -.4); A.mouth = toPx(mx, my);
  if ((o.glitch || 0) > .05) { const g = o.glitch, f = Math.floor(t * 20);                                        // static over the face
    X.save(); X.globalAlpha = .5 * g; for (let i = 0; i < 5; i++) { const yy = -5 + hash(f * 3 + i) * 9.5; shape(rectPts(x0, yy, x1 - x0, .25 + .3 * hash(f + i * 5)), { fill: i % 2 ? '#FFFFFF' : RS.red, stroke: null }); } X.restore(); }
}
function rsMouth(kind, mx, my, mw, mh, c, cd, t) {
  X.save(); X.shadowColor = c; X.shadowBlur = 6 * pxScale() / 20;
  const L = (pts, w = .32, smooth = .5) => line(pts.map(([a, b]) => [mx + a, my + b]), { stroke: c, lw: w, smooth, lineCap: 'round' });
  if (kind === 'smile') L([[-1.4, -.15], [0, .3], [1.4, -.15]]);
  else if (kind === 'grin') { shape([[-1.7, -.35], [1.7, -.35], [1.1, .4], [-1.1, .4]].map(([a, b]) => [mx + a, my + b]), { fill: c, stroke: null, smooth: .4 });
    for (const a of [-.6, 0, .6]) line([[mx + a, my - .35], [mx + a, my + .35]], { stroke: cd, lw: .12 }); }
  else if (kind === 'open') { const f = Math.floor(t * 14); for (let i = 0; i < 9; i++) { const a = -1.75 + i * .44, hh = .15 + .45 * hash(f * 13 + i) * Math.sin(Math.PI * (i + .5) / 9); line([[mx + a, my - hh], [mx + a, my + hh]], { stroke: c, lw: .26, lineCap: 'round' }); } }
  else if (kind === 'o') shape(ellPts(mx, my, .35, .38, 12), { fill: null, stroke: c, lw: .26 });
  else if (kind === 'O') shape(ellPts(mx, my, .55, .52, 14), { fill: rgba(c, .35), stroke: c, lw: .3 });
  else if (kind === 'flat') L([[-1.3, 0], [1.3, 0]], .3, 0);
  else if (kind === 'frown') L([[-1.4, .3], [0, -.2], [1.4, .3]]);
  else if (kind === 'smirk') L([[-1.2, .1], [.2, .1], [1.3, -.3]], .3, .3);
  else if (kind === 'teeth') { shape(rectPts(mx - 1.7, my - .4, 3.4, .8), { fill: c, stroke: null }); for (let i = -3; i <= 3; i++) line([[mx + i * .45, my - .4], [mx + i * .45, my + .4]], { stroke: cd, lw: .1 }); line([[mx - 1.7, my], [mx + 1.7, my]], { stroke: cd, lw: .1 }); }
  else L([[-1.4, -.15], [0, .3], [1.4, -.15]]);
  X.restore();
}
function rsHand(p, ang, sd, pose, lw) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  const M = { fill: RS.metal, stroke: RS.ink, lw: lw * .9 }, fing = (pts, w = .42) => { line(pts, { stroke: RS.ink, lw: w + lw * 1.8, lineCap: 'round' }); line(pts, { stroke: RS.metalLt, lw: w, lineCap: 'round' }); };
  shape(rectPts(-.25, -.4, .5, .8), { fill: RS.metalDkr, stroke: RS.ink, lw: lw * .8 });                         // the wrist ring
  if (pose === 'fist') { shape(rectPts(.25, -.75, 1.35, 1.5), { ...M, smooth: .35 }); for (const yy of [-.3, .1, .45]) line([[.9, yy], [1.55, yy]], { stroke: RS.metalDk, lw: .1 }); }
  else if (pose === 'point') { shape(rectPts(.25, -.65, 1.15, 1.3), { ...M, smooth: .35 }); fing([[1.3, -.35], [2.6, -.35]]); fing([[.7, .55], [1.15, .95]], .36); }
  else if (pose === 'claw') { shape(ellPts(.75, 0, .6, .6, 12), M); fing([[1.1, -.35], [1.9, -.75], [2.4, -.35]], .36); fing([[1.1, .35], [1.9, .75], [2.4, .35]], .36); }
  else if (pose === 'palm') { shape(rectPts(.25, -.75, 1.2, 1.5), { ...M, smooth: .3 }); fing([[1.3, -.6], [2.3, -.95]]); fing([[1.4, -.15], [2.5, -.2]]); fing([[1.3, .35], [2.3, .6]]); fing([[.6, .75], [1.0, 1.4]], .36); }
  else { shape(rectPts(.25, -.7, 1.2, 1.4), { ...M, smooth: .3 }); fing([[1.3, -.5], [2.1, -.65], [2.4, -.4]]); fing([[1.35, 0], [2.3, .05]]); fing([[1.3, .45], [2.1, .65], [2.35, .45]]); }
  X.restore();
}
function rsBroccoli(x, y, lw, t) {
  X.save(); X.translate(x, y); X.rotate(.08 * Math.sin(t * 2));
  shape([[-.35, 0], [.35, 0], [.55, -2.4], [-.55, -2.4]], { fill: RS.stem, stroke: RS.ink, lw: lw * .8 });
  [[-1.1, -2.7, .85], [0, -3.3, 1.0], [1.1, -2.7, .85], [-.55, -3.6, .7], [.6, -3.7, .7], [0, -2.5, .8]].forEach(([bx, by, r], i) => {
    circle(bx, by, r, { fill: RS.broccoli, stroke: RS.ink, lw: lw * .8 }); circle(bx - r * .3, by - r * .3, r * .4, { fill: '#7DBE5E', stroke: null }); });
  X.restore();
}

// ---------- powers and extras (screen-space effects take the anchors) ----------
function rsSteam(k, t, A, s) {
  const [hx, hy] = A.head;
  overlay(() => { for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) {
    const ph = frac(t * .8 + i / 4 + (sd > 0 ? .13 : 0)), px = hx + sd * s * (6.4 + ph * 2.2), py = hy - s * (.3 + ph * 4.5);
    X.save(); X.globalAlpha = k * (1 - ph) * .85; circle(px, py, s * (.6 + ph * 1.4), { fill: '#F4F6F8', stroke: 'rgba(59,37,48,.5)', lwPx: 2 }); X.restore(); } });
}
function rsSparks(k, t) {
  const f = Math.floor(t * 16);
  for (let i = 0; i < 6; i++) { if (hash(f * 5 + i) > .45 * k + .2) continue;
    const sx = (hash(f + i * 3) - .5) * 13, sy = -16 - hash(f * 2 + i) * 14, r = .7 + hash(i + f) * .8;
    shape(starPts(sx, sy, r, .3, 4, hash(f + i) * 3), { fill: '#FFE97A', stroke: RS.ink, lwPx: 1.5 }); }
}
function rsScan(k, A, s, t, lookX, floorY) {                              // a red beam from the eyes, sweeping the floor
  const [ex, ey] = [(A.eyeL[0] + A.eyeR[0]) / 2, (A.eyeL[1] + A.eyeR[1]) / 2], sweep = Math.sin(t * 2.2) * 4 * s, cx = ex + lookX * 9 * s + sweep, fy = floorY + s * 2;
  overlay(() => { X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = .42 * k;
    shape([[A.eyeL[0], ey], [A.eyeR[0], ey], [cx + 4 * s, fy], [cx - 4 * s, fy]], { fill: linGrad(0, ey, 0, fy, [[0, 'rgba(255,60,60,.9)'], [1, 'rgba(255,40,40,.15)']]), stroke: null });
    X.globalAlpha = .9 * k; ellipse(cx, fy, 4 * s, .7 * s, { fill: null, stroke: '#FF5A5A', lwPx: 3 });
    const sl = frac(t * 1.3); line([[lerp(ex, cx - 4 * s, sl), lerp(ey, fy, sl)], [lerp(ex, cx + 4 * s, sl), lerp(ey, fy, sl)]], { stroke: '#FFC4C4', lwPx: 3 });
    X.restore(); });
}
function rsEmote(kind, A, s, k, t) {
  const [hx, hy] = A.head, pop = backOut(k);
  if (kind === 'oil') {                                                     // his "sweat": a drop of oil
    const [sx, sy] = [hx + s * 5.0, hy - s * 2.6 + (1 - k) * s];
    overlay(() => { X.save(); X.translate(sx, sy); X.scale(pop * s, pop * s); shape([[0, -1.0], [.5, .1], [0, .55], [-.5, .1]], { fill: '#2B2F45', stroke: RS.ink, lwPx: 3, smooth: .7 });
      circle(-.15, .05, .14, { fill: 'rgba(160,200,255,.8)', stroke: null }); X.restore(); });
    return;
  }
  const txt = { '?': '?', '!': '!', '!?': '!?', music: '♪', heart: '♥' }[kind] ?? kind, col = kind === 'heart' ? RS.red : kind === 'music' ? PAL.blue : PAL.goldLt;
  overlay(() => { X.save(); X.translate(hx + s * 5.6, hy - s * 7.0 + wob(t, 1.5) * s * .2); X.rotate(.12 + wob(t, 1.1) * .06); X.scale(pop, pop);
    const size = s * 3.6; X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = size * .14; X.strokeStyle = RS.ink; X.strokeText(txt, 0, 0); X.fillStyle = col; X.fillText(txt, 0, 0); X.restore(); });
}

// A stiff robot march: straight-ish legs lifting in turn, arms swinging opposite, a mechanical bob.
function roboSafadiWalk(p, k = 1) {
  const ph = p * Math.PI, sw = Math.sin(ph), up = Math.max(0, sw), dn = Math.max(0, -sw);
  return {
    footL: [-1.3 + .9 * sw * k, -.9 - 2.4 * up * k], footR: [1.3 + .9 * sw * k, -.9 - 2.4 * dn * k],
    handL: [-4.4 - .3 * k, -8.6 - 1.6 * dn * k], handR: [4.4 + .3 * k, -8.6 - 1.6 * up * k], handPoseL: 'fist', handPoseR: 'fist',
    dy: .25 * k * Math.abs(Math.cos(ph)), tilt: .03 * k * sw, antenna: -.15 * k * sw,
  };
}

// Registration: the studio's character browser and model sheets read this.
CHARACTERS.robo_safadi = {
  draw: roboSafadi, unit: ROBO_SAFADI_UNIT, palette: RS, size: [15, 32],
  poses: {
    'rest': (x, y, s, t) => roboSafadi(x, y, s, { t }),
    'talk': (x, y, s, t) => roboSafadi(x, y, s, { t, mouth: lipFlap(t, frac(t * .5) < .7, 'smile'), brows: 'up', handR: [5.4, -12.8], handPoseR: 'palm', turn: .2 }),
    'activate': (x, y, s, t) => { const u = frac(t / 4), r = clamp((u - .2) / .15); return roboSafadi(x, y, s, { t, red: r, eyes: u < .2 ? 'off' : 'open', brows: r > .5 ? 'angry' : 'normal', mouth: r > .5 ? 'teeth' : 'flat', antenna: .1 * Math.sin(t * 30) * kick(u, .2, 6) * 4, jump: .4 * kick(u, .2, 8) * 4 }); },
    'eat your broccoli': (x, y, s, t) => roboSafadi(x, y, s, { t, red: 1, broccoli: 'R', handR: [5.6, -16.5 + .3 * Math.sin(t * 6)], handL: [-4.4, -15.6], handPoseL: 'point', brows: 'angry', mouth: lipFlap(t, frac(t * .4) < .6, 'flat', ['open', 'O', 'open', 'teeth']) }),
    'scan': (x, y, s, t) => roboSafadi(x, y, s, { t, red: 1, scan: 1, lookX: .6 * Math.sin(t * 2.2), lookY: .8, brows: 'angry', mouth: 'flat', handL: [-2.4, -11.4], handR: [2.4, -11.4], handPoseL: 'fist', handPoseR: 'fist' }),
    'march': (x, y, s, t) => roboSafadi(x, y, s, { t, ...roboSafadiWalk(t * 2.4), mouth: 'flat', brows: 'normal' }),
    'hover': (x, y, s, t) => roboSafadi(x, y, s, { t, hover: 1, handL: [-5.4, -12.6], handR: [5.4, -12.6], handPoseL: 'palm', handPoseR: 'palm', mouth: 'grin', eyes: 'happy' }),
    'malfunction': (x, y, s, t) => roboSafadi(x, y, s, { t, glitch: 1, steam: 1, eyes: frac(t * .7) < .5 ? 'x' : 'squint', mouth: 'frown', brows: 'worried', tilt: .12 * Math.sin(t * 9), antenna: .5 * Math.sin(t * 7), handL: [-4.8, -14], handR: [4.6, -6], handPoseL: 'claw', handPoseR: 'open', emote: 'oil', emoteK: 1 }),
    'happy beep': (x, y, s, t) => roboSafadi(x, y, s, { t, eyes: 'happy', mouth: 'grin', brows: 'up', jump: .8 * Math.abs(Math.sin(t * 4)), handL: [-5, -15], handR: [5, -15], handPoseL: 'palm', handPoseR: 'palm', emote: 'music', emoteK: 1 }),
    'confused': (x, y, s, t) => roboSafadi(x, y, s, { t, brows: 'quizzical', mouth: 'smirk', tilt: -.12, lookX: -.5, lookY: -.4, handR: [1.4, -16.2], handPoseR: 'claw', emote: '?', emoteK: 1 }),
    'wave': (x, y, s, t) => roboSafadi(x, y, s, { t, handR: [5.8 + .6 * Math.sin(t * 6), -19.5], handPoseR: 'palm', mouth: 'grin', eyes: 'happy', brows: 'up' }),
    'power down': (x, y, s, t) => { const u = clamp(frac(t / 4) * 1.6); return roboSafadi(x, y, s, { t, eyes: u > .7 ? 'off' : 'squint', mouth: u > .7 ? 'flat' : 'o', dy: 1.2 * ease(u), tilt: .18 * ease(u), lean: .1 * ease(u), antenna: .9 * ease(u), hum: u < .7, handL: [-3.6, -6 + 2 * ease(u)], handR: [3.6, -6 + 2 * ease(u)] }); },
  },
};
