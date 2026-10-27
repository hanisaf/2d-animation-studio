// Scene 13: "Deal With It". The county soccer field, the centre circle. Safadi lectures Housam and Alma with his chalkboard;
// Housam challenges him to a match; Safadi calls in his twin, Doctor Sami ("Deal with it."); Housam calls in Jenna and
// Danny ("DEAL WITH IT!"); referee Fester jogs on and blows the whistle. Freeze. To be continued.
// Blocking (world units): kids on the left of the centre spot, adults on the right, everyone facing the camera, which
// looks up the pitch (dir 1) in every shot. Fester arrives from deep in the north half. Every shot is a pure function of t.
(() => {
  const F = LOCATIONS.soccer_field, LINES = ASSETS.scene.scene13_deal_with_it.dialogue;
  const O_BASE = { crowd: .3, score: [0, 0], home: 'KIDS', guest: 'ADULTS' };
  const ACCENT = { safadi: PAL.crimson, sami: '#2E9E6B', housam: '#3766BD', alma: '#994EC4', jenna: '#D0508E', danny: '#3B6FB0', jester_fester: PAL.crimson };
  const BOARD = { x: 470, y: 180, z: 4520, w: 250 };                         // Safadi's floating chalkboard, in the world
  const LESSONS = [[7.6, 'passing', 'PASSING'], [11.4, 'dribbling', 'DRIBBLING'], [15.2, 'shooting', 'SHOOTING'], [20.4, 'teamwork', 'TEAMWORK']];
  const DROP = 26.5, FLICK = 32.9, SHIN = 33.75, SHADES = 55.6, LOWER = 70.2, FWEET = 59.2, CART = [60.0, 61.4], DRIB = [63.6, 65.0];
  const PIX = [73.6, 73.9, 74.2, 74.5];                                      // pixel shades land on Danny, Jenna, Alma, Housam
  const REF_WHISTLE = 79.4, JOG = [79.8, 82.0], PLACE = 87.0, TWEET = 88.4, FREEZE = 88.75;

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const mix = (a, b, k) => mixPt(a, b, clamp(k));
  const KIDS = ['housam', 'alma', 'jenna', 'danny'], ADULTS = ['safadi', 'sami'];
  // who spoke last, not counting `not` (for eyelines)
  function lastSpeaker(t, not) {
    let who = 'safadi';
    for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker;
    return who;
  }
  // eyeline toward a speaker: kids stand left, adults right, Fester in the middle
  const SIDE = { housam: -.5, alma: -.8, jenna: -1, danny: -1.2, safadi: .5, sami: .9, jester_fester: 0 };
  function lookAt(me, who) { const d = SIDE[who] - SIDE[me]; return Math.abs(d) < .05 ? 0 : clamp(d * 1.6, -.85, .85); }

  // ---------- where everyone stands ----------
  // keys: [t0, t1, x0, z0, x1, z1] → { x, z, p (distance travelled), moving }
  function track(t, keys) {
    let x = keys[0][2], z = keys[0][3], p = 0, moving = 0;
    for (const [t0, t1, x0, z0, x1, z1] of keys) {
      if (t < t0) break;
      const u = ease(seg(t, t0, t1)), dist = Math.hypot(x1 - x0, z1 - z0);
      x = lerp(x0, x1, u); z = lerp(z0, z1, u); p += dist * u; if (t < t1) moving = 1;
    }
    return { x, z, p, moving };
  }
  const still = (x, z) => () => ({ x, z, p: 0, moving: 0 });
  const SAM_T = [[39.35, 40.7, 3240, 6090, 2860, 6090], [41.0, 42.3, 760, 4560, 360, 4520]];
  const JEN_T = [[CART[0], CART[1], -1000, 4445, -510, 4445]];
  const DAN_T = [[DRIB[0], DRIB[1], -1050, 4400, -680, 4400]];
  const FES_T = [[JOG[0], JOG[1], 30, 6100, 0, 4760]];
  const AT = {
    housam: still(-170, 4420), alma: still(-340, 4430), safadi: still(150, 4500),
    sami: t => track(t, SAM_T), jenna: t => track(t, JEN_T), danny: t => track(t, DAN_T), jester_fester: t => track(t, FES_T),
  };
  const SHOWN = { sami: t => t > 39.3, jenna: t => t > CART[0], danny: t => t > DRIB[0], jester_fester: t => t > JOG[0] - .1 };

  // ---------- the ball ----------
  // Housam juggles it on his knee (drawn from his anchors) until DROP; from then on it lives in the world.
  const jugU = t => frac(t * 1.7 + .5);                                      // 0 = on the knee
  const BALL_R = 10;                                                         // world units
  function ballWorld(t) {
    if (t < DROP) return null;
    if (t < DROP + .45) { const u = seg(t, DROP, DROP + .45); return [-150, BALL_R + 70 * (1 - u * u) * (1 - u), 4408]; }
    if (t < FLICK) return [-150, BALL_R, 4408];
    if (t < SHIN) { const u = seg(t, FLICK, SHIN); return [lerp(-150, 120, u), BALL_R + lerp(0, 25, u) + 150 * Math.sin(Math.PI * u), lerp(4408, 4470, u)]; }
    const u = seg(t, SHIN, SHIN + 2.6), e = 1 - (1 - u) ** 2;              // off his shin, rolling away to the right
    return [lerp(120, 1300, e), BALL_R + 40 * Math.abs(Math.sin(Math.PI * seg(t, SHIN, SHIN + .55))) * (1 - seg(t, SHIN, SHIN + .55)), lerp(4470, 4300, e)];
  }
  // Fester's match ball: under his arm, then set down on the spot in front of him
  const FBALL = [10, BALL_R, 4690];

  // ---------- props ----------
  function shades(A, k, o = {}) {                                           // slick black sunglasses: k slides them on from above
    if (k < .01 || !A.eyeL) return;
    const [lx, ly] = A.eyeL, [rx, ry] = A.eyeR, d = Math.max(8, Math.hypot(rx - lx, ry - ly)), r = d * .56;
    const dy = (1 - ease(k)) * -2.4 * d + (o.low || 0) * d * .3, u = d / 4;
    X.save(); X.globalAlpha = clamp(k * 3);
    line([[lx - r, ly + dy - .1 * u], [rx + r, ry + dy - .1 * u]], { stroke: '#1B1B22', lwPx: Math.max(2, .3 * u) });
    for (const [x, y] of [[lx, ly], [rx, ry]]) {
      shape([[x - r, y + dy - .55 * u], [x + r, y + dy - .55 * u], [x + r * .8, y + dy + .95 * u], [x - r * .8, y + dy + .95 * u]], { fill: '#1B1B22', stroke: PAL.ink, lwPx: 2, smooth: .4 });
      line([[x - r * .6, y + dy - .1 * u], [x - r * .1, y + dy - .38 * u]], { stroke: 'rgba(255,255,255,.7)', lwPx: Math.max(1.5, .22 * u) });
    }
    X.restore();
  }
  // Danny's Minecraft-style pixel shades, drawn centred on (cx, cy) with eye distance d
  function pixelShades(cx, cy, d, ang = 0, alpha = 1) {
    const p = d / 3.7;                                                        // one pixel
    X.save(); X.translate(cx, cy); X.rotate(ang); X.globalAlpha = alpha;
    const px = (i, j, col) => { X.fillStyle = col; X.fillRect(i * p, j * p, p + .5, p + .5); };
    for (let i = -5; i <= 4; i++) px(i, -1, '#121216');                       // the bar
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) px(s < 0 ? -4 + i : 1 + i, j, '#121216');
    px(-4, 0, '#FFFFFF'); px(1, 0, '#FFFFFF');                               // pixel glints
    X.globalAlpha = alpha * .9; X.strokeStyle = PAL.ink; X.lineWidth = Math.max(1, p * .25);
    X.strokeRect(-5 * p, -p, 10 * p, p); X.strokeRect(-4 * p, 0, 3 * p, 2 * p); X.strokeRect(p, 0, 3 * p, 2 * p);
    X.restore();
  }
  const eyeMid = A => [(A.eyeL[0] + A.eyeR[0]) / 2, (A.eyeL[1] + A.eyeR[1]) / 2];
  const eyeDist = A => Math.max(8, Math.hypot(A.eyeR[0] - A.eyeL[0], A.eyeR[1] - A.eyeL[1]));
  function whistle(x, y, s, ang = 0) {                                      // a referee's whistle, s = px per jester unit
    X.save(); X.translate(x, y); X.rotate(ang); X.scale(s, s);
    shape(rectPts(-.2, -.45, 1.5, .9), { fill: '#D7DDE6', stroke: PAL.ink, lwPx: 2, smooth: .3 });
    circle(-.25, .25, .65, { fill: '#C3CAD5', stroke: PAL.ink, lwPx: 2 });
    line([[.2, -.25], [1.1, -.25]], { stroke: 'rgba(255,255,255,.8)', lwPx: 1.5 });
    X.restore();
  }
  // a little "z" floating off a sleepy head
  function zzz(x, y, s, t, k) {
    if (k < .01) return;
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .6 + i / 3);
      sfxStatic('z', x + (ph * 3 + i * .4) * s, y - ph * 6 * s, (26 + 20 * ph) * s / 6, '#CFE6FF', k * (1 - ph));
    }
  }
  function sfxStatic(txt, x, y, size, col, alpha) {
    overlay(() => { X.save(); X.globalAlpha = alpha; X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.lineJoin = 'round'; X.lineWidth = size * .18; X.strokeStyle = PAL.ink; X.strokeText(txt, x, y); X.fillStyle = col; X.fillText(txt, x, y); X.restore(); });
  }

  // ---------- poses ----------
  const H_REST = { footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7] };
  const H_CROSS = { handL: [2.3, -12.6], handR: [-2.3, -12.1], handPoseL: 'fist', handPoseR: 'fist' };
  function housamPose(t) {
    const talk = speaking('housam', t), ls = lastSpeaker(t, 'housam');
    let o = { ...H_REST, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'smile', 'o']), brows: 'normal', handPoseL: 'open', handPoseR: 'open',
      lookX: lookAt('housam', ls), turn: .15 * Math.sign(lookAt('housam', ls)), lookY: 0 };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < DROP) {                                                           // keepie-uppies on the right knee, bored
      const u = jugU(t), lift = Math.max(0, Math.cos(u * TAU)) ** 3;
      Object.assign(o, { footR: [1.5 + .4 * lift, -1.05 - 4.6 * lift], handL: [-5.0, -12.5], handR: [5.2, -12.0], lookX: .25, lookY: .55, turn: .05,
        tilt: .03 * Math.sin(t * 1.7 * TAU), dy: .25 * lift, eyes: 'open', brows: t > 18.2 && t < 20.4 ? 'focused' : 'normal', mouth: talk ? o.mouth : t > 9 ? 'flat' : 'smile' });
      return o;
    }
    if (t < FLICK + .4) {
      if (t < DROP + .5) Object.assign(o, { lookY: .7, lookX: .2 });
      o.footR = mix([1.5, -1.05], [3.6, -4.0], ease(seg(t, DROP + .3, DROP + .55)));    // sole on the ball
      if (talk) to('R', [5.3, -13.4 + .6 * Math.sin(t * 5)], 1, 'palm');
      if (t > 29.6 && t < 31.6) { to('L', [-4.0, -9.4], 1, 'fist'); o.tilt = -.05; }  // hand on hip
      if (t > 31.8 && t < FLICK) { to('R', [5.6, -18.5], 1, 'point'); o.brows = 'up'; o.mouth = talk ? o.mouth : 'grin'; }
      const flick = on(t, FLICK - .25, FLICK + .4, .12);
      if (flick > 0) { o.footR = mix([1.0, -1.3], [3.6, -6.2], ease(seg(t, FLICK - .1, FLICK + .05))); o.lean = -.06 * flick; o.handL = [-5.2, -14]; }
      return o;
    }
    // watching the adults
    o.lookX = .6; o.turn = .12;
    const take = on(t, 42.4, 43.5, .1);                                      // the double take: Safadi, Sami, Safadi
    if (take > 0) Object.assign(o, { lookX: t < 42.7 ? .4 : t < 43.0 ? .85 : .4, eyes: 'wide', brows: 'up', mouth: 'o', jump: 1.2 * kick(t, 42.45, 6) });
    if (t > 49.6 && t < 55) Object.assign(o, H_CROSS, { mouth: 'flat', brows: 'focused' });
    if (t > SHADES && t < 58.8) Object.assign(o, { mouth: 'flat', brows: 'focused' });
    // two fingers, a whistle
    const fw = on(t, 58.6, 60.2, .25);
    if (fw > 0) { to('L', [-.7, -20.8], fw, 'point'); to('R', [.7, -20.8], fw, 'point'); o.mouth = 'o'; o.eyes = t > FWEET ? 'squeeze' : 'open'; o.lookX = 0; o.turn = 0; o.brows = 'focused'; }
    if (t > 60.2 && t < 67.4) { o.lookX = -.75; o.turn = -.15; o.mouth = talk ? o.mouth : 'grin'; o.brows = 'up'; }
    if (t > 67.4 && t < 70.0) { to('L', [-5.6, -15.5], on(t, 67.5, 70.0, .25), 'palm'); o.lookX = talk ? .5 : -.6; o.mouth = talk ? o.mouth : 'grin'; }
    if (t > 70.2 && t < 72.9) Object.assign(o, { lookX: .7, brows: 'focused', mouth: 'smirk' });
    if (t > 72.9 && t < 74.6) Object.assign(o, { lookX: -.7, turn: -.12, brows: 'up', mouth: 'grin' });
    const deal = on(t, 74.6, 79.4, .2);
    if (deal > 0) { o = { ...o, ...(deal > .5 ? H_CROSS : {}) }; Object.assign(o, { lean: -.05 * deal, tilt: -.06 * deal, lookX: .6, turn: .1, mouth: talk ? lipFlap(t, true, 'grin', ['open', 'grin', 'O']) : 'smirk', brows: 'focused', jump: .8 * kick(t, 75.0, 5) }); }
    if (t > REF_WHISTLE + .2) Object.assign(o, { lookX: .25, lookY: -.15, turn: .05, brows: 'up', mouth: talk ? o.mouth : t > 86 ? 'grin' : 'o', ...(t > 80.6 ? {} : H_CROSS) });
    if (t > 86.8) Object.assign(o, { handL: [-4.6, -12.5], handR: [4.6, -12.5], handPoseL: 'fist', handPoseR: 'fist', dy: 1.0, footL: [-2.4, -1.05], footR: [2.4, -1.05], brows: 'focused', mouth: 'grin' });
    return o;
  }

  const A_REST = { handL: [-3.4, -4.9], handR: [3.4, -4.9] };
  const A_CROSS = { handL: [1.4, -6.9], handR: [-1.4, -6.6], handPoseL: 'fist', handPoseR: 'fist' };
  function almaPose(t) {
    const talk = speaking('alma', t), ls = lastSpeaker(t, 'alma');
    let o = { ...A_REST, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']), brows: 'normal', handPoseL: 'open', handPoseR: 'open',
      lookX: lookAt('alma', ls), turn: .1 * Math.sign(lookAt('alma', ls)), lookY: 0, hairSwing: .08 * wob(t, .4) };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < 25.3) {                                                           // politely listening… then asleep on her feet
      const doze = ease(seg(t, 21.0, 23.4));
      o.lookX = .6; o.turn = .1;
      if (doze > 0) {
        to('R', [1.2, -11.2], doze, 'fist');
        Object.assign(o, { eyes: doze > .7 ? 'closed' : 'open', tilt: .16 * doze + .03 * Math.sin(t * 1.3) * doze, dy: .25 * doze, lookY: .4 * doze, mouth: doze > .7 ? 'o' : 'flat', blink: doze > .3 && doze < .7 ? .7 : undefined });
      }
      return o;
    }
    if (t < 26.6) { const j = kick(t, 25.3, 6); return { ...o, eyes: 'wide', brows: 'up', mouth: 'O', jump: 1.6 * j, handL: [-4.6, -11], handR: [4.6, -11], handPoseL: 'palm', handPoseR: 'palm', emote: '!', emoteK: on(t, 25.3, 26.5, .1), lookX: .6 }; }
    if (t < 33.5) { o.lookX = t > 27.2 && t < 33 ? -.5 : .6; if (t > 31.8) { to('L', [-4.8, -11.5], on(t, 31.9, 33.4, .2), 'fist'); o.mouth = 'grin'; o.eyes = 'happy'; } return o; }
    o.lookX = .6; o.turn = .1;
    const take = on(t, 42.4, 43.5, .1);
    if (take > 0) Object.assign(o, { lookX: t < 42.6 ? .4 : t < 42.95 ? .9 : .5, eyes: 'wide', brows: 'up', mouth: 'O', jump: 1.4 * kick(t, 42.5, 6), emote: '?', emoteK: on(t, 42.6, 43.6, .1) });
    if (t > 43.5 && t < 45.5) { to('R', [4.9, -13.4], 1, 'point'); o.brows = 'up'; o.eyes = 'wide'; }
    const stomp = on(t, 53.0, 55.4, .15);
    if (stomp > 0) { to('L', [-3.6, -5.4], stomp, 'fist'); to('R', [3.6, -5.4], stomp, 'fist'); Object.assign(o, { brows: 'angry', jump: 1.3 * kick(t, 53.05, 7), sq: .1 * boing(t, 53.3, 3, 5), footR: mix([1.2, -.55], [1.2, -2.2], on(t, 53.0, 53.35, .1)) }); }
    if (t > SHADES && t < 58.8) Object.assign(o, { mouth: t < 56.4 ? 'O' : 'frown', brows: 'angry', eyes: 'open' });
    if (t > 59.4 && t < 67.4) { o.lookX = -.8; o.turn = -.15; o.eyes = t > 61.4 ? 'star' : 'open'; o.mouth = 'grin'; if (t > 61.4 && t < 63.4) { to('L', [-5, -11], 1, 'palm'); to('R', [5, -11], 1, 'palm'); o.jump = 1.2 * Math.abs(Math.sin((t - 61.4) * 6)); } }
    if (t > 72.9 && t < 74.6) Object.assign(o, { lookX: -.8, brows: 'up', mouth: 'grin' });
    const deal = on(t, 74.6, 79.4, .2);
    if (deal > 0) { o = { ...o, ...(deal > .5 ? A_CROSS : {}) }; Object.assign(o, { lean: .05 * deal, lookX: .6, mouth: talk ? lipFlap(t, true, 'grin', ['open', 'grin', 'O']) : 'smirk', brows: 'angry', hairSwing: .5 * kick(t, 75.0, 3), jump: .7 * kick(t, 75.0, 5) }); }
    if (t > REF_WHISTLE + .2) Object.assign(o, { lookX: .45, lookY: -.1, brows: 'up', mouth: t > 86 ? 'grin' : 'o' });
    return o;
  }

  function jennaPose(t) {
    const talk = speaking('jenna', t), ls = lastSpeaker(t, 'jenna');
    let o = { handL: [-2.6, -11.6], handR: [2.6, -11.6], handPoseL: 'fist', handPoseR: 'fist', mouth: lipFlap(t, talk, 'grin', ['open', 'grin', 'o']),
      brows: 'up', lookX: lookAt('jenna', ls), turn: .1 * Math.sign(lookAt('jenna', ls)), lookY: 0 };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < CART[1]) return { ...o, handL: [-3.4, -23.4], handR: [3.4, -23.4], handPoseL: 'palm', handPoseR: 'palm', footL: [-2.9, -.8], footR: [2.9, -.8], eyes: 'happy', mouth: 'grin', lookX: 0, turn: 0, noShadow: true };
    const land = on(t, CART[1], 62.9, .15);                                  // ta-da!
    if (land > 0 && t < 61.6) Object.assign(o, { handL: [-4.6, -22.0], handR: [4.6, -22.0], handPoseL: 'palm', handPoseR: 'palm', footR: [2.3, -1.6], sq: .12 * boing(t, CART[1], 3, 5), eyes: 'happy', lookX: 0, turn: 0 });
    if (t > 61.6 && t < 64.2) { to('R', [2.2, -22.6], on(t, 61.6, 64.2, .2), 'palm'); o.tilt = .06; o.lookX = 0; o.turn = 0; o.lookY = -.05; }   // salute
    if (t > 64.2 && t < 67.4) { o.lookX = -.8; o.turn = -.12; o.mouth = 'grin'; }
    if (t > 72.9 && t < 74.6) Object.assign(o, { lookX: -.8, mouth: 'grin' });
    const deal = on(t, 74.6, 79.4, .2);
    if (deal > 0) { to('L', [-3.5, -10.6], deal, 'fist'); to('R', [3.5, -10.6], deal, 'fist'); Object.assign(o, { lookX: .6, tilt: .05, mouth: talk ? lipFlap(t, true, 'grin', ['open', 'grin', 'o']) : 'grin', jump: .7 * kick(t, 75.0, 5) }); }
    if (t > REF_WHISTLE + .2) Object.assign(o, { lookX: .5, lookY: -.1, mouth: t > 86 ? 'grin' : 'o' });
    return o;
  }

  function dannyPose(t) {
    const talk = speaking('danny', t), ls = lastSpeaker(t, 'danny'), at = AT.danny(t);
    let o = { handL: [-3.5, -9.8], handR: [3.5, -9.8], mouth: lipFlap(t, talk, 'grin', ['open', 'grin', 'o']), brows: 'up',
      lookX: lookAt('danny', ls), turn: .1 * Math.sign(lookAt('danny', ls)), lookY: 0, footR: [2.2, -2.4] };   // right sole on his ball
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < DRIB[1]) return { ...o, ...dannyDribble(at.p / 30, 1.2), handL: [-4.6, -13], handR: [4.6, -13], handPoseL: 'fist', handPoseR: 'fist', brows: 'focused', mouth: 'grin', lookY: .4, lookX: .3 };
    if (t > 65.0 && t < 67.2) { to('L', [-4.3, -19.3], 1, 'palm'); to('R', [4.3, -19.3], 1, 'palm'); o.jump = 1.4 * Math.abs(Math.sin((t - 65.1) * 5)); o.eyes = 'happy'; o.lookX = 0; o.turn = 0; o.footR = [1.5, -1.05]; }
    if (t > 67.2 && t < 72.9) Object.assign(o, { lookX: .7, turn: .1 });
    const give = on(t, 72.9, 74.6, .2);                                      // "Here!"
    if (give > 0) { to('R', [4.4, -18.5], give, 'fist'); Object.assign(o, { lookX: .5, eyes: 'happy', brows: 'up', mouth: talk ? o.mouth : 'grin' }); }
    const deal = on(t, 74.6, 79.4, .2);
    if (deal > 0) { to('L', [-3.0, -9.6], deal, 'fist'); to('R', [3.0, -9.6], deal, 'fist'); Object.assign(o, { lookX: .6, mouth: talk ? lipFlap(t, true, 'grin', ['open', 'grin', 'o']) : 'grin', brows: 'focused', jump: .9 * kick(t, 75.0, 5) }); }
    if (t > REF_WHISTLE + .2) Object.assign(o, { lookX: .55, lookY: -.15, mouth: t > 86 ? 'grin' : 'o' });
    return o;
  }

  function safadiPose(t) {
    const talk = speaking('safadi', t), ls = lastSpeaker(t, 'safadi');
    let o = { handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', brows: 'normal',
      mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']), lookX: -.6, turn: -.12, lookY: 0 };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < 26.8) {                                                           // the lecture
      if (talk) to('L', [-5.3, -12.6 + .5 * Math.sin(t * 4)], 1, 'palm');
      if (t > 4.2 && t < 7.2) { to('R', [5.8, -21.4], 1, 'point'); o.brows = 'up'; }
      for (const [t0] of LESSONS) {                                           // power up and present each lesson
        const pk = on(t, t0, t0 + 3.4, .3);
        if (pk > 0) { to('R', [5.8, -14.4], pk, 'palm'); Object.assign(o, { power: .55 * pk, eyes: pk > .5 ? 'glow' : 'open', brows: 'up', lookX: pk > .5 && t < t0 + 1.4 ? .7 : -.5, turn: pk > .5 && t < t0 + 1.4 ? .15 : -.1 }); }
      }
      if (t > 24.4) { to('L', [-1.2, -12.2], 1, 'fist'); to('R', [1.2, -12.2], 1, 'fist'); Object.assign(o, { eyes: 'happy', brows: 'up', mouth: talk ? o.mouth : 'smile' }); }
      return o;
    }
    if (t < SHIN - .3) {                                                      // listening to the challenge
      if (t > 29.6) { to('R', [.8, -16.1], on(t, 29.6, 32.4, .3), 'fist'); o.brows = 'quizzical'; o.mouth = 'flat'; o.eyes = 'narrow'; }
      if (t > 32.4) Object.assign(o, { eyes: 'wide', lookY: -.3, brows: 'up', mouth: 'o' });
      return o;
    }
    if (t < 36.2) {                                                           // the trap that wasn't
      const trap = on(t, SHIN - .3, SHIN + .4, .12), oops = seg(t, SHIN, SHIN + .2);
      o.footR = mix([1.25, -.8], [2.6, -3.6], trap);
      Object.assign(o, { lookX: -.2, lookY: .6, eyes: oops > 0 ? 'squeeze' : 'wide', brows: oops > 0 ? 'worried' : 'focused', mouth: oops > 0 ? 'wobble' : 'o', handL: [-5.2, -12], handR: [5.2, -12], handPoseL: 'palm', handPoseR: 'palm' });
      if (t > SHIN + .8) { Object.assign(o, { lookX: .8, lookY: .3, eyes: 'open', mouth: 'flat', brows: 'worried', emote: 'sweat', emoteK: on(t, SHIN + .9, 35.9, .2), handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' }); }
      if (t > 35.0) { to('R', [.9, -18.2], on(t, 35.0, 36.2, .15), 'fist'); o.eyes = 'closed'; o.lookX = 0; o.dy = .2 * Math.abs(Math.sin(t * 14)); }   // ahem
      return o;
    }
    if (t < 37.7) { Object.assign(o, { eyes: 'narrow', mouth: talk ? o.mouth : 'smirk', brows: 'up', lookX: -.5 }); return o; }
    const call = on(t, 37.7, 39.0, .15);                                    // SAMI!
    if (call > 0) { to('L', [-3.0, -20.2], call, 'palm'); to('R', [3.0, -20.2], call, 'palm'); Object.assign(o, { lookX: .9, turn: .3, mouth: 'O', brows: 'up', eyes: 'open', lean: .04 * call }); }
    if (t > 39.0 && t < 42.4) Object.assign(o, { lookX: .9, turn: .25, mouth: 'grin', brows: 'up' });
    if (t > 42.4) { o.lookX = lookAt('safadi', ls); o.turn = .1 * Math.sign(o.lookX); }
    if (t > 42.4 && t < 45.4) Object.assign(o, { lookX: -.6, turn: -.12, eyes: 'happy', mouth: 'grin' });
    if (t > 45.6 && t < 47.4) { to('R', [6.0, -13.4], 1, 'palm'); o.lookX = -.5; }
    if (t > 49.6 && t < 51.0) { to('R', [5.0, -20.5], 1, 'point'); o.brows = 'up'; o.lookX = -.6; }
    if (t > 51.0 && t < SHADES) Object.assign(o, { mouth: 'smirk', lookX: -.6 });
    // the shades go on
    if (t >= SHADES - .4 && t < 59) {
      const put = on(t, SHADES - .4, SHADES + .5, .15);
      to('R', [1.8, -23.5], put, 'palm');
      if (t > SHADES + .4) { to('L', [-4.4, -9.6], 1, 'fist'); to('R', [4.4, -9.6], 1, 'fist'); }
      Object.assign(o, { lookX: -.4, turn: -.05, mouth: talk ? lipFlap(t, true, 'smirk', ['smirk', 'open', 'smile']) : 'smirk', brows: 'normal', tilt: -.05 * ease(seg(t, SHADES, SHADES + .4)), lean: -.03 });
    }
    if (t > 59 && t < 70) Object.assign(o, { lookX: -.75, turn: -.15, mouth: 'smirk', handL: [-4.4, -9.6], handR: [4.4, -9.6], handPoseL: 'fist', handPoseR: 'fist' });
    if (t > 63 && t < 70) Object.assign(o, { mouth: t > 67.6 ? 'flat' : 'o', brows: t > 67.6 ? 'worried' : 'up' });
    if (t >= LOWER - .2 && t < 73) {                                          // peers over the shades
      to('R', [1.6, -21.5], on(t, LOWER - .2, LOWER + .4, .15), 'point');
      if (t > LOWER + .4) to('R', [5.6, -13.4], 1, 'palm');
      Object.assign(o, { lookX: -.7, brows: 'worried', eyes: 'wide', mouth: talk ? o.mouth : 'o' });
    }
    if (t > 73 && t < 77.7) Object.assign(o, { lookX: -.75, turn: -.15, eyes: t > 75 ? 'wide' : 'open', brows: t > 75 ? 'up' : 'worried', mouth: t > 75 ? 'O' : 'flat', dy: t > 75 ? -.3 * kick(t, 75.05, 5) : 0 });
    const sweat = on(t, 77.7, REF_WHISTLE, .2);
    if (sweat > 0) Object.assign(o, { lookX: .85, turn: .2, eyes: 'open', brows: 'worried', mouth: 'wobble', emote: 'sweat', emoteK: sweat });
    if (t > REF_WHISTLE + .2) Object.assign(o, { lookX: -.2, lookY: -.15, turn: -.05, brows: 'up', eyes: 'open', mouth: t > 86 ? 'grin' : 'o', emote: null });
    if (t > 86.8) Object.assign(o, { handL: [-4.6, -11.5], handR: [4.6, -11.5], handPoseL: 'fist', handPoseR: 'fist', dy: .9, footL: [-2.2, -.8], footR: [2.2, -.8], brows: 'focused', mouth: 'smirk' });
    return o;
  }

  function samiPose(t) {
    const talk = speaking('sami', t), ls = lastSpeaker(t, 'sami'), at = AT.sami(t);
    let o = { handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', brows: 'up',
      mouth: lipFlap(t, talk, 'grin', ['grin', 'open', 'o', 'smile']), lookX: lookAt('sami', ls), turn: .1 * Math.sign(lookAt('sami', ls)), lookY: 0 };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < 42.4) {                                                           // peeks out, waves, jogs over
      if (at.moving) Object.assign(o, samiWalk(at.p / 52, 1.2));
      to('R', [4.6 + .5 * Math.sin(t * 9), -19.5], 1, 'palm');
      Object.assign(o, { lookX: -.6, turn: -.25, eyes: 'happy', mouth: 'grin' });
      return o;
    }
    if (t > 47.6 && t < 49.4) { to('L', [-4.6 + .5 * Math.sin(t * 9), -19.5], 1, 'palm'); to('R', [2.5, -11.5], 1, 'stethoscope'); o.eyes = 'happy'; o.lookX = -.7; }
    if (t > 51.2 && t < 53.0) { to('R', [6.4, -20.6], 1, 'fist'); o.jump = .8 * kick(t, 51.3, 5); o.lookX = -.7; }
    if (t > 53.0 && t < SHADES) Object.assign(o, { lookX: -.7, mouth: 'smirk' });
    if (t >= SHADES - .4 && t < 59) {
      const put = on(t, SHADES - .4, SHADES + .5, .15);
      to('L', [-1.8, -23.5], put, 'palm');
      if (t > SHADES + .4) { to('L', [-4.4, -9.6], 1, 'fist'); to('R', [4.4, -9.6], 1, 'fist'); }
      Object.assign(o, { lookX: -.6, turn: -.1, mouth: talk ? lipFlap(t, true, 'grin', ['grin', 'open', 'smile']) : 'grin', tilt: .05 * ease(seg(t, SHADES, SHADES + .4)), lean: -.03 });
    }
    if (t > 59 && t < 73) Object.assign(o, { lookX: -.75, turn: -.15, mouth: t > 67.6 ? 'o' : 'grin', brows: t > 67.6 ? 'worried' : 'up', handL: [-4.4, -9.6], handR: [4.4, -9.6], handPoseL: 'fist', handPoseR: 'fist' });
    if (t > 73 && t < 77.7) Object.assign(o, { lookX: -.75, eyes: t > 75 ? 'wide' : 'open', brows: 'up', mouth: t > 75 ? 'O' : 'flat', dy: t > 75 ? -.3 * kick(t, 75.05, 5) : 0 });
    const sweat = on(t, 77.7, REF_WHISTLE, .2);
    if (sweat > 0) Object.assign(o, { lookX: -.85, turn: -.2, brows: 'worried', mouth: 'wobble', emote: 'sweat', emoteK: sweat });
    if (t > REF_WHISTLE + .2) Object.assign(o, { lookX: -.45, lookY: -.15, turn: -.08, brows: 'up', mouth: t > 86 ? 'grin' : 'o', emote: null });
    if (t > 86.8) Object.assign(o, { handL: [-4.6, -11.5], handR: [4.6, -11.5], handPoseL: 'fist', handPoseR: 'fist', dy: .9, footL: [-2.2, -.8], footR: [2.2, -.8], brows: 'focused', mouth: 'grin' });
    return o;
  }

  function festerPose(t) {
    const talk = speaking('jester_fester', t), at = AT.jester_fester(t);
    let o = { referee: true, handL: [-2.2, -9.4], handPoseL: 'cup', handR: [3.3, -8.4], handPoseR: 'fist', mouth: lipFlap(t, talk, 'grin', ['open', 'grin', 'o', 'smile']),
      brows: 'up', lookX: 0, lookY: 0, eyes: 'open' };
    const to = (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
    if (t < JOG[1]) {                                                         // jogging in, ball under his arm
      const ph = at.p / 46, sn = Math.sin(ph * Math.PI);
      Object.assign(o, { footL: [-1.25, -.85 - 1.6 * Math.max(0, sn)], footR: [1.25, -.85 - 1.6 * Math.max(0, -sn)], dy: .35 * Math.abs(sn), jump: .5 * Math.abs(sn),
        handR: [3.6, -10.4 - 1.4 * sn], hatSway: [.6 * sn, .3], mouth: 'grin', eyes: 'happy' });
      return o;
    }
    if (talk && t < 84.6) { to('R', [4.6, -14.8], 1, 'open'); o.lookX = .2; }
    if (t > 82.2 && t < 84.6) Object.assign(o, { brows: 'up', tilt: .08, hatSway: [.3 * Math.sin(t * 3), 0] });
    const ref = on(t, 84.7, 86.9, .15);                                      // REFEREE!
    if (ref > 0) { to('R', [5.3, -15.4], ref, 'open'); Object.assign(o, { eyes: t > 85.6 ? 'star' : 'wide', jump: 2.2 * kick(t, 84.8, 4), sq: -.06 * kick(t, 84.8, 6), hatSway: [0, -.6 * kick(t, 84.8, 4)] }); }
    const place = on(t, PLACE, PLACE + 1.0, .25);                              // sets the ball down
    if (place > 0) { o.dy = 2.6 * place; to('L', [-2.4, -3.0], place, 'cup'); o.lookY = .7 * place; o.lean = .1 * place; }
    if (t > PLACE + .6) o.handL = mix(o.handL, [-3.3, -8.4], ease(seg(t, PLACE + .6, PLACE + 1.0))), o.handPoseL = 'open';
    const blow = on(t, 87.7, 95, .2);                                        // whistle to his lips
    if (blow > 0) { to('R', [.7, -15.3], blow, 'fist'); Object.assign(o, { eyes: t > TWEET - .05 ? 'squeeze' : 'open', mouth: 'o', brows: t > TWEET ? 'angry' : 'up', lookX: 0, lookY: 0 }); }
    if (t > TWEET) Object.assign(o, { sq: .1 * boing(t, TWEET, 4, 6), hatSway: [0, -1.2 * kick(t, TWEET, 3)], handL: [-5.3, -15.4], handPoseL: 'open', blush: 1.4 });
    return o;
  }

  // ---------- drawing everyone ----------
  const CAST = {
    housam: { pose: housamPose, rig: housam, unit: HOUSAM_UNIT },
    alma: { pose: almaPose, rig: alma, unit: ALMA_UNIT },
    jenna: { pose: jennaPose, rig: jenna, unit: JENNA_UNIT },
    danny: { pose: dannyPose, rig: danny, unit: DANNY_UNIT },
    safadi: { pose: safadiPose, rig: safadi, unit: SAFADI_UNIT },
    sami: { pose: samiPose, rig: sami, unit: SAMI_UNIT },
    jester_fester: { pose: festerPose, rig: jester, unit: JF_UNIT },
  };
  // Paint the set, the cast, the board and the balls in depth order. → { A: anchors, S: px/unit, P }
  function group(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {};
    const setO = { ...O_BASE, splitZ: o.splitZ ?? 4350, cheer: on(t, 75.2, 78.4, .3) * .5 + (o.cheer || 0) };
    layer(() => F.back(P, t, setO), { blur });
    const items = [];
    for (const [name, c] of Object.entries(CAST)) {
      if (SHOWN[name] && !SHOWN[name](t)) continue;
      const at = AT[name](t); if (P.depth(at.z) < 60) continue;
      items.push({ z: at.z, draw: () => {
        const [sx, sy, k] = P.p(at.x, 0, at.z), s = c.unit * k, pose = { ...c.pose(t), t };
        if (o.freeze) pose.boil = 0;
        if (name === 'jenna' && t < CART[1]) {                               // the cartwheel: spin her about her middle
          const a = TAU * 2 * seg(t, CART[0], CART[1]), cy = sy - 12.5 * s;
          X.save(); X.translate(sx, cy); X.rotate(a); X.translate(-sx, -cy);
          A[name] = c.rig(sx, sy, s, pose); X.restore();
          ellipse(sx, sy, 3 * s, .55 * s, { fill: 'rgba(40,20,30,.2)', stroke: null });
        } else A[name] = c.rig(sx, sy, s, pose);
        S[name] = s;
        props(t, name, A[name], s, sx, sy);
      } });
    }
    const bw = ballWorld(t);
    if (bw) items.push({ z: bw[2], draw: () => { const [bx, by, bk] = P.p(...bw); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: BALL_R / HOUSAM_UNIT, spin: t * (t < SHIN ? 8 : 5) }); } });
    if (t > PLACE + .55) items.push({ z: FBALL[2], draw: () => { const [bx, by, bk] = P.p(...FBALL); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: BALL_R / HOUSAM_UNIT }); } });
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(it => it.draw());
    F.front(P, t, setO);
    lessonBoard(t, P);
    flyingShades(t, A, S);
    return { A, S, P };
  }
  // Things each character carries
  function props(t, name, A, s, sx, sy) {
    if (name === 'housam' && t < DROP) {                                     // the keepie-uppie ball, off his right knee
      const u = jugU(t), hop = 4 * u * (1 - u);
      housamBall(A.kneeR[0] + .3 * s, A.kneeR[1] - (1.9 + 8.5 * hop) * s, s, { radius: BALL_R / HOUSAM_UNIT, spin: t * 6 });
    }
    if (name === 'danny') {                                                   // his own ball: dribbled in, then under his foot
      const at = AT.danny(t);
      if (t < DRIB[1]) { const q = Math.sin(at.p / 30 * Math.PI); dannyBall(sx + (2.9 + .6 * q) * s, sy - 1.35 * s, s, { spin: at.p / 20 }); }
      else dannyBall(sx + 2.4 * s, sy - 1.35 * s, s, { spin: 0 });
    }
    if (name === 'jester_fester') {
      const ball = t < PLACE + .55;
      if (ball) housamBall(A.handL[0] + .4 * s, A.handL[1] - 1.0 * s, s, { radius: BALL_R / JF_UNIT, spin: .3 });
      // the lanyard and whistle
      const nx = A.head[0], ny = A.head[1] + 3.2 * s, [hx, hy] = A.handR;
      const blow = t > 87.7;
      line([[nx - 1.2 * s, ny], [lerp(nx, hx, .5), Math.max(ny, hy) + 1.2 * s], [hx, hy]], { stroke: '#E0423A', lwPx: Math.max(1.5, .22 * s), smooth: true });
      whistle(hx + (blow ? -.2 : .2) * s, hy - .5 * s, s, blow ? -.5 : .3);
    }
    // sunglasses
    if (name === 'safadi' || name === 'sami') {
      const k = ease(seg(t, SHADES - .05, SHADES + .35)), low = name === 'safadi' ? on(t, LOWER, 73.3, .25) : 0;
      shades(A, k, { low });
    }
    const i = ['danny', 'jenna', 'alma', 'housam'].indexOf(name);
    if (i >= 0 && t > PIX[i]) { const [mx, my] = eyeMid(A), d = eyeDist(A); pixelShades(mx, my - .1 * d, d, (A.tilt || 0)); }
  }
  // Danny's pixel shades fly from his raised hand to each face
  function flyingShades(t, A, S) {
    if (!A.danny) return;
    ['danny', 'jenna', 'alma', 'housam'].forEach((n, i) => {
      const a = A[n]; if (!a || t < PIX[i] - .35 || t >= PIX[i]) return;
      const u = seg(t, PIX[i] - .35, PIX[i]), [hx, hy] = A.danny.handR, [mx, my] = eyeMid(a), d = eyeDist(a);
      pixelShades(lerp(hx, mx, u), lerp(hy - 20, my, u) - 160 * Math.sin(Math.PI * u) * (i ? 1 : .3), d * lerp(.8, 1, u), (1 - u) * TAU * (i % 2 ? 1 : -1));
      if (u > .85) sfx('pop!', mx, my - 2.2 * d, 38, PAL.goldLt, t - PIX[i] + .05, { life: .4 });
    });
  }
  // The floating chalkboard beside Safadi: one lesson after another
  function lessonBoard(t, P) {
    const t0 = LESSONS[0][0] - .1, t1 = 26.6; if (t < t0 || t >= t1) return;
    let cur = LESSONS[0]; for (const L of LESSONS) if (t >= L[0]) cur = L;
    // k: .2 = an empty board (it pops in and out below .2), .2 → 1 = the lesson chalks itself on; each lesson redraws it
    const kk = t > t1 - .4 ? .2 * (1 - seg(t, t1 - .4, t1)) : t < t0 + .35 ? .2 * seg(t, t0, t0 + .35) : .2 + .8 * seg(t, cur[0] + .2, cur[0] + 2.6);
    const [bx, by, bk] = P.p(BOARD.x, BOARD.y + 6 * Math.sin(t * 1.1), BOARD.z);
    if (P.depth(BOARD.z) < 80) return;
    safadiBoard(bx, by, BOARD.w * bk, Math.max(.001, kk), t, { kind: cur[1], title: cur[2] });
  }

  // ---------- callouts ----------
  const HEADW = { safadi: 6.6, sami: 6.6, alma: 6.8, housam: 3.6, jenna: 4.2, danny: 4.6, jester_fester: 3.9 };   // tail anchor: beside the face
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 12) continue;
      const c = { size: o.size || 50, maxW: o.maxW || 660, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {                                                          // one bubble for everyone saying it
        const ms = l.group.map(n => A[n]).filter(Boolean);
        if (ms.length) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 60, age, { ...c, size: (o.size || 50) * (l.kind === 'shout' ? 1.35 : 1.1), dx: 0, dy: -230 });
          continue;
        }
      }
      const a = A[l.speaker], s = S[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const sx = a.mouth[0], right = o.side ? o.side(l.speaker) > 0 : sx < W * .5, mid = !o.side && sx > W * .38 && sx < W * .62;
        const dx = mid ? (sx < W / 2 ? 140 : -140) : (right ? 1 : -1) * (o.far || 360);
        callout(l.text, sx + (right ? 1 : -1) * (HEADW[l.speaker] || 1.5) * s, a.mouth[1] - .6 * s, age, { ...c, dx: o.dx ?? dx, dy: o.dy ?? (mid ? -330 : -250) });
      } else {                                                               // off-screen: from the frame edge on their side
        const side = Math.sign(SIDE[l.speaker] || 0);
        const ex = side < 0 ? -30 : side > 0 ? W + 30 : W * .5, ey = side === 0 ? H + 40 : H * .42;
        callout(l.text, ex, ey, age, { ...c, dx: side < 0 ? 420 : side > 0 ? -420 : 0, dy: side === 0 ? -360 : -160 });
      }
    }
  }

  // ---------- cameras ----------
  const lock = (x, zc, f, feet, fz, y = 120) => ({ x, y, z: zc, f, hy: feet - y * f / (fz - zc), dir: 1 });
  // frame: centre x, subject depth fz, px-per-world-unit k there, feet at screen y
  const frame = (cx, fz, k, feet, f = 2400) => lock(cx, fz - f / k, f, feet, fz);
  const drift = (t, a = 1) => [10 * a * Math.sin(t * .23), 1 + .02 * a * Math.sin(t * .31)];
  const WIDE = t => { const [dx, dk] = drift(t); return frame(60 + dx, 4460, 1.75 * dk, 930); };

  // ---------- shots ----------
  function opening(t) {                                                      // a crane down from over the halfway line
    const u = ease(seg(t, 0, 4.0)), [dx, dk] = drift(4.0), f = lerp(1100, 2400, u), k = lerp(.45, 1.75 * dk, u);
    const cam = lock(lerp(-150, 60 + dx, u), 4460 - f / k, f, lerp(760, 930, u), 4460, lerp(1900, 120, u));
    const { A, S } = group(t, cam, 0);
    bubbles(t, A, S);
  }
  function wide(camFn, blur = .6, bo = {}) {
    return t => { const { A, S } = group(t, camFn(t), blur); bubbles(t, A, S, bo); extras(t, A, S); };
  }
  const lectureWide = wide(WIDE, .4);
  const boardShot = wide(t => { const [dx, dk] = drift(t); return frame(330 + dx, 4500, 2.8 * dk, 1010); }, 1.6, { size: 52, side: n => n === 'safadi' ? -1 : 1, dy: -300 });
  const kids2 = wide(t => { const [dx, dk] = drift(t); return frame(-255 + dx, 4425, 3.3 * dk, 1010); }, 2.2, { size: 52, side: n => n === 'alma' ? -1 : 1 });
  const houSingle = wide(t => frame(-130, 4420, 4.4 * (1 + .03 * seg(t, 18.4, 20.4)), 1040), 2.8, { size: 54 });
  const almSingle = wide(t => frame(-410, 4430, 5.6 * (1 + .03 * Math.sin(t * .4)), 1040), 2.8, { size: 54 });
  const safSingle = wide(t => { const [dx] = drift(t); return frame(260 + dx, 4500, 3.6 + .25 * seg(t, 36.2, 39.2), 1030); }, 2.6, { size: 54 });
  const adults2 = wide(t => { const [dx, dk] = drift(t); return frame(255 + dx, 4510, 3.0 * dk, 1000); }, 2.2, { size: 52 });
  const adultsPush = wide(t => frame(255, 4510, lerp(3.0, 3.9, ease(seg(t, 55.5, 58.6))), lerp(1000, 1080, ease(seg(t, 55.5, 58.6)))), 2.6, { size: 54 });
  const kidsWide = wide(t => { const [dx, dk] = drift(t); return frame(-430 + dx, 4425, 2.5 * dk, 990); }, 1.6, { size: 50 });
  const kidsLine = wide(t => { const [dx, dk] = drift(t, .6); return frame(-425 + dx, 4425, 2.95 * dk * (1 + .05 * ease(seg(t, 74.6, 77.6))), 1015); }, 2.0, { size: 52 });
  const allWide = wide(t => { const [dx, dk] = drift(t); return frame(-140 + dx, 4500, 1.42 * dk, 880); }, .4, { size: 50 });
  const festerSingle = wide(t => frame(10, 4760, 2.9 + .3 * seg(t, 82.2, 87.0), 960, 5200), 2.4, { size: 54 });
  function shelterReveal(t) {                                                // Sami steps out from behind the red team shelter
    const cam = lock(2780 + 15 * Math.sin(t * .3), 3950, 3600, 900, 6090, 140);
    const { A, S } = group(t, cam, .3, { splitZ: 6085 });
    if (A.sami) sfx('!', A.sami.head[0] + 50, A.sami.top[1] - 30, 70, PAL.goldLt, t - 39.6, { life: .6 });
    bubbles(t, A, S);
  }
  // The whistle, the punch-in, the freeze
  function finale(t, card = false) {
    const tt = Math.min(t, FREEZE), z = ease(seg(tt, TWEET, TWEET + .3)), sh = shakeXY(tt, 7 * kick(tt, TWEET, 5));
    const k = lerp(1.85, 2.7, z), cam = frame(lerp(-80, -5, z) - sh[0] / k, lerp(4560, 4760, z), k, lerp(950, 920, z) - sh[1], lerp(2400, 4200, z));
    const { A, S } = group(tt, cam, .4 + 1.6 * z, { freeze: t >= FREEZE });
    if (!card) bubbles(tt, A, S);
    if (A.jester_fester) {
      const a = A.jester_fester;
      sfx('TWEEEET!', a.head[0] + 40, a.top[1] - 90, 150, '#FFFDF4', tt - TWEET, { life: 60, rot: -.06 });
      const [wx, wy] = a.handR;
      if (tt >= TWEET) for (let i = 0; i < 3; i++) { const r = 40 + 34 * i + 160 * seg(tt, TWEET, TWEET + .3); overlay(() => { X.save(); X.globalAlpha = .7 - i * .18; X.strokeStyle = '#FFFDF4'; X.lineWidth = 6; X.beginPath(); X.arc(wx, wy, r, -.9, .9); X.stroke(); X.restore(); }); }
    }
    if (t >= FREEZE) {                                                        // freeze frame: a flash, then sepia and the card
      flash(.7 * kick(t, FREEZE, 8));
      overlay(() => {
        const k = ease(seg(t, FREEZE, FREEZE + .4));
        X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .55 * k; X.fillStyle = '#C9A46A'; X.fillRect(0, 0, W, H); X.restore();
        const c = backOut(seg(t, 89.6, 90.0)); if (c <= 0) return;
        X.save(); X.translate(W - 520, H - 170); X.rotate(-.05); X.scale(c, c);
        shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4D6', stroke: PAL.ink, lwPx: 8, smooth: .1 });
        X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
        X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = PAL.crimson; X.fillText('TO BE CONTINUED...', 0, 8);
        // an arrow, comic-style
        shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
        X.restore();
      });
      iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 92.6, 93.8))));
    }
  }
  const finaleShot = t => finale(t), cardShot = t => finale(t, true);

  // Things that ride on top of any shot
  function extras(t, A, S) {
    const h = A.housam, a = A.safadi;
    if (h) {
      const s = S.housam;
      sfx('FWEEEET!', h.head[0] - 8 * s, h.top[1] - 2 * s, 80, '#FFFDF4', t - FWEET, { life: .9, rot: -.08 });
      sfx('flick!', h.footR[0] + 5 * s, h.footR[1] - 6 * s, 56, PAL.goldLt, t - FLICK, { life: .5 });
    }
    if (A.alma && t > 23.2 && t < 25.3) zzz(A.alma.head[0] + 5 * S.alma, A.alma.top[1], S.alma, t, on(t, 23.2, 25.3, .2));
    if (a) {
      const s = S.safadi;
      sfx('BONK!', a.footR ? a.footR[0] : a.belly[0] + 2 * s, a.belly[1] + 6 * s, 76, '#FF9A6B', t - SHIN, { life: .6, rot: .1 });
      sfx('ahem', a.head[0] - 7 * s, a.head[1] - 2 * s, 46, PAL.cream, t - 35.3, { life: .8 });
      sfx('SHING!', a.head[0] + 6 * s, a.top[1] - 1 * s, 64, PAL.goldLt, t - SHADES - .3, { life: .6, rot: -.08 });
    }
    if (A.sami) sfx('SHING!', A.sami.head[0] + 6 * S.sami, A.sami.top[1] - 1 * S.sami, 64, PAL.goldLt, t - SHADES - .35, { life: .6, rot: .08 });
    if (A.jenna) sfx('TA-DA!', A.jenna.head[0], A.jenna.top[1] - 4 * S.jenna, 70, '#FFB3D9', t - CART[1], { life: .8, rot: .06 });
    if (A.jester_fester) sfx('TWEET!', A.jester_fester.head[0] + 9 * S.jester_fester, A.jester_fester.top[1], 70, '#FFFDF4', t - REF_WHISTLE - .5, { life: .6 });
    else if (t > REF_WHISTLE && t < REF_WHISTLE + 1) sfx('TWEEET!', W * .5, H * .16, 90, '#FFFDF4', t - REF_WHISTLE, { life: .8, rot: .05 });
    if (A.safadi && A.sami && t > 77.8 && t < 79.4) sfx('gulp', (A.safadi.head[0] + A.sami.head[0]) / 2, A.safadi.top[1] - 40, 50, '#8FD3FF', t - 78.4, { life: .7 });
  }

  scene({ duration: 94, fps: 24, bpm: 116,                 // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [4.0, lectureWide], [7.4, boardShot], [14.0, kids2], [15.2, boardShot], [18.4, houSingle], [20.4, boardShot],
      [23.6, almSingle], [26.0, kids2], [33.4, safSingle], [39.2, shelterReveal], [41.0, adults2], [42.4, kids2], [45.6, adults2],
      [53.0, almSingle], [55.4, adultsPush], [58.9, kidsWide], [67.4, kidsLine], [70.2, adults2], [72.9, kidsLine], [77.7, adults2],
      [79.4, allWide], [82.2, festerSingle], [87.0, finaleShot], [89.4, cardShot],
    ] });
})();
