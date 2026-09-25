// characters/__NAME__/__NAME__.js: the rig for __TITLE__. Description and look live in README.md; reference art next to it.
//
// __NAME__(x, y, s, o) → anchors. (x, y) = floor point between the feet (screen px), s = px per local unit.
// Local units: feet at y 0, up is negative. In a perspective set use s = UNIT * P.k(Z).
// Follow jester_fester.js for the pattern: pose options (dy, lean, tilt, handL/handR IK targets...), face options
// (eyes, mouth, brows), and return screen anchors (head, mouth, hands) so scenes can attach props and callouts.

const __NAME___UNIT = 6.3;   // world units per local unit

function __NAME__(x, y, s, o = {}) {
  const A = {}, lw = clamp(s * .15, 1.6, 5.5) / s;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) ellipse(0, .15, 4, .75, { fill: 'rgba(40,20,30,.28)', stroke: null });
  withBoil(o.boil ?? .7, () => {
    // placeholder body: replace with the real character
    shape(ellPts(0, -10, 4, 10, 24), { fill: '#8FB3E0', stroke: PAL.ink, lw, smooth: true });
    circle(-1.3, -15, .6, { fill: PAL.ink, stroke: null }); circle(1.3, -15, .6, { fill: PAL.ink, stroke: null });
    A.head = toPx(0, -15); A.mouth = toPx(0, -13);
  });
  X.restore();
  return A;
}

// Registration: the studio's character browser and model sheets read this. Add poses as you build the rig.
CHARACTERS.__NAME__ = {
  draw: __NAME__, unit: __NAME___UNIT, size: [9, 22],                       // size = local units (w, h) for framing
  poses: {
    'rest': (x, y, s, t) => __NAME__(x, y, s, {}),
    'bounce': (x, y, s, t) => __NAME__(x, y - Math.abs(Math.sin(t * 5)) * s * 2, s, {}),
  },
};
