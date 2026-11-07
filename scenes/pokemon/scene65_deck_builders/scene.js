// Scene 65: "Deck Builders", the second scene of the Pokemon series. The kids build their decks in two rooms.
// Alma's bedroom: Jenna picks the cutest Pokemon, Danny the fiercest, and every Energy and Trainer card is tossed: "USELESS!"
// Housam's bedroom: Housam and Alma plan type matchups, weaknesses, Stadiums, Tools, Energy and exactly sixty cards.
// Professor Safadi drops in on Jenna and Danny and explains how to build a great deck (a chalkboard insert). They stick to
// their plan, so he gives them one extra card: "Professor Safadi". Doctor Sami offers Housam and Alma a "Doctor Sami" card;
// they laugh and say no. In the living room the brothers meet: "Who do you think will win?" "We shall see!" To be continued.
// Every shot is a pure function of t.
(() => {
  const AB = LOCATIONS.alma_bedroom, HB = LOCATIONS.housam_bedroom, LR = LOCATIONS.living_room;
  const LINES = ASSETS.scene.scene65_deck_builders.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4', safadi: '#C08A3E', sami: '#3E9A8C' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT };
  const RIG = { jenna, danny, housam, alma, safadi, sami };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6, safadi: 7.6, sami: 7.6 };
  const KID = { jenna: 1, danny: 1, housam: 1, alma: 1 };

  // ---------- timing ----------
  const P2 = 45.0, P3 = 83.5, KNOCK_A = 83.6, DOOR_A = [84.0, 84.6], SAF_WALK = [84.3, 86.7], SAF_IN = 88.2;
  const EXPLAIN = 106.1, CHALK = 109.2, BEATS = [109.4, 113.1, 118.4, 122.5, 127.1, 131.7, 136.2], CHALK_END = 139.9;
  const SAF_REACH = 152.0, SAF_CARD = 152.8, SAF_TOSS = 159.6, LAUGH_A = 159.7;
  const P4 = 163.6, DOOR_H = [163.7, 164.3], SAMI_WALK = [164.0, 166.6], SAMI_IN = 167.8, SAMI_CARD = 188.4, LAUGH_H = 193.7;
  const P5 = 202.9, LR_WALK = [203.0, 205.2], LAUGH_L = 217.2, FREEZE = 219.4, END = 224.0;

  // ---------- helpers ----------
  const plainLen = l => l.text.replace(/\*/g, '').length;
  const lineDur = l => plainLen(l) / l.cps + l.hold;
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < plainLen(l); });
  const lineOf = (who, t) => LINES.find(l => l.speaker === who && t > l.at && t < l.at + lineDur(l));
  const curSpeaker = t => LINES.find(l => !l.silentBubble && t > l.at && t < l.at + lineDur(l))?.speaker;
  const inW = (t, a, b) => t > a && t < b;
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];
  const laughing = (t, t0, d = 2.6) => inW(t, t0, t0 + d);
  const room = t => t < P2 ? 'alma' : t < P3 ? 'housam' : t < P4 ? 'alma' : t < P5 ? 'housam' : 'living';

  // ---------- blocking (bed views: +X is screen-right; living room TV view) ----------
  const MARK = {
    alma: { jenna: [-75, 470], danny: [75, 480], safadi: [150, 520] },
    housam: { alma: [40, 455], housam: [150, 465], sami: [-160, 435] },
    living: { sami: [-75, 560], safadi: [75, 560] },
  };
  const SIDE = { alma: { jenna: -.5, danny: .1, safadi: .6 }, housam: { sami: -.5, alma: .05, housam: .5 }, living: { sami: -.3, safadi: .3 } };
  const lookAt = (r, me, who) => { const S = SIDE[r]; return !who || who === me || S[who] == null ? 0 : clamp((S[who] - S[me]) * 1.3, -.85, .85); };
  // where each kid holds a card (local units) and how wide it is (from scene 64)
  const HOLD = { housam: { chest: -15, up: -24, side: 5.2, w: 3.8 }, alma: { chest: -7.5, up: -15, side: 5.2, w: 4.2 },
    jenna: { chest: -12, up: -19, side: 6, w: 4.0 }, danny: { chest: -12.5, up: -20, side: 6, w: 4.6 }, safadi: { w: 4.4 }, sami: { w: 4.4 } };

  // ---------- cards on the floor of Alma's room: the piles, the heap, and the cards in flight ----------
  const JP = [-150, 462], DP = [158, 472], HEAP = [0, 470], REJ = [0, 600];
  const handJ = [-51, 95, 470], handJL = [-99, 95, 470], handD = [95, 84, 480];
  const FLY = [
    { at: 15.3, d: .5, from: handJ, to: JP, kind: 'sprout', h: 30 },
    { at: 19.2, d: .5, from: handD, to: DP, kind: 'dragon', h: 30 },
    { at: 22.3, d: .5, from: handJ, to: JP, kind: 'star', h: 30 },
    { at: 25.8, d: .5, from: handD, to: DP, kind: 'dragon', h: 30 },
    { at: 32.0, d: .8, from: handJ, to: [-14, 598], kind: 'fireE', h: 120 },
    { at: 39.2, d: .8, from: handJ, to: [-34, 612], kind: 'stadium', h: 130 },
    { at: 39.25, d: .8, from: handJL, to: [22, 588], kind: 'tool', h: 140 },
    ...['waterE', 'item', 'supporter', 'fireE', 'waterE', 'item', 'stadium'].map((kind, i) =>
      ({ at: 39.3 + i * .07, d: .75 + .1 * hash(i + 4), from: [HEAP[0] + 40 * (hash(i) - .5), 6, HEAP[1]], to: [REJ[0] + 110 * (hash(i + 9) - .5), REJ[1] + 40 * (hash(i + 2) - .5)], kind, h: 150 + 60 * hash(i + 6) })),
    { at: SAF_TOSS, d: .6, from: [185, 128, 520], to: [JP[0] + 4, JP[1] - 6], kind: 'safadi', h: 60 },
  ];
  function flights(P, t) {
    for (const [i, f] of FLY.entries()) { const u = (t - f.at) / f.d; if (u <= 0 || u >= 1) continue;
      const x = lerp(f.from[0], f.to[0], u), z = lerp(f.from[2], f.to[1], u), y = lerp(f.from[1], 1, u) + f.h * 4 * u * (1 - u);
      if (!P.visible(z)) continue; const [sx, sy, k] = P.p(x, y, z);
      DK.card(sx, sy, 15 * k * 1.15, (hash(i) - .5) * 2 + u * 7 * (hash(i + 3) > .5 ? 1 : -1), { kind: f.kind, t }); }
  }
  function almaFloor(P, t) {
    DK.pile(P, JP[0], JP[1], 6, ['sprout', 'star'], t);
    DK.pile(P, DP[0], DP[1], 6, ['dragon'], t);
    FLY.forEach((f, i) => { if (t < f.at + f.d) return; DK.floor(P, f.to[0], f.to[1], (hash(i + 20) - .5) * 1.4, { kind: f.kind, t }); });
    if (t < 39.3) DK.pile(P, HEAP[0], HEAP[1], 9, ['waterE', 'star', 'supporter', 'dragon', 'item', 'fireE', 'sprout', 'stadium', 'tool'], t);
    else DK.pile(P, HEAP[0] + 10, HEAP[1] - 10, 2, ['star', 'dragon'], t);
  }
  // Housam's room: the binder and the cards from scene 64, and their decks sorted into three neat stacks
  function housamFloor(P, t) {
    PK.binder(P, 95, 405, -.12, t);
    [[205, 400, -.5, 'fin'], [185, 385, .2, null], [-25, 410, .4, 'sprout']].forEach(([x, z, a, kd]) => PK.cardFloor(P, x, z, a, kd ? { kind: kd, t } : { back: true, t }));
    [[-10, 520, ['dragon', 'fin']], [30, 530, ['fireE', 'waterE']], [70, 525, ['stadium', 'tool', 'supporter', 'item']]].forEach(([x, z, k]) => DK.pile(P, x, z, 5, k, t));
  }
  // the board on Housam's wall: the deck plan
  function board(t) {
    X.translate(200, 0); X.scale(-1, 1);
    PK.text('DECK PLAN', 100, 14, 15, '#C8403A', { font: FONT_SFX, weight: 400 });
    [['Pokemon', '16'], ['Energy', '12'], ['Trainers', '32']].forEach(([s, n], i) => { PK.text(s, 30, 34 + i * 16, 12, '#2F5DB0', { align: 'left', weight: 700 }); PK.text(n, 150, 34 + i * 16, 12, '#2B2233', { weight: 800 }); });
    line([[25, 82], [170, 82]], { stroke: '#2B2233', lwPx: 1.5 }); PK.text('= 60', 150, 94, 13, '#2F8A48', { weight: 800 });
    PK.text('Fire → Water ×2!', 70, 96, 10, '#E0533A', { weight: 700 });
  }
  const SET = { alma: { lamp: .55 }, housam: { lamp: .6, laptop: true, board }, living: { lamp: .55 } };
  const LOC = { alma: AB, housam: HB, living: LR };

  // ---------- acting ----------
  function base(n, r, t) {
    const talk = speaking(n, t), ph = { danny: 2.6, jenna: 1.3, alma: 0, housam: 3.9, safadi: .7, sami: 2.1 }[n];
    const o = { giraffe: false, mouth: talk ? lipFlap(t, true, 'smile') : 'smile', brows: 'normal', eyes: 'open', lookY: .08, lookX: .12 * Math.sin(t * .5 + ph),
      handL: KID[n] ? [-3.2, -9.6] : [-4.4, -8.1], handR: KID[n] ? [3.2, -9.6] : [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', turn: -(SIDE[r][n] ?? 0) * .2, card: null, card2: null };
    const sp = curSpeaker(t); if (sp) o.lookX = lookAt(r, n, sp);
    return { o, talk, say: m => talk ? lipFlap(t, true, m) : m, set: p => Object.assign(o, p), ph };
  }
  const laughPose = (n, t, t0) => { const k = Math.abs(Math.sin((t - t0) * 13 + n.length)), H0 = HOLD[n];
    return { eyes: 'squeeze', mouth: k > .5 ? 'grin' : (n === 'alma' || n === 'jenna' ? 'O' : 'open'), brows: 'up', dy: .4 * k, tilt: -.06, lookY: -.05,
      handL: KID[n] ? [-2.6, (H0.chest ?? -10) + 2] : [-2.2, -9.5], handR: KID[n] ? [2.6, (H0.chest ?? -10) + 2] : [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist' }; };
  const up = (n, kind, hand = 'R') => { const H0 = HOLD[n]; return hand === 'R' ? { handR: [H0.side * .8, H0.up], handPoseR: 'fist', card: { hand: 'R', up: true, kind } } : { handL: [-H0.side * .8, H0.up], handPoseL: 'fist', card2: { hand: 'L', up: true, kind } }; };
  const hug = (n, kind) => { const H0 = HOLD[n]; return { handL: [-1.4, H0.chest], handR: [1.4, H0.chest], handPoseL: 'fist', handPoseR: 'fist', card: { hand: 'mid', up: false, kind } }; };

  function jennaPose(t) {
    const { o, say, set, talk } = base('jenna', 'alma', t), H0 = HOLD.jenna;
    if (t < P2) {
      if (!talk && !curSpeaker(t)) set({ lookY: .45, lookX: .2 });
      if (inW(t, 2.2, 5.4)) set({ handR: [H0.side, H0.chest - 3], handPoseR: 'palm', brows: 'up', mouth: say('grin') });
      if (inW(t, 9.0, 12.2)) set({ handL: [-1.3, -15], handR: [1.3, -15], handPoseL: 'fist', handPoseR: 'fist', eyes: talk ? 'open' : 'happy', mouth: say('grin'), tilt: -.06 });
      if (inW(t, 12.6, 15.3)) set({ ...up('jenna', 'sprout'), eyes: talk ? 'open' : 'star', mouth: say('grin'), brows: 'up', lookX: .35, lookY: -.05, jump: .3 * kick(t, 12.7, 5) });
      if (inW(t, 16.2, 19.4)) set({ brows: 'worried', mouth: 'o', tilt: .07, lookX: .6 });
      if (inW(t, 19.9, 22.3)) set({ ...up('jenna', 'star'), eyes: talk ? 'open' : 'star', mouth: say('grin'), brows: 'up', lookX: .35, lookY: -.05 });
      if (inW(t, 27.1, 32.0)) set({ ...up('jenna', 'fireE'), brows: 'worried', mouth: say('o'), tilt: .06, lookX: .3, lookY: -.1 });
      if (inW(t, 30.2, 32.0)) set({ lookX: .6, brows: 'up' });
      if (inW(t, 32.0, 32.6)) set({ handR: [H0.side * .4, H0.up - 2], handPoseR: 'open', mouth: 'smirk', eyes: 'closed' });   // tossed over the shoulder
      if (inW(t, 33.5, 39.2)) set({ ...up('jenna', 'stadium'), ...up('jenna', 'tool', 'L'), brows: 'worried', mouth: say('smile'), lookX: .4 });
      if (inW(t, 37.0, 39.2)) set({ lookX: .6, brows: 'up' });
      if (inW(t, 39.2, 40.8)) set({ handL: [-H0.side * .5, H0.up - 3], handR: [H0.side * .5, H0.up - 3], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', mouth: 'grin', jump: .6 * kick(t, 39.25, 5) });
      return o;
    }
    // part 3
    if (inW(t, 88.3, 91.0)) set({ ...up('jenna', 'sprout'), brows: 'up', mouth: say('grin'), lookX: .7, lookY: -.25 });
    if (inW(t, 94.4, 97.4)) set({ ...hug('jenna', 'star'), eyes: talk ? 'open' : 'happy', mouth: say('grin'), tilt: -.05 });
    if (inW(t, 97.7, 140)) set({ lookY: -.2 });
    if (inW(t, 106.1, 108.4)) set({ eyes: 'wide', mouth: 'o', brows: 'up' });
    if (inW(t, 140.3, 143.4)) set({ ...hug('jenna', 'star'), brows: 'worried', mouth: say('smirk'), lookX: .7, lookY: -.25 });
    if (inW(t, 146.6, 150.3)) set({ ...hug('jenna', 'star'), eyes: 'closed', brows: 'focused', mouth: say('smirk'), lookY: -.25, turn: -.35, tilt: .06 });
    if (inW(t, 150.3, 152.8)) set({ eyes: 'open', lookX: .7, lookY: -.25 });
    if (inW(t, SAF_CARD, SAF_TOSS)) set({ eyes: 'wide', mouth: 'o', brows: 'up', lookX: .7, lookY: -.3 });
    if (laughing(t, LAUGH_A, 3.5)) set(laughPose('jenna', t, LAUGH_A));
    return o;
  }
  function dannyPose(t) {
    const { o, say, set, talk } = base('danny', 'alma', t), H0 = HOLD.danny;
    if (t < P2) {
      if (!talk && !curSpeaker(t)) set({ lookY: .45, lookX: -.1 });
      if (inW(t, 5.8, 8.6)) set({ handL: [-H0.side * .6, H0.chest - 2], handR: [H0.side * .6, H0.chest - 2], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: say('grin'), jump: .4 * kick(t, 5.9, 6) });
      if (inW(t, 16.2, 19.2)) set({ ...up('danny', 'dragon'), brows: 'focused', mouth: say('grin'), lookX: -.2, lookY: -.05 });
      if (inW(t, 17.5, 19.2)) set({ handL: [-6, -21], handPoseL: 'open', mouth: say('open'), eyes: 'wide', jump: .9 * kick(t, 17.6, 6), sq: .08 * kick(t, 17.6, 8) });     // RAWR! claws up
      if (inW(t, 23.2, 25.8)) set({ ...up('danny', 'dragon'), brows: 'focused', mouth: say('grin'), lookX: -.2, lookY: -.05 });
      if (inW(t, 27.1, 30.2)) set({ lookX: -.6, brows: 'up' });
      if (inW(t, 30.2, 32.8)) set({ handR: [H0.side * 1.1, H0.chest - 4], handPoseR: 'palm', eyes: talk ? 'open' : 'closed', mouth: say('smirk'), brows: 'normal', tilt: .07 });
      if (inW(t, 33.5, 37.0)) set({ lookX: -.6, brows: 'worried' });
      if (inW(t, 37.0, 39.15)) set({ handL: [-6, -21], handR: [6, -21], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: say('open'), eyes: 'wide', lookX: -.2 });
      if (inW(t, 39.15, 40.8)) { const u = ease(seg(t, 39.15, 39.5)); set({ handR: [lerp(7, -3, u), lerp(-8, -17, u)], handL: [-6, -14], handPoseR: 'open', handPoseL: 'open', brows: 'focused', mouth: 'grin', eyes: 'happy', lean: -.08 * u, jump: .5 * kick(t, 39.2, 5) }); }   // the big sweep
      return o;
    }
    if (inW(t, 91.3, 94.2)) set({ ...up('danny', 'dragon'), brows: 'focused', mouth: say('grin'), lookX: .55, lookY: -.25 });
    if (inW(t, 97.7, 140)) set({ lookY: -.2 });
    if (inW(t, 102.0, 105.7)) set({ handL: [-H0.side, H0.chest - 3], handR: [H0.side, H0.chest - 3], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: say('smile'), lookX: .6, lookY: -.25 });
    if (inW(t, 106.1, 108.4)) set({ eyes: 'wide', mouth: 'open', brows: 'up' });
    if (inW(t, 143.6, 146.3)) set({ handL: [-6, -21], handR: [6, -21], handPoseL: 'open', handPoseR: 'open', brows: 'focused', mouth: say('grin'), lookX: .6, lookY: -.25 });
    if (inW(t, 146.6, 150.3)) set({ ...hug('danny', 'dragon'), eyes: 'closed', brows: 'focused', mouth: say('smirk'), lookY: -.25, turn: .35, tilt: -.06 });
    if (inW(t, SAF_CARD, SAF_TOSS)) set({ eyes: 'wide', mouth: 'o', brows: 'up', lookX: .6, lookY: -.3 });
    if (laughing(t, LAUGH_A, 3.5)) set(laughPose('danny', t, LAUGH_A));
    return o;
  }
  // the card each line of the experts is about
  const EXPERT_CARD = [[/Blazewyrm/, 'dragon'], [/weak to Water/, 'fin'], [/Stadium/, 'stadium'], [/Tool/, 'tool'], [/Supporters/, 'supporter'], [/Water Energy/, 'waterE'], [/Four copies/, 'dragon'], [/sixty cards/, 'fin'], [/behold/, 'dragon']];
  function expertPose(n, t) {
    const { o, say, set, talk } = base(n, 'housam', t), H0 = HOLD[n], other = n === 'housam' ? 'alma' : 'housam';
    set({ handL: [-H0.side * .45, H0.chest], handPoseL: 'fist', card2: { hand: 'L', up: false, kind: n === 'housam' ? 'dragon' : 'fin' } });
    const l = lineOf(n, t);
    if (l && !/Ha ha/.test(l.text)) {
      set({ brows: 'up', mouth: say('smile'), handR: [H0.side, H0.chest + 3], handPoseR: 'palm' });
      const c = EXPERT_CARD.find(([re]) => re.test(l.text)); if (c) { let kind = c[1]; if (/Supporters/.test(l.text) && t > l.at + 2.3) kind = 'item';
        set({ ...up(n, kind), card2: null, handL: [-3.2, -9.6], handPoseL: 'open' }); }
    }
    if (t < P3) {
      if (n === 'housam' && inW(t, 50.9, 55.3)) set({ brows: 'worried', mouth: t > 53.2 ? 'o' : 'flat', lookX: lookAt('housam', n, other) });
      if (n === 'alma' && inW(t, 55.6, 59.9)) set({ brows: 'up', mouth: 'o', eyes: 'wide' });
      if (n === 'housam' && inW(t, 60.3, 64.4)) set({ brows: 'focused', mouth: 'smirk', tilt: .05 });
      if (n === 'alma' && inW(t, 64.8, 69.2)) set({ eyes: 'happy', mouth: 'smile' });
      if (inW(t, 78.3, 83.5)) set({ ...up(n, n === 'housam' ? 'dragon' : 'fin'), card2: null, handL: [-H0.side, H0.up], handPoseL: 'fist', eyes: talk ? 'wide' : 'happy', mouth: say('grin'), jump: .6 * Math.abs(Math.sin((t - 78.3) * 6 + (n === 'alma' ? 1 : 0))) * (1 - seg(t, 81.5, 83)) });
      if (n === 'alma' && inW(t, 50.9, 55.3)) set({ power: .35 });
      return o;
    }
    // part 4: Doctor Sami
    if (inW(t, SAMI_IN, 189.7) && !l) set({ lookX: lookAt('housam', n, curSpeaker(t) ?? 'sami') });
    if (n === 'alma' && inW(t, 171.9, 176.5)) set({ power: .5 * ease(seg(t, 174.2, 175)), eyes: t > 175 ? 'star' : 'open' });
    if (inW(t, 180.9, 184.8)) set({ eyes: 'happy', mouth: 'grin', brows: 'up' });
    if (inW(t, SAMI_CARD, LAUGH_H)) set({ eyes: 'wide', mouth: 'o', brows: 'up', lookX: lookAt('housam', n, 'sami') });
    if (laughing(t, LAUGH_H, 2.9)) set(laughPose(n, t, LAUGH_H));
    if (n === 'housam' && inW(t, 195.0, 197.0)) set({ handR: [H0.side * 1.1, H0.chest - 4], handPoseR: 'palm' });                                   // "No thanks"
    if (n === 'alma' && inW(t, 197.0, 200.2)) set({ handR: [H0.side * 1.1, H0.chest - 4], handPoseR: 'palm', eyes: 'closed', mouth: say('smirk'), brows: 'normal', tilt: -.05 });
    if (inW(t, 200.4, P5)) set({ eyes: 'happy', mouth: 'grin', lookX: lookAt('housam', n, 'sami') });
    return o;
  }
  function safadiPose(t) {
    const r = room(t), { o, say, set, talk } = base('safadi', r, t);
    if (r === 'alma') {
      set({ lookY: .35 });
      if (inW(t, 84.8, 87.6)) set({ handR: [5.4, -22 + Math.sin(t * 11)], handPoseR: 'open', brows: 'up', mouth: say('grin') });                       // a wave
      if (talk) set({ brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm' });
      if (inW(t, 97.7, 101.8)) set({ handR: [.8, -16.1], handPoseR: 'fist', brows: 'quizzical', lookY: .6, lookX: -.3, emote: '?', emoteK: ease(seg(t, 98.0, 98.3)) * (1 - ease(seg(t, 101.2, 101.6))) });
      if (inW(t, 102.0, 106.0)) set({ brows: 'up', mouth: 'o', lookX: lookAt('alma', 'safadi', 'danny'), lookY: .35 });
      if (inW(t, EXPLAIN, CHALK)) { const p = ease(seg(t, 106.4, 107.6)); set({ handR: [5.8, -21.4], handPoseR: 'point', handL: [-5.3, -12.4], handPoseL: 'palm', brows: 'up', mouth: say('grin'), power: p, eyes: p > .5 ? 'glow' : 'open', bulb: backOut(seg(t, 106.6, 106.9)), lookY: .1 }); }
      if (inW(t, CHALK_END, 146.5)) set({ power: .4 * (1 - ease(seg(t, CHALK_END, CHALK_END + 1))), lookY: .4 });
      if (inW(t, 146.6, 149.4)) set({ brows: 'worried', mouth: 'o', eyes: 'wide', lookY: .4 });
      if (inW(t, 149.4, 150.5)) set({ eyes: 'closed', mouth: 'flat', dy: .3 * Math.sin(seg(t, 149.4, 150.5) * Math.PI), brows: 'worried', lookY: .3 });   // a sigh
      if (inW(t, 150.5, SAF_REACH)) set({ handR: [5.3, -12.6], handPoseR: 'palm', mouth: say('smile'), lookY: .35 });
      if (inW(t, SAF_REACH, SAF_CARD)) set({ handR: [1.2, -13.5], handPoseR: 'fist', mouth: say('smirk'), brows: 'up', lookY: .3 });              // into the jacket
      if (inW(t, SAF_CARD, SAF_TOSS)) set({ handR: [5.8, -20.5], handPoseR: 'fist', card: { hand: 'R', up: true, kind: 'safadi' }, brows: 'up', mouth: say('grin'), lookY: .3,
        eyes: inW(t, 157.4, 158.6) ? 'wink' : 'open', handL: [-5.3, -12.4], handPoseL: 'palm' });
      if (inW(t, SAF_TOSS, LAUGH_A)) set({ handR: [5.6, -15], handPoseR: 'open' });
      if (laughing(t, LAUGH_A, 3.5)) set(laughPose('safadi', t, LAUGH_A));
      return o;
    }
    // the living room
    set({ turn: -.3, lookX: -.45, lookY: .05 });
    if (talk) set({ brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm' });
    if (inW(t, 205.1, 209.6)) set({ eyes: 'open', brows: 'up' });
    if (inW(t, 209.9, 211.5)) set({ handR: [.8, -16.1], handPoseR: 'fist', dy: .25 * Math.abs(Math.sin((t - 209.9) * 6)), mouth: say('smile') });           // a nod
    if (inW(t, 211.7, 214.6)) set({ handR: [.8, -16.1], handPoseR: 'fist', brows: 'quizzical', lookX: -.5 });
    if (inW(t, 214.8, LAUGH_L)) set({ handR: [5.8, -21.4], handPoseR: 'point', brows: 'up', mouth: say('grin'), eyes: inW(t, 216.0, 216.9) ? 'wink' : 'open', power: .5 * ease(seg(t, 214.9, 215.6)), bulb: backOut(seg(t, 215.0, 215.3)) });
    if (t > LAUGH_L) set({ ...laughPose('safadi', t, LAUGH_L), power: .5 * (1 - ease(seg(t, LAUGH_L, LAUGH_L + .8))) });
    return o;
  }
  function samiPose(t) {
    const r = room(t), { o, say, set, talk } = base('sami', r, t);
    if (r === 'housam') {
      set({ lookY: .3 });
      if (inW(t, 163.9, 167.4)) set({ handR: [5.4, -22 + Math.sin(t * 11)], handPoseR: 'open', brows: 'up', mouth: say('grin') });
      if (talk) set({ brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm' });
      if (inW(t, 171.9, 180.6)) set({ brows: 'up', mouth: t > 176.9 ? 'o' : 'smile', eyes: t > 176.9 ? 'wide' : 'open' });
      if (inW(t, 180.9, 184.8)) set({ handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'open', handPoseR: 'open', eyes: 'wide', brows: 'up', mouth: say('O'), jump: .6 * kick(t, 181.0, 5), emote: '!', emoteK: ease(seg(t, 181.0, 181.3)) * (1 - ease(seg(t, 184.0, 184.5))), power: .4 * (1 - seg(t, 183.5, 184.8)) });
      if (inW(t, 185.2, SAMI_CARD)) set({ handR: [2.0, -12.0], handPoseR: 'fist', mouth: say('smirk'), brows: 'up', eyes: 'happy' });          // into the coat pocket
      if (inW(t, SAMI_CARD, 197.0)) set({ handR: [5.8, -20.5], handPoseR: 'fist', card: { hand: 'R', up: true, kind: 'sami' }, brows: 'up', mouth: say('grin'), handL: [-5.3, -12.4], handPoseL: 'palm' });
      if (inW(t, LAUGH_H, 200.4)) set({ brows: 'worried', mouth: 'o' });
      if (inW(t, 197.0, P5)) set({ handR: [3.2, -12.0], handPoseR: 'fist', card: { hand: 'R', up: false, kind: 'sami' }, brows: 'worried', mouth: 'flat' });
      if (inW(t, 200.4, P5)) set({ handL: [-5.0, -13.4], handPoseL: 'palm', eyes: 'closed', mouth: say('smirk'), tilt: .1, emote: 'sweat', emoteK: ease(seg(t, 200.5, 200.8)) });
      return o;
    }
    set({ turn: .3, lookX: .45, lookY: .05 });
    if (talk) set({ brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm' });
    if (inW(t, 205.1, 209.5)) { const r2 = Math.sin(t * 14); set({ handL: [-1.4 + .5 * r2, -17.5], handR: [1.4 - .5 * r2, -17.6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', brows: 'up', mouth: say('smirk') }); }   // rubbing his hands
    if (inW(t, 211.7, 214.4)) set({ handL: [-5.0, -13.4], handR: [5.0, -13.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', tilt: .08 });
    if (inW(t, 214.8, LAUGH_L)) set({ eyes: 'wide', mouth: 'o', brows: 'up', lean: .05 });
    if (t > LAUGH_L) set(laughPose('sami', t, LAUGH_L));
    return o;
  }
  const POSE = { jenna: jennaPose, danny: dannyPose, housam: t => expertPose('housam', t), alma: t => expertPose('alma', t), safadi: safadiPose, sami: samiPose };

  // a card in someone's hand (screen space): held flat at the chest, or held up to show
  function heldCard(n, A, s, c, t, flip = 1) {
    if (!c) return;
    const w = HOLD[n].w * s * (c.up ? 1.25 : 1);
    let hp = c.hand === 'mid' ? [(A.handL[0] + A.handR[0]) / 2, (A.handL[1] + A.handR[1]) / 2] : c.hand === 'L' ? A.handL : A.handR;
    if (c.up) hp = [hp[0] + (c.hand === 'L' ? -1 : 1) * w * .3, hp[1]];
    const shiny = c.kind === 'dragon' || c.kind === 'fin' || c.kind === 'safadi' || c.kind === 'sami';
    let k = 1; if (c.kind === 'safadi') k = backOut(seg(t, SAF_CARD, SAF_CARD + .35)); if (c.kind === 'sami' && c.up) k = backOut(seg(t, SAMI_CARD, SAMI_CARD + .35));
    if (k <= 0) return;
    DK.card(hp[0], hp[1] - w * (c.up ? .6 : .35), w * k, (c.up ? (c.hand === 'L' ? -.1 : .1) + .04 * Math.sin(t * 2) : (c.hand === 'L' ? -.08 : .08)) * flip, { kind: c.kind, t, holo: shiny ? .7 : 0 });
  }

  // ---------- staging ----------
  function present(r, t) {
    if (r === 'alma') return ['jenna', 'danny', ...(t > SAF_IN - .01 ? ['safadi'] : [])];
    if (r === 'housam') return ['alma', 'housam', ...(t > SAMI_IN - .01 ? ['sami'] : [])];
    return ['sami', 'safadi'];
  }
  // in the living room the brothers walk in from either side
  function livingSpot(n, t) {
    const [x1, z1] = MARK.living[n], x0 = n === 'sami' ? -360 : 360, u = ease(seg(t, LR_WALK[0], LR_WALK[1]));
    return { x: lerp(x0, x1, u), z: z1 + (n === 'sami' ? 30 : 0) * (1 - u), moving: u > .001 && u < .999, dist: Math.abs(lerp(x0, x1, u) - x0) };
  }
  function stage(t, camo, blur, o = {}) {
    const r = room(t), L = LOC[r], set = SET[r], P = persp(camo), A = {}, S = {};
    const actors = present(r, t).map(n => { if (r === 'living') { const sp = livingSpot(n, t); return { n, ...sp }; } return { n, x: MARK[r][n][0], z: MARK[r][n][1] }; })
      .filter(a => P.depth(a.z) > 40).sort((p, q) => P.depth(q.z) - P.depth(p.z));
    layer(() => { L.back(P, t, { ...set, splitZ: actors.length ? actors[0].z : 9999 }); if (r === 'alma') almaFloor(P, t); if (r === 'housam') housamFloor(P, t); }, { blur });
    actors.forEach((a, i) => {
      const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[a.n] * k;
      let pose = POSE[a.n](t);
      if (a.moving) pose = { ...pose, ...(a.n === 'safadi' ? safadiWalk(a.dist / 58, 1) : samiWalk(a.dist / 58, 1)), turn: a.n === 'sami' ? .45 : -.45, card: null, card2: null };
      A[a.n] = RIG[a.n](sx, sy, s, { ...pose, t }); S[a.n] = s;
      heldCard(a.n, A[a.n], s, pose.card, t); heldCard(a.n, A[a.n], s, pose.card2, t);
      L.front(P, t, { ...set, splitZ: a.z, toZ: actors[i + 1]?.z });
    });
    if (r === 'alma') flights(P, t);
    // effects
    if (A.danny && inW(t, 17.6, 19.0)) sfx('RAWR!', A.danny.top[0] + 2 * S.danny, A.danny.top[1] - 10, 96, '#FF6B6B', t - 17.6, { life: 1.4 });
    if (inW(t, 39.2, 40.6)) sfx('WHOOSH!', W * .5, H * .16, 96, '#FFFDF6', t - 39.2, { life: 1.4 });
    if (A.jenna && inW(t, 12.8, 14.0)) sfx('♥', A.jenna.top[0] - 2 * S.jenna, A.jenna.top[1], 70, '#FF7FB0', t - 12.8, { life: 1.2 });
    if (A.jenna && inW(t, 20.1, 21.3)) sfx('♥', A.jenna.top[0] - 2 * S.jenna, A.jenna.top[1], 70, '#FF7FB0', t - 20.1, { life: 1.2 });
    if (A.safadi && inW(t, SAF_CARD, SAF_CARD + .8)) sfx('✦', A.safadi.handR[0], A.safadi.handR[1] - 90, 70, '#FFE066', t - SAF_CARD, { life: .8 });
    if (A.sami && inW(t, SAMI_CARD, SAMI_CARD + .8)) sfx('✦', A.sami.handR[0], A.sami.handR[1] - 90, 70, '#FFE066', t - SAMI_CARD, { life: .8 });
    if (inW(t, 146.6, 147.9)) sfx('HMPH!', W * .32, H * .16, 80, '#FFFDF6', t - 146.6, { life: 1.3 });
    return { A, S, P };
  }

  function bubbles(t, A, S, sides = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const c = { size: 50, maxW: 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) { const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 60 && a.mouth[0] < W - 60);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, clamp(mx, 440, W - 440), my - 60, age, { ...c, size: c.size * 1.2, dx: 0, dy: -170 }); continue; } }
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 80 || a.mouth[0] > W - 80) continue;
      const near = d => Object.entries(A).some(([n, o]) => n !== l.speaker && o.mouth[0] > 0 && o.mouth[0] < W && d * (o.mouth[0] - a.mouth[0]) > 0 && Math.abs(o.mouth[0] - a.mouth[0]) < 480);
      const side = sides[l.speaker] ?? (near(1) && !near(-1) ? -1 : near(-1) && !near(1) ? 1 : a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .7 * s, age, { ...c, dx: side * 230, dy: -250 });
    }
  }
  // in a full-frame insert the speaker is off screen: the tail points down to their corner
  const INS_SIDE = { danny: 1, jenna: -1, alma: -1, housam: 1, safadi: 1, sami: -1 };
  function insBubbles(t) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const side = INS_SIDE[l.speaker];
      callout(l.text, side < 0 ? 230 : W - 230, H + 20, age, { size: 48, maxW: 760, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker], dx: side * -260, dy: -190 });
    }
  }

  // ---------- cameras ----------
  const cam = (x, y, z, hy, f, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  // Alma's room (bed view)
  const A_TWO = cam(0, 105, 280, 500, 830), A_JEN = cam(-60, 100, 290, 520, 820), A_DAN = cam(70, 95, 300, 520, 820);
  const A_THREE = cam(40, 118, 230, 520, 820), A_SAF = cam(150, 135, 340, 470, 820);
  // Housam's room (bed view)
  const H_TWO = cam(95, 125, 255, 590, 880), H_HOU = cam(140, 115, 270, 520, 820), H_ALM = cam(45, 105, 265, 520, 820);
  const H_THREE = cam(30, 118, 225, 520, 820), H_SAMI = cam(-130, 140, 240, 430, 820);
  // the living room (TV view)
  const L_TWO = cam(0, 120, 330, 480, 950);

  const shot = (camFn, blur = 1, sides) => t => { const { A, S } = stage(t, camFn(t), blur); bubbles(t, A, S, sides); captions(t); };
  const push = (from, to, a, b, blur = .5) => t => { const u = ease(seg(t, a, b)), q = to(t); const { A, S } = stage(t, { ...q, x: lerp(from.x, q.x, u), y: lerp(from.y, q.y, u), z: lerp(from.z, q.z, u), hy: lerp(from.hy, q.hy, u), f: lerp(from.f, q.f, u) }, blur); bubbles(t, A, S); captions(t); };
  function captions(t) { DK.banner("ALMA'S ROOM", t, 0); DK.banner('MEANWHILE...', t, P2, 1.6); DK.banner("HOUSAM'S ROOM", t, P2 + 1.6, 2.2); DK.banner("BACK IN ALMA'S ROOM", t, P3); DK.banner("BACK IN HOUSAM'S ROOM", t, P4); DK.banner('THE LIVING ROOM', t, P5); }

  const aOpen = push({ x: 0, y: 165, z: 40, f: 640, hy: 560 }, A_TWO, .2, 5.0), aTwo = shot(A_TWO, .8), aJen = shot(A_JEN, 1.6, { jenna: 1 }), aDan = shot(A_DAN, 1.6, { danny: -1 });
  const aThree = shot(A_THREE, .8, { safadi: -1 }), aSaf = shot(A_SAF, 1.6, { safadi: -1 });
  const hOpen = push({ x: 0, y: 165, z: 30, f: 620, hy: 560 }, H_TWO, P2 + .2, P2 + 5.0), hTwo = shot(H_TWO, 1, { alma: -1 }), hHou = shot(H_HOU, 1.6, { housam: -1 }), hAlm = shot(H_ALM, 1.6, { alma: -1 });
  const hThree = shot(H_THREE, .8, { sami: 1 }), hSami = shot(H_SAMI, 1.6, { sami: 1 });
  const lrTwo = shot(L_TWO, .8);

  // ---------- the doors (door view): the door swings open and the professor (or the doctor) walks in ----------
  const C_DOOR = t => { const [dx, dy] = drift(t); return { x: 150 + dx, y: 122, z: 430, f: 860, hy: 600 + dy, dir: -1 }; };
  const doorShot = (r, who, door, walk, knock) => t => {
    const L = LOC[r], set = SET[r], P = persp(C_DOOR(t)), A = {}, S = {};
    const u = ease(seg(t, walk[0], walk[1])), x = lerp(222, 172, u), z = lerp(8, 235, u), moving = u > .001 && u < .999, shown = t > walk[0] - .05;
    layer(() => {
      L.back(P, t, { ...set, splitZ: 0 });
      const a = 1.65 * ease(seg(t, door[0], door[1]));
      P.plane(.5, () => { shape(rectPts(170, -205, 100, 205), { fill: '#F4E2BE', stroke: null }); shape(rectPts(170, -40, 100, 40), { fill: '#C7A27A', stroke: null });
        shape(rectPts(196, -170, 48, 70), { fill: '#FFF6DE', stroke: '#C9B48E', lwPx: 1 }); });
      const hx = 270, cx = hx - 100 * Math.cos(a), cz = 100 * Math.sin(a) + .6;
      const q = P.poly([[hx, 0, .6], [hx, 205, .6], [cx, 205, cz], [cx, 0, cz]]); if (q) shape(q, { fill: r === 'alma' ? '#FFFFFF' : '#ECEDE8', stroke: '#3E4A5E', lwPx: 1.3 });
      L.front(P, t, { ...set, splitZ: 0, toZ: shown ? z : undefined });
    }, { blur: .6 });
    if (shown) {
      const [sx, sy, k] = P.p(x, 0, z), s = UNIT[who] * k, talk = speaking(who, t);
      let pose = POSE[who](t);
      if (moving) pose = { ...pose, ...(who === 'safadi' ? safadiWalk(u * 4, 1) : samiWalk(u * 4, 1)), mouth: talk ? lipFlap(t, true, 'grin') : 'smile', brows: 'up', lookX: .1, lookY: .1, turn: 0 };
      A[who] = RIG[who](sx, sy, s, { ...pose, t }); S[who] = s;
      L.front(P, t, { ...set, splitZ: z });
    }
    if (inW(t, knock, knock + 1.1)) sfx('KNOCK KNOCK!', W * .5, H * .14, 64, '#FFFDF6', t - knock, { life: 1.1 });
    if (inW(t, door[0], door[0] + .9)) sfx('CREAK', W * .32, H * .24, 54, '#FFFDF6', t - door[0], { life: .9 });
    bubbles(t, A, S); captions(t);
  };
  const aDoor = doorShot('alma', 'safadi', DOOR_A, SAF_WALK, KNOCK_A), hDoor = doorShot('housam', 'sami', DOOR_H, SAMI_WALK, P4 - .3);

  // ---------- the inserts ----------
  const ins = (fn, t0) => t => { fn(t, t0); insBubbles(t); };
  const decks = ins(DK.insDecks, 40.8), match = ins(DK.insMatch, 50.6);
  const safCard = t => { stage(t, A_SAF(t), 7); DK.insCard(t, 154.4, 'safadi'); insBubbles(t); };
  const samiCard = t => { stage(t, H_SAMI(t), 7); DK.insCard(t, 189.7, 'sami'); insBubbles(t); };
  // Professor Safadi at the chalkboard: he stands on the left with his pointer, the board fills in on the right
  function chalk(t) {
    DK.insChalk(t, CHALK, BEATS);
    const s = 29, talk = speaking('safadi', t), l = lineOf('safadi', t), p = .45 + .1 * Math.sin(t * 2);
    const point = l && t > l.at + .6 && t < l.at + lineDur(l) - .3 && (Math.floor((t - CHALK) / 2.3) % 2 === 0);
    const A = safadi(300, H + 120, s, { t, power: p, mouth: talk ? lipFlap(t, true, 'smile') : 'smile', brows: 'up', eyes: 'open', lookX: .45, lookY: .05, turn: .25,
      handR: point ? [6.2, -18.5] : [5.3, -12.6], handPoseR: point ? 'pointer' : 'palm', pointerAng: -.45, pointerLen: 11, handL: [-5.3, -12.4], handPoseL: 'palm', bulb: backOut(seg(t, 109.3, 109.6)) * (1 - seg(t, 111.5, 112)) });
    for (const ln of LINES) { if (ln.speaker !== 'safadi' || ln.silentBubble) continue; const age = t - ln.at; if (age < 0 || age > 8) continue;
      callout(ln.text, A.mouth[0] + 40, A.mouth[1] - 170, age, { size: 40, maxW: 520, cps: ln.cps, hold: ln.hold, accent: ACCENT.safadi, dx: -10, dy: -170 }); }
    for (const ln of LINES) { if (ln.speaker === 'safadi' || ln.silentBubble) continue; const age = t - ln.at; if (age < 0 || age > 8) continue;
      callout(ln.text, W - 230, H + 20, age, { size: 48, maxW: 760, cps: ln.cps, hold: ln.hold, accent: ACCENT[ln.speaker], dx: 260, dy: -190 }); }
  }

  // ---------- the ending: the brothers laugh, freeze, TO BE CONTINUED, iris ----------
  function ending(t) {
    const tt = Math.min(t, FREEZE); const { A, S } = stage(tt, L_TWO(tt), .8); bubbles(tt, A, S);
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

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: Alma's room, Jenna and Danny
      [0, aOpen], [5.6, aTwo], [12.2, aJen], [16.0, aDan], [19.7, aJen], [23.0, aDan], [26.6, aTwo], [40.8, decks],
      // part 2: Housam's room, the experts
      [P2, hOpen], [50.6, match], [55.4, hHou], [60.1, hAlm], [64.6, hHou], [69.4, hAlm], [73.8, hTwo],
      // part 3: Professor Safadi drops in
      [P3, aDoor], [SAF_IN, aThree], [97.4, aSaf], [101.8, aThree], [106.0, aSaf], [CHALK, chalk], [CHALK_END, aThree],
      [150.3, aSaf], [154.4, safCard], [159.5, aThree],
      // part 4: Doctor Sami checks on Housam and Alma
      [P4, hDoor], [SAMI_IN, hThree], [180.8, hSami], [189.7, samiCard], [193.6, hThree],
      // part 5: the living room
      [P5, lrTwo], [LAUGH_L - .2, ending],
    ] });
})();
