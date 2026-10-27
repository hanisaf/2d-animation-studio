// Scene 32 props: the kids' tablets and their games, the monitor frame for the twins' video games, Safadi's book stack, Sami's X-ray.
//   stTablet(x, y, w, ang, col)               a tablet held at the chest, its back to us: centre (x, y) in screen px, w px wide
//   stFaceGlow(x, y, r, t)                     the blue screen-light on a face (an overlay, additive)
//   stTabletFloor(P, X, Z, col, rot)           a tablet lying face-down on the floor of a perspective set
//   stScreen(kind, x, y, w, h, t, o)           a tablet game in the rect (x, y, w, h): 'craft' (Craft Blocks) or 'fight' (Fight Planet)
//   stTabletFront(x, y, w, kind, t, o)         a tablet seen from the front, with its game running and the player's name under it
//   stMonitor(t, fn)                           a full-frame monitor bezel; fn() paints the game in a 1600 × 900 screen
//   stBookStack(P, x, y, z, t)                 Safadi's three books stacked flat on a desk, titles on the spines
//   stXrayFilm(P, x, y, z, w, d)               an X-ray film lying on a desk
const ST = {
  ink: PAL.ink, glow: '#8FD8FF', screenDk: '#10161F',
  case: { alma: '#B678E0', jenna: '#F08AC0', housam: '#4A6FC4', danny: '#35A3C2' },
};

function stTablet(x, y, w, ang = 0, col = '#6B7A90') {
  const h = w * .7, lw = Math.max(1.5, w * .03);
  X.save(); X.translate(x, y); X.rotate(ang);
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: col, stroke: ST.ink, lwPx: lw, smooth: .12 });
  shape(rectPts(-w * .42, -h * .38, w * .84, h * .76), { fill: rgba('#FFFFFF', .14), stroke: null, smooth: .12 });
  circle(-w * .36, -h * .3, w * .045, { fill: '#2A2F3A', stroke: ST.ink, lwPx: lw * .5 });                  // the camera
  shape(starPts(0, 0, w * .11, .45, 5), { fill: rgba('#FFFFFF', .55), stroke: null });                         // a star logo
  X.restore();
}

function stFaceGlow(x, y, r, t, k = 1) {
  if (k <= .01) return;
  overlay(() => {
    X.save(); X.globalCompositeOperation = 'screen';
    const f = .8 + .2 * Math.sin(t * 9 + x * .01) * Math.sin(t * 5.3);                                       // the screen flickers
    X.fillStyle = radGrad(x, y, 0, r, [[0, rgba(ST.glow, .42 * f * k)], [.6, rgba(ST.glow, .14 * f * k)], [1, rgba(ST.glow, 0)]]);
    X.fillRect(x - r, y - r, r * 2, r * 2); X.restore();
  });
}

function stTabletFloor(P, x, z, col, rot = 0) {
  const hw = 15, hd = 10.5, ht = 1.4, c = Math.cos(rot), s = Math.sin(rot), at = (u, v, y) => [x + u * c - v * s, y, z + u * s + v * c];
  const top = P.poly([at(-hw, -hd, ht), at(hw, -hd, ht), at(hw, hd, ht), at(-hw, hd, ht)]); if (!top) return;
  const lw = clamp(1.4 * P.k(z), 1, 3);
  shape(top, { fill: col, stroke: ST.ink, lwPx: lw });
  const [cx, cy, k] = P.p(x, ht, z); shape(starPts(cx, cy, 3 * k, .45, 5), { fill: rgba('#FFFFFF', .5), stroke: null });
}

// ---------- the tablet games ----------
// Craft Blocks: a sunny block world; two block girls (Alma purple, Jenna pink) build a pink castle, a block at a time.
// o.view 0 or 1 shifts the camera, so the two tablets show the same world from each player's side.
function stCraft(w, h, t, o = {}) {
  const B = h / 9, ox = -(o.view || 0) * B * 2.5 + Math.sin(t * .4) * B * .3;
  X.fillStyle = linGrad(0, 0, 0, h, [[0, '#7EC8FF'], [1, '#CDEBFF']]); X.fillRect(0, 0, w, h);
  circle(w * .82, h * .18, B * .8, { fill: '#FFE66B', stroke: null });
  for (let i = 0; i < 3; i++) { const cx = frac(i * .37 + t * .02) * (w + 4 * B) - 2 * B; shape(rectPts(cx, h * (.12 + .08 * i), B * 2.4, B * .7), { fill: '#FFFFFF', stroke: null }); }
  const block = (cx, cy, top, side) => {                                                                     // one cube
    shape(rectPts(cx, cy, B, B), { fill: side, stroke: rgba('#000000', .25), lwPx: 1 });
    shape(rectPts(cx, cy, B, B * .28), { fill: top, stroke: null });
  };
  const cols = Math.ceil(w / B) + 6;
  for (let i = -3; i < cols; i++) {                                                                          // the hills: grass on dirt
    const hgt = 2 + Math.round(1.4 + 1.2 * Math.sin(i * .7) + .8 * Math.sin(i * 1.9)), cx = ox + i * B;
    for (let j = 0; j < hgt; j++) block(cx, h - (j + 1) * B, j === hgt - 1 ? '#5BC24A' : '#8A5A35', j === hgt - 1 ? '#3E9A35' : '#6E4426');
  }
  const base = h - 4 * B, n = Math.floor(clamp(o.build ?? frac(t * .12)) * 14);                             // the castle grows
  const CAS = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2], [0, 3], [3, 3], [1.5, 3], [1.5, 4]];
  CAS.slice(0, n).forEach(([cx, cy]) => block(ox + (8 + cx) * B, base - cy * B, '#FFD1EC', '#F08AC0'));
  const girl = (cx, hair, shirt, ph) => {                                                                    // a block girl: head, body, legs
    const by = base + B * .1 - Math.abs(Math.sin(t * 6 + ph)) * B * .25;
    shape(rectPts(cx, by - B * 1.7, B * .7, B * .7), { fill: '#F2C9A8', stroke: ST.ink, lwPx: 1.5 });
    shape(rectPts(cx, by - B * 1.7, B * .7, B * .22), { fill: hair, stroke: null });
    shape(rectPts(cx - B * .05, by - B, B * .8, B * .6), { fill: shirt, stroke: ST.ink, lwPx: 1.5 });
    shape(rectPts(cx + B * .05, by - B * .4, B * .6, B * .4), { fill: '#3D4A7A', stroke: ST.ink, lwPx: 1.5 });
    const arm = Math.sin(t * 8 + ph) * B * .3;                                                               // swinging a pickaxe
    line([[cx + B * .75, by - B * .8], [cx + B * 1.2, by - B * 1.1 + arm]], { stroke: '#8A5A35', lwPx: Math.max(2, B * .12) });
  };
  girl(ox + 6.4 * B, '#7A3DA8', '#B678E0', 0);
  girl(ox + 12.6 * B, '#F2D27A', '#F08AC0', 1.3);
  X.font = `${B * .7}px ${FONT_SFX}`; X.textAlign = 'left'; X.textBaseline = 'top'; X.lineJoin = 'round';
  X.lineWidth = B * .14; X.strokeStyle = ST.ink; X.strokeText('CRAFT BLOCKS', B * .3, B * .25); X.fillStyle = '#FFE66B'; X.fillText('CRAFT BLOCKS', B * .3, B * .25);
}
// Fight Planet: two little spaceships chase round a cartoon planet, zapping each other. Housam blue, Danny teal.
function stFight(w, h, t, o = {}) {
  X.fillStyle = linGrad(0, 0, 0, h, [[0, '#120A2E'], [1, '#2C1858']]); X.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) { const r = .6 + 1.6 * hash(i * 3.1); circle(hash(i) * w, hash(i + 50) * h, r * (h / 300) * (.6 + .4 * Math.sin(t * 4 + i)), { fill: '#FFFFFF', stroke: null }); }
  const cx = w * .5, cy = h * .58, R = h * .26;
  circle(cx, cy, R, { fill: radGrad(cx - R * .3, cy - R * .3, R * .1, R * 1.1, [[0, '#FFB46B'], [1, '#D2472E']]), stroke: ST.ink, lwPx: 3 });
  [[-.4, -.2, .22], [.3, .25, .16], [.1, -.5, .1]].forEach(([u, v, r]) => circle(cx + u * R, cy + v * R, r * R, { fill: rgba('#7A2618', .45), stroke: null }));
  X.save(); X.translate(cx, cy); X.scale(1, .28); circle(0, 0, R * 1.6, { fill: null, stroke: rgba('#FFE7A8', .8), lwPx: 4 }); X.restore();
  const ship = (a, col, flip) => {                                                                           // orbiting ships, nose along the orbit
    const sx = cx + Math.cos(a) * R * 1.55, sy = cy + Math.sin(a) * R * .6 - R * .2, s = h / 22;
    X.save(); X.translate(sx, sy); X.rotate(a + Math.PI / 2 * (flip ? -1 : 1)); if (flip) X.scale(-1, 1);
    shape([[0, -s * 1.4], [s, s], [0, s * .5], [-s, s]], { fill: col, stroke: ST.ink, lwPx: 2.5 });
    circle(0, -s * .2, s * .35, { fill: '#BFF3FF', stroke: ST.ink, lwPx: 1.5 });
    shape([[-s * .4, s * .7], [0, s * (1.6 + .5 * Math.sin(t * 30))], [s * .4, s * .7]], { fill: '#FFC24A', stroke: null });
    X.restore(); return [sx, sy];
  };
  const a1 = t * 1.6, a2 = a1 + 2.4 + .4 * Math.sin(t * .9);
  const p1 = ship(a1, '#4A6FC4', false), p2 = ship(a2, '#35A3C2', true);
  const zap = frac(t * 1.3);                                                                                 // a zap every 0.77 s, alternating
  if (zap < .3) { const [a, b] = Math.floor(t * 1.3) % 2 ? [p1, p2] : [p2, p1], u = zap / .3;
    line([a, mixPt(a, b, u)], { stroke: '#7CFF9B', lwPx: h / 70 });
    if (u > .85) shape(starPts(b[0], b[1], h / 14, .4, 8, t * 4), { fill: '#FFE066', stroke: '#E8572E', lwPx: 2 }); }
  X.font = `${h / 9}px ${FONT_SFX}`; X.textAlign = 'left'; X.textBaseline = 'top'; X.lineJoin = 'round';
  X.lineWidth = h / 60; X.strokeStyle = ST.ink; X.strokeText('FIGHT PLANET', h * .03, h * .03); X.fillStyle = '#7CFF9B'; X.fillText('FIGHT PLANET', h * .03, h * .03);
}
function stScreen(kind, x, y, w, h, t, o = {}) {
  X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.translate(x, y);
  (kind === 'craft' ? stCraft : stFight)(w, h, t, o);
  X.restore();
}
function stTabletFront(x, y, w, kind, t, o = {}) {
  const h = w * .7, b = w * .045;
  X.save(); X.translate(x, y); X.rotate(o.ang || 0);
  shape(rectPts(-w / 2 + 10, -h / 2 + 14, w, h), { fill: rgba('#000000', .25), stroke: null, smooth: .08 });
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: o.col || '#6B7A90', stroke: ST.ink, lwPx: 6, smooth: .08 });
  shape(rectPts(-w / 2 + b, -h / 2 + b, w - 2 * b, h - 2 * b), { fill: ST.screenDk, stroke: ST.ink, lwPx: 3 });
  stScreen(kind, -w / 2 + b, -h / 2 + b, w - 2 * b, h - 2 * b, t, o);
  X.save(); X.globalAlpha = .12; shape([[-w / 2 + b, -h / 2 + b], [-w * .05, -h / 2 + b], [-w * .3, h / 2 - b], [-w / 2 + b, h / 2 - b]], { fill: '#FFFFFF', stroke: null }); X.restore();   // glare
  if (o.name) { X.font = `${w * .07}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = w * .014; X.strokeStyle = ST.ink; X.strokeText(o.name, 0, h / 2 + w * .07); X.fillStyle = o.col || '#FFFFFF'; X.fillText(o.name, 0, h / 2 + w * .07); }
  X.restore();
}

// ---------- the twins' video games: a monitor bezel round a 1600 × 900 screen ----------
const ST_SCR = { x: 160, y: 60, w: 1600, h: 900 };
function stMonitor(t, fn, o = {}) {
  X.fillStyle = o.wall || '#2A2228'; X.fillRect(0, 0, W, H);
  const { x, y, w, h } = ST_SCR, b = 34;
  shape(rectPts(x - b, y - b, w + 2 * b, h + 2 * b), { fill: '#3A3F48', stroke: ST.ink, lwPx: 8, smooth: .03 });
  shape(rectPts(W / 2 - 160, y + h + b, 320, 60), { fill: '#3A3F48', stroke: ST.ink, lwPx: 6 });             // the stand
  X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.translate(x, y);
  withBoil(0, () => fn(w, h));
  for (let yy = 0; yy < h; yy += 6) { X.fillStyle = 'rgba(0,0,0,.09)'; X.fillRect(0, yy, w, 2); }           // scanlines
  X.fillStyle = radGrad(w / 2, h / 2, h * .5, h * 1.0, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.45)']]); X.fillRect(0, 0, w, h);
  X.restore();
  circle(x + w - 30, y + h + b * .5, 6, { fill: '#7CFF9B', stroke: null });                                // the power light
}
// arcade text with an outline, in the game's own coordinates
function stArcade(txt, x, y, size, col, align = 'center') {
  X.font = `${size}px ${FONT_SFX}`; X.textAlign = align; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = size * .18; X.strokeStyle = '#0B0B14'; X.strokeText(txt, x, y); X.fillStyle = col; X.fillText(txt, x, y);
}

// ---------- Safadi's three books, stacked flat on the desk ----------
const ST_BOOKS = [{ t: 'MATHEMATICS', col: '#2F4D8C' }, { t: 'PHYSICS', col: '#B8463A' }, { t: 'ASTRONOMY', col: '#3E7A4E' }];
function stBookStack(P, x, y, z, t) {
  const bw = 70, bd = 50, bh = 9;
  ST_BOOKS.forEach((b, i) => {
    const y0 = y + i * bh, y1 = y0 + bh, dx = (i - 1) * 4, x0 = x - bw / 2 + dx, x1 = x + bw / 2 + dx, zf = P.dir > 0 ? z - bd / 2 : z + bd / 2, zb = P.dir > 0 ? z + bd / 2 : z - bd / 2;
    const top = P.poly([[x0, y1, zf], [x1, y1, zf], [x1, y1, zb], [x0, y1, zb]]), spine = P.poly([[x0, y0, zf], [x1, y0, zf], [x1, y1, zf], [x0, y1, zf]]);
    const side = P.poly([[x1, y0, zf], [x1, y0, zb], [x1, y1, zb], [x1, y1, zf]]);
    const lw = clamp(1.3 * P.k(z), 1, 3);
    if (side) shape(side, { fill: '#F4EEDD', stroke: ST.ink, lwPx: lw });                                    // the pages
    if (top) shape(top, { fill: b.col, stroke: ST.ink, lwPx: lw });
    if (spine) { shape(spine, { fill: mixCol(b.col, '#000000', .15), stroke: ST.ink, lwPx: lw });
      const [cx, cy, k] = P.p(x + dx, (y0 + y1) / 2, zf); X.font = `700 ${bh * k * .7}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.fillStyle = '#F2C94C'; X.fillText(b.t, cx, cy + k * .3, bw * k * .9); }
    if (i === 2 && top) {                                                                                    // his face on the top cover
      const [cx, cy, k] = P.p(x + dx, y1, z); X.save(); X.translate(cx, cy); X.scale(1, .35);
      circle(0, 0, 13 * k, { fill: '#E9C3A0', stroke: ST.ink, lwPx: lw }); shape([[-12 * k, -2 * k], [-6 * k, -11 * k], [6 * k, -11 * k], [12 * k, -2 * k]], { fill: '#3A2A22', stroke: null }); X.restore();
    }
  });
}

// ---------- Sami's X-ray film, lying on the desk ----------
function stXrayFilm(P, x, y, z, w = 60, d = 46) {
  const q = P.poly([[x - w / 2, y, z - d / 2], [x + w / 2, y, z - d / 2], [x + w / 2, y, z + d / 2], [x - w / 2, y, z + d / 2]]); if (!q) return;
  shape(q, { fill: '#1C2A36', stroke: ST.ink, lwPx: clamp(1.3 * P.k(z), 1, 3) });
  const pt = (u, v) => { const [a, b] = P.p(x + u * w / 2, y + .2, z + v * d / 2); return [a, b]; };
  const k = clamp(1.2 * P.k(z), 1, 3);
  line([pt(0, -.8), pt(0, .8)], { stroke: rgba('#DDEFFF', .8), lwPx: k * 1.4 });                             // the spine
  for (let i = 0; i < 5; i++) { const v = -.6 + i * .3;                                                      // the ribs
    line([pt(0, v), pt(-.55, v + .12), pt(-.75, v + .32)], { stroke: rgba('#DDEFFF', .65), lwPx: k, smooth: true });
    line([pt(0, v), pt(.55, v + .12), pt(.75, v + .32)], { stroke: rgba('#DDEFFF', .65), lwPx: k, smooth: true }); }
}

// ---------- the twins' video games, shared with scene 33 (t0 = when the game starts) ----------
// ROBO INVASION: rows of Robo-Safadis march on the beat; King Neptune shoots them down. 6.4 s long.
  const ST_RI_HITS = [[.4, 2, 3], [1.2, 2, 1], [2.0, 1, 4], [2.6, 2, 5], [3.3, 1, 0], [3.9, 0, 2], [4.6, 1, 2], [5.2, 0, 5]];   // [seconds into the game, row, col]
  const ST_RI_BOLTS = [[.8, 1, 2], [2.3, 0, 4], [4.2, 0, 1]];                 // the robots shoot back
const stRiStep = (t, t0) => Math.floor(Math.max(0, t - t0) * 112 / 60);
function stRiBot(r, c, t, t0) {
    const st = stRiStep(t, t0), tri = st % 8, hx = 40 * (tri <= 4 ? tri : 8 - tri) - 80, dn = 40 * Math.floor(st / 8);
    return [400 + c * 160 + hx, 250 + r * 140 + dn];                         // feet
  }
function stRoboScreen(w, h, t, t0) {
      const RI_HITS = ST_RI_HITS.map(([d, r, c]) => [t0 + d, r, c]), RI_BOLTS = ST_RI_BOLTS.map(([d, r, c]) => [t0 + d, r, c]), riBot = (r, c, tt) => stRiBot(r, c, tt, t0), riStep = tt => stRiStep(tt, t0);
      const RI_NEP = [[t0, 800], ...RI_HITS.map(([th, r, c]) => [th - .3, riBot(r, c, th - .3)[0] - 20]), [t0 + 6.4, 800]];
      X.fillStyle = linGrad(0, 0, 0, h, [[0, '#070A1C'], [1, '#1B1240']]); X.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) { const y = frac(hash(i + 20) + (t - t0) * .05 * (1 + hash(i))) * h; circle(hash(i) * w, y, 1 + 2 * hash(i * 3), { fill: rgba('#FFFFFF', .4 + .5 * hash(i * 7)), stroke: null }); }
      shape(rectPts(0, 862, w, 8), { fill: '#3BE07A', stroke: null });        // the ground line
      // the invaders: real Robo-Safadis, marching on the beat
      const odd = riStep(t) % 2;
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
        const hit = RI_HITS.find(([, hr, hc]) => hr === r && hc === c); if (hit && t > hit[0]) continue;
        const [x, y] = riBot(r, c, t);
        roboSafadi(x, y, 6, { t, noShadow: true, boil: 0, eyes: 'open', red: 1, mouth: 'teeth', brows: 'angry', hum: false, jump: .25 * pulse(t),
          handL: odd ? [-6, -20] : [-6.5, -14], handR: odd ? [6.5, -14] : [6, -20], handPoseL: 'claw', handPoseR: 'claw', antenna: odd ? .3 : -.3 });
      }
      // their bolts
      for (const [tb, r, c] of RI_BOLTS) { const u = seg(t, tb, tb + .9); if (u <= 0 || u >= 1) continue; const [x, y] = riBot(r, c, tb);
        const by = lerp(y + 10, 880, u); shape([[x - 6, by - 26], [x + 6, by - 16], [x - 6, by - 6], [x + 6, by + 4]], { fill: null, stroke: '#FF4A4A', lwPx: 6, closed: false }); }
      // King Neptune, the ship
      const nx = kf(t, RI_NEP), dir = kf(t + .05, RI_NEP) - nx, next = RI_HITS.find(([th]) => th > t - .05), tgt = next ? riBot(next[1], next[2], t) : [nx, 0];
      const aim = clamp(Math.atan2(tgt[1] - 40 - 700, tgt[0] - nx), -2.4, -.7);
      const NA = withBoil(0, () => neptune(nx, 860, 12, { t, sit: 1, trident: true, tridentAng: aim, eyes: next ? 'smug' : 'sparkle', mouth: 'grin', headTilt: .1, flip: dir < -.5, power: .3, boil: 0 }));
      for (const [th, r, c] of RI_HITS) {
        const k = seg(t, th - .25, th + .05); if (k > 0 && k < 1 && NA && NA.tridentTip) { const [bx, by] = riBot(r, c, th); neptuneBlast(NA.tridentTip[0], NA.tridentTip[1], bx, by - 40, k, t, 22); }
        const u = seg(t, th, th + .5); if (u <= 0 || u >= 1) continue;
        const [bx, by] = riBot(r, c, th), p = backOut(seg(u, 0, .4)) * (1 - seg(u, .7, 1));
        shape(starPts(bx, by - 40, 70 * p, .4, 10, u * 3), { fill: '#FFE066', stroke: '#E8572E', lwPx: 4 });
        for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + r, d = 30 + 140 * easeOut(u); shape(rectPts(bx + Math.cos(a) * d - 7, by - 40 + Math.sin(a) * d - 7 + 120 * u * u, 14, 14), { fill: '#B9C2CC', stroke: '#0B0B14', lwPx: 2 }); }
        stArcade('ZAP!', bx, by - 120 - 40 * u, 54, '#7CFF9B');
      }
      // the HUD
      const hits = RI_HITS.filter(([th]) => t > th).length, score = String(4200 + hits * 350).padStart(6, '0');
      stArcade('SCORE ' + score, 40, 40, 44, '#FFFFFF', 'left'); stArcade('HI-SCORE 006800', w - 40, 40, 44, '#FFE066', 'right');
      for (let i = 0; i < 3; i++) shape([[w - 200 + i * 56, 890], [w - 196 + i * 56, 868], [w - 186 + i * 56, 880], [w - 176 + i * 56, 862], [w - 166 + i * 56, 880], [w - 156 + i * 56, 868], [w - 152 + i * 56, 890]], { fill: '#F2C94C', stroke: '#0B0B14', lwPx: 2 });   // lives: crowns
      const ti = 1 - seg(t, t0 + .9, t0 + 1.3), ts = backOut(seg(t, t0, t0 + .35));
      if (ti > .01) { X.save(); X.globalAlpha = ti; X.translate(w / 2, h * .48); X.scale(ts, ts); stArcade('ROBO INVASION', 0, 0, 150, '#FF5A5A'); stArcade('PLAYER 1: PROF. SAFADI', 0, 110, 44, '#FFFFFF'); X.restore(); }
      else stArcade('ROBO INVASION', w / 2, 40, 46, '#FF5A5A');
      if (t > t0 + 5.7 && frac(t * 3) < .7) stArcade('NEW HIGH SCORE!', w / 2, h * .45, 110, '#FFE066');
}

// WORLD CHAMPION: little Sami dribbles past Housam, Danny and Jenna and chips it over Alma. GOAL at 5.1 s.
const ST_WC = { ground: 790, goal: 2700, len: 3000, G: 2.4 };                 // G: rig scale on the pitch
const ST_DEF = [['housam', 820], ['danny', 1380], ['jenna', 1880]], ST_KEEP = 2600, ST_CHIP = [4.2, 5.1];   // the chip, seconds into the game
function stSoccerScreen(w, h, t, t0) {
      const WC = ST_WC, DEF = ST_DEF, KEEP = ST_KEEP, CHIP = ST_CHIP.map(d => t0 + d), UNIT = { housam: HOUSAM_UNIT, danny: DANNY_UNIT, jenna: JENNA_UNIT }, RIG = { housam, danny, jenna };
      const on = (x, a, b, r) => ease(seg(x, a, a + r)) * (1 - ease(seg(x, b - r, b))), bounce = (x, f, ph = 0) => Math.abs(Math.sin(x * f + ph));
      const samiGX = tt => kf(tt, [[t0, 150], [CHIP[0], 2250]], x => x);
      const sg = samiGX(t), cx = clamp(sg - 520, 0, WC.len - w), gx = x => x - cx, goal = t > CHIP[1];
      // the stands and the crowd
      X.fillStyle = linGrad(0, 0, 0, 300, [[0, '#2C3E78'], [1, '#4A5EA0']]); X.fillRect(0, 0, w, 330);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 46; i++) {
        const x = frac(i / 46 - cx / 2400 * (1 + row * .1)) * (w + 80) - 40, hj = goal ? 18 * bounce(t, 9, i) : 6 * bounce(t, 4, i * 1.3 + row);
        const y = 90 + row * 62 - hj, col = ['#F2C94C', '#E8572E', '#FFFFFF', '#3BE07A', '#D0508E', '#7FD3FF'][Math.floor(hash(i * 7 + row) * 6)];
        circle(x, y + 22, 22, { fill: col, stroke: '#0B0B14', lwPx: 2 }); circle(x, y - 6, 13, { fill: ['#F2C9A8', '#C98A5E', '#8A5A35'][Math.floor(hash(i + row * 3) * 3)], stroke: '#0B0B14', lwPx: 2 });
      }
      // the pitch, striped, scrolling
      X.fillStyle = '#3FA34D'; X.fillRect(0, 330, w, h - 330);
      for (let s = Math.floor(cx / 200) * 200; s < cx + w; s += 200) if ((s / 200) % 2 === 0) { X.fillStyle = '#4CB55A'; X.fillRect(gx(s), 330, 200, h - 330); }
      line([[0, 360], [w, 360]], { stroke: '#FFFFFF', lwPx: 6 });
      if (gx(1500) > -50 && gx(1500) < w + 50) line([[gx(1500), 360], [gx(1500), h]], { stroke: '#FFFFFF', lwPx: 6 });   // halfway
      // the goal
      const g0 = gx(WC.goal);
      for (let i = 0; i < 10; i++) line([[g0 + i * 14, 470], [g0 + 120, 470 + i * 2]], { stroke: rgba('#FFFFFF', .5), lwPx: 2 });
      for (let j = 0; j < 10; j++) line([[g0, 470 + j * 30], [g0 + 120, 480 + j * 30]], { stroke: rgba('#FFFFFF', .5), lwPx: 2 });
      // the defenders: beaten one by one; little Alma in goal
      for (const [n, dx] of DEF) {
        const u = ease(seg(sg, dx - 280, dx - 60)), v = ease(seg(sg, dx - 40, dx + 220)), x = gx(dx) + 90 * u - 70 * v, s = UNIT[n] * WC.G;
        if (x < -200 || x > w + 200) continue;
        const o = { t, noShadow: true, boil: 0, lookX: clamp((gx(sg) - x) / 400, -.9, .9), lean: .12 * u * (1 - v), eyes: v > .1 ? 'squeeze' : 'wide', mouth: v > .1 ? 'O' : 'o', brows: v > .1 ? 'worried' : 'angry',
          handL: [-5, -15 + 4 * u], handR: [5, -15 + 4 * u], handPoseL: 'open', handPoseR: 'open', giraffe: false };
        if (n === 'housam') Object.assign(o, { spin: TAU * v });
        if (n === 'danny') Object.assign(o, { rot: -1.3 * v, dy: -2 * v });
        if (n === 'jenna') Object.assign(o, { tilt: .3 * v, jump: 1.5 * Math.sin(Math.PI * v) });
        const R = RIG[n](x, WC.ground, s, o);
        if (v > .6) alEmote('?', R, ALMA_UNIT * WC.G, on(sg, dx + 120, dx + 900, 30), t);
      }
      const dive = ease(seg(t, CHIP[0] + .25, CHIP[0] + .7));
      alma(gx(KEEP) - 150 * dive, WC.ground, ALMA_UNIT * WC.G, { t, noShadow: true, boil: 0, rot: -1.0 * dive, jump: 2.4 * Math.sin(Math.PI * dive), handL: [-6, -18], handR: [6, -18], handPoseL: 'palm', handPoseR: 'palm',
        eyes: dive > .1 ? 'squeeze' : 'wide', mouth: dive > .1 ? 'O' : 'o', brows: 'worried', lookX: -.8 });
      // little Sami (P1)
      const kickK = Math.sin(Math.PI * seg(t, CHIP[0] - .15, CHIP[0] + .25));
      const so = goal ? { handL: [-6.4, -25], handR: [6.4, -25], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', brows: 'up', jump: 1.2 * bounce(t, 8), lookX: .2 }
        : { ...samiWalk(sg / 52, 1), turn: .35, lookX: .5, lookY: .3, brows: 'focused', mouth: 'grin', eyes: 'open' };
      if (!goal && kickK > 0) Object.assign(so, { footR: [3.5, -4.5 - 3 * kickK], lean: -.08 * kickK });
      const SA = sami(gx(sg), WC.ground, SAMI_UNIT * WC.G, { t, noShadow: true, boil: 0, ...so });
      const mk = SA.top[1] - 40 + 6 * Math.sin(t * 6);                          // the P1 marker
      shape([[gx(sg) - 18, mk - 26], [gx(sg) + 18, mk - 26], [gx(sg), mk]], { fill: '#FFE066', stroke: '#0B0B14', lwPx: 3 }); stArcade('P1', gx(sg), mk - 52, 36, '#FFE066');
      // the ball
      let bx, by;
      if (t < CHIP[0]) { const p = sg / 52; bx = gx(sg) + 80 + 24 * Math.sin(p * Math.PI); by = WC.ground - 30 - 24 * Math.abs(Math.sin(p * Math.PI)); }
      else if (t < CHIP[1]) { const u = seg(t, CHIP[0], CHIP[1]); bx = lerp(gx(2290), gx(WC.goal + 40), u); by = lerp(WC.ground - 30, 560, u) - 360 * Math.sin(Math.PI * u); }
      else { const u = easeIn(seg(t, CHIP[1], CHIP[1] + .4)); bx = gx(WC.goal + 60); by = lerp(560, WC.ground - 30, u); }
      housamBall(bx, by, 12, { spin: t * 8 });
      // posts in front of the ball
      shape(rectPts(g0 - 8, 460, 16, WC.ground - 450), { fill: '#FFFFFF', stroke: '#0B0B14', lwPx: 3 }); shape(rectPts(g0 - 8, 452, 140, 16), { fill: '#FFFFFF', stroke: '#0B0B14', lwPx: 3 });
      // the HUD
      shape(rectPts(30, 24, 420, 70), { fill: rgba('#0B0B14', .75), stroke: '#FFFFFF', lwPx: 3, smooth: .1 });
      stArcade(`SAMI  ${goal ? 1 : 0} - 0  KIDS`, 240, 60, 40, '#FFFFFF');
      stArcade(`89:${String(40 + Math.floor((t - t0) * 3)).padStart(2, '0').slice(-2)}`, w - 120, 60, 44, '#FFE066');
      const ti = 1 - seg(t, t0 + .9, t0 + 1.3), ts = backOut(seg(t, t0, t0 + .35));
      if (ti > .01) { X.save(); X.globalAlpha = ti; X.translate(w / 2, h * .45); X.scale(ts, ts); stArcade('WORLD CHAMPION', 0, 0, 140, '#FFE066'); stArcade('PLAYER 1: DR. SAMI', 0, 105, 44, '#FFFFFF'); X.restore(); }
      if (goal) {
        const p = backOut(seg(t, CHIP[1], CHIP[1] + .4));
        for (let i = 0; i < 60; i++) { const u = frac(hash(i) + (t - CHIP[1]) * .5), x = hash(i * 3) * w, y = u * h * 1.1 - 40; shape(rectPts(x, y, 14, 8), { fill: ['#F2C94C', '#E8572E', '#3BE07A', '#7FD3FF', '#D0508E'][i % 5], stroke: null }); }
        X.save(); X.translate(w / 2, h * .42); X.rotate(-.06 + .03 * Math.sin(t * 8)); X.scale(p, p); stArcade('GOAL!!!', 0, 0, 220, frac(t * 4) < .5 ? '#FFE066' : '#FF7A3D'); X.restore();
      }
}

