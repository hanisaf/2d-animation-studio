// Scene 64: "The Card Collectors", the first scene of the Pokemon series. In Housam's bedroom, Housam and Alma sort their cards:
// a shiny dragon, a superhero dolphin. Knock knock: Jenna and Danny drop by. "Are those... stickers?" "They are Pokemon cards! They
// have made 34 billion dollars!" "Allow me to explain!" Five reasons, each with a full-frame insert (props.js): cute and cool
// creatures, amazing art, a real game, promo cards, and a huge market. A whiteboard recap, then Jenna and Danny want in and the four
// plan a Pokemon TCG tournament: "LET'S DO IT!" Freeze. To be continued.
// Every shot is a pure function of t.
(() => {
  const HB = LOCATIONS.housam_bedroom, LINES = ASSETS.scene.scene64_card_collectors.dialogue;
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT };
  const RIG = { jenna, danny, housam, alma };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6 };
  const WALK = { jenna: jennaSkip, danny: dannyDribble };
  const KIDS = ['danny', 'jenna', 'alma', 'housam'];

  // ---------- timing ----------
  const KNOCK = 13.9, DOOR = [14.6, 15.2], ARRIVE = 18.4;
  const R = [42.5, 55.7, 65.1, 82.3, 96.0], SUM = 107.9, TICKS = [109.4, 110.1, 110.9, 111.6, 113.6];
  const GIFT = 117.2, CHEER = 131.5, FREEZE = 133.6, END = 138.0;

  // ---------- helpers ----------
  const plainLen = l => l.text.replace(/\*/g, '').length;
  const lineDur = l => plainLen(l) / l.cps + l.hold;
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < plainLen(l); });
  const lineOf = (who, t) => LINES.find(l => !l.silentBubble && l.speaker === who && t > l.at && t < l.at + lineDur(l));
  const curSpeaker = t => LINES.find(l => !l.silentBubble && t > l.at && t < l.at + lineDur(l))?.speaker;
  const inW = (t, a, b) => t > a && t < b;
  const bigO = n => n === 'alma' || n === 'jenna' ? 'O' : 'open';
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];

  // ---------- staging: the four kids in a row on the soccer-pitch rug (bed view, +X = screen-right) ----------
  const MARK = { danny: [-195, 505], jenna: [-80, 485], alma: [40, 455], housam: [150, 465] };
  const SIDE = { danny: -1, jenna: -.45, alma: .3, housam: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.1, -.8, .8);
  // where each kid holds a card (local units) and how wide it is
  const HOLD = { housam: { chest: -15, up: -24, side: 5.2, w: 3.8 }, alma: { chest: -7.5, up: -15, side: 5.2, w: 4.2 },
    jenna: { chest: -12, up: -19, side: 6, w: 4.0 }, danny: { chest: -12.5, up: -20, side: 6, w: 4.6 } };
  const CARD_OF = { housam: 'dragon', alma: 'fin', jenna: 'sprout', danny: 'star' };
  const hasCard = (n, t) => n === 'housam' || n === 'alma' || t > GIFT;
  const reasonIdx = t => R.reduce((a, r, i) => t > r ? i : a, -1);

  // the board on Housam's wall fills in with the five reasons as they come
  function board(t) {
    X.translate(200, 0); X.scale(-1, 1);                                            // the side wall maps board-x along +Z: unmirror it
    PK.text('POKEMON TCG', 100, 14, 15, '#C8403A', { font: FONT_SFX, weight: 400 });
    ['creatures', 'art', 'a game', 'promo cards', 'market'].forEach((s, i) => { if (t < R[i] + .4) return;
      PK.text(`${i + 1}. ${s}`, 30, 32 + i * 16, 12, '#2F5DB0', { align: 'left', weight: 700 });
      if (t > TICKS[i]) line([[150, 30 + i * 16], [155, 36 + i * 16], [164, 26 + i * 16]], { stroke: '#3F9B4F', lwPx: 2 }); });
    if (t > R[0] - 2) PK.text('$34 BILLION', 140, 100, 12, '#2F8A48', { weight: 800 });
  }
  const setOpts = { lamp: .6, laptop: true, board };

  function kidPose(n, t) {
    const talk = speaking(n, t), say = m => talk ? lipFlap(t, true, m) : m, H0 = HOLD[n], ph = { danny: 2.6, jenna: 1.3, alma: 0, housam: 3.9 }[n];
    const o = { giraffe: false, mouth: say('smile'), brows: 'normal', eyes: 'open', lookY: .08, lookX: .12 * Math.sin(t * .5 + ph),
      handL: [-3.2, -9.6], handR: [3.2, -9.6], handPoseL: 'open', handPoseR: 'open', turn: -SIDE[n] * .2, card: null };
    const set = p => Object.assign(o, p);
    const sp = curSpeaker(t);
    if (sp) set({ lookX: lookAt(n, sp) });
    const holding = hasCard(n, t);
    if (holding) set({ handL: [-H0.side * .45, H0.chest], handPoseL: 'fist', card: { hand: 'L', up: false } });
    // part 1: looking down at the cards, then showing them off
    if (t < KNOCK) {
      set({ lookY: .45, lookX: n === 'housam' ? -.25 : .25, handL: [-1.4, H0.chest], handR: [1.4, H0.chest], handPoseL: 'fist', handPoseR: 'fist', card: { hand: 'mid', up: false } });
      if (n === 'housam' && inW(t, 2.4, 6.3)) set({ handR: [H0.side * .8, H0.up], handL: [-3.2, -9.6], handPoseL: 'open', card: { hand: 'R', up: true }, lookY: -.05, lookX: -.5, brows: 'up', mouth: say('grin'), jump: .4 * kick(t, 2.5, 5) });
      if (n === 'alma' && inW(t, 6.3, 9.8)) set({ handR: [H0.side * .8, H0.up], handL: [-3.2, -9.6], handPoseL: 'open', card: { hand: 'R', up: true }, lookY: -.05, lookX: .5, brows: 'up', mouth: say('grin'), eyes: talk ? 'open' : 'happy', jump: .4 * kick(t, 6.4, 5) });
      if (n === 'housam' && inW(t, 6.3, 9.8)) set({ lookY: .1, lookX: -.5, mouth: 'o', brows: 'up' });
      if (n === 'alma' && inW(t, 2.4, 6.3)) set({ lookY: .1, lookX: .5, mouth: say(bigO(n)), brows: 'up', eyes: 'wide' });
    }
    if (inW(t, KNOCK, KNOCK + 1.2)) set({ lookY: -.05, lookX: 0, eyes: 'wide', brows: 'up', mouth: 'o' });
    // talking: the free hand gestures; on "Reason N" the card goes up
    const l = lineOf(n, t);
    if (l && t > KNOCK) {
      set({ brows: 'up', mouth: say('smile'), handR: [H0.side, H0.chest + 3], handPoseR: 'palm' });
      if (/^(And r|R)eason/.test(l.text) || /look better/.test(l.text)) set({ handR: [H0.side * .8, H0.up], handPoseR: 'fist', card: { hand: 'R', up: true }, handL: [-3.2, -9.6], handPoseL: 'open' });
      if (/^BOOM/.test(l.text)) set({ handL: [-H0.side, H0.up], handR: [H0.side, H0.up], handPoseL: 'fist', handPoseR: 'fist', card: { hand: 'R', up: true }, eyes: 'wide', mouth: say(bigO(n)), jump: 1.1 * kick(t, l.at + .05, 6) });
      if (/^You sound/.test(l.text)) set({ eyes: 'closed', mouth: say('smirk'), brows: 'normal', handR: [3.2, -9.6], handPoseR: 'open', tilt: -.05, lookX: lookAt(n, 'housam') });
      if (n === 'danny' && /BILLION/.test(l.text)) set({ handL: [-6, -24], handR: [6, -24], handPoseL: 'open', handPoseR: 'open', eyes: 'wide', mouth: say(bigO(n)), jump: 1.3 * kick(t, l.at + .05, 5) });
      if (/^Poke-what|stickers/.test(l.text)) set({ brows: 'worried', handR: [H0.side * .9, H0.chest - 3], handPoseR: 'palm', tilt: .05 });
    }
    // reactions of the listeners
    if (n === 'jenna' || n === 'danny') {
      if (inW(t, 26.7, 30.4) || inW(t, 99.9, 104.6)) set({ eyes: 'wide', mouth: bigO(n), brows: 'up' });
      if (n === 'jenna' && inW(t, 30.5, 32.6)) set({ eyes: 'wide', mouth: 'o', brows: 'up', lookX: lookAt('jenna', 'danny') });
      if (n === 'jenna' && inW(t, 93.3, 95.8)) set({ eyes: 'wink', mouth: say('smirk'), handR: [HOLD.jenna.side * .9, HOLD.jenna.chest - 4], handPoseR: 'point' });
      if (n === 'danny' && inW(t, 104.6, 108)) set({ eyes: talk ? 'wide' : 'happy', mouth: say('grin'), handL: [-5.4, -22], handR: [5.4, -22], handPoseL: 'open', handPoseR: 'open', jump: .7 * kick(t, 104.8, 5) });
      if (inW(t, GIFT - .2, GIFT + 1.4)) set({ eyes: n === 'jenna' ? 'star' : 'wide', mouth: bigO(n), brows: 'up', lookY: .4, lookX: 0, jump: .5 * kick(t, GIFT, 5) });
      if (n === 'jenna' && lineOf('jenna', t)?.at === 117.4) set({ eyes: 'star', card: { hand: 'R', up: true }, handR: [HOLD.jenna.side * .8, HOLD.jenna.up], handL: [-3.2, -11.5] });
      if (n === 'danny' && lineOf('danny', t)?.at === 120.2) set({ card: { hand: 'R', up: true }, handR: [HOLD.danny.side * .8, HOLD.danny.up], handL: [-3.2, -12], handPoseR: 'fist' });
    }
    if (n === 'alma' && inW(t, 123.6, 127.5)) set({ eyes: 'star', power: .5 });
    // the cheer: everyone jumps, fists (and cards) in the air
    if (t > CHEER - .1) { const tt = Math.min(t, FREEZE);
      set({ handL: [-H0.side, H0.up], handR: [H0.side, H0.up], handPoseL: 'fist', handPoseR: 'fist', card: { hand: 'R', up: true }, brows: 'up', mouth: say(bigO(n)), eyes: n === 'jenna' || n === 'alma' ? 'star' : 'wide', jump: 1.2 * Math.abs(Math.sin((tt - CHEER) * 7 + ph * .3)), lookY: -.15, lookX: 0 }); }
    return o;
  }

  // a card in a kid's hand (screen space): held flat at the chest, or held up to show
  function heldCard(n, A, s, pose, t) {
    const c = pose.card; if (!c) return;
    const H0 = HOLD[n], w = H0.w * s * (c.up ? 1.25 : 1);
    let hp = c.hand === 'mid' ? [(A.handL[0] + A.handR[0]) / 2, (A.handL[1] + A.handR[1]) / 2] : c.hand === 'L' ? A.handL : A.handR;
    if (c.up) hp = [hp[0] + (c.hand === 'L' ? -1 : 1) * w * .3, hp[1]];             // held out beside the head, not over the face
    const kind = CARD_OF[n], shiny = n === 'housam' || (n === 'alma' && t > 6.3);
    if (n === 'jenna' || n === 'danny') { const k = backOut(seg(t, GIFT, GIFT + .4)); if (k <= 0) return;
      PK.card(hp[0], hp[1] - w * .55, w * k, c.up ? .08 : 0, { kind, t, holo: .5 }); return; }
    PK.card(hp[0], hp[1] - w * (c.up ? .6 : .35), w, c.up ? (n === 'housam' ? -.1 : .1) + .04 * Math.sin(t * 2) : (n === 'housam' ? -.08 : .08), { kind, t, holo: shiny ? .8 : 0 });
  }

  // cards and the binder on the rug (part 1 onwards)
  function floorStuff(P, t) {
    PK.binder(P, 95, 405, -.12, t);
    [[-25, 410, .4, 'sprout'], [-50, 392, -.3, 'star'], [-5, 380, 1.2, null], [205, 400, -.5, 'fin'], [185, 385, .2, null]].forEach(([x, z, a, kd]) =>
      PK.cardFloor(P, x, z, a, kd ? { kind: kd, t } : { back: true, t }));
  }

  function stage(t, camo, blur, who = KIDS) {
    const P = persp(camo), A = {}, S = {}, poses = {};
    const present = who.filter(n => n === 'housam' || n === 'alma' || t > ARRIVE - .01);
    const actors = present.map(n => ({ n, x: MARK[n][0], z: MARK[n][1] })).filter(a => P.depth(a.z) > 40).sort((p, q) => P.depth(q.z) - P.depth(p.z));
    layer(() => { HB.back(P, t, { ...setOpts, splitZ: actors.length ? actors[0].z : 9999 }); floorStuff(P, t); }, { blur });
    actors.forEach((a, i) => {
      const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[a.n] * k, pose = kidPose(a.n, t);
      A[a.n] = RIG[a.n](sx, sy, s, { ...pose, t }); S[a.n] = s; poses[a.n] = pose;
      heldCard(a.n, A[a.n], s, pose, t);
      HB.front(P, t, { ...setOpts, splitZ: a.z, toZ: actors[i + 1]?.z });
    });
    // the gift: Alma and Housam hand Jenna and Danny their first cards
    if (inW(t, GIFT, GIFT + .8)) for (const n of ['jenna', 'danny']) if (A[n]) sfx('✦', A[n].handR[0], A[n].handR[1] - 80, 60, '#FFE066', t - GIFT, { life: .8 });
    if (inW(t, KNOCK, KNOCK + 1.3)) sfx('KNOCK KNOCK!', W * .5, H * .14, 64, '#FFFDF6', t - KNOCK, { life: 1.3 });
    if (A.danny && inW(t, 30.5, 32)) sfx('?!', A.danny.top[0] + 3 * S.danny, A.danny.top[1], 72, '#FFE066', t - 30.5, { life: 1.2 });
    if (inW(t, 79.1, 80.6)) sfx('BOOM!', W * .5, H * .2, 110, '#FF6B6B', t - 79.15, { life: 1.4 });
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
      // the bubble goes away from a neighbour standing close beside the speaker, else toward the middle of the frame
      const near = d => Object.entries(A).some(([n, o]) => n !== l.speaker && o.mouth[0] > 0 && o.mouth[0] < W && d * (o.mouth[0] - a.mouth[0]) > 0 && Math.abs(o.mouth[0] - a.mouth[0]) < 480);
      const side = sides[l.speaker] ?? (near(1) && !near(-1) ? -1 : near(-1) && !near(1) ? 1 : a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .7 * s, age, { ...c, dx: side * 230, dy: -250 });
    }
  }
  // in a full-frame insert the speaker is off screen: the tail points down to their corner
  const INS_SIDE = { danny: -1, jenna: -1, alma: -1, housam: 1 };
  function insBubbles(t) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const side = INS_SIDE[l.speaker];
      callout(l.text, side < 0 ? 230 : W - 230, H + 20, age, { size: 48, maxW: 760, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker], dx: side * -260, dy: -190 });
    }
  }

  // ---------- cameras (bed view) ----------
  const cam = (x, y, z, hy, f) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const C_TWO = cam(95, 125, 255, 590, 880);         // Alma and Housam
  const C_FOUR = cam(-20, 128, 165, 585, 820);       // all four in a row, the bed behind
  const C_EXPERT = cam(105, 125, 255, 480, 820);      // Alma and Housam explaining
  const C_LEARN = cam(-135, 112, 270, 560, 800);     // Jenna and Danny listening
  const shot = (camFn, blur = 1, sides) => t => { const { A, S } = stage(t, camFn(t), blur); bubbles(t, A, S, sides); };
  const two = shot(C_TWO, 1, { alma: -1 }), four = shot(C_FOUR, .8), experts = shot(C_EXPERT, 1, { alma: -1, housam: -1 }), learners = shot(C_LEARN, 1, { danny: 1, jenna: 1 });
  function opening(t) { const u = ease(seg(t, .2, 4.0)), b = C_TWO(t); const { A, S } = stage(t, { ...b, y: lerp(175, b.y, u), z: lerp(40, b.z, u), hy: lerp(560, b.hy, u), f: lerp(640, b.f, u), x: lerp(0, b.x, u) }, .5); bubbles(t, A, S); }

  // a shiny card held up to the lens, the room soft behind it
  const showCard = (kind, who) => t => {
    stage(t, C_TWO(t), 7);
    X.fillStyle = 'rgba(30,20,50,.25)'; X.fillRect(0, 0, W, H);
    const st = { housam: 4.0, alma: 7.4 }[who], k = backOut(seg(t, st, st + .4));
    const g = X.createRadialGradient(W / 2, H * .48, 30, W / 2, H * .48, 560); g.addColorStop(0, 'rgba(255,245,200,.7)'); g.addColorStop(1, 'rgba(255,245,200,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
    PK.card(W / 2, H * .48 + 6 * Math.sin(t * 2), 470 * k, .05 * Math.sin(t * 1.4), { kind, t, holo: 1 });
    for (let i = 0; i < 6; i++) { const a = t * 1.2 + i * 1.05, r = 380 + 30 * Math.sin(t * 2 + i);
      shape(starPts(W / 2 + Math.cos(a) * r, H * .48 + Math.sin(a) * r * .95, 20 + 8 * Math.sin(t * 6 + i), .35, 4, t * 2), { fill: '#FFFFFF', stroke: null, alpha: .85 }); }
    if (inW(t, st + .2, st + 1.4)) sfx('SHINY!', W * .5 + 330, H * .2, 80, '#FFE066', t - st - .2, { life: 1.2 });
    insBubbles(t);
  };
  const showDragon = showCard('dragon', 'housam'), showDolphin = showCard('fin', 'alma');

  // ---------- the door (door view): it swings open and Jenna and Danny walk in ----------
  const C_DOOR = t => { const [dx, dy] = drift(t); return { x: 150 + dx, y: 122, z: 430, f: 860, hy: 600 + dy, dir: -1 }; };
  const PATH = { jenna: { from: [200, 12], to: [128, 190], t: [14.9, 16.7] }, danny: { from: [236, 0], to: [232, 205], t: [15.5, 17.4] } };
  function doorShot(t) {
    const P = persp(C_DOOR(t)), A = {}, S = {};
    const who = ['jenna', 'danny'].map(n => { const p = PATH[n], u = ease(seg(t, p.t[0], p.t[1]));
      return { n, x: lerp(p.from[0], p.to[0], u), z: lerp(p.from[1], p.to[1], u), moving: u > .001 && u < .999, ph: seg(t, p.t[0], p.t[1]) * 6, shown: t > p.t[0] - .05 }; })
      .filter(a => a.shown).sort((p, q) => P.depth(q.z) - P.depth(p.z));
    layer(() => {
      HB.back(P, t, { ...setOpts, splitZ: 0 });
      // the open doorway: the hall beyond, and the door panel swung into the room
      const a = 1.65 * ease(seg(t, DOOR[0], DOOR[1]));
      P.plane(.5, () => { shape(rectPts(170, -205, 100, 205), { fill: '#F4E2BE', stroke: null }); shape(rectPts(170, -40, 100, 40), { fill: '#C7A27A', stroke: null });
        shape(rectPts(196, -170, 48, 70), { fill: '#FFF6DE', stroke: '#C9B48E', lwPx: 1 }); });
      const hx = 270, cx = hx - 100 * Math.cos(a), cz = 100 * Math.sin(a) + .6;
      const q = P.poly([[hx, 0, .6], [hx, 205, .6], [cx, 205, cz], [cx, 0, cz]]); if (q) shape(q, { fill: '#ECEDE8', stroke: '#3E4A5E', lwPx: 1.3 });
      HB.front(P, t, { ...setOpts, splitZ: 0, toZ: who.length ? who[0].z : undefined });
    }, { blur: .6 });
    who.forEach((a, i) => {
      const [sx, sy, k] = P.p(a.x, 0, a.z), s = UNIT[a.n] * k, talk = speaking(a.n, t);
      const pose = a.moving ? { ...WALK[a.n](a.ph, 1), mouth: talk ? lipFlap(t, true, 'smile') : 'smile', brows: 'up', eyes: 'open', lookX: .2 }
        : { mouth: talk ? lipFlap(t, true, 'smile') : 'smile', brows: 'up', eyes: 'open', lookX: .35, lookY: .05, handR: a.n === 'jenna' && t < 18.2 ? [5.4, -24] : [3.2, -11.5], handPoseR: a.n === 'jenna' && t < 18.2 ? 'open' : 'open' };
      if (a.n === 'jenna' && inW(t, 15.8, 18.2)) Object.assign(pose, { handR: [5.4, -24 + Math.sin(t * 12)], handPoseR: 'open' });   // a wave
      A[a.n] = RIG[a.n](sx, sy, s, { giraffe: false, ...pose, t }); S[a.n] = s;
      HB.front(P, t, { ...setOpts, splitZ: a.z, toZ: who[i + 1]?.z });
    });
    if (t < DOOR[0] + .5) sfx('CREAK', W * .32, H * .2, 54, '#FFFDF6', t - DOOR[0], { life: .9 });
    bubbles(t, A, S);
  }

  // ---------- the inserts ----------
  const ins = (fn, t0) => t => { fn(t, t0); insBubbles(t); };
  const billions = ins(PK.insBillions, 26.6), creatures = ins(PK.insCreatures, 46.6), art = ins(PK.insArt, 59.0), deck = ins(PK.insDeck, 69.4);
  const promo = ins(PK.insPromo, 85.4), market = ins(PK.insMarket, 99.8), summary = t => { PK.insSummary(t, SUM, TICKS); insBubbles(t); };

  // ---------- the ending: the cheer, freeze, TO BE CONTINUED, iris ----------
  function ending(t) {
    const tt = Math.min(t, FREEZE); const { A, S } = stage(tt, C_FOUR(tt), .8); bubbles(tt, A, S);
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

  scene({ duration: END, fps: 24, bpm: 116,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: the collections
      [0, opening], [4.0, showDragon], [6.3, two], [7.4, showDolphin], [9.7, two],
      // part 2: Jenna and Danny drop by
      [DOOR[0], doorShot], [ARRIVE, four], [26.6, billions], [30.4, learners], [32.6, four],
      // the five reasons
      [R[0], experts], [46.6, creatures], [51.1, four],
      [R[1], experts], [59.0, art],
      [65.0, experts], [69.4, deck], [79.0, four],
      [R[3] - .1, experts], [85.4, promo], [90.3, learners],
      [R[4], experts], [99.8, market], [104.6, learners],
      [SUM, summary],
      // the plan
      [116.8, four], [CHEER - .2, ending],
    ] });
})();
