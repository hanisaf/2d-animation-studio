// scenes/pokemon/scene67_everybody_wins/props.js: the Grand Tournament of scene 67, the series finale music video.
// A 2D night stadium (drawn in a 1920 × 1080 world, filmed with camBegin), four new creatures for the guest trainers,
// a signature attack for every creature, the duel close-ups, trophies, confetti and fireworks.
// The four original creatures come from scene 64 (PK.ART) through `uses`. Namespaced PG; every function is a pure function
// of its arguments.
const PG = (() => {
  const C = { ink: '#2B2233', gold: '#F2C440', goldDk: '#B98A22', goldLt: '#FFE58A', water: '#3D86D8', waterLt: '#9FD4FF', fire: '#E0533A', fireLt: '#FFB23A',
    leaf: '#52A83E', leafLt: '#A8E07A', star: '#FFD95A', purple: '#9A6BD8', pink: '#FF8FC0', teal: '#2FB3A6' };
  const O = (lw = 1.2) => ({ stroke: C.ink, lwPx: lw });
  const text = (...a) => PK.text(...a);
  const pop = (t, a, d = .35) => backOut(seg(t, a, a + d));
  function stamp(txt, x, y, size, col, k, rot = -.06, outline = .16) {
    if (k <= 0) return; X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
    text(txt, 0, 0, size, col, { font: FONT_SFX, weight: 400, outline: size * outline }); X.restore();
  }

  // ---------- the four new creatures (52 × 30 art window, centred on (0, 0), facing right) ----------
  function bellbop(t) {                                         // Jester's: a round purple imp in a three-point jester hat with bells
    const j = Math.sin(t * 6) * 1.5, b = Math.abs(Math.sin(t * 3)) * 1.5;
    X.save(); X.translate(0, -b);
    shape(ellPts(0, 4, 10, 9.5), { fill: '#8A5BD0', ...O(), smooth: true });
    shape(ellPts(1, 7, 6, 5), { fill: '#F3D27A', stroke: null, smooth: true });
    const pts = [[-12, -10 + j], [0, -16 - j], [12, -10 + j]], cols = ['#C8303E', '#F2C440', '#3D6FD0'];
    pts.forEach(([x, y], i) => { shape([[-8, -4], [x * .55, y * .6], [x, y], [8, -4]], { fill: cols[i], ...O(.9), smooth: .3 }); circle(x, y, 1.8, { fill: C.gold, ...O(.7) }); });
    shape([[-9, -4], [9, -4], [8, -2], [-8, -2]], { fill: '#C8303E', ...O(.8) });
    for (const s of [-1, 1]) { circle(s * 3.5 + 1.5, 1, 2.2, { fill: '#FFFFFF', ...O(.7) }); circle(s * 3.5 + 2.2, 1.2, 1.1, { fill: C.ink, stroke: null }); }
    shape([[-1, 5], [2.5, 7], [6, 5]], { fill: null, ...O(.8), smooth: true });
    for (const s of [-1, 1]) shape(ellPts(s * 10.5, 5, 2.5, 1.8), { fill: '#8A5BD0', ...O(.7), smooth: true });
    X.restore();
  }
  function coralia(t) {                                         // Pearl's: a pink royal jellyfish with a crown and a glowing pearl
    const w = t * 4;
    for (let i = 0; i < 5; i++) { const x = -7 + i * 3.5; line([[x, 4], [x + 1.5 * Math.sin(w + i), 9], [x - 1.5 * Math.sin(w + i + 1), 14]], { stroke: '#E77FB6', lwPx: 2.2, smooth: true }); }
    shape([[-11, 5], [-11, -2], [-6, -9], [6, -9], [11, -2], [11, 5], [6, 3], [0, 5], [-6, 3]], { fill: '#FF9CCB', ...O(), smooth: .4 });
    shape(ellPts(-2, -4, 5, 2.5), { fill: 'rgba(255,255,255,.5)', stroke: null, smooth: true });
    shape([[-5, -9], [-6, -14], [-2.5, -11], [0, -15], [2.5, -11], [6, -14], [5, -9]], { fill: C.gold, ...O(.8) });
    circle(0, -12, 1.2, { fill: '#5BC0EB', stroke: null });
    for (const s of [-1, 1]) { circle(s * 3.4 + 1.5, -1.5, 1.4, { fill: C.ink, stroke: null }); circle(s * 3.4 + 1.8, -1.9, .5, { fill: '#FFFFFF', stroke: null }); }
    shape([[0, 1.5], [1.6, 2.6], [3.2, 1.5]], { fill: null, ...O(.7) });
    circle(8, 0, 2 + .4 * Math.sin(t * 5), { fill: '#FFFDF4', stroke: '#D9C8F0', lwPx: .8 });
  }
  function shelldon(t) {                                        // Neptune's: a sea turtle with a gold trident on its shell
    const p = Math.sin(t * 3) * 2;
    for (const [x, s] of [[-7, -1], [6, 1]]) shape([[x, 4], [x + s * 4 + p * .3, 10], [x + s * 7, 8]], { fill: '#5FC2A2', ...O(.8), smooth: true });
    shape([[10, -2], [16, -5], [20, -3], [19, 1], [14, 2]], { fill: '#7AD3B2', ...O(.9), smooth: .4 });
    circle(17, -3, 1.1, { fill: C.ink, stroke: null }); shape([[17, 0], [19, .4]], { fill: null, ...O(.6) });
    shape([[-14, 4], [-12, -6], [-4, -12], [6, -11], [12, -4], [12, 4]], { fill: '#2C7FA8', ...O(), smooth: .5 });
    for (let i = 0; i < 3; i++) shape(ellPts(-6 + i * 6, -3 + (i % 2) * 2, 3, 2.4, 6), { fill: '#3F9FCB', stroke: '#1F5E80', lwPx: .6 });
    line([[0, 2], [0, -10]], { stroke: C.gold, lwPx: 2 }); line([[-3, -7], [-3, -10], [3, -10], [3, -7]], { stroke: C.gold, lwPx: 1.6 });
    shape([[-14, 4], [12, 4], [10, 6], [-12, 6]], { fill: '#F3E3B0', ...O(.8) });
  }
  function puffling(t) {                                        // Dragon's: a puffy pink baby cloud-dragon
    const f = Math.sin(t * 8) * 2, b = Math.sin(t * 2.5) * 1;
    X.save(); X.translate(0, b);
    for (const s of [-1, 1]) shape([[-2, -6], [-9 + s, -14 - f], [-6, -5]], { fill: '#F7B6D8', ...O(.8), smooth: .2 });
    [[-6, 3, 6], [0, 0, 8], [6, 3, 6], [-2, 6, 6], [4, 7, 5]].forEach(([x, y, r]) => circle(x, y, r, { fill: '#FFC9E3', ...O(.9) }));
    [[-6, 3, 5], [0, 0, 7], [6, 3, 5], [-2, 6, 5], [4, 7, 4]].forEach(([x, y, r]) => circle(x, y, r, { fill: '#FFC9E3', stroke: null }));
    for (const s of [-1, 1]) shape([[s * 3 + 3, -7], [s * 4 + 3, -11], [s * 1.5 + 3, -7.5]], { fill: '#FFF1A0', ...O(.6) });
    for (const s of [-1, 1]) circle(s * 3 + 3, -1, 1.3, { fill: C.ink, stroke: null });
    circle(-1, 2, 1.4, { fill: 'rgba(255,120,160,.5)', stroke: null }); circle(8, 2, 1.4, { fill: 'rgba(255,120,160,.5)', stroke: null });
    shape([[2, 3], [3.5, 4.5], [5, 3]], { fill: null, ...O(.7) });
    X.restore();
  }
  const ART = { ...PK.ART, bellbop, coralia, shelldon, puffling };
  const NAME = { fin: 'Captain Fin', dragon: 'Blazewyrm', sprout: 'Sproutbun', star: 'Starpaw', bellbop: 'Bellbop', coralia: 'Coralia', shelldon: 'Shelldon', puffling: 'Puffling' };
  const MOVE = { fin: 'TIDAL SPLASH', dragon: 'FLAME BURST', sprout: 'LEAF STORM', star: 'STAR SHOWER', bellbop: 'JINGLE BLAST', coralia: 'PEARL BEAM', shelldon: 'SHELL SPIN', puffling: 'PUFF CLOUD' };
  const GLOW = { fin: '120,200,255', dragon: '255,150,60', sprout: '150,230,110', star: '255,220,90', bellbop: '200,150,255', coralia: '255,160,210', shelldon: '90,220,200', puffling: '255,190,225' };
  // a creature at (x, y) on screen, scale sc (px per art unit), facing right unless flip
  function creature(kind, x, y, sc, t, o = {}) {
    X.save(); X.translate(x + (o.hit ? Math.sin(t * 70) * 10 * o.hit : 0), y); X.rotate(o.rot ?? 0); X.scale(sc * (o.flip ? -1 : 1) * (1 + (o.sq ?? 0)), sc * (1 - (o.sq ?? 0)));
    if (o.glow) { X.shadowColor = `rgba(${GLOW[kind]},1)`; X.shadowBlur = 30 * o.glow; }
    if (o.alpha != null) X.globalAlpha *= o.alpha;
    ART[kind](t); X.restore();
  }
  function aura(kind, x, y, r, k) {
    if (k <= 0) return; const g = X.createRadialGradient(x, y, r * .1, x, y, r); g.addColorStop(0, `rgba(${GLOW[kind]},${.75 * k})`); g.addColorStop(1, `rgba(${GLOW[kind]},0)`);
    X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = g; X.fillRect(x - r, y - r, r * 2, r * 2); X.restore();
  }

  // ---------- the signature attacks: from (ax, ay) to (bx, by), u 0..1 travel; size is px per art unit ----------
  function fx(kind, ax, ay, bx, by, u, t, size = 8) {
    if (u <= 0 || u >= 1.15) return;
    const L = (f) => [lerp(ax, bx, f), lerp(ay, by, f)], s = size / 8;
    if (kind === 'fin') { const [x] = L(u), hh = 260 * s;
      shape([[x - 700 * s, by + 120 * s], [x - 500 * s, by - hh * .4], [x - 120 * s, by - hh], [x + 60 * s, by - hh * .7], [x - 20 * s, by - hh * .5], [x + 40 * s, by + 120 * s]], { fill: C.water, ...O(4), smooth: true, alpha: .9 });
      for (let i = 0; i < 9; i++) circle(x - 80 * s + 120 * s * (hash(i) - .5), by - hh * .9 + 90 * s * hash(i + 3), (9 + 10 * hash(i + 7)) * s, { fill: '#FFFFFF', ...O(1.5) }); }
    if (kind === 'dragon') { const [x, y0] = L(u), y = y0 - 120 * s * Math.sin(u * Math.PI), r = (60 + 40 * u) * s;
      for (let i = 0; i < 12; i++) { const f = i / 12; circle(x - f * 300 * s * Math.sign(bx - ax), y + 24 * s * Math.sin(i * 1.7 + t * 10) * f, r * (1 - f * .8), { fill: i % 2 ? C.fire : C.fireLt, stroke: null, alpha: .85 - f * .5 }); }
      circle(x, y, r, { fill: C.fireLt, ...O(4) }); circle(x + 6 * s, y - 6 * s, r * .55, { fill: '#FFF1A0', stroke: null }); }
    if (kind === 'sprout') for (let i = 0; i < 18; i++) { const f = clamp(u * 1.5 - i * .03); if (f <= 0 || f >= 1) continue; const [x, y] = L(f), a = t * 9 + i, r = 50 * s * Math.sin(f * Math.PI);
      X.save(); X.translate(x + Math.cos(a) * r, y + Math.sin(a) * r * .6); X.rotate(a * 2); shape([[-14 * s, 0], [0, -7 * s], [14 * s, 0], [0, 7 * s]], { fill: i % 2 ? C.leaf : C.leafLt, ...O(1.5), smooth: true }); X.restore(); }
    if (kind === 'star') for (let i = 0; i < 10; i++) { const f = clamp(u * 1.4 - i * .04); if (f <= 0 || f >= 1) continue; const x = lerp(ax, bx, f) + (hash(i) - .5) * 160 * s, y = lerp(ay - 500 * s, by, f);
      shape(starPts(x, y, (22 + 10 * hash(i + 2)) * s, .45, 5, t * 4 + i), { fill: C.star, ...O(2) }); line([[x, y], [x - (bx - ax) * .08, y - 90 * s]], { stroke: rgba('#FFF1A0', .7), lwPx: 6 * s }); }
    if (kind === 'bellbop') for (let i = 0; i < 6; i++) { const f = clamp(u * 1.3 - i * .06); if (f <= 0 || f >= 1) continue; const [x, y] = L(f), r = (30 + 80 * f) * s;
      X.save(); X.translate(x, y); shape(ellPts(0, 0, r * .45, r, 24), { fill: null, stroke: `rgba(200,150,255,${1 - f * .6})`, lwPx: 10 * s, smooth: true }); X.restore();
      text(['♪', '♫'][i % 2], x, y - r - 20 * s, 60 * s, '#FFFFFF', { outline: 6 * s }); }
    if (kind === 'coralia') { const f = clamp(u * 1.6), [x, y] = L(f), g = X.createLinearGradient(ax, ay, x, y);
      ['#FF8FC0', '#FFE58A', '#9FD4FF', '#C9A8FF'].forEach((c, i) => g.addColorStop(i / 3, c));
      X.save(); X.lineCap = 'round'; X.globalAlpha *= .9; X.strokeStyle = g; X.lineWidth = (46 + 10 * Math.sin(t * 30)) * s; X.beginPath(); X.moveTo(ax, ay); X.lineTo(x, y); X.stroke();
      X.strokeStyle = '#FFFFFF'; X.lineWidth = 14 * s; X.stroke(); X.restore(); circle(x, y, 40 * s, { fill: '#FFFDF4', stroke: '#FFB6DA', lwPx: 5 * s }); }
    if (kind === 'puffling') for (let i = 0; i < 12; i++) { const f = clamp(u * 1.3 - i * .04); if (f <= 0 || f >= 1) continue; const [x, y] = L(f), r = (30 + 40 * hash(i)) * s * (.5 + f);
      circle(x + (hash(i + 4) - .5) * 120 * s, y + (hash(i + 8) - .5) * 80 * s, r, { fill: 'rgba(255,201,227,.85)', ...O(1.5) });
      if (i % 3 === 0) { const hx = x + (hash(i + 1) - .5) * 140 * s, hy = y - 60 * s; shape(heart(hx, hy, 18 * s), { fill: '#FF5C9A', ...O(1.5) }); } }
    // shelldon rams with its own body: the scene moves the creature; here just a speed trail
    if (kind === 'shelldon') { const [x, y] = L(u); for (let i = 0; i < 6; i++) line([[x - (bx - ax) * .05 * (i + 1), y - 60 * s + i * 24 * s], [x - (bx - ax) * .05 * (i + 4), y - 60 * s + i * 24 * s]], { stroke: rgba('#9FE8DA', .8), lwPx: 8 * s }); }
  }
  const heart = (x, y, r) => { const p = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; p.push([x + r * Math.sin(a) ** 3, y - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); } return p; };
  function impact(kind, x, y, k, t, size = 8) {
    if (k <= 0 || k >= 1) return; const s = size / 8, r = 260 * s * backOut(Math.min(1, k * 2.5));
    X.save(); X.globalAlpha *= 1 - k; shape(starPts(x, y, r, .5, 12, t), { fill: `rgb(${GLOW[kind]})`, ...O(5) }); shape(starPts(x, y, r * .55, .5, 12, -t), { fill: '#FFFFFF', stroke: null }); X.restore();
  }

  // ---------- the stadium (a 1920 × 1080 world; draw it inside camBegin) ----------
  const FIELD = { cx: 960, cy: 800, rx: 1000, ry: 240 };
  const depthK = y => clamp((y - 560) / 420, .15, 1.6);         // px-scale factor for things standing on the field at screen y
  function stadium(t, o = {}) {
    const beat = o.beat ?? 0, mood = o.mood ?? 0;                // beat 0..1 (a pulse on the beat), mood 0 night … 1 golden finale
    // the sky
    const g = X.createLinearGradient(0, -500, 0, 700); g.addColorStop(0, mixCol('#0B0F2E', '#3A1E5E', mood)); g.addColorStop(1, mixCol('#2A2160', '#F08A5A', mood));
    X.fillStyle = g; X.fillRect(-1200, -900, 4320, 2000);
    for (let i = 0; i < 120; i++) circle(-600 + hash(i) * 3100, -500 + hash(i + 300) * 900, 1 + 2 * hash(i + 7), { fill: `rgba(255,255,255,${.4 + .5 * Math.abs(Math.sin(t * 1.5 + i))})`, stroke: null });
    for (let i = 0; i < 3; i++) { const y = -120 + i * 90 + 30 * Math.sin(t * .4 + i);                       // aurora ribbons
      shape([[-800, y + 80], [200, y - 40 + 60 * Math.sin(t * .3 + i)], [1200, y + 60], [2700, y - 30]].concat([[2700, y + 50], [1200, y + 140], [200, y + 60], [-800, y + 160]]), { fill: ['rgba(120,255,200,.10)', 'rgba(180,120,255,.10)', 'rgba(255,140,200,.08)'][i], stroke: null, smooth: true }); }
    // the floodlight towers and their beams
    for (const [x, d] of [[60, 1], [1860, -1], [-500, 1], [2420, -1]]) {
      X.save(); X.globalCompositeOperation = 'lighter';
      for (let b = 0; b < 2; b++) { const a = .6 + .25 * Math.sin(t * .7 + b * 2 + x), len = 1600;
        const g2 = X.createLinearGradient(x, 0, x + d * Math.cos(a) * len, Math.sin(a) * len); g2.addColorStop(0, `rgba(255,250,220,${.32 + .2 * beat})`); g2.addColorStop(1, 'rgba(255,250,220,0)');
        X.fillStyle = g2; X.beginPath(); X.moveTo(x, 40); X.lineTo(x + d * Math.cos(a - .09) * len, 40 + Math.sin(a - .09) * len); X.lineTo(x + d * Math.cos(a + .09) * len, 40 + Math.sin(a + .09) * len); X.fill(); }
      X.restore();
      shape(rectPts(x - 14, 40, 28, 600), { fill: '#3A3F5A', ...O(2) }); shape(rectPts(x - 60, 10, 120, 50), { fill: '#FFFBE0', ...O(3), smooth: .2 });
    }
    // the stands: a bowl full of a cheering crowd
    shape(ellPts(960, 640, 1700, 470, 64).filter(p => p[1] <= 700).concat([[2660, 700], [-740, 700]]), { fill: '#232A55', stroke: null, smooth: true });
    for (let r = 0; r < 11; r++) { const rx = lerp(1060, 1660, r / 10), ry = lerp(250, 450, r / 10), n = 34 + r * 6;
      for (let i = 0; i < n; i++) { const a = Math.PI * (.02 + .96 * (i + (r % 2) * .5) / n), x = 960 - Math.cos(a) * rx, y = 650 - Math.sin(a) * ry;
        const h = hash(r * 97 + i), jump = beat * 8 * (hash(r * 31 + i) > .4 ? 1 : 0) * (o.cheer ?? 1);
        circle(x, y - jump, 7 + r * .7, { fill: ['#FF7FB0', '#7FD3FF', '#FFD95A', '#9AE07A', '#C9A8FF', '#FFB27A'][Math.floor(h * 6)], stroke: null });
        if (hash(r * 13 + i + Math.floor(t * 6) * 7) > .985) circle(x, y - 6, 10, { fill: '#FFFFFF', stroke: null, alpha: .9 }); } }      // camera flashes
    // banners along the rail
    for (let i = 0; i < 9; i++) { const x = 180 + i * 195, c = ['#E0533A', '#3D86D8', '#52A83E', '#9A6BD8', '#F2C440'][i % 5];
      shape([[x, 600], [x + 150, 600], [x + 150, 650], [x + 75, 670], [x, 650]], { fill: c, ...O(2) }); }
    // the jumbotron
    X.save(); X.translate(960, -60);
    shape(rectPts(-20, 220, 40, 200), { fill: '#3A3F5A', ...O(2) });
    shape(rectPts(-300, -10, 600, 250), { fill: '#1A1E30', ...O(4), smooth: .05 });
    X.save(); X.beginPath(); X.rect(-280, 10, 560, 210); X.clip(); X.translate(-280, 10);
    if (o.screen) o.screen(t); else { X.fillStyle = '#141A3A'; X.fillRect(0, 0, 560, 210); text('GRAND', 280, 70, 64, C.star, { font: FONT_SFX, weight: 400 }); text('TOURNAMENT', 280, 140, 58, '#FFFFFF', { font: FONT_SFX, weight: 400 }); }
    X.restore(); X.restore();
    // the commentators' booth (left stand): the scene draws the brothers in it with o.booth(x, y)
    X.save(); shape(rectPts(180, 380, 300, 170), { fill: '#3A2E5E', ...O(3), smooth: .05 }); shape(rectPts(196, 396, 268, 120), { fill: '#FFF3D6', stroke: null });
    if (o.booth) { X.save(); X.beginPath(); X.rect(196, 396, 268, 120); X.clip(); o.booth(330, 520); X.restore(); }
    shape(rectPts(180, 500, 300, 50), { fill: '#5A4A8A', ...O(3) }); text('COMMENTARY', 330, 526, 26, '#FFD95A', { weight: 800 }); X.restore();
    // the field
    shape(ellPts(FIELD.cx, FIELD.cy + 30, FIELD.rx + 60, FIELD.ry + 50, 64), { fill: '#3A4470', stroke: null, smooth: true });
    X.save(); X.beginPath(); X.ellipse(FIELD.cx, FIELD.cy, FIELD.rx, FIELD.ry, 0, 0, TAU); X.clip();
    X.fillStyle = mixCol('#3E9A48', '#5DB85A', mood * .5); X.fillRect(-100, 500, 2200, 600);
    for (let i = -6; i < 7; i++) { X.fillStyle = 'rgba(255,255,255,.06)'; X.fillRect(960 + i * 160, 500, 80, 600); }
    X.restore();
    shape(ellPts(FIELD.cx, FIELD.cy, FIELD.rx, FIELD.ry, 64), { fill: null, stroke: `rgba(255,255,255,${.6 + .4 * beat})`, lwPx: 6, smooth: true });
    line([[960, FIELD.cy - FIELD.ry], [960, FIELD.cy + FIELD.ry]], { stroke: 'rgba(255,255,255,.55)', lwPx: 5 });
    shape(ellPts(960, FIELD.cy, 170, 46, 40), { fill: null, stroke: 'rgba(255,255,255,.6)', lwPx: 5, smooth: true });
    shape(starPts(960, FIELD.cy, 60, .45, 5).map(([x, y]) => [x, FIELD.cy + (y - FIELD.cy) * .28]), { fill: `rgba(255,217,90,${.5 + .4 * beat})`, stroke: null });
    // the trainer boxes at the near ends of the field
    for (const x of [300, 1620]) shape(ellPts(x, 960, 170, 34, 30), { fill: 'rgba(255,255,255,.12)', stroke: `rgba(255,217,90,${.7 + .3 * beat})`, lwPx: 5, smooth: true });
  }

  // ---------- the duel close-up: two creatures trading attacks on the beat ----------
  // L, R: creature kinds. bar: seconds per bar; each bar one attack, alternating (first the left one).
  // o: { start: which side attacks first (0 left, 1 right), hpL, hpR (functions of t), title, finisher (both fire at once) }
  function duel(t, t0, bar, L, R, o = {}) {
    const a = t - t0, b = Math.floor(a / bar), p = (a - b * bar) / bar, atkLeft = ((b + (o.start ?? 0)) % 2 === 0) || o.both;
    const ax = W * .27, rx = W * .73, y = H * .6, sc = 10;
    // backdrop: the arena, zoomed and soft (the scene draws it); here a coloured speed field for drama
    for (let i = 0; i < 26; i++) { const yy = hash(i) * H, len = 300 + 400 * hash(i + 3), x = ((hash(i + 7) * W + a * 1800 * (atkLeft ? 1 : -1)) % (W + len)) - len;
      line([[x, yy], [x + len, yy]], { stroke: 'rgba(255,255,255,.10)', lwPx: 4 + 6 * hash(i + 2) }); }
    for (const [x, kind, side] of [[ax, L, 0], [rx, R, 1]]) shape(ellPts(x, y + 150, 260, 54), { fill: 'rgba(0,0,0,.25)', stroke: `rgba(${GLOW[kind]},.9)`, lwPx: 5, smooth: true });
    const wind = seg(p, 0, .25), trav = seg(p, .25, .6), hitk = seg(p, .6, 1);
    const atk = atkLeft ? L : R, def = atkLeft ? R : L, fromX = atkLeft ? ax : rx, toX = atkLeft ? rx : ax;
    // the creatures: the attacker crouches, glows and lunges; the defender flinches on the hit
    for (const [x, kind, isL] of [[ax, L, true], [rx, R, false]]) {
      const me = (isL === atkLeft) || o.both, lunge = me ? Math.sin(clamp(seg(p, .2, .55)) * Math.PI) : 0, crouch = me ? wind * (1 - seg(p, .25, .3)) : 0;
      let cx = x + (isL ? 1 : -1) * 70 * lunge, cy = y + 14 * crouch - (kind === 'puffling' || kind === 'coralia' ? 30 + 10 * Math.sin(t * 3) : 0);
      if (me && kind === 'shelldon' && !o.both) { const r = Math.sin(clamp(trav) * Math.PI); cx = lerp(x, isL ? rx - 150 : ax + 150, r); }
      if (me) aura(kind, cx, cy, 320, (wind * .8 + .2) * (1 - hitk * .7));
      const hit = !me && hitk > 0 && hitk < .5 ? 1 - hitk * 2 : 0;
      creature(kind, cx, cy, sc, t, { flip: !isL, sq: .1 * crouch, hit, glow: me ? wind : 0, rot: me && kind === 'shelldon' && trav > 0 && trav < 1 && !o.both ? trav * 12 * (isL ? 1 : -1) : 0 });
    }
    if (o.both) { fx(L, ax + 120, y - 40, W / 2, y - 40, trav, t); fx(R, rx - 120, y - 40, W / 2, y - 40, trav, t); impact(L, W / 2, y - 40, hitk, t, 12); }
    else { fx(atk, fromX + (atkLeft ? 120 : -120), y - 40, toX, y - 40, trav, t); impact(atk, toX, y - 40, hitk, t); }
    // the HUD: the move name, the HP bars (they drop, but never to zero: nobody faints in this tournament)
    const name = o.both ? 'CLASH!' : MOVE[atk] + '!';
    stamp(name, W / 2, H * .12, 92, '#FFFFFF', pop(t, t0 + b * bar, .3), -.04);
    for (const [x, kind, hp] of [[330, L, o.hpL ? o.hpL(t) : .8], [W - 330, R, o.hpR ? o.hpR(t) : .8]]) {
      X.save(); X.translate(x, H * .25); shape(rectPts(-220, -44, 440, 88), { fill: '#FFF8E6', ...O(5), smooth: .3 });
      text(NAME[kind], -195, -16, 32, C.ink, { align: 'left', weight: 800 });
      shape(rectPts(-195, 10, 390, 20), { fill: '#D9CDB2', stroke: null, smooth: .5 }); shape(rectPts(-195, 10, 390 * clamp(hp), 20), { fill: hp < .4 ? '#E0533A' : '#4DB86A', stroke: null, smooth: .5 });
      X.restore(); }
    if (hitk > 0 && hitk < .25) { X.fillStyle = `rgba(255,255,255,${.5 * (1 - hitk * 4)})`; X.fillRect(0, 0, W, H); }
    return { shake: hitk > 0 && hitk < .5 ? 18 * (1 - hitk * 2) : 0 };
  }

  // ---------- trophies, confetti, fireworks ----------
  function trophy(x, y, h, t, o = {}) {                         // a gold cup standing on (x, y), h px tall
    const s = h / 100; X.save(); X.translate(x, y); X.scale(s, s); X.rotate(o.rot ?? 0);
    shape(rectPts(-30, -18, 60, 18), { fill: '#6A4A2A', ...O(3) }); shape(rectPts(-20, -30, 40, 12), { fill: C.goldDk, ...O(2) });
    shape([[-6, -30], [6, -30], [4, -48], [-4, -48]], { fill: C.gold, ...O(2) });
    shape([[-34, -100], [34, -100], [30, -70], [14, -50], [-14, -50], [-30, -70]], { fill: C.gold, ...O(3), smooth: .3 });
    for (const sd of [-1, 1]) shape([[sd * 32, -94], [sd * 50, -90], [sd * 48, -70], [sd * 26, -62]], { fill: null, stroke: C.goldDk, lwPx: 6 / s * .5, smooth: true });
    shape([[-20, -94], [-10, -94], [-14, -60]], { fill: C.goldLt, stroke: null, alpha: .8 });
    shape(starPts(0, -78, 12, .45, 5), { fill: '#FFFFFF', stroke: null, alpha: .9 });
    if (o.shine) for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.6; shape(starPts(Math.cos(a) * 60, -80 + Math.sin(a) * 50, 10, .3, 4, t * 3), { fill: '#FFFFFF', stroke: null, alpha: .9 }); }
    X.restore();
  }
  function confetti(t, t0, n = 160, o = {}) {
    if (t < t0) return; const a = t - t0;
    for (let i = 0; i < n; i++) { const x0 = (o.x ?? W / 2) + (hash(i) - .5) * (o.spread ?? W * 1.4), vy = 160 + 160 * hash(i + 3), y = -40 + ((hash(i + 5) * 300 + a * vy) % (H + 120)) - (o.burst ? 0 : 0);
      const x = x0 + 40 * Math.sin(a * 2 + i), r = a * (3 + hash(i + 9) * 4) + i;
      X.save(); X.translate(x, y); X.rotate(r); X.scale(1, Math.cos(r * 1.3));
      X.fillStyle = ['#FF7FB0', '#7FD3FF', '#FFD95A', '#9AE07A', '#C9A8FF', '#FFB27A', '#FFFFFF'][i % 7]; X.fillRect(-7, -4, 14, 8); X.restore(); }
  }
  function firework(x, y, t, t0, col, r = 260) {
    const a = t - t0; if (a < 0 || a > 2.2) return;
    if (a < .6) { const u = easeOut(a / .6); circle(x, lerp(H + 50, y, u), 6, { fill: '#FFFFFF', stroke: null }); line([[x, lerp(H + 50, y, u)], [x, lerp(H + 50, y, u) + 60]], { stroke: 'rgba(255,255,255,.5)', lwPx: 3 }); return; }
    const u = easeOut(clamp((a - .6) / 1.2)), fade = 1 - seg(a, 1.2, 2.2);
    for (let i = 0; i < 28; i++) { const ang = i / 28 * TAU, d = r * u, px = x + Math.cos(ang) * d, py = y + Math.sin(ang) * d + 60 * u * u;
      line([[px, py], [x + Math.cos(ang) * d * .8, y + Math.sin(ang) * d * .8 + 50 * u * u]], { stroke: rgba(col, fade), lwPx: 5 }); circle(px, py, 5, { fill: rgba('#FFFFFF', fade), stroke: null }); }
  }

  return { C, ART, NAME, MOVE, GLOW, FIELD, depthK, creature, aura, fx, impact, stadium, duel, trophy, confetti, firework, stamp, heart, pop };
})();
