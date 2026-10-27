// Scene 28: "Cleaning Up 1 · Toys Are All Over the Place". Alma's house on an autumn afternoon, then her (messy) bedroom.
// Jenna, Danny and Housam arrive on the lawn with their board games, excited for the play date: "LET US GO!" They skip
// up the walk and in. Upstairs Alma is dancing in a room buried in toys. Housam asks her to clean up ("Not now."), Danny
// says there's nowhere to open a board game, Jenna says let's all clean together ("HOORAY!"), and the boys refuse: "No way!"
// Knock knock: Professor Safadi drops in. "How about all of you collaborate?" … "If you want to play in Alma's room, you
// have to help." "OK…" The kids start cleaning (the room's `messy` runs 1 → .55) but tire: "cleaning up is boring." Safadi:
// boring tasks are necessary. They want to hire someone; Safadi: then you lose track of your toys. "Awwww…" He leaves them
// to it. They slump, until Housam: "EUREKA!" The others are puzzled. Freeze. To be continued.
// Blocking, house (world units): Jenna (−210, 2000), Danny (−70, 1985), Housam (80, 2010) on the lawn, then up the walk to
// the front door. Bedroom (bed view, left to right as the camera sees it): Jenna (−215, 380), Danny (−120, 360),
// Housam (−25, 385), Alma on the rug (110, 430), Safadi (240, 330). Everyone comes in through the doorway (220, 50).
// Every shot is a pure function of t.
(() => {
  const HS = LOCATIONS.house, BR = LOCATIONS.alma_bedroom, LINES = ASSETS.scene.scene28_cleaning_up.dialogue, HSET = { season: 'autumn' };
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: PAL.crimson };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi };
  const GAME = { jenna: 'rainbow', danny: 'dolphins', housam: 'oligarchy' }, GAME_W = 40;
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 6.6 };
  const KIDS = ['jenna', 'danny', 'housam'];

  // ---------- timing ----------
  const GO = 14.2, OUT = [15.6, 19.9], WIPE = [19.7, 20.9], ROOM = 20.4, LAG = { jenna: 0, danny: .35, housam: .7 };
  const ENTER = { jenna: [20.6, 23.6], danny: [21.0, 24.0], housam: [21.4, 24.4] }, GASP = 24.7;
  const KNOCK = 49.2, SAF_IN = [49.9, 53.0], BULB = 62.6, OK_ = 75.4, DOWN = [76.0, 77.0], CLEAN = 77.4, TIRED = 87.0;
  const LEAVE = [124.4, 127.4], EUREKA = 132.2, PUZZLE = 133.4, FREEZE = 136.4, END = 143;

  // ---------- where everyone is ----------
  const LAWN = { jenna: [-210, 2000], danny: [-70, 1985], housam: [80, 2010] };
  const SPOT = { jenna: [-215, 380], danny: [-120, 360], housam: [-25, 385], alma: [110, 430], safadi: [240, 330] };
  const DOORWAY = [220, 50];
  const BOX_AT = { jenna: [-262, 400], danny: [-160, 330], housam: [20, 350] };          // where the games are put down

  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  const room = t => t >= ROOM;
  function at(name, t) {
    if (!room(t)) {
      if (!LAWN[name]) return null;
      const a = along([LAWN[name], [-85, 2560], [-88, 2800]], t, [OUT[0] + LAG[name], OUT[1] - .7 + LAG[name]]);
      return { ...a, fade: 1 - seg(a.z, 2640, 2790) };
    }
    if (name === 'alma') return { x: SPOT.alma[0], z: SPOT.alma[1], dist: 0, moving: false };
    if (name === 'safadi') {
      if (t < SAF_IN[0] || t > LEAVE[1]) return null;
      if (t > LEAVE[0]) return { ...along([SPOT.safadi, [235, 190], DOORWAY], t, LEAVE), fade: 1 - seg(t, LEAVE[1] - .5, LEAVE[1]) };   // off to let them work
      return { ...along([DOORWAY, [235, 190], SPOT.safadi], t, SAF_IN), fade: ease(seg(t, SAF_IN[0], SAF_IN[0] + .4)) }; }
    return { ...along([DOORWAY, [175, 170], SPOT[name]], t, ENTER[name]), fade: ease(seg(t, ENTER[name][0], ENTER[name][0] + .35)) };
  }
  const messy = t => lerp(1, .55, ease(seg(t, CLEAN + .6, TIRED + .6)));              // they only get halfway

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble && !l.group) who = l.speaker; return who; };
  const SIDE_H = { jenna: -1, danny: -.45, housam: .15 }, SIDE_R = { jenna: -1, danny: -.65, housam: -.3, alma: .35, safadi: 1 };
  const lookAt = (me, who, t) => { const S = room(t) ? SIDE_R : SIDE_H; return !who || who === me || S[who] == null ? 0 : clamp((S[who] - S[me]) * 1.6, -.85, .85); };
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const shake = (t, a, b) => inW(t, a, b) ? .55 * Math.sin((t - a) * 14) * on(t, a, b, .2) : 0;   // a "no way" head shake (turn)

  // the games in their hands: [left, right] hand targets (local units), held at the chest or lifted up beside the head
  const HOLD = {
    jenna: { chest: [[-2.6, -12.4], [2.6, -12.4]], up: [[-9.0, -18.0], [-3.2, -18.0]] },
    danny: { chest: [[-3.0, -11.4], [3.0, -11.4]], up: [[3.6, -17.0], [9.6, -17.0]] },
    housam: { chest: [[-3.1, -12.8], [3.1, -12.8]], up: [[5.2, -18.5], [11.2, -18.5]] },
  };
  const holding = (name, mode) => ({ handL: HOLD[name][mode][0], handR: HOLD[name][mode][1], handPoseL: name === 'jenna' ? 'grip' : 'fist', handPoseR: name === 'jenna' ? 'grip' : 'fist', game: mode });
  const WALK = { jenna: jennaSkip, danny: dannyDribble, housam: housamDribble, alma: almaSkip };

  // the clean-up: crouch, grab a toy, lift it, toss it away into the chest (one cycle every 1.5 s)
  const PICK = {
    jenna: { stand: [[-2.6, -11.0], [2.6, -11.0]], low: [[-1.8, -4.6], [1.8, -4.6]], toss: [5.0, -18], dy: 2.0, ph: 0 },
    danny: { stand: [[-3.4, -10.0], [3.4, -10.0]], low: [[-2.2, -4.2], [2.2, -4.2]], toss: [5.4, -17], dy: 1.8, ph: .35 },
    housam: { stand: [[-3.6, -10.6], [3.6, -10.6]], low: [[-2.4, -4.6], [2.4, -4.6]], toss: [5.8, -19], dy: 2.2, ph: .7 },
    alma: { stand: [[-2.6, -7.6], [2.6, -7.6]], low: [[-1.6, -2.8], [1.6, -2.8]], toss: [4.6, -13], dy: 1.2, ph: .15 },
  };
  const PICK_T = 1.5, TOYS = ['teddy', 'ball', 'car', 'rings', 'sock', 'shirt', 'bookStack', 'pearl', 'jester', 'neptune', 'robo', 'crayonBox'];
  const cyc = (name, t) => (t - CLEAN - .4) / PICK_T + PICK[name].ph;
  function pickPose(name, t) {
    const p = PICK[name], u = cyc(name, t), c = frac(u), k = ease(seg(t, CLEAN, CLEAN + .4)) * (1 - ease(seg(t, TIRED, TIRED + .8)));
    const b = .5 - .5 * Math.cos(TAU * clamp(c / .7)), fling = Math.sin(Math.PI * seg(c, .62, .95));
    const handR = mixPt(mixPt(p.stand[1], p.low[1], b), p.toss, fling), handL = mixPt(p.stand[0], p.low[0], b);
    return { handL: mixPt(p.stand[0], handL, k), handR: mixPt(p.stand[1], handR, k), handPoseL: 'open', handPoseR: c > .3 && c < .75 ? 'fist' : 'open',
      dy: p.dy * b * k, lookY: .7 * b * k, turn: .35 * fling * k, lookX: .5 * fling * k, carrying: u > 0 && t < TIRED && c > .32 && c < .72 ? TOYS[Math.floor(hash(Math.floor(u) * 7.3 + p.ph * 31) * TOYS.length)] : null };
  }
  const grumpy = t => t < 85.0;                                                 // the boys come round halfway through

  // after the clean-up runs out of steam: tired, the hiring idea, "Awwww", Safadi leaves, the slump, "EUREKA!"
  function lateKid(name, t, o, talk) {
    const set = p => Object.assign(o, p), pk = PICK[name], sd = name === 'jenna' || name === 'danny' ? 1 : -1;
    const hire = on(t, 100.4, 106.6, .4), up = ease(seg(t, EUREKA, EUREKA + .4));
    const sl = ease(seg(t, TIRED, TIRED + 1.2)) * (1 - hire) * (1 - up) * (1 + .7 * on(t, 116.0, 118.2, .3));
    set({ handL: [pk.stand[0][0] * 1.05, pk.stand[0][1] + 2.4 * sl], handR: [pk.stand[1][0] * 1.05, pk.stand[1][1] + 2.4 * sl], handPoseL: 'open', handPoseR: 'open',
      dy: pk.dy * .45 * sl, tilt: sd * .1 * sl, lookY: .3 * sl, blink: talk ? undefined : .45 * Math.min(sl, 1), brows: 'worried', mouth: talk ? o.mouth : 'flat', eyes: 'open',
      emote: 'sweat', emoteK: on(t, TIRED + .8, 92.4, .2), carrying: null, power: 0 });
    if (inW(t, 116.0, 118.2)) set({ eyes: 'closed', mouth: talk ? o.mouth : 'frown' });
    if (inW(t, LEAVE[0], LEAVE[1])) set({ lookX: .9, turn: .4 });                      // watching him go
    if (inW(t, LEAVE[1], EUREKA)) set({ lookX: .15 * sd, turn: 0, lookY: .5 });
    if (name === 'danny' && inW(t, 128.6, 130.0)) set({ eyes: 'closed', mouth: 'O', tilt: -.14, blink: undefined });   // a yawn
    if (name === 'jenna' && inW(t, 128.0, 132.2)) set({ tilt: .16, lookY: .7 });
    if (name === 'housam' && inW(t, 130.2, EUREKA)) set({ lookX: .3, lookY: -.5, brows: 'focused', blink: undefined, handR: [1.4, -17.2], handPoseR: 'point', tilt: 0 });   // the wheels turn
    if (hire > 0) set({ brows: 'up', eyes: 'open', blink: undefined, mouth: talk ? o.mouth : 'grin', lookX: lookAt(name, lastLine(t, name), t) });
    if (name === 'housam' && inW(t, 100.6, 103.0)) set({ handR: [4.6, -24], handPoseR: 'point', jump: .7 * kick(t, 100.7, 6) });
    if (name === 'danny' && inW(t, 103.2, 105.0)) set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.0 * kick(t, 103.3, 6), eyes: 'happy' });
    if (name === 'jenna' && inW(t, 105.0, 106.6)) set({ handR: [4.4, -20], handPoseR: 'palm', jump: .8 * kick(t, 105.1, 6), eyes: 'happy' });
    if (inW(t, 111.0, 116.0)) set({ brows: 'worried', mouth: 'o' });
    if (t >= EUREKA) {
      if (name === 'housam') set({ jump: 1.8 * kick(t, EUREKA + .1, 5), eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'grin', handR: [6.6, -25.5], handPoseR: 'point', handL: [-4.6, -16], handPoseL: 'palm', lookX: 0, lookY: -.3, turn: 0, bulb: true });
      else set({ lookX: lookAt(name, 'housam', t), turn: .25 * Math.sign(lookAt(name, 'housam', t)), eyes: t < PUZZLE ? 'wide' : 'open', jump: .5 * kick(t, EUREKA + .15, 7), mouth: 'o', brows: t < PUZZLE ? 'up' : 'worried',
        tilt: t > PUZZLE ? sd * .1 : 0, emote: '?', emoteK: on(t, PUZZLE, END, .2) });
    }
  }

  // ---------- poses ----------
  function kidBase(name, t) {
    const talk = speaking(name, t), ls = lastLine(t, name), lx = lookAt(name, ls, t);
    return { talk, o: { giraffe: false, mouth: lipFlap(t, talk, name === 'danny' ? 'grin' : 'smile'), lookX: lx, turn: .25 * Math.sign(lx), brows: 'normal', ...holding(name, 'chest') } };
  }
  // shared beats for the three visitors; each character's function adds its own lines on top
  function visitor(name, t, o, talk) {
    const set = p => Object.assign(o, p), a = at(name, t), ph = LAG[name] * 9;
    if (a && a.moving) return set({ ...WALK[name](a.dist / 46, 1), ...holding(name, 'chest'), lookX: room(t) ? -.3 : 0, turn: room(t) ? -.2 : 0, mouth: 'grin', brows: 'up', game: 'chest' }), true;
    if (!room(t)) {
      if (t < 3.0) set({ jump: .5 * bounce(t, 7, ph), eyes: 'happy', mouth: 'grin', brows: 'up' });
      if (inW(t, GO - .1, OUT[0] + LAG[name])) set({ ...holding(name, 'up'), jump: 1.4 * kick(t, GO + .1, 5), eyes: 'happy', mouth: talk ? o.mouth : 'grin' });
      return false;
    }
    if (inW(t, GASP, 28.0)) set({ eyes: t < GASP + .2 ? 'squeeze' : 'wide', mouth: 'O', brows: 'up', emote: '!', emoteK: on(t, GASP + .1, GASP + 1.6, .15), jump: .5 * kick(t, GASP, 7), lookX: lerp(-.6, .6, ease(seg(t, 25.6, 27.6))), lookY: .4 });
    if (inW(t, 49.2, 50.6)) set({ lookX: .9, turn: .45, brows: 'up', eyes: 'wide', mouth: 'o' });            // knock knock: who's that?
    if (inW(t, 50.6, 53.4)) set({ lookX: .9, turn: .45, brows: 'up' });
    if (inW(t, 61.4, 64.6) || inW(t, 70.4, OK_)) set({ lookX: .9, turn: .4 });
    if (inW(t, OK_, DOWN[0])) set({ eyes: 'closed', mouth: 'frown', brows: 'worried', dy: .8 * on(t, OK_, DOWN[0] + .3, .4), tilt: (name === 'jenna' ? .08 : -.08), lookX: 0, turn: 0 });
    if (inW(t, DOWN[0], CLEAN)) {                                                // crouch and put the game down on the floor
      const d = Math.sin(Math.PI * seg(t, DOWN[0], DOWN[1] + .3)), hp = PICK[name];
      set({ handL: mixPt(HOLD[name].chest[0], hp.low[0], d), handR: mixPt(HOLD[name].chest[1], hp.low[1], d), dy: hp.dy * d, lookY: .6 * d, lookX: 0, turn: 0, mouth: name === 'jenna' ? 'smile' : 'flat', brows: name === 'jenna' ? 'normal' : 'worried', game: t < (DOWN[0] + DOWN[1]) / 2 ? 'low' : null });
    }
    if (t >= CLEAN) {
      const g = name !== 'jenna' && grumpy(t);
      set({ ...pickPose(name, t), game: null, mouth: g ? 'frown' : 'grin', brows: g ? 'worried' : 'up', eyes: g ? 'open' : 'happy' });
    }
    if (t >= TIRED) lateKid(name, t, o, talk);
    return false;
  }
  function jennaPose(t) {
    const { talk, o } = kidBase('jenna', t), set = p => Object.assign(o, p);
    if (visitor('jenna', t, o, talk)) return o;
    if (inW(t, 3.0, 6.0)) set({ jump: .8 * bounce(t, 6), eyes: 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up' });
    if (inW(t, 40.0, 43.8)) set({ jump: .5 * kick(t, 40.1, 6), brows: 'up', lookX: .6, turn: .3, mouth: talk ? o.mouth : 'grin' });
    if (inW(t, 44.2, 46.0)) set({ eyes: 'happy', mouth: 'grin', lookX: .7, turn: .3 });
    if (inW(t, 46.2, 49.2)) set({ lookX: .6, turn: .3, brows: 'worried', mouth: 'flat' });
    if (inW(t, 65.0, 66.6)) set({ ...holding('jenna', 'up'), jump: 1.0 * kick(t, 65.1, 6), eyes: 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up' });
    if (inW(t, 66.8, 70.4)) set({ lookX: .6, turn: .3, brows: 'worried', mouth: 'flat' });
    if (inW(t, OK_, DOWN[0])) set({ eyes: 'open', mouth: 'smile', brows: 'up', dy: 0, tilt: .05 });          // Jenna was always in
    return o;
  }
  function dannyPose(t) {
    const { talk, o } = kidBase('danny', t), set = p => Object.assign(o, p);
    if (visitor('danny', t, o, talk)) return o;
    if (inW(t, 6.4, 10.6)) set({ ...(t > 7.6 ? holding('danny', 'up') : {}), jump: .9 * kick(t, 7.7, 6), eyes: t > 7.6 ? 'happy' : 'open', brows: 'up', mouth: talk ? o.mouth : 'grin' });
    if (inW(t, 28.0, 35.0)) set({ brows: 'worried', mouth: talk ? o.mouth : 'flat' });
    if (inW(t, 35.0, 39.6)) set({ ...(t > 37.4 ? holding('danny', 'up') : {}), brows: 'worried', lookX: .7, turn: .35, jump: .4 * kick(t, 37.5, 6), mouth: talk ? o.mouth : 'frown' });
    if (inW(t, 44.2, 46.2)) set({ mouth: 'flat', brows: 'normal', lookX: .7, turn: .35, eyes: 'open' });
    if (inW(t, 46.2, 49.2) || inW(t, 66.8, 70.2)) set({ brows: 'focused', lookX: .5, turn: .3 + shake(t, t < 50 ? 46.3 : 66.9, t < 50 ? 47.6 : 68.2), mouth: talk ? o.mouth : 'frown' });
    if (inW(t, 70.4, OK_)) set({ brows: 'worried', mouth: 'frown', dy: .3 });
    return o;
  }
  function housamPose(t) {
    const { talk, o } = kidBase('housam', t), set = p => Object.assign(o, p);
    if (visitor('housam', t, o, talk)) return o;
    if (inW(t, 11.0, 13.8)) set({ ...holding('housam', 'up'), jump: .7 * kick(t, 11.2, 6), eyes: 'happy', brows: 'up', mouth: talk ? o.mouth : 'grin' });
    if (inW(t, 28.0, 31.8)) set({ lookX: .8, turn: .4, brows: t < 29.6 ? 'up' : 'focused', lean: .04, mouth: talk ? o.mouth : 'flat' });
    if (inW(t, 32.2, 35.0)) set({ lookX: .8, turn: .4, brows: 'worried', mouth: 'flat' });
    if (inW(t, 46.2, 49.2) || inW(t, 66.8, 70.2)) set({ brows: 'focused', lookX: .5, turn: .3 + shake(t, t < 50 ? 46.3 : 66.9, t < 50 ? 47.6 : 68.2), mouth: talk ? o.mouth : 'frown' });
    if (inW(t, 53.6, 57.2)) set({ lookX: .9, turn: .45, brows: 'up', mouth: talk ? o.mouth : 'smile' });
    if (inW(t, 70.4, OK_)) set({ brows: 'worried', mouth: 'frown', dy: .3 });
    return o;
  }
  function almaPose(t) {
    const talk = speaking('alma', t), ls = lastLine(t, 'alma'), lx = lookAt('alma', ls, t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lx, turn: .2 * Math.sign(lx), brows: 'normal', handL: [-2.6, -7.6], handR: [2.6, -7.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p), dance = (move, k) => Object.assign(o, almaDance(t, move, { bpm: 112, k }), { power: .45 * k });
    if (t < GASP + .2) dance('disco', 1);                                      // dancing in the mess when they come in
    else if (t < 28.0) set({ eyes: t < GASP + .5 ? 'wide' : 'happy', mouth: 'grin', brows: 'up', lookX: -.8, turn: -.4, handR: [4.6, -13 + .8 * Math.sin(t * 12)], handPoseR: 'palm', jump: .5 * kick(t, GASP + .3, 6) });
    else if (t < 32.2) set({ lookX: -.8, turn: -.4, mouth: t > 30 ? 'flat' : 'smile', brows: t > 30 ? 'worried' : 'normal' });
    else if (t < 35.0) { dance('sway', ease(seg(t, 32.3, 33.0))); set({ mouth: talk ? o.mouth : 'smile', lookX: .5 }); }   // "Not now." and back to dancing
    else if (t < 40.0) set({ lookX: -.8, turn: -.4, mouth: 'flat', brows: 'normal' });
    else if (t < 44.2) set({ lookX: -.85, turn: -.4, eyes: t > 42 ? 'wide' : 'open', brows: 'up', mouth: t > 42 ? 'o' : 'smile' });
    else if (t < 46.2) set({ eyes: 'star', mouth: talk ? o.mouth : 'grin', brows: 'up', handL: [-4.6, -14.5], handR: [4.6, -14.5], handPoseL: 'palm', handPoseR: 'palm', jump: 2.4 * Math.sin(Math.PI * seg(t, 44.3, 45.0)), power: .8 * on(t, 44.2, 46.2, .3) });
    else if (t < 49.2) set({ lookX: -.8, turn: -.4, mouth: 'frown', brows: 'worried', dy: .3 * ease(seg(t, 47, 48)) });
    else if (t < 53.4) set({ lookX: .9, turn: .45, eyes: t < 50.4 ? 'wide' : 'open', brows: 'up', mouth: 'o' });
    else if (t < 57.4) set({ lookX: -.8, turn: -.4, brows: 'worried', mouth: 'flat' });
    else if (t < 61.2) set({ brows: 'worried', mouth: talk ? o.mouth : 'wobble', eyes: talk ? 'open' : 'squeeze', dy: .5, lookY: .4, lookX: .3, handL: [-1.4, -6.0], handR: [1.4, -6.0], handPoseL: 'fist', handPoseR: 'fist' });
    else if (t < 65.0) set({ lookX: .9, turn: .45, brows: 'up', mouth: 'smile' });
    else if (t < 66.8) set({ lookX: -.85, turn: -.4, eyes: 'happy', mouth: 'grin', brows: 'up' });
    else if (t < 70.4) set({ lookX: -.8, turn: -.4, mouth: 'frown', brows: 'worried' });
    else if (t < OK_) set({ lookX: .9, turn: .4, mouth: 'flat' });
    else if (t < CLEAN) set({ eyes: 'happy', mouth: 'smile', brows: 'worried', tilt: -.06 });
    else { set({ ...pickPose('alma', t), eyes: 'happy', mouth: 'grin', brows: 'up', power: .4 * ease(seg(t, CLEAN, CLEAN + 1)) }); o.hairSwing = .3 * Math.sin(t * 6); }
    if (t >= TIRED) { lateKid('alma', t, o, talk); if (inW(t, 97.8, 100.4)) set({ handL: [-1.4, -8.6], handR: [1.4, -8.6], handPoseL: 'fist', handPoseR: 'fist', lookY: -.3, lookX: .5, brows: 'worried' }); }
    return o;
  }
  function safadiPose(t) {
    const talk = speaking('safadi', t), a = at('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.7, turn: -.35, brows: 'normal', handL: [-3.4, -8.4], handR: [3.4, -8.4], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a && a.moving) return Object.assign(o, safadiWalk(a.dist / 58, 1), { lookX: -.5, turn: -.3, mouth: 'o', brows: 'up' });
    if (inW(t, 50.6, 53.4)) set({ handL: [-6.0, -15.5], handR: [6.0, -15.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'quizzical', mouth: talk ? o.mouth : 'flat' });
    if (inW(t, 53.4, 61.2)) set({ handR: [1.0, -17.4], handPoseR: 'point', brows: t > 57.4 ? 'worried' : 'quizzical', lookX: t > 57.4 ? -.2 : -.8 });
    if (inW(t, 61.2, 65.0)) { const pw = on(t, 61.4, 65.0, .5);                // "collaborate": powers on, the idea bulb
      set({ power: pw, eyes: pw > .5 ? 'glow' : 'open', handL: [-6.4, -14], handR: [6.4, -14], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', bulb: backOut(seg(t, BULB, BULB + .3)) * (1 - seg(t, 64.6, 65.0)), mouth: talk ? o.mouth : 'grin' }); }
    if (inW(t, 66.8, 70.4)) set({ brows: 'focused', mouth: 'flat', lookX: -.8 });
    if (inW(t, 70.4, OK_)) set({ handR: [5.4, -21.5], handPoseR: 'point', brows: t < 72.4 ? 'up' : 'focused', lookX: -.8, mouth: talk ? o.mouth : 'flat' });
    if (inW(t, OK_, TIRED)) set({ mouth: 'smile', lookX: -.6, tilt: t > CLEAN ? .04 * Math.sin(t * 2.2) : 0, brows: 'up', handL: [-1.6, -10.4], handR: [1.6, -10.4], handPoseL: 'open', handPoseR: 'open' });
    if (inW(t, TIRED, 92.6)) set({ brows: 'quizzical', mouth: talk ? o.mouth : 'flat', lookX: -.7 });
    if (inW(t, 92.6, 97.6)) set({ handR: [5.4, -21.5], handPoseR: 'point', brows: t < 95 ? 'up' : 'focused', mouth: talk ? o.mouth : 'smile' });   // the wise finger
    if (inW(t, 100.6, 106.6)) set({ brows: 'quizzical', eyes: t > 103 ? 'narrow' : 'open', mouth: 'smirk', handR: [1.0, -17.4], handPoseR: 'point' });
    if (inW(t, 106.8, 110.8)) set({ handL: [-6.2, -15], handPoseL: 'palm', handR: [1.8, -13.2], handPoseR: 'palm', brows: 'up' });               // you, yourself
    if (inW(t, 111.0, 116.0)) set({ handL: [-6.4, -14], handR: [6.4, -14], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: talk ? o.mouth : 'frown' });   // …and they're lost
    if (inW(t, 116.0, 118.2)) set({ mouth: 'smirk', brows: 'up' });
    if (inW(t, 118.2, 121.4)) set({ handL: [-6.6, -12], handPoseL: 'point', brows: 'up' });                                                       // back to work
    if (inW(t, 121.4, LEAVE[0])) set({ handR: [5.4, -21.5], handPoseR: 'point', brows: 'focused', mouth: talk ? o.mouth : 'flat' });
    return o;
  }
  const POSE = { jenna: jennaPose, danny: dannyPose, housam: housamPose, alma: almaPose, safadi: safadiPose };

  // ---------- drawing a character with what they hold ----------
  function drawChar(name, P, t, A, S, o = {}) {
    const a = at(name, t); if (!a || P.depth(a.z) < 60) return;
    const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[name] * k, pose = { ...POSE[name](t), t };
    if (o.freeze) pose.boil = 0;
    const draw = () => {
      const R = A[name] = RIG[name](sx, sy, s, pose);
      if (pose.game && GAME[name]) {                                            // the board game, in both hands
        const w = GAME_W * k, mx = (R.handL[0] + R.handR[0]) / 2, my = (R.handL[1] + R.handR[1]) / 2;
        cuGame(GAME[name], mx, pose.game === 'up' ? my - w * .18 : my - w * .08, w, (pose.game === 'up' ? .1 * Math.sign(mx - sx) : 0) + .04 * Math.sin(t * 2 + sx), { t });
      }
      if (pose.emote && KIDS.includes(name) && (pose.emoteK ?? 1) > .02) alEmote(pose.emote, R, k * ALMA_UNIT, pose.emoteK ?? 1, t);
      if (pose.carrying) { X.save(); X.translate(R.handR[0], R.handR[1] + 6 * k); X.scale(k * 1.1, k * 1.1); BR.toys[pose.carrying](clamp(k * .35, .6, 1.8)); X.restore(); }
    };
    if (a.fade !== undefined && a.fade < 1) { if (a.fade > .01) { X.save(); X.globalAlpha = a.fade; draw(); X.restore(); } } else draw();
    S[name] = s;
  }

  // ---------- the lawn, for a camera ----------
  function houseStage(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {};
    const list = KIDS.map(n => ({ n, a: at(n, t) })).filter(it => it.a && P.depth(it.a.z) > 60).sort((p, q) => P.depth(q.a.z) - P.depth(p.a.z));
    const split = list.length ? Math.min(...list.map(it => it.a.z)) : 1950;
    layer(() => HS.back(P, t, { ...HSET, splitZ: split }), { blur });
    list.forEach(it => drawChar(it.n, P, t, A, S, o));
    HS.front(P, t, { ...HSET, splitZ: split });
    return { A, S, P };
  }

  // ---------- the bedroom, for a camera ----------
  function roomStage(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {}, SET = { messy: messy(t), lamp: .55 };
    const actors = [];
    for (const n of Object.keys(RIG)) { const a = at(n, t); if (a && P.depth(a.z) > 60) actors.push({ z: a.z, draw: () => drawChar(n, P, t, A, S, o) }); }
    if (t > (DOWN[0] + DOWN[1]) / 2) for (const n of KIDS) {                   // the games, put down on the floor
      const [x, z] = BOX_AT[n]; if (P.depth(z) > 30) actors.push({ z, draw: () => cuGameFloor(P, GAME[n], x, z, GAME_W, (hash(x) - .5) * .5) });
    }
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => BR.back(P, t, { ...SET, splitZ: actors.length ? actors[0].z : -Infinity }), { blur });
    actors.forEach((a, i) => { a.draw(); BR.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z }); });
    return { A, S, P };
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const c = { size: o.size || 50, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W);
        if (ms.length > 1) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.25 : 1.1), dx: o.groupDx ?? 0, dy: o.groupDy ?? -200 }); continue;
        }
      }
      const a = A?.[l.speaker], s = S?.[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: o.dy ?? -220 });
      } else {                                                                  // off-screen: from the frame edge on their side
        const sd = (room(t) ? SIDE_R : SIDE_H)[l.speaker] > 0 ? 1 : -1;
        callout(l.text, sd > 0 ? W + 30 : -30, o.edgeY ?? H * .4, age, { ...c, dx: -sd * 420, dy: -150 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  // the lawn
  const H_MED = cam(-60, 120, 1720, 530);                                      // the three of them with the house behind
  const H_TWO = cam(5, 115, 1760, 500);                                        // Danny and Housam
  const H_WIDE = t => ({ ...cam(-80, 130, 1550, 600)(t), z: lerp(1550, 1950, ease(seg(t, OUT[0], OUT[1]))) });   // following them up the walk to the door
  // the bedroom (bed view unless dir -1)
  const R_ARRIVE = cam(30, 150, 720, 545, 700, -1);                           // from the bed back at the door: Alma dancing, the kids come in
  const R_GROUP = cam(10, 125, 110, 560, 760);                                 // everyone, the bed behind
  const R_KIDS = cam(-120, 110, 175, 560, 720);                                // the three visitors
  const R_ALMA = cam(175, 85, 230, 520, 820);                                  // Alma on the rug
  const R_ALMA_IN = cam(160, 85, 300, 535, 560);                               // Alma, from inside the group (once Safadi is in the room)
  const R_SAF = cam(185, 125, 135, 520, 820);                                  // Safadi (and Alma)
  const R_EUREKA = t => ({ ...cam(-90, 115, 175, 555, 720)(t), z: lerp(175, 205, ease(seg(t, EUREKA, FREEZE))) });   // the kids; push in on the idea
  const R_DOOR = cam(260, 140, 520, 545, 700, -1);                             // the door: Safadi drops in
  const R_TOYS = t => ({ x: lerp(-150, 110, ease(seg(t, 25.0, 27.8))), y: 30, z: 400, f: 680, hy: 470, dir: 1 });   // the mess, at toy height

  const hshot = (camFn, blur, bo) => t => { const { A, S, P } = houseStage(t, camFn(t), blur); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const rshot = (camFn, blur, bo, go) => t => { const { A, S, P } = roomStage(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const trioBo = { size: 48, side: n => n === 'housam' ? 1 : -1, far: 260, dy: -230, groupDy: -230 };

  function opening(t) {                                                        // from the street onto the lawn
    const u = ease(seg(t, .2, 2.9)), b = H_MED(t);
    const c = { x: lerp(200, b.x, u), y: lerp(170, b.y, u), z: lerp(-400, b.z, u), f: 1000, hy: lerp(600, b.hy, u), dir: 1 };
    const { A, S, P } = houseStage(t, c, 0); bubbles(t, A, S, trioBo); extras(t, A, S, P);
  }
  const lawn = hshot(H_MED, .8, trioBo);
  const boys = hshot(H_TWO, 1.6, { size: 50, side: n => n === 'housam' ? 1 : -1, far: 240, dy: -200 });
  const walkShot = hshot(H_WIDE, .3, { size: 48 });
  function walkUp(t) {                                                         // up the walk and in, then the whoosh wipe
    walkShot(t);
    const u = seg(t, WIPE[0], ROOM); if (u <= 0) return;
    overlay(() => { const x = lerp(-W - 300, 0, ease(u)); X.fillStyle = '#FFE3F1'; X.beginPath(); X.moveTo(x, 0); X.lineTo(x + W + 300, 0); X.lineTo(x + W, H); X.lineTo(x - 300, H); X.closePath(); X.fill(); });
  }
  const arriveShot = rshot(R_ARRIVE, .6, { size: 50 });
  function arrive(t) {                                                         // the wipe slides off onto the bedroom
    arriveShot(t);
    const u = seg(t, ROOM, WIPE[1]); if (u >= 1) return;
    overlay(() => { const x = lerp(0, W + 300, ease(u)); X.fillStyle = '#FFE3F1'; X.beginPath(); X.moveTo(x, 0); X.lineTo(W + 10, 0); X.lineTo(W + 10, H); X.lineTo(x - 300, H); X.closePath(); X.fill(); });
  }
  const toys = rshot(R_TOYS, 0, {});
  const group = rshot(R_GROUP, .8, { size: 46, side: n => n === 'safadi' || n === 'alma' ? -1 : 1, far: 240, dy: -240, groupDy: -250 });
  const kids = rshot(R_KIDS, 1.8, { size: 50, side: n => n === 'jenna' ? -1 : 1, far: 250, dy: -230, groupDy: -260 });
  const almaShot = rshot(R_ALMA, 2.2, { size: 52, side: () => -1, far: 280, dy: -200 });
  const almaSad = rshot(R_ALMA_IN, 2.2, { size: 52, side: () => -1, far: 280, dy: -200 });
  const safShot = rshot(R_SAF, 2.0, { size: 50, side: n => n === 'safadi' ? -1 : 1, far: 280, dy: -260 });
  const door = rshot(R_DOOR, .8, { size: 50, side: () => 1, far: 280, dy: -240 });
  const clean = rshot(R_GROUP, .8, { size: 46 });
  const cleanKids = rshot(R_KIDS, 1.8, { size: 46 });
  const tired = rshot(R_GROUP, .8, { size: 46, groupDy: -250 });
  const slump = rshot(R_GROUP, .8, { size: 46 });
  function eureka(t) {                                                         // "EUREKA!", the puzzled faces; freeze; to be continued
    const tt = Math.min(t, FREEZE), { A, S, P } = roomStage(tt, R_EUREKA(tt), 1.8, { freeze: t > FREEZE }); bubbles(tt, A, S, { size: 58, side: () => 1, far: 260, dy: -210 }); extras(tt, A, S, P);
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

  // things that ride on top of any shot
  function extras(t, A, S, P) {
    if (room(t) && P.dir < 0) {                                                // knock knock, on the door
      const [dx, dy] = P.p(220, 130, 2);
      sfx('KNOCK', dx + 40, dy - 30, 56, '#FFFDF6', t - KNOCK, { life: .5, rot: -.08 });
      sfx('KNOCK!', dx + 70, dy + 30, 60, '#FFFDF6', t - KNOCK - .3, { life: .55, rot: .08 });
    }
    if (room(t) && !A.alma && P.dir > 0 && t < 28) sfx('WHOA...', W / 2, H * .22, 110, '#FFE066', t - 25.3, { life: 2.2 });   // the mess, at toy height
    const h = A.housam;
    if (h && t > EUREKA) { const r = 2.6 * S.housam * backOut(seg(t, EUREKA, EUREKA + .3)), bx = h.top[0] + 4.5 * S.housam, by = h.top[1] - 4 * S.housam;
      overlay(() => { circle(bx, by, r * 1.8, { fill: rgba('#FFF2A8', .35 + .15 * Math.sin(t * 20)), stroke: null }); circle(bx, by, r, { fill: '#FFE066', stroke: PAL.ink, lwPx: 3 });
        shape(rectPts(bx - r * .45, by + r * .8, r * .9, r * .6), { fill: '#B9C0C4', stroke: PAL.ink, lwPx: 2.5 }); });
      sfx('DING!', bx + 4 * S.housam, by - 2 * S.housam, 64, PAL.goldLt, t - EUREKA - .15, { life: .9, rot: .1 }); }
    if (room(t) && t > LEAVE[1]) {                                             // the slump: sighs and a yawn
      if (A.jenna) sfx('sigh...', A.jenna.top[0], A.jenna.top[1] - 2 * S.jenna, 44, '#E9E3F0', t - 128.0, { life: 1.4 });
      if (A.alma) sfx('sigh...', A.alma.top[0], A.alma.top[1] - 2 * S.alma, 44, '#E9E3F0', t - 128.9, { life: 1.4 });
      if (A.danny) sfx('YAWN', A.danny.top[0] + 3 * S.danny, A.danny.top[1] - 2 * S.danny, 48, '#E9E3F0', t - 128.7, { life: 1.3 });
    }
    if (t > CLEAN && t < TIRED + .6) for (const n of [...KIDS, 'alma']) {                         // a twinkle each time a toy is put away
      const r = A[n]; if (!r) continue;
      const u = cyc(n, t), c = frac(u), age = (c - .72) * PICK_T; if (u < 0 || age < 0 || age > .5) continue;
      const k = Math.sin(Math.PI * age / .5), x = r.handR[0] + 3 * S[n], y = r.handR[1] - 2 * S[n];
      overlay(() => { X.save(); X.translate(x, y); X.rotate(t * 3); shape(starPts(0, 0, 1.6 * S[n] * k, .35, 4), { fill: '#FFF5A8', stroke: '#F2B21E', lwPx: 2 }); X.restore(); });
    }
  }

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [2.9, lawn], [6.2, boys], [13.8, lawn], [OUT[0], walkUp], [ROOM, arrive], [25.0, toys], [27.8, group],
      [31.8, almaShot], [34.8, kids], [44.0, almaShot], [46.0, kids], [48.8, group], [SAF_IN[0] - .6, door], [53.4, group],
      [57.2, almaSad], [61.0, safShot], [64.8, kids], [70.2, safShot], [75.2, group], [CLEAN, clean], [83.4, cleanKids],
      [86.8, tired], [92.4, safShot], [97.6, almaSad], [100.4, kids], [106.6, safShot], [115.8, group], [118.0, safShot],
      [LEAVE[0] - .2, door], [LEAVE[1] + .2, slump], [EUREKA - .4, eureka],
    ] });
})();
