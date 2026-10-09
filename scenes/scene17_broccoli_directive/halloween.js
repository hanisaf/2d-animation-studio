// scenes/scene17_broccoli_directive/halloween.js: motion-graphics backdrops and props for the Broccoli Directive music video.
// Everything is drawn in screen px and is a pure function of its arguments (and t). Names are prefixed bd (Broccoli Directive).

const BD = {
  ink: '#2A1726', night: '#1B1033', violet: '#3B1F5C', plum: '#5A2B78', orange: '#F28C28', orangeDk: '#C45E12', orangeLt: '#FFC266',
  green: '#6CC24A', greenDk: '#3E8E2E', greenLt: '#B6F07A', slime: '#9BEA5A', red: '#FF2E2E', moon: '#FFF2C4', bone: '#EDE6D8',
  stone: '#7E7A92', stoneDk: '#56526A', pink: '#FF8FC8', teal: '#2BB3A8', cream: '#FFF8EC',
};

// ---------- skies and backdrops ----------
function bdSky(c0, c1, c2) { shape(rectPts(-20, -20, W + 40, H + 40), { fill: linGrad(0, 0, 0, H, c2 ? [[0, c0], [.6, c1], [1, c2]] : [[0, c0], [1, c1]]), stroke: null }); }
function bdStars(t, n = 90, seed = 1, yMax = H * .7) {
  for (let i = 0; i < n; i++) {
    const x = hash(i * 3.1 + seed) * W, y = hash(i * 7.7 + seed) * yMax, tw = .5 + .5 * Math.sin(t * (1.5 + hash(i) * 3) + i), r = 1.2 + hash(i * 1.3) * 2.4;
    circle(x, y, r * (.6 + .4 * tw), { fill: rgba('#FFF6D8', .45 + .55 * tw), stroke: null });
  }
}
function bdMoon(x, y, r, glow = 1) {
  circle(x, y, r * 2.4, { fill: radGrad(x, y, r * .8, r * 2.4, [[0, rgba(BD.moon, .35 * glow)], [1, rgba(BD.moon, 0)]]), stroke: null });
  circle(x, y, r, { fill: radGrad(x - r * .3, y - r * .3, r * .1, r, [[0, '#FFFBE6'], [1, BD.moon]]), stroke: null });
  [[-.35, -.2, .18], [.3, .25, .13], [.1, -.45, .09], [-.15, .42, .11]].forEach(([a, b, c]) => circle(x + a * r, y + b * r, c * r, { fill: 'rgba(214,196,150,.45)', stroke: null }));
}
// A bat at (x, y), s = px per unit (wingspan ≈ 8 units), flapping with phase ph.
function bdBat(x, y, s, t, ph = 0, col = '#140A1C') {
  const f = Math.sin(t * 14 + ph * 7), wy = -1.6 * f;
  X.save(); X.translate(x, y); X.scale(s, s);
  [-1, 1].forEach(sd => shape([[0, 0], [sd * 1.2, -.8 + wy * .4], [sd * 2.6, -1.2 + wy], [sd * 4, -.4 + wy * 1.1], [sd * 3.3, .3 + wy * .5], [sd * 2.6, .1 + wy * .4], [sd * 2.0, .6 + wy * .3], [sd * 1.2, .3]], { fill: col, stroke: null }));
  ellipse(0, .1, .7, .9, { fill: col, stroke: null });
  [-1, 1].forEach(sd => shape([[sd * .15, -.6], [sd * .55, -1.3], [sd * .5, -.4]], { fill: col, stroke: null }));
  X.restore();
}
function bdBats(t, n, o = {}) {
  const sp = o.speed ?? 160, s0 = o.s ?? 9, y0 = o.y ?? 200, col = o.col;
  for (let i = 0; i < n; i++) {
    const L = W + 400, x = ((hash(i * 4.2) * L + t * sp * (.7 + hash(i) * .6)) % L) - 200, y = y0 + (hash(i * 9.1) - .5) * (o.spread ?? 260) + Math.sin(t * 2 + i) * 30;
    bdBat(o.dir === -1 ? W - x : x, y, s0 * (.6 + hash(i * 2.2) * .7), t, i, col);
  }
}
// Rolling hill silhouette across the frame. scroll in px (moves it left).
function bdHill(yBase, amp, col, ph = 0, scroll = 0, wl = 900) {
  const pts = [[-20, H + 20]];
  for (let x = -20; x <= W + 40; x += 40) pts.push([x, yBase - amp * (.6 * Math.sin((x + scroll) / wl * TAU + ph) + .4 * Math.sin((x + scroll) / wl * TAU * 2.3 + ph * 2))]);
  pts.push([W + 40, H + 20]); shape(pts, { fill: col, stroke: null });
}
function bdHillY(x, yBase, amp, ph = 0, scroll = 0, wl = 900) { return yBase - amp * (.6 * Math.sin((x + scroll) / wl * TAU + ph) + .4 * Math.sin((x + scroll) / wl * TAU * 2.3 + ph * 2)); }
// Tombstone: (x, y) = base centre, s = px per unit (≈ 10 units tall). kind 0 round, 1 cross, 2 slab.
function bdTomb(x, y, s, kind = 0, o = {}) {
  X.save(); X.translate(x, y); X.rotate(o.rot || 0); X.scale(s, s);
  const fill = o.fill ?? BD.stone, dk = o.dark ?? BD.stoneDk, lw = o.lw ?? clamp(s * .2, 1.2, 4) / s;
  if (kind === 1) {
    shape([[-1, 0], [-1, -6], [-3, -6], [-3, -8], [-1, -8], [-1, -10.5], [1, -10.5], [1, -8], [3, -8], [3, -6], [1, -6], [1, 0]], { fill, stroke: BD.ink, lw });
  } else if (kind === 2) {
    shape(rectPts(-3.5, -7, 7, 7), { fill, stroke: BD.ink, lw, smooth: .1 });
    line([[-2, -5], [2, -5]], { stroke: dk, lw: lw * 1.2 }); line([[-2, -3.6], [1.2, -3.6]], { stroke: dk, lw: lw * 1.2 });
  } else {
    shape([[-3.2, 0], [-3.2, -6.5], [-2.6, -8.6], [0, -9.6], [2.6, -8.6], [3.2, -6.5], [3.2, 0]], { fill, stroke: BD.ink, lw, smooth: .35 });
    line([[-1.6, -6.6], [1.6, -6.6]], { stroke: dk, lw: lw * 1.3 }); line([[0, -7.8], [0, -4.6]], { stroke: dk, lw: lw * 1.3 });
  }
  shape([[-3.6, .2], [3.6, .2], [3, -.6], [-3, -.6]], { fill: '#3C5A2C', stroke: null });
  X.restore();
}
// Haunted house silhouette: (x, y) = base centre, s = px per unit (≈ 40 units tall). Windows glow and flicker.
function bdHouse(x, y, s, t, col = '#160C24', win = '#FFB84A') {
  X.save(); X.translate(x, y); X.scale(s, s);
  shape([[-16, 0], [-16, -18], [-19, -18], [-10, -30], [-1, -18], [-4, -18], [-4, -22], [4, -22], [4, -26], [10, -38], [16, -26], [16, 0]], { fill: col, stroke: null });
  shape(rectPts(11, -36, 2, 6), { fill: col, stroke: null });
  [[-12, -14], [-7, -14], [-12, -7], [7, -18], [11, -18], [7, -10], [11, -10], [9, -28]].forEach(([wx, wy], i) => {
    const fl = .6 + .4 * Math.sin(t * (3 + hash(i) * 4) + i * 2);
    shape(rectPts(wx - 1.3, wy - 1.8, 2.6, 3.6), { fill: hash(i * 5.5) > .3 ? rgba(win, .55 + .45 * fl) : '#2B1A3A', stroke: null });
  });
  shape([[-1.5, 0], [-1.5, -4.5], [0, -5.5], [1.5, -4.5], [1.5, 0]], { fill: '#2B1A3A', stroke: null });
  X.restore();
}
// Jack-o'-lantern: (x, y) = base centre, r = radius px. o: face (0..2), glow 0..1, sq (squash), rot, blink.
function bdPumpkin(x, y, r, o = {}) {
  const sq = o.sq || 0, lw = clamp(r * .06, 1.5, 4.5);
  X.save(); X.translate(x, y); X.rotate(o.rot || 0); X.scale(1 + sq * .4, 1 - sq);
  const cy = -r * .85, g = o.glow ?? 1;
  if (g > .02) circle(0, cy, r * 1.9, { fill: radGrad(0, cy, r * .5, r * 1.9, [[0, rgba(BD.orangeLt, .35 * g)], [1, rgba(BD.orangeLt, 0)]]), stroke: null });
  [[-.55, .62], [.55, .62], [-.25, .78], [.25, .78], [0, .8]].forEach(([dx, w], i) => ellipse(dx * r, cy, r * w, r * .85, { fill: i < 2 ? BD.orangeDk : i < 4 ? BD.orange : '#FF9E3D', stroke: BD.ink, lwPx: lw }));
  shape([[-r * .08, cy - r * .8], [r * .1, cy - r * .8], [r * .22, cy - r * 1.15], [r * .05, cy - r * 1.18]], { fill: '#4E7A2E', stroke: BD.ink, lwPx: lw });
  if (o.face !== -1) {
    const glowC = mixCol('#5A2A06', '#FFE07A', g), fk = o.face || 0, bl = o.blink ? .2 : 1;
    [-1, 1].forEach(sd => shape([[sd * r * .18, cy - r * .12 * bl], [sd * r * .48, cy - r * .12 * bl], [sd * r * .33, cy - r * .42 * bl]], { fill: glowC, stroke: BD.ink, lwPx: lw * .7 }));
    shape([[-r * .07, cy + r * .05], [r * .07, cy + r * .05], [0, cy - r * .1]], { fill: glowC, stroke: BD.ink, lwPx: lw * .6 });
    const m = fk === 1 ? [[-.5, .2], [-.3, .35], [-.15, .28], [0, .42], [.15, .28], [.3, .35], [.5, .2], [.35, .55], [.15, .48], [0, .6], [-.15, .48], [-.35, .55]]
      : fk === 2 ? [[-.25, .3], [.25, .3], [.3, .55], [0, .65], [-.3, .55]]
      : [[-.5, .22], [-.2, .32], [-.1, .25], [.1, .25], [.2, .32], [.5, .22], [.3, .5], [0, .58], [-.3, .5]];
    shape(m.map(([a, b]) => [a * r, cy + b * r]), { fill: glowC, stroke: BD.ink, lwPx: lw * .7 });
  }
  X.restore();
}
function bdFog(t, y, col = '#C9B8F0', a = .25, speed = 40) {
  for (let i = 0; i < 9; i++) {
    const L = W + 700, x = ((i * 260 + t * speed * (.6 + hash(i) * .8)) % L) - 350, r = 180 + hash(i * 3) * 160;
    ellipse(x, y + Math.sin(t * .7 + i) * 14, r, r * .32, { fill: radGrad(x, y, 10, r, [[0, rgba(col, a)], [1, rgba(col, 0)]]), stroke: null });
  }
}
function bdSunburst(cx, cy, t, a, b, n = 18, spin = .15, R = 2600) {
  shape(rectPts(-20, -20, W + 40, H + 40), { fill: a, stroke: null });
  for (let i = 0; i < n; i++) {
    const a0 = t * spin + i / n * TAU, a1 = a0 + TAU / n / 2;
    shape([[cx, cy], [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R]], { fill: b, stroke: null });
  }
  circle(cx, cy, 900, { fill: radGrad(cx, cy, 50, 900, [[0, 'rgba(255,255,255,.28)'], [1, 'rgba(255,255,255,0)']]), stroke: null });
}
function bdHazard(t, a = '#16101C', b = BD.orange, w = 90, speed = 120) {
  shape(rectPts(-20, -20, W + 40, H + 40), { fill: a, stroke: null });
  const off = (t * speed) % (w * 2);
  for (let x = -H - w * 2; x < W + w * 2; x += w * 2) shape([[x + off, -10], [x + off + w, -10], [x + off + w + H + 20, H + 10], [x + off + H + 20, H + 10]], { fill: b, stroke: null });
}
// Halftone dots (a comic-book texture over a flat backdrop).
function bdDots(col, a = .18, step = 34, r = 6, t = 0) {
  X.save(); X.globalAlpha = a; X.fillStyle = col;
  for (let y = 0; y < H + step; y += step) for (let x = (y / step % 2) * step / 2 - step; x < W + step; x += step) {
    const rr = r * (.6 + .4 * Math.sin(x * .004 + y * .006 + t * 2)); X.beginPath(); X.arc(x, y, Math.max(.5, rr), 0, TAU); X.fill();
  }
  X.restore();
}
function bdSpeedLines(t, col = 'rgba(255,255,255,.5)', dir = -1, n = 26, y0 = 0, y1 = H) {
  for (let i = 0; i < n; i++) {
    const y = y0 + hash(i * 5.3) * (y1 - y0), len = 200 + hash(i * 2.1) * 500, L = W + len * 2, x = ((hash(i * 3.3) * L + t * 2600 * (.7 + hash(i) * .6)) % L) - len;
    const xx = dir < 0 ? W - x : x;
    line([[xx, y], [xx + dir * len, y]], { stroke: col, lwPx: 3 + hash(i) * 5, cap: 'round' });
  }
}
function bdDust(x, y, r, age, col = '#E9DCC8') {
  if (age < 0 || age > .9) return;
  const k = easeOut(age / .9);
  for (let i = 0; i < 6; i++) { const a = Math.PI + i / 5 * Math.PI, d = r * (.4 + k * 1.3);
    X.save(); X.globalAlpha = 1 - k; circle(x + Math.cos(a) * d, y + Math.sin(a) * d * .35 - k * r * .3, r * (.35 + k * .5), { fill: col, stroke: BD.ink, lwPx: 2.5 }); X.restore(); }
}
// Confetti (broccoli florets or candy) falling over the frame.
function bdConfetti(t, t0, kind = 'broccoli', n = 40) {
  const age = t - t0; if (age < 0) return;
  for (let i = 0; i < n; i++) {
    const x = hash(i * 2.7) * W + Math.sin(age * 2 + i) * 40, y = -80 + (age * (260 + hash(i) * 260) + hash(i * 6.1) * 600) % (H + 200) - (age < 2 ? (1 - age / 2) * 300 * hash(i) : 0);
    if (kind === 'broccoli') bdBroccoli(x, y, 9 + hash(i) * 6, age * (2 + hash(i) * 3) + i);
    else bdCandy(x, y, 16 + hash(i) * 10, ['wrap', 'corn', 'lolly', 'bar'][i % 4], age * 3 + i);
  }
}

// ---------- props ----------
// Broccoli: (x, y) = bottom of the stem, s = px per unit (≈ 6.5 units tall), rot = rad from upright.
function bdBroccoli(x, y, s, rot = 0, o = {}) {
  const lw = clamp(s * .16, 1.2, 5) / s;
  X.save(); X.translate(x, y); X.rotate(rot); X.scale(s, s); if (o.alpha != null) X.globalAlpha *= o.alpha;
  shape([[-.55, 0], [.55, 0], [.75, -2.6], [1.6, -3.2], [-1.6, -3.2], [-.75, -2.6]], { fill: '#8CC266', stroke: BD.ink, lw, smooth: .2 });
  line([[0, -.3], [0, -2.4]], { stroke: '#B8E08C', lw: lw * 1.6 });
  [[-1.55, -3.6, 1.15], [1.55, -3.6, 1.15], [0, -4.5, 1.35], [-.85, -5.3, 1.0], [.9, -5.3, 1.0], [0, -3.4, 1.0]].forEach(([bx, by, r]) => {
    circle(bx, by, r, { fill: BD.greenDk, stroke: BD.ink, lw });
    circle(bx - r * .15, by - r * .15, r * .72, { fill: BD.green, stroke: null });
    circle(bx - r * .35, by - r * .35, r * .3, { fill: BD.greenLt, stroke: null });
  });
  X.restore();
}
// Candy: (x, y) centre, s = px size, kind: 'wrap' | 'lolly' | 'corn' | 'bar' | 'cane', rot rad.
function bdCandy(x, y, s, kind = 'wrap', rot = 0, col) {
  const lw = clamp(s * .12, 1.2, 4);
  X.save(); X.translate(x, y); X.rotate(rot);
  if (kind === 'wrap') {
    const c = col ?? ['#FF5C8A', '#4FC3F7', '#FFD54F', '#AB7CFF'][Math.floor(hash(Math.round(x * 7 + y)) * 4)];
    [-1, 1].forEach(sd => shape([[sd * s * .45, 0], [sd * s * .95, -s * .42], [sd * s * .85, 0], [sd * s * .95, s * .42]], { fill: c, stroke: BD.ink, lwPx: lw }));
    ellipse(0, 0, s * .5, s * .38, { fill: c, stroke: BD.ink, lwPx: lw });
    line([[-s * .22, -s * .14], [s * .1, -s * .22]], { stroke: 'rgba(255,255,255,.7)', lwPx: lw });
  } else if (kind === 'lolly') {
    line([[0, 0], [0, s * 1.3]], { stroke: BD.ink, lwPx: lw * 3 }); line([[0, 0], [0, s * 1.3]], { stroke: '#FFFFFF', lwPx: lw * 1.4 });
    circle(0, 0, s * .6, { fill: col ?? '#FF7AB6', stroke: BD.ink, lwPx: lw });
    const sp = []; for (let i = 0; i <= 30; i++) { const a = i * .45, r = i / 30 * s * .55; sp.push([Math.cos(a) * r, Math.sin(a) * r]); }
    line(sp, { stroke: '#FFFFFF', lwPx: lw * 1.1, smooth: true });
  } else if (kind === 'corn') {
    shape([[-s * .5, s * .45], [s * .5, s * .45], [0, -s * .6]], { fill: '#FFF4E0', stroke: BD.ink, lwPx: lw, smooth: .25 });
    shape([[-s * .5, s * .45], [s * .5, s * .45], [s * .3, 0], [-s * .3, 0]], { fill: '#FFC93C', stroke: null });
    shape([[-s * .53, s * .45], [s * .53, s * .45], [s * .45, s * .2], [-s * .45, s * .2]], { fill: '#FF8A1F', stroke: null });
    shape([[-s * .5, s * .45], [s * .5, s * .45], [0, -s * .6]], { fill: null, stroke: BD.ink, lwPx: lw, smooth: .25 });
  } else if (kind === 'bar') {
    shape(rectPts(-s * .75, -s * .38, s * 1.5, s * .76), { fill: '#6B3A1E', stroke: BD.ink, lwPx: lw, smooth: .1 });
    shape(rectPts(-s * .2, -s * .4, s * .95, s * .8), { fill: col ?? '#E0383E', stroke: BD.ink, lwPx: lw });
    line([[s * .05, -s * .12], [s * .55, -s * .12]], { stroke: '#FFE08A', lwPx: lw * 1.2 });
  } else if (kind === 'cane') {
    const pts = [[0, s * .8], [0, -s * .3], [-.05 * s, -s * .55], [-s * .3, -s * .72], [-s * .55, -s * .55], [-s * .6, -s * .3]];
    line(pts, { stroke: BD.ink, lwPx: s * .32 + lw * 2, smooth: true }); line(pts, { stroke: '#FFFFFF', lwPx: s * .32, smooth: true });
    for (let i = 0; i < 5; i++) { const p = polyAt(pts, i / 5 + .05), q = polyAt(pts, i / 5 + .1); line([p, q], { stroke: '#E8243C', lwPx: s * .3 }); }
  }
  X.restore();
}
// Trick-or-treat pumpkin pail: (x, y) = where the hand grips the handle, s = px per unit (pail ≈ 5 units wide). fill 0..1 candy.
function bdBucket(x, y, s, o = {}) {
  const lw = clamp(s * .16, 1.2, 4.5) / s, sw = o.swing || 0;
  X.save(); X.translate(x, y); X.rotate(sw); X.scale(s, s);
  line([[-2.3, 3.2], [-1.6, .2], [0, -.3], [1.6, .2], [2.3, 3.2]], { stroke: BD.ink, lw: .35 + lw * 2, smooth: true }); line([[-2.3, 3.2], [-1.6, .2], [0, -.3], [1.6, .2], [2.3, 3.2]], { stroke: '#2F2A35', lw: .35, smooth: true });
  const fill = o.fill ?? .7;
  if (fill > .05) for (let i = 0; i < 7; i++) bdCandy(-1.7 + i * .58 + (hash(i) - .5) * .3, 3.3 - fill * 1.3 - hash(i * 3) * .4, 1.0, ['wrap', 'corn', 'bar', 'lolly'][i % 4], (hash(i) - .5) * 1.4);
  shape([[-2.6, 3.0], [2.6, 3.0], [2.4, 6.4], [1.8, 7.2], [-1.8, 7.2], [-2.4, 6.4]], { fill: BD.orange, stroke: BD.ink, lw, smooth: .3 });
  line([[-1.0, 3.2], [-1.2, 7.0]], { stroke: BD.orangeDk, lw }); line([[1.0, 3.2], [1.2, 7.0]], { stroke: BD.orangeDk, lw });
  shape([[-1.5, 4.2], [-.6, 4.2], [-1.05, 3.6]], { fill: BD.ink, stroke: null }); shape([[.6, 4.2], [1.5, 4.2], [1.05, 3.6]], { fill: BD.ink, stroke: null });
  shape([[-1.5, 5.4], [-.8, 5.8], [0, 5.5], [.8, 5.8], [1.5, 5.4], [.9, 6.4], [-.9, 6.4]], { fill: BD.ink, stroke: null });
  ellipse(0, 3.0, 2.6, .5, { fill: '#B4500E', stroke: BD.ink, lw });
  X.restore();
}
// The giant candy bowl: (x, y) = bottom centre, s = px per unit (≈ 34 units wide). fill 0..1, broc 0..1 (candy → broccoli).
function bdBowl(x, y, s, t, o = {}) {
  const lw = clamp(s * .14, 1.5, 5) / s, fill = o.fill ?? 1, broc = o.broc ?? 0;
  X.save(); X.translate(x, y); X.scale(s, s);
  shape([[-5, 0], [5, 0], [3.5, -2.2], [-3.5, -2.2]], { fill: '#7A3FA0', stroke: BD.ink, lw });
  // the heap
  const top = -9 - fill * 7;
  if (fill > .02) {
    const items = 46;
    for (let i = 0; i < items; i++) {
      const u = hash(i * 1.7), v = hash(i * 4.3), px = (u - .5) * 30 * (1 - v * .55), py = -9 - v * fill * 8 + (Math.abs(px) / 15) * 2.5;
      if (py < top - .5) continue;
      const k = clamp((broc - hash(i * 2.9) * .5) * 2);
      if (k < 1) X.save(), X.globalAlpha *= 1 - k, bdCandyLocal(px, py, 2.0, ['wrap', 'corn', 'lolly', 'bar', 'wrap'][i % 5], (hash(i) - .5) * 2, lw), X.restore();
      if (k > 0) bdBroccoliLocal(px, py + 1.2, .75 * k, (hash(i) - .5) * 1.2, lw);
    }
  }
  shape([[-17, -10], [17, -10], [15.5, -5], [11, -1.8], [-11, -1.8], [-15.5, -5]], { fill: linGrad(-17, 0, 17, 0, [[0, '#9B4FC8'], [.4, '#C47BEE'], [1, '#7A3FA0']]), stroke: BD.ink, lw, smooth: .25 });
  ellipse(0, -10, 17, 1.5, { fill: null, stroke: BD.ink, lw });
  for (let i = 0; i < 7; i++) { const a = -14 + i * 4.6; shape([[a, -7.5], [a + 1.4, -8.6], [a + 2.8, -7.5], [a + 1.4, -6.4]], { fill: BD.orangeLt, stroke: null, alpha: .8 }); }
  line([[-13, -8.6], [-9, -3.4]], { stroke: 'rgba(255,255,255,.45)', lw: lw * 3 });
  X.restore();
}
function bdCandyLocal(x, y, s, kind, rot) { const m = X.getTransform(); X.save(); X.translate(x, y); const k = 1 / 40; X.scale(k, k); bdCandy(0, 0, s * 40, kind, rot); X.restore(); }
function bdBroccoliLocal(x, y, s, rot) { X.save(); X.translate(x, y); X.scale(.02, .02); bdBroccoli(0, 0, s * 50, rot); X.restore(); }
// Sheet ghost: (x, y) = floor point, s = px per unit (≈ 24 units tall). o: feet ('pink' shows Jenna's shoes), sway, lift (0..1 sheet pulled up), munch.
function bdGhost(x, y, s, t, o = {}) {
  const lw = clamp(s * .14, 1.5, 4.5) / s, sw = (o.sway ?? 1) * Math.sin(t * 1.6 + (o.ph || 0)), lift = o.lift || 0, sh = o.shake || 0;
  X.save(); X.translate(x + sh * Math.sin(t * 60) * s * .3, y); X.scale(s, s);
  ellipse(0, .1, 6, 1, { fill: 'rgba(20,10,30,.3)', stroke: null });
  if (o.feet === 'pink') [-1, 1].forEach(sd => { ellipse(sd * 1.4, -.5, 1.3, .7, { fill: '#F2B8C6', stroke: BD.ink, lw }); ellipse(sd * 1.4, -.8, .9, .3, { fill: '#FFFFFF', stroke: null }); });
  X.translate(0, -lift * 40); X.rotate(lift * .6 * (o.liftDir ?? 1));
  const hem = []; for (let i = 0; i <= 10; i++) { const u = i / 10, hx = -6.5 + 13 * u + sw * .6; hem.push([hx, -2.2 - (i % 2 ? 1.2 : 0) + Math.sin(t * 3 + i) * .3]); }
  const body = [[-6.4 + sw * .6, -2.2], [-6.2 + sw * .3, -10], [-5.4, -17], [-3.2, -21.5], [0, -22.8], [3.2, -21.5], [5.4, -17], [6.2 + sw * .3, -10], [6.4 + sw * .6, -2.2], ...hem.slice().reverse().slice(1, -1)];
  shape(body, { fill: linGrad(-6, 0, 6, 0, [[0, '#D9D4E8'], [.5, '#FFFFFF'], [1, '#CFC8E2']]), stroke: BD.ink, lw, smooth: .35 });
  const eyeY = -15.5;
  [-1, 1].forEach(sd => ellipse(sd * 1.8 + sw * .15, eyeY, .9, 1.3, { fill: '#1A1022', stroke: null }));
  if (o.munch) { const m = .35 + .35 * Math.abs(Math.sin(t * 16)); ellipse(sw * .15, -11.5, 1.2, m, { fill: '#1A1022', stroke: null }); }
  else ellipse(sw * .15, -11.6, .8, 1.1, { fill: '#1A1022', stroke: null });
  X.restore();
}
// HUD reticle: (x, y) centre, r px, k = lock (0 = wide and spinning, 1 = locked tight), col.
function bdReticle(x, y, r, t, k = 1, col = '#FF4040') {
  const rr = r * (1 + (1 - easeOut(k)) * 1.2), rot = (1 - k) * t * 3, lw = 5;
  X.save(); X.translate(x, y); X.rotate(rot);
  for (let i = 0; i < 4; i++) { X.save(); X.rotate(i * Math.PI / 2); line([[rr * .55, -rr], [rr, -rr], [rr, -rr * .55]], { stroke: col, lwPx: lw, cap: 'square' }); X.restore(); }
  if (k > .9) { line([[-rr * .3, 0], [rr * .3, 0]], { stroke: col, lwPx: 3 }); line([[0, -rr * .3], [0, rr * .3]], { stroke: col, lwPx: 3 }); circle(0, 0, rr * .7, { fill: null, stroke: rgba(col, .6), lwPx: 2, dash: [10, 8] }); }
  X.restore();
}
// Night-vision HUD frame over the whole picture: scan lines, corner brackets, a sweeping scan bar, a pulsing REC dot.
function bdHudFrame(t, col = '#FF4A4A') {
  X.save();
  X.globalAlpha = .13; X.fillStyle = '#000'; for (let y = 0; y < H; y += 6) X.fillRect(0, y, W, 2);
  X.globalAlpha = .22; const sy = (t * 420) % (H + 200) - 100; X.fillStyle = linGrad(0, sy - 80, 0, sy + 10, [[0, 'rgba(255,90,90,0)'], [1, 'rgba(255,120,120,.9)']]); X.fillRect(0, sy - 80, W, 90);
  X.globalAlpha = 1;
  const m = 60, L = 120;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, dx, dy]) => line([[x, y + dy * L], [x, y], [x + dx * L, y]], { stroke: col, lwPx: 6, cap: 'square' }));
  if (frac(t * 1.2) < .6) circle(m + 50, m + 50, 14, { fill: col, stroke: null });
  X.restore();
}
// The telescoping gripper arm: a ribbed tube from `from` to `to` (screen px), w = tube width px, holding o.item(x, y, ang).
function bdArm(from, to, w, t, o = {}) {
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, sag = o.sag ?? .08;
  const mid = [from[0] + dx / 2 - uy * L * sag, from[1] + dy / 2 + ux * L * sag], pts = [from, mid, to];
  line(pts, { stroke: BD.ink, lwPx: w + 6, smooth: true }); line(pts, { stroke: '#8C98A0', lwPx: w, smooth: true });
  const n = Math.max(4, Math.round(L / (w * .55)));
  for (let i = 1; i < n; i++) { const p = polyAt([from, mid, to], i / n), q = polyAt([from, mid, to], Math.min(1, i / n + .01)), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    line([[p[0] - Math.sin(a) * w * .5, p[1] + Math.cos(a) * w * .5], [p[0] + Math.sin(a) * w * .5, p[1] - Math.cos(a) * w * .5]], { stroke: i % 2 ? '#DCE3E7' : '#6A757D', lwPx: 2.5 }); }
  const ang = Math.atan2(to[1] - mid[1], to[0] - mid[0]), open = o.open ?? .4;
  X.save(); X.translate(to[0], to[1]); X.rotate(ang);
  shape(rectPts(-w * .5, -w * .7, w * .9, w * 1.4), { fill: '#6A757D', stroke: BD.ink, lwPx: 3 });
  [-1, 1].forEach(sd => line([[w * .3, sd * w * .5], [w * 1.1, sd * w * (.55 + open * .6)], [w * 1.7, sd * w * (.2 + open * .5)]], { stroke: BD.ink, lwPx: w * .42 + 5 }));
  [-1, 1].forEach(sd => line([[w * .3, sd * w * .5], [w * 1.1, sd * w * (.55 + open * .6)], [w * 1.7, sd * w * (.2 + open * .5)]], { stroke: '#DCE3E7', lwPx: w * .42 }));
  X.restore();
  if (o.item) o.item(to[0] + Math.cos(ang) * w * 1.2, to[1] + Math.sin(ang) * w * 1.2, ang);
}
// Costume hats, placed from a rig's anchors: A.top (hair top) and A.head (head centre). kind: 'witch' | 'cat' | 'horns' | 'pumpkin'.
function bdHat(kind, A, t, o = {}) {
  const [hx, hy] = A.head, [tx, ty] = A.top, R = Math.hypot(tx - hx, ty - hy), ang = Math.atan2(tx - hx, -(ty - hy)) + (o.tilt || 0);
  const lw = clamp(R * .05, 1.5, 5);
  X.save(); X.translate(tx, ty); X.rotate(ang); X.translate(0, R * (o.dy ?? 0)); X.scale(R / 10, R / 10);
  const L = clamp(R * .05, 1.5, 5) / (R / 10);
  if (kind === 'witch') {
    const flop = .6 * Math.sin(t * 2.2);
    ellipse(0, 1.2, 12, 2.6, { fill: '#3A1F57', stroke: BD.ink, lw: L });
    shape([[-6, 1.4], [6, 1.4], [3, -6], [2 + flop, -11], [5 + flop * 2, -14]], { fill: '#4B2873', stroke: BD.ink, lw: L, smooth: .4 });
    shape([[-5.6, .2], [5.6, .2], [5.2, -1.6], [-5.2, -1.6]], { fill: BD.green, stroke: BD.ink, lw: L * .8 });
    shape(rectPts(-1, -1.9, 2, 2.4), { fill: '#FFD54F', stroke: BD.ink, lw: L * .7 });
  } else if (kind === 'cat') {
    [-1, 1].forEach(sd => { shape([[sd * 3.2, 2.5], [sd * 7.6, -4 + Math.sin(t * 3 + sd) * .4], [sd * 8.2, 3.6]], { fill: '#2A2230', stroke: BD.ink, lw: L, smooth: .2 });
      shape([[sd * 4.6, 2.2], [sd * 7.3, -1.6], [sd * 7.5, 2.8]], { fill: '#F7A8C4', stroke: null }); });
    line([[-8, 3.4], [-3, 1.0], [3, 1.0], [8, 3.4]], { stroke: '#2A2230', lw: L * 1.8, smooth: true });
  } else if (kind === 'horns') {
    [-1, 1].forEach(sd => shape([[sd * 3.2, 2.8], [sd * 5.2, -2.5], [sd * 5.9, -5.3 + Math.sin(t * 4) * .2], [sd * 7.0, -1.6], [sd * 6.4, 3.2]], { fill: '#E23A3A', stroke: BD.ink, lw: L, smooth: .4 }));
  } else if (kind === 'pumpkin') {
    [[-3.2, 3.6], [3.2, 3.6], [-1.4, 4.4], [1.4, 4.4], [0, 4.6]].forEach(([dx, w], i) => ellipse(dx, 0, w, 3.4, { fill: i < 2 ? BD.orangeDk : BD.orange, stroke: BD.ink, lw: L }));
    shape([[-.4, -3], [.5, -3], [1.2, -5], [.2, -5.2]], { fill: '#4E7A2E', stroke: BD.ink, lw: L });
    shape([[.6, -3.8], [3, -5.4], [2.4, -3.4]], { fill: BD.green, stroke: BD.ink, lw: L * .8 });
  }
  X.restore();
}
// A broccoli stuffed in a mouth: (x, y) the mouth, s = the eater's px per unit, a 0..1 (slides in), chewing bob.
function bdMouthBroccoli(x, y, s, a, t, side = 1) {
  if (a < .02) return;
  const k = backOut(a), bob = .15 * Math.sin(t * 18), b = s * .5;
  bdBroccoli(x + side * ((1 - k) * 14 * b + 1.2 * b), y + b * (1.6 + bob), b, side * (1.3 + bob * .3));
}
// Cartoon wipe across the frame (an overlay): a wavy band of slime green with a candy-orange lead edge. k 0..1, dir ±1.
function bdWipe(k, dir = 1) {
  if (k <= 0 || k >= 1) return;
  overlay(() => {
    const e = ease(k), x0 = dir > 0 ? lerp(-W * .4, W * 1.4, e) : lerp(W * 1.4, -W * .4, e), band = W * .55;
    const edge = (x, sd) => { const p = []; for (let y = -20; y <= H + 20; y += 40) p.push([x + sd * 40 * Math.sin(y / 120 + k * 9), y]); return p; };
    const a = edge(x0, 1), b = edge(x0 - dir * band, -1);
    shape([...a, ...b.reverse()], { fill: BD.greenDk, stroke: null, smooth: .5 });
    shape([...edge(x0, 1), ...edge(x0 - dir * 70, 1).reverse()], { fill: BD.orange, stroke: BD.ink, lwPx: 5, smooth: .5 });
  });
}
