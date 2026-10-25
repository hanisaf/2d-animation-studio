// Scene 34: "Game Over!". Straight after scene 33's "Busted!": the four kids huddle in Housam's bedroom and make a plan — "software
// only this time. Clawd can hop into any game!" Clawd pops out of the laptop, loops, and zooms out of the window. Ripple to the
// living room: the twins brag ("Robo Invasion is the perfect game!", "sports remind me of exercise!"), they laugh, and a tiny Clawd
// in each laptop turns the DIFFICULTY dial to SUPER HARD. The robots swarm the professor (GAME OVER); the little kids beat the doctor
// (KIDS WIN). "Impossible!" "Losing is not fun. Let us take a break." The kids drop in: "How did the research go?" "...space..."
// "...importance of sport!" "How about we all play board games?" "HOORAY!" Freeze. To be continued.
// Every shot is a pure function of t.
(() => {
  const HB = LOCATIONS.housam_bedroom, LR = LOCATIONS.living_room, LINES = ASSETS.scene.scene34_game_over.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: '#C08A3E', sami: '#3E9A8C' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, sami };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 7.6, sami: 7.6 };
  const WALK = { jenna: jennaSkip, danny: dannyDribble, housam: housamDribble, alma: almaSkip };
  const KIDS = ['jenna', 'danny', 'housam', 'alma'];

  // ---------- timing ----------
  const TO_DESK = 22.8, POP = 23.8, SALUTE = 38.3, ZOOM = [39.0, 41.4], RIPPLE = [41.4, 42.8];
  const SPARKLE = 43.0, LAUGH = 59.8, WINK = 62.0, ROBO0 = 64.2, SOCCER0 = 78.0;
  const REMATCH = 86.4, GAMEOVER2 = 89.6, SHUT = 95.3, LEAVE = 95.3, KNOCK = 96.5, WALK_IN = [96.9, 99.9];
  const HOORAY = 128.2, FREEZE = 130.8, END = 136.0;

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];

  // =====================================================================================================
  // ---------- part 1: Housam's bedroom ----------
  const BLAWN = { alma: [-150, 470], jenna: [-55, 505], danny: [45, 480], housam: [150, 445] };
  const DESK_SPOT = [205, 410];
  const B_SIDE = { alma: -1, jenna: -.3, danny: .3, housam: 1 };                 // screen position (bed view, +X = screen-right)
  const bLookAt = (me, who) => !who || who === me ? 0 : clamp((B_SIDE[who] - B_SIDE[me]) * 1.1, -.8, .8);
  const bAt = name => {
    if (name !== 'housam') return BLAWN[name];
    return null;                                                                 // Housam is handled with a time arg below
  };
  const housamAt = t => { const u = ease(seg(t, TO_DESK, TO_DESK + 1.0)); return [lerp(BLAWN.housam[0], DESK_SPOT[0], u), lerp(BLAWN.housam[1], DESK_SPOT[1], u)]; };

  function bedKidPose(name, t) {
    const talk = speaking(name, t), ph = { alma: 0, jenna: 1.3, danny: 2.6, housam: 3.9 }[name];
    const say = m => talk ? lipFlap(t, true, m) : m;
    const o = { giraffe: false, mouth: say('smile'), brows: 'normal', eyes: 'open', lookY: .08, lookX: .12 * Math.sin(t * .5 + ph),
      handL: [-3.2, -9.6], handR: [3.2, -9.6], handPoseL: 'open', handPoseR: 'open', turn: -B_SIDE[name] * .25 };
    const set = p => Object.assign(o, p);
    // everyone looks toward whoever is speaking
    const sp = LINES.find(l => !l.silentBubble && inW(t, l.at, l.at + l.text.replace(/\*/g, '').length / l.cps + l.hold) && KIDS.includes(l.speaker));
    if (sp) set({ lookX: bLookAt(name, sp.speaker) });
    if (name === 'alma' && t < 7.6) set({ handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist', brows: 'worried' });   // arms crossed, wary
    // the speaker gestures
    for (const l of LINES) { if (l.silentBubble || l.speaker !== name) continue; const age = t - l.at, dur = l.text.replace(/\*/g, '').length / l.cps + l.hold;
      if (age > 0 && age < dur) { set({ brows: 'up', mouth: say('talk') });
        if (name === 'alma' && l.text.startsWith('But')) set({ handR: [5.0, -14], handPoseR: 'palm', brows: 'worried' });
        if (name === 'danny') set({ handR: [5.0, -14.5], handPoseR: 'palm', brows: 'up', mouth: say('o') }); } }
    // "Yeah!"
    if (inW(t, 31.3, 32.8)) set({ handL: [-4, -16], handR: [4, -16], handPoseL: 'fist', handPoseR: 'fist', brows: 'up', mouth: say('O'), eyes: 'wide', jump: .9 * kick(t, 31.5 + .05 * ph, 6), lookY: -.1, lookX: 0 });
    return o;
  }

  function housamPose(t) {
    const talk = speaking('housam', t), say = m => talk ? lipFlap(t, true, m) : m;
    const o = { giraffe: false, mouth: say('smile'), brows: 'normal', eyes: 'open', lookY: .05, lookX: -.3,
      handL: [-3.2, -9.6], handR: [3.2, -9.6], handPoseL: 'open', handPoseR: 'open', turn: -.25 };
    const set = p => Object.assign(o, p);
    if (t < TO_DESK) {                                                           // in the huddle
      const sp = LINES.find(l => !l.silentBubble && inW(t, l.at, l.at + l.text.replace(/\*/g, '').length / l.cps + l.hold) && KIDS.includes(l.speaker));
      if (sp && sp.speaker !== 'housam') set({ lookX: bLookAt('housam', sp.speaker) });
      if (speaking('housam', t)) set({ brows: 'up', mouth: say('talk'), handR: [5.2, -14], handPoseR: 'palm', lookX: -.5 });
    } else if (inW(t, TO_DESK, POP + .4)) {                                       // slides to the desk, taps the laptop
      set({ turn: .4, lookX: .6, lookY: .3, mouth: 'smirk', brows: 'focused', handR: [5.0, -10.5], handPoseR: 'point' });
    } else if (inW(t, POP + .4, SALUTE)) {                                        // turns back to rally the others
      set({ turn: -.3, lookX: -.5, lookY: 0, brows: 'up', mouth: say('talk'), handR: [5.6, -17], handPoseR: 'fist' });
      if (inW(t, 27.0, 31.3)) set({ jump: .3 * kick(t, 27.2, 4), handR: [6.2, -22], handPoseR: 'fist' });
      if (inW(t, 31.3, 32.8)) set({ jump: .9 * kick(t, 31.5, 6), eyes: 'wide', mouth: say('O') });
      if (t > 34.5) { const r = Math.sin(t * 14); set({ mouth: 'grin', eyes: 'open', handL: [-1.4 + .5 * r, -13.8], handR: [1.4 - .5 * r, -14.0], handPoseL: 'fist', handPoseR: 'fist', turn: -.1, lookX: -.3, lookY: -.1 }); }   // rubbing hands
    } else {                                                                      // the salute, then watching Clawd fly off
      set({ turn: .2, lookX: .5, lookY: -.2, brows: 'up', mouth: 'grin', handR: [5.2, -18], handPoseR: 'palm' });
    }
    return o;
  }

  // Clawd: pops out of the laptop (world 287, 78, 410), rises and floats over the group, then flies to the window and out.
  const LAPTOP_W = [287, 78, 410], HOVER_W = [150, 185, 405], WINDOW_W = [-340, 180, 405];
  const clawdFly = uu => [lerp(HOVER_W[0], WINDOW_W[0], uu), lerp(HOVER_W[1], WINDOW_W[1], uu) - 44 * Math.sin(Math.PI * uu), lerp(HOVER_W[2], WINDOW_W[2], uu)];
  function clawdInBedroom(P, t) {
    if (t < POP || t > ZOOM[1]) return;
    let wx, wy, wz, pop = backOut(seg(t, POP, POP + .4)), holoK = 1, loop = 0;
    const flying = t > SALUTE;
    if (!flying) {                                                               // rise from the laptop to the hover point, do a loop
      const rise = ease(seg(t, POP, POP + .7)); loop = seg(t, POP + .9, POP + 1.9);
      wx = lerp(LAPTOP_W[0], HOVER_W[0], rise) + Math.sin(loop * TAU) * 30 * Math.sin(Math.PI * loop);
      wy = lerp(LAPTOP_W[1], HOVER_W[1], rise) + 8 * Math.sin(t * 4) - (loop > 0 && loop < 1 ? 40 * Math.sin(Math.PI * loop) : 0);
      wz = lerp(LAPTOP_W[2], HOVER_W[2], rise);
    } else { const u = ease(seg(t, SALUTE, ZOOM[1])); [wx, wy, wz] = clawdFly(u); holoK = 1 - seg(u, .8, 1); }
    const [sx, sy, k] = P.p(wx, wy, wz); if (k <= 0) return;
    const loopT = loop > 0 && loop < 1;
    if (flying) for (let i = 1; i <= 6; i++) { const uu = ease(seg(t - i * .05, SALUTE, ZOOM[1])), [tx, ty, tz] = clawdFly(uu);
      const [px, py, pk] = P.p(tx, ty, tz); shape(starPts(px, py, (7 - i) * pk * 1.6, .45, 5, (t - i * .05) * 5), { fill: rgba('#BFF4FF', .5 * (1 - i / 7) * holoK), stroke: null }); }
    clawd(sx, sy, CLAWD_UNIT * k * pop * 1.35, { t, noShadow: true, boil: 0, holo: holoK, eyes: t > POP + .4 && t < SALUTE ? 'spark' : flying ? 'happy' : 'look', lookY: 1,
      mouth: flying ? 'grin' : 'smile', rot: loopT ? TAU * loop : flying ? -.3 : 0, aL: flying ? 1.4 : .6, aR: flying ? 1.4 : .6, bounce: .3 });
    if (t > POP && t < POP + .6) sfx('bip!', sx + 2 * CLAWD_UNIT * k, sy - 3 * CLAWD_UNIT * k, 40, '#BFF4FF', t - POP, { life: .6 });
  }

  function bedStage(t, camo, blur) {
    const P = persp(camo), A = {}, S = {};
    const actors = KIDS.map(n => { const [x, z] = n === 'housam' ? housamAt(t) : BLAWN[n]; return { n, x, z }; }).filter(a => P.depth(a.z) > 40).sort((p, q) => P.depth(q.z) - P.depth(p.z));
    layer(() => HB.back(P, t, { splitZ: actors.length ? actors[0].z : 9999, lamp: .6, laptop: true }), { blur });
    actors.forEach((a, i) => {
      const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[a.n] * k;
      const walking = a.n === 'housam' && inW(t, TO_DESK, TO_DESK + 1.0);
      const pose = a.n === 'housam' ? housamPose(t) : bedKidPose(a.n, t);
      if (walking) Object.assign(pose, housamDribble(seg(t, TO_DESK, TO_DESK + 1.0) * 4, .8), { lean: .06, mouth: 'smirk', brows: 'focused' });
      A[a.n] = RIG[a.n](sx, sy, s, { ...pose, t }); S[a.n] = s;
      HB.front(P, t, { splitZ: a.z, toZ: actors[i + 1]?.z, lamp: .6, laptop: true });
    });
    clawdInBedroom(P, t);
    return { A, S, P };
  }

  function bedBubbles(t, A, S) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 7) continue;
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 80 || a.mouth[0] > W - 80) continue;
      const side = a.mouth[0] < W * .5 ? 1 : -1;
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .7 * s, age, { size: 50, maxW: 620, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker], dx: side * 220, dy: -230 });
    }
  }

  const bDrift = (x, y, z, hy, f, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const B_MED = bDrift(0, 120, 250, 590, 900);
  const B_DESK = bDrift(140, 135, 185, 575, 820);                                // shifted toward the desk so Clawd reads
  const B_WIDE = bDrift(-20, 165, 60, 560, 640);
  const bshot = camFn => t => { const { A, S } = bedStage(t, camFn(t), 1.0); bedBubbles(t, A, S); };
  const huddle = bshot(B_MED), desk = bshot(B_DESK), takeoff = bshot(B_WIDE);
  function opening(t) { const u = ease(seg(t, .2, 4.2)), b = B_MED(t); const { A, S } = bedStage(t, { ...b, y: lerp(320, b.y, u), z: lerp(150, b.z, u), hy: lerp(700, b.hy, u) }, .5); bedBubbles(t, A, S); }

  // =====================================================================================================
  // ---------- part 2 & 3: the living room ----------
  const SEAT = LR.SOFA.seat, SOFA_FRONT = LR.SOFA.z1 + 4, TWIN = { safadi: [95, 85], sami: [-95, 85] }, SIT_DROP = -42;
  const L_SIDE = { safadi: 1, sami: -1, housam: .8, alma: .55, jenna: -.55, danny: -.8 };   // sofa view: +X is screen-left
  const lLookAt = (me, who) => !who || who === me ? 0 : clamp((L_SIDE[who] - L_SIDE[me]) * 1.1, -.85, .85);

  function twinPose(name, t) {
    const talk = speaking(name, t), ph = name === 'sami' ? 1.3 : 0, say = m => talk ? lipFlap(t, true, m) : m;
    const o = { handL: [-3.4, -16.5], handR: [3.4, -16.5], handPoseL: 'open', handPoseR: 'open', lookY: .35, lookX: 0, eyes: 'open', brows: 'normal', mouth: say('smile'), dy: .2 };
    const set = p => Object.assign(o, p);
    // bragging: confident, gesturing to the laptop
    if (inW(t, SPARKLE, LAUGH)) { set({ brows: 'up', lookX: lLookAt(name, name === 'safadi' ? 'sami' : 'safadi') * .5 });
      if (speaking(name, t)) set({ mouth: say('talk'), handR: [5.2, -18.5], handPoseR: 'palm', brows: 'up' }); }
    if (inW(t, LAUGH, WINK + .6)) set({ eyes: 'happy', mouth: say('O'), brows: 'up', lean: -.05, dy: -.2, jump: .25 * bounce(t, 8, ph), lookY: -.1 });   // HA HA HA
    // gaming: mashing the keys (between and during the full-frame game shots)
    const gaming = inW(t, ROBO0 - .4, 69.6) || inW(t, SOCCER0 - .4, 83.2) || inW(t, REMATCH, GAMEOVER2);
    if (gaming) { const m = 1.3; set({ handL: [-3.2 + m * .3 * Math.sin(t * 24 + ph), -16 + m * .4 * Math.max(0, Math.sin(t * 27 + ph))], handR: [3.2 + m * .3 * Math.sin(t * 26 + ph), -16 + m * .4 * Math.max(0, Math.sin(t * 29 + ph))],
      handPoseL: 'fist', handPoseR: 'fist', eyes: 'wide', brows: 'angry', mouth: 'teeth', dy: .2 + .3 * bounce(t, 13, ph), lean: .03 * Math.sin(t * 6 + ph), lookY: .55 }); }
    // "IMPOSSIBLE!" — the shock
    if (name === 'safadi' && inW(t, 69.5, 72.2)) set({ eyes: 'wide', brows: 'up', mouth: say('O'), handL: [-6.4, -24], handR: [6.4, -24], handPoseL: 'open', handPoseR: 'open', jump: .5 * kick(t, 70.0, 6), dy: -.3, lookY: .3 });
    if (name === 'sami' && inW(t, 83.2, 86.3)) set({ eyes: 'wide', brows: 'up', mouth: say('O'), handL: [-6.4, -24], handR: [6.4, -24], handPoseL: 'open', handPoseR: 'open', jump: .5 * kick(t, 84.0, 6), dy: -.3, lookY: .3 });
    // Sami "let me show you my skills" — confident
    if (name === 'sami' && inW(t, 72.0, SOCCER0)) set({ brows: 'up', mouth: say('talk'), handR: [5.2, -18.5], handPoseR: 'palm', lookX: lLookAt('sami', 'safadi') * .5 });
    if (name === 'safadi' && inW(t, 72.0, SOCCER0)) set({ brows: 'normal', mouth: 'smirk', lookX: lLookAt('safadi', 'sami') * .6 });
    // GAME OVER on the rematch, then dejected
    if (t > GAMEOVER2) set({ eyes: 'squeeze', brows: 'worried', mouth: say('frown'), dy: .9, lean: .04, handL: [-3.4, -14.5], handR: [3.4, -14.5], handPoseL: 'open', handPoseR: 'open', lookY: .5, jump: 0 });
    if (inW(t, GAMEOVER2, KNOCK)) set({ mouth: say('flat'), lookX: lLookAt(name, name === 'safadi' ? 'sami' : 'safadi') * .5 });
    // part 3: embarrassed answers, then the board-game cheer
    if (t > KNOCK) { set({ eyes: 'open', brows: 'worried', mouth: say('smile'), dy: .3, lookX: lLookAt(name, 'alma'), handL: [-3.4, -15.5], handR: [3.4, -15.5] });
      const answering = (name === 'safadi' && (inW(t, 103.0, 105.0) || inW(t, 107.6, 110.8))) || (name === 'sami' && inW(t, 114.8, 117.7));
      if (answering) set({ mouth: say('wobble'), brows: 'worried', eyes: 'squeeze', lookY: .4, lookX: .3 * Math.sin(t * 2), tilt: .04 * Math.sin(t * 3), emote: 'sweat', emoteK: on(t, name === 'sami' ? 114.9 : 103.1, name === 'sami' ? 117.6 : 110.8, .3) });
      if (t > HOORAY) set({ eyes: 'happy', brows: 'up', mouth: say('O'), jump: .5 * kick(t, HOORAY + .1 + (name === 'sami' ? .08 : 0), 6), handL: [-6, -22], handR: [6, -22], handPoseL: 'open', handPoseR: 'open', dy: -.2, lookY: -.2 }); }
    return o;
  }

  function livingStage(t, camo, blur, o = {}) {
    const P = persp(camo), A = {}, S = {};
    // the twins, seated and clipped at the front of the sofa cushion
    const twinDraw = name => {
      const [x, z] = TWIN[name], [sx, sy, kk] = P.p(x, SIT_DROP, z), s = UNIT[name] * kk, clipY = P.p(x, SEAT + 1, SOFA_FRONT)[1];
      X.save(); X.beginPath(); X.rect(0, 0, W, clipY); X.clip();
      const R = RIG[name](sx, sy, s, { ...twinPose(name, t), t });
      X.restore();
      A[name] = R; S[name] = s;
      const red = t > WINK, peek = on(t, WINK, WINK + 1.2, .25), glow = t > WINK ? (inW(t, GAMEOVER2, KNOCK) ? .25 : .32) : .22, shut = ease(seg(t, SHUT, SHUT + .5));
      goLid((R.handL[0] + R.handR[0]) / 2, clipY + 2 * kk, 46 * kk, name === 'safadi' ? 'bulb' : 'star', t, { red, peek, glow, shut });
      if (!(t > SHUT)) stFaceGlow(R.head[0], R.head[1] + 1.5 * s, 14 * s, t, red ? .7 : .5);
    };
    // the kids, standing (part 3), coming in from the archway
    const kidActors = t > KNOCK ? KIDS.map(n => ({ n, ...kidLivingAt(n, t) })).filter(a => P.depth(a.z) > 40) : [];
    const splitZ = Math.min(TWIN.safadi[1], ...(kidActors.length ? kidActors.map(a => a.z) : [9999]));
    layer(() => LR.back(P, t, { splitZ: 80, lamp: .5, night: 0, fan: true }), { blur });
    ['safadi', 'sami'].forEach(twinDraw);
    // interleave kids by depth with the set front
    const sorted = kidActors.sort((p, q) => P.depth(q.z) - P.depth(p.z));
    LR.front(P, t, { splitZ: 80, toZ: sorted.length ? sorted[0].z : undefined, lamp: .5, fan: true });
    sorted.forEach((a, i) => {
      const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[a.n] * k;
      A[a.n] = RIG[a.n](sx, sy, s, { ...kidLivingPose(a.n, t, a), t }); S[a.n] = s;
      LR.front(P, t, { splitZ: a.z, toZ: sorted[i + 1]?.z, lamp: .5, fan: true });
    });
    livingFX(t, A, S, P);
    return { A, S, P };
  }

  // the kids arriving in the living room: from the archway (420, 270) to their marks around the sofa
  const KID_MARK = { housam: [350, 305], alma: [255, 255], jenna: [-255, 255], danny: [-350, 305] };
  function kidLivingAt(name, t) {
    const m = KID_MARK[name], entry = [420, 275], u = ease(seg(t, WALK_IN[0] + (name === 'danny' || name === 'jenna' ? .5 : 0), WALK_IN[1]));
    return { x: lerp(entry[0], m[0], u), z: lerp(entry[1], m[1], u), moving: t < WALK_IN[1] && u > .01 && u < .99 };
  }
  function kidLivingPose(name, t, a) {
    const talk = speaking(name, t), ph = { alma: 0, jenna: 1.3, danny: 2.6, housam: 3.9 }[name], say = m => talk ? lipFlap(t, true, m) : m;
    if (a.moving) return { giraffe: false, ...WALK[name](seg(t, WALK_IN[0], WALK_IN[1]) * 8, 1), mouth: 'smile', brows: 'up', eyes: 'open', lookX: -.3, t };
    const o = { giraffe: false, mouth: say('smile'), brows: 'normal', eyes: 'open', lookY: -.2, lookX: lLookAt(name, 'safadi'), handL: [-3.2, -9.6], handR: [3.2, -9.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (speaking(name, t)) set({ brows: 'up', mouth: say('talk'), handR: [4.6, -13.5], handPoseR: 'palm' });
    if (name === 'jenna' && inW(t, 110.8, 127)) set({ lookX: lLookAt('jenna', 'sami') });
    if (t > HOORAY) set({ handL: [-4, -16], handR: [4, -16], handPoseL: 'fist', handPoseR: 'fist', brows: 'up', mouth: say('O'), eyes: 'wide', jump: 1.0 * kick(t, HOORAY + .1 + .05 * ph, 6), lookY: -.2, lookX: name === 'housam' ? -.6 : 0 });
    if (name === 'housam' && t > HOORAY + 1.2) set({ eyes: 'wink', mouth: 'grin', lookX: -.7, jump: .3 * kick(t, HOORAY + 1.3, 5) });   // winks at us
    return o;
  }

  // sparkles in and out of the laptops; Clawd's arrival and departure through the window (sofa view: window screen-right, X −440)
  function livingFX(t, A, S, P) {
    const winW = [-440, 180, 560];
    if (inW(t, SPARKLE - .6, WINK)) {                                            // one sparkle comes in and splits into both lids
      const u = ease(seg(t, SPARKLE - .6, SPARKLE + .4));
      for (const name of ['safadi', 'sami']) { const R = A[name]; if (!R) continue; const to = [(R.handL[0] + R.handR[0]) / 2, R.head[1] + 2 * S[name]];
        const [wx, wy] = P.p(winW[0], winW[1], winW[2]); const sx = lerp(wx, to[0], u), sy = lerp(wy, to[1], u) - 120 * Math.sin(Math.PI * u) * (name === 'safadi' ? 1 : .7);
        if (u < 1) overlay(() => shape(starPts(sx, sy, 16 * (1 - u * .4) + 4 * Math.sin(t * 20), .45, 5, t * 4), { fill: rgba('#BFF4FF', .85), stroke: null })); }
    }
    if (inW(t, LEAVE, LEAVE + 1.4)) {                                            // two sparkles leave through the window
      const u = ease(seg(t, LEAVE + .3, LEAVE + 1.3)), [wx, wy] = P.p(winW[0], winW[1], winW[2]);
      for (const name of ['safadi', 'sami']) { const R = A[name]; if (!R) continue; const fr = [(R.handL[0] + R.handR[0]) / 2, R.head[1] + 2 * S[name]];
        const sx = lerp(fr[0], wx, u), sy = lerp(fr[1], wy, u) - 110 * Math.sin(Math.PI * u);
        if (u > 0 && u < 1) overlay(() => shape(starPts(sx, sy, 14, .45, 5, t * 5), { fill: rgba('#BFF4FF', .85 * (1 - seg(u, .8, 1))), stroke: null })); }
    }
    if (inW(t, KNOCK, WALK_IN[0] + .3)) sfx('KNOCK KNOCK!', W * .5, H * .16, 56, '#FFFDF6', t - KNOCK, { life: 1.3 });
    // "IMPOSSIBLE!" shock stars
    if (A.safadi && inW(t, 69.5, 71.5)) sfx('?!', A.safadi.top[0] + 2 * S.safadi, A.safadi.top[1] - 1 * S.safadi, 70, '#FFE066', t - 70.0, { life: 1.1 });
    if (A.sami && inW(t, 83.2, 85.2)) sfx('?!', A.sami.top[0] + 2 * S.sami, A.sami.top[1] - 1 * S.sami, 70, '#FFE066', t - 84.0, { life: 1.1 });
    if (inW(t, GAMEOVER2, GAMEOVER2 + 1.8)) sfx('GAME OVER', W * .5, H * .3, 72, '#FF6B6B', t - GAMEOVER2 - .1, { life: 1.6 });
  }

  function livingBubbles(t, A, S) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const c = { size: 50, maxW: 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) { const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 60 && a.mouth[0] < W - 60);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, clamp(mx, 440, W - 440), my - 40, age, { ...c, size: c.size * 1.15, dx: 0, dy: -210 }); continue; } }
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 70 || a.mouth[0] > W - 70) continue;
      const side = a.mouth[0] < W * .5 ? 1 : -1;
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * 280, dy: -210 });
    }
  }

  const lDrift = (x, y, z, hy, f) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: -1 }; };
  const L_SOFA = lDrift(0, 125, 700, 590, 900);
  const L_WIDE = lDrift(0, 168, 955, 545, 640);
  const L_SAFADI = t => { const [dx, dy] = drift(t); return { x: 72 + dx * .5, y: 115, z: lerp(460, 430, seg(t % 100, 0, 100)), f: 1000, hy: 610 + dy, dir: -1 }; };
  const L_SAMI = t => { const [dx, dy] = drift(t); return { x: -72 + dx * .5, y: 115, z: lerp(460, 430, seg(t % 100, 0, 100)), f: 1000, hy: 610 + dy, dir: -1 }; };
  const lshot = (camFn, blur) => t => { const { A, S } = livingStage(t, camFn(t), blur); livingBubbles(t, A, S); };
  const sofa = lshot(L_SOFA, 1.2), room = lshot(L_WIDE, .8), closeSafadi = lshot(L_SAFADI, 1.8), closeSami = lshot(L_SAMI, 1.8);

  // the full-frame laptop games
  const roboHard = t => goLaptop(t, (w, h) => goRoboHard(w, h, t, ROBO0), { shoulder: 'safadi' });
  const soccerHard = t => goLaptop(t, (w, h) => goSoccerHard(w, h, t, SOCCER0), { shoulder: 'sami' });

  // ---------- the ripple dissolve (bedroom → living room) ----------
  const OFF = [0, 1].map(() => Object.assign(document.createElement('canvas'), { width: W, height: H }));
  function paintOff(i, fn, t) { const c = OFF[i].getContext('2d'), outer = X, ov = OVERLAYS; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); X = c; OVERLAYS = []; try { fn(t); flushOverlays(); } finally { X = outer; OVERLAYS = ov; } }
  function toLiving(t) {
    const u = seg(t, RIPPLE[0], RIPPLE[1]), e = ease(u), amp = 70 * Math.sin(Math.PI * u);
    paintOff(0, takeoff, t); paintOff(1, sofa, t);
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    for (let y = 0; y < H; y += 6) { const dx = amp * Math.sin(y * .018 + t * 9); X.globalAlpha = 1; X.drawImage(OFF[0], 0, y, W, 6, dx, y, W, 6); X.globalAlpha = e; X.drawImage(OFF[1], 0, y, W, 6, -dx, y, W, 6); }
    X.restore(); flash(.35 * Math.sin(Math.PI * u), '#FFF6DA');
  }

  // ---------- the ending: freeze, card, iris ----------
  function ending(t) {
    const tt = Math.min(t, FREEZE); const { A, S } = livingStage(tt, L_WIDE(tt), .8); livingBubbles(tt, A, S);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#6A3FB0'; X.fillText('TO BE CONTINUED...', 0, 8);
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.2, END - .8))));
  }

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: the plan
      [0, opening], [4.6, huddle], [TO_DESK, desk], [SALUTE, takeoff], [RIPPLE[0], toLiving],
      // part 2: brag and lose
      [RIPPLE[1], sofa], [ROBO0, roboHard], [69.8, closeSafadi], [72.2, sofa], [SOCCER0, soccerHard], [83.8, closeSami], [86.3, sofa],
      // part 3: the research
      [96.5, room], [103.0, closeSafadi], [105.0, room], [107.4, closeSafadi], [110.8, room], [114.6, closeSami], [117.7, ending],
    ] });
})();
