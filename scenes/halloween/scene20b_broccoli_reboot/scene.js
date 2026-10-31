// Scene 20b: The Broccoli Directive 2.0. A music video cut to audio.mp3 ("The Broccoli Penalty"; see README.md for the song map).
// Every shot paints the whole frame from t; the karaoke (lyrics.js) and the wipes go on top. Backdrops and props are scene 17's
// halloween.js (bd*). The four monsters are Alma's drawing (scene 48's costumes/*.png), worn over each kid as in scene 48d: the
// drawing hides its wearer completely until the POP. Every shot is a pure function of t.
(() => {
  // ---------- timing: 120 bpm, beats on 0.225 + 0.5 n (measured on audio.mp3), bars of 2 s ----------
  const OFF = .225, BAR = n => OFF + 2 * n, bp = (t, k = 7) => pulse(t, k);
  const END = 120;
  // the four battles: bar start, Robo's twister, the kid's try, the verdict (all measured on the vocals)
  const BATTLES = [
    { who: 'danny', cost: 'pumpkin', win: true, card: 'cube', theme: ['#7A3A0A', '#C45E12'], at: BAR(24), robo: 50.22, kid: 54.22, verdict: 58.38 },
    { who: 'jenna', cost: 'bee', win: false, card: 'giraffe', theme: ['#5A4A06', '#9C8410'], at: BAR(30), robo: 62.28, kid: 66.22, verdict: 70.72 },
    { who: 'housam', cost: 'bird', win: true, card: 'lizard', theme: ['#103E52', '#2E7D9A'], at: BAR(36), robo: 74.19, kid: 78.24, verdict: 82.62 },
    { who: 'alma', cost: 'pink_ghost', win: false, card: 'monkey', theme: ['#5A1032', '#B0306E'], at: BAR(42), robo: 85.71, kid: 90.22, verdict: 94.70 },
  ];
  const KID_FIRST = { danny: "Danny's", jenna: "Jenna's", housam: "Leo's", alma: "Molly's…" };          // the kid's try starts with this word
  const KID_LINE = id => BR_LYRICS.find(([, who, w]) => who === 'kids' && w[0][1] === KID_FIRST[id])[2];
  const ROBO_WORDS = BR_LYRICS.filter(r => r[1] === 'robo').flatMap(r => r[2].map(w => w[0]));
  const singing = t => ROBO_WORDS.some(w => t >= w && t < w + .3);
  const roboMouth = (t, rest = 'smile') => lipFlap(t, singing(t), rest, ['open', 'O', 'open', 'teeth', 'open']);
  const kidWords = id => KID_LINE(id).map(w => w[0]);
  const kidSinging = (id, t) => kidWords(id).some(w => t >= w && t < w + .3);

  // ---------- the cast ----------
  const RIG = { housam, alma, danny, jenna };
  const UNIT = { housam: HOUSAM_UNIT, alma: ALMA_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT };
  const TALL = { housam: 168, alma: 125, danny: 122, jenna: 135 };                   // world units
  const kOf = (n, base = 3.5) => base * Math.pow(172 / TALL[n], .45);               // the kids a little bigger than life (as in 48d)
  const sOf = (n, base) => UNIT[n] * kOf(n, base);
  // local hand targets, from scene 17's KIDS table
  const POSE = {
    housam: { hold: { handR: [4.3, -10.4] }, cheer: { handL: [-4.1, -21], handR: [4.1, -21], handPoseL: 'fist', handPoseR: 'fist' }, laugh: { handL: [-4.1, -14.1], handR: [4.1, -14.1] } },
    alma: { hold: { handR: [3.6, -4.6] }, cheer: { handL: [-3.2, -13.5], handR: [3.2, -13.5], handPoseL: 'fist', handPoseR: 'fist' }, laugh: { handL: [-.6, -10.6], handR: [.6, -10.6], handPoseL: 'fist', handPoseR: 'fist' } },
    jenna: { hold: { handR: [3.6, -11.2] }, cheer: { handL: [-3.6, -24], handR: [3.6, -24], handPoseL: 'fist', handPoseR: 'fist' }, laugh: { handL: [-.6, -19.0], handR: [.6, -19.0], handPoseL: 'fist', handPoseR: 'fist' } },
    danny: { hold: { handR: [4.3, -10.4] }, cheer: { handL: [-4.0, -19.5], handR: [4.0, -19.5], handPoseL: 'fist', handPoseR: 'fist' }, laugh: { handL: [-3.5, -12.1], handR: [3.5, -12.1] } },
  };
  // Rigs return anchors in SCREEN px (camera included); map them back into the frame we're drawing in (as in scene 17).
  function loc(A) {
    const m = X.getTransform().invertSelf(), out = {};
    for (const k in A) { const p = A[k]; out[k] = Array.isArray(p) && typeof p[0] === 'number' ? [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f] : p; }
    return out;
  }
  // a kid standing at (x, y) at base scale `base`; o.bucket (0..1 candy) hangs a pail from the right hand
  function kid(id, x, y, base, o = {}) {
    const k = kOf(id, base), A = loc(RIG[id](x, y, UNIT[id] * k, { t: T, ...o }));
    if (o.bucket != null) bdBucket(A.handR[0], A.handR[1], UNIT[id] * k * .85, { fill: o.bucket, swing: o.swing ?? .08 * Math.sin(T * 5) });
    return A;
  }
  const robo = (x, y, k, o = {}) => loc(roboSafadi(x, y, ROBO_SAFADI_UNIT * k, o));
  function roboHeadAt(hx, hy, k, o = {}) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); const A0 = measure(() => robo(0, 0, k, o)); X.restore(); return robo(hx - A0.head[0], hy - A0.head[1], k, o); }

  // ---------- the costumes: Alma's drawing, worn (scene 48d's costume(), springUp() and HIDE, for these four) ----------
  const ART = ASSETS.scene.scene20b_broccoli_reboot.dir.replace(/halloween\/[^/]+$/, 'the_trolls/scene48_the_trolls');
  const img = f => { const i = new Image(); i.src = `${ART}/${f}`; return i; };
  const ready = i => i && i.complete && i.naturalWidth > 0;
  const COST = { danny: 'pumpkin', jenna: 'bee', housam: 'bird', alma: 'pink_ghost' };
  const SPR = Object.fromEntries(Object.values(COST).map(n => [n, img(`costumes/${n}.png`)]));
  const COSTUME_H = 720, BASE = 3.0;
  // How each wearer hides inside their drawing (measured for scene 48d at 720 px tall, wearer at BASE): not a pixel shows.
  const HIDE = { pumpkin: { c: 1, fx: 0, fy: -.075 }, pink_ghost: { c: 1, fx: .05, fy: -.15 }, bird: { c: .7, fx: .025, fy: -.375 }, bee: { c: 1, fx: -.2, fy: -.075 } };
  const fit = (kind, h) => { const asp = SPR[kind].naturalWidth / SPR[kind].naturalHeight; let hh = h, ww = h * asp; if (ww > h * 1.4) { ww = h * 1.4; hh = ww / asp; } return { ww, hh }; };
  // a costume standing on (x, y), h px tall. o: who (the wearer, tucked inside), sq, rot, shake (px), off (0..1: it flies off)
  function costume(kind, x, y, h, t, o = {}) {
    const im = SPR[kind]; if (!ready(im)) return { top: [x, y - h], mid: [x, y - h / 2], w: h, h };
    const { ww, hh } = fit(kind, h), hd = o.who && HIDE[kind];
    const off = o.off || 0, sq = o.sq || 0, sx = o.shake ? o.shake * Math.sin(t * 47) : 0, cx = hd ? x - hd.fx * ww : x;
    if (off >= 1) return { top: [cx, y - hh], mid: [cx, y - hh / 2], w: ww, h: hh };
    X.save(); X.translate(cx + sx + off * ww * .6, y - easeOut(off) * h * 1.6); X.rotate((o.rot || 0) + off * 4.2); X.scale((1 + sq) * (1 - .3 * off), (1 - sq) * (1 - .3 * off));
    X.globalAlpha *= 1 - seg(off, .5, 1);
    if (!o.noShadow && !off) { X.save(); X.globalAlpha *= .25; ellipse(0, 4, ww * .38, 18, { fill: '#000', stroke: null }); X.restore(); }
    if (hd && !off) RIG[o.who](hd.fx * ww, hd.fy * hh, sOf(o.who, BASE * h / COSTUME_H) * hd.c, { t });
    X.drawImage(im, -ww / 2, -hh, ww, hh);
    X.restore();
    return { top: [cx, y - hh], mid: [cx, y - hh / 2], w: ww, h: hh };
  }
  // the wearer springing up out of their drawing on the POP: from tucked (HIDE) to standing in u = 0..1
  function springUp(name, x, y, h, u, fn) {
    const hd = HIDE[COST[name]]; if (u >= 1) return fn();
    const { hh } = ready(SPR[COST[name]]) ? fit(COST[name], h) : { hh: h }, k = lerp(hd.c, 1, backOut(u));
    X.save(); X.translate(x, y + hd.fy * hh * (1 - easeOut(u))); X.scale(k, k); X.translate(-x, -y); const A = fn(); X.restore(); return A;
  }
  // a monster that bounces on the beat (hop 0..1 scales the bounce)
  function monster(id, x, y, h, t, o = {}) {
    const ph = o.ph || 0, b = Math.abs(Math.sin((beatPos(t) + ph) * Math.PI)) * (o.hop ?? 1);
    return costume(COST[id], x, y - b * h * .08, h, t, { who: id, sq: -.05 * b + .04 * (1 - b) * (o.hop ?? 1), rot: (o.rot || 0) + .05 * Math.sin((beatPos(t) + ph) * Math.PI) * (o.hop ?? 1), shake: o.shake, off: o.off });
  }

  // ---------- helpers ----------
  function slam(txt, x, y, size, fill, t, t0, o = {}) {                          // a big title word; o.life fades it out
    const age = t - t0; if (age < 0 || (o.life && age > o.life)) return;
    const k = age < .18 ? lerp(3, 1, easeIn(age / .18)) : 1 + .08 * boing(t, t0 + .18, 3, 6), a = o.life ? 1 - seg(age, o.life - .25, o.life) : 1;
    overlay(() => {
      X.save(); X.translate(x, y); X.rotate((o.rot || 0) + .04 * boing(t, t0 + .18, 2, 5)); X.scale(k, k); X.globalAlpha = clamp(age / .1) * a;
      X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = size * .2; X.strokeStyle = BD.ink; X.strokeText(txt, size * .06, size * .08); X.fillStyle = BD.ink; X.fillText(txt, size * .06, size * .08);
      X.strokeText(txt, 0, 0); X.fillStyle = fill; X.fillText(txt, 0, 0);
      X.restore();
    });
  }
  function cam(t, zoom = 1, amt = 0, rot = 0, cx = W / 2, cy = H / 2) { const [dx, dy] = shakeXY(t, amt); camBegin(cx - dx, cy - dy, zoom, rot); }
  function sparkle(x, y, r, age, col = BD.greenLt) {
    if (age < 0 || age > .8) return; const k = easeOut(age / .8);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .3, d = r * (.4 + k);
      X.save(); X.globalAlpha = 1 - k; shape(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .22 * (1 - k * .5), .35, 4, a), { fill: col, stroke: BD.ink, lwPx: 2.5 }); X.restore(); }
  }
  function burst(x, y, t, t0, col = '#FFE45C', n = 14, R = 380) {               // the POP: a starburst of crayon streaks
    const age = t - t0; if (age < 0 || age > .9) return;
    const u = easeOut(seg(age, 0, .5)), a = 1 - seg(age, .45, .9);
    X.save(); X.globalAlpha = a; for (let i = 0; i < n; i++) { const ang = i / n * TAU + .2, r0 = 60 + R * .35 * u, r1 = 90 + R * u;
      line([[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], { stroke: i % 2 ? col : '#FFFDF6', lwPx: 14 }); }
    X.restore();
  }
  function arcCandy(t, t0, t1, a, b, h, size, kind, i = 0) {
    const u = seg(t, t0, t1); if (t < t0 || t > t1) return;
    bdCandy(lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u), size, kind, u * 8 + i);
  }
  function sweat(x, y, s, t, k = 1) {                                             // nervous sweat drops flicking off a head
    for (let i = 0; i < 3; i++) { const u = frac(t * 1.6 + i / 3), a = 1 - u; if (k < .05) return;
      X.save(); X.globalAlpha = a * k; const px = x + (i - 1) * s * .9 + Math.sign(i - 1 || 1) * u * s * .8, py = y + u * s * 1.2 - s * .3 * Math.sin(u * Math.PI);
      shape([[px, py - s * .3], [px + s * .16, py], [px, py + s * .16], [px - s * .16, py]], { fill: '#9FE3FF', stroke: BD.ink, lwPx: 2.5, smooth: .5 }); X.restore(); }
  }
  // the battle's sunburst stage: theme colours, a floor and a spotlight
  function stage(t, th = ['#3A1B63', '#57288A'], o = {}) {
    bdSunburst(o.cx ?? W / 2, o.cy ?? 430, t, th[0], th[1], 20, .22);
    bdDots('#FFFDF6', .07, 36, 6, t);
    bdBats(t, 5, { y: 170, spread: 160, s: 6, speed: 150 });
    shape(rectPts(-40, 900, W + 80, 260), { fill: '#1E1030', stroke: null }); line([[-40, 900], [W + 40, 900]], { stroke: BD.ink, lwPx: 5 });
    for (let i = 0; i < 18; i++) { const x = W / 2 + (i - 8.5) * 150; line([[x, 900], [W / 2 + (x - W / 2) * 1.8, H + 10]], { stroke: 'rgba(255,255,255,.06)', lwPx: 3 }); }
    [[90, 1000, 46], [1830, 1000, 50]].forEach(([x, y, r], i) => bdPumpkin(x, y, r, { glow: .45 + .55 * bp(t), sq: .08 * bp(t), face: i + 1 }));
  }

  // ---------- the picture cards: each twister told in pictures (no words, so the karaoke carries the text) ----------
  const CARD = {
    cube(t, k) {                                                                  // a dizzy Rubik's cube, tumbling down
      const fall = frac(t * .55), y = lerp(-70, 60, easeIn(fall)), rot = t * 2.4;
      X.save(); X.translate(0, y); X.rotate(Math.sin(rot) * .5);
      const cols = ['#E8243C', '#FFD54F', '#4FC3F7', '#6CC24A', '#FF8A1F', '#FFFFFF'];
      for (let i = 0; i < 9; i++) shape(rectPts(-66 + (i % 3) * 44, -66 + Math.floor(i / 3) * 44, 42, 42), { fill: cols[(i + Math.floor(t * 3)) % 6], stroke: BD.ink, lwPx: 4, smooth: .15 });
      X.restore();
      for (let i = 0; i < 4; i++) { const a = t * 4 + i / 4 * TAU; shape(starPts(Math.cos(a) * 110, y - 90 + Math.sin(a) * 26, 16, .4, 5, a), { fill: '#FFE45C', stroke: BD.ink, lwPx: 2.5 }); }
    },
    giraffe(t, k) {                                                               // a giggling giraffe and two jiggling jelly jars
      const gig = Math.sin(t * 18) * .06;
      X.save(); X.translate(-70, 90); X.rotate(-.1 + gig);
      shape([[-20, 0], [20, 0], [26, -150], [6, -150]], { fill: '#FFC94A', stroke: BD.ink, lwPx: 4 });
      [[0, -40], [10, -95], [-4, -125]].forEach(([x, y]) => ellipse(x + 8, y, 9, 12, { fill: '#C7792A', stroke: null }));
      ellipse(30, -165, 44, 28, { fill: '#FFC94A', stroke: BD.ink, lwPx: 4 });
      [-1, 1].forEach(sd => line([[14 + sd * 10, -190], [14 + sd * 14, -212]], { stroke: BD.ink, lwPx: 5 }));
      line([[18, -172], [30, -178], [42, -172]], { stroke: BD.ink, lwPx: 4, smooth: true });   // eyes shut, laughing
      shape([[46, -158], [70, -156], [58, -146]], { fill: '#C3222F', stroke: BD.ink, lwPx: 3 });
      X.restore();
      [[60, 70, '#E8243C'], [125, 80, '#AB7CFF']].forEach(([x, y, c], i) => { const j = Math.sin(t * 14 + i * 2) * .08;
        shape(rectPts(x - 30, y - 70, 60, 70), { fill: 'rgba(255,255,255,.6)', stroke: BD.ink, lwPx: 4, smooth: .2 });
        X.save(); X.translate(x, y - 6); X.scale(1 + j, 1 - j); shape(rectPts(-24, -48, 48, 48), { fill: c, stroke: null, smooth: .4 }); X.restore();
        shape(rectPts(x - 34, y - 82, 68, 14), { fill: '#8C98A0', stroke: BD.ink, lwPx: 3 }); });
    },
    lizard(t, k) {                                                                // a lazy lizard, mid-leap, half asleep
      const u = frac(t * .7), y = -80 * Math.sin(u * Math.PI), x = lerp(-80, 80, u);
      X.save(); X.translate(x, 60 + y); X.rotate(lerp(-.4, .4, u));
      const tail = [[-60, 10], [-110, 30], [-140, 10], [-150, -15]];
      line(tail, { stroke: BD.ink, lwPx: 20, smooth: true }); line(tail, { stroke: '#7CC24A', lwPx: 13, smooth: true });
      ellipse(0, 0, 70, 28, { fill: '#7CC24A', stroke: BD.ink, lwPx: 4 });
      [[-30, 1], [30, 1]].forEach(([lx]) => line([[lx, 18], [lx - 14, 46], [lx - 26, 44]], { stroke: BD.ink, lwPx: 8 }));
      ellipse(68, -14, 34, 22, { fill: '#7CC24A', stroke: BD.ink, lwPx: 4 });
      ellipse(76, -24, 9, 8, { fill: '#FFFDF6', stroke: BD.ink, lwPx: 2.5 }); line([[67, -26], [85, -26]], { stroke: BD.ink, lwPx: 4 });   // a heavy eyelid
      X.restore();
      X.save(); X.globalAlpha = .9; X.font = `48px ${FONT_SFX}`; X.fillStyle = '#FFFDF6'; X.strokeStyle = BD.ink; X.lineWidth = 6;
      const zk = frac(t * .9); X.strokeText('z', 100 + zk * 30, -60 - zk * 50); X.fillText('z', 100 + zk * 30, -60 - zk * 50); X.restore();
    },
    monkey(t, k) {                                                                // a messy monkey with a massive chocolate milkshake
      const bob = Math.sin(t * 6) * 6;
      X.save(); X.translate(-70, 40 + bob);
      circle(0, 0, 64, { fill: '#8B5A34', stroke: BD.ink, lwPx: 4 });
      [-1, 1].forEach(sd => { circle(sd * 64, -6, 22, { fill: '#8B5A34', stroke: BD.ink, lwPx: 4 }); circle(sd * 64, -6, 11, { fill: '#E9C6A6', stroke: null }); });
      ellipse(0, 16, 46, 36, { fill: '#E9C6A6', stroke: BD.ink, lwPx: 3 });
      [-1, 1].forEach(sd => circle(sd * 18, -12, 7, { fill: BD.ink, stroke: null }));
      shape([[-22, 22], [22, 22], [0, 40]], { fill: '#6B3A1E', stroke: BD.ink, lwPx: 3, smooth: .4 });
      [[-30, 34], [24, 44], [6, -46]].forEach(([x, y]) => circle(x, y, 8, { fill: '#5A2E14', stroke: null }));   // chocolate smudges
      X.restore();
      X.save(); X.translate(90, 100);
      shape([[-40, -170], [40, -170], [26, 0], [-26, 0]], { fill: 'rgba(255,255,255,.55)', stroke: BD.ink, lwPx: 4 });
      shape([[-37, -150], [37, -150], [26, -6], [-26, -6]], { fill: '#7A4424', stroke: null });
      [[-22, -178], [4, -192], [26, -176]].forEach(([x, y]) => circle(x, y, 26, { fill: '#FFF8EC', stroke: BD.ink, lwPx: 3 }));
      circle(6, -214, 13, { fill: '#E8243C', stroke: BD.ink, lwPx: 3 });
      line([[14, -180], [40, -250], [62, -258]], { stroke: BD.ink, lwPx: 12 }); line([[14, -180], [40, -250], [62, -258]], { stroke: '#FF7AB6', lwPx: 7 });
      for (let i = 0; i < 3; i++) { const u = frac(t * .8 + i / 3); circle(-38 + i * 30, -150 + u * 140, 7, { fill: '#7A4424', stroke: null, alpha: 1 - u }); }  // drips
      X.restore();
    },
  };
  // a crayon-framed card at (x, y), popping in from k = 0
  function card(kind, x, y, t, k, o = {}) {
    if (k <= .01) return;
    const s = backOut(k) * (o.scale ?? 1), wig = .05 * Math.sin(t * 3) + (o.wig || 0);
    X.save(); X.translate(x, y); X.rotate(wig); X.scale(s, s);
    shape(rectPts(-200, -170, 400, 340), { fill: '#FFF8EC', stroke: BD.ink, lwPx: 8, smooth: .06 });
    shape(rectPts(-184, -154, 368, 308), { fill: null, stroke: o.col || BD.orange, lwPx: 6, smooth: .06, dash: [22, 12] });
    X.save(); X.beginPath(); X.rect(-184, -154, 368, 308); X.clip(); CARD[kind](t, k); X.restore();
    X.restore();
  }

  // ============================== the shots ==============================

  // 0–8.1 · ONE YEAR LATER: a sheet-covered shape on the porch; four little monsters tiptoe in and pull the sheet off.
  const PULL = 6.12;
  function dustOff(t, lt) {
    const push = ease(seg(t, 6.6, 8.1)), off = easeIn(seg(t, PULL, PULL + .6));
    cam(t, 1 + .02 * t + push * .5, 6 * kick(t, PULL, 5), 0, W / 2, lerp(H / 2, 470, push));
    bdSky('#0E0820', '#2E1650', '#5A2A62'); bdStars(t, 110, 4);
    bdMoon(1500, 260, 140); bdBats(t, 6, { y: 230, s: 7, speed: 120 });
    bdHill(720, 50, '#24133D', 1, 0, 1100); bdHouse(360, bdHillY(360, 720, 50, 1, 0, 1100) + 6, 10, t);
    // the porch: boards, a railing, a glowing window
    shape(rectPts(-40, 820, W + 80, 300), { fill: '#3A2638', stroke: null });
    for (let i = 0; i < 9; i++) line([[-40, 840 + i * 30], [W + 40, 840 + i * 30]], { stroke: 'rgba(0,0,0,.25)', lwPx: 3 });
    // Robo, under a sheet (dark), the sheet whips off on the pull
    const rx = W / 2 + 40, ry = 900;
    if (t >= PULL) layer(() => robo(rx, ry, 4.2, { eyes: 'off', mouth: 'flat', red: 0, hum: false, tilt: -.02 }), { filter: 'brightness(.45) saturate(.6)' });
    X.save(); X.translate(rx + off * 900, ry - off * 700); X.rotate(off * 1.6); X.scale(1.2, 1.2); X.globalAlpha = 1 - seg(off, .7, 1);
    const sh = [[-330, 0], [-310, -300], [-230, -520], [-120, -640], [0, -670], [120, -640], [230, -520], [310, -300], [330, 0], [200, -20], [80, 10], [-60, -15], [-200, 10]];
    shape(sh, { fill: linGrad(-330, 0, 330, 0, [[0, '#B9B2CC'], [.5, '#E8E4F2'], [1, '#ABA3C2']]), stroke: BD.ink, lwPx: 6, smooth: .35 });
    for (let i = 0; i < 4; i++) line([[-180 + i * 110, -560 + i * 20], [-120 + i * 90, -60]], { stroke: 'rgba(80,60,110,.25)', lwPx: 5, smooth: true });
    // cobwebs on the sheet
    [[-240, -440], [210, -330]].forEach(([cx, cy]) => { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; line([[cx, cy], [cx + Math.cos(a) * 70, cy + Math.sin(a) * 70]], { stroke: 'rgba(255,255,255,.55)', lwPx: 2 }); }
      [30, 55].forEach(r => shape(ellPts(cx, cy, r, r, 6), { fill: null, stroke: 'rgba(255,255,255,.5)', lwPx: 2 })); });
    X.restore();
    // the monsters tiptoe in from both sides, then tug
    [['danny', -1, 250], ['jenna', -1, 530], ['housam', 1, 1420], ['alma', 1, 1700]].forEach(([id, dir, x0], i) => {
      const inK = ease(seg(t, 2.4 + i * .25, 5.0 + i * .2)), tug = kick(t, PULL, 4), x = lerp(x0 + dir * 900, x0, inK) - dir * 30 * tug;
      monster(id, x, 1010, 340, t, { hop: .35 * (inK < 1 ? 1 : .6), rot: -dir * .12 * tug, ph: i * .5 });
    });
    [[150, 1050, 52], [1780, 1050, 58]].forEach(([x, y, r], i) => bdPumpkin(x, y, r, { glow: .45 + .55 * bp(t), sq: .08 * bp(t), face: i }));
    camEnd();
    sfx('WHOOSH!', W / 2 + 420, 260, 120, BD.bone, t - PULL, { rot: -.1 });
    // ONE YEAR LATER…
    if (t > .6 && t < 4.4) overlay(() => { const k = easeOut(seg(t, .6, 1.2)) * (1 - seg(t, 3.8, 4.4)); X.save(); X.globalAlpha = k; X.translate(W / 2, 200 + (1 - k) * 30);
      X.font = `110px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 22; X.strokeStyle = '#140A1C'; X.strokeText('ONE YEAR LATER…', 0, 0); X.fillStyle = BD.orangeLt; X.fillText('ONE YEAR LATER…', 0, 0); X.restore(); });
  }

  // 8.1–12.2 · the reboot: BEEP (eyes on), BOOP (antenna), a progress bar, the YouToon update (SILLY SELLS), DIRECTIVE 2.0 (red).
  const BEEP = 8.20, BOOP = 8.73, REBOOT = 9.22, DL = 10.24, SILLY = 10.7, DIRECT = 11.67, TWO = 12.19;
  function reboot(t, lt) {
    const red = ease(seg(t, DIRECT, DIRECT + .25)), jolt = kick(t, BEEP, 8) + kick(t, DIRECT, 6);
    cam(t, 1.02 + .05 * lt / 4 + .04 * kick(t, DIRECT, 4), 14 * kick(t, DIRECT, 5) + 3 * kick(t, BEEP, 9));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, H / 2, 100, 1200, [[0, mixCol('#2A1848', '#5A0E1E', red)], [1, '#0B0614']]), stroke: null });
    bdDots(mixCol('#6A4AA8', '#FF4A4A', red), .12, 40, 7, t);
    const A = roboHeadAt(W / 2 - 260, H / 2 + 40, 9.5, {
      eyes: t < BEEP ? 'off' : t < DIRECT ? 'open' : 'wide', red, blink: 0, hum: false, jump: .3 * jolt,
      lookX: t >= REBOOT && t < DIRECT ? Math.sin((t - REBOOT) * 5) * .8 : .5, lookY: t >= SILLY && t < DIRECT ? 0 : 0,
      brows: red > .5 ? 'angry' : t > BOOP ? 'up' : 'normal', mouth: t < BEEP ? 'flat' : roboMouth(t, red > .5 ? 'grin' : 'o'),
      antenna: t > BOOP ? .25 * boing(t, BOOP, 2.5, 3) : 0, glitch: t > REBOOT && t < DL ? .35 * (hash(Math.floor(t * 12)) > .6 ? 1 : 0) : 0,
    });
    // the progress panel on the right
    if (t > REBOOT - .1) {
      const pk = backOut(seg(t, REBOOT - .1, REBOOT + .2)), px = 1380, py = 300;
      X.save(); X.translate(px, py); X.scale(pk, pk);
      shape(rectPts(-330, -110, 660, 220), { fill: 'rgba(10,30,40,.85)', stroke: '#7FE3FF', lwPx: 5, smooth: .06 });
      const label = t < DL ? 'REBOOTING…' : t < DIRECT ? 'DOWNLOADING UPDATE…' : 'DIRECTIVE 2.0';
      X.font = `52px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = t < DIRECT ? '#BFF3FF' : '#FF6A6A'; X.fillText(label, 0, -44);
      const p = t < DL ? seg(t, REBOOT, DL) * .4 : t < DIRECT ? .4 + .6 * easeOut(seg(t, DL, DIRECT - .1)) : 1;
      shape(rectPts(-290, 10, 580, 56), { fill: null, stroke: '#7FE3FF', lwPx: 4, smooth: .2 });
      shape(rectPts(-282, 18, 564 * p, 40), { fill: t < DIRECT ? '#7CFF6B' : '#FF4A4A', stroke: null, smooth: .2 });
      X.restore();
    }
    // the update: a YouToon analytics card (silly sells) slides in under it
    if (t > SILLY) {
      const k = backOut(seg(t, SILLY, SILLY + .3)), cx = 1380, cy = 660;
      X.save(); X.translate(cx + (1 - k) * 700, cy); X.rotate(-.04);
      shape(rectPts(-300, -170, 600, 340), { fill: '#FFFDF6', stroke: BD.ink, lwPx: 6, smooth: .06 });
      shape(rectPts(-270, -140, 110, 76), { fill: '#E8243C', stroke: BD.ink, lwPx: 4, smooth: .3 }); shape([[-232, -124], [-232, -80], [-196, -102]], { fill: '#FFFFFF', stroke: null });
      X.font = `44px ${FONT_SFX}`; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillStyle = BD.ink; X.fillText('YouToon', -140, -102);
      const g = seg(t, SILLY + .2, SILLY + .9), pts = [[-240, 120], [-140, 100], [-40, 110], [60, 40], [160, -20], [240, -60]];
      line(polySlice(pts, 0, easeOut(g)), { stroke: '#2EAA4A', lwPx: 12, cap: 'round' });
      if (g >= 1) shape([[240, -60], [200, -66], [230, -30]], { fill: '#2EAA4A', stroke: null });
      X.font = `58px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#E0A800'; X.lineWidth = 10; X.strokeStyle = BD.ink;
      const sk = backOut(seg(t, SILLY + .6, SILLY + .9)); X.save(); X.translate(0, 0); X.scale(sk, sk); X.strokeText('SILLY SELLS!', 0, 30); X.fillText('SILLY SELLS!', 0, 30); X.restore();
      X.restore();
    }
    camEnd();
    sfx('BEEP', 260, 200, 100, '#BFF3FF', t - BEEP, { rot: -.15 });
    sfx('BOOP', 760, 170, 100, '#BFF3FF', t - BOOP, { rot: .12 });
    flash(.6 * kick(t, DIRECT, 5), '#FF3030');
  }

  // 12.2–16.2 · the title: THE / BROCCOLI / DIRECTIVE / 2.0 slam in on the beats ("two-point-ohhh…"); Robo hovers, then rushes the lens.
  function title(t, lt) {
    const rush = easeIn(seg(t, 15.5, 16.22));
    cam(t, 1 + .025 * bp(t, 9) + rush * 1.6, 4 * bp(t, 9), 0, W / 2, lerp(H / 2, 380, rush));
    bdSunburst(W / 2, 470, t, '#3A1B63', '#57288A', 20, .25);
    bdDots('#F28C28', .1, 36, 6, t);
    bdMoon(W / 2, 470, 230 + 12 * bp(t), .9);
    bdBats(t, 10, { y: 300, spread: 420, s: 7, speed: 220 });
    for (let i = 0; i < 9; i++) { const b = Math.floor(beatPos(t)), on = (b + i) % 2 === 0, hop = on ? Math.sin(frac(beatPos(t)) * Math.PI) : 0;
      bdPumpkin(110 + i * 212, 1090 - 70 * hop, 66, { glow: .5 + .5 * hop, sq: on ? -.08 * hop : .06, face: i % 3, rot: .1 * Math.sin(t * 3 + i) }); }
    const rise = backOut(seg(t, 12.2, 13.0));
    robo(W / 2, lerp(1500, 900, rise) + 14 * Math.sin(t * 3) + rush * 300, 3.9 + rush * 9, {
      hover: 1, red: 1, brows: 'up', mouth: roboMouth(t, 'grin'), handL: [-5.6, -21.5], handPoseL: 'fist', handR: [5.4, -21.5], broccoli: 'R', eyes: 'happy',
      tilt: .06 * Math.sin(beatPos(t) * Math.PI) });
    camEnd();
    slam('THE', 330, 330, 100, BD.cream, t, BAR(6), { rot: -.14 });
    slam('BROCCOLI', 460, 470, 175, BD.slime, t, BAR(6) + .5, { rot: -.08 });
    slam('DIRECTIVE', 1460, 600, 175, BD.orange, t, BAR(6) + 1.0, { rot: .07 });
    slam('2.0', 1560, 300, 230, BD.pink, t, BAR(7), { rot: .12 });
    flash(.5 * kick(t, BAR(6) + .5, 7) + .6 * kick(t, BAR(7), 7));
  }

  // 16.2–24.1 · Robo's HUD: four little monsters at the door. The reticles lock on… and read UNKNOWN UNIT ?, then glitch out.
  const HUD_M = [['danny', 250], ['jenna', 600], ['housam', 960], ['alma', 1340]], LOCKS = [16.22, 17.21, 17.72, 18.71], CANT = 20.76;
  function unknownUnits(t, lt) {
    const on = easeOut(seg(t, 16.0, 16.3)), pan = 1 - ease(seg(t, 16.0, 17.0)), gl = t > CANT ? .6 + .4 * Math.sin(t * 30) : 0;
    cam(t, 1.05 + .03 * Math.sin(lt * .8), 2 + 4 * (t > CANT ? bp(t) : 0), 0, W / 2 + pan * 420, H / 2);
    layer(() => {
      bdSky('#0B0710', '#2A2230'); bdMoon(300, 150, 80, .6); bdStars(t, 50, 5, 420);
      shape(rectPts(1500, 140, 900, 820), { fill: '#3C3346', stroke: BD.ink, lwPx: 3 });
      shape(rectPts(1640, 470, 230, 420), { fill: '#5A4A60', stroke: BD.ink, lwPx: 4 }); circle(1700, 420, 26, { fill: '#FFE7A0', stroke: BD.ink, lwPx: 3 });
      shape(rectPts(-200, 890, W + 600, 300), { fill: '#24202A', stroke: null }); line([[-200, 890], [W + 600, 890]], { stroke: '#4A4452', lwPx: 4 });
      [[1560, 960, 52], [1950, 960, 60]].forEach(([x, y, r], i) => bdPumpkin(x, y, r, { glow: .8, face: i }));
      HUD_M.forEach(([id, x], i) => monster(id, x, 930, 300, t, { hop: .5, ph: i * .5 }));
    }, { filter: 'grayscale(1) sepia(1) saturate(6) hue-rotate(-38deg) brightness(.92) contrast(1.15)' });
    HUD_M.forEach(([id, x], i) => {
      const t0 = LOCKS[i]; if (t < t0 - .45) return;
      const k = seg(t, t0 - .45, t0), jx = gl * (hash(Math.floor(t * 20) + i) - .5) * 60, cx = lerp(x + 260, x, easeOut(k)) + jx, cy = lerp(300, 780, easeOut(k));
      bdReticle(cx, cy, 130, t, t >= t0 ? (t > CANT ? .7 : 1) : k * .8, '#FF5050');
      if (t >= t0) overlay(() => { X.save(); X.font = `38px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#FF8080'; X.globalAlpha = t > CANT ? (frac(t * 4) < .6 ? 1 : .3) : 1;
        X.fillText(t > CANT ? 'ERROR' : 'UNIT ?', cx, cy - 170); X.restore(); });
      if (t > CANT && t < CANT + 3) slam('?', cx + 70, cy - 60, 120, '#FFE45C', t, CANT + i * .25, { rot: .15 * Math.sin(t * 3 + i) });
    });
    bdHudFrame(t);
    if (t > CANT) overlay(() => { X.save(); X.globalAlpha = .25 * gl; for (let i = 0; i < 14; i++) { const y = hash(Math.floor(t * 18) + i * 7) * H; X.fillStyle = i % 2 ? '#FF5050' : '#FFFFFF'; X.fillRect(0, y, W, 4 + 10 * hash(i)); } X.restore(); });
    camEnd();
    if (on < 1) overlay(() => { const hh = H / 2 * on; X.fillStyle = '#000'; X.fillRect(0, 0, W, H / 2 - hh); X.fillRect(0, H / 2 + hh, W, H / 2 - hh + 1); });
  }

  // 24.1–32.2 · the deal: candy in one gripper, broccoli in the other. TWIST YOUR TONGUE… or BROCCOLI's your meal.
  const NEW = 24.0, DEAL = 25.72, TWIST = 27.50, TONGUE = 28.72, OR = 29.71, MEAL = 31.03;
  function deal(t, lt) {
    const thrust = backOut(seg(t, OR, OR + .4)), push = ease(seg(t, OR, 32.0));
    cam(t, 1.0 + .04 * lt / 8 + .25 * push, 3 * bp(t) + 10 * kick(t, OR, 5), 0, W / 2, lerp(H / 2, 520, push));
    bdSunburst(W / 2, 400, t, '#2A0610', '#5A0E1E', 22, .4);
    bdDots('#FF4A4A', .1, 34, 6, t);
    shape(rectPts(-40, 960, W + 80, 200), { fill: '#1A0A10', stroke: null });
    // a big twisty spiral behind him on "twist your tongue"
    const sw = ease(seg(t, TWIST, TWIST + .4)) * (1 - ease(seg(t, OR, OR + .3)));
    if (sw > 0) { X.save(); X.translate(W / 2, 470); X.rotate(-t * 4); X.globalAlpha = .55 * sw; const sp = []; for (let i = 0; i <= 120; i++) { const a = i * .18, r = i * 4.5; sp.push([Math.cos(a) * r, Math.sin(a) * r]); }
      line(sp, { stroke: BD.pink, lwPx: 34, smooth: true }); X.restore(); }
    const both = ease(seg(t, DEAL - .1, DEAL + .3));
    const A = robo(W / 2, 960, 4.4 + .8 * push, {
      red: 1, brows: t < TWIST ? 'up' : 'angry', mouth: roboMouth(t, 'grin'), eyes: 'open',
      handL: mixPt([-4.4, -8.6], [-6.4, -18], both), handPoseL: 'fist',
      handR: mixPt(mixPt([4.4, -8.6], [6.4, -18], both), [3.0, -15], thrust), handPoseR: 'fist', broccoli: 'R',
      tilt: .05 * Math.sin(beatPos(t) * Math.PI), jump: .2 * bp(t, 5) });
    if (both > .1) bdCandy(A.handL[0] - 10, A.handL[1] - 50, 70 * both, 'lolly', -.3 + .1 * Math.sin(t * 4), '#FF7AB6');
    if (t > DEAL) { sparkle(A.handL[0], A.handL[1] - 80, 120, t - DEAL, '#FF8FC8'); sparkle(A.handR[0], A.handR[1] - 110, 130, t - DEAL - .1); }
    camEnd();
    slam('DIRECTIVE 2.0', W / 2, 160, 110, BD.orange, t, NEW + .1, { life: 1.9, rot: -.05 });
    slam('TWIST', 470, 300, 150, BD.pink, t, TWIST, { life: 2.2, rot: -.12 });
    slam('YOUR TONGUE', 1440, 300, 130, BD.pink, t, TONGUE, { life: 1.1, rot: .08 });
    slam('OR…', W / 2, 130, 120, BD.cream, t, OR, { life: .45 });
    slam('BROCCOLI!', W / 2, 130, 160, BD.slime, t, 30.19, { rot: -.06 });
    flash(.4 * kick(t, OR, 8), '#E9FFD0');
  }

  // 32.2–48.2 · the chorus: TWIST IT / OR / EAT IT! The monsters bounce in a row (and jump on EAT IT!), Robo conducts.
  const CH_ROW = [['danny', 210], ['jenna', 540], ['housam', 1380], ['alma', 1720]];
  function chorus(c) {                    // c: the chorus's word times
    return function chorus(t, lt) {
      const big = kick(t, c.eat1, 5) + kick(t, c.eat2, 5);
      cam(t, 1.0 + .03 * bp(t, 9) + .04 * big, 3 * bp(t, 9) + 10 * big);
      bdSunburst(W / 2, 460, t, '#3A1B63', mixCol('#57288A', '#C45E12', .5 + .5 * Math.sin(t * .8)), 22, .35);
      bdDots('#FFC266', .1, 36, 6, t);
      shape(rectPts(-40, 980, W + 80, 200), { fill: '#24123C', stroke: null }); line([[-40, 980], [W + 40, 980]], { stroke: BD.ink, lwPx: 5 });
      // Robo conducts with the broccoli baton, a beat each way
      const b = Math.floor(beatPos(t)), side = b % 2 ? 1 : -1, sw = Math.sin(frac(beatPos(t)) * Math.PI);
      robo(W / 2, 800 + 14 * Math.sin(t * 3), 3.0, { hover: 1, red: .6, eyes: 'happy', brows: 'up', mouth: roboMouth(t, 'grin'),
        handR: [5.4 * side, -21 + 4 * sw], broccoli: 'R', handPoseR: 'fist', handL: [-5.6, -14 + 2 * sw], handPoseL: 'point', tilt: .06 * side });
      CH_ROW.forEach(([id, x], i) => {
        const jmp = Math.max(Math.max(0, Math.sin(seg(t, c.eat1, c.eat1 + .55) * Math.PI)), Math.max(0, Math.sin(seg(t, c.eat2, c.eat2 + .55) * Math.PI)));
        monster(id, x, 1020 - jmp * 160, 320, t, { hop: .8, ph: i % 2 ? .5 : 0, rot: jmp * .2 * (i % 2 ? 1 : -1) });
      });
      camEnd();
      slam('TWIST IT', 520, 220, 150, BD.pink, t, c.twist1, { life: 1.6, rot: -.08 });
      slam('OR', W / 2, 320, 110, BD.cream, t, c.twist1 + .45, { life: 1.15 });
      slam('EAT IT!', 1400, 220, 170, BD.slime, t, c.twist1 + .76, { life: 1.9, rot: .07 });
      slam('×5', W / 2, 260, 200, BD.orangeLt, t, c.five, { life: 1.3, rot: -.1 });
      slam('FAST!', W / 2, 260, 180, BD.orange, t, c.fast, { life: 1.1, rot: .1 });
      slam('TWIST IT', 520, 220, 150, BD.pink, t, c.twist2, { life: 1.5, rot: -.08 });
      slam('EAT IT!', 1400, 220, 170, BD.slime, t, c.twist2 + .77, { life: 1.9, rot: .07 });
      slam('BROCCOLI!', W / 2, 250, 170, BD.slime, t, c.broc, { life: 2.0, rot: -.05 });
      slam('EVERYBODY!', W / 2, 230, 150, BD.orangeLt, t, c.every, { life: 2.2 });
      slam('OR EAT BROCCOLI!', W / 2, 230, 140, BD.slime, t, c.last, { rot: .04 });
      flash(.35 * big, '#FFF3C4');
    };
  }
  const CH1 = { twist1: 32.25, eat1: 33.70, five: 35.73, fast: 36.67, twist2: 37.95, eat2: 39.66, broc: 42.00, every: 44.17, last: 46.95 };
  const CH2 = { twist1: 96.06, eat1: 97.72, five: 100.67, fast: 101.29, twist2: 102.00, eat2: 103.65, broc: 106.52, every: 108.53, last: 111.08 };

  // 48.2–96.2 · the four battles. A monster vs Robo: WHO'S INSIDE? · Robo sings the twister (a picture card) · the monster
  // tries it (nails it: bounces and sparkles; flubs it: wobbles and sweats) · POP: the drawing flies off · CANDY! or BROCCOLI!
  const MX = 600, MY = 940, MH = 600, RX = 1440;
  function battle(i) {
    const B = BATTLES[i], id = B.who;
    return function battle(t, lt) {
      const pop = B.verdict - .05, sting = t < B.robo - .2, roboTurn = t >= B.robo - .2 && t < B.kid - .1, kidTurn = t >= B.kid - .1 && t < pop;
      const words = kidWords(id), last = words[words.length - 1], tries = seg(t, B.kid, last + .3);
      // camera: wide on the sting, toward Robo for his twister, toward the monster for theirs, wide on the verdict
      const focus = roboTurn ? 1 : kidTurn ? -1 : 0, f = lerp(0, focus, ease(clamp((t - (roboTurn ? B.robo - .2 : kidTurn ? B.kid - .1 : pop)) / .5)));
      cam(t, 1.0 + .08 * Math.abs(f) + .05 * kick(t, pop, 4), 2 + 12 * kick(t, pop, 5) + (kidTurn && !B.win ? 4 * tries : 0), 0, W / 2 + f * 180, H / 2 + Math.abs(f) * 20);
      stage(t, B.theme);
      // Robo on the right
      const cheer = t > pop && B.win, give = t > pop && !B.win, reach = ease(seg(t, pop + .25, pop + .8)) * (1 - ease(seg(t, pop + 1.8, pop + 2.3)));
      const RA = robo(RX, 960, 3.4, { red: t > pop ? .4 : 1, eyes: cheer ? 'happy' : kidTurn ? 'squint' : 'open', brows: kidTurn ? 'quizzical' : 'up',
        mouth: roboMouth(t, cheer ? 'grin' : 'smile'), turn: -.3, lookX: -.8,
        handL: give ? mixPt([-4.4, -8.6], [-6.4, -15], reach) : roboTurn ? [-5.6, -16 + 2 * bp(t)] : [-4.4, -8.6], handPoseL: give ? 'fist' : 'point',
        handR: [4.4, -8.6], handPoseR: 'fist', broccoli: give ? 'L' : undefined, jump: cheer ? .4 * bp(t, 5) : 0, emote: kidTurn && t > last ? '?' : undefined, emoteK: 1 });
      // the reticle on the monster during the sting
      if (sting) { const k = seg(t, B.at + .1, B.at + .7); bdReticle(MX, MY - MH * .5, 260, t, k, '#FF5050'); }
      // the monster on the left: in the drawing until the POP, then the kid springs up out of it
      const off = seg(t, pop, pop + .6), up = seg(t, pop + .05, pop + .45);
      const nerves = kidTurn && !B.win ? tries : 0, nail = kidTurn && B.win;
      const dropIn = easeOut(seg(t, B.at - .05, B.at + .35));
      if (t < pop + .6) monster(id, MX, MY - (1 - dropIn) * 900, MH, t, { hop: nail ? 1 : sting ? .5 : .35 + nerves * .3, shake: nerves * 10, rot: nerves * .12 * Math.sin(t * 9), off });
      if (t > pop) {
        const bk = kOf(id, BASE * MH / COSTUME_H), P = POSE[id];
        const face = B.win ? { eyes: 'happy', mouth: 'open', brows: 'up', ...P.cheer, jump: .6 * bp(t, 5) }
          : id === 'jenna' ? { eyes: 'happy', mouth: 'open', brows: 'up', ...P.laugh, tilt: .06 * Math.sin(t * 16) }
          : { eyes: t > pop + 1 ? 'squeeze' : 'wide', mouth: t > pop + 1 ? 'wobble' : 'o', brows: 'worried', ...P.hold };
        const A = springUp(id, MX, MY, MH, up, () => kid(id, MX, MY, 4.6, { ...face, turn: .3, lookX: .6, bucket: B.win ? .4 + .6 * ease(seg(t, pop + .4, pop + 1.4)) : .15 }));
        if (B.win) {
          for (let j = 0; j < 6; j++) arcCandy(t, pop + .35 + j * .16, pop + 1.0 + j * .16, [RX - 120, 520], [A.handR[0], A.handR[1] + 60], 240, 40, ['wrap', 'corn', 'bar', 'lolly'][j % 4], j);
          sparkle(A.head[0], A.head[1] - 120, 200, t - pop - .3, '#FFE45C');
        } else {
          // the gripper hands over the broccoli
          if (reach > .02) bdArm(RA.handL, mixPt(RA.handL, [A.handR[0] + 40, A.handR[1] - 40], reach), 46, t, { sag: .05, open: .3,
            item: (x, y) => bdBroccoli(x, y + 60, 15, -1.4) });
          if (t > pop + 1.9) bdBroccoli(A.handR[0] + 10, A.handR[1] + 6, 15, -.5);
          if (id === 'jenna' && t > pop + 1.2) sfx('hee hee!', A.head[0] - 220, A.head[1] - 120, 70, BD.pink, t - pop - 1.2, { rot: -.1, life: 1.2 });
        }
      }
      // the monster's nerves (a flub): sweat drops off its top
      if (nerves > .2 && t < pop) sweat(MX + 140, MY - MH * .8, 34, t, nerves);
      if (nail && t < pop) words.forEach(w => sparkle(MX + 220, MY - MH * .7, 120, t - w, '#FFE45C'));
      burst(MX, MY - MH * .5, t, pop);
      camEnd();
      // the picture card: pops in with Robo's twister, shrinks to the corner during the try, gone on the verdict
      const ck = seg(t, B.robo - .2, B.robo + .2), shrink = ease(seg(t, B.kid - .2, B.kid + .3)), gone = seg(t, pop - .1, pop + .2);
      if (ck > 0 && gone < 1) overlay(() => card(B.card, lerp(W / 2 - 20, W / 2 + 40, shrink), lerp(320, 190, shrink), t, ck * (1 - gone), { scale: lerp(1.0, .6, shrink), col: B.theme[1], wig: nerves * .2 * Math.sin(t * 12) }));
      // titles
      slam("WHO'S INSIDE?", W / 2, 170, 130, BD.orangeLt, t, B.at + .1, { life: 1.8, rot: -.05 });
      slam('?', MX + 30, MY - MH * .5, 260, '#FFE45C', t, B.at + .5, { life: 1.4, rot: .12 * Math.sin(t * 3) });
      slam(B.win ? 'CANDY!' : 'BROCCOLI!', W / 2 + 60, 200, 190, B.win ? '#FFD54F' : BD.slime, t, B.verdict, { rot: B.win ? -.06 : .06 });
      sfx('POP!', MX + 200, MY - MH * .9, 150, '#FFFDF6', t - pop, { rot: -.1 });
      flash(.35 * kick(t, pop, 7));
    };
  }

  // 96.2–112.2 · the second chorus: the winners share. Danny tosses candy to Jenna, Housam to Alma; Robo sees it (heart eyes).
  // Then everybody dances, and on "or eat broccoli!" all four take a sporting bite. Candy and broccoli confetti.
  const SHARE = [['danny', 'jenna', 99.45], ['housam', 'alma', 100.67]], LOVE = 102.0, BITE = 111.08;
  const ROW2 = [['danny', 260, 1], ['jenna', 640, 1], ['housam', 1280, -1], ['alma', 1660, -1]];
  function chorus2(t, lt) {
    const c = CH2, big = kick(t, c.eat1, 5) + kick(t, c.eat2, 5);
    cam(t, 1.0 + .03 * bp(t, 9) + .04 * big, 3 * bp(t, 9) + 8 * big);
    bdSunburst(W / 2, 460, t, '#2E5E1E', '#F28C28', 24, .35);
    bdDots('#2A1726', .12, 34, 7, t);
    shape(rectPts(-40, 980, W + 80, 200), { fill: '#2A1440', stroke: null }); line([[-40, 980], [W + 40, 980]], { stroke: BD.ink, lwPx: 5 });
    const love = t > LOVE, dance = t > 104.2, bite = ease(seg(t, BITE, BITE + .3));
    const b = Math.floor(beatPos(t)), side = b % 2 ? 1 : -1;
    const RA = robo(W / 2, 800 + 14 * Math.sin(t * 3), 2.6, { hover: 1, red: .2, eyes: love ? 'heart' : 'happy', brows: 'up', mouth: roboMouth(t, 'grin'),
      emote: love && t < 104.5 ? 'heart' : dance ? 'music' : undefined, emoteK: 1,
      handL: dance ? (side > 0 ? [-5.6, -20] : [-5.6, -12]) : [-5.6, -15], handR: dance ? (side > 0 ? [5.6, -12] : [5.6, -20]) : [5.4, -21], handPoseL: 'palm', handPoseR: 'fist', broccoli: 'R', tilt: dance ? .08 * side : 0 });
    const pos = {};
    ROW2.forEach(([id, x, dir], i) => {
      const P = POSE[id], winner = id === 'danny' || id === 'housam', shared = t > (SHARE.find(s => s[1] === id) || [0, 0, 999])[2] + 1.2;
      const glum = !winner && !shared;
      const o = bite > 0 ? { eyes: 'squeeze', mouth: 'wobble', brows: 'worried', ...P.hold, tilt: .05 * Math.sin(t * 18 + i) }
        : glum ? { eyes: 'open', mouth: 'frown', brows: 'worried', ...P.hold }
        : dance ? { eyes: 'happy', mouth: 'open', brows: 'up', ...P.laugh, jump: .7 * bp(t, 5), dy: .3 * Math.abs(Math.sin(t * 10)) }
        : { eyes: 'happy', mouth: 'smile', brows: 'up', ...P.hold };
      pos[id] = kid(id, x, 1050, 2.6, { ...o, turn: dir * .45, lookX: dir, bucket: winner ? 1 - .25 * (t > 100) : shared ? .6 : .1 });
      const A = pos[id];
      if (!winner && !shared && bite <= 0) bdBroccoli(A.handR[0] + 40, A.handR[1] + 10, 11, -.4);
      if (bite > 0) bdMouthBroccoli(A.mouth[0], A.mouth[1], UNIT[id] * kOf(id, 2.6), bite, t, dir);
    });
    // the candy toss
    SHARE.forEach(([from, to, t0], s) => { for (let j = 0; j < 4; j++) arcCandy(t, t0 + j * .25, t0 + .9 + j * .25, [pos[from].handR[0], pos[from].handR[1]], [pos[to].handR[0], pos[to].handR[1] + 40], 300, 36, ['wrap', 'bar', 'lolly', 'corn'][(j + s) % 4], j + s * 4); });
    if (love) sparkle(RA.head[0], RA.head[1] - 140, 180, t - LOVE, BD.pink);
    camEnd();
    slam('TWIST IT', 520, 150, 140, BD.pink, t, c.twist1, { life: 1.6, rot: -.08 });
    slam('EAT IT!', 1400, 150, 150, BD.slime, t, c.twist1 + .94, { life: 1.6, rot: .07 });
    slam('SHARING!', W / 2, 150, 150, '#FFD54F', t, 99.45, { life: 2.4, rot: -.06 });
    slam('SWEET!', W / 2, 150, 160, BD.pink, t, LOVE, { life: 1.6, rot: .06 });
    slam('EAT IT!', 1400, 150, 150, BD.slime, t, c.eat2, { life: 1.3, rot: .07 });
    slam('EVERYBODY!', W / 2, 150, 140, BD.orangeLt, t, c.every, { life: 2.4 });
    slam('…AND BROCCOLI!', W / 2, 150, 130, BD.slime, t, BITE, { rot: .04 });
    bdConfetti(t, 104.2, 'candy', 26);
    bdConfetti(t, BITE, 'broccoli', 18);
    flash(.3 * big, '#FFF3C4');
  }

  // 112.2–120 · the outro: GAME OVER, HUMANS! a salute; BEEP BOOP: a candy, popped in (heart eyes, nothing breaks this time);
  // SEE YOU NEXT HALLOWEEN! He blasts off across the moon while the kids wave below. Iris, THE END.
  const GAME = 112.25, POPIN = 113.95, SEE = 114.52, LAUNCH = 114.8, IRIS = 117.4;
  function outro(t, lt) {
    const fly = easeIn(seg(t, LAUNCH, 116.6));
    cam(t, 1.0 + .03 * seg(t, 112.2, 117), 3 + 10 * kick(t, LAUNCH, 4));
    bdSky('#0E0820', '#2E1650', '#5A2A62'); bdStars(t, 110, 6);
    bdMoon(1300, 330, 210);
    bdBats(t, 6, { y: 260, s: 7, speed: 120 });
    bdHill(860, 60, '#24133D', 1, 0, 1100); bdHouse(300, bdHillY(300, 860, 60, 1, 0, 1100) + 6, 9, t);
    bdHill(980, 40, '#170C28', 2.2, 0, 800);
    // the kids wave from the hill
    [['danny', 560], ['jenna', 760], ['housam', 1500], ['alma', 1700]].forEach(([id, x], i) => {
      const w = Math.sin(t * 9 + i) > 0, P = POSE[id];
      kid(id, x, bdHillY(x, 980, 40, 2.2, 0, 800) + 60, 1.6, { eyes: 'happy', mouth: 'open', brows: 'up', ...(w ? P.cheer : P.laugh), lookY: -.8, bucket: .8 });
    });
    // Robo: salute, candy, launch: up and across the moon, shrinking
    const pick = ease(seg(t, 113.4, POPIN)), eatK = t > POPIN;
    const x = lerp(W / 2 - 200, 1300 + 900, fly), y = lerp(760, 120, fly) - 220 * Math.sin(fly * Math.PI) + 12 * Math.sin(t * 3), k = lerp(3.0, .7, fly);
    const A = robo(x, y, k, { hover: 1, red: .2, eyes: eatK ? 'heart' : 'happy', brows: 'up', mouth: t < POPIN ? roboMouth(t, 'grin') : 'grin',
      handR: t < 113.3 ? [2.6, -25] : mixPt([4.4, -10], [1.4, -19.5], pick * (1 - seg(t, POPIN + .1, POPIN + .4))), handPoseR: t < 113.3 ? 'palm' : 'claw',
      handL: fly > 0 ? [-6.0, -26] : [-4.4, -8.6], handPoseL: fly > 0 ? 'fist' : 'palm', emote: eatK && fly < .3 ? 'heart' : undefined, emoteK: 1, tilt: .25 * fly, lean: .1 * fly });
    if (t > 113.3 && t < POPIN) bdCandy(A.handR[0], A.handR[1] - 16, 34 * k / 3, 'wrap', .3, '#FF5C8A');
    if (fly > 0) for (let i = 0; i < 6; i++) { const u = clamp(fly - i * .05); X.save(); X.globalAlpha = .7 * (1 - i / 6); circle(lerp(W / 2 - 200, 2200, u), lerp(760, 120, u) - 220 * Math.sin(u * Math.PI) + 120 * k / 3, (30 - i * 3) * k / 2, { fill: i % 2 ? '#FFB23A' : '#FFF3C4', stroke: null }); X.restore(); }
    camEnd();
    slam('GAME OVER, HUMANS!', W / 2, 180, 130, BD.slime, t, GAME, { life: 1.6, rot: -.04 });
    slam('BEEP BOOP!', 1450, 200, 120, '#BFF3FF', t, 113.70, { life: 1.0, rot: .08 });
    slam('SEE YOU NEXT HALLOWEEN!', W / 2, 170, 120, BD.orange, t, SEE, { life: IRIS - SEE + .2 });
    if (t > IRIS) { const kk = ease(seg(t, IRIS, IRIS + 1.0)); iris(1300, 330, lerp(1500, 0, kk)); }
    if (t > IRIS + 1.0) overlay(() => { const kk = easeOut(seg(t, IRIS + 1.1, IRIS + 1.6)); X.save(); X.globalAlpha = kk; X.translate(W / 2, H / 2); X.scale(.8 + .2 * kk, .8 + .2 * kk);
      X.font = `140px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 26; X.strokeStyle = '#000'; X.strokeText('THE END', 0, 0); X.fillStyle = BD.slime; X.fillText('THE END', 0, 0); X.restore(); });
  }

  // ---------- assembly: every shot gets the karaoke on top, and the battles get the slime wipe ----------
  const WIPES = [[BAR(24), 1], [BAR(30), -1], [BAR(36), 1], [BAR(42), -1], [BAR(48), 1]];
  const withTop = fn => { const g = (t, lt, dur) => { fn(t, lt, dur); for (const [tc, d] of WIPES) if (Math.abs(t - tc) < .32) bdWipe(seg(t, tc - .32, tc + .32), d); brKaraoke(t); };
    Object.defineProperty(g, 'name', { value: fn.name }); return g; };
  scene({
    duration: END, fps: 24, bpm: 120, beatOffset: OFF,
    shots: [
      [0, dustOff], [8.1, reboot], [BAR(6), title], [16.0, unknownUnits], [BAR(12) - .3, deal], [BAR(16), chorus(CH1)],
      [BAR(24), battle(0)], [BAR(30), battle(1)], [BAR(36), battle(2)], [BAR(42), battle(3)],
      [95.95, chorus2], [BAR(56), outro],
    ].map(([t0, fn]) => [t0, withTop(fn)]),
  });
})();
