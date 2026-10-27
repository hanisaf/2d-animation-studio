// characters/neptune/neptune.js: Neptune, a plush blue dolphin with a rainbow-striped belly who calls himself
// "King Neptune" (he is not a king) and has ultra-awesome water powers (see reference.webp and README.md).
//
// neptune(x, y, s, o) → anchors
//   (x, y) = the surface point under his middle (floor, cushion, rock), screen px · s = px per unit.
//   He is ~23 units nose to tail when flat; ~19 units tall sitting up on his tail. In a set use s = NT_UNIT * P.k(Z).
//
// Built like Pearl along a bendable SPINE (tail base → nose), with a sleeker body and a long beak.
// Pose     sit (0 flat … 1 upright on his tail, tail-walk style) · arch (leap hump: + = back up, nose and tail down)
//          headTilt (rad, + = nose up) · wag (fluke flick, rad) · swim (0..1 travelling body wave) · rot (whole body)
//          flip (true = faces LEFT, like the photo) · turn (-1..1 squash for a turn-around) · sq (squash) · dy (hop, units up)
// Flippers flipNear / flipFar: angle offsets (rad) · point (0..1) swings the near flipper out to point at world angle
//          pointAng (default -.35) · flex (0..1) curls the near flipper up into a "muscle" pose
// Face     eyes: open | happy | closed | wide | sparkle | wink | smug | glow · lookX / lookY (-1..1) · blink (auto if unset)
//          brows: normal | up | smug | angry | worried · mouth: smile | grin | laugh | open | o | flat | smirk | frown
// Royal    crown (default true: his homemade, slightly-too-big gold crown with a starfish) · crownTilt · crownLift
//          trident (true: his toy trident in the near flipper) · tridentAng (world angle of the shaft, default -1.3)
// Powers   power (0..1): the ultra-awesome aura: rainbow-water glow, an orbiting ring of water, rising bubbles,
//          glowing eyes and a crackling trident. Pair it with neptuneBlast() for a rainbow water beam.
// Extras   emote: '?' | '!' | 'sweat' | 'heart' | 'music' with emoteK
//
// Returns anchors in screen px: { head (eye), mouth, nose, crown, flipper (near flipper tip), belly, tridentTip }

const NT = {
  ink: '#1E3657', blue: '#2EB2EE', blueLt: '#7BD6FA', blueDk: '#1786C9', bead: '#11141C', lid: '#5CC4F2', blush: '#F48DB0',
  stripes: ['#C9B2EE', '#F4A8C8', '#FBC6A0', '#FBE79B', '#B4EBC8', '#A8DDF2'],
  gold: '#F2C440', goldDk: '#B98A22', goldLt: '#FFE9A0', star: '#FF8A5C', starDk: '#D9603A', tongue: '#F07F9C', mouthIn: '#7A2440',
  water: '#7FE3FF', glow: '#BDF4FF',
};
const NT_UNIT = 10;          // world units per unit (sitting up he is ~190 world units tall: a touch taller than Pearl)

function neptune(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, L = 21, N = 32, pw = clamp(o.power || 0);
  const lw = clamp(s * .13, 1.5, 5) / s;
  // ---- spine ----
  const sit = o.sit ?? 0, tilt = o.headTilt || 0, arch = o.arch || 0, swim = o.swim || 0;
  const theta = u => (o.rot || 0) + sit * (-1.5 * ease(seg(u, .05, .55)) + 1.3 * ease(seg(u, .6, 1))) - tilt * ease(seg(u, .6, 1))
    + arch * (2 * u - 1) + (o.wag || 0) * (1 - u) ** 3 * .6 + swim * .32 * Math.sin(u * 5.5 - t * 8) * (1 - u * .75)
    + (o.breathe ?? .025 * wob(t, .4)) * Math.sin(u * Math.PI);
  const sp = [[0, 0]];
  for (let i = 1; i <= N; i++) { const a = theta((i - .5) / N); sp.push([sp[i - 1][0] + Math.cos(a) * L / N, sp[i - 1][1] + Math.sin(a) * L / N]); }
  const at = u => { const f = clamp(u) * N, i = Math.min(N - 1, Math.floor(f)), k = f - i; return [lerp(sp[i][0], sp[i + 1][0], k), lerp(sp[i][1], sp[i + 1][1], k)]; };
  const angAt = u => theta(clamp(u));
  const nrm = u => { const a = angAt(u); return [Math.sin(a), -Math.cos(a)]; };            // dorsal side
  const off = (u, d) => { const p = at(u), n = nrm(u); return [p[0] + n[0] * d, p[1] + n[1] * d]; };
  // thickness profile (dorsal, ventral half-widths): thin tail stock, deep chest, round melon, then a long beak
  const prof = [[0, .7, .6], [.15, 1.5, 1.3], [.3, 2.6, 2.4], [.45, 3.5, 3.2], [.6, 4.1, 3.7], [.7, 4.3, 3.8], [.78, 4.1, 3.6], [.84, 3.4, 3.0], [.885, 2.1, 2.3], [.94, 1.25, 1.55], [1, .8, .95]];
  const pr = (u, j) => { for (let i = 1; i < prof.length; i++) if (u <= prof[i][0]) { const a = prof[i - 1], b = prof[i], k = ease((u - a[0]) / (b[0] - a[0])); return lerp(a[j], b[j], k); } return prof[prof.length - 1][j]; };
  const outline = [];
  for (let i = 0; i <= 48; i++) { const u = i / 48; outline.push(off(u, pr(u, 1))); }
  { const p = at(1), a = angAt(1); for (let i = 1; i < 6; i++) { const b = a - Math.PI / 2 + i / 6 * Math.PI; const r = lerp(pr(1, 1), pr(1, 2), i / 6); outline.push([p[0] + Math.cos(b) * r, p[1] + Math.sin(b) * r]); } }
  for (let i = 48; i >= 0; i--) { const u = i / 48; outline.push(off(u, -pr(u, 2))); }
  // placement: bottom of the body on y = 0, centred in x
  let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
  for (const [px, py] of outline) { mnx = Math.min(mnx, px); mxx = Math.max(mxx, px); mny = Math.min(mny, py); mxy = Math.max(mxy, py); }
  // the flukes count too: sitting up, he rests on the lower lobe
  { const [rx, ry] = at(0), a = angAt(0) + (o.wag || 0);
    for (const [fx, fy] of [[-3.9, -3.4], [-3.9, 2.3], [-3.3, 3.3]]) { const px = rx + fx * Math.cos(a) - fy * Math.sin(a), py = ry + fx * Math.sin(a) + fy * Math.cos(a); mnx = Math.min(mnx, px); mxx = Math.max(mxx, px); mxy = Math.max(mxy, py); } }
  const cx = (mnx + mxx) / 2, mid = [cx, (mny + mxy) / 2];

  X.save();
  X.translate(x, y);
  X.scale(s * (o.flip ? -1 : 1) * (o.turn != null ? o.turn : 1), s);
  if (!o.noShadow) ellipse(0, .2, (mxx - mnx) * .42, 1.1, { fill: 'rgba(20,30,60,.22)', stroke: null });
  X.translate(0, -(o.dy || 0));
  if (o.sq) X.scale(1 + o.sq * .5, 1 - o.sq);
  X.translate(-cx, -mxy);

  if (pw > .01) ntAura(mid, pw, t, false);
  withBoil(o.boil ?? .6, () => {
    // far flipper, tail flukes, dorsal fin (behind the body)
    ntFlipper(off(.62, -pr(.62, 2) * .5), angAt(.62) + 2.3 + (o.flipFar ?? 0), lw, true);
    ntFlukes(at(0), angAt(0) + (o.wag || 0), lw);
    ntDorsal(off(.5, pr(.5, 1) * .85), angAt(.5), lw);
    // body: blue velvet, clipped to a fuzzy plush outline
    const fuzz = outline.map(([px, py], i) => { const q = outline[(i + 1) % outline.length], d = Math.hypot(q[0] - px, q[1] - py) || 1, f = (hash(i * 7.3 + 2) - .5) * .12; return [px + (q[1] - py) / d * f, py - (q[0] - px) / d * f]; });
    X.save(); tracePath(fuzz, true, .9);
    X.fillStyle = linGrad(0, mny, 0, mxy, [[0, NT.blueLt], [.35, NT.blue], [1, NT.blueDk]]); X.fill();
    X.clip();
    withBoil(0, () => {
      // velvet sheen on the melon and along the back
      const mp = off(.74, pr(.74, 1) * .45);
      circle(mp[0], mp[1], 3.6, { fill: radGrad(mp[0], mp[1], 0, 3.6, [[0, 'rgba(255,255,255,.4)'], [1, 'rgba(255,255,255,0)']]), stroke: null });
      shape(outline.slice(0, 49), { stroke: 'rgba(255,255,255,.3)', lw: .8, closed: false, fill: null, smooth: true });
      // the rainbow-striped satin belly, chin to tail stock
      const belly = [];
      for (let i = 0; i <= 30; i++) { const u = .1 + .9 * i / 30, k = lerp(1, .55, ease(seg(u, .1, .32))) * lerp(1, .12, ease(seg(u, .84, .93))); belly.push(off(u, -pr(u, 2) * k)); }
      for (let i = 30; i >= 0; i--) { const u = .1 + .9 * i / 30; belly.push(off(u, -pr(u, 2) - .6)); }
      X.save(); tracePath(belly, true, true); X.clip();
      for (let i = 0; i < 16; i++) {
        const u0 = .06 + i * .062, u1 = u0 + .062;
        shape([off(u0, .5), off(u1, .5), off(u1 - .05, -5), off(u0 - .05, -5)], { fill: NT.stripes[i % NT.stripes.length], stroke: null });
      }
      // satin shine and a few glints
      const sheen = []; for (let i = 0; i <= 20; i++) { const u = .25 + .6 * i / 20; sheen.push(off(u, -pr(u, 2) * .72)); }
      line(sheen, { stroke: 'rgba(255,255,255,.45)', lw: .45, smooth: true });
      [.42, .61, .77].forEach((u, i) => { const g = (t * .8 + i * .37) % 1.6; if (g < .3) { const [gx, gy] = off(u, -pr(u, 2) * .7), k = Math.sin(g / .3 * Math.PI); shape(starPts(gx, gy, .6 * k, .12, 4), { fill: '#FFFFFF', stroke: null }); } });
      X.restore();
      shape(belly.slice(0, 31), { stroke: rgba(NT.ink, .35), lw: lw * .7, closed: false, fill: null, smooth: true });
      // plush fur flecks (fixed to the body, so they don't boil)
      for (let i = 0; i < 130; i++) {
        const u = .03 + hash(i * 1.37) * .95, d = (hash(i * 2.91) * 2 - .6) * pr(u, 1) * .8, [fx, fy] = off(u, d), a = angAt(u) + (hash(i * 5.1) - .5) * .8;
        line([[fx, fy], [fx + Math.cos(a) * .45, fy + Math.sin(a) * .45]], { stroke: i % 3 ? 'rgba(255,255,255,.3)' : 'rgba(10,60,120,.16)', lw: .09 });
      }
    });
    X.restore();
    shape(fuzz, { stroke: NT.ink, lw, smooth: .9 });
    // forehead crease where the melon meets the beak
    line([off(.875, pr(.875, 1) - .1), off(.88, pr(.88, 1) * .35), off(.885, -.2)], { stroke: rgba(NT.ink, .45), lw: lw * .8, smooth: true });

    // ---- face (head frame at u = .84: +x toward the nose, -y dorsal) ----
    X.save(); const hp = at(.84); X.translate(hp[0], hp[1]); X.rotate(angAt(.84));
    ntFace(o, t, lw, A, pw);
    X.restore();
    X.save(); const bp = at(.93); X.translate(bp[0], bp[1]); X.rotate(angAt(.93));
    ntMouth(o, lw, A);
    X.restore();
    // the crown on the melon (wobbles: it's a bit too big for him)
    if (o.crown !== false) {
      let cu = .78; for (let u = .72; u <= .86; u += .01) if (off(u, pr(u, 1))[1] < off(cu, pr(cu, 1))[1]) cu = u;
      X.save(); const cp = off(cu, pr(cu, 1) - .5); X.translate(cp[0], cp[1] - (o.crownLift || 0));
      X.rotate(angAt(cu) * .35 - .16 + .05 * wob(t, .9) + (o.crownTilt || 0)); X.scale(.95, .95);
      ntCrown(t, lw); A.crown = toPx(0, -4.2);
      X.restore();
    }
    // the trident, gripped by the near flipper (drawn first so the flipper wraps over the shaft)
    const fr = off(.64, -pr(.64, 2) * .4);
    const fa = lerp(angAt(.64) + 2.2 + (o.flipNear ?? 0) - (o.flex || 0) * 1.5, o.pointAng ?? -.35, o.point || 0);
    const tip = [fr[0] + Math.cos(fa) * 3.9, fr[1] + Math.sin(fa) * 3.9];
    if (o.trident) { X.save(); X.translate(tip[0], tip[1]); X.rotate((o.tridentAng ?? -1.3) + Math.PI / 2); ntTrident(t, lw, pw, A); X.restore(); }
    A.flipper = ntFlipper(fr, fa, lw, false);
    A.belly = toPx(...off(.5, -pr(.5, 2) * .6)); A.nose = toPx(...at(1.04));
  });
  if (pw > .01) ntAura(mid, pw, t, true);
  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .02) jfEmote(o.emote, { head: A.head }, s * .9, o.emoteK ?? 1, t);
  return A;
}

function ntFlipper(root, ang, lw, far) {
  X.save(); X.translate(root[0], root[1]); X.rotate(ang);
  const pts = [[-.3, -1.0], [1.8, -1.3], [3.8, -.95], [4.9, -.15], [4.4, .7], [2.4, 1.05], [.3, .9]];
  shape(pts, { fill: linGrad(0, -1.2, 0, 1, [[0, far ? NT.blue : NT.blueLt], [1, NT.blueDk]]), stroke: NT.ink, lw, smooth: .9, alpha: far ? .95 : 1 });
  line([[.9, -.15], [3.7, -.2]], { stroke: 'rgba(255,255,255,.4)', lw: .25 });
  const tip = toPx(4.6, 0);
  X.restore();
  return tip;
}
function ntFlukes(root, ang, lw) {
  X.save(); X.translate(root[0], root[1]); X.rotate(ang);
  shape([[.8, -.6], [-1.3, -2.0], [-3.1, -3.9], [-4.0, -3.4], [-2.4, -.3], [-3.9, 2.3], [-3.3, 3.3], [-1.3, 1.5], [.8, .6]],
    { fill: linGrad(-3, -3.5, -3, 3, [[0, NT.blueLt], [.5, NT.blue], [1, NT.blueDk]]), stroke: NT.ink, lw, smooth: .75 });
  X.restore();
}
function ntDorsal(root, ang, lw) {
  X.save(); X.translate(root[0], root[1]); X.rotate(ang);
  shape([[2.0, .7], [.7, -1.4], [-.6, -3.3], [-1.7, -3.7], [-1.3, -1.9], [-2.0, .7]], { fill: linGrad(0, .5, -1.2, -3.5, [[0, NT.blue], [1, NT.blueLt]]), stroke: NT.ink, lw, smooth: .8 });
  X.restore();
}

function ntFace(o, t, lw, A, pw) {
  const ex = .55, ey = -1.1, r = .9, kind = o.eyes || (pw > .6 ? 'glow' : 'open');
  if (o.blush) ellipse(ex - .5, ey + 1.35, .75, .38, { fill: rgba(NT.blush, .5), stroke: null });
  // brow
  const bk = o.brows || 'normal', by = ey - 1.3 - (bk === 'up' ? .3 : 0);
  const brow = { normal: [[-.65, .1], [0, -.15], [.65, .05]], up: [[-.65, .1], [0, -.25], [.65, .05]], smug: [[-.7, .15], [0, -.3], [.7, -.2]],
    angry: [[-.65, -.3], [0, -.05], [.7, .32]], worried: [[-.65, .32], [0, -.05], [.65, -.2]] }[bk] || [[-.65, .1], [0, -.15], [.65, .05]];
  line(brow.map(([a, b]) => [ex + a, by + b]), { stroke: NT.ink, lw: lw * 1.6, smooth: true });
  if (kind === 'closed' || kind === 'happy' || kind === 'wink') {
    const dir = kind === 'closed' ? 1 : -1;
    line([[ex - .7, ey], [ex, ey + dir * .4], [ex + .7, ey]], { stroke: NT.ink, lw: lw * 1.8, smooth: true });
    if (kind === 'wink') line([[ex + .75, ey - .1], [ex + 1.15, ey - .35]], { stroke: NT.ink, lw: lw * 1.2 });
  } else {
    const R = kind === 'wide' ? 1.25 : 1, lx = clamp(o.lookX || 0, -1, 1) * .18, ly = clamp(o.lookY || 0, -1, 1) * .18;
    if (kind === 'glow') {
      X.save(); X.globalCompositeOperation = 'lighter';
      circle(ex, ey, 2.4, { fill: radGrad(ex, ey, 0, 2.4, [[0, rgba(NT.glow, .8)], [1, rgba(NT.water, 0)]]), stroke: null });
      X.restore();
      circle(ex + lx, ey + ly, r, { fill: '#FFFFFF', stroke: NT.ink, lw });
      circle(ex + lx, ey + ly, r * .55, { fill: NT.water, stroke: null });
    } else {
      circle(ex + lx, ey + ly, r * R, { fill: NT.bead, stroke: NT.ink, lw });
      withBoil(0, () => {
        circle(ex + lx - .28 * R, ey + ly - .28 * R, .26 * R, { fill: 'rgba(255,255,255,.95)', stroke: null });
        circle(ex + lx + .3 * R, ey + ly + .3 * R, .12 * R, { fill: 'rgba(255,255,255,.7)', stroke: null });
        if (kind === 'sparkle') shape(starPts(ex + lx + .2, ey + ly - .15, .45, .28, 4), { fill: '#FFFFFF', stroke: null });
      });
    }
    // lids: smug (half closed, self-satisfied), blink
    const ph = (t + 1.3) % 3.7, auto = ph < .17 ? Math.sin(ph / .17 * Math.PI) : 0;
    const lid = Math.max(o.blink ?? auto, kind === 'smug' ? .5 : 0);
    if (lid > .02) {
      const ly0 = ey - r * R + 2 * r * R * lid;
      X.save(); X.beginPath(); X.arc(ex + lx, ey + ly, r * R + lw, 0, TAU); X.clip();
      withBoil(0, () => shape([[ex - 1.5, ey - 1.5], [ex + 1.5, ey - 1.5], [ex + 1.5, ly0], [ex - 1.5, ly0]], { fill: NT.lid, stroke: null }));
      X.restore();
      line([[ex - r * R - .1, ly0], [ex + r * R + .1, ly0]], { stroke: NT.ink, lw: lw * 1.6 });
    }
  }
  A.head = toPx(ex, ey);
}

// Mouth in the beak frame (u = .93, +x toward the nose tip, +y ventral): a long dolphin smile that curls up under the eye.
function ntMouth(o, lw, A) {
  const mk = o.mouth || 'smile', m0 = [1.25, .25], m1 = [-1.75, .45], corner = [-2.15, .0];
  const ink = { stroke: NT.ink, lw: lw * 1.3, smooth: true };
  if (mk === 'smile') line([m0, [-.2, .55], m1, corner], ink);
  else if (mk === 'flat') line([[m0[0], m0[1] + .1], [m1[0], m1[1] + .05]], ink);
  else if (mk === 'frown') line([m0, [-.2, .45], m1, [m1[0] - .4, m1[1] + .45]], ink);
  else if (mk === 'smirk') line([[m0[0], m0[1] + .15], [-.2, .5], m1, [corner[0] - .2, corner[1] - .25]], ink);
  else {
    // open mouths: the lower jaw drops and shows the tongue (no teeth: he's a plush, and kind)
    const h = { open: .9, o: .55, grin: 1.15, laugh: 1.7 }[mk] ?? .9, w0 = mk === 'o' ? .55 : m0[0], w1 = mk === 'o' ? -.95 : m1[0];
    const pts = [[w0, .25], [(w0 + w1) / 2, .45], [w1, .5], [w1 - (mk === 'o' ? 0 : .35), .15], [w1 + .1, .6 + h * .65], [(w0 + w1) / 2, .7 + h], [w0 - .15, .45 + h * .45]];
    shape(pts, { fill: NT.mouthIn, stroke: NT.ink, lw, smooth: .8 });
    if (h > .8) ellipse((w0 + w1) / 2 - .1, .55 + h * .78, Math.abs(w0 - w1) * .3, h * .22, { fill: NT.tongue, stroke: null });
  }
  A.mouth = toPx(-.3, .7);
}

// His crown: homemade, gold, three points, a starfish stuck on the front; base at 0, up is negative.
function ntCrown(t, lw) {
  const pts = [[-2.7, 0], [-3.0, -3.0], [-1.6, -1.6], [0, -4.0], [1.6, -1.6], [3.0, -3.0], [2.7, 0]];
  shape(pts, { fill: linGrad(0, -4, 0, 0, [[0, NT.goldLt], [.5, NT.gold], [1, NT.goldDk]]), stroke: NT.ink, lw });
  withBoil(0, () => {
    line([[-2.75, -.8], [2.75, -.8]], { stroke: NT.goldDk, lw: lw * .8 });
    [[-3.0, -3.0], [0, -4.0], [3.0, -3.0]].forEach(([px, py]) => circle(px, py - .2, .3, { fill: '#FFF6E8', stroke: NT.ink, lw: lw * .7 }));
  });
  // the starfish badge
  X.save(); X.translate(0, -1.55); X.rotate(.15 + .06 * wob(t, .7));
  shape(starPts(0, 0, 1.05, .48, 5, -Math.PI / 2), { fill: NT.star, stroke: NT.ink, lw: lw * .8, smooth: .35 });
  withBoil(0, () => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i / 5 * TAU; circle(Math.cos(a) * .5, Math.sin(a) * .5, .09, { fill: NT.starDk, stroke: null }); } });
  X.restore();
  const g = (t + 1.1) % 2.7;
  if (g < .35) { const k = Math.sin(g / .35 * Math.PI); shape(starPts(2.2, -2.6, 1.1 * k, .18, 4, 0), { fill: '#FFFFFF', stroke: null }); }
}

// The trident, in a frame whose -y runs up the shaft from the grip (0, 0). With power it glows and crackles.
function ntTrident(t, lw, pw, A) {
  const top = -11.5;
  if (pw > .01) {
    X.save(); X.globalCompositeOperation = 'lighter';
    circle(0, top - 1.5, 4.2, { fill: radGrad(0, top - 1.5, 0, 4.2, [[0, rgba(NT.glow, .7 * pw)], [1, rgba(NT.water, 0)]]), stroke: null });
    X.restore();
  }
  shape(rectPts(-.32, top, .64, -top + 4.5), { fill: linGrad(-.3, 0, .3, 0, [[0, NT.goldLt], [1, NT.goldDk]]), stroke: NT.ink, lw });
  // crossbar and three barbed prongs
  shape([[-2.6, top - .9], [-2.4, top + .5], [2.4, top + .5], [2.6, top - .9], [1.6, top - .2], [-1.6, top - .2]], { fill: NT.gold, stroke: NT.ink, lw, smooth: .4 });
  [-2.25, 0, 2.25].forEach(px => {
    const h = px === 0 ? 4.4 : 3.5, b = top - .6;
    shape([[px - .3, b], [px - .3, b - h + .9], [px - .75, b - h + 1.3], [px, b - h - .1], [px + .75, b - h + 1.3], [px + .3, b - h + .9], [px + .3, b]], { fill: linGrad(px - .3, 0, px + .3, 0, [[0, NT.goldLt], [1, NT.gold]]), stroke: NT.ink, lw: lw * .9 });
  });
  circle(0, top + 1.2, .55, { fill: '#8EE6FF', stroke: NT.ink, lw: lw * .8 });
  circle(-.17, top + 1.05, .16, { fill: '#FFFFFF', stroke: null });
  if (pw > .3) {
    // rainbow crackle between the prong tips (deterministic flicker: re-seeded 12× a second)
    const f = Math.floor(t * 12), tips = [[-2.25, top - 4.1], [0, top - 5.1], [2.25, top - 4.1]];
    X.save(); X.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 3; j++) {
      const a = tips[j], b = j < 2 ? tips[j + 1] : [hash(f * 3.3) * 6 - 3, top - 6.5 - hash(f * 1.7) * 1.5], pts = [a];
      for (let i = 1; i < 5; i++) pts.push([lerp(a[0], b[0], i / 5) + (hash(f * 7 + j * 13 + i) - .5) * 1.2, lerp(a[1], b[1], i / 5) + (hash(f * 5 + j * 11 + i) - .5) * 1.2]);
      pts.push(b);
      line(pts, { stroke: rgba(NT.stripes[(f + j) % 6], .9 * pw), lw: .32 });
      line(pts, { stroke: rgba('#FFFFFF', .8 * pw), lw: .12 });
    }
    X.restore();
  }
  A.tridentTip = toPx(0, top - 5.1);
}

// The ultra-awesome aura around his body centre c (local units): back half (glow + far side of the water ring) or front half.
function ntAura(c, k, t, front) {
  const [cx, cy] = c;
  if (!front) {
    X.save(); X.globalCompositeOperation = 'lighter';
    circle(cx, cy, 16, { fill: radGrad(cx, cy, 3, 16, [[0, rgba(NT.glow, .3 * k)], [.55, rgba(NT.water, .16 * k)], [1, rgba(NT.water, 0)]]), stroke: null });
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * TAU + t * .4;
      shape([[cx, cy], [cx + Math.cos(a - .12) * 15, cy + Math.sin(a - .12) * 15], [cx + Math.cos(a + .12) * 15, cy + Math.sin(a + .12) * 15]], { fill: rgba(NT.stripes[i], .07 * k), stroke: null });
    }
    X.restore();
  }
  // water ring: droplets orbiting on a tilted ellipse; the far half is drawn behind him, the near half in front
  for (let i = 0; i < 22; i++) {
    const a = t * 1.6 + i / 22 * TAU, depth = Math.sin(a);
    if ((depth > 0) !== front) continue;
    const px = cx + Math.cos(a) * 13.5 * k, py = cy + 1 + depth * 2.6 - Math.cos(a) * 1.5, r = (.35 + .25 * (depth + 1)) * k;
    circle(px, py, r, { fill: rgba(NT.water, front ? .85 : .5), stroke: rgba(NT.ink, front ? .5 : .25), lw: .1 });
    circle(px - r * .3, py - r * .3, r * .3, { fill: 'rgba(255,255,255,.85)', stroke: null });
  }
  if (front) {
    // bubbles rising around him
    for (let i = 0; i < 10; i++) {
      const ph = (t * .45 + hash(i * 3.1)) % 1, bx = cx + (hash(i * 1.9) - .5) * 22 + Math.sin(t * 2 + i) * .6, by = cy + 6 - ph * 18, r = (.3 + hash(i * 4.7) * .5) * k;
      X.save(); X.globalAlpha = k * Math.sin(ph * Math.PI);
      circle(bx, by, r, { fill: 'rgba(190,240,255,.25)', stroke: rgba('#FFFFFF', .8), lw: .1 });
      circle(bx - r * .35, by - r * .35, r * .25, { fill: '#FFFFFF', stroke: null });
      X.restore();
    }
  }
}

// neptuneBlast(x0, y0, x1, y1, k, t, w): his rainbow water beam from (x0, y0) (e.g. A.tridentTip) to (x1, y1), screen px.
// k 0..1 shoots it out (0–.35), holds, then fades (.85–1). w = beam width in px. Ends in a splash ring.
function neptuneBlast(x0, y0, x1, y1, k, t, w = 40) {
  if (k <= 0 || k >= 1) return;
  const reach = ease(seg(k, 0, .35)), fade = 1 - seg(k, .85, 1), ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0) * reach;
  X.save(); X.translate(x0, y0); X.rotate(ang); X.globalAlpha = fade;
  X.save(); X.globalCompositeOperation = 'lighter';
  shape([[0, -w * .3], [len, -w * .75], [len, w * .75], [0, w * .3]], { fill: rgba(NT.glow, .35), stroke: null });
  X.restore();
  NT.stripes.forEach((c, i) => {
    const pts = []; for (let j = 0; j <= 24; j++) { const u = j / 24, spread = lerp(.3, 1, u); pts.push([u * len, ((i + .5) / NT.stripes.length - .5) * w * spread + Math.sin(u * 14 - t * 18 + i) * w * .05]); }
    line(pts, { stroke: c, lwPx: w / NT.stripes.length * 1.1, smooth: true });
  });
  line([[0, 0], [len, 0]], { stroke: 'rgba(255,255,255,.75)', lwPx: w * .12 });
  for (let i = 0; i < 12; i++) { const u = (hash(i * 2.3) + t * 1.5) % 1; if (u * len < len) circle(u * len, (hash(i * 5.7) - .5) * w * 1.3, w * (.05 + hash(i) * .06), { fill: 'rgba(220,250,255,.6)', stroke: 'rgba(255,255,255,.9)', lwPx: 1.5 }); }
  X.restore();
  if (reach >= 1) {
    const sk = seg(k, .35, .85), r = w * (.8 + 1.2 * sk);
    X.save(); X.globalAlpha = fade * (1 - sk * .6);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 2, d = r * (1 + .25 * Math.sin(t * 9 + i)); circle(x1 + Math.cos(a) * d, y1 + Math.sin(a) * d * .6, w * .14, { fill: NT.stripes[i % 6], stroke: NT.ink, lwPx: 2 }); }
    X.restore();
  }
}

// Registration for the studio's character browser (poses are also its model sheet).
const ntPose = o => (x, y, s, t) => neptune(x, y, s, typeof o === 'function' ? o(t) : o);
CHARACTERS.neptune = {
  draw: neptune, unit: NT_UNIT, palette: NT, size: [28, 24],
  poses: {
    'leap (photo)': ntPose(t => ({ flip: true, arch: .4, rot: .32, wag: .3 * wob(t, .8) })),
    'sitting': ntPose(t => ({ sit: 1, wag: .25 * wob(t, .6) })),
    'swimming': ntPose(t => ({ swim: 1, flipNear: .3 * wob(t, 1.3), dy: .6 * wob(t, .65) })),
    'King Neptune!': ntPose(t => ({ sit: 1, trident: true, eyes: 'smug', brows: 'smug', mouth: 'smirk', headTilt: .3, crownTilt: .1 * wob(t, .5) })),
    'talk': ntPose(t => ({ sit: 1, mouth: lipFlap(t, true, 'smile', ['open', 'grin', 'smile']), brows: 'up', flipNear: -.6 * wob(t, .9) })),
    'laugh': ntPose(t => ({ sit: 1, eyes: 'happy', mouth: 'laugh', headTilt: .35 + .08 * wob(t, 4), dy: .3 * Math.abs(wob(t, 2)), flipNear: -1 })),
    'wink': ntPose({ sit: 1, eyes: 'wink', mouth: 'grin', point: 1, pointAng: -.25, brows: 'up' }),
    'flex': ntPose(t => ({ sit: 1, flex: 1, eyes: 'smug', brows: 'smug', mouth: 'grin', headTilt: .1, dy: .15 * wob(t, 1.5) })),
    'kind': ntPose({ sit: .8, eyes: 'happy', mouth: 'smile', blush: true, flipNear: -1.1, emote: 'heart', emoteK: 1 }),
    'oops (not a king)': ntPose(t => ({ sit: 1, eyes: 'wide', brows: 'worried', mouth: 'o', crownTilt: -.5, crownLift: .4, emote: 'sweat', emoteK: 1 })),
    'ULTRA POWER': ntPose(t => ({ sit: 1, trident: true, power: 1, mouth: 'grin', brows: 'angry', headTilt: .15, tridentAng: -1.5 })),
    'turn around': ntPose(t => ({ sit: 1, flip: true, turn: Math.cos(t * 2), eyes: 'sparkle', mouth: 'smile' })),
  },
};
