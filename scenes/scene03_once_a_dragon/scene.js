// scenes/scene03_once_a_dragon: "Once a dragon, always a dragon…"  (17.5 s; synopsis, script, shot list: README.md)
// Outside Dove Creek Elementary. The camera opens on the Entrance framing and pushes in to Medium while Fester juggles and
// talks to us. Line done, he tosses the balls into his hat, gives a thumbs-up and winks as the iris closes.
(() => {
  const D = LOCATIONS.dces, U = JF_UNIT, JX = D.MARK.x, JZ = D.MARK.z;
  const J3 = { n: 3, tau: .34, h: 15, t0: -10 * .34 };
  const LINES = [
    [2.0, 'Once a *dragon*...', { hold: 1.1 }],
    [4.4, '...always a *dragon*!', { hold: 1.2 }],
    [7.1, 'But what is *more important*...', { hold: 1.2 }],
    [10.35, '...is telling you a story about *Big Baba Head* and *Alma*!', { hold: 1.4, maxW: 700 }],
  ];
  const FLING = 14.0, WINK = 15.3, IRIS = [16.4, 17.5];
  const LANDS = [0, 1, 2].map(i => FLING + .55 + i * .14);

  // ---------- helpers ----------
  // The set goes soft as the camera closes in (depth of field keeps Fester and the balls readable).
  const set = (P, t) => layer(() => D.back(P, t, { splitZ: JZ }), { blur: clamp((P.k(JZ) - 1.6) * 1.4, 0, 4.5) });
  const Jat = (P, o) => { const [sx, sy, k] = P.p(JX, 0, JZ), s = U * k; return { sx, sy, s, A: jester(sx, sy, s, o) }; };
  const loc = (j, lx, ly) => [j.sx + lx * j.s, j.sy + ly * j.s];
  const topBall = bs => bs.reduce((a, b) => (b.y < a.y ? b : a), bs[0]);
  function sparkles(cx, cy, age, n, rad, s, seed = 0) {
    if (age < 0 || age > .9) return;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + hash(i + seed) * .6, d = rad * easeOut(age / .9) * (.6 + .4 * hash(i * 3 + seed)), k = (1 - age / .9) * s;
      shape(starPts(cx + Math.cos(a) * d, cy + Math.sin(a) * d, k * (.5 + .5 * hash(i + 7 + seed)), .35, 4), { fill: [PAL.goldLt, '#FFFFFF', PAL.pink][i % 3], stroke: PAL.ink, lwPx: 1.5 });
    }
  }

  // ---------- camera ----------
  // One continuous move: hold on the DCES "Entrance" preset, push in to "Medium", drift, then ease in on the wink.
  // hy is solved so his feet sit at FEET (screen y) the whole way: hy = feetY - y * k.
  const CAM_Z = [[0, 1150], [1.4, 1150], [4.4, 1820], [14, 1840], [14.8, 1840], [17.5, 1965]];
  const FEET = [[0, 790], [1.4, 790], [4.4, 956], [14.8, 962], [17.5, 1040]];
  const cam = t => {
    const z = kf(t, CAM_Z), y = kf(t, [[0, 200], [1.4, 200], [4.4, 120], [17.5, 114]]), k = 1000 / (JZ - z);
    return { x: kf(t, [[0, 0], [4.4, 0], [9, -14], [14, 10], [17.5, 0]]), y, z, f: 1000, hy: kf(t, FEET) - y * k };
  };

  // =====================================================================================
  // 0–14 · Juggling and the four lines, while the camera pushes in.
  function talk(t) {
    const P = persp(cam(t));
    set(P, t);
    const c = cascade(t, J3), tb = topBall(c.balls), [sx, sy, k] = P.p(JX, 0, JZ), s = U * k;
    let talking = false, cur = -1;
    LINES.forEach(([t0, txt, o], i) => {
      const r = callout(txt, sx + 3.9 * s, sy - 16.6 * s, t - t0, { dx: 400, dy: -190, size: 62, maxW: 620, ...o });
      if (r.talking) talking = true; if (r.visible) cur = i;
    });
    const nod = kick(t, 4.75, 5) + kick(t, 5.3, 5);                                   // "…always a dragon!"
    const lean = ease(seg(t, 7.0, 7.4)) * (1 - ease(seg(t, 10.0, 10.4)));             // "But what is more important…"
    const j = Jat(P, {
      dy: .25 + .25 * Math.sin(c.s * Math.PI) ** 2 + .7 * nod, handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup',
      lookX: talking ? 0 : tb.x / 5, lookY: talking ? -.15 : -.85, eyes: 'open',
      brows: cur >= 2 || nod > .2 ? 'up' : 'normal', mouth: lipFlap(t, talking, cur === 3 ? 'grin' : 'smile'),
      lean: .08 * lean, tilt: .05 * wob(t, .4) - .05 * nod, sway: .4 * Math.sin(c.s * Math.PI), hatSway: [wob(t, 1.6) * .35, .4 * nod],
    });
    D.front(P, t, { splitZ: JZ });
    c.balls.forEach(b => { const [x, y] = loc(j, b.x, b.y); jugglerBall(x, y, BALL_R * j.s, b.col, b.rot); });
  }

  // 14–17.5 · Balls up and into the hat, thumbs-up, wink. Iris out.
  function wink(t) {
    const P = persp(cam(t));
    set(P, t);
    const c = cascade(FLING, J3), flick = seg(t, FLING, FLING + .14), pose = ease(seg(t, 14.95, 15.2)), watching = t < 14.95, winked = t >= WINK;
    const hL = mixPt(mixPt(c.handL, [-2.4, -15.5], easeOut(flick)), [-3.3, -8.4], pose);
    const hR = mixPt(mixPt(c.handR, [2.4, -15.5], easeOut(flick)), [3.6, -12.6], pose);
    const plop = LANDS.reduce((a, l) => a + kick(t, l, 9), 0);
    const j = Jat(P, {
      handL: hL, handR: hR, handPoseL: watching ? 'cup' : 'open', handPoseR: t > 15.05 ? 'thumb' : watching ? 'cup' : 'open',
      dy: .6 * kick(t, FLING, 6) + .3 * plop, sq: .08 * plop, lookY: watching ? -1 : 0, lookX: 0,
      eyes: winked ? 'wink' : t > 15.05 ? 'happy' : 'open', blink: 0, brows: watching || winked ? 'up' : 'normal',
      mouth: watching ? (t < LANDS[2] ? 'o' : 'grin') : 'grin',
      tilt: .07 * ease(seg(t, WINK, WINK + .3)), hatSway: [0, .8 * plop], hatAskew: .05 * boing(t, LANDS[2], 2.5, 4),
    });
    D.front(P, t, { splitZ: JZ });
    // the balls: from where they were at the flick, up in an arc and down into the hat, one after another
    const tip = j.A.hatTip;
    c.balls.forEach((b, i) => {
      if (t >= LANDS[i]) return;
      const f = seg(t, FLING + i * .04, LANDS[i]), [x0, y0] = loc(j, b.x, b.y), peak = j.s * (9 + 2.5 * i);
      const x = lerp(x0, tip[0], f), y = lerp(y0, tip[1] + j.s * .4, f) - peak * 4 * f * (1 - f), r = BALL_R * j.s * (1 - .45 * seg(f, .8, 1));
      jugglerBall(x, y, r, b.col, b.rot + t * 7);
    });
    sfx('plop!', tip[0] + j.s * 4.5, tip[1] - j.s * 1.5, 52, PAL.goldLt, t - LANDS[2], { life: .7, rot: .12 });
    // the wink: a glint by the closed eye and a "ting!"
    const eye = [j.A.head[0] + j.s * 1.3, j.A.head[1] - j.s * .3];
    sparkles(eye[0], eye[1], t - WINK, 6, j.s * 2.2, j.s * .55, 4);
    sfx('ting!', eye[0] + j.s * 6.5, eye[1] + j.s * .5, 54, PAL.goldLt, t - WINK, { life: .9, rot: .12 });
    iris(j.A.head[0], j.A.head[1] - j.s * 1.5, lerp(1500, 0, easeIn(seg(t, ...IRIS))));
  }

  scene({ duration: 17.5, fps: 24, bpm: 100,                  // id, title, audio: see asset.js
    shots: [[0, talk], [FLING, wink]] });
})();
