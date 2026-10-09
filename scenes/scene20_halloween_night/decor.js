// scenes/scene20_halloween_night/decor.js: the Halloween decorations on Alma's house (scene 16's plan, built), and the
// pieces the scene draws over the cast. World-anchored: everything projects through the scene's camera P.
// Uses scene 16's spkDoodle (the girls' ghosts, web, cats, witch, vampire dolphin, mummy giraffe) and scene 17's bd* props.
//
//   hnDecor(P, t)                  tombstones, the girls' decorations, jack-o'-lanterns, the porch string lights (tinted for night)
//   hnGlow(P, t)                   the warm glow of the jack-o'-lanterns and string lights, added on top (call after hnDecor)
//   hnPile(P, x, z, h, seed)       a heap of candy on the lawn, h world units tall
//   hnHatch(A, s, t, k, eyes)      the hatch in Robo-Safadi's chest swinging open (k 0..1) on Clawd, curled up inside

// the girls' decorations from scene 16: [kind, X, Y, Z, height, seed, opts]
const HN_DOODLES = [
  ['ghost', -720, 330, 2760, 260, 0], ['ghost', 900, 260, 2830, 220, 1.3, { flip: true }],
  ['spider', -110, 190, 2700, 330, 0],
  ['cat', -330, 60, 2640, 115, 0], ['cat', 1150, 60, 2640, 115, .4, { flip: true }],
  ['witch', -820, 1120, 3150, 300, 0],
  ['dolphin', -560, 120, 2600, 150, 0], ['giraffe', 760, 150, 2620, 290, 0],
];
const HN_PUMPKINS = [[-160, 25, 2665, 20, 1], [-20, 25, 2665, 16, 2], [230, 0, 2640, 22, 0], [480, 0, 2640, 18, 1], [730, 0, 2640, 24, 2], [980, 0, 2640, 18, 0], [-420, 0, 2650, 26, 0]];
const HN_TOMBS = [[-1150, 2600, 0], [-990, 2720, 1], [-1320, 2760, 2], [1300, 2560, 0]];
const HN_BULBS = (() => { const b = []; for (let i = 0; i <= 18; i++) { const u = i / 18, x = lerp(-470, 250, u); b.push([x, 292 - 26 * Math.sin(u * Math.PI * 3) ** 2, 2702, ['#FF8A2A', '#B46CFF', '#6CE05A'][i % 3], i]); } return b; })();

function hnDecor(P, t) {
  layer(() => {
    for (const [x, z, kind] of HN_TOMBS) { const [sx, sy, k] = P.p(x, 0, z); if (P.visible(z)) bdTomb(sx, sy, 7 * k, kind); }
    for (const [kind, X0, Y0, Z0, h, seed, op] of HN_DOODLES) { if (!P.visible(Z0)) continue; const [sx, sy, k] = P.p(X0, Y0, Z0); spkDoodle(kind, sx, sy, h * k, 1, t + seed, { ...op, halo: false }); }
    if (P.visible(2702)) {                                                   // the string of lights along the porch beam
      const wire = HN_BULBS.map(([x, y, z]) => P.p(x, y + 6, z)); line(wire.map(p => [p[0], p[1]]), { stroke: '#1A1420', lwPx: 2, smooth: true });
    }
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'source-atop'; X.fillStyle = 'rgba(14,18,60,.38)'; X.fillRect(0, 0, W, H); X.restore();
  }, { filter: 'saturate(.85)' });
  for (const [x, y, z, r, face] of HN_PUMPKINS) { if (!P.visible(z)) continue; const [sx, sy, k] = P.p(x, y, z); bdPumpkin(sx, sy, r * k, { face, glow: .85 + .15 * Math.sin(t * 9 + x) }); }
  if (P.visible(2702)) for (const [x, y, z, col, i] of HN_BULBS) { const [sx, sy, k] = P.p(x, y, z), on = .7 + .3 * Math.sin(t * 3 + i * 1.7); circle(sx, sy, 5 * k, { fill: mixCol('#1A1420', col, on), stroke: '#1A1420', lwPx: 1 }); }
}
function hnGlow(P, t) {
  X.save(); X.globalCompositeOperation = 'lighter';
  for (const [x, y, z, r] of HN_PUMPKINS) { if (!P.visible(z)) continue; const [sx, sy, k] = P.p(x, y + r * .8, z), R = r * k * 3.2;
    X.fillStyle = radGrad(sx, sy, 0, R, [[0, `rgba(255,150,40,${(.32 + .06 * Math.sin(t * 9 + x)).toFixed(3)})`], [1, 'rgba(255,150,40,0)']]); X.fillRect(sx - R, sy - R, 2 * R, 2 * R); }
  if (P.visible(2702)) for (const [x, y, z, col, i] of HN_BULBS) { const [sx, sy, k] = P.p(x, y, z), R = 22 * k, on = .7 + .3 * Math.sin(t * 3 + i * 1.7);
    X.fillStyle = radGrad(sx, sy, 0, R, [[0, rgba(col, .45 * on)], [1, rgba(col, 0)]]); X.fillRect(sx - R, sy - R, 2 * R, 2 * R); }
  X.restore();
}

function hnPile(P, x, z, h, seed) {
  if (h < 1 || !P.visible(z)) return;
  const [sx, sy, k] = P.p(x, 0, z), w = (34 + h * .9) * k, hh = h * k;
  shape([[sx - w, sy], [sx - w * .7, sy - hh * .6], [sx - w * .25, sy - hh], [sx + w * .3, sy - hh * .95], [sx + w * .75, sy - hh * .5], [sx + w, sy]], { fill: '#7A3E8E', stroke: BD.ink, lwPx: 2, smooth: .5 });
  const n = Math.round(10 + h * .8);
  for (let i = 0; i < n; i++) {
    const u = hash(i * 3.7 + seed), v = hash(i * 9.1 + seed), px = sx + (u * 2 - 1) * w * .85, top = sy - hh * (1 - Math.abs(u * 2 - 1) ** 1.6);
    bdCandy(px, lerp(sy - 4 * k, top + 4 * k, v), 13 * k, ['wrap', 'corn', 'bar', 'lolly', 'cane'][i % 5], (hash(i + seed) - .5) * 2);
  }
}

function hnHatch(A, s, t, k, eyes) {
  if (k <= 0) return;
  const [cx, cy] = A.chest, w = 5.4 * s, h = 4.2 * s, x0 = cx - w / 2, y0 = cy - h / 2;
  shape(rectPts(x0, y0, w, h), { fill: '#141821', stroke: BD.ink, lwPx: 3 });
  X.save(); X.beginPath(); X.rect(x0, y0, w, h); X.clip();
  circle(cx, cy, w * .7, { fill: radGrad(cx, cy, 2, w * .7, [[0, rgba(eyes === 'red' ? '#FF3A3A' : '#7FE3FF', .55 * k)], [1, 'rgba(0,0,0,0)']]), stroke: null });
  clawd(cx, cy + h * .38, s * .42, { t, holo: eyes === 'closed' ? .3 : 1, noShadow: true, eyes, mouth: eyes === 'red' ? 'flat' : eyes === 'closed' ? null : 'o', aL: eyes === 'red' ? 1.2 : .2, aR: eyes === 'red' ? 1.2 : .2,
    jump: eyes === 'normal' ? .6 : 0, blink: false });
  X.restore();
  // the hatch door, hinged on its left edge, swinging toward us
  const c = Math.cos(k * Math.PI * .85);
  shape([[x0, y0], [x0 + w * c, y0 - h * .06 * (1 - c)], [x0 + w * c, y0 + h + h * .06 * (1 - c)], [x0, y0 + h]], { fill: c > 0 ? '#BAC4CA' : '#8C98A0', stroke: BD.ink, lwPx: 3 });
  for (const yy of [.25, .75]) circle(x0 + w * c * .85, y0 + h * yy, .25 * s, { fill: '#DCE3E7', stroke: BD.ink, lwPx: 1.5 });
}
