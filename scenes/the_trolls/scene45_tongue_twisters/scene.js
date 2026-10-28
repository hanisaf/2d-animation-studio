// Scene 45: "Tongue Twisters". The Trolls, episode one. In the living room Housam tells Danny and Jenna what he learned at
// school today (ecology, the Pythagorean theorem, the economy, the trumpet), and Alma repeats every word of it. He loses it:
// "ALMA! STOP REPEATING ME!" The kids crack up. Professor Safadi walks in through the archway, asks Alma to stop, and she
// repeats him too. Then his idea bulb pops: "Repeat after me." Six tongue twisters later Alma's tongue is in a knot. To be continued.
// Every shot is a pure function of t.
(() => {
  const LR = LOCATIONS.living_room, LINES = ASSETS.scene.scene45_tongue_twisters.dialogue;
  const ACCENT = { housam: '#425DA0', alma: '#994EC4', danny: '#2E7D9A', jenna: '#D0508E', safadi: '#C08A3E' };
  const UNIT = { housam: HOUSAM_UNIT, alma: ALMA_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT, safadi: SAFADI_UNIT };
  const RIG = { housam, alma, danny, jenna, safadi };
  const HEADW = { housam: 5.6, alma: 6.6, danny: 5.4, jenna: 4.6, safadi: 7.6 };
  // per kid, in local units: where the mouth is (for hands at the mouth), so the other gestures scale with each rig
  const MOUTHY = { housam: -21.2, alma: -11.9, danny: -18.4, jenna: -18.2 };

  // ---------- timing (from the tagged dialogue lines) ----------
  const LINE = tag => LINES.find(l => l.tag === tag), AT = tag => LINE(tag).at;
  const lineDur = l => .25 + l.text.replace(/\*/g, '').length / l.cps + l.hold;
  const typed = l => l.at + .2 + l.text.replace(/\*/g, '').length / l.cps;
  const next = l => LINES[LINES.indexOf(l) + 1];
  const TOOT = AT('toot'), TOOTS = [TOOT, TOOT + .9, TOOT + 1.7], HORN = [57.4, 65.8], PLAY = [58.4, 62.0];
  const YELL = AT('yell'), LAUGH = [70.0, 73.0], WALK = [71.4, 74.4], BULB = 92.6, IDEA = AT('idea');
  const TW = ['tw1', 'tw2', 'tw3', 'tw4', 'tw5', 'tw6'].map(LINE), FLUB = TW.map(next);
  const FREEZE = 160.4, END = 166.0;
  // the subject cards over Housam's head while he lists his classes
  const CARDS = [['ecology', 10.4, 24.9], ['math', 25.6, 38.9], ['economy', 39.7, 55.3], ['band', 56.1, 65.6]];

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => l.speaker === who && t > l.at + .2 && t < typed(l));
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];
  // a kid's lines and Alma's copy of them: the one Alma is copying right now, if any
  const almaLine = t => LINES.find(l => l.speaker === 'alma' && inW(t, l.at, l.at + lineDur(l)));
  const flubAt = t => FLUB.findIndex(l => inW(t, l.at, l.at + lineDur(l) + .2));
  // after each flub the room laughs until the professor's next twister
  const laughing = t => inW(t, LAUGH[0], LAUGH[1] + .6) || FLUB.some((l, i) => inW(t, typed(l) + .1, TW[i + 1] ? TW[i + 1].at - .1 : FREEZE));
  // the copycat giggles in part 1: a short snicker after each of Alma's repeats
  const snicker = t => LINES.some(l => l.speaker === 'alma' && l.at < 60 && inW(t, typed(l) - .3, typed(l) + 1.1));

  // ---------- blocking (sofa view: +X is screen-left) ----------
  const POS = { danny: [250, 205], jenna: [-250, 205], housam: [95, 445], alma: [-95, 455] };
  const SF_FROM = [440, 270], SF_TO = [270, 470];
  const sfWalk = t => ease(seg(t, WALK[0], WALK[1]));
  const sfPos = t => { const u = sfWalk(t); return [lerp(SF_FROM[0], SF_TO[0], u), lerp(SF_FROM[1], SF_TO[1], u)]; };
  // screen side of each speaker in the main two-shot (−1 screen-left … 1 screen-right): who looks where
  const SIDE = { safadi: -.8, danny: -.4, housam: -.25, alma: .25, jenna: .4 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  const focusOf = t => { const l = LINES.find(l => !l.silentBubble && t > l.at && t < l.at + lineDur(l)); return l ? l.speaker : null; };

  // ---------- Housam: proud, then annoyed, then furious, then delighted ----------
  function housamPose(t) {
    const talk = speaking('housam', t), say = m => talk ? lipFlap(t, true, m) : m, my = MOUTHY.housam;
    const fed = clamp((t - 8) / 50);                                            // his patience running out over part 1
    const o = { mouth: say('smile'), brows: 'up', eyes: 'open', lookX: lookAt('housam', 'danny') * .6, lookY: .05,
      handL: [-3.6, -10.6], handR: [3.6, -10.6], handPoseL: 'open', handPoseR: 'open', blush: .3 + .7 * fed };
    const set = p => Object.assign(o, p);
    const f = focusOf(t); if (f && f !== 'housam') set({ lookX: lookAt('housam', f) });
    if (talk && t < 58) {                                                       // telling his news: one gesture per line
      const g = Math.floor(LINES.filter(l => l.speaker === 'housam' && l.at <= t).length) % 3, w = Math.sin(t * 7) * .4;
      set([{ handR: [4.8, -16.5 + w], handPoseR: 'palm' }, { handR: [3.8, -22 + w], handPoseR: 'point' }, { handL: [-4.6, -15.5 + w], handR: [4.6, -15.5 - w], handPoseL: 'palm', handPoseR: 'palm' }][g]);
      set({ brows: fed > .55 ? 'focused' : 'up', lookX: lookAt('housam', 'danny') });
    }
    const a = almaLine(t);                                                      // Alma copies him: a slow, deadly side-eye
    if (a && t < 66) set({ lookX: .85, lookY: .1, mouth: fed > .5 ? 'frown' : 'flat', brows: fed > .3 ? 'worried' : 'normal', eyes: inW(t, a.at, a.at + .25) ? 'closed' : 'open' });
    if (a && t < 66 && fed > .6) set({ handL: [-1.6, -11.5], handR: [1.6, -11.5], handPoseL: 'fist', handPoseR: 'fist', dy: .1 * Math.sin(t * 30) });   // fists, shaking
    // the trumpet
    if (inW(t, HORN[0], HORN[1])) set({ handR: [3.2, -12.2], handPoseR: 'fist' });
    if (inW(t, PLAY[0], PLAY[1])) {
      const blow = TOOTS.reduce((m, at) => Math.max(m, on(t, at, at + .7, .08)), 0);
      set({ handL: [-4.2, my + .7], handR: [-2.0, my + .5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'closed', brows: 'up', mouth: 'o', lookX: -.4, lean: -.05 - .04 * blow, dy: -.2 * blow, blush: .5 + .5 * blow });
    }
    if (inW(t, 62.6, 66.0)) set({ lookX: .85, eyes: 'wide', brows: 'worried', mouth: 'wobble', blush: 1 });
    // "ALMA! STOP REPEATING ME!!!"
    if (inW(t, YELL - .5, YELL + 3.4)) {
      const k = kick(t, YELL, 4);
      set({ handL: [-5.2, -24], handR: [5.2, -24], handPoseL: 'fist', handPoseR: 'fist', eyes: t < YELL ? 'squeeze' : 'squeeze', brows: 'focused',
        mouth: talk ? lipFlap(t, true, 'open', ['open', 'open', 'grin', 'open']) : 'open', jump: t < YELL ? 0 : 1.2 * k, sq: t < YELL ? -.08 * seg(t, YELL - .5, YELL) : .1 * k, lookX: .7, blush: 1, dy: t < YELL ? .4 * seg(t, YELL - .5, YELL) : 0 });
    }
    if (inW(t, YELL + 3.4, WALK[0] + 1)) set({ handL: [-1.8, -12.5], handR: [1.8, -12.5], handPoseL: 'fist', handPoseR: 'fist', mouth: 'frown', brows: 'focused', eyes: 'open', lookX: .8, blush: .9 });   // arms crossed, fuming
    // the professor arrives
    if (inW(t, WALK[0] + 1, 76.5)) set({ lookX: -.85, eyes: 'wide', brows: 'up', mouth: 'o', handL: [-3.6, -10.6], handR: [3.6, -10.6], handPoseL: 'open', handPoseR: 'open' });
    if (inW(t, 76.6, 80)) set({ handR: [5.0, -16], handPoseR: 'point', lookX: -.6, brows: 'worried' });   // pointing at her
    if (inW(t, 83.7, 87.6)) set({ handL: [-5.0, -16.5], handR: [5.0, -16.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: 'frown', lookX: -.85, emote: '!', emoteK: on(t, 84.0, 86.6, .2) });   // "See?!"
    if (inW(t, 90.1, IDEA)) set({ lookX: -.85, mouth: 'flat', brows: 'worried', handL: [-1.8, -12.5], handR: [1.8, -12.5], handPoseL: 'fist', handPoseR: 'fist' });
    if (t > IDEA) { set({ lookX: focusOf(t) === 'alma' ? .7 : -.7, mouth: 'smirk', brows: 'up', handL: [-1.8, -12.5], handR: [1.8, -12.5], handPoseL: 'fist', handPoseR: 'fist', blush: .3 });
      if (inW(t, TW[0].at, TW[0].at + 1)) set({ eyes: 'happy', mouth: 'grin' }); }
    if (t > 90 && laughing(t)) { const b = Math.abs(Math.sin(t * 11)); set({ handL: [-2.0, -13.5], handR: [2.0, -13.5], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', mouth: 'open', brows: 'up', dy: -.25 * b, tilt: .04 * Math.sin(t * 5.5) }); }
    return o;
  }

  // ---------- Alma: the copycat ----------
  function almaPose(t) {
    const talk = speaking('alma', t), say = m => talk ? lipFlap(t, true, m) : m, my = MOUTHY.alma;
    const o = { mouth: say('smirk'), brows: 'normal', eyes: 'open', lookX: -.7, lookY: 0, blush: .8,
      handL: [-2.2, -6.0], handR: [2.2, -6.0], handPoseL: 'open', handPoseR: 'open', hairSwing: .25 * Math.sin(t * 1.4) };
    const set = p => Object.assign(o, p);
    const f = focusOf(t); if (f && f !== 'alma') set({ lookX: lookAt('alma', f) });
    if (!talk && t < 66 && !inW(t, 59, 66)) set({ eyes: Math.sin(t * .9) > .6 ? 'happy' : 'open', lookX: -.6 });   // all innocence
    const a = almaLine(t);
    if (a && talk && a.at < 66) {                                               // copying his gesture, bigger, with a sway
      const w = Math.sin(t * 7) * .5, sw = Math.sin(t * 5);
      set({ handR: [4.6, -13.6 + w], handPoseR: 'palm', handL: [-3.8, -10 - w], handPoseL: 'open', brows: 'up', eyes: 'happy', lookX: -.85, tilt: .06 * sw, hairSwing: .6 * sw });
    }
    // the air trumpet
    if (inW(t, 62.4, 65.8)) {
      const blow = [62.9, 63.6, 64.2].reduce((m, at) => Math.max(m, on(t, at, at + .6, .08)), 0);
      set({ handL: [1.4, my + .4], handR: [3.4, my + .6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'closed', brows: 'up', mouth: talk ? say('O') : 'O', lean: .05 + .04 * blow, dy: -.2 * blow, blush: 1, lookX: .4 });
    }
    // yelled at: a flinch, then not sorry at all
    if (inW(t, YELL, YELL + 1.0)) set({ eyes: 'squeeze', mouth: 'o', brows: 'up', jump: .4 * kick(t, YELL + .05, 6), hairSwing: .9, lookX: -.8, handL: [-3, -10], handR: [3, -10] });
    if (inW(t, YELL + 1.0, WALK[0] + 1.2)) set({ eyes: 'happy', mouth: 'smirk', brows: 'up', lookX: -.7, handL: [-1.2, -7.2], handR: [1.2, -7.2], handPoseL: 'fist', handPoseR: 'fist' });   // hands behind her back
    // copying the professor
    if (a && talk && inW(a.at, 83, 99)) {
      if (a.text.includes('Hmm')) set({ handR: [1.6, my + 1.6], handPoseR: 'fist', brows: 'worried', eyes: 'open', lookX: -.85, mouth: say('flat') });   // hand on chin, like him
      else { const w = Math.sin(t * 7) * .5; set({ handR: [4.8, -13.4 + w], handPoseR: 'point', brows: 'up', eyes: 'open', lookX: -.85, tilt: -.05 }); }
    }
    if (inW(t, 87.9, 90.0)) set({ lookX: -.85, eyes: 'happy', mouth: 'smirk' });
    // tongue twisters: she listens, chin up and smug, then gabbles
    if (t > IDEA - .6 && !talk) set({ lookX: -.85, eyes: 'open', mouth: 'smirk', brows: 'up', handL: [-1.2, -7.2], handR: [1.2, -7.2], handPoseL: 'fist', handPoseR: 'fist' });
    const fi = flubAt(t);
    if (fi >= 0) {
      const l = FLUB[fi], u = seg(t, l.at, typed(l)), wob = Math.sin(t * 17), tangle = (fi + 1) / 6;
      if (talk) set({ eyes: Math.sin(t * 6) > 0 ? 'squeeze' : 'wide', brows: 'worried', mouth: say('wobble'), tilt: (.05 + .06 * tangle) * wob, hairSwing: .5 * wob,
        handL: [-4.6, -9 - 2 * u], handR: [4.6, -9 - 2 * u], handPoseL: 'open', handPoseR: 'open', lookX: .2 * wob });
      else set({ eyes: 'wide', brows: 'worried', mouth: fi === 5 ? 'wobble' : 'o', emote: fi === 5 ? 'sweat' : '?', emoteK: on(t, typed(l), typed(l) + 1.6, .2), lookX: .1 });
      if (fi === 5 && t > typed(l)) set({ eyes: 'squeeze', rot: .06 * Math.sin(t * 4), tilt: .1 * Math.sin(t * 3) });   // tongue-tied and dizzy
    }
    if (t > FLUB[5].at + lineDur(FLUB[5])) set({ eyes: 'squeeze', mouth: 'wobble', brows: 'worried', rot: .06 * Math.sin(t * 4), tilt: .1 * Math.sin(t * 3) });
    return o;
  }

  // ---------- Danny and Jenna: the audience ----------
  function kidPose(name, t) {
    const talk = speaking(name, t), ph = name === 'danny' ? 0 : 1.7, my = MOUTHY[name];
    const o = { mouth: 'smile', brows: 'normal', eyes: 'open', lookX: lookAt(name, 'housam'), lookY: .05, handL: [-2.6, -10.2], handR: [2.6, -10.2], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    const f = focusOf(t); if (f && f !== name) set({ lookX: lookAt(name, f) });
    if (snicker(t)) set({ handL: [-.8, my + 1.4], handR: [.8, my + 1.4], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', brows: 'up', dy: -.12 * Math.abs(Math.sin(t * 12 + ph)) });   // hands over mouths
    if (inW(t, 59.0, 62.4)) set({ eyes: 'wide', mouth: 'grin', brows: 'up', lookX: lookAt(name, 'housam') });
    if (inW(t, YELL, YELL + 1.2)) set({ eyes: 'wide', mouth: 'o', brows: 'up', jump: .5 * kick(t, YELL + .05, 6) });
    if (laughing(t)) {
      const b = Math.abs(Math.sin(t * 12 + ph)), big = inW(t, LAUGH[0], LAUGH[1] + .6) || t > FLUB[5].at;
      set({ handL: [-2.2, my * .62], handR: [2.2, my * .62], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', brows: 'up', mouth: talk ? lipFlap(t, true, 'open') : 'open',
        dy: -(big ? .5 : .3) * b, tilt: (big ? .1 : .05) * Math.sin(t * 6 + ph), lean: (big ? -.06 : 0) * Math.sin(t * 3 + ph) });
    }
    if (inW(t, WALK[0], 76.5)) set({ lookX: -.85, eyes: 'wide', mouth: 'o', brows: 'up' });
    return o;
  }

  // ---------- Professor Safadi ----------
  function safadiPose(t) {
    const talk = speaking('safadi', t), say = m => talk ? lipFlap(t, true, m) : m;
    const o = { mouth: say('smile'), brows: 'normal', eyes: 'open', lookX: .6, lookY: .1, handL: [-4.6, -11.5], handR: [4.6, -11.5], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    const f = focusOf(t); if (f && f !== 'safadi') set({ lookX: lookAt('safadi', f) });
    if (inW(t, WALK[0], WALK[1])) set({ ...safadiWalk(sfWalk(t) * 280 / 58, 1 - seg(t, WALK[1] - .4, WALK[1])), turn: .25, lookX: .6, brows: 'worried', mouth: say('o') });
    if (talk) set({ brows: 'up', handR: [5.0, -18.5], handPoseR: 'palm', lookY: .1 });
    if (inW(t, 73.8, 76.6)) set({ handL: [-5.6, -13], handR: [5.6, -13], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', lookX: lookAt('safadi', 'housam') });   // "Why are you yelling?"
    if (inW(t, 80.1, 83.6)) set({ handR: [6.0, -17], handPoseR: 'palm', lookX: lookAt('safadi', 'alma'), brows: 'up' });                            // "Alma, please stop…"
    if (inW(t, 83.7, 87.8)) set({ eyes: 'wide', brows: 'up', mouth: 'o', handR: [4.6, -11.5], handPoseR: 'open', lookX: lookAt('safadi', 'alma'), emote: '!', emoteK: on(t, 84.2, 86.2, .2) });
    if (inW(t, 87.8, BULB)) set({ handR: [1.0, -19.2], handPoseR: 'fist', brows: 'quizzical', eyes: 'narrow', mouth: say('flat'), lookX: lookAt('safadi', 'alma'), lookY: .2 });   // hand on chin
    if (inW(t, 90.1, BULB)) set({ eyes: 'narrow', brows: 'focused' });
    // the idea
    if (inW(t, BULB, IDEA + 3.0)) set({ bulb: ease(seg(t, BULB, BULB + .25)) * (1 - seg(t, IDEA + 2.6, IDEA + 3.0)), eyes: t < BULB + .5 ? 'wide' : 'happy', brows: 'up', mouth: say('smirk'),
      handR: [4.4, -22], handPoseR: 'point', jump: .3 * kick(t, BULB, 6) });
    // conducting the twisters, then a smug little smile while she flubs
    const tw = TW.find(l => inW(t, l.at, l.at + lineDur(l)));
    if (tw && talk) { const c = Math.sin(t * 9); set({ handR: [5.2 + .6 * c, -19 + .8 * Math.abs(c)], handPoseR: 'point', eyes: 'open', brows: 'up', mouth: say('smile'), lookX: lookAt('safadi', 'alma'), tilt: .03 * c }); }
    if (t > TW[0].at && !talk) set({ mouth: 'smirk', eyes: 'happy', brows: 'up', lookX: lookAt('safadi', 'alma'), handL: [-2.0, -13.5], handR: [2.0, -13.5], handPoseL: 'open', handPoseR: 'open' });
    if (t > TW[0].at && laughing(t)) set({ mouth: 'grin', eyes: 'happy', handR: [1.2, -20.6], handPoseR: 'open', dy: -.12 * Math.abs(Math.sin(t * 9)) });   // a chuckle behind his hand
    return o;
  }

  // ---------- props: the subject cards and the trumpet (screen space) ----------
  const CARD_STYLE = {
    ecology: { title: 'SCIENCE', col: '#4DA650', bg: '#EEF8E6' }, math: { title: 'MATH', col: '#4166B8', bg: '#EAF0FB' },
    economy: { title: 'SOCIAL STUDIES', col: '#C0732A', bg: '#FDF2E3' }, band: { title: 'BAND', col: '#A3294B', bg: '#FBEAF0' },
  };
  function ttCard(kind, cx, cy, k, t) {
    if (k <= .01) return;
    const st = CARD_STYLE[kind], w = 380, h = 290, s = backOut(clamp(k * 1.4)) * (1 - .15 * (1 - k));
    overlay(() => {
      X.save(); X.translate(cx, cy + 6 * Math.sin(t * 2)); X.rotate(.03 * Math.sin(t * 1.3)); X.scale(s, s); X.globalAlpha = clamp(k * 2);
      shape(rectPts(-w / 2 + 8, -h / 2 + 10, w, h), { fill: 'rgba(59,37,48,.25)', stroke: null, smooth: .08 });
      shape(rectPts(-w / 2, -h / 2, w, h), { fill: st.bg, stroke: PAL.ink, lwPx: 7, smooth: .08 });
      shape(rectPts(-w / 2, -h / 2, w, 62), { fill: st.col, stroke: PAL.ink, lwPx: 7, smooth: .08 });
      X.font = `${kind === 'economy' ? 40 : 46}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF6'; X.fillText(st.title, 0, -h / 2 + 34);
      X.translate(0, 32); ttIcon[kind](t);
      X.restore();
    });
  }
  const ttIcon = {
    ecology(t) {                                                                // sun, tree, bunny and flower, in a circle of arrows
      const r = 88, spin = t * .6;
      for (let i = 0; i < 3; i++) { const a0 = spin + i * TAU / 3, pts = []; for (let j = 0; j <= 10; j++) { const a = a0 + j * .17; pts.push([Math.cos(a) * r, Math.sin(a) * r * .72]); }
        line(pts, { stroke: '#7BB661', lwPx: 7, smooth: true }); const e = pts[10], d = [e[0] - pts[9][0], e[1] - pts[9][1]], n = Math.hypot(...d), u = [d[0] / n, d[1] / n];
        shape([[e[0] + u[0] * 14, e[1] + u[1] * 14], [e[0] - u[1] * 11, e[1] + u[0] * 11], [e[0] + u[1] * 11, e[1] - u[0] * 11]], { fill: '#7BB661', stroke: null }); }
      circle(48, -46, 20, { fill: '#FFD34E', stroke: PAL.ink, lwPx: 4 });
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t; line([[48 + Math.cos(a) * 26, -46 + Math.sin(a) * 26], [48 + Math.cos(a) * 34, -46 + Math.sin(a) * 34]], { stroke: '#F0A818', lwPx: 4 }); }
      shape(rectPts(-38, 0, 14, 40), { fill: '#8A5A36', stroke: PAL.ink, lwPx: 4 });
      circle(-31, -14, 32, { fill: '#4DA650', stroke: PAL.ink, lwPx: 4 });
      ellipse(30, 30, 18, 13, { fill: '#F2EEE8', stroke: PAL.ink, lwPx: 4 }); circle(44, 18, 10, { fill: '#F2EEE8', stroke: PAL.ink, lwPx: 4 });
      ellipse(42, 0, 4, 11, { fill: '#F2EEE8', stroke: PAL.ink, lwPx: 3, rot: -.2 }); ellipse(50, 2, 4, 11, { fill: '#F2EEE8', stroke: PAL.ink, lwPx: 3, rot: .25 });
      circle(47, 17, 2, { fill: PAL.ink, stroke: null });
      line([[-2, 44], [-2, 22]], { stroke: '#4DA650', lwPx: 4 }); shape(starPts(-2, 18, 10, .5, 5, t), { fill: '#F27A9A', stroke: PAL.ink, lwPx: 3 });
    },
    math(t) {                                                                   // a right triangle with its squares, and the formula
      const A = [-70, 30], B = [40, 30], C = [-70, -50], k = clamp(.5 + .5 * Math.sin(t * 2));
      shape([A, B, [40, 80], [-70, 80]], { fill: 'rgba(65,102,184,.25)', stroke: '#4166B8', lwPx: 3 });
      shape([A, C, [-150, -50], [-150, 30]], { fill: 'rgba(77,166,80,.25)', stroke: '#4DA650', lwPx: 3 });
      shape([A, B, C], { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 5 });
      shape(rectPts(-70, 18, 12, 12), { fill: null, stroke: PAL.ink, lwPx: 3 });
      X.font = `34px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.fillStyle = '#4166B8'; X.fillText('b', -15, 56); X.fillStyle = '#4DA650'; X.fillText('a', -110, -10); X.fillStyle = '#A3294B'; X.fillText('c', 4, -22);
      X.save(); X.translate(110, -6); X.scale(1 + .06 * k, 1 + .06 * k); X.font = `40px ${FONT_SFX}`; X.fillStyle = PAL.ink;
      X.fillText('a²+b²', 0, -22); X.fillText('=c²', 0, 24); X.restore();
    },
    economy(t) {                                                                // one rare gem vs a pile of rocks: the price arrow climbs
      for (let i = 0; i < 7; i++) { const x = -150 + (i % 4) * 26 + (i > 3 ? 13 : 0), y = i > 3 ? 18 : 44; ellipse(x, y, 15, 11, { fill: '#9B9690', stroke: PAL.ink, lwPx: 3 }); }
      X.font = `26px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = PAL.ink; X.fillText('$1', -110, -20);
      shape([[0, 10], [20, -12], [44, -12], [64, 10], [32, 46]], { fill: '#6FD3E8', stroke: PAL.ink, lwPx: 4 });
      line([[0, 10], [64, 10]], { stroke: PAL.ink, lwPx: 3 }); shape(starPts(20, -4, 6, .4, 4, t * 2), { fill: '#FFFDF6', stroke: null });
      const u = (t * .5) % 1, top = lerp(40, -70, ease(u));
      line([[110, 50], [110, top]], { stroke: '#D7262E', lwPx: 9 }); shape([[110, top - 22], [92, top + 2], [128, top + 2]], { fill: '#D7262E', stroke: PAL.ink, lwPx: 3 });
      X.fillStyle = '#C0732A'; X.font = `32px ${FONT_SFX}`; X.fillText('$$$', 32, -44);
    },
    band(t) {                                                                   // a trumpet and bouncing notes
      X.save(); X.translate(-30, 10); X.scale(13, 13); ttTrumpetShape(.32); X.restore();
      for (let i = 0; i < 3; i++) { const x = 60 + i * 34, y = -30 + 14 * Math.sin(t * 5 + i * 1.8) - i * 10;
        line([[x + 8, y], [x + 8, y - 34]], { stroke: PAL.plum, lwPx: 5 }); ellipse(x, y, 10, 8, { fill: PAL.plum, stroke: null, rot: -.4 }); }
    },
  };
  // a trumpet drawn in local units: mouthpiece at the origin, bell out along −x
  function ttTrumpetShape(lw) {
    const gold = '#F2C14E', dk = '#B8860B';
    shape([[-6.6, -.25], [-8.6, -1.9], [-8.9, 1.9], [-6.6, .25]], { fill: gold, stroke: PAL.ink, lw });            // the bell
    ellipse(-8.75, 0, .4, 1.95, { fill: dk, stroke: PAL.ink, lw });
    shape([[-6.8, -.22], [-.6, -.22], [-.6, .22], [-6.8, .22]], { fill: gold, stroke: PAL.ink, lw });              // the lead pipe
    shape([[-5.4, .2], [-5.4, 1.4], [-1.6, 1.4], [-1.6, .2]], { fill: null, stroke: dk, lw: lw * 2.2 });           // the loop under the valves
    for (const x of [-4.4, -3.5, -2.6]) { shape(rectPts(x - .3, -1.05, .6, 1.6), { fill: gold, stroke: PAL.ink, lw }); circle(x, -1.25, .32, { fill: '#FFF2C4', stroke: PAL.ink, lw }); }
    shape([[-.7, -.32], [0, -.42], [0, .42], [-.7, .32]], { fill: '#D9D9D9', stroke: PAL.ink, lw });               // the mouthpiece
  }
  function ttTrumpet(x, y, s, ang, flip = 1) {
    X.save(); X.translate(x, y); X.rotate(ang); X.scale(s * flip, s); ttTrumpetShape(clamp(s * .1, 1.2, 4) / s); X.restore();
  }

  // ---------- the stage ----------
  const lamp = .5;
  function stage(t, camo, blur) {
    const P = persp(camo), A = {}, S = {}, opt = { lamp, fan: true };
    const who = [['danny', ...POS.danny], ['jenna', ...POS.jenna], ['housam', ...POS.housam], ['alma', ...POS.alma]];
    if (t > WALK[0]) who.push(['safadi', ...sfPos(t)]);
    who.sort((a, b) => a[2] - b[2]);                                           // sofa view: smaller z is farther
    layer(() => LR.back(P, t, { splitZ: 140, ...opt }), { blur });
    let prev = 140;
    for (const [name, x, z] of who) {
      LR.front(P, t, { splitZ: prev, toZ: z, ...opt }); prev = z;
      if (P.depth(z) < 40) continue;
      const [sx, sy, k] = P.p(x, 0, z), s = UNIT[name] * k;
      const pose = name === 'housam' ? housamPose(t) : name === 'alma' ? almaPose(t) : name === 'safadi' ? safadiPose(t) : kidPose(name, t);
      A[name] = RIG[name](sx, sy, s, { ...pose, t }); S[name] = s;
      if (name === 'housam' && inW(t, HORN[0], HORN[1])) housamHorn(t, A.housam, s);
    }
    LR.front(P, t, { splitZ: prev, ...opt });
    fx(t, A, S);
    return { A, S, P };
  }
  // the trumpet: out of nowhere (it pops in), up to his lips to play, then down at his side
  function housamHorn(t, H, s) {
    const up = on(t, PLAY[0], PLAY[1], .35), pop = backOut(seg(t, HORN[0], HORN[0] + .3)) * (1 - easeIn(seg(t, HORN[1] - .25, HORN[1])));
    if (pop <= .01) return;
    const side = [H.handR[0] + 3.4 * s, H.handR[1] + .2 * s], lips = [H.mouth[0] - .2 * s, H.mouth[1] + .2 * s];
    const x = lerp(side[0], lips[0], up), y = lerp(side[1], lips[1], up), ang = lerp(-1.25, .12, up), flip = up > .5 ? 1 : -1;
    ttTrumpet(x, y, s * pop, flip > 0 ? ang : -ang, flip);
  }

  // sound effects, notes, stars and the subject cards (screen space, above everything)
  function fx(t, A, S) {
    const H = A.housam, AL = A.alma;
    if (H && AL) for (const [kind, a, b] of CARDS) {
      if (!inW(t, a, b) || inW(t, YELL - .6, b)) continue;
      const k = ease(seg(t, a, a + .35)) * (1 - ease(seg(t, b - .3, b)));
      ttCard(kind, clamp((H.top[0] + AL.top[0]) / 2, 260, W - 260), clamp(Math.min(H.top[1], AL.top[1]) - 230, 175, 420), k, t);
    }
    if (H) TOOTS.forEach((at, i) => {                                            // the real trumpet: TOOT! TOOT! TOOOO!
      const bell = [H.mouth[0] - 9 * S.housam, H.mouth[1] + .6 * S.housam];
      sfx(i < 2 ? 'TOOT!' : 'TOOOO!', bell[0] - 60, bell[1] - 60 - 30 * i, 64 + 16 * i, '#F2C14E', t - at, { life: i < 2 ? .8 : 1.4 });
      for (let j = 0; j < 2; j++) { const age = t - at - j * .2; if (age < 0 || age > 1.2) continue;
        const nx = bell[0] - 40 - 140 * age, ny = bell[1] - 80 * age + 18 * Math.sin(age * 9 + j);
        overlay(() => { X.save(); X.globalAlpha = 1 - seg(age, .8, 1.2); line([[nx + 9, ny], [nx + 9, ny - 36]], { stroke: PAL.plum, lwPx: 5 }); ellipse(nx, ny, 11, 8, { fill: PAL.plum, stroke: null, rot: -.4 }); X.restore(); }); }
    });
    if (AL) [62.9, 63.6, 64.2].forEach((at, i) => sfx(i < 2 ? 'toot!' : 'tooo!', AL.mouth[0] + 7 * S.alma, AL.mouth[1] - 60 - 26 * i, 48 + 10 * i, '#E8C6FF', t - at, { life: .8 }));
    if (H && inW(t, YELL - .3, YELL + 1.4)) sfx('!!!', H.top[0] - 9 * S.housam, H.top[1] + 4 * S.housam, 110, '#E03C3C', t - YELL, { life: 1.3, rot: -.15 });
    if (A.danny && A.jenna) {                                                   // the kids' laughter
      const laughs = [LAUGH[0] + .2, ...FLUB.map(l => typed(l) + .3)];
      laughs.forEach((at, i) => { sfx('HA HA!', A.danny.top[0] - 30, A.danny.top[1] - 50, 52, '#FFE45C', t - at, { life: 1.2, rot: -.12 });
        sfx('HEE HEE!', A.jenna.top[0] + 30, A.jenna.top[1] - 50, 48, '#FFB3D1', t - at - .25, { life: 1.2, rot: .1 }); });
    }
    if (AL && t > FLUB[5].at + 1.6) {                                           // tongue-tied: dizzy stars round her head
      const k = seg(t, FLUB[5].at + 1.6, FLUB[5].at + 2.2), s = S.alma, cx = AL.top[0], cy = AL.top[1] + 1 * s;
      overlay(() => { for (let i = 0; i < 4; i++) { const a = t * 4 + i * TAU / 4, x = cx + Math.cos(a) * 7 * s, y = cy + Math.sin(a) * 1.8 * s;
        shape(starPts(x, y, 1.1 * s * k, .45, 5, t * 3 + i), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 3 }); } });
    }
  }

  function bubbles(t, A, S) {
    for (const l of LINES) {
      if (l.silentBubble) continue; const age = t - l.at; if (age < 0 || age > 8) continue;
      const c = { size: 48, maxW: 600, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) { const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 60 && a.mouth[0] < W - 60);
        if (ms.length > 1) { const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * 1.15, dx: 0, dy: -170 }); continue; } }
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 70 || a.mouth[0] > W - 70) continue;
      const side = l.speaker === 'alma' || l.speaker === 'jenna' ? 1 : -1, big = l.kind === 'shout';
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, size: big ? 64 : c.size, maxW: big ? 900 : c.maxW, dx: big ? 60 : side * 250, dy: big ? -330 : -210 });
    }
  }

  // ---------- cameras (sofa view) ----------
  const cam = (x, y, z, hy, f) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: -1 }; };
  const C_WIDE = cam(0, 175, 960, 560, 640);
  const C_GROUP = cam(0, 150, 820, 650, 900);                                   // everyone
  const C_PAIR = cam(0, 135, 820, 590, 1150);                                   // Housam and Alma, the kids behind
  const C_HOUSAM = cam(40, 130, 820, 640, 1300);                                // close on Housam
  const C_ALMA = cam(-95, 120, 820, 575, 1500);                                 // close on Alma
  const C_TRIO = cam(88, 140, 820, 600, 1050);                                  // the professor, Housam and Alma
  const C_SAFADI = cam(250, 150, 820, 470, 1300);                               // close on the professor
  const shot = (camFn, blur) => t => { const { A, S } = stage(t, camFn(t), blur); bubbles(t, A, S); };
  const group = shot(C_GROUP, .6), pair = shot(C_PAIR, 1.2), closeAlma = shot(C_ALMA, 2.4), trio = shot(C_TRIO, 1.0), closeSafadi = shot(C_SAFADI, 2.2);
  function opening(t) { const u = ease(seg(t, 0, 2.8)), a = C_WIDE(t), b = C_GROUP(t);
    const { A, S } = stage(t, { ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), hy: lerp(a.hy, b.hy, u), f: lerp(a.f, b.f, u) }, .4); bubbles(t, A, S); }
  // the yell: a fast push in on Housam and a shake
  function yell(t) {
    const k = kick(t, YELL, 3.5), u = backOut(seg(t, YELL - .5, YELL + .15));
    const c = C_HOUSAM(t), p = C_PAIR(t), camo = { ...p, x: lerp(p.x, c.x, u), y: lerp(p.y, c.y, u), hy: lerp(p.hy, c.hy, u), f: lerp(p.f, c.f, u) };
    camBegin(W / 2 + 26 * k * Math.sin(t * 61), H / 2 + 20 * k * Math.cos(t * 53), 1 + .03 * k, .012 * k * Math.sin(t * 37));
    const { A, S } = stage(t, camo, 1.8); bubbles(t, A, S);
    camEnd();
  }

  // ---------- the ending: freeze, card, iris ----------
  function ending(t) {
    const tt = Math.min(t, FREEZE); const { A, S } = stage(tt, C_TRIO(tt), 1.0); bubbles(tt, A, S);
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

  // the twisters: the professor close as he says one, Alma close as she flubs it, the room as it laughs
  const twisterShots = TW.flatMap((l, i) => [[l.at - .3, closeSafadi], [FLUB[i].at - .2, closeAlma], [typed(FLUB[i]) + .1, i === 5 ? ending : group]]);

  scene({ duration: END, fps: 24, bpm: 120,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: what I learned at school today
      [0, opening], [2.4, pair], [9.0, group], [10.0, pair], [24.4, group], [25.2, pair], [38.6, group], [39.3, pair], [54.8, group], [55.6, pair],
      [62.5, closeAlma], [65.8, yell],
      // part 2: the professor
      [69.6, group], [76.5, trio], [83.5, closeAlma], [87.7, trio], [92.2, closeSafadi], [97.0, closeAlma],
      // part 3: tongue twisters
      ...twisterShots,
    ] });
})();
