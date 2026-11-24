// A family skating story adapted from Jenna's pencil comic.
// Showcases the engine's visual upgrades: animated 12 fps grain, scoped boil, half-res DoF blur,
// bloom, colour grading, tapered brush strokes, motion trails/smears/springs, unified lighting &
// cast shadows/ice reflections, 3D yaw/pitch perspective + depthStage, and syllable-synced lipFlap.
(() => {
  const ink = '#3B2948', lines = ASSETS.scene.scene76_day_on_ice.dialogue;
  const box = (x, y, w, h, c, sw = 3) => shape(rectPts(x, y, w, h), { fill: c, stroke: sw ? ink : null, lwPx: sw });
  function text(s, x, y, size = 40, c = ink) {
    X.font = `700 ${size}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = c; X.fillText(s, x, y);
  }
  const activeLine = (t, who) => lines.find(l => l.speaker === who && t >= l.at + .2 && t <= l.at + .2 + l.text.replace(/\*/g, '').length / (l.cps ?? 18));

  // ---------- scene lighting presets (M3) ----------
  const HOME_LIGHT = {
    dir: [-.85, -.65], rim: 'rgba(255,244,190,.65)', rimPx: 6,
    shade: 'rgba(72,42,64,.16)', shadePx: 16, tint: 'rgba(255,230,188,.08)',
    shadowColor: 'rgba(65,40,34,.25)', shadowSkew: -.68, shadowScaleY: .25,
  };
  const MUD_LIGHT = {
    dir: [.7, -.75], rim: 'rgba(225,245,255,.58)', rimPx: 5.5,
    shade: 'rgba(56,42,68,.16)', shadePx: 15, tint: 'rgba(230,242,250,.06)',
    shadowColor: 'rgba(55,40,42,.24)', shadowSkew: .58, shadowScaleY: .25,
  };
  const RINK_LIGHT = {
    dir: [.35, -.92], rim: 'rgba(232,250,255,.66)', rimPx: 6,
    shade: 'rgba(38,60,96,.16)', shadePx: 16, tint: 'rgba(195,232,255,.08)',
    shadowColor: 'rgba(42,68,95,.22)', shadowSkew: .34, shadowScaleY: .22,
  };

  function bubbles(t, a, b) {
    for (const l of lines) {
      const p = l.speaker === 'sami' ? a : b;
      if (p) callout(l.text, ...p.mouth, t - l.at, {
        size: 44, maxW: 610, cps: l.cps, hold: l.hold, speaker: l.speaker,
        dx: l.speaker === 'sami' ? 340 : -340, dy: -185,
      });
    }
  }

  // ---------- home & mudroom sets ----------
  function room(t, mud = false) {
    box(-100, -100, 2120, 1200, linGrad(0, 0, 0, 760, [[0, '#FBF1DF'], [1, '#F1DFC4']]), 0);
    shape([[0, 750], [1920, 750], [2150, 1080], [-230, 1080]], { fill: linGrad(0, 750, 0, 1080, [[0, '#D4AE84'], [1, '#B98E64']]), stroke: ink, lwPx: 3 });
    for (let x = -500; x < 2500; x += 190) line([[960 + (x - 960) * .68, 750], [x, 1080]], { stroke: '#A8805D', lwPx: 2 });
    box(0, 724, 1920, 28, '#FFF7E6');
    if (mud) {
      box(1300, 190, 310, 560, '#729AA4');
      box(1320, 210, 270, 520, linGrad(1320, 210, 1590, 730, [[0, '#D5EEF2'], [1, '#A4CED6']]));
      circle(1550, 490, 10, { fill: '#E8C15F', stroke: ink, lwPx: 2 });
      box(180, 525, 560, 50, '#9F725E');
      for (let i = 0; i < 4; i++) { circle(250 + i * 130, 555, 9, { fill: ink, stroke: null }); line([[250 + i * 130, 555], [250 + i * 130, 580]], { stroke: ink, lwPx: 6 }); }
      box(250, 840, 500, 35, '#A1775E'); box(275, 875, 30, 100, '#805C4A'); box(680, 875, 30, 100, '#805C4A');
      bloom(() => {
        shape([[1320, 210], [1590, 210], [1590, 730], [1320, 730]], { fill: 'rgba(230,250,255,.32)', stroke: null });
      }, { radius: 26, strength: .45, glowOnly: true });
    } else {
      box(120, 210, 420, 360, '#FFF7EC');
      box(143, 233, 374, 314, linGrad(0, 233, 0, 547, [[0, '#9DD8EC'], [1, '#DDF4F9']]));
      // Sun + soft bloom streaming through the living room window (M1)
      bloom(() => {
        circle(430, 300, 44, { fill: '#FFF0A8', stroke: null });
        shape([[143, 233], [517, 233], [1080, 1080], [420, 1080]], { fill: 'rgba(255,242,190,.19)', stroke: null });
      }, { radius: 32, strength: .7 });
      line([[330, 233], [330, 547]], { stroke: '#FFF7EC', lwPx: 15 });
      line([[143, 390], [517, 390]], { stroke: '#FFF7EC', lwPx: 11 });
      box(1210, 550, 580, 260, '#95B4CA'); box(1190, 690, 620, 160, '#7196B2');
      box(1245, 625, 205, 110, '#F2CAA6'); box(1550, 625, 205, 110, '#D7BCD9');
      ellipse(920, 943, 610, 95, { fill: '#DBB2AE', stroke: null });
    }
  }

  // ---------- 3D ice arena with yaw/pitch support & bloom floodlights (M1 + M4) ----------
  function makeRinkCam(t, o = {}) {
    return persp({
      x: (o.x ?? 0) + 10 * Math.sin(t * .13),
      y: o.y ?? 155,
      z: (o.z ?? -380) + 5 * Math.sin(t * .15),
      f: o.f ?? 950,
      hy: o.hy ?? 420,
      yaw: o.yaw ?? 0,
      pitch: o.pitch ?? 0,
    });
  }

  function rinkBg(P, t) {
    // Cool arena atmosphere & ice sheet gradient
    box(-100, -100, 2120, 1200, linGrad(0, 0, 0, 1080, [[0, '#7FA2C4'], [.38, '#C8DFEE'], [.44, '#E2F2FA'], [1, '#F2FDFF']]), 0);
    const poly = (pts, c, stroke = null, lw = 3) => { const q = P.poly(pts); if (q) shape(q, { fill: c, stroke, lwPx: lw }); };
    const ln = (pts, stroke, lw = 4) => { const q = P.line(pts); if (q) line(q, { stroke, lwPx: lw }); };

    // Upper arena bowl & tiered seating behind the glass (visible in 3D as camera yaws!)
    poly([[-1800, 68, 920], [1800, 68, 920], [1800, 390, 1300], [-1800, 390, 1300]], '#8EAAC4');
    for (let r = 0; r < 4; r++) {
      const y = 105 + r * 58, z = 980 + r * 75;
      poly([[-1700, y, z], [1700, y, z], [1700, y + 20, z + 15], [-1700, y + 20, z + 15]], r % 2 ? '#7C98B4' : '#6E8AA6');
    }

    // Far dasher boards + left/right side boards for true 2-point perspective depth
    for (const side of [-1, 1]) {
      const sx = side * 1400;
      poly([[sx, 0, -200], [sx, 0, 900], [sx, 65, 900], [sx, 65, -200]], '#F3F4EA', ink, 2.5);
      poly([[sx, 0, -200], [sx, 0, 900], [sx, 9, 900], [sx, 9, -200]], '#E8BC58');
      poly([[sx, 62, -200], [sx, 62, 900], [sx, 68, 900], [sx, 68, -200]], '#5D809B');
      for (let z = 100; z <= 900; z += 260) ln([[sx, 68, z], [sx, 215, z]], '#87A9BD', 3.5);
    }
    poly([[-1400, 0, 900], [1400, 0, 900], [1400, 65, 900], [-1400, 65, 900]], '#FFFDF2', ink, 3);
    poly([[-1400, 0, 900], [1400, 0, 900], [1400, 9, 900], [-1400, 9, 900]], '#EDC05D');
    poly([[-1400, 62, 900], [1400, 62, 900], [1400, 68, 900], [-1400, 68, 900]], '#6B8EA7');

    // Plexiglass sheen & stanchions + angled steel roof trusses (using P.line!)
    poly([[-1400, 68, 900], [1400, 68, 900], [1400, 215, 900], [-1400, 215, 900]], 'rgba(225,244,252,.22)');
    for (let i = -4; i <= 4; i++) {
      ln([[i * 340, 68, 900], [i * 340, 215, 900]], '#87A9BD', 4);
      ln([[i * 340, 215, 900], [i * 220, 440, 1250]], '#6D8EA8', 6);
    }
    ln([[-1400, 215, 900], [1400, 215, 900]], '#98B7C9', 3);

    // Overhead glowing arena spotlights + scoreboard sign with bloom (M1)
    bloom(() => {
      for (const lx of [-680, 0, 680]) {
        const q = P.poly([[lx - 90, 395, 760], [lx + 90, 395, 760], [lx + 90, 415, 810], [lx - 90, 415, 810]]);
        if (q) shape(q, { fill: '#FFFDF0', stroke: '#B8D4E6', lwPx: 2 });
        const [sx, sy, k] = P.p(lx, 405, 780);
        if (P.visible([lx, 405, 780])) ellipse(sx, sy, 68 * k, 18 * k, { fill: 'rgba(235,250,255,.55)', stroke: null });
      }
      const [bx, by, bk] = P.p(590, 250, 910);
      if (P.visible([590, 250, 910])) {
        const bw = 420 * bk, bh = 112 * bk;
        box(bx - bw / 2, by - bh / 2, bw, bh, '#3C5D7A', 3);
        text('ICE ARENA', bx, by + 2, Math.round(42 * bk), '#FFF9DF');
      }
    }, { radius: 24, strength: .58 });

    // Ice rink surface lines, center circle & subtle skate scratches
    for (const z of [0, 600]) poly([[-1400, .5, z], [1400, .5, z], [1400, .5, z + 10], [-1400, .5, z + 10]], 'rgba(218,136,162,.65)');
    poly([[-1400, .5, 296], [1400, .5, 296], [1400, .5, 304], [-1400, .5, 304]], 'rgba(130,178,210,.55)');
    const cPts = P.floorCircle(0, 300, 240, 1, 64);
    if (cPts) shape(cPts, { fill: 'rgba(175,216,238,.12)', stroke: '#8FBBD5', lwPx: 4 });
    const dot = P.floorCircle(0, 300, 16, 1.2, 20);
    if (dot) shape(dot, { fill: '#8FBBD5', stroke: null });

    // Subtle sheen streaks across the ice
    for (let i = 0; i < 16; i++) {
      const wx = -900 + hash(i + 81) * 1800, wz = 40 + hash(i + 45) * 760;
      ln([[wx, 1, wz], [wx + 110, 1, wz + 25]], 'rgba(130,184,210,.22)', 2);
    }
  }

  // Fafy watching from a bench just beyond the boards (placed into depthStage at Z = 860!)
  function drawFafyBench(P) {
    if (!P.visible([-610, 0, 860])) return;
    const [bx, by, k] = P.p(-610, 0, 860);
    const sc = k * 1.15;
    box(bx - 110 * sc, by - 58 * sc, 220 * sc, 18 * sc, '#A4806B', 2.5);
    box(bx - 92 * sc, by - 40 * sc, 15 * sc, 45 * sc, '#6F6474', 2);
    box(bx + 77 * sc, by - 40 * sc, 15 * sc, 45 * sc, '#6F6474', 2);
    X.save(); X.translate(bx, by - 61 * sc); X.scale(9.5 * sc, 9.5 * sc); jeGiraffe(.2, false); X.restore();
    text('FAFY', bx, by - 2 * sc, Math.max(14, Math.round(19 * sc)), '#4A667E');
  }

  function blade(x, y, s) {
    line([[x - s, y + 2], [x - s, y + 9], [x + s, y + 9], [x + s * 1.45, y + 3]], { stroke: ink, lwPx: 4 });
    line([[x - s * 1.15, y + 11], [x + s * 1.45, y + 11]], { stroke: '#9DAEBB', lwPx: 5 });
  }

  function girlRaw(t, x, y, s, o = {}, skating = false) {
    const lineHit = activeLine(t, 'jenna');
    const mouth = o.mouth ?? lipFlap(t, lineHit ? { line: lineHit } : false, 'smile');
    return withBoil(o.boil ?? .65, () => {
      const a = jenna(x, y, s, { t, mouth, giraffe: !skating, outfit: t >= 15 ? 'winter' : undefined, ...o });
      if (skating) {
        const hx = (a.eyeL[0] + a.eyeR[0]) / 2, ey = (a.eyeL[1] + a.eyeR[1]) / 2;
        const width = 5.8 * s * Math.max(.22, Math.abs(Math.cos(o.spin || 0)));
        X.save(); X.beginPath(); X.ellipse(hx, ey - 1.7 * s, width, 4.8 * s, 0, Math.PI, TAU); X.closePath();
        X.fillStyle = '#AA8DBF'; X.strokeStyle = ink; X.lineWidth = 3; X.fill(); X.stroke();
        for (const d of [-.4, 0, .4]) line([[hx + d * width, ey - 5.3 * s], [hx + d * width, ey - 4.6 * s]], { stroke: '#725589', lwPx: 3 });
        X.restore();
        for (const p of [a.footL, a.footR]) blade(...p, s * .95);
      }
      return a;
    }, 'jenna');
  }

  function dadRaw(t, x, y, s, o = {}, skating = false) {
    const lineHit = activeLine(t, 'sami');
    const mouth = o.mouth ?? lipFlap(t, lineHit ? { line: lineHit } : false, 'smile');
    return withBoil(o.boil ?? .65, () => {
      const a = sami(x, y, s, { t, mouth, ...o });
      if (skating) for (const f of [o.footL || [-1.25, -.8], o.footR || [1.25, -.8]]) blade(x + f[0] * s, y + f[1] * s, s * 1.25);
      return a;
    }, 'sami');
  }

  // Wrapped character painters with M3 castShadow + lighting + optional glossy ice reflection
  function girl(t, x, y, s, o = {}, skating = false) {
    const air = o.jump || 0, airFade = 1 - clamp(air / 8) * .6;
    return castShadow(() => girlRaw(t, x, y, s, { noShadow: fxEnabled('m3'), ...o }, skating), x, y + (skating ? 12 : 0), {
      reflect: skating ? .18 * airFade : 0, reflectScale: .35, reflectBlur: 2.2,
      scaleY: (skating ? .20 : .24) * airFade, blur: skating ? 3 : 2.5,
    });
  }
  function dad(t, x, y, s, o = {}, skating = false) {
    return castShadow(() => dadRaw(t, x, y, s, { noShadow: fxEnabled('m3'), ...o }, skating), x, y + (skating ? 12 : 0), {
      reflect: skating ? .17 : 0, reflectScale: .35, reflectBlur: 2.2,
      scaleY: skating ? .20 : .24, blur: skating ? 3 : 2.5,
    });
  }

  // Tapered skate-carve ice trails & spray bursts (M2)
  function iceCarve(pts, alpha = .85) {
    taperStroke(pts, { lwPx: 12, w0: 1.5, wMid: 10, w1: 3, fill: 'rgba(130,192,220,.48)', smooth: true, alpha });
    taperStroke(pts.map(([px, py]) => [px, py - 3]), { lwPx: 5, w0: .5, wMid: 4.5, w1: 1, fill: 'rgba(255,255,255,.88)', smooth: true, alpha });
  }
  function iceSpray(cx, cy, age, dir = 1) {
    if (age < 0 || age > .55) return;
    const f = easeOut(age / .55), fade = 1 - seg(age, .28, .55);
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI * (.22 + .56 * hash(i * 3.1 + 2)) * (dir < 0 ? 1 : 1);
      const vx = dir * (40 + 95 * hash(i + 7)), vy = -(45 + 85 * hash(i + 13));
      const p0 = [cx + vx * f * .4, cy + vy * f * .4];
      const p1 = [cx + vx * f * .75, cy + vy * f * .8 + 25 * f * f];
      const p2 = [cx + vx * f, cy + vy * f + 60 * f * f];
      taperStroke([p0, p1, p2], { w0: 1, wMid: 5.5, w1: 1.5, fill: 'rgba(245,253,255,.9)', smooth: true, alpha: fade });
    }
  }

  // ---------- Shot 1: Home (0–15s) ----------
  function home(t) {
    camBegin(960, 540, 1 + .018 * seg(t, 0, 15), .001 * Math.sin(t));
    layer(() => room(t, false), { blur: 2.2 });
    const titlePop = spring(t, .15, { freq: 2.2, damp: .55 });
    X.save(); X.translate(960, 95); X.scale(.92 + .08 * titlePop, .92 + .08 * titlePop);
    text('A DAY ON THE ICE', 0, 0, 64); text('Sami & Jenna', 0, 63, 32, '#916581');
    X.restore();
    withLight(HOME_LIGHT, () => {
      const a = dad(t, 650, 967, 18, { handR: [5.3, -12.5], handPoseR: 'palm', tilt: .025 * Math.sin(t) });
      const b = girl(t, 1265, 969, 16, { handR: [4.5, -17], eyes: t > 6 && t < 9 ? 'happy' : 'open', hairSwing: .15 * Math.sin(t) });
      bubbles(t, a, b);
    });
    camEnd();
    grade({ warmth: .16 });
  }

  // ---------- Shot 2: Mudroom (15–21s) ----------
  function ready(t) {
    camBegin(960, 540, 1 + .02 * seg(t, 15, 21), 0);
    layer(() => room(t, true), { blur: 2.0 });
    text('READY FOR ADVENTURE', 960, 90, 42);
    const zip = clamp(spring(t, 16.4, { freq: 2.6, damp: .6 }), 0, 1.04);
    withLight(MUD_LIGHT, () => {
      const a = dad(t, 1220, 985, 17, { handL: [-5, -13], handPoseL: 'thumb' });
      const b = girl(t, 880, 980, 17, { handR: [.8, -10 - 6 * zip], hairSwing: .2 * Math.sin(t * 2), zip });
      bubbles(t, a, b);
    });
    if (t > 17 && t < 18.3) {
      const age = t - 17;
      bloom(() => {
        for (let i = 0; i < 6; i++) {
          const ang = i * TAU / 6 + .3, r = 18 + 55 * easeOut(age / .55);
          taperStroke([[885 + Math.cos(ang) * r * .5, 800 + Math.sin(ang) * r * .5], [885 + Math.cos(ang) * r, 800 + Math.sin(ang) * r]],
            { w0: 1.5, wMid: 6, w1: 1, fill: '#FFE79A', alpha: 1 - seg(age, .25, .65) });
        }
      }, { radius: 16, strength: .65 });
      sfx('ZIP!', 1080, 540, 68, '#FFE19A', age);
    }
    camEnd();
    grade({ warmth: .08 });
  }

  // ---------- Shot 3: Learning on the Ice (21–33s) ----------
  function learn(t) {
    const k = ease(seg(t, 29, 33)), x = lerp(1080, 1210, k);
    const P = makeRinkCam(t, { yaw: .04 * Math.sin(t * .25) });
    camBegin(960 + 12 * Math.sin(t * .3), 540, 1.01, 0);
    layer(() => rinkBg(P, t), { blur: 2.0 });
    iceCarve([[940, 986], [1030, 992], [x - 35, 984], [x, 982]], .7);
    const st = depthStage(P);
    st.add(860, () => drawFafyBench(P));
    let a, b;
    withLight(RINK_LIGHT, () => {
      st.add(280, () => {
        a = dad(t, 620, 959, 17.8, {
          lean: (1 - k) * .09 * Math.sin(t * 4), brows: t < 26 ? 'worried' : 'normal',
          handL: [-6, -14], handR: [6, -14], handPoseR: 'palm',
        }, true);
      });
      st.add(250, () => {
        b = girl(t, x, 970, 16.5, {
          handL: [-6, -15], handR: [6, -15], hairSwing: .3 * Math.sin(t * 3), brows: 'normal',
        }, true);
      });
      st.flush();
    });
    bubbles(t, a, b);
    camEnd();
    grade({ warmth: -.14, tint: 'rgba(180,228,255,.10)' });
  }

  // ---------- Shots 4–6: Glide, Jump & Spin (33–49s) ----------
  function tricks(t) {
    const glide = t < 39, jump = t >= 39 && t < 43, spinShot = t >= 43;
    const xAt = tt => tt < 39 ? lerp(580, 1340, ease(seg(tt, 33, 39))) : tt < 43 ? lerp(780, 1210, ease(seg(tt, 39, 43))) : 1020;
    const airAt = tt => (tt >= 39 && tt < 43) ? Math.sin(Math.PI * seg(tt, 40.5, 41.5)) * 6.5 : 0;
    const spinAt = tt => tt >= 43 ? TAU * 2 * ease(seg(tt, 43.5, 47.6)) : 0;
    const x = xAt(t), air = airAt(t), spin = spinAt(t);
    const landBounce = jump && t >= 41.5 ? .22 * boing(t, 41.5, 2.8, 6.5) : 0;
    const crouch = jump ? (1.45 * Math.sin(Math.PI * seg(t, 39.3, 40.5)) + 1.15 * Math.sin(Math.PI * seg(t, 41.5, 42.4))) : 0;
    const finish = spinShot ? clamp(spring(t, 47.4, { freq: 2.3, damp: .48 }), 0, 1.15) : 0;

    // 3D yaw/pitch tracking camera (M4): arena visibly orbits as Jenna glides, jumps & spins!
    const yaw = glide ? lerp(-.15, .15, ease(seg(t, 33, 39)))
      : jump ? lerp(-.08, .09, ease(seg(t, 39, 43)))
      : .11 * Math.sin((t - 43) * .85);
    const pitch = jump ? .045 * Math.sin(Math.PI * seg(t, 40.4, 41.6)) : .015 * Math.sin(t * .6);
    const P = makeRinkCam(t, { x: (x - 960) * .18, yaw, pitch });

    camBegin(960 + (x - 960) * .12, 540, 1.02 + .015 * Math.sin(t * .4), 0);
    layer(() => rinkBg(P, t), { blur: 2.3 });

    // Sweeping tapered skate-blade tracks + spray arcs (M2)
    iceCarve([[x - 320, 1004], [x - 205, 1009], [x - 85, 986], [x, 982]]);
    if (jump) {
      iceSpray(xAt(40.5) - 20, 982, t - 40.45, -1);
      iceSpray(xAt(41.5), 984, t - 41.48, 1);
    }

    const st = depthStage(P);
    st.add(860, () => drawFafyBench(P));

    // Pose builder used both for live skater and motion-trail ghosts (M2)
    const poseAt = tt => {
      const g = tt < 39, j = tt >= 39 && tt < 43, sp = spinAt(tt);
      const fin = tt >= 43 ? clamp(spring(tt, 47.4, { freq: 2.3, damp: .48 }), 0, 1.15) : 0;
      const cr = j ? (1.45 * Math.sin(Math.PI * seg(tt, 39.3, 40.5)) + 1.15 * Math.sin(Math.PI * seg(tt, 41.5, 42.4))) : 0;
      return {
        giraffe: false, lean: g ? -.07 : 0, dy: cr, jump: airAt(tt), sq: tt === t ? landBounce : 0, spin: sp,
        hairSwing: Math.sin(tt * 4) * .75,
        handL: [-5.5 - fin * .5, -15.4 + fin * 1.1], handR: [5.5 + fin * .5, -15.4 + fin * 1.1],
        footL: g ? [-3, -1] : [-1.4, -.65], footR: g ? [3, -2.5] : [1.4, -.65],
        eyes: 'happy', mouth: 'grin',
      };
    };

    withLight(RINK_LIGHT, () => {
      st.add(250, () => {
        // Motion smear under skates on jump takeoff/flight
        if (jump && air > .6) {
          const xp = xAt(t - .06), yp = 970 - airAt(t - .06) * 18.3, yc = 970 - air * 18.3;
          smear([[x - 36, yc - 25], [x + 36, yc - 25]], [[xp - 28, yp + 14], [xp + 28, yp + 14]], { fill: 'rgba(215,244,255,.42)' });
        }
        // Motion afterimage trail during glide, jump apex, and active spin (M2)
        const spinning = spinShot && t > 43.6 && t < 47.6;
        if (glide || (jump && air > .5) || spinning) {
          trail(t, (tt) => {
            girlRaw(tt, xAt(tt), 970, 18.3, { ...poseAt(tt), noShadow: true, boil: 0 }, true);
          }, { steps: spinning ? 4 : 3, dt: spinning ? .028 : .036, alpha: spinning ? .32 : .25, drawCurrent: false });
        }
        // Main lit skater with cast shadow + glossy ice reflection (M3)
        girl(t, x, 970, 18.3, poseAt(t), true);
        // Tapered spin-whoosh ribbons spiraling around Jenna while spinning (M2 + M1 bloom)
        if (spinning) {
          const sw = ease(seg(t, 43.6, 44.3)) * (1 - ease(seg(t, 47.0, 47.6)));
          bloom(() => {
            for (let k = 0; k < 2; k++) {
              const pts = [];
              for (let i = 0; i <= 16; i++) {
                const u = i / 16, ang = spin * 1.4 + k * Math.PI + u * 2.9;
                pts.push([x + Math.cos(ang) * (145 + k * 32), 795 - k * 115 + Math.sin(ang) * 38 - u * 55]);
              }
              taperStroke(pts, { w0: 2, wMid: 18, w1: 1.5, fill: k ? 'rgba(255,232,162,.92)' : 'rgba(170,232,255,.94)', smooth: true, alpha: sw * .9 });
            }
          }, { radius: 22, strength: .72 });
        }
      });
      st.flush();
    });

    text(glide ? 'GLIDE!' : jump ? 'JUMP!' : 'SPIN!', 960, 142, 70, '#446D92');
    if (jump && t > 41.5 && t < 42.6) sfx('TA-DA!', 1470, 590, 76, '#E6B65B', t - 41.5);

    // Blooming celebratory star ring on spin finish (M1 + M2)
    if (t > 47.5) {
      const pop = clamp(spring(t, 47.55, { freq: 2.5, damp: .45 }), 0, 1.2);
      bloom(() => {
        for (let i = 0; i < 8; i++) {
          const a = i * TAU / 8 + t * .45, rad = 235 * pop;
          shape(starPts(x + Math.cos(a) * rad, 575 + Math.sin(a) * rad * .85, 16 * pop, .42, 5, t * 2 + i),
            { fill: i % 2 ? '#FFE684' : '#FFFDF2', stroke: '#C8983C', lwPx: 2 });
        }
      }, { radius: 22, strength: .75 });
    }
    camEnd();
    grade({ warmth: -.14, tint: 'rgba(180,228,255,.10)' });
  }

  // ---------- Shot 7: Finale (49–69s) ----------
  function finale(t) {
    const move = ease(seg(t, 65, 68));
    const P = makeRinkCam(t, { yaw: -.03 + .07 * move });
    camBegin(960 + 30 * move, 540, 1.015 + .01 * seg(t, 49, 69), 0);
    layer(() => rinkBg(P, t), { blur: 2.0 });
    if (move > .02) {
      iceCarve([[630, 976], [650 + 55 * move, 980], [650 + 120 * move, 972]], move * .85);
      iceCarve([[1220, 986], [1240 + 45 * move, 989], [1240 + 100 * move, 984]], move * .85);
    }
    const st = depthStage(P);
    st.add(860, () => drawFafyBench(P));
    let a, b;
    withLight(RINK_LIGHT, () => {
      st.add(270, () => {
        a = dad(t, 650 + 120 * move, 957, 18, {
          lean: .025 * Math.sin(t * 3), handL: [-5, -13], handR: [5, -13], handPoseR: 'palm',
          eyes: t > 65 ? 'happy' : 'open', brows: t > 55 && t < 60 ? 'quizzical' : 'normal',
        }, true);
      });
      st.add(250, () => {
        b = girl(t, 1240 + 100 * move, 970, 16.8, {
          handL: [-5.5, -15], handR: [5.5, -15], eyes: 'happy', hairSwing: .25 * Math.sin(t * 2),
        }, true);
      });
      st.flush();
    });
    bubbles(t, a, b);
    if (t > 66) {
      const aIn = ease(seg(t, 66, 66.8));
      X.save(); X.globalAlpha = aIn;
      text('Every great skater starts with a little wobble.', 960, 145, 42, '#3C5D7A');
      X.restore();
    }
    camEnd();
    grade({ warmth: -.10 + .08 * move, tint: 'rgba(185,228,255,.08)' });
  }

  scene({
    duration: 69, fps: 24, bpm: 108,
    shots: [[0, home], [15, ready], [21, learn], [33, tricks], [39, tricks], [43, tricks], [49, finale]],
  });
})();
