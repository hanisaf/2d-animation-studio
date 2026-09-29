// Scene 09: "Housam's Hat Trick". The county soccer field, south goal. Housam scores three trick goals past goalkeeper
// Fester while Safadi and Alma cheer from the stands; the third knocks Fester's hat into the net.
// Rigs always face the camera, so the action is shot / reverse shot along the pitch: Housam from the keeper's side
// (dir 1, telephoto), Fester from the shooter's side (dir −1, Housam behind the camera). Each ball flight is ONE world path
// (FLIGHTS), so it leaves one shot and arrives in the next. Every shot is a pure function of t.
(() => {
  const F = LOCATIONS.soccer_field, LINES = ASSETS.scene.scene09_hat_trick.dialogue;
  const HU = HOUSAM_UNIT, U = JF_UNIT;
  const HOU = { x: 0, z: 1100 }, JFZ = 60;                                   // penalty spot · goal line (a step off it)
  const SAF = { x: -3690, z: 1940 }, ALM = { x: -3880, z: 1880 };            // on the apron in front of the bleachers
  const BR = 1.8, BRW = BR * HU;                                             // ball radius: Housam units · world units
  const K1 = 21.3, K2 = 33.3, K3 = 46.2, TH = 46.6;                          // kicks · the ball clips the hat
  const C1 = 21.72, C2 = 33.65, C3 = 46.33;                                  // cuts to the goal (ball mid-flight)
  const GOALS = [21.88, 34.9, 47.0], SCORE_AT = [22.4, 35.5, 51.8];
  const O_BASE = { crowd: .55, home: 'HOUSAM', guest: 'FESTER' };

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who || l.kind === 'think') return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const mix = (a, b, k) => mixPt(a, b, clamp(k));
  const scoreAt = t => SCORE_AT.filter(s => t >= s).length;
  const cheerAt = t => Math.max(.3, ...GOALS.map(g => on(t, g + .3, g + 10.5, .5)));
  const setO = (t, extra) => ({ ...O_BASE, score: [scoreAt(t), 0], cheer: cheerAt(t), ...extra });

  // ---------- ball paths ----------
  // Local (Housam units, relative to his feet): keys [time, [x, y], apex (extra lift mid-segment), z offset (+ behind him)].
  function path(t, keys) {
    if (t <= keys[0][0]) return { p: keys[0][1], z: keys[0][3] ?? -30 };
    for (let i = 1; i < keys.length; i++) {
      const [ta, pa, ap, za = -30] = keys[i - 1], [tb, pb, , zb = -30] = keys[i];
      if (t < tb) { const u = (t - ta) / (tb - ta); return { p: [lerp(pa[0], pb[0], u), lerp(pa[1], pb[1], u) - 4 * ap * u * (1 - u)], z: lerp(za, zb, u) }; }
    }
    const k = keys[keys.length - 1]; return { p: k[1], z: k[3] ?? -30 };
  }
  // World flights: from → to over [t0, t1] with a parabolic lift; then it drops in the net (or rolls, for the chip).
  const W3 = (x, y, z) => [x, y, z];
  function flight(Fl, t) {
    if (t < Fl.t0) return null;
    if (t <= Fl.t1) { const u = (t - Fl.t0) / (Fl.t1 - Fl.t0); return [lerp(Fl.a[0], Fl.b[0], u), lerp(Fl.a[1], Fl.b[1], u) + 4 * Fl.apex * u * (1 - u), lerp(Fl.a[2], Fl.b[2], u)]; }
    const dt = t - Fl.t1, [x, y0, z] = Fl.b;
    if (Fl.roll) { const r = easeOut(seg(dt, 0, .9)); return [lerp(x, Fl.roll[0], r), BRW, lerp(z, Fl.roll[1], r)]; }
    const g = 2200, tf = Math.sqrt(2 * Math.max(y0 - BRW, 0) / g);
    if (dt < tf) return [x, y0 - g * dt * dt / 2, z];
    const d2 = dt - tf, v = g * tf * .32, tb = 2 * v / g;
    return [x + 8 * Math.min(d2, 1), BRW + (d2 < tb ? v * d2 - g * d2 * d2 / 2 : 0), z + 6 * Math.min(d2, 1)];
  }
  const kneeBall = sd => { const { joint } = ik2([sd * 1.25, -8.25], [sd * 1.3, -5.0], 3.5, 3.76, [sd * .55, .12]); return [joint[0], joint[1] - 2.3]; };
  const FOOT = [2.0, -5.0], FOOT_L = [-2.0, -5.0], HEAD = [.3, -34.2], VOLLEY = [2.6, -9.0], KICK3 = [-2.3, -32.3];
  const KNEE_L = kneeBall(-1), KNEE_R = kneeBall(1), REST = [2.3, -1.8];
  const localToWorld = (p, hz, dz = -30) => W3(HOU.x + p[0] * HU, -p[1] * HU, hz + dz);
  const HZ2 = 870;                                                            // where Housam chips from, after the dribble
  const FL1 = { t0: K1, t1: K1 + .66, a: localToWorld(VOLLEY, HOU.z), b: W3(315, 200, -150), apex: 35 };
  const FL2 = { t0: K2, t1: K2 + 1.6, a: localToWorld(REST, HZ2), b: W3(-15, BRW, -40), apex: 290, roll: [-25, -150] };
  const HIT = W3(0, 176, JFZ);
  const FL3A = { t0: K3, t1: TH, a: localToWorld(KICK3, HOU.z), b: HIT, apex: 25 };
  const FL3B = { t0: TH, t1: GOALS[2], a: HIT, b: W3(-315, 212, -150), apex: 12 };
  const ball3 = t => t < TH ? flight(FL3A, t) : flight(FL3B, t);

  // ---------- Housam's touches (keepie-uppie, rainbow flick, the flip volley) ----------
  const JUG_OPEN = (() => { const k = [[0, FOOT, 7]]; for (let i = 1; i <= 10; i++) k.push([i * .5, i % 3 === 2 ? KNEE_L : i % 2 ? FOOT_L : FOOT, i % 3 === 1 ? 9 : 6]); return k; })();
  const JUG1 = [[16, REST, 0], [17.95, REST, 4], [18.2, FOOT, 4], [18.75, KNEE_L, 4], [19.3, FOOT, 9], [19.85, HEAD, 3], [20.55, KNEE_R, 3], [K1, VOLLEY, 0]];
  const LIMB = new Map([[FOOT, 'footR'], [FOOT_L, 'footL'], [KNEE_L, 'kneeL'], [KNEE_R, 'kneeR'], [HEAD, 'head'], [VOLLEY, 'volley']]);
  const FLICK = [[28.6, REST, 0], [30.9, REST, 0], [31.0, [.9, -1.8], 0, 25], [31.2, [.7, -8.5], 34, 35], [31.9, [2.1, -5.0], 0, -30], [32.0, REST, 0]];
  const FLIP = [[42, REST, 0], [45.2, REST, 18], [K3, KICK3, 0]];
  const REST_POSE = { footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7] };

  // Juggling pose: each touch pulls its limb to the ball for ±0.2 s; the eyes follow the ball.
  function touchPose(t, keys, o, ball) {
    for (const [tk, pt] of keys) {
      const e = ease(1 - clamp(Math.abs(t - tk) / .2)), limb = LIMB.get(pt); if (e <= 0 || !limb) continue;
      if (limb === 'footR') o.footR = mix(o.footR, [1.9, -3.0], e);
      if (limb === 'footL') o.footL = mix(o.footL, [-1.9, -3.0], e);
      if (limb === 'kneeL') o.footL = mix(o.footL, [-1.3, -5.0], e);
      if (limb === 'kneeR') o.footR = mix(o.footR, [1.3, -5.0], e);
      if (limb === 'head') Object.assign(o, { tilt: -.12 * e, jump: .7 * e, dy: -.3 * e });
    }
    Object.assign(o, { lookY: clamp((ball[1] + 22) / 14, -1, 1), lookX: clamp(ball[0] / 5, -1, 1) * .5 });
    o.handL = mix(o.handL, [-4.9, -13.2], .6); o.handR = mix(o.handR, [4.9, -13.2], .6);
    return o;
  }

  // → { z (world), o (pose), ball: { p local | w world, z } }
  function housamPOV(t) {
    const talk = speaking('housam', t);
    const o = { ...REST_POSE, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'smile', 'o']), brows: 'normal', handPoseL: 'open', handPoseR: 'open' };
    let z = HOU.z, ball;
    if (t < 5.2) {                                                             // warm-up juggling (the opening crane)
      const b = path(t, JUG_OPEN); ball = { p: b.p, z: -30 }; touchPose(t, JUG_OPEN, o, b.p); o.mouth = 'smile';
    } else if (t < 28) {                                                       // trick 1: keepie-uppie volley
      const b = path(t, JUG1); ball = { p: b.p, z: -30 };
      if (t < 17.9) Object.assign(o, { lookX: -.1, lookY: .1, handR: talk ? [5.2, -13.6] : o.handR, handPoseR: talk ? 'palm' : 'open', mouth: talk ? o.mouth : 'smirk', brows: t > 17.8 ? 'focused' : 'up' });
      else if (t < K1 - .15) { touchPose(t, JUG1, o, b.p); o.brows = 'focused'; o.mouth = 'smile'; }
      else {                                                                   // the volley and follow-through
        const sw = ease(seg(t, K1 - .15, K1)), fol = 1 - ease(seg(t, K1 + .15, K1 + .6));
        Object.assign(o, { footR: mix(mix([1.5, -1.05], [3.1, -7.2], sw), [3.7, -9.6], seg(t, K1, K1 + .15) * fol), lean: -.14 * sw * Math.max(fol, .3),
          handL: [-5.3, -15.2], handR: [5.1, -13.4], brows: 'focused', mouth: 'grin', lookY: .4, lookX: 0, rot: -.04 * sw });
        if (t > K1) ball = { w: flight(FL1, t) };
      }
    } else if (t < 40) {                                                       // trick 2: rainbow flick, dribble in, chip
      if (t < 32) {
        const b = path(t, FLICK); ball = { p: b.p, z: b.z };
        if (t < 30.9) Object.assign(o, { lookY: .2, brows: 'up', mouth: talk ? o.mouth : 'smirk', handR: talk ? [4.9, -22.5] : o.handR, handPoseR: talk ? 'point' : 'open' });
        else {
          const pull = on(t, 30.88, 31.05, .06), heel = on(t, 31.0, 31.35, .08);
          Object.assign(o, { footL: mix([-1.5, -1.05], [-.4, -1.7], pull), footR: mix([1.5, -1.05], [.9, -6.8], heel), lean: .08 * heel,
            handL: [-5.2, -14.8], handR: [5.2, -14.8], brows: 'focused', mouth: 'o', lookY: clamp((b.p[1] + 22) / 14, -1, 1), dy: .5 * heel });
        }
      } else {
        const d = ease(seg(t, 32, 33.1)); z = lerp(HOU.z, HZ2, d);
        const p = (HOU.z - z) / 42, dr = housamDribble(p, t < 33.1 ? 1 : 0);
        Object.assign(o, dr, { brows: 'focused', mouth: 'smirk', lookY: .5 });
        ball = { p: [REST[0] + .5 * Math.sin(p * Math.PI), REST[1] - .3 * Math.abs(Math.sin(p * Math.PI))], z: -35 };
        if (t >= 33.1) {
          const sc = ease(seg(t, 33.1, K2)), fol = 1 - ease(seg(t, K2 + .2, K2 + .7));
          Object.assign(o, { footR: mix([1.5, -1.05], [2.3, -3.6], sc * fol), lean: -.1 * sc * fol, handL: [-5, -14], handR: [5, -14], lookY: -.4, mouth: 'grin', dy: .3 * sc * fol });
          if (t > K2) ball = { w: flight(FL2, t) };
        }
      }
    } else {                                                                   // trick 3: math vision, flip volley
      const b = path(t, FLIP); ball = { p: b.p, z: -30 };
      if (t < 45.2) {
        const chin = on(t, 42.2, 44.1, .3), aim = on(t, 44.0, 45.3, .25);
        Object.assign(o, { brows: 'focused', lookX: -.7, lookY: -.7, mouth: talk ? o.mouth : 'flat', tilt: .06 * chin });
        o.handR = mix(o.handR, [1.1, -21.2], chin); if (chin > .5) o.handPoseR = 'fist';
        o.handL = mix(o.handL, [-4.6, -22.4], aim); if (aim > .5) { o.handPoseL = 'point'; o.mouth = talk ? o.mouth : 'smirk'; }
      } else {
        const scoop = on(t, 45.15, 45.4, .08), crouch = on(t, 45.4, 45.95, .2), fl = seg(t, 45.93, 46.47), air = Math.sin(Math.PI * seg(t, 45.9, 46.55));
        const land = kick(t, 46.55, 6);
        Object.assign(o, { footR: mix([1.5, -1.05], [2.1, -3.6], scoop), dy: .9 * crouch + .8 * land, lookY: clamp((b.p[1] + 22) / 14, -1, 1), brows: 'focused', mouth: 'o',
          handL: [-4.8, -12.5], handR: [4.8, -12.5] });
        if (fl > 0) Object.assign(o, { rot: -TAU * ease(fl), jump: 12 * air, footR: [2.4, -1.5], footL: [-1.2, -5.2], handL: [-5.6, -16], handR: [5.6, -16], mouth: 'grin', eyes: fl < 1 ? 'open' : 'happy' });
        if (t > 46.55) Object.assign(o, { mouth: 'grin', eyes: 'happy', sq: .2 * land });
        if (t > K3) ball = { w: ball3(t) };
      }
    }
    return { z, o, ball };
  }

  // ---------- Fester ----------
  const JF_REST = { handL: [-3.3, -8.4], handR: [3.3, -8.4], footL: [-1.25, -.85], footR: [1.25, -.85] };
  const READY = { footL: [-2.7, -.85], footR: [2.7, -.85], dy: 1.3, handL: [-4.9, -11.8], handR: [4.9, -11.8], handPoseL: 'open', handPoseR: 'open', brows: 'angry', mouth: 'teeth' };
  // A dive to world side (+1 = +X, which is screen-LEFT from the reverse camera). Returns { dx, o }.
  function dive(t, t0, side, dur = .45) {
    const f = seg(t, t0, t0 + dur), lie = ease(seg(t, t0 + dur * .55, t0 + dur)), sd = -side;
    return { dx: side * 250 * easeOut(f), o: { rot: sd * 1.52 * easeOut(f), jump: 8 * Math.sin(Math.PI * f) - 9.6 * lie, handL: [-1.8, -25], handR: [1.8, -25],
      footL: [-.8, -.9], footR: [.8, -.9], eyes: f < 1 ? 'squeeze' : 'x', mouth: f < 1 ? 'teeth' : 'wobble', sq: .2 * kick(t, t0 + dur, 8), hatSway: [sd * 1.5, .4] } };
  }
  const blend = (a, b, k) => {                                                // pose a → pose b (numbers and [x, y] points)
    const o = { ...a, ...b };
    for (const key of Object.keys(b)) if (key in a) {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') o[key] = lerp(a[key], b[key], k);
      else if (Array.isArray(a[key]) && Array.isArray(b[key])) o[key] = mix(a[key], b[key], k);
      else o[key] = k < .5 ? a[key] : b[key];
    }
    for (const key of Object.keys(a)) if (!(key in b) && typeof a[key] === 'number') o[key] = lerp(a[key], 0, k);
    return o;
  };
  const shuffle = t => ({ x: 22 * Math.sin(t * 4.2), o: { ...READY, dy: READY.dy + .25 * Math.abs(Math.sin(t * 8.4)), hatSway: [.6 * Math.sin(t * 4.2), 0] } });

  // → { x, z, o, hat (free hat: world point + rot, or null), drape (0..1 tangled in the net) }
  function festerPose(t) {
    const talk = speaking('jester_fester', t);
    const base = { ...JF_REST, turn: 0, mouth: lipFlap(t, talk, 'grin'), brows: 'up', handPoseL: 'open', handPoseR: 'open' };
    let x = 0, z = JFZ, o = { ...base }, hat = null, drape = 0;
    // arrival: three hops from screen-left (world +X), a flip on the last two
    if (t < 6.95) {
      const hops = [[5.3, 5.85, 820, 560, false], [5.85, 6.4, 560, 290, true], [6.4, 6.95, 290, 0, true]], h = hops.find(q => t >= q[0] && t < q[1]);
      if (!h) return null;
      const [a, b, x0, x1, flip] = h, f = seg(t, a, b), tuck = flip ? Math.sin(Math.PI * f) : .4 * Math.sin(Math.PI * f);
      return { x: lerp(x0, x1, f), z, o: { jump: 7 * Math.sin(Math.PI * f), rot: flip ? TAU * ease(f) : .15 * Math.sin(Math.PI * f),
        footL: mixPt([-1.25, -.85], [-1.2, -5.2], tuck), footR: mixPt([1.25, -.85], [1.2, -5.2], tuck),
        handL: mixPt([-4.6, -15], [-2.2, -12], tuck), handR: mixPt([4.6, -15], [2.2, -12], tuck), eyes: flip ? 'squeeze' : 'happy', mouth: 'grin', hatSway: [-1.2, .4] } };
    }
    if (t < 16) {                                                              // ta-da, "Keeper Fester!", gloves clap, ready crouch
      const tada = ease(seg(t, 6.95, 7.2)) * (1 - ease(seg(t, 9.4, 9.8)));
      o.handL = mix(o.handL, [-5.3, -15.4], tada); o.handR = mix(o.handR, [5.3, -15.4], tada);
      Object.assign(o, { sq: .3 * boing(t, 6.95, 2.2, 6), dy: .5 * kick(t, 6.95, 5), eyes: t < 7.3 ? 'happy' : 'open', brows: 'up' });
      if (t > 8.4 && t < 9.5) Object.assign(o, { handR: [.9, -11.8], handPoseR: 'thumb', eyes: 'happy' });          // thumb to chest: "Fester"
      const clap = on(t, 9.8, 10.6, .12), c1 = Math.abs(Math.sin((t - 9.8) * Math.PI / .25));
      if (clap > 0) { o.handL = mix(o.handL, [-.9 - 1.8 * c1, -12.5], clap); o.handR = mix(o.handR, [.9 + 1.8 * c1, -12.5], clap); o.mouth = 'teeth'; }
      if (t > 10.5) { const s = shuffle(t), k = ease(seg(t, 10.5, 10.9)); x = s.x * k; o = blend(o, s.o, k); }
      return { x, z, o };
    }
    if (t < 33) {                                                              // goal 1: the wrong-way dive; up again; "I let you have that one!"
      if (t < 21.5) { const s = shuffle(t); return { x: s.x, z, o: { ...base, ...s.o } }; }
      const d = dive(t, 21.5, -1), up = ease(seg(t, 22.9, 23.3));
      x = d.dx; o = blend({ ...base, ...d.o }, { ...base, eyes: 'open', brows: 'worried', mouth: 'smirk' }, up);
      if (t > 22.2 && t < 22.9) Object.assign(o, { eyes: 'swirl', stars: ease(seg(t, 22.2, 22.4)) * (1 - ease(seg(t, 22.7, 22.9))) });
      if (t > 23.3) Object.assign(o, { mouth: lipFlap(t, talk, 'smirk'), handR: mix([3.3, -8.4], [3.8, -13], on(t, 23.4, 25.8)), handPoseR: 'thumb',
        brows: 'up', blush: ease(seg(t, 24.2, 24.6)), eyes: t > 24.8 ? 'wink' : 'open', turn: .1 });
      return { x, z, o };
    }
    if (t < 46) {                                                              // goal 2: dives far too early; the chip floats past; "where did it go?"
      if (t < 33.5) { const s = shuffle(t); return { x: s.x, z, o: { ...base, ...s.o } }; }
      const d = dive(t, 33.5, 1, .5); x = d.dx; o = { ...base, ...d.o };
      if (t > 34.1) Object.assign(o, { eyes: 'open', mouth: 'o', lookX: -.9, lookY: .2, tilt: .25 * ease(seg(t, 34.1, 34.5)) });   // lifts his head to watch it roll in
      if (t > 35.0) Object.assign(o, { emote: '?', emoteK: on(t, 35.05, 37.6, .15), brows: 'worried', mouth: lipFlap(t, talk, 'o') });
      const up = ease(seg(t, 37.8, 38.3)); if (up > 0) o = blend(o, { ...base, ...READY, x: 0 }, up);
      return { x, z, o };
    }
    // goal 3: straight up… the ball whips over his head and takes his hat; bald; back into the net, tangled
    if (t < 46.35) { const s = shuffle(t); return { x: s.x, z, o: { ...base, ...s.o } }; }
    if (t < 57.3) {
      const jf = seg(t, 46.35, 46.85), jumpK = Math.sin(Math.PI * jf);
      o = { ...base, ...READY, jump: 5 * jumpK, handL: mix(READY.handL, [-2.6, -24], jumpK * 2), handR: mix(READY.handR, [2.6, -24], jumpK * 2),
        eyes: 'squeeze', mouth: 'teeth', footL: [-1.2, -1.6], footR: [1.2, -1.6], dy: READY.dy * (1 - jumpK) };
      if (t >= TH) Object.assign(o, { noHat: true });
      if (t >= 46.85) Object.assign(o, { ...READY, eyes: 'wide', mouth: 'o', brows: 'up', lookY: -1, handL: READY.handL, handR: READY.handR, sq: .25 * kick(t, 46.85, 8) });
      const pat = on(t, 47.3, 48.1, .15);
      if (t > 47.3) {
        o.handL = mix(o.handL, [-1.7, -22.5 + .6 * Math.sin(t * 22)], pat); o.handR = mix(o.handR, [1.7, -22.5 + .6 * Math.sin(t * 22 + 1)], pat);
        Object.assign(o, { handPoseL: 'open', handPoseR: 'open', eyes: 'wide', brows: 'worried', mouth: 'O', emote: '!', emoteK: on(t, 47.45, 48.1, .1), lookY: -.8, dy: .6 });
      }
      if (t > 48.1) Object.assign(o, { lookX: -.9, lookY: .1, turn: -.35, mouth: 'O', emote: null });            // sees his hat in the net (screen-right)
      const back = ease(seg(t, 48.4, 49.1)); z = JFZ - 120 * back; x = -60 * back;
      if (t > 48.4) Object.assign(o, { lean: .12 * Math.sin(Math.PI * back), handL: [-4.8, -15], handR: [4.8, -15], footL: [-1.6, -.85 - 1.5 * Math.abs(Math.sin(t * 14)) * (1 - back)], eyes: 'wide', mouth: 'teeth' });
      const sit = ease(seg(t, 48.95, 49.25));
      if (sit > 0) {
        const flail = Math.sin(t * 9) * (t < 56.8 ? 1 : 0);
        o = blend(o, { ...base, dy: 7.2, footL: [-3.4, -.85], footR: [3.4, -.85], handL: [-4.6 + .8 * flail, -14 - 1.5 * flail], handR: [4.6 - .8 * flail, -14 + 1.5 * flail],
          eyes: 'squeeze', mouth: 'wobble', brows: 'worried', noHat: true, turn: 0, lookX: 0 }, sit);
        o.sq = .25 * kick(t, 49.25, 7); o.noHat = true;
        if (t > 50.3) Object.assign(o, { eyes: 'open', mouth: 'frown' });
        drape = ease(seg(t, 49.1, 49.4));
      }
      if (t >= TH) hat = hatAt(t);
      return { x, z, o, hat, drape };
    }
    // finale: sitting tangled; Housam tosses his hat back on; the catchphrase; the ball lands on the hat
    x = -60; z = lerp(JFZ - 120, JFZ - 20, ease(seg(t, 58.4, 59.1)));
    const stand = ease(seg(t, 58.4, 59.0)), hatOn = t >= 59.72;
    o = blend({ ...base, dy: 7.2, footL: [-3.4, -.85], footR: [3.4, -.85], handL: [-4.6, -14], handR: [4.6, -14], eyes: 'open', mouth: 'frown', brows: 'worried' },
      { ...base, brows: 'up', mouth: 'smile', turn: -.15, lookX: .6 }, stand);
    o.noHat = !hatOn; drape = 1 - ease(seg(t, 58.5, 59.0));
    if (t > 57.3 && t < 58.4) Object.assign(o, { lookX: .7, turn: -.2, mouth: 'o' });                                    // Housam arrives (screen-left)
    if (t > 59.2 && !hatOn) Object.assign(o, { lookY: -.8, eyes: 'wide', mouth: 'o' });
    if (hatOn) Object.assign(o, { sq: .2 * kick(t, 59.72, 8), hatSway: [0, .8 * boing(t, 59.72, 2.5, 4)], eyes: t < 60 ? 'happy' : 'open', turn: 0, lookX: 0 });
    if (t >= 60 && t < 61.0) {                                                                                          // the catchphrase shrug
      const sh = ease(seg(t, 60.1, 60.4));
      Object.assign(o, { handL: mix(JF_REST.handL, [-4.4, -13.4], sh), handR: mix(JF_REST.handR, [4.4, -13.4], sh), tilt: .12 * sh, brows: 'worried', mouth: lipFlap(t, talk, 'smirk') });
    }
    if (t >= 61.0) {
      const sh = 1 - ease(seg(t, 61.9, 62.2)), landed = t >= 61.7, proud = t > 62.2;
      Object.assign(o, { handL: mix(JF_REST.handL, [-4.4, -13.4], sh), handR: mix(proud ? [3.7, -12.8] : JF_REST.handR, [4.4, -13.4], sh), tilt: .12 * sh * (landed ? 0 : 1),
        brows: landed ? 'up' : 'worried', mouth: talk ? lipFlap(t, talk, 'smirk') : landed ? (proud ? 'grin' : 'o') : 'smirk', lookY: t > 61.2 && !proud ? -1 : 0,
        eyes: proud ? (t > 62.7 ? 'wink' : 'happy') : landed ? 'wide' : 'open', handPoseR: proud ? 'thumb' : 'open',
        hatSway: [0, landed ? .7 + .6 * boing(t, 61.7, 2.5, 4) : .8 * boing(t, 59.72, 2.5, 4)], dy: landed ? .4 * kick(t, 61.7, 6) : 0 });
    }
    return { x, z, o, hat: null, drape };
  }
  // The knocked-off hat: rides the ball into the top corner, then drops onto the floor of the net.
  const HAT_REST = W3(-300, 4, -150);
  function hatAt(t) {
    if (t < GOALS[2]) { const p = flight(FL3B, t); return { w: [p[0] + 6, p[1] - 18, p[2] + 10], rot: -(t - TH) * 16 }; }
    const f = seg(t, GOALS[2], GOALS[2] + .35), p0 = flight(FL3B, GOALS[2]);
    return { w: [lerp(p0[0] + 6, HAT_REST[0], f), lerp(p0[1] - 18, HAT_REST[1], f * f), lerp(p0[2] + 10, HAT_REST[2], f)], rot: lerp(-6.4, -3.3, easeOut(f)) };
  }

  // ---------- props drawn over the rigs ----------
  function glove(x, y, s) {                                                    // oversized goalkeeper mitt over a hand anchor
    const lw = 2.2;
    ellipse(x, y - .5 * s, 1.35 * s, 1.6 * s, { fill: '#A6D83E', stroke: PAL.ink, lwPx: lw });
    ellipse(x, y - .9 * s, .85 * s, .75 * s, { fill: '#C9EC6C', stroke: null });
    shape(rectPts(x - 1.05 * s, y + .75 * s, 2.1 * s, .75 * s), { fill: '#2B2B2E', stroke: PAL.ink, lwPx: lw });
    for (const dx of [-.45, .1, .6]) line([[x + dx * s, y - 2 * s], [x + dx * s, y - 1.35 * s]], { stroke: '#6E9A22', lwPx: 1.6 });
  }
  function pompom(x, y, r, col, t) {
    const p = []; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU + t * 3, q = i % 2 ? r * .72 : r * (1 + .08 * Math.sin(t * 20 + i)); p.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
    shape(p, { fill: col, stroke: PAL.ink, lwPx: 2 }); circle(x - r * .25, y - r * .25, r * .35, { fill: 'rgba(255,255,255,.45)', stroke: null });
  }
  // A patch of goal net draped over Fester (head to belly), jiggling while he struggles.
  function netDrape(A, s, k, t) {
    if (k < .01) return;
    const [hx, hy] = A.head, top = hy - 5.5 * s, bot = A.belly[1] + 2 * s, w = 7.5 * s, jig = Math.sin(t * 9) * .4 * s;
    const L = (u, v) => [hx + (u - .5) * 2 * w * (1 - .25 * v) + jig * (1 - v) * Math.sin(u * 7), lerp(top, bot, v) + 1.2 * s * Math.sin(u * Math.PI) * (1 - v) + (1 - k) * 12 * s];
    X.save(); X.globalAlpha = k;
    const edge = []; for (let i = 0; i <= 10; i++) edge.push(L(i / 10, 0)); for (let i = 0; i <= 10; i++) edge.push(L(1, i / 10)); for (let i = 10; i >= 0; i--) edge.push(L(i / 10, 1)); for (let i = 10; i >= 0; i--) edge.push(L(0, i / 10));
    shape(edge, { fill: 'rgba(255,255,255,.12)', stroke: null });
    for (let i = 0; i <= 12; i++) line(Array.from({ length: 9 }, (_, j) => L(i / 12, j / 8)), { stroke: 'rgba(255,255,255,.85)', lwPx: 1.4, smooth: true });
    for (let j = 0; j <= 8; j++) line(Array.from({ length: 13 }, (_, i) => L(i / 12, j / 8)), { stroke: 'rgba(255,255,255,.85)', lwPx: 1.4, smooth: true });
    X.restore();
  }
  // Housam's math vision: a dashed trajectory out toward the top corner, the launch angle, a formula.
  function mathVision(t, bx, by, s) {
    const k = on(t, 42.35, 45.3, .35); if (k < .01) return;
    const grow = ease(seg(t, 42.4, 43.6)), col = '#8FE3FF', glow = 'rgba(143,227,255,.55)';
    overlay(() => {
      X.save(); X.globalAlpha = k; X.shadowColor = glow; X.shadowBlur = 16;
      const end = [bx - 16 * s, by - 40 * s], ctrl = [bx - 3 * s, by - 44 * s], pts = [];
      for (let i = 0; i <= 30 * grow; i++) { const u = i / 30; pts.push([lerp(lerp(bx, ctrl[0], u), lerp(ctrl[0], end[0], u), u), lerp(lerp(by, ctrl[1], u), lerp(ctrl[1], end[1], u), u)]); }
      X.setLineDash([22, 16]); X.lineDashOffset = -t * 90;
      if (pts.length > 1) line(pts, { stroke: col, lwPx: 9 });
      line([[bx, by], [bx - 11 * s * grow, by]], { stroke: col, lwPx: 5 });
      X.setLineDash([]);
      const a0 = Math.PI, a1 = Math.PI + Math.atan2(ctrl[1] - by, bx - ctrl[0]) * -1, r = 5 * s;       // the angle wedge
      X.beginPath(); X.moveTo(bx, by); X.arc(bx, by, r, Math.min(a0, a1), Math.max(a0, a1)); X.closePath(); X.fillStyle = 'rgba(143,227,255,.3)'; X.fill(); X.strokeStyle = col; X.lineWidth = 6; X.stroke();
      X.shadowBlur = 0; X.font = `700 ${Math.round(3.6 * s)}px ${FONT_TALK}`; X.textAlign = 'right'; X.textBaseline = 'middle';
      X.globalAlpha = k * ease(seg(t, 43.0, 43.4));
      X.lineWidth = 10; X.strokeStyle = '#123040'; X.strokeText('θ = 27°', bx - r - 1 * s, by - 3.2 * s); X.fillStyle = col; X.fillText('θ = 27°', bx - r - 1 * s, by - 3.2 * s);
      X.globalAlpha = k * ease(seg(t, 43.6, 44.0)); X.font = `700 ${Math.round(2.7 * s)}px ${FONT_TALK}`; X.textAlign = 'center';
      const fx = ctrl[0] - 5 * s, fy = ctrl[1] + 6 * s;
      X.strokeText('v ≈ 24 m/s', fx, fy); X.fillText('v ≈ 24 m/s', fx, fy);
      X.restore();
    });
  }

  // ---------- cameras ----------
  // Keeper's POV: telephoto on Housam, his feet locked to screen y `feet`.
  const pov = (zc, f, feet, x = 0, y = 120, hz = HOU.z) => ({ x, y, z: zc, f, hy: feet - y * f / (hz - zc), dir: 1 });
  // Reverse on the goal: Fester's goal line locked to screen y `feet`.
  const goalCam = (zc, f, feet, x = 0, y = 130) => ({ x, y, z: zc, f, hy: feet - y * f / (zc - JFZ), dir: -1 });
  const standsCam = t => { const z = 1470 + 30 * Math.sin(t * .15), f = 1300; return { x: -3785 + 25 * Math.sin(t * .2), y: 150, z, f, hy: 985 - 150 * f / (SAF.z - z), dir: 1 }; };

  // ---------- shots: Housam (POV) ----------
  function drawBallWorld(P, w, spin) { const [sx, sy, k] = P.p(...w); if (P.depth(w[2]) > 30) housamBall(sx, sy, HU * k, { radius: BR, spin }); }
  function housamShot(t, cam, blur, extra) {
    const P = persp(cam), h = housamPOV(t), o = setO(t);
    layer(() => F.back(P, t, { ...o, splitZ: h.z }), { blur });
    const [sx, sy, k] = P.p(HOU.x, 0, h.z), s = HU * k, spin = t * 7;
    const ballFront = h.ball.p && h.ball.z < 0, ballLocal = () => h.ball.p && housamBall(sx + h.ball.p[0] * s, sy + h.ball.p[1] * s, s, { radius: BR, spin });
    if (h.ball.p && !ballFront) ballLocal();
    const A = housam(sx, sy, s, { ...h.o, t });
    if (ballFront) ballLocal();
    F.front(P, t, { ...o, splitZ: h.z });
    if (h.ball.w) drawBallWorld(P, h.ball.w, spin);
    for (const l of LINES) {
      const age = t - l.at, c = { size: 50, maxW: 680, cps: l.cps, hold: l.hold, kind: l.kind, accent: PAL.crimson };
      if (l.speaker === 'housam') callout(l.text, A.mouth[0] + 2.2 * s, A.mouth[1] - .6 * s, age, { ...c, dx: 420, dy: -280 });
      else if (l.speaker === 'jester_fester') callout(l.text, W * .2, H + 60, age, { ...c, dx: 60, dy: -330, accent: PAL.plum });   // Fester is behind the camera
    }
    if (extra) extra(P, A, s, sx, sy, h);
  }
  const opening = t => {                                                       // crane: high over the lot → through the empty net
    const u = seg(t, 0, 4.6), y = lerp(2600, 150, ease(u)), z = lerp(-3300, -470, easeOut(u)), f = lerp(1100, 1500, ease(u));
    housamShot(t, { x: 0, y, z, f, hy: 560 - (y - 90) * f / (HOU.z - z), dir: 1 }, lerp(0, 1.2, u));
  };
  const trick1 = t => housamShot(t, pov(lerp(80, 140, seg(t, 16, C1)), 3200, 960), 2.4, (P, A, s, sx, sy, h) => {
    [18.2, 18.75, 19.3, 19.85, 20.55].forEach((tk, i) => { const b = path(tk, JUG1).p; sfx(['tap!', 'tap!', 'tap!', 'boing!', 'tap!'][i], sx + (b[0] + 5) * s, sy + (b[1] - 1) * s, 46, PAL.goldLt, t - tk, { life: .45 }); });
    sfx('WHAM!', sx + 11 * s, sy - 20 * s, 100, '#FF9A6B', t - K1, { life: .5, rot: .1 });
  });
  const trick2 = t => housamShot(t, pov(lerp(60, 120, seg(t, 28.6, C2)), 3200, 960, 0, 120, t < 32 ? HOU.z : lerp(HOU.z, HZ2, ease(seg(t, 32, 33.1))) * .35 + HOU.z * .65), 2.4, (P, A, s, sx, sy) => {
    sfx('FLICK!', sx - 14 * s, sy - 22 * s, 70, PAL.goldLt, t - 31.2, { life: .6, rot: -.1 });
    sfx('scoop!', sx + 6 * s, sy - 8 * s, 56, PAL.goldLt, t - K2, { life: .5 });
  });
  const trick3 = t => housamShot(t, pov(lerp(100, 260, ease(seg(t, 42, 45.4))), 3000, 975), lerp(2.4, 3.2, seg(t, 42, 45)), (P, A, s, sx, sy, h) => {
    if (h.ball.p) mathVision(t, sx + h.ball.p[0] * s, sy + h.ball.p[1] * s, s);
    sfx('WHOOSH!', sx - 8 * s, sy - 40 * s, 96, '#8FE3FF', t - K3, { life: .5, rot: -.12 });
  });

  // ---------- shots: Fester (reverse on the goal) ----------
  function goalShot(t, cam, blur, extra) {
    const P = persp(cam), f = festerPose(t), o = setO(t);
    const hz = f ? f.z : JFZ;
    layer(() => F.back(P, t, { ...o, splitZ: hz }), { blur });
    const items = [];
    if (f) items.push({ d: P.depth(f.z), draw: () => {
      const [sx, sy, k] = P.p(f.x, 0, f.z), s = U * k, A = jester(sx, sy, s, { ...f.o, t });
      for (const hd of [A.handL, A.handR]) glove(hd[0], hd[1], s);
      netDrape(A, s, f.drape || 0, t);
      Object.assign(items, { A, s });
    } });
    const bw = ballWorldAt(t);
    if (bw) items.push({ d: P.depth(bw[2]), draw: () => drawBallWorld(P, bw, t * 9) });
    if (f && f.hat) items.push({ d: P.depth(f.hat.w[2]), draw: () => { const [hx, hy, k] = P.p(...f.hat.w); jesterHat(hx, hy, U * k, { rot: f.hat.rot, t }); } });
    items.sort((a, b) => b.d - a.d).forEach(it => it.draw());
    F.front(P, t, { ...o, splitZ: hz });
    if (f) for (const l of LINES) if (l.speaker === 'jester_fester' && items.A) {
      const A = items.A, s = items.s;
      callout(l.text, A.mouth[0] - 1.4 * s, A.mouth[1] - .8 * s, t - l.at, { dx: -300, dy: -260, size: 50, maxW: 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: PAL.plum });
    }
    if (extra) extra(P, items.A, items.s);
  }
  // Which ball is in play (world coords) at time t, for the reverse shots.
  function ballWorldAt(t) {
    if (t >= K1 && t < 28) return flight(FL1, t);
    if (t >= K2 && t < 42) return flight(FL2, t);
    if (t >= K3 && t < 57) return ball3(t);
    return null;
  }
  const goalSfx = (P, t, tg, w) => { const [x, y] = P.p(...w); sfx('GOAL!', x + (x < W / 2 ? 260 : -260), y - 170, 150, PAL.goldLt, t - tg, { life: 1.6, rot: x < W / 2 ? -.08 : .08 }); };
  const keeperIntro = t => goalShot(t, goalCam(1000, 1850, 900, 20 * Math.sin(t * .3)), .6, (P, A, s) => {
    if (A) sfx('TA-DA!', A.head[0] - 12 * s, A.head[1] - 14 * s, 80, PAL.goldLt, t - 6.95, { life: .9, rot: -.08 });
    if (A && t > 9.8) [10.05, 10.3].forEach(tc => sfx('CLAP!', A.head[0] + 9 * s, A.head[1] - 2 * s, 56, PAL.goldLt, t - tc, { life: .35 }));
  });
  const goal1 = t => goalShot(t, goalCam(1000, 2100, 900, lerp(0, -40, seg(t, C1, 26))), .6, (P, A, s) => {
    goalSfx(P, t, GOALS[0], FL1.b);
    if (A) sfx('THUD!', A.belly[0], A.belly[1] - 4 * s, 70, '#FF9A6B', t - 21.95, { life: .5 });
  });
  const goal2 = t => goalShot(t, goalCam(1000, 2100, 900, lerp(-30, 20, seg(t, C2, 38.4))), .6, (P, A, s) => {
    goalSfx(P, t, GOALS[1], [0, 60, -40]);
    if (A) sfx('THUD!', A.belly[0], A.belly[1] - 4 * s, 70, '#FF9A6B', t - 33.95, { life: .5 });
  });
  const goal3 = t => {
    const [dx, dy] = shakeXY(t, 14 * kick(t, TH, 9) + 8 * kick(t, 49.25, 9));
    camBegin(W / 2 - dx, H / 2 - dy, 1, 0);
    goalShot(t, goalCam(1000, 2100, 900, lerp(0, -60, ease(seg(t, 47.2, 49.5)))), .6, (P, A, s) => {
      const [hx, hy] = P.p(...HIT); sfx('BONK!', hx + 190, hy - 120, 110, '#FF9A6B', t - TH, { life: .6, rot: .1 });
      goalSfx(P, t, GOALS[2], FL3B.b);
      if (A) sfx('TANGLED!', A.head[0] + 9 * s, A.head[1] - 9 * s, 64, PAL.goldLt, t - 49.3, { life: .9, rot: .08 });
    });
    camEnd();
  };

  // ---------- shots: the stands ----------
  function safadiPose(t) {
    const talk = speaking('safadi', t);
    const o = { turn: .15, lookX: .5, lookY: 0, brows: 'up', mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']),
      handL: [-4.4, -8.3], handR: [4.4, -8.3], handPoseL: 'open', handPoseR: 'open' };
    const clap = (a, b) => { const k = on(t, a, b, .2), c = Math.abs(Math.sin((t - a) * Math.PI * 2.6));
      o.handL = mix(o.handL, [-.8 - 1.4 * c, -13.2], k); o.handR = mix(o.handR, [.8 + 1.4 * c, -13.2], k); if (k > .5) o.handPoseL = o.handPoseR = 'palm'; };
    const fists = (a, b) => { const k = on(t, a, b, .25), bn = Math.abs(Math.sin((t - a) * 6)) * k;
      o.handL = mix(o.handL, [-5.2, -24.5], k); o.handR = mix(o.handR, [5.2, -24.5], k); if (k > .5) Object.assign(o, { handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin' }); o.jump = 1.2 * bn; };
    if (t < 16) {
      clap(11.2, 13.3);
      const magic = on(t, 13.4, 15.9, .3);
      o.handR = mix(o.handR, [5.6, -15.2], magic); if (magic > .5) Object.assign(o, { handPoseR: 'palm', power: .45 * magic, lookX: .7, eyes: t > 14.6 ? 'happy' : 'open' });
    } else if (t < 32) fists(26, 28.6);
    else if (t < 48) {
      fists(38.4, 38.9);
      const genius = on(t, 38.6, 41.8, .3);
      o.handR = mix(o.handR, [5.8, -21.4], genius); if (genius > .5) Object.assign(o, { handPoseR: 'point', brows: 'up', bulb: ease(seg(t, 39.3, 39.55)) * (1 - ease(seg(t, 41.4, 41.8))) });
    } else {
      const both = on(t, 52.9, 55.4, .3);
      o.handL = mix(o.handL, [-5.3, -12.4], both); o.handR = mix(o.handR, [5.3, -12.4], both);
      if (both > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', power: .35 * both });
      if (t > 55.6) { const lk = Math.abs(Math.sin((t - 55.6) * 9)); Object.assign(o, { eyes: 'happy', mouth: 'grin', dy: .3 * lk, handL: [-1.8, -9.6], handR: [1.8, -9.6], handPoseL: 'fist', handPoseR: 'fist', turn: -.2, lookX: -.6 }); }
    }
    return o;
  }
  function almaPose(t) {
    const talk = speaking('alma', t);
    let o = { turn: .1, lookX: .4, lookY: -.1, brows: 'up', mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']),
      handL: [-3.4, -4.9], handR: [3.4, -4.9], handPoseL: 'fist', handPoseR: 'fist', hairSwing: .1 * wob(t, .4) };
    if (t < 16) o = { ...o, ...almaDance(t, 'star jump', { bpm: 120, k: on(t, 11.3, 13.2, .3) }), mouth: lipFlap(t, talk, 'grin'), eyes: talk ? 'open' : 'happy' };
    else if (t < 32) o = { ...o, ...almaDance(t, 'star jump', { bpm: 120, k: on(t, 26, 28.6, .2) }), mouth: lipFlap(t, talk, 'O', ['O', 'open', 'O']), eyes: 'star' };
    else if (t < 48) o = { ...o, ...almaDance(t, 'disco', { bpm: 120, k: on(t, 38.5, 42, .4) }), mouth: 'grin', power: .6 * on(t, 38.8, 42, .4) };
    else {
      const giggle = Math.abs(Math.sin((t - 52.8) * 11));
      Object.assign(o, { eyes: t > 55.6 && talk ? 'open' : 'happy', mouth: talk ? o.mouth : giggle > .5 ? 'grin' : 'smile', dy: .15 * giggle, blush: 1,
        handL: [-1.2, -11.4], handR: [1.2, -11.4], handPoseL: 'fist', handPoseR: 'fist' });
      if (t > 55.5) { o.handR = [4.9, -13.4]; o.handPoseR = 'point'; o.lookX = .8; }
    }
    return o;
  }
  const stands = t => {
    const P = persp(standsCam(t)), o = setO(t);
    layer(() => F.back(P, t, { ...o, splitZ: ALM.z }), { blur: 1.8 });
    const put = (p, rig, unit, pose) => { const [sx, sy, k] = P.p(p.x, 0, p.z), s = unit * k; return { A: rig(sx, sy, s, { ...pose, t }), s }; };
    const sf = put(SAF, safadi, SAFADI_UNIT, safadiPose(t));
    const al = put(ALM, alma, ALMA_UNIT, almaPose(t));
    pompom(al.A.handL[0], al.A.handL[1], 2.3 * al.s, '#2F62A8', t); pompom(al.A.handR[0], al.A.handR[1], 2.3 * al.s, '#F6F6F0', t + 1);
    F.front(P, t, { ...o, splitZ: ALM.z });
    for (const l of LINES) {
      const age = t - l.at, c = { size: 50, maxW: 620, cps: l.cps, hold: l.hold, kind: l.kind, accent: PAL.crimson };
      if (l.speaker === 'safadi') callout(l.text, sf.A.mouth[0] + 1.6 * sf.s, sf.A.mouth[1] - .6 * sf.s, age, { ...c, dx: 230, dy: -250 });
      else if (l.speaker === 'alma') callout(l.text, al.A.mouth[0] - 1.2 * al.s, al.A.mouth[1] - .8 * al.s, age, { ...c, dx: -170, dy: -300 });
    }
  };

  // ---------- the scoreboard insert ----------
  const board = t => {
    const f = 1500, z = lerp(9330, 9380, seg(t, 51.4, 52.8)), P = persp({ x: 2100, y: 560, z, f, hy: 545 - 10 * f / (10500 - z), dir: 1 });
    F.back(P, t, setO(t, { cheer: 1 }));
    const [bx, by, k] = P.p(2100 + 190, 500, 10482);
    sfx('3!', bx + 150 * k, by - 120 * k, 130, '#FF5A3C', t - SCORE_AT[2], { life: 1.2, rot: .1 });
    if (t > SCORE_AT[2]) overlay(() => { const a = .35 * kick(t, SCORE_AT[2], 5); X.fillStyle = `rgba(255,236,170,${a})`; X.fillRect(0, 0, W, H); });
  };

  // ---------- finale: the two-shot at the goal ----------
  const finale = t => {
    const cam = goalCam(900, 2250, 960, lerp(150, 70, ease(seg(t, 57.3, 64)))), P = persp(cam), o = setO(t), f = festerPose(t);
    layer(() => F.back(P, t, { ...o, splitZ: f.z }), { blur: .6 });
    // Housam walks in from screen-left (world +X) holding the hat (right hand) and the ball (left hand)
    const hx = lerp(560, 185, ease(seg(t, 57.3, 58.4))), hz = 150, walking = t < 58.4, talkH = speaking('housam', t);
    const toss = on(t, 59.1, 59.6, .15), ballToss = on(t, 60.8, 61.3, .12), laugh = t > 61.8 ? Math.abs(Math.sin((t - 61.8) * 9)) : 0;
    const ho = { ...REST_POSE, ...(walking ? housamDribble((560 - hx) / 40, 1) : {}), turn: .25, lookX: .6, brows: 'up', mouth: lipFlap(t, talkH, 'smile', ['grin', 'open', 'smile', 'o']),
      handL: [-4.4, -11.5], handR: [4.9, -9.6], handPoseL: 'open', handPoseR: 'fist' };
    if (toss > 0) { ho.handR = mix(ho.handR, [5.4, -22], toss); ho.handPoseR = 'palm'; }
    if (ballToss > 0) { ho.handL = mix(ho.handL, [-3.6, -21], ballToss); ho.handPoseL = 'palm'; }
    if (laugh) Object.assign(ho, { eyes: 'happy', mouth: 'open', dy: .2 * laugh, turn: .1, handL: [-4.1, -14.1], handR: [4.1, -14.1] });
    const [fx, fy, fk] = P.p(f.x, 0, f.z), fs = U * fk, FA = jester(fx, fy, fs, { ...f.o, t });
    for (const hd of [FA.handL, FA.handR]) glove(hd[0], hd[1], fs);
    netDrape(FA, fs, f.drape, t);
    const [sx, sy, k] = P.p(hx, 0, hz), s = HU * k, HA = housam(sx, sy, s, { ...ho, t });
    F.front(P, t, { ...o, splitZ: f.z });
    // the hat: in Housam's hand → tossed in a spinning arc → onto Fester's head (then the rig draws it)
    if (t < 59.72) {
      const u = seg(t, 59.25, 59.72), from = [HA.handR[0] + 1.2 * s, HA.handR[1] + (toss > .5 ? -1.2 : 2.2) * s], to = FA.hatBase;
      const p = u <= 0 ? from : [lerp(from[0], to[0], u), lerp(from[1], to[1], u) - 260 * 4 * u * (1 - u)];
      jesterHat(p[0], p[1], fs, { rot: u <= 0 ? (toss > .5 ? -.5 : 2.6) : -.5 * (1 - u) + TAU * 2 * ease(u), t });   // carried upside down, dangling from his fist
    }
    // the ball: in his left hand → a lob onto the middle hat tip, where it balances
    {
      const u = seg(t, 61.0, 61.7), r = BR * s * .95, tip = FA.hatTip, from = [HA.handL[0] - .4 * s, HA.handL[1] - 1.9 * s];
      const rest = [tip[0], tip[1] - r * .78 + Math.sin(t * 8) * r * .04];
      const p = u <= 0 ? from : u < 1 ? [lerp(from[0], rest[0], u), lerp(from[1], rest[1], u) - 330 * 4 * u * (1 - u)] : rest;
      housamBall(p[0], p[1], s * .95, { radius: BR, spin: u < 1 ? t * 8 : .15 * boing(t, 61.7, 2.5, 4) });
      if (t >= 61.7) sfx('plip!', rest[0] + r * 3, rest[1] - r, 60, PAL.goldLt, t - 61.7, { life: .7, rot: .12 });
    }
    for (const l of LINES) {
      const age = t - l.at, c = { size: 50, maxW: 640, cps: l.cps, hold: l.hold, accent: PAL.crimson };
      if (l.speaker === 'housam') callout(l.text, HA.mouth[0] + 1.6 * s, HA.mouth[1] - .8 * s, age, { ...c, dx: 560, dy: -250 });
      else if (l.speaker === 'jester_fester') callout(l.text, FA.mouth[0] + 2.6 * fs, FA.mouth[1] - .4 * fs, age, { ...c, dx: 330, dy: -420, maxW: 560, accent: PAL.plum });
    }
    iris((FA.head[0] + HA.head[0]) / 2, (FA.head[1] + HA.head[1]) / 2 + 60, lerp(1900, 0, easeIn(seg(t, 63.0, 64))));
  };

  scene({ duration: 64, fps: 24, bpm: 120,                  // id, title, dialogue, music: see asset.js
    shots: [[0, opening], [5, keeperIntro], [11.2, stands], [16, trick1], [C1, goal1], [26, stands], [28.6, trick2], [C2, goal2],
      [38.4, stands], [42, trick3], [C3, goal3], [51.4, board], [52.8, stands], [57.3, finale]] });
})();
