(() => {
  const set = LOCATIONS.home_clinic, lines = ASSETS.scene.scene16_employment_etiquette.dialogue;
  const ink = '#352A42';
  const box = (x, y, w, h, fill, stroke = ink) => shape(rectPts(x, y, w, h), { fill, stroke, lwPx: 3, smooth: .06 });
  function label(s, x, y, size, color = ink) {
    X.font = `600 ${size}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = color; X.fillText(s, x, y);
  }
  const speaking = (t, speaker) => lines.some(l => l.speaker === speaker && t > l.at + .2 && t < l.at + .2 + l.text.length / l.cps);
  function phone(a, s) {
    X.save(); X.translate(a.handR[0], a.handR[1]); X.rotate(.08);
    box(-.7 * s, -2.5 * s, 1.4 * s, 3.8 * s, '#29384B');
    box(-.43 * s, -2.1 * s, .86 * s, 2.5 * s, '#A1D4DA', null);
    circle(0, .8 * s, .12 * s, { fill: '#E0ECF0', stroke: null }); X.restore();
  }
  function bubble(t, speaker, a) {
    for (const l of lines.filter(l => l.speaker === speaker)) callout(l.text, a.mouth[0], a.mouth[1], t - l.at, {
      dx: 1270 - a.mouth[0], dy: 410 - a.mouth[1], size: 52, maxW: 640, cps: l.cps, hold: l.hold,
      accent: speaker === 'sami' ? '#397A78' : '#973E59',
    });
  }
  function interior(t, office = false) {
    const k = 3.45 + .04 * Math.sin(t * .25), z = 1000;
    const P = persp({ x: office ? 90 : 0, y: 130, z: z - 1100 / k, f: 1100, hy: 1030 - 130 * k });
    const mode = office ? 'office' : 'home';
    layer(() => set.back(P, t, { mode }), { blur: 1.6 });
    const pos = P.p(office ? 0 : -130, 0, z), s = 6 * pos[2];
    const questioning = t >= 11, emote = ease(seg(t, 11, 11.6));
    const opts = { t, handR: [6, -21.5], tilt: office ? -.02 : -.05 * emote,
      handL: office ? [-5, -13.5 + .25 * Math.sin(t * 2)] : [-4.8, -10.5 - emote * 2],
      mouth: lipFlap(t, speaking(t, office ? 'patrick' : 'sami'), office ? 'flat' : questioning ? 'smirk' : 'smile'),
      brows: office ? 'angry' : questioning ? 'quizzical' : 'normal',
      ...(questioning && !office ? { blink: Math.sin(Math.PI * seg(t, 11, 11.5)) } : {}),
    };
    const a = office ? patrick(pos[0], pos[1], s, opts) : sami(pos[0], pos[1], s, opts);
    phone(a, s); set.front(P, t, { mode });
    label(office ? 'CLINIC OFFICE' : 'AT HOME', 960, 70, 30, '#6C596C');
    bubble(t, office ? 'patrick' : 'sami', a);
  }
  function drone(x, y, k, t) {
    X.save(); X.translate(x, y + 5 * Math.sin(t * 2)); X.scale(k, k);
    line([[-55, 0], [55, 0]], { stroke: ink, lwPx: 7 });
    line([[-45, 0], [-45, -12]], { stroke: ink, lwPx: 4 });
    line([[45, 0], [45, -12]], { stroke: ink, lwPx: 4 });
    [-45, 45].forEach(cx => {
      ellipse(cx, -14, 30, 4, { fill: 'rgba(74,95,112,.3)', stroke: '#6A8193', lwPx: 2 });
      const rotor = 28 * Math.cos(t * 45);
      line([[cx - rotor, -14], [cx + rotor, -14]], { stroke: '#354859', lwPx: 3 });
    });
    box(-25, -10, 50, 22, '#718C9D');
    circle(0, 1, 5, { fill: '#BCECDD', stroke: ink, lwPx: 2 });
    line([[-18, 12], [-22, 25], [-33, 25]], { stroke: ink, lwPx: 3 });
    line([[18, 12], [22, 25], [33, 25]], { stroke: ink, lwPx: 3 });
    if (t < 28) line([[0, 12], [0, 45]], { stroke: ink, lwPx: 3 });
    X.restore();
  }
  function book(x, floor, k, t) {
    X.save(); X.translate(x, floor); X.scale(k, k);
    // Turn from a narrow spine silhouette to the cover during the descent.
    X.scale(lerp(.22, 1, ease(seg(t, 29.5, 31))), 1);
    const landed = ease(seg(t, 35.5, 36));
    ellipse(0, 7, 100, 10, { fill: `rgba(40,20,30,${.08 + .14 * landed})`, stroke: null });
    X.rotate((1 - landed) * .025 * Math.sin(t * 2));
    box(-88, -149, 184, 156, '#F9ECD4');
    for (let i = 0; i < 4; i++) line([[-82, -2 + i * 2], [94, -2 + i * 2]], { stroke: '#C6B593', lwPx: 1 });
    box(-96, -157, 184, 154, '#743C57'); box(-96, -157, 17, 154, '#512F49');
    box(-67, -139, 139, 112, '#FFF0CB');
    label('The Etiquette', 2, -112, 17, '#58374B');
    label('of', 2, -84, 16, '#58374B');
    label('Employment', 2, -55, 18, '#58374B');
    X.restore();
  }
  function parachute(x, bookTop, k, t) {
    const open = backOut(seg(t, 29.2, 30.2)), collapse = ease(seg(t, 35.5, 37.2));
    if (open <= 0) return;
    X.save(); X.translate(x, bookTop); X.scale(k, k);
    const y = lerp(-115, 142, collapse), ry = lerp(65, 8, collapse), rx = 105 * open;
    X.globalAlpha = 1 - collapse * .35;
    shape([[-rx, y], [-rx * .8, y - ry * .65], [0, y - ry], [rx * .8, y - ry * .65], [rx, y], [rx * .5, y - 8], [0, y], [-rx * .5, y - 8]],
      { fill: '#FFF5DD', stroke: ink, lwPx: 3, smooth: .4 });
    shape([[-rx * .25, y - ry * .94], [rx * .25, y - ry * .94], [rx * .45, y - 8], [0, y], [-rx * .45, y - 8]],
      { fill: '#E6B260', stroke: null, smooth: .3 });
    [-1, -.5, .5, 1].forEach(v => line([[rx * v, y], [v * 68, 0]], { stroke: '#7C7481', lwPx: 1.5 }));
    X.restore();
  }
  function exterior(t, close = false) {
    const k = (close ? 2.6 : 2) + .018 * Math.sin(t * .4), z = 1000;
    const P = persp({ x: close ? -30 : 0, y: 140, z: z - 1100 / k, f: 1100, hy: 1030 - 140 * k });
    set.back(P, t, { mode: 'outside' });
    // Walk from the open door into the yard; keep the phone hand at the ear throughout.
    const walk = ease(seg(t, 22, 25)), wx = lerp(-130, -225, walk), wz = lerp(1350, 1000, walk);
    const pos = P.p(wx, 0, wz), s = SAMI_UNIT * pos[2];
    const surprised = ease(seg(t, 25.4, 26)), deadpan = ease(seg(t, 35.4, 36));
    const a = sami(pos[0], pos[1], s, { t, ...samiWalk(walk * 6, Math.sin(Math.PI * walk)),
      handR: [6, -21.5], handPoseR: 'fist', lookX: .7, lookY: -.8 * (1 - deadpan),
      eyes: surprised > .5 && deadpan < .5 ? 'wide' : 'open',
      brows: deadpan > .5 ? 'quizzical' : surprised > .5 ? 'up' : 'normal',
      mouth: deadpan > .5 ? 'smirk' : surprised > .5 ? 'o' : 'flat',
      blink: Math.max(Math.sin(Math.PI * seg(t, 25.3, 25.8)), Math.sin(Math.PI * seg(t, 35.4, 35.9))),
      tilt: -.04 * surprised,
    });
    phone(a, s);
    const dp = P.p(90, 400, z);
    drone(dp[0] - 155 * k * ease(seg(t, 28, 29.5)), dp[1], k, t);
    // Before release the same single book hangs beneath the drone. It never duplicates.
    const descent = ease(seg(t, 28, 35.5)), bookFloor = lerp(dp[1] + 202 * k, 1030, descent);
    const bx = dp[0] + 12 * Math.sin(t * 1.6) * Math.sin(Math.PI * descent);
    parachute(bx, bookFloor - 157 * k, k, t);
    book(bx, bookFloor, k, t);
    if (!close) label('HOME', 330, 70, 28, '#527379');
  }
  scene({ duration: 42, fps: 24, bpm: 90, shots: [
    [0, t => interior(t)], [6, t => interior(t, true)], [11, t => interior(t)],
    [15, t => interior(t, true)], [22, t => exterior(t)], [28, t => exterior(t)],
    [36, t => exterior(t, true)],
  ] });
})();
