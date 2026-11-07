// Scene 66: "The Battle", the third scene of the Pokemon series. In the living room, Jenna battles Alma and Danny battles
// Housam on two playmats, their Pokemon standing over the cards as holograms. With no Energy, Jenna and Danny can only pass
// while Tidal Splash, Flame Burst, Bubble Beam and Inferno Dive (full-frame inserts) knock their Pokemon out. One prize card
// from losing, they play Professor Safadi and win. "Not fair!" "Totally fair!" The brothers walk in: only a Doctor Sami card
// could cancel it. Housam's notebook: the cards are not in the Pokedex. Busted. "Everybody wins this time!" "BUT HOW?!"
// "You shall see!" To be continued. Every shot is a pure function of t.
(() => {
  const LR = LOCATIONS.living_room, LINES = ASSETS.scene.scene66_the_battle.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: '#C08A3E', sami: '#3E9A8C' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, sami };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 7.6, sami: 7.6 };
  const KID = { jenna: 1, danny: 1, housam: 1, alma: 1 };

  // ---------- timing ----------
  const BATTLE = 14.6, INS = [20.6, 38.6, 54.0, 59.6], MONTAGE = 63.6, AFTER = 67.8;
  const PLAY = 85.2, SAFADI_INS = 88.6, WIN = 94.8, ARGUE = 97.5, SHOUT = 120.8;
  const BROS_IN = [124.8, 126.6], NOTE = [153.5, 163.2], NOTE_INS = 156.4, BUSTED = 158.9, POINT = 172.5;
  const ALL_WIN = 177.8, HOW = 180.7, SEE = 183.1, FREEZE = 185.6, END = 190.0;

  // ---------- helpers ----------
  const plainLen = l => l.text.replace(/\*/g, '').length;
  const lineDur = l => plainLen(l) / l.cps + l.hold;
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < plainLen(l); });
  const lineOf = (who, t) => LINES.find(l => l.speaker === who && t > l.at && t < l.at + lineDur(l));
  const curSpeaker = t => LINES.find(l => !l.silentBubble && t > l.at && t < l.at + lineDur(l))?.speaker;
  const inW = (t, a, b) => t > a && t < b;
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];
  const emo = (t, a, b) => ease(seg(t, a, a + .3)) * (1 - ease(seg(t, b - .3, b)));
  PB.setSpeaking(speaking);

  // ---------- blocking (TV view: +X is screen-right; the sofa is behind the camera) ----------
  const MARK = { jenna: [-420, 470], alma: [-190, 470], danny: [-50, 470], housam: [180, 470], safadi: [300, 400], sami: [400, 360] };
  const FROM = { safadi: [490, 280], sami: [490, 230] };                                      // the archway to the hall
  const SIDE = { jenna: -1, alma: -.55, danny: -.2, housam: .2, safadi: .55, sami: .85 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.2, -.85, .85);
  const MAT = { A: [-305, 470], B: [65, 470] };
  const HOLD = { housam: { chest: -15, up: -24, side: 5.2, w: 3.8 }, alma: { chest: -7.5, up: -15, side: 5.2, w: 4.2 },
    jenna: { chest: -12, up: -19, side: 6, w: 4.0 }, danny: { chest: -12.5, up: -20, side: 6, w: 4.6 }, safadi: { w: 4.4 }, sami: { w: 4.4 } };

  // ---------- the battle state ----------
  // Jenna's and Danny's active Pokemon: each knock-out (in an insert) empties the spot until they play the next one
  const J_ACT = [[0, 'sprout'], [24.0, null], [31.0, 'star'], [57.4, null], [AFTER, 'sprout']];
  const D_ACT = [[0, 'dragon'], [42.0, null], [50.0, 'dragon'], [63.0, null], [AFTER, 'dragon']];
  const actAt = (list, t) => { let cur = list[0]; for (const e of list) if (t >= e[0]) cur = e; return cur; };
  const prizes = (kos, t) => (t >= AFTER ? 1 : 6 - kos.filter(a => t >= a).length);
  const ENERGY = { alma: [18.4, 52.4], housam: [35.4, 58.2] }, STADIUM = 35.8;
  function battle(P, t) {
    if (t < BATTLE - .4) { for (const m of ['A', 'B']) PB.mat(P, MAT[m][0], MAT[m][1], { t, left: { prizes: 6 }, right: { prizes: 6 } }); return; }
    const jA = actAt(J_ACT, t), dA = actAt(D_ACT, t);
    const en = n => ENERGY[n].filter(a => t > a).map(() => n === 'alma' ? 'waterE' : 'fireE');
    PB.mat(P, MAT.A[0], MAT.A[1], { t, left: { kind: jA[1] ?? undefined, prizes: 6 }, right: { kind: 'fin', prizes: prizes([24.0, 57.4], t), energy: en('alma') } });
    PB.mat(P, MAT.B[0], MAT.B[1], { t, left: { kind: dA[1] ?? undefined, prizes: 6 }, right: { kind: 'dragon', prizes: prizes([42.0, 63.0], t), energy: en('housam') },
      stadium: ease(seg(t, STADIUM, STADIUM + .8)), stadiumCard: t > STADIUM });
  }
  // the holograms stand over the active cards
  function holos(P, t) {
    if (t < BATTLE || t > BROS_IN[0] + .6) return;
    const on = backOut(seg(t, BATTLE, BATTLE + .5)) * (1 - ease(seg(t, BROS_IN[0], BROS_IN[0] + .6)));
    const lost = t > WIN - .2, won = inW(t, WIN - .2, WIN + 5);
    const jA = actAt(J_ACT, t), dA = actAt(D_ACT, t);
    const mine = (e, x, z) => { if (e[1]) PB.holo(P, x, z, e[1], 1, t, { k: on * (e[0] > 0 ? backOut(seg(t, e[0], e[0] + .4)) : 1), happy: won }); };
    mine(jA, MAT.A[0] - 45, MAT.A[1]); mine(dA, MAT.B[0] - 45, MAT.B[1]);
    // the opponents' Pokemon: a little hop on each energy attach; dizzy and fallen once Professor Safadi has been played
    const hop = n => ENERGY[n].reduce((a, e) => a + kick(t, e, 6), 0);
    PB.holo(P, MAT.A[0] + 45, MAT.A[1], 'fin', -1, t, { k: on * (1 + .15 * hop('alma')), dizzy: lost ? ease(seg(t, WIN - .2, WIN + .4)) : 0 });
    PB.holo(P, MAT.B[0] + 45, MAT.B[1], 'dragon', -1, t, { k: on * (1 + .15 * hop('housam')), dizzy: lost ? ease(seg(t, WIN - .2, WIN + .4)) : 0 });
    if (inW(t, BATTLE, BATTLE + 1.2)) sfx('GO!', W * .5, H * .3, 110, '#FFE066', t - BATTLE, { life: 1.2 });
  }
  const tv = t => { X.fillStyle = '#141A3A'; X.fillRect(0, 0, 250, 140);
    PK.text('POKEMON TCG', 125, 26, 18, '#FFD95A', { font: FONT_SFX, weight: 400 }); PK.text('BATTLE DAY', 125, 50, 14, '#FFFFFF', { weight: 800 });
    for (const [x, c] of [[62, '#FF7FB0'], [188, '#7FD3FF']]) shape(rectPts(x - 40, 66, 80, 56), { fill: c, stroke: '#FFFFFF', lwPx: 1.5, smooth: .2 });
    PK.text('VS', 125, 94, 26 + 3 * Math.sin(t * 6), '#FF6B6B', { font: FONT_SFX, weight: 400 }); };
  const SET = { lamp: .55, tv };

  // ---------- acting ----------
  function base(n, t) {
    const talk = speaking(n, t), ph = { danny: 2.6, jenna: 1.3, alma: 0, housam: 3.9, safadi: .7, sami: 2.1 }[n];
    const o = { giraffe: false, mouth: talk ? lipFlap(t, true, 'smile') : 'smile', brows: 'normal', eyes: 'open', lookY: .08, lookX: .12 * Math.sin(t * .5 + ph),
      handL: KID[n] ? [-3.2, -9.6] : [-4.4, -8.1], handR: KID[n] ? [3.2, -9.6] : [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', turn: -SIDE[n] * .15, card: null, card2: null };
    const sp = curSpeaker(t); if (sp) o.lookX = lookAt(n, sp);
    return { o, talk, say: m => talk ? lipFlap(t, true, m) : m, set: p => Object.assign(o, p) };
  }
  const HD = h => HOLD[h];
  const fan = n => ({ handL: [-HD(n).side * .45, HD(n).chest], handPoseL: 'fist', card2: { hand: 'L', up: false, back: true } });
  const shout = (n, say) => ({ brows: n === 'alma' ? 'angry' : 'focused', mouth: say(n === 'alma' || n === 'jenna' ? 'O' : 'open'), lean: .06,
    handL: [-HD(n).side * .7, HD(n).chest + 3], handR: [HD(n).side * .7, HD(n).chest + 3], handPoseL: 'fist', handPoseR: 'fist', card2: null });
  const cheer = (n, t, t0, say) => ({ handL: [-HD(n).side, HD(n).up], handR: [HD(n).side, HD(n).up], handPoseL: 'fist', handPoseR: 'fist', brows: 'up', mouth: say(n === 'alma' || n === 'jenna' ? 'O' : 'open'),
    eyes: n === 'jenna' || n === 'alma' ? 'star' : 'wide', jump: 1.1 * Math.abs(Math.sin((t - t0) * 7 + n.length)), lookY: -.1, card2: null });
  const how = (n, t, say) => ({ handL: [-HD(n).side, HD(n).chest - 2], handR: [HD(n).side, HD(n).chest - 2], handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', brows: 'up',
    mouth: say(n === 'alma' || n === 'jenna' ? 'O' : 'open'), jump: .7 * kick(t, HOW + .05, 5), lookX: lookAt(n, 'safadi'), lookY: -.1, card: null, card2: null });
  const reach = (n, t, a) => ({ handR: [HD(n).side * .8, HD(n).chest + 8 * Math.sin(clamp(seg(t, a - .5, a + .3)) * Math.PI)], handPoseR: 'open', lean: .1 * Math.sin(clamp(seg(t, a - .5, a + .3)) * Math.PI) });

  function kidPose(n, t) {
    const { o, say, set, talk } = base(n, t), l = lineOf(n, t), me = n === 'jenna' || n === 'danny';
    const facing = { jenna: .45, alma: -.45, danny: .45, housam: -.45 }[n];
    // battle: turned to the opponent, eyes on the mat, a hand of cards
    if (inW(t, BATTLE - .6, BROS_IN[0])) { set({ turn: facing, lookX: facing * .8, lookY: .4, ...fan(n) }); if (curSpeaker(t) && curSpeaker(t) !== n) set({ lookX: lookAt(n, curSpeaker(t)), lookY: .1 }); }
    if (t < BATTLE - .6) set({ turn: facing * .6 });
    if (talk && t < ARGUE) set({ brows: 'up', handR: [HD(n).side, HD(n).chest + 2], handPoseR: 'palm' });
    if (inW(t, 14.1, 16.4)) set(cheer(n, t, 14.1, say));
    if (l?.text === 'LET\'S BATTLE!') set({ lookX: 0 });
    // the attackers
    if (n === 'alma') {
      if (inW(t, 17.6, 18.6)) set(reach('alma', t, 18.4));
      if (inW(t, 18.6, 21.0) || inW(t, 52.1, 54.0)) set({ handR: [6, -19], handPoseR: 'point', brows: 'up', mouth: say('grin'), power: .45, lookY: .3 });
      if (inW(t, 28.8, 31.6)) set({ eyes: talk ? 'open' : 'happy', mouth: say('smirk'), handR: [HD(n).side, HD(n).chest + 2], handPoseR: 'palm' });
      if (inW(t, 51.8, 52.6)) set(reach('alma', t, 52.4));
      if (inW(t, 73.0, 75.8)) set({ handR: [5, -21], handPoseR: 'point', mouth: say('grin'), eyes: talk ? 'open' : 'happy', lookX: lookAt('alma', 'jenna') });
    }
    if (n === 'housam') {
      if (inW(t, 34.9, 35.9)) set(reach('housam', t, 35.6));
      if (inW(t, 36.6, 38.8) || inW(t, 57.9, 60.0)) set({ handR: [6.5, -27], handPoseR: 'point', brows: 'focused', mouth: say('grin'), lookY: .3 });
      if (inW(t, 57.7, 58.4)) set(reach('housam', t, 58.2));
      if (inW(t, 46.7, 49.0)) set({ mouth: say('smirk'), handR: [HD(n).side, HD(n).chest + 2], handPoseR: 'palm' });
      if (inW(t, 76.1, 78.8)) set({ mouth: say('smirk'), brows: 'focused', lookX: lookAt('housam', 'danny') });
    }
    // the losers: they can't attack, so they pass, slump and watch
    if (me) {
      const first = n === 'jenna' ? 'sprout' : 'dragon';
      if (inW(t, n === 'jenna' ? 24.8 : 42.6, n === 'jenna' ? 26.6 : 44.2)) set({ handL: [-3, -17], handR: [3, -17], handPoseL: 'open', handPoseR: 'open', eyes: 'wide', brows: 'worried', mouth: say(n === 'jenna' ? 'O' : 'open'), card2: null });
      if (inW(t, n === 'jenna' ? 26.6 : 44.2, n === 'jenna' ? 28.5 : 46.4)) set({ handR: [HD(n).side * 1.1, HD(n).chest - 3], handPoseR: 'palm', brows: 'worried', tilt: .06 });
      if (inW(t, n === 'jenna' ? 30.4 : 49.4, n === 'jenna' ? 31.2 : 50.2)) set(reach(n, t, n === 'jenna' ? 31.0 : 50.0));
      const passAt = n === 'jenna' ? 32.0 : 49.4;
      if (inW(t, passAt, AFTER + 12)) set({ dy: .35 * ease(seg(t, passAt, passAt + .6)), brows: 'worried', mouth: say('smile'), handR: [3.0, -8.8] });
      if (inW(t, passAt, passAt + 2)) set({ eyes: 'closed', mouth: say('o'), tilt: .08 });
      if (inW(t, 63.6, 79.6)) set({ eyes: inW(t, 68.0, 72.6) ? 'open' : 'open', lookX: inW(t, 68.0, 72.6) ? 0 : o.lookX, lookY: inW(t, 68.0, 72.6) ? 0 : .45, mouth: say('smile'), brows: 'worried' });
      void first;
      // the last card
      if (inW(t, 79.9, PLAY)) set({ dy: 0, brows: 'up', mouth: say('smirk'), eyes: talk ? 'open' : 'happy', handR: [HD(n).side * .3, HD(n).chest + 1], handPoseR: 'fist', card: { hand: 'R', up: false, back: true }, lookX: lookAt(n, n === 'jenna' ? 'danny' : 'jenna') * .6 });
      if (inW(t, PLAY, ARGUE + 3)) set({ dy: 0, handR: [HD(n).side * .8, HD(n).up], handPoseR: 'fist', card: { hand: 'R', up: true, kind: 'safadi' }, brows: 'up', mouth: say(n === 'jenna' ? 'O' : 'open'), eyes: 'wide', jump: .8 * kick(t, PLAY + .05, 5), lookX: 0, lookY: -.05 });
      if (inW(t, WIN, ARGUE)) set(cheer(n, t, WIN, say));
    }
    if (!me && inW(t, PLAY, WIN)) set({ eyes: 'wide', mouth: n === 'alma' ? 'O' : 'open', brows: 'up', lookX: lookAt(n, n === 'alma' ? 'jenna' : 'danny') });
    if (!me && inW(t, WIN, ARGUE)) set({ handL: [-3, -17], handR: [3, -17], handPoseL: 'open', handPoseR: 'open', eyes: 'wide', brows: 'worried', mouth: n === 'alma' ? 'O' : 'open', card2: null });
    // the argument
    if (inW(t, ARGUE, BROS_IN[0] + .4)) {
      set({ card: null, card2: null, dy: 0, handL: [-HD(n).side * .8, HD(n).chest + 4], handR: [HD(n).side * .8, HD(n).chest + 4], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: 'flat' });
      if (talk) set(shout(n, say));
      if (inW(t, SHOUT, 124.6)) set({ ...shout(n, say), jump: .3 * Math.abs(Math.sin((t - SHOUT) * 9 + n.length)) });
    }
    // the brothers are here
    if (t > BROS_IN[0] + .4) {
      set({ turn: facing * .3, lookX: lookAt(n, curSpeaker(t) ?? 'safadi'), lookY: .02 });
      if (talk) set({ brows: 'up', handR: [HD(n).side, HD(n).chest + 2], handPoseR: 'palm' });
      if (inW(t, BROS_IN[0] + .4, 131.6)) set({ eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'o' });
      if (!me && inW(t, 147.2, 153.2)) set({ brows: 'worried', mouth: say('flat'), eyes: inW(t, 150.8, 152.6) ? 'closed' : 'open', tilt: .06, lookY: .3, lookX: 0 });
      if (n === 'alma' && inW(t, 150.8, 152.6)) set({ handR: [1.0, -11], handPoseR: 'fist', mouth: say('o') });
      if (me && inW(t, 143.5, 150.4)) set({ mouth: 'grin', eyes: 'happy' });
    }
    if (n === 'housam' && inW(t, NOTE[0], NOTE[1])) {
      set({ handL: [-2.6, -11.5], handR: [2.6, -11.5], handPoseL: 'fist', handPoseR: 'fist', lookY: .55, lookX: 0, brows: 'focused', note: 1, mouth: say('flat'), card: null, card2: null });
      if (inW(t, 153.6, 156.4)) set({ tilt: .05 * Math.sin(t * 2), eyes: 'narrow' });
      if (t > BUSTED - .2) set({ handL: [-6.5, -18], handR: [7, -18], handPoseR: 'point', note: 2, lookY: 0, lookX: lookAt('housam', 'safadi'), brows: 'up', eyes: 'wide', mouth: say('grin'), jump: .5 * kick(t, BUSTED, 5) });
    }
    if (!me && inW(t, POINT, ALL_WIN)) set({ handR: [7, -18], handPoseR: 'point', handL: [-3.2, -9.6], brows: 'focused', mouth: say('grin'), lookX: lookAt(n, 'safadi'), lean: .05, jump: talk ? .4 * kick(t, POINT + .05, 5) : 0 });
    if (me && inW(t, 175.3, ALL_WIN)) set({ ...shout(n, say), jump: .5 * kick(t, 175.35, 5), lookX: lookAt(n, 'housam') });
    if (inW(t, ALL_WIN, HOW)) set({ eyes: 'wide', brows: 'up', mouth: 'o', lookX: lookAt(n, 'safadi') });
    if (t > HOW) set(how(n, t, say));
    return o;
  }

  function broPose(n, t) {
    const { o, say, set, talk } = base(n, t), other = n === 'safadi' ? 'sami' : 'safadi';
    set({ turn: -.3, lookX: lookAt(n, curSpeaker(t) ?? 'housam'), lookY: .2 });
    if (talk) set({ brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm' });
    if (n === 'safadi' && inW(t, 126.3, 129.2)) set({ handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', eyes: 'wide', mouth: say('open') });
    if (n === 'sami' && inW(t, 129.4, 131.6)) set({ handL: [-5.0, -13.4], handR: [5.0, -13.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'quizzical' });
    if (inW(t, 131.9, 139.2) && !talk) set({ brows: 'quizzical', handR: [.8, -16.1], handPoseR: 'fist' });
    if (n === 'sami') {
      if (inW(t, 139.6, 143.5)) set({ handR: [5.8, -21.4], handPoseR: 'point', brows: 'up', power: .4 * ease(seg(t, 139.8, 140.6)), lookX: -.4 });
      if (inW(t, 143.5, 150.4)) set({ handR: [5.8, -20.5], handPoseR: 'fist', card: { hand: 'R', up: true, kind: 'sami', at: 143.6 }, power: .4, mouth: say('grin'), lookX: -.4 });
      if (inW(t, 147.0, 150.4)) set({ eyes: 'narrow', mouth: say('smirk'), lookX: -.7, brows: 'normal', power: .4 * (1 - seg(t, 147, 148)) });
    }
    if (n === 'safadi' && inW(t, 139.6, 150.4)) set({ handR: [.8, -16.1], handPoseR: 'fist', dy: .2 * Math.abs(Math.sin(t * 3)), eyes: inW(t, 147, 150.4) ? 'narrow' : 'open', mouth: 'smirk', lookX: -.5 });
    // busted
    if (inW(t, BUSTED, POINT)) {
      set({ eyes: 'wide', brows: 'worried', mouth: talk ? say('grin') : 'teeth', emote: 'sweat', emoteK: ease(seg(t, BUSTED + .2, BUSTED + .5)), lookX: lookAt(n, curSpeaker(t) ?? 'housam') });
      if (n === 'safadi' && inW(t, 163.4, 166.6)) set({ handR: [1.0, -17.5], handPoseR: 'fist', eyes: 'closed', tilt: -.06 });                     // ahem
      if (n === 'sami' && inW(t, 166.7, 169.5)) set({ handL: [-5.0, -13.4], handR: [5.0, -13.4], handPoseL: 'palm', handPoseR: 'palm', mouth: say('grin'), tilt: .08 });
      if (n === 'safadi' && inW(t, 169.6, 172.2)) set({ handR: [5.0, -18], handPoseR: 'point', eyes: 'closed', mouth: say('smirk') });
      if (!talk && inW(t, 163.0, 172.4)) set({ lookX: lookAt(n, other) });
    }
    if (inW(t, POINT, ALL_WIN)) set({ handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'open', handPoseR: 'open', eyes: 'wide', brows: 'worried', mouth: 'teeth', lean: -.06, emote: 'sweat', emoteK: 1, lookX: lookAt(n, 'housam') });
    if (inW(t, ALL_WIN, HOW)) set({ handL: [-6.2, -20], handR: [6.2, -20], handPoseL: 'palm', handPoseR: 'palm', eyes: talk ? 'open' : 'happy', brows: 'up', mouth: say('grin'), power: .6 * ease(seg(t, ALL_WIN, ALL_WIN + .6)), lookX: lookAt(n, 'danny'), lean: 0 });
    if (inW(t, HOW, SEE)) set({ eyes: 'happy', mouth: 'smirk', power: .3, lookX: lookAt(n, 'danny') });
    if (t > SEE) set({ handR: [5.8, -21.4], handPoseR: 'point', eyes: inW(t, 184.2, 185.4) ? 'wink' : 'open', brows: 'up', mouth: say('grin'), power: .7, bulb: backOut(seg(t, SEE + .1, SEE + .4)), lookX: 0, lookY: 0, turn: n === 'sami' ? .15 : -.15 });
    return o;
  }
  const POSE = { jenna: t => kidPose('jenna', t), danny: t => kidPose('danny', t), housam: t => kidPose('housam', t), alma: t => kidPose('alma', t), safadi: t => broPose('safadi', t), sami: t => broPose('sami', t) };

  // a card (or a hand of three, face down) in someone's hand; Housam's notebook
  function held(n, A, s, pose, t) {
    for (const c of [pose.card, pose.card2]) { if (!c) continue;
      const w = HOLD[n].w * s * (c.up ? 1.25 : 1);
      let hp = c.hand === 'L' ? A.handL : A.handR; if (c.up) hp = [hp[0] + (c.hand === 'L' ? -1 : 1) * w * .3, hp[1]];
      const k = c.at ? backOut(seg(t, c.at, c.at + .35)) : c.kind === 'safadi' ? backOut(seg(t, PLAY, PLAY + .35)) : 1; if (k <= 0) continue;
      if (c.back && !c.up) for (let i = -1; i <= 1; i++) DK.card(hp[0] + i * w * .14, hp[1] - w * .4, w * .9, i * .22 + (c.hand === 'L' ? -.1 : .1), { back: true, t });
      else DK.card(hp[0], hp[1] - w * (c.up ? .6 : .35), w * k, (c.up ? .1 : .08) * (c.hand === 'L' ? -1 : 1) + .04 * Math.sin(t * 2), c.back ? { back: true, t } : { kind: c.kind, t, holo: .7 });
      if (c.kind === 'safadi' && inW(t, PLAY, PLAY + 3.4)) { const g = X.createRadialGradient(hp[0], hp[1] - w * .6, 4, hp[0], hp[1] - w * .6, w * 1.6); g.addColorStop(0, 'rgba(255,230,140,.55)'); g.addColorStop(1, 'rgba(255,230,140,0)'); X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = g; X.fillRect(hp[0] - w * 2, hp[1] - w * 2.6, w * 4, w * 4); X.restore(); }
    }
    if (pose.note) { const mid = pose.note === 2 ? A.handL : [(A.handL[0] + A.handR[0]) / 2, (A.handL[1] + A.handR[1]) / 2];
      PB.notebook(mid[0], mid[1] - .6 * s, 7.5 * s, pose.note === 2 ? -.2 : 0, t); }
  }

  // ---------- staging ----------
  function spot(n, t) {
    if (n === 'safadi' || n === 'sami') { const u = ease(seg(t, BROS_IN[0] + (n === 'sami' ? .25 : 0), BROS_IN[1] + (n === 'sami' ? .25 : 0))), [x0, z0] = FROM[n], [x1, z1] = MARK[n];
      return { x: lerp(x0, x1, u), z: lerp(z0, z1, u), moving: u > .001 && u < .999, dist: Math.hypot(x1 - x0, z1 - z0) * u }; }
    return { x: MARK[n][0], z: MARK[n][1] };
  }
  function stage(t, camo, blur) {
    const P = persp(camo), A = {}, S = {};
    const who = ['jenna', 'alma', 'danny', 'housam', ...(t > BROS_IN[0] ? ['safadi', 'sami'] : [])];
    const actors = who.map(n => ({ n, ...spot(n, t) })).filter(a => P.depth(a.z) > 40).sort((p, q) => P.depth(q.z) - P.depth(p.z));
    layer(() => { LR.back(P, t, { ...SET, splitZ: actors.length ? actors[0].z : 9999 }); battle(P, t); }, { blur });
    let holoDone = false;
    actors.forEach((a, i) => {
      if (!holoDone && a.z < MAT.A[1] - 1) { holos(P, t); holoDone = true; }       // the holograms stand in front of the kids, behind the brothers
      const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[a.n] * k;
      let pose = POSE[a.n](t);
      if (a.moving) pose = { ...pose, ...(a.n === 'safadi' ? safadiWalk(a.dist / 58, 1) : samiWalk(a.dist / 58, 1)), turn: -.4, card: null, card2: null };
      A[a.n] = RIG[a.n](sx, sy, s, { ...pose, t }); S[a.n] = s;
      held(a.n, A[a.n], s, pose, t);
      LR.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z });
    });
    if (!holoDone) holos(P, t);
    // effects
    if (A.danny && inW(t, 11.6, 12.9)) sfx('RAWR!', A.danny.top[0] + 2 * S.danny, A.danny.top[1] - 10, 80, '#FF6B6B', t - 11.6, { life: 1.3 });
    for (const [a, txt] of [[32.0, 'pass...'], [49.6, 'pass...']]) if (inW(t, a + .8, a + 2.2)) sfx(txt, W * .5, H * .2, 70, '#BFD3EE', t - a - .8, { life: 1.4 });
    if (inW(t, 70.6, 72.6)) sfx('*cricket*', W * .5, H * .16, 54, '#FFFDF6', t - 70.6, { life: 2 });
    if (inW(t, PLAY, PLAY + 1.4)) sfx('✦ ✦ ✦', W * .5, H * .16, 80, '#FFE066', t - PLAY, { life: 1.4 });
    if (inW(t, WIN, WIN + 1.6)) sfx('VICTORY!', W * .5, H * .14, 110, '#FFE066', t - WIN, { life: 1.6 });
    if (inW(t, SHOUT, SHOUT + 1.4)) sfx('GRRR!', W * .2, H * .15, 80, '#FF6B6B', t - SHOUT, { life: 1.4 });
    if (inW(t, BUSTED, BUSTED + 1.5)) sfx('BUSTED!', W * .7, H * .14, 100, '#FF6B6B', t - BUSTED, { life: 1.5 });
    return { A, S, P };
  }

  function bubbles(t, A, S, sides = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const c = { size: 50, maxW: 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) { const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 60 && a.mouth[0] < W - 60);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, clamp(mx, 440, W - 440), Math.max(my - 60, 330), age, { ...c, size: c.size * 1.2, dx: 0, dy: -170 }); continue; } }
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 80 || a.mouth[0] > W - 80) continue;
      const near = d => Object.entries(A).some(([n, o]) => n !== l.speaker && o.mouth[0] > 0 && o.mouth[0] < W && d * (o.mouth[0] - a.mouth[0]) > 0 && Math.abs(o.mouth[0] - a.mouth[0]) < 480);
      const side = sides[l.speaker] ?? (near(1) && !near(-1) ? -1 : near(-1) && !near(1) ? 1 : a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .7 * s, age, { ...c, dx: side * 230, dy: -250 });
    }
  }
  const INS_SIDE = { danny: 1, jenna: -1, alma: -1, housam: 1, safadi: 1, sami: -1 };
  function insBubbles(t) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const side = INS_SIDE[l.speaker];
      callout(l.text, side < 0 ? 230 : W - 230, H + 20, age, { size: 48, maxW: 760, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker], dx: side * -260, dy: -190 });
    }
  }

  // ---------- cameras (TV view) ----------
  const cam = (x, y, z, hy, f) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const WIDE = cam(-60, 160, 40, 520, 760);          // everyone, the coffee table in front
  const FOUR = cam(-80, 150, 140, 480, 820);         // the four kids and both mats
  const BA = cam(-305, 120, 250, 480, 860);          // Jenna vs Alma
  const BB = cam(65, 120, 250, 480, 860);           // Danny vs Housam
  const BROS = cam(240, 140, 150, 480, 820);         // Housam and the brothers
  const HCLOSE = cam(150, 115, 300, 440, 820); const ROOM = cam(0, 165, 5, 470, 700);       // Housam and his notebook
  const shot = (camFn, blur = 1, sides) => t => { const { A, S } = stage(t, camFn(t), blur); bubbles(t, A, S, sides); DK.banner('BATTLE DAY!', t, 0, 3.0); };
  const open = t => { const u = ease(seg(t, .2, 4.4)), q = WIDE(t), f = { x: 10, y: 175, z: 10, f: 640, hy: 560 };
    const { A, S } = stage(t, { ...q, x: lerp(f.x, q.x, u), y: lerp(f.y, q.y, u), z: lerp(f.z, q.z, u), hy: lerp(f.hy, q.hy, u), f: lerp(f.f, q.f, u) }, .4); bubbles(t, A, S); DK.banner('BATTLE DAY!', t, 0, 3.0); };
  const wide = shot(WIDE, .5), room = shot(ROOM, .5), four = shot(FOUR, .7), bA = shot(BA, 1.4, { jenna: 1, alma: -1 }), bB = shot(BB, 1.4, { danny: 1, housam: -1 }), bros = shot(BROS, 1.2), hClose = shot(HCLOSE, 1.8, { housam: -1 });

  // ---------- the inserts ----------
  const ins = (fn, ...a) => t => { fn(t, ...a); insBubbles(t); };
  const attack1 = ins(PB.insAttack, INS[0], { atk: 'fin', def: 'sprout', move: 'TIDAL SPLASH!', fx: 'wave', dmg: 60, ko: true });
  const attack2 = ins(PB.insAttack, INS[1], { atk: 'dragon', def: 'dragon', move: 'FLAME BURST!', fx: 'fireball', dmg: 180, ko: true, stadium: true });
  const attack3 = ins(PB.insAttack, INS[2], { atk: 'fin', def: 'star', move: 'BUBBLE BEAM!', fx: 'bubbles', dmg: 90, ko: true });
  const attack4 = ins(PB.insAttack, INS[3], { atk: 'dragon', def: 'dragon', move: 'INFERNO DIVE!', fx: 'dive', dmg: 180, ko: true, stadium: true });
  const montage = ins(PB.insMontage, MONTAGE, [[64.4, 65.3, 66.1], [64.9, 65.7, 66.5]]);
  const safIns = ins(PB.insSafadi, SAFADI_INS), noteIns = ins(PB.insNotebook, NOTE_INS);

  // ---------- the ending: freeze, TO BE CONTINUED, iris ----------
  function ending(t) {
    const tt = Math.min(t, FREEZE); const { A, S } = stage(tt, BROS(tt), 1.2); bubbles(tt, A, S);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#E0533A'; X.fillText('TO BE CONTINUED...', 0, 8);
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.4, END - .8))));
  }

  scene({ duration: END, fps: 24, bpm: 128,                // id, title, dialogue, music: see asset.js
    shots: [
      // ready to battle
      [0, open], [4.6, bA], [7.7, bB], [14.0, four],
      // the attacks
      [17.2, bA], [INS[0], attack1], [24.8, bA], [34.6, bB], [INS[1], attack2], [42.6, bB],
      [51.8, bA], [INS[2], attack3], [57.7, bB], [INS[3], attack4], [MONTAGE, montage], [AFTER, four],
      // the last card
      [79.6, bA], [83.0, bB], [85.0, four], [SAFADI_INS, safIns], [WIN, four],
      // the argument
      [ARGUE, bB], [100.1, bA], [107.7, bB], [114.0, bA], [119.1, bB], [SHOUT, four],
      // the brothers
      [124.6, room], [131.7, bros], [135.0, bA], [139.4, bros], [150.6, bA],
      // the notebook
      [NOTE[0], hClose], [NOTE_INS, noteIns], [160.4, hClose], [163.2, bros],
      // everybody wins
      [POINT - .2, room], [175.2, four], [ALL_WIN - .2, bros], [HOW - .2, room], [SEE - .2, ending],
    ] });
})();
