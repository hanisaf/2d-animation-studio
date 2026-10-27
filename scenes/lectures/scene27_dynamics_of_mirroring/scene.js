// Scene 27: "Dynamics of Mirroring". Professor Safadi, alone in the lecture hall, explains his paper (Safadi & Tiwana,
// JAIS 2026) in about five minutes. He stands on the pit floor at the left end of the big chalkboard (board.js), and
// the board changes panel with each part of the talk. The camera cuts between a two-shot (him + board), board close-ups
// and close-ups on him. Dialogue (asset.js) drives the bubbles, his mouth, the voice, the panels and his gestures.
// Every shot is a pure function of t.
(() => {
  const HALL = LOCATIONS.lecture_hall, LINES = MB_LINES, BB = HALL.BIG_BOARD;
  const SAF = { x: -600, y: 0, z: 1840 };                                // pit floor, in front of the lectern, left of the board
  const L = (s, i = 0) => MB_BEATS[s][i];                                // when line i of panel s starts
  const END = LINES[LINES.length - 1].at + 5.2;

  // ---------- who's talking, and which gesture is on ----------
  const speaking = t => LINES.some(l => { const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  function lineAt(t) { let i = -1; for (let j = 0; j < LINES.length; j++) if (t >= LINES[j].at - .2) i = j; return i; }

  // Each gesture is a pose fragment; u = seconds since its line started (for waves, wiggles, ramps).
  const GESTURES = {
    rest: () => ({ handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' }),
    talk: (u, t) => ({ handL: [-4.4, -8.3], handR: [5.3 + .35 * Math.sin(t * 2.3), -12.6 + .3 * Math.sin(t * 3.1)], handPoseL: 'open', handPoseR: 'palm' }),
    open: () => ({ handL: [-6.3, -13.4], handR: [6.3, -13.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up' }),
    up: () => ({ handL: [-4.4, -8.3], handR: [5.6, -21], handPoseL: 'open', handPoseR: 'point', brows: 'focused' }),
    board: (u, t) => ({ handL: [-4.6, -10.4], handR: [4.6, -12.6], handPoseL: 'palm', handPoseR: 'pointer', pointerAng: -.62 + .07 * Math.sin(t * 1.3), pointerLen: 9.5,
      turn: .22, lookX: .75, lookY: -.35, brows: 'up' }),
    think: () => ({ handL: [.6, -10.6], handR: [.8, -16.1], handPoseL: 'fist', handPoseR: 'fist', brows: 'quizzical', lookX: -.35, lookY: -.55, tilt: -.05 }),
    shrug: u => ({ handL: [-5.2, -13.2], handR: [5.2, -13.2], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', tilt: .1,
      emote: '?', emoteK: ease(seg(u, .4, .8)) * (1 - ease(seg(u, 3, 3.4))) }),
    idea: u => ({ handL: [-4.4, -8.3], handR: [5.8, -21.4], handPoseR: 'point', eyes: u > .9 ? 'wide' : undefined, brows: 'up',
      bulb: backOut(seg(u, .9, 1.2)) * (1 - ease(seg(u, 3.4, 3.8))) }),
    power: u => ({ handL: [-5.8, -14.4], handR: [5.8, -14.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', lookY: -.15,
      power: .9 * ease(seg(u, 0, 1.2)) }),
    wave: (u, t) => ({ handL: [-4.4, -8.3], handR: [6 + .9 * Math.sin(t * 7), -20], handPoseR: 'palm', eyes: 'happy', brows: 'up' }),
  };
  const BLEND = ['handL', 'handR', 'turn', 'lookX', 'lookY', 'tilt', 'power'];

  function safadiPose(t) {
    const i = lineAt(t), cur = LINES[i], prev = LINES[i - 1], talk = speaking(t);
    const g = cur ? cur.gesture : 'rest', pg = prev ? prev.gesture : 'rest';
    const u = cur ? t - cur.at : 0, k = cur ? ease(seg(t, cur.at - .2, cur.at + .35)) : 1;
    const base = { turn: .08 * Math.sin(t * .21), lookX: .12 * Math.sin(t * .33 + 1), lookY: -.05, tilt: 0, power: 0, brows: 'normal' };
    const a = { ...base, ...GESTURES[pg](u + 99, t) }, o = { ...base, ...GESTURES[g](u, t) };
    for (const key of BLEND) {                                             // ease the body from the last gesture to this one
      const va = a[key] ?? base[key] ?? 0, vb = o[key] ?? base[key] ?? 0;
      o[key] = Array.isArray(vb) ? mixPt(va, vb, k) : lerp(va, vb, k);
    }
    if (k < .5) for (const key of ['handPoseL', 'handPoseR', 'pointerAng', 'pointerLen']) if (a[key] !== undefined) o[key] = a[key];
    if (pg === 'power' && g === 'power') o.power = .9;                     // stay lit across the closing lines
    o.eyes ??= o.power > .5 ? 'glow' : undefined;
    o.mouth = lipFlap(t, talk, o.power > .5 || g === 'wave' ? 'grin' : 'smile', ['smile', 'open', 'o', 'grin', 'smile']);
    if (t > END - 4) Object.assign(o, { eyes: 'happy', power: o.power * (1 - ease(seg(t, END - 3.5, END - 2.5))) });
    return o;
  }

  // ---------- cameras ----------
  // two(): Safadi on the left third, the whole board on the right; his feet locked at screen y `feet`.
  function two(lt, o = {}) {
    const f = o.f ?? 790, z = (o.z ?? 1470) + (o.push ?? 6) * lt, x = (o.x ?? -315) + (o.pan ?? 0) * lt, y = o.y ?? 100, feet = o.feet ?? 1060;
    return { x, y, z, f, hy: feet - (y - SAF.y) * f / (SAF.z - z) };
  }
  // board(): the board fills the frame above a strip of wall for the bubble; Safadi is off to the left.
  function board(lt, o = {}) {
    const z = (o.z ?? 1430) + (o.push ?? 5) * lt, f = 1000, y = 520, top = o.top ?? 34;
    return { x: (o.x ?? 0) + (o.pan ?? 0) * lt, y, z, f, hy: top + (BB.y - y) * f / (2300 - z) };
  }
  // close(): medium close-up on Safadi, the board soft behind him.
  function close(lt, o = {}) {
    const z = (o.z ?? 1600) + (o.push ?? 6) * lt, f = o.f ?? 1000, y = 150, feet = o.feet ?? 1300;
    return { x: (o.x ?? -500) + (o.pan ?? 0) * lt, y, z, f, hy: feet - (y - SAF.y) * f / (SAF.z - z) };
  }
  // wide(): from the middle of the empty rows.
  const wide = (lt, o = {}) => ({ x: o.x ?? -80, y: 330, z: (o.z ?? 700) + (o.push ?? 14) * lt, f: 1000, hy: 600 });

  // ---------- painting a shot ----------
  function paint(t, cam, o = {}) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { bigBoard: mbBoard, splitZ: SAF.z }), { blur: o.blur ?? 0 });
    const [sx, sy, k] = P.p(SAF.x, SAF.y, SAF.z), s = SAFADI_UNIT * k;
    let A = null;
    if (sx > -40 * s && sx < W + 40 * s) A = safadi(sx, sy, s, safadiPose(t));
    HALL.front(P, t, { splitZ: SAF.z });
    // bubbles: beside his head when he's in frame, otherwise a strip along the bottom with the tail off to the left
    const onScreen = A && A.mouth[0] > 0 && A.mouth[0] < W;
    for (const l of LINES) {
      const age = t - l.at;
      if (age < -.1 || age > 12) continue;
      if (o.bubble === 'bottom' || !onScreen) callout(l.text, -60, 940, age, { dx: 1020, dy: 0, size: 42, maxW: 1500, cps: l.cps, hold: l.hold, accent: PAL.crimson });
      else callout(l.text, sx + 4.6 * s, sy - 21 * s, age, { dx: o.dx ?? 200 + 8 * s, dy: o.dy ?? -150 - 6 * s, size: o.size ?? 44, maxW: o.maxW ?? 860, cps: l.cps, hold: l.hold, accent: PAL.crimson });
    }
    return { A, s };
  }

  // shot makers: each returns fn(t, lt, dur)
  const TWO = o => (t, lt) => paint(t, two(lt, o), { dx: 70, dy: -250, size: 38, maxW: 440 });
  const BOARD = o => (t, lt) => paint(t, board(lt, o), { bubble: 'bottom' });
  const CLOSE = o => (t, lt) => paint(t, close(lt, o), { blur: 2.6, dx: 330, dy: -200, size: 46, maxW: 760 });
  const establish = (t, lt) => paint(t, wide(lt), { size: 40, dx: 380, dy: -160 });
  const outro = (t, lt, dur) => {
    const r = paint(t, wide(lt, { z: 980, x: -150, push: -22 }), { size: 40, dx: 360, dy: -150 });
    if (r.A) iris(r.A.head[0], r.A.head[1], lerp(2000, 0, easeIn(seg(lt, dur - 1.6, dur))));
  };

  const shots = [
    [0, establish],
    [L(1, 1) - .3, TWO({ x: -345 })], [L(1, 2) - .3, CLOSE({ x: -495 })],
    [L(2) - .35, TWO()], [L(2, 2) - .3, BOARD({ x: -20, pan: 3 })], [L(2, 4) - .3, TWO({ x: -305, pan: -2 })], [L(2, 5) - .3, CLOSE()],
    [L(3) - .35, TWO({ x: -335 })], [L(3, 2) - .3, BOARD({ pan: -3 })], [L(3, 3) - .3, CLOSE({ x: -525 })],
    [L(4) - .35, TWO()], [L(4, 2) - .3, CLOSE({ x: -485, push: 10 })],
    [L(5) - .35, TWO({ x: -315 })], [L(5, 1) - .3, BOARD({ x: -30, pan: 3 })], [L(5, 3) - .3, TWO({ x: -345, pan: 2 })], [L(5, 4) - .3, BOARD({ x: 10, pan: -2 })],
    [L(6) - .35, TWO()], [L(6, 1) - .3, BOARD({ pan: 3 })], [L(6, 4) - .3, CLOSE()],
    [L(7) - .35, TWO({ x: -315 })], [L(7, 1) - .3, BOARD({ x: -10, pan: 2 })], [L(7, 3) - .3, CLOSE({ x: -515 })],
    [L(8) - .35, TWO()], [L(8, 1) - .3, BOARD({ pan: 3 })], [L(8, 4) - .3, TWO({ x: -335, pan: -2 })],
    [L(9) - .35, CLOSE({ x: -495 })], [L(9, 1) - .3, BOARD({ x: -10, pan: 2 })], [L(9, 3) - .3, TWO({ x: -315 })],
    [L(10) - .35, CLOSE({ x: -515 })], [L(10, 1) - .3, BOARD({ pan: -2 })], [L(10, 5) - .3, CLOSE({ x: -485 })],
    [L(11) - .35, TWO({ x: -325 })], [L(11, 1) - .3, BOARD({ x: -10, pan: 2 })], [L(11, 3) - .3, TWO({ x: -345, pan: 2 })],
    [L(12) - .35, TWO()], [L(12, 1) - .3, BOARD({ pan: 2 })], [L(12, 3) - .3, CLOSE({ x: -505 })], [L(12, 4) - .3, TWO({ x: -325 })],
    [L(12, 5) - .3, CLOSE({ x: -495, push: 4 })], [L(12, 7) - .3, outro],
  ];

  scene({ duration: Math.ceil(END), fps: 24, bpm: 80, shots });             // id, title, dialogue, music: see asset.js
})();
