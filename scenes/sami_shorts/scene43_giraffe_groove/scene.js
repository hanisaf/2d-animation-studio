// Giraffe Groove: Jenna and Fafy dance with a life-size giraffe.
(() => {
  const ink = '#4A3153', yellow = '#F7C94C', gold = '#D98535', cream = '#FFF0B8';
  const box = (x, y, w, h, fill, stroke = null) => shape(rectPts(x, y, w, h), { fill, stroke, lwPx: 2 });

  function backdrop(t, zoom = 1, drift = 0) {
    const g = linGrad(0, 0, 0, 1080, [[0, '#73569B'], [.48, '#F6A78C'], [1, '#F9DB83']]);
    box(0, 0, 1920, 1080, g, null);
    circle(1540, 225, 118, { fill: '#FFE99B', stroke: null, alpha: .9 });
    for (let i = 0; i < 13; i++) {
      const x = i * 165 - 50 + 16 * Math.sin(i * 2.7);
      const h = 105 + 75 * hash(i + 41);
      shape([[x - 95, 895], [x - 70, 895 - h * .65], [x, 895 - h], [x + 74, 895 - h * .55], [x + 110, 895]],
        { fill: i % 2 ? '#547754' : '#416A50', stroke: null, smooth: true });
    }
    shape([[0, 844], [350, 820], [680, 855], [1050, 810], [1430, 850], [1920, 806], [1920, 1080], [0, 1080]],
      { fill: '#79A95E', stroke: ink, lwPx: 5, smooth: true });
    shape([[0, 932], [430, 905], [830, 942], [1240, 900], [1920, 930], [1920, 1080], [0, 1080]],
      { fill: '#9CCB68', stroke: null, smooth: true });
    for (let i = 0; i < 24; i++) {
      const x = 35 + i * 82, y = 935 + 70 * hash(i + 9), c = ['#FFF1A1', '#F08CAB', '#8ED4E8'][i % 3];
      line([[x, y + 18], [x + 3, y]], { stroke: '#477B48', lwPx: 3 });
      circle(x + 3, y, 6 + 3 * hash(i), { fill: c, stroke: ink, lwPx: 1.5 });
    }
    // Soft rhythmic spotlight grounds the dance without turning the clearing into a stage.
    ellipse(960 + drift, 968, 590 * zoom, 72 * zoom, { fill: 'rgba(255,244,184,.27)', stroke: null });
  }

  function bigGiraffe(x, y, s, o = {}) {
    const t = o.t ?? T, beat = t * 112 / 60, sway = o.sway ?? Math.sin(beat * Math.PI / 2);
    const step = o.step ?? Math.sin(beat * Math.PI), liftL = Math.max(0, step), liftR = Math.max(0, -step);
    const bow = o.bow || 0, spin = o.spin || 0, jump = o.jump || 0;
    X.save(); X.translate(x, y - jump); X.scale(s * (o.flip ? -1 : 1), s); X.rotate(spin);
    ellipse(0, 4, 25, 3.4, { fill: 'rgba(48,37,49,.22)', stroke: null });
    withBoil(.45, () => {
      // Tail behind the body.
      line([[13, -54], [25 + 3 * sway, -48], [29 + 5 * sway, -39]], { stroke: ink, lw: 3.1, smooth: true });
      line([[13, -54], [25 + 3 * sway, -48], [29 + 5 * sway, -39]], { stroke: yellow, lw: 2.2, smooth: true });
      ellipse(30 + 5 * sway, -38, 2.5, 5, { fill: gold, stroke: ink, lw: .65, rot: -.5 * sway });
      // Long dancing legs.
      [[-9, liftL, -1], [8, liftR, 1]].forEach(([lx, lift, sd]) => {
        const knee = [lx + sd * 2.5 * lift, -22 - 4 * lift], hoof = [lx + sd * 7 * lift, -1 - 10 * lift];
        line([[lx, -48], knee, hoof], { stroke: ink, lw: 5.1, lineCap: 'round', lineJoin: 'round' });
        line([[lx, -48], knee, hoof], { stroke: yellow, lw: 3.9, lineCap: 'round', lineJoin: 'round' });
        ellipse(hoof[0] + sd * 1.4, hoof[1], 3.2, 1.8, { fill: gold, stroke: ink, lw: .65, rot: sd * .15 });
      });
      // Body and spots.
      ellipse(1, -58, 18, 12, { fill: yellow, stroke: ink, lw: .9, rot: -.05 * sway });
      [[-8, -64, 4, 3], [4, -53, 3.2, 4], [11, -62, 3.5, 2.6], [-1, -67, 2.5, 2]].forEach(p =>
        ellipse(p[0], p[1], p[2], p[3], { fill: gold, stroke: null, rot: p[0] * .03 }));
      // A flexible neck makes a readable wave from body to head.
      const nx = 3 + 7 * sway, hx = 3 + 13 * sway, hy = -111 + 18 * bow;
      line([[7, -65], [5 + 2 * sway, -84], [nx, -100], [hx, hy]], { stroke: ink, lw: 10.5, smooth: true, lineCap: 'round' });
      line([[7, -65], [5 + 2 * sway, -84], [nx, -100], [hx, hy]], { stroke: yellow, lw: 8.8, smooth: true, lineCap: 'round' });
      [[6, -78], [nx, -93], [hx - 2, hy + 7]].forEach((p, i) => ellipse(p[0], p[1], 3, 4.5, { fill: gold, stroke: null, rot: i }));
      X.save(); X.translate(hx, hy); X.rotate(.15 * sway + .35 * bow);
      // Ears and ossicones.
      [-1, 1].forEach(sd => {
        shape([[sd * 3, -5], [sd * 9, -9], [sd * 10, -5], [sd * 5, -2]], { fill: yellow, stroke: ink, lw: .75, smooth: true });
        line([[sd * 2.8, -6], [sd * 3.8, -12]], { stroke: ink, lw: 1.5 });
        circle(sd * 3.9, -12.7, 1.4, { fill: gold, stroke: ink, lw: .6 });
      });
      ellipse(0, 0, 8.7, 7.5, { fill: yellow, stroke: ink, lw: .9 });
      ellipse(0, 4.2, 7.3, 4.7, { fill: cream, stroke: ink, lw: .65 });
      [-1, 1].forEach(sd => circle(sd * 3, -1.4, 1, { fill: '#302331', stroke: null }));
      [-1, 1].forEach(sd => circle(sd * 2.4, 4, .55, { fill: ink, stroke: null }));
      line([[-3.3, 6], [0, 7.2], [3.4, 5.7]], { stroke: ink, lw: .65, smooth: true });
      X.restore();
    });
    X.restore();
  }

  function sparkles(t, amount = 1) {
    for (let i = 0; i < 20; i++) {
      const age = frac(t * .34 + hash(i + 70)), x = 90 + hash(i + 2) * 1740;
      const y = -30 + age * 1040, rot = t * (i % 2 ? 2 : -2) + i;
      X.save(); X.translate(x, y); X.rotate(rot);
      shape(rectPts(-5, -12, 10, 24), { fill: ['#FFE76D', '#F078A5', '#75D6D0', '#FFFFFF'][i % 4], stroke: null, alpha: amount * (1 - age * .35) });
      X.restore();
    }
  }

  function drawPair(t, mode) {
    const beat = t * 112 / 60, hop = Math.abs(Math.sin(beat * Math.PI));
    const final = mode === 'final' ? ease(seg(t, 16.1, 17)) : 0;
    const twirl = mode === 'final' ? ease(seg(t, 12.2, 15.2)) : 0;
    let pose;
    if (mode === 'hello') pose = jennaDance(t, t < 3 ? 'bounce' : 'sway', { k: .8 });
    else if (mode === 'disco') pose = jennaDance(t, 'disco', { k: 1 });
    else pose = twirl < .98 ? jennaDance(t, 'twirl', { k: .9 }) : jennaDance(t, 'arm wave', { k: 1 });
    // Override only the finishing arm; her left hand remains the plush-carrying grip.
    if (final > 0) pose = { ...pose, handR: mixPt(pose.handR || [3.5, -14], [5.3, -22], final), handPoseR: 'palm', jump: .8 * hop * (1 - final), eyes: 'happy', mouth: 'grin' };
    const jx = 655 + (mode === 'disco' ? 35 * Math.sin(t * .7) : 0);
    bigGiraffe(1240, 953, 6.55, { t, flip: true, sway: final ? -.65 : Math.sin(beat * Math.PI / 2),
      step: final ? 0 : Math.sin(beat * Math.PI), bow: mode === 'hello' ? .15 * (1 - ease(seg(t, 2.5, 3.4))) : 0,
      jump: mode === 'final' ? 7 * hop * (1 - final) : 0 });
    return jenna(jx, 951, 14.6, { ...pose, t, giraffe: true, lookX: .72, turn: .18, tilt: (pose.tilt || 0) - .03 });
  }

  function helloDance(t) {
    const push = ease(seg(t, 0, 7));
    backdrop(t, 1 + .04 * push, -25 * push);
    drawPair(t, 'hello');
    if (t < 3.5) {
      X.font = `54px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#FFF8D7';
      X.strokeStyle = ink; X.lineWidth = 10; X.strokeText('GIRAFFE GROOVE!', 960, 120); X.fillText('GIRAFFE GROOVE!', 960, 120);
    }
    if (t > 2.75 && t < 3.7) sfx('CLAP!', 960, 350, 78, '#FFF06A', t - 2.75);
  }

  function discoDance(t) {
    const drift = 35 * Math.sin((t - 7) * .7);
    camBegin(960 + drift, 540, 1.035, .006 * Math.sin(t));
    backdrop(t, 1, drift); drawPair(t, 'disco'); camEnd();
    for (let i = 0; i < 7; i++) {
      const a = t * .8 + i * TAU / 7, x = 960 + Math.cos(a) * 760, y = 420 + Math.sin(a) * 280;
      shape(starPts(x, y, 17 + 6 * Math.sin(t * 3 + i), .42, 5), { fill: '#FFF4A8', stroke: null, alpha: .55 });
    }
  }

  function finaleDance(t) {
    const hit = ease(seg(t, 16.1, 17));
    backdrop(t, 1 + .06 * hit, 0); drawPair(t, 'final');
    if (t >= 15.2) sparkles(t, ease(seg(t, 15.2, 16)));
    if (t >= 16.4) {
      X.font = `${Math.round(58 + 12 * hit)}px ${FONT_SFX}`; X.textAlign = 'center'; X.fillStyle = '#FFF8D7';
      X.strokeStyle = ink; X.lineWidth = 11; X.strokeText('BIG FRIENDS, BIG MOVES!', 960, 125); X.fillText('BIG FRIENDS, BIG MOVES!', 960, 125);
    }
    if (t > 17.1) sfx('TA-DA!', 960, 335, 92, '#FFE46B', t - 17.1);
    if (t > 17.55) iris(960, 520, lerp(1300, 0, ease(seg(t, 17.55, 18))));
  }

  scene({ duration: 18, fps: 24, bpm: 112, shots: [[0, helloDance], [7, discoDance], [12, finaleDance]] });
})();
