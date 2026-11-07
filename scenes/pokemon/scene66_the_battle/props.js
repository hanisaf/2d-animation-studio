// scenes/pokemon/scene66_the_battle/props.js: the battle props of scene 66: the playmats, the holographic Pokemon that
// stand on them, the attack inserts (Tidal Splash, Flame Burst, Bubble Beam, Inferno Dive), the knock-out montage, the
// Professor Safadi play and Housam's notebook. Creatures come from scene 64 (PK.ART, PK.card), the Energy, Trainer and
// person cards from scene 65 (DK.card, DK.floor), both through `uses`. Everything is namespaced PB and is a pure
// function of its arguments.
const PB = (() => {
  const C = { ink: '#2B2233', mat: '#2E3F7A', matLt: '#4C63B0', zone: 'rgba(255,255,255,.22)', water: '#3D86D8', waterLt: '#9FD4FF', fire: '#E0533A', fireLt: '#FFB23A',
    holo: '#7FE3FF', gold: '#FFD95A', hp: '#4DB86A', hpLow: '#E0533A' };
  const O = (lw = 1.2) => ({ stroke: C.ink, lwPx: lw });
  const text = (...a) => PK.text(...a);
  const NAME = { fin: 'Captain Fin', dragon: 'Blazewyrm', sprout: 'Sproutbun', star: 'Starpaw' };
  const HP = { fin: 110, dragon: 180, sprout: 60, star: 90 };
  const pop = (t, a, d = .35) => backOut(seg(t, a, a + d));
  function stamp(txt, x, y, size, col, k, rot = -.08, outline = .16) {
    if (k <= 0) return; X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k);
    text(txt, 0, 0, size, col, { font: FONT_SFX, weight: 400, outline: size * outline }); X.restore();
  }

  // ---------- on the floor of the living room ----------
  function onFloor(P, x, z, w, fn) {
    if (!P.visible(z)) return;
    const p0 = P.p(x, .5, z), pu = P.p(x + 1, .5, z), pv = P.p(x, .5, z - 1);   // local +x = world +X, local +y = toward the camera
    X.save(); X.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]); fn(); X.restore();
  }
  // a playmat (150 × 70 world units) centred on (x, z), with the two active cards, the prize cards and the attached Energy.
  // o: { left, right } each { kind, prizes, energy: [kinds], ko (0..1 fading out) }, stadium (0..1 Lava Arena glow), t
  function mat(P, x, z, o) {
    const t = o.t ?? 0;
    onFloor(P, x, z, 150, () => {
      const lava = o.stadium ?? 0;
      shape(rectPts(-75, -35, 150, 70), { fill: lava > 0 ? mixCol(C.mat, '#8A3A22', lava) : C.mat, ...O(1.4), smooth: .04 });
      shape(rectPts(-72, -32, 144, 64), { fill: null, stroke: C.matLt, lwPx: 1 });
      line([[0, -30], [0, 30]], { stroke: C.zone, lwPx: 1 }); circle(0, 0, 9, { fill: null, stroke: C.zone, lwPx: 1 });
      for (const s of [-1, 1]) { shape(rectPts(s * 42 - 9, -12, 18, 24), { fill: null, stroke: C.zone, lwPx: 1, dash: [2, 2] }); }
      if (lava > 0) { X.save(); X.globalAlpha *= lava; for (let i = 0; i < 6; i++) circle(-50 + i * 20, 22 * Math.sin(i * 2.1), 4 + 2 * Math.sin(t * 3 + i), { fill: '#FF8A3A', stroke: null }); X.restore(); }
    });
    for (const [s, side] of [[-1, o.left], [1, o.right]]) { if (!side) continue;
      DK.floor(P, x + s * 42, z, 0, side.kind ? { kind: side.kind, t } : { back: true, t });
      (side.energy || []).forEach((e, i) => DK.floor(P, x + s * (42 - 4 - i * 4), z - 10 - i * 3, s * .3, { kind: e, t }));
      for (let i = 0; i < side.prizes; i++) DK.floor(P, x + s * (63 + (i % 2) * 6), z + 20 - Math.floor(i / 2) * 15, 0, { back: true, t });
    }
    if (o.stadiumCard) DK.floor(P, x, z + 22, .1, { kind: 'stadium', t });
  }

  // ---------- a holographic Pokemon standing over its card ----------
  // (x, z) world spot, flip -1 to face screen-left, k01 0..1 appear, o: { ko 0..1, hit 0..1, dizzy, happy, sc }
  function holo(P, x, z, kind, flip, t, o = {}) {
    if (!P.visible(z)) return;
    const ko = o.ko ?? 0, app = o.k ?? 1; if (app <= 0 || ko >= 1) return;
    const bob = 3 * Math.sin(t * 2.6 + x), jump = o.happy ? 14 * Math.abs(Math.sin(t * 7 + x)) : 0;
    const [fx, fy, k] = P.p(x, 0, z), [sx, sy] = P.p(x, 48 + bob + jump + ko * 25, z), sc = k * (o.sc ?? 1.15) * app * (1 - .6 * ko);
    // the projector glow on the floor and the light cone
    X.save(); X.globalAlpha *= (1 - ko) * .55;
    shape(ellPts(fx, fy, 30 * k, 7 * k), { fill: rgba(C.holo, .5), stroke: null, smooth: true });
    shape([[fx - 26 * k, fy], [fx + 26 * k, fy], [sx + 22 * sc, sy + 8 * sc], [sx - 22 * sc, sy + 8 * sc]], { fill: rgba(C.holo, .18), stroke: null });
    X.restore();
    X.save(); X.translate(sx + (o.hit ? Math.sin(t * 60) * 6 * o.hit : 0), sy); X.rotate(ko * 4 * flip + (o.dizzy ? .25 * Math.sin(t * 5) + .9 * o.dizzy * flip : 0)); X.scale(sc * flip, sc);
    X.globalAlpha *= .92 * (1 - ko); X.shadowColor = o.hit ? '#FFFFFF' : C.holo; X.shadowBlur = 18;
    PK.ART[kind](t); X.restore();
    // scanlines
    X.save(); X.globalAlpha *= .18 * (1 - ko); for (let i = -2; i < 3; i++) line([[sx - 26 * sc, sy + i * 6 * sc + ((t * 30) % (6 * sc))], [sx + 26 * sc, sy + i * 6 * sc + ((t * 30) % (6 * sc))]], { stroke: '#FFFFFF', lwPx: 1 }); X.restore();
    if (o.dizzy) for (let i = 0; i < 3; i++) { const a = t * 5 + i * 2.1; shape(starPts(sx + Math.cos(a) * 18 * sc, sy - 14 * sc + Math.sin(a) * 5 * sc, 4 * sc, .45, 5, a), { fill: C.gold, ...O(1) }); }
    return [sx, sy, sc];
  }

  // ---------- the attack inserts ----------
  function arenaBG(t, o) {
    const lava = o.stadium;
    const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lava ? '#4A1E2A' : '#BFE6FF'); g.addColorStop(.62, lava ? '#C4502E' : '#7FB8E8'); g.addColorStop(.62, lava ? '#5A2A22' : '#7CCB5A'); g.addColorStop(1, lava ? '#2E1612' : '#4E9A38');
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    if (lava) {                                                    // Lava Arena: volcanoes and glowing cracks
      for (const [x, h] of [[260, 300], [1700, 380], [980, 220]]) { shape([[x - 260, H * .62], [x - 40, H * .62 - h], [x + 40, H * .62 - h], [x + 260, H * .62]], { fill: '#6A2E2A', ...O(3) });
        shape([[x - 40, H * .62 - h], [x, H * .62 - h - 40 - 20 * Math.sin(t * 4 + x)], [x + 40, H * .62 - h]], { fill: C.fireLt, stroke: null, smooth: true }); }
      for (let i = 0; i < 9; i++) line([[hash(i) * W, H * .66 + hash(i + 3) * H * .3], [hash(i) * W + 120, H * .7 + hash(i + 5) * H * .28]], { stroke: rgba('#FF8A3A', .6 + .3 * Math.sin(t * 3 + i)), lwPx: 6 });
      for (let i = 0; i < 24; i++) { const y = (H - ((t * 80 + hash(i) * H) % H)); circle(hash(i + 9) * W, y, 3 + 3 * hash(i + 2), { fill: rgba('#FFB23A', .6), stroke: null }); }
    } else {
      for (let i = 0; i < 4; i++) shape(ellPts(((hash(i) * W + t * 20 * (1 + i * .3)) % (W + 400)) - 200, 120 + i * 70, 140, 40, 16), { fill: 'rgba(255,255,255,.75)', stroke: null, smooth: true });
    }
    // the two platforms
    for (const x of [W * .26, W * .74]) shape(ellPts(x, H * .78, 260, 60), { fill: lava ? '#3E1E1A' : '#9AD37A', stroke: PAL.ink, lwPx: 5, smooth: true });
  }
  function hpBar(x, y, kind, hp, max, side) {
    X.save(); X.translate(x, y);
    shape(rectPts(-220, -48, 440, 96), { fill: '#FFF8E6', ...O(5), smooth: .3 });
    text(NAME[kind], -195, -18, 34, C.ink, { align: 'left', weight: 800 }); text(`HP ${Math.max(0, Math.round(hp))}`, 195, -18, 30, '#C0392B', { align: 'right', weight: 800 });
    shape(rectPts(-195, 10, 390, 22), { fill: '#D9CDB2', stroke: null, smooth: .5 });
    const f = clamp(hp / max); if (f > 0) shape(rectPts(-195, 10, 390 * f, 22), { fill: f < .35 ? C.hpLow : C.hp, stroke: null, smooth: .5 });
    X.restore(); void side;
  }
  // o: { atk, def, move, fx: 'wave' | 'fireball' | 'bubbles' | 'dive', dmg, stadium, ko }. The hit lands at t0 + 2.0.
  function insAttack(t, t0, o) {
    const a = t - t0, HIT = 2.0, shake = a > HIT ? 22 * Math.exp(-(a - HIT) * 4) * (o.fx === 'dive' ? 1.8 : 1) : 0;
    X.save(); X.translate(shake * Math.sin(a * 70), shake * Math.cos(a * 53));
    arenaBG(t, o);
    const ax = W * .26, dx = W * .74, py = H * .6, sc = 8.5;
    // the attacker: pops in, crouches (anticipation), then lunges
    const ap = pop(t, t0, .4), crouch = seg(a, .5, 1.0) * (1 - seg(a, 1.0, 1.15)), lunge = Math.sin(clamp(seg(a, 1.0, 1.6)) * Math.PI);
    let axx = ax + 70 * lunge, ayy = py + 14 * crouch;
    if (o.fx === 'dive') { const up = ease(seg(a, .8, 1.3)), dn = easeIn(seg(a, 1.4, HIT)); axx = lerp(ax, lerp(ax - 100, dx - 40, dn), up > 0 ? 1 : 0) ; ayy = py - up * 900 + dn * 900;
      if (a > HIT) { axx = lerp(dx - 40, ax, ease(seg(a, HIT + .4, HIT + 1.2))); ayy = py - 160 * Math.sin(clamp(seg(a, HIT + .4, HIT + 1.2)) * Math.PI); }
      if (dn > 0 && dn < 1) for (let i = 0; i < 10; i++) { const f = i / 10; circle(lerp(ax - 100, axx, f) + 20 * Math.sin(i), lerp(py - 900, ayy, f), 60 * (1 - f) + 10, { fill: i % 2 ? C.fire : C.fireLt, stroke: null, alpha: .7 }); } }
    // charge glow
    const charge = seg(a, .4, 1.0) * (1 - seg(a, 1.2, 1.5));
    if (charge > 0) { const g = X.createRadialGradient(axx, ayy, 20, axx, ayy, 360); const c = o.fx === 'wave' || o.fx === 'bubbles' ? '120,200,255' : '255,170,60';
      g.addColorStop(0, `rgba(${c},${.8 * charge})`); g.addColorStop(1, `rgba(${c},0)`); X.fillStyle = g; X.fillRect(0, 0, W, H); }
    // Tidal Splash: a curling wave rolls across and Captain Fin surfs its crest
    const uW = seg(a, 1.1, HIT);
    if (o.fx === 'wave' && uW > 0 && a < HIT + .5) { const x = lerp(ax - 200, dx + 160, uW), hh = 360 + 40 * Math.sin(uW * 3), fade = 1 - seg(a, HIT, HIT + .5);
      const top = []; for (let i = 0; i <= 12; i++) { const f = i / 12; top.push([x - 1100 + f * 1100, py - hh * (.25 + .75 * f * f) + 18 * Math.sin(f * 14 + t * 8)]); }
      X.save(); X.globalAlpha *= .9 * fade;
      shape([[x - 1100, H + 40], ...top, [x + 70, py - hh * .95], [x + 130, py - hh * .7], [x + 70, py - hh * .55], [x + 20, py - hh * .7], [x + 40, py - hh * .35], [x + 60, H + 40]], { fill: C.water, ...O(6), smooth: true });
      shape(top.slice(3).map(([px, pyy]) => [px, pyy + 40]).concat([[x + 20, py - hh * .5], [x - 300, py - hh * .1]]), { fill: C.waterLt, stroke: null, smooth: true, alpha: .55 });
      for (let i = 0; i < 14; i++) circle(x - 40 + 170 * (hash(i) - .5), py - hh * .95 + 140 * hash(i + 4) + 10 * Math.sin(t * 9 + i), 12 + 14 * hash(i + 8), { fill: '#FFFFFF', ...O(2) });
      X.restore();
      if (a < HIT) { axx = x - 120; ayy = py - hh - 10 + 12 * Math.sin(t * 9); } }
    X.save(); X.translate(axx, ayy); X.scale(sc * ap * (1 + .08 * crouch), sc * ap * (1 - .1 * crouch)); PK.ART[o.atk](t); X.restore();
    // the defender: shakes on the hit, then gets knocked out
    const kot = o.ko ? ease(seg(a, HIT + .6, HIT + 1.4)) : 0, hit = a > HIT && a < HIT + .6 ? 1 : 0;
    if (kot < 1) { X.save(); X.translate(dx + (hit ? Math.sin(a * 80) * 16 : 0) + kot * 500, py - kot * 420); X.rotate(-kot * 8); X.scale(-sc * (1 - kot * .6), sc * (1 - kot * .6));
      if (hit) { X.shadowColor = '#FFFFFF'; X.shadowBlur = 40; } PK.ART[o.def](t); X.restore(); }
    // the effect
    const u = seg(a, 1.1, HIT);
    if (u > 0 && a < HIT + .3) {
      if (o.fx === 'fireball') { const x = lerp(ax + 220, dx - 80, u), y = py - 80 - 120 * Math.sin(u * Math.PI), r = 90 + 60 * u;
        for (let i = 0; i < 14; i++) { const f = i / 14; circle(x - f * 380, y + 30 * Math.sin(i * 1.7 + t * 10) * f, r * (1 - f * .8), { fill: i % 2 ? C.fire : C.fireLt, stroke: null, alpha: .85 - f * .5 }); }
        circle(x, y, r, { fill: C.fireLt, ...O(5) }); circle(x + 10, y - 8, r * .55, { fill: '#FFF1A0', stroke: null }); }
      if (o.fx === 'bubbles') for (let i = 0; i < 22; i++) { const f = clamp(u * 1.6 - i * .03); if (f <= 0) continue; const x = lerp(ax + 200, dx, f), y = py - 60 + 70 * Math.sin(f * 9 + i), r = 26 + 22 * hash(i);
        circle(x, y, r, { fill: 'rgba(159,212,255,.55)', stroke: '#FFFFFF', lwPx: 4 }); circle(x - r * .35, y - r * .35, r * .22, { fill: '#FFFFFF', stroke: null }); }
    }
    // the hit: a flash, a burst and the damage number
    if (a > HIT && a < HIT + .35) { X.fillStyle = `rgba(255,255,255,${.7 * (1 - (a - HIT) / .35)})`; X.fillRect(-60, -60, W + 120, H + 120); }
    if (a > HIT) { const b = pop(t, t0 + HIT, .3); if (a < HIT + .9) shape(starPts(dx, py - 40, 330 * b, .5, 12, t), { fill: o.fx === 'wave' || o.fx === 'bubbles' ? '#CFE9FF' : '#FFD27A', ...O(6), alpha: 1 - seg(a, HIT + .5, HIT + .9) });
      stamp(`-${o.dmg}`, dx + 230, py - 150 - 60 * seg(a, HIT, HIT + 1.5), 120, '#FF5A5A', b, .08); }
    X.restore();
    // the HUD: the move name and both HP bars (not shaken)
    stamp(o.move, W / 2, H * .1, 96, '#FFFFFF', pop(t, t0 + .3, .4), -.04);
    hpBar(330, H * .24, o.atk, HP[o.atk], HP[o.atk], -1);
    hpBar(W - 330, H * .24, o.def, lerp(HP[o.def], HP[o.def] - o.dmg, ease(seg(a, HIT, HIT + .7))), HP[o.def], 1);
    if (o.stadium) { X.save(); X.translate(W / 2, H * .2); shape(rectPts(-170, -26, 340, 52), { fill: '#3FA24A', ...O(4), smooth: .4 }); text('LAVA ARENA: +30', 0, 2, 30, '#FFFFFF', { weight: 800 }); X.restore(); }
    if (o.ko && a > HIT + 1.1) stamp('KNOCKED OUT!', W * .62, H * .55, 120, '#FFD95A', pop(t, t0 + HIT + 1.1, .4), -.06);
  }

  // the knock-out montage: two columns of cards; each gets a KO stamp, the prize counters tick down to 1
  function insMontage(t, t0, kos) {
    const g = X.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#CFE4FF'); g.addColorStop(.5, '#EADCFF'); g.addColorStop(.5, '#FFE2CF'); g.addColorStop(1, '#FFD0BE');
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    line([[W / 2, 0], [W / 2, H]], { stroke: PAL.ink, lwPx: 8 });
    stamp('AND IT KEEPS GOING...', W / 2, H * .08, 70, '#FFFFFF', pop(t, t0, .4), -.03);
    for (const [col, cx, mine, theirs, who] of [[0, W * .25, 'fin', ['sprout', 'star', 'sprout'], 'ALMA'], [1, W * .75, 'dragon', ['dragon', 'dragon', 'dragon'], 'HOUSAM']]) {
      card(cx - 300, H * .55, 300, -.08 + .03 * Math.sin(t * 3), { kind: mine, t, holo: .8, shadow: true });
      theirs.forEach((kd, i) => { const at = kos[col][i], k = pop(t, at - .5, .3); if (k <= 0) return;
        const x = cx + 30 + i * 120, y = H * .5 + i * 50; card(x, y, 220 * k, (i - 1) * .12, { kind: kd, t, shadow: true });
        if (t > at) { stamp('KO!', x, y, 90, '#FF5A5A', pop(t, at, .25), -.2); } });
      const left = 4 - kos[col].filter(a => t > a).length;
      X.save(); X.translate(cx, H * .88); shape(rectPts(-260, -46, 520, 92), { fill: '#FFF8E6', ...O(5), smooth: .4 });
      text(`${who}'S PRIZES LEFT:`, -30, 3, 34, PAL.ink, { weight: 800 }); stamp(String(left), 205, 4, 70, left <= 1 ? '#E0533A' : '#2F8A48', 1 + .3 * kick(t, Math.max(...kos[col].filter(a => t > a), -9), 8), 0, .12); X.restore();
    }
  }
  const card = (...a) => DK.card(...a);

  // the Professor Safadi play: the card flips in, a giant holographic professor rises, the other Pokemon faint
  function insSafadi(t, t0) {
    const a = t - t0;
    X.fillStyle = '#140E24'; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 18; i++) { const r = a * 600 - i * 130; if (r < 0) continue; circle(W / 2, H * .5, r, { fill: null, stroke: rgba('#FFD66B', .25 * Math.max(0, 1 - r / 1800)), lwPx: 6 }); }
    // the giant professor behind
    const rise = ease(seg(a, .8, 2.0));
    if (rise > 0) { X.save(); X.globalAlpha *= .9 * rise;
      safadi(W / 2, H + 760 - 260 * rise, 44, { t, power: 1, eyes: a > 1.6 ? 'glow' : 'open', mouth: speaking('safadi', t) ? lipFlap(t, true, 'grin') : 'grin', brows: 'up', handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', lookX: 0, lookY: .1, bulb: backOut(seg(a, 1.8, 2.1)) });
      X.restore(); }
    // the card, flipping in
    const flip = seg(a, 0, .6), sx = Math.abs(Math.cos(flip * Math.PI)) * (flip < 1 ? 1 : 1), back = flip < .5;
    const ck = 1 - ease(seg(a, 1.6, 2.2)) * .62, cy = lerp(H * .48, H * .87, ease(seg(a, 1.6, 2.2)));
    X.save(); X.translate(W / 2, cy); X.scale(Math.max(.02, sx), 1); card(0, 0, 420 * ck, 0, back ? { back: true, t } : { kind: 'safadi', t, holo: 1 }); X.restore();
    if (a > .55 && a < 1.0) { X.fillStyle = `rgba(255,250,220,${.8 * (1 - seg(a, .55, 1.0))})`; X.fillRect(0, 0, W, H); }
    // the opponents' Pokemon get dizzy and fall over; the YOU WIN! stamps
    for (const [x, kind, s] of [[W * .14, 'fin', 1], [W * .86, 'dragon', -1]]) {
      const fall = ease(seg(a, 3.0, 3.6)); X.save(); X.translate(x, H * .72 + fall * 40); X.rotate(fall * 1.4 * s); X.scale(5.5 * s, 5.5); X.globalAlpha *= .9; PK.ART[kind](t); X.restore();
      if (a > 2.2 && a < 3.6) for (let i = 0; i < 3; i++) { const q = t * 6 + i * 2.1; shape(starPts(x + Math.cos(q) * 110, H * .6 + Math.sin(q) * 26, 24, .45, 5, q), { fill: C.gold, ...O(2) }); }
    }
    stamp('JENNA WINS!', W * .22, H * .2, 92, '#FF7FB0', pop(t, t0 + 3.7, .4), -.08);
    stamp('DANNY WINS!', W * .78, H * .2, 92, '#7FD3FF', pop(t, t0 + 3.9, .4), .08);
  }
  const speaking = (who, t) => SPEAK && SPEAK(who, t);
  let SPEAK = null;

  // Housam's notebook: the Pokedex list, and two cards that are NOT in it
  function insNotebook(t, t0) {
    X.fillStyle = '#5B3A2A'; X.fillRect(0, 0, W, H);
    const k = pop(t, t0, .45), zoom = 1 + .06 * seg(t, t0, t0 + 4);
    X.save(); X.translate(W / 2, H / 2); X.scale(k * zoom, k * zoom); X.rotate(-.02);
    shape(rectPts(-820, -470, 1640, 940), { fill: '#2F4C9A', ...O(6), smooth: .02 });
    for (const s of [-1, 1]) { shape(rectPts(s < 0 ? -790 : 10, -440, 780, 880), { fill: '#FFFDF4', ...O(3) });
      for (let i = 0; i < 15; i++) line([[s < 0 ? -760 : 40, -330 + i * 52], [s < 0 ? -40 : 760, -330 + i * 52]], { stroke: '#BFD3EE', lwPx: 2 }); }
    for (let i = 0; i < 8; i++) circle(0, -380 + i * 108, 12, { fill: '#C9D1D8', ...O(2) });
    text('POKEDEX', -400, -380, 70, '#C8403A', { font: FONT_SFX, weight: 400 });
    ['Captain Fin', 'Blazewyrm', 'Sproutbun', 'Starpaw'].forEach((s, i) => { const at = t0 + .5 + i * .3; if (t < at) return; const y = -270 + i * 104;
      text(`${i + 1}. ${s}`, -700, y, 54, '#2B2233', { align: 'left', weight: 700 }); const c = pop(t, at, .25);
      X.save(); X.translate(-150, y); X.scale(c, c); line([[-22, 0], [-6, 20], [26, -24]], { stroke: '#3F9B4F', lwPx: 10 }); X.restore(); });
    text('Look up:', 400, -380, 56, '#2F5DB0', { weight: 800 });
    [['Professor Safadi', 'safadi'], ['Doctor Sami', 'sami']].forEach(([s, kd], i) => { const at = t0 + 1.8 + i * .7; if (t < at) return; const y = -200 + i * 330;
      card(160, y + 30, 150, -.06, { kind: kd, t });
      text(s, 270, y - 20, 50, '#2B2233', { align: 'left', weight: 700 });
      const c = pop(t, at + .3, .3); if (c > 0) { X.save(); X.translate(470, y + 60); X.scale(c, c); X.rotate(-.1);
        shape(rectPts(-200, -40, 400, 80), { fill: null, stroke: '#E0413A', lwPx: 8, smooth: .5 }); text('NOT FOUND!', 0, 4, 56, '#E0413A', { font: FONT_SFX, weight: 400 }); X.restore(); } });
    X.restore();
  }

  // a small open notebook held in screen space (centre x, y, width w px)
  function notebook(x, y, w, ang, t) {
    X.save(); X.translate(x, y); X.rotate(ang); X.scale(w / 100, w / 100);
    shape(rectPts(-50, -34, 100, 68), { fill: '#2F4C9A', ...O(2), smooth: .04 });
    for (const s of [-1, 1]) { shape(rectPts(s < 0 ? -47 : 1, -31, 46, 62), { fill: '#FFFDF4', ...O(1) }); for (let i = 0; i < 6; i++) line([[s < 0 ? -43 : 5, -20 + i * 9], [s < 0 ? -5 : 43, -20 + i * 9]], { stroke: '#BFD3EE', lwPx: 1 }); }
    text('POKEDEX', -24, -25, 7, '#C8403A', { font: FONT_SFX, weight: 400 });
    const f = (t * 1.3) % 1; if (Math.floor(t * 1.3) % 3 === 0) shape([[0, -31], [lerp(46, -46, f), -31 - 10 * Math.sin(f * Math.PI)], [lerp(46, -46, f), 31 - 10 * Math.sin(f * Math.PI)], [0, 31]], { fill: '#F4F1E6', ...O(1) });   // a page flips
    X.restore();
  }

  return { C, HP, mat, holo, insAttack, insMontage, insSafadi, insNotebook, notebook, stamp, setSpeaking: f => { SPEAK = f; } };
})();
