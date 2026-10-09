// Scene 18: "Some Assembly Required". The DCES science room, after school (the Science room set, teacher view).
// Alma and Jenna bolt Robo-Safadi together on the floor in front of the demo bench; Housam and Danny drop by. Trick gets
// you broccoli, treat gets you candy. Everyone laughs, but the robot won't switch on. Housam rolls over the whiteboard:
// they built the hardware; it needs software, and making software is called programming. "Danny and I will help you!"
// "HOORAY!" The robot's eyes blip. Freeze. To be continued.
// Blocking (world units, left to right as the camera sees it): Danny (−420, 925), Housam (−330, 900) → by the board
// (−255, 945), rolling whiteboard (−110, 1010), Alma (175, 960), Robo-Safadi (240, 990), Jenna on a step stool (305, 1012).
// Every shot is a pure function of t.
(() => {
  const R = LOCATIONS.science_room, LINES = ASSETS.scene.scene18_some_assembly.dialogue;
  const ACCENT = { alma: '#994EC4', jenna: '#D0508E', housam: '#425DA0', danny: '#2E7D9A', safadi: PAL.crimson };

  // ---------- timing ----------
  const CLANKS = [.8, 1.6, 4.0], HEAD_ON = 7.4, WALK_D = [8.4, 10.9], WALK_H = [8.9, 11.5], BUMP = 9.9;
  const ARM_R = 28.2, ARM_L = 31.2, LAUGH = [33.8, 36.8], PRESS = 40.6, FLOP = 41.2;
  const TO_EASEL = [59.2, 60.4], FLIP = [60.2, 60.8], WIPES = [70.8, 84.6], HOORAY = 94.4, BLIP = 96.0, FREEZE = 96.8, END = 102;
  // the interruption: Safadi leans in at the door, Danny dashes over and shoves him back out, "It's a SECRET!", he leaves
  const INTR = [46.2, 59.2], SAF_IN = [46.3, 47.0], DASH = [51.9, 52.7], SHOVE = 52.8, SECRET = 53.6, LEAVE = [56.9, 57.7], BACK_D = [57.9, 59.0];

  // ---------- where everything is ----------
  const POS = { danny: [-420, 925], housam: [-330, 900], alma: [175, 960], jenna: [292, 1012], robot: [240, 990], easel: [-110, 1010], box: [430, 905], wrench: [120, 925] };
  const DOOR = [-515, 1232], GUARD = [-478, 1182];
  const D_PATH = [DOOR, [-492, 1188], POS.danny], H_PATH = [DOOR, [-470, 1170], POS.housam], E_PATH = [POS.housam, [-255, 945]];
  function along(pts, t, [a, b]) {
    const L = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; }
    const f = clamp(d / L[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), p: dist / 32, moving: t > a && t < b };
  }
  const AT = {
    danny: t => t < WALK_D[0] ? null : t < DASH[0] ? { ...along(D_PATH, t, WALK_D), fade: ease(seg(t, WALK_D[0], WALK_D[0] + .3)) }
      : t < BACK_D[0] ? along([POS.danny, GUARD], t, DASH) : along([GUARD, POS.danny], t, BACK_D),
    safadi: t => t < SAF_IN[0] || t > LEAVE[1] ? null : { x: kf(t, [[SAF_IN[0], -660], [SAF_IN[1], -545], [SHOVE - .05, -545], [SHOVE + .25, -568], [LEAVE[0], -568], [LEAVE[1], -720]]), z: 1232 },
    housam: t => t < WALK_H[0] ? null : t < TO_EASEL[0] ? { ...along(H_PATH, t, WALK_H), fade: ease(seg(t, WALK_H[0], WALK_H[0] + .3)) } : along(E_PATH, t, TO_EASEL),
    alma: () => ({ x: POS.alma[0], z: POS.alma[1] }),
    jenna: () => ({ x: POS.jenna[0], y: SA_STOOL_H, z: POS.jenna[1] }),
  };

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker; return who; };
  const SIDE = { safadi: -1.4, danny: -1, housam: -.65, alma: .45, jenna: .8, robot: .6 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.4, -.85, .85);
  const laughing = t => t > LAUGH[0] && t < LAUGH[1];
  const bounce = (t, f = 13, ph = 0) => Math.abs(Math.sin(t * f + ph));

  // ---------- Robo-Safadi (unpowered: eyes dark, no hum) ----------
  const REST_L = [-4.4, -8.6], REST_R = [4.4, -8.6], UP_L = [-5.8, -20.5], UP_R = [5.8, -20.5];
  function robotPose(t) {
    const o = { eyes: 'off', mouth: 'flat', hum: false, handL: REST_L, handR: REST_R, handPoseL: 'claw', handPoseR: 'claw', antenna: .25 };
    if (t > HEAD_ON) o.sq = .07 * boing(t, HEAD_ON, 4, 6), o.antenna = .25 + .6 * boing(t, HEAD_ON, 3, 4);
    if (t > ARM_R - .3 && t < FLOP) { o.handR = mixPt(REST_R, UP_R, backOut(seg(t, ARM_R - .3, ARM_R + .2))); if (t > ARM_R) o.broccoli = 'R'; }
    if (t > ARM_L - .3 && t < FLOP) { o.handL = mixPt(REST_L, UP_L, backOut(seg(t, ARM_L - .3, ARM_L + .2))); o.handPoseL = 'fist'; }
    if (t > PRESS && t < FLOP) o.glitch = .6;
    if (t >= FLOP) {                                                         // the flop: arms drop, the head sags, the antenna droops
      const b = boing(t, FLOP, 2.6, 4);
      Object.assign(o, { handL: [-3.8, -5.4 + .5 * b], handR: [3.8, -5.4 - .5 * b], handPoseL: 'open', handPoseR: 'open', tilt: .2 + .06 * b, lean: .05, dy: .35, antenna: .7 + .2 * b });
    }
    if (t > BLIP) {                                                          // a flicker of life
      const lit = (t > BLIP && t < BLIP + .12) || (t > BLIP + .3 && t < BLIP + .42) || t > BLIP + .6;
      Object.assign(o, { eyes: lit ? 'open' : 'off', antenna: lerp(.7, .05, backOut(seg(t, BLIP + .6, BLIP + .9))), tilt: lerp(.2, .06, ease(seg(t, BLIP + .6, BLIP + .9))), jump: .5 * kick(t, BLIP + .6, 8) });
    }
    return o;
  }
  // The head comes off at the neck until HEAD_ON: [x offset, lift] in world units while Jenna lowers it on.
  const headOff = t => [kf(t, [[0, 38], [5.4, 38], [6.9, 0]]), kf(t, [[0, 50], [5.4, 50], [6.5, 22], [7.2, 3], [HEAD_ON, 0]]) + (t < 5.4 ? 2 * Math.sin(t * 2.2) : 0)];
  function drawRobot(P, t) {
    const [rx, rz] = POS.robot, [sx, sy, k] = P.p(rx, 0, rz), s = ROBO_SAFADI_UNIT * k, pose = { ...robotPose(t), t };
    if (t >= HEAD_ON) return roboSafadi(sx, sy, s, pose);
    const neck = sy - 17.0 * s, [hx, hl] = headOff(t);
    X.save(); X.beginPath(); X.rect(-50, neck, W + 100, H + 100); X.clip(); roboSafadi(sx, sy, s, pose); X.restore();
    shape(rectPts(sx - 2.2 * s, neck - .5 * s, 4.4 * s, .9 * s), { fill: RS.metalDk, stroke: RS.ink, lwPx: clamp(s * .12, 1, 4) });      // the neck socket
    for (const [dx, col, ph] of [[-1, '#D9473F', 0], [1, '#3F7FD9', 1.7]]) line([[sx + dx * s, neck - .4 * s], [sx + dx * 1.6 * s, neck - 2 * s], [sx + dx * (1.2 + .3 * Math.sin(t * 3 + ph)) * s, neck - 3.2 * s]], { stroke: col, lwPx: clamp(s * .22, 1.2, 6), smooth: true });
    X.save(); X.translate(hx * k, -hl * k); X.beginPath(); X.rect(-50, -100, W + 100, neck + 100); X.clip();
    const A = roboSafadi(sx, sy, s, { ...pose, noShadow: true }); X.restore();
    return A;
  }
  // what the robot holds, and where it goes when he flops: the broccoli (right gripper) and Alma's lollipop (left)
  function fallY(t, y0) { const d = t - FLOP, g = 150, T1 = Math.sqrt(-y0 * 2 / g); return d < T1 ? y0 + .5 * g * d * d : -.4 - 2.4 * Math.max(0, Math.sin(Math.PI * clamp((d - T1) / .32))); }
  function robotProps(P, t, A, s) {
    const k = P.k(POS.robot[1]), sA = ALMA_UNIT * k, [sx, sy] = P.p(POS.robot[0], 0, POS.robot[1]), lw = clamp(s * .15, 1.6, 5.5) / s;
    if (t > ARM_L && t < FLOP) almaLollipop(A.handL[0] + .2 * s, A.handL[1] - .3 * s, sA, { ang: -.25 });
    if (t >= FLOP) {
      const d = t - FLOP, land = y0 => d > Math.sqrt(-y0 * 2 / 150);
      X.save(); X.translate(sx + lerp(6.2, 8.2, clamp(d * 2)) * s, sy + fallY(t, -21) * s); X.scale(s, s); X.rotate(land(-21) ? 1.45 : d * 7); rsBroccoli(0, 0, lw, t); X.restore();
      almaLollipop(sx + lerp(-6.0, -7.6, clamp(d * 2)) * s, sy + (fallY(t, -21) - .2) * s, sA, { ang: land(-21) ? -1.5 : -.25 - d * 8 });
    }
  }

  // ---------- poses ----------
  function almaPose(t, c) {
    const talk = speaking('alma', t), ls = lastLine(t, 'alma');
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('alma', ls), turn: .25 * Math.sign(lookAt('alma', ls)), brows: 'normal',
      handL: [-2.6, -7.6], handR: [2.6, -7.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < 8.4) {                                                            // ratcheting a bolt on the robot's hip
      const r = CLANKS.reduce((a, c0) => a + kick(t, c0, 7), 0);
      set({ handR: [6.0 + .4 * r, -10.4 - .9 * r], handPoseR: 'fist', lean: .08, lookX: .5, lookY: .25, turn: .3, brows: 'focused', mouth: talk ? o.mouth : 'smirk' });
      if (t > 2.6 && t < 5.4) set({ lookX: .8, lookY: -.55, handL: [-3.8, -14.5], handPoseL: 'palm', brows: 'up' });
      if (t > HEAD_ON) set({ eyes: 'happy', mouth: 'grin', handL: [-4.4, -18.4], handPoseL: 'fist', jump: .6 * kick(t, HEAD_ON, 6), brows: 'up' });
    } else if (t < 17.0) {
      set({ lookX: -.85, turn: -.4, brows: 'up' });
      if (t > 8.8 && t < 11.8) set({ emote: '!', emoteK: on(t, 8.9, 10.4, .15), eyes: 'wide' });
    } else if (t < 25.4) {
      if (t < 20.2) set({ handL: [-4.4, -14], handPoseL: 'palm', handR: [5.0, -12.5], handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: -.6 });
      else if (t < 22.6) set({ handR: [6.0, -17.5], handPoseR: 'palm', handL: [-3.8, -17.5], handPoseL: 'palm', eyes: 'happy', mouth: 'grin', jump: .9 * kick(t, 20.5, 5), lookX: .4 });
      else set({ lookX: -.8, turn: -.35 });
    } else if (t < 33.6) {
      if (t < 27.8) set({ handL: [-3.6, -18.4 + .4 * Math.sin(t * 9)], handR: [3.6, -18.4 - .4 * Math.sin(t * 9)], handPoseL: 'open', handPoseR: 'open', eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'O', lookX: -.5 });
      else if (t < 31.0) set({ lookX: .85, turn: .4, mouth: 'grin', eyes: t > ARM_R + .3 ? 'happy' : 'open' });
      else {                                                                  // the lollipop into the left gripper
        const tgt = c.RA ? c.local(c.RA.handL) : [6, -18], u = ease(seg(t, 30.9, ARM_L)) * (1 - ease(seg(t, 32.2, 32.8)));
        set({ handR: mixPt([3.6, -13], tgt, u), handPoseR: 'fist', lookX: .7, turn: .3, eyes: 'happy', mouth: talk ? o.mouth : 'grin' });
      }
    } else if (t < 37.0) {
      if (laughing(t)) set({ eyes: 'happy', mouth: 'open', handL: [-1.2, -9.4], handR: [1.2, -9.4], handPoseL: 'fist', handPoseR: 'fist', dy: .3 * bounce(t), tilt: -.1 + .05 * Math.sin(t * 9), lookX: 0 });
    } else if (t < 44.8) {
      if (t < 39.2) set({ lookX: -.85, turn: -.4, brows: 'worried', mouth: 'o' });
      else if (t < FLOP) {                                                    // poke the status panel on his chest
        const tgt = c.RA ? c.local(c.RA.chest) : [6, -15], u = ease(seg(t, 39.6, 40.4)), p = kick(t, PRESS, 9);
        set({ handR: mixPt([3.4, -13], [tgt[0] - 1.4 + .9 * p, tgt[1]], u), handPoseR: 'point', lookX: .7, lookY: .1, turn: .3, brows: 'up', mouth: talk ? o.mouth : 'smirk' });
      } else set({ eyes: t < 42.0 ? 'wide' : 'open', mouth: talk ? o.mouth : 'o', brows: 'worried', handL: [-1.0, -12.6], handR: [1.0, -12.6], handPoseL: 'fist', handPoseR: 'fist', lookX: .7, jump: .5 * kick(t, FLOP, 7), emote: '?', emoteK: on(t, 42.6, 44.6, .15) });
    } else if (t < 81.0) {
      set({ lookX: -.85, turn: -.4 });
      if (t > 69.0 && t < 71.0) set({ tilt: .14, brows: 'up', emote: '?', emoteK: on(t, 69.1, 70.9, .15) });
      if (t > 78.5) set({ brows: 'worried', mouth: 'flat', lookY: .2 });
    } else if (t < 94.2) {
      const w = ease(seg(t, 81.0, 82.0)) * (1 - ease(seg(t, 88.6, 89.2)));
      set({ dy: .5 * w, lookY: .45 * w, tilt: .1 * w, brows: 'worried', mouth: talk ? o.mouth : 'wobble', handL: [-1.0, -7.8], handR: [1.0, -7.8], handPoseL: 'fist', handPoseR: 'fist', lookX: -.85 * (1 - w) + .1 * w });
      if (t > 89.2) set({ brows: 'up', eyes: t > 91.4 ? 'happy' : 'wide', mouth: 'grin', lookX: -.8, turn: -.4, handL: [-2.6, -7.6], handR: [2.6, -7.6] });
    } else {                                                                  // HOORAY!
      set({ handL: [-4.4, -19], handR: [4.4, -19], handPoseL: 'palm', handPoseR: 'palm', eyes: 'star', mouth: talk ? o.mouth : 'grin', jump: 2.2 * Math.sin(Math.PI * seg(t, 94.5, 95.1)) + 1.2 * Math.sin(Math.PI * seg(t, 95.2, 95.7)), lookX: 0, turn: 0 });
    }
    return o;
  }
  function jennaPose(t, c) {
    const talk = speaking('jenna', t), ls = lastLine(t, 'jenna'), sc = JENNA_SCALE;
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('jenna', ls), turn: .25 * Math.sign(lookAt('jenna', ls)), brows: 'normal',
      handL: [-2.2, -8.4], handR: [2.2, -8.4], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < HEAD_ON) {                                                        // holding the head over the neck, lowering it on
      const h = c.RA?.head, l = h ? c.local([h[0] + 5.2 * c.sR, h[1] + 2.8 * c.sR], sc) : [-4, -14], r = h ? c.local([h[0] + 5.6 * c.sR, h[1] - 2.2 * c.sR], sc) : [-3, -18];
      set({ handL: l, handR: r, handPoseL: 'palm', handPoseR: 'palm', lookX: -.7, lookY: .45, turn: -.35, lean: -.06, brows: 'focused', mouth: talk ? o.mouth : 'smirk' });
      if (t > 5.4) set({ brows: 'up', mouth: talk ? o.mouth : 'O', eyes: 'wide' });
    } else if (t < 8.4) set({ handL: [-3.8, -18.5], handR: [3.8, -18.5], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: .4 * kick(t, HEAD_ON + .1, 7) });
    else if (t < 17.0) set({ lookX: -.9, turn: -.45, brows: 'up' });
    else if (t < 25.4) {
      if (t > 20.2 && t < 22.6) set({ handL: [-5.0, -16.5], handPoseL: 'palm', handR: [4.2, -19.5], handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .6 * kick(t, 20.5, 5), lookX: -.4 });
      if (t > 22.6) set({ lookX: -.9, turn: -.45 });
    } else if (t < 33.6) {
      if (t < 27.8) set({ handL: [-3.4, -18.2 - .4 * Math.sin(t * 9)], handR: [3.4, -18.2 + .4 * Math.sin(t * 9)], eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'O', lookX: -.6 });
      else if (t < 31.0) {                                                    // lifting the robot's arm: broccoli!
        const tgt = c.RA ? c.local(c.RA.handR, sc) : [-5, -19], u = ease(seg(t, 27.8, ARM_R - .2)) * (1 - ease(seg(t, 29.8, 30.4)));
        set({ handL: mixPt([-2.6, -12], tgt, u), handPoseL: 'fist', handR: [3.2, -16], handPoseR: 'point', lookX: -.6, turn: -.3, eyes: t > ARM_R + .2 && !talk ? 'happy' : 'open', mouth: talk ? o.mouth : 'grin' });
      } else set({ lookX: -.85, turn: -.4, mouth: 'grin' });
    } else if (t < 37.0) {
      if (laughing(t)) set({ eyes: 'happy', mouth: 'open', handL: [-.7, -12.6], handR: [.7, -12.6], handPoseL: 'fist', handPoseR: 'fist', dy: .25 * bounce(t, 13, 1), tilt: .08 * Math.sin(t * 9) });
    } else if (t < 44.8) {
      if (t < 41.2) set({ lookX: t < 39.2 ? -.9 : -.5, lookY: t < 39.2 ? 0 : .2, brows: 'worried', mouth: 'o' });
      else set({ handL: [-4.0, -12.2], handR: [4.0, -12.2], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', eyes: t < 41.8 ? 'wide' : 'open', mouth: talk ? o.mouth : 'frown', lookX: -.5, lean: .04, jump: .3 * kick(t, FLOP, 7) });
    } else if (t < 94.2) {
      set({ lookX: -.9, turn: -.45 });
      if (t > 69.0 && t < 71.0) set({ tilt: -.14, brows: 'up' });
      if (t > 81.0 && t < 88.6) set({ lookX: -.6, brows: 'worried', mouth: 'flat' });
      if (t > 89.2) set({ eyes: t > 91.4 ? 'happy' : 'wide', mouth: 'grin', brows: 'up' });
    } else set({ handL: [-4.2, -20], handR: [4.4, -20], handPoseL: 'palm', handPoseR: 'palm', eyes: 'star', mouth: talk ? o.mouth : 'grin', jump: 1.6 * Math.sin(Math.PI * seg(t, 94.55, 95.1)) + 1.0 * Math.sin(Math.PI * seg(t, 95.25, 95.75)), lookX: 0 });
    return o;
  }
  function housamPose(t, c) {
    const talk = speaking('housam', t), ls = lastLine(t, 'housam'), at = c.at;
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('housam', ls), turn: .25 * Math.sign(lookAt('housam', ls)), brows: 'normal',
      handL: [-3.4, -10.4], handR: [3.4, -10.4], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (at.moving) return Object.assign(o, housamDribble(at.p, 1), { lookX: .7, turn: .3, mouth: talk ? o.mouth : 'smile', brows: 'up' });
    const atBoard = t > TO_EASEL[1];
    if (t < 17.0) {
      if (t > 11.8 && t < 14.2) set({ handR: [4.8, -22], handPoseR: 'palm', handL: [-4.4, -15], handPoseL: 'palm', eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'O', jump: .5 * kick(t, 11.9, 6), lookX: .8 });
      if (t > 14.2) set({ lookX: -.6, turn: -.3 });
    } else if (t < 33.6) {
      set({ lookX: .85, turn: .4 });
      if (t > 22.8 && t < 25.4) set({ handR: [5.2, -15.5], handPoseR: 'palm', brows: 'up', mouth: talk ? o.mouth : 'grin' });
      if (t > 28.4 && t < 33.6) set({ mouth: 'grin', eyes: t > 31.4 ? 'happy' : 'open' });
    } else if (t < TO_EASEL[0]) {
      if (laughing(t)) set({ eyes: 'happy', mouth: 'open', handL: [-4.1, -14.1], handR: [4.1, -14.1], tilt: -.12, dy: .2 * bounce(t, 10) });
      else if (t > 41.4) set({ handR: [1.1, -21.2], handPoseR: 'fist', handL: [-3.6, -11.8], brows: 'focused', mouth: 'flat', lookX: .7, lookY: -.3, tilt: .08 });
      else set({ lookX: .8, turn: .35, brows: t > FLOP ? 'up' : 'normal' });
      if (t > 45.0) set({ handR: [4.1, -24], handPoseR: 'point', eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'grin', jump: .6 * kick(t, 45.0, 6), lookX: .3 });
    } else if (atBoard) {                                                     // at the board, marker in hand
      const g = Math.sin(t * 2.1);
      set({ handR: [6.2 + .3 * g, -17.5 + .6 * Math.sin(t * 1.3)], handPoseR: 'fist', handL: [-4.0, -12 + .5 * g], handPoseL: 'palm', lookX: talk ? -.25 : .7, turn: talk ? -.1 : .35, brows: 'up' });
      if (t > 60.4 && t < 61.0) set({ handR: [6.6, -19], lookX: .8 });                       // spinning the board over
      if (t > 69.0 && t < 71.0) set({ lookX: .85, mouth: 'grin', tilt: .06 });
      if (t > 71.2 && t < 80.6 && talk) set({ handL: [-4.8, -17 + 1.2 * Math.sin(t * 3)], handPoseL: 'palm' });
      if (t > 81.2 && t < 84.8) set({ lookX: .9, turn: .4, brows: 'worried', mouth: talk ? o.mouth : 'smile', handR: [4.0, -12] });
      if (t > 88.6 && t < 91.4) set({ handL: [-1.4, -15.4], handPoseL: 'palm', lookX: .8, turn: .35, mouth: talk ? o.mouth : 'grin' });
      if (t > 91.4 && t < 94.2) set({ handR: [4.6, -23], handPoseR: 'fist', jump: .7 * kick(t, 91.5, 6), mouth: talk ? o.mouth : 'grin', eyes: talk ? 'open' : 'happy', lookX: .5 });
      if (t > HOORAY) set({ handL: [-4.7, -24], handR: [4.7, -24], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', lookX: .6 });
    }
    return o;
  }
  function dannyPose(t, c) {
    const talk = speaking('danny', t), ls = lastLine(t, 'danny'), at = c.at;
    const o = { mouth: lipFlap(t, talk, 'grin'), lookX: lookAt('danny', ls), turn: .25 * Math.sign(lookAt('danny', ls)), brows: 'normal',
      handL: [-3.4, -10.2], handR: [3.4, -10.2], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (at.moving) {
      Object.assign(o, dannyDribble(at.p, 1), { lookX: .6, turn: .3, mouth: 'grin' });
      if (t > BUMP - .1 && t < BUMP + .9) set({ eyes: 'wide', mouth: 'O', brows: 'up', lookX: -.7, turn: -.4, handL: [-4.3, -15], handR: [4.3, -15], handPoseL: 'palm', handPoseR: 'palm', jump: 1.4 * kick(t, BUMP, 6) });
      return o;
    }
    if (t < 17.0) {
      if (t > 14.4 && t < 17.0) set({ eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'O', handL: [-4.3, -14], handR: [4.3, -14], handPoseL: 'palm', handPoseR: 'palm', jump: .5 * kick(t, 14.5, 6), lookX: .8, turn: .4 });
    } else if (t < 33.6) set({ lookX: .85, turn: .4, mouth: t > 28.4 ? 'grin' : 'smile' });
    else if (t < 37.0) { if (laughing(t)) set({ eyes: 'happy', mouth: 'open', handL: [-3.5, -12.1], handR: [3.5, -12.1], tilt: -.14, dy: .22 * bounce(t, 11, 2), rot: -.05 * Math.sin(t * 6) }); }
    else if (t < 44.8) {
      if (t < 39.4) set({ handR: [4.6, -14], handPoseR: 'palm', brows: 'up', lookX: .8, turn: .35, mouth: talk ? o.mouth : 'smile' });
      else set({ lookX: .8, turn: .35, brows: t > FLOP ? 'worried' : 'up', mouth: t > FLOP ? 'o' : 'smile' });
    } else if (t < 93.2) {
      set({ lookX: .6, turn: .3 });
      if (t > 69.0 && t < 71.0) set({ tilt: .14, brows: 'up', mouth: talk ? o.mouth : 'o' });
      if (t > 88.6) set({ lookX: .4, mouth: 'grin', brows: 'up' });
    } else if (t < HOORAY) set({ handR: [4.3, -19.3], handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .9 * kick(t, 93.3, 6), lookX: .5 });
    else set({ handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: 1.2 * bounce(t, 6) });
    return o;
  }
  // While Safadi is at the door, everyone's acting comes from here (it overrides the poses above).
  const HANDS = { alma: [[-2.6, -7.6], [2.6, -7.6]], jenna: [[-2.2, -8.4], [2.2, -8.4]], housam: [[-3.4, -10.4], [3.4, -10.4]], danny: [[-3.4, -10.2], [3.4, -10.2]] };
  function interrupt(name, t, c, o) {
    if (t < INTR[0] || t > INTR[1]) return o;
    const talk = speaking(name, t), [hl, hr] = HANDS[name], at = c.at;
    const p = { ...o, lookX: -.85, turn: -.4, lookY: 0, brows: 'up', mouth: 'o', eyes: 'open', tilt: 0, dy: 0, lean: 0, jump: 0, rot: 0, emote: null,
      handL: hl, handR: hr, handPoseL: 'open', handPoseR: 'open' };
    if (t < SHOVE) {                                                         // caught! the door opens and the professor peeks in
      Object.assign(p, { eyes: t < SAF_IN[1] + .4 ? 'wide' : 'open', jump: .5 * kick(t, SAF_IN[0] + .3, 7) });
      if (name !== 'danny' && t > 47.2) Object.assign(p, { handL: [-.7, hl[1] - 4.6], handR: [.7, hr[1] - 4.6], handPoseL: 'fist', handPoseR: 'fist', brows: 'worried' });
      if (name === 'housam' && t > 47.2) Object.assign(p, { handL: hl, handR: [1.2, -21.4], handPoseR: 'palm', mouth: 'flat' });
      if (name === 'danny' && t > 50.9) Object.assign(p, { brows: 'focused', mouth: 'flat', lookX: -.6, jump: .4 * kick(t, 51.2, 8) });
    } else if (t < SECRET) {
      if (name === 'danny') Object.assign(p, { handL: [-6.2, -14.5], handR: [-2.6, -14.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'focused', mouth: 'grin', rot: -.12 * kick(t, SHOVE, 5) });
      else Object.assign(p, { eyes: 'wide', mouth: 'O', jump: .4 * kick(t, SHOVE + .1, 7) });
    } else if (t < 55.4) {                                                   // "It's a SECRET!"
      const ph = { alma: 0, jenna: .5, housam: 1, danny: 1.5 }[name];
      Object.assign(p, { handL: [-4.4, -16 - (name === 'housam' ? 3 : 0)], handR: [4.4, -16 - (name === 'housam' ? 3 : 0)], handPoseL: 'palm', handPoseR: 'palm',
        mouth: talk ? lipFlap(t, true) : 'grin', eyes: talk ? 'squeeze' : 'happy', jump: .8 * kick(t, SECRET + .05 * ph, 6), lookX: -.85 });
    } else {                                                                 // he goes; phew
      Object.assign(p, { mouth: t > 57.9 ? 'grin' : 'smirk', eyes: t > 57.95 && t < 58.8 ? 'happy' : 'open', brows: 'up', dy: .2 * kick(t, 57.95, 4) });
      if (name === 'danny' && at.moving) Object.assign(p, dannyDribble(at.p, 1), { lookX: .6, turn: .3, mouth: 'grin' });
      else if (name === 'danny' && t > 55.4 && t < BACK_D[0]) Object.assign(p, { handL: [-3.6, -10], handR: [3.6, -10], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: 'smirk' });
      if (t > BACK_D[1]) Object.assign(p, { lookX: .7, turn: .3, eyes: 'open' });
    }
    if (talk) p.mouth = lipFlap(t, true);
    return p;
  }
  function safadiPose(t) {
    const talk = speaking('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: .85, turn: .45, brows: 'up', lean: .2, tilt: .12, handL: [-4.6, -15.5], handR: [3.4, -8.4], handPoseL: 'palm', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t > 47.0 && t < 50.2) set({ handR: [7.2, -19.5], handPoseR: 'point', mouth: talk ? o.mouth : 'smirk' });
    if (t > 50.4 && t < SHOVE) set({ brows: 'quizzical', handR: [5.4, -14.6], handPoseR: 'palm' });
    if (t > SHOVE - .05 && t < 55.4) set({ eyes: t < SHOVE + .35 ? 'squeeze' : 'wide', mouth: 'O', lean: -.15 + .1 * ease(seg(t, SHOVE + .3, SECRET)), tilt: -.08, handL: [-4.4, -13], handR: [4.4, -13], handPoseR: 'palm' });
    if (t > 55.4) set({ lean: 0, tilt: .1, brows: 'quizzical', handR: [1.4, -16.4], handPoseR: 'point', lookX: .5, mouth: talk ? o.mouth : 'flat', emote: '?', emoteK: on(t, 55.5, 57.5, .2) });
    if (t > LEAVE[0]) set({ turn: -.55, lookX: -.7, handL: [-5.0, -12.6], handR: [5.0, -12.6], handPoseL: 'palm', handPoseR: 'palm', tilt: -.06 });
    return o;
  }
  const CAST = {
    safadi: { pose: safadiPose, rig: safadi, unit: SAFADI_UNIT, clip: true },
    danny: { pose: (t, c) => interrupt('danny', t, c, dannyPose(t, c)), rig: danny, unit: DANNY_UNIT },
    housam: { pose: (t, c) => interrupt('housam', t, c, housamPose(t, c)), rig: housam, unit: HOUSAM_UNIT },
    alma: { pose: (t, c) => interrupt('alma', t, c, almaPose(t, c)), rig: alma, unit: ALMA_UNIT },
    jenna: { pose: (t, c) => interrupt('jenna', t, c, jennaPose(t, c)), rig: jenna, unit: JENNA_UNIT },
  };
  const HEADW = { alma: 6.8, jenna: 4.6, housam: 5.6, danny: 5.4, safadi: 6.6 };

  // things the cast hold: Alma's wrench, Housam's marker
  function held(name, t, A, s) {
    if (name === 'alma' && t < 17.0) { const r = CLANKS.reduce((a, c0) => a + kick(t, c0, 7), 0); saWrench(A.handR[0], A.handR[1], s / ALMA_UNIT, (t < 8.4 ? -.35 - .5 * r : 1.2)); }
    if (name === 'housam' && t > TO_EASEL[1]) { X.save(); X.translate(A.handR[0], A.handR[1]); X.rotate(-.9); shape(rectPts(-.4 * s, -2.6 * s, .8 * s, 2.8 * s), { fill: SA.marker, stroke: PAL.ink, lwPx: 2 }); shape(rectPts(-.4 * s, -2.6 * s, .8 * s, .7 * s), { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 2 }); X.restore(); }
  }

  // ---------- the boards ----------
  // the room's whiteboard: the girls' project notes
  function wallBoard(t) {
    saMarker('PROJECT: ROBO-SAFADI', 30, 52, 36, 1, '#D0508E');
    saMarker('Halloween in 6 days!!', 30, 104, 28, 1, '#994EC4');
    circle(590, 72, 34, { fill: null, stroke: '#E8661E', lwPx: 3 }); line([[590, 38], [596, 26]], { stroke: '#3E9A4E', lwPx: 3 });
    shape([[575, 62], [583, 62], [579, 54]], { fill: '#E8661E', stroke: null }); shape([[597, 62], [605, 62], [601, 54]], { fill: '#E8661E', stroke: null });
    line([[572, 84], [580, 90], [590, 84], [600, 90], [608, 84]], { stroke: '#E8661E', lwPx: 3 });
  }
  // the rolling whiteboard's front: the girls' blueprint
  function blueprint() {
    saMarker('ROBO-SAFADI', 115, 24, 20, 1, '#D0508E', 'center');
    const ink = { fill: null, stroke: '#D0508E', lwPx: 2 };
    shape(rectPts(28, 36, 46, 38), ink); shape(rectPts(36, 78, 30, 34), ink);
    for (const x of [44, 58]) line([[x, 112], [x, 128]], ink); line([[36, 84], [24, 104]], ink); line([[66, 84], [78, 104]], ink);
    circle(42, 52, 4, ink); circle(60, 52, 4, ink); line([[44, 64], [58, 64]], ink); line([[51, 36], [51, 28]], ink); circle(51, 26, 2.5, ink);
    ['head', 'arms', 'legs', 'bolts'].forEach((w, i) => { saMarker('✓', 104, 54 + i * 20, 15, 1, '#3E9A4E'); saMarker(w, 124, 54 + i * 20, 15, 1, '#994EC4'); });
  }
  // the back: Housam's lesson, three pages (each wiped clean before the next)
  const rv = (t, a, b) => ease(seg(t, a, b));
  function lesson(t) {
    const B = SA_BOARD;
    if (t < WIPES[0] + .25) {                                                 // page 1: HARDWARE + SOFTWARE
      const k1 = rv(t, 61.6, 63.0), ink = { fill: null, stroke: SA.marker, lwPx: 2.4 };
      X.save(); X.beginPath(); X.rect(0, 0, 18 + 80 * k1, B.h); X.clip();
      shape(rectPts(26, 22, 40, 32), ink); shape(rectPts(32, 58, 28, 34), ink); line([[40, 92], [40, 104]], ink); line([[52, 92], [52, 104]], ink);
      line([[32, 64], [22, 82]], ink); line([[60, 64], [70, 82]], ink); circle(38, 36, 3.5, ink); circle(54, 36, 3.5, ink); line([[40, 46], [52, 46]], ink);
      X.restore();
      saMarker('HARDWARE', 10, 122, 15, rv(t, 62.6, 63.6), SA.marker);
      saMarker('+', 94, 72, 30, rv(t, 65.2, 65.5), PAL.ink);
      saMarker('{ }', 132, 70, 36, rv(t, 65.4, 66.2), SA.green);
      saMarker('SOFTWARE', 124, 122, 15, rv(t, 66.0, 67.0), SA.green);
    } else if (t < WIPES[1] + .25) {                                          // page 2: software = knowledge: SENSE → THINK → ACT
      saMarker('SOFTWARE = KNOWLEDGE', 115, 26, 15, rv(t, 71.4, 73.2), SA.green, 'center');
      const pop = (a) => backOut(seg(t, a, a + .4));
      const k1 = pop(74.4), k2 = pop(76.6), k3 = pop(77.8);
      if (k1 > 0) { X.save(); X.translate(38, 66); X.scale(k1, k1); shape([[-18, 0], [0, -11], [18, 0], [0, 11]], { fill: '#FFFFFF', stroke: SA.marker, lwPx: 2.4, smooth: true }); circle(0, 0, 6, { fill: SA.marker, stroke: null }); X.restore(); }
      if (k2 > 0) { X.save(); X.translate(115, 64); X.scale(k2, k2); circle(0, -4, 14, { fill: '#FFF3A8', stroke: '#E8A23A', lwPx: 2.4 }); shape(rectPts(-6, 10, 12, 8), { fill: '#C9D1D6', stroke: '#8D979E', lwPx: 1.6 });
        for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .55; line([[Math.cos(a) * 18, -4 + Math.sin(a) * 18], [Math.cos(a) * 24, -4 + Math.sin(a) * 24]], { stroke: '#E8A23A', lwPx: 2 }); } X.restore(); }
      if (k3 > 0) { X.save(); X.translate(192, 66); X.scale(k3, k3); shape([[-6, 14], [-6, -2], [-14, -14], [-8, -16], [0, -6], [8, -16], [14, -14], [6, -2], [6, 14]], { fill: '#DCE3E7', stroke: SA.marker, lwPx: 2.4 }); X.restore(); }
      saMarker('→', 64, 74, 22, rv(t, 75.4, 75.8), PAL.ink); saMarker('→', 142, 74, 22, rv(t, 77.3, 77.7), PAL.ink);
      saMarker('SENSE', 38, 112, 13, rv(t, 74.6, 75.2), SA.marker, 'center'); saMarker('THINK', 115, 112, 13, rv(t, 76.8, 77.3), '#C97A1E', 'center'); saMarker('ACT', 192, 112, 13, rv(t, 78.0, 78.5), SA.red, 'center');
    } else {                                                                  // page 3: PROGRAMMING, and the robot's first program
      saMarker('PROGRAMMING', 115, 26, 19, rv(t, 85.2, 86.2), SA.red, 'center');
      const code = [['if (trick) {', 86.6, 87.3], ['  give(broccoli);', 87.3, 88.2], ['} else {', 88.2, 88.8], ['  give(candy);', 88.8, 89.6], ['}', 89.6, 89.8]];
      X.save(); code.forEach(([s, a, b], i) => { X.font = `700 13px ui-monospace, Menlo, monospace`; const k = rv(t, a, b), n = Math.round(s.length * k);
        X.fillStyle = i % 2 ? SA.green : SA.marker; X.textAlign = 'left'; X.fillText(s.slice(0, n), 34, 52 + i * 17); });
      X.restore();
    }
    for (const w of WIPES) if (t > w && t < w + .5) {                         // the eraser sweep
      const u = seg(t, w, w + .45); X.fillStyle = SA.board; X.fillRect(0, 0, B.w * Math.min(1, u * 1.15), B.h);
      shape(rectPts(B.w * u - 16, 20 + 50 * Math.sin(u * 9), 30, 18), { fill: '#3B4048', stroke: PAL.ink, lwPx: 1.4 });
    }
  }

  // the classroom door swung open onto the hallway (the set draws it closed): the hall, then the leaf hinged at the far jamb
  function openDoor(P, k) {
    const q = P.poly([[-560, 0, 1170], [-560, 0, 1290], [-560, 215, 1290], [-560, 215, 1170]]); if (!q) return;
    X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip();
    shape(q, { fill: linGrad(0, Math.min(...q.map(v => v[1])), 0, Math.max(...q.map(v => v[1])), [[0, '#F3EFE4'], [.72, '#E4DDCB'], [.73, '#BFB49A'], [1, '#A99D82']]), stroke: null });
    const a = k * 1.35, ex = -560 - Math.sin(a) * 120, ez = 1290 - Math.cos(a) * 120;
    const leaf = P.poly([[-560, 0, 1290], [ex, 0, ez], [ex, 215, ez], [-560, 215, 1290]]); if (leaf) shape(leaf, { fill: '#C98F5A', stroke: '#6B4A52', lwPx: 1.6 });
    X.restore();
  }

  // ---------- the whole stage, for a camera ----------
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {};
    const SET = { rows: 2, bubbling: 1, bones: t > BUMP ? kick(t, BUMP, 2.4) : 0, board: wallBoard };
    const RA = measure(() => drawRobot(P, t)), sR = ROBO_SAFADI_UNIT * P.k(POS.robot[1]);
    const actors = [];
    for (const [name, c] of Object.entries(CAST)) {
      const at = AT[name](t); if (!at || P.depth(at.z) < 60) continue;
      actors.push({ z: at.z, draw: () => {
        const [sx, sy, k] = P.p(at.x, at.y || 0, at.z), s = c.unit * k;
        const ctx = { RA, sR, at, local: (pt, sc = 1) => [(pt[0] - sx) / (s * sc), (pt[1] - sy) / (s * sc)] };
        const pose = { ...c.pose(t, ctx), t };
        if (o.freeze) pose.boil = 0;
        const draw = () => { A[name] = c.rig(sx, sy, s, pose); S[name] = s; held(name, t, A[name], s); };
        const f = at.fade ?? 1;
        if (c.clip) { const jx = P.p(-560, 0, 1170)[0]; X.save(); X.beginPath(); X.rect(jx, -200, W + 400, H + 400); X.clip(); draw(); X.restore(); }
        else if (f < .999) layer(draw, { filter: `opacity(${f.toFixed(3)})` }); else if (o.soft?.[name]) layer(draw, { blur: o.soft[name] }); else draw();
      } });
    }
    actors.push({ z: POS.robot[1], draw: () => { A.robot = drawRobot(P, t); S.robot = sR; robotProps(P, t, A.robot, sR); } });
    actors.push({ z: POS.jenna[1] + 6, draw: () => saStepStool(P, POS.jenna[0], POS.jenna[1]) });
    actors.push({ z: POS.easel[1], draw: () => saEasel(P, POS.easel[0], POS.easel[1], t, { flip: ease(seg(t, FLIP[0], FLIP[1])), front: blueprint, back: lesson }) });
    actors.push({ z: POS.box[1], draw: () => saPartsBox(P, POS.box[0], POS.box[1], t) });
    const dk = ease(seg(t, 46.0, SAF_IN[0] + .1)) * (1 - ease(seg(t, LEAVE[1], LEAVE[1] + .25)));
    if (dk > 0) actors.push({ z: 1292, draw: () => openDoor(P, dk) });
    if (t > 17.0) actors.push({ z: POS.wrench[1], draw: () => { const [sx, sy, k] = P.p(POS.wrench[0], 2, POS.wrench[1]); saWrench(sx, sy, k * .9, .12); } });
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => R.back(P, t, { ...SET, splitZ: actors[0].z }), { blur });
    actors.forEach((a, i) => { a.draw(); R.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z }); });
    return { A, S, P };
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const c = { size: o.size || 50, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W);
        if (ms.length) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.3 : 1.1), dx: o.groupDx ?? 0, dy: o.groupDy ?? -200 }); continue;
        }
      }
      const a = A[l.speaker], s = S[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 320), dy: o.dy ?? -220 });
      } else {                                                                // off-screen: from the frame edge on their side
        const sd = SIDE[l.speaker] > 0 ? 1 : -1;
        callout(l.text, sd > 0 ? W + 30 : -30, H * .4, age, { ...c, dx: -sd * 420, dy: -150 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const GROUP = cam(-70, 140, 520, 560, 900);                                    // everyone, the room behind
  const ASSY = cam(245, 150, 700, 540);                                     // the assembly: Alma, the robot, Jenna on her stool
  const DOORC = cam(-260, 150, 610, 560, 820);                              // the door, Mr. Bones, the workshop
  const BOYS = cam(-400, 125, 620, 600);                                    // Danny and Housam
  const GIRLS = cam(225, 140, 620, 560);                                    // the girls and the robot
  const BOARD = cam(-170, 140, 640, 570);                                   // Housam at the rolling whiteboard
  const ALMA_CU = cam(175, 118, 790, 520);
  const SAF_DOOR = cam(-490, 150, 975, 470);                               // the doorway, from beside the boys: Safadi peeks in
  const ROBO_CU = t => ({ x: 265, y: 172, z: lerp(820, 845, ease(seg(t, BLIP, FREEZE))), f: 1000, hy: 440, dir: 1 });
  const shot = (camFn, blur, bo, go) => t => { const { A, S, P } = stage(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S, P); };

  function opening(t) {                                                      // from the back of the room to the workshop
    const u = ease(seg(t, .2, 5.0)), a = { x: 0, y: 170, z: 60, f: 800, hy: 560 }, b = ASSY(t);
    const c = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u), dir: 1 };
    const { A, S, P } = stage(t, c, 1.2 * u); bubbles(t, A, S, { size: 48, side: n => n === 'alma' ? -1 : 1, far: 280 }); extras(t, A, S, P);
  }
  const door = shot(DOORC, .6, { size: 46, side: n => n === 'housam' || n === 'danny' ? 1 : -1, dy: -240 });
  const boys = shot(BOYS, 1.6, { size: 50, side: n => n === 'danny' ? -1 : 1 });
  const girls = shot(GIRLS, 1.6, { size: 50, side: n => n === 'alma' ? -1 : 1, far: 300 });
  const group = shot(GROUP, .8, { size: 48, side: n => n === 'danny' || n === 'housam' ? 1 : -1, far: 260, groupDy: -170 });
  const board = shot(BOARD, 1.4, { size: 46, side: () => -1, far: 220, dy: -260 });
  const almaCU = shot(ALMA_CU, 2.6, { size: 52, side: () => -1 });
  const safDoor = shot(SAF_DOOR, 1.2, { size: 48, side: n => n === 'safadi' ? 1 : -1, far: 260, dy: -230 });
  function tbc(t) {                                                          // the blip, the freeze, the card, the iris
    const tt = Math.min(t, FREEZE), { A, S, P } = stage(tt, ROBO_CU(tt), 2.4, { freeze: t > FREEZE, soft: { alma: 7, jenna: 3 } }); extras(tt, A, S, P);
    if (A.robot && tt > BLIP + .6) overlay(() => { const g = kick(tt, BLIP + .6, 3); for (const e of [A.robot.eyeL, A.robot.eyeR]) { X.save(); X.translate(e[0], e[1]); X.rotate(tt * 2); X.scale(g, g); X.shadowColor = '#7FE3FF'; X.shadowBlur = 30; shape(starPts(0, 0, 70, .14, 4), { fill: '#E9FBFF', stroke: null }); X.restore(); } });
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .45 * k; X.fillStyle = '#9FC4D8'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#F2FAFF', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#2F9BD8'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 100.2, 101.6))));
  }

  // things that ride on top of any shot
  function extras(t, A, S, P) {
    const a = A.alma, r = A.robot, d = A.danny;
    if (a && t < 8.4) for (const c0 of CLANKS) sfx('CLANK!', a.handR[0] + 9 * S.alma, a.handR[1] - 3 * S.alma, 48, '#DCE3E7', t - c0, { life: .5, rot: .1 });
    if (r) {
      sfx('CLUNK!', r.head[0] + 9 * S.robot, r.head[1] - 6 * S.robot, 70, '#FFD45A', t - HEAD_ON, { life: .8, rot: -.08 });
      sfx('bzzt...', r.chest[0] + 8 * S.robot, r.chest[1] - 2 * S.robot, 44, '#7FE3FF', t - PRESS, { life: .6 });
      sfx('CLONK!', r.footR[0] + 6 * S.robot, r.footR[1] - 4 * S.robot, 54, '#B9E07A', t - FLOP - .3, { life: .6, rot: .08 });
      sfx('blip?', r.antenna[0] + 6 * S.robot, r.antenna[1], 48, '#7FE3FF', t - BLIP - .6, { life: 1.4, rot: -.06 });
    }
    if (P.visible(1250)) { const [bx, by] = P.p(-440, 190, 1250); if (bx > 0 && bx < W) sfx('RATTLE!', bx, by, 52, '#F5EFDC', t - BUMP, { life: .8, rot: -.1 }); }
    if (t > 42.6 && t < 44.6 && A.jenna) sfx('?', A.jenna.head[0] + 6 * S.jenna, A.jenna.top[1] - 2 * S.jenna, 72, PAL.goldLt, t - 42.6, { life: 2 });
    if (t > 69.0 && t < 71.0 && d) sfx('?', d.head[0] + 6 * S.danny, d.top[1] - 2 * S.danny, 64, PAL.goldLt, t - 69.1, { life: 1.9 });
  }

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [8.4, door], [14.2, boys], [17.0, girls], [22.6, group], [25.4, girls], [33.6, group], [37.0, boys],
      [39.2, girls], [44.8, group], [46.2, safDoor], [53.4, group], [55.2, safDoor], [57.9, group], [61.0, board], [68.8, group], [71.0, board], [81.0, almaCU], [84.8, board], [88.4, group],
      [94.2, girls], [BLIP, tbc],
    ] });
})();
