// Scene 25: "The Cube Drops". The DCES gym on talent-show night, straight after scene 24, shot both ways:
//   stage view (dir −1) for Danny on the court (Alma, Jenna and Housam cheer from the sideline), the trophies on stage, and
//   the proud-parents talk on stage; scoreboard view (dir 1) for the judges' table and the parents' chairs behind it.
//   The close-ups of the cube are inserts over the gym, thrown out of focus.
// Every line and beat time comes from asset.js (`beats`). The talent-show props are scene 24's (cb…); see README.md.
// Every shot is a pure function of t.
(() => {
  const G = LOCATIONS.school_gym, AS = ASSETS.scene.scene25_cube_drops, BT = AS.beats, LINES = AS.dialogue;
  const ACCENT = { housam: '#425DA0', danny: '#2E7D9A', jenna: '#D0508E', alma: '#994EC4', safadi: PAL.crimson, sami: '#2E7D6A',
    dragon: '#258343', jester_fester: '#A8284C', princess_pearl: '#D2618F' };
  const HEADW = { safadi: 6.6, sami: 6.6, jenna: 4.6, alma: 6.6, housam: 3.6, danny: 4.6, jester_fester: 4.2, dragon: 5.0, princess_pearl: 4.0 };

  // ---------- timing (from asset.js) ----------
  const L = id => LINES.find(l => l.id === id);
  const textLen = l => l.text.replace(/\*/g, '').length;
  const lineEnd = id => { const l = L(id); return l.at + .25 + textLen(l) / l.cps + l.hold; };
  const ROUNDS = [1, 2, 3].map(r => ({ r, roll: BT['roll' + r], d: BT['d' + r], f: BT['f' + r], p: BT['p' + r],
    end: [BT.dn2, BT.dn5, BT.trophy][r - 1], clap: BT['clap' + r], scores: [[10, 5, 0], [10, 10, 5], [10, 10, 10]][r - 1] }));
  const CLAPS = ROUNDS.map(o => [o.clap, o.roll + .6]);
  const LAUGH = [BT.laugh - .3, BT.p3 + .4];
  const T1 = BT.toss1, T1UP = T1 + .5, T1CATCH = T1 + 1.6;                   // Part 1: release, catch
  const SOLVE = [BT.solve + .3, BT.solve + 3.7];                              // Part 2: the solve (14 clicks)
  const SCRAM = [BT.scram + .6, BT.scram + 2.4];                               // Part 3: scrambling it again
  const T3 = BT.toss3, T3UP = T3 + .55, T3CATCH = T3 + 1.8, T3SOLVED = T3 + 2.6;
  const AWARD = [0, 1, 2, 3].map(i => BT.trophy + .9 + i * 1.1);               // one trophy every 1.1 s
  const STAGE_AT = BT.trophy, TALK = BT.sf1;
  const FREEZE = lineEnd('sf5') + .2, END = BT.END;

  // ---------- helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who && !(l.chorus || []).includes(who)) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < textLen(l); });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t >= a && t < b;
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const clapping = t => CLAPS.some(([a, b]) => inW(t, a, b));
  const laughing = t => inW(t, ...LAUGH);
  const still = (x, z, y = 0) => ({ x, z, y });
  const OFF = { x: 0, z: -9999, y: 0, off: true };

  // the cube's state: how solved it is, which row is turning and how far, and which scramble
  function cubeState(t) {
    const steps = (a, b, n, from, to, seed) => {
      const u = seg(t, a, b), p = u * n, i = Math.min(n - 1, Math.floor(p));
      return { solve: lerp(from, to, u >= 1 ? 1 : i / n), twist: u > 0 && u < 1 ? ease(frac(p)) : 0, row: i % 3, seed: seed + (from > to ? i : 0) };
    };
    if (t < SOLVE[0]) return { solve: 0, seed: 1 };
    if (t < SOLVE[1]) return steps(...SOLVE, 14, 0, 1, 1);
    if (t < SCRAM[0]) return { solve: 1, seed: 1 };
    if (t < SCRAM[1]) return { ...steps(...SCRAM, 8, 1, 0, 2), seed: 2 };
    if (t < T3CATCH) return { solve: 0, seed: 2 };
    if (t < T3SOLVED) return { ...steps(T3CATCH, T3SOLVED - .1, 8, 0, 1, 2), seed: 2 };
    return { solve: 1, seed: 2 };
  }
  // the cube's height above Danny's hand during a throw (local units) and its spin
  function tossLift(t) {
    if (inW(t, T1UP, T1CATCH)) { const u = seg(t, T1UP, T1CATCH); return { h: 16 * Math.sin(Math.PI * u), spin: TAU * 1.5 * u }; }
    if (inW(t, T3UP, T3CATCH)) { const u = seg(t, T3UP, T3CATCH); return { h: 30 * Math.sin(Math.PI * u), spin: TAU * 3 * u }; }
    return null;
  }

  // ---------- blocking (world units) ----------
  const STAGE_Y = 100, STAGE_Z = 200, COURT_Z = 820, SIDE_Z = 780;
  const SIDE = { alma: -470, jenna: -370, housam: -270 };                    // the sideline, cheering Danny on
  const PODIUM = { alma: -270, jenna: -110, housam: 70, danny: 230 };         // the trophy line-up on stage
  const TALKX = { safadi: -380, alma: -240, jenna: -120, housam: 10, danny: 150, sami: 300 };
  const SEATX = [-600, -480, -360, -240, -120, 120, 240, 360, 480, 600];
  const BROS = { safadi: [480, 1], sami: [600, 1] };
  const GONE = new Set(['0:360', '0:480', '0:600']);
  const PARENTS = [];
  CB_ROWS.forEach((z, row) => SEATX.forEach((x, i) => {
    const key = row + ':' + x;
    if (GONE.has(key)) return;
    if (key === '2:-120' || Object.values(BROS).some(([bx, br]) => bx === x && br === row)) return PARENTS.push({ x, z, row, empty: true });
    const seed = 200 + row * 17 + i * 5, look = { ...studentLook(seed), backpack: false, cap: hash(seed) < .15 };
    look.h *= 1.3;
    PARENTS.push({ x, z, row, seed, look });
  }));

  function at(name, t) {
    if (name === 'safadi' || name === 'sami') return t >= TALK ? still(TALKX[name], STAGE_Z, STAGE_Y) : OFF;
    if (CB_JUDGES[name] != null) return still(CB_JUDGES[name], 1262);
    if (t >= TALK) return still(TALKX[name], STAGE_Z, STAGE_Y);
    if (t >= STAGE_AT) return still(PODIUM[name], STAGE_Z, STAGE_Y);
    if (name === 'danny') return still(0, COURT_Z);
    return still(SIDE[name], SIDE_Z + (name === 'jenna' ? 10 : 0));
  }

  // ---------- poses: the kids ----------
  const kidBase = (name, t, rest = 'smile') => { const talk = speaking(name, t); return [{ mouth: lipFlap(t, talk, rest), brows: 'normal', lookX: 0, turn: 0 }, talk]; };
  // per-rig hand targets: [hold at chest, arms up in a V, trophy overhead]
  const HANDS = {
    alma: { chest: [[-1.4, -4.6], [1.4, -4.6]], v: [[-5.4, -10.6], [5.4, -10.6]], up: [[-1.2, -15.0], [1.2, -15.0]], laugh: [[-.6, -10.6], [.6, -10.6]] },
    jenna: { chest: [[-1.6, -12.4], [1.6, -12.4]], v: [[-7.6, -21.0], [7.6, -21.0]], up: [[-1.2, -28.0], [1.2, -28.0]], laugh: [[-.6, -19.0], [.6, -19.0]] },
    housam: { chest: [[-1.8, -12.2], [1.8, -12.2]], v: [[-5.2, -24], [5.2, -24]], up: [[-1.4, -31.0], [1.4, -31.0]], laugh: [[-4.1, -14.1], [4.1, -14.1]] },
    danny: { chest: [[-1.8, -10.2], [1.8, -10.2]], v: [[-4.3, -19.3], [4.3, -19.3]], up: [[-1.3, -25.5], [1.3, -25.5]], laugh: [[-3.5, -12.1], [3.5, -12.1]] },
  };
  const hands = (name, key, pose = 'palm') => ({ handL: HANDS[name][key][0], handR: HANDS[name][key][1], handPoseL: pose, handPoseR: pose });
  // the trophies: when each kid gets theirs (index into AWARD), and what's on top
  const TROPHY = { alma: [0, 'rope'], jenna: [1, 'rope'], housam: [2, 'ball'], danny: [3, 'cube'] };
  const hasTrophy = (name, t) => t >= AWARD[TROPHY[name][0]];

  // the sideline cheer: Alma, Jenna and Housam watch Danny (screen-right of them), cheer each part, laugh at the puggle
  function cheerPose(name, t, o) {
    const set = p => Object.assign(o, p), talk = speaking(name, t);
    set({ lookX: -.6, turn: -.15, brows: 'up', mouth: talk ? o.mouth : 'smile', eyes: 'open' });
    if (talk) set({ ...hands(name, 'v'), eyes: 'happy', jump: 1.0 * bounce(t, 5, name.length), lookX: -.3 });
    if (clapping(t) || inW(t, T3SOLVED, BT.clap3)) set({ ...hands(name, 'v'), eyes: 'happy', mouth: 'grin', jump: 1.2 * bounce(t, 5, name.length) });
    if (inW(t, BT.p1 + .2, BT.dn2)) set({ brows: 'worried', mouth: 'o', eyes: 'wide' });
    if (inW(t, BT.p2 + .2, BT.dn5)) set({ brows: 'worried', mouth: 'flat' });
    if (laughing(t)) set({ ...hands(name, 'laugh', 'fist'), eyes: 'happy', mouth: bounce(t, 12) > .5 ? 'grin' : 'open', dy: .25 * bounce(t, 12), tilt: -.1 });
    return o;
  }
  // on stage: a trophy drops into their hands, up it goes over their head, then they hold it at the chest
  function podiumPose(name, t, o) {
    const set = p => Object.assign(o, p), got = AWARD[TROPHY[name][0]];
    set({ ...hands(name, 'chest', 'fist'), mouth: 'grin', eyes: 'open', brows: 'up' });
    if (t < got) return set({ ...hands(name, 'v'), mouth: 'smile', eyes: 'open', lookY: -.3, jump: .3 * bounce(t, 4, name.length) });
    if (t < got + 1.4) return set({ ...hands(name, 'up', 'fist'), eyes: 'happy', mouth: 'grin', jump: 1.6 * kick(t, got + .1, 3), _trophy: { up: true, k: backOut(seg(t, got - .3, got)) } });
    return set({ eyes: 'happy', jump: .4 * bounce(t, 5, name.length), _trophy: { up: false, k: 1 } });
  }
  // the talk with the brothers
  function talkPose(name, t, o, talk) {
    const set = p => Object.assign(o, p);
    set({ ...hands(name, 'chest', 'fist'), _trophy: { up: false, k: 1 }, brows: 'up', mouth: talk ? o.mouth : 'smile', eyes: 'open' });
    const toSafadi = TALKX.safadi < TALKX[name] ? 1 : -1;               // the stage view mirrors X
    if (inW(t, BT.sf1, BT.sm1) || inW(t, BT.sf3, BT.al1) || t >= BT.sf5) set({ lookX: .7 * toSafadi, turn: .12 * toSafadi });
    if (inW(t, BT.sm1, BT.sf3)) set({ lookX: name === 'danny' ? -.7 : -.6, turn: name === 'danny' ? -.12 : 0 });
    if (inW(t, BT.sf1, BT.sm1)) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin' });
    if (inW(t, BT.sf4 + 1.6, BT.al1)) set({ eyes: 'wide', brows: 'up' });
    if (inW(t, BT.samiLaugh - .2, BT.je1)) set({ ...hands(name, 'laugh', 'fist'), _trophy: { up: false, k: 1, low: true }, eyes: 'happy', mouth: 'grin', dy: .2 * bounce(t, 11) });
    return o;
  }

  function almaPose(t, a) {
    const [o, talk] = kidBase('alma', t, 'grin');
    if (t < STAGE_AT) return cheerPose('alma', t, o);
    if (t < TALK) return podiumPose('alma', t, o);
    talkPose('alma', t, o, talk);
    if (inW(t, BT.al1, BT.samiLaugh)) Object.assign(o, { brows: 'up', tilt: .1, lookX: .6, handR: [3.9, -9.6], handPoseR: 'point', mouth: talk ? o.mouth : 'o', emote: '?', emoteK: ease(seg(t, BT.al1 + 1.2, BT.al1 + 1.6)) });
    return o;
  }
  function jennaPose(t, a) {
    const [o, talk] = kidBase('jenna', t, 'grin');
    o.giraffe = false;
    if (t < STAGE_AT) return cheerPose('jenna', t, o);
    if (t < TALK) return podiumPose('jenna', t, o);
    talkPose('jenna', t, o, talk);
    if (inW(t, BT.je1, BT.sf5)) Object.assign(o, { brows: 'up', tilt: -.08, lookX: .7, handR: [3.6, -20], handPoseR: 'palm', mouth: talk ? o.mouth : 'o' });
    return o;
  }
  function housamPose(t, a) {
    const [o, talk] = kidBase('housam', t, 'smile');
    Object.assign(o, { footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7], handPoseL: 'open', handPoseR: 'open' });
    if (t < STAGE_AT) return cheerPose('housam', t, o);
    if (t < TALK) return podiumPose('housam', t, o);
    return talkPose('housam', t, o, talk);
  }

  // Danny's act. _cube says where the cube is: 'L' in his raised left hand, 'both' between his hands, plus a toss lift.
  function dannyPose(t, a) {
    const [o, talk] = kidBase('danny', t, 'grin'), set = p => Object.assign(o, p);
    if (t >= STAGE_AT) {
      if (t < TALK) return podiumPose('danny', t, o);
      talkPose('danny', t, o, talk);
      if (inW(t, BT.sm1, BT.dn7)) set({ brows: 'up', mouth: 'smirk', eyes: 'open' });
      if (inW(t, BT.dn7, BT.dn8)) set({ handR: [4.6, -19], handPoseR: 'point', handL: HANDS.danny.chest[0], jump: .6 * kick(t, BT.dn7 + .1, 4), eyes: 'happy' });
      if (inW(t, BT.dn8, BT.dn9)) set({ eyes: inW(t, BT.dn8 + 2.2, BT.dn8 + 3.4) ? 'squeeze' : 'open', brows: 'worried', mouth: talk ? o.mouth : 'wobble', tilt: inW(t, BT.dn8 + 2.2, BT.dn8 + 3.0) ? .06 * Math.sin(t * 38) : 0 });
      if (inW(t, BT.dn9, BT.sf3)) set({ ...hands('danny', 'up', 'fist'), _trophy: { up: true, k: 1 }, eyes: 'happy', brows: 'up' });
      if (inW(t, BT.sf4, BT.al1)) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', blush: .5 });
      return o;
    }
    // on the court: his foot on the ball, the cube in his left hand
    set({ footR: [2.6, -3.0], _footBall: true, handL: [-3.6, -12.5], handPoseL: 'fist', handR: [3.9, -10.5], handPoseR: 'open', brows: 'up', _cube: 'L' });
    const showOff = () => set({ handL: [-4.4, -19.5], handPoseL: 'fist', handR: [4.6, -17], handPoseR: 'point', eyes: 'happy' });
    if (inW(t, BT.dn1, T1) || inW(t, BT.dn4, BT.zoom1)) showOff();
    if (inW(t, T1, T1 + 2.6)) {                                                // Part 1: wind up, throw, wait, catch, ta-da
      if (t < T1UP) set({ handL: [-3.6, lerp(-12.5, -9.5, ease(seg(t, T1, T1 + .3)))], dy: .5 * seg(t, T1, T1UP), brows: 'focused' });
      else if (t < T1CATCH) set({ handL: [-4.2, -18.5], handPoseL: 'palm', lookY: -.8 * Math.sin(Math.PI * seg(t, T1UP, T1CATCH)), mouth: 'o', eyes: 'open', brows: 'up' });
      else set({ handL: [-4.4, -19.5], sq: .12 * boing(t, T1CATCH, 3, 6), eyes: 'happy', mouth: 'grin' });
    }
    if (clapping(t)) set({ handL: [-4.4, -19.5], handR: [4.4, -19.5], handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: .6 * bounce(t, 5) });
    if (inW(t, BT.p1 + .2, BT.dn2) || inW(t, BT.p2 + .2, BT.dn5)) set({ brows: 'worried', mouth: talk ? o.mouth : 'o', eyes: 'wide', lookX: .2 });
    if (inW(t, BT.dn2, BT.dn4) || inW(t, BT.dn5, BT.scram)) set({ handR: [4.0, -21], handPoseR: 'point', brows: 'focused', mouth: talk ? o.mouth : 'smirk', jump: 1.2 * kick(t, L(t < BT.dn5 ? 'dn3' : 'dn6').at, 4) });
    if (inW(t, BT.solve, BT.clap2)) set({ ...hands('danny', 'chest', 'fist'), _cube: 'both', brows: 'focused', lookY: .6 });
    if (inW(t, T3, T3 + 3.6)) {                                                // Part 3: the big throw, solved on the catch
      if (t < T3UP) set({ ...hands('danny', 'chest', 'fist'), _cube: 'both', dy: .8 * seg(t, T3, T3UP), brows: 'focused' });
      else if (t < T3CATCH) set({ handL: [-4.2, -18], handR: [4.2, -18], handPoseL: 'palm', handPoseR: 'palm', lookY: -.9 * Math.sin(Math.PI * seg(t, T3UP, T3CATCH)), mouth: 'o', _cube: 'L' });
      else if (t < T3SOLVED) set({ ...hands('danny', 'chest', 'fist'), _cube: 'both', _blur: 1, brows: 'focused', mouth: 'smirk', lookY: .5, sq: .1 * boing(t, T3CATCH, 3, 6) });
      else set({ handL: [-4.4, -19.5], handR: [4.6, -17], handPoseR: 'point', eyes: 'happy', mouth: 'grin', jump: 1.4 * kick(t, T3SOLVED, 3) });
    }
    if (inW(t, BT.d3, BT.laugh)) set({ handL: [-4.4, -19.5], eyes: 'happy', mouth: 'grin' });
    if (laughing(t)) set({ ...hands('danny', 'laugh', 'fist'), _cube: 'both', eyes: 'happy', mouth: bounce(t, 12) > .5 ? 'grin' : 'open', dy: .18 * bounce(t, 10), tilt: -.1 });
    return o;
  }

  // the brothers on stage
  function brotherPose(name, t) {
    const talk = speaking(name, t), me = name === 'safadi';
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: me ? -.6 : .6, turn: me ? -.15 : .15, brows: 'up', eyes: 'open', handL: [-3.6, -3.4], handR: [3.6, -3.4], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (me) {
      if (inW(t, BT.sf1, BT.sm1)) set({ handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', eyes: talk ? 'open' : 'happy' });
      if (inW(t, BT.sm1, BT.sf3)) set({ lookX: -.8, mouth: talk ? o.mouth : 'smile' });
      if (inW(t, BT.dn8, BT.dn9)) set({ eyes: 'happy', mouth: 'grin', handR: [1.2, -13.6], handPoseR: 'fist' });
      if (inW(t, BT.sf3, BT.sf4)) set({ handR: [5.8, -21.4], handPoseR: 'point', lookY: -.3 });
      if (inW(t, BT.sf4, BT.al1)) set({ handR: [5.6, -15], handPoseR: 'fist', handL: [-3.4, -6], eyes: 'wink', mouth: talk ? o.mouth : 'grin' });
      if (inW(t, BT.al1, BT.samiLaugh)) set({ eyes: 'wide', mouth: 'o', brows: 'up' });
      if (inW(t, BT.samiLaugh, BT.je1)) set({ eyes: 'happy', mouth: 'grin', lookX: -.8 });
      if (t >= BT.sf5) set({ power: on(t, BT.sf5, END + 1, .3), eyes: 'glow', brows: 'up', mouth: talk ? o.mouth : 'grin', handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm', jump: .5 * kick(t, BT.sf5, 3), lookX: -.3 });
    } else {
      if (inW(t, BT.sf1, BT.sm1)) set({ eyes: 'happy', mouth: 'smile', lookX: .8 });
      if (inW(t, BT.sm1, BT.dn7)) set({ lookX: .7, brows: 'worried', handR: [4.6, -12.6], handPoseR: 'palm', mouth: talk ? o.mouth : 'flat' });
      if (inW(t, BT.dn7, BT.sf3)) set({ lookX: .7, eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'o' });
      if (inW(t, BT.dn8 + 1, BT.dn9)) set({ eyes: 'happy', mouth: 'grin', handL: [-2.2, -9.5], handPoseL: 'fist' });
      if (inW(t, BT.samiLaugh - .3, BT.je1 + .4)) { const k = bounce(t, 13); set({ handL: [-2.2, -9.5], handR: [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'squeeze', mouth: k > .5 ? 'grin' : 'open', dy: .4 * k, tilt: -.08 }); }
      if (t >= BT.sf5) set({ lookX: .8, eyes: 'open', mouth: 'smile' });
    }
    return o;
  }

  // ---------- poses: the audience ----------
  function parentPose(p, t) {
    const ph = hash(p.seed) * 7, clap = clapping(t - hash(p.seed * 3) * .25);
    const o = { seed: p.seed, look: p.look, dy: 6.6, footL: [-1.7, 5.7], footR: [1.7, 5.7], handL: [-2.6, -9.2], handR: [2.6, -9.2], handPoseL: 'open', handPoseR: 'open',
      mouth: 'smile', eyes: 'open', lookX: .3 * Math.sin(ph), lookY: 0, noShadow: true };
    if (clap) {
      const c = Math.max(0, Math.sin((t + ph) * TAU * 3.1));
      Object.assign(o, { handL: [-.9 - 1.8 * (1 - c), -14.2], handR: [.9 + 1.8 * (1 - c), -14.2], handPoseL: 'palm', handPoseR: 'palm', mouth: 'grin', eyes: hash(p.seed * 7) < .5 ? 'happy' : 'open', jump: .25 * c });
    }
    if (inW(t, BT.p1 + .2, BT.dn2)) Object.assign(o, { mouth: 'o', eyes: 'wide' });
    if (laughing(t - hash(p.seed * 5) * .3)) Object.assign(o, { eyes: 'happy', mouth: bounce(t + ph, 11) > .5 ? 'grin' : 'open', handL: [-1.0, -10.4], handR: [1.0, -10.4], handPoseL: 'fist', handPoseR: 'fist', dy: 6.6 + .25 * bounce(t + ph, 11) });
    return o;
  }
  const SIT_ADULT = { dy: 7.4, footL: [-2.1, 6.4], footR: [2.1, 6.4], handL: [-3.6, -3.4], handR: [3.6, -3.4], handPoseL: 'open', handPoseR: 'open' };
  function seatedBrother(name, t) {                                           // in the second row until the trophies
    const me = name === 'safadi', o = { mouth: 'smile', lookX: 0, turn: 0, brows: 'up', eyes: 'open', ...SIT_ADULT }, set = p => Object.assign(o, p);
    if (clapping(t)) { const c = Math.max(0, Math.sin((t + (me ? 0 : .3)) * TAU * 3)); set({ handL: [-1.0 - 1.8 * (1 - c), -12.8], handR: [1.0 + 1.8 * (1 - c), -12.8], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin' }); }
    if (!me && inW(t, BT.p1 + .2, BT.dn2)) set({ eyes: 'wide', brows: 'worried', mouth: 'wobble', emote: 'sweat', emoteK: 1 });
    if (laughing(t)) { const k = bounce(t, 13, me ? 0 : 1); set({ handL: [-2.2, -9.5], handR: [2.2, -9.5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'squeeze', mouth: k > .5 ? 'grin' : 'open', dy: SIT_ADULT.dy + .4 * k }); }
    return o;
  }

  // ---------- poses: the judges ----------
  const cardUp = (r, j, t) => { const at = r[j] - .15; return t < at || t >= r.end ? 0 : backOut(seg(t, at, at + .3)) * (1 - ease(seg(t, r.end - .25, r.end))); };
  const roundAt = t => ROUNDS.find(r => t >= r.roll - .2 && t < r.end);
  function festerPose(t) {
    const talk = speaking('jester_fester', t), o = { mouth: lipFlap(t, talk, 'smile'), handL: [-4.6, -9.8], handR: [4.6, -9.8], handPoseL: 'open', handPoseR: 'open', lookX: 0, eyes: 'open' };
    const set = p => Object.assign(o, p), r = roundAt(t);
    if (clapping(t)) { const c = Math.max(0, Math.sin((t + .2) * TAU * 3)); set({ handL: [-.9 - 1.8 * (1 - c), -13.4], handR: [.9 + 1.8 * (1 - c), -13.4], handPoseL: 'cup', handPoseR: 'cup', eyes: r?.r === 1 ? 'open' : 'happy', mouth: r?.r === 1 ? 'smile' : 'grin' }); }
    if (r) {
      const up = cardUp(r, 'f', t);
      if (up > 0) set({ handR: [4.8, -21.6], handPoseR: 'fist', _card: { num: r.scores[1], k: up, t0: r.f - .15 } });
      if (r.r === 1) set({ brows: 'normal', mouth: talk ? o.mouth : 'flat', eyes: inW(t, r.p, r.p + 1.2) ? 'wide' : 'open', hatDroop: t > r.f ? .25 : 0 });
      if (r.r === 2) set({ eyes: talk ? 'open' : 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up', jump: inW(t, r.f, r.p) ? .8 * bounce(t, 6) : 0 });
      if (r.r === 2 && inW(t, r.f + 1.2, r.p)) set({ handL: [-1.2, -17], handPoseL: 'open', tilt: .08 });     // a hand on his head: "can't solve puzzles!"
      if (r.r === 3) set({ eyes: talk ? 'open' : 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up', hatSway: [.5 * Math.sin(t * 9), 0] });
    }
    if (laughing(t)) { const k = bounce(t, 12); set({ eyes: 'squeeze', mouth: k > .5 ? 'grin' : 'open', handL: [-3.0, -9.0], handR: t < BT.p3 ? [3.0, -9.0] : o.handR, dy: .4 * k, tilt: -.08, hatSway: [.8 * Math.sin(t * 12), 0] }); }
    return o;
  }
  function dragonPose(t) {
    const talk = speaking('dragon', t), o = { mouth: lipFlap(t, talk, 'smile'), wings: .25, flap: .15 * wob(t, .5), lookX: .25, eyes: 'open', brows: 'normal' };
    const set = p => Object.assign(o, p), r = roundAt(t);
    if (clapping(t)) set({ eyes: 'happy', mouth: 'grin', wings: .6, flap: .6 * Math.sin(t * 16) });
    if (r) {
      const up = cardUp(r, 'd', t);
      if (up > 0) set({ _card: { num: r.scores[0], k: up, t0: r.d - .15 }, eyes: 'happy', mouth: talk ? o.mouth : 'grin', brows: 'up' });
      if (inW(t, r.d, r.d + 1.6)) set({ wings: .7, flap: .7 * Math.sin(t * 14), jump: (r.r > 1 ? 3 : 1.2) * bounce(t, 5) });
      if (r.r === 1 && t > r.p + .2) set({ eyes: 'wide', mouth: 'o', lookX: .7, wings: .2, flap: 0, jump: 0 });
      if (r.r === 3 && inW(t, BT.d3b, BT.laugh)) set({ lookX: .6, eyes: 'open', mouth: talk ? o.mouth : 'o', brows: 'up', headTilt: .2 });
    }
    if (laughing(t)) set({ eyes: 'happy', mouth: bounce(t, 11) > .5 ? 'grin' : 'open', wings: .5, flap: .4 * Math.sin(t * 12), jump: 1.2 * bounce(t, 6) });
    return o;
  }
  function pearlPose(t) {
    const talk = speaking('princess_pearl', t), o = { sit: 1, mouth: lipFlap(t, talk, 'flat'), eyes: 'bored', brows: 'flat', lookX: -.2, wag: .2 * Math.sin(t * 1.4) };
    const set = p => Object.assign(o, p), r = roundAt(t);
    if (clapping(t) && r?.r !== 1) set({ flipNear: -.6 + .5 * Math.sin(t * 14), eyes: 'open', mouth: 'smile', brows: 'normal' });
    if (r) {
      const up = cardUp(r, 'p', t);
      if (up > 0) set({ point: 1, pointAng: -1.3, _card: { num: r.scores[2], k: up, t0: r.p - .15 } });
      if (r.r === 1) set({ eyes: inW(t, L('p1b').at + 1.6, L('p1b').at + 2.2) ? 'closed' : 'bored', mouth: talk ? o.mouth : 'flat', headTilt: .25 });
      if (r.r === 2) set({ eyes: 'open', brows: 'flat', mouth: talk ? o.mouth : 'smirk', headTilt: .1 });
      if (r.r === 3) set({ eyes: t > r.p ? 'sparkle' : 'open', brows: 'up', mouth: talk ? o.mouth : 'smile', wag: .7 * Math.sin(t * 7), blush: .6 });
    }
    if (laughing(t) && t < BT.p3) set({ eyes: 'happy', mouth: bounce(t, 11) > .5 ? 'smile' : 'open', wag: .8 * Math.sin(t * 9), blush: .6, headTilt: -.15 });
    return o;
  }

  // ---------- the cast table ----------
  const PEARL_S = .62;
  const CAST = {
    alma: { rig: alma, unit: ALMA_UNIT, pose: almaPose }, jenna: { rig: jenna, unit: JENNA_UNIT, pose: jennaPose },
    housam: { rig: housam, unit: HOUSAM_UNIT, pose: housamPose }, danny: { rig: danny, unit: DANNY_UNIT, pose: dannyPose },
    safadi: { rig: safadi, unit: SAFADI_UNIT, pose: t => brotherPose('safadi', t) }, sami: { rig: sami, unit: SAMI_UNIT, pose: t => brotherPose('sami', t) },
    jester_fester: { rig: jester, unit: JF_UNIT, pose: festerPose }, dragon: { rig: dragon, unit: DRAGON_UNIT, pose: dragonPose },
    princess_pearl: { rig: pearl, unit: PP_UNIT * PEARL_S, pose: pearlPose, y: 46 },
  };
  // the stage hoop stays down (scene 24 lowered it for Housam) until the trophies; then it's winched back up out of the way
  const GSET = t => ({ lights: .92, sun: .45, curtain: 1, stageHoopUp: t < STAGE_AT ? 0 : 1, clock: 600, period: 1 });

  // ---------- drawing ----------
  function drawChar(P, name, a, t, A, S, fz) {
    const c = CAST[name], pose = { ...c.pose(t, a), t, ...fz };
    const [sx, sy, k] = P.p(a.x, (a.y || 0) + (c.y || 0), a.z), s = c.unit * k;
    const Ax = A[name] = c.rig(sx, sy, s, pose);
    S[name] = s;
    if (name === 'danny' && pose._footBall) dannyBall(sx + 3.0 * s, sy - 1.35 * s, s, { spin: .4 });
    if (name === 'danny' && pose._cube) {                                      // the cube: in his hand, between his hands, or in the air
      const st = cubeState(t), lift = tossLift(t), cs = s * .65;
      let [cx, cy] = pose._cube === 'both' ? [(Ax.handL[0] + Ax.handR[0]) / 2, (Ax.handL[1] + Ax.handR[1]) / 2 - .9 * s] : [Ax.handL[0], Ax.handL[1] - 1.1 * s];
      if (lift) cy -= lift.h * s;
      if (pose._blur) for (let i = 1; i <= 3; i++) { X.save(); X.globalAlpha = .25; cdCube(cx + (i % 2 ? -1 : 1) * i * .5 * s, cy, cs, { ...st, ang: .3 * Math.sin(t * 50 + i) }); X.restore(); }
      cdCube(cx, cy, cs, { ...st, ang: lift ? lift.spin : .05 * Math.sin(t * 3) + (pose._blur ? .25 * Math.sin(t * 47) : 0), glow: t > T3SOLVED && t < T3SOLVED + 1.2 ? 1 - seg(t, T3SOLVED, T3SOLVED + 1.2) : 0 });
      if (pose._blur) sfx('TWIST! TWIST!', cx, cy - 5 * s, 44, '#8FE3FF', t - T3CATCH, { life: .8 });
    }
    if (pose._trophy && TROPHY[name]) {                                         // the golden trophy in their hands
      const tr = pose._trophy, mx = (Ax.handL[0] + Ax.handR[0]) / 2, my = tr.up ? Math.min((Ax.handL[1] + Ax.handR[1]) / 2, Ax.top[1] - .3 * s) : (Ax.handL[1] + Ax.handR[1]) / 2;   // raised: above the head
      cdTrophy(mx, my + (tr.up ? .4 : 2.6) * s, (tr.up ? 9 : 7) * s * (name === 'alma' ? .8 : 1), TROPHY[name][1], tr.k, t);   // held low, below the chin
    }
    if (pose._card) {                                                         // the judges' score paddles
      const cd = pose._card, hk = 64 * k;
      if (name === 'jester_fester') cbScoreCard(Ax.handR[0], Ax.handR[1] + .4 * s, hk, cd.num, cd.k, { t, t0: cd.t0, ang: .1 });
      if (name === 'dragon') cbScoreCard(Ax.pawR[0] - 1.0 * s, Ax.pawR[1] - 6 * s, hk, cd.num, cd.k, { t, t0: cd.t0, ang: -.35 });
      if (name === 'princess_pearl') cbScoreCard(Ax.flipper[0], Ax.flipper[1], hk, cd.num, cd.k, { t, t0: cd.t0, ang: .3 });
    }
  }
  function drawCrowd(P, t, A, S, fz) {                                       // the parents and (until the trophies) the brothers
    for (let row = CB_ROWS.length - 1; row >= 0; row--) {
      for (const p of PARENTS.filter(q => q.row === row)) {
        if (!P.visible(p.z)) continue;
        cbChair(P, p.x, p.z);
        if (p.empty) continue;
        const [sx, sy, k] = P.p(p.x, CB_SEAT, p.z + 14);
        student(sx, sy, STUDENT_UNIT * k, { ...parentPose(p, t), t, ...fz });
      }
      if (t >= TALK) continue;
      for (const name of ['safadi', 'sami']) {
        if (BROS[name][1] !== row) continue;
        const z = CB_ROWS[row] + 8; if (!P.visible(z)) continue;
        const [sx, sy, k] = P.p(BROS[name][0], CB_SEAT, z), rig = name === 'safadi' ? safadi : sami, unit = name === 'safadi' ? SAFADI_UNIT : SAMI_UNIT;
        A[name] = rig(sx, sy, unit * k, { ...seatedBrother(name, t), t, noShadow: true, ...fz }); S[name] = unit * k;
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
    items.sort((p, q) => P.depth(q.z) - P.depth(p.z));
    const gs = GSET(t);
    layer(() => G.back(P, t, { ...gs, splitZ: items.length ? items[0].z : -Infinity }), { blur });
    if (P.dir < 0) { cbBanner(P, t); if (o.spot) for (const n of o.spot) { const a = at(n, t); if (!a.off && P.visible(a.z)) { const [x, y, k] = P.p(a.x, a.y, a.z); cbSpot(x, 0, y, 150 * k, .16); } } }
    items.forEach((it, i) => { it.draw(); G.front(P, t, { ...gs, splitZ: it.z, toZ: items[i + 1]?.z }); });
    overWorld(t, P, A, S);
    return { A, S, P };
  }
  function overWorld(t, P, A, S) {
    if (A.danny && t < STAGE_AT) {
      sfx('PART 2!', A.danny.top[0] + 6 * S.danny, A.danny.top[1] - 6 * S.danny, 70, PAL.goldLt, t - L('dn3').at - .2, { life: 1.2 });
      sfx('PART 3!', A.danny.top[0] + 6 * S.danny, A.danny.top[1] - 6 * S.danny, 70, '#FFB3D9', t - L('dn6').at - .2, { life: 1.2 });
      sfx('CATCH!', A.danny.top[0] - 5 * S.danny, A.danny.top[1] - 10 * S.danny, 60, '#8FE3FF', t - T1CATCH, { life: 1.0 });
      sfx('SOLVED!', A.danny.top[0], A.danny.top[1] - 14 * S.danny, 72, PAL.goldLt, t - T3SOLVED, { life: 1.4 });
    }
    if (A.princess_pearl) sfx('...', A.princess_pearl.head[0] + 50, A.princess_pearl.head[1] - 80, 60, '#DDD', t - BT.p1 - .2, { life: .9 });
    if (A.dragon && laughing(t) && t < BT.p3) sfx('HA HA HA!', A.dragon.head[0] + 120, A.dragon.head[1] - 160, 58, PAL.goldLt, t - BT.laugh, { life: 2.2 });
    if (A.sami && inW(t, BT.samiLaugh, BT.je1 + .4)) sfx('HA HA!', A.sami.head[0], A.sami.head[1] - 120, 58, PAL.goldLt, t - BT.samiLaugh, { life: 1.6 });
    for (const [name, [i]] of Object.entries(TROPHY)) if (A[name] && t < TALK) sfx('★', A[name].top[0], A[name].top[1] - 8 * S[name], 70, PAL.goldLt, t - AWARD[i] + .2, { life: .9 });
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const key = l.speaker, a = A?.[key], s = S?.[key];
      const c = { size: o.size || 48, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60 && a.mouth[1] > 40 && a.mouth[1] < H) {
        const side = o.side ? o.side(key, a) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * (HEADW[key] || 5) * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 280), dy: o.dy ?? -200 });
      } else if (o.edge !== false) callout(l.text, W + 30, H * .3, age, { ...c, dx: -420, dy: -100 });
    }
  }

  // ---------- the close-up of the cube: an insert over the gym, thrown out of focus ----------
  function closeup(t, lt) {
    const P = persp({ x: 0, y: 140, z: 1030, f: 1600, hy: 300, dir: -1 });
    layer(() => G.back(P, t, { ...GSET(t), splitZ: -Infinity }), { blur: 12 });
    overlay(() => { X.save(); X.fillStyle = 'rgba(31,20,40,.35)'; X.fillRect(0, 0, W, H); X.restore(); });
    const solved = t >= BT.zoom3, push = solved ? lerp(.55, 1, backOut(seg(t, BT.zoom3, BT.zoom3 + .6))) : lerp(.88, 1, ease(seg(lt, 0, 2.5)));
    const st = cubeState(t), s = 120 * push, x = W / 2 - .4 * s, y = H / 2 + 30 + 12 * Math.sin(t * 2.1);
    const twitch = (inW(t, ...SOLVE) || inW(t, ...SCRAM)) ? 1 : 0;
    cdCube(x, y, s, { ...st, ang: .04 * Math.sin(t * 1.7) + .02 * twitch * Math.sin(t * 31), glow: solved ? .8 + .2 * Math.sin(t * 6) : 0 });
    if (!solved) cdHands(x, y, s, t, { jig: twitch });
    if (inW(t, ...SOLVE) || inW(t, ...SCRAM)) for (let i = 0; i < 3; i++) sfx('CLICK!', x + (i - 1) * 300, y - 330 - 40 * (i % 2), 46, '#FFFDF6', frac((t - SOLVE[0]) / .72 + i / 3) * .72, { life: .5 });
    if (t >= BT.solve) {                                                       // a stopwatch, counting the solve
      const secs = clamp(t - SOLVE[0], 0, SOLVE[1] - SOLVE[0]), done = t >= SOLVE[1];
      if (t < BT.scram) cbCard(`TIME: ${secs.toFixed(1)} s`, 1, { tag: true, x: 1560, y: 130, ink: done ? '#E3A21A' : '#2E8F94' });
    }
    if (t >= SOLVE[1] && t < BT.scram) sfx('SOLVED!', W / 2, 190, 96, PAL.goldLt, t - SOLVE[1], { life: 1.6 });
    if (inW(t, BT.zoom1 + .3, BT.solve)) sfx('SCRAMBLED!', W / 2, 190, 80, '#FFB3D9', t - BT.zoom1 - .3, { life: 1.6 });
    if (solved) {
      flash(.5 * kick(t, BT.zoom3, 6));
      for (let i = 0; i < 8; i++) { const a = t * .8 + i * TAU / 8, r = (3.6 + .3 * Math.sin(t * 5 + i)) * s; shape(starPts(x + .4 * s + Math.cos(a) * r, y - .4 * s + Math.sin(a) * r * .8, (.18 + .1 * Math.sin(t * 9 + i)) * s, .4, 4), { fill: '#FFF1A8', stroke: PAL.ink, lwPx: 2 }); }
      sfx('SOLVED!', W / 2, 170, 100, PAL.goldLt, t - BT.zoom3 - .3, { life: 1.8 });
    }
  }

  // ---------- cameras ----------
  const drift = t => [10 * Math.sin(t * .23), 5 * Math.sin(t * .31)];
  const cam = (x, y, z, hy, f, dir) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir }; };
  const KIDS = cam(-280, 150, 1110, 380, 1000, -1);                            // the sideline: Alma, Jenna, Housam (Danny at the right)
  const COURT = cam(60, 160, 1130, 430, 900, -1);                              // Danny on the court, room for the big throw
  const COURTM = cam(0, 140, 1030, 330, 950, -1);                              // Danny, closer
  const AUDW = cam(0, 260, 840, 430, 760, 1);                                  // the judges and every parent
  const JUDGES = cam(0, 140, 820, 380, 1050, 1);                               // the judges' table
  const STAGEW = cam(0, 200, 1080, 470, 1250, -1);                             // the whole stage
  const PODM = cam(0, 205, 620, 545, 1050, -1);                                // the trophy line-up, closer
  const TALKW = cam(-30, 205, 760, 520, 1000, -1);                             // everyone on stage
  const SAFM = cam(-250, 205, 540, 520, 1000, -1);                             // Safadi with Alma and Jenna
  const SAMM = cam(290, 205, 540, 520, 1000, -1);                              // Danny with Sami
  const ENDC = t => ({ ...SAFM(t), z: lerp(540, 470, ease(seg(t, BT.sf5, FREEZE))), hy: lerp(520, 500, ease(seg(t, BT.sf5, FREEZE))) });

  const leftRight = (key, a) => a.mouth[0] < W * .5 ? 1 : -1;
  const shot = (camFn, blur, bo, o = {}) => t => { const { A, S, P } = stage(t, camFn(t), blur, o); bubbles(t, A, S, bo); if (o.extra) o.extra(t, A, S, P); };
  const kids = shot(KIDS, 1.4, { size: 50, side: () => 1, far: 260, dy: -200 }, { extra: t => cbCard('THE CUBE DROPS', on(t, .3, 3.2, .3), { tag: true, x: 420, y: 980, ink: '#2E7D9A' }) });
  const court = shot(COURT, .6, { size: 48, side: () => 1, far: 260, dy: -200 });
  const courtMed = shot(COURTM, 2.0, { size: 50, side: () => 1, far: 280, dy: -190 });
  const audWide = shot(AUDW, 0, { size: 44, side: leftRight, far: 220, dy: -180 });
  const judges = shot(JUDGES, 1.6, { size: 48, side: k => k === 'princess_pearl' ? -1 : 1, far: 240, dy: -230 }, { crowdBlur: 2.2 });
  const trophies = shot(STAGEW, .4, { size: 46 }, { spot: ['alma', 'jenna', 'housam', 'danny'], extra: t => cbCard('THE TROPHIES', on(t, STAGE_AT + .2, STAGE_AT + 2.6, .3), { tag: true, x: 420, y: 980, ink: '#E3A21A' }) });
  const podium = shot(PODM, 1.0, { size: 48 }, { spot: ['alma', 'jenna', 'housam', 'danny'] });
  const talkW = shot(TALKW, .8, { size: 46, side: leftRight, far: 240, dy: -200 });
  const safM = shot(SAFM, 2.2, { size: 50, side: k => k === 'safadi' ? -1 : 1, far: 260, dy: -200 });
  const samM = shot(SAMM, 2.2, { size: 50, side: () => 1, far: 240, dy: -250 });
  function ending(t) {
    const tt = Math.min(t, FREEZE), { A, S } = stage(tt, ENDC(tt), 2.4, { freeze: t > FREEZE });
    bubbles(tt, A, S, { size: 52, side: k => k === 'safadi' ? -1 : 1, far: 280, dy: -200, edge: false });
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

  const shots = [
    [0, kids], [BT.dn1, courtMed],
    [BT.clap1, audWide], [BT.roll1, judges],
    [BT.dn2, courtMed], [BT.zoom1, closeup],
    [BT.clap2, audWide], [BT.clap2 + 1.6, kids], [BT.roll2, judges],
    [BT.dn5, courtMed], [BT.scram, closeup], [BT.toss3, court], [BT.zoom3, closeup],
    [BT.clap3, audWide], [BT.roll3, judges], [BT.laugh, audWide], [BT.p3, judges],
    [BT.trophy, trophies], [AWARD[2] - .4, podium],
    [BT.sf1, talkW], [BT.sm1, samM], [BT.sf3, safM], [BT.samiLaugh, talkW], [BT.je1, safM], [BT.sf5, ending],
  ];
  scene({ duration: END, fps: 24, bpm: 120, shots });                         // id, title, dialogue, music: see asset.js
})();
