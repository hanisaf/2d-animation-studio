// Scene 24: "The Competition Begins". The DCES gym on talent-show night, shot both ways:
//   stage view (dir −1, toward the stage) for the performers: the group dance, Alma and Jenna on stage, Housam and Danny
//   on the court in front of it (Housam bicycle-kicks into the stage hoop, which winches down for him);
//   scoreboard view (dir 1, from the stage) for the judges' table (Dragon, Fester, Pearl) and the parents' chairs behind it,
//   where the Safadi brothers sit in the second row.
// Every line and beat time comes from asset.js (`beats`), so the timing lives in one place. See README.md for the blocking.
// Every shot is a pure function of t.
(() => {
  const G = LOCATIONS.school_gym, AS = ASSETS.scene.scene24_competition_begins, BT = AS.beats, LINES = AS.dialogue, R = 11;
  const ACCENT = { housam: '#425DA0', danny: '#2E7D9A', jenna: '#D0508E', alma: '#994EC4', safadi: PAL.crimson, sami: '#2E7D6A',
    dragon: '#258343', jester_fester: '#A8284C', princess_pearl: '#D2618F', student: '#E77FB3' };
  const HEADW = { safadi: 6.6, sami: 6.6, jenna: 4.6, alma: 6.6, housam: 3.6, danny: 4.6, jester_fester: 4.2, dragon: 5.0, princess_pearl: 4.0 };

  // ---------- timing (from asset.js) ----------
  const L = id => LINES.find(l => l.id === id);
  const textLen = l => l.text.replace(/\*/g, '').length;
  const lineEnd = id => { const l = L(id); return l.at + .25 + textLen(l) / l.cps + l.hold; };
  const FINALE = 9.0, BOW = BT.clap1 + .6;
  const ROUNDS = [1, 2, 3, 4].map(r => ({ r, roll: BT['roll' + r], d: BT['d' + r], f: BT['f' + r], p: BT['p' + r],
    end: [BT.aww, BT.host2, BT.host3, BT.host4][r - 1], clap: BT['clap' + r], scores: [[9, 7, 3], [10, 9, 8], [10, 9, 9], [10, 10, 9]][r - 1] }));
  const CLAPS = ROUNDS.map(o => [o.clap, o.roll + .6]);
  const A0 = BT.almaAct + .5, AW = .8;                                          // Alma: three wheels from A0, AW s each
  const J0 = BT.jennaAct + .4, JW = .7;                                         // Jenna: four wheels, one back, an aerial
  const H0 = BT.housamAct, FLICK = H0 + 4.0, BIKE = [H0 + 4.6, H0 + 5.6], HIT = H0 + 5.1, RIM = H0 + 6.1;
  const HOOP = [BT.housamIn, BT.housamIn + 1.8];
  const FREEZE = BT.freeze + .9, END = BT.END;

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < textLen(l); });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t >= a && t < b;
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const clapping = t => CLAPS.some(([a, b]) => inW(t, a, b));
  function along(pts, t, [a, b], y = 0) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), y, dist, moving: t > a && t < b };
  }
  const still = (x, z, y = 0) => ({ x, z, y, dist: 0, moving: false });
  const OFF = { x: 0, z: -9999, y: 0, off: true };

  // ---------- blocking (world units) ----------
  const STAGE_Y = 100, STAGE_Z = 200, COURT_Z = 820;
  const DANCERS = [{ x: -300, seed: 31 }, { x: -150, seed: 44 }, { x: 0, seed: 52 }, { x: 150, seed: 67 }, { x: 300, seed: 73 }];
  const DLOOK = DANCERS.map(d => studentLook(d.seed));
  const SEATX = [-600, -480, -360, -240, -120, 120, 240, 360, 480, 600];
  const BROS = { safadi: [480, 1], sami: [600, 1] };                           // [x, row]
  const EMPTY = new Set(['2:-120']), GONE = new Set(['0:360', '0:480', '0:600']);   // GONE: no chair at all, so the brothers' shot is clear
  const PARENTS = [];
  CB_ROWS.forEach((z, row) => SEATX.forEach((x, i) => {
    const key = row + ':' + x;
    if (GONE.has(key)) return;
    if (EMPTY.has(key) || Object.values(BROS).some(([bx, br]) => bx === x && br === row)) return PARENTS.push({ x, z, row, empty: true });
    const seed = 200 + row * 17 + i * 5, look = { ...studentLook(seed), backpack: false, cap: hash(seed) < .15 };
    look.h *= 1.3;
    PARENTS.push({ x, z, row, seed, look });
  }));

  function at(name, t) {
    if (name === 'alma') {
      if (t < BT.almaIn || t >= BT.host2) return OFF;
      if (t < BT.a1) return along([[470, STAGE_Z], [0, STAGE_Z]], t, [BT.almaIn, BT.almaIn + 1.8], STAGE_Y);
      if (t < BT.almaAct) return still(t < BT.s1 ? 0 : 300, STAGE_Z, STAGE_Y);
      const u = seg(t, A0, A0 + 3 * AW);
      return { ...still(lerp(300, -150, u), STAGE_Z, STAGE_Y), spin: inW(t, A0, A0 + 3 * AW) ? -TAU * 3 * u : 0 };
    }
    if (name === 'jenna') {
      if (t < BT.jennaIn || t >= BT.host3) return OFF;
      if (t < BT.j1) return along([[470, STAGE_Z], [0, STAGE_Z]], t, [BT.jennaIn, BT.jennaIn + 1.8], STAGE_Y);
      if (t < BT.jennaAct) return still(t < BT.s2 ? 0 : 330, STAGE_Z, STAGE_Y);
      if (inW(t, J0, J0 + 4 * JW)) { const u = seg(t, J0, J0 + 4 * JW); return { ...still(lerp(330, -270, u), STAGE_Z, STAGE_Y), spin: -TAU * 4 * u }; }
      if (inW(t, J0 + 4 * JW, J0 + 5 * JW)) { const u = seg(t, J0 + 4 * JW, J0 + 5 * JW); return { ...still(lerp(-270, -120, u), STAGE_Z, STAGE_Y), spin: TAU * u }; }
      if (inW(t, J0 + 4.0, J0 + 4.8)) return { ...still(-120, STAGE_Z, STAGE_Y), spin: -TAU * ease(seg(t, J0 + 4.0, J0 + 4.8)), aerial: true };
      return still(t < J0 ? 330 : -120, STAGE_Z, STAGE_Y);
    }
    if (name === 'housam') {
      if (t < BT.housamIn || t >= BT.host4) return OFF;
      if (t < BT.h1) return { ...along([[-380, COURT_Z + 20], [0, COURT_Z]], t, [BT.housamIn + .4, BT.housamIn + 2.4]), dribble: true };
      if (t < H0) return still(0, COURT_Z);
      if (t < H0 + 3.6) return { ...along([[0, COURT_Z], [130, COURT_Z + 30], [-130, COURT_Z + 50], [-60, COURT_Z + 20], [130, COURT_Z + 20]], t, [H0, H0 + 3.6]), dribble: true };
      return still(130, COURT_Z + 20);
    }
    if (name === 'danny') {
      if (t < BT.dannyIn) return OFF;
      if (t < BT.dannyIn + 2.6) return { ...along([[-380, COURT_Z + 20], [0, COURT_Z]], t, [BT.dannyIn, BT.dannyIn + 2.6]), dribble: true };
      return still(0, COURT_Z);
    }
    if (name === 'safadi' || name === 'sami') {
      const [x, row] = BROS[name], z = CB_ROWS[row], up = standK(name, t);
      return { x, z: z + 8, y: CB_SEAT, up, dist: 0, moving: false };
    }
    if (CB_JUDGES[name] != null) return still(CB_JUDGES[name], 1262);
    const m = /^s(\d)$/.exec(name);
    if (m) {
      const d = DANCERS[+m[1]];
      if (t >= BT.host1) return OFF;
      if (t > BT.aww + 1.0) return { ...along([[d.x, STAGE_Z], [d.x - 420, STAGE_Z + 10]], t, [BT.aww + 1.0, BT.aww + 3.4], STAGE_Y), walkOff: true };
      return still(d.x, STAGE_Z, STAGE_Y);
    }
    return OFF;
  }
  // the brothers stand up to cheer (Safadi for Alma and Housam, Sami for Jenna)
  function standK(name, t) {
    const ids = name === 'safadi' ? ['s1', 's3'] : ['s2'];
    let k = 0; for (const id of ids) k = Math.max(k, ease(seg(t, L(id).at - .5, L(id).at - .15)) * (1 - ease(seg(t, lineEnd(id) - .1, lineEnd(id) + .3))));
    return k;
  }

  // ---------- the balls: world [x, y, z] when loose, null while a kid has it ----------
  const CONTACT = [130, 185, COURT_Z + 14], RIMW = [0, 280, 545];
  function ballAt(t) {
    if (t >= BT.housamIn && t < BT.host4) {
      if (t < BT.h1 || inW(t, H0, H0 + 3.6)) return null;                     // dribbling
      if (t < BT.h1 + .6 || inW(t, BT.h2, BT.s3) ) return null;               // in his hands (intro)
      if (t < FLICK) return t < H0 ? [18, R, COURT_Z + 40] : [148, R, COURT_Z + 40];
      if (t < HIT) { const u = seg(t, FLICK, HIT); return [lerp(148, CONTACT[0], u), lerp(R, CONTACT[1], u) + 170 * Math.sin(Math.PI * u), lerp(COURT_Z + 40, CONTACT[2], u)]; }
      if (t < RIM) { const u = seg(t, HIT, RIM); return [lerp(CONTACT[0], RIMW[0], u), lerp(CONTACT[1], RIMW[1], u) + 260 * Math.sin(Math.PI * u), lerp(CONTACT[2], RIMW[2], u)]; }
      if (t < RIM + .3) return [0, lerp(RIMW[1] - 6, 40, easeIn(seg(t, RIM, RIM + .3))), RIMW[2]];
      const b = t - RIM - .3; return [-30 * easeOut(seg(b, 0, 3)), R + 110 * Math.abs(Math.sin(Math.PI * b / .6)) * Math.exp(-b * 1.7), RIMW[2] - 140 * easeOut(seg(b, 0, 3))];
    }
    return null;
  }
  const hoopUp = t => 1 - ease(seg(t, ...HOOP));

  // ---------- poses: the performers ----------
  const kidBase = (name, t, rest = 'smile') => { const talk = speaking(name, t); return [{ mouth: lipFlap(t, talk, rest), brows: 'normal', lookX: 0, turn: 0 }, talk]; };
  const JSTAR = { handL: [-8.2, -20.6], handR: [8.2, -20.6], handPoseL: 'palm', handPoseR: 'palm', footL: [-5.2, -2.2], footR: [5.2, -2.2], eyes: 'happy', mouth: 'grin', lookX: 0, turn: 0 };
  const ASTAR = { handL: [-5.4, -10.6], handR: [5.4, -10.6], handPoseL: 'palm', handPoseR: 'palm', footL: [-3.6, -1.4], footR: [3.6, -1.4] };

  function almaPose(t, a) {
    const [o, talk] = kidBase('alma', t, 'grin'), set = p => Object.assign(o, p);
    set({ brows: 'up', eyes: 'open' });
    if (a.moving) return set({ ...almaSkip(a.dist / 44, 1), mouth: 'grin', eyes: 'happy' });
    if (a.spin) return set({ ...ASTAR, _spin: a.spin, eyes: 'happy', mouth: 'grin' });
    if (t < BT.almaAct) {
      if (inW(t, BT.a1, BT.a2)) set({ handR: [5 + .4 * Math.sin(t * 9), -22], handPoseR: 'palm', jump: .8 * kick(t, BT.a1 + .1, 4), eyes: 'happy' });
      if (inW(t, BT.a2, BT.a3)) set({ handL: [-5.6, -12.5], handR: [5.6, -12.5], handPoseL: 'palm', handPoseR: 'palm', tilt: .1, eyes: 'happy', brows: 'worried', mouth: talk ? o.mouth : 'smile' });
      if (t >= BT.a3) set({ handR: [4.2, -12.2], handPoseR: 'fist', handL: [-3.4, -4.9], handPoseL: 'open', brows: 'angry', mouth: talk ? o.mouth : 'grin' });
      return o;
    }
    if (t < A0) return set({ ...ASTAR, dy: .6 * Math.sin(seg(t, A0 - .5, A0) * Math.PI), mouth: 'grin', brows: 'angry' });
    return set({ handL: [-5, -11], handR: [5, -11], handPoseL: 'palm', handPoseR: 'palm', eyes: 'star', mouth: 'grin', jump: 1.6 * kick(t, A0 + 3 * AW, 3) + .6 * bounce(t, 5) * (t > BT.clap2 ? 1 : 0), power: .5 * on(t, A0 + 3 * AW, BT.roll2, .3) });
  }

  function jennaPose(t, a) {
    const [o, talk] = kidBase('jenna', t, 'grin'), set = p => Object.assign(o, p);
    set({ giraffe: false });
    if (a.moving) return set({ ...jennaSkip(a.dist / 44, 1), mouth: 'grin', handL: [-2.6, -11.6], handR: [2.6, -11.6] });
    if (a.spin) return set({ ...JSTAR, _spin: a.spin, ...(a.aerial ? { footL: [-4.2, -4.8], footR: [4.2, -4.8], jump: 16 * Math.sin(Math.PI * seg(t, J0 + 4.0, J0 + 4.8)) } : {}) });
    if (t < BT.jennaAct) {
      if (inW(t, BT.j1, BT.j2)) set({ handR: [3.6, -21], handL: [-2.65, -1.1], handPoseL: 'hip', handPoseR: 'palm', eyes: 'happy', jump: .5 * bounce(t, 4) });
      if (inW(t, BT.j2, BT.j2 + 1.6)) set({ handR: [3.2, -24], handPoseR: 'point', lookY: -.8, eyes: 'wide', brows: 'up' });
      if (inW(t, BT.j2 + 1.6, BT.s2)) set({ handR: [3.6, -3], handPoseR: 'point', lookY: .7, eyes: 'wide', tilt: .1 * Math.sin(t * 5), brows: 'up', mouth: talk ? o.mouth : 'o' });
      return o;
    }
    if (t < J0) return set({ ...JSTAR, eyes: 'open', mouth: 'grin', handL: [-3.6, -21], handR: [3.6, -21] });
    if (inW(t, J0 + 5 * JW, J0 + 4.0)) return set({ dy: 1.4 * Math.sin(Math.PI * seg(t, J0 + 5 * JW, J0 + 4.0)), handL: [-5.4, -8], handR: [5.4, -8], handPoseL: 'palm', handPoseR: 'palm', eyes: 'squeeze', mouth: 'grin' });
    return set({ handL: [-3.6, -21], handR: [3.6, -21], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: 1.4 * kick(t, J0 + 4.8, 4) + .6 * bounce(t, 5) * (t > BT.clap3 ? 1 : 0) });
  }

  function housamPose(t, a) {
    const [o, talk] = kidBase('housam', t, 'smile'), set = p => Object.assign(o, p);
    set({ footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7], handPoseL: 'open', handPoseR: 'open' });
    if (a.dribble) return set({ ...housamDribble(a.dist / 44), brows: 'focused', mouth: 'grin', lookY: .55 });
    if (t < H0) {
      set({ mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (inW(t, BT.h1, BT.h1 + .6)) set({ handR: [4.4, -11.5], handPoseR: 'open', _ballHand: true, lookY: .4 });
      if (inW(t, BT.h1 + .6, BT.h2)) set({ handR: [4.7 + .22 * wob(t, 1.5), -24.3], handPoseR: 'palm', tilt: -.05 });
      if (inW(t, BT.h2, BT.s3)) set({ handR: [4.4, -17.6], handPoseR: 'palm', _ballHand: true, lookX: .6, lookY: -.2, brows: 'quizzical', tilt: .06 });
      return o;
    }
    if (t >= BIKE[0] && t < BIKE[1]) {
      const u = seg(t, BIKE[0], BIKE[1]);
      return set({ handL: [-5.4, -20], handR: [5.4, -20], eyes: 'squeeze', mouth: 'grin', brows: 'focused', footL: [-1.4, -6], footR: u > .3 && u < .7 ? [2.0, -9.2] : [1.4, -6], jump: 14 * Math.sin(Math.PI * u), _spin: -TAU * ease(u) });
    }
    set({ brows: 'focused', mouth: 'smirk', lookY: .5 });
    if (inW(t, FLICK - .1, FLICK + .25)) set({ footR: [2.8, -4.8], lookY: -.5 });
    if (inW(t, FLICK + .25, BIKE[0])) set({ lookY: -.8, handL: [-4.6, -12], handR: [4.6, -12], dy: .7 });
    if (t >= BIKE[1]) set({ sq: .15 * boing(t, BIKE[1], 3, 5), lookY: -.6, brows: 'up', mouth: 'o' });
    if (t > RIM) set({ handL: [-5.2, -24], handR: [5.2, -24], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'grin', jump: 1.6 * kick(t, RIM + .05, 3) + .5 * bounce(t, 5) * (t > BT.clap4 ? 1 : 0), lookY: 0 });
    return o;
  }

  function dannyPose(t, a) {
    const [o, talk] = kidBase('danny', t, 'grin'), set = p => Object.assign(o, p);
    set({ brows: 'up', _cube: true, _cubeHand: 'handL' });
    if (a.dribble) return set({ ...dannyDribble(a.dist / 44), handL: [-3.8, -15.5], handPoseL: 'fist', brows: 'focused', mouth: 'grin', lookY: .5 });
    set({ footR: [2.6, -3.0], handL: [-3.6, -12.5], handPoseL: 'fist', handR: [3.9, -10.5], handPoseR: 'open', mouth: talk ? o.mouth : 'grin', _footBall: true });
    if (inW(t, BT.dannyIn + 2.6, BT.dannyIn + 3.0)) set({ sq: .1 * boing(t, BT.dannyIn + 2.7, 3, 6) });
    if (inW(t, BT.dn1, BT.dn2)) set({ handL: [-4.4, -19.5], eyes: 'happy', handR: [4.6 + .2 * wob(t, 1.5), -19], handPoseR: 'palm' });
    if (inW(t, BT.dn2, BT.dn3)) set({ handR: [2.4, -13.4], handPoseR: 'fist', brows: 'focused', tilt: -.05 });
    if (t >= BT.dn3) set({ eyes: inW(t, BT.dn3, BT.dn3 + 1.4) ? 'squeeze' : 'open', mouth: talk ? o.mouth : inW(t, BT.dn3, BT.dn3 + 1.6) ? 'wobble' : 'grin', brows: inW(t, BT.dn3, BT.dn3 + 1.6) ? 'worried' : 'up', tilt: inW(t, BT.dn3, BT.dn3 + 1.0) ? .06 * Math.sin(t * 38) : 0 });
    if (t >= BT.freeze) set({ handL: [-4.6, -18.5], eyes: 'open', brows: 'focused', mouth: 'smirk', lookX: 0, lookY: -.1, tilt: 0, dy: .3 * Math.sin(seg(t, BT.freeze, BT.freeze + .6) * Math.PI) });
    return o;
  }

  // the group dance, on the beat (120 bpm: a beat every half second). i = which dancer, so the wave ripples.
  function dancerPose(i, t, a) {
    const ph = t * 2, b = frac(ph), on1 = Math.floor(ph) % 2 ? -1 : 1, hit = Math.exp(-b * 6), sd = i % 2 ? -1 : 1;
    const o = { mouth: 'grin', eyes: 'happy', brows: 'up', lookX: 0, handPoseL: 'palm', handPoseR: 'palm' }, set = p => Object.assign(o, p);
    if (a.walkOff) return set({ ...studentWalk(a.dist / 40, 1), mouth: 'frown', eyes: 'open', brows: 'worried', flip: true });
    if (t < 2) set({ handL: [-3.6 + 1.6 * Math.sin(t * Math.PI), -20], handR: [3.6 + 1.6 * Math.sin(t * Math.PI), -20], lean: .08 * Math.sin(t * Math.PI), dy: .4 * hit, footL: [-1.5, -1.05 - .8 * Math.max(0, on1) * hit], footR: [1.5, -1.05 - .8 * Math.max(0, -on1) * hit] });
    else if (t < 4) { const c = hit; set({ handL: [-1.2 - 2.2 * (1 - c), -13.5], handR: [1.2 + 2.2 * (1 - c), -13.5], footL: [-1.5 - (on1 > 0 ? 1.4 : 0), -1.05], footR: [1.5 + (on1 < 0 ? 1.4 : 0), -1.05], lean: .06 * on1, eyes: 'happy' }); }
    else if (t < 6) { const u = frac((t - 4 - i * .12) / 1), j = Math.max(0, Math.sin(u * TAU)); set({ jump: 3.2 * j, handL: [-4.3, -13 - 7 * j], handR: [4.3, -13 - 7 * j], eyes: j > .3 ? 'star' : 'happy', mouth: j > .3 ? 'O' : 'grin' }); }
    else if (t < 8) set({ handR: on1 > 0 ? [5.2, -23] : [3.8, -4.6], handPoseR: 'point', handL: [-3.2, -9.6], handPoseL: 'fist', lean: -.08 * on1, dy: .3 * hit, footL: [-1.9, -1.05], footR: [1.9, -1.05] });
    else if (t < FINALE) { const u = seg(t, 8, FINALE); set({ flip: Math.floor(u * 4) % 2 === 1, jump: 2.4 * Math.sin(Math.PI * u), handL: [-2.6, -16], handR: [2.6, -16], sq: -.05 }); }
    else if (t < BOW) set({ handL: [-5.4, -19.5], handR: [5.4, -19.5], jump: 1.4 * kick(t, FINALE, 5), dy: i === 2 ? 0 : .6, footL: [-2.4, -1.05], footR: [2.4, -1.05], lean: sd * .05, eyes: 'happy', mouth: 'grin' });
    else if (t < BT.aww) set({ handL: [-3.4, -9.8], handR: [3.4, -9.8], dy: 1.0 * on(t, BOW, BT.roll1, .3), lookY: .7, eyes: 'happy', mouth: 'grin' });
    if (t >= BT.p1 + .2 && t < BT.aww) set({ eyes: 'wide', mouth: 'o', brows: 'worried', lookY: 0, dy: 0 });
    if (t >= BT.aww) set({ handL: [-3.4, -8.6], handR: [3.4, -8.6], dy: .8, mouth: speaking('student', t) ? lipFlap(t, true, 'frown', ['o', 'O', 'o']) : 'frown', eyes: 'open', brows: 'worried', lookY: .5 });
    return o;
  }

  // ---------- poses: the audience ----------
  const SIT = { dy: 7.4, footL: [-2.1, 6.4], footR: [2.1, 6.4] };
  function parentPose(p, t) {
    const ph = hash(p.seed) * 7, clap = clapping(t - hash(p.seed * 3) * .25);
    const o = { seed: p.seed, look: p.look, dy: 6.6, footL: [-1.7, 5.7], footR: [1.7, 5.7], handL: [-2.6, -9.2], handR: [2.6, -9.2], handPoseL: 'open', handPoseR: 'open',
      mouth: 'smile', eyes: 'open', lookX: .3 * Math.sin(ph), lookY: 0, noShadow: true };
    if (clap) {
      const c = Math.max(0, Math.sin((t + ph) * TAU * 3.1));
      Object.assign(o, { handL: [-.9 - 1.8 * (1 - c), -14.2], handR: [.9 + 1.8 * (1 - c), -14.2], handPoseL: 'palm', handPoseR: 'palm', mouth: 'grin', eyes: hash(p.seed * 7) < .5 ? 'happy' : 'open', jump: .25 * c });
    }
    if (inW(t, BT.p1 + .2, BT.aww + 1)) Object.assign(o, { mouth: 'o', eyes: 'wide', brows: 'up' });
    if (inW(t, RIM, RIM + 2.4)) Object.assign(o, { eyes: 'wide', mouth: 'O', handL: [-2.2, -17.5], handR: [2.2, -17.5], handPoseL: 'palm', handPoseR: 'palm' });
    return o;
  }
  const SIT_ADULT = { dy: 7.4, footL: [-2.1, 6.4], footR: [2.1, 6.4], handL: [-3.6, -3.4], handR: [3.6, -3.4], handPoseL: 'open', handPoseR: 'open' };
  function sitBlend(o, up) {                                                    // rising off the seat to cheer (0 → 1)
    return Object.assign(o, { dy: SIT_ADULT.dy - 4.6 * up });
  }
  function brotherPose(name, t, a) {
    const talk = speaking(name, t), me = name === 'safadi', other = me ? 1 : -1;      // the other brother is to screen-right of Safadi
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: 0, turn: 0, brows: 'up', ...SIT_ADULT }, set = p => Object.assign(o, p);
    if (a.up > .01) {                                                           // standing up to cheer
      set({ handL: [-2.4, -19.6], handR: [2.4, -19.6], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: .8 * bounce(t, 5) * a.up, lookY: -.1 });
      return sitBlend(o, a.up);
    }
    if (clapping(t)) { const c = Math.max(0, Math.sin((t + (me ? 0 : .3)) * TAU * 3)); set({ handL: [-1.0 - 1.8 * (1 - c), -12.8], handR: [1.0 + 1.8 * (1 - c), -12.8], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin' }); }
    if (inW(t, BT.p1 + .2, BT.aww + 1)) set({ eyes: 'wide', mouth: 'o' });
    if (t >= BT.freak) {                                                        // Danny's turn: Sami panics, Safadi calms him
      if (!me) {
        set({ lookX: -.8, turn: -.25, eyes: 'wide', brows: 'worried', mouth: talk ? o.mouth : 'wobble', handL: [-3.4, -19.4], handR: [3.4, -19.4], handPoseL: 'palm', handPoseR: 'palm', emote: 'sweat', emoteK: ease(seg(t, BT.freak, BT.freak + .5)) });
        if (inW(t, BT.freak, BT.freak + .5)) set({ jump: 1.2 * Math.sin(Math.PI * seg(t, BT.freak, BT.freak + .5)), dy: SIT_ADULT.dy });
        if (inW(t, BT.sm2, BT.sm3)) set({ handR: [5.0, -16.5], handPoseR: 'palm', handL: [-3.6, -3.4], handPoseL: 'open' });
        if (inW(t, BT.sm3, BT.sf1)) set({ tilt: .05 * Math.sin(t * 30), lookX: -.4 });
        if (inW(t, BT.sf1, BT.sm4)) set({ eyes: 'open', brows: 'worried', mouth: 'flat', handL: [-1.4, -15.2], handR: [1.4, -15.2], tilt: 0, emoteK: .6 });
        if (t >= BT.sm4) set({ eyes: inW(t, BT.sm4 + 1.1, BT.sm4 + 1.6) ? 'squeeze' : 'open', brows: 'worried', mouth: talk ? o.mouth : 'wobble', lookX: 0, turn: 0, handL: [-1.2, -14.6], handR: [1.2, -14.6], dy: SIT_ADULT.dy + .4 * kick(t, BT.sm4 + 1.2, 5) });
      } else {
        set({ lookX: .8, turn: .25, brows: inW(t, BT.freak, BT.sf1) ? 'up' : 'normal', eyes: inW(t, BT.freak + .2, BT.freak + .8) ? 'wide' : 'open', mouth: talk ? o.mouth : 'smile' });
        if (inW(t, BT.sf1, BT.sm4)) set({ handR: [7.6, -14.4], handPoseR: 'palm', eyes: t > BT.sf2 ? 'happy' : 'open' });
        if (t >= BT.sm4) set({ lookX: .3, turn: 0, mouth: 'smile', brows: 'up', eyes: inW(t, BT.sm4 + 1.4, BT.sm4 + 2.0) ? 'wink' : 'open' });
      }
    }
    return o;
  }

  // ---------- poses: the judges ----------
  const cardUp = (r, j, t) => { const at = r[j] - .15; return t < at || t >= r.end ? 0 : backOut(seg(t, at, at + .3)) * (1 - ease(seg(t, r.end - .25, r.end))); };
  const roundAt = t => ROUNDS.find(r => t >= r.roll - .2 && t < r.end);
  const hosting = t => ['host1', 'host1b', 'host2', 'host3', 'host4'].some(id => inW(t, L(id).at - .3, lineEnd(id)));
  function festerPose(t) {
    const talk = speaking('jester_fester', t), o = { mouth: lipFlap(t, talk, 'smile'), handL: [-4.6, -9.8], handR: [4.6, -9.8], handPoseL: 'open', handPoseR: 'open', lookX: 0, eyes: 'open' };
    const set = p => Object.assign(o, p), r = roundAt(t);
    if (clapping(t)) { const c = Math.max(0, Math.sin((t + .2) * TAU * 3)); set({ handL: [-.9 - 1.8 * (1 - c), -13.4], handR: [.9 + 1.8 * (1 - c), -13.4], handPoseL: 'cup', handPoseR: 'cup', eyes: 'happy', mouth: 'grin' }); }
    if (r) {
      const up = cardUp(r, 'f', t), mood = r.r === 1 ? 0 : 1;
      if (up > 0) set({ handR: [4.8, -21.6], handPoseR: 'fist', _card: { num: r.scores[1], k: up, t0: r.f - .15 } });
      if (r.r === 1) set({ brows: t > r.f ? 'normal' : 'up', mouth: talk ? o.mouth : 'flat', eyes: inW(t, r.p, r.p + 1.2) ? 'wide' : 'open' });
      if (r.r === 1 && t > r.p + .2) set({ lookX: .7, brows: 'worried', hatDroop: .2 });
      if (mood) set({ eyes: talk ? 'open' : 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (r.r === 4 && t > r.f) set({ hatSway: [.6 * Math.sin(t * 9), 0], jump: .6 * bounce(t, 6) });
    }
    if (hosting(t)) set({ handL: [-5.3, -15.4], handR: [5.3, -15.4], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', brows: 'up', mouth: talk ? o.mouth : 'grin', jump: 1.2 * bounce(t, 5), lookX: 0, _card: null, hatDroop: 0 });
    return o;
  }
  function dragonPose(t) {
    const talk = speaking('dragon', t), o = { mouth: lipFlap(t, talk, 'smile'), wings: .25, flap: .15 * wob(t, .5), lookX: .25, eyes: 'open', brows: 'normal' };
    const set = p => Object.assign(o, p), r = roundAt(t);
    if (clapping(t)) set({ eyes: 'happy', mouth: 'grin', wings: .6, flap: .6 * Math.sin(t * 16) });
    if (r) {
      const up = cardUp(r, 'd', t);
      if (up > 0) set({ _card: { num: r.scores[0], k: up, t0: r.d - .15 }, eyes: 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (inW(t, r.d, r.d + 1.6)) set({ wings: .7, flap: .7 * Math.sin(t * 14), jump: (r.r > 2 ? 3 : 1.2) * bounce(t, 5) });
      if (r.r === 1 && t > r.p + .2) set({ eyes: 'wide', mouth: 'o', lookX: -.7, wings: .2, flap: 0, jump: 0 });
      if (r.r === 4 && inW(t, r.d, r.f)) set({ fly: .5, jump: 4 + 2 * Math.sin(t * 6), wings: 1, flap: Math.sin(t * 15) });
    }
    if (hosting(t)) set({ lookX: .7, eyes: 'happy', mouth: 'smile' });
    return o;
  }
  function pearlPose(t) {
    const talk = speaking('princess_pearl', t), o = { sit: 1, mouth: lipFlap(t, talk, 'flat'), eyes: 'bored', brows: 'flat', lookX: -.2, wag: .2 * Math.sin(t * 1.4) };
    const set = p => Object.assign(o, p), r = roundAt(t);
    if (clapping(t)) set({ flipNear: -.6 + .5 * Math.sin(t * 14), eyes: 'open', mouth: 'smile', brows: 'normal' });
    if (r) {
      const up = cardUp(r, 'p', t);
      if (up > 0) set({ point: 1, pointAng: -1.3, _card: { num: r.scores[2], k: up, t0: r.p - .15 } });
      if (r.r === 1) { set({ eyes: 'bored', mouth: talk ? o.mouth : 'flat', headTilt: .15 }); if (inW(t, L('p1b').at, r.end)) set({ eyes: inW(t, L('p1b').at + 1.0, L('p1b').at + 1.8) ? 'closed' : 'bored', headTilt: .3 }); }
      if (r.r === 2) set({ eyes: 'open', brows: 'normal', mouth: talk ? o.mouth : 'smirk' });
      if (r.r === 3) set({ eyes: t > r.p ? 'sparkle' : 'open', brows: 'up', mouth: talk ? o.mouth : 'smile', blush: .6 });
      if (r.r === 4) set({ eyes: t > r.p ? 'happy' : 'open', brows: 'up', mouth: talk ? o.mouth : 'smile', wag: .7 * Math.sin(t * 7), blush: .5 });
    }
    if (hosting(t)) set({ eyes: 'open', lookX: -.8, brows: 'flat' });
    return o;
  }

  // ---------- the cast table ----------
  const PEARL_S = .62;
  const CAST = {
    alma: { rig: alma, unit: ALMA_UNIT, pose: almaPose, h: 10.5 }, jenna: { rig: jenna, unit: JENNA_UNIT, pose: jennaPose, h: 11.8 },
    housam: { rig: housam, unit: HOUSAM_UNIT, pose: housamPose, h: 15 }, danny: { rig: danny, unit: DANNY_UNIT, pose: dannyPose },
    jester_fester: { rig: jester, unit: JF_UNIT, pose: festerPose }, dragon: { rig: dragon, unit: DRAGON_UNIT, pose: dragonPose },
    princess_pearl: { rig: pearl, unit: PP_UNIT * PEARL_S, pose: pearlPose, y: 46 },
  };
  DANCERS.forEach((d, i) => { CAST['s' + i] = { rig: student, unit: STUDENT_UNIT, pose: (t, a) => ({ ...dancerPose(i, t, a), look: DLOOK[i], seed: d.seed }) }; });
  const GSET = t => ({ lights: .92, sun: .45, curtain: 1, stageHoopUp: hoopUp(t), swishStage: t > RIM ? kick(t, RIM, 3) : 0, clock: 600, period: 1 });

  // ---------- drawing ----------
  function drawChar(P, name, a, t, A, S, fz) {
    const c = CAST[name], pose = { ...c.pose(t, a), t, ...fz };
    const [sx, sy, k] = P.p(a.x, (a.y || 0) + (c.y || 0), a.z), s = c.unit * k;
    if (pose._spin) {                                                         // cartwheels and flips spin about the middle
      const lift = name === 'housam' ? 0 : (name === 'jenna' ? 5 : 3) * (1 - Math.cos(pose._spin)) / 2;
      const cy = sy - ((c.h || 12) + lift + (pose.jump || 0)) * s;
      X.save(); X.translate(sx, cy); X.rotate(pose._spin * P.dir); X.translate(-sx, -cy);
      A[name] = c.rig(sx, sy, s, { ...pose, noShadow: true }); X.restore();
      ellipse(sx, sy, 3 * s, .55 * s, { fill: 'rgba(40,20,30,.2)', stroke: null });
    } else A[name] = c.rig(sx, sy, s, pose);
    S[name] = s;
    const Ax = A[name];
    if (name === 'housam' && !ballAt(t)) {                                    // Housam's ball, when he has it
      if (pose._ballHand) housamBall(Ax.handR[0], Ax.handR[1] - 1.4 * s, s, { spin: .3 * Math.sin(t * 2) });
      else if (a.dribble) { const p = a.dist / 44; housamBall(sx + (2.9 + .6 * Math.sin(p * Math.PI)) * s, sy - (1.35 + .2 * Math.abs(Math.sin(p * Math.PI))) * s, s, { spin: t * 3 }); }
    }
    if (name === 'danny') {
      if (a.dribble) { const p = a.dist / 44; dannyBall(sx + (2.9 + .6 * Math.sin(p * Math.PI)) * s, sy - (1.35 + .2 * Math.abs(Math.sin(p * Math.PI))) * s, s, { spin: t * 3 }); }
      if (pose._footBall) dannyBall(sx + 3.0 * s, sy - 1.35 * s, s, { spin: .4 });
      if (pose._cube) { const h = Ax[pose._cubeHand]; cbCube(h[0], h[1] - 1.0 * s, s * .5, t, { ang: .05 * Math.sin(t * 3), still: fz.boil === 0 }); }
    }
    if (pose._card) {                                                         // the judges' score paddles
      const cd = pose._card, hk = 64 * k;
      if (name === 'jester_fester') cbScoreCard(Ax.handR[0], Ax.handR[1] + .4 * s, hk, cd.num, cd.k, { t, t0: cd.t0, ang: .1 });
      if (name === 'dragon') cbScoreCard(Ax.pawR[0] - 1.0 * s, Ax.pawR[1] - 6 * s, hk, cd.num, cd.k, { t, t0: cd.t0, ang: -.35 });
      if (name === 'princess_pearl') cbScoreCard(Ax.flipper[0], Ax.flipper[1], hk, cd.num, cd.k, { t, t0: cd.t0, ang: .3 });
    }
  }
  function drawCrowd(P, t, A, S, fz) {                                       // the parents and the Safadi brothers, far rows first
    for (let row = CB_ROWS.length - 1; row >= 0; row--) {
      for (const p of PARENTS.filter(q => q.row === row)) {
        if (!P.visible(p.z)) continue;
        cbChair(P, p.x, p.z);
        if (p.empty) continue;
        const [sx, sy, k] = P.p(p.x, CB_SEAT, p.z + 14);
        student(sx, sy, STUDENT_UNIT * k, { ...parentPose(p, t), t, ...fz });
      }
      for (const name of ['safadi', 'sami']) {
        if (BROS[name][1] !== row) continue;
        const a = at(name, t); if (!P.visible(a.z)) continue;
        const [sx, sy, k] = P.p(a.x, a.y, a.z), rig = name === 'safadi' ? safadi : sami, unit = name === 'safadi' ? SAFADI_UNIT : SAMI_UNIT;
        A[name] = rig(sx, sy, unit * k, { ...brotherPose(name, t, a), t, noShadow: true, ...fz }); S[name] = unit * k;
      }
    }
  }
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {}, items = [];
    const fz = o.freeze ? { boil: 0 } : {};
    for (const name of Object.keys(CAST)) {
      const a = at(name, t); if (a.off || P.depth(a.z) < 40) continue;
      items.push({ z: a.z, draw: () => { if (CB_JUDGES[name] != null) cbJudgeChair(P, CB_JUDGES[name], name === 'princess_pearl'); drawChar(P, name, a, t, A, S, fz); } });
    }
    if (P.dir > 0) {
      if (P.depth(CB_TABLE.z0) > 40) items.push({ z: CB_TABLE.z0, draw: () => cbJudgesTable(P) });
      if (P.depth(CB_ROWS[0]) > 40) items.push({ z: CB_ROWS[0], draw: () => layer(() => drawCrowd(P, t, A, S, fz), { blur: o.crowdBlur || 0 }) });
    }
    const bw = ballAt(t);
    if (bw && P.depth(bw[2]) > 40) items.push({ z: bw[2], draw: () => { const [bx, by, bk] = P.p(...bw); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: R / HOUSAM_UNIT, spin: t * 9 }); } });
    items.sort((p, q) => P.depth(q.z) - P.depth(p.z));
    const gs = GSET(t);
    layer(() => G.back(P, t, { ...gs, splitZ: items.length ? items[0].z : -Infinity }), { blur });
    if (P.dir < 0) { cbBanner(P, t); if (o.spot) for (const n of [].concat(o.spot)) { const a = at(n, t); if (!a.off && P.visible(a.z)) { const [x, y, k] = P.p(a.x, a.y, a.z); cbSpot(x, 0, y, 150 * k, .16); } } }
    items.forEach((it, i) => { it.draw(); G.front(P, t, { ...gs, splitZ: it.z, toZ: items[i + 1]?.z }); });
    overWorld(t, P, A, S);
    return { A, S, P };
  }
  // sound effects over everyone
  function overWorld(t, P, A, S) {
    if (A.alma && inW(t, A0, A0 + 3 * AW)) sfx('WHEEE!', A.alma.top[0], A.alma.top[1] - 7 * S.alma, 62, '#E9C3FF', t - A0 - .3, { life: 1.4 });
    if (A.alma) sfx('TA-DA!', A.alma.top[0], A.alma.top[1] - 7 * S.alma, 66, '#FFB3D9', t - A0 - 3 * AW, { life: 1.4 });
    if (A.jenna) { sfx('WHEEE!', A.jenna.top[0], A.jenna.top[1] - 8 * S.jenna, 62, '#FFB3D9', t - J0 - .3, { life: 1.6 }); sfx('WOW!', A.jenna.top[0], A.jenna.top[1] - 9 * S.jenna, 70, PAL.goldLt, t - J0 - 4.2, { life: 1.0 }); sfx('TA-DA!', A.jenna.top[0], A.jenna.top[1] - 7 * S.jenna, 66, '#FFB3D9', t - J0 - 4.9, { life: 1.4 }); }
    if (A.housam) { if (t > BIKE[0]) sfx('BICYCLE KICK!', A.housam.top[0], A.housam.top[1] - 14 * S.housam, 58, PAL.goldLt, t - BIKE[0] - .2, { life: 1.1 }); if (inW(t, BT.h2 + 1.6, BT.s3)) sfx('?', A.housam.handR[0] + 2.6 * S.housam, A.housam.handR[1] - 4.4 * S.housam, 70, '#FFE066', t - BT.h2 - 1.6, { life: 1.4 }); }
    if (t > RIM && P.dir < 0 && P.visible(RIMW[2])) { const [rx, ry] = P.p(...RIMW); sfx('SWISH!', rx, ry - 80, 76, '#8FE3FF', t - RIM, { life: 1.3 }); }
    for (const r of ROUNDS) if (r.r === 1 && A.princess_pearl) sfx('...', A.princess_pearl.head[0] + 50, A.princess_pearl.head[1] - 80, 60, '#DDD', t - r.p - .2, { life: .9 });
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const key = l.speaker === 'student' ? 's2' : l.speaker;
      const c = { size: o.size || 48, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      const a = A?.[key], s = S?.[key];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60 && a.mouth[1] > 40 && a.mouth[1] < H) {
        const side = o.side ? o.side(key, a) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * (HEADW[key] || 5) * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 280), dy: o.dy ?? -200 });
      } else if (o.edge !== false) callout(l.text, W + 30, H * .3, age, { ...c, dx: -420, dy: -100 });
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f, dir) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const STAGEW = cam(0, 200, 1080, 470, 1250, -1);                             // the whole stage, from behind the judges
  const DANCEM = cam(0, 205, 620, 545, 1050, -1);                              // the dancers, closer
  const INTRO = cam(0, 205, 430, 520, 850, -1);                                // a kid introducing themself at centre stage
  const COURT = cam(60, 160, 1130, 430, 900, -1);                               // the court in front of the stage, and the stage hoop
  const COURTM = cam(0, 140, 1030, 330, 950, -1);                              // a kid on the court, closer
  const AUDW = cam(0, 260, 840, 430, 760, 1);                                  // the judges and every parent
  const JUDGES = cam(0, 140, 820, 380, 1050, 1);                               // the judges' table
  const FESTER = cam(0, 130, 1000, 400, 1000, 1);                              // Fester announces
  const BROSC = cam(540, 175, 1300, 450, 1000, 1);                             // the Safadi brothers in the second row
  const ENDC = t => ({ ...COURTM(t), z: lerp(1030, 990, ease(seg(t, BT.freeze, FREEZE))), hy: lerp(330, 300, ease(seg(t, BT.freeze, FREEZE))) });

  const leftRight = (key, a) => a.mouth[0] < W * .5 ? 1 : -1;
  const shot = (camFn, blur, bo, o = {}) => t => { const { A, S, P } = stage(t, camFn(t), blur, o); bubbles(t, A, S, bo); if (o.extra) o.extra(t, A, S, P); };
  const stageWide = shot(STAGEW, .4, { size: 46, side: leftRight, far: 240, dy: -200 }, { spot: ['alma', 'jenna', 's2'] });
  const actShot = shot(DANCEM, 1.0, { size: 48, side: leftRight, far: 240, dy: -190 }, { spot: ['alma', 'jenna'] });
  const danceMed = shot(DANCEM, 1.2, { size: 48, side: leftRight, far: 240, dy: -190 });
  const intro = who => shot(INTRO, 2.4, { size: 50, side: () => -1, far: 280, dy: -200 }, { spot: who });
  const court = shot(COURT, .6, { size: 48, side: leftRight, far: 240, dy: -200 });
  const courtMed = shot(COURTM, 2.0, { size: 50, side: () => -1, far: 280, dy: -190 });
  const audWide = shot(AUDW, 0, { size: 44, side: leftRight, far: 220, dy: -180 });
  const judges = shot(JUDGES, 1.6, { size: 48, side: (k, a) => k === 'dragon' ? 1 : k === 'princess_pearl' ? -1 : 1, far: 240, dy: -230 }, { crowdBlur: 2.2 });
  const fester = shot(FESTER, 2.0, { size: 52, side: () => 1, far: 300, dy: -230 }, { crowdBlur: 3 });
  const bros = shot(BROSC, 2.4, { size: 50, side: k => k === 'safadi' ? -1 : 1, far: 260, dy: -200 });
  const opening = shot(STAGEW, .4, { size: 46 }, { extra: t => cbCard('THE TALENT SHOW', on(t, .6, 3.4, .3), { tag: true, x: 420, y: 980, ink: '#D0508E' }) });
  const individual = shot(FESTER, 2.0, { size: 52, side: () => 1, far: 300, dy: -230 }, { crowdBlur: 3, extra: t => cbCard('INDIVIDUAL TALENTS', on(t, L('host1').at + .8, L('host1b').at, .25), { tag: true, x: 1440, y: 120 }) });
  function ending(t) {
    const tt = Math.min(t, FREEZE), { A, S } = stage(tt, ENDC(tt), 2.4, { freeze: t > FREEZE });
    bubbles(tt, A, S, { size: 50, side: () => -1, far: 280, dy: -190, edge: false });
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

  const shots = [[0, opening], [4.6, danceMed], [BT.clap1, audWide], [BT.roll1, judges], [BT.aww, stageWide], [BT.host1, individual]];
  for (const [who, inId, introId, cheer, act, r] of [['alma', 'almaIn', 'a1', 's1', 'almaAct', 2], ['jenna', 'jennaIn', 'j1', 's2', 'jennaAct', 3], ['housam', 'housamIn', 'h1', 's3', 'housamAct', 4]]) {
    const onCourt = who === 'housam';
    shots.push([BT[inId], onCourt ? court : stageWide], [BT[introId], onCourt ? courtMed : intro(who)], [BT[cheer], bros], [BT[act], onCourt ? court : actShot],
      [BT['clap' + r], audWide], [BT['roll' + r], judges], [BT['host' + r], fester]);
  }
  shots.push([BT.dannyIn, court], [BT.dn1, courtMed], [BT.freak, bros], [BT.freeze, ending]);
  scene({ duration: END, fps: 24, bpm: 120, shots });                         // id, title, dialogue, music: see asset.js
})();
