// Scene 29: "Cleaning Up 2 · The Helping Hands". Straight on from scene 28's "EUREKA!", in Alma's half-cleaned bedroom.
// Alma: "What is eureka?" Housam: "In old Greece…" A ripple into his story: a sunny bathhouse, where Professor Safadi (in a
// chiton and laurel wreath) hums in a bubbly marble tub, feels around under the water, grabs something and leaps up:
// "EUREKA!" Splash. Doctor Sami (also in Greek clothes) hurries in: "Brother, what did you find?" Safadi opens his hand:
// "The soap!" It squirts out of his fingers and plops back in the tub; Sami face-palms. A ripple back to the bedroom, where
// the kids burst out laughing.
// Part 2: "And how about you, genius?" Housam's real idea: program Robo-Safadi to clean up and let the LLM decide where the
// toys go. He fetches the robot and his laptop, plugs in and types `llm("Clean up Alma's room")`. Guardrails, guaranteed.
// Clawd wakes ("Boopy boop!"), Robo-Safadi's chest swings open and every toy in the room flies into it. "ROOM CLEAN UP!"
// "But my toys are gone!" He powers down; the boys want to play Oligarchy; Jenna: Alma is sad. Professor Safadi comes
// in: "Wonderful job!" "But we have a small problem… Allow me to explain!" Safadi, puzzled. Freeze. To be continued.
// Blocking, bedroom (bed view, as in scene 28): Jenna (−215, 380), Danny (−120, 360), Housam (−25, 385), Alma (110, 430),
// Robo-Safadi (45, 600) on the far side of the rug, Professor Safadi (240, 330). The doorway is at (220, 50).
// Bathhouse: Safadi in the tub (0, 480); Sami comes in down the left colonnade to (−185, 430).
// Every shot is a pure function of t.
(() => {
  const BR = LOCATIONS.alma_bedroom, BA = LOCATIONS.roman_bath, LINES = ASSETS.scene.scene29_cleaning_up_2.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: PAL.crimson, sami: '#4C86A8', robo_safadi: '#FF2E2E', clawd: '#D97757' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT, robo_safadi: ROBO_SAFADI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, sami, robo_safadi: roboSafadi };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 6.6, sami: 6.6, robo_safadi: 6.8, clawd: 6 };
  const KIDS = ['jenna', 'danny', 'housam', 'alma'], GAME = { jenna: 'rainbow', danny: 'dolphins', housam: 'oligarchy' };

  // ---------- timing ----------
  const STORY = 3.3, WAVE1 = [5.6, 7.2], HUM = [7.2, 9.6], SEARCH = [9.6, 11.6], GRAB = 11.6, BULB = 11.8, EUREKA = 12.0;
  const SAMI_IN = [14.0, 16.2], SHOW = 19.0, SQUIRT = [21.0, 21.9], WAVE2 = [22.8, 24.4], LAUGH = 24.6, P2 = 29.2;
  // part 2: the robot
  const H_OUT = [51.6, 53.4], H_IN = [54.4, 57.0], R_IN = [54.8, 57.6], PLUG = 58.3, CODE_T = [59.4, 61.8], RUN = 74.6;
  const UNPLUG = 77.9, LID = 78.6, SET_DOWN = [79.0, 79.9], CMD = 80.6;                  // Housam puts the laptop away; Alma: "Clean up!"
  const POWER = 82.6, HATCH = [83.2, 83.8], SUCK = [83.8, 88.6], FLY = .55, CLOSE = [88.6, 89.1], SHING = 89.2, OFF_T = [94.1, 94.8];
  const GRAB_G = 94.8, SAF_IN = [100.8, 103.2], FREEZE = 114.2, END = 120.2;

  // ---------- where everyone is ----------
  const SPOT = { jenna: [-215, 380], danny: [-120, 360], housam: [-25, 385], alma: [110, 430] };
  const BOX_AT = { jenna: [-262, 400], danny: [-160, 330], housam: [20, 350] };          // their games, on the floor since scene 28
  const SAMI_PATH = [[-470, 1000], [-330, 720], [-185, 430]];
  const DOORWAY = [220, 50], ROBO = [45, 600], SAF_SPOT = [240, 330];
  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  function at(name, t) {
    if (name === 'housam' && t > H_OUT[0] && t < H_IN[1]) {                     // off to fetch the robot, and back
      if (t < H_OUT[1]) return { ...along([SPOT.housam, [175, 170], DOORWAY], t, H_OUT), fade: 1 - seg(t, H_OUT[1] - .4, H_OUT[1]) };
      if (t < H_IN[0]) return null;
      return { ...along([DOORWAY, [175, 170], SPOT.housam], t, H_IN), fade: ease(seg(t, H_IN[0], H_IN[0] + .35)) };
    }
    if (SPOT[name]) return { x: SPOT[name][0], z: SPOT[name][1] };
    if (name === 'robo_safadi') return t < R_IN[0] ? null : { ...along([DOORWAY, [40, 220], [30, 480], ROBO], t, R_IN), fade: ease(seg(t, R_IN[0], R_IN[0] + .35)) };
    if (name === 'safadi' && t > P2) return t < SAF_IN[0] ? null : { ...along([DOORWAY, [235, 190], SAF_SPOT], t, SAF_IN), fade: ease(seg(t, SAF_IN[0], SAF_IN[0] + .4)) };
    if (name === 'safadi') return { x: BA.TUB.x, z: BA.TUB.z };
    if (name === 'sami') return t < SAMI_IN[0] ? null : { ...along(SAMI_PATH, t, SAMI_IN), fade: ease(seg(t, SAMI_IN[0], SAMI_IN[0] + .3)) };
  }

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const SIDE = { jenna: -1, danny: -.65, housam: -.3, alma: .35, robo_safadi: .1, safadi: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const laughing = t => t > LAUGH - .1 && t < P2;

  // ---------- poses: the bedroom ----------
  const LAUGH_HANDS = { jenna: [[-.7, -12.6], [.7, -12.6]], danny: [[-3.5, -12.1], [3.5, -12.1]], housam: [[-4.1, -14.1], [4.1, -14.1]], alma: [[-1.2, -9.4], [1.2, -9.4]] };
  const REST_HANDS = { jenna: [[-2.6, -11.0], [2.6, -11.0]], danny: [[-3.4, -10.0], [3.4, -10.0]], housam: [[-3.6, -10.6], [3.6, -10.6]], alma: [[-2.6, -7.6], [2.6, -7.6]] };
  function kidPose(name, t) {
    if (t >= P2) return kidPose2(name, t);
    const talk = speaking(name, t), sd = name === 'jenna' || name === 'danny' ? 1 : -1;
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lookAt(name, 'housam'), brows: 'normal', handL: REST_HANDS[name][0], handR: REST_HANDS[name][1], handPoseL: 'open', handPoseR: 'open' };
    o.turn = .25 * Math.sign(o.lookX);
    const set = p => Object.assign(o, p);
    if (t < STORY) {                                                            // still puzzled by "EUREKA!"; Alma asks
      if (name === 'housam') set({ lookX: .7, turn: .35, mouth: 'grin', brows: 'up', eyes: 'happy', handR: [6.6, -25.5 + 2 * ease(seg(t, .2, 1.2))], handPoseR: 'point' });
      else set({ brows: name === 'alma' ? 'up' : 'worried', mouth: talk ? o.mouth : 'o', tilt: sd * .08, emote: '?', emoteK: name === 'alma' ? on(t, .3, 2.8, .2) : 1 - ease(seg(t, .8, 1.4)) });
      if (name === 'alma') set({ handR: [1.2, -11.2], handPoseR: 'fist', tilt: .1 });          // hand to chin
    } else if (t < WAVE1[1]) {                                                  // "In old Greece…": everyone leans in
      if (name === 'housam') { const sw = ease(seg(t, STORY, STORY + 1.8));
        set({ lookX: .25, lookY: -.6, turn: .1, brows: 'up', eyes: 'open', mouth: talk ? o.mouth : 'smile', handR: [lerp(3.6, 7.0, sw), lerp(-12, -21, sw)], handPoseR: 'palm', handL: [-3.0, -13.6], handPoseL: 'palm', tilt: -.06 * sw }); }
      else set({ eyes: 'wide', brows: 'up', mouth: 'o', lean: .05 * -sd, lookY: -.2 });
    }
    if (laughing(t)) {                                                          // the joke lands
      const ph = { jenna: 0, danny: 1.1, housam: 2.2, alma: 3.3 }[name], b = bounce(t, 11, ph), [hl, hr] = LAUGH_HANDS[name];
      set({ eyes: name === 'housam' || name === 'alma' ? 'squeeze' : 'happy', mouth: b > .45 ? 'open' : 'grin', brows: 'up', handL: hl, handR: hr, handPoseL: 'fist', handPoseR: 'fist',
        dy: .25 * b, tilt: -sd * .1 + .05 * Math.sin(t * 9 + ph), lookX: 0, turn: 0, lookY: -.2, jump: .9 * kick(t, LAUGH + ph * .05, 5), emote: null });
      if (name === 'danny') set({ rot: -.06 * Math.sin(t * 6), handL: [-3.5, -16.6], handR: [3.5, -16.6], handPoseL: 'palm', handPoseR: 'palm' });   // slapping the air
      if (name === 'jenna' && t > 27.6) set({ handL: [-1.8, -9.0], handR: [1.8, -9.0], dy: .6 + .3 * b, tilt: .14 });                                // holding her tummy
    }
    return o;
  }
  // ---------- poses: the bathhouse ----------
  function safadiPose(t) {
    const talk = speaking('safadi', t);
    const o = { outfit: 'greek', noShadow: true, dy: 1.0, mouth: lipFlap(t, talk, 'smile'), brows: 'normal', handL: [-4.4, -10.5], handR: [4.4, -10.5], handPoseL: 'open', handPoseR: 'open', blush: .55 };
    const set = p => Object.assign(o, p);
    if (t < HUM[1]) {                                                           // humming and scrubbing
      const sc = Math.sin(t * 7);
      set({ eyes: 'happy', mouth: frac(t * 1.6) < .5 ? 'o' : 'smile', tilt: .07 * Math.sin(t * 2.4), emote: 'music', emoteK: on(t, 7.6, HUM[1], .2),
        handR: [1.6 + .6 * sc, -21.5], handPoseR: 'fist', handL: [-3.6, -13.4 + .8 * sc], handPoseL: 'open' });                                         // scrubbing behind his head
    } else if (t < GRAB) {                                                      // something is missing: feeling around under the water
      const u = seg(t, SEARCH[0], GRAB);
      set({ handL: [-3.4, -6.2 + .6 * Math.sin(t * 9)], handR: [3.4, -6.2 + .6 * Math.cos(t * 9)], lookY: .8, lookX: .6 * Math.sin(t * 2.6), brows: 'focused', mouth: 'flat', lean: .05, dy: 1.6,
        emote: '?', emoteK: on(t, SEARCH[0] + .3, GRAB, .2) * (u > .2 ? 1 : 0) });
    } else if (t < EUREKA) {                                                    // got it!
      set({ handR: [5.0, -17], handPoseR: 'fist', eyes: 'wide', brows: 'up', mouth: 'o', bulb: backOut(seg(t, BULB, BULB + .25)), dy: .6, lookX: .3, lookY: -.3 });
    } else if (t < SHOW) {                                                      // "EUREKA!": up out of the water, fist in the air
      const k = ease(seg(t, EUREKA, EUREKA + .25));
      set({ jump: 3.2 * Math.sin(Math.PI * seg(t, EUREKA, EUREKA + .7)) + .6 * k, dy: lerp(1, -.3, k), handR: [5.8, -21.4], handPoseR: 'fist', handL: [-5.6, -19.6], handPoseL: 'palm',
        eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'grin', bulb: 1 - seg(t, 13.6, 13.9), power: .6 * on(t, EUREKA, 13.8, .2) });
      if (t > SAMI_IN[0]) set({ lookX: -.6 * ease(seg(t, SAMI_IN[0], SAMI_IN[0] + .5)), turn: -.3, eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .6 + .3 * bounce(t, 7) });
      if (t > 16.4) set({ handR: [5.0, -17.5], jump: .4, eyes: 'open', mouth: 'smirk', brows: 'up' });     // "what did you find?" (a proud pause)
    } else if (t < SQUIRT[0]) {                                                 // "The soap!"
      set({ handR: [5.8, -19.5], handPoseR: 'palm', handL: [-4.6, -14], handPoseL: 'palm', eyes: 'happy', brows: 'up', mouth: talk ? o.mouth : 'grin', lookX: .4, lookY: -.4, jump: .4 + .3 * kick(t, SHOW, 6), soap: true });
    } else {                                                                    // …and it squirts away
      const u = seg(t, SQUIRT[0], SQUIRT[1]);
      set({ handR: [3.0, -23.5], handL: [-2.6, -21.5], handPoseR: 'open', handPoseL: 'open', eyes: 'wide', mouth: 'O', brows: 'up', lookY: lerp(-1, .8, u), lookX: lerp(.3, 0, u), jump: .3, emote: '!', emoteK: on(t, SQUIRT[0], SQUIRT[0] + .7, .1) });
      if (t > SQUIRT[1] + .1) set({ handR: [4.4, -10.5], handL: [-4.4, -10.5], eyes: 'open', mouth: 'smirk', brows: 'worried', lookY: .8, blush: 1, jump: 0, dy: 1.2 });   // sheepish
    }
    return o;
  }
  function samiPose(t) {
    const talk = speaking('sami', t), a = at('sami', t);
    const o = { outfit: 'greek', mouth: lipFlap(t, talk, 'smile'), lookX: .7, turn: .35, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a && a.moving) return Object.assign(o, samiWalk(a.dist / 58, 1), { lookX: .6, turn: .3, mouth: 'o', brows: 'up', eyes: 'wide' });
    if (inW(t, 16.2, SHOW)) set({ handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'quizzical', mouth: talk ? o.mouth : 'smile', tilt: .06 });
    if (inW(t, SHOW, SQUIRT[0])) set({ eyes: 'narrow', brows: 'quizzical', mouth: 'flat', lookY: -.2, handL: [-2.4, -9.4], handR: [2.4, -9.4], handPoseL: 'fist', handPoseR: 'fist' });   // …soap?
    if (t >= SQUIRT[0]) { const u = seg(t, SQUIRT[0], SQUIRT[1]); set({ eyes: 'wide', lookY: lerp(-1, .6, u), brows: 'up', mouth: 'o' }); }
    if (t > SQUIRT[1] + .25) set({ handR: [1.4, -22.5], handPoseR: 'palm', eyes: 'closed', brows: 'worried', mouth: 'flat', tilt: -.12 * ease(seg(t, 22.1, 22.5)), lookY: .4 });   // face-palm
    return o;
  }

  // ---------- poses, part 2: the robot ----------
  // the board games held at the chest or lifted beside the head (hand targets, local units; as in scene 28)
  const HOLD = { danny: { chest: [[-3.0, -11.4], [3.0, -11.4]], up: [[3.6, -17.0], [9.6, -17.0]] }, housam: { chest: [[-3.1, -12.8], [3.1, -12.8]], up: [[5.2, -18.5], [11.2, -18.5]] } };
  const hasLaptop = t => t > H_IN[0] && t < SET_DOWN[0] + .5;
  const hasGame = (name, t) => (name === 'danny' || name === 'housam') && t > GRAB_G + .3;
  const sucking = t => t > HATCH[0] && t < CLOSE[1];
  const lookWho = (me, t) => { let who = null; for (const l of LINES) if (l.at <= t + .1 && l.at > P2 - .5 && l.speaker !== me && !l.silentBubble && !l.group) who = l.speaker; return who; };
  function kidPose2(name, t) {
    const talk = speaking(name, t), sd = name === 'jenna' || name === 'danny' ? 1 : -1, ls = lookWho(name, t), lx = lookAt(name, ls);
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lx, turn: .25 * Math.sign(lx), brows: 'normal', handL: REST_HANDS[name][0], handR: REST_HANDS[name][1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p), say = m => talk ? o.mouth : m, a = at(name, t);
    if (name === 'housam' && a && a.moving) return set({ ...housamDribble(a.dist / 46, 1), lookX: -.3, turn: -.2, mouth: 'grin', brows: 'up', ...(hasLaptop(t) ? { handL: [-3.1, -12.8], handR: [3.1, -12.8], handPoseL: 'fist', handPoseR: 'fist', laptop: true } : {}) });
    // Housam's idea and the plan
    if (inW(t, P2, 33.0)) {
      if (name === 'alma') set({ handL: [-3.0, -4.8], handR: [3.0, -4.8], handPoseL: 'fist', handPoseR: 'fist', brows: 'up', mouth: say('smirk'), tilt: .08, lookX: -.8, turn: -.4 });   // hands on hips
      if (name === 'housam') set({ handR: [4.8, -30.5], handPoseR: 'open', brows: 'up', mouth: t > 31 ? 'grin' : 'smile', eyes: t < 30.4 ? 'happy' : 'open', lookX: .6, turn: .3 });   // scratching his head
      if (name !== 'alma' && name !== 'housam') set({ eyes: t < 30 ? 'happy' : 'open', mouth: 'smile', lookX: lookAt(name, 'alma') });
    }
    if (inW(t, 33.0, 36.9) && name === 'housam') set({ handR: [5.8, -24.5], handPoseR: 'point', eyes: 'wide', brows: 'up', jump: .9 * kick(t, 33.3, 6), lookX: .2 });
    if (inW(t, 33.0, 36.9) && name !== 'housam') set({ eyes: 'wide', brows: 'up', mouth: 'o' });
    if (inW(t, 37.0, 40.9) && name === 'danny') set({ handR: [4.8, -13.2], handPoseR: 'palm', brows: 'worried', mouth: say('o'), tilt: .08 });
    if (inW(t, 41.0, 43.9) && name === 'housam') set({ handL: [-5.2, -15], handR: [5.2, -15], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', eyes: 'happy', mouth: say('grin'), tilt: -.06 });
    if (inW(t, 44.0, 48.4) && name === 'jenna') { const g = t > 46.2;
      set(g ? { jump: 1.0 * kick(t, 46.3, 6), handL: [-3.6, -17.6], handR: [3.6, -17.6], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: say('grin'), brows: 'up' }
            : { handL: [-4.4, -13], handR: [4.4, -13], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', tilt: .12, mouth: say('smirk') }); }
    if (inW(t, 48.5, H_OUT[0]) && name === 'housam') set({ handR: [5.6, -15], handPoseR: 'point', lookX: .8, turn: .4, eyes: 'happy', mouth: say('grin'), jump: .7 * kick(t, 48.7, 6) });
    if (inW(t, H_OUT[0], H_IN[1]) && name !== 'housam') set({ lookX: .9, turn: .45, brows: 'up', mouth: t > H_IN[0] ? 'O' : 'smile', eyes: t > H_IN[0] ? 'wide' : 'open',
      emote: t > H_IN[0] ? '!' : null, emoteK: on(t, H_IN[0] + .3, H_IN[1], .15) });
    // plugged in, programmed, the guardrails
    if (hasLaptop(t) && name === 'housam') set({ handL: [-3.1, -12.8], handR: [3.1 + (inW(t, PLUG - .4, PLUG + .4) ? 1.6 : 0), -12.8], handPoseL: 'fist', handPoseR: 'fist', laptop: true, lookY: .5, lookX: .3, mouth: say('smile') });
    if (inW(t, 57.0, 63.0) && name !== 'housam') set({ lookX: lookAt(name, 'housam'), lookY: .3, brows: 'up', mouth: 'o' });
    if (inW(t, 63.0, 66.0) && name === 'alma') set({ handL: [-1.2, -9.4], handR: [1.2, -9.4], handPoseL: 'fist', handPoseR: 'fist', brows: 'worried', mouth: say('wobble'), lookX: -.8, turn: -.4 });
    if (inW(t, 66.0, 70.6) && name === 'housam') set({ lookY: -.3, lookX: .5, eyes: 'happy', brows: 'up', mouth: say('grin'), tilt: -.1 });
    if (inW(t, 70.6, 72.9) && name === 'danny') set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.0 * kick(t, 70.8, 6), eyes: 'happy', mouth: say('grin'), brows: 'up' });
    if (inW(t, 73.0, 74.5)) {
      if (name === 'housam') set({ dy: .9 * Math.sin(Math.PI * seg(t, 73.0, 74.3)), eyes: 'happy', mouth: 'grin', lookX: 0, turn: 0 });   // a little bow
      else set({ handL: [-3.6, -17.6], handR: [3.6, -17.6], handPoseL: 'palm', handPoseR: 'palm', jump: 1.4 * kick(t, 73.1, 5), eyes: 'happy', mouth: say('grin'), brows: 'up' });
    }
    if (inW(t, RUN, POWER) && name === 'housam') set({ lookY: .6, lookX: .2, brows: 'focused', mouth: 'smirk' });
    // Housam unplugs the robot and puts his laptop away; Alma gives the order
    if (name === 'housam' && inW(t, 77.4, CMD)) {
      if (t < UNPLUG + .3) set({ handR: [6.4, -10.4], handPoseR: 'fist', handL: [-3.1, -12.8], lookX: .7, lookY: .4, turn: .3, brows: 'focused', mouth: 'flat', laptop: true });   // pull the plug
      if (t >= LID) set({ laptop: 'closed', eyes: 'happy', mouth: 'smile' });
      if (t > SET_DOWN[0]) { const d = Math.sin(Math.PI * seg(t, SET_DOWN[0], SET_DOWN[1]));
        set({ dy: 2.2 * d, handL: mixPt([-3.1, -12.8], [-2.4, -4.4], d), handR: mixPt([3.1, -12.8], [2.4, -4.4], d), lookY: .7 * d, laptop: t < SET_DOWN[0] + .5 ? 'closed' : false, handPoseL: 'open', handPoseR: 'open' }); }
    }
    if (inW(t, SET_DOWN[1], POWER) && name !== 'alma') set({ lookX: lookAt(name, 'alma'), turn: .25 * Math.sign(lookAt(name, 'alma')), brows: 'up', mouth: 'smile', laptop: false });
    if (name === 'alma' && inW(t, 79.9, POWER)) set({ handL: [-6.0, -15.6], handPoseL: 'point', lookX: -.6, lookY: -.3, turn: -.3, brows: 'angry', mouth: talk ? o.mouth : 'grin', jump: .8 * kick(t, CMD + .1, 6), eyes: 'open' });
    // the robot takes everything
    if (inW(t, POWER, SUCK[1] + .6)) {
      const wob = Math.sin(t * 9 + sd);
      set({ eyes: 'wide', mouth: 'O', brows: 'up', lookX: lookAt(name, 'robo_safadi') + .2 * wob, lookY: -.2, turn: .25 * Math.sign(lookAt(name, 'robo_safadi')), jump: .5 * kick(t, POWER + .7, 6) + .3 * kick(t, SUCK[0], 5) });
      if (name === 'alma' && t > 85.4) set({ handR: [-4.8, -11], handPoseR: 'palm', handL: [-2.4, -9.2], handPoseL: 'open', mouth: 'O', lean: -.06 });   // reaching for her toys
      if (name === 'jenna' || name === 'danny') set({ handL: [-3.6, -16.4], handR: [3.6, -16.4], handPoseL: 'palm', handPoseR: 'palm', dy: .6 });
    }
    if (inW(t, SUCK[1] + .6, 92.0)) set({ eyes: 'wide', mouth: 'o', brows: 'up', lookX: .7 * Math.sin(t * 1.6 + sd), lookY: .2 });   // looking round the spotless room
    if (t > 92.0 && name === 'alma') set({ brows: 'worried', mouth: say('wobble'), eyes: talk ? 'open' : 'squeeze', dy: .5, lookY: .4, lookX: -.2, handL: [-1.4, -6.0], handR: [1.4, -6.0], handPoseL: 'fist', handPoseR: 'fist', emote: null });
    if (inW(t, 92.0, 94.8) && name !== 'alma') set({ lookX: lookAt(name, 'alma'), brows: 'worried', mouth: 'o' });
    if (t > 94.8 && (name === 'danny' || name === 'housam')) {
      const up = inW(t, 95.0, 97.4);
      set({ ...(up ? { handL: HOLD[name].up[0], handR: HOLD[name].up[1] } : { handL: HOLD[name].chest[0], handR: HOLD[name].chest[1] }), handPoseL: 'fist', handPoseR: 'fist', game: up ? 'up' : 'chest',
        eyes: up ? 'happy' : 'open', mouth: say(up ? 'grin' : 'o'), brows: up ? 'up' : 'worried', jump: up ? .9 * kick(t, 95.1, 6) : 0 });
      if (t < GRAB_G + .3) set({ dy: 2.0 * Math.sin(Math.PI * seg(t, GRAB_G, GRAB_G + .3)), game: null, handL: [-1.8, -4.6], handR: [1.8, -4.6] });   // a quick crouch for the game
    }
    if (inW(t, 94.8, 97.5) && name === 'jenna') set({ lookX: lookAt('jenna', 'housam'), brows: 'worried', mouth: 'o' });
    if (inW(t, 97.6, 100.8) && name === 'jenna') set({ handR: [5.0, -13], handPoseR: 'palm', brows: 'worried', mouth: say('frown'), lookX: lookAt('jenna', 'alma'), turn: .3 });
    if (inW(t, 97.6, 100.8) && (name === 'danny' || name === 'housam')) set({ lookX: lookAt(name, 'alma'), mouth: 'o', brows: 'worried', eyes: 'open' });
    // the professor comes back
    if (inW(t, SAF_IN[0], 106.1) && name !== 'alma') set({ lookX: .9, turn: .45, brows: 'up', mouth: t > 103.2 ? 'flat' : 'o', eyes: 'open' });
    if (inW(t, SAF_IN[0], 106.1) && name === 'alma') set({ lookX: .9, turn: .45 });
    if (inW(t, 106.1, 108.8) && name === 'housam') set({ handR: [4.8, -30.5], handPoseR: 'open', brows: 'worried', mouth: say('smirk'), lookX: .85, turn: .4, tilt: .08 });   // sheepish
    if (inW(t, 108.8, 110.6) && name !== 'alma') set({ lookX: .85, turn: .4, brows: 'up' });
    if (t > 110.6 && name === 'housam') set({ handL: [-5.2, -15], handR: [5.2, -15], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', brows: 'up', mouth: say('grin'), lookX: .85, turn: .4, jump: .6 * kick(t, 110.7, 6) });
    if (t > 110.6 && name !== 'housam' && name !== 'alma') set({ lookX: lookAt(name, 'housam'), brows: 'up', mouth: 'o' });
    return o;
  }
  // Robo-Safadi: standby (cool cyan) as he marches in; red when Clawd runs the prompt; the chest swings open and the room
  // empties into it; "ROOM CLEAN UP!"; then he powers down
  function roboPose(t) {
    const talk = speaking('robo_safadi', t), a = at('robo_safadi', t);
    const o = { eyes: 'open', mouth: 'flat', brows: 'normal', handL: [-4.4, -8.6], handR: [4.4, -8.6], handPoseL: 'claw', handPoseR: 'claw', lookX: -.2, antenna: .05 };
    const set = p => Object.assign(o, p);
    if (a && a.moving) return set({ ...roboSafadiWalk(a.dist / 50, 1), lookX: -.3 });
    if (inW(t, PLUG - .2, PLUG + .6)) set({ eyes: 'happy', jump: .4 * kick(t, PLUG, 8) });                                   // click: connected
    if (inW(t, UNPLUG, UNPLUG + .5)) set({ eyes: 'squint', jump: .3 * kick(t, UNPLUG, 9) });                                   // pop: unplugged
    if (inW(t, CMD + .9, POWER)) set({ antenna: .3 * boing(t, CMD + .9, 5, 5), eyes: 'wide', lookX: .4 });                // he heard "Clean up!"
    if (t > POWER) {
      const r = ease(seg(t, POWER, POWER + .5)) * (1 - ease(seg(t, OFF_T[0], OFF_T[1])));
      set({ red: r, eyes: t < POWER + .25 ? 'off' : 'wide', brows: 'angry', mouth: 'teeth', jump: .8 * kick(t, POWER + .3, 6), antenna: .2 * boing(t, POWER + .3, 4, 4) });
    }
    if (t > HATCH[0] && t < SHING) {
      const h = ease(seg(t, HATCH[0], HATCH[1])) * (1 - ease(seg(t, CLOSE[0], CLOSE[1]))), sw = Math.sin(t * 3.2);
      set({ hatch: h, scan: .7 * on(t, SUCK[0], SUCK[1], .3), lookX: .8 * sw, lookY: .6, mouth: 'O', handL: [-6.0 + sw, -13.5], handR: [6.0 + sw, -13.5], handPoseL: 'claw', handPoseR: 'claw', dy: .3 });
    }
    if (t > SHING) set({ hatch: 0, scan: 0, lookX: -.3, lookY: 0, mouth: talk ? lipFlap(t, talk, 'grin') : 'grin', eyes: 'happy', brows: 'up', handR: [5.4, -21.5], handPoseR: 'point' });
    if (t > OFF_T[0]) { const d = ease(seg(t, OFF_T[0], OFF_T[1]));                                                          // power down
      set({ eyes: d > .6 ? 'off' : 'squint', mouth: 'flat', brows: 'normal', handL: [-4.4, -8.6], handR: [4.4, -8.6], handPoseR: 'claw', dy: .5 * d, tilt: .1 * d, antenna: .5 * d, hum: d < .9 }); }
    return o;
  }
  // Professor Safadi, back in his suit: pleased with the room, then intrigued and puzzled
  function roomSafadiPose(t) {
    const talk = speaking('safadi', t), a = at('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.7, turn: -.35, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a && a.moving) return set({ ...safadiWalk(a.dist / 58, 1), lookX: -.4, turn: -.25, mouth: 'smile', brows: 'up' });
    if (inW(t, 103.2, 106.1)) set({ handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', eyes: t < 104.6 ? 'happy' : 'open', brows: 'up', mouth: talk ? o.mouth : 'grin', lookX: .5 * Math.sin(t * 1.4) - .3 });
    if (inW(t, 106.1, 108.8)) set({ brows: 'up', mouth: 'o', lookX: -.85 });
    if (inW(t, 108.8, 110.6)) set({ handR: [5.3, -12.6], handPoseR: 'palm', brows: 'quizzical', mouth: talk ? o.mouth : 'flat', lookX: -.85 });
    if (t > 110.6) set({ handR: [.8, -16.1], handPoseR: 'fist', handL: [.6, -10.6], handPoseL: 'fist', brows: 'quizzical', eyes: t > 111.8 ? 'narrow' : 'wide', mouth: t > 111.8 ? 'flat' : 'o', lookX: -.8, tilt: -.06,
      emote: '?', emoteK: on(t, 112.0, END + 1, .2) });
    return o;
  }

  // ---------- drawing a character ----------
  function drawChar(name, P, t, A, S, pose) {
    const a = at(name, t); if (!a || P.depth(a.z) < 60) return;
    const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[name] * k; pose = { ...pose, t };
    const draw = () => {
      const R = A[name] = RIG[name](sx, sy, s, pose);
      if (pose.emote && ['jenna', 'danny', 'housam'].includes(name) && (pose.emoteK ?? 1) > .02) alEmote(pose.emote, R, k * ALMA_UNIT, pose.emoteK ?? 1, t);
      if (pose.soap) soapBar(R.handR[0] + .4 * s, R.handR[1] - 1.6 * s, 2.6 * s, -.25 + .05 * Math.sin(t * 5), t, 1);
      if (pose.laptop) A.laptop = heldLaptop((R.handL[0] + R.handR[0]) / 2, (R.handL[1] + R.handR[1]) / 2, 7.4 * s, t, pose.laptop === 'closed');
      if (pose.game && GAME[name]) {                                            // a board game, in both hands
        const w = 40 * k, mx = (R.handL[0] + R.handR[0]) / 2, my = (R.handL[1] + R.handR[1]) / 2;
        cuGame(GAME[name], mx, pose.game === 'up' ? my - w * .18 : my - w * .08, w, (pose.game === 'up' ? .1 * Math.sign(mx - sx) : 0) + .04 * Math.sin(t * 2 + sx), { t });
      }
    };
    if (a.fade !== undefined && a.fade < 1) { if (a.fade > .01) { X.save(); X.globalAlpha = a.fade; draw(); X.restore(); } } else draw();
    S[name] = s;
  }
  // a pink bar of soap, w px long, with a shine and a few bubbles; sparkle 0..1 adds a ta-da twinkle
  function soapBar(x, y, w, rot, t, sparkle = 0) {
    X.save(); X.translate(x, y); X.rotate(rot);
    shape(rectPts(-w / 2, -w * .28, w, w * .56), { fill: '#F7A8C8', stroke: PAL.ink, lwPx: clamp(w * .06, 2, 5), smooth: .5 });
    shape(rectPts(-w * .36, -w * .17, w * .72, w * .34), { fill: '#FBC6DB', stroke: null, smooth: .5 });
    ellipse(-w * .18, -w * .1, w * .14, w * .05, { fill: 'rgba(255,255,255,.85)', stroke: null, rot: -.2 });
    for (let i = 0; i < 3; i++) { const f = frac(t * .8 + i / 3); circle(w * (.15 + .2 * i - .3) + 6 * Math.sin(t * 4 + i), -w * .3 - f * w * .9, w * (.07 + .03 * i) * (1 - f * .4), { fill: rgba('#FFFFFF', .7 * (1 - f)), stroke: rgba('#9FD7EA', .8 * (1 - f)), lwPx: 1.5 }); }
    X.restore();
    if (sparkle > .01) overlay(() => [[w * .7, -w * .6, 1], [-w * .8, -w * .2, .7]].forEach(([dx, dy, sc], i) => {
      X.save(); X.translate(x + dx, y + dy); X.rotate(t * 2 + i); const r = w * .32 * sc * sparkle * (.75 + .25 * Math.sin(t * 9 + i * 2));
      shape(starPts(0, 0, r, .3, 4), { fill: '#FFF5A8', stroke: '#F2B21E', lwPx: 2 }); X.restore(); }));
  }

  // Housam's laptop, held open in front of him: we see the back of the lid (Clawd sticker) over the keyboard. w px wide.
  function heldLaptop(x, y, w, t, closed = false) {
    const h = w * .62, lw = clamp(w * .03, 1.5, 4);
    if (closed) { shape(rectPts(x - w * .55, y - h * .12, w * 1.1, h * .2), { fill: '#C3C9CE', stroke: PAL.ink, lwPx: lw, smooth: .2 }); return [x, y]; }
    shape([[x - w * .55, y + h * .02], [x + w * .55, y + h * .02], [x + w * .5, y + h * .14], [x - w * .5, y + h * .14]], { fill: '#8E979E', stroke: PAL.ink, lwPx: lw });   // the keyboard edge
    shape(rectPts(x - w / 2, y - h, w, h), { fill: '#C3C9CE', stroke: PAL.ink, lwPx: lw, smooth: .06 });
    ellipse(x, y - h * .5, w * .55, h * .65, { fill: radGrad(x, y - h * .5, 0, w * .6, [[0, 'rgba(127,227,255,0)'], [.8, 'rgba(127,227,255,0)'], [1, 'rgba(127,227,255,.25)']]), stroke: null });
    shape(rectPts(x - w * .14, y - h * .62, w * .28, h * .26), { fill: '#D97757', stroke: PAL.ink, lwPx: lw * .7 });                // the Clawd sticker
    for (const ex of [-.07, .045]) shape(rectPts(x + ex * w, y - h * .56, w * .025, h * .12), { fill: PAL.ink, stroke: null });
    return [x, y - h * .5];
  }
  // the room's state: half-messy until the robot takes everything (`taken`), then spotless (messy 0) on the SHING
  const roomSet = t => ({ messy: t < SHING ? .55 : 0, taken: t < SUCK[0] ? 0 : t < SHING ? seg(t, SUCK[0], SUCK[1]) : 1, lamp: .55 });
  const TAKE = BR.takeables(.55, 0);
  // every toy flies off its spot in an arc and into the robot's chest, spinning and shrinking
  function flyingToys(P, t) {
    if (t < SUCK[0] || t > SUCK[1] + FLY) return;
    const [rx, rz] = ROBO, dest = [rx, 76, rz - 12];
    for (const it of TAKE) {
      const t0 = SUCK[0] + it.ord * (SUCK[1] - SUCK[0]), u = seg(t, t0, t0 + FLY); if (u <= 0 || u >= 1) continue;
      const e = easeIn(u), px = lerp(it.x, dest[0], e), pz = lerp(it.z, dest[2], e), py = lerp(it.y, dest[1], e) + 90 * Math.sin(Math.PI * u);
      if (!P.visible(pz)) continue;
      const [qx, qy, k] = P.p(px, py, pz), sc = 1 - .75 * e, spin = u * 7 * (hash(it.ord * 97) - .5);
      X.save(); X.translate(qx, qy); X.rotate(spin);
      if (it.kind === 'toy') { X.scale(k * (it.sc || 1) * sc, k * (it.sc || 1) * sc); BR.toys[it.name](clamp(k * .32, .5, 1.6), it.flip); }
      else if (it.kind === 'block') { const b = 18 * k * sc; shape(rectPts(-b / 2, -b / 2, b, b), { fill: it.col, stroke: PAL.ink, lwPx: 1.5 }); }
      else if (it.kind === 'book') { const b = 30 * k * sc; shape(rectPts(-b / 2, -b * .35, b, b * .7), { fill: it.col, stroke: PAL.ink, lwPx: 1.5 }); shape(rectPts(-b * .45, -b * .28, b * .9, b * .1), { fill: '#FFFFFF', stroke: null }); }
      else { line([[-8 * k * sc, 0], [8 * k * sc, 0]], { stroke: it.col, lwPx: clamp(3 * k, 1, 10) }); }
      X.restore();
      // a streak behind it
      const [ox, oy] = P.p(lerp(it.x, dest[0], easeIn(Math.max(0, u - .15))), lerp(it.y, dest[1], easeIn(Math.max(0, u - .15))) + 90 * Math.sin(Math.PI * Math.max(0, u - .15)), lerp(it.z, dest[2], easeIn(Math.max(0, u - .15))));
      line([[ox, oy], [qx, qy]], { stroke: 'rgba(255,255,255,.55)', lwPx: clamp(5 * k, 1, 10) });
    }
  }
  // the cable from Housam's laptop to the robot, along the floor (world points)
  function cable(P, t) {
    if (t < PLUG || t > UNPLUG || at('housam', t)?.moving) return;
    const [hx, hz] = SPOT.housam, from = [hx + 4, 68, hz - 6], to = [ROBO[0] + 26, 62, ROBO[1] + 4];
    const pts = [from, [lerp(from[0], to[0], .2), 2, lerp(from[2], to[2], .15)], [lerp(from[0], to[0], .6), 1.5, lerp(from[2], to[2], .6)], [to[0] + 16, 2, to[2] - 8], to];
    const l = P.line(pts); if (l) { line(l, { stroke: PAL.ink, lwPx: clamp(5 * P.k(hz), 2, 9), smooth: true }); line(l, { stroke: '#3F7FD9', lwPx: clamp(2.6 * P.k(hz), 1, 5), smooth: true }); }
  }
  const LAPTOP_FLOOR = [-30, 335];
  function floorLaptop(P, t) {                                                   // closed, on the floor at Housam's feet
    const [x, z] = LAPTOP_FLOOR; if (!P.visible(z)) return;
    const q = P.poly([[x - 34, 4, z - 22], [x + 34, 4, z - 22], [x + 34, 4, z + 22], [x - 34, 4, z + 22]]); if (!q) return;
    const b = P.poly([[x - 34, 0, z - 22], [x + 34, 0, z - 22], [x + 34, 4, z - 22], [x - 34, 4, z - 22]]); if (b) shape(b, { fill: '#8E979E', stroke: PAL.ink, lwPx: 1.2 });
    shape(q, { fill: '#C3C9CE', stroke: PAL.ink, lwPx: 1.4 });
    const st = P.poly([[x - 8, 4.2, z - 5], [x + 8, 4.2, z - 5], [x + 8, 4.2, z + 5], [x - 8, 4.2, z + 5]]); if (st) shape(st, { fill: '#D97757', stroke: PAL.ink, lwPx: 1 });
  }

  // ---------- the bedroom, for a camera ----------
  function roomStage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {}, SET = roomSet(t), actors = [];
    for (const n of KIDS) { const a = at(n, t); if (a && P.depth(a.z) > 60) actors.push({ z: a.z, draw: () => drawChar(n, P, t, A, S, kidPose(n, t)) }); }
    const rb = at('robo_safadi', t); if (rb && P.depth(rb.z) > 60) actors.push({ z: rb.z, draw: () => { drawChar('robo_safadi', P, t, A, S, roboPose(t)); cable(P, t); } });
    const sf = at('safadi', t); if (t > P2 && sf && P.depth(sf.z) > 60) actors.push({ z: sf.z, draw: () => drawChar('safadi', P, t, A, S, roomSafadiPose(t)) });
    for (const n of Object.keys(BOX_AT)) { if (hasGame(n, t) || (t > GRAB_G + .15 && n !== 'jenna')) continue;           // the boys pick theirs up
      const [x, z] = BOX_AT[n]; if (P.depth(z) > 30) actors.push({ z, draw: () => cuGameFloor(P, GAME[n], x, z, 40, (hash(x) - .5) * .5) }); }
    if (t > SET_DOWN[0] + .5 && P.depth(LAPTOP_FLOOR[1]) > 30) actors.push({ z: LAPTOP_FLOOR[1], draw: () => floorLaptop(P, t) });
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => BR.back(P, t, { ...SET, splitZ: actors.length ? actors[0].z : -Infinity }), { blur });
    actors.forEach((a, i) => { a.draw(); BR.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z }); });
    flyingToys(P, t);
    return { A, S, P };
  }
  // ---------- the bathhouse, for a camera ----------
  const SPLASH_T = [EUREKA + .05, SQUIRT[1]];
  function bathStage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {};
    const bo = { foam: .75, ripple: t > SQUIRT[1] ? SQUIRT[1] : EUREKA + .05, bather: () => drawChar('safadi', P, t, A, S, safadiPose(t)) };
    const sm = at('sami', t), split = sm && P.depth(sm.z) > 60 ? sm.z : -Infinity;
    layer(() => BA.back(P, t, { ...bo, splitZ: split }), { blur });
    if (sm) { drawChar('sami', P, t, A, S, samiPose(t)); BA.front(P, t, { ...bo, splitZ: split }); }
    splashes(P, t);
    flyingSoap(P, t);
    return { A, S, P };
  }
  // water drops thrown up by each splash (world space, so they work from any camera)
  function splashes(P, t) {
    const { x, z, water } = BA.TUB;
    SPLASH_T.forEach((t0, j) => {
      const u = t - t0; if (u < 0 || u > 1.1) return;
      for (let i = 0; i < 22; i++) {
        const a = hash(i * 3.1 + j) * TAU, sp = 90 + 140 * hash(i * 1.7 + j), up = 260 + 220 * hash(i * 2.3 + j) * (j ? .6 : 1);
        const px = x + Math.cos(a) * (20 + sp * u), pz = z + Math.sin(a) * (20 + sp * u) * .6, py = water + up * u - 520 * u * u; if (py < 0) continue;
        const [qx, qy, k] = P.p(px, py, pz); if (!P.visible(pz)) continue;
        const r = (4 + 4 * hash(i)) * k * (1 - u * .5);
        ellipse(qx, qy, r * .8, r, { fill: rgba('#BDEFF8', .9), stroke: rgba('#2E97B3', .9), lwPx: 1.5 });
      }
    });
  }
  // the soap, squirting out of Safadi's hand and back into the tub
  function flyingSoap(P, t) {
    const u = seg(t, SQUIRT[0], SQUIRT[1]); if (u <= 0 || u >= 1) return;
    const { x, z, water } = BA.TUB, p0 = [x + 40, 185, z], p1 = [x - 10, water, z];
    const px = lerp(p0[0], p1[0], u), pz = lerp(p0[2], p1[2], u), py = lerp(p0[1], p1[1], u) + 170 * Math.sin(Math.PI * u);
    const [qx, qy, k] = P.p(px, py, pz);
    soapBar(qx, qy, 16 * k, u * 9, t);
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
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 60 || a.mouth[0] > W - 60) continue;
      const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: typeof o.dy === 'function' ? o.dy(l.speaker) : o.dy ?? -220 });
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const mixCam = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u), dir: 1 });
  // the bedroom (bed view)
  const R_GROUP = cam(-40, 120, 110, 565, 760);                                // the four kids, the bed behind
  const R_HOUSAM = t => ({ ...cam(-40, 112, 200, 560, 900)(t), z: lerp(190, 235, ease(seg(t, STORY - .3, WAVE1[0]))) });   // push in on the storyteller
  const R_LAUGH = t => ({ ...cam(-50, 118, 120, 565, 780)(t), z: lerp(120, 165, ease(seg(t, LAUGH, 32))) });
  const R_CLOSE = t => ({ ...cam(-60, 108, 200, 555, 760)(t), z: lerp(200, 230, ease(seg(t, 28.4, 32))) });     // closer on the four of them
  const R_PAIR = cam(40, 115, 190, 555, 800);                                  // Housam and Alma
  const R_KIDS3 = cam(-120, 110, 175, 560, 720);                               // Jenna, Danny and Housam
  const R_WIDE = cam(10, 165, 30, 560, 640);                                   // the whole room, the robot on the rug
  const R_ROBOT = cam(45, 200, 100, 400, 1500);                                // over the kids' heads onto the robot
  const R_ALMA = cam(140, 95, 250, 540, 800);                                  // Alma, sad
  const R_SAF = cam(185, 125, 135, 520, 820);                                  // the professor (and Alma)
  const R_DOOR = cam(-60, 175, 720, 560, 800, -1);                             // the door, from the foot of the bed
  const R_FINAL = t => ({ ...cam(110, 120, 0, 560, 820)(t), z: lerp(0, 70, ease(seg(t, 110.4, FREEZE))) });   // Housam and the professor
  // the bathhouse
  const B_WIDE = t => { const [dx, dy] = drift(t), u = ease(seg(t, WAVE1[0], 10.4)); return mixCam({ x: dx, y: 280, z: -320, f: 820, hy: 470 + dy }, { x: dx, y: 165, z: 60, f: 950, hy: 590 + dy }, u); };
  const B_TUB = cam(25, 145, 240, 500, 1000);                                   // Safadi in the tub
  const B_SIDE = cam(-140, 165, 10, 560, 820);                                  // Sami comes down the colonnade
  const B_TWO = cam(-95, 150, 150, 560, 900);                                   // Sami and Safadi

  // a warm storybook vignette over the bathhouse (it's Housam's story)
  function storyLook() {
    overlay(() => {
      X.fillStyle = radGrad(W / 2, H / 2, H * .42, H * 1.05, [[0, 'rgba(255,230,170,0)'], [.7, 'rgba(255,214,140,.28)'], [1, 'rgba(214,150,80,.6)']]); X.fillRect(0, 0, W, H);
      X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = 'rgba(255,200,120,.25)'; X.fillRect(0, 0, W, H); X.restore();
    });
  }
  const rshot = (camFn, blur, bo) => t => { const { A, S } = roomStage(t, camFn(t), blur); bubbles(t, A, S, bo); extras(t, A, S); };
  const bshot = (camFn, blur, bo) => t => { const { A, S, P } = bathStage(t, camFn(t), blur); bubbles(t, A, S, bo); bathExtras(t, A, S, P); storyLook(); };

  const ask = rshot(R_GROUP, .8, { size: 48, side: n => n === 'alma' ? -1 : 1, far: 240, dy: -230 });
  const story = rshot(R_HOUSAM, 1.6, { size: 54, side: () => 1, far: 260, dy: -230 });
  const bathWide = bshot(B_WIDE, 0, {});
  const tub = bshot(B_TUB, 1.4, { size: 62, side: () => -1, far: 200, dy: -230 });
  const samiIn = bshot(B_SIDE, .6, { size: 54, far: 280, dy: -220 });
  const two = bshot(B_TWO, 1.0, { size: 54, side: () => 1, far: 120, dy: -280 });
  const laughShot = rshot(R_LAUGH, .8, { size: 50, groupDy: -230 });
  const laughClose = rshot(R_CLOSE, 1.6, { size: 50, groupDy: -230 });
  // part 2
  const pair = rshot(R_PAIR, 1.4, { size: 50, side: n => n === 'alma' ? 1 : -1, far: 230, dy: -270 });
  const kids3 = rshot(R_KIDS3, 1.8, { size: 50, side: n => n === 'jenna' ? -1 : 1, far: 250, dy: -230, groupDy: -260 });
  const group = rshot(R_GROUP, .8, { size: 48, side: n => n === 'alma' || n === 'safadi' ? -1 : 1, far: 240, dy: -240, groupDy: -250 });
  const wide = rshot(R_WIDE, .4, { size: 48, side: n => n === 'alma' || n === 'robo_safadi' ? 1 : -1, far: 220, dy: -220 });
  const robot = rshot(R_ROBOT, 1.2, { size: 56, side: () => 1, far: 260, dy: n => n === 'alma' ? -330 : -160 });
  const almaSad = rshot(R_ALMA, 2.2, { size: 52, side: () => -1, far: 280, dy: -200 });
  const safShot = rshot(R_SAF, 2.0, { size: 50, side: n => n === 'safadi' ? -1 : 1, far: 280, dy: -260 });
  const door = rshot(R_DOOR, .8, { size: 50, side: () => 1, far: 280, dy: -240 });
  function final(t) {                                                          // "Allow me to explain!"; the professor, puzzled; freeze
    const tt = Math.min(t, FREEZE), { A, S } = roomStage(tt, R_FINAL(tt), 1.4); bubbles(tt, A, S, { size: 54, side: n => n === 'safadi' ? -1 : 1, far: 240, dy: -230 }); extras(tt, A, S);
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
  // the laptop screen: Housam types the program, then runs it and Clawd wakes up
  const CODE = ['if clean_up:', '    llm("Clean up Alma\'s room")'], PROMPT = "Clean up Alma's room";
  const typedN = (t, a, b) => Math.round(seg(t, a, b) * CODE.join('\n').length);
  function codeInsert(t) {
    const done = t > CODE_T[1], cl = done ? { eyes: 'happy', mouth: 'smile', jump: .5 * kick(t, CODE_T[1] + .1, 6) } : { eyes: 'look', lookX: -1, lookY: .3, mouth: 'flat' };
    ieEditor(t, { code: CODE, chars: typedN(t, CODE_T[0], CODE_T[1]), panel: 'llm', prompt: PROMPT.slice(0, Math.round(seg(t, CODE_T[1], CODE_T[1] + .9) * PROMPT.length)), clawd: cl });
  }
  function runInsert(t) {
    const go = t > 75.2, cl = go ? { eyes: frac(t * 3) < .5 ? 'spark' : 'happy', mouth: speaking('clawd', t) ? lipFlap(t, true, 'grin') : 'grin', aL: 1.2 + .4 * Math.sin(t * 11), aR: 1.2 + .4 * Math.cos(t * 11), jump: 1.4 * kick(t, 75.3, 5) + .4 * bounce(t, 9) }
      : { eyes: 'closed', mouth: 'flat' };
    const cA = ieEditor(t, { code: CODE, panel: 'llm', prompt: PROMPT, clawd: cl, hl: t < 75.2 ? 0 : 1 });
    bubbles(t, { clawd: cA }, { clawd: 26 }, { size: 56, side: () => 1, far: 60, dy: -300 });
    sfx('ENTER', 600, 860, 64, '#FFFDF6', t - RUN - .2, { life: .6, rot: -.06 });
    sfx('BEEP!', 1560, 300, 70, '#7FE3FF', t - 75.9, { life: .7, rot: .1 }); sfx('BOOP!', 1700, 420, 64, '#F2A283', t - 76.3, { life: .7, rot: -.08 });
  }

  // a ripple dissolve between two shots: both are painted off-screen, then laid down in wavy strips and cross-faded
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
  const toGreece = rippleShot(WAVE1, story, bathWide);
  const toBedroom = rippleShot(WAVE2, two, laughShot);

  // things that ride on top of the bedroom shots
  function extras(t, A, S) {
    if (A.housam && t > LID && t < LID + .8) sfx('CLACK', A.housam.handR[0] + 2 * S.housam, A.housam.handR[1] - 3 * S.housam, 44, '#FFFDF6', t - LID, { life: .5 });
    if (laughing(t)) [['jenna', 26.4], ['danny', 26.9], ['alma', 27.5], ['housam', 28.1], ['danny', 28.6]].forEach(([n, t0], i) => {
      const r = A[n]; if (r) sfx(i % 2 ? 'HA!' : 'HA HA!', r.top[0] + (i % 2 ? -3 : 3) * S[n], r.top[1] - 1.5 * S[n], 44, '#FFE066', t - t0, { life: .9, rot: i % 2 ? -.1 : .1 });
    });
    const rb = A.robo_safadi, sr = S.robo_safadi;
    if (rb) {
      sfx('CLICK', rb.belly[0] + 6 * sr, rb.belly[1], 48, '#FFFDF6', t - PLUG, { life: .6, rot: .1 });
      sfx('POP!', rb.belly[0] + 7 * sr, rb.belly[1] + 2 * sr, 50, '#FFFDF6', t - UNPLUG, { life: .6, rot: -.1 });
      sfx('VWOOM!', rb.top[0], rb.top[1] - 3 * sr, 70, '#FF9A9A', t - POWER - .3, { life: .9, rot: -.06 });
      [84.2, 85.6, 87.0, 88.2].forEach((t0, i) => sfx(['SHLOOP!', 'FWOOP!', 'SHLURP!', 'FWOOP!'][i], rb.hatch[0] + (i % 2 ? 9 : -9) * sr, rb.hatch[1] - (4 + 2 * i) * sr, 58, '#BFF3FF', t - t0, { life: .7, rot: i % 2 ? .1 : -.1 }));
      sfx('CLUNK', rb.hatch[0], rb.hatch[1] - 3 * sr, 52, '#FFFDF6', t - CLOSE[1], { life: .5 });
      sfx('bzzz... bip.', rb.top[0], rb.top[1] - 2 * sr, 40, '#E9E3F0', t - OFF_T[0], { life: 1.4 });
      if (t > POWER && t < 84.0) { const [lx, ly] = rb.top, u = seg(t, POWER, 84.0), k = sr / ROBO_SAFADI_UNIT;   // Clawd, the LLM, pops out of the robot's head
        overlay(() => clawd(lx, ly - 30 * k * backOut(seg(u, 0, .25)), CLAWD_UNIT * k, { t, holo: 1, eyes: 'spark', mouth: 'grin', aL: 1.4, aR: 1.4, alpha: 1 - seg(u, .7, 1) })); }
    }
    if (t > SHING && t < SHING + 1) {                                          // the room snaps spotless
      sfx('SHING!', W * .5, H * .2, 110, '#FFF5A8', t - SHING, { life: 1.0 });
      flash(.6 * kick(t, SHING, 7), '#FFFDF6');
      overlay(() => { for (let i = 0; i < 14; i++) { const x = W * hash(i * 3.7), y = H * (.2 + .6 * hash(i * 1.3)), k = Math.sin(Math.PI * seg(t, SHING + hash(i) * .3, SHING + .5 + hash(i) * .3));
        if (k > 0) { X.save(); X.translate(x, y); X.rotate(t * 3 + i); shape(starPts(0, 0, 28 * k, .3, 4), { fill: '#FFF5A8', stroke: '#F2B21E', lwPx: 2 }); X.restore(); } } });
    }
  }
  // and on top of the bathhouse shots
  function bathExtras(t, A, S, P) {
    const sf = A.safadi;
    if (sf && t > EUREKA) sfx('SPLASH!', sf.head[0] - 6 * S.safadi, sf.head[1] + 9 * S.safadi, 78, '#BDEFF8', t - EUREKA - .05, { life: 1.0, rot: -.08 });
    if (t > SQUIRT[0]) { const [qx, qy] = P.p(60, 230, BA.TUB.z); sfx('FWIP!', qx, qy, 64, '#FBC6DB', t - SQUIRT[0], { life: .7, rot: .1 }); }
    if (t > SQUIRT[1]) { const [qx, qy] = P.p(-10, 110, BA.TUB.z); sfx('PLOP', qx, qy, 64, '#BDEFF8', t - SQUIRT[1], { life: .9, rot: -.06 }); }
    if (A.sami && t > 22.2) sfx('*slap*', A.sami.head[0] + 5 * S.sami, A.sami.head[1] - 6 * S.sami, 40, '#FFFDF6', t - 22.2, { life: .8 });
  }

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, ask], [STORY - .3, story], [WAVE1[0], toGreece], [WAVE1[1], bathWide], [10.4, tub], [SAMI_IN[0] - .1, samiIn], [16.2, two],
      [SHOW - .1, tub], [SQUIRT[0] - .1, two], [WAVE2[0], toBedroom], [WAVE2[1], laughShot], [28.4, laughClose],
      // part 2: the robot
      [P2, pair], [36.9, kids3], [40.9, pair], [43.9, kids3], [48.4, group], [H_OUT[0] + .4, door], [53.6, group], [H_IN[0], door],
      [56.6, robot], [59.0, codeInsert], [63.0, pair], [65.9, kids3], [72.9, group], [RUN, runInsert], [77.4, pair], [80.2, robot], [POWER, wide],
      [85.6, robot], [87.4, wide], [89.6, robot], [91.9, almaSad], [94.0, robot], [94.9, kids3], [97.5, group], [SAF_IN[0] + .4, safShot], [106.0, pair], [108.7, safShot], [110.4, final],
    ] });
})();
