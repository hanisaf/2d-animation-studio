// Scene 19: "If, Else, Explain!". The DCES science room, the next afternoon (the Science room set, teacher view, rows: 2).
// Housam and Danny program Robo-Safadi on a laptop on an AV cart, cabled to the robot. Housam explains conditionals with a
// hologram the laptop projects; he types the if/else. Danny finds it boring; Housam brings in a large language model, and
// Clawd pops out of the laptop. The prompt: "Do something interesting and surprising!"… "Robot goes haywire!" The trigger:
// Professor Safadi's favorite word. "EXPLAIN!" Housam completes the logic; they laugh; the robot's eyes flicker red.
// Blocking (world units): Danny (−110, 960), Housam (40, 985) behind the cart (60, 940), Clawd on the cart (112, 77, 935),
// Robo-Safadi (240, 990). The code is shown in full-frame laptop-screen inserts. Every shot is a pure function of t.
(() => {
  const R = LOCATIONS.science_room, LINES = ASSETS.scene.scene19_if_else_explain.dialogue;
  const ACCENT = { housam: '#425DA0', danny: '#2E7D9A' };

  // ---------- timing ----------
  const CHUCKLE = [23.8, 26.0], THINK = [39.8, 42.3], POP = 42.6, OUTPUT = [51.5, 55.3], SPICE = [72.8, 77.0];
  const EXPLAIN = 93.4, LAUGH = [101.2, 104.0], FLICKER = 102.6, FREEZE = 104.0, END = 110;
  // the hologram's pages: [from, to]
  const HOLO_IF = [5.9, 17.7], HOLO_PROMPT = [58.5, 65.2], HOLO_BRANCH = [80.8, 104.5];
  // the code, as typed in the inserts
  const CODE1 = ['if trick:', '    give(broccoli)', 'else:', '    give(candy)'];
  const CODE2 = ['if trick:', '    give(broccoli)', 'elif treat:', '    give(candy)', 'elif explain:', '    llm("Robot goes haywire!")'];
  const PROMPT_A = 'Do something interesting and surprising!', PROMPT_B = ' Robot goes haywire!';

  // ---------- where everything is ----------
  const POS = { danny: [-110, 960], housam: [40, 985], cart: [60, 940], robot: [240, 990] };
  const LAPTOP = [40, 940], CLAWD_AT = [112, IE_CART.top, 935];

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker; return who; };
  const SIDE = { danny: -1, housam: .1, clawd: .5, robot: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.6, -.85, .85);
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const inW = (t, [a, b]) => t > a && t < b;

  // ---------- poses ----------
  function housamPose(t, c) {
    const talk = speaking('housam', t), ls = lastLine(t, 'housam');
    const kb = c.kb ? c.local(c.kb) : [3.8, -14.6], type = (k = 1) => ({ handL: [kb[0] - 1.6 + .3 * Math.sin(t * 17) * k, kb[1] + .2 * Math.cos(t * 13) * k], handR: [kb[0] + 1.6 + .3 * Math.cos(t * 15) * k, kb[1] + .2 * Math.sin(t * 19) * k], handPoseL: 'fist', handPoseR: 'fist', lookX: .15, lookY: .55, turn: .1 });
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('housam', ls), turn: .25 * Math.sign(lookAt('housam', ls)), brows: 'normal', ...type(.4), lookY: 0 };
    const set = p => Object.assign(o, p);
    if (t < 5.6) set({ ...type(), mouth: talk ? o.mouth : 'smile', brows: 'focused' });
    else if (t < 17.7) {                                                     // explaining with the hologram
      set({ lookX: -.7, turn: -.3, brows: 'up' });
      if (t < 8.2) set({ handR: [4.1, -24], handPoseR: 'point', jump: .4 * kick(t, 5.9, 6), mouth: talk ? o.mouth : 'grin' });
      else if (t < 12.2) set({ handL: [-4.8, -23 + .4 * Math.sin(t * 3)], handPoseL: 'point', lookX: -.4, lookY: -.5 });
      else set({ handL: [-4.4, -17], handPoseL: 'palm', handR: [4.4, -17], handPoseR: t > 15.3 ? 'palm' : 'point', lookX: -.6 });
    } else if (t < 23.7) set({ lookX: -.75, turn: -.35, mouth: 'grin', brows: 'up', blush: t > 19.5 ? 1 : .8, ...(t > 21.8 ? { lookX: 0, turn: 0, mouth: 'smirk', handR: [1.6, -16.6], handPoseR: 'fist' } : {}) });
    else if (t < 26.2) set({ eyes: 'happy', mouth: 'open', handL: [-4.1, -14.1], handR: [4.1, -14.1], tilt: -.1, dy: .18 * bounce(t, 10) });
    else if (t < 32.4) set({ ...type(), brows: 'focused', mouth: talk ? o.mouth : 'smile' });
    else if (t < THINK[0]) set({ lookX: -.75, turn: -.35, mouth: 'flat', brows: t > 36.6 ? 'worried' : 'normal' });
    else if (t < THINK[1]) set({ handR: [1.1, -21.2], handPoseR: 'fist', handL: [-3.6, -11.8], brows: 'focused', mouth: 'flat', lookX: -.55, lookY: -.6, tilt: .08, eyes: t > 41.0 ? 'squeeze' : 'open' });
    else if (t < 45.2) set({ handR: [4.1, -24], handPoseR: 'point', eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'grin', jump: .6 * kick(t, THINK[1] + .1, 6), lookX: .3 });
    else if (t < 48.0) set({ lookX: -.75, turn: -.35 });
    else if (t < 55.4) set({ handR: [5.6, -15], handPoseR: 'palm', handL: [-3.4, -12], lookX: t < 51.0 ? -.7 : .55, turn: t < 51.0 ? -.3 : .3, brows: 'up', mouth: talk ? o.mouth : 'grin' });
    else if (t < 58.2) set({ lookX: -.75, turn: -.35 });
    else if (t < 65.2) set({ handL: [-4.8, -23 + .4 * Math.sin(t * 3)], handPoseL: 'point', lookX: t > 63.2 ? -.75 : -.4, lookY: t > 63.2 ? 0 : -.5, brows: 'up', ...(t > 63.2 ? { handR: [4.6, -15], handPoseR: 'palm' } : {}) });
    else if (t < 72.6) set({ handR: [1.1, -21.2], handPoseR: 'fist', brows: 'focused', lookX: -.3, lookY: -.3, mouth: talk ? o.mouth : 'smirk', tilt: .08 * Math.sin(t * 2) });
    else if (t < 77.0) {                                                     // sly
      set({ lookX: -.85, turn: -.45, brows: 'focused', mouth: talk ? o.mouth : 'smirk', eyes: t > 74.8 ? 'happy' : 'open', handL: [-1.2, -14], handR: [1.2, -14], handPoseL: 'fist', handPoseR: 'fist' });
      if (t > 74.8) set({ dy: .12 * bounce(t, 9), tilt: .05 * Math.sin(t * 8) });
    } else if (t < 80.6) set({ ...type(1.6), mouth: 'grin', brows: 'focused' });
    else if (t < 87.4) {
      set({ handL: [-4.8, -23], handPoseL: 'point', lookX: -.4, lookY: -.5, brows: 'up' });
      if (t > 84.4) set({ handL: [-4.6, -14.5], handR: [4.6, -14.5], handPoseL: 'palm', handPoseR: 'palm', lookX: -.75, lookY: 0, brows: 'up' });
    } else if (t < EXPLAIN) set({ lookX: -.75, turn: -.35, eyes: t > 92.0 ? 'wide' : 'open', brows: 'up', mouth: t > 92.0 ? 'grin' : 'smile' });
    else if (t < 95.2) set({ handL: [-4.6, -24], handR: [4.6, -24], handPoseL: 'fist', handPoseR: 'fist', eyes: 'wide', mouth: talk ? o.mouth : 'grin', jump: 1.0 * kick(t, EXPLAIN, 5) });
    else if (t < LAUGH[0]) set({ ...type(1.4), brows: 'focused', mouth: talk ? o.mouth : 'grin' });
    else set({ eyes: 'happy', mouth: 'open', handL: [-4.1, -14.1], handR: [4.1, -14.1], tilt: -.12, dy: .2 * bounce(t, 10) });
    return o;
  }
  function dannyPose(t, c) {
    const talk = speaking('danny', t), ls = lastLine(t, 'danny');
    const o = { mouth: lipFlap(t, talk, 'grin'), lookX: lookAt('danny', ls), turn: .25 * Math.sign(lookAt('danny', ls)), brows: 'normal', handL: [-3.4, -10.2], handR: [3.4, -10.2], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < 5.6) set({ lean: .06, lookX: .7, turn: .35, ...(t > 2.4 ? { handR: [4.6, -14], handPoseR: 'palm', brows: 'up' } : {}) });
    else if (t < 17.7) set({ lookX: .6, lookY: t > 8.4 ? -.55 : 0, turn: .3, brows: 'up', mouth: 'o', eyes: t > 12.8 ? 'wide' : 'open', ...(t > 15.6 ? { mouth: 'grin' } : {}) });
    else if (t < 23.7) {
      set({ handL: [-4.3, -14], handR: [4.3, -14], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'grin', brows: 'up', lookX: .75, turn: .35, jump: .5 * kick(t, 18.0, 6) });
      if (t > 21.6) set({ handL: [-3.4, -10.2], handR: [1.4, -16.4], handPoseR: 'point', lookX: 0, turn: 0, eyes: t > 22.8 && t < 23.6 ? 'wink' : 'open', brows: 'focused', mouth: talk ? o.mouth : 'smirk' });
    } else if (t < 26.2) set({ eyes: 'happy', mouth: 'open', handL: [-3.5, -12.1], handR: [3.5, -12.1], tilt: -.14, dy: .22 * bounce(t, 11, 2) });
    else if (t < THINK[0]) {                                                 // bored
      const b = ease(seg(t, 32.4, 33.2));
      set({ dy: .4 * b, lookX: .5, lookY: .3 * b, mouth: talk ? o.mouth : 'flat', brows: 'worried', eyes: t > 34 && t < 35.4 ? 'closed' : 'open', handL: [-3.0, -8.4], handR: [3.0, -8.4], tilt: .08 * b });
      if (t > 36.6) set({ dy: 0, handL: [-4.4, -15.6], handR: [4.4, -15.6], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', lookY: 0, tilt: 0, jump: .3 * kick(t, 36.7, 6) });
    } else if (t < POP) set({ lookX: .7, turn: .3, brows: 'up', mouth: 'o' });
    else if (t < 45.2) set({ eyes: 'wide', mouth: 'O', brows: 'up', handL: [-4.3, -15], handR: [4.3, -15], handPoseL: 'palm', handPoseR: 'palm', jump: 1.2 * kick(t, POP + .1, 6), lookX: .8, turn: .4 });
    else if (t < 48.0) set({ handR: [4.8, -13.6], handPoseR: 'point', eyes: 'wide', brows: 'up', lookX: .8, turn: .4, mouth: talk ? o.mouth : 'grin' });
    else if (t < 55.4) set({ lookX: .8, turn: .4, eyes: t > OUTPUT[0] ? 'wide' : 'open', mouth: t > OUTPUT[0] ? 'O' : 'grin', brows: 'up', ...(t > OUTPUT[0] ? { handL: [-3.2, -16.5], handR: [3.2, -16.5], handPoseL: 'palm', handPoseR: 'palm', jump: .4 * bounce(t, 6) } : {}) });
    else if (t < 58.2) set({ handR: [4.6, -14], handPoseR: 'palm', brows: 'up', lookX: .75, turn: .35 });
    else if (t < 65.2) set({ handR: [1.1, -18.6], handPoseR: 'fist', brows: 'focused', lookX: .5, lookY: -.5, mouth: 'flat' });
    else if (t < 69.4) set({ handL: [-4.6, -17], handR: [4.6, -17], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up' });
    else if (t < 72.6) set({ lookX: .75, turn: .35, mouth: 'grin', brows: 'up' });
    else if (t < 77.0) {
      set({ lookX: .85, turn: .45, brows: 'focused', mouth: talk ? o.mouth : 'smirk', eyes: t > 74.8 ? 'happy' : 'open', handL: [-1.0, -12], handR: [1.0, -12], handPoseL: 'fist', handPoseR: 'fist' });
      if (t > 74.8) set({ dy: .14 * bounce(t, 9, 1), tilt: -.05 * Math.sin(t * 8) });
    } else if (t < 80.6) set({ lookX: .7, lookY: .3, mouth: 'grin', handL: [-3.0, -13], handR: [3.0, -13], handPoseL: 'fist', handPoseR: 'fist', dy: .1 * bounce(t, 14) });
    else if (t < 87.4) set({ lookX: .75, turn: .35, lookY: t < 84.4 ? -.45 : 0, brows: 'up' });
    else if (t < EXPLAIN) {
      set({ handR: [1.1, -18.6], handPoseR: 'fist', brows: 'focused', lookX: -.3, lookY: -.6, mouth: talk ? o.mouth : 'flat', tilt: .1 });
      if (t > 90.2) set({ handR: [3.6, -21.5], handPoseR: 'point', lookX: .6, lookY: -.2, tilt: 0, eyes: 'wide', brows: 'up', jump: .5 * kick(t, 90.3, 6) });
    } else if (t < 95.2) set({ handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'fist', handPoseR: 'fist', eyes: 'wide', mouth: talk ? o.mouth : 'grin', jump: 1.2 * kick(t, EXPLAIN, 5) });
    else if (t < LAUGH[0]) set({ lookX: .7, lookY: .3, mouth: 'grin', brows: 'up' });
    else set({ eyes: 'happy', mouth: 'open', handL: [-3.5, -12.1], handR: [3.5, -12.1], tilt: -.14, dy: .22 * bounce(t, 11, 2), rot: -.05 * Math.sin(t * 6) });
    return o;
  }
  // Clawd: the LLM, a hologram standing on the cart once Housam names him
  function clawdPose(t) {
    const ls = lastLine(t, 'clawd'), o = { holo: 1, bounce: .35, eyes: 'normal', lookX: ls === 'danny' ? -.8 : ls === 'housam' ? -.3 : 0, mouth: 'smile', aL: .2, aR: .2, seed: 2 };
    const set = p => Object.assign(o, p);
    if (t < 45.2) set({ aR: 1.2 + .45 * Math.sin(t * 9), eyes: 'happy', mouth: 'grin', jump: 1.5 * kick(t, POP + .2, 5), emote: '!', emoteK: on(t, POP + .3, 44.8, .15) });
    else if (t > OUTPUT[0] && t < OUTPUT[1]) { const i = Math.floor((t - OUTPUT[0]) / .38); set({ eyes: ['spark', 'swirl', 'happy', 'spark', 'wink'][i % 5], mouth: i % 2 ? 'O' : 'grin', aL: i % 2 ? 1.6 : .2, aR: i % 2 ? .2 : 1.6, jump: .8 * bounce(t, 8.3), sq: .08 * Math.sin(t * 16) }); }
    else if (inW(t, [58.4, 65.2])) set({ eyes: 'look', lookX: -.6, lookY: -1, aR: t > 61.6 ? 1.0 : .2, mouth: t > 61.6 ? 'smile' : 'flat' });
    else if (inW(t, [69.4, 72.6])) set({ eyes: 'happy', mouth: 'smile' });
    else if (inW(t, SPICE)) set({ eyes: 'narrow', mouth: 'cat', aL: .9 + .2 * Math.sin(t * 8), aR: .9 - .2 * Math.sin(t * 8) });
    else if (inW(t, [80.6, EXPLAIN])) set({ eyes: 'look', lookX: -.6, lookY: -1, emote: '?', emoteK: on(t, 85.0, 89.0, .2) });
    else if (inW(t, [EXPLAIN, 95.2])) set({ eyes: 'spark', mouth: 'grin', aL: 1.4, aR: 1.4, jump: 1.6 * kick(t, EXPLAIN, 5) });
    else if (t > LAUGH[0]) set({ eyes: 'happy', mouth: 'grin', sq: .1 * bounce(t, 12), aL: .6, aR: .6 });
    return o;
  }
  // Robo-Safadi: powered up but programmed with nothing yet: calm cyan eyes, a blank stare. His eyes flicker red at the end.
  function robotPose(t) {
    const o = { eyes: 'open', mouth: 'flat', handL: [-4.4, -8.6], handR: [4.4, -8.6], handPoseL: 'claw', handPoseR: 'claw', lookX: .0, antenna: .05 };
    if (t > FLICKER && t < FLICKER + .7) { const f = Math.floor((t - FLICKER) * 14) % 2; Object.assign(o, { red: f ? 1 : .2, brows: 'angry', mouth: f ? 'teeth' : 'flat', glitch: .25 }); }
    return o;
  }

  // ---------- the hologram pages ----------
  const fade = (t, [a, b]) => ease(seg(t, a, a + .35)) * (1 - ease(seg(t, b - .3, b)));
  const rv = (t, a, b = a + .4) => ease(seg(t, a, b));
  function diamond(x, y, w, h, label, k, lit) {
    if (k <= 0) return; X.save(); X.translate(x, y); X.scale(k, k);
    shape([[0, -h / 2], [w / 2, 0], [0, h / 2], [-w / 2, 0]], { fill: rgba(lit ? '#FFE9A0' : IE.holo, lit ? .45 : .2), stroke: '#E9FBFF', lwPx: 2 });
    ieHoloText(label, 0, 1, 15); X.restore();
  }
  function arrow(x0, y0, x1, y1, k, lit) {
    if (k <= 0) return; const x = lerp(x0, x1, k), y = lerp(y0, y1, k), a = Math.atan2(y1 - y0, x1 - x0);
    line([[x0, y0], [x, y]], { stroke: lit ? '#FFE9A0' : '#E9FBFF', lwPx: 2.5 });
    if (k > .95) shape([[x1, y1], [x1 - 9 * Math.cos(a - .45), y1 - 9 * Math.sin(a - .45)], [x1 - 9 * Math.cos(a + .45), y1 - 9 * Math.sin(a + .45)]], { fill: lit ? '#FFE9A0' : '#E9FBFF', stroke: null });
  }
  const broccoliIcon = (x, y, s, t) => { X.save(); X.translate(x, y); X.scale(s, s); rsBroccoli(0, 2, .2, t); X.restore(); };
  const candyIcon = (x, y, s) => almaLollipop(x, y + 8, s, { ang: .2 });
  function holoIf(t) {                                                       // IF / ELSE: a condition, two branches
    ieHoloText('IF ... ELSE', 0, -46, 17, '#E9FBFF', rv(t, 6.0));
    const litT = t > 12.6 && t < 15.3, litC = t > 15.5;
    diamond(0, -12, 92, 36, 'trick?', backOut(seg(t, 8.6, 9.1)), litT);
    arrow(-46, -12, -84, 20, rv(t, 10.0), litT); arrow(46, -12, 84, 20, rv(t, 10.3), litC);
    ieHoloText('yes', -78, -14, 12, '#E9FBFF', rv(t, 10.3)); ieHoloText('no', 76, -14, 12, '#E9FBFF', rv(t, 10.6));
    if (t > 12.6) broccoliIcon(-96, 40, 4.2 * backOut(seg(t, 12.7, 13.1)), t);
    if (t > 15.5) candyIcon(96, 32, 2.6 * backOut(seg(t, 15.6, 16.0)));
  }
  function holoPrompt(t) {                                                   // PROMPT → LLM → ???
    const k1 = backOut(seg(t, 58.8, 59.3));
    if (k1 > 0) { X.save(); X.translate(-82, 0); X.scale(k1, k1); shape(rectPts(-30, -22, 60, 44), { fill: rgba('#F2A283', .35), stroke: '#E9FBFF', lwPx: 2 }); for (let i = 0; i < 3; i++) line([[-20, -10 + i * 10], [20 - i * 8, -10 + i * 10]], { stroke: '#E9FBFF', lwPx: 2 }); X.restore(); ieHoloText('PROMPT', -82, 36, 12, '#E9FBFF', rv(t, 59.0)); }
    arrow(-46, 0, -20, 0, rv(t, 60.4), false);
    if (t > 60.9) { clawd(0, 18, 3.6 * backOut(seg(t, 60.9, 61.3)), { t, holo: 1, noShadow: true, eyes: t > 62 ? 'happy' : 'normal', mouth: 'smile' }); ieHoloText('LLM', 0, 36, 12, '#F2A283', rv(t, 61.2)); }
    arrow(22, 0, 48, 0, rv(t, 62.2), false);
    if (t > 62.6) { const k = backOut(seg(t, 62.6, 63.0)); ['?', 'dice', 'star'].forEach((kind, i) => ieItem(kind, 66 + i * 24, -6 + (i % 2) * 14 + 3 * Math.sin(t * 5 + i), 8 * k, .3 * Math.sin(t * 3 + i))); }
  }
  function holoBranch(t) {                                                   // three branches: trick, treat, ??? → the LLM
    const ex = t > EXPLAIN;
    ieHoloText('IF ... ELIF ... ELIF', 0, -46, 15, '#E9FBFF', rv(t, 81.0));
    [['trick?', -84, 81.4], ['treat?', 0, 81.8], [ex ? 'EXPLAIN!' : '???', 84, 82.6]].forEach(([lab, x, t0], i) => {
      diamond(x, -12, 74, 30, lab, backOut(seg(t, t0, t0 + .4)), i === 2 && ex);
      arrow(x, 3, x, 18, rv(t, t0 + .3), i === 2 && ex);
    });
    if (t > 81.8) broccoliIcon(-84, 42, 3.4, t);
    if (t > 82.2) candyIcon(0, 34, 2.0);
    if (t > 83.0) clawd(84, 40, 2.4, { t, holo: 1, noShadow: true, eyes: ex ? 'spark' : 'look', lookY: -1, mouth: ex ? 'grin' : 'flat' });
  }

  // ---------- the whole stage, for a camera ----------
  function wallBoard(t) {
    saMarker('PROJECT: ROBO-SAFADI', 30, 52, 36, 1, '#D0508E');
    saMarker('Halloween in 5 days!!', 30, 104, 28, 1, '#994EC4');
    saMarker('step 2: SOFTWARE', 400, 104, 28, 1, '#2F5FB0');
  }
  const CAST = {
    housam: { pose: housamPose, rig: housam, unit: HOUSAM_UNIT },
    danny: { pose: dannyPose, rig: danny, unit: DANNY_UNIT },
  };
  const HEADW = { housam: 5.6, danny: 5.4 };
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {}, SET = { rows: 2, bubbling: 1, board: wallBoard };
    const kb = measure(() => ieLaptop(P, LAPTOP[0], LAPTOP[1], t));
    const actors = [];
    for (const [name, c] of Object.entries(CAST)) {
      const [x, z] = POS[name]; if (P.depth(z) < 60) continue;
      actors.push({ z, draw: () => {
        const [sx, sy, k] = P.p(x, 0, z), s = c.unit * k;
        const pose = { ...c.pose(t, { kb, local: pt => [(pt[0] - sx) / s, (pt[1] - sy) / s] }), t };
        if (o.freeze) pose.boil = 0;
        A[name] = c.rig(sx, sy, s, pose); S[name] = s;
      } });
    }
    actors.push({ z: POS.robot[1], draw: () => { const [sx, sy, k] = P.p(POS.robot[0], 0, POS.robot[1]); A.robot = roboSafadi(sx, sy, ROBO_SAFADI_UNIT * k, { ...robotPose(t), t }); S.robot = ROBO_SAFADI_UNIT * k; } });
    actors.push({ z: 966, draw: () => ieCable(P, [LAPTOP[0] - 30, IE_CART.top + 2, LAPTOP[1] + 10], [POS.robot[0] - 22, 34, POS.robot[1]]) });
    actors.push({ z: POS.cart[1], draw: () => { ieCart(P, POS.cart[0], POS.cart[1], t); ieLaptop(P, LAPTOP[0], LAPTOP[1], t, t > 1 ? 1 : 0);
      if (t > POP) {                                                        // Clawd, standing on the cart
        const [cx, cy, k] = P.p(...CLAWD_AT), g = backOut(seg(t, POP, POP + .45)), s = CLAWD_UNIT * k * g;
        if (t < POP + .6) { const [lx, ly] = P.p(LAPTOP[0], IE_CART.top + 30, LAPTOP[1] - 16); shape([[lx - 20 * k, ly], [lx + 20 * k, ly], [cx + 40 * k, cy - 40 * k], [cx - 40 * k, cy - 40 * k]], { fill: rgba(IE.holo, .3 * (1 - seg(t, POP + .3, POP + .6))), stroke: null }); }
        if (s > .5) { A.clawd = clawd(cx, cy, s, { ...clawdPose(t), t }); S.clawd = s; }
      } } });
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => R.back(P, t, { ...SET, splitZ: actors[0].z }), { blur });
    actors.forEach((a, i) => { a.draw(); R.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z }); });
    // the hologram floats above the cart, projected from the laptop
    const pages = [[HOLO_IF, holoIf], [HOLO_PROMPT, holoPrompt], [HOLO_BRANCH, holoBranch]];
    for (const [w, fn] of pages) { const k = fade(t, w); if (k > 0) {
      const [lx, ly] = P.p(LAPTOP[0], IE_CART.top + 40, LAPTOP[1] - 12), [ax, ay] = P.p(-170, 200, 1000), [bx] = P.p(130, 200, 1000);
      if (P.visible(LAPTOP[1])) shape([[lx - 6, ly], [lx + 6, ly], [bx, ay], [ax, ay]], { fill: rgba(IE.holo, .12 * k), stroke: null });
      ieHolo(P, 1000, -20, 270, 300, 140, k, () => { X.scale(1.2, 1.2); fn(t); });
    } }
    // unpredictable output: things fly out of Clawd
    if (inW(t, [OUTPUT[0], OUTPUT[1] + 1.6])) for (let i = 0; i < 10; i++) {
      const t0 = OUTPUT[0] + i * .38, d = t - t0; if (d < 0 || d > 1.6 || t0 > OUTPUT[1]) continue;
      const vx = (hash(i) - .5) * 220, vy = 170 + hash(i + 3) * 90, vz = -(20 + hash(i + 7) * 40);
      const wx = CLAWD_AT[0] + vx * d, wy = CLAWD_AT[1] + 40 + vy * d - 160 * d * d, wz = CLAWD_AT[2] + vz * d;
      if (!P.visible(wz)) continue; const [ix, iy, k] = P.p(wx, wy, wz);
      X.save(); X.globalAlpha = 1 - seg(d, 1.2, 1.6); ieItem(['dice', 'star', 'duck', 'heart', '♪', '?', 'fish', 'rainbow', 'star', 'duck'][i], ix, iy, 9 * k, d * 4 * (hash(i + 2) - .5)); X.restore();
    }
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
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.3 : 1.1), dx: o.groupDx ?? 0, dy: o.groupDy ?? -200 }); continue;
        }
      }
      const a = A?.[l.speaker], s = S?.[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: o.dy ?? -220 });
      } else {                                                                // off-screen: from the frame edge on their side
        const sd = o.edgeSide ?? (l.group ? 0 : SIDE[l.speaker] > 0 ? 1 : -1);
        if (!sd) callout(l.text, W / 2, H + 30, age, { ...c, size: c.size * 1.1, dx: 0, dy: -200 });
        else callout(l.text, sd > 0 ? W + 30 : -30, o.edgeY ?? H * .4, age, { ...c, dx: -sd * 420, dy: -150 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const TWO = cam(60, 170, 640, 540);                                       // the boys, the cart, the robot; the hologram above
  const DANNY_MS = cam(-80, 100, 740, 420);
  const HOUSAM_CU = cam(-20, 180, 800, 300);
  const CLAWD_SHOT = cam(85, 115, 800, 430);                                // Housam and Clawd on the cart
  const BOTH = cam(-30, 150, 760, 420);
  const shot = (camFn, blur, bo, go) => t => { const { A, S, P } = stage(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S, P); };

  function opening(t) {                                                      // from across the room to the two-shot
    const u = ease(seg(t, .2, 5.0)), a = { x: 0, y: 175, z: 120, f: 800, hy: 560 }, b = TWO(t);
    const c = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u), dir: 1 };
    const { A, S, P } = stage(t, c, .8 * u); bubbles(t, A, S, { size: 48, side: n => n === 'danny' ? -1 : 1, far: 240 }); extras(t, A, S, P);
  }
  const twoBo = { size: 48, side: n => n === 'danny' ? -1 : 1, far: 330, dy: -280, groupDy: -300 };
  const two = shot(TWO, .8, twoBo);
  const dannyMS = shot(DANNY_MS, 2.2, { size: 52, side: n => n === 'danny' ? -1 : 1, far: 260 });
  const housamCU = shot(HOUSAM_CU, 2.6, { size: 52, side: () => 1, far: 280 });
  const clawdShot = shot(CLAWD_SHOT, 2.4, { size: 50, side: () => -1, far: 220, dy: -260 });
  const both = shot(BOTH, 2.2, { size: 52, side: n => n === 'danny' ? -1 : 1, groupDy: -260 });
  // the laptop-screen inserts
  const typed = (t, a, b, lines) => Math.round(seg(t, a, b) * lines.join('\n').length);
  function insert1(t) { ieEditor(t, { code: CODE1, chars: typed(t, 26.6, 29.8, CODE1), panel: 'status' }); bubbles(t, null, null, { size: 50, edgeY: H * .86, edgeSide: -1 }); }
  function insert2(t) {
    const haywire = t > 77.0, pa = haywire ? PROMPT_A : PROMPT_A.slice(0, Math.round(seg(t, 65.8, 68.8) * PROMPT_A.length)), pb = haywire ? PROMPT_B.slice(0, Math.round(seg(t, 77.6, 79.6) * PROMPT_B.length)) : '';
    const cl = haywire ? (t < 79.8 ? { eyes: 'swirl', mouth: 'wobble', rot: .1 * Math.sin(t * 13), aL: 1.4 * Math.sin(t * 11), aR: 1.4 * Math.cos(t * 9), sq: .06 * Math.sin(t * 17) } : { eyes: 'narrow', mouth: 'cat', aL: .9, aR: .9 })
      : (t < 68.9 ? { eyes: 'look', lookY: 1, lookX: -.2, mouth: 'flat' } : { eyes: 'happy', mouth: 'smile', jump: .6 * kick(t, 68.9, 6) });
    ieEditor(t, { code: CODE1, panel: 'llm', prompt: pa, promptRed: pb, clawd: cl });
    if (haywire) sfx('BZZT!', 1540, 300, 80, '#FF6B6B', t - 78.2, { life: .8, rot: .12 });
    bubbles(t, null, null, { size: 50, edgeY: H * .86, edgeSide: -1 });
  }
  function insert3(t) {                                                      // else → elif treat, then the explain branch
    const swap = seg(t, 95.6, 96.6), line3 = swap < .4 ? 'else:'.slice(0, Math.round(5 * (1 - swap / .4))) : 'elif treat:'.slice(0, Math.round(11 * (swap - .4) / .6));
    const extra = ['elif explain:', '    llm("Robot goes haywire!")'], n = Math.round(seg(t, 96.8, 99.2) * (extra.join('\n').length + 1));
    const code = [CODE1[0], CODE1[1], line3, CODE1[3], ...(n > 0 ? extra : [])], before = CODE1[0].length + CODE1[1].length + line3.length + CODE1[3].length + 4;
    const lit = t > 99.2;
    ieEditor(t, { code, chars: n > 0 ? before + n - 1 : Infinity, panel: 'llm', prompt: PROMPT_A, promptRed: PROMPT_B, hl: lit ? 4 : null,
      clawd: lit ? { eyes: 'spark', mouth: 'grin', aL: 1.4, aR: 1.4, jump: 1.2 * kick(t, 99.3, 5) } : { eyes: 'look', lookX: -1, lookY: .4, mouth: 'smile' } });
    bubbles(t, null, null, { size: 50, edgeY: H * .86, edgeSide: -1 });
  }
  function tbc(t) {
    const tt = Math.min(t, FREEZE), { A, S, P } = stage(tt, TWO(tt), .8, { freeze: t > FREEZE }); bubbles(tt, A, S, twoBo); extras(tt, A, S, P);
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
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 108.0, 109.4))));
  }

  // things that ride on top of any shot
  function extras(t, A, S, P) {
    const h = A.housam, c = A.clawd, r = A.robot;
    if (h && inW(t, THINK)) for (let i = 0; i < 3; i++) { const k = on(t, THINK[0] + .3 + i * .5, THINK[1], .15); if (k > 0) circle(h.top[0] + (4 + i * 2.2) * S.housam, h.top[1] - (1 + i * 1.6) * S.housam, (.5 + i * .25) * S.housam * k, { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 2.5 }); }
    if (h) sfx('!', h.top[0] + 4 * S.housam, h.top[1] - 2 * S.housam, 90, PAL.goldLt, t - THINK[1], { life: .9 });
    if (c) sfx('POP!', c.top[0] + 2 * S.clawd, c.top[1] - 10 * S.clawd, 70, '#F2A283', t - POP, { life: .8, rot: -.1 });
    if (r) sfx('bzzt', r.antenna[0] + 6 * S.robot, r.antenna[1], 44, '#FF6B6B', t - FLICKER, { life: .7, rot: .1 });
  }

  scene({ duration: END, fps: 24, bpm: 116,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [5.6, two], [17.7, dannyMS], [23.6, two], [26.2, insert1], [32.4, dannyMS], [THINK[0] - .1, housamCU], [42.3, two],
      [45.2, dannyMS], [48.0, clawdShot], [55.4, dannyMS], [58.2, two], [65.2, insert2], [69.4, housamCU], [72.6, both], [77.0, insert2],
      [80.6, two], [87.4, dannyMS], [93.2, both], [95.2, insert3], [101.0, tbc],
    ] });
})();
