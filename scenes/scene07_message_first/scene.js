// Scene 07: "The Message Comes First". Safadi lectures beside the lectern; the camera cuts between him (podium view)
// and Housam and Alma listening in row 3 (the reverse-angle classroom view). Only Safadi speaks; the students react.
// Every shot is a pure function of t. Dialogue lives in asset.js and drives the bubbles, his mouth and the voice.
(() => {
  const HALL = LOCATIONS.lecture_hall, LINES = ASSETS.scene.scene07_message_first.dialogue;
  const SAF = { x: -250, y: HALL.STAGE.y, z: 1990 };                    // beside the lectern (X −420), stage right of it
  const HOU = HALL.seat(3, -66), ALM = HALL.seat(3, 66, 30);            // row 3, one empty seat between them
  const INK = '#2F4E86', SLATE = '#7B8190';

  // ---------- timing helpers ----------
  const speaking = t => LINES.some(l => { const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  // A nod: n quick dips starting at t0 (0 → 1 → 0 each). The rigs have no head pitch, so eyes drop and the torso bobs.
  const nod = (t, t0, n = 2, per = .5) => { const u = (t - t0) / per; return u > 0 && u < n ? Math.sin(Math.PI * (u % 1)) : 0; };
  const nodPose = v => ({ lookY: .75 * v, dy: .32 * v, tilt: .025 * v });
  const glance = (t, t0, dur) => t > t0 && t < t0 + dur ? .8 * Math.sin((t - t0) / dur * TAU * 1.5) : 0;

  // ---------- cameras ----------
  // Podium view: lock Safadi's feet at screen y `feet` while the camera drifts (hy = feet − (camY − footY)·k).
  function podium(t, x, z, f, camY, feet) {
    const k = f / (SAF.z - z);
    return { x, y: camY, z, f, hy: feet - (camY - SAF.y) * k };
  }
  // Classroom view (dir −1): hold the students' eye line at screen y `eyes`.
  function classroom(x, z, f, camY, eyes) {
    const k = f / (z - HOU.z);
    return { x, y: camY, z, f, hy: eyes - (camY - 212) * k, dir: -1 };
  }

  // ---------- the slide: simple and still for the whole scene ----------
  function slide() {
    X.save(); X.textAlign = 'center'; X.textBaseline = 'middle';
    X.fillStyle = INK; X.font = `700 44px ${FONT_TALK}`; X.fillText('The message comes first', 284, 64);
    line([[120, 100], [448, 100]], { stroke: '#E3B65E', lwPx: 3 });
    // a pencil sketch → a finished character
    const face = (cx, cy, o) => { circle(cx, cy, 70, o); circle(cx - 24, cy - 12, 7, { fill: o.stroke, stroke: null }); circle(cx + 24, cy - 12, 7, { fill: o.stroke, stroke: null });
      line([[cx - 30, cy + 22], [cx, cy + 38], [cx + 30, cy + 22]], { stroke: o.stroke, lwPx: 4, smooth: true }); };
    face(150, 270, { fill: null, stroke: SLATE, lwPx: 3, dash: [9, 7] });
    face(418, 270, { fill: '#F6C9A8', stroke: INK, lwPx: 4 });
    line([[250, 270], [318, 270]], { stroke: INK, lwPx: 5 }); line([[300, 252], [320, 270], [300, 288]], { stroke: INK, lwPx: 5 });
    X.fillStyle = SLATE; X.font = `600 30px ${FONT_TALK}`; X.fillText('sketch', 150, 378); X.fillText('character', 418, 378);
    X.fillStyle = INK; X.font = `600 34px ${FONT_TALK}`; X.fillText('What am I trying to say?', 284, 480);
    X.restore();
  }
  const HALL_O = { slide, screen: 1, projector: .85 };

  // ---------- Safadi ----------
  function safadiPose(t) {
    const talk = speaking(t);
    const o = { turn: .12 * Math.sin(t * .23), lookX: .3 * Math.sin(t * .31 + 1), lookY: -.05, brows: 'normal',
      mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']),
      handL: [-4.4, -8.3], handR: [4.4, -8.3], handPoseL: 'open', handPoseR: 'open' };
    const mix = (a, b, k) => mixPt(a, b, clamp(k));
    // 0.8–7: a sketch becomes a character… comes to life
    if (t < 13.2) {
      const up = ease(seg(t, .6, 1.3)) * (1 - ease(seg(t, 3.7, 4.2))), wide = ease(seg(t, 4.1, 4.7)) * (1 - ease(seg(t, 7, 7.8)));
      o.handR = mix(mix(o.handR, [5.4, -13.2], up), [6.3, -13.4], wide); o.handPoseR = up || wide ? 'palm' : 'open';
      o.handL = mix(o.handL, [-6.3, -13.4], wide); if (wide) { o.handPoseL = 'palm'; o.brows = 'up'; }
    }
    // 13.5–21: wonderful possibilities, experiment and tell stories
    if (t >= 13.2 && t < 21.7) {
      const wide = ease(seg(t, 13.5, 14.1)) * (1 - ease(seg(t, 16.4, 17)));
      o.handL = mix(o.handL, [-6.5, -14], wide); o.handR = mix(o.handR, [6.5, -14], wide);
      if (wide > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', brows: 'up' });
      const beat = ease(seg(t, 16.9, 17.3)) * (1 - ease(seg(t, 20.8, 21.3)));
      o.handR = mix(o.handR, [5.2 + .5 * Math.sin(t * 2.2), -12.4], beat); if (beat > .5) o.handPoseR = 'palm';
    }
    // 21.7–28.6: tempted to make everything move: the powers flare up
    const flare = ease(seg(t, 21.9, 24.4)) * (1 - ease(seg(t, 28.6, 29.1)));
    if (t >= 21.7 && t < 29.2) {
      o.handL = mix(o.handL, [-6.6, -16.4], flare); o.handR = mix(o.handR, [6.6, -16.4], flare);
      Object.assign(o, { power: .95 * flare, handPoseL: 'palm', handPoseR: 'palm', brows: 'up', lookY: -.2,
        bulb: t < 23.6 ? 0 : backOut(seg(t, 23.6, 23.9)) * (1 - ease(seg(t, 28.6, 28.9))) });
      if (flare > .5) { o.eyes = 'glow'; o.mouth = lipFlap(t, talk, 'grin'); }
    }
    // 28.6–29.4: he catches himself: sheepish, powers off
    if (t >= 28.6 && t < 30.2) Object.assign(o, { eyes: 'wide', brows: 'worried', mouth: t < 29.4 ? 'wobble' : o.mouth, emote: 'sweat', emoteK: ease(seg(t, 28.7, 29)) * (1 - ease(seg(t, 29.8, 30.2))), lookX: -.2, lookY: .1 });
    // 29.4–34: a raised finger: "what am I trying to say?"
    if (t >= 29.4 && t < 44.6) {
      const f = ease(seg(t, 29.5, 30)) * (1 - ease(seg(t, 33.8, 34.4)));
      o.handR = mix(o.handR, [4.3, -17.6], f); if (f > .5) Object.assign(o, { handPoseR: 'point', brows: 'focused' });
    }
    // 44.9–53.4: movement can make an idea clear… or a quiet moment does the job
    if (t >= 44.6 && t < 60.8) {
      const clear = ease(seg(t, 45, 45.5)) * (1 - ease(seg(t, 47.8, 48.3)));
      o.handR = mix(o.handR, [5.2, -12.2], clear); if (clear > .5) o.handPoseR = 'palm';
      const calm = ease(seg(t, 50.8, 51.8));                                          // "a quiet moment": hands settle together
      o.handL = mix(o.handL, [-1.5, -9.2], calm); o.handR = mix(o.handR, [1.5, -9.2], calm);
      if (calm > .5) Object.assign(o, { handPoseL: 'fist', handPoseR: 'fist', turn: .05, lookX: .1 });
      if (t > 52.6 && t < 53.6) o.eyes = 'happy';
    }
    // 60.8–68: a pause, he turns to the camera: "Give the message the spotlight." Smile.
    if (t >= 60.8) {
      const look = ease(seg(t, 61.5, 62.4));
      Object.assign(o, { turn: lerp(.25, 0, look), lookX: lerp(.55, 0, look), lookY: 0, handL: [-1.5, -9.2], handR: [1.5, -9.2], handPoseL: 'fist', handPoseR: 'fist' });
      const give = ease(seg(t, 63.1, 63.6)) * (1 - ease(seg(t, 65.2, 65.9)));
      o.handR = mixPt(o.handR, [5.4, -12.8], give); if (give > .5) o.handPoseR = 'palm';
      if (t > 64.9) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
    }
    return o;
  }

  function podiumShot(t, cam, blur, extra) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { ...HALL_O, splitZ: SAF.z }), { blur });
    const [sx, sy, k] = P.p(SAF.x, SAF.y, SAF.z), s = SAFADI_UNIT * k;
    const A = safadi(sx, sy, s, safadiPose(t));
    HALL.front(P, t, { splitZ: SAF.z });
    const size = clamp(34 + 5 * k, 44, 58);
    for (const l of LINES) callout(l.text, A.mouth[0] + 1.6 * s, A.mouth[1] - .6 * s, t - l.at,
      { dx: 300 + 30 * k, dy: -170 - 25 * k, size, maxW: 640, cps: l.cps, hold: l.hold, accent: PAL.crimson });
    if (extra) extra(A, s);                                             // after the callouts, so an iris covers them
  }

  // ---------- Housam and Alma ----------
  function housamPose(t) {
    const o = { turn: -.06, lookX: 0, lookY: -.12, brows: 'normal', mouth: 'smile',
      handL: [-3.4, -11.4], handR: [3.4, -11.4], handPoseL: 'open', handPoseR: 'open' };
    // shot A (7.3–13.2): leaning in; "much faster" gets a wide-eyed "wow" and two nods
    if (t < 13.2) {
      Object.assign(o, { lean: -.04 * ease(seg(t, 7.6, 8.4)) });
      if (t > 10.9 && t < 11.9) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'o' });
      Object.assign(o, nodPose(nod(t, 11.9, 2, .45)));
      if (t > 11.9) o.mouth = 'grin';
    }
    // shot B (34–44.6): nods at "understand", then glances around at "more to look at", then a grin at Alma
    if (t >= 34 && t < 44.6) {
      if (t > 35.6 && t < 37.2) o.brows = 'focused';
      const v = nod(t, 36.0, 2, .5) + nod(t, 39.3, 1, .6); Object.assign(o, nodPose(v), { lookY: -.12 + .75 * v });
      const g = glance(t, 41.7, 1.5); if (g) Object.assign(o, { lookX: g, eyes: 'wide', brows: 'up', lookY: -.4 });
      if (t > 43.3) Object.assign(o, { lookX: .8, turn: .3, mouth: 'grin', eyes: 'happy' });   // Alma is screen-left in this view
    }
    // shot C (53.7–60.8): taking notes, then looks up and nods slowly
    if (t >= 53.7) {
      Object.assign(o, { handL: [-2.3, -14.6], handPoseL: 'open', handR: [1.3 + .3 * Math.sin(t * 7), -15.2 + .15 * Math.sin(t * 11)], handPoseR: 'fist', lookY: .55, lookX: -.15 });
      if (t > 57.5) { const v = nod(t, 58.2, 2, .7); Object.assign(o, { lookX: 0, lookY: -.1 + .6 * v, dy: .3 * v, handR: [1.6, -14.4] }); }
      if (t > 59.7) o.mouth = 'grin';
    }
    return o;
  }
  function almaPose(t) {
    const o = { turn: .05, lookX: 0, lookY: -.1, brows: 'up', mouth: 'smile',
      handL: [-2.8, -6.9], handR: [2.8, -6.9], handPoseL: 'open', handPoseR: 'open', hairSwing: .08 * wob(t, .4) };
    // shot A: glances at Housam, then a small excited wiggle in her seat
    if (t < 13.2) {
      if (t > 8.6 && t < 10.1) Object.assign(o, { lookX: -.8, turn: -.3, mouth: 'grin' });            // Housam is screen-right
      if (t > 11.2 && t < 12.9) Object.assign(o, { ...almaDance(t, 'bounce', { bpm: 96, k: .22 }), lookX: 0, eyes: 'star', mouth: 'grin', handL: [-3.2, -8.2], handR: [3.2, -8.2] });
    }
    // shot B: chin in hand at "remember", a nod, a look around, then she catches Housam's eye and giggles
    if (t >= 34 && t < 44.6) {
      const chin = ease(seg(t, 37.5, 38)) * (1 - ease(seg(t, 40.3, 40.8)));
      o.handR = mixPt(o.handR, [1.2, -10.8], chin); if (chin > .5) Object.assign(o, { handPoseR: 'fist', tilt: .08, lookY: -.45, lookX: -.3, brows: 'normal', mouth: 'flat' });
      const v = nod(t, 39.4, 2, .45); if (v) Object.assign(o, nodPose(v));
      const g = glance(t, 41.8, 1.4); if (g) Object.assign(o, { lookX: -g, eyes: 'wide', lookY: -.3 });
      if (t > 43.2) { const k = Math.abs(Math.sin(t * 11)); Object.assign(o, { lookX: -.8, turn: -.3, eyes: 'happy', mouth: k > .5 ? 'grin' : 'smile', blush: ease(seg(t, 43.2, 43.6)), dy: .12 * k, tilt: -.08 }); }
    }
    // shot C: slow agreeing nods, a warm smile
    if (t >= 53.7) {
      Object.assign(o, nodPose(nod(t, 55.1, 2, .7) + nod(t, 58.4, 1, .8)));
      if (t > 58.9) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
    }
    return o;
  }

  function studentShot(t, cam, blur) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { ...HALL_O, splitZ: HOU.z }), { blur });
    const put = (p, rig, unit, pose) => { const [sx, sy, k] = P.p(p.x, p.y, p.z), s = unit * k; return { A: rig(sx, sy, s, pose), s }; };
    put(ALM, alma, ALMA_UNIT, almaPose(t));
    const h = put(HOU, housam, HOUSAM_UNIT, housamPose(t));
    if (t >= 53.7) housamNotebook(h.A.handL[0] + .5 * h.s, h.A.handL[1] - 1.1 * h.s, h.s, { ang: .1 });
    HALL.front(P, t, { splitZ: HOU.z });
    // Safadi is behind the camera: his bubble's tail points off the bottom of the frame
    for (const l of LINES) callout(l.text, W / 2, H + 90, t - l.at, { dx: 0, dy: -300, size: 46, maxW: 980, cps: l.cps, hold: l.hold, accent: PAL.crimson });
  }

  // ---------- shots ----------
  const establish = t => podiumShot(t, podium(t, -90, lerp(1330, 1400, seg(t, 0, 7.3)), 820, 250, 1010), .9);
  const listenA = t => studentShot(t, classroom(10 * Math.sin(t * .2), lerp(1440, 1470, seg(t, 7.3, 13.2)), 1650, 250, 470), 2);
  const possibilities = t => podiumShot(t, podium(t, -210, lerp(1500, 1530, seg(t, 13.2, 21.7)), 1250, 205, 960), 1.6);
  const tempted = t => podiumShot(t, podium(t, lerp(-190, -220, seg(t, 21.7, 34)),
    kf(t, [[21.7, 1420], [28.6, 1460], [30, 1520], [34, 1545]]), 1450, 215, kf(t, [[21.7, 1060], [34, 1110]])), 1.5);
  const listenB = t => studentShot(t, classroom(lerp(-10, 15, seg(t, 34, 44.6)), lerp(1450, 1520, ease(seg(t, 34, 44.6))), 1650, 250, 470), 2.2);
  const quiet = t => podiumShot(t, podium(t, -235, lerp(1590, 1610, seg(t, 44.6, 53.7)), 1450, 200, 1130), 1.9);
  const listenC = t => studentShot(t, classroom(15, lerp(1480, 1500, seg(t, 53.7, 60.8)), 1650, 250, 470), 2.2);
  const spotlight = t => podiumShot(t, podium(t, -250, lerp(1620, 1680, ease(seg(t, 60.8, 68))), 1650, 195, 1250), 2.2, (A, s) => {
    const on = ease(seg(t, 62.4, 64.2)), [hx, hy] = A.head;
    if (on > .01) {
      X.fillStyle = radGrad(hx, hy + 1.5 * s, 5.5 * s, 16 * s, [[0, 'rgba(18,12,28,0)'], [1, `rgba(18,12,28,${.62 * on})`]]); X.fillRect(0, 0, W, H);
      X.fillStyle = radGrad(hx, hy, 0, 9 * s, [[0, `rgba(255,236,190,${.16 * on})`], [1, 'rgba(255,236,190,0)']]); X.fillRect(0, 0, W, H);
    }
    iris(hx, hy, lerp(1800, 0, easeIn(seg(t, 66.8, 68))));
  });

  scene({ duration: 68, fps: 24, bpm: 84,                  // id, title, dialogue, music: see asset.js
    shots: [[0, establish], [7.3, listenA], [13.2, possibilities], [21.7, tempted], [34, listenB],
      [44.6, quiet], [53.7, listenC], [60.8, spotlight]] });
})();
