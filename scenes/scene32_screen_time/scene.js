// Scene 32: "Screen Time". After the clean-up the kids promised board games, but Professor Safadi drops in on Alma's tidy room
// and finds all four glued to their tablets, the games stacked unopened on the rug. "Children, you said you wanted to play board
// games!" A long, long silence. "We are done playing board games… but we are still playing together!" Craft Blocks (Alma and
// Jenna), Fight Planet (Housam and Danny): two full-frame inserts of the tablets. "Do you remember what I said about video games?"
// "No." Dr. Sami drops in: "30 minutes per day, and I suppose it is over!" The kids look up for the first time: "But you are also
// on your screen more than 30 minutes a day!" Gulp. A ripple to the study: the serious professor at his laptop, his three books
// stacked on the desk; we zoom into the screen: ROBO INVASION (Robo-Safadi invaders, King Neptune as the ship). "I use it to
// research my books." A ripple to the clinic: the serious doctor at his computer, an X-ray on the desk; we zoom in: WORLD
// CHAMPION (little Sami dribbles past the kids and scores). "I use it to look up medical information." "This is not fair!"
// "Your screen time is up. Go play outside!" The kids put their tablets down and trudge out. "Brother, what shall we do now?"
// "Robo Invasion… or World Champion?" HA HA HA! Freeze. To be continued.
// Blocking, bedroom (bed view): Jenna (−235, 400), Danny (−145, 370), Housam (−55, 395), Alma (35, 440); the games on the rug
// in front of them; Professor Safadi (235, 300), Dr. Sami (130, 240); both come in from the doorway (220, 50).
// Study: Safadi behind the desk at (−60, 930), the laptop at (−110, 78, 816), the books at (35, 78, 790).
// Clinic: Sami behind the desk at (−90, 940), the computer at (−140, 76, 840), the X-ray film at (35, 76, 805).
// Every shot is a pure function of t.
(() => {
  const BR = LOCATIONS.alma_bedroom, SST = LOCATIONS.safadi_study, CL = LOCATIONS.sami_clinic, LINES = ASSETS.scene.scene32_screen_time.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: PAL.crimson, sami: '#2E9C7A' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, sami };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 6.6, sami: 6.6 };
  const KIDS = ['jenna', 'danny', 'housam', 'alma'], WALK = { jenna: jennaSkip, danny: dannyDribble, housam: housamDribble, alma: almaSkip };
  const GAMES = { alma: 'craft', jenna: 'craft', housam: 'fight', danny: 'fight' };

  // ---------- timing ----------
  const KNOCK = [4.0, 4.3], SAF_IN = [4.6, 6.4], SEES = 6.9, AHEM = 13.4, WAVE = [13.9, 15.2];
  const SAMI_IN = [38.2, 40.4], LOOK_UP = 44.6, GULP = 50.4;
  const RIP_S = [51.4, 53.0], ZOOM_S = [57.0, 58.2], ROBO = [58.2, 64.6], YES = 65.6, RIP_R1 = [67.0, 68.6];
  const RIP_C = [75.0, 76.6], ZOOM_C = [80.6, 81.8], SOCCER = [81.8, 88.2], CHIP = [86.0, 86.9], GOOAL = 88.5, RIP_R2 = [90.6, 92.2];
  const DOWN = [103.4, 104.2], OUT = { alma: [104.2, 107.0], jenna: [104.5, 107.5], danny: [104.8, 108.0], housam: [105.1, 108.5] };
  const LAUGH = 115.6, FREEZE = 118.2, END = 124.0;

  // ---------- where everyone is ----------
  const SPOT = { jenna: [-235, 400], danny: [-145, 370], housam: [-55, 395], alma: [35, 440], safadi: [235, 300], sami: [130, 240] };
  const DOORWAY = [220, 50];
  const GAME_AT = [['rainbow', -175, 300, .12], ['dolphins', -105, 292, -.08], ['oligarchy', -35, 300, .05]];   // unopened, in a neat row
  const FLOOR_TAB = Object.fromEntries(KIDS.map((n, i) => [n, [SPOT[n][0] + 12, SPOT[n][1] - 30, (hash(i * 5.3) - .5) * .6]]));
  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  function at(name, t) {
    if (name === 'safadi') return t < SAF_IN[0] ? null : { ...along([DOORWAY, [235, 190], SPOT.safadi], t, SAF_IN), fade: ease(seg(t, SAF_IN[0], SAF_IN[0] + .4)) };
    if (name === 'sami') return t < SAMI_IN[0] ? null : { ...along([DOORWAY, [330, 150], [250, 200], SPOT.sami], t, SAMI_IN), fade: ease(seg(t, SAMI_IN[0], SAMI_IN[0] + .4)) };
    const o = OUT[name];                                                       // the kids: on their spots, then out of the door
    if (t > o[1]) return null;
    if (t > o[0]) return { ...along([SPOT[name], [SPOT[name][0] * .5 + 60, 250], [175, 140], DOORWAY], t, o), fade: 1 - seg(t, o[1] - .45, o[1]) };
    return { x: SPOT[name][0], z: SPOT[name][1], dist: 0, moving: false };
  }

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const SIDE = { jenna: -1, danny: -.65, housam: -.3, alma: .05, sami: .55, safadi: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const twin = t => t < SAMI_IN[0] ? 'safadi' : speaking('sami', t) ? 'sami' : 'safadi';   // whom the kids look at

  // ---------- poses: the kids ----------
  const CHEST = { jenna: [[-2.6, -12.4], [2.6, -12.4]], danny: [[-3.0, -11.4], [3.0, -11.4]], housam: [[-3.1, -12.8], [3.1, -12.8]], alma: [[-2.4, -9.4], [2.4, -9.4]] };
  const WAIST = { jenna: [[-2.8, -9.4], [2.8, -9.4]], danny: [[-3.2, -8.6], [3.2, -8.6]], housam: [[-3.4, -9.6], [3.4, -9.6]], alma: [[-2.6, -7.0], [2.6, -7.0]] };
  const LOW = { jenna: [[-1.8, -4.6], [1.8, -4.6]], danny: [[-2.2, -4.2], [2.2, -4.2]], housam: [[-2.4, -4.6], [2.4, -4.6]], alma: [[-1.6, -2.8], [1.6, -2.8]] };
  const POINT = { jenna: [6.0, -17.5], danny: [5.6, -16.0], housam: [6.2, -18.0], alma: [5.2, -12.5] };
  const PH = { jenna: 0, danny: 1.7, housam: 3.1, alma: 4.4 };
  const grip = name => name === 'jenna' ? 'grip' : 'fist';
  function kidPose(name, t) {
    const talk = speaking(name, t), a = at(name, t), ph = PH[name], tw = twin(t);
    const say = m => talk ? lipFlap(t, true, m) : m;
    const tap = k => .45 * Math.max(0, Math.sin(t * 13 + ph + k));             // thumbs tapping the screen
    const o = { giraffe: false, handL: [CHEST[name][0][0], CHEST[name][0][1] - tap(0)], handR: [CHEST[name][1][0], CHEST[name][1][1] - tap(2)],
      handPoseL: grip(name), handPoseR: grip(name), lookY: .85, lookX: .1 * Math.sin(t * .7 + ph), dy: .5, lean: .03, brows: name === 'housam' ? 'focused' : 'normal',
      mouth: say(name === 'danny' ? 'smirk' : 'flat'), eyes: 'open', tablet: 'chest', glow: 1 };
    const set = p => Object.assign(o, p);
    if (inW(t, 9.0, 15.0) && name === 'alma') set({ mouth: 'o' });             // concentrating
    if (inW(t, 26.8, 31.0) && (name === 'housam' || name === 'danny')) set({ dy: .5 + .3 * bounce(t, 9, ph), lean: .05 * Math.sin(t * 7 + ph) });   // dodging in the game
    if (inW(t, 21.6, 26.0) && (name === 'alma' || name === 'jenna')) set({ mouth: say('smile') });
    // they look up at last
    if (t > LOOK_UP) {
      const u = ease(seg(t, LOOK_UP, LOOK_UP + .35));
      set({ lookY: lerp(.85, -.15, u), lookX: lookAt(name, tw), turn: .25 * Math.sign(lookAt(name, tw)), eyes: 'wide', brows: 'up', mouth: say('o'), glow: 1 - u, dy: .2,
        handL: WAIST[name][0], handR: WAIST[name][1], tablet: 'waist', emote: '!', emoteK: on(t, LOOK_UP + .1, 45.5, .12) });
    }
    if (inW(t, 45.6, 50.0)) set({ handR: POINT[name], handPoseR: 'point', handL: WAIST[name][0], tablet: 'hand', brows: 'angry', mouth: say('frown'), eyes: 'open',
      lookX: lookAt(name, 'safadi'), jump: .9 * kick(t, 45.7 + .08 * ph, 6) });
    if (inW(t, 50.0, 75.0)) set({ brows: 'angry', mouth: 'smirk', eyes: 'open', lookX: lookAt(name, t < 51.2 ? 'safadi' : 'safadi') });
    if (inW(t, 68.6, 71.6)) set({ brows: 'up', mouth: 'o' });
    if (inW(t, 71.6, 75.0)) set({ brows: 'angry', mouth: 'flat', lookY: .1, emote: name === 'alma' ? '?' : null, emoteK: on(t, 72.0, 74.6, .2) });   // narrowed eyes
    if (inW(t, 92.2, 97.4)) set({ lookX: lookAt(name, 'sami'), brows: t < 95.6 ? 'up' : 'angry', mouth: t < 95.6 ? 'o' : 'flat', eyes: 'open', glow: 0 });
    if (inW(t, 97.4, 99.6)) set({ handL: [-3.6, -6.4], handR: [3.6, -6.4], handPoseL: 'fist', handPoseR: 'fist', tablet: 'hand', brows: 'angry', mouth: say('frown'),
      eyes: talk ? 'open' : 'squeeze', jump: .8 * kick(t, 97.5, 7) + .6 * kick(t, 98.1, 7), lookX: lookAt(name, 'safadi') });   // a stomp
    if (inW(t, 99.6, DOWN[0])) set({ brows: 'worried', mouth: 'frown', eyes: 'open', lookX: lookAt(name, 'safadi') * .5, lookY: .25, dy: .7, handL: WAIST[name][0], handR: WAIST[name][1], tablet: 'waist' });
    if (inW(t, DOWN[0], OUT[name][0])) {                                       // put the tablet down on the rug
      const d = Math.sin(Math.PI * seg(t, DOWN[0], DOWN[1]));
      set({ dy: .7 + 1.8 * d, handL: mixPt(WAIST[name][0], LOW[name][0], d), handR: mixPt(WAIST[name][1], LOW[name][1], d), lookY: .7 * d + .2, brows: 'worried', mouth: 'frown',
        tablet: t < (DOWN[0] + DOWN[1]) / 2 ? 'waist' : null, handPoseL: 'open', handPoseR: 'open' });
    }
    if (a && a.moving) return set({ ...WALK[name](a.dist / 46, .6), lookY: .45, lookX: .3, turn: .2, brows: 'worried', mouth: 'frown', eyes: 'open', tablet: null, glow: 0, dy: .5 });   // trudging out
    if (t > OUT[name][0]) set({ tablet: null, glow: 0 });
    return o;
  }

  // ---------- poses: the twins in the bedroom ----------
  function roomSafadiPose(t) {
    const talk = speaking('safadi', t), a = at('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.7, turn: -.3, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p), say = m => talk ? o.mouth : m;
    if (a && a.moving) return set({ ...safadiWalk(a.dist / 58, 1), lookX: -.4, turn: -.25, mouth: 'grin', brows: 'up', eyes: 'happy' });
    if (inW(t, SAF_IN[1], SEES)) set({ handL: [-1.2, -12.6 + .5 * Math.sin(t * 22)], handR: [1.2, -12.4 - .5 * Math.sin(t * 22)], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'grin', brows: 'up', lookX: -.3 });   // rubbing his hands
    if (inW(t, SEES, 7.4)) set({ eyes: 'wide', mouth: 'o', brows: 'up', emote: '!', emoteK: on(t, SEES, 7.6, .1), lookX: -.8, jump: .3 * kick(t, SEES, 7) });
    if (inW(t, 7.4, 11.2)) set({ handL: [-6.2, -14.5], handR: [6.2, -14.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', lookX: -.8 });
    if (inW(t, 11.2, AHEM)) set({ brows: 'quizzical', mouth: 'flat', lookX: -.8, handL: [-1.6, -9.4], handR: [1.6, -9.4], handPoseL: 'fist', handPoseR: 'fist', footR: [2.2, -1 - .8 * Math.max(0, Math.sin(t * 9))] });   // tapping his foot
    if (inW(t, AHEM, WAVE[0])) set({ handR: [.9, -16.4], handPoseR: 'fist', eyes: 'closed', mouth: 'o', brows: 'up', sq: .05 * kick(t, AHEM, 6), lookX: -.6 });
    if (inW(t, WAVE[0], WAVE[1])) set({ handR: [5.6 + 1.6 * Math.sin(t * 11), -21], handPoseR: 'palm', brows: 'up', mouth: 'o', lookX: -.85, lean: -.05 });   // hello?
    if (inW(t, WAVE[1], 32.2)) set({ lookX: lookAt('safadi', speakerKid(t)) || -.8, brows: 'quizzical', mouth: 'flat', handR: [.8, -16.1], handPoseR: 'fist', handL: [.6, -10.6], handPoseL: 'fist' });   // hand to chin
    if (inW(t, 21.6, 32.2)) set({ brows: 'up', mouth: 'o' });
    if (inW(t, 32.2, 36.0)) set({ handR: [5.6, -21.4], handPoseR: 'point', brows: 'up', lookX: -.8 });                                 // remember?
    if (inW(t, 36.0, SAMI_IN[0])) set({ handR: [1.6, -27.6], handPoseR: 'palm', eyes: 'closed', brows: 'worried', mouth: 'frown', tilt: -.04 });   // facepalm
    if (inW(t, SAMI_IN[0], 40.8)) set({ lookX: .2, turn: .1, brows: 'up', mouth: 'smile' });
    if (inW(t, 40.8, LOOK_UP)) set({ handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist', brows: 'normal', mouth: 'smirk', lookX: -.7 });   // arms crossed: tell them, brother
    if (inW(t, LOOK_UP, 49.6)) set({ eyes: 'wide', brows: 'up', mouth: say('O'), lean: -.05, lookX: -.8, handL: [-4.4, -8.1], handR: [4.4, -8.1] });
    if (inW(t, 49.6, RIP_S[1])) set({ lookX: -.5, turn: -.25, eyes: 'open', brows: 'worried', mouth: 'flat', sq: .06 * kick(t, GULP, 7), emote: 'sweat', emoteK: on(t, 49.8, RIP_S[1], .2), blush: .5 });
    if (inW(t, RIP_R1[0], 75.6)) {                                             // I use it to research my books
      set({ handR: [3.4, -27.8], handPoseR: 'palm', brows: 'worried', mouth: say('teeth'), eyes: talk ? 'open' : 'happy', blush: .8, lookX: -.6, emote: 'sweat', emoteK: on(t, 70.4, 75.6, .2), dy: .2 * Math.sin(t * 9) });
    }
    if (inW(t, RIP_R2[0], 97.4)) set({ lookX: lookAt('safadi', 'sami'), turn: -.3, brows: 'up', mouth: 'smirk', handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist' });   // your turn, brother
    if (inW(t, 97.4, 99.6)) set({ lean: -.06, eyes: 'wide', mouth: 'o', brows: 'up', lookX: -.8 });
    if (inW(t, 99.6, 103.2)) set({ handR: [6.6, -17.4], handPoseR: 'point', brows: 'focused', mouth: say('flat'), lookX: -.8, turn: .1 });   // outside!
    if (inW(t, 103.2, 109.4)) set({ lookX: .5, turn: .25, brows: 'normal', mouth: 'flat', handL: [-1.6, -9.4], handR: [1.6, -9.4], handPoseL: 'fist', handPoseR: 'fist' });   // watching them go
    if (inW(t, 109.4, 112.4)) set({ lookX: lookAt('safadi', 'sami'), turn: -.3, handR: [.8, -16.1], handPoseR: 'fist', handL: [.6, -10.6], handPoseL: 'fist', eyes: 'narrow', brows: 'quizzical', mouth: 'smirk' });
    if (inW(t, 112.4, LAUGH)) set({ lookX: lookAt('safadi', 'sami'), turn: -.3, handR: [5.6, -21.4], handPoseR: 'point', brows: frac(t * 3) < .5 ? 'up' : 'normal', mouth: say('smirk'), eyes: 'open' });   // eyebrows waggling
    if (t > LAUGH) set({ handL: [-3.6, -8.4], handR: [3.6, -8.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: talk ? lipFlap(t, true, 'grin') : 'grin', brows: 'up', jump: .35 * bounce(t, 11), tilt: -.05, lookX: -.3 });
    return o;
  }
  function speakerKid(t) { let who = null; for (const l of LINES) if (l.at <= t + .1 && KIDS.includes(l.speaker) && !l.group) who = l.speaker; return who; }
  function roomSamiPose(t) {
    const talk = speaking('sami', t), a = at('sami', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.6, turn: -.25, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p), say = m => talk ? o.mouth : m;
    if (a && a.moving) return set({ ...samiWalk(a.dist / 58, 1), lookX: -.3, turn: -.2, mouth: 'smile', brows: 'up' });
    if (inW(t, SAMI_IN[1], 43.2)) set({ handL: [-1.0, -11.2], handPoseL: 'fist', handR: [-.4, -12.6], handPoseR: 'point', lookY: .4, brows: 'focused', lookX: -.3 });   // tapping his watch
    if (inW(t, 41.8, 43.2)) set({ lookY: 0, lookX: -.7 });
    if (inW(t, 43.2, LOOK_UP)) set({ handL: [-6.0, -14.2], handR: [6.0, -14.2], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', lookX: -.7 });   // over!
    if (inW(t, LOOK_UP, 49.6)) set({ eyes: 'wide', brows: 'up', mouth: 'O', lean: -.05, lookX: -.7 });
    if (inW(t, 49.6, RIP_S[1])) set({ lookX: lookAt('sami', 'safadi'), turn: .3, brows: 'worried', mouth: 'flat', sq: .06 * kick(t, GULP, 7), emote: 'sweat', emoteK: on(t, 49.8, RIP_S[1], .2), blush: .5 });
    if (inW(t, RIP_R1[0], 75.6)) set({ lookX: lookAt('sami', 'safadi'), turn: .3, brows: 'up', mouth: 'smirk', handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist' });   // busted, brother
    if (inW(t, RIP_R2[0], 97.4)) set({ handR: [3.4, -27.8], handPoseR: 'palm', brows: 'worried', mouth: say('teeth'), eyes: talk ? 'open' : 'happy', blush: .8, lookX: -.6, emote: 'sweat', emoteK: on(t, 94.2, 97.4, .2), dy: .2 * Math.sin(t * 9) });
    if (inW(t, 97.4, 99.6)) set({ lean: -.06, eyes: 'wide', mouth: 'o', brows: 'up', lookX: -.7 });
    if (inW(t, 99.6, 103.2)) set({ handR: [6.6, -17.4], handPoseR: 'point', brows: 'focused', mouth: say('flat'), lookX: -.7 });
    if (inW(t, 103.2, 109.4)) set({ lookX: .5, turn: .25, brows: 'normal', mouth: 'flat' });
    if (inW(t, 109.4, 112.4)) set({ handL: [-6.2, -14.4], handR: [6.2, -14.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', mouth: say('smile'), lookX: lookAt('sami', 'safadi'), turn: .3 });   // a shrug
    if (inW(t, 112.4, LAUGH)) set({ lookX: lookAt('sami', 'safadi'), turn: .3, brows: 'up', mouth: t > 114.6 ? 'grin' : 'o', eyes: t > 114.6 ? 'happy' : 'open' });
    if (t > LAUGH) set({ handL: [-3.6, -8.4], handR: [3.6, -8.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: talk ? lipFlap(t, true, 'grin') : 'grin', brows: 'up', jump: .35 * bounce(t, 11, 1), tilt: .05, lookX: .3 });
    return o;
  }

  // ---------- drawing a character in the bedroom ----------
  function drawChar(name, P, t, A, S, pose) {
    const a = at(name, t); if (!a || P.depth(a.z) < 60) return;
    const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[name] * k; pose = { ...pose, t };
    const draw = () => {
      const R = A[name] = RIG[name](sx, sy, s, pose);
      if (pose.emote && ['jenna', 'danny', 'housam'].includes(name) && (pose.emoteK ?? 1) > .02) alEmote(pose.emote, R, k * ALMA_UNIT, pose.emoteK ?? 1, t);
      if (pose.tablet) {                                                        // the tablet, its back to us
        let w = 27 * k, mx = (R.handL[0] + R.handR[0]) / 2, my = (R.handL[1] + R.handR[1]) / 2 - 1.5 * k, ang = .03 * Math.sin(t * 1.3 + sx);
        if (pose.tablet === 'hand') { mx = R.handL[0] - 2 * k; my = R.handL[1] + 4 * k; ang = -.9; w *= .92; }
        if (pose.tablet === 'waist') my += 2 * k;
        stTablet(mx, my, w, ang, ST.case[name]);
      }
      if (pose.glow > .01) stFaceGlow(R.head[0], R.head[1] + 1.5 * s, 13 * s, t, pose.glow);
    };
    if (a.fade !== undefined && a.fade < 1) { if (a.fade > .01) { X.save(); X.globalAlpha = a.fade; draw(); X.restore(); } } else draw();
    S[name] = s;
  }
  const POSE = n => KIDS.includes(n) ? t => kidPose(n, t) : n === 'safadi' ? roomSafadiPose : roomSamiPose;
  const ROOM_SET = { messy: 0, lamp: .55 };
  function roomStage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {}, actors = [];
    for (const n of [...KIDS, 'safadi', 'sami']) { const a = at(n, t); if (a && P.depth(a.z) > 60) actors.push({ z: a.z, draw: () => drawChar(n, P, t, A, S, POSE(n)(t)) }); }
    for (const [kind, x, z, r] of GAME_AT) actors.push({ z, draw: () => cuGameFloor(P, kind, x, z, 40, r) });
    if (t > (DOWN[0] + DOWN[1]) / 2) for (const n of KIDS) { const [x, z, r] = FLOOR_TAB[n]; actors.push({ z, draw: () => stTabletFloor(P, x, z, ST.case[n], r) }); }
    const vis = actors.filter(a => P.depth(a.z) > 30).sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => BR.back(P, t, { ...ROOM_SET, splitZ: vis.length ? vis[0].z : -Infinity }), { blur });
    vis.forEach((a, i) => { a.draw(); BR.front(P, t, { ...ROOM_SET, splitZ: a.z, toZ: vis[i + 1]?.z }); });
    return { A, S, P };
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
          callout(l.text, clamp(mx, 420, W - 420), my - 40, age, { ...c, size: c.size * 1.2, dx: 0, dy: o.groupDy ?? -200 }); continue; }
      }
      const key = l.speaker, a = A?.[key], s = S?.[key]; if (!a || a.mouth[0] < 60 || a.mouth[0] > W - 60) continue;
      const side = o.side ? o.side(key) : (a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: o.dy ?? -220 });
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  // the bedroom (bed view unless dir −1)
  const R_WIDE = t => ({ ...cam(10, 165, 30, 560, 640)(t), z: lerp(20, 80, ease(seg(t, 0, 3.8))) });
  const R_GROUP = cam(30, 140, 20, 560, 640);                                  // everyone: the kids on the left, the twins on the right
  const R_KIDS = cam(-110, 110, 175, 560, 720);                                // the four kids and their tablets
  const R_TWINS = cam(185, 120, 20, 520, 900);                                 // the twins (the kids behind)
  const R_DOOR = cam(260, 140, 520, 545, 700, -1);                             // the door: the twins drop in
  const R_DOOR2 = cam(300, 140, 520, 545, 650, -1);                           // the door again, wider: Sami comes in past his brother
  const R_OUT = cam(30, 150, 720, 545, 700, -1);                               // from the bed back at the door: the kids trudge out
  const R_FINAL = t => ({ ...R_TWINS(t), z: lerp(20, 75, ease(seg(t, 109.2, FREEZE))) });
  // the study and the clinic (desk views)
  const S_MED = t => { const [dx, dy] = drift(t), u = ease(seg(t, RIP_S[0], ZOOM_S[1])); return { x: lerp(-40, -85, u) + dx, y: lerp(140, 120, u), z: lerp(540, 650, u), f: 1000, hy: lerp(570, 600, u) + dy, dir: 1 }; };
  const S_CLOSE = cam(-50, 140, 700, 600, 1100);
  const C_MED = t => { const [dx, dy] = drift(t), u = ease(seg(t, RIP_C[0], ZOOM_C[1])); return { x: lerp(-60, -115, u) + dx, y: lerp(140, 125, u), z: lerp(560, 670, u), f: 1000, hy: lerp(570, 600, u) + dy, dir: 1 }; };
  const C_CLOSE = cam(-70, 140, 710, 600, 1100);

  const rshot = (camFn, blur, bo) => t => { const { A, S, P } = roomStage(t, camFn(t), blur); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const kidsBo = { size: 50, side: n => n === 'jenna' || n === 'danny' ? -1 : 1, far: 230, dy: -230, groupDy: -250 };
  const opening = rshot(R_WIDE, .3, { size: 48 });
  const group = rshot(R_GROUP, .4, { size: 48, side: n => n === 'safadi' || n === 'sami' ? -1 : 1, far: 240, dy: -230, groupDy: -230 });
  const kids = rshot(R_KIDS, 1.4, kidsBo);
  const twins = rshot(R_TWINS, 2.2, { size: 50, side: n => n === 'safadi' ? 1 : -1, far: 250, dy: -250, groupDy: -270 });
  const door = rshot(R_DOOR, .8, { size: 50, side: () => 1, far: 280, dy: -240 });
  const door2 = rshot(R_DOOR2, .8, { size: 50, side: () => 1, far: 280, dy: -240 });
  const doorOut = rshot(R_OUT, .5, { size: 48 });
  function final(t) {                                                          // the twins laugh; freeze
    const tt = Math.min(t, FREEZE), { A, S, P } = roomStage(tt, R_FINAL(tt), 2.0);
    bubbles(tt, A, S, { size: 50, side: n => n === 'safadi' ? 1 : -1, far: 250, dy: -250, groupDy: -270 }); extras(tt, A, S, P);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .45 * k; X.fillStyle = '#BFD8F2'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#425DA0'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.2, END - .8))));
  }

  // things that ride on top of the bedroom shots
  function extras(t, A, S, P) {
    if (t < LOOK_UP) for (const n of KIDS) {                                   // little bleeps from the tablets
      const r = A[n]; if (!r) continue; const i = Math.floor(t * 1.1 + PH[n]), age = t - (i - PH[n]) / 1.1;
      if (hash(i * 3.7 + PH[n]) > .55) sfx(['bleep', 'pew!', 'blip', 'zap'][Math.floor(hash(i * 9.1) * 4)], (r.handL[0] + r.handR[0]) / 2 + 30 * (hash(i) - .5), r.handL[1] - 3.5 * S[n], 26, '#BFF3FF', age, { life: .6, rot: hash(i * 2) - .5 });
    }
    if (inW(t, KNOCK[0], 5.0)) KNOCK.forEach((t0, i) => sfx('KNOCK', W * (.5 + .1 * i), H * .28 - 30 * i, 64, '#FFFDF6', t - t0, { life: .6, rot: i ? .1 : -.1 }));
    if (inW(t, SAMI_IN[0] - .3, SAMI_IN[0] + .8)) [SAMI_IN[0] - .3, SAMI_IN[0]].forEach((t0, i) => sfx('KNOCK', W * (.5 + .1 * i), H * .28 - 30 * i, 64, '#FFFDF6', t - t0, { life: .6, rot: i ? .1 : -.1 }));
    if (inW(t, 11.6, 15.6)) [11.8, 14.4].forEach(t0 => sfx('cricket... cricket...', W * .3, H * .18, 40, '#E8F5D0', t - t0, { life: 1.4, rot: -.04 }));
    const sf = A.safadi, ss = S.safadi;
    if (sf && inW(t, AHEM, AHEM + 1)) sfx('AHEM!', sf.head[0] - 6 * ss, sf.top[1] - 1 * ss, 60, '#FFE066', t - AHEM, { life: .9, rot: -.08 });
    if (inW(t, 36.0, 37.8) && sf) sfx('sigh...', sf.head[0] + 6 * ss, sf.top[1] - 2 * ss, 40, '#FFFDF6', t - 36.8, { life: 1.0, rot: .06 });
    for (const n of ['safadi', 'sami']) if (A[n] && inW(t, GULP, GULP + .9)) sfx('gulp!', A[n].head[0], A[n].top[1] - 2 * S[n], 46, '#FFFDF6', t - GULP - (n === 'sami' ? .15 : 0), { life: .8, rot: n === 'sami' ? .1 : -.1 });
    if (inW(t, 97.4, 99.0)) for (const n of KIDS) if (A[n]) sfx('STOMP!', A[n].footL ? A[n].footL[0] : A[n].head[0], (A[n].footL || A[n].head)[1] + 10, 34, '#FFE066', t - 97.5, { life: .6, rot: hash(PH[n]) - .5 });
    if (inW(t, OUT.alma[0], 109.0)) for (const n of KIDS) { const r = A[n]; if (r) sfx('hmph!', r.head[0], r.top[1] - 2 * S[n], 34, '#FFFDF6', t - OUT[n][0] - .3, { life: .9, rot: hash(PH[n] * 3) - .5 }); }
  }

  // ---------- the tablet inserts ----------
  function tabletsInsert(kind, a, b, t0) {
    return t => {
      X.fillStyle = radGrad(W / 2, H / 2, 100, W * .7, [[0, '#FFE3F1'], [1, '#C98FB8']]); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) circle(hash(i) * W, hash(i + 7) * H, 40 + 60 * hash(i + 3), { fill: rgba('#FFFFFF', .12), stroke: null });   // a soft blur of the room
      const pop = i => backOut(seg(t, t0 + i * .15, t0 + i * .15 + .35));
      [[a, -1], [b, 1]].forEach(([n, sd], i) => {
        const p = pop(i); if (p <= 0) return;
        X.save(); X.translate(W / 2 + sd * 450, H * .46 + 8 * Math.sin(t * 2 + i)); X.scale(p, p);
        stTabletFront(0, 0, 800, kind, t + i * .7, { view: i, name: n.toUpperCase(), col: ST.case[n], ang: sd * .035 });
        X.restore();
      });
      if (kind === 'craft') { sfx('tap!', W * .29, H * .82, 40, '#FFFDF6', t - (t0 + .8), { life: .6, rot: -.1 }); sfx('tap tap!', W * .73, H * .84, 40, '#FFFDF6', t - (t0 + 1.3), { life: .6, rot: .1 }); }
      else { sfx('KA-POW!', W * .5, H * .2, 90, '#FFE066', t - (t0 + .7), { life: 1.0, rot: -.06 }); sfx('pew pew!', W * .2, H * .86, 44, '#7CFF9B', t - (t0 + .3), { life: .8, rot: -.1 }); }
    };
  }
  const craftInsert = tabletsInsert('craft', 'alma', 'jenna', 24.4);
  const fightInsert = tabletsInsert('fight', 'housam', 'danny', 29.8);

  // =====================================================================================================
  // ---------- the study: the serious professor ----------
  const SAF_DESK = [-60, 930], LAPTOP = [-110, 78, 816], BOOKS = [35, 78, 790];
  function studyPose(t, playing) {
    const o = { dy: 1.2, mouth: 'flat', brows: 'focused', lookX: -.45, lookY: .55, turn: -.15, handL: [-9.6 + .4 * Math.sin(t * 15), -14.4 + .3 * Math.max(0, Math.sin(t * 15))],
      handR: [-6.2 + .4 * Math.sin(t * 13 + 1), -14.6 + .3 * Math.max(0, Math.sin(t * 13 + 1))], handPoseL: 'fist', handPoseR: 'fist' };
    if (!playing && t > 55.6) o.mouth = 'smirk';                              // a hint of a grin…
    if (playing) {
      const m = 1.4;                                                           // mashing the keys
      Object.assign(o, { handL: [-9.6 + m * Math.sin(t * 31), -14.4 + m * Math.max(0, Math.sin(t * 29))], handR: [-6.2 + m * Math.sin(t * 27 + 1), -14.6 + m * Math.max(0, Math.sin(t * 33 + 1))],
        eyes: 'wide', mouth: 'teeth', brows: 'angry', power: .8, dy: 1.0 + .3 * bounce(t, 14), lean: .04 * Math.sin(t * 7), lookX: -.4, lookY: .4 });
      if (t > YES) Object.assign(o, { handR: [4.6, -24.0], handPoseR: 'fist', handL: [-9.6, -14.4], eyes: 'happy', mouth: 'grin', brows: 'up', jump: 1.2 * kick(t, YES, 5), power: 1, lookY: 0, lookX: -.1 });
    }
    return o;
  }
  function studyStage(t, cam, blur, playing) {
    const P = persp(cam), A = {}, S = {}, o = { splitZ: SAF_DESK[1], lamp: .7 };
    layer(() => SST.back(P, t, o), { blur });
    const [sx, sy, k] = P.p(SAF_DESK[0], 0, SAF_DESK[1]), s = SAFADI_UNIT * k;
    A.safadi = safadi(sx, sy, s, { ...studyPose(t, playing), t }); S.safadi = s;
    SST.front(P, t, o);
    stBookStack(P, ...BOOKS, t);
    if (playing) { const sf = A.safadi; stFaceGlow(sf.head[0], sf.head[1] + 1.5 * s, 14 * s, t, 1);
      const [lx, ly] = P.p(LAPTOP[0], LAPTOP[1] + 45, LAPTOP[2]); [64.9, 65.3].forEach((t0, i) => sfx(i ? 'ZAP!' : 'PEW!', lx + (i ? 60 : -40), ly - i * 40, 46, '#7CFF9B', t - t0, { life: .5, rot: i ? .1 : -.1 }));
      if (t > YES) { sfx('YES!', sf.top[0] + 4 * s, sf.top[1] - 2 * s, 80, '#FFE066', t - YES, { life: 1.2, rot: .08 }); sfx('HIGH SCORE!', W * .3, H * .22, 70, '#7CFF9B', t - YES - .2, { life: 1.4, rot: -.06 }); } }
    return { A, S, P };
  }
  const study = t => studyStage(t, S_MED(t), 1.2, false);
  const studyPlay = t => studyStage(t, S_CLOSE(t), 1.6, true);
  const laptopAt = t => { const P = persp(S_MED(t)); return P.p(LAPTOP[0], LAPTOP[1] + 22, LAPTOP[2]); };

  // ---------- the clinic: the serious doctor ----------
  const SAMI_DESK = [-90, 940], COMPUTER = [-140, 76, 840], FILM = [35, 76.3, 805];
  function clinicPose(t, playing) {
    const o = { dy: 1.2, mouth: 'flat', brows: 'focused', lookX: -.35, lookY: .3, turn: -.1, handL: [-7.2 + .4 * Math.sin(t * 15), -14.2 + .3 * Math.max(0, Math.sin(t * 15))],
      handR: [4.6, -14.0], handPoseL: 'fist', handPoseR: 'point' };
    if (!playing && inW(t, 77.4, 79.2)) Object.assign(o, { lookX: .5, lookY: .6 });          // a serious look at the X-ray
    if (!playing && t > 79.2) Object.assign(o, { handR: [-4.0 + .4 * Math.sin(t * 13), -14.4], handPoseR: 'fist', mouth: 'smirk' });
    if (playing) {
      const g = t > GOOAL;
      Object.assign(o, { handL: [-7.2 + 1.3 * Math.sin(t * 29), -14.2 + 1.2 * Math.max(0, Math.sin(t * 31))], handR: [-4.0 + 1.3 * Math.sin(t * 27), -14.4 + 1.2 * Math.max(0, Math.sin(t * 33))], handPoseR: 'fist',
        eyes: 'wide', mouth: 'teeth', brows: 'angry', power: .7, lookY: .3 });
      if (g) Object.assign(o, { handL: [-6.4, -25], handR: [6.4, -25], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', brows: 'up', jump: 1.6 * kick(t, GOOAL, 4) + .4 * bounce(t, 9), power: 1, lookY: -.2, lookX: 0, dy: 0 });
    }
    return o;
  }
  function clinicStage(t, cam, blur, playing) {
    const P = persp(cam), A = {}, S = {}, o = { splitZ: SAMI_DESK[1], bpm: playing ? 140 : 72 };
    layer(() => CL.back(P, t, o), { blur });
    const [sx, sy, k] = P.p(SAMI_DESK[0], 0, SAMI_DESK[1]), s = SAMI_UNIT * k;
    A.sami = sami(sx, sy, s, { ...clinicPose(t, playing), t }); S.sami = s;
    CL.front(P, t, o);
    stXrayFilm(P, ...FILM);
    if (playing) { const sm = A.sami; stFaceGlow(sm.head[0], sm.head[1] + 1.5 * s, 14 * s, t, t > GOOAL ? .4 : 1);
      if (t > GOOAL) { sfx('GOOOAL!', sm.top[0] + 3 * s, sm.top[1] - 2 * s, 90, '#FFE066', t - GOOAL, { life: 1.6, rot: -.08 }); } }
    return { A, S, P };
  }
  const clinic = t => clinicStage(t, C_MED(t), 1.2, false);
  const clinicPlay = t => clinicStage(t, C_CLOSE(t), 1.6, true);
  const computerAt = t => { const P = persp(C_MED(t)); return P.p(COMPUTER[0], COMPUTER[1] + 32, COMPUTER[2]); };

  // =====================================================================================================
  // ---------- the video games (stRoboScreen / stSoccerScreen live in props.js, shared with scene 33) ----------
  const roboGame = t => stMonitor(t, (w, h) => stRoboScreen(w, h, t, ROBO[0]));
  const soccerGame = t => stMonitor(t, (w, h) => stSoccerScreen(w, h, t, SOCCER[0]), { wall: '#1E2830' });

  // =====================================================================================================
  // ---------- transitions ----------
  // a ripple dissolve between two shots (as in scene 30): both painted off-screen, laid down in wavy, cross-faded strips
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
  // a push through a screen: the room swells around the screen's point while the game grows out of it
  const zoomShot = ([a, b], fromFn, toFn, focus) => t => {
    const u = seg(t, a, b), [fx, fy] = focus(t);
    paintOff(0, fromFn, t); paintOff(1, toFn, Math.max(t, b));
    const z = lerp(1, 7, easeIn(u)), g = lerp(.12, 1, easeOut(seg(u, .35, 1))), gx = lerp(fx, W / 2, ease(seg(u, .35, 1))), gy = lerp(fy, H / 2, ease(seg(u, .35, 1)));
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    X.translate(fx, fy); X.scale(z, z); X.translate(-fx, -fy); X.drawImage(OFF[0], 0, 0);
    X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = ease(seg(u, .3, .6)); X.translate(gx, gy); X.scale(g, g); X.drawImage(OFF[1], -W / 2, -H / 2);
    X.restore();
    flash(.5 * Math.sin(Math.PI * seg(u, .2, .8)), '#E8FFF0');
  };
  const toStudy = rippleShot(RIP_S, twins, study);
  const zoomStudy = zoomShot(ZOOM_S, study, roboGame, laptopAt);
  const toRoom1 = rippleShot(RIP_R1, studyPlay, twins);
  const toClinic = rippleShot(RIP_C, kids, clinic);
  const zoomClinic = zoomShot(ZOOM_C, clinic, soccerGame, computerAt);
  const toRoom2 = rippleShot(RIP_R2, clinicPlay, twins);

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: glued to the screens
      [0, opening], [3.8, door], [7.2, twins], [11.2, group], [15.4, kids], [24.4, craftInsert], [26.6, kids], [29.8, fightInsert],
      [31.9, twins], [35.8, group], [37.8, door2], [40.6, twins], [44.4, group], [50.0, twins],
      // part 2: the professor's research
      [RIP_S[0], toStudy], [RIP_S[1], study], [ZOOM_S[0], zoomStudy], [ROBO[0], roboGame], [ROBO[1], studyPlay], [RIP_R1[0], toRoom1],
      [RIP_R1[1], twins], [73.6, kids],
      // part 3: the doctor's research
      [RIP_C[0], toClinic], [RIP_C[1], clinic], [ZOOM_C[0], zoomClinic], [SOCCER[0], soccerGame], [SOCCER[1], clinicPlay], [RIP_R2[0], toRoom2],
      [RIP_R2[1], twins], [97.2, group], [99.4, twins], [103.2, doorOut],
      // part 4: the twins
      [109.2, final],
    ] });
})();
