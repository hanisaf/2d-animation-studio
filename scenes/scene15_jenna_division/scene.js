(() => {
  const school = LOCATIONS['meadow-ridge-elementary-school'];
  const lines = ASSETS.scene.scene15_jenna_division.dialogue;
  const ink = '#352A42', pink = '#A74476', blue = '#246799';
  const colors = ['#ED7374', '#E6B544', '#5BA6DE', '#76BC89'];
  const windowK = (t, a, b) => ease(seg(t, a, a + .5)) * (1 - ease(seg(t, b - .5, b)));
  const talks = (t, speaker) => lines.some(l => l.speaker === speaker &&
    t > l.at + .2 && t < l.at + .2 + l.text.replace(/\*/g, '').length / l.cps);
  const playK = t => windowK(t, 45, 49.5) + ease(seg(t, 211, 212));
  const pickupK = t => ease(seg(t, 45, 46.2)) * (1 - ease(seg(t, 62, 64))) + ease(seg(t, 211, 212));
  const sadnessK = t => ease(seg(t, 53.4, 54)) * (1 - ease(seg(t, 67.5, 68.2)));
  const joyK = t => ease(seg(t, 68, 68.7)) * (1 - ease(seg(t, 86.4, 87))) + ease(seg(t, 149.5, 150.2));
  const stepTimes = [130, 133.5, 137, 140.5, 144];
  const remainders = [45, 36, 27, 18, 9, 0];
  const biteTimes = [216.2, 220.2];
  const eatingK = t => biteTimes.reduce((k, at) => k + ease(seg(t, at - 1, at)) * (1 - ease(seg(t, at + .8, at + 1.8))), 0);

  function label(text, x, y, size = 32, color = ink) {
    X.font = `700 ${size}px ${FONT_TALK}`;
    X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = color;
    X.fillText(text, x, y);
  }
  function box(x, y, w, h, fill, stroke = ink) {
    shape(rectPts(x, y, w, h), { fill, stroke, lwPx: 3, smooth: .08 });
  }
  function toyCar(x, y, color, angle = 0, scale = 1) {
    X.save(); X.translate(x, y); X.rotate(angle); X.scale(scale, scale);
    ellipse(0, 27, 69, 10, { fill: 'rgba(35,32,45,.15)', stroke: null });
    shape([[-63, 10], [-57, -13], [-28, -17], [-12, -43], [24, -43], [44, -17], [62, -12], [66, 13], [56, 21], [-54, 21]],
      { fill: color, stroke: ink, lwPx: 4, smooth: .15 });
    shape([[-21, -19], [-7, -35], [17, -35], [29, -19]], { fill: '#DDF4FF', stroke: ink, lwPx: 2 });
    line([[8, -35], [8, -19]], { stroke: ink, lwPx: 2 });
    [-39, 40].forEach(cx => {
      circle(cx, 19, 14, { fill: ink, stroke: '#251E30', lwPx: 2 });
      circle(cx, 19, 6, { fill: '#E9E3E9', stroke: null });
    });
    box(54, -8, 9, 8, '#FFF4BD', null);
    X.restore();
  }
  function table(t, hand) {
    const visible = ease(seg(t, 16, 16.7)) * (1 - ease(seg(t, 80.5, 81.5)) + ease(seg(t, 210, 211)));
    if (visible <= 0) return;
    X.save(); X.globalAlpha = visible;
    box(540, 926, 28, 136, '#416E98'); box(1352, 926, 28, 136, '#416E98');
    box(505, 731, 910, 216, '#F7F0D9');
    box(505, 934, 910, 18, '#527FA5');
    const split = ease(seg(t, 23.6, 24));
    X.save(); X.globalAlpha *= split;
    box(528, 750, 412, 171, '#FCE0EB', '#CD8AAA');
    box(980, 750, 412, 171, '#DDEFFC', '#7BA7C9');
    label(t >= 35 ? 'Jenna · 2 cars' : 'Jenna', 734, 769, 28, pink);
    label(t >= 35 ? 'Danny · 2 cars' : 'Danny', 1186, 769, 28, blue);
    X.restore();
    if (split < .5) label('4 toy cars to share', 960, 779, 33);
    // Deal alternately: one to Jenna, one to Danny, then one more each.
    const destinations = [630, 1082, 838, 1290];
    const play = playK(t);
    // Pick up just one of Danny's two cars; never create or remove a car.
    const pickup = pickupK(t);
    for (let i = 0; i < 4; i++) {
      const deal = ease(seg(t, 24 + i, 24.8 + i));
      // Undealt cars wait in a smaller upper row; dealt cars cannot hide them.
      const idleY = lerp(859, 813, split), idleScale = lerp(1, .65, split);
      let x = lerp(730 + i * 155, destinations[i], deal);
      let y = lerp(idleY, 886, deal) + 24 * Math.sin(Math.PI * deal);
      if (i === 3) {
        x = lerp(x, hand[0] - 15, pickup) + play * 23 * Math.sin(t * 3.2);
        y = lerp(y, hand[1] - 13, pickup);
        const racing = ease(seg(t, 214.5, 215.5));
        x = lerp(x, 1265 + 50 * Math.sin((t - 215.5) * 2), racing);
        y = lerp(y, 886, racing);
      }
      const aside = ease(seg(t, 78 + i * .35, 78.65 + i * .35)) * (1 - ease(seg(t, 210, 211)));
      x = lerp(x, 579 + i * 36, aside); y = lerp(y, 890, aside);
      toyCar(x, y, colors[i], i === 3 ? play * .1 * Math.sin(t * 4) : 0, lerp(lerp(idleScale, 1, deal), .35, aside));
    }
    if (t >= 35) {
      box(682, 959, 556, 105, '#FFFCF2');
      label('4 ÷ 2 = 2  ·  2 cars each', 960, 986, 35);
      if (t >= 42) label('2 + 2 = 4', 960, 1034, 36, '#397854');
    }
    X.restore();
  }
  function whiteboard(t) {
    const visible = ease(seg(t, 81, 82)) * (1 - ease(seg(t, 209, 211)));
    if (visible <= 0) return;
    X.save(); X.globalAlpha = visible;
    box(574, 963, 25, 95, '#657E87'); box(1321, 963, 25, 95, '#657E87');
    box(510, 447, 900, 516, '#65838D'); box(527, 463, 866, 484, '#FFFEF7');
    const heading = '45 ÷ 9', count = stepTimes.filter(at => t >= at + 1.4).length;
    label(t >= 150 ? '45 ÷ 9 = 5' : heading.slice(0, Math.floor(seg(t, 82, 84) * heading.length)), 960, 507, 68, ink);
    if (t >= 104) {
      label('45 pieces of candy · 9 pieces per friend', 960, 551, 27, pink);
      stepTimes.forEach((at, i) => {
        if (t < at) return;
        const row = `${remainders[i]} − 9 = ${remainders[i + 1]}`;
        const typed = row.slice(0, Math.floor(seg(t, at, at + 1.4) * row.length));
        const y = 599 + i * 61;
        if (t < at + 3.5) box(556, y - 26, 808, 53, '#E7F5ED', null);
        label(typed, 820, y, 44, '#264D62');
        if (t >= at + 1.4) label(`(Friend ${i + 1})`, 1215, y, 31, '#397854');
      });
      label(`Candy left: ${remainders[count]}`, 733, 925, 28, pink);
      label(`Friends given candy: ${count}`, 1161, 925, 28, blue);
    }
    if (t >= 194) {
      // Leave the completed candy example visible and add Danny's new answer.
      box(659, 963, 602, 87, '#FFF9EE');
      label('14 ÷ 2 = 7', 960, 1004, 52, '#397854');
    }
    // The result stays hidden until Danny announces that he counted five friends.
    X.restore();
  }
  function carTote(t) {
    const visible = windowK(t, 77.5, 82);
    if (visible <= 0) return;
    X.save(); X.globalAlpha = visible;
    box(540, 906, 172, 53, '#8FB3C3');
    label('Cars for later', 626, 933, 20);
    const lid = ease(seg(t, 80, 80.6));
    box(532, lerp(966, 883, lid), 188, 22, '#547C8E');
    X.restore();
  }
  function candy(x, y, color, scale = 1) {
    ellipse(x, y, 11 * scale, 9 * scale, { fill: color, stroke: ink, lwPx: 2 });
    ellipse(x - 3 * scale, y - 3 * scale, 3 * scale, 2 * scale, { fill: '#FFFFFF', stroke: null, alpha: .7 });
  }
  function treats(t, dp, hand) {
    const visible = ease(seg(t, 210, 211));
    if (visible <= 0) return;
    X.save(); X.globalAlpha = visible;
    const cx = dp[0] + 104, cy = dp[1] - 161;
    box(cx - 75, cy + 35, 150, 17, '#527FA5');
    box(cx + 49, cy + 52, 15, 126, '#416E98');
    ellipse(cx, cy + 10, 61, 16, { fill: '#FFF1D5', stroke: ink, lwPx: 3 });
    label('Treats', cx, cy + 76, 24, pink);
    const candyColors = ['#F28BA8', '#F3C84E', '#85C7A0'];
    candyColors.forEach((color, i) => {
      if (i < 2 && t >= biteTimes[i] - 1) return;
      candy(cx - 26 + i * 26, cy, color);
    });
    biteTimes.forEach((at, i) => {
      // A candy leaves the plate, follows his hand, and disappears at the bite.
      if (t >= at - 1 && t < at) candy(hand[0] - 5, hand[1] - 7, candyColors[i]);
    });
    X.restore();
  }
  function lesson(t) {
    const z = 2240, k = 3.65 + .035 * Math.sin(t * .16);
    const P = persp({ x: 2 * Math.sin(t * .12), y: 165, z: z - 1100 / k, f: 1100, hy: 1038 - 165 * k });
    layer(() => school.back(P, t, { splitZ: z }), { blur: 2 });
    const jp = P.p(-170, 0, z), dp = P.p(170, 0, z);
    const writing = windowK(t, 82, 84.5) + windowK(t, 129.7, 146.3);
    const settingAside = windowK(t, 77.5, 81);
    const pointing = windowK(t, 22, 45) + windowK(t, 61, 74) + windowK(t, 95, 149), correction = windowK(t, 49, 54);
    const playing = playK(t), holding = pickupK(t);
    const sad = sadnessK(t), joy = joyK(t), reach = windowK(t, 56, 60);
    const nervous = windowK(t, 86.4, 104);
    const clapping = windowK(t, 149.5, 159.5);
    const clapSpread = .6 + 1.3 * (.5 + .5 * Math.sin(t * 13));
    const wink = windowK(t, 95, 97.5) + windowK(t, 223, 226) + ease(seg(t, 232, 232.4));
    const laughing = windowK(t, 171.5, 177.5);
    const fafy = t >= 221.5, liftFafy = ease(seg(t, 222, 223.5));
    const fetchFafy = windowK(t, 221, 223.5);
    const reward = ease(seg(t, 210, 211)), eating = eatingK(t);
    const chewing = biteTimes.some(at => t >= at && t < at + .8);
    // Change faces during a blink, with posture easing into and out of sadness.
    const sadBlink = Math.sin(Math.PI * seg(t, 53.4, 54));
    const happyBlink = Math.sin(Math.PI * seg(t, 67.7, 68.3));
    const surpriseBlink = Math.sin(Math.PI * seg(t, 86.4, 87));
    const proudBlink = Math.sin(Math.PI * seg(t, 149.5, 150.2));
    const ja = jenna(jp[0], jp[1], JENNA_UNIT * jp[2], {
      t, giraffe: fafy, dy: .08 * Math.sin(t * 2) + laughing * .12 * Math.sin(t * 9), tilt: -.035 + .018 * Math.sin(t), lookX: fafy ? 0 : .4,
      handL: mixPt(mixPt([-3.8, -11.5], [-4, -5.4], fetchFafy), [-4.7, -16], liftFafy),
      handPoseL: fafy ? 'grip' : 'palm',
      handR: mixPt(mixPt(mixPt([3.5, -12], [6.5, -14.3], Math.max(pointing, correction)), [7, -18 + .3 * Math.sin(t * 5)], writing), [7, -9], settingAside),
      handPoseR: pointing + correction > .5 ? 'point' : 'palm',
      blink: windowK(t, 48.6, 49.1), brows: correction > .5 ? 'focused' : 'normal',
      eyes: wink > .5 ? 'wink' : laughing > .5 || (t >= 160 && t < 166) ? 'happy' : 'open',
      mouth: lipFlap(t, talks(t, 'jenna'), laughing > .5 || (t >= 160 && t < 166) ? 'grin' : 'smile'),
    });
    const da = danny(dp[0], dp[1], DANNY_UNIT * dp[2], {
      t, dy: .1 * Math.sin(t * 2.2) + sad * .25, tilt: playing * .07 - sad * .08, lean: -.02 * holding - sad * .035,
      jump: joy * .3 * Math.abs(Math.sin(t * 3)),
      lookX: -.4, lookY: Math.max(holding * .65, sad * .85),
      handL: mixPt(mixPt([-3.8, -10], [-6, -13 + playing * .7 * Math.sin(t * 3.2)], holding), [-clapSpread, -17], clapping),
      handR: mixPt(mixPt(mixPt(mixPt(mixPt([3.8, -10.5], [-5.6, -15], reach), [4.4, -17], joy), [clapSpread, -17], clapping), [5, -11], reward), [.4, -18.5], eating),
      handPoseL: holding > .5 ? 'fist' : 'palm', handPoseR: reach > .5 ? 'point' : 'palm',
      blink: Math.max(windowK(t, 48.7, 49.2), sadBlink, happyBlink, surpriseBlink, proudBlink),
      eyes: nervous > .5 ? 'wide' : sad > .5 ? 'open' : joy > .5 || playing > .5 ? 'happy' : 'open',
      brows: nervous > .5 || sad > .5 ? 'worried' : joy > .5 || reach > .5 ? 'up' : 'normal',
      mouth: lipFlap(t, talks(t, 'danny'), chewing ? ['smile', 'flat', 'grin'][Math.floor(t * 8) % 3] : nervous > .5 ? 'o' : sad > .5 ? 'frown' : joy > .5 || playing > .5 ? 'grin' : 'smile',
        sad > .5 ? ['frown', 'open', 'flat', 'o', 'frown', 'flat'] : ['grin', 'open', 'o', 'grin', 'smile', 'open']),
    });
    school.front(P, t, { splitZ: z });
    table(t, da.handL);
    carTote(t);
    whiteboard(t);
    treats(t, dp, da.handR);
    if (fafy && liftFafy > .6) {
      const [gx, gy] = ja.giraffe;
      box(gx - 52, gy + 150, 104, 42, '#FFF1C5');
      label('Fafy', gx, gy + 171, 28, '#8C602C');
    }
    if (writing > .02) {
      const [mx, my] = ja.handR;
      line([[mx - 7, my + 7], [mx + 25, my - 11]], { stroke: '#FBFBFA', lwPx: 10, alpha: writing });
      line([[mx + 25, my - 11], [mx + 34, my - 16]], { stroke: ink, lwPx: 7, alpha: writing });
    }
    const lipLick = windowK(t, 165.3, 166) + windowK(t, 169.5, 171);
    if (lipLick > 0) ellipse(da.mouth[0] + 10 * Math.sin(t * 6), da.mouth[1] + 5, 8, 5 * lipLick,
      { fill: '#E9889D', stroke: '#843C45', lwPx: 1.5 });
    box(61, 35, 1798, 106, '#FFF9EE');
    label('Jenna Teaches Danny Division', 960, 76, 43);
    label('Meadow Ridge Elementary', 960, 117, 26, '#55777F');
    box(jp[0] - 150, 978, 300, 75, '#FCE0EB');
    label('Jenna · 4th grade', jp[0], 1015, 30, pink);
    box(dp[0] - 150, 978, 300, 75, '#DDEFFC');
    label('Danny · 1st grade', dp[0], 1015, 30, blue);
    for (const l of lines) {
      const a = l.speaker === 'jenna' ? ja : da;
      callout(l.text, a.mouth[0], a.mouth[1], t - l.at, {
        dx: 960 - a.mouth[0], dy: 302 - a.mouth[1], size: 40, maxW: 775,
        cps: l.cps, hold: l.hold, accent: l.speaker === 'jenna' ? pink : blue,
        kind: l.at === 49 || l.at === 150 ? 'shout' : 'talk',
      });
    }
  }
  scene({ duration: 235, fps: 24, bpm: 100, shots: [
    [0, lesson], [7, lesson], [16, lesson], [22, lesson], [29, lesson], [35, lesson],
    [39, lesson], [45, lesson], [49, lesson], [54, lesson], [61, lesson],
    [68, lesson], [74, lesson], [78, lesson], [80, lesson], [87, lesson], [95, lesson],
    [104, lesson], [110, lesson], [118, lesson], [126, lesson], [130, lesson],
    [133.5, lesson], [137, lesson], [140.5, lesson], [144, lesson], [150, lesson],
    [160, lesson], [166, lesson], [172, lesson], [178, lesson], [186, lesson], [194, lesson],
    [202, lesson], [207, lesson], [214, lesson], [223, lesson],
  ] });
})();
