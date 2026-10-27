// Scene 21b: "Dolphin Royalty". The DCES science room after school (teacher view, rows: 2, as in scenes 18–19), then the library.
// Housam and Danny reprogram Robo-Safadi so "explain" no longer sends him haywire. Jenna and Alma come in, test it by doing
// their best Professor Safadi ("Ahem… Let me EXPLAIN…"), and the robot stays calm. Sigh. The girls are writing books to
// beat Safadi at the book fair: TA-DA, Dolphin Royalty (two covers and a mini poster, redrawn from the real ones). Princess
// Pearl and Jester Fester pop out of the book as coloring-page line art, Fester gets bonked, Jenna colors them in. Everyone
// races to the library and writes. "Professor Safadi… you shall see!" To be continued (into scene 22, the book fair).
// Blocking, science room (world units, left to right as the camera sees it): Jenna (−330, 930), Alma (−190, 945), Housam (40, 985)
// behind the AV cart (60, 940) with the laptop, Danny (175, 960) with a wrench at Robo-Safadi (240, 990). The girls come in at
// the door (−515, 1232). Library (reading-room view, +X is screen-left): the girls at the right-hand table, the boys at the left.
// Every shot is a pure function of t.
(() => {
  const R = LOCATIONS.science_room, L = LOCATIONS.school_library, LINES = ASSETS.scene.scene21b_dolphin_royalty.dialogue;
  const ACCENT = { housam: '#425DA0', danny: '#2E7D9A', jenna: '#D0508E', alma: '#994EC4' };

  // ---------- timing ----------
  const ENTER = { jenna: [2.4, 5.4], alma: [2.8, 5.8] };
  const FIX = [14.6, 19.2], SLY = [21.2, 22.4], IMIT = [22.4, 25.0], TEST = [25.0, 28.6], BEEP = 27.4, SIGH = [28.8, 30.6];
  const TADA = 39.8, PEARL_IN = 54.0, FESTER_IN = 59.2, DROP = [63.5, 64.3], BONK = 64.3, COLOR = [65.6, 67.8], POPS_OUT = 76.0;
  const WIPE = [76.2, 76.8], LIB0 = 76.8, RUN = [76.8, 79.4], LAPSE = [88.6, 91.0], SEE = 91.0, FREEZE = 94.2, END = 100;
  // the code fix, as typed in the insert: the haywire branch is backspaced and replaced
  const CODE = ['if trick:', '    give(broccoli)', 'elif treat:', '    give(candy)', 'elif explain:'];
  const OLD = '    llm("Robot goes haywire!")', NEW = '    stay_calm()  # no more haywire!';
  const PROMPT_A = 'Do something interesting and surprising!', PROMPT_B = ' Robot goes haywire!';

  // ---------- where everything is ----------
  const POS = { jenna: [-330, 930], alma: [-190, 945], housam: [40, 985], danny: [175, 960], cart: [60, 940], robot: [240, 990] };
  const LAPTOP = [40, 940], DOOR = [-515, 1232];
  const POP = { pearl: [-345, 218, 940], fester: [-170, 218, 940] }, POP_R = 64;          // the story clouds over the girls
  const LT = { jenna: L.table(1, 370), alma: L.table(1, 215), housam: L.table(1, -215), danny: L.table(1, -370) };
  const L_FRONT = { jenna: [235, 935], alma: [80, 935], housam: [-80, 935], danny: [-235, 935] };   // the finale: a row in front of the tables
  const L_DOOR = [-500, 1195], LAG = { jenna: 0, alma: .25, housam: .45, danny: .7 };
  const UNIT = { housam: HOUSAM_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT, alma: ALMA_UNIT };

  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  function at(name, t) {
    if (t < LIB0) {
      if (ENTER[name]) return { ...along([DOOR, [-470, 1150], POS[name]], t, ENTER[name]), fade: ease(seg(t, ENTER[name][0], ENTER[name][0] + .3)) };
      return { x: POS[name][0], z: POS[name][1], dist: 0, moving: false };
    }
    if (t >= SEE) return { x: L_FRONT[name][0], z: L_FRONT[name][1], dist: 0, moving: false };
    const s = LT[name], w = [RUN[0] + LAG[name], RUN[1] - .7 + LAG[name]];
    return along([L_DOOR, [-60, 1010], [0, s.z], [s.x, s.z]], t, w);
  }

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble && !l.group) who = l.speaker; return who; };
  const SIDE = { jenna: -1, alma: -.6, housam: .1, danny: .5, robot: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const inW = (t, a, b) => t > a && t < b;
  const lib = t => t >= LIB0;
  const popK = (t, t0) => backOut(seg(t, t0, t0 + .5)) * (1 - ease(seg(t, POPS_OUT, POPS_OUT + .4)));
  const watching = t => t > PEARL_IN && t < POPS_OUT;                       // the pops are up: everyone looks up at them
  const writeDy = (t, ph) => .25 * Math.sin(t * 13 + ph);
  // the end: everybody holds their work up, then turns to us
  const hold = t => lib(t) && t > SEE - .6;

  // ---------- poses ----------
  function housamPose(t, c) {
    const talk = speaking('housam', t), ls = lastLine(t, 'housam'), a = at('housam', t);
    const kb = c.kb ? c.local(c.kb) : [3.8, -14.6], type = (k = 1) => ({ handL: [kb[0] - 1.6 + .3 * Math.sin(t * 17) * k, kb[1] + .2 * Math.cos(t * 13) * k], handR: [kb[0] + 1.6 + .3 * Math.cos(t * 15) * k, kb[1] + .2 * Math.sin(t * 19) * k], handPoseL: 'fist', handPoseR: 'fist', lookX: .15, lookY: .55, turn: .1 });
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('housam', ls), turn: .25 * Math.sign(lookAt('housam', ls)), brows: 'normal', handL: [-3.6, -10.6], handR: [3.6, -10.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (lib(t)) return libPose('housam', t, c, o, a, talk);
    if (t < 5.8) set({ ...type(), brows: 'focused' });
    else if (t < 8.3) set({ lookX: -.85, turn: -.4, brows: 'up', mouth: 'o', eyes: t < 6.4 ? 'wide' : 'open' });
    else if (t < 11.0) set({ lookX: -.8, turn: -.35, brows: 'up', handR: [5.8, -15], handPoseR: 'palm', mouth: talk ? o.mouth : 'grin' });
    else if (t < 19.2) set({ ...type(t > FIX[0] ? 1.4 : .6), brows: 'focused', mouth: talk ? o.mouth : 'smile' });
    else if (t < IMIT[0]) set({ lookX: -.85, turn: -.4, brows: 'up', mouth: 'smile' });
    else if (t < TEST[0]) set({ lookX: -.85, turn: -.4, eyes: 'wide', brows: 'worried', mouth: 'o', handL: [-2.2, -19.5], handR: [2.2, -19.5], handPoseL: 'palm', handPoseR: 'palm' });
    else if (t < SIGH[0]) set({ lookX: .9, turn: .45, eyes: t < 26.6 ? 'squeeze' : 'wide', brows: 'worried', mouth: t > BEEP ? 'smile' : 'flat', handL: [-1.4, -17.5], handR: [1.4, -17.5], handPoseL: 'fist', handPoseR: 'fist', dy: .1 * Math.sin(t * 30) });
    else if (t < SIGH[1]) set({ eyes: 'closed', mouth: 'open', brows: 'worried', dy: .6 * on(t, SIGH[0], SIGH[1], .4), tilt: .1, handL: [-3.2, -8.6], handR: [3.2, -8.6] });
    else if (t < 37.0) set({ lookX: -.8, turn: -.35, brows: 'up', mouth: 'smile' });
    else if (t < TADA) set({ lookX: -.8, turn: -.35, handL: [-4.6, -15], handR: [4.6, -15], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', jump: .4 * kick(t, 37.3, 6), mouth: talk ? o.mouth : 'grin' });
    else if (t < PEARL_IN) set({ lookX: -.8, turn: -.4, eyes: 'wide', brows: 'up', mouth: t < 42 ? 'O' : 'grin', jump: .8 * kick(t, TADA + .1, 6) });
    else if (t > BONK && t < BONK + 1.2) set({ eyes: 'happy', mouth: 'open', handL: [-4.1, -14.1], handR: [4.1, -14.1], tilt: -.1, dy: .2 * bounce(t, 10) });
    else if (t > 70.6 && t < 74.6) set({ lookX: -.8, turn: -.35, handL: [-4.6, -16], handR: [4.6, -16], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', mouth: talk ? o.mouth : 'grin' });
    else if (t > 74.6) set({ handL: [-4.6, -24], handR: [4.6, -24], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 1.0 * kick(t, 74.9, 5) });
    else set({ lookX: -.9, lookY: -.6, turn: -.4, brows: 'up', mouth: talk ? o.mouth : (t > COLOR[0] ? 'grin' : 'o') });
    return o;
  }
  function dannyPose(t, c) {
    const talk = speaking('danny', t), ls = lastLine(t, 'danny'), a = at('danny', t);
    const o = { mouth: lipFlap(t, talk, 'grin'), lookX: lookAt('danny', ls), turn: .25 * Math.sign(lookAt('danny', ls)), brows: 'normal', handL: [-3.4, -10.2], handR: [3.4, -10.2], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (lib(t)) return libPose('danny', t, c, o, a, talk);
    const wrenching = { handR: [6.2 + .5 * Math.sin(t * 9), -15.5 + .4 * Math.cos(t * 9)], handPoseR: 'fist', handL: [5.0, -13], handPoseL: 'palm', lookX: .8, lookY: .1, turn: .45, brows: 'focused', mouth: 'smirk', wrench: true };
    if (t < 6.0) set(wrenching);
    else if (t < 11.0) set({ lookX: -.85, turn: -.4, brows: 'up', mouth: t < 8.2 ? 'o' : 'grin', handR: [3.4, -10.2], handPoseR: 'fist', wrench: true });
    else if (t < 14.6) set({ lookX: -.8, turn: -.4, brows: 'up', handR: [3.4, -10.2], handPoseR: 'fist', wrench: true, handL: [-4.8, -15], handPoseL: 'palm', mouth: talk ? o.mouth : 'grin' });
    else if (t < 19.2) set(wrenching);
    else if (t < IMIT[0]) set({ lookX: -.85, turn: -.4, brows: 'up', mouth: 'grin', handR: [3.4, -10.2], handPoseR: 'fist', wrench: true });
    else if (t < TEST[0]) set({ lookX: -.85, turn: -.4, eyes: 'wide', brows: 'up', mouth: 'O', handL: [-2.0, -19.6], handR: [2.0, -19.6], handPoseL: 'palm', handPoseR: 'palm' });
    else if (t < SIGH[0]) set({ lookX: .8, turn: .4, eyes: t < 26.0 ? 'squeeze' : 'wide', brows: 'worried', mouth: t > BEEP ? 'grin' : 'flat', handL: [-1.3, -19.4], handR: [1.3, -19.4], handPoseL: 'fist', handPoseR: 'fist' });
    else if (t < SIGH[1]) set({ eyes: 'closed', mouth: 'open', brows: 'worried', dy: .7 * on(t, SIGH[0], SIGH[1], .4), tilt: -.12, handL: [-3.0, -8.4], handR: [3.0, -8.4] });
    else if (t < TADA) set({ lookX: -.85, turn: -.4, brows: 'up', mouth: 'smile' });
    else if (t < 51.6) set({ lookX: -.85, turn: -.45, eyes: 'wide', mouth: 'O', brows: 'up', handL: [-4.3, -15], handR: [4.3, -15], handPoseL: 'palm', handPoseR: 'palm', jump: 1.0 * kick(t, TADA + .1, 6) });
    else if (t < PEARL_IN) set({ lookX: -.85, turn: -.4, handR: [4.6, -14], handPoseR: 'palm', brows: 'up', mouth: talk ? o.mouth : 'grin' });
    else if (t > BONK && t < BONK + 1.4) set({ eyes: 'happy', mouth: 'open', handL: [-3.5, -12.1], handR: [3.5, -12.1], tilt: -.14, dy: .22 * bounce(t, 11, 2) });
    else if (t > 67.8 && t < 70.6) set({ handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'fist', handPoseR: 'fist', eyes: 'wide', mouth: talk ? o.mouth : 'grin', jump: .9 * kick(t, 68.1, 6), lookX: -.6, turn: -.3, brows: 'up' });
    else if (t > 74.6) set({ handL: [-4.3, -21], handR: [4.3, -21], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 1.2 * kick(t, 74.9, 5) });
    else set({ lookX: -.9, lookY: -.6, turn: -.4, brows: 'up', mouth: talk ? o.mouth : (t > COLOR[0] ? 'grin' : 'o') });
    return o;
  }
  // Jenna and Alma: in through the door, then the test, the books and the story
  function jennaPose(t, c) {
    const talk = speaking('jenna', t), ls = lastLine(t, 'jenna'), a = at('jenna', t);
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('jenna', ls), turn: .2 * Math.sign(lookAt('jenna', ls)), brows: 'up', handL: [-2.6, -11.6], handR: [2.6, -11.6], handPoseL: 'fist', handPoseR: 'fist' };
    const set = p => Object.assign(o, p);
    if (lib(t)) return libPose('jenna', t, c, o, a, talk);
    if (a.moving) return Object.assign(o, jennaSkip(a.dist / 44, 1), { lookX: .6, turn: .3, mouth: 'grin', handL: [-2.6, -11.6], handR: [2.6, -11.6] });
    if (t < 19.2) set({ lookX: .75, turn: .35, handPoseL: 'hip', handPoseR: 'hip', handL: undefined, handR: undefined, lean: t > 5.8 && t < 8.2 ? .08 : 0, mouth: talk ? o.mouth : 'smile' });
    else if (t < SLY[0]) set({ handR: [3.6, -19.5], handPoseR: 'palm', jump: .6 * kick(t, 19.5, 6), lookX: .8, turn: .4, mouth: talk ? o.mouth : 'grin' });
    else if (t < IMIT[0]) set({ lookX: .85, turn: .35, eyes: 'open', brows: 'normal', mouth: 'smirk' });
    else if (t < TEST[0]) set({ handR: [.9, -17.4 + .2 * Math.sin(t * 7)], handPoseR: 'fist', handPoseL: 'hip', handL: undefined, eyes: 'closed', brows: 'up', tilt: -.08, lookX: 0, turn: 0, mouth: talk ? o.mouth : 'smirk' });
    else if (t < SIGH[0]) set({ lookX: .95, turn: .45, eyes: 'wide', brows: 'up', mouth: t > BEEP ? 'grin' : 'o', handL: [-1.0, -17.2], handR: [1.0, -17.2], handPoseL: 'fist', handPoseR: 'fist' });
    else if (t < SIGH[1]) set({ eyes: 'closed', mouth: 'open', brows: 'up', dy: .6 * on(t, SIGH[0], SIGH[1], .4), tilt: .1, handL: [-2.6, -9.6], handR: [2.6, -9.6] });
    else if (t < TADA - .2) set({ lookX: .75, turn: .35, mouth: talk ? o.mouth : 'smile', ...(t > 33.8 && t < 37.0 ? { handL: [-3.8, -17], handPoseL: 'palm', jump: .4 * kick(t, 33.9, 6) } : {}) });
    else {                                                                    // the book: TA-DA overhead, then held at the chest
      const up = t < 41.4;
      set({ book: 'green', bookAt: up ? 'high' : 'chest', handR: up ? [5.4, -19] : [2.6, -9.6], handPoseR: 'fist', jump: .7 * kick(t, TADA + .05, 6), eyes: up ? 'happy' : 'open', lookX: .7, turn: .3, mouth: talk ? o.mouth : 'grin', handL: up ? [-3.8, -21] : [-2.6, -11.6], handPoseL: up ? 'palm' : 'fist' });
      if (watching(t)) set({ lookY: -.6, lookX: .5 });
      if (t > 65.0 && t < 67.6) set({ handL: [-4.4, -22], handPoseL: 'point', jump: .4 * kick(t, 65.3, 6), lookX: .3, lookY: -.7, eyes: 'happy' });
      if (t > 72.6 && t < 74.6) set({ handL: [-5.0, -18], handPoseL: 'point', lookX: .8, lookY: 0, turn: .35, jump: .5 * kick(t, 72.9, 6) });
      if (t > 74.6) set({ handL: [-3.8, -24], handPoseL: 'fist', eyes: 'happy', jump: 1.0 * kick(t, 74.9, 5), bookAt: 'high', handR: [5.4, -19] });
    }
    return o;
  }
  function almaPose(t, c) {
    const talk = speaking('alma', t), ls = lastLine(t, 'alma'), a = at('alma', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('alma', ls), turn: .2 * Math.sign(lookAt('alma', ls)), brows: 'normal', handL: [-2.6, -7.6], handR: [2.6, -7.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (lib(t)) return libPose('alma', t, c, o, a, talk);
    if (a.moving) return Object.assign(o, almaSkip(a.dist / 44, 1), { lookX: .5, turn: .3, mouth: 'grin' });
    if (t < 19.2) set({ lookX: .75, turn: .35, mouth: talk ? o.mouth : 'smile', brows: t > 6 && t < 8 ? 'up' : 'normal' });
    else if (t < SLY[0]) set({ handL: [-4.4, -17.5], handR: [4.4, -17.5], handPoseL: 'palm', handPoseR: 'palm', jump: .6 * kick(t, 19.5, 6), lookX: .8, turn: .4, brows: 'up', mouth: talk ? o.mouth : 'grin' });
    else if (t < IMIT[0]) set({ lookX: -.85, turn: -.35, brows: 'normal', mouth: 'smirk' });
    else if (t < TEST[0]) set({ handR: [3.6, -17.6], handPoseR: 'point', handL: [-1.4, -6.4], handPoseL: 'fist', eyes: 'closed', brows: 'up', tilt: -.1, lookX: 0, turn: 0, jump: .3 * kick(t, 23.4, 6), mouth: talk ? o.mouth : 'smirk' });
    else if (t < SIGH[0]) set({ lookX: .95, turn: .45, eyes: 'wide', brows: 'up', mouth: t > BEEP ? 'grin' : 'o', handL: [-1.0, -12.4], handR: [1.0, -12.4], handPoseL: 'fist', handPoseR: 'fist' });
    else if (t < SIGH[1]) set({ eyes: 'closed', mouth: 'open', brows: 'worried', dy: .5 * on(t, SIGH[0], SIGH[1], .4), tilt: -.1 });
    else if (t < TADA - .2) set({ lookX: .75, turn: .35, mouth: talk ? o.mouth : 'smile', ...(t > 30.8 && t < 33.6 ? { handL: [-4.0, -13], handPoseL: 'palm' } : {}) });
    else {
      const up = t < 41.4;
      set({ book: 'gold', bookAt: up ? 'high' : 'chest', handR: up ? [5.6, -14.5] : [3.0, -5.0], handPoseR: 'fist', handL: up ? [-3.8, -17] : [-2.6, -7.6], handPoseL: up ? 'palm' : 'open', jump: .7 * kick(t, TADA + .05, 6), eyes: up ? 'happy' : 'open', lookX: .7, turn: .3, mouth: talk ? o.mouth : 'grin' });
      if (watching(t)) {                                                     // presenting the story: a hand up toward each cloud
        const toFester = t > FESTER_IN - .3;
        set({ handL: toFester ? [-1.0, -18.5] : [-4.4, -17.5], handPoseL: 'palm', lookX: toFester ? .2 : -.4, lookY: -.7, turn: 0, eyes: t > PEARL_IN + .2 && t < PEARL_IN + 1.4 ? 'star' : 'open' });
        if ((t > 56.0 && t < 58.8) || (t > 61.8 && t < 64.3)) set({ lookX: .8, lookY: 0, turn: .35 });   // telling the boys
        if (t > BONK && t < BONK + 1.2) set({ eyes: 'happy', mouth: 'open', dy: .2 * bounce(t, 10), lookY: -.5 });
      }
      if (t > 74.6) set({ handL: [-3.8, -19], handPoseL: 'fist', eyes: 'happy', jump: 1.0 * kick(t, 74.9, 5), bookAt: 'high', handR: [5.6, -14.5] });
    }
    return o;
  }
  // the library: run in, write, hold the work up, then turn to us
  function libPose(name, t, c, o, a, talk) {
    const set = p => Object.assign(o, p);
    if (a.moving) {
      const walk = { housam: housamDribble, danny: dannyDribble, jenna: jennaSkip, alma: almaSkip }[name];
      return Object.assign(o, walk(a.dist / 46, 1), { lookX: 0, mouth: 'grin', brows: 'up', ...(name === 'jenna' ? { handL: [-2.6, -11.6], handR: [2.6, -11.6] } : {}), ball: undefined });
    }
    const pen = c.pen ? c.local(c.pen) : [2, -9], rest = c.rest ? c.local(c.rest) : [-2, -9], ph = { housam: 0, danny: 1.3, jenna: 2.1, alma: 3.4 }[name];
    set({ handR: [pen[0] + .5 * Math.sin(t * 9 + ph), pen[1] + .25 * Math.cos(t * 13 + ph)], handPoseR: 'fist', handL: rest, handPoseL: name === 'jenna' ? 'grip' : 'palm', lookX: .1, lookY: .75, turn: 0, brows: 'focused', mouth: 'smile', dy: .1 * Math.sin(t * 2 + ph), tool: true });
    if (name === 'housam' && t > 86.2 && t < 87.6) set({ handR: [4.1, -24], handPoseR: 'point', eyes: 'wide', brows: 'up', mouth: 'grin', lookY: -.3, jump: .5 * kick(t, 86.3, 6), tool: false });
    if (name === 'danny' && t > 86.6 && t < 88.0) set({ handR: [5.6, -20], handPoseR: 'fist', lookX: .6, lookY: -.2, mouth: 'flat', brows: 'worried', tool: false });   // the toss
    if (inW(t, ...LAPSE)) set({ dy: .1 * Math.sin(t * 6 + ph) });
    if (hold(t)) {
      const u = ease(seg(t, SEE - .6, SEE)), up = { housam: [6.6, -21], danny: [6.2, -18], jenna: [6.0, -19], alma: [6.0, -14.5] }[name];
      set({ handR: mixPt(o.handR, up, u), handPoseR: 'fist', lookX: 0, lookY: 0, turn: 0, brows: 'up', eyes: t > 92.6 && t < 93.2 && (name === 'jenna' || name === 'danny') ? 'wink' : 'open', mouth: talk ? lipFlap(t, talk, 'grin') : 'smirk', tool: false, held: u > .5, dy: 0 });
    }
    return o;
  }
  // Robo-Safadi: calm cyan eyes. During the test he twitches, glances left and right, then a happy little beep
  function robotPose(t) {
    const o = { eyes: 'open', mouth: 'flat', handL: [-4.4, -8.6], handR: [4.4, -8.6], handPoseL: 'claw', handPoseR: 'claw', lookX: 0, antenna: .05 };
    if (t < 6.0 || inW(t, ...FIX)) Object.assign(o, { antenna: .05 + .15 * Math.sin(t * 9), tilt: .02 * Math.sin(t * 9) });
    if (inW(t, ...TEST)) {
      Object.assign(o, { antenna: .4 * boing(t, 25.6, 4, 4), jump: .3 * kick(t, 25.6, 8), lookX: t > 26.0 && t < 26.6 ? -.8 : t > 26.6 && t < 27.2 ? .8 : 0, blink: t > 25.2 && t < 25.45 ? 1 : undefined });
      if (t > BEEP) Object.assign(o, { eyes: 'happy', mouth: 'smile', emote: 'heart', emoteK: on(t, BEEP, TEST[1] + 1, .2) });
    }
    if (t > TADA && t < TADA + 1.2) Object.assign(o, { eyes: 'wide', antenna: .3 * boing(t, TADA, 4, 4) });
    if (t > BONK && t < BONK + 1.4) Object.assign(o, { eyes: 'happy', mouth: 'grin', dy: .1 * bounce(t, 12) });
    return o;
  }

  // ---------- the story pops: Princess Pearl and Jester Fester, coloring-page line art until Jenna colors them in ----------
  const LINEART = 'grayscale(1) brightness(1.85) contrast(1.7)';
  function pearlFig(x, y, k, t) {
    pearl(x, y + 40 * k, PP_UNIT * k * .44, { t, sit: 1, headTilt: .12 + .05 * Math.sin(t * 1.3), wag: Math.sin(t * 3), eyes: t > 56.0 && t < 58.8 ? 'happy' : 'open', lookX: .4,
      mouth: t > BONK + .1 && t < BONK + 1.6 ? 'open' : 'smirk', brows: 'up', crownLift: .4 * kick(t, PEARL_IN + .2, 5), point: t > 56.4 && t < 58.6 ? .8 : 0, pointAng: -.6, noShadow: true });
  }
  function festerFig(x, y, k, t) {
    const s = JF_UNIT * k * .52, fy = y + 42 * k, juggling = t < DROP[0], c = cascade(t, { n: 3, tau: .34, h: 12, t0: FESTER_IN + .2 });
    const dazed = t > BONK && t < 70.0;
    const pose = juggling ? { handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup', eyes: 'happy', mouth: 'grin', lookY: -.4 }
      : { handL: [-3.6, -15.5], handR: [3.6, -15.5], handPoseL: 'open', handPoseR: 'open', eyes: dazed ? 'swirl' : 'wide', lookY: -.8, mouth: dazed ? 'wobble' : 'o', stars: dazed ? 1 : 0, hatAskew: dazed ? .3 : 0, sq: .12 * kick(t, BONK, 7) };
    const A = jester(x, fy, s, { t, noShadow: true, jump: .6 * kick(t, FESTER_IN + .2, 5), ...pose });
    if (juggling) c.balls.forEach(b => jugglerBall(x + b.x * s, fy + b.y * s, BALL_R * s, b.col, b.rot));
    else {                                                                  // the third ball goes up… and comes down on his head
      const top = [A.hatBase[0], A.hatBase[1] - .6 * s], u = seg(t, DROP[0], BONK), v = seg(t, BONK, BONK + 1.0);
      const p = t < BONK ? [top[0] + 1.5 * s * (1 - u), lerp(fy - 46 * s, top[1], easeIn(u))] : [top[0] + 14 * s * v, top[1] - 9 * s * Math.sin(Math.PI * v) + 6 * s * v * v];
      if (v < 1) jugglerBall(p[0], p[1], BALL_R * s, JUGGLE_COLS[2], t * 6);
    }
    return A;
  }
  function pops(t, P) {
    const kP = popK(t, PEARL_IN), kF = popK(t, FESTER_IN), u = seg(t, COLOR[0], COLOR[1]);
    if (kP <= .01 && kF <= .01) return;
    const pp = P.p(...POP.pearl), pf = P.p(...POP.fester); if (!P.visible(POP.pearl[2])) return;
    const xL = pp[0] - POP_R * 1.1 * pp[2], xR = pf[0] + POP_R * 1.1 * pf[2], xw = lerp(xL, xR, u), yT = pp[1] - POP_R * pp[2], yB = pp[1] + POP_R * pp[2];
    const wipe = () => { const pts = [[xL - 20, yT - 40]], n = 9; for (let i = 0; i <= n; i++) pts.push([xw + (i % 2 ? 26 : -26) * pp[2] * .4, lerp(yT - 40, yB + 40, i / n)]); pts.push([xL - 20, yB + 40]); X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(...q) : X.moveTo(...q)); X.closePath(); X.clip(); };
    const paint = fig => { if (u >= 1) return fig(); layer(fig, { filter: LINEART }); if (u > 0) { X.save(); wipe(); fig(); X.restore(); } };
    dryPop(pp[0], pp[1], POP_R * pp[2], kP, t, () => paint(() => pearlFig(pp[0], pp[1], pp[2], t)));
    dryPop(pf[0], pf[1], POP_R * pf[2], kF, t, () => paint(() => festerFig(pf[0], pf[1], pf[2], t)));
    if (kF > .5) sfx('BONK!', pf[0] + 30 * pf[2], pf[1] - 50 * pf[2], 40 * pf[2], '#FFE066', t - BONK, { life: .9, rot: .12 });
    if (u > 0 && u < 1) {                                                  // the crayon, scribbling along the wipe
      const yy = lerp(yT, yB, .5 + .45 * Math.sin(t * 22)), cols = ['#F07AAE', '#4FB848', '#F4E43C', '#7A3E9C'];
      dryCrayon(xw, yy, 58 * pp[2], -.7, cols[Math.floor(u * 4) % 4]);
    }
  }

  // ---------- the books in hand ----------
  const BOOK_W = { jenna: 5.6, alma: 5.0 };
  function bookInHand(name, A, s, pose, t) {
    if (!pose.book) return;
    const w = BOOK_W[name] * s, h = w * DRY_SIZE[pose.book][1] / DRY_SIZE[pose.book][0], k = backOut(seg(t, TADA - .25, TADA + .1));
    dryCover(pose.book, A.handR[0] - .05 * w, A.handR[1] - h * .36, w, pose.bookAt === 'high' ? .1 : .04, { k, t });
  }
  function toolInHand(name, A, s, pose, t) {
    if (pose.wrench) saWrench(A.handR[0] - 1.2 * s, A.handR[1] + .4 * s, s / 62 * 9, -.25 + .25 * Math.sin(t * 9) * (pose.handR[0] > 5 ? 1 : 0));
    if (!pose.tool) return;
    if (name === 'alma') dryCrayon(A.handR[0] - .4 * s, A.handR[1] + 1.4 * s, 3.4 * s, 1.15, '#F07AAE');
    else spkPencil(A.handR[0] - .6 * s, A.handR[1] + 1.6 * s, 4.6 * s, 1.1);
  }

  // ---------- the science room, for a camera ----------
  const CAST = { housam: { pose: housamPose, rig: housam }, danny: { pose: dannyPose, rig: danny }, jenna: { pose: jennaPose, rig: jenna }, alma: { pose: almaPose, rig: alma } };
  const HEADW = { housam: 5.6, danny: 5.4, jenna: 4.6, alma: 6.6 };
  function wallBoard() {
    saMarker('PROJECT: ROBO-SAFADI', 30, 52, 36, 1, '#D0508E');
    saMarker('step 3: NO MORE HAYWIRE', 30, 104, 28, 1, '#2F5FB0');
    saMarker('BOOK FAIR next week!!', 400, 104, 28, 1, '#994EC4');
  }
  function drawKid(name, P, t, A, S, ctx, o) {
    const c = CAST[name], a = at(name, t), [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[name] * k;
    const pose = { ...c.pose(t, { ...ctx(name), local: pt => [(pt[0] - sx) / s, (pt[1] - sy) / s] }), t };
    if (o.freeze) pose.boil = 0;
    const draw = () => { A[name] = c.rig(sx, sy, s, pose); toolInHand(name, A[name], s, pose, t); bookInHand(name, A[name], s, pose, t); if (pose.held) heldPage(name, A[name], s, t); };
    if (a.fade !== undefined && a.fade < 1) { X.save(); X.globalAlpha = a.fade; draw(); X.restore(); } else draw();
    S[name] = s;
  }
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {}, SET = { rows: 2, bubbling: 1, board: wallBoard };
    const kb = measure(() => ieLaptop(P, LAPTOP[0], LAPTOP[1], t));
    const actors = [];
    for (const name of Object.keys(CAST)) { const a = at(name, t); if (P.depth(a.z) < 60) continue; actors.push({ z: a.z, draw: () => drawKid(name, P, t, A, S, () => ({ kb }), o) }); }
    actors.push({ z: POS.robot[1], draw: () => { const [sx, sy, k] = P.p(POS.robot[0], 0, POS.robot[1]); A.robot = roboSafadi(sx, sy, ROBO_SAFADI_UNIT * k, { ...robotPose(t), t, ...(o.freeze ? { boil: 0 } : {}) }); S.robot = ROBO_SAFADI_UNIT * k; } });
    actors.push({ z: 966, draw: () => ieCable(P, [LAPTOP[0] - 30, IE_CART.top + 2, LAPTOP[1] + 10], [POS.robot[0] - 22, 34, POS.robot[1]]) });
    actors.push({ z: POS.cart[1], draw: () => { ieCart(P, POS.cart[0], POS.cart[1], t); ieLaptop(P, LAPTOP[0], LAPTOP[1], t, 1); } });
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => R.back(P, t, { ...SET, splitZ: actors[0].z }), { blur });
    actors.forEach((a, i) => { a.draw(); R.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z }); });
    pops(t, P);
    return { A, S, P };
  }

  // ---------- the library, for a camera ----------
  const LSET = t => ({ sun: lerp(1, .3, ease(seg(t, ...LAPSE))), lamps: lerp(.55, 1, ease(seg(t, ...LAPSE))) });
  const PAPER_Z = 812;
  const paperN = (name, t) => clamp(seg(t, 79.4 + LAG[name], LAPSE[1]) * 1.4);
  function libStage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {}, set = LSET(t);
    const list = Object.keys(CAST).map(name => ({ name, a: at(name, t) })).filter(it => P.depth(it.a.z) > 40).sort((p, q) => P.depth(q.a.z) - P.depth(p.a.z));
    const ctx = name => { const s = LT[name], side = name === 'jenna' || name === 'alma' ? 1 : -1;
      return { pen: P.p(s.x - side * 10, L.TABLE_H + 9, 778), rest: P.p(s.x + side * 30, L.TABLE_H + 8, 776) }; };
    layer(() => L.back(P, t, { ...set, splitZ: list.length ? list[0].a.z : undefined }), { blur });
    list.forEach((it, i) => { drawKid(it.name, P, t, A, S, ctx, o); L.front(P, t, { ...set, splitZ: it.a.z, toZ: i + 1 < list.length ? list[i + 1].a.z : undefined }); });
    if (t > RUN[1] - .4) for (const name of Object.keys(CAST)) {             // the work on the table: paper (a stack, by the end), or Jenna's sketchbook
      const s = LT[name], n = paperN(name, t), stack = Math.floor(n * 4);
      for (let i = 0; i <= stack; i++) dryPaper(P, s.x + (hash(i + s.x) - .5) * 14, L.TABLE_H + i * .8, PAPER_Z + (hash(i * 3 + s.x) - .5) * 8, 52, 40, (hash(i * 7 + s.x) - .5) * .3, { n: i < stack ? 1 : n * 4 - stack, seed: i, ink: name === 'alma' ? '#E05A9A' : '#5A6A8A' });
    }
    // Danny's crumpled draft, over his shoulder
    if (t > 87.0 && t < 88.6) { const v = seg(t, 87.0, 88.4), d = LT.danny, [x, y, k] = P.p(d.x + 60 * v, 120 + 90 * Math.sin(Math.PI * v) - 60 * v, d.z + 10 - 120 * v);
      if (P.visible(d.z - 120 * v)) circle(x, y, 7 * k, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 1.5 }); }
    return { A, S, P };
  }
  function heldPage(name, A, s, t) {                                         // at the end: a page (boys) or the book (girls) held up
    if (name === 'jenna' || name === 'alma') return dryCover(name === 'jenna' ? 'green' : 'gold', A.handR[0], A.handR[1] - BOOK_W[name] * s * .62, BOOK_W[name] * s, -.05, { t });
    const w = 6.0 * s, h = w * 1.3, x = A.handR[0], y = A.handR[1] - h * .42;
    X.save(); X.translate(x, y); X.rotate(.05); shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 2 });
    for (let i = 0; i < 7; i++) line([[-w * .36, -h * .36 + i * h * .11], [-w * .36 + w * .72 * (.6 + .4 * hash(i + (name === 'danny' ? 9 : 0))), -h * .36 + i * h * .11]], { stroke: '#5A6A8A', lwPx: 1.5 });
    X.restore();
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
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.3 : 1.1), dx: o.groupDx ?? 0, dy: o.groupDy ?? -200 }); continue;
        }
      }
      const a = A?.[l.speaker], s = S?.[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: o.dy ?? -220 });
      } else {                                                                // off-screen: from the frame edge on their side
        const sd = o.edgeSide ?? (SIDE[l.speaker] > 0 ? 1 : -1);
        if (!sd) callout(l.text, W / 2, H + 30, age, { ...c, size: c.size * 1.1, dx: 0, dy: -200 });
        else callout(l.text, sd > 0 ? W + 30 : -30, o.edgeY ?? H * .4, age, { ...c, dx: -sd * 420, dy: -150 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const GROUP = cam(-60, 150, 520, 560, 900);                               // everyone: the girls, the boys, the cart, the robot
  const BOYS = cam(110, 130, 690, 560);
  const GIRLS = cam(-262, 128, 640, 590);                                   // the girls, with room above for the story clouds
  const GIRLS_MS = cam(-262, 112, 770, 480);                               // the girls, medium (their lines, TA-DA)
  const ROBOT_CU = t => ({ ...cam(238, 150, 800, 400, 1100)(t), z: lerp(800, 850, ease(seg(t, TEST[0], TEST[1]))) });
  const POP_CU = cam(-258, 205, 735, 560, 1000);                             // the two clouds, big
  const LIB_RUN = cam(0, 180, 1370, 520, 700, -1);
  const LIB_W = cam(0, 190, 1130, 470, 800, -1);
  const LIB_GIRLS = cam(290, 170, 1020, 440, 1000, -1);
  const LIB_BOYS = cam(-290, 170, 1020, 440, 1000, -1);
  const LIB_END = t => ({ ...cam(0, 110, 1072, 560, 400, -1)(t), z: lerp(1072, 1060, ease(seg(t, SEE, FREEZE))) });

  const shot = (camFn, blur, bo, go) => t => { const { A, S, P } = stage(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const lshot = (camFn, blur, bo, go) => t => { const { A, S, P } = libStage(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const groupBo = { size: 46, side: n => n === 'danny' || n === 'housam' ? 1 : -1, far: 260, dy: -250, groupDy: -260 };
  function opening(t) {                                                      // from across the room to everyone; the girls come in
    const u = ease(seg(t, .2, 4.2)), a = { x: 30, y: 175, z: 140, f: 800, hy: 560 }, b = GROUP(t);
    const c = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u), dir: 1 };
    const { A, S, P } = stage(t, c, .6 * u); bubbles(t, A, S, groupBo); extras(t, A, S, P);
  }
  const group = shot(GROUP, .8, groupBo);
  const boys = shot(BOYS, 2.0, { size: 50, side: n => n === 'danny' ? 1 : -1, far: 260, dy: -330, groupDy: -300 });
  const girlsMS = shot(GIRLS_MS, 2.4, { size: 52, side: n => n === 'jenna' ? -1 : 1, far: 240, dy: -230, groupDy: -250, edgeSide: 1 });
  const girls = shot(GIRLS, 2.0, { size: 50, side: n => n === 'jenna' ? -1 : 1, far: 260, dy: -200, groupDy: -330, edgeSide: 1 });
  const robotCU = shot(ROBOT_CU, 3.2, { size: 52 });
  const popCU = shot(POP_CU, 3.4, { size: 50, edgeSide: 0 });
  function insertFix(t) {                                                    // the laptop: the haywire branch goes, stay_calm() comes in
    const back = seg(t, 15.0, 16.0), type = seg(t, 16.2, 17.2);
    const l6 = back < 1 ? OLD.slice(0, Math.round(OLD.length * (1 - back))) : NEW.slice(0, Math.max(4, Math.round(NEW.length * type)));
    const pb = PROMPT_B.slice(0, Math.round(PROMPT_B.length * (1 - seg(t, 16.0, 16.8))));
    const calm = t > 16.8;
    ieEditor(t, { code: [...CODE, l6], panel: 'llm', prompt: PROMPT_A, promptRed: pb, hl: t > 17.4 ? 5 : null,
      clawd: calm ? { eyes: 'happy', mouth: 'smile', aL: .8, aR: .8, jump: .8 * kick(t, 16.9, 6) } : { eyes: 'swirl', mouth: 'wobble', rot: .08 * Math.sin(t * 13), aL: 1.2 * Math.sin(t * 11), aR: 1.2 * Math.cos(t * 9) } });
    if (calm) sfx('DING!', 1540, 300, 70, '#5AF78E', t - 17.0, { life: .9, rot: -.08 });
    bubbles(t, null, null, { size: 50, edgeY: H * .86, edgeSide: -1 });
  }
  // the covers, full frame: the girls' real books, slowly pushed in, over the science room out of focus
  function coverInsert(kind, t0, t1) {
    return t => {
      layer(() => stage(t, GIRLS(t), 0, {}), { blur: 14 });
      X.save(); X.fillStyle = 'rgba(40,20,30,.28)'; X.fillRect(0, 0, W, H); X.restore();
      const u = ease(seg(t, t0, t1)), land = backOut(seg(t, t0, t0 + .45)), poster = kind === 'poster';
      const unfold = poster ? easeOut(seg(t, t0, t0 + .7)) : 1;
      const w = poster ? lerp(1240, 1320, u) : lerp(600, 650, u), x = poster ? W * .44 : W * .4, y = H / 2 + (1 - land) * 300;
      X.save(); X.translate(x, y); X.scale(1, poster ? lerp(.05, 1, unfold) : 1); dryCover(kind, 0, 0, w, (poster ? .02 : -.03) + .01 * Math.sin(t), { t }); X.restore();
      if (kind === 'gold') sfx('TA-DA!', W * .76, H * .2, 90, PAL.goldLt, t - t0, { life: 1.1 });
      bubbles(t, null, null, { size: 52, edgeSide: 1, edgeY: H * .55 });
    };
  }
  const coverGold = coverInsert('gold', 41.0, 44.6), coverGreen = coverInsert('green', 44.6, 48.0), poster = coverInsert('poster', 48.0, 51.4);
  function groupOut(t) {                                                     // "TO THE LIBRARY!": everyone, then the whoosh wipe
    group(t);
    const u = seg(t, ...WIPE); if (u <= 0) return;
    overlay(() => { const x = lerp(-W - 300, 0, ease(u)); X.fillStyle = '#FFF4D6'; X.beginPath(); X.moveTo(x, 0); X.lineTo(x + W + 300, 0); X.lineTo(x + W, H); X.lineTo(x - 300, H); X.closePath(); X.fill(); });
  }
  const libRunShot = lshot(LIB_RUN, 0, { size: 44 });
  function libRun(t) {                                                       // the wipe slides off; the kids run in to the tables
    libRunShot(t);
    const u = seg(t, LIB0, LIB0 + .5); if (u >= 1) return;
    overlay(() => { const x = lerp(0, W + 300, ease(u)); X.fillStyle = '#FFF4D6'; X.beginPath(); X.moveTo(x, 0); X.lineTo(W + 10, 0); X.lineTo(W + 10, H); X.lineTo(x - 300, H); X.closePath(); X.fill(); });
  }
  const libWrite = lshot(LIB_W, .6, {});
  const libGirls = lshot(LIB_GIRLS, 2.0, {});
  const libBoys = lshot(LIB_BOYS, 2.0, {});
  const libLapse = lshot(LIB_W, .6, {});
  function libEnd(t) {
    const tt = Math.min(t, FREEZE), { A, S, P } = libStage(tt, LIB_END(tt), 1.2, { freeze: t > FREEZE }); bubbles(tt, A, S, { size: 52, groupDy: -200 }); extras(tt, A, S, P);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .45 * k; X.fillStyle = '#E8B49A'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#D97757'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 98.0, 99.4))));
  }

  // things that ride on top of any shot
  function extras(t, A, S, P) {
    const r = A.robot, d = A.danny, h = A.housam;
    if (r) { sfx('...', r.antenna[0] + 5 * S.robot, r.antenna[1] - 2 * S.robot, 50, '#E9FBFF', t - 25.7, { life: 1.4 }); sfx('beep!', r.antenna[0] + 6 * S.robot, r.antenna[1], 46, '#7FE3FF', t - BEEP, { life: .9, rot: .1 }); }
    if (d && !lib(t)) sfx('clank', d.handR[0] + 3 * S.danny, d.handR[1] - 4 * S.danny, 34, '#C9D1D6', t - 1.0, { life: .6 });
    if (h && lib(t)) { sfx('!', h.top[0] + 3 * S.housam, h.top[1] - 2 * S.housam, 80, PAL.goldLt, t - 86.3, { life: .9 }); if (t > 86.3 && t < 87.6) bulb(h.top[0] + 4 * S.housam, h.top[1] - 4 * S.housam, 2.4 * S.housam * backOut(seg(t, 86.3, 86.6)), t); }
    if (lib(t) && inW(t, 79.6, LAPSE[1])) for (const name of ['jenna', 'alma', 'housam', 'danny']) {   // scribble marks over the busy hands
      const a = A[name]; if (!a || (name === 'housam' && t > 86.2 && t < 87.6)) continue;
      sfx('scribble', a.handR[0], a.handR[1] - 3 * S[name], 22, '#5A6A8A', frac(t * .6 + LAG[name]) * 1.6 - .2, { life: .7 });
    }
    if (lib(t) && inW(t, ...LAPSE)) overlay(() => {                         // the time-lapse: a clock face spins in the corner
      const k = on(t, ...LAPSE, .3), cx = W - 140, cy = 140, rr = 80 * k; if (rr < 2) return;
      circle(cx, cy, rr, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 5 });
      const a1 = (t - LAPSE[0]) * 9, a2 = (t - LAPSE[0]) * .75;
      line([[cx, cy], [cx + Math.sin(a1) * rr * .8, cy - Math.cos(a1) * rr * .8]], { stroke: PAL.ink, lwPx: 4 }); line([[cx, cy], [cx + Math.sin(a2) * rr * .5, cy - Math.cos(a2) * rr * .5]], { stroke: PAL.crimson, lwPx: 6 });
    });
  }
  function bulb(x, y, r, t) {
    if (r < 1) return;
    circle(x, y, r * 1.8, { fill: rgba('#FFF2A8', .35 + .15 * Math.sin(t * 20)), stroke: null });
    circle(x, y, r, { fill: '#FFE066', stroke: PAL.ink, lwPx: 2.5 });
    shape(rectPts(x - r * .45, y + r * .8, r * .9, r * .6), { fill: '#B9C0C4', stroke: PAL.ink, lwPx: 2 });
  }

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [8.4, boys], [FIX[0], insertFix], [FIX[1], girlsMS], [TEST[0], robotCU], [TEST[1], group], [33.8, girlsMS], [37.2, boys],
      [TADA, girlsMS], [41.0, coverGold], [44.6, coverGreen], [48.0, poster], [51.4, boys], [53.8, girls], [61.6, popCU], [68.0, boys],
      [72.8, groupOut], [LIB0, libRun], [79.6, libWrite], [82.6, libGirls], [85.6, libBoys], [LAPSE[0], libLapse], [SEE, libEnd],
    ] });
})();
