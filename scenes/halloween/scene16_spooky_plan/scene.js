// Scene 16: "The Spooky Plan". Alma's house, an October afternoon (the House set with season: 'autumn').
// Alma and Jenna plan their Halloween decorations; Jenna's pencil doodles pop up over the real house. Safadi walks up the
// garden walk, hears it's all about the candy and lectures on healthy food. Behind his back the girls whisper up
// Robo-Safadi (red eyes: BZZT). "...What's so funny?" "You shall see!" Freeze. To be continued.
// Blocking (world units): Alma (−240, 2000), Jenna (−60, 2000), Safadi walks in from the garden walk to (270, 2060).
// Every shot is a pure function of t.
(() => {
  const R = LOCATIONS.house, LINES = ASSETS.scene.scene16_spooky_plan.dialogue, SET = { season: 'autumn' };
  const ACCENT = { alma: '#994EC4', jenna: '#D0508E', safadi: PAL.crimson };

  // ---------- timing ----------
  const DRAW = [[9.4, 11.0], [12.8, 14.4], [15.8, 17.2], [18.4, 20.0], [21.4, 23.0], [27.6, 29.2], [30.9, 32.5], [79.2, 81.8]];
  const GIRAFFE = [30.4, 33.8], CUTE = 34.0, WALK = [35.0, 38.4], POWER = [57.6, 86.8], EYES = 82.0, GIGGLE = [85.4, 89.4];
  const FREEZE = 95.4, END = 100;
  // the decoration doodles, pinned to the house: [kind, X, Y, Z, height, drawn from, seed, opts]
  const TRAD = [
    ['ghost', -720, 330, 2760, 260, 9.6, 0], ['ghost', 900, 260, 2830, 220, 10.0, 1.3, { flip: true }],
    ['spider', -110, 190, 2700, 330, 13.0, 0],
    ['cat', -200, 60, 2640, 115, 16.0, 0], ['cat', 40, 60, 2640, 115, 16.3, .4, { flip: true }],
    ['pumpkin', 330, 48, 2600, 95, 18.6, 0], ['pumpkin', 680, 48, 2600, 95, 18.9, 1], ['pumpkin', 1030, 48, 2600, 95, 19.2, 2],
    ['witch', -820, 1120, 3150, 300, 21.6, 0],
  ];
  const FAVS = [['dolphin', -470, 300, 2150, 150, 27.8, 0], ['giraffe', 190, 300, 2150, 260, 31.0, 0]];
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inAny = (t, wins) => wins.some(([a, b]) => t > a && t < b);
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker; return who; };
  const SIDE = { alma: -1, jenna: -.4, safadi: 1 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.4, -.85, .85);

  // ---------- where everyone stands ----------
  function safadiAt(t) {                                                     // along the garden walk, then across the lawn
    const u = ease(seg(t, WALK[0], WALK[1])), L1 = 490, L2 = Math.hypot(490, 570), d = u * (L1 + L2);
    const [x, z] = d < L1 ? [lerp(1250, 760, d / L1), lerp(2640, 2630, d / L1)] : [lerp(760, 270, (d - L1) / L2), lerp(2630, 2060, (d - L1) / L2)];
    return { x, z, p: d / 58, moving: t > WALK[0] && t < WALK[1] };
  }
  const AT = { alma: () => ({ x: -240, z: 2000 }), jenna: () => ({ x: -60, z: 2000 }), safadi: safadiAt };
  const SHOWN = { safadi: t => t > WALK[0] };

  // ---------- poses ----------
  function almaPose(t) {
    const talk = speaking('alma', t), ls = lastLine(t, 'alma');
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('alma', ls), turn: .2 * Math.sign(lookAt('alma', ls)), brows: 'normal',
      handL: [-2.6, -7.6], handR: [2.6, -7.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < 9.0) { if (t > 3.6 && t < 6.0) set({ handL: [-3.8, -15], handR: [3.8, -15], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', jump: .6 * kick(t, 3.7, 6), brows: 'up' }); }
    else if (t < 24.4) {                                                      // calling out ideas, acting each one
      if (!talk && t > 11.8) o.lookX = .6;                                    // watching Jenna draw
      if (t > 9.2 && t < 11.8) set({ handL: [-4.2, -16.5 + Math.sin(t * 6)], handR: [4.2, -16.5 - Math.sin(t * 6)], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'O', brows: 'up' });
      if (t > 15.6 && t < 17.6) set({ handL: [-3.4, -13], handR: [3.4, -13], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', mouth: talk ? o.mouth : 'grin', tilt: -.08 });
      if (t > 20.8 && t < 24.2) set({ eyes: t > 22.4 ? 'happy' : 'open', mouth: talk ? o.mouth : 'grin', dy: t > 22.4 ? .25 * Math.abs(Math.sin(t * 12)) : 0, handL: [-.8, -12.6], handR: [.8, -12.6], handPoseL: 'fist', handPoseR: 'fist' });
    } else if (t < 36) {
      if (t > 24.6 && t < 27.0) set({ mouth: 'flat', lookX: .6, brows: 'worried' });
      if (t > 27.0 && t < 30.4) set({ eyes: 'star', handL: [-.9, -13.6], handR: [.9, -13.6], handPoseL: 'fist', handPoseR: 'fist', brows: 'up', jump: .8 * kick(t, 27.2, 5) });
      if (t > 30.4 && t < 33.8) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: .7 });
      if (t > 33.8 && t < 35.6) set({ handL: [-4.4, -19], handR: [4.4, -19], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 2.2 * Math.sin(Math.PI * seg(t, 33.9, 34.5)) });
    } else if (t < 57.6) {
      if (t > 35.6 && t < 38.4) set({ lookX: .85, turn: .4, brows: 'up', emote: '!', emoteK: on(t, 35.8, 37.0, .15) });
      if (t > 46.8 && t < 48.6) set({ handL: [-4.4, -19], handR: [4.4, -19], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', jump: 1.6 * kick(t, 47.0, 4) });
      if (t > 48.8 && t < 51.4) set({ mouth: talk ? o.mouth : 'o', brows: 'worried', handL: [-.6, -10.6], handR: [.6, -10.6], handPoseL: 'fist', handPoseR: 'fist' });
      if (t > 51.4 && t < 54.4) set({ handR: [3.3, -18.6], handPoseR: 'point', brows: 'up', tilt: .08 });
      if (t > 54.6 && t < 57.6) set({ eyes: t > 56.6 ? 'squeeze' : 'open', mouth: 'frown', brows: 'worried' });
    } else if (t < 73.0) {                                                    // the lecture: wilting
      const w = ease(seg(t, 60, 64));
      set({ dy: .5 * w, lookX: .7, lookY: .25 * w, mouth: 'flat', brows: 'worried', tilt: .1 * w, handL: [-2.2, -6.4], handR: [2.2, -6.4] });
      if (t > 66 && t < 69) o.blink = .55;
      if (t > 65.6 && t < 67) o.mouth = 'o';
    } else if (t < 85.4) {                                                    // the whisper, then the page
      set({ lean: .1, tilt: .14, lookX: .9, turn: .5, handR: [2.4, -14.8], handPoseR: 'palm', mouth: talk ? o.mouth : 'smirk', brows: 'up' });
      if (t > 79.0) set({ lookY: .5, handR: [2.6, -7.6], lean: .06, mouth: t > EYES ? 'grin' : 'o', eyes: t > EYES ? 'happy' : 'wide', handPoseR: 'open' });
    } else {
      if (t < GIGGLE[1]) set({ handL: [-.7, -12.9], handR: [.7, -12.9], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', dy: .2 * Math.abs(Math.sin(t * 13)), tilt: .05 * Math.sin(t * 9) });
      else set({ eyes: t > 91.8 && t < 93.6 ? 'wink' : 'happy', mouth: talk ? o.mouth : 'grin', handL: [-1.6, -5.4], handR: [1.6, -5.4], lookX: .3, tilt: -.06 });
    }
    return o;
  }
  function jennaPose(t) {
    const talk = speaking('jenna', t), ls = lastLine(t, 'jenna'), drawing = inAny(t, DRAW);
    const o = { giraffe: false, mouth: lipFlap(t, talk, 'smile'), lookX: lookAt('jenna', ls), turn: .2 * Math.sign(lookAt('jenna', ls)), brows: 'up',
      handL: [-2.2, -13.6], handR: [1.6, -14.6], handPoseL: 'grip', handPoseR: 'fist', book: true };
    const set = p => Object.assign(o, p);
    if (drawing) set({ handR: [1.6 + .45 * Math.sin(t * 15), -14.4 + .35 * Math.cos(t * 11)], lookX: -.15, lookY: .55, mouth: talk ? o.mouth : 'smile' });
    if (t > 6.2 && t < 8.6) set({ handR: [3.2, -19], handPoseR: 'point', jump: .5 * kick(t, 6.3, 6) });
    if (t > 24.6 && t < 27.0) set({ handR: [1.0, -18.6], lookX: .3, lookY: -.4, brows: 'worried', mouth: talk ? o.mouth : 'flat' });
    if (t > GIRAFFE[0] && t < GIRAFFE[1]) set({ giraffe: true, book: false, handL: [-3.6, -20 + .4 * Math.sin(t * 5)], handPoseL: 'grip', handR: [3.0, -12], handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .6 * kick(t, 30.6, 5) });
    if (t > 33.8 && t < 35.6) set({ handL: [-4.2, -20], handR: [4.4, -20], handPoseL: 'grip', handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 2.2 * Math.sin(Math.PI * seg(t, 33.9, 34.5)) });
    if (t > 35.6 && t < 38.4) set({ lookX: .85, turn: .4 });
    if (t > 46.8 && t < 48.6) set({ handR: [4.4, -20], handPoseR: 'fist', eyes: 'happy', jump: 1.6 * kick(t, 47.0, 4) });
    if (t > 56.8 && t < 57.8) set({ lookX: -.8, turn: -.4, brows: 'worried' });
    if (t > 58 && t < 73) { const w = ease(seg(t, 61, 65)); set({ dy: .5 * w, lookX: .6, lookY: .2 * w, mouth: talk ? o.mouth : 'flat', brows: 'worried', tilt: -.08 * w }); if (t > 67.5 && t < 68.5) o.eyes = 'closed'; }
    if (t > 73 && t < 79) set({ lean: -.08, tilt: -.12, lookX: -.85, turn: -.5, mouth: talk ? o.mouth : 'grin', brows: 'up' });
    if (t > 79 && t < 85.4) set({ lookX: -.2, lookY: .55, mouth: t > EYES ? 'grin' : 'smile', eyes: t > EYES ? 'happy' : 'open' });
    if (t > GIGGLE[0] && t < GIGGLE[1]) set({ handR: [.6, -19.6], handPoseR: 'fist', eyes: 'happy', dy: .2 * Math.abs(Math.sin(t * 13 + 1)), tilt: -.05 * Math.sin(t * 9) });
    if (t > GIGGLE[1]) set({ eyes: t > 91.8 && t < 93.6 ? 'wink' : 'happy', mouth: talk ? o.mouth : 'grin', lookX: .4, tilt: .06 });
    return o;
  }
  function safadiPose(t) {
    const talk = speaking('safadi', t), at = safadiAt(t), pw = on(t, POWER[0], POWER[1], .5);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.6, turn: -.3, brows: 'normal', handL: [-3.4, -8.4], handR: [3.4, -8.4], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (at.moving) return Object.assign(o, safadiWalk(at.p, 1), { handL: [-3.2, -6.6], handR: [3.2, -6.6], lookX: -.4, turn: -.3, mouth: 'smile' });
    if (t > 38.4 && t < 41.0) set({ handR: [5.6, -19 + .6 * Math.sin(t * 8)], handPoseR: 'palm', mouth: talk ? o.mouth : 'grin', brows: 'up' });
    if (t > 43.8 && t < 46.8) set({ brows: 'quizzical', handL: [-1.4, -16.4], handPoseL: 'point' });
    if (t > 47.0 && t < 48.8) set({ eyes: t < 47.4 ? 'squeeze' : 'wide', mouth: 'O', brows: 'up', jump: .5 * kick(t, 47.1, 6) });
    if (t > 48.8 && t < 51.5) set({ brows: 'up', lookX: -.85, handL: [-3.8, -12], handPoseL: 'palm' });
    if (t > 51.5 && t < 54.6) set({ brows: 'quizzical', mouth: talk ? o.mouth : 'smirk' });
    if (t > 54.6 && t < 57.6) set({ mouth: talk ? o.mouth : 'smile', handR: [3.0, -19.6], handPoseR: 'point', lookX: -.5, brows: 'up' });
    if (pw > 0) {                                                             // the lecture: powers on, the pointer at the board
      set({ power: pw, eyes: pw > .5 ? 'glow' : 'open', handR: [6.4, -16.8], handPoseR: 'pointer', pointerAng: -.55 + .08 * Math.sin(t * 1.3), handL: [-4.4, -13.6], handPoseL: 'palm', lookX: .2, turn: .1 });
      if (t > 69 && t < 85.4) set({ turn: .75, lookX: .95, lookY: -.25 });   // to the board, his back half-turned to the girls
      if (t > 77.6 && t < 80.4) set({ handL: [-3.0, -19.4], handPoseL: 'point' });
    }
    if (t > 85.4 && t < 87.2) set({ turn: .75 - .75 * ease(seg(t, 86.4, 87.2)), lookX: lerp(.95, -.7, ease(seg(t, 86.4, 87.2))), mouth: talk ? o.mouth : 'flat' });
    if (t > 87.2) set({ brows: 'quizzical', lookX: -.75, turn: -.35, handR: [3.6, -17.4], handPoseR: 'palm', emote: '?', emoteK: on(t, 87.3, 90.5, .2) });
    if (t > 93.4) set({ lookX: 0, turn: 0, lookY: -.05, emote: 'sweat', emoteK: on(t, 93.6, 99, .2), mouth: 'flat', handR: [3.4, -8.4] });
    return o;
  }
  const CAST = { alma: { pose: almaPose, rig: alma, unit: ALMA_UNIT }, jenna: { pose: jennaPose, rig: jenna, unit: JENNA_UNIT }, safadi: { pose: safadiPose, rig: safadi, unit: SAFADI_UNIT } };
  const HEADW = { alma: 6.8, jenna: 4.4, safadi: 6.6 };

  // ---------- the props in Jenna's hands ----------
  function jennaProps(t, A, s, P, at) {
    const pose = jennaPose(t);
    if (pose.book) {
      spkSketchbook(A.handL[0] + s * 2.0, A.handL[1] + s * 1.6, s * 7.4, -.1, { facing: 'back' });
      if (!(t > 33.8 && t < 35.6) && !(t > 46.8 && t < 48.6) && !(t > GIGGLE[0] && t < GIGGLE[1])) spkPencil(A.handR[0] - s * .2, A.handR[1] + s * .3, s * 3.4, -1.9 + (inAny(t, DRAW) ? .2 * Math.sin(t * 15) : 0));
    } else {                                                                 // the book waits on the grass
      const x = at.x + 55, z = at.z - 25, q = P.poly([[x - 27, .5, z - 18], [x + 27, .5, z - 18], [x + 27, .5, z + 18], [x - 27, .5, z + 18]]);
      if (q) shape(q, { fill: SPK.cover, stroke: PAL.ink, lwPx: 1.5 });
    }
  }

  // ---------- the whole stage, for a camera ----------
  function group(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {}, split = o.splitZ ?? 1950;
    layer(() => R.back(P, t, { ...SET, splitZ: split }), { blur });
    doodlesBehind(t, P);
    const items = [];
    for (const [name, c] of Object.entries(CAST)) {
      if (SHOWN[name] && !SHOWN[name](t)) continue;
      const at = AT[name](t); if (P.depth(at.z) < 60) continue;
      items.push({ z: at.z, draw: () => {
        const [sx, sy, k] = P.p(at.x, 0, at.z), s = c.unit * k, pose = { ...c.pose(t), t };
        if (o.freeze) pose.boil = 0;
        const draw = () => { A[name] = c.rig(sx, sy, s, pose); if (name === 'jenna') jennaProps(t, A[name], s, P, at); };
        if (o.soft && o.soft[name]) layer(draw, { blur: o.soft[name] }); else draw();
        S[name] = s;
      } });
    }
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(it => it.draw());
    R.front(P, t, { ...SET, splitZ: split });
    doodlesFront(t, P);
    boards(t, P);
    return { A, S, P };
  }
  // the house doodles: drawn on, held, then gone when Jenna decides "everybody has those"; the favourites until SPOOKY-CUTE
  const pin = (P, d, t, alpha) => { const [kind, X0, Y0, Z0, h, t0, seed, op] = d, [sx, sy, k] = P.p(X0, Y0, Z0); if (P.depth(Z0) > 30) spkDoodle(kind, sx, sy, h * k, seg(t, t0, t0 + 1.4), t + seed, { ...op, alpha }); };
  function doodlesBehind(t, P) { if (t < 26.2) { const a = 1 - ease(seg(t, 25.0, 26.0)); TRAD.forEach(d => pin(P, d, t, a)); } }
  function doodlesFront(t, P) {
    if (t > 27.6 && t < 36) {
      const a = 1 - ease(seg(t, 34.9, 35.8)), b = 1 + .12 * kick(t, CUTE, 5) * Math.cos((t - CUTE) * 18);
      FAVS.forEach(([kind, X0, Y0, Z0, h, t0, seed, op]) => { const [sx, sy, k] = P.p(X0, Y0, Z0); spkDoodle(kind, sx, sy, h * k * b, seg(t, t0, t0 + 1.5), t + seed, { ...op, alpha: a }); });
    }
    if (t > 25.0 && t < 26.2) { const [sx, sy] = P.p(-100, 400, 2700); sfx('POOF!', sx, sy, 90, '#FFFDF6', t - 25.2, { life: .8 }); }
  }
  // Safadi's boards float beside him (world-anchored, so every shot agrees where they are)
  const BOARD = [600, 240, 2100, 260];
  function boards(t, P) {
    if (t < 58 || t > POWER[1]) return;
    const [sx, sy, k] = P.p(BOARD[0], BOARD[1], BOARD[2]), w = BOARD[3] * k;
    if (P.depth(BOARD[2]) < 60 || sx + w / 2 > W - 10 || sx - w / 2 < 10) return;               // only when it fits in frame
    if (t < 65.2) safadiBoard(sx, sy, w, seg(t, 58.3, 61.8), t, { kind: 'plate', title: 'SUPER FUEL' });
    else if (t < 69.0) safadiBoard(sx, sy, w, seg(t, 65.4, 68.2), t, { kind: 'crash', title: 'ENERGY' });
    else safadiBoard(sx, sy, w, seg(t, 69.3, 72.6), t, { kind: 'sugarbugs', title: 'SUGAR BUGS' });
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const c = { size: (o.size || 50) * (l.kind === 'whisper' ? .82 : 1), maxW: o.maxW || 660, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A[n]).filter(Boolean);
        if (ms.length) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 50, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.3 : 1.1), dx: o.groupDx ?? 0, dy: -220 }); continue;
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
  const WIDE = cam(0, 120, 1000, 650);                                       // the house, chimney to lawn, girls small
  const TWO = cam(-110, 110, 1600, 625);                                     // the girls, house behind
  const THREE_W = cam(250, 130, 1000, 730);                                  // wide three-shot (Safadi's arrival)
  const THREE = cam(10, 120, 1550, 666);                                    // three-shot
  const SAF = cam(430, 140, 1700, 560);                                     // Safadi and his board
  const GIRLS_CU = t => ({ x: -150, y: 100, z: lerp(1700, 1760, seg(t, 46.8, 48.6)), f: 1000, hy: 470, dir: 1 });
  const WINK_CU = t => ({ x: -150, y: 100, z: lerp(1700, 1745, ease(seg(t, 91.6, 93.4))), f: 1000, hy: 470, dir: 1 });
  const SAF_CU = t => ({ x: 270, y: 138, z: lerp(1860, 1885, seg(t, 93.4, 95)), f: 1000, hy: 500, dir: 1 });   // his face, close
  const shot = (camFn, blur, bo, go) => t => { const { A, S } = group(t, camFn(t), blur, go); bubbles(t, A, S, bo); extras(t, A, S); };

  function opening(t) {                                                       // from the street to the lawn
    const u = ease(seg(t, .4, 8.6)), w = WIDE(t);
    const c = { x: lerp(200, w.x, u), y: lerp(170, w.y, u), z: lerp(-400, w.z, u), f: 1000, hy: lerp(600, w.hy, u), dir: 1 };
    const { A, S } = group(t, c, 0); bubbles(t, A, S, { size: 48, side: n => n === 'alma' ? -1 : 1 });
  }
  const ideas = shot(WIDE, 0, { size: 46, side: n => n === 'alma' ? -1 : 1, dy: -200 });
  const favourites = shot(TWO, 1.6, { size: 50, side: n => n === 'alma' ? -1 : 1 });
  const arrival = shot(THREE_W, .6, { size: 48, side: n => n === 'jenna' ? 1 : -1 });
  const three = shot(THREE, 1.4, { size: 50, side: n => n === 'alma' ? -1 : 1, far: 300 });
  const candy = shot(GIRLS_CU, 2.6, { size: 56 });
  const lecture = shot(SAF, 2.0, { size: 48, side: () => -1, far: 260, dy: -300 });
  const slump = shot(TWO, 1.8, { size: 46, side: n => n === 'alma' ? -1 : 1 });
  const whisper = shot(TWO, 1.8, { size: 50, side: n => n === 'alma' ? -1 : 1 }, { soft: { safadi: 4 } });
  const wink = shot(WINK_CU, 2.6, { size: 56 });
  const safCU = shot(SAF_CU, 3.0, { size: 54 });

  // the sketchbook insert: Robo-Safadi draws on, the eyes switch on, the robot speaks (also the final glint)
  function page(t, eyesK) {
    X.fillStyle = '#9C9A3E'; X.fillRect(0, 0, W, H);
    X.save(); X.globalAlpha = .35; for (let i = 0; i < 40; i++) ellipse(hash(i) * W, hash(i * 3) * H, 40, 22, { fill: i % 2 ? '#C2602A' : '#E0B840', stroke: null, rot: i }); X.restore();
    spkSketchbook(W / 2 + 10, H + 50 + 4 * Math.sin(t * 1.1), 1500, -.015, { page: (pw, ph) => spkDoodle('robo', pw / 2, ph * .72, ph * .58, seg(t, 79.3, 81.8), t, { halo: false, eyes: eyesK }) });
    if (t < 81.9) { const u = seg(t, 79.3, 81.8), hx = W / 2 - 160 + 360 * frac(u * 3) + 30 * Math.sin(t * 13), hy = 330 + 460 * u + 30 * Math.cos(t * 11); spkPencil(hx, hy, 340, -2.3); }   // Jenna's pencil racing over the page
  }
  function robo(t) {
    page(t, seg(t, EYES, EYES + .25) * (.85 + .15 * Math.sin(t * 20)));
    sfx('BZZT!', W / 2 + 360, 300, 120, '#FF4A4A', t - EYES, { life: .8, rot: -.1 });
    callout('EAT. YOUR. BROCCOLI.', W / 2 - 40, 640, t - 83.0, { kind: 'robot', dx: -440, dy: -210, cps: 9, hold: 1.0 });
    sfx('hee hee!', 300, 900, 64, '#FFB3D9', t - 84.8, { life: .9, rot: .08 });
  }
  function tbc(t) {                                                           // the glint, the freeze, the card, the iris
    const tt = Math.min(t, FREEZE), glint = kick(tt, 94.9, 3);
    page(tt, .7 + .3 * glint);
    if (glint > .02) overlay(() => { for (const ex of [904, 1036]) { X.save(); X.translate(ex, 507); X.rotate(tt * 2); X.scale(glint, glint); X.shadowColor = '#FF3030'; X.shadowBlur = 30;
      shape(starPts(0, 0, 90, .14, 4), { fill: '#FFE3E3', stroke: null }); X.restore(); } });
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .5 * k; X.fillStyle = '#C9A46A'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, 95.7, 96.1)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4D6', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#E8661E'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 98.4, 99.6))));
  }

  // things that ride on top of any shot
  function extras(t, A, S) {
    const a = A.alma, j = A.jenna, s = A.safadi;
    if (a) {
      sfx('WOOO!', a.head[0] - 4 * S.alma, a.top[1] - 2 * S.alma, 56, '#FFFDF6', t - 10.0, { life: .9, rot: -.06 });
      sfx('HSSS!', a.head[0] + 5 * S.alma, a.top[1] - 2 * S.alma, 56, '#2B2730', t - 16.4, { life: .7, rot: .06 });
    }
    if (j && t > GIGGLE[0] && t < GIGGLE[1]) sfx('hee hee hee', j.head[0] - 5 * S.jenna, j.top[1] - 3 * S.jenna, 50, '#FFB3D9', t - GIGGLE[0] - .2, { life: 1.6 });
    if (s && t > POWER[1] - .2 && t < POWER[1] + .6) sfx('pop', s.head[0] + 10 * S.safadi, s.top[1], 44, '#7FE3FF', t - POWER[1], { life: .5 });
  }

  scene({ duration: END, fps: 24, bpm: 104,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [9.0, ideas], [24.4, favourites], [36.0, arrival], [41.0, three], [46.8, candy], [48.6, three],
      [57.6, lecture], [66.4, slump], [69.0, lecture], [73.0, whisper], [79.0, robo], [85.4, three], [91.6, wink],
      [93.4, safCU], [94.6, tbc],
    ] });
})();
