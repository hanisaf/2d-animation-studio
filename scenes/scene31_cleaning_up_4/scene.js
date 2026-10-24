// Scene 31: Cleaning Up 4 · Robots vs. Titans. A music video cut to audio.mp3 (see README.md for the song map and shot list).
// Every shot paints the whole frame from t; the karaoke (lyrics.js) and the wipes go on top. Backdrops and props: props.js.
(() => {
  // ---------- timing: the tracked beats and the sung words the hits are cut to ----------
  const SPB = 60 / 117.5;
  function prevBeat(t) { let lo = 0, hi = RVT_BEATS.length - 1; if (t < RVT_BEATS[0]) return -1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (RVT_BEATS[m] <= t) lo = m; else hi = m - 1; } return lo; }
  const bp = (t, k = 7) => { const i = prevBeat(t); return i < 0 ? 0 : Math.exp(-(t - RVT_BEATS[i]) / SPB * k); };   // 1 on every beat, decaying
  const beatN = t => prevBeat(t);
  const beatAfter = t => RVT_BEATS[Math.min(RVT_BEATS.length - 1, prevBeat(t) + 1)];
  const w = (id, i = 0) => RVT_LINE[id][3][i];                                  // start of word i of line id
  const lineEnd = id => RVT_LINE[id][4];
  const L = {
    thud1: 3.78, thud2: 4.40, sploosh: w('x1', 0), splash: w('x1', 1), boom: w('x1', 2),
    crack: w('x2', 0), zap: w('x2', 1), kachunk: w('x2', 2),
  };
  const sing = (who, t, rest = 'smile') => lipFlap(t, rvtSinging(who, t), rest);
  const roboMouth = (t, rest = 'flat') => lipFlap(t, rvtSinging('robo', t), rest, ['open', 'O', 'open', 'teeth', 'open']);

  // ---------- the cast ----------
  function loc(A) {                                                            // rig anchors (screen px) → the current frame
    const m = X.getTransform().invertSelf(), out = {};
    for (const k in A) { const p = A[k]; out[k] = Array.isArray(p) && typeof p[0] === 'number' ? [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f] : p; }
    return out;
  }
  const KID = {
    housam: { draw: housam, U: HOUSAM_UNIT, run: housamDribble, up: { handL: [-4.7, -24], handR: [4.7, -24], handPoseL: 'palm', handPoseR: 'palm' },
      scared: { handL: [-4.3, -15], handR: [4.3, -15], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [6.2, -18], handPoseR: 'point' } },
    alma: { draw: alma, U: ALMA_UNIT, run: almaSkip, up: { handL: [-5.0, -12.2], handR: [5.0, -12.2], handPoseL: 'palm', handPoseR: 'palm' },
      scared: { handL: [-1.1, -11.6], handR: [1.1, -11.6], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [5.2, -9], handPoseR: 'point' } },
    jenna: { draw: jenna, U: JENNA_UNIT, run: jennaSkip, up: { handL: [-4.4, -21], handR: [4.4, -21], handPoseL: 'palm', handPoseR: 'palm' },
      scared: { handL: [-1.1, -21.0], handR: [1.1, -21.0], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [5.6, -16], handPoseR: 'point' } },
    danny: { draw: danny, U: DANNY_UNIT, run: dannyDribble, up: { handL: [-4.5, -21], handR: [4.5, -21], handPoseL: 'palm', handPoseR: 'palm' },
      scared: { handL: [-4.3, -14], handR: [4.3, -14], handPoseL: 'palm', handPoseR: 'palm' }, point: { handR: [6, -17], handPoseR: 'point' } },
  };
  const KIDS = ['housam', 'alma', 'jenna', 'danny'];
  // a kid at (x, y), k = px per world unit (so the four stay in true scale with each other and the grown-ups)
  const kid = (id, x, y, k, o = {}) => loc(KID[id].draw(x, y, KID[id].U * k, o));
  const kidRun = (id, p, amt = 1) => KID[id].run(p, amt);
  function kidSpun(id, x, y, k, ang, o = {}) {                                // rotated about the middle of the body
    const c = 12 * KID[id].U * k; X.save(); X.translate(x, y - c); X.rotate(ang); const A = kid(id, 0, c, k, o); X.restore(); return A;
  }
  const robo = (x, y, k, o = {}) => loc(roboSafadi(x, y, ROBO_SAFADI_UNIT * k, o));
  const nep = (x, y, k, o = {}) => loc(neptune(x, y, NT_UNIT * k, o));
  const twin = (who, x, y, k, o = {}) => loc((who === 'safadi' ? safadi : sami)(x, y, SAFADI_UNIT * k, { outfit: 'greek', ...o }));
  const LOOKS = {}; const lookOf = seed => LOOKS[seed] ??= { ...studentLook(seed), outfit: 'greek' };
  const stu = (seed, x, y, k, o = {}) => loc(student(x, y, STUDENT_UNIT * k, { seed, look: lookOf(seed), outfit: 'greek', ...o }));
  const SEEDS = [31, 44, 52, 67, 73, 12, 19, 26, 38, 58, 81, 90, 7, 63, 95, 104, 111, 120];
  // where a rig's anchors land for a draw at (x, y) without painting it
  const probe = fn => { X.save(); const A = measure(fn); X.restore(); return A; };

  // ---------- camera and screen helpers ----------
  function cam(t, zoom = 1, amt = 0, rot = 0, cx = W / 2, cy = H / 2) { const [dx, dy] = shakeXY(t, amt); camBegin(cx - dx, cy - dy, zoom, rot); }
  function clipRect(x, y, w, h, fn) { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); try { fn(); } finally { X.restore(); } }
  // A 3D set with actors interleaved by depth: actors [{ z, draw }]. o goes to back() and front().
  function stage(SET, P, t, actors, o = {}, blur = 0) {
    actors = actors.filter(a => P.depth(a.z) > 40).sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => SET.back(P, t, { ...o, splitZ: actors.length ? actors[0].z : -Infinity }), { blur });
    actors.forEach((a, i) => { a.draw(); SET.front(P, t, { ...o, splitZ: a.z, toZ: actors[i + 1]?.z }); });
  }
  const AT = LOCATIONS.ancient_athens, BA = LOCATIONS.roman_bath;
  // a little gull / swallow: (x, y), s px wingspan, flapping
  function bird(x, y, s, t, ph = 0, col = '#3A2A3A') { const f = Math.sin(t * 12 + ph * 5) * .5; line([[x - s / 2, y - s * .2 * f], [x - s * .15, y - s * .12], [x, y], [x + s * .15, y - s * .12], [x + s / 2, y - s * .2 * f]], { stroke: col, lwPx: Math.max(2, s * .08), smooth: true }); }
  // a citizen flying into the vortex: from (x0, y0) on the ground to the hatch (hx, hy) over [t0, t1], spinning and shrinking
  function flyer(seed, t, t0, t1, x0, y0, hx, hy, k, o = {}) {
    const u = seg(t, t0, t1); if (t < t0 || u >= 1) return false;
    const e = easeIn(u), sw = Math.sin(u * TAU * 1.5 + seed) * (1 - u) * (o.swirl ?? 120);
    const x = lerp(x0, hx, e) + sw, y = lerp(y0, hy, e) - Math.sin(u * Math.PI) * (o.lift ?? 60), sc = k * lerp(1, o.shrink ?? .25, e);
    stu(seed, x, y, sc, { rot: (o.spin ?? 1) * u * TAU * (1.2 + hash(seed) * .8) * (hash(seed * 3) > .5 ? 1 : -1), eyes: 'wide', brows: 'up', mouth: 'O',
      handL: [-4.4, -19], handR: [4.4, -19], handPoseL: 'palm', handPoseR: 'palm', footL: [-2.2, -2.5], footR: [2.2, -1.2], breathe: 0 });
    return true;
  }
  function slamCard(fill) { shape(rectPts(-40, -40, W + 80, H + 80), { fill, stroke: null }); }

  // ============================== INTRO ==============================

  // 0–3.7 · peaceful Athens at dawn; the ground starts to tremble.
  function dawn(t, lt) {
    const trem = seg(t, 2.6, 3.7);
    cam(t, 1.02 + .04 * lt / 3.7, 6 * trem * trem, 0, W / 2, H / 2 - 20 * lt / 3.7);
    const M = RVT_MOOD.dawn;
    rvtSkyline(t, M, { horizon: 760, acroX: 1160, acroW: 1100, sun: [1560, 300], sunR: 80, townS: 80 });
    for (let i = 0; i < 6; i++) { const x = ((i * 330 + t * 60) % (W + 200)) - 100, y = 260 + 60 * Math.sin(i * 2 + t * .5); bird(t > 3.2 ? x + (t - 3.2) * 500 : x, t > 3.2 ? y - (t - 3.2) * 300 : y, 26, t, i); }
    // the agora floor and the morning citizens
    shape(rectPts(-40, 860, W + 80, 260), { fill: '#EFE4CC', stroke: null }); line([[-40, 860], [W + 40, 860]], { stroke: '#B8A27A', lwPx: 4 });
    for (let i = 0; i < 9; i++) line([[i * 240 - 40, 860], [i * 300 - 260, 1080]], { stroke: '#DCCDAE', lwPx: 3 });
    [[280, 0, 1], [520, 1, -1], [1300, 2, 1], [1620, 3, -1]].forEach(([x0, i, d]) => {
      const x = x0 + d * lt * 30, startle = seg(t, 3.0 + i * .08, 3.3 + i * .08);
      stu(SEEDS[i], x, 900 + i % 2 * 30, 1.9, { ...(startle > 0 ? { eyes: 'wide', brows: 'up', mouth: 'o', lookY: -.8 } : studentWalk(lt * 1.6 + i, 1)), flip: d < 0, turn: d * .5, jump: .6 * startle * (1 - startle) * 4 });
    });
    rvtAmphora(120, 1000, 230, { water: true, rot: .03 * Math.sin(t * 40) * trem });
    if (trem > 0) for (let r = 0; r < 3; r++) { const u = frac(t * 2 + r / 3); ellipse(120, 1000 - 212, 12 * u * 3, 4 * u * 3, { fill: null, stroke: rgba('#FFFFFF', 1 - u), lwPx: 2 }); }
    rvtColumn(1840, 1080, 760, 120, M);
    camEnd();
  }

  // 3.7–5.75 · street level: a giant metal oxford slams down, THUD; then the other one.
  function thud(t, lt) {
    const hit = kick(t, L.thud1, 5) + kick(t, L.thud2, 5);
    cam(t, 1.0 + .03 * hit, 22 * hit, 0, W / 2, H / 2);
    const M = RVT_MOOD.alarm;
    rvtSky({ sky: [mixCol('#6FA8E0', M.sky[0], seg(t, 3.7, 5.6)), mixCol('#F4C9A8', M.sky[1], seg(t, 3.7, 5.6)), mixCol('#FFE2B0', M.sky[2], seg(t, 3.7, 5.6))] });
    rvtTown(700, 150, RVT_MOOD.dawn, { seed: 9 });
    shape(rectPts(-40, 690, W + 80, 400), { fill: '#E8D9B6', stroke: null });
    for (let i = 0; i < 12; i++) line([[960 + (i - 6) * 140, 690], [960 + (i - 6) * 520, 1080]], { stroke: '#D4C29A', lwPx: 3 });
    // the giant's feet (the rig at 18× scale: only the shoes and shins fit in the frame)
    const lift1 = 1 - easeIn(seg(t, 3.45, L.thud1)), lift2 = t < L.thud1 + .1 ? 0 : (1 - easeIn(seg(t, L.thud1 + .25, L.thud2))) * (t < L.thud2 ? 1 : 0);
    const up2 = t > L.thud1 + .1 && t < L.thud2 ? Math.sin(seg(t, L.thud1 + .1, L.thud2) * Math.PI) : 0;
    robo(W / 2 + 40, 900, 15, { footL: [-2.1, -.8 - 5 * lift1], footR: [1.9, -.8 - 6 * up2], hum: false, red: 1, handL: [-6, -10], handR: [6, -10] });
    rvtDust(W / 2 - 230, 900, 260, t - L.thud1); rvtDust(W / 2 + 330, 900, 260, t - L.thud2);
    // pots and people jump on every thud
    const j = Math.max(Math.sin(seg(t, L.thud1, L.thud1 + .35) * Math.PI), Math.sin(seg(t, L.thud2, L.thud2 + .35) * Math.PI));
    [[160, 1040, 260, -1], [1780, 1050, 240, 1], [420, 1060, 160, 1]].forEach(([x, y, h, d], i) => rvtAmphora(x, y - 80 * j * (1 + i * .3), h, { rot: d * .3 * j }));
    [[620, 0], [1360, 1], [1560, 2]].forEach(([x, i]) => stu(SEEDS[i + 4], x, 1000 - 90 * j, 2.2, { eyes: 'wide', brows: 'up', mouth: 'O', ...KID.danny.up, flip: i === 1 }));
    camEnd();
    sfx('THUD!', 700, 520, 200, '#FFD07A', t - L.thud1, { rot: -.1, life: .55 });
    sfx('THUD!', 1200, 470, 220, '#FFD07A', t - L.thud2, { rot: .08, life: 1.1 });
  }

  // 5.75–8.1 · tilt up the giant: CLEAN (eyes red) · UP (antenna sparks, arms up) · ATHENS (the hatch swings open)
  function rise(t, lt) {
    const M = RVT_MOOD.alarm, tilt = easeOut(seg(t, 5.75, 6.25)), push = .03 * seg(t, 6.3, 8.1);
    rvtSky(M); rvtSun(1500, 250, 90, M.sun, .8);
    const red = ease(seg(t, w('r1', 0), w('r1', 0) + .2)), up = seg(t, w('r1', 1), w('r1', 1) + .25), hatch = easeOut(seg(t, w('r1', 2), w('r1', 2) + .45));
    cam(t, 1 - .22 * tilt + push, 3 + 14 * kick(t, w('r1', 0), 5) + 10 * kick(t, w('r1', 2), 5), 0, W / 2, lerp(760, 140, tilt));
    rvtClouds(t, -200, 5, rgba('#FFB08A', .35), { s: 1.4, spread: 500, seed: 4 });
    const ridge = []; for (let x = -800; x <= W + 800; x += 40) ridge.push([x, 820 - 60 * Math.sin(x / 600 + 1) - 30 * Math.sin(x / 230)]);
    shape([[-800, 1400], ...ridge, [W + 800, 1400]], { fill: rvtTint('#A9B7C4', M), stroke: null });
    rvtAcropolis(1450, 1010, 950, M);
    const A = robo(760, 1180, 8.2, { red, eyes: t < w('r1', 0) - .05 ? 'off' : 'open', brows: red > .5 ? 'angry' : 'normal', mouth: roboMouth(t, 'teeth'), hatch,
      antenna: .5 * boing(t, w('r1', 1), 3, 4), jump: .2 * kick(t, w('r1', 0), 6), lookY: .5,
      handL: mixPt([-4.4, -8.6], [-7.2, -21], up), handR: mixPt([4.4, -8.6], [7.2, -21], up), handPoseL: 'claw', handPoseR: 'claw', steam: .4 * hatch });
    if (t > w('r1', 1) && t < w('r1', 1) + .5) for (let i = 0; i < 3; i++) rvtLightning(A.antenna[0], A.antenna[1], A.antenna[0] + (i - 1) * 140, A.antenna[1] - 160, i * 9 + Math.floor(t * 20), 5, '#FFE97A', 1 - seg(t, w('r1', 1), w('r1', 1) + .5));
    rvtTown(1300, 170, M, { seed: 5, x0: -900, x1: W + 900 });
    shape(rectPts(-900, 1295, W + 1800, 400), { fill: rvtTint('#DCC496', M), stroke: null });
    camEnd();
    flash(.55 * kick(t, w('r1', 0), 6), '#FF3030');
  }

  // 8.1–9.8 · "Look out! Run!": the agora; everyone scatters as the giant's shadow sweeps over.
  function scatter(t, lt) {
    const P = persp({ x: 30 * Math.sin(t * .7), y: 210, z: -180, f: 820, hy: 560 });
    cam(t, 1.0 + .02 * bp(t), 5 + 6 * bp(t, 4));
    const sh = seg(t, 8.1, 9.8), runners = [];
    const RUN = [[-420, 380, 1, 0], [-200, 640, -1, 1], [60, 420, 1, 2], [300, 760, -1, 3], [520, 320, -1, 4], [-560, 900, 1, 5]];
    RUN.forEach(([x0, z, d, i]) => runners.push({ z, draw: () => { const x = x0 + d * (t - 8.1) * 380, [sx, sy, k] = P.p(x, 0, z);
      stu(SEEDS[i], sx, sy, k, { ...studentWalk((t - 8.1) * 4.5 + i, 1.4), flip: d < 0, turn: d * .6, lean: .15 * d, eyes: 'wide', brows: 'up', mouth: 'O', handL: [-4.4, -19], handR: [4.4, -19] }); } }));
    [['housam', -120, 300, 1], ['alma', 40, 260, -1], ['jenna', 200, 290, 1], ['danny', -300, 250, -1]].forEach(([id, x0, z, d], i) => runners.push({ z, draw: () => {
      const x = x0 + d * Math.max(0, t - 8.5) * 330, [sx, sy, k] = P.p(x, 0, z), go = t > 8.5;
      kid(id, sx, sy, k, go ? { ...kidRun(id, (t - 8.5) * 4.2 + i, 1.3), flip: d < 0, turn: d * .5, lean: .12 * d, eyes: 'wide', brows: 'up', mouth: sing('kids', t, 'o') } : { ...KID[id].scared, eyes: 'wide', brows: 'up', mouth: 'o', lookY: -.9, jump: .4 * kick(t, 8.2, 6) });
    } }));
    // the giant, beyond the terrace, and his shadow
    runners.push({ z: 2500, draw: () => { const [sx, sy, k] = P.p(-200 + 400 * sh, 0, 2500); robo(sx, sy, k * 13, { red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), hatch: 1, lookY: .7, ...roboSafadiWalk((t - 8.1) * 1.4, 1) }); } });
    stage(AT, P, t, runners, { birds: 0 });
    X.save(); X.globalCompositeOperation = 'multiply'; const sx = lerp(2400, -600, ease(sh));
    shape([[sx - 900, 600], [sx + 500, 600], [sx + 1100, H + 40], [sx - 400, H + 40]], { fill: 'rgba(120,40,60,.55)', stroke: null, smooth: .2 }); X.restore();
    camEnd();
  }

  // 9.8–11.95 · the beam switches on: a swirling cone; citizens lift off and spiral into the hatch.
  function vacuum(t, lt) {
    const M = RVT_MOOD.alarm, on = easeOut(seg(t, w('r2', 0), w('r2', 0) + .3));
    cam(t, .96 + .05 * lt / 2.15, 4 + 8 * kick(t, w('r2', 1), 5), 0, W / 2, H / 2);
    rvtSkyline(t, M, { horizon: 800, acroX: 1500, acroW: 800, sun: [1700, 260] });
    const A = robo(640, 880, 4.6, { red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), hatch: 1, handL: [-6.4, -14], handR: [6.4, -14], handPoseL: 'claw', handPoseR: 'claw', lookY: .6, steam: .5, jump: .15 * bp(t) });
    rvtVortex(A.hatch[0], A.hatch[1], 1120, 980, 140, 760, t, on);
    for (let i = 0; i < 16; i++) { const t0 = w('r2', 0) + .15 + i * .11, gx = 1120 + (hash(i * 2.2) - .5) * 700;
      if (t < t0) stu(SEEDS[i % SEEDS.length], gx, 990, 1.6, { eyes: 'wide', brows: 'up', mouth: 'O', ...KID.danny.up, jump: .3 * Math.abs(Math.sin(t * 9 + i)) * on, flip: hash(i) > .5 });
      else flyer(SEEDS[i % SEEDS.length], t, t0, t0 + 1.1, gx, 990, A.hatch[0], A.hatch[1], 1.6, { swirl: 160 }); }
    shape(rectPts(-40, 990, W + 80, 120), { fill: rvtTint('#DCC496', M), stroke: null });
    camEnd();
    sfx('SHLOOOP!', 1250, 330, 150, '#FFB0B0', t - w('r2', 1), { rot: .1, life: 1.4 });
  }

  // 11.95–15.5 · the title: a spinning amphora between ROBOTS and TITANS on a terracotta sunburst.
  function title(t, lt) {
    const out = easeIn(seg(t, 15.1, 15.5));
    cam(t, 1 + .025 * bp(t, 9) + out * .6, 3 * bp(t, 9), 0, W / 2, H / 2);
    rvtSunburst(W / 2, 520, t, RVT.terra, RVT.terraLt, 22, .12);
    rvtMeander(0, 70, RVT.black, RVT.terraDk, t * 60); rvtMeander(H - 70, 70, RVT.black, RVT.terraDk, -t * 60);
    const vin = backOut(seg(t, 11.95, 12.6)), spin = t * 260;
    rvtVase(W / 2, 560 + (1 - vin) * 900, 52, t, { panel: () => {
      const cx = W / 2, cy = 560 + (1 - vin) * 900;
      rvtBlackFigure(() => {
        for (let r = -1; r <= 1; r++) {
          const ox = ((spin % 1400) + 1400) % 1400 + r * 1400 - 700;
          robo(cx - 170 + ox, cy + 150, 1.55, { red: 1, hatch: 1, handL: [-6.4, -15], handR: [6.4, -15], hum: false, breathe: 0 });
          nep(cx + 260 + ox, cy + 160, 1.3, { sit: 1, trident: true, flip: true, tridentAng: -1.4, headTilt: .2 });
          for (let i = 0; i < 6; i++) rvtWave(cx + 120 + ox + i * 90, cy + 180, 60, 0, { dir: -1 });
        }
      });
    } });
    const b = RVT_BEATS[prevBeat(12.15) + 1];
    X.save(); X.globalAlpha = 1 - out;
    rvtSlam('ROBOTS', 420, 440, 170, RVT.cream, t, b, -.1);
    rvtSlam('vs.', W / 2, 150, 110, RVT.gold, t, b + SPB * 2, .05);
    rvtSlam('TITANS', 1500, 700, 170, RVT.cream, t, b + SPB * 4, .08);
    rvtSlam('CLEANING UP · PART 4', W / 2, 1005, 54, RVT.terraLt, t, b + SPB * 6, 0);
    X.restore();
    camEnd();
    flash(.5 * kick(t, b, 7) + .4 * kick(t, b + SPB * 4, 7));
  }

  // ============================== VERSE 1 ==============================

  // 15.5–17.8 · Housam dribbles down a market street; the giant strides over the rooftops; on "hide!" he dives behind an amphora.
  function housamRun(t, lt) {
    const M = RVT_MOOD.alarm, hide = w('v1', 5), stop = ease(seg(t, hide - .35, hide)), sc = (t - 15.5) * 520 - stop * (t - hide + .35) * 520 * .0;
    const scroll = (Math.min(t, hide) - 15.5) * 520;
    cam(t, 1.0 + .02 * bp(t), 3 + 4 * bp(t, 5));
    rvtSkyline(t, M, { horizon: 640, acroX: 1500 - scroll * .2, acroW: 700, sun: [300, 200], town: false });
    rvtTown(660, 70, M, { scroll: scroll * .3, seed: 11 });
    // the giant striding behind the rooftops
    const gx = 260 + (t - 15.5) * 120;
    robo(gx, 1100, 5.2, { red: 1, brows: 'angry', mouth: 'teeth', hatch: 1, lookX: .6, lookY: .5, turn: .3, ...roboSafadiWalk((t - 15.5) * 1.6, 1) });
    rvtTown(900, 240, M, { scroll: scroll, seed: 21 });
    shape(rectPts(-40, 900, W + 80, 200), { fill: '#E8D9B6', stroke: null }); line([[-40, 900], [W + 40, 900]], { stroke: RVT.ink, lwPx: 4 });
    for (let i = 0; i < 16; i++) { const x = ((i * 180 - scroll) % 2880 + 2880) % 2880 - 200; line([[x, 900], [x - 60, 1080]], { stroke: '#D4C29A', lwPx: 3 }); }
    // Housam
    const hx = 700 + 300 * stop, dive = ease(seg(t, hide - .1, hide + .25));
    const H0 = { ...kidRun('housam', scroll / 110, 1.5 * (1 - stop)), turn: .5, lookX: t < 16.7 ? -1 : .8, eyes: 'wide', brows: 'worried', mouth: sing('housam', t, 'o'), lean: .12 * (1 - stop) };
    const A = kid('housam', hx, 960, 3.0, dive > 0 ? { ...H0, dy: 9 * dive, lean: -.1, ...KID.housam.scared, mouth: 'o' } : H0);
    if (dive < .5) housamBall(hx + 3.0 * HOUSAM_UNIT * 3.0 + 30 * Math.sin(scroll / 110 * Math.PI), 960 - 26 - 40 * Math.abs(Math.sin(scroll / 110 * Math.PI)), HOUSAM_UNIT * 3.0, { spin: -t * 12 });
    else { const u = seg(t, hide, hide + 1); housamBall(hx + 260 + u * 700, 940 + 20 * Math.abs(Math.sin(u * 9)), HOUSAM_UNIT * 3.0, { spin: t * 14 }); }
    rvtAmphora(lerp(2200, hx + 40, ease(seg(t, 16.0, hide))), 990, 520, { rot: -.04 * kick(t, hide + .2, 4) });
    camEnd();
  }

  // 17.8–19.85 · Alma close, looking up in horror; behind her the citizens spiral up into the beam like her toys did.
  function almaLook(t, lt) {
    const M = RVT_MOOD.alarm;
    cam(t, 1.02 + .05 * lt / 2, 2 + 3 * bp(t, 5));
    layer(() => {
      rvtSkyline(t, M, { horizon: 860, acroX: 1500, acroW: 600, sun: [1700, 300] });
      const hx = 520, hy = 140;
      rvtVortex(hx, hy, 900, 900, 90, 520, t, 1);
      circle(hx, hy, 90, { fill: '#FF5A5A', stroke: RVT.ink, lwPx: 4 }); circle(hx, hy, 60, { fill: '#2A0A10', stroke: null });
      for (let i = 0; i < 14; i++) { const t0 = 17.8 + i * .14 - .6; flyer(SEEDS[(i + 5) % SEEDS.length], t, t0, t0 + 1.3, 700 + hash(i) * 500, 880, hx, hy, 1.4, { swirl: 200 }); }
    }, { blur: 4 });
    const sc = .9 * seg(t, 17.8, 18.1);
    kid('alma', 1260, 1150, 5.4, { ...KID.alma.scared, eyes: 'wide', brows: 'worried', mouth: sing('alma', t, 'o'), lookX: -.9, lookY: -.9, tilt: -.1 + .03 * Math.sin(t * 30) * (1 - sc), hairSwing: .3 * Math.sin(t * 3) });
    camEnd();
  }

  // 19.85–21.85 · Jenna cartwheels across the square, dodging the beam's red target; a statue gets sucked up instead.
  function jennaWheel(t, lt) {
    const M = RVT_MOOD.alarm, u = seg(t, 19.95, 21.3);
    cam(t, 1.0, 3 + 5 * bp(t, 5));
    rvtSkyline(t, M, { horizon: 640, acroX: 1300, acroW: 700, sun: [300, 220], townS: 70 });
    shape(rectPts(-40, 660, W + 80, 460), { fill: '#EFE4CC', stroke: null });
    for (let i = 0; i < 10; i++) line([[i * 220 - 40, 660], [i * 420 - 900, 1080]], { stroke: '#DCCDAE', lwPx: 3 });
    for (let i = 0; i < 6; i++) line([[-40, 680 + i * i * 12], [W + 40, 680 + i * i * 12]], { stroke: '#DCCDAE', lwPx: 3 });
    // the statue on its plinth, sucked up from 21.0
    const sx = 1500, suck = easeIn(seg(t, 20.95, 21.85));
    shape(rectPts(sx - 90, 900, 180, 60), { fill: RVT.marbleSh, stroke: RVT.ink, lwPx: 4 });
    if (suck < 1) { X.save(); X.translate(sx, 900 - suck * 900); X.rotate(suck * 5); X.scale(1 - suck * .6, 1 - suck * .6);
      layer(() => stu(73, 0, 0, 2.6, { eyes: 'closed', mouth: 'flat', handR: [4.6, -22], handPoseR: 'fist', handL: [-3, -10], breathe: 0, blink: 0 }), { filter: 'grayscale(1) brightness(1.35) contrast(.7)' }); X.restore(); }
    // the red target chasing Jenna, then landing on the statue
    const tx = t < 20.9 ? lerp(300, 1100, seg(t, 19.9, 20.9)) - 120 : lerp(1100, sx, ease(seg(t, 20.9, 21.05)));
    ellipse(tx, 955, 200, 46, { fill: 'rgba(255,40,40,.22)', stroke: '#FF3A3A', lwPx: 6, dash: [26, 16] });
    line([[tx - 240, 955], [tx + 240, 955]], { stroke: rgba('#FF3A3A', .7), lwPx: 3 }); line([[tx, 900], [tx, 1010]], { stroke: rgba('#FF3A3A', .7), lwPx: 3 });
    if (t > 20.95) rvtVortex(sx + 200, -200, sx, 960, 80, 360, t, easeOut(seg(t, 20.95, 21.15)));
    // Jenna's cartwheels: three turns as she crosses
    const jx = lerp(260, 1150, u), turns = u * 3, ang = turns * TAU, airborne = u > 0 && u < 1;
    const J = airborne ? { rot: ang, ...KID.jenna.up, footL: [-3.4, -1], footR: [3.4, -1], eyes: 'happy', mouth: sing('jenna', t, 'grin'), dy: 0 }
      : { mouth: sing('jenna', t, 'grin'), eyes: u >= 1 ? 'wide' : 'open', brows: 'up', ...(u >= 1 ? KID.jenna.up : {}), lookX: u >= 1 ? 1 : 0 };
    kidSpun('jenna', jx, 960 - 40 * Math.abs(Math.sin(turns * Math.PI)), 2.8, airborne ? ang : 0, { ...J, rot: undefined });
    camEnd();
    sfx('SHLOOP!', sx, 520, 120, '#FFB0B0', t - 21.05, { rot: .1 });
  }

  // 21.85–23.8 · Danny clings to a column, blown flat like a flag, as students whoosh past into the beam.
  function dannyColumn(t, lt) {
    const M = RVT_MOOD.alarm;
    cam(t, 1.0, 6 + 4 * Math.sin(t * 30));
    rvtSkyline(t, M, { horizon: 700, acroX: 400, acroW: 600, sun: [1600, 220], townS: 70 });
    shape(rectPts(-40, 720, W + 80, 400), { fill: '#EFE4CC', stroke: null });
    // wind streaks toward the beam (screen right)
    for (let i = 0; i < 26; i++) { const y = 80 + hash(i * 3.1) * 900, x = ((hash(i) * W + t * 2600) % (W + 600)) - 300; line([[x, y], [x + 240, y + 6]], { stroke: rgba('#FFFFFF', .5), lwPx: 4 }); }
    rvtColumn(700, 1080, 900, 150, M);
    // Danny streaming out from the column like a flag
    const flap = Math.sin(t * 26) * .08;
    kid('danny', 700 + 400, 600, 3.4, { rot: -Math.PI / 2 + .1 + flap, handL: [-1.2, -26], handR: [1.2, -26], handPoseL: 'fist', handPoseR: 'fist', footL: [-1.6, 1 + 2 * Math.sin(t * 22)], footR: [1.6, 1 - 2 * Math.sin(t * 22)],
      eyes: 'squeeze', brows: 'worried', mouth: sing('danny', t, 'o'), lookX: -1 });
    // students whoosh past, tumbling
    for (let i = 0; i < 10; i++) { const t0 = 21.6 + i * .2, u = seg(t, t0, t0 + .7); if (u <= 0 || u >= 1) continue;
      stu(SEEDS[(i + 3) % SEEDS.length], lerp(-200, W + 300, u), 300 + hash(i * 4.4) * 520, 1.8, { rot: u * 9 * (i % 2 ? 1 : -1), eyes: 'wide', mouth: 'O', brows: 'up', ...KID.danny.up, breathe: 0 }); }
    camEnd();
  }

  // 23.8–26.0 · the four kids sprint toward the lens down a colonnaded street; a giant foot lands behind them.
  function runToCam(t, lt) {
    const M = RVT_MOOD.alarm, stomp = 25.0;
    const P = persp({ x: 20 * Math.sin(t * 2), y: 150, z: -240, f: 900, hy: 470 });
    cam(t, 1.0, 3 + 22 * kick(t, stomp, 5) + 3 * bp(t, 6));
    rvtSky(M);
    // the street: paving to the vanishing point, colonnades on both sides, houses behind
    const road = P.poly([[-330, 0, 0], [330, 0, 0], [330, 0, 4000], [-330, 0, 4000]]); if (road) shape(road, { fill: '#E8D9B6', stroke: null });
    for (let z = 4000; z >= 0; z -= 250) { const a = P.p(-330, 0, z), b = P.p(330, 0, z); line([a, b], { stroke: '#D4C29A', lwPx: 2 }); }
    [-1, 1].forEach(sd => {
      const wall = P.poly([[sd * 480, 0, 0], [sd * 480, 320, 0], [sd * 480, 320, 4000], [sd * 480, 0, 4000]]); if (wall) shape(wall, { fill: rvtTint(RVT.wall, M), stroke: RVT.ink, lwPx: 2 });
      const roof = P.poly([[sd * 480, 320, 0], [sd * 330, 360, 0], [sd * 330, 360, 4000], [sd * 480, 320, 4000]]); if (roof) shape(roof, { fill: rvtTint(RVT.roof, M), stroke: RVT.ink, lwPx: 2 });
    });
    // the giant foot, far down the street
    const lift = 1 - easeIn(seg(t, 24.5, stomp));
    { const [sx, sy, k] = P.p(0, 0, 2600); robo(sx, sy, k * 16, { footL: [-1.7, -.8 - 5 * lift], footR: [1.7, -.8], hum: false, red: 1 }); rvtDust(sx - 100, sy, 300, t - stomp); }
    // the columns, near to far painted far to near
    for (let z = 3800; z >= 100; z -= 420) [-1, 1].forEach(sd => { const [cx, cy, k] = P.p(sd * 360, 0, z); rvtColumn(cx, cy, 300 * k, 46 * k, M); });
    // the kids running at the lens
    [['housam', -150, 0], ['jenna', 120, .3], ['alma', -40, .6], ['danny', 260, .45]].forEach(([id, x, ph], i) => {
      const z = lerp(1500 + i * 60, 260 + i * 40, ease(seg(t, 23.8, 26.0))), [sx, sy, k] = P.p(x, 0, z);
      kid(id, sx, sy, k, { ...kidRun(id, t * 4.4 + ph * 2, 1.4), eyes: t > stomp ? 'wide' : 'open', brows: 'worried', mouth: sing(id, t, 'o'), lookX: t > stomp && t < stomp + .5 ? -.3 : 0 });
    });
    camEnd();
    sfx('THUD!', W / 2, 260, 150, '#FFD07A', t - stomp, { rot: .06 });
  }

  // 26.0–27.6 · the papyrus map: four kid markers race along the dotted line to the baths, a robot marker stomping after them.
  function runMap(t, lt) {
    const k = ease(seg(t, 26.05, 27.55));
    cam(t, 1.0 + .03 * bp(t), 2 + 3 * bp(t, 5));
    const route = rvtMap(t, k);
    KIDS.forEach((id, i) => { const p = polyAt(route, clamp(k * 1.02 - i * .045)), hop = Math.abs(Math.sin(t * 14 + i));
      kid(id, p[0], p[1] - 10 * hop, .75, { ...kidRun(id, t * 6 + i, 1), turn: .4, mouth: 'O', eyes: 'wide' }); });
    const rp = polyAt(route, clamp(k * .8 - .12));
    robo(rp[0], rp[1], .95, { red: 1, brows: 'angry', mouth: 'teeth', hatch: 1, turn: .4, ...roboSafadiWalk(t * 3, 1) });
    camEnd();
  }

  // ============================== PRE-CHORUS ==============================

  // 27.6–29.7 · inside the robot: brass gears, the turbine, a red light; rings of sound pulse on the beat.
  function gears(t, lt) {
    cam(t, 1.02 + .03 * bp(t), 4 + 6 * bp(t, 5), .02 * Math.sin(t * 2));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, H / 2, 100, 1200, [[0, '#4A3A44'], [1, '#140C12']]), stroke: null });
    for (let i = 0; i < 40; i++) circle((i % 10) * 210 + 60, Math.floor(i / 10) * 300 + 60, 9, { fill: '#6A5A64', stroke: '#2A1A24', lwPx: 2 });
    const a = t * 2.2;
    rvtGear(420, 300, 240, 14, a); rvtGear(760, 560, 150, 9, -a * 14 / 9 + .2); rvtGear(330, 780, 180, 11, -a * 14 / 11 + .1);
    rvtGear(1560, 260, 200, 12, a * 1.1, RVT.steel, RVT.steelDk); rvtGear(1640, 700, 260, 15, -a * 12 / 15 * 1.1, RVT.brass, RVT.brassDk);
    // the turbine
    const cx = 1080, cy = 520;
    circle(cx, cy, 300, { fill: '#2A1A24', stroke: RVT.ink, lwPx: 8 });
    for (let i = 0; i < 8; i++) { const an = t * 18 + i / 8 * TAU; shape([[cx, cy], [cx + Math.cos(an) * 280, cy + Math.sin(an) * 280], [cx + Math.cos(an + .45) * 260, cy + Math.sin(an + .45) * 260]], { fill: i % 2 ? '#8C98A0' : '#BAC4CA', stroke: RVT.ink, lwPx: 3 }); }
    circle(cx, cy, 70, { fill: '#FF3A3A', stroke: RVT.ink, lwPx: 6 });
    for (let r = 0; r < 3; r++) { const u = frac((t - RVT_BEATS[prevBeat(t)]) / SPB / 2 + r / 3); circle(cx, cy, 310 + u * 600, { fill: null, stroke: rgba('#FF8A8A', (1 - u) * .7), lwPx: 10 * (1 - u) }); }
    // the red warning light sweeping
    X.save(); X.globalCompositeOperation = 'lighter'; const sa = t * 4; shape([[W / 2, -20], [W / 2 + Math.cos(sa) * 2200, Math.abs(Math.sin(sa)) * 1400], [W / 2 + Math.cos(sa + .3) * 2200, Math.abs(Math.sin(sa + .3)) * 1400]], { fill: 'rgba(255,40,40,.22)', stroke: null }); X.restore();
    circle(W / 2, 0, 60, { fill: '#FF3A3A', stroke: RVT.ink, lwPx: 5 });
    camEnd();
  }

  // 29.7–32.0 · the beam sweeps across a line of citizens like a broom, lifting one per beat.
  function sweep(t, lt) {
    const M = RVT_MOOD.alarm, u = seg(t, 29.75, 31.8);
    cam(t, 1.0, 3 + 4 * bp(t, 5));
    rvtSkyline(t, M, { horizon: 720, acroX: 600, acroW: 700, sun: [300, 200], townS: 70 });
    const A = robo(1560, 960, 4.2, { red: 1, brows: 'angry', mouth: 'teeth', hatch: 1, lookX: -.8, lookY: .6, turn: -.4, handL: [-6.4, -16], handR: [6.4, -14], handPoseL: 'claw', handPoseR: 'claw', steam: .4 });
    const bx = lerp(100, 1250, u);
    rvtVortex(A.hatch[0], A.hatch[1], bx, 980, 110, 300, t, 1);
    for (let i = 0; i < 10; i++) { const gx = 110 + i * 120, t0 = 29.75 + (gx - 100) / 1150 * 2.05;
      if (t < t0) stu(SEEDS[i], gx, 990, 1.7, { eyes: t > t0 - .5 ? 'wide' : 'open', brows: 'up', mouth: t > t0 - .5 ? 'O' : 'o', lookX: 1, ...(t > t0 - .5 ? KID.danny.scared : {}) });
      else flyer(SEEDS[i], t, t0, t0 + .9, gx, 990, A.hatch[0], A.hatch[1], 1.7, { swirl: 60, lift: 120 }); }
    shape(rectPts(-40, 990, W + 80, 120), { fill: rvtTint('#DCC496', M), stroke: null });
    camEnd();
  }

  // 32.0–35.3 · the plan: the kids huddle in an alley; Housam scratches it in the dust, one doodle per beat.
  function plan(t, lt) {
    cam(t, 1.04 + .03 * lt / 3.3, 1.5 + 2 * bp(t, 6));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, 0, 0, H, [[0, '#FF8A3A'], [.5, '#C2341E'], [1, '#5A1A24']]), stroke: null });
    shape([[-40, -40], [520, 120], [520, 760], [-40, 1120]], { fill: '#C9B48E', stroke: RVT.ink, lwPx: 4 });
    shape([[W + 40, -40], [1400, 120], [1400, 760], [W + 40, 1120]], { fill: '#B8A27A', stroke: RVT.ink, lwPx: 4 });
    shape([[520, 760], [1400, 760], [W + 40, 1120], [-40, 1120]], { fill: '#E2CFA6', stroke: null });
    // the doodles in the dust, appearing on the sung beats
    const D = [w('p3', 2), w('p3', 4), w('p3', 8)], dx = 980, dy = 900;
    X.save(); X.translate(dx, dy); X.scale(1.25, .55);
    if (t > D[0]) { const k = seg(t, D[0], D[0] + .3); line(polySlice([[-360, 40], [-360, -120], [-240, -120], [-240, 40], [-360, 40]], 0, k), { stroke: '#7A5A3A', lwPx: 8 }); circle(-330, -90, 10 * k, { fill: '#C2341E', stroke: null }); circle(-270, -90, 10 * k, { fill: '#C2341E', stroke: null }); }
    if (t > D[1]) { const k = seg(t, D[1], D[1] + .3); line(polySlice([[-60, -40], [-40, 40], [140, 40], [160, -40]], 0, k), { stroke: '#7A5A3A', lwPx: 8, smooth: true }); line(polySlice([[-80, -40], [180, -40]], 0, k), { stroke: '#7A5A3A', lwPx: 8 }); }
    if (t > D[2]) { const k = seg(t, D[2], D[2] + .25); line(polySlice([[-200, -40], [-90, -40]], 0, k), { stroke: '#7A5A3A', lwPx: 8 }); line(polySlice([[300, -140], [300, -20]], 0, k), { stroke: '#C2341E', lwPx: 14 }); circle(300, 20, 10 * k, { fill: '#C2341E', stroke: null }); }
    X.restore();
    // the huddle
    const nod = i => .12 * bp(t + i * .05, 6);
    kid('alma', 600, 790, 2.7, { dy: 2, tilt: nod(0), eyes: 'wide', mouth: sing('alma', t, 'o'), lookX: .4, lookY: .8, handL: [-1.5, -6], handR: [1.5, -6] });
    kid('jenna', 1320, 790, 2.7, { dy: 5, tilt: -nod(1), eyes: 'open', brows: 'up', mouth: sing('jenna', t, 'smile'), lookX: -.4, lookY: .8, flip: true });
    kid('danny', 1530, 820, 2.7, { dy: 4, tilt: -nod(2), eyes: 'wide', mouth: sing('danny', t, 'o'), lookX: -.6, lookY: .8, flip: true });
    const scr = Math.sin(t * 14) * .5;
    const A = kid('housam', 760, 830, 2.9, { dy: 8, lean: .25, eyes: 'open', brows: 'focused', mouth: sing('housam', t, 'smirk'), lookX: .5, lookY: .9, handR: [5.5 + scr, -6], handPoseR: 'fist', handL: [-3, -8] });
    line([[A.handR[0], A.handR[1]], [A.handR[0] + 150, A.handR[1] + 110 + 10 * scr]], { stroke: '#7A5A3A', lwPx: 9 });
    camEnd();
  }

  // 35.3–38.1 · low angle: the four stand up in a row, wind in their hair; the giant's red eyes behind; they charge.
  function heroes(t, lt) {
    const stand = backOut(seg(t, 35.4, 35.9)), dash = easeIn(seg(t, 37.5, 38.1));
    cam(t, 1.0 + .06 * lt / 2.8 + dash * .3, 2 + 3 * bp(t, 5), 0, W / 2, H / 2 + dash * 100);
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, 0, 0, H, [[0, '#3A0A1A'], [.6, '#C2341E'], [1, '#FF8A3A']]), stroke: null });
    rvtClouds(t, 200, 6, rgba('#2A0A14', .5), { s: 1.6, speed: 60, seed: 7 });
    // the giant's head as a silhouette with burning eyes
    const RA = probe(() => robo(W / 2, 1330, 7.0, { red: 1, hum: false }));
    layer(() => robo(W / 2, 1330, 7.0, { red: 1, brows: 'angry', mouth: 'teeth', lookY: .8, hum: false }), { filter: 'brightness(.18) saturate(.4)' });
    X.save(); X.globalCompositeOperation = 'lighter'; [RA.eyeL, RA.eyeR].forEach(([x, y]) => circle(x, y, 120 + 20 * bp(t), { fill: radGrad(x, y, 10, 140, [[0, 'rgba(255,60,60,.9)'], [1, 'rgba(255,60,60,0)']]), stroke: null })); X.restore();
    shape(rectPts(-40, 960, W + 80, 200), { fill: '#3A1A1A', stroke: null });
    for (let i = 0; i < 20; i++) { const y = 200 + hash(i) * 800, x = ((hash(i * 3) * W - t * 1400) % (W + 400) + W + 400) % (W + 400) - 200; line([[x, y], [x + 180, y - 10]], { stroke: rgba('#FFD0A0', .35), lwPx: 3 }); }
    const KX = [['jenna', 420], ['housam', 820], ['alma', 1160], ['danny', 1520]];
    KX.forEach(([id, x], i) => kid(id, x + dash * (i - 1.5) * 400, 1000 + dash * 300, 3.6 + dash * 2, { dy: 6 * (1 - stand), eyes: 'open', brows: 'focused', mouth: sing(id, t, 'smirk'), hairSwing: .4 * Math.sin(t * 6 + i), lookY: -.3,
      handL: KID[id].up.handL.map((v, j) => j ? v * .55 : v), handR: KID[id].up.handR.map((v, j) => j ? v * .55 : v), handPoseL: 'fist', handPoseR: 'fist' }));
    camEnd();
    flash(clamp((t - 37.85) / .25), '#FFF6E0');
  }

  // ============================== shared stages for part 2 ==============================

  // The bay: sky, the sea from the horizon, and the city on a headland at the left (the Acropolis, the town, the shore).
  function bay(t, m, o = {}) {
    const hz = o.horizon ?? 560, shore = o.shore ?? 700, x0 = o.x0 ?? -40, x1 = o.x1 ?? W + 40;
    if (o.sky !== false) rvtSky(m);
    if (m === RVT_MOOD.night) rvtStars(t, 160, hz - 60);
    if (m.sun && o.sun !== false) rvtSun(...(o.sunAt || [1450, hz - 260]), 80, m.sun);
    rvtClouds(t, hz - 360, 5, m === RVT_MOOD.storm ? '#2E3A62' : rgba('#FFFFFF', m === RVT_MOOD.sunset ? .3 : .7), { s: 1, seed: 6, speed: o.cloudSpeed ?? 12 });
    const ridge = []; for (let x = x0; x <= x1; x += 40) ridge.push([x, hz - 70 - 40 * Math.sin(x / 500 + 2) - 20 * Math.sin(x / 190)]);
    shape([[x0, hz + 20], ...ridge, [x1, hz + 20]], { fill: rvtTint('#9AA9BC', m), stroke: null });
    rvtSea(hz, o.bottom ?? H + 40, t, m, { x0, x1 });
    if (o.land !== false) {
      const land = [[x0, hz - 10], [shore - 260, hz - 10], [shore - 120, hz + 40], [shore, (o.bottom ?? H + 40)], [x0, (o.bottom ?? H + 40)]];
      shape(land, { fill: rvtTint('#DCC496', m), stroke: RVT.ink, lwPx: 3, smooth: .1 });
      rvtAcropolis(o.acroX ?? shore - 560, hz + 6, o.acroW ?? 560, m);
      X.save(); tracePath(land, true, .1); X.clip(); rvtTown(hz + 70, 60, m, { seed: 13, x0, x1: shore + 40 }); rvtTown(hz + 170, 90, m, { seed: 17, x0, x1: shore + 40 }); X.restore();
    }
  }
  // the sea in front of a giant (covers his legs): a band from y down
  function seaFront(t, y, m, o = {}) {
    const [c0, c1] = m.sea, pts = [];
    for (let x = (o.x0 ?? -40); x <= (o.x1 ?? W + 40); x += 30) pts.push([x, y + 10 * Math.sin(x / 70 + t * 3) + 6 * Math.sin(x / 31 - t * 5)]);
    shape([...pts, [(o.x1 ?? W + 40), H + 400], [(o.x0 ?? -40), H + 400]], { fill: linGrad(0, y, 0, y + 400, [[0, c1], [1, c0]]), stroke: '#FFFFFF', lwPx: 4 });
    for (let i = 0; i < 18; i++) { const x = ((i * 170 + t * 40) % (W + 200)) - 100, yy = y + 40 + (i % 4) * 40; line([[x, yy], [x + 40, yy - 5], [x + 80, yy]], { stroke: rgba('#FFFFFF', .5), lwPx: 3, smooth: true }); }
  }
  // the bathhouse with Safadi in the tub and other actors by depth. sp = his pose; actors as in stage().
  const TUBP = { x: 0, z: 480 };
  function bath(P, t, sp, actors = [], o = {}, blur = 0) {
    const A = {};
    const bather = () => { const [sx, sy, k] = P.p(TUBP.x, 0, TUBP.z); A.safadi = twin('safadi', sx, sy, k, { noShadow: true, dy: 1.0, blush: .5, ...sp });
      if (sp.soap) rvtSoap(A.safadi.handR[0], A.safadi.handR[1] - 24 * k, 26 * k, -.25 + .05 * Math.sin(t * 5), sp.soapGlow || 0); };
    stage(BA, P, t, actors, { foam: .75, steam: 1, bather, ...o }, blur);
    return A;
  }
  // a kid standing in a 3D set at (x, z)
  const kidAt = (P, id, x, z, o) => ({ z, draw: () => { const [sx, sy, k] = P.p(x, 0, z); kid(id, sx, sy, k, o); } });
  const samiAt = (P, x, z, o) => ({ z, draw: () => { const [sx, sy, k] = P.p(x, 0, z); twin('sami', sx, sy, k, o); } });
  // a little drawn "?" over a head
  function qmark(x, y, size, age) { if (age < 0) return; const k = backOut(clamp(age * 4)); X.save(); X.translate(x, y - 10 * Math.sin(age * 4)); X.scale(k, k); X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = size * .18; X.strokeStyle = RVT.ink; X.strokeText('?', 0, 0); X.fillStyle = '#FFE27A'; X.fillText('?', 0, 0); X.restore(); }

  // ============================== CHORUS 1 ==============================

  // 38.1–41.45 · the amphora: black-figure robot and crowned dolphin face off; the kids' figures plant their feet.
  function vaseVS(t, lt) {
    cam(t, 1.0 + .06 * lt / 3.35 + .02 * bp(t), 2 + 3 * bp(t, 6));
    rvtTerracotta(t); rvtMeander(0, 70, RVT.black, RVT.terraDk, t * 80); rvtMeander(H - 70, 70, RVT.black, RVT.terraDk, -t * 80);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .2; shape(starPts(W / 2 + Math.cos(a) * 760, 540 + Math.sin(a) * 380, 26, .45, 8, a), { fill: RVT.gold, stroke: RVT.black, lwPx: 3 }); }
    const stamp = w('c1', 3), land = Math.sin(seg(t, stamp - .3, stamp) * Math.PI);
    rvtVase(W / 2, 560, 60, t, { panel: () => rvtBlackFigure(() => {
      const cx = W / 2, gy = 560 + 200, lean = .08 * Math.sin(t * 4);
      robo(cx - 210, gy, 1.85, { hatch: 1, handL: [-6.4, -15], handR: [6.6, -18], handPoseR: 'claw', lean: -lean, hum: false, breathe: 0 });
      nep(cx + 230, gy + 10, 1.6, { sit: 1, trident: true, flip: true, tridentAng: -1.5 - .2 * Math.sin(t * 3), headTilt: .25 });
      KIDS.forEach((id, i) => kid(id, cx - 60 + i * 42, gy, .55, { ...KID[id].up, jump: 3 * land, breathe: 0 }));
      for (let i = 0; i < 9; i++) rvtWave(cx - 300 + i * 80, gy + 70, 40, 0);
    }) });
    camEnd();
    sfx('STOMP!', W / 2, 200, 100, RVT.cream, t - stamp, { rot: -.05 });
  }

  // 41.45–45.6 · the bay at a red sunset: the robot stomps on the shore; a whirlpool stirs out at sea; lightning.
  function showdown(t, lt) {
    const M = RVT_MOOD.sunset;
    cam(t, 1.0 + .03 * lt / 4, 3 + 10 * bp(t, 5), 0, W / 2 + 60 * lt / 4, H / 2);
    bay(t, M, { horizon: 600, shore: 820 });
    // the whirlpool
    const wx = 1450, wy = 760;
    for (let r = 0; r < 7; r++) { const rr = 40 + r * 45, a0 = t * (3 - r * .3) + r; X.save(); X.globalAlpha = .7; line(Array.from({ length: 20 }, (_, i) => { const a = a0 + i / 20 * 5; return [wx + Math.cos(a) * rr * (1 + i / 40), wy + Math.sin(a) * rr * .3 * (1 + i / 40)]; }), { stroke: r % 2 ? '#FFFFFF' : '#9FDDF2', lwPx: 5, smooth: true }); X.restore(); }
    const glint = .5 + .5 * Math.sin(t * 9); shape(starPts(wx, wy - 10, 30 + 20 * glint, .3, 4, t), { fill: RVT.gold, stroke: null });
    // the giant on the shore, stomping on the beats
    robo(560, 940, 3.8, { red: 1, brows: 'angry', mouth: 'teeth', hatch: 1, lookX: .8, turn: .35, ...roboSafadiWalk(beatN(t) * .5 + seg(t - RVT_BEATS[Math.max(0, prevBeat(t))], 0, .3) * .5, 1), handPoseL: 'claw', handPoseR: 'claw' });
    rvtDust(560, 950, 160, t - RVT_BEATS[Math.max(0, prevBeat(t))]);
    const b = prevBeat(t); if (b % 2 === 0) rvtLightning(1200 + hash(b) * 500, -20, 1350 + hash(b * 3) * 300, 560, b, 7, '#FFF6D0', 1 - seg(t - RVT_BEATS[b], 0, .3));
    camEnd();
  }

  // 45.6–49.7 · cogs and gears | mythical might: a zig-zag split that jumps on the beats.
  function cogsMyth(t, lt) {
    const b = beatN(t), sx = W / 2 + (b % 2 ? 160 : -160) * (1 - .4 * Math.exp(-(t - RVT_BEATS[Math.max(0, b)]) * 10));
    cam(t, 1.02, 2 + 4 * bp(t, 6));
    const zig = sd => { const p = [[sd < 0 ? -40 : W + 40, -40]]; for (let i = 0; i <= 8; i++) p.push([sx + (i % 2 ? 60 : -60), -40 + i * 145]); p.push([sd < 0 ? -40 : W + 40, H + 40]); return p; };
    X.save(); tracePath(zig(-1), true); X.clip();
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(500, 500, 50, 1100, [[0, '#5A4A54'], [1, '#1A1218']]), stroke: null });
    rvtGear(300, 250, 220, 13, t * 2); rvtGear(560, 780, 260, 15, -t * 2 * 13 / 15, RVT.steel, RVT.steelDk); rvtGear(120, 800, 150, 9, t * 3);
    robo(sx - 480, 1500, 6.4, { red: 1, brows: 'angry', mouth: 'teeth', lookX: .7, hum: false });
    X.restore();
    X.save(); tracePath(zig(1), true); X.clip();
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, 0, 0, H, [[0, '#2F8FC4'], [1, '#0E2A5A']]), stroke: null });
    for (let i = 0; i < 8; i++) { const x = sx + 80 + i * 130; X.save(); X.globalCompositeOperation = 'lighter'; shape([[x, -40], [x + 70, -40], [x - 120, H + 40], [x - 220, H + 40]], { fill: 'rgba(160,230,255,.08)', stroke: null }); X.restore(); }
    layer(() => nep(sx + 560, 1180, 5.2, { sit: 1, trident: true, flip: true, eyes: 'glow', power: .6, headTilt: .2, crownTilt: .1 * Math.sin(t * 2) }), { filter: 'brightness(.45) saturate(1.3) hue-rotate(-10deg)' });
    for (let i = 0; i < 26; i++) { const u = frac(hash(i) + t * (.2 + hash(i * 3) * .2)); rvtBubble(sx + 100 + hash(i * 7) * 900, H + 40 - u * (H + 120), 8 + 18 * hash(i * 5), t); }
    const cr = probe(() => nep(sx + 560, 1180, 5.2, { sit: 1, flip: true, headTilt: .2 })).crown, g = .5 + .5 * Math.sin(t * 7);
    X.save(); X.globalCompositeOperation = 'lighter'; shape(starPts(cr[0], cr[1], 60 + 40 * g, .2, 4, t), { fill: 'rgba(255,230,140,.9)', stroke: null }); X.restore();
    X.restore();
    line(zig(1).slice(1, -1), { stroke: RVT.cream, lwPx: 14 }); line(zig(1).slice(1, -1), { stroke: RVT.ink, lwPx: 5 });
    camEnd();
  }

  // 49.7–54.1 · on a rooftop each kid shows off a power, one per sung beat.
  function colossal(t, lt) {
    const M = RVT_MOOD.alarm, T4 = [w('c4', 0), w('c4', 2), w('c4', 3), w('c4', 5)];
    cam(t, 1.0, 2 + 4 * bp(t, 5));
    rvtSkyline(t, M, { horizon: 640, acroX: 1500, acroW: 600, sun: [1700, 220], townS: 60 });
    robo(1480, 700, 2.2, { red: 1, brows: 'angry', mouth: 'teeth', hatch: 1, lookX: -.5, ...roboSafadiWalk(t * 1.2, 1) });
    // the roof
    shape([[-40, 900], [W + 40, 900], [W + 40, 1120], [-40, 1120]], { fill: RVT.roof, stroke: RVT.ink, lwPx: 4 });
    for (let i = 0; i < 24; i++) shape([[i * 90 - 40, 900], [i * 90 + 50, 900], [i * 90 + 30, 1120], [i * 90 - 60, 1120]], { fill: i % 2 ? RVT.roof : RVT.roofDk, stroke: RVT.ink, lwPx: 2 });
    const on = i => t > T4[i], age = i => t - T4[i];
    // Alma: the rainbow floor
    kid('alma', 380, 930, 3.0, on(0) ? { ...almaDance(t, 'star jump', { bpm: 117.5 }), power: 1, eyes: 'star' } : { mouth: sing('alma', t), eyes: 'open' });
    // Housam: the kick, the ball flies at the giant
    const kk = age(1);
    kid('housam', 800, 930, 3.0, on(1) ? { footR: [4.7, -3.7 - 2 * Math.exp(-kk * 4)], footL: [-1.75, -1.05], handL: [-5, -14.5], handR: [4.7, -15.4], lean: -.15, mouth: 'grin', brows: 'focused' } : { mouth: sing('housam', t), brows: 'focused' });
    if (on(1)) { const u = seg(kk, 0, 1.2); housamBall(lerp(940, 1480, u), lerp(900, 540, u) - 300 * Math.sin(u * Math.PI), HOUSAM_UNIT * 3 * (1 - .6 * u), { spin: t * 20 }); if (u >= 1) sfx('BONK!', 1480, 470, 90, '#FFE27A', kk - 1.2); }
    // Jenna: a cartwheel
    const jk = seg(age(2), 0, .8);
    kidSpun('jenna', 1160 + 120 * jk, 930 - 60 * Math.sin(jk * Math.PI), 3.0, on(2) ? jk * TAU : 0, on(2) ? { ...KID.jenna.up, footL: [-3.4, -1], footR: [3.4, -1], eyes: 'happy', mouth: 'grin' } : { mouth: sing('jenna', t) });
    // Danny: holds up a block
    const DA = kid('danny', 1600, 930, 3.0, on(3) ? { ...KID.danny.up, handPoseL: 'fist', handPoseR: 'fist', mouth: 'grin', eyes: 'happy', jump: 1.2 * Math.exp(-age(3) * 3) } : { mouth: sing('danny', t) });
    if (on(3)) dannyBlock((DA.handL[0] + DA.handR[0]) / 2, Math.min(DA.handL[1], DA.handR[1]) - 50, DANNY_UNIT * 3 * (1 + .3 * Math.exp(-age(3) * 5)), { ang: .1 * Math.sin(t * 3) });
    T4.forEach((t0, i) => { const x = [380, 800, 1220, 1600][i]; if (t > t0) sfx(['✦', '✦', '✦', '✦'][i], x, 460, 90, '#FFE27A', t - t0, { life: .6 }); });
    camEnd();
  }

  // 54.1–57.85 · the Theatre of Dionysus: rows of citizens cheer; comedy and tragedy masks swing.
  function watchShow(t, lt) {
    const M = RVT_MOOD.sunset, pan = lt / 3.75;
    cam(t, 1.05, 2 + 3 * bp(t, 6), 0, W / 2 - 120 + 240 * pan, H / 2);
    bay(t, M, { horizon: 380, land: false, sunAt: [1500, 200] });
    const rows = [[560, 1.25, 11], [720, 1.6, 9], [900, 2.05, 7]];
    rows.forEach(([y, k, n], r) => {
      shape([[-200, y - 30], [W + 200, y - 30], [W + 200, y + 220], [-200, y + 220]], { fill: r % 2 ? '#E2D3B2' : '#EADDBE', stroke: RVT.ink, lwPx: 3 });
      for (let i = 0; i < n; i++) { const x = -60 + (i + .5) * (W + 120) / n + (r % 2) * 40, seed = SEEDS[(i * 3 + r * 5) % SEEDS.length], up = (beatN(t) + i + r) % 2 === 0;
        stu(seed, x, y + 40, k, { ...(up ? KID.danny.up : { handL: [-4.4, -15], handR: [4.4, -15] }), eyes: up ? 'happy' : 'wide', mouth: sing('kids', t, 'open'), jump: up ? .8 * bp(t, 5) : 0, flip: i % 2 === 0 }); }
      shape([[-200, y + 20], [W + 200, y + 20], [W + 200, y + 220], [-200, y + 220]], { fill: r % 2 ? '#E2D3B2' : '#EADDBE', stroke: RVT.ink, lwPx: 3 });
    });
    rvtMask(160, 160, 13, 0, .3 * Math.sin(t * 3)); rvtMask(W - 160, 160, 13, 1, -.3 * Math.sin(t * 3));
    camEnd();
  }

  // 57.85–61.6 · a black-figure balance scale tips between the robot and the trident on the beats.
  function whoWins(t, lt) {
    cam(t, 1.0 + .02 * bp(t), 2 + 2 * bp(t, 6));
    rvtTerracotta(t); rvtMeander(0, 70, RVT.black, RVT.terraDk, t * 40); rvtMeander(H - 70, 70, RVT.black, RVT.terraDk, -t * 40);
    const b = beatN(t), tip = (b % 2 ? 1 : -1) * .22 * (1 - .5 * Math.exp(-(t - RVT_BEATS[Math.max(0, b)]) * 8)) + .03 * Math.sin(t * 6);
    const cx = W / 2, cy = 330, L2 = 560;
    rvtBlackFigure(() => {
      shape([[cx - 30, cy], [cx + 30, cy], [cx + 80, 920], [cx - 80, 920]], { fill: '#000', stroke: null });
      shape(rectPts(cx - 220, 900, 440, 40), { fill: '#000', stroke: null });
      X.save(); X.translate(cx, cy); X.rotate(tip); shape(rectPts(-L2, -14, L2 * 2, 28), { fill: '#000', stroke: null }); X.restore();
      [-1, 1].forEach(sd => { const ex = cx + Math.cos(tip) * L2 * sd, ey = cy + Math.sin(tip) * L2 * sd;
        line([[ex, ey], [ex - 150, ey + 300]], { stroke: '#000', lwPx: 6 }); line([[ex, ey], [ex + 150, ey + 300]], { stroke: '#000', lwPx: 6 });
        shape([[ex - 190, ey + 300], [ex + 190, ey + 300], [ex + 120, ey + 360], [ex - 120, ey + 360]], { fill: '#000', stroke: null });
        if (sd < 0) robo(ex, ey + 300, 1.1, { hatch: 1, handL: [-6.4, -15], handR: [6.4, -15], hum: false, breathe: 0 });
        else nep(ex, ey + 300, 1.0, { sit: 1, flip: true, trident: true, tridentAng: -1.5, headTilt: .3, breathe: 0 });
      });
    });
    qmark(cx, 200, 140, t - w('c6', 0));
    camEnd();
  }

  // ============================== VERSE 2 · the bathhouse ==============================

  // 61.6–65.55 · the kids burst in panting; Safadi soaks; Sami stands by.
  function bathIn(t, lt) {
    const P = persp({ x: 10 * Math.sin(t * .3), y: 180, z: -60 + 50 * lt / 4, f: 900, hy: 560 });
    const awake = t > w('s1', 0) - .2, inK = i => easeOut(seg(t, 61.6 + i * .15, 62.6 + i * .15));
    const pant = Math.sin(t * 10) * .5;
    const sp = awake ? { eyes: 'open', brows: 'up', mouth: sing('safadi', t, 'smile'), handR: [5.4, -16], handPoseR: 'palm', handL: [-5.2, -9.5], tilt: .05 } : { eyes: 'closed', mouth: 'smile', handL: [-5.6, -9], handR: [5.6, -9], tilt: .1 };
    const actors = [samiAt(P, 210, 470, { handL: [-4, -9.5], handR: [4, -9.5], mouth: 'smile', lookX: -.6, turn: -.2 })];
    [['housam', -230, 230], ['alma', -80, 170], ['jenna', 80, 200], ['danny', 230, 160]].forEach(([id, x, z], i) =>
      actors.push(kidAt(P, id, x, lerp(-100, z, inK(i)), { ...KID[id].scared, dy: 1 + pant, eyes: 'wide', brows: 'worried', mouth: 'O', lookY: -.2, ...(inK(i) < 1 ? kidRun(id, t * 4.4, 1.2) : {}) })));
    bath(P, t, sp, actors);
  }

  // the robot far away, seen through the bathhouse arches (an actor at the back wall, clipped to the arch openings)
  function archRobot(P, t, o = {}) {
    return { z: 1450, draw: () => {
      X.save(); X.beginPath();
      [-300, 0, 300].forEach(ax => { const a = P.p(ax - 95, 0, 1500), b = P.p(ax + 95, 235, 1500), c = P.p(ax, 235, 1500), r = (b[0] - a[0]) / 2;
        X.rect(Math.min(a[0], b[0]), b[1], Math.abs(b[0] - a[0]), a[1] - b[1]); X.moveTo(c[0] + Math.abs(r), c[1]); X.ellipse(c[0], c[1], Math.abs(r), Math.abs(r), 0, 0, TAU); });
      X.clip();
      const [sx, sy, k] = P.p(o.x ?? 150, 0, 9000);
      const A = robo(sx, sy + 360, k * 30, { red: 1, hatch: 1, brows: 'angry', mouth: 'teeth', lookX: -.4, ...roboSafadiWalk(t * 1.1, 1) });
      rvtVortex(A.hatch[0], A.hatch[1], A.hatch[0] - 260 * k * 22 / 22, sy + 20, 20, 120, t, 1);
      for (let i = 0; i < 5; i++) { const t0 = Math.floor(t * 1.5) / 1.5 + i * .3; flyer(SEEDS[i], t, t0, t0 + 1.2, A.hatch[0] - 260 + i * 30, sy + 20, A.hatch[0], A.hatch[1], k * 8, { swirl: 20, lift: 10 }); }
      X.restore();
    } };
  }

  // 65.55–69.75 · "This giant machine shouldn't trouble us": he twirls his soap; through the arches the robot sucks up people.
  function notTrouble(t, lt) {
    const P = persp({ x: 70, y: 150, z: 240 + 15 * lt / 4, f: 1000, hy: 560 });
    const tw = t * 9;
    bath(P, t, { eyes: 'happy', brows: 'normal', mouth: sing('safadi', t, 'smile'), handR: [5.2 + .3 * Math.sin(tw), -18 + .3 * Math.cos(tw)], handPoseR: 'point', handL: [-4.8, -11], handPoseL: 'palm', tilt: -.06, lookX: .3 }, [archRobot(P, t)]);
    const R = probe(() => { const [sx, sy, k] = P.p(0, 0, 480); return twin('safadi', sx, sy, k, { dy: 1, handR: [5.2 + .3 * Math.sin(tw), -18 + .3 * Math.cos(tw)], handPoseR: 'point', handL: [-4.8, -11], tilt: -.06 }); });
    rvtSoap(R.handR[0] + 6, R.handR[1] - 70, 80, tw, .3);
  }

  // 69.75–73.45 · zen: eyes closed, bubbles and music notes float up; Danny dips a toe.
  function sitWater(t, lt) {
    const P = persp({ x: 0, y: 160, z: 110 + 20 * lt / 3.7, f: 1000, hy: 600 });
    const toe = Math.sin(seg(t, 71.0, 72.6) * Math.PI);
    bath(P, t, { eyes: 'closed', mouth: sing('safadi', t, 'smile'), handL: [-5.6, -9.5], handR: [5.6, -9.5], handPoseL: 'open', handPoseR: 'open', tilt: .08 * Math.sin(t * 1.2), emote: 'music', emoteK: 1 },
      [kidAt(P, 'danny', 170, 360, { footR: [2.2, -1.2 - 1.6 * toe], lean: -.08 * toe, eyes: toe > .8 ? 'squeeze' : 'open', brows: 'up', mouth: toe > .8 ? 'O' : 'o', lookY: .6, handL: [-4.6, -14], handR: [4.6, -14], handPoseL: 'palm', handPoseR: 'palm' }),
       kidAt(P, 'alma', -190, 380, { eyes: 'open', lookX: .6, mouth: 'smile', handL: [-1.4, -6], handR: [1.4, -6] })]);
    for (let i = 0; i < 14; i++) { const u = frac(hash(i) + t * .25), x = 760 + hash(i * 3) * 400 + 30 * Math.sin(t * 2 + i), y = 760 - u * 700;
      X.save(); X.globalAlpha = 1 - u; i % 3 ? rvtBubble(x, y, 10 + 22 * hash(i * 5), t) : sfx('♪', x, y, 54, '#FFE27A', .3, { life: 1 }); X.restore(); }
  }

  // 73.45–77.2 · his powers come on; the steam shapes itself into an owl, a scroll and a star map; the kids: "?"
  function philosophy(t, lt) {
    const P = persp({ x: 0, y: 200, z: -40, f: 900, hy: 540 });
    const pw = ease(seg(t, 73.6, 74.2));
    bath(P, t, { eyes: 'glow', brows: 'up', mouth: sing('safadi', t, 'smile'), power: pw, handL: [-6, -18], handR: [6, -18], handPoseL: 'palm', handPoseR: 'palm' },
      [kidAt(P, 'housam', -330, 260, { lookX: .5, lookY: -.6, mouth: 'flat', brows: 'up' }), kidAt(P, 'jenna', -180, 220, { lookX: .3, lookY: -.6, mouth: 'o' }),
       kidAt(P, 'alma', 180, 220, { lookX: -.3, lookY: -.6, mouth: 'o' }), kidAt(P, 'danny', 320, 250, { lookX: -.5, lookY: -.6, mouth: 'flat', brows: 'up' })]);
    // steam shapes
    const sh = [[700, 260, 0, w('s4', 2)], [960, 180, 1, w('s4', 4)], [1220, 260, 2, w('s4', 6)]];
    sh.forEach(([x, y, kd, t0]) => { const k = ease(seg(t, t0 - .2, t0 + .4)); if (k <= 0) return;
      X.save(); X.globalAlpha = .85 * k; X.translate(x, y + 8 * Math.sin(t * 2 + kd)); X.scale(.8 + .2 * k, .8 + .2 * k);
      const st = { fill: 'rgba(255,255,255,.75)', stroke: 'rgba(120,200,230,.9)', lwPx: 4 };
      if (kd === 0) { ellipse(0, 20, 70, 90, st); circle(-26, -10, 26, st); circle(26, -10, 26, st); circle(-26, -10, 9, { fill: '#5A8AA8', stroke: null }); circle(26, -10, 9, { fill: '#5A8AA8', stroke: null }); shape([[-8, 12], [8, 12], [0, 26]], { fill: '#E3B03A', stroke: null }); }
      if (kd === 1) { shape(rectPts(-110, -50, 220, 100), { ...st, smooth: .2 }); circle(-110, 0, 26, st); circle(110, 0, 26, st); for (let i = 0; i < 4; i++) line([[-80, -28 + i * 18], [70 - i * 10, -28 + i * 18]], { stroke: 'rgba(90,140,170,.8)', lwPx: 4 }); }
      if (kd === 2) { [[0, 0], [60, -40], [110, 10], [40, 60], [-60, 40]].forEach(([a, b], i, arr) => { shape(starPts(a, b, 16, .4, 5), { fill: '#FFF6C0', stroke: 'rgba(120,200,230,.9)', lwPx: 3 }); if (i) line([arr[i - 1], [a, b]], { stroke: 'rgba(255,255,255,.7)', lwPx: 3, dash: [8, 8] }); }); }
      X.restore(); });
    [[-330, 260], [-180, 220], [180, 220], [320, 250]].forEach(([x, z], i) => { const [sx, sy, k] = P.p(x, 0, z); qmark(sx, sy - 175 * k, 70, t - 75.6 - i * .12); });
  }

  // 77.2–83.0 · the steam opens on a cosmic temple of Apollo at Delphi; ΓΝΩΘΙ ΣΕΑΥΤΟΝ lights up; "know thyself".
  function gnothi(t, lt) {
    cam(t, 1.0 + .08 * lt / 5.8, 1, 0, W / 2, H / 2 - 30 * lt / 5.8);
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, 420, 100, 1300, [[0, '#5A3A9A'], [.5, '#2A1A5A'], [1, '#0A0620']]), stroke: null });
    rvtStars(t, 200, H, 11);
    for (let i = 0; i < 3; i++) { X.save(); X.globalCompositeOperation = 'lighter'; circle(W / 2, 420, 300 + i * 160 + 20 * Math.sin(t * 2 + i), { fill: null, stroke: rgba('#FFD66B', .12), lwPx: 30 }); X.restore(); }
    const lit = seg(t, w('s5', 0), w('s5', 2));
    rvtDelphi(W / 2, 700, 760, t, lit);
    const kt = seg(t, w('s5', 2), w('s5', 3) + .3);
    if (kt > 0) { X.save(); X.globalAlpha = kt; rvtSlam('KNOW THYSELF', W / 2, 110, 100, '#FFE9A0', t, w('s5', 2), 0, { ink: '#2A1A4A' }); X.restore(); }
    const fl = Math.sin(t * 1.6) * 14;
    twin('safadi', W / 2, 1040 + fl, 2.9, { power: 1, eyes: 'closed', mouth: sing('safadi', t, 'smile'), handL: [-6.4, -15], handR: [6.4, -15], handPoseL: 'palm', handPoseR: 'palm', footL: [-1.6, -2], footR: [1.6, -2], noShadow: true, jump: 1.5 });
    // the steam curtains drawing back
    const op = easeOut(seg(t, 77.2, 78.2));
    [-1, 1].forEach(sd => { for (let i = 0; i < 6; i++) circle(W / 2 + sd * (op * 1000 + 120 + i * 40), 100 + i * 180, 260, { fill: 'rgba(240,248,255,.9)', stroke: null }); });
    camEnd();
  }

  // 83.0–87.85 · the quiet bar: each kid sees a hero in the water, one pool per beat; on "true victory" they all glow gold.
  function reflect(t, lt) {
    cam(t, 1.0 + .03 * lt / 4.8, 0);
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: '#E9E1D2', stroke: null });
    const gold = ease(seg(t, w('s6', 4), w('s6', 6)));
    const P4 = [[480, 290, 'alma'], [1440, 290, 'housam'], [480, 760, 'jenna'], [1440, 760, 'danny']];
    P4.forEach(([cx, cy, id], i) => {
      const t0 = 83.1 + i * 1.0, k = backOut(seg(t, t0, t0 + .4)); if (k <= 0) return;
      X.save(); X.translate(cx, cy); X.scale(k, k);
      ellipse(0, 0, 420, 210, { fill: '#FAF6EE', stroke: RVT.ink, lwPx: 6 });
      X.save(); X.beginPath(); X.ellipse(0, 0, 390, 185, 0, 0, TAU); X.clip();
      shape(rectPts(-400, -200, 800, 400), { fill: linGrad(0, -200, 0, 200, [[0, mixCol('#7CC6E6', '#FFE07A', gold)], [1, mixCol('#2F8FC4', '#E3A030', gold)]]), stroke: null });
      layer(() => {
        if (id === 'alma') kid('alma', 0, 150, 1.9, { ...almaDance(t, 'star jump', { bpm: 117.5, k: .6 }), power: 1, eyes: 'star' });
        if (id === 'housam') { kid('housam', -40, 150, 1.6, { footR: [4.7, -3.7], footL: [-1.75, -1.05], handL: [-5, -14.5], handR: [4.7, -15.4], lean: -.15, mouth: 'grin', brows: 'focused' }); housamBall(130, 60 - 20 * Math.sin(t * 3), HOUSAM_UNIT * 1.6, { spin: t * 4 }); }
        if (id === 'jenna') kidSpun('jenna', 0, 150, 1.6, t * 2.5, { ...KID.jenna.up, footL: [-3.4, -1], footR: [3.4, -1], eyes: 'happy', mouth: 'grin' });
        if (id === 'danny') { const A = kid('danny', 0, 150, 1.6, { ...KID.danny.up, mouth: 'grin', eyes: 'happy' }); dannyBlock((A.handL[0] + A.handR[0]) / 2, A.handL[1] - 30, DANNY_UNIT * 1.6, {}); }
      }, { filter: `saturate(${.7 + .5 * gold}) brightness(${1.05 + .2 * gold}) hue-rotate(${(1 - gold) * -12}deg)` });
      for (let r = 0; r < 4; r++) { const u = frac(t * .4 + r / 4); ellipse(0, 0, 390 * u, 185 * u, { fill: null, stroke: rgba('#FFFFFF', .5 * (1 - u)), lwPx: 4 }); }
      for (let y = -180; y < 190; y += 26) line([[-400, y + 4 * Math.sin(t * 3 + y)], [400, y + 4 * Math.sin(t * 3 + y + 2)]], { stroke: 'rgba(255,255,255,.12)', lwPx: 3 });
      X.restore(); X.restore();
      if (gold > 0) { X.save(); X.globalCompositeOperation = 'lighter'; circle(cx, cy, 460, { fill: radGrad(cx, cy, 200, 480, [[0, rgba('#FFE07A', 0)], [1, rgba('#FFE07A', .35 * gold)]]), stroke: null }); X.restore(); }
    });
    camEnd();
  }

  // 87.85–91.4 · Sami shakes his brother; on "brink" the roof tears away and the robot's face peers in.
  function samiStop(t, lt) {
    const tear = w('m2', 6) - .25, tk = easeOut(seg(t, tear, tear + .5));
    const P = persp({ x: -60, y: 165, z: 150, f: 950, hy: 560 });
    cam(t, 1.0, 4 + 24 * kick(t, tear, 4) + (t < tear ? 6 * Math.abs(Math.sin(t * 16)) : 0));
    const shake = Math.sin(t * 22);
    bath(P, t, { eyes: t > tear ? 'wide' : 'squeeze', brows: 'up', mouth: t > tear ? 'O' : 'wobble', tilt: .12 * shake * (t < tear ? 1 : 0), handL: [-4.6, -11], handR: [4.6, -11], lookY: t > tear ? -1 : 0 },
      [samiAt(P, -150, 430, { mouth: sing('sami', t, 'open'), brows: t > tear ? 'up' : 'angry', eyes: t > tear ? 'wide' : 'open', handR: [7.4 + .6 * shake, -16], handL: [5.8 + .6 * shake, -12], handPoseR: 'fist', handPoseL: 'fist', lean: .14, lookX: .8, lookY: t > tear ? -1 : 0 })]);
    if (tk > 0) {   // the roof is gone: sky, the robot's face looking down through a jagged hole, rubble flying up
      const hole = []; for (let i = 0; i <= 16; i++) { const x = -40 + i * (W + 80) / 16; hole.push([x, 430 * tk + (i % 2 ? 40 : -20) * tk]); }
      X.save(); tracePath([[-40, -40], [W + 40, -40], ...hole.reverse()], true); X.clip();
      rvtSky(RVT_MOOD.alarm);
      robo(W / 2 + 80, 800 + (1 - tk) * 500, 4.6, { red: 1, brows: 'angry', mouth: 'teeth', lookY: 1, hum: false, rot: Math.PI * .0 });
      X.restore();
      line(hole, { stroke: RVT.ink, lwPx: 6 });
      for (let i = 0; i < 12; i++) { const a = t - tear; X.save(); X.translate(hash(i) * W, 250 - a * (500 + 600 * hash(i * 3))); X.rotate(a * (3 + i)); shape(rectPts(-40, -20, 80, 40), { fill: RVT.marbleSh, stroke: RVT.ink, lwPx: 3 }); X.restore(); }
    }
    camEnd();
    sfx('KRRRAK!', W / 2, 420, 150, '#FFD07A', t - tear, { life: 1.2 });
  }

  // ============================== BRIDGE · the summoning ==============================

  // 91.4–95.8 · "All right, all right": he stands up in the tub, sighs, then sets his jaw; Sami nods.
  function allRight(t, lt) {
    const P = persp({ x: -50, y: 160, z: 160, f: 1000, hy: 560 });
    const up = ease(seg(t, 91.5, 92.3)), set = t > 94.0;
    bath(P, t, { dy: lerp(1.0, -.3, up), eyes: t < 93.2 && t > 92.4 ? 'closed' : 'open', brows: set ? 'focused' : 'worried', mouth: sing('safadi', t, set ? 'flat' : 'o'), handL: set ? [-4.6, -12] : [-5.6, -9], handR: set ? [4.6, -12] : [5.6, -9], handPoseL: set ? 'fist' : 'open', handPoseR: set ? 'fist' : 'open', tilt: t > 92.4 && t < 93.4 ? .1 : 0 },
      [samiAt(P, -170, 420, { mouth: 'smile', brows: 'up', lookX: .7, tilt: .08 * bp(t, 4), handL: [-4, -10], handR: [4, -10] })], {}, .5);
    cam(t, 1.0 + .04 * lt / 4.4, 0); camEnd();
  }

  // 95.8–97.85 · Sami points out through the arches to the sea; the sky darkens.
  function titanTime(t, lt) {
    const dark = ease(seg(t, 96.2, 97.8)), z = lerp(-200, 380, ease(seg(t, 96.0, 97.85)));
    const P = persp({ x: 0, y: 190, z, f: 820, hy: 540 });
    bath(P, t, { eyes: 'wide', brows: 'up', mouth: 'o', lookX: -.5, handL: [-4.6, -11], handR: [4.6, -11] },
      [samiAt(P, -260, 600, { mouth: sing('sami', t, 'grin'), brows: 'focused', ...{ handR: [7.4, -21], handPoseR: 'point' }, lookX: .6, lookY: -.3 })], { steam: .6 });
    X.save(); X.globalCompositeOperation = 'multiply'; shape(rectPts(-40, -40, W + 80, H + 80), { fill: rgba('#3A4A8A', .55 * dark), stroke: null }); X.restore();
    if (t > 97.3) rvtLightning(1100, -20, 1000, 400, 7, 6, '#FFFBE0', 1 - seg(t, 97.3, 97.6));
  }

  // 97.85–100.05 · the soap held high like a relic, then slammed into the water: SPLASH.
  function soapSplash(t, lt) {
    const slam = w('b3', 7), P = persp({ x: 30, y: 150, z: 250, f: 1050, hy: 560 });
    cam(t, 1.0 + .05 * kick(t, slam, 4), 18 * kick(t, slam, 5));
    const raise = ease(seg(t, 97.9, 98.6)), down = easeIn(seg(t, slam - .2, slam));
    const hand = mixPt(mixPt([5.2, -12], [3.2, -27], raise), [3.0, -6], down);
    const A = bath(P, t, { dy: -.3, eyes: t < slam ? 'glow' : 'squeeze', brows: 'focused', mouth: sing('safadi', t, 'grin'), handR: hand, handPoseR: 'fist', handL: [-5, -14], handPoseL: 'palm', power: raise * (1 - down), soap: t < slam, soapGlow: raise, lookY: -.6 * raise }, [], { ripple: slam });
    if (t > slam) { const [sx, sy, k] = P.p(0, 64, 480); rvtSplash(sx, sy, 520, t - slam); }
    camEnd();
    sfx('SPLASH!', W / 2, 260, 170, '#BFF3FF', t - slam, { life: 1.3 });
    flash(.5 * kick(t, slam, 6), '#E8FBFF');
  }

  // 100.05–103.75 · the twins on the bathhouse steps facing the storm, auras on, the kids behind them.
  function entrance(t, lt) {
    const M = RVT_MOOD.storm;
    cam(t, 1.0 + .05 * lt / 3.7, 2 + 4 * bp(t, 5), 0, W / 2, H / 2 + 20);
    bay(t, M, { horizon: 520, land: false, cloudSpeed: 60 });
    const b = beatN(t); if (b % 3 === 0) rvtLightning(300 + hash(b) * 1300, -20, 400 + hash(b * 2) * 1100, 520, b, 6, '#E8F0FF', 1 - seg(t - RVT_BEATS[b], 0, .25));
    shape([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], { fill: RVT.marble, stroke: RVT.ink, lwPx: 4 });
    for (let i = 1; i < 4; i++) line([[-40, 860 + i * 60], [W + 40, 860 + i * 60]], { stroke: RVT.marbleSh, lwPx: 5 });
    rvtColumn(110, 1080, 1000, 150, M); rvtColumn(W - 110, 1080, 1000, 150, M);
    [['housam', 420, 0], ['alma', 560, 1], ['jenna', 1360, 2], ['danny', 1500, 3]].forEach(([id, x, i]) => kid(id, x, 880, 2.4, { eyes: 'wide', brows: 'up', mouth: 'o', lookX: x < W / 2 ? .7 : -.7, lookY: -.3, hairSwing: .3 * Math.sin(t * 5 + i) }));
    const pw = ease(seg(t, 100.2, 100.8));
    twin('safadi', 800, 960, 3.0, { power: pw, eyes: 'glow', brows: 'focused', mouth: sing('safadi', t, 'flat'), handL: [-4.6, -12], handR: [4.6, -12], handPoseL: 'fist', handPoseR: 'fist' });
    twin('sami', 1120, 960, 3.0, { power: pw, eyes: 'glow', brows: 'focused', mouth: sing('sami', t, 'grin'), handL: [-4.6, -12], handR: [4.6, -12], handPoseL: 'fist', handPoseR: 'fist' });
    for (let i = 0; i < 30; i++) { const y = hash(i) * H, x = ((hash(i * 2) * W - t * 900) % (W + 200) + W + 200) % (W + 200) - 100; line([[x, y], [x - 30, y + 90]], { stroke: rgba('#B8C8F0', .5), lwPx: 3 }); }
    camEnd();
  }

  // 103.75–106.3 · arms up: beams of gold and mint shoot to the horizon; the sea spins into a whirlpool.
  function summon(t, lt) {
    const M = RVT_MOOD.storm, beam = easeOut(seg(t, w('b5', 0), w('b5', 0) + .4)), spin = seg(t, 104.5, 106.3);
    cam(t, 1.0 + .04 * lt / 2.5, 3 + 6 * bp(t, 5));
    bay(t, M, { horizon: 500, land: false, cloudSpeed: 80 });
    const wx = W / 2, wy = 600;
    for (let r = 0; r < 9; r++) { const rr = (30 + r * 60) * (0.4 + spin), a0 = t * (5 - r * .4) + r; X.save(); X.globalAlpha = .8; line(Array.from({ length: 24 }, (_, i) => { const a = a0 + i / 24 * 6; return [wx + Math.cos(a) * rr * (1 + i / 50), wy + Math.sin(a) * rr * .28 * (1 + i / 50)]; }), { stroke: r % 2 ? '#FFFFFF' : '#9FDDF2', lwPx: 6, smooth: true }); X.restore(); }
    const S = twin('safadi', 330, 1180, 3.4, { power: 1, eyes: 'glow', brows: 'up', mouth: sing('safadi', t, 'open'), handL: [-5, -27], handR: [5.4, -27], handPoseL: 'palm', handPoseR: 'palm', lookX: .8, lookY: -.6 });
    const Q = twin('sami', 1590, 1180, 3.4, { power: 1, eyes: 'glow', brows: 'up', mouth: sing('sami', t, 'open'), handL: [-5.4, -27], handR: [5, -27], handPoseL: 'palm', handPoseR: 'palm', lookX: -.8, lookY: -.6 });
    if (beam > 0) { X.save(); X.globalCompositeOperation = 'lighter';
      [[S, '#FFD66B'], [Q, '#8AE5B3']].forEach(([A, c]) => { const hx = (A.handL[0] + A.handR[0]) / 2, hy = (A.handL[1] + A.handR[1]) / 2, ex = lerp(hx, wx, beam), ey = lerp(hy, wy, beam);
        line([[hx, hy], [ex, ey]], { stroke: rgba(c, .35), lwPx: 70 }); line([[hx, hy], [ex, ey]], { stroke: rgba(c, .9), lwPx: 18 }); });
      X.restore(); }
    camEnd();
    flash(.35 * kick(t, w('b5', 0), 6), '#FFF6D0');
  }

  // 106.3–108.65 · seven waterspouts rise around the bay, one per sung word; rainbow light building.
  function sevenSeas(t, lt) {
    const M = RVT_MOOD.storm, glow = seg(t, 106.4, 108.65);
    cam(t, 1.0 - .05 * glow, 3 + 5 * bp(t, 5));
    bay(t, M, { horizon: 520, land: false, cloudSpeed: 90 });
    X.save(); X.globalCompositeOperation = 'lighter'; circle(W / 2, 560, 200 + 500 * glow, { fill: radGrad(W / 2, 560, 20, 200 + 500 * glow, [[0, rgba('#FFF6D0', .8 * glow)], [.5, rgba('#7FE3FF', .4 * glow)], [1, rgba('#C79BFF', 0)]]), stroke: null }); X.restore();
    const times = RVT_LINE.b6[3], xs = [200, 1720, 480, 1440, 760, 1160, 960];
    xs.forEach((x, i) => rvtWaterspout(x, 600 + (i % 2) * 30, 520 - (i === 6 ? 0 : 60), t, easeOut(seg(t, times[i] - .05, times[i] + .5)), { w1: i === 6 ? 200 : 130 }));
    camEnd();
  }

  // 108.65–110.0 · SPLOOSH! SPLASH! BOOM! King Neptune bursts out of the sea, taller than the Acropolis.
  function titanRise(t, lt) {
    const M = RVT_MOOD.storm, up = easeOut(seg(t, L.sploosh, L.sploosh + .6)), boom = kick(t, L.boom, 4);
    cam(t, .92 + .06 * boom, 6 + 26 * kick(t, L.sploosh, 4) + 20 * boom, 0, W / 2, H / 2);
    bay(t, t > L.boom ? RVT_MOOD.sunset : M, { horizon: 640, shore: 520, acroW: 520, acroX: 200, land: true });
    if (t > L.boom) { X.save(); X.globalAlpha = seg(t, L.boom, L.boom + .5); [['#FF6A8A', 0], ['#FFC94A', 1], ['#7CE07A', 2], ['#6FD3FF', 3], ['#C79BFF', 4]].forEach(([c, i]) => { X.beginPath(); X.arc(1250, 900, 900 - i * 40, Math.PI, TAU); X.lineWidth = 40; X.strokeStyle = rgba(c, .6); X.stroke(); }); X.restore(); }
    rvtWaterColumn(1250, 900, 560, 1100, t, seg(t, L.sploosh, L.sploosh + .3) * (1 - seg(t, L.splash, L.splash + .6)));
    nep(1250, lerp(1700, 1020, up), 5.0, { sit: 1, trident: true, power: 1, flip: true, eyes: t > L.boom ? 'smug' : 'wide', brows: t > L.boom ? 'smug' : 'up', mouth: t > L.boom ? 'grin' : 'open', headTilt: .25, tridentAng: -1.5, crownTilt: .15 * boing(t, L.boom, 3, 3) });
    seaFront(t, 900, t > L.boom ? RVT_MOOD.sunset : M);
    rvtSplash(1250, 880, 700, t - L.splash);
    camEnd();
    sfx('SPLOOSH!', 520, 280, 150, '#BFF3FF', t - L.sploosh, { life: .45 });
    sfx('SPLASH!', 1500, 240, 140, '#BFF3FF', t - L.splash, { life: .5 });
    sfx('BOOM!', W / 2, 200, 200, '#FFE27A', t - L.boom, { life: .7 });
    flash(.7 * boom, '#FFFDF0');
  }

  // ============================== BATTLE ==============================
  const BAT = RVT_MOOD.sunset;
  // 110.0–112.0 · "Bow before King Neptune!" the tiny citizens bow… "you don't have to bow" — they pop back up.
  function bowBefore(t, lt) {
    const okT = w('n2', 0);
    cam(t, 1.0 + .03 * lt / 2, 2 + 2 * bp(t, 6), 0, W / 2, H / 2 - 30);
    bay(t, BAT, { horizon: 600, shore: 640, acroX: 220, acroW: 500 });
    const wave = t > okT ? Math.sin((t - okT) * 9) : 0;
    nep(1260, 1080, 4.6, { sit: 1, trident: true, flip: true, eyes: t > okT ? 'happy' : 'smug', brows: t > okT ? 'up' : 'smug', mouth: sing('neptune', t, t > okT ? 'grin' : 'smirk'), headTilt: t > okT ? .1 : .4, crownTilt: .15 * Math.sin(t * 4), flipNear: t > okT ? -1.2 + .5 * wave : 0, power: .3 });
    seaFront(t, 930, BAT, { x0: 640 });
    for (let i = 0; i < 9; i++) { const x = 70 + i * 62, bow = t < okT ? ease(seg(t, 110.1 + i * .03, 110.5 + i * .03)) : 1 - ease(seg(t, okT + .1, okT + .35));
      stu(SEEDS[i], x, 990, 1.3, { lean: 1.0 * bow, dy: 2 * bow, jump: t > okT ? 1.2 * Math.sin(seg(t, okT + .1, okT + .5) * Math.PI) : 0, eyes: t > okT ? 'happy' : 'closed', mouth: t > okT ? 'grin' : 'flat', flip: false, lookX: 1 }); }
    camEnd();
  }

  // 112.0–115.8 · Neptune rides a giant wave into the bay toward the robot; the robot turns, eyes red.
  function surf(t, lt) {
    const u = ease(seg(t, 112.0, 115.6));
    cam(t, 1.0, 3 + 4 * bp(t, 5), 0, W / 2 - 80 * u, H / 2);
    bay(t, BAT, { horizon: 560, shore: 700, acroX: 260, acroW: 460 });
    const turnK = ease(seg(t, 113.0, 113.6));
    robo(470, 930, 3.4, { red: turnK, eyes: 'open', brows: turnK > .5 ? 'angry' : 'quizzical', mouth: turnK > .5 ? 'teeth' : 'o', turn: lerp(-.4, .5, turnK), lookX: lerp(-.8, 1, turnK), hatch: .3, emote: turnK < .5 ? '?' : undefined, emoteK: 1 });
    const nx = lerp(1850, 1250, u), ny = 760 + 20 * Math.sin(t * 3);
    rvtWave(nx + 100, 900, 330, t, { dir: -1 });
    nep(nx, ny, 3.2, { swim: 0, sit: .55, flip: true, trident: true, tridentAng: -2.4, eyes: 'smug', brows: 'angry', mouth: sing('neptune', t, 'grin'), headTilt: .1, power: .5, crownTilt: .1 });
    seaFront(t, 900, BAT, { x0: 700 });
    camEnd();
  }

  // 115.8–118.2 · Neptune close: a wink on "fin-tastic", a sparkle, the trident crackles.
  function finTastic(t, lt) {
    const winkT = w('n5', 1);
    cam(t, 1.02 + .04 * lt / 2.4, 1 + 2 * bp(t, 6));
    rvtSunburst(W / 2, 540, t, '#6FC3EE', '#9EDDF8', 20, .2);
    const A = nep(1000, 1160, 5.0, { sit: 1, flip: true, trident: true, power: .8, eyes: t > winkT && t < winkT + .7 ? 'wink' : 'smug', brows: 'up', mouth: sing('neptune', t, 'grin'), headTilt: .15, tridentAng: -1.5, point: t > winkT ? 1 : 0, pointAng: -.3 });
    if (t > winkT) { const k = seg(t, winkT, winkT + .6); X.save(); X.translate(A.head[0] - 150, A.head[1] - 120); X.rotate(k * 3); X.scale(1 - k * .5, 1 - k * .5); shape(starPts(0, 0, 90, .25, 4), { fill: '#FFFDF0', stroke: RVT.ink, lwPx: 4 }); X.restore(); }
    camEnd();
  }

  // 118.2–121.7 · beam against beam: the vacuum vs. the rainbow water blast, pushing back and forth.
  function beamClash(t, lt) {
    cam(t, 1.0, 5 + 5 * bp(t, 5));
    bay(t, BAT, { horizon: 560, shore: 760, acroX: 260, acroW: 420 });
    const mx = 980 + 160 * Math.sin((t - 118.2) * 2.4) + 40 * Math.sin(t * 13), my = 560;
    const R = robo(420, 960, 3.6, { red: 1, brows: 'angry', mouth: 'teeth', hatch: 1, turn: .5, lookX: 1, handL: [-6.4, -15], handR: [6.6, -15], handPoseL: 'claw', handPoseR: 'claw', lean: -.06 });
    rvtVortex(R.hatch[0], R.hatch[1], mx, my, 120, 300, t, 1);
    const N = nep(1520, 1000, 3.6, { sit: 1, flip: true, trident: true, power: 1, tridentAng: -2.6, brows: 'angry', mouth: sing('neptune', t, 'grin'), eyes: 'glow' });
    neptuneBlast(N.tridentTip[0], N.tridentTip[1], mx, my, .55, t, 70);
    for (let i = 0; i < 14; i++) { const a = hash(i + Math.floor(t * 20)) * TAU, d = 60 + 120 * hash(i * 3 + Math.floor(t * 20)); line([[mx, my], [mx + Math.cos(a) * d, my + Math.sin(a) * d]], { stroke: i % 2 ? '#FFE97A' : '#FFFFFF', lwPx: 5 }); }
    circle(mx, my, 70 + 20 * Math.sin(t * 30), { fill: 'rgba(255,255,240,.85)', stroke: null });
    seaFront(t, 920, BAT, { x0: 760 });
    camEnd();
  }

  // 121.7–124.45 · the robot close, red, full power: the vacuum starts drinking Neptune's water.
  function roboClean(t, lt) {
    cam(t, 1.02 + .04 * lt / 2.7, 4 + 10 * bp(t, 4));
    rvtSunburst(W / 2, 400, t, '#7A1A2A', '#A9302A', 18, -.25);
    const A = robo(W / 2, 1560, 6.0, { red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), hatch: 1, handL: [-6.4, -16], handR: [6.4, -16], handPoseL: 'claw', handPoseR: 'claw', steam: .8, jump: .2 * bp(t) });
    for (let i = 0; i < 30; i++) { const u = frac(hash(i) - t * 1.4), a = hash(i * 3) * TAU + u * 4, r = (1 - u) * 900;
      line([[A.hatch[0] + Math.cos(a) * r, A.hatch[1] + Math.sin(a) * r * .7], [A.hatch[0] + Math.cos(a + .3) * (r - 80), A.hatch[1] + Math.sin(a + .3) * (r - 80) * .7]], { stroke: i % 3 ? rgba('#7FE3FF', .8) : rgba('#FFFFFF', .9), lwPx: 8 * (1 - u) + 2 }); }
    camEnd();
  }

  // 124.45–128.05 · ERROR! MALFUNCTION! the chest bulges with citizens and seawater; sparks, steam, X eyes.
  function overload(t, lt) {
    const err = w('r4', 0);
    cam(t, 1.0, 6 + 10 * Math.abs(Math.sin(t * 20)) * seg(t, err, err + .3));
    rvtSunburst(W / 2, 540, t, '#2A0A14', '#4A0A1A', 16, .4);
    const rattle = .12 + .1 * Math.abs(Math.sin(t * 18));
    const A = robo(W / 2, 1100, 4.0, { red: 1, glitch: seg(t, err, err + .2), steam: 1, eyes: frac(t * 2.5) < .5 ? 'x' : 'squint', brows: 'worried', mouth: roboMouth(t, 'frown'), hatch: rattle, jump: .3 * Math.abs(Math.sin(t * 16)), tilt: .08 * Math.sin(t * 11), handL: [-6, -18], handR: [6.4, -10], handPoseL: 'claw', handPoseR: 'open', emote: 'oil', emoteK: 1, sq: .04 * Math.sin(t * 24) });
    // hands and feet waving out of the rattling hatch, water squirting from the seams
    for (let i = 0; i < 6; i++) { const a = t * 6 + i; const hx = A.hatch[0] + 140 + 30 * Math.sin(a), hy = A.hatch[1] - 120 + i * 50; circle(hx, hy, 18, { fill: ['#F3C6A8', '#C58D73', '#E5B393'][i % 3], stroke: RVT.ink, lwPx: 3 }); }
    [[-1, -.6], [1, -.6], [-1, .3], [1, .3]].forEach(([sd, dy], i) => { const x0 = A.chest[0] + sd * 200, y0 = A.chest[1] + dy * 200;
      for (let j = 0; j < 6; j++) { const u = frac(t * 2 + j / 6 + i * .3); circle(x0 + sd * u * 260, y0 - 120 * u + 300 * u * u, 10 + 6 * (1 - u), { fill: '#BFF3FF', stroke: '#2E6FA0', lwPx: 2 }); } });
    for (let i = 0; i < 8; i++) { const k = hash(i + Math.floor(t * 12)); if (k > .6) rvtLightning(A.head[0] + (hash(i * 3) - .5) * 400, A.head[1] - 200, A.head[0] + (hash(i * 5) - .5) * 300, A.head[1] + 100, i * 7 + Math.floor(t * 12), 4, '#FFE97A', .9); }
    camEnd();
    sfx('ERROR!', 360, 300, 120, '#FF5A5A', t - err, { rot: -.12, life: 1.2 });
  }

  // 128.05–129.85 · CRACK! ZAP! KA-CHUNK! three panels slam in.
  function crackZap(t, lt) {
    cam(t, 1.0, 10 * (kick(t, L.crack, 6) + kick(t, L.zap, 6) + kick(t, L.kachunk, 6)));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: RVT.black, stroke: null });
    const panels = [[[0, 0], [700, 0], [560, H], [0, H]], [[720, 0], [1280, 0], [1140, H], [580, H]], [[1300, 0], [W, 0], [W, H], [1160, H]]];
    const T3 = [L.crack, L.zap, L.kachunk];
    panels.forEach((pp, i) => { const k = easeOut(seg(t, T3[i] - .12, T3[i])); if (k <= 0) return;
      X.save(); X.translate(0, (1 - k) * -H); tracePath(pp, true); X.clip();
      if (i === 0) { rvtSunburst(320, 500, t, '#2A6AA8', '#3E8FD0', 14, .5); const N = nep(380, 1150, 4.0, { sit: 1, flip: true, trident: true, power: 1, tridentAng: -1.9, brows: 'angry', mouth: 'grin', eyes: 'glow' }); rvtLightning(N.tridentTip[0], N.tridentTip[1], 700, 200, 3, 10, '#FFF6A0', 1); }
      if (i === 1) { rvtSunburst(930, 500, t, '#7A2A14', '#B8481A', 14, -.5); robo(930, 1350, 5.0, { red: 1, glitch: 1, eyes: 'x', brows: 'worried', mouth: 'frown', hum: false }); for (let j = 0; j < 5; j++) rvtLightning(700 + j * 110, 120, 760 + j * 100, 520, j * 4 + Math.floor(t * 18), 5, '#FFE97A', 1); }
      if (i === 2) { rvtSunburst(1600, 500, t, '#5A4A54', '#7A6A74', 14, .5); const pop = seg(t, L.kachunk, L.kachunk + .4);
        shape(rectPts(1300, 220, 600, 640), { fill: RVT.steel, stroke: RVT.ink, lwPx: 8 }); shape(rectPts(1380, 300, 440, 480), { fill: '#3A2A34', stroke: RVT.ink, lwPx: 6 });
        X.save(); X.translate(1600 + pop * 300, 540 - pop * 400 + pop * pop * 500); X.rotate(pop * 8); shape(rectPts(-60, -30, 120, 60), { fill: RVT.brass, stroke: RVT.ink, lwPx: 6 }); circle(0, 0, 14, { fill: RVT.steelDk, stroke: RVT.ink, lwPx: 3 }); X.restore(); }
      X.restore(); line(pp.concat([pp[0]]), { stroke: RVT.cream, lwPx: 12 });
    });
    camEnd();
    sfx('CRACK!', 330, 260, 150, '#FFF6A0', t - L.crack, { life: 1.6 }); sfx('ZAP!', 930, 820, 160, '#FFE97A', t - L.zap, { life: 1.3 }); sfx('KA-CHUNK!', 1580, 900, 120, '#FFD07A', t - L.kachunk, { life: .8 });
  }

  // 129.85–134.0 · a crack of the trident, then a tail-slap that spins the robot's head round; the tin can wobbles.
  function tailSlap(t, lt) {
    const crackT = w('n7', 2), flipT = w('n7', 9), hitT = flipT + .25;
    cam(t, 1.0, 4 + 20 * kick(t, hitT, 4) + 10 * kick(t, crackT, 5));
    bay(t, BAT, { horizon: 560, shore: 760, acroX: 260, acroW: 420 });
    const spin = t > hitT ? seg(t, hitT, hitT + 1.2) : 0, wobble = t > hitT ? Math.sin((t - hitT) * 7) * Math.exp(-(t - hitT) * .6) : 0;
    const R = robo(620, 960, 3.6, { red: 1, glitch: .5, steam: .6, eyes: t > hitT ? 'x' : 'open', brows: 'worried', mouth: t > hitT ? 'frown' : 'teeth', turn: t > hitT ? Math.cos(spin * TAU * 2) : .4, tilt: .3 * wobble, lean: .1 * wobble, hatch: .2, handL: [-6, -14], handR: [6, -10], handPoseL: 'claw', handPoseR: 'open' });
    const lunge = ease(seg(t, flipT - .4, hitT)) * (1 - ease(seg(t, hitT + .3, hitT + 1)));
    const N = nep(lerp(1420, 1080, lunge), 1000, 3.6, { sit: lerp(1, .3, lunge), flip: true, trident: true, rot: -1.6 * lunge, wag: 1.2 * lunge, power: 1, brows: 'angry', mouth: sing('neptune', t, 'grin'), eyes: 'glow', tridentAng: -2.3 });
    if (t > crackT && t < crackT + .5) rvtLightning(N.tridentTip[0], N.tridentTip[1], R.head[0], R.head[1], 11, 9, '#FFF6A0', 1 - seg(t, crackT, crackT + .5));
    if (t > hitT) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; shape(starPts(R.head[0] + Math.cos(a) * 160, R.head[1] - 150 + Math.sin(a) * 40, 30, .45, 5, a), { fill: '#FFE27A', stroke: RVT.ink, lwPx: 3 }); }
    seaFront(t, 920, BAT, { x0: 760 });
    camEnd();
    sfx('CRACK!', R.head[0] + 200, R.head[1] - 260, 120, '#FFF6A0', t - crackT, { life: .8 });
    sfx('WHAP!', R.head[0], R.head[1] - 300, 160, '#FFD07A', t - hitT, { life: 1.1 });
  }

  // 134.0–138.15 · the hatch blows open: citizens pour out and float down in bubbles; the robot powers down and topples.
  function burst(t, lt) {
    const pop = w('n9', 3), off = 136.3, fall = seg(t, 136.8, 137.6), splashT = 137.6;
    cam(t, .95 + .04 * kick(t, pop, 4), 4 + 22 * kick(t, pop, 4) + 18 * kick(t, splashT, 4));
    bay(t, BAT, { horizon: 560, shore: 560, acroX: 200, acroW: 380 });
    const R = robo(860, 980 + 300 * easeIn(fall), 3.8, { red: t < off ? 1 : 0, eyes: t < off ? 'wide' : 'off', brows: 'up', mouth: t < off ? 'O' : 'flat', hatch: t > pop ? 1 : .2, rot: -1.3 * easeIn(fall), hum: t < off, antenna: .8 * seg(t, off, off + .4), dy: .8 * seg(t, off, off + .4) });
    // citizens arc out of the hatch and drift down in bubbles
    for (let i = 0; i < 16; i++) { const t0 = pop + i * .08, u = t - t0; if (u < 0) continue;
      const a = -Math.PI / 2 + (hash(i) - .5) * 2.2, sp = 700 + 400 * hash(i * 3), dec = Math.min(u, .7);
      const x = R.hatch[0] + Math.cos(a) * sp * dec + (u - dec) * 60 * Math.sin(i), y = R.hatch[1] + Math.sin(a) * sp * dec + 400 * dec * dec + Math.max(0, u - .7) * 70;
      stu(SEEDS[i % SEEDS.length], x, y + 60, 1.2, { eyes: u > .7 ? 'happy' : 'wide', mouth: u > .7 ? 'grin' : 'O', ...KID.danny.up, rot: u < .7 ? u * 6 * (i % 2 ? 1 : -1) : .1 * Math.sin(t * 2 + i), breathe: 0 });
      if (u > .45) rvtBubble(x, y - 10, 90, t, { fill: .18 }); }
    const N = nep(1560, 1020, 3.6, { sit: 1, flip: true, trident: true, power: .8, tridentAng: -1.4, brows: 'up', eyes: 'happy', mouth: sing('neptune', t, 'grin') });
    for (let i = 0; i < 10; i++) { const u = frac(hash(i) + t * .6); rvtBubble(N.tridentTip[0] - u * 700, N.tridentTip[1] + 60 - u * 200 + 40 * Math.sin(t * 3 + i), 16 + 10 * hash(i), t); }
    seaFront(t, 940, BAT, { x0: 560 });
    rvtSplash(860, 940, 800, t - splashT);
    camEnd();
    sfx('KA-BOOM!', 860, 300, 170, '#FFE27A', t - pop, { life: 1.1 });
    sfx('SPLOOSH!', 900, 420, 160, '#BFF3FF', t - splashT, { life: .9 });
    flash(.5 * kick(t, pop, 6), '#FFFDF0');
  }

  // ============================== FINAL CHORUS ==============================
  const GOLD = RVT_MOOD.gold;
  // the powered-down robot sitting in the bay, with a rubber duck and a gull on his head
  function sittingRobo(x, y, k, t) {
    const A = robo(x, y, k, { eyes: 'closed', mouth: 'smile', red: 0, hum: false, dy: 1, tilt: .1, antenna: .6, handL: [-4.4, -8], handR: [4.4, -8] });
    bird(A.top[0] + 20, A.top[1] - 10 - 6 * Math.abs(Math.sin(t * 3)), 40, t, 1, '#FFFFFF');
    return A;
  }
  // 138.15–141.8 · golden morning: the robot powered down in the bay with a rubber duck; Neptune poses; the kids cheer.
  function dayWon(t, lt) {
    cam(t, 1.0 + .03 * lt / 3.6, 2 + 3 * bp(t, 6));
    bay(t, GOLD, { horizon: 560, shore: 560, acroX: 220, acroW: 420, sunAt: [1500, 240] });
    sittingRobo(980, 1060, 3.0, t);
    nep(1420, 960, 3.2, { sit: 1, flip: true, trident: true, tridentAng: -1.4 - .3 * bp(t, 4), eyes: 'smug', brows: 'smug', mouth: sing('neptune', t, 'grin'), headTilt: .3, crownTilt: .1 * Math.sin(t * 3), flex: 1 });
    seaFront(t, 890, GOLD, { x0: 560 });
    rvtDuck(1160, 930, 9, t);
    shape([[-40, 900], [700, 900], [760, H + 40], [-40, H + 40]], { fill: RVT.marble, stroke: RVT.ink, lwPx: 4 });
    for (let i = 1; i < 4; i++) line([[-40, 900 + i * 55], [700 + i * 15, 900 + i * 55]], { stroke: RVT.marbleSh, lwPx: 5 });
    [['housam', 120], ['alma', 280], ['jenna', 440], ['danny', 600]].forEach(([id, x], i) => kid(id, x, 980, 2.3, { ...KID[id].up, eyes: 'happy', mouth: sing(id, t, 'grin'), jump: .9 * bp(t + i * .06, 5) }));
    camEnd();
    rvtConfetti(t, 138.15, 50);
  }

  // 141.8–145.65 · in the agora the bubbles land and pop; the citizens hug and dance.
  function freed(t, lt) {
    const P = persp({ x: 20 * Math.sin(t * .4), y: 210, z: -180, f: 820, hy: 560 });
    cam(t, 1.0 + .02 * bp(t), 1 + 2 * bp(t, 6));
    const acts = [];
    for (let i = 0; i < 10; i++) { const x = -520 + (i % 5) * 260 + (i > 4 ? 130 : 0), z = i > 4 ? 640 : 380, land = 142.0 + i * .25, popT = land + .2;
      acts.push({ z, draw: () => { const [sx, sy, k] = P.p(x, 0, z), u = seg(t, land - 1.2, land), yy = sy - (1 - easeOut(u)) * 500;
        const danceO = t > popT ? { ...((beatN(t) + i) % 2 ? KID.danny.up : { handL: [-4.4, -12], handR: [4.4, -12] }), eyes: 'happy', mouth: 'grin', jump: .6 * bp(t, 5) } : { eyes: 'wide', mouth: 'o', ...KID.danny.scared };
        stu(SEEDS[i], sx, yy, k, { ...danceO, flip: i % 2 === 1 });
        if (t < popT) rvtBubble(sx, yy - 70 * k, 95 * k, t, { fill: .2 });
        else if (t < popT + .4) { const a = seg(t, popT, popT + .4); for (let j = 0; j < 8; j++) { const an = j / 8 * TAU; circle(sx + Math.cos(an) * 100 * k * (1 + a), yy - 70 * k + Math.sin(an) * 100 * k * (1 + a), 6 * k * (1 - a), { fill: '#DDF8FF', stroke: null }); } }
      } }); }
    stage(AT, P, t, acts, { birds: 1 });
    camEnd();
    rvtConfetti(t, 141.0, 30);
  }

  // 145.65–149.75 · the kids ride on Neptune's back across the bay.
  function rideWave(t, lt) {
    cam(t, 1.0, 2 + 3 * bp(t, 6));
    const scroll = (t - 145.65) * 300;
    bay(t, GOLD, { horizon: 520, land: false, sunAt: [1600, 240] });
    rvtAcropolis(400 - scroll * .15, 528, 420, GOLD);
    const nx = 960 + 40 * Math.sin(t * 1.3), ny = 900 + 18 * Math.sin(t * 3), k = 3.4, s = NT_UNIT * k;
    for (let i = 0; i < 12; i++) { const u = frac(i / 12 + t * 1.2); circle(nx - 600 - u * 600, ny - 20 - 60 * Math.sin(u * Math.PI), 18 * (1 - u) + 6, { fill: RVT.foam, stroke: '#2E6FA0', lwPx: 2 }); }
    // the kids ride along his back (screen offsets measured against his flat swimming pose)
    const RIDE = [['danny', -.30], ['jenna', -.13], ['alma', .04], ['housam', .2]];
    nep(nx, ny, k, { swim: .6, eyes: 'happy', mouth: sing('neptune', t, 'grin'), crownTilt: .1 * Math.sin(t * 2), headTilt: .15 });
    RIDE.forEach(([id, f], i) => { const bx = nx + f * 23 * s, by = ny - (6.2 - 3.5 * Math.abs(f)) * s + 10 * Math.sin(t * 3 + i);
      kid(id, bx, by, 2.0, { ...(i % 2 ? KID[id].up : KID[id].point), eyes: 'happy', mouth: sing(id, t, 'grin'), hairSwing: .5 * Math.sin(t * 4 + i), lean: -.1 }); });
    seaFront(t, 960, GOLD);
    camEnd();
  }

  // 149.75–154.15 · everyone in a Greek line dance on Alma's rainbow floor, kicking on the beats.
  function sirtaki(t, lt) {
    cam(t, 1.0, 1 + 3 * bp(t, 6), 0, W / 2, H / 2);
    rvtSunburst(W / 2, 360, t, '#FFC870', '#FFE0A0', 24, .2);
    shape(rectPts(-40, 860, W + 80, 260), { fill: '#EFE4CC', stroke: null });
    for (let i = 0; i < 14; i++) { const c = ['#FF6A8A', '#FFC94A', '#7CE07A', '#6FD3FF', '#C79BFF'][(i + beatN(t)) % 5]; shape([[i * 150 - 100, 880], [i * 150 + 50, 880], [i * 150 + 90, 1080], [i * 150 - 140, 1080]], { fill: rgba(c, .5 + .3 * bp(t)), stroke: null }); }
    const b = beatN(t), kickL = b % 2 === 0, kk = bp(t, 5), stepX = ((t - 149.75) * 40) % 80;
    const line9 = [['housam'], ['jenna'], ['safadi'], ['neptune'], ['sami'], ['alma'], ['danny']];
    line9.forEach(([who, seed], i) => { const x = 200 + i * 255 - stepX, y = 960, kick2 = kickL === (i % 2 === 0) ? kk : 0;
      const legs = { footL: kickL ? [-2.8, -4 * kick2] : [-1.2, -.8], footR: !kickL ? [2.8, -4 * kick2] : [1.2, -.8] };
      if (who === 'neptune') nep(x, y + 10, 1.8, { sit: 1, flip: i % 2 === 1, eyes: 'happy', mouth: 'laugh', dy: .6 * kk, flipNear: -1 });
      else if (who === 'safadi' || who === 'sami') twin(who, x, y, 2.0, { ...legs, handL: [-6.2, -15], handR: [6.2, -15], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', mouth: 'grin', power: who === 'safadi' ? .2 : 0 });
      else if (who === 'stu') stu(seed, x, y, 1.6, { ...legs, handL: [-5.4, -14], handR: [5.4, -14], eyes: 'happy', mouth: 'grin' });
      else kid(who, x, y, 2.3, { ...legs, ...(who === 'alma' ? { power: 1, handL: [-5, -9.5], handR: [5, -9.5] } : { handL: [-5.4, -15], handR: [5.4, -15] }), eyes: 'happy', mouth: sing(who, t, 'grin'), hairSwing: .3 * Math.sin(t * 6) });
    });
    camEnd();
    rvtConfetti(t, 149.0, 40);
  }

  // 154.15–157.8 · the story paints itself onto a new amphora.
  function newVase(t, lt) {
    cam(t, 1.0 + .05 * lt / 3.65, 1);
    rvtTerracotta(t); rvtMeander(0, 70, RVT.black, RVT.terraDk, t * 40); rvtMeander(H - 70, 70, RVT.black, RVT.terraDk, -t * 40);
    const rev = ease(seg(t, 154.3, 157.0));
    rvtVase(W / 2, 540, 68, t, { panel: () => { const cx = W / 2, gy = 540 + 230;
      X.save(); X.beginPath(); X.rect(cx - 330, 0, 660 * rev, H); X.clip();
      rvtBlackFigure(() => {
        robo(cx - 220, gy + 110, 1.6, { eyes: 'closed', dy: 1, tilt: .1, hum: false, breathe: 0, handL: [-4.4, -8], handR: [4.4, -8] });
        for (let i = 0; i < 8; i++) rvtWave(cx - 320 + i * 80, gy + 70, 40, 0);
        nep(cx + 30, gy - 30, 1.7, { sit: 1, flip: true, trident: true, tridentAng: -1.5, headTilt: .3 });
        KIDS.forEach((id, i) => kid(id, cx + 160 + i * 45, gy, .6, { ...KID[id].up, breathe: 0 }));
      });
      X.restore();
      if (rev < 1) { const bx = cx - 330 + 660 * rev; line([[bx, gy - 380], [bx + 20, gy - 340]], { stroke: RVT.black, lwPx: 14 }); }
    } });
    camEnd();
  }

  // 157.8–161.25 · night over Athens: stars join into a dolphin constellation; fireworks.
  function legend(t, lt) {
    cam(t, 1.0 + .03 * lt / 3.45, 1, 0, W / 2, H / 2 + 20 * lt / 3.45);
    rvtSkyline(t, RVT_MOOD.night, { horizon: 860, acroX: 960, acroW: 900, sun: false });
    const D = [[620, 420], [700, 330], [820, 280], [960, 270], [1080, 300], [1180, 250], [1230, 320], [1160, 360], [1060, 390], [940, 420], [860, 470], [760, 520], [640, 560], [560, 500], [620, 420]];
    const k = seg(t, 157.9, 160.2);
    X.save(); X.globalCompositeOperation = 'lighter';
    line(polySlice(D, 0, k), { stroke: 'rgba(170,220,255,.6)', lwPx: 4 });
    D.forEach((p, i) => { if (i / (D.length - 1) <= k + .02) { const tw = .7 + .3 * Math.sin(t * 6 + i); shape(starPts(p[0], p[1], 18 * tw, .3, 4), { fill: '#FFFDF0', stroke: null }); } });
    if (k >= 1) { const cr = [1000, 200], g = seg(t, 160.2, 160.6); shape([[cr[0] - 50, cr[1] + 20], [cr[0] - 40, cr[1] - 30], [cr[0] - 15, cr[1]], [cr[0], cr[1] - 40], [cr[0] + 15, cr[1]], [cr[0] + 40, cr[1] - 30], [cr[0] + 50, cr[1] + 20]].map(([x, y]) => [x, y]), { fill: rgba('#FFD66B', .7 * g), stroke: rgba('#FFE9A0', g), lwPx: 3 }); }
    X.restore();
    [[300, 300, 158.0, '#FF6A8A'], [1600, 260, 158.6, '#7CE07A'], [450, 220, 159.3, '#FFC94A'], [1450, 380, 159.9, '#6FD3FF'], [960, 160, 160.5, '#C79BFF']].forEach(([x, y, t0, c]) => rvtFirework(x, y, t, t0, c, 170));
    camEnd();
  }

  // ============================== OUTRO ==============================

  // 161.25–165.75 · sunset on the Acropolis steps: Safadi lectures, finger up; the robot sits in the bay behind.
  function remember(t, lt) {
    const M = RVT_MOOD.sunset;
    cam(t, 1.0 + .04 * lt / 4.5, 1);
    bay(t, M, { horizon: 520, land: false, sunAt: [1400, 400] });
    sittingRobo(1500, 740, 1.4, t); rvtDuck(1620, 690, 4, t);
    seaFront(t, 690, M, { x0: 1200 });
    shape([[-40, 720], [W + 40, 720], [W + 40, H + 40], [-40, H + 40]], { fill: rvtTint(RVT.marble, M), stroke: RVT.ink, lwPx: 4 });
    for (let i = 1; i < 6; i++) line([[-40, 720 + i * 70], [W + 40, 720 + i * 70]], { stroke: rvtTint(RVT.marbleSh, M), lwPx: 6 });
    rvtColumn(140, 1080, 900, 140, M); rvtColumn(W - 140, 1080, 900, 140, M, { broken: true });
    twin('safadi', 760, 900, 3.2, { eyes: 'open', brows: 'up', mouth: sing('safadi', t, 'smile'), handR: [5.2, -24], handPoseR: 'point', handL: [-4.4, -11], power: .25 });
    [['housam', 1120, 940], ['alma', 1280, 990], ['jenna', 1440, 950], ['danny', 1580, 1000]].forEach(([id, x, y], i) => kid(id, x, y, 2.0, { eyes: 'open', lookX: -.8, mouth: 'smile', tilt: .04 * Math.sin(t + i) }));
    camEnd();
  }

  // 165.75–168.75 · the kids happily sweep up the agora themselves.
  function sweepUp(t, lt) {
    const P = persp({ x: 0, y: 200, z: -260, f: 900, hy: 560 });
    cam(t, 1.0, 1 + 2 * bp(t, 6));
    const acts = [['housam', -260, 300], ['alma', -80, 260], ['jenna', 100, 290], ['danny', 280, 250]].map(([id, x, z], i) => ({ z, draw: () => {
      const [sx, sy, k] = P.p(x, 0, z), sw = Math.sin(t * 6 + i * 1.3);
      const A = kid(id, sx, sy, k, { handL: [-1.5 + 2 * sw, -11], handR: [1.5 + 2 * sw, -6], handPoseL: 'fist', handPoseR: 'fist', lean: .1, eyes: 'happy', mouth: sing(id, t, 'grin'), lookY: .7 });
      rvtBroom(A.handR[0], A.handR[1], KID[id].U * k * .9, -.2 + .45 * sw);
      rvtDust(A.handR[0] + 60 * k * sw, sy, 60 * k, frac(t * .9 + i * .3) * 1.2);
    } }));
    stage(AT, P, t, acts, {});
    camEnd();
  }

  // 168.75–170.0 · "…YOU!": Safadi points straight down the lens.
  function byYou(t, lt) {
    const you = w('o2', 8), pk = easeOut(seg(t, you - .15, you + .1));
    cam(t, 1.0 + .25 * pk, 6 * kick(t, you, 6));
    rvtSunburst(W / 2, 480, t, '#D9483A', '#FFB24A', 22, .3);
    if (t > you) rvtSpeedLines(W / 2, 480, t, rgba('#FFF6D0', .6), 40, 420);
    twin('safadi', W / 2, 1260, 5.2, { eyes: 'wide', brows: 'up', mouth: sing('safadi', t, 'grin'), handR: mixPt([4.4, -12], [6.4, -18], pk), handPoseR: 'point', handL: [-4.4, -11], power: .4 * pk });
    camEnd();
  }

  // 170.0–171.7 · "And of course, knowing oneself!": hand on heart; the kids roll their eyes.
  function oneself(t, lt) {
    const M = RVT_MOOD.sunset;
    cam(t, 1.0, 0);
    bay(t, M, { horizon: 520, land: false, sunAt: [1400, 400] });
    shape([[-40, 720], [W + 40, 720], [W + 40, H + 40], [-40, H + 40]], { fill: rvtTint(RVT.marble, M), stroke: RVT.ink, lwPx: 4 });
    twin('safadi', 640, 1000, 3.4, { eyes: 'closed', brows: 'up', mouth: sing('safadi', t, 'smile'), handR: [1.0, -14], handPoseR: 'open', handL: [-5.4, -14], handPoseL: 'palm', tilt: .08, power: .2 });
    const roll = seg(t, 170.9, 171.3);
    [['housam', 1060], ['alma', 1240], ['jenna', 1420], ['danny', 1600]].forEach(([id, x], i) => kid(id, x, 1000, 2.6, { eyes: 'open', lookY: -1, lookX: Math.sin(roll * Math.PI + i) * .6, brows: 'up', mouth: 'flat', tilt: -.1 * roll }));
    camEnd();
  }

  // 171.7–175.3 · Neptune pops into frame and winks; the iris closes on his starfish; THE END.
  function finTag(t, lt) {
    const M = RVT_MOOD.sunset, popIn = backOut(seg(t, 171.75, 172.1)), winkT = w('o4', 1), irisT = 173.0;
    cam(t, 1.0, 0);
    bay(t, M, { horizon: 520, land: false, sunAt: [1400, 400] });
    shape([[-40, 720], [W + 40, 720], [W + 40, H + 40], [-40, H + 40]], { fill: rvtTint(RVT.marble, M), stroke: RVT.ink, lwPx: 4 });
    twin('safadi', 520, 1000, 3.4, { eyes: 'wide', brows: 'up', mouth: 'o', handR: [1.0, -14], handL: [-5.4, -14], lookX: .8 });
    const A = nep(1280, lerp(1700, 1080, popIn), 4.2, { sit: 1, flip: true, eyes: t > winkT && t < winkT + 1.6 ? 'wink' : 'happy', brows: 'up', mouth: sing('neptune', t, 'grin'), headTilt: .2, point: t > winkT ? 1 : 0, pointAng: -.3, crownTilt: .1 * Math.sin(t * 3) });
    camEnd();
    if (t > irisT) { const k = ease(seg(t, irisT, irisT + 1.1)); iris(A.crown[0], A.crown[1], lerp(1500, 0, k)); }
    if (t > irisT + 1.15) overlay(() => { const k = easeOut(seg(t, irisT + 1.2, irisT + 1.7)); X.save(); X.globalAlpha = k; X.translate(W / 2, H / 2); X.scale(.8 + .2 * k, .8 + .2 * k);
      X.font = `140px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 26; X.strokeStyle = '#000'; X.strokeText('THE END', 0, 0); X.fillStyle = '#6FD3FF'; X.fillText('THE END', 0, 0); X.restore(); });
  }

  // ---------- assembly: every shot gets the karaoke on top, and the chapter breaks get a water wipe ----------
  const WIPES = [[61.6, 1], [108.65, -1], [138.15, 1], [161.25, -1]];
  const withTop = fn => { const g = (t, lt, dur) => { fn(t, lt, dur); for (const [tc, d] of WIPES) if (Math.abs(t - tc) < .35) rvtWaterWipe(seg(t, tc - .35, tc + .35), d); rvtKaraoke(t); };
    Object.defineProperty(g, 'name', { value: fn.name }); return g; };
  scene({
    duration: 175.3, fps: 24, bpm: 117.5, beatOffset: RVT_BEATS[0],
    shots: [
      [0, dawn], [3.7, thud], [5.75, rise], [8.1, scatter], [9.8, vacuum], [11.95, title],
      [15.5, housamRun], [17.8, almaLook], [19.85, jennaWheel], [21.85, dannyColumn], [23.8, runToCam], [26.0, runMap],
      [27.6, gears], [29.7, sweep], [32.0, plan], [35.3, heroes],
      [38.1, vaseVS], [41.45, showdown], [45.6, cogsMyth], [49.7, colossal], [54.1, watchShow], [57.85, whoWins],
      [61.6, bathIn], [65.55, notTrouble], [69.75, sitWater], [73.45, philosophy], [77.2, gnothi], [83.0, reflect], [87.85, samiStop],
      [91.4, allRight], [95.8, titanTime], [97.85, soapSplash], [100.05, entrance], [103.75, summon], [106.3, sevenSeas], [108.65, titanRise],
      [110.0, bowBefore], [112.0, surf], [115.8, finTastic], [118.2, beamClash], [121.7, roboClean], [124.45, overload], [128.05, crackZap], [129.85, tailSlap], [134.0, burst],
      [138.15, dayWon], [141.8, freed], [145.65, rideWave], [149.75, sirtaki], [154.15, newVase], [157.8, legend],
      [161.25, remember], [165.75, sweepUp], [168.75, byYou], [170.0, oneself], [171.7, finTag],
    ].map(([t0, fn]) => [t0, withTop(fn)]),
  });
})();
