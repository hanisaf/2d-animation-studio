// Scene 30: "Cleaning Up 3 · The Eureka Moment". Straight on from scene 29's "Allow me to explain!", in Alma's spotless bedroom.
// Housam tells Professor Safadi what happened. "What did you learn?" "Never trust technology!" "Not quite": any software needs
// to be tested before it goes to production (a floating chalkboard: CODE → TEST → PRODUCTION), and they should have depended
// on themselves. "But my toys are still gone!" "We need a solution!" Housam can't wake Robo-Safadi: it's a hardware issue, the
// battery (an insert on the door on his back: 3%, blinking). He plugs the robot into the wall. "I cannot wait!" So Safadi tells
// a story: "In ancient Greece…" A ripple to the agora below the Acropolis, where Greek-robed children beg him to teach them
// physics, mathematics, astronomy. "Gnōthi seauton." (the words glow in the air) Puzzled faces. "Know thyself…" BEEP-BEEP: the
// charger cuts in, a ripple back to the bedroom. Robo-Safadi wakes, "BATTERY CHARGED. READY." "Give back the toys!" and they
// pour out of his chest all over the floor. "HOORAY!"… "Oh no, now I still need to clean up." This time they all clean up
// together, themselves. "After you clean up, I will continue the story…" "No way! We want to play board games!" Safadi smiles
// and winks. Freeze. To be continued.
// Blocking, bedroom (bed view, as in scenes 28–29): Jenna (−215, 380), Danny (−120, 360), Housam (−25, 385), Alma (110, 430),
// Robo-Safadi (45, 600) on the far side of the rug, Professor Safadi (240, 330). The wall socket is behind the robot (−120, 22, 899).
// Athens: Safadi on the bema (0, 18, 620); the five students (scene 24's dancers) in an arc in front of it.
// Every shot is a pure function of t.
(() => {
  const BR = LOCATIONS.alma_bedroom, AT = LOCATIONS.ancient_athens, LINES = ASSETS.scene.scene30_cleaning_up_3.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: PAL.crimson, robo_safadi: '#FF2E2E', student: '#3F6FB0' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, robo_safadi: ROBO_SAFADI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, robo_safadi: roboSafadi };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 6.6, robo_safadi: 6.8, student: 5.2 };
  const KIDS = ['jenna', 'danny', 'housam', 'alma'], GAME = { jenna: 'rainbow', danny: 'dolphins', housam: 'oligarchy' };

  // ---------- timing ----------
  const SET_G = [1.6, 2.4];                                                   // the boys put their games down
  const BOARD = [24.6, 28.6, 35.6], FIX_WALK = [55.6, 57.0], TAPS = [57.6, 58.2], INSERT = [67.0, 69.3], DOOR = [67.5, 68.4];
  const TO_WALL = [75.7, 76.8], PLUG = 77.0, BACK_WALK = [82.0, 84.4], WAVE1 = [87.0, 88.6], ATH = 88.6;
  const HUSH = 99.4, GNOTHI = 100.8, PUZZLE = [103.9, 106.2], KNOW = 106.2, BEEP = 109.0, WAVE2 = [109.4, 111.0];
  const WAKE = 111.6, DUMP = [118.4, 122.0], D_FLY = [119.4, 121.8], FLY = .55, MESS_SEEN = 125.2, CLEAN = 136.2;
  const GRAB_G = [145.3, 145.9], FREEZE = 152.0, END = 158.0;

  // ---------- where everyone is ----------
  const SPOT = { jenna: [-215, 380], danny: [-120, 360], housam: [-25, 385], alma: [110, 430] };
  const BOX_AT = { jenna: [-262, 400], danny: [-160, 330], housam: [20, 350] };
  const ROBO = [45, 600], SAF_SPOT = [240, 330], FIX = [-60, 575], WALL = [-110, 800], SOCKET = [-120, 22, 899];
  const STU = [['s0', 31, -250, 430], ['s1', 44, -130, 370], ['s2', 52, 0, 345], ['s3', 67, 130, 370], ['s4', 73, 250, 430]];
  const STU_LOOK = Object.fromEntries(STU.map(([id, seed]) => [id, studentLook(seed)]));
  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  function at(name, t) {
    if (name === 'housam') {                                                  // over to the robot, to the wall socket, and back
      if (t < FIX_WALK[0]) return { x: SPOT.housam[0], z: SPOT.housam[1] };
      if (t < TO_WALL[0]) return along([SPOT.housam, [-70, 470], FIX], t, FIX_WALK);
      if (t < BACK_WALK[0]) return along([FIX, [-120, 690], WALL], t, TO_WALL);
      return along([WALL, [-130, 600], [-60, 450], SPOT.housam], t, BACK_WALK);
    }
    if (SPOT[name]) return { x: SPOT[name][0], z: SPOT[name][1] };
    if (name === 'robo_safadi') return { x: ROBO[0], z: ROBO[1] };
    if (name === 'safadi') return { x: SAF_SPOT[0], z: SAF_SPOT[1] };
  }

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who && l.who !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const SIDE = { jenna: -1, danny: -.65, housam: -.3, alma: .35, robo_safadi: .1, safadi: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const lookWho = (me, t) => { let who = null; for (const l of LINES) if (l.at <= t + .1 && l.speaker !== me && !l.silentBubble && !l.group && SIDE[l.speaker] !== undefined) who = l.speaker; return who; };
  const battery = t => t < PLUG ? .03 : t < WAVE2[1] ? lerp(.03, .62, seg(t, PLUG, 88)) : 1;

  // ---------- poses: the kids in the bedroom ----------
  const REST_HANDS = { jenna: [[-2.6, -11.0], [2.6, -11.0]], danny: [[-3.4, -10.0], [3.4, -10.0]], housam: [[-3.6, -10.6], [3.6, -10.6]], alma: [[-2.6, -7.6], [2.6, -7.6]] };
  const HOLD = {
    jenna: { chest: [[-2.6, -12.4], [2.6, -12.4]], up: [[-9.0, -18.0], [-3.2, -18.0]] },
    danny: { chest: [[-3.0, -11.4], [3.0, -11.4]], up: [[3.6, -17.0], [9.6, -17.0]] },
    housam: { chest: [[-3.1, -12.8], [3.1, -12.8]], up: [[5.2, -18.5], [11.2, -18.5]] },
  };
  // the clean-up, as in scene 28: crouch, grab a toy, lift it, toss it into the chest (one cycle every 1.5 s)
  const PICK = {
    jenna: { stand: REST_HANDS.jenna, low: [[-1.8, -4.6], [1.8, -4.6]], toss: [5.0, -18], dy: 2.0, ph: 0 },
    danny: { stand: REST_HANDS.danny, low: [[-2.2, -4.2], [2.2, -4.2]], toss: [5.4, -17], dy: 1.8, ph: .35 },
    housam: { stand: REST_HANDS.housam, low: [[-2.4, -4.6], [2.4, -4.6]], toss: [5.8, -19], dy: 2.2, ph: .7 },
    alma: { stand: REST_HANDS.alma, low: [[-1.6, -2.8], [1.6, -2.8]], toss: [4.6, -13], dy: 1.2, ph: .15 },
  };
  const PICK_T = 1.5, TOYS = ['teddy', 'ball', 'car', 'rings', 'sock', 'shirt', 'bookStack', 'pearl', 'jester', 'neptune', 'robo', 'crayonBox'];
  const STOP_CLEAN = 140.6;                                                   // they pause to listen to the professor
  function pickPose(name, t) {
    const p = PICK[name], u = (t - CLEAN - .4) / PICK_T + p.ph, c = frac(u), k = ease(seg(t, CLEAN, CLEAN + .4)) * (1 - ease(seg(t, STOP_CLEAN, STOP_CLEAN + .6)));
    const b = .5 - .5 * Math.cos(TAU * clamp(c / .7)), fling = Math.sin(Math.PI * seg(c, .62, .95));
    const handR = mixPt(mixPt(p.stand[1], p.low[1], b), p.toss, fling), handL = mixPt(p.stand[0], p.low[0], b);
    return { handL: mixPt(p.stand[0], handL, k), handR: mixPt(p.stand[1], handR, k), handPoseL: 'open', handPoseR: c > .3 && c < .75 ? 'fist' : 'open',
      dy: p.dy * b * k, lookY: .7 * b * k, turn: .35 * fling * k, lookX: .5 * fling * k, eyes: 'happy', mouth: 'grin', brows: 'up',
      carrying: u > 0 && t < STOP_CLEAN && c > .32 && c < .72 ? TOYS[Math.floor(hash(Math.floor(u) * 7.3 + p.ph * 31) * TOYS.length)] : null };
  }
  function kidPose(name, t) {
    const talk = speaking(name, t), sd = name === 'jenna' || name === 'danny' ? 1 : -1, ls = lookWho(name, t) || 'safadi', lx = lookAt(name, ls);
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lx, turn: .25 * Math.sign(lx), brows: 'normal', handL: REST_HANDS[name][0], handR: REST_HANDS[name][1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p), say = m => talk ? o.mouth : m, a = at(name, t);
    if (name === 'housam' && a.moving) return set({ ...housamDribble(a.dist / 46, 1), lookX: a.x > -60 ? .2 : -.3, turn: -.15, mouth: 'flat', brows: 'up' });
    // part 1: the confession and the lesson
    if (t < SET_G[1] && (name === 'danny' || name === 'housam')) {          // the boys still hold their games, then put them down
      const d = Math.sin(Math.PI * seg(t, SET_G[0], SET_G[1]));
      set({ handL: mixPt(HOLD[name].chest[0], [-1.8, -4.6], d), handR: mixPt(HOLD[name].chest[1], [1.8, -4.6], d), handPoseL: 'fist', handPoseR: 'fist', dy: 2.0 * d, game: t < SET_G[0] + .4 ? 'chest' : null, lookY: .6 * d });
    }
    if (inW(t, 0, 10.6) && name === 'housam' && t > SET_G[1]) set({ handL: [-5.0, -14.5], handR: [5.0, -14.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: say('smirk'), lookX: .85, turn: .4, tilt: .06 * Math.sin(t * 1.3) });
    if (inW(t, 6.4, 10.6) && name === 'housam') set({ handR: [6.4, -13.5], handPoseR: 'point', lookX: .1, turn: 0 });    // …into the robot's chest
    if (inW(t, 0, 10.6) && name !== 'housam') set({ brows: 'worried', mouth: 'flat', lookX: lookAt(name, 'housam') });
    if (inW(t, 12.6, 16.9)) set({ lookX: lookAt(name, 'safadi'), turn: .3, brows: 'up', mouth: 'o' });
    if (inW(t, 17.0, 19.5) && name === 'danny') set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.0 * kick(t, 17.1, 6), brows: 'angry', mouth: say('grin'), lookX: lookAt('danny', 'safadi'), turn: .3 });
    if (inW(t, 19.6, 22.4) && name !== 'danny') set({ handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', mouth: say('grin'), jump: .8 * kick(t, 19.7, 6), tilt: sd * .05 });   // arms crossed, nodding
    if (inW(t, 19.6, 22.4) && name === 'danny') set({ handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', dy: .4 * bounce(t, 6) });
    if (inW(t, 22.4, 24.4)) set({ lookX: lookAt(name, 'safadi'), turn: .3, brows: 'up', mouth: 'o', eyes: 'wide', emote: name === 'alma' ? '?' : null, emoteK: on(t, 22.6, 24.4, .15) });
    if (inW(t, 24.4, 35.0)) set({ lookX: lookAt(name, 'safadi') * .7, lookY: -.3, brows: 'up', mouth: 'o' });
    if (inW(t, 35.0, 37.2) && name === 'housam') set({ handR: [4.8, -30.5], handPoseR: 'open', brows: 'worried', mouth: say('smirk'), tilt: .1, blush: 1 });   // oops: scratching his head
    if (inW(t, 37.2, 46.7) && name !== 'housam') set({ lookX: lookAt(name, 'safadi'), turn: .3, brows: 'worried', mouth: 'flat' });
    if (inW(t, 37.2, 46.7) && name === 'housam') set({ lookY: .4, brows: 'worried', mouth: 'flat', lookX: .5 });
    if (inW(t, 46.8, 50.0) && name === 'alma') set({ handL: [-6.4, -12.5], handR: [6.4, -12.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: say('wobble'), lookX: .8, turn: .4, dy: .4 });
    if (inW(t, 46.8, 50.0) && name !== 'alma') set({ lookX: lookAt(name, 'alma'), brows: 'worried', mouth: 'o' });
    if (inW(t, 50.0, 52.8) && name !== 'alma') set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.1 * kick(t, 50.1 + .1 * sd, 6), brows: 'angry', mouth: say('grin'), eyes: 'open' });
    // part 2: the robot won't wake; the battery
    if (inW(t, 52.9, 55.6)) set({ lookX: lookAt(name, 'safadi'), turn: .3, brows: 'up', mouth: name === 'housam' ? 'smile' : 'o' });
    if (name === 'housam' && inW(t, FIX_WALK[1], TO_WALL[0])) {               // beside the robot
      set({ lookX: .8, turn: .4, lookY: -.1, brows: 'focused', mouth: say('flat') });
      for (const t0 of TAPS) if (inW(t, t0 - .25, t0 + .2)) set({ handR: [6.6, -20.5 + 2 * Math.sin(Math.PI * seg(t, t0 - .25, t0 + .2))], handPoseR: 'fist' });   // knock knock on his head
      if (inW(t, 59.4, 62.5)) set({ handL: [-5.2, -14.5], handR: [5.2, -14.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', lookX: -.2, turn: -.1 });
      if (inW(t, 62.6, 67.0)) set({ lookX: -.6, turn: -.3, brows: 'up' });
      if (inW(t, 67.0, 69.4)) set({ lookX: .9, lookY: .4, brows: 'focused', handR: [6.4, -11.5], handPoseR: 'point' });
      if (inW(t, 69.4, 72.0)) set({ handL: [-4.8, -22], handR: [4.8, -22], handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', brows: 'up', mouth: say('O'), jump: .8 * kick(t, 69.5, 6), lookX: -.4 });
      if (inW(t, 72.0, TO_WALL[0])) set({ lookX: -.6, turn: -.3, brows: 'up', mouth: 'smile' });
    }
    if (name === 'housam' && inW(t, TO_WALL[1], BACK_WALK[0])) {             // at the wall: crouch, plug in, stand up
      const d = Math.sin(Math.PI * seg(t, TO_WALL[1], PLUG + .5));
      set({ dy: 2.4 * d, handR: mixPt([3.6, -10.6], [6.4, -6.0], d), handPoseR: 'fist', lookX: .7, lookY: .6 * d, turn: .35, brows: 'focused', mouth: 'flat' });
      if (t > PLUG + .5) set({ eyes: 'happy', mouth: 'grin', brows: 'up', lookX: -.3, lookY: 0, turn: -.15, handR: [4.4, -21], handPoseR: 'fist', jump: .5 * kick(t, PLUG + .6, 6) });
    }
    if (inW(t, 56.0, 75.6) && name !== 'housam') set({ lookX: .5, turn: .25, lookY: -.1, brows: 'up', mouth: 'o' });
    if (inW(t, 69.4, 72.0) && name !== 'housam') set({ eyes: 'wide', emote: '!', emoteK: on(t, 69.5, 71.8, .15) });
    if (name === 'alma' && inW(t, 78.6, 81.3)) set({ handL: [-1.4, -6.0], handR: [1.4, -6.0], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', mouth: say('frown'), eyes: talk ? 'open' : 'squeeze', jump: .7 * kick(t, 78.9, 7) + .6 * kick(t, 79.4, 7), lookX: .8, turn: .4 });   // stamping
    if (inW(t, 78.6, 81.3) && name !== 'alma') set({ lookX: lookAt(name, 'alma'), brows: 'up', mouth: 'smile' });
    if (inW(t, 81.4, WAVE1[1])) set({ lookX: lookAt(name, 'safadi'), turn: .3, eyes: 'wide', brows: 'up', mouth: 'o', lean: .05 * -sd, lookY: -.2 });   // story time: everyone leans in
    // part 4: the toys come back
    if (inW(t, WAVE2[0], DUMP[0])) set({ lookX: lookAt(name, 'robo_safadi'), turn: .2 * Math.sign(lookAt(name, 'robo_safadi')), brows: 'up', mouth: t > WAKE ? 'O' : 'o', eyes: t > WAKE ? 'wide' : 'open', jump: .5 * kick(t, WAKE + .1, 6) });
    if (inW(t, 115.4, 118.2) && name === 'housam') set({ handR: [6.0, -18.5], handPoseR: 'point', brows: 'angry', mouth: say('grin'), lookX: .4, jump: .8 * kick(t, 115.5, 6) });
    if (inW(t, DUMP[0], 122.1)) {
      const wob = Math.sin(t * 9 + sd);
      set({ eyes: 'wide', mouth: 'O', brows: 'up', lookX: lookAt(name, 'robo_safadi') + .25 * wob, lookY: -.3 + .5 * seg(t, D_FLY[0], D_FLY[1]), handL: [-3.6, -16.4], handR: [3.6, -16.4], handPoseL: 'palm', handPoseR: 'palm', dy: .5, jump: .4 * kick(t, D_FLY[0], 5) });
    }
    if (name === 'alma' && inW(t, 122.1, MESS_SEEN)) set({ handL: [-6.4, -16.5], handR: [6.4, -16.5], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: say('grin'), brows: 'up', jump: 1.6 * bounce(t, 6), flip: frac(t * 1.3) > .5, emote: 'heart', emoteK: on(t, 122.3, MESS_SEEN, .2) });   // a happy twirl
    if (inW(t, 122.1, MESS_SEEN) && name !== 'alma') set({ eyes: 'happy', mouth: 'grin', brows: 'up', lookX: lookAt(name, 'alma') });
    if (name === 'alma' && inW(t, MESS_SEEN, 129.7)) {                        // she stops… and sees the mess
      set({ eyes: 'wide', brows: 'up', mouth: 'O', lookY: .6, lookX: .5 * Math.sin((t - MESS_SEEN) * 1.8), emote: '!', emoteK: on(t, MESS_SEEN + .1, 126.4, .1) });
      if (t > 126.0) set({ handL: [-2.2, -15.8], handR: [2.2, -15.8], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: say('wobble'), eyes: 'open', lookX: -.3, lookY: .2, tilt: .1 });   // hands on her cheeks
    }
    if (inW(t, MESS_SEEN, 129.7) && name !== 'alma') set({ eyes: 'open', brows: 'worried', mouth: 'o', lookY: .5, lookX: lookAt(name, 'alma') });
    if (inW(t, 129.8, 133.2) && name === 'jenna') set({ handR: [4.4, -20], handPoseR: 'palm', jump: .8 * kick(t, 129.9, 6), eyes: 'happy', brows: 'up', mouth: say('grin') });
    if (inW(t, 133.3, 135.0) && name === 'housam') set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.0 * kick(t, 133.4, 6), eyes: 'happy', brows: 'up', mouth: say('grin') });
    if (inW(t, 135.0, CLEAN) && name === 'danny') set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.0 * kick(t, 135.1, 6), eyes: 'happy', brows: 'up', mouth: say('grin') });
    if (inW(t, 129.8, CLEAN) && name === 'alma') set({ eyes: 'happy', mouth: 'grin', brows: 'up', lookX: lookAt('alma', lookWho('alma', t)) });
    if (inW(t, CLEAN, STOP_CLEAN + .6)) set(pickPose(name, t));
    if (inW(t, STOP_CLEAN + .6, GRAB_G[0])) set({ lookX: lookAt(name, 'safadi'), turn: .3, brows: 'up', mouth: 'o', eyes: 'open' });
    // "No way! After we clean up, we want to play board games!"
    if (t > GRAB_G[0] && GAME[name]) {
      const up = t > GRAB_G[1] + .3;
      set({ ...(up ? { handL: HOLD[name].up[0], handR: HOLD[name].up[1] } : { handL: HOLD[name].chest[0], handR: HOLD[name].chest[1] }), handPoseL: name === 'jenna' ? 'grip' : 'fist', handPoseR: name === 'jenna' ? 'grip' : 'fist',
        game: up ? 'up' : 'chest', eyes: up ? 'happy' : 'open', mouth: say(up ? 'grin' : 'o'), brows: 'up', jump: up ? .9 * kick(t, GRAB_G[1] + .35, 6) : 0, lookX: lookAt(name, 'safadi') });
      if (t < GRAB_G[1]) set({ dy: 2.0 * Math.sin(Math.PI * seg(t, GRAB_G[0], GRAB_G[1])), game: null, handL: [-1.8, -4.6], handR: [1.8, -4.6] });   // a quick crouch for the game
    }
    if (t > GRAB_G[0] && name === 'alma') set({ handL: [-6.2, -16], handR: [6.2, -16], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', brows: 'up', mouth: say('grin'), jump: .9 * kick(t, 146.1, 6), lookX: lookAt('alma', 'safadi') });
    if (t > 150.4) set({ eyes: 'happy', mouth: 'grin' });
    return o;
  }

  // ---------- Robo-Safadi: dead, then charging, then awake and giving everything back ----------
  function roboPose(t) {
    const talk = speaking('robo_safadi', t);
    const o = { eyes: 'off', mouth: 'flat', brows: 'normal', handL: [-4.4, -8.6], handR: [4.4, -8.6], handPoseL: 'claw', handPoseR: 'claw', dy: .5, tilt: .1, antenna: .5, hum: false,
      battery: battery(t), charging: t > PLUG && t < WAVE2[1] };
    const set = p => Object.assign(o, p);
    for (const t0 of TAPS) if (inW(t, t0, t0 + .6)) set({ jump: .25 * kick(t, t0, 9), antenna: .5 + .4 * boing(t, t0, 5, 6) });            // clonk, clonk: nothing
    if (inW(t, PLUG, PLUG + .6)) set({ jump: .3 * kick(t, PLUG, 9), glitch: .5 * kick(t, PLUG, 6) });                                      // ZZT
    if (t > WAKE) {
      const w = ease(seg(t, WAKE, WAKE + .4));
      set({ eyes: t < WAKE + .15 ? 'squint' : 'open', dy: .5 * (1 - w), tilt: .1 * (1 - w), antenna: .5 * (1 - w) + .2 * boing(t, WAKE + .2, 4, 4), hum: true, jump: .8 * kick(t, WAKE + .2, 6), mouth: 'smile', lookX: -.3 });
      if (inW(t, 112.4, DUMP[0])) set({ eyes: 'happy', brows: 'up', mouth: talk ? lipFlap(t, talk, 'grin') : 'grin', handR: [5.4, -21.5], handPoseR: 'point' });
      if (inW(t, 115.4, DUMP[0])) set({ eyes: 'open', mouth: 'smile', handR: [4.4, -8.6], handPoseR: 'claw', lookX: -.5, antenna: .3 * boing(t, 116.6, 5, 5) });
    }
    if (inW(t, DUMP[0], 123.2)) {                                             // the hatch flies open and everything pours back out
      const d = seg(t, DUMP[0], DUMP[1]), sw = Math.sin(t * 3.2);
      set({ dump: t < DUMP[1] ? d : 0, hatch: t < DUMP[1] ? 0 : 1 - ease(seg(t, DUMP[1], DUMP[1] + .6)), eyes: 'wide', mouth: 'O', brows: 'up', lean: -.07 * Math.sin(Math.PI * d),
        handL: [-6.6 + sw * .4, -13.5], handR: [6.6 + sw * .4, -13.5], handPoseL: 'palm', handPoseR: 'palm', jump: .25 * bounce(t, 18) * (t < DUMP[1] ? 1 : 0), lookX: .5 * sw });
    }
    if (t > 123.2) set({ eyes: 'happy', mouth: 'grin', brows: 'up', emote: 'music', emoteK: on(t, 123.3, 126, .2) });
    return o;
  }

  // ---------- Professor Safadi in the bedroom (suit) ----------
  function roomSafadiPose(t) {
    const talk = speaking('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.7, turn: -.35, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < 10.8) set({ handR: [.8, -16.1], handPoseR: 'fist', handL: [.6, -10.6], handPoseL: 'fist', brows: 'quizzical', mouth: 'flat', lookX: -.7 });   // still puzzled from scene 29
    if (t > 6.4 && t < 10.8) set({ brows: 'up', mouth: 'o', lookX: -.2, turn: -.1, lookY: .2 });                                        // a look at the robot
    if (inW(t, 10.8, 12.6)) set({ handR: [.8, -16.1], handPoseR: 'fist', handL: [.6, -10.6], handPoseL: 'fist', eyes: 'narrow', dy: .3 * Math.abs(Math.sin(t * 4)) });   // nodding: I see
    if (inW(t, 12.6, 17.0)) set({ handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', brows: 'up' });
    if (inW(t, 17.0, 22.4)) set({ brows: 'quizzical', mouth: 'flat', lookX: -.8 });
    if (inW(t, 22.4, 24.4)) set({ handR: [5.6, -21.4], handPoseR: 'point', brows: 'up', mouth: talk ? o.mouth : 'smirk' });              // one finger: not quite
    if (inW(t, 24.4, BOARD[2])) {                                              // the floating chalkboard
      const p = ease(seg(t, 24.4, 25.2)) * (1 - ease(seg(t, BOARD[2] - .5, BOARD[2])));
      set({ handR: [6.4, -17.5], handPoseR: 'palm', handL: [-4.6, -12], handPoseL: 'open', power: .55 * p, turn: .25, eyes: p > .5 && t < 29.4 ? 'glow' : 'open', brows: 'up', lookX: .6 });
      if (t > 29.6) set({ handL: [-5.6, -14.2], handPoseL: 'palm', lookX: -.8, turn: -.35 });
    }
    if (inW(t, 37.2, 42.5)) set({ handR: [5.6, -21.4], handPoseR: 'point', brows: 'up', lookX: -.8 });                                 // remember?
    if (inW(t, 42.6, 46.7)) set({ handL: [-5.0, -12.8], handR: [5.0, -12.8], handPoseL: 'palm', handPoseR: 'palm', brows: 'normal' });
    if (inW(t, 46.8, 52.8)) set({ brows: 'worried', mouth: 'flat', lookX: -.5 });
    if (inW(t, 52.9, 55.6)) set({ handR: [5.6, -13.4], handPoseR: 'palm', lookX: -.7, brows: 'up' });
    if (inW(t, 55.6, 75.6)) set({ lookX: -.3, turn: -.15, lookY: .1 });
    if (inW(t, 62.6, 67.0)) set({ handR: [.8, -16.1], handPoseR: 'fist', brows: 'focused', bulb: on(t, 63.5, 66.6, .2) });
    if (inW(t, 65.0, 67.0)) set({ handR: [5.6, -21.4], handPoseR: 'point', brows: 'up' });
    if (inW(t, 72.0, 75.6)) set({ handR: [5.6, -13.4], handPoseR: 'palm', brows: 'up', lookX: -.4 });
    if (inW(t, 78.8, 81.3)) set({ lookX: -.6, brows: 'up', mouth: 'o' });
    if (inW(t, 81.4, WAVE1[1])) {                                              // a storyteller's sweep
      const sw = ease(seg(t, 84.8, 86.6));
      set({ handR: [lerp(5.6, 7.0, sw), lerp(-14, -21, sw)], handPoseR: 'palm', handL: [-5.0, -13.6], handPoseL: 'palm', eyes: t > 85 ? 'happy' : 'open', brows: 'up', lookX: -.6, lookY: -.3 * sw, tilt: -.05 * sw });
    }
    if (t > WAVE2[1]) set({ lookX: -.3, turn: -.15, brows: 'up', mouth: 'smile' });
    if (inW(t, DUMP[0], 125.2)) set({ eyes: 'wide', brows: 'up', mouth: 'O', lookX: -.2, lookY: .3 });
    if (inW(t, 125.2, 141.0)) set({ eyes: t > CLEAN ? 'happy' : 'open', mouth: 'smile', lookX: -.6, handL: [-1.6, -9.4], handR: [1.6, -9.4], handPoseL: 'fist', handPoseR: 'fist' });   // hands folded, pleased
    if (inW(t, 141.0, 146.0)) set({ handR: [5.6, -21.4], handPoseR: 'point', brows: 'up', eyes: 'open', lookX: -.7 });
    if (inW(t, 143.6, 146.0)) set({ handR: [5.6, -13.4], handPoseR: 'palm' });
    if (inW(t, 146.0, 150.4)) set({ brows: 'up', mouth: 'O', eyes: 'wide', lookX: -.7, jump: .4 * kick(t, 146.3, 6) });
    if (t > 150.4) { set({ brows: 'up', mouth: 'grin', eyes: 'happy', lookX: -.2, turn: -.1, blush: .6 });
      if (inW(t, 151.0, 151.9)) set({ eyes: 'wink', lookX: .2, turn: .1, handR: [5.2, -16.5], handPoseR: 'thumb' }); }                 // a wink at the camera
    return o;
  }

  // ---------- Athens ----------
  function sagePose(t) {
    const talk = speaking('safadi', t);
    const o = { outfit: 'greek', mouth: lipFlap(t, talk, 'smile'), brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < 92.0) set({ handL: [-6.0, -15.5], handR: [6.0, -15.5], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', brows: 'up' });   // welcome!
    if (inW(t, 92.0, HUSH)) { const who = t < 94.4 ? -1 : t < 96.8 ? 0 : 1; set({ lookX: .6 * who, turn: .25 * who, brows: 'up', mouth: 'smile', eyes: 'open' }); }
    if (inW(t, HUSH, GNOTHI + 3.1)) { const k = ease(seg(t, HUSH, HUSH + .6));
      set({ handR: [5.2, lerp(-12, -22.4, k)], handPoseR: 'point', eyes: t < GNOTHI ? 'closed' : 'glow', brows: 'up', mouth: talk ? o.mouth : 'smile', power: .5 * on(t, GNOTHI, GNOTHI + 3.0, .4), lookY: -.2 }); }
    if (inW(t, PUZZLE[0], KNOW)) set({ handL: [-1.6, -9.4], handR: [1.6, -9.4], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'smile', lookX: .5 * Math.sin(t * 1.2) });   // a patient smile
    if (t >= KNOW) set({ handR: [1.4, -13.6], handPoseR: 'palm', handL: [-5.6, -14.0], handPoseL: 'palm', eyes: 'happy', brows: 'up', mouth: talk ? o.mouth : 'smile', power: .35 * on(t, KNOW, BEEP, .4), tilt: -.04 });   // hand on his heart
    if (t > BEEP) set({ eyes: 'wide', mouth: 'o', emote: '!', emoteK: on(t, BEEP + .1, WAVE2[1], .1), power: 0 });
    return o;
  }
  function studentPose(id, t) {
    const i = +id[1], talk = speaking(id, t), mine = { s0: 92.2, s2: 94.4, s4: 96.8 }[id];
    const o = { outfit: 'greek', look: STU_LOOK[id], seed: STU[i][1], mouth: lipFlap(t, talk, 'smile'), brows: 'up', eyes: 'open', lookY: -.3, lookX: -STU[i][2] / 600 };
    const set = p => Object.assign(o, p);
    if (t < 92.0) set({ mouth: 'grin', eyes: 'happy', jump: .6 * bounce(t, 5, i) });
    if (inW(t, 92.0, HUSH)) {                                                 // eager: hands up, one after another
      set({ handR: [4.0, -21.5 + .5 * Math.sin(t * 7 + i)], handPoseR: 'palm', mouth: talk ? o.mouth : 'grin', jump: .3 * bounce(t, 6, i) });
      if (mine && t > mine && t < mine + 2.3) set({ handR: [4.0, -22], jump: 1.2 * kick(t, mine + .1, 5), eyes: 'wide' });
      if (id === 's4' && t > 96.8) set({ handR: [3.6, -20.6], handPoseR: 'point', lookY: -.9, eyes: 'star' });
    }
    if (inW(t, HUSH, PUZZLE[0])) set({ handR: [3.5, -9.8], handPoseR: 'open', mouth: 'o', eyes: 'wide', lookY: -.5, jump: 0 });
    if (inW(t, PUZZLE[0], KNOW + .4)) {                                     // gnōthi… what?
      const k = on(t, PUZZLE[0] + i * .18, KNOW + .4, .2);
      set({ handR: [1.5, -16.3 - .15 * Math.max(0, Math.sin(t * 5 + i))], handPoseR: 'fist', tilt: (i % 2 ? -1 : 1) * .14, brows: 'worried', mouth: 'flat', lookX: (i % 2 ? .6 : -.6), emote: '?', emoteK: k });
    }
    if (t > KNOW + .4) set({ eyes: i === 2 ? 'star' : 'wide', mouth: 'O', brows: 'up', lookY: -.4 });
    return o;
  }

  // ---------- drawing a character ----------
  function drawChar(name, P, t, A, S, pose) {
    const a = at(name, t); if (!a || P.depth(a.z) < 60) return;
    const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[name] * k; pose = { ...pose, t };
    if (name === 'robo_safadi' && t > PLUG) { const [cx, cy] = P.p(...SOCKET); pose.cable = [cx, cy]; }
    const R = A[name] = RIG[name](sx, sy, s, pose);
    if (pose.emote && ['jenna', 'danny', 'housam'].includes(name) && (pose.emoteK ?? 1) > .02) alEmote(pose.emote, R, k * ALMA_UNIT, pose.emoteK ?? 1, t);
    if (pose.game && GAME[name]) {                                            // a board game, in both hands
      const w = 40 * k, mx = (R.handL[0] + R.handR[0]) / 2, my = (R.handL[1] + R.handR[1]) / 2;
      cuGame(GAME[name], mx, pose.game === 'up' ? my - w * .18 : my - w * .08, w, (pose.game === 'up' ? .1 * Math.sign(mx - sx) : 0) + .04 * Math.sin(t * 2 + sx), { t });
    }
    if (pose.carrying) { X.save(); X.translate(R.handR[0], R.handR[1] + 6 * k); X.scale(k * 1.1, k * 1.1); BR.toys[pose.carrying](clamp(k * .35, .6, 1.8)); X.restore(); }
    S[name] = s;
  }

  // ---------- the bedroom ----------
  // spotless after scene 29 (messy 0, nothing left: taken 1); the dump brings every toy back out (taken 1 → 0 at messy .55);
  // the clean-up tidies them away again (messy .55 → .25)
  const roomSet = t => t < D_FLY[0] ? { messy: 0, taken: 1, lamp: .55 }
    : { messy: t < CLEAN ? .55 : lerp(.55, .25, ease(seg(t, CLEAN + .5, FREEZE))), taken: t < D_FLY[1] ? 1 - seg(t, D_FLY[0], D_FLY[1]) : 0, lamp: .55 };
  const TAKE = BR.takeables(.55, 0);
  // every toy flies out of the robot's chest in an arc and lands on its spot (it appears in the room as it lands)
  function flyingToys(P, t) {
    if (t < D_FLY[0] - FLY || t > D_FLY[1]) return;
    const [rx, rz] = ROBO, src = [rx, 76, rz - 12];
    for (const it of TAKE) {
      const t1 = D_FLY[0] + (1 - it.ord) * (D_FLY[1] - D_FLY[0]), u = seg(t, t1 - FLY, t1); if (u <= 0 || u >= 1) continue;
      const e = easeOut(u), px = lerp(src[0], it.x, e), pz = lerp(src[2], it.z, e), py = lerp(src[1], it.y, e) + 110 * Math.sin(Math.PI * u);
      if (!P.visible(pz)) continue;
      const [qx, qy, k] = P.p(px, py, pz), sc = .3 + .7 * e, spin = (1 - u) * 7 * (hash(it.ord * 97) - .5);
      X.save(); X.translate(qx, qy); X.rotate(spin);
      if (it.kind === 'toy') { X.scale(k * (it.sc || 1) * sc, k * (it.sc || 1) * sc); BR.toys[it.name](clamp(k * .32, .5, 1.6), it.flip); }
      else if (it.kind === 'block') { const b = 18 * k * sc; shape(rectPts(-b / 2, -b / 2, b, b), { fill: it.col, stroke: PAL.ink, lwPx: 1.5 }); }
      else if (it.kind === 'book') { const b = 30 * k * sc; shape(rectPts(-b / 2, -b * .35, b, b * .7), { fill: it.col, stroke: PAL.ink, lwPx: 1.5 }); shape(rectPts(-b * .45, -b * .28, b * .9, b * .1), { fill: '#FFFFFF', stroke: null }); }
      else line([[-8 * k * sc, 0], [8 * k * sc, 0]], { stroke: it.col, lwPx: clamp(3 * k, 1, 10) });
      X.restore();
    }
  }
  const LAPTOP_FLOOR = [-30, 335];
  function floorLaptop(P) {                                                    // closed, on the floor where Housam left it in scene 29
    const [x, z] = LAPTOP_FLOOR; if (!P.visible(z)) return;
    const q = P.poly([[x - 34, 4, z - 22], [x + 34, 4, z - 22], [x + 34, 4, z + 22], [x - 34, 4, z + 22]]); if (!q) return;
    const b = P.poly([[x - 34, 0, z - 22], [x + 34, 0, z - 22], [x + 34, 4, z - 22], [x - 34, 4, z - 22]]); if (b) shape(b, { fill: '#8E979E', stroke: PAL.ink, lwPx: 1.2 });
    shape(q, { fill: '#C3C9CE', stroke: PAL.ink, lwPx: 1.4 });
    const st = P.poly([[x - 8, 4.2, z - 5], [x + 8, 4.2, z - 5], [x + 8, 4.2, z + 5], [x - 8, 4.2, z + 5]]); if (st) shape(st, { fill: '#D97757', stroke: PAL.ink, lwPx: 1 });
  }
  function roomStage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {}, SET = roomSet(t), actors = [];
    for (const n of KIDS) { const a = at(n, t); if (a && P.depth(a.z) > 60) actors.push({ z: a.z, draw: () => drawChar(n, P, t, A, S, kidPose(n, t)) }); }
    actors.push({ z: ROBO[1], draw: () => drawChar('robo_safadi', P, t, A, S, roboPose(t)) });
    actors.push({ z: SAF_SPOT[1], draw: () => drawChar('safadi', P, t, A, S, roomSafadiPose(t)) });
    for (const n of Object.keys(BOX_AT)) {                                     // the games on the floor (until someone holds theirs)
      if (t > GRAB_G[0] + .3 || ((n === 'danny' || n === 'housam') && t < SET_G[0] + .4)) continue;
      const [x, z] = BOX_AT[n]; actors.push({ z, draw: () => cuGameFloor(P, GAME[n], x, z, 40, (hash(x) - .5) * .5) });
    }
    actors.push({ z: LAPTOP_FLOOR[1], draw: () => floorLaptop(P) });
    const vis = actors.filter(a => P.depth(a.z) > 30).sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => BR.back(P, t, { ...SET, splitZ: vis.length ? vis[0].z : -Infinity }), { blur });
    vis.forEach((a, i) => { a.draw(); BR.front(P, t, { ...SET, splitZ: a.z, toZ: vis[i + 1]?.z }); });
    flyingToys(P, t);
    return { A, S, P };
  }
  // ---------- the agora ----------
  function athensStage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {}, actors = [];
    const sp = P.p(0, 18, AT.BEMA.z);
    if (P.dir > 0 && P.depth(AT.BEMA.z) > 60) actors.push({ z: AT.BEMA.z, draw: () => { const s = SAFADI_UNIT * sp[2]; A.safadi = safadi(sp[0], sp[1], s, { ...sagePose(t), t }); S.safadi = s; } });
    for (const [id, , x, z] of STU) if (P.depth(z) > 60) actors.push({ z, draw: () => { const [sx, sy, k] = P.p(x, 0, z), s = STUDENT_UNIT * k; A[id] = student(sx, sy, s, { ...studentPose(id, t), t }); S[id] = s; } });
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => AT.back(P, t, { splitZ: actors.length ? actors[0].z : -Infinity }), { blur });
    actors.forEach((a, i) => { a.draw(); AT.front(P, t, { splitZ: a.z, toZ: actors[i + 1]?.z }); });
    return { A, S, P };
  }
  // ΓΝΩΘΙ ΣΕΑΥΤΟΝ, glowing in the air, letter by letter; then it turns into KNOW THYSELF
  function glyphs(t, x, y, size) {
    if (t < GNOTHI || t > WAVE2[0] + .2) return;
    const GR = 'ΓΝΩΘΙ ΣΕΑΥΤΟΝ', EN = 'KNOW THYSELF', n = Math.round(seg(t, GNOTHI + .1, GNOTHI + 1.6) * GR.length), m = ease(seg(t, KNOW + .2, KNOW + 1.2));
    overlay(() => {
      X.save(); X.translate(x, y + Math.sin(t * 1.4) * size * .06); X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      const draw = (txt, a, sc) => { if (a <= .01) return; X.save(); X.globalAlpha = a; X.scale(sc, sc); X.font = `800 ${size}px ${FONT_TALK}`;
        X.shadowColor = '#FFD76A'; X.shadowBlur = size * .5; X.lineWidth = size * .12; X.strokeStyle = '#8A5A12'; X.strokeText(txt, 0, 0); X.fillStyle = '#FFF2B0'; X.fillText(txt, 0, 0); X.restore(); };
      draw(GR.slice(0, n), 1 - m, 1 + .1 * m);
      draw(EN, m, .9 + .1 * m);
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .7, r = size * (3.4 + .3 * Math.sin(t * 3 + i)), k = .5 + .5 * Math.sin(t * 5 + i * 1.7);   // twinkles round the words
        shape(starPts(Math.cos(a) * r, Math.sin(a) * r * .32, size * .16 * k, .3, 4), { fill: '#FFF5A8', stroke: '#F2B21E', lwPx: 1.5 }); }
      X.restore();
    });
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 8) continue;
      const c = { size: o.size || 52, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * 1.25, dx: 0, dy: o.groupDy ?? -200 }); continue; }
      }
      const key = l.who || l.speaker, a = A?.[key], s = S?.[key]; if (!a || a.mouth[0] < 60 || a.mouth[0] > W - 60) continue;
      const side = o.side ? o.side(key) : (a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: typeof o.dy === 'function' ? o.dy(key) : o.dy ?? -220 });
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const mixCam = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u), dir: a.dir ?? 1 });
  // the bedroom (bed view), as in scene 29
  const R_GROUP = cam(-40, 120, 110, 565, 760);
  const R_PAIR = cam(40, 115, 190, 555, 800);                                  // Housam and Alma
  const R_KIDS3 = cam(-120, 110, 175, 560, 720);                               // Jenna, Danny and Housam
  const R_WIDE = cam(10, 165, 30, 560, 640);                                   // the whole room, the robot on the rug
  const R_ROBOT = cam(10, 200, 100, 400, 1300);                                // over the kids' heads onto the robot (and Housam beside it)
  const R_ALMA = cam(140, 95, 250, 540, 800);
  const R_DUMP = cam(45, 300, 150, -60, 1600);                                 // high over the kids' heads: the robot and the toys pouring out
  const R_SAF = cam(185, 125, 135, 520, 820);                                  // the professor (and Alma)
  const R_LESSON = cam(300, 125, 150, 520, 820);                              // Safadi screen-left, room for the chalkboard on the right
  const R_SAF_PUSH = t => ({ ...R_SAF(t), z: lerp(135, 175, ease(seg(t, 37.0, 46.6))) });
  const R_STORY = t => ({ ...R_SAF(t), z: lerp(135, 185, ease(seg(t, 81.2, WAVE1[0]))) });
  const R_FINAL = t => ({ ...cam(200, 125, 150, 520, 840)(t), z: lerp(150, 205, ease(seg(t, 150.4, FREEZE))) });
  // the agora
  const A_PRE = AT.cameras;
  const A_WIDE = t => { const [dx, dy] = drift(t), u = ease(seg(t, ATH, 92.0)), w = A_PRE['Wide · the agora']; return mixCam({ ...w, x: dx, y: 520, z: -380, hy: 900 + dy }, { ...w, x: dx, hy: w.hy + dy }, u); };
  const A_STUDENTS = t => { const [dx, dy] = drift(t), c = A_PRE['Students · reverse']; return { ...c, x: c.x + dx, z: 650, f: 700, hy: c.hy + dy + 20 }; };   // a step closer than the preset, a little wider
  const A_SAGE = t => { const [dx, dy] = drift(t), c = A_PRE['Sage · low angle']; return { ...c, x: c.x + dx, hy: c.hy + dy, z: lerp(380, 420, ease(seg(t, HUSH, PUZZLE[0]))) }; };
  const A_SAGE_MED = t => { const [dx, dy] = drift(t), c = A_PRE['Sage · medium']; return { ...c, x: c.x + dx, hy: c.hy + dy }; };

  // a warm storybook vignette over the agora (it's Safadi's story)
  function storyLook() {
    overlay(() => {
      X.fillStyle = radGrad(W / 2, H / 2, H * .42, H * 1.05, [[0, 'rgba(255,230,170,0)'], [.7, 'rgba(255,214,140,.28)'], [1, 'rgba(214,150,80,.6)']]); X.fillRect(0, 0, W, H);
      X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = 'rgba(255,200,120,.25)'; X.fillRect(0, 0, W, H); X.restore();
    });
  }
  const rshot = (camFn, blur, bo) => t => { const { A, S, P } = roomStage(t, camFn(t), blur); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const ashot = (camFn, blur, bo) => t => { const { A, S, P } = athensStage(t, camFn(t), blur); bubbles(t, A, S, bo); athensExtras(t, A, S, P); storyLook(); };

  const pair = rshot(R_PAIR, 1.4, { size: 50, side: n => n === 'alma' ? 1 : -1, far: 230, dy: -270 });
  const kids3 = rshot(R_KIDS3, 1.8, { size: 50, side: n => n === 'jenna' ? -1 : 1, far: 250, dy: -230, groupDy: -260 });
  const group = rshot(R_GROUP, .8, { size: 48, side: n => n === 'alma' || n === 'safadi' ? -1 : 1, far: 240, dy: -240, groupDy: -250 });
  const wide = rshot(R_WIDE, .4, { size: 48, side: n => n === 'alma' || n === 'robo_safadi' ? 1 : -1, far: 220, dy: -220 });
  const dumpShot = rshot(R_DUMP, .8, { size: 54, side: () => 1, far: 260, dy: -200 });
  const robot = rshot(R_ROBOT, 1.2, { size: 54, side: n => n === 'housam' ? -1 : 1, far: 260, dy: -180 });
  const almaShot = rshot(R_ALMA, 2.2, { size: 52, side: () => -1, far: 280, dy: -200 });
  const safShot = rshot(R_SAF, 2.0, { size: 50, side: n => n === 'safadi' ? -1 : 1, far: 280, dy: -260 });
  const safPush = rshot(R_SAF_PUSH, 2.0, { size: 50, side: n => n === 'safadi' ? -1 : 1, far: 280, dy: -260 });
  const story = rshot(R_STORY, 2.2, { size: 52, side: () => -1, far: 260, dy: -240 });
  // the lesson: Safadi and his floating chalkboard
  function lesson(t) {
    const { A, S, P } = roomStage(t, R_LESSON(t), 2.0); extras(t, A, S, P);
    const sf = A.safadi; if (sf && t > BOARD[0] && t < BOARD[2]) safadiBoard(sf.head[0] + 19 * S.safadi, sf.head[1] + 3 * S.safadi, 640, seg(t, BOARD[0], BOARD[1]), t, { kind: 'testing', title: 'SOFTWARE' });
    bubbles(t, A, S, { size: 50, side: n => n === 'safadi' ? -1 : 1, far: 220, dy: -250 });
  }
  const athensWide = ashot(A_WIDE, 0, { size: 48 });
  const students = ashot(A_STUDENTS, 1.0, { size: 52, side: k => +k[1] < 2 ? 1 : -1, far: 200, dy: -230 });
  const sage = ashot(A_SAGE, 1.4, { size: 54, side: () => 1, far: 260, dy: -200 });
  const sageMed = ashot(A_SAGE_MED, 1.2, { size: 54, side: () => 1, far: 260, dy: -220 });
  // the battery door on his back (a full-frame insert)
  function batteryInsert(t) {
    X.fillStyle = '#2A2228'; X.fillRect(0, 0, W, H);
    const B = roboSafadiBatteryInsert(W / 2, H / 2 + 20, 58, { t, door: ease(seg(t, DOOR[0], DOOR[1])), battery: battery(t) });
    // Housam's finger works the latch
    const fa = 1 - seg(t, DOOR[0] + .1, DOOR[0] + .3), fx = B.door[0] + 30, fy = H / 2 + 60;
    if (fa > .01) { X.save(); X.globalAlpha = fa; shape([[fx - 30, fy - 34], [fx + 120, fy - 40], [fx + 260, fy - 30], [fx + 900, fy - 40], [fx + 900, fy + 60], [fx + 240, fy + 50], [fx + 110, fy + 36], [fx - 30, fy + 30], [fx - 50, fy]], { fill: '#E6B48C', stroke: PAL.ink, lwPx: 5, smooth: .5 });
      shape(ellPts(fx - 12, fy - 2, 18, 22, 14), { fill: '#F3CDB0', stroke: PAL.ink, lwPx: 3, smooth: true }); X.restore(); }
    sfx('CLICK', B.door[0] + 60, H * .3, 60, '#FFFDF6', t - DOOR[0], { life: .6, rot: .1 });
    [68.6, 69.0].forEach((t0, i) => sfx('bip...', B.gauge[0] + 260 + i * 70, B.gauge[1] - 140 - i * 40, 52, '#FF9A9A', t - t0, { life: .7, rot: -.08 }));
  }
  function final(t) {                                                          // Safadi smiles and winks; freeze
    const tt = Math.min(t, FREEZE), { A, S, P } = roomStage(tt, R_FINAL(tt), 1.6);
    bubbles(tt, A, S, { size: 50, side: n => n === 'safadi' ? -1 : 1, far: 240, dy: -230, groupDy: -250 }); extras(tt, A, S, P);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .45 * k; X.fillStyle = '#F2B8D2'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#994EC4'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.2, END - .8))));
  }

  // a ripple dissolve between two shots (as in scene 29): both painted off-screen, laid down in wavy, cross-faded strips
  const OFF = [0, 1].map(() => Object.assign(document.createElement('canvas'), { width: W, height: H }));
  function paintOff(i, fn, t) {
    const c = OFF[i].getContext('2d'), outer = X, ov = OVERLAYS;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); X = c; OVERLAYS = [];
    try { fn(t); flushOverlays(); } finally { X = outer; OVERLAYS = ov; }
  }
  const rippleShot = ([a, b], fromFn, toFn) => t => {
    const u = seg(t, a, b), e = ease(u), amp = 70 * Math.sin(Math.PI * u);
    paintOff(0, fromFn, t); paintOff(1, toFn, t);
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    for (let y = 0; y < H; y += 6) {
      const dx = amp * Math.sin(y * .018 + t * 9);
      X.globalAlpha = 1; X.drawImage(OFF[0], 0, y, W, 6, dx, y, W, 6);
      X.globalAlpha = e; X.drawImage(OFF[1], 0, y, W, 6, -dx, y, W, 6);
    }
    X.restore();
    flash(.35 * Math.sin(Math.PI * u), '#FFF6DA');
  };
  const toAthens = rippleShot(WAVE1, story, athensWide);
  const toBedroom = rippleShot(WAVE2, sageMed, robot);

  // things that ride on top of the bedroom shots
  function extras(t, A, S, P) {
    const rb = A.robo_safadi, sr = S.robo_safadi;
    if (rb) {
      TAPS.forEach((t0, i) => sfx('CLONK', rb.top[0] + (i ? 5 : -5) * sr, rb.top[1] - 2 * sr, 52, '#FFFDF6', t - t0, { life: .6, rot: i ? .1 : -.1 }));
      if (t > PLUG && t < PLUG + 1) { const [cx, cy] = P.p(...SOCKET); sfx('ZZT!', cx, cy - 70, 58, '#7CFF9B', t - PLUG, { life: .7, rot: -.1 }); }
      sfx('VWOOM!', rb.top[0], rb.top[1] - 3 * sr, 70, '#BFF3FF', t - WAKE, { life: .9, rot: -.06 });
      [119.4, 120.1, 120.8, 121.4].forEach((t0, i) => sfx(['CRASH!', 'CLATTER!', 'BONK!', 'CLATTER!'][i], rb.hatch[0] + (i % 2 ? 11 : -11) * sr, rb.hatch[1] - (5 + 2 * i) * sr, 60, '#FFE066', t - t0, { life: .7, rot: i % 2 ? .1 : -.1 }));
    }
    if (A.alma && t > 122.2) sfx('HOORAY!', A.alma.top[0], A.alma.top[1] - 2 * S.alma, 56, '#FFE066', t - 122.6, { life: .9, rot: .08 });
    if (t > CLEAN && t < STOP_CLEAN) for (const n of KIDS) {                 // a twinkle as each toy goes in
      const r = A[n]; if (!r) continue; const c = frac((t - CLEAN - .4) / PICK_T + PICK[n].ph);
      if (c > .78 && c < .95) overlay(() => { X.save(); X.translate(r.handR[0] + 2 * S[n], r.handR[1] - 3 * S[n]); X.rotate(t * 4); shape(starPts(0, 0, S[n] * 1.2 * Math.sin(Math.PI * seg(c, .78, .95)), .3, 4), { fill: '#FFF5A8', stroke: '#F2B21E', lwPx: 2 }); X.restore(); });
    }
  }
  // and on top of the agora shots
  function athensExtras(t, A, S, P) {
    const sf = A.safadi;
    if (sf) glyphs(t, sf.head[0], sf.top[1] - 4.5 * S.safadi, Math.min(96, S.safadi * 3.4));
    else glyphs(t, W / 2, 150, 84);                                            // the reverse shot: the words float over the students
    if (P.visible(AT.OWL.z)) { const [ox, oy] = P.p(AT.OWL.x, AT.OWL.h + 50, AT.OWL.z); [99.6, 100.2].forEach((t0, i) => sfx(i ? 'hoo!' : 'hoo...', ox + i * 50, oy - i * 30, 40, '#FFFDF6', t - t0, { life: .8, rot: i ? .1 : -.1 })); }
    if (t > BEEP) { sfx('BEEP-BEEP!', W * .76, H * .6, 84, '#7CFF9B', t - BEEP, { life: 1.2, rot: -.06 }); flash(.25 * kick(t, BEEP, 6), '#E8FFF0'); }
  }

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: what did we learn?
      [0, pair], [9.4, safShot], [16.8, kids3], [19.4, group], [22.4, safShot], [BOARD[0] - .4, lesson], [35.0, pair], [37.0, safPush],
      [46.6, almaShot], [49.8, group],
      // part 2: the battery
      [52.8, safShot], [55.6, robot], [62.4, safShot], [INSERT[0], batteryInsert], [INSERT[1], robot], [71.9, safShot], [75.6, robot],
      [78.6, almaShot], [81.2, story], [WAVE1[0], toAthens],
      // part 3: Athens
      [WAVE1[1], athensWide], [92.0, students], [HUSH - .2, sage], [PUZZLE[0], students], [KNOW - .2, sageMed], [WAVE2[0], toBedroom],
      // part 4: the toys come back
      [WAVE2[1], robot], [115.2, kids3], [DUMP[0] - .2, dumpShot], [121.0, wide], [122.0, almaShot], [MESS_SEEN, wide], [126.0, almaShot],
      [129.6, kids3], [CLEAN, group], [140.8, safShot], [145.8, group], [150.4, final],
    ] });
})();
