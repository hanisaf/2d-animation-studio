// Scene 67: "Everybody Wins", the finale of the Pokemon series: an epic music video. The brothers' "You shall see!" was a
// Grand Tournament in a night stadium. Eight trainers walk out (the four kids plus Jester Fester, Princess Pearl, Neptune
// and Dragon), each with a Pokemon; four duels on the beat, a bridge where every Pokemon charges up, a huge eight-way
// clash on the drop, and nobody faints: it's a tie. Professor Safadi and Doctor Sami hand out a trophy to every trainer:
// EVERYBODY WINS! A group photo, fireworks, THE END.
// The cut follows the recording (audio.mp3, generated with Gemini from SONG.md): the beat grid (EW_BPM, EW_BEAT0) and the
// line and word times in lyrics.js come from the song, and S below holds the section starts read from them.
// Every shot is a pure function of t.
(() => {
  // ---------- the song map ----------
  const SONG = { bpm: EW_BPM, beat0: EW_BEAT0 };
  const BEAT = 60 / SONG.bpm, BAR = 4 * BEAT;
  const lineAt = re => EW_LYRICS.find(l => re.test(l[1]));                                     // a lyric row by its words
  // section starts (seconds into audio.mp3), from lyrics.js and the bar grid
  const S = { intro: 0, booth: 6.8, enter: 15.9, reveal: 30.54, b1: 43.08, b2: 56.3, b3: 68.8, b4: 86.8, bridge: 93.0, ring: 99.6, splits: 107.0,
    awe: 110.1, build: 114.7, drop: 117.24, tie: 125.38, stand: 129.08, final: 132.6, wins: 136.5, trophy: 138.6, names: 161.9, outro: 172.0, end: 180.95 };
  const ENTER = ['Housam and', 'Alma and', 'Jenna and', 'Danny and', 'Jester Fester', 'Princess Pearl and', 'Neptune and', 'Dragon and'].map(w => lineAt(new RegExp('^' + w))[2][0]);
  const COUNT = ['Three', 'Two', 'One'].map(w => lineAt(new RegExp('^' + w + '!'))[2][0]);
  const NAMES_AT = [...lineAt(/^\(Housam wins/)[2].filter((_, i) => i % 2 === 0), ...lineAt(/^\(Jester wins/)[2].filter((_, i) => i % 2 === 0)];
  const PHOTO = lineAt(/^\(Click/)[2][0], FW = lineAt(/^You see/)[2][0], FIN = lineAt(/^The end/)[2][0], TROPHY_DUR = (S.names - S.trophy) / 8;
  // who is singing now: a lyric row whose `who` includes n, while it is sung
  const whoHas = (w, n) => Array.isArray(w) ? w.includes(n) : w === n;
  const singing = (n, t) => EW_LYRICS.some(l => whoHas(l[0], n) && t >= l[2][0] - .05 && t <= l[3]);
  const pulse = t => { const ph = ((((t - SONG.beat0) / BEAT) % 1) + 1) % 1; return Math.exp(-ph * 6); };   // 1 on each beat, decaying
  const barAt = (t, t0) => Math.floor((t - t0) / BAR);

  // ---------- the trainers and their Pokemon ----------
  const T = [
    { n: 'housam', mon: 'dragon', name: 'HOUSAM' }, { n: 'alma', mon: 'fin', name: 'ALMA' },
    { n: 'jenna', mon: 'sprout', name: 'JENNA' }, { n: 'danny', mon: 'star', name: 'DANNY' },
    { n: 'jester_fester', mon: 'bellbop', name: 'JESTER FESTER' }, { n: 'princess_pearl', mon: 'coralia', name: 'PRINCESS PEARL' },
    { n: 'neptune', mon: 'shelldon', name: 'NEPTUNE' }, { n: 'dragon', mon: 'puffling', name: 'DRAGON' },
  ];
  const MON = Object.fromEntries(T.map(x => [x.n, x.mon]));
  const NAMEOF = Object.fromEntries(T.map(x => [x.n, x.name]));
  const HGT = { housam: 168, alma: 120, jenna: 135, danny: 122, jester_fester: 170, princess_pearl: 180, neptune: 190, dragon: 170, safadi: 177, sami: 177 };
  const UNIT = { housam: HOUSAM_UNIT, alma: ALMA_UNIT, jenna: JENNA_UNIT, danny: DANNY_UNIT, jester_fester: JF_UNIT, princess_pearl: PP_UNIT, neptune: NT_UNIT, dragon: DRAGON_UNIT, safadi: SAFADI_UNIT, sami: SAMI_UNIT };
  const HOLD = { housam: { up: -24, side: 5.2 }, alma: { up: -15, side: 5.2 }, jenna: { up: -19, side: 6 }, danny: { up: -20, side: 6 } };
  const PAIRS = { b1: ['alma', 'princess_pearl'], b2: ['housam', 'neptune'], b3: ['jenna', 'jester_fester'], b4: ['danny', 'dragon'] };

  // ---------- a trainer, any of the eight (or a brother), with a mood ----------
  // (x, y) floor point on screen, k px per world unit, mood: idle | cmd | cheer | trophy | sing | wave | photo. o.dir: which way they face (+1 right).
  function trainer(n, x, y, k, t, mood = 'idle', o = {}) {
    const s = UNIT[n] * k, dir = o.dir ?? 1, talk = o.sing !== false && singing(n, t);
    const cheerJ = Math.abs(Math.sin(t * 7 + n.length)), bob = .25 * pulse(t);
    let A;
    if (HOLD[n] || n === 'jester_fester' || n === 'safadi' || n === 'sami') {
      const H0 = HOLD[n] ?? { up: n === 'jester_fester' ? -23 : -21, side: n === 'jester_fester' ? 5.5 : 5.6 }, girl = n === 'alma' || n === 'jenna';
      const op = { t, giraffe: false, mouth: talk ? lipFlap(t, true, 'grin') : 'smile', eyes: 'open', brows: 'up', turn: dir * .2, dy: -bob, lookX: dir * .25, lookY: 0 };
      if (mood === 'cmd') Object.assign(op, dir > 0 ? { handR: [H0.side * 1.25, H0.up + 3], handPoseR: n === 'jester_fester' ? 'open' : 'point' } : { handL: [-H0.side * 1.25, H0.up + 3], handPoseL: n === 'jester_fester' ? 'open' : 'point' },
        { brows: n === 'alma' ? 'angry' : n === 'jester_fester' ? 'angry' : 'focused', mouth: talk ? lipFlap(t, true, girl ? 'O' : 'open') : 'grin', lean: .05 * dir, jump: .4 * pulse(t) });
      if (mood === 'cheer' || mood === 'trophy' || mood === 'photo') Object.assign(op, { handL: [-H0.side * (mood === 'trophy' ? .45 : 1), H0.up - (mood === 'trophy' ? 9 : 0)], handR: [H0.side * (mood === 'trophy' ? .45 : 1), H0.up - (mood === 'trophy' ? 9 : 0)],
        handPoseL: 'fist', handPoseR: 'fist', eyes: girl || n === 'jester_fester' ? 'star' : 'happy', mouth: talk ? lipFlap(t, true, girl ? 'O' : 'open') : 'grin', jump: mood === 'photo' ? 0 : .9 * cheerJ, lookX: 0 });
      if (mood === 'photo') Object.assign(op, { eyes: 'happy', jump: 0 });
      if (mood === 'trophy') Object.assign(op, { handR: [H0.side * 1.2, H0.up], handL: [-H0.side, H0.up + 2] });   // the trophy up beside the head, the other fist pumping
      if (mood === 'wave') Object.assign(op, { handR: [H0.side * 1.1, H0.up - 1 + Math.sin(t * 12)], handPoseR: 'open', eyes: 'happy', mouth: 'grin', lookX: 0 });
      if (n === 'safadi' || n === 'sami') { delete op.giraffe; if (o.power) op.power = o.power; if (o.extra) Object.assign(op, o.extra); }
      A = { jester_fester: jester, housam, alma, jenna, danny, safadi, sami }[n](x, y, s, op);
      if (mood === 'trophy') PG.trophy(A.handR[0] + .6 * s, A.handR[1] + 1.2 * s, 7 * s, t, { shine: true, rot: .12 });
    } else if (n === 'princess_pearl' || n === 'neptune') {
      const op = { t, sit: 1, flip: dir < 0, eyes: mood === 'cheer' || mood === 'trophy' ? 'sparkle' : 'open', mouth: talk ? lipFlap(t, true, n === 'neptune' ? 'grin' : 'smile') : 'smile', wag: Math.sin(t * 6) * .5, dy: -bob * 2, headTilt: mood === 'trophy' ? .25 : .05 };
      if (mood === 'cmd') Object.assign(op, { point: 1, pointAng: -.35, eyes: n === 'neptune' ? 'glow' : 'angry', brows: 'angry', ...(n === 'neptune' ? { trident: true, tridentAng: -1.0, power: .6 } : {}) });
      if (mood === 'cheer') Object.assign(op, { flipNear: Math.sin(t * 10) * .8, flipFar: -Math.sin(t * 10) * .8, jump: undefined, dy: -1.2 * cheerJ, ...(n === 'neptune' ? { flex: 1 } : {}) });
      if (mood === 'photo') Object.assign(op, { eyes: 'happy', flipNear: .4 });
      if (mood === 'wave') Object.assign(op, { flipNear: Math.sin(t * 10) * .9, eyes: 'happy' });
      if (n === 'neptune' && mood !== 'cmd') op.trident = false;
      A = (n === 'neptune' ? neptune : pearl)(x, y, s, op);
      if (mood === 'trophy' || mood === 'photo') PG.trophy(A.nose[0] + dir * .5 * s, A.nose[1] - .6 * s, 2.4 * s * (n === 'neptune' ? 1 : 1.05), t, { shine: true, rot: .1 * Math.sin(t * 3) });   // balanced on the nose
    } else if (n === 'dragon') {
      const op = { t, flip: dir < 0, wings: mood === 'idle' ? .4 : 1, flap: Math.sin(t * 8), mouth: talk ? (Math.sin(t * 18) > 0 ? 'open' : 'grin') : 'smile', eyes: mood === 'cheer' || mood === 'trophy' ? 'happy' : 'open', lookX: dir * .3, jump: -bob * 0 };
      if (mood === 'cmd') Object.assign(op, { mouth: 'open', lean: .1 * dir, brows: 'up' });
      if (mood === 'cheer' || mood === 'trophy') Object.assign(op, { jump: 2.5 * cheerJ, mouth: 'grin', fly: .3 });
      if (mood === 'photo') Object.assign(op, { eyes: 'happy', mouth: 'grin' });
      A = dragon(x, y, s, op);
      if (mood === 'trophy' || mood === 'photo') PG.trophy(A.top[0], A.top[1] + .3 * s, 3.2 * s, t, { shine: true });
    }
    return A;
  }

  // ---------- stadium plates ----------
  const booth = t => t >= S.trophy ? null : (x, y) => { const sp = speakingBooth(t);
    trainer('sami', x - 60, y + 62, .8, t, 'idle', { sing: false, extra: { mouth: sp === 'sami' || sp === 'both' ? lipFlap(t, true, 'grin') : 'smile', handR: [5.3, -14 + Math.sin(t * 4)], handPoseR: 'palm', lookX: .3 } });
    trainer('safadi', x + 60, y + 62, .8, t, 'idle', { sing: false, extra: { mouth: sp === 'safadi' || sp === 'both' ? lipFlap(t, true, 'grin') : 'smile', handL: [-5.3, -14 + Math.sin(t * 4 + 1)], handPoseL: 'palm', lookX: -.3 } }); };
  const speakingBooth = t => (singing('sami', t) && !singing('safadi', t) ? 'sami' : singing('safadi', t) && !singing('sami', t) ? 'safadi' : singing('safadi', t) ? 'both' : null);
  const inW = (t, a, b) => t > a && t < b;
  const jumbo = txt => t => { X.fillStyle = '#141A3A'; X.fillRect(0, 0, 560, 210);
    for (let i = 0; i < 20; i++) circle(hash(i) * 560, hash(i + 5) * 210, 2 + 3 * hash(i + 2), { fill: 'rgba(255,255,255,.25)', stroke: null });
    const lines = txt.split('\n'); lines.forEach((l, i) => PK.text(l, 280, 105 + (i - (lines.length - 1) / 2) * 70, lines.length > 1 ? 56 : 72, ['#FFD95A', '#FFFFFF', '#FF7FB0'][i % 3], { font: FONT_SFX, weight: 400 })); };
  const SCREEN = t => t < S.b1 ? null : t < S.drop ? jumbo('BATTLE!') : t < S.stand ? jumbo('RESULT:\n???') : t < S.wins ? jumbo('ALL 8\nSTILL STANDING!') : jumbo('EVERYBODY\nWINS!');
  function stadium(t, cx, cy, zoom, o = {}) {
    camBegin(cx, cy, zoom, o.rot ?? 0);
    PG.stadium(t, { beat: pulse(t), mood: o.mood ?? (t > S.final ? ease(seg(t, S.final, S.final + 4)) : 0), screen: SCREEN(t), booth: o.noBooth ? null : booth(t), cheer: o.cheer ?? 1 });
    if (o.inside) o.inside();
    camEnd();
  }
  const soft = (t, cx, cy, zoom, blur = 6, dark = .35, o) => { layer(() => stadium(t, cx, cy, zoom, o), { blur }); X.fillStyle = `rgba(16,10,40,${dark})`; X.fillRect(0, 0, W, H); };
  const drift = t => [10 * Math.sin(t * .31), 6 * Math.sin(t * .23)];

  // a caption in the lower third
  function nameplate(txt, sub, t, t0, col = '#E0533A') {
    const a = t - t0; if (a < 0) return; const k = backOut(seg(a, 0, .35));
    overlay(() => { X.save(); X.translate(120 + 320 * k - 320, H - 200); X.globalAlpha *= clamp(a * 4);
      shape(rectPts(0, -60, 660, 120), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 6, smooth: .15 }); shape(rectPts(0, -60, 22, 120), { fill: col, stroke: null });
      PK.text(txt, 50, -14, txt.length > 12 ? 50 : 60, col, { font: FONT_SFX, weight: 400, align: 'left', outline: 6, outlineCol: PAL.ink });
      PK.text(sub, 52, 36, 32, PAL.ink, { weight: 800, align: 'left' }); X.restore(); });
  }

  // ---------- 1 · intro: down from the stars into the stadium; the commentators ----------
  function intro(t) {
    const u = ease(seg(t, 0, 6.5));
    stadium(t, 960, lerp(-250, 560, u), lerp(1.5, 1, u));
    for (const [x, y, a, c] of [[500, 160, 1.2, '#FF7FB0'], [1450, 120, 2.0, '#7FD3FF'], [960, 80, 2.8, '#FFD95A'], [300, 220, 4.6, '#9AE07A'], [1650, 240, 5.2, '#C9A8FF']]) PG.firework(x, y + (1 - u) * 400, t, a, c);
    const k = PG.pop(t, 3.4, .5);
    if (k > 0) { X.save(); X.translate(W / 2, H * .6 + (1 - u) * 80); X.scale(k, k); X.rotate(-.03 + .01 * Math.sin(t * 2));
      PK.text('POKEMON', 0, -80, 140, '#FFD95A', { font: FONT_SFX, weight: 400, outline: 22 }); PK.text('GRAND TOURNAMENT', 0, 60, 110, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 18 }); X.restore(); }
  }
  // the booth, up close: the brothers at their microphones
  function boothCU(t, mood = 'talk') {
    soft(t, 330, 470, 3.2, 5, .2, { noBooth: true });
    const sp = speakingBooth(t), k = 3.2, yF = 900;
    const both = { idle: {}, awe: { eyes: 'wide', mouth: 'O', brows: 'up', handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'open', handPoseR: 'open' },
      stand: { eyes: 'happy', mouth: 'grin', brows: 'up', handL: [-6.2, -20], handR: [6.2, -20], handPoseL: 'palm', handPoseR: 'palm' } }[mood] ?? {};
    trainer('sami', W * .33, yF, k, t, 'idle', { sing: false, extra: { mouth: sp === 'sami' || sp === 'both' ? lipFlap(t, true, 'grin') : 'smile', handR: [5.3, -13.6 + Math.sin(t * 4)], handPoseR: 'palm', lookX: .3, ...both } });
    trainer('safadi', W * .67, yF, k, t, 'idle', { sing: false, extra: { mouth: sp === 'safadi' || sp === 'both' ? lipFlap(t, true, 'grin') : 'smile', handL: [-5.3, -13.6 + Math.sin(t * 4 + 1)], handPoseL: 'palm', lookX: -.3, ...both }, power: mood === 'stand' ? .5 : 0 });
    // the desk and the microphones
    shape(rectPts(-20, H - 230, W + 40, 260), { fill: '#3A2E5E', stroke: PAL.ink, lwPx: 6 }); shape(rectPts(-20, H - 230, W + 40, 34), { fill: '#5A4A8A', stroke: PAL.ink, lwPx: 6 });
    PK.text('COMMENTARY', W / 2, H - 110, 70, '#FFD95A', { font: FONT_SFX, weight: 400, outline: 8 });
    for (const x of [W * .33 + 120, W * .67 - 120]) { line([[x, H - 230], [x, H - 360]], { stroke: '#2A2D33', lwPx: 10 }); shape(ellPts(x, H - 380, 30, 40), { fill: '#3A3F5A', stroke: PAL.ink, lwPx: 5, smooth: true }); }
  }

  // ---------- 2 · the entrances: one trainer per bar into a spotlight; their Pokemon pops out of a card ----------
  function entrance(t) {
    let i = 0; ENTER.forEach((e, j) => { if (t >= e - .35) i = j; }); const tr = T[i], t0 = ENTER[i] - .35, a = t - t0;
    const [dx, dy] = drift(t); soft(t, 960 + dx + (i % 2 ? 120 : -120), 640 + dy, 1.5, 3, .55);
    // the spotlight
    X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,250,220,.05)'); g.addColorStop(1, 'rgba(255,250,220,.45)');
    X.fillStyle = g; X.beginPath(); X.moveTo(700, -40); X.lineTo(860, -40); X.lineTo(1080, H); X.lineTo(420, H); X.fill(); X.restore();
    shape(ellPts(750, H - 60, 330, 60), { fill: 'rgba(255,250,220,.35)', stroke: null, smooth: true });
    // the trainer runs in from the side, then poses
    const run = ease(seg(a, 0, .35)), kk = 720 / HGT[tr.n] * (tr.n === 'jenna' || tr.n === 'alma' || tr.n === 'danny' ? .85 : 1);
    trainer(tr.n, lerp(-300, 750, run), H - 50, kk, t, a > .5 ? 'cheer' : 'idle', { dir: 1 });
    // the card toss and the Pokemon
    const ck = seg(a, .35, .8);
    if (ck > 0 && ck < 1) { const x = lerp(900, 1300, ck), y = lerp(H * .6, H * .4, ck) - 180 * Math.sin(ck * Math.PI); DK.card(x, y, 110, ck * 12, { back: true, t }); }
    const mk = PG.pop(t, t0 + .8, .4);
    if (mk > 0) { if (a < 1.1) { X.fillStyle = `rgba(255,255,255,${.6 * (1 - seg(a, .8, 1.1))})`; X.fillRect(0, 0, W, H); }
      PG.aura(tr.mon, 1360, H * .48, 380, .8 * mk); PG.creature(tr.mon, 1360, H * .48, 13 * mk, t, { flip: true, glow: .6 }); }
    nameplate(tr.name, `& ${PG.NAME[tr.mon]}`, t, t0 + .4, ['#E0533A', '#994EC4', '#D0508E', '#2E7D9A', '#C8303E', '#E77FB6', '#2C7FA8', '#3FA24A'][i]);
  }

  // ---------- 3 · the line-up: all eight trainers, and their Pokemon behind them ----------
  function lineup(t, mood = 'idle', o = {}) {
    const u = ease(seg(t, o.from ?? S.reveal, (o.from ?? S.reveal) + 7.5)), [dx, dy] = drift(t);
    const order = o.order ?? ['jenna', 'danny', 'alma', 'housam', 'jester_fester', 'princess_pearl', 'neptune', 'dragon'], n = order.length;
    stadium(t, 960 + dx, lerp(620, 700, u) + dy, lerp(1.0, o.zoom ?? 1.12, u), { inside: () => {
      order.forEach((nm, i) => { const x = 160 + i * (1600 / (n - 1)), at = (o.from ?? S.reveal) + .2 + i * BEAT * 2 * (o.fast ? .25 : 1), k = PG.pop(t, at, .4);
        if (MON[nm] && k > 0) { PG.aura(MON[nm], x, 680, 170, .5 * k); PG.creature(MON[nm], x, 680 - (MON[nm] === 'puffling' || MON[nm] === 'coralia' ? 20 : 0), 5 * k, t, { flip: x > 960 }); } });
      order.forEach((nm, i) => { const x = 160 + i * (1600 / (n - 1)), k = nm === 'safadi' || nm === 'sami' ? 1.55 : HGT[nm] < 140 ? 1.65 : 1.35;
        trainer(nm, x, 1010, k, t, typeof mood === 'function' ? mood(nm, i) : mood, { dir: x > 960 ? -1 : 1 }); });
      if (o.inside) o.inside();
    } });
  }

  // ---------- 4 · the battles ----------
  // in the arena: both trainers in their boxes, both Pokemon on the field, trading attacks one bar at a time
  function fieldBattle(t, key, o = {}) {
    const [l, r] = PAIRS[key], t0 = S[key], [dx, dy] = drift(t), b = barAt(t, t0), p = ((t - t0) / BAR) % 1;
    const atkLeft = b % 2 === 0, L = MON[l], R = MON[r];
    stadium(t, 960 + dx, 640 + dy + (o.cy ?? 0), o.zoom ?? 1.05, { inside: () => {
      const lx = 720, rx = 1200, y = 790, sc = 9 * PG.depthK(y);
      const trav = seg(p, .25, .6), hitk = seg(p, .6, 1), enter = PG.pop(t, t0 + .1, .45);
      for (const [x, kind, isL] of [[lx, L, true], [rx, R, false]]) { const me = isL === atkLeft, lunge = me ? Math.sin(clamp(seg(p, .2, .55)) * Math.PI) : 0;
        let cx = x + (isL ? 1 : -1) * 40 * lunge; if (me && kind === 'shelldon') cx = lerp(x, isL ? rx - 80 : lx + 80, Math.sin(clamp(trav) * Math.PI));
        if (me) PG.aura(kind, cx, y - 20, 220, .6 * (1 - hitk));
        PG.creature(kind, cx, y - (kind === 'puffling' || kind === 'coralia' ? 25 : 0), sc * enter, t, { flip: !isL, hit: !me && hitk > 0 && hitk < .5 ? 1 - hitk * 2 : 0, rot: me && kind === 'shelldon' && trav > 0 && trav < 1 ? trav * 12 * (isL ? 1 : -1) : 0 }); }
      const atk = atkLeft ? L : R; PG.fx(atk, atkLeft ? lx + 60 : rx - 60, y - 30, atkLeft ? rx : lx, y - 30, trav, t, sc);
      PG.impact(atk, atkLeft ? rx : lx, y - 30, hitk, t, sc);
      trainer(l, 300, 965, 2.1 * (HGT[l] < 140 ? 1.2 : 1), t, atkLeft && p < .7 ? 'cmd' : 'idle', { dir: 1 });
      trainer(r, 1620, 965, 2.1 * (HGT[r] < 140 ? 1.2 : 1), t, !atkLeft && p < .7 ? 'cmd' : 'idle', { dir: -1 });
    } });
    if (p > .25 && p < .55) PG.stamp(PG.MOVE[atkLeft ? L : R] + '!', W / 2, H * .14, 86, '#FFFFFF', PG.pop(t, t0 + b * BAR + .25 * BAR, .25), -.04);
  }
  // the duel close-up over the soft stadium
  const hpOf = (t, t0, side) => .95 - .5 * ease(seg(t, t0, t0 + BAR * 8)) - .05 * side;
  function duelShot(t, L, R, t0, bar = BAR, o = {}) {
    const [dx, dy] = drift(t); soft(t, 960 + dx, 700 + dy, 1.9, 7, .3);
    PG.duel(t, t0, bar, L, R, { hpL: tt => hpOf(tt, t0, 0), hpR: tt => hpOf(tt, t0, 1), ...o });
  }
  const duel = key => t => duelShot(t, MON[PAIRS[key][0]], MON[PAIRS[key][1]], S[key]);
  // a trainer close-up: commanding, with their Pokemon charging beside them
  function trainerCU(t, n, mood = 'cmd', o = {}) {
    const dir = o.dir ?? 1, [dx, dy] = drift(t); soft(t, (dir > 0 ? 400 : 1520) + dx, 760 + dy, 2.6, 6, .35);
    const mon = MON[n], mx = dir > 0 ? W * .74 : W * .26, kk = 700 / HGT[n];
    if (mon && o.mon !== false) { PG.aura(mon, mx, H * .5, 420, .7 + .3 * pulse(t)); PG.creature(mon, mx, H * .5, 11, t, { flip: dir < 0, glow: .8 }); }
    trainer(n, dir > 0 ? W * .34 : W * .66, H - 30, kk, t, mood, { dir });
    if (mood === 'cmd' && mon) PG.stamp(`${PG.NAME[mon].toUpperCase()}, GO!`, o.mon === false ? (dir > 0 ? W * .34 : W * .66) : W / 2, H * .12, 80, '#FFFFFF', PG.pop(t, o.t0 ?? t - 1, .3), -.05);
  }
  // split screen: two or four trainer close-ups side by side
  function split(t, cells) {
    const rows = cells.length > 2 ? 2 : 1, cols = 2, w = W / cols, h = H / rows, k = rows > 1 ? .5 : 1;
    cells.forEach(([nm, mood, dir], i) => { const cx = (i % cols) * w, cy = Math.floor(i / cols) * h, trX = dir > 0 ? W * .34 : W * .66;
      X.save(); X.beginPath(); X.rect(cx, cy, w, h); X.clip(); X.translate(cx + w / 2 - trX * k, cy); X.scale(k, k);
      trainerCU(t, nm, mood, { dir, mon: false }); X.restore(); });
    line([[w, 0], [w, H]], { stroke: PAL.ink, lwPx: 10 });
    if (rows > 1) line([[0, h], [W, h]], { stroke: PAL.ink, lwPx: 10 });
  }

  // ---------- 5 · the bridge ----------
  function pearlSolo(t) {
    soft(t, 1400, 760, 2.2, 6, .5);
    X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createRadialGradient(W * .45, H * .5, 40, W * .45, H * .5, 700); g.addColorStop(0, 'rgba(255,190,230,.55)'); g.addColorStop(1, 'rgba(255,190,230,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H); X.restore();
    for (let i = 0; i < 16; i++) { const a = t * .7 + i * .4, r = 380 + 60 * Math.sin(t + i); shape(starPts(W * .45 + Math.cos(a) * r, H * .5 + Math.sin(a) * r * .7, 14 + 6 * Math.sin(t * 4 + i), .35, 4, t * 2), { fill: '#FFFFFF', stroke: null, alpha: .8 }); }
    PG.creature('coralia', W * .78, H * .38 + 20 * Math.sin(t * 1.5), 10, t, { flip: true, glow: 1 });
    pearl(W * .45, H - 40, 40, { t, sit: 1, eyes: Math.sin(t * .9) > .3 ? 'closed' : 'sparkle', mouth: Math.sin(t * 9) > -.2 ? 'open' : 'o', headTilt: .3 + .05 * Math.sin(t * 2), flipNear: .6 + .2 * Math.sin(t * 1.4), wag: Math.sin(t * 2) * .3 });
  }
  function ring(t) {                                                    // all eight Pokemon around the field, charging
    const [dx, dy] = drift(t), u = seg(t, S.ring, S.splits);
    stadium(t, 960 + dx + lerp(-160, 160, u), 700 + dy, 1.25, { inside: () => {
      const mons = T.map(x => x.mon), cy = 800;
      mons.map((m, i) => { const a = i / 8 * TAU + t * .25, x = 960 + Math.cos(a) * 560, y = cy + Math.sin(a) * 140; return { m, x, y, a }; })
        .sort((p, q) => p.y - q.y).forEach(({ m, x, y }) => { const sc = 8 * PG.depthK(y), ch = .5 + .5 * u;
          PG.aura(m, x, y - 30, 260 * ch, .8 * ch); PG.creature(m, x, y - 30, sc, t, { flip: x > 960, glow: ch, sq: .04 * Math.sin(t * 12) }); });
    } });
    PG.stamp('POWER UP!', W / 2, H * .13, 100, '#FFD95A', PG.pop(t, S.ring + .2, .4), -.04);
  }
  // ---------- 6 · the build: eight beams into one orb; 3, 2, 1 ----------
  function build(t) {
    const a = t - S.build, LEN = S.drop - S.build, [dx, dy] = drift(t), sh = 8 * seg(a, 0, LEN);
    const [sx, sy] = shakeXY(t, sh);
    stadium(t, 960 + dx + sx, 660 + dy + sy, 1.05 + .08 * seg(a, 0, LEN), { inside: () => {
      const cy = 790, orbY = 640, r = 40 + 200 * ease(seg(a, 0, LEN));
      T.map((x, i) => { const ang = i / 8 * TAU, px = 960 + Math.cos(ang) * 620, py = cy + Math.sin(ang) * 150; return { m: x.mon, px, py }; })
        .sort((p, q) => p.py - q.py).forEach(({ m, px, py }) => { const sc = 8 * PG.depthK(py);
          if (a > .15) { X.save(); X.globalCompositeOperation = 'lighter'; X.strokeStyle = `rgba(${PG.GLOW[m]},.85)`; X.lineWidth = 20 + 10 * pulse(t); X.lineCap = 'round'; X.beginPath(); X.moveTo(px, py - 40); X.lineTo(960, orbY); X.stroke(); X.restore(); }
          PG.creature(m, px, py - 30, sc, t, { flip: px > 960, glow: 1 }); });
      const g = X.createRadialGradient(960, orbY, 10, 960, orbY, r * 1.8); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.4, 'rgba(255,240,200,.9)'); g.addColorStop(1, 'rgba(255,200,255,0)');
      X.fillStyle = g; X.beginPath(); X.arc(960, orbY, r * 1.8, 0, TAU); X.fill();
    } });
    [3, 2, 1].forEach((n, i) => { const at = COUNT[i]; if (inW(t, at, COUNT[i + 1] ?? S.drop)) PG.stamp(String(n), W / 2, H * .45, 300, '#FFFFFF', PG.pop(t, at, .25), 0, .1); });
    const wh = seg(t, S.drop - .2, S.drop); if (wh > 0) { X.fillStyle = `rgba(255,255,255,${wh})`; X.fillRect(0, 0, W, H); }
  }
  // ---------- 7 · the drop: an eight-way melee, a cut on every half bar ----------
  const DROP_PAIRS = [['fin', 'dragon'], ['sprout', 'coralia'], ['star', 'shelldon'], ['bellbop', 'puffling'], ['dragon', 'coralia'], ['fin', 'bellbop'], ['shelldon', 'sprout'], ['puffling', 'star']];
  function drop(t) {
    const half = BAR / 2, i = Math.floor((t - S.drop) / half), [L, R] = DROP_PAIRS[i % 8], t0 = S.drop + i * half;
    if (i % 8 === 7) return lineup(t, (nm, j) => (j % 2 ? 'cmd' : 'cheer'), { from: t0 - 6, zoom: 1.0 });
    const [sx, sy] = shakeXY(t, 14 * Math.exp(-(t - t0) * 3));
    X.save(); X.translate(sx, sy);
    duelShot(t, L, R, t0, half, { both: i % 4 === 3, start: i % 2 });
    X.restore();
    if (t - t0 < .08) { X.fillStyle = 'rgba(255,255,255,.6)'; X.fillRect(0, 0, W, H); }
    if (i === 0) { const wh = 1 - seg(t, S.drop, S.drop + .5); X.fillStyle = `rgba(255,255,255,${wh})`; X.fillRect(0, 0, W, H); }
  }
  // ---------- 8 · the tie: the smoke clears, everybody is still standing ----------
  function tie(t) {
    const a = t - S.tie;
    if (t < S.stand - .3) {
      stadium(t, 960, 650, 1.08, { cheer: .2, inside: () => {
        T.forEach((x, i) => { const px = 220 + i * 211, py = 800 + (i % 2) * 40, sc = 8 * PG.depthK(py); PG.creature(x.mon, px, py - 30, sc, t, { flip: px > 960, sq: .05 * Math.sin(t * 6 + i) }); });
        for (let i = 0; i < 30; i++) circle(hash(i) * 1920, 700 + hash(i + 4) * 260, (120 + 160 * hash(i + 8)) * (1 + a * .2), { fill: `rgba(230,230,240,${.5 * (1 - seg(t, S.tie, S.stand))})`, stroke: null });
      } });
      PG.stamp('...A TIE?!', W / 2, H * .15, 110, '#FFFFFF', PG.pop(t, lineAt(/^Who won/)[2][0] + .5, .4), -.04);
      return;
    }
    boothCU(t, t > S.stand + 1.2 ? 'stand' : 'awe');
  }
  // ---------- 9 · the finale: a trophy for every trainer ----------
  function finaleWide(t) {
    lineup(t, t > S.wins ? 'cheer' : 'idle', { from: S.final - 7.4, zoom: 1.0, inside: () => { for (const x of [180, 1740]) for (let k = 0; k < 2; k++) PG.firework(x + k * 200 * (x > 960 ? -1 : 1), 220 + k * 60, t, S.wins - .5 + k * .9, ['#FF7FB0', '#7FD3FF'][k]); } });
    PG.confetti(t, S.wins, 200);
    PG.stamp('EVERYBODY WINS!', W / 2, H * .3, 150, '#FFD95A', PG.pop(t, S.wins, .5), -.04);
  }
  function trophyCU(t) {
    const i = clamp(Math.floor((t - S.trophy) / TROPHY_DUR), 0, 7), tr = T[i], t0 = S.trophy + i * TROPHY_DUR, a = t - t0;
    const dir = i % 2 ? -1 : 1; soft(t, dir > 0 ? 500 : 1420, 760, 2.4, 6, .3, { mood: 1 });
    const kk = 640 / HGT[tr.n] * (HGT[tr.n] < 140 ? .95 : 1), x = dir > 0 ? W * .4 : W * .6;
    // the trophy comes down on a beam of light
    const land = .45 * BAR, got = a > land;
    if (!got) { const y = lerp(-200, H * .3, easeOut(seg(a, 0, land)));
      X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,240,170,.35)'; X.fillRect(x - 140, 0, 280, H); X.restore(); PG.trophy(x, y + 120, 240, t, { shine: true }); }
    if (a > land && a < land + .25) { X.fillStyle = `rgba(255,255,255,${.6 * (1 - (a - land) / .25)})`; X.fillRect(0, 0, W, H); }
    PG.creature(tr.mon, dir > 0 ? W * .78 : W * .22, H * .45 + 40 * Math.abs(Math.sin(t * 6)), 9, t, { flip: dir > 0, glow: .5 });
    trainer(tr.n, x, H - 30, kk, t, got ? 'trophy' : 'idle', { dir });
    PG.confetti(t, t0 + land, 90);
    nameplate(`${tr.name} WINS!`, `& ${PG.NAME[tr.mon]}`, t, t0 + land, ['#E0533A', '#994EC4', '#D0508E', '#2E7D9A', '#C8303E', '#E77FB6', '#2C7FA8', '#3FA24A'][i]);
  }
  function allTrophies(t) {
    const order = ['jenna', 'danny', 'alma', 'housam', 'safadi', 'sami', 'jester_fester', 'princess_pearl', 'neptune', 'dragon'];
    lineup(t, 'trophy', { from: S.names - 7.4, zoom: 1.02, order, inside: () => {
      // each trainer lights up as the crowd chants their name
      T.forEach((tr, i) => { const at = NAMES_AT[i], a = t - at; if (a < 0 || a > 1.1) return; const x = 160 + order.indexOf(tr.n) * (1600 / 9), k = backOut(seg(a, 0, .25)) * (1 - seg(a, .8, 1.1));
        X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createRadialGradient(x, 880, 10, x, 880, 220); g.addColorStop(0, `rgba(255,240,170,${.8 * k})`); g.addColorStop(1, 'rgba(255,240,170,0)'); X.fillStyle = g; X.fillRect(x - 220, 660, 440, 440); X.restore();
        PG.stamp('WINS!', x, 640, 54, '#FFD95A', k, -.08); });
    } });
    PG.confetti(t, S.names - 2, 220);
    const ew = EW_LYRICS.filter(l => l[1] === 'Everybody wins!').pop()[2][0];
    PG.stamp('EVERYBODY WINS!', W / 2, H * .2, 120, '#FFD95A', PG.pop(t, ew, .4) * (t < ew ? 0 : 1), -.04);
  }
  // ---------- 10 · the outro: the group photo, fireworks, THE END ----------
  function outro(t) {
    const order = ['jenna', 'danny', 'alma', 'housam', 'safadi', 'sami', 'jester_fester', 'princess_pearl', 'neptune', 'dragon'];
    if (t < FW) {
      const tt = Math.min(t, PHOTO), frozen = t >= PHOTO, tilt = frozen ? ease(seg(t, PHOTO + .6, PHOTO + 1.6)) : 0;
      X.save();
      if (frozen) { X.fillStyle = '#1A1430'; X.fillRect(0, 0, W, H); PG.confetti(t, PHOTO, 120); X.translate(W / 2, H / 2); X.rotate(-.05 * tilt); X.scale(1 - .25 * tilt, 1 - .25 * tilt); X.translate(-W / 2, -H / 2);
        shape(rectPts(-40, -40, W + 80, H + 200), { fill: '#FFFDF4', stroke: PAL.ink, lwPx: 8 }); X.beginPath(); X.rect(0, 0, W, H); X.clip(); }
      lineup(tt, frozen || t > PHOTO - .9 ? 'photo' : 'wave', { from: S.outro - 7.4, zoom: 1.02, order });
      X.restore();
      if (frozen && tilt > .5) PK.text('THE GRAND TOURNAMENT · EVERYBODY WINS!', W / 2, H * .5 + (H / 2) * .75 + 40, 54, PAL.ink, { weight: 800 });
      const fl = seg(t, PHOTO, PHOTO + .4); if (fl > 0 && fl < 1) { X.fillStyle = `rgba(255,255,255,${1 - fl})`; X.fillRect(0, 0, W, H); }
      const say = lineAt(/^Say/)[2][0]; if (t > say && t < PHOTO) PG.stamp('SAY "WIN"!', W / 2, H * .14, 90, '#FFFFFF', PG.pop(t, say, .3), -.04);
      return;
    }
    // fireworks over the stadium, then THE END
    stadium(t, 960, 420, 1.0, { mood: 1 });
    for (let i = 0; i < 22; i++) PG.firework(150 + hash(i) * 1620, 340 + hash(i + 3) * 320, t, FW - .6 + i * .25, ['#FF7FB0', '#7FD3FF', '#FFD95A', '#9AE07A', '#C9A8FF'][i % 5], 200 + 100 * hash(i + 5));
    PG.stamp('EVERYBODY WINS!', W / 2, H * .72, 140, '#FFD95A', PG.pop(t, FW + .1, .5), -.03);
    if (t > FIN) { overlay(() => { const c = backOut(seg(t, FIN, FIN + .5)); X.save(); X.translate(W / 2, H * .45); X.scale(c, c);
      shape(rectPts(-360, -110, 720, 220), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 10, smooth: .12 });
      PK.text('THE END', 0, 10, 130, '#E0533A', { font: FONT_SFX, weight: 400, outline: 16, outlineCol: PAL.ink }); X.restore(); });
      iris(W / 2, H * .45, lerp(1600, 0, easeIn(seg(t, S.end - 2.2, S.end - .4)))); }
  }

  // ---------- karaoke: the line being sung, its words lighting up as they are sung ----------
  function karaoke(t) {
    const l = EW_LYRICS.find(r => t >= r[2][0] - .25 && t <= r[3] + .35); if (!l) return;
    const words = l[1].split(/\s+/), times = l[2], a = clamp(Math.min(t - (times[0] - .25), l[3] + .35 - t) / .2);
    overlay(() => {
      X.save(); X.globalAlpha *= a; X.font = `800 44px ${FONT_TALK}`; X.textBaseline = 'middle';
      const sp = X.measureText(' ').width, ws = words.map(w => X.measureText(w).width), total = ws.reduce((p, w) => p + w, 0) + sp * (words.length - 1);
      shape(rectPts(W / 2 - total / 2 - 36, H - 92, total + 72, 64), { fill: 'rgba(20,14,40,.62)', stroke: null, smooth: .5 });
      let x = W / 2 - total / 2, wi = 0;
      words.forEach((w, i) => { const hasLetters = /[A-Za-z0-9]/.test(w), at = hasLetters ? times[Math.min(wi, times.length - 1)] : -1; if (hasLetters) wi++;
        const lit = t >= at; X.lineJoin = 'round'; X.lineWidth = 8; X.strokeStyle = PAL.ink; X.strokeText(w, x, H - 60);
        X.fillStyle = lit ? '#FFD95A' : '#FFFFFF'; X.fillText(w, x, H - 60); x += ws[i] + sp; });
      X.restore(); });
  }

  // ---------- the cut, on the song ----------
  const K = fn => t => { fn(t); karaoke(t); };
  const cu = (n, dir, t0) => t => trainerCU(t, n, 'cmd', { dir, t0 });
  scene({ duration: S.end, fps: 24, bpm: SONG.bpm,
    shots: [
      // intro: the stars, the stadium, the commentators' welcome
      [S.intro, intro], [S.booth, boothCU],
      // the roll call, one trainer on each name; the line-up for the pre-chorus
      [S.enter, entrance], [S.reveal, t => lineup(t, 'idle')],
      // battle 1 · chorus 1: Alma vs Princess Pearl
      [S.b1, t => fieldBattle(t, 'b1')], [S.b1 + 2 * BAR, duel('b1')], [S.b1 + 4 * BAR, cu('alma', 1, S.b1 + 4 * BAR)], [S.b1 + 5 * BAR, cu('princess_pearl', -1, S.b1 + 5 * BAR)], [S.b1 + 6 * BAR, duel('b1')],
      // battle 2 · verse 2: Neptune sings, Housam raps
      [S.b2, cu('neptune', -1, S.b2)], [60.3, cu('housam', 1, 60.3)], [62.1, t => fieldBattle(t, 'b2')], [65.6, duel('b2')],
      // battle 3 · pre-chorus 2 and chorus 2: Jenna, then Jester Fester
      [S.b3, cu('jenna', 1, S.b3)], [74.6, cu('jester_fester', -1, 74.6)], [78.5, t => fieldBattle(t, 'b3')], [82.1, duel('b3')],
      // battle 4: Danny's Star Shower, Dragon's Puff Cloud, and a CLASH
      [S.b4, cu('danny', 1, S.b4)], [89.6, cu('dragon', -1, 89.6)], [91.6, t => duelShot(t, 'star', 'puffling', 91.6, BAR, { both: true })],
      // the bridge: Pearl's solo, power up, every card, the brothers
      [S.bridge, pearlSolo], [S.ring, ring],
      [S.splits, t => split(t, [['housam', 'cmd', 1], ['alma', 'cmd', -1], ['jenna', 'cmd', 1], ['danny', 'cmd', -1]])],
      [108.6, t => split(t, [['jester_fester', 'cmd', 1], ['princess_pearl', 'cmd', -1], ['neptune', 'cmd', 1], ['dragon', 'cmd', -1]])],
      [S.awe, t => boothCU(t, 'awe')],
      // three, two, one; the drop; the tie
      [S.build, build], [S.drop, drop], [S.tie, tie],
      // the final chorus: EVERYBODY WINS, a trophy for each trainer, the names
      [S.final, finaleWide], [S.trophy, trophyCU], [S.names, allTrophies],
      // the outro: the photo, fireworks, THE END
      [S.outro, outro],
    ].map(([t0, fn]) => [t0, K(fn)]) });
})();
