// scenes/talent_show/scene24_competition_begins/props.js: the talent-show dressing for "The Competition Begins" (all prefixed cb, since every
// script shares one scope). World props take the camera P; screen props take (x, y) in px.
//   cbJudgesTable(P)                     the judges' table on the court, facing the stage, with name plates (world)
//   cbJudgeChair(P, x, fancy)            a chair back behind a judge; fancy = Pearl's pink-and-gold one (world)
//   cbChair(P, x, z)                     a folding chair for the audience, facing the stage (world)
//   cbBanner(P, t)                       DCES TALENT SHOW, hung across the top of the stage opening (world, stage view)
//   cbSpot(x, top, floorY, w, a)         a cone of stage light (screen)
//   cbScoreCard(x, y, h, num, k, o)      a judge's score paddle: (x, y) = the hand on the stick, h = card height px, k 0..1 pops it up
//   cbCube(x, y, s, t, o)                Danny's Rubik's cube (screen; s = px per cube unit, ~3 units wide)
//   cbCard(text, k, o)                   a full-frame title card, or a corner tag with o.tag

const CB_TABLE = { x0: -340, x1: 340, z0: 1180, z1: 1240, h: 62 };
const CB_JUDGES = { dragon: -215, jester_fester: 0, princess_pearl: 215 };      // judges' X, behind the table at Z 1262
const CB_ROWS = [1480, 1600, 1720], CB_SEAT = 45;                                 // audience chair rows (seat front Z) and seat height

// An axis-aligned box with back-face culling (the same idea as the sets' box()).
function cbBox(P, x0, x1, y0, y1, z0, z1, col, lw = 1.2) {
  const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .2), front: col, side: mixCol(col, '#000000', .15) } : col, cam = P.cam;
  const face = (pts, fill) => { const q = P.poly(pts); if (q) shape(q, { fill, stroke: PAL.ink, lwPx: clamp(lw * cam.f / 1000, .7, 3.5) }); };
  if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.front);
  if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.front);
  if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
  if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
  if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
}

function cbJudgesTable(P) {
  const b = CB_TABLE, top = { top: '#F4EFE4', front: '#E9E2D2', side: '#CFC6B2' };
  cbBox(P, b.x0, b.x1, b.h - 5, b.h, b.z0, b.z1, top);
  // the skirt: navy, gold trim, JUDGES in the middle (only its stage-facing side is ever seen)
  if (P.cam.z < b.z0) P.plane(b.z0 - 1, () => {
    X.save(); X.scale(P.dir, 1);
    shape(rectPts(b.x0, -b.h + 5, b.x1 - b.x0, b.h - 5), { fill: '#1F3566', stroke: PAL.ink, lwPx: 1.6 });
    for (let x = b.x0 + 28; x < b.x1; x += 34) line([[x, -b.h + 10], [x + 4, -2]], { stroke: 'rgba(255,255,255,.08)', lwPx: 3 });
    shape(rectPts(b.x0, -b.h + 5, b.x1 - b.x0, 7), { fill: '#F4C431', stroke: null });
    shape(rectPts(-78, -54, 156, 36), { fill: '#F4C431', stroke: PAL.ink, lwPx: 1.4, smooth: .2 });
    X.font = `26px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#1F3566'; X.fillText('★ JUDGES ★', 0, -34);
    X.restore();
  });
  // the name plates: little tent cards on the table, one in front of each judge
  for (const [name, x] of Object.entries(CB_JUDGES)) {
    const label = { dragon: 'DRAGON', jester_fester: 'JESTER FESTER', princess_pearl: 'PRINCESS PEARL' }[name], w = name === 'dragon' ? 74 : 104;
    const q = P.poly([[x - w / 2, b.h, b.z0 + 14], [x + w / 2, b.h, b.z0 + 14], [x + w / 2, b.h + 20, b.z0 + 20], [x - w / 2, b.h + 20, b.z0 + 20]]);
    if (!q) continue;
    shape(q, { fill: name === 'princess_pearl' ? '#FFE4F0' : '#FFFDF6', stroke: PAL.ink, lwPx: 1.4 });
    const [cx, cy, k] = P.p(x, b.h + 10, b.z0 + 17);
    X.save(); X.font = `${Math.max(6, 11 * k)}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = name === 'princess_pearl' ? '#C2457E' : '#1F3566'; X.fillText(label, cx, cy + 1 * k); X.restore();
  }
}

function cbJudgeChair(P, x, fancy) {
  const z = 1290;
  if (fancy) {                                                                  // Pearl's chair: a pink back with a gold star on top
    const pts = [[-48, 40], [-54, 170], [-30, 200], [0, 212], [30, 200], [54, 170], [48, 40]].map(([dx, y]) => [x + dx, y, z]);
    const q = P.poly(pts); if (q) shape(q, { fill: '#F48FB8', stroke: PAL.ink, lwPx: 1.8, smooth: .3 });
    const inner = P.poly([[-34, 60], [-38, 160], [0, 192], [38, 160], [34, 60]].map(([dx, y]) => [x + dx, y, z - 1])); if (inner) shape(inner, { fill: '#FFD3E6', stroke: '#D2618F', lwPx: 1.2, smooth: .3 });
    const [sx, sy, k] = P.p(x, 214, z); shape(starPts(sx, sy, 16 * k), { fill: '#F2C14E', stroke: PAL.ink, lwPx: 1.5 });
  } else {
    cbBox(P, x - 38, x + 38, 40, 150, z, z + 6, { top: '#B9C1C8', front: '#7C858D', side: '#5C656D' }, 1);
    cbBox(P, x - 34, x + 34, 112, 146, z - 1, z, { top: '#3E6FB0', front: '#3E6FB0', side: '#2C5598' }, .8);
  }
}

// A folding chair facing the stage (−Z): seat front edge at z, seat at CB_SEAT, back at z + 40.
function cbChair(P, x, z) {
  const steel = { top: '#9AA3AB', front: '#6E777F', side: '#555E66' }, seat = { top: '#3E6FB0', front: '#2E5A96', side: '#24497C' };
  cbBox(P, x - 26, x + 26, 60, 108, z + 38, z + 44, seat, .9);                        // the back
  for (const dx of [-24, 20]) { cbBox(P, x + dx, x + dx + 4, 0, 108, z + 40, z + 44, steel, .7); cbBox(P, x + dx, x + dx + 4, 0, CB_SEAT, z + 2, z + 6, steel, .7); }
  cbBox(P, x - 26, x + 26, CB_SEAT - 5, CB_SEAT, z, z + 40, seat, .9);                 // the seat
}

function cbBanner(P, t) {
  const z = 312, sw = 3 * Math.sin(t * 1.1);
  if (!P.visible(z)) return;
  P.plane(z, () => {
    X.save(); X.scale(P.dir, 1);
    for (const sx of [-1, 1]) line([[sx * 300, -470], [sx * 300, -442 - sw * sx]], { stroke: '#56606A', lwPx: 1.5 });
    shape([[-330, -442 - sw], [330, -442 + sw], [322, -384 + sw], [0, -376], [-322, -384 - sw]], { fill: '#2E8F94', stroke: PAL.ink, lwPx: 2.4, smooth: .15 });
    shape([[-330, -442 - sw], [-366, -420], [-330, -398]], { fill: '#257A7F', stroke: PAL.ink, lwPx: 2 });
    shape([[330, -442 + sw], [366, -420], [330, -398]], { fill: '#257A7F', stroke: PAL.ink, lwPx: 2 });
    X.font = `40px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
    X.lineWidth = 7; X.strokeStyle = PAL.ink; X.strokeText('★ DCES TALENT SHOW ★', 0, -408); X.fillStyle = '#FFE48A'; X.fillText('★ DCES TALENT SHOW ★', 0, -408);
    X.restore();
  });
}

function cbSpot(x, top, floorY, w, a = .2, col = '#FFF1C8') {
  X.save(); X.globalCompositeOperation = 'lighter';
  shape([[x - 40, top], [x + 40, top], [x + w / 2, floorY], [x - w / 2, floorY]], { fill: rgba(col, a), stroke: null });
  ellipse(x, floorY, w / 2, w * .08, { fill: rgba(col, a * 1.2), stroke: null });
  X.restore();
}

// A score paddle held by its stick. The number's colour says how good: red for a low score, gold (with sparkles) for a 10.
function cbScoreCard(x, y, h, num, k, o = {}) {
  if (k <= .01) return;
  const t = o.t ?? T, ink = PAL.ink, col = num >= 10 ? '#E3A21A' : num >= 8 ? '#2E8F94' : num >= 6 ? '#EE7A2A' : '#D8433C';
  X.save(); X.translate(x, y); X.rotate((o.ang || 0) + .06 * boing(t, o.t0 ?? -9, 2.5, 5)); X.scale(k, k);
  const w = h * .9, cy = -h * .45 - h * .5;
  shape(rectPts(-h * .04, -h * .5, h * .08, h * .62), { fill: '#C99459', stroke: ink, lwPx: Math.max(1.5, h * .02) });   // the stick
  shape(rectPts(-w / 2, cy - h / 2, w, h), { fill: '#FFFDF6', stroke: ink, lwPx: Math.max(2, h * .035), smooth: .12 });
  X.font = `${h * .78}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
  X.lineWidth = h * .09; X.strokeStyle = ink; X.strokeText(String(num), 0, cy + h * .06); X.fillStyle = col; X.fillText(String(num), 0, cy + h * .06);
  if (num >= 10) for (let i = 0; i < 4; i++) {
    const a = t * 2 + i * TAU / 4, r = h * (.62 + .06 * Math.sin(t * 6 + i)), tw = .5 + .5 * Math.sin(t * 9 + i * 2);
    shape(starPts(Math.cos(a) * r, cy + Math.sin(a) * r * .9, h * (.07 + .05 * tw), .4, 4), { fill: '#FFF1A8', stroke: ink, lwPx: 1.5 });
  }
  X.restore();
}

// Danny's Rubik's cube at screen (x, y) = its centre. The top layer turns a quarter every so often and the colours shuffle.
function cbCube(x, y, s, t, o = {}) {
  const COLS = ['#E8443A', '#F7F4EA', '#3E7BD8', '#F2C230', '#4CB050', '#F08A2C'], lw = clamp(s * .12, .8, 2.5) / s, ink = PAL.ink;
  const step = Math.floor(t / (o.rate || .7)), f = frac(t / (o.rate || .7)), turn = o.still ? 0 : ease(seg(f, 0, .35));
  const col = (i, j, face) => COLS[Math.floor(hash(step * 7.1 + i * 3.3 + j * 5.7 + face * 11.3) * 6)];
  X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s, s);
  shape([[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]], { fill: '#1E1E24', stroke: ink, lw });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) shape(rectPts(-1.4 + i + (j === 0 ? turn * .6 : 0), -1.4 + j, .8, .8), { fill: col(i, j, 0), stroke: null });
  shape([[-1.5, -1.5], [1.5, -1.5], [2.1, -2.3], [-.9, -2.3]], { fill: '#1E1E24', stroke: ink, lw });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const u = -1.4 + i + .6 * (j + .5) / 2 * 1.2, v = -1.6 - j * .38; shape([[u, v], [u + .8, v], [u + 1.0, v - .28], [u + .2, v - .28]], { fill: col(i, j, 1), stroke: null }); }
  X.restore();
}

function cbCard(text, k, o = {}) {
  if (k <= .01) return;
  overlay(() => {
    X.save();
    if (o.tag) {
      const c = backOut(clamp(k * 1.4)); X.translate(o.x ?? 330, o.y ?? 120); X.rotate(-.05); X.scale(c, c);
      X.font = `66px ${FONT_SFX}`; const w = X.measureText(text).width + 80;
      shape(rectPts(-w / 2, -52, w, 104), { fill: o.col || '#FFF4EC', stroke: PAL.ink, lwPx: 7, smooth: .1 });
      X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 12; X.strokeStyle = PAL.ink; X.strokeText(text, 0, 6); X.fillStyle = o.ink || '#2E8F94'; X.fillText(text, 0, 6);
    } else {
      X.globalAlpha = clamp(k * 2); X.fillStyle = 'rgba(31,53,102,.55)'; X.fillRect(0, 0, W, H); X.globalAlpha = 1;
      const c = backOut(clamp(k * 1.6)); X.translate(W / 2, H / 2); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-620, -110, 1240, 220), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 9 });
      X.font = `100px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 16; X.strokeStyle = PAL.ink; X.strokeText(text, 0, 10); X.fillStyle = o.ink || '#F4C431'; X.fillText(text, 0, 10);
    }
    X.restore();
  });
}
