// scenes/pokemon/scene65_deck_builders/props.js: the Energy and Trainer cards of scene 65, the Professor Safadi and
// Doctor Sami cards (with the real rigs drawn in their art windows), and the full-frame inserts.
// The creature cards come from scene 64's props (PK, loaded through `uses`). Everything is namespaced DK.
// Every function is a pure function of its arguments.
//   DK.card(cx, cy, w, ang, o)        any card in screen space: o.kind is a creature (fin, dragon, sprout, star), an Energy
//                                     (fireE, waterE), a Trainer (stadium, tool, supporter, item) or a person (safadi, sami)
//   DK.floor(P, x, z, ang, o)         the same card lying flat on the floor of a perspective set
//   DK.pile(P, x, z, n, kinds, t)     a messy stack of n cards on the floor, the top one face up
//   DK.ins*(t, t0, …)                 the full-frame inserts; t0 is the insert's start time
//   DK.banner(txt, t, t0)             a "MEANWHILE…" caption in the top-left corner
const DK = (() => {
  const C = { ink: '#2B2233', silver: '#C9CED6', silverDk: '#8E96A3', silverLt: '#EEF1F5', face: '#FFF8E6', bar: '#D9CDB2',
    fire: '#E0533A', fireLt: '#FFB23A', water: '#3D86D8', waterLt: '#9FD4FF', chalk: '#FFFDF4', board: '#23433A', boardDk: '#183129', wood: '#9C6B3E' };
  const O = (lw = 1.2) => ({ stroke: C.ink, lwPx: lw });
  const text = (...a) => PK.text(...a);
  const CREATURE = { fin: 1, dragon: 1, sprout: 1, star: 1 };
  const TRAINER = {
    stadium: { tag: 'STADIUM', col: '#3FA24A', name: 'Lava Arena', line: 'Fire attacks do 30 more damage.' },
    tool: { tag: 'TOOL', col: '#3D86D8', name: 'Bubble Shield', line: 'Take 30 less damage from attacks.' },
    supporter: { tag: 'SUPPORTER', col: '#E0813A', name: 'Deck Coach', line: 'Draw 3 cards.' },
    item: { tag: 'ITEM', col: '#9A6BD8', name: 'Super Search', line: 'Find any Pokemon in your deck.' },
    safadi: { tag: 'SUPPORTER', col: '#C08A3E', name: 'Professor Safadi', line: 'He explains. You win.', power: true },
    sami: { tag: 'SUPPORTER', col: '#3E9A8C', name: 'Doctor Sami', line: 'Heal all your Pokemon.', power: true },
  };

  // the type symbols: a flame and a water drop, centred on (0, 0), radius r
  function symbol(type, x, y, r, t = 0) {
    circle(x, y, r, { fill: type === 'fire' ? C.fire : C.water, ...O(1) });
    if (type === 'fire') { const f = Math.sin(t * 5) * .06;
      shape([[x, y - r * (.72 + f)], [x + r * .5, y - r * .05], [x + r * .38, y + r * .5], [x, y + r * .62], [x - r * .38, y + r * .5], [x - r * .5, y], [x - r * .2, y - r * .25]], { fill: C.fireLt, stroke: null, smooth: true });
      shape([[x, y - r * .1], [x + r * .22, y + r * .3], [x, y + r * .48], [x - r * .22, y + r * .3]], { fill: '#FFF1A0', stroke: null, smooth: true });
    } else {
      shape([[x, y - r * .7], [x + r * .45, y + r * .1], [x + r * .38, y + r * .45], [x, y + r * .62], [x - r * .38, y + r * .45], [x - r * .45, y + r * .1]], { fill: '#FFFFFF', stroke: null, smooth: true });
      circle(x - r * .14, y + r * .25, r * .12, { fill: C.waterLt, stroke: null });
    }
  }
  function holo(t, x0, y0, w, h, k) {
    const ph = ((t * .35) % 1) * 2.4 - .7, g = X.createLinearGradient(x0 + w * ph - 30, y0, x0 + w * ph + 30, y0 + h);
    ['rgba(255,120,160,0)', 'rgba(255,120,160,.5)', 'rgba(255,240,140,.65)', 'rgba(130,240,255,.55)', 'rgba(190,140,255,.45)', 'rgba(190,140,255,0)'].forEach((c, i) => g.addColorStop(i / 5, c));
    X.save(); X.globalAlpha *= k; X.globalCompositeOperation = 'lighter'; X.fillStyle = g; X.fillRect(x0, y0, w, h); X.restore();
  }

  // an Energy card, 63 × 88 local units centred on (0, 0)
  function energyFace(type, t) {
    const col = type === 'fire' ? C.fire : C.water, lt = type === 'fire' ? '#FFD8A8' : '#CFE9FF';
    shape(rectPts(-31.5, -44, 63, 88), { fill: C.silver, ...O(1.6), smooth: .06 });
    const g = X.createRadialGradient(0, -4, 4, 0, -4, 46); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, lt);
    shape(rectPts(-28, -40.5, 56, 81), { fill: g, stroke: C.silverDk, lwPx: .8, smooth: .04 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .3; shape([[0, -4], [Math.cos(a) * 30, -4 + Math.sin(a) * 38], [Math.cos(a + .2) * 30, -4 + Math.sin(a + .2) * 38]], { fill: rgba(col, .12), stroke: null }); }
    symbol(type, 0, -4, 17, t);
    text('ENERGY', 0, -34.5, 6.4, C.ink, { weight: 800 });
    text(type === 'fire' ? 'Fire Energy' : 'Water Energy', 0, 30, 6.2, col, { weight: 800 });
  }
  // a Trainer card: the silver frame, a TRAINER header with its tag, the name, an art window and one line of rules
  function trainerFace(kind, t) {
    const T = TRAINER[kind];
    shape(rectPts(-31.5, -44, 63, 88), { fill: C.silver, ...O(1.6), smooth: .06 });
    shape(rectPts(-28, -40.5, 56, 81), { fill: C.silverLt, stroke: C.silverDk, lwPx: .8, smooth: .04 });
    text('TRAINER', -25, -36.5, 5.2, C.ink, { align: 'left', weight: 800 });
    shape(rectPts(4, -39.6, 23, 6.4), { fill: T.col, ...O(.6), smooth: .4 }); text(T.tag, 15.5, -36.3, T.tag.length > 7 ? 3.4 : 4.2, '#FFFFFF', { weight: 800 });
    text(T.name, 0, -29, T.name.length > 13 ? 5.2 : 6.2, C.ink, { weight: 800 });
    X.save(); X.beginPath(); X.rect(-26, -25, 52, 34); X.clip();
    art(kind, t);
    if (T.power) holo(t, -26, -25, 52, 34, .7);
    X.restore();
    shape(rectPts(-26, -25, 52, 34), { fill: null, stroke: C.silverDk, lwPx: 1 });
    // the rules text, then two grey bars
    text(T.line, 0, 17, T.line.length > 26 ? 3.9 : 4.4, C.ink, { weight: 600 });
    for (const y of [25, 30.5]) shape(rectPts(-22, y - 1.2, 44, 2.4), { fill: C.bar, stroke: null, smooth: .5 });
    if (T.power) { X.save(); X.translate(19, 36); X.rotate(-.15); shape(starPts(0, 0, 7.5, .55, 8), { fill: '#FFD95A', ...O(.6) }); text('NEW!', 0, .3, 3.8, '#C0392B', { weight: 800 }); X.restore(); }
  }
  // the art in a Trainer's 52 × 34 window (centred at (0, -8))
  function art(kind, t) {
    const sky = (a, b) => { const g = X.createLinearGradient(0, -25, 0, 9); g.addColorStop(0, a); g.addColorStop(1, b); X.fillStyle = g; X.fillRect(-26, -25, 52, 34); };
    if (kind === 'stadium') {                                     // a volcano arena with a lava pool
      sky('#FFCF9A', '#F0835A');
      shape([[-26, 9], [-10, -14], [-4, -16], [2, -13], [20, 9]], { fill: '#7A4A3A', ...O(.8) });
      shape([[-6, -15], [-3, -20 - 2 * Math.sin(t * 4)], [0, -16]], { fill: C.fireLt, stroke: null, smooth: true });
      shape(ellPts(0, 6, 22, 4), { fill: '#FF8A3A', ...O(.8), smooth: true }); shape(ellPts(-3, 5.5, 10, 1.5), { fill: '#FFE07A', stroke: null, smooth: true });
    } else if (kind === 'tool') {                                 // a bubble shield
      sky('#D8F1FF', '#8CC6F2');
      const r = 13 + Math.sin(t * 3) * .6;
      shape([[0, -20], [12, -15], [11, -2], [0, 7], [-11, -2], [-12, -15]], { fill: C.water, ...O(1), smooth: .2 });
      shape([[0, -16], [8, -13], [7.5, -3], [0, 3], [-7.5, -3], [-8, -13]], { fill: C.waterLt, stroke: null, smooth: .2 });
      circle(0, -7, r, { fill: 'rgba(255,255,255,.18)', stroke: '#FFFFFF', lwPx: .8 });
      circle(-5, -13, 2.4, { fill: 'rgba(255,255,255,.8)', stroke: null });
    } else if (kind === 'supporter') {                            // a coach with a whistle and a clipboard
      sky('#FFE9C8', '#F4B97A');
      shape(ellPts(0, 9, 14, 10), { fill: '#E0813A', ...O(.8), smooth: true });
      circle(0, -9, 8, { fill: '#E8B48F', ...O(.8) }); shape([[-8, -11], [-7, -17], [7, -17], [8, -11]], { fill: '#3E2C22', ...O(.6), smooth: .3 });
      for (const s of [-1, 1]) circle(s * 2.8, -9, .9, { fill: C.ink, stroke: null }); line([[-2, -6], [0, -5], [2, -6]], { stroke: C.ink, lwPx: .6 });
      shape(rectPts(8, -4, 9, 12), { fill: '#C99A6A', ...O(.6) }); shape(rectPts(9.5, -2, 6, 8), { fill: '#FFFFFF', stroke: null });
    } else if (kind === 'item') {                                 // a magnifying glass over a card
      sky('#EFE4FF', '#B49BE8');
      X.save(); X.translate(-6, -6); X.rotate(-.2); X.scale(.32, .32); PK.card(0, 0, 63, 0, { kind: 'star', t }); X.restore();
      const g = 3 * Math.sin(t * 2);
      circle(6 + g, -10, 9, { fill: 'rgba(255,255,255,.35)', stroke: '#5E4B2E', lwPx: 1.6 });
      line([[12 + g, -4], [20 + g, 4]], { stroke: '#5E4B2E', lwPx: 2.4 });
    } else if (kind === 'safadi' || kind === 'sami') {            // the real rig, head and shoulders
      const isS = kind === 'safadi';
      sky(isS ? '#FFF3D6' : '#DDF6EC', isS ? '#F2C86A' : '#7FD3B0');
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .4; shape([[0, -8], [Math.cos(a) * 40, -8 + Math.sin(a) * 40], [Math.cos(a + .2) * 40, -8 + Math.sin(a + .2) * 40]], { fill: 'rgba(255,255,255,.22)', stroke: null }); }
    }
  }
  function face(o) {
    const k = o.kind || 'fin', t = o.t ?? 0;
    if (k === 'fireE' || k === 'waterE') energyFace(k === 'fireE' ? 'fire' : 'water', t); else trainerFace(k, t);
    if (o.holo) { X.save(); X.beginPath(); X.rect(-31.5, -44, 63, 88); X.clip(); holo(t + .4, -31.5, -44, 63, 88, o.holo * .4); X.restore(); }
  }
  function card(cx, cy, w, ang, o = {}) {
    if (CREATURE[o.kind] || o.back) return PK.card(cx, cy, w, ang, o);
    X.save(); X.translate(cx, cy); X.rotate(ang || 0); X.scale(w / 63, w / 63);
    if (o.alpha != null) X.globalAlpha *= o.alpha;
    if (o.shadow) shape(rectPts(-29, -40, 63, 88), { fill: 'rgba(30,20,40,.22)', stroke: null, smooth: .06 });
    face(o); X.restore();
    if (TRAINER[o.kind]?.power) portrait(o.kind, cx, cy, w, ang, o.t ?? 0, o.alpha);
  }
  // the person in a Professor Safadi / Doctor Sami card: drawn at screen scale (rigs size their outlines from s), clipped to the art window
  function portrait(kind, cx, cy, w, ang, t, alpha) {
    const u = w / 63, s = 1.7 * u, o = { t, mouth: 'grin', brows: 'up', lookX: 0, lookY: 0, blink: 0, turn: 0 };
    X.save(); X.translate(cx, cy); X.rotate(ang || 0); if (alpha != null) X.globalAlpha *= alpha;
    X.beginPath(); X.rect(-26 * u, -25 * u, 52 * u, 34 * u); X.clip();
    if (kind === 'safadi') safadi(0, 31 * u, s, { ...o, handR: [5.8, -21.4], handPoseR: 'point', handL: [-4.4, -8.1], eyes: 'wink', mouth: 'smirk' });
    else sami(0, 31 * u, s, { ...o, eyes: 'happy', handR: [5.2, -18], handPoseR: 'thumb', handL: [-2.5, -11.5], handPoseL: 'stethoscope' });
    holo(t, -26 * u, -25 * u, 52 * u, 34 * u, .5);
    X.restore();
    X.save(); X.translate(cx, cy); X.rotate(ang || 0); X.scale(u, u); shape(rectPts(-26, -25, 52, 34), { fill: null, stroke: C.silverDk, lwPx: Math.max(1, u * .4) }); X.restore();
  }

  // ---------- on the floor ----------
  function onFloor(P, x, z, ang, w, fn) {
    if (!P.visible(z)) return;
    const c = Math.cos(ang), s = Math.sin(ang), u = w / 63;
    const p0 = P.p(x, .4, z), pu = P.p(x + c * u, .4, z + s * u), pv = P.p(x - s * u, .4, z + c * u);
    X.save(); X.transform(pu[0] - p0[0], pu[1] - p0[1], -(pv[0] - p0[0]), -(pv[1] - p0[1]), p0[0], p0[1]); fn(); X.restore();
  }
  function floor(P, x, z, ang, o = {}) {
    if (CREATURE[o.kind] || o.back) return PK.cardFloor(P, x, z, ang, o);
    onFloor(P, x, z, ang, 15, () => face(o));
  }
  function pile(P, x, z, n, kinds, t) {
    for (let i = 0; i < n; i++) { const a = (hash(i * 3 + x) - .5) * .7, dx = (hash(i * 5 + z) - .5) * 4, dz = (hash(i * 7 + x + z) - .5) * 4;
      floor(P, x + dx, z + dz, a, i === n - 1 || hash(i + 11) > .45 ? { kind: kinds[i % kinds.length], t } : { back: true, t }); }
  }

  // ---------- inserts ----------
  function panelBG(t, c0, c1) {
    const g = X.createRadialGradient(W / 2, H * .42, 80, W / 2, H * .5, W * .7); g.addColorStop(0, c0); g.addColorStop(1, c1);
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { const x = hash(i) * W, y = (hash(i + 50) * H + t * (12 + 20 * hash(i + 9))) % H, r = 4 + 9 * hash(i + 20);
      shape(i % 3 ? ellPts(x, y, r, r, 10) : starPts(x, y, r * 1.4, .45, 5, t + i), { fill: 'rgba(255,255,255,.28)', stroke: null }); }
  }
  const pop = (t, a, d = .35) => backOut(seg(t, a, a + d));
  function stamp(txt, x, y, size, col, k, rot = -.08) {
    if (k <= 0) return; X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
    text(txt, 0, 0, size, col, { font: FONT_SFX, weight: 400, outline: size * .16 }); X.restore();
  }

  // Jenna's deck and Danny's deck: two fans of 60 Pokemon, and nothing else
  function insDecks(t, t0) {
    panelBG(t, '#FFF1F6', '#B7C8F0');
    const half = (cx, kinds, title, col, mood) => {
      const k = pop(t, t0 + .1, .45); if (k <= 0) return;
      X.save(); X.translate(cx, H * .42); X.scale(k, k);
      for (let i = 0; i < 7; i++) { const a = (i - 3) * .16 + .02 * Math.sin(t * 2 + i), r = 330;
        X.save(); X.rotate(a); card(0, -r * .35, 200, 0, { kind: kinds[i % kinds.length], t, holo: i === 3 ? .7 : 0, shadow: true }); X.restore(); }
      X.restore();
      stamp(title, cx, H * .12, 70, col, pop(t, t0 + .3, .4), -.04);
      // the tally: 60 Pokemon, 0 Energy, 0 Trainers
      const rows = [['POKEMON', String(Math.round(60 * ease(seg(t, t0 + .6, t0 + 1.6))))], ['ENERGY', '0'], ['TRAINERS', '0']];
      rows.forEach(([s, v], i) => { const a = pop(t, t0 + .7 + i * .35, .3); if (a <= 0) return;
        X.save(); X.translate(cx, H * .58 + i * 58); X.scale(a, a);
        shape(rectPts(-200, -26, 400, 52), { fill: i ? '#FFE3E0' : '#E5F6EA', ...O(4), smooth: .4 });
        text(s, -175, 2, 34, PAL.ink, { align: 'left', weight: 800 }); text(v, 170, 2, 40, i ? '#D23A3A' : '#2F8A48', { align: 'right', weight: 800 }); X.restore(); });
      if (mood === 'cute') for (let i = 0; i < 5; i++) { const a = t * 1.1 + i * 1.3; shape(heart(cx + Math.cos(a) * 300, H * .3 + Math.sin(a) * 170, 18 + 5 * Math.sin(t * 4 + i)), { fill: '#FF7FB0', stroke: null, alpha: .85 }); }
      else for (let i = 0; i < 5; i++) { const a = t * 1.1 + i * 1.3, x = cx + Math.cos(a) * 300, y = H * .3 + Math.sin(a) * 170, f = 22 + 6 * Math.sin(t * 6 + i);
        shape([[x, y - f], [x + f * .6, y], [x, y + f * .6], [x - f * .6, y]], { fill: '#FF9A3A', stroke: null, smooth: true, alpha: .85 }); }
    };
    half(W * .27, ['sprout', 'star'], "JENNA: CUTE!", '#D0508E', 'cute');
    half(W * .73, ['dragon'], "DANNY: FIERCE!", '#E0533A', 'fierce');
  }
  const heart = (x, y, r) => { const p = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; p.push([x + r * 16 * Math.sin(a) ** 3 / 16, y - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); } return p; };

  // the type matchup: Blazewyrm (Fire) against Captain Fin (Water). A wave hits the dragon for double damage.
  function insMatch(t, t0) {
    panelBG(t, '#E9F3FF', '#F5B08A');
    const k1 = pop(t, t0 + .1, .45), k2 = pop(t, t0 + .45, .45);
    if (k1 > 0) card(W * .27, H * .52 + 6 * Math.sin(t * 2), 380 * k1, -.06, { kind: 'dragon', t, holo: .8, shadow: true });
    if (k2 > 0) card(W * .73, H * .52 + 6 * Math.sin(t * 2 + 1), 380 * k2, .06, { kind: 'fin', t, holo: .8, shadow: true });
    stamp('VS', W / 2, H * .5, 150, '#FFD95A', pop(t, t0 + .7, .35), -.1);
    // the weakness tag under the dragon
    const kw = pop(t, t0 + 1.4, .35);
    if (kw > 0) { X.save(); X.translate(W * .27, H * .09); X.scale(kw, kw);
      shape(rectPts(-250, -40, 500, 80), { fill: '#FFFFFF', ...O(5), smooth: .4 });
      text('WEAKNESS:', -110, 3, 40, PAL.ink, { weight: 800 }); symbol('water', 60, 2, 26, t); text('×2', 150, 3, 50, '#D23A3A', { font: FONT_SFX, weight: 400 }); X.restore(); }
    // the wave: from Fin to the dragon
    const u = seg(t, t0 + 2.2, t0 + 3.0);
    if (u > 0 && u < 1) for (let i = 0; i < 9; i++) { const f = clamp(u * 1.3 - i * .04), x = lerp(W * .66, W * .33, f), y = H * .45 - Math.sin(f * Math.PI) * 160 + i * 6;
      circle(x, y, 26 - i * 1.8, { fill: i % 2 ? C.water : C.waterLt, ...O(2) }); }
    if (t > t0 + 2.95) { const a = t - t0 - 2.95; sfx("×2 DAMAGE!", W * .27, H * .5, 110, '#FF6B6B', a, { life: 1.6 }); }
  }

  // Professor Safadi's chalkboard. beats[i] is when each lesson starts; the 60-card bar fills in on beats[1].
  function insChalk(t, t0, beats) {
    // the wall, the board and its wooden frame
    const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9DCC6'); g.addColorStop(1, '#CDB898'); X.fillStyle = g; X.fillRect(0, 0, W, H);
    const bx = 600, by = 70, bw = 1260, bh = 860;
    shape(rectPts(bx - 22, by - 22, bw + 44, bh + 44), { fill: C.wood, ...O(5), smooth: .01 });
    const bg = X.createRadialGradient(bx + bw / 2, by + bh / 2, 100, bx + bw / 2, by + bh / 2, bw * .7); bg.addColorStop(0, '#2C5246'); bg.addColorStop(1, C.boardDk);
    shape(rectPts(bx, by, bw, bh), { fill: bg, stroke: null });
    for (let i = 0; i < 14; i++) shape(ellPts(bx + hash(i) * bw, by + hash(i + 30) * bh, 60 + 90 * hash(i + 7), 12, 12, hash(i + 4)), { fill: 'rgba(255,255,255,.035)', stroke: null });
    shape(rectPts(bx + 40, by + bh + 4, 300, 14), { fill: '#B98A5A', ...O(3) }); for (let i = 0; i < 3; i++) shape(rectPts(bx + 70 + i * 60, by + bh - 6, 34, 9), { fill: ['#FFFDF4', '#FFD95A', '#9FD4FF'][i], ...O(1.5), smooth: .4 });
    // chalk writing: wiped on left to right
    const write = (s, x, y, size, col, a, o = {}) => { const k = clamp(seg(t, a, a + (o.dur ?? .7))); if (k <= 0) return;
      X.save(); X.beginPath(); X.rect(x - (o.align === 'center' ? 700 : 0), y - size, (o.align === 'center' ? 1400 : 1200) * k, size * 2); X.clip();
      X.globalAlpha *= .94; text(s, x, y, size, col, { align: o.align ?? 'left', weight: 700, font: o.font }); X.restore(); };
    write('BUILDING A GREAT DECK', bx + bw / 2, by + 70, 66, C.chalk, beats[0] - 1.0, { align: 'center', font: FONT_SFX, dur: .9 });
    line([[bx + 220, by + 115], [bx + bw - 220, by + 115]], { stroke: rgba('#FFFDF4', .7 * clamp(seg(t, beats[0] - .2, beats[0] + .4))), lwPx: 4 });
    write('A deck is a TEAM: every card has a job!', bx + 70, by + 175, 44, '#FFD95A', beats[0] + .4, { dur: 1.2 });
    // the 60-card bar: 16 Pokemon, 12 Energy, 32 Trainers
    const parts = [[16, 'POKEMON', '#F28AB8'], [12, 'ENERGY', '#FFB23A'], [32, 'TRAINERS', '#7FB7FF']], x0 = bx + 70, wBar = bw - 280, y0 = by + 250;
    let acc = 0;
    parts.forEach(([n, s, col], i) => { const a = beats[1] + .5 + i * 1.1, k = ease(seg(t, a, a + .6)); if (k <= 0) { acc += n; return; }
      const x = x0 + wBar * acc / 60, w = wBar * n / 60 * k;
      shape(rectPts(x, y0, w, 90), { fill: col, stroke: C.chalk, lwPx: 3 });
      if (k > .6) { text(String(n), x + wBar * n / 120, y0 + 34, 46, PAL.ink, { font: FONT_SFX, weight: 400 }); text(s, x + wBar * n / 120, y0 + 72, 22, PAL.ink, { weight: 800 }); }
      acc += n; });
    if (t > beats[1] + 3.9) stamp('= 60', x0 + wBar + 105, y0 + 48, 64, '#FFFDF4', pop(t, beats[1] + 3.9, .35), -.06);
    // the checklist: one row per lesson
    const rows = [
      [beats[2], 'No Energy = no attacks!', 'energy'],
      [beats[3], 'Trainers: draw, search, change the battle', 'trainer'],
      [beats[4], 'Pick 1 or 2 types, with Energy to match', 'types'],
      [beats[5], '4 copies of your best cards', 'four'],
      [beats[6], 'Have a plan for your weakness!', 'weak'],
    ];
    rows.forEach(([a, s, ic], i) => { if (t < a) return; const y = by + 420 + i * 92, k = pop(t, a, .35);
      // the icon
      X.save(); X.translate(bx + 105, y); X.scale(k, k);
      if (ic === 'energy') { symbol('fire', -14, 0, 24, t); line([[-44, -30], [16, 30]], { stroke: '#FF6B6B', lwPx: 6 }); }
      else if (ic === 'trainer') card(-14, 0, 46, -.1, { kind: 'supporter', t });
      else if (ic === 'types') { symbol('fire', -30, 0, 20, t); symbol('water', 6, 0, 20, t); }
      else if (ic === 'four') for (let j = 0; j < 4; j++) card(-40 + j * 14, 0, 38, (j - 1.5) * .12, { kind: 'dragon', t });
      else { shape([[-14, -30], [10, -22], [8, 6], [-14, 26], [-36, 6], [-38, -22]], { fill: C.water, stroke: C.chalk, lwPx: 3, smooth: .2 }); text('!', -14, -2, 40, '#FFFFFF', { font: FONT_SFX, weight: 400 }); }
      X.restore();
      write(s, bx + 175, y, 42, C.chalk, a + .1, { dur: 1.0 });
      if (t > a + 1.3) { const c = pop(t, a + 1.3, .3); X.save(); X.translate(bx + bw - 90, y); X.scale(c, c); line([[-24, 0], [-6, 20], [28, -26]], { stroke: '#8BE39A', lwPx: 9 }); X.restore(); }
    });
  }

  // a big card held up to the lens, the light behind it (the Professor Safadi and Doctor Sami cards)
  function insCard(t, t0, kind) {
    const k = backOut(seg(t, t0, t0 + .45)), isS = kind === 'safadi';
    X.fillStyle = 'rgba(30,20,50,.5)'; X.fillRect(0, 0, W, H);
    const g = X.createRadialGradient(W / 2, H * .48, 30, W / 2, H * .48, 620); g.addColorStop(0, isS ? 'rgba(255,240,190,.85)' : 'rgba(210,255,235,.85)'); g.addColorStop(1, 'rgba(255,245,200,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .25; shape([[W / 2, H * .48], [W / 2 + Math.cos(a) * 1400, H * .48 + Math.sin(a) * 1400], [W / 2 + Math.cos(a + .09) * 1400, H * .48 + Math.sin(a + .09) * 1400]], { fill: isS ? 'rgba(255,214,107,.12)' : 'rgba(138,229,179,.12)', stroke: null }); }
    card(W / 2, H * .48 + 6 * Math.sin(t * 2), 500 * k, .04 * Math.sin(t * 1.3), { kind, t, holo: 1 });
    for (let i = 0; i < 6; i++) { const a = t * 1.2 + i * 1.05, r = 400 + 30 * Math.sin(t * 2 + i);
      shape(starPts(W / 2 + Math.cos(a) * r, H * .48 + Math.sin(a) * r * .95, 20 + 8 * Math.sin(t * 6 + i), .35, 4, t * 2), { fill: '#FFFFFF', stroke: null, alpha: .85 }); }
    if (t > t0 + .3) sfx(isS ? 'NEW TRAINER!' : 'NEW TRAINER?', W * .5 + 420, H * .17, 76, '#FFE066', t - t0 - .3, { life: 1.6 });
  }

  // a caption that sets the place: pops in, holds, slides away
  function banner(txt, t, t0, dur = 2.6) {
    const a = t - t0; if (a < 0 || a > dur) return;
    const k = backOut(seg(a, 0, .4)), out = easeIn(seg(a, dur - .35, dur));
    overlay(() => { X.save(); X.translate(70 + 280 - out * 900, 92); X.rotate(-.04); X.scale(k, k);
      shape(rectPts(-280, -46, 560, 92), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 6, smooth: .15 });
      text(txt, 0, 4, txt.length > 18 ? 38 : 46, '#E0533A', { font: FONT_SFX, weight: 400, outline: 7, outlineCol: PAL.ink }); X.restore(); });
  }

  return { C, card, floor, pile, symbol, insDecks, insMatch, insChalk, insCard, banner, text };
})();
