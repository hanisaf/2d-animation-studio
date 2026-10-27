// Scene 21: "We Already Read a Lot!". DCES, the entrance plaza on a sunny morning; then the school library.
// Safadi lectures four kids on the benefits of reading (focus, vocabulary, imagination, empathy), one floating board each,
// while the kids get more and more bored (a butterfly, a doodle, knee taps, a sway, an ENORMOUS yawn). "And FIVE!..."
// "PROFESSOR!" The kids grab him and zip him through the doors. In the library each kid shows a favourite book (a story pops
// out), "We ALREADY read a lot!", and Safadi pivots to writing (history, clear thinking, remembering, organizing) and starts
// to brag. A cutaway to his study at night (writing, crumpled drafts, THE END), then back in the library: his three books,
// the book fair, "you shall see that everyone will like my books", the kids' whisper, "You shall see!" To be continued.
// Blocking (world units): Housam (−480, 2200), Jenna (−335, 2200), Alma (−195, 2200), Danny (−60, 2200); Safadi (300, 2230).
// Every shot is a pure function of t.
(() => {
  const R = LOCATIONS.dces, LINES = ASSETS.scene.scene21_already_read.dialogue, SET = { wind: .6 };
  const ACCENT = { housam: '#425DA0', jenna: '#D0508E', alma: '#994EC4', danny: '#3E6FB0', safadi: PAL.crimson };

  // ---------- timing ----------
  const POWER = [7.4, 43.2], FIVE = 41.0, STOP = 43.2;
  const BOARDS = [['brain', 'ATTENTION', 9.6, 19.5], ['words', 'VOCABULARY', 19.6, 26.9], ['imagine', 'IMAGINATION', 27.0, 34.5], ['shoes', "SOMEONE ELSE'S SHOES", 34.6, STOP]];
  const FLY = [14.2, 19.4], DOODLE = 23.6, TAPS = [30.8, 34.6], SWAY = [38.2, 41.2], YAWN = [38.8, 41.0];
  const GRAB = [51.9, 52.4], ZIP = [52.6, 53.15], WIPE = [53.0, 53.6], LIB0 = 53.6;
  const END = 158;
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker; return who; };
  const SIDE = { housam: -1.4, jenna: -1.0, alma: -.6, danny: -.25, safadi: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.4, -.85, .85);
  const bounce = (t, f = 13, ph = 0) => Math.abs(Math.sin(t * f + ph));

  // ---------- where everyone stands ----------
  const HOME = { housam: [-480, 2200], jenna: [-335, 2200], alma: [-195, 2200], danny: [-60, 2200], safadi: [300, 2230] };
  const HUDDLE = { housam: [195, 2215], jenna: [250, 2190], alma: [395, 2205], danny: [440, 2235], safadi: [300, 2230] };   // grabbing his sleeves
  const DOOR = [[-70, 2580], [-20, 2570], [70, 2580], [110, 2590], [20, 2585]];
  const ORDER = ['housam', 'jenna', 'alma', 'danny', 'safadi'];
  const at = (name, t) => t < LIB0 ? dcesAt(name, t) : libAt(name, t);
  function dcesAt(name, t) {
    const h = HOME[name], g = HUDDLE[name], d = DOOR[ORDER.indexOf(name)];
    const u = ease(seg(t, GRAB[0], GRAB[1])), v = easeIn(seg(t, ZIP[0], ZIP[1]));
    const x = lerp(lerp(h[0], g[0], u), d[0], v), z = lerp(lerp(h[1], g[1], u), d[1], v);
    const dist = Math.hypot(g[0] - h[0], g[1] - h[1]) * u + 420 * v;
    return { x, z, dist, moving: (t > GRAB[0] && t < GRAB[1] + .1) || (t > ZIP[0] && t < ZIP[1]), zip: v };
  }

  // the butterfly that steals Danny's focus: a world-space path in front of the kids
  function butterflyAt(t) {
    const u = seg(t, FLY[0], FLY[1]);
    return { X: lerp(560, -1000, u), Y: 150 + 30 * Math.sin(u * 14) + 18 * Math.sin(t * 5), Z: 2120, live: t > FLY[0] && t < FLY[1] };
  }
  function butterfly(P, t) {
    const b = butterflyAt(t); if (!b.live || P.depth(b.Z) < 40) return;
    const [sx, sy, k] = P.p(b.X, b.Y, b.Z), r = 9 * k, fl = .25 + .75 * Math.abs(Math.sin(t * 22));
    X.save(); X.translate(sx, sy); X.rotate(-.15 + .12 * Math.sin(t * 6));
    for (const sd of [-1, 1]) {
      X.save(); X.scale(sd * fl, 1);
      shape([[0, 0], [r * 1.1, -r * 1.2], [r * 1.5, -r * .4], [r * .3, r * .1]], { fill: '#FFB347', stroke: PAL.ink, lwPx: 1.6, smooth: .6 });
      shape([[0, r * .1], [r * .9, r * .5], [r * .6, r * 1.1], [r * .1, r * .6]], { fill: '#FF7AA8', stroke: PAL.ink, lwPx: 1.6, smooth: .6 });
      X.restore();
    }
    shape([[0, -r * .6], [0, r * .9]], { stroke: PAL.ink, lwPx: 2.4, fill: null });
    X.restore();
  }

  // ---------- poses ----------
  const zipPose = (t, name) => { const a = at(name, t), j = .6 * Math.abs(Math.sin(a.dist / 30)); return { jump: j, tilt: -.06 * Math.sin(a.dist / 30), lean: .08 }; };
  function housamPose(t) {
    const talk = speaking('housam', t), ls = lastLine(t, 'housam'), a = at('housam', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('housam', ls), turn: .25 * Math.sign(lookAt('housam', ls)), brows: 'normal',
      handL: [-3.6, -10.6], handR: [3.9, -11.6], handPoseL: 'open', handPoseR: 'fist', ball: 'arm' };
    const set = p => Object.assign(o, p);
    if (a.moving) return Object.assign(o, housamDribble(a.dist / 50, 1), zipPose(t, 'housam'), { lookX: .7, turn: .4, mouth: 'grin', brows: 'up', ball: 'arm' });
    if (t > 9.0 && t < 43.2) {                                                // listening, then sagging
      const w = ease(seg(t, 24, 30));
      set({ lookX: .7, turn: .3, dy: .25 * w, brows: w > .5 ? 'normal' : 'up', mouth: talk ? o.mouth : (w > .5 ? 'flat' : 'smile') });
      if (t > TAPS[0] - .3 && t < TAPS[1] + .2) {                              // knee taps
        const u = frac((t - TAPS[0]) / .6), lift = Math.pow(Math.abs(Math.cos(Math.PI * u)), 6);
        set({ ball: 'knee', footR: [2.0, -1.05 - 4.6 * lift], handL: [-4.6, -13.2], handR: [4.8, -13.2], handPoseR: 'open', lookX: .1, lookY: .7, mouth: 'smirk', brows: 'focused' });
      }
      if (t > 38.4 && t < 43.2) set({ lookX: .4, lookY: .3, mouth: 'flat', tilt: .06, blink: t > 40.2 && t < 40.6 ? 1 : undefined });
    }
    if (t > 43.2 && t < 44.4) set({ handL: [-1.0, -24], handPoseL: 'palm', eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'open', jump: .6 * kick(t, 43.3, 6), lookX: .8, turn: .4 });
    if (t > 44.4 && t < 49.0) set({ lookX: .6, turn: .3, mouth: 'grin' });
    if (t > 49.0 && t < GRAB[0]) set({ lookX: .8, turn: .4, mouth: talk ? o.mouth : 'grin', brows: 'up' });
    if (t > 51.0 && t < GRAB[0]) set({ handL: [-5.6, -18], handPoseL: 'point', jump: .4 * kick(t, 51.1, 6) });
    if (t > GRAB[1] && t < ZIP[0]) set({ handL: [5.6, -12], handPoseL: 'fist', lean: .1, mouth: 'grin', lookX: .3 });
    return o;
  }
  function jennaPose(t) {
    const talk = speaking('jenna', t), ls = lastLine(t, 'jenna'), a = at('jenna', t);
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('jenna', ls), turn: .2 * Math.sign(lookAt('jenna', ls)), brows: 'up',
      handL: [-2.2, -13.6], handR: [1.6, -14.6], handPoseL: 'grip', handPoseR: 'fist', book: true, pencil: true };
    const set = p => Object.assign(o, p);
    if (a.moving) return Object.assign(o, jennaSkip(a.dist / 44, 1), zipPose(t, 'jenna'), { lookX: .7, turn: .4, mouth: 'grin', handL: [-2.2, -13.6], handR: [1.6, -14.6], pencil: false });
    if (t > 9.0 && t < 43.2) {
      set({ lookX: .65, turn: .3 });
      if (t > DOODLE) set({ handR: [1.6 + .45 * Math.sin(t * 15), -14.4 + .35 * Math.cos(t * 11)], lookX: -.15, lookY: .6, turn: 0, mouth: 'smile', brows: 'normal' });   // doodling, not listening
      if (t > 38.6 && t < 40.6) set({ lookX: .7, lookY: .1, mouth: 'smirk' });                                                    // a glance at Danny's yawn
    }
    if (t > 43.2 && t < 45.6) set({ lookX: .7, turn: .3, eyes: 'wide', jump: .3 * kick(t, 43.4, 6) });
    if (t > 45.6 && t < 47.4) set({ handR: [3.6, -19.5], handPoseR: 'palm', pencil: false, mouth: talk ? o.mouth : 'grin', jump: .6 * kick(t, 45.7, 6), lookX: .8, turn: .4 });
    if (t > 47.4 && t < GRAB[0]) set({ lookX: .7, turn: .3, mouth: 'grin' });
    if (t > GRAB[1] && t < ZIP[0]) set({ handR: [4.8, -12.5], handPoseR: 'fist', pencil: false, lean: .1, mouth: 'grin' });
    return o;
  }
  function almaPose(t) {
    const talk = speaking('alma', t), ls = lastLine(t, 'alma'), a = at('alma', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('alma', ls), turn: .2 * Math.sign(lookAt('alma', ls)), brows: 'normal',
      handL: [-2.6, -7.6], handR: [2.6, -7.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a.moving) return Object.assign(o, almaSkip(a.dist / 44, 1), zipPose(t, 'alma'), { lookX: -.3, turn: -.2, mouth: 'grin' });
    if (t < 9.0) { if (t > 7.6 && t < 9.0) set({ eyes: 'wide', brows: 'up', mouth: 'o', lookX: .8, turn: .4 }); }
    else if (t < 43.2) {
      const w = ease(seg(t, 22, 30));
      set({ lookX: .7, turn: .3, dy: .3 * w, mouth: talk ? o.mouth : (w > .5 ? 'flat' : 'smile'), brows: w > .5 ? 'worried' : 'normal' });
      if (t > 16.8 && t < 19.0) {                                              // nudging Danny back from the butterfly
        const u = on(t, 16.9, 18.9, .25);
        set({ lean: .14 * u, tilt: .1 * u, handR: mixPt([2.6, -7.6], [6.4, -11.6], u), handPoseR: 'fist', lookX: .9, turn: .45 * u, brows: 'angry', mouth: 'flat' });
      }
      if (t > SWAY[0] && t < SWAY[1]) set({ ...almaDance(t, 'sway', { bpm: 96, k: .7 * on(t, SWAY[0], SWAY[1], .4) }), eyes: 'closed', mouth: 'smile', power: .3 * on(t, SWAY[0], SWAY[1], .4) });
    } else {
      if (t > 43.2 && t < 44.4) set({ lookX: .7, turn: .3, eyes: 'wide', brows: 'up' });
      if (t > 44.4 && t < 45.8) set({ handL: [-4.4, -17.5], handR: [4.4, -17.5], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'grin', jump: .6 * kick(t, 44.5, 6), lookX: .8, turn: .4, brows: 'up' });
      if (t > 45.8 && t < GRAB[0]) set({ lookX: .7, turn: .3, mouth: 'grin' });
      if (t > GRAB[1] && t < ZIP[0]) set({ handL: [-5.4, -12], handPoseL: 'fist', lean: -.1, mouth: 'grin', lookX: -.4, turn: -.2 });
    }
    return o;
  }
  function dannyPose(t) {
    const talk = speaking('danny', t), ls = lastLine(t, 'danny'), a = at('danny', t);
    const o = { mouth: lipFlap(t, talk, 'grin'), lookX: lookAt('danny', ls), turn: .25 * Math.sign(lookAt('danny', ls)), brows: 'normal',
      handL: [-3.4, -10.2], handR: [3.4, -10.2], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a.moving) return Object.assign(o, dannyDribble(a.dist / 44, 1), zipPose(t, 'danny'), { lookX: -.4, turn: -.3, mouth: 'grin' });
    if (t > 9.0 && t < 43.2) {
      const w = ease(seg(t, 20, 28));
      set({ lookX: .7, turn: .3, dy: .3 * w, mouth: w > .5 ? 'flat' : 'smile', brows: w > .5 ? 'worried' : 'normal' });
      const b = butterflyAt(t);
      if (t > FLY[0] && t < 17.4) {                                           // his eyes, then his whole head, follow the butterfly
        const dx = clamp((b.X + 60) / 260, -1, 1), u = ease(seg(t, 15.4, 16.6));
        set({ lookX: dx, lookY: -.3, turn: .5 * dx * u, tilt: -.12 * u * Math.sign(dx), lean: .1 * u * dx, mouth: 'o', brows: 'up', eyes: 'wide' });
      }
      if (t > 17.4 && t < 19.4) set({ jump: .5 * kick(t, 17.5, 6), eyes: t < 17.9 ? 'squeeze' : 'open', lookX: .7, turn: .3, brows: 'worried', mouth: 'flat' });
      if (t > YAWN[0] && t < YAWN[1]) {                                      // the ENORMOUS yawn
        const u = on(t, YAWN[0], YAWN[1], .5);
        set({ handL: mixPt([-3.4, -10.2], [-6.2, -31], u), handR: mixPt([3.4, -10.2], [6.2, -31], u), handPoseL: 'fist', handPoseR: 'fist',
          eyes: u > .3 ? 'squeeze' : 'open', mouth: u > .3 ? 'open' : 'o', tilt: .06 * Math.sin(t * 2), dy: -.4 * u, brows: 'worried', lookX: 0, turn: 0 });
      }
    }
    if (t > 43.2 && t < 47.4) set({ lookX: .7, turn: .3, eyes: 'wide', brows: 'up' });
    if (t > 47.4 && t < 49.0) set({ handL: [-5.4, -16], handR: [5.4, -16], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'grin', jump: .9 * kick(t, 47.5, 6), lookX: .8, turn: .4, brows: 'up' });
    if (t > 49.0 && t < GRAB[0]) set({ lookX: .7, turn: .3, mouth: 'grin' });
    if (t > GRAB[1] && t < ZIP[0]) set({ handL: [-5.4, -12], handPoseL: 'fist', lean: -.1, mouth: 'grin', lookX: -.4, turn: -.2 });
    return o;
  }
  function safadiPose(t) {
    const talk = speaking('safadi', t), pw = on(t, POWER[0], POWER[1], .4), a = at('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.6, turn: -.3, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t > ZIP[0]) return Object.assign(o, { jump: 2.2 * Math.sin(Math.PI * seg(t, ZIP[0], ZIP[1])), rot: -.25 * a.zip, tilt: -.1, lean: .2, eyes: 'wide', mouth: 'O', brows: 'up',
      handL: [-6.4, -13], handR: [6.4, -13], footL: [-2.4, -3.5], footR: [2.6, -2.2], emote: '!', emoteK: 1 });
    if (t > 3.6 && t < 7.4) set({ handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', mouth: talk ? o.mouth : 'smile' });
    if (t > 7.2 && t < 9.4) set({ handR: [5.8, -21.4], handPoseR: 'point', brows: 'up', mouth: talk ? o.mouth : 'grin', jump: .4 * kick(t, 7.4, 6) });
    if (pw > 0 && t > 9.4) {                                                  // the lecture: the pointer at the board, counting on the other hand
      set({ power: pw, eyes: pw > .5 ? 'glow' : 'open', handR: [6.2, -15.6], handPoseR: 'pointer', pointerAng: -.45 + .08 * Math.sin(t * 1.3), handL: [-5.3, -12.4], handPoseL: 'palm', lookX: -.3, turn: -.1, brows: 'up' });
      for (const [, , b0] of BOARDS) if (t > b0 && t < b0 + 1.6) set({ handL: [-5.8, -21.4], handPoseL: 'point', jump: .25 * kick(t, b0 + .05, 7) });   // "One!" "Two!"...
      if (t > FIVE) set({ eyes: 'happy', handL: [-5.8, -21.4], handPoseL: 'point', mouth: talk ? o.mouth : 'grin', tilt: -.05, lookX: 0, turn: 0 });
    }
    if (t > STOP && t < 49.0) set({ eyes: t < STOP + .25 ? 'squeeze' : 'wide', brows: 'up', mouth: 'o', jump: .6 * kick(t, STOP + .1, 6), handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', lookX: -.7, turn: -.35, emote: '!', emoteK: on(t, STOP, 45.0, .15) });
    if (t > 44.4 && t < 49.0) set({ eyes: 'open', mouth: 'flat', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' });
    if (t > 49.0 && t < GRAB[0]) set({ brows: 'quizzical', handR: [.8, -16.1], handPoseR: 'fist', lookX: -.75, turn: -.35, mouth: talk ? o.mouth : 'smirk' });
    if (t > GRAB[0] && t < ZIP[0]) set({ eyes: 'wide', brows: 'up', mouth: 'o', handL: [-6.0, -12], handR: [6.0, -12], lookX: -.3, emote: '?', emoteK: on(t, GRAB[0], ZIP[0], .15) });
    return o;
  }
  const CAST = {
    housam: { pose: t => t < LIB0 ? housamPose(t) : kidLib('housam', t), rig: housam, unit: HOUSAM_UNIT },
    jenna: { pose: t => t < LIB0 ? jennaPose(t) : kidLib('jenna', t), rig: jenna, unit: JENNA_UNIT },
    alma: { pose: t => t < LIB0 ? almaPose(t) : kidLib('alma', t), rig: alma, unit: ALMA_UNIT },
    danny: { pose: t => t < LIB0 ? dannyPose(t) : kidLib('danny', t), rig: danny, unit: DANNY_UNIT },
    safadi: { pose: t => t < LIB0 ? safadiPose(t) : safadiLib(t), rig: safadi, unit: SAFADI_UNIT },
  };
  const HEADW = { housam: 5.4, jenna: 4.4, alma: 6.8, danny: 5.6, safadi: 6.6 };

  // ---------- props ----------
  function props(name, t, A, s, pose) {
    if (t >= LIB0) return libProps(name, t, A, s, pose);
    if (name === 'housam') {
      if (pose.ball === 'knee') { const u = frac((t - TAPS[0]) / .6); housamBall(A.kneeR[0], A.kneeR[1] - (1.5 + 5 * Math.sin(Math.PI * u)) * s, s, { spin: t * 6 }); }
      else housamBall(A.handR[0] + .4 * s, A.handR[1] - .3 * s, s);
    }
    if (name === 'jenna' && pose.book) {
      spkSketchbook(A.handL[0] + s * 2.0, A.handL[1] + s * 1.6, s * 7.4, -.1, { facing: 'back' });
      if (pose.pencil) spkPencil(A.handR[0] - s * .2, A.handR[1] + s * .3, s * 3.4, -1.9 + (t > DOODLE && t < 43.2 ? .2 * Math.sin(t * 15) : 0));
    }
  }

  // ---------- the whole stage, for a camera ----------
  function group(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {}, split = o.splitZ ?? 2180;
    layer(() => R.back(P, t, { ...SET, splitZ: split }), { blur });
    const items = [];
    for (const [name, c] of Object.entries(CAST)) {
      const a = at(name, t); if (P.depth(a.z) < 60) continue;
      items.push({ z: a.z, draw: () => {
        const [sx, sy, k] = P.p(a.x, 0, a.z), s = c.unit * k, pose = { ...c.pose(t), t };
        const draw = () => { A[name] = c.rig(sx, sy, s, pose); props(name, t, A[name], s, pose); };
        if (o.soft && o.soft[name]) layer(draw, { blur: o.soft[name] }); else draw();
        S[name] = s;
      } });
    }
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(it => it.draw());
    R.front(P, t, { ...SET, splitZ: split });
    butterfly(P, t);
    boards(t, P);
    dust(t, P);
    return { A, S, P };
  }
  // Safadi's boards float on his far side (world-anchored, so every shot agrees where they are)
  const BOARD = [585, 262, 2250, 270];
  function boards(t, P) {
    const [sx, sy, k] = P.p(BOARD[0], BOARD[1], BOARD[2]), w = BOARD[3] * k;
    if (P.depth(BOARD[2]) < 60 || sx + w / 2 > W - 10 || sx - w / 2 < 10) return;               // only when it fits in frame
    for (const [kind, title, b0, b1] of BOARDS) if (t > b0 && t < b1) {
      const out = 1 - ease(seg(t, b1 - .25, b1));
      safadiBoard(sx, sy, w * (b1 === STOP ? 1 : out), seg(t, b0 + .1, b0 + 2.6), t, { kind, title });
    }
  }
  // dust puffs where the kids stood when they zip off
  function dust(t, P) {
    for (const [i, name] of ORDER.entries()) {
      const age = t - ZIP[0] - i * .03; if (age < 0 || age > .9) continue;
      const g = HUDDLE[name], [sx, sy, k] = P.p(g[0], 20, g[1]); if (P.depth(g[1]) < 60) continue;
      for (let j = 0; j < 3; j++) circle(sx + (j - 1) * 40 * k, sy - j * 6 * k, (18 + 40 * age) * k, { fill: rgba('#FFFDF6', .8 * (1 - age / .9)), stroke: rgba(PAL.ink, .5 * (1 - age / .9)), lwPx: 2 });
    }
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const c = { size: (o.size || 50) * (l.kind === 'whisper' ? .82 : 1), maxW: o.maxW || 660, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {                                                         // one bubble for everyone in the group
        const ms = l.group.map(n => A[n]).filter(Boolean);
        if (ms.length) {
          const mx = ms.reduce((acc, m) => acc + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 50, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.3 : 1.1), dx: o.groupDx ?? 0, dy: o.groupDy ?? -220 }); continue;
        }
      }
      const a = A[l.speaker], s = S[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 330), dy: o.dy ?? -240 });
      } else {                                                                // off-screen: from the frame edge on their side
        const sd = SIDE[l.speaker] > 0 ? 1 : -1;
        callout(l.text, sd > 0 ? W + 30 : -30, H * .42, age, { ...c, dx: -sd * 420, dy: -160 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [12 * Math.sin(t * .23), 6 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const LINEUP = cam(-110, 130, 1660, 705);                                  // wide five-shot, the sign overhead
  const KIDS = cam(-270, 110, 1865, 700);                                    // the four kids, medium
  const SAF = cam(420, 140, 1850, 632);                                      // Safadi and his board
  const SAF_CU = t => ({ x: 300, y: 150, z: lerp(2040, 2060, seg(t, 41.0, 43.2)), f: 1000, hy: 363, dir: 1 });   // his face
  const YAWN_CAM = t => { const k = KIDS(t), u = ease(seg(t, 38.4, 39.6)); return { ...k, x: lerp(k.x, -90, u), z: lerp(k.z, 1990, u), hy: lerp(k.hy, 420, u) }; };
  const shot = (camFn, blur, bo, go) => t => { const { A, S } = group(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S); };

  function opening(t) {                                                       // from the street down to the plaza
    const u = ease(seg(t, .3, 3.4)), w = LINEUP(t);
    const c = { x: lerp(0, w.x, u), y: lerp(330, w.y, u), z: lerp(-700, w.z, u), f: lerp(1400, w.f, u), hy: lerp(520, w.hy, u), dir: 1 };
    const { A, S } = group(t, c, 0); bubbles(t, A, S, { size: 46, side: () => -1 });
  }
  const lineup = shot(LINEUP, 0, { size: 46, side: n => n === 'safadi' ? -1 : 1, far: 260 });
  const saf = shot(SAF, 2.0, { size: 48, side: () => -1, far: 280, dy: -300 }, { soft: { housam: 3, jenna: 3, alma: 3, danny: 3 } });
  const kids = shot(KIDS, 1.6, { size: 52, side: n => n === 'danny' ? -1 : 1, far: 280 });
  const yawn = shot(YAWN_CAM, 2.4, { size: 52, side: () => -1 });
  const five = shot(SAF_CU, 3.0, { size: 54, side: () => -1 });
  function tow(t) {                                                           // the zip, then a whoosh wipe (to the library, once it's built)
    lineup(t);
    const u = seg(t, WIPE[0], WIPE[1]); if (u <= 0) return;
    overlay(() => {
      const x = lerp(-W * .4, W * 1.3, ease(u));
      X.save(); X.fillStyle = '#FFF4D6'; X.beginPath(); X.moveTo(-200, 0); X.lineTo(x + 300, 0); X.lineTo(x, H); X.lineTo(-200, H); X.closePath(); X.fill();
      for (let i = 0; i < 6; i++) { X.globalAlpha = .7; X.fillStyle = i % 2 ? '#F2C14E' : '#7FC8E8'; const y = 120 + i * 160; X.fillRect(x - 120 - 200 * hash(i), y, 260 + 300 * hash(i + 9), 18); }
      X.restore();
    });
    sfx('ZOOM!', W * .55, H * .4, 120, '#F2C14E', t - ZIP[0], { life: .6, rot: -.1 });
  }

  // things that ride on top of any shot
  function extras(t, A, S) {
    const d = A.danny, h = A.housam;
    if (d && t > YAWN[0] + .3 && t < YAWN[1]) sfx('YAAAWN', d.head[0] - 2 * S.danny, d.top[1] - 7 * S.danny, 64, '#C9B8FF', t - YAWN[0] - .3, { life: 1.8, rot: .06 });
    if (h && t > TAPS[0] && t < TAPS[0] + 1.9) for (let i = 0; i < 3; i++) sfx('tap', h.kneeR[0] + 5 * S.housam, h.kneeR[1] - (4 + i) * S.housam, 40, '#FFFDF6', t - TAPS[0] - .2 - i * .6, { life: .4 });
  }

  // =====================================================================================================
  // ---------- part 2: the school library (reading-room view, dir −1: +X is screen-left) ----------
  // Blocking: the kids stand in front of the picture-book bins and the mural (Housam 330, Jenna 195, Alma 60, Danny −75; Z 300),
  // Safadi on the story rug at (−330, 290). His boards float over the rug on his far side (screen-right).
  const L = LOCATIONS.school_library, LSET = { sun: 1, lamps: .55 };
  const LINE = { housam: 55.8, alma: 59.0, jenna: 62.2, danny: 65.4 }, ALL = 68.6, HIGH = [68.6, 70.8];
  const FIZZ = [70.4, 71.2], THINK = [72.6, 75.0], BULB = 74.6, WRITE = 78.0, POWER2 = [78.0, 110.2], FLEX = [94.0, 96.4];
  const LBOARDS = [['history', 'WRITING', 81.6, 93.8], ['clear', null, 96.6, 101.9], ['remember', null, 102.2, 105.9], ['steps', 'ORGANIZE', 106.2, 110.2]];
  const TIE = [110.2, 111.6], PROUD = 113.8, RIPPLE = [115.6, 116.6], WALK_IN = [53.6, 55.3];
  const L_HOME = { housam: [330, 300], jenna: [195, 300], alma: [60, 300], danny: [-75, 300], safadi: [-330, 290] };
  const L_DELAY = { housam: 0, jenna: .12, alma: .2, danny: .3, safadi: .08 };
  function pathAt(pts, u) {                                                  // a point u (0..1) of the way along a polyline, and its length
    const seglen = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seglen.push(d); tot += d; }
    let d = u * tot;
    for (let i = 0; i < seglen.length; i++) {
      if (d <= seglen[i] || i === seglen.length - 1) { const f = clamp(d / seglen[i], 0, 1); return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), tot]; }
      d -= seglen[i];
    }
  }
  function libAt(name, t) {                                                  // in at the door, down the centre aisle, out to their spots
    const h = L_HOME[name], pts = [[-470, 1180], [-60, 1010], [0, 640], [h[0] * .5, 430], h];
    const u = ease(seg(t, WALK_IN[0] + L_DELAY[name], WALK_IN[1] + L_DELAY[name] * .5)), [x, z, tot] = pathAt(pts, u);
    return { x: huddleX(name, x, t), z, dist: u * tot, moving: u > 0 && u < 1, zip: 0 };
  }

  // the four books (stand-in covers: title lettering and a simple motif, not the published art)
  const BOOK = {
    housam: { col: '#26324F', ink: '#F2C14E', title: ['CITY', 'SPIES'], motif: 'shades' },
    alma: { col: '#2F6B3A', ink: '#F4E7C5', title: ['WARRIORS'], motif: 'paw' },
    jenna: { col: '#B8402F', ink: '#FFD66B', title: ['WINGS', 'OF FIRE'], motif: 'wing' },
    danny: { col: '#F2C14E', ink: '#C0443F', title: ['CAT KID', 'COMIC CLUB'], motif: 'cat' },
  };
  const HANDS = {                                                            // the book: up beside the head, at the chest, high overhead
    housam: { rest: [3.4, -10.4], up: [4.6, -21], chest: [1.8, -13.5], high: [3.2, -27] },
    jenna: { rest: [2.2, -9.0], up: [4.2, -19], chest: [2.2, -12.5], high: [3.0, -23] },
    alma: { rest: [2.6, -7.6], up: [6.2, -11.5], chest: [2.4, -4.6], high: [3.0, -20] },
    danny: { rest: [3.4, -10.2], up: [4.4, -17], chest: [1.8, -11.5], high: [3.0, -21] },
  };
  const bookState = (name, t) => t < LINE[name] - .3 ? null : t < LINE[name] + 2.6 ? 'up' : t > HIGH[0] && t < HIGH[1] ? 'high' : 'chest';
  function bookCover(x, y, w, ang, b, k = 1) {
    if (k <= .01) return;
    const h = w * 1.38;
    X.save(); X.translate(x, y); X.rotate(ang); X.scale(k, k);
    shape(rectPts(-w / 2 + w * .05, -h / 2 + w * .05, w, h), { fill: '#F4EEDD', stroke: PAL.ink, lwPx: 2 });            // the page block
    shape(rectPts(-w / 2, -h / 2, w, h), { fill: b.col, stroke: PAL.ink, lwPx: 3 });
    shape(rectPts(-w / 2, -h / 2, w * .1, h), { fill: rgba('#000000', .2), stroke: null });                                // spine shade
    const m = w * .3, my = h * .2, mk = { fill: b.ink, stroke: PAL.ink, lwPx: 2 };
    if (b.motif === 'shades') { [-1, 1].forEach(sd => shape(rectPts(sd * m * .55 - m * .45, my - m * .25, m * .9, m * .55), { ...mk, fill: '#111118', smooth: .3 })); line([[-m * .1, my - m * .1], [m * .1, my - m * .1]], { stroke: PAL.ink, lwPx: 3 }); }
    if (b.motif === 'paw') { ellipse(0, my + m * .2, m * .5, m * .4, mk); [[-.55, -.3], [-.2, -.6], [.2, -.6], [.55, -.3]].forEach(([dx, dy]) => ellipse(dx * m, my + dy * m, m * .17, m * .21, mk)); }
    if (b.motif === 'wing') shape([[-m * .9, my + m * .4], [-m * .2, my - m * .7], [m * .9, my - m * .5], [m * .5, my - m * .1], [m * .7, my + m * .2], [m * .2, my + m * .1], [m * .3, my + m * .45]], mk);
    if (b.motif === 'cat') { shape([[-m * .6, my - m * .1], [-m * .55, my - m * .75], [-m * .15, my - m * .45], [m * .15, my - m * .45], [m * .55, my - m * .75], [m * .6, my - m * .1], [m * .45, my + m * .45], [-m * .45, my + m * .45]], { ...mk, smooth: .3 });
      circle(-m * .22, my, m * .08, { fill: PAL.ink, stroke: null }); circle(m * .22, my, m * .08, { fill: PAL.ink, stroke: null }); }
    X.font = `${w * (b.title.some(s => s.length > 8) ? .14 : .2)}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    b.title.forEach((s, i) => { const ty = -h * .33 + i * w * .22; X.lineWidth = Math.max(2, w * .03); X.strokeStyle = PAL.ink; X.strokeText(s, w * .04, ty); X.fillStyle = b.ink; X.fillText(s, w * .04, ty); });
    X.restore();
  }
  const BOOK_W = { housam: 5.4, jenna: 5.6, alma: 5.0, danny: 6.0 };      // cover width in each kid's own units (they differ in build)
  function libProps(name, t, A, s, pose) {
    if (name === 'jenna') spkSketchbook(A.handL[0] + s * 2.0, A.handL[1] + s * 1.6, s * 7.4, -.1, { facing: 'back' });
    if (name === 'safadi') return safadiBooks(t, A, s, pose);
    if (!pose.book) return;
    const k = backOut(seg(t, LINE[name] - .3, LINE[name])), w = BOOK_W[name] * s;
    const off = pose.book === 'chest' ? [0, -.25] : [.15, -.42];             // the fist holds the bottom of the book
    bookCover(A.handR[0] + off[0] * w, A.handR[1] + off[1] * w * 1.38, w, pose.book === 'up' ? .12 : pose.book === 'high' ? -.08 : .04, BOOK[name], k);
  }

  // ---------- library poses ----------
  function kidLib(name, t) {
    const talk = speaking(name, t), ls = lastLine(t, name), a = libAt(name, t), H2 = HANDS[name], l0 = LINE[name];
    const o = { mouth: lipFlap(t, talk, name === 'danny' ? 'grin' : 'smile'), lookX: lookAt(name, ls), turn: .25 * Math.sign(lookAt(name, ls)), brows: 'normal',
      handL: [-H2.rest[0], H2.rest[1]], handR: H2.rest, handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (name === 'jenna') set({ giraffe: false, handL: [-2.2, -13.6], handPoseL: 'grip' });
    if (a.moving) {
      const g = { housam: housamDribble, danny: dannyDribble, alma: almaSkip, jenna: jennaSkip }[name](a.dist / (name === 'alma' || name === 'jenna' ? 44 : 50), 1);
      return Object.assign(o, g, { lookX: .4, mouth: 'grin', brows: 'up' }, name === 'jenna' ? { handL: [-2.2, -13.6] } : {});
    }
    const bs = bookState(name, t); o.book = bs;
    if (t > l0 - .8 && t < l0 - .3) set({ handR: [3.0, -25], handPoseR: 'open', lookY: -.7, lookX: .2, turn: 0, jump: .4 * kick(t, l0 - .7, 6) });   // up to the shelf
    if (bs === 'up') set({ handR: H2.up, handPoseR: 'fist', eyes: talk ? 'open' : 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up', lookX: -.1, turn: 0 });
    if (bs === 'chest') set({ handR: H2.chest, handPoseR: 'fist' });
    if (bs === 'high') set({ handR: H2.high, handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 1.0 * kick(t, ALL + .05, 5), lookX: .3, turn: .1 });
    if (t > l0 && t < l0 + 2.8) {                                            // each kid acts out their book
      if (name === 'housam') set({ brows: 'focused', mouth: talk ? o.mouth : 'smirk', tilt: -.05, handL: [-4.4, -16], handPoseL: 'point' });
      if (name === 'alma' && t > l0 + .5) set({ handL: [-3.6, -13.5], handPoseL: 'fist', brows: 'angry', mouth: talk ? o.mouth : 'grin', lean: -.06, jump: .3 * kick(t, l0 + .8, 6) });
      if (name === 'jenna' && t > l0 + .3) set({ lookY: -.7, lookX: -.3, eyes: 'wide', mouth: talk ? o.mouth : 'O', brows: 'up' });
      if (name === 'danny' && t > l0 + .3) set({ handL: [-4.8, -19], handPoseL: 'fist', jump: .8 * kick(t, l0 + .55, 6), eyes: talk ? 'open' : 'happy', brows: 'up' });
    }
    if (t > HIGH[1] && t < 75.0) set({ lookX: .75, turn: .35, mouth: 'grin', brows: 'up', eyes: t > 71.4 && t < 72.6 ? 'happy' : 'open' });   // proud
    if (t > WRITE - .1 && t < WRITE + 1.4) set({ eyes: 'wide', brows: 'up', mouth: 'o', jump: .3 * kick(t, WRITE, 6), lookX: .75, turn: .35 });
    if (t > 81.0) { const w = ease(seg(t, 86, 92)); set({ lookX: .75, turn: .35, dy: .2 * w, mouth: talk ? o.mouth : (w > .5 ? 'flat' : 'smile'), brows: 'normal' }); }
    if (name === 'jenna') {
      if (t > 80.2 && t < 81.4) set({ lookX: -.3, turn: 0, brows: 'worried', mouth: talk ? o.mouth : 'flat' });
      if (t > 106.0 && t < 110.2) set({ tilt: .08 * Math.sin((t - 106) * 6), eyes: 'happy', mouth: 'smile', dy: 0, brows: 'up' });       // she knows this one
    }
    if (t > 110.2) set({ brows: name === 'housam' ? 'focused' : 'up', mouth: name === 'danny' ? 'o' : 'smirk', lookX: .8, turn: .4, dy: 0 });
    kidPart3(name, t, o, set, talk);
    return o;
  }
  function safadiLib(t) {
    const talk = speaking('safadi', t), a = libAt('safadi', t), pw = on(t, POWER2[0], POWER2[1], .4), ls = lastLine(t, 'safadi');
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.6, turn: -.3, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a.moving) return Object.assign(o, safadiWalk(a.dist / 58, 1), { handL: [-6.0, -12], handR: [-2.0, -12.5], lean: -.12, eyes: 'wide', brows: 'up', mouth: 'o', lookX: -.5 });
    if (ls && ls !== 'safadi' && SIDE[ls] < 0) set({ lookX: clamp(-.3 + SIDE[ls] * .45, -.95, -.3) });
    if (t > 55.3 && t < ALL) set({ brows: 'up', mouth: talk ? o.mouth : 'smile', handL: [-1.6, -8.8], handR: [1.6, -8.8] });
    if (t > ALL && t < 71.2) set({ eyes: 'wide', brows: 'up', mouth: 'o', jump: .5 * kick(t, ALL + .1, 6), handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm' });
    if (t > FIZZ[0] && t < FIZZ[1]) set({ power: .4 * (Math.sin(t * 40) > .2 ? 1 : 0) * (1 - seg(t, FIZZ[0], FIZZ[1])) });
    if (t > 70.8 && t < 72.6) set({ emote: 'sweat', emoteK: on(t, 70.8, 72.6, .2) });
    if (t > 71.2 && t < 72.6) set({ mouth: talk ? o.mouth : 'o', brows: 'worried', handL: [-4.4, -8.1], handR: [4.4, -8.1] });
    if (t > THINK[0] && t < 75.6) set({ handR: [.8, -16.1], handPoseR: 'fist', handL: [-3.6, -11], handPoseL: 'fist', brows: t < BULB ? 'focused' : 'up',
      lookX: t < 73.4 ? -.7 : t < 74.0 ? .7 : -.3, lookY: t > 73.4 && t < 74.0 ? -.4 : 0, mouth: t < BULB ? 'flat' : 'smirk' });
    if (t > 73.6 && t < 76.6) o.bulb = t < BULB ? (Math.sin(t * 30) > .3 ? .45 : 0) : on(t, BULB, 76.6, .25);
    if (t > 75.0 && t < WRITE) set({ mouth: talk ? o.mouth : 'smirk', brows: 'up', handR: [5.3, -12.6], handPoseR: 'palm', lookX: -.6, eyes: 'narrow' });
    if (pw > 0) {
      set({ power: pw, eyes: pw > .5 ? 'glow' : 'open', brows: 'up' });
      if (t < 81.0) set({ handL: [-5.8, -21.6], handR: [5.8, -21.6], handPoseL: 'palm', handPoseR: 'palm', jump: .7 * kick(t, WRITE + .05, 6), mouth: talk ? o.mouth : 'grin' });
      else set({ handR: [6.2, -15.6], handPoseR: 'pointer', pointerAng: -.35 + .08 * Math.sin(t * 1.3), handL: [-5.3, -12.4], handPoseL: 'palm', lookX: -.3, turn: -.1 });
      if (t > FLEX[0] && t < FLEX[1]) set({ handL: [-5.6, -17.5], handR: [5.6, -17.5], handPoseL: 'fist', handPoseR: 'fist', mouth: talk ? o.mouth : 'grin', jump: .4 * kick(t, FLEX[0] + .1, 6), lookX: 0, turn: 0 });
    }
    if (t > POWER2[1]) {                                                     // the brag: straighten the tie, chest out
      if (t < TIE[1]) set({ handR: [.6, -16.4], handL: [-.6, -15.0], handPoseR: 'fist', handPoseL: 'fist', lookX: 0, turn: 0, lookY: .3, mouth: talk ? o.mouth : 'smirk', brows: 'normal' });
      else set({ handL: [-4.9, -9.2], handR: [4.9, -9.2], handPoseL: 'fist', handPoseR: 'fist', lean: -.05, lookX: -.2, turn: -.1, lookY: -.2, brows: 'up', mouth: talk ? o.mouth : 'smile' });
      if (t > PROUD) set({ eyes: 'happy', lookY: -.4, tilt: -.05 });
    }
    safadiPart3(t, o, set, talk);
    return o;
  }

  // ---------- the story pops ----------
  function catSil(x, y, r, rot) {                                            // a leaping cat silhouette
    X.save(); X.translate(x, y); X.rotate(rot);
    const f = { fill: '#0A0F1C', stroke: '#F4E7C5', lwPx: 1.5 };
    shape([[-r, .1 * r], [-.3 * r, -.25 * r], [.5 * r, -.2 * r], [.9 * r, -.35 * r], [1.1 * r, -.15 * r], [.8 * r, .1 * r], [.2 * r, .2 * r], [-.5 * r, .25 * r]], { ...f, smooth: .5 });
    shape([[.8 * r, -.32 * r], [.85 * r, -.6 * r], [.98 * r, -.38 * r], [1.08 * r, -.58 * r], [1.1 * r, -.3 * r]], f);
    line([[-r, .1 * r], [-1.4 * r, -.3 * r], [-1.5 * r, -.6 * r]], { stroke: '#0A0F1C', lwPx: Math.max(2, r * .12) });
    X.restore();
  }
  function dragonSil(x, y, r, flap, col) {                                   // a swooping dragon silhouette (faces screen-right)
    X.save(); X.translate(x, y);
    const f = { fill: col, stroke: PAL.ink, lwPx: 2 };
    shape([[-1.0 * r, .3 * r], [-1.6 * r, .1 * r], [-.9 * r, .05 * r], [-.3 * r, -.1 * r], [.5 * r, -.1 * r], [.9 * r, -.35 * r], [1.25 * r, -.3 * r], [1.0 * r, -.05 * r], [.4 * r, .2 * r], [-.3 * r, .25 * r]], { ...f, smooth: .4 });
    shape([[-.3 * r, -.05 * r], [-.1 * r, -1.1 * r * flap], [.3 * r, -.85 * r * flap], [.5 * r, -.1 * r]], f);
    X.restore();
  }
  function popsBehind(t, P) {
    let l0 = LINE.housam;                                                    // City Spies: a laser grid flicks on behind Housam
    if (t > l0 + .2 && t < l0 + 3.0) {
      X.save(); X.globalAlpha = on(t, l0 + .2, l0 + 3.0, .2); X.shadowColor = '#FF2A2A'; X.shadowBlur = 16;
      for (let i = 0; i < 6; i++) {
        if (Math.sin(t * 9 + i * 2.1) < -.7) continue;
        const sd = i % 2 ? 1 : -1, x0 = 240 + (i >> 1) * 60, a = P.p(x0, 10, 235), b = P.p(x0 + sd * 120, 250, 235);
        line([[a[0], a[1]], [b[0], b[1]]], { stroke: '#FF5050', lwPx: 4 });
      }
      X.restore();
    }
    l0 = LINE.alma;                                                          // Warriors: clan cats leap through a moonlit forest
    if (t > l0 + .2 && t < l0 + 3.0) {
      const k0 = backOut(seg(t, l0 + .2, l0 + .6)) * (1 - ease(seg(t, l0 + 2.7, l0 + 3.0))), [cx, cy, k] = P.p(60, 120, 240), R = 120 * k * k0;
      if (R > 2) {
        X.save(); X.beginPath(); X.arc(cx, cy, R, 0, TAU); X.closePath(); X.fillStyle = '#1D2A4A'; X.fill(); X.clip();
        circle(cx + R * .45, cy - R * .45, R * .18, { fill: '#FFF4C8', stroke: null });
        for (let i = 0; i < 8; i++) { const px = cx - R + i * R * .3, ph = R * (.55 + .35 * hash(i + 3)); shape([[px - R * .17, cy + R], [px, cy + R - ph], [px + R * .17, cy + R]], { fill: '#0F1A30', stroke: null }); }
        for (let c = 0; c < 2; c++) { const u = frac((t - l0) / 1.3 + c * .5); catSil(cx - R * 1.2 + u * R * 2.4, cy + R * .35 - Math.sin(u * Math.PI) * R * .65, R * .26, .5 - u); }
        X.restore();
        circle(cx, cy, R, { fill: null, stroke: '#F4E7C5', lwPx: 5 });
      }
    }
    if (t > 64.2 && t < 65.6) {                                              // Wings of Fire: the dragon in the mural winks
      const [ex, ey, k] = P.p(81, 166, 1), w = on(t, 64.3, 65.1, .1);
      if (w > .3) { circle(ex, ey, 3.2 * k, { fill: '#7BC67E', stroke: null }); line([[ex - 2.6 * k, ey], [ex, ey + 1.4 * k], [ex + 2.6 * k, ey]], { stroke: PAL.ink, lwPx: Math.max(1.5, k * .9) }); }
      const sp = backOut(seg(t, 64.6, 64.9)) * (1 - ease(seg(t, 65.2, 65.6)));
      if (sp > 0) shape(starPts(ex + 10 * k, ey - 10 * k, 7 * k * sp, .3, 4), { fill: '#FFF6B0', stroke: PAL.ink, lwPx: 1.5 });
    }
    l0 = LINE.danny;                                                         // Cat Kid Comic Club: comic panels slam in around Danny
    if (t > l0 + .2 && t < l0 + 3.1) {
      const [cx, cy, k] = P.p(-75, 70, 290);
      [[-95, 75, -.08, '#FFE066', 'cat'], [95, 85, .07, '#7FD6F5', 'HA!'], [-5, 175, -.03, '#FF9BC2', 'star']].forEach(([dx, dy, rot, col, what], i) => {
        const kk = backOut(seg(t, l0 + .25 + i * .25, l0 + .5 + i * .25)) * (1 - ease(seg(t, l0 + 2.8, l0 + 3.1))); if (kk <= .01) return;
        const pw = 80 * k, ph = 62 * k;
        X.save(); X.translate(cx + dx * k, cy - dy * k); X.rotate(rot); X.scale(kk, kk);
        shape(rectPts(-pw / 2, -ph / 2, pw, ph), { fill: col, stroke: PAL.ink, lwPx: 5 });
        X.save(); X.globalAlpha = .25; for (let gx = 0; gx < 8; gx++) for (let gy = 0; gy < 6; gy++) circle(-pw / 2 + (gx + .5) * pw / 8, -ph / 2 + (gy + .5) * ph / 6, pw * .018, { fill: PAL.ink, stroke: null }); X.restore();
        const m = ph * .32;
        if (what === 'cat') { shape([[-m, 0], [-m * .9, -m], [-m * .3, -m * .55], [m * .3, -m * .55], [m * .9, -m], [m, 0], [m * .7, m * .7], [-m * .7, m * .7]], { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 3, smooth: .3 });
          circle(-m * .35, 0, m * .12, { fill: PAL.ink, stroke: null }); circle(m * .35, 0, m * .12, { fill: PAL.ink, stroke: null }); }
        if (what === 'HA!') { X.font = `${ph * .5}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineWidth = 6; X.strokeStyle = PAL.ink; X.strokeText('HA!', 0, 2); X.fillStyle = '#FFFFFF'; X.fillText('HA!', 0, 2); }
        if (what === 'star') shape(starPts(0, 0, m * 1.1, .45, 5), { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 3 });
        X.restore();
      });
    }
  }
  function popsFront(t, P, A, S) {
    const h = A.housam;                                                      // the spy shades drop onto Housam's nose
    if (h && t > LINE.housam + .2 && t < 71.2) {
      const s = S.housam, drop = (1 - backOut(seg(t, LINE.housam + .2, LINE.housam + .55))) * 10 * s, [e1, e2] = [h.eyeL, h.eyeR].sort((p, q) => p[0] - q[0]);
      X.save(); X.globalAlpha = 1 - ease(seg(t, 70.8, 71.2));
      for (const e of [e1, e2]) { shape(rectPts(e[0] - 1.3 * s, e[1] - .8 * s - drop, 2.6 * s, 1.5 * s), { fill: '#16161E', stroke: PAL.ink, lwPx: 2, smooth: .3 });
        line([[e[0] - .7 * s, e[1] - .5 * s - drop], [e[0] - .2 * s, e[1] - .1 * s - drop]], { stroke: rgba('#FFFFFF', .7), lwPx: 2 }); }
      line([[e1[0] + 1.2 * s, e1[1] - .5 * s - drop], [e2[0] - 1.2 * s, e2[1] - .5 * s - drop]], { stroke: '#16161E', lwPx: 3 });
      X.restore();
    }
    const l0 = LINE.jenna;                                                   // Wings of Fire: dragons swoop under the bunting
    if (t > l0 + .2 && t < l0 + 3.2) [[0, '#C0443F', 230], [.35, '#3E7FC1', 260], [.7, '#D9A441', 210]].forEach(([d0, col, z]) => {
      const u = seg(t, l0 + .2 + d0, l0 + 2.6 + d0); if (u <= 0 || u >= 1) return;
      const [x, y, k] = P.p(lerp(650, -750, u), 220 + 30 * Math.sin(u * 7) - 20 * u, z);
      dragonSil(x, y, 26 * k, .4 + .6 * Math.abs(Math.sin(t * 9 + d0 * 5)), col);
    });
  }

  // ---------- the library stage, for a camera: characters interleaved with the set by depth ----------
  function libGroup(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {};
    const list = Object.entries(CAST).map(([name, c]) => ({ name, c, a: libAt(name, t) })).filter(it => P.depth(it.a.z) > 40)
      .sort((p, q) => P.depth(q.a.z) - P.depth(p.a.z));
    layer(() => L.back(P, t, { ...LSET, splitZ: list.length ? list[0].a.z : undefined }), { blur });
    popsBehind(t, P);
    list.forEach((it, i) => {
      const [sx, sy, k] = P.p(it.a.x, 0, it.a.z), s = it.c.unit * k, pose = { ...it.c.pose(t), t };
      const draw = () => { A[it.name] = it.c.rig(sx, sy, s, pose); props(it.name, t, A[it.name], s, pose); };
      if (o.soft && o.soft[it.name]) layer(draw, { blur: o.soft[it.name] }); else draw();
      S[it.name] = s;
      L.front(P, t, { ...LSET, splitZ: it.a.z, toZ: i + 1 < list.length ? list[i + 1].a.z : undefined });
    });
    popsFront(t, P, A, S);
    libBoards(t, P);
    return { A, S, P };
  }
  const BOARD_L = [-500, 150, 330, 140];
  function libBoards(t, P) {
    const [sx, sy, k] = P.p(BOARD_L[0], BOARD_L[1], BOARD_L[2]), w = BOARD_L[3] * k;
    if (P.depth(BOARD_L[2]) < 60 || sx + w / 2 > W - 10 || sx - w / 2 < 10) return;
    for (const [kind, title, b0, b1] of LBOARDS) if (t > b0 && t < b1) safadiBoard(sx, sy, w * (1 - ease(seg(t, b1 - .25, b1))), seg(t, b0 + .1, b0 + 2.6), t, { kind, title });
  }
  function libExtras(t, A, S) {
    const a = A.alma, d = A.danny, s = A.safadi;
    if (a) sfx('Rawr!', a.head[0] - 7 * S.alma, a.top[1] - 1 * S.alma, 60, '#F4E7C5', t - LINE.alma - .8, { life: .9, rot: -.08 });
    if (d) sfx('POW!', d.head[0] - 8 * S.danny, d.top[1] - 2 * S.danny, 80, '#FFE066', t - LINE.danny - .6, { life: .9, rot: .1 });
    if (s) {
      sfx('fzzt...', s.head[0] + 8 * S.safadi, s.top[1], 42, '#9AA7B0', t - FIZZ[0] - .1, { life: .9 });
      sfx('tick', s.head[0] + 9 * S.safadi, s.top[1] - 2 * S.safadi, 36, '#FFFDF6', t - 72.8, { life: .5 });
      sfx('tock', s.head[0] + 10 * S.safadi, s.top[1] - 4 * S.safadi, 36, '#FFFDF6', t - 73.6, { life: .5 });
    }
  }

  // ---------- library cameras and shots ----------
  const ldrift = t => [10 * Math.sin(t * .21), 5 * Math.sin(t * .29)];
  const lcam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = ldrift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: -1 }; };
  const LIB_WIDE = lcam(0, 175, 1100, 470, 760);                             // over the front tables, down the aisle
  const POP = name => lcam(L_HOME[name][0], 120, 480, 527, 800);              // one kid and their story pop
  const POP_JENNA = lcam(150, 120, 480, 593, 700);                           // Jenna, the bunting and the mural dragon
  const KIDS4 = lcam(127, 120, 480, 600, 600);                               // the four kids
  const SAF_LIB = lcam(-420, 140, 480, 452, 800);                            // Safadi and his board
  const SAF_PUSH = t => ({ ...SAF_LIB(t), z: lerp(480, 455, ease(seg(t, 81.4, 94.0))) });
  const JENNA_CU = lcam(195, 120, 480, 358, 1300);
  const SAF_CU_L = t => ({ x: -330, y: 150, z: lerp(480, 500, seg(t, 110.2, 116.6)), f: 1000, hy: 440, dir: -1 });
  const lshot = (camFn, blur, bo, go) => t => { const { A, S } = libGroup(t, camFn(t), blur, go); bubbles(t, A, S, bo); libExtras(t, A, S); };
  const libWideShot = lshot(LIB_WIDE, 0, { size: 44, side: () => -1 });
  function libWide(t) {                                                      // the wipe from DCES slides off, revealing the library
    libWideShot(t);
    const u = seg(t, LIB0, LIB0 + .5); if (u >= 1) return;
    overlay(() => { const x = lerp(-300, W + 300, ease(u)); X.fillStyle = '#FFF4D6'; X.beginPath(); X.moveTo(x + 300, 0); X.lineTo(W + 10, 0); X.lineTo(W + 10, H); X.lineTo(x, H); X.closePath(); X.fill(); });
  }
  const kidSide = () => -1;
  const popHousam = lshot(POP('housam'), 2.2, { size: 56, side: kidSide, far: 300 });
  const popAlma = lshot(POP('alma'), 2.2, { size: 56, side: kidSide, far: 300 });
  const popJenna = lshot(POP_JENNA, 1.4, { size: 56, side: () => 1, far: 300 });
  const popDanny = lshot(POP('danny'), 2.2, { size: 56, side: () => 1, far: 300 });
  const kids4 = lshot(KIDS4, 1.6, { size: 52, side: () => 1, far: 260, groupDy: -170 });
  const safLib = lshot(SAF_LIB, 2.0, { size: 50, side: () => -1, far: 330, dy: -290 });
  const history = lshot(SAF_PUSH, 2.0, { size: 50, side: () => -1, far: 260, dy: -230 });
  const uhoh = lshot(JENNA_CU, 2.8, { size: 58, side: () => 1 });
  const bragShot = lshot(SAF_CU_L, 3.0, { size: 54, side: () => -1 });
  function brag(t) {                                                         // ... and a ripple-dissolve (to the study, once it's built)
    bragShot(t);
    const u = seg(t, RIPPLE[0], RIPPLE[1]); if (u <= 0) return;
    overlay(() => {
      for (let i = 0; i < 5; i++) { const r = (u * 1.4 - i * .14) * W; if (r <= 0) continue;
        X.save(); X.globalAlpha = .5 * (1 - u); X.strokeStyle = '#FFFDF6'; X.lineWidth = 18; X.beginPath(); X.ellipse(W / 2, H / 2, r, r * .6, 0, 0, TAU); X.stroke(); X.restore(); }
      X.fillStyle = rgba('#FFF4D6', ease(u)); X.fillRect(0, 0, W, H);
    });
  }

  // =====================================================================================================
  // ---------- part 3a: the study cutaway (desk view, night): Safadi writes all night, stamps THE END ----------
  const SST = LOCATIONS.safadi_study, SSET = { night: 1, lamp: 1, fire: 1 };
  const STACK = [118.6, 122.4], STAMP = 122.8, LIFT = 123.3, THROWS = [118.9, 120.7, 121.3, 121.9], CLOCK_SHOT = [119.6, 120.4];
  function safadiStudyPose(t) {
    const o = { dy: 1.4, mouth: 'flat', brows: 'focused', lookX: .1, lookY: .7, turn: 0, handL: [-4.4, -14.6], handPoseL: 'palm',
      handR: [4.2 + .5 * Math.sin(t * 13), -14.4 + .3 * Math.cos(t * 17)], handPoseR: 'fist' };
    if (t < 118.6) o.mouth = 'smile';
    for (const th of THROWS) if (t > th - .3 && t < th + .25) Object.assign(o, { handL: [-6, -26], handPoseL: 'fist', lookY: .2, mouth: 'frown', tilt: -.05 });
    if (t > 122.2 && t < LIFT) Object.assign(o, { handR: t < STAMP ? [3.4, -24.5] : [3.4, -16.8], handPoseR: 'fist', lookY: .6, brows: 'up', mouth: 'grin', sq: .05 * kick(t, STAMP, 8) });
    if (t > LIFT) Object.assign(o, { handL: [4.0, -19], handR: [8.0, -21], handPoseL: 'palm', handPoseR: 'palm', lookY: -.3, lookX: .6, turn: .2, eyes: 'happy', mouth: 'grin', brows: 'up', dy: 1.0 });
    return o;
  }
  const STK = { x0: 25, x1: 85, z0: 772, z1: 812, y: 78 };
  function stamped(cx, cy, k, kk, sy = .45) {                               // the red THE END stamp, k px per world unit
    X.save(); X.translate(cx, cy); X.scale(kk, kk * sy); X.rotate(-.12);
    shape(rectPts(-26 * k, -11 * k, 52 * k, 22 * k), { fill: null, stroke: '#D03A30', lwPx: Math.max(2, 1.6 * k) });
    X.font = `${11 * k}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#D03A30'; X.fillText('THE END', 0, k); X.restore();
  }
  function manuscript(P, t) {                                               // the stack of pages grows on the desk
    if (t > LIFT) return;
    const h = lerp(3, 34, ease(seg(t, STACK[0], STACK[1]))), y1 = STK.y + h;
    const fr = P.poly([[STK.x0, STK.y, STK.z0], [STK.x1, STK.y, STK.z0], [STK.x1, y1, STK.z0], [STK.x0, y1, STK.z0]]); if (fr) shape(fr, { fill: '#EDE6D2', stroke: PAL.ink, lwPx: 1.5 });
    for (let i = 1; i < h / 3; i++) { const a = P.p(STK.x0, STK.y + i * 3, STK.z0), b = P.p(STK.x1, STK.y + i * 3, STK.z0); line([[a[0], a[1]], [b[0], b[1]]], { stroke: rgba(PAL.ink, .22), lwPx: 1 }); }
    const tp = P.poly([[STK.x0, y1, STK.z0], [STK.x1, y1, STK.z0], [STK.x1, y1, STK.z1], [STK.x0, y1, STK.z1]]); if (tp) shape(tp, { fill: '#FBF8EE', stroke: PAL.ink, lwPx: 1.5 });
    for (let i = 0; i < 4; i++) { const a = P.p(STK.x0 + 8, y1 + .2, STK.z0 + 7 + i * 8), b = P.p(STK.x1 - 8 - 10 * hash(i), y1 + .2, STK.z0 + 7 + i * 8); line([[a[0], a[1]], [b[0], b[1]]], { stroke: rgba('#3B5BA8', .6), lwPx: 1 }); }
    if (t > STAMP) { const [cx, cy, k] = P.p((STK.x0 + STK.x1) / 2, y1 + .4, (STK.z0 + STK.z1) / 2); stamped(cx, cy, k * .9, backOut(seg(t, STAMP, STAMP + .2))); }
  }
  function paperBalls(P, t) {                                               // crumpled drafts fly over his shoulder
    for (const [i, th] of THROWS.entries()) {
      const u = seg(t, th, th + .9); if (u <= 0 || u >= 1) continue;
      const x = lerp(-40, -380 + i * 30, u), y = 150 + 170 * Math.sin(u * Math.PI) - 80 * u, z = lerp(900, 980, u); if (P.depth(z) < 30) continue;
      const [sx, sy, k] = P.p(x, y, z), r = 9 * k;
      X.save(); X.translate(sx, sy); X.rotate(t * 8 + i);
      circle(0, 0, r, { fill: '#F4F0E2', stroke: PAL.ink, lwPx: 1.6 });
      line([[-.55 * r, -.3 * r], [0, .2 * r], [.45 * r, -.45 * r]], { stroke: rgba(PAL.ink, .6), lwPx: 1.2 }); line([[-.45 * r, .55 * r], [.2 * r, .1 * r], [.6 * r, .45 * r]], { stroke: rgba(PAL.ink, .6), lwPx: 1.2 });
      X.restore();
    }
  }
  function studyGroup(t, cam, blur, tw = t) {
    const P = persp(cam), A = {}, S = {}, o = { ...SSET, tea: t < 121.0, splitZ: 930 };
    layer(() => SST.back(P, tw, o), { blur });
    const [sx, sy, k] = P.p(0, 0, 930), s = SAFADI_UNIT * k;
    A.safadi = safadi(sx, sy, s, { ...safadiStudyPose(t), t }); S.safadi = s;
    const hr = A.safadi.handR;
    if (t > 122.2 && t < 123.1) {                                            // the rubber stamp
      shape(rectPts(hr[0] - .45 * s, hr[1] - 2.2 * s, .9 * s, 2.0 * s), { fill: '#7A4A2A', stroke: PAL.ink, lwPx: 2 });
      shape(rectPts(hr[0] - 1.3 * s, hr[1] - .3 * s, 2.6 * s, .8 * s), { fill: '#D03A30', stroke: PAL.ink, lwPx: 2 });
    } else if (t < 122.2) line([[hr[0] - .2 * s, hr[1] - .4 * s], [hr[0] - 1.6 * s, hr[1] + 1.6 * s]], { stroke: '#2B2B3A', lwPx: Math.max(2, .35 * s) });   // the pen
    SST.front(P, tw, o);
    manuscript(P, t); paperBalls(P, t);
    if (t > LIFT) {                                                          // the finished manuscript, held up to the lamp
      const a = A.safadi.handL, b = A.safadi.handR, cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - 1.5 * s, w = 6.4 * s, h = 8.2 * s;
      X.save(); X.translate(cx, cy); X.rotate(.03 * Math.sin(t * 3));
      shape(rectPts(-w / 2 + .2 * s, -h / 2 + .25 * s, w, h), { fill: '#EDE6D2', stroke: PAL.ink, lwPx: 2 });
      shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#FBF8EE', stroke: PAL.ink, lwPx: 2.5 });
      for (let i = 0; i < 6; i++) line([[-w * .35, -h * .3 + i * h * .08], [w * (.35 - .15 * hash(i + 4)), -h * .3 + i * h * .08]], { stroke: rgba('#3B5BA8', .6), lwPx: 1.5 });
      stamped(0, h * .25, s / 6 * 1.2, 1, 1);
      X.restore();
      if (t > LIFT + .2) sfx('ta-da!', cx + 6 * s, cy - 6 * s, 54, '#FFD66B', t - LIFT - .2, { life: .9, rot: -.08 });
    }
    return { A, S, P };
  }
  const scam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = ldrift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const STUDY_WIDE = scam(0, 165, 60, 560, 650), STUDY_MED = scam(0, 140, 560, 570), STUDY_CLOCK = scam(-260, 150, 660, 600), STUDY_CU = scam(0, 140, 690, 590, 1100);
  const sshot = (camFn, blur, warp) => t => { studyGroup(t, camFn(t), blur, warp ? warp(t) : t); };   // no dialogue in the montage
  const studyEstShot = sshot(STUDY_WIDE, 0);
  function studyEst(t) {                                                     // the ripple clears into the study
    studyEstShot(t);
    const u = seg(t, RIPPLE[1], RIPPLE[1] + .6); if (u >= 1) return;
    overlay(() => { X.fillStyle = rgba('#FFF4D6', 1 - ease(u)); X.fillRect(0, 0, W, H); });
  }
  const studyDesk = sshot(STUDY_MED, 1.6);
  const studyClockShot = sshot(STUDY_CLOCK, 1.2, t => CLOCK_SHOT[0] + (t - CLOCK_SHOT[0]) * 1800);   // time-lapse: the hands spin
  function studyClock(t) { studyClockShot(t); sfx('tick-tock-tick-tock', W * .7, H * .2, 46, '#FFFDF6', t - CLOCK_SHOT[0] - .05, { life: .7, rot: -.05 }); }
  const studyCUShot = sshot(STUDY_CU, 2.4);
  function studyStamp(t) {
    studyCUShot(t);
    if (t > STAMP - .05 && t < STAMP + .6) { flash(.35 * kick(t, STAMP, 10)); sfx('KA-CHUNK!', W * .62, H * .3, 84, '#D03A30', t - STAMP, { life: .6, rot: .08 }); }
    const u = seg(t, 123.6, 124.2); if (u > 0) overlay(() => { X.fillStyle = rgba('#FFF4D6', ease(u)); X.fillRect(0, 0, W, H); });   // ripple back to the library
  }

  // ---------- part 3b: back in the library: his books, the book fair, the whisper, the cliffhanger ----------
  const SB = [124.2, 127.6, 131.0], CUT = 132.6, HUG = 138.0, SURE = 141.6, HUD = [145.4, 148.4], WORRY = 148.6, SEE = 151.0, GULP = 153.0, FREEZE = 154.0;
  const SBOOK = [['MATHEMATICS', '#3E6FB0', 'sigma'], ['PHYSICS', '#C0443F', 'apple'], ['ASTRONOMY', '#6B4AA8', 'saturn']];
  function safadiCover(x, y, w, ang, i, k = 1) {                             // PROFESSOR SAFADI EXPLAINS…, with his big face on it
    if (k <= .01) return;
    const [subj, col, icon] = SBOOK[i], h = w * 1.38;
    X.save(); X.translate(x, y); X.rotate(ang); X.scale(k, k);
    shape(rectPts(-w / 2 + w * .05, -h / 2 + w * .05, w, h), { fill: '#F4EEDD', stroke: PAL.ink, lwPx: 2 });
    shape(rectPts(-w / 2, -h / 2, w, h), { fill: col, stroke: PAL.ink, lwPx: 3 });
    shape(rectPts(-w / 2, -h / 2, w * .1, h), { fill: rgba('#000000', .2), stroke: null });
    X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    const txt = (s, ty, size, fill) => { X.font = `${size}px ${FONT_SFX}`; X.lineWidth = Math.max(2, size * .18); X.strokeStyle = PAL.ink; X.strokeText(s, w * .04, ty); X.fillStyle = fill; X.fillText(s, w * .04, ty); };
    txt('PROFESSOR SAFADI', -h * .4, w * .095, '#FFFDF4'); txt('EXPLAINS', -h * .32, w * .095, '#FFFDF4');
    const fy = -h * .02, fr = w * .27;                                       // the face
    circle(w * .04, fy, fr, { fill: '#F3C6A8', stroke: PAL.ink, lwPx: 2 });
    shape([[w * .04 - fr, fy - fr * .1], [w * .04 - fr * .8, fy - fr * .85], [w * .04 + fr * .3, fy - fr * 1.05], [w * .04 + fr, fy - fr * .3], [w * .04 + fr * .5, fy - fr * .55], [w * .04 - fr * .3, fy - fr * .5]], { fill: '#2E221D', stroke: PAL.ink, lwPx: 1.5, smooth: .4 });
    circle(w * .04 - fr * .35, fy + fr * .05, fr * .1, { fill: PAL.ink, stroke: null }); circle(w * .04 + fr * .35, fy + fr * .05, fr * .1, { fill: PAL.ink, stroke: null });
    line([[w * .04 - fr * .35, fy + fr * .45], [w * .04, fy + fr * .6], [w * .04 + fr * .35, fy + fr * .45]], { stroke: PAL.ink, lwPx: 2 });
    txt(subj, h * .35, w * (subj.length > 9 ? .12 : .15), '#FFD66B');
    const ix = w * .33, iy = h * .17, ir = w * .1;                           // the subject icon
    if (icon === 'sigma') txt('∑', iy, w * .2, '#7FE3FF');
    if (icon === 'apple') { circle(ix, iy, ir, { fill: '#E0584E', stroke: PAL.ink, lwPx: 1.5 }); line([[ix, iy - ir], [ix + ir * .3, iy - ir * 1.5]], { stroke: PAL.ink, lwPx: 2 }); }
    if (icon === 'saturn') { circle(ix, iy, ir, { fill: '#F2C14E', stroke: PAL.ink, lwPx: 1.5 }); shape(ellPts(ix, iy, ir * 1.8, ir * .45, 24, -.3), { fill: null, stroke: PAL.ink, lwPx: 2 }); }
    X.restore();
  }
  function safadiBooks(t, A, s, pose) {                                      // the books from his jacket, and their little tricks
    const n = pose.sbooks || 0; if (!n) return;
    const w = 4.4 * s;
    if (t < HUG) {
      for (let i = 0; i < n - 1; i++) safadiCover(A.handL[0] - .4 * s + i * .25 * s, A.handL[1] - 1.6 * s - i * .3 * s, w * .9, -.35 + i * .06, i);   // tucked under the left arm
      const i = n - 1, k = backOut(seg(t, SB[i], SB[i] + .3)), bx = A.handR[0] + .5 * s, by = A.handR[1] - .42 * w * 1.38;
      safadiCover(bx, by, w, .1, i, k);
      if (i === 0 && t < SB[1]) for (let j = 0; j < 6; j++) {                // formulas swirl off MATHEMATICS
        const a = t * 2.2 + j * TAU / 6, u = seg(t, SB[0] + .2, SB[0] + .8);
        X.save(); X.globalAlpha = u * (1 - seg(t, SB[1] - .5, SB[1])); X.font = `${1.4 * s}px ${SF_CHALK}`; X.fillStyle = '#7FE3FF'; X.textAlign = 'center';
        X.shadowColor = '#7FE3FF'; X.shadowBlur = 10; X.fillText(['∑', 'π', '√x', 'x²', '∞', '='][j], bx + Math.cos(a) * w * .95, by + Math.sin(a) * w * .8); X.restore();
      }
      if (i === 1 && t < SB[2]) {                                            // an apple drops onto PHYSICS
        const u = easeIn(seg(t, 127.9, 128.2)), ay = lerp(by - 12 * s, by - .69 * w - .55 * s, u) - .6 * s * kick(t, 128.2, 9) * (t > 128.2 ? 1 : 0);
        circle(bx + .2 * s, ay, .62 * s, { fill: '#E0584E', stroke: PAL.ink, lwPx: 2 }); line([[bx + .2 * s, ay - .62 * s], [bx + .4 * s, ay - 1.0 * s]], { stroke: PAL.ink, lwPx: 2.5 });
        shape([[bx + .4 * s, ay - .9 * s], [bx + .9 * s, ay - 1.1 * s], [bx + .5 * s, ay - .75 * s]], { fill: '#6DAE4B', stroke: PAL.ink, lwPx: 1.5 });
      }
      if (i === 2) for (let j = 0; j < 3; j++) {                             // tiny planets orbit ASTRONOMY
        const a = t * (1.6 + j * .5) + j * 2, rx = w * (.75 + j * .12), ry = w * (.3 + j * .05);
        circle(bx + Math.cos(a) * rx, by + Math.sin(a) * ry, (.3 + .1 * j) * s, { fill: ['#7FE3FF', '#F29A3A', '#94C962'][j], stroke: PAL.ink, lwPx: 1.5 });
      }
    } else {                                                                 // hugging all three
      const cx = (A.handL[0] + A.handR[0]) / 2, cy = (A.handL[1] + A.handR[1]) / 2 - 1.8 * s;
      for (let i = 0; i < 3; i++) safadiCover(cx + (i - 1) * .5 * s, cy - (2 - i) * .25 * s, w * .9, (i - 1) * .06, i);
    }
  }
  function safadiPart3(t, o, set, talk) {
    if (t < SB[0]) return;
    set({ power: 0, bulb: 0, eyes: 'open', lean: 0, tilt: 0, lookY: 0, brows: 'up', mouth: talk ? o.mouth : 'smile', lookX: -.6, turn: -.3, emoteK: 0 });
    const n = SB.filter(b => t > b - .05).length; o.sbooks = n;
    if (t < HUG) {
      const b0 = SB[n - 1], u = ease(seg(t, b0, b0 + .35));
      set({ handR: mixPt([1.6, -13], [5.6, -21], u), handPoseR: 'fist', handL: [-3.6, -11.5], handPoseL: 'fist', lookX: -.2, turn: 0, eyes: talk ? 'open' : 'happy' });
      if (t > CUT) set({ mouth: 'O', eyes: 'wide', emote: '!', emoteK: on(t, CUT, CUT + 1.2, .15), lookX: -.8, turn: -.35, jump: .4 * kick(t, CUT + .05, 6) });
      if (t > CUT + 1.0) set({ mouth: talk ? o.mouth : 'smile', eyes: 'open' });
    } else {
      set({ handL: [-2.0, -13.0], handR: [2.0, -13.0], handPoseL: 'fist', handPoseR: 'fist', lookX: -.5, lookY: -.15, mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (t > SURE && t < HUD[0]) set({ lookX: 0, turn: 0, eyes: talk ? 'open' : 'happy', mouth: talk ? o.mouth : 'grin' });
      if (t > HUD[0] && t < WORRY) set({ lookX: -.8, turn: -.35, brows: 'quizzical', mouth: 'smile' });
      if (t > WORRY) set({ lookX: -.7, turn: -.3, brows: 'worried', mouth: talk ? o.mouth : 'wobble', emote: 'sweat', emoteK: on(t, WORRY + .2, 170, .2) });
      if (t > GULP) set({ lookX: 0, turn: 0, eyes: 'wide', mouth: 'wobble', sq: .06 * kick(t, GULP + .2, 5) });
    }
  }
  const MOUTH_Y = { housam: -20, jenna: -18, alma: -12, danny: -16 };
  function kidPart3(name, t, o, set, talk) {
    if (t < SB[0]) return;
    set({ lookX: .8, turn: .4, dy: 0, brows: 'up', mouth: talk ? o.mouth : 'smile', eyes: 'open', tilt: 0 });
    if (name === 'danny' && t > 128.2 && t < 131.0) set({ lookY: -.5, mouth: 'o', eyes: 'wide' });          // eyeing that apple
    const ask = { alma: CUT, jenna: 133.6, housam: 135.6 }[name];
    if (ask && t > ask && t < ask + 1.6) set({ handL: [-4.6, name === 'alma' ? -15 : -21], handPoseL: 'palm', jump: .4 * kick(t, ask + .05, 6), mouth: talk ? o.mouth : 'grin' });
    if (t > HUG && t < HUD[0]) set({ brows: 'normal', mouth: 'smirk' });
    const hk = on(t, HUD[0], HUD[1], .35);
    if (hk > 0) {                                                             // the huddle: turn in to each other and whisper
      const toward = L_HOME[name][0] > 127 ? 1 : -1;
      set({ lookX: .9 * toward, turn: .5 * toward * hk, tilt: .1 * toward * hk, mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (name !== 'jenna') set({ handL: [toward * 1.4, MOUTH_Y[name]], handPoseL: 'palm' });
      if (name === 'danny') set({ eyes: 'happy', dy: .2 * bounce(t, 12) * hk });
    }
    if (t > HUD[1] && t < SEE) set({ lookX: .8, turn: .35, eyes: 'happy', mouth: 'smile', brows: 'up' });       // sweet, innocent smiles
    if (t > SEE) set({ eyes: t < 152.6 ? 'wink' : 'happy', mouth: 'grin', lookX: .25, turn: .1, brows: 'up' });
  }
  const huddleX = (name, x, t) => name === 'safadi' ? x : lerp(x, 127 + (x - 127) * .6, on(t, HUD[0] - .1, HUD[1] + .5, .4));

  const SAF_W = lcam(-290, 140, 480, 452, 800);                              // Safadi and his books, Danny at the frame edge
  const SAF_CU3 = t => ({ x: -330, y: 150, z: 490, f: 1000, hy: 440, dir: -1 });
  const SAF_SURE = t => { const a = SAF_LIB(t), b = SAF_CU3(t), u = ease(seg(t, 140.6, 141.8)); return { ...a, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u) }; };
  const WINK_CAM = t => ({ ...KIDS4(t), z: lerp(480, 455, ease(seg(t, SEE, SEE + 1.2))) });
  const booksShot = lshot(SAF_W, 2.0, { size: 50, side: () => -1, far: 330, dy: -280 });
  function books(t) {                                                       // the cream ripple clears
    booksShot(t);
    const u = seg(t, SB[0], SB[0] + .4); if (u < 1) overlay(() => { X.fillStyle = rgba('#FFF4D6', 1 - ease(u)); X.fillRect(0, 0, W, H); });
  }
  const safSure = lshot(SAF_SURE, 2.0, { size: 52, side: () => -1, far: 330, dy: -280 });
  const huddle = lshot(KIDS4, 1.6, { size: 52, side: () => 1, far: 220, dy: -180 });
  const worry = lshot(SAF_CU3, 3.0, { size: 54, side: () => -1 });
  const wink = lshot(WINK_CAM, 1.8, { size: 56, groupDy: -150 });
  const gulp = lshot(SAF_CU3, 3.0, { size: 54, side: () => -1 });
  function tbc(t) {                                                          // freeze on his face, the card, the iris
    const tt = Math.min(t, FREEZE);
    worry(tt);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .5 * k; X.fillStyle = '#C9A46A'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4D6', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#3E6FB0'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 156.6, 157.8))));
  }

  scene({ duration: END, fps: 24, bpm: 108,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [3.6, lineup], [9.6, saf], [14.0, kids], [19.6, saf], [23.4, kids], [27.0, saf], [30.8, kids],
      [34.6, saf], [38.4, yawn], [41.0, five], [43.2, kids], [49.0, lineup], [52.4, tow],
      [LIB0, libWide], [55.8, popHousam], [59.0, popAlma], [62.2, popJenna], [65.4, popDanny], [68.6, kids4], [71.0, safLib],
      [80.4, uhoh], [81.4, history], [94.0, safLib], [108.0, kids4], [110.2, brag],
      [116.6, studyEst], [118.6, studyDesk], [CLOCK_SHOT[0], studyClock], [CLOCK_SHOT[1], studyDesk], [122.6, studyStamp],
      [124.2, books], [132.6, kids4], [138.0, safSure], [145.4, huddle], [148.6, worry], [151.0, wink], [153.0, gulp], [154.0, tbc],
    ] });
})();
