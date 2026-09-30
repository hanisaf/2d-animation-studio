// Scene 11: "The Great Hydration Debate". The county soccer field, by the home bench. Housam and Alma win their game and
// race to the cooler; Professor Safadi slams the lid ("energy drinks?") and sits on it. The kids argue eight reasons,
// win, and toast with the bottles... which Safadi has filled with unsweetened tea.
// Blocking (world units): the cooler at COOL, the kids to its left, Safadi standing to its right, then sitting on it.
// Every camera looks up the pitch (dir 1) except the dream goal (reverse, behind the north goal). Rigs face the camera,
// so "looking at" someone is lookX / turn toward their side of the frame. Every shot is a pure function of t.
(() => {
  const F = LOCATIONS.soccer_field, LINES = ASSETS.scene.scene11_hydration_debate.dialogue;
  const HU = HOUSAM_UNIT, AU = ALMA_UNIT, SU = SAFADI_UNIT;
  const COOL = { x: 2620, z: 3120, w: 90, h: 30, d: 46, lid: 7 };           // body 30 high + a 7-unit lid = a 37-unit seat
  const SEAT_Z = 3090;                                                       // floor point of anyone sitting on the cooler
  const O_BASE = { crowd: .5, score: [3, 2], home: 'HOME', guest: 'AWAY', clock: '90:00' };
  const ACCENT = { safadi: PAL.crimson, housam: '#3766BD', alma: '#994EC4' };
  const TOSS = [156.9, 157.5], CLINK = 162.2, GULP = [162.5, 163.4], CRUMPLE = 164.2;
  const SPLASH = 109.7, YANK = 134.9, CROSS = 144.6, SLAM1 = 11.85, SLAM2 = 21.4;

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const mix = (a, b, k) => mixPt(a, b, clamp(k));
  const nod = (t, t0, n = 2, per = .45) => { const u = (t - t0) / per; return u > 0 && u < n ? Math.sin(Math.PI * (u % 1)) : 0; };
  // who spoke last (for eyelines): 'housam' | 'alma' | 'safadi'
  function lastSpeaker(t, not) {
    let who = 'safadi';
    for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker;
    return who;
  }

  // ---------- where everyone stands ----------
  // → { x, z, p (steps travelled, for walk cycles), moving (0..1) }
  function track(t, keys) {                                                  // keys: [t0, t1, x0, z0, x1, z1]
    let x = keys[0][2], z = keys[0][3], p = 0, moving = 0;
    for (const [t0, t1, x0, z0, x1, z1] of keys) {
      if (t < t0) break;
      const u = ease(seg(t, t0, t1)), dist = Math.hypot(x1 - x0, z1 - z0);
      x = lerp(x0, x1, u); z = lerp(z0, z1, u); p += dist * u; if (t < t1) moving = Math.sin(Math.PI * seg(t, t0, t1)) > .05 ? 1 : 0;
    }
    return { x, z, p, moving };
  }
  const HOU_T = [[15.2, 18.0, 2330, 4420, 2520, 3140], [38.8, 40.2, 2520, 3140, 2390, 3140], [128.0, 128.5, 2390, 3140, 2390, 2990],
    [YANK, YANK + .25, 2390, 2990, 2390, 3140], [155.0, 155.7, 2390, 3140, 2520, 3140], [157.7, 158.3, 2520, 3140, 2388, 3140]];
  const ALM_T = [[15.2, 18.0, 2130, 4420, 2330, 3140], [38.8, 40.2, 2330, 3140, 2170, 3140], [133.9, 134.6, 2170, 3140, 2310, 3140],
    [135.4, 136.2, 2310, 3140, 2170, 3140], [157.7, 158.3, 2170, 3140, 2325, 3140]];
  const SAF_T = [[12.8, 14.2, 2640, 3175, 3250, 3175], [14.25, 14.3, 3250, 3175, 4200, 3175], [19.9, 21.2, 3300, 3175, 2725, 3170], [42.0, 42.5, 2725, 3170, COOL.x, SEAT_Z],
    [153.7, 155.0, COOL.x, SEAT_Z, 2870, 3160]];
  const housamAt = t => track(t, HOU_T), almaAt = t => track(t, ALM_T);
  const safadiAt = t => t < 11 ? { x: 2640, z: 3175, p: 0, moving: 0 } : track(t, SAF_T);
  const seatK = t => ease(seg(t, 42.15, 42.6)) * (1 - ease(seg(t, 153.2, 153.65)));
  function lidAt(t) {                                                        // radians open
    if (t < 15) return 1.95 * (1 - easeIn(seg(t, 11.4, SLAM1)));
    if (t < 150) return 1.95 * backOut(seg(t, 18.3, 18.6)) * (1 - easeIn(seg(t, 21.15, SLAM2)));
    if (t < 192) return 1.95 * backOut(seg(t, 155.8, 156.1));
    return 0;
  }
  const bottlesLeft = t => t >= 156.4 && t < 192 ? 4 : 6;

  // ---------- props ----------
  const CO = { body: '#2F7FD0', side: '#2362A8', lid: '#F4F6F8', lidDk: '#C4CEDA', under: '#DDE4EC', inside: '#173A63', ice: '#E6F6FF' };
  const CAPS = ['#FF5A3C', '#3CC8F0', '#FFD23C', '#7CDA4A', '#C86BF0', '#FF8AC8'];
  // The cooler in 3D. The lid hinges on its back top edge.
  function cooler(P, t) {
    const c = COOL, x0 = c.x - c.w / 2, x1 = c.x + c.w / 2, z0 = c.z - c.d / 2, z1 = c.z + c.d / 2, h = c.h, a = lidAt(t);
    const lw = clamp(2.4 * P.k(c.z) / 2, 1.4, 4.5);
    const face = (pts, fill) => { const q = P.poly(pts); if (q) shape(q, { fill, stroke: PAL.ink, lwPx: lw }); };
    if (P.cam.x < x0) face([[x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0]], CO.side);
    if (P.cam.x > x1) face([[x1, 0, z0], [x1, 0, z1], [x1, h, z1], [x1, h, z0]], CO.side);
    face([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]], CO.body);
    const q = P.poly([[x0 + 10, h * .72, z0], [x1 - 10, h * .72, z0], [x1 - 10, h * .82, z0], [x0 + 10, h * .82, z0]]);
    if (q) shape(q, { fill: 'rgba(255,255,255,.35)', stroke: null });
    // the open top: ice and bottle caps
    if (a > .05 && P.cam.y > h) {
      face([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], CO.inside);
      for (let i = 0; i < 9; i++) { const [ix, iy, ik] = P.p(x0 + 8 + hash(i) * (c.w - 16), h - 2, z0 + 6 + hash(i + 4) * (c.d - 12)); ellipse(ix, iy, 5 * ik, 3 * ik, { fill: CO.ice, stroke: null }); }
      const n = bottlesLeft(t);
      for (let i = 0; i < 6; i++) {
        if (i < 6 - n) continue;                                              // the front two leave first
        const bx = x0 + 18 + (i % 3) * 27, bz = z1 - 12 - Math.floor(i / 3) * 18, [cx, cy, ck] = P.p(bx, h + 3, bz);
        ellipse(cx, cy, 4.6 * ck, 2.6 * ck, { fill: CAPS[i], stroke: PAL.ink, lwPx: 1.4 });
        ellipse(cx - 1.2 * ck, cy - .6 * ck, 1.6 * ck, .8 * ck, { fill: 'rgba(255,255,255,.55)', stroke: null });
      }
    }
    // the lid: rotate (dz, dy) about the hinge at (z1, h)
    const L = (x, u, v) => { const dz = -u, dy = v, ca = Math.cos(a), sa = Math.sin(a); return [x, h + (-dz * sa + dy * ca), z1 + (dz * ca + dy * sa)]; };
    const lx0 = x0 - 2, lx1 = x1 + 2, D = c.d + 2, T = c.lid;
    const quads = [
      { pts: [L(lx0, D, 0), L(lx1, D, 0), L(lx1, D, T), L(lx0, D, T)], fill: CO.lidDk },     // front edge
      { pts: [L(lx0, 0, T), L(lx1, 0, T), L(lx1, D, T), L(lx0, D, T)], fill: CO.lid },       // top
      { pts: [L(lx0, 0, 0), L(lx1, 0, 0), L(lx1, D, 0), L(lx0, D, 0)], fill: CO.under },     // underside
    ];
    // painter's order by distance, but only faces turned toward the camera
    const vis = qd => { const [p0, p1, , p3] = qd.pts; const n = [(p1[1] - p0[1]) * (p3[2] - p0[2]) - (p1[2] - p0[2]) * (p3[1] - p0[1]), (p1[2] - p0[2]) * (p3[0] - p0[0]) - (p1[0] - p0[0]) * (p3[2] - p0[2]), (p1[0] - p0[0]) * (p3[1] - p0[1]) - (p1[1] - p0[1]) * (p3[0] - p0[0])];
      const cxw = (p0[0] + p1[0]) / 2, cyw = (p0[1] + p3[1]) / 2, czw = (p0[2] + p3[2]) / 2; return n[0] * (P.cam.x - cxw) + n[1] * (P.cam.y - cyw) + n[2] * (P.cam.z - czw); };
    quads.map(qd => ({ ...qd, d: qd.pts.reduce((s, p) => s + P.depth(p[2]), 0) / 4 })).sort((a, b) => b.d - a.d).forEach(qd => { if (Math.abs(vis(qd)) > 0) face(qd.pts, qd.fill); });
    // a white stripe on the lid's front edge
    if (a < .2) { const s2 = P.poly([L(lx0 + 6, D, T * .45), L(lx1 - 6, D, T * .45), L(lx1 - 6, D, T * .6), L(lx0 + 6, D, T * .6)]); if (s2) shape(s2, { fill: '#9FB0C4', stroke: null }); }
  }
  // A generic sports-drink bottle, gripped at screen (x, y). s: px per bottle unit (a bottle is ~7 units tall).
  // o: { ang, cap, side ('front' | 'sticker'), turn (1 → -1 squash to spin it), open (cap off), fill }
  function bottle(x, y, s, o = {}) {
    X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s * (o.turn ?? 1), s);
    const lw = clamp(s * .12, 1, 3.5) / s, ink = PAL.ink;
    const body = [[-1.1, -2.2], [1.1, -2.2], [1.2, -1.2], [1.2, 3.1], [1.0, 3.5], [-1.0, 3.5], [-1.2, 3.1], [-1.2, -1.2]];
    const neck = [[-1.1, -2.2], [-.55, -3.2], [.55, -3.2], [1.1, -2.2]];
    shape(neck, { fill: 'rgba(140,92,48,.75)', stroke: ink, lw });                                  // the tea shows in the neck
    shape(body, { fill: 'rgba(210,235,245,.6)', stroke: ink, lw, smooth: .3 });
    if (o.side === 'sticker') {
      shape(rectPts(-1.2, -1.0, 2.4, 3.3), { fill: o.cap ? mixCol(o.cap, '#ffffff', .15) : '#FF5A3C', stroke: ink, lw: lw * .8 });
      shape(rectPts(-1.0, -.6, 2.0, 2.4), { fill: '#FFFDF4', stroke: ink, lw: lw * .7 });              // the slapped-on sticker
      X.fillStyle = PAL.crimson; X.font = `700 .55px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.fillText('SAFADI', 0, -.05); X.fillStyle = '#6B4A2B'; X.font = `700 .38px ${FONT_TALK}`; X.fillText('TEA', 0, .6); X.fillText('0 FUN', 0, 1.2);
    } else {
      shape(rectPts(-1.2, -1.0, 2.4, 3.3), { fill: linGrad(0, -1, 0, 2.3, [[0, o.cap || '#FF5A3C'], [1, mixCol(o.cap || '#FF5A3C', '#000000', .2)]]), stroke: ink, lw: lw * .8 });
      shape([[.25, -.75], [-.35, .55], [.1, .55], [-.25, 1.9], [.55, .25], [.05, .25], [.4, -.75]], { fill: '#FFF6C8', stroke: ink, lw: lw * .5 });   // a lightning bolt
    }
    line([[-.75, -1.9], [-.75, 3.0]], { stroke: 'rgba(255,255,255,.55)', lw: .22 });
    if (!o.open) shape(rectPts(-.62, -3.95, 1.24, .8), { fill: o.cap || '#FF5A3C', stroke: ink, lw });
    X.restore();
  }
  function sunglasses(A, s, k) {
    if (k < .01) return;
    const [lx, ly] = A.eyeL, [rx, ry] = A.eyeR, dy = (1 - ease(k)) * -8 * s, r = 1.55 * s;
    X.save(); X.globalAlpha = clamp(k * 3);
    line([[lx - r, ly + dy - .2 * s], [rx + r, ry + dy - .2 * s]], { stroke: '#1B1B22', lwPx: Math.max(2, .35 * s) });
    for (const [x, y] of [[lx, ly], [rx, ry]]) {
      shape([[x - r, y + dy - .5 * s], [x + r, y + dy - .5 * s], [x + r * .8, y + dy + .9 * s], [x - r * .8, y + dy + .9 * s]], { fill: '#1B1B22', stroke: PAL.ink, lwPx: 2, smooth: .4 });
      line([[x - r * .6, y + dy - .1 * s], [x - r * .1, y + dy - .35 * s]], { stroke: 'rgba(255,255,255,.7)', lwPx: Math.max(1.5, .25 * s) });
    }
    X.restore();
  }
  function paper(x, y, s, t) {                                               // the crumpled essay from his sock
    X.save(); X.translate(x, y); X.rotate(-.06 + .03 * Math.sin(t * 2)); X.scale(s, s);
    shape([[-2.2, -2.8], [-.3, -3.0], [2.1, -2.7], [2.3, .2], [2.0, 2.8], [-.2, 2.6], [-2.2, 2.9], [-2.4, .1]], { fill: '#FFFDF4', stroke: PAL.ink, lw: .14 });
    for (let i = 0; i < 6; i++) line([[-1.6, -2 + i * .8], [1.5 - (i % 3) * .4, -2.1 + i * .8]], { stroke: '#9BB5D6', lw: .1 });
    X.restore();
  }
  // Tired sweat drops by a head
  function sweat(A, s, t, k) {
    if (k < .01) return;
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .9 + i * .37), x = A.head[0] + (i - 1) * 4.2 * s + (i === 1 ? 5.5 : 0) * s, y = A.head[1] - 5 * s + ph * 6 * s;
      X.save(); X.globalAlpha = k * (1 - ph);
      shape([[x, y - 1.1 * s], [x + .55 * s, y], [x, y + .55 * s], [x - .55 * s, y]], { fill: '#8FD3FF', stroke: PAL.ink, lwPx: 1.5, smooth: .6 });
      X.restore();
    }
  }
  // The puddle from Housam's wrung-out jersey spreads over to Safadi's shoe
  function puddle(P, t) {
    const k = ease(seg(t, 108.6, 110.0)) * (1 - seg(t, 116, 118)); if (k < .01) return;
    const x0 = 2410, x1 = lerp(2420, 2610, ease(seg(t, 108.8, SPLASH))), pts = [];
    for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, r = 1 + .12 * Math.sin(a * 5 + 1); pts.push(P.p((x0 + x1) / 2 + Math.cos(a) * ((x1 - x0) / 2 + 22) * r, .5, 3110 + Math.sin(a) * 26 * r)); }
    shape(pts.map(p => [p[0], p[1]]), { fill: 'rgba(120,190,235,.55)', stroke: 'rgba(60,110,160,.6)', lwPx: 2, smooth: true });
  }
  // Hammerspace bottles: Alma's small one and big one
  const SIZES = t => on(t, 92.2, 95.3, .25);

  // ---------- poses ----------
  const H_REST = { footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7] };
  const H_CROSS = { handL: [2.3, -12.6], handR: [-2.3, -12.1], handPoseL: 'fist', handPoseR: 'fist' };
  function housamPose(t) {
    const talk = speaking('housam', t), at = housamAt(t), ls = lastSpeaker(t, 'housam');
    let o = { ...H_REST, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'smile', 'o']), brows: 'normal', handPoseL: 'open', handPoseR: 'open',
      lookX: ls === 'alma' ? -.7 : .7, turn: ls === 'alma' ? -.12 : .12, lookY: .05 };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < 15.2) {                                                         // midfield: hands on knees, panting
      const pant = Math.abs(Math.sin(t * 5.5));
      Object.assign(o, { handL: [-2.4, -6.4], handR: [2.4, -6.4], dy: 1.1 + .2 * pant, tilt: .06, lookY: .5, lookX: .1, turn: 0, eyes: t < 9.6 ? (talk ? 'open' : 'happy') : 'wide', mouth: talk ? o.mouth : pant > .5 ? 'open' : 'o', brows: 'worried' });
      if (t > 9.6) Object.assign(o, { lookY: .35, lookX: .5, brows: 'up', dy: .6, tilt: 0 });
      if (t > 14.5) Object.assign(o, { eyes: 'wide', brows: 'focused', mouth: 'grin', dy: .2 });
      return o;
    }
    if (t < 18.0) {                                                         // the sprint
      const dr = housamDribble(at.p / 44, 1.35);
      return { ...o, ...dr, handL: [-4.6, -13 + 2.2 * Math.sin(at.p / 44 * Math.PI)], handR: [4.6, -13 - 2.2 * Math.sin(at.p / 44 * Math.PI)], handPoseL: 'fist', handPoseR: 'fist',
        lean: -.1, brows: 'focused', mouth: 'grin', lookX: .2, lookY: .2, turn: 0 };
    }
    if (t < SLAM2) {                                                        // flip the lid; ooh
      to('R', [6.2, -8.0], on(t, 18.1, 18.7, .15), 'palm');
      Object.assign(o, { lookX: .8, lookY: .6, turn: .2, brows: 'up', eyes: t > 18.5 ? 'wide' : 'open', mouth: talk ? o.mouth : 'grin' });
      if (t > 18.7) { to('L', [-1.4, -12.6], 1, 'fist'); to('R', [1.4, -12.6], ease(seg(t, 18.7, 18.9)), 'fist'); }
      if (t > 19.9) { to('R', [6.4, -8.3], ease(seg(t, 19.9, 20.4)), 'open'); o.lookY = .7; }
      return o;
    }
    if (t < 22.2) {                                                         // the slam
      const j = kick(t, SLAM2, 5);
      return { ...o, jump: 1.8 * j, eyes: 'wide', brows: 'up', mouth: 'o', handL: [-4.6, -15], handR: [4.6, -15], handPoseL: 'palm', handPoseR: 'palm', lookX: .8, turn: .15 };
    }
    // ---- the debate: listening (look at the talker), talking (palm), plus beats ----
    if (talk) to('R', [5.3, -13.4 + .6 * Math.sin(t * 5)], 1, 'palm');
    if (t > 27.7 && t < 29.8) to('R', [4.9, -22.5], 1, 'point');                                           // "HYDRATION drinks"
    const crack = on(t, 37.4, 38.3, .15);
    if (crack > 0) { to('L', [-.9, -13.2], crack, 'fist'); to('R', [.9, -13.2], crack, 'fist'); o.brows = 'focused'; o.mouth = 'smirk'; }
    if (t > 38.8 && t < 40.2) Object.assign(o, housamDribble(at.p / 40, .7), { lookX: .6 });
    if (t > 46.6 && t < 48.8) to('R', [4.9, -22.5], 1, 'point');                                           // reason ONE
    const sock = on(t, 50.9, 51.7, .2);
    if (sock > 0) { o.dy = 3.2 * sock; o.tilt = .15 * sock; to('R', [2.2, -3.2], sock, 'fist'); o.lookY = .9; o.lookX = .3; }
    const read = on(t, 51.6, 56.0, .25);
    if (read > 0) { to('L', [-2.3, -16.2], read, 'fist'); to('R', [2.3, -16.2], read, 'fist'); o.lookY = .8; o.lookX = 0; o.brows = 'up'; }
    if (t > 56 && t < 58.4) o.mouth = 'grin';
    if (t > 84.1 && t < 86.9) { to('R', [4.8, -19.5 + .4 * Math.sin(t * 9)], 1, 'point'); o.brows = 'up'; o.mouth = talk ? o.mouth : 'smirk'; }
    const zero = on(t, 89.6, 91.8, .2);
    if (zero > 0) { to('L', [-5.2, -24], zero, 'fist'); to('R', [5.2, -24], zero, 'fist'); o.jump = 2 * Math.abs(Math.sin((t - 89.6) * 6)) * zero; o.eyes = 'happy'; }
    if (t > 97.2 && t < 99.6) to('R', [5.2, -17], 1, 'palm');
    const cool = on(t, 102.5, 104.85, .2);
    if (cool > 0) { if (t < 102.9) { to('L', [-2.3, -25], cool, 'fist'); to('R', [2.3, -25], cool, 'fist'); } else { o = { ...o, ...H_CROSS }; o.lean = -.06; o.mouth = 'smirk'; o.tilt = -.05; o.lookX = 0; o.turn = 0; } }
    const wring = on(t, 108.1, 110.4, .2);
    if (wring > 0) { const w = Math.sin(t * 14) * .5; to('L', [-1.3 + w, -10.4], wring, 'fist'); to('R', [1.3 + w, -10.0], wring, 'fist'); o.lookY = .7; o.lookX = .2; o.brows = 'focused'; o.tilt = .06; }
    if (t > SPLASH && t < 112.8) Object.assign(o, { lookX: .8, lookY: .6, mouth: 'o', brows: 'up' });
    if (t > 115.45 && t < 117.6) to('R', [5.4, -17 + .6 * Math.sin(t * 7)], 1, 'palm');
    if (t > 120.2 && t < 122.6) { to('L', [-1.4, -11.4], 1, 'open'); o.brows = 'worried'; }
    // the sponsor break: to camera
    if (t > 128.0 && t < YANK) {
      Object.assign(o, { lookX: 0, lookY: 0, turn: 0, brows: 'up', eyes: t > 133.4 && t < 133.9 ? 'wink' : 'open', mouth: talk ? o.mouth : 'grin' });
      to('R', [5.6, -16.5 + .3 * Math.sin(t * 4)], 1, 'palm'); to('L', [-4.4, -11.5], 1, 'open');
      if (t < 128.5) Object.assign(o, housamDribble(seg(t, 128, 128.5) * 3, .8));
    }
    if (t >= YANK && t < 135.6) { const j = kick(t, YANK, 6); Object.assign(o, { eyes: 'wide', mouth: 'o', brows: 'up', lean: .15 * j, jump: 1.2 * j, lookX: -.8, turn: -.2 }); to('L', [-5.8, -11], 1, 'open'); }
    if (t > 135.6 && t < 137.9) { to('L', [-5.2, -14.5], 1, 'palm'); to('R', [5.2, -14.5], 1, 'palm'); o.brows = 'up'; o.lookX = -.7; }
    const crossed = on(t, CROSS, 151.3, .2);
    if (crossed > 0) { o = { ...o, ...(crossed > .5 ? H_CROSS : {}) }; o.tilt = -.06 * crossed; o.eyes = t > 145.9 && t < 146.4 || t > 147.5 && t < 148.0 ? 'open' : 'closed'; o.mouth = talk ? o.mouth : 'smirk'; o.lookX = .8; }
    if (t > 148.6 && t < 151.4) Object.assign(o, { eyes: 'open', brows: 'up', mouth: 'o', lookX: .8 });
    const yay = on(t, 151.4, 152.8, .15);
    if (yay > 0) { to('L', [-5.2, -24], yay, 'fist'); to('R', [5.2, -24], yay, 'fist'); o.jump = 2.4 * Math.sin(Math.PI * seg(t, 151.4, 152.2)); o.eyes = 'wide'; o.mouth = 'grin'; }
    // ---- the cooler, the toss, the toast, the taste ----
    if (t > 155.0 && t < 155.75) Object.assign(o, housamDribble(at.p / 40, .7));
    if (t > 155.7 && t < 157.7) {
      o.lookX = .7; o.lookY = .6; o.turn = .2; o.mouth = 'grin'; o.brows = 'up';
      const flip = on(t, 155.6, 156.1, .1), dip = on(t, 156.1, 156.6, .12);
      to('R', [6.4, -8.4], flip, 'palm');
      if (dip > 0) { to('L', [4.2, -7.4], dip, 'fist'); to('R', [6.4, -7.4], dip, 'fist'); o.dy = .8 * dip; }
      if (t >= 156.55) { to('L', [-4.5, -12.5], ease(seg(t, 156.55, 156.8)), 'fist'); to('R', [5.2, -14], 1 - ease(seg(t, 156.9, 157.3)), 'fist'); }
      const throwK = on(t, 156.75, 157.3, .12);
      if (throwK > 0) { to('R', [-2.5, -22], throwK, 'palm'); o.lookX = -.8; o.turn = -.2; }
    }
    if (t > 157.7 && t < 158.3) Object.assign(o, housamDribble(at.p / 40, .6), { handL: [-4.5, -12.5], handPoseL: 'fist' });
    if (t >= 158.3 && t < 172) {
      o.lookX = -.7; o.turn = -.15; o.handL = [-4.3, -12.4]; o.handPoseL = 'fist';
      const twist = on(t, 158.35, 158.95, .1);
      if (twist > 0) { to('R', [-2.9 + .3 * Math.sin(t * 30), -14.6], twist, 'fist'); o.lookY = .6; }
      const toast = on(t, 159.1, GULP[0] + .1, .25);
      if (toast > 0) { to('L', [-5.4 - .6 * on(t, CLINK - .2, CLINK + .15, .1), lerp(-21, -14, ease(seg(t, 161.7, 162.05)))], toast, 'fist'); o.mouth = talk ? o.mouth : 'grin'; o.brows = 'up'; o.lookY = -.5; }
      const drink = on(t, GULP[0], CRUMPLE + .5, .2);
      if (drink > 0) { to('L', [-1.3, -21.8], drink, 'fist'); o.tilt = -.14 * drink; o.eyes = 'closed'; o.mouth = 'o'; o.lookX = 0; o.turn = 0; o.breathe = false; o.blink = 0; }
      if (t > GULP[1] && t < CRUMPLE) Object.assign(o, { eyes: 'open', lookY: -.3 });   // the freeze
      if (t >= CRUMPLE) {
        const c = ease(seg(t, CRUMPLE, CRUMPLE + .3));
        Object.assign(o, { eyes: 'squeeze', mouth: 'wobble', brows: 'worried', sq: .12 * boing(t, CRUMPLE, 3, 4), tilt: .08 * c, lookX: 0, turn: 0 });
        to('L', [-4.3, -13.2], ease(seg(t, CRUMPLE + .4, CRUMPLE + .8)), 'fist');
      }
      if (t > 165.0) Object.assign(o, { eyes: t < 166.4 ? 'wide' : 'open', mouth: talk ? o.mouth : 'flat', brows: 'worried', lookX: -.6 });
      if (t > 169.2) Object.assign(o, { dy: .5, mouth: talk ? o.mouth : 'frown', lookX: -.5 });
      const look = on(t, 170.9, 172.2, .25);
      if (look > 0) { to('L', [-.6, -16.8], look, 'fist'); o.lookY = .7; o.lookX = -.2; o.eyes = 'open'; }
    }
    if (t >= 172) {
      Object.assign(o, { handL: [-4.3, -12.4], handPoseL: 'fist', lookX: .9, turn: .3, brows: 'focused', eyes: 'open', mouth: talk ? o.mouth : 'flat' });
      if (t < 176) { o.turn = lerp(-.1, .3, ease(seg(t, 175.6, 176.6))); o.lookX = lerp(-.3, .9, ease(seg(t, 175.6, 176.4))); o.mouth = 'o'; o.eyes = 'wide'; }
      if (t > 186.8 && t < 189.2) { to('R', [5.4, -15.5], 1, 'palm'); o.brows = 'worried'; o.jump = .5 * Math.abs(Math.sin(t * 6)); }
      if (t > 189.3) Object.assign(o, { mouth: 'frown', brows: 'worried' });
    }
    return o;
  }

  const A_REST = { handL: [-3.4, -4.9], handR: [3.4, -4.9] };
  const A_CROSS = { handL: [1.4, -6.9], handR: [-1.4, -6.6], handPoseL: 'fist', handPoseR: 'fist' };
  function almaPose(t) {
    const talk = speaking('alma', t), at = almaAt(t), ls = lastSpeaker(t, 'alma');
    let o = { ...A_REST, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']), brows: 'normal', handPoseL: 'open', handPoseR: 'open',
      lookX: .75, turn: .12, lookY: 0, hairSwing: .08 * wob(t, .4) };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < 15.2) {                                                         // wobbly knees, panting
      const pant = Math.abs(Math.sin(t * 5.1 + 1)), wob2 = Math.sin(t * 17) * .35 * on(t, 5.6, 8.4, .3);
      Object.assign(o, { handL: [-2.1, -3.4], handR: [2.1, -3.4], dy: .5 + .12 * pant, footL: [-1.2 + wob2, -.55], footR: [1.2 - wob2, -.55], lookX: .5, lookY: .4, turn: .05,
        eyes: talk ? 'open' : 'closed', mouth: talk ? o.mouth : pant > .5 ? 'open' : 'o', brows: 'worried', tilt: -.05 });
      if (t > 9.8) Object.assign(o, { eyes: 'wide', lookX: .6, lookY: .3, brows: 'up', dy: .2 });
      if (t > 13.9) { Object.assign(o, { eyes: 'open', brows: 'angry', mouth: talk ? o.mouth : 'grin', dy: 0, lookX: .3 }); to('R', [4.9, -13.4], ease(seg(t, 14.0, 14.3)), 'point'); }
      return o;
    }
    if (t < 18.0) return { ...o, ...almaSkip(at.p / 44, 1.2), mouth: 'grin', eyes: 'open', brows: 'angry', lookX: .2, lookY: .1, turn: 0, handPoseL: 'fist', handPoseR: 'fist' };
    if (t < SLAM2) {
      Object.assign(o, { lookX: .8, lookY: .5, turn: .2, brows: 'up', eyes: t > 18.5 ? 'star' : 'open', mouth: 'grin' });
      to('L', [-1.1, -11.6], ease(seg(t, 18.4, 18.7)), 'open'); to('R', [1.1, -11.6], ease(seg(t, 18.4, 18.7)), 'open');
      return o;
    }
    if (t < 22.2) { const j = kick(t, SLAM2, 5); return { ...o, jump: 1.6 * j, eyes: 'wide', brows: 'up', mouth: 'O', handL: [-4.6, -11], handR: [4.6, -11], handPoseL: 'palm', handPoseR: 'palm' }; }
    if (talk) to('R', [4.2, -11.2 + .5 * Math.sin(t * 5)], 1, 'palm');
    if (t > 30.1 && t < 32.4) { to('L', [-3.9, -5.6], 1, 'fist'); o.tilt = -.08; o.eyes = t > 31.2 ? 'closed' : 'open'; }             // sassy, hand on hip
    if (t > 38.8 && t < 40.2) Object.assign(o, almaSkip(at.p / 40, .6));
    const shout = on(t, 56.0, 58.2, .15);
    if (shout > 0) { to('R', [4.9, -13.4], shout, 'point'); o.jump = 1.5 * Math.sin(Math.PI * seg(t, 56, 56.5)); o.eyes = 'wide'; o.brows = 'up'; }
    if (t > 68.5 && t < 71.2) { to('R', [4.2, -12.4], 1, 'point'); o.jump = 1.2 * Math.sin(Math.PI * seg(t, 68.5, 68.9)); o.brows = 'angry'; }
    if (t > 78.6 && t < 81) { to('L', [-5, -11], 1, 'palm'); to('R', [5, -11], 1, 'palm'); o.eyes = 'happy'; o.mouth = talk ? o.mouth : 'grin'; }
    const sizes = SIZES(t);
    if (sizes > 0) { to('L', [-4.6, -10.5], sizes, 'fist'); to('R', [4.8, -11.2], sizes, 'fist'); o.lookX = .2; }
    const cool = on(t, 102.5, 104.85, .2);
    if (cool > 0) { if (t < 102.9) { to('L', [-1.1, -13], cool, 'fist'); to('R', [1.1, -13], cool, 'fist'); } else { o = { ...o, ...A_CROSS }; o.lean = .05; o.mouth = 'smirk'; o.lookX = 0; o.turn = 0; o.hairSwing = .5 * kick(t, 102.9, 3); } }
    if (t > SPLASH && t < 112.8) Object.assign(o, { lookX: .8, lookY: .6, mouth: 'O', brows: 'up', emote: '!', emoteK: on(t, SPLASH, 111.2, .12) });
    if (t > 112.9 && t < 115.2) { to('L', [-1.1, -11.6], 1, 'open'); to('R', [1.1, -11.6], 1, 'open'); o.eyes = 'heart'; }
    if (t > 120.2 && t < 122.6) Object.assign(o, { mouth: 'frown', brows: 'worried' });
    if (t > 128 && t < 133.9) Object.assign(o, { lookX: .9, turn: .2, brows: 'worried', mouth: 'flat', emote: 'sweat', emoteK: on(t, 130, 133.9, .2) });
    const grab = on(t, 134.2, 135.4, .15);
    if (grab > 0) { to('R', [6.6, -8.6], grab, 'fist'); o.lean = -.12 * grab * (t > YANK ? 1 : .3); o.brows = 'angry'; o.lookX = .9; }
    if (t > 133.9 && t < 134.6) Object.assign(o, almaSkip(at.p / 40, .7));
    if (t > 135.4 && t < 136.2) Object.assign(o, almaSkip(at.p / 40, .7));
    if (t > 138.1 && t < 143) { to('R', [4.6, -12.4 + .5 * Math.sin(t * 3)], 1, 'point'); o.lookX = .4; }
    const crossed = on(t, CROSS, 151.3, .2);
    if (crossed > 0) { o = { ...o, ...(crossed > .5 ? A_CROSS : {}) }; o.tilt = -.06 * crossed; o.eyes = t > 146.1 && t < 146.6 || t > 147.3 && t < 147.8 ? 'open' : 'closed'; o.mouth = 'smirk'; o.lookX = .9; }
    if (t > 148.6 && t < 151.4) Object.assign(o, { eyes: 'open', brows: 'up', mouth: 'o', lookX: .9 });
    const yay = on(t, 151.4, 152.8, .15);
    if (yay > 0) { to('L', [-5, -11], yay, 'palm'); to('R', [5, -11], yay, 'palm'); o.jump = 2 * Math.sin(Math.PI * seg(t, 151.4, 152.1)); o.eyes = 'star'; o.mouth = talk ? o.mouth : 'grin'; }
    if (t > 155 && t < 157.7) { o.lookX = .8; o.lookY = .1; o.eyes = 'star'; o.mouth = 'grin'; }
    const catchK = on(t, 157.0, 158.4, .15);
    if (t > 157.0 && t < 157.55) { to('R', [4.4, -12.3], catchK, 'palm'); o.lookY = -.7; o.brows = 'up'; o.mouth = 'o'; }
    if (t >= 157.5) { o.handR = [3.6, -8.8]; o.handPoseR = 'fist'; }
    if (t > 157.7 && t < 158.3) Object.assign(o, almaSkip(at.p / 40, .6), { handR: [3.6, -8.8], handPoseR: 'fist' });
    if (t >= 158.3 && t < 172) {
      o.lookX = .7; o.turn = .15;
      const twist = on(t, 158.35, 158.95, .1);
      if (twist > 0) { to('L', [2.6 + .3 * Math.sin(t * 30), -9.8], twist, 'fist'); o.lookY = .5; }
      const toast = on(t, 160.4, GULP[0] + .1, .25);
      if (toast > 0) { to('R', [5.0 + .5 * on(t, CLINK - .2, CLINK + .15, .1), -12.8], toast, 'fist'); o.mouth = talk ? o.mouth : 'grin'; o.eyes = 'happy'; }
      const drink = on(t, GULP[0], CRUMPLE + .5, .2);
      if (drink > 0) { to('R', [1.0, -12.2], drink, 'fist'); o.tilt = .14 * drink; o.eyes = 'closed'; o.mouth = 'o'; o.lookX = 0; o.turn = 0; o.breathe = false; o.blink = 0; }
      if (t > GULP[1] && t < CRUMPLE) Object.assign(o, { eyes: 'open', lookY: -.3 });
      if (t >= CRUMPLE) {
        Object.assign(o, { eyes: 'squeeze', mouth: 'wobble', brows: 'worried', sq: .12 * boing(t, CRUMPLE, 3, 4), lookX: 0, turn: 0, hairSwing: .3 * boing(t, CRUMPLE, 2, 3) });
        to('R', [3.6, -8.8], ease(seg(t, CRUMPLE + .4, CRUMPLE + .8)), 'fist');
      }
      if (t > 165.2) Object.assign(o, { eyes: 'open', mouth: talk ? o.mouth : 'frown', brows: 'worried', lookY: .5, lookX: .3, emote: t < 168.8 ? '?' : null, emoteK: on(t, 166.5, 168.8, .15) });
    }
    if (t >= 172) {
      Object.assign(o, { handR: [3.6, -8.8], handPoseR: 'fist', lookX: .9, turn: .25, brows: 'angry', eyes: 'open', mouth: talk ? o.mouth : 'frown' });
      if (t < 176) { o.turn = lerp(0, .25, ease(seg(t, 175.7, 176.6))); o.lookX = lerp(.2, .9, ease(seg(t, 175.7, 176.5))); o.brows = 'worried'; }
      if (t > 178.7 && t < 180.6) { to('L', [4.9, -13.4], 1, 'point'); o.jump = 1.4 * Math.sin(Math.PI * seg(t, 178.7, 179.1)); o.eyes = 'wide'; }
    }
    return o;
  }

  function safadiPose(t) {
    const talk = speaking('safadi', t), at = safadiAt(t), sk = seatK(t), ls = lastSpeaker(t, 'safadi');
    const sy = 2.2 * sk;                                                     // hand targets ride down with the seat
    let o = { handL: [-4.4, -8.1 + sy], handR: [4.4, -8.1 + sy], handPoseL: 'open', handPoseR: 'open', brows: 'normal',
      mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']), lookX: -.7, turn: -.15, lookY: 0 };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], [p[0], p[1] + sy], k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (sk > 0) Object.assign(o, { dy: 2.2 * sk, footL: mix([-1.25, -.8], [-3.6, -.9], sk), footR: mix([1.25, -.8], [3.6, -.9], sk) });
    if (sk > .5) { o.handL = mix(o.handL, [-3.2, -4.8], sk); o.handR = mix(o.handR, [3.2, -4.8], sk); o.handPoseL = o.handPoseR = 'fist'; }
    if (t < 15) {                                                            // the secret swap: lid shut, a pat, whistling off
      const close = on(t, 10.9, 12.3, .25);
      to('L', [-3.4, -6.4], close, 'palm'); to('R', [3.4, -6.4], close, 'palm');
      Object.assign(o, { lookX: -.1, lookY: .7, turn: 0, eyes: t > 11.9 ? 'happy' : 'narrow', mouth: t > 12.3 ? 'o' : 'smirk', brows: 'up', emote: 'music', emoteK: on(t, 12.2, 14.2, .2) });
      if (at.moving) Object.assign(o, safadiWalk(at.p / 58, 1), { turn: .3 });
      return o;
    }
    if (t < 21.2) { if (at.moving) Object.assign(o, safadiWalk(at.p / 58, 1)); Object.assign(o, { turn: -.3, lookX: -.8, brows: 'up' }); return o; }
    if (t < 21.9) { to('L', [-6.4, -7.0], on(t, 21.0, 21.9, .12), 'palm'); Object.assign(o, { brows: 'angry', mouth: 'flat', eyes: 'narrow', lookX: -.8, lookY: .5 }); return o; }
    // ---- the debate ----
    if (talk && sk < .5) to('R', [5.3, -12.6], 1, 'palm');
    if (talk && sk >= .5) to('L', [-5.3, -12.6], 1, 'palm');
    if (t > 21.9 && t < 24.6) { to('R', [5.8 + .7 * Math.sin(t * 14), -21.4], 1, 'point'); o.brows = 'quizzical'; }
    if (t > 25.0 && t < 32.4) { const cr = on(t, 25.0, 32.4, .35); o.handL = mix(o.handL, [1.8, -11.4], cr); o.handR = mix(o.handR, [-1.8, -11.0], cr); if (cr > .5) Object.assign(o, { handPoseL: 'fist', handPoseR: 'fist', brows: 'quizzical', mouth: 'flat' }); }
    if (t > 35.1 && t < 37.8) { o.tilt = .05 * Math.sin(t * 7); o.eyes = 'closed'; }
    if (t > 37.8 && t < 41.4) Object.assign(o, { brows: 'quizzical', mouth: talk ? o.mouth : 'smirk' });
    if (t > 41.5 && t < 42.15) to('R', [5.4, -12.8], 1, 'palm');
    if (t > 42.0 && t < 42.5) Object.assign(o, safadiWalk(at.p / 58, .6));
    if (sk > .5) o.mouth = talk ? o.mouth : 'smirk';
    if (t > 48.8 && t < 51.2) { to('L', [-5.8, -14.5], 1, 'point'); o.lean = -.06; o.brows = 'quizzical'; }
    const heart = on(t, 56.6, 58.5, .2);
    if (heart > 0) { to('R', [1.3, -13.2], heart, 'palm'); Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'o', emote: 'heart', emoteK: heart, lookX: 0, turn: 0 }); }
    if (t > 58.6 && t < 60.9) { to('L', [-5.3, -12.4], 1, 'palm'); to('R', [5.3, -12.4], 1, 'palm'); o.eyes = 'closed'; o.tilt = .05; }
    if (t > 61.2 && t < 63.6) to('R', [5.8, -21.4], 1, 'point');
    if (t > 66.5 && t < 68.4) Object.assign(o, { eyes: 'happy', mouth: talk ? o.mouth : 'grin', bulb: ease(seg(t, 66.6, 66.85)) * (1 - ease(seg(t, 68.0, 68.4))) });
    if (t > 68.5 && t < 71.4) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'o', bulb: 0 });
    const sugar = on(t, 81.2, 84.2, .3);
    if (sugar > 0) { to('L', [-5.6, -14.2], sugar, 'palm'); Object.assign(o, { power: .7 * sugar, eyes: sugar > .5 ? 'glow' : 'open', brows: 'up', lookX: -.9 }); }
    if (t > 89.8 && t < 91.8) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'o', dy: (o.dy || 0) - .3 * kick(t, 89.9, 6) });
    if (t > 95.3 && t < 97.1) {
      const up = on(t, 95.4, 96.1, .1);
      to('R', [5.8, -21.4], up, 'point');
      Object.assign(o, { mouth: t < 96.1 ? 'O' : 'flat', brows: t < 96.1 ? 'up' : 'worried', eyes: t < 96.1 ? 'wide' : 'open', lookX: -.5 });
    }
    if (t > 102.9 && t < 104.9) Object.assign(o, { eyes: 'narrow', mouth: 'flat', brows: 'quizzical' });
    if (t > SPLASH && t < 112.8) Object.assign(o, { eyes: t < 110.6 ? 'wide' : 'narrow', lookY: 1, lookX: -.4, brows: t < 110.6 ? 'up' : 'normal', mouth: talk ? o.mouth : 'flat', dy: (o.dy || 0) + .4 * kick(t, SPLASH, 6) });
    const plate = on(t, 117.7, 120.3, .3);
    if (plate > 0) { to('L', [-5.6, -14.2], plate, 'palm'); Object.assign(o, { power: .6 * plate, eyes: plate > .5 ? 'glow' : 'open', brows: 'up', lookX: -.9 }); }
    if (t > 128.4 && t < 134.2) Object.assign(o, { brows: 'quizzical', mouth: 'flat', lookX: -.6, emote: '?', emoteK: on(t, 129.4, 131.4, .15) });
    if (t > 134.9 && t < 137.9) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
    const chin = on(t, 139.0, 148.5, .35);
    if (chin > 0) { to('R', [.8, -16.1], chin, 'fist'); if (t > CROSS) Object.assign(o, { eyes: 'narrow', lookX: -.4 + .5 * Math.sin((t - CROSS) * 1.6), lookY: -.3, mouth: 'flat', brows: 'focused' }); }
    if (t > 148.6 && t < 151.3) Object.assign(o, { eyes: 'open', brows: 'up', mouth: talk ? o.mouth : 'smile' });
    // stands and steps aside, presenting the cooler
    if (t > 153.65 && t < 155.0) Object.assign(o, safadiWalk(at.p / 58, .8), { turn: .15 });
    const present = on(t, 154.8, 156.4, .25);
    if (present > 0) { to('L', [-5.6, -13.4], present, 'palm'); o.eyes = 'happy'; o.mouth = 'grin'; }
    if (t > 156.4 && t < 176) {
      Object.assign(o, { lookX: -.6, mouth: 'smirk', eyes: t > 162.6 ? 'narrow' : 'open', brows: 'up' });
      if (t > 163.0 && t < 164.3) Object.assign(o, { lookX: 0, turn: 0, eyes: t > 163.5 && t < 164.0 ? 'wink' : 'open', mouth: 'smirk' });   // a look at us
      const cover = on(t, 164.3, 171.8, .2);
      if (cover > 0) { to('R', [.9, -18.9], cover, 'palm'); o.dy = .25 * Math.abs(Math.sin(t * 11)) * cover; o.eyes = 'squeeze'; o.mouth = 'smile'; }
    }
    if (t >= 176) {
      Object.assign(o, { lookX: -.7, turn: -.15, brows: 'up' });
      if (t > 176 && t < 178.5) to('R', [5.8, -21.4], 1, 'point');
      if (t > 178.7 && t < 180.6) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
      if (t > 180.8 && t < 183.5) { to('L', [-5.3, -12.4], 1, 'palm'); to('R', [5.3, -12.4], 1, 'palm'); o.bulb = ease(seg(t, 181.0, 181.25)) * (1 - ease(seg(t, 183.1, 183.5))); o.eyes = 'happy'; }
      if (t > 183.7 && t < 186.6) { const k = Math.abs(Math.sin(t * 13)); Object.assign(o, { handL: [-2.2, -9.5], handR: [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'squeeze', mouth: talk ? o.mouth : k > .5 ? 'grin' : 'open', dy: .4 * k, tilt: -.08 }); }
      if (t > 186.8 && t < 189.2) Object.assign(o, { eyes: 'narrow', mouth: 'smirk' });
      if (t > 189.3) { to('R', [5.8, -21.4], on(t, 189.3, 192, .25), 'point'); o.eyes = t > 191 ? 'wink' : 'happy'; }
    }
    return o;
  }

  // ---------- drawing everyone ----------
  const CAST = {
    housam: { at: housamAt, pose: housamPose, rig: housam, unit: HU, y: () => 0 },
    alma: { at: almaAt, pose: almaPose, rig: alma, unit: AU, y: () => 0 },
    safadi: { at: safadiAt, pose: safadiPose, rig: safadi, unit: SU, y: () => 0 },
  };
  const HELD = {                                                            // bottle in hand: [hand, cap colour, angle] or null
    housam: t => t >= 156.45 && t < 192 ? ['handL', CAPS[1]] : null,
    alma: t => t >= TOSS[1] && t < 192 ? ['handR', CAPS[0]] : null,
  };
  // Paint the set, the cooler and the cast in depth order. → { A: anchors by name, s: px/unit by name, P }
  function group(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {};
    const setO = { ...O_BASE, splitZ: 3060, ...(o.set || {}) };
    layer(() => { F.back(P, t, setO); puddle(P, t); }, { blur });
    const items = [{ z: COOL.z + COOL.d / 2 + 5, draw: () => cooler(P, t) }];
    for (const [name, c] of Object.entries(CAST)) {
      if (o.only && !o.only.includes(name)) continue;
      const at = c.at(t); if (P.depth(at.z) < 60) continue;
      items.push({ z: at.z, draw: () => {
        const [sx, sy, k] = P.p(at.x, c.y(t), at.z), s = c.unit * k;
        A[name] = c.rig(sx, sy, s, { ...c.pose(t), t }); S[name] = s;
        const held = HELD[name] && HELD[name](t);
        if (held) heldBottle(t, name, A[name], s);
        if (name === 'alma' && SIZES(t) > 0) {                               // small and big bottles
          const k2 = backOut(seg(t, 92.2, 92.5)) * (1 - ease(seg(t, 95.0, 95.3)));
          bottle(A.alma.handL[0], A.alma.handL[1] - .6 * s, s * .55 * k2, { cap: CAPS[3], ang: -.1 });
          bottle(A.alma.handR[0], A.alma.handR[1] - 2.2 * s, s * 1.35 * k2, { cap: CAPS[4], ang: .08 });
        }
        if (name === 'housam') { sunglasses(A.housam, s, on(t, 102.6, 104.85, .25)); if (t > 51.2 && t < 56.05) paper((A.housam.handL[0] + A.housam.handR[0]) / 2, A.housam.handL[1] - 1.8 * s, s * .9, t); }
        if (name === 'alma') sunglasses(A.alma, s * .95, on(t, 102.65, 104.85, .25));
        if ((name === 'housam' || name === 'alma') && t < 11) sweat(A[name], s, t, on(t, 3, 10.5, .5));
      } });
    }
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(it => it.draw());
    F.front(P, t, setO);
    tossBottle(t, A, S);
    return { A, S, P };
  }
  function heldBottle(t, name, A, s) {
    const [hand, cap] = HELD[name](t), [hx, hy] = A[hand], bs = s * .78;
    const drinking = on(t, GULP[0], CRUMPLE + .5, .2), dir = name === 'housam' ? 1 : -1;
    const open = t > 158.8, look = name === 'housam' ? on(t, 170.9, 172.2, .25) : 0;
    const sipFinal = t > 192 ? 0 : 0;
    bottle(hx, hy - 1.2 * bs, bs, { cap, open, ang: dir * (-.1 + 2.2 * drinking) + sipFinal, side: look > .5 ? 'sticker' : 'front', turn: look > 0 ? Math.cos(Math.PI * clamp(look * 1.2)) || .05 : 1 });
  }
  function tossBottle(t, A, S) {
    if (t < TOSS[0] || t >= TOSS[1] || !A.housam || !A.alma) return;
    const u = seg(t, TOSS[0], TOSS[1]), from = A.housam.handR, to = A.alma.handR;
    const x = lerp(from[0], to[0], u), y = lerp(from[1] - 40, to[1] - 40, u) - 260 * 4 * u * (1 - u);
    bottle(x, y, S.housam * .78, { cap: CAPS[0], ang: u * TAU * 1.5 });
  }

  // ---------- callouts ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 12) continue;
      const a = A[l.speaker], s = S[l.speaker], c = { size: o.size || 50, maxW: o.maxW || 660, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const sx = a.mouth[0], right = o.side ? o.side(l.speaker) > 0 : sx < W * .5, mid = !o.side && sx > W * .38 && sx < W * .62;
        const dx = mid ? (sx < W / 2 ? 140 : -140) : (right ? 1 : -1) * (o.far || 360);
        callout(l.text, sx + (right ? 1.5 : -1.5) * s, a.mouth[1] - .6 * s, age, { ...c, dx: o.dx ?? dx, dy: o.dy ?? (mid ? -330 : -250) });
      } else {                                                               // off-screen: from the frame edge on their side
        const side = { housam: 0, alma: -1, safadi: 1 }[l.speaker] || (a ? Math.sign(a.mouth[0] - W / 2) : 0);
        const ex = side < 0 ? -30 : side > 0 ? W + 30 : W * .5, ey = side === 0 ? H + 40 : H * .42;
        callout(l.text, ex, ey, age, { ...c, dx: side < 0 ? 420 : side > 0 ? -420 : 0, dy: side === 0 ? -360 : -160 });
      }
    }
  }

  // ---------- cameras ----------
  const lock = (x, zc, f, feet, fz, y = 115) => ({ x, y, z: zc, f, hy: feet - y * f / (fz - zc), dir: 1 });
  // The sideline three-shot: [x, camera z, feet y]. Wide for the sprint, then tighter once Safadi sits.
  const THREE = [[15.9, [2440, 1650, 820]], [18.0, [2525, 2740, 1000]], [38.6, [2525, 2740, 1000]], [40.8, [2400, 2650, 1000]],
    [152.9, [2400, 2650, 1000]], [155.2, [2495, 2500, 990]]];
  function threeCam(t) {
    const [x, zc, feet] = kf(t, THREE);
    return lock(x + 12 * Math.sin(t * .21), zc + 10 * Math.sin(t * .13), 1500, feet, 3140);
  }
  const FRAME = { housam: { k: 4.9, fx: .36, feet: 1030 }, alma: { k: 5.9, fx: .36, feet: 1030 }, safadi: { k: 4.6, fx: .64, feet: 1040 } };
  function singleCam(t, who, over = {}) {
    const at = CAST[who].at(t), fr = { ...FRAME[who], ...over }, f = 2600;
    const k = fr.k * (1 + .025 * Math.sin(t * .4)), d = f / k, zc = at.z - d;
    return lock(at.x - (fr.fx * W - W / 2) / k, zc, f, fr.feet, at.z);
  }

  // ---------- shots ----------
  function three(t) {
    const { A, S } = group(t, threeCam(t), t < 18 ? .8 : 1.6);
    extras(t, A, S);
    bubbles(t, A, S);
  }
  function single(who, over = {}) {
    return t => {
      const o = typeof over === 'function' ? over(t) : over;
      const { A, S, P } = group(t, singleCam(t, who, o), 2.8);
      extras(t, A, S, who);
      bubbles(t, A, S, { size: 54, maxW: 700, far: 600, ...(o.bubble || {}) });
    };
  }
  // Things that ride on top of any sideline shot
  function extras(t, A, S, who) {
    const a = A.safadi, sS = S.safadi;
    if (A.housam) {
      const h = A.housam, s = S.housam;
      sfx('CRACK!', h.chest[0] - 7 * s, h.chest[1] - 3 * s, 64, PAL.goldLt, t - 38.0, { life: .6 });
      sfx('ZERO!', h.head[0] + 11 * s, h.head[1] + 4 * s, 110, '#8FE3FF', t - 90.0, { life: 1.6, rot: .08 });
      if (t > 108.3 && t < 110.4) for (let i = 0; i < 5; i++) {                // drips from the wrung jersey
        const ph = frac(t * 2.6 + i * .21), x = h.belly[0] + (i - 2) * .9 * s;
        circle(x, h.belly[1] + ph * 11 * s, .45 * s * (1 - ph * .4), { fill: '#8FD3FF', stroke: PAL.ink, lwPx: 1.2 });
      }
      sfx('YOINK!', h.head[0] - 6 * s, h.head[1] - 8 * s, 80, PAL.goldLt, t - YANK, { life: .7, rot: -.1 });
      sfx('PSSHT!', h.head[0] - 3 * s, h.head[1] - 12 * s, 58, '#8FE3FF', t - 158.6, { life: .6 });
    }
    if (a) {
      sfx('THUNK!', a.handL[0] - 3 * sS, a.handL[1] - 4 * sS, 80, '#FF9A6B', t - SLAM2, { life: .7 });
      sfx('SPLOSH!', a.belly[0] - 9 * sS, a.belly[1] + 1 * sS, 72, '#8FE3FF', t - SPLASH, { life: .8, rot: .06 });
      if (t > 144.8 && t < 148.4) ['tick', 'tock', 'tick', 'tock'].forEach((w, i) => sfx(w, a.head[0] + (i % 2 ? -8 : 8) * sS, a.top[1] - 2 * sS, 44, PAL.cream, t - (145.6 + i * .8), { life: .7 }));
      const heart = on(t, 56.9, 58.4, .15);
      if (heart > 0) {                                                       // ba-dump
        const beat = 1 + .25 * (kick(t, 57.0, 9) + kick(t, 57.5, 9)), hx = a.head[0] - 9 * sS, hy = a.head[1] - 2 * sS, r = 2.2 * sS * beat * heart;
        overlay(() => { X.save(); X.translate(hx, hy); X.scale(r, r); X.globalAlpha = heart;
          shape([[0, .9], [-1.1, -.1], [-1.05, -.75], [-.5, -1.05], [0, -.6], [.5, -1.05], [1.05, -.75], [1.1, -.1]], { fill: '#FF4F6E', stroke: PAL.ink, lwPx: 3, smooth: .5 }); X.restore(); });
        sfx('ba-DUMP', hx, hy - 3.6 * sS, 50, '#FFB3C0', t - 57.0, { life: .45 }); sfx('ba-DUMP', hx, hy - 3.6 * sS, 50, '#FFB3C0', t - 57.5, { life: .45 });
      }
      const sugar = on(t, 81.4, 84.3, .2);
      if (sugar > 0) safadiBoard(W * .43, H * .3, 560, seg(t, 81.4, 83.6) * sugar, t, { kind: 'crash', title: 'SUGAR!' });
      const plate = on(t, 117.9, 120.35, .2);
      if (plate > 0) safadiBoard(W * .43, H * .3, 560, seg(t, 117.9, 119.9) * plate, t, { kind: 'plate', title: 'A REAL MEAL' });
    }
    // the sponsor banner
    const sp = on(t, 128.5, YANK, .3);
    if (sp > 0) overlay(() => {
      const x = lerp(-900, 90, easeOut(seg(t, 128.5, 128.9))) + (t > YANK - .3 ? -1200 * easeIn(seg(t, YANK - .3, YANK)) : 0), y = H - 250;
      X.save(); X.translate(x, y); X.rotate(-.02);
      shape(rectPts(0, 0, 900, 170), { fill: linGrad(0, 0, 900, 0, [[0, '#1BA3C6'], [1, '#3BD6C6']]), stroke: PAL.ink, lwPx: 5 });
      shape(rectPts(18, -34, 190, 50), { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 4 });
      X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillStyle = PAL.ink; X.font = `700 30px ${FONT_TALK}`; X.fillText('SPONSOR', 38, -9);
      X.font = `88px ${FONT_SFX}`; X.lineJoin = 'round'; X.lineWidth = 12; X.strokeStyle = PAL.ink; X.strokeText('3-DOLPHINS', 30, 72); X.fillStyle = '#FFFDF4'; X.fillText('3-DOLPHINS', 30, 72);
      X.font = `600 30px ${FONT_TALK}`; X.fillStyle = '#0D3B4A'; X.fillText('The best 3-D printing company in the world!', 32, 138);
      for (let i = 0; i < 5; i++) { const k = Math.abs(Math.sin(t * 3 + i * 1.3)); shape(starPts(560 + i * 70, 40 + (i % 2) * 40, 12 * k + 4, .45, 4), { fill: '#FFF6C8', stroke: null }); }
      X.restore();
    });
  }

  // The scoreboard: full time, 3–2
  function board(t) {
    const f = 1500, z = lerp(9300, 9380, seg(t, 0, 3.2)), P = persp({ x: 2100, y: 560, z, f, hy: 545 - 10 * f / (10500 - z), dir: 1 });
    F.back(P, t, { ...O_BASE, cheer: on(t, .8, 3.4, .4) });
    const [bx, by, k] = P.p(2100, 700, 10482);
    sfx('FWEEEET!', bx - 220, by - 40, 120, '#FFFDF4', t - .7, { life: 1.6, rot: -.08 });
    sfx('FULL TIME!', bx + 60, by + 360, 90, PAL.goldLt, t - 1.2, { life: 2.2, rot: .05 });
  }
  // Midfield: the two winners, done in
  function midfield(t) {
    const zc = 3930 - 40 * seg(t, 3.2, 11), cam = lock(2230 + 10 * Math.sin(t * .3), zc, 1600, 975, 4420);
    const { A, S } = group(t, cam, 1.2, { set: { cheer: on(t, 3.2, 6, .6) * .6 } });
    if (A.housam) sfx('!', A.housam.head[0], A.housam.top[1] - 60, 90, PAL.goldLt, t - 9.7, { life: .7 });
    bubbles(t, A, S, { size: 52 });
    if (t > 14.8) {                                                          // dust as they blast off
      for (const n of ['housam', 'alma']) { const a = A[n], s = S[n]; if (!a) continue; const k = seg(t, 15.1, 15.9);
        for (let i = 0; i < 4; i++) circle(a.footL[0] + (i - 1.5) * 2 * s, a.footL[1] - k * 2 * s, (1 + k * 1.6) * s, { fill: `rgba(230,220,200,${.6 * (1 - k)})`, stroke: null }); }
    }
  }
  // The secret swap, glimpsed: Safadi shuts the lid, pats it and strolls off whistling. The kids are far behind.
  function coolerInsert(t) {
    const cam = lock(2600 + 20 * Math.sin(t * .3), 2800 - 25 * seg(t, 11, 14.2), 1500, 900, 3175, 72);
    const { A, S } = group(t, cam, .3);
    if (A.safadi) sfx('pat pat', A.safadi.handL[0] + 60, A.safadi.handL[1] - 30, 46, PAL.cream, t - 12.0, { life: .8 });
  }
  // Title card over a soft three-shot
  function title(t) {
    layer(() => { group(t, threeCam(t), 0); }, { blur: 12, filter: 'saturate(.8) brightness(.8)' });
    overlay(() => {
      X.save();
      X.globalAlpha = .75 * on(t, 43.6, 46.4, .2); X.fillStyle = '#12304A'; X.fillRect(0, 0, W, H);
      X.globalAlpha = .18 * on(t, 43.6, 46.4, .2); X.translate(W / 2, H / 2); X.rotate(t * .15);
      for (let i = 0; i < 16; i++) { X.rotate(TAU / 16); X.fillStyle = i % 2 ? '#3BD6C6' : '#FFD66B'; X.beginPath(); X.moveTo(0, 0); X.lineTo(1400, -170); X.lineTo(1400, 170); X.fill(); }
      X.restore();
      const words = [['THE GREAT', 43.7, 300, 110, '#FFFDF4'], ['HYDRATION', 43.95, 500, 210, '#3BD6C6'], ['DEBATE', 44.1, 720, 190, PAL.goldLt]];
      for (const [txt, t0, y, size, col] of words) {
        const k = backOut(seg(t, t0, t0 + .3)) * (1 - easeIn(seg(t, 46.1, 46.4))); if (k <= 0) continue;
        X.save(); X.translate(W / 2, y); X.scale(k, k); X.rotate(-.04); X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
        X.lineJoin = 'round'; X.lineWidth = size * .16; X.strokeStyle = PAL.ink; X.strokeText(txt, 0, 0); X.fillStyle = PAL.ink; X.fillText(txt, size * .05, size * .06); X.fillStyle = col; X.fillText(txt, 0, 0);
        X.restore();
      }
    });
  }
  // A dreamy border for the imagined cutaways
  function dreamFrame(t, t0, t1) {
    const k = on(t, t0, t1, .3);
    overlay(() => {
      X.save(); X.globalAlpha = k;
      X.fillStyle = radGrad(W / 2, H / 2, H * .45, W * .62, [[0, 'rgba(255,255,255,0)'], [1, 'rgba(235,245,255,.95)']]); X.fillRect(0, 0, W, H);
      for (let i = 0; i < 40; i++) {
        const a = i / 40 * TAU + t * .05, rx = W * .56, ry = H * .6, r = 90 + 40 * hash(i);
        circle(W / 2 + Math.cos(a) * rx, H / 2 + Math.sin(a) * ry, r, { fill: '#F4F9FF', stroke: null });
      }
      X.restore();
    });
  }
  // Alma's picture: one sip and Housam is a rocket. Shot from behind the north goal, looking back down the pitch.
  const DG = { z0: 6500, z1: 7750, run: [74.0, 76.2], kick: 76.4, goal: 76.95 };
  function dreamGoal(t) {
    const hz = lerp(DG.z0, DG.z1, ease(seg(t, DG.run[0], DG.run[1]))), zc = 9560;
    const f = 3.0 * (zc - hz) * (1 + .15 * ease(seg(t, 73.9, 76.4))), P = persp({ x: 20 * Math.sin(t * .5), y: 150, z: zc, f, hy: 930 - 150 * f / (zc - hz), dir: -1 });
    const cheer = on(t, DG.goal, 79, .3);
    layer(() => F.back(P, t, { ...O_BASE, cheer: cheer, splitZ: hz, crowd: .8 }), { blur: 1, filter: 'saturate(1.25) brightness(1.06)' });
    const [sx, sy, k] = P.p(0, 0, hz), s = HU * k, p = (hz - DG.z0) / 44;
    const kicking = on(t, DG.kick - .2, DG.kick + .5, .1);
    let o = { ...housamDribble(p, 1.5), handL: [-4.8, -14], handR: [4.8, -12], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: 'grin', lookY: .3, lean: -.12, t };
    if (kicking > 0) o = { ...o, footR: [4.7, -3.7], footL: [-1.75, -1.05], handL: [-5, -14.5], handR: [4.7, -15.4], lean: -.15, rot: -.035 };
    if (t > DG.goal) o = { ...o, ...H_REST, handL: [-5.2, -24], handR: [5.2, -24], handPoseL: 'fist', handPoseR: 'fist', jump: 3 * Math.abs(Math.sin((t - DG.goal) * 5)), eyes: 'happy', mouth: 'open', lean: 0, rot: 0 };
    // zoom lines behind him
    if (t < DG.kick) overlay(() => { X.save(); X.globalAlpha = .5; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + hash(i) * .2, r0 = 260 + 60 * hash(i + 3), r1 = 1300; line([[sx + Math.cos(a) * r0, sy - 16 * s + Math.sin(a) * r0], [sx + Math.cos(a) * r1, sy - 16 * s + Math.sin(a) * r1]], { stroke: '#FFFFFF', lwPx: 3 + 3 * hash(i + 7) }); } X.restore(); });
    const A = housam(sx, sy, s, o);
    // the ball: at his feet, then a rocket into the top corner (+X is screen-left from here)
    let bw;
    if (t < DG.kick) { const q = Math.sin(p * Math.PI); housamBall(sx + (2.9 + .6 * q) * s, sy - 1.4 * s, s, { radius: 1.8, spin: t * 12 }); }
    else if (t < DG.goal) { const u = seg(t, DG.kick, DG.goal); bw = [lerp(15, 70, u), lerp(10, 160, u) + 60 * Math.sin(Math.PI * u), lerp(DG.z1 + 40, 9080, u)]; }
    else { const u = seg(t, DG.goal, DG.goal + .5); bw = [70, lerp(160, 10, u * u), 9140]; }
    if (bw) { const [bx, by, bk] = P.p(...bw); housamBall(bx, by, HU * bk, { radius: 1.8, spin: t * 14 }); }
    F.front(P, t, { ...O_BASE, cheer, splitZ: hz });
    sfx('ZOOM!', sx + 20 * s, sy - 30 * s, 110, PAL.goldLt, t - 74.3, { life: 1.2, rot: .1 });
    sfx('GOAL!', W * .5, H * .3, 190, PAL.goldLt, t - DG.goal, { life: 1.4 });
    flash(.4 * kick(t, DG.goal, 6));
    bubbles(t, { housam: A }, { housam: s });
    dreamFrame(t, 73.9, 78.4);
  }
  // Housam's warning: a giant sandwich, a jog, a green face. Cut before anything happens.
  function dreamMeal(t) {
    const zc = 3900, hz = 4500, P = persp(lock(-120, zc, 2400, 1030, hz));
    layer(() => F.back(P, t, { ...O_BASE, splitZ: hz }), { blur: 2.5, filter: 'saturate(1.2)' });
    const [sx, sy, k] = P.p(0, 0, hz), s = HU * k;
    const eat = on(t, 122.8, 123.45, .1), jog = t > 123.5 ? seg(t, 123.5, 124.05) : 0, sick = ease(seg(t, 124.0, 124.4));
    let o = { ...H_REST, brows: 'up', mouth: 'grin', t };
    if (eat > 0) Object.assign(o, { handL: [-2.2, -19.5], handR: [2.2, -19.5], handPoseL: 'fist', handPoseR: 'fist', mouth: t > 123.25 ? 'flat' : 'open', eyes: t > 123.25 ? 'happy' : 'wide' });
    if (t > 123.45) Object.assign(o, { blush: 1.4, mouth: 'flat' });
    if (jog > 0 && sick < .5) Object.assign(o, housamDribble(t * 6, 1), { brows: 'focused' });
    if (sick > 0) Object.assign(o, { handL: mix(o.handL, [-1.0, -21.6], sick), handR: mix(o.handR, [1.0, -21.6], sick), handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', brows: 'worried', mouth: 'o', dy: .6 * sick, sq: .1 * boing(t, 124.3, 3, 5) });
    const A = housam(sx, sy, s, o);
    if (sick > 0) overlay(() => { X.save(); X.globalAlpha = .55 * sick; X.globalCompositeOperation = 'source-over'; ellipse(A.head[0], A.head[1] + 2 * s, 4.4 * s, 3.2 * s, { fill: '#7CC96A', stroke: null }); X.restore(); });
    if (eat > 0) {                                                           // the sandwich, bitten down
      const bites = t > 123.25 ? 1 : 0, cx = (A.handL[0] + A.handR[0]) / 2, cy = A.handL[1] - 1.2 * s, w = (7 - 2.5 * bites) * s;
      [['#E7B96A', 1.2], ['#6DBE45', .5], ['#C0392B', .6], ['#F4D35E', .5], ['#8B4A2B', .9], ['#E7B96A', 1.2]].reduce((y, [col, hgt]) => { shape(rectPts(cx - w / 2, y - hgt * s, w, hgt * s), { fill: col, stroke: PAL.ink, lwPx: 2.5, smooth: .3 }); return y - hgt * s; }, cy + 2.5 * s);
    }
    sfx('CHOMP!', A.head[0] + 9 * s, A.head[1] - 6 * s, 90, PAL.goldLt, t - 123.3, { life: .7 });
    sfx('URP!', A.head[0] - 9 * s, A.head[1] - 7 * s, 110, '#9BE07A', t - 124.3, { life: .8, rot: -.1 });
    dreamFrame(t, 122.8, 125.0);
  }
  // Close-up: the bottle turns round. The sticker.
  function label(t) {
    layer(() => group(t, singleCam(t, 'housam', { k: 7 }), 0), { blur: 14, filter: 'brightness(.9)' });
    const spin = seg(t, 172.6, 173.2), turn = Math.cos(Math.PI * spin), side = spin > .5 ? 'sticker' : 'front';
    const y = H * .52 + 10 * Math.sin(t * 1.3), s = 120 * (1 + .04 * seg(t, 171.8, 175.6));
    overlay(() => {
      bottle(W * .5, y, s, { cap: CAPS[1], open: true, side, turn: Math.abs(turn) < .04 ? .04 : Math.abs(turn), ang: .03 * Math.sin(t) });
      if (t > 173.3) {                                                      // the sticker, readable
        const k = backOut(seg(t, 173.3, 173.65));
        X.save(); X.translate(W * .5 + 520, H * .44); X.scale(k, k); X.rotate(.03);
        shape(rectPts(-380, -180, 760, 360), { fill: '#FFFDF4', stroke: PAL.ink, lwPx: 6 });
        X.textAlign = 'center'; X.textBaseline = 'middle';
        X.font = `72px ${FONT_SFX}`; X.fillStyle = PAL.crimson; X.fillText('SAFADI ENERGY DRINK', 0, -95, 700);
        X.font = `700 50px ${FONT_TALK}`; X.fillStyle = '#6B4A2B'; X.fillText('100% Unsweetened Tea', 0, 5);
        X.font = `700 44px ${FONT_TALK}`; X.fillStyle = PAL.ink; X.fillText('0 Sugar · 0 Fun', 0, 95);
        X.restore();
      }
    });
    sfx('!!', W * .5 - 330, H * .25, 120, PAL.goldLt, t - 173.3, { life: .9 });
  }
  // Scene 4: sipping on the cooler, Safadi strolls off with his thermos
  function finale(t) {
    const zc = 2560, P = persp(lock(2720 + 30 * seg(t, 192, 200), zc, 1450, 960, 3100, 130));
    layer(() => F.back(P, t, { ...O_BASE, splitZ: 3060 }), { blur: .8 });
    cooler(P, t);
    const seat = COOL.h + COOL.lid;
    const sip = t0 => on(t, t0, t0 + 1.3, .25), sp = Math.max(sip(192.4), sip(195.2)), sour = Math.max(on(t, 193.0, 194.4, .15), on(t, 195.8, 197.2, .15));
    // Alma: on the left of the lid, legs dangling
    {
      const [x, y, k] = P.p(COOL.x - 22, seat - 21, SEAT_Z), s = AU * k;
      const A = alma(x, y, s, { t, footL: [-1.2, .6], footR: [1.2, .8 + .4 * Math.sin(t * 2)], handL: [-2.6, -7.2], handR: mix([3.4, -8.6], [1.0, -12.2], sp), handPoseL: 'fist', handPoseR: 'fist',
        tilt: .12 * sp, eyes: sour > .3 ? 'squeeze' : sp > .5 ? 'closed' : 'open', mouth: sour > .3 ? 'wobble' : sp > .5 ? 'o' : 'frown', brows: 'worried', lookX: .6, lookY: .3, noShadow: true });
      bottle(A.handR[0], A.handR[1] - 1.2 * s * .78, s * .78, { cap: CAPS[0], open: true, ang: -(-.1 + 2.2 * sp) });
    }
    // Housam: beside her, knees out
    {
      const [x, y, k] = P.p(COOL.x + 20, 0, SEAT_Z - 4), s = HU * k, sp2 = Math.max(sip(193.0), sip(195.6)), sour2 = Math.max(on(t, 193.6, 195.0, .15), on(t, 196.4, 197.8, .15));
      const A = housam(x, y, s, { t, dy: 1.2, footL: [-3.2, -1.05], footR: [3.2, -1.05], handR: [2.9, -8.2], handPoseR: 'fist', handL: mix([-3.4, -9.5], [-1.3, -21.8], sp2), handPoseL: 'fist',
        tilt: -.12 * sp2, eyes: sour2 > .3 ? 'squeeze' : sp2 > .5 ? 'closed' : 'open', mouth: sour2 > .3 ? 'wobble' : sp2 > .5 ? 'o' : 'frown', brows: 'worried', lookX: .7, lookY: .2 });
      bottle(A.handL[0], A.handL[1] - 1.2 * s * .78, s * .78, { cap: CAPS[1], open: true, ang: 2.2 * sp2 - .1 });
    }
    // Safadi: strolling away (deeper and to the right), thermos in hand, chuckling
    {
      const u = seg(t, 192.2, 199.5), wx = lerp(2860, 3120, u), wz = lerp(3170, 3700, u), [x, y, k] = P.p(wx, 0, wz), s = SU * k, laugh = Math.abs(Math.sin(t * 12)) * on(t, 193.9, 195.8, .2);
      const A = safadi(x, y, s, { t, ...safadiWalk(Math.hypot(wx - 2860, wz - 3170) / 58, 1), turn: .4, lookX: .6, handR: [5.0, -10.6], handPoseR: 'fist', eyes: laugh > .1 ? 'squeeze' : 'happy', mouth: laugh > .5 ? 'open' : 'grin', dy: .25 * laugh, emote: 'music', emoteK: on(t, 196, 199.5, .3) });
      const tx = A.handR[0], ty = A.handR[1] - 2.2 * s;                    // the thermos
      shape(rectPts(tx - 1.1 * s, ty - 2.6 * s, 2.2 * s, 5.2 * s), { fill: '#C3222F', stroke: PAL.ink, lwPx: 2.5, smooth: .2 });
      shape(rectPts(tx - 1.2 * s, ty - 3.4 * s, 2.4 * s, 1.0 * s), { fill: '#D9DDE3', stroke: PAL.ink, lwPx: 2.5 });
      sfx('heh heh heh', A.head[0] + 6 * s, A.top[1] - 2 * s, 46, PAL.cream, t - 194.0, { life: 1.8 });
    }
    F.front(P, t, { ...O_BASE, splitZ: 3060 });
    sfx('slurp...', W * .43, H * .42, 50, PAL.cream, t - 192.7, { life: 1 });
    sfx('bleh.', W * .47, H * .38, 56, '#9BE07A', t - 196.4, { life: 1 });
    iris(W * .47, H * .62, lerp(1500, 0, easeIn(seg(t, 198.3, 199.8))));
  }

  // The toast, the gulp, the freeze, the crumple: a kids-only two-shot
  function toast(t) {
    const { A, S } = group(t, lock(2352 + 8 * Math.sin(t * .5), 2600 + 30 * seg(t, 158.4, 165), 2600, 1035, 3140), 2.4);
    extras(t, A, S);
    if (A.housam && A.alma) {
      const mx = (A.housam.handL[0] + A.alma.handR[0]) / 2, my = Math.min(A.housam.handL[1], A.alma.handR[1]) - 90;
      sfx('CLINK!', mx, my - 60, 90, PAL.goldLt, t - CLINK, { life: .7 });
      sfx('glug glug', mx, my - 150, 60, PAL.cream, t - 162.6, { life: .8 });
      sfx('BLEGH!', mx, my - 80, 120, '#9BE07A', t - CRUMPLE, { life: .9, rot: .06 });
    }
    bubbles(t, A, S, { size: 54, maxW: 700, far: 420 });
  }
  const hou = single('housam'), alm = single('alma'), saf = single('safadi');
  const safHeart = single('safadi', t => ({ k: 4.6 * lerp(1, 1.45, ease(seg(t, 56.9, 57.4)) * (1 - ease(seg(t, 58.3, 59.2)))) }));
  const safBoard = single('safadi', { k: 5.4, fx: .8, bubble: { dx: -400, dy: -230 } });
  const houSponsor = single('housam', { k: 5.6, fx: .52, feet: 1060 });

  scene({ duration: 200, fps: 24, bpm: 112,                 // id, title, dialogue, music: see asset.js
    shots: [
      [0, board], [3.2, midfield], [11.0, coolerInsert], [14.2, midfield], [15.9, three],
      [21.9, saf], [25.0, hou], [30.1, alm], [32.6, saf], [37.4, three], [43.6, title],
      [46.4, hou], [48.8, saf], [51.0, hou], [56.0, three], [56.9, safHeart], [63.9, alm], [66.5, saf], [68.5, alm], [73.9, dreamGoal],
      [78.4, three], [81.2, safBoard], [84.1, hou], [87.1, alm], [89.6, hou], [91.9, alm], [95.3, saf],
      [97.2, hou], [99.8, three], [104.9, alm], [107.6, three], [110.9, saf], [112.9, alm], [115.45, hou],
      [117.7, safBoard], [120.2, hou], [122.8, dreamMeal], [125.0, three], [128.3, houSponsor], [134.3, three],
      [138.1, alm], [143.3, three], [148.6, saf], [151.4, three], [158.4, toast], [163.4, saf], [164.2, toast], [165.0, hou], [166.5, alm], [169.2, hou], [171.8, label],
      [175.6, three], [178.7, alm], [180.8, saf], [186.8, hou], [189.3, saf], [192.2, finale],
    ] });
})();
