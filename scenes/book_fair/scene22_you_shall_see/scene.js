// Scene 22: "You Shall See". A music video for the whole cast, cut to the song (lyrics.js; SONG.md for the Gemini prompt).
// The DCES Book Fair in the school library, judged by Princess Pearl. Safadi croons about his books; Sami, Dragon and
// Robo-Safadi (with Clawd) all get "…Next."; then the kids' secret plan: Jester Fester reads his memoir while Danny waits up
// the ladder with a juggling ball for one word. Safadi supplies it ("EXPLAIN"), the BONK lands, Pearl laughs for the first
// time ever and Fester is HIRED. The tag: Dragon buys Safadi's books, Safadi starts explaining, "ANOTHER PROFESSOR."
// Story shots are in the library (reading view, dir −1: +X is screen-LEFT); the choruses and big numbers are motion-graphics
// backdrops like scene 17. Every shot is a pure function of t.
// Blocking (world): the stage is the story rug (−330, 240); Fester reads at (−430, 190) under the ladder (X −470, leaning on
// the back bookcase); Pearl's throne (170, 270); Safadi's stall = reading table 1 right, Robo's = table 1 left.
(() => {
  const L = LOCATIONS.school_library, LSET = { sun: .75, lamps: .65 };
  const PEARL_K = .72;                                                       // Pearl is a plush: a bit smaller on the library throne
  const KIDS = YS_KIDS;

  // ---------- timing (seconds into audio.mp3, 117.46 BPM) ----------
  // A line's beat is a fifth of a second before its first word (ysRow(id).at); word(id, i) is when word i is sung. The few
  // beats with no words (the band hit before chorus 1, the silence, the BONK, the record scratch) were measured from the audio.
  const at = id => ysRow(id).at, word = ysWordAt;
  const T_ = {
    dazzle: at('dazzle'), beep: at('beep'), ladies: at('ladies'), maths: word('maths', 0), physics: word('maths', 2), astro: word('maths', 4),
    face: at('face'), crown: at('crown'), foot: at('foot'), brag: at('brag'), gonna: at('gonna'), trophyLine: at('trophy'),
    trophy: word('trophy', 3), bag: word('trophy', 8), ready: at('ready'), ladder: at('ladder'), planning: at('planning'), shout: 40.6,
    C1: at('C1.0'), contestant: at('contestant'), boogers: at('boogers'), sneezes: word('sneezes', 2), burps: word('sneezes', 5), ew: at('ew'),
    popup: at('popup'), three: at('three'), achoo: word('three', 5), fire: at('fire'), prompt: at('prompt'), clawd: at('clawd'), pages: at('pages'),
    why: 82.9, bored: at('bored'), somebody: at('somebody'), majesty: word('somebody', 0) + .3, C2: at('C2.0'),
    fester: at('fester'), nohat: at('nohat'), jennaDrew: at('jennaDrew'), almaDance: word('jennaDrew', 4), dannyJokes: at('dannyJokes'),
    math: at('math'), point: at('point'), ladderLine: at('ladderLine'), waiting: at('waiting'), called: at('called'), ch1: at('ch1'), ch2: at('ch2'), ch3: at('ch3'),
    allow: at('allow'), explain: word('allow', 4), now: word('now', 0), freeze: 140.55, bonk: 140.97, haha: 142.0,
    laughed: at('laughed'), laughed2: at('laughed2'), hired: word('hired', 2), triumph: at('triumph'), FIN: at('F.0'), finBonk: word('F.4', 6),
    nobody: at('nobody'), crickets: word('nobody', 4) + .4, take: at('take'), splendid: at('splendid'), splainWord: word('splendid', 4),
    another: at('another'), scratch: 178.0, beepEnd: at('beepEnd'), END: 183.5,
  };
  T_.release = T_.bonk - .64;                                                // Housam's maths, honest: Danny lets go on "…now."
  T_.fall = T_.haha + 1.3;                                                   // Pearl laughs herself off the throne
  T_.perch = T_.ladder + .9;                                                 // Danny reaches his rung
  const FALL = T_.bonk - T_.release;
  const sing = (who, t, rest = 'smile', shapes) => lipFlap(t, ysSinging(who, t), rest, shapes);
  const on = (t, a, b, r = .25) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const bob = (t, amt = 1) => amt * Math.abs(Math.sin(beatPos(t) * Math.PI));   // a bounce on every beat
  const inRange = (t, a, b) => t >= a && t < b;

  // ---------- the rigs ----------
  const RIG = {
    safadi: [safadi, SAFADI_UNIT], sami: [sami, SAMI_UNIT], housam: [housam, HOUSAM_UNIT], alma: [alma, ALMA_UNIT],
    jenna: [jenna, JENNA_UNIT], danny: [danny, DANNY_UNIT], dragon: [dragon, DRAGON_UNIT], robo_safadi: [roboSafadi, ROBO_SAFADI_UNIT],
    jester_fester: [jester, JF_UNIT], clawd: [clawd, CLAWD_UNIT],
    princess_pearl: [(x, y, s, o) => pearl(x, y, s, o), PP_UNIT * PEARL_K],
  };
  // Draw any character at screen (x, y) with k px per world unit. Anchors come back in the current frame's coordinates.
  function loc(A) {
    const m = X.getTransform().invertSelf(), out = {};
    for (const k in A) { const p = A[k]; out[k] = Array.isArray(p) && typeof p[0] === 'number' ? [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f] : p; }
    return out;
  }
  const fig = (name, x, y, k, o = {}) => loc(RIG[name][0](x, y, RIG[name][1] * k, { t: T, ...o }));

  // ---------- blocking: where everyone is (world X, Z, and feet height Y) ----------
  const SAF = L.table(1, 300), ROB = L.table(1, -300);
  const STAGE = [-330, 240], FSPOT = [-430, 190], THRONE = [170, 270], OFF = [-3000, 0];
  const RUNG = ysLadderAt(.62);                                              // Danny's perch: y ≈ 155
  // [t, x, z, y]: hold between equal keys, ease between different ones.
  const LEAVE = T_.bag + .2, HUDDLE = LEAVE + 1.8, SWAP = T_.C1 + 3;        // the kids leave the stall after "bag!"; offstage swaps mid-chorus
  const BRIDGE = 109.4, ARRIVE = T_.laughed + 3.6;                           // the cut to Fester's spotlight; Fester reaches Pearl
  const PATH = {
    safadi: [[0, SAF.x, SAF.z], [SWAP, SAF.x, SAF.z], [SWAP + .01, 300, 380], [T_.allow - .6, 300, 380], [T_.allow + .3, -150, 270], [T_.FIN - 1, -150, 270], [T_.FIN - .99, SAF.x, SAF.z]],
    housam: [[0, 90, 660], [LEAVE, 90, 660], [HUDDLE, -290, 230], [SWAP, -290, 230], [SWAP + .01, 60, 330]],
    jenna: [[0, 15, 680], [LEAVE + .1, 15, 680], [HUDDLE + .1, -345, 265], [SWAP, -345, 265], [SWAP + .01, -15, 345]],
    alma: [[0, -55, 660], [LEAVE + .2, -55, 660], [HUDDLE + .2, -385, 300], [SWAP, -385, 300], [SWAP + .01, -90, 335]],
    danny: [[0, -125, 690], [LEAVE + .1, -125, 690], [T_.ladder - .5, -470, 150], [T_.ladder - .3, -470, 150], [T_.perch, RUNG.x, RUNG.z, RUNG.y], [T_.laughed, RUNG.x, RUNG.z, RUNG.y], [T_.laughed + .7, -250, 300]],
    sami: [[0, -540, 720], [T_.contestant, -540, 720], [T_.boogers - .1, ...STAGE], [T_.ew + .3, ...STAGE], [T_.ew + .8, -540, 720], [T_.bonk + .3, -540, 720], [T_.bonk + .31, -230, 380]],
    dragon: [[0, -540, 1000], [T_.ew + .1, -540, 1000], [T_.popup, -300, 250], [T_.fire + .3, -300, 250], [T_.fire + 1.1, -540, 1000], [T_.bonk + .3, -540, 1000], [T_.bonk + .31, -40, 200]],
    robo_safadi: [[0, ROB.x, ROB.z], [T_.prompt + .3, ROB.x, ROB.z], [T_.prompt + .31, -520, 1120], [T_.bonk + .3, -520, 1120], [T_.bonk + .31, 330, 190]],
    jester_fester: [[0, ...OFF], [BRIDGE - .01, ...OFF], [BRIDGE, ...FSPOT], [T_.laughed + .2, ...FSPOT], [ARRIVE, 40, 340]],
    clawd: [[0, -330, ROB.z + 75, 68], [T_.prompt + .3, -330, ROB.z + 75, 68], [T_.prompt + .31, ...OFF]],
    princess_pearl: [[0, ...THRONE, 95], [T_.fall, ...THRONE, 95], [T_.fall + .55, 110, 330, 0], [T_.nobody - .6, 110, 330, 0], [T_.nobody - .59, ...THRONE, 95]],
  };
  function pos(name, t) {
    const K = PATH[name]; let i = 0;
    while (i + 1 < K.length && t >= K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1] || a, u = b === a ? 0 : seg(t, a[0], b[0]);
    const same = a[1] === b[1] && a[2] === b[2] && (a[3] || 0) === (b[3] || 0);
    const quick = b[0] - a[0] < .05, e = same || quick ? (u >= 1 ? 1 : quick ? 1 : 0) : ease(u);
    const x = lerp(a[1], b[1], e), z = lerp(a[2], b[2], e), y = lerp(a[3] || 0, b[3] || 0, e);
    const d = Math.hypot(b[1] - a[1], b[2] - a[2]);
    return { x, z, y, moving: !same && !quick && u > 0 && u < 1, dist: d * u, dir: Math.sign(b[1] - a[1]) };
  }

  // ---------- poses ----------
  // Each returns rig options for time t. They know the story beats; shots only choose cameras.
  function safadiPose(t) {
    const o = { mouth: sing('safadi', t, 'smile'), handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', lookX: 0, brows: 'normal', breathe: 1 };
    const set = p => Object.assign(o, p);
    const p = pos('safadi', t);
    if (p.moving) return Object.assign(o, safadiWalk(p.dist / 58, 1), { turn: p.dir > 0 ? -.35 : .35, lookX: p.dir > 0 ? -.6 : .6, mouth: 'smirk' });
    if (t < T_.ladies) set({ lookX: .3, mouth: 'smile', handL: [-1.8, -11.6], handR: [1.8, -11.6], handPoseL: 'fist', handPoseR: 'fist' });          // straightening the books
    else if (t < T_.ready) {
      set({ handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', brows: 'up', tilt: .05 * Math.sin(t * 2), dy: -.2 * bob(t) });
      if (t > T_.maths - .2 && t < T_.brag) set({ power: on(t, T_.maths - .2, T_.brag, .4), eyes: t > T_.maths + .1 && t < T_.brag - .2 ? 'glow' : 'open' });
      if (t > T_.crown && t < T_.foot) set({ handR: [5.8, -21.4], handPoseR: 'point', bulb: on(t, T_.crown + .2, T_.foot, .2) });
      if (t > T_.brag && t < T_.gonna) set({ handL: [-1.2, -12.6], handR: [1.4, -12.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'closed', mouth: sing('safadi', t, 'smirk'), tilt: -.06 });
      if (t > T_.gonna && t < T_.trophyLine) set({ eyes: 'open', lookX: .8, brows: 'quizzical', mouth: 'flat', handL: [-4.4, -8.1], handR: [4.4, -8.1] });
      if (t > T_.trophyLine) set({ handR: [5.6, -14.2], handPoseR: 'fist', eyes: t > T_.bag ? 'wink' : 'open', mouth: sing('safadi', t, 'grin'), lookX: -.1 });
    } else if (t < SWAP) {
      set({ lookX: .9, turn: .2, mouth: sing('safadi', t, 'flat'), brows: 'quizzical' });
      if (t > T_.planning) set({ handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', emote: t > T_.planning + 1.6 ? 'sweat' : undefined, emoteK: 1 });
      if (t > T_.shout) set({ eyes: 'wide', brows: 'up', mouth: 'o', jump: .4 * kick(t, T_.shout + .2, 5) });
    } else if (t < T_.allow) {                                               // the smug spectator by the throne
      set({ handL: [-1.4, -11.2], handR: [1.6, -11.0], handPoseL: 'fist', handPoseR: 'fist', lookX: -.7, turn: -.25, mouth: 'smirk', brows: 'normal' });
      if (t > T_.fester && t < T_.nohat) set({ eyes: 'wide', brows: 'up', mouth: 'o', handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm' });
      if (t > T_.math && t < T_.called) set({ eyes: 'happy', mouth: 'grin', power: .35, blush: .6, handL: [-4.4, -8.1], handR: [4.4, -8.1] });    // proud of the maths
      if (t > T_.called) set({ handR: [0.8, -16.1], handPoseR: 'fist', lookX: -.8, brows: 'quizzical', mouth: 'flat' });                       // hand to chin: a recurring motif…
    } else if (t < T_.freeze) {                                              // "Ah! Allow me to EXPLAIN —"
      const pw = ease(seg(t, T_.explain - .3, T_.explain));
      set({ handR: [5.8, -21.4], handPoseR: 'point', handL: [-5.3, -12.4], handPoseL: 'palm', power: .3 + .7 * pw, eyes: pw > .5 ? 'glow' : 'open', brows: 'up',
        mouth: sing('safadi', t, 'grin'), lookX: -.4, bulb: on(t, T_.allow + .1, T_.freeze + 1, .15), jump: .5 * kick(t, T_.explain, 6) });
    } else if (t < T_.bonk) set({ handR: [5.8, -21.4], handPoseR: 'point', handL: [-5.3, -12.4], handPoseL: 'palm', lookY: -1, lookX: -.3, mouth: 'o', eyes: 'open', power: .4 });
    else if (t < T_.FIN) {
      set({ eyes: t < T_.haha ? 'wide' : 'happy', mouth: t < T_.haha ? 'O' : 'grin', handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', lookX: .4, jump: t > T_.laughed ? .8 * bob(t) : 0 });
      if (t > T_.laughed) set({ handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', mouth: sing('safadi', t, 'grin') });
    } else {                                                                 // the tag: alone at the stall
      set({ handL: [-1.8, -11.6], handR: [1.8, -11.6], handPoseL: 'fist', handPoseR: 'fist', brows: 'worried', mouth: sing('safadi', t, 'frown'), lookX: .2, dy: .3 });
      if (t > T_.take) set({ eyes: 'wide', brows: 'up', mouth: 'O', lookX: .8, dy: 0, jump: .6 * kick(t, T_.take + .1, 5) });
      if (t > T_.splendid) set({ eyes: t < T_.splainWord ? 'happy' : 'glow', mouth: sing('safadi', t, 'grin'), handR: [4.4, -12.2], handPoseR: 'pointer', pointerAng: -.5, handL: [-5.3, -12.4], handPoseL: 'palm', power: on(t, T_.splainWord - .3, T_.END + 5, .4), brows: 'up', lookX: -.2 });
    }
    return o;
  }
  // The kids. One function with a few personal touches.
  const KID_RIG = {
    housam: { mouthHands: { handL: [-1.4, -21.2], handR: [1.4, -21.2], handPoseL: 'fist', handPoseR: 'fist' }, up: { handL: [-4.6, -24], handR: [4.6, -24], handPoseL: 'palm', handPoseR: 'palm' }, fist: { handR: [4.2, -22], handPoseR: 'fist' }, rest: { handL: [-3.6, -10.6], handR: [3.6, -10.6] }, walk: housamDribble, wide: 'wide' },
    alma: { mouthHands: { handL: [-.5, -11.9], handR: [.5, -11.9], handPoseL: 'fist', handPoseR: 'fist' }, up: { handL: [-5, -11], handR: [5, -11], handPoseL: 'palm', handPoseR: 'palm' }, fist: { handR: [4.9, -13.4], handPoseR: 'point' }, rest: {}, walk: almaSkip, wide: 'wide' },
    jenna: { mouthHands: { handL: [-.5, -18.2], handR: [.5, -18.2], handPoseL: 'fist', handPoseR: 'fist' }, up: { handL: [-4.2, -19], handR: [4.2, -19], handPoseL: 'palm', handPoseR: 'palm' }, fist: { handR: [3.9, -17.5], handPoseR: 'point' }, rest: {}, walk: jennaSkip, wide: 'wide' },
    danny: { mouthHands: { handL: [-1.3, -18.4], handR: [1.3, -18.4], handPoseL: 'fist', handPoseR: 'fist' }, up: { handL: [-4.3, -20], handR: [4.3, -20], handPoseL: 'palm', handPoseR: 'palm' }, fist: { handR: [4.2, -19], handPoseR: 'fist' }, rest: {}, walk: dannyDribble, wide: 'wide' },
  };
  function kidPose(name, t) {
    const K = KID_RIG[name], i = KIDS.indexOf(name), p = pos(name, t);
    const o = { ...K.rest, mouth: sing(name, t, 'smile'), lookX: 0, brows: 'normal' };
    const set = q => Object.assign(o, q);
    if (p.moving) return Object.assign(o, K.walk(p.dist / 46, 1), { turn: p.dir > 0 ? -.4 : .4, lookX: p.dir > 0 ? -.7 : .7, mouth: 'grin', brows: 'up' });
    if (name === 'danny' && t > T_.perch && t < T_.laughed) return dannyPerch(t, o);
    if (t < LEAVE) {                                                         // at Safadi's stall, listening
      set({ lookX: -.7, turn: -.3, dy: .15 * bob(t + i * .1) });
      if (t > T_.gonna - .1 && t < T_.trophyLine + .1) set({ ...K.mouthHands, mouth: 'open', lookX: .5, turn: .3, eyes: 'happy' });
    } else if (t < T_.C1) {                                                  // the huddle, the ladder, "YOU SHALL SEE!"
      set({ lean: (i - 1.5) * -.05, lookX: i < 2 ? -.6 : .6, mouth: sing(name, t, 'smirk'), brows: 'up', dy: .3 });
      if (t > T_.shout - .1) set({ ...K.up, lean: 0, dy: 0, eyes: 'happy', mouth: sing(name, t, 'grin'), jump: 1.4 * kick(t, T_.shout + .15, 4), lookX: 0, turn: 0 });
    } else if (t < T_.bonk) {                                                // the audience: watching the stage (screen-right)
      set({ lookX: .75, turn: .3, mouth: sing(name, t, 'smile') });
      if (t > T_.sneezes - .5 && t < T_.ew) set({ eyes: 'happy', mouth: 'grin', dy: .3 * Math.abs(Math.sin(t * 9 + i)), ...K.mouthHands });           // boogers!
      if (t > T_.achoo && t < T_.achoo + 1.45) set({ eyes: 'wide', mouth: 'O', brows: 'up', ...K.up });
      if (t > BRIDGE && t < T_.jennaDrew - .2) set({ eyes: 'happy', mouth: 'smile', ...K.mouthHands });                                                // here he comes…
      if (t > T_.jennaDrew && t < T_.math + .6) set({ mouth: sing(name, t, 'grin'), lookX: -.2, turn: 0, ...(name === ['jenna', 'alma', 'danny', 'housam'][[T_.almaDance, T_.dannyJokes, T_.math].filter(b => t > b).length] ? K.fist : {}) });
      if (t > T_.allow && t < T_.freeze) set({ ...K.mouthHands, eyes: 'wide', brows: 'up', mouth: 'flat', lookX: .4 });
      if (t > T_.freeze) set({ lookY: -1, lookX: .5, eyes: 'wide', mouth: 'o', ...K.mouthHands });
    } else {
      set({ ...K.up, eyes: 'happy', mouth: sing(name, t, 'grin'), jump: 1.6 * bob(t + i * .25), lookX: .3 });
      if (t < T_.laughed) set({ jump: 1.6 * kick(t, T_.bonk + .2, 3), mouth: 'O', eyes: 'wide' });
    }
    return o;
  }
  // Danny on the ladder: crouched, the ball held out over the stage, waiting for the word.
  function dannyPerch(t, o) {
    Object.assign(o, { dy: 1.2, lean: .12, handL: [-2.8, -12.4], handPoseL: 'fist', handR: [6.0, -12.5], handPoseR: 'palm', lookX: .6, lookY: .7, mouth: 'smirk', brows: 'focused' });
    if (t < T_.C1) Object.assign(o, { lookX: 0, lookY: 0, mouth: sing('danny', t, 'grin'), eyes: t > T_.shout ? 'happy' : 'open', brows: 'up' });
    if (t > T_.allow && t < T_.release) Object.assign(o, { mouth: sing('danny', t, 'flat'), eyes: t > T_.explain ? 'squeeze' : 'open' });
    if (t > T_.release) Object.assign(o, { handR: [5.6, -16.6], handPoseR: 'open', eyes: 'wide', mouth: 'o', lookY: 1 });
    if (t > T_.bonk) Object.assign(o, { eyes: 'happy', mouth: 'grin', handR: [4.2, -19], handPoseR: 'fist', lookY: .3, jump: .4 * bob(t) });
    return o;
  }
  const holdsBall = t => t > T_.perch - .7 && t < T_.release;
  function samiPose(t) {
    const p = pos('sami', t), o = { mouth: sing('sami', t, 'grin'), handL: [-4.4, -8.1], handR: [4.4, -8.1], lookX: .3, brows: 'up', dy: -.25 * bob(t) };
    if (p.moving) return Object.assign(o, samiWalk(p.dist / 58, 1), { turn: p.dir > 0 ? -.35 : .35 });
    if (t > T_.boogers - .2 && t < T_.ew + .4) {
      Object.assign(o, { handL: [-2.6, -12.8], handR: [2.6, -12.8], handPoseL: 'fist', handPoseR: 'fist', lookX: -.5, turn: -.2 });
      if (t > T_.sneezes - .2 && t < T_.sneezes + .5) Object.assign(o, { eyes: 'squeeze', mouth: 'O', jump: .8 * kick(t, T_.sneezes, 5), lean: -.12 });
      if (t > T_.burps - .1 && t < T_.burps + .6) Object.assign(o, { eyes: 'happy', mouth: 'O', sq: .1 * kick(t, T_.burps, 5), blush: 1 });
      if (t > T_.ew) Object.assign(o, { mouth: 'flat', brows: 'worried', eyes: 'open', lookX: -.8 });
    }
    if (t > T_.bonk && t < T_.FIN) Object.assign(o, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', jump: .8 * bob(t + .2) });
    return o;
  }
  function dragonPose(t) {
    const p = pos('dragon', t), o = { mouth: sing('dragon', t, 'smile'), wings: .25, lookX: .3, headTilt: .05 * Math.sin(t * 2) };
    if (p.moving) return Object.assign(o, { wings: .8, flap: wob(t, 2.2) * .6, jump: 2 * Math.sin(seg(t, p.dist ? t - 1 : t, t) * Math.PI), flip: p.dir > 0 });
    if (t > T_.popup && t < T_.fire + .7) {
      Object.assign(o, { lookX: -.5, eyes: 'happy', mouth: sing('dragon', t, 'grin'), wings: .4 });
      if (t > T_.three) Object.assign(o, { eyes: 'open', mouth: sing('dragon', t, 'o') });
      if (t > T_.achoo - 1.1 && t < T_.achoo) Object.assign(o, { headTilt: -.35 * seg(t, T_.achoo - 1.1, T_.achoo - .1), eyes: 'closed', mouth: 'o' });
      if (t > T_.achoo && t < T_.achoo + .6) Object.assign(o, { headTilt: .25, eyes: 'closed', mouth: 'open', jump: 1.2 * kick(t, T_.achoo, 5), wings: .9 });
      if (t > T_.achoo + .6) Object.assign(o, { eyes: 'wide', mouth: 'pout', wings: .15, lookY: .6 });
    }
    if (t > T_.bonk && t < T_.FIN) Object.assign(o, { eyes: 'happy', mouth: 'grin', wings: .8, flap: wob(t, 2) * .5, jump: 1.2 * bob(t) });
    return o;
  }
  function roboPose(t) {
    const o = { red: 0, eyes: t < T_.beep ? 'closed' : 'open', mouth: sing('robo_safadi', t, 'flat', ['open', 'O', 'open', 'teeth', 'open']), brows: 'normal', handL: [-4.4, -8.6], handR: [4.4, -8.6], lookX: .4 * Math.sin(t * .9) };
    if (t > T_.beep && t < T_.beep + 2.6) Object.assign(o, { jump: .3 * kick(t, T_.beep, 7), antenna: .3 * boing(t, word('beep', 1), 2.5, 3) });
    if (t > T_.bonk && t < T_.FIN) Object.assign(o, { eyes: 'happy', mouth: 'grin', emote: 'music', emoteK: 1, jump: .5 * bob(t) });
    return o;
  }
  function festerPose(t) {
    const p = pos('jester_fester', t), crowned = t > T_.hired + .25;
    const o = { noHat: true, mouth: sing('jester_fester', t, 'smile'), handL: [-2.4, -11.2], handR: [2.4, -11.2], handPoseL: 'fist', handPoseR: 'fist', brows: 'worried', lookX: -.6, turn: -.25 };
    if (p.moving) return Object.assign(o, { ...jesterWalk(p.dist / 50), turn: .4, lookX: .7, brows: 'up', mouth: 'grin', eyes: 'happy', stars: .4 });
    if (t < T_.jennaDrew - .1) Object.assign(o, { dy: .3, tilt: -.06, blush: .5 });
    if (t > T_.called && t < T_.freeze) Object.assign(o, { handL: [-3.4, -12.2], handR: [3.4, -12.2], lookX: 0, lookY: .7, turn: 0, brows: 'normal', mouth: sing('jester_fester', t, 'smile') });
    if (t > T_.ch3 + .6 && t < T_.freeze) Object.assign(o, { lookX: .7, lookY: -.2, brows: 'up', mouth: 'flat' });                 // Safadi interrupts
    if (t > T_.freeze && t < T_.bonk) Object.assign(o, { lookY: -1, lookX: .2, eyes: 'wide', mouth: 'o', brows: 'up' });
    if (t > T_.bonk && t < T_.laughed) Object.assign(o, { eyes: t < T_.bonk + 1.2 ? 'swirl' : 'happy', stars: 1 - seg(t, T_.bonk + .8, T_.laughed), sq: .25 * kick(t, T_.bonk, 6), dy: 1.2 * kick(t, T_.bonk, 4), mouth: t < T_.bonk + 1.2 ? 'wobble' : 'grin', handL: [-4.4, -13.3], handR: [4.4, -13.3], handPoseL: 'open', handPoseR: 'open', lookX: -.5 });
    if (t > ARRIVE && t < T_.triumph) Object.assign(o, { dy: 2.6, lean: .12, handL: [-2.6, -10.6], handR: [2.6, -10.6], lookX: -.7, lookY: -.4, turn: -.3, brows: 'up', mouth: t > T_.hired ? 'grin' : 'smile', eyes: t > T_.hired + .3 ? 'happy' : 'open' });
    if (t > T_.triumph) Object.assign(o, { handL: [-5.3, -15.4], handR: [5.3, -15.4], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', mouth: sing('jester_fester', t, 'grin'), brows: 'up', lookX: 0, turn: 0, jump: .8 * kick(t, T_.triumph + 1.2, 4) });
    o._crown = crowned;
    return o;
  }
  const jesterWalk = d => { const ph = d * Math.PI; return { footL: [-1.4 + 1.5 * Math.sin(ph), -.2 - .9 * Math.max(0, Math.cos(ph))], footR: [1.4 - 1.5 * Math.sin(ph), -.2 - .9 * Math.max(0, -Math.cos(ph))], dy: -.3 * Math.abs(Math.cos(ph)) }; };
  function pearlPose(t) {
    const o = { sit: 1, eyes: 'bored', brows: 'flat', mouth: sing('princess_pearl', t, 'flat', ['open', 'o', 'flat']), wag: .2 * wob(t, .45), lookX: -.3 };
    const set = q => Object.assign(o, q);
    if (t > T_.dazzle && t < T_.beep + .6) set({ headTilt: .35, eyes: 'closed', mouth: sing('princess_pearl', t, 'smirk') });
    if ((t > T_.ew && t < T_.popup) || (t > T_.fire && t < T_.prompt)) set({ point: on(t, t > T_.fire ? T_.fire : T_.ew, t > T_.fire ? T_.prompt : T_.popup, .2), pointAng: -.7 });
    if (t > T_.why - .5 && t < T_.why + 1.5) set({ lookY: -1, lookX: .5, eyes: 'bored', mouth: sing('princess_pearl', t, 'frown') });
    if (t > T_.fester && t < T_.jennaDrew - .6) set({ eyes: 'wide', brows: 'angry', mouth: 'frown', lookX: .6 });
    if (t > T_.jennaDrew - .6 && t < T_.freeze) set({ eyes: 'bored', lookX: .6, brows: 'flat' });
    if (t > T_.freeze && t < T_.bonk) set({ eyes: 'open', lookY: -1, lookX: .6 });
    if (t > T_.bonk && t < T_.haha) {                                        // the twitch, the snort…
      set({ eyes: 'wide', brows: 'up', mouth: t > T_.bonk + .6 ? 'smirk' : 'flat', sq: .06 * kick(t, T_.bonk + .35, 9) + .1 * kick(t, T_.bonk + .7, 7), crownLift: .5 * kick(t, T_.bonk + .7, 6) });
    }
    if (t > T_.haha && t < T_.FIN) {                                         // …and the laugh. She falls off the throne.
      const k = seg(t, T_.haha, T_.fall), roll = t > T_.fall + .55 ? Math.sin((t - T_.fall) * 7) : 0;
      set({ eyes: 'happy', brows: 'up', mouth: ysSinging('princess_pearl', t) ? (Math.sin(t * 30) > 0 ? 'open' : 'yawn') : 'open', sit: t < T_.fall ? 1 : lerp(1, .55, seg(t, T_.fall, T_.fall + .5)),
        rot: .12 * Math.sin(t * 18) * (1 - k * .5) + (t > T_.fall ? -.3 * roll : 0), sq: .08 * Math.abs(Math.sin(t * 18)), flipNear: -1 + .6 * Math.sin(t * 9), wag: .8 * Math.sin(t * 12), crownTilt: .3 * Math.sin(t * 9), blush: 1 });
      if (t > T_.hired - 2.2) set({ sit: 1, rot: 0, sq: 0, eyes: 'sparkle', mouth: sing('princess_pearl', t, 'smile'), point: on(t, T_.hired - .3, T_.hired + .7, .2), pointAng: -.3, lookX: .7, flipNear: 0, wag: .3 * wob(t, 1) });
      if (t > T_.hired + .8) set({ point: 0, eyes: 'happy', mouth: 'smile', emote: 'heart', emoteK: 1 });
    }
    if (t > T_.another) set({ eyes: 'bored', brows: 'flat', point: on(t, word('another', 4) + .3, T_.END + 5, .2), pointAng: -.7, headTilt: .12 });
    return o;
  }
  function clawdPose(t) { return { holo: 1, bounce: 1, eyes: t > T_.beep ? 'look' : 'closed', lookY: 1, mouth: 'smile' }; }

  const CAST = {
    safadi: safadiPose, housam: t => kidPose('housam', t), alma: t => kidPose('alma', t), jenna: t => kidPose('jenna', t), danny: t => kidPose('danny', t),
    sami: samiPose, dragon: dragonPose, robo_safadi: roboPose, jester_fester: festerPose, princess_pearl: pearlPose, clawd: clawdPose,
  };

  // ---------- the library stage: characters and props interleaved with the set by depth ----------
  const lcam = (x, y, z, hy, f = 1000, drift = 1) => t => ({ x: x + 10 * drift * Math.sin(t * .23), y, z, f, hy: hy + 5 * drift * Math.sin(t * .31), dir: -1 });
  const push = (c, t0, t1, dz, dhy = 0) => t => { const q = c(t), u = ease(seg(t, t0, t1)); return { ...q, z: q.z - dz * u, hy: q.hy + dhy * u }; };
  function props(name, t, A, s, pose) {
    if (name === 'safadi' && t < T_.ready && t > T_.trophy - .2) {                // the trophy goes in the bag
      const u = ease(seg(t, T_.trophy, T_.bag));
      if (t < T_.bag + .2) ysTrophy(lerp(A.handR[0], A.handR[0] - 3 * s, u), lerp(A.handR[1] + 1.4 * s, A.belly[1] + 6 * s, u * u), 4.4 * s, t);
    }
    if (name === 'safadi' && t > T_.allow && t < T_.freeze + .5) {}
    if (name === 'jester_fester') {
      if (t < T_.bonk) ysFesterBook(A.belly[0], A.belly[1] - 2.2 * s, 5.2 * s, { ang: pose.lookY > .5 ? .0 : -.08 });
      if (pose._crown) ysCrown(A.hatBase[0], A.hatBase[1] + .2 * s, 4.6 * s, t, -.05);
    }
    if (name === 'sami' && t > T_.boogers - .2 && t < T_.ew + .8) ysBoogerBook((A.handL[0] + A.handR[0]) / 2, A.handL[1] - 1.5 * s, 6.4 * s, { ang: .04 * Math.sin(t * 3) });
    if (name === 'danny' && holdsBall(t)) jugglerBall(A.handR[0] + .4 * s, A.handR[1] - 2.2 * s, BALL_R * s * 2.6, JUGGLE_COLS[2], t * .5);
    if (name === 'dragon' && t > T_.popup && t < T_.fire + .7) {
      const bx = (A.pawL[0] + A.pawR[0]) / 2, by = Math.min(A.pawL[1], A.pawR[1]) - .5 * s;
      ysPopup(bx, by, 10 * s, seg(t, T_.popup + .6, T_.popup + 2.2), ease(seg(t, T_.achoo + .1, T_.achoo + .5)), t);
      ysFlame(A.mouth[0], A.mouth[1], .9, 9 * s, on(t, T_.achoo, T_.achoo + .7, .1), t);
    }
  }
  // Draw one cast member in the set (screen anchors returned, or null when off-set).
  function drawCast(name, P, t, o = {}) {
    const p = pos(name, t); if (p.x < -1500) return null;
    if (P.depth(p.z) < 40) return null;
    const [sx, sy, k] = P.p(p.x, p.y, p.z), s = RIG[name][1] * k, pose = { ...CAST[name](t), ...(o[name] || {}) };
    if (name === 'princess_pearl') {
      const onThrone = p.y > 50;
      const [tx, ty] = P.p(THRONE[0], 0, THRONE[1]);
      if (onThrone) ysThrone(tx, ty, k, t);
      const A = loc(pearl(sx, sy - (onThrone ? 0 : 0), s, pose));
      return { A, s, k, pose };
    }
    const A = fig(name, sx, sy, k, pose);
    props(name, t, A, s, pose);
    return { A, s, k, pose };
  }
  // The stage for a camera. o.only: a list of names to draw; o.dim: a spotlight darkening centred on o.dim(R) → [x, y, r].
  function stage(t, cam, o = {}) {
    const P = persp(cam), R = {};
    const names = (o.only || Object.keys(CAST)).filter(n => pos(n, t).x > -1500 && P.depth(pos(n, t).z) > 40);
    const items = names.map(n => ({ z: pos(n, t).z + (n === 'clawd' ? 30 : 0), draw: () => { const r = drawCast(n, P, t, o.pose || {}); if (r) R[n] = r; } }));
    items.push({ z: 90, draw: () => ysLadder(P) });
    if (inRange(t, T_.release, T_.bonk + .05)) items.push({ z: FSPOT[1] + 5, draw: () => fallingBall(P, t, R) });
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z));
    layer(() => { L.back(P, t, { ...LSET, splitZ: items.length ? items[0].z : undefined }); ysBanner(P, t); }, { blur: o.blur || 0 });
    items.forEach((it, i) => { it.draw(); L.front(P, t, { ...LSET, splitZ: it.z, toZ: i + 1 < items.length ? items[i + 1].z : undefined }); });
    if (o.dim) { const [x, y, r] = o.dim(R); X.save(); X.globalCompositeOperation = 'multiply'; shape(rectPts(-100, -100, W + 200, H + 200), { fill: radGrad(x, y, r * .55, r * 1.6, [[0, '#FFFFFF'], [1, '#3A2850']]), stroke: null }); X.restore(); }
    return { R, P };
  }
  // The juggling ball, dropping from Danny's hand to Fester's head in Housam's 0.64 s.
  function fallingBall(P, t, R) {
    const d = measure(() => drawCast('danny', P, T_.release - .01)), f = measure(() => drawCast('jester_fester', P, T_.bonk - .01));
    if (!d || !f) return;
    const a = [d.A.handR[0] + .4 * d.s, d.A.handR[1] - 2.2 * d.s], b = [f.A.head[0], f.A.top ? f.A.top[1] - 1 * f.s : f.A.head[1] - 6 * f.s];
    const u = seg(t, T_.release, T_.bonk), g = u * u;
    jugglerBall(lerp(a[0], b[0], u), lerp(a[1], b[1], g), BALL_R * d.s * 2.6, JUGGLE_COLS[2], t * 4);
    if (u < .9) for (let i = 1; i < 4; i++) line([[lerp(a[0], b[0], u) - 40, lerp(a[1], b[1], g) - i * 34 * d.s / 4], [lerp(a[0], b[0], u) + 40, lerp(a[1], b[1], g) - i * 34 * d.s / 4]], { stroke: 'rgba(255,255,255,.7)', lwPx: 4 });
  }

  // ---------- library cameras ----------
  const CAM = {
    fairWide: push(lcam(0, 200, 1330, 470, 720), 0, T_.dazzle - .3, 230, 10),
    throneCU: lcam(110, 190, 560, 560, 900, .6),
    throneMed: lcam(60, 160, 700, 470, 900),
    safStall: lcam(280, 150, 1000, 540, 1000),
    safStallClose: lcam(290, 150, 980, 470, 1250),
    roboStall: lcam(-300, 135, 1040, 530, 1000),
    huddle: lcam(-330, 140, 620, 560, 950),
    ladderUp: t => ({ x: -440, y: lerp(140, 230, ease(seg(t, T_.ladder, T_.perch + .3))), z: 560, f: 1000, hy: lerp(520, 560, ease(seg(t, T_.ladder, T_.perch + .3))), dir: -1 }),
    safCU: lcam(300, 160, 900, 430, 1300, .5),
    stageWide: lcam(-130, 185, 760, 470, 820),
    stageMed: lcam(-330, 140, 700, 500, 1500),
    audience: lcam(20, 120, 650, 520, 1150),
    festerSpot: push(lcam(-430, 140, 600, 500, 1500, .4), BRIDGE, T_.jennaDrew, 90, 10),
    reading: lcam(-430, 150, 620, 470, 1250, .5),
    explainCU: lcam(-260, 160, 560, 470, 1250, .3),
    ladderCU: lcam(-450, 250, 420, 540, 1400, .2),
    bonkCU: lcam(-430, 120, 470, 560, 1500, 0),
    pearlLaugh: lcam(190, 140, 640, 520, 1150, .4),
    party: lcam(-80, 190, 820, 470, 800),
    hired: lcam(80, 140, 680, 520, 1100, .4),
    triumph: lcam(40, 160, 560, 420, 1300, .3),
    tagStall: lcam(300, 145, 1060, 520, 1050, .3),
  };
  const libShot = (camFn, o = {}, after) => t => { const r = stage(t, camFn(t), o); after && after(t, r); };

  // ---------- library shots ----------
  const fairOpen = libShot(CAM.fairWide, {}, (t, { R }) => {
    ysSlamTitle(t);
  });
  function ysSlamTitle(t) {                                                  // the title over the opening push
    if (t > 5.4) return;
    overlay(() => {
      const out = ease(seg(t, 4.6, 5.4));
      X.save(); X.globalAlpha = 1 - out; X.translate(0, -out * 200);
      ysSlam('YOU', W / 2 - 430, 330, 160, YS.goldLt, t, .5, -.08);
      ysSlam('SHALL', W / 2, 360, 160, YS.pink, t, 1.0, .03);
      ysSlam('SEE!', W / 2 + 420, 330, 160, YS.sky, t, 1.5, .08);
      X.restore();
    });
  }
  const pearlDecree = libShot(CAM.throneCU);
  const roboBeep = libShot(CAM.roboStall, {}, (t, { R }) => {
    const r = R.robo_safadi; if (!r) return;
    sfx('BEEP', r.A.head[0] - 260, r.A.head[1] - 60, 90, '#BFF3FF', t - word('beep', 0) - .2, { rot: -.15 });
    sfx('BOOP', r.A.head[0] + 260, r.A.head[1] - 80, 90, '#BFF3FF', t - word('beep', 1) - .2, { rot: .12 });
  });
  const safStall = libShot(CAM.safStall, {}, (t, { R }) => stallBooks(t, R));
  const safBrag = libShot(CAM.safStallClose, {}, (t, { R }) => {
    stallBooks(t, R);
    const r = R.safadi; if (!r) return;
    if (t > T_.trophy - .4) ysBag(r.A.belly[0] - 5.5 * r.s, r.A.belly[1] + 9 * r.s, 6 * r.s, ease(seg(t, T_.trophy, T_.trophy + .3)) * (1 - ease(seg(t, T_.bag + .2, T_.bag + .5))));
    sfx('Oh, he\'s gonna brag!', W * .78, H * .22, 52, YS.goldLt, t - T_.gonna - .2, { life: 1.3, rot: .05 });
    sfx('*click*', r.A.belly[0] - 5 * r.s, r.A.belly[1] + 2 * r.s, 44, YS.paper, t - T_.bag - .3, { life: .8 });
  });
  // His books stacked on the stall table, with a MEET THE AUTHOR sign.
  function stallBooks(t, R) {
    const r = R.safadi; if (!r) return;
    const s = r.s, bx = r.A.belly[0], by = r.A.belly[1] + 3.6 * s;
    [0, 1, 2].forEach(i => ysSafadiBook(bx + (i - 1) * 4.4 * s, by - .4 * s * (i === 1), 3.6 * s, i, { ang: (i - 1) * .06 }));
  }
  const huddle = libShot(CAM.huddle, {}, (t, { R }) => {
    const r = R.danny; if (!r || t < T_.ladder) return;
    if (t > T_.perch) sfx('psst…', r.A.head[0] + 3 * r.s, r.A.top[1] - 2 * r.s, 44, '#CFE9FF', t - T_.perch, { life: 1, rot: .05 });
  });
  const ladderUp = libShot(CAM.ladderUp);
  const safSuspicious = libShot(CAM.safCU, { blur: 3 });
  const kidsShout = libShot(lcam(-380, 190, 620, 470, 1200, .5), {}, (t, { R }) => {
    if (t > T_.shout) flash(.4 * kick(t, T_.shout + .2, 7), '#FFF4D6');
  });
  // the contest
  const pearlCU = libShot(CAM.throneCU, { blur: 2.5 });
  const pearlMed = libShot(CAM.throneMed, { blur: 1.5 });
  const samiPitch = libShot(CAM.stageMed, { blur: 1.5 }, (t, { R }) => {
    const r = R.sami; if (!r) return;
    sfx('AH-CHOO!', r.A.head[0] - 6 * r.s, r.A.top[1] - 1 * r.s, 80, YS.booger, t - T_.sneezes - .05, { life: .9, rot: -.1 });
    sfx('BUUURP!', r.A.head[0] + 6 * r.s, r.A.top[1], 80, '#FFE066', t - T_.burps - .05, { life: 1.0, rot: .1 });
    for (let i = 0; i < 7; i++) {                                           // sneeze droplets (mostly on the book)
      const a = t - T_.sneezes - .05; if (a < 0 || a > .6) continue;
      circle(r.A.mouth[0] - (40 + i * 30) * a / .6 * (1 + hash(i)), r.A.mouth[1] + (hash(i * 3) - .5) * 80 * a, 7, { fill: '#C8F07A', stroke: YS.ink, lwPx: 1.5 });
    }
  });
  const dragonPitch = libShot(CAM.stageMed, { blur: 1.5 }, (t, { R }) => {
    const r = R.dragon; if (!r) return;
    sfx('ACHOO!', r.A.head[0] + 5 * r.s, r.A.top[1] - 2 * r.s, 100, YS.fire, t - T_.achoo, { life: 1.0, rot: .1 });
    flash(.35 * kick(t, T_.achoo, 7), '#FFD27A');
  });
  const audience = libShot(CAM.audience, { blur: 1 });
  const pearlBuried = libShot(CAM.throneCU, { blur: 2.5 }, (t, { R }) => {
    const r = R.princess_pearl; if (!r) return;                              // half-buried in Robo's pages
    for (let i = 0; i < 26; i++) ysPage(r.A.belly[0] + (hash(i) - .5) * 520, r.A.belly[1] + 40 + (hash(i * 2) - .3) * 160 - i * 2, 70 + hash(i * 3) * 30, (hash(i * 5) - .5) * 1.6, i % 4 ? 'EAT YOUR\nBROCCOLI' : '');
    ysPage(r.A.crown[0], r.A.crown[1] - 8, 64, .3, 'CH. 9,999');
  });
  // the bridge, the build, the BONK
  const festerSpot = libShot(CAM.festerSpot, { dim: R => R.jester_fester ? [R.jester_fester.A.head[0], R.jester_fester.A.belly[1], 380] : [W / 2, H / 2, 400] }, (t, { R }) => {
    const r = R.jester_fester; if (r) ysSpotScreen(r.A.head[0], r.A.footL ? r.A.footL[1] : r.A.belly[1] + 9 * r.s, 520);
  });
  function ysSpotScreen(x, floorY, w) { ysSpot(x, -40, floorY, w, '#FFF1C8', .18); }
  const reading = libShot(CAM.reading, {}, (t, { R }) => {
    const r = R.jester_fester; if (!r) return;
    [[T_.ch1, 'CHAPTER 1'], [T_.ch2, 'CHAPTER 2'], [T_.ch3, 'CHAPTER 3']].forEach(([t0, s], i) => {
      const a = t - t0; if (a < 0 || a > 1.6) return;
      overlay(() => { const k = backOut(seg(a, 0, .3)) * (1 - ease(seg(a, 1.3, 1.6)));
        X.save(); X.translate(W * .24, H * .28); X.rotate(-.06 + i * .04); X.scale(k, k);
        shape(rectPts(-200, -90, 400, 180), { fill: YS.paper, stroke: YS.ink, lwPx: 6 });
        X.font = `56px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#7A3FA0'; X.fillText(s, 0, -30);
        X.font = `30px ${FONT_TALK}`; X.fillStyle = YS.ink; X.fillText('a ball fell on my head', 0, 34); X.restore(); });
    });
  });
  const explainCU = libShot(CAM.explainCU, { blur: 3 }, (t, { R }) => {
    const r = R.safadi; if (!r) return;
    if (t > T_.explain) { sfx('EXPLAIN!', W / 2, H * .16, 120, YS.goldLt, t - T_.explain, { life: .9 }); flash(.35 * kick(t, T_.explain, 8), '#FFF4C0'); }
  });
  const ladderCU = libShot(CAM.ladderCU, { blur: 2 }, (t, { R }) => {
    const r = R.danny; if (r && t > T_.now) sfx('…now.', r.A.head[0] - 4 * r.s, r.A.top[1] - 2 * r.s, 50, '#CFE9FF', t - T_.now, { life: .7 });
  });
  const fallWide = t => {
    const c = lcam(-450, 140, 490, 540, 1100, .2)(t), r = stage(t, c);
    if (t > T_.freeze) overlay(() => { X.save(); X.globalCompositeOperation = 'saturation'; X.globalAlpha = .7 * seg(t, T_.freeze, T_.freeze + .1); X.fillStyle = '#808080'; X.fillRect(0, 0, W, H); X.restore(); });
  };
  function bonkCU(t) {
    const zoom = 1 + .08 * kick(t, T_.bonk, 4);
    camBegin(...shakeXYc(t, 22 * kick(t, T_.bonk, 4)), zoom);
    const { R } = stage(t, CAM.bonkCU(t), { blur: 3.5 }), f = R.jester_fester;
    if (f) { const u = t - T_.bonk, hx = f.A.head[0] + 260 * u, hy = f.A.top[1] - 30 - 900 * u + 1100 * u * u;   // the ball bounces off
      if (hy < H + 100) jugglerBall(hx, hy, BALL_R * f.s * 2.6, JUGGLE_COLS[2], u * 9); }
    camEnd();
    ysSlamOverlay('BONK!', W * .7, H * .3, 220, YS.fire, t, T_.bonk, .1, { life: 1.1 });
    flash(.7 * kick(t, T_.bonk, 9));
  }
  const shakeXYc = (t, a) => { const [dx, dy] = shakeXY(t, a); return [W / 2 - dx, H / 2 - dy]; };
  const ysSlamOverlay = (...a) => overlay(() => ysSlam(...a));
  const pearlLaugh = t => {
    camBegin(...shakeXYc(t, 6 * Math.abs(Math.sin(t * 9)) * (t > T_.haha ? 1 : 0)), 1 + .03 * Math.sin(t * 18) * (t > T_.haha ? 1 : 0));
    stage(t, CAM.pearlLaugh(t), { blur: 2.5 });
    camEnd();
    if (t > T_.haha) ['HA!', 'HA-HA!', 'HAHAHA!', 'HA!'].forEach((s, i) => sfx(s, W * (.2 + .2 * i), H * (.18 + .1 * (i % 2)), 70 + 14 * i, YS.pinkLt, t - T_.haha - .5 - i * .55, { life: 1.1, rot: (i % 2 ? .1 : -.1) }));
    if (t > T_.bonk + .3 && t < T_.haha) sfx('*snort*', W * .62, H * .3, 60, YS.paper, t - T_.bonk - .7, { life: .7 });
  };
  const party = libShot(CAM.party, {}, (t, { R }) => { ysConfetti(t, T_.laughed - .3, 'mixed', 90); flash(.4 * kick(t, T_.laughed, 8)); });
  const hired = libShot(CAM.hired, { blur: 2 }, (t, { R }) => {
    const f = R.jester_fester, p = R.princess_pearl; if (!f || !p) return;
    if (t > T_.hired - .3 && t < T_.hired + .3) {                           // the crown flips from her flipper onto his head
      const u = seg(t, T_.hired - .3, T_.hired + .3), a = p.A.flipper, b = [f.A.hatBase[0], f.A.hatBase[1]];
      ysCrown(lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 220 * Math.sin(u * Math.PI), 4.6 * f.s, t, u * TAU);
    }
    if (t > T_.hired + .25) { sfx('HIRED!', W / 2, H * .17, 140, YS.goldLt, t - T_.hired - .25, { life: 1.6 }); flash(.4 * kick(t, T_.hired + .25, 7), '#FFF4C0'); }
  });
  const triumph = libShot(CAM.triumph, { blur: 3, only: ['jester_fester', 'princess_pearl'] }, (t, { R }) => { ysConfetti(t, T_.triumph - .5, 'paper', 50); });
  const tagStall = libShot(CAM.tagStall, { only: ['safadi'] }, (t, { R }) => {
    stallBooks(t, R);
    if (t > T_.crickets && t < T_.take) sfx('chirp… chirp…', W * .72, H * .2, 44, '#CFE9FF', t - T_.crickets, { life: T_.take - T_.crickets });
    dragonSwoop(t, R);
  });
  // Dragon swoops in from screen-left and hugs all three books.
  function dragonSwoop(t, R) {
    const r = R.safadi; if (!r || t < T_.take - .8) return;
    const u = ease(seg(t, T_.take - .8, T_.take + .2)), x = lerp(-300, r.A.head[0] + 13 * r.s, u), y = lerp(H * .2, r.A.belly[1] + 9 * r.s, u);
    const A = loc(dragon(x, y, DRAGON_UNIT * r.k * .85, { ...(u < 1 ? dragonFlight(t, { lift: 2 }) : { wings: .5, flap: .2 * wob(t, 1) }), eyes: 'happy', mouth: ysSinging('dragon', t) ? lipFlap(t, true, 'grin') : 'grin', lookX: -.5, flip: true }));
    if (u >= 1) [0, 1, 2].forEach(i => ysSafadiBook(A.belly[0] + (i - 1) * 2.6 * r.s, A.belly[1] - 1.5 * r.s - i * .6 * r.s, 3.4 * r.s, i, { ang: (i - 1) * .2 }));
  }
  const tagExplain = libShot(CAM.safCU, { only: ['safadi'], blur: 3 });
  const tagPearl = libShot(CAM.throneCU, { blur: 2.5, only: ['princess_pearl'] }, (t, { R }) => {
    if (t > word('another', 3)) ysSlamOverlay('ANOTHER PROFESSOR.', W / 2, H * .2, 110, YS.pink, t, word('another', 3), -.04);
  });

  // ---------- motion-graphics shots ----------
  const panel = (t, c1, c2, cx = W / 2, cy = H * .55) => { ysSunburst(cx, cy, t, c1, c2, 18, .15); ysDots('#FFFFFF', .07, 46, 6, t); };
  const floorLine = (y, col = 'rgba(30,18,34,.35)') => shape(rectPts(-40, y, W + 80, H - y + 40), { fill: col, stroke: null });
  // A kid lineup in 2D (for choruses), pointing at the camera on the beat.
  function lineup(t, names, y, k, o = {}) {
    const n = names.length, gap = o.gap ?? 330;
    names.forEach((nm, i) => {
      const x = W / 2 + (i - (n - 1) / 2) * gap + (o.dx || 0), K = KID_RIG[nm];
      const pose = KID_RIG[nm] ? { ...(o.point && beatPos(t) % 2 < 1 ? K.fist : K.up), eyes: 'happy', mouth: sing(nm, t, 'grin'), jump: 1.4 * bob(t + i * .12), lookX: 0 } : {};
      fig(nm, x, y, k, { ...pose, ...(o.pose ? o.pose(nm, i) : {}) });
    });
  }
  // Safadi's three books slam in on Mathematics! Physics! Astronomy! and spin round to show his face.
  function safadiBooksShot(t) {
    camBegin(...shakeXYc(t, 4 * pulse(t)), 1 + .02 * pulse(t, 8));
    panel(t, '#3A2A12', '#5A4220', W / 2, H * .45);
    ysDots(YS.gold, .12, 40, 7, t);
    fig('safadi', W * .5, H * 1.3, 4.2, { ...safadiPose(t), power: 1, eyes: 'glow', handL: [-5.6, -14.2], handR: [5.6, -14.2], handPoseL: 'palm', handPoseR: 'palm' });
    [[T_.maths, W * .15, .05], [T_.physics, W * .5, 0], [T_.astro, W * .85, -.05]].forEach(([t0, x, rot], i) => {
      if (t < t0) return;
      const k = t - t0 < .16 ? lerp(2.4, 1, easeIn((t - t0) / .16)) : 1 + .06 * boing(t, t0 + .16, 3, 6);
      const spin = t > T_.face ? Math.cos(Math.PI * 2 * ease(seg(t, T_.face + i * .2, T_.face + .7 + i * .2))) : 1;
      X.save(); X.translate(x, H * (i === 1 ? .2 : .3) + 12 * Math.sin(t * 2 + i)); X.rotate(rot); X.scale(k * Math.max(.04, Math.abs(spin)), k);
      ysSafadiBook(0, 0, 230, i, { k: 1 });
      X.restore();
    });
    sfx('Ooh!', W * .32, H * .58, 70, YS.pinkLt, t - word('maths', 1) - .1, { life: .8, rot: -.1 });
    sfx('Ahh!', W * .68, H * .58, 70, YS.sky, t - word('maths', 3) - .1, { life: .8, rot: .1 });
    camEnd();
  }
  // "The judge is a princess, the prize is a crown, my footnotes have footnotes"
  function crownShot(t) {
    panel(t, '#4A1A3A', '#6A2852', W * .3, H * .5);
    const g = 1 + .05 * pulse(t, 8);
    X.save(); X.translate(W * .3, H * .5); X.scale(g, g);
    ysThrone(0, 330, 1.7, t);
    pearl(0, 330 - 95 * 1.7, PP_UNIT * PEARL_K * 1.7, { ...pearlPose(t), eyes: 'bored', lookX: .4 });
    X.restore();
    ysTrophy(W * .3, H * .99, 220, t);
    const A = fig('safadi', W * .78, H * 1.2, 3.7, { ...safadiPose(t), lookX: -.6, turn: -.3 });
    if (t > T_.foot) {                                                       // footnotes on footnotes on footnotes
      const k = seg(t, T_.foot + .2, T_.foot + 2.4);
      safadiBoard(W * .62, H * .32, 520, k, t, { kind: 'steps', title: 'FOOTNOTES¹' });
      for (let i = 0; i < 8; i++) { const a = seg(t, T_.foot + .4 + i * .25, T_.foot + .6 + i * .25); if (a <= 0) continue;
        X.save(); X.globalAlpha = a; X.font = `${30 - i * 2}px ${FONT_TALK}`; X.fillStyle = YS.paper; X.fillText(`${'¹²³⁴⁵⁶⁷⁸'[i]} see footnote ${i + 2}`, W * .52 + i * 18, H * .62 + i * 34); X.restore(); }
    }
  }
  // A chorus: six panels, a page-turn between each. ci = 0 for the first chorus, 1 for the second.
  function chorus(ci) {
    const P = ci ? 'C2' : 'C1', C = at(`${P}.0`), CUT = [1, 2, 3, 4, 5].map(i => at(`${P}.${i}`)), END = ci ? BRIDGE : T_.contestant;
    return function chorusShot(t) {
      const beatZ = .02 * pulse(t, 8);
      camBegin(...shakeXYc(t, 3 * pulse(t)), 1 + beatZ);
      if (t < CUT[0]) {                                                      // "You shall see!": the kids point at you
        panel(t, ci ? '#183A5A' : '#3A1B63', ci ? '#22507A' : '#57288A');
        floorLine(H * .9);
        lineup(t, KIDS, H * 1.02, 3.0, { point: true, gap: 440, pose: (nm) => nm === 'danny' && ci ? { eyes: 'wink' } : {} });
        ysSlam('YOU SHALL SEE!', W / 2, H * .16, 120, YS.goldLt, t, C + .1, -.03, { life: 2.3 });
      } else if (t < CUT[1]) {                                               // "Turn the page": Alma's rainbow floor, a giant book flipping
        panel(t, '#5A1F4A', '#7A2E62', W / 2, H * .4);
        const fl = (t * 2) % 1;
        ysOpenBook(W / 2, H * .34, 760, -.03, (sd, pw, ph) => { for (let i = 0; i < 5; i++) line([[-pw * .35, -ph * .3 + i * ph * .14], [pw * .35, -ph * .3 + i * ph * .14]], { stroke: 'rgba(110,120,130,.5)', lwPx: 4 }); });
        X.save(); X.translate(W / 2, H * .34); X.scale(Math.cos(fl * Math.PI), 1); ysPage(190, 0, 360, 0, ''); X.restore();
        fig('alma', W / 2, H * 1.04, 4.0, { ...almaDance(t - YS_BEAT0, 'disco', { bpm: YS_BPM }), power: 1, eyes: 'star', mouth: sing('alma', t, 'grin') });
        fig('jenna', W * .17, H * 1.02, 3.0, { ...jennaDance(t - YS_BEAT0, 'twirl', { bpm: YS_BPM }), eyes: 'happy', mouth: sing('jenna', t, 'grin') });
        fig('housam', W * .83, H * 1.02, 2.8, { ...KID_RIG.housam.up, eyes: 'happy', mouth: sing('housam', t, 'grin'), jump: 1.4 * bob(t) });
      } else if (t < CUT[2]) {                                               // "Hey! Hey!": Sami and Dragon
        panel(t, '#123E36', '#1C5A4E');
        floorLine(H * .92);
        const hey = kick(t, word(`${P}.2`, 3), 5) + kick(t, word(`${P}.2`, 4), 5);
        fig('sami', W * .32, H * 1.12, 3.4, { ...samiPose(t), handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: sing('sami', t, 'grin'), jump: 2 * hey, power: .6 });
        fig('dragon', W * .7, H * 1.08, 3.2, { ...dragonFlight(t, { lift: 2 + 6 * hey }), eyes: 'happy', mouth: sing('dragon', t, 'grin') });
        sfx('HEY!', W * .5, H * .2, 120, YS.goldLt, t - word(`${P}.2`, 3), { life: .5, rot: -.1 });
        sfx('HEY!', W * .5, H * .2, 140, YS.pink, t - word(`${P}.2`, 4), { life: .6, rot: .1 });
      } else if (t < CUT[3]) {                                               // "Nobody knows the ending": Safadi baffled (1) / Pearl unmoved (2)
        panel(t, '#2A2A3A', '#3A3A52', W / 2, H * .5);
        if (!ci) {
          fig('safadi', W / 2, H * 1.25, 4.2, { handL: [-4.6, -13.6], handR: [4.6, -13.6], handPoseL: 'palm', handPoseR: 'palm', brows: 'quizzical', mouth: 'flat', emote: '?', emoteK: 1, lookX: Math.sin(t * 3) * .8, tilt: .08 * Math.sin(t * 3) });
          ['?', '?', '?'].forEach((q, i) => sfx(q, W * (.25 + .25 * i), H * .25, 140, YS.goldLt, t - CUT[2] - .2 - i * .5, { life: 1.4, rot: (i - 1) * .2 }));
        } else {
          X.save(); X.translate(W / 2, H * 1.02); ysThrone(0, 0, 2.2, t); X.restore();
          pearl(W / 2, H * 1.02 - 95 * 2.2, PP_UNIT * PEARL_K * 2.2, { sit: 1, eyes: 'bored', brows: 'flat', mouth: 'flat', blink: .5 + .5 * Math.sin(t * 3) > .95 ? 1 : 0, lookX: 0 });
          sfx('…', W * .7, H * .3, 140, YS.paper, t - CUT[2] - 1, { life: 1.6 });
        }
      } else if (t < CUT[4]) {                                               // "Read it! Write it! Flip it! (BONK!)"
        const ws = [0, 2, 4, 6].map(i => word(`${P}.4`, i));
        const i = ws.filter(w => t >= w).length;
        panel(t, ['#3A1B63', '#5A1F4A', '#123E36', '#7A2A12', '#7A2A12'][i], ['#57288A', '#7A2E62', '#1C5A4E', '#A83A18', '#A83A18'][i]);
        if (i <= 1) { fig('housam', W / 2, H * 1.15, 4.0, { handL: [-3.2, -15], handR: [3.2, -15], handPoseL: 'fist', handPoseR: 'fist', lookY: .6, eyes: 'open', mouth: sing('housam', t, 'smile') }); ysBook(W / 2, H * .5, 240, { col: '#3E6FB0', title: ['CITY', 'SPIES'] }); ysSlam('READ IT!', W / 2, H * .14, 120, YS.goldLt, t, ws[0]); }
        else if (i === 2) { fig('jenna', W / 2, H * 1.15, 4.2, { handR: [2.4, -15], handPoseR: 'fist', lookY: .7, mouth: sing('jenna', t, 'smile'), book: true, pencil: true }); ysSlam('WRITE IT!', W / 2, H * .14, 120, YS.pinkLt, t, ws[1]); }
        else if (i === 3) { fig('danny', W / 2, H * 1.05 - 160 * Math.sin(seg(t, ws[2], ws[3]) * Math.PI), 4.0, { rot: -TAU * ease(seg(t, ws[2], ws[3] - .1)), ...KID_RIG.danny.up, eyes: 'happy', mouth: 'grin' }); ysSlam('FLIP IT!', W / 2, H * .14, 120, YS.sky, t, ws[2]); }
        else {                                                               // a giant book slams shut on the lens
          const sh = ease(seg(t, ws[3] - .15, ws[3]));
          ysOpenBook(W / 2, H / 2, 1700 * (1 - .4 * sh), 0, null, { cover: '#C0443F' });
          if (sh >= 1) { shape(rectPts(0, 0, W, H), { fill: '#C0443F', stroke: null }); ysSlam('BONK!', W / 2, H / 2, 300, YS.goldLt, t, ws[3], -.06); }
        }
      } else {                                                               // "You shall see!": everybody
        panel(t, ci ? '#183A5A' : '#3A1B63', ci ? '#22507A' : '#57288A');
        floorLine(H * .9);
        lineup(t, KIDS, H * 1.02, 2.7, { gap: 360 });
        fig('sami', W * .1, H * 1.06, 2.6, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: sing('sami', t, 'grin'), jump: bob(t) });
        fig('dragon', W * .9, H * 1.04, 2.6, { ...dragonFlight(t, { lift: 3 }), eyes: 'happy', mouth: sing('dragon', t, 'grin') });
        ysSlam('YOU SHALL SEE!', W / 2, H * .16, 130, YS.goldLt, t, word(`${P}.5`, 0), .03);
        if (ci) {                                                            // a hint, in plain sight
          X.save(); X.globalAlpha = on(t, CUT[4] + .6, END + .05, .2); X.translate(W - 160, H * .44); X.rotate(.1);
          shape(rectPts(-110, -130, 220, 260), { fill: YS.paper, stroke: YS.ink, lwPx: 6 });
          X.beginPath(); X.rect(-100, -120, 200, 240); X.clip();
          fig('danny', 0, 110, 1.2, { ...KID_RIG.danny.fist, handR: [5.2, -15.8], handPoseR: 'palm', eyes: 'wink', mouth: 'smirk' });
          jugglerBall(40, -55, 14, JUGGLE_COLS[2], t);
          X.restore();
        }
      }
      camEnd();
      // page turns between panels
      CUT.forEach((tc, i) => { if (Math.abs(t - tc) < .3) ysPageWipe(seg(t, tc - .3, tc + .3), i % 2 ? -1 : 1); });
    };
  }
  // Robo writes a best seller: Clawd pops out, and the pages blast out faster and faster.
  function roboPitch(t) {
    const rate = t < T_.pages ? 0 : lerp(6, 60, seg(t, T_.pages, T_.why - .6));
    camBegin(...shakeXYc(t, 3 + 10 * seg(t, T_.pages, 84)), 1 + .02 * pulse(t));
    ysSunburst(W / 2, H * .4, t, '#2A0610', '#5A0E1E', 22, .5);
    ysDots('#FF4A4A', .1, 34, 6, t);
    const red = ease(seg(t, T_.prompt, T_.prompt + .25));
    const A = fig('robo_safadi', W / 2, H * 1.14, 4.4, { red, eyes: 'open', brows: 'angry', mouth: sing('robo_safadi', t, 'teeth', ['open', 'O', 'open', 'teeth', 'open']), handL: [-5.6, -14.5], handR: [5.6, -14.5], handPoseL: 'fist', handPoseR: 'fist', steam: t > T_.why - 3 ? 1 : 0, hover: 1 });
    // the pages
    if (rate > 0) {
      const n = Math.floor((t - T_.pages) * 34);
      for (let i = Math.max(0, n - 70); i < n; i++) {
        const t0 = T_.pages + i / 34, a = t - t0; if (a < 0) continue;
        const ang = -Math.PI / 2 + (hash(i) - .5) * 2.6, v = 900 + hash(i * 3) * 900;
        const x = A.mouth[0] + Math.cos(ang) * v * a, y = A.mouth[1] + Math.sin(ang) * v * a + 700 * a * a;
        if (y > H + 200) continue;
        ysPage(x, y, 90 + hash(i * 7) * 30, a * (3 + hash(i) * 6), 'EAT YOUR\nBROCCOLI');
      }
    }
    // the pile grows
    const pile = seg(t, T_.why - 4.5, T_.why);
    for (let i = 0; i < 60 * pile; i++) ysPage((hash(i * 11) * 1.1 - .05) * W, H + 60 - pile * 420 * hash(i * 13) - i * 1.5, 120, (hash(i * 17) - .5) * 1.8, i % 3 ? 'EAT YOUR\nBROCCOLI' : '');
    // Clawd's hologram pops out of his chest
    const cp = backOut(seg(t, T_.clawd - .2, T_.clawd + .2));
    if (cp > 0) fig('clawd', W * .8, H * .42 - 20 * Math.sin(t * 3), 4.0 * cp, { holo: 1, bounce: 1, eyes: t > T_.pages ? 'swirl' : 'spark', mouth: sing('clawd', t, 'grin'), aL: .8 + .3 * Math.sin(t * 9), aR: .8 + .3 * Math.cos(t * 9) });
    camEnd();
    if (t > T_.why - 1.6) { const k = seg(t, T_.why - 1.4, T_.why - .1);                          // the last page fills the lens: CHAPTER 9,999
      overlay(() => { X.save(); X.translate(W / 2, H / 2); X.rotate(.08 - .08 * k); X.scale(.3 + 2.4 * easeIn(k), .3 + 2.4 * easeIn(k)); ysPage(0, 0, 420, 0, 'CHAPTER 9,999\nEAT YOUR\nBROCCOLI'); X.restore(); }); }
  }
  // "Bored, bored, I'm so royally bored": Pearl in a purple spotlight, sinking lower with every line.
  function pearlBored(t) {
    const lt = t - T_.bored, slump = ease(seg(t, T_.bored, T_.majesty - .2));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, H * .55, 100, 1200, [[0, '#4A2A6A'], [1, '#120A1E']]), stroke: null });
    ysDots('#B48AE0', .07, 50, 5, t);
    ysSpot(W / 2, -40, H * .95, 900, '#C9A6F0', .2);
    const k = 3.0 + .4 * seg(t, T_.bored, T_.majesty - .2);
    X.save(); X.translate(W / 2, H * 1.0); ysThrone(0, 0, k, t); X.restore();
    const hit = kick(t, word('somebody', 1), 6);
    pearl(W / 2, H * 1.0 - 95 * k + slump * 60, PP_UNIT * PEARL_K * k, { sit: lerp(1, .55, slump), rot: -.2 * slump, eyes: t > word('somebody', 1) && t < T_.C2 ? 'angry' : 'bored', brows: 'flat',
      mouth: sing('princess_pearl', t, lt < 2.2 && lt > 1.6 ? 'yawn' : 'flat', ['open', 'o', 'flat']), headTilt: .15 * slump + .2 * hit, point: hit > .05 ? hit : 0, pointAng: .6, wag: .15 * wob(t, .4),
      blink: lt > 4.5 && lt < 4.9 ? 1 : undefined });
    if (t > T_.majesty) {                                                    // the four kids step into her light
      const u = backOut(seg(t, T_.majesty, T_.majesty + .5));
      lineup(t, KIDS, H * (1.45 - .4 * u), 2.8, { gap: 470, pose: () => ({ eyes: 'happy', mouth: 'smirk', jump: 0, lookX: 0 }) });
    }
  }
  // "Jenna drew the pictures, Alma made it dance, Danny wrote the jokes": inside Fester's book.
  function bookPages(t) {
    const lt = t - T_.jennaDrew;
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: '#3A2A1E', stroke: null });
    ysDots('#F2C14E', .06, 44, 5, t);
    ysOpenBook(W / 2, H * .45, 1500, .01 * Math.sin(t), (sd, pw, ph) => {
      if (sd < 0) {                                                          // Jenna's drawing of Fester, sketching itself
        const k = seg(t, T_.jennaDrew, T_.jennaDrew + 1.6);
        X.save(); X.globalAlpha = .25 + .75 * k;
        X.save(); X.beginPath(); X.rect(-pw * .45, -ph * .45, pw * .9, ph * .9 * k); X.clip();
        jester(0, ph * .3, 22, { eyes: 'happy', mouth: 'grin', handL: [-5.3, -15.4], handR: [5.3, -15.4], boil: 2 });
        X.restore(); X.restore();
        X.font = `40px ${FONT_TALK}`; X.textAlign = 'center'; X.fillStyle = '#7A3FA0'; X.fillText('drawn by Jenna ♥', 0, -ph * .38);
      } else {                                                               // Alma dancing in the margin, Danny's joke
        const ka = seg(t, T_.almaDance, T_.almaDance + .3), kd = seg(t, T_.dannyJokes, T_.dannyJokes + .3);
        if (ka > 0) { X.save(); X.globalAlpha = ka; alma(-pw * .1, ph * .36, 21, { ...almaDance(t - YS_BEAT0, 'star jump', { bpm: YS_BPM }), eyes: 'star', power: .6, boil: 2 }); X.restore(); }
        if (kd > 0) { X.save(); X.globalAlpha = kd; X.translate(pw * .05, -ph * .22); X.rotate(.04);
          shape(ellPts(0, 0, pw * .3, ph * .2, 32), { fill: YS.paper, stroke: YS.ink, lwPx: 4 }); shape([[-40, ph * .17], [-80, ph * .3], [10, ph * .19]], { fill: YS.paper, stroke: YS.ink, lwPx: 4 });
          X.font = `30px ${FONT_TALK}`; X.textAlign = 'center'; X.fillStyle = YS.ink; X.fillText('Why did the chicken', 0, -18); X.fillText('cross the road?', 0, 18);
          X.font = `40px ${FONT_SFX}`; X.fillStyle = '#C0443F'; X.fillText('BONK!', pw * .1, ph * .4); X.restore(); }
      }
    });
  }
  // Housam's rap at a borrowed chalkboard.
  function mathRap(t) {
    camBegin(...shakeXYc(t, 2 * pulse(t)), 1 + .015 * pulse(t, 8));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: '#16302A', stroke: null });
    ysDots('#7FE3FF', .08, 40, 5, t);
    ysMathBoard(W * .63, H * .4, 1050, seg(t, T_.math + .5, T_.waiting), t);
    const spin = t > T_.math && t < T_.math + .4;
    fig('housam', W * .16, H * 1.12, 4.0, { handL: [-3.6, -10.6], handR: t > T_.point && t < T_.ladderLine ? [5.6, -22] : [5.2, -18], handPoseR: 'point', eyes: t > T_.waiting ? 'wink' : 'open', brows: 'focused', mouth: sing('housam', t, 'smirk'), lookX: .7, turn: .3, jump: .6 * bob(t) });
    if (t > T_.ladderLine) {                                                 // an inset: Danny, up the ladder, ball in hand
      const u = backOut(seg(t, T_.ladderLine, T_.ladderLine + .4));
      X.save(); X.translate(W * .85, H * .82); X.rotate(.08); X.scale(u, u);
      shape(ellPts(0, 0, 170, 170, 40), { fill: '#C9925C', stroke: YS.ink, lwPx: 8 });
      X.save(); X.beginPath(); X.arc(0, 0, 162, 0, TAU); X.clip();
      shape(rectPts(-200, -200, 400, 400), { fill: '#E8D8B8', stroke: null });
      fig('danny', 10, 210, 1.5, { ...dannyPerch(t, {}), eyes: 'open', lookX: .5, lookY: .5 });
      jugglerBall(70, 30, 16, JUGGLE_COLS[2], t);
      X.restore(); X.restore();
    }
    camEnd();
  }
  // The final chorus: everybody, on Alma's rainbow floor.
  function finale(t) {
    const wide = ease(seg(t, at('F.3'), T_.finBonk));
    camBegin(...shakeXYc(t, 3 * pulse(t)), 1.08 - .12 * wide + .02 * pulse(t, 8), 0, W / 2, H / 2 + 40 * wide);
    ysSunburst(W / 2, H * .38, t, '#3A1B63', '#57288A', 24, .25);
    ysDots(YS.goldLt, .1, 40, 6, t);
    // the rainbow floor
    const cols = ['#E0584E', '#F29A3A', '#F4CD3A', '#8CCB5A', '#4C8FD8', '#9A6AD0'];
    cols.forEach((c, i) => shape(ellPts(W / 2, H * .97, 1100 - i * 150 + 30 * pulse(t), 200 - i * 26 + 6 * pulse(t), 48), { fill: c, stroke: YS.ink, lwPx: 3 }));
    // back row
    X.save(); X.translate(W / 2, H * .78); ysThrone(0, 0, 1.9, t); X.restore();
    pearl(W / 2, H * .78 - 95 * 1.9, PP_UNIT * PEARL_K * 1.9, { sit: 1, eyes: 'happy', mouth: sing('princess_pearl', t, 'smile'), wag: .6 * Math.sin(t * 6), flipNear: -1 + .5 * Math.sin(t * 4 * Math.PI), crownTilt: .1 * Math.sin(t * 4) });
    const RA = fig('robo_safadi', W * .22, H * .84, 2.1, { eyes: 'happy', mouth: sing('robo_safadi', t, 'grin', ['open', 'O', 'open', 'teeth', 'open']), handL: [-5.6, -14.5], handR: [5.6, -14.5 + 3 * Math.sin(beatPos(t) * Math.PI)], emote: 'music', emoteK: 1, jump: bob(t) });
    fig('clawd', RA.top[0], RA.top[1] + 4, 4.0, { eyes: 'happy', mouth: 'grin', bounce: 1, jump: bob(t + .25) * 2, aL: 1, aR: 1 });
    fig('safadi', W * .76, H * .84, 2.1, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: sing('safadi', t, 'grin'), jump: bob(t + .5), tilt: .1 * Math.sin(beatPos(t) * Math.PI) });
    fig('sami', W * .88, H * .86, 2.1, { handL: [-5.8, -21.4], handR: [5.8, -21.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: sing('sami', t, 'grin'), jump: bob(t), tilt: .1 * Math.sin(beatPos(t) * Math.PI) });
    // front row: the kids and Fester, juggling five (none land on his head)
    ['housam', 'jenna'].forEach((nm, i) => fig(nm, W * (.1 + .16 * i), H * 1.08, 2.7, { ...KID_RIG[nm].up, eyes: 'happy', mouth: sing(nm, t, 'grin'), jump: 1.5 * bob(t + i * .2) }));
    fig('alma', W * .72, H * 1.08, 3.0, { ...almaDance(t - YS_BEAT0, 'floss', { bpm: YS_BPM }), power: 1, eyes: 'star', mouth: sing('alma', t, 'grin') });
    fig('danny', W * .9, H * 1.08, 2.9, { ...KID_RIG.danny.up, eyes: 'happy', mouth: sing('danny', t, 'grin'), jump: 1.5 * bob(t + .3) });
    const c = cascade(t, { n: 5, tau: .25, h: 19, t0: T_.FIN - 4 }), fs = JF_UNIT * 3.0, fx = W * .5, fy = H * .97;
    jester(fx, fy, fs, { handL: c.handL, handR: c.handR, handPoseL: 'cup', handPoseR: 'cup', eyes: 'happy', mouth: sing('jester_fester', t, 'grin'), noHat: true });
    const FA = measure(() => jester(fx, fy, fs, { handL: c.handL, handR: c.handR, noHat: true }));
    ysCrown(FA.hatBase[0], FA.hatBase[1], 4.6 * fs, t, -.05);
    c.balls.forEach(b => jugglerBall(fx + b.x * fs, fy + b.y * fs, BALL_R * fs, b.col, b.rot));
    // Dragon flies laps overhead, trailing pages
    const ang = (t - T_.FIN) * .9, dx = W / 2 + Math.cos(ang) * 780, dy = H * .2 + Math.sin(ang * 2) * 60;
    fig('dragon', dx, dy, 1.8, { ...dragonFlight(t, { lift: 0, speed: 3 }), flip: Math.sin(ang) > 0, eyes: 'happy', mouth: sing('dragon', t, 'grin') });
    camEnd();
    ysConfetti(t, T_.FIN, 'mixed', 70);
    sfx('BONK!', W * .46, H * .2, 140, YS.fire, t - T_.finBonk, { life: .7, rot: -.08 });
    ysSlamOverlay('YOU SHALL SEE!', W / 2, H * .17, 150, YS.goldLt, t, word('F.2', 0), -.03, { life: 2.3 });
    flash(.3 * kick(t, T_.FIN, 8));
  }
  // The very end: Robo leans into the lens, BEEP BOOP, iris, THE END.
  function roboTag(t) {
    const lean = ease(seg(t, T_.beepEnd - .5, T_.beepEnd + .3));
    shape(rectPts(-40, -40, W + 80, H + 80), { fill: radGrad(W / 2, H / 2, 100, 1300, [[0, '#2A1848'], [1, '#0B0614']]), stroke: null });
    ysDots('#7FE3FF', .08, 40, 6, t);
    const A = fig('robo_safadi', W / 2, H * (1.05 + .9 * lean), 3.4 + 5 * lean, { eyes: 'open', red: 0, brows: 'up', mouth: sing('robo_safadi', t, 'smile', ['open', 'O', 'open', 'teeth', 'open']), lookX: 0, antenna: .3 * boing(t, word('beepEnd', 1), 2.5, 3) });
    sfx('BEEP.', W * .22, H * .3, 110, '#BFF3FF', t - word('beepEnd', 0) - .1, { rot: -.12, life: 1.2 });
    sfx('BOOP.', W * .78, H * .3, 110, '#BFF3FF', t - word('beepEnd', 1) - .1, { rot: .12, life: 1.2 });
    const it = word('beepEnd', 1) + .95;
    if (t > it) iris(A.eyeL[0], A.eyeL[1], lerp(1500, 0, ease(seg(t, it, it + 1.0))));
    if (t > it + 1.0) overlay(() => { const k = easeOut(seg(t, it + 1.1, it + 1.6)); X.save(); X.globalAlpha = k; X.translate(W / 2, H / 2); X.scale(.8 + .2 * k, .8 + .2 * k);
      X.font = `140px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round'; X.lineWidth = 26; X.strokeStyle = '#000'; X.strokeText('THE END', 0, 0); X.fillStyle = YS.goldLt; X.fillText('THE END', 0, 0);
      X.font = `46px ${FONT_SFX}`; X.lineWidth = 10; X.strokeText('(…or is it? You shall see!)', 0, 110); X.fillStyle = YS.pinkLt; X.fillText('(…or is it? You shall see!)', 0, 110); X.restore(); });
  }

  // ---------- assembly: the karaoke on top of every shot, a page-turn on some cuts ----------
  const WIPES = [[T_.contestant, 1], [T_.C2, -1], [BRIDGE, 1], [T_.FIN, -1], [T_.nobody, 1]];
  const withTop = fn => { const g = (t, lt, dur) => { fn(t, lt, dur); for (const [tc, d] of WIPES) if (Math.abs(t - tc) < .3) ysPageWipe(seg(t, tc - .3, tc + .3), d); ysKaraoke(t); };
    Object.defineProperty(g, 'name', { value: fn.name }); return g; };
  scene({
    duration: T_.END, fps: 24, bpm: YS_BPM, beatOffset: YS_BEAT0,
    shots: [
      [0, fairOpen], [T_.dazzle - .3, pearlDecree], [T_.beep - .4, roboBeep], [10.0, safStall], [T_.maths - .2, safadiBooksShot], [T_.crown, crownShot], [T_.brag, safBrag],
      [T_.ready - .1, huddle], [T_.ladder, ladderUp], [T_.planning, safSuspicious], [T_.shout - .1, kidsShout], [T_.C1, chorus(0)],
      [T_.contestant, pearlCU], [T_.boogers, samiPitch], [T_.ew, pearlMed], [T_.popup, dragonPitch], [T_.fire, pearlCU], [T_.prompt, roboPitch], [T_.why, pearlBuried],
      [T_.bored - .2, pearlBored], [T_.C2, chorus(1)],
      [BRIDGE, festerSpot], [T_.jennaDrew, bookPages], [T_.math, mathRap], [T_.called, reading], [T_.ch1, audience], [T_.ch2, reading],
      [T_.allow, explainCU], [T_.now - .2, ladderCU], [T_.release + .14, fallWide], [T_.bonk, bonkCU], [T_.bonk + 1.0, pearlLaugh],
      [T_.laughed, party], [at('hired'), hired], [T_.triumph, triumph], [T_.FIN, finale],
      [T_.nobody, tagStall], [T_.splendid, tagExplain], [T_.another, tagPearl], [T_.scratch + .3, roboTag],
    ].map(([t0, fn]) => [t0, withTop(fn)]),
  });
})();
