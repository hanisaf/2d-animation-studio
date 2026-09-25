// scenes/scene01_juggling: "I'm Jester Fester and this is the story of my life."  (30 s; synopsis, script, shot list: README.md)
// Fester tumbles into the throne room, juggles 3 then 5 balls while introducing himself, flings them into the
// chandelier… and they come back down on his head, one BONK at a time. The last one lands balanced on his hat. Iris out.
(() => {
  const R = LOCATIONS.throne_room, U = JF_UNIT, JX = R.MARK.x, JZ = R.MARK.z;
  const ROOM = { splitZ: JZ, chandKick: [21.25, .13] };
  const J3 = { n: 3, tau: .34, h: 17, t0: 7.5 }, J5 = { n: 5, tau: .26, h: 24, t0: 14 - 10 * .26 };
  const HITS = [23.35, 23.7, 24.05, 24.4], FALL = .5, LAST = { rel: 28.3, land: 28.75 };

  // ---------- helpers ----------
  // The set, painted into a layer that goes soft as the camera gets close (depth of field keeps Fester and the balls readable).
  const room = (P, t) => layer(() => R.back(P, t, ROOM), { blur: clamp((P.k(JZ) - 1.6) * 1.4, 0, 4.5), filter: P.k(JZ) > 2 ? 'saturate(.92)' : '' });
  const Jat = (P, o, x = JX, z = JZ) => { const [sx, sy, k] = P.p(x, 0, z), s = U * k; return { sx, sy, s, A: jester(sx, sy, s, o) }; };
  const loc = (j, lx, ly) => [j.sx + lx * j.s, j.sy + ly * j.s];
  const drawLocalBalls = (j, list) => list.forEach(b => { const [x, y] = loc(j, b.x, b.y); jugglerBall(x, y, BALL_R * j.s, b.col, b.rot); });
  const toWorld = (lx, ly) => [JX + lx * U, -ly * U, JZ];
  const topBall = bs => bs.reduce((a, b) => (b.y < a.y ? b : a), bs[0]);
  function sparkles(cx, cy, age, n, rad, s, seed = 0) {
    if (age < 0 || age > .9) return;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + hash(i + seed) * .6, d = rad * easeOut(age / .9) * (.6 + .4 * hash(i * 3 + seed)), k = (1 - age / .9) * s;
      shape(starPts(cx + Math.cos(a) * d, cy + Math.sin(a) * d, k * (.5 + .5 * hash(i + 7 + seed)), .35, 4), { fill: [PAL.goldLt, '#FFFFFF', PAL.pink][i % 3], stroke: PAL.ink, lwPx: 1.5 });
    }
  }

  // ---------- cameras ----------
  // A: one continuous move (0–14): wide establishing push down the carpet into a medium full shot.
  // hy is solved so his feet sit at a chosen screen height while the camera moves (feetY).
  const camA = t => {
    const z = kf(t, [[0, -250], [2.4, 60], [4.3, 430], [6.3, 720], [7.5, 820], [14, 950]]), y = kf(t, [[0, 170], [6, 125], [14, 110]]), k = 1000 / (JZ - z);
    return { x: kf(t, [[0, 0], [7.5, -10], [14, 14]]), y, z, f: 1000, hy: kf(t, [[0, 660], [4.3, 820], [7.5, 975], [14, 1025]]) - y * k };
  };
  // B: low heroic angle for the 5-ball cascade (feet kept near the bottom of frame).
  const camB = t => { const z = kf(t, [[14, 945], [20.5, 965]], x => x), k = 1000 / (JZ - z); return { x: kf(t, [[14, 25], [20.5, -25]], x => x), y: 70, z, f: 1000, hy: 1015 - 70 * k }; };
  // C: medium frontal for the fling + bonks; tilts up to the chandelier and back down.
  const TILT = 1600;
  const camC = t => ({ x: 0, y: 110, z: kf(t, [[20.5, 940], [26.4, 960]]), f: 1000, hy: 600 + TILT * kf(t, [[20.56, 0], [21.15, 1], [21.9, 1], [22.55, 0]]) });
  // D: the finish: slow push in on his face.
  const camD = t => ({ x: 0, y: 110, z: kf(t, [[26.4, 960], [30, 1010]]), f: 1000, hy: kf(t, [[26.4, 600], [30, 480]]) });

  // ---------- balls after the fling (20.5+), in WORLD coords: up into the chandelier, stuck, then down on his head ----------
  const flingStart = (() => { const c = cascade(20.5, J5); return c.balls.map(b => toWorld(b.x, b.y)); })();
  const arrive = i => 21.2 + i * .05;
  const headTop = [JX, 21.2 * U, JZ];
  function ballWorld(t, i) {
    if (t < arrive(i)) {                                                   // flying up to its chandelier slot
      const f = seg(t, 20.5, arrive(i)), a = flingStart[i], b = R.chandelierSlot(arrive(i), ROOM, i);
      return { p: [lerp(a[0], b[0], ease(f)), lerp(a[1], b[1], 1 - (1 - f) ** 2), lerp(a[2], b[2], f)], rot: f * 9 };
    }
    const rel = i < 4 ? HITS[i] - FALL : LAST.rel;
    if (t < rel) return { p: R.chandelierSlot(t, ROOM, i), rot: 0 };        // stuck in the chandelier
    if (i === 4) return null;                                              // the last ball is drawn against the hat (see finale)
    const hit = HITS[i];
    if (t < hit) {                                                         // falling onto his head
      const f = seg(t, rel, hit), a = R.chandelierSlot(rel, ROOM, i);
      return { p: [lerp(a[0], headTop[0] + (i % 2 ? 8 : -8), f), lerp(a[1], headTop[1], f * f), lerp(a[2], headTop[2] - 20, f)], rot: f * 4 };
    }
    const dt = t - hit, dir = i % 2 ? -1 : 1;                              // ricochet off, out of frame
    return { p: [headTop[0] + dir * (330 + 90 * i) * dt, headTop[1] + 420 * dt - 1500 * dt * dt, headTop[2] - 260 * dt], rot: dt * 14 * dir };
  }
  function drawWorldBalls(P, t, which = [0, 1, 2, 3, 4]) {
    const list = which.map(i => ({ i, b: ballWorld(t, i) })).filter(e => e.b && P.visible(e.b.p[2])).sort((a, b) => b.b.p[2] - a.b.p[2]);
    for (const { i, b } of list) { const [x, y, k] = P.p(...b.p); if (y > -200 && y < H + 200) jugglerBall(x, y, BALL_R * U * k, JUGGLE_COLS[i], b.rot); }
  }
  const bonkK = t => HITS.reduce((s, h) => s + kick(t, h, 7), 0);

  // =====================================================================================
  // 0–7.5 · Entrance: empty hall, Fester tumbles out from behind a column, lands, ta-da, pops three balls out of his hat.
  function entrance(t) {
    const P = persp(camA(t));
    room(P, t);
    const hops = [[2.4, 2.95, -720, -470, false], [2.95, 3.5, -470, -235, true], [3.5, 4.1, -235, 0, true]];
    const hop = hops.find(h => t >= h[0] && t < h[1]);
    let o, x = JX;
    if (t < 2.4) o = null;
    else if (hop) {
      const [a, b, x0, x1, flip] = hop, f = seg(t, a, b), tuck = flip ? Math.sin(Math.PI * f) : .4 * Math.sin(Math.PI * f);
      x = lerp(x0, x1, f);
      o = { jump: 7 * Math.sin(Math.PI * f), rot: flip ? TAU * ease(f) : .15 * Math.sin(Math.PI * f),
        footL: mixPt([-1.25, -.85], [-1.2, -5.2], tuck), footR: mixPt([1.25, -.85], [1.2, -5.2], tuck),
        handL: mixPt([-4.6, -15], [-2.2, -12], tuck), handR: mixPt([4.6, -15], [2.2, -12], tuck),
        eyes: flip ? 'squeeze' : 'happy', mouth: 'grin', hatSway: [-1.2, .4] };
    } else {
      // landed: squash, ta-da, then the hat trick
      const land = .3 * boing(t, 4.1, 2.2, 6);
      const hatT = seg(t, 5.2, 5.45), back = seg(t, 5.65, 6.05), c = cascade(t, J3);
      let hL = [-5.3, -15.4], hR = [5.3, -15.4];
      hL = mixPt(hL, [-2.9, -20.6], ease(hatT)); hR = mixPt(hR, [2.9, -20.6], ease(hatT));
      hL = mixPt(hL, c.handL, ease(back)); hR = mixPt(hR, c.handR, ease(back));
      const up = t > 5.1 && t < 6.35;
      o = { sq: land, dy: .5 * kick(t, 4.1, 5) + kf(t, [[7.1, 0], [7.35, .7], [7.5, 0]]), handL: hL, handR: hR,
        handPoseL: back > .5 ? 'cup' : 'open', handPoseR: back > .5 ? 'cup' : 'open',
        eyes: t < 5.1 ? 'happy' : 'open', mouth: t < 5.1 ? 'grin' : up ? 'o' : 'grin', lookY: up ? -1 : 0, lookX: up ? .1 : 0,
        hatLift: 2.4 * kf(t, [[5.45, 0], [5.58, 1], [5.9, 0]], easeOut), hatSway: [0, -.8 * kick(t, 5.5, 4)],
        emote: t > 4.3 && t < 5.2 ? 'music' : null, emoteK: seg(t, 4.3, 4.5) * (1 - seg(t, 5.0, 5.2)), brows: up ? 'up' : 'normal' };
    }
    let j = null;
    if (o) j = Jat(P, o, x);
    R.front(P, t, ROOM);
    if (!j) return;
    // ta-da sparkles, the POP and the three balls
    if (t > 4.1) { const [lx, ly] = loc(j, -5.3, -16.5), [rx, ry] = loc(j, 5.3, -16.5); sparkles(lx, ly, t - 4.2, 7, j.s * 4, j.s * .9, 1); sparkles(rx, ry, t - 4.25, 7, j.s * 4, j.s * .9, 5); }
    const c = cascade(t, J3), start = [0, -22.8], lands = [6.1, 6.25, 6.4];
    c.balls.forEach((b, i) => {
      const t0 = 5.52 + i * .06;
      if (t < t0) return;
      let p = [b.x, b.y];
      if (t < lands[i]) { const f = seg(t, t0, lands[i]); p = [lerp(start[0], b.x, f), lerp(start[1], b.y, f) - 9 * 4 * f * (1 - f)]; }
      const [x, y] = loc(j, ...p); jugglerBall(x, y, BALL_R * j.s, b.col, t * 6);
    });
    if (t > 5.52) { const [px, py] = loc(j, 0, -24); sfx('POP!', px + j.s * 5, py - j.s * 2, 70, PAL.goldLt, t - 5.52, { rot: .1 }); sparkles(px, py, t - 5.52, 8, j.s * 3, j.s * .7, 9); }
  }

  // 7.5–14 · Three-ball cascade. "I'm Jester Fester..." Then he flings them up and pops two more out of the hat.
  function juggle3(t) {
    const P = persp(camA(t));
    room(P, t);
    const FL = 13.0, c = cascade(Math.min(t, FL), J3), tb = topBall(c.balls);
    const phase = t < FL ? 0 : t < 13.25 ? 1 : t < 13.75 ? 2 : 3;          // juggle · fling · hat · ready
    let hL = c.handL, hR = c.handR;
    if (phase >= 1) { const f = seg(t, FL, FL + .12); hL = mixPt(c.handL, [-2.4, -14.5], easeOut(f)); hR = mixPt(c.handR, [2.4, -14.5], easeOut(f)); }
    if (phase >= 2) { const f = seg(t, 13.25, 13.45); hL = mixPt(hL, [-2.9, -20.6], ease(f)); hR = mixPt(hR, [2.9, -20.6], ease(f)); }
    if (phase >= 3) { const f = seg(t, 13.75, 13.95); hL = mixPt(hL, [-3.2, -10.6], ease(f)); hR = mixPt(hR, [3.2, -10.6], ease(f)); }
    const bob = t < FL ? .25 + .25 * Math.sin(c.s * Math.PI) ** 2 : 0;
    // talking + a wink to camera between the lines
    const wink = t > 12.05 && t < 12.6;
    const o = { dy: bob + kf(t, [[13.8, 0], [13.95, .6], [14, .6]]), handL: hL, handR: hR, handPoseL: 'cup', handPoseR: 'cup',
      lookX: t < FL ? tb.x / 4 : 0, lookY: wink ? 0 : -.85, eyes: wink ? 'wink' : 'open', brows: wink ? 'up' : 'normal',
      hatSway: [wob(t, 1.6) * .35, 0], hatLift: 2 * kf(t, [[13.45, 0], [13.55, 1], [13.8, 0]], easeOut), sway: .4 * Math.sin(c.s * Math.PI) };
    // first draw to find the mouth, then decide the mouth shape from the callout
    [sx, sy, k] = P.p(JX, 0, JZ), s = U * k;
    const said = callout("I'm *Jester Fester*...", sx + 3.9 * s, sy - 16.6 * s, t - 8.2, { dx: 420, dy: -170, size: 64, hold: 2.2 });
    o.mouth = t >= FL ? (phase === 1 ? 'grin' : 'o') : lipFlap(t, said.talking, 'grin');
    if (phase >= 2) { o.lookY = -1; o.eyes = 'open'; }
    const j = Jat(P, o);
    R.front(P, t, ROOM);
    // balls: juggled, then flung straight up and out of frame
    c.balls.forEach(b => {
      let p = [b.x, b.y];
      if (t >= FL) { const dt = t - FL; p = [b.x * (1 - dt), b.y - 60 * dt - 40 * dt * dt]; }
      const [x, y] = loc(j, ...p); jugglerBall(x, y, BALL_R * j.s, b.col, b.rot + (t >= FL ? t * 8 : 0));
    });
    // two more from the hat
    if (t > 13.5) [3, 4].forEach((i, n) => { const dt = t - 13.5 - n * .07; if (dt < 0) return; const [x, y] = loc(j, (n ? 1 : -1) * dt * 5, -23 - 50 * dt); jugglerBall(x, y, BALL_R * j.s, JUGGLE_COLS[i], t * 7); });
    if (t > 13.5) { const [px, py] = loc(j, 0, -24); sfx('POP!', px - j.s * 5, py, 64, PAL.goldLt, t - 13.5, { rot: -.1 }); }
    if (t > FL) { const [px, py] = loc(j, 0, -26); sfx('WHOOSH!', px + j.s * 6, py + j.s * 2, 64, PAL.sky, t - FL, { life: .6 }); }
  }

  // 14–20.5 · Low angle, five balls. "...and this is the story of my life!"
  function juggle5(t) {
    const P = persp(camB(t));
    room(P, t);
    const c = cascade(t, J5), tb = topBall(c.balls), [sx, sy, k] = P.p(JX, 0, JZ), s = U * k;
    const said = callout('...and this is *the story of my life!*', sx + 3.9 * s, sy - 16.6 * s, t - 14.45, { dx: 430, dy: -200, size: 64, maxW: 640, hold: 2.0 });
    const wink = t > 19.35 && t < 20.05;
    const j = Jat(P, { dy: .25 + .25 * Math.sin(c.s * Math.PI) ** 2, handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup',
      lookX: wink ? 0 : tb.x / 5, lookY: wink ? 0 : -.9, eyes: wink ? 'wink' : 'open', brows: wink || said.talking ? 'up' : 'normal',
      mouth: lipFlap(t, said.talking, 'grin'), hatSway: [wob(t, 2) * .4, 0], sway: .4 * Math.sin(c.s * Math.PI), tilt: .05 * wob(t, .4) });
    R.front(P, t, ROOM);
    drawLocalBalls(j, c.balls);
  }

  // 20.5–23.3 · The big fling. Camera tilts up with the balls, they lodge in the chandelier (ding!), tilts back down to a
  // very pleased jester still holding his ta-da… who slowly looks up.
  function fling(t) {
    const P = persp(camC(t));
    room(P, t);
    const f = seg(t, 20.5, 20.62), c = cascade(20.5, J5), look = t > 22.75;
    const hL = mixPt(mixPt(c.handL, [-2.4, -15], easeOut(f)), [-5.3, -15.4], ease(seg(t, 20.62, 20.9)));
    const hR = mixPt(mixPt(c.handR, [2.4, -15], easeOut(f)), [5.3, -15.4], ease(seg(t, 20.62, 20.9)));
    const opened = t > 22.6;
    Jat(P, { handL: hL, handR: hR, dy: kf(t, [[20.5, .6], [20.6, -.4], [20.9, .2]]), eyes: opened ? 'open' : 'happy', mouth: look ? 'o' : 'grin',
      lookY: look ? -1 : 0, brows: look ? 'worried' : 'up', tilt: opened ? 0 : -.08, emote: look ? '?' : null, emoteK: seg(t, 22.85, 23.05), hatSway: [0, .6 * kick(t, 20.55, 4)] });
    R.front(P, t, ROOM);
    drawWorldBalls(P, t);
    [0, 2, 4].forEach((i, n) => { const [x, y] = P.p(...R.chandelierSlot(arrive(i), ROOM, i)); sfx(n === 1 ? 'DING!' : 'ding!', x + (n - 1) * 170, y - 110 - n * 20, n === 1 ? 70 : 48, PAL.goldLt, t - arrive(i), { life: .8, rot: (n - 1) * .15 }); });
  }

  // 23.3–26.4 · BONK ×4, then dizzy.
  function bonks(t) {
    const P = persp(camC(t)), [dx, dy] = shakeXY(t, 16 * HITS.reduce((s, h) => s + kick(t, h, 10), 0));
    camBegin(W / 2 - dx, H / 2 - dy, 1, 0);
    room(P, t);
    const n = HITS.filter(h => t >= h).length, bk = bonkK(t), sinceLast = n ? t - HITS[n - 1] : 1;
    const dizzy = t > 24.45, wob1 = dizzy ? Math.sin(t * 5.2) : 0;
    const flinch = n > 0 && !dizzy;
    const o = { sq: .28 * bk, dy: .9 * bk + (dizzy ? .7 : 0), lean: .14 * wob1, tilt: .16 * wob1 + (dizzy ? .06 * Math.sin(t * 3.1) : 0),
      hatAskew: .38 * seg(t, HITS[2], HITS[2] + .12), hatSway: [.8 * wob1, .5 * bk],
      handL: flinch ? [-3.3, -17.5] : dizzy ? [-3.3 + .5 * wob1, -8.3] : [-5.3, -15.4], handR: flinch ? [3.3, -17.5] : dizzy ? [3.4 + .5 * wob1, -8.2] : [5.3, -15.4],
      handPoseL: flinch ? 'fist' : 'open', handPoseR: flinch ? 'fist' : 'open',
      eyes: dizzy ? 'swirl' : sinceLast < .14 ? 'squeeze' : 'wide', lookY: -1, brows: dizzy ? 'normal' : 'worried',
      mouth: dizzy ? 'wobble' : n >= 2 ? 'teeth' : 'O', stars: dizzy ? ease(seg(t, 24.45, 24.8)) : 0 };
    const j = Jat(P, o);
    R.front(P, t, ROOM);
    drawWorldBalls(P, t);
    HITS.forEach((h, i) => { const [x, y] = loc(j, (i % 2 ? -1 : 1) * 6.5, -24 - i * .8); sfx('BONK!', x, y, 84 + i * 16, [PAL.goldLt, '#FF9A6B', PAL.pink, '#FFD34D'][i], t - h, { rot: (i % 2 ? -1 : 1) * .12, life: .75 }); });
    camEnd();
  }

  // 26.4–30 · Recovery, fix the hat, a sheepish shrug… the last ball drops and balances on his hat. Wink. Iris out.
  function finale(t) {
    const P = persp(camD(t));
    room(P, t);
    const shake = seg(t, 26.4, 27.1), fixHat = seg(t, 27.1, 27.6), shrug = seg(t, 27.6, 27.85), landed = t >= LAST.land, proud = t > 29.0;
    const shakeTurn = t < 27.1 ? .7 * Math.sin(t * TAU * 5) * (1 - shake) : 0;
    let hL = [-3.3, -8.3], hR = [3.4, -8.2];
    if (t > 27.1) { hL = mixPt(hL, [-2.9, -20.8], ease(seg(t, 27.1, 27.3))); hR = mixPt(hR, [2.9, -20.8], ease(seg(t, 27.1, 27.3))); }
    if (t > 27.6) { hL = mixPt(hL, [-4.4, -13.4], ease(shrug)); hR = mixPt(hR, [4.4, -13.4], ease(shrug)); }
    if (proud) { hR = mixPt(hR, [3.7, -12.8], ease(seg(t, 29.0, 29.2))); hL = mixPt(hL, [-3.3, -8.4], ease(seg(t, 29.0, 29.2))); }
    const o = {
      turn: shakeTurn, stars: 1 - ease(seg(t, 26.4, 26.9)),
      eyes: t < 27.1 ? 'squeeze' : proud ? (t > 29.25 ? 'wink' : 'happy') : landed ? 'wide' : 'open',
      lookX: 0, lookY: landed && !proud ? -1 : 0,
      brows: t > 27.6 && !landed ? 'worried' : landed ? 'up' : 'normal',
      mouth: t < 27.1 ? 'wobble' : t < 27.6 ? 'flat' : !landed ? 'smirk' : proud ? 'grin' : 'o',
      hatAskew: .38 * (1 - ease(seg(t, 27.2, 27.55))), hatSway: [0, landed ? .7 + .6 * boing(t, LAST.land, 2.5, 4) : 0],
      handL: hL, handR: hR, handPoseR: proud ? 'thumb' : 'open', tilt: t > 27.6 && !landed ? .13 * ease(shrug) : 0,
      dy: t > 27.6 && t < 28.6 ? -.25 * ease(shrug) : landed ? .5 * kick(t, LAST.land, 6) : .5, lean: t < 27.1 ? .1 * Math.sin(t * 5.2) * (1 - shake) : 0,
    };
    const j = Jat(P, o);
    R.front(P, t, ROOM);
    // the last ball: still in the chandelier (off-screen above), then drops onto the middle hat tip and wobbles there
    if (t >= LAST.rel) {
      const tip = j.A.hatTip, r = BALL_R * j.s;
      let x = tip[0], y = tip[1] - r * .75 + wob(t, 1.3) * r * .05;
      if (!landed) { const f = seg(t, LAST.rel, LAST.land); y = lerp(-r * 2, y, f * f); x = lerp(tip[0] - 20, tip[0], f); }
      jugglerBall(x, y, r, JUGGLE_COLS[4], landed ? .15 * boing(t, LAST.land, 2.5, 4) : t * 5);
      if (landed) sfx('plip!', x + r * 2.6, y - r * .8, 54, PAL.goldLt, t - LAST.land, { life: .7, rot: .12 });
      if (t > 29.1) sparkles(x, y, t - 29.1, 6, r * 3.2, r * .45, 3);
    }
    iris(j.A.head[0], j.A.head[1] - j.s * 2, lerp(1500, 0, easeIn(seg(t, 29.3, 30))));
  }

  scene({
    duration: 30, fps: 24, bpm: 100,                                          // id, title, audio: see asset.js
    shots: [[0, entrance], [7.5, juggle3], [14, juggle5], [20.5, fling], [23.3, bonks], [26.4, finale]],
  });
})();
