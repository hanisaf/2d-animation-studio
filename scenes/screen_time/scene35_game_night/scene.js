// Scene 35: "Game Night". Straight after scene 34's "How about we all play board games?": the family plays in the living room.
// Professor Safadi plays Oligarchy with Housam and Danny; Doctor Sami plays Crazy Dolphins with Jenna and Alma. The kids explain
// the rules ("This time, allow ME to explain!") and win: Danny's towers bankrupt the professor, the doctor slaps the wrong dolphins.
// Evening falls; the twins doze off head to head. The kids giggle and play on (Danny takes the professor's turn), then wonder what
// the brothers are dreaming about. Two dream bubbles swell over the sofa. To be continued.
// Every shot is a pure function of t.
(() => {
  const LR = LOCATIONS.living_room, LINES = ASSETS.scene.scene35_game_night.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: '#C08A3E', sami: '#3E9A8C' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, sami };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 7.6, sami: 7.6 };
  const KIDS = ['housam', 'danny', 'alma', 'jenna'];

  // ---------- timing ----------
  const DEMO = 35.0, ROLL1 = 42.6, SLAP1 = 52.4, SLAP2 = 59.4, HIGH5 = 75.8;
  const DUSK = [84.8, 88.0], S_SLEEP = [91.6, 94.0], DICE_DROP = 93.8, SNORE_S = 94.4;
  const M_YAWN = 98.6, M_SLEEP = [100.8, 103.8], LEAN = [104.2, 105.4];
  const GIGGLE = 109.0, ROLL2 = 115.4, PAY2 = 118.0, SLAP3 = 119.9;
  const GUESS = { danny: [130.6, 134.0], jenna: [134.0, 138.4], housam: [138.4, 141.4] };
  const DREAM = 141.4, FREEZE = 146.6, END = 152.0;

  // ---------- helpers ----------
  const lineDur = l => l.text.replace(/\*/g, '').length / l.cps + l.hold;
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const saying = (who, t) => LINES.find(l => l.speaker === who && !l.silentBubble && t > l.at && t < l.at + lineDur(l));
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];
  const dusk = t => ease(seg(t, DUSK[0], DUSK[1]));
  const sleepS = t => ease(seg(t, S_SLEEP[0], S_SLEEP[1]));
  const sleepM = t => ease(seg(t, M_SLEEP[0], M_SLEEP[1]));
  const lean = t => ease(seg(t, LEAN[0], LEAN[1]));

  // ---------- blocking (sofa view: +X is screen-left) ----------
  const SEAT = LR.SOFA.seat, TWIN = { safadi: [95, 140], sami: [-95, 140] }, HIP = 8;   // seated on the cushion's front edge: hips (local y −8) at seat height, knees bent
  const SPOT = { housam: [200, 205], alma: [-200, 205], danny: [290, 400], jenna: [-290, 400] };
  const SIDE = { safadi: .15, sami: -.15, housam: .32, alma: -.32, danny: .69, jenna: -.69 };   // screen position from the main camera
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  // who everyone watches: the current speaker (or the twins once they sleep)
  const focusOf = t => { const l = LINES.find(l => !l.silentBubble && t > l.at && t < l.at + lineDur(l)); return l ? l.speaker : null; };

  // ---------- the twins, seated ----------
  function twinPose(name, t) {
    const talk = speaking(name, t), say = m => talk ? lipFlap(t, true, m) : m, other = name === 'safadi' ? 'sami' : 'safadi', ph = name === 'sami' ? 1.3 : 0;
    const game = name === 'safadi' ? ['housam', 'danny'] : ['alma', 'jenna'];
    const o = { handL: [-3.8, -9.4], handR: [3.8, -9.4], handPoseL: 'open', handPoseR: 'open', lookY: .35, lookX: lookAt(name, game[0]) * .6, eyes: 'open', brows: 'normal', mouth: say('smile'), dy: .2 };
    const set = p => Object.assign(o, p);
    const f = focusOf(t); if (f && f !== name) set({ lookX: lookAt(name, f), lookY: .15 });
    if (talk) set({ brows: 'up', mouth: say('talk'), handR: [5.0, -18.5], handPoseR: 'palm', lookY: .15 });
    if (name === 'safadi') {
      if (inW(t, 2.6, 6.0)) { const r = Math.sin(t * 14); set({ handL: [-1.4 + .5 * r, -17.5], handR: [1.4 - .5 * r, -17.6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', brows: 'up' }); }   // rubbing hands
      if (inW(t, 6.2, 8.6)) set({ eyes: t < 6.5 ? 'closed' : 'wide', brows: 'up', mouth: 'o', handL: [-3.8, -9.4], handR: [3.8, -9.4], handPoseR: 'open', lookX: lookAt('safadi', 'housam') });
      if (inW(t, 19.6, 22.2)) set({ handR: [4.4, -22], handPoseR: 'point', brows: 'up', eyes: 'happy' });
      if (inW(t, 22.4, 24.8)) set({ eyes: 'open', brows: 'worried', mouth: 'flat' });
      if (inW(t, 49.2, 51.2)) set({ eyes: 'wide', brows: 'up', mouth: say('O'), handL: [-6.2, -23], handR: [6.2, -23], jump: .5 * kick(t, 49.3, 6), dy: -.2, emote: '!', emoteK: on(t, 49.3, 51.0, .2) });
      if (inW(t, 51.2, 52.4) || inW(t, 54.5, 56.0)) { const c = Math.sin(t * 12); set({ eyes: 'squeeze', brows: 'worried', mouth: 'wobble', handL: [-2, -15.5], handR: [2.2 + .8 * c, -16 - .6 * Math.abs(c)], handPoseR: 'open', lookY: .6 }); }   // counting out the bills
      if (inW(t, 68.0, 72.0)) set({ handL: [-1.0, -19.0], handPoseL: 'point', brows: 'focused', lookY: .5, eyes: 'narrow' });
      if (inW(t, 72.0, 75.2)) set({ eyes: 'open', brows: 'up', mouth: 'o', lookX: lookAt('safadi', 'housam') });
      if (inW(t, 75.2, 77.0)) set({ eyes: 'squeeze', brows: 'worried', mouth: say('flat'), emote: 'sweat', emoteK: on(t, 75.2, 77.0, .25) });
      if (inW(t, 77.0, 80.6)) set({ lookX: lookAt('safadi', 'sami'), brows: 'up', mouth: 'smirk', tilt: -.05 });
    } else {
      if (inW(t, 9.2, 11.0)) set({ eyes: 'happy', mouth: 'grin', jump: .2 * kick(t, 9.4, 6), lookX: lookAt('sami', 'safadi') });
      if (inW(t, 38.8, 42.6)) { if (t < 40.6) { const r = Math.sin(t * 18); set({ handL: [-1.0, -17.5 + .4 * r], handR: [1.0, -17.5 - .4 * r], handPoseL: 'fist', handPoseR: 'fist' }); }
        else set({ handR: [5.2, -20], handPoseR: 'thumb', eyes: 'happy' }); }
      if (inW(t, 54.5, 56.4)) set({ eyes: 'wide', brows: 'up', mouth: 'o', lookX: lookAt('sami', 'alma') });
      if (inW(t, 56.4, 59.4)) { const w = Math.sin(t * 20); set({ handR: [4.6 + .7 * w, -17 + .5 * w], handPoseR: 'open', eyes: 'squeeze', brows: 'worried', mouth: say('wobble') }); }
      if (inW(t, 60.9, 62.6)) set({ eyes: 'wide', brows: 'up', mouth: say('O'), handL: [-5, -14], handR: [5, -14], handPoseL: 'palm', handPoseR: 'palm', jump: .4 * kick(t, 61.0, 6) });
      if (inW(t, 62.6, 65.4)) set({ eyes: 'open', brows: 'worried', mouth: 'wobble', emote: 'sweat', emoteK: on(t, 62.7, 65.4, .25), lookX: lookAt('sami', 'jenna') });
      if (inW(t, 65.4, 68.0)) set({ handR: [-5.6, -15.5], handPoseR: 'open', brows: 'worried', mouth: 'flat', lookX: lookAt('sami', 'alma'), lean: -.04 });   // hands over two cards
      if (inW(t, 77.0, 80.6)) set({ lookX: lookAt('sami', 'safadi'), handR: [1.2, -19.5], handPoseR: 'palm', tilt: .06, brows: 'up' });   // whispering behind his hand
    }
    // "What is World Champion?" … "N-nothing!"
    if (inW(t, 80.6, 82.4)) set({ eyes: 'wide', brows: 'up', mouth: 'o', lookX: lookAt(name, 'danny'), handR: [3.8, -9.4], handPoseR: 'open', tilt: 0 });
    if (inW(t, 82.4, 84.8)) { const w = Math.sin(t * 16 + ph); set({ eyes: 'wide', brows: 'worried', mouth: say('wobble'), handL: [-5.4 + w * .6, -20], handR: [5.4 - w * .6, -20], handPoseL: 'palm', handPoseR: 'palm', emote: 'sweat', emoteK: on(t, 82.5, 84.8, .2) }); }
    // evening: getting drowsy
    const dz = dusk(t);
    if (t > DUSK[0] && !talk) set({ eyes: dz > .6 ? 'narrow' : o.eyes, lookY: .45 });
    if (name === 'safadi') {
      if (inW(t, 87.6, 89.4)) set({ mouth: 'O', eyes: 'closed', brows: 'up', handR: [1.0, -19.5], handPoseR: 'open', dy: -.2 });   // a huge yawn
      const z = sleepS(t);
      if (t > S_SLEEP[0]) set({ eyes: z > .8 ? 'closed' : 'narrow', brows: 'normal', mouth: z > .8 ? 'o' : say('flat'), tilt: -.22 * z - .1 * lean(t), dy: .2 + .5 * z, lookY: .5, handL: [-3.6, -9.0], handR: [3.6, -9.0], handPoseR: t < DICE_DROP ? 'fist' : 'open', emote: null });
    } else {
      if (inW(t, 96.8, M_YAWN)) set({ eyes: 'happy', mouth: say('grin'), lookX: lookAt('sami', 'safadi'), jump: .15 * Math.abs(Math.sin(t * 9)) });
      if (inW(t, M_YAWN, 100.2)) set({ mouth: 'O', eyes: 'closed', brows: 'up', handR: [-1.0, -19.5], handPoseR: 'open', dy: -.2 });
      const z = sleepM(t);
      if (t > 100.2) set({ eyes: z > .8 ? 'closed' : 'narrow', brows: 'normal', mouth: z > .8 ? 'o' : say('smile'), tilt: .22 * z + .1 * lean(t), dy: .2 + .5 * z, lookY: .5, handL: [-3.6, -9.0], handR: [3.6, -9.0], handPoseR: 'open' });
      if (inW(t, 124.0, 126.9)) set({ mouth: lipFlap(t, speaking('sami', t), 'smile'), brows: 'up' });   // talking in his sleep
    }
    // asleep: breathing in turn
    if (o.eyes === 'closed' && t > SNORE_S) set({ mouth: Math.sin(t * 2.2 + ph * 2.4) > 0 ? 'o' : 'flat', breathe: 1 });
    return o;
  }

  // ---------- the kids, at the table ----------
  function kidPose(name, t) {
    const talk = speaking(name, t), ph = { alma: 0, jenna: 1.3, danny: 2.6, housam: 3.9 }[name], say = m => talk ? lipFlap(t, true, m) : m;
    const twin = name === 'housam' || name === 'danny' ? 'safadi' : 'sami';
    const o = { giraffe: false, mouth: say('smile'), brows: 'normal', eyes: 'open', lookY: .3, lookX: lookAt(name, twin) * .5,
      handL: [-2.6, -10.2], handR: [2.6, -10.2], handPoseL: 'open', handPoseR: 'open', lean: 0 };
    const set = p => Object.assign(o, p);
    const f = focusOf(t); if (f && f !== name) set({ lookX: lookAt(name, f), lookY: .05 });
    if (talk) set({ brows: 'up', mouth: say('talk'), handR: [4.6, -13.5], handPoseR: 'palm', lookY: 0 });
    // the rules
    if (name === 'housam' && inW(t, 6.0, 9.4)) set({ handR: [4.8, -16.5], handPoseR: 'palm', brows: 'focused', lookX: lookAt('housam', 'safadi') });
    if (name === 'danny' && inW(t, 16.6, 19.6)) { const r = Math.sin(t * 14); set({ handL: [-1.2 + .4 * r, -11.8], handR: [1.2 - .4 * r, -12.0], handPoseL: 'fist', handPoseR: 'fist', mouth: talk ? o.mouth : 'grin', brows: 'focused' }); }
    if (name === 'housam' && inW(t, 22.4, 24.8)) set({ mouth: talk ? o.mouth : 'smirk', brows: 'focused' });
    if ((name === 'jenna' || name === 'alma') && inW(t, 28.6, 35.0) && !talk) set({ lookX: lookAt(name, 'sami') });
    // the kids are winning
    if (name === 'danny' && inW(t, 45.9, 49.2)) set({ jump: .9 * kick(t, 46.0, 5), handR: [4.4, -16], handPoseR: 'point', eyes: 'wide', brows: 'up', lookX: lookAt('danny', 'safadi') });
    if (name === 'danny' && inW(t, 49.2, 52.4)) set({ handR: [-1.6, -12.5], handPoseR: 'palm', mouth: 'grin', lookX: lookAt('danny', 'safadi') });   // palm out for the money
    if (name === 'alma' && inW(t, 54.5, 56.4)) set({ handL: [-4, -15.5], handR: [4, -15.5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: say('O'), jump: .8 * kick(t, 54.6, 5) });
    if (name === 'jenna' && inW(t, 54.5, 56.4)) set({ eyes: 'happy', mouth: 'grin' });
    if (name === 'alma' && inW(t, 65.4, 68.0)) set({ handR: [4.0, -12.5], handPoseR: 'palm', lookX: lookAt('alma', 'sami') });
    if ((name === 'housam' || name === 'danny') && inW(t, HIGH5 - .5, HIGH5 + 1.0)) {
      const up = on(t, HIGH5 - .5, HIGH5 + 1.0, .25);
      set({ handR: name === 'housam' ? [lerp(2.6, 4.5, up), lerp(-10.2, -18.5, up)] : [lerp(2.6, -4.0, up), lerp(-10.2, -17.0, up)], handPoseR: 'open', eyes: 'happy', mouth: 'grin', jump: .4 * kick(t, HIGH5, 6), lookX: lookAt(name, name === 'housam' ? 'danny' : 'housam') });
    }
    if (inW(t, 82.4, 84.8)) set({ mouth: 'smirk', eyes: 'open', brows: 'up', lookX: lookAt(name, name === 'danny' ? 'housam' : name === 'housam' ? 'danny' : name === 'alma' ? 'jenna' : 'alma') });
    // the twins fall asleep
    if (name === 'housam' && inW(t, 95.0, 96.8)) set({ lookX: lookAt('housam', 'safadi'), lookY: .1, brows: 'up', mouth: say('o'), lean: .06 });
    if (t > 104.0 && !talk) set({ lookX: lookAt(name, twin) * .8, lookY: .1 });
    if (inW(t, GIGGLE - .2, 110.8) || inW(t, 124.4, 126.9)) { const b = Math.abs(Math.sin(t * 10 + ph)); set({ handL: [-.8, -12.6], handR: [.8, -12.6], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', brows: 'up', mouth: 'grin', dy: -.15 * b }); }
    if (name === 'jenna' && inW(t, 110.6, 112.2)) set({ handR: [.4, -13.6], handPoseR: 'point', eyes: 'open', brows: 'up', mouth: 'o' });   // "Shhh!"
    if (name === 'alma' && inW(t, 107.0, 109.0)) set({ handR: [3.6, -13], handPoseR: 'point', lookX: lookAt('alma', 'safadi') });
    if (name === 'danny' && inW(t, 112.0, 115.4)) set({ mouth: talk ? o.mouth : 'grin', brows: 'up', lookX: lookAt('danny', 'housam') });
    if (name === 'housam' && inW(t, 114.2, 115.4)) set({ handR: [4.6, -14], handPoseR: 'fist', mouth: talk ? o.mouth : 'smirk' });
    // what are they dreaming?
    if (t > 127.0) { set({ lookX: lookAt(name, twin) * .7, lookY: -.05 });
      if (name === 'alma') set({ handL: [-1.5, -11.6], handR: [1.5, -11.6], handPoseL: 'fist', handPoseR: 'fist', tilt: .06 });   // chin in her hands
      if (talk) set({ brows: 'up', mouth: say('talk') });
      for (const [who, [a, b]] of Object.entries(GUESS)) if (who === name && inW(t, a, b)) set({ eyes: inW(t, a + .2, a + 1.6) ? 'open' : 'happy', lookY: -.4, lookX: .1, brows: 'up' });
    }
    if (t > DREAM) set({ eyes: 'wide', brows: 'up', mouth: name === 'alma' ? say('o') : 'o', lookY: -.5, lookX: lookAt(name, twin) * .5, lean: .04 * ease(seg(t, DREAM, DREAM + 2)) * (SIDE[name] > 0 ? -1 : 1) });
    return o;
  }

  // ---------- the stage ----------
  function stage(t, camo, blur) {
    const P = persp(camo), A = {}, S = {}, d = dusk(t), set = { lamp: .5 + .5 * d, night: .85 * d, fan: true };
    layer(() => LR.back(P, t, { splitZ: 140, ...set }), { blur });
    for (const name of ['safadi', 'sami']) {                                   // the twins, sitting on the sofa's front edge, feet on the floor
      const [x, z] = TWIN[name], [sx, sy, kk] = P.p(x, SEAT - HIP * UNIT[name], z), s = UNIT[name] * kk;
      A[name] = RIG[name](sx, sy, s, { footL: [-3.6, -1.3], footR: [3.6, -1.3], ...twinPose(name, t), t }); S[name] = s;
    }
    const kid = name => { const [x, z] = SPOT[name]; if (P.depth(z) < 40) return; const [sx, sy, k] = P.p(x, 0, z); S[name] = UNIT[name] * k; A[name] = RIG[name](sx, sy, S[name], { ...kidPose(name, t), t }); };
    LR.front(P, t, { splitZ: 140, toZ: 205, ...set });
    kid('housam'); kid('alma');
    LR.front(P, t, { splitZ: 205, toZ: 400, ...set });                        // the coffee table
    gnTableGames(P, t, tableState(t));
    kid('danny'); kid('jenna');
    LR.front(P, t, { splitZ: 400, ...set });
    if (d > 0) overlay(() => { X.save(); X.globalAlpha = .16 * d; X.fillStyle = '#3A2A5A'; X.fillRect(0, 0, W, H); X.restore(); });   // evening: the room dims, the lamps glow
    fx(t, A, S);
    return { A, S, P };
  }
  const tableState = t => ({ towers: 1, danny: t < 46 ? 6 : t < 118 ? 9 : 11, safadi: t < 50 ? 6 : t < 118 ? 3 : 1,
    top: t < 36 ? null : t < 53 ? 'blue' : t < 60 ? 'blue' : t < 120.8 ? 'purple' : 'green' });

  // snores, the dropped dice, the high five, the guesses and the dream bubbles (screen space, above everything)
  function fx(t, A, S) {
    const sf = A.safadi, sm = A.sami;
    if (sf && t > SNORE_S) gnZzz(sf.top[0] + 3 * S.safadi, sf.top[1] - 1 * S.safadi, 36 * S.safadi / 6, t, 0, seg(t, SNORE_S, SNORE_S + .6) * (t > DREAM + 1 ? .5 : 1));
    if (sm && t > M_SLEEP[1]) gnZzz(sm.top[0] - 3 * S.sami, sm.top[1] - 1 * S.sami, 30 * S.sami / 6, t, .5, seg(t, M_SLEEP[1], M_SLEEP[1] + .6) * (t > DREAM + 1 ? .5 : 1));
    if (sf && inW(t, DICE_DROP, DICE_DROP + 1)) sfx('plip!', sf.handR[0], sf.handR[1] + 2 * S.safadi, 40, '#FFFDF6', t - DICE_DROP, { life: .9 });
    if (A.housam && A.danny && inW(t, HIGH5, HIGH5 + .7)) { const x = (A.housam.handR[0] + A.danny.handR[0]) / 2, y = Math.min(A.housam.handR[1], A.danny.handR[1]);
      sfx('SLAP!', x, y - 40, 60, '#FFE45C', t - HIGH5, { life: .7 }); }
    // the kids' guesses: little thought bubbles over each guesser
    const icon = { danny: gnJuice, jenna: gnLecture, housam: gnRobot };
    for (const [who, [a, b]] of Object.entries(GUESS)) {
      const R = A[who]; if (!R || !inW(t, a + .6, b + .3)) continue;
      const k = seg(t, a + .6, a + 1.0) * (1 - seg(t, b, b + .3)), s = S[who], bx = R.top[0] - (SIDE[who] > 0 ? 1 : -1) * 2 * s, by = R.top[1] - 24 * s;
      gnThought(bx, by, 110, 85, k, t, () => icon[who](0, 10, 1, t), { tail: [R.top[0], R.top[1] - s] });
      if (inW(t, b, b + .4)) sfx('pop!', bx, by, 44, '#FFFDF6', t - b, { life: .4 });
    }
    // the dream bubbles over the twins
    if (t > DREAM) for (const [name, R, sgn] of [['safadi', sf, 1], ['sami', sm, -1]]) {
      if (!R) continue; const s = S[name], k = ease(seg(t, DREAM + (sgn < 0 ? .4 : 0), DREAM + 2.6 + (sgn < 0 ? .4 : 0)));
      const bx = R.top[0] - sgn * 5 * s + sgn * 6 * s * k * 0, by = R.top[1] - lerp(4, 17, k) * s, rx = 14 * s * k, ry = 10 * s * k;
      gnThought(bx, by, Math.max(rx, 1), Math.max(ry, 1), seg(t, DREAM, DREAM + .4), t, () => gnDream(0, 0, Math.min(rx, ry) * .9, t, k), { tail: [R.top[0], R.top[1] - .5 * s], glow: '#FFF2B8', fill: '#F4EEFF' });
    }
  }

  function bubbles(t, A, S) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const c = { size: 50, maxW: 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) { const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 60 && a.mouth[0] < W - 60);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, clamp(mx, 440, W - 440), my - 40, age, { ...c, size: c.size * 1.15, dx: 0, dy: -210 }); continue; } }
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 70 || a.mouth[0] > W - 70) continue;
      const side = a.mouth[0] < W * .5 ? 1 : -1, low = l.at > GUESS.danny[0] - .1;   // the guesses and the ending: keep speech low, thought bubbles above
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (low ? 320 : 260), dy: low ? -90 : -200 });
    }
  }

  // ---------- cameras (sofa view) ----------
  const cam = (x, y, z, hy, f) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: -1 }; };
  const L_WIDE = cam(0, 175, 960, 560, 640);
  const L_GROUP = cam(0, 140, 820, 560, 1000);
  const L_OLIG = cam(90, 130, 820, 560, 1300);                                  // the professor, Housam and Danny
  const L_DOLPH = cam(-90, 130, 820, 560, 1300);                                // the doctor, Alma and Jenna
  const L_SAFADI = t => { const [dx, dy] = drift(t); return { x: 80 + dx * .5, y: 140, z: 520 - 10 * Math.sin(t * .1), f: 1000, hy: 600 + dy, dir: -1 }; };
  const L_SAMI = t => { const [dx, dy] = drift(t); return { x: -80 + dx * .5, y: 140, z: 520 - 10 * Math.sin(t * .1), f: 1000, hy: 600 + dy, dir: -1 }; };
  const L_TWINS = t => { const [dx, dy] = drift(t); return { x: dx * .5, y: 140, z: lerp(560, 520, seg(t, LEAN[0], 107)), f: 1000, hy: 610 + dy, dir: -1 }; };
  const shot = (camFn, blur) => t => { const { A, S } = stage(t, camFn(t), blur); bubbles(t, A, S); };
  const group = shot(L_GROUP, .8), olig = shot(L_OLIG, 1.4), dolph = shot(L_DOLPH, 1.4), closeSafadi = shot(L_SAFADI, 2), closeSami = shot(L_SAMI, 2), twins = shot(L_TWINS, 2);
  function opening(t) { const u = ease(seg(t, 0, 5.6)), a = L_WIDE(t), b = L_GROUP(t);
    const { A, S } = stage(t, { ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), hy: lerp(a.hy, b.hy, u), f: lerp(a.f, b.f, u) }, .6); bubbles(t, A, S); }

  // ---------- the full-frame inserts ----------
  // a bubble for a line spoken off-frame: its tail points to where the speaker sits
  const OFF = { jenna: [300, 80], alma: [300, 1000], sami: [1840, 600], danny: [1700, 120], safadi: [380, 1040], housam: [1840, 900] };
  function insertBubbles(t) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 6) continue;
      const [ax, ay] = l.group ? [W / 2, 160] : OFF[l.speaker], side = ax < W / 2 ? 1 : -1;
      callout(l.text, ax, ay, age, { size: 54, maxW: 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker], dx: l.group ? 0 : side * 320, dy: ay > H / 2 ? -160 : 160 });
    }
  }
  const bankAt = t => ({ danny: t < 46 ? 8 : t < PAY2 ? 14 : 14, housam: 9, safadi: t < 50 ? 8 : 4 });
  const oligRoll1 = t => { gnOligarchy(t, { roll: ROLL1 + .4, roller: 'safadi', dice: [1, 2], from: 8, hops: [ROLL1 + 1.4, ROLL1 + 1.7, ROLL1 + 2.0], bank: bankAt(t) });
    if (t > ROLL1 + 2.8) sfx('$500!', 1250, 300, 96, '#E03C3C', t - ROLL1 - 2.8, { life: 1.2 }); insertBubbles(t); };
  const oligRoll2 = t => { const b = bankAt(t), paid = seg(t, PAY2, PAY2 + 1.4);
    gnOligarchy(t, { roll: ROLL2 + .4, roller: 'danny', dice: [2, 1], from: 8, hops: [ROLL2 + 1.4, ROLL2 + 1.7, ROLL2 + 2.0], pay: [[PAY2, 3]], bank: { ...b, safadi: 4 - 3 * paid, danny: 14 + 3 * paid } });
    if (t > ROLL2 + 2.2) sfx('$500!', 1250, 300, 96, '#E03C3C', t - ROLL2 - 2.2, { life: 1.0 }); insertBubbles(t); };
  const dolphDemo = t => { gnDolphins(t, { flips: [{ at: DEMO + .3, who: 'jenna', col: 'blue' }, { at: DEMO + .9, who: 'alma', col: 'blue' }], slaps: [{ at: 36.55, who: 'jenna' }, { at: 36.62, who: 'alma' }] }); insertBubbles(t); };
  const dolphSlap1 = t => { gnDolphins(t, { flips: [{ at: SLAP1 + .2, who: 'jenna', col: 'blue' }, { at: SLAP1 + .7, who: 'alma', col: 'blue' }], slaps: [{ at: 53.6, who: 'alma' }, { at: 53.95, who: 'sami' }] }); insertBubbles(t); };
  const dolphSlap2 = t => { gnDolphins(t, { flips: [{ at: SLAP2 + .1, who: 'jenna', col: 'pink' }, { at: SLAP2 + .55, who: 'sami', col: 'purple' }], slaps: [{ at: 60.4, who: 'sami' }] }); insertBubbles(t); };
  const dolphSoft = t => { gnDolphins(t, { flips: [{ at: SLAP3 + .3, who: 'jenna', col: 'green' }, { at: SLAP3 + .9, who: 'alma', col: 'green' }], slaps: [{ at: 121.6, who: 'alma', soft: true, hold: 3 }] }); insertBubbles(t); };

  // ---------- the ending: freeze, card, iris ----------
  const L_END = t => { const [dx, dy] = drift(t), u = ease(seg(t, DREAM, DREAM + 4)); return { x: dx * .5, y: lerp(140, 130, u), z: 820, f: lerp(1000, 1080, u), hy: lerp(560, 700, u) + dy, dir: -1 }; };
  function ending(t) {
    const tt = Math.min(t, FREEZE); const { A, S } = stage(tt, L_END(tt), .8); bubbles(tt, A, S);
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
      // part 1: the rules
      [0, opening], [5.9, olig], [24.6, dolph], [DEMO, dolphDemo], [38.7, closeSami],
      // part 2: the kids are winning
      [ROLL1, oligRoll1], [45.9, olig], [SLAP1, dolphSlap1], [54.5, dolph], [SLAP2, dolphSlap2], [60.9, closeSami], [62.5, dolph], [68.0, olig], [76.9, group],
      // part 3: sweet dreams
      [91.4, closeSafadi], [95.0, group], [100.0, closeSami], [LEAN[0], twins], [107.0, group], [ROLL2, oligRoll2], [SLAP3, dolphSoft], [123.9, closeSami],
      // part 4: what are they dreaming?
      [127.0, group], [DREAM, ending],
    ] });
})();
