// scenes/scene12_umn/scene.js: the shots of "Umn". Write the synopsis, script and shot list in README.md first.
// Every shot fn(t, lt, dur) paints the WHOLE frame and must be a pure function of t (no state, no Math.random()).
(() => {
  const R = LOCATIONS.umn, U = SAMI_UNIT, JZ = R.MARK.z;
  const cam = t => ({ x: 0, y: 130, z: kf(t, [[0, 300], [6, 700]]), f: 1000, hy: 560 });

  function opening(t, lt, dur) {
    const P = persp(cam(t));
    layer(() => R.back(P, t, { splitZ: JZ }), { blur: clamp((P.k(JZ) - 1.6) * 1.4, 0, 4.5) });
    const [sx, sy, k] = P.p(0, 0, JZ);
    // Sami using the examine pose
    const A = sami(sx, sy, U * k, { handR: [4.4, -12.2], handPoseR: 'stethoscope', pointerAng: -.95 + .08 * wob(t, .8), mouth: smTalk(t), brows: 'focused', lookX: .6, lookY: .2, tilt: .05 });
    R.front(P, t, { splitZ: JZ });
    callout('I love my beautiful wife!', A.head[0] + 4 * U * k, A.head[1], t - 1);

  }

  scene({ duration: 6, fps: 24, bpm: 100,                  // id, title, audio: see asset.js
    shots: [[0, opening]] });
})();
