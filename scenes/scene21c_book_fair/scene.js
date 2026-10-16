// Scene 21c: "The Book Fair". The DCES library, desk view from the back of the room (dir 1, +X is screen-right).
// Two stands along the back of the reading room: the kids' DOLPHIN ROYALTY stand (left) and the Safadi brothers' stand
// (right). Students pour in at the door and mob the kids' stand; three wander over to Safadi's. Story time: Alma tells
// Fester's two stories (scenes 01 and 02, playing in a cloud over the story rug) while Safadi explains the Riemann hypothesis
// (scene 06) to three students who fall asleep, and so does Sami. The kids sell out; Safadi sells nothing, and is proud of
// them anyway. Alma is sad: she wishes Pearl and Fester were real. "We can always imagine." To be continued.
// Blocking (world units): the kids' stand at x −320 and Safadi's at x 320, front edge z 430; sellers behind at z 485; the rug
// at (−340, 250); twelve students (`S`) with seats on the rug and in front of Safadi. Every shot is a pure function of t.
(() => {
  const L = LOCATIONS.school_library, LINES = ASSETS.scene.scene21c_book_fair.dialogue;
  const ACCENT = { housam: '#425DA0', danny: '#2E7D9A', jenna: '#D0508E', alma: '#994EC4', safadi: PAL.crimson, sami: '#2E7D6A', student: '#5A6E8E' };

  // ---------- timing ----------
  const DOORS = 14.4, RUSH0 = 14.6, PICK = [26.2, 29.6], STORY0 = 38.0, SIT = 39.8;
  const TALE1 = [41.0, 59.6], TALE2 = [80.0, 99.4], BONKS = [54.8, 55.4, 56.0], LAUGH1 = [57.8, 60.0], LAUGH2 = [97.6, 100.0];
  const DOZE = [62.0, 76.0], SAMI_DOZE = [70.0, 77.0], WAKE = 106.2, SALE = 109.0, BUY0 = 111.4, BUY_DT = .45, SOLD = 117.0;
  const SAD = 122.0, WALK_S = [128.4, 131.2], LEAVE = [124.0, 131.0], CHEER = 139.0, ALMA_OUT = [139.8, 141.8], IMAGINE = 155.4, FREEZE = 158.0, END = 164;
  const BOARDS = [['primes', 60.0, 64.4], ['count', 64.4, 69.0], ['zeta', 69.0, 73.4], ['strip', 73.4, 80.0], ['strip', 100.0, 105.0]];

  // ---------- where everything is ----------
  const KST = -320, SST = 320, STZ = 430;
  const HOME = { jenna: [-425, 485], alma: [-355, 485], housam: [-285, 485], danny: [-215, 485], safadi: [275, 485], sami: [405, 485] };
  const TELL = [-340, 378], LECT = [300, 398], ALMA_END = [-250, 402], SAF_END = [-105, 410];
  const DOOR = [-560, 1195], AISLE = [[-120, 1010], [-20, 700], [-20, 455]];
  const N = 12, CROWD = 9;
  const SPOT = [[-460, 395], [-385, 395], [-310, 392], [-235, 395], [-165, 398], [-430, 345], [-350, 342], [-270, 345], [-195, 348], [240, 392], [322, 395], [404, 392]];
  const SALE_SPOT = [...SPOT.slice(0, 9), [-495, 300], [-150, 300], [-420, 270]];
  const SEAT = [[-500, 325], [-430, 330], [-255, 330], [-185, 325], [-470, 262], [-395, 255], [-315, 252], [-240, 256], [-170, 265], [245, 350], [335, 340], [425, 350]];
  const LOOK = Array.from({ length: N }, (_, i) => studentLook(101 + i * 3));
  const POP = [-340, 262, 378], POP_W = 250;                                  // the story cloud over the rug (world)
  const BOARD = [495, 238, 380], BOARD_W = 170;                               // Safadi's chalkboard (world)
  const DREAM = [-178, 238, 405];                                             // the last little cloud over Safadi and Alma

  function along(pts, t, [a, b]) {
    const Ls = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); Ls.push(l); tot += l; }
    let d = ease(seg(t, a, b)) * tot, i = 0; const dist = d;
    while (i < Ls.length - 1 && d > Ls[i]) { d -= Ls[i]; i++; }
    const f = clamp(d / Ls[i]), [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
    return { x: lerp(x0, x1, f), z: lerp(z0, z1, f), dist, moving: t > a && t < b };
  }
  const still = p => ({ x: p[0], z: p[1], dist: 0, moving: false });
  // a student's whole day: in at the door, to the stand, to a seat, to the sale, out again
  function stuAt(i, t) {
    const r0 = RUSH0 + i * .42, rush = [DOOR, ...AISLE, SPOT[i]];
    if (t < r0) return { ...still(DOOR), hidden: true };
    if (t < STORY0 + .2 * i) return along(rush, t, [r0, r0 + 4.4]);
    const st = [STORY0 + .12 * i, SIT + .12 * i - .3];
    if (t < SALE) return along([SPOT[i], SEAT[i]], t, st);
    const sa = [SALE + .3 + .08 * i, SALE + 2.2 + .08 * i], lv = [LEAVE[0] + i * .45, LEAVE[0] + i * .45 + 4.0];
    if (t < lv[0]) return along(i >= CROWD ? [SEAT[i], [SEAT[i][0] < 0 ? SEAT[i][0] : 180, 330], SALE_SPOT[i]] : [SEAT[i], SALE_SPOT[i]], t, sa);
    const out = along([SALE_SPOT[i], [-20, 455], [-20, 700], [-120, 1010], DOOR], t, lv);
    return { ...out, hidden: t > lv[1] };
  }
  function at(name, t) {
    if (name === 'alma') {
      if (t < STORY0 - 1) return still(HOME.alma);
      if (t < SALE) return along([HOME.alma, [-460, 490], [-470, 400], TELL], t, [STORY0 - 1, STORY0 + 1.4]);
      if (t < ALMA_OUT[0]) return along([TELL, [-470, 400], [-460, 490], HOME.alma], t, [SALE, SALE + 2.2]);
      return along([HOME.alma, [-460, 490], [-465, 405], ALMA_END], t, ALMA_OUT);
    }
    if (name === 'safadi') {
      if (t < STORY0 - 1.4) return still(HOME.safadi);
      if (t < SALE) return along([HOME.safadi, [182, 488], [182, 400], LECT], t, [STORY0 - 1.4, STORY0 + .6]);
      if (t < WALK_S[0]) return along([LECT, [182, 400], [182, 488], HOME.safadi], t, [SALE + .4, SALE + 2.4]);
      return along([HOME.safadi, [182, 488], [150, 412], SAF_END], t, WALK_S);
    }
    return still(HOME[name]);
  }

  // ---------- helpers ----------
  const textLen = l => l.text.replace(/\*/g, '').length;
  const speaking = (who, t) => LINES.some(l => { if ((l.who || l.speaker) !== who) return false; const p = (t - l.at - .2) * l.cps; return p > 0 && p < textLen(l); });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const inW = (t, a, b) => t > a && t < b;
  const bounce = (t, f = 12, ph = 0) => Math.abs(Math.sin(t * f + ph));
  const telling = t => inW(t, TALE1[0] - .4, TALE1[1]) || inW(t, TALE2[0] - .4, TALE2[1]);
  const lecturing = t => inW(t, 59.6, 80.0) || inW(t, 99.6, 106.2);
  const bought = (i, t) => t > BUY0 + i * BUY_DT + .25;
  const stock = t => 1 - clamp((t - BUY0) / (N * BUY_DT));
  const asleep = (i, t) => i >= CROWD ? ease(seg(t, DOZE[0] + (i - CROWD) * 2.5, DOZE[1] - (2 - (i - CROWD)) * 1.5)) * (t < WAKE ? 1 : 0) : 0;
  const lookToward = (meX, x, k = 1) => clamp((x - meX) / 140, -1, 1) * .85 * k;

  // ---------- poses ----------
  function stuPose(i, t, a) {
    const talk = speaking('s' + i, t), o = { mouth: lipFlap(t, talk, 'smile'), brows: 'normal', lookX: 0, turn: 0, seed: i };
    const set = p => Object.assign(o, p);
    if (a.moving) return set({ ...studentWalk(a.dist / 40, 1), mouth: 'grin', brows: 'up', lookX: (a.x < -20 ? -.4 : .4), sit: 0 });
    const sitK = t < SALE ? ease(seg(t, SIT + .12 * i - .3, SIT + .12 * i + .2)) : 1 - ease(seg(t, SALE, SALE + .3 + .08 * i));
    set({ sit: sitK });
    if (t < STORY0) {                                                         // at the stands
      if (i < CROWD) set({ handR: [3.8 + .4 * Math.sin(t * 6 + i), -20 + .6 * Math.sin(t * 8 + i)], handPoseR: 'palm', jump: .5 * bounce(t, 5, i), mouth: talk ? o.mouth : 'grin', brows: 'up', lookY: -.3, lookX: lookToward(SPOT[i][0], KST + 30 * Math.sin(t + i), .6) });
      else set({ lookX: lookToward(SPOT[i][0], SST), lookY: -.2, mouth: 'flat', ...(i === 10 && inW(t, ...PICK) ? { handR: [2.4, -15.5], handPoseR: 'fist', handL: [-2.4, -15.5], handPoseL: 'fist', lookY: .4, lookX: 0, brows: 'up', mouth: talk ? o.mouth : 'o', book: 'safadi' } : {}) });
      if (i < CROWD && t > 35.0 && t < 37.0) set({ handR: [3.8, -22], handL: [-3.8, -22], handPoseL: 'palm', jump: 1.0 * kick(t, 35.1 + .05 * i, 5), eyes: 'happy' });
      return o;
    }
    if (t < SALE) {                                                           // story time
      if (i < CROWD) {
        set({ lookX: lookToward(SEAT[i][0], TELL[0]), lookY: -.5, mouth: 'smile', eyes: 'open', brows: 'up' });
        if (telling(t)) set({ eyes: (t > 46 && t < 49) || (t > 80 && t < 83) ? 'star' : 'open', mouth: 'o' });
        if (inW(t, BONKS[0], LAUGH1[1]) || inW(t, 88.4, 90.4) || inW(t, ...LAUGH2)) set({ eyes: 'happy', mouth: 'open', dy: .25 * bounce(t, 10, i), tilt: .08 * Math.sin(t * 9 + i) });
        if (inW(t, 90.8, 94.0)) set({ eyes: 'wide', mouth: 'O', handL: [-1.6, -21], handR: [1.6, -21], handPoseL: 'palm', handPoseR: 'palm' });
        if (inW(t, ...LAUGH2)) set({ handL: [-4, -20], handR: [4, -20], handPoseL: 'palm', handPoseR: 'palm' });
      } else {
        const z = asleep(i, t);
        set({ lookX: lookToward(SEAT[i][0], LECT[0]), lookY: -.3, eyes: z > .85 ? 'closed' : z > .25 ? 'sleepy' : 'open', mouth: z > .85 ? 'o' : z > .5 && inW(t, 66 + i, 67.4 + i) ? 'yawn' : 'flat', tilt: .32 * z * (i % 2 ? 1 : -1), dy: .3 * z, emote: z > .9 ? 'zzz' : null, emoteK: 1 });
        if (t > WAKE && t < WAKE + 1.2) set({ eyes: 'wide', mouth: 'O', jump: 1.6 * kick(t, WAKE + .05, 5), brows: 'up', tilt: 0 });
      }
      return o;
    }
    // the sale, and after
    const has = bought(i, t);
    set({ lookX: lookToward(SALE_SPOT[i][0], KST), lookY: -.2, mouth: has ? 'grin' : 'open', brows: 'up', eyes: has ? 'happy' : 'open',
      handR: has ? [2.6, -13.5] : [3.8, -21 + .6 * Math.sin(t * 8 + i)], handPoseR: has ? 'fist' : 'palm', jump: has ? .4 * kick(t, BUY0 + i * BUY_DT + .25, 5) : .4 * bounce(t, 6, i), book: has ? (i % 2 ? 'green' : 'gold') : null });
    return o;
  }
  function kidPose(name, t) {
    const talk = speaking(name, t), o = { mouth: lipFlap(t, talk, name === 'danny' ? 'grin' : 'smile'), brows: 'up', lookX: 0, turn: 0 };
    const set = p => Object.assign(o, p), a = at(name, t);
    if (name === 'jenna') set({ giraffe: false });
    const up = { housam: [4.4, -23], jenna: [3.6, -21], alma: [3.4, -17.5], danny: [4.3, -19.3] }[name], upL = [-up[0], up[1]];
    if (a.moving) {
      const walk = { housam: housamDribble, danny: dannyDribble, jenna: jennaSkip, alma: almaSkip }[name];
      return set({ ...walk(a.dist / 44, 1), mouth: 'grin', ...(name === 'jenna' ? { handL: [-2.6, -11.6], handR: [2.6, -11.6] } : {}) });
    }
    if (t < DOORS) set({ lookX: 0, mouth: talk ? o.mouth : 'grin', ...(talk ? { handR: up, handPoseR: 'palm', jump: .4 * bounce(t, 4) } : {}) });
    else if (t < STORY0 - 1) set({ eyes: t < 20 ? 'wide' : 'happy', mouth: talk ? o.mouth : 'grin', handR: [up[0] * 1.1, up[1] * .85], handPoseR: 'palm', jump: .5 * bounce(t, 5, name.length) });
    else if (t < SALE) {
      if (name === 'alma') {                                                // the storyteller
        set({ lookX: .1, lookY: -.2, mouth: talk ? o.mouth : 'smile', handR: [3.6, -15 + .8 * Math.sin(t * 2)], handPoseR: 'palm', handL: [-3.6, -14 + .8 * Math.cos(t * 2.2)], handPoseL: 'palm' });
        if (inW(t, 45.8, 50.4)) set({ handL: [-4.6, -12 + 2 * Math.abs(Math.sin(t * 7))], handR: [4.6, -12 + 2 * Math.abs(Math.cos(t * 7))], handPoseL: 'open', handPoseR: 'open', eyes: 'happy' });   // juggling, like Fester
        if (inW(t, 54.8, 57.0)) set({ handR: [1.2, -18], handPoseR: 'fist', eyes: 'squeeze', jump: .3 * Math.max(...BONKS.map(b => kick(t, b, 8))) });
        if (inW(t, 86.4, 87.6)) set({ eyes: 'closed', mouth: talk ? o.mouth : 'flat', handR: [2.0, -9], handL: [-2.0, -9], tilt: .1 });            // Pearl, bored
        if (inW(t, 90.4, 92.6)) set({ handR: [5.2, -14], handPoseR: 'point', brows: 'angry', jump: .5 * kick(t, 90.6, 6) });                      // FIRED!
        if (inW(t, 94.0, 97.4)) set({ handL: [-2.6, -7.6], handR: [2.6, -7.6], brows: 'worried', mouth: talk ? o.mouth : 'flat', dy: .3 });       // the sigh
      } else set({ lookX: name === 'danny' ? -.6 : -.3, lookY: -.3, mouth: inW(t, BONKS[0], LAUGH1[1]) || inW(t, ...LAUGH2) ? 'open' : 'smile', eyes: inW(t, BONKS[0], LAUGH1[1]) ? 'happy' : 'open', handL: undefined, handR: undefined });
    } else if (t < SOLD) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', handR: [up[0] * .9, -13 + 3 * Math.abs(Math.sin(t * 9 + name.length))], handPoseR: 'palm', lookX: -.2 });
    else if (t < CHEER - .2) set({ handL: upL, handR: up, handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: (t < 121 ? 1 : .3) * bounce(t, 5, name.length) });
    else {
      set({ lookX: .6, turn: .3, mouth: talk ? o.mouth : 'smile' });
      if (t < 141.8 && name !== 'alma') set({ handL: upL, handR: up, handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: talk ? o.mouth : 'grin', jump: 1.0 * kick(t, CHEER + .05, 4) });
      if (t > 141.8 && name !== 'alma') set({ lookX: .5, brows: 'worried', mouth: 'flat' });
      if (name === 'alma') {
        set({ brows: 'worried', mouth: talk ? o.mouth : 'frown', lookY: .6, lookX: .2, eyes: t > 141.8 && t < 142.6 ? 'closed' : 'open', handL: [-1.4, -8.4], handR: [1.4, -8.4], dy: .2 });
        if (t > 142.0 && t < 153.0) set({ lookY: t > 147.8 ? .3 : 0, lookX: .7, turn: .3 });
        if (t > 153.8) set({ brows: 'up', mouth: 'smile', lookY: -.4, lookX: .5, dy: 0 });
        if (t > IMAGINE) set({ eyes: t < IMAGINE + 1.2 ? 'star' : 'happy', mouth: 'grin', handL: [-3.4, -16], handR: [3.4, -16], handPoseL: 'palm', handPoseR: 'palm', jump: .5 * kick(t, IMAGINE + .1, 5) });
      }
    }
    return o;
  }
  function safadiPose(t) {
    const talk = speaking('safadi', t), a = at('safadi', t);
    const o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.5, turn: -.2, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (a.moving) return set({ ...safadiWalk(a.dist / 58, 1), lookX: a.x > 200 ? -.3 : -.6, mouth: t > SALE ? 'smile' : 'grin' });
    if (t < 4.6) set({ handL: [-5.8, -16], handR: [5.8, -16], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'grin', brows: 'up', lookX: 0, turn: 0, jump: .3 * kick(t, 1.1, 6) });
    else if (t < 26.0) set({ lookX: -.8, turn: -.3, brows: t > 18 ? 'worried' : 'up', mouth: t > 18 ? 'flat' : 'smile', emote: t > 21 && t < 24 ? 'sweat' : null, emoteK: 1 });
    else if (t < STORY0 - 1.4) set({ lookX: -.2, lookY: .4, brows: 'up', mouth: talk ? o.mouth : 'grin', handR: t > 29 ? [5.8, -18] : [4.4, -8.1], handPoseR: t > 29 ? 'thumb' : 'open', ...(t > 36.2 ? { handL: [-5.8, -17], handPoseL: 'palm', lookX: .2 } : {}) });
    else if (t < SALE) {                                                      // the lesson
      const pw = lecturing(t) ? on(t, 59.6, t < 99 ? 80 : 106.2, .5) * .55 : 0;
      set({ power: pw, eyes: pw > .3 ? 'glow' : 'open', handR: [6.2, -15.6], handPoseR: 'pointer', pointerAng: -.4 + .08 * Math.sin(t * 1.3), handL: [-5.3, -12.4], handPoseL: 'palm', lookX: .4, turn: .15, brows: 'up', mouth: talk ? o.mouth : 'smile' });
      if (inW(t, 76.0, 80.0) || inW(t, 99.6, 103.6)) set({ eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: 0, turn: 0 });               // lost in his own lesson
      if (inW(t, 103.6, WAKE)) set({ power: 0, eyes: t < 103.9 ? 'squeeze' : 'wide', brows: 'worried', mouth: talk ? o.mouth : 'o', lookX: -.5, lookY: .4, emote: 'sweat', emoteK: 1, handR: [4.4, -8.1], handPoseR: 'open' });
      if (inW(t, WAKE, SALE)) set({ power: 0, eyes: 'wide', brows: 'up', mouth: 'o', lookX: .6, handR: [4.4, -8.1], handPoseR: 'open', jump: .5 * kick(t, WAKE + .1, 6) });
    } else if (t < WALK_S[0]) {                                               // the sale, then the empty-handed stand
      set({ lookX: -.85, turn: -.35, brows: 'worried', mouth: 'flat' });
      if (t > SAD) set({ lookX: 0, lookY: .6, turn: 0, mouth: talk ? o.mouth : 'frown', eyes: t > 123.4 && t < 124.2 ? 'closed' : 'open', dy: .4 * ease(seg(t, SAD, SAD + 1)), handL: [-3.0, -8], handR: [3.0, -8] });
      if (t > 127.2) set({ lookX: -.8, lookY: 0, turn: -.35, brows: 'up', mouth: 'smile', dy: 0 });
    } else {                                                                  // proud
      set({ lookX: -.7, turn: -.3, brows: 'up', mouth: talk ? o.mouth : 'smile' });
      if (inW(t, 131.4, 139.0)) set({ handL: [-5.4, -15], handR: [5.4, -15], handPoseL: 'palm', handPoseR: 'palm', eyes: t > 135 ? 'happy' : 'open', power: .25 * on(t, 134.8, 139, .4) });
      if (t > 140.8) set({ lookX: -.85, lookY: .5, brows: 'worried', mouth: talk ? o.mouth : 'flat', lean: -.06 * ease(seg(t, 141, 142)), dy: .3 * ease(seg(t, 141, 142)) });
      if (t > 152.6) set({ brows: 'up', mouth: talk ? o.mouth : 'smile', handR: [1.0, -14.6], handPoseR: 'palm', eyes: t > 154.6 ? 'happy' : 'open', power: .3 * ease(seg(t, 153, 154.5)) });
    }
    return o;
  }
  function samiPose(t) {
    const talk = speaking('sami', t), o = { mouth: lipFlap(t, talk, 'smile'), lookX: -.5, turn: -.2, brows: 'normal', handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (t < 8.6) set({ handR: [5.4, -17], handPoseR: 'thumb', mouth: talk ? o.mouth : 'grin', lookX: 0, turn: 0, brows: 'up' });
    else if (t < STORY0) set({ lookX: -.6, mouth: 'smile', ...(inW(t, 29.0, 31.4) ? { handR: [5.4, -17], handPoseR: 'thumb', eyes: 'happy' } : {}) });
    else if (t < WAKE) {
      const z = ease(seg(t, ...SAMI_DOZE));
      set({ lookX: .5, eyes: z > .8 ? 'closed' : z > .2 ? 'narrow' : 'open', tilt: .28 * z + .06 * z * Math.sin(t * 1.6), dy: .3 * z, mouth: z > .8 ? 'o' : 'smile', lean: .05 * z, handL: [-3.0, -8.4], handR: [3.0, -8.4] });
      if (z > .9) set({ emote: 'sweat', emoteK: 0 });
    } else if (t < SALE + 2) set({ eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'O', jump: 1.6 * kick(t, WAKE, 5), handL: [-5.6, -18], handR: [5.6, -18], handPoseL: 'palm', handPoseR: 'palm', lookX: 0 });
    else if (t < WALK_S[0]) set({ lookX: -.8, brows: 'worried', mouth: 'flat', ...(t > 123.5 ? { handL: [-6.4, -15], handPoseL: 'palm', lookX: -.5 } : {}) });        // a pat on his twin's shoulder
    else set({ lookX: -.8, mouth: 'smile', brows: 'up' });
    return o;
  }

  // ---------- the stage, for a camera ----------
  const CAST = {
    safadi: { pose: safadiPose, rig: safadi, unit: SAFADI_UNIT }, sami: { pose: samiPose, rig: sami, unit: SAMI_UNIT },
    jenna: { pose: t => kidPose('jenna', t), rig: jenna, unit: JENNA_UNIT }, alma: { pose: t => kidPose('alma', t), rig: alma, unit: ALMA_UNIT },
    housam: { pose: t => kidPose('housam', t), rig: housam, unit: HOUSAM_UNIT }, danny: { pose: t => kidPose('danny', t), rig: danny, unit: DANNY_UNIT },
  };
  const HEADW = { safadi: 6.6, sami: 6.6, jenna: 4.6, alma: 6.6, housam: 5.6, danny: 5.4, student: 5.4 };
  const LSET = { sun: 1, lamps: .6, board: () => { X.font = `48px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#C0443F'; X.fillText('BOOK FAIR TODAY!', 280, 70); } };
  function stage(t, camO, blur, o = {}) {
    const P = persp(camO), A = {}, S = {}, items = [];
    const fz = o.freeze ? { boil: 0 } : {};
    for (const [name, c] of Object.entries(CAST)) {
      const a = at(name, t); if (P.depth(a.z) < 40) continue;
      items.push({ z: a.z, draw: () => { const [sx, sy, k] = P.p(a.x, 0, a.z), s = c.unit * k; A[name] = c.rig(sx, sy, s, { ...c.pose(t), t, ...fz }); S[name] = s; } });
    }
    for (let i = 0; i < N; i++) {
      const a = stuAt(i, t); if (a.hidden || P.depth(a.z) < 40) continue;
      items.push({ z: a.z, draw: () => {
        const [sx, sy, k] = P.p(a.x, 0, a.z), s = STUDENT_UNIT * k, pose = stuPose(i, t, a);
        const fade = clamp(seg(t, RUSH0 + i * .42, RUSH0 + i * .42 + .3));
        if (fade < 1) { X.save(); X.globalAlpha = fade; }
        const key = 's' + i; A[key] = student(sx, sy, s, { ...pose, look: LOOK[i], t, ...fz }); S[key] = s * LOOK[i].h;
        if (pose.book === 'safadi') bfSafadiBook(A[key].handR[0] - 2 * S[key], A[key].handR[1] - 3 * S[key], 5 * S[key], -.05, 'MATH');
        else if (pose.book) dryCover(pose.book, A[key].handR[0], A[key].handR[1] - 3.4 * S[key], 4.6 * S[key], .08, { t, shadow: false });
        if (fade < 1) X.restore();
      } });
    }
    items.push({ z: STZ + 23, draw: () => bfStand(P, KST, STZ, t, { kind: 'kids', banner: 'DOLPHIN ROYALTY', stock: t < BUY0 ? 1 : stock(t), soldOut: seg(t, SOLD, SOLD + .4) }) });
    items.push({ z: STZ + 23, draw: () => bfStand(P, SST, STZ, t, { kind: 'safadi', banner: 'PROFESSOR SAFADI EXPLAINS...', stock: inW(t, PICK[0] + .2, PICK[1] - .2) ? .9 : 1 }) });
    items.sort((p, q) => P.depth(q.z) - P.depth(p.z));
    layer(() => L.back(P, t, { ...LSET, splitZ: items[0].z }), { blur });
    items.forEach((it, i) => { it.draw(); L.front(P, t, { ...LSET, splitZ: it.z, toZ: items[i + 1]?.z }); });
    overWorld(t, P, A, S);
    return { A, S, P };
  }
  // things that float in the world over everyone: the story clouds, the chalkboard, the dream cloud, books flying
  function overWorld(t, P, A, S) {
    for (const [w0, w1, kind] of [[...TALE1, 'juggle'], [...TALE2, 'fired']]) {
      const k = backOut(seg(t, w0, w0 + .5)) * (1 - ease(seg(t, w1 - .4, w1))); if (k <= .01 || !P.visible(POP[2])) continue;
      const [cx, cy, pk] = P.p(...POP), r = POP_W / 2 * pk;
      dryPop(cx, cy, r, k, t, () => bfStory(kind, t - w0, cx, cy, r * 2.2, r * 1.75));
    }
    for (const [kind, b0, b1] of BOARDS) {
      if (!inW(t, b0, b1) || !P.visible(BOARD[2])) continue;
      const [bx, by, bk] = P.p(...BOARD), out = 1 - ease(seg(t, b1 - .25, b1));
      if (BOARD_W * bk > 800) continue;                                       // too close to this camera (Sami's close-up)
      bfBoard(kind, bx, by, BOARD_W * bk * out, seg(t, b0, b0 + 3.0), t);
    }
    if (t > IMAGINE && P.visible(DREAM[2])) {
      const [cx, cy, pk] = P.p(...DREAM), r = 62 * pk, k = backOut(seg(t, IMAGINE, IMAGINE + .5));
      dryPop(cx, cy, r, k, t, () => {
        pearl(cx - 30 * pk, cy + 34 * pk, PP_UNIT * pk * .3, { t, sit: 1, eyes: 'happy', mouth: 'smile', point: .7 + .2 * Math.sin(t * 4), pointAng: -.9, noShadow: true });
        jester(cx + 26 * pk, cy + 38 * pk, JF_UNIT * pk * .36, { t, eyes: 'happy', mouth: 'grin', handR: [5.4, -24 + 1.5 * Math.sin(t * 7)], handPoseR: 'open', handL: [-3.6, -11], noShadow: true });
      });
    }
    // books fly from the stand into each buyer's hands
    for (let i = 0; i < N; i++) {
      const b0 = BUY0 + i * BUY_DT, u = seg(t, b0, b0 + .3), key = 's' + i; if (u <= 0 || u >= 1 || !A[key]) continue;
      const [sx, sy, k] = P.p(KST + (i % 5 - 2) * 40, BF_STAND.h + 20, STZ + 20), tx = A[key].handR[0], ty = A[key].handR[1] - 3.4 * S[key];
      dryCover(i % 2 ? 'green' : 'gold', lerp(sx, tx, u), lerp(sy, ty, u) - 90 * k * Math.sin(Math.PI * u), lerp(30 * k, 4.6 * S[key], u), u * 6, { t, shadow: false });
    }
  }

  // ---------- bubbles ----------
  function bubbles(t, A, S, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 10) continue;
      const key = l.who || l.speaker, c = { size: o.size || 48, maxW: o.maxW || 640, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A?.[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W && a.mouth[1] > 0);
        if (ms.length > 1) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 30, age, { ...c, size: c.size * (l.kind === 'shout' ? 1.25 : 1.05), dx: o.groupDx ?? 0, dy: o.groupDy ?? -180 }); continue;
        }
      }
      const a = A?.[key], s = S?.[key];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60 && a.mouth[1] > 40) {
        const side = o.side ? o.side(key, a) : (a.mouth[0] < W * .5 ? 1 : -1);
        callout(l.text, a.mouth[0] + side * (HEADW[l.speaker] || 5) * s * .9, a.mouth[1] - .6 * s, age, { ...c, dx: side * (o.far || 280), dy: o.dy ?? -200 });
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
  const WIDE = cam(0, 230, 60, 440, 620);                                     // both stands, the rug, the door far left
  const KSTC = cam(-320, 340, 60, 270, 1000);                                 // the kids' stand
  const SSTC = cam(320, 340, 60, 270, 1000);                                  // the Safadi brothers' stand
  const RUG = cam(-335, 270, 50, 260, 620);                                   // story time: Alma, the students, the cloud
  const CLOUD = cam(-340, 262, 160, 540, 1000);                               // the story cloud, big
  const SAFT = cam(345, 250, 60, 290, 650);                                   // Safadi's lesson: him, the board, his three students
  const SAFMS = cam(400, 160, 215, 480, 1000);
  const SAMICU = cam(445, 175, 300, 470, 900);
  const TWOC = cam(-230, 200, 150, 460, 900);                                 // Safadi and the kids at their stand
  const ENDC = t => ({ ...cam(-178, 150, 115, 430, 900)(t), z: lerp(115, 140, ease(seg(t, 142, FREEZE))) });

  const shot = (camFn, blur, bo) => t => { const { A, S } = stage(t, camFn(t), blur); bubbles(t, A, S, bo); };
  const leftRight = (key, a) => a.mouth[0] < W * .5 ? 1 : -1;
  function opening(t) { const c = WIDE(t); c.z = lerp(52, 60, ease(seg(t, 0, 8))); const { A, S } = stage(t, c, 0); bubbles(t, A, S, { size: 44, side: leftRight, far: 220, dy: -180 }); }
  const wide = shot(WIDE, 0, { size: 44, side: leftRight, far: 220, dy: -180, groupDy: -150 });
  const kst = shot(KSTC, 1.6, { size: 50, side: leftRight, far: 240, dy: -210, groupDy: -200 });
  const sst = shot(SSTC, 1.6, { size: 50, side: leftRight, far: 240, dy: -200 });
  const rug = shot(RUG, 1.0, { size: 46, side: (k, a) => k === 'alma' ? -1 : leftRight(k, a), far: 240, dy: -150, groupDy: 120 });
  const cloud = shot(CLOUD, 3.0, { size: 50, edgeSide: 0 });
  const saft = shot(SAFT, 1.0, { size: 46, side: () => -1, far: 260, dy: -220 });
  const safms = shot(SAFMS, 2.4, { size: 50, side: () => -1, far: 280, dy: -230 });
  const samicu = shot(SAMICU, 3.0, { size: 52, side: () => -1, far: 260 });
  const twoc = shot(TWOC, 1.6, { size: 50, side: leftRight, far: 240, dy: -220, groupDy: -200 });
  function ending(t) {
    const tt = Math.min(t, FREEZE), { A, S } = stage(tt, ENDC(tt), 2.2, { freeze: t > FREEZE }); bubbles(tt, A, S, { size: 50, side: k => k === 'safadi' ? 1 : -1, far: 260, dy: -220 });
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
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, 162.2, 163.6))));
  }

  scene({ duration: END, fps: 24, bpm: 108,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [8.4, kst], [DOORS, wide], [20.0, kst], [26.0, sst], [31.6, kst], [35.0, wide],
      [TALE1[0], rug], [50.5, cloud], [57.6, rug], [60.0, saft], [69.0, safms], [73.4, saft], [78.0, samicu],
      [TALE2[0], rug], [86.4, cloud], [92.8, rug], [100.0, saft], [WAKE, samicu],
      [SALE, wide], [113.0, kst], [SAD, sst], [WALK_S[0], wide], [131.4, twoc], [142.0, ending],
    ] });
})();
