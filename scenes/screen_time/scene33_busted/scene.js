// Scene 33: "Busted!". Straight after scene 32's "Go play outside!": the four kids mope on the autumn lawn. "What do you think
// Professor Safadi and Doctor Sami are doing?" Housam tiptoes to the living-room window and peeks in (from inside: his eyes over
// the sill; through the glass: the twins on the sofa, each on a laptop). "They are on their laptops!" "We busted them!" Alma and
// Jenna, with air quotes: "researching his book", "looking up medical information". "Let us take a closer look." Through the
// window: the professor is playing ROBO INVASION. Danny has to jump to see in at the porch window: the doctor is playing WORLD
// CHAMPION. They run back: "They are playing video games!" "NOT FAIR!" "What should we do now?" Housam thinks… "EUREKA!" Alma
// slaps her forehead: "Not again…" Push in on Housam's grin; thunder. Freeze. To be continued.
// Blocking (house, autumn): Jenna (−210, 2000), Danny (−70, 1985), Housam (80, 2010), Alma (220, 2000). Housam spies through the
// porch window (X 130, sill Y 95, facade Z 3000) from the porch floor (Y 25) at (130, 2960); Danny through the right wing's
// window (X 715, wing face Z 2880) from (715, 2805), and has to jump. In the living room (sofa view) Safadi sits at X 95 and Sami at X −95 on the sofa (Z 85).
// Every shot is a pure function of t.
(() => {
  const HS = LOCATIONS.house, LR = LOCATIONS.living_room, LINES = ASSETS.scene.scene33_busted.dialogue, HSET = { season: 'autumn' };
  const ACCENT = { jenna: '#D0508E', danny: '#2E7D9A', housam: '#425DA0', alma: '#994EC4' };
  const UNIT = { jenna: JENNA_UNIT, danny: DANNY_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT };
  const RIG = { jenna, danny, housam, alma };
  const HEADW = { jenna: 4.6, danny: 5.4, housam: 5.6, alma: 6.6 };
  const HAIR = { housam: '#282027', danny: '#2F2623' };
  const KIDS = ['jenna', 'danny', 'housam', 'alma'], WALK = { jenna: jennaSkip, danny: dannyDribble, housam: housamDribble, alma: almaSkip };

  // ---------- timing ----------
  const SNEAK1 = [9.4, 12.2], RISE = [13.0, 14.0], TURN1 = 21.4, CLOSER = 35.8, ROBO0 = 39.4;
  const SNEAK2 = [45.8, 48.4], JUMP0 = 49.0, JUMP_T = .7, SOCCER0 = 55.0, BACK = [62.8, 65.6];
  const THINK = 73.2, EUREKA = 77.4, SLAP = 79.2, EVIL = 82.0, THUNDER = 83.8, FREEZE = 86.4, END = 92.0;

  // ---------- where everyone is ----------
  const LAWN = { jenna: [-210, 2000], danny: [-70, 1985], housam: [80, 2010], alma: [220, 2000] };
  const SPY_L = [130, 2960], SPY_R = [715, 2805], PORCH_Y = 25;
  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  function at(name, t) {
    let a;
    if (name === 'housam') a = t < BACK[0] ? along([LAWN.housam, [-85, 2600], [40, 2830], SPY_L], t, SNEAK1) : along([SPY_L, [40, 2830], [-85, 2620], LAWN.housam], t, BACK);
    else if (name === 'danny') a = t < BACK[0] ? along([LAWN.danny, [300, 2350], [640, 2700], SPY_R], t, SNEAK2) : along([SPY_R, [300, 2350], LAWN.danny], t, [BACK[0] + .2, BACK[1]]);
    else a = { x: LAWN[name][0], z: LAWN[name][1], dist: 0, moving: false };
    a.y = name === 'housam' ? PORCH_Y * seg(a.z, 2640, 2700) : 0;               // up the porch step
    return a;
  }

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const SIDE = { jenna: -1, danny: -.4, housam: .2, alma: .8 };
  const lookAt = (me, who) => !who || who === me ? 0 : clamp((SIDE[who] - SIDE[me]) * 1.4, -.85, .85);
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const PH = { jenna: 0, danny: 1.7, housam: 3.1, alma: 4.4 };
  const away = (name, t) => (name === 'housam' && t > SNEAK1[0] && t < BACK[1]) || (name === 'danny' && t > SNEAK2[0] && t < BACK[1]);
  const jumpK = t => t < JUMP0 || t > 62.6 ? 0 : Math.abs(Math.sin(Math.PI * (t - JUMP0) / JUMP_T));   // Danny's jumps at the porch window

  // ---------- poses: the kids ----------
  function kidPose(name, t) {
    const talk = speaking(name, t), a = at(name, t), ph = PH[name], sd = SIDE[name] < 0 ? 1 : -1;
    const say = m => talk ? lipFlap(t, true, m) : m;
    const o = { giraffe: false, mouth: say('frown'), brows: 'worried', eyes: 'open', lookY: .35, lookX: .2 * Math.sin(t * .5 + ph), dy: .5, handL: [-3.2, -9.6], handR: [3.2, -9.6], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    // part 1: moping
    if (t < 4.6) {
      if (name === 'jenna') set({ handL: [-3.0, -11.8], handR: [3.0, -11.8], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry' });   // arms crossed
      if (name === 'alma') set({ footR: [2.4 + 1.6 * Math.max(0, Math.sin(t * 3)), -1 - 1.4 * Math.max(0, Math.sin(t * 3))], lookY: .7 });   // kicking the leaves
      if (name === 'housam') set({ lookY: .6, dy: .8 });
      if (name === 'danny') set({ lookY: .2, lookX: -.3 });
    }
    if (inW(t, 4.6, SNEAK1[0])) { set({ lookX: name === 'danny' ? -.2 : lookAt(name, 'danny'), lookY: 0, brows: name === 'danny' ? 'up' : 'normal', mouth: say(name === 'danny' ? 'o' : 'flat') });
      if (name === 'danny') set({ handR: [5.0, -15.2], handPoseR: 'palm', turn: -.15 }); }
    if (name === 'housam' && inW(t, 8.0, SNEAK1[0])) set({ brows: 'focused', mouth: 'smirk', lookX: -.6, turn: -.3, emote: '!', emoteK: on(t, 8.2, 9.3, .15) });
    // the girls (and Danny) watch the spies
    if (inW(t, SNEAK1[0], 24.6) && !away(name, t)) set({ lookX: -.7 * (SIDE[name] > -.5 ? 1 : .6), lookY: -.15, brows: 'up', mouth: 'o', dy: .3, lean: -.03 });
    if (inW(t, 24.8, 26.6) && name === 'danny') set({ handR: [4.4, -21], handPoseR: 'fist', jump: 1.1 * kick(t, 24.9, 6), brows: 'angry', mouth: say('grin'), eyes: 'open', lookX: 0 });   // we busted them!
    for (const [who, t0] of [['alma', 27.0], ['jenna', 30.8]]) if (inW(t, t0, t0 + 3.7)) {
      if (name === who) { const q = Math.sin(t * 9) > 0;                        // air quotes, eyes rolling
        set({ handL: [-5.6, -20 + (q ? .8 : 0)], handR: [5.6, -20 + (q ? .8 : 0)], handPoseL: 'point', handPoseR: 'point', lookY: -.8, lookX: .4 * Math.sin(t * 2), brows: 'up', mouth: say('smirk') }); }
      else if (!away(name, t)) set({ lookX: lookAt(name, who), brows: 'normal', mouth: 'smirk', lookY: 0 });
    }
    if (inW(t, 34.6, BACK[0]) && !away(name, t)) set({ lookX: -.7, lookY: -.15, brows: 'up', mouth: 'o', dy: .3 });
    // the spies (seen from behind at the windows: see drawChar's back-of-head)
    if (name === 'housam' && a.moving && t < BACK[0]) return set({ ...housamDribble(a.dist / 30, .7), handL: [-4.6, -17], handR: [4.6, -17], handPoseL: 'open', handPoseR: 'open', dy: 1.2, lean: .06, mouth: 'flat', brows: 'focused', lookX: -.5, back: false });   // tiptoe
    if (name === 'housam' && inW(t, SNEAK1[1], BACK[0])) {
      const rise = t < RISE[0] ? 0 : ease(seg(t, RISE[0], RISE[1])), up = t > CLOSER ? 1.15 : 1;
      set({ dy: lerp(4.0, 0, rise) - (up - 1) * 2, handL: [-4.4, lerp(-10, -20, rise)], handR: [4.4, lerp(-10, -20, rise)], handPoseL: 'palm', handPoseR: 'palm', back: true, lookY: 0 });
      if (inW(t, TURN1, 24.6) || inW(t, 34.6, CLOSER)) set({ back: false, lookX: .6, turn: .3, mouth: say('o'), brows: 'up', eyes: 'wide', handL: [-1.0, -21.6], handPoseL: 'point' });   // turns to whisper (finger to his lips)
    }
    if (name === 'danny' && a.moving && t < BACK[0]) return set({ ...dannyDribble(a.dist / 40, 1), lean: .08, mouth: 'grin', brows: 'focused', lookX: .4, back: false });
    if (name === 'danny' && inW(t, SNEAK2[1], BACK[0])) set({ back: true, jump: 3.2 * jumpK(t), handL: [-4.8, -20], handR: [4.8, -20], handPoseL: 'palm', handPoseR: 'palm', sq: -.06 * (1 - jumpK(t)) });
    // running back, and the report
    if (a.moving && t >= BACK[0]) return set({ ...WALK[name](a.dist / 40, 1), lean: .08, mouth: 'O', eyes: 'wide', brows: 'up', back: false });
    if (inW(t, 65.6, 69.0) && (name === 'housam' || name === 'danny')) set({ handL: [-6, -16], handR: [6, -16], handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', brows: 'up', mouth: say('O'), jump: .8 * kick(t, 66.3, 6) });
    if (inW(t, 65.6, 69.0) && (name === 'jenna' || name === 'alma')) set({ lookX: lookAt(name, 'housam'), eyes: 'wide', brows: 'up', mouth: 'O', emote: '!', emoteK: on(t, 66.6, 68.8, .15) });
    if (inW(t, 69.0, 71.0)) set({ handL: [-3.6, -6.4], handR: [3.6, -6.4], handPoseL: 'fist', handPoseR: 'fist', brows: 'angry', mouth: say('frown'), eyes: talk ? 'open' : 'squeeze', jump: 1.0 * kick(t, 69.1 + .05 * ph, 6), lookY: -.2, lookX: 0 });   // NOT FAIR!
    if (inW(t, 71.0, THINK)) { set({ lookX: lookAt(name, name === 'danny' ? 'housam' : 'danny'), brows: 'worried', mouth: say('flat'), lookY: .1 });
      if (name === 'danny') set({ handL: [-6, -14.4], handR: [6, -14.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up' }); }
    // the think, the idea, the slap, the evil smile
    if (t > THINK) {
      if (name === 'housam') {
        set({ handR: [.9, -20.8], handPoseR: 'fist', handL: [-3.0, -13], handPoseL: 'fist', lookX: .4, lookY: -.6, brows: 'focused', mouth: 'flat', eyes: 'open', tilt: .03 * Math.sin(t * 1.3) });   // hand on chin
        if (t > EUREKA) set({ jump: 1.8 * kick(t, EUREKA + .1, 5), eyes: 'wide', brows: 'up', mouth: say('grin'), handR: [6.6, -25.5], handPoseR: 'point', handL: [-4.6, -16], handPoseL: 'palm', lookX: 0, lookY: -.3, tilt: 0 });
        if (t > SLAP) set({ lookX: -.6, lookY: .1, brows: 'up', mouth: 'smile', handR: [4.4, -10], handPoseR: 'open', jump: 0 });
        if (t > EVIL) {                                                          // the plan: a big grin, rubbing his hands
          const r = Math.sin(t * 16);
          set({ brows: 'normal', mouth: 'grin', eyes: 'open', lookX: .65, lookY: -.25, turn: .15, handL: [-1.2 + .5 * r, -13.8], handR: [1.2 - .5 * r, -14.0], handPoseL: 'fist', handPoseR: 'fist', dy: .4, tilt: -.03 });
          if (t > EVIL + 2.6) set({ lookX: 0, turn: 0 });
        }
      } else {
        set({ lookX: lookAt(name, 'housam'), lookY: 0, brows: 'up', mouth: 'o', eyes: 'open' });
        if (t > EUREKA) set({ eyes: 'wide', jump: .5 * kick(t, EUREKA + .15, 7) });
        if (name === 'alma' && t > SLAP) { const d = ease(seg(t, SLAP - .12, SLAP));
          set({ handR: mixPt([3.2, -9.6], [1.4, -19.6], d), handPoseR: 'palm', eyes: 'closed', brows: 'worried', mouth: say('frown'), tilt: -.06 * d, sq: .05 * kick(t, SLAP, 8), lookX: 0 }); }   // SLAP: a hand to her forehead
        if (name !== 'alma' && t > SLAP) set({ brows: 'worried', mouth: 'flat', lookX: lookAt(name, 'housam') });
      }
    }
    return o;
  }

  // ---------- drawing a kid on the lawn ----------
  function drawKid(name, P, t, A, S) {
    const a = at(name, t); if (P.depth(a.z) < 60) return;
    const pose = { ...kidPose(name, t), t }, [sx, sy, k] = P.p(a.x, a.y, a.z), s = UNIT[name] * k;
    const R = A[name] = RIG[name](sx, sy, s, pose); S[name] = s;
    if (pose.back && HAIR[name]) {                                              // seen from behind: the back of his head
      const hx = R.head[0], hy = R.head[1] - .6 * s, rx = HEADW[name] * s * 1.0, ry = rx * 1.08;
      ellipse(hx, hy, rx, ry, { fill: HAIR[name], stroke: PAL.ink, lwPx: Math.max(1.5, .25 * s) });
      for (let i = 0; i < 3; i++) line([[hx - rx * .5 + i * rx * .45, hy - ry * .7], [hx - rx * .4 + i * rx * .45, hy + ry * .3]], { stroke: rgba('#FFFFFF', .12), lwPx: Math.max(1, .3 * s) });
    }
    if (pose.emote && name !== 'alma' && (pose.emoteK ?? 1) > .02) alEmote(pose.emote, R, k * ALMA_UNIT, pose.emoteK ?? 1, t);
  }
  // Kids near the house (spies) go between the set's back and front, so the bushes cover them; the rest stand in front.
  function lawnStage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {};
    const list = KIDS.map(n => ({ n, a: at(n, t) })).filter(it => P.depth(it.a.z) > 60).sort((p, q) => P.depth(q.a.z) - P.depth(p.a.z));
    const far = list.filter(it => it.a.z > 2500), near = list.filter(it => it.a.z <= 2500);
    const split = far.length ? Math.min(...far.map(it => it.a.z)) : near.length ? Math.min(...near.map(it => it.a.z)) : 1950;
    layer(() => HS.back(P, t, { ...HSET, splitZ: split }), { blur });
    far.forEach(it => drawKid(it.n, P, t, A, S));
    if (far.length) { HS.front(P, t, { ...HSET, splitZ: split }); near.forEach(it => drawKid(it.n, P, t, A, S)); }
    else { near.forEach(it => drawKid(it.n, P, t, A, S)); HS.front(P, t, { ...HSET, splitZ: split }); }
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
      const a = A?.[l.speaker], s = S?.[l.speaker]; if (!a || a.mouth[0] < 60 || a.mouth[0] > W - 60) continue;
      const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
      callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 300), dy: o.dy ?? -220 });
    }
  }

  // ---------- cameras (the lawn) ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000, dir = 1) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const H_MED = cam(0, 120, 1560, 560, 900);                                   // the four kids, the house behind
  const H_GIRLS = cam(70, 115, 1640, 560, 1000);                               // the three on the lawn
  const H_WIDE = cam(-200, 170, 1250, 540, 760);                               // the lawn to the house: the sneaks
  const H_WINL = cam(60, 150, 2460, 580, 1000);                              // Housam at the porch window
  const H_WINR = cam(620, 140, 2260, 570, 1000);                             // Danny at the wing window
  const H_HOUSAM = t => ({ ...cam(60, 115, 1720, 560, 1000)(t), z: lerp(1720, 1760, ease(seg(t, THINK, EUREKA))) });
  const H_EVIL = t => { const u = ease(seg(t, EVIL, FREEZE)); return { ...cam(80, 125, 1800, 560, 1000)(t), z: lerp(1800, 1905, u), hy: lerp(560, 600, u) }; };

  const lshot = (camFn, blur, bo) => t => { const { A, S, P } = lawnStage(t, camFn(t), blur); bubbles(t, A, S, bo); extras(t, A, S, P); };
  const lawnBo = { size: 50, side: n => n === 'alma' || n === 'housam' ? 1 : -1, far: 240, dy: -230, groupDy: -240 };
  const lawn = lshot(H_MED, .8, lawnBo);
  const girls = lshot(H_GIRLS, 1.2, { size: 50, side: n => n === 'jenna' ? -1 : 1, far: 240, dy: -230 });
  const wide = lshot(H_WIDE, .3, { size: 46 });
  const spyL = lshot(H_WINL, 1.0, { size: 54, side: () => 1, far: 260, dy: -180 });
  const spyR = lshot(H_WINR, 1.0, { size: 54, side: () => 1, far: 260, dy: -180 });
  const think = lshot(H_HOUSAM, 1.4, { size: 58, side: () => 1, far: 260, dy: -210 });
  function opening(t) {                                                        // a crane down from the roof onto the moping kids
    const u = ease(seg(t, .2, 4.2)), b = H_MED(t);
    const { A, S, P } = lawnStage(t, { ...b, y: lerp(420, b.y, u), z: lerp(1300, b.z, u), hy: lerp(860, b.hy, u) }, .4); bubbles(t, A, S, lawnBo); extras(t, A, S, P);
  }
  function evil(t) {                                                           // the evil smile; thunder; freeze
    const tt = Math.min(t, FREEZE), { A, S, P } = lawnStage(tt, H_EVIL(tt), 1.8);
    bubbles(tt, A, S, lawnBo); extras(tt, A, S, P);
    { const k = ease(seg(tt, EVIL + .4, EVIL + 1.6)), h = A.housam, cx = h ? h.head[0] : W / 2, cy = h ? h.head[1] : H / 2;   // the sky darkens around him
      X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = radGrad(cx, cy, 120, W * .6, [[0, 'rgba(40,20,70,0)'], [1, rgba('#28144A', .88 * k)]]); X.fillRect(0, 0, W, H); X.restore(); }
    flash(.55 * kick(tt, THUNDER, 9), '#E8E4FF');
    if (A.housam) [EVIL + 1.0, EVIL + 2.0, EVIL + 3.0].forEach((t0, i) => sfx(['heh', 'heh', 'HEH!'][i], A.housam.top[0] + (4 + i * 3) * S.housam, A.housam.top[1] - (i * 1.5) * S.housam, 46 + i * 10, '#C9A8FF', tt - t0, { life: 1.0, rot: (i - 1) * .1 }));
    sfx('BOOM!', W * .2, H * .2, 90, '#C9A8FF', tt - THUNDER, { life: 1.0, rot: -.08 });
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#6A3FB0'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.2, END - .8))));
  }

  // things that ride on top of the lawn shots
  function extras(t, A, S, P) {
    if (t < 4.6) [['jenna', 1.6], ['alma', 2.8], ['danny', 3.6]].forEach(([n, t0]) => { if (A[n]) sfx('sigh...', A[n].top[0], A[n].top[1] - 2 * S[n], 40, '#EDE6D6', t - t0, { life: 1.2 }); });
    const h = A.housam;
    if (h && inW(t, SNEAK1[0], SNEAK1[1])) [9.8, 10.6, 11.4].forEach((t0, i) => sfx('tip', h.footL ? h.footL[0] : h.head[0], (h.footL || h.head)[1] - 10, 30, '#FFFDF6', t - t0, { life: .5, rot: (i - 1) * .2 }));
    const d = A.danny;
    if (d && t > JUMP0 && t < 52.6) for (let i = 0; i < 5; i++) sfx('BOING!', d.head[0] + (i % 2 ? 50 : -50), d.top[1] - 30, 46, '#FFE066', t - (JUMP0 + .2 + i * JUMP_T), { life: .5, rot: i % 2 ? .1 : -.1 });
    if (inW(t, THINK + 1, EUREKA)) sfx('hmm...', W * .3, H * .2, 50, '#FFFDF6', t - THINK - 1.2, { life: 2.4 });
    if (inW(t, THINK + .8, EUREKA) && h) [74.2, 75.6].forEach(t0 => sfx('cricket... cricket...', W * .72, H * .14, 38, '#E8F5D0', t - t0, { life: 1.3 }));
    if (h && inW(t, THINK + 1.2, EUREKA + .2)) {                               // a leaf lands on his head
      const u = seg(t, THINK + 1.2, THINK + 2.6), lx = h.top[0] + lerp(120, 10, u) + 30 * Math.sin(u * 9), ly = lerp(-60, h.top[1] + .4 * S.housam, easeOut(u));
      shape(ellPts(lx, ly, 1.6 * S.housam, .8 * S.housam, 10, u * 4), { fill: '#E28A2E', stroke: PAL.ink, lwPx: 2 });
    }
    if (h && t > EUREKA && t < EVIL) { const r = 2.6 * S.housam * backOut(seg(t, EUREKA, EUREKA + .3)) * (1 - seg(t, SLAP + 1.6, SLAP + 2.0)), bx = h.top[0] + 4.5 * S.housam, by = h.top[1] - 4 * S.housam;
      if (r > .5) overlay(() => { circle(bx, by, r * 1.8, { fill: rgba('#FFF2A8', .35 + .15 * Math.sin(t * 20)), stroke: null }); circle(bx, by, r, { fill: '#FFE066', stroke: PAL.ink, lwPx: 3 });
        shape(rectPts(bx - r * .45, by + r * .8, r * .9, r * .6), { fill: '#B9C0C4', stroke: PAL.ink, lwPx: 2.5 }); });
      sfx('DING!', bx + 4 * S.housam, by - 2 * S.housam, 64, PAL.goldLt, t - EUREKA - .15, { life: .9, rot: .1 }); }
    if (A.alma && t > SLAP) sfx('SLAP!', A.alma.top[0] - 3 * S.alma, A.alma.top[1] - 1 * S.alma, 60, '#FFE066', t - SLAP, { life: .7, rot: -.12 });
  }

  // =====================================================================================================
  // ---------- inside the living room: the twins on the sofa, on their laptops ----------
  const SEAT = LR.SOFA.seat, SOFA_FRONT = LR.SOFA.z1 + 4, TWIN = { safadi: [95, 85], sami: [-95, 85] }, SIT_DROP = -42;
  function twinPose(name, t, k) {                                              // k: how wild the gaming is (0 calm … 1 frantic)
    const m = .3 + 1.2 * k, ph = name === 'sami' ? 1.3 : 0;
    const o = { handL: [-3.2 + m * .3 * Math.sin(t * 23 + ph), -16 + m * .4 * Math.max(0, Math.sin(t * 27 + ph))], handR: [3.2 + m * .3 * Math.sin(t * 25 + ph), -16 + m * .4 * Math.max(0, Math.sin(t * 29 + ph))],
      handPoseL: 'fist', handPoseR: 'fist', lookY: .6, lookX: 0, eyes: k > .5 ? 'wide' : 'open', brows: k > .5 ? 'angry' : 'focused', mouth: k > .5 ? 'teeth' : 'smirk',
      power: .9 * k, dy: .2 + .3 * k * bounce(t, 13, ph), lean: .03 * k * Math.sin(t * 6 + ph) };
    if (name === 'sami' && t > SOCCER0 + 5.1 && t < 63) Object.assign(o, { handL: [-5.6, -27], handR: [5.6, -27], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', brows: 'up', jump: .5 * bounce(t, 9), lookY: -.2 });   // GOAL!
    if (name === 'safadi' && t > ROBO0 + 5.2 && t < 46) Object.assign(o, { handR: [4.6, -26], eyes: 'happy', mouth: 'grin', brows: 'up', lookY: 0 });
    return o;
  }
  function laptopLid(x, y, w, sticker) {                                       // the lid, toward us; its bottom edge at (x, y)
    const h = w * .66;
    shape(rectPts(x - w / 2, y - h, w, h), { fill: '#C9CED4', stroke: PAL.ink, lwPx: Math.max(1.5, w * .02), smooth: .05 });
    if (sticker === 'bulb') { circle(x, y - h * .55, w * .09, { fill: '#F2C440', stroke: PAL.ink, lwPx: 1.2 }); shape(rectPts(x - w * .045, y - h * .43, w * .09, w * .06), { fill: '#9AA3AC', stroke: null }); }
    else shape(starPts(x, y - h * .5, w * .1, .5), { fill: '#AEE6CB', stroke: PAL.ink, lwPx: 1.2 });
    glowAt2(x, y - h * 1.4, w * .9, '#9FD4FF', .2);
  }
  function glowAt2(x, y, r, col, a) { X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = radGrad(x, y, 0, r, [[0, rgba(col, a)], [1, rgba(col, 0)]]); X.fillRect(x - r, y - r, 2 * r, 2 * r); X.restore(); }
  function sofaStage(t, camo, blur, k) {
    const P = persp(camo), o = { splitZ: 85, lamp: .6, night: 0 };
    layer(() => LR.back(P, t, o), { blur });
    for (const name of ['safadi', 'sami']) {
      const [x, z] = TWIN[name], [sx, sy, kk] = P.p(x, SIT_DROP, z), s = (name === 'safadi' ? SAFADI_UNIT : SAMI_UNIT) * kk, clipY = P.p(x, SEAT + 1, SOFA_FRONT)[1];
      X.save(); X.beginPath(); X.rect(0, 0, W, clipY); X.clip();
      const R = (name === 'safadi' ? safadi : sami)(sx, sy, s, { ...twinPose(name, t, k), t });
      X.restore();
      laptopLid((R.handL[0] + R.handR[0]) / 2, clipY + 2 * kk, 46 * kk, name === 'safadi' ? 'bulb' : 'star');
      stFaceGlow(R.head[0], R.head[1] + 1.5 * s, 14 * s, t, 1);
    }
    LR.front(P, t, o);
    return P;
  }
  // a window seen from outside, painted over a shot: brick surround, white sashes, lace curtains, the glass
  function windowFrame(t, o = {}) {
    overlay(() => {
      const x0 = W * .1, x1 = W * .9, y0 = H * .08, y1 = H * .9;
      X.save();
      X.beginPath(); X.rect(0, 0, W, H); X.rect(x1, y0, x0 - x1, y1 - y0); X.fillStyle = '#A8473A'; X.fill('evenodd');   // the brick wall, with the window cut out
      X.strokeStyle = 'rgba(232,214,196,.75)'; X.lineWidth = 3;
      for (let r = 0, y = 0; y < H; r++, y += 36) { X.beginPath(); X.moveTo(0, y); X.lineTo(W, y); X.stroke(); for (let x = (r % 2) * 50; x < W; x += 100) { if (y > y0 - 30 && y < y1 + 20 && x > x0 - 30 && x < x1 + 30) continue; X.beginPath(); X.moveTo(x, y); X.lineTo(x, y + 36); X.stroke(); } }
      X.restore();
      // the glass: a cool tint and two glare streaks
      X.save(); X.beginPath(); X.rect(x0, y0, x1 - x0, y1 - y0); X.clip();
      X.fillStyle = 'rgba(170,210,235,.12)'; X.fillRect(x0, y0, x1 - x0, y1 - y0);
      for (const [gx, gw] of [[.18, .07], [.3, .025]]) { X.fillStyle = 'rgba(255,255,255,.13)'; X.beginPath(); X.moveTo(x0 + (x1 - x0) * gx, y0); X.lineTo(x0 + (x1 - x0) * (gx + gw), y0); X.lineTo(x0 + (x1 - x0) * (gx + gw - .12), y1); X.lineTo(x0 + (x1 - x0) * (gx - .12), y1); X.fill(); }
      for (const sd of [0, 1]) { const cx = sd ? x1 : x0, dir = sd ? -1 : 1, pts = [[cx, y0], [cx + dir * 170, y0], [cx + dir * 110, y0 + 260], [cx + dir * 60, y0 + 480], [cx, y0 + 520]];   // lace curtains, tied back
        shape(pts, { fill: 'rgba(255,255,255,.55)', stroke: 'rgba(200,200,200,.8)', lwPx: 2, smooth: .4 });
        for (let i = 0; i < 6; i++) circle(cx + dir * (30 + 18 * (i % 3)), y0 + 60 + i * 70, 7, { fill: 'rgba(255,255,255,.6)', stroke: null }); }
      X.restore();
      // the sashes: six over six
      const bar = (pts, w) => { line(pts, { stroke: PAL.ink, lwPx: w + 5 }); line(pts, { stroke: '#FBF7EE', lwPx: w }); };
      const ym = (y0 + y1) / 2;
      bar([[x0, ym], [x1, ym]], 26);
      for (const f of [1 / 3, 2 / 3]) { bar([[x0 + (x1 - x0) * f, y0], [x0 + (x1 - x0) * f, y1]], 12); }
      for (const y of [(y0 + ym) / 2, (ym + y1) / 2]) bar([[x0, y], [x1, y]], 10);
      shape(rectPts(x0 - 22, y0 - 22, x1 - x0 + 44, y1 - y0 + 44), { fill: null, stroke: '#FBF7EE', lwPx: 40 });
      shape(rectPts(x0 - 44, y0 - 44, x1 - x0 + 88, y1 - y0 + 88), { fill: null, stroke: PAL.ink, lwPx: 4 });
      shape(rectPts(x0 - 70, y1 + 22, x1 - x0 + 140, 34), { fill: '#E8E0D0', stroke: PAL.ink, lwPx: 4 });   // the sill
      if (o.label) sfx(o.label, W * .5, H * .16, 60, '#FFFDF6', t - o.labelAt, { life: 1.2 });
    });
  }
  const SOFA_MED = t => { const [dx, dy] = drift(t); return { x: dx, y: 125, z: 720, f: 900, hy: 590 + dy, dir: -1 }; };
  const SOFA_CLOSE = x => t => { const [dx, dy] = drift(t); return { x: x + dx * .5, y: 118, z: lerp(470, 440, seg(t % 100, 0, 100)), f: 1000, hy: 610 + dy, dir: -1 }; };
  const pov = t => { sofaStage(t, SOFA_MED(t), 1.2, .35); windowFrame(t); };
  const povSafadi = t => { sofaStage(t, SOFA_CLOSE(95)(t), 1.8, 1); windowFrame(t); };
  const povSami = t => { sofaStage(t, SOFA_CLOSE(-95)(t), 1.8, 1); windowFrame(t); };

  // over the twin's shoulder, through the window: the game on the laptop
  function laptopShot(drawGame, t0) {
    return t => {
      X.fillStyle = '#2E2A30'; X.fillRect(0, 0, W, H);
      X.fillStyle = radGrad(W / 2, H / 2, 200, W * .7, [[0, '#4A4048'], [1, '#1E1A20']]); X.fillRect(0, 0, W, H);
      const sx = 260, sy = 110, sw = 1400, sh = 788, b = 34, bob = 4 * Math.sin(t * 1.7);
      X.save(); X.translate(0, bob);
      shape(rectPts(sx - b, sy - b, sw + 2 * b, sh + 2 * b), { fill: '#2B2F36', stroke: PAL.ink, lwPx: 6, smooth: .03 });
      shape([[sx - b - 60, sy + sh + b], [sx + sw + b + 60, sy + sh + b], [sx + sw + b + 140, H + 40], [sx - b - 140, H + 40]], { fill: '#B9C0C8', stroke: PAL.ink, lwPx: 6 });   // the keyboard deck
      X.save(); X.beginPath(); X.rect(sx, sy, sw, sh); X.clip(); X.translate(sx, sy); X.scale(sw / 1600, sh / 900);
      withBoil(0, () => drawGame(1600, 900, t, t0));
      X.restore(); X.restore();
      windowFrame(t);
    };
  }
  const laptopRobo = laptopShot(stRoboScreen, ROBO0);
  const laptopSoccer = laptopShot(stSoccerScreen, SOCCER0);

  // ---------- from inside: a kid's head rising over the windowsill ----------
  const C_IN = { wall: '#EFE4D0', sage: '#B5C7A0', trim: '#FFFDF7', mustard: '#E7B54A' };
  function peekIn(who, riseFn, faceFn) {
    return t => {
      const x0 = W * .2, x1 = W * .8, y0 = H * .1, sill = H * .74;
      X.fillStyle = linGrad(0, y0, 0, sill, [[0, '#9DD3F2'], [1, '#E9F4FB']]); X.fillRect(x0, y0, x1 - x0, sill - y0);   // the sky…
      for (let i = 0; i < 6; i++) circle(x0 + (x1 - x0) * (i / 5), sill - 60 - 60 * hash(i), 110 + 40 * hash(i + 3), { fill: ['#E28A2E', '#C8502E', '#E8B23A'][i % 3], stroke: null });   // …autumn trees
      shape(rectPts(x0, sill - 70, x1 - x0, 70), { fill: '#8FBF5A', stroke: null });
      const s = 26, rise = riseFn(t), A0 = measure(() => RIG[who](0, 0, s, { t, ...faceFn(t) }));
      const fy = sill - 2 * s - A0.head[1] - rise * 7 * s + (1 - rise) * 6 * s;
      RIG[who](W / 2 + 30 * Math.sin(t * .7), fy, s, { t, ...faceFn(t) });
      // the wall below the sill, the frame, the sashes, the curtains
      X.fillStyle = C_IN.wall; X.beginPath(); X.rect(0, 0, W, H); X.rect(x1, y0, x0 - x1, sill - y0); X.fill('evenodd');
      shape(rectPts(0, H * .86, W, H * .14), { fill: C_IN.sage, stroke: null });
      const bar = (pts, w) => { line(pts, { stroke: PAL.ink, lwPx: w + 4 }); line(pts, { stroke: C_IN.trim, lwPx: w }); };
      bar([[x0, (y0 + sill) / 2], [x1, (y0 + sill) / 2]], 22); for (const f of [1 / 3, 2 / 3]) bar([[x0 + (x1 - x0) * f, y0], [x0 + (x1 - x0) * f, sill]], 12);
      shape(rectPts(x0 - 18, y0 - 18, x1 - x0 + 36, sill - y0 + 36), { fill: null, stroke: C_IN.trim, lwPx: 36 });
      shape(rectPts(x0 - 60, sill + 12, x1 - x0 + 120, 30), { fill: C_IN.trim, stroke: PAL.ink, lwPx: 4 });
      X.save(); X.beginPath(); X.rect(x0, y0, x1 - x0, sill - y0); X.clip(); X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.moveTo(x0 + 200, y0); X.lineTo(x0 + 320, y0); X.lineTo(x0 + 140, sill); X.lineTo(x0 + 20, sill); X.fill(); X.restore();
      for (const sd of [0, 1]) { const cx = sd ? x1 + 40 : x0 - 40, dir = sd ? -1 : 1;   // mustard curtains, inside
        shape([[cx - dir * 200, 0], [cx + dir * 60, 0], [cx + dir * 30 + 6 * Math.sin(t * .6 + sd), H], [cx - dir * 200, H]], { fill: C_IN.mustard, stroke: PAL.ink, lwPx: 4 });
        for (let i = 1; i < 4; i++) line([[cx - dir * 200 + dir * i * 60, 0], [cx - dir * 200 + dir * i * 60 + 4, H]], { stroke: 'rgba(150,100,20,.35)', lwPx: 4 }); }
    };
  }
  const housamFace = t => t < 20 ? { eyes: 'wide', brows: 'up', mouth: 'o', lookX: .4 * Math.sin(t * 1.5), lookY: .3 } : { eyes: 'wide', brows: 'up', mouth: 'O', lookY: .3, lookX: -.2, emote: null };
  const peekHousam = peekIn('housam', t => t < 20 ? ease(seg(t, 15.4, 16.6)) : 1.1, housamFace);
  const jawHousam = t => { peekIn('housam', () => 1.1, () => ({ eyes: 'wide', brows: 'up', mouth: 'O', lookY: .3, jump: .2 * kick(t, 43.9, 6) }))(t); sfx('!', W * .5 + 180, H * .22, 120, '#FFE066', t - 43.9, { life: 1.4 }); };
  const peekDanny = peekIn('danny', t => .55 + .7 * jumpK(t) - .3, () => ({ eyes: 'wide', brows: 'up', mouth: 'o', lookY: .3 }));
  const jawDanny = t => { peekIn('danny', () => .55 + .7 * Math.abs(Math.sin(Math.PI * (t - 61.0) / .8)), () => ({ eyes: 'wide', brows: 'up', mouth: 'O', lookY: .3 }))(t); sfx('!', W * .5 + 160, H * .22, 120, '#FFE066', t - 61.2, { life: 1.2 }); };

  scene({ duration: END, fps: 24, bpm: 112,                // id, title, dialogue, music: see asset.js
    shots: [
      // part 1: sent outside; the first peek
      [0, opening], [4.4, lawn], [SNEAK1[0] - .2, wide], [SNEAK1[1] + .4, spyL], [15.2, peekHousam], [17.4, pov], [21.4, spyL], [24.6, girls],
      // part 2: a closer look
      [34.6, spyL], [37.4, povSafadi], [ROBO0, laptopRobo], [43.8, jawHousam], [45.6, wide], [SNEAK2[1] + .4, spyR], [51.0, peekDanny], [53.0, povSami],
      [SOCCER0, laptopSoccer], [61.0, jawDanny], [BACK[0] - .2, wide],
      // part 3: not fair; the idea
      [66.0, lawn], [THINK - .2, think], [SLAP, lawn], [EVIL, evil],
    ] });
})();
