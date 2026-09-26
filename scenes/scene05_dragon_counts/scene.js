// Scene 05: Safadi teaches Alma to observe the +3 pattern in multiplication.
// Dragon watches from the throne-room columns and accidentally supplies rows five and six.
(() => {
  const R = LOCATIONS.throne_room, Z = 1650, DZ = 2050;
  const POS = { alma: -185, safadi: 185, dragon: 465 };
  const ROOM = { splitZ: Z - 1, beams: .75 };
  const BOARD = { x: 960, y: 430, w: 680, h: 520, row0: 270, step: 56 };
  const bx = col => 800 + col * 94;
  const by = row => BOARD.row0 + row * BOARD.step;

  // All lines are short enough to stay beside their speaker and clear of the board.
  const LINES = [
    [0.8, 'A', 'Four times three? I keep losing count.', { hold: 1.8 }],
    [7.2, 'S', 'Look for a *pattern*. Each row has three.', { hold: 1.5 }],
    [15.0, 'A', 'Three, six, nine, twelve! Four groups of three make twelve.', { cps: 21, hold: 1.8 }],
    [27.0, 'A', 'Dragon added one more group!', { hold: 1.6 }],
    [31.0, 'A', 'Twelve plus three is fifteen.', { hold: 1.4 }],
    [35.0, 'S', 'Exactly. Five groups of three make fifteen.', { cps: 21, hold: 1.5 }],
    [45.0, 'A', 'And the next answer is eighteen!', { hold: 1.4 }],
    [49.2, 'S', "One more group adds three. That's the pattern!", { cps: 21, hold: 1.2 }],
  ];
  const speaking = (who, t) => LINES.some(([start, w, txt, o]) => {
    if (w !== who) return false;
    const n = (t - start - .2) * (o.cps ?? 18);
    return n > 0 && n < txt.replace(/\*/g, '').length;
  });

  const camWide = t => {
    const z = kf(t, [[0, 640], [7, 850]]), y = 170, k = 1000 / (Z - z);
    return { x: kf(t, [[0, -35], [7, 0]]), y, z, f: 1000, hy: 965 - y * k };
  };
  const camLesson = t => {
    const z = kf(t, [[7, 1300], [55, 1330]]), y = 115, k = 1000 / (Z - z);
    return { x: 10 * wob(t, .04), y, z, f: 1000, hy: 1005 - y * k };
  };
  const put = (P, x, y, z, unit, rig, o) => {
    const [sx, sy, k] = P.p(x, y, z), s = unit * k;
    return { A: rig(sx, sy, s, o), s, sx, sy };
  };

  function almaPose(t) {
    const o = { turn: .35, lookX: .55, lookY: -.45, brows: t < 7 ? 'worried' : 'normal',
      mouth: lipFlap(t, speaking('A', t), t < 14 ? 'flat' : 'smile'),
      handL: [-1.1, -10.8], handPoseL: 'fist', handR: [3.5, -6.1], handPoseR: 'palm' };
    if (t >= 7) { o.handL = [-3.5, -6.5]; o.handPoseL = 'open'; o.lookX = .85; o.lookY = -.8; }
    if (t >= 14 && t < 23.5) {
      const beat = Math.floor(clamp((t - 15) / 1.75, 0, 3));
      o.handR = [4.9, -11.6 - beat * .45]; o.handPoseR = 'point';
      o.jump = .45 * Math.pow(Math.sin(Math.PI * frac((t - 15) / 1.75)), 6);
      o.mouth = lipFlap(t, speaking('A', t), 'grin');
    }
    if (t >= 23.5 && t < 31) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: lipFlap(t, speaking('A', t), 'o'), handR: [4.9, -12], handPoseR: 'point', lookX: .95 });
    if (t >= 31 && t < 40) Object.assign(o, { eyes: 'happy', brows: 'up', mouth: lipFlap(t, speaking('A', t), 'grin'), handL: [-4.3, -10.5], handR: [4.3, -10.5], handPoseL: 'palm', handPoseR: 'palm' });
    if (t >= 40 && t < 49) Object.assign(o, { eyes: t > 44 ? 'wide' : 'open', brows: 'up', mouth: lipFlap(t, speaking('A', t), 'grin'), handR: [4.8, -11.2], handPoseR: 'point', jump: .7 * kick(t, 45, 5) });
    if (t >= 49) Object.assign(o, { eyes: 'happy', brows: 'up', mouth: 'grin', handL: [-2.0, -10.8], handR: [2.0, -10.8], handPoseL: 'fist', handPoseR: 'fist', jump: .35 * Math.abs(wob(t, 2.3)) });
    return o;
  }

  function safadiPose(t) {
    const o = { turn: -.35, lookX: -.55, lookY: .25, brows: 'up',
      mouth: lipFlap(t, speaking('S', t), 'smile'), handL: [-4.4, -8.1], handR: [4.4, -8.1] };
    if (t >= 7 && t < 23.5) Object.assign(o, { power: ease(seg(t, 7.0, 8.0)) * .65, lookX: -.8, lookY: -.65,
      handL: [-5.8, -21.4], handPoseL: 'point', handR: [5.2, -12.5], handPoseR: 'palm' });
    if (t >= 23.5 && t < 31) Object.assign(o, { eyes: 'wide', power: .35, lookX: -.95, lookY: -.55, handL: [-5.2, -12.0], handPoseL: 'palm', mouth: 'o' });
    if (t >= 31 && t < 40) Object.assign(o, { power: .6, handL: [-5.3, -13.0], handR: [5.3, -13.0], handPoseL: 'palm', handPoseR: 'palm', mouth: lipFlap(t, speaking('S', t), 'grin') });
    if (t >= 40 && t < 49) Object.assign(o, { lookX: -.7, lookY: -.9, eyes: t > 43 ? 'wide' : 'open', power: .3, handL: [-5.8, -21.4], handPoseL: 'point' });
    if (t >= 49) Object.assign(o, { power: .35, eyes: 'happy', handL: [-5.0, -13.3], handR: [5.0, -13.3], handPoseL: 'palm', handPoseR: 'palm', mouth: lipFlap(t, speaking('S', t), 'grin') });
    return o;
  }

  function dragonPose(t) {
    const landing = ease(seg(t, 49.6, 52.3)), air = 1 - landing;
    const x = lerp(POS.dragon, 560, landing), y = lerp(270, 0, landing);
    const o = { fly: air, wings: lerp(.8, .24, landing), flap: wob(t, t < 40 ? 1.55 : 2.8) * air,
      jump: (2.0 + .6 * wob(t, 1.55)) * air, tailSwing: .5 * wob(t, .6),
      headTilt: t < 23.5 ? -.13 : t < 31 ? .18 : -.08,
      lookX: -.65, lookY: t < 7 ? .55 : -.55,
      eyes: t >= 23.5 && t < 28 ? 'wide' : t >= 49 ? 'happy' : 'open',
      mouth: t >= 23.5 && t < 28 ? 'o' : t >= 45 ? 'grin' : 'smile',
      question: t < 7 ? .9 : 0 };
    if (t < 3.2) o.rot = Math.PI * (1 - ease(seg(t, 1.2, 3.2)));
    if (t >= 40 && t < 49) { o.wings = 1; o.flap = wob(t, 3.0); o.jump += 1.1 * kick(t, 41.4, 3); }
    if (t >= 49) { o.rot = .17 * boing(t, 52.2, 2, 4); o.tailSwing += 2.3 * boing(t, 52.15, 2.2, 3); o.sq = .23 * kick(t, 52.3, 5); }
    return { x, y, z: DZ, o };
  }

  function card(A, t) {
    if (t >= 7) return;
    const x = A.handR[0] + 16, y = A.handR[1] - 37, k = ease(seg(t, 0, .35));
    X.save(); X.translate(x, y); X.rotate(-.08 + .03 * wob(t, .9)); X.scale(k, k);
    X.shadowColor = 'rgba(20,10,15,.25)'; X.shadowBlur = 14;
    shape(rectPts(-70, -46, 140, 92), { fill: '#FFF9E8', stroke: PAL.ink, lwPx: 3 });
    X.shadowBlur = 0; X.fillStyle = PAL.ink; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.font = `700 25px ${FONT_TALK}`; X.fillText('4 × 3 = ?', 0, -4);
    line([[-52, 26], [52, 26]], { stroke: '#D5BDA2', lwPx: 2 }); X.restore();
  }

  function bubble(x, y, r, a = 1) {
    X.save(); X.globalAlpha *= a; X.shadowColor = DR.tealLight; X.shadowBlur = r * .8;
    circle(x, y, r, { fill: rgba(DR.tealLight, .67), stroke: DR.greenDark, lwPx: 3 });
    X.shadowBlur = 0; ellipse(x - r * .32, y - r * .37, r * .25, r * .13, { fill: 'rgba(255,255,255,.88)', stroke: null, rot: -.4 });
    X.restore();
  }

  function travellingBubbles(t, start, end, row, source, a = 1) {
    for (let col = 0; col < 3; col++) {
      const p = ease(seg(t, start + col * .18, end + col * .18));
      if (p <= 0 || p >= 1) continue;
      const x = lerp(source[0], bx(col), p), y = lerp(source[1], by(row), p) - 95 * 4 * p * (1 - p) - 18 * Math.sin(p * Math.PI * 2 + col);
      bubble(x, y, 17 * (1 + .15 * Math.sin(p * Math.PI)), a);
    }
  }

  function chalkText(txt, x, y, px, col = SF.chalk, alpha = 1) {
    X.save(); X.globalAlpha *= alpha; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.font = `700 ${px}px ${SF_CHALK}`; X.fillText(txt, x, y); X.restore();
  }

  function patternBoard(t, D) {
    const fade = ease(seg(t, 7.3, 8.2)) * (1 - ease(seg(t, 53.0, 54.2)));
    if (fade <= 0) return;
    const { x, y, w, h } = BOARD, left = x - w / 2, top = y - h / 2;
    X.save(); X.globalAlpha = fade; X.shadowColor = SF.glow; X.shadowBlur = 22;
    shape(rectPts(left, top, w, h), { fill: linGrad(left, top, left, top + h, [[0, SF.board], [1, SF.boardDk]]), stroke: SF.glow, lwPx: 7 });
    X.shadowBlur = 0;
    shape(rectPts(left + 15, top + 15, w - 30, h - 30), { fill: null, stroke: rgba(SF.glow, .42), lwPx: 2 });
    chalkText('GROUPS OF THREE', x, top + 42, 30, SF.glowGold);
    line([[left + 36, top + 71], [left + w - 36, top + 71]], { stroke: rgba(SF.glow, .5), lwPx: 2 });

    for (let row = 0; row < 6; row++) {
      const reveal = row < 4 ? ease(seg(t, 9.0 + row * .7, 9.55 + row * .7))
        : row === 4 ? ease(seg(t, 26.3, 27.2)) : ease(seg(t, 44.2, 45.1));
      if (reveal <= 0) continue;
      const active = row < 4 ? t >= 15 + row * 1.75 && t < 16.75 + row * 1.75
        : row === 4 ? t >= 31 && t < 40 : t >= 45;
      const yy = by(row), gold = active || (row === 3 && t >= 20 && t < 30) || (row === 4 && t >= 35 && t < 43);
      X.save(); X.globalAlpha *= reveal;
      if (active) { X.fillStyle = rgba(SF.glowGold, .16); X.fillRect(left + 25, yy - 24, w - 50, 48); }
      chalkText(String(row + 1), left + 61, yy, 25, SF.glow);
      for (let col = 0; col < 3; col++) {
        if ((row === 4 && t < 26.6 + col * .18) || (row === 5 && t < 44.4 + col * .18)) continue;
        const popped = row < 4 ? 1 : backOut(seg(t, (row === 4 ? 26.6 : 44.4) + col * .18, (row === 4 ? 26.9 : 44.7) + col * .18));
        X.save(); X.shadowColor = gold ? SF.glowGold : SF.glow; X.shadowBlur = gold ? 17 : 10;
        circle(bx(col), yy, 17 * popped, { fill: gold ? SF.glowGold : row < 4 ? SF.chalk : DR.tealLight, stroke: SF.chalk, lwPx: 2 });
        X.restore();
      }
      if (t >= (row < 4 ? 15 + row * 1.75 : row === 4 ? 30.8 : 44.8)) chalkText(String((row + 1) * 3), left + w - 70, yy, 31, gold ? SF.glowGold : SF.chalk);
      X.restore();
    }
    line([[left + 36, top + h - 69], [left + w - 36, top + h - 69]], { stroke: rgba(SF.glow, .5), lwPx: 2 });
    const eq = t >= 45 ? '6 × 3 = 18' : t >= 35 ? '5 × 3 = 15' : t >= 31 ? '12 + 3 = 15' : '4 × 3 = 12';
    if (t >= 20) chalkText(eq, x, top + h - 35, 42, SF.glowGold, ease(seg(t, 20, 20.6)));
    X.restore();

    // Dragon's additions move in screen space from its mouth to the exact next row.
    if (t >= 23.5 && t < 27.2) travellingBubbles(t, 23.5, 26.5, 4, D.A.mouth, fade);
    if (t >= 41.4 && t < 45) travellingBubbles(t, 41.4, 44.3, 5, D.A.mouth, fade);
    if (t >= 46.5 && t < 52.4) {
      const p = ease(seg(t, 46.5, 47.4));
      for (let i = 0; i < 3; i++) {
        const hx = D.A.head[0] + (i - 1) * D.s * 1.25, hy = D.A.head[1] - D.s * (5.0 + (i % 2) * .8);
        const xx = lerp(bx(i), hx, p), yy = lerp(by(5), hy, p) - 90 * 4 * p * (1 - p);
        bubble(xx, yy, 17 * (1 - .35 * ease(seg(t, 51.7 + i * .12, 52.1 + i * .12))), fade);
      }
    }
  }

  function dialogue(t, actors) {
    for (const [t0, who, txt, opt] of LINES) {
      const a = actors[who];
      const ax = a.A.head[0] + (who === 'A' ? -a.s * 5.2 : a.s * 5.0), ay = a.A.head[1] + a.s * 1.4;
      callout(txt, ax, ay, t - t0, { dx: who === 'A' ? -310 : 310, dy: -205,
        size: who === 'A' ? 44 : 45, maxW: who === 'A' ? 430 : 440, ...opt });
    }
  }

  function frame(t, cam) {
    const P = persp(cam(t));
    layer(() => R.back(P, t, ROOM), { blur: t < 7 ? 0 : 2.4, filter: t < 7 ? '' : 'saturate(.9)' });
    const d = dragonPose(t);
    if (t < 53) {
      const [gx, gy, k] = P.p(d.x, 0, d.z);
      ellipse(gx, gy, 45 * k, 9 * k, { fill: 'rgba(28,35,29,.13)', stroke: null });
    }
    const D = put(P, d.x, d.y, d.z, DRAGON_UNIT, dragon, { ...d.o, noShadow: true });
    const A = put(P, POS.alma, 0, Z, ALMA_UNIT, alma, almaPose(t));
    const S = put(P, POS.safadi, 0, Z, SAFADI_UNIT, safadi, safadiPose(t));
    R.front(P, t, ROOM);
    if (t < 7) card(A.A, t);
    patternBoard(t, D);
    dialogue(t, { A, S });
    if (t >= 50.8) {
      sfx('plop!', D.A.tailTip[0] + 28, D.A.tailTip[1] - 24, 52, PAL.goldLt, t - 52.3, { life: .8 });
      if (t >= 52.0) sfx('pop! pop! pop!', D.A.head[0], D.A.head[1] - D.s * 6.5, 39, DR.tealLight, t - 52.0, { life: 1.1 });
      if (t >= 54.1) iris(D.A.head[0], D.A.head[1], lerp(2200, 0, easeIn(seg(t, 54.1, 55))));
    }
  }

  function question(t) { frame(t, camWide); }
  function showRows(t) { frame(t, camLesson); }
  function countFour(t) { frame(t, camLesson); }
  function dragonAddsFifth(t) { frame(t, camLesson); }
  function fiveGroups(t) { frame(t, camLesson); }
  function dragonAddsSixth(t) { frame(t, camLesson); }
  function patternPayoff(t) { frame(t, camLesson); }

  scene({ duration: 55, fps: 24, bpm: 108,
    shots: [[0, question], [7, showRows], [14, countFour], [23.5, dragonAddsFifth],
      [31, fiveGroups], [40, dragonAddsSixth], [49, patternPayoff]] });
})();
