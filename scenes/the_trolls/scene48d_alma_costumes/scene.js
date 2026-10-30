// Scene 48d: "The Trolls · Who's Inside? (Alma's Costumes)", a fourth take on the finale of The Trolls series: scene 48c's song, riddles
// and shots, but every monster is Alma's real drawing (the cut-outs in ../scene48_the_trolls/costumes) worn over the person, as in
// scene 48. Each drawing is drawn big (720 px tall in a riddle, about 1.3 to 1.7 times its wearer) and its wearer is tucked inside it
// (HIDE below, measured so that no pixel of them shows), so nothing gives anyone away. On the POP the drawing flies off and the person
// springs up out of it. The song and its karaoke are scene 48c's (audio.mp3, lyrics.js). Every shot is a pure function of t.
(() => {
  // Alma's drawing, cut out by scene48's costumes/cut.py. Scene 48's folder is our sibling: an exported bundle has no manifest for it.
  const ART = ASSETS.scene.scene48d_alma_costumes.dir.replace(/[^/]+$/, 'scene48_the_trolls');
  const img = f => { const i = new Image(); i.src = `${ART}/${f}`; return i; };
  const ready = i => i && i.complete && i.naturalWidth > 0;
  const CRAY = ['#E5466E', '#FF8A3D', '#E0A800', '#4DA650', '#2E7D9A', '#6A3FB0'];

  // ---------- sections (seconds) ----------
  const S_STAGE = 6, S_R = 12, RL = 24, S_RECAP = 180, S_DANCE = 190, S_END = 208, END = 214;
  const R0 = i => S_R + RL * i;                                                 // riddle i starts here (7 riddles, 12 bars each)
  // inside a riddle: the monster drops in, the twister (twice: then faster, the cards twisting), two beats to guess, POP, the answer
  const L_RID = 2, L_FAST = 10, L_GUESS = 16, L_POP = 18, L_CARDS_OFF = 21.5, L_OUT = 23.5;
  const FLOOR = H * .86, COSTUME_H = 720, BASE = 3.0;                         // a riddle's drawing, and its wearer's scale (kOf)

  // ---------- helpers ----------
  const on = (t, a, b, r = .25) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const hop = (t, f = 1, ph = 0) => Math.abs(Math.sin((t * 2 * f + ph) * Math.PI));   // a bounce on every beat
  function slam(txt, x, y, size, col, t, t0, o = {}) {                          // a big crayon word that slams in (titles only)
    const age = t - t0; if (age < 0 || age > (o.life ?? 9e9)) return;
    const k = backOut(clamp(age / .22)), a = o.life ? 1 - seg(age, o.life - .25, o.life) : 1;
    overlay(() => {
      X.save(); X.translate(x, y); X.rotate((o.rot ?? -.04) + .03 * Math.sin(age * 9) * Math.exp(-age * 3)); X.scale(k * (1 + .5 * (1 - k)), k); X.globalAlpha = a;
      X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = size * .22; X.strokeStyle = PAL.ink; X.strokeText(txt, 0, 0); X.fillStyle = PAL.ink; X.fillText(txt, size * .05, size * .06);
      X.fillStyle = col; X.fillText(txt, 0, 0); X.restore();
    });
  }
  function confetti(t, t0, n = 60, dur = 6) {
    const age = t - t0; if (age < 0 || age > dur) return;
    overlay(() => { for (let i = 0; i < n; i++) { const a = age - hash(i) * 1.2; if (a < 0) continue;
      const x = W * hash(i + 3) + 90 * Math.sin(a * 2.3 + i), y = -30 + a * (190 + 160 * hash(i + 5));
      if (y > H + 30) continue; X.save(); X.translate(x, y); X.rotate(a * 5 + i); shape(rectPts(-9, -5, 18, 10), { fill: CRAY[i % 6], stroke: null }); X.restore(); } });
  }
  function burst(x, y, t, t0, col = '#FFE45C', n = 14, R = 380) {               // the POP: a starburst of crayon streaks
    const age = t - t0; if (age < 0 || age > .9) return;
    const u = easeOut(seg(age, 0, .5)), a = 1 - seg(age, .45, .9);
    overlay(() => { X.save(); X.globalAlpha = a; for (let i = 0; i < n; i++) { const ang = i / n * TAU + .2, r0 = 60 + R * .35 * u, r1 = 90 + R * u;
      line([[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], { stroke: i % 2 ? col : '#FFFDF6', lwPx: 14 }); }
      X.restore(); });
  }
  const qmark = (x, y, size, t, t0, life) => slam('?', x, y, size, '#FFE45C', t, t0, { rot: .12 * Math.sin(t * 3), life });

  // ---------- the cast: the Safadi brothers and the kids ----------
  const ORDER = ['danny', 'alma', 'housam', 'jenna', 'sarah', 'sami', 'safadi'];   // the riddle order: the twins last
  const COST = { danny: 'pumpkin', alma: 'pink_ghost', housam: 'bird', jenna: 'bee', sarah: 'cat', sami: 'owl', safadi: 'bat' };
  const RIG = { safadi, sami, housam, alma, danny, jenna, sarah };
  const UNIT = { safadi: SAFADI_UNIT, sami: SAMI_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT, sarah: SARAH_UNIT };
  const TALL = { safadi: 180, sami: 180, housam: 168, alma: 125, danny: 122, jenna: 135, sarah: 170 };     // world units
  const POSE = n => CHARACTERS[n].poses;
  const kOf = (n, base = 3.5) => base * Math.pow(172 / TALL[n], .45);          // px per world unit: the kids a little bigger than life
  const sOf = (n, base) => UNIT[n] * kOf(n, base);

  // ---------- the costumes: Alma's drawing, worn, all the same height (no legs, no shoes, no size to give anyone away) ----------
  const SPR = Object.fromEntries(Object.values(COST).map(n => [n, img(`costumes/${n}.png`)]));
  // How each wearer hides inside their drawing: tucked to c of their size, feet at (fx·w, fy·h) from the middle of the drawing's
  // bottom edge. Measured on the drawings' alpha (720 px tall, wearer at BASE, their outline grown by 7 px): not a pixel shows.
  // The drawing is moved, not the wearer, so they pop out where they stand.
  const HIDE = {
    pumpkin: { c: 1, fx: 0, fy: -.075 }, pink_ghost: { c: 1, fx: .05, fy: -.15 }, bird: { c: .7, fx: .025, fy: -.375 }, bee: { c: 1, fx: -.2, fy: -.075 },
    cat: { c: .775, fx: .225, fy: -.125 }, owl: { c: .95, fx: -.025, fy: -.075 }, bat: { c: .775, fx: -.2, fy: -.05 },
  };
  const fit = (kind, h) => { const asp = SPR[kind].naturalWidth / SPR[kind].naturalHeight;   // wide drawings (the bird, the bat) fit the same width
    let hh = h, ww = h * asp; if (ww > h * 1.4) { ww = h * 1.4; hh = ww / asp; } return { ww, hh }; };
  // a costume standing on (x, y), h px tall. o: who (the wearer, drawn inside it, standing at x), sq (squash), rot, shake (px),
  // off (0..1: it flies off, spinning, and fades; from then on the caller draws the wearer)
  function costume(kind, x, y, h, t, o = {}) {
    const im = SPR[kind]; if (!ready(im)) return { top: [x, y - h], mid: [x, y - h / 2], w: h, h };   // nobody shows until the drawing has loaded
    const { ww, hh } = fit(kind, h), hd = o.who && HIDE[kind];
    const off = o.off || 0, sq = o.sq || 0, sx = o.shake ? o.shake * Math.sin(t * 47) : 0, cx = hd ? x - hd.fx * ww : x;
    if (off >= 1) return { top: [cx, y - hh], mid: [cx, y - hh / 2], w: ww, h: hh };
    X.save(); X.translate(cx + sx + off * ww * .6, y - easeOut(off) * h * 1.6); X.rotate((o.rot || 0) + off * 4.2); X.scale((1 + sq) * (1 - .3 * off), (1 - sq) * (1 - .3 * off));
    X.globalAlpha = 1 - seg(off, .5, 1);
    if (!o.noShadow && !off) { X.save(); X.globalAlpha = .25; ellipse(0, 4, ww * .38, 18, { fill: '#000', stroke: null }); X.restore(); }
    if (hd && !off) RIG[o.who](hd.fx * ww, hd.fy * hh, sOf(o.who, BASE * h / COSTUME_H) * hd.c, { t });
    X.drawImage(im, -ww / 2, -hh, ww, hh);
    X.restore();
    return { top: [cx, y - hh], mid: [cx, y - hh / 2], w: ww, h: hh };
  }
  // the wearer springing up out of their drawing on the POP: from tucked (HIDE) to standing in u = 0..1
  function springUp(name, x, y, h, u, fn) {
    const hd = HIDE[COST[name]]; if (u >= 1) return fn();
    const { hh } = fit(COST[name], h), k = lerp(hd.c, 1, backOut(u));
    X.save(); X.translate(x, y + hd.fy * hh * (1 - easeOut(u))); X.scale(k, k); X.translate(-x, -y); const A = fn(); X.restore(); return A;
  }

  // ---------- the game-show stage (2D) ----------
  // o: theme (the answer's colour), reveal (0..1: the stage turns into the answer's colour, rays spin), dim (0..1: lights down
  // to one spotlight), curtain (0..1: open), noSign (hide the big ? marquee)
  function stage(t, o = {}) {
    const th = o.theme || '#6A3FB0', rv = o.reveal || 0;
    const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixCol('#24124A', mixCol(th, '#24124A', .45), rv)); g.addColorStop(1, mixCol('#5B2C8F', th, rv * .8));
    X.fillStyle = g; X.fillRect(-200, -200, W + 400, H + 400);
    if (rv > 0) { X.save(); X.globalAlpha = .22 * rv; X.translate(W / 2, FLOOR - 300);           // the answer's rays
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .25; shape([[0, 0], [Math.cos(a - .09) * 1800, Math.sin(a - .09) * 1800], [Math.cos(a + .09) * 1800, Math.sin(a + .09) * 1800]], { fill: '#FFFDF6', stroke: null }); }
      X.restore(); }
    // the big ? marquee on the back wall, ringed with chasing bulbs
    const sign = (o.noSign ? 0 : 1) * (1 - rv);
    if (sign > 0) { X.save(); X.globalAlpha = sign; const cx = W / 2, cy = 330, R = 250;
      shape(ellPts(cx, cy, R, R * .78, 40), { fill: '#3A1E66', stroke: '#1E0E36', lwPx: 10 });
      for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, lit = (i + Math.floor(t * 8)) % 4 === 0;
        circle(cx + Math.cos(a) * R * .92, cy + Math.sin(a) * R * .72, 12, { fill: lit ? '#FFE45C' : '#8C6A20', stroke: PAL.ink, lwPx: 2 }); }
      X.font = `300px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = 'rgba(255,228,92,.22)'; X.fillText('?', cx, cy + 20);
      X.restore(); }
    for (let i = 0; i < 26; i++) { const x = 140 + i * 66, lit = (i + Math.floor(t * 6)) % 3 === 0; circle(x, 44, 12, { fill: lit ? '#FFE45C' : '#8C6A20', stroke: PAL.ink, lwPx: 2 }); }
    // curtains
    const op = o.curtain ?? 1;
    for (const sd of [-1, 1]) { const edge = sd < 0 ? lerp(W / 2, 170, op) : lerp(W / 2, W - 170, op);
      for (let i = 0; i < 8; i++) { const x0 = sd < 0 ? edge - i * (edge + 40) / 8 : edge + i * (W - edge + 40) / 8, x1 = sd < 0 ? x0 - (edge + 40) / 8 - 2 : x0 + (W - edge + 40) / 8 + 2;
        shape([[x0, -20], [x1, -20], [x1 + sd * 6 * Math.sin(t + i), H + 20], [x0 - sd * 4, H + 20]], { fill: i % 2 ? '#B3203A' : '#D7263E', stroke: null }); }
      line([[edge, -20], [edge + sd * 10 * Math.sin(t * 1.3), H + 20]], { stroke: '#7E1226', lwPx: 6 }); }
    // the floor and the spotlight
    const fl = X.createLinearGradient(0, H * .8, 0, H); fl.addColorStop(0, mixCol('#3A1E5C', th, rv * .5)); fl.addColorStop(1, mixCol('#24123C', th, rv * .3));
    X.fillStyle = fl; X.fillRect(-200, H * .8, W + 400, H * .2 + 200);
    for (let i = 0; i < 18; i++) { const x = W / 2 + (i - 8.5) * 150; line([[x, H * .8], [W / 2 + (x - W / 2) * 1.8, H + 10]], { stroke: 'rgba(0,0,0,.18)', lwPx: 3 }); }
    ellipse(W / 2, FLOOR + 8, 470, 66, { fill: rgba(rv > .5 ? '#FFFDF6' : '#FFF0BE', .3 + .1 * rv), stroke: null });
    X.save(); X.globalCompositeOperation = 'lighter';
    const sg = X.createLinearGradient(0, 0, 0, FLOOR); sg.addColorStop(0, 'rgba(255,240,190,0)'); sg.addColorStop(1, 'rgba(255,240,190,.2)'); X.fillStyle = sg;
    X.beginPath(); X.moveTo(W / 2 - 60, -10); X.lineTo(W / 2 + 60, -10); X.lineTo(W / 2 + 470, FLOOR + 8); X.lineTo(W / 2 - 470, FLOOR + 8); X.fill(); X.restore();
  }
  function dim(k) {                                                              // lights down to the spotlight (screen space)
    if (k <= .01) return;
    overlay(() => { const g = X.createRadialGradient(W / 2, FLOOR - 280, 220, W / 2, FLOOR - 280, 900); g.addColorStop(0, 'rgba(10,4,20,0)'); g.addColorStop(1, `rgba(10,4,20,${.75 * k})`); X.fillStyle = g; X.fillRect(0, 0, W, H); });
  }
  function badge(n, t, k = 1) {                                                  // which riddle: 1 … 7
    if (k <= .01) return;
    overlay(() => { X.save(); X.translate(118, 132); X.scale(k, k); X.rotate(.08 * Math.sin(t * 2)); circle(0, 0, 62, { fill: CRAY[n % 6], stroke: PAL.ink, lwPx: 6 });
      X.font = `78px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 10; X.strokeStyle = PAL.ink; X.strokeText(String(n + 1), 0, 6); X.fillStyle = '#FFFDF6'; X.fillText(String(n + 1), 0, 6); X.restore(); });
  }

  // ---------- picture clues: the riddle on cards, pictures only (no words, so they fit whatever is sung) ----------
  const ICON = {
    ball(t) { X.save(); X.rotate(t * 2); circle(0, 0, 62, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 5 }); shape(starPts(0, 0, 22, 1, 5, 0), { fill: PAL.ink, stroke: null });
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; circle(Math.cos(a) * 50, Math.sin(a) * 50, 10, { fill: PAL.ink, stroke: null }); } X.restore(); },
    block(t) { X.save(); X.rotate(.1 * Math.sin(t * 2)); X.scale(1.6, 1.6); shape([[-40, -20], [0, -40], [40, -20], [0, 0]], { fill: '#76AF42', stroke: PAL.ink, lwPx: 4 });
      shape([[-40, -20], [0, 0], [0, 44], [-40, 24]], { fill: '#8B5A34', stroke: PAL.ink, lwPx: 4 }); shape([[40, -20], [0, 0], [0, 44], [40, 24]], { fill: '#6E4426', stroke: PAL.ink, lwPx: 4 });
      shape([[-40, -20], [0, 0], [0, 10], [-40, -10]], { fill: '#5C9A34', stroke: null }); X.restore(); },
    tower(t) { const c = ['#76AF42', '#E5466E', '#FFD34E', '#2E7D9A']; for (let i = 0; i < 4; i++) { const age = frac(t / 2) * 4 - i; if (age < 0) continue;
      shape(rectPts(-50 + (i % 2) * 12, 40 - i * 40 - Math.max(0, 1 - age * 3) * 60, 90, 40), { fill: c[i], stroke: PAL.ink, lwPx: 4 }); } },
    notes(t) { X.font = `100px serif`; X.textAlign = 'center'; X.textBaseline = 'middle'; ['♪', '♫'].forEach((s, i) => { X.fillStyle = ['#E5466E', '#6A3FB0'][i]; X.fillText(s, -38 + i * 76, 6 * Math.sin(t * 6 + i * 2)); }); },
    disco(t) { circle(0, 0, 64, { fill: '#C9CED4', stroke: PAL.ink, lwPx: 5 }); for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j < 6) shape(rectPts(i * 22 - 10, j * 22 - 10, 20, 20), { fill: (i + j + Math.floor(t * 6)) % 3 ? '#E8ECF2' : '#FFE45C', stroke: null });
      line([[0, -64], [0, -96]], { stroke: PAL.ink, lwPx: 4 }); },
    crayon(t) { X.save(); X.rotate(-.6 + .1 * Math.sin(t * 4)); shape(rectPts(-90, -18, 150, 36), { fill: '#E58AB8', stroke: PAL.ink, lwPx: 4 }); shape([[60, -18], [96, 0], [60, 18]], { fill: '#E58AB8', stroke: PAL.ink, lwPx: 4 });
      shape(rectPts(-60, -18, 30, 36), { fill: '#FFFDF6', stroke: null }); X.restore(); line([[-80, 70], [-40, 50], [0, 72], [40, 48], [80, 66]], { stroke: '#E58AB8', lwPx: 7, smooth: true }); },
    curve(t) { X.setLineDash([12, 10]); line([[-90, 60], [-40, -40], [10, -66], [60, -36], [90, 20]], { stroke: '#2E7D9A', lwPx: 5, smooth: true }); X.setLineDash([]);
      const u = frac(t / 1.5), x = -90 + 180 * u, y = 60 - 4 * 125 * u * (1 - u) + 30 * u; circle(x, y, 18, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 4 }); },
    pi(t) { X.font = `150px serif`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#2F5FB0'; X.fillText('π', 0, 10 + 4 * Math.sin(t * 3)); },
    trophy(t) { shape([[-50, -60], [50, -60], [40, 0], [10, 20], [-10, 20], [-40, 0]], { fill: '#FFD34E', stroke: PAL.ink, lwPx: 5, smooth: .3 }); shape(rectPts(-12, 20, 24, 30), { fill: '#E0A800', stroke: PAL.ink, lwPx: 4 });
      shape(rectPts(-40, 50, 80, 18), { fill: '#8A5A36', stroke: PAL.ink, lwPx: 4 }); for (const sd of [-1, 1]) line([[sd * 48, -50], [sd * 78, -40], [sd * 44, -10]], { stroke: PAL.ink, lwPx: 6, smooth: true });
      shape(starPts(0, -30, 16, .45, 5, t), { fill: '#FFFDF6', stroke: null }); },
    pencil(t) { X.save(); X.rotate(-.7 + .15 * Math.sin(t * 6)); shape(rectPts(-90, -16, 140, 32), { fill: '#FFD34E', stroke: PAL.ink, lwPx: 4 }); shape([[50, -16], [86, 0], [50, 16]], { fill: '#F1C89A', stroke: PAL.ink, lwPx: 4 });
      shape([[74, -6], [86, 0], [74, 6]], { fill: PAL.ink, stroke: null }); shape(rectPts(-106, -16, 18, 32), { fill: '#E58AB8', stroke: PAL.ink, lwPx: 4 }); X.restore(); },
    comic(t) { shape(rectPts(-95, -70, 190, 140), { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 5 }); line([[0, -70], [0, 70]], { stroke: PAL.ink, lwPx: 4 }); line([[-95, 0], [0, 0]], { stroke: PAL.ink, lwPx: 4 });
      shape(starPts(48, 0, 38 + 4 * Math.sin(t * 8), .5, 8, 0), { fill: '#FFD34E', stroke: PAL.ink, lwPx: 3 }); circle(-48, -36, 16, { fill: '#E5466E', stroke: PAL.ink, lwPx: 3 });
      shape([[-70, 50], [-48, 20], [-26, 50]], { fill: '#7FD6F0', stroke: PAL.ink, lwPx: 3 }); },
    cartwheel(t) { X.save(); X.rotate(t * 4); circle(0, -50, 16, { fill: '#F1C89A', stroke: PAL.ink, lwPx: 4 }); line([[0, -34], [0, 20]], { stroke: PAL.ink, lwPx: 8 });
      line([[-50, -20], [0, -20], [50, -20]], { stroke: PAL.ink, lwPx: 7 }); line([[-36, 64], [0, 20], [36, 64]], { stroke: PAL.ink, lwPx: 7 }); X.restore(); },
    saw(t) { X.save(); X.translate(14 * Math.sin(t * 12), 0); shape([[-90, -20], [60, -20], [60, 20], [-90, 30]], { fill: '#C9CED4', stroke: PAL.ink, lwPx: 4 });
      for (let i = 0; i < 8; i++) shape([[-85 + i * 18, 26], [-76 + i * 18, 42], [-67 + i * 18, 26]], { fill: '#C9CED4', stroke: PAL.ink, lwPx: 2 });
      shape(rectPts(60, -30, 40, 60), { fill: '#8A5A36', stroke: PAL.ink, lwPx: 4, smooth: .3 }); X.restore(); shape(rectPts(-90, 50, 180, 22), { fill: '#C99559', stroke: PAL.ink, lwPx: 3 }); },
    phone(t) { shape(rectPts(-46, -80, 92, 160), { fill: '#54445F', stroke: PAL.ink, lwPx: 5, smooth: .15 }); shape(rectPts(-36, -66, 72, 120), { fill: '#B9E8DF', stroke: null });
      for (let i = 0; i < 3; i++) circle(-18 + i * 18, -6, 7, { fill: (Math.floor(t * 6) % 3) === i ? PAL.ink : '#6B8F88', stroke: null });
      shape(rectPts(-28, -56, 44, 20), { fill: '#FFFDF6', stroke: null, smooth: .4 }); },
    vball(t) { X.save(); X.rotate(t * 3); circle(0, 0, 62, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 5 });
      for (const a of [0, 2.1, 4.2]) line([[0, 0], [Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a + .6) * 62, Math.sin(a + .6) * 62]], { stroke: a ? '#4166B8' : '#E0A800', lwPx: 6, smooth: true }); X.restore(); },
    steth(t) { line([[-40, -60], [-40, -5], [0, 25], [40, -5], [40, -60]], { stroke: '#4C86A8', lwPx: 9, smooth: true }); line([[0, 25], [0, 45]], { stroke: '#4C86A8', lwPx: 9 }); circle(0, 58, 18, { fill: '#C9CED4', stroke: PAL.ink, lwPx: 4 }); },
    heart(t) { const s = 1 + .12 * Math.max(0, Math.sin(t * 8)); X.save(); X.scale(s, s); shape([[0, 55], [-62, -2], [-55, -45], [-18, -52], [0, -26], [18, -52], [55, -45], [62, -2]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 5, smooth: .5 }); X.restore(); },
    broccoli(t) { shape([[-14, 70], [14, 70], [10, 0], [-10, 0]], { fill: '#8FC867', stroke: PAL.ink, lwPx: 4 });
      for (const [x, y, r] of [[-40, -10, 32], [0, -34, 38], [40, -10, 32], [-20, -50, 26], [22, -52, 26]]) circle(x, y, r, { fill: '#4DA650', stroke: PAL.ink, lwPx: 4 }); },
    board(t) { shape(rectPts(-95, -66, 190, 132), { fill: '#23433A', stroke: '#8A5A36', lwPx: 9 }); X.font = `600 34px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF4';
      X.fillText('E = mc²', 0, -22); X.fillText('a² + b² = c²', 0, 26); },
    bulb(t) { const on2 = .6 + .4 * Math.sin(t * 6); circle(0, -20, 52, { fill: mixCol('#FFF4B8', '#FFE45C', on2), stroke: PAL.ink, lwPx: 5 }); shape(rectPts(-22, 30, 44, 34), { fill: '#B9BEC4', stroke: PAL.ink, lwPx: 4 });
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line([[Math.cos(a) * 66, -20 + Math.sin(a) * 66], [Math.cos(a) * (80 + 8 * on2), -20 + Math.sin(a) * (80 + 8 * on2)]], { stroke: '#E0A800', lwPx: 5 }); } },
    pointer(t) { X.save(); X.rotate(-.6 + .2 * Math.sin(t * 3)); line([[-90, 0], [80, 0]], { stroke: '#5A3A22', lwPx: 9 }); circle(86, 0, 12, { fill: '#E03C3C', stroke: PAL.ink, lwPx: 3 }); X.restore(); },
  };
  // a clue card at (x, y): o.k (0..1 pop), o.flip (0..1: turned over to the answer side), o.check (0..1: the green tick)
  function card(icon, x, y, sc, t, o = {}) {
    const k = o.k ?? 1; if (k <= .01) return;
    const fl = o.flip || 0, sx = Math.abs(Math.cos(fl * Math.PI)) || .02, back = fl > .5;
    X.save(); X.translate(x, y + 8 * Math.sin(t * 2 + x * .01)); X.rotate((o.rot || 0) + .04 * Math.sin(t * 1.3 + x)); X.scale(sc * k * sx, sc * k);
    shape(rectPts(-150 + 8, -140 + 10, 300, 280), { fill: 'rgba(0,0,0,.3)', stroke: null, smooth: .1 });
    shape(rectPts(-150, -140, 300, 280), { fill: back ? '#F2FFF4' : '#FFF8EA', stroke: PAL.ink, lwPx: 7, smooth: .1 });
    ICON[icon](t);
    if (back && o.check) { const c = backOut(clamp(o.check)); X.save(); X.translate(102, -92); X.scale(c, c); circle(0, 0, 44, { fill: '#5BC27F', stroke: PAL.ink, lwPx: 5 }); line([[-20, 0], [-5, 16], [22, -16]], { stroke: '#FFFDF6', lwPx: 10 }); X.restore(); }
    X.restore();
  }

  // ---------- the riddles: the costume, its picture clues, its colour, and what the answer shows off ----------
  // Each `act(x, y, s, t, a)` draws the person at show time a (0 … 7.5), from SHOW below: the song leaves 5.5 s between the POP and the
  // wipe, so the first move (0.5–3.5) plays at double speed and the rest 1.5 s early, still on the beat.
  const SHOW = a => a < .5 ? a : a < 2 ? .5 + 2 * (a - .5) : a + 1.5;
  const tada = (n, x, y, s, t, a) => RIG[n](x, y, s, { t, eyes: 'happy', mouth: 'grin', brows: 'up', handL: [-4.6, -19], handR: [4.6, -19], handPoseL: 'palm', handPoseR: 'palm', jump: .8 * Math.sin(Math.PI * clamp(a / .5)) });
  const RID = {
    danny: { clues: ['ball', 'block', 'tower'], col: '#4DA650', act(x, y, s, t, a) {
      if (a < .5) return tada('danny', x, y, s, t, a);
      if (a < 3.5) return POSE('danny').dribble(x + 120 * Math.sin((a - .5) * 1.6), y, s, t);
      const n = Math.min(5, 1 + Math.floor((a - 3.5) / .5));                    // the block tower grows on the beat
      for (let i = 0; i < n; i++) { const age = a - 3.5 - i * .5, drop = Math.max(0, 1 - age * 4) * 300; dannyBlock(x + 8 * s, y - (2.8 * i) * s - drop, s * 1.9); }
      return danny(x, y, s, { t, handR: [4.4, -11.5 - 2 * hop(t)], handPoseR: 'point', mouth: 'grin', brows: 'up', lookX: .7, eyes: a > 6 ? 'happy' : 'open' });
    } },
    alma: { clues: ['notes', 'disco', 'crayon'], col: '#E58AB8', act(x, y, s, t, a) {
      if (a < .5) return tada('alma', x, y, s, t, a);
      const p = clamp((a - .5) / .5);
      if (a < 3.5) return alma(x, y, s, { t, ...almaDance(a - .5, 'twirl', { bpm: 60 }), power: p, eyes: 'star' });   // twirls from facing us
      // she drew them all: the sheet of monsters pops up beside her
      const u = backOut(clamp((a - 3.6) / .4)); X.save(); X.translate(x - 520, y - 420); X.rotate(-.06 + .03 * Math.sin(t * 2)); X.scale(u, u);
      shape(rectPts(-230, -180, 460, 360), { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 7, smooth: .05 });
      ORDER.forEach((n, i) => { if (a > 3.9 + i * .25) costume(COST[n], -165 + (i % 4) * 110, -40 + Math.floor(i / 4) * 170, 120, t, { noShadow: true, rot: .05 * Math.sin(t * 3 + i) }); });
      X.restore();
      return alma(x + 120, y, s, { t, ...almaDance(t, 'disco', { bpm: 120 }), power: 1, eyes: 'star' });
    } },
    housam: { clues: ['curve', 'pi', 'trophy'], col: '#5E8FD8', act(x, y, s, t, a) {
      if (a < .5) return tada('housam', x, y, s, t, a);
      if (a < 3.5) return POSE('housam').juggle(x, y, s, t);
      // the kick, and the ball flies along the curve he worked out
      const u = clamp((a - 3.7) / 1.6), bx = x + 6 * s + u * 760, by = y - 2.5 * s - Math.sin(Math.PI * u) * 520 + u * 60;
      X.save(); X.setLineDash([16, 12]); line(Array.from({ length: 21 }, (_, i) => { const v = i / 20; return [x + 6 * s + v * 760, y - 2.5 * s - Math.sin(Math.PI * v) * 520 + v * 60]; }), { stroke: 'rgba(255,253,246,.8)', lwPx: 5, smooth: true }); X.restore();
      X.save(); X.font = `64px serif`; X.fillStyle = '#FFFDF6'; X.textAlign = 'center'; X.globalAlpha = on(a, 3.9, 7.6); X.fillText('y = −x² + 4x', x + 420, y - 620); X.restore();
      const A = a < 4.2 ? POSE('housam').kick(x, y, s, t) : POSE('housam')['eureka!'](x, y, s, t);
      if (a > 3.7) housamBall(bx, by, s, { spin: t * 8 });
      return A;
    } },
    jenna: { clues: ['cartwheel', 'pencil', 'comic'], col: '#E0A800', act(x, y, s, t, a) {
      if (a < .3) return tada('jenna', x, y, s, t, a);
      if (a < 2.3) { const u = ease(seg(a, .3, 2.3)), cx = x - 380 + 760 * u, cy = y - 70 * s * .1 - 160;   // a double cartwheel across the stage
        X.save(); X.translate(cx, cy); X.rotate(TAU * 2 * u); X.translate(-cx, -cy); const A = jenna(cx, y, s, { t, eyes: 'happy', mouth: 'grin', handL: [-5, -20], handR: [5, -20], handPoseL: 'palm', handPoseR: 'palm', footL: [-2.4, -1.2], footR: [2.4, -1.2] }); X.restore(); return A; }
      if (a < 3.5) return jenna(x + 380, y, s, { ...jennaDance(t, 'star jump'), t });
      return jennaBrainstormComics(x + 380 - 380 * ease(seg(a, 3.5, 4)), y, s, 1 + (a - 3.5) * 1.15);
    } },
    sarah: { clues: ['saw', 'phone', 'vball'], col: '#E5466E', act(x, y, s, t, a) {
      if (a < .5) return tada('sarah', x, y, s, t, a);
      if (a < 2.8) return sarahPerform(x, y, s, t, 'volleyball spike', { k: .9 });
      if (a < 5.2) return sarahPerform(x, y, s, t, 'woodworking', { k: 1 });
      return sarahPerform(x, y, s, t, 'rebellion', { k: ease(seg(a, 5.2, 5.6)) });
    } },
    sami: { clues: ['steth', 'heart', 'broccoli'], col: '#5BC27F', act(x, y, s, t, a) {
      if (a < .5) return tada('sami', x, y, s, t, a);
      if (a < 3.2) return POSE('sami').examine(x, y, s, t);
      samiBoard(x + 470, y - 470, 440, clamp((a - 3.4) / 2.5), t, { kind: 'plate' });
      return sami(x - 80, y, s, { t, power: ease(seg(a, 3.2, 3.8)), eyes: a > 3.6 ? 'glow' : 'open', brows: 'up', mouth: 'grin', handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', jump: .5 + .3 * wob(t, .6) });
    } },
    safadi: { clues: ['board', 'bulb', 'pointer'], col: '#E0A800', act(x, y, s, t, a) {
      if (a < .5) return tada('safadi', x, y, s, t, a);
      // the twin slides in beside him: the brothers, both laughing
      const twin = ease(seg(a, 5, 5.6)), sx = x - 260 * twin;
      if (twin > 0) { const tx = lerp(W + 300, x + 300, twin); sami(tx, y, s, a > 5.8 ? { t, eyes: 'squeeze', mouth: hop(t, 2) > .5 ? 'grin' : 'open', handL: [-2.2, -9.5], handR: [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist', dy: .4 * hop(t, 2), tilt: .08 } : { t, mouth: 'grin', brows: 'up', handR: [5.2, -13.6], handPoseR: 'thumb', lean: -.1 }); }
      if (a < 5) safadiBoard(x + 480, y - 470, 440, clamp((a - 1.2) / 2.5), t, { kind: 'graph' });
      if (a > 5.8) return safadi(sx, y, s, { t, eyes: 'squeeze', mouth: hop(t, 2, .3) > .5 ? 'grin' : 'open', handL: [-2.2, -9.5], handR: [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist', dy: .4 * hop(t, 2, .3), tilt: -.08 });
      return safadi(sx, y, s, { t, power: ease(seg(a, .5, 1.1)) * (1 - ease(seg(a, 4.6, 5.2))), bulb: a > 1 && a < 5 ? 1 : 0, eyes: a > .9 && a < 5 ? 'glow' : 'open', brows: 'up', mouth: 'grin', handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', jump: .6 + .4 * wob(t, .6) });
    } },
  };

  // where the three cards are: popping in one per bar, orbiting while the twister speeds up, then a row on top, ticked
  const HOME = [[330, 330, .85], [W / 2, 175, .78], [W - 330, 330, .85]];
  const ROW = [[W / 2 - 430, 200, .7], [W / 2, 200, .7], [W / 2 + 430, 200, .7]];
  function cardAt(j, lt, t) {
    const pin = L_RID + .5 + j * 1.0;
    const home = HOME[j], row = ROW[j];
    if (lt < L_FAST) return { x: home[0], y: home[1], sc: home[2], k: backOut(clamp((lt - pin) / .3)), front: true };
    if (lt < L_GUESS) {                                                         // twisting round the monster, faster and faster
      const u = lt - L_FAST, ang = -Math.PI / 2 + j * TAU / 3 + 1.2 * u * u * .5 + 1.4 * u, m = ease(clamp(u / .6));
      const ox = W / 2 + Math.cos(ang) * 660, oy = 520 + Math.sin(ang) * 300, front = Math.sin(ang) > -.2;
      return { x: lerp(home[0], ox, m), y: lerp(home[1], oy, m), sc: lerp(home[2], .62 + .14 * Math.sin(ang), m), k: 1, front, rot: .25 * Math.sin(ang * 2) * m };
    }
    const m = ease(seg(lt, L_GUESS, L_GUESS + .5)), u = L_GUESS - L_FAST, ang = -Math.PI / 2 + j * TAU / 3 + 1.2 * u * u * .5 + 1.4 * u;
    const ox = W / 2 + Math.cos(ang) * 660, oy = 520 + Math.sin(ang) * 300;
    const away = ease(seg(lt, L_CARDS_OFF + j * .1, L_CARDS_OFF + .5 + j * .1));
    return { x: lerp(ox, row[0], m), y: lerp(oy, row[1], m) - away * 450, sc: lerp(.62 + .14 * Math.sin(ang), row[2], m), k: 1, front: true, flip: ease(seg(lt, L_POP + .8 + j * .5, L_POP + 1.1 + j * .5)), check: (lt - L_POP - 1.1 - j * .5) / .3 };
  }

  function riddle(i) {
    const name = ORDER[i], R = RID[name], kind = COST[name];
    return t => {
      const lt = t - R0(i), rv = ease(seg(lt, L_POP, L_POP + .5)), off = seg(lt, L_POP, L_POP + .8);
      const guess = on(lt, L_GUESS, L_POP + .05, .3), fast = on(lt, L_FAST, L_GUESS, .4);
      const kk = kick(t, R0(i) + L_POP, 4);
      const zoom = 1 + .04 * fast + .06 * guess * ease(seg(lt, L_GUESS, L_POP)) + .04 * kk;
      camBegin(W / 2 + 14 * kk * Math.sin(t * 61), FLOOR - 330 + 10 * kk * Math.cos(t * 53), zoom, .02 * fast * Math.sin(t * 3));
      stage(t, { theme: R.col, reveal: rv });
      const C = [0, 1, 2].map(j => cardAt(j, lt, t));
      C.forEach((c, j) => { if (!c.front) card(R.clues[j], c.x, c.y, c.sc, t, c); });
      if (lt >= L_POP) springUp(name, W / 2, FLOOR, COSTUME_H, seg(lt, L_POP, L_POP + .3), () => R.act(W / 2, FLOOR, sOf(name, BASE), t, SHOW(lt - L_POP)));
      // the monster: drops in, sings on the beat, wobbles as the twister speeds up, trembles while you guess, then POP
      const drop = 1 - backOut(clamp(lt / .45)), sing = hop(t), wob2 = fast * Math.sin(t * 9);
      const A = costume(kind, W / 2, FLOOR - drop * 900 - (lt > .45 && lt < L_GUESS ? 26 * sing : 0), COSTUME_H, t, {
        sq: lt < .7 ? .18 * kick(t, R0(i) + .45, 7) : .05 * sing - .03 + .05 * fast * Math.sin(t * 18), rot: .05 * Math.sin(t * Math.PI) + .08 * wob2, shake: 7 * guess, off, who: name });
      C.forEach((c, j) => { if (c.front) card(R.clues[j], c.x, c.y, c.sc, t, c); });
      camEnd();
      dim(guess);
      if (lt > L_GUESS && lt < L_POP) {                                          // two beats to guess: ? ? and three dots
        qmark(330, 600, 220, t, R0(i) + L_GUESS + .1, L_POP - L_GUESS); qmark(W - 330, 600, 220, t, R0(i) + L_GUESS + .6, L_POP - L_GUESS - .5);
        overlay(() => { for (let d = 0; d < 3; d++) { const lit = lt > L_GUESS + .5 + d * .5; circle(W / 2 + (d - 1) * 70, H - 70, lit ? 24 : 16, { fill: lit ? '#FFE45C' : 'rgba(255,253,246,.3)', stroke: PAL.ink, lwPx: 4 }); } });
      }
      if (lt < L_RID) qmark(Math.min(W - 130, A.top[0] + A.w / 2 + 40), FLOOR - 640, 160, t, R0(i) + .45, L_RID - .45);
      flash(.85 * (1 - seg(lt, L_POP, L_POP + .3)) * (lt >= L_POP ? 1 : 0));
      burst(W / 2, FLOOR - 300, t, R0(i) + L_POP, '#FFE45C');
      confetti(t, R0(i) + L_POP, 50, 5);
      badge(i, t, on(lt, .3, L_OUT));
      if (lt > L_OUT) overlay(() => { const u = ease(seg(lt, L_OUT, RL)); X.fillStyle = R.col; X.fillRect(W * (1 - u) - 40, 0, W + 80, H); });   // the wipe
      if (lt < .25 && i > 0) overlay(() => { const u = ease(seg(lt, 0, .25)); X.fillStyle = RID[ORDER[i - 1]].col; X.fillRect(-W * u - 40, 0, W + 80, H); });
    };
  }

  // ---------- intro: the title on crayon paper, the seven on stage ----------
  function paperBg(t) {
    X.fillStyle = '#FFF8EA'; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) for (let j = 0; j < 15; j++) circle(40 + i * 75, 40 + j * 75, 2.2, { fill: 'rgba(80,60,40,.18)', stroke: null });
  }
  function title(t) {
    paperBg(t);
    ORDER.forEach((n, i) => {                                                   // the seven pop up on the beats, the same size, a ? over each
      const t0 = 1 + i * .5, kk = backOut(clamp((t - t0) / .3)); if (kk <= 0) return;
      const x = 230 + i * 243, y = 990 - 14 * (i % 2);
      const a = costume(COST[n], x, y, 300 * kk, t, { sq: .05 * hop(t, 1, i * .25), rot: .05 * Math.sin(t * 4 + i) });
      slam('?', x, a.top[1] - 50, 90, CRAY[i % 6], t, t0 + .3, { rot: .1 });
    });
    slam('THE TROLLS', W / 2, 190, 130, '#6A3FB0', t, .2, { rot: -.04 });
    slam("WHO'S INSIDE?", W / 2, 370, 150, '#E5466E', t, 4.6, { rot: .03 });
    flash(.8 * (1 - seg(t, 0, .25)), '#FFFFFF');
  }
  function onStage(t) {
    const lt = t - S_STAGE, out = ease(seg(lt, 4.2, 5.6));
    camBegin(W / 2, FLOOR - 330, 1 + .03 * lt, 0);
    stage(t, { curtain: ease(seg(lt, 0, 1.4)) });
    [...ORDER.keys()].reverse().forEach(i => { const n = ORDER[i], x = 270 + i * 230, sd = i < 3 ? -1 : 1, xx = i === 0 ? lerp(x, W / 2, out) : x + sd * out * 1300;   // they hop off to the wings; the first one stays
      costume(COST[n], xx, FLOOR - 30 * hop(t, 1, i * .5), 330 * (i === 0 ? 1 + .3 * out : 1), t, { sq: .06 * hop(t, 1, i * .5) - .03, rot: .06 * Math.sin(t * 5 + i), who: n }); });
    camEnd();
    dim(.6 * ease(seg(lt, 4.6, 6)));
  }

  // ---------- the finale: the recap (the costumes, then the faces, one per beat), the dance, THE END ----------
  const LX = i => 300 + i * 220;
  function lineupPeople(t, mode) {
    ORDER.forEach((n, i) => { const x = LX(i), s = sOf(n, 2.05), b = hop(t, 1, i * .3);
      if (mode === 'laugh') RIG[n](x, FLOOR, s, { t, eyes: 'happy', mouth: b > .5 ? 'grin' : 'open', brows: 'up', handL: [-2.6, -10.5], handR: [2.6, -10.5], dy: -.3 * b, tilt: .08 * Math.sin(t * 6 + i) });
      else tada(n, x, FLOOR, s, t, 1); });
  }
  const P_POP = 8.5, REC_H = 360, RX = i => 250 + i * 235;                  // the sung "pop pop pop…", one face per half beat
  function recap(t) {
    const lt = t - S_RECAP, offAt = i => P_POP + i * .25, s = n => sOf(n, BASE * REC_H / COSTUME_H);
    camBegin(W / 2, FLOOR - 330, .92, 0);                                      // pulled back: seven big drawings in a row
    stage(t, { theme: '#E58AB8', reveal: ease(seg(lt, P_POP - .2, P_POP + .4)), noSign: lt > P_POP });
    const dress = (n, i, off) => costume(COST[n], RX(i), FLOOR - 20 * hop(t, 1, i * .25), REC_H * backOut(clamp((lt - i * .5) / .3)), t, { sq: .05 * hop(t, 1, i * .25), off, who: n });
    ORDER.forEach((n, i) => { if (lt > i * .5 && lt < offAt(i)) dress(n, i, 0); });        // the seven drop into a line, each worn
    ORDER.forEach((n, i) => { if (lt < offAt(i)) return; const b = hop(t, 1, i * .3), up = lt > offAt(i) + .5;   // POP: out they spring, one per half beat
      springUp(n, RX(i), FLOOR, REC_H, seg(lt, offAt(i), offAt(i) + .3), () => RIG[n](RX(i), FLOOR, s(n), { t, eyes: 'happy', mouth: up && b < .5 ? 'open' : 'grin', brows: 'up',
        handL: [-4.6, -19], handR: [4.6, -19], handPoseL: 'palm', handPoseR: 'palm', jump: up ? .6 * b : 0 })); });
    ORDER.forEach((n, i) => { const o = seg(lt, offAt(i), offAt(i) + .7); if (o > 0 && o < 1) dress(n, i, o); });   // the drawings fly off on top
    camEnd();
    ORDER.forEach((n, i) => { burst(RX(i), FLOOR - 200, t, S_RECAP + offAt(i), CRAY[i % 6], 10, 200); });
    confetti(t, S_RECAP + P_POP, 50, 5);
  }
  const DANCE = {                                                                // everyone's move, changing every two bars
    alma: (x, s, t, ph) => alma(x, FLOOR, s, { t, ...almaDance(t, ['disco', 'twirl', 'star jump', 'floss'][ph], { bpm: 120 }), power: 1, eyes: 'star' }),
    jenna: (x, s, t, ph) => jenna(x, FLOOR, s, { ...jennaDance(t, ['floss', 'star jump', 'disco', 'twirl'][ph]), t }),
    danny: (x, s, t, ph) => ph % 2 ? POSE('danny')['goal!'](x, FLOOR, s, t) : POSE('danny').dribble(x, FLOOR, s, t),
    housam: (x, s, t, ph) => ph % 2 ? POSE('housam').juggle(x, FLOOR, s, t) : housam(x, FLOOR, s, { eyes: 'happy', mouth: 'grin', handL: [-4.7, -22], handR: [4.7, -22], handPoseL: 'palm', handPoseR: 'palm', jump: 1.2 * hop(t) }),
    sarah: (x, s, t, ph) => sarahPerform(x, FLOOR, s, t, ph % 2 ? 'volleyball set' : 'rebellion', { k: .7 }),
    sami: (x, s, t, ph) => sami(x, FLOOR, s, { t, power: ph % 2, eyes: ph % 2 ? 'glow' : 'happy', mouth: 'grin', brows: 'up', handL: [-5.6, -14.2 - 3 * hop(t)], handR: [5.6, -14.2 - 3 * hop(t, 1, .5)], handPoseL: 'palm', handPoseR: 'palm', jump: .8 * hop(t) }),
    safadi: (x, s, t, ph) => safadi(x, FLOOR, s, { t, power: ph % 2, eyes: ph % 2 ? 'glow' : 'happy', mouth: 'grin', brows: 'up', handL: [-5.6, -14.2 - 3 * hop(t, 1, .5)], handR: [5.6, -14.2 - 3 * hop(t)], handPoseL: 'palm', handPoseR: 'palm', jump: .8 * hop(t, 1, .5) }),
  };
  const DORDER = ['sarah', 'housam', 'safadi', 'alma', 'sami', 'jenna', 'danny'];   // the twins either side of Alma
  function dance(t) {
    const lt = t - S_DANCE, ph = Math.floor(lt / 4) % 4, k = kick(t, S_DANCE + 4 * Math.floor(lt / 4), 5);
    camBegin(W / 2 + 60 * Math.sin(t * .4), FLOOR - 330, 1 + .03 * k + .015 * hop(t) + .05 * (ph % 2), .01 * Math.sin(t * .7));
    stage(t, { theme: CRAY[ph], reveal: 1, noSign: true });
    // the costumes, empty now, bounce over everyone's heads like beach balls
    ORDER.forEach((n, i) => { const u = frac(lt / 3.5 + i / 7), x = -200 + (W + 400) * u, y = 330 - 150 * Math.abs(Math.sin((lt + i) * 1.8));
      costume(COST[n], x, y + 90, 170, t, { rot: lt * 2 + i, noShadow: true }); });
    DORDER.forEach((n, i) => DANCE[n](LX(i), sOf(n, 2.05), t, (ph + i) % 4));
    camEnd();
    confetti(t, S_DANCE, 70, 14);
    overlay(() => { X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = W * (.2 + .2 * i) + 200 * Math.sin(t * 1.3 + i * 2); const g = X.createRadialGradient(x, H * .7, 10, x, H * .7, 260);
      g.addColorStop(0, rgba(CRAY[i], .25)); g.addColorStop(1, rgba(CRAY[i], 0)); X.fillStyle = g; X.fillRect(0, 0, W, H); } X.globalCompositeOperation = 'source-over'; });
  }
  function theEnd(t) {
    const lt = t - S_END;
    camBegin(W / 2, FLOOR - 330, 1, 0);
    stage(t, { theme: '#E58AB8', reveal: 1, noSign: true });
    lineupPeople(t, 'laugh');
    ORDER.forEach((n, i) => costume(COST[n], LX(i) + 60, FLOOR - 330 - 30 * hop(t, 1, i * .3), 140, t, { rot: .2 * Math.sin(t * 3 + i), noShadow: true }));
    camEnd();
    confetti(t, S_END - 1, 60, 7);
    overlay(() => { const c = backOut(seg(lt, .3, .7)); if (c <= 0) return; X.save(); X.translate(W / 2, 170); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-360, -100, 720, 200), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .12 });
      X.font = `120px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 16; X.strokeStyle = PAL.ink; X.strokeText('THE END', 0, 10); X.fillStyle = '#E5466E'; X.fillText('THE END', 0, 10); X.restore(); });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 1.8, END - .3))));
  }

  // every shot ends with the karaoke strip on top
  const withKaraoke = fn => (t, lt, dur) => { fn(t, lt, dur); wiKaraoke(t); };
  scene({ duration: END, fps: 24, bpm: 120,
    shots: [
      [0, title], [S_STAGE, onStage],
      ...ORDER.map((n, i) => [R0(i), riddle(i)]),
      [S_RECAP, recap], [S_DANCE, dance], [S_END, theEnd],
    ].map(([t0, fn]) => [t0, withKaraoke(fn)]) });
})();
