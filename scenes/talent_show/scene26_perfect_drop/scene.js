// Scene 26: "The Perfect Drop". The finale of the competition arc (scenes 23–25): a music video cut to the Gemini song in
// song.mp3 (lyrics.js). Princess Pearl, the judge who is never dazzled, headlines the after-show concert in the DCES gym and
// sings every line, golden mic in flipper. Everyone else performs around her: Jenna's and Alma's cartwheels, Housam's bicycle
// kick, Danny's puggle, the parents going crazy, Professor Safadi's lesson in the bridge, Fester's guitar solo (with Robo-Safadi
// on drums), and the whole cast in the last chorus. On "MIC DROP!" she drops the mic, the music stops dead, and in the silence
// Neptune rises from a puddle, picks it up and introduces himself. THE END.
// Story shots are in the gym: stage view (dir −1, +X is screen-LEFT) for the concert, scoreboard view (dir 1) for the audience.
// The choruses and the big musical moments are motion-graphics panels, as in scenes 17 and 22. Every shot is a pure function of t.
(() => {
  const G = LOCATIONS.school_gym;
  const PK = .85;                                                             // Pearl is a plush: a bit smaller on the stage throne
  const KIDS = ['housam', 'alma', 'jenna', 'danny'];

  // ---------- timing (seconds into song.mp3, 115 BPM) ----------
  const at = id => pdRow(id).at, word = pdWordAt;
  const C = (c, i) => at(`${c}.${i}`);
  const T_ = {
    title: .6, ready: at('ready'), woo2: at('woo2'), go: at('go'), goHit: word('go', 2),
    jenna: at('jenna'), alma: at('alma'), sky: word('alma', 5), practiced: at('practiced'), smiling: at('smiling'),
    housam: at('housam'), soccer: word('housam', 3), crowd: at('crowd'), crazy: word('crowd', 4), score: at('score'), board: word('score', 5),
    reward: at('reward'), wonderful: word('reward', 2),
    danny: at('danny'), magic: word('danny', 3), super: at('super'), puggle: at('puggle'), puggleW: word('puggle', 4), trophies: at('trophies'),
    drink: at('drink'), noW: word('drink', 2), drinkW: word('drink', 5), think: at('think'), thinkW: word('think', 6),
    practice: at('practice'), test: at('test'), testW: word('test', 5),
    prof: at('prof'), ear: at('ear'), shortcut: at('shortcut'), notW: word('shortcut', 3), exist: word('shortcut', 4),
    fist: at('fist'), openW: word('fist', 3), learn: at('learn'), turn: at('turn'), turnW: word('turn', 5),
    drop: at('drop'), dropW: word('drop', 5), kings: at('kings'), kingsW: word('kings', 2),
    solo: 108.9, soloEnd: 125.3, low: at('low'), mic: at('mic'), micW: word('mic', 1),
  };
  T_.release = T_.micW + .12;                                                 // she lets go on "DROP!"
  T_.thud = 147.15;                                                           // the mic hits the stage, just as the music dies
  T_.drip = [148.9, 149.55, 150.15];
  T_.rise = 151.1; T_.grab = 152.35; T_.tap = [152.7, 152.95];
  T_.testing = 153.1; T_.king = 154.9; T_.wink = 157.3; T_.iris = 157.9; T_.theEnd = 158.9; T_.END = 160.6;
  T_.bonk = 124.9;                                                            // the ball that ends Fester's guitar solo
  const sing = (t, rest = 'smile') => lipFlap(t, pdSinging(t), rest, ['open', 'o', 'open', 'smile']);
  const on = (t, a, b, r = .25) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const bob = (t, amt = 1) => amt * Math.abs(Math.sin(beatPos(t) * Math.PI));   // a bounce on every beat
  const inW = (t, a, b) => t >= a && t < b;
  const shakeC = (t, a) => { const [dx, dy] = shakeXY(t, a); return [W / 2 - dx, H / 2 - dy]; };

  // ---------- the rigs ----------
  const RIG = {
    safadi: [safadi, SAFADI_UNIT, 16], sami: [sami, SAMI_UNIT, 16], housam: [housam, HOUSAM_UNIT, 15], alma: [alma, ALMA_UNIT, 10.5],
    jenna: [jenna, JENNA_UNIT, 11.8], danny: [danny, DANNY_UNIT, 14], dragon: [dragon, DRAGON_UNIT, 13], robo_safadi: [roboSafadi, ROBO_SAFADI_UNIT, 14],
    jester_fester: [jester, JF_UNIT, 13], clawd: [clawd, CLAWD_UNIT, 8], neptune: [neptune, NT_UNIT, 9],
  };
  // Draw a character at screen (x, y), k = px per world unit. A pose with _spin turns the figure about its middle (cartwheels).
  function fig(name, x, y, k, o = {}) {
    const [fn, unit, h] = RIG[name], s = unit * k;
    if (o._spin) {
      const cy = y - (h + (o.jump || 0) + 3 * (1 - Math.cos(o._spin)) / 2) * s;
      X.save(); X.translate(x, cy); X.rotate(o._spin); X.translate(-x, -cy);
      const A = fn(x, y, s, { t: T, ...o, jump: o.jump || 0, noShadow: true }); X.restore();
      ellipse(x, y, 3 * s, .55 * s, { fill: 'rgba(40,20,30,.2)', stroke: null });
      return A;
    }
    return fn(x, y, s, { t: T, ...o });
  }
  // The kids' stock gestures, in each rig's local units (from scenes 22 and 24).
  const KID = {
    housam: { up: { handL: [-4.6, -24], handR: [4.6, -24], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [4.2, -22], handPoseR: 'fist' }, ears: { handL: [-3.2, -24.4], handR: [3.2, -24.4], handPoseL: 'palm', handPoseR: 'palm' } },
    alma: { up: { handL: [-5, -11], handR: [5, -11], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [4.9, -13.4], handPoseR: 'point' }, ears: { handL: [-4.4, -13.6], handR: [4.4, -13.6], handPoseL: 'palm', handPoseR: 'palm' } },
    jenna: { up: { handL: [-4.2, -19], handR: [4.2, -19], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [3.9, -17.5], handPoseR: 'point' }, ears: { handL: [-3.6, -20.4], handR: [3.6, -20.4], handPoseL: 'palm', handPoseR: 'palm' } },
    danny: { up: { handL: [-4.3, -20], handR: [4.3, -20], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [4.2, -19], handPoseR: 'fist' }, ears: { handL: [-3.4, -21.2], handR: [3.4, -21.2], handPoseL: 'palm', handPoseR: 'palm' } },
  };
  const JSTAR = { handL: [-8.2, -20.6], handR: [8.2, -20.6], handPoseL: 'palm', handPoseR: 'palm', footL: [-5.2, -2.2], footR: [5.2, -2.2], eyes: 'happy', mouth: 'grin' };
  const ASTAR = { handL: [-5.4, -10.6], handR: [5.4, -10.6], handPoseL: 'palm', handPoseR: 'palm', footL: [-3.6, -1.4], footR: [3.6, -1.4], eyes: 'happy', mouth: 'grin' };
  const cheer = (nm, t, i = 0) => ({ ...KID[nm].up, eyes: 'happy', mouth: 'grin', jump: 1.4 * bob(t + i * .13) });

  // ---------- Princess Pearl and her microphone ----------
  // mic: 'sing' (at her beak), 'raise' (held high, rock star), 'out' (held out at flipper's length, about to drop), 'none'.
  function pearlPose(t, o = {}) {
    const p = { sit: 1, eyes: 'happy', brows: 'up', mouth: sing(t), wag: .35 * Math.sin(beatPos(t) * Math.PI), headTilt: .06 + .05 * Math.sin(beatPos(t) * Math.PI * .5),
      crownTilt: .06 * Math.sin(t * 3), dy: .25 * bob(t), point: 1, pointAng: -.55, flipFar: -.5 + .35 * Math.sin(beatPos(t) * Math.PI) };
    return Object.assign(p, o);
  }
  function drawPearl(x, y, s, pose, mic = 'sing') {
    const A = pearl(x, y, s, pose);
    if (mic === 'none') return A;
    // the rig's anchors are in screen px; bring them back into the current frame (the LIVE inset draws translated and scaled)
    const inv = X.getTransform().invertSelf(), loc = p => [inv.a * p[0] + inv.c * p[1] + inv.e, inv.b * p[0] + inv.d * p[1] + inv.f];
    const L = { head: loc(A.head), mouth: loc(A.mouth), nose: loc(A.nose), flipper: loc(A.flipper) };
    const tip = L.flipper, ms = s * .8;
    if (mic === 'sing') beakMic(L, s);
    else if (mic === 'raise') pdMic(tip[0], tip[1], ms, -Math.PI / 2 - .25, { glow: .8 });
    else if (mic === 'out') pdMic(tip[0], tip[1], ms, -Math.PI / 2 + .1 * Math.sin(T * 2), { glow: 1 });
    return A;
  }
  // A mic held up to a dolphin's beak: the grille just under the mouth, the grip running back toward the near flipper.
  function beakMic(A, s, o = {}) {
    const ms = s * .8, d = [A.nose[0] - A.head[0], A.nose[1] - A.head[1]], dl = Math.hypot(...d) || 1;
    const G = [A.mouth[0] + d[0] / dl * .2 * s, A.mouth[1] + d[1] / dl * .2 * s + 1.5 * s];
    const a = Math.atan2(G[1] - A.flipper[1], G[0] - A.flipper[0]) + (o.tilt || 0), len = 5.2 * ms + 1.25 * ms * .35;
    pdMic(G[0] - Math.cos(a) * len, G[1] - Math.sin(a) * len, ms, a, { glow: o.glow ?? .5 });
  }
  // Pearl on her pink-and-gold throne, in screen space: (x, y) = the floor under the throne, k = px per world unit.
  const THR = .56;                                                            // the throne, scaled to suit a plush on a school stage
  function pearlThrone(x, y, k, t, o = {}, mic = 'sing') {
    ysThrone(x, y, k * THR, t);
    return drawPearl(x, y - 95 * THR * k, PP_UNIT * PK * k, pearlPose(t, o), mic);
  }
  // A round "LIVE" picture-in-picture of Pearl singing, for the panels where the others take the spotlight.
  function pearlInset(t, x = 250, y = H - 300, r = 175, o = {}) {
    const pop = backOut(clamp((o.age ?? 9) / .3));
    if (pop <= 0) return;
    X.save(); X.translate(x, y); X.scale(pop, pop); X.rotate(-.05);
    circle(0, 0, r + 12, { fill: PD.pink, stroke: PD.ink, lwPx: 7 });
    X.save(); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.clip();
    shape(rectPts(-r, -r, 2 * r, 2 * r), { fill: radGrad(0, 0, 10, r * 1.2, [[0, '#FFE3F0'], [1, '#E58BC0']]), stroke: null });
    ysSunburst(0, 0, t, '#FFD0E6', '#F7B5D6', 14, .3);
    drawPearl(-r * .27, r * 1.16, r * .09, pearlPose(t, { eyes: 'closed', ...o.pose }), 'sing');
    X.restore();
    // LIVE tag
    X.save(); X.translate(-r * .1, -r - 8); X.rotate(.06);
    shape(rectPts(-62, -22, 124, 44), { fill: '#D83A3A', stroke: PD.ink, lwPx: 5, smooth: .2 });
    circle(-38, 0, 8, { fill: Math.sin(t * 8) > 0 ? '#FFFFFF' : '#FFB0B0', stroke: null });
    X.font = `30px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFFFF'; X.fillText('LIVE', 12, 2);
    X.restore();
    X.restore();
  }

  // ---------- the gym: blocking (world units; stage view, so +X is screen-LEFT) ----------
  const STAGE_Y = 100, STAGE_Z = 260, THRONE = [0, 150], COURT_Z = 820;   // kids along the front (Z 260), the throne upstage by the curtain
  const GSET = (t, o = {}) => ({ lights: 1, sun: .3, curtain: 1, stageHoopUp: 1, clock: 0, period: 4, score: { home: 10, guest: 10 }, ...o });
  // Draw a list of figures in a gym camera, far to near, interleaved with the set. Each item: { name, x, y, z, pose } or { z, draw }.
  function gym(t, cam, items, o = {}) {
    const P = persp(cam), A = {}, list = [];
    for (const it of items) {
      if (P.depth(it.z) < 40) continue;
      list.push({ z: it.z, name: it.name, draw: it.draw ? () => it.draw(P) : () => {
        const [sx, sy, k] = P.p(it.x, it.y || 0, it.z);
        if (it.name === 'pearl') {                                                // Pearl on her throne on the stage
          const [tx, ty, tk] = P.p(it.x, it.y || 0, it.z);
          A.pearl = pearlThrone(tx, ty, tk, t, it.pose || {}, it.mic || 'sing'); A.pearl.k = tk;
          return;
        }
        A[it.name] = fig(it.name, sx, sy, k, it.pose || {}); A[it.name].k = k; A[it.name].s = RIG[it.name][1] * k;
        it.after && it.after(A[it.name], RIG[it.name][1] * k, P);
      } });
    }
    list.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    const gs = GSET(t, o.set);
    const darken = (a = o.dark) => { if (!a) return; X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'multiply'; X.globalAlpha = a; X.fillStyle = o.darkCol || '#2A1C44'; X.fillRect(-50, -50, W + 100, H + 100); X.restore(); };
    // the darkness falls on the set; the lit characters stay bright (o.dim: names drawn as silhouettes in the dark)
    layer(() => { G.back(P, t, { ...gs, splitZ: list.length ? list[0].z : -Infinity }); if (P.dir < 0 && cam.z > 1000) pdBanner(P, t); darken(); o.backFx && o.backFx(P); }, { blur: o.blur || 0 });
    list.forEach((it, i) => {
      if (o.dim && it.name && o.dim[it.name]) layer(it.draw, { filter: `brightness(${1 - o.dim[it.name]})` }); else it.draw();
      const front = () => G.front(P, t, { ...gs, splitZ: it.z, toZ: list[i + 1]?.z });
      if (o.dark) layer(front, { filter: `brightness(${(1 - .85 * o.dark).toFixed(3)})` }); else front();
    });
    return { A, P };
  }
  const PEARL_ON_STAGE = (o = {}, mic) => ({ name: 'pearl', x: THRONE[0], y: STAGE_Y, z: THRONE[1], pose: o, mic });
  const drift = (t, a = 1) => [10 * a * Math.sin(t * .23), 5 * a * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f, dir = -1, a = 1) => t => { const [dx, dy] = drift(t, a); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const CAM = {
    stageW: cam(0, 210, 1180, 470, 1150),                                     // the whole stage from the court
    stageM: cam(0, 200, 700, 660, 1000),                                      // the stage, closer
    pearlCU: cam(-20, 250, 480, 640, 1500, -1, .5),                            // Pearl on her throne, close
    court: cam(60, 170, 1250, 430, 900),
    danny: cam(130, 190, 560, 650, 1000),                                     // Danny beside the throne, medium                                      // the court in front of the stage, and the stage hoop
    aud: cam(0, 260, 840, 430, 760, 1),                                       // the audience: judges' table and the parents
    board: { x: 0, y: 260, z: 1500, f: 1100, hy: 820, dir: 1 },               // tilted up at the scoreboard
  };
  const push = (c, t0, t1, dz, dhy = 0, dy = 0) => t => { const q = c(t), u = ease(seg(t, t0, t1)); return { ...q, z: q.z - dz * u, hy: q.hy + dhy * u, y: q.y + dy * u }; };

  // ---------- panels (motion graphics) ----------
  const panel = (t, c1, c2, cx = W / 2, cy = H * .55) => { ysSunburst(cx, cy, t, c1, c2, 18, .15); ysDots('#FFFFFF', .07, 46, 6, t); };
  const floorLine = (y, col = 'rgba(30,18,34,.35)') => shape(rectPts(-40, y, W + 80, H - y + 40), { fill: col, stroke: null });
  const slam = (txt, x, y, size, col, t, t0, rot = 0, o = {}) => overlay(() => ysSlam(txt, x, y, size, col, t, t0, rot, o));
  function lineup(t, names, y, k, o = {}) {
    const n = names.length, gap = o.gap ?? 330;
    names.forEach((nm, i) => fig(nm, W / 2 + (i - (n - 1) / 2) * gap + (o.dx || 0), y, k, { ...cheer(nm, t, i), ...(o.pose ? o.pose(nm, i) : {}) }));
  }

  // ================= INTRO =================
  // 0–3.4: the dark gym; two spotlights sweep the closed curtain; the title.
  function darkOpen(t) {
    const { P } = gym(t, CAM.stageW(t), [], { set: { lights: .12, curtain: 0, sun: 0 }, dark: .55 });
    X.save(); X.globalCompositeOperation = 'lighter';
    [0, 1].forEach(i => { const x = W / 2 + Math.sin(t * 1.3 + i * 2.4) * 420 * (1 - seg(t, 2.4, 3.3)); cbSpot(x, -40, H * .72, 300, .2, i ? '#FFB3D9' : '#FFF1C8'); });
    X.restore();
    pdTitle(t, T_.title, { life: 2.6, y: H * .32 });
  }
  // 3.4–5.5: "Are you ready for the show?" The curtain opens on Pearl, mic at her beak.
  function curtainUp(t) {
    const c = push(CAM.stageW, 3.4, 5.6, 260, 30)(t), up = ease(seg(t, 3.5, 5.3));
    gym(t, c, [PEARL_ON_STAGE({ eyes: t < 4.3 ? 'closed' : 'sparkle', headTilt: .25 })], { set: { lights: lerp(.12, 1, ease(seg(t, 4.4, 5.2))), curtain: up, sun: .3 * up }, dark: .55 * (1 - ease(seg(t, 4.4, 5.2))) });
    X.save(); X.globalCompositeOperation = 'lighter'; cbSpot(W / 2, -40, H * .78, 420, .22 * (1 - .5 * seg(t, 4.6, 5.4))); X.restore();
    flash(.35 * kick(t, 4.7, 7), '#FFF4D6');
  }
  // 5.5–7.4: "Woo-oo-oo": Pearl up close, mic high, crown glinting.
  function wooCU(t) {
    gym(t, CAM.pearlCU(t), [PEARL_ON_STAGE({ eyes: 'closed', headTilt: .15 + .06 * Math.sin(t * 3), brows: 'up', mouth: sing(t, 'o') })], { blur: 3.5,
      backFx: () => { pdBeams(t, ['#FF6FB0', '#B48AE0', '#7FE3FF'], { n: 5, a: .14 }); } });
  }
  // 7.4–8.5: "Here we go!": the stage lights slam on; Jenna and Alma run in from the wings; confetti.
  function hereWeGo(t) {
    const u = ease(seg(t, 7.5, 8.4));
    gym(t, CAM.stageW(t), [PEARL_ON_STAGE({ eyes: 'happy', point: 1, pointAng: -1.6 }, 'raise'),
      { name: 'jenna', x: lerp(560, 300, u), y: STAGE_Y, z: STAGE_Z, pose: u < 1 ? { ...jennaSkip(t * 6, 1), mouth: 'grin', eyes: 'happy' } : cheer('jenna', t) },
      { name: 'alma', x: lerp(-560, -300, u), y: STAGE_Y, z: STAGE_Z, pose: u < 1 ? { ...almaSkip(t * 6, 1), mouth: 'grin', eyes: 'happy' } : cheer('alma', t, 1) }],
      { backFx: () => pdBeams(t, undefined, { n: 6, a: .12 + .2 * kick(t, T_.goHit, 4) }) });
    ysConfetti(t, T_.goHit - .1, 'mixed', 70);
    flash(.45 * kick(t, T_.goHit, 7), '#FFF4D6');
  }

  // ================= VERSE 1 =================
  // "Jenna spins and cartwheels high": four cartwheels across the front of the stage.
  const J0 = T_.jenna + .1, JW = .48;
  function jennaWheel(t) {
    const u = seg(t, J0, J0 + 4 * JW), wheel = inW(t, J0, J0 + 4 * JW);
    gym(t, CAM.stageM(t), [PEARL_ON_STAGE({ lookX: -.6, eyes: 'happy' }),
      { name: 'jenna', x: lerp(380, -380, u), y: STAGE_Y, z: STAGE_Z - 30, pose: wheel ? { ...JSTAR, _spin: TAU * 4 * u } : t < J0 ? { ...JSTAR, eyes: 'open' } : { ...cheer('jenna', t), jump: 1.6 * kick(t, J0 + 4 * JW, 3) } }],
      { blur: 1, backFx: () => pdBeams(t, ['#FFB3D9', '#FFE066'], { n: 4, a: .1 }) });
    if (t > J0 + .2) sfx('WHEEE!', W * .3, H * .22, 70, PD.pinkLt, t - J0 - .2, { life: 1.4 });
  }
  // "Alma tries and hits the sky": one cartwheel, then a star jump so high the camera tilts up after her.
  function almaSky(t) {
    const A0 = T_.alma + .05, AW = .7, jumpT = T_.sky - .35, up = Math.sin(Math.PI * clamp(seg(t, jumpT, jumpT + 1.2)));
    const c = { ...CAM.stageM(t), hy: CAM.stageM(t).hy + 260 * up };
    const wheel = inW(t, A0, A0 + AW), u = seg(t, A0, A0 + AW);
    gym(t, c, [PEARL_ON_STAGE({ lookX: .5, lookY: -.6 * up, eyes: 'wide' }),
      { name: 'alma', x: lerp(-300, -80, u), y: STAGE_Y, z: STAGE_Z - 30,
        pose: wheel ? { ...ASTAR, _spin: -TAU * u } : t > jumpT ? { ...ASTAR, jump: 70 * up, eyes: 'star', power: up, handL: [-5.6, -13], handR: [5.6, -13] } : { ...ASTAR, eyes: 'happy' } }],
      { blur: 1 });
    if (up > .6) { overlay(() => { X.save(); X.globalCompositeOperation = 'lighter'; shape(starPts(W * .55, H * .12, 90 * up, .45, 5, t), { fill: rgba('#FFE066', .8), stroke: null }); X.restore(); }); sfx('SKY HIGH!', W * .72, H * .18, 72, PD.goldLt, t - jumpT - .3, { life: 1.0 }); }
  }
  // "They both practiced every day": a week of calendar pages, Alma flopping until she lands it.
  function practiceDays(t) {
    panel(t, '#3A1B63', '#57288A', W * .62, H * .5);
    pearlThrone(W * .17, H * 1.02, 2.4, t, { lookX: .6, eyes: 'happy' });
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'], d = clamp(Math.floor((t - T_.practiced) / .42), 0, 4), f = frac((t - T_.practiced) / .42);
    pdCalendar(W * .62, H * .3, 300, days[d], { num: `${d + 1}`, mark: d < 3 ? '✗' : '✓', col: d < 3 ? '#D23A5A' : '#2E9C4A', flip: d < 4 && f > .8 ? 1 - 4 * (f - .8) : 1, ang: -.04 });
    // the day's attempt: a flop, a flop, a wobble, then the real thing
    const k = clamp(f / .8), lvl = [0, .25, .55, 1, 1][d];
    const spin = -TAU * k * (lvl > .5 ? 1 : .35), fall = lvl < .5 && k > .5 ? (k - .5) * 2 : 0;
    fig('alma', W * .52, H * .98, 2.6, { ...ASTAR, _spin: spin + (lvl < .5 ? -fall * 1.2 : 0), eyes: lvl < .5 && k > .5 ? 'squeeze' : 'happy', mouth: lvl < .5 && k > .5 ? 'wobble' : 'grin' });
    fig('jenna', W * .8, H * .98, 2.5, { ...JSTAR, _spin: -TAU * k, eyes: 'happy' });
  }
  // "Now they're smiling all the way": the girls flank the throne with their trophies.
  function girlsSmile(t) {
    gym(t, push(CAM.stageM, T_.smiling - .3, T_.housam, 120)(t), [PEARL_ON_STAGE({ eyes: 'sparkle', lookX: 0 }),
      { name: 'jenna', x: 170, y: STAGE_Y, z: THRONE[1] + 40, pose: { ...KID.jenna.up, eyes: 'happy', mouth: 'grin', jump: .6 * bob(t) }, after: (A, s) => cdTrophy(A.handL[0], A.handL[1] + 1 * s, 9 * s, 'rope', 1, t) },
      { name: 'alma', x: -170, y: STAGE_Y, z: THRONE[1] + 40, pose: { ...KID.alma.up, eyes: 'star', mouth: 'grin', jump: .6 * bob(t + .2), power: .4 }, after: (A, s) => cdTrophy(A.handR[0], A.handR[1] + 1 * s, 9 * s, 'rope', 1, t) }],
      { blur: 1.5, backFx: () => pdBeams(t, ['#FFB3D9', '#FFE066'], { n: 4, a: .1 }) });
  }
  // "Housam kicks the soccer ball": the bicycle kick from scene 24, into the stage hoop (winched down for him).
  const H_TOSS = T_.housam + .1, H_BIKE = [T_.soccer - .45, T_.soccer + .45], H_HIT = T_.soccer, H_RIM = T_.soccer + .75;
  const CONTACT = [130, 185, COURT_Z + 14], RIMW = [0, 280, 545];
  function hBall(t) {
    if (t < H_TOSS) return [148, 11, COURT_Z + 40];
    if (t < H_HIT) { const u = seg(t, H_TOSS, H_HIT); return [lerp(148, CONTACT[0], u), lerp(11, CONTACT[1], u) + 170 * Math.sin(Math.PI * u), lerp(COURT_Z + 40, CONTACT[2], u)]; }
    if (t < H_RIM) { const u = seg(t, H_HIT, H_RIM); return [lerp(CONTACT[0], RIMW[0], u), lerp(CONTACT[1], RIMW[1], u) + 260 * Math.sin(Math.PI * u), lerp(CONTACT[2], RIMW[2], u)]; }
    const b = t - H_RIM; return [-30 * easeOut(seg(b, 0, 2)), Math.max(11, RIMW[1] - 6 - 400 * b * b), RIMW[2] - 100 * easeOut(seg(b, 0, 2))];
  }
  function housamKick(t) {
    const bike = inW(t, ...H_BIKE), u = seg(t, ...H_BIKE);
    const pose = bike ? { handL: [-5.4, -20], handR: [5.4, -20], eyes: 'squeeze', mouth: 'grin', brows: 'focused', footL: [-1.4, -6], footR: u > .3 && u < .7 ? [2.0, -9.2] : [1.4, -6], jump: 14 * Math.sin(Math.PI * u), _spin: TAU * ease(u) }
      : t > H_RIM ? { ...KID.housam.up, handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'grin', jump: 1.6 * kick(t, H_RIM + .05, 3) } : { brows: 'focused', mouth: 'smirk', lookY: -.6, handL: [-4.6, -12], handR: [4.6, -12] };
    gym(t, CAM.court(t), [PEARL_ON_STAGE({ lookX: .3, eyes: t > H_RIM ? 'sparkle' : 'open' }),
      { name: 'housam', x: 130, y: 0, z: COURT_Z + 20, pose },
      { z: hBall(t)[2], draw: P => { const [bx, by, bk] = P.p(...hBall(t)); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: 11 / HOUSAM_UNIT, spin: t * 9 }); } }],
      { set: { stageHoopUp: 0, swishStage: t > H_RIM ? kick(t, H_RIM, 3) : 0 } });
    if (t > H_BIKE[0]) sfx('BICYCLE KICK!', W * .66, H * .2, 64, PD.goldLt, t - H_BIKE[0] - .1, { life: 1.1 });
    if (t > H_RIM) sfx('SWISH!', W * .5, H * .16, 80, '#8FE3FF', t - H_RIM, { life: 1.0 });
  }
  // "Makes the crowd go crazy": the parents leap out of their chairs; the Safadi brothers lead the cheering.
  const SEATX = [-600, -480, -360, -240, -120, 120, 240, 360, 480, 600];
  function audience(t, P, o = {}) {
    for (let row = CB_ROWS.length - 1; row >= 0; row--) {
      const z = CB_ROWS[row];
      SEATX.forEach((x, i) => {
        if (row === 1 && (x === 480 || x === 600)) {                            // the Safadi brothers
          const nm = x === 480 ? 'safadi' : 'sami', [sx, sy, k] = P.p(x, 0, z + 20);
          fig(nm, sx, sy, k, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'O', jump: (o.jump ?? 1) * 1.6 * bob(t + i * .1), power: .4 * (o.power || 0), noShadow: true });
          return;
        }
        cbChair(P, x, z);
        const seed = 200 + row * 17 + i * 5, look = { ...studentLook(seed), backpack: false, cap: hash(seed) < .15 }; look.h *= 1.3;
        const up = o.stand ?? 1, [sx, sy, k] = P.p(x, up > .5 ? 0 : CB_SEAT, z + 14);
        student(sx, sy, STUDENT_UNIT * k, { look, t, sit: up > .5 ? 0 : 1, jump: up * (1.2 + hash(seed) * 1.2) * bob(t + hash(seed)), handL: [-3.6, -14 - 3 * up], handR: [3.6, -14 - 3 * up], eyes: 'happy', mouth: 'open', noShadow: true });
      });
    }
  }
  function judgesRow(t, P, o = {}) {
    cbJudgeChair(P, CB_JUDGES.dragon, false); cbJudgeChair(P, CB_JUDGES.jester_fester, false); cbJudgeChair(P, CB_JUDGES.princess_pearl, true);
    const [dx, dy, dk] = P.p(CB_JUDGES.dragon, 0, 1262), [fx, fy, fk] = P.p(CB_JUDGES.jester_fester, 0, 1262);
    const D = o.noDragon ? null : fig('dragon', dx, dy, dk, { eyes: 'happy', mouth: 'grin', wings: .8, flap: .6 * Math.sin(t * 14), jump: 1.6 * bob(t), ...(o.dragon || {}) });
    const F = fig('jester_fester', fx, fy, fk, { handL: [-5.3, -15.4], handR: [5.3, -15.4], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', mouth: 'grin', jump: 1.4 * bob(t + .2), ...(o.fester || {}) });
    cbJudgesTable(P);
    return { D, F, dk, fk };
  }
  function crowdCrazy(t) {
    const P = persp(CAM.aud(t));
    layer(() => G.back(P, t, GSET(t)), { blur: 0 });
    audience(t, P, { stand: ease(seg(t, T_.crazy - .4, T_.crazy)) });
    judgesRow(t, P);
    G.front(P, t, GSET(t));
    ysConfetti(t, T_.crazy, 'mixed', 60);
    sfx('WOOOO!', W * .3, H * .15, 80, PD.goldLt, t - T_.crazy, { life: 1.4, rot: -.08 });
    sfx('YEAH!', W * .72, H * .2, 80, PD.pinkLt, t - T_.crazy - .4, { life: 1.2, rot: .08 });
  }
  // "Perfect score up on the board": the scoreboard reads 10 – 10 and the buzzer goes; three paddles slam up: 10, 10, 10.
  function perfectScore(t) {
    const c = { ...CAM.board, hy: CAM.board.hy + 6 * Math.sin(t * .31) };
    const P = persp(c);
    layer(() => G.back(P, t, GSET(t, { buzzer: kick(t, T_.board, 2.5) + kick(t, T_.score + .3, 3), score: { home: 10, guest: 10 } })), { blur: 0 });
    [[word('score', 1), W * .25, 'DRAGON', -.12], [word('score', 3), W * .5, 'FESTER', 0], [T_.board, W * .75, 'PEARL', .12]].forEach(([t0, x, who, ang]) => {
      const k = backOut(seg(t, t0 - .1, t0 + .2)); if (k <= 0) return;
      cbScoreCard(x, H * 1.02 - 120 * k, 380, 10, k, { t, t0, ang });
      overlay(() => { X.save(); X.globalAlpha = clamp(k); X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.lineJoin = 'round'; X.lineWidth = 9; X.strokeStyle = PD.ink; X.strokeText(who, x, H * .96); X.fillStyle = '#FFFDF4'; X.fillText(who, x, H * .96); X.restore(); });
    });
    flash(.3 * kick(t, T_.board, 7), '#FFF4C0');
  }
  // "What a wonderful reward": the four golden trophies line the front of the stage and glint; Pearl sings over them.
  function trophyShine(t) {
    const TR = [[260, 'rope'], [90, 'rope'], [-90, 'ball'], [-260, 'cube']];
    gym(t, push(CAM.stageM, T_.reward - .3, T_.reward + 1.8, 80, 0)(t), [PEARL_ON_STAGE({ eyes: 'sparkle', lookX: 0 }),
      { z: 300, draw: P => TR.forEach(([x, kind], i) => { const [sx, sy, k] = P.p(x, STAGE_Y, 300); cdTrophy(sx, sy, 95 * k, kind, backOut(seg(t, T_.reward - .3 + i * .15, T_.reward + i * .15)), t + i); }) }],
      { blur: 1.2, backFx: () => pdBeams(t, ['#FFE066', '#FFF1C8'], { n: 5, a: .12 }) });
    if (t > T_.wonderful) ysSunburstFlash(t, T_.wonderful);
  }
  function ysSunburstFlash(t, t0) { flash(.25 * kick(t, t0, 6), '#FFF4C0'); sfx('✦', W * .3, H * .3, 90, PD.goldLt, t - t0, { life: .8 }); sfx('✦', W * .7, H * .26, 110, PD.goldLt, t - t0 - .15, { life: .8 }); }

  // ================= THE CHORUSES =================
  // Eight lines, one panel each, with page-turn-style wipes between them. ci = 0…3 (the fourth chorus hands lines 5–8 to the finale).
  const CH_BG = [['#3A1B63', '#57288A'], ['#183A5A', '#22507A'], ['#5A1F4A', '#7A2E62'], ['#123E36', '#1C5A4E']];
  const SHORTCUT_BY = ['housam', 'dragon', 'danny', 'pearl'];
  function chorus(ci) {
    const c = `C${ci + 1}`, CUT = [0, 1, 2, 3, 4, 5, 6, 7].map(i => C(c, i)), [b1, b2] = CH_BG[ci];
    return function chorusShot(t) {
      const i = CUT.filter(x => t >= x - .05).length - 1, li = Math.max(0, i), t0 = CUT[li], w = j => word(`${c}.${li}`, j);
      camBegin(...shakeC(t, 3 * pulse(t)), 1 + .02 * pulse(t, 8));
      if (li === 0 || li === 4) {                                               // "We worked hard and solved it": the cube wall solves behind Pearl
        panel(t, b1, b2, W / 2, H * .42);
        pdCubeWall(W / 2, H * .36, 560, seg(t, t0, CUT[li + 1] - .2), t, { col: ['#E8443A', '#3E7BD8', '#F2C230', '#4CB050'][ci], seed: ci * 3 + li, ang: .04 * Math.sin(t * 2) });
        if (li === 4) [0, 1].forEach(j => {                                     // Jenna and Alma cartwheel past behind her
          const u = frac((t - t0) / 1.05 + j * .5), nm = j ? 'alma' : 'jenna';
          fig(nm, lerp(-150, W + 150, j ? 1 - u : u), H * .95, 2.2, { ...(j ? ASTAR : JSTAR), _spin: (j ? -1 : 1) * TAU * u * 2 });
        });
        floorLine(H * .9);
        pearlThrone(W / 2, H * 1.04, 2.6, t, { eyes: li === 0 ? 'sparkle' : 'happy', headTilt: .1 });
        slam('SOLVED!', W * .8, H * .2, 110, PD.goldLt, t, w(4), .08, { life: 1.2 });
      } else if (li === 1 || li === 5) {                                        // "Yes we solved it, yeah!"
        panel(t, b2, b1);
        floorLine(H * .9);
        if (li === 1) lineup(t, KIDS, H * 1.02, 2.6, { gap: 430, pose: (nm, j) => ({ jump: 1.4 * bob(t + j * .13) + 2.2 * kick(t, w(4), 4) }) });
        else {                                                                  // the grown-ups: the Safadi twins, Fester and Dragon
          fig('safadi', W * .14, H * 1.08, 2.5, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: bob(t), power: .6 });
          fig('sami', W * .3, H * 1.08, 2.5, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: bob(t + .3) });
          fig('jester_fester', W * .72, H * 1.06, 2.6, { handL: [-5.3, -15.4], handR: [5.3, -15.4], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', mouth: 'grin', jump: bob(t + .15) });
          fig('dragon', W * .88, H * 1.02, 2.3, { ...dragonFlight(t, { lift: 2 + 4 * kick(t, w(4), 4) }), eyes: 'happy', mouth: 'grin', flip: true });
        }
        pearlThrone(W / 2, H * 1.02, 2.0, t, { eyes: 'happy' }, 'raise');
        slam('YEAH!', W / 2, H * .16, 140, PD.pinkLt, t, w(4), -.05, { life: .9 });
      } else if (li === 2 || li === 6) {                                        // "No more shortcuts, solved it"
        panel(t, '#4A2A12', '#6A3A18', W * .55, H * .5);
        floorLine(H * .88);
        const by = li === 2 ? SHORTCUT_BY[ci] : 'potion', hit = w(2), fall = ease(seg(t, hit + .05, hit + .4));
        if (by === 'potion') {                                                  // the secret potion gets stamped NO and thrown away
          fig('sami', W * .5, H * 1.1, 2.9, { handL: [-2.6, -12.8], handR: [2.6, -12.8], handPoseL: 'fist', handPoseR: 'fist', eyes: t > hit ? 'squeeze' : 'open', mouth: t > hit ? 'wobble' : 'smile', brows: 'worried' });
          pdPotion(W * .5 + 60 * fall, H * .5 - 240 * Math.sin(Math.PI * fall) + 300 * fall * fall, 300, { no: seg(t, hit - .05, hit + .2), ang: 2.5 * fall });
        } else {
          pdSign(W * .64, H * .88, 380, 'SHORTCUT →', { fall });
          if (by === 'housam') { fig('housam', W * .2, H * 1.05, 2.8, { footR: t > hit - .2 && t < hit + .2 ? [3.4, -6.4] : [1.5, -1.05], handL: [-4.6, -12], handR: [4.6, -12], brows: 'focused', mouth: 'smirk', eyes: 'open' });
            if (t < hit + .4) { const u = seg(t, hit - .2, hit); housamBall(lerp(W * .28, W * .6, u), lerp(H * .97, H * .42, u) - 120 * Math.sin(Math.PI * u), 2.8 * HOUSAM_UNIT, { spin: t * 9 }); } }
          if (by === 'dragon') { const A = fig('dragon', W * .22, H * 1.02, 2.8, { eyes: 'happy', mouth: t > hit - .2 ? 'open' : 'grin', wings: .5, flip: false });
            ysFlame(A.mouth[0], A.mouth[1], 0, 520, on(t, hit - .25, hit + .6, .1), t); }
          if (by === 'danny') { fig('danny', W * .2, H * 1.04, 3.0, { ...KID.danny.point, handR: [5.2, -18], eyes: 'happy', mouth: 'grin' });
            if (t < hit + .3) { const u = seg(t, hit - .35, hit); cdCube(lerp(W * .28, W * .62, u), lerp(H * .5, H * .4, u) - 80 * Math.sin(Math.PI * u), 26, { ang: t * 9, solve: 1 }); } }
          if (by === 'pearl') { pearlThrone(W * .24, H * 1.02, 2.2, t, { wag: 2.4 * kick(t, hit - .1, 5), eyes: 'happy' }); }
          sfx(by === 'dragon' ? 'FWOOSH!' : 'BONK!', W * .64, H * .3, 110, PD.red, t - hit, { life: .8 });
        }
        slam('NO MORE SHORTCUTS!', W / 2, H * .14, 96, '#FF8A5C', t, t0 + .05, -.03, { life: CUT[li + 1] - t0 });
        if (by !== 'pearl') pearlInset(t, W - 230, H - 290, 160, { age: t - t0 });
      } else {                                                                  // "Watch us solve it now!"
        if (li === 3) {                                                         // Danny's hands solve the cube, close up
          panel(t, '#10203A', '#1C3458', W / 2, H * .5);
          const k = seg(t, t0 + .2, w(4)), cx = W * .56, cy = H * .5, s = 110;
          cdCube(cx, cy, s, { solve: k, seed: 7 + ci, twist: Math.sin(t * 18) * (k < 1 ? 1 : 0), row: Math.floor(t * 5) % 3, glow: k >= 1 ? 1 : 0 });
          cdHands(cx, cy, s, t, { jig: k < 1 ? 1 : 0 });
          pearlInset(t, 250, H - 300, 170, { age: t - t0 });
        } else {                                                                // the whole gang points down the lens
          panel(t, b1, b2);
          floorLine(H * .9);
          lineup(t, KIDS, H * 1.04, 2.7, { gap: 460, pose: nm => (beatPos(t) % 2 < 1 ? KID[nm].point : KID[nm].up) });
          pearlThrone(W / 2, H * .86, 1.7, t, { eyes: 'sparkle' }, 'raise');
        }
        slam('SOLVED!', W / 2, H * .16, 150, PD.goldLt, t, w(4), .04, { life: 1.0 });
        flash(.3 * kick(t, w(4), 8), '#FFF4C0');
      }
      camEnd();
      CUT.slice(1).forEach((tc, j) => { if (Math.abs(t - tc) < .22) ysPageWipe(seg(t, tc - .22, tc + .22), j % 2 ? -1 : 1, CH_BG[ci][0]); });
      if (ci === 3) ysConfetti(t, CUT[0], 'mixed', 40);
    };
  }

  // ================= VERSE 2 =================
  // "Danny takes his magic cube": Danny on the stage beside the throne, the cube sparkling over his head.
  function dannyCube(t) {
    gym(t, CAM.danny(t), [PEARL_ON_STAGE({ lookX: -.5, eyes: 'happy' }),
      { name: 'danny', x: 220, y: STAGE_Y, z: STAGE_Z - 20, pose: { handR: [4.4, -21], handPoseR: 'palm', handL: [-3.6, -12.5], handPoseL: 'fist', eyes: 'happy', mouth: 'grin', brows: 'up' },
        after: (A, s) => { const g = on(t, T_.magic - .2, 99, .3); cdCube(A.handR[0], A.handR[1] - 2.2 * s, s * .55, { solve: 0, seed: 3, glow: g, ang: .1 * Math.sin(t * 3) });
          for (let i = 0; i < 6; i++) { const a = t * 2 + i; if (g > 0) shape(starPts(A.handR[0] + Math.cos(a) * 5 * s, A.handR[1] - 2.2 * s + Math.sin(a) * 4 * s, s * .8 * g * Math.abs(Math.sin(t * 5 + i)), .35, 4), { fill: '#FFF4A8', stroke: null }); } } }],
      { blur: 1.2 });
  }
  // "Solves it like a super dude": a cape, a sunburst, and the cube solving in a blur.
  function superDude(t) {
    camBegin(...shakeC(t, 3 * pulse(t)), 1 + .02 * pulse(t, 8));
    panel(t, '#7A1A1A', '#B02A2A', W * .5, H * .45);
    ysDots('#FFE066', .1, 40, 6, t);
    const x = W * .5, y = H * 1.02, k = 5.4, s = DANNY_UNIT * k, dpose = { handL: [-5.6, -14], handPoseL: 'fist', handR: [5.4, -22], handPoseR: 'palm', eyes: 'happy', mouth: 'grin', brows: 'focused' };
    const M = measure(() => fig('danny', x, y, k, dpose));
    pdCape(M.chest[0], M.chest[1] - 3 * s, s, t, { len: 12 });
    const A = fig('danny', x, y, k, dpose);
    const kk = seg(t, T_.super + .2, word('super', 5));
    cdCube(A.handR[0], A.handR[1] - 2.6 * s * .55 * 1.6, s * .55, { solve: kk, seed: 5, twist: kk < 1 ? Math.sin(t * 22) : 0, row: Math.floor(t * 8) % 3, glow: kk >= 1 ? 1 : 0 });
    camEnd();
    slam('SUPER DUDE!', W * .5, H * .14, 120, PD.goldLt, t, word('super', 4), -.05, { life: 1.4 });
    pearlInset(t, W - 250, H - 300, 160, { age: t - T_.super + .2 });
  }
  // "Then he does the puggle trick": he throws it high, a blur of hands on the catch: solved.
  function puggleTrick(t) {
    const t0 = T_.puggle + .2, t1 = T_.puggleW + .25, up = seg(t, t0, t1), inAir = inW(t, t0, t1);
    gym(t, CAM.danny(t), [PEARL_ON_STAGE({ lookX: -.5, lookY: -.8 * Math.sin(Math.PI * up), eyes: t > t1 ? 'sparkle' : 'wide' }),
      { name: 'danny', x: 220, y: STAGE_Y, z: STAGE_Z - 20, pose: inAir ? { handL: [-4.4, -19.5], handR: [4.4, -19.5], handPoseL: 'palm', handPoseR: 'palm', lookY: -1, eyes: 'open', mouth: 'o' }
        : t > t1 ? { handR: [4.4, -21], handPoseR: 'palm', handL: [-3.6, -12.5], eyes: 'happy', mouth: 'grin', jump: 1.2 * kick(t, t1 + .2, 4) } : { handR: [3.9, -14], handPoseR: 'palm', eyes: 'happy', mouth: 'smirk' },
        after: (A, s) => { const yk = inAir ? -Math.sin(Math.PI * up) * 60 * s : 0; cdCube(A.handR[0], A.handR[1] - 2.2 * s + yk, s * .55, { solve: t > t1 ? 1 : 0, seed: 9, ang: inAir ? t * 14 : .1 * Math.sin(t * 3), glow: t > t1 ? 1 : 0 }); } }],
      { blur: 1.2 });
    if (t > t1) sfx('PUGGLE!', W * .3, H * .2, 100, PD.goldLt, t - t1, { life: 1.2 });
  }
  // "Winning trophies super quick": four golden trophies slam in on the beat.
  function trophyRain(t) {
    camBegin(...shakeC(t, 4 * pulse(t)), 1 + .02 * pulse(t, 8));
    panel(t, '#4A3A10', '#6A5420', W / 2, H * .55);
    ysDots(PD.goldLt, .12, 40, 7, t);
    [['ALMA', 'rope'], ['JENNA', 'rope'], ['HOUSAM', 'ball'], ['DANNY', 'cube']].forEach(([n, kind], i) => {
      const t0 = T_.trophies + i * .42, k = t < t0 ? 0 : t - t0 < .16 ? lerp(2.2, 1, easeIn((t - t0) / .16)) : 1 + .06 * boing(t, t0 + .16, 3, 6), x = W * (.2 + i * .2);
      if (k <= 0) return;
      X.save(); X.translate(x, H * .78); X.scale(k, k); cdTrophy(0, 0, 360, kind, 1, t + i); X.restore();
      X.font = `46px ${FONT_SFX}`; X.textAlign = 'center'; X.lineJoin = 'round'; X.lineWidth = 9; X.strokeStyle = PD.ink; X.strokeText(n, x, H * .86); X.fillStyle = '#FFFDF4'; X.fillText(n, x, H * .86);
    });
    camEnd();
    pearlInset(t, W - 230, 230, 150, { age: t - T_.trophies + .2 });
  }
  // "There is no such magic drink": the brothers' secret potion (broccoli juice) gets stamped NO; Sami takes a sip anyway.
  function noDrink(t) {
    panel(t, '#1E4A1E', '#2E6A2A', W * .5, H * .5);
    const sip = T_.drinkW - .1, gulp = on(t, sip, sip + 1.0, .15);
    fig('safadi', W * .22, H * 1.08, 3.2, { handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: 'flat', eyes: 'open', lookX: .6 });
    const S = fig('sami', W * .66, H * 1.08, 3.2, { handL: [-2.6, -12.8], handR: gulp > 0 ? [3.0, -19.5] : [6.2, -11.5], handPoseL: 'fist', handPoseR: 'fist', eyes: gulp > .5 ? 'squeeze' : 'open', mouth: gulp > .5 ? 'wobble' : 'smile', brows: gulp > .5 ? 'worried' : 'up', lookX: -.4, tilt: gulp * -.1 });
    pdPotion(S.handR[0] + 20, S.handR[1] + 50, 200, { no: seg(t, T_.noW - .05, T_.noW + .2), ang: -2.2 * gulp });
    sfx('BLEECH!', W * .78, H * .2, 110, '#C8F07A', t - sip - .6, { life: 1.0, rot: .1 });
    pearlInset(t, W - 230, 230, 150, { age: t - T_.drink + .3, pose: { headTilt: .2 } });
  }
  // "You just have to stop and think": question marks over Safadi, until the bulb lights.
  function stopThink(t) {
    panel(t, '#2A2A3A', '#3A3A52', W / 2, H * .5);
    const lit = t > T_.thinkW;
    fig('safadi', W * .45, H * 1.12, 3.6, { handR: lit ? [5.8, -21.4] : [0.8, -16.1], handPoseR: lit ? 'point' : 'fist', handL: [-4.4, -8.1], brows: lit ? 'up' : 'quizzical', mouth: lit ? 'grin' : 'flat', eyes: lit ? 'happy' : 'open',
      lookX: lit ? 0 : .5 * Math.sin(t * 3), lookY: lit ? 0 : -.6, bulb: lit ? 1 : 0, power: lit ? ease(seg(t, T_.thinkW, T_.thinkW + .4)) : 0, emote: lit ? undefined : '?', emoteK: 1 });
    if (!lit) ['?', '?', '?'].forEach((q, i) => sfx(q, W * (.18 + .2 * i), H * .25, 120, PD.goldLt, t - T_.think - .2 - i * .4, { life: 1.4, rot: (i - 1) * .2 }));
    if (lit) flash(.35 * kick(t, T_.thinkW, 7), '#FFF4C0');
    pearlInset(t, W - 230, H - 300, 160, { age: t - T_.think + .2 });
  }
  // "Practice hard and play your best": four practice panels around a round Pearl in the middle.
  function practiceGrid(t) {
    const cells = [['jenna', '#5A1F4A', '#7A2E62'], ['alma', '#3A1B63', '#57288A'], ['housam', '#183A5A', '#22507A'], ['danny', '#123E36', '#1C5A4E']];
    cells.forEach(([nm, c1, c2], i) => {
      const x0 = (i % 2) * W / 2, y0 = Math.floor(i / 2) * H / 2;
      X.save(); X.beginPath(); X.rect(x0, y0, W / 2, H / 2); X.clip();
      ysSunburst(x0 + W / 4, y0 + H / 4, t, c1, c2, 14, .2);
      const bx = x0 + W / 4 + (i % 2 ? 70 : -70), by = y0 + H / 2 + 30, u = frac((t - T_.practice) / 1.05), K = 1.3;   // K: the kids fill their panels
      if (nm === 'jenna') fig('jenna', bx + lerp(-280, 280, u), by - 20, 2.1 * K, { ...JSTAR, _spin: TAU * u * 2 });
      if (nm === 'alma') fig('alma', bx, by, 2.4 * K, { ...almaDance(t - PD_BEAT0, 'star jump', { bpm: PD_BPM }), eyes: 'star', mouth: 'grin', power: .5 });
      if (nm === 'housam') { const hk = HOUSAM_UNIT * 2.1 * K, A = fig('housam', bx, by, 2.1 * K, { footR: [2.4, -3.2 - 2.2 * Math.abs(Math.sin(t * 6))], handL: [-4.6, -12], handR: [4.6, -12], brows: 'focused', mouth: 'smirk', lookY: .6 });
        housamBall(bx + 3 * hk, by - (6 + 9 * Math.abs(Math.sin(t * 6))) * hk, hk, { spin: t * 6 }); }
      if (nm === 'danny') { const A = fig('danny', bx, by, 2.5 * K, { handL: [-3.6, -15], handR: [3.6, -15], handPoseL: 'fist', handPoseR: 'fist', eyes: 'open', brows: 'focused', mouth: 'smirk', lookY: .7 });
        cdCube((A.handL[0] + A.handR[0]) / 2, A.handL[1] - 22 * K, 24 * K, { solve: frac(t * .7), seed: Math.floor(t * .7), twist: Math.sin(t * 20), row: Math.floor(t * 6) % 3 }); }
      X.restore();
      line([[W / 2, 0], [W / 2, H]], { stroke: PD.ink, lwPx: 10 }); line([[0, H / 2], [W, H / 2]], { stroke: PD.ink, lwPx: 10 });
    });
    pearlInset(t, W / 2, H / 2, 170, { age: 9 });
  }
  // "That will beat the hardest test": the test fills in, A+ slams on "test"; Pearl sings from the throne.
  function hardestTest(t) {
    panel(t, '#183A5A', '#22507A', W * .6, H * .45);
    pdTestPaper(W * .63, H * .48, 560, t, { check: seg(t, T_.test - .1, T_.testW - .1), stamp: seg(t, T_.testW, T_.testW + .25), ang: .04 });
    pearlThrone(W * .2, H * 1.03, 2.6, t, { lookX: .6, eyes: t > T_.testW ? 'sparkle' : 'happy' });
    flash(.3 * kick(t, T_.testW, 7), '#FFF4C0');
  }

  // ================= BRIDGE =================
  // "Professor Safadi speaks so clear": the gym dims to purple; Safadi steps into a spotlight beside the throne, powers on.
  function safadiClear(t) {
    const pw = ease(seg(t, T_.prof, T_.prof + .8));
    const { A } = gym(t, push(cam(-110, 200, 700, 660, 1000), T_.prof - .2, T_.ear, 120, 10)(t), [PEARL_ON_STAGE({ point: 1, pointAng: -.2, lookX: -.7, eyes: 'happy' }, 'none'),
      { name: 'safadi', x: -240, y: STAGE_Y, z: STAGE_Z - 10, pose: { handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', power: pw, eyes: pw > .6 ? 'glow' : 'open', brows: 'up', mouth: 'smile', lookX: .4 } }],
      { blur: 1.4, dark: .5 * pw, darkCol: '#4A2A6A' });
    if (A.safadi) { X.save(); X.globalCompositeOperation = 'lighter'; cbSpot(A.safadi.head[0], -40, A.safadi.head[1] + 150 * A.safadi.k, 140 * A.safadi.k, .25 * pw, '#E9D6FF'); X.restore(); }
    if (A.pearl) pdMic(A.pearl.flipper[0], A.pearl.flipper[1], PP_UNIT * PK * A.pearl.k * .8, -Math.PI / 2 - .4, { glow: .6 });
  }
  // "Listen up and lend an ear": everyone cups an ear.
  function lendEar(t) {
    panel(t, '#2A1848', '#3A2460', W / 2, H * .5);
    floorLine(H * .9);
    lineup(t, KIDS, H * 1.03, 2.6, { gap: 430, pose: (nm, i) => ({ ...KID[nm].ears, eyes: 'open', mouth: 'o', brows: 'up', jump: 0, lookX: (i - 1.5) * -.3 }) });
    fig('dragon', W * .08, H * 1.0, 2.0, { eyes: 'wide', mouth: 'o', wings: .3, flip: true });
    sfx('shh…', W * .5, H * .18, 70, '#CFE9FF', t - T_.ear - .3, { life: 1.6 });
    pearlInset(t, W - 230, 230, 150, { age: t - T_.ear + .2, pose: { eyes: 'happy' } });
  }
  // "A shortcut does not exist": Fester tiptoes toward a SHORTCUT sign… and a ball finds his head.
  function noShortcut(t) {
    panel(t, '#4A2A12', '#6A3A18', W * .55, H * .5);
    floorLine(H * .9);
    const hit = T_.exist, u = seg(t, T_.shortcut, hit - .1), fx = lerp(W * .25, W * .52, ease(u));
    pdSign(W * .78, H * .9, 360, 'SHORTCUT →', { fall: ease(seg(t, hit + .15, hit + .5)) });
    const tip = Math.sin(t * 10) * (u < 1 ? 1 : 0);
    const F = fig('jester_fester', fx, H * 1.04, 2.9, t < hit
      ? { footL: [-1.4, -.2 - .9 * Math.max(0, tip)], footR: [1.4, -.2 - .9 * Math.max(0, -tip)], handL: [-2.6, -12], handR: [2.6, -12], handPoseL: 'open', handPoseR: 'open', eyes: 'open', mouth: 'smirk', lookX: .7, brows: 'up', dy: .4 }
      : { eyes: 'swirl', mouth: 'wobble', stars: 1, sq: .25 * kick(t, hit, 6), dy: 1.2 * kick(t, hit, 4), handL: [-4.4, -13.3], handR: [4.4, -13.3], handPoseL: 'open', handPoseR: 'open' });
    if (t > hit - .45 && t < hit + .6) { const v = seg(t, hit - .45, hit), bx = F.head[0], by = lerp(-80, F.top[1] - 20, v * v) - (t > hit ? 300 * (t - hit) - 900 * (t - hit) ** 2 : 0);
      jugglerBall(bx + (t > hit ? 400 * (t - hit) : 0), by, 46, JUGGLE_COLS[2], t * 6); }
    if (t > hit) { sfx('BONK!', F.head[0] + 120, F.top[1] - 60, 130, PD.red, t - hit, { life: 1.0 }); flash(.3 * kick(t, hit, 8)); }
    pearlInset(t, 230, 230, 150, { age: t - T_.shortcut + .2 });
  }
  // "Practice with an open fist": Safadi's fist opens; a solved cube floats up off his palm.
  function openFist(t) {
    panel(t, '#2A1848', '#4A2A6A', W / 2, H * .45);
    const open = t > T_.openW, k = ease(seg(t, T_.openW, T_.openW + .6));
    const A = fig('safadi', W * .4, H * 1.2, 4.0, { handR: open ? [6.4, -15.4] : [4.6, -14.2], handPoseR: open ? 'palm' : 'fist', handL: [-4.4, -8.1], eyes: open ? 'happy' : 'open', brows: 'up', mouth: open ? 'grin' : 'smile', power: .4 + .6 * k, lookX: .5 });
    if (open) { cdCube(A.handR[0], A.handR[1] - 60 - 140 * k, 40, { solve: 1, ang: t * .8, glow: 1 }); sfx('✦', A.handR[0] - 80, A.handR[1] - 260, 90, PD.goldLt, t - T_.openW - .2, { life: .9 }); }
    pearlInset(t, W - 230, H - 300, 160, { age: t - T_.fist + .2 });
  }
  // "Now we know just how to learn": Safadi's chalkboard: books give the WHAT, practice gives the HOW (scene 23).
  function howToLearn(t) {
    const P = persp(CAM.stageM(t));
    gym(t, CAM.stageM(t), [PEARL_ON_STAGE({ lookX: -.4, eyes: 'happy' }),
      { name: 'safadi', x: -280, y: STAGE_Y, z: STAGE_Z - 10, pose: { handR: [5.8, -21.4], handPoseR: 'point', handL: [-4.4, -8.1], power: .8, eyes: 'glow', mouth: 'grin', brows: 'up', lookX: .3 } }],
      { blur: 1.6, dark: .35, darkCol: '#4A2A6A' });
    const k = seg(t, T_.learn, T_.turn - .1);
    if (k <= 0) return;
    const bx = W * .62, by = H * .3, w = 640;
    safadiBoard(bx, by, w, Math.min(k * 5, .2), t, { kind: 'none', title: 'HOW TO LEARN' });
    overlay(() => {
      const rows = [['BOOKS', 'the WHAT', .15], ['PRACTICE', 'the HOW', .45], ['WHAT + HOW', '= YOU CAN!', .75]];
      X.save(); X.font = `700 40px ${SF_CHALK}`; X.textBaseline = 'middle'; X.fillStyle = SF.chalk; X.shadowColor = SF.glow; X.shadowBlur = 12;
      rows.forEach(([a, b, at0], i) => { const f = seg(k, at0, at0 + .2); if (f <= 0) return; X.globalAlpha = f; X.textAlign = 'left'; X.fillText(a, bx - w * .42, by - 50 + i * 70); X.textAlign = 'right'; X.fillText(b, bx + w * .42, by - 50 + i * 70); });
      X.restore();
    });
  }
  // "That's the only way we turn": Pearl spins on her throne; the cube wall behind her turns a quarter.
  function onlyWay(t) {
    camBegin(...shakeC(t, 2 * pulse(t)), 1 + .02 * pulse(t, 8));
    panel(t, '#3A1B63', '#57288A', W / 2, H * .42);
    const tw = ease(seg(t, T_.turnW - .25, T_.turnW + .2));
    pdCubeWall(W / 2, H * .36, 600, 1, t, { col: '#B48AE0', ang: tw * Math.PI / 2 + .04 * Math.sin(t * 2) });
    floorLine(H * .9);
    const spin = seg(t, T_.turn + .1, T_.turn + 1.3), turn = Math.cos(TAU * ease(spin));
    ysThrone(W / 2, H * 1.0, 3.2 * THR, t);
    drawPearl(W / 2, H * 1.0 - 95 * THR * 3.2, PP_UNIT * PK * 3.2, pearlPose(t, { turn, eyes: spin > 0 && spin < 1 ? 'happy' : 'sparkle' }), Math.abs(turn) > .3 ? 'sing' : 'none');
    camEnd();
  }
  // "We all did the perfect drop": four panels, four landings on the same beat; the title slams on "drop".
  function perfectDropSplit(t) {
    const L = T_.dropW;
    [['jenna', '#5A1F4A', '#7A2E62'], ['alma', '#3A1B63', '#57288A'], ['housam', '#183A5A', '#22507A'], ['danny', '#123E36', '#1C5A4E']].forEach(([nm, c1, c2], i) => {
      const x0 = (i % 2) * W / 2, y0 = Math.floor(i / 2) * H / 2, bx = x0 + W / 4 + (i % 2 ? 70 : -70), by = y0 + H / 2 + 10;
      X.save(); X.beginPath(); X.rect(x0, y0, W / 2, H / 2); X.clip();
      ysSunburst(bx, y0 + H / 4, t, c1, c2, 14, .2);
      const u = seg(t, T_.drop + .1, L), landed = t >= L, K = 1.85;            // K: the kids fill their panels
      if (nm === 'jenna') fig('jenna', bx + lerp(-260, 0, u), by, 1.45 * K, landed ? { ...KID.jenna.up, eyes: 'happy', mouth: 'grin', sq: .15 * kick(t, L, 6) } : { ...JSTAR, _spin: TAU * 2 * ease(u) });
      if (nm === 'alma') fig('alma', bx + lerp(260, 0, u), by, 1.6 * K, landed ? { ...KID.alma.up, eyes: 'star', mouth: 'grin', power: .7, sq: .15 * kick(t, L, 6) } : { ...ASTAR, _spin: -TAU * 2 * ease(u) });
      if (nm === 'housam') { const hk = HOUSAM_UNIT * 1.45 * K, A = fig('housam', bx, by, 1.45 * K, { footR: [2.6, -3.4], handL: [-4.6, -12], handR: [4.6, -12], eyes: landed ? 'happy' : 'open', mouth: landed ? 'grin' : 'smirk', lookY: .6 });
        housamBall(bx + 2.9 * hk, by - (4.2 + (landed ? 0 : 40 * (1 - u * u))) * hk, hk, { spin: landed ? 0 : t * 5 }); }
      if (nm === 'danny') { const A = fig('danny', bx, by, 1.6 * K, { handR: [4.4, -15], handPoseR: 'palm', eyes: landed ? 'happy' : 'open', mouth: landed ? 'grin' : 'o', lookY: landed ? 0 : -.8 });
        cdCube(A.handR[0], A.handR[1] - 14 * K - (landed ? 0 : 340 * (1 - u * u)), 18 * K, { solve: landed ? 1 : u, seed: 4, ang: landed ? 0 : t * 9, glow: landed ? 1 : 0 }); }
      X.restore();
    });
    line([[W / 2, 0], [W / 2, H]], { stroke: PD.ink, lwPx: 10 }); line([[0, H / 2], [W, H / 2]], { stroke: PD.ink, lwPx: 10 });
    pearlInset(t, W / 2, H / 2, 150, { age: 9 });
    if (t > L) { flash(.5 * kick(t, L, 7), '#FFF4C0'); pdTitle(t, L, { life: 1.5, y: H * .5 }); }
  }
  // "We're the kings and we won't stop!": everyone on stage in paper crowns. Down front, a blue fin glides past…
  function kings(t) {
    const cr = (A, s, col, i) => pdPaperCrown(A.head[0], A.top[1] + .8 * s, 7 * s, col, t, .1 * Math.sin(t * 3 + i));
    const crowned = t > T_.kingsW - .1;
    const { A, P } = gym(t, CAM.stageW(t), [PEARL_ON_STAGE({ eyes: 'sparkle', headTilt: .3 }, 'raise'),
      ...KIDS.map((nm, i) => ({ name: nm, x: [330, 170, -170, -330][i], y: STAGE_Y, z: STAGE_Z - 30, pose: cheer(nm, t, i), after: (A, s) => crowned && cr(A, s, ['#F2C14E', '#FFB3D9', '#7FE3FF', '#8CCB3A'][i], i) })),
      { name: 'safadi', x: 470, y: STAGE_Y, z: STAGE_Z + 20, pose: { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: bob(t) } },
      { name: 'sami', x: -470, y: STAGE_Y, z: STAGE_Z + 20, pose: { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: bob(t + .3) } }],
      { backFx: () => pdBeams(t, ['#FFE066', '#FFB3D9', '#7FE3FF'], { n: 6, a: .14 }) });
    // the teaser in plain sight: a blue dorsal fin cuts across the court in front of the stage
    const u = seg(t, 90.9, 92.1);
    if (u > 0 && u < 1) {
      const [sx, sy, k] = P.p(lerp(-700, 700, u), 0, 520);
      shape([[sx - 40 * k, sy], [sx + 6 * k, sy - 46 * k], [sx + 30 * k, sy - 6 * k], [sx + 40 * k, sy]], { fill: '#2EB2EE', stroke: '#1E3657', lwPx: 3, smooth: .3 });
      for (let i = 0; i < 6; i++) circle(sx + (30 + i * 16) * k, sy - 3 * k * Math.abs(Math.sin(t * 20 + i)), (4 - i * .5) * k, { fill: 'rgba(127,227,255,.7)', stroke: null });
    }
  }

  // ================= GUITAR SOLO =================
  // Fester shreds on a jester guitar; Robo-Safadi drums (Clawd bouncing on the bass drum); Dragon flies loops of fire;
  // the Safadi brothers headbang; the girls dance on Alma's rainbow floor; Fester's knee slide; and on the last note… BONK.
  const strum = t => Math.abs(Math.sin(t * 22));
  function festerGuitar(name, A, s, t, slide = 0) {
    const neck = Math.atan2(A.handL[1] - A.belly[1], A.handL[0] - A.belly[0]);
    pdGuitar(A.belly[0] + 1.2 * s, A.belly[1] + .4 * s, s * .95, neck, t, { strum: 1 });
  }
  const festerPlay = (t, o = {}) => ({ handL: [-6.4, -13.6], handR: [2.2, -8.6 + .9 * strum(t)], handPoseL: 'cup', handPoseR: 'fist', eyes: 'closed', mouth: 'grin', brows: 'up', tilt: .12 * Math.sin(beatPos(t) * Math.PI), lean: -.08, ...o });
  function soloWide(t) {
    const hits = beatPos(t);
    gym(t, push(CAM.stageW, T_.solo, T_.solo + 4, 200, 10)(t), [PEARL_ON_STAGE({ eyes: 'happy', headTilt: .25 + .2 * Math.abs(Math.sin(hits * Math.PI)), mouth: 'grin', crownTilt: .2 * Math.sin(hits * Math.PI) }, 'raise'),
      { name: 'jester_fester', x: 260, y: STAGE_Y, z: STAGE_Z - 20, pose: festerPlay(t), after: (A, s) => festerGuitar('f', A, s, t) },
      { z: STAGE_Z, draw: P => { const [sx, sy, k] = P.p(-380, STAGE_Y, STAGE_Z); pdDrums(sx, sy, k, t, { hitL: pulse(t), hitR: pulse(t + .26), kick: pulse(t) }); } },
      { name: 'robo_safadi', x: -380, y: STAGE_Y, z: STAGE_Z - 50, pose: { handL: [-5.6, -14.5 + 3 * Math.sin(t * 15)], handR: [5.6, -14.5 + 3 * Math.cos(t * 15)], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'grin', emote: 'music', emoteK: 1 } }],
      { backFx: () => pdBeams(t, ['#FF4A6A', '#FFE066', '#7FE3FF'], { n: 7, a: .14 + .1 * pulse(t), speed: 2.2 }) });
    if (t < T_.solo + .5) flash(.4 * kick(t, T_.solo + .05, 6), '#FFE0F0');
  }
  function roboDrums(t) {
    camBegin(...shakeC(t, 5 * pulse(t)), 1 + .03 * pulse(t, 8));
    ysSunburst(W / 2, H * .45, t, '#2A0610', '#5A0E1E', 22, .6);
    ysDots('#FF4A4A', .1, 34, 6, t);
    const A = fig('robo_safadi', W * .5, H * .98, 3.1, { handL: [-5.6, -14.5 + 3 * Math.sin(t * 15)], handR: [5.6, -14.5 + 3 * Math.cos(t * 15)], handPoseL: 'fist', handPoseR: 'fist', red: .5 + .5 * pulse(t), eyes: 'open', mouth: 'grin' });
    pdDrums(W * .5, H * 1.08, 3.4, t, { hitL: pulse(t), hitR: pulse(t + .26), kick: pulse(t) });
    fig('clawd', W * .8, H * .5 - 30 * pulse(t), 5.0, { eyes: 'happy', mouth: 'grin', bounce: 1, jump: pulse(t) * 3, aL: 1, aR: 1 });
    camEnd();
    const b = Math.floor(beatPos(t)); ['BA-DUM', 'TSS!'].forEach((s, i) => { if (b % 2 === i) sfx(s, W * (.2 + .6 * i), H * .25, 90, '#FFE066', frac(beatPos(t)) * 60 / PD_BPM, { life: .5, rot: (i - .5) * .2 }); });
    pearlInset(t, 230, 230, 150, { age: 9, pose: { mouth: 'grin', eyes: 'happy' } });
  }
  function dragonLoops(t) {
    const P = persp(CAM.aud(t));
    layer(() => G.back(P, t, GSET(t, { lights: .7 })), { blur: 0 });
    audience(t, P, { stand: 1 });
    judgesRow(t, P, { noDragon: true });
    G.front(P, t, GSET(t, { lights: .7 }));
    pdBeams(t, ['#FF4A6A', '#FFE066'], { n: 6, a: .12, speed: 2 });
    const a = (t - 115) * 2.2, dx = W / 2 + Math.cos(a) * 640, dy = H * .55 + Math.sin(a * 2) * 90;
    const D = fig('dragon', dx, dy, 2.2, { ...dragonFlight(t, { lift: 0, speed: 3 }), flip: Math.sin(a) > 0, eyes: 'happy', mouth: 'open' });
    ysFlame(D.mouth[0], D.mouth[1], Math.sin(a) > 0 ? Math.PI : 0, 360, on(t, Math.floor(t / 1.04) * 1.04, Math.floor(t / 1.04) * 1.04 + .5, .1), t);
  }
  function brosHeadbang(t) {
    camBegin(...shakeC(t, 4 * pulse(t)), 1 + .02 * pulse(t, 8));
    panel(t, '#2A1848', '#4A2A6A', W / 2, H * .5);
    const hb = Math.sin(beatPos(t) * Math.PI * 2);
    fig('safadi', W * .3, H * 1.12, 3.6, { handL: [-6.4, -13.6], handR: [2.2, -8.6 + .9 * strum(t)], handPoseL: 'cup', handPoseR: 'fist', eyes: 'closed', mouth: 'grin', tilt: .22 * hb, power: .7, lean: .08 * hb });
    fig('sami', W * .7, H * 1.12, 3.6, { handL: [-6.4, -13.6], handR: [2.2, -8.6 + .9 * strum(t + .1)], handPoseL: 'cup', handPoseR: 'fist', eyes: 'closed', mouth: 'grin', tilt: -.22 * hb, lean: -.08 * hb });
    camEnd();
    sfx('AIR GUITAR!', W / 2, H * .16, 90, PD.goldLt, t - 117.4, { life: 1.6 });
    pearlInset(t, W / 2, H - 260, 150, { age: t - 117.2, pose: { mouth: 'grin', eyes: 'happy' } });
  }
  function rainbowDance(t) {
    camBegin(...shakeC(t, 3 * pulse(t)), 1 + .02 * pulse(t, 8));
    ysSunburst(W / 2, H * .4, t, '#3A1B63', '#57288A', 24, .4);
    const cols = ['#E0584E', '#F29A3A', '#F4CD3A', '#8CCB5A', '#4C8FD8', '#9A6AD0'];
    cols.forEach((c, i) => shape(ellPts(W / 2, H * .97, 1100 - i * 150 + 30 * pulse(t), 200 - i * 26 + 6 * pulse(t), 48), { fill: c, stroke: PD.ink, lwPx: 3 }));
    fig('alma', W * .36, H * 1.02, 4.6, { ...almaDance(t - PD_BEAT0, 'disco', { bpm: PD_BPM }), power: 1, eyes: 'star', mouth: 'grin' });
    fig('jenna', W * .64, H * 1.02, 4.2, { ...jennaDance(t - PD_BEAT0, 'twirl', { bpm: PD_BPM }), eyes: 'happy', mouth: 'grin' });
    camEnd();
    pearlInset(t, W - 230, 230, 150, { age: t - 119.2, pose: { mouth: 'grin', eyes: 'happy' } });
  }
  // The knee slide and the last chord. A ball drops out of the lighting rig on the final note: BONK. Pearl cracks up.
  function festerSlide(t) {
    const u = ease(seg(t, 121.6, 122.9)), done = t > 122.9;
    gym(t, CAM.stageM(t), [PEARL_ON_STAGE({ eyes: 'happy', mouth: 'grin', headTilt: .3 }, 'raise'),
      { name: 'jester_fester', x: lerp(400, -270, u), y: STAGE_Y, z: STAGE_Z - 60, pose: festerPlay(t, { dy: u > 0 && !done ? 3.2 : 0, lean: u > 0 && !done ? .25 : -.08, eyes: 'closed' }), after: (A, s) => {
        festerGuitar('f', A, s, t);
        if (u > 0 && !done) for (let i = 0; i < 10; i++) { const a = hash(i + Math.floor(t * 24)) * Math.PI; circle(A.belly[0] + 60 + Math.cos(a) * 60 * hash(i * 3), A.belly[1] + 9 * s - Math.sin(a) * 40 * hash(i * 5), 4, { fill: '#FFE066', stroke: null }); } } }],
      { blur: 1.2, backFx: () => pdBeams(t, ['#FF4A6A', '#FFE066', '#7FE3FF'], { n: 7, a: .16, speed: 2.4 }) });
    if (u > 0 && !done) sfx('SKRRRT!', W * .7, H * .25, 90, PD.goldLt, t - 121.7, { life: 1.2 });
  }
  function soloBonk(t) {
    const hit = T_.bonk;
    const { A } = gym(t, cam(-60, 220, 640, 520, 1250, -1, .4)(t), [PEARL_ON_STAGE(t > hit + .3 ? { eyes: 'happy', mouth: 'open', headTilt: .4 + .1 * Math.sin(t * 18), rot: .08 * Math.sin(t * 18), flipNear: -1 + .6 * Math.sin(t * 9) } : { eyes: 'closed', headTilt: .3 }, t > hit + .3 ? 'none' : 'raise'),
      { name: 'jester_fester', x: -270, y: STAGE_Y, z: STAGE_Z - 60, pose: t < hit ? festerPlay(t, { handL: [-6.4, -16.6], eyes: 'closed', mouth: 'O', tilt: -.1 })
        : { eyes: t < hit + 1 ? 'swirl' : 'happy', mouth: t < hit + 1 ? 'wobble' : 'grin', stars: 1, sq: .25 * kick(t, hit, 6), dy: 1.2 * kick(t, hit, 4), handL: [-4.4, -13.3], handR: [4.4, -13.3], handPoseL: 'open', handPoseR: 'open' },
        after: (A, s) => { if (t < hit) festerGuitar('f', A, s, t); else pdGuitar(A.belly[0] + 6 * s, A.belly[1] + 9 * s, s * .95, -.2 + .1 * kick(t, hit, 6), t); } }],
      { blur: 1.4 });
    const F = A.jester_fester;
    if (F && t > hit - .5 && t < hit + .9) { const v = seg(t, hit - .5, hit), by = lerp(-80, F.top[1] - 10, v * v) - (t > hit ? 400 * (t - hit) - 1100 * (t - hit) ** 2 : 0);
      jugglerBall(F.head[0] + (t > hit ? 300 * (t - hit) : 0), by, 30, JUGGLE_COLS[0], t * 7); }
    if (t > hit) { sfx('BONK!', W * .3, H * .22, 140, PD.red, t - hit, { life: 1.0 }); flash(.4 * kick(t, hit, 8)); }
    if (t > hit + .3) ['HA!', 'HA-HA!'].forEach((s, i) => sfx(s, W * (.66 + .14 * i), H * (.2 + .08 * i), 70, PD.pinkLt, t - hit - .3 - i * .3, { life: 1.0 }));
  }

  // ================= THE FINALE (last half of chorus 4) =================
  const FIN = C('C4', 4);
  function finale(t) {
    const wide = ease(seg(t, C('C4', 6), C('C4', 7) + .6));
    camBegin(...shakeC(t, 3 * pulse(t)), 1.08 - .1 * wide + .02 * pulse(t, 8), 0);
    ysSunburst(W / 2, H * .36, t, '#3A1B63', '#57288A', 24, .25);
    ysDots(PD.goldLt, .1, 40, 6, t);
    const cols = ['#E0584E', '#F29A3A', '#F4CD3A', '#8CCB5A', '#4C8FD8', '#9A6AD0'];
    cols.forEach((c, i) => shape(ellPts(W / 2, H * .97, 1100 - i * 150 + 30 * pulse(t), 200 - i * 26 + 6 * pulse(t), 48), { fill: c, stroke: PD.ink, lwPx: 3 }));
    // back row: Robo drumming with Clawd on his head, the Safadi twins, Pearl on her throne in the middle
    const RA = fig('robo_safadi', W * .2, H * .82, 2.0, { eyes: 'happy', mouth: 'grin', handL: [-5.6, -14.5 + 3 * Math.sin(t * 15)], handR: [5.6, -14.5 + 3 * Math.cos(t * 15)], emote: 'music', emoteK: 1, jump: bob(t) });
    fig('clawd', RA.top[0], RA.top[1] + 4, 3.6, { eyes: 'happy', mouth: 'grin', bounce: 1, jump: bob(t + .25) * 2, aL: 1, aR: 1 });
    fig('safadi', W * .78, H * .82, 2.0, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: bob(t + .5), power: .5 });
    fig('sami', W * .9, H * .84, 2.0, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: bob(t) });
    pearlThrone(W / 2, H * .84, 2.2, t, { eyes: 'sparkle', headTilt: .1 }, beatPos(t) % 4 < 2 ? 'sing' : 'raise');
    // front row: the kids with their tricks, and Fester juggling five (none land on his head this time)
    fig('jenna', W * .07, H * 1.08, 2.4, { ...JSTAR, _spin: TAU * frac((t - FIN) / 1.04) });
    fig('alma', W * .21, H * 1.08, 2.7, { ...almaDance(t - PD_BEAT0, 'floss', { bpm: PD_BPM }), power: 1, eyes: 'star', mouth: 'grin' });
    const HA = fig('housam', W * .66, H * 1.08, 2.4, { footR: [2.4, -3.2 - 2.2 * Math.abs(Math.sin(t * 6))], handL: [-4.6, -12], handR: [4.6, -12], eyes: 'happy', mouth: 'grin' });
    housamBall(W * .66 + 3 * HOUSAM_UNIT * 2.4, H * 1.08 - (6 + 9 * Math.abs(Math.sin(t * 6))) * HOUSAM_UNIT * 2.4, HOUSAM_UNIT * 2.4, { spin: t * 6 });
    const DA = fig('danny', W * .9, H * 1.08, 2.7, { handR: [4.4, -21], handPoseR: 'palm', handL: [-3.6, -12.5], eyes: 'happy', mouth: 'grin', jump: 1.4 * bob(t + .3) });
    cdCube(DA.handR[0], DA.handR[1] - 40, 22, { solve: 1, ang: t * 2, glow: 1 });
    const c = cascade(t, { n: 5, tau: .25, h: 19, t0: FIN - 4 }), fs = JF_UNIT * 2.4, fx = W * .38, fy = H * 1.08;
    jester(fx, fy, fs, { handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup', eyes: 'happy', mouth: 'grin' });
    c.balls.forEach(b => jugglerBall(fx + b.x * fs, fy + b.y * fs, BALL_R * fs, b.col, b.rot));
    // Dragon flies laps overhead
    const ang = (t - FIN) * .9, dx = W / 2 + Math.cos(ang) * 780, dy = H * .18 + Math.sin(ang * 2) * 60;
    fig('dragon', dx, dy, 1.6, { ...dragonFlight(t, { lift: 0, speed: 3 }), flip: Math.sin(ang) > 0, eyes: 'happy', mouth: 'grin' });
    camEnd();
    ysConfetti(t, FIN, 'mixed', 80);
    slam('SOLVED!', W / 2, H * .15, 150, PD.goldLt, t, word('C4.7', 4), -.03, { life: 1.4 });
    flash(.3 * kick(t, FIN, 8));
  }

  // ================= THE MIC DROP =================
  // "Let the beat drop low…": the lights go down to one spotlight on Pearl; the others fade into silhouettes.
  function beatLow(t) {
    const d = ease(seg(t, T_.low - .4, T_.low + 1.6));
    const { A } = gym(t, push(CAM.stageW, T_.low - .6, T_.mic, 420, 40, 20)(t), [PEARL_ON_STAGE({ eyes: 'closed', headTilt: .15 + .2 * d, mouth: sing(t, 'smirk') }),
      ...KIDS.map((nm, i) => ({ name: nm, x: [330, 170, -170, -330][i], y: STAGE_Y, z: STAGE_Z - 30, pose: { ...KID[nm].up, eyes: 'happy', mouth: 'smile', jump: (1 - d) * bob(t + i * .13) } }))],
      { set: { lights: lerp(1, .15, d) }, dark: .75 * d, dim: Object.fromEntries(KIDS.map(n => [n, .7 * d])) });
    if (A.pearl) { X.save(); X.globalCompositeOperation = 'lighter'; cbSpot(A.pearl.head[0], -40, A.pearl.belly[1] + 120, 520, .26 * d, '#FFF1C8'); X.restore(); }
  }
  // "MIC DROP!": up close, flipper out, mic upright, nose in the air… and she lets go.
  function micDropCU(t) {
    const out = ease(seg(t, T_.mic - .1, T_.micW - .1));
    const pose = { eyes: t > T_.micW - .1 ? 'closed' : 'happy', headTilt: lerp(.15, .5, out), mouth: sing(t, 'smirk'), point: 1, pointAng: lerp(-1.05, -.15, out), brows: 'up' };
    const { A } = gym(t, cam(20, 300, 520, 430, 1500, -1, .3)(t), [PEARL_ON_STAGE(pose, t < T_.release ? (out > .5 ? 'out' : 'sing') : 'none')], { blur: 4, set: { lights: .15 }, dark: .7 });
    if (A.pearl) { X.save(); X.globalCompositeOperation = 'lighter'; cbSpot(A.pearl.head[0], -40, H + 200, 900, .2, '#FFF1C8'); X.restore(); }
    if (A.pearl && t >= T_.release) {                                          // the first few frames of the fall, in this shot
      const u = t - T_.release, tip = A.pearl.flipper, s = PP_UNIT * PK * A.pearl.k * .9;
      pdMic(tip[0] + 30 * u, tip[1] + 1600 * u * u, s, -Math.PI / 2 + 2.2 * u, { glow: 1 });
    }
    slam('MIC DROP!', W * .3, H * .22, 120, PD.goldLt, t, T_.micW, -.06, { life: 1.0 });
  }
  // The fall, in slow motion, from the stage floor's point of view; THUD as the music dies.
  function micFall(t) {
    const c = { x: 0, y: STAGE_Y + 30, z: 520, f: 1300, hy: 700 + 6 * Math.sin(t * .3), dir: -1 };
    const fallT = seg(t, T_.release + .2, T_.thud), lying = t >= T_.thud;
    const pose = { eyes: 'closed', headTilt: .5, mouth: 'smirk', point: 1, pointAng: -.15 };
    gym(t, c, [PEARL_ON_STAGE(pose, 'none'),
      { z: 180, draw: P => {
        const [tx, ty, tk] = P.p(THRONE[0], STAGE_Y, THRONE[1]), PA = measure(() => pearlThrone(tx, ty, tk, t, pose, 'none'));
        const [sx, sy, k] = P.p(-30, STAGE_Y, 180), s = PP_UNIT * PK * k * .9;
        const end = [sx - 2.6 * s, sy - .9 * s], a = PA.flipper;              // from her outstretched flipper to the stage floor
        const ang = lying ? .05 * kick(t, T_.thud, 6) - .12 : -Math.PI / 2 + (Math.PI / 2 - .12 + TAU) * easeIn(fallT);
        const x = lying ? end[0] : lerp(a[0], end[0], fallT), y = lying ? end[1] : lerp(a[1], end[1], fallT * fallT);
        if (lying) { X.save(); X.globalCompositeOperation = 'lighter'; ellipse(sx, sy, 220 * k, 30 * k, { fill: radGrad(sx, sy, 0, 220 * k, [[0, rgba('#FFF1C8', .45)], [1, rgba('#FFF1C8', 0)]]), stroke: null }); X.restore(); }
        pdMic(x, y, s, ang, { glow: lying ? .4 : 1, light: lying && t > T_.thud + .5 ? 'red' : true });
        if (!lying) for (let i = 1; i < 4; i++) line([[x - 30 * k, y - i * 20 * k], [x + 30 * k, y - i * 20 * k]], { stroke: `rgba(255,255,255,${.5 * fallT})`, lwPx: 3 });
        if (lying) for (let i = 0; i < 10; i++) { const q = t - T_.thud, ang2 = Math.PI * (i / 9); circle(sx + Math.cos(ang2) * (60 + 260 * q) * k, sy - Math.sin(ang2) * 70 * q * k + 80 * q * q * k, Math.max(0, 5 - 6 * q) * k, { fill: 'rgba(220,210,200,.8)', stroke: null }); }
      } }], { blur: 2.5, set: { lights: .12 }, dark: .72 });
    if (lying) { flash(.35 * kick(t, T_.thud, 9), '#FFFFFF'); sfx('THUD.', W * .66, H * .62, 150, PD.cream, t - T_.thud, { life: 1.4, rot: .06 }); }
  }
  // The silence: the empty throne, the mic in its spotlight. Drip… drip… a puddle spreads.
  function silence(t) {
    const c = cam(-20, 200, 640, 640, 1100, -1, .2)(t);
    const { P } = gym(t, c, [{ z: 180, draw: P => {
      const [sx, sy, k] = P.p(-30, STAGE_Y, 180), s = PP_UNIT * PK * k * .9;
      X.save(); X.globalCompositeOperation = 'lighter'; cbSpot(sx, -40, sy + 10, 300 * k, .28, '#FFF1C8'); X.restore();
      pdPuddle(sx + 140 * k, sy + 4 * k, 260 * k, ease(seg(t, T_.drip[0], T_.rise)), t);
      pdMic(sx - 2.6 * s, sy - .9 * s, s, -.12, { glow: .3, light: 'red' });
      T_.drip.forEach((d, i) => { const a = t - d + .5; if (a > 0 && a < .5) circle(sx + 140 * k, lerp(-40, sy, (a / .5) ** 2), 7 * k, { fill: PD.water, stroke: '#1E3657', lwPx: 2 }); });
    } }, { z: THRONE[1], draw: P => { const [tx, ty, tk] = P.p(THRONE[0], STAGE_Y, THRONE[1]); ysThrone(tx, ty, tk * THR, t); } }],
      { set: { lights: .08, curtain: 1 }, dark: .8 });
    T_.drip.forEach(d => sfx('plip', W * .56, H * .52, 44, '#BFF3FF', t - d, { life: .6 }));
  }
  // Neptune rises out of the puddle, ring of water spinning, and picks up the mic. Tap, tap. "Testing… testing…"
  const nX = 110;
  function neptuneRise(t) {
    const c = cam(-40, 200, 640, 560, 1300, -1, .2)(t), rise = ease(seg(t, T_.rise, T_.rise + 1.0)), has = t > T_.grab;
    const pw = on(t, T_.rise - .2, T_.grab + .4, .3);
    let NR = null;
    gym(t, c, [{ z: 180, draw: P => {
      const [mx, my, k] = P.p(-30, STAGE_Y, 180), [px, py] = P.p(nX, STAGE_Y, 180), s = PP_UNIT * PK * k * .9;
      X.save(); X.globalCompositeOperation = 'lighter'; cbSpot((mx + px) / 2, -40, my + 10, 520 * k, .26, '#BDF4FF'); X.restore();
      pdPuddle(px, py + 4 * k, 260 * k, 1 - .6 * rise, t);
      if (!has) pdMic(mx - 2.6 * s, my - .9 * s, s, -.12, { glow: .3, light: 'red' });
      // Neptune, rising up out of the water (clipped at the puddle line)
      const ns = NT_UNIT * k * .8, up = rise;
      X.save(); X.beginPath(); X.rect(-100, -100, W + 200, py + 6 * k + 100); X.clip();
      const NA = neptune(px, py + (1 - up) * 200 * k, ns, { sit: 1, power: pw, eyes: has ? 'open' : 'closed', flip: false, mouth: has ? lipFlap(t, inW(t, T_.testing, T_.testing + 1.4), 'smile', ['open', 'grin', 'smile']) : 'smile', brows: 'up',
        point: has ? 1 : on(t, T_.grab - .6, T_.grab + .1, .2), pointAng: has ? -.55 : .3 - .85 * seg(t, T_.grab - .6, T_.grab), crownTilt: .1 * Math.sin(t * 3), noShadow: true });
      X.restore();
      NR = NA;
      if (has) { const tap = T_.tap.reduce((m, d) => m + kick(t, d, 12), 0); beakMic(NA, ns, { tilt: .15 * tap, glow: .4 }); }
      if (t > T_.rise && t < T_.rise + 1.0) for (let i = 0; i < 14; i++) { const a = t - T_.rise, ang = Math.PI * (i / 13); circle(px + Math.cos(ang) * (40 + 300 * a) * k, py - Math.sin(ang) * (260 * a - 300 * a * a) * k, (7 - 5 * a) * k, { fill: rgba(PD.water, .85), stroke: '#1E3657', lwPx: 1.5 }); }
    } }, { z: THRONE[1], draw: P => { const [tx, ty, tk] = P.p(THRONE[0], STAGE_Y, THRONE[1]); ysThrone(tx, ty, tk * THR, t); } }],
      { set: { lights: .08 }, dark: .72, darkCol: '#1A2A4A', blur: 2 });
    if (t > T_.rise) sfx('SPLOOSH!', W * .7, H * .2, 100, PD.sky, t - T_.rise - .1, { life: 1.0 });
    T_.tap.forEach((d, i) => sfx('tap', W * .36 + i * 70, H * .3 - i * 20, 50, PD.cream, t - d, { life: .5 }));
    if (NR && t > T_.testing) callout('Testing… testing…', NR.mouth[0] - 40, NR.mouth[1] - 20, t - T_.testing, { dx: -360, dy: -200, size: 54, cps: 14, hold: .8, accent: '#2EB2EE' });
  }
  // "KING Neptune is in the house!": nose up, crown wobbling, the water ring orbiting him.
  function neptuneKing(t) {
    const c = cam(30, 220, 520, 600, 1600, -1, .3)(t);
    let NA = null;
    gym(t, c, [{ z: 180, draw: P => {
      const [px, py, k] = P.p(nX, STAGE_Y, 180), ns = NT_UNIT * k * .8;
      X.save(); X.globalCompositeOperation = 'lighter'; cbSpot(px, -40, py + 10, 700 * k, .24, '#BDF4FF'); X.restore();
      const talk = inW(t, T_.king, T_.king + 2.4);
      NA = neptune(px, py, ns, { sit: 1, power: .7 + .3 * Math.sin(t * 3), headTilt: .12, eyes: t > T_.wink ? 'wink' : 'smug', brows: 'smug', mouth: lipFlap(t, talk, 'grin', ['open', 'grin', 'laugh']),
        point: 1, pointAng: -.55, crownTilt: .15 * Math.sin(t * 6) + .2 * kick(t, T_.king + .3, 3), crownLift: .3 * kick(t, T_.king + .3, 4) });
      beakMic(NA, ns);
    } }], { set: { lights: .1 }, dark: .6, darkCol: '#1A2A4A', blur: 3.5 });
    if (NA) callout('*KING* Neptune is in the house!', NA.mouth[0] - 40, NA.mouth[1] - 30, t - T_.king, { dx: -420, dy: -230, size: 58, cps: 15, hold: 1.2, kind: 'shout', accent: '#2EB2EE' });
    // the wink, an iris out on his starfish, and THE END
    if (NA && t > T_.wink) sfx('✦', NA.head[0] + 40, NA.head[1] - 40, 90, PD.goldLt, t - T_.wink, { life: .7 });
    if (NA && t > T_.iris) iris(NA.crown[0], NA.crown[1], lerp(1500, 0, easeIn(seg(t, T_.iris, T_.theEnd - .1))));
    if (t > T_.theEnd) overlay(() => {                                         // on black, once the iris has closed (overlays paint in order)
      const c = backOut(seg(t, T_.theEnd, T_.theEnd + .4));
      X.save(); X.translate(W / 2, H / 2); X.rotate(-.03); X.scale(c, c);
      shape(rectPts(-330, -95, 660, 190), { fill: '#EAF8FF', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `110px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('THE END', 0, 8); X.fillStyle = '#2EB2EE'; X.fillText('THE END', 0, 8);
      X.restore();
    });
  }
  // ================= ASSEMBLY =================
  const withTop = fn => { const g = (t, lt, dur) => { fn(t, lt, dur); pdKaraoke(t); }; Object.defineProperty(g, 'name', { value: fn.name }); return g; };
  scene({
    duration: T_.END, fps: 24, bpm: PD_BPM, beatOffset: PD_BEAT0,
    shots: [
      [0, darkOpen], [3.4, curtainUp], [T_.woo2 - .1, wooCU], [7.4, hereWeGo],
      [T_.jenna - .15, jennaWheel], [T_.alma - .1, almaSky], [T_.practiced - .1, practiceDays], [T_.smiling - .1, girlsSmile], [T_.housam - .15, housamKick],
      [T_.crowd - .1, crowdCrazy], [T_.score - .1, perfectScore], [T_.reward - .1, trophyShine],
      [C('C1', 0) - .1, chorus(0)],
      [T_.danny - .1, dannyCube], [T_.super - .1, superDude], [T_.puggle - .1, puggleTrick], [T_.trophies - .2, trophyRain], [T_.drink - .1, noDrink],
      [T_.think - .1, stopThink], [T_.practice - .2, practiceGrid], [T_.test - .1, hardestTest],
      [C('C2', 0) - .1, chorus(1)],
      [T_.prof - .1, safadiClear], [T_.ear - .1, lendEar], [T_.shortcut - .1, noShortcut], [T_.fist - .1, openFist], [T_.learn - .1, howToLearn],
      [T_.turn - .1, onlyWay], [T_.drop - .1, perfectDropSplit], [T_.kings - .1, kings],
      [C('C3', 0) - .1, chorus(2)],
      [T_.solo, soloWide], [113.0, roboDrums], [115.1, dragonLoops], [117.2, brosHeadbang], [119.3, rainbowDance], [121.4, festerSlide], [123.6, soloBonk],
      [C('C4', 0) - .1, chorus(3)], [FIN - .1, finale],
      [142.3, beatLow], [T_.mic - .15, micDropCU], [T_.release + .2, micFall], [148.3, silence], [T_.rise - .3, neptuneRise], [T_.king - .3, neptuneKing],
    ].map(([t0, fn]) => [t0, withTop(fn)]),
  });
})();
