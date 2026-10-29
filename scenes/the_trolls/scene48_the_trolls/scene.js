// Scene 48: "The Trolls", a music video, the finale of The Trolls series (45–47). Dressed as the monsters Alma drew, the family
// marches on Dove Creek Elementary and challenges every class to tongue twisters (science, library, math, gym), then the whole
// school to a tournament. The heads come off; the students ask Pearl, Neptune and Dragon to take theirs off too. They can't.
// The picture is cut to the song (audio.mp3, 120 bpm: beats at 0.1 + 0.5 n s). Every section start is a constant below, taken
// from the karaoke times in lyrics.js. The costumes are Alma's real drawing, cut out into costumes/*.png (one more, Dr. G's
// broccoli in a sock, is drawn in code: she got whatever was left). Every shot is a pure function of t.
(() => {
  const ME = ASSETS.scene.scene48_the_trolls, B = .5, beat = n => .1 + B * n;
  const DC = LOCATIONS.dces, SR = LOCATIONS.science_room, LB = LOCATIONS.school_library, GY = LOCATIONS.school_gym;
  const img = f => { const i = new Image(); i.src = `${ME.dir}/${f}`; return i; };
  const ready = i => i && i.complete && i.naturalWidth > 0;

  // ---------- sections (seconds into the song) ----------
  const S_STREET = 3.3, S_HERO = 8.1, S_DOORS = 16.1, S_BURST = 20.1, S_PUMPKIN = 23.6, S_OWL = 27.5, S_GHOST = 31.3, S_BIRD = 33.4;
  const S_HALL = 35.3, S_CLASS = 39.4, S_VS = 43.9, S_CH1 = 47.8, S_TOGYM = 79.8;
  const S_GYM = 81.8, S_GRIN = 85.7, S_RADISH = 87.9, S_SPINACH = 89.9, S_SHOE = 91.9, S_DARE = 93.9;
  const S_CH2 = 96.2, S_TIRED = 112.2, S_BRIDGE = 115.1, S_STARE = 119.4, S_SPACE = 123.5, S_NEWS = 127.7, S_COUNT = 131.7;
  const S_TOGETHER = 135.7, S_FLOP = 143.0, S_DANCE = 144.1, S_REVEAL = 166.6, S_BACK = 172.5, S_FACES = 175.6, S_END = 179.4, END = 182.4;
  const word = (row, i = 0) => TR_LYRICS[row][1][i];

  // ---------- helpers ----------
  const inW = (t, a, b) => t >= a && t < b;
  const on = (t, a, b, r = .25) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const hop = (t, f = 1, ph = 0) => Math.abs(Math.sin(((t - .1) * 2 * f + ph) * Math.PI));   // a bounce on every beat
  const lerpCam = (a, b, u) => ({ ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u) });
  const drift = (c, t, a = 1) => ({ ...c, x: c.x + 10 * a * Math.sin(t * .37), hy: c.hy + 5 * a * Math.sin(t * .29) });
  function slam(txt, x, y, size, col, t, t0, o = {}) {                         // a big crayon title word that slams in
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
      if (y > H + 30) continue; X.save(); X.translate(x, y); X.rotate(a * 5 + i); shape(rectPts(-9, -5, 18, 10), { fill: TR_CRAYON[i % 6], stroke: null }); X.restore(); } });
  }
  function stars(cx, cy, r, t, k = 1) {                                          // tongue-tied: dizzy stars round a head
    if (k <= .01) return; overlay(() => { for (let i = 0; i < 4; i++) { const a = t * 5 + i * TAU / 4;
      shape(starPts(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .3, r * .22 * k, .45, 5, t * 3 + i), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 3 }); } });
  }
  function bubble(text, a, age, o = {}) {                                        // a twister in a speech bubble, typed fast
    if (!a) return; callout(text, a[0] + (o.side ?? 1) * 30, a[1], age, { size: o.size ?? 46, maxW: o.maxW ?? 620, cps: o.cps ?? 24, hold: o.hold ?? .8, kind: o.kind, accent: o.accent ?? '#E5466E', dx: (o.side ?? 1) * (o.dx ?? 230), dy: o.dy ?? -200 });
  }

  // ---------- the costumes ----------
  const SPR = Object.fromEntries(['owl', 'bat', 'pumpkin', 'pink_ghost', 'bird', 'bee', 'cat', 'white_ghost'].map(n => [n, img(`costumes/${n}.png`)]));
  const COST = {
    safadi: { spr: 'owl', h: 195, nick: 'THE GRUMPY OWL', real: 'PROFESSOR SAFADI', col: '#5B6FD8' },
    sami: { spr: 'bat', h: 150, nick: 'THE BIG BAT', real: 'DOCTOR SAMI', col: '#6E6A86' },
    danny: { spr: 'pumpkin', h: 125, nick: 'THE FUZZY PUMPKIN', real: 'DANNY', col: '#C0653A' },
    alma: { spr: 'pink_ghost', h: 115, nick: 'THE PINK GHOST', real: 'ALMA', col: '#E58AB8' },
    housam: { spr: 'bird', h: 115, nick: 'THE BLUE BIRD', real: 'HOUSAM', col: '#5E8FD8' },
    jenna: { spr: 'bee', h: 140, nick: 'THE BUZZY BEE', real: 'JENNA', col: '#D9A520' },
    sarah: { spr: 'cat', h: 150, nick: 'THE STRIPY CAT', real: 'SARAH', col: '#C8C24A' },
    roudaynah: { spr: 'white_ghost', h: 170, nick: 'THE SKULL GHOST', real: 'ROUDAYNAH', col: '#8C8C98' },
    dr_g: { spr: 'broccoli', h: 185, nick: 'BROCCOLI IN A SOCK', real: 'DR. G', col: '#4DA650' },
  };
  const GANG = ['dr_g', 'roudaynah', 'sarah', 'jenna', 'danny', 'safadi', 'alma', 'housam', 'sami'];   // left to right in a lineup
  const aspect = n => COST[n].spr === 'broccoli' ? .66 : (ready(SPR[COST[n].spr]) ? SPR[COST[n].spr].naturalWidth / SPR[COST[n].spr].naturalHeight : 1);
  // Dr. G got whatever was left: a broccoli in a striped sock, drawn in crayon style (sprite space: width w, height h, feet at 0)
  function broccoliSock(w, h, t) {
    const sw = w * .55, top = -h * .5;
    shape([[-sw / 2, top], [sw / 2, top], [sw / 2 + 4, -h * .1], [sw / 2 + w * .12, -h * .02], [sw / 2 + w * .1, 0], [-sw / 2, 0]], { fill: '#FFFDF6', stroke: '#3B3B3B', lwPx: 3, smooth: .35 });
    for (let i = 0; i < 4; i++) { const y = top + 14 + i * h * .1; line([[-sw / 2 + 2, y], [sw / 2 - 2, y + 2]], { stroke: i % 2 ? '#4166B8' : '#D7262E', lwPx: Math.max(3, w * .05) }); }
    line([[-sw * .2, top + 4], [-sw * .2, -h * .62]], { stroke: '#5A8F3A', lwPx: w * .12 }); line([[sw * .15, top + 4], [sw * .2, -h * .64]], { stroke: '#5A8F3A', lwPx: w * .1 });
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI, r = w * .17 + w * .03 * Math.sin(i * 3.1 + t * 4);
      circle(Math.cos(a + Math.PI) * w * .32, -h * .74 - Math.sin(a) * h * .16, r, { fill: i % 2 ? '#3E8E41' : '#5DB760', stroke: '#2D5A2E', lwPx: 3 }); }
    circle(0, -h * .8, w * .22, { fill: '#5DB760', stroke: '#2D5A2E', lwPx: 3 });
    circle(-w * .09, -h * .78, w * .045, { fill: '#2B2430', stroke: null }); circle(w * .09, -h * .78, w * .045, { fill: '#2B2430', stroke: null });
    line([[-w * .08, -h * .71], [0, -h * .68], [w * .08, -h * .71]], { stroke: '#2B2430', lwPx: 3, smooth: true });
  }
  // a costume standing at screen (x, y) with k px per world unit. o: walk (phase in steps), hop/sq/rot, flip, scale, off (0..1: it
  // flies off, revealing whoever was inside), spin (radians, about the middle). Returns { top, mouth, feet, h, w }.
  function monster(name, x, y, k, t, o = {}) {
    const c = COST[name], hh = c.h * k * (o.scale ?? 1), ww = hh * aspect(name);
    let rot = o.rot || 0, up = (o.hop || 0) * k, sq = o.sq || 0;
    if (o.walk != null) { rot += .09 * Math.sin(o.walk * Math.PI); up += 8 * k * Math.abs(Math.sin(o.walk * Math.PI)); }
    const off = o.off || 0;
    if (!o.noShadow && off < .5) ellipse(x, y, ww * .38, hh * .05, { fill: 'rgba(40,28,30,.18)', stroke: null });
    if (off >= 1) return { top: [x, y - hh], mouth: [x, y - hh * .62], feet: [x, y], h: hh, w: ww };
    X.save(); X.translate(x, y - up - off * hh * 1.8);
    if (o.spin || off) { X.translate(0, -hh / 2); X.rotate((o.spin || 0) + off * 3.2); X.translate(0, hh / 2); }
    X.rotate(rot); X.scale((o.flip ? -1 : 1) * (1 + sq), 1 - sq); X.globalAlpha = 1 - seg(off, .55, 1);
    if (c.spr === 'broccoli') broccoliSock(ww, hh, t);
    else if (ready(SPR[c.spr])) X.drawImage(SPR[c.spr], -ww / 2, -hh, ww, hh);
    X.restore();
    if (o.angry) { const r = o.angry; overlay(() => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .45, L = hh * .25 * r;   // red rebellion lightning
      line([[x + Math.cos(a) * hh * .45, y - hh * .55 + Math.sin(a) * hh * .45], [x + Math.cos(a) * (hh * .45 + L * .5) + 8, y - hh * .55 + Math.sin(a) * (hh * .45 + L * .5)], [x + Math.cos(a) * (hh * .45 + L), y - hh * .55 + Math.sin(a) * (hh * .45 + L)]], { stroke: '#E03C3C', lwPx: 5 }); } }); }
    return { top: [x, y - up - hh], mouth: [x, y - up - hh * .62], feet: [x, y], h: hh, w: ww };
  }

  // ---------- the people inside (for the reveal) and the students ----------
  const RIG = { safadi, sami, housam, alma, danny, jenna, sarah, roudaynah, dr_g };
  const UNIT = { safadi: SAFADI_UNIT, sami: SAMI_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT, sarah: SARAH_UNIT, roudaynah: ROUDAYNAH_UNIT, dr_g: DR_G_UNIT };
  const BELLY = { safadi: [2.4, -10.8], sami: [2.5, -10.4], housam: [2.0, -13.5], alma: [1.6, -7.4], danny: [2.2, -11.4], jenna: [2.2, -11.3], sarah: [2.4, -17], roudaynah: [2.6, -18.5], dr_g: [2.4, -17] };
  const UPH = { safadi: [5.6, -21], sami: [5.6, -20], housam: [5.2, -24], alma: [4.6, -11.5], danny: [4.6, -20], jenna: [4.6, -20], sarah: [5, -28], roudaynah: [5.5, -27], dr_g: [6.5, -26] };
  function person(name, x, y, k, t, ph, o = {}) {                               // laughing their heads off
    const b = BELLY[name], u = UPH[name], hb = Math.abs(Math.sin(t * 11 + ph)), arms = o.armsUp;
    const pose = { t, eyes: 'happy', mouth: 'open', brows: 'up', dy: -.35 * hb, tilt: .08 * Math.sin(t * 6 + ph), handPoseL: 'open', handPoseR: 'open',
      handL: arms ? [-u[0], u[1]] : [-b[0], b[1]], handR: arms ? [u[0], u[1]] : [b[0], b[1]] };
    if (name === 'dr_g') pose.hearts = .4;
    return RIG[name](x, y, UNIT[name] * k, { ...pose, ...o.pose });
  }
  const LOOK = {}; const look = seed => LOOK[seed] ??= studentLook(seed);
  function kid(seed, x, y, k, t, o = {}) {
    const L = look(seed), ph = seed * .7;
    let p = { look: L, seed, t, eyes: 'open', mouth: 'smile', brows: 'normal', lookX: o.lookX ?? 0 };
    if (o.mood === 'gasp') p = { ...p, eyes: 'wide', mouth: 'O', brows: 'up', handL: [-1.4, -17], handR: [1.4, -17], jump: .4 * Math.exp(-(o.age ?? 9) * 5) };
    if (o.mood === 'laugh') { const b = Math.abs(Math.sin(t * 11 + ph)); p = { ...p, eyes: 'happy', mouth: 'open', brows: 'up', handL: [-2.2, -11.4], handR: [2.2, -11.4], dy: -.4 * b, tilt: .08 * Math.sin(t * 6 + ph) }; }
    if (o.mood === 'cheer') p = { ...p, eyes: 'happy', mouth: 'O', brows: 'up', handL: [-4.6, -20], handR: [4.6, -20], handPoseL: 'fist', handPoseR: 'fist', jump: 1.6 * hop(t, 1, ph * .1) };
    if (o.mood === 'flub') p = { ...p, eyes: Math.sin(t * 9) > 0 ? 'squeeze' : 'wide', mouth: 'O', brows: 'worried', tilt: .1 * Math.sin(t * 15), handL: [-4.6, -16], handR: [4.6, -16] };
    if (o.mood === 'talk') p = { ...p, mouth: lipFlap(t, true, 'smile'), brows: 'up', handR: [4.4, -19.5], handPoseR: 'point' };
    if (o.mood === 'run') p = { ...p, ...studentWalk(o.walk || 0, 1), eyes: 'happy', mouth: 'O' };
    if (o.mood === 'flat') p = { ...p, rot: o.rot ?? 1.4, eyes: 'squeeze', mouth: 'O' };
    const A = student(x, y, STUDENT_UNIT * k * L.h, { ...p, ...o.pose }); A.feet = [x, y]; return A;
  }

  // ---------- staging in a 3D set: items far to near, the set's front pieces interleaved ----------
  // item: { z, draw(P) → anchors, id }. dces has no toZ, so its front pieces are drawn once, over everyone.
  function staged(set, P, t, opt, items, blur = 0) {
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    const A = {}; let prev = items.length ? items[0].z : 0;
    if (set === DC) {
      const near = items.length ? items[items.length - 1].z : 0;
      layer(() => set.back(P, t, { ...opt, splitZ: near - 1 }), { blur });
      for (const it of items) if (P.depth(it.z) > 30) A[it.id] = it.draw(P);
      set.front(P, t, { ...opt, splitZ: near - 1 }); return A;
    }
    layer(() => set.back(P, t, { ...opt, splitZ: prev }), { blur });
    for (const it of items) { set.front(P, t, { ...opt, splitZ: prev, toZ: it.z }); prev = it.z; if (P.depth(it.z) > 30) A[it.id] = it.draw(P); }
    set.front(P, t, { ...opt, splitZ: prev });
    return A;
  }
  const M = (name, x, z, o = {}, y = 0) => ({ id: name, z, draw: P => { const [sx, sy, k] = P.p(x, y, z); return monster(name, sx, sy, k, T, typeof o === 'function' ? o() : o); } });
  const K = (seed, x, z, o = {}, y = 0) => ({ id: 's' + seed, z, draw: P => { const [sx, sy, k] = P.p(x, y, z); return kid(seed, sx, sy, k, T, typeof o === 'function' ? o() : o); } });

  // =====================================================================================================
  // ---------- intro: the title, the march ----------
  function paperBg(t, col = '#FFF8EA') {
    X.fillStyle = col; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) for (let j = 0; j < 15; j++) circle(40 + i * 75, 40 + j * 75, 2.2, { fill: 'rgba(80,60,40,.18)', stroke: null });
  }
  function titleShot(t) {
    paperBg(t);
    GANG.forEach((n, i) => {                                                    // the monsters pop up on the beats, then bob
      const t0 = beat(i * .7), k = backOut(clamp((t - t0) / .3)); if (k <= 0) return;
      const x = 150 + i * 205, y = 930 + 20 * (i % 2) - 30 * hop(t, 1, i * .25);
      monster(n, x, y, 1.9 * k, t, { rot: .06 * Math.sin(t * 4 + i), noShadow: true });
    });
    slam('THE', W / 2, 190, 90, '#6A3FB0', t, .3, { rot: -.05 });
    slam('TROLLS', W / 2, 330, 210, '#E5466E', t, .8, { rot: .02 });
    slam('THE FINALE', W / 2, 470, 64, '#2E7D9A', t, 1.6, { rot: -.03 });
    flash(.8 * (1 - seg(t, 0, .25)), '#FFFFFF');
  }
  const LINEX = [-560, -420, -280, -140, 0, 140, 280, 420, 560];
  function streetMarch(t) {                                                     // across the front sidewalk, in step
    const lt = t - S_STREET, P = persp(drift({ x: 0, y: 190, z: 1150, f: 1050, hy: 600 }, t));
    const items = GANG.map((n, i) => { const x = -1500 + i * 165 + 240 * (t - S_STREET) + 0 * i; return M(n, x, 2060 + 25 * (i % 2), { walk: (t - .1) * 2 + i * .5 }); });
    staged(DC, P, t, {}, items);
    const W0 = TR_LYRICS[0][1];
    ['ONE!', 'TWO!', 'THREE!', "LET'S", 'GO!'].forEach((w, i) => slam(w, 380 + i * 300, 260 + (i % 2) * 70, i > 2 ? 150 : 120, TR_CRAYON[i], t, W0[i], { life: i > 2 ? 3 : .9, rot: (i % 2 ? .06 : -.06) }));
  }
  function heroWalk(t) {                                                        // slow motion, a low angle, leaves blowing
    const lt = t - S_HERO, u = ease(seg(lt, 0, 7.5)), P = persp(drift({ x: 0, y: 55, z: 1500 + 120 * u, f: 860, hy: 700 }, t, .5));
    const items = GANG.map((n, i) => M(n, LINEX[i], 2120 - 260 * u - 30 * Math.abs(i - 4), { walk: lt * .9 + i * .3, scale: 1 }));
    items.push(K(11, -760, 1900, () => ({ mood: 'gasp', age: lt - 3, pose: { lookX: .8 } })), K(12, 760, 1880, () => ({ mood: 'gasp', age: lt - 3.5, pose: { lookX: -.8 } })));
    const A = staged(DC, P, t, { wind: 1 }, items, 1.2);
    overlay(() => { for (let i = 0; i < 14; i++) { const a = frac(lt * .12 + hash(i)), x = W * (1.1 - 1.3 * a), y = H * (.2 + .7 * hash(i + 4)) + 60 * Math.sin(a * 9 + i);
      X.save(); X.translate(x, y); X.rotate(a * 9 + i); shape([[0, -14], [9, 0], [0, 14], [-9, 0]], { fill: ['#E0A800', '#FF8A3D', '#C0653A'][i % 3], stroke: PAL.ink, lwPx: 2, smooth: .6 }); X.restore(); } });
    if (A.s11) sfx('*gasp*', A.s11.top[0], A.s11.top[1] - 40, 40, '#FFFFFF', lt - 3, { life: 1.4 });
    if (A.s12) sfx('😱', A.s12.top[0], A.s12.top[1] - 40, 56, '#FFFFFF', lt - 3.5, { life: 1.4 });
    X.fillStyle = 'rgba(255,190,120,.10)'; X.fillRect(0, 0, W, H);           // morning glow
  }

  // ---------- verse 1: the doors, the crew, the hallway, the science room ----------
  function doorsMarch(t) {
    const lt = t - S_DOORS, P = persp(drift({ x: 0, y: 170, z: 1250 + 60 * lt, f: 1000, hy: 610 }, t));
    const items = GANG.map((n, i) => M(n, LINEX[i] * .9, 1900 + 40 * lt - 25 * Math.abs(i - 4), { walk: (t - .1) * 2 + i * .5 }));
    staged(DC, P, t, {}, items);
  }
  function doorsBurst(t) {
    const lt = t - S_BURST, k = kick(t, S_BURST + .5, 3), P = persp(drift({ x: 0, y: 120, z: 1820, f: 1000, hy: 640 }, t));
    camBegin(W / 2 + 22 * k * Math.sin(t * 61), H / 2 + 16 * k * Math.cos(t * 53), 1 + .03 * k);
    const items = GANG.map((n, i) => M(n, LINEX[i] * .55, 2150 + 160 * easeIn(seg(lt, 1.6, 3.4)) - 15 * Math.abs(i - 4), { walk: (t - .1) * 3 + i * .5, hop: 10 * hop(t, 2, i * .3) }));
    staged(DC, P, t, {}, items);
    camEnd();
    flash(.9 * Math.exp(-Math.max(0, lt - .5) * 4) * (lt > .5), '#FFFFFF');
    slam('BAM!', W / 2, 300, 180, '#FFD34E', t, S_BURST + .5, { life: 1.3 });
  }
  // a heist-movie crew card: the costume big, its nickname, and who is inside
  function crewCard(name, t0, t1) {
    return t => {
      const lt = t - t0, c = COST[name], u = backOut(clamp(lt / .35));
      X.fillStyle = c.col; X.fillRect(0, 0, W, H);
      for (let i = -4; i < 14; i++) shape([[i * 180 + lt * 120, 0], [i * 180 + 90 + lt * 120, 0], [i * 180 - 260 + lt * 120, H], [i * 180 - 350 + lt * 120, H]], { fill: 'rgba(255,255,255,.12)', stroke: null });
      monster(name, lerp(-400, 560, u), 950 + 18 * hop(t), 3.9 * (c.h > 160 ? 160 / c.h : 1), t, { rot: .05 * Math.sin(t * 3), noShadow: true });
      overlay(() => {
        X.save(); X.translate(lerp(W + 600, 1340, u), 430); X.rotate(-.04);
        shape(rectPts(-470, -150, 940, 300), { fill: '#FFF8EA', stroke: PAL.ink, lwPx: 8, smooth: .12 });
        X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
        X.font = `${c.nick.length > 15 ? 68 : 82}px ${FONT_SFX}`; X.lineWidth = 12; X.strokeStyle = PAL.ink; X.strokeText(c.nick, 0, -40); X.fillStyle = c.col; X.fillText(c.nick, 0, -40);
        X.font = `600 44px ${FONT_TALK}`; X.fillStyle = PAL.ink; X.fillText(`a.k.a. ${c.real}`, 0, 70);
        X.restore();
      });
      flash(.7 * (1 - seg(lt, 0, .2)));
    };
  }
  // the hallway: lockers rush past; the rest of the crew whizzes through, one per beat, each with a quick name tag
  function lockers(t, speed, tint = '#F2E6CC') {
    X.fillStyle = tint; X.fillRect(0, 0, W, H);
    X.fillStyle = '#C9B48A'; X.fillRect(0, 780, W, H - 780);
    for (let i = 0; i < 9; i++) line([[0, 800 + i * i * 4], [W, 800 + i * i * 4]], { stroke: 'rgba(90,70,40,.25)', lwPx: 2 });
    const off = (t * speed) % 160;
    for (let i = -1; i < 14; i++) { const x = i * 160 - off;
      shape(rectPts(x + 6, 230, 148, 540), { fill: i % 4 === 1 ? '#E5466E' : '#4166B8', stroke: PAL.ink, lwPx: 4 });
      for (let j = 0; j < 3; j++) line([[x + 40, 270 + j * 14], [x + 120, 270 + j * 14]], { stroke: 'rgba(0,0,0,.35)', lwPx: 3 });
      shape(rectPts(x + 120, 470, 14, 40), { fill: '#D9D9D9', stroke: PAL.ink, lwPx: 2 }); }
    X.fillStyle = '#E8DCC0'; X.fillRect(0, 0, W, 200); X.fillStyle = '#FFF4D0'; for (let i = -1; i < 6; i++) X.fillRect(i * 420 - (t * speed * .5) % 420, 40, 260, 40);
  }
  const HALL_CREW = ['sami', 'jenna', 'sarah', 'roudaynah', 'dr_g'];
  function hallway(t) {
    const lt = t - S_HALL; lockers(t, 900);
    HALL_CREW.forEach((n, i) => {
      const t0 = i * .8, u = (lt - t0) / 1.1; if (u < -.2 || u > 1.2) return;
      const x = lerp(-300, W + 300, u), mon = monster(n, x, 900, 3.0 * (COST[n].h > 160 ? 160 / COST[n].h : 1), t, { walk: lt * 5, rot: -.12 });
      for (let j = 0; j < 4; j++) line([[x - mon.w * .6 - 40 - j * 50, 600 + j * 70], [x - mon.w * .6 - 180 - j * 50, 600 + j * 70]], { stroke: 'rgba(255,255,255,.7)', lwPx: 6 });
      if (u > .15 && u < .85) overlay(() => { X.save(); X.translate(clamp(x, 300, W - 300), 170); X.rotate(-.05); shape(rectPts(-260, -50, 520, 100), { fill: COST[n].col, stroke: PAL.ink, lwPx: 6, smooth: .3 });
        X.font = `46px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF6'; X.fillText(`${COST[n].nick.replace('THE ', '')} · ${COST[n].real}`, 0, 4); X.restore(); });
    });
  }
  // the science room (classroom view, from the board): students at the benches, the monsters burst in down the aisle
  const SCI_KIDS = [[1, -380], [2, -240], [1, 220], [2, 360], [3, -330], [3, 300]].map(([n, x], i) => ({ seed: 20 + i, x, z: SR.bench(n, x).z }));
  function sciCrowd(t, mood) { return SCI_KIDS.map(s => K(s.seed, s.x, s.z, () => mood(s))); }
  function classEnter(t) {
    const lt = t - S_CLASS, P = persp(drift({ x: 0, y: 175, z: 1120, f: 760, hy: 520, dir: -1 }, t));
    const items = sciCrowd(t, s => ({ mood: lt > .6 ? 'gasp' : 'talk', age: lt - .6 - hash(s.seed) * .3 }));
    GANG.slice(2, 7).forEach((n, i) => items.push(M(n, lerp(-700, -90 + i * 45, ease(seg(lt, .2 + i * .25, 1.4 + i * .25))), 820 - i * 55, { walk: lt * 3 + i, hop: 14 * hop(t, 1, i * .2) })));
    staged(SR, P, t, { bubbling: 1 }, items);
    slam('MONSTERS!', W / 2, 220, 150, '#E5466E', t, S_CLASS + .6, { life: 2 });
  }
  function vsBanner(t, t0, left, right, colL, colR, dur = 3.6) {
    const k = on(t, t0, t0 + dur, .3); if (k <= .01) return;
    overlay(() => {
      const y = H - 210 + 220 * (1 - backOut(clamp((t - t0) / .35)));
      X.save(); X.translate(W / 2, y);
      shape(rectPts(-780, -60, 760, 120), { fill: colL, stroke: PAL.ink, lwPx: 7, smooth: .2 }); shape(rectPts(20, -60, 760, 120), { fill: colR, stroke: PAL.ink, lwPx: 7, smooth: .2 });
      X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      for (const [s, x] of [[left, -400], [right, 400]]) { X.font = `${s.length > 14 ? 50 : 62}px ${FONT_SFX}`; X.lineWidth = 10; X.strokeStyle = PAL.ink; X.strokeText(s, x, 6); X.fillStyle = '#FFFDF6'; X.fillText(s, x, 6); }
      const p = 1 + .08 * Math.sin(t * 10); X.scale(p, p); X.rotate(-.1); shape(starPts(0, 0, 100, .6, 10, t), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 6 });
      X.font = `70px ${FONT_SFX}`; X.lineWidth = 10; X.strokeText('VS', 0, 6); X.fillStyle = '#D7262E'; X.fillText('VS', 0, 6);
      X.restore();
    });
  }
  function vsShot(t) {
    const lt = t - S_VS, P = persp(drift({ x: -40, y: 150, z: 1110, f: 1000, hy: 560, dir: -1 }, t));
    const items = sciCrowd(t, s => ({ mood: 'gasp', age: 9 }));
    items.push(M('safadi', 40, 640, { hop: 10 * hop(t), rot: .05 * Math.sin(t * 4) }));
    const A = staged(SR, P, t, { bubbling: 1 }, items, .8);
    if (A.safadi) bubble('I challenge… YOU!', A.safadi.mouth, lt - .2, { side: -1, accent: '#5B6FD8', hold: 2 });
    vsBanner(t, S_VS + .8, 'THE GRUMPY OWL', 'THE WHOLE SCHOOL', '#5B6FD8', '#E5466E');
  }

  // =====================================================================================================
  // ---------- chorus 1: eight 4-second battles (challenger · victim flubs · the gag · the laugh) ----------
  // cfg: set, opt, cast (items), from/to ids, A camera (two-shot), B camera (the victim), twist, flub, gag
  function battle(cfg) {
    return t => {
      const lt = t - cfg.t0, u = backOut(clamp((lt - 1.65) / .25)), k = kick(t, cfg.t0 + cfg.gagAt, 3);
      const cam = lerpCam(cfg.camA, cfg.camB, u);
      camBegin(W / 2 + 18 * k * Math.sin(t * 61), H / 2 + 14 * k * Math.cos(t * 53), 1 + .03 * k);
      const P = persp(drift(cam, t, .6)), A = staged(cfg.set, P, t, cfg.opt || {}, cfg.cast(lt), 1.2 * u);
      if (cfg.under) cfg.under(t, lt, A, P);
      camEnd();
      const fa = A[cfg.from], ta = A[cfg.to];
      if (fa) bubble(cfg.twist, fa.mouth || fa.top, lt - .1, { side: cfg.sideF ?? -1, accent: cfg.accent, kind: cfg.kind, cps: 30, hold: .15, size: 44 });
      if (ta) bubble(cfg.flub, ta.mouth || ta.top, lt - 1.85, { side: cfg.sideT ?? 1, accent: '#E5466E', kind: cfg.kindT ?? cfg.kind, cps: cfg.cpsT ?? 22, hold: .9, size: 44 });
      if (ta && !cfg.noStars) stars(ta.top[0], ta.top[1] + 20, (ta.w || 120) * .45, t, on(t, cfg.t0 + cfg.gagAt - .2, cfg.t0 + 4, .2));
      if (cfg.gag) cfg.gag(t, lt, A, P);
      if (cfg.laugh !== false) Object.entries(A).forEach(([id, a], i) => { if (id === cfg.to || !a) return;
        sfx(['HA HA!', 'HEE HEE!', 'HO HO!', 'LOL!'][i % 4], a.top[0] + (i % 2 ? 40 : -40), a.top[1] - 30, 42, TR_CRAYON[i % 6], lt - 3.0 - .12 * i, { life: 1.1, rot: i % 2 ? .1 : -.1 }); });
    };
  }
  const BT = i => S_CH1 + 4 * i;
  const sciCam = (x, z, f = 1000, hy = 560) => ({ x, y: 150, z, f, hy, dir: -1 });
  // 1 · science: the pumpkin vs a student; the flask foams over
  const b1 = battle({ t0: BT(0), set: SR, opt: { bubbling: 1 }, from: 'danny', to: 's21', gagAt: 2.9, accent: '#C0653A',
    camA: sciCam(-60, 1110, 950), camB: sciCam(-250, 1030, 1350, 540),
    cast: lt => [M('danny', 30, 640, { hop: 10 * hop(T) }), K(21, -240, SR.bench(1, -240).z, { mood: lt > 1.8 ? 'flub' : 'gasp', age: 9 }), K(20, -380, SR.bench(2, -380).z, { mood: lt > 3 ? 'laugh' : 'gasp', age: 9 })],
    twist: 'Fuzzy pumpkins fizz in frizzy flasks!', flub: 'Frizzy… fuzzy… FIZZY FOAM!',
    gag: (t, lt, A) => { const a = A.s21; if (!a || lt < 2.9) return; const g = ease(seg(lt, 2.9, 3.4));       // foam everywhere
      overlay(() => { for (let i = 0; i < 26; i++) { const r = (30 + 40 * hash(i)) * g; circle(a.top[0] + (hash(i + 2) - .5) * 360 * g, a.top[1] + 60 + (hash(i + 7) - .5) * 260 * g - 40 * Math.sin(t * 3 + i), r, { fill: i % 3 ? '#E8FBFF' : '#C9F1FF', stroke: '#8CC8DA', lwPx: 3 }); } });
      slam('FOAM!', a.top[0], a.top[1] - 120, 120, '#7FD6F0', t, BT(0) + 2.95, { life: 1.1 }); } });
  // 2 · science: a student fires back at the owl, who starts to explain
  const b2 = battle({ t0: BT(1), set: SR, opt: { bubbling: 1 }, from: 's23', to: 'safadi', gagAt: 3.0, accent: '#E5466E', sideF: 1, sideT: -1,
    camA: sciCam(150, 1110, 950), camB: sciCam(60, 1130, 1250, 520),
    cast: lt => [M('safadi', 20, 640, { hop: lt > 1.8 ? 6 * Math.abs(Math.sin(T * 14)) : 8 * hop(T), rot: lt > 1.8 ? .1 * Math.sin(T * 13) : 0 }), K(23, 260, SR.bench(1, 260).z, { mood: lt < 1.7 ? 'talk' : lt > 3 ? 'laugh' : 'gasp', age: 9 }), K(22, 380, SR.bench(2, 380).z, { mood: lt > 2.8 ? 'cheer' : 'gasp', age: 9 })],
    twist: 'Grumpy owls grow great green grapes!', flub: 'Grumpy grapes… allow me to EXPLAIN—',
    gag: (t, lt) => { slam('NO EXPLAINING!', W / 2, 200, 120, '#E5466E', t, BT(1) + 3.0, { life: 1.0 }); } });
  // 3 · library: the pink ghost's whisper battle; the shelves sneeze books
  const libCam = (x, z, f = 1000, hy = 560) => ({ x, y: 160, z, f, hy, dir: -1 });
  function flyingBooks(t, t0, cx, cy, n = 12, spread = 700) {
    const age = t - t0; if (age < 0 || age > 2) return;
    overlay(() => { for (let i = 0; i < n; i++) { const a = age - hash(i) * .2; if (a < 0) continue; const ang = -Math.PI / 2 + (hash(i + 4) - .5) * 2.4, v = spread * (.6 + .5 * hash(i + 9));
      const x = cx + Math.cos(ang) * v * a, y = cy + Math.sin(ang) * v * a + 900 * a * a;
      X.save(); X.translate(x, y); X.rotate(a * 8 + i); shape(rectPts(-26, -34, 52, 68), { fill: TR_CRAYON[i % 6], stroke: PAL.ink, lwPx: 3 }); line([[-20, -34], [-20, 34]], { stroke: 'rgba(255,255,255,.6)', lwPx: 4 }); X.restore(); } });
  }
  const b3 = battle({ t0: BT(2), set: LB, opt: {}, from: 'alma', to: 's31', gagAt: 3.0, accent: '#E58AB8', kind: 'whisper', kindT: 'whisper',
    camA: libCam(-80, 1150, 950), camB: libCam(-260, 1080, 1300, 540),
    cast: lt => [M('alma', 30, 690, { hop: 6 * hop(T) }), K(31, -280, LB.table(1, -280).z, { mood: lt > 1.8 ? 'flub' : 'gasp', age: 9 }), K(30, -420, LB.table(2, -420).z, { mood: lt > 3 ? 'laugh' : 'smile', age: 9 })],
    twist: 'Shhh… six shy sheep shush sleepy shelves…', flub: 'Shix shy shleep… shhh-shhh… AH-CHOO!',
    gag: (t, lt, A) => { const a = A.s31; if (!a) return; flyingBooks(t, BT(2) + 3.0, a.top[0], a.top[1] + 40); slam('AH-CHOO!', a.top[0], a.top[1] - 100, 110, '#FF8A3D', t, BT(2) + 3.0, { life: 1.0 }); } });
  // 4 · library: the bat hangs upside down from the top of a bookcase; the books come down on him
  const b4 = battle({ t0: BT(3), set: LB, opt: {}, from: 's33', to: 'sami', gagAt: 2.9, accent: '#6E6A86', sideF: 1, sideT: -1, kind: 'whisper',
    camA: libCam(120, 1150, 950, 600), camB: libCam(-60, 1080, 1150, 620),
    cast: lt => [M('sami', -40, 690, { spin: Math.PI, hop: 8 * Math.sin(T * 3) }, 105), K(33, 260, LB.table(1, 260).z, { mood: lt < 1.7 ? 'talk' : lt > 3 ? 'laugh' : 'gasp', age: 9 }), K(32, 400, LB.table(2, 400).z, { mood: lt > 3 ? 'laugh' : 'smile' })],
    twist: 'Big black bats bring back blue books!', flub: 'Big back blats… blook blook… BONK!',
    gag: (t, lt, A) => { const a = A.sami; if (!a) return; const age = t - BT(3) - 2.9;
      if (age > 0 && age < 1.2) overlay(() => { for (let i = 0; i < 9; i++) { const y = -80 + Math.min(1, age * 2 + hash(i) * .3) * (a.feet[1] - a.h * .5 + 80 - (i % 3) * 40); X.save(); X.translate(a.feet[0] + (hash(i) - .5) * 160, y); X.rotate(hash(i + 2) - .5); shape(rectPts(-30, -36, 60, 72), { fill: TR_CRAYON[i % 6], stroke: PAL.ink, lwPx: 3 }); X.restore(); } });
      slam('BONK!', a.feet[0] + 120, a.feet[1] - a.h * .6, 120, '#FFD34E', t, BT(3) + 3.0, { life: 1.0 }); } });
  // 5 · math (the science room's whiteboard turned into a times table): the cat vs a student; the sixes explode
  const MATH = t => { X.font = `700 54px ${FONT_TALK}`; X.fillStyle = '#2F5FB0'; X.fillText('6 × 6 = 36', 40, 70); X.fillStyle = '#C0392B'; X.fillText('66 + 6 = ?', 380, 70); X.font = `600 36px ${FONT_TALK}`; X.fillStyle = '#2E7D32'; X.fillText('MATH: TONGUE-TWISTER DAY', 40, 130); };
  const b5 = battle({ t0: BT(4), set: SR, opt: { bubbling: 0, board: MATH }, from: 'sarah', to: 's25', gagAt: 2.9, accent: '#C8C24A',
    camA: sciCam(-100, 1110, 950), camB: sciCam(-300, 1030, 1350, 540),
    cast: lt => [M('sarah', 20, 640, { hop: 6 * hop(T), angry: lt > 2.6 ? 1 : 0, sq: lt > 2.6 ? .04 * Math.sin(T * 30) : 0 }), K(25, -300, SR.bench(1, -300).z, { mood: lt > 1.8 ? 'flub' : 'gasp', age: 9 }), K(24, -420, SR.bench(2, -420).z, { mood: lt > 3 ? 'laugh' : 'gasp' })],
    twist: 'Sixty-six sticky sixes stick to six sticks!', flub: 'Shixty-shix… shticky… 6! 6! 6! 6!',
    gag: (t, lt, A) => { const a = A.s25; if (!a) return; const age = t - BT(4) - 2.9; if (age < 0 || age > 1.6) return;
      overlay(() => { for (let i = 0; i < 16; i++) { const ang = i / 16 * TAU, r = 520 * age; X.save(); X.translate(a.top[0] + Math.cos(ang) * r, a.top[1] + 40 + Math.sin(ang) * r * .7); X.rotate(age * 6 + i); X.globalAlpha = 1 - seg(age, 1.1, 1.6);
        X.font = `${60 + 30 * hash(i)}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineWidth = 8; X.strokeStyle = PAL.ink; X.strokeText('6', 0, 0); X.fillStyle = TR_CRAYON[i % 6]; X.fillText('6', 0, 0); X.restore(); } }); } });
  // 6 · math: a student challenges the skull ghost, who says it perfectly (she's a programmer); the class is stunned
  const b6 = battle({ t0: BT(5), set: SR, opt: { bubbling: 0, board: MATH }, from: 's27', to: 'roudaynah', gagAt: 3.0, accent: '#8C8C98', sideF: 1, sideT: -1, cpsT: 40, noStars: true, laugh: false,
    camA: sciCam(140, 1110, 950), camB: sciCam(20, 1130, 1250, 520),
    cast: lt => [M('roudaynah', -10, 620, { hop: 4 * hop(T) }), K(27, 270, SR.bench(1, 270).z, { mood: lt < 1.7 ? 'talk' : 'gasp', age: lt - 3 }), K(26, 400, SR.bench(2, 400).z, { mood: 'gasp', age: lt - 3 })],
    twist: 'Proper programmers properly prove pi!', flub: 'Proper programmers properly prove pi. Semicolon.',
    gag: (t, lt, A) => { const a = A.roudaynah; if (!a || lt < 3) return; const k = backOut(clamp((lt - 3) / .3));
      overlay(() => { X.save(); X.translate(a.top[0] - 240, a.top[1] + 40); X.scale(k, k); circle(0, 0, 80, { fill: '#5BC27F', stroke: PAL.ink, lwPx: 6 }); line([[-36, 0], [-8, 30], [40, -28]], { stroke: '#FFFDF6', lwPx: 16 });
        X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#2E9D58'; X.fillText('100%', 0, 120); X.restore(); });
      sfx('…chirp', W - 300, 200, 40, '#CFE8C4', lt - 3.2, { life: .8 }); } });
  // 7 · gym: the blue bird vs a student with a basketball; it bounces off his head, into the hoop
  const gymCam = (x, z, f = 1000, hy = 570, y = 150) => ({ x, y, z, f, hy, dir: 1 });
  const GOPT = t => ({ lights: 1, score: { home: 0, guest: 0 } });
  function ball(x, y, r) { circle(x, y, r, { fill: '#E8742C', stroke: PAL.ink, lwPx: 3 }); line([[x - r, y], [x + r, y]], { stroke: PAL.ink, lwPx: 2 }); line([[x, y - r], [x, y + r]], { stroke: PAL.ink, lwPx: 2 }); }
  const b7 = battle({ t0: BT(6), set: GY, opt: GOPT(), from: 'housam', to: 's41', gagAt: 2.9, accent: '#5E8FD8', sideF: 1, sideT: -1,
    camA: gymCam(0, 1000, 1250, 570), camB: gymCam(-170, 1100, 1450, 560),
    cast: lt => [M('housam', 180, 1450, { hop: 20 * hop(T), flip: true }), K(41, -180, 1450, { mood: lt > 1.8 ? 'flub' : 'gasp', age: 9 }), K(40, -380, 1550, { mood: lt > 3 ? 'laugh' : 'smile' })],
    twist: 'Blue birds bounce big bouncy balls!', flub: 'Blue bounce… ball bird… BOING BOING!',
    gag: (t, lt, A) => { const a = A.s41; if (!a) return; const age = t - BT(6) - 2.7; if (age < 0 || age > 1.3) return;
      const x = a.top[0] + 700 * Math.max(0, age - .3), y = a.top[1] - 10 - 900 * age + 1100 * age * age; overlay(() => ball(x, y, 34));
      slam('BOING!', a.top[0], a.top[1] - 80, 100, '#FF8A3D', t, BT(6) + 3.0, { life: .9 }); sfx('SWISH!', W - 260, 260, 80, '#FFE45C', age - 1.0, { life: .9 }); } });
  // 8 · gym: a student vs the bee, who cartwheels out of it
  const b8 = battle({ t0: BT(7), set: GY, opt: GOPT(), from: 's43', to: 'jenna', gagAt: 2.6, accent: '#D9A520', sideF: -1, sideT: 1,
    camA: gymCam(0, 1000, 1250, 570), camB: gymCam(170, 1100, 1400, 560),
    cast: lt => [M('jenna', 200 + 160 * ease(seg(lt, 2.6, 3.6)), 1450, { spin: TAU * 2 * ease(seg(lt, 2.6, 3.6)), hop: 40 * Math.sin(Math.PI * clamp(seg(lt, 2.6, 3.6))) }), K(43, -200, 1450, { mood: lt < 1.7 ? 'talk' : lt > 3 ? 'cheer' : 'gasp', age: 9 }), K(42, -390, 1550, { mood: lt > 3 ? 'cheer' : 'smile' })],
    twist: 'Busy bees buzz by bright blue bleachers!', flub: 'Buzzy blee… bleachy… BZZZZZ!',
    gag: (t, lt) => { slam('CARTWHEEL!', W / 2 + 200, 240, 110, '#FFD34E', t, BT(7) + 2.8, { life: 1.2 }); } });
  // between the chorus and verse 2: TO THE GYM! everyone runs down the hall
  function toGym(t) {
    const lt = t - S_TOGYM; lockers(t, 1300, '#EFE2C4');
    for (let i = 0; i < 12; i++) { const x = W + 200 - ((lt * 900 + i * 230) % (W + 600)), kidRow = i % 3 === 0;
      if (kidRow) kid(50 + i, x, 900, 3.2, t, { mood: 'run', walk: lt * 8 + i }); else monster(GANG[i % 9], x, 920, 2.4 * (COST[GANG[i % 9]].h > 160 ? 160 / COST[GANG[i % 9]].h : 1), t, { walk: lt * 6 + i, flip: true }); }
    overlay(() => { X.save(); X.translate(W / 2, 140); X.rotate(-.03); shape(rectPts(-330, -60, 660, 120), { fill: '#2E7D9A', stroke: PAL.ink, lwPx: 7, smooth: .2 });
      X.font = `78px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF6'; X.fillText('GYM  →', 0, 6); X.restore(); });
  }

  // =====================================================================================================
  // ---------- the gym (scoreboard view): monsters on the right, students on the left, the bleachers packed ----------
  const MSPOT = { sami: [520, 1560], roudaynah: [420, 1700], dr_g: [330, 1500], sarah: [240, 1660], safadi: [150, 1440], jenna: [70, 1620], housam: [360, 1360], danny: [210, 1300], alma: [520, 1300] };
  const KSPOT = [[-160, 1400], [-280, 1300], [-330, 1520], [-450, 1380], [-200, 1620], [-520, 1560], [-420, 1720], [-120, 1260]];
  const BLEACH = []; for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) BLEACH.push({ seed: 60 + r * 9 + i, ...GY.bleacher(r, 960 + i * 130 + (r % 2) * 50) });
  function gymCrowd(t, o = {}) {
    const items = [];
    BLEACH.forEach((b, i) => items.push(K(b.seed, b.x, b.z, () => ({ mood: o.bleach ?? 'cheer', pose: { sit: 1, jump: (o.bleach ?? 'cheer') === 'cheer' ? .8 * hop(t, 1, i * .3) : 0 } }), b.y)));
    if (o.kids !== false) KSPOT.forEach(([x, z], i) => items.push(K(80 + i, x, z, () => (o.kid ? o.kid(i) : { mood: 'smile' }))));
    if (o.mons !== false) Object.entries(MSPOT).forEach(([n, [x, z]], i) => items.push(M(n, x, z, () => (o.mon ? o.mon(n, i) : { hop: 8 * hop(t, 1, i * .2) }))));
    return items;
  }
  function gymEnter(t) {
    const lt = t - S_GYM, P = persp(drift({ x: -60, y: 200, z: 640 + 70 * lt, f: 950, hy: 520 }, t));
    const items = gymCrowd(t, { kid: i => ({ mood: 'run', walk: lt * 4 + i, pose: {} }), mon: (n, i) => ({ walk: lt * 2 + i * .4, hop: 6 }) });
    staged(GY, P, t, { lights: 1, score: { home: 0, guest: 0 }, clock: Math.max(0, 600 - (t - S_GYM) * 20) }, items);
    slam('TONGUE-TWISTER', W / 2, 160, 110, '#FFD34E', t, S_GYM + .5, { life: 3.3 });
    slam('TOURNAMENT!', W / 2, 290, 130, '#E5466E', t, S_GYM + 1.0, { life: 2.8, rot: .03 });
  }
  function grins(t) {                                                           // punch-ins on wide monster grins, one per beat
    const lt = t - S_GRIN, i = Math.floor(lt / .55), who = ['danny', 'safadi', 'sami', 'sarah'][Math.min(3, i)], c = COST[who];
    X.fillStyle = c.col; X.fillRect(0, 0, W, H);
    for (let r = 0; r < 12; r++) { const a = r / 12 * TAU + t; shape([[W / 2, H / 2], [W / 2 + Math.cos(a) * 1500, H / 2 + Math.sin(a) * 1500], [W / 2 + Math.cos(a + .2) * 1500, H / 2 + Math.sin(a + .2) * 1500]], { fill: 'rgba(255,255,255,.14)', stroke: null }); }
    const z = 1 + .12 * (lt % .55); monster(who, W / 2, H * 1.05, 5.4 * z * (160 / c.h), t, { noShadow: true, rot: .04 * Math.sin(t * 8) });
    slam('GRRIN!', W / 2 + 520, 260, 110, '#FFFDF6', t, S_GRIN + Math.min(3, i) * .55, { life: .55 });
  }
  function radish(t) {                                                          // RULE NUMBER RADISH: broccoli-in-a-sock, clipboard high
    const lt = t - S_RADISH, P = persp(drift(gymCam(330, 1150, 1250, 560), t));
    const items = [M('dr_g', 330, 1500, { hop: 16 * hop(t), rot: .06 * Math.sin(t * 6) })];
    const A = staged(GY, P, t, { lights: 1, score: { home: 0, guest: 0 } }, items, 1.8);
    const a = A.dr_g; if (!a) return;
    overlay(() => { const k = backOut(clamp(lt / .3)); X.save(); X.translate(a.top[0] + 330, a.top[1] + 140); X.rotate(.12 * Math.sin(t * 5)); X.scale(1.6 * k, 1.6 * k);
      for (const g of [-.5, 0, .5]) shape([[0, -40], [Math.sin(g) * 30 - 14, -110], [Math.sin(g) * 30 + 14, -110]], { fill: '#4DA650', stroke: PAL.ink, lwPx: 4, smooth: .6 });
      shape([[0, -45], [55, -10], [45, 45], [0, 95], [-45, 45], [-55, -10]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 5, smooth: .7 });
      circle(-16, 10, 5, { fill: PAL.ink, stroke: null }); circle(16, 10, 5, { fill: PAL.ink, stroke: null }); line([[-14, 30], [0, 38], [14, 30]], { stroke: PAL.ink, lwPx: 4, smooth: true });
      shape([[-30, -50], [-30, -80], [-15, -62], [0, -86], [15, -62], [30, -80], [30, -50]], { fill: '#FFD34E', stroke: PAL.ink, lwPx: 4 }); X.restore(); });
    slam('RULE #RADISH!', W / 2 - 200, 200, 110, '#E5466E', t, S_RADISH + .1, { life: 2 });
  }
  function spinach(t) {                                                         // students try it five times… spinach everywhere
    const lt = t - S_SPINACH, P = persp(drift(gymCam(-300, 1000, 1150, 560), t));
    const items = KSPOT.slice(0, 5).map(([x, z], i) => K(80 + i, x, z, { mood: lt > 1 ? 'flub' : 'talk', pose: lt > 1.1 ? { blush: 0 } : {} }));
    const A = staged(GY, P, t, { lights: 1, score: { home: 0, guest: 0 } }, items, 1.4);
    Object.values(A).forEach((a, i) => { if (!a || lt < 1.1) return; overlay(() => { for (let j = 0; j < 5; j++) { const age = lt - 1.1 - j * .1; if (age < 0) continue;
      const x = a.mouth[0] + (j - 2) * 30 * age * 4, y = a.mouth[1] - 160 * age + 300 * age * age; shape([[x, y - 18], [x + 14, y], [x, y + 18], [x - 14, y]], { fill: '#2E7D32', stroke: PAL.ink, lwPx: 2, smooth: .6 }); } }); });
    ['1×', '2×', '3×', '4×', '5×'].forEach((s, i) => slam(s, 300 + i * 330, 200, 90, TR_CRAYON[i], t, S_SPINACH + i * .2, { life: 1.9 - i * .2 }));
  }
  function slipperyShoe(t) {                                                    // a student slips on a shoe and slides across the court
    const lt = t - S_SHOE, P = persp(drift(gymCam(0, 950, 1000, 560), t)), u = ease(seg(lt, .2, 1.6));
    const items = [K(85, lerp(-600, 520, u), 1400, { mood: 'flub', pose: { rot: -1.2 * seg(lt, .1, .4), jump: 2 } }), M('dr_g', 330, 1650, { hop: 8 * hop(t) }), M('alma', 520, 1300, { hop: 8 * hop(t) })];
    const A = staged(GY, P, t, { lights: 1, score: { home: 0, guest: 0 } }, items);
    const a = A.s85; if (a) { overlay(() => { const x = a.feet[0], y = a.feet[1]; shape([[x - 40, y - 4], [x + 50, y - 4], [x + 60, y + 12], [x - 40, y + 12]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 3, smooth: .4 }); });
      for (let i = 0; i < 4; i++) line([[a.feet[0] - 80 - i * 60, a.feet[1] - 10 - i * 10], [a.feet[0] - 200 - i * 60, a.feet[1] - 10 - i * 10]], { stroke: 'rgba(255,255,255,.8)', lwPx: 5 }); }
    const age = lt - .9; if (age > 0 && age < 1.2) overlay(() => { X.save(); X.translate(900 + 500 * age, 500 - 700 * age + 900 * age * age); X.rotate(age * 9); broccoliSock(70, 120, t); X.restore(); });
    slam('WHEEEE!', W / 2, 220, 120, '#7FD6F0', t, S_SHOE + .3, { life: 1.6 });
  }
  function dareGhost(t) {                                                       // "I challenge the ghost, now what will you do?"
    const lt = t - S_DARE, P = persp(drift(gymCam(100, 1000, 1100, 560), t));
    const items = [K(86, -150, 1400, { mood: 'talk', pose: { handR: [5.6, -19], handPoseR: 'point' } }), M('roudaynah', 300, 1500, { hop: 6 * hop(t), sq: .05 * Math.sin(t * 7) })];
    staged(GY, P, t, { lights: 1, score: { home: 0, guest: 0 } }, items, 1.2);
    vsBanner(t, S_DARE + .2, 'A STUDENT', 'THE SKULL GHOST', '#E5466E', '#8C8C98', 2.1);
  }

  // ---------- chorus 2: the word volleyball (a twister word flies across the court on every beat; the score ticks) ----------
  const VOLLEY = ['SOCKS!', 'SHOES!', 'RADISH!', 'SPINACH!', 'BROCCOLI!', 'TWIST!', 'FLIP!', 'GROOVE!'];
  function volley(t) {
    const lt = t - S_CH2, phase = Math.floor(lt / 4), n = Math.floor(lt / 2), home = Math.floor((n + 1) / 2), guest = Math.floor(n / 2);
    const cams = [gymCam(0, 760, 820, 540, 190), gymCam(260, 1000, 1150, 560), gymCam(-260, 1000, 1150, 560), gymCam(0, 900, 950, 560, 230)];
    const P = persp(drift(cams[phase % 4], t)), score = { home, guest };
    const items = gymCrowd(t, { kid: i => ({ mood: hop(t, 1, i * .2) > .6 ? 'talk' : 'cheer' }), mon: (n2, i) => ({ hop: 14 * hop(t, 1, i * .2), rot: .06 * Math.sin(t * 5 + i) }) });
    const A = staged(GY, P, t, { lights: 1, score, buzzer: kick(t, S_CH2 + 2 * n + .1, 6) }, items, 0);
    // the word-ball: a glowing comic word arcing across the half-court each beat, left ↔ right
    const bi = Math.floor((lt) / B), bu = frac(lt / B), dir = bi % 2 ? -1 : 1, x0 = P.p(dir > 0 ? -250 : 250, 120, 1450), x1 = P.p(dir > 0 ? 250 : -250, 120, 1450);
    const bx = lerp(x0[0], x1[0], bu), by = Math.max(110, lerp(x0[1], x1[1], bu) - 110 * Math.sin(Math.PI * bu) * x0[2]);
    overlay(() => { X.save(); X.translate(bx, by); X.rotate(bu * 2 * dir); circle(0, 0, 70, { fill: '#FFF4B8', stroke: PAL.ink, lwPx: 5 });
      X.font = `34px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = TR_CRAYON[bi % 6]; X.fillText(VOLLEY[bi % 8], 0, 2); X.restore(); });
  }
  function tired(t) {                                                           // everyone tongue-tied, panting: TIE!
    const lt = t - S_TIRED, P = persp(drift(gymCam(0, 820, 860, 540, 200), t, .3));
    const items = gymCrowd(t, { bleach: 'gasp', kid: i => ({ mood: 'flub' }), mon: (n, i) => ({ sq: .05 * Math.sin(t * 9 + i), rot: .08 * Math.sin(t * 3 + i) }) });
    const A = staged(GY, P, t, { lights: 1, score: { home: 4, guest: 4 } }, items);
    Object.entries(A).forEach(([id, a]) => { if (a && !id.startsWith('s6') && !id.startsWith('s7') && !id.startsWith('s8') && !id.startsWith('s9')) stars(a.top[0], a.top[1] + 10, (a.w || 80) * .4, t); });
    slam('TIE!', W / 2, 250, 200, '#FFE45C', t, S_TIRED + .3, { life: 2.6 });
  }

  // =====================================================================================================
  // ---------- bridge: the final test (spotlights), a dolphin in space, the news, the countdown, everyone together ----------
  function spotlights(t, xs) {
    overlay(() => { X.fillStyle = 'rgba(10,8,30,.55)'; X.fillRect(0, 0, W, H); X.globalCompositeOperation = 'lighter';
      for (const x of xs) { const g = X.createRadialGradient(x, H * .78, 10, x, H * .78, 330); g.addColorStop(0, 'rgba(255,240,190,.45)'); g.addColorStop(1, 'rgba(255,240,190,0)'); X.fillStyle = g;
        X.beginPath(); X.moveTo(x - 40, -10); X.lineTo(x + 40, -10); X.lineTo(x + 300, H); X.lineTo(x - 300, H); X.fill(); }
      X.globalCompositeOperation = 'source-over'; });
  }
  function faceOff(t) {
    const lt = t - S_BRIDGE, P = persp(drift(gymCam(0, 900 + 40 * lt, 950, 560), t));
    const items = [M('safadi', 230, 1450, { hop: 6 * hop(t, .5), rot: .03 * Math.sin(t * 2) }), K(7, -230, 1450, { mood: 'smile', pose: { brows: 'angry', eyes: 'open', mouth: 'flat', handL: [-3.6, -15], handR: [3.6, -15], handPoseL: 'fist', handPoseR: 'fist' } })];
    const A = staged(GY, P, t, { lights: .4, score: { home: 4, guest: 4 }, clock: 10 }, items);
    if (A.safadi && A.s7) spotlights(t, [A.s7.feet[0], A.safadi.feet[0]]);
    slam('THE FINAL', W / 2, 180, 110, '#FFFDF6', t, S_BRIDGE + .3, { life: 4 }); slam('TEST', W / 2, 310, 160, '#FFE45C', t, S_BRIDGE + 1.0, { life: 3.3 });
  }
  function stare(t) {                                                           // a western stand-off: split screen, owl eyes vs student eyes
    const lt = t - S_STARE, z = 1 + .06 * lt;
    X.fillStyle = '#140C12'; X.fillRect(0, 0, W, H);
    X.save(); X.beginPath(); X.rect(0, H * .28, W / 2 - 6, H * .44); X.clip();
    X.translate(W / 4, H / 2); X.scale(z, z); X.translate(-W / 4, -H / 2);
    monster('safadi', W / 4, H / 2 - 1100 * .33 + 1100, 1100 / COST.safadi.h, t, { noShadow: true }); X.restore();
    X.save(); X.beginPath(); X.rect(W / 2 + 6, H * .28, W / 2, H * .44); X.clip();
    X.translate(W * .75, H / 2); X.scale(z, z); X.translate(-W * .75, -H / 2);
    kid(7, W * .75, H / 2 + 1300 * .64, 1300 / 122, t, { pose: { brows: 'angry', eyes: 'open', mouth: 'flat', lookX: -.7 } }); X.restore();
    for (const y of [H * .28, H * .72]) line([[0, y], [W, y]], { stroke: '#FFE45C', lwPx: 6 });
    line([[W / 2, H * .28], [W / 2, H * .72]], { stroke: '#FFE45C', lwPx: 6 });
    sfx('ZZZT!', W / 2, H * .2, 70, '#FFE45C', lt - 2.2, { life: 1 });
  }
  function space(t) {                                                           // "A dolphin in space wearing bright red shoes"
    const lt = t - S_SPACE; X.fillStyle = '#070A1E'; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 140; i++) { const x = (hash(i) * W - lt * 60 * (1 + hash(i + 3))) % W; circle(x < 0 ? x + W : x, hash(i + 7) * H, 1 + 2 * hash(i + 2), { fill: '#FFFFFF', stroke: null, alpha: .5 + .5 * Math.sin(t * 3 + i) }); }
    circle(W * .82, H * 1.25, 640, { fill: '#2E6FD8', stroke: PAL.ink, lwPx: 6 }); shape([[W * .62, H * .78], [W * .78, H * .7], [W * .9, H * .8], [W * .74, H * .9]], { fill: '#4DA650', stroke: null, smooth: .8 });
    const x = lerp(-200, W * .55, ease(seg(lt, 0, 2.2))), y = H * .5 + 40 * Math.sin(t * 2);
    const A = neptune(x, y + 280, 17, { t, sit: 0, swim: 1, rot: -.15 + .1 * Math.sin(t * 2), eyes: 'happy', mouth: 'grin', brows: 'up', trident: false });
    const shoe = (sx, sy, r) => { X.save(); X.translate(sx, sy); X.rotate(r); shape([[-34, -10], [10, -16], [40, 0], [44, 14], [-34, 14]], { fill: '#E0262E', stroke: PAL.ink, lwPx: 4, smooth: .4 }); line([[-34, 12], [44, 12]], { stroke: '#FFFDF6', lwPx: 5 }); line([[-10, -10], [0, -2], [10, -12]], { stroke: '#FFFDF6', lwPx: 3 }); X.restore(); };
    if (A && A.flipper) shoe(A.flipper[0], A.flipper[1], .3); if (A && A.belly) shoe(A.belly[0] - 150, A.belly[1] + 30, -.2);
    slam('🚀 SPACE DOLPHIN 🚀', W / 2, 140, 76, '#FFE45C', t, S_SPACE + .4, { life: 3.6 });
    sfx('BRIGHT RED SHOES!', W * .3, H * .82, 60, '#FF6B6B', lt - 2.0, { life: 1.8 });
  }
  function news(t) {                                                            // "…making the news!"
    const lt = t - S_NEWS, P = persp(drift(gymCam(0, 760, 820, 540, 190), t));
    const items = gymCrowd(t, { mon: (n, i) => ({ hop: 14 * hop(t, 1, i * .2) }), kid: i => ({ mood: 'cheer' }) });
    staged(GY, P, t, { lights: 1, score: { home: 4, guest: 4 } }, items);
    overlay(() => {
      shape(rectPts(40, 40, 180, 64), { fill: '#D7262E', stroke: null, smooth: .2 }); X.font = `46px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFFFF'; X.fillText('● LIVE', 130, 74);
      const k = backOut(clamp(lt / .4)), y = H - 280 + 200 * (1 - k);
      shape(rectPts(0, y, W, 120), { fill: '#C8102E', stroke: null }); shape(rectPts(0, y + 120, W, 60), { fill: '#101828', stroke: null });
      X.textAlign = 'left'; X.font = `64px ${FONT_SFX}`; X.fillStyle = '#FFFFFF'; X.fillText('BREAKING: MONSTERS TWIST DOVE CREEK!', 40, y + 62);
      X.font = `600 34px ${FONT_TALK}`; X.fillStyle = '#FFE45C'; const tk = '   RULE NUMBER RADISH  ·  BROCCOLI SOCKS FOUND IN GYM  ·  SCIENCE ROOM 100% FOAM  ·  PRINCIPAL SAYS "SAY THAT FIVE TIMES FAST"  ·';
      X.fillText(tk + tk, 40 - (lt * 260) % X.measureText(tk).width, y + 152);
      const views = Math.round(21 + 9876543 * easeIn(seg(lt, .3, 3.6)));        // YouToon views, from 21 to… a lot
      shape(rectPts(W - 520, 40, 480, 90), { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 4, smooth: .3 }); circle(W - 470, 85, 26, { fill: '#7B4DD8', stroke: null });
      X.font = `700 44px ${FONT_TALK}`; X.fillStyle = '#0F0F0F'; X.textAlign = 'left'; X.fillText(views.toLocaleString('en-US') + ' views', W - 430, 88);
    });
  }
  function countdown(t) {                                                       // "One, two, three, let's go!"
    const lt = t - S_COUNT, P = persp(drift({ x: 0, y: 175, z: 1700, f: 1050, hy: 520, dir: -1 }, t));
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'ready'));
    const W0 = TR_LYRICS.find(r => r[0].startsWith('(One, two'))[1];
    ['1', '2', '3', "LET'S GO!"].forEach((s, i) => slam(s, W / 2, H * .42, i < 3 ? 300 : 200, TR_CRAYON[i * 2 % 6], t, i < 3 ? W0[i] : W0[3], { life: i < 3 ? (W0[i + 1] - W0[i]) : 2.5 }));
  }
  // the stage view: students up front, the monsters behind them, and Pearl, Neptune and Dragon on the stage at the back
  const DKIDS = []; for (let i = 0; i < 10; i++) DKIDS.push({ seed: 100 + i, x: -520 + i * 115 + 30 * (i % 2), z: 1000 + 50 * (i % 3) });
  const DMON = { dr_g: [-470, 820], roudaynah: [-350, 900], sarah: [-230, 830], jenna: [-115, 910], danny: [0, 840], safadi: [115, 900], alma: [230, 840], housam: [350, 910], sami: [470, 830] };
  const STAGEP = { pearl: [-230, 230], neptune: [0, 250], dragon: [240, 230] };
  function guests(t, o = {}) {
    const items = [];
    items.push({ id: 'pearl', z: STAGEP.pearl[1], draw: P => { const [sx, sy, k] = P.p(STAGEP.pearl[0], 100, STAGEP.pearl[1]); return pearl(sx, sy, PP_UNIT * k * .9, { t, sit: 1, eyes: 'bored', mouth: 'flat', headTilt: .1, ...(o.pearl || {}) }); } });
    items.push({ id: 'neptune', z: STAGEP.neptune[1], draw: P => { const [sx, sy, k] = P.p(STAGEP.neptune[0], 100, STAGEP.neptune[1]); return neptune(sx, sy, NT_UNIT * k * .9, { t, sit: 1, trident: true, eyes: 'smug', mouth: 'smile', ...(o.neptune || {}) }); } });
    items.push({ id: 'dragon', z: STAGEP.dragon[1], draw: P => { const [sx, sy, k] = P.p(STAGEP.dragon[0], 100, STAGEP.dragon[1]); return dragon(sx, sy, DRAGON_UNIT * k, { t, wings: .5, ...(o.dragon || {}) }); } });
    return items;
  }
  function danceItems(t, mode, o = {}) {
    const items = [];
    DKIDS.forEach((d, i) => items.push(K(d.seed, d.x, d.z, () => (mode === 'flop' ? { mood: 'flat', rot: (i % 2 ? 1.4 : -1.4) * ease(seg(t, S_FLOP + hash(i) * .3, S_FLOP + .4 + hash(i) * .3)) } : mode === 'laugh' ? { mood: 'laugh' } : mode === 'ready' ? { mood: 'smile', pose: { jump: .4 * hop(t, 1, i * .2) } } : { mood: 'cheer' }))));
    Object.entries(DMON).forEach(([n, [x, z]], i) => items.push({ id: n, z, draw: P => {
      const [sx, sy, k] = P.p(x, 0, z), off = o.off ? o.off(n, i) : 0;
      let A = null; if (off > 0) A = person(n, sx, sy, k, t, i);                  // whoever is inside, laughing
      const m = monster(n, sx, sy, k, t, { off, hop: mode === 'flop' ? 0 : (mode === 'together' ? 26 : 16) * hop(t, mode === 'together' ? 1 + seg(t, S_TOGETHER, S_FLOP) : 1, i * .25), rot: mode === 'flop' ? (i % 2 ? 1 : -1) * 1.5 * ease(seg(t, S_FLOP + hash(i + 3) * .3, S_FLOP + .4 + hash(i + 3) * .3)) : .07 * Math.sin(t * 6 + i), sq: mode === 'together' ? .05 * Math.sin(t * 16 + i) : 0 });
      return A ? { ...A, top: A.top || m.top, w: m.w, h: m.h, feet: m.feet } : m; } }));
    return items.concat(guests(t, o.guests ? o.guests(t) : {}));
  }
  function together(t) {                                                        // faster and faster, the camera spins, then everyone flops
    const lt = t - S_TOGETHER, sp = seg(t, S_TOGETHER, S_FLOP), flop = t > S_FLOP, P = persp(drift({ x: 0, y: 175, z: 1700 - 150 * sp, f: 1050 + 150 * sp, hy: 520, dir: -1 }, t));
    camBegin(W / 2, H / 2, 1 + .06 * sp, flop ? 0 : .05 * sp * Math.sin(t * (4 + 10 * sp)));
    const A = staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, flop ? 'flop' : 'together'));
    camEnd();
    if (!flop) for (let i = 0; i < 6; i++) sfx(['TWIST!', 'FLIP!', 'SAY IT!', 'AGAIN!', 'FASTER!', 'BLBLBL!'][i], 200 + i * 300, 220 + 60 * (i % 2), 60 + 20 * sp, TR_CRAYON[i], (lt * (1 + 2 * sp)) % 1.5 - i * .2, { life: .7 });
    if (flop) { Object.entries(A).forEach(([id, a]) => { if (a && DMON[id]) stars(a.feet[0], a.feet[1] - (a.h || 150) * .3, (a.w || 100) * .4, t); }); slam('TONGUE-TIED!', W / 2, 220, 150, '#FFE45C', t, S_FLOP + .2, { life: 1.2 }); }
  }

  // ---------- final chorus: the dance party ----------
  function dance(t) {
    const lt = t - S_DANCE, ph = Math.floor(lt / 4) % 4;
    const cams = [{ x: 0, y: 175, z: 1700, f: 1050, hy: 520, dir: -1 }, { x: -200, y: 130, z: 1250, f: 1050, hy: 560, dir: -1 }, { x: 0, y: 280, z: 1800, f: 950, hy: 420, dir: -1 }, { x: 200, y: 130, z: 1250, f: 1050, hy: 560, dir: -1 }];
    const P = persp(drift(cams[ph], t)), k = kick(t, S_DANCE + 4 * Math.floor(lt / 4) + .05, 5);
    camBegin(W / 2, H / 2, 1 + .04 * k + .015 * hop(t), 0);
    const close = ph % 2 === 1;                                                // the close-ups leave the front row of students out
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'dance', { guests: tt => ({ pearl: { eyes: 'bored', mouth: 'flat', headTilt: .1 + .05 * hop(tt) }, neptune: { eyes: 'happy', mouth: 'grin', headTilt: .1 * hop(tt), flex: hop(tt) }, dragon: { jump: 1.5 * hop(tt), wings: 1, flap: Math.sin(tt * 12), eyes: 'happy', mouth: 'grin' } }) }).filter(it => !close || !/^s\d/.test(it.id)));
    camEnd();
    confetti(t, S_DANCE, 70, 22);
    overlay(() => { X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = W * (.2 + .2 * i) + 200 * Math.sin(t * 1.3 + i * 2); const g = X.createRadialGradient(x, H * .7, 10, x, H * .7, 260);
      g.addColorStop(0, rgba(TR_CRAYON[i], .25)); g.addColorStop(1, rgba(TR_CRAYON[i], 0)); X.fillStyle = g; X.fillRect(0, 0, W, H); } X.globalCompositeOperation = 'source-over'; });
  }

  // ---------- outro: the heads come off, then the guests are asked to take theirs off ----------
  const REVEAL_ORDER = ['safadi', 'sami', 'danny', 'alma', 'housam', 'jenna', 'sarah', 'roudaynah', 'dr_g'];
  const offAt = n => S_REVEAL + .45 * REVEAL_ORDER.indexOf(n);
  function reveal(t) {
    const lt = t - S_REVEAL, P = persp(drift({ x: 0, y: 160, z: 1650, f: 1150, hy: 540, dir: -1 }, t, .5));
    const A = staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, lt > 3.5 ? 'laugh' : 'ready', { off: n => seg(t, offAt(n), offAt(n) + .7) }));
    REVEAL_ORDER.forEach((n, i) => { const a = A[n]; if (a) { sfx('POP!', a.top[0], a.top[1] - 30, 54, TR_CRAYON[i % 6], t - offAt(n), { life: .6 }); if (t > offAt(n) + .6) sfx(['HA HA!', 'HO HO!', 'HEE!'][i % 3], a.top[0] + 40, a.top[1] - 40, 40, '#FFE45C', (t - offAt(n) - .6) % 1.4, { life: 1 }); } });
    if (lt > 3.6) Object.entries(A).forEach(([id, a], i) => { if (a && id.startsWith('s')) sfx(i % 2 ? 'HA HA!' : 'LOL!', a.top[0], a.top[1] - 30, 38, TR_CRAYON[i % 6], (lt - 3.6 - i * .07) % 1.6, { life: 1 }); });
    if (lt < 1) slam('THE HEADS COME OFF!', W / 2, 160, 100, '#FFE45C', t, S_REVEAL + .1, { life: 1.6 });
  }
  function backOfHall(t) {                                                      // whip-pan to the stage: "Your turn! Take off your costumes!"
    const lt = t - S_BACK, u = ease(seg(lt, 0, .45)), a = { x: 0, y: 160, z: 1650, f: 1150, hy: 540, dir: -1 }, b = { x: 0, y: 165, z: 950, f: 1150, hy: 470, dir: -1 };
    const P = persp(drift(lerpCam(a, b, u), t, .4));
    X.save(); const A = staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'laugh', { off: () => 1, guests: () => ({ pearl: { eyes: 'bored', mouth: 'flat' }, neptune: { eyes: 'wide', mouth: 'o' }, dragon: { eyes: 'wide', mouth: 'o', question: on(t, S_BACK + 1.2, S_FACES) } }) })); X.restore();
    if (u < 1) overlay(() => { X.fillStyle = `rgba(255,255,255,${.35 * (1 - u)})`; X.fillRect(0, 0, W, H); for (let i = 0; i < 20; i++) line([[0, 50 + i * 55], [W, 50 + i * 55]], { stroke: `rgba(255,255,255,${.25 * (1 - u)})`, lwPx: 8 }); });
    const kidA = A.s104 || A.s105, from = kidA && kidA.mouth[1] < H - 40 ? kidA.mouth : [W * .42, H + 60];   // the student may be out of shot
    callout('Now YOU! Take off your costumes!', from[0], from[1], lt - .5, { size: 54, maxW: 760, cps: 22, hold: 1.4, accent: '#E5466E', dx: 60, dy: -420 });
  }
  function faces(t) {                                                           // "These ARE our faces!" … and Pearl laughs. Everyone does.
    const lt = t - S_FACES, laughing = lt > 1.4, P = persp(drift({ x: 0, y: 170, z: 760, f: 1050, hy: 440, dir: -1 }, t, .4));
    const k = kick(t, S_FACES + 1.4, 3);
    camBegin(W / 2 + 14 * k * Math.sin(t * 61), H / 2 + 10 * k * Math.cos(t * 53), 1 + .03 * k);
    const A = staged(GY, P, t, { lights: 1, curtain: 1 }, guests(t, {
      pearl: laughing ? { eyes: 'happy', mouth: 'open', headTilt: .35 + .1 * Math.sin(t * 12), sq: .04 * Math.sin(t * 24), blush: 1 } : { eyes: 'open', mouth: lipFlap(t, true, 'smirk'), brows: 'up', headTilt: .2 },
      neptune: laughing ? { eyes: 'happy', mouth: 'laugh', headTilt: .3 + .1 * Math.sin(t * 11), trident: true } : { eyes: 'smug', mouth: 'smile', trident: true },
      dragon: laughing ? { eyes: 'happy', mouth: 'grin', jump: 1.5 * Math.abs(Math.sin(t * 9)), wings: 1, flap: Math.sin(t * 14) } : { eyes: 'wink', mouth: 'smile' },
    }));
    camEnd();
    if (A.pearl) callout('These ARE our faces!', A.pearl.mouth[0], A.pearl.mouth[1], lt + .1, { size: 56, maxW: 700, cps: 20, hold: .6, accent: '#E5466E', dx: 260, dy: -260 });
    if (laughing && A.pearl) { sfx('HA HA HA!', A.pearl.mouth[0] - 120, A.pearl.mouth[1] - 160, 90, '#FFB3D1', (lt - 1.4) % 1.2, { life: 1.1 }); slam('PEARL LAUGHED!', W / 2, H - 230, 110, '#FFE45C', t, S_FACES + 1.7, { life: 3.5, rot: .03 }); }
    if (laughing && A.neptune) sfx('HO HO HO!', A.neptune.head[0] + 100, A.neptune.head[1] - 120, 70, '#9FE3F5', (lt - 1.6) % 1.2, { life: 1.1 });
    if (laughing && A.dragon) sfx('HEE HEE!', A.dragon.top[0] + 60, A.dragon.top[1] - 60, 64, '#AEF0CC', (lt - 1.8) % 1.2, { life: 1.1 });
    confetti(t, S_FACES + 1.4, 50, 5);
  }
  function theEnd(t) {                                                          // the whole room laughing, THE END, iris
    const lt = t - S_END, P = persp(drift({ x: 0, y: 175, z: 1700, f: 1050, hy: 520, dir: -1 }, t, .3));
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'laugh', { off: () => 1, guests: tt => ({ pearl: { eyes: 'happy', mouth: 'open', headTilt: .3 + .1 * Math.sin(tt * 12) }, neptune: { eyes: 'happy', mouth: 'laugh', headTilt: .3 }, dragon: { eyes: 'happy', mouth: 'grin', jump: 1.2 * Math.abs(Math.sin(tt * 9)), wings: 1 } }) }));
    confetti(t, S_END - 2, 60, 9);
    overlay(() => { const c = backOut(seg(t, S_END + .2, S_END + .6)); if (c <= 0) return; X.save(); X.translate(W / 2, 170); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-360, -100, 720, 200), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .12 });
      X.font = `120px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 16; X.strokeStyle = PAL.ink; X.strokeText('THE END', 0, 10); X.fillStyle = '#E5466E'; X.fillText('THE END', 0, 10); X.restore(); });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 1.8, END - .3))));
  }

  // every shot ends with the karaoke strip on top
  const withKaraoke = fn => (t, lt, dur) => { fn(t, lt, dur); trKaraoke(t); };
  scene({ duration: END, fps: 24, bpm: 120,
    shots: [
      [0, titleShot], [S_STREET, streetMarch], [S_HERO, heroWalk],
      [S_DOORS, doorsMarch], [S_BURST, doorsBurst], [S_PUMPKIN, crewCard('danny', S_PUMPKIN)], [S_OWL, crewCard('safadi', S_OWL)],
      [S_GHOST, crewCard('alma', S_GHOST)], [S_BIRD, crewCard('housam', S_BIRD)], [S_HALL, hallway], [S_CLASS, classEnter], [S_VS, vsShot],
      [BT(0), b1], [BT(1), b2], [BT(2), b3], [BT(3), b4], [BT(4), b5], [BT(5), b6], [BT(6), b7], [BT(7), b8], [S_TOGYM, toGym],
      [S_GYM, gymEnter], [S_GRIN, grins], [S_RADISH, radish], [S_SPINACH, spinach], [S_SHOE, slipperyShoe], [S_DARE, dareGhost],
      [S_CH2, volley], [S_TIRED, tired], [S_BRIDGE, faceOff], [S_STARE, stare], [S_SPACE, space], [S_NEWS, news], [S_COUNT, countdown],
      [S_TOGETHER, together], [S_DANCE, dance], [S_REVEAL, reveal], [S_BACK, backOfHall], [S_FACES, faces], [S_END, theEnd],
    ].map(([t0, fn]) => [t0, withKaraoke(fn)]) });
})();
