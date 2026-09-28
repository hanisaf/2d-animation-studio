// Scene 08: "Even the Juggler Can't Multitask". Safadi and Fester share the stage (podium view); Housam and Alma react
// from row 3 (the reverse-angle classroom view). Two trials: count the juggling balls AND do mental math. On the
// second, "What is 9 × 8?" makes Fester think, the cascade flies apart and the balls come down on both their heads.
// Every shot is a pure function of t. Dialogue lives in asset.js and drives the bubbles, mouths and voices.
(() => {
  const HALL = LOCATIONS.lecture_hall, LINES = ASSETS.scene.scene08_multitasking.dialogue;
  const FLOOR = HALL.STAGE.y;
  const SAF = { x: -250, y: FLOOR, z: 1990 };                           // beside the lectern (X −420)
  const JF = { x: 150, y: FLOOR, z: 2010 };                             // stage centre-right, a step behind Safadi
  const HOU = HALL.seat(3, -66), ALM = HALL.seat(3, 66, 30);            // row 3, as in scene 07
  const U = JF_UNIT, INK = '#2F4E86', SLATE = '#7B8190';
  const COLS7 = [...JUGGLE_COLS, '#8C5CC8', '#3FB7B0'];
  const J5 = { n: 5, tau: .3, h: 30, inner: 1.4, outer: 4.2, t0: 31.9 - 10 * .3 };              // trial 1: five balls, started mid-pattern
  const J7 = { n: 7, tau: .22, h: 36, inner: 1.4, outer: 4.2, t0: 58.2 - 14 * .22, cols: COLS7 };  // trial 2: seven balls
  const BR = BALL_R * 1.35;                                             // balls a bit bigger than scene 01, easier to count
  const POP1 = 31.9, POP2 = 58.2, TF = 65.2;                            // hat pops · the fumble
  const LAST_REL = 78.45, LAST_LAND = 78.9;                             // the sky ball comes back onto the hat

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who || l.kind === 'think') return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const nod = (t, t0, n = 2, per = .5) => { const u = (t - t0) / per; return u > 0 && u < n ? Math.sin(Math.PI * (u % 1)) : 0; };
  const nodPose = v => ({ lookY: .75 * v, dy: .32 * v, tilt: .025 * v });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));   // 0 → 1 → 0 envelope
  const mix = (a, b, k) => mixPt(a, b, clamp(k));

  // ---------- balls in WORLD coords ----------
  const toWorld = (lx, ly) => [JF.x + lx * U, JF.y - ly * U, JF.z - 12];
  const HAT = [0, -25];                                                  // hat tip, Fester local units
  // Balls pop out of the hat one by one and fly into their slot in the running cascade.
  function juggled(t, J, tp) {
    const c = cascade(t, J), cols = J.cols ?? JUGGLE_COLS;
    const balls = c.balls.map((b, i) => {
      const a = tp + i * .07, k = seg(t, a, a + .42); if (k <= 0) return null;
      const f = easeOut(k), p = [lerp(HAT[0], b.x, f), lerp(HAT[1], b.y, f) - 7 * Math.sin(Math.PI * k)];
      return { p: toWorld(...p), col: cols[i % cols.length], rot: b.rot + t * 2 };
    }).filter(Boolean);
    return { c, balls };
  }
  // Analytic bounce on the stage floor: start point, velocity, time since launch → { p, rot }. Pure: no state.
  function bounce(p0, v0, dt, g = 1750, e = .45) {
    let [x, y, z] = p0, [vx, vy, vz] = v0, tt = Math.max(dt, 0), spin = 0;
    const R = BR * U;
    for (let n = 0; n < 7; n++) {
      const h = y - (FLOOR + R), tau = (vy + Math.sqrt(vy * vy + 2 * g * Math.max(h, 0))) / g;
      if (tt < tau) return { p: [x + vx * tt, y + vy * tt - g * tt * tt / 2, z + vz * tt], rot: spin + tt * vx * .02 };
      x += vx * tau; z += vz * tau; y = FLOOR + R; spin += tau * vx * .02; tt -= tau;
      vy = (g * tau - vy) * e; vx *= .62; vz *= .62;
      if (vy < 70) break;
    }
    const roll = Math.min(tt, .5);                                       // settles with a short roll
    return { p: [x + vx * roll * (1 - roll), FLOOR + R, z + vz * roll * (1 - roll)], rot: spin + roll * vx * .02 };
  }
  // The fumble: where every ball is at TF, which ones hit heads, which one goes up out of frame.
  const START = cascade(TF, J7).balls.map(b => toWorld(b.x, b.y));
  const BY_H = START.map((p, i) => i).sort((a, b) => START[b][1] - START[a][1]);
  const HEAD_J = [JF.x + 4, FLOOR + 24.5 * U, JF.z - 14], HEAD_S = [SAF.x - 6, FLOOR + 29.4 * SAFADI_UNIT, SAF.z - 8];
  const HITS = [{ i: BY_H[0], at: 66.3, head: HEAD_J, dir: 1 }, { i: BY_H[1], at: 66.65, head: HEAD_S, dir: -1 }, { i: BY_H[2], at: 67.0, head: HEAD_J, dir: 1 }];
  const SKY = BY_H[3];
  function fumbled(t) {
    const out = [];
    START.forEach((p0, i) => {
      const col = COLS7[i], dt = t - TF, hit = HITS.find(h => h.i === i);
      if (i === SKY) {                                                   // up, up and out of the top of frame
        const y = p0[1] + 1500 * dt - 1750 * dt * dt / 2;
        if (dt < .8) out.push({ p: [p0[0] - 60 * dt, y, p0[2]], col, rot: dt * 9 });
        return;
      }
      if (hit) {
        if (t < hit.at) {                                                // a high lob that drops onto a head
          const f = seg(t, TF, hit.at), apex = 70 + 25 * HITS.indexOf(hit);
          out.push({ p: [lerp(p0[0], hit.head[0], f), lerp(p0[1], hit.head[1] + BR * U, f) + 4 * apex * f * (1 - f), lerp(p0[2], hit.head[2], f)], col, rot: f * 7 });
        } else {
          const b = bounce([hit.head[0], hit.head[1] + BR * U, hit.head[2]], [hit.dir * (150 + 40 * HITS.indexOf(hit)), 430, -40], t - hit.at);
          out.push({ ...b, col });
        }
        return;
      }
      const v = [(i % 2 ? -1 : 1) * (70 + 120 * hash(i + 3)), 260 + 260 * hash(i + 7), -30 - 50 * hash(i + 11)];
      out.push({ ...bounce(p0, v, dt), col });
    });
    return out;
  }
  function ballsAt(t) {
    if (t >= POP1 && t < 42.2) return juggled(t, J5, POP1).balls;
    if (t >= POP2 && t < TF) return juggled(t, J7, POP2).balls;
    if (t >= TF) return fumbled(t);
    return [];
  }
  function drawBalls(P, t) {
    ballsAt(t).map(b => ({ ...b, q: P.p(...b.p) })).filter(b => P.visible(b.p[2])).sort((a, b) => a.q[2] - b.q[2])
      .forEach(b => jugglerBall(b.q[0], b.q[1], BR * U * b.q[2], b.col, b.rot));
  }

  // ---------- the projection slide ----------
  function slide(t) {
    X.save(); X.textAlign = 'center'; X.textBaseline = 'middle';
    X.fillStyle = INK; X.font = `700 50px ${FONT_TALK}`; X.fillText('One thing at a time', 284, 70);
    line([[110, 112], [458, 112]], { stroke: '#E3B65E', lwPx: 3 });
    // a spotlight lamp, its cone landing on one ball; a second ball waits in the dark
    shape([[250, 170], [318, 170], [470, 470], [98, 470]], { fill: 'rgba(255,214,107,.35)', stroke: null });
    shape(rectPts(256, 140, 56, 34), { fill: SLATE, stroke: INK, lwPx: 3 });
    ellipse(284, 470, 186, 26, { fill: 'rgba(255,214,107,.55)', stroke: null });
    circle(284, 430, 38, { fill: JUGGLE_COLS[2], stroke: INK, lwPx: 4 });
    circle(520, 440, 26, { fill: '#C9CCD6', stroke: SLATE, lwPx: 3 });
    X.restore();
  }
  const HALL_O = { slide, screen: 1, projector: .85 };

  // ---------- Safadi's floating task board (his explanatory power) ----------
  function taskBoard(t, x, y, w) {
    const k = on(t, 23.6, 74.4, .35);
    if (k < .01) return;
    const lineK = (a) => ease(seg(t, a, a + .35));
    const trial = t >= POP2 - 2.5 ? 2 : 1, q = trial === 1 ? '7 × 6' : '9 × 8', asked = trial === 1 ? 33.4 : 63.9;
    const answer = t >= 49.4 && t < POP2 - 2.5;
    overlay(() => {
      const h = w * .5, pop = backOut(k);
      X.save(); X.translate(x, y + wob(t, .35) * 4); X.scale(pop, pop); X.translate(-w / 2, -h / 2);
      X.save(); X.shadowColor = SF.glow; X.shadowBlur = 22;
      shape(rectPts(0, 0, w, h), { fill: linGrad(0, 0, 0, h, [[0, SF.board], [1, SF.boardDk]]), stroke: SF.glow, lwPx: 4 });
      X.restore();
      X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillStyle = SF.chalk;
      X.font = `700 ${w * .07}px ${SF_CHALK}`; X.textAlign = 'center';
      X.fillText(trial === 1 ? 'The experiment' : 'Second try', w / 2, h * .16);
      X.textAlign = 'left'; X.font = `700 ${w * .075}px ${SF_CHALK}`;
      X.globalAlpha = lineK(23.9); X.fillText(answer ? '① 5 balls' : '① Count the balls', w * .08, h * .45);
      X.globalAlpha = lineK(26.9);
      X.fillText(answer ? '② 7 × 6 = 42' : t >= asked ? `② ${q} = ?` : '② Solve a problem', w * .08, h * .75);
      if (answer) { X.globalAlpha = lineK(49.6); X.fillStyle = SF.glowGold; X.fillText('✓', w * .84, h * .45); X.globalAlpha = lineK(50.6); X.fillText('✓', w * .84, h * .75); }
      X.restore();
    });
  }

  // ---------- Safadi ----------
  function dazeStars(cx, cy, s, t, k) {
    if (k < .01) return;
    for (let i = 0; i < 4; i++) {
      const a = t * 4.5 + i * TAU / 4, x = cx + Math.cos(a) * 5.5 * s, y = cy + Math.sin(a) * 1.4 * s, r = (.75 + .25 * Math.sin(a)) * .9 * s * k;
      shape(starPts(x, y, r, .45, 5, a), { fill: i % 2 ? PAL.goldLt : '#FFFFFF', stroke: PAL.ink, lwPx: 2 });
    }
  }
  function safadiPose(t) {
    const talk = speaking('safadi', t);
    const o = { turn: .1 * Math.sin(t * .23), lookX: .25 * Math.sin(t * .31 + 1), lookY: -.05, brows: 'normal',
      mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']),
      handL: [-4.4, -8.3], handR: [4.4, -8.3], handPoseL: 'open', handPoseR: 'open' };
    const watchJ = (k = 1) => { o.lookX = lerp(o.lookX, .75, k); o.turn = lerp(o.turn, .28, k); };
    // 0–12.8 · the spotlight; one thing at a time
    if (t < 12.8) {
      const spot = on(t, .7, 3.7);
      o.handR = mix(o.handR, [5.4, -14.5], spot); if (spot > .5) Object.assign(o, { handPoseR: 'palm', lookX: .45, lookY: -.3 });
      const one = on(t, 4.1, 7.0);
      o.handR = mix(o.handR, [5.8, -21.4], one); if (one > .5) Object.assign(o, { handPoseR: 'point', brows: 'up' });
      const both = on(t, 7.4, 12.6);
      o.handL = mix(o.handL, [-5.4, -13], both); o.handR = mix(o.handR, [5.4, -13], both);
      if (both > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm' });
      if (t > 10) Object.assign(o, { brows: 'worried', mouth: talk ? o.mouth : 'flat' });
    }
    // 12.8–23.2 · prove it; welcome Fester; watch him tumble in
    if (t >= 12.8 && t < 23.2) {
      const prove = on(t, 13.1, 15.4);
      o.handR = mix(o.handR, [5.2, -12.4], prove); if (prove > .5) Object.assign(o, { handPoseR: 'palm', brows: 'up', mouth: talk ? o.mouth : 'smirk' });
      const welcome = on(t, 15.8, 22.9, .4);
      o.handR = mix(o.handR, [6.6, -14.2], welcome); o.handL = mix(o.handL, [-4.8, -11.5], welcome);
      if (welcome > .5) Object.assign(o, { handPoseR: 'palm', handPoseL: 'palm', brows: 'up' });
      if (t > 17) watchJ(ease(seg(t, 17, 17.6)));
      if (t > 20.6 && t < 22.8) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
    }
    // 23.2–31.9 · the rules, to the class; "Ready? Try it with me!"
    if (t >= 23.2 && t < 31.9) {
      const count = on(t, 23.5, 26.1);
      o.handR = mix(o.handR, [6.2, -13.6], count); if (count > .5) { o.handPoseR = 'point'; watchJ(.6); }
      const math = on(t, 26.5, 29.6);
      o.handL = mix(o.handL, [-5.8, -21.4], math); if (math > .5) Object.assign(o, { handPoseL: 'point', brows: 'up', power: .25 * math });
      const ready = on(t, 29.9, 31.9);
      o.handL = mix(o.handL, [-5.6, -13.4], ready); o.handR = mix(o.handR, [5.6, -13.4], ready);
      if (ready > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', lookX: 0, turn: 0 });
    }
    // 31.9–42.2 · trial 1: asks the question, then watches the juggling
    if (t >= 31.9 && t < 42.2) {
      watchJ(); o.lookY = -.25;
      const q = on(t, 34.8, 37.4);
      o.handL = mix(o.handL, [-5.8, -21.4], q); if (q > .5) Object.assign(o, { handPoseL: 'point', brows: 'up', lookX: 0, turn: 0 });
      if (t > 37.4) o.mouth = 'smirk';
    }
    // 49.2–59.8 · the answers; "second time"; "seven balls?"
    if (t >= 49.2 && t < 59.8) {
      const five = on(t, 49.5, 51.9);
      o.handR = mix(o.handR, [5.3, -14.2], five); if (five > .5) o.handPoseR = 'palm';
      const again = on(t, 52.7, 55.3);
      o.handL = mix(o.handL, [-5.8, -21.4], again); if (again > .5) Object.assign(o, { handPoseL: 'point', eyes: t < 53.8 ? 'narrow' : 'open', mouth: talk ? o.mouth : 'smirk' });
      if (t > 55.6) { watchJ(ease(seg(t, 55.6, 56))); Object.assign(o, { brows: 'up', eyes: t > 56.6 ? 'wide' : 'open', mouth: talk ? o.mouth : 'o' }); }
      if (t > 58.2) Object.assign(o, { eyes: 'open', mouth: 'grin', lookY: -.3 });
    }
    // 59.8–65.8 · trial 2: "Count the balls!" … "What is 9 × 8?" (to the class, not noticing Fester)
    if (t >= 59.8 && t < 65.8) {
      const cnt = on(t, 60, 62.4);
      o.handR = mix(o.handR, [6.2, -13.6], cnt); if (cnt > .5) { o.handPoseR = 'point'; watchJ(.7); }
      const q = on(t, 63.8, 65.8);
      o.handL = mix(o.handL, [-5.8, -21.4], q); if (q > .5) Object.assign(o, { handPoseL: 'point', brows: 'up', lookX: -.1, turn: -.05, eyes: 'happy' });
    }
    // 65.8–68.2 · he notices, looks up… BONK
    const HS = HITS[1].at;
    if (t >= 65.8 && t < 68.2) {
      Object.assign(o, { lookX: .3, lookY: -.9, eyes: 'wide', brows: 'worried', mouth: 'O', emote: t < HS ? '!' : null, emoteK: ease(seg(t, 65.85, 66.05)),
        handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'open', handPoseR: 'open' });
      if (t >= HS) {
        const bk = kick(t, HS, 7);
        Object.assign(o, { sq: .28 * bk, dy: .8 * bk, eyes: t - HS < .18 ? 'squeeze' : 'closed', mouth: 'wobble', lookY: 0, brows: 'worried',
          tilt: .07 * Math.sin((t - HS) * 5.2), handL: [-4.4, -8.3], handR: [4.4, -8.3] });
      }
    }
    // 68.2–74.4 · dazed, rubbing his head: "Ow… You see? Even the juggler can't multitask!"
    if (t >= 68.2 && t < 77.4) {
      const rub = on(t, 68.3, 70.6, .35), wob1 = Math.sin(t * 5.2) * (1 - seg(t, 69.2, 70.4));
      Object.assign(o, { tilt: .06 * wob1, lean: .04 * wob1, turn: .12, lookX: .2, lookY: 0, eyes: t < 69.3 ? 'closed' : 'open', brows: 'worried', mouth: talk ? o.mouth : 'wobble' });
      o.handR = mix(o.handR, [2.6 + .35 * Math.sin(t * 14), -24.2], rub); if (rub > .5) o.handPoseR = 'palm';
      if (t > 70.6) {
        const point = on(t, 71.2, 74.2);
        watchJ(ease(seg(t, 70.6, 71))); o.handR = mix(o.handR, [6.3, -13.8], point); if (point > .5) o.handPoseR = 'palm';
        Object.assign(o, { brows: 'up', eyes: t > 73.4 ? 'happy' : 'open', mouth: lipFlap(t, talk, 'grin', ['grin', 'open', 'smile', 'o']) });
      }
    }
    // 77.4–82 · everybody smiles: he chuckles at the ball on Fester's hat
    if (t >= 77.4) {
      const laugh = t > 79.1 ? Math.abs(Math.sin((t - 79.1) * 9)) * (1 - seg(t, 80.4, 81)) : 0;
      Object.assign(o, { turn: .2, lookX: .7, lookY: t > 78.4 && t < 79.1 ? -.6 : -.1, eyes: t > 79.1 ? 'happy' : 'open', brows: 'up',
        mouth: t > 79.1 ? 'grin' : 'smile', dy: .25 * laugh, handL: [-1.8, -9.6], handR: [1.8, -9.6], handPoseL: 'fist', handPoseR: 'fist' });
    }
    return o;
  }

  // ---------- Fester ----------
  // → { o, x } or null (not on stage yet). Hands drive the cascade while juggling.
  function jesterPose(t) {
    if (t < 18.3) return null;
    const talk = speaking('jester_fester', t);
    const hops = [[18.3, 18.95, 690, 520, false], [18.95, 19.75, 520, 330, true], [19.75, 20.55, 330, JF.x, true]];
    const hop = hops.find(h => t >= h[0] && t < h[1]);
    if (hop) {
      const [a, b, x0, x1, flip] = hop, f = seg(t, a, b), tuck = flip ? Math.sin(Math.PI * f) : .4 * Math.sin(Math.PI * f);
      return { x: lerp(x0, x1, f), o: { jump: 7 * Math.sin(Math.PI * f), rot: flip ? -TAU * ease(f) : -.15 * Math.sin(Math.PI * f),
        footL: mixPt([-1.25, -.85], [-1.2, -5.2], tuck), footR: mixPt([1.25, -.85], [1.2, -5.2], tuck),
        handL: mixPt([-4.6, -15], [-2.2, -12], tuck), handR: mixPt([4.6, -15], [2.2, -12], tuck),
        eyes: flip ? 'squeeze' : 'happy', mouth: 'grin', hatSway: [1.2, .4] } };
    }
    const o = { turn: -.12, lookX: -.35, lookY: 0, brows: 'normal', mouth: lipFlap(t, talk, 'grin'),
      handL: [-3.3, -8.4], handR: [3.3, -8.4], handPoseL: 'open', handPoseR: 'open', hatSway: [.3 * wob(t, .5), 0] };
    // landing + ta-da
    if (t < 23.2) {
      const tada = ease(seg(t, 20.55, 20.8)) * (1 - ease(seg(t, 22.6, 23.1)));
      o.handL = mix(o.handL, [-5.3, -15.4], tada); o.handR = mix(o.handR, [5.3, -15.4], tada);
      Object.assign(o, { sq: .3 * boing(t, 20.55, 2.2, 6), dy: .5 * kick(t, 20.55, 5), turn: 0, lookX: 0, eyes: 'happy', brows: 'up' });
    }
    // the rules: bows at "count the balls", nervous at "math problem", ready at "Try it with me"
    if (t >= 23.2 && t < POP1) {
      const bow = on(t, 24.2, 25.6);
      Object.assign(o, { lean: .18 * bow, dy: .4 * bow });
      if (bow > .5) Object.assign(o, { eyes: 'happy', handR: [3.6, -11.6] });
      if (t > 27.2 && t < 29.6) Object.assign(o, { brows: 'worried', mouth: 'smirk', emote: 'sweat', emoteK: on(t, 27.3, 29.5), lookX: -.6 });
      const rdy = ease(seg(t, 30.4, 31.1));
      o.handL = mix(o.handL, [-3.8, -10.4], rdy); o.handR = mix(o.handR, [3.8, -10.4], rdy);
      if (rdy > .5) Object.assign(o, { handPoseL: 'cup', handPoseR: 'cup', lookX: 0, turn: 0, brows: 'up' });
    }
    // juggling (either trial): hands follow the cascade, eyes on the balls
    const juggle = (J, tp) => {
      const { c } = juggled(t, J, tp), k = ease(seg(t, tp, tp + .4));
      Object.assign(o, { turn: 0, handL: mix([-3.8, -10.4], c.handL, k), handR: mix([3.8, -10.4], c.handR, k), handPoseL: 'cup', handPoseR: 'cup',
        lookY: -.75, lookX: .3 * Math.sin(t * TAU / (2 * J.tau)), brows: 'up', mouth: 'grin', dy: .12 * Math.abs(Math.sin(t * Math.PI / J.tau)),
        hatLift: 2.2 * kf(t, [[tp - .05, 0], [tp + .08, 1], [tp + .4, 0]], easeOut) });
      return c;
    };
    if (t >= POP1 && t < 42.2) juggle(J5, POP1);
    // between the trials: proud nods, then "This time… seven balls!"
    if (t >= 42.2 && t < POP2) {
      if (t < 55.6) Object.assign(o, nodPose(nod(t, 50.6, 2, .5)), { lookY: 0 });
      const brag = on(t, 55.7, POP2 - .1, .35);
      o.handL = mix(o.handL, [-5.3, -15.4], brag); o.handR = mix(o.handR, [5.3, -15.4], brag);
      if (brag > .5) Object.assign(o, { turn: 0, lookX: 0, eyes: t > 57.3 ? 'happy' : 'open', brows: 'up', emote: '!', emoteK: on(t, 57.2, POP2 - .1, .15) });
      const rdy = ease(seg(t, 57.8, POP2));
      o.handL = mix(o.handL, [-3.8, -10.4], rdy); o.handR = mix(o.handR, [3.8, -10.4], rdy);
    }
    if (t >= POP2 && t < TF) {
      juggle(J7, POP2);
      if (t > 64.5) Object.assign(o, { lookX: -.45, lookY: -.95, brows: 'worried', mouth: 'o' });     // "9 × 8…?" his mind drifts
      if (t > TF - .2) o.handPoseL = o.handPoseR = 'open';
    }
    // the fumble: hands stop (one goes to his chin), then he sees what's coming… BONK ×2
    if (t >= TF && t < 68.2) {
      const c = cascade(TF, J7), chin = ease(seg(t, TF, TF + .3));
      Object.assign(o, { turn: 0, handL: c.handL, handR: mix(c.handR, [.6, -14.4], chin), handPoseL: 'open', handPoseR: 'fist',
        lookX: -.45, lookY: -.95, brows: 'worried', mouth: 'o', emote: '?', emoteK: on(t, TF + .1, 65.9, .15) });
      if (t > 65.75) Object.assign(o, { handL: [-3.3, -17.5], handR: [3.3, -17.5], handPoseL: 'fist', handPoseR: 'fist', eyes: 'wide', lookX: 0, lookY: -1, mouth: 'O', emote: '!', emoteK: on(t, 65.8, 66.3, .1) });
      const J = HITS.filter(h => h.head === HEAD_J), n = J.filter(h => t >= h.at).length;
      if (n) {
        const bk = J.reduce((s, h) => s + kick(t, h.at, 7), 0), last = J[n - 1].at, dizzy = t > 67.15, w1 = dizzy ? Math.sin(t * 5.2) : 0;
        Object.assign(o, { sq: .28 * bk, dy: .9 * bk + (dizzy ? .6 : 0), lean: .12 * w1, tilt: .14 * w1, hatAskew: .35 * seg(t, 67, 67.12),
          eyes: dizzy ? 'swirl' : t - last < .15 ? 'squeeze' : 'wide', mouth: dizzy ? 'wobble' : 'teeth', stars: dizzy ? ease(seg(t, 67.15, 67.5)) : 0,
          emote: null, lookY: dizzy ? 0 : -1 });
        if (dizzy) Object.assign(o, { handL: [-3.3 + .5 * w1, -8.3], handR: [3.4 + .5 * w1, -8.2], handPoseL: 'open', handPoseR: 'open' });
      }
    }
    // dazed, then shakes it off, fixes his hat, and grins along with Safadi
    if (t >= 68.2 && t < 77.4) {
      const shake = seg(t, 69.4, 70), w1 = Math.sin(t * 5.2) * (1 - seg(t, 69.2, 69.6));
      Object.assign(o, { stars: 1 - ease(seg(t, 69.2, 69.7)), eyes: t < 69.4 ? 'swirl' : t < 70 ? 'squeeze' : 'open', mouth: t < 70 ? 'wobble' : 'smirk',
        lean: .1 * w1, tilt: .12 * w1, turn: t > 69.4 && t < 70 ? .6 * Math.sin(t * TAU * 5) * (1 - shake) : -.15, lookX: -.5,
        hatAskew: .35 * (1 - ease(seg(t, 70.2, 70.6))), dy: t < 69.4 ? .6 : 0 });
      const fix = on(t, 70.05, 70.9, .2);
      o.handL = mix(o.handL, [-2.9, -20.6], fix); o.handR = mix(o.handR, [2.9, -20.6], fix);
      if (t > 71.5) Object.assign(o, { brows: 'worried', mouth: 'smirk', blush: ease(seg(t, 71.5, 72)) });
      if (t > 73.6) Object.assign(o, { eyes: 'happy', mouth: 'grin', brows: 'up' });
    }
    // everybody smiles: a sheepish shrug… the last ball lands on his hat. Thumbs up, wink.
    if (t >= 77.4) {
      const shrug = ease(seg(t, 77.6, 77.9)), landed = t >= LAST_LAND, proud = t > 79.6;
      let hL = mix([-3.3, -8.4], [-4.4, -13.4], shrug), hR = mix([3.3, -8.4], [4.4, -13.4], shrug);
      if (proud) { hR = mix(hR, [3.7, -12.8], ease(seg(t, 79.6, 79.8))); hL = mix(hL, [-3.3, -8.4], ease(seg(t, 79.6, 79.8))); }
      Object.assign(o, { turn: 0, lookX: 0, handL: hL, handR: hR, handPoseR: proud ? 'thumb' : 'open',
        eyes: proud ? (t > 80.1 ? 'wink' : 'happy') : landed ? 'wide' : 'happy', lookY: landed && !proud ? -1 : 0,
        brows: landed && !proud ? 'up' : 'worried', mouth: !landed ? 'grin' : proud ? 'grin' : 'o', tilt: landed ? 0 : .12 * shrug,
        hatSway: [0, landed ? .7 + .6 * boing(t, LAST_LAND, 2.5, 4) : 0], dy: landed ? .5 * kick(t, LAST_LAND, 6) : -.2 * shrug });
    }
    return { x: JF.x, o };
  }

  // ---------- the two-shot on stage ----------
  // Podium view: lock the stage floor (at Z 2000) to screen y `feet` while the camera drifts.
  function podium(x, z, f, camY, feet) {
    const k = f / (2000 - z);
    return { x, y: camY, z, f, hy: feet - (camY - FLOOR) * k };
  }
  function stageShot(t, cam, blur, extra) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { ...HALL_O, splitZ: SAF.z }), { blur });
    const put = (p, x, rig, unit, o) => { const [sx, sy, k] = P.p(x, p.y, p.z), s = unit * k; return { A: rig(sx, sy, s, o), s, sx, sy }; };
    const jp = jesterPose(t), j = jp && put(JF, jp.x, jester, U, jp.o);          // Fester is a step farther: draw him first
    const sf = put(SAF, SAF.x, safadi, SAFADI_UNIT, safadiPose(t));
    HALL.front(P, t, { splitZ: SAF.z });
    const HS = HITS[1].at;
    dazeStars(sf.A.head[0], sf.A.head[1] - 6.8 * sf.s, sf.s, t, t < HS + .05 ? 0 : ease(seg(t, HS + .05, HS + .4)) * (1 - ease(seg(t, 69.3, 69.8))));
    drawBalls(P, t);
    // sound effects on the hits and pops
    if (j) {
      HITS.forEach((h, n) => { const [x, y] = P.p(...h.head); sfx('BONK!', x + h.dir * 110, y - 110 - 20 * n, 92 + 12 * n, [PAL.goldLt, '#FF9A6B', PAL.pink][n], t - h.at, { rot: h.dir * .12, life: .8 }); });
      [POP1, POP2].forEach(tp => { const [x, y] = P.p(...toWorld(...HAT)); sfx('POP!', x + 130, y - 40, 70, PAL.goldLt, t - tp, { rot: .1 }); });
    }
    // callouts
    const size = clamp(34 + 5 * P.k(SAF.z), 44, 56);
    for (const l of LINES) {
      const age = t - l.at;
      if (l.speaker === 'safadi') callout(l.text, sf.A.mouth[0] + 1.6 * sf.s, sf.A.mouth[1] - .6 * sf.s, age, { dx: 260, dy: -250, size, maxW: 620, cps: l.cps, hold: l.hold, accent: PAL.crimson });
      else if (l.speaker === 'jester_fester' && j) callout(l.text, j.A.mouth[0] + 1.4 * j.s, j.A.mouth[1] - .8 * j.s, age,
        { dx: 260, dy: -230, size, maxW: 560, cps: l.cps, hold: l.hold, kind: l.kind, accent: PAL.plum });
    }
    if (extra) extra(P, j, sf);
  }

  // ---------- Housam and Alma ----------
  // Classroom view (dir −1): hold the students' eye line at screen y `eyes`.
  function classroom(x, z, f, camY, eyes) {
    const k = f / (z - HOU.z);
    return { x, y: camY, z, f, hy: eyes - (camY - 212) * k, dir: -1 };
  }
  const chase = (t, ph = 0) => .75 * Math.sin(t * TAU * 1.65 + ph);          // eyes chasing the balls
  function housamPose(t) {
    const talk = speaking('housam', t);
    const o = { turn: -.06, lookX: 0, lookY: -.12, brows: 'normal', mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'grin', 'o']),
      handL: [-3.4, -11.4], handR: [3.4, -11.4], handPoseL: 'open', handPoseR: 'open' };
    if (t < 12.8) {                                                              // "worse at both": a thoughtful nod
      Object.assign(o, nodPose(nod(t, 10.6, 2, .5)));
      if (t > 9.8) o.brows = 'up';
    }
    if (t >= 37.2 && t < 40.6) {                                                 // counting on his fingers, eyes chasing
      const tick = Math.floor((t - 37.2) * 2.2) % 2;
      Object.assign(o, { lookX: chase(t), lookY: -.45, eyes: 'wide', brows: 'focused', mouth: tick ? 'o' : 'flat',
        handR: [3.8, -15.4 - .5 * tick], handPoseR: 'point', handL: [-2.2, -13.2], handPoseL: 'fist', tilt: .04 * Math.sin(t * 6) });
      if (t > 39.2) Object.assign(o, { brows: 'worried', emote: 'sweat', emoteK: ease(seg(t, 39.2, 39.5)) });
    }
    if (t >= 42.2 && t < 49.2) {                                                 // "Uh… six? No, four?"
      const scratch = on(t, 44.4, 47.2);
      o.handR = mix(o.handR, [1.2 + .3 * Math.sin(t * 16), -21.2], scratch); if (scratch > .5) o.handPoseR = 'fist';
      Object.assign(o, { brows: 'worried', eyes: t > 43 && t < 44.5 ? 'wide' : 'open', lookX: t > 45.6 && t < 46.5 ? .6 : -.1, lookY: -.3 });
      if (t > 46.9) Object.assign(o, { lookX: .8, turn: .3, mouth: 'grin' });   // turns to Alma (screen-left)
    }
    if (t >= 74.4 && t < 77.4) {                                                 // laughing
      const k = Math.abs(Math.sin((t - 74.4) * 9));
      Object.assign(o, { eyes: 'happy', mouth: k > .4 ? 'grin' : 'open', dy: .25 * k, lean: .05, brows: 'up',
        handL: [-2.6, -13.6], handR: [2.6, -13.6], handPoseL: 'fist', handPoseR: 'fist', turn: t > 76 ? .3 : 0, lookX: t > 76 ? .8 : 0 });
    }
    return o;
  }
  function almaPose(t) {
    const talk = speaking('alma', t);
    const o = { turn: .05, lookX: 0, lookY: -.1, brows: 'up', mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']),
      handL: [-2.8, -6.9], handR: [2.8, -6.9], handPoseL: 'open', handPoseR: 'open', hairSwing: .08 * wob(t, .4) };
    if (t < 12.8 && t > 10.1) Object.assign(o, { brows: 'worried', mouth: 'flat' }, nodPose(nod(t, 11.2, 1, .6)));
    if (t >= 37.2 && t < 40.6) {                                                 // head bobbing along with the balls
      const w1 = Math.sin(t * TAU * 1.65 + .6);
      Object.assign(o, { lookX: chase(t, .6), lookY: -.5, tilt: .1 * w1, hairSwing: .5 * w1, eyes: 'wide', brows: 'worried', mouth: 'o' });
      if (t > 38.5) Object.assign(o, { emote: 'sweat', emoteK: ease(seg(t, 38.5, 38.8)), mouth: 'wobble' });
    }
    if (t >= 42.2 && t < 49.2) {                                                 // "I forgot the math part!"
      const cheeks = on(t, 46.8, 49.2);
      o.handL = mix(o.handL, [-2.5, -13.4], cheeks); o.handR = mix(o.handR, [2.5, -13.4], cheeks);
      if (cheeks > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', brows: 'worried' });
      if (t > 44.6 && t < 46.8) Object.assign(o, { lookX: -.8, turn: -.3 });   // glances at Housam (screen-right)
      if (t > 48.5) Object.assign(o, { eyes: 'happy', mouth: 'grin', blush: ease(seg(t, 48.5, 48.9)) });
    }
    if (t >= 74.4 && t < 77.4) {                                                 // giggling
      const k = Math.abs(Math.sin((t - 74.4) * 11));
      Object.assign(o, { eyes: 'happy', mouth: k > .5 ? 'grin' : 'smile', blush: 1, dy: .15 * k, tilt: -.08,
        handL: [-1.4, -11.2], handR: [1.4, -11.2], handPoseL: 'fist', handPoseR: 'fist', turn: t > 76 ? -.3 : 0, lookX: t > 76 ? -.8 : 0 });
    }
    return o;
  }
  function studentShot(t, cam, blur) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { ...HALL_O, splitZ: HOU.z }), { blur });
    const put = (p, rig, unit, pose) => { const [sx, sy, k] = P.p(p.x, p.y, p.z), s = unit * k; return { A: rig(sx, sy, s, pose), s }; };
    const a = put(ALM, alma, ALMA_UNIT, almaPose(t));
    const h = put(HOU, housam, HOUSAM_UNIT, housamPose(t));
    HALL.front(P, t, { splitZ: HOU.z });
    for (const l of LINES) {
      const age = t - l.at, o = { size: 48, maxW: 900, cps: l.cps, hold: l.hold, accent: PAL.crimson };
      if (l.speaker === 'safadi') callout(l.text, W / 2, H + 90, age, { ...o, dx: 0, dy: -300 });     // Safadi is behind the camera
      else if (l.speaker === 'housam') callout(l.text, h.A.mouth[0] + 1.2 * h.s, h.A.mouth[1] - .8 * h.s, age, { ...o, dx: 280, dy: -260 });
      else if (l.speaker === 'alma') callout(l.text, a.A.mouth[0] - 1.2 * a.s, a.A.mouth[1] - .8 * a.s, age, { ...o, dx: -280, dy: -260 });
    }
  }

  // ---------- shots ----------
  const intro = t => stageShot(t, podium(-230, lerp(1480, 1530, seg(t, 0, 7.2)), 1500, 215, 1060), 1.4);
  const listen = t => studentShot(t, classroom(10 * Math.sin(t * .2), lerp(1440, 1470, seg(t, 7.2, 12.8)), 1650, 250, 470), 2);
  const welcome = t => stageShot(t, podium(lerp(-30, -50, seg(t, 12.8, 23.2)), 1350, 1300, 225, 1010), 1);
  const rules = t => stageShot(t, podium(-50, lerp(1400, 1420, ease(seg(t, 23.2, 31.8))), 1500, 215, 1030), 1.2, (P) => taskBoard(t, 370, 210, 600));
  const trial1 = t => stageShot(t, podium(-40, lerp(1400, 1415, seg(t, 31.8, 37.2)), 1450, 215, 1040), 1.2, (P) => taskBoard(t, 370, 210, 600));
  const struggle = t => studentShot(t, classroom(lerp(-10, 10, seg(t, 37.2, 40.6)), lerp(1470, 1510, seg(t, 37.2, 40.6)), 1700, 250, 480), 2.2);
  const trial1b = t => stageShot(t, podium(140, lerp(1500, 1520, seg(t, 40.6, 42.2)), 1550, 205, 1060), 1.8);
  const answers = t => studentShot(t, classroom(lerp(10, -10, seg(t, 42.2, 49.2)), lerp(1450, 1480, seg(t, 42.2, 49.2)), 1650, 250, 480), 2.2);
  const reveal = t => stageShot(t, podium(-50, lerp(1410, 1430, seg(t, 49.2, 59.8)), 1500, 215, 1030), 1.2, (P) => taskBoard(t, 370, 210, 600));
  const trial2 = t => { const [dx, dy] = shakeXY(t, 16 * HITS.reduce((s, h) => s + kick(t, h.at, 10), 0));
    camBegin(W / 2 - dx, H / 2 - dy, 1, 0);
    stageShot(t, podium(-50, lerp(1380, 1395, seg(t, 59.8, 68.2)), 1420, 225, 1040), 1.1, (P) => taskBoard(t, 370, 210, 600));
    camEnd(); };
  const dazed = t => stageShot(t, podium(-60, lerp(1440, 1470, seg(t, 68.2, 74.4)), 1560, 210, 1040), 1.4, (P) => taskBoard(t, 370, 210, 600));
  const laugh = t => studentShot(t, classroom(0, lerp(1480, 1520, ease(seg(t, 74.4, 77.4))), 1700, 250, 480), 2.2);
  const finale = t => stageShot(t, podium(-50, lerp(1420, 1480, ease(seg(t, 77.4, 82))), 1520, 210, 1040), 1.4, (P, j) => {
    // the sky ball: stuck up in the ceiling lights since the fumble; it drops onto the middle hat tip and balances there
    if (t >= LAST_REL) {
      const tip = j.A.hatTip, r = BR * j.s, landed = t >= LAST_LAND;
      let x = tip[0], y = tip[1] - r * .75 + wob(t, 1.3) * r * .05;
      if (!landed) { const f = seg(t, LAST_REL, LAST_LAND); y = lerp(-r * 2, y, f * f); x = lerp(tip[0] - 20, tip[0], f); }
      jugglerBall(x, y, r, COLS7[SKY], landed ? .15 * boing(t, LAST_LAND, 2.5, 4) : t * 5);
      if (landed) sfx('plip!', x + r * 2.6, y - r * .8, 54, PAL.goldLt, t - LAST_LAND, { life: .7, rot: .12 });
    }
    iris((j.A.head[0] + W / 2) / 2, j.A.head[1], lerp(1900, 0, easeIn(seg(t, 80.9, 82))));
  });

  scene({ duration: 82, fps: 24, bpm: 96,                  // id, title, dialogue, music: see asset.js
    shots: [[0, intro], [7.2, listen], [12.8, welcome], [23.2, rules], [31.8, trial1], [37.2, struggle], [40.6, trial1b],
      [42.2, answers], [49.2, reveal], [59.8, trial2], [68.2, dazed], [74.4, laugh], [77.4, finale]] });
})();
