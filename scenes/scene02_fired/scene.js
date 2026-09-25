// scenes/scene02_fired: Princess Pearl is bored by Fester's chicken joke… and fires him.  (37 s; synopsis, script, shot list: README.md)
// Shot / reverse-shot between Fester on the carpet and Pearl on the throne. Fester looks screen-right toward her;
// she faces screen-left toward him (until she turns her nose up and away).
(() => {
  const R = LOCATIONS.throne_room, U = JF_UNIT;
  const FX = -200, FZ = 1880;                                   // Fester's mark, in front of the dais
  const PZ = R.BACK - 125, SEAT_Y = 258;                         // Pearl on the throne cushion
  const ROOM = { splitZ: FZ };
  const J3 = { n: 3, tau: .34, h: 15, t0: 21.6 };

  // ---------- helpers ----------
  const Fest = (P, o) => { const [sx, sy, k] = P.p(FX, 0, FZ), s = U * k; return { sx, sy, s, A: jester(sx, sy, s, o) }; };
  const loc = (j, lx, ly) => [j.sx + lx * j.s, j.sy + ly * j.s];
  const pearlOn = (P, t, o = {}) => { const [x, y, k] = P.p(0, SEAT_Y, PZ); return pearl(x, y, PP_UNIT * k, { sit: 1, flip: true, wag: .22 * wob(t, .45), ...o }); };
  // the set (+ Pearl when she is only background) in a softened layer
  const room = (P, t, blur, extra) => layer(() => { R.back(P, t, ROOM); if (extra) extra(); }, { blur, filter: blur > 1 ? 'saturate(.93)' : '' });
  function sparkles(cx, cy, age, n, rad, s, seed = 0) {
    if (age < 0 || age > .9) return;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + hash(i + seed) * .6, d = rad * easeOut(age / .9) * (.6 + .4 * hash(i * 3 + seed)), k = (1 - age / .9) * s;
      shape(starPts(cx + Math.cos(a) * d, cy + Math.sin(a) * d, k * (.5 + .5 * hash(i + 7 + seed)), .35, 4), { fill: [PAL.goldLt, '#FFFFFF', PAL.pink][i % 3], stroke: PAL.ink, lwPx: 1.5 });
    }
  }
  // a ball dropped from local height y0 at t0: falls, bounces twice, then rolls (jester local units)
  function dropY(y0, dt) {
    const g = 160, floor = -BALL_R; let y = y0, v = 0, tt = dt, e = .45;
    for (let b = 0; b < 4; b++) {
      const tHit = (-v + Math.sqrt(v * v + 2 * g * (floor - y))) / g;
      if (tt < tHit) return y + v * tt + .5 * g * tt * tt;
      tt -= tHit; v = -(v + g * tHit) * e; y = floor;
    }
    return floor;
  }

  // ---------- cameras ----------
  const camWide = t => { const z = kf(t, [[0, 1050], [4.6, 1300]]), y = 170, k = 1000 / (FZ - z); return { x: kf(t, [[0, -30], [4.6, -90]]), y, z, f: 1000, hy: kf(t, [[0, 860], [4.6, 905]]) - y * k }; };
  // Fester medium shot (Pearl soft in the background, upper right). push = how far the camera creeps in during the shot;
  // feet = screen y of his feet (1150: knees-up framing that keeps Pearl in view; ~1015 when the floor matters).
  const camF = (t, t0, t1, push = 40, x0 = -150, feet = 1150) => { const z = 1615 + push * ease(seg(t, t0, t1)), y = 130, k = 1000 / (FZ - z); return { x: x0 + 10 * wob(t, .1), y, z, f: 1000, hy: feet - y * k }; };
  // Pearl close-up, from just past Fester's position.
  const camP = (t, t0, t1, push = 40, extra = 0) => { const z = 1985 + push * ease(seg(t, t0, t1)) + extra, y = 330, k = 1000 / (PZ - z); return { x: -60, y, z, f: 1000, hy: 575 + 20 * k }; };

  // =====================================================================================
  // 0–4.6 · Wide: bored Pearl on the throne. Fester hops in, somersaults, lands, ta-da.
  function establish(t) {
    const P = persp(camWide(t));
    room(P, t, 0);
    pearlOn(P, t, { eyes: 'bored', brows: 'flat', mouth: 'flat', lookX: t > 3 ? .6 : 0 });
    const hops = [[1.1, 1.6, -650, -500, false], [1.6, 2.1, -500, -350, false], [2.1, 2.75, -350, FX, true]], hop = hops.find(h => t >= h[0] && t < h[1]);
    let o = null, x = FX;
    if (hop) {
      const [a, b, x0, x1, flip] = hop, f = seg(t, a, b), tuck = flip ? Math.sin(Math.PI * f) : .3 * Math.sin(Math.PI * f);
      x = lerp(x0, x1, f);
      o = { jump: (flip ? 8 : 4) * Math.sin(Math.PI * f), rot: flip ? TAU * ease(f) : .12 * Math.sin(Math.PI * f), footL: mixPt([-1.25, -.85], [-1.2, -5.2], tuck), footR: mixPt([1.25, -.85], [1.2, -5.2], tuck),
        handL: mixPt([-4.6, -15], [-2.2, -12], tuck), handR: mixPt([4.6, -15], [2.2, -12], tuck), eyes: 'happy', mouth: 'grin', hatSway: [-1, .4] };
    } else if (t >= 2.75) {
      o = { sq: .3 * boing(t, 2.75, 2.2, 6), dy: .5 * kick(t, 2.75, 5), handL: [-5.3, -15.4], handR: [5.3, -15.4], eyes: 'happy', mouth: 'grin', turn: .2,
        emote: 'music', emoteK: seg(t, 3.0, 3.2) };
    }
    if (o) { const [sx, sy, k] = P.p(x, 0, FZ), j = { sx, sy, s: U * k }; j.A = jester(sx, sy, j.s, o);
      if (t > 2.8) { const [lx, ly] = loc(j, -5.3, -16.5), [rx, ry] = loc(j, 5.3, -16.5); sparkles(lx, ly, t - 2.85, 7, j.s * 4, j.s * .9, 1); sparkles(rx, ry, t - 2.9, 7, j.s * 4, j.s * .9, 5); } }
    R.front(P, t, ROOM);
  }

  // 4.6–9.6 · Fester, jazz hands: the joke.
  function joke(t) {
    const P = persp(camF(t, 4.6, 9.6));
    room(P, t, 2.6, () => pearlOn(P, t, { eyes: 'bored', brows: 'flat', mouth: 'flat' }));
    const [sx, sy, k] = P.p(FX, 0, FZ), s = U * k;
    const said = callout('Your Highness! Why did the *chicken* cross the road?', sx + 3.9 * s, sy - 16.6 * s, t - 5.0, { dx: 440, dy: -210, size: 58, maxW: 600, cps: 20, hold: 1.6 });
    const jz = wob(t, 3) * .25;                                       // jazz-hand wiggle
    Fest(P, { handL: [-4.8 + jz, -13.4], handR: [4.8 - jz, -13.4], dy: .25 * pulse(t, 5), turn: .3, lookX: .6, lookY: -.25, brows: 'up',
      mouth: lipFlap(t, said.talking, 'grin'), hatSway: [wob(t, 1.5) * .4, 0], sway: .3 * wob(t, 1.5) });
    R.front(P, t, ROOM);
  }

  // 9.6–12.6 · Pearl, deadpan: "...why?"
  function why(t) {
    const P = persp(camP(t, 9.6, 12.6));
    room(P, t, 1.8);
    const po = { eyes: 'bored', brows: 'flat', mouth: 'flat', blink: kf(t, [[10.0, 0], [10.25, 1], [10.55, 1], [10.8, 0]]) };
    const A0 = measure(() => pearlOn(P, t, po));
    const said = callout('...why?', A0.mouth[0] - 40, A0.mouth[1] - 10, t - 10.9, { dx: -300, dy: -170, size: 56, cps: 6, hold: .5 });
    pearlOn(P, t, { ...po, mouth: lipFlap(t, said.talking, 'flat', ['o', 'flat', 'o']) });
    R.front(P, t, ROOM);
  }

  // 12.6–16.6 · The punchline, and Fester cracks himself up.
  function punchline(t) {
    const P = persp(camF(t, 12.6, 16.6, 60));
    room(P, t, 2.6, () => pearlOn(P, t, { eyes: 'bored', brows: 'flat', mouth: 'flat' }));
    const [sx, sy, k] = P.p(FX, 0, FZ), s = U * k;
    const said = callout('To get to the *other side!*', sx + 3.9 * s, sy - 16.6 * s, t - 12.8, { dx: 420, dy: -210, size: 62, cps: 20, hold: 1.1 });
    const laugh = t > 14.5, shake = laugh ? Math.abs(Math.sin((t - 14.5) * 15)) : 0;
    Fest(P, laugh
      ? { handL: [-1.9, -10.6], handR: [1.9, -10.6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'squeeze', mouth: shake > .5 ? 'grin' : 'open', dy: .5 * shake, lean: -.06, tilt: -.1 + .05 * shake,
          hatSway: [.6 * Math.sin(t * 15), .3], sway: .5 * Math.sin(t * 15) }
      : { handL: [-5.2, -15.6], handR: [5.2, -15.6], eyes: said.talking ? 'open' : 'happy', turn: .3, lookX: .6, brows: 'up', mouth: lipFlap(t, said.talking, 'grin'), dy: -.2 });
    R.front(P, t, ROOM);
    [14.6, 15.05, 15.5].forEach((h, i) => { const [x, y] = [sx + (i % 2 ? -1 : 1) * 7 * s, sy - (20 + i * 1.5) * s]; sfx('HA!', x, y, 70 + i * 10, PAL.goldLt, t - h, { rot: (i % 2 ? -1 : 1) * .15, life: .7 }); });
  }

  // 16.6–19.6 · Pearl: crickets. She rolls her eyes.
  function crickets(t) {
    const P = persp(camP(t, 16.6, 19.6, 30));
    room(P, t, 1.8);
    const roll = t > 18.2 && t < 19.3;
    pearlOn(P, t, { eyes: 'bored', brows: roll ? 'up' : 'flat', mouth: roll ? 'frown' : 'flat', lookY: roll ? -1 : 0, lookX: roll ? .8 : 0, wag: .22 * wob(t, .45) + .5 * boing(t, 18.6, 1.6, 3) });
    [[16.9, 380, 870], [17.8, 560, 930], [18.8, 300, 900]].forEach(([h, x, y], i) => sfx('chirp...', x + (t - h) * 40, y - (t - h) * 30, 44, '#B9CFA6', t - h, { life: 1.3, rot: -.05 + i * .05 }));
    R.front(P, t, ROOM);
  }

  // 19.6–24.2 · Awkward. "W-wait! I can juggle!" POP, three balls, a hopeful cascade.
  function juggle(t) {
    const P = persp(camF(t, 19.6, 24.2, 50));
    room(P, t, 2.6, () => pearlOn(P, t, { eyes: 'bored', brows: 'flat', mouth: 'flat', lookY: t > 22 ? -.6 : 0 }));
    const [sx, sy, k] = P.p(FX, 0, FZ), s = U * k;
    const said = callout('W-wait! I can *juggle!*', sx + 3.9 * s, sy - 16.6 * s, t - 20.2, { dx: 420, dy: -210, size: 62, cps: 20, hold: .9 });
    const c = cascade(t, J3), toHat = ease(seg(t, 20.4, 20.7)), back = ease(seg(t, 20.95, 21.35));
    let hL = mixPt([-3.3, -8.4], [-2.9, -20.6], toHat), hR = mixPt([3.4, -8.3], [2.9, -20.6], toHat);
    hL = mixPt(hL, c.handL, back); hR = mixPt(hR, c.handR, back);
    const juggling = t > 21.2, tb = c.balls.reduce((a, b) => (b.y < a.y ? b : a));
    const j = Fest(P, { handL: hL, handR: hR, handPoseL: back > .5 ? 'cup' : 'open', handPoseR: back > .5 ? 'cup' : 'open',
      eyes: 'open', brows: 'worried', mouth: said.talking ? lipFlap(t, true, 'teeth', ['teeth', 'open', 'grin']) : t < 20.2 ? 'teeth' : 'grin',
      lookX: juggling ? tb.x / 4 : .5, lookY: juggling ? -.8 : -.2, turn: juggling ? 0 : .25,
      emote: t < 21 ? 'sweat' : null, emoteK: seg(t, 19.7, 19.95), hatLift: 2.2 * kf(t, [[20.7, 0], [20.82, 1], [21.1, 0]], easeOut),
      dy: juggling ? .2 + .2 * Math.sin(c.s * Math.PI) ** 2 : 0 });
    R.front(P, t, ROOM);
    const lands = [21.25, 21.35, 21.45];
    c.balls.forEach((b, i) => {
      const t0 = 20.8 + i * .05; if (t < t0) return;
      let p = [b.x, b.y];
      if (t < lands[i]) { const f = seg(t, t0, lands[i]); p = [lerp(0, b.x, f), lerp(-22.8, b.y, f) - 8 * 4 * f * (1 - f)]; }
      const [x, y] = loc(j, ...p); jugglerBall(x, y, BALL_R * j.s, b.col, b.rot + t * 3);
    });
    if (t > 20.8) { const [px, py] = loc(j, 0, -24); sfx('POP!', px - j.s * 5, py, 64, PAL.goldLt, t - 20.8, { rot: -.1 }); }
  }

  // 24.2–27.4 · Pearl yawns… then: "Fester... you're FIRED!"
  function fired(t) {
    const FIRE = 26.3;
    const P = persp(camP(t, 24.2, 27.4, 20, 80 * easeOut(seg(t, FIRE - .15, FIRE + .1))));
    const [dx, dy] = shakeXY(t, 18 * kick(t, FIRE, 5));
    camBegin(W / 2 - dx, H / 2 - dy, 1, 0);
    room(P, t, 1.8);
    const yawn = t < 25.15, angry = t > 25.25, point = ease(seg(t, 25.35, 25.6));
    const probe = measure(() => pearlOn(P, t, { eyes: 'closed', mouth: 'flat' }));
    const said = callout('Fester... you\'re *FIRED!*', probe.mouth[0] - 60, probe.mouth[1] - 20, t - 25.45, { dx: -380, dy: -200, size: 70, cps: 18, hold: .45, kind: 'shout', accent: '#D0243F' });
    pearlOn(P, t, yawn
      ? { eyes: 'closed', brows: 'up', mouth: t > 24.35 ? 'yawn' : 'flat', headTilt: .3 * Math.sin(Math.PI * seg(t, 24.3, 25.15)), flipNear: -1.1 * Math.sin(Math.PI * seg(t, 24.3, 25.15)), flipFar: -.8 * Math.sin(Math.PI * seg(t, 24.3, 25.15)) }
      : { eyes: angry ? 'angry' : 'bored', brows: angry ? 'angry' : 'flat', mouth: lipFlap(t, said.talking, 'frown', ['open', 'o', 'open', 'flat']), point, pointAng: -.2,
          crownLift: .8 * kick(t, FIRE, 6), sq: -.08 * kick(t, FIRE, 6), headTilt: .08 });
    R.front(P, t, ROOM);
    camEnd();
  }

  // 27.4–30.4 · Fester frozen mid-juggle; the balls rain down around him and the hat wilts.
  function shock(t) {
    const P = persp(camF(t, 27.4, 30.4, 70, -170, 1020));
    room(P, t, 2.6, () => pearlOn(P, t, { eyes: 'angry', brows: 'angry', mouth: 'flat', point: 1 - ease(seg(t, 28.2, 28.8)), pointAng: -.2 }));
    const c = cascade(27.4, J3), sad = ease(seg(t, 28.9, 29.4));
    const j = Fest(P, { handL: mixPt(c.handL, [-3.2, -8.2], sad), handR: mixPt(c.handR, [3.3, -8.1], sad), handPoseL: 'cup', handPoseR: 'cup',
      eyes: 'wide', mouth: sad > .5 ? 'frown' : 'O', brows: sad > .5 ? 'worried' : 'up', lookY: sad > .5 ? .6 : 0, lookX: sad > .5 ? 0 : .5, turn: .25 * (1 - sad),
      hatLift: 1.6 * kick(t, 27.45, 7), hatDroop: ease(seg(t, 28.5, 29.3)), dy: .5 * sad, emote: t < 28.6 ? '!' : 'sweat', emoteK: t < 28.6 ? seg(t, 27.45, 27.6) : seg(t, 28.9, 29.1) });
    R.front(P, t, ROOM);
    c.balls.forEach((b, i) => {
      const dt = t - 27.45, dir = [-1, 1, -1][i], x = b.x + dir * (1.2 + .6 * i) * Math.max(0, dt) * (dt > .6 ? .7 : 1);
      const y = dt < 0 ? b.y : dropY(b.y, dt);
      const [px, py] = loc(j, x, y); jugglerBall(px, py, BALL_R * j.s, b.col, dir * dt * 6);
      const hitT = 27.45 + Math.sqrt(2 * (-BALL_R - b.y) / 160);
      const [hx, hy] = loc(j, x, 0); sfx(['thud', 'bonk', 'boing'][i], hx, hy - j.s * 3, 36, PAL.goldLt, t - hitT, { life: .55 });
    });
  }

  // 30.4–33.8 · Pearl turns her nose up and away: "Somebody find me another jester!"
  function another(t) {
    const P = persp(camP(t, 30.4, 33.8, 40));
    room(P, t, 1.8);
    const turn = lerp(1, -1, ease(seg(t, 30.5, 30.8)));                  // flip to face screen-right, away from him
    const probe = measure(() => pearlOn(P, t, { turn, eyes: 'closed', mouth: 'smirk', headTilt: .45 * ease(seg(t, 30.6, 31.0)) }));
    const said = callout('Somebody find me *another jester!*', probe.mouth[0] + 40, probe.mouth[1] - 20, t - 30.95, { dx: 300, dy: -230, size: 58, maxW: 560, cps: 20, hold: .9 });
    pearlOn(P, t, { turn, eyes: t < 30.5 ? 'angry' : 'closed', brows: 'up', mouth: lipFlap(t, said.talking, 'smirk', ['open', 'o', 'smirk']),
      headTilt: .45 * ease(seg(t, 30.6, 31.0)), wag: .5 * boing(t, 30.7, 1.4, 3) + .2 * wob(t, .45), crownTilt: .05 * wob(t, .5) });
    R.front(P, t, ROOM);
  }

  // 33.8–37 · Fester, alone and wilted. A ball rolls in and taps his shoe. "...story of my life." Iris out.
  function alone(t) {
    const P = persp(camF(t, 33.8, 37, 120, -190, 1030));
    room(P, t, 2.8, () => pearlOn(P, t, { turn: -1, eyes: 'closed', brows: 'up', mouth: 'smirk', headTilt: .45 }));
    const tap = 34.9, shrug = ease(seg(t, 35.5, 35.9));
    const j = Fest(P, { hatDroop: 1, dy: .45 - .25 * shrug, mouth: t > 35.5 ? 'smirk' : 'frown', brows: 'worried',
      eyes: 'open', lookY: t > 34.7 && t < 35.4 ? .9 : shrug > .5 ? 0 : .6, lookX: t > 34.7 && t < 35.4 ? .6 : 0,
      handL: mixPt([-3.1, -8.1], [-4.2, -12.8], shrug), handR: mixPt([3.2, -8.0], [4.2, -12.8], shrug), tilt: .12 * shrug,
      blink: kf(t, [[34.2, 0], [34.35, 1], [34.55, 1], [34.7, 0]]) });
    R.front(P, t, ROOM);
    // the ball rolls in from the right and stops against his shoe
    const f = easeOut(seg(t, 34.0, tap)), bx = lerp(12, 3.4, f) + .25 * boing(t, tap, 3, 6), [x, y] = loc(j, bx, -BALL_R);
    jugglerBall(x, y, BALL_R * j.s, JUGGLE_COLS[0], -(12 - bx) * 1.2);
    sfx('tap', x + j.s, y - j.s * 2.2, 34, PAL.goldLt, t - tap, { life: .5 });
    callout('...story of my life.', j.A.head[0] + j.s * 3.8, j.A.head[1] - j.s * 2, t - 35.3, { kind: 'think', dx: 400, dy: -150, size: 52, cps: 16, hold: 2 });
    iris(j.A.head[0], j.A.head[1] - j.s * 2, lerp(1500, 0, easeIn(seg(t, 36.25, 37))));
  }

  scene({
    duration: 37, fps: 24, bpm: 100,                                          // id, title, audio: see asset.js
    shots: [[0, establish], [4.6, joke], [9.6, why], [12.6, punchline], [16.6, crickets], [19.6, juggle], [24.2, fired], [27.4, shock], [30.4, another], [33.8, alone]],
  });
})();
