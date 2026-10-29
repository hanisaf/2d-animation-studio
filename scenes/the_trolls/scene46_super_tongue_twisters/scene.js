// Scene 46: "Super Tongue Twisters". The Trolls, episode two. Still giggling from episode one, the kids turn tongue twisters
// into a game: whoever is challenged picks the next victim. Housam → Alma → Danny → Jenna → Professor Safadi, and every flub
// cracks the room up. While they laugh, Doctor Sami walks in, then Sarah, then Roudaynah, then Dr. G, and each newcomer is
// challenged in turn. Roudaynah says hers perfectly ("…Semicolon."), Dr. G declares RULE NUMBER RADISH. To be continued.
// Every shot is a pure function of t.
(() => {
  const LR = LOCATIONS.living_room, LINES = ASSETS.scene.scene46_super_tongue_twisters.dialogue;
  const CAST = ['housam', 'alma', 'danny', 'jenna', 'safadi', 'sami', 'sarah', 'roudaynah', 'dr_g'];
  const ACCENT = { housam: '#425DA0', alma: '#994EC4', danny: '#2E7D9A', jenna: '#D0508E', safadi: '#C08A3E', sami: '#3E9C74', sarah: '#C2577A', roudaynah: '#8A63C9', dr_g: '#2F3E63' };
  const NAME = { housam: 'HOUSAM', alma: 'ALMA', danny: 'DANNY', jenna: 'JENNA', safadi: 'PROFESSOR SAFADI', sami: 'DOCTOR SAMI', sarah: 'SARAH', roudaynah: 'ROUDAYNAH', dr_g: 'DR. G' };
  const UNIT = { housam: HOUSAM_UNIT, alma: ALMA_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT, sarah: SARAH_UNIT, roudaynah: ROUDAYNAH_UNIT, dr_g: DR_G_UNIT };
  const RIG = { housam, alma, danny, jenna, safadi, sami, sarah, roudaynah, dr_g };
  const HEADW = { housam: 5.6, alma: 6.6, danny: 5.4, jenna: 4.6, safadi: 7.6, sami: 7.6, sarah: 5.0, roudaynah: 5.4, dr_g: 6.4 };
  const TALL = { housam: 168, alma: 125, danny: 122, jenna: 135, safadi: 180, sami: 180, sarah: 170, roudaynah: 172, dr_g: 172 };   // world units, for framing
  // hand targets per rig (local units): rest, a talking palm, a raised point, both arms up, hands on the belly (laughing)
  const HANDS = {
    housam: { rest: [[-3.6, -10.6], [3.6, -10.6]], palm: [4.8, -16.5], point: [3.8, -22], up: [[-5.2, -24], [5.2, -24]], belly: [[-2.0, -13.5], [2.0, -13.5]], cheeks: [[-1.4, -19.6], [1.4, -19.6]] },
    alma: { rest: [[-2.2, -6.0], [2.2, -6.0]], palm: [4.6, -13.6], point: [4.8, -13.4], up: [[-4.6, -11.5], [4.6, -11.5]], belly: [[-1.6, -7.4], [1.6, -7.4]], cheeks: [[-1.0, -10.6], [1.0, -10.6]] },
    danny: { rest: [[-2.6, -10.2], [2.6, -10.2]], palm: [4.2, -14.2], point: [4.0, -19.5], up: [[-4.6, -20], [4.6, -20]], belly: [[-2.2, -11.4], [2.2, -11.4]], cheeks: [[-1.0, -17.2], [1.0, -17.2]] },
    jenna: { rest: [[-2.6, -10.2], [2.6, -10.2]], palm: [4.2, -14.2], point: [4.0, -19.5], up: [[-4.6, -20], [4.6, -20]], belly: [[-2.2, -11.3], [2.2, -11.3]], cheeks: [[-1.0, -17.0], [1.0, -17.0]] },
    safadi: { rest: [[-4.6, -11.5], [4.6, -11.5]], palm: [5.0, -18.5], point: [5.8, -21.4], up: [[-5.6, -21], [5.6, -21]], belly: [[-2.4, -10.8], [2.4, -10.8]], cheeks: [[-1.2, -18.6], [1.2, -18.6]] },
    sami: { rest: [[-4.4, -8.1], [4.4, -8.1]], palm: [5.3, -12.6], point: [5.8, -21.4], up: [[-5.6, -20], [5.6, -20]], belly: [[-2.5, -10.4], [2.5, -10.4]], cheeks: [[-1.2, -18.4], [1.2, -18.4]] },
    sarah: { rest: [[-2.9, -14.9], [2.9, -14.9]], palm: [4.6, -21], point: [5, -27], up: [[-5, -28], [5, -28]], belly: [[-2.4, -17], [2.4, -17]], cheeks: [[-1.3, -26], [1.3, -26]] },
    roudaynah: { rest: [[-4.3, -14.5], [4.3, -14.5]], palm: [5, -21], point: [5.5, -27], up: [[-5.5, -27], [5.5, -27]], belly: [[-2.6, -18.5], [2.6, -18.5]], cheeks: [[-1.6, -26], [1.6, -26]] },
    dr_g: { rest: [[-4.3, -16], [4.4, -13.6]], palm: [6, -20], point: [6.8, -28.6], up: [[-6.5, -26], [6.5, -26]], belly: [[-2.4, -17], [2.4, -17]], cheeks: [[-1.8, -27], [1.8, -27]] },
  };
  // face names that not every rig has: fall back to the nearest one it does
  const HAS = { squeeze: ['housam', 'alma', 'danny', 'jenna', 'safadi', 'sami'], wobble: ['housam', 'alma', 'danny', 'jenna', 'safadi', 'sami'], o: ['housam', 'alma', 'danny', 'jenna', 'safadi', 'sami', 'dr_g'], worried: ['housam', 'alma', 'danny', 'jenna', 'safadi', 'sami', 'roudaynah', 'dr_g'] };
  const FALL = { squeeze: 'closed', wobble: 'open', o: 'open', worried: 'up' };
  const face = (who, v) => HAS[v] && !HAS[v].includes(who) ? FALL[v] : v;
  const FLAP = { sarah: ['grin', 'open', 'smile', 'open'], roudaynah: ['grin', 'open', 'smile', 'open'] };

  // ---------- timing (from the tagged dialogue lines) ----------
  const LINE = tag => LINES.find(l => l.tag === tag), AT = tag => LINE(tag).at;
  const SPOKEN = LINES.filter(l => !l.silentBubble);
  const lineDur = l => .25 + l.text.replace(/\*/g, '').length / l.cps + l.hold;
  const typed = l => l.at + .2 + l.text.replace(/\*/g, '').length / l.cps;
  const nextSpoken = l => SPOKEN[SPOKEN.indexOf(l) + 1];
  const PAIRS = [['housam', 'alma'], ['alma', 'danny'], ['danny', 'jenna'], ['jenna', 'safadi'], ['safadi', 'sami'], ['sami', 'sarah'], ['sarah', 'roudaynah'], ['roudaynah', 'dr_g']];
  const ROUNDS = PAIRS.map(([from, to], i) => {
    const n = i + 1, vs = LINE('vs' + n), tw = LINE('tw' + n), fl = LINE(n === 7 ? 'perfect' : 'fl' + n), ha = LINE('ha' + n);
    const after = ha && nextSpoken(ha);                                          // the room laughs until somebody talks again
    return { n, from, to, vs, reply: nextSpoken(vs), tw, fl, ha, laugh: ha ? [typed(fl) + .1, after ? after.at + .3 : Infinity] : null };
  });
  const TITLE = LINE('title'), PERFECT = LINE('perfect'), EXPLAIN = LINE('explain'), NOEX = LINE('noexplain'), OOH = nextSpoken(LINE('vs4'));
  const STUN = [typed(PERFECT) + .1, AT('drg') - 1.6];                          // nobody laughs: she nailed it
  const FREEZE = typed(LINE('ha8')) + .4, END = FREEZE + 6.4;

  // ---------- helpers ----------
  const inW = (t, a, b) => t > a && t < b;
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const speaking = (who, t) => LINES.some(l => l.speaker === who && t > l.at + .2 && t < typed(l));
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];
  const roundAt = t => { let r = null; for (const R of ROUNDS) if (t > R.vs.at - .3) r = R; return r; };
  const laughRound = t => ROUNDS.find(R => R.laugh && inW(t, R.laugh[0], R.laugh[1]));
  const flubbing = (who, t) => ROUNDS.find(R => R.to === who && inW(t, R.fl.at, typed(R.fl) + .1) && R.n !== 7);
  const tied = (who, t) => ROUNDS.find(R => R.to === who && R.n !== 7 && inW(t, typed(R.fl) + .1, typed(R.fl) + 1.5));
  const focusOf = t => { const l = SPOKEN.find(l => t > l.at && t < l.at + lineDur(l)); return l ? l.speaker : null; };

  // ---------- blocking (sofa view: +X is screen-left; the archway is on screen-left) ----------
  // The kids and the professor stand where episode one left them; each newcomer walks in through the archway.
  const SPOT = { danny: [250, 250], jenna: [-250, 250], housam: [95, 450], alma: [-95, 460], safadi: [-300, 500],
    sami: [175, 185], sarah: [-10, 205], roudaynah: [310, 540], dr_g: [425, 320] };
  const ARCH = [440, 260];
  const PATH = { sami: [ARCH, SPOT.sami], sarah: [ARCH, [320, 335], SPOT.sarah], roudaynah: [ARCH, [420, 420], SPOT.roudaynah], dr_g: [[445, 230], SPOT.dr_g] };
  const ENTER = { sami: LINE('sami'), sarah: LINE('sarah'), roudaynah: LINE('roudaynah'), dr_g: LINE('drg') };
  const WALK = Object.fromEntries(Object.entries(ENTER).map(([n, l]) => [n, [l.at - (n === 'dr_g' ? 2.2 : 3.0), l.at - .2]]));
  const segLen = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const pathLen = pts => pts.slice(1).reduce((s, p, i) => s + segLen(pts[i], p), 0);
  function pathAt(pts, d) {
    for (let i = 1; i < pts.length; i++) { const L = segLen(pts[i - 1], pts[i]); if (d <= L || i === pts.length - 1) { const u = clamp(d / L); return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]; } d -= L; }
  }
  const walkDist = (n, t) => ease(seg(t, WALK[n][0], WALK[n][1])) * pathLen(PATH[n]);
  const posAt = (n, t) => PATH[n] ? pathAt(PATH[n], walkDist(n, t)) : SPOT[n];
  const present = (n, t) => !WALK[n] || t >= WALK[n][0];
  const walking = (n, t) => WALK[n] && inW(t, WALK[n][0], WALK[n][1]);
  const lookAt = (me, who, t) => !who || who === me ? 0 : clamp((posAt(me, t)[0] - posAt(who, t)[0]) / 220, -.85, .85);
  // a plain walk cycle for the rigs without one (phase p in steps, stride amount k)
  function gait(p, k, fx, fy, lift) {
    const sn = Math.sin(p * Math.PI);
    return { footL: [-fx + .12 * k * sn, fy - lift * k * Math.max(0, sn)], footR: [fx + .12 * k * sn, fy - lift * k * Math.max(0, -sn)], dy: -.25 * k * Math.abs(sn) + .1 * k, tilt: .02 * k * sn };
  }
  const GAIT = { sarah: [1.65, -1.05, 1.3, 13], roudaynah: [1.7, -1, 1.4, 13], dr_g: [1.6, -.9, 1.2, 12] };

  // ---------- poses ----------
  function pose(name, t) {
    const Hd = HANDS[name], talk = speaking(name, t), F = v => face(name, v);
    const say = m => talk ? lipFlap(t, true, m, FLAP[name]) : m;
    const o = { mouth: say(name === 'sarah' ? 'smirk' : 'smile'), brows: 'normal', eyes: 'open', lookX: 0, lookY: .05,
      handL: Hd.rest[0], handR: Hd.rest[1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    const wig = (p, a = .4) => [p[0], p[1] + a * Math.sin(t * 7)];
    const f = focusOf(t); if (f && f !== name) set({ lookX: lookAt(name, f, t) });
    if (talk) set({ brows: 'up', handR: wig(Hd.palm), handPoseR: 'palm' });
    if (name === 'dr_g') set({ holdL: 'clipboard', handL: [-4.3, -16] });
    if (name === 'sarah' && t < ROUNDS[5].fl.at + 1.0) set({ ...sarahAbility(t, 'texting'), lookX: 0 });   // eyes on her phone, always
    if (name === 'sarah' && talk && t < ROUNDS[5].fl.at) set({ lookY: .5 });

    // the title: every kid jumps, arms up
    if (inW(t, TITLE.at, typed(TITLE) + .5) && HANDS[name] && ['housam', 'alma', 'danny', 'jenna'].includes(name)) {
      const k = kick(t, TITLE.at + .1, 4);
      set({ handL: Hd.up[0], handR: Hd.up[1], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', brows: 'up', mouth: say('open'), jump: 1.2 * k, lookX: 0 });
    }
    if (name === 'safadi' && inW(t, TITLE.at, typed(TITLE) + .5)) set({ eyes: 'wide', brows: 'up', mouth: 'o', handL: Hd.up[0].map((v, i) => v * (i ? .8 : 1)), handR: [5.4, -16.5] });

    // the round: the challenger points, the victim gulps, then shows off
    const R = roundAt(t);
    if (R && inW(t, R.vs.at, R.vs.at + lineDur(R.vs))) {
      if (name === R.from) set({ handR: wig(Hd.point, .3), handPoseR: name === 'sarah' || name === 'roudaynah' ? 'open' : 'point', lookX: lookAt(name, R.to, t), brows: 'up', eyes: 'open', mouth: say('grin'), lean: -.03 });
      if (name === R.to && t > typed(R.vs) - .6) set({ eyes: 'wide', brows: 'up', mouth: F('o'), jump: .5 * kick(t, typed(R.vs) - .5, 7), lookX: lookAt(name, R.from, t) });
    }
    if (R && R.reply && R.reply.speaker === name && inW(t, R.reply.at, R.tw.at)) {
      const nervous = R.n === 3;                                                 // Jenna: "Oh no. Oh no no no."
      if (nervous) set({ handL: Hd.cheeks[0], handR: Hd.cheeks[1], brows: F('worried'), eyes: 'wide', mouth: say(F('o')), tilt: .05 * Math.sin(t * 9) });
      else if (name !== 'sarah') set({ handL: Hd.belly[0].map((v, i) => i ? v + 1 : v * 1.8), handR: Hd.belly[1].map((v, i) => i ? v + 1 : v * 1.8), handPoseL: 'fist', handPoseR: 'fist', brows: 'up', eyes: 'happy', mouth: say('grin'), lookX: lookAt(name, R.from, t) });   // hands on hips
    }
    if (R && inW(t, R.tw.at, typed(R.tw) + .2)) {
      if (name === R.from) { const c = Math.sin(t * 9); set({ handR: [Hd.palm[0] + .5 * c, Hd.point[1] + 1 + .8 * Math.abs(c)], handPoseR: name === 'sarah' || name === 'roudaynah' ? 'open' : 'point', eyes: 'open', brows: 'up', mouth: say('smile'), lookX: lookAt(name, R.to, t), tilt: .03 * c }); }
      if (name === R.to && name !== 'sarah') set({ eyes: 'open', brows: F('worried'), mouth: 'flat', lookX: lookAt(name, R.from, t), lookY: 0, dy: .05 * Math.sin(t * 20) });   // concentrating hard
    }

    // the flub: eyes crossing, arms flailing, tongue in a knot
    const fl = flubbing(name, t);
    if (fl) {
      const u = seg(t, fl.fl.at, typed(fl.fl)), w = Math.sin(t * 17);
      set({ eyes: Math.sin(t * 6) > 0 ? F('squeeze') : 'wide', brows: F('worried'), mouth: say(F('wobble')), tilt: .08 * w, lookX: .2 * w,
        handL: [Hd.up[0][0], lerp(Hd.rest[0][1], Hd.up[0][1], .5 + .3 * u)], handR: [Hd.up[1][0], lerp(Hd.rest[1][1], Hd.up[1][1], .5 + .3 * Math.sin(t * 5))] });
    }
    const td = tied(name, t);
    if (td) set({ eyes: F('squeeze'), mouth: F('wobble'), brows: F('worried'), tilt: .1 * Math.sin(t * 3), lookX: 0, handL: Hd.rest[0], handR: Hd.rest[1] });

    // everybody laughs (the flubber joins in once the stars clear)
    const LRd = laughRound(t);
    if (LRd && present(name, t) && !walking(name, t) && !(LRd.to === name && t < typed(LRd.fl) + 1.5) && !speaking(name, t) && !(ENTER[name] && t < ENTER[name].at + lineDur(ENTER[name]))) {
      const ph = CAST.indexOf(name) * 1.3, b = Math.abs(Math.sin(t * 11 + ph)), big = LRd.n === 4 || LRd.n === 8;
      set({ handL: Hd.belly[0], handR: Hd.belly[1], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', brows: 'up', mouth: 'open',
        dy: -(big ? .45 : .3) * b, tilt: (big ? .09 : .05) * Math.sin(t * 6 + ph), lean: (big ? .05 : .02) * Math.sin(t * 3 + ph), lookX: 0 });
      if (name === 'safadi' || name === 'dr_g') set({ handR: [Hd.cheeks[1][0], Hd.cheeks[1][1] + 1], handPoseR: 'open' });   // a chuckle behind the hand
      if (name === 'dr_g') set({ hearts: .5 });
    }
    // stunned silence after Roudaynah's perfect twister
    if (inW(t, STUN[0], STUN[1]) && name !== 'roudaynah' && !speaking(name, t)) {
      const k = backOut(seg(t, STUN[0], STUN[0] + .4));
      set({ eyes: 'wide', brows: 'up', mouth: F('o'), lookX: lookAt(name, 'roudaynah', t), dy: -.2 * k, lean: -.04 * k });
      if (['housam', 'alma', 'danny', 'jenna'].includes(name)) set({ handL: Hd.cheeks[0], handR: Hd.cheeks[1] });
    }
    // the kids: "Ooooooooh!" and "NO EXPLAINING!"
    if (['housam', 'alma', 'danny', 'jenna'].includes(name)) {
      if (inW(t, OOH.at, OOH.at + lineDur(OOH)) && name !== 'jenna') set({ handL: Hd.cheeks[0], handR: Hd.cheeks[1], mouth: F('o'), eyes: 'wide', brows: 'up', lookX: lookAt(name, 'safadi', t), dy: -.15 * Math.abs(Math.sin(t * 8)) });
      if (inW(t, NOEX.at - .1, NOEX.at + lineDur(NOEX))) set({ handL: Hd.up[0], handR: Hd.up[1], handPoseL: 'palm', handPoseR: 'palm', eyes: F('squeeze'), brows: 'up', mouth: say('open'), lookX: lookAt(name, 'safadi', t), lean: -.04, jump: .4 * kick(t, NOEX.at, 6) });
    }
    return special(name, t, o, set, Hd, F, say);
  }

  // the gags only one character does
  function special(name, t, o, set, Hd, F, say) {
    if (name === 'safadi') {
      if (inW(t, EXPLAIN.at, NOEX.at)) set({ handL: [-5.3, -12.4], handR: [5.3 + .3 * Math.sin(t * 6), -12.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', eyes: 'happy', lean: .03 });   // allow me to explain…
      if (inW(t, NOEX.at, NOEX.at + 1.6)) set({ eyes: 'wide', brows: 'up', mouth: 'o', lean: -.06 * kick(t, NOEX.at, 3), jump: .3 * kick(t, NOEX.at + .05, 7), handL: [-5.4, -16], handR: [5.4, -16] });
      const vw = nextSpoken(NOEX);                                              // "…Very well." deflated
      if (inW(t, vw.at, vw.at + lineDur(vw))) set({ eyes: 'closed', brows: 'worried', mouth: say('flat'), dy: .3, handL: Hd.rest[0], handR: Hd.rest[1] });
      const f4 = ROUNDS[3].fl;
      if (inW(t, f4.at, typed(f4))) set({ emote: 'sweat', emoteK: on(t, f4.at + .4, typed(f4), .2) });
    }
    if (name === 'danny') {                                                     // QUACK! QUACK! QUACK! with duck wings
      const f2 = ROUNDS[1].fl, q0 = typed(f2) - 1.6;
      if (inW(t, q0, typed(f2) + .8)) { const fl = Math.abs(Math.sin((t - q0) * 12));
        set({ handL: [-3.8 - 1.2 * fl, -14 + 1.6 * fl], handR: [3.8 + 1.2 * fl, -14 + 1.6 * fl], handPoseL: 'open', handPoseR: 'open', eyes: F('squeeze'), mouth: say('open'), jump: .5 * Math.abs(Math.sin((t - q0) * 6)), tilt: .06 * Math.sin(t * 12) }); }
    }
    if (name === 'sami') {
      if (walking('sami', t)) { const k = 1 - seg(t, WALK.sami[1] - .4, WALK.sami[1]); set({ ...samiWalk(walkDist('sami', t) / 58, k), lookX: .5, brows: 'up', mouth: 'smile' }); }
      if (inW(t, ENTER.sami.at, ENTER.sami.at + lineDur(ENTER.sami))) set({ handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', eyes: 'open' });
      const f5 = ROUNDS[4].fl;                                                  // tickling himself with his own stethoscope
      if (inW(t, f5.at + (typed(f5) - f5.at) * .55, typed(f5) + 1.8)) { const w = Math.sin(t * 14);
        set({ handR: [1.4 + .9 * w, -10.4 + .4 * Math.cos(t * 14)], handPoseR: 'stethoscope', handL: [-2.6, -10.6], eyes: F('squeeze'), mouth: say('grin'), brows: 'up', lean: .1 + .03 * w, tilt: .07 * w, dy: .35 + .15 * Math.abs(w) }); }
    }
    if (name === 'jenna') {
      const f3 = ROUNDS[2].fl, s0 = typed(f3) - 1.5;
      o.spin = inW(t, s0, s0 + 1.2) ? TAU * 2 * ease(seg(t, s0, s0 + 1.2)) : 0;   // a dolphin cartwheel on the spot
      if (inW(t, s0 - .2, s0 + 1.6)) set({ handL: Hd.up[0], handR: Hd.up[1], handPoseL: 'palm', handPoseR: 'palm', eyes: F('squeeze'), mouth: say('open'), jump: 1.2 * Math.sin(Math.PI * clamp(seg(t, s0, s0 + 1.2))) });
    }
    if (name === 'sarah') {
      if (walking('sarah', t)) { const [fx, fy, lift, str] = GAIT.sarah, k = 1 - seg(t, WALK.sarah[1] - .4, WALK.sarah[1]); set(gait(walkDist('sarah', t) / str, k * .8, fx, fy, lift)); }
      if (inW(t, ENTER.sarah.at, ENTER.sarah.at + lineDur(ENTER.sarah))) set({ brows: 'angry', mouth: say('flat'), lookY: .4, tilt: -.06 });
      const f6 = ROUNDS[5].fl, r0 = f6.at + (typed(f6) - f6.at) * .5;      // SEESAW! SEESAW! … full rebellion
      const reb = ease(seg(t, r0, r0 + .5)) * (1 - .5 * seg(t, typed(f6) + 2, typed(f6) + 6));
      if (t > r0 && t < ROUNDS[6].tw.at) set({ rebellion: reb });
      if (inW(t, r0, typed(f6) + .6)) set({ ...sarahAbility(t, 'rebellion', { k: reb }), phone: false, mouth: say('open') });
      if (inW(t, ROUNDS[6].vs.at, ROUNDS[6].tw.at)) set({ handL: Hd.belly[0].map((v, i) => i ? v + 2 : v * 1.4), handR: Hd.belly[1].map((v, i) => i ? v + 2 : v * 1.4), handPoseL: 'fist', handPoseR: 'fist' });   // hands on hips, hair still smoking
    }
    if (name === 'roudaynah') {
      if (walking('roudaynah', t)) set({ ...roudaynahAbility(t, 'busy'), ...(() => { const [fx, fy, lift, str] = GAIT.roudaynah, k = 1 - seg(t, WALK.roudaynah[1] - .4, WALK.roudaynah[1]); return gait(walkDist('roudaynah', t) / str, k, fx, fy, lift); })(), busy: true });
      if (inW(t, ENTER.roudaynah.at, ENTER.roudaynah.at + lineDur(ENTER.roudaynah))) set({ handR: [5.5, -27 + .4 * Math.sin(t * 5)], mouth: say('grin'), brows: 'up' });   // hello!
      if (inW(t, PERFECT.at - .3, STUN[1])) {                                   // types on her laptop the whole time, not even looking
        const k = seg(t, typed(PERFECT), typed(PERFECT) + .6);
        set({ ...roudaynahAbility(t, 'ideas', { k }), ideas: k, lookY: t < typed(PERFECT) ? .2 : .8, mouth: say('smile'), eyes: t > typed(PERFECT) && t < typed(PERFECT) + 1 ? 'wink' : 'open' });
      }
    }
    if (name === 'dr_g') {
      if (walking('dr_g', t)) { const [fx, fy, lift, str] = GAIT.dr_g, k = 1 - seg(t, WALK.dr_g[1] - .4, WALK.dr_g[1]); set({ ...gait(walkDist('dr_g', t) / str, k, fx, fy, lift), nature: .6 }); }
      if (inW(t, ENTER.dr_g.at, ENTER.dr_g.at + lineDur(ENTER.dr_g))) set({ handR: [6.2 + .5 * Math.sin(t * 7), -25.8], handPoseR: 'wave', mouth: say('grin'), brows: 'up' });
      const best = nextSpoken(ROUNDS[7].vs);
      if (inW(t, best.at, best.at + lineDur(best))) set({ ...dr_gAbility(t, 'rules'), mouth: say('grin') });
      const f8 = ROUNDS[7].fl;
      if (inW(t, typed(f8) - 1.6, typed(f8) + .6)) set({ ...dr_gAbility(t, 'rules'), rules: 1, mouth: say('open'), eyes: 'wide', jump: .6 * kick(t, typed(f8) - 1.5, 5) });
      const nr = LINE('notarule');
      if (inW(t, nr.at - .2, nr.at + lineDur(nr))) set({ holdL: 'clipboard', handL: [-2.2, -17.6], lookY: .8, lookX: -.3, brows: 'worried', mouth: say('flat'), tilt: .08 });   // checks the clipboard: nope
    }
    return o;
  }

  // ---------- the stage ----------
  const lamp = .5;
  // focus: in a close-up or two-shot, anyone standing nearer the camera than the subjects steps out of the shot (a cheat)
  function stage(t, camo, blur, focus) {
    const P = persp(camo), A = {}, S = {}, opt = { lamp, fan: true };
    const nearZ = focus ? Math.max(...focus.map(n => posAt(n, t)[1])) + 25 : Infinity;
    const who = CAST.filter(n => present(n, t) && (!focus || focus.includes(n) || posAt(n, t)[1] < nearZ)).map(n => [n, ...posAt(n, t)]);
    who.sort((a, b) => a[2] - b[2]);                                           // sofa view: smaller z is farther
    layer(() => LR.back(P, t, { splitZ: 140, ...opt }), { blur });
    let prev = 140;
    for (const [name, x, z] of who) {
      LR.front(P, t, { splitZ: prev, toZ: z, ...opt }); prev = z;
      if (P.depth(z) < 40) continue;
      const [sx, sy, k] = P.p(x, 0, z), s = UNIT[name] * k, o = pose(name, t);
      if (o.spin) { const cy = sy - 13 * s - (o.jump || 0) * s; X.save(); X.translate(sx, cy); X.rotate(o.spin); X.translate(-sx, -cy); }
      A[name] = RIG[name](sx, sy, s, { ...o, t }); S[name] = s;
      if (o.spin) X.restore();
    }
    LR.front(P, t, { splitZ: prev, ...opt });
    fx(t, A, S);
    return { A, S, P };
  }

  // ---------- overlays: the title, the VS banners, the flub gags, the laughs ----------
  function titleCard(t) {
    const a = TITLE.at, b = typed(TITLE) + 1.6, k = on(t, a, b, .25); if (k <= .01) return;
    const s = backOut(clamp(seg(t, a, a + .4) * 1.2)) * (1 - .2 * (1 - k)), wob = .03 * Math.sin(t * 3);
    overlay(() => {
      X.save(); X.translate(W / 2, 300); X.rotate(-.05 + wob); X.scale(s, s); X.globalAlpha = clamp(k * 2);
      for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU + t * .8;           // a spinning starburst
        shape([[0, 0], [Math.cos(a0) * 640, Math.sin(a0) * 330], [Math.cos(a0 + .2) * 640, Math.sin(a0 + .2) * 330]], { fill: i % 2 ? '#FFD34E' : '#FF8A3D', stroke: null, alpha: .85 }); }
      shape(starPts(0, 0, 470, .62, 14, t * .3), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8 });
      X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      const word = (txt, y, size, col, rot) => { X.save(); X.translate(0, y); X.rotate(rot); X.font = `${size}px ${FONT_SFX}`; X.lineWidth = size * .2; X.strokeStyle = PAL.ink; X.strokeText(txt, 0, 0); X.fillStyle = col; X.fillText(txt, 0, 0); X.restore(); };
      word('SUPER', -95, 92, '#D7262E', -.04 + .05 * Math.sin(t * 9));
      word('TONGUE', 0, 108, '#6A3FB0', .03 * Math.sin(t * 7 + 1));
      word('TWISTERS!', 105, 116, '#2E7D9A', -.03 * Math.sin(t * 8 + 2));
      X.restore();
    });
  }
  function vsBanner(t) {
    for (const R of ROUNDS) {
      const a = R.vs.at + .5, b = Math.min(R.tw.at, typed(R.vs) + 3.4), k = on(t, a, b, .3); if (k <= .01) continue;
      const y = H - 120 + 260 * (1 - backOut(clamp(seg(t, a, a + .4)))) + 260 * easeIn(seg(t, b - .3, b));
      overlay(() => {
        X.save(); X.translate(W / 2, y);
        shape(rectPts(-780 + 10, -64 + 12, 1560, 128), { fill: 'rgba(59,37,48,.3)', stroke: null, smooth: .2 });
        shape(rectPts(-780, -64, 760, 128), { fill: ACCENT[R.from], stroke: PAL.ink, lwPx: 7, smooth: .2 });
        shape(rectPts(20, -64, 760, 128), { fill: ACCENT[R.to], stroke: PAL.ink, lwPx: 7, smooth: .2 });
        X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
        const name = (txt, x) => { const size = txt.length > 12 ? 54 : 66; X.font = `${size}px ${FONT_SFX}`; X.lineWidth = 10; X.strokeStyle = PAL.ink; X.strokeText(txt, x, 6); X.fillStyle = '#FFFDF6'; X.fillText(txt, x, 6); };
        name(NAME[R.from], -400); name(NAME[R.to], 400);
        const p = 1 + .08 * Math.sin(t * 10);
        X.save(); X.scale(p, p); X.rotate(-.1); shape(starPts(0, 0, 105, .6, 10, t), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 6 });
        X.font = `72px ${FONT_SFX}`; X.lineWidth = 10; X.strokeText('VS', 0, 6); X.fillStyle = '#D7262E'; X.fillText('VS', 0, 6); X.restore();
        if (R.n === 5) { X.save(); X.translate(0, -100); X.rotate(.04); shape(rectPts(-210, -36, 420, 72), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 5, smooth: .3 });
          X.font = `46px ${FONT_SFX}`; X.fillStyle = '#6A3FB0'; X.fillText('TWIN VS TWIN!', 0, 4); X.restore(); }
        X.restore();
      });
    }
  }

  // the flub gag: what they actually said, drawn on a card over their head
  const GAG = {
    1: { title: 'BROCCOLI SOCKS', col: '#4DA650', bg: '#EEF8E6', draw(t) {
      X.save(); X.rotate(.15 * Math.sin(t * 3));
      shape([[-40, -40], [30, -40], [30, 30], [70, 50], [70, 85], [-10, 85], [-40, 50]], { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 5, smooth: .4 });
      for (const y of [-20, 0, 20]) line([[-40, y], [30, y]], { stroke: '#D7262E', lwPx: 8 });
      for (let i = 0; i < 4; i++) circle(-30 + i * 20, -58 - 8 * (i % 2), 22, { fill: i % 2 ? '#3E8E41' : '#5DB760', stroke: PAL.ink, lwPx: 4 });
      X.restore(); } },
    2: { title: 'QUACK!', col: '#E0A800', bg: '#FFF8DE', draw(t) {
      const f = Math.sin(t * 14);
      ellipse(0, 30, 80, 50, { fill: '#FFD34E', stroke: PAL.ink, lwPx: 5 });
      shape([[-20, 20], [40, -10 - 25 * f], [50, 30]], { fill: '#F2C14E', stroke: PAL.ink, lwPx: 4, smooth: .3 });
      circle(-55, -30, 36, { fill: '#FFD34E', stroke: PAL.ink, lwPx: 5 });
      shape([[-85, -32], [-125, -20 - 8 * Math.abs(f)], [-85, -18]], { fill: '#FF8A3D', stroke: PAL.ink, lwPx: 4 });
      circle(-62, -40, 6, { fill: PAL.ink, stroke: null }); } },
    3: { title: 'DOLPH-WHEELS', col: '#2E7D9A', bg: '#E6F5FB', draw(t) {
      X.save(); X.rotate(t * 5);
      shape([[-80, 0], [-40, -40], [30, -38], [80, -5], [40, 20], [-30, 25]], { fill: '#6FB7E0', stroke: PAL.ink, lwPx: 5, smooth: .7 });
      shape([[-80, 0], [-110, -25], [-105, 25]], { fill: '#6FB7E0', stroke: PAL.ink, lwPx: 4 });
      shape([[0, -38], [10, -70], [25, -36]], { fill: '#6FB7E0', stroke: PAL.ink, lwPx: 4 });
      circle(50, -14, 5, { fill: PAL.ink, stroke: null }); X.restore();
      for (let i = 0; i < 3; i++) line([[-110 + i * 80, 90], [-80 + i * 80, 80], [-50 + i * 80, 90]], { stroke: '#2E7D9A', lwPx: 5, smooth: true }); } },
    4: { title: 'SIPPY-SIPS', col: '#C08A3E', bg: '#FDF2E3', draw(t) {
      shape(rectPts(-55, -60, 110, 150), { fill: '#E8B04A', stroke: PAL.ink, lwPx: 5, smooth: .15 });
      shape(rectPts(-55, -20, 110, 50), { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 4 });
      X.font = `24px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = PAL.ink; X.fillText('SAFADI', 0, -6); X.fillText('ENERGY', 0, 18);
      line([[20, -60], [35, -120], [70, -130]], { stroke: '#D7262E', lwPx: 8 });
      for (let i = 0; i < 4; i++) { const u = frac(t * .9 + i / 4); circle(80 + 20 * Math.sin(u * 9 + i), -130 - 90 * u, 8 * (1 - u) + 3, { fill: 'rgba(255,255,255,.8)', stroke: PAL.ink, lwPx: 2 }); } } },
    5: { title: 'IT TICKLES!', col: '#3E9C74', bg: '#E8F7EF', draw(t) {
      circle(0, 30, 70, { fill: '#F3C6A8', stroke: PAL.ink, lwPx: 5 });
      line([[-30, 40], [0, 60], [30, 40]], { stroke: PAL.ink, lwPx: 5, smooth: true }); circle(-25, 15, 6, { fill: PAL.ink, stroke: null }); circle(25, 15, 6, { fill: PAL.ink, stroke: null });
      X.save(); X.translate(60 + 15 * Math.sin(t * 12), -40); X.rotate(-.7 + .4 * Math.sin(t * 12));
      shape([[0, -70], [22, -30], [16, 20], [0, 40], [-16, 20], [-22, -30]], { fill: '#E8C6FF', stroke: PAL.ink, lwPx: 4, smooth: .6 }); line([[0, -60], [0, 60]], { stroke: PAL.ink, lwPx: 3 }); X.restore(); } },
    6: { title: 'SEE-SAAAW!', col: '#C2577A', bg: '#FBEAF0', draw(t) {
      const a = .35 * Math.sin(t * 4);
      shape([[0, 20], [-35, 85], [35, 85]], { fill: '#8A5A36', stroke: PAL.ink, lwPx: 5 });
      X.save(); X.translate(0, 18); X.rotate(a); shape(rectPts(-130, -10, 260, 20), { fill: '#D9A066', stroke: PAL.ink, lwPx: 5 });
      circle(-110, -32, 20, { fill: '#C2577A', stroke: PAL.ink, lwPx: 4 }); circle(110, -32, 20, { fill: '#425DA0', stroke: PAL.ink, lwPx: 4 }); X.restore(); } },
    7: { title: '100% PASSED', col: '#2E9D58', bg: '#E8F8EE', draw(t) {
      const p = 1 + .05 * Math.sin(t * 6);
      X.save(); X.scale(p, p); circle(0, 10, 85, { fill: '#5BC27F', stroke: PAL.ink, lwPx: 6 });
      line([[-40, 10], [-10, 45], [45, -30]], { stroke: '#FFFDF6', lwPx: 20 }); X.restore();
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + t; shape(starPts(Math.cos(a) * 120, 10 + Math.sin(a) * 80, 12, .45, 5, t * 2), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 2 }); } } },
    8: { title: 'RULE #RADISH', col: '#D7262E', bg: '#FDECEC', draw(t) {
      X.save(); X.rotate(.12 * Math.sin(t * 3));
      for (const a of [-.5, 0, .5]) shape([[0, -40], [Math.sin(a) * 30 - 14, -110], [Math.sin(a) * 30 + 14, -110]], { fill: '#4DA650', stroke: PAL.ink, lwPx: 4, smooth: .6 });
      shape([[0, -45], [55, -10], [45, 45], [0, 95], [-45, 45], [-55, -10]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 5, smooth: .7 });
      line([[0, 95], [0, 120]], { stroke: PAL.ink, lwPx: 3 });
      circle(-16, 10, 5, { fill: PAL.ink, stroke: null }); circle(16, 10, 5, { fill: PAL.ink, stroke: null }); line([[-14, 30], [0, 38], [14, 30]], { stroke: PAL.ink, lwPx: 4, smooth: true });
      shape([[-30, -50], [-30, -80], [-15, -62], [0, -86], [15, -62], [30, -80], [30, -50]], { fill: '#FFD34E', stroke: PAL.ink, lwPx: 4 }); X.restore(); } },
  };
  function gagCard(n, cx, cy, k, t) {
    if (k <= .01) return;
    const g = GAG[n], w = 340, h = 280, s = backOut(clamp(k * 1.4)) * (1 - .15 * (1 - k));
    overlay(() => {
      X.save(); X.translate(cx, cy + 6 * Math.sin(t * 2)); X.rotate(.04 * Math.sin(t * 1.3)); X.scale(s, s); X.globalAlpha = clamp(k * 2);
      shape(rectPts(-w / 2 + 8, -h / 2 + 10, w, h), { fill: 'rgba(59,37,48,.25)', stroke: null, smooth: .1 });
      shape(rectPts(-w / 2, -h / 2, w, h), { fill: g.bg, stroke: PAL.ink, lwPx: 7, smooth: .1 });
      shape(rectPts(-w / 2, -h / 2, w, 58), { fill: g.col, stroke: PAL.ink, lwPx: 7, smooth: .1 });
      X.font = `${g.title.length > 11 ? 36 : 42}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF6'; X.fillText(g.title, 0, -h / 2 + 32);
      X.translate(0, 28); X.scale(.85, .85); g.draw(t);
      X.restore();
    });
  }
  const LAUGH_TXT = { housam: 'HA HA!', alma: 'HEE HEE!', danny: 'HO HO!', jenna: 'TEE HEE!', safadi: 'HO HO HO!', sami: 'HA HA HA!', sarah: 'LOL!', roudaynah: 'HEE HEE!', dr_g: 'HO HO!' };
  const LAUGH_COL = { housam: '#FFE45C', alma: '#E8C6FF', danny: '#9FE3F5', jenna: '#FFB3D1', safadi: '#FFD39A', sami: '#AEF0CC', sarah: '#FFB3C8', roudaynah: '#D9C6FF', dr_g: '#C9D6FF' };

  function fx(t, A, S) {
    titleCard(t); vsBanner(t);
    for (const R of ROUNDS) {
      const a = typed(R.fl) - .3, b = R.laugh ? Math.min(R.laugh[1] - .4, a + 5) : STUN[1] - .3, V = A[R.to];
      if (V && inW(t, a, b)) gagCard(R.n, clamp(V.top[0] + (posAt(R.to, t)[0] < 0 ? -1 : 1) * 260, 200, W - 200), clamp(V.top[1] - 120, 170, 420), on(t, a, b, .3), t);
      if (V && R.n !== 7) {                                                       // tongue-tied: dizzy stars round their head
        const s = S[R.to], k = on(t, typed(R.fl) - .1, typed(R.fl) + 1.5, .3), cx = V.top[0], cy = V.top[1] + 1 * s;
        if (k > .01) overlay(() => { for (let i = 0; i < 4; i++) { const an = t * 4 + i * TAU / 4;
          shape(starPts(cx + Math.cos(an) * 7 * s, cy + Math.sin(an) * 1.8 * s, 1.1 * s * k, .45, 5, t * 3 + i), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 3 }); } });
      }
      if (R.laugh) CAST.forEach((n, i) => {                                       // everybody's laughter
        const N = A[n]; if (!N || (n === R.to && R.n < 8)) return;
        for (const d of [.25 + .22 * i, 1.9 + .22 * i]) { const at = R.laugh[0] + d; if (at > R.laugh[1] - .5) continue;
          sfx(LAUGH_TXT[n], N.top[0] + (i % 2 ? 40 : -40), N.top[1] - 40, 44, LAUGH_COL[n], t - at, { life: 1.2, rot: i % 2 ? .1 : -.12 }); }
      });
    }
    if (A.danny) { const f2 = ROUNDS[1].fl; [1.5, 1.0, .5].forEach((d, i) => sfx('QUACK!', A.danny.top[0] + (i - 1) * 90, A.danny.top[1] - 30 - 30 * i, 54 + 8 * i, '#FFD34E', t - (typed(f2) - d), { life: .8 })); }
    if (A.jenna) { const f3 = ROUNDS[2].fl; sfx('EEE-EEE!', A.jenna.top[0] - 60, A.jenna.top[1] - 40, 60, '#9FE3F5', t - (typed(f3) - 1.2), { life: 1.4, rot: .12 }); }
    if (A.sami) { const f5 = ROUNDS[4].fl; sfx('TICKLE TICKLE!', A.sami.top[0] + 120, A.sami.top[1] + 40, 46, '#AEF0CC', t - (typed(f5) - .8), { life: 1.6 }); }
    if (A.dr_g) { const f8 = ROUNDS[7].fl; sfx('#1', A.dr_g.handR[0], A.dr_g.handR[1] - 60, 64, '#FFE45C', t - (typed(f8) - 1.2), { life: 1.4 }); }
    if (A.roudaynah) for (const [d, x] of [[.6, -1], [1.3, 1], [2.0, -1]]) sfx('chirp', A.roudaynah.top[0] + x * 300, A.roudaynah.top[1] - 100 + 40 * d, 34, '#CFE8C4', t - (typed(PERFECT) + d), { life: .8, rot: x * .1 });
    if (A.safadi && inW(t, NOEX.at - .3, NOEX.at + 1.4)) sfx('!!!', A.safadi.top[0] - 40, A.safadi.top[1] + 10, 96, '#E03C3C', t - NOEX.at, { life: 1.3, rot: -.15 });
  }

  function bubbles(t, A, S) {
    for (const l of LINES) {
      if (l.silentBubble || l === TITLE || /^ha/.test(l.tag || '')) continue;   // the title card and the laughs speak for themselves
      const age = t - l.at; if (age < 0 || age > 9) continue;
      const c = { size: 48, maxW: 620, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) { const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 60 && a.mouth[0] < W - 60);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * 1.2, maxW: 900, dx: 0, dy: -200 }); continue; } }
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 70 || a.mouth[0] > W - 70) continue;
      const side = posAt(l.speaker, t)[0] < 0 ? 1 : -1, big = l.kind === 'shout';
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, size: big ? 64 : c.size, maxW: big ? 900 : c.maxW, dx: big ? 60 : side * 250, dy: big ? -330 : -210 });
    }
  }

  // ---------- cameras (sofa view): framed on whoever the shot is about ----------
  function frame(names, t, o = {}) {
    const camZ = 820, camY = o.y ?? 140, m = 75;
    const ps = names.map(n => { const [x, z] = posAt(n, t); return { x, d: camZ - z, h: TALL[n] }; });
    const ext = cx => { let l = Infinity, r = -Infinity; for (const p of ps) { const u = (cx - p.x) / p.d; l = Math.min(l, u - m / p.d); r = Math.max(r, u + m / p.d); } return [l, r]; };
    const dm = ps.reduce((a, p) => a + p.d, 0) / ps.length;
    let cx = ps.reduce((a, p) => a + p.x, 0) / ps.length;
    for (let i = 0; i < 5; i++) { const [l, r] = ext(cx); cx -= (l + r) / 2 * dm; }  // centre the group on screen
    const [l, r] = ext(cx), fW = (o.fill ?? .8) * W / (r - l), fH = (o.hFill ?? .5) * H * Math.min(...ps.map(p => p.d / p.h));
    const f = clamp(Math.min(fW, fH), 560, 4200) * (o.zoom ?? 1), kN = f / Math.min(...ps.map(p => p.d));
    const [dx, dy] = drift(t);
    return { x: cx + dx / kN * 2, y: camY, z: camZ, f, hy: (o.feet ?? 1010) - camY * kN + dy, dir: -1 };
  }
  const lerpCam = (a, b, u) => ({ ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u) });
  // everyone in the room; a newcomer eases into the framing as they come through the archway
  function groupCam(t, o = {}) {
    const base = CAST.filter(n => present(n, t) && !walking(n, t)), walker = CAST.find(n => walking(n, t));
    const g = { fill: 1.08, hFill: .5, feet: 1045, ...o }, c = frame(base, t, g);
    return walker ? lerpCam(c, frame([...base, walker], t, g), ease(seg(t, WALK[walker][0], WALK[walker][0] + 1.2))) : c;
  }
  const blurOf = c => clamp((c.f - 900) / 600, 0, 3.2);
  const shoot = (t, c, focus) => { const { A, S } = stage(t, c, blurOf(c), focus); bubbles(t, A, S); };
  const group = o => t => shoot(t, groupCam(t, o));
  const close = name => t => shoot(t, frame([name], t, { hFill: .6, feet: 1060 }), [name]);
  const pair = (a, b) => t => shoot(t, frame([a, b], t, { hFill: .52 }), [a, b]);
  // the flub: a slow push in on the victim, then a little shake as their tongue knots
  const flubShot = R => t => {
    const u = seg(t, R.fl.at, typed(R.fl)), k = R.n === 7 ? 0 : kick(t, typed(R.fl) - .4, 3);
    camBegin(W / 2 + 18 * k * Math.sin(t * 61), H / 2 + 14 * k * Math.cos(t * 53), 1 + .02 * k, .01 * k * Math.sin(t * 37));
    shoot(t, frame([R.to], t, { hFill: .6, feet: 1060, zoom: 1 + .14 * ease(u) }), [R.to]);
    camEnd();
  };
  function opening(t) { const u = ease(seg(t, 0, 2.6)), c = groupCam(t); shoot(t, lerpCam({ ...c, x: 0, y: 175, z: 820, f: 520, hy: 560 }, c, u)); }
  function titleShot(t) {
    const k = kick(t, TITLE.at + .1, 3.5);
    camBegin(W / 2 + 24 * k * Math.sin(t * 61), H / 2 + 18 * k * Math.cos(t * 53), 1 + .04 * k, .012 * k * Math.sin(t * 37));
    shoot(t, groupCam(t)); camEnd();
  }
  function noExplain(t) {
    const k = kick(t, NOEX.at, 3.5);
    camBegin(W / 2 + 22 * k * Math.sin(t * 61), H / 2 + 16 * k * Math.cos(t * 53), 1 + .03 * k, .01 * k * Math.sin(t * 37));
    shoot(t, groupCam(t)); camEnd();
  }

  // ---------- the ending: freeze, card, iris ----------
  function ending(t) {
    const tt = Math.min(t, FREEZE); shoot(tt, groupCam(tt));
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W / 2, 150); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#6A3FB0'; X.fillText('TO BE CONTINUED...', 0, 8);
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.2, END - .8))));
  }

  // ---------- the shot list, built from the dialogue ----------
  // Each round: the pair on the challenge, the victim on the reply, the challenger on the twister, a push in on the flub,
  // the room on the laugh. Anyone else gets a close-up on their line.
  const SHOTS = [[0, opening]];
  for (const l of SPOKEN) {
    const R = ROUNDS.find(R => [R.vs, R.tw, R.fl].includes(l)), at = l.at - .25;
    if (l === TITLE) SHOTS.push([l.at - .4, titleShot]);
    else if (l === NOEX) SHOTS.push([l.at - .15, noExplain]);
    else if (l === OOH) SHOTS.push([at, group()]);
    else if (R && l === R.vs) SHOTS.push([at, pair(R.from, R.to)]);
    else if (R && l === R.tw) SHOTS.push([at, close(R.from)]);
    else if (R && l === R.fl) SHOTS.push([at, flubShot(R)], [typed(l) + .1, group()]);
    else if (/^ha/.test(l.tag || '')) SHOTS.push([l.at - .05, l.tag === 'ha8' ? ending : group()]);
    else if (l.tag === 'notarule') SHOTS.push([at, close('dr_g')]);
    else if (l.tag === 'drg') SHOTS.push([WALK.dr_g[0] - .2, group()], [at, close('dr_g')]);
    else if (l.group) SHOTS.push([at, group()]);
    else SHOTS.push([at, close(l.speaker)]);
  }
  // the laugh before an entrance stays wide until the newcomer speaks; the stunned room stays wide until "…Whoa."
  SHOTS.sort((a, b) => a[0] - b[0]);
  const shots = SHOTS.filter((s, i) => i === 0 || s[0] > SHOTS[i - 1][0] + .05);

  scene({ duration: END, fps: 24, bpm: 124, shots });                          // id, title, dialogue, music: see asset.js
})();
