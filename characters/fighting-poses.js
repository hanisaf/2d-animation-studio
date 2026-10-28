// Shared pose library, evaluated after each fighter's rig by its asset manifest.
// The IIFE keeps repeated loads (and bundled JavaScript exports) isolated.
(() => {
  const profiles = {
    jester_fester: { h: 30, shoulder: 13.25, hip: 8.4, reach: 7, special: 'Jester tumble', color: '#E5B739' },
    princess_pearl: { h: 22, kind: 'dolphin', special: 'Royal rainbow', color: '#ED91C1' },
    safadi: { h: 31, shoulder: 15, hip: 8, reach: 8, special: 'Chalk burst', color: '#E9CB73' },
    alma: { h: 24, shoulder: 9.4, hip: 4.2, reach: 6, special: 'Rainbow rhythm', color: '#B98AE8' },
    dragon: { h: 28, shoulder: 10, hip: 6, reach: 9, kind: 'dragon', special: 'Wing gust', color: '#83CF5A' },
    housam: { h: 32, shoulder: 17.45, hip: 8.25, reach: 9, special: 'Power volley', color: '#6EBBF2' },
    danny: { h: 29, shoulder: 15.7, hip: 7.7, reach: 8, special: 'Block breaker', color: '#85C473' },
    sami: { h: 31, shoulder: 15, hip: 8, reach: 8, special: 'Health pulse', color: '#71D8C6' },
    jenna: { h: 30, shoulder: 16.3, hip: 10, reach: 9, special: 'Cartwheel comet', color: '#F1A6CF' },
    robo_safadi: { h: 32, shoulder: 15, hip: 8, reach: 9, special: 'Broccoli boost', color: '#FF765D' },
    clawd: { h: 8, shoulder: 4.5, hip: 2.4, reach: 7, kind: 'block', special: 'Prompt pop', color: '#7FE3FF' },
    neptune: { h: 23, kind: 'dolphin', special: 'Tidal burst', color: '#61C9F0' },
    sarah: { h: 36, shoulder: 22.25, hip: 12.6, reach: 11, special: 'Rebel spike', color: '#F080AC' },
  };
  const id = CURRENT_ASSET.id, p = profiles[id], entry = CHARACTERS[id];
  if (!p || !entry) return;
  const smooth = n => { n = Math.max(0, Math.min(1, n)); return n * n * (3 - 2 * n); };
  const mix = (a, b, k) => a + (b - a) * k;
  const attacks = ['light punch', 'heavy punch', 'light kick', 'heavy kick', 'low sweep', 'crouching punch', 'jumping punch', 'jumping kick', 'special'];
  const durations = { stance: 1.2, 'walk forward': .8, 'walk backward': .9, crouch: .45, 'stand up': .45,
    jump: .9, 'jump forward': .9, 'jump backward': .9, 'block high': .8, 'block low': .8,
    'block recoil high': .4, 'block recoil low': .4, 'hit head': .5, 'hit body': .5, 'hit low': .5, 'hit air': .65,
    knockdown: .8, grounded: 1, 'get up': .9, victory: 1.8, defeat: 1.4 };
  attacks.forEach(name => { durations[name] = name === 'special' ? 1.2 : name.includes('heavy') || name === 'low sweep' ? .8 : .55; });

  // u is normalized progress through one move. All sampling is independent of prior frames.
  function sample(move, u) {
    if (!(move in durations)) throw new Error('Unknown fighting move: ' + move);
    u = Math.max(0, Math.min(1, u));
    const bob = Math.sin(u * Math.PI * 2), h = p.h, sh = p.shoulder || 10, hip = p.hip || 5;
    const o = { handL: [-2, -sh + 1], handR: [4, -sh - 1], footL: [-2, -.8], footR: [2, -.8],
      handPoseL: 'fist', handPoseR: 'fist', lookX: .8, mouth: 'flat', brows: 'normal',
      breathe: false, giraffe: false, noShadow: true, boil: 0, lean: -.035,
      dy: .15 + .12 * bob, aL: 1.1, aR: .9, sit: .8, flipNear: -1, flipFar: -.7,
      wings: .25, pawL: [-5.2, -5.5], pawR: [2, -7], red: id === 'robo_safadi' ? .65 : 0 };
    let lift = 0, dx = 0, angle = 0, crouch = 0, power = 0;
    if (move.startsWith('walk')) {
      const q = Math.sin(u * Math.PI * 2), dir = move === 'walk forward' ? 1 : -1;
      o.footL = [-2 + 1.6 * q * dir, -.8 - Math.max(0, q) * 1.3];
      o.footR = [2 - 1.6 * q * dir, -.8 - Math.max(0, -q) * 1.3];
      o.walk = u * 2 * dir; o.wag = q * .35; o.lean = -.06 * dir;
      o.pawL = [-5.2 + q, -.4 - Math.max(0, q)]; o.pawR = [1 - q, -.4 - Math.max(0, -q)];
    }
    if (move === 'crouch') crouch = smooth(u);
    if (move === 'stand up') crouch = 1 - smooth(u);
    if (move.startsWith('jump')) {
      const air = Math.max(0, Math.sin(Math.PI * Math.max(0, Math.min(1, (u - .12) / .76))));
      crouch = u < .12 ? smooth(u / .12) * .45 : u > .88 ? (1 - smooth((u - .88) / .12)) * .45 : 0;
      lift = h * .35 * air;
      dx = move === 'jump forward' ? h * .22 * smooth(u) : move === 'jump backward' ? -h * .22 * smooth(u) : 0;
      o.footL = [-2, -.8 - 2 * air]; o.footR = [2, -.8 - 3 * air];
      o.fly = air; o.wings = .3 + .6 * air; o.aL = o.aR = 1.5;
    }
    if (attacks.includes(move)) {
      // Guard -> anticipation -> contact -> follow-through -> guard.
      const wind = smooth(u / .22), hit = smooth((u - .22) / .18), recover = smooth((u - .58) / .42);
      const strike = hit * (1 - recover), coil = wind * (1 - hit), heavy = move.includes('heavy');
      const kick = move.includes('kick') || move === 'low sweep';
      o.lean = -.035 - .12 * coil + (heavy ? .21 : .13) * strike;
      if (kick) {
        o.footR = [mix(2, (p.reach || 8) * (heavy ? 1 : .78), strike) - coil, mix(-.8 - hip * .6 * coil, move === 'low sweep' ? -1.5 : -hip * (heavy ? .95 : .65), strike)];
        o.handL = [-4, -sh]; o.handR = [2, -sh + 1];
        o.pawR = [mix(1, 10, strike), mix(-1, -4, strike)];
        o.legR = [mix(3.5, 7, strike), mix(-.2, -3, strike)];
        o.wag = -1.3 * coil + 2.1 * strike; o.rot = -.3 * strike;
        if (move === 'low sweep') crouch = .85;
      } else {
        o.handR = [mix(4 - 3 * coil, p.reach || 8, strike), -sh + (heavy ? -1 : 1) * strike];
        o.handL = [-1, -sh - 1]; o.pawR = [mix(1 - coil, 9, strike), -8];
        o.aR = mix(1.6 * coil + .9 * (1 - coil), 0, strike);
        o.point = strike; o.pointAng = -.2; o.flipFar = -.7 - coil;
        if (p.kind === 'dolphin') o.rot = -(heavy ? .22 : .07) * strike;
        if (p.kind === 'block') angle = (heavy ? .16 : .04) * strike;
      }
      if (move === 'crouching punch') crouch = .9;
      if (move.startsWith('jumping')) lift = h * .3 * Math.sin(Math.PI * u);
      if (move === 'special') {
        power = strike; o.handL = [-3, -sh]; o.handR = [mix(2, (p.reach || 8) * (heavy ? 1 : .78), strike), -sh];
        o.handPoseR = 'palm'; o.power = strike; o.charging = coil > .5; o.holo = id === 'clawd' ? strike : 0;
        o.wings = .25 + .75 * strike; o.flap = strike; o.wag = 1.5 * strike;
        if (id === 'jester_fester' || id === 'jenna') { angle = Math.PI * 2 * smooth((u - .15) / .65); lift = h * .25 * Math.sin(Math.PI * u); }
        if (id === 'sarah') { o.rebellion = strike; o.handR = [5, -sh - 6 * coil]; lift = h * .18 * Math.sin(Math.PI * u); }
      }
    }
    if (move.startsWith('block')) {
      crouch = move.endsWith('low') ? .85 : 0;
      o.handL = [0, -sh - 2]; o.handR = [3, -sh - 3]; o.handPoseL = o.handPoseR = 'palm';
      o.aL = o.aR = 1.6; o.flipNear = -2; o.flipFar = -1.8; o.wings = .65;
      if (move.includes('recoil')) { const recoil = Math.sin(Math.PI * u); dx = -h * .07 * recoil; angle = -.12 * recoil; }
    }
    if (move.startsWith('hit')) {
      const recoil = Math.sin(Math.PI * u);
      dx = -h * .12 * recoil; angle = (move === 'hit body' ? .22 : -.22) * recoil;
      o.eyes = 'closed'; o.mouth = 'o'; o.handL = [-4, -sh + 3]; o.handR = [4, -sh + 3];
      if (move === 'hit low') crouch = .6 * recoil;
      if (move === 'hit air') { lift = h * .22 * recoil; angle = -.6 * recoil; }
    }
    if (['knockdown', 'grounded', 'get up', 'defeat'].includes(move)) {
      const k = move === 'knockdown' ? smooth(u) : move === 'get up' ? 1 - smooth(u) : 1;
      angle = -Math.PI / 2 * k; dx = -h * .15 * k;
      lift = move === 'knockdown' ? h * .16 * Math.sin(Math.PI * u) : 0;
      o.eyes = k > .5 ? 'closed' : 'open'; o.mouth = 'flat'; o.handL = [-3, -sh + 3]; o.handR = [4, -sh + 2];
    }
    if (move === 'victory') {
      o.handL = [-4, -sh - 4]; o.handR = [5, -sh - 5]; o.eyes = 'happy'; o.mouth = 'grin';
      o.aL = o.aR = 1.5; o.flipNear = -2; o.flipFar = -2; o.wings = .9;
      lift = h * .04 * Math.abs(bob);
    }
    o.sq = .3 * crouch; o.dy += hip * .22 * crouch;
    if (p.kind === 'dolphin') { o.sit = .8 - .5 * crouch; o.dy = 0; }
    if (p.kind === 'block') o.dy = 0;
    return { options: o, lift, dx, angle, power, progress: u };
  }

  function draw(move, x, y, s, seconds, { facing = 1, loop = false, ...overrides } = {}) {
    const duration = durations[move];
    if (!duration) throw new Error('Unknown fighting move: ' + move);
    const u = loop ? ((seconds % duration) + duration) % duration / duration : Math.max(0, Math.min(1, seconds / duration));
    const state = sample(move, u), o = { ...state.options, ...overrides, t: seconds, noShadow: true };
    X.save();
    try {
      X.translate(x, y); X.scale(facing < 0 ? -1 : 1, 1);
      ellipse(0, .3 * s, p.h * .17 * s, .5 * s, { fill: 'rgba(35,25,45,.18)', stroke: null });
      X.translate(state.dx * s, -state.lift * s);
      // Rotate around the body centre and lower a fallen fighter onto the floor.
      const angle = state.angle, centre = p.h * .45, fall = Math.abs(Math.sin(angle));
      X.translate(0, -centre * s + fall * (centre - p.h * .18) * s);
      X.rotate(angle); X.translate(0, centre * s);
      // Dragon's native silhouette looks left; normalize every fighter to face right.
      if (p.kind === 'dragon') {
        const lead = o.pawR, rear = o.pawL;
        o.pawL = [-lead[0], lead[1]]; o.pawR = [-rear[0], rear[1]];
      }
      const anchors = entry.draw(0, 0, s, { ...o, flip: p.kind === 'dragon' });
      if (state.power > .01) {
        const k = state.power, origin = anchors.handR || anchors.flipper || anchors.mouth || anchors.head;
        // Anchors are screen coordinates; draw the effect in canvas coordinates.
        X.save(); X.resetTransform();
        const dir = facing < 0 ? -1 : 1;
        ellipse(origin[0] + dir * p.h * s * .22 * k, origin[1], p.h * s * .15 * k, p.h * s * .09 * k,
          { fill: p.color, stroke: '#FFFFFF', lwPx: 2 });
        X.restore();
      }
      return anchors;
    } finally { X.restore(); }
  }
  // Allow room for airborne poses, extended attacks and a horizontal knockdown.
  entry.size = [Math.max(entry.size[0], p.h * 1.2), Math.max(entry.size[1], p.h * 1.45)];
  entry.fighting = { durations, attacks, special: p.special, sample, draw };
  for (const move of Object.keys(durations)) {
    entry.poses['fight: ' + move] = (x, y, s, t) => draw(move, x, y, s, t, { loop: true });
  }
})();
