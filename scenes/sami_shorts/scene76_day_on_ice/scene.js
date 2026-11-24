// scenes/sami_shorts/scene76_day_on_ice/scene.js: "A Day on the Ice" (Sami & Jenna).
// Adapted from Jenna's hand-drawn comic and built as a full 3D visual showcase of M1–M5:
//   M1: animated 12 fps paper grain, scoped per-object boil, half-res DoF blur, 1/4-res bloom, colour grade
//   M2: tapered brush strokes (3D skate tracks, ice spray, zip bursts, 3D helix spin ribbons), springs, trails & smears
//   M3: directional cel lighting, cast floor shadows & glossy ice reflections via withLight / castShadow
//   M4: true 3D yaw/pitch/roll/lookAt cameras (2-point, low-angle 3-point, full 360° orbit), P.billboard & depthStage sorting
//   M5: syllable-synced lipFlap paired with comic callout bubbles
(() => {
  const INK = '#3B2948';
  const lines = ASSETS.scene.scene76_day_on_ice.dialogue;
  const activeLine = (t, who) => lines.find(l => l.speaker === who && t >= l.at + .2 && t <= l.at + .2 + l.text.replace(/\*/g, '').length / (l.cps ?? 18));

  function label(txt, x, y, size = 40, col = INK, strokeCol = null, sw = 0) {
    X.save();
    X.font = `700 ${size}px ${FONT_TALK}`;
    X.textAlign = 'center';
    X.textBaseline = 'middle';
    if (strokeCol && sw > 0) {
      X.lineJoin = 'round';
      X.lineWidth = sw;
      X.strokeStyle = strokeCol;
      X.strokeText(txt, x, y);
    }
    X.fillStyle = col;
    X.fillText(txt, x, y);
    X.restore();
  }

  function titleBadge(txt, sub, x, y, k, col = '#2E4F6E') {
    if (k < .02) return;
    X.save();
    X.translate(x, y);
    X.scale(.9 + .1 * k, .9 + .1 * k);
    X.globalAlpha = clamp(k);
    label(txt, 0, 0, 62, col, '#FFFDF7', 12);
    if (sub) label(sub, 0, 56, 30, '#8A5D7A', '#FFFDF7', 8);
    X.restore();
  }

  // ---------- Scene lighting presets (M3) ----------
  const HOME_LIGHT = {
    dir: [.78, -.62], rim: 'rgba(255,244,195,.62)', rimPx: 5.5,
    shade: 'rgba(72,42,64,.14)', shadePx: 14, tint: 'rgba(255,232,190,.07)',
    shadowColor: 'rgba(65,40,34,.24)', shadowSkew: .58, shadowScaleY: .24,
  };
  const MUD_LIGHT = {
    dir: [.8, -.6], rim: 'rgba(225,248,255,.64)', rimPx: 6,
    shade: 'rgba(54,40,68,.15)', shadePx: 14, tint: 'rgba(225,242,252,.06)',
    shadowColor: 'rgba(52,38,44,.24)', shadowSkew: .62, shadowScaleY: .24,
  };
  const RINK_LIGHT = {
    dir: [.32, -.94], rim: 'rgba(235,252,255,.70)', rimPx: 6,
    shade: 'rgba(36,58,96,.16)', shadePx: 15, tint: 'rgba(195,232,255,.07)',
    shadowColor: 'rgba(32,62,96,.30)', shadowSkew: .32, shadowScaleY: .21,
  };

  // Place speech bubbles cleanly to the side of each speaker's head so tails never cross eyes or faces.
  function bubbles(t, a, b, opts = {}) {
    for (const l of lines) {
      const p = l.speaker === 'sami' ? a : b;
      if (!p?.mouth) continue;
      const other = l.speaker === 'sami' ? b : a;
      const side = other?.mouth ? (p.mouth[0] <= other.mouth[0] ? -1 : 1) : (l.speaker === 'sami' ? -1 : 1);
      const dx = opts[l.speaker]?.dx ?? (side * 320);
      const dy = opts[l.speaker]?.dy ?? -155;
      const anchorX = p.mouth[0] + Math.sign(dx || side) * 52;
      callout(l.text, anchorX, p.mouth[1] - 4, t - l.at, {
        size: 42, maxW: 540, cps: l.cps, hold: l.hold, speaker: l.speaker, dx, dy,
      });
    }
  }

  // ---------- Character accessories (helmets, scarf & ice-skating blades) ----------
  function drawBlade(x, y, s, flip = 1) {
    const d = flip < 0 ? -1 : 1;
    line([[x - s * .95 * d, y + 1], [x - s * .95 * d, y + 8], [x + s * .95 * d, y + 8], [x + s * 1.38 * d, y + 2]], { stroke: INK, lwPx: clamp(s * .22, 2.2, 4.2) });
    line([[x - s * 1.1 * d, y + 9.5], [x + s * 1.42 * d, y + 9.5]], { stroke: '#B6C9D8', lwPx: clamp(s * .26, 2.6, 5.2) });
    line([[x - s * .95 * d, y + 8.5], [x + s * 1.25 * d, y + 8.5]], { stroke: '#FFFFFF', lwPx: clamp(s * .1, 1, 2) });
  }

  function drawHelmet(a, s, col, rimCol, spin = 0, isJenna = false) {
    if (!a?.head) return;
    const cs = Math.cos(spin || 0), back = cs < 0;
    const sqX = Math.max(.26, Math.abs(cs));
    const hx = a.head[0], hy = a.head[1];
    const rx = (isJenna ? 4.55 : 4.85) * s * sqX;
    const ry = (isJenna ? 3.55 : 3.95) * s;
    const cy = hy - (isJenna ? 2.15 : 2.35) * s;
    const lw = clamp(s * .14, 1.8, 3.6);
    X.save();
    // Subtle chin strap hugging the lower jaw (front view only)
    if (!back && sqX > .45) {
      const jawY = hy + (isJenna ? 4.55 : 5.45) * s;
      line([[hx - rx * .84, cy + ry * .08], [hx - rx * .46, jawY], [hx, jawY + .35 * s], [hx + rx * .46, jawY], [hx + rx * .84, cy + ry * .08]],
        { stroke: 'rgba(74,57,88,.68)', lwPx: clamp(s * .1, 1.2, 2.3), smooth: true });
    }
    // Snug rounded helmet dome hugging crown
    X.beginPath();
    X.ellipse(hx, cy, rx, ry, 0, Math.PI * 1.03, TAU - .03 * Math.PI);
    X.quadraticCurveTo(hx, cy + ry * .12, hx - rx * .99, cy + ry * .08);
    X.closePath();
    X.fillStyle = col;
    X.strokeStyle = INK;
    X.lineWidth = lw;
    X.lineJoin = 'round';
    X.fill();
    X.stroke();
    // Lower protective rim band
    X.beginPath();
    X.moveTo(hx - rx * .98, cy + ry * .04);
    X.quadraticCurveTo(hx, cy + ry * .18, hx + rx * .98, cy + ry * .04);
    X.strokeStyle = rimCol;
    X.lineWidth = clamp(s * .24, 2.4, 5.0);
    X.lineCap = 'round';
    X.stroke();
    // Glossy highlight arc & sporty vents
    if (sqX > .35) {
      ellipse(hx - rx * .32, cy - ry * .50, rx * .25, ry * .14, { fill: 'rgba(255,255,255,.44)', stroke: null, rot: -.25 });
      for (const d of [-.38, 0, .38]) {
        const vx = hx + d * rx * .80, vy = cy - ry * .52 + Math.abs(d) * ry * .14;
        line([[vx, vy - ry * .14], [vx, vy + ry * .08]], { stroke: rimCol, lwPx: clamp(s * .15, 1.8, 3.2) });
      }
    }
    X.restore();
  }

  function drawSamiScarf(a, s, t, sway = 0) {
    if (!a?.chest || !a?.head) return;
    const cx = a.chest[0], ny = lerp(a.chest[1], a.head[1], .36);
    const lw = clamp(s * .14, 1.5, 3.2);
    const fl = Math.sin(t * 4.5) * .35 * s + sway * 1.2 * s;
    // Fluttering scarf tail
    shape([
      [cx + 1.1 * s, ny + .3 * s],
      [cx + 2.6 * s, ny + .4 * s],
      [cx + 3.2 * s + fl, ny + 4.4 * s],
      [cx + 1.4 * s + fl * .7, ny + 4.6 * s],
    ], { fill: '#4E8FBF', stroke: INK, lwPx: lw, smooth: .35 });
    line([[cx + 1.65 * s + fl * .3, ny + 2.1 * s], [cx + 2.9 * s + fl * .5, ny + 1.9 * s]], { stroke: '#F4D47A', lwPx: clamp(s * .22, 2, 4.5) });
    line([[cx + 1.55 * s + fl * .6, ny + 3.4 * s], [cx + 3.05 * s + fl * .8, ny + 3.2 * s]], { stroke: '#F4D47A', lwPx: clamp(s * .22, 2, 4.5) });
    // Cozy neck wrap
    shape([
      [cx - 2.35 * s, ny - .7 * s], [cx, ny - .35 * s], [cx + 2.35 * s, ny - .7 * s],
      [cx + 2.6 * s, ny + 1.1 * s], [cx, ny + 1.55 * s], [cx - 2.6 * s, ny + 1.1 * s],
    ], { fill: '#5AA0D1', stroke: INK, lwPx: lw, smooth: .45 });
    line([[cx - 1.7 * s, ny + .4 * s], [cx, ny + .75 * s], [cx + 1.7 * s, ny + .4 * s]], { stroke: '#F4D47A', lwPx: clamp(s * .2, 1.8, 4), smooth: true });
  }

  function girlRaw(t, x, y, s, o = {}, skating = false) {
    const lineHit = activeLine(t, 'jenna');
    const mouth = o.mouth ?? lipFlap(t, lineHit ? { line: lineHit } : false, 'smile');
    return withBoil(o.boil ?? .62, () => {
      const a = jenna(x, y, s, { t, mouth, giraffe: !skating, outfit: t >= 15 ? 'winter' : undefined, ...o });
      if (skating) {
        drawHelmet(a, s * JENNA_SCALE, '#B690D8', '#7D57A0', o.spin || 0, true);
        if (a.footL && a.footR) {
          drawBlade(a.footL[0], a.footL[1], s * .95, -1);
          drawBlade(a.footR[0], a.footR[1], s * .95, 1);
        }
      }
      return a;
    }, 'jenna');
  }

  function dadRaw(t, x, y, s, o = {}, skating = false, scarf = false) {
    const lineHit = activeLine(t, 'sami');
    const mouth = o.mouth ?? lipFlap(t, lineHit ? { line: lineHit } : false, 'smile');
    return withBoil(o.boil ?? .62, () => {
      const a = sami(x, y, s, { t, mouth, ...o });
      if (skating || scarf) drawSamiScarf(a, s, t, o.scarfSway || 0);
      if (skating) {
        drawHelmet(a, s, '#4E7FA8', '#2E5475', 0, false);
        const air = o.jump || 0, fl = o.flip ? -1 : 1;
        for (const [f, sd] of [[o.footL || [-1.25, -.8], -1], [o.footR || [1.25, -.8], 1]]) {
          drawBlade(x + f[0] * s * fl, y + (f[1] - air) * s, s * 1.15, sd * fl);
        }
      }
      return a;
    }, 'sami');
  }

  // Queue a character into depthStage(P) at true 3D world point [X, Y, Z], with M3 shadow/reflection & roll support.
  function stageGirl(st, P, t, pt, o = {}, skating = false, onAnchor = null) {
    if (!P.visible(pt)) return;
    const [sx, sy, k] = P.p(pt[0], pt[1], pt[2]);
    const s = JENNA_UNIT * .96 * k;
    const air = o.jump || 0, airFade = 1 - clamp(air / 10) * .55;
    const footY = sy + (skating ? 9.5 : 0);
    const draw = () => {
      X.save();
      if (P.cam.roll) { X.translate(sx, sy); X.rotate(P.cam.roll); X.translate(-sx, -sy); }
      const a = girlRaw(t, sx, sy, s, { noShadow: fxEnabled('m3'), ...o }, skating);
      X.restore();
      if (onAnchor) onAnchor(a);
      return a;
    };
    st.char(pt, draw, {
      foot: [sx, footY],
      shadow: {
        reflect: skating ? .19 * airFade : 0, reflectScale: .36, reflectBlur: 2.2,
        scaleY: (skating ? .20 : .23) * airFade,
        dy: air ? air * s * .20 * airFade + 2 : 2,
        blur: skating ? 3 : 2.4,
      },
    });
  }

  function stageDad(st, P, t, pt, o = {}, skating = false, scarf = false, onAnchor = null) {
    if (!P.visible(pt)) return;
    const [sx, sy, k] = P.p(pt[0], pt[1], pt[2]);
    const s = SAMI_UNIT * k;
    const footY = sy + (skating ? 9.5 : 0);
    const draw = () => {
      X.save();
      if (P.cam.roll) { X.translate(sx, sy); X.rotate(P.cam.roll); X.translate(-sx, -sy); }
      const a = dadRaw(t, sx, sy, s, { noShadow: fxEnabled('m3'), ...o }, skating, scarf);
      X.restore();
      if (onAnchor) onAnchor(a);
      return a;
    };
    st.char(pt, draw, {
      foot: [sx, footY],
      shadow: {
        reflect: skating ? .18 : 0, reflectScale: .36, reflectBlur: 2.2,
        scaleY: skating ? .20 : .23, blur: skating ? 3 : 2.4,
      },
    });
  }

  // ---------- M2 3D Ice Carves & Spray Particles ----------
  function iceCarve3D(P, worldPts, alpha = .88, wMul = 1) {
    const q = P.line(worldPts);
    if (!q || q.length < 2) return;
    taperStroke(q, { lwPx: 16 * wMul, w0: 1.8, wMid: 13 * wMul, w1: 3, fill: 'rgba(84,162,208,.62)', smooth: true, alpha });
    taperStroke(q.map(([px, py]) => [px, py - 2.5]), { lwPx: 6.5 * wMul, w0: .7, wMid: 5.5 * wMul, w1: 1.2, fill: 'rgba(255,255,255,.94)', smooth: true, alpha });
  }

  function iceSpray3D(P, pt, age, dirX = 1) {
    if (age < 0 || age > .55 || !P.visible(pt)) return;
    const [cx, cy, k] = P.p(pt[0], pt[1] + 2, pt[2]);
    const f = easeOut(age / .55), fade = 1 - seg(age, .26, .55);
    for (let i = 0; i < 7; i++) {
      const vx = dirX * (22 + 52 * hash(i + 7)) * k;
      const vy = -(26 + 48 * hash(i + 13)) * k;
      const p0 = [cx + vx * f * .35, cy + vy * f * .35];
      const p1 = [cx + vx * f * .72, cy + vy * f * .8 + 14 * k * f * f];
      const p2 = [cx + vx * f, cy + vy * f + 34 * k * f * f];
      taperStroke([p0, p1, p2], { w0: 1, wMid: clamp(2.8 * k, 3, 8), w1: 1.2, fill: 'rgba(246,253,255,.95)', smooth: true, alpha: fade });
    }
  }

  // ---------- 3D Arena Helpers ----------
  const RINK_CX = 0, RINK_CZ = 100, RINK_RX = 760, RINK_RZ = 580;
  // Rounded stadium polygon (24 vertices, counter-clockwise in XZ when viewed from +Y)
  const RINK_RING = (() => {
    const pts = [], n = 24, p = 3.2;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, ca = Math.cos(a), sa = Math.sin(a);
      const sx = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / p);
      const sz = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / p);
      pts.push([RINK_CX + sx * RINK_RX, RINK_CZ + sz * RINK_RZ]);
    }
    return pts;
  })();

  function drawPoly3D(P, pts, fill, stroke = null, lw = 2.5, alpha = 1) {
    const q = P.poly(pts);
    if (q) shape(q, { fill, stroke, lwPx: lw, alpha });
  }
  function drawLine3D(P, pts, stroke, lw = 3.5, alpha = 1) {
    const q = P.line(pts);
    if (q) line(q, { stroke, lwPx: lw, alpha });
  }

  // Draw text on a vertical 3D wall quad (p0 -> p1 at Y = y0..y1) using a local affine basis so it skews in 3D perspective.
  function wallSignText(P, p0, p1, y0, y1, txt, col, sizePx = 30) {
    const mid = [(p0[0] + p1[0]) / 2, (y0 + y1) / 2, (p0[1] + p1[1]) / 2];
    if (!P.visible(mid)) return;
    const o = P.p(mid[0], mid[1], mid[2]);
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz) || 1;
    const ux = dx / len, uz = dz / len;
    const sR = P.p(mid[0] + ux * 100, mid[1], mid[2] + uz * 100);
    const sD = P.p(mid[0], mid[1] - 100, mid[2]);
    const ax = (sR[0] - o[0]) / 100, ay = (sR[1] - o[1]) / 100;
    const bx = (sD[0] - o[0]) / 100, by = (sD[1] - o[1]) / 100;
    if (Math.hypot(ax, ay) < .08) return;
    X.save();
    X.transform(ax, ay, bx, by, o[0], o[1]);
    // Keep text facing left-to-right on screen
    if (ax < 0) X.scale(-1, 1);
    X.font = `700 ${sizePx}px ${FONT_TALK}`;
    X.textAlign = 'center';
    X.textBaseline = 'middle';
    X.fillStyle = col;
    X.fillText(txt, 0, 0);
    X.restore();
  }

  // Cheerful skating practice cone in 3D (sorted via depthStage, tilted with camera roll via P.billboard).
  function stageCone(st, P, x, z, col = '#F27D52', stripe = '#FFFDF5') {
    if (!P.visible([x, 0, z])) return;
    st.add([x, 0, z], () => {
      // Soft ice reflection + ground shadow
      const sh = P.floorCircle(x + 8, z + 5, 19, .6, 16);
      if (sh) shape(sh, { fill: 'rgba(42,74,104,.20)', stroke: null });
      P.billboard(x, 0, z, k => {
        const lw = clamp(.9 * k, 1, 2.8) / k;
        // Glossy ice reflection beneath cone
        if (fxEnabled('m3')) {
          X.save();
          X.globalAlpha *= .18;
          shape([[-15, 2], [15, 2], [4, 22], [-4, 22]], { fill: col, stroke: null });
          X.restore();
        }
        // Cone base & body
        ellipse(0, 0, 17, 5.5, { fill: mixCol(col, '#000', .14), stroke: INK, lw });
        shape([[-13, -1], [-3.2, -42], [3.2, -42], [13, -1]], { fill: col, stroke: INK, lw, smooth: .12 });
        // Reflective white stripes
        shape([[-9.6, -15], [-6.6, -27], [6.6, -27], [9.6, -15]], { fill: stripe, stroke: null });
        shape([[-5.4, -32], [-4.2, -37], [4.2, -37], [5.4, -32]], { fill: stripe, stroke: null });
        // Highlight edge
        line([[-10.2, -4], [-2.5, -39]], { stroke: 'rgba(255,255,255,.45)', lw: lw * 1.4 });
      });
    });
  }

  // Fafy the plush giraffe watching happily from a rinkside bench (sorted via depthStage).
  function stageFafyBench(st, P, t, bx, bz, excite = 0) {
    if (!P.visible([bx, 0, bz])) return;
    st.add([bx, 0, bz], () => {
      const sh = P.poly([[bx - 88, .8, bz - 22], [bx + 88, .8, bz - 22], [bx + 96, .8, bz + 26], [bx - 80, .8, bz + 26]]);
      if (sh) shape(sh, { fill: 'rgba(42,74,104,.22)', stroke: null });
      P.billboard(bx, 0, bz, k => {
        const lw = clamp(1.1 * k, 1.4, 3.2) / k;
        // Bench legs & seat
        shape(rectPts(-66, -34, 12, 34), { fill: '#6C6478', stroke: INK, lw });
        shape(rectPts(54, -34, 12, 34), { fill: '#6C6478', stroke: INK, lw });
        shape(rectPts(-78, -46, 156, 15), { fill: '#B68A6E', stroke: INK, lw });
        line([[-74, -41], [74, -41]], { stroke: '#D2A88B', lw: lw * .9 });
        // Nameplate on bench front
        shape(rectPts(-32, -26, 64, 20), { fill: '#FFF7E0', stroke: INK, lw: lw * .8 });
        label('FAFY', 0, -15, 13, '#4B647E');
        // Plush Fafy bouncing on the beat!
        const hop = Math.abs(Math.sin(t * 3.6)) * (2.5 + 8 * excite);
        const tilt = Math.sin(t * 2.8) * (.06 + .12 * excite);
        X.save();
        X.translate(0, -47 - hop);
        X.rotate(tilt);
        X.scale(11.5, 11.5);
        jeGiraffe(.18, false);
        X.restore();
      });
    });
  }

  // Full 360° 3D Ice Arena Backdrop (ice sheet, stadium seating, dasher boards, signs, glass, fans, roof trusses, bloom lights & jumbotron).
  function drawIceArenaBg(P, t) {
    // Cool arena upper atmosphere
    shape(rectPts(-100, -100, W + 200, H + 200), {
      fill: linGrad(0, 0, 0, H, [[0, '#5A7FA3'], [.38, '#9FC2DD'], [.55, '#D7EEF9'], [1, '#F1FCFF']]),
      stroke: null,
    });

    // 1. Ice sheet polygon on Y = 0
    const icePts = P.poly(RINK_RING.map(([x, z]) => [x, 0, z]));
    if (icePts) {
      shape(icePts, {
        fill: linGrad(0, H * .34, 0, H, [[0, '#DCEFF9'], [.45, '#EAF7FD'], [1, '#F5FDFF']]),
        stroke: null,
      });
    }
    // Overhead soft reflection patches on the ice
    for (const [rx, rz] of [[-320, 100], [0, 100], [320, 100], [0, 360], [0, -140]]) {
      const gl = P.floorCircle(rx, rz, 145, .3, 24);
      if (gl) shape(gl, { fill: 'rgba(255,255,255,.30)', stroke: null });
    }

    // 2. Classic ice rink markings on Y = 0.6
    drawPoly3D(P, [[-5, .6, RINK_CZ - RINK_RZ + 20], [5, .6, RINK_CZ - RINK_RZ + 20], [5, .6, RINK_CZ + RINK_RZ - 20], [-5, .6, RINK_CZ + RINK_RZ - 20]], 'rgba(218,120,145,.58)');
    for (const bx of [-250, 250]) {
      drawPoly3D(P, [[bx - 5, .6, RINK_CZ - RINK_RZ + 45], [bx + 5, .6, RINK_CZ - RINK_RZ + 45], [bx + 5, .6, RINK_CZ + RINK_RZ - 45], [bx - 5, .6, RINK_CZ + RINK_RZ - 45]], 'rgba(110,168,208,.56)');
    }
    // Center face-off circle + dot
    const cc = P.floorCircle(RINK_CX, RINK_CZ, 165, .7, 56);
    if (cc) shape(cc, { fill: 'rgba(155,208,236,.13)', stroke: '#7EB2D4', lwPx: 4 });
    const cd = P.floorCircle(RINK_CX, RINK_CZ, 14, .9, 20);
    if (cd) shape(cd, { fill: '#7EB2D4', stroke: null });
    // Corner face-off circles
    for (const [fx, fz] of [[-460, 340], [460, 340], [-460, -140], [460, -140]]) {
      const fc = P.floorCircle(fx, fz, 95, .7, 32);
      if (fc) shape(fc, { fill: 'rgba(225,148,168,.07)', stroke: 'rgba(216,128,152,.52)', lwPx: 2.8 });
      const fd = P.floorCircle(fx, fz, 9, .9, 14);
      if (fd) shape(fd, { fill: 'rgba(216,128,152,.65)', stroke: null });
    }
    // Subtle organic skate marks across the ice
    for (let i = 0; i < 20; i++) {
      const wx = -560 + hash(i + 81) * 1120, wz = -300 + hash(i + 45) * 800;
      const a = hash(i + 12) * TAU;
      drawLine3D(P, [[wx, .8, wz], [wx + Math.cos(a) * 90, .8, wz + Math.sin(a) * 70]], 'rgba(130,185,212,.22)', 2);
    }

    // 3. Collect all 360° rink perimeter segments facing the camera, sorted far → near!
    const segs = [];
    const n = RINK_RING.length;
    for (let i = 0; i < n; i++) {
      const a = RINK_RING[i], b = RINK_RING[(i + 1) % n];
      const mx = (a[0] + b[0]) * .5, mz = (a[1] + b[1]) * .5;
      // Inward normal pointing toward center ice
      const inx = RINK_CX - mx, inz = RINK_CZ - mz;
      const toCamX = P.cam.x - mx, toCamZ = P.cam.z - mz;
      if (inx * toCamX + inz * toCamZ <= 0) continue; // backface cull
      const d = P.depth([mx, 80, mz]);
      if (d < 20) continue;
      segs.push({ i, a, b, mx, mz, d });
    }
    segs.sort((u, v) => v.d - u.d);

    // Paint upper arena bowl, tiered bleachers & cheering fans behind each visible segment
    const fanCols = ['#E27A92', '#F0B85A', '#6FA8D6', '#7EC28E', '#B38CD6', '#EE8B62'];
    for (const s of segs) {
      const { i, a, b } = s;
      const out = (pt, sc) => [RINK_CX + (pt[0] - RINK_CX) * sc, RINK_CZ + (pt[1] - RINK_CZ) * sc];
      const aO = out(a, 1.32), bO = out(b, 1.32);
      // Upper arena wall behind seats
      drawPoly3D(P, [[aO[0], 240, aO[1]], [bO[0], 240, bO[1]], [bO[0], 430, bO[1]], [aO[0], 430, aO[1]]], '#7B9BB8');
      // 3 rising bleacher tiers
      for (let r = 2; r >= 0; r--) {
        const s0 = 1.06 + r * .085, s1 = s0 + .075, y0 = 76 + r * 54, y1 = y0 + 26;
        const p0 = out(a, s0), p1 = out(b, s0), q0 = out(a, s1), q1 = out(b, s1);
        drawPoly3D(P, [[p0[0], y0, p0[1]], [p1[0], y0, p1[1]], [q1[0], y1, q1[1]], [q0[0], y1, q0[1]]], r % 2 ? '#6E8CA8' : '#7D9AB6');
        drawPoly3D(P, [[p0[0], y0 - 20, p0[1]], [p1[0], y0 - 20, p1[1]], [p1[0], y0, p1[1]], [p0[0], y0, p0[1]]], '#5E7C99');
        // Stylized cheering spectators in the stands!
        for (let k = 0; k < 2; k++) {
          const seed = i * 19 + r * 7 + k;
          if (hash(seed) < .38) continue;
          const u = .28 + k * .44 + (hash(seed + 3) - .5) * .12;
          const fx = lerp(p0[0], p1[0], u), fz = lerp(p0[1], p1[1], u), fy = y0 + 10;
          if (!P.visible([fx, fy, fz])) continue;
          const [sx, sy, fk] = P.p(fx, fy, fz);
          const bounce = Math.abs(Math.sin(t * 3.8 + seed)) * 5 * fk;
          const col = fanCols[Math.floor(hash(seed + 11) * fanCols.length)];
          // Torso
          ellipse(sx, sy - 10 * fk - bounce, 14 * fk, 15 * fk, { fill: col, stroke: '#4A5F78', lwPx: clamp(1.2 * fk, .8, 2) });
          // Cheering raised arms
          if (hash(seed + 23) > .45) {
            const wave = Math.sin(t * 7 + seed) * 5 * fk;
            line([[sx - 12 * fk, sy - 14 * fk - bounce], [sx - 18 * fk + wave, sy - 30 * fk - bounce]], { stroke: col, lwPx: clamp(5 * fk, 2, 7) });
            line([[sx + 12 * fk, sy - 14 * fk - bounce], [sx + 18 * fk - wave, sy - 30 * fk - bounce]], { stroke: col, lwPx: clamp(5 * fk, 2, 7) });
          }
          // Head
          circle(sx, sy - 27 * fk - bounce, 9.5 * fk, { fill: hash(seed + 5) > .5 ? '#F0C5A8' : '#D9A588', stroke: '#4A5F78', lwPx: clamp(1.1 * fk, .8, 2) });
        }
      }
      // Roof truss strut rising from stanchion to rafters
      if (i % 2 === 0) {
        const ra = out(a, .94);
        drawLine3D(P, [[a[0], 178, a[1]], [aO[0], 395, aO[1]]], '#5E7F9C', 5);
        drawLine3D(P, [[aO[0], 395, aO[1]], [ra[0] * .55, 425, RINK_CZ + (ra[1] - RINK_CZ) * .55]], '#557592', 5);
      }

      // Dasher boards (kickplate, white board, blue top rail)
      drawPoly3D(P, [[a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], 64, b[1]], [a[0], 64, a[1]]], '#FFFDF4', INK, 2.2);
      drawPoly3D(P, [[a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], 11, b[1]], [a[0], 11, a[1]]], '#F0C24B');
      drawPoly3D(P, [[a[0], 59, a[1]], [b[0], 59, b[1]], [b[0], 65, b[1]], [a[0], 65, a[1]]], '#4C7899');

      // Charming arena board banners (placed around all 4 sides so 360° orbits always see signage!)
      if (i === 5) {
        drawPoly3D(P, [[a[0], 14, a[1]], [b[0], 14, b[1]], [b[0], 56, b[1]], [a[0], 56, a[1]]], '#F4FAFE', '#6B98B8', 1.8);
        wallSignText(P, a, b, 14, 56, 'MINNESOTA · 10,000 LAKES', '#2E5B7D', 22);
      } else if (i === 7) {
        drawPoly3D(P, [[a[0], 14, a[1]], [b[0], 14, b[1]], [b[0], 56, b[1]], [a[0], 56, a[1]]], '#FCE7A2', '#C59A3A', 1.8);
        wallSignText(P, a, b, 14, 56, 'ICE ARENA', '#2F4D6C', 28);
      } else if (i === 17) {
        drawPoly3D(P, [[a[0], 14, a[1]], [b[0], 14, b[1]], [b[0], 56, b[1]], [a[0], 56, a[1]]], '#FCE7A2', '#C59A3A', 1.8);
        wallSignText(P, a, b, 14, 56, 'SKATE CLUB', '#2F4D6C', 26);
      } else if (i === 19) {
        drawPoly3D(P, [[a[0], 14, a[1]], [b[0], 14, b[1]], [b[0], 56, b[1]], [a[0], 56, a[1]]], '#EBF7FD', '#6B98B8', 1.8);
        wallSignText(P, a, b, 14, 56, 'FAFY FAN ZONE', '#3A6A8C', 24);
      }

      // Plexiglass + diagonal light sheen + steel stanchions
      drawPoly3D(P, [[a[0], 65, a[1]], [b[0], 65, b[1]], [b[0], 178, b[1]], [a[0], 178, a[1]]], 'rgba(222,245,255,.18)');
      const shA = [lerp(a[0], b[0], .22), lerp(a[1], b[1], .22)], shB = [lerp(a[0], b[0], .36), lerp(a[1], b[1], .36)];
      const shC = [lerp(a[0], b[0], .52), lerp(a[1], b[1], .52)], shD = [lerp(a[0], b[0], .38), lerp(a[1], b[1], .38)];
      drawPoly3D(P, [[shA[0], 68, shA[1]], [shB[0], 68, shB[1]], [shC[0], 174, shC[1]], [shD[0], 174, shD[1]]], 'rgba(255,255,255,.15)');
      drawLine3D(P, [[a[0], 65, a[1]], [a[0], 178, a[1]]], '#86A9BE', 3.4);
      drawLine3D(P, [[a[0], 178, a[1]], [b[0], 178, b[1]]], '#99BACD', 2.8);
    }

    // 4. Overhead festive pennant strings & steel roof crossbeams
    for (const rz of [-220, 100, 420]) {
      drawLine3D(P, [[-560, 385, rz], [560, 385, rz]], '#587894', 6);
      const flags = 10;
      for (let f = 0; f < flags; f++) {
        const u0 = f / flags, u1 = (f + .72) / flags, um = (u0 + u1) * .5;
        const x0 = lerp(-480, 480, u0), x1 = lerp(-480, 480, u1), xm = lerp(-480, 480, um);
        const sag = Math.sin(um * Math.PI) * 32;
        drawPoly3D(P, [[x0, 382 - sag, rz], [x1, 382 - sag, rz], [xm, 350 - sag, rz]],
          ['#F2C96B', '#88C4E8', '#E98CA6', '#98D49E'][f % 4], '#4A6882', 1.2);
      }
    }

    // 5. Overhead blooming arena floodlights & hanging 3D center-ice jumbotron (M1 bloom!)
    bloom(() => {
      for (const [lx, lz] of [[-380, 420], [0, 420], [380, 420], [-380, -220], [0, -220], [380, -220]]) {
        drawPoly3D(P, [[lx - 65, 392, lz - 18], [lx + 65, 392, lz - 18], [lx + 65, 392, lz + 18], [lx - 65, 392, lz + 18]], '#FFFDF0', '#B5D2E4', 2);
        if (P.visible([lx, 390, lz])) {
          const [sx, sy, k] = P.p(lx, 390, lz);
          ellipse(sx, sy, 52 * k, 15 * k, { fill: 'rgba(240,252,255,.55)', stroke: null });
        }
      }
      // Hanging 4-sided 3D Jumbotron above center ice (visible on low-angle jump & 360° orbit!)
      const jx = RINK_CX, jz = RINK_CZ, jw = 125, y0 = 262, y1 = 326;
      drawLine3D(P, [[jx - 70, y1, jz], [jx - 70, 440, jz]], '#4D6B84', 4);
      drawLine3D(P, [[jx + 70, y1, jz], [jx + 70, 440, jz]], '#4D6B84', 4);
      const jFaces = [
        { p0: [jx - jw, jz - jw], p1: [jx + jw, jz - jw], n: [0, -1] },
        { p0: [jx + jw, jz + jw], p1: [jx - jw, jz + jw], n: [0, 1] },
        { p0: [jx - jw, jz + jw], p1: [jx - jw, jz - jw], n: [-1, 0] },
        { p0: [jx + jw, jz - jw], p1: [jx + jw, jz + jw], n: [1, 0] },
      ];
      for (const f of jFaces) {
        const mx = (f.p0[0] + f.p1[0]) * .5, mz = (f.p0[1] + f.p1[1]) * .5;
        if ((P.cam.x - mx) * f.n[0] + (P.cam.z - mz) * f.n[1] <= 0) continue;
        drawPoly3D(P, [[f.p0[0], y0, f.p0[1]], [f.p1[0], y0, f.p1[1]], [f.p1[0], y1, f.p1[1]], [f.p0[0], y1, f.p0[1]]], '#2E4C69', '#8AB4D2', 3);
        wallSignText(P, f.p0, f.p1, y0, y1, 'ICE ARENA', '#FFF5C2', 26);
      }
    }, { radius: 22, strength: .56 });
  }

  // ---------- 3D Mudroom Set (Shot 2) ----------
  function drawMudroomBg(P, t) {
    shape(rectPts(-100, -100, W + 200, H + 200), { fill: '#EADCC6', stroke: null });
    const HW = 340, BACK = 420, FRONT = -200, CEIL = 265, RAIL = 96;
    // Floor + oak planks
    drawPoly3D(P, [[-HW, 0, FRONT], [HW, 0, FRONT], [HW, 0, BACK], [-HW, 0, BACK]], '#C99B6B');
    for (let x = -HW; x <= HW; x += 56) drawLine3D(P, [[x, .3, FRONT], [x, .3, BACK]], '#AA7D50', 1.8);
    // Braided oval entry rug
    const rug = P.floorCircle(-10, 210, 145, .8, 36);
    if (rug) shape(rug, { fill: '#D59C8C', stroke: '#8E5C54', lwPx: 3 });
    const rugIn = P.floorCircle(-10, 210, 102, 1.0, 32);
    if (rugIn) shape(rugIn, { fill: '#F0DFC6', stroke: '#B67D6D', lwPx: 2 });

    // Ceiling & walls
    drawPoly3D(P, [[-HW, CEIL, FRONT], [HW, CEIL, FRONT], [HW, CEIL, BACK], [-HW, CEIL, BACK]], '#FAF3E7');
    drawPoly3D(P, [[-HW, 0, BACK], [HW, 0, BACK], [HW, CEIL, BACK], [-HW, CEIL, BACK]], '#F3E7D4', INK, 2);
    drawPoly3D(P, [[-HW, 0, BACK], [HW, 0, BACK], [HW, RAIL, BACK], [-HW, RAIL, BACK]], '#B9CCB7', '#8CA38A', 2);
    for (let x = -HW + 24; x < HW; x += 34) drawLine3D(P, [[x, 8, BACK - .5], [x, RAIL - 4, BACK - .5]], '#9BB29A', 1.4);
    drawPoly3D(P, [[-HW, RAIL - 2, BACK - 1], [HW, RAIL - 2, BACK - 1], [HW, RAIL + 7, BACK - 1], [-HW, RAIL + 7, BACK - 1]], '#FFFBF2', '#C5B8A5', 1.5);

    // Side walls
    for (const sx of [-HW, HW]) {
      drawPoly3D(P, [[sx, 0, FRONT], [sx, 0, BACK], [sx, CEIL, BACK], [sx, CEIL, FRONT]], '#ECE0CC', INK, 2);
      drawPoly3D(P, [[sx, 0, FRONT], [sx, 0, BACK], [sx, RAIL, BACK], [sx, RAIL, FRONT]], '#B2C5B0', '#8CA38A', 1.5);
      drawPoly3D(P, [[sx, RAIL - 2, FRONT], [sx, RAIL - 2, BACK], [sx, RAIL + 6, BACK], [sx, RAIL + 6, FRONT]], '#FFFBF2', '#C5B8A5', 1.2);
    }

    // Back coat rack shelf + brass hooks + hanging winter scarf/jacket
    drawPoly3D(P, [[-250, 148, BACK - 16], [190, 148, BACK - 16], [190, 162, BACK - 16], [-250, 162, BACK - 16]], '#9A6C52', INK, 2.5);
    drawPoly3D(P, [[-250, 162, BACK - 16], [190, 162, BACK - 16], [190, 162, BACK], [-250, 162, BACK]], '#B58468', INK, 1.5);
    for (let i = 0; i < 4; i++) {
      const hx = -195 + i * 115;
      if (P.visible([hx, 152, BACK - 18])) {
        const [sx, sy, k] = P.p(hx, 152, BACK - 18);
        circle(sx, sy, 3.8 * k, { fill: '#D9AE54', stroke: INK, lwPx: 1.8 });
        // Hanging winter coat on hook 0 and scarf on hook 2
        if (i === 0) {
          shape([[sx - 18 * k, sy + 4 * k], [sx + 18 * k, sy + 4 * k], [sx + 24 * k, sy + 64 * k], [sx - 24 * k, sy + 64 * k]],
            { fill: '#6D9BC0', stroke: INK, lwPx: 2.2, smooth: .3 });
        } else if (i === 2) {
          shape([[sx - 8 * k, sy + 4 * k], [sx + 8 * k, sy + 4 * k], [sx + 12 * k, sy + 52 * k], [sx - 6 * k, sy + 50 * k]],
            { fill: '#E88A6B', stroke: INK, lwPx: 2, smooth: .3 });
        }
      }
    }

    // Mudroom wooden bench against back wall + winter boots underneath
    drawPoly3D(P, [[-220, 44, BACK - 52], [110, 44, BACK - 52], [110, 44, BACK - 2], [-220, 44, BACK - 2]], '#B68666', INK, 2);
    drawPoly3D(P, [[-220, 34, BACK - 52], [110, 34, BACK - 52], [110, 44, BACK - 52], [-220, 44, BACK - 52]], '#9B6D50', INK, 2);
    for (const lx of [-205, 92]) drawPoly3D(P, [[lx, 0, BACK - 48], [lx + 14, 0, BACK - 48], [lx + 14, 34, BACK - 48], [lx, 34, BACK - 48]], '#7D553E', INK, 2);
    // Cute snow boots under bench
    for (const [bx, col] of [[-155, '#D86C84'], [-132, '#D86C84'], [-60, '#5A84A8'], [-36, '#5A84A8']]) {
      if (!P.visible([bx, 0, BACK - 28])) continue;
      P.billboard(bx, 0, BACK - 28, () => {
        shape([[-7, 0], [-7, -20], [5, -20], [5, -7], [11, -5], [11, 0]], { fill: col, stroke: INK, lw: 1.1, smooth: .2 });
      });
    }

    // Paneled wooden front door on right wall (X = HW) with frosty winter daylight bloom!
    const dx = HW - 1;
    drawPoly3D(P, [[dx, 0, 125], [dx, 0, 275], [dx, 224, 275], [dx, 224, 125]], '#FFFBF2', INK, 2.5);
    drawPoly3D(P, [[dx - 1, 2, 134], [dx - 1, 2, 266], [dx - 1, 214, 266], [dx - 1, 214, 134]], '#7B9FA8', INK, 2.5);
    // Lower wood panels + frosted top window
    drawPoly3D(P, [[dx - 2, 18, 148], [dx - 2, 18, 252], [dx - 2, 92, 252], [dx - 2, 92, 148]], '#688B94', '#4B6B74', 1.8);
    drawPoly3D(P, [[dx - 2, 118, 148], [dx - 2, 118, 252], [dx - 2, 198, 252], [dx - 2, 198, 148]], '#D5F0FA', '#FFFBF2', 3);
    drawLine3D(P, [[dx - 3, 158, 148], [dx - 3, 158, 252]], '#FFFBF2', 3.5);
    drawLine3D(P, [[dx - 3, 118, 200], [dx - 3, 198, 200]], '#FFFBF2', 3.5);
    // Brass doorknob
    if (P.visible([dx - 4, 100, 146])) {
      const [kx, ky, kk] = P.p(dx - 4, 100, 146);
      circle(kx, ky, 5 * kk, { fill: '#EBC25C', stroke: INK, lwPx: 2 });
    }
    // Cool winter daylight streaming through the door window (M1 bloom!)
    bloom(() => {
      drawPoly3D(P, [[dx - 2, 118, 148], [dx - 2, 118, 252], [dx - 2, 198, 252], [dx - 2, 198, 148]], 'rgba(230,250,255,.55)');
      drawPoly3D(P, [[dx - 2, 118, 148], [dx - 2, 198, 252], [60, 0, 270], [40, 0, 120]], 'rgba(220,248,255,.16)');
    }, { radius: 28, strength: .62, glowOnly: true });

    // Framed snowy mountain picture on left wall
    const lx = -HW + 1;
    drawPoly3D(P, [[lx, 128, 180], [lx, 128, 300], [lx, 205, 300], [lx, 205, 180]], '#FFFBF2', '#8B654E', 3);
    drawPoly3D(P, [[lx + 1, 134, 188], [lx + 1, 134, 292], [lx + 1, 199, 292], [lx + 1, 199, 188]], '#BDE2F4');
    drawPoly3D(P, [[lx + 2, 134, 192], [lx + 2, 134, 288], [lx + 2, 174, 240]], '#8BB3CC');
  }

  // Cute fishbowl on a small side table (a warm nod to Jenna's comic: "Bye, fishy!")
  function stageFishTable(st, P, t) {
    const pt = [-250, 0, 275];
    if (!P.visible(pt)) return;
    st.add(pt, () => {
      P.billboard(pt[0], pt[1], pt[2], k => {
        const lw = clamp(1.1 * k, 1.4, 3) / k;
        // Small round wooden table
        shape(rectPts(-26, -68, 52, 9), { fill: '#A87654', stroke: INK, lw });
        shape(rectPts(-20, -59, 8, 59), { fill: '#885D42', stroke: INK, lw });
        shape(rectPts(12, -59, 8, 59), { fill: '#885D42', stroke: INK, lw });
        // Glass fishbowl + happy animated orange goldfish!
        circle(0, -86, 20, { fill: 'rgba(182,232,250,.62)', stroke: INK, lw });
        ellipse(0, -104, 12, 3.5, { fill: '#EAF8FF', stroke: INK, lw: lw * .8 });
        // Water highlight
        ellipse(-7, -91, 4, 7, { fill: 'rgba(255,255,255,.55)', stroke: null, rot: -.25 });
        // Swimming goldfish
        const fx = Math.sin(t * 2.4) * 7, fy = -85 + Math.cos(t * 3.2) * 2.5, fd = Math.cos(t * 2.4) >= 0 ? 1 : -1;
        X.save();
        X.translate(fx, fy);
        X.scale(fd, 1);
        ellipse(0, 0, 7.5, 4.5, { fill: '#F49342', stroke: INK, lw: lw * .7 });
        shape([[-6, 0], [-12, -4.5], [-11, 4.5]], { fill: '#F49342', stroke: INK, lw: lw * .7 });
        circle(3.5, -1, 1.1, { fill: INK, stroke: null });
        X.restore();
      });
    });
  }

  // ---------- Shot 1: Home — 3D Living Room with Gentle 3D Orbit (0–15s) ----------
  function home(t) {
    const LR = LOCATIONS.living_room;
    const p = seg(t, 0, 15);
    // Gentle 3D orbit around Sami & Jenna using M4 lookAt (livingRoom Sofa view, dir: -1)
    const camX = lerp(-80, 82, ease(p));
    const camZ = lerp(555, 515, ease(p));
    const P = persp({
      x: camX, y: 126, z: camZ, f: 1120, hy: 535, dir: -1,
      lookAt: [0, 92, 215],
    });

    // Softened 3D background (M1 half-res DoF blur)
    layer(() => {
      LR.back(P, t, { splitZ: 280, lamp: .75, night: 0 });
      // Warm morning sunbeam from the window on the right (screen-right in Sofa view)
      bloom(() => {
        shape([[W * .66, 0], [W + 80, 0], [W * .56, H], [W * .26, H]], { fill: 'rgba(255,240,185,.18)', stroke: null });
      }, { radius: 34, strength: .65, glowOnly: true });
    }, { blur: 1.8 });

    // Characters in true 3D floor coordinates sorted via depthStage(P) (M4) + unified lighting (M3)
    const st = depthStage(P);
    const jennaHop = t >= 6.0 && t < 9.2 ? Math.abs(Math.sin((t - 6.0) * 5.2)) * 1.4 * (1 - seg(t, 7.8, 9.2)) : 0;
    const samiTalking = !!activeLine(t, 'sami'), jennaTalking = !!activeLine(t, 'jenna');
    let a = null, b = null;

    withLight(HOME_LIGHT, () => {
      // Remember in dir: -1, +X is screen-left and -X is screen-right!
      stageDad(st, P, t, [78, 0, 232], {
        turn: .22, lookX: .4,
        tilt: .03 * Math.sin(t * 1.4),
        handL: [-4.8, -8.8],
        handR: samiTalking ? [5.4, -12.6 + Math.sin(t * 5) * .4] : [4.8, -9.8],
        handPoseR: t > 10.5 ? 'thumb' : (samiTalking ? 'palm' : 'open'),
        eyes: t > 10.8 && t < 13.5 ? 'happy' : 'open',
        brows: t > 5.8 && t < 8.5 ? 'up' : 'normal',
      }, false, false, anc => { a = anc; });

      stageGirl(st, P, t, [-76, 0, 208], {
        jump: jennaHop,
        tilt: -.03 * Math.sin(t * 1.6),
        handR: jennaTalking ? [6.4, -17.6 + Math.sin(t * 6) * .6] : [3.2, -10.8],
        handPoseR: jennaTalking ? 'open' : 'hip',
        eyes: (t > 6.0 && t < 9.5) || (t > 11.2 && t < 14.2) ? 'happy' : 'open',
        brows: t > 6.0 && t < 8.5 ? 'up' : 'normal',
        hairSwing: .14 * Math.sin(t * 1.8),
      }, false, anc => { b = anc; });

      st.flush();
    });

    // Foreground coffee table sorted in front of the characters with soft foreground DoF blur (M1 + M4)
    layer(() => LR.front(P, t, { splitZ: 280, lamp: .75, night: 0 }), { blur: 2.6 });

    // Storybook title badge pops in via M2 spring and fades out cleanly once dialogue rolls
    const titleIn = spring(t, .15, { freq: 2.2, damp: .58 });
    const titleOut = 1 - ease(seg(t, 4.6, 5.4));
    titleBadge('A DAY ON THE ICE', 'Sami & Jenna', W / 2, 102, titleIn * titleOut, '#4A3148');

    bubbles(t, a, b, { sami: { dx: -305, dy: -145 }, jenna: { dx: 295, dy: -155 } });
    grade({ warmth: .16 });
  }

  // ---------- Shot 2: 3D Mudroom — Getting Ready (15–21s) ----------
  function ready(t, lt, dur) {
    const p = seg(lt, 0, dur);
    const P = persp({
      x: lerp(-52, 32, ease(p)),
      y: 118,
      z: lerp(-128, -92, ease(p)),
      f: 1120,
      hy: 545,
      lookAt: [14, 90, 222],
    });

    layer(() => drawMudroomBg(P, t), { blur: 1.5 });

    const st = depthStage(P);
    stageFishTable(st, P, t);

    const zip = clamp(spring(t, 16.4, { freq: 2.7, damp: .58 }), 0, 1.04);
    const popBounce = t >= 17.0 ? .14 * boing(t, 17.0, 2.8, 7) : 0;
    let a = null, b = null;

    withLight(MUD_LIGHT, () => {
      stageDad(st, P, t, [106, 0, 248], {
        turn: -.22, lookX: -.35,
        handL: [-5.8, -13.4 + Math.sin(t * 3) * .3],
        handPoseL: 'thumb',
        handR: [4.6, -9.2],
        eyes: t > 17.2 ? 'happy' : 'open',
      }, false, true, anc => { a = anc; });

      stageGirl(st, P, t, [-32, 0, 182], {
        sq: popBounce,
        zip,
        handR: [1.4, -10.2 - 5.2 * zip],
        handPoseR: 'grip',
        eyes: t > 17.0 ? 'happy' : 'open',
        hairSwing: .22 * Math.sin(t * 2.4),
      }, false, anc => { b = anc; });

      // Foreground left doorframe edge sliding past in 3D parallax (M4!)
      st.add([-295, 90, 28], () => {
        drawPoly3D(P, [[-342, 0, 28], [-275, 0, 28], [-275, 270, 28], [-342, 270, 28]], '#E8DAC4', INK, 3);
      });

      st.flush();
    });

    // ZIP! tapered starburst + bloom + comic SFX (M1 + M2)
    if (t > 17.0 && t < 18.3 && b?.chest) {
      const age = t - 17.0, zx = b.chest[0], zy = b.chest[1] + 10;
      bloom(() => {
        for (let i = 0; i < 8; i++) {
          const ang = i * TAU / 8 + .25, r = 22 + 78 * easeOut(age / .55);
          taperStroke([
            [zx + Math.cos(ang) * r * .42, zy + Math.sin(ang) * r * .42],
            [zx + Math.cos(ang) * r, zy + Math.sin(ang) * r],
          ], { w0: 1.5, wMid: 8, w1: 1, fill: '#FFE79A', alpha: 1 - seg(age, .22, .62) });
        }
      }, { radius: 18, strength: .7 });
      sfx('ZIP!', zx + 195, zy - 120, 72, '#FFE19A', age);
    }

    titleBadge('READY FOR ADVENTURE!', null, W / 2, 86, ease(seg(lt, 0, .5)) * (1 - ease(seg(lt, 4.6, 5.6))), '#4D6B7E');
    bubbles(t, a, b, { jenna: { dx: -335, dy: -155 }, sami: { dx: 290, dy: -155 } });
    grade({ warmth: .06 });
  }

  // ---------- Shot 3: First Steps on the Ice — 2-Point Camera & Dynamic Z-Crossing (21–33s) ----------
  function learn(t, lt, dur) {
    const p = seg(lt, 0, dur);
    // Jenna glides smoothly from BEHIND Sami (Z=245) around his right side to IN FRONT OF Sami (Z=-10), finishing slightly right of him!
    const cross = ease(seg(t, 26.2, 32.8));
    const jennaPos = (tt) => {
      const c = ease(seg(tt, 26.2, 32.8));
      return [
        lerp(135, -35, c) + Math.sin(c * Math.PI) * 58,
        0,
        lerp(245, -12, c) + Math.sin(c * Math.PI) * 28,
      ];
    };
    const jp = jennaPos(t);
    const sp = [-125, 0, 125];

    // 2-point perspective sweeping camera using M4 lookAt (closer framing so characters shine!)
    const P = persp({
      x: lerp(-180, 125, ease(p)),
      y: lerp(135, 122, ease(p)),
      z: lerp(-215, -245, ease(p)),
      f: 1180,
      hy: 530,
      lookAt: [lerp(-10, -25, cross), 84, lerp(155, 85, cross)],
    });

    layer(() => drawIceArenaBg(P, t), { blur: 1.6 });

    // Tapered 3D skate trail curving behind Jenna on the ice (M2 + M4)
    if (cross > .03) {
      const trailPts = [];
      for (let i = 0; i <= 14; i++) {
        const tt = lerp(26.2, t, i / 14);
        const q = jennaPos(tt);
        trailPts.push([q[0], 1, q[2]]);
      }
      iceCarve3D(P, trailPts, .86, 1.0);
    }

    const st = depthStage(P);
    stageFafyBench(st, P, t, -290, 505, .25);
    // Cones positioned so Jenna genuinely skates BEHIND one and IN FRONT of another!
    stageCone(st, P, 215, 175, '#F27D52');
    stageCone(st, P, -35, 35, '#4DB3C9');
    stageCone(st, P, 245, -45, '#F0B64D');

    let a = null, b = null;
    const wobbleAmt = 1 - ease(seg(t, 29.5, 33));
    const wobPhase = Math.sin(t * 4.4);
    withLight(RINK_LIGHT, () => {
      stageDad(st, P, t, sp, {
        lean: wobbleAmt * .11 * wobPhase,
        tilt: -wobbleAmt * .08 * wobPhase,
        turn: .18, lookX: .35,
        brows: t < 26.2 ? 'worried' : 'normal',
        eyes: t < 25.5 ? 'wide' : 'open',
        emote: t > 21.8 && t < 25.2 ? 'sweat' : null,
        emoteK: t > 21.8 && t < 25.2 ? 1 - seg(t, 24.6, 25.2) : 0,
        handL: [-8.4, -14.2 + wobbleAmt * 1.4 * wobPhase],
        handR: [8.4, -14.2 - wobbleAmt * 1.4 * wobPhase],
        handPoseL: 'open', handPoseR: 'palm',
        footL: [-1.45 - wobbleAmt * .35 * wobPhase, -.8],
        footR: [1.45 - wobbleAmt * .35 * wobPhase, -.8],
        scarfSway: wobbleAmt * wobPhase,
      }, true, true, anc => { a = anc; });

      stageGirl(st, P, t, jp, {
        lean: cross > .05 && cross < .95 ? -.07 : .02 * Math.sin(t * 2),
        handL: [-8.2, -14.8 + Math.sin(t * 3) * .5],
        handR: [8.2, -15.4 - Math.sin(t * 3) * .5],
        handPoseL: 'open', handPoseR: 'open',
        footL: cross > .05 ? [-2.4, -.9] : [-1.3, -.65],
        footR: cross > .05 ? [2.2, -1.7] : [1.3, -.65],
        eyes: t > 26.5 ? 'happy' : 'open',
        hairSwing: .38 * Math.sin(t * 3.2),
      }, true, anc => { b = anc; });

      st.flush();
    });

    bubbles(t, a, b, { sami: { dx: -300, dy: -155 }, jenna: { dx: 300, dy: -155 } });
    grade({ warmth: -.12, tint: 'rgba(182,228,255,.10)' });
  }

  // ---------- Shot 4: GLIDE! — 3D Slalom Tracking Shot with Camera Roll & Cone Sorting (33–39s) ----------
  function glideShot(t, lt, dur) {
    const p = seg(lt, 0, dur);
    // S-curve slalom weaving IN FRONT OF and BEHIND 3 cones!
    const posAt = tt => {
      const u = ease(seg(tt, 33, 39));
      return [
        lerp(-395, 395, u),
        0,
        130 + Math.sin(u * Math.PI * 2.15) * 145,
      ];
    };
    const jp = posAt(t);
    const jpPrev = posAt(t - .05);
    const turnDir = clamp((jp[2] - jpPrev[2]) / 10, -1, 1);

    // M4 3D tracking camera with subtle banking ROLL into Jenna's slalom curves!
    const P = persp({
      x: jp[0] * .62 + lerp(-85, 85, p),
      y: 120 + Math.sin(p * Math.PI) * 18,
      z: -210 + Math.cos(p * Math.PI * 2) * 32,
      f: 1160,
      hy: 535,
      roll: turnDir * .038,
      lookAt: [jp[0] * .88, 78, jp[2]],
    });

    layer(() => drawIceArenaBg(P, t), { blur: 1.8 });

    // Sweeping 3D tapered skate carve ribbon tracing her S-curve on the ice (M2 + M4)
    const carvePts = [];
    for (let i = 0; i <= 18; i++) {
      const tt = lerp(Math.max(33, t - 2.6), t, i / 18);
      const q = posAt(tt);
      carvePts.push([q[0], 1, q[2]]);
    }
    iceCarve3D(P, carvePts, .92, 1.15);

    const st = depthStage(P);
    stageFafyBench(st, P, t, -290, 505, .55);
    // 3 slalom cones right along Z = 130 so Jenna weaves BEHIND cone 1, IN FRONT of cone 2, BEHIND cone 3!
    stageCone(st, P, -210, 145, '#F27D52');
    stageCone(st, P, 15, 115, '#4DB3C9');
    stageCone(st, P, 235, 155, '#F0B64D');

    const glidePose = tt => {
      const q0 = posAt(tt), q1 = posAt(tt - .05), lean = clamp((q0[0] - q1[0]) * .005, -.12, .12);
      return {
        lean: -lean - .06,
        handL: [-8.8, -15.4 + Math.sin(tt * 3.5) * .6],
        handR: [8.8, -14.8 - Math.sin(tt * 3.5) * .6],
        handPoseL: 'open', handPoseR: 'open',
        footL: [-2.8, -.9], footR: [2.9, -2.5],
        hairSwing: .65 * Math.sin(tt * 4.2),
        eyes: 'happy', mouth: 'grin',
      };
    };

    withLight(RINK_LIGHT, () => {
      // Sami cheering enthusiastically from behind the slalom course!
      stageDad(st, P, t, [-305, 0, 345], {
        handL: [-7.2, -19.2 + Math.sin(t * 7) * .6],
        handR: [7.2, -19.2 - Math.sin(t * 7) * .6],
        handPoseL: 'open', handPoseR: 'open',
        eyes: 'happy', mouth: 'grin',
      }, true, true);

      // Motion afterimage trail + live skater sorted at exact 3D position in depthStage (M2 + M3 + M4)
      st.add(jp, () => {
        trail(t, tt => {
          const tp = posAt(tt);
          if (!P.visible(tp)) return;
          const [tsx, tsy, tk] = P.p(tp[0], tp[1], tp[2]);
          X.save();
          if (P.cam.roll) { X.translate(tsx, tsy); X.rotate(P.cam.roll); X.translate(-tsx, -tsy); }
          girlRaw(tt, tsx, tsy, JENNA_UNIT * .96 * tk, { ...glidePose(tt), noShadow: true, boil: 0 }, true);
          X.restore();
        }, { steps: 3, dt: .034, alpha: .26, drawCurrent: false });
      }, .5); // tiny bias behind main skater

      stageGirl(st, P, t, jp, glidePose(t), true);
      st.flush();
    });

    titleBadge('GLIDE!', null, W / 2, 118, spring(lt, .05, { freq: 2.5, damp: .52 }), '#34638A');
    grade({ warmth: -.14, tint: 'rgba(175,226,255,.10)' });
  }

  // ---------- Shot 5: JUMP! — Low-Angle 3-Point Perspective Hero Shot (39–43s) ----------
  function jumpShot(t, lt, dur) {
    const posAt = tt => [lerp(-125, 135, ease(seg(tt, 39, 43))), 0, lerp(140, 80, ease(seg(tt, 39, 43)))];
    const airAt = tt => Math.sin(Math.PI * seg(tt, 40.45, 41.55)) * 8.6;
    const jp = posAt(t), air = airAt(t);
    const airWorld = air * JENNA_UNIT * .96;
    const landBoing = t >= 41.55 ? .24 * boing(t, 41.55, 2.9, 6.2) : 0;

    // Dramatic LOW-ANGLE camera right above the ice pitching UP (true 3-point perspective in M4!)
    const P = persp({
      x: lerp(-40, 80, ease(seg(t, 39, 43))),
      y: 44 + airWorld * .10,
      z: -195,
      f: 1060,
      hy: 595,
      lookAt: [jp[0] * .75, 72 + airWorld * .66, jp[2]],
    });

    layer(() => drawIceArenaBg(P, t), { blur: 1.7 });

    // Approach carve track + takeoff & landing tapered ice spray bursts (M2)
    const carve = [];
    for (let i = 0; i <= 10; i++) {
      const tt = lerp(39, Math.min(t, 40.45), i / 10);
      const q = posAt(tt);
      carve.push([q[0], 1, q[2]]);
    }
    if (t > 39.1) iceCarve3D(P, carve, .88);
    iceSpray3D(P, posAt(40.45), t - 40.42, -1);
    iceSpray3D(P, posAt(41.55), t - 41.52, 1);
    iceSpray3D(P, posAt(41.55), t - 41.52, -1);

    const st = depthStage(P);
    stageFafyBench(st, P, t, -290, 505, t > 40.5 ? 1 : .4);
    stageCone(st, P, -210, 175, '#F27D52');
    stageCone(st, P, 235, 165, '#4DB3C9');

    const jumpPose = tt => {
      const a = airAt(tt), cr = 1.95 * Math.sin(Math.PI * seg(tt, 39.2, 40.45)) + 1.35 * Math.sin(Math.PI * seg(tt, 41.55, 42.45));
      const inAir = a > .4, afterLand = tt >= 41.55;
      return {
        dy: cr,
        jump: a,
        sq: tt === t ? landBoing : 0,
        lean: inAir ? -.05 : (tt < 40.45 ? .06 * (cr / 2) : 0),
        handL: inAir ? [-8.6, -19.2] : (afterLand ? [-8.4, -18.5] : [-6.6, -11.5]),
        handR: inAir ? [8.6, -19.2] : (afterLand ? [8.4, -18.5] : [6.6, -11.5]),
        handPoseL: 'open', handPoseR: 'open',
        footL: inAir ? [-2.6, -1.8] : [-1.5, -.65],
        footR: inAir ? [2.8, -3.2] : [1.5, -.65],
        hairSwing: inAir ? .85 : .3 * Math.sin(tt * 5),
        eyes: 'happy', mouth: inAir ? 'O' : 'grin',
      };
    };

    withLight(RINK_LIGHT, () => {
      // Motion smear + sub-frame ghost trail during flight (M2)
      if (air > .5) {
        st.add(jp, () => {
          const [cx, cy, k] = P.p(jp[0], airWorld, jp[2]);
          const pPrev = posAt(t - .055);
          const [px, py] = P.p(pPrev[0], airAt(t - .055) * JENNA_UNIT * .96, pPrev[2]);
          smear([[cx - 26 * k, cy - 10 * k], [cx + 26 * k, cy - 10 * k]], [[px - 22 * k, py + 8 * k], [px + 22 * k, py + 8 * k]],
            { fill: 'rgba(215,246,255,.46)' });
          trail(t, tt => {
            const tp = posAt(tt);
            const [tsx, tsy, tk] = P.p(tp[0], tp[1], tp[2]);
            girlRaw(tt, tsx, tsy, JENNA_UNIT * .96 * tk, { ...jumpPose(tt), noShadow: true, boil: 0 }, true);
          }, { steps: 3, dt: .03, alpha: .26, drawCurrent: false });
        }, .5);
      }

      stageGirl(st, P, t, jp, jumpPose(t), true);
      st.flush();
    });

    titleBadge('JUMP!', null, W / 2, 114, spring(lt, .05, { freq: 2.6, damp: .5 }), '#34638A');
    if (t > 41.55 && t < 42.75) {
      const [jx, jy] = P.p(jp[0], 115, jp[2]);
      sfx('TA-DA!', clamp(jx + 280, 300, W - 260), clamp(jy - 60, 180, 620), 78, '#F2C14E', t - 41.55);
    }
    grade({ warmth: -.14, tint: 'rgba(175,226,255,.10)' });
  }

  // ---------- Shot 6: SPIN! — Full 360° Orbital 3D Camera Showcase (43–49s) ----------
  function spinShot(t, lt, dur) {
    const p = seg(lt, 0, dur);
    // 2.0 full revolutions so Jenna finishes facing FORWARD with a triumphant smile!
    const spinAt = tt => TAU * 2.0 * ease(seg(tt, 43.3, 47.4));
    const spin = spinAt(t);
    const spinning = t > 43.35 && t < 47.4;
    const sw = ease(seg(t, 43.4, 44.1)) * (1 - ease(seg(t, 46.7, 47.4)));

    // FULL 360° 3D ORBIT around center ice (0, 0, 100) using M4 lookAt + elevated crane pitch!
    const orbitAng = lerp(-Math.PI * .5, Math.PI * 1.5, ease(p));
    const orbitR = lerp(345, 315, Math.sin(p * Math.PI));
    const camX = RINK_CX + Math.cos(orbitAng) * orbitR;
    const camZ = RINK_CZ + Math.sin(orbitAng) * orbitR;
    const camY = 144 + Math.sin(p * Math.PI) * 76;

    const P = persp({
      x: camX, y: camY, z: camZ, f: 1080, hy: 540,
      lookAt: [RINK_CX, 74, RINK_CZ],
    });

    layer(() => drawIceArenaBg(P, t), { blur: 1.5 });

    // Circular skate carve ring etched around Jenna's spin point on Y = 0
    if (t > 43.4) {
      const ring = [];
      const arc = lerp(0, TAU * 1.4, ease(seg(t, 43.4, 47.4)));
      for (let i = 0; i <= 24; i++) {
        const a = -arc * (i / 24) + spin * .3;
        ring.push([RINK_CX + Math.cos(a) * 38, 1, RINK_CZ + Math.sin(a) * 38]);
      }
      iceCarve3D(P, ring, .85, .92);
    }

    const st = depthStage(P);
    // Everything around center ice dynamically re-sorts IN FRONT OF and BEHIND Jenna as the camera orbits 360°!
    stageFafyBench(st, P, t, -290, 505, 1);
    stageCone(st, P, -180, 240, '#F27D52');
    stageCone(st, P, 190, 230, '#4DB3C9');
    stageCone(st, P, -175, -65, '#F0B64D');
    stageCone(st, P, 185, -55, '#E47D9C');

    const spinPose = tt => {
      const sp = spinAt(tt), fin = clamp(spring(tt, 47.35, { freq: 2.4, damp: .46 }), 0, 1.18);
      const tuck = ease(seg(tt, 43.3, 44.0)) * (1 - ease(seg(tt, 46.8, 47.4)));
      return {
        spin: sp,
        hairSwing: Math.sin(sp * 1.1) * .95,
        handL: [lerp(-8.4, -4.4, tuck) - fin * .5, lerp(-16.2, -13.0, tuck) - fin * 2.6],
        handR: [lerp(8.4, 4.4, tuck) + fin * .5, lerp(-16.2, -13.0, tuck) - fin * 2.6],
        handPoseL: 'open', handPoseR: 'open',
        footL: [-1.1, -.65], footR: [1.1, -.65],
        eyes: 'happy', mouth: 'grin',
      };
    };

    const centerPt = [RINK_CX, 0, RINK_CZ];
    withLight(RINK_LIGHT, () => {
      // Sami cheering just outside the orbit radius so he stays cleanly framed without clipping the lens!
      stageDad(st, P, t, [-305, 0, 425], {
        handL: [-6.8, -19.0 + Math.sin(t * 8) * .8],
        handR: [6.8, -19.0 - Math.sin(t * 8) * .8],
        handPoseL: 'open', handPoseR: 'open',
        eyes: 'happy', mouth: 'grin',
      }, true, true);

      // 3D spiraling spin-whoosh ribbons split into short depth-sorted arcs so they wrap BEHIND & IN FRONT OF Jenna! (M1 + M2 + M4)
      if (spinning && sw > .02) {
        for (let k = 0; k < 2; k++) {
          const pieces = 8, rad = 64 + k * 16;
          for (let sIdx = 0; sIdx < pieces; sIdx++) {
            const u0 = sIdx / pieces, u1 = (sIdx + 1) / pieces, um = (u0 + u1) * .5;
            const angM = spin * 1.45 + k * Math.PI + um * TAU * .82;
            const ym = 24 + k * 28 + um * 78;
            const midPt = [RINK_CX + Math.cos(angM) * rad, ym, RINK_CZ + Math.sin(angM) * rad];
            st.add(midPt, () => {
              const pts = [];
              for (let j = 0; j <= 4; j++) {
                const u = lerp(u0, u1, j / 4), a = spin * 1.45 + k * Math.PI + u * TAU * .82;
                const y = 24 + k * 28 + u * 78;
                const [sx, sy] = P.p(RINK_CX + Math.cos(a) * rad, y, RINK_CZ + Math.sin(a) * rad);
                pts.push([sx, sy]);
              }
              const w = Math.sin(um * Math.PI) * 16 + 2;
              bloom(() => {
                taperStroke(pts, {
                  w0: w * .7, wMid: w, w1: w * .7,
                  fill: k ? 'rgba(255,230,152,.92)' : 'rgba(165,232,255,.94)',
                  smooth: true, alpha: sw * .88,
                });
              }, { radius: 18, strength: .65 });
            });
          }
        }
      }

      // Motion-trail spin ghosts behind live skater (M2)
      if (spinning) {
        st.add(centerPt, () => {
          trail(t, tt => {
            const [tsx, tsy, tk] = P.p(RINK_CX, 0, RINK_CZ);
            girlRaw(tt, tsx, tsy, JENNA_UNIT * .96 * tk, { ...spinPose(tt), noShadow: true, boil: 0 }, true);
          }, { steps: 4, dt: .026, alpha: .30, drawCurrent: false });
        }, .5);
      }

      stageGirl(st, P, t, centerPt, spinPose(t), true);
      st.flush();
    });

    // Blooming celebratory star ring on spin finish (M1 + M2)
    if (t > 47.4 && P.visible([RINK_CX, 85, RINK_CZ])) {
      const pop = clamp(spring(t, 47.45, { freq: 2.6, damp: .44 }), 0, 1.2);
      const [cx, cy, k] = P.p(RINK_CX, 86, RINK_CZ);
      bloom(() => {
        for (let i = 0; i < 8; i++) {
          const a = i * TAU / 8 + t * .6, rad = 82 * k * pop;
          shape(starPts(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * .82, 7.5 * k * pop, .42, 5, t * 2 + i),
            { fill: i % 2 ? '#FFE57E' : '#FFFDF2', stroke: '#C6963B', lwPx: 2 });
        }
      }, { radius: 22, strength: .75 });
    }

    titleBadge('SPIN!', null, W / 2, 114, spring(lt, .05, { freq: 2.5, damp: .52 }), '#34638A');
    grade({ warmth: -.15, tint: 'rgba(175,226,255,.11)' });
  }

  // ---------- Shot 7: Finale — Cheers, Encouragement & Gliding Together (49–69s) ----------
  function finale(t, lt, dur) {
    const p = seg(lt, 0, dur);
    const jennaApproach = ease(seg(t, 60.2, 63.4));
    const glideTogether = ease(seg(t, 64.6, 68.5));

    // Sami starts at (-115, 0, 155), then bravely pushes off forward alongside Jenna!
    const samiPosAt = tt => {
      const g = ease(seg(tt, 64.6, 68.5));
      return [-118 + 38 * g + Math.sin(g * Math.PI * 2) * 12, 0, 158 - 175 * g];
    };
    const jennaPosAt = tt => {
      const app = ease(seg(tt, 60.2, 63.4)), g = ease(seg(tt, 64.6, 68.5));
      return [lerp(135, 78, app) + 28 * g, 0, lerp(120, 148, app) - 175 * g];
    };
    const sp = samiPosAt(t), jp = jennaPosAt(t);

    // Smooth M4 camera: gentle orbit while talking, then pulls back & pans with them as they skate forward!
    const P = persp({
      x: lerp(-80, 52, ease(p)) + glideTogether * 36,
      y: lerp(132, 120, ease(p)),
      z: lerp(-192, -212, ease(p)) - glideTogether * 125,
      f: 1180,
      hy: 535,
      lookAt: [lerp(0, 18, glideTogether), 84, lerp(142, 0, glideTogether)],
    });

    layer(() => drawIceArenaBg(P, t), { blur: 1.7 });

    // Twin gleaming 3D skate tracks behind Dad & Jenna as they glide together! (M2 + M4)
    if (glideTogether > .02) {
      const sPts = [], jPts = [];
      for (let i = 0; i <= 12; i++) {
        const tt = lerp(64.6, t, i / 12);
        const sq = samiPosAt(tt), jq = jennaPosAt(tt);
        sPts.push([sq[0], 1, sq[2]]);
        jPts.push([jq[0], 1, jq[2]]);
      }
      iceCarve3D(P, sPts, glideTogether * .9, 1.05);
      iceCarve3D(P, jPts, glideTogether * .9, 1.05);
    }

    const st = depthStage(P);
    stageFafyBench(st, P, t, -290, 505, glideTogether > .1 ? .95 : .45);
    stageCone(st, P, -245, 225, '#F27D52');
    stageCone(st, P, 245, 190, '#4DB3C9');
    stageCone(st, P, -210, -55, '#F0B64D');

    let a = null, b = null;
    const clapping = t >= 49.3 && t < 54.4;
    const sheepish = t >= 54.6 && t < 60.5;
    const clap = clapping ? Math.sin(t * 14) * .8 : 0;

    withLight(RINK_LIGHT, () => {
      stageDad(st, P, t, sp, {
        lean: glideTogether > .05 ? .05 * Math.sin(t * 3.5) : 0,
        turn: sheepish ? -.1 : .18,
        lookX: sheepish ? -.15 : .35,
        handL: clapping ? [-2.2 + clap * .5, -13.6] : (glideTogether > .05 ? [-8.2, -14.2] : [-5.2, -10.5]),
        handR: clapping ? [2.2 - clap * .5, -13.6] : (glideTogether > .05 ? [8.2, -14.2] : [5.4, -13.4]),
        handPoseL: 'open',
        handPoseR: sheepish ? 'palm' : (clapping ? 'open' : 'thumb'),
        footL: glideTogether > .05 ? [-1.9, -.85] : [-1.25, -.8],
        footR: glideTogether > .05 ? [1.9, -1.35] : [1.25, -.8],
        eyes: (clapping || t > 64.8) ? 'happy' : 'open',
        brows: sheepish ? 'quizzical' : 'normal',
        scarfSway: glideTogether * .8,
      }, true, true, anc => { a = anc; });

      stageGirl(st, P, t, jp, {
        lean: glideTogether > .05 ? -.06 : 0,
        handL: glideTogether > .05 ? [-8.4, -15.2] : [-7.6, -15.4 + Math.sin(t * 3) * .4],
        handR: glideTogether > .05 ? [8.4, -15.2] : [7.6, -14.6],
        handPoseL: 'open', handPoseR: 'open',
        footL: glideTogether > .05 ? [-2.3, -.9] : [-1.3, -.65],
        footR: glideTogether > .05 ? [2.4, -1.9] : [1.3, -.65],
        eyes: 'happy',
        hairSwing: .32 * Math.sin(t * 2.8),
      }, true, anc => { b = anc; });

      st.flush();
    });

    bubbles(t, a, b, { sami: { dx: -305, dy: -155 }, jenna: { dx: 300, dy: -155 } });

    if (t > 65.8) {
      const aIn = ease(seg(t, 65.8, 66.7));
      titleBadge('Every great skater starts with a little wobble.', null, W / 2, 126, aIn, '#2E4F6E');
    }
    grade({ warmth: -.10 + .12 * glideTogether, tint: 'rgba(185,228,255,.08)' });
  }

  scene({
    duration: 69, fps: 24, bpm: 108,
    shots: [
      [0, home],
      [15, ready],
      [21, learn],
      [33, glideShot],
      [39, jumpShot],
      [43, spinShot],
      [49, finale],
    ],
  });
})();
