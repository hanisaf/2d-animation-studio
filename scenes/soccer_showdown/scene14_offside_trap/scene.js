// Scene 14: "The Offside Trap". The first half of Kids vs. Adults at the county soccer field. The Kids defend the south
// goal (Alma) and attack north; the Adults defend the north goal (Sami) and Safadi never comes back, so every forward pass
// to a kid in the Adults' half is offside. Danny scores (offside), Alma saves, Housam's bicycle kick (offside), "WHY???",
// Fester explains Safadi-style, Safadi cuts him off, half-time 0–0.
// Everyone moves on world-space paths (PATHS) and the ball on BALL segments; every shot films its action from the side the
// players face (rigs always face the camera). Every shot is a pure function of t.
(() => {
  const F = LOCATIONS.soccer_field, LINES = ASSETS.scene.scene14_offside_trap.dialogue;
  const O_BASE = { crowd: .45, score: [0, 0], home: 'KIDS', guest: 'ADULTS' };
  const ACCENT = { safadi: PAL.crimson, sami: '#2E9E6B', housam: '#3766BD', alma: '#994EC4', jenna: '#D0508E', danny: '#3B6FB0', jester_fester: PAL.crimson };
  const HEADW = { safadi: 6.6, sami: 6.6, alma: 6.8, housam: 3.6, jenna: 4.2, danny: 4.6, jester_fester: 3.9 };
  const R = 10;                                                              // ball radius, world units
  // key moments
  const KICKOFF = 18.0, PASS1 = 21.8, LUNGE = 22.2, SHOT1 = 26.9, GOAL1 = 27.6, WHISTLE1 = 31.2;
  const LONG = 41.0, STUMBLE = 44.5, SHOT2 = 47.3, SAVE = 47.85;
  const ROLL = 53.6, CART = [54.4, 55.8], PASS3 = 55.9, PASS4 = 57.6, FLICK = 58.6, FLIP = [58.9, 59.6], VOLLEY = 59.25, GOAL2 = 59.9, WHISTLE2 = 62.6;
  const BOARD_ON = 69.9, ZOOM_IN = 89.8, BOARD_POP = 90.0, HALF = 97.0, FREEZE = 99.6;

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const mix = (a, b, k) => mixPt(a, b, clamp(k));
  const inAny = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
  function lastSpeaker(t, not) {
    let who = null;
    for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker;
    return who;
  }

  // ---------- where everyone is: [t, x, z] keys, linear between them; a repeated time is a cut (teleport) ----------
  function path(t, keys) {
    let p = 0;
    if (t <= keys[0][0]) return { x: keys[0][1], z: keys[0][2], p: 0, moving: 0, speed: 0 };
    for (let i = 1; i < keys.length; i++) {
      const [t0, x0, z0] = keys[i - 1], [t1, x1, z1] = keys[i], d = t1 > t0 ? Math.hypot(x1 - x0, z1 - z0) : 0;
      if (t < t1) { const u = (t - t0) / (t1 - t0); return { x: lerp(x0, x1, u), z: lerp(z0, z1, u), p: p + d * u, moving: d > 1 ? 1 : 0, speed: d / (t1 - t0), dz: Math.sign(z1 - z0) }; }
      p += d;
    }
    const k = keys[keys.length - 1]; return { x: k[1], z: k[2], p, moving: 0, speed: 0 };
  }
  const PATHS = {
    housam: [[0, -60, 4430], [18.4, -60, 4430], [PASS1, -20, 4985], [27.4, -200, 7400], [53.5, -200, 7400], [53.5, -150, 6700], [57.6, -80, 7880],
      [60.2, -80, 7880], [62.6, -80, 7880], [62.6, 220, 7400]],
    danny: [[0, 260, 4380], [20.0, 260, 4380], [22.8, 240, 5750], [26.8, 120, 7800], [53.5, 120, 7800], [53.5, 300, 4200], [56.6, 300, 4200],
      [57.5, 260, 5300], [60.2, 260, 5300], [60.2, 150, 7650], [62.6, 150, 7650], [62.6, 380, 7380]],
    jenna: [[0, -250, 3900], [27.0, -250, 3900], [27.0, -150, 6500], [29.0, -60, 7520], [40.6, -60, 7520], [40.6, -260, 2600], [44.0, -260, 2600],
      [44.4, -30, 2640], [53.5, -30, 2640], [53.5, -300, 1700], [CART[0], -300, 1700], [CART[1], -260, 3000], [60.2, -260, 3000], [60.2, -300, 7420],
      [62.6, -300, 7420], [62.6, 540, 7410]],
    alma: [[0, 0, 90], [47.55, 0, 90], [47.9, -270, 105], [49.4, -260, 110], [50.3, -120, 90], [62.6, -120, 90], [62.6, 700, 7380]],
    safadi: [[0, 60, 5000], [14.0, 60, 5000], [15.4, 450, 4700], [18.6, 450, 4700], [21.9, -10, 5080], [LUNGE, 70, 5170], [42.3, 70, 5170],
      [44.2, 60, 2700], [44.8, -20, 2560], [46.9, 60, 1550], [ZOOM_IN, 60, 1550], [ZOOM_IN, -10, 7505]],
    sami: [[0, 200, 5020], [14.05, 200, 5020], [24.0, -330, 8880], [40.6, -330, 8880], [40.6, -300, 8870], [53.0, -300, 8870], [53.0, -20, 8900],
      [59.3, -20, 8900], [59.7, -360, 8900]],
    jester_fester: [[0, -180, 4560], [18.6, -180, 4560], [27.0, -300, 6900], [WHISTLE1 + .4, -300, 6900], [33.0, -420, 7380], [40.6, -420, 7380],
      [40.6, -500, 3600], [53.5, -500, 3600], [58.5, -350, 6900], [WHISTLE2 + .3, -350, 6900], [63.8, -200, 7520]],
  };
  const AT = n => t => path(t, PATHS[n]);

  // ---------- the ball: segments in time order ----------
  // { t0, at } rests · { t0, t1, feet: who } dribbled · { t0, t1, to, arc } a pass / shot from wherever it was · { t0, hold: who }
  const BALL = [
    { t0: 0, at: [0, R, 4500] },
    { t0: KICKOFF, t1: 18.4, to: [-42, R, 4470], arc: 4 },
    { t0: 18.4, t1: PASS1, feet: 'housam' },
    { t0: PASS1, t1: 22.8, to: [258, R, 5790], arc: 20 },
    { t0: 22.8, t1: 26.8, feet: 'danny' },
    { t0: SHOT1, t1: GOAL1, to: [-200, R, 9010], arc: 25 },
    { t0: GOAL1, t1: 28.0, to: [-215, R, 9120], arc: 6 },
    { t0: 40.6, at: [-250, R, 8835] },
    { t0: LONG, t1: 42.3, to: [70, R, 5130], arc: 900 },
    { t0: 42.3, t1: 46.9, feet: 'safadi', dz: -1 },
    { t0: SHOT2, t1: SAVE, to: [-300, 150, 30], arc: 50 },
    { t0: SAVE, t1: 48.7, to: [-1500, R, 500], arc: 160 },
    { t0: 53.3, hold: 'alma' },
    { t0: ROLL, t1: CART[0], to: [-285, R, 1740], arc: 0 },
    { t0: CART[0], t1: CART[1], feet: 'jenna' },
    { t0: PASS3, t1: 56.6, to: [318, R, 4240], arc: 40 },
    { t0: 56.6, t1: 57.5, feet: 'danny' },
    { t0: PASS4, t1: 58.5, to: [-62, R, 7855], arc: 50 },
    { t0: FLICK, t1: VOLLEY, to: [-80, 150, 7880], arc: 60 },
    { t0: VOLLEY, t1: 59.7, to: [250, 200, 9010], arc: 20 },
    { t0: 59.7, t1: 60.1, to: [262, R, 9130], arc: 10 },
  ];
  function ballAt(t) {
    let i = -1; for (let j = 0; j < BALL.length; j++) if (BALL[j].t0 <= t) i = j;
    if (i < 0) return BALL[0].at;
    const b = BALL[i];
    if (b.at) return b.at;
    if (b.hold) return { hold: b.hold };
    const tt = Math.min(t, b.t1 ?? t);
    if (b.feet) {
      const a = AT(b.feet)(tt), dz = b.dz ?? (a.dz || 1), touch = Math.abs(Math.sin(a.p / 40 * Math.PI));
      return [a.x + 16, R + 4 * touch, a.z + dz * (32 + 22 * touch)];
    }
    const from = ballAt(b.t0 - 1e-4), f = from.hold ? [-120, R, 140] : from, u = seg(tt, b.t0, b.t1);
    return [lerp(f[0], b.to[0], u), lerp(f[1], b.to[1], u) + b.arc * 4 * u * (1 - u), lerp(f[2], b.to[2], u)];
  }

  // ---------- props ----------
  function gloves(A, s) {                                                     // Alma's big green goalkeeper gloves
    for (const h of ['handL', 'handR']) { const [x, y] = A[h];
      shape(ellPts(x, y, 1.25 * s, 1.1 * s, 18), { fill: '#5BD16A', stroke: PAL.ink, lwPx: Math.max(1.5, .2 * s), smooth: true });
      line([[x - .8 * s, y + .35 * s], [x + .8 * s, y + .35 * s]], { stroke: '#2E8B3E', lwPx: Math.max(1.2, .18 * s) }); }
  }
  function whistleProp(A, s, blow) {
    const nx = A.head[0], ny = A.head[1] + 3.2 * s, [hx, hy] = A.handR;
    line([[nx - 1.2 * s, ny], [lerp(nx, hx, .5), Math.max(ny, hy) + 1.2 * s], [hx, hy]], { stroke: '#E0423A', lwPx: Math.max(1.5, .22 * s), smooth: true });
    X.save(); X.translate(hx + (blow ? -.2 : .2) * s, hy - .5 * s); X.rotate(blow ? -.5 : .3); X.scale(s, s);
    shape(rectPts(-.2, -.45, 1.5, .9), { fill: '#D7DDE6', stroke: PAL.ink, lwPx: 2, smooth: .3 });
    circle(-.25, .25, .65, { fill: '#C3CAD5', stroke: PAL.ink, lwPx: 2 });
    X.restore();
  }
  function noseBubble(A, s, t, k) {                                           // Sami's snooze bubble
    if (k <= 0) return;
    const r = (.5 + 1.1 * (.5 + .5 * Math.sin(t * 2.2))) * s * k, x = A.head[0] + .8 * s + r * .8, y = A.mouth[1] - 1.6 * s;
    circle(x, y, r, { fill: 'rgba(190,230,255,.55)', stroke: 'rgba(80,140,190,.8)', lwPx: 2 });
    circle(x - r * .35, y - r * .35, r * .22, { fill: 'rgba(255,255,255,.85)', stroke: null });
  }
  function zzz(x, y, s, t, k) {
    if (k < .01) return;
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .6 + i / 3), size = (24 + 22 * ph) * Math.max(.5, s / 5);
      overlay(() => { X.save(); X.globalAlpha = k * (1 - ph); X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
        X.lineJoin = 'round'; X.lineWidth = size * .18; X.strokeStyle = PAL.ink; const zx = x + (ph * 3 + i * .4) * s, zy = y - ph * 6 * s;
        X.strokeText('z', zx, zy); X.fillStyle = '#CFE6FF'; X.fillText('z', zx, zy); X.restore(); });
    }
  }
  function speedLines(A, s, k, dirX = 1) {                                    // behind a sprinter
    if (k <= 0) return;
    overlay(() => { X.save(); X.globalAlpha = .55 * k;
      for (let i = 0; i < 6; i++) { const y = A.chest[1] + (i - 2.5) * 2.6 * s + jit(3), x0 = A.chest[0] - dirX * (5 + 2 * hash(i)) * s;
        line([[x0, y], [x0 - dirX * (6 + 5 * hash(i + 9)) * s, y]], { stroke: '#FFFFFF', lwPx: Math.max(2, .35 * s) }); }
      X.restore(); });
  }
  function dust(x, y, s, t, t0) {                                             // a puff where someone lands or skids
    const u = seg(t, t0, t0 + .7); if (u <= 0 || u >= 1) return;
    for (let i = 0; i < 5; i++) circle(x + (i - 2) * 2.2 * s * (1 + u), y - u * 2 * s - hash(i) * s, (1.2 + 2.2 * u) * s, { fill: `rgba(235,225,205,${.7 * (1 - u)})`, stroke: null });
  }
  function spin(t0, t1, turns, t) { return turns * TAU * ease(seg(t, t0, t1)); }

  // ---------- poses ----------
  // ctx: { look(name) → lookX toward that character's screen position, ball → lookX toward the ball, dir: camera direction }
  function base(name, t, ctx, rest) {
    const talk = speaking(name, t), ls = lastSpeaker(t, name);
    const o = { ...rest, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']), lookX: ls ? ctx.look(ls) : 0, lookY: 0 };
    o.turn = .15 * Math.sign(o.lookX);
    if (inAny(t, [[KICKOFF, WHISTLE1], [LONG, 49], [53.3, 60.2]])) { o.lookX = ctx.ball; o.turn = .15 * Math.sign(ctx.ball); o.lookY = .2; }
    return { o, talk };
  }
  const tos = o => (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
  const celebrate = (t, t0, o, arms) => { const j = Math.abs(Math.sin((t - t0) * 6)); Object.assign(o, arms, { jump: 2.2 * j, eyes: 'happy', mouth: 'open' }); };

  function housamPose(t, ctx) {
    const at = AT('housam')(t), { o, talk } = base('housam', t, ctx, { footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7], handPoseL: 'open', handPoseR: 'open', brows: 'normal' });
    const to = tos(o), up = { handL: [-5.2, -24], handR: [5.2, -24], handPoseL: 'fist', handPoseR: 'fist' };
    if (at.moving) Object.assign(o, housamDribble(at.p / 44, Math.min(1.4, at.speed / 300)), { brows: 'focused', mouth: talk ? o.mouth : 'grin' });
    if (t > 14 && t < KICKOFF) Object.assign(o, { dy: .7, handL: [-4.6, -12], handR: [4.6, -12], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: talk ? o.mouth : 'smirk' });
    const pass = on(t, PASS1 - .25, PASS1 + .2, .1);
    if (pass > 0) o.footR = mix(o.footR, [3.6, -3.4], pass);
    const tc = Math.min(t, WHISTLE1);                                         // celebrating… frozen by the whistle
    if (t > GOAL1 + .2 && t < 36) { celebrate(tc, GOAL1, o, up); if (t > WHISTLE1 + .5) Object.assign(o, { jump: 0, handL: [-4.05, -10.7], handR: [4.05, -10.7], eyes: t < 34.6 ? 'open' : 'wide', mouth: t < 34.4 ? 'o' : 'frown', brows: 'worried', lookX: ctx.look('jester_fester') }); }
    // the bicycle kick
    if (t > 58.3 && t < FLIP[0]) { o.lookY = -.5; o.brows = 'focused'; o.footR = mix(o.footR, [2.8, -4.8], on(t, FLICK - .15, FLICK + .2, .08)); }
    if (t >= FLIP[0] && t < FLIP[1] + .2) {
      const u = seg(t, FLIP[0], FLIP[1]);
      Object.assign(o, { handL: [-5.4, -20], handR: [5.4, -20], handPoseL: 'open', handPoseR: 'open', eyes: 'squeeze', mouth: 'grin', brows: 'focused',
        footL: [-1.4, -5 + 3 * u], footR: u > .35 && u < .65 ? [2.8, -16] : [1.5, -6], jump: 13 * Math.sin(Math.PI * u) });
      if (t >= FLIP[1]) Object.assign(o, { jump: 0, sq: .15 * boing(t, FLIP[1], 3, 5), dy: 1.2, footL: [-2.4, -1.05], footR: [2.4, -1.05], handL: [-5, -14], handR: [5, -14], eyes: 'open' });
    }
    const tc2 = Math.min(t, WHISTLE2);
    if (t > 60.2 && t < 62.9) celebrate(tc2, 60.2, o, up);
    if (t > 62.9 && t < 65.0) Object.assign(o, { mouth: t > 63.2 ? 'frown' : 'o', brows: 'worried', eyes: 'wide' });
    if (t > 65.0 && t < 67.4) Object.assign(o, { handL: [-5.6, -14.5], handR: [5.6, -14.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: talk ? lipFlap(t, true, 'open', ['open', 'O']) : 'o', jump: 1.4 * kick(t, 65.05, 5) });
    if (t > 67.4 && t < ZOOM_IN) { o.lookX = ctx.look('jester_fester'); o.brows = 'up'; }
    if (t > 87.2 && t < 88.6) Object.assign(o, { eyes: 'wide', mouth: talk ? o.mouth : 'o', brows: 'up' });
    if (t > ZOOM_IN && t < 92) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'o', jump: .8 * kick(t, ZOOM_IN + .1, 6), lookX: ctx.look('safadi') });
    return o;
  }

  function dannyPose(t, ctx) {
    const at = AT('danny')(t), { o, talk } = base('danny', t, ctx, { handL: [-3.5, -9.8], handR: [3.5, -9.8], brows: 'up' });
    const to = tos(o), up = { handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm' };
    if (t > 14 && t < KICKOFF) Object.assign(o, { dy: .4, handL: [-4.2, -11.7], handR: [4.2, -11.7], footL: [-2, -1.05], footR: [2, -1.05], brows: 'focused', mouth: talk ? o.mouth : 'smirk' });
    if (at.moving) Object.assign(o, dannyDribble(at.p / 30, 1.3), { handL: [-4.6, -13 - 2 * Math.sin(at.p / 30 * Math.PI)], handR: [4.6, -13 + 2 * Math.sin(at.p / 30 * Math.PI)], handPoseL: 'fist', handPoseR: 'fist', lean: -.12, brows: 'focused', mouth: talk ? o.mouth : 'grin' });
    if (t > SHOT1 - .25 && t < SHOT1 + .5) Object.assign(o, { footR: [4.7, -3.7], footL: [-1.75, -1.05], handL: [-4.5, -13.5], handR: [4.3, -14.4], lean: -.15, rot: -.035, brows: 'focused', mouth: 'grin' });
    const tc = Math.min(t, WHISTLE1);
    if (t > GOAL1 + .2 && t < 36) {                                            // the goofy dance
      const w = Math.sin((tc - GOAL1) * 7);
      Object.assign(o, { eyes: 'wink', mouth: 'grin', handL: [-4.5, -15.6 + 2 * w], handR: [4.5, -15.6 - 2 * w], handPoseL: 'palm', handPoseR: 'palm', tilt: .14 * w, lean: -.06, jump: .8 * Math.abs(w), rot: 0 });
      if (t > WHISTLE1 + .5) Object.assign(o, { jump: 0, tilt: 0, handL: [-3.5, -9.8], handR: [3.5, -9.8], eyes: 'open', mouth: 'frown', brows: 'worried', lookX: ctx.look('jester_fester') });
    }
    if (t > 57.45 && t < 57.85) Object.assign(o, { footR: [4.2, -3.2], lean: -.1 });
    if (t > 60.2 && t < 62.9) celebrate(Math.min(t, WHISTLE2), 60.3, o, up);
    if (t > 62.9 && t < 65.0) Object.assign(o, { mouth: 'frown', brows: 'worried' });
    if (t > 65.0 && t < 67.4) Object.assign(o, { handL: [-4.6, -15], handR: [4.6, -15], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: talk ? lipFlap(t, true, 'open', ['open', 'o']) : 'o', jump: 1.2 * kick(t, 65.05, 5) });
    if (t > 67.4 && t < ZOOM_IN) o.lookX = ctx.look('jester_fester');
    if (t > 87.2 && t < 88.6) Object.assign(o, { eyes: 'wide', mouth: talk ? o.mouth : 'o' });
    if (t > ZOOM_IN && t < 92) Object.assign(o, { eyes: 'wide', mouth: 'o', jump: .8 * kick(t, ZOOM_IN + .1, 6), lookX: ctx.look('safadi') });
    return o;
  }

  function jennaPose(t, ctx) {
    const at = AT('jenna')(t), { o, talk } = base('jenna', t, ctx, { handL: [-2.6, -11.6], handR: [2.6, -11.6], handPoseL: 'fist', handPoseR: 'fist', brows: 'up' });
    o.mouth = lipFlap(t, talk, 'grin', ['open', 'grin', 'o']);
    const to = tos(o), up = { handL: [-4.6, -22], handR: [4.6, -22], handPoseL: 'palm', handPoseR: 'palm' };
    if (at.moving) Object.assign(o, jennaSkip(at.p / 40, 1.1));
    if (t > 14 && t < KICKOFF) Object.assign(o, { dy: .5, handL: [-3.6, -13], handR: [3.6, -13], brows: 'normal', mouth: talk ? o.mouth : 'smile' });
    const tc = Math.min(t, WHISTLE1);
    if (t > 28.6 && t < 36) { celebrate(tc, 28.6, o, up); if (t > WHISTLE1 + .5) Object.assign(o, { jump: 0, handL: [-2.6, -11.6], handR: [2.6, -11.6], handPoseL: 'fist', handPoseR: 'fist', eyes: 'open', mouth: 'o', lookX: ctx.look('jester_fester') }); }
    if (t > 40.6 && t < 44.0) Object.assign(o, { dy: .8, handL: [-4.4, -13], handR: [4.4, -13], handPoseL: 'palm', handPoseR: 'palm', brows: 'normal', mouth: talk ? o.mouth : 'flat' });
    if (t > 44.0 && t < 44.4) Object.assign(o, { handR: [4.6, -15], handPoseR: 'palm' });
    const slide = on(t, 44.15, 46.5, .15);                                    // the slide tackle… and sitting on the grass
    if (slide > 0) Object.assign(o, { dy: 4.2 * slide, footR: [5.2, -1.6], footL: [-1.6, -.5], lean: -.25 * slide, handL: [-4.6, -11], handR: [3.4, -9], handPoseL: 'palm', brows: t > STUMBLE ? 'worried' : 'up', eyes: t > STUMBLE ? 'wide' : 'open', mouth: t > STUMBLE ? 'o' : o.mouth, noShadow: false });
    if (t >= CART[0] && t < CART[1]) return { ...o, handL: [-3.4, -23.4], handR: [3.4, -23.4], handPoseL: 'palm', handPoseR: 'palm', footL: [-2.9, -.8], footR: [2.9, -.8], eyes: 'happy', mouth: 'grin', lookX: 0, turn: 0, noShadow: true };
    if (t > PASS3 - .2 && t < PASS3 + .3) Object.assign(o, { footR: [3.2, -3.2], lean: -.06 });
    if (t > 60.2 && t < 62.9) celebrate(Math.min(t, WHISTLE2), 60.4, o, up);
    if (t > 65.0 && t < 67.4) Object.assign(o, { handL: [-4.4, -16], handR: [4.4, -16], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? lipFlap(t, true, 'open', ['open', 'o']) : 'o', jump: 1.1 * kick(t, 65.05, 5) });
    if (t > 67.4 && t < ZOOM_IN) o.lookX = ctx.look('jester_fester');
    if (t > 87.2 && t < 88.6) Object.assign(o, { mouth: talk ? o.mouth : 'o' });
    if (t > ZOOM_IN && t < 92) Object.assign(o, { mouth: 'o', jump: .8 * kick(t, ZOOM_IN + .1, 6), lookX: ctx.look('safadi') });
    return o;
  }

  function almaPose(t, ctx) {
    const at = AT('alma')(t), { o, talk } = base('alma', t, ctx, { handL: [-4.4, -9.2], handR: [4.4, -9.2], handPoseL: 'palm', handPoseR: 'palm', brows: 'normal', dy: .4 });
    const to = tos(o);
    if (t > 14.2 && t < 15.6) { to('R', [4.4, -12.4 + .5 * Math.sin(t * 10)], 1, 'palm'); o.brows = 'up'; o.lookX = 0; o.turn = 0; o.dy = 0; }
    if (t > 29.0 && t < 36) { Object.assign(o, almaDance(Math.min(t, WHISTLE1), 'disco', { bpm: 120 }), { power: on(t, 29.0, WHISTLE1 + .1, .2), eyes: t < WHISTLE1 ? 'star' : 'wide', lookX: 0 }); }
    if (t > 40.6 && t < SAVE - .3) Object.assign(o, { dy: .9, handL: [-4.8, -10], handR: [4.8, -10], brows: 'angry', mouth: talk ? o.mouth : 'flat', lookX: ctx.ball, turn: 0 });
    // the dive: rotate toward the screen side the ball is on
    const dv = seg(t, SAVE - .3, SAVE + .2), lie = t > SAVE + .2 && t < 49.4, rise = seg(t, 49.4, 50.2), rs = ctx.dir;
    if (dv > 0 && t < 50.3) {
      const r = rs * 1.4 * (dv < 1 ? ease(dv) : 1) * (1 - ease(rise));
      Object.assign(o, { rot: r, jump: dv < 1 ? 5 * Math.sin(Math.PI * dv) : -2 * (1 - rise), handL: [-5.2, -12], handR: [5.2, -12], handPoseL: 'palm', handPoseR: 'palm',
        eyes: lie ? 'closed' : 'wide', brows: 'up', mouth: lie ? 'smile' : 'O', dy: 0, power: .9 * on(t, SAVE - .3, 49.6, .2) });
    }
    if (t > 50.3 && t < 53.2) { const c = Math.abs(Math.sin(t * 9)); Object.assign(o, { dy: 0, handL: [-1.2 - .4 * c, -7.4], handR: [1.2 + .4 * c, -7.4], eyes: 'happy', mouth: talk ? o.mouth : 'smirk', lookX: 0, turn: 0, hairSwing: .2 }); }
    if (t > 53.2 && t < 54.0) Object.assign(o, { dy: 1.6 * on(t, 53.2, 54.0, .2), handL: [-1.6, -6], handR: [2.6, -4], lookX: ctx.ball });
    if (t > 62.6) { Object.assign(o, { dy: 0, handL: [-3.4, -4.9], handR: [3.4, -4.9], power: 0 }); }
    if (t > 62.9 && t < 65.0) Object.assign(o, { mouth: 'frown', brows: 'worried' });
    if (t > 65.0 && t < 67.4) Object.assign(o, { handL: [-5, -11], handR: [5, -11], mouth: talk ? lipFlap(t, true, 'open', ['open', 'O']) : 'O', brows: 'angry', jump: 1.2 * kick(t, 65.05, 5) });
    if (t > 67.4 && t < ZOOM_IN) o.lookX = ctx.look('jester_fester');
    if (t > 87.2 && t < 88.6) Object.assign(o, { eyes: 'wide', mouth: talk ? o.mouth : 'o' });
    if (t > ZOOM_IN && t < 92) Object.assign(o, { eyes: 'wide', mouth: 'O', jump: .8 * kick(t, ZOOM_IN + .1, 6), lookX: ctx.look('safadi') });
    return o;
  }

  function safadiPose(t, ctx) {
    const at = AT('safadi')(t), { o, talk } = base('safadi', t, ctx, { handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', brows: 'normal' });
    o.mouth = lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']);
    const to = tos(o);
    if (at.moving) Object.assign(o, safadiWalk(at.p / 58, Math.min(1.6, at.speed / 250)));
    // the huddle: a hand to the mouth, leaning in
    if (t < 14) {
      o.lookX = ctx.look('sami'); o.turn = .25 * Math.sign(o.lookX);
      const side = Math.sign(ctx.look('sami')) || 1;
      if (t > 4.4 && t < 7.8) { to(side < 0 ? 'L' : 'R', [side * 2.4, -19.6], 1, 'palm'); o.tilt = .06 * side; o.eyes = 'narrow'; o.brows = 'up'; }
      if (t > 4.8 && t < 7.4) o.power = .3;
      if (t > 11.6) { const j = Math.abs(Math.sin(t * 11)); Object.assign(o, { handL: [-1.2, -12.2], handR: [1.2 + .3 * j, -12.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', mouth: talk ? o.mouth : 'grin', dy: .25 * j }); }
    }
    if (t > 18.6 && t < 21.9) { to('L', [-6.2, -12.6], 1, 'palm'); to('R', [6.2, -12.6], 1, 'palm'); o.brows = 'focused'; o.mouth = talk ? o.mouth : 'grin'; o.lean = -.05; }
    if (t > 21.9 && t < LUNGE + .1) Object.assign(o, { footR: [4.2, -1], footL: [-1.5, -.8], dy: 2.4, lean: .12, handR: [7, -9], handPoseR: 'palm', eyes: 'wide', mouth: 'O' });
    if (t >= LUNGE + .1 && t < 25) {                                          // the whiff: a spin, then dizzy
      const a = spin(LUNGE + .1, 23.3, 1.5, t);
      Object.assign(o, { flip: Math.cos(a) < 0, turn: Math.sin(a) * .8, handL: [-6, -14], handR: [6, -14], handPoseL: 'open', handPoseR: 'open', eyes: 'squeeze', mouth: 'wobble', brows: 'worried' });
      if (t > 23.3) Object.assign(o, { flip: false, turn: 0, tilt: .12 * Math.sin(t * 6), eyes: 'closed', emote: '?', emoteK: on(t, 23.3, 25, .15), handL: [-4.4, -8.1], handR: [4.4, -8.1] });
    }
    if (t > 38.2 && t < 39.6) { const j = Math.abs(Math.sin(t * 11)); Object.assign(o, { handL: [-1.2, -12.2], handR: [1.2 + .3 * j, -12.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', mouth: talk ? o.mouth : 'grin', dy: .25 * j, lookX: 0, turn: 0 }); }
    // the charge
    if (t > 42.3 && t < SHOT2 - .4) {
      const fl = Math.sin(t * 9);
      Object.assign(o, { handL: [-5.6, -14 + 3 * fl], handR: [5.6, -14 - 3 * fl], handPoseL: 'fist', handPoseR: 'fist', lean: -.1, brows: 'focused', mouth: talk ? o.mouth : 'teeth', lookX: 0, turn: 0, lookY: .3 });
      const st = on(t, STUMBLE - .1, STUMBLE + .5, .1);
      if (st > 0) Object.assign(o, { rot: .3 * Math.sin((t - STUMBLE) * 14) * st, handL: [-6.5, -20], handR: [6.5, -8], eyes: 'wide', mouth: 'O', brows: 'up' });
    }
    if (t > SHOT2 - .4 && t < 48.8) {
      const k2 = on(t, SHOT2 - .4, SHOT2 + .3, .1);
      Object.assign(o, { footR: mix([1.25, -.8], [3.8, -5.4], k2), lean: .1 * k2, handL: [-5.8, -15], handR: [4.8, -10], eyes: t > SHOT2 + .1 ? 'wide' : 'narrow', mouth: t > SHOT2 + .1 ? 'O' : 'teeth', brows: 'up', lookX: 0, turn: 0 });
    }
    if (t > 48.8 && t < 53.5) {                                                // on his knees
      Object.assign(o, { dy: 5.6, footL: [-2.6, -.5], footR: [2.6, -.5], handL: [-4.6, -22], handR: [4.6, -22], handPoseL: 'palm', handPoseR: 'palm', eyes: t < 51 ? 'wide' : 'closed', mouth: talk ? lipFlap(t, true, 'O', ['O', 'open']) : 'frown', brows: 'worried', lookY: -.3, lookX: 0, turn: 0 });
    }
    if (t > 53.5 && t < ZOOM_IN) Object.assign(o, { handL: [-4, -9.2], handR: [4, -9.2], handPoseL: 'fist', handPoseR: 'fist', mouth: 'smirk' });
    if (t > 82.8 && t < ZOOM_IN) { to('R', [4.6 + .6 * Math.sin(t * 9), -19.8], 1, 'palm'); o.eyes = 'happy'; o.mouth = 'grin'; o.lookX = 0; o.turn = 0; }
    // the cut-off
    if (t >= ZOOM_IN) {
      Object.assign(o, { lookX: ctx.look('jester_fester'), turn: .2 * Math.sign(ctx.look('jester_fester')), brows: 'up', mouth: talk ? o.mouth : 'smirk', lean: -.1 * kick(t, ZOOM_IN, 4) });
      if (t < 91.2) { to('R', [.9, -18.2], on(t, ZOOM_IN + .3, 91.2, .15), 'fist'); o.eyes = 'closed'; }
      if (t > 91.6 && t < 93.4) { const side = Math.sign(ctx.look('jester_fester')) || 1; to(side < 0 ? 'L' : 'R', [side * 6.2, -15.5], 1, 'point'); o.eyes = 'narrow'; }
      if (t > 93.4) Object.assign(o, { handL: [1.8, -11.4], handR: [-1.8, -11.0], handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', mouth: 'smirk', brows: 'quizzical' });
      if (t > HALF - .1) Object.assign(o, { eyes: 'wide', brows: 'up' });
    }
    return o;
  }

  function samiPose(t, ctx) {
    const at = AT('sami')(t), { o, talk } = base('sami', t, ctx, { handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', brows: 'up' });
    o.mouth = lipFlap(t, talk, 'grin', ['grin', 'open', 'o', 'smile']);
    const to = tos(o);
    if (at.moving) Object.assign(o, samiWalk(at.p / 52, Math.min(1.4, at.speed / 250)));
    if (t < 14.05) {
      o.lookX = ctx.look('safadi'); o.turn = .25 * Math.sign(o.lookX);
      if (t > 4.6 && t < 8.0) { o.tilt = .1 * Math.sin(t * 5) * .3; o.eyes = 'narrow'; o.mouth = 'smirk'; }
      if (t > 8.2 && t < 11.4) { to('L', [-3.6, -25.5], 1, 'palm'); to('R', [3.6, -25.5], 1, 'palm'); o.eyes = 'happy'; o.tilt = .1; }   // hands behind his head
      if (t > 11.6) { const j = Math.abs(Math.sin(t * 11)); Object.assign(o, { handL: [-1.2 - .3 * j, -12.2], handR: [1.2, -12.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', mouth: talk ? o.mouth : 'grin', dy: .25 * j }); }
    }
    if (t > 14.05 && t < 24) Object.assign(o, { lookX: 0, turn: 0, eyes: 'happy', handL: [-3.6, -25.5], handR: [3.6, -25.5], handPoseL: 'palm', handPoseR: 'palm' });
    const asleep = t > 24 && t < 36.25;
    if (asleep) Object.assign(o, { tilt: .2 + .02 * Math.sin(t * 2.2), lean: .08, dy: .6 + .15 * Math.sin(t * 2.2), handL: [-1.4, -10.2], handR: [1.4, -10.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'closed', mouth: 'o', blink: 0, lookX: 0, turn: 0 });
    if (t > 36.25 && t < 38.2) Object.assign(o, { eyes: t < 36.6 ? 'wide' : 'open', brows: 'up', mouth: talk ? o.mouth : 'o', jump: 1.6 * kick(t, 36.25, 5), lookX: 0, turn: 0 });
    if (t > 39.5 && t < 40.7) { const j = Math.abs(Math.sin(t * 11)); Object.assign(o, { handL: [-1.2 - .3 * j, -12.2], handR: [1.2, -12.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', mouth: talk ? o.mouth : 'grin', dy: .25 * j, lookX: 0, turn: 0 }); }
    if (t > 40.6 && t < 41.6) { const k2 = on(t, LONG - .35, LONG + .3, .12); Object.assign(o, { footR: mix([1.25, -.8], [3.6, -5], k2), lean: .08 * k2, handL: [-5, -13], lookY: .4 }); }
    if (t > 53.0 && t < 59.3) Object.assign(o, { dy: .5, handL: [-4.4, -10], handR: [4.4, -10], handPoseL: 'palm', handPoseR: 'palm', mouth: t < 56 ? 'O' : 'smile', eyes: t < 56 ? 'closed' : 'open' });   // a yawn, then (sort of) ready
    // the wrong-way dive and the face-plant
    if (t >= 59.3) {
      const dv = seg(t, 59.3, 59.7), r = ctx.dir * 1.45 * ease(dv);
      Object.assign(o, { rot: r, jump: 5 * Math.sin(Math.PI * Math.min(dv, 1)) - (dv >= 1 ? 4 : 0), handL: [-5.5, -16], handR: [5.5, -16], handPoseL: 'palm', handPoseR: 'palm', eyes: dv < 1 ? 'wide' : 'squeeze', mouth: dv < 1 ? 'O' : 'wobble', sq: dv >= 1 ? .1 * boing(t, 59.7, 3, 5) : 0, lookX: 0, turn: 0 });
    }
    return o;
  }

  function festerPose(t, ctx) {
    const at = AT('jester_fester')(t), { o, talk } = base('jester_fester', t, ctx, { referee: true, handL: [-3.3, -8.4], handR: [3.6, -10.2], handPoseL: 'open', handPoseR: 'fist', brows: 'up', eyes: 'open' });
    o.mouth = lipFlap(t, talk, 'grin', ['open', 'grin', 'o', 'smile']);
    const to = tos(o);
    if (at.moving) {
      const ph = at.p / 46, sn = Math.sin(ph * Math.PI);
      Object.assign(o, { footL: [-1.25, -.85 - 1.6 * Math.max(0, sn)], footR: [1.25, -.85 - 1.6 * Math.max(0, -sn)], dy: .35 * Math.abs(sn), jump: .5 * Math.abs(sn), handL: [-3.6, -10.4 + 1.4 * sn], hatSway: [.6 * sn, .3] });
    }
    const blow = t0 => on(t, t0 - .5, t0 + .6, .15);
    const b = Math.max(blow(17.6), blow(WHISTLE1), blow(WHISTLE2), blow(HALF));
    if (b > 0) { to('R', [.7, -15.3], b, 'fist'); Object.assign(o, { eyes: 'squeeze', mouth: 'o', lookX: 0, turn: 0, hatSway: [0, -.8 * b] }); }
    if (t > 31.9 && t < 34.3) { to('L', [-4.8 + .5 * Math.sin(t * 14), -16], 1, 'open'); o.brows = 'up'; }        // a waggling finger
    if (t > 34.3 && t < 36.2) Object.assign(o, { handL: [-5.3, -15.4], handPoseL: 'open', jump: 1.6 * kick(t, 34.4, 5), eyes: 'wide', brows: 'angry' });
    if (t > 63.1 && t < 65) Object.assign(o, { handL: [-5.3, -15.4], handPoseL: 'open', jump: 1.2 * kick(t, 63.2, 5), brows: 'angry' });
    // the explanation, Safadi-style
    if (t > 67.4 && t < ZOOM_IN) {
      o.lookX = 0; o.turn = 0;
      if (t < 69.6) { to('L', [-1.3, -13.6], 1, 'fist'); to('R', [1.3, -13.6], 1, 'fist'); o.tilt = -.08; o.eyes = t > 68.4 ? 'wink' : 'open'; }
      else {
        const wig = on(t, 69.6, 70.6, .15) * Math.sin(t * 30) * .4;
        to('R', [5.3 + wig, -15.4], 1, 'open'); o.brows = 'up';
        if (t > 77.6 && t < 79.6) to('L', [-4.6, -18.5], 1, 'fist');                                       // "One"
        if (t > 79.8 && t < 82.6) to('L', [-4.6, -18.5 + .4 * Math.sin(t * 8)], 1, 'thumb');                // "Two…"
        if (t > 83.6 && t < 86.4) { to('L', [-5.6, -14], 1, 'open'); o.jump = .8 * kick(t, 85.6, 5); }
        if (t > 88.4) Object.assign(o, { handL: [-3.3, -8.2], handR: [3.3, -8.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin' });
      }
    }
    if (t >= ZOOM_IN) {                                                          // cut off
      Object.assign(o, { lookX: ctx.look('safadi'), eyes: t < 91 ? 'wide' : 'open', brows: t < 91 ? 'up' : 'worried', mouth: talk ? o.mouth : 'flat', emote: '!', emoteK: on(t, ZOOM_IN + .1, 91.2, .1), jump: .9 * kick(t, ZOOM_IN + .1, 6) });
      if (t > 93.8 && t < HALF - .5) { to('L', [-4.4, -13.3], 1, 'open'); to('R', [4.4, -13.3], 1, 'open'); Object.assign(o, { lookX: 0, turn: 0, eyes: t > 95.4 ? 'happy' : 'open', mouth: talk ? o.mouth : 'smile', hatDroop: .25, tilt: .06 }); }
      if (t > HALF + .3) Object.assign(o, { eyes: 'happy', mouth: 'grin', hatSway: [0, -.6 * kick(t, HALF, 3)] });
    }
    return o;
  }

  // ---------- drawing everyone ----------
  const CAST = {
    housam: { pose: housamPose, rig: housam, unit: HOUSAM_UNIT },
    danny: { pose: dannyPose, rig: danny, unit: DANNY_UNIT },
    jenna: { pose: jennaPose, rig: jenna, unit: JENNA_UNIT },
    alma: { pose: almaPose, rig: alma, unit: ALMA_UNIT },
    safadi: { pose: safadiPose, rig: safadi, unit: SAFADI_UNIT },
    sami: { pose: samiPose, rig: sami, unit: SAMI_UNIT },
    jester_fester: { pose: festerPose, rig: jester, unit: JF_UNIT },
  };
  // Paint the set, the cast and the ball in depth order. → { A: anchors, S: px/unit, SX: screen x of everyone, P }
  function group(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {}, SX = {};
    const cheer = Math.max(on(t, GOAL1, WHISTLE1 + .2, .3), on(t, GOAL2, WHISTLE2 + .2, .3) * 1.1, on(t, SAVE, 50, .3) * .8);
    const setO = { ...O_BASE, splitZ: o.splitZ ?? (cam.dir > 0 ? 9050 : -50), cheer, ...(o.set || {}) };
    layer(() => F.back(P, t, setO), { blur });
    const pos = {};
    for (const n of Object.keys(CAST)) { pos[n] = AT(n)(t); const [sx] = P.p(pos[n].x, 0, pos[n].z); SX[n] = P.depth(pos[n].z) > 1 ? sx : W / 2; }
    const bw = ballAt(t), bsx = Array.isArray(bw) ? P.p(...bw)[0] : W / 2;
    const items = [];
    for (const [name, c] of Object.entries(CAST)) {
      const at = pos[name]; if (P.depth(at.z) < 60) continue;
      const ctx = { dir: P.dir, look: n => clamp((SX[n] - SX[name]) / 420, -.85, .85), ball: clamp((bsx - SX[name]) / 420, -.85, .85) };
      items.push({ z: at.z, draw: () => {
        const [sx, sy, k] = P.p(at.x, 0, at.z), s = c.unit * k, pose = { ...c.pose(t, ctx), t };
        if (o.freeze) pose.boil = 0;
        const roll = name === 'jenna' && t >= CART[0] && t < CART[1] ? { a: spin(CART[0], CART[1], 3, t) * P.dir, h: 12.5 }
          : name === 'housam' && t >= FLIP[0] && t < FLIP[1] ? { a: -TAU * ease(seg(t, FLIP[0], FLIP[1])), h: 15 } : null;
        if (roll) {                                                           // cartwheel / backflip: spin about the middle
          const cy = sy - (roll.h + (pose.jump || 0)) * s;
          X.save(); X.translate(sx, cy); X.rotate(roll.a); X.translate(-sx, -cy);
          A[name] = c.rig(sx, sy, s, { ...pose, noShadow: true }); X.restore();
          ellipse(sx, sy, 3 * s, .55 * s, { fill: 'rgba(40,20,30,.2)', stroke: null });
        } else A[name] = c.rig(sx, sy, s, pose);
        S[name] = s;
        props(t, name, A[name], s, sx, sy, at);
      } });
    }
    if (Array.isArray(bw)) items.push({ z: bw[2], draw: () => { if (P.depth(bw[2]) < 40) return; const [bx, by, bk] = P.p(...bw); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: R / HOUSAM_UNIT, spin: t * 9 }); } });
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(it => it.draw());
    F.front(P, t, setO);
    if (o.board) o.board(P);
    return { A, S, SX, P };
  }
  function props(t, name, A, s, sx, sy, at) {
    if (name === 'alma') { gloves(A, s); if (t >= 53.3 && t < ROLL) housamBall((A.handL[0] + A.handR[0]) / 2, A.handL[1] - .8 * s, s, { radius: R / ALMA_UNIT }); }
    if (name === 'jester_fester') whistleProp(A, s, t > 17 && inAny(t, [[17.1, 18.2], [30.7, 31.8], [62.1, 63.2], [96.5, 97.6]]));
    if (name === 'sami') {
      const asleep = on(t, 24.4, 36.25, .4);
      if (t < 36.25) { noseBubble(A, s, t, asleep); zzz(A.head[0] + 6 * s, A.top[1], s, t, asleep); }
    }
    if (at.moving && at.speed > 450 && (name === 'danny' || name === 'safadi')) speedLines(A, s, 1, at.dz > 0 ? 1 : -1);
  }
  // Fester's little chalkboard: it sputters on, chalks itself in step with his lines, and pops when Safadi arrives
  function festerBoard(t, P) {
    if (t < BOARD_ON || t > BOARD_POP + .15) return;
    if (t < BOARD_ON + .5 && hash(Math.floor(t * 14)) < .4) return;           // sputter
    // d = how much is chalked on (the board maps k .2 → 1 onto it), in step with his lines
    const d = kf(t, [[BOARD_ON + .5, 0], [71.2, 0], [73.8, .34], [77.6, .37], [78.4, .55], [79.8, .56], [81.4, .74], [83.6, .76], [85.0, .95], [85.7, 1]], x => x);
    const k = t < BOARD_ON + .5 ? .2 * seg(t, BOARD_ON, BOARD_ON + .5) : .2 + .8 * d;
    const [bx, by, bk] = P.p(-470, 235 + 6 * Math.sin(t * 1.3), 7540);
    if (P.depth(7540) < 80) return;
    const pop = t > BOARD_POP ? 1 + .6 * seg(t, BOARD_POP, BOARD_POP + .15) : 1;
    X.save(); X.translate(bx, by); X.rotate(-.07 + .02 * Math.sin(t * 2.3)); X.scale(pop, pop); X.globalAlpha = t > BOARD_POP ? 1 - seg(t, BOARD_POP, BOARD_POP + .15) : 1;
    safadiBoard(0, 0, 240 * bk, k, t, { kind: 'offside', title: 'OFFSIDE' });
    X.restore();
  }
  function huddleBoard(t, P) {
    if (t < 4.8 || t > 10.4) return;
    const k = t < 10 ? Math.min(1, .2 * seg(t, 4.8, 5.1) + .8 * seg(t, 5.2, 7.2)) : .2 * (1 - seg(t, 10, 10.4));
    const [bx, by, bk] = P.p(-150, 235, 4990);
    safadiBoard(bx, by, 150 * bk, Math.max(.001, k), t, { kind: 'offside', title: 'OFFSIDE TRAP' });
  }

  // ---------- callouts ----------
  function bubbles(t, A, S, SX, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 12) continue;
      const c = { size: o.size || 50, maxW: o.maxW || 660, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W);
        if (ms.length) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 60, age, { ...c, size: (o.size || 50) * (l.kind === 'shout' ? 1.35 : 1.1), dx: 0, dy: -220 });
          continue;
        }
      }
      const a = A[l.speaker], s = S[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const sx = a.mouth[0], right = o.side ? o.side(l.speaker) > 0 : sx < W * .5, mid = !o.side && sx > W * .38 && sx < W * .62;
        const dx = mid ? (sx < W / 2 ? 140 : -140) : (right ? 1 : -1) * (o.far || 360);
        callout(l.text, sx + (right ? 1 : -1) * (HEADW[l.speaker] || 1.5) * s, a.mouth[1] - .6 * s, age, { ...c, dx: o.dx ?? dx, dy: o.dy ?? (mid ? -330 : -250) });
      } else {
        const side = Math.sign((SX[l.speaker] ?? W / 2) - W / 2);
        const ex = side < 0 ? -30 : side > 0 ? W + 30 : W * .5, ey = side === 0 ? H + 40 : H * .42;
        callout(l.text, ex, ey, age, { ...c, dx: side < 0 ? 420 : side > 0 ? -420 : 0, dy: side === 0 ? -360 : -160 });
      }
    }
  }

  // ---------- cameras ----------
  // cam(cx, fz, k, feet, f, dir, y): depth fz shows k px per world unit with the feet at screen y `feet`
  const cam = (cx, fz, k, feet, f = 2400, dir = 1, y = 120) => ({ x: cx, y, z: fz - dir * f / k, f, hy: feet - y * k, dir });
  const dr = (t, a = 1) => 10 * a * Math.sin(t * .23);
  const shot = (camFn, blur = 1.6, bo = {}, go = {}) => t => {
    const c = camFn(t), { A, S, SX, P } = group(t, c, blur, go);
    extras(t, A, S, P);
    if (!bo.none) bubbles(t, A, S, SX, bo);
  };
  function opening(t) {                                                       // high over the pitch, settling to midfield
    const u = ease(seg(t, 0, 4.0)), f = lerp(900, 2000, u), k = lerp(.18, .85, u);
    const c = cam(lerp(0, 120, u), 4700, k, lerp(560, 860, u), f, 1, lerp(5200, 260, u));
    const { A, S, SX } = group(t, c, 0);
    bubbles(t, A, S, SX);
  }
  const huddle = shot(t => cam(130 + dr(t), 5010, 2.7 * (1 + .04 * seg(t, 4, 14)), 1060, 2400, -1), 2.2, { size: 52, side: () => -1 }, { board: P => huddleBoard(T, P) });
  const almaGoal = shot(t => cam(-80 + dr(t), 100, 3.4, 1020, 2400, -1), 2.0, { size: 54 });
  const lineup = shot(t => cam(40 + dr(t), 4420, 2.2, 990, 2400, -1), 1.4);
  const run1 = shot(t => cam(lerp(0, 220, ease(seg(t, 18.5, 23))), 4900, 1.9, 900, 3000, -1), .8);
  const dannyRun = shot(t => { const d = AT('danny')(t); return cam(d.x * .7, d.z, 3.2, 1010, 2600, -1); }, 1.6);
  const samiSleep = shot(t => cam(-330, 8880, 3.6 * (1 + .04 * seg(t, 25, 26.4)), 1030, 2400, 1), 2.2, { size: 54 });
  const dannyShot = shot(t => cam(-192, 7800, 2.0, 900, 3600, -1), .8, {}, { splitZ: 8700 });
  const celebrateCam = shot(t => cam(-140 + dr(t), 7580, 2.3, 1000, 2400, -1), 1.4, { size: 52 });
  const samiCam = shot(t => cam(-310 + dr(t), 8875, 3.4, 1030, 2400, 1), 2.2, { size: 54 });
  const safChuckle = shot(t => cam(70, 5170, 3.6, 1030, 2400, 1), 2.4, { size: 54 });
  const charge = shot(t => { const a = AT('safadi')(Math.min(t, 46.9)); return cam(a.x * .5, a.z, 2.3, 1010, 3200, 1); }, 1.4, { size: 52 });
  const saveCam = shot(t => cam(-140 + dr(t), 70, 3.0, 950, 2400, -1), 1.8, { size: 54 });
  const safKnees = shot(t => cam(60, 1550, 3.4 * (1 + .05 * seg(t, 48.8, 50.8)), 1040, 2400, 1), 2.4, { size: 54 });
  function passCam(t) {
    const fz = kf(t, [[53.3, 500], [54.4, 1700], [55.8, 3000], [56.6, 4200], [57.5, 5300], [58.4, 6500]]), x = kf(t, [[53.3, -150], [54.4, -280], [55.8, -240], [56.6, 280], [57.5, 240], [58.4, 60]]);
    return cam(x, fz, 2.2, 900, 2000, -1, 200);
  }
  const passMove = shot(passCam, .4, { size: 50 });
  const bicycle = shot(t => cam(-20, 7880, 2.5 * (1 + .04 * seg(t, 58.4, 60.2)), 1010, 3000, 1), 1.0, { size: 52 });
  const offside2 = shot(t => cam(200 + dr(t), 7420, 1.75, 980, 2400, -1), 1.2, { size: 52 });
  const explain = shot(t => cam(-320 + dr(t, .6), 7520, 2.8 * (1 + .05 * seg(t, 67.6, 89.8)), 1010, 2400, -1), 2.0, { size: 52, side: () => -1 }, { board: P => festerBoard(T, P) });
  const kidsReact = shot(t => cam(460 + dr(t), 7400, 2.6, 1010, 2400, -1), 2.0, { size: 52 });
  // POV from the kids: far, far away, Safadi waves
  const farSafadi = shot(t => { const f = 13000, zc = 7300; return { x: 260, y: 140, z: zc, f, hy: 830 - 140 * f / (zc - 1550), dir: -1 }; }, 0, { none: true }, { set: { wind: 1.4 } });
  const cutOff = shot(t => cam(-110 + dr(t), 7510, 3.0, 1010, 2400, -1), 2.2, { size: 54 }, { board: P => festerBoard(T, P) });
  // The scoreboard: HALF TIME, 0–0. Freeze, card, iris.
  function scoreboard(t) {
    const tt = Math.min(t, FREEZE), f = 1500, z = lerp(9300, 9380, seg(tt, 97.8, FREEZE)), P = persp({ x: 2100, y: 560, z, f, hy: 545 - 10 * f / (10500 - z), dir: 1 });
    F.back(P, tt, { ...O_BASE, clock: 'HALF TIME', cheer: on(tt, 97.8, 100, .3) * .5 });
    const [bx, by] = P.p(2100, 700, 10482);
    sfx('FWEEEET!', bx - 240, by - 40, 120, '#FFFDF4', tt - 97.9, { life: 60, rot: -.08 });
    if (t >= FREEZE) {
      flash(.7 * kick(t, FREEZE, 8));
      overlay(() => {
        const k = ease(seg(t, FREEZE, FREEZE + .4));
        X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .55 * k; X.fillStyle = '#C9A46A'; X.fillRect(0, 0, W, H); X.restore();
        const c = backOut(seg(t, 100.2, 100.6)); if (c <= 0) return;
        X.save(); X.translate(W - 520, H - 170); X.rotate(-.05); X.scale(c, c);
        shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4D6', stroke: PAL.ink, lwPx: 8, smooth: .1 });
        X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
        X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = PAL.crimson; X.fillText('TO BE CONTINUED...', 0, 8);
        shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
        X.restore();
      });
      iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 103.6, 104.8))));
    }
  }

  // Sound effects that ride on top of any shot
  function extras(t, A, S, P) {
    const fe = A.jester_fester;
    for (const w of [17.6, WHISTLE1, WHISTLE2, HALF]) {
      if (fe) sfx('TWEET!', fe.head[0] + 9 * S.jester_fester, fe.top[1], 74, '#FFFDF4', t - w, { life: .7, rot: -.06 });
      else sfx('TWEEET!', W * .5, H * .15, 90, '#FFFDF4', t - w, { life: .7, rot: .05 });
    }
    if (A.safadi) { const a = A.safadi, s = S.safadi;
      sfx('WHIFF!', a.head[0] + 8 * s, a.head[1], 80, PAL.goldLt, t - LUNGE - .1, { life: .7, rot: .1 });
      sfx('WHOOPS!', a.head[0] - 9 * s, a.head[1] - 4 * s, 64, PAL.goldLt, t - STUMBLE, { life: .6, rot: -.1 });
      sfx('BOOM!', a.belly[0] + 6 * s, a.belly[1] + 8 * s, 90, '#FF9A6B', t - SHOT2, { life: .5 });
      if (t > ZOOM_IN && t < ZOOM_IN + .8) dust(a.belly[0] - 6 * s * P.dir, a.belly[1] + 10 * s, s, t, ZOOM_IN);
      sfx('ZOOM!', a.head[0] - 10 * s, a.head[1] - 6 * s, 90, PAL.goldLt, t - ZOOM_IN, { life: .7, rot: -.1 });
    }
    if (A.danny) sfx('SHOOT!', A.danny.footR[0] + 4 * S.danny, A.danny.footR[1] - 8 * S.danny, 64, PAL.goldLt, t - SHOT1, { life: .5 });
    if (A.alma) { const a = A.alma, s = S.alma;
      sfx('SAVE!', a.head[0], a.top[1] - 4 * s, 130, '#9BF0A8', t - SAVE, { life: 1.2, rot: -.06 });
      if (t > SAVE && t < SAVE + .8) dust(a.head[0], a.footL[1], s, t, SAVE + .3); }
    if (A.sami) { const a = A.sami, s = S.sami;
      sfx('POP!', a.head[0] + 3 * s, a.mouth[1] - 2 * s, 56, '#CFE6FF', t - 36.25, { life: .5 });
      sfx('SPLAT!', a.head[0], a.head[1] - 4 * s, 80, '#FF9A6B', t - 59.7, { life: .7 }); }
    if (A.housam) { const a = A.housam, s = S.housam;
      sfx('flick', a.footR[0] + 4 * s, a.footR[1] - 4 * s, 50, PAL.cream, t - FLICK, { life: .5 });
      sfx('BICYCLE KICK!', a.head[0], a.top[1] - 10 * s, 70, PAL.goldLt, t - VOLLEY, { life: 1.0, rot: -.05 }); }
    if (A.jenna) sfx('WHEEE!', A.jenna.head[0], A.jenna.top[1] - 8 * S.jenna, 60, '#FFB3D9', t - CART[0] - .2, { life: .9 });
    sfx('GOAL!', W * .5, H * .3, 190, PAL.goldLt, t - GOAL1, { life: 1.2 });
    sfx('GOAL!', W * .5, H * .3, 190, PAL.goldLt, t - GOAL2, { life: 1.0 });
    if (t > BOARD_POP && t < BOARD_POP + .6 && fe) sfx('POP!', fe.head[0] - 10 * S.jester_fester * P.dir, fe.head[1] - 8 * S.jester_fester, 80, PAL.goldLt, t - BOARD_POP, { life: .5 });
  }

  scene({ duration: 105, fps: 24, bpm: 120,                 // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [4.0, huddle], [14.0, almaGoal], [15.8, lineup], [18.5, run1], [23.0, dannyRun], [25.0, samiSleep], [26.4, dannyShot],
      [27.9, celebrateCam], [29.2, almaGoal], [30.8, celebrateCam], [36.0, samiCam], [38.3, safChuckle], [39.5, samiCam], [42.0, charge],
      [47.6, saveCam], [48.8, safKnees], [50.8, saveCam], [53.3, passMove], [58.4, bicycle], [60.2, celebrateCam], [62.6, offside2],
      [67.6, explain], [82.8, farSafadi], [84.6, explain], [87.0, kidsReact], [88.2, explain], [89.8, cutOff], [97.8, scoreboard],
    ] });
})();
