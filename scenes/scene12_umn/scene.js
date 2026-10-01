// scenes/scene12_umn/scene.js: the shots of "Umn". Write the synopsis, script and shot list in README.md first.
// Every shot fn(t, lt, dur) paints the WHOLE frame and must be a pure function of t (no state, no Math.random()).
(() => {
  const R = LOCATIONS.umn, JZ = R.MARK.z;
  const LINES = ASSETS.scene.scene12_umn.dialogue;

  const cam = t => ({ x: 0, y: 130, z: 200 + t * 40, f: 1000, hy: 560 });

  const speaking = (who, t) => LINES.some(l => {
    const p = (t - l.at - .2) * l.cps;
    return l.speaker === who && p > 0 && p < l.text.length;
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

  // Shared staging for the farewell; every pose and prop is a function of time.
  const POS = { roudaynah: -390, sarah: -270, jenna: -150, alma: -65, sami: 15, danny: 130, housam: 200, safadi: -255 };
  const RIGS = {
    roudaynah: [roudaynah, ROUDAYNAH_UNIT], sarah: [sarah, SARAH_UNIT],
    jenna: [jenna, JENNA_UNIT], alma: [alma, ALMA_UNIT],
    sami: [sami, SAMI_UNIT], safadi: [safadi, SAFADI_UNIT], danny: [danny, DANNY_UNIT], housam: [housam, HOUSAM_UNIT]
  };
  const raised = t => ease(seg(t, 26, 26.9));
  const lowered = t => ease(seg(t, 44.5, 46.1));
  const greet = t => seg(t, 46.5, 46.9) * (1 - seg(t, 49.8, 50.3));
  const contactY = t => kf(t, [[46.5, 65], [47.1, 72], [47.7, 64], [48.3, 64], [48.9, 70], [49.8, 70]]);

  function farewellPose(who, t) {
    const o = { t, mouth: lipFlap(t, speaking(who, t), 'smile'), lookX: 0, dy: .06 * wob(t, .7) };
    if (who === 'sami') Object.assign(o, { brows: 'up', handR: [5, -12], handPoseR: 'palm' });
    if (who === 'roudaynah') {
      const wave = ease(seg(t, 17.5, 17.9)) * (1 - ease(seg(t, 19.5, 20)));
      Object.assign(o, { lookX: .8, mouth: 'grin', handR: [4.3 + wave * (1 + .9 * Math.sin(t * 10)), -14.5 - wave * 12], brows: 'up' });
    }
    if (who === 'jenna') {
      const funny = t >= 24.1 && t < 26;
      const lift = ease(seg(t, 23.9, 24.4)) * (1 - ease(seg(t, 25.6, 26)));
      Object.assign(o, { lookX: t < 20 ? -.8 : .9, turn: t < 20 ? -.15 : .2,
        eyes: funny ? 'wink' : 'open', mouth: lipFlap(t, speaking(who, t), funny ? 'o' : 'smile'), brows: funny ? 'up' : 'normal',
        blink: Math.max(0, 1 - Math.abs(t - 24.05) / .15),
        handL: [-3.8 - lift, -12 - lift * 9], handR: [3.8 + lift, -12 - lift * 9],
        handPoseL: 'palm', handPoseR: 'palm', tilt: lift * (.12 + .06 * Math.sin(t * 8)) });
    }
    if (who === 'alma') Object.assign(o, { lookX: -.8, turn: -.2,
      eyes: t >= 24.4 && t < 26 ? 'happy' : 'open', mouth: t >= 24.4 && t < 26 ? 'grin' : 'smile' });
    if (who === 'sarah') Object.assign(o, { lookX: .7, lookY: t >= 41.5 ? .45 : 0,
      mouth: lipFlap(t, speaking(who, t), t >= 41.65 ? 'frown' : 'smile'),
      blink: Math.max(0, 1 - Math.abs(t - 41.6) / .15), dy: t >= 41.65 ? .35 : o.dy, tilt: t >= 41.65 ? -.06 : 0 });
    if (who === 'danny') {
      const up = raised(t), down = lowered(t), h = greet(t);
      Object.assign(o, { lookX: t < 20 ? -.9 : .8, lookY: down > 0 && down < 1 ? .6 : 0, brows: 'up', mouth: lipFlap(t, speaking(who, t), 'grin'),
        handL: [-3.2, -10 - 5 * up + 3.1 * down], handR: [3.2, -10 - 5 * up + 3.1 * down],
        handPoseL: 'palm', handPoseR: t >= 48.5 ? 'fist' : 'palm' });
      o.handR = mixPt(o.handR, [3.5, -9.8], seg(t, 46.1, 46.5));
      o.handR = mixPt(o.handR, [(162 - POS.danny) / DANNY_UNIT, -contactY(t) / DANNY_UNIT], h);
      o.handL = mixPt(o.handL, [-3.5, -9.8], seg(t, 46.1, 46.5));
    }
    if (who === 'housam') {
      const h = greet(t);
      Object.assign(o, { lookX: -.8, lookY: .4, turn: -.15, mouth: 'grin', brows: 'up',
        handL: mixPt([-4.05, -10.7], [(162 - POS.housam) / HOUSAM_UNIT, -contactY(t) / HOUSAM_UNIT], h),
        handPoseL: t >= 48.5 ? 'fist' : 'palm' });
    }
    if ((who === 'roudaynah' || who === 'sarah') && t >= 50.5) {
      const step = Math.sin((t - 50.5) * 10), walk = ease(seg(t, 50.5, 50.9));
      Object.assign(o, { lookX: -.9, turn: -.25, lean: -.04 * walk,
        footL: [-1.7 + 1.2 * step * walk, -1 - Math.max(0, step) * walk],
        footR: [1.7 - 1.2 * step * walk, -1 - Math.max(0, -step) * walk],
        handL: [-4.3, -14.5 + step * walk], handR: [4.3, -14.5 - step * walk], dy: .12 * Math.abs(step) });
    }
    if ((who === 'sami' || who === 'safadi') && t >= 29.5) {
      const enter = seg(t, 29.5, 30.5), airborne = 5 * Math.sin(Math.PI * enter);
      Object.assign(o, { jump: airborne, sq: .08 * kick(t, 30.5, 9),
        lookX: .8, turn: .15, brows: 'up', mouth: lipFlap(t, speaking(who, t), 'smile'),
        handR: [5.3, speaking(who, t) ? -18 : -12.6], handPoseR: speaking(who, t) ? 'point' : 'palm',
        handL: [-5.3, -12.4] });
    }
    if (['jenna', 'alma', 'danny', 'housam'].includes(who) && t >= 29.5 && t < 41.5) {
      Object.assign(o, { lookX: -.9, lookY: -.4, mouth: 'flat', brows: 'up',
        eyes: t < 30.6 ? 'wide' : 'open', turn: -.15 });
      // The demonstration stops while the adults speak; the Switch stays held.
      if (who === 'danny') Object.assign(o, { handL: [-3.2, -15], handR: [3.2, -15] });
    }
    return o;
  }

  function nintendoSwitch(x, y, s) {
    X.save(); X.translate(x, y); X.scale(s, s);
    shape(rectPts(-4, -1.8, 8, 3.6), { fill: '#262936', stroke: PAL.ink, lw: .18, smooth: .2 });
    shape(rectPts(-2.8, -1.4, 5.6, 2.8), { fill: '#8BCDE3', stroke: '#111622', lw: .12 });
    shape([[-2.6, 1.1], [-1.4, -.2], [-.5, .6], [.5, -.7], [2.6, 1.1]], { fill: '#6BA863', stroke: null });
    for (const [side, col] of [[-1, '#20B9D5'], [1, '#F25A55']]) {
      shape(rectPts(side < 0 ? -4 : 2.9, -1.8, 1.1, 3.6), { fill: col, stroke: PAL.ink, lw: .14, smooth: .3 });
      circle(side * 3.45, side < 0 ? -.65 : .55, .28, { fill: '#242633', stroke: null });
      circle(side * 3.45, side < 0 ? .65 : -.65, .14, { fill: '#242633', stroke: null });
    }
    X.restore();
  }

  function gathering(t, lt, focus) {
    const wide = focus === 'wide', lecture = focus === 'lecture';
    const cx = lecture ? -70 : wide ? -75 : focus === 'girls' ? -110 : focus === 'sarah' ? -300 : 165;
    const k = lecture ? 2.65 + lt * .005 : wide ? 1.95 + lt * .005 : 3.5 + lt * .015;
    const P = persp({ x: cx, y: 120, z: JZ - 1000 / k, f: 1000, hy: 880 - 120 * k });
    layer(() => R.back(P, t, { splitZ: JZ }), { blur: wide ? 0 : 2 });
    // A low stand keeps the console visible after Danny releases it.
    P.plane(JZ, () => {
      shape(rectPts(94, -50, 8, 50), { fill: '#79635A', stroke: PAL.ink, lw: 1 });
      shape(rectPts(131, -50, 8, 50), { fill: '#79635A', stroke: PAL.ink, lw: 1 });
      shape(rectPts(88, -53, 57, 5), { fill: '#C49C78', stroke: PAL.ink, lw: 1 });
    });
    const anchors = {};
    const visible = lecture ? ['sami', 'safadi', 'jenna', 'alma', 'danny', 'housam'] : wide ? Object.keys(POS).filter(w => w !== 'safadi' || t >= 29.5) : focus === 'girls' ? ['jenna', 'alma'] : focus === 'sarah' ? ['roudaynah', 'sarah'] : ['danny', 'housam'];
    // Sami stands slightly behind the children.
    for (const who of ['sami', 'safadi', ...visible.filter(w => w !== 'sami' && w !== 'safadi')]) {
      if (!visible.includes(who)) continue;
      const travel = who === 'roudaynah' || who === 'sarah' ? 650 * ease(seg(t, 50.5, 54.2)) : 0;
      let worldX = POS[who] - travel;
      if (who === 'sami' && t >= 29.5) worldX = lerp(POS.sami, -360, ease(seg(t, 29.5, 30.5)));
      if (who === 'safadi') worldX = lerp(-650, POS.safadi, ease(seg(t, 29.5, 30.5)));
      const adult = who === 'sami' || who === 'safadi';
      const depth = adult ? lerp(140, 0, ease(seg(t, 29.5, 30.5))) : 0;
      const [x, y, scale] = P.p(worldX, 0, JZ + depth);
      const [rig, unit] = RIGS[who], s = unit * scale;
      anchors[who] = { A: rig(x, y, s, farewellPose(who, t)), s };
    }
    if (anchors.danny) {
      const d = anchors.danny, release = lowered(t);
      const held = [(d.A.handL[0] + d.A.handR[0]) / 2, (d.A.handL[1] + d.A.handR[1]) / 2];
      const resting = P.p(116.5, 55, JZ);
      const xy = t < 46.1 ? mixPt(held, resting, release) : resting;
      nintendoSwitch(xy[0], xy[1], d.s);
    }
    R.front(P, t, { splitZ: JZ + 44.5 });
    for (const l of LINES) {
      const a = anchors[l.speaker];
      if (!a || t < l.at - .2) continue;
      callout(l.text, a.A.head[0], a.A.head[1] - a.s, t - l.at,
        { cps: l.cps, hold: l.hold, maxW: 450, dx: lecture ? 180 : l.speaker === 'danny' ? -150 : l.speaker === 'sarah' ? 230 : 130,
          dy: lecture ? -290 : l.speaker === 'danny' ? -230 : -150 });
    }
  }
  const farewell = (t, lt) => gathering(t, lt, 'wide');
  const cousins = (t, lt) => gathering(t, lt, 'girls');
  const switchShow = (t, lt) => gathering(t, lt, 'boys');
  const screenTime = (t, lt) => gathering(t, lt, 'lecture');
  const sarahReaction = (t, lt) => gathering(t, lt, 'sarah');
  const handshake = (t, lt) => gathering(t, lt, 'boys');
  const departure = (t, lt) => gathering(t, lt, 'wide');

  scene({ duration: 54.5, fps: 24, bpm: 100,
    shots: [[0, opening], [15, farewell], [20, cousins], [26, switchShow],
      [29.5, screenTime], [41.5, sarahReaction], [44.5, handshake], [50.5, departure]] });
})();
