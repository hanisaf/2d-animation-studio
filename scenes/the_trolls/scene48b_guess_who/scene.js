// Scene 48b: "The Trolls · Guess Who", a second take on the finale of The Trolls series, cut to "Twist It, Troll It" (audio.mp3,
// 120 bpm: beats at 0.1 + 0.5 n s). The family wears Alma's monster drawings over their own bodies, so only their legs and shoes
// show, and the song asks the audience to guess who is inside. No name is ever written on screen: the riddles are told in
// pictures (clue cards), and the answer is the reveal. Between the riddles the monsters tongue-twist every class and the gym.
// Every section start is a constant below, taken from the karaoke times in lyrics.js. Every shot is a pure function of t.
(() => {
  const ME = ASSETS.scene.scene48b_guess_who, B = .5;
  const DC = LOCATIONS.dces, SR = LOCATIONS.science_room, LB = LOCATIONS.school_library, GY = LOCATIONS.school_gym;
  const img = f => { const i = new Image(); i.src = `${ME.dir}/${f}`; return i; };
  const ready = i => i && i.complete && i.naturalWidth > 0;
  const row = i => GW_LYRICS[i][1];                                            // a lyric line's word times

  // ---------- sections (seconds into the song) ----------
  const S_MARCH = 8.2, S_LEGS = 12.0, S_BAT = 16.0, S_TWINS = 24.0, S_SHOES = 27.8, S_PUMPKIN = 31.9, S_CUBES = 39.9, S_FIVE = 43.95;
  const S_CH1 = 48.1, S_GHOST = 79.5, S_AUNTIE = 87.88, S_CAT = 95.9, S_HAIR = 103.89, S_LINEUP = 108.0;
  const S_VOLLEY = 112.1, S_TIE = 120.1, S_GUESS = 124.1, S_DANCE = 127.3, S_REVEAL = 159.7, S_FAMILY = 163.85, S_BACK = 170.0, S_REAL = 174.1, S_END = 178.6, END = 182.4;
  const BT = i => S_CH1 + 3.925 * i;                                            // the eight chorus-1 battles

  // ---------- helpers ----------
  const inW = (t, a, b) => t >= a && t < b;
  const on = (t, a, b, r = .25) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const hop = (t, f = 1, ph = 0) => Math.abs(Math.sin(((t - .1) * 2 * f + ph) * Math.PI));   // a bounce on every beat
  const lerpCam = (a, b, u) => ({ ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u) });
  const drift = (c, t, a = 1) => ({ ...c, x: c.x + 10 * a * Math.sin(t * .37), hy: c.hy + 5 * a * Math.sin(t * .29) });
  function slam(txt, x, y, size, col, t, t0, o = {}) {                         // a big crayon word that slams in
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
      if (y > H + 30) continue; X.save(); X.translate(x, y); X.rotate(a * 5 + i); shape(rectPts(-9, -5, 18, 10), { fill: GW_CRAYON[i % 6], stroke: null }); X.restore(); } });
  }
  function stars(cx, cy, r, t, k = 1) {
    if (k <= .01) return; overlay(() => { for (let i = 0; i < 4; i++) { const a = t * 5 + i * TAU / 4;
      shape(starPts(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .3, r * .22 * k, .45, 5, t * 3 + i), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 3 }); } });
  }
  function bubble(text, a, age, o = {}) {
    if (!a) return; callout(text, a[0] + (o.side ?? 1) * 30, a[1], age, { size: o.size ?? 46, maxW: o.maxW ?? 620, cps: o.cps ?? 24, hold: o.hold ?? .8, kind: o.kind, accent: o.accent ?? '#E5466E', dx: (o.side ?? 1) * (o.dx ?? 230), dy: o.dy ?? -200 });
  }

  // ---------- the costumes, worn over the people (only the legs show) ----------
  // The twins swap monsters from scene 48: the bat loves to explain (the riddle says so), the owl has the big blue wings.
  const SPR = Object.fromEntries(['owl', 'bat', 'pumpkin', 'pink_ghost', 'bird', 'bee', 'cat', 'white_ghost'].map(n => [n, img(`costumes/${n}.png`)]));
  const COST = { safadi: 'bat', sami: 'owl', danny: 'pumpkin', alma: 'pink_ghost', housam: 'bird', jenna: 'bee', sarah: 'cat', roudaynah: 'white_ghost', dr_g: 'broccoli' };
  const COL = { safadi: '#6E6A86', sami: '#5B6FD8', danny: '#C0653A', alma: '#E58AB8', housam: '#5E8FD8', jenna: '#D9A520', sarah: '#C8C24A', roudaynah: '#8C8C98', dr_g: '#4DA650' };
  const RIG = { safadi, sami, housam, alma, danny, jenna, sarah, roudaynah, dr_g };
  const UNIT = { safadi: SAFADI_UNIT, sami: SAMI_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT, sarah: SARAH_UNIT, roudaynah: ROUDAYNAH_UNIT, dr_g: DR_G_UNIT };
  const TALL = { safadi: 180, sami: 180, housam: 168, alma: 125, danny: 122, jenna: 135, sarah: 170, roudaynah: 172, dr_g: 172 };   // world units
  const LEG = { safadi: .44, sami: .44, housam: .42, alma: .34, danny: .36, jenna: .38, sarah: .43, roudaynah: .44, dr_g: .42 };     // what shows below the costume
  const FOOT = { safadi: [1.25, -.8, 1.1], sami: [1.25, -.8, 1.1], housam: [1.5, -1.05, 1.3], danny: [1.5, -1.05, 1.3], alma: [.9, -.55, .8], jenna: [1.25, -.65, 1.1], sarah: [1.65, -1.05, 1.3], roudaynah: [1.7, -1, 1.4], dr_g: [1.6, -.9, 1.2] };
  const BELLY = { safadi: [2.4, -10.8], sami: [2.5, -10.4], housam: [2.0, -13.5], alma: [1.6, -7.4], danny: [2.2, -11.4], jenna: [2.2, -11.3], sarah: [2.4, -17], roudaynah: [2.6, -18.5], dr_g: [2.4, -17] };
  const REST = { safadi: [4.6, -11.5], sami: [4.4, -8.1], housam: [3.6, -10.6], alma: [2.2, -6.0], danny: [2.6, -10.2], jenna: [2.6, -10.2], sarah: [2.9, -14.9], roudaynah: [4.3, -14.5], dr_g: [4.4, -13.6] };
  const BIG = { sarah: 1.35, safadi: 1.08 };                                   // drawings with gaps over the head get a little bigger
  const GANG = ['dr_g', 'roudaynah', 'sarah', 'jenna', 'danny', 'safadi', 'alma', 'housam', 'sami'];
  const aspect = n => COST[n] === 'broccoli' ? .66 : (ready(SPR[COST[n]]) ? SPR[COST[n]].naturalWidth / SPR[COST[n]].naturalHeight : 1);
  function gait(p, k, fx, fy, lift) {
    const sn = Math.sin(p * Math.PI);
    return { footL: [-fx + .12 * k * sn, fy - lift * k * Math.max(0, sn)], footR: [fx + .12 * k * sn, fy - lift * k * Math.max(0, -sn)], dy: -.25 * k * Math.abs(sn) + .1 * k };
  }
  function broccoliSock(w, h, t) {                                              // Dr. G got whatever was left
    const sw = w * .55, top = -h * .5;
    shape([[-sw / 2, top], [sw / 2, top], [sw / 2 + 4, -h * .1], [sw / 2 + w * .12, -h * .02], [sw / 2 + w * .1, 0], [-sw / 2, 0]], { fill: '#FFFDF6', stroke: '#3B3B3B', lwPx: 3, smooth: .35 });
    for (let i = 0; i < 4; i++) { const y = top + 10 + i * h * .1; line([[-sw / 2 + 2, y], [sw / 2 - 2, y + 2]], { stroke: i % 2 ? '#4166B8' : '#D7262E', lwPx: Math.max(3, w * .05) }); }
    line([[-sw * .2, top + 4], [-sw * .2, -h * .62]], { stroke: '#5A8F3A', lwPx: w * .12 }); line([[sw * .15, top + 4], [sw * .2, -h * .64]], { stroke: '#5A8F3A', lwPx: w * .1 });
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI, r = w * .17 + w * .03 * Math.sin(i * 3.1 + t * 4);
      circle(Math.cos(a + Math.PI) * w * .32, -h * .74 - Math.sin(a) * h * .16, r, { fill: i % 2 ? '#3E8E41' : '#5DB760', stroke: '#2D5A2E', lwPx: 3 }); }
    circle(0, -h * .8, w * .22, { fill: '#5DB760', stroke: '#2D5A2E', lwPx: 3 });
    circle(-w * .09, -h * .78, w * .045, { fill: '#2B2430', stroke: null }); circle(w * .09, -h * .78, w * .045, { fill: '#2B2430', stroke: null });
    line([[-w * .08, -h * .71], [0, -h * .68], [w * .08, -h * .71]], { stroke: '#2B2430', lwPx: 3, smooth: true });
  }
  // someone in costume, feet at screen (x, y), k px per world unit. o: walk (phase in steps), hop (world units), rot, sq, flip,
  // spin (radians: the whole person and costume, about the middle), angry (red lightning), off (0..1: the costume flies off and
  // they are laughing underneath), laugh/armsUp (pose when revealed). Returns { top, mouth, feet, h, w }.
  function wearer(name, x, y, k, t, o = {}) {
    const s = UNIT[name] * k, tall = TALL[name] * k, off = o.off || 0;
    const g = o.walk != null ? gait(o.walk, 1, ...FOOT[name]) : {}, jump = (o.hop || 0) / UNIT[name];
    const r = REST[name], b = BELLY[name], ph = GANG.indexOf(name) * 1.3, hb = Math.abs(Math.sin(t * 11 + ph));
    const inside = { t, ...g, jump, handL: [-r[0] * .8, r[1]], handR: [r[0] * .8, r[1]], handPoseL: 'fist', handPoseR: 'fist', noShadow: false };
    const laughing = { t, eyes: 'happy', mouth: 'open', brows: 'up', dy: -.35 * hb, tilt: .08 * Math.sin(t * 6 + ph), jump, handPoseL: 'open', handPoseR: 'open', handL: [-b[0], b[1]], handR: [b[0], b[1]], ...(name === 'dr_g' ? { hearts: .4 } : {}), ...(o.pose || {}) };
    X.save();
    if (o.spin) { const cy = y - tall / 2 - jump * s; X.translate(x, cy); X.rotate(o.spin); X.translate(-x, -cy); }
    const A = RIG[name](x, y, s, off > 0 ? laughing : inside);
    // the costume: from the hips to just above the head, swaying with the walk
    // the drawing is big: from low on the legs to well above the head, and at least .8 of their height wide; whatever peeks out is a clue
    const hip = y - LEG[name] * .72 * tall - jump * s + (g.dy || 0) * s, ww = Math.max((hip - (y - tall * 1.12 - jump * s)) * aspect(name), tall * .8) * (BIG[name] || 1), hh = ww / aspect(name), top = hip - hh;
    let rot = o.rot || 0; if (o.walk != null) rot += .06 * Math.sin(o.walk * Math.PI);
    if (off < 1) {
      X.save(); X.translate(x, hip - off * hh * 1.9); X.rotate(rot + off * 3.2); X.scale((o.flip ? -1 : 1) * (1 + (o.sq || 0)), 1 - (o.sq || 0)); X.globalAlpha = 1 - seg(off, .55, 1);
      if (COST[name] === 'broccoli') broccoliSock(ww, hh, t); else if (ready(SPR[COST[name]])) X.drawImage(SPR[COST[name]], -ww / 2, -hh, ww, hh);
      X.restore();
    }
    X.restore();
    if (o.angry && off < .5) { const a0 = o.angry; overlay(() => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .45, L = hh * .3 * a0, cx = x, cy = hip - hh * .55;
      line([[cx + Math.cos(a) * hh * .5, cy + Math.sin(a) * hh * .5], [cx + Math.cos(a) * (hh * .5 + L * .5) + 8, cy + Math.sin(a) * (hh * .5 + L * .5)], [cx + Math.cos(a) * (hh * .5 + L), cy + Math.sin(a) * (hh * .5 + L)]], { stroke: '#E03C3C', lwPx: 5 }); } }); }
    const head = off > .6 && A && A.top ? A.top : [x, top];
    return { top: head, mouth: off > .6 && A && A.mouth ? A.mouth : [x, top + hh * .4], feet: [x, y], hip: [x, hip], h: tall, w: Math.max(ww, tall * .4), A };
  }

  // ---------- students ----------
  const LOOK = {}; const look = seed => LOOK[seed] ??= studentLook(seed);
  function kid(seed, x, y, k, t, o = {}) {
    const L = look(seed), ph = seed * .7;
    let p = { look: L, seed, t, eyes: 'open', mouth: 'smile', brows: 'normal', lookX: o.lookX ?? 0 };
    if (o.mood === 'gasp') p = { ...p, eyes: 'wide', mouth: 'O', brows: 'up', handL: [-1.4, -17], handR: [1.4, -17], jump: .4 * Math.exp(-(o.age ?? 9) * 5) };
    if (o.mood === 'think') p = { ...p, eyes: 'open', mouth: 'flat', brows: 'up', handR: [1.0, -16.5], handPoseR: 'fist', lookY: -.6, emote: '?', emoteK: 1, tilt: .08 * Math.sin(t * 2 + ph) };
    if (o.mood === 'laugh') { const b = Math.abs(Math.sin(t * 11 + ph)); p = { ...p, eyes: 'happy', mouth: 'open', brows: 'up', handL: [-2.2, -11.4], handR: [2.2, -11.4], dy: -.4 * b, tilt: .08 * Math.sin(t * 6 + ph) }; }
    if (o.mood === 'cheer') p = { ...p, eyes: 'happy', mouth: 'O', brows: 'up', handL: [-4.6, -20], handR: [4.6, -20], handPoseL: 'fist', handPoseR: 'fist', jump: 1.6 * hop(t, 1, ph * .1) };
    if (o.mood === 'flub') p = { ...p, eyes: Math.sin(t * 9) > 0 ? 'squeeze' : 'wide', mouth: 'O', brows: 'worried', tilt: .1 * Math.sin(t * 15), handL: [-4.6, -16], handR: [4.6, -16] };
    if (o.mood === 'talk') p = { ...p, mouth: lipFlap(t, true, 'smile'), brows: 'up', handR: [4.4, -19.5], handPoseR: 'point' };
    const A = student(x, y, STUDENT_UNIT * k * L.h, { ...p, ...o.pose }); A.feet = [x, y]; return A;
  }

  // ---------- staging in a 3D set: items far to near, the set's front pieces interleaved ----------
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
  const M = (name, x, z, o = {}, y = 0) => ({ id: name, z, draw: P => { const [sx, sy, k] = P.p(x, y, z); return wearer(name, sx, sy, k, T, typeof o === 'function' ? o() : o); } });
  const K = (seed, x, z, o = {}, y = 0) => ({ id: 's' + seed, z, draw: P => { const [sx, sy, k] = P.p(x, y, z); return kid(seed, sx, sy, k, T, typeof o === 'function' ? o() : o); } });

  // =====================================================================================================
  // ---------- the game-show stage (2D) for the riddles ----------
  function showStage(t, o = {}) {
    if (o.digital) {                                                            // "floating around in a digital space"
      X.fillStyle = '#071512'; X.fillRect(0, 0, W, H);
      X.font = `600 30px ${FONT_TALK}`; X.textAlign = 'center';
      for (let c = 0; c < 40; c++) for (let r = 0; r < 14; r++) { const y = (r * 80 + t * (120 + 60 * hash(c)) + hash(c + 9) * 900) % (H + 80) - 40;
        X.fillStyle = `rgba(90,255,150,${(.15 + .5 * hash(c * 14 + r)).toFixed(2)})`; X.fillText(hash(c * 31 + r + Math.floor(t * 4)) > .5 ? '1' : '0', c * 50 + 20, y); }
    } else {
      const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2A1650'); g.addColorStop(1, '#5B2C8F'); X.fillStyle = g; X.fillRect(0, 0, W, H);
      for (const sd of [-1, 1]) for (let i = 0; i < 7; i++) { const x0 = sd < 0 ? i * 34 : W - i * 34; shape([[x0, 0], [x0 + sd * 34, 0], [x0 + sd * (30 + 8 * Math.sin(t + i)), H], [x0 - sd * 4, H]], { fill: i % 2 ? '#B3203A' : '#D7263E', stroke: null }); }
      for (let i = 0; i < 26; i++) { const x = 300 + i * 51, on2 = (i + Math.floor(t * 6)) % 3 === 0; circle(x, 70, 11, { fill: on2 ? '#FFE45C' : '#8C6A20', stroke: PAL.ink, lwPx: 2 }); }
    }
    X.fillStyle = o.digital ? '#0C2A22' : '#3A1E5C'; X.fillRect(0, H * .8, W, H * .2);
    ellipse(W / 2 + (o.cx || 0), H * .86, 520, 70, { fill: o.digital ? 'rgba(90,255,150,.25)' : 'rgba(255,240,190,.35)', stroke: null });
    overlay(() => { X.globalCompositeOperation = 'lighter'; const cx = W / 2 + (o.cx || 0);
      const gg = X.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, 'rgba(255,240,190,.0)'); gg.addColorStop(1, 'rgba(255,240,190,.22)'); X.fillStyle = gg;
      X.beginPath(); X.moveTo(cx - 60, -10); X.lineTo(cx + 60, -10); X.lineTo(cx + 520, H * .86); X.lineTo(cx - 520, H * .86); X.fill(); X.globalCompositeOperation = 'source-over'; });
    if (!o.digital && !o.noTitle) slam('GUESS WHO?', W / 2, 150, 92, '#FFE45C', t, o.t0 ?? 0, { rot: -.02 });
  }
  // a clue card: a hand-drawn picture of the clue and (at most) a couple of words, never a name
  const ICON = {
    fang(t) { shape([[-60, -10], [60, -10], [40, 30], [-40, 30]], { fill: '#2B2430', stroke: PAL.ink, lwPx: 4, smooth: .5 }); shape([[-10, -10], [10, -10], [0, 40]], { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 3 }); },
    spots(t) { shape([[-80, 20], [-30, -50], [0, -10], [30, -50], [80, 20], [0, 40]], { fill: '#8C8C98', stroke: '#4B3F9A', lwPx: 4, smooth: .3 }); for (let i = 0; i < 5; i++) ellipse(-50 + i * 25, 5 - 12 * (i % 2), 7, 10, { fill: '#2EAE7A', stroke: null }); },
    explain(t) { shape(rectPts(-80, -50, 160, 100), { fill: '#2E4A3A', stroke: '#8A5A36', lwPx: 7 }); X.font = `600 30px ${FONT_TALK}`; X.textAlign = 'center'; X.fillStyle = '#FFFDF6'; X.fillText('E = mc²', 0, -5); X.fillText('a²+b²', 0, 30); },
    wings(t) { const f = Math.sin(t * 8) * .3; for (const sd of [-1, 1]) { X.save(); X.scale(sd, 1); X.rotate(f); shape([[10, 0], [80, -40], [90, 10], [60, 40]], { fill: '#5B6FD8', stroke: PAL.ink, lwPx: 4, smooth: .4 }); X.restore(); } },
    steth(t) { line([[-40, -50], [-40, 0], [0, 30], [40, 0], [40, -50]], { stroke: '#4C86A8', lwPx: 8, smooth: true }); line([[0, 30], [0, 50]], { stroke: '#4C86A8', lwPx: 8 }); circle(0, 60, 16, { fill: '#C9CED4', stroke: PAL.ink, lwPx: 4 }); },
    shoes(t) { for (const sd of [-1, 1]) shape([[sd * 15, -15], [sd * 70, -15], [sd * 85, 15], [sd * 10, 15]], { fill: sd < 0 ? '#6B4226' : '#F0F0F0', stroke: PAL.ink, lwPx: 4, smooth: .3 }); },
    eyes(t) { for (const [x, y] of [[-45, -20], [45, -20], [0, 30]]) { circle(x, y, 22, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 4 }); circle(x + 4 * Math.sin(t * 3), y, 8, { fill: PAL.ink, stroke: null }); } },
    hat(t) { shape([[-90, 30], [90, 30], [40, 10], [10, -60], [-20, 10]], { fill: '#6A86D8', stroke: PAL.ink, lwPx: 4, smooth: .2 }); for (const x of [-40, 0, 40]) shape(starPts(x, 15, 10, .4, 4, t), { fill: PAL.ink, stroke: null }); },
    teeth(t) { line([[-80, 0], [80, 0]], { stroke: PAL.ink, lwPx: 6 }); for (let i = 0; i < 5; i++) shape([[-70 + i * 32, 0], [-54 + i * 32, 0], [-62 + i * 32, 30]], { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 3 }); },
    cube(t) { const c = ['#E5466E', '#FFD34E', '#4DA650', '#2E7D9A', '#FF8A3D', '#FFFDF6']; X.save(); X.rotate(.15 * Math.sin(t * 3));
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) shape(rectPts(-60 + i * 40, -60 + j * 40, 38, 38), { fill: c[(i + j * 3 + Math.floor(t * 2)) % 6], stroke: PAL.ink, lwPx: 3 }); X.restore(); },
    five(t) { X.font = `90px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#E5466E'; X.fillText('5×', 0, 6); },
    laptop(t) { shape([[-80, 30], [80, 30], [95, 50], [-95, 50]], { fill: '#B9BEC4', stroke: PAL.ink, lwPx: 4 }); shape(rectPts(-70, -50, 140, 80), { fill: '#1E2A44', stroke: PAL.ink, lwPx: 4 });
      for (let i = 0; i < 4; i++) line([[-55, -32 + i * 16], [-55 + 40 + 60 * hash(i + Math.floor(t * 3)), -32 + i * 16]], { stroke: ['#7CFF9B', '#FFD34E', '#9FE3F5'][i % 3], lwPx: 5 }); },
    bucket(t) { shape([[-50, -30], [50, -30], [40, 50], [-40, 50]], { fill: '#FF8A3D', stroke: PAL.ink, lwPx: 4, smooth: .3 }); line([[-50, -30], [0, -80], [50, -30]], { stroke: PAL.ink, lwPx: 4, smooth: true });
      shape([[-20, 0], [-8, -12], [4, 0]], { fill: PAL.ink, stroke: null }); shape([[8, 0], [20, -12], [30, 0]], { fill: PAL.ink, stroke: null }); line([[-20, 25], [0, 33], [24, 25]], { stroke: PAL.ink, lwPx: 4, smooth: true }); },
    sisters(t) { for (const [x, h, c] of [[-45, 1, '#E58AB8'], [45, 1.25, '#8A63C9']]) { circle(x, -40 * h, 22, { fill: c, stroke: PAL.ink, lwPx: 3 }); shape([[x - 30, 50], [x - 22, -15 * h], [x + 22, -15 * h], [x + 30, 50]], { fill: c, stroke: PAL.ink, lwPx: 3, smooth: .3 }); }
      X.font = `60px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#FFE45C'; X.fillText('?', 0, 10); },
    score(t) { shape(rectPts(-90, -50, 180, 100), { fill: '#16202E', stroke: PAL.ink, lwPx: 4 }); X.font = `46px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FF5A3C'; X.fillText(`${(Math.floor(t * 2) % 9) + 1}:0${Math.floor(t * 4) % 10}`, 0, 4); },
    ball(t) { X.save(); X.rotate(t * 3); circle(0, 0, 55, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 4 }); for (const a of [0, 2.1, 4.2]) line([[0, 0], [Math.cos(a) * 55, Math.sin(a) * 55]], { stroke: '#4166B8', lwPx: 6 }); X.restore(); },
    saw(t) { X.save(); X.translate(10 * Math.sin(t * 12), 0); shape([[-90, -20], [60, -20], [60, 20], [-90, 30]], { fill: '#C9CED4', stroke: PAL.ink, lwPx: 4 }); for (let i = 0; i < 8; i++) shape([[-85 + i * 18, 26], [-76 + i * 18, 40], [-67 + i * 18, 26]], { fill: '#C9CED4', stroke: PAL.ink, lwPx: 2 });
      shape(rectPts(60, -30, 40, 60), { fill: '#8A5A36', stroke: PAL.ink, lwPx: 4, smooth: .3 }); X.restore(); },
    tall(t) { shape(rectPts(-20, -80, 40, 160), { fill: '#FFD34E', stroke: PAL.ink, lwPx: 4 }); for (let i = 0; i < 8; i++) line([[-20, -70 + i * 20], [i % 2 ? 0 : 8, -70 + i * 20]], { stroke: PAL.ink, lwPx: 3 }); shape([[30, -80], [70, -60], [30, -40]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 3 }); },
    bolt(t) { shape([[10, -80], [-40, 10], [0, 10], [-20, 80], [50, -10], [10, -10]], { fill: '#E03C3C', stroke: PAL.ink, lwPx: 4 }); },
    family(t) { const s = 1 + .08 * Math.sin(t * 6); X.scale(s, s); shape([[0, 50], [-60, -5], [-50, -45], [-15, -50], [0, -25], [15, -50], [50, -45], [60, -5]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 4, smooth: .5 }); },
  };
  function clue(t, t0, t1, x, y, icon, label, col = '#FFE45C') {
    const k = on(t, t0, t1, .2); if (k <= .01) return;
    overlay(() => { const s = backOut(clamp((t - t0) / .3)) * k; X.save(); X.translate(x, y + 8 * Math.sin(t * 2 + x)); X.rotate(.04 * Math.sin(t * 1.3 + x)); X.scale(s, s);
      shape(rectPts(-150 + 8, -140 + 10, 300, 280), { fill: 'rgba(0,0,0,.3)', stroke: null, smooth: .1 });
      shape(rectPts(-150, -140, 300, 280), { fill: '#FFF8EA', stroke: PAL.ink, lwPx: 7, smooth: .1 });
      X.save(); X.translate(0, -20); ICON[icon](t); X.restore();
      if (label) { X.font = `${label.length > 12 ? 30 : 38}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 7; X.strokeStyle = PAL.ink; X.strokeText(label, 0, 100); X.fillStyle = col; X.fillText(label, 0, 100); }
      X.restore(); });
  }
  const qmark = (t, x, y, size = 160, t0 = 0) => slam('?', x, y, size, '#FFE45C', t, t0, { rot: .1 * Math.sin(t * 3) });
  // one monster (or two) in the spotlight
  function onStage(t, names, o = {}) {
    const n = names.length, A = {};
    names.forEach((name, i) => { const x = W / 2 + (o.cx || 0) + (n === 1 ? 0 : (i - (n - 1) / 2) * (o.gap || 560)), k = (o.size || 620) / 180;
      A[name] = wearer(name, x, H * .86, k * (o.scaleOf ? o.scaleOf(name) : 1), t, { hop: (o.hop ?? 6) * hop(t, 1, i * .5), rot: .04 * Math.sin(t * 3 + i), ...(o.opt ? o.opt(name, i) : {}) }); });
    return A;
  }

  // =====================================================================================================
  // ---------- intro: WHO'S WHO? and the march ----------
  function paperBg(t) {
    X.fillStyle = '#FFF8EA'; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) for (let j = 0; j < 15; j++) circle(40 + i * 75, 40 + j * 75, 2.2, { fill: 'rgba(80,60,40,.18)', stroke: null });
  }
  function title(t) {
    paperBg(t);
    GANG.forEach((n, i) => {                                                    // the monsters pop up on the beats, a ? over each
      const t0 = .1 + i * .8, kk = backOut(clamp((t - t0) / .3)); if (kk <= 0) return;
      const x = 150 + i * 205, y = 1000 + 20 * (i % 2);
      const a = wearer(n, x, y, 2.1 * kk, t, { hop: 8 * hop(t, 1, i * .25), rot: .05 * Math.sin(t * 4 + i) });
      slam('?', a.top[0], a.top[1] - 40, 90, GW_CRAYON[i % 6], t, t0 + .3, { rot: .1 });
    });
    slam("WHO'S", W / 2, 170, 120, '#6A3FB0', t, 1.0, { rot: -.05 });
    slam('WHO?', W / 2, 320, 200, '#E5466E', t, 1.6, { rot: .03 });
    slam('THE TROLLS · THE FINALE', W / 2, 460, 54, '#2E7D9A', t, 2.4, { rot: -.02 });
    flash(.8 * (1 - seg(t, 0, .25)), '#FFFFFF');
  }
  const LINEX = [-560, -420, -280, -140, 0, 140, 280, 420, 560];
  function march(t) {                                                           // along the sidewalk, real feet marching
    const lt = t - S_MARCH, P = persp(drift({ x: 0, y: 170, z: 1250, f: 1100, hy: 600 }, t));
    const items = GANG.map((n, i) => M(n, -1300 + i * 170 + 230 * lt, 2060 + 25 * (i % 2), { walk: (t - .1) * 2 + i * .5 }));
    staged(DC, P, t, {}, items);
    slam('WELCOME', W / 2, 200, 120, '#FFE45C', t, row(0)[0], { life: 2.4 });
  }
  function legsShot(t) {                                                        // low and close: only the feet give them away
    const lt = t - S_LEGS, P = persp(drift({ x: 0, y: 40, z: 1700, f: 1300, hy: 820 }, t, .5));
    const items = GANG.map((n, i) => M(n, -700 + i * 175 + 90 * lt, 2050, { walk: (t - .1) * 2 + i * .5 }));
    staged(DC, P, t, {}, items, 1.0);
    slam('WHICH MONSTER', W / 2, 160, 100, '#FFE45C', t, row(1)[0], { life: 4 });
    slam('IS WHO?', W / 2, 290, 130, '#E5466E', t, row(1)[3], { life: 3 });
  }

  // ---------- verse 1: riddle one (the twins: the bat and the owl) and riddle two (the pumpkin) ----------
  function batRiddle(t) {
    const lt = t - S_BAT, z = 1 + .03 * lt;
    showStage(t, { t0: S_BAT });
    X.save(); X.translate(W / 2, H * .86); X.scale(z, z); X.translate(-W / 2, -H * .86);
    const A = onStage(t, ['safadi'], { opt: () => ({ sq: lt > 4 && lt < 6 ? .05 * Math.sin(t * 20) : 0 }) }); X.restore();
    clue(t, row(2)[0] + .3, row(4)[0] - .1, 330, 430, 'fang', 'ONE FANG');
    clue(t, row(4)[0], S_TWINS, 330, 430, 'spots', 'GREEN SPOTS');
    clue(t, row(5)[0], S_TWINS, W - 330, 430, 'explain', 'LOVES TO EXPLAIN');
    if (inW(t, row(3)[0], row(4)[0])) { qmark(t, 260, 380, 200, row(3)[0]); qmark(t, W - 260, 380, 200, row(3)[2]); }
  }
  function twinsRiddle(t) {                                                     // the owl joins: the doctor or the professor?
    const lt = t - S_TWINS; showStage(t, { t0: S_TWINS, noTitle: t > S_SHOES + 2.1 });
    const swap = t > S_SHOES - .2 ? ease(seg(t, S_SHOES - .2, S_SHOES + .4)) : 0;
    const A = onStage(t, ['safadi', 'sami'], { gap: 620, size: 560 });
    clue(t, row(6)[0], S_SHOES, W / 2, 330, 'wings', 'BIG BLUE WINGS');
    if (t > S_SHOES) {                                                          // the shell game: the two clue cards swap places, back and forth
      const u = .5 + .5 * Math.sin((t - S_SHOES) * 3.2);
      clue(t, S_SHOES, S_SHOES + 2.2, lerp(W / 2 - 310, W / 2 + 310, u), 300, 'steth', '');
      clue(t, S_SHOES, S_SHOES + 2.2, lerp(W / 2 + 310, W / 2 - 310, u), 300, 'explain', '');
    }
    if (t > S_SHOES + 2.2) { slam('LOOK AT', W / 2, 240, 90, '#FFE45C', t, S_SHOES + 2.2, { life: 2 }); slam('THE SHOES!', W / 2, 350, 110, '#7FD6F0', t, S_SHOES + 2.5, { life: 1.8 }); }
    for (const n of ['safadi', 'sami']) if (A[n] && t > S_SHOES + 2.2) overlay(() => { const f = A[n].feet; X.save(); X.strokeStyle = '#FFE45C'; X.lineWidth = 8; X.setLineDash([18, 12]); X.lineDashOffset = -t * 60; X.beginPath(); X.ellipse(f[0], f[1] - 60, 150, 110, 0, 0, TAU); X.stroke(); X.restore(); });
  }
  function pumpkinRiddle(t) {
    const lt = t - S_PUMPKIN; showStage(t, { t0: S_PUMPKIN });
    const spin = t > row(17)[0] ? TAU * 3 * ease(seg(t, row(17)[0], row(17)[0] + 1.6)) : 0;
    const A = onStage(t, ['danny'], { size: 760, opt: () => ({ spin, hop: 10 * hop(t) }) });
    clue(t, row(10)[0] + .2, row(12)[0], 330, 430, 'eyes', 'THREE EYES');
    clue(t, row(12)[0], S_CUBES, W - 330, 430, 'hat', 'BATS ON A HAT');
    clue(t, row(13)[0], S_CUBES, 330, 430, 'teeth', 'SPIKY TEETH');
    clue(t, S_CUBES, S_FIVE, W - 330, 430, 'cube', 'CUBES & BLOCKS');
    if (inW(t, S_CUBES, S_FIVE)) for (let i = 0; i < 5; i++) { const age = t - S_CUBES - i * .35; if (age > 0) { const y = Math.min(H * .86 - 30 - i * 56, -60 + age * 1600);   // a block tower drops in
      overlay(() => shape(rectPts(260 - 40, y - 28, 80, 56), { fill: GW_CRAYON[i], stroke: PAL.ink, lwPx: 4, smooth: .1 })); } }
    if (t > S_FIVE) ['1×', '2×', '3×', '4×', '5×'].forEach((s, i) => slam(s, 300 + i * 330, 220, 90, GW_CRAYON[i], t, S_FIVE + i * .3, { life: 2.2 - i * .3 }));
    if (t > row(17)[0]) slam('ZOOM!', W - 330, 400, 110, '#FFE45C', t, row(17)[0] + .2, { life: 1.5 });
  }

  // ---------- chorus 1: eight battles (challenger · victim flubs · the gag · the laughs) ----------
  function battle(cfg) {
    return t => {
      const lt = t - cfg.t0, u = backOut(clamp((lt - 1.65) / .25)), k = kick(t, cfg.t0 + cfg.gagAt, 3);
      camBegin(W / 2 + 18 * k * Math.sin(t * 61), H / 2 + 14 * k * Math.cos(t * 53), 1 + .03 * k);
      const P = persp(drift(lerpCam(cfg.camA, cfg.camB, u), t, .6)), A = staged(cfg.set, P, t, cfg.opt || {}, cfg.cast(lt), 1.2 * u);
      camEnd();
      const fa = A[cfg.from], ta = A[cfg.to];
      if (fa) bubble(cfg.twist, fa.mouth || fa.top, lt - .1, { side: cfg.sideF ?? -1, accent: '#6A3FB0', kind: cfg.kind, cps: 30, hold: .15, size: 44 });
      if (ta) bubble(cfg.flub, ta.mouth || ta.top, lt - 1.85, { side: cfg.sideT ?? 1, accent: '#E5466E', kind: cfg.kindT ?? cfg.kind, cps: cfg.cpsT ?? 22, hold: .9, size: 44 });
      if (ta && !cfg.noStars) stars(ta.top[0], ta.top[1] + 20, (ta.w || 120) * .45, t, on(t, cfg.t0 + cfg.gagAt - .2, cfg.t0 + 3.9, .2));
      if (cfg.gag) cfg.gag(t, lt, A, P);
      if (cfg.laugh !== false) Object.entries(A).forEach(([id, a], i) => { if (id === cfg.to || !a) return;
        sfx(['HA HA!', 'HEE HEE!', 'HO HO!', 'LOL!'][i % 4], a.top[0] + (i % 2 ? 40 : -40), a.top[1] - 30, 42, GW_CRAYON[i % 6], lt - 3.0 - .12 * i, { life: .9, rot: i % 2 ? .1 : -.1 }); });
    };
  }
  const sciCam = (x, z, f = 1000, hy = 560) => ({ x, y: 150, z, f, hy, dir: -1 });
  const libCam = (x, z, f = 1000, hy = 560) => ({ x, y: 160, z, f, hy, dir: -1 });
  const gymCam = (x, z, f = 1000, hy = 570, y = 150) => ({ x, y, z, f, hy, dir: 1 });
  const GOPT = { lights: 1, score: { home: 0, guest: 0 } };
  const MATH = t => { X.font = `700 54px ${FONT_TALK}`; X.fillStyle = '#2F5FB0'; X.fillText('6 × 6 = 36', 40, 70); X.fillStyle = '#C0392B'; X.fillText('66 + 6 = ?', 380, 70); X.font = `600 36px ${FONT_TALK}`; X.fillStyle = '#2E7D32'; X.fillText('TONGUE-TWISTER DAY', 40, 130); };
  function flyingBooks(t, t0, cx, cy, n = 12, spread = 700) {
    const age = t - t0; if (age < 0 || age > 2) return;
    overlay(() => { for (let i = 0; i < n; i++) { const a = age - hash(i) * .2; if (a < 0) continue; const ang = -Math.PI / 2 + (hash(i + 4) - .5) * 2.4, v = spread * (.6 + .5 * hash(i + 9));
      X.save(); X.translate(cx + Math.cos(ang) * v * a, cy + Math.sin(ang) * v * a + 900 * a * a); X.rotate(a * 8 + i); shape(rectPts(-26, -34, 52, 68), { fill: GW_CRAYON[i % 6], stroke: PAL.ink, lwPx: 3 }); X.restore(); } });
  }
  function ball(x, y, r) { circle(x, y, r, { fill: '#E8742C', stroke: PAL.ink, lwPx: 3 }); line([[x - r, y], [x + r, y]], { stroke: PAL.ink, lwPx: 2 }); line([[x, y - r], [x, y + r]], { stroke: PAL.ink, lwPx: 2 }); }
  const BATTLES = [
    battle({ t0: BT(0), set: SR, opt: { bubbling: 1 }, from: 'danny', to: 's21', gagAt: 2.9, camA: sciCam(-60, 1110, 950), camB: sciCam(-250, 1030, 1350, 540),
      cast: lt => [M('danny', 30, 640, { hop: 10 * hop(T) }), K(21, -240, SR.bench(1, -240).z, { mood: lt > 1.8 ? 'flub' : 'gasp' }), K(20, -380, SR.bench(2, -380).z, { mood: lt > 3 ? 'laugh' : 'gasp' })],
      twist: 'Fuzzy pumpkins fizz in frizzy flasks!', flub: 'Frizzy… fuzzy… FIZZY FOAM!',
      gag: (t, lt, A) => { const a = A.s21; if (!a || lt < 2.9) return; const g = ease(seg(lt, 2.9, 3.4));
        overlay(() => { for (let i = 0; i < 26; i++) circle(a.top[0] + (hash(i + 2) - .5) * 360 * g, a.top[1] + 60 + (hash(i + 7) - .5) * 260 * g - 40 * Math.sin(t * 3 + i), (30 + 40 * hash(i)) * g, { fill: i % 3 ? '#E8FBFF' : '#C9F1FF', stroke: '#8CC8DA', lwPx: 3 }); });
        slam('FOAM!', a.top[0], a.top[1] - 120, 120, '#7FD6F0', t, BT(0) + 2.95, { life: 1 }); } }),
    battle({ t0: BT(1), set: SR, opt: { bubbling: 1 }, from: 's23', to: 'safadi', gagAt: 3.0, sideF: 1, sideT: -1, camA: sciCam(150, 1110, 950), camB: sciCam(40, 1130, 1150, 520),
      cast: lt => [M('safadi', 20, 640, { hop: lt > 1.8 ? 6 * Math.abs(Math.sin(T * 14)) : 8 * hop(T), rot: lt > 1.8 ? .08 * Math.sin(T * 13) : 0 }), K(23, 260, SR.bench(1, 260).z, { mood: lt < 1.7 ? 'talk' : lt > 3 ? 'laugh' : 'gasp' }), K(22, 380, SR.bench(2, 380).z, { mood: lt > 2.8 ? 'cheer' : 'gasp' })],
      twist: 'Big bats blink back black boxes!', flub: 'Big blinks… black backs… allow me to EXPLAIN—',
      gag: t => slam('NO EXPLAINING!', W / 2, 200, 120, '#E5466E', t, BT(1) + 3.0, { life: .9 }) }),
    battle({ t0: BT(2), set: LB, opt: {}, from: 'alma', to: 's31', gagAt: 3.0, kind: 'whisper', camA: libCam(-100, 1150, 950), camB: libCam(-260, 1080, 1300, 540),
      cast: lt => [M('alma', 30, 690, { hop: 6 * hop(T) }), K(31, -280, LB.table(1, -280).z, { mood: lt > 1.8 ? 'flub' : 'gasp' }), K(30, -420, LB.table(2, -420).z, { mood: lt > 3 ? 'laugh' : 'smile' })],
      twist: 'Shhh… six shy sheep shush sleepy shelves…', flub: 'Shix shy shleep… shhh-shhh… AH-CHOO!',
      gag: (t, lt, A) => { const a = A.s31; if (!a) return; flyingBooks(t, BT(2) + 3.0, a.top[0], a.top[1] + 40); slam('AH-CHOO!', a.top[0], a.top[1] - 100, 110, '#FF8A3D', t, BT(2) + 3.0, { life: .9 }); } }),
    battle({ t0: BT(3), set: LB, opt: {}, from: 's33', to: 'sami', gagAt: 2.9, sideF: 1, sideT: -1, kind: 'whisper', camA: libCam(120, 1150, 950, 600), camB: libCam(-40, 1080, 1100, 600),
      cast: lt => [M('sami', -40, 690, { spin: lt > 2.6 ? Math.PI * ease(seg(lt, 2.6, 3.0)) : 0, hop: lt > 2.6 ? 60 * Math.sin(Math.PI * clamp(seg(lt, 2.6, 3.4))) : 6 * hop(T) }), K(33, 260, LB.table(1, 260).z, { mood: lt < 1.7 ? 'talk' : lt > 3 ? 'laugh' : 'gasp' }), K(32, 400, LB.table(2, 400).z, { mood: lt > 3 ? 'laugh' : 'smile' })],
      twist: 'Owls in odd orange overalls ogle old books!', flub: 'Owls… ogle… oddle… WHOOPS!',
      gag: (t, lt, A) => { const a = A.sami; if (!a) return; flyingBooks(t, BT(3) + 2.9, a.feet[0], a.feet[1] - 200, 9, 500); slam('WHOOPS!', a.feet[0] + 160, a.feet[1] - a.h * .8, 110, '#FFD34E', t, BT(3) + 3.0, { life: .9 }); } }),
    battle({ t0: BT(4), set: SR, opt: { bubbling: 0, board: MATH }, from: 'sarah', to: 's25', gagAt: 2.9, camA: sciCam(-100, 1110, 950), camB: sciCam(-300, 1030, 1350, 540),
      cast: lt => [M('sarah', 20, 640, { hop: 6 * hop(T), angry: lt > 2.6 ? 1 : 0 }), K(25, -300, SR.bench(1, -300).z, { mood: lt > 1.8 ? 'flub' : 'gasp' }), K(24, -420, SR.bench(2, -420).z, { mood: lt > 3 ? 'laugh' : 'gasp' })],
      twist: 'Sixty-six sticky sixes stick to six sticks!', flub: 'Shixty-shix… shticky… 6! 6! 6! 6!',
      gag: (t, lt, A) => { const a = A.s25; if (!a) return; const age = t - BT(4) - 2.9; if (age < 0 || age > 1.6) return;
        overlay(() => { for (let i = 0; i < 16; i++) { const ang = i / 16 * TAU, r = 520 * age; X.save(); X.translate(a.top[0] + Math.cos(ang) * r, a.top[1] + 40 + Math.sin(ang) * r * .7); X.rotate(age * 6 + i); X.globalAlpha = 1 - seg(age, 1.1, 1.6);
          X.font = `${60 + 30 * hash(i)}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineWidth = 8; X.strokeStyle = PAL.ink; X.strokeText('6', 0, 0); X.fillStyle = GW_CRAYON[i % 6]; X.fillText('6', 0, 0); X.restore(); } }); } }),
    battle({ t0: BT(5), set: SR, opt: { bubbling: 0, board: MATH }, from: 's27', to: 'roudaynah', gagAt: 3.0, sideF: 1, sideT: -1, cpsT: 40, noStars: true, laugh: false, camA: sciCam(140, 1110, 950), camB: sciCam(20, 1130, 1150, 520),
      cast: lt => [M('roudaynah', -10, 620, { hop: 4 * hop(T) }), K(27, 270, SR.bench(1, 270).z, { mood: lt < 1.7 ? 'talk' : 'gasp', age: lt - 3 }), K(26, 400, SR.bench(2, 400).z, { mood: 'gasp', age: lt - 3 })],
      twist: 'Proper programmers properly prove pi!', flub: 'Proper programmers properly prove pi. Semicolon.',
      gag: (t, lt, A) => { const a = A.roudaynah; if (!a || lt < 3) return; const k = backOut(clamp((lt - 3) / .3));
        overlay(() => { X.save(); X.translate(a.top[0] - 240, a.top[1] + 40); X.scale(k, k); circle(0, 0, 80, { fill: '#5BC27F', stroke: PAL.ink, lwPx: 6 }); line([[-36, 0], [-8, 30], [40, -28]], { stroke: '#FFFDF6', lwPx: 16 });
          X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#2E9D58'; X.fillText('100%', 0, 120); X.restore(); }); } }),
    battle({ t0: BT(6), set: GY, opt: GOPT, from: 'housam', to: 's41', gagAt: 2.9, sideF: 1, sideT: -1, camA: gymCam(0, 1000, 1250, 570), camB: gymCam(-170, 1100, 1450, 560),
      cast: lt => [M('housam', 180, 1450, { hop: 20 * hop(T), flip: true }), K(41, -180, 1450, { mood: lt > 1.8 ? 'flub' : 'gasp' }), K(40, -380, 1550, { mood: lt > 3 ? 'laugh' : 'smile' })],
      twist: 'Blue birds bounce big bouncy balls!', flub: 'Blue bounce… ball bird… BOING BOING!',
      gag: (t, lt, A) => { const a = A.s41; if (!a) return; const age = t - BT(6) - 2.7; if (age < 0 || age > 1.2) return;
        overlay(() => ball(a.top[0] + 700 * Math.max(0, age - .3), a.top[1] - 10 - 900 * age + 1100 * age * age, 34)); slam('BOING!', a.top[0], a.top[1] - 80, 100, '#FF8A3D', t, BT(6) + 3.0, { life: .9 }); } }),
    battle({ t0: BT(7), set: GY, opt: GOPT, from: 's43', to: 'jenna', gagAt: 2.6, camA: gymCam(0, 1000, 1250, 570), camB: gymCam(170, 1100, 1400, 560),
      cast: lt => [M('jenna', 200 + 160 * ease(seg(lt, 2.6, 3.6)), 1450, { spin: TAU * 2 * ease(seg(lt, 2.6, 3.6)), hop: 40 * Math.sin(Math.PI * clamp(seg(lt, 2.6, 3.6))) }), K(43, -200, 1450, { mood: lt < 1.7 ? 'talk' : lt > 3 ? 'cheer' : 'gasp' }), K(42, -390, 1550, { mood: lt > 3 ? 'cheer' : 'smile' })],
      twist: 'Busy bees buzz by bright blue bleachers!', flub: 'Buzzy blee… bleachy… BZZZZZ!',
      gag: t => slam('CARTWHEEL!', W / 2 + 200, 240, 110, '#FFD34E', t, BT(7) + 2.8, { life: 1 }) }),
  ];

  // ---------- verse 2: riddle three (the skull ghost), riddle four (the cat), and the line-up ----------
  function ghostRiddle(t) {
    const lt = t - S_GHOST, digital = inW(t, row(27)[0], row(28)[0]);
    showStage(t, { digital, t0: S_GHOST });
    const A = onStage(t, ['roudaynah'], { size: 640, hop: 0, opt: () => ({ hop: 20 + 14 * Math.sin(t * 2), rot: .05 * Math.sin(t * 1.5) }) });   // floating
    clue(t, row(26)[0] + .2, row(28)[0], 330, 430, 'teeth', 'SKULL FACE');
    clue(t, row(28)[0], S_AUNTIE, 330, 430, 'bucket', 'CANDY BUCKET');
    clue(t, row(28)[6], S_AUNTIE, W - 330, 430, 'laptop', 'LAPTOP');
    clue(t, row(29)[0], S_AUNTIE, W / 2, 300, 'family', 'TECH-MOM?');
    clue(t, row(31)[0], S_CAT, W - 330, 430, 'sisters', 'SISTER? AUNTIE?');
    if (t > row(30)[0]) slam('QUICK!', 330, 430, 110, '#FFE45C', t, row(30)[0], { life: 1.8 });
    if (t > row(32)[0]) { qmark(t, 330, 400, 220, row(32)[0]); }
  }
  function catRiddle(t) {
    const lt = t - S_CAT, hair = t > S_HAIR ? ease(seg(t, S_HAIR, S_HAIR + .4)) * (1 - seg(t, S_HAIR + 2.8, S_HAIR + 3.6)) : 0;
    showStage(t, { t0: S_CAT });
    const A = onStage(t, ['sarah'], { size: 640, opt: () => ({ angry: hair, sq: hair ? .04 * Math.sin(t * 30) : 0 }) });
    clue(t, row(34)[0] + .2, row(35)[0], 330, 430, 'eyes', 'STRIPES & SURPRISE');
    clue(t, row(35)[0], row(36)[0], W - 330, 430, 'score', 'SCOREBOARD');
    clue(t, row(36)[0], S_HAIR, 330, 430, 'saw', 'MAKES THINGS');
    clue(t, row(36)[7], S_HAIR, W - 330, 430, 'ball', 'PLAYS BALL');
    clue(t, row(37)[0], S_HAIR, W / 2, 290, 'tall', 'TALLEST REBEL');
    clue(t, S_HAIR, row(39)[0], 330, 430, 'bolt', 'WILD HAIR');
    clue(t, row(39)[0], S_LINEUP, W - 330, 430, 'family', 'FAMILY');
  }
  // all nine in a row with numbered question marks: who's who?
  function lineup(t, t0, o = {}) {
    showStage(t, { t0 });
    const A = {};
    GANG.forEach((n, i) => { const x = 140 + i * 205, kk = 380 / 180 * (TALL[n] / 172 * .35 + .65);
      A[n] = wearer(n, x, H * .86, kk, t, { hop: 10 * hop(t, 1, i * .25), rot: .05 * Math.sin(t * 4 + i) });
      overlay(() => { X.save(); X.translate(x, A[n].top[1] - 60); X.rotate(.08 * Math.sin(t * 3 + i)); circle(0, 0, 44, { fill: GW_CRAYON[i % 6], stroke: PAL.ink, lwPx: 5 });
        X.font = `52px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#FFFDF6'; X.fillText(o.numbers ? String(i + 1) : '?', 0, 4); X.restore(); });
    });
    return A;
  }
  const lineupShot = t => { lineup(t, S_LINEUP, { numbers: t > row(41)[0] }); if (t > row(41)[0]) slam('FIGURE OUT WHO!', W / 2, 280, 100, '#E5466E', t, row(41)[0], { life: 2.4 }); };

  // ---------- the instrumental: the tournament (word volleyball), a TIE, then "GUESS!" ----------
  const MSPOT = { safadi: [520, 1560], roudaynah: [420, 1700], dr_g: [330, 1500], sarah: [240, 1660], sami: [150, 1440], jenna: [70, 1620], housam: [360, 1360], danny: [210, 1300], alma: [520, 1300] };
  const KSPOT = [[-160, 1400], [-280, 1300], [-330, 1520], [-450, 1380], [-200, 1620], [-520, 1560], [-420, 1720], [-120, 1260]];
  const BLEACH = []; for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) BLEACH.push({ seed: 60 + r * 9 + i, ...GY.bleacher(r, 960 + i * 130 + (r % 2) * 50) });
  function gymCrowd(t, o = {}) {
    const items = [];
    BLEACH.forEach((b, i) => items.push(K(b.seed, b.x, b.z, () => ({ mood: o.bleach ?? 'cheer', pose: { sit: 1, jump: (o.bleach ?? 'cheer') === 'cheer' ? .8 * hop(t, 1, i * .3) : 0 } }), b.y)));
    KSPOT.forEach(([x, z], i) => items.push(K(80 + i, x, z, () => (o.kid ? o.kid(i) : { mood: 'smile' }))));
    Object.entries(MSPOT).forEach(([n, [x, z]], i) => items.push(M(n, x, z, () => (o.mon ? o.mon(n, i) : { hop: 8 * hop(t, 1, i * .2) }))));
    return items;
  }
  const VOLLEY = ['TWIST!', 'TROLL!', 'FLIP!', 'FAST!', 'SILLY!', 'SPIN!', 'SLIP!', 'TRIP!'];
  function volley(t) {
    const lt = t - S_VOLLEY, phase = Math.floor(lt / 2) % 4, n = Math.floor(lt / 1), home = Math.floor((n + 1) / 2), guest = Math.floor(n / 2);
    const cams = [gymCam(0, 760, 820, 540, 190), gymCam(260, 1000, 1150, 560), gymCam(-260, 1000, 1150, 560), gymCam(0, 900, 950, 560, 230)];
    const P = persp(drift(cams[phase], t));
    const items = gymCrowd(t, { kid: i => ({ mood: hop(t, 1, i * .2) > .6 ? 'talk' : 'cheer' }), mon: (n2, i) => ({ hop: 14 * hop(t, 1, i * .2), rot: .05 * Math.sin(t * 5 + i) }) });
    staged(GY, P, t, { lights: 1, score: { home, guest }, buzzer: kick(t, S_VOLLEY + n + .1, 6), clock: Math.max(0, 16 - lt) }, items);
    const bi = Math.floor(lt / B), bu = frac(lt / B), dir = bi % 2 ? -1 : 1, x0 = P.p(dir > 0 ? -250 : 250, 120, 1450), x1 = P.p(dir > 0 ? 250 : -250, 120, 1450);
    const bx = lerp(x0[0], x1[0], bu), by = Math.max(110, lerp(x0[1], x1[1], bu) - 110 * Math.sin(Math.PI * bu) * x0[2]);
    overlay(() => { X.save(); X.translate(bx, by); X.rotate(bu * 2 * dir); circle(0, 0, 70, { fill: '#FFF4B8', stroke: PAL.ink, lwPx: 5 });
      X.font = `34px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = GW_CRAYON[bi % 6]; X.fillText(VOLLEY[bi % 8], 0, 2); X.restore(); });
    if (lt < 1.2) slam('TOURNAMENT!', W / 2, 200, 130, '#FFE45C', t, S_VOLLEY + .05, { life: 1.6 });
  }
  function tie(t) {
    const P = persp(drift(gymCam(0, 820, 860, 540, 200), t, .3));
    const items = gymCrowd(t, { bleach: 'gasp', kid: () => ({ mood: 'flub' }), mon: (n, i) => ({ sq: .05 * Math.sin(t * 9 + i), rot: .08 * Math.sin(t * 3 + i) }) });
    const A = staged(GY, P, t, { lights: 1, score: { home: 8, guest: 8 }, clock: 0 }, items);
    Object.entries(A).forEach(([id, a]) => { if (a && MSPOT[id]) stars(a.top[0], a.top[1] + 10, (a.w || 80) * .5, t); });
    slam('TIE!', W / 2, 250, 200, '#FFE45C', t, S_TIE + .3, { life: 3.6 });
  }
  function guess(t) {                                                           // lock in your guesses: 3 · 2 · 1
    lineup(t, S_GUESS, { numbers: true });
    slam('LOCK IN YOUR GUESSES!', W / 2, 290, 90, '#7FD6F0', t, S_GUESS + .1, { life: 3.1 });
    ['3', '2', '1'].forEach((s, i) => slam(s, W / 2, H * .5, 300, GW_CRAYON[i * 2], t, S_GUESS + 1.0 + i * .7, { life: .7 }));
  }

  // ---------- chorus 2: the dance party; the outro: masks off ----------
  const DKIDS = []; for (let i = 0; i < 10; i++) DKIDS.push({ seed: 100 + i, x: -520 + i * 115 + 30 * (i % 2), z: 1000 + 50 * (i % 3) });
  const DMON = { dr_g: [-470, 820], roudaynah: [-350, 900], sarah: [-230, 830], jenna: [-115, 910], danny: [0, 840], safadi: [115, 900], alma: [230, 840], housam: [350, 910], sami: [470, 830] };
  const STAGEP = { pearl: [-230, 230], neptune: [0, 250], dragon: [240, 230] };
  const REVEAL_ORDER = ['safadi', 'sami', 'danny', 'roudaynah', 'sarah', 'alma', 'housam', 'jenna', 'dr_g'];
  const offAt = n => S_REVEAL + .3 + .4 * REVEAL_ORDER.indexOf(n);
  function guests(t, o = {}) {
    return [
      { id: 'pearl', z: STAGEP.pearl[1], draw: P => { const [sx, sy, k] = P.p(STAGEP.pearl[0], 100, STAGEP.pearl[1]); return pearl(sx, sy, PP_UNIT * k * .9, { t, sit: 1, eyes: 'bored', mouth: 'flat', headTilt: .1, ...(o.pearl || {}) }); } },
      { id: 'neptune', z: STAGEP.neptune[1], draw: P => { const [sx, sy, k] = P.p(STAGEP.neptune[0], 100, STAGEP.neptune[1]); return neptune(sx, sy, NT_UNIT * k * .9, { t, sit: 1, trident: true, eyes: 'smug', mouth: 'smile', ...(o.neptune || {}) }); } },
      { id: 'dragon', z: STAGEP.dragon[1], draw: P => { const [sx, sy, k] = P.p(STAGEP.dragon[0], 100, STAGEP.dragon[1]); return dragon(sx, sy, DRAGON_UNIT * k, { t, wings: .5, ...(o.dragon || {}) }); } },
    ];
  }
  function danceItems(t, mode, o = {}) {
    const items = [];
    DKIDS.forEach((d, i) => items.push(K(d.seed, d.x, d.z, () => (mode === 'laugh' ? { mood: 'laugh' } : mode === 'ready' ? { mood: 'smile', pose: { jump: .4 * hop(t, 1, i * .2) } } : { mood: 'cheer' }))));
    Object.entries(DMON).forEach(([n, [x, z]], i) => items.push(M(n, x, z, () => ({ off: o.off ? o.off(n) : 0, hop: (mode === 'dance' ? 18 : 6) * hop(t, 1, i * .25), rot: .06 * Math.sin(t * 6 + i) }))));
    return items.concat(guests(t, o.guests ? o.guests(t) : {}));
  }
  function dance(t) {
    const lt = t - S_DANCE, ph = Math.floor(lt / 4) % 4;
    const cams = [{ x: 0, y: 175, z: 1700, f: 1050, hy: 520, dir: -1 }, { x: -200, y: 130, z: 1250, f: 1050, hy: 560, dir: -1 }, { x: 0, y: 280, z: 1800, f: 950, hy: 420, dir: -1 }, { x: 200, y: 130, z: 1250, f: 1050, hy: 560, dir: -1 }];
    const P = persp(drift(cams[ph], t)), k = kick(t, S_DANCE + 4 * Math.floor(lt / 4) + .05, 5), close = ph % 2 === 1;
    camBegin(W / 2, H / 2, 1 + .04 * k + .015 * hop(t), 0);
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'dance', { guests: tt => ({ neptune: { eyes: 'happy', mouth: 'grin', headTilt: .1 * hop(tt), flex: hop(tt) }, dragon: { jump: 1.5 * hop(tt), wings: 1, flap: Math.sin(tt * 12), eyes: 'happy', mouth: 'grin' } }) }).filter(it => !close || !/^s\d/.test(it.id)));
    camEnd();
    confetti(t, S_DANCE, 70, 33);
    overlay(() => { X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = W * (.2 + .2 * i) + 200 * Math.sin(t * 1.3 + i * 2); const g = X.createRadialGradient(x, H * .7, 10, x, H * .7, 260);
      g.addColorStop(0, rgba(GW_CRAYON[i], .25)); g.addColorStop(1, rgba(GW_CRAYON[i], 0)); X.fillStyle = g; X.fillRect(0, 0, W, H); } X.globalCompositeOperation = 'source-over'; });
  }
  function reveal(t) {                                                          // "Now pull off the masks and let us see!"
    const lt = t - S_REVEAL, P = persp(drift({ x: 0, y: 160, z: 1650, f: 1150, hy: 540, dir: -1 }, t, .5));
    const A = staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, lt > 4 ? 'laugh' : 'ready', { off: n => seg(t, offAt(n), offAt(n) + .7) }));
    REVEAL_ORDER.forEach((n, i) => { const a = A[n]; if (a) { sfx('POP!', a.hip[0], a.hip[1] - a.h * .5, 56, GW_CRAYON[i % 6], t - offAt(n), { life: .6 }); if (t > offAt(n) + .7) sfx(['HA HA!', 'HO HO!', 'HEE!'][i % 3], a.top[0] + 40, a.top[1] - 40, 40, '#FFE45C', (t - offAt(n) - .7) % 1.4, { life: 1 }); } });
    if (lt > 4) Object.entries(A).forEach(([id, a], i) => { if (a && /^s\d/.test(id)) sfx(i % 2 ? 'HA HA!' : 'LOL!', a.top[0], a.top[1] - 30, 38, GW_CRAYON[i % 6], (lt - 4 - i * .07) % 1.6, { life: 1 }); });
    if (lt > 4.15) slam('DID YOU GUESS RIGHT?', W / 2, 170, 90, '#FFE45C', t, S_FAMILY + .3, { life: 3 });
  }
  function family(t) {                                                          // the professor, the doctor and the kids: faces, close, one per beat
    const lt = t - S_FAMILY - 2.2, P = persp(drift({ x: lerp(380, -380, ease(seg(lt, 0, 3.6))), y: 130, z: 1250, f: 1150, hy: 560, dir: -1 }, t, .3));
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'laugh', { off: () => 1 }).filter(it => !/^s\d/.test(it.id)));
    confetti(t, S_FAMILY + 2.2, 50, 6);
  }
  function backOfHall(t) {                                                      // "But wait, look at the back, do you see?" → "Take off your costumes!"
    const lt = t - S_BACK, u = ease(seg(lt, 0, .45)), a = { x: 0, y: 160, z: 1650, f: 1150, hy: 540, dir: -1 }, b = { x: 0, y: 165, z: 950, f: 1150, hy: 470, dir: -1 };
    const P = persp(drift(lerpCam(a, b, u), t, .4));
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'laugh', { off: () => 1, guests: () => ({ neptune: { eyes: 'wide', mouth: 'o' }, dragon: { eyes: 'wide', mouth: 'o', question: on(t, S_BACK + 1.5, S_REAL) } }) }));
    if (u < 1) overlay(() => { X.fillStyle = `rgba(255,255,255,${.35 * (1 - u)})`; X.fillRect(0, 0, W, H); for (let i = 0; i < 20; i++) line([[0, 50 + i * 55], [W, 50 + i * 55]], { stroke: `rgba(255,255,255,${.25 * (1 - u)})`, lwPx: 8 }); });
    callout('Now YOU! Take off your costumes!', W * .42, H + 60, t - row(56)[0], { size: 54, maxW: 760, cps: 22, hold: 1.2, accent: '#E5466E', dx: 60, dy: -420 });
  }
  function real(t) {                                                            // "Wait, these are real?" … and Pearl laughs, then everyone
    const lt = t - S_REAL, laughing = lt > 1.3, P = persp(drift({ x: 0, y: 170, z: 760, f: 1050, hy: 440, dir: -1 }, t, .4)), k = kick(t, S_REAL + 1.3, 3);
    camBegin(W / 2 + 14 * k * Math.sin(t * 61), H / 2 + 10 * k * Math.cos(t * 53), 1 + .03 * k);
    const A = staged(GY, P, t, { lights: 1, curtain: 1 }, guests(t, {
      pearl: laughing ? { eyes: 'happy', mouth: 'open', headTilt: .35 + .1 * Math.sin(t * 12), sq: .04 * Math.sin(t * 24), blush: 1 } : { eyes: 'open', mouth: lipFlap(t, lt < 1.1, 'smirk'), brows: 'up', headTilt: .2 },
      neptune: laughing ? { eyes: 'happy', mouth: 'laugh', headTilt: .3 + .1 * Math.sin(t * 11), trident: true } : { eyes: 'smug', mouth: 'smile', trident: true },
      dragon: laughing ? { eyes: 'happy', mouth: 'grin', jump: 1.5 * Math.abs(Math.sin(t * 9)), wings: 1, flap: Math.sin(t * 14) } : { eyes: 'wink', mouth: 'smile' },
    }));
    camEnd();
    if (A.pearl) callout('These ARE our faces!', A.pearl.mouth[0], A.pearl.mouth[1], lt + .1, { size: 56, maxW: 700, cps: 20, hold: .5, accent: '#E5466E', dx: 260, dy: -260 });
    callout('Wait… these are REAL?!', W * .3, H + 60, lt - 1.3, { size: 54, maxW: 700, cps: 20, hold: 1.2, accent: '#6A3FB0', dx: 0, dy: -380 });
    if (laughing && A.pearl) sfx('HA HA HA!', A.pearl.mouth[0] - 120, A.pearl.mouth[1] - 160, 90, '#FFB3D1', (lt - 1.3) % 1.2, { life: 1.1 });
    if (laughing && A.neptune) sfx('HO HO HO!', A.neptune.head[0] + 100, A.neptune.head[1] - 120, 70, '#9FE3F5', (lt - 1.5) % 1.2, { life: 1.1 });
    if (laughing && A.dragon) sfx('HEE HEE!', A.dragon.top[0] + 60, A.dragon.top[1] - 60, 64, '#AEF0CC', (lt - 1.7) % 1.2, { life: 1.1 });
    slam('HIP HIP HOORAY!', W / 2 - 260, H - 250, 100, '#FFE45C', t, row(57)[4], { life: 4 });
    confetti(t, S_REAL + 1.3, 50, 5);
  }
  function theEnd(t) {
    const P = persp(drift({ x: 0, y: 175, z: 1700, f: 1050, hy: 520, dir: -1 }, t, .3));
    staged(GY, P, t, { lights: 1, curtain: 1 }, danceItems(t, 'laugh', { off: () => 1, guests: tt => ({ pearl: { eyes: 'happy', mouth: 'open', headTilt: .3 + .1 * Math.sin(tt * 12) }, neptune: { eyes: 'happy', mouth: 'laugh', headTilt: .3 }, dragon: { eyes: 'happy', mouth: 'grin', jump: 1.2 * Math.abs(Math.sin(tt * 9)), wings: 1 } }) }));
    confetti(t, S_END - 2, 60, 9);
    overlay(() => { const c = backOut(seg(t, S_END + .2, S_END + .6)); if (c <= 0) return; X.save(); X.translate(W / 2, 170); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-360, -100, 720, 200), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .12 });
      X.font = `120px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 16; X.strokeStyle = PAL.ink; X.strokeText('THE END', 0, 10); X.fillStyle = '#E5466E'; X.fillText('THE END', 0, 10); X.restore(); });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 1.8, END - .3))));
  }

  const withKaraoke = fn => (t, lt, dur) => { fn(t, lt, dur); gwKaraoke(t); };
  scene({ duration: END, fps: 24, bpm: 120,
    shots: [
      [0, title], [S_MARCH, march], [S_LEGS, legsShot],
      [S_BAT, batRiddle], [S_TWINS, twinsRiddle], [S_PUMPKIN, pumpkinRiddle],
      ...BATTLES.map((fn, i) => [BT(i), fn]),
      [S_GHOST, ghostRiddle], [S_CAT, catRiddle], [S_LINEUP, lineupShot],
      [S_VOLLEY, volley], [S_TIE, tie], [S_GUESS, guess], [S_DANCE, dance],
      [S_REVEAL, reveal], [S_FAMILY + 2.2, family], [S_BACK, backOfHall], [S_REAL, real], [S_END, theEnd],
    ].map(([t0, fn]) => [t0, withKaraoke(fn)]) });
})();
