// A photo-guided school exterior, built in the same world units as Dove Creek.
// Helpers remain private because all studio assets share one global environment.
const meadowRidge = (() => {
  const FZ = 2800;
  const C = { ink: '#48494A', brick: '#A57558', side: '#896149', mortar: '#C4AA90',
    trim: '#B3ACA0', blue: '#6D98AF', glass: '#536872', frame: '#383E3E',
    concrete: '#D7D2C4', leaf: '#779158', grass: '#A4B877' };
  const S = (p, o = {}) => { if (p) shape(p, { stroke: C.ink, lwPx: 1.1, ...o }); };
  const Q = (P, x0, x1, z0, z1, y, fill) => S(P.poly([
    [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1],
  ]), { fill, stroke: null });

  function box(P, x0, x1, z0, z1, y0, y1, fill, side = C.side) {
    if (P.cam.y > y1) Q(P, x0, x1, z0, z1, y1, C.trim);
    for (const [x, visible] of [[x0, P.cam.x < x0], [x1, P.cam.x > x1]]) {
      if (visible) S(P.poly([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]]), { fill: side });
    }
    const z = P.dir > 0 ? z0 : z1;
    P.plane(z, () => S(rectPts(x0, -y1, x1 - x0, y1 - y0), { fill }));
  }

  const patterns = new WeakMap();
  function brickPattern() {
    if (!patterns.has(X)) {
      const cv = document.createElement('canvas'); cv.width = 240; cv.height = 96;
      const g = cv.getContext('2d'); g.fillStyle = C.mortar; g.fillRect(0, 0, 240, 96);
      for (let r = 0; r < 8; r++) for (let c = -1; c < 10; c++) {
        g.fillStyle = mixCol('#8F6F5C', '#B98560', hash(r * 31 + c * 7));
        g.fillRect(c * 28 + (r % 2) * 14, r * 12 + 1, 27, 11);
      }
      patterns.set(X, X.createPattern(cv, 'repeat'));
    }
    return patterns.get(X);
  }
  function brick(P, x0, x1, z, h) {
    P.plane(z, k => {
      S(rectPts(x0, -h, x1 - x0, h), { fill: C.brick });
      S(rectPts(x0, -h, x1 - x0, h), { fill: brickPattern(), stroke: null, alpha: clamp((k - .12) * 1.5, 0, .65) });
      S(rectPts(x0 - 5, -h - 12, x1 - x0 + 10, 18), { fill: '#777C7B' });
    });
  }
  function glazing(P, x0, x1, z, bottom, top, columns, doors = false) {
    P.plane(z, k => {
      S(rectPts(x0, -top, x1 - x0, top - bottom), {
        fill: linGrad(0, -top, 0, -bottom, [[0, '#90A8B2'], [.5, C.glass], [1, '#34484B']]),
      });
      // Muted reflected trees, clipped to the glass.
      X.save(); X.beginPath(); X.rect(x0, -top, x1 - x0, top - bottom); X.clip();
      for (let i = 0; i < columns; i++) {
        const x = x0 + (i + .4) * (x1 - x0) / columns;
        S([[x - 55, -bottom], [x - 20, -bottom - 130], [x, -bottom - 190], [x + 65, -bottom]], { fill: '#9EAFA4', stroke: null, alpha: .18 });
      }
      S([[x0, -top], [x0 + (x1 - x0) * .45, -top], [x1, -bottom], [x1 - (x1 - x0) * .18, -bottom]], { fill: '#D6E6E9', stroke: null, alpha: .13 });
      X.restore();
      for (let i = 0; i <= columns; i++) {
        const x = lerp(x0, x1, i / columns);
        line([[x, -top], [x, -bottom]], { stroke: C.frame, lwPx: clamp(k * 6, 1, 6) });
      }
      for (const y of doors ? [260, 330] : [bottom, 155, 255, top]) {
        line([[x0, -y], [x1, -y]], { stroke: C.frame, lwPx: clamp(k * 6, 1, 6) });
      }
      if (doors) for (const x of [-15, 15]) S(rectPts(x - 3, -155, 6, 45), { fill: '#BCC4C4', stroke: null });
    });
  }
  function school(P) {
    box(P, -1700, 1900, 3100, 4600, 0, 570, '#9D9F98', '#868C88');
    box(P, -2200, -950, 2490, 3900, 0, 515, C.brick);
    box(P, 1450, 2350, 2490, 3900, 0, 540, C.brick);
    if (P.dir > 0) {
      brick(P, -2200, -950, 2490, 515); brick(P, 1450, 2350, 2490, 540);
      // Recessed door wall and projecting glass wings.
      box(P, -950, 1450, FZ, 3800, 0, 440, C.trim);
      glazing(P, -330, 330, FZ - 1, 0, 365, 6, true);
      for (const [x0, x1, n] of [[-950, -330, 4], [330, 1450, 6]]) {
        box(P, x0, x1, 2510, FZ, 0, 440, C.trim);
        brick(P, x0, x1, 2509, 65);
        glazing(P, x0 + 10, x1 - 10, 2508, 65, 360, n);
        P.plane(2507, () => {
          S(rectPts(x0, -455, x1 - x0, 55), { fill: C.trim });
          S(rectPts(x0, -400, x1 - x0, 34), { fill: C.blue });
          for (let x = x0 + 180; x < x1; x += 180) line([[x, -455], [x, -366]], { stroke: '#878B86', lwPx: .8 });
        });
      }
      // Glass return walls at either side of the entrance recess.
      for (const x of [-330, 330]) {
        S(P.poly([[x, 65, 2510], [x, 65, FZ], [x, 360, FZ], [x, 360, 2510]]), { fill: '#465D66' });
        for (const y of [155, 255, 360]) line(P.line([[x, y, 2510], [x, y, FZ]]), { stroke: C.frame, lwPx: 2 });
        for (let z = 2510; z <= FZ; z += 96) line(P.line([[x, 65, z], [x, 360, z]]), { stroke: C.frame, lwPx: 2 });
      }
      P.plane(2488, () => {
        X.fillStyle = '#E2E6DF'; X.textAlign = 'center'; X.textBaseline = 'middle';
        X.save(); X.translate(-1830, -278); X.rotate(-Math.PI / 2);
        X.font = '52px sans-serif'; X.fillText('MEADOW', 0, 0);
        X.fillText('RIDGE', 0, 65); X.font = '25px sans-serif'; X.fillText('Elementary School', 0, 112);
        X.restore();
      });
    }
  }
  function canopy(P) {
    // Flat blue fascia and darker soffit, supported by slim silver columns.
    S(P.poly([[-390, 400, 2350], [390, 400, 2350], [390, 400, FZ], [-390, 400, FZ]]), { fill: '#5D6C6E' });
    box(P, -390, 390, 2350, FZ, 400, 455, C.trim, '#999E98');
    P.plane(P.dir > 0 ? 2349 : FZ + 1, () => S(rectPts(-390, -417, 780, 25), { fill: C.blue }));
  }
  function column(P, x) {
    box(P, x - 60, x + 60, 2370, 2470, 0, 65, C.brick);
    if (P.dir > 0) brick(P, x - 60, x + 60, 2369, 65);
    box(P, x - 70, x + 70, 2360, 2480, 65, 78, '#D2CEC0', '#B7B8B0');
    box(P, x - 17, x + 17, 2400, 2435, 78, 401, '#B6C0BC', '#85948F');
  }
  function shrub(P, x, z, t, seed, wind) {
    P.plane(z, () => {
      const sway = Math.sin(t * 1.3 + seed) * 5 * wind;
      for (let i = 0; i < 8; i++) {
        const dx = (hash(seed + i * 9) - .5) * 110, h = 30 + hash(seed + i * 5) * 80;
        line([[x, 0], [x + dx * .4, -h * .5], [x + dx + sway, -h]], { stroke: '#7D7860', lwPx: 1 });
        ellipse(x + dx + sway, -h + 5, 17, 22, { fill: C.leaf, stroke: null, alpha: .7 });
      }
    });
  }
  function table(P) {
    const x = -680, z = 1780;
    S(P.floorCircle(x, z, 180, .5), { fill: 'rgba(57,65,59,.13)', stroke: null });
    // Legs, round blue tabletop, and four matching seats.
    for (const dx of [-65, 65]) for (const dz of [-65, 65]) {
      line(P.line([[x + dx * 1.5, 0, z + dz * 1.5], [x + dx, 70, z + dz]]), { stroke: '#303C40', lwPx: 5 });
    }
    const seats = [[-140, 0], [140, 0], [0, 135], [0, -135]];
    const pieces = seats.map(([dx, dz]) => ({ z: z + dz, draw() {
      for (const a of [-25, 25]) line(P.line([[x + dx + a, 0, z + dz], [x + dx + a, 40, z + dz]]), { stroke: '#303C40', lwPx: 4 });
      Q(P, x + dx - 48, x + dx + 48, z + dz - 25, z + dz + 25, 43, '#5578A7');
    } }));
    pieces.push({ z, draw: () => S(P.floorCircle(x, z, 125, 76), { fill: '#597FAF', stroke: '#344D6C', lwPx: 2 }) });
    pieces.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(p => p.draw());
  }
  function ground(P) {
    Q(P, -18000, 18000, P.cam.z + P.dir * 16, P.cam.z + P.dir * 24000, 0, C.grass);
    Q(P, -2600, 2700, 700, 2800, .1, '#AAA68F');
    Q(P, -2400, 2400, 800, 2400, .2, C.concrete);
    Q(P, -330, 330, 2400, FZ, .2, C.concrete);
    for (const [a, b] of [[-2400, -1150], [1050, 2400]]) {
      Q(P, a, b, 1850, 2475, .3, '#B1BB82');
      Q(P, a + 40, b - 40, 1980, 2475, .4, '#9B8973');
    }
    for (const x of [-1100, 0, 1100]) line(P.line([[x, .5, 800], [x, .5, 2350]]), { stroke: '#BCB7A8', lwPx: 1 });
    for (const z of [1200, 1750, 2250]) line(P.line([[-1150, .5, z], [1050, .5, z]]), { stroke: '#BCB7A8', lwPx: 1 });
  }
  function items(P, t, o) {
    const L = [{ z: 2490, draw: () => school(P) }, { z: 2350, draw: () => canopy(P) },
      { z: 2370, draw: () => column(P, -350) }, { z: 2370, draw: () => column(P, 350) },
      { z: 1780, draw: () => table(P) }];
    for (const [x, z, s] of [[-1500, 2150, 2], [-1200, 2330, 6], [1240, 2270, 9], [1600, 2190, 13], [1990, 2300, 19]]) {
      L.push({ z, draw: () => shrub(P, x, z, t, s, o.wind ?? 1) });
    }
    return L.sort((a, b) => P.depth(b.z) - P.depth(a.z));
  }
  return {
    MARK: { x: 0, z: 2240 }, FZ,
    back(P, t, o = {}) {
      X.fillStyle = linGrad(0, 0, 0, H, [[0, '#80BCD9'], [1, '#E9F1E8']]); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 5; i++) ellipse(((i * 490 + t * 7) % (W + 450)) - 180, 90 + (i % 3) * 70, 180, 30, { fill: '#F4F7F3', stroke: null, alpha: .4 });
      ground(P);
      for (const it of items(P, t, o)) if (it.z > (o.splitZ ?? -Infinity)) it.draw();
    },
    front(P, t, o = {}) {
      for (const it of items(P, t, o)) if (it.z <= (o.splitZ ?? -Infinity)) it.draw();
    },
  };
})();
LOCATIONS['meadow-ridge-elementary-school'] = Object.assign(meadowRidge, {
  spots: {
    'Entrance mark': { x: 0, y: 0, z: 2240 },
    'By the doors': { x: 0, y: 0, z: 2720 },
    'Courtyard': { x: 350, y: 0, z: 1750 },
    'Picnic table': { x: -450, y: 0, z: 1760 },
  },
  cameras: {
    'Entrance': { x: -100, y: 170, z: 1150, f: 1150, hy: 570 },
    'Courtyard wide': { x: -150, y: 240, z: -300, f: 1100, hy: 510 },
    'On the mark': { x: 0, y: 130, z: 1560, f: 1000, hy: 650 },
    'Medium': { x: 0, y: 125, z: 1910, f: 1000, hy: 630 },
    'Picnic table': { x: -580, y: 150, z: 1050, f: 900, hy: 550 },
    'Aerial': { x: 0, y: 1600, z: -1300, f: 1000, hy: 100 },
  },
});
