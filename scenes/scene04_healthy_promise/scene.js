// scenes/scene04_healthy_promise: "I promise… every day!"  (54.5 s; synopsis, script, shot list: README.md)
// Safadi walks Alma to Dove Creek Elementary and explains why healthy food matters. She resists, he finds the argument that
// works (energy to dance!), she promises, twirls and skips inside. He nearly eats her lollipop… "…Tomorrow."
(() => {
  const D = LOCATIONS.dces, SU = SAFADI_UNIT, AU = ALMA_UNIT;
  const SZ = 2105, AZ = 2085;                                     // sidewalk depths: Safadi, Alma (she walks nearer the kerb)
  const ENTR = { A: [-15, 2215], S: [85, 2200], door: [-40, 2520] };

  // ---------- the walk: group centre X along the sidewalk; cruise, then ease to a stop at 16.5 ----------
  const X0 = -2500, X1 = -1100, CRUISE = 15, STOP = 1.5, V = (X1 - X0) / (CRUISE + STOP / 2);
  const gx = t => { if (t < CRUISE) return X0 + V * t; const d = Math.min(t - CRUISE, STOP); return X0 + V * CRUISE + V * (d - d * d / (2 * STOP)); };
  const walkK = t => t < CRUISE ? 1 : clamp(1 - (t - CRUISE) / STOP);

  // ---------- lines: [start, who ('S' | 'A'), text, callout options] ----------
  const LINES = [
    [4.5, 'S', 'Alma... is that *candy* for breakfast?', {}],
    [9.0, 'A', "Yep! It's the *best*!", {}],
    [12.2, 'S', 'May I... *explain* something?', {}],
    [15.2, 'A', 'Uh-oh. An explanation.', { hold: 1.2 }],
    [17.0, 'S', 'Your body is like a car. Food is the *fuel*. Fruits and veggies are *super fuel*!', { maxW: 640, hold: 1.8, dx: 360, dy: -330 }],
    [24.3, 'A', 'But broccoli tastes like... *trees*!', { hold: 1.4 }],
    [28.4, 'S', 'Candy gives you a quick *zoom*... then a big *crash*.', { maxW: 560, hold: 2.2 }],
    [34.2, 'A', 'Hmmm...', { kind: 'think', hold: 1.0 }],
    [36.3, 'S', 'But healthy food gives you energy to *dance*... *all day long*!', { maxW: 600, hold: 1.4, dx: 380, dy: -300 }],
    [41.2, 'A', 'Dance... *ALL DAY*?!', { kind: 'shout', hold: .6, cps: 22, dx: -420, dy: -260 }],
    [43.9, 'A', 'Okay! I *promise* to eat healthy food... *every day*!', { maxW: 560, hold: 1.0 }],
    [49.6, 'A', 'Bye!', { hold: .7, dx: -200, dy: -150 }],
    [52.2, 'S', '...Tomorrow.', { hold: 1.2, dx: 330, dy: -220 }],
  ];
  const DEF = { S: { dx: 330, dy: -250, size: 52, maxW: 600 }, A: { dx: -330, dy: -220, size: 52, maxW: 560 } };
  const talking = (who, t) => LINES.some(([t0, w, txt, o]) => { if (w !== who) return false; const n = (t - t0 - .2) * (o.cps ?? 18); return n > 0 && n < txt.replace(/\*/g, '').length; });

  // =====================================================================================
  // Acting: each character's pose over the whole scene (so a pose carries across cuts). Returns { x, z, o, lolly }.
  function safadiPose(t) {
    const flap = rest => lipFlap(t, talking('S', t), rest);
    if (t < 43) {
      const o = { ...safadiWalk((gx(t) - X0) / 58, walkK(t)), turn: -.35, lookX: -.6, lookY: .35, mouth: flap('smile') };
      if (t > 4.3 && t < 8.6) o.brows = 'up';
      if (t > 12.0 && t < 15.5) {                                         // "May I explain?" a raised index finger
        const r = ease(seg(t, 12.2, 12.6)) * (1 - ease(seg(t, 14.8, 15.3)));
        o.handR = mixPt(o.handR, [4.8, -13.8], r); if (r > .5) o.handPoseR = 'point'; o.brows = 'up';
      }
      if (t > 16.7 && t < 24.5) {                                         // powers on: the healthy plate
        const pw = ease(seg(t, 16.9, 17.6)) * (1 - .6 * ease(seg(t, 23.4, 24.2))), r = ease(seg(t, 17.1, 17.6));
        Object.assign(o, { power: pw, eyes: pw > .5 ? 'glow' : 'open', turn: lerp(-.35, .1, r), lookX: lerp(-.6, .3, r), lookY: lerp(.35, 0, r), brows: 'up',
          handR: mixPt(o.handR, [5.7, -13.8], r), handL: mixPt(o.handL, [-4.6, -11.4], r), handPoseR: r > .3 ? 'palm' : 'open', handPoseL: r > .3 ? 'palm' : 'open' });
      }
      if (t > 28 && t < 36) {                                             // the crash graph above them
        const r = ease(seg(t, 28.2, 28.7)) * (1 - ease(seg(t, 33.4, 33.9)));
        Object.assign(o, { power: .6 * ease(seg(t, 28.1, 28.6)), turn: -.25, lookX: t > 34.2 ? -.6 : -.3, lookY: t > 34.2 ? .35 : -.2, brows: 'up',
          handR: mixPt(o.handR, [5.3, -15.4], r), handPoseR: r > .3 ? 'palm' : 'open' });
      }
      if (t > 36 && t < 41) {                                             // the idea: energy to dance
        const r = ease(seg(t, 36.4, 36.8)) * (1 - ease(seg(t, 40.2, 40.7)));
        Object.assign(o, { bulb: clamp((t - 36.3) / .25) * (1 - seg(t, 40.4, 40.8)), power: .35, turn: .05, lookX: .1, lookY: 0,
          eyes: t < 36.9 ? 'wide' : 'open', brows: 'up', handR: mixPt(o.handR, [5.8, -21.4], r), handPoseR: r > .3 ? 'point' : 'open', mouth: flap('grin') });
      }
      if (t >= 41) Object.assign(o, { mouth: 'grin', brows: 'up' });
      return { x: gx(t) + 125, z: SZ, o, lolly: null };
    }
    const [x, z] = ENTR.S, rest = [[-4.4, -8.1], [4.4, -8.1]];
    if (t < 50.5) {                                                       // at the entrance: receives the lollipop, watches her go
      const reach = ease(seg(t, 43.2, 43.7)) * (1 - .6 * ease(seg(t, 44.1, 44.6)));
      const o = { turn: -.3, lookX: -.5, lookY: .3, brows: 'up', mouth: flap('smile'),
        handL: mixPt(rest[0], [-5.2, -9.5], reach), handPoseL: t > 43.6 ? 'fist' : 'open', handR: rest[1] };
      if (t > 46.6 && t < 48.2) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
      if (t > 48.2) Object.assign(o, { lookX: -.25, lookY: -.3, turn: -.2 });
      if (t > 49.4) { const w = ease(seg(t, 49.4, 49.7)); Object.assign(o, { handR: mixPt(rest[1], [5.1, -13.3 + .5 * wob(t, 2.2)], w), handPoseR: 'palm' }); }
      return { x, z, o, lolly: t > 43.9 ? { hand: 'handL', ang: -.15 } : null };
    }
    // alone with the lollipop: lift it toward his mouth… freeze… to camera… wink
    const lift = ease(seg(t, 51.0, 51.7)), lower = ease(seg(t, 52.0, 52.45)), to = ease(seg(t, 51.85, 52.15));
    const o = {
      handL: rest[0], handR: mixPt(mixPt([4.4, -11.2], [4.9, -17.1], lift), [4.7, -12.4], lower), handPoseR: 'fist',
      turn: lerp(.2, 0, to), lookX: lerp(.45, 0, to), lookY: lerp(.1, 0, to),
      eyes: t < 51.0 ? 'open' : t < 51.8 ? 'narrow' : t < 52.45 ? 'wide' : 'wink',
      brows: t < 51.0 ? 'quizzical' : t < 52.45 ? 'up' : 'quizzical',
      mouth: t < 51.0 ? 'smirk' : t < 51.8 ? 'o' : t < 52.2 ? 'flat' : flap('smirk'),
      dy: -.3 * kick(t, 51.8, 8), blink: t > 52.45 ? 0 : undefined,
    };
    return { x, z, o, lolly: { hand: 'handR', ang: lerp(lerp(.1, -1.1, lift), .1, lower) } };
  }

  function almaPose(t) {
    const flap = rest => lipFlap(t, talking('A', t), rest);
    const hold = [3.4, -5.4];                                             // where she carries the lollipop (candy beside her head)
    let ang = .5;
    if (t < 43) {
      const sk = almaSkip((gx(t) - X0) / 44, walkK(t));
      const o = { ...sk, handR: hold, handPoseR: 'fist', turn: .35, lookX: .6, lookY: -.5, mouth: flap('smile') };
      // a big proud lick
      const lick = ease(seg(t, 8.2, 8.5)) * (1 - ease(seg(t, 8.95, 9.2)));
      if (lick > 0) { o.handR = mixPt(hold, [1.4, -6.3], lick); ang = lerp(.5, -.2, lick); o.eyes = 'happy'; o.mouth = 'open'; o.lookX = .2; }
      if (t > 9.0 && t < 11) Object.assign(o, { eyes: 'happy', mouth: flap('grin'), brows: 'up' });
      if (t > 15.1 && t < 17) Object.assign(o, { lookY: t < 15.9 ? -1 : -.5, lookX: t < 15.9 ? -.2 : .6, brows: 'worried', mouth: flap('flat'), tilt: -.08 });
      if (t > 16.9 && t < 24) Object.assign(o, { brows: 'worried', mouth: t > 21 ? 'smirk' : 'flat', lookX: .6, lookY: -.6 });
      if (t > 22.8 && t < 28.6) {                                         // arms crossed, pouting
        const c = ease(seg(t, 22.8, 23.4)) * (1 - ease(seg(t, 28.1, 28.6)));
        Object.assign(o, { handL: mixPt(o.handL, [1.3, -6.9], c), handR: mixPt(hold, [-1.2, -6.4], c), handPoseL: 'fist' });
        ang = lerp(.5, -.95, c);
        if (t > 23.8 && t < 28.1) Object.assign(o, { turn: -.25, lookX: -.7, lookY: 0, brows: 'angry', mouth: flap('frown'), tilt: -.1 });
      }
      if (t > 28.1 && t < 36) {                                           // the crash: her lollipop droops with the graph
        Object.assign(o, { lookX: .45, lookY: -.85, brows: t > 30.8 ? 'worried' : 'normal', mouth: t > 31 && t < 33.2 ? 'o' : 'flat', dy: .15 * seg(t, 31, 32) });
        ang = kf(t, [[30.8, .5], [32.8, 1.6]]);
        if (t > 34.0) {                                                   // "Hmmm…": hand to chin
          const th = ease(seg(t, 34.0, 34.4));
          Object.assign(o, { handL: mixPt(o.handL, [-.9, -11.0], th), handPoseL: 'fist', lookX: -.5, lookY: -.9, tilt: .1 * th, brows: 'normal', mouth: flap('smirk') });
        }
      }
      if (t > 36 && t < 41) {                                             // listening… then perks up at "dance"
        const perk = t > 38.6;
        Object.assign(o, { lookX: .6, lookY: -.6, brows: perk ? 'up' : 'normal', eyes: perk ? 'wide' : 'open', mouth: perk ? 'o' : 'flat', jump: .6 * kick(t, 38.6, 6) });
        ang = kf(t, [[36, 1.6], [38.6, 1.6], [38.9, .5]], backOut);
      }
      if (t > 41) {                                                       // star eyes: "Dance… ALL DAY?!"
        const pop = t > 41.15;
        Object.assign(o, { eyes: pop ? 'star' : 'squeeze', mouth: flap('grin'), brows: 'up', lookX: 0, lookY: 0, turn: .1,
          handL: [-1.1, -11.4], handPoseL: 'palm', handR: [4.1, -9.6], jump: .9 * kick(t, 41.15, 5), sq: -.08 * kick(t, 41.15, 6), hairSwing: .3 * boing(t, 41.15, 2, 4) });
        ang = .65;
      }
      return { x: gx(t) - 125, z: AZ, o, lolly: { hand: 'handR', ang } };
    }
    // at the entrance
    let [x, z] = ENTR.A;
    const base = { turn: .3, lookX: .5, lookY: -.5, mouth: flap('grin'), brows: 'up' };
    if (t < 43.9) {                                                       // hands him the lollipop
      const r = ease(seg(t, 43.1, 43.6));
      return { x, z, o: { ...base, handR: mixPt(hold, [5.2, -8.6], r), handPoseR: 'fist' }, lolly: { hand: 'handR', ang: lerp(.5, .1, r) } };
    }
    if (t < 46.6) {                                                       // the promise: hand on heart, other hand up
      const r = ease(seg(t, 43.9, 44.3));
      return { x, z, o: { ...base, handR: mixPt([5.2, -8.6], [.9, -7.1], r), handPoseR: 'palm', handL: mixPt([-3.4, -4.9], [-4.8, -11.6], r), handPoseL: 'palm',
        eyes: t > 45.8 ? 'happy' : 'open', lookX: .3, lookY: -.2 }, lolly: null };
    }
    if (t < 48.2) {                                                       // super-dance twirl
      const pw = ease(seg(t, 46.6, 46.9)) * (1 - ease(seg(t, 47.8, 48.15)));
      return { x, z, o: { ...almaDance(t, 'twirl', { bpm: 112 }), spin: TAU * 2 * ease(seg(t, 46.7, 47.9)), power: pw, eyes: 'star', mouth: 'grin' }, lolly: null };
    }
    // skips to the door (back to camera), turns and waves
    const f = ease(seg(t, 48.2, 49.4)), d = Math.hypot(ENTR.door[0] - x, ENTR.door[1] - z) * f;
    x = lerp(x, ENTR.door[0], f); z = lerp(z, ENTR.door[1], f);
    const turnBack = ease(seg(t, 49.35, 49.65));
    const o = { ...almaSkip(d / 44, 1 - seg(t, 49.2, 49.4)), spin: Math.PI * ease(seg(t, 48.2, 48.4)) + Math.PI * turnBack, mouth: flap('grin'), eyes: 'happy' };
    if (t > 49.5) Object.assign(o, { handR: [4.4 + .5 * wob(t, 2.4), -12.2], handPoseR: 'palm', eyes: 'open', lookX: .3, lookY: 0 });
    return { x, z, o, lolly: null };
  }

  // =====================================================================================
  // One frame through camera c: set (soft when close), both characters depth sorted, props, then overlays and speech.
  function frame(t, c, over) {
    const P = persp(c), S = safadiPose(t), A = almaPose(t), near = Math.min(S.z, A.z);
    layer(() => D.back(P, t, { splitZ: near - 1 }), { blur: clamp((P.k(near) - 1.8) * 1.3, 0, 4) });
    const put = { S: () => draw(P, S, SU, safadi), A: () => draw(P, A, AU, alma) }, who = {};
    (S.z > A.z ? ['S', 'A'] : ['A', 'S']).forEach(w => who[w] = put[w]());
    D.front(P, t, { splitZ: near - 1 });
    over?.(P, who);
    for (const [t0, w, txt, o] of LINES) {
      const a = who[w]; if (!a || a.A.head[0] < -60 || a.A.head[0] > W + 60) continue;
      const anchor = w === 'S' ? [a.A.head[0] + 4.6 * a.s, a.A.head[1] + 2.2 * a.s] : [a.A.head[0] - 6 * a.s, a.A.head[1] + 1.6 * a.s];
      callout(txt, anchor[0], anchor[1], t - t0, { ...DEF[w], ...o });
    }
    return who;
  }
  function draw(P, ch, unit, rig) {
    const [sx, sy, k] = P.p(ch.x, 0, ch.z), s = unit * k, A = rig(sx, sy, s, ch.o);
    if (ch.lolly) almaLollipop(A[ch.lolly.hand][0], A[ch.lolly.hand][1], AU * k, { ang: ch.lolly.ang });
    return { A, s };
  }
  // hy solved so feet at depth z sit at screen y feetY
  const cam = (x, y, z, feetZ, feetY, f = 1000) => ({ x, y, z, f, hy: feetY - y * f / (feetZ - z) });

  // ---------- shots ----------
  const establish = t => frame(t, { x: kf(t, [[0, -950], [4, -760]]), y: 240, z: 350, f: 1000, hy: 560 });
  const walkTalk = t => frame(t, cam(gx(t) + 30, 115, 1680, 2095, 905));
  const explainPlate = t => frame(t, cam(-855, 150, kf(t, [[16.9, 1830], [24, 1850]]), SZ, 1120), (P, who) =>
    safadiBoard(1390, 600, 560, seg(t, 18.3, 21.8), t, { kind: 'plate', title: 'SUPER FUEL' }));
  const trees = t => frame(t, cam(-1305, 80, kf(t, [[24, 1855], [28, 1870]]), AZ, 1040));
  const crash = t => frame(t, cam(-1100, 120, 1600, 2095, 930), (P, who) =>
    safadiBoard(960, 285, 560, seg(t, 28.8, 32.6), t, { kind: 'crash', title: 'ENERGY' }));
  const dance = t => frame(t, cam(-855, 150, kf(t, [[36, 1840], [41, 1860]]), SZ, 1120));
  const stars = t => frame(t, cam(-1265, 90, kf(t, [[41, 1915], [43, 1940]], easeOut), AZ, 975));
  const promise = t => frame(t, cam(kf(t, [[43, 30], [48.2, 30], [49.6, -10]]), 125, kf(t, [[43, 1835], [48.2, 1850], [49.6, 1760]]), 2207, 985));
  function tomorrow(t) {
    const who = frame(t, cam(30, 150, kf(t, [[50.5, 1900], [54.5, 1935]]), ENTR.S[1], 1110));
    const h = who.S.A.head; iris(h[0], h[1], lerp(1500, 0, easeIn(seg(t, 53.4, 54.5))));
  }

  scene({ duration: 54.5, fps: 24, bpm: 112,                  // id, title, audio: see asset.js
    shots: [[0, establish], [4, walkTalk], [16.9, explainPlate], [24, trees], [28, crash], [36, dance], [41, stars], [43, promise], [50.5, tomorrow]] });
})();
