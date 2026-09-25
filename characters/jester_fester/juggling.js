// characters/jester_fester/juggling.js: Fester's juggling skill: the cascade pattern and the balls.
//
// cascade(t, o) → { handL, handR, balls: [{ x, y, col, rot, held }], s }
//   Positions are in JESTER LOCAL UNITS (same space as jester()'s handL/handR), so feed handL/handR straight into the rig
//   and draw balls with jugglerBall(...) after converting (sx + x * s, sy + y * s).
//   o: { n: balls (odd; 3 or 5) · tau: seconds between throws · h: peak height above the throw point (units)
//        t0: time of the first throw (before it the hands hold the balls: right hand holds balls 0 and 2, left holds 1)
//        inner / outer: throw / catch x (units from centre) · y / catchY: throw / catch heights · cols: ball colours }
// Throws alternate right, left, right…; every ball crosses to the other hand. Each hand throws every 2·tau and holds a
// ball for tau. The hand paths are the same functions the balls use while held, so balls never slip out of the hands.

const JUGGLE_COLS = ['#3F5FC4', '#4FAA4F', '#EF8B2C', '#C73B5C', '#F0BE3C'];
const BALL_R = .85;

function cascade(t, o = {}) {
  const n = o.n ?? 3, tau = o.tau ?? .32, h = o.h ?? 11, s = (t - (o.t0 ?? 0)) / tau;
  const xi = o.inner ?? 1.0, xo = o.outer ?? 3.4, yT = o.y ?? -10.3, yC = o.catchY ?? -10.9, cols = o.cols ?? JUGGLE_COLS;
  // hand path: sd = +1 right / -1 left. Right throws at even s, left at odd s. Empty: throw point → catch point (small lift).
  // Holding: catch point → throw point with a scoop down.
  const hand = (sd, ss) => {
    ss = Math.max(ss, 0) - (sd > 0 ? 0 : 1); const p = ((ss % 2) + 2) % 2;
    if (p < 1) { const q = ease(p); return [sd * lerp(xi, xo, q), lerp(yT, yC, q) - .8 * Math.sin(Math.PI * p)]; }
    const q = ease(p - 1); return [sd * lerp(xo, xi, q), lerp(yC, yT, q) + .9 * Math.sin(Math.PI * (p - 1))];
  };
  const onHand = (hp, stack = 0, sd = 1) => [hp[0] + sd * stack * .55, hp[1] - BALL_R - .15 - stack * .75];
  const balls = [];
  for (let b = 0; b < n; b++) {
    const col = cols[b % cols.length];
    if (s < b) {                                                   // not thrown yet: waiting in its first hand
      const sd = b % 2 ? -1 : 1, stacked = b >= 2 && s < b - 2;
      balls.push({ ...xy(onHand(hand(sd, s), stacked ? 1 : 0, -sd)), col, rot: 0, held: true, hand: sd }); continue;
    }
    const k = b + n * Math.floor((s - b) / n), u = s - k, sd = k % 2 === 0 ? 1 : -1;
    if (u < n - 1) {                                               // in flight from sd's inner point to the other hand's outer point
      const f = u / (n - 1), p0 = onHand([sd * xi, yT]), p1 = onHand([-sd * xo, yC]);
      balls.push({ x: lerp(p0[0], p1[0], f), y: lerp(p0[1], p1[1], f) - 4 * h * f * (1 - f), col, rot: u * 2.2 * -sd, held: false, f });
    } else balls.push({ ...xy(onHand(hand(-sd, s))), col, rot: 0, held: true, hand: -sd });
  }
  return { handL: wrist(hand(-1, s), -1), handR: wrist(hand(1, s), 1), balls, s };
  function xy(p) { return { x: p[0], y: p[1] }; }
  // the rig's hand target is the wrist; the palm sits a little further out and up
  function wrist(p, sd) { return [p[0] - sd * .15, p[1] + .45]; }
}

// A juggling ball in screen px: r = radius px, rot spins its stripe.
function jugglerBall(x, y, r, col, rot = 0) {
  const lwPx = clamp(r * .14, 1.4, 4.5);
  X.save(); X.translate(x, y);
  circle(0, 0, r, { fill: col, stroke: PAL.ink, lwPx });
  X.save(); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.clip(); X.rotate(rot);
  X.fillStyle = 'rgba(255,248,230,.55)'; X.fillRect(-r * 1.2, -r * .18, r * 2.4, r * .36);
  X.fillStyle = 'rgba(40,10,30,.18)'; X.beginPath(); X.arc(r * .25, r * .3, r * .95, 0, TAU); X.fill();
  X.restore();
  circle(-r * .35, -r * .4, r * .22, { fill: 'rgba(255,255,255,.85)', stroke: null });
  X.restore();
}
