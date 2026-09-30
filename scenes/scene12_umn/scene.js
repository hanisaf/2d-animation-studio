// scenes/scene12_umn/scene.js: the shots of "Umn". Write the synopsis, script and shot list in README.md first.
// Every shot fn(t, lt, dur) paints the WHOLE frame and must be a pure function of t (no state, no Math.random()).
(() => {
  const R = LOCATIONS.umn, JZ = R.MARK.z;
  const LINES = ASSETS.scene.scene12_umn.dialogue;

  const cam = t => ({ x: 0, y: 130, z: 200 + t * 40, f: 1000, hy: 560 });

  const speaking = (who, t) => LINES.some(l => {
    const p = (t - l.at - .2) * l.cps;
    return p > 0 && p < l.text.length + (l.hold * l.cps);
  });

  function opening(t, lt, dur) {
    const P = persp(cam(t));
    layer(() => R.back(P, t, { splitZ: JZ }), { blur: 0 });

    const put = (x, z, rig, unit, pose) => { 
        const [sx, sy, k] = P.p(x, 0, z); 
        return { A: rig(sx, sy, unit * k, pose), s: unit * k }; 
    };

    const samiPose = {
      mouth: lipFlap(t, speaking('sami', t), 'smile'),
      handR: [4.4, -12.2], handPoseR: 'stethoscope', pointerAng: -.95 + .08 * wob(t, .8),
      brows: 'up', lookX: speaking('sami', t) ? 0 : (t > 4 ? -0.5 : 0.5), turn: 0.1
    };
    
    const almaPose = {
      mouth: lipFlap(t, speaking('alma', t), 'smile'),
      turn: 0.3,
      handR: [5, -12], handPoseR: 'palm'
    };

    const housamPose = {
      mouth: lipFlap(t, speaking('housam', t), 'smile'),
      turn: -0.3,
      handL: [-5, -12], handPoseL: 'palm'
    };

    const alm = put(-280, JZ + 20, alma, ALMA_UNIT, almaPose);
    const hou = put(280, JZ + 20, housam, HOUSAM_UNIT, housamPose);
    const sam = put(0, JZ, sami, SAMI_UNIT, samiPose);

    R.front(P, t, { splitZ: JZ + 30 });

    for (const l of LINES) {
      const age = t - l.at;
      if (age < -0.2) continue;
      if (l.speaker === 'sami') callout(l.text, sam.A.head[0] + 5 * sam.s, sam.A.head[1] - sam.s, age, { cps: l.cps, hold: l.hold, maxW: 400 });
      else if (l.speaker === 'alma') callout(l.text, alm.A.head[0] - 5 * alm.s, alm.A.head[1] - alm.s, age, { cps: l.cps, hold: l.hold, maxW: 400, dx: -220, dy: -120 });
      else if (l.speaker === 'housam') callout(l.text, hou.A.head[0] + 5 * hou.s, hou.A.head[1] - hou.s, age, { cps: l.cps, hold: l.hold, maxW: 400, dx: 220, dy: -120 });
    }
  }

  scene({ duration: 15, fps: 24, bpm: 100,                  // id, title, audio: see asset.js
    shots: [[0, opening]] });
})();
