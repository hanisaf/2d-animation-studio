// Scene 23: "The Secret Potion". The DCES gym, scoreboard view (dir 1, +X is screen-right) throughout.
// Act 1: Jenna's cartwheels, Alma's flop, Housam's tease and Safadi's lesson on explicit vs tacit knowledge (two boards).
// Act 2: Housam dribbles, backflips and bicycle-kicks the ball into the scoreboard hoop; Danny wants a secret potion instead;
// the Safadi brothers wink: broccoli juice with unsweet tea. Act 3: Danny drinks it (BLEEECH!); Housam would rather practice.
// The week: day cards, Alma's cartwheel improving from a flop to the real thing on Friday, Danny on the bench with his cube
// and his potion. The brothers on the bench: "Nothing beats watching the kids grow their skills." To be continued.
// Blocking (world units, gym coordinates): see README.md. Every shot is a pure function of t.
(() => {
  const G = LOCATIONS.school_gym, LINES = ASSETS.scene.scene23_secret_potion.dialogue, B = SP_BENCH, R = 11;
  const ACCENT = { housam: '#425DA0', danny: '#2E7D9A', jenna: '#D0508E', alma: '#994EC4', safadi: PAL.crimson, sami: '#2E7D6A' };
  const HEADW = { safadi: 6.6, sami: 6.6, jenna: 4.6, alma: 6.6, housam: 3.6, danny: 4.6 };

  // ---------- timing ----------
  const CART1 = [4.6, 7.4], TRY1 = 11.6, JWALK = [16.6, 17.4], UP = 18.0, JUGGLE_END = 18.8, TEASE = 19.0, SWALK = [22.6, 24.6];
  const B1 = [31.4, 41.0], B2 = [41.0, 49.6], RUN = [55.0, 57.0], SBACK = [55.2, 57.4];
  const MEAN = 57.6, DRIB = [58.0, 61.0], FLIP = [61.4, 62.2], FLICK = 63.0, BIKE = [63.8, 64.8], HIT = 64.3, RIM = 65.85;
  const WHOA = 66.6, AHEM = 70.0, NOOO = 79.0, POTION = 81.4, WINK = 86.0, LAUGH1 = 98.4;
  const SWALK1 = [100.4, 103.0], SHOW = 101.4, HAND = [109.6, 110.4], OPEN = 111.6, DRINK = [112.2, 114.4], BLEH = 114.6, SWALK2 = [116.0, 117.4], NOPE = 118.8;
  const WEEK = 123.4, DAYS = [125.0, 128.6, 132.2, 135.8, 139.4], LEVEL = [0, .35, .6, .85, 1], SIP = 1.9, DID = 141.6;
  const BENCHT = 143.6, RAISE = 149.0, GAG = 150.6, LAUGH2 = 153.4, FREEZE = 155.6, END = 162;

  // ---------- helpers ----------
  const textLen = l => l.text.replace(/\*/g, '').length;
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < textLen(l); });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t >= a && t < b;
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const look = (meX, x, k = 1) => clamp((x - meX) / 140, -1, 1) * .85 * k;
  const tri = u => { const f = frac(u); return f < .5 ? f * 2 : 2 - f * 2; };
  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  const still = (p, y = 0) => ({ x: p[0], z: p[1], y, dist: 0, moving: false });
  const SEATZ = 1955, SEATX = { danny: 290, safadi: 430, sami: 570 };
  const seated = name => ({ x: SEATX[name], z: SEATZ, y: B.seat, dist: 0, moving: false, sit: true });

  // ---------- Jenna's cartwheels: [t0, t1, x0, x1, turns, z] ----------
  const JW = [[CART1[0], CART1[1], -620, -320, 2, 1560]];
  for (let k = 0; 58.0 + 5 * k + 1.2 < WEEK; k++) { const t0 = 58.0 + 5 * k; JW.push([t0, t0 + 1.2, k % 2 ? -490 : -640, k % 2 ? -640 : -490, 1, 1490]); }
  DAYS.forEach((d, i) => JW.push([d, d + 1.2, i % 2 ? -490 : -640, i % 2 ? -640 : -490, 1, 1490]));
  function jennaWheel(t) {
    for (const [a, b, x0, x1, n, z] of JW) if (t >= a && t < b) { const u = seg(t, a, b); return { x: lerp(x0, x1, u), z, spin: Math.sign(x1 - x0) * TAU * n * u }; }
    return null;
  }
  const jennaRestX = t => { let x = -640; for (const [a, b, x0, x1] of JW) if (t >= b && a > RUN[1]) x = x1; return t >= WEEK && t < DAYS[0] ? -640 : x; };

  // ---------- Alma's attempts: a level from 0 (flop) to 1 (a real cartwheel) ----------
  const AT = [{ t0: TRY1, level: 0, dir: -1, base: [-150, 1590], up: UP }];
  for (let k = 0; 60.6 + 5 * k + 3 < WEEK; k++) { const t0 = 60.6 + 5 * k; AT.push({ t0, level: .1 + .15 * hash(k + 3), dir: 1, base: [-420, 1530], up: t0 + 3.0 }); }
  DAYS.forEach((d, i) => AT.push({ t0: d + .9, level: LEVEL[i], dir: 1, base: [-420, 1530], up: d + 3.3 }));
  function almaTry(t, tr) {
    const u = t - tr.t0, L = tr.level, full = L >= .8, WIND = .4, travel = a => 150 * a / TAU;
    const aMax = full ? TAU : lerp(1.1, 2.9, clamp(L / .6)), RISE = full ? .9 : .45 + .35 * clamp(L / .6), WOB = full ? 0 : .22, FALL = .35;
    if (u < WIND) return { a: 0, dx: 0, wind: u / WIND, sit: 0 };
    if (u < WIND + RISE) { const a = full ? TAU * seg(u, WIND, WIND + RISE) : aMax * easeOut(seg(u, WIND, WIND + RISE)); return { a, dx: travel(a), spin: true, sit: 0 }; }
    if (full) {
      const land = u - WIND - RISE;
      if (L >= 1) return { a: 0, dx: 150, landed: land, sit: 0 };
      return { a: 0, dx: 150, landed: land, wobble: land < .35, sit: ease(seg(land, .35, .55)), fell: tr.t0 + WIND + RISE + .5 };
    }
    const v = u - WIND - RISE;
    if (v < WOB) return { a: aMax + .1 * Math.sin(v * 45), dx: travel(aMax), spin: true, sit: 0 };
    const f = seg(v - WOB, 0, FALL);
    return { a: aMax * (1 - easeIn(f)), dx: travel(aMax), spin: f < 1, sit: easeIn(f), fell: tr.t0 + WIND + RISE + WOB + FALL };
  }
  function almaState(t) {
    let tr = null; for (const a of AT) if (a.t0 <= t) tr = a;
    if (!tr) return null;
    const s = almaTry(t, tr), standUp = ease(seg(t, tr.up, tr.up + .5));
    return { ...s, tr, sit: s.sit * (1 - standUp), x: tr.base[0] + tr.dir * s.dx, z: tr.base[1] };
  }

  // ---------- where everyone is ----------
  function at(name, t) {
    const week = t >= WEEK;
    if (name === 'jenna') {
      const w = jennaWheel(t); if (w) return { x: w.x, z: w.z, y: 0, dist: 0, moving: false, spin: w.spin };
      if (t < JWALK[0]) return still([-320, 1560]);
      if (t < RUN[0]) return along([[-320, 1560], [-262, 1565]], t, JWALK);
      if (t < RUN[1] + .01) return along([[-262, 1565], [-640, 1490]], t, RUN);
      return still([jennaRestX(t), 1490]);
    }
    if (name === 'alma') {
      if (t < TRY1) return still([-150, 1590]);
      const st = almaState(t);
      if (t >= RUN[0] && t < RUN[1] + .3) return along([[-166, 1590], [-420, 1530]], t, RUN);
      return { x: st.x, z: st.z, y: 0, dist: 0, moving: false, spin: st.spin ? st.tr.dir * st.a : 0 };
    }
    if (name === 'housam') {
      if (week) { const u = (t - WEEK) / 4; return { x: -60 + 260 * tri(u), z: 1500, y: 0, dist: (t - WEEK) * 130, moving: true, drill: true }; }
      if (t < DRIB[0]) return still([120, 1620]);
      if (t < DRIB[1]) return { ...along([[120, 1620], [240, 1580], [40, 1560], [230, 1545], [240, 1560]], t, DRIB), dribble: true };
      return still([240, 1560]);
    }
    if (name === 'danny') return week ? seated('danny') : still([330, 1660]);
    if (name === 'safadi') {
      if (week) return seated('safadi');
      if (t < SWALK[0]) return still([480, 1880]);
      if (t < SBACK[0]) return along([[480, 1880], [10, 1700]], t, SWALK);
      return along([[10, 1700], [480, 1880]], t, SBACK);
    }
    if (name === 'sami') {
      if (week) return seated('sami');
      if (t < SWALK1[0]) return still([620, 1890]);
      if (t < SWALK2[0]) return along([[620, 1890], [620, 1760], [450, 1700]], t, SWALK1);
      return along([[450, 1700], [110, 1700]], t, SWALK2);
    }
  }

  // ---------- the ball: world [x, y, z] when loose; null while Housam has it (drawn with him) ----------
  const CONTACT = [230, 180, 1556], RIMW = [0, 280, 2355];
  function ballAt(t) {
    if (t < JUGGLE_END) return null;
    if (t < DRIB[0]) return [140, R, 1622];
    if (t < DRIB[1]) return null;
    if (t < FLICK) return [256, R, 1558];
    if (t < HIT) { const u = seg(t, FLICK, HIT); return [lerp(256, CONTACT[0], u), R + (CONTACT[1] - R) * u * (1.4 - u) / .4, lerp(1558, CONTACT[2], u)]; }
    if (t < RIM) { const u = seg(t, HIT, RIM); return [lerp(CONTACT[0], RIMW[0], u), lerp(CONTACT[1], RIMW[1], u) + 360 * Math.sin(Math.PI * u), lerp(CONTACT[2], RIMW[2], u)]; }
    if (t < RIM + .3) return [0, lerp(RIMW[1] - 6, 60, easeIn(seg(t, RIM, RIM + .3))), RIMW[2]];
    if (t < WEEK) { const b = t - RIM - .3; return [8 * easeOut(seg(b, 0, 3)), R + 120 * Math.abs(Math.sin(Math.PI * b / .62)) * Math.exp(-b * 1.9), RIMW[2] - 60 * easeOut(seg(b, 0, 3))]; }
    return null;
  }

  // ---------- poses ----------
  const kidBase = (name, t, rest = 'smile') => { const talk = speaking(name, t); return [{ mouth: lipFlap(t, talk, rest), brows: 'normal', lookX: 0, turn: 0 }, talk]; };
  const JSTAR = { handL: [-8.2, -20.6], handR: [8.2, -20.6], handPoseL: 'palm', handPoseR: 'palm', footL: [-5.2, -2.2], footR: [5.2, -2.2], eyes: 'happy', mouth: 'grin', lookX: 0, turn: 0 };
  const ASTAR = { handL: [-5.4, -10.6], handR: [5.4, -10.6], handPoseL: 'palm', handPoseR: 'palm', footL: [-3.6, -1.4], footR: [3.6, -1.4] };
  const almaAttemptActive = t => { const s = almaState(t); return s && t - s.tr.t0 < 3 && (s.spin || s.wind != null || s.landed != null); };

  function jennaPose(t, a) {
    const [o, talk] = kidBase('jenna', t, 'grin'), set = p => Object.assign(o, p);
    set({ giraffe: false, lookX: look(a.x, -150, .6) });
    if (a.spin) return set({ ...JSTAR, _spin: a.spin });
    if (a.moving) return set({ ...jennaSkip(a.dist / 44, 1), mouth: 'grin', handL: [-2.6, -11.6], handR: [2.6, -11.6] });
    if (t < CART1[0]) {                                                       // stretching, then "watch this!"
      const st = Math.sin(t * 2.2);
      set({ handL: [-2.2 + .8 * st, -22.6], handR: [2.2 + .8 * st, -22.6], handPoseL: 'palm', handPoseR: 'palm', lean: .1 * st, lookX: .6 });
      if (talk) set({ handR: [3.6, -21], handL: [-2.65, -1.1], handPoseL: 'hip', lean: 0, jump: .4 * bounce(t, 4) });
    } else if (t < 9.2) set({ handL: [-3.6, -21], handR: [3.6, -21], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', jump: 1.2 * kick(t, CART1[1] + .05, 5), lookX: .6 });   // ta-da!
    else if (t < UP) {
      set({ lookX: .7, mouth: talk ? o.mouth : 'smile', brows: 'up' });
      if (inW(t, 12.8, 14.4)) set({ eyes: 'wide', mouth: 'o', handL: [-1.4, -14.8], handR: [1.4, -14.8], handPoseL: 'palm', handPoseR: 'palm' });
      if (t > 14.4) set({ brows: 'worried', mouth: 'smile' });
      if (t > JWALK[1]) set({ handR: [4.4, -11.5], handPoseR: 'palm', lookX: .9, lookY: .5, brows: 'up' });   // a hand up
    } else if (t < SWALK[1]) set({ lookX: .8, eyes: inW(t, 20.5, 22.4) ? 'happy' : 'open', mouth: inW(t, 20.5, 22.4) ? 'open' : 'smile', dy: inW(t, 20.5, 22.4) ? .15 * bounce(t, 10) : 0 });   // giggles at the tease
    else if (t < RUN[0]) {                                                    // the lesson
      set({ lookX: look(a.x, 10), lookY: -.2, brows: 'up', mouth: 'smile' });
      if (t > 54.4) set({ eyes: 'happy', mouth: 'grin', handL: [-3.6, -21], handR: [3.6, -21], handPoseL: 'palm', handPoseR: 'palm', jump: 1.0 * kick(t, 54.6, 5) });
    } else {                                                                  // practice: cheering Alma on
      const al = at('alma', t);
      set({ lookX: look(a.x, al.x, 1.2), brows: 'up', mouth: 'smile' });
      if (almaAttemptActive(t)) set({ handL: [-1.3, -15.6], handR: [1.3, -15.6], handPoseL: 'palm', handPoseR: 'palm', mouth: 'o', eyes: 'wide' });
      if (t > DID - .2 && t < BENCHT) set({ handL: [-3.6, -21], handR: [3.6, -21], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 1.8 * bounce(t, 6) });
    }
    return o;
  }

  function almaPose(t, a) {
    const [o, talk] = kidBase('alma', t, 'smile'), set = p => Object.assign(o, p), st = t >= TRY1 ? almaState(t) : null;
    set({ brows: 'up' });
    if (a.moving) return set({ ...almaSkip(a.dist / 44, 1), mouth: 'grin', eyes: 'happy' });
    if (st && (st.spin || st.sit > 0 || st.wind != null || st.landed != null) && !(t >= RUN[0] && t < RUN[1] + .3)) {
      if (st.wind != null && !st.spin) set({ ...ASTAR, dy: .6 * Math.sin(st.wind * Math.PI), mouth: 'grin', eyes: 'open', lookX: st.tr.dir * .5 });
      if (st.spin) set({ ...ASTAR, _spin: a.spin, eyes: st.tr.level >= .8 ? 'happy' : 'squeeze', mouth: st.tr.level >= .8 ? 'grin' : 'O' });
      if (st.landed != null) {
        if (st.tr.level >= 1) set({ handL: [-5, -11], handR: [5, -11], handPoseL: 'palm', handPoseR: 'palm', eyes: 'star', mouth: talk ? o.mouth : 'grin', jump: 1.6 * bounce(t, 6), power: .5 * on(t, DID - .4, BENCHT, .3) });
        else if (st.wobble) set({ handL: [-5.2, -10 + 2 * Math.sin(t * 20)], handR: [5.2, -10 - 2 * Math.sin(t * 20)], eyes: 'wide', mouth: 'wobble', lean: .18 * Math.sin(t * 14) });
      }
      if (st.sit > 0) {                                                       // plop: sitting on the floor, a bit dizzy
        const k = st.sit;
        set({ dy: 3.6 * k, footL: [-3.1 * k - 1.5 * (1 - k), -.4], footR: [3.1 * k + 1.5 * (1 - k), -.4], handL: [-4.2, -3.6 + (1 - k) * -5], handR: [4.2, -3.6 + (1 - k) * -5], handPoseL: 'palm', handPoseR: 'palm',
          eyes: t - st.fell < .6 ? 'squeeze' : 'open', mouth: talk ? o.mouth : 'wobble', brows: 'worried', lookX: -.3, _sitDizzy: st.fell });
        if (st.tr.t0 === TRY1 && t > 14.2) set({ lookX: -.8, mouth: talk ? o.mouth : 'frown', eyes: 'open', _sitDizzy: null });
        if (st.tr.t0 === TRY1 && t > JWALK[1]) set({ handL: [-4.4, -9.6], handPoseL: 'palm', lookY: -.5, mouth: 'smile', brows: 'up' });
      }
      return o;
    }
    if (t < TRY1) {                                                           // watching Jenna
      set({ lookX: look(-150, at('jenna', t).x, 1.4), mouth: 'smile' });
      if (inW(t, CART1[0], CART1[1] + .4)) set({ eyes: 'star', mouth: 'O', handL: [-1.1, -11.6], handR: [1.1, -11.6], handPoseL: 'palm', handPoseR: 'palm' });
      if (t > 7.8) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', handL: [-4.6, -11.5], handR: [4.6, -11.5], handPoseL: 'palm', handPoseR: 'palm', jump: 1.2 * kick(t, 7.85, 4) });
      if (t > 10.6) set({ handR: [4.2, -12.2], handPoseR: 'fist', handL: [-3.4, -4.9], handPoseL: 'open', eyes: 'open', brows: 'angry', mouth: talk ? o.mouth : 'grin' });   // determined
    } else if (t < RUN[0]) {                                                  // standing again: the tease, the lesson
      set({ lookX: t < SWALK[0] ? look(a.x, 120) : look(a.x, 10), lookY: -.25, mouth: 'smile' });
      if (inW(t, 20.5, 22.4)) set({ eyes: 'happy', mouth: 'open', dy: .15 * bounce(t, 10) });
      if (t > 49.6) set({ eyes: 'wide', brows: 'up', mouth: 'o' });
      if (t > 54.0) set({ eyes: 'star', mouth: talk ? o.mouth : 'grin', handL: [-5, -11], handR: [5, -11], handPoseL: 'fist', handPoseR: 'fist', jump: 1.4 * kick(t, 54.2, 4) });
    } else set({ lookX: .1, mouth: 'smile', brows: 'up' });                    // between practice attempts
    return o;
  }

  function housamPose(t, a) {
    const [o, talk] = kidBase('housam', t, 'smile'), set = p => Object.assign(o, p);
    set({ footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7], handPoseL: 'open', handPoseR: 'open' });
    if (a.drill) return set({ ...housamDribble(a.dist / 44), brows: 'focused', mouth: 'smile', lookY: .55 });
    if (a.dribble) return set({ ...housamDribble(a.dist / 44), brows: 'focused', mouth: 'grin', lookY: .55 });
    if (t < JUGGLE_END) return set({ footR: [2.4, -2.1 - 1.2 * Math.max(0, Math.sin(t * 6.2))], handL: [-4.9, -13], handR: [4.8, -13], mouth: 'grin', lookY: .75 });
    if (t < SWALK[0]) {                                                       // the tease
      set({ lookX: .7, mouth: talk ? o.mouth : 'smirk', brows: 'up', handR: [4.8, -15.5], handPoseR: 'palm', footR: [2.2, -1.05] });
      if (t > 21.8) set({ eyes: 'wink', mouth: 'smirk', handR: [4.05, -10.7], handPoseR: 'open' });
    } else if (t < DRIB[0]) {                                                 // the lesson
      set({ lookX: look(a.x, at('safadi', t).x), brows: 'up', mouth: 'flat' });
      if (inW(t, 24.8, 27.6)) set({ eyes: 'wide', mouth: 'o', brows: 'worried' });
      if (inW(t, 44.8, 49.4)) set({ handR: [1.1, -21.2], handPoseR: 'fist', brows: 'focused', lookY: -.4 });
    } else if (t >= FLIP[0] && t < FLIP[1]) {
      const u = seg(t, FLIP[0], FLIP[1]);
      return set({ handL: [-5.4, -20], handR: [5.4, -20], eyes: 'squeeze', mouth: 'grin', brows: 'focused', footL: [-1.4, -6 + 2 * u], footR: [1.4, -6 + 2 * u], jump: 13 * Math.sin(Math.PI * u), _spin: -TAU * ease(u) });
    } else if (t >= BIKE[0] && t < BIKE[1]) {
      const u = seg(t, BIKE[0], BIKE[1]);
      return set({ handL: [-5.4, -20], handR: [5.4, -20], eyes: 'squeeze', mouth: 'grin', brows: 'focused', footL: [-1.4, -6], footR: u > .3 && u < .7 ? [2.0, -9.2] : [1.4, -6], jump: 13 * Math.sin(Math.PI * u), _spin: -TAU * ease(u) });
    } else if (t < WHOA) {
      set({ brows: 'focused', mouth: 'smirk', lookY: .5 });
      if (t >= FLIP[1] && t < FLICK) set({ sq: .15 * boing(t, FLIP[1], 3, 5), dy: .6 * kick(t, FLIP[1], 6), lookX: .4, lookY: .5 });
      if (inW(t, FLICK - .1, FLICK + .25)) set({ footR: [2.8, -4.8], lookY: -.5 });
      if (inW(t, FLICK + .25, BIKE[0])) set({ lookY: -.8, handL: [-4.6, -12], handR: [4.6, -12], dy: .7 });
      if (t >= BIKE[1]) set({ sq: .15 * boing(t, BIKE[1], 3, 5), lookX: -.6, lookY: -.6, brows: 'up', mouth: 'o' });
      if (t > RIM) set({ handL: [-5.2, -24], handR: [5.2, -24], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'grin', jump: 1.6 * kick(t, RIM + .05, 3), lookY: 0 });
    } else if (t < SWALK1[0]) {                                               // Danny begs; Housam does his best Safadi
      set({ lookX: .7, mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (inW(t, AHEM, 74.4)) set({ eyes: 'closed', tilt: -.07, lookY: -.3, handR: [3.6, -25], handPoseR: 'point', handL: [-2.2, -9.8], handPoseL: 'fist', mouth: talk ? o.mouth : 'smirk' });
      if (inW(t, 74.4, NOOO)) set({ handR: [5.4, -14.5], handPoseR: 'palm', eyes: 'happy' });
      if (t > NOOO) set({ brows: 'worried', mouth: 'flat', lookX: .8, handL: [-4.6, -14], handR: [4.6, -14], handPoseL: 'palm', handPoseR: 'palm', ...(t > 84 ? { handL: [-4.05, -10.7], handR: [4.05, -10.7] } : {}) });
    } else {                                                                  // the potion
      set({ lookX: look(a.x, 330), mouth: 'smile', brows: 'up' });
      if (inW(t, DRINK[0], BLEH + 1.2)) set({ eyes: t > BLEH ? 'squeeze' : 'wide', mouth: t > BLEH ? 'frown' : 'o', brows: 'worried' });
      if (inW(t, SWALK2[0], NOPE)) set({ lookX: t < 117.6 ? .8 : -.7, brows: 'focused', mouth: 'smirk', eyes: inW(t, 117.6, 118.4) ? 'wink' : 'open' });
      if (t > NOPE) set({ handL: [-5.2, -16], handR: [1.6, -17], handPoseL: 'palm', handPoseR: 'palm', turn: .25 * Math.sin((t - NOPE) * 7) * (1 - seg(t, NOPE + 1.4, NOPE + 2)), mouth: talk ? o.mouth : 'grin', brows: 'up', lookX: -.6 });
    }
    return o;
  }

  const sipping = t => DAYS.some(d => inW(t, d + SIP, d + SIP + .9));
  const shuddering = t => DAYS.some(d => inW(t, d + SIP + .9, d + SIP + 1.5));
  function dannyPose(t, a) {
    const [o, talk] = kidBase('danny', t, 'smile'), set = p => Object.assign(o, p);
    set({ handL: [-1.9, -11], handR: [1.9, -11], handPoseL: 'fist', handPoseR: 'fist', lookY: .55, brows: 'up', _cube: true });
    if (a.sit) {
      const sw = Math.sin(t * 2.3);
      set({ dy: 7.4, footL: [-1.6, 5.2 + .5 * sw], footR: [1.6, 5.2 - .5 * sw], handL: [-1.9, -9.2], handR: [1.9, -9.2] });
      if (t < BENCHT) {
        if (sipping(t)) set({ handR: [2.4, -19.2], handL: [-2.6, -8.6], eyes: 'squeeze', lookY: 0, _potion: { hand: 'handR', ang: -2.5, level: .8, open: true }, _cubeHand: 'handL' });
        if (shuddering(t)) set({ eyes: 'squeeze', mouth: 'wobble', brows: 'worried', tilt: .08 * Math.sin(t * 40), _cube: false });
      } else {
        set({ lookX: -.3 });
        if (t > GAG) set({ eyes: 'squeeze', mouth: 'wobble', brows: 'worried', tilt: -.1 + .05 * Math.sin(t * 30), lookX: .8, _cube: false, handL: [-1.4, -14.6], handR: [1.4, -14.6], handPoseL: 'palm', handPoseR: 'palm' });
        if (t > LAUGH2 + .6) set({ eyes: 'open', mouth: 'frown', tilt: 0 });
      }
      return o;
    }
    if (t < 58.0) {                                                           // the cube; giggles at the tease
      set({ mouth: talk ? o.mouth : 'flat' });
      if (inW(t, 20.5, 22.4)) set({ eyes: 'happy', mouth: 'grin', dy: .15 * bounce(t, 10), lookX: -.5, lookY: 0 });
      if (inW(t, CART1[0], CART1[1])) set({ lookX: -.8, lookY: 0, eyes: 'wide' });
      if (inW(t, 28.2, 54.0)) set({ lookX: -.6, lookY: .2 });
    } else if (t < WHOA) set({ _cube: t < 61.0, lookX: look(330, at('housam', t).x), lookY: t > HIT ? -.6 : 0, eyes: t > FLIP[0] ? 'wide' : 'open', mouth: t > FLIP[0] ? 'O' : 'o', handL: [-3.5, -9.8], handR: [3.5, -9.8], handPoseL: 'open', handPoseR: 'open' });
    else if (t < SWALK1[0]) {                                                 // teach me! … a secret potion
      set({ _cube: false, lookX: -.7, lookY: 0, handL: [-3.5, -9.8], handR: [3.5, -9.8], handPoseL: 'open', handPoseR: 'open', mouth: talk ? o.mouth : 'smile' });
      if (inW(t, WHOA - .2, AHEM)) set({ handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', jump: 1.4 * bounce(t, 6), brows: 'up' });
      if (inW(t, AHEM, NOOO)) set({ brows: 'focused', mouth: 'flat' });
      if (inW(t, NOOO, POTION)) set({ dy: .4, tilt: .12, brows: 'worried', mouth: talk ? o.mouth : 'frown', handL: [-3.2, -7.4], handR: [3.2, -7.4] });
      if (t > POTION) set({ lookY: -.6, lookX: -.2, eyes: t > POTION + 2.4 ? 'happy' : 'open', handL: [-1.0, -14.5], handR: [1.0, -14.5], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', mouth: talk ? o.mouth : 'grin' });
    } else {                                                                  // the potion
      set({ _cube: false, lookX: .7, lookY: 0, handL: [-3.5, -9.8], handR: [3.5, -9.8], handPoseL: 'open', handPoseR: 'open', mouth: talk ? o.mouth : 'smile' });
      if (inW(t, SHOW, 107.4)) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .9 * kick(t, SHOW + .1, 4) });
      if (inW(t, 107.4, HAND[0])) set({ eyes: 'wide', brows: 'worried', mouth: talk ? o.mouth : 'o' });
      if (t >= HAND[1]) set({ handR: [3.6, -12.4], handPoseR: 'fist', _potion: { hand: 'handR', ang: .05, level: 1, open: t > OPEN }, brows: 'worried', mouth: talk ? o.mouth : 'frown', lookX: .2, lookY: .4 });
      if (inW(t, DRINK[0], DRINK[1])) {
        const g = Math.sin((t - DRINK[0]) * 10.5);
        set({ handR: [2.4, -19.2], handL: [-3.6, -9.6], eyes: 'squeeze', brows: 'worried', mouth: 'o', lookY: 0, dy: .25 * Math.max(0, g), _potion: { hand: 'handR', ang: -2.5, level: 1 - .65 * seg(t, DRINK[0], DRINK[1]), open: true } });
      }
      if (t >= DRINK[1]) set({ handR: [3.6, -10.5], _potion: { hand: 'handR', ang: .1, level: .35, open: true } });
      if (inW(t, DRINK[1], SWALK2[0] + .4)) set({ eyes: 'squeeze', mouth: talk ? o.mouth : 'wobble', brows: 'worried', tilt: .07 * Math.sin(t * 38), jump: .6 * kick(t, BLEH, 5), handL: [-1.4, -14.8], handPoseL: 'palm' });
      if (t > SWALK2[0] + .4) set({ lookX: -.8, brows: 'worried', mouth: 'frown' });
    }
    return o;
  }

  const SIT_ADULT = { dy: 7.4, footL: [-2.1, 6.4], footR: [2.1, 6.4], handL: [-3.6, -3.4], handR: [3.6, -3.4], handPoseL: 'open', handPoseR: 'open' };
  function safadiPose(t, a) {
    const talk = speaking('safadi', t), o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.5, turn: -.2, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a.moving) return set({ ...safadiWalk(a.dist / 58, 1), lookX: t < 40 ? -.5 : .3, mouth: 'smile' });
    if (a.sit) {
      set({ ...SIT_ADULT, lookX: -.7, turn: -.25, brows: 'up' });
      if (t > BENCHT) {
        set({ lookX: -.6 });
        if (inW(t, 144.2, 149.0)) set({ handR: [1.0, -13.6], handPoseR: 'palm', eyes: t > 146.4 ? 'happy' : 'open' });
        if (inW(t, RAISE, LAUGH2)) set({ lookX: .7, turn: .25, brows: 'up', mouth: 'grin' });
        if (t > LAUGH2) set({ eyes: 'happy', mouth: 'open', dy: SIT_ADULT.dy + .25 * bounce(t, 10), handL: [-4.6, -11], handR: [4.6, -11], lookX: .3 });
      }
      return o;
    }
    if (t < SWALK[0]) {                                                       // by the bench
      set({ lookX: look(480, at('jenna', t).x, .9), brows: 'up' });
      if (t > TEASE) set({ lookX: -.6, brows: 'quizzical', mouth: 'flat' });
    } else if (t < SBACK[0]) {                                                // the lesson
      const pw = .45 * on(t, B1[0] - .3, B2[1], .5);
      set({ power: pw, eyes: pw > .3 ? 'glow' : 'open', lookX: .45, turn: .15, brows: 'up', handR: [6.2, -15.6], handPoseR: 'palm', handL: [-4.4, -8.1] });
      if (t < 28.2) set({ power: 0, eyes: 'open', lookX: .5, handR: [1.0, -14.6], handPoseR: 'thumb', brows: 'up' });
      if (inW(t, 28.2, B1[0])) set({ handL: [-5.6, -15.5], handR: [5.6, -15.5], handPoseL: 'point', handPoseR: 'point', lookX: 0, turn: 0 });   // TWO kinds
      if (inW(t, 44.8, 49.6)) set({ handL: [-1.2, -11.5], handPoseL: 'palm', eyes: 'happy' });                                               // inside you
      if (t > 49.6) set({ power: 0, eyes: 'open', lookX: -.8, turn: -.3, handL: [-6.0, -15], handPoseL: 'palm', handR: [4.4, -8.1], handPoseR: 'open' });
    } else if (t < SWALK1[0]) {                                               // watching the boys; the wink
      set({ lookX: -.7, turn: -.25, brows: 'up' });
      if (inW(t, FLIP[0], 67)) set({ eyes: 'wide', mouth: 'o' });
      if (inW(t, POTION, WINK)) set({ brows: 'up', mouth: 'o', lookX: -.9 });
      if (t > WINK) set({ lookX: .7, turn: .3, mouth: talk ? o.mouth : 'smirk', brows: 'up', eyes: inW(t, WINK + .4, WINK + 1.0) ? 'wink' : 'open' });
      if (inW(t, 91.2, LAUGH1)) set({ handR: [2.0, -17.4], handPoseR: 'palm', lean: .05 });
      if (t > LAUGH1) set({ eyes: 'happy', mouth: 'open', dy: .25 * bounce(t, 10), handL: [-5.2, -12], handR: [5.2, -12], lookX: .3 });
    } else set({ lookX: -.6, mouth: 'smirk', brows: 'up', ...(inW(t, BLEH, 116.4) ? { eyes: 'happy', mouth: 'grin' } : {}) });
    return o;
  }
  function samiPose(t, a) {
    const talk = speaking('sami', t), o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.6, turn: -.2, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a.sit) {
      set({ ...SIT_ADULT, lookX: -.75, turn: -.25, brows: 'up' });
      if (DAYS.some(d => inW(t, d + SIP + .9, d + SIP + 1.6))) set({ eyes: 'happy', mouth: 'grin', lookX: -.5 });   // Danny's face, every day
      if (t > BENCHT && t < RAISE) set({ lookX: -.8, eyes: inW(t, 146.4, 148.6) ? 'happy' : 'open' });
      if (inW(t, RAISE, LAUGH2)) set({ handR: [4.6, -16.6], handPoseR: 'fist', _potion: { hand: 'handR', ang: .15, level: .9 }, lookX: -.9, mouth: talk ? o.mouth : 'grin', eyes: t > 151 ? 'wink' : 'open' });
      if (t > LAUGH2) set({ eyes: 'happy', mouth: 'open', dy: SIT_ADULT.dy + .25 * bounce(t, 10, 1), handL: [-4.6, -11], handR: [4.6, -11], lookX: -.4 });
      return o;
    }
    if (a.moving) {
      set({ ...samiWalk(a.dist / 58, 1), lookX: -.6, mouth: 'smile' });
      if (t > SWALK2[0]) set({ handR: [4.8, -11.5], handPoseR: 'fist', _potion: { hand: 'handR', ang: .1, level: 1 }, lookX: .2 });
      else if (t > SHOW) set({ handR: [5.2, -15.5], handPoseR: 'fist', _potion: { hand: 'handR', ang: .12, level: 1 }, mouth: 'grin' });
      return o;
    }
    if (t < SWALK1[0]) {
      set({ lookX: -.7, brows: 'up' });
      if (inW(t, FLIP[0], 67)) set({ eyes: 'wide', mouth: 'O' });
      if (inW(t, POTION, WINK)) set({ lookX: -.9, mouth: 'o' });
      if (t > WINK) set({ lookX: -.8, turn: -.3, mouth: talk ? o.mouth : 'smirk', eyes: inW(t, WINK + .8, WINK + 1.4) ? 'wink' : 'open' });
      if (inW(t, 87.4, 91.2) || inW(t, 94.0, 96.0)) set({ handL: [-2.0, -18.6], handPoseL: 'palm', lean: -.05 });
      if (t > LAUGH1) set({ eyes: 'happy', mouth: 'open', dy: .25 * bounce(t, 10, 1), handL: [-5.2, -12], handR: [5.2, -12], lookX: -.3 });
    } else if (t < SWALK2[0]) {                                               // the gift
      set({ lookX: -.7, brows: 'up', handL: [-4.8, -15.5], handPoseL: 'fist', _potion: { hand: 'handL', ang: -.12, level: 1 } });
      if (inW(t, 107.4, HAND[0])) set({ brows: 'worried', handR: [5.4, -17], handPoseR: 'point' });
      if (t >= HAND[0]) set({ _potion: null, handL: inW(t, HAND[0], HAND[1] + .4) ? [-6.2, -12.5] : [-4.4, -8.1], handPoseL: 'open' });
      if (inW(t, DRINK[0], 116)) set({ eyes: inW(t, BLEH - .2, 116) ? 'happy' : 'open', mouth: inW(t, BLEH - .2, 116) ? 'grin' : 'smile', lookX: -.8 });
    } else {                                                                  // offering Housam one too
      set({ lookX: .8, turn: .2, handR: [6.4, -12.6], handPoseR: 'fist', _potion: { hand: 'handR', ang: .05, level: 1 }, mouth: 'grin', brows: 'up' });
      if (t > NOPE + .6) set({ handR: [4.6, -10], mouth: 'grin', eyes: inW(t, 121.0, 121.8) ? 'wink' : 'happy', lookX: 0, turn: 0, _potion: { hand: 'handR', ang: -.1, level: 1 } });
    }
    return o;
  }

  const CAST = {
    jenna: { rig: jenna, unit: JENNA_UNIT, pose: jennaPose, h: 11.8 }, alma: { rig: alma, unit: ALMA_UNIT, pose: almaPose, h: 10.5 },
    housam: { rig: housam, unit: HOUSAM_UNIT, pose: housamPose, h: 15 }, danny: { rig: danny, unit: DANNY_UNIT, pose: dannyPose },
    safadi: { rig: safadi, unit: SAFADI_UNIT, pose: safadiPose }, sami: { rig: sami, unit: SAMI_UNIT, pose: samiPose },
  };
  const GSET = t => ({ lights: 1, sun: .75, swish: t > RIM ? kick(t, RIM, 3) : 0, score: { home: t > RIM ? 2 : 0, guest: 0 }, clock: 600, period: 1 });

  // ---------- the stage, for a camera ----------
  function drawChar(P, name, a, t, A, S, fz) {
    const c = CAST[name], pose = { ...c.pose(t, a), t, ...fz };
    const [sx, sy, k] = P.p(a.x, a.y || 0, a.z), s = c.unit * k;
    if (pose._spin) {                                                         // cartwheels and flips spin about the middle
      const lift = name === 'housam' ? 0 : (name === 'jenna' ? 5 : 3) * (1 - Math.cos(pose._spin)) / 2;   // big heads: rise a little when upside down
      const cy = sy - ((c.h || 12) + lift + (pose.jump || 0)) * s;
      X.save(); X.translate(sx, cy); X.rotate(pose._spin * P.dir); X.translate(-sx, -cy);
      A[name] = c.rig(sx, sy, s, { ...pose, noShadow: true }); X.restore();
      ellipse(sx, sy, 3 * s, .55 * s, { fill: 'rgba(40,20,30,.2)', stroke: null });
    } else A[name] = c.rig(sx, sy, s, { ...pose, noShadow: pose.noShadow || a.sit });
    S[name] = s;
    const Ax = A[name];
    // the ball, when Housam has it
    if (name === 'housam' && !ballAt(t)) {
      if (t < JUGGLE_END) { const h = 2.1 + 2.1 * Math.abs(Math.sin(t * 3.1)); housamBall(sx + 3.7 * s, sy - h * s, s, { spin: t * 4 }); }
      else if (a.dribble || a.drill) { const p = a.dist / 44; housamBall(sx + (2.9 + .6 * Math.sin(p * Math.PI)) * s, sy - (1.35 + .2 * Math.abs(Math.sin(p * Math.PI))) * s, s, { spin: t * 3 }); }
    }
    if (pose._cube) { const hd = pose._cubeHand ? Ax[pose._cubeHand] : [(Ax.handL[0] + Ax.handR[0]) / 2, (Ax.handL[1] + Ax.handR[1]) / 2]; spCube(hd[0], hd[1] - .9 * s, s * .5, t, { ang: .05 * Math.sin(t * 3) }); }
    if (pose._potion) { const p = pose._potion, h = Ax[p.hand]; spPotion(h[0], h[1], k * 2.8, { ...p, t, grip: true }); }
    if (name === 'danny' && a.sit && !pose._potion) { const [bx, by] = P.p(a.x - 40, B.seat, a.z - 4); spPotion(bx, by, k * 2.8, { t, level: .7, open: true }); }   // the potion waits on the bench
    if (name === 'alma' && pose._sitDizzy != null && t - pose._sitDizzy > 0 && t - pose._sitDizzy < 2.6) {                     // dizzy stars
      for (let i = 0; i < 3; i++) { const ang = t * 5 + i * TAU / 3; shape(starPts(Ax.top[0] + Math.cos(ang) * 6 * s, Ax.top[1] + 1.5 * s + Math.sin(ang) * 1.6 * s, 1.1 * s), { fill: PAL.goldLt, stroke: PAL.ink, lwPx: Math.max(1.5, .25 * s) }); }
    }
  }
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {}, items = [];
    const fz = o.freeze ? { boil: 0 } : {};
    for (const name of Object.keys(CAST)) {
      const a = at(name, t); if (P.depth(a.z) < 40) continue;
      items.push({ z: a.z, draw: () => drawChar(P, name, a, t, A, S, fz) });
    }
    if (P.depth(B.z1) > 40) items.push({ z: B.z1, draw: () => spBench(P) });
    const bw = ballAt(t);
    if (bw && P.depth(bw[2]) > 40) items.push({ z: bw[2], draw: () => { const [bx, by, bk] = P.p(...bw); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: R / HOUSAM_UNIT, spin: t * 9 }); } });
    items.sort((p, q) => P.depth(q.z) - P.depth(p.z));
    const gs = GSET(t);
    layer(() => G.back(P, t, { ...gs, splitZ: items.length ? items[0].z : -Infinity }), { blur });
    items.forEach((it, i) => { it.draw(); G.front(P, t, { ...gs, splitZ: it.z, toZ: items[i + 1]?.z }); });
    overWorld(t, P, A, S);
    return { A, S, P };
  }
  // things over everyone: the boards, the sound effects, the potion changing hands
  const BOARDW = [175, 335, 1720], BOARD_W = 240;
  function overWorld(t, P, A, S) {
    for (const [kind, title, b0, b1] of [['explicit', 'EXPLICIT KNOWLEDGE', ...B1], ['tacit', 'TACIT KNOWLEDGE', ...B2]]) {
      if (!inW(t, b0, b1) || !P.visible(BOARDW[2])) continue;
      const [bx, by, bk] = P.p(...BOARDW), out = 1 - ease(seg(t, b1 - .25, b1));
      safadiBoard(bx, by, BOARD_W * bk * out, seg(t, b0, b0 + 3.2), t, { kind, title });
    }
    if (inW(t, HAND[0], HAND[1]) && A.sami && A.danny) {                      // the potion, from Sami's hand to Danny's
      const u = ease(seg(t, HAND[0], HAND[1])), k = S.danny / DANNY_UNIT;
      spPotion(lerp(A.sami.handL[0], A.danny.handR[0], u), lerp(A.sami.handL[1], A.danny.handR[1], u) - 30 * k * Math.sin(Math.PI * u), k * 2.8, { t, grip: true, ang: lerp(-.12, .05, u) });
    }
    if (A.jenna) for (const [a] of JW) if (a < 8) sfx('WHEEE!', A.jenna.top[0], A.jenna.top[1] - 6 * S.jenna, 60, '#FFB3D9', t - a - .3, { life: 1.0 });
    if (A.alma) { const st = almaState(t); if (st && st.fell && st.tr.level < .3) sfx('BONK!', A.alma.top[0] + 4 * S.alma, A.alma.top[1], 62, PAL.goldLt, t - st.fell + .05, { life: .9 }); }
    if (A.alma && t > DID - .2 && t < DID + 1.5) sfx('TA-DA!', A.alma.top[0], A.alma.top[1] - 7 * S.alma, 66, '#FFB3D9', t - DID + .2, { life: 1.4 });
    if (A.housam && t > FLIP[0]) sfx('FLIP!', A.housam.top[0], A.housam.top[1] - 12 * S.housam, 58, PAL.goldLt, t - FLIP[0] - .3, { life: .8 });
    if (t > RIM && P.visible(RIMW[2])) { const [rx, ry] = P.p(...RIMW); sfx('SWISH!', rx, ry - 80, 74, '#8FE3FF', t - RIM, { life: 1.2 }); }
    if (A.danny) for (const d of [...DAYS.map(d => d + SIP), DRINK[0] + .3, DRINK[0] + .9, DRINK[0] + 1.5].filter(g => g < BENCHT)) sfx('GULP!', A.danny.top[0] + 5 * S.danny, A.danny.top[1], 48, '#B8E07A', t - d, { life: .6 });
    if (t > WINK + .4 && t < WINK + 2) for (const n of ['safadi', 'sami']) if (A[n]) { const e = A[n].eyeR, k = backOut(seg(t, WINK + .4 + (n === 'sami' ? .4 : 0), WINK + .7 + (n === 'sami' ? .4 : 0))) * (1 - seg(t, WINK + 1.4, WINK + 2)); if (k > 0) shape(starPts(e[0] + 2 * S[n], e[1] - 1.2 * S[n], 1.4 * S[n] * k, .4, 4), { fill: '#FFF6B8', stroke: PAL.ink, lwPx: 2 }); }
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const key = l.speaker, c = { size: o.size || 48, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W && a.mouth[1] > 0);
        if (ms.length > 1) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 30, age, { ...c, size: c.size * 1.2, dx: 0, dy: o.groupDy ?? -200 }); continue;
        }
      }
      const a = A?.[key], s = S?.[key];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60 && a.mouth[1] > 40 && a.mouth[1] < H) {
        const side = o.side ? o.side(key, a) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * (HEADW[key] || 5) * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 280), dy: o.dy ?? -200 });
      } else {
        const sd = o.edgeSide ?? 1;
        if (!sd) callout(l.text, W / 2, H + 30, age, { ...c, dx: 0, dy: -200 });
        else callout(l.text, sd > 0 ? W + 30 : -30, o.edgeY ?? H * .35, age, { ...c, dx: -sd * 420, dy: -140 });
      }
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f = 1000) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const WIDE = cam(-40, 190, 880, 540, 700);                                  // everyone
  const GIRLS = cam(-330, 150, 1150, 560, 1000);                              // Jenna's lane and Alma
  const BOYS = cam(280, 150, 1220, 560, 1000);                                // Housam and Danny
  const LESSON = cam(60, 175, 1060, 540, 900);                                // Safadi walks over: everyone and the board
  const LESSON2 = cam(90, 175, 1150, 560, 1000);                              // the lesson, closer
  const KICK = cam(190, 170, 1180, 560, 900);                                 // Housam's tricks and the scoreboard hoop
  const BROS = cam(550, 170, 1700, 470, 600);                                 // the Safadi brothers by the bench
  const POT = cam(330, 155, 1250, 540, 1000);                                 // Housam, Danny, Sami
  const DANCU = cam(330, 110, 1575, 330, 600);                               // Danny drinks
  const WEEKC = cam(-60, 210, 860, 520, 700);                                 // the week, wide
  const GIRLS2 = cam(-470, 150, 1100, 560, 1000);                             // Friday
  const BENCHC = t => ({ ...cam(430, 125, 1560, 560, 1000)(t), z: lerp(1560, 1600, ease(seg(t, BENCHT, FREEZE))) });

  const shot = (camFn, blur, bo, extra) => t => { const { A, S, P } = stage(t, camFn(t), blur); bubbles(t, A, S, bo); if (extra) extra(t, A, S, P); };
  const leftRight = (key, a) => a.mouth[0] < W * .5 ? 1 : -1;
  const wide = shot(WIDE, 0, { size: 44, side: leftRight, far: 220, dy: -180 });
  const girls = shot(GIRLS, 1.4, { size: 48, side: leftRight, far: 240, dy: -200 });
  const boys = shot(BOYS, 1.4, { size: 48, side: leftRight, far: 240, dy: -210 });
  const lesson = shot(LESSON, 1.0, { size: 46, side: (k, a) => k === 'safadi' ? -1 : leftRight(k, a), far: 240, dy: -190 });
  const lesson2 = shot(LESSON2, 1.4, { size: 48, side: (k, a) => k === 'safadi' ? -1 : leftRight(k, a), far: 250, dy: -200 });
  const kickShot = shot(KICK, .8, { size: 46, side: leftRight, far: 220, dy: -200 }, t => spCard('MEANWHILE...', on(t, MEAN, MEAN + 1.8, .25)));
  const bros = shot(BROS, 2.2, { size: 50, side: k => k === 'safadi' ? -1 : 1, far: 240, dy: -170, groupDy: -150 });
  const pot = shot(POT, 1.6, { size: 48, side: leftRight, far: 240, dy: -210 });
  const dancu = shot(DANCU, 2.6, { size: 54, side: () => -1, far: 260, dy: -160 });
  const week = shot(WEEKC, .6, { size: 44, side: leftRight, far: 220, dy: -180 }, t => {
    spCard('AND SO, FOR A WEEK...', on(t, WEEK, DAYS[0] + .1, .25));
    dayTag(0, t);
  });
  const dayTag = (i, t) => spCard(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'][i], on(t, DAYS[i], DAYS[i] + 3.5, .2), { tag: true });
  const weekGirls = i => shot(GIRLS2, 1.4, { size: 48, side: leftRight, far: 240, dy: -210 }, t => dayTag(i, t));
  const weekBench = i => shot(cam(420, 130, 1500, 560, 900), 1.8, { size: 48, side: leftRight, far: 240, dy: -200 }, t => dayTag(i, t));
  const friday = shot(GIRLS2, 1.4, { size: 50, side: leftRight, far: 240, dy: -210 }, t => spCard('FRIDAY', on(t, DAYS[4], DAYS[4] + 3.6, .2), { tag: true, ink: '#D0508E' }));
  function ending(t) {
    const tt = Math.min(t, FREEZE), { A, S } = stage(tt, BENCHC(tt), 2.0, { freeze: t > FREEZE });
    bubbles(tt, A, S, { size: 50, side: k => k === 'safadi' ? -1 : 1, far: 250, dy: -190, groupDy: -170 });
    if (t < FREEZE) return;
    flash(.6 * kick(t, FREEZE, 8));
    overlay(() => {
      const k = ease(seg(t, FREEZE, FREEZE + .4));
      X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha = .4 * k; X.fillStyle = '#E8B49A'; X.fillRect(0, 0, W, H); X.restore();
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W - 540, H - 170); X.rotate(-.05); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#D97757'; X.fillText('TO BE CONTINUED...', 0, 8);
      shape([[490, -40], [600, 0], [490, 40], [500, 15], [440, 15], [440, -15], [500, -15]], { fill: PAL.goldLt, stroke: PAL.ink, lwPx: 6 });
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 1.8, END - .4))));
  }

  scene({ duration: END, fps: 24, bpm: 116,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, wide], [4.4, girls], [TEASE, boys], [SWALK[0], lesson], [28.2, lesson2], [49.6, girls],
      [MEAN, kickShot], [66.4, boys], [WINK, bros], [SWALK1[0], pot], [DRINK[0], dancu], [SWALK2[0], pot],
      [WEEK, week], [DAYS[1], weekGirls(1)], [DAYS[2], weekBench(2)], [DAYS[3], weekGirls(3)], [DAYS[4], friday], [BENCHT, ending],
    ] });
})();
