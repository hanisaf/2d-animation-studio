// characters/princess_pearl/princess_pearl.js: Princess Pearl, a plush rainbow dolphin in a gold crown
// (see reference.webp and README.md).
//
// pearl(x, y, s, o) → anchors
//   (x, y) = the surface point under her middle (floor, cushion, throne seat), screen px · s = px per unit.
//   She is ~24 units nose to tail when lying flat; ~18 units tall sitting. In a set use s = PP_UNIT * P.k(Z).
//
// The body is built along a bendable SPINE (tail base → nose), so one rig does lying, sitting, curling and wiggling.
// Pose     sit (0 lying flat like the photo … 1 sitting upright, tail on the seat) · headTilt (rad, + = nose up)
//          wag (tail fluke swing, rad) · rot (whole body) · flip (true = faces LEFT) · turn (-1..1 squashes x for a
//          turn-around; pass the signed value through 0 to flip direction) · sq (squash) · dy (hop, units up) · breathe
// Flippers flipNear / flipFar: angle offsets (rad) from resting · point (0..1) swings the near flipper out to point
//          forward at world angle pointAng (default -.35: forward and a little up)
// Face     eyes: open | bored | closed | happy | angry | wide | sparkle · lookX / lookY (-1..1) · blink (0..1, auto if unset)
//          brows: normal | up | flat | angry | worried · mouth: smile | flat | frown | open | yawn | smirk | o · blush (default on)
// Crown    crownTilt (rad) · crownLift (units, for bounces)
// Extras   emote: '?' | '!' | 'sweat' | 'heart' | 'music' with emoteK
//
// Returns anchors in screen px: { head (eye), mouth, nose, crown, flipper (near flipper tip), belly }

const PP = {
  ink: '#5B3552', yellow: '#FBE79B', mint: '#A9EBCB', peach: '#FBC6A0', pink: '#F5A2C6', lavender: '#D4B5EC', sky: '#A8DDF2',
  bead: '#1E1620', lid: '#F6BBB0', blush: '#F48DB0', gold: '#EDC04D', goldDk: '#B98A22', goldLt: '#FFE9A0',
  gems: ['#F47FB5', '#6FA8F0', '#F5D84A', '#8ED8F2'],
};
const PP_UNIT = 10;          // world units per unit (sitting she is ~180 world units tall, like Fester)

function pearl(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, L = 18, N = 28;
  const lw = clamp(s * .13, 1.5, 5) / s;
  // ---- spine ----
  const sit = o.sit ?? 0, tilt = o.headTilt || 0;
  const theta = u => (o.rot || 0) + sit * (-1.45 * ease(seg(u, .05, .55)) + .9 * ease(seg(u, .6, 1))) - tilt * ease(seg(u, .6, 1))
    + (o.wag || 0) * (1 - u) ** 3 * .6 + (o.breathe ?? .03 * wob(t, .35)) * Math.sin(u * Math.PI);
  const sp = [[0, 0]], th = [theta(0)];
  for (let i = 1; i <= N; i++) { const u = i / N, a = theta(u - .5 / N); sp.push([sp[i - 1][0] + Math.cos(a) * L / N, sp[i - 1][1] + Math.sin(a) * L / N]); th.push(theta(u)); }
  const at = u => { const f = clamp(u) * N, i = Math.min(N - 1, Math.floor(f)), k = f - i; return [lerp(sp[i][0], sp[i + 1][0], k), lerp(sp[i][1], sp[i + 1][1], k)]; };
  const angAt = u => theta(clamp(u));
  const nrm = u => { const a = angAt(u); return [Math.sin(a), -Math.cos(a)]; };            // dorsal side
  const off = (u, d) => { const p = at(u), n = nrm(u); return [p[0] + n[0] * d, p[1] + n[1] * d]; };
  // thickness profile: dorsal (up) and ventral (down) half-widths
  const prof = [[0, .9, .8], [.15, 1.8, 1.6], [.3, 3.1, 2.8], [.45, 4.2, 3.6], [.6, 4.9, 4.0], [.72, 5.0, 4.0], [.82, 4.4, 3.6], [.9, 3.1, 2.9], [.95, 2.1, 2.2], [1, 1.2, 1.4]];
  const pr = (u, j) => { for (let i = 1; i < prof.length; i++) if (u <= prof[i][0]) { const a = prof[i - 1], b = prof[i], k = ease((u - a[0]) / (b[0] - a[0])); return lerp(a[j], b[j], k); } return prof[prof.length - 1][j]; };
  const outline = [];
  for (let i = 0; i <= 40; i++) { const u = i / 40; outline.push(off(u, pr(u, 1))); }
  { const p = at(1), a = angAt(1); for (let i = 1; i < 6; i++) { const b = a - Math.PI / 2 + i / 6 * Math.PI; const r = lerp(pr(1, 1), pr(1, 2), i / 6); outline.push([p[0] + Math.cos(b) * r, p[1] + Math.sin(b) * r]); } }
  for (let i = 40; i >= 0; i--) { const u = i / 40; outline.push(off(u, -pr(u, 2))); }
  // placement: bottom of the body on y = 0, centred in x
  let mnx = 1e9, mxx = -1e9, mxy = -1e9; for (const [px, py] of outline) { mnx = Math.min(mnx, px); mxx = Math.max(mxx, px); mxy = Math.max(mxy, py); }
  const cx = (mnx + mxx) / 2;

  X.save();
  X.translate(x, y);
  X.scale(s * (o.flip ? -1 : 1) * (o.turn != null ? o.turn : 1), s);
  if (!o.noShadow) ellipse(0, .2, (mxx - mnx) * .45, 1.1, { fill: 'rgba(40,20,40,.22)', stroke: null });
  X.translate(0, -(o.dy || 0));
  if (o.sq) X.scale(1 + o.sq * .5, 1 - o.sq);
  X.translate(-cx, -mxy);

  withBoil(o.boil ?? .6, () => {
    // far flipper, tail flukes, dorsal fin (behind the body)
    ppFlipper(off(.6, -pr(.6, 2) * .55), angAt(.6) + 2.35 + (o.flipFar ?? 0), lw, true);
    ppFlukes(at(0), angAt(0) + (o.wag || 0), lw);
    ppDorsal(off(.52, pr(.52, 1) * .85), angAt(.52), lw);
    // body: rainbow tie-dye clipped to the fuzzy outline
    const fuzz = outline.map(([px, py], i) => { const q = outline[(i + 1) % outline.length], d = Math.hypot(q[0] - px, q[1] - py) || 1, f = (hash(i * 7.3) - .5) * .12; return [px + (q[1] - py) / d * f, py - (q[0] - px) / d * f]; });
    X.save(); tracePath(fuzz, true, .9);
    const a0 = at(0), a1 = at(1);
    X.fillStyle = linGrad(a0[0], a0[1], a1[0], a1[1], [[0, PP.mint], [.25, PP.yellow], [.45, PP.peach], [.62, PP.pink], [.8, PP.peach], [1, PP.mint]]); X.fill();
    X.clip();
    withBoil(0, () => {
      [[.2, 1, PP.mint, 3], [.38, -.5, PP.yellow, 3.4], [.55, 1.2, PP.lavender, 3.2], [.68, -1.2, PP.pink, 3.8], [.78, 2, PP.lavender, 2.4], [.86, -.6, PP.peach, 3]].forEach(([u, d, c, r]) => {
        const [bx, by] = off(u, d); circle(bx, by, r, { fill: radGrad(bx, by, 0, r, [[0, rgba(c, .9)], [1, rgba(c, 0)]]), stroke: null });
      });
      // pale-blue belly and beak
      const belly = []; for (let i = 0; i <= 24; i++) { const u = .12 + .88 * i / 24; belly.push(off(u, -pr(u, 2) * lerp(.5, .1, seg(u, .85, 1)))); }
      for (let i = 24; i >= 0; i--) { const u = .12 + .88 * i / 24; belly.push(off(u, -pr(u, 2) - .5)); }
      shape(belly, { fill: rgba(PP.sky, .92), stroke: null, smooth: true });
      const beak = []; for (let i = 0; i <= 12; i++) { const u = .88 + .14 * i / 12; beak.push(off(u, pr(u, 1) + .5)); }
      for (let i = 12; i >= 0; i--) { const u = .88 + .14 * i / 12; beak.push(off(u, -pr(u, 2) - .5)); }
      shape(beak, { fill: radGrad(...at(1), 0, 3, [[0, rgba(PP.mint, .95)], [1, rgba(PP.mint, .15)]]), stroke: null, smooth: true });
      // plush fur flecks (fixed to the body, so they don't boil)
      for (let i = 0; i < 110; i++) {
        const u = .03 + hash(i * 1.37) * .95, d = (hash(i * 2.91) * 2 - 1) * pr(u, 1) * .95, [fx, fy] = off(u, d), a = angAt(u) + (hash(i * 5.1) - .5) * .8;
        line([[fx, fy], [fx + Math.cos(a) * .45, fy + Math.sin(a) * .45]], { stroke: i % 3 ? 'rgba(255,255,255,.35)' : 'rgba(120,60,100,.12)', lw: .09 });
      }
      // soft shading: lighter along the back, deeper toward the belly edge
      shape(outline.slice(0, 41), { stroke: 'rgba(255,255,255,.35)', lw: .7, closed: false, fill: null, smooth: true });
    });
    X.restore();
    shape(fuzz, { stroke: PP.ink, lw, smooth: .9 });

    // ---- face (head frame at u = .8: +x toward the nose, -y dorsal) ----
    X.save(); const hp = at(.8); X.translate(hp[0], hp[1]); X.rotate(angAt(.8));
    ppFace(o, t, lw, A);
    X.restore();
    X.save(); const mp = at(.93); X.translate(mp[0], mp[1]); X.rotate(angAt(.93));
    ppMouth(o, lw, A);
    X.restore();
    // crown on the melon (kept roughly upright)
    let cu = .66; for (let u = .6; u <= .9; u += .01) if (off(u, pr(u, 1))[1] < off(cu, pr(cu, 1))[1]) cu = u;
    X.save(); const cp = off(cu, pr(cu, 1) - .45); X.translate(cp[0], cp[1] - (o.crownLift || 0)); X.rotate(angAt(cu) * .35 + (o.crownTilt || 0)); X.scale(.9, .9);
    ppCrown(t, lw); A.crown = toPx(0, -4.2);
    X.restore();
    // near flipper
    const fr = off(.62, -pr(.62, 2) * .45);
    A.flipper = ppFlipper(fr, lerp(angAt(.62) + 2.25 + (o.flipNear ?? 0), o.pointAng ?? -.35, o.point || 0), lw, false);
    A.belly = toPx(...at(.5)); A.nose = toPx(...at(1.03));
  });
  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .02) jfEmote(o.emote, { head: A.head }, s * .9, o.emoteK ?? 1, t);
  return A;
}

function ppFlipper(root, ang, lw, far) {
  X.save(); X.translate(root[0], root[1]); X.rotate(ang);
  const pts = [[-.2, -.9], [1.8, -1.25], [3.9, -.9], [4.8, -.1], [4.3, .7], [2.4, 1.0], [.4, .85]];
  shape(pts, { fill: linGrad(0, 0, 4.8, 0, [[0, far ? mixCol(PP.pink, PP.lavender, .5) : PP.pink], [.6, far ? PP.peach : PP.peach], [1, PP.yellow]]), stroke: PP.ink, lw, smooth: .9, alpha: far ? .92 : 1 });
  line([[.9, .1], [3.6, .05]], { stroke: 'rgba(255,255,255,.4)', lw: .25 });
  const tip = toPx(4.6, 0);
  X.restore();
  return tip;
}
function ppFlukes(root, ang, lw) {
  X.save(); X.translate(root[0], root[1]); X.rotate(ang);
  shape([[.8, -.7], [-1.4, -2.2], [-3.2, -4.0], [-3.9, -3.2], [-2.2, -.3], [-3.7, 2.2], [-3.2, 3.2], [-1.4, 1.6], [.8, .7]],
    { fill: linGrad(-3.5, -3.5, -3.3, 3, [[0, PP.pink], [.45, PP.yellow], [1, PP.mint]]), stroke: PP.ink, lw, smooth: .75 });
  X.restore();
}
function ppDorsal(root, ang, lw) {
  X.save(); X.translate(root[0], root[1]); X.rotate(ang);
  shape([[1.7, .6], [.5, -1.3], [-.7, -3.0], [-1.5, -3.3], [-1.2, -1.7], [-1.8, .6]], { fill: linGrad(0, .5, -1.2, -3.2, [[0, PP.pink], [.6, PP.lavender], [1, PP.sky]]), stroke: PP.ink, lw, smooth: .8 });
  X.restore();
}

function ppFace(o, t, lw, A) {
  const ex = 1.1, ey = -.7, r = 1.05, kind = o.eyes || 'open';
  // blush
  if (o.blush !== false) ellipse(ex - .2, ey + 1.6, .9, .45, { fill: rgba(PP.blush, .45), stroke: null });
  // brow
  const bk = o.brows || 'normal', by = ey - 1.55 - (bk === 'up' ? .35 : 0);
  const brow = { normal: [[-.7, .1], [0, -.18], [.7, .05]], up: [[-.7, .1], [0, -.25], [.7, .05]], flat: [[-.75, 0], [0, 0], [.75, 0]], angry: [[-.7, -.3], [0, -.05], [.75, .35]], worried: [[-.7, .35], [0, -.05], [.7, -.2]] }[bk];
  line(brow.map(([a, b]) => [ex + a, by + b]), { stroke: PP.ink, lw: lw * 1.5, smooth: true });
  // eye
  const lash = (pts) => pts.forEach(([a, b, c, d]) => line([[ex + a, ey + b], [ex + c, ey + d]], { stroke: PP.ink, lw: lw * 1.2 }));
  if (kind === 'closed' || kind === 'happy') {
    const dir = kind === 'happy' ? -1 : 1;
    line([[ex - .8, ey], [ex, ey + dir * .4], [ex + .8, ey]], { stroke: PP.ink, lw: lw * 1.8, smooth: true });
    if (kind === 'closed') lash([[-.75, 0, -1.05, -.35], [-.3, .3, -.5, .7]]);
  } else {
    const R = kind === 'wide' ? 1.2 : 1, lx = clamp(o.lookX || 0, -1, 1) * .2, ly = clamp(o.lookY || 0, -1, 1) * .2;
    circle(ex + lx, ey + ly, r * R, { fill: PP.bead, stroke: PP.ink, lw });
    withBoil(0, () => {
      circle(ex + lx - .35 * R, ey + ly - .35 * R, .3 * R, { fill: 'rgba(255,255,255,.95)', stroke: null });
      circle(ex + lx + .35 * R, ey + ly + .38 * R, .14 * R, { fill: 'rgba(255,255,255,.7)', stroke: null });
      if (kind === 'sparkle') shape(starPts(ex + lx + .25, ey + ly - .2, .5, .3, 4), { fill: '#FFFFFF', stroke: null });
    });
    // lids: bored (heavy, half closed), angry (slanted), blink
    const ph = (t + .7) % 4.1, auto = ph < .18 ? Math.sin(ph / .18 * Math.PI) : 0;
    const lid = Math.max(o.blink ?? auto, kind === 'bored' ? .55 : kind === 'angry' ? .4 : 0);
    if (lid > .02) {
      const slope = kind === 'angry' ? .6 : kind === 'bored' ? .1 : 0, ly0 = ey - r * R + 2 * r * R * lid;
      X.save(); X.beginPath(); X.arc(ex + lx, ey + ly, r * R + lw, 0, TAU); X.clip();
      withBoil(0, () => shape([[ex - 1.6, ey - 1.6], [ex + 1.6, ey - 1.6], [ex + 1.6, ly0 + slope], [ex - 1.6, ly0 - slope]], { fill: PP.lid, stroke: null }));
      X.restore();
      line([[ex - r * R - .1, ly0 - slope], [ex + r * R + .1, ly0 + slope]], { stroke: PP.ink, lw: lw * 1.6 });
      lash([[-.9, -slope + (ly0 - ey), -1.25, -slope + (ly0 - ey) - .25]]);
    } else lash([[-.75, -.7, -1.1, -1.05], [-.35, -.95, -.55, -1.35], [.1, -1.02, .05, -1.45]]);
  }
  A.head = toPx(ex, ey);
}

// Mouth in the beak frame (u = .93, +x toward the nose tip, +y ventral).
function ppMouth(o, lw, A) {
  const mk = o.mouth || 'smile', m0 = [1.3, 1.0], m1 = [-1.7, 1.45];
  if (mk === 'smile') line([[m0[0], m0[1]], [-.2, 1.55], [m1[0], m1[1]], [m1[0] - .35, m1[1] - .4]], { stroke: PP.ink, lw: lw * 1.3, smooth: true });
  else if (mk === 'flat') line([[m0[0], m0[1] + .1], [m1[0], m1[1] + .05]], { stroke: PP.ink, lw: lw * 1.3 });
  else if (mk === 'frown') line([[m0[0], m0[1] + .1], [-.2, 1.35], [m1[0], m1[1] + .15], [m1[0] - .35, m1[1] + .5]], { stroke: PP.ink, lw: lw * 1.3, smooth: true });
  else if (mk === 'smirk') line([[m0[0], m0[1] + .2], [-.2, 1.55], [m1[0], m1[1]], [m1[0] - .4, m1[1] - .35]], { stroke: PP.ink, lw: lw * 1.3, smooth: true });
  else {
    const h = { open: .8, o: .5, yawn: 2.0 }[mk] ?? .8, w0 = mk === 'o' ? .6 : m0[0], w1 = mk === 'o' ? -.9 : m1[0];
    const pts = [[w0, 1.0], [(w0 + w1) / 2, 1.1 + h * .1], [w1, 1.35], [w1 + .1, 1.35 + h * .6], [(w0 + w1) / 2, 1.4 + h], [w0 - .2, 1.15 + h * .4]];
    shape(pts, { fill: '#7A2440', stroke: PP.ink, lw, smooth: .8 });
    if (h > .6) ellipse((w0 + w1) / 2, 1.35 + h * .8, Math.abs(w0 - w1) * .3, h * .22, { fill: '#F07F9C', stroke: null });
  }
  A.mouth = toPx(0, 1.5);
}

function ppCrown(t, lw) {
  // filigree crown: band + five points with pearls, gems; y up is negative, base at 0
  const peaks = [[-2.4, -2.9], [-1.2, -3.35], [0, -3.9], [1.2, -3.35], [2.4, -2.9]], pts = [[-2.35, 0], [-2.6, -1.1]];
  peaks.forEach(([px, py], i) => { pts.push([px, py]); if (i < 4) pts.push([px + .6, -1.75]); });
  pts.push([2.6, -1.1], [2.35, 0]);
  shape(pts, { fill: linGrad(0, -3.9, 0, 0, [[0, PP.goldLt], [.5, PP.gold], [1, PP.goldDk]]), stroke: PP.ink, lw });
  withBoil(0, () => {
    // filigree: little lattice arcs inside the points
    for (let i = 0; i < 4; i++) { const x0 = -2.0 + i * 1.2; line([[x0, -.9], [x0 + .35, -1.75], [x0 + .7, -.9]], { stroke: PP.goldDk, lw: lw * .7, smooth: true }); circle(x0 + .35, -1.35, .18, { stroke: PP.goldDk, lw: lw * .6 }); }
    line([[-2.45, -.85], [2.45, -.85]], { stroke: PP.goldDk, lw: lw * .8 });
  });
  peaks.forEach(([px, py], i) => circle(px, py - .15, .25, { fill: '#FFF6E8', stroke: PP.ink, lw: lw * .7 }));
  [[-1.6, -.45, 0], [0, -.45, 1], [1.6, -.45, 3], [0, -2.5, 2]].forEach(([gx, gy, c]) => {
    circle(gx, gy, .38, { fill: PP.gems[c], stroke: PP.ink, lw: lw * .7 });
    circle(gx - .12, gy - .12, .1, { fill: '#FFFFFF', stroke: null });
  });
  // glint every ~2.4 s
  const g = (t + .3) % 2.4;
  if (g < .35) { const k = Math.sin(g / .35 * Math.PI); shape(starPts(1.5, -3.2, 1.1 * k, .18, 4, 0), { fill: '#FFFFFF', stroke: null }); }
}

// Registration for the studio's character browser (poses are also its model sheet).
const ppPose = o => (x, y, s, t) => pearl(x, y, s, typeof o === 'function' ? o(t) : o);
CHARACTERS.princess_pearl = {
  draw: pearl, unit: PP_UNIT, palette: PP, size: [27, 21],
  poses: {
    'lying (photo)': ppPose(t => ({ wag: .3 * wob(t, .8) })),
    'sitting': ppPose(t => ({ sit: 1, wag: .25 * wob(t, .6) })),
    'bored': ppPose(t => ({ sit: 1, eyes: 'bored', mouth: 'flat', brows: 'flat', wag: .2 * wob(t, .45) })),
    'talk': ppPose(t => ({ sit: 1, mouth: lipFlap(t, true, 'smile', ['open', 'o', 'smile']), brows: 'up' })),
    'yawn': ppPose({ sit: 1, eyes: 'closed', mouth: 'yawn', headTilt: .25, brows: 'up' }),
    'FIRED!': ppPose({ sit: 1, eyes: 'angry', brows: 'angry', mouth: 'open', point: 1, pointAng: -.2, headTilt: .1 }),
    'nose up': ppPose({ sit: 1, eyes: 'closed', mouth: 'smirk', headTilt: .45, brows: 'up' }),
    'eye roll': ppPose({ sit: 1, eyes: 'bored', lookY: -1, lookX: .5, mouth: 'frown', brows: 'up' }),
    'happy': ppPose({ sit: .6, eyes: 'happy', mouth: 'smile', flipNear: -1.2, emote: 'heart', emoteK: 1 }),
    'surprised': ppPose({ sit: .8, eyes: 'wide', mouth: 'o', brows: 'up', crownLift: .6, emote: '!', emoteK: 1 }),
    'turn around': ppPose(t => ({ sit: 1, flip: true, turn: Math.cos(t * 2), eyes: 'sparkle', mouth: 'smile' })),
  },
};
