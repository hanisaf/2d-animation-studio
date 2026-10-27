// Outside Dove Creek Elementary, three different minds find a way into one famous open question.
// The diagrams are teaching sketches, not a proof or a literal plot of zeta's zeros.
(() => {
  const D = LOCATIONS.dces, LINES = ASSETS.scene.scene06_riemann.dialogue;
  const PEOPLE = {
    housam: { x: -355, z: 2140, unit: HOUSAM_UNIT, rig: housam },
    safadi: { x: -35, z: 2190, unit: SAFADI_UNIT, rig: safadi },
    alma: { x: 295, z: 2140, unit: ALMA_UNIT, rig: alma },
  };
  const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  const CHALK = '#FFF9E8', CYAN = '#8CE8F2', GOLD = '#FFE18A', INK = '#17342E';
  const BOARD = { x: 1450, y: 405, w: 700, h: 555 };

  function speaking(who, t) {
    return LINES.some(line => {
      if (line.speaker !== who) return false;
      const pos = (t - line.at - .2) * (line.cps ?? 18);
      return pos > 0 && pos < line.text.replace(/\*/g, '').length;
    });
  }

  function safadiPose(t) {
    const lesson = t >= 8 && t < 95, puzzled = t >= 43 && t < 55, joy = t >= 94;
    const o = { turn: -.1, lookX: .2, lookY: lesson ? -.35 : .15, brows: 'up',
      mouth: lipFlap(t, speaking('safadi', t), 'smile', ['smile', 'open', 'o', 'smile']),
      handL: [-4.6, -10.2], handPoseL: 'palm', handR: lesson ? [5.6, -15.5] : [4.4, -8.1],
      handPoseR: lesson ? 'point' : 'open', power: lesson ? .32 + .12 * Math.sin(t * .16) : .08 };
    if (puzzled) Object.assign(o, { power: .12, turn: -.35, lookX: -.7, lookY: .35, handR: [5.1, -10.4], handPoseR: 'palm', brows: 'quizzical', tilt: .06 });
    if (t >= 50.6 && t < 58) Object.assign(o, { bulb: ease(seg(t, 50.6, 51.1)) * (1 - ease(seg(t, 57, 58))), power: .44 });
    if (t >= 66 && t < 83) Object.assign(o, { power: .62, handR: [5.8, -20.2], handPoseR: 'point', lookX: .8, lookY: -.7 });
    if (joy) Object.assign(o, { power: .6, eyes: 'happy', handL: [-5.5, -13.4], handR: [5.5, -13.4], handPoseL: 'palm', handPoseR: 'palm', mouth: lipFlap(t, speaking('safadi', t), 'grin') });
    return o;
  }

  function housamPose(t) {
    const o = { turn: .28, lookX: .5, lookY: -.4, brows: t < 43 ? 'focused' : 'worried',
      mouth: lipFlap(t, speaking('housam', t), t < 58 ? 'smile' : 'grin', ['smile', 'open', 'grin', 'o']),
      handL: [-4.2, -12.1], handR: [4.1, -12.0] };
    if (t >= 15 && t < 21) Object.assign(o, { ...housamDribble(t * 1.3, .35), eyes: 'wide', mouth: lipFlap(t, speaking('housam', t), 'smirk') });
    if (t >= 32 && t < 39) Object.assign(o, { handR: [4.5, -21.5], handPoseR: 'point', brows: 'focused', lookX: .85, lookY: -.75 });
    if (t >= 43 && t < 55) Object.assign(o, { handR: [1.1, -21.2], handPoseR: 'fist', brows: 'worried', eyes: 'wide', mouth: lipFlap(t, speaking('housam', t), 'flat') });
    if (t >= 62 && t < 94) Object.assign(o, { handR: [4.7, -22.8], handPoseR: 'point', brows: 'up', lookX: .9, lookY: -.75 });
    if (t >= 94) Object.assign(o, { handR: [4.8, -23], handPoseR: 'point', brows: 'up', eyes: 'happy',
      jump: .35 * Math.max(0, Math.sin((t - 98) * 3.1)), mouth: lipFlap(t, speaking('housam', t), 'grin') });
    return o;
  }

  function almaPose(t) {
    const confused = t >= 40 && t < 55, joy = t >= 94;
    const o = { turn: -.24, lookX: -.35, lookY: -.55, brows: confused ? 'worried' : 'up',
      mouth: lipFlap(t, speaking('alma', t), confused ? 'flat' : 'grin', ['grin', 'open', 'o', 'smile']),
      handL: [-3.4, -7.5], handR: [3.6, -7.2], handPoseL: 'open', handPoseR: 'open',
      hairSwing: .12 * wob(t, .8) };
    if (t >= 8 && t < 16) Object.assign(o, { ...almaDance(t, 'bounce', { bpm: 96, k: .45 }), lookX: -.5,
      mouth: lipFlap(t, speaking('alma', t), 'grin') });
    if (t >= 23 && t < 29) Object.assign(o, { handR: [4.8, -13.2], handPoseR: 'point', eyes: 'wide' });
    if (confused) Object.assign(o, { tilt: -.09, handL: [-1.3, -10.7], handPoseL: 'fist', eyes: 'wide', lookX: -.8, lookY: -.8 });
    if (t >= 71 && t < 78) Object.assign(o, { handR: [4.8, -13.2], handPoseR: 'point', eyes: 'star', jump: .4 * kick(t, 71.2, 4) });
    if (joy) Object.assign(o, { ...almaDance(t, t < 101 ? 'bounce' : 'star jump', { bpm: 112, k: t < 101 ? .7 : .85 }),
      mouth: lipFlap(t, speaking('alma', t), 'grin'), lookX: -.3 });
    return o;
  }

  function camera(t, close = true) {
    const z = close ? 1430 + 16 * Math.sin(t * .035) : 1120 + 28 * Math.sin(t * .03);
    const y = close ? 135 : 175, f = 1000, feetY = close ? 1002 : 990;
    return { x: close === 'final' ? 0 : close ? 245 : 0, y, z, f, hy: feetY - y * f / (2140 - z) };
  }

  function put(P, who, pose, t) {
    const p = PEOPLE[who], [sx, sy, k] = P.p(p.x, 0, p.z), s = p.unit * k;
    const A = p.rig(sx, sy, s, pose);
    if (who === 'housam') {
      if (t < 39 || t >= 95) housamBall(sx + 4.5 * s, sy - 1.45 * s, s, { spin: t * .6 });
      if (t >= 39 && t < 95) housamNotebook(A.handL[0] - .1 * s, A.handL[1] - 1.3 * s, s);
    }
    return { A, sx, sy, s };
  }
  function chalk(text, x, y, size = 32, color = CHALK, align = 'center') {
    X.save(); X.fillStyle = color; X.textAlign = align; X.textBaseline = 'middle';
    X.font = `700 ${size}px ${SF_CHALK}`; X.fillText(text, x, y); X.restore();
  }
  function boardShell(title, t, start, end) {
    const opacity = ease(seg(t, start, start + .65)) * (1 - ease(seg(t, end - .6, end)));
    if (opacity <= .01) return false;
    const { x, y, w, h } = BOARD, l = x - w / 2, top = y - h / 2;
    X.save(); X.globalAlpha *= opacity;
    X.shadowColor = CYAN; X.shadowBlur = 24;
    shape(rectPts(l, top, w, h), { fill: linGrad(l, top, l, top + h, [[0, SF.board], [1, SF.boardDk]]), stroke: CYAN, lwPx: 6 });
    X.shadowBlur = 0;
    shape(rectPts(l + 15, top + 15, w - 30, h - 30), { fill: null, stroke: 'rgba(140,232,242,.38)', lwPx: 2 });
    chalk(title, x, top + 51, 35, GOLD);
    line([[l + 34, top + 80], [l + w - 34, top + 80]], { stroke: CYAN, lwPx: 2 });
    return true;
  }
  function primeBoard(t) {
    if (!boardShell('THE PRIME RHYTHM', t, 8, 26)) return;
    const left = BOARD.x - BOARD.w / 2;
    for (let n = 1; n <= 30; n++) {
      const col = (n - 1) % 10, row = Math.floor((n - 1) / 10), x = left + 58 + col * 65, y = 310 + row * 88;
      const prime = PRIMES.includes(n), lit = prime && t >= 9.0 + PRIMES.indexOf(n) * .7;
      circle(x, y, 24, { fill: lit ? GOLD : prime ? 'rgba(255,225,138,.12)' : 'rgba(255,255,255,.08)', stroke: prime ? GOLD : 'rgba(255,255,255,.22)', lwPx: lit ? 3 : 1.5 });
      chalk(String(n), x, y + 2, 25, lit ? INK : CHALK);
    }
    chalk('No fixed beat between primes', BOARD.x, 625, 27, CYAN);
    X.restore();
  }
  function countBoard(t) {
    if (!boardShell('COUNTING PRIMES', t, 26, 39)) return;
    const x0 = 1195, y0 = 577, width = 505, height = 275;
    line([[x0, y0 - height], [x0, y0], [x0 + width, y0]], { stroke: CHALK, lwPx: 3 });
    chalk('n', x0 + width + 18, y0 + 7, 25, CHALK);
    chalk('count', x0 - 12, y0 - height - 25, 24, CHALK);
    const xp = n => x0 + (n - 1) / 29 * width, yp = count => y0 - count / 10 * height;
    const upto = Math.max(2, Math.min(30, Math.floor(2 + ease(seg(t, 27.2, 33.6)) * 28)));
    const steps = [[xp(1), yp(0)]];
    for (let n = 2; n <= upto; n++) {
      const before = PRIMES.filter(p => p < n).length, after = before + (PRIMES.includes(n) ? 1 : 0);
      steps.push([xp(n), yp(before)], [xp(n), yp(after)]);
    }
    line(steps, { stroke: GOLD, lwPx: 5 });
    if (t >= 29.5) {
      const curve = []; for (let n = 2; n <= 30; n += .4) curve.push([xp(n), yp(.65 + 9.15 * ((n - 1) / 29) ** .77)]);
      line(curve, { stroke: CYAN, lwPx: 4, smooth: true });
    }
    chalk('step count', 1300, 625, 25, GOLD);
    chalk('smooth trend (sketch)', 1583, 625, 25, CYAN);
    X.restore();
  }
  function zetaBoard(t) {
    if (!boardShell('A NEW LENS: ZETA', t, 39, 55)) return;
    const fade = ease(seg(t, 39.7, 41.8));
    X.save(); X.globalAlpha *= fade;
    chalk('whole numbers', 1265, 265, 27, CYAN);
    for (let i = 0; i < 6; i++) {
      const x = 1175 + i * 48, y = 375 + 24 * Math.sin(i * 1.2);
      circle(x, y, 22, { fill: 'rgba(140,232,242,.16)', stroke: CYAN, lwPx: 2 });
      chalk(String(i + 1), x, y, 22);
    }
    line([[1470, 375], [1550, 375], [1534, 362], [1550, 375], [1534, 388]], { stroke: GOLD, lwPx: 5 });
    circle(1630, 375, 88, { fill: 'rgba(255,225,138,.15)', stroke: GOLD, lwPx: 5 });
    chalk('ζ(s)', 1630, 378, 56, GOLD);
    chalk('a mathematical machine', BOARD.x, 550, 29, CHALK);
    chalk('that helps study prime patterns', BOARD.x, 602, 27, CYAN);
    X.restore(); X.restore();
  }
  function stripBoard(t) {
    if (!boardShell('THE QUESTION', t, 55, 95)) return;
    const xs = [1240, 1450, 1660], yTop = 275, yBottom = 575;
    X.save(); X.globalAlpha *= ease(seg(t, 55.4, 57.5));
    shape(rectPts(xs[0], yTop, xs[2] - xs[0], yBottom - yTop), { fill: 'rgba(140,232,242,.09)', stroke: CYAN, lwPx: 2 });
    for (let i = 0; i < 3; i++) {
      line([[xs[i], yTop], [xs[i], yBottom]], { stroke: i === 1 ? GOLD : CYAN, lwPx: i === 1 ? 6 : 2 });
      chalk(['0', '1/2', '1'][i], xs[i], 618, 34, i === 1 ? GOLD : CHALK);
    }
    chalk('real part', BOARD.x, 655, 23, CHALK);
    const dots = [326, 392, 455, 523];
    dots.forEach((y, i) => {
      if (t < 58.8 + i * 1.25) return;
      const pop = backOut(seg(t, 58.8 + i * 1.25, 59.2 + i * 1.25));
      circle(xs[1], y, 12 * pop, { fill: GOLD, stroke: CHALK, lwPx: 2 });
    });
    if (t >= 83.6) chalk('STILL UNSOLVED', BOARD.x, 231, 31, '#FFB6A9');
    else if (t >= 65) chalk('ALL nontrivial zeros here?', BOARD.x, 231, 31, GOLD);
    X.restore(); X.restore();
  }
  function lessonBoard(t, kind) {
    if (kind === 'primes') primeBoard(t);
    if (kind === 'count') countBoard(t);
    if (kind === 'zeta') zetaBoard(t);
    if (kind === 'strip') stripBoard(t);
  }

  function drawDialogue(t, actors) {
    for (const entry of LINES) {
      const actor = actors[entry.speaker], anchor = actor.A.mouth;
      const placement = entry.speaker === 'housam' ? { dx: 195, dy: -245, maxW: 440 }
        : entry.speaker === 'alma' ? { dx: -320, dy: -235, maxW: 450 }
          : { dx: 175, dy: -245, maxW: 500 };
      callout(entry.text, anchor[0], anchor[1], t - entry.at,
        { ...placement, size: 48, cps: entry.cps, hold: entry.hold, accent: entry.speaker === 'alma' ? '#994EC4' : entry.speaker === 'housam' ? '#3766BD' : PAL.crimson });
    }
  }

  function frame(t, close, board) {
    const P = persp(camera(t, close));
    layer(() => D.back(P, t, { splitZ: 2139, wind: .75 }), { blur: close ? 2.2 : .7 });
    const poses = { housam: housamPose(t), safadi: safadiPose(t), alma: almaPose(t) };
    const actors = {};
    for (const who of ['safadi', 'housam', 'alma']) actors[who] = put(P, who, poses[who], t);
    D.front(P, t, { splitZ: 2139, wind: .75 });
    if (board) lessonBoard(t, board);
    if (t >= 98) {
      for (let i = 0; i < 16; i++) {
        const x = (i * 211 + 73) % W, y = 85 + (i * 97 + t * (40 + i % 3 * 18)) % 850;
        circle(x, y, 4 + i % 3 * 2, { fill: [GOLD, CYAN, '#E5A4FF'][i % 3], stroke: null, alpha: .55 });
      }
      if (t >= 107.7) iris(960, 530, lerp(1700, 0, easeIn(seg(t, 107.7, 110))));
    }
    drawDialogue(t, actors);
  }

  const hello = t => frame(t, false, null);
  const primes = t => frame(t, true, 'primes');
  const count = t => frame(t, true, 'count');
  const zeta = t => frame(t, true, 'zeta');
  const strip = t => frame(t, true, 'strip');
  const celebrate = t => frame(t, 'final', null);
  scene({ duration: 110, fps: 24, bpm: 96,
    shots: [[0, hello], [8, primes], [26, count], [39, zeta], [55, strip], [95, celebrate]] });
})();
