// scenes/scene16_spooky_plan/doodles.js: Jenna's sketchbook, her pencil, and the pencil doodles that pop out of it.
//
//   spkDoodle(kind, x, y, size, k, t, o)  a doodle centred on (x, y) in screen px; `size` ≈ its height in px.
//       kind: 'ghost' | 'spider' (a web with a spider on a thread) | 'cat' (an arched black cat) | 'pumpkin' (a jack-o'-lantern)
//             | 'witch' (striped legs and a broom stuck in a chimney top) | 'dolphin' (a vampire dolphin) | 'giraffe' (a mummy giraffe)
//             | 'robo' (Robo-Safadi)
//       k: draw-on progress 0..1 (pencil lines 0–.7, colour .55–1). Hold k = 1 to keep it; fade it with o.alpha.
//       o: { alpha, halo (default true: a soft white glow so the sketch reads over the set), flip, eyes (robo: 0..1, the red
//            eyes switching on), label (robo: the handwritten title, default true) }
//   spkSketchbook(x, y, w, ang, o)  a spiral-bound sketchbook held at (x, y) (its bottom-centre), `w` px wide.
//       o: { facing: 'front' (the page) | 'back' (the cover), page: (pw, ph) => draw on the page in page px (origin top-left) }
//   spkPencil(x, y, len, ang)  a yellow pencil, its tip at (x, y).
// Everything here is a pure function of its arguments (no state), like the rest of the engine.

const SPK = {
  graphite: '#3E3A45', paper: '#FFFDF6', paperLine: '#C9DCEB', ring: '#9AA3AA', cover: '#2F6F73', coverDk: '#245659',
  white: '#FFFFFF', black: '#2B2730', orange: '#F08A24', glow: '#FFD44A', ghost: '#FFFFFF', purple: '#3A2350', capeRed: '#B3243A',
  dolphin: '#7FA9C9', belly: '#D7E6F1', bandage: '#F1E9D2', spot: '#D98A3A', suit: '#D4B68C', hair: '#2E221D', tie: '#C3222F',
  metal: '#B8C2C8', metalDk: '#8E9AA2', red: '#FF2A2A', broccoli: '#5E9E4A', broom: '#8A5A33', straw: '#E0B850', stripe: '#C3222F',
};

// ---------- the doodles, in local units (−50…50, y down) ----------
const spkE = (cx, cy, rx, ry, n = 24, rot = 0) => { const p = ellPts(cx, cy, rx, ry, n, rot); return [...p, p[0]]; };
function spkShapes(kind, t, o) {
  // fills: { pts, col, smooth, hatch } · strokes: { pts, smooth, closed, w } · after(U): extra paint in local units
  const F = [], S = [], f = (pts, col, smooth = 0, hatch = true) => F.push({ pts, col, smooth, hatch }), s = (pts, smooth = 0, closed = false, w = 1) => S.push({ pts, smooth, closed, w });
  let after = null;
  if (kind === 'ghost') {
    const b = wob(t, .45) * 3, body = [[-22, 30], [-25, -2], [-19, -27], [0, -38], [19, -27], [25, -2], [22, 30], [15, 23], [8, 32], [0, 24], [-8, 32], [-15, 23]].map(([x, y]) => [x, y + b]);
    f(body, SPK.ghost, .5, false); s(body, .5, true);
    s([[-24, 2 + b], [-32, -6 + b], [-30, -12 + b]], .6); s([[24, 2 + b], [32, -6 + b], [30, -12 + b]], .6);
    f(spkE(-8, -15 + b, 3.6, 5.5), SPK.black, 0, false); f(spkE(8, -15 + b, 3.6, 5.5), SPK.black, 0, false); f(spkE(0, -1 + b, 4, 5.5), SPK.black, 0, false);
    s(spkE(-8, -15 + b, 3.6, 5.5), .3, true); s(spkE(8, -15 + b, 3.6, 5.5), .3, true); s(spkE(0, -1 + b, 4, 5.5), .3, true);
  } else if (kind === 'spider') {
    const cx = -10, cy = -18, n = 9, R = 44, rad = i => -Math.PI * .05 + i / (n - 1) * Math.PI * 1.1;
    for (let i = 0; i < n; i++) s([[cx, cy], [cx + Math.cos(rad(i)) * R, cy + Math.sin(rad(i)) * R]]);
    for (const r of [12, 22, 32, 41]) { const ring = []; for (let i = 0; i < n; i++) { ring.push([cx + Math.cos(rad(i)) * r, cy + Math.sin(rad(i)) * r]); if (i < n - 1) { const a = (rad(i) + rad(i + 1)) / 2; ring.push([cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9]); } } s(ring, .5); }
    const drop = 26 + 6 * Math.sin(t * 2.2), sx = 26;
    s([[sx, -48], [sx, drop - 8]]);
    const legs = []; for (const sd of [-1, 1]) for (let j = 0; j < 4; j++) { const a = (j - 1.5) * .45 + Math.sin(t * 6 + j) * .06; legs.push([[sx + sd * 4, drop], [sx + sd * 11, drop - 6 + j * 3 + Math.sin(a) * 4], [sx + sd * 16, drop + 2 + j * 4]]); }
    legs.forEach(l => s(l, .4));
    f(spkE(sx, drop, 6.5, 7), SPK.black, 0, false); s(spkE(sx, drop, 6.5, 7), .3, true); f(spkE(sx, drop - 9, 4, 3.6), SPK.black, 0, false); s(spkE(sx, drop - 9, 4, 3.6), .3, true);
    after = () => { for (const sd of [-1, 1]) { circle(sx + sd * 1.7, drop - 9.5, 1.5, { fill: SPK.white, stroke: null }); circle(sx + sd * 1.7, drop - 9.2, .7, { fill: SPK.black, stroke: null }); } };
  } else if (kind === 'cat') {
    const hiss = 1 + .03 * Math.sin(t * 9);
    const body = [[-27, 28], [-30, 8], [-24, -9], [-7, -19 * hiss], [9, -13], [18, 0], [19, 28], [13, 28], [12, 10], [-18, 10], [-20, 28]];
    f(body, SPK.black, .3); s(body, .3, true);
    const tail = [[-28, 8], [-39, -4], [-38, -21], [-30, -30], [-25, -25]]; s(tail, .6, false, 3.2);
    const head = spkE(23, -12, 11, 10); f(head, SPK.black); s(head, .3, true);
    const earL = [[16, -19], [17, -31], [23, -22]], earR = [[25, -22], [31, -31], [33, -17]]; f(earL, SPK.black); f(earR, SPK.black); s(earL, 0, true); s(earR, 0, true);
    for (let i = 0; i < 6; i++) { const u = i / 5, x = lerp(-22, 6, u), y = -15 - 6 * Math.sin(u * Math.PI); s([[x, y], [x + 2, y - 4], [x + 4, y]]); }
    after = () => {
      for (const ex of [19, 27]) { ellipse(ex, -13, 3, 2.2, { fill: SPK.glow, stroke: SPK.graphite, lwPx: 1 }); line([[ex, -15], [ex, -11]], { stroke: SPK.black, lwPx: 1.6 }); }
      for (const sd of [-1, 1]) line([[23 + sd * 4, -6], [23 + sd * 14, -8 + sd]], { stroke: SPK.white, lwPx: 1, alpha: .8 });
      shape([[21, -5], [25, -5], [23, -2]], { fill: '#F2A0B0', stroke: null });
    };
  } else if (kind === 'pumpkin') {
    const L = spkE(-13, 6, 14, 19), M = spkE(0, 5, 18, 21), Rr = spkE(13, 6, 14, 19);
    f(L, SPK.orange, 0); f(Rr, SPK.orange, 0); f(M, SPK.orange, 0); s(L, .3, true); s(Rr, .3, true); s(M, .3, true);
    const stem = [[-2, -15], [-4, -24], [1, -27], [3, -16]]; f(stem, '#6E8B3D'); s(stem, .3, true);
    s([[2, -24], [8, -28], [12, -24]], .6);
    const fl = .8 + .2 * Math.sin(t * 13) * Math.sin(t * 7.3);
    const eyeL = [[-12, 0], [-4, 0], [-8, -8]], eyeR = [[4, 0], [12, 0], [8, -8]], nose = [[-2.5, 6], [2.5, 6], [0, 2]];
    const mouth = [[-13, 10], [-8, 15], [-4, 11], [0, 16], [4, 11], [8, 15], [13, 10], [8, 21], [3, 18], [0, 22], [-3, 18], [-8, 21]];
    after = () => { X.save(); X.shadowColor = SPK.glow; X.shadowBlur = 12; [eyeL, eyeR, nose, mouth].forEach(p => shape(p, { fill: mixCol('#F7A21B', SPK.glow, fl), stroke: SPK.graphite, lwPx: 1.4 })); X.restore(); };
  } else if (kind === 'witch') {
    const kick1 = Math.sin(t * 5) * 3, kick2 = Math.sin(t * 5 + 1.6) * 3;
    const legs = [[[-6, 30], [-11, 6], [-22 + kick1, -14]], [[6, 30], [11, 2], [5 + kick2, -24]]];
    legs.forEach(l => { s(l, .4, false, 7.5); });
    after = (U, k) => {
      legs.forEach(l => {                                                    // striped stockings
        X.save(); X.lineCap = 'round';
        for (let i = 0; i < 8; i++) { const a = i / 8, b = (i + 1) / 8; if (seg(k, .55, 1) <= 0) continue; line(polySlice(l, a, b), { stroke: i % 2 ? SPK.white : SPK.stripe, lwPx: 6.2 * U, alpha: seg(k, .55, 1) }); }
        X.restore();
        const [ex, ey] = l[2], d = Math.atan2(l[2][1] - l[1][1], l[2][0] - l[1][0]);
        X.save(); X.translate(ex, ey); X.rotate(d + Math.PI / 2);
        shape([[-4, 2], [-4, -4], [4, -4], [5, 1], [14, -2], [12, 3], [4, 4]], { fill: SPK.black, stroke: SPK.graphite, lwPx: 1.4, smooth: .3 }); X.restore();
      });
    };
    s([[-38, 26], [30, -16]], 0, false, 2.4);
    const bristle = []; for (let i = -3; i <= 3; i++) bristle.push([[30, -16], [44 + i * .8, -20 + i * 3.4]]);
    bristle.forEach(b => s(b)); f([[30, -16], [44, -31], [47, -10]], SPK.straw, 0);
    const hat = [[22, 26], [42, 26], [34, 20], [36, 4], [30, 21]]; f(hat, SPK.black); s(hat, .2, true);
    s([[-4, 22], [-2, 16]]); s([[12, 18], [16, 13]]);                        // puffs of soot
  } else if (kind === 'dolphin') {
    const b = wob(t, .5) * 2;
    const collar = [[14, -10 + b], [8, -30 + b], [20, -20 + b], [26, -33 + b], [31, -11 + b]]; f(collar, SPK.capeRed); s(collar, .2, true);
    const body = [[-40, 10], [-30, -2], [-10, -12], [10, -14], [25, -10], [36, -5], [47, -3], [39, 2], [26, 5], [10, 9], [-10, 11], [-28, 14]].map(([x, y]) => [x, y + b]);
    f(body, SPK.dolphin, .5); s(body, .5, true);
    const belly = [[-24, 12], [-6, 9], [12, 6], [30, 3], [12, 9], [-10, 12]].map(([x, y]) => [x, y + b]); f(belly, SPK.belly, .5, false);
    const fluke = [[-40, 10], [-50, -1], [-45, 10], [-51, 22], [-38, 13]].map(([x, y]) => [x, y + b]); f(fluke, SPK.dolphin); s(fluke, .3, true);
    const fin = [[-3, -12], [4, -25], [10, -13]].map(([x, y]) => [x, y + b]); f(fin, SPK.dolphin); s(fin, .3, true);
    const cape = [[28, -9], [16, -16], [2, -16], [-10, -10], [-16, 0], [-6, -1], [6, -4], [18, -3], [28, -2]].map(([x, y]) => [x, y + b + Math.sin(t * 3 + x * .12) * (x < 6 ? 1.5 : 0)]);
    f(cape, SPK.purple, .4); s(cape, .4, true);
    after = () => {
      shape([[34, 2 + b], [36, 7 + b], [37.5, 2 + b]], { fill: SPK.white, stroke: SPK.graphite, lwPx: 1.2 }); shape([[39, 1.5 + b], [40.5, 6 + b], [42, 1 + b]], { fill: SPK.white, stroke: SPK.graphite, lwPx: 1.2 });
      circle(29, -6 + b, 2.4, { fill: SPK.white, stroke: SPK.graphite, lwPx: 1.2 }); circle(29.6, -6 + b, 1.1, { fill: SPK.black, stroke: null });
      line([[25, -11 + b], [32, -9 + b]], { stroke: SPK.graphite, lwPx: 2 });
      line([[27, -2 + b], [16, -1.5 + b]], { stroke: SPK.capeRed, lwPx: 1.4, alpha: .8 });
    };
  } else if (kind === 'giraffe') {
    const sway = Math.sin(t * 1.3) * 1.5, legsX = [-18, -10, 10, 18];
    const parts = [spkE(0, -5, 24, 13), [[13, -13], [21, -10], [34 + sway, -60], [27 + sway, -63]], spkE(38 + sway, -66, 10, 6, 24, .25)];
    legsX.forEach(x => parts.push([[x - 2.5, 2], [x + 2.5, 2], [x + 2, 40], [x - 2, 40]]));
    parts.forEach(p => f(p, SPK.bandage, .2, false));
    parts.forEach(p => s(p, .2, true));
    s([[31 + sway, -71], [30 + sway, -77]], 0, false, 1.6); s([[36 + sway, -72], [36 + sway, -78]], 0, false, 1.6);
    s([[-24, -6], [-31, 4], [-30, 10]], .5);
    const loose = [[24 + sway * .8, -38], [33, -36 + Math.sin(t * 4) * 3], [40, -40 + Math.sin(t * 4 + 1) * 4], [47, -36 + Math.sin(t * 4 + 2) * 4]]; s(loose, .6, false, 2.2);
    after = (U, k) => {
      if (k < .55) return;
      X.save(); X.globalAlpha *= seg(k, .55, 1); X.beginPath(); parts.forEach(p => { X.moveTo(p[0][0], p[0][1]); p.forEach(q => X.lineTo(q[0], q[1])); X.closePath(); }); X.clip();
      [[-12, -8], [6, -2], [-2, -12], [16, -24], [22, -44]].forEach(([x, y], i) => ellipse(x, y, 4, 3, { fill: SPK.spot, stroke: null, rot: i }));
      for (let i = -14; i < 14; i++) { const y0 = i * 6.5; line([[-50, y0 + 12], [50, y0 - 12]], { stroke: SPK.graphite, lwPx: 1.1, alpha: .55 }); line([[-50, y0 + 13.5], [50, y0 - 10.5]], { stroke: '#D9CFB4', lwPx: 2, alpha: .7 }); }
      X.restore();
      circle(40 + sway, -67, 2.2, { fill: SPK.white, stroke: SPK.graphite, lwPx: 1.1 }); circle(40.6 + sway, -67, 1, { fill: SPK.black, stroke: null });
      line([[36 + sway, -71], [43 + sway, -70]], { stroke: SPK.graphite, lwPx: 1.6 });
    };
  } else if (kind === 'robo') {
    const head = [[-26, -60], [26, -60], [26, -18], [-26, -18]], hair = [[-27, -59], [-27, -68], [-12, -74], [10, -73], [27, -66], [27, -58]];
    const body = [[-22, -12], [22, -12], [22, 22], [-22, 22]], neck = [[-6, -18], [6, -18], [6, -12], [-6, -12]];
    f(body, SPK.suit); s(body, 0, true); f(neck, SPK.metal); s(neck, 0, true);
    f(head, SPK.metal); s(head, 0, true); f(hair, SPK.hair, .3); s(hair, .3, true); s([[-14, -73], [-10, -62]]);
    for (const sd of [-1, 1]) { const leg = [[sd * 4, 22], [sd * 16, 22], [sd * 16, 38], [sd * 4, 38]]; f(leg, SPK.suit); s(leg, 0, true); const ft = [[sd * 2, 38], [sd * 19, 38], [sd * 19, 43], [sd * 2, 43]]; f(ft, '#6E3B22'); s(ft, 0, true); }
    const armL = [[-22, -8], [-30, 4], [-32, 18]], armR = [[22, -8], [32, -20], [34, -34]];
    s(armL, 0, false, 3); s(armR, 0, false, 3);
    s([[0, -74], [0, -86]]);
    after = (U, k) => {
      const e = clamp(o.eyes ?? 0), lw = 1.5;
      for (const sd of [-1, 1]) { circle(sd * 29, -38, 4, { fill: SPK.metalDk, stroke: SPK.graphite, lwPx: lw }); shape(ellPts(sd * 29, -38, 2.2, 2.2, 6), { fill: SPK.metal, stroke: SPK.graphite, lwPx: 1 }); }
      for (const [x0, x1] of [[-21, -6], [6, 21]]) shape(rectPts(x0, -57, x1 - x0, 4), { fill: SPK.hair, stroke: null });   // Safadi's brows
      for (const ex of [-15, 5]) {
        shape(rectPts(ex, -50, 10, 8), { fill: mixCol('#1C2024', SPK.red, e), stroke: SPK.graphite, lwPx: lw });
        if (e > 0) { X.save(); X.globalAlpha *= e; X.shadowColor = SPK.red; X.shadowBlur = 18 * U; shape(rectPts(ex + 1.5, -48.5, 7, 5), { fill: '#FF8A8A', stroke: null }); X.restore();
          X.save(); X.globalAlpha *= .35 * e; circle(ex + 5, -46, 11, { fill: radGrad(ex + 5, -46, 1, 11, [[0, 'rgba(255,60,60,.9)'], [1, 'rgba(255,40,40,0)']]), stroke: null }); X.restore(); }
      }
      shape([[-3, -40], [3, -40], [4, -33], [-4, -33]], { fill: SPK.metalDk, stroke: SPK.graphite, lwPx: 1 });
      shape(rectPts(-12, -29, 24, 6), { fill: '#3B4248', stroke: SPK.graphite, lwPx: lw }); for (let i = -2; i <= 2; i++) line([[i * 4.5, -29], [i * 4.5, -23]], { stroke: SPK.metal, lwPx: 1 });
      shape([[-9, -12], [0, 6], [9, -12]], { fill: SPK.white, stroke: SPK.graphite, lwPx: lw }); shape([[-2, -11], [2, -11], [3, 2], [0, 6], [-3, 2]], { fill: SPK.tie, stroke: SPK.graphite, lwPx: 1 });
      for (let i = 0; i < 4; i++) { line(polySlice(armL, i / 4, i / 4 + .1), { stroke: SPK.metalDk, lwPx: 3.6 * U }); line(polySlice(armR, i / 4, i / 4 + .1), { stroke: SPK.metalDk, lwPx: 3.6 * U }); }
      circle(-32, 20, 3.4, { fill: SPK.metal, stroke: SPK.graphite, lwPx: lw });
      line([[34, -34], [35, -44]], { stroke: '#7FB069', lwPx: 2.4 * U });                                        // the broccoli
      [[-4, -46], [0, -49], [4, -46], [-2, -50], [2.5, -51]].forEach(([dx, dy]) => circle(35 + dx, dy, 3.4, { fill: SPK.broccoli, stroke: SPK.graphite, lwPx: 1 }));
      circle(0, -88, 3, { fill: e > 0 ? mixCol('#B9C2C8', SPK.red, e) : SPK.metal, stroke: SPK.graphite, lwPx: lw });
      if ((o.label ?? true) && k > .75) { X.save(); X.globalAlpha *= seg(k, .75, .95); X.font = `700 9px ${FONT_TALK}`; X.textAlign = 'center'; X.fillStyle = SPK.graphite; X.fillText('ROBO-SAFADI', 0, -95); X.restore(); }
    };
  }
  return { F, S, after };
}

function spkDoodle(kind, x, y, size, k, t, o = {}) {
  if (k <= 0 || (o.alpha ?? 1) <= 0) return;
  const U = size / 100, { F, S, after } = spkShapes(kind, t, o), inkK = seg(k, 0, .7), colK = seg(k, .55, 1), n = S.length;
  X.save(); X.translate(x, y); if (o.flip) X.scale(-1, 1); X.scale(U, U); X.globalAlpha = o.alpha ?? 1;
  withBoil(.5, () => {
    const shown = S.map((st, i) => { const f = clamp(inkK * n - i); return f <= 0 ? null : (f < 1 ? polySlice(st.pts, 0, f) : st.pts); });
    if (o.halo ?? true) S.forEach((st, i) => shown[i] && line(shown[i], { stroke: 'rgba(255,253,246,.7)', lwPx: (st.w * 1.6 + 7) * Math.max(1, U * .7), smooth: st.smooth && shown[i] === st.pts ? st.smooth : 0 }));
    if (colK > 0) F.forEach(fl => {
      X.save(); X.globalAlpha *= colK * .9; shape(fl.pts, { fill: fl.col, stroke: null, smooth: fl.smooth });
      if (fl.hatch) { tracePath(fl.pts, true, fl.smooth); X.clip(); X.globalAlpha = (o.alpha ?? 1) * colK * .3; for (let d = -120; d < 120; d += 3.2) line([[d - 60, 60], [d + 60, -60]], { stroke: mixCol(fl.col, '#000000', .35), lwPx: Math.max(.8, U * .45) }); }
      X.restore();
    });
    S.forEach((st, i) => {
      const p = shown[i]; if (!p) return; const full = p === st.pts, sm = full ? st.smooth : 0;
      line(p, { stroke: SPK.graphite, lwPx: Math.max(1.4, U * 1.1 * st.w), smooth: sm });
      X.save(); X.translate(.5, .35); line(p, { stroke: SPK.graphite, lwPx: Math.max(.8, U * .5 * st.w), smooth: sm, alpha: .35 }); X.restore();
      if (full && st.closed) line([p[p.length - 1], p[0]], { stroke: SPK.graphite, lwPx: Math.max(1.4, U * 1.1 * st.w) });
    });
    if (after && k > .5) after(U, k);
  });
  X.restore();
}

// ---------- the sketchbook and the pencil ----------
function spkSketchbook(x, y, w, ang = 0, o = {}) {
  const h = w * .76, facing = o.facing || 'front', lw = Math.max(1.2, w * .012);
  X.save(); X.translate(x, y); X.rotate(ang); X.translate(-w / 2, -h);
  X.save(); X.translate(w * .03, h * .035); shape(rectPts(0, 0, w, h), { fill: 'rgba(40,20,30,.25)', stroke: null }); X.restore();
  if (facing === 'back') {
    shape(rectPts(0, 0, w, h), { fill: linGrad(0, 0, w, h, [[0, SPK.cover], [1, SPK.coverDk]]), stroke: PAL.ink, lwPx: lw * 1.6 });
    shape(rectPts(w * .1, h * .3, w * .8, h * .26), { fill: SPK.paper, stroke: PAL.ink, lwPx: lw });
    X.font = `700 ${h * .13}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = PAL.ink; X.fillText("JENNA'S COMICS", w / 2, h * .43, w * .74);
    shape(starPts(w * .2, h * .74, h * .09), { fill: PAL.goldLt, stroke: PAL.ink, lwPx: lw }); circle(w * .78, h * .76, h * .07, { fill: PAL.pink, stroke: PAL.ink, lwPx: lw });
  } else {
    shape(rectPts(0, 0, w, h), { fill: SPK.paper, stroke: PAL.ink, lwPx: lw * 1.6 });
    X.save(); X.globalAlpha = .5; for (let yy = h * .16; yy < h * .97; yy += h * .085) line([[w * .04, yy], [w * .96, yy]], { stroke: SPK.paperLine, lwPx: Math.max(.6, lw * .5) }); X.restore();
    if (o.page) { X.save(); tracePath(rectPts(0, 0, w, h)); X.clip(); o.page(w, h); X.restore(); }
  }
  for (let i = 0; i < 9; i++) { const rx = w * (.08 + i * .105); ellipse(rx, 0, w * .018, h * .055, { fill: null, stroke: SPK.ring, lwPx: lw * 1.4 }); }
  X.restore();
}
function spkPencil(x, y, len, ang = 0) {
  const w = len * .09;
  X.save(); X.translate(x, y); X.rotate(ang);
  shape([[0, 0], [len * .16, -w / 2], [len * .16, w / 2]], { fill: '#F2D2A8', stroke: PAL.ink, lwPx: 1.2 });
  shape([[0, 0], [len * .05, -w * .16], [len * .05, w * .16]], { fill: SPK.graphite, stroke: null });
  shape(rectPts(len * .16, -w / 2, len * .7, w), { fill: '#F6C344', stroke: PAL.ink, lwPx: 1.2 });
  line([[len * .16, 0], [len * .86, 0]], { stroke: '#E0A92E', lwPx: Math.max(1, w * .25) });
  shape(rectPts(len * .86, -w / 2, len * .05, w), { fill: '#B9C0C4', stroke: PAL.ink, lwPx: 1.2 });
  shape(rectPts(len * .91, -w / 2, len * .09, w), { fill: '#F29AB0', stroke: PAL.ink, lwPx: 1.2 });
  X.restore();
}
