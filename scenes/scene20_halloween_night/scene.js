// Scene 20: "The Infinite Candy Glitch". Halloween night in front of Alma's house (the House set, autumn, night: 1).
// Robo-Safadi stands at the foot of the porch steps. The grown-ups (Safadi, Doctor Sami, Fester and Dragon) are baffled; the
// kids drop hints but won't tell. Nothing works (BOO, Spooky, Pumpkin) until Safadi tries "Trick!" (broccoli) and Fester
// "Treat!" (candy). The twins work out the conditional. Fester: TREAT! TREAT! TREAT!, then everyone: an infinite candy glitch.
// Safadi frowns: "Let me explain…" and at the word, Clawd wakes up inside the robot's chest. Red eyes. "BEEP. BOOP." Everyone
// stares. Freeze. To be continued.
// Blocking (world units, left to right): Dragon (−800, 2450), Sami (−620, 2260), Safadi (−440, 2180), Fester (−240, 2250),
// Robo-Safadi (0, 2340), Housam (170, 2280), Danny (290, 2200), Alma (420, 2170), Jenna (560, 2250). Pure function of t.
(() => {
  const R = LOCATIONS.house, LINES = ASSETS.scene.scene20_halloween_night.dialogue, SET = { season: 'autumn', night: 1, wind: .6 };
  const ACCENT = { jester_fester: PAL.crimson, safadi: PAL.crimson, sami: '#2E6E9A', dragon: '#3E8E2E', alma: '#994EC4', jenna: '#D0508E', housam: '#425DA0', danny: '#2E7D9A', robo_safadi: '#FF2E2E' };

  // ---------- timing ----------
  const NOTHING = [[28.6, 'jester_fester'], [30.8, 'dragon'], [32.8, 'sami'], [34.0, 'sami'], [35.0, 'sami']];
  const GIVE = [[40.0, 'safadi', 'broccoli'], [45.7, 'jester_fester', 'candy'], [49.6, 'sami', 'broccoli'], [53.2, 'dragon', 'candy'],
    [71.0, 'jester_fester', 'candy'], [71.55, 'jester_fester', 'candy'], [72.1, 'jester_fester', 'candy'], [72.65, 'jester_fester', 'candy']];
  const FOUNTAIN = [73.4, 83.0], GAP = .11, FLIGHT = .7, UNEASY = 83.0, EXPLAIN = 87.5, HATCH = 87.9, WAKE = 88.6, RED = 89.6, BEEP = 90.4, STARE = 92.2, FREEZE = 94.4, END = 100;
  const RECIPS = ['jester_fester', 'sami', 'dragon', 'housam', 'danny', 'alma', 'jenna'];

  // ---------- the cast ----------
  const CAST = {
    dragon: { rig: dragon, unit: DRAGON_UNIT, at: [-800, 2450] },
    sami: { rig: sami, unit: SAMI_UNIT, at: [-620, 2260], bucket: 'R' },
    safadi: { rig: safadi, unit: SAFADI_UNIT, at: [-440, 2180] },
    jester_fester: { rig: jester, unit: JF_UNIT, at: [-240, 2250], bucket: 'R' },
    housam: { rig: housam, unit: HOUSAM_UNIT, at: [170, 2280], bucket: 'L', hat: 'horns' },
    danny: { rig: danny, unit: DANNY_UNIT, at: [290, 2200], bucket: 'L', hat: 'pumpkin' },
    alma: { rig: alma, unit: ALMA_UNIT, at: [420, 2170], bucket: 'L', hat: 'witch' },
    jenna: { rig: jenna, unit: JENNA_UNIT, at: [560, 2250], bucket: 'L', hat: 'cat' },
  };
  const ROBOT = [0, 2340], KIDS = ['housam', 'danny', 'alma', 'jenna'];
  const HAS_EMOTE = { jester_fester: 1, safadi: 1, sami: 1, alma: 1 };
  const HEADW = { jester_fester: 5.4, safadi: 6.6, sami: 6.6, dragon: 7, alma: 6.8, jenna: 4.6, housam: 5.6, danny: 5.4, robo_safadi: 6.6 };

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const lastLine = (t, not) => { let who = null; for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker; return who; };
  const xOf = n => n === 'robo_safadi' ? ROBOT[0] : CAST[n]?.at[0] ?? 0;
  const lookTo = (me, x) => clamp((x - CAST[me].at[0]) / 260, -.85, .85);
  const bounce = (t, f = 11, ph = 0) => Math.abs(Math.sin(t * f + ph));
  // who gets what, and when it lands
  const throws = (() => { const a = []; for (let i = 0; FOUNTAIN[0] + i * GAP < FOUNTAIN[1]; i++) a.push({ t0: FOUNTAIN[0] + i * GAP, who: RECIPS[Math.floor(hash(i * 2.7 + 1) * RECIPS.length)], kind: ['wrap', 'corn', 'bar', 'lolly', 'cane'][i % 5], i }); return a; })();
  const count = (who, t) => GIVE.filter(([g, w, it]) => w === who && it === 'candy' && t > g + .6).length + throws.filter(th => th.who === who && t > th.t0 + FLIGHT).length;
  const broccolis = (who, t) => GIVE.filter(([g, w, it]) => w === who && it === 'broccoli' && t > g + .6).length;

  // ---------- poses ----------
  const HAND = { R: (s) => [3.8, -9.6], L: () => [-3.8, -9.6] };
  function pose(name, t) {
    const C = CAST[name], talk = speaking(name, t), ls = lastLine(t, name), kid = KIDS.includes(name);
    const o = { mouth: lipFlap(t, talk, kid ? 'grin' : 'smile'), lookX: ls ? lookTo(name, xOf(ls)) : lookTo(name, ROBOT[0]), brows: 'normal' };
    o.turn = .3 * Math.sign(o.lookX);
    const set = p => Object.assign(o, p), b = C.bucket, free = b === 'R' ? 'L' : 'R', fs = free === 'L' ? -1 : 1;
    if (b) set({ ['hand' + b]: b === 'R' ? [3.8, -9.6] : [-3.8, -9.6], ['handPose' + b]: 'fist' });
    if (talk && name !== 'dragon') set({ ['hand' + free]: [fs * 4.4, -15 + .6 * Math.sin(t * 4)], ['handPose' + free]: 'palm' });
    const toRobot = lookTo(name, ROBOT[0]);
    // who is that? (the grown-ups)
    if (!kid && inW(t, 7.4, 17.6)) set({ eyes: 'wide', brows: 'up', lookX: talk ? o.lookX : toRobot, ...(HAS_EMOTE[name] ? { emote: name === 'safadi' ? '!' : '?', emoteK: on(t, name === 'safadi' ? 7.6 : 10.0, 17.4, .2) } : {}) });
    // the kids keep the secret
    if (kid && inW(t, 17.6, 28.2)) set({ mouth: talk ? o.mouth : 'smirk', eyes: talk ? 'open' : 'happy', lookX: talk ? -.5 : o.lookX });
    if (kid && inW(t, 26.4, 28.2)) set({ ['hand' + free]: [fs * .6, -18.6], ['handPose' + free]: 'point', mouth: 'smirk', eyes: 'wink' });
    // poking at the robot: nothing happens
    if (name === 'jester_fester' && inW(t, 28.4, 30.4)) set({ handL: [-4.6, -19], handPoseL: 'open', jump: 1.2 * kick(t, 28.6, 6), eyes: 'wide', mouth: talk ? o.mouth : 'O', lookX: toRobot });
    if (name === 'dragon' && inW(t, 30.6, 32.6)) set({ lookX: .6, mouth: talk ? 'open' : 'pout', brows: 'up' });
    if (name === 'sami' && inW(t, 32.6, 36.4)) set({ handL: [-4.4, -16 - 2 * bounce(t, 3)], handPoseL: 'point', lookX: toRobot, brows: 'up' });
    if (!kid && name !== 'dragon' && inW(t, 29.4, 36.4) && !talk) set({ mouth: 'flat', brows: 'worried' });
    if (kid && inW(t, 28.4, 36.4)) set({ mouth: 'smirk', lookX: lookTo(name, -300), eyes: bounce(t, 6) > .7 ? 'happy' : 'open' });
    // Safadi cracks it
    if (name === 'safadi') {
      if (inW(t, 36.4, 39.4)) set({ handR: [1.4, -16.4], handPoseR: 'point', brows: 'quizzical', lookX: toRobot, lookY: -.3 });
      if (inW(t, 39.4, 40.4)) set({ handR: [3.0, -19.6], handPoseR: 'point', eyes: 'wide', brows: 'up', jump: .5 * kick(t, 39.5, 6) });
      if (t > 40.5) set({ handR: [4.8, -13.2], handPoseR: 'fist' });                  // holding his broccoli from now on
      if (inW(t, 42.2, 45.0)) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: .2, lookY: .3 });
      if (inW(t, 55.2, 58.4)) set({ handL: [-4.6, -14 - 1.5 * (Math.floor((t - 55.2) / .8) % 2)], handPoseL: 'palm', brows: 'quizzical', lookY: -.2 });
      if (inW(t, 61.0, 63.4)) set({ handL: [-3.0, -19.6], handPoseL: 'point', eyes: 'wide', brows: 'up', lookX: -.7 });
    }
    if (name === 'jester_fester' && inW(t, 45.0, 49.0)) set({ handR: t < 46.4 ? [6.2, -12] : [3.8, -9.6], eyes: t > 46.3 ? 'happy' : 'open', jump: 1.4 * kick(t, 47.4, 5), mouth: talk ? o.mouth : 'grin' });
    if (name === 'sami') {
      if (inW(t, 49.0, 50.4)) set({ handR: [6.0, -12], lookX: toRobot });
      if (inW(t, 51.0, 52.6)) set({ mouth: talk ? o.mouth : 'flat', brows: 'quizzical', lookY: .5, lookX: .2 });
      if (inW(t, 58.6, 61.0)) set({ handL: [-3.0, -19.6], handPoseL: 'point', eyes: 'wide', brows: 'up', lookX: .7 });
    }
    if (name === 'dragon') {
      if (inW(t, 52.6, 53.7)) set({ mouth: 'open', eyes: 'wide', lookX: .7 });
      if (inW(t, 53.7, 56)) set({ mouth: 'smile', eyes: 'happy', cheeks: true, jump: 1.5 * kick(t, 53.8, 5), wings: .6, flap: Math.sin(t * 12) });
    }
    if ((name === 'housam' || name === 'danny') && inW(t, 63.4, 67.8)) set({ lookX: name === 'housam' ? .8 : -.8, turn: name === 'housam' ? .4 : -.4, mouth: talk ? o.mouth : 'smirk', lean: name === 'housam' ? .08 : -.08 });
    // the infinite candy glitch
    if (name === 'jester_fester' && inW(t, 67.8, 73.4)) set({ lookX: toRobot, eyes: t > 70.6 ? 'happy' : 'open', brows: 'up', ...(t > 70.6 ? { handL: [-4.4, -19 + bounce(t, 9)], handPoseL: 'fist', jump: .6 * bounce(t, 9) } : { handL: [-3.0, -19.6], handPoseL: 'point' }) });
    if (inW(t, FOUNTAIN[0], UNEASY) && name !== 'safadi') {
      const ph = hash(name.length * 3.3) * 6;
      if (name === 'dragon') set({ mouth: 'open', eyes: 'happy', cheeks: count(name, t) > 4, jump: 1.6 * bounce(t, 5, ph), wings: .7, flap: Math.sin(t * 13), lookX: .7 });
      else set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .9 * bounce(t, 6, ph), ['hand' + free]: [fs * 4.4, -19 + 1.2 * bounce(t, 6, ph)], ['handPose' + free]: 'fist', lookX: toRobot * .6 });
    }
    // Safadi grows uneasy, then explains
    if (name === 'safadi' && t > FOUNTAIN[0]) {
      const u = seg(t, 75, 81);
      if (t < UNEASY) set({ mouth: u < .3 ? 'smile' : u < .7 ? 'flat' : 'frown', brows: u < .5 ? 'up' : 'worried', lookX: .85, turn: .4, emote: t > 80.6 ? 'sweat' : null, emoteK: on(t, 80.8, 83.0, .2) });
      else if (t < EXPLAIN - .9) set({ brows: 'worried', mouth: talk ? o.mouth : 'frown', lookX: .85, turn: .4 });
      else if (t < STARE) set({ handL: [-3.0, -19.6], handPoseL: 'point', lookX: .6, brows: 'up', power: ease(seg(t, 86.8, 87.6)), eyes: t > 87.0 ? 'glow' : 'open' });
    }
    if (name !== 'safadi' && inW(t, UNEASY, STARE)) set({ lookX: lookTo(name, CAST.safadi.at[0]), eyes: 'open', mouth: name === 'dragon' ? 'o' : 'flat', brows: name === 'dragon' ? 'up' : 'worried', jump: 0 });
    // everyone stares at the robot
    if (t > STARE) {
      const k = backOut(seg(t, STARE + .1 + hash(name.length) * .4, STARE + .5 + hash(name.length) * .4));
      set({ lookX: toRobot, turn: .4 * Math.sign(toRobot), eyes: 'wide', mouth: name === 'dragon' ? 'o' : 'o', brows: 'up', jump: .5 * kick(t, STARE + .1, 6), power: 0,
        ...(HAS_EMOTE[name] ? { emote: '?', emoteK: k } : {}), ...(name === 'dragon' ? { question: k } : {}), ...(name === 'safadi' ? { handL: [-3.4, -8.4], handPoseL: 'open' } : {}) });
    }
    return o;
  }

  // Robo-Safadi: calm cyan; processes ("…") when it hears nothing it knows; happy beeps; the candy fountain; then Clawd wakes
  function robotPose(t) {
    const o = { eyes: 'open', mouth: 'flat', handL: [-4.4, -8.6], handR: [4.4, -8.6], handPoseL: 'claw', handPoseR: 'claw', antenna: .05 };
    for (const [nt] of NOTHING) if (inW(t, nt + .3, nt + 1.0)) Object.assign(o, { eyes: frac((t - nt) * 4) < .5 ? 'closed' : 'open', lookX: .3 * Math.sin(t * 9) });
    for (const [g, who] of GIVE) {
      const left = CAST[who].at[0] < ROBOT[0], u = on(t, g - .1, g + 1.1, .25);
      if (u > 0) { Object.assign(o, { eyes: 'happy', mouth: 'smile', lookX: left ? -.6 : .6 }); if (left) o.handL = mixPt([-4.4, -8.6], [-6.4, -15], u); else o.handR = mixPt([4.4, -8.6], [6.4, -15], u); }
    }
    if (inW(t, FOUNTAIN[0], UNEASY)) Object.assign(o, { eyes: 'happy', mouth: 'grin', handL: [-6.0, -18 + 4 * Math.sin(t * 14)], handR: [6.0, -18 + 4 * Math.cos(t * 14)], handPoseL: 'open', handPoseR: 'open', rot: .06 * Math.sin(t * 9), jump: .4 * bounce(t, 9), antenna: .3 * Math.sin(t * 12) });
    if (t > HATCH) Object.assign(o, { lookX: 0, eyes: t < RED ? (frac(t * 6) < .5 ? 'off' : 'open') : 'open', red: ease(seg(t, RED, RED + .25)), glitch: on(t, RED - .2, RED + .5, .1) * .6,
      brows: t > RED ? 'angry' : 'normal', mouth: t > BEEP && speaking('robo_safadi', t) ? lipFlap(t, true, 'flat', ['open', 'teeth', 'O']) : t > RED ? 'teeth' : 'flat', jump: 1.2 * kick(t, RED, 6), antenna: .4 * kick(t, RED, 4) * Math.sin(t * 30) });
    return o;
  }

  // ---------- the whole stage, for a camera ----------
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {};
    const actors = [];
    for (const [name, C] of Object.entries(CAST)) {
      const [x, z] = C.at; if (P.depth(z) < 60) continue;
      actors.push({ z, draw: () => {
        const [sx, sy, k] = P.p(x, 0, z), s = C.unit * k, ps = { ...pose(name, t), t };
        if (o.freeze) ps.boil = 0;
        layer(() => {
          A[name] = C.rig(sx, sy, s, ps); S[name] = s;
          if (C.hat) bdHat(C.hat, A[name], t);
          const n = count(name, t), wk = P.k(z);
          if (C.bucket) { const h = A[name]['hand' + C.bucket]; A[name].bucket = [h[0], h[1] + 4 * 5.6 * wk]; bdBucket(h[0], h[1], 5.6 * wk, { fill: clamp(n / 5), swing: .1 * Math.sin(t * 3 + x) });
            if (broccolis(name, t)) bdBroccoli(h[0] + 6 * wk, h[1] + 6 * wk, 4.2 * wk, .4); }
          if (name === 'safadi' && t > 40.5) bdBroccoli(A[name].handR[0], A[name].handR[1] + 3 * wk, 5 * wk, -.2 + .1 * Math.sin(t * 2));
          if (name === 'dragon') A[name].bucket = A[name].mouth;
          const pile = Math.max(0, n - 5) * (name === 'jester_fester' ? 7 : 4);                  // overflow piles up on the lawn (Fester gets buried)
          hnPile(P, x + (C.bucket === 'L' ? -26 : 26), z - 12, Math.min(pile, name === 'jester_fester' ? 95 : 55), x);
        }, { filter: 'brightness(.86) saturate(.92)' });
      } });
    }
    actors.push({ z: ROBOT[1], draw: () => {
      const [sx, sy, k] = P.p(ROBOT[0], 0, ROBOT[1]), s = ROBO_SAFADI_UNIT * k;
      layer(() => { A.robot = roboSafadi(sx, sy, s, { ...robotPose(t), t }); S.robot = s;
        if (t > HATCH) hnHatch(A.robot, s, t, ease(seg(t, HATCH, HATCH + .45)), t < WAKE ? 'closed' : t < RED - .3 ? 'normal' : 'red');
      }, { filter: 'brightness(.9)' });
    } });
    actors.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => R.back(P, t, { ...SET, splitZ: actors[0].z }), { blur });
    layer(() => { hnDecor(P, t); hnGlow(P, t); }, { blur: blur * .8 });
    if (o.bats) bdBats(t, 6, { y: 150, s: 9, spread: 140, speed: 110, col: '#0B0716' });
    actors.forEach((a, i) => { a.draw(); R.front(P, t, { ...SET, splitZ: a.z, toZ: actors[i + 1]?.z }); });
    deliveries(t, A, S, P);
    return { A, S, P };
  }
  // the robot's telescoping arm hands things over; the fountain flings candy into every bucket
  function deliveries(t, A, S, P) {
    const r = A.robot; if (!r) return;
    for (const [g, who, item] of GIVE) {
      const tg = A[who]; if (!tg || t < g || t > g + 1.3) continue;
      const left = CAST[who].at[0] < ROBOT[0], from = left ? r.handL : r.handR, to = who === 'safadi' ? tg.handR : tg.bucket || tg.mouth;
      const u = t < g + .45 ? easeOut(seg(t, g, g + .45)) : 1 - easeIn(seg(t, g + .75, g + 1.25)), end = mixPt(from, [to[0], to[1] - 20 * P.k(CAST[who].at[1])], u);
      if (u < .02) continue;
      bdArm(from, end, clamp(S.robot * 1.2, 6, 26), t, { open: t > g + .62 ? .9 : .3, item: t < g + .62 ? (x, y, a) => item === 'broccoli' ? bdBroccoli(x, y + 10, S.robot * .9, a + Math.PI / 2) : bdCandy(x, y, S.robot * 3.4, 'wrap', a) : null });
    }
    if (inW(t, FOUNTAIN[0], FOUNTAIN[1] + FLIGHT)) for (const th of throws) {
      const d = t - th.t0; if (d < 0 || d > FLIGHT) continue;
      const tg = A[th.who]; if (!tg) continue;
      const to = tg.bucket || tg.mouth, u = d / FLIGHT, x = lerp(r.top[0], to[0], u), y = lerp(r.top[1], to[1], u) - Math.sin(u * Math.PI) * 260 * (P.cam.f / 1000);
      bdCandy(x, y, S.robot * 3.2, th.kind, d * 9 + th.i);
    }
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const c = { size: (o.size || 48) * (l.kind === 'whisper' ? .85 : 1), maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W);
        if (ms.length > 1) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 40, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.25 : 1.1), dx: 0, dy: o.groupDy ?? -200 }); continue;
        }
      }
      const who = l.speaker === 'robo_safadi' ? 'robot' : l.speaker, a = A?.[who], s = S?.[who];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const side = o.side ? o.side(l.speaker) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * HEADW[l.speaker] * s * .9, a.mouth[1] - .6 * s, age, { ...c, size: l.kind === 'robot' ? c.size * 1.5 : c.size, dx: side * (o.far || 280), dy: o.dy ?? -220 });
      } else {
        const sd = xOf(l.speaker) > (o.cx ?? 0) ? 1 : -1;
        callout(l.text, sd > 0 ? W + 30 : -30, H * .4, age, { ...c, dx: -sd * 420, dy: -150 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1, cx: x }; };
  const WIDE = cam(-120, 150, 1150, 640, 1200);                              // the whole yard, the house, the moon
  const ADULTS = cam(-430, 140, 1700, 560);                                  // Dragon, Sami, Safadi, Fester and the robot
  const SAF_SAMI = cam(-530, 140, 1880, 540);
  const FESTER = cam(-130, 140, 1900, 520);                                  // Fester and the robot
  const DRAGON_SH = cam(-680, 160, 2050, 470);
  const KIDS_SH = cam(370, 130, 1830, 560);
  const GLITCH = cam(-100, 150, 1450, 600);                                  // the candy fountain: everyone, closer than WIDE
  const SAF_ROBOT = cam(-220, 150, 1700, 560);
  const BOYS_CU = cam(230, 115, 1950, 470);
  const SAF_CU = cam(-440, 160, 1930, 400);
  const ROBO_CU = t => ({ x: 0, y: 150, z: lerp(2125, 2150, ease(seg(t, 87.6, 92))), f: 1000, hy: 440, dir: 1, cx: 0 });
  const shot = (camFn, blur, bo = {}, go = {}) => t => { const c = camFn(t), { A, S, P } = stage(t, c, blur, go); bubbles(t, A, S, { cx: c.cx, ...bo }); extras(t, A, S, P); };

  function opening(t) {                                                       // from the street, up to the yard
    const u = ease(seg(t, .2, 6.6)), a = { x: 200, y: 260, z: -500, f: 1000, hy: 520 }, b = WIDE(t);
    const c = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u), dir: 1 };
    const { A, S, P } = stage(t, c, 0, { bats: true }); bubbles(t, A, S, { size: 44, cx: c.x, far: 220 }); extras(t, A, S, P);
  }
  const wide = shot(WIDE, 0, { size: 44, far: 220, dy: -200 }, { bats: true });
  const adults = shot(ADULTS, .8, { size: 48, side: n => n === 'dragon' ? 1 : -1, far: 220 });
  const safSami = shot(SAF_SAMI, 1.4, { size: 50, side: n => n === 'sami' ? -1 : 1, far: 260 });
  const fester = shot(FESTER, 1.4, { size: 50, side: () => -1, far: 260 });
  const dragonSh = shot(DRAGON_SH, 1.6, { size: 50, side: () => 1, far: 260 });
  const glitch = shot(GLITCH, .4, { size: 46, far: 220, dy: -200 });
  const kids = shot(KIDS_SH, 1.4, { size: 48, side: n => n === 'housam' || n === 'danny' ? -1 : 1, far: 240, groupDy: -240 });
  const safRobot = shot(SAF_ROBOT, 1.0, { size: 48, side: n => n === 'safadi' ? -1 : 1, far: 240 });
  const boysCU = shot(BOYS_CU, 2.0, { size: 50, side: n => n === 'housam' ? -1 : 1, far: 240 });
  const safCU = shot(SAF_CU, 2.4, { size: 52, side: () => 1, far: 280 });
  const roboCU = shot(ROBO_CU, 2.6, { size: 52, side: () => 1, far: 300, dy: -200 });
  function tbc(t) {
    const tt = Math.min(t, FREEZE), c = WIDE(tt), { A, S, P } = stage(tt, c, 0, { freeze: t > FREEZE, bats: true }); bubbles(tt, A, S, { size: 44, cx: c.cx, far: 220 }); extras(tt, A, S, P);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .4 * k; X.fillStyle = '#B08AD0'; X.fillRect(0, 0, W, H); X.restore();
      const cc = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (cc <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(cc, cc);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4D6', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#FF3A3A'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 98.4, 99.6))));
  }

  // things that ride on top of any shot
  function extras(t, A, S, P) {
    const r = A.robot;
    if (r) {
      for (const [nt] of NOTHING) sfx('...', r.head[0] + 7 * S.robot, r.top[1] - 2 * S.robot, 50, '#BFF3FF', t - nt - .4, { life: .8 });
      for (const [g, , item] of GIVE.slice(0, 4)) sfx(item === 'candy' ? 'DING!' : 'ZIP!', r.head[0] + 8 * S.robot, r.top[1], 54, item === 'candy' ? '#FFD45A' : '#9BEA5A', t - g - .55, { life: .7 });
      sfx('click!', r.chest[0] + 6 * S.robot, r.chest[1], 46, '#DCE3E7', t - HATCH, { life: .6 });
      if (t > RED && t < RED + .7) circle(r.antenna[0], r.antenna[1], S.robot * (1.5 + Math.sin(t * 40)), { fill: rgba('#FF2E2E', .5), stroke: null });
    }
    const f = A.jester_fester; if (f) sfx('CHOMP!', A.dragon ? A.dragon.mouth[0] : -999, A.dragon ? A.dragon.mouth[1] - 40 : 0, 52, '#9BEA5A', t - 53.8, { life: .6 });
    if (t > STARE) for (const n of ['dragon', 'housam', 'danny', 'jenna']) { const a = A[n]; if (a && n !== 'dragon') sfx('?', a.head[0] + 5 * S[n], a.top[1] - 2 * S[n], 64, PAL.goldLt, t - STARE - .2 - hash(n.length) * .4, { life: 99 }); }
  }

  scene({ duration: END, fps: 24, bpm: 120,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [7.4, safSami], [12.4, fester], [15.2, dragonSh], [17.6, kids], [28.2, adults], [36.4, safRobot],
      [45.0, fester], [49.0, adults], [52.6, dragonSh], [55.2, safSami], [63.4, boysCU], [67.8, fester], [73.2, glitch],
      [79.0, kids], [UNEASY, safCU], [EXPLAIN + .1, roboCU], [STARE, tbc],
    ] });
})();
