// A staged, illustrative app demo. Every interaction and trace is a pure function of time.
(() => {
  const HALL = LOCATIONS.lecture_hall;
  const LINES = ASSETS.scene.scene14_vent_tutor.dialogue;
  const MINT = '#8AE5B3', CYAN = '#83D8FF', GOLD = '#FFD684', DARK = '#173644';
  const MODES = ['Volume control', 'Pressure control', 'Pressure support'];
  const speaking = t => LINES.some(l => {
    const n = (t - l.at - .2) * l.cps;
    return n > 0 && n < l.text.replace(/\*/g, '').length;
  });
  const windowK = (t, a, b) => ease(seg(t, a, a + .5)) * (1 - ease(seg(t, b - .5, b)));
  function text(str, x, y, size = 28, color = '#EDF9F6', weight = 600) {
    X.font = `${weight} ${size}px ${FONT_TALK}`;
    X.fillStyle = color; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(str, x, y);
  }
  function box(x, y, w, h, fill, stroke = null) {
    shape(rectPts(x, y, w, h), { fill, stroke, lwPx: 2, smooth: .08 });
  }
  function modeWeights(t) {
    const pc = ease(seg(t, 27.8, 28.5)), ps = ease(seg(t, 32.8, 33.5));
    const reset = ease(seg(t, 55.2, 55.9));
    return [1 - pc + pc * reset, (pc - ps) * (1 - reset), ps * (1 - reset)];
  }
  // Normalized, stylized waveforms: no units or patient-specific settings.
  function trace(phase, row, mode, mechanics, setting) {
    const u = ((phase % 1) + 1) % 1, inspiration = u < .36;
    const rise = Math.min(1, u / .07), decay = Math.exp(-Math.max(0, u - .36) * 8);
    if (row === 0) {
      const vc = inspiration ? u / .36 : .2 * decay;
      const pc = inspiration ? rise : decay;
      const ps = inspiration ? Math.sin(Math.PI * u / .45) * rise : .6 * decay;
      return (vc * mode[0] + pc * mode[1] + ps * mode[2]) * (.72 + .18 * mechanics + .12 * setting);
    }
    if (row === 1) {
      const vc = inspiration ? .8 : -.72 * decay;
      const pc = inspiration ? Math.exp(-u * 5) : -.72 * decay;
      const ps = inspiration ? Math.sin(Math.PI * u / .36) : -.6 * decay;
      return (vc * mode[0] + pc * mode[1] + ps * mode[2]) * (1 - .18 * mechanics + .16 * setting);
    }
    const v = inspiration ? u / .36 : decay;
    return v * (.85 - .18 * mechanics + .15 * setting);
  }
  function cursor(t) {
    return kf(t, [[0, [895, 608]], [15.6, [895, 608]], [16.4, [570, 243]], [20.5, [925, 243]],
      [22.1, [180, 105]], [22.8, [180, 105]], [26.8, [180, 105]], [27.8, [505, 105]],
      [32, [505, 105]], [32.8, [830, 105]], [36.8, [830, 105]], [38, [810, 523]],
      [43.8, [810, 523]], [45, [646, 584]], [48, [826, 584]], [53.8, [826, 584]],
      [55.2, [886, 48]], [57, [886, 48]], [59, [945, 632]]], ease);
  }
  function display(t) {
    X.save(); X.translate(850, 285);
    box(-10, -10, 1010, 700, '#FFF9E9', PAL.ink);
    box(0, 0, 990, 680, DARK);
    text('vent-tutor', 28, 47, 43, MINT, 800);
    text('Patient–ventilator simulation', 285, 48, 25);
    box(838, 27, 110, 42, '#30515F'); text('Reset', 853, 48, 25);
    const weights = modeWeights(t), selected = weights.indexOf(Math.max(...weights));
    MODES.forEach((label, i) => {
      box(24 + i * 325, 82, 310, 46, i === selected ? MINT : '#30515F');
      text(label, 39 + i * 325, 105, 26, i === selected ? DARK : '#EDF9F6');
    });
    const reset = ease(seg(t, 55.2, 55.9));
    const mechanics = ease(seg(t, 38, 39)) * (1 - reset);
    const setting = ease(seg(t, 45, 48)) * (1 - reset);
    const inspect = windowK(t, 16, 21.5), compare = windowK(t, 45, 54);
    const labels = ['Pressure', 'Flow', 'Volume'], colors = [MINT, CYAN, GOLD];
    labels.forEach((label, row) => {
      const top = 155 + row * 104, zero = top + (row === 1 ? 51 : 79), amp = row === 1 ? 39 : 62;
      text(label, 26, top + 35, 25, colors[row]);
      box(175, top, 785, 92, '#102D38');
      for (let j = 0; j <= 8; j++) line([[190 + j * 94, top + 5], [190 + j * 94, top + 88]], { stroke: '#284753', lwPx: 1 });
      line([[190, zero], [946, zero]], { stroke: '#40606A', lwPx: 1 });
      function points(prior = false) {
        return Array.from({ length: 380 }, (_, j) => {
          const phase = j / 379 * 3 - t * .24;
          return [190 + j / 379 * 756, zero - amp * trace(phase, row, weights, mechanics, prior ? 0 : setting)];
        });
      }
      if (compare > 0) line(points(true), { stroke: '#78929A', lwPx: 2, alpha: compare * .7, dash: [5, 6] });
      line(points(), { stroke: colors[row], lwPx: 3 });
      if (inspect > 0) {
        const px = cursor(t)[0], phase = (px - 190) / 756 * 3 - t * .24;
        line([[px, top + 3], [px, top + 89]], { stroke: '#FFFFFF', lwPx: 2, alpha: inspect });
        circle(px, zero - amp * trace(phase, row, weights, mechanics, setting), 6, { fill: colors[row], stroke: '#FFFFFF', lwPx: 2 });
      }
    });
    text(inspect > .1 ? 'Inspect a breath' : compare > .1 ? 'Before / after: change a setting' : 'Explore • observe • understand', 190, 486, 23, '#BBCFD3');
    // Patient schematic and a paired ventilator: the breath gently inflates the lungs.
    const breath = .5 + .5 * Math.sin(t * 1.5), lung = 1 + breath * .09 * (1 - .4 * mechanics);
    box(28, 515, 110, 97, '#30515F');
    text('SIM', 49, 543, 23, MINT); line([[43, 566], [64, 566], [73, 551], [84, 580], [95, 566], [122, 566]], { stroke: MINT, lwPx: 3 });
    line([[139, 552], [169, 552], [169, 529], [228, 529], [228, 555]], { stroke: CYAN, lwPx: 5 });
    ellipse(207, 578, 20 * lung, 31 * lung, { fill: mixCol(MINT, GOLD, mechanics), stroke: '#ECFFF8', lwPx: 2 });
    ellipse(249, 578, 20 * lung, 31 * lung, { fill: mixCol(MINT, GOLD, mechanics), stroke: '#ECFFF8', lwPx: 2 });
    line([[228, 537], [228, 568], [209, 581]], { stroke: '#ECFFF8', lwPx: 3 });
    line([[228, 568], [248, 581]], { stroke: '#ECFFF8', lwPx: 3 });
    text('Scenario', 316, 523, 26, '#BBCFD3');
    box(464, 503, 496, 39, '#30515F'); text(mechanics > .5 ? 'Changed lung mechanics' : 'Baseline', 481, 524, 25);
    text('Settings', 316, 582, 26, '#BBCFD3');
    line([[464, 584], [924, 584]], { stroke: '#6E929A', lwPx: 8 });
    line([[464, 584], [646 + 180 * setting, 584]], { stroke: MINT, lwPx: 8 });
    circle(646 + 180 * setting, 584, 13, { fill: MINT, stroke: '#FFFFFF', lwPx: 3 });
    text('Illustrative demo', 28, 646, 22, '#BBCFD3');
    text(t >= 59 ? 'One simulated breath at a time.' : 'Modes • waveforms • clinical scenarios', 315, 646, 26, MINT);
    if (t < 59) {
      const [cx, cy] = cursor(t);
      shape([[cx, cy], [cx + 4, cy + 29], [cx + 13, cy + 21], [cx + 24, cy + 33], [cx + 30, cy + 28], [cx + 18, cy + 16], [cx + 29, cy + 13]], { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 2 });
      [22.8, 27.8, 32.8, 38, 55.2].forEach(at => {
        const age = t - at;
        if (age >= 0 && age < .5) circle(cx, cy, 10 + age * 45, { fill: null, stroke: MINT, lwPx: 3, alpha: 1 - age * 2 });
      });
    }
    X.restore();
  }
  function pose(t) {
    const pointing = windowK(t, 15.4, 35.5) + windowK(t, 43.9, 53.7);
    const welcome = windowK(t, .5, 9.8) + windowK(t, 59, 68.5);
    const joke = windowK(t, 54.4, 58.8);
    return {
      t, turn: .08 * Math.sin(t * .3), tilt: .025 * Math.sin(t * .8), lookX: .4 * pointing,
      handL: mixPt([-4.4, -8.1], [-5.3, -12.4], welcome),
      handR: mixPt(mixPt([4.4, -8.1], [5.3, -12.4], welcome), [6.2, -16.5], pointing),
      handPoseL: 'palm', handPoseR: pointing > .5 ? 'point' : 'palm',
      mouth: lipFlap(t, speaking(t), joke > .5 ? 'grin' : 'smile'),
      eyes: joke > .5 ? 'happy' : 'open', brows: 'up',
      bulb: windowK(t, 49.4, 53.4) * .65,
    };
  }
  function shot(t, emphasis) {
    const push = .04 * ease(seg(t, 0, 10));
    const k = 3.25 + push + .025 * Math.sin(t * .23);
    const z = 1990, y = HALL.STAGE.y;
    const cam = { x: -110 + 3 * Math.sin(t * .19), y: 190, z: z - 1800 / k, f: 1800, hy: 1000 - (190 - y) * k };
    const P = persp(cam);
    layer(() => HALL.back(P, t, { splitZ: z, screen: 0 }), { blur: 2 });
    const [sx, sy, scale] = P.p(-290, y, z);
    const A = sami(sx, sy, SAMI_UNIT * scale, pose(t));
    HALL.front(P, t, { splitZ: z });
    display(t);
    text('DOCTOR SAMI', 95, 1024, 28, '#355867', 800);
    text(emphasis, 866, 242, 31, '#355867', 800);
    for (const l of LINES) callout(l.text, A.mouth[0] + 2 * SAMI_UNIT * scale, A.mouth[1], t - l.at,
      { dx: 65, dy: -220, size: 43, maxW: 560, cps: l.cps, hold: l.hold, accent: '#247B69' });
  }
  scene({ duration: 68, fps: 24, bpm: 100,
    shots: [[0, t => shot(t, 'A breath of innovation')], [10, t => shot(t, 'See patient–ventilator interactions')],
      [22, t => shot(t, 'Explore ventilation modes')], [36, t => shot(t, 'Simulate a clinical scenario')],
      [44, t => shot(t, 'Change settings. See the response.')], [54, t => shot(t, 'Reset. Explore again.')],
      [59, t => shot(t, 'Turn curiosity into understanding')]],
  });
})();
