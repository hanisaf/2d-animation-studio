// Scene 17: The Broccoli Directive. A music video cut to audio.mp3 (see README.md for the lyric map and shot list).
// Every shot paints the whole frame from t; the karaoke (lyrics.js) and the wipes go on top. Backdrops/props: halloween.js.
(() => {
  // ---------- timing: the song's beat grid and the sung words the hits are cut to ----------
  const SPB = 60 / 125.98, OFF = .104;
  const beatAt = n => OFF + n * SPB, nextBeat = t => beatAt(Math.ceil((t - OFF) / SPB - 1e-6));
  const bp = (t, k = 7) => pulse(t, k);                                   // 1 on every beat, decaying
  const L = {
    beep: 4.26, boop: 5.38, sensors: 6.44, locked: 7.56,
    night: 14.94, visual: 16.20, lock: 16.70, active: 17.22, trick: 18.58, treat: 19.82, data: 20.50, received: 20.94,
    sugar: 22.00, critical: 25.58, compliance: 26.44, protocol: 27.32, now: 27.96, fully: 28.52, engaged: 28.92,
    food: 30.18, fuel: 31.36, body: 33.04, candy: 34.40, crash: 36.02,
    eat1: 37.64, your1: 38.46, broc1: 38.88, eats1: [41.26, 42.38, 42.86, 43.30], every1: 44.38, broc1b: 46.16,
    system: 52.70, sweeps: 53.70, detect: 54.70, traces: 56.54, carbon: 57.26, units: 58.34, must: 58.94, comply: 59.22,
    green: 60.06, nutrition: 61.28, nonneg: 62.62, target: 64.62, locked2: 65.28, prepare: 66.28, pfor: 66.62, delivery: 67.12,
    eat2: 83.02, your2: 84.14, broc2: 84.62, eats2: [86.88, 88.18, 88.58, 89.02], every2: 90.18, broc2b: 91.86,
    mission: 98.26, complete: 99.66, eat3: 101.78, your3: 103.18, broc3: 103.66, every3: 105.52, eats3: 106.50, broc3b: 107.20,
  };
  const WORDS = BD_LYRICS.flatMap(([, w]) => w.map(x => x[0]));
  const singing = t => WORDS.some(w => t >= w && t < w + .34);            // Robo's mouth flaps while a word rings out
  const roboMouth = (t, rest = 'flat') => lipFlap(t, singing(t), rest, ['open', 'O', 'open', 'teeth', 'open']);

  // ---------- the cast ----------
  const KIDS = {
    housam: { draw: housam, U: HOUSAM_UNIT, hat: 'horns', run: housamDribble,
      scared: { handL: [-4.3, -15], handR: [4.3, -15], handPoseL: 'palm', handPoseR: 'palm' }, mouthHands: { handL: [-1.4, -21.2], handR: [1.4, -21.2], handPoseL: 'fist', handPoseR: 'fist' },
      laugh: { handL: [-4.1, -14.1], handR: [4.1, -14.1] }, hold: { handR: [4.3, -10.4] } },
    alma: { draw: alma, U: ALMA_UNIT, hat: 'witch', run: almaSkip,
      scared: { handL: [-1.1, -11.6], handR: [1.1, -11.6], handPoseL: 'palm', handPoseR: 'palm' }, mouthHands: { handL: [-.5, -11.9], handR: [.5, -11.9], handPoseL: 'fist', handPoseR: 'fist' },
      laugh: { handL: [-.6, -10.6], handR: [.6, -10.6], handPoseL: 'fist', handPoseR: 'fist' }, hold: { handR: [3.6, -4.6] } },
    jenna: { draw: jenna, U: JENNA_UNIT * JENNA_SCALE, hat: 'cat', run: jennaSkip,
      scared: { handL: [-1.1, -21.0], handR: [1.1, -21.0], handPoseL: 'palm', handPoseR: 'palm' }, mouthHands: { handL: [-.5, -18.2], handR: [.5, -18.2], handPoseL: 'fist', handPoseR: 'fist' },
      laugh: { handL: [-.6, -19.0], handR: [.6, -19.0], handPoseL: 'fist', handPoseR: 'fist' }, hold: { handR: [3.6, -11.2] } },
    danny: { draw: danny, U: DANNY_UNIT, hat: 'pumpkin', run: dannyDribble,
      scared: { handL: [-4.3, -14], handR: [4.3, -14], handPoseL: 'palm', handPoseR: 'palm' }, mouthHands: { handL: [-1.3, -18.4], handR: [1.3, -18.4], handPoseL: 'fist', handPoseR: 'fist' },
      laugh: { handL: [-3.5, -12.1], handR: [3.5, -12.1] }, hold: { handR: [4.3, -10.4] } },
  };
  const ORDER = ['housam', 'alma', 'jenna', 'danny'];
  // Rigs return anchors in SCREEN px (camera included). Map them back into the frame we're drawing in, so props
  // attached to a hand or head stay put under a zoomed or shaking camera.
  function loc(A) {
    const m = X.getTransform().invertSelf(), out = {};
    for (const k in A) { const p = A[k]; out[k] = Array.isArray(p) && typeof p[0] === 'number' ? [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f] : p; }
    return out;
  }
  // Draw a kid with their costume hat. k = px per world unit (so the four stay in true scale with each other and Robo).
  function kid(id, x, y, k, o = {}) {
    const K = KIDS[id], s = K.U * k / (id === 'jenna' ? JENNA_SCALE : 1);
    const A = loc(K.draw(x, y, s, o));
    if (o.hat !== false) bdHat(K.hat, A, T, { tilt: o.hatTilt });
    if (o.bucket) bdBucket(A.handR[0], A.handR[1], K.U * k * .85, { fill: o.bucket, swing: o.swing ?? .08 * Math.sin(T * 5) });
    return A;
  }
  // Where a kid's head lands for a draw at (0, 0): lets a shot put the head at a chosen screen point (close-ups).
  function kidAnchors(id, k, o = {}) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); const A = measure(() => kid(id, 0, 0, k, { ...o, bucket: 0 })); X.restore(); return A; }
  function kidHeadAt(id, hx, hy, k, o = {}) { const A0 = kidAnchors(id, k, o); return kid(id, hx - A0.head[0], hy - A0.head[1], k, o); }
  const robo = (x, y, k, o = {}) => loc(roboSafadi(x, y, ROBO_SAFADI_UNIT * k, o));
  function roboHeadAt(hx, hy, k, o = {}) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); const A0 = measure(() => robo(0, 0, k, o)); X.restore(); return robo(hx - A0.head[0], hy - A0.head[1], k, o); }
  const twin = (who, x, y, k, o = {}) => loc((who === 'safadi' ? safadi : sami)(x, y, SAFADI_UNIT * k, o));

  // A big title word: ink outline, drop shadow, slams in from `scale` 3 at time t0.
  function slamWord(txt, x, y, size, fill, t, t0, rot = 0) {
    const age = t - t0; if (age < 0) return;
    const k = age < .18 ? lerp(3, 1, easeIn(age / .18)) : 1 + .08 * boing(t, t0 + .18, 3, 6);
    X.save(); X.translate(x, y); X.rotate(rot + .04 * boing(t, t0 + .18, 2, 5)); X.scale(k, k); X.globalAlpha = clamp(age / .1);
    X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = size * .2; X.strokeStyle = BD.ink; X.strokeText(txt, size * .06, size * .08); X.fillStyle = BD.ink; X.fillText(txt, size * .06, size * .08);
    X.strokeText(txt, 0, 0); X.fillStyle = fill; X.fillText(txt, 0, 0);
    X.restore();
  }
  const shake = (t, amt) => { const [dx, dy] = shakeXY(t, amt); return [W / 2 - dx, H / 2 - dy]; };
  function cam(t, zoom = 1, amt = 0, rot = 0, cx = W / 2, cy = H / 2) { const [dx, dy] = shakeXY(t, amt); camBegin(cx - dx, cy - dy, zoom, rot); }
  function clipRect(x, y, w, h, fn) { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); try { fn(); } finally { X.restore(); } }
  // A sparkle burst (used when the broccoli appears).
  function sparkle(x, y, r, age, col = BD.greenLt) {
    if (age < 0 || age > .8) return; const k = easeOut(age / .8);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .3, d = r * (.4 + k);
      X.save(); X.globalAlpha = 1 - k; shape(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .22 * (1 - k * .5), .35, 4, a), { fill: col, stroke: BD.ink, lwPx: 2.5 }); X.restore(); }
  }
  function poof(x, y, r, age, col = '#B6F07A') {
    if (age < 0 || age > 1) return; const k = easeOut(age);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, d = r * k * .9;
      X.save(); X.globalAlpha = (1 - k) * .95; circle(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, r * (.35 + .35 * k), { fill: col, stroke: BD.ink, lwPx: 3 }); X.restore(); }
  }
  // Candy flying along a parabola from a to b over [t0, t1].
  function arcCandy(t, t0, t1, a, b, h, size, kind, i = 0) {
    const u = seg(t, t0, t1); if (t < t0 || t > t1) return;
    bdCandy(lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u), size, kind, u * 8 + i);
  }

  // ============================== the shots ==============================

  // 0–4.2 · a violet Halloween night; Robo stands dark, eyes off. Lightning, then the camera pushes onto his face.
  function nightOpen(t, lt) {
    const push = easeIn(seg(t, 3.0, 4.26)), thunder = kick(t, 1.95, 5);
    cam(t, 1 + .04 * lt + push * 2.2, 10 * thunder, 0, lerp(W / 2, 700, push), lerp(H / 2, 330, push));
    bdSky('#0E0820', '#2E1650', '#5A2A62');
    bdStars(t, 110, 2);
    bdMoon(1420, 300 - lt * 6, 150, 1 + .6 * thunder);
    bdBats(t, 7, { y: 250, s: 8, speed: 140 });
    bdHill(760, 60, '#24133D', 1, 0, 1100);
    bdHouse(1430, bdHillY(1430, 760, 60, 1, 0, 1100) + 6, 9, t);
    bdHill(900, 40, '#170C28', 2.2, 0, 800);
    [[260, 0], [520, 1], [1180, 2], [1620, 0], [1820, 1]].forEach(([x, kd], i) => bdTomb(x, bdHillY(x, 900, 40, 2.2, 0, 800) + 10, 7 + hash(i) * 3, kd, { fill: '#3A3352', dark: '#24203A', rot: (hash(i * 3) - .5) * .2 }));
    bdFog(t, 930, '#B9A4F0', .22);
    shape(rectPts(-20, 980, W + 40, 140), { fill: '#120A1E', stroke: null });
    // Robo, unlit: a dim silhouette with a moonlit rim
    layer(() => robo(700, 1010, 3.9, { eyes: 'off', mouth: 'flat', red: 0, brows: 'normal', hum: false, tilt: -.03 }), { filter: `brightness(${.33 + .5 * thunder}) saturate(.55)` });
    [[180, 1040, 46], [1260, 1050, 58], [1560, 1030, 40], [1780, 1060, 52]].forEach(([x, y, r], i) => bdPumpkin(x, y, r, { glow: .45 + .55 * bp(t), sq: .08 * bp(t), face: i % 3 }));
    camEnd();
    flash(.45 * thunder * (t > 1.95 ? 1 : 0), '#E8E0FF');
  }

  // 4.2–8.0 · BEEP (eyes on), BOOP (antenna), SENSORS (scan left-right), LOCKED (red).
  function powerOn(t, lt) {
    const red = ease(seg(t, L.locked, L.locked + .22)), jolt = kick(t, L.beep, 8) + kick(t, L.locked, 6);
    cam(t, 1.02 + .06 * lt / 3.8 + .05 * kick(t, L.locked, 4), 16 * kick(t, L.locked, 5) + 3 * kick(t, L.beep, 9));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, H / 2, 100, 1200, [[0, mixCol('#2A1848', '#5A0E1E', red)], [1, '#0B0614']]), stroke: null });
    bdDots(mixCol('#6A4AA8', '#FF4A4A', red), .12, 40, 7, t);
    const eyes = t < L.beep ? 'off' : 'open', scan = seg(t, L.sensors, L.locked);
    roboHeadAt(W / 2, H / 2 + 60, 11.5, {
      eyes, red, blink: 0, hum: false, jump: .35 * jolt,
      lookX: t >= L.sensors && t < L.locked ? Math.sin(scan * TAU * 1.5) : 0, lookY: 0,
      brows: red > .5 ? 'angry' : t > L.boop ? 'up' : 'normal',
      mouth: red > .5 ? 'teeth' : t > L.boop ? 'o' : 'flat',
      antenna: t > L.boop ? .25 * boing(t, L.boop, 2.5, 3) : 0,
    });
    if (t >= L.sensors && t < L.locked) { const y = lerp(140, 940, frac(seg(t, L.sensors, L.locked) * 2)); line([[0, y], [W, y]], { stroke: 'rgba(140,240,255,.55)', lwPx: 6 }); }
    camEnd();
    sfx('BEEP', 420, 300, 110, '#BFF3FF', t - L.beep, { rot: -.15 });
    sfx('BOOP', 1500, 260, 110, '#BFF3FF', t - L.boop, { rot: .12 });
    flash(.65 * kick(t, L.locked, 5), '#FF3030');
  }

  // 8.0–14.9 · the title card on an orange-and-violet sunburst; Robo hovers up, then rushes the lens.
  function title(t, lt) {
    const rush = easeIn(seg(t, 13.9, 14.94)), beatZ = .025 * bp(t, 9);
    cam(t, 1 + beatZ + rush * 1.6, 4 * bp(t, 9), 0, W / 2, lerp(H / 2, 380, rush));
    bdSunburst(W / 2, 470, t, '#3A1B63', '#57288A', 20, .25);
    bdDots('#F28C28', .1, 36, 6, t);
    bdMoon(W / 2, 470, 230 + 12 * bp(t), .9);
    bdBats(t, 10, { y: 300, spread: 420, s: 7, speed: 220 });
    // pumpkins bounce along the bottom, alternating on the beat
    for (let i = 0; i < 9; i++) { const b = Math.floor(beatPos(t)), on = (b + i) % 2 === 0, hop = on ? Math.sin(frac(beatPos(t)) * Math.PI) : 0;
      bdPumpkin(110 + i * 212, 1090 - 70 * hop, 66, { glow: .5 + .5 * hop, sq: on ? -.08 * hop : .06, face: i % 3, rot: .1 * Math.sin(t * 3 + i) }); }
    // Robo rises into frame and hovers, broccoli up
    const rise = backOut(seg(t, 8.0, 9.0)), A = robo(W / 2, lerp(1500, 900, rise) + 14 * Math.sin(t * 3) + rush * 300, 3.9 + rush * 9, {
      hover: 1, red: 1, brows: 'angry', mouth: roboMouth(t, 'grin'), handL: [-5.6, -14 + 1.2 * bp(t)], handPoseL: 'palm', handR: [5.4, -21.5], broccoli: 'R', eyes: 'open',
      lean: .04 * Math.sin(t * 2), tilt: .06 * Math.sin(beatPos(t) * Math.PI) });
    sparkle(A.handR[0], A.handR[1] - 90, 110, t - 9.15);
    // THE / BROCCOLI / DIRECTIVE
    const out = rush;
    X.save(); X.globalAlpha = 1 - out; X.translate(0, -out * 400);
    slamWord('THE', 330, 400, 100, BD.cream, t, beatAt(19), -.14);
    slamWord('BROCCOLI', 440, 540, 175, BD.slime, t, beatAt(20), -.08);
    slamWord('DIRECTIVE', 1480, 660, 175, BD.orange, t, beatAt(22), .07);
    X.restore();
    camEnd();
    flash(.5 * kick(t, beatAt(20), 7) + .5 * kick(t, beatAt(22), 7));
    flash(clamp((t - 14.7) / .24) * .9, '#FF2E2E');
  }

  // 14.9–22.0 · Robo's red night-vision POV: four trick-or-treaters at a door; a reticle locks each one; candy pours in.
  const HUD_KIDS = [['housam', 330], ['alma', 610], ['jenna', 880], ['danny', 1150]];
  const LOCKS = [L.visual, L.lock, L.active, L.active + SPB];
  function hud(t, lt) {
    const on = easeOut(seg(t, L.night, L.night + .3)), pan = 1 - ease(seg(t, L.night, 16.0));
    const fill = i => ease(seg(t, L.trick + .5 + i * .25, L.received + .2 + i * .1));
    cam(t, 1.05 + .03 * Math.sin(lt * .8), 2, 0, W / 2 + pan * 520, H / 2);
    layer(() => {
      bdSky('#0B0710', '#2A2230');
      bdMoon(380, 160, 80, .6); bdStars(t, 50, 5, 420);
      // the street: a house front with a porch door at the right
      shape(rectPts(1280, 140, 900, 820), { fill: '#3C3346', stroke: BD.ink, lwPx: 3 });
      shape([[1220, 160], [1730, -60], [2240, 160]], { fill: '#2A2232', stroke: BD.ink, lwPx: 3 });
      shape(rectPts(1450, 470, 230, 420), { fill: '#1C1622', stroke: BD.ink, lwPx: 4 });                            // doorway
      const door = ease(seg(t, L.trick - .2, L.trick + .25));
      shape([[1450, 470], [1450 + 230 * (1 - door * .85), 470 + door * 30], [1450 + 230 * (1 - door * .85), 890 - door * 30], [1450, 890]], { fill: '#5A4A60', stroke: BD.ink, lwPx: 4 });
      if (door > .05) shape(rectPts(1450 + 230 * (1 - door * .85), 470, 230 * door * .85, 420), { fill: rgba('#FFE7B0', .85 * door), stroke: null });
      shape(rectPts(1880, 400, 200, 200), { fill: '#FFD27A', stroke: BD.ink, lwPx: 4 });
      circle(1520, 420, 26, { fill: '#FFE7A0', stroke: BD.ink, lwPx: 3 });
      shape(rectPts(-200, 890, W + 400, 300), { fill: '#24202A', stroke: null }); line([[-200, 890], [W + 400, 890]], { stroke: '#4A4452', lwPx: 4 });
      [[1380, 960, 52], [1760, 960, 60], [-60, 960, 48]].forEach(([x, y, r], i) => bdPumpkin(x, y, r, { glow: .8, face: i }));
      // a hand reaching out with candy, then candy arcing into each bucket
      if (door > .5) { const hk = ease(seg(t, L.trick + .1, L.trick + .5)); circle(1500 + 40 * hk, 650, 30 * hk, { fill: '#E9C6A6', stroke: BD.ink, lwPx: 3 }); }
      HUD_KIDS.forEach(([id, x], i) => {
        const up = ease(seg(t, L.trick + i * .12, L.trick + .35 + i * .12)), K = KIDS[id], hop = .3 * bp(t) * up;
        const A = kid(id, x, 920, 3.0, { ...(up > .5 ? { handR: K.scared.handR, handPoseR: 'fist' } : {}), mouth: up > .5 ? 'open' : 'smile', eyes: up > .5 ? 'happy' : 'open', jump: hop, turn: .35, lookX: .6, bucket: .15 + .85 * fill(i) });
        for (let j = 0; j < 4; j++) arcCandy(t, L.trick + .5 + j * .32 + i * .08, L.trick + 1.2 + j * .32 + i * .08, [1540, 650], [A.handR[0], A.handR[1] + 40], 260, 26, ['wrap', 'corn', 'bar', 'lolly'][(i + j) % 4], i * 4 + j);
      });
    }, { filter: 'grayscale(1) sepia(1) saturate(6) hue-rotate(-38deg) brightness(.92) contrast(1.15)' });
    // reticles: wander, then snap onto each kid on the beat
    HUD_KIDS.forEach(([id, x], i) => {
      const t0 = LOCKS[i], A = loc(measure(() => kid(id, x, 920, 3.0, { turn: .35 })));
      if (t < t0 - .45) return;
      const k = seg(t, t0 - .45, t0), cx = lerp(x + 260, A.head[0], easeOut(k)), cy = lerp(A.head[1] - 200, A.head[1] + 40, easeOut(k));
      bdReticle(cx, cy, 120, t, t >= t0 ? 1 : k * .8, '#FF5050');
      if (t >= t0) { circle(cx, cy, 120 + 260 * easeOut(seg(t, t0, t0 + .35)), { fill: null, stroke: rgba('#FF8080', 1 - seg(t, t0, t0 + .35)), lwPx: 5 }); bdCandy(cx + 120, cy - 150, 28, ['wrap', 'corn', 'bar', 'lolly'][i], .3); }
    });
    // data received: four candy bars on the right edge shoot up
    if (t > L.data - .2) {
      const k = easeOut(seg(t, L.data - .2, L.data + .2));
      X.save(); X.translate((1 - k) * 300, 0);
      shape(rectPts(1660, 160, 210, 330), { fill: 'rgba(40,0,0,.55)', stroke: '#FF5050', lwPx: 4 });
      for (let i = 0; i < 4; i++) { const h = 240 * ease(seg(t, L.received + i * .1, L.received + .5 + i * .1)) * (.7 + .3 * hash(i)) + 10 * bp(t);
        shape(rectPts(1690 + i * 46, 460 - h, 32, h), { fill: '#FF5A5A', stroke: null }); }
      X.restore();
    }
    bdHudFrame(t);
    camEnd();
    // TV-on: the picture opens from a bright line
    if (on < 1) overlay(() => { const hh = H / 2 * on; X.fillStyle = '#000'; X.fillRect(0, 0, W, H / 2 - hh); X.fillRect(0, H / 2 + hh, W, H / 2 - hh + 1); X.fillStyle = '#FFD0D0'; X.fillRect(0, H / 2 - hh - 3, W, 6); X.fillRect(0, H / 2 + hh - 3, W, 6); });
  }

  // 22.0–26.4 · the sugar meter climbs on every beat; on "critical" the glass cracks and sirens sweep.
  function sugarMeter(t, lt) {
    const crit = t >= L.critical, ck = kick(t, L.critical, 4);
    cam(t, 1.0 + .05 * seg(t, 22, 26.4) + .04 * ck, crit ? 8 + 14 * ck : 2 * bp(t), 0, W / 2, H / 2 - 30);
    if (crit) {
      bdHazard(t, '#140C14', '#3A0A12', 100, 160);
      for (let i = 0; i < 2; i++) { const a = t * 3.2 + i * Math.PI, cx = i ? W - 120 : 120;
        X.save(); X.globalCompositeOperation = 'lighter'; shape([[cx, 60], [cx + Math.cos(a) * 1600 - 120, 60 + Math.abs(Math.sin(a)) * 1400], [cx + Math.cos(a + .25) * 1600 + 120, 60 + Math.abs(Math.sin(a + .25)) * 1400]], { fill: 'rgba(255,40,40,.32)', stroke: null }); X.restore();
        circle(cx, 60, 46, { fill: '#FF3A3A', stroke: BD.ink, lwPx: 5 }); }
    } else { bdSunburst(W / 2, 540, t, '#2A1450', '#331A60', 16, .2); bdDots('#FF8FC8', .1, 34, 6, t); }
    // candy pouring into the top of the tube
    for (let i = 0; i < 14; i++) { const t0 = 22 + i * .25, u = seg(t, t0, t0 + .7); if (u <= 0 || u >= 1) continue;
      bdCandy(W / 2 + (hash(i) - .5) * 200 + (1 - u) * (hash(i * 3) - .5) * 900, lerp(-80, 160, easeIn(u)), 40, ['wrap', 'corn', 'bar', 'lolly', 'cane'][i % 5], u * 6 + i); }
    // the thermometer
    const x0 = W / 2 - 80, top = 200, bot = 720, beats = Math.floor((t - 22) / SPB), lvl = clamp(.08 + .13 * (beats + easeOut(frac((t - 22) / SPB)))) * (crit ? 1.06 : 1);
    shape(rectPts(x0 - 70, top - 40, 300, bot - top + 120), { fill: '#EDE6D8', stroke: BD.ink, lwPx: 6, smooth: .08 });
    for (let i = 0; i < 9; i++) { const y = top + 10 + i * 78; shape([[x0 - 70, y], [x0 - 70, y + 40], [x0 + 230, y - 30], [x0 + 230, y - 70]], { fill: '#E8243C', stroke: null, alpha: .9 }); }
    shape(rectPts(x0 - 70, top - 40, 300, bot - top + 120), { fill: null, stroke: BD.ink, lwPx: 6, smooth: .08 });
    // zones
    [['#6CC24A', .0, .45], ['#FFD54F', .45, .72], ['#FF3A3A', .72, 1]].forEach(([c, a, b]) => shape(rectPts(x0 + 175, bot - (bot - top) * b, 26, (bot - top) * (b - a)), { fill: c, stroke: BD.ink, lwPx: 3 }));
    shape(rectPts(x0, top, 160, bot - top + 30), { fill: 'rgba(255,255,255,.75)', stroke: BD.ink, lwPx: 6, smooth: .2 });
    const ly = bot + 30 - (bot - top + 30) * Math.min(lvl, 1.02);
    shape(rectPts(x0 + 14, ly, 132, bot + 30 - ly), { fill: linGrad(0, top, 0, bot, [[0, '#FF2E6A'], [.5, '#FF5CA8'], [1, '#FF8FC8']]), stroke: null });
    for (let i = 0; i < 5; i++) { const by = ly + 20 + frac(t * .8 + i * .2) * (bot - ly); circle(x0 + 40 + hash(i) * 80, by, 8 + hash(i * 3) * 8, { fill: 'rgba(255,255,255,.5)', stroke: null }); }
    circle(x0 + 80, bot + 120, 140, { fill: '#FF5CA8', stroke: BD.ink, lwPx: 7 });
    circle(x0 + 30, bot + 75, 34, { fill: 'rgba(255,255,255,.55)', stroke: null });
    bdCandy(x0 + 80, bot + 125, 70, 'wrap', .2 + .2 * Math.sin(t * 4), '#FFD54F');
    for (let i = 0; i < 6; i++) line([[x0 + 160, top + 50 + i * 110], [x0 + 130, top + 50 + i * 110]], { stroke: BD.ink, lwPx: 5 });
    if (crit) {   // cracks and a skull
      const ck2 = easeOut(seg(t, L.critical, L.critical + .15));
      [[[x0 + 40, top + 80], [x0 + 70, top + 150], [x0 + 50, top + 210], [x0 + 95, top + 280]], [[x0 + 120, top + 40], [x0 + 95, top + 120], [x0 + 130, top + 170]], [[x0 + 20, top + 300], [x0 + 60, top + 330], [x0 + 45, top + 400]]]
        .forEach(p => line(polySlice(p, 0, ck2), { stroke: BD.ink, lwPx: 6 }));
      const sk = backOut(seg(t, L.critical, L.critical + .3)), sy = top - 120;
      X.save(); X.translate(W / 2, sy); X.scale(sk * (1 + .1 * bp(t)), sk * (1 + .1 * bp(t)));
      circle(0, 0, 70, { fill: BD.bone, stroke: BD.ink, lwPx: 6 }); shape(rectPts(-40, 40, 80, 50), { fill: BD.bone, stroke: BD.ink, lwPx: 6 });
      [-1, 1].forEach(sd => circle(sd * 26, -4, 20, { fill: '#FF2E2E', stroke: BD.ink, lwPx: 4 })); shape([[-8, 26], [8, 26], [0, 12]], { fill: BD.ink, stroke: null });
      X.restore();
      // the syrup bubbling over the top
      for (let i = 0; i < 6; i++) circle(x0 + 20 + i * 24, top - 6 - 20 * Math.abs(Math.sin(t * 5 + i)), 18, { fill: '#FF5CA8', stroke: BD.ink, lwPx: 3 });
    }
    camEnd();
    flash(.55 * kick(t, L.critical, 7), '#FF4040');
  }

  // 26.4–30.1 · the hero shot: steam, arms up, the broccoli drawn like a sword; jets fire and he blasts off.
  function compliance(t, lt) {
    const arms = ease(seg(t, L.protocol - .1, L.protocol + .3)), draw = backOut(seg(t, L.now, L.now + .25)), crouch = ease(seg(t, L.fully, L.engaged)) * (t < L.engaged ? 1 : 0);
    const blast = easeIn(seg(t, L.engaged, L.engaged + .7));
    cam(t, 1.02 + .05 * lt / 3.6, 3 + 16 * kick(t, L.engaged, 3) + 5 * bp(t));
    bdSunburst(W / 2, 360, t, '#2A0610', '#5A0E1E', 22, .6);
    bdDots('#FF4A4A', .1, 34, 6, t);
    // ground
    shape(rectPts(-40, 960, W + 80, 200), { fill: '#1A0A10', stroke: null });
    for (let i = 0; i < 14; i++) { const a = t - L.engaged - i * .03; if (a > 0) bdDust(W / 2 + (hash(i) - .5) * 600, 980, 70 + hash(i * 2) * 40, a * .8, '#E8D8D0'); }
    const ry = 1180 - blast * 2400;
    if (blast > 0) for (let i = 7; i >= 0; i--) { const yy = ry - 40 + i * 150; X.save(); X.globalAlpha = .85 * (1 - i / 8) * (1 - seg(t, L.engaged + .6, L.engaged + 1.1)); circle(W / 2 + Math.sin(i * 2.1 + t * 9) * 30, yy, 60 + i * 22, { fill: i % 2 ? '#FFB23A' : '#FFF3C4', stroke: BD.ink, lwPx: 3 }); X.restore(); }
    const A = robo(W / 2, ry, 5.6, {
      red: 1, steam: t < L.fully ? 1 : 0, brows: 'angry', mouth: roboMouth(t, 'teeth'), hover: t >= L.fully ? 1 : 0, dy: 2.5 * crouch,
      handL: mixPt([-4.4, -8.6], [-5.6, -14.5], arms), handPoseL: 'fist',
      handR: mixPt([4.4, -8.6], [4.2, -22.5], draw), broccoli: t >= L.now ? 'R' : undefined, handPoseR: 'fist',
      tilt: -.04, lean: -.02, jump: 0, sq: -.12 * blast,
    });
    if (t >= L.now) sparkle(A.handR[0], A.handR[1] - 120, 160, t - L.now);
    camEnd();
    sfx('WHOOSH!', W / 2 + 380, 420, 120, BD.orangeLt, t - L.engaged, { rot: -.12 });
    flash(.45 * kick(t, L.now, 8), '#E9FFD0');
  }

  // 30.1–37.6 · the lecture: a hologram from his eye. Broccoli fills a kid's battery; candy spikes the line and CRASHES it.
  function lecture(t, lt) {
    const crashK = kick(t, L.crash, 3.5);
    cam(t, 1.0 + .04 * lt / 7.5 + .05 * crashK, 18 * crashK);
    bdSky('#0F1830', '#1B1033');
    // a glowing holo-floor grid
    for (let i = 0; i < 16; i++) { const x = -400 + i * 180; line([[x, 1080], [W / 2 + (x - W / 2) * .35, 640]], { stroke: 'rgba(80,220,255,.25)', lwPx: 3 }); }
    for (let i = 0; i < 6; i++) { const y = 640 + Math.pow(i / 6, 1.8) * 440 + frac(t * .5) * 30; line([[0, y], [W, y]], { stroke: 'rgba(80,220,255,.2)', lwPx: 3 }); }
    const A = robo(1560, 1040, 4.0, { red: 1, brows: t < L.candy ? 'up' : 'angry', mouth: roboMouth(t, 'smile'), handL: [-5.6, -15.5 + .4 * Math.sin(t * 3)], handPoseL: 'point', turn: -.35, lookX: -.8 });
    // the projection cone and the panel
    const px = 90, py = 110, pw = 1080, ph = 680, eye = A.eyeL;
    X.save(); X.globalCompositeOperation = 'lighter';
    shape([eye, [px + pw, py], [px + pw, py + ph]], { fill: 'rgba(80,220,255,.10)', stroke: null });
    X.restore();
    const pop = backOut(seg(t, 30.1, 30.5)), glitch = crashK > .2 ? (hash(Math.floor(t * 24)) - .5) * 30 * crashK : 0;
    X.save(); X.translate(px + pw / 2 + glitch, py + ph / 2); X.scale(pop, pop); X.translate(-pw / 2, -ph / 2);
    shape(rectPts(0, 0, pw, ph), { fill: 'rgba(30,120,150,.32)', stroke: '#7FE3FF', lwPx: 5, smooth: .04 });
    for (let y = 10; y < ph; y += 10) line([[6, y], [pw - 6, y]], { stroke: 'rgba(127,227,255,.07)', lwPx: 2 });
    const C = '#BFF3FF';
    // a little kid icon (head, body, arms); flexes when full, conks out when crashed
    const kidIcon = (x, y, sc, mood) => {
      X.save(); X.translate(x, y); X.scale(sc, sc);
      const flex = mood === 'flex', zz = mood === 'zz';
      X.rotate(zz ? 1.35 : 0);
      circle(0, -150, 46, { fill: 'rgba(191,243,255,.25)', stroke: C, lwPx: 5 });
      shape(rectPts(-46, -100, 92, 120), { fill: 'rgba(191,243,255,.18)', stroke: C, lwPx: 5, smooth: .3 });
      [-1, 1].forEach(sd => line(flex ? [[sd * 46, -84], [sd * 92, -84], [sd * 92, -150]] : [[sd * 46, -84], [sd * 70, -20]], { stroke: C, lwPx: 8 }));
      if (flex) [-1, 1].forEach(sd => circle(sd * 88, -110, 18, { fill: 'rgba(191,243,255,.3)', stroke: C, lwPx: 4 }));
      [-1, 1].forEach(sd => line([[sd * 22, 20], [sd * 26, 90]], { stroke: C, lwPx: 8 }));
      if (zz) [-1, 1].forEach(sd => line([[sd * 22 - 10, -154], [sd * 22 + 10, -154]], { stroke: C, lwPx: 4 }));
      else { [-1, 1].forEach(sd => circle(sd * 16, -156, 6, { fill: C, stroke: null })); line(flex ? [[-16, -134], [0, -124], [16, -134]] : [[-14, -130], [14, -130]], { stroke: C, lwPx: 4, smooth: true }); }
      X.restore();
    };
    if (t < L.candy - .1) {
      // FOOD IS FUEL: broccoli drops into the battery, which fills in steps
      const lvl = clamp(Math.floor(((t - L.fuel) / SPB) + 1) / 4) * (t > L.fuel ? 1 : 0), flex = t > L.body;
      kidIcon(300, 560 - 10 * bp(t), 1.6, flex ? 'flex' : 'idle');
      shape(rectPts(560, 180, 220, 380), { fill: null, stroke: C, lwPx: 6, smooth: .1 }); shape(rectPts(630, 150, 80, 34), { fill: C, stroke: null });
      for (let i = 0; i < 4; i++) if (lvl > i / 4 + .01) shape(rectPts(578, 470 - i * 92, 184, 76), { fill: '#7CFF6B', stroke: null, alpha: .85 });
      for (let i = 0; i < 3; i++) { const t0 = L.food + .3 + i * .9, u = seg(t, t0, t0 + .7); if (u > 0 && u < 1) bdBroccoli(670, lerp(-60, 380, easeIn(u)), 12, u * 3); }
      if (flex) { sparkle(300, 320, 120, t - L.body, '#7CFF6B'); sparkle(670, 300, 140, t - L.body, '#7CFF6B'); }
      [-1, 1].forEach(sd => line([[860, 330 + sd * 30], [960, 330 + sd * 30]], { stroke: C, lwPx: 8 }));
      bdBroccoli(960, 420, 16, 0);
    } else {
      // CANDY MAKES YOU CRASH: the energy line rockets up, then drops off a cliff
      const u = seg(t, L.candy, L.crash), v = seg(t, L.crash, L.crash + .45);
      line([[80, 80], [80, 600], [1020, 600]], { stroke: C, lwPx: 5 });
      const pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40; if (f > u) break; pts.push([100 + f * 620, 560 - 470 * Math.pow(f, 1.6)]); }
      if (v > 0) { pts.push([720 + 60 * v, 90 + 500 * easeIn(v)]); pts.push([720 + 60 * v + 160 * v, 90 + 500 * easeIn(v)]); }
      line(pts, { stroke: '#FF7AB6', lwPx: 10, smooth: .3 });
      const head = pts[pts.length - 1] || [100, 560];
      if (v <= 0) { bdCandy(head[0], head[1] - 70, 48, 'wrap', t * 6, '#FF5C8A'); kidIcon(head[0] + 90, head[1] + 70, .7, 'idle'); }
      else kidIcon(head[0] + 40, Math.min(head[1] + 90, 580), .7, 'zz');
      if (v >= 1) { const zk = frac(t * .8); X.save(); X.globalAlpha = 1 - zk; X.font = `${70}px ${FONT_SFX}`; X.fillStyle = C; X.fillText('z', 960 + zk * 40, 470 - zk * 120); X.fillText('Z', 900 + zk * 30, 400 - zk * 120); X.restore(); }
    }
    X.restore();
    camEnd();
    sfx('CRASH!', 820, 560, 160, '#FF5C8A', t - L.crash, { rot: .1, life: 1.3 });
  }

  // 37.6–41.2 · Robo drops in behind the four kids, THUD, and raises the broccoli.
  const ROW = [['housam', 250], ['alma', 610], ['jenna', 1310], ['danny', 1680]];
  function anthem(t, lt) {
    const land = 38.3, drop = easeIn(seg(t, L.eat1 - .1, land)), thud = kick(t, land, 5);
    cam(t, 1.0 + .03 * lt / 3.6 + .04 * thud, 22 * thud + 3 * bp(t));
    bdSunburst(W / 2, 420, t, '#2E5E1E', '#3E7A28', 20, .3);
    bdDots('#B6F07A', .12, 36, 7, t);
    shape(rectPts(-40, 900, W + 80, 260), { fill: '#1F3A16', stroke: null }); line([[-40, 900], [W + 40, 900]], { stroke: BD.ink, lwPx: 5 });
    const raise = backOut(seg(t, L.broc1 - .15, L.broc1 + .15));
    const A = robo(W / 2, lerp(-900, 900, drop), 3.7, { red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), hover: t < land ? 1 : 0, sq: .15 * thud,
      handR: mixPt([4.4, -8.6], [4.0, -22.5], raise), broccoli: 'R', handPoseR: 'fist', handL: [-5.3, -13.5], handPoseL: 'point', jump: 0 });
    if (t > land) bdDust(W / 2, 910, 160, t - land);
    sparkle(A.handR[0], A.handR[1] - 110, 150, t - L.broc1);
    ROW.forEach(([id, x], i) => {
      const scared = t > land, K = KIDS[id], jmp = 3 * Math.max(0, Math.sin(seg(t, land, land + .35) * Math.PI));
      kid(id, x, 1060, 3.3, { ...(scared ? K.scared : {}), eyes: scared ? 'wide' : 'open', brows: scared ? 'worried' : 'normal', mouth: scared ? 'o' : 'smile', jump: jmp,
        lookY: -.8, lookX: (W / 2 - x) / 900, tilt: .04 * Math.sin(t * 9 + i) * (scared ? 1 : 0), bucket: .9 });
      if (scared && i % 2 === 0) sfx('!', x + 120, 560, 90, BD.orangeLt, t - land - i * .05, { life: .9 });
    });
    camEnd();
  }

  // 41.2–44.3 / 86.9–90.1 · the 2×2 grid. One panel slams in per "eat". refuse: mouths clamped; chew: broccoli in, misery.
  const PANEL_BG = { housam: ['#C45E12', '#F28C28'], alma: ['#3B1F5C', '#5A2B78'], jenna: ['#B0306E', '#E05A9A'], danny: ['#2E6A24', '#4E9A3A'] };
  function eatGrid(mode, times) {
    return function eatGrid(t, lt) {
      const g = 10, pw = W / 2 - g * 1.5, ph = H / 2 - g * 1.5;
      shape(rectPts(-10, -10, W + 20, H + 20), { fill: BD.ink, stroke: null });
      ORDER.forEach((id, i) => {
        const t0 = times[i], age = t - t0, px = g + (i % 2) * (pw + g), py = g + Math.floor(i / 2) * (ph + g);
        if (age < 0) { shape(rectPts(px, py, pw, ph), { fill: '#1A0F22', stroke: null }); bdDots('#3B2A50', .4, 30, 5, t); return; }
        const k = age < .14 ? lerp(1.35, 1, easeOut(age / .14)) : 1 + .03 * boing(t, t0 + .14, 3, 7), cx = px + pw / 2, cy = py + ph / 2;
        X.save(); X.translate(cx, cy); X.rotate(.05 * boing(t, t0, 2.5, 6)); X.scale(k, k); X.translate(-cx, -cy);
        clipRect(px, py, pw, ph, () => {
          const [a, b] = PANEL_BG[id];
          X.save(); X.translate(px, py); X.scale(pw / W, ph / H); bdSunburst(W * .35, H * .45, t + i, a, b, 14, .5); X.restore();
          const hx = px + pw * .4, hy = py + ph * .47, kk = { housam: 4.9, alma: 7.6, jenna: 6.2, danny: 6.6 }[id], K = KIDS[id];
          const shakeHead = mode === 'refuse' ? .16 * Math.sin(t * 22) * (age > .25 ? 1 : 0) : .06 * Math.sin(beatPos(t) * Math.PI);
          // the gripper comes in from the right with the broccoli
          const jab = mode === 'refuse' ? .55 + .2 * Math.sin(age * 9) : 0;
          const A = kidHeadAt(id, hx, hy, kk, {
            ...(mode === 'refuse' ? K.mouthHands : {}),
            eyes: mode === 'refuse' ? 'squeeze' : (frac(t * 1.3 + i * .3) < .5 ? 'closed' : 'squeeze'),
            brows: 'worried', mouth: mode === 'refuse' ? 'flat' : 'wobble', tilt: shakeHead, lookX: .8, blush: 1,
          });
          if (mode === 'refuse') {
            const hand = [px + pw + 40 - pw * .42 * easeOut(seg(age, .1, .4)) * jab / .55, A.mouth[1] + 10];
            bdArm([px + pw + 200, A.mouth[1] + 40], hand, 48, t, { sag: .02, open: .25, item: (x, y) => bdBroccoli(x - 10, y + 70, 15, -1.5) });
          } else {
            bdMouthBroccoli(A.mouth[0], A.mouth[1], KIDS[id].U * kk, 1, t, 1);
            for (let j = 0; j < 3; j++) { const u = frac(t * 1.6 + j / 3); X.save(); X.globalAlpha = 1 - u; circle(A.head[0] - 160 - u * 60, A.head[1] - 100 - u * 80 + j * 20, 10 + u * 8, { fill: '#B6F07A', stroke: BD.ink, lwPx: 2 }); X.restore(); }
          }
        });
        X.restore();
        shape(rectPts(px, py, pw, ph), { fill: null, stroke: BD.ink, lwPx: 10 });
        if (age < .12) flash(0);
      });
    };
  }

  // 44.3–47.1 · Robo does a proud robot dance, eyes shut; the kids tiptoe off; he opens his eyes to an empty stage.
  function scatter(t, lt) {
    const zip = 45.9, look = L.broc1b, open = t >= look;
    cam(t, 1.0 + .03 * bp(t), open ? 6 * kick(t, look, 4) : 2);
    bdSunburst(W / 2, 520, t, '#2A1450', '#3A1E68', 18, .15);
    for (let i = 0; i < 3; i++) { const a = -.5 + i * .5 + .25 * Math.sin(t * 1.3 + i); X.save(); X.globalCompositeOperation = 'lighter';
      shape([[W / 2 + (i - 1) * 500, -40], [W / 2 + (i - 1) * 500 + Math.sin(a) * 1200 - 160, 1100], [W / 2 + (i - 1) * 500 + Math.sin(a) * 1200 + 160, 1100]], { fill: 'rgba(255,220,150,.08)', stroke: null }); X.restore(); }
    shape(rectPts(-40, 880, W + 80, 300), { fill: '#2A1838', stroke: null }); line([[-40, 880], [W + 40, 880]], { stroke: BD.ink, lwPx: 5 });
    // the kids sneak off behind him (drawn first: they're further back)
    [['housam', 520, -1], ['alma', 760, -1], ['jenna', 1160, 1], ['danny', 1400, 1]].forEach(([id, x0, dir], i) => {
      const sneak = (t - 44.3) * 70, zk = easeIn(seg(t, zip + i * .06, zip + .35 + i * .06)), x = x0 + dir * (sneak + zk * 1400), p = sneak / 30 + zk * 8;
      if (x < -300 || x > W + 300) return;
      kid(id, x, 900, 2.7, { ...KIDS[id].run(p, .6 + zk), lean: dir * (.08 + .2 * zk), turn: dir * .4, lookX: -dir, eyes: 'open', brows: 'worried', mouth: zk > 0 ? 'o' : 'flat', bucket: .9, dy: .4 });
      if (zk > 0) { bdDust(x - dir * 40, 900, 80, t - zip - i * .06); bdSpeedLines(t, 'rgba(255,255,255,.35)', -dir, 3, 600, 880); }
    });
    // the robot dance
    const b = Math.floor(beatPos(t)), ph = b % 4, sw = [[[-5.4, -15], [4.4, -8]], [[-4.4, -8], [5.4, -15]], [[-5.6, -11], [5.6, -11]], [[-3.8, -19], [3.8, -19]]][ph];
    robo(W / 2, 960, 3.5, open ? { red: 1, eyes: 'wide', brows: 'up', mouth: 'O', emote: '!', emoteK: seg(t, look, look + .2), lookX: Math.sin((t - look) * 9) * .9, jump: .6 * kick(t, look, 6), handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'open', handPoseR: 'open', steam: seg(t, look + .4, look + .6) }
      : { eyes: 'happy', mouth: 'grin', brows: 'up', red: .3, emote: 'music', emoteK: 1, handL: sw[0], handR: sw[1], handPoseL: 'fist', handPoseR: 'fist', broccoli: 'R', tilt: .08 * (ph % 2 ? 1 : -1), jump: .5 * bp(t, 5), dy: .3 * (1 - bp(t, 5)) });
    camEnd();
  }

  // 47.1–60.0 · HOUSAM: a side-scrolling graveyard chase.
  const CH0 = 47.1, CH_STOP = 57.0;
  function chaseX(t) { const v = 900, d = t - CH0; if (t < CH_STOP) return v * d; const e = Math.min(t - CH_STOP, .4); return v * (CH_STOP - CH0) + v * (e - e * e / (2 * .4)); }
  function housamChase(t, lt) {
    const sx = chaseX(t), gy = 960, stopK = ease(seg(t, CH_STOP, CH_STOP + .4)), K = 3.5;
    cam(t, 1.0 + .02 * bp(t), 3 + 10 * kick(t, 51.25, 5));
    bdSky('#140B2A', '#3B1F5C', '#6B3A6A'); bdStars(t, 60, 9, 500); bdMoon(1500, 220, 110);
    bdBats(t, 5, { y: 230, s: 6, speed: 120, dir: -1 });
    bdHill(640, 70, '#2A1745', 0, sx * .1, 1300);
    for (let i = -1; i < 4; i++) { const hx = ((i * 900 - sx * .1) % 3600 + 3600) % 3600 - 400; bdHouse(hx, bdHillY(hx, 640, 70, 0, sx * .1, 1300) + 8, 6, t); }
    bdHill(800, 50, '#1C1032', 2, sx * .4, 900);
    for (let i = 0; i < 12; i++) { const wx = i * 320 + 80, x = ((wx - sx * .4) % 3840 + 3840) % 3840 - 300; bdTomb(x, bdHillY(x, 800, 50, 2, sx * .4, 900) + 8, 5 + hash(i) * 2, i % 3, { fill: '#4A4466', dark: '#2E2A44', rot: (hash(i) - .5) * .25 }); }
    bdFog(t, 860, '#B9A4F0', .18, 90);
    shape(rectPts(-40, gy - 10, W + 80, 220), { fill: '#24183A', stroke: null }); line([[-40, gy - 10], [W + 40, gy - 10]], { stroke: BD.ink, lwPx: 5 });
    for (let i = 0; i < 30; i++) { const x = ((i * 140 - sx) % 4200 + 4200) % 4200 - 100; line([[x, gy - 8], [x + 8, gy - 28], [x + 16, gy - 8]], { stroke: '#3E2A5A', lwPx: 4 }); }
    // characters' screen x
    const hX = lerp(1280, 1380, stopK) + 20 * Math.sin(t * 2), rX = lerp(240, 560, seg(t, CH0, CH_STOP)) + 40 * Math.sin(t * 1.3);
    // the hurdle tombstone (world x so that it reaches Housam at 50.5) and Robo crunching it at ~51.25
    const tombWX = chaseX(50.5) + hX, tombX = tombWX - sx, crunch = 51.25;
    if (t < crunch) bdTomb(tombX, gy, 12, 0, {});
    else for (let i = 0; i < 7; i++) { const a = t - crunch, d = a * (500 + hash(i) * 400); X.save(); X.globalAlpha = clamp(1 - a); bdTomb(rX + 80 + Math.cos(i) * d * .6 - a * 200, gy - 60 - Math.sin(1 + i) * d * .8 + 900 * a * a, 3 + hash(i) * 2, 2, { rot: a * (4 + i) }); X.restore(); }
    // candy trail: pieces drop out of the bucket and stay on the ground
    const traces = seg(t, L.system, L.traces + .6);
    for (let i = 0; i < 26; i++) { const td = 47.6 + i * .38; if (t < td || td > CH_STOP) continue; const wx = chaseX(td) + hX - 60, x = wx - sx, fall = clamp((t - td) / .25), y = lerp(gy - 140, gy - 22, fall * fall);
      if (x < -60 || x > W + 60) continue; bdCandy(x, y, 24, ['wrap', 'corn', 'bar', 'lolly'][i % 4], i);
      if (traces > 0 && t > L.system) { const lit = Math.abs(x - (rX + 200 + (t - L.system) * 400) % 1600) < 200 || t > L.traces; if (lit) circle(x, y, 34 + 6 * bp(t), { fill: 'rgba(255,60,60,.25)', stroke: '#FF4A4A', lwPx: 4 }); } }
    // Robo
    const catchT = 57.75, armOut = seg(t, L.units, L.units + .35), armBack = seg(t, L.units + .5, L.must + .2), rY = gy - 40 + 20 * Math.sin(t * 2.6);
    const RA = robo(rX, rY, K, { hover: 1, red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), lean: .14 * (1 - stopK), turn: .45, lookX: .9, lookY: t > L.system && t < L.traces + .6 ? .6 : 0, steam: .6,
      handL: t > catchT ? [5.6, -17] : [5.8, -13], handPoseL: 'claw', handR: [5.6, -10.5], handPoseR: 'claw', scan: t > L.system && t < L.traces + .6 ? 1 : 0 });
    // Housam
    const jumpK = Math.max(0, Math.sin(seg(t, 49.95, 50.85) * Math.PI)), kickK = seg(t, CH_STOP + .2, L.carbon + .3), kicked = t > L.carbon + .15;
    const lost = t > L.units + .5, fed = seg(t, L.comply, L.comply + .25);
    let HO = { ...housamDribble((sx) / 120, 1.5 * (1 - stopK)), lean: .13 * (1 - stopK), turn: lerp(.5, -.55, stopK), lookX: t > 49 && t < 49.9 ? -1 : lerp(.8, -1, stopK), eyes: 'open', brows: 'focused', mouth: 'smile', jump: 3.2 * jumpK, bucket: lost ? 0 : .9 };
    if (t > 52.2 && t < CH_STOP) HO = { ...HO, lookX: -1, turn: -.2, brows: 'worried', mouth: 'o' };
    if (t >= CH_STOP && !kicked) HO = { ...HO, footL: [-1.5 - 3 * kickK, -1.2 - 2.4 * kickK], handR: [4.8, -15], handL: [-4.6, -12], lean: -.12, brows: 'focused', mouth: 'grin' };
    if (kicked) HO = { ...HO, eyes: fed > .5 ? 'squeeze' : 'wide', brows: 'up', mouth: fed > 0 ? 'O' : 'o', ...(lost ? KIDS.housam.scared : {}), bucket: lost ? 0 : .9 };
    const hA = kid('housam', hX, gy, K, HO);
    // the ball: dribbled at his feet, flicked over the tombstone, then fired at Robo and caught
    const ballR = 1.35;
    if (t < CH_STOP + .2) { const p = sx / 120, bx = hX + 3.2 * HOUSAM_UNIT * K + 30 * Math.sin(p * Math.PI), by = gy - 24 - 40 * Math.abs(Math.sin(p * Math.PI)) - 420 * jumpK; housamBall(bx, by, HOUSAM_UNIT * K, { spin: -t * 12, radius: ballR }); }
    else if (t < catchT) { const u = seg(t, L.carbon + .15, catchT); housamBall(lerp(hX - 120, RA.handL[0] + 20, u), lerp(gy - 40, RA.handL[1] - 30, u) - 200 * 4 * u * (1 - u), HOUSAM_UNIT * K, { spin: t * 20, radius: ballR }); }
    else housamBall(RA.handL[0] + 20, RA.handL[1] - 30, HOUSAM_UNIT * K, { spin: 0, radius: ballR });
    // the telescoping arm takes the bucket, then the broccoli flies in
    if (armOut > 0 && t < L.must + .2) {
      const back = easeIn(armBack), tip = mixPt(mixPt(RA.handR, hA.handR, easeOut(armOut)), RA.handR, back);
      bdArm(RA.handR, tip, 30, t, { sag: .06, open: armOut < 1 && back === 0 ? .6 : .1, item: back > 0 || armOut >= 1 ? (x, y) => bdBucket(x, y - 20, KIDS.housam.U * K * .85, { fill: .9 }) : null });
    } else if (t >= L.must + .2) bdBucket(RA.handR[0], RA.handR[1] - 10, KIDS.housam.U * K * .85, { fill: .9, swing: .2 * Math.sin(t * 4) });
    if (t > L.comply - .2 && fed < 1) { const u = seg(t, L.comply - .2, L.comply + .05); bdBroccoli(lerp(RA.handR[0], hA.mouth[0], u), lerp(RA.handR[1], hA.mouth[1] + 40, u) - 150 * 4 * u * (1 - u), 9, u * 6); }
    bdMouthBroccoli(hA.mouth[0], hA.mouth[1], HOUSAM_UNIT * K, fed, t, -1);
    if (t < CH_STOP) bdSpeedLines(t, 'rgba(255,255,255,.18)', -1, 10, 120, 860);
    camEnd();
    sfx('CRUNCH!', rX + 140, gy - 320, 110, BD.bone, t - crunch, { rot: -.1 });
    sfx('CLAMP!', rX + 160, gy - 560, 90, '#BFF3FF', t - catchT, { rot: .1 });
    sfx('GULP!', hX + 180, gy - 560, 100, BD.slime, t - L.comply - .1, { rot: -.08 });
  }

  // 60.0–68.0 · ALMA: a dance battle on a spooky stage; target locked on the lollipop; the delivery.
  function almaBattle(t, lt) {
    const lockZ = ease(seg(t, L.target - .1, L.target + .35)) * (1 - ease(seg(t, L.prepare - .3, L.prepare + .1)));
    const ax = 600, ay = 960, sA = 22, rx = 1380, ry = 960;
    const lollyAt = measure(() => alma(ax, ay, sA, almaPose(t))).handL;
    cam(t, 1 + .02 * bp(t) + lockZ * .9, 2 + 5 * kick(t, L.locked2, 6), 0, lerp(W / 2, lollyAt[0], lockZ), lerp(H / 2, lollyAt[1] - 120, lockZ));
    // stage: curtains, a checkered floor, spotlights, footlight pumpkins
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, 0, 0, H, [[0, '#1E0E30'], [1, '#4A1F5C']]), stroke: null });
    for (let i = 0; i < 2; i++) { const cx = i ? rx : ax, on = i ? (Math.floor((t - 60.06) / (SPB * 2)) % 2 === 1) : true;
      X.save(); X.globalCompositeOperation = 'lighter'; shape([[cx - 60, -40], [cx + 60, -40], [cx + 330, ay + 40], [cx - 330, ay + 40]], { fill: `rgba(255,230,170,${on ? .14 : .06})`, stroke: null }); X.restore(); }
    for (let r = 0; r < 6; r++) for (let c = -6; c < 7; c++) { const y0 = 880 + Math.pow(r / 6, 1.5) * 300, y1 = 880 + Math.pow((r + 1) / 6, 1.5) * 300, sc = q => .6 + .8 * (q - 880) / 300;
      shape([[W / 2 + c * 200 * sc(y0), y0], [W / 2 + (c + 1) * 200 * sc(y0), y0], [W / 2 + (c + 1) * 200 * sc(y1), y1], [W / 2 + c * 200 * sc(y1), y1]], { fill: (r + c) % 2 ? '#2A1238' : '#5A2B78', stroke: null }); }
    [-1, 1].forEach(sd => { const x0 = sd < 0 ? -40 : W + 40; shape([[x0, -40], [x0 + sd * -300, -40], [x0 + sd * -220, 400], [x0 + sd * -320, 1120], [x0, 1120]], { fill: '#8A1E3A', stroke: BD.ink, lwPx: 5, smooth: .3 });
      for (let i = 1; i < 4; i++) line([[x0 + sd * -i * 70, -40], [x0 + sd * -i * 55, 1120]], { stroke: '#5E1026', lwPx: 4 }); });
    for (let i = 0; i < 7; i++) bdPumpkin(260 + i * 233, 1110, 44, { glow: .6 + .4 * bp(t), face: i % 3, sq: .06 * bp(t) });
    // Robo's own floor: a green glowing ring when he dances
    const roboTurn = Math.floor((t - 60.06) / (SPB * 2)) % 2 === 1 && t < L.target;
    if (roboTurn) { X.save(); X.globalAlpha = .7; ellipse(rx, ry + 10, 230 + 30 * bp(t), 46, { fill: radGrad(rx, ry + 10, 10, 260, [[0, 'rgba(155,234,90,.9)'], [1, 'rgba(155,234,90,0)']]), stroke: BD.slime, lwPx: 5 }); X.restore(); }
    // Robo
    const grab = seg(t, L.prepare, L.pfor), back = seg(t, L.pfor + .05, L.delivery + .1), swapped = t > L.pfor;
    const RA = robo(rx, ry, 3.6, roboTurn ? { ...roboDance(t), red: 1, mouth: roboMouth(t, 'grin'), glitch: .15 }
      : t < L.target ? { red: 1, brows: 'quizzical', mouth: roboMouth(t, 'smirk'), handL: [-2.6, -11.6], handR: [2.6, -11.6], handPoseL: 'fist', handPoseR: 'fist', tilt: .1 * Math.sin(beatPos(t) * Math.PI), lookX: -.8 }
      : { red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), handR: [-5.6, -13], handPoseR: 'claw', handL: [-4.4, -9], handPoseL: 'fist', lookX: -1, turn: -.4 });
    // Alma
    const fedK = seg(t, L.delivery, L.delivery + .5), yuck = t > L.delivery + .55;
    const AA = loc(alma(ax, ay, sA, almaPose(t)));
    bdHat('witch', AA, t);
    if (!swapped) almaLollipop(AA.handL[0], AA.handL[1], sA, { ang: t < L.delivery ? -.15 : -.5 });
    else { line([[AA.handL[0], AA.handL[1] + 20], [AA.handL[0] + 10, AA.handL[1] - 90]], { stroke: BD.ink, lwPx: 11 }); line([[AA.handL[0], AA.handL[1] + 20], [AA.handL[0] + 10, AA.handL[1] - 90]], { stroke: '#FBF7F0', lwPx: 6 });
      bdBroccoli(AA.handL[0] + 10, AA.handL[1] - 80, 15, -.25 + .1 * Math.sin(t * 3)); }
    if (yuck) { X.save(); X.globalAlpha = .35 * seg(t, L.delivery + .55, L.delivery + .9); circle(AA.head[0], AA.head[1] + 30, 150, { fill: radGrad(AA.head[0], AA.head[1] + 30, 10, 150, [[0, '#7CCB4A'], [1, 'rgba(124,203,74,0)']]), stroke: null }); X.restore(); }
    // the arm: out to the lollipop, back with it
    if (grab > 0 && back < 1) {
      const tip = mixPt(mixPt(RA.handR, [AA.handL[0] + 30, AA.handL[1] - 140], easeOut(grab)), RA.handR, easeIn(back));
      bdArm(RA.handR, tip, 32, t, { sag: -.05, open: grab < 1 ? .6 : .1, item: swapped ? (x, y, a) => almaLollipop(x + 10, y + 60, sA * .9, { ang: a + Math.PI / 2 }) : null });
    } else if (back >= 1) almaLollipop(RA.handR[0], RA.handR[1], sA * .9, { ang: .3 });
    if (swapped) poof(AA.handL[0], AA.handL[1] - 100, 120, t - L.pfor);
    // target locked: a reticle on the lollipop
    if (t > L.target - .1 && t < L.prepare + .2) { const k = seg(t, L.target - .1, L.locked2); bdReticle(lollyAt[0], lollyAt[1] - 6.6 * sA, 90, t, k, '#FF3A3A');
      if (t > L.locked2) circle(lollyAt[0], lollyAt[1] - 6.6 * sA, 90 + 200 * easeOut(seg(t, L.locked2, L.locked2 + .3)), { fill: null, stroke: rgba('#FF6060', 1 - seg(t, L.locked2, L.locked2 + .3)), lwPx: 5 }); }
    camEnd();
    if (lockZ > .02) overlay(() => { X.save(); X.globalAlpha = .35 * lockZ; X.fillStyle = '#300'; X.fillRect(0, 0, W, H); X.restore(); });
    sfx('YUCK!', ax + 260, 300, 110, BD.slime, t - L.delivery - .55, { rot: .1, life: 1.2 });
  }
  function almaPose(t) {
    const P = { bpm: 125.98 };
    if (t < 61.0) return { ...almaDance(t, 'disco', P), power: 1, eyes: 'star' };
    if (t < 62.0) return { ...almaDance(t, 'bounce', P), power: .4, eyes: 'wide', mouth: 'O', brows: 'up', handL: [-2.8, -5], handR: [3.3, -6] };
    if (t < 63.0) return { ...almaDance(t, 'star jump', P), power: 1, eyes: 'star' };
    if (t < L.target) return { ...almaDance(t, 'bounce', P), power: .3, eyes: 'wide', mouth: 'O', brows: 'worried', handL: [-2.8, -5], handR: [3.3, -6] };
    if (t < L.prepare) return { eyes: 'wide', brows: 'up', mouth: 'o', handL: [-3.3, -5.5], handR: [3.4, -5] };
    if (t < L.delivery) return { eyes: 'wide', brows: 'up', mouth: 'O', handL: [-3.3, -5.5], handR: [1.1, -11.6], handPoseR: 'palm', jump: .5 * kick(t, L.pfor, 5) };
    const lick = seg(t, L.delivery, L.delivery + .35), yuck = t > L.delivery + .55;
    return { eyes: yuck ? 'squeeze' : 'closed', brows: yuck ? 'worried' : 'normal', mouth: yuck ? 'wobble' : 'O', handL: mixPt([-3.3, -5.5], [-1.6, -8.5], lick), handR: [3.4, -5], tilt: yuck ? .1 * Math.sin(t * 25) : 0, emote: yuck ? 'sweat' : undefined, emoteK: 1 };
  }
  function roboDance(t) {
    const b = Math.floor(beatPos(t)), ph = b % 2, up = Math.sin(frac(beatPos(t)) * Math.PI);
    if (t < 62.0) return { eyes: 'open', brows: 'up', lookX: ph ? .7 : -.4, lookY: ph ? -.8 : .3, handR: ph ? [5.2, -22] : [-1.6, -6], handPoseR: 'point', handL: [-2.6, -9], handPoseL: 'fist', lean: ph ? -.07 : .07, dy: .3 * up };
    return { eyes: 'happy', brows: 'up', hover: up, handL: [-5.6, -14 - 6 * up], handR: [5.6, -14 - 6 * up], handPoseL: 'palm', handPoseR: 'palm', jump: 3 * up };
  }

  // 68.0–76.0 · JENNA: three sheet ghosts on a misty lawn; the scan passes; one munches; the sheet comes off.
  function jennaGhosts(t, lt) {
    const G = [640, 980, 1500], scanTo = kf(t, [[69.6, 520], [70.6, G[0]], [71.1, G[0]], [71.8, G[1]], [72.3, G[1]], [72.9, G[2]]]);
    const yank = 74.0, lift = easeOut(seg(t, yank, yank + .5)), handOver = 75.0;
    cam(t, 1.02 + .03 * Math.sin(lt * .5), 1 + 8 * kick(t, yank, 5));
    bdSky('#0A1024', '#1E2A4A', '#2E3A5C'); bdStars(t, 70, 4, 500); bdMoon(300, 210, 120, .8);
    // a bare tree and a picket fence
    line([[1720, 900], [1700, 520], [1640, 400], [1560, 350]], { stroke: '#0C0A18', lwPx: 40 }); line([[1700, 560], [1800, 420], [1880, 380]], { stroke: '#0C0A18', lwPx: 26 }); line([[1650, 420], [1680, 300]], { stroke: '#0C0A18', lwPx: 18 });
    for (let i = 0; i < 22; i++) { const x = -20 + i * 92; shape([[x, 860], [x, 720], [x + 22, 690], [x + 44, 720], [x + 44, 860]], { fill: '#3A3A58', stroke: BD.ink, lwPx: 3 }); }
    line([[-20, 760], [W + 20, 760]], { stroke: '#3A3A58', lwPx: 16 });
    shape(rectPts(-40, 850, W + 80, 300), { fill: '#16243A', stroke: null });
    bdFog(t, 860, '#9FB4E8', .25, 30);
    // Robo hovers in from the left, then drifts over to the third ghost
    const rX = kf(t, [[68.0, -300], [69.4, 250], [72.9, 270], [73.7, 1240]], ease), rY = 900 + 18 * Math.sin(t * 2.4);
    const susp = t > 72.3 && t < yank;
    const RA = measure(() => robo(rX, rY, 3.0, { hover: 1, red: 1 }));
    // the ghosts
    G.forEach((gx, i) => {
      const jen = i === 2, lit = Math.abs(scanTo - gx) < 120 && t > 69.6 && t < 73.0;
      if (jen && t > yank - .05) {
        // Jenna, caught mid-chocolate
        const ate = t > handOver + .35;
        const JA = kid('jenna', gx, 920, 3.0, ate ? { eyes: 'squeeze', brows: 'worried', mouth: 'wobble', handR: [3.6, -15], handPoseR: 'fist', tilt: .06 * Math.sin(t * 20) }
          : { eyes: t < yank + .6 ? 'wide' : 'happy', brows: 'up', mouth: 'grin', handR: [1.4, -16.5], handPoseR: 'fist', blush: 1, jump: 1.2 * kick(t, yank, 6) });
        if (!ate) bdCandy(JA.handR[0] + 10, JA.handR[1] - 30, 46, 'bar', -.9);
        else bdBroccoli(JA.handR[0], JA.handR[1] + 10, 12, .4 + .1 * Math.sin(t * 3));
        if (t < yank + .6) sfx('!', JA.head[0] + 120, JA.head[1] - 160, 100, BD.orangeLt, t - yank);
        bdGhost(gx, 920, 22, t, { lift, liftDir: -1, ph: i });
      } else {
        bdGhost(gx, 920, 22, t, { ph: i * 1.7, feet: jen ? 'pink' : null, munch: jen && t > 70.4, shake: jen && t > 71.4 && t < 72.4 ? 1 : 0 });
        if (jen && t > 71.5) { const u = seg(t, 71.5, 71.9); bdCandy(gx + 80 + 30 * u, lerp(800, 900, u * u), 28, 'wrap', u * 5, '#FFD54F'); }
      }
      if (lit) { X.save(); X.globalCompositeOperation = 'lighter'; circle(gx, 700, 210, { fill: radGrad(gx, 700, 20, 210, [[0, 'rgba(255,60,60,.35)'], [1, 'rgba(255,60,60,0)']]), stroke: null }); X.restore(); }
    });
    // the scan beam
    if (t > 69.6 && t < 73.1) { X.save(); X.globalCompositeOperation = 'lighter'; shape([RA.eyeL, RA.eyeR, [scanTo + 160, 930], [scanTo - 160, 930]], { fill: 'rgba(255,50,50,.22)', stroke: null }); X.restore(); ellipse(scanTo, 925, 160, 30, { fill: null, stroke: '#FF5A5A', lwPx: 4 }); }
    // Robo, drawn over the ghosts when he reaches Jenna
    const RB = robo(rX, rY, 3.0, { hover: 1, red: 1, brows: susp ? 'quizzical' : 'angry', eyes: susp ? 'squint' : 'open', mouth: susp ? 'smirk' : 'flat', lookX: clamp((scanTo - rX) / 600, -1, 1), lookY: .4,
      emote: susp ? '?' : undefined, emoteK: seg(t, 72.4, 72.6), handR: t > yank - .3 && t < yank + .8 ? [5.4, -22] : [5.2, -12], handPoseR: 'claw', handL: [-4.6, -9], handPoseL: 'fist' });
    if (t > yank - .2 && t < yank + .7) { const u = easeOut(seg(t, yank - .2, yank)); bdArm(RB.handR, mixPt(RB.handR, [G[2] - 40, 440 - lift * 300], u), 26, t, { open: .1 }); }
    if (t > handOver - .4 && t < handOver + .5) { const u = easeOut(seg(t, handOver - .4, handOver)) * (1 - easeIn(seg(t, handOver + .2, handOver + .5)));
      bdArm(RB.handR, mixPt(RB.handR, [G[2] + 60, 640], u), 26, t, { open: .2, item: t < handOver + .2 ? (x, y) => bdBroccoli(x, y + 40, 12, .4) : (x, y) => bdCandy(x, y, 40, 'bar', .4) }); }
    camEnd();
    sfx('MUNCH', G[2] + 160, 560, 70, BD.bone, t - 70.6, { life: .8 }); sfx('MUNCH', G[2] - 150, 520, 60, BD.bone, t - 71.5, { life: .8 });
    sfx('WHOOSH!', G[2], 300, 100, '#BFF3FF', t - yank, { rot: -.1 });
  }

  // 76.0–86.9 · DANNY: a block fort, one block per beat; Robo looms; on the drop it explodes; broccoli.
  const FORT = (() => { const b = [], cols = [-2, 2, -2, 2, -1, 1, -2, 2, -1, 1, 0, -2, 2, -1, 1, 0]; const rows = [0, 0, 1, 1, 0, 0, 2, 2, 1, 1, 0, 3, 3, 2, 2, 1];
    cols.forEach((c, i) => b.push({ c, r: rows[i], t: beatAt(Math.ceil((76.2 - OFF) / SPB) + i) })); return b; })();
  function dannyFort(t, lt) {
    const smash = L.eat2, boom = t >= smash, bk = kick(t, smash, 3), dx = 960, dy = 940, K = 3.3, bs = 118;
    cam(t, 1.0 + .02 * bp(t) + .06 * bk + (boom ? 0 : .04 * seg(t, 80, 83)), boom ? 22 * bk : 1 + 3 * seg(t, 80, 83) * bp(t));
    // a blocky night: pixel sky, pixel moon, block ground
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, 0, 0, H, [[0, '#0E1636'], [1, '#2A2458']]), stroke: null });
    for (let i = 0; i < 40; i++) shape(rectPts(hash(i * 3) * W, hash(i * 7) * 600, 8, 8), { fill: rgba('#FFF6D8', .5 + .5 * Math.sin(t * 2 + i)), stroke: null });
    shape(rectPts(1440, 120, 180, 180), { fill: '#F4F0D8', stroke: BD.ink, lwPx: 5 }); shape(rectPts(1470, 150, 40, 40), { fill: '#D8D2B0', stroke: null }); shape(rectPts(1550, 220, 50, 50), { fill: '#D8D2B0', stroke: null });
    for (let i = 0; i < 3; i++) { const x = ((i * 700 + t * 30) % 2400) - 300; [0, 1, 2, 3].forEach(j => shape(rectPts(x + j * 60, 300 + i * 70 - (j % 3 ? 30 : 0), 70, 40), { fill: 'rgba(200,210,255,.18)', stroke: null })); }
    for (let i = 0; i < 18; i++) pixBlock(-60 + i * bs, dy, bs, 'grass');
    // Robo rises up behind the fort, dim with red eyes, then smashes
    const rise = ease(seg(t, 79.4, 81.2)), wind = ease(seg(t, 82.2, smash - .05));
    if (t > 79.3) {
      const after = boom ? { red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), handL: [-4.6, -9], handPoseL: 'point', handR: [4.0, -14], broccoli: t < L.broc2 + .2 ? 'R' : undefined, handPoseR: 'fist', lookY: .7, lookX: -.2 }
        : { red: 1, brows: 'angry', mouth: 'teeth', handL: mixPt([-4.4, -8.6], [-4.4, -23], wind), handR: mixPt([4.4, -8.6], [4.4, -23], wind), handPoseL: 'fist', handPoseR: 'fist', lookY: .8 };
      layer(() => robo(dx + 300, lerp(1700, dy - 40, rise), 4.4, { ...after, hover: boom ? 0 : 1 }), { filter: boom ? '' : `brightness(${.35 + .25 * rise})` });
    }
    // Danny, with his bucket, smugly hiding (crouches as the wall rises)
    const hidden = seg(t, 79.8, 82.4), fed = seg(t, L.broc2 - .1, L.broc2 + .2), lost = t > smash + .7;
    const DA = kid('danny', dx, dy, K, boom ? { ...KIDS.danny.scared, eyes: fed > .5 ? 'squeeze' : 'wide', brows: 'up', mouth: fed > 0 ? 'O' : 'o', lookY: -1, jump: 2 * kick(t, smash, 5), bucket: lost ? 0 : .9 }
      : { eyes: hidden > .5 ? 'happy' : 'open', mouth: 'smirk', brows: 'normal', dy: 3.0 * hidden, handR: [4.3, -10.4], handL: t < 79 ? [-4.4, -14 + 1.5 * bp(t)] : [-4.2, -11], handPoseL: 'palm', lookX: .3, bucket: .9 });
    if (boom && t > smash + .3 && t < smash + .9) { const u = seg(t, smash + .3, smash + .7); bdArm([dx + 420, 420], mixPt([dx + 420, 420], DA.handR, Math.sin(u * Math.PI)), 28, t, { open: .2, item: u > .5 ? (x, y) => bdBucket(x, y, KIDS.danny.U * K * .85, { fill: .9 }) : null }); }
    if (t > L.broc2 - .4 && fed < 1) { const u = seg(t, L.broc2 - .4, L.broc2 + .2); bdBroccoli(lerp(dx + 420, DA.mouth[0], u), lerp(420, DA.mouth[1] + 30, u), 9, u * 4); }
    bdMouthBroccoli(DA.mouth[0], DA.mouth[1], DANNY_UNIT * K, fed, t, 1);
    // the fort, one block per beat; on the drop every block flies
    FORT.forEach((b, i) => {
      if (t < b.t) return;
      const land = easeIn(seg(t, b.t, b.t + .16)), bx = dx + b.c * bs - bs / 2, by = dy - (b.r + 1) * bs;
      if (!boom) { const sq = .15 * kick(t, b.t + .16, 10); X.save(); X.translate(bx + bs / 2, by + bs); X.scale(1 + sq, 1 - sq); pixBlock(-bs / 2, -bs * (1 - (1 - land) * 4), bs, b.r === 3 ? 'pumpkin' : (b.c + b.r) % 3 ? 'cobble' : 'grass'); X.restore(); return; }
      const a = t - smash, ang = Math.atan2(by - (dy - 200), bx - dx) + (hash(i) - .5), sp = 900 + hash(i * 3) * 900, z = 1 + a * (hash(i * 5) > .5 ? 2.2 : .3);
      X.save(); X.translate(bx + bs / 2 + Math.cos(ang) * sp * a, by + bs / 2 + Math.sin(ang) * sp * a - 500 * a + 1600 * a * a); X.rotate(a * (6 + hash(i) * 6)); X.scale(z, z);
      pixBlock(-bs / 2, -bs / 2, bs, b.r === 3 ? 'pumpkin' : (b.c + b.r) % 3 ? 'cobble' : 'grass'); X.restore();
    });
    camEnd();
    flash(.4 * kick(t, smash, 7));
    sfx('BOOM!', dx, 360, 200, BD.orange, t - smash, { rot: -.06, life: 1.2 });
  }
  // A front-facing pixel block (grass, cobblestone or a carved pumpkin), x, y = top-left, size px.
  function pixBlock(x, y, size, kind) {
    const p = size / 8;
    const pal = kind === 'grass' ? ['#6A4A2E', '#7E5A38', '#5A3E26'] : kind === 'cobble' ? ['#8C8C94', '#6E6E78', '#A6A6AE'] : ['#E07A1A', '#C8650E', '#F09030'];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) X.fillStyle = pal[Math.floor(hash(i * 13 + j * 7 + size) * 3)], X.fillRect(x + i * p, y + j * p, p + .5, p + .5);
    if (kind === 'grass') for (let i = 0; i < 8; i++) { X.fillStyle = i % 2 ? '#5EA83A' : '#4E9030'; X.fillRect(x + i * p, y, p + .5, p * (2 + (hash(i) > .5 ? 1 : 0))); }
    if (kind === 'pumpkin') { X.fillStyle = '#3A1A04'; [[2, 2], [5, 2], [2, 5], [3, 5], [4, 5], [5, 5], [3, 6], [4, 6]].forEach(([a, b]) => X.fillRect(x + a * p, y + b * p, p, p)); X.fillStyle = '#FFD24A'; X.globalAlpha = .6; [[2, 2], [5, 2]].forEach(([a, b]) => X.fillRect(x + a * p + p * .25, y + b * p + p * .25, p * .5, p * .5)); X.globalAlpha = 1; }
    shape(rectPts(x, y, size, size), { fill: null, stroke: BD.ink, lwPx: 4 });
  }

  // 90.1–93.0 · the kids chew in a row, heads forced to bob on the beat; Robo conducts with a broccoli baton.
  function lineup(t, lt) {
    cam(t, 1.0 + .03 * bp(t), 2);
    bdSunburst(W / 2, 500, t, '#C45E12', '#E07A22', 20, .3);
    bdDots('#3B1F5C', .14, 34, 7, t);
    shape(rectPts(-40, 930, W + 80, 200), { fill: '#3B1F5C', stroke: null }); line([[-40, 930], [W + 40, 930]], { stroke: BD.ink, lwPx: 5 });
    const b = Math.floor(beatPos(t)), side = b % 2 ? 1 : -1;
    robo(W / 2, 880, 3.3, { red: .4, eyes: 'happy', brows: 'up', mouth: roboMouth(t, 'grin'), handR: side > 0 ? [5.6, -20] : [1.4, -18], broccoli: 'R', handPoseR: 'fist', handL: [-4.6, -12], handPoseL: 'palm', tilt: .06 * side, jump: .5 * bp(t) });
    [['housam', 230], ['alma', 590], ['jenna', 1330], ['danny', 1700]].forEach(([id, x], i) => {
      const A = kid(id, x, 1060, 3.2, { eyes: frac(t * 1.1 + i * .27) < .6 ? 'closed' : 'squeeze', brows: 'worried', mouth: 'wobble', tilt: .1 * side * (i % 2 ? 1 : -1) * bp(t, 4), dy: .4 * bp(t), ...KIDS[id].hold });
      bdMouthBroccoli(A.mouth[0], A.mouth[1], KIDS[id].U * 3.2, 1, t, i % 2 ? 1 : -1);
    });
    camEnd();
  }

  // 93.0–105.5 · the twins: the confiscated-candy bowl, "mission complete", and the spoil.
  function room(t) {
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: linGrad(0, 0, 0, H, [[0, '#2A1440'], [1, '#4A2468']]), stroke: null });
    for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) bdBat(120 + i * 220 + (j % 2) * 110, 90 + j * 150, 5, 0, 0, 'rgba(20,8,30,.35)');
    shape(rectPts(-40, 820, W + 80, 300), { fill: '#3A2020', stroke: null }); line([[-40, 820], [W + 40, 820]], { stroke: BD.ink, lwPx: 5 });
    for (let i = 0; i < 12; i++) line([[i * 180 - 40, 820], [i * 180 - 160, 1100]], { stroke: '#2A1414', lwPx: 4 });
    // a table for the bowl
    shape(rectPts(420, 760, 700, 40), { fill: '#6E3B22', stroke: BD.ink, lwPx: 5 });
    [450, 1060].forEach(x => shape(rectPts(x, 800, 30, 220), { fill: '#5A2E18', stroke: BD.ink, lwPx: 4 }));
    // the charging dock
    shape(rectPts(1440, 960, 340, 40), { fill: '#3A4048', stroke: BD.ink, lwPx: 5 }); shape(rectPts(1700, 600, 60, 380), { fill: '#4A525C', stroke: BD.ink, lwPx: 5 });
    circle(1730, 640, 16, { fill: frac(t) < .5 ? '#7CFF6B' : '#2E5A2E', stroke: BD.ink, lwPx: 3 });
  }
  const BOWL = [770, 770];
  function bowlScene(t, lt) {
    cam(t, 1.0 + .02 * bp(t), 1);
    room(t);
    const fill = .25 + .75 * ease(seg(t, 93.8, 95.6));
    bdBowl(BOWL[0], BOWL[1], 20, t, { fill });
    // Robo carries the buckets in, tips them, then marches to the dock
    const walkIn = seg(t, 93.0, 93.8), tip = seg(t, 93.9, 95.5), toDock = seg(t, 95.6, 97.2);
    const x = t < 95.6 ? lerp(-200, 520, ease(walkIn)) : lerp(520, 1610, ease(toDock)), walking = (t < 93.8) || (t > 95.6 && t < 97.2);
    const down = ease(seg(t, 97.2, 98.2));
    const RA = robo(x, 960, 3.3, { ...(walking ? roboSafadiWalk(t * 2.6) : {}), red: 1 - down * .7, eyes: down > .5 ? 'squint' : 'happy', mouth: 'grin', brows: 'up',
      ...(t < 95.6 ? { handL: mixPt([-5.2, -12], [-1, -20], tip), handR: mixPt([5.2, -12], [5.6, -20], tip), handPoseL: 'fist', handPoseR: 'fist' } : {}), dy: down, tilt: .1 * down });
    if (t < 95.6) [[RA.handL, 0], [RA.handR, 1]].forEach(([h, i]) => { bdBucket(h[0], h[1], 26, { fill: 1 - tip, swing: -tip * 2.2 * (i ? 1 : 1.1) }); bdBucket(h[0] + 30, h[1] + 20, 22, { fill: 1 - tip, swing: -tip * 2 }); });
    for (let i = 0; i < 26; i++) { const t0 = 94.3 + i * .045; arcCandy(t, t0, t0 + .55, [RA.handR[0], RA.handR[1] + 60], [BOWL[0] + (hash(i) - .5) * 400, BOWL[1] - 260], -60, 30, ['wrap', 'corn', 'bar', 'lolly'][i % 4], i); }
    // the twins peek in at the left edge
    const peek = backOut(seg(t, 96.6, 97.2)), peek2 = backOut(seg(t, 97.1, 97.7));
    twin('safadi', lerp(-260, 250, peek), 1040, 3.4, { lean: .25, eyes: 'wide', brows: 'up', mouth: 'o', lookX: 1, handR: [5.4, -14], handPoseR: 'palm' });
    twin('sami', lerp(-300, 60, peek2), 1060, 3.4, { lean: .32, eyes: 'happy', brows: 'up', mouth: 'grin', lookX: 1, handR: [5.4, -16], handPoseR: 'point' });
    camEnd();
  }
  function missionComplete(t, lt) {
    cam(t, 1.03 + .02 * lt / 3.5, 1);
    layer(() => {
      room(t);
      // the twins gorge behind the bowl
      [['safadi', 560, 0], ['sami', 980, 1]].forEach(([who, x, i]) => {
        const ph = frac(t * 2.2 + i * .5), toMouth = ph < .5, h = toMouth ? [1.2, -18.5] : [3.4, -10.5];
        const A = twin(who, x, 900, 3.0, { eyes: 'happy', brows: 'up', mouth: toMouth ? 'O' : 'grin', handR: h, handPoseR: 'fist', handL: [-3.6, -11], handPoseL: 'palm', tilt: .06 * Math.sin(t * 6 + i), emote: 'heart', emoteK: 1, flip: i === 1 });
        if (toMouth) bdCandy(A.handR[0], A.handR[1] - 20, 30, ['wrap', 'bar'][i], t * 4);
      });
      bdBowl(BOWL[0], BOWL[1], 20, t, { fill: .85 - .1 * seg(t, 98.2, 101.7) });
      for (let i = 0; i < 6; i++) { const u = frac(t * 1.4 + i / 6); bdCandy(BOWL[0] + (hash(i) - .5) * 400 + u * (i % 2 ? 200 : -200), 500 - 300 * Math.sin(u * Math.PI), 26, ['wrap', 'corn'][i % 2], u * 6); }
    }, { blur: 2.2 });
    // Robo in the foreground, powering down, content
    const peek = t > 100.9, check = backOut(seg(t, L.complete, L.complete + .3));
    const A = roboHeadAt(1500, 470, 7.5, { eyes: peek ? 'squint' : 'closed', red: peek ? .8 * seg(t, 100.9, 101.2) : 0, brows: peek ? 'quizzical' : 'normal', mouth: peek ? 'flat' : roboMouth(t, 'smile'), dy: .6, tilt: peek ? 0 : .08, lookX: -1, hum: false });
    if (check > .01 && !peek) { X.save(); X.translate(A.head[0] - 380, A.head[1] - 260); X.scale(check, check); circle(0, 0, 70, { fill: '#6CC24A', stroke: BD.ink, lwPx: 6 }); line([[-30, 0], [-8, 24], [32, -24]], { stroke: '#FFFFFF', lwPx: 14 }); X.restore(); }
    camEnd();
    sfx('crinkle…', 760, 360, 70, BD.bone, t - 100.4, { life: 1.0 });
  }
  function spoil(t, lt) {
    const zap = 102.55, poofT = 102.8, broc = ease(seg(t, poofT, poofT + .5)), sad = t > L.broc3 - .1;
    cam(t, 1.0 + .05 * kick(t, L.eat3, 4), 12 * kick(t, poofT, 5) + 3 * bp(t));
    room(t);
    [['safadi', 560, 0], ['sami', 980, 1]].forEach(([who, x, i]) => {
      const ph = frac(t * 2.2 + i * .5), toMouth = !sad && ph < .5;
      const A = twin(who, x, 860, 3.2, sad ? { eyes: 'squeeze', brows: 'worried', mouth: 'wobble', handR: [1.6, -18], handPoseR: 'fist', handL: [-3.6, -11], tilt: .08 * Math.sin(t * 20), flip: i === 1 }
        : { eyes: t > L.eat3 ? 'wide' : 'happy', brows: 'up', mouth: t > L.eat3 ? 'O' : (toMouth ? 'O' : 'grin'), handR: toMouth ? [1.2, -18.5] : [3.4, -10.5], handPoseR: 'fist', handL: [-3.6, -11], handPoseL: 'palm', flip: i === 1 });
      if (broc > .5) bdBroccoli(A.handR[0], A.handR[1] + 10, 9, -.4);
      else if (toMouth || t > L.eat3) bdCandy(A.handR[0], A.handR[1] - 20, 30, ['wrap', 'bar'][i], t * 4);
      if (sad) bdMouthBroccoli(A.mouth[0], A.mouth[1], SAFADI_UNIT * 3.2, seg(t, L.broc3, L.broc3 + .2), t, i ? 1 : -1);
    });
    bdBowl(BOWL[0], BOWL[1], 20, t, { fill: .45, broc });
    poof(BOWL[0], BOWL[1] - 300, 360, (t - poofT) * .8);
    // Robo swoops in and zaps
    const sw = easeOut(seg(t, L.eat3, L.eat3 + .5));
    const RA = robo(lerp(2200, 1460, sw), 860 + 20 * Math.sin(t * 3), 3.6, { hover: 1, red: 1, brows: 'angry', mouth: roboMouth(t, 'teeth'), handL: [-5.6, -15], handPoseL: 'point', handR: [4.4, -12], broccoli: 'R', turn: -.4, lookX: -1, lookY: .4, steam: sad ? 0 : .5 });
    if (t > zap && t < poofT + .2) { const k = 1 - seg(t, poofT, poofT + .2); X.save(); X.globalCompositeOperation = 'lighter'; [RA.eyeL, RA.eyeR].forEach(e => line([e, [BOWL[0] + 40, BOWL[1] - 300]], { stroke: `rgba(255,60,60,${.9 * k})`, lwPx: 22 })); X.restore(); }
    camEnd();
    sfx('ZAP!', 1180, 420, 120, '#FF6A6A', t - zap, { rot: .1 }); sfx('POOF!', BOWL[0], 300, 150, BD.slime, t - poofT, { rot: -.08 });
    flash(.5 * kick(t, L.eat3, 7), '#FF3030');
  }

  // 105.5–108.6 · everybody eats broccoli: the whole cast, the kids laughing at the twins, Robo dancing, broccoli confetti.
  function finale(t, lt) {
    cam(t, 1.0 + .03 * bp(t), 2 + 3 * bp(t));
    bdSunburst(W / 2, 460, t, '#2E5E1E', '#F28C28', 24, .4);
    bdDots('#2A1726', .12, 34, 7, t);
    shape(rectPts(-40, 940, W + 80, 200), { fill: '#2A1440', stroke: null }); line([[-40, 940], [W + 40, 940]], { stroke: BD.ink, lwPx: 5 });
    const b = Math.floor(beatPos(t)), side = b % 2 ? 1 : -1;
    robo(W / 2, 600, 2.6, { hover: 1, red: .2, eyes: 'happy', brows: 'up', mouth: roboMouth(t, 'grin'), emote: 'music', emoteK: 1, handL: side > 0 ? [-5.6, -20] : [-5.6, -12], handR: side > 0 ? [5.6, -12] : [5.6, -20], handPoseL: 'palm', handPoseR: 'palm', broccoli: 'R', tilt: .08 * side });
    [['safadi', 790, 0], ['sami', 1130, 1]].forEach(([who, x, i]) => { const A = twin(who, x, 1000, 2.9, { eyes: 'squeeze', brows: 'worried', mouth: 'wobble', handR: [3.6, -11], handPoseR: 'fist', tilt: .05 * Math.sin(t * 18 + i), flip: i === 1 });
      bdMouthBroccoli(A.mouth[0], A.mouth[1], SAFADI_UNIT * 2.9, 1, t, i ? 1 : -1); });
    [['housam', 160, 1], ['alma', 470, 1], ['jenna', 1450, -1], ['danny', 1760, -1]].forEach(([id, x, dir], i) => {
      const K = KIDS[id], A = kid(id, x, 1060, 2.9, { ...K.laugh, eyes: 'happy', mouth: 'open', brows: 'up', turn: dir * .5, lookX: dir, jump: .8 * bp(t, 5), dy: .3 * Math.abs(Math.sin(t * 10)) });
      bdBroccoli(A.handR[0], A.handR[1] + 10, K.U * 2.9 * .2, .3 * dir);
    });
    camEnd();
    bdConfetti(t, L.every3, 'broccoli', 22);
  }

  // 108.6–116 · the tag: alone in a spotlight, one last candy. Glitch, slump, iris, THE END.
  function glitchTag(t, lt) {
    const notice = 108.8, look = 109.4, pick = 110.3, eat = 110.9, glitchT = 111.3, slump = 112.4, irisT = 113.0;
    cam(t, 1.0 + .03 * seg(t, 108.6, 113), 14 * kick(t, glitchT, 3));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: '#0A0610', stroke: null });
    X.save(); X.globalCompositeOperation = 'lighter'; shape([[W / 2 - 80, -40], [W / 2 + 80, -40], [W / 2 + 520, 980], [W / 2 - 520, 980]], { fill: 'rgba(255,236,190,.16)', stroke: null }); X.restore();
    ellipse(W / 2, 960, 520, 70, { fill: 'rgba(255,236,190,.18)', stroke: null });
    const reach = ease(seg(t, pick - .35, pick)) * (1 - ease(seg(t, pick + .05, eat))), toMouth = ease(seg(t, pick + .05, eat)) * (1 - ease(seg(t, eat + .1, eat + .4)));
    const gl = clamp((t - glitchT) * 3) * (1 - seg(t, slump + .4, slump + 1)), sl = ease(seg(t, slump, slump + .6));
    const o = { red: t < glitchT ? .4 : 1, brows: t < look ? 'quizzical' : t < glitchT ? 'up' : 'worried', eyes: t > glitchT ? 'x' : t > eat ? 'happy' : 'open', mouth: t > glitchT ? 'frown' : t > eat ? 'grin' : 'smirk',
      lookX: t < look ? .7 : t < pick - .4 ? Math.sign(Math.sin((t - look) * 7)) : .4, lookY: t < look ? .9 : .3,
      handR: mixPt(mixPt([4.4, -8.6], [5.6, -4.6], reach), [1.6, -18.5], toMouth), handPoseR: 'claw', dy: 2.4 * reach + 1.5 * sl, tilt: .2 * sl, lean: .12 * sl, antenna: .9 * sl,
      glitch: gl, steam: t > glitchT && t < slump + .5 ? 1 : 0, emote: t < look && t > notice ? '?' : t > eat && t < glitchT ? 'heart' : undefined, emoteK: 1, hum: t < slump };
    const A = robo(W / 2, 960, 3.6, o);
    if (t < pick) bdCandy(W / 2 + 300, 940, 44, 'wrap', .3, '#FF5C8A');
    else if (t < eat) bdCandy(A.handR[0] + 20, A.handR[1] - 10, 44, 'wrap', .3, '#FF5C8A');
    camEnd();
    sfx('BZZT!', W / 2 + 330, 300, 140, '#FFE97A', t - glitchT, { rot: .12, life: 1.3 });
    if (t > irisT) { const k = ease(seg(t, irisT, irisT + 1.2)); iris(A.head[0], A.head[1], lerp(1400, 0, k)); }
    if (t > irisT + 1.3) overlay(() => { const k = easeOut(seg(t, irisT + 1.4, irisT + 2.0)); X.save(); X.globalAlpha = k; X.translate(W / 2, H / 2); X.scale(.8 + .2 * k, .8 + .2 * k);
      X.font = `140px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 26; X.strokeStyle = '#000'; X.strokeText('THE END', 0, 0); X.fillStyle = BD.slime; X.fillText('THE END', 0, 0); X.restore(); });
  }

  // ---------- assembly: every shot gets the karaoke on top, and a few cuts get the slime wipe ----------
  const WIPES = [[47.1, 1], [60.0, -1], [68.0, 1], [76.0, -1], [93.0, 1], [108.6, -1]];
  const withTop = fn => { const g = (t, lt, dur) => { fn(t, lt, dur); for (const [tc, d] of WIPES) if (Math.abs(t - tc) < .32) bdWipe(seg(t, tc - .32, tc + .32), d); bdKaraoke(t); };
    Object.defineProperty(g, 'name', { value: fn.name }); return g; };
  scene({
    duration: 116, fps: 24, bpm: 125.98, beatOffset: OFF,
    shots: [
      [0, nightOpen], [4.2, powerOn], [8.0, title], [14.94, hud], [22.0, sugarMeter], [26.44, compliance], [30.1, lecture],
      [37.6, anthem], [41.2, eatGrid('refuse', L.eats1)], [44.3, scatter], [47.1, housamChase], [60.0, almaBattle], [68.0, jennaGhosts],
      [76.0, dannyFort], [86.88, eatGrid('chew', L.eats2)], [90.1, lineup], [93.0, bowlScene], [98.2, missionComplete], [101.7, spoil],
      [105.5, finale], [108.6, glitchTag],
    ].map(([t0, fn]) => [t0, withTop(fn)]),
  });
})();
