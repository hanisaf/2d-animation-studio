// scenes/sami_shorts/scene77_palm_pals_adventure/scene.js
// "Palm Pals: The Adventure" — 180-second (3:00) animated cartoon adapting Jenna Safadi's comic book.
// Pure function of time t: 12 cinematic shots, 3D perspective sets, expressive Palm Pals rigs with
// animated hands & feet, M1–M5 lighting/bloom/trails/speech bubbles, and syllable-synced lipFlap.
(() => {
  const INK = PLP.ink;
  const UNIT = PALM_PALS_UNIT;
  const lines = ASSETS.scene.scene77_palm_pals_adventure.dialogue;

  function activeLine(t, who) {
    return lines.find(l => {
      if (l.speaker !== who || l.kind === 'think' || l.silent) return false;
      const len = l.text.replace(/\*/g, '').length;
      return t >= l.at + .18 && t <= l.at + .22 + len / (l.cps ?? 20);
    });
  }

  function mouthFor(t, who, rest = 'smile', override = null) {
    if (override) return override;
    const hit = activeLine(t, who);
    return hit ? lipFlap(t, { line: hit }, rest, ['grin', 'open', 'o', 'O', 'smile']) : rest;
  }

  // ---------- Lighting Presets (M3) ----------
  const NIGHT_LIGHT = {
    dir: [-.6, -.8], rim: 'rgba(175,210,255,.52)', rimPx: 5,
    shade: 'rgba(20,26,64,.24)', shadePx: 14, tint: 'rgba(90,120,210,.08)',
    shadowColor: 'rgba(18,22,52,.34)', shadowSkew: -.42, shadowScaleY: .22,
  };
  const WARM_LIGHT = {
    dir: [.72, -.68], rim: 'rgba(255,244,205,.62)', rimPx: 5.5,
    shade: 'rgba(72,42,58,.14)', shadePx: 14, tint: 'rgba(255,232,190,.06)',
    shadowColor: 'rgba(62,38,34,.22)', shadowSkew: .52, shadowScaleY: .23,
  };
  const PORTAL_LIGHT = {
    dir: [.35, -.92], rim: 'rgba(155,220,255,.78)', rimPx: 7,
    shade: 'rgba(24,38,90,.20)', shadePx: 16, tint: 'rgba(110,185,255,.08)',
    shadowColor: 'rgba(24,38,85,.28)', shadowSkew: .28, shadowScaleY: .22,
  };
  const SUNNY_LIGHT = {
    dir: [.65, -.75], rim: 'rgba(255,250,214,.68)', rimPx: 5.5,
    shade: 'rgba(46,66,52,.14)', shadePx: 14, tint: 'rgba(255,246,205,.05)',
    shadowColor: 'rgba(36,64,42,.24)', shadowSkew: .48, shadowScaleY: .22,
  };

  // ---------- Typography, Captions & Speech Bubbles ----------
  function drawText(txt, x, y, size = 44, col = INK, strokeCol = '#FFFDF7', sw = 10, font = FONT_TALK) {
    X.save();
    X.font = `700 ${size}px ${font}`;
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

  function captionBanner(txt, x, y, k = 1, fill = '#FFF5D6', col = INK, size = 34) {
    if (k < .02) return;
    overlay(() => {
      X.save();
      X.font = `700 ${size}px ${FONT_TALK}`;
      const tw = X.measureText(txt).width + 54, th = size + 30;
      X.translate(x, y);
      X.scale(.86 + .14 * backOut(k), .86 + .14 * backOut(k));
      X.globalAlpha = clamp(k);
      shape(rectPts(-tw / 2 + 5, -th / 2 + 6, tw, th), { fill: 'rgba(42,24,38,.22)', stroke: null, smooth: .12 });
      shape(rectPts(-tw / 2, -th / 2, tw, th), { fill, stroke: INK, lwPx: 4.5, smooth: .12 });
      X.fillStyle = col;
      X.textAlign = 'center';
      X.textBaseline = 'middle';
      X.fillText(txt, 0, 2);
      X.restore();
    });
  }

  // Paint active callouts for the current shot, placing each cleanly off to the side of the speaker.
  function showBubbles(t, anchors, layout = {}) {
    for (const l of lines) {
      const a = anchors[l.speaker];
      if (!a?.mouth) continue;
      const cfg = layout[l.speaker] || {};
      const side = cfg.side ?? (a.mouth[0] < W * .5 ? -1 : 1);
      const dx = cfg.dx ?? side * 270;
      const dy = cfg.dy ?? -175;
      const padX = cfg.padX ?? 72;
      const ax = a.mouth[0] + Math.sign(dx || side) * padX;
      const ay = a.mouth[1] - 12;
      callout(l.text, ax, ay, t - l.at, {
        size: cfg.size ?? 40,
        maxW: cfg.maxW ?? 520,
        cps: l.cps ?? 20,
        hold: l.hold ?? 1.3,
        kind: l.kind || 'talk',
        speaker: l.speaker,
        dx, dy,
      });
    }
  }

  // ---------- Story Props & Comic Gags ----------
  function drawBrownHat(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    const crown = [[-34, 4], [-28, -32], [-14, -44], [0, -47], [14, -44], [28, -32], [34, 4]];
    X.save();
    tracePath(crown, true, .45);
    X.fillStyle = linGrad(-20, -45, 22, 5, [[0, '#C48F64'], [.5, '#9A6740'], [1, '#734729']]);
    X.fill();
    X.clip();
    for (let gx = -26; gx <= 26; gx += 13) line([[gx, -48], [gx, 8]], { stroke: '#5B3720', lwPx: 2.8 });
    for (let gy = -34; gy <= 0; gy += 12) line([[-38, gy], [38, gy]], { stroke: '#5B3720', lwPx: 2.8 });
    X.restore();
    shape(crown, { fill: null, stroke: INK, lwPx: 3.6, smooth: .45 });
    shape(rectPts(-34, -8, 68, 10), { fill: '#5C3822', stroke: INK, lwPx: 2.8 });
    ellipse(0, 6, 54, 14, { fill: '#A8744B', stroke: INK, lwPx: 3.6 });
    line([[-38, 6], [-14, 11], [14, 11], [38, 6]], { stroke: '#6E4528', lwPx: 2.4, smooth: true });
    X.restore();
  }

  function drawGoldKey(x, y, s = 1, rot = 0, glow = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    if (glow > .02) {
      circle(16, 0, 44, { fill: rgba('#FFE66D', .38 * glow), stroke: null });
    }
    shape(rectPts(8, -5.5, 46, 11), { fill: '#F7C948', stroke: INK, lwPx: 3.2 });
    shape(rectPts(32, 4, 8, 13), { fill: '#F7C948', stroke: INK, lwPx: 3 });
    shape(rectPts(43, 4, 8, 17), { fill: '#F7C948', stroke: INK, lwPx: 3 });
    circle(-4, 0, 16, { fill: '#FFE066', stroke: INK, lwPx: 3.4 });
    circle(-4, 0, 6.8, { fill: '#FFFDF7', stroke: INK, lwPx: 2.8 });
    circle(-9, -6, 2.8, { fill: '#FFFFFF', stroke: null });
    X.restore();
  }

  // Plain golden breakfast pancake with melting butter pat (strictly no faces!).
  function drawPancake(x, y, s = 1, rot = 0, stack = 1) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    for (let i = 0; i < stack; i++) {
      const oy = -i * 10;
      ellipse(0, oy + 5, 36, 19, { fill: '#C87D36', stroke: INK, lwPx: 3 });
      ellipse(0, oy, 35, 18, { fill: '#E8A552', stroke: INK, lwPx: 3 });
      ellipse(-5, oy - 3, 24, 10, { fill: '#F4C174', stroke: null });
    }
    const topY = -(stack - 1) * 10;
    shape([[-9, topY - 9], [9, topY - 9], [11, topY - 1], [-7, topY - 1]], { fill: '#FFF08A', stroke: INK, lwPx: 2.2 });
    X.restore();
  }

  function drawFloppyPancake(x, y, s = 1) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);
    shape([[-34, 24], [-30, 4], [-14, -12], [12, -13], [32, -3], [28, 10], [10, 12], [-8, 10], [-18, 28], [-28, 30]],
      { fill: '#C87D36', stroke: INK, lwPx: 3.2, smooth: .48 });
    shape([[-32, 20], [-28, 1], [-13, -14], [12, -15], [31, -5], [26, 6], [8, 7], [-10, 5], [-19, 23], [-27, 25]],
      { fill: '#E8A552', stroke: INK, lwPx: 2.8, smooth: .48 });
    ellipse(4, -7, 16, 5.5, { fill: '#F4C174', stroke: null, rot: .08 });
    line([[-12, -1], [-18, 10]], { stroke: '#B66C29', lwPx: 2.4, smooth: true });
    X.restore();
  }

  function drawBittenPancake(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    const pts = [[-18, -10], [4, -14], [24, -8], [28, 2], [20, 12], [0, 14], [-14, 10], [-10, 4], [-16, 0], [-11, -5]];
    shape(pts, { fill: '#C87D36', stroke: INK, lwPx: 2.8, smooth: .35 });
    X.translate(0, -3);
    shape(pts, { fill: '#E8A552', stroke: INK, lwPx: 2.6, smooth: .35 });
    ellipse(6, -2, 12, 5.5, { fill: '#F4C174', stroke: null });
    X.restore();
  }

  function drawSkillet(x, y, s = 1, hasPancake = true, t = 0) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);
    shape(rectPts(-64, -6, 38, 11), { fill: '#4A4652', stroke: INK, lwPx: 3 });
    ellipse(0, 4, 35, 13, { fill: '#35323D', stroke: INK, lwPx: 3 });
    ellipse(0, 0, 33, 11, { fill: '#575363', stroke: INK, lwPx: 2.5 });
    if (hasPancake) {
      ellipse(0, -1, 23, 7.5, { fill: '#E8A552', stroke: INK, lwPx: 2.2 });
      ellipse(-3, -2, 13, 4, { fill: '#F5C67E', stroke: null });
    }
    for (let i = 0; i < 3; i++) {
      const sx = (i - 1) * 14, ph = t * 2.8 + i * 1.4;
      const w1 = Math.sin(ph) * 4, w2 = Math.cos(ph) * 4;
      line([[sx, -14], [sx + w1, -26], [sx + w2, -38]], { stroke: 'rgba(255,250,242,.78)', lwPx: 3, smooth: true });
    }
    X.restore();
  }

  function drawSpatula(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    shape(rectPts(-4, -34, 8, 36), { fill: '#6D5854', stroke: INK, lwPx: 2.8 });
    shape(rectPts(-15, -54, 30, 22), { fill: '#B8C2CC', stroke: INK, lwPx: 3 });
    line([[-6, -48], [-6, -38]], { stroke: INK, lwPx: 2.2 });
    line([[6, -48], [6, -38]], { stroke: INK, lwPx: 2.2 });
    X.restore();
  }

  function drawAngryCloud(x, y, s = 1, t = 0) {
    X.save();
    X.translate(x + Math.sin(t * 16) * 3, y + Math.cos(t * 13) * 2);
    X.scale(s, s);
    ellipse(0, 0, 44, 21, { fill: 'rgba(42,32,48,.28)', stroke: null });
    X.strokeStyle = '#2B1F2E';
    X.lineWidth = 4.5;
    X.lineCap = 'round';
    X.lineJoin = 'round';
    X.beginPath();
    const pts = [[-36, 7], [-18, -12], [30, -9], [-28, 1], [34, -2], [-22, 9], [28, 7], [-12, -16], [20, -13], [-5, 11]];
    X.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) X.lineTo(pts[i][0], pts[i][1]);
    X.stroke();
    X.restore();
  }

  function drawHeartEyes(A, s, pulseAmt = 1) {
    if (!A?.eyeL || !A?.eyeR) return;
    for (const pt of [A.eyeL, A.eyeR]) {
      const r = s * .98 * pulseAmt;
      X.save();
      X.translate(pt[0], pt[1]);
      X.beginPath();
      X.moveTo(0, r * .82);
      X.bezierCurveTo(-r * 1.15, r * .15, -r * 1.05, -r * .78, -r * .45, -r * .78);
      X.bezierCurveTo(-r * .12, -r * .78, 0, -r * .38, 0, -r * .28);
      X.bezierCurveTo(0, -r * .38, r * .12, -r * .78, r * .45, -r * .78);
      X.bezierCurveTo(r * 1.05, -r * .78, r * 1.15, r * .15, 0, r * .82);
      X.closePath();
      X.fillStyle = '#FF5C93';
      X.fill();
      X.strokeStyle = INK;
      X.lineWidth = Math.max(2.2, s * .12);
      X.stroke();
      circle(-r * .34, -r * .32, r * .16, { fill: 'rgba(255,255,255,.8)', stroke: null });
      X.restore();
    }
  }

  function drawDeadpanOverlay(A, s) {
    if (!A?.eyeL || !A?.eyeR || !A?.mouth) return;
    for (const pt of [A.eyeL, A.eyeR]) {
      circle(pt[0], pt[1], s * .95, { fill: '#FFFDF8', stroke: INK, lwPx: clamp(s * .14, 2.5, 4.5) });
      circle(pt[0], pt[1], s * .28, { fill: INK, stroke: null });
    }
    shape(rectPts(A.mouth[0] - s * 1.1, A.mouth[1] - s * .42, s * 2.2, s * .9), { fill: PLP.zelieCup, stroke: null });
    line([[A.mouth[0] - s * .68, A.mouth[1]], [A.mouth[0] + s * .68, A.mouth[1]]], { stroke: INK, lwPx: clamp(s * .16, 2.5, 4.5) });
  }

  function drawScuffs(A, s) {
    if (!A?.center) return;
    const [cx, cy] = A.center;
    for (const [dx, dy, ang] of [[-2.3, -1.1, -.3], [2.4, -.6, .25], [-1.3, 2.1, .15]]) {
      X.save();
      X.translate(cx + dx * s, cy + dy * s);
      X.rotate(ang);
      line([[-s * .48, -s * .16], [s * .48, -s * .16]], { stroke: '#7D5B47', lwPx: 2.4 });
      line([[-s * .35, s * .14], [s * .35, s * .14]], { stroke: '#7D5B47', lwPx: 2.1 });
      X.restore();
    }
    X.save();
    X.translate(cx + s * 1.5, cy - s * 1.9);
    X.rotate(-.24);
    shape(rectPts(-s * .95, -s * .38, s * 1.9, s * .76), { fill: '#FCE2C4', stroke: INK, lwPx: 2.2 });
    shape(rectPts(-s * .3, -s * .34, s * .6, s * .68), { fill: '#FFF5EA', stroke: null });
    X.restore();
  }

  function drawLaughTears(A, s, t) {
    if (!A?.eyeL || !A?.eyeR) return;
    const j = Math.sin(t * 18) * 3;
    for (const [pt, sd] of [[A.eyeL, -1], [A.eyeR, 1]]) {
      ellipse(pt[0] + sd * s * 1.85, pt[1] + j * .4, s * .56, s * .28, { fill: '#78D5FF', stroke: INK, lwPx: 2, rot: sd * .35 });
      ellipse(pt[0] + sd * s * 3.0, pt[1] + s * .55 - j * .5, s * .36, s * .2, { fill: '#78D5FF', stroke: INK, lwPx: 1.6, rot: sd * .5 });
    }
  }

  function drawSpeedLines(x0, y0, x1, y1, count = 5, col = INK, alpha = .72) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    X.save();
    X.globalAlpha *= alpha;
    for (let i = 0; i < count; i++) {
      const off = (i - (count - 1) / 2) * 26;
      const trim = (i % 2) * .16;
      taperStroke([
        [x0 + nx * off + dx * trim, y0 + ny * off + dy * trim],
        [x1 + nx * off - dx * trim * .4, y1 + ny * off - dy * trim * .4],
      ], { w0: 1.2, wMid: 4.5, w1: 1.0, fill: col });
    }
    X.restore();
  }

  function drawPortal(x, y, rx, ry, variant = 'blue', t = 0, openK = 1) {
    const sc = backOut(clamp(openK));
    if (sc < .02) return;
    X.save();
    X.translate(x, y);
    X.scale(sc, sc);
    if (variant === 'locked') {
      ellipse(0, 0, rx, ry, { fill: '#4A5568', stroke: INK, lwPx: 5.5 });
      ellipse(0, 0, rx * .84, ry * .84, { fill: '#2D3748', stroke: INK, lwPx: 4 });
      for (let i = 0; i < 3; i++) {
        ellipse(0, 0, rx * (.64 - i * .16), ry * (.64 - i * .16), { fill: null, stroke: 'rgba(160,195,230,.28)', lwPx: 3 });
      }
      shape(rectPts(-rx * .72, -ry * .34, rx * 1.44, ry * .68), { fill: '#F6E7C8', stroke: INK, lwPx: 4.5 });
      circle(0, ry * .16, 13, { fill: '#F7C948', stroke: INK, lwPx: 3 });
      circle(0, ry * .14, 4.5, { fill: '#2D222B', stroke: null });
      shape([[-3, ry * .15], [3, ry * .15], [4.5, ry * .26], [-4.5, ry * .26]], { fill: '#2D222B', stroke: null });
      drawText('FIND THE KEY', 0, -ry * .16, Math.round(rx * .18), INK, null, 0);
      drawText('TO OPEN PORTAL', 0, 0, Math.round(rx * .18), INK, null, 0);
      X.restore();
      return;
    }

    const isGold = variant === 'gold';
    const outer = isGold ? '#F59E0B' : '#1D4ED8';
    const mid = isGold ? '#FCD34D' : '#3B82F6';
    const core = isGold ? '#FEF9C3' : '#BFDBFE';
    const glow = isGold ? 'rgba(252,211,77,.42)' : 'rgba(59,130,246,.36)';

    ellipse(0, 0, rx * 1.24, ry * 1.20, { fill: glow, stroke: null });
    ellipse(0, 0, rx, ry, { fill: outer, stroke: INK, lwPx: 5 });
    ellipse(0, 0, rx * .78, ry * .78, { fill: mid, stroke: null });
    ellipse(0, 0, rx * .48, ry * .48, { fill: core, stroke: null });

    X.strokeStyle = isGold ? '#FFFBEB' : '#E0F2FE';
    X.lineWidth = 4.8;
    X.lineCap = 'round';
    for (let k = 0; k < 4; k++) {
      X.beginPath();
      const a0 = k * (Math.PI / 2) + t * (isGold ? 3.8 : 3.2);
      for (let step = 0; step <= 24; step++) {
        const u = step / 24, ang = a0 + u * 3.8, rFrac = .16 + u * .76;
        const px = Math.cos(ang) * rx * rFrac, py = Math.sin(ang) * ry * rFrac;
        if (step === 0) X.moveTo(px, py); else X.lineTo(px, py);
      }
      X.stroke();
    }
    for (let i = 0; i < 7; i++) {
      const a = i * (TAU / 7) + t * 1.1;
      const sx = Math.cos(a) * rx * 1.08, sy = Math.sin(a) * ry * 1.06;
      const sr = 9 + 4 * Math.sin(t * 5 + i);
      shape(starPts(sx, sy, sr, .35, 4), { fill: '#FFFDF5', stroke: INK, lwPx: 1.8 });
    }
    X.restore();
  }

  function drawRainbowHeart(x, y, r = 90, t = 0) {
    const pulse = 1 + .05 * Math.sin(t * 5.2);
    const drawH = (sc) => {
      const rr = r * sc;
      X.beginPath();
      X.moveTo(0, rr * .85);
      X.bezierCurveTo(-rr * 1.2, rr * .16, -rr * 1.12, -rr * .82, -rr * .48, -rr * .82);
      X.bezierCurveTo(-rr * .14, -rr * .82, 0, -rr * .42, 0, -rr * .32);
      X.bezierCurveTo(0, -rr * .42, rr * .14, -rr * .82, rr * .48, -rr * .82);
      X.bezierCurveTo(rr * 1.12, -rr * .82, rr * 1.2, rr * .16, 0, rr * .85);
      X.closePath();
    };
    X.save();
    X.translate(x, y);
    X.scale(pulse, pulse);
    const cols = ['#FF6B9A', '#FFB347', '#FFE066', '#6EC86B', '#68BCEB', '#B388EB'];
    cols.forEach((col, i) => {
      drawH(1 - i * .13);
      X.fillStyle = col;
      X.fill();
      if (i === 0) { X.strokeStyle = INK; X.lineWidth = 6; X.lineJoin = 'round'; X.stroke(); }
    });
    circle(-r * .36, -r * .34, r * .13, { fill: 'rgba(255,255,255,.78)', stroke: null });
    X.restore();
  }

  // Silly giant fuzzy cartoon bear for the "10 HOURS LATER" chase gag!
  function drawCartoonBear(x, y, s, t) {
    const bob = Math.abs(Math.sin(t * 11)) * 18 * s;
    const stride = Math.sin(t * 11);
    X.save();
    X.translate(x, y - bob);
    X.scale(s, s);
    ellipse(0, 12 + bob / s, 110, 22, { fill: 'rgba(42,24,38,.22)', stroke: null });
    // Chasing legs
    ellipse(-44 + stride * 24, -14, 34, 24, { fill: '#6E462B', stroke: INK, lwPx: 4.5, rot: stride * .3 });
    ellipse(44 - stride * 24, -14, 34, 24, { fill: '#6E462B', stroke: INK, lwPx: 4.5, rot: -stride * .3 });
    // Big round fuzzy body
    ellipse(0, -108, 108, 96, { fill: '#8B5A37', stroke: INK, lwPx: 5 });
    ellipse(12, -92, 62, 56, { fill: '#B8845B', stroke: null });
    // Arms reaching out to chase!
    ellipse(-98, -118, 42, 24, { fill: '#8B5A37', stroke: INK, lwPx: 4.5, rot: .45 + stride * .25 });
    ellipse(104, -124, 44, 24, { fill: '#8B5A37', stroke: INK, lwPx: 4.5, rot: -.35 - stride * .25 });
    // Ears
    circle(-56, -214, 28, { fill: '#8B5A37', stroke: INK, lwPx: 4.5 });
    circle(-56, -214, 15, { fill: '#C7936B', stroke: null });
    circle(56, -214, 28, { fill: '#8B5A37', stroke: INK, lwPx: 4.5 });
    circle(56, -214, 15, { fill: '#C7936B', stroke: null });
    // Head
    ellipse(0, -178, 76, 66, { fill: '#8B5A37', stroke: INK, lwPx: 5 });
    ellipse(16, -162, 36, 26, { fill: '#D8AC84', stroke: INK, lwPx: 3.5 });
    ellipse(20, -172, 14, 9, { fill: '#2B1F2E', stroke: null });
    // Goofy roaring mouth & determined brows
    ellipse(18, -148, 22, 14, { fill: '#6B2137', stroke: INK, lwPx: 3.2 });
    circle(-14, -188, 9, { fill: '#2B1F2E', stroke: null });
    circle(32, -188, 9, { fill: '#2B1F2E', stroke: null });
    circle(-17, -191, 3, { fill: '#FFFFFF', stroke: null });
    circle(29, -191, 3, { fill: '#FFFFFF', stroke: null });
    line([[-30, -206], [-2, -196]], { stroke: INK, lwPx: 5.5 });
    line([[48, -206], [20, -196]], { stroke: INK, lwPx: 5.5 });
    X.restore();
  }

  // ---------- 3D Perspective Sets ----------

  // SET 1: Adventure World Meadow (3D hills, sky, sun/clouds/birds, trees, bushes)
  function drawAdventureBg(P, t, o = {}) {
    const sunProg = clamp(o.sunProg ?? .25); // 0 morning .. 1 golden late afternoon
    const skyTop = mixCol('#69C1F5', '#F7A86A', Math.max(0, (sunProg - .55) * 1.8));
    const skyBot = mixCol('#DCF4FF', '#FFE6B8', Math.max(0, (sunProg - .45) * 1.6));
    X.fillStyle = linGrad(0, 0, 0, P.cam.hy + 60, [[0, skyTop], [1, skyBot]]);
    X.fillRect(0, 0, W, P.cam.hy + 80);

    // Sun arcing across the sky
    const sunX = lerp(340, 1580, sunProg), sunY = 230 - Math.sin(sunProg * Math.PI) * 115;
    bloom(() => {
      circle(sunX, sunY, 92, { fill: 'rgba(255,232,120,.45)', stroke: null });
      circle(sunX, sunY, 64, { fill: '#FFE15A', stroke: '#F59E0B', lwPx: 4 });
    }, { radius: 20, strength: .45 });
    for (let i = 0; i < 12; i++) {
      const a = i * (TAU / 12) + t * .22;
      line([[sunX + Math.cos(a) * 76, sunY + Math.sin(a) * 76], [sunX + Math.cos(a) * 112, sunY + Math.sin(a) * 112]],
        { stroke: '#F5B82E', lwPx: 5.5 });
    }

    // Fluffy clouds drifting gently
    for (let i = 0; i < 4; i++) {
      const cx = ((260 + i * 470 + t * (14 + i * 3)) % (W + 320)) - 160;
      const cy = 125 + (i % 2) * 72;
      ellipse(cx, cy, 86, 36, { fill: 'rgba(255,253,248,.92)', stroke: null });
      ellipse(cx - 46, cy + 8, 52, 26, { fill: 'rgba(255,253,248,.92)', stroke: null });
      ellipse(cx + 48, cy + 10, 56, 26, { fill: 'rgba(255,253,248,.92)', stroke: null });
    }

    // Soaring birds
    for (let i = 0; i < 3; i++) {
      const bx = ((620 + i * 310 + t * 38) % (W + 200)) - 100;
      const by = 165 + i * 34 + Math.sin(t * 2.5 + i) * 10;
      const fl = Math.sin(t * 7 + i * 2) * 9;
      line([[bx - 22, by + fl], [bx, by - 5], [bx + 22, by + fl]], { stroke: '#4A5D7A', lwPx: 3.4, smooth: true });
    }

    // Distant rolling hills
    shape([[0, P.cam.hy + 30], [0, P.cam.hy - 30], [420, P.cam.hy - 95], [960, P.cam.hy - 45], [1480, P.cam.hy - 110], [W, P.cam.hy - 35], [W, P.cam.hy + 60]],
      { fill: '#97D97D', stroke: '#62A852', lwPx: 3.5, smooth: .5 });

    // Ground plane in 3D perspective
    const ground = P.poly([[-1400, 0, 120], [1400, 0, 120], [1400, 0, 1600], [-1400, 0, 1600]]);
    if (ground) {
      const gCol = o.earthFront ? '#B98756' : '#7BC96F';
      const gBot = o.earthFront ? '#946237' : '#58AA4E';
      shape(ground, { fill: linGrad(0, P.cam.hy, 0, H, [[0, gCol], [1, gBot]]), stroke: null });
    }
    // Dirt adventure path winding from foreground to portal
    const pathPoly = P.poly([[-120, 0, 180], [120, 0, 180], [95, 0, 960], [-95, 0, 960]]);
    if (pathPoly && !o.earthFront) shape(pathPoly, { fill: 'rgba(218,176,120,.55)', stroke: null });

    // Left lush leafy tree (or gnarled wooden adventure tree)
    P.billboard(o.treeX ?? -290, 0, o.treeZ ?? 740, () => {
      if (o.deadTree) {
        shape([[-22, 0], [-18, -140], [-72, -195], [-56, -206], [-12, -158], [-6, -210], [12, -210], [14, -150], [68, -198], [78, -184], [22, -128], [26, 0]],
          { fill: '#8B5E3C', stroke: INK, lwPx: 4, smooth: .25 });
      } else {
        shape([[-22, 0], [-18, -155], [18, -155], [24, 0]], { fill: '#8B5E3C', stroke: INK, lwPx: 4 });
        for (const [cx, cy, r] of [[-58, -172, 62], [58, -170, 60], [0, -212, 74], [0, -152, 64]]) {
          circle(cx, cy, r, { fill: '#5CB85C', stroke: INK, lwPx: 4 });
        }
        circle(-18, -222, 34, { fill: '#7ED67E', stroke: null });
      }
    });

    // Right palm tree (cover splash) or cozy bushes
    if (o.palmTree) {
      P.billboard(310, 0, 740, () => {
        shape([[-12, 0], [-18, -95], [-2, -185], [18, -180], [8, -90], [16, 0]], { fill: '#B57D4A', stroke: INK, lwPx: 4, smooth: .4 });
        for (const ang of [-2.4, -1.9, -1.1, -.4, .2, .75]) {
          X.save();
          X.translate(6, -184);
          X.rotate(ang);
          shape([[0, 0], [54, -22], [108, 4], [52, 16]], { fill: '#56B856', stroke: INK, lwPx: 3.6, smooth: .45 });
          X.restore();
        }
      });
    } else {
      for (const [bx, bz] of [[250, 780], [-210, 920], [340, 610]]) {
        P.billboard(bx, 0, bz, () => {
          // Clean union-outlined storybook bush (no messy inner overlap lines)
          shape([[-64, 0], [-66, -24], [-44, -44], [-18, -48], [0, -56], [22, -48], [48, -44], [66, -24], [64, 0]],
            { fill: '#58B058', stroke: INK, lwPx: 3.6, smooth: .55 });
          ellipse(-18, -32, 22, 12, { fill: 'rgba(145,228,132,.55)', stroke: null, rot: -.18 });
          ellipse(20, -28, 20, 11, { fill: 'rgba(145,228,132,.48)', stroke: null, rot: .15 });
        });
      }
    }
  }

  // SET 2: Eve's 3D Bedroom (terracotta walls, window with night→day sky, smiling Earth bed, nightstand, door)
  function drawBedroomBg(P, t, o = {}) {
    const day = clamp(o.day ?? 1); // 0 = starry night, 1 = sunny blue day
    const wallTop = mixCol('#8E6E78', '#F6C8A4', day);
    const wallBot = mixCol('#6E5262', '#E9AC82', day);
    const floorCol = mixCol('#7D5A47', '#C98F5D', day);
    const backZ = 820;

    // Back wall + side walls + floor
    X.fillStyle = linGrad(0, 0, 0, H, [[0, wallTop], [1, wallBot]]);
    X.fillRect(0, 0, W, H);
    const backWall = P.poly([[-520, 0, backZ], [520, 0, backZ], [520, 360, backZ], [-520, 360, backZ]]);
    if (backWall) shape(backWall, { fill: linGrad(0, 0, 0, H * .75, [[0, wallTop], [1, wallBot]]), stroke: null });
    const leftWall = P.poly([[-520, 0, 120], [-520, 0, backZ], [-520, 360, backZ], [-520, 360, 120]]);
    if (leftWall) shape(leftWall, { fill: mixCol('#5D4454', '#DDA076', day), stroke: INK, lwPx: 3 });
    const rightWall = P.poly([[520, 0, backZ], [520, 0, 120], [520, 360, 120], [520, 360, backZ]]);
    if (rightWall) shape(rightWall, { fill: mixCol('#5D4454', '#DDA076', day), stroke: INK, lwPx: 3 });
    const floor = P.poly([[-520, 0, 120], [520, 0, 120], [520, 0, backZ], [-520, 0, backZ]]);
    if (floor) shape(floor, { fill: floorCol, stroke: INK, lwPx: 3.5 });
    for (let x = -440; x <= 440; x += 110) {
      const ln = P.line([[x, 0, 140], [x, 0, backZ]]);
      if (ln) line(ln, { stroke: rgba('#5E3820', .22), lwPx: 2 });
    }
    // Baseboard trim
    const base = P.poly([[-520, 0, backZ], [520, 0, backZ], [520, 18, backZ], [-520, 18, backZ]]);
    if (base) shape(base, { fill: mixCol('#A8958A', '#FFF6EA', day), stroke: INK, lwPx: 2.8 });

    // Back-wall elements in world plane
    P.plane(backZ - 1, () => {
      // Cozy bedroom window (center-right)
      const wx = 120, wy = -210, ww = 180, wh = 135;
      const skyA = mixCol('#162044', '#69C3F5', day), skyB = mixCol('#293D75', '#C7EEFF', day);
      shape(rectPts(wx - ww / 2, wy - wh / 2, ww, wh), { fill: linGrad(wx, wy - wh / 2, wx, wy + wh / 2, [[0, skyA], [1, skyB]]), stroke: INK, lwPx: 4.5 });
      if (day < .7) {
        X.save();
        X.globalAlpha *= (1 - day / .7);
        circle(wx + 32, wy - 24, 24, { fill: '#FFF4B8', stroke: null });
        circle(wx + 42, wy - 30, 20, { fill: skyA, stroke: null });
        for (const [sx, sy] of [[-52, -32], [-22, -44], [6, -10], [-42, 18], [58, 12]]) {
          circle(wx + sx, wy + sy, 3.2, { fill: '#FFFDF0', stroke: null });
        }
        X.restore();
      }
      if (day > .25) {
        X.save();
        X.globalAlpha *= clamp((day - .25) / .6);
        const sunY = lerp(wy + 38, wy - 24, day);
        circle(wx + 42, sunY, 26, { fill: '#FFE15A', stroke: '#F59E0B', lwPx: 2.2 });
        ellipse(wx - 34, wy + 16, 30, 12, { fill: 'rgba(255,255,255,.88)', stroke: null });
        X.restore();
      }
      // Mullions & curtains
      line([[wx, wy - wh / 2], [wx, wy + wh / 2]], { stroke: '#FFFDF7', lwPx: 6 });
      line([[wx - ww / 2, wy], [wx + ww / 2, wy]], { stroke: '#FFFDF7', lwPx: 6 });
      shape(rectPts(wx - ww / 2, wy - wh / 2, ww, wh), { fill: null, stroke: INK, lwPx: 4.5 });
      // Striped sky/pink curtains framing the window
      shape([[wx - ww / 2 - 22, wy - wh / 2 - 6], [wx - ww / 2 + 16, wy - wh / 2 - 6], [wx - ww / 2 + 4, wy + wh / 2 + 12], [wx - ww / 2 - 26, wy + wh / 2 + 12]],
        { fill: '#8CCDF2', stroke: INK, lwPx: 3.4 });
      shape([[wx + ww / 2 - 16, wy - wh / 2 - 6], [wx + ww / 2 + 22, wy - wh / 2 - 6], [wx + ww / 2 + 26, wy + wh / 2 + 12], [wx + ww / 2 - 4, wy + wh / 2 + 12]],
        { fill: '#8CCDF2', stroke: INK, lwPx: 3.4 });

      // Cute Earth poster on left wall
      shape(rectPts(-265, -248, 86, 108), { fill: '#FFFDF7', stroke: INK, lwPx: 3.5 });
      circle(-222, -194, 28, { fill: PLP.eveOcean, stroke: INK, lwPx: 2.8 });
      ellipse(-232, -200, 10, 14, { fill: PLP.eveLand, stroke: null, rot: .3 });
      ellipse(-210, -186, 11, 9, { fill: PLP.eveLand, stroke: null, rot: -.2 });

      // Bedroom door on the far right
      shape(rectPts(280, -225, 115, 225), { fill: mixCol('#8E6248', '#D89E6E', day), stroke: INK, lwPx: 4.2 });
      shape(rectPts(296, -206, 83, 86), { fill: mixCol('#7D533C', '#C98C5B', day), stroke: INK, lwPx: 2.5 });
      shape(rectPts(296, -104, 83, 86), { fill: mixCol('#7D533C', '#C98C5B', day), stroke: INK, lwPx: 2.5 });
      circle(300, -110, 7, { fill: '#F7C948', stroke: INK, lwPx: 2.4 });
    });

    // Nightstand & glowing lamp on the left
    P.billboard(-225, 0, 720, () => {
      shape(rectPts(-44, -84, 88, 84), { fill: '#B87B4B', stroke: INK, lwPx: 3.8 });
      shape(rectPts(-36, -74, 72, 28), { fill: '#CF925F', stroke: INK, lwPx: 2.6 });
      circle(0, -60, 4.5, { fill: '#F7C948', stroke: INK, lwPx: 1.8 });
      // Lamp
      shape([[-18, -84], [18, -84], [10, -102], [-10, -102]], { fill: '#8A6B5C', stroke: INK, lwPx: 3 });
      shape([[-28, -102], [28, -102], [18, -138], [-18, -138]], { fill: day < .5 ? '#FFF3AE' : '#FFE8A3', stroke: INK, lwPx: 3.2 });
      if (day < .5) circle(0, -118, 56, { fill: 'rgba(255,235,140,.22)', stroke: null });
    });

    // Earth-themed bed (headboard behind Eve; footboard drawn in front when Eve is in bed!)
    if (o.showBed !== false) {
      P.billboard(-30, 0, 690, () => {
        // Headboard + pillow
        shape(rectPts(-118, -136, 236, 74), { fill: '#6AB8E6', stroke: INK, lwPx: 4, smooth: .12 });
        ellipse(-52, -78, 52, 22, { fill: '#FFFDF8', stroke: INK, lwPx: 3.2 });
      });
    }
  }

  function drawEarthBedFront(P) {
    P.billboard(-30, 0, 620, () => {
      // Cozy sky-blue quilt with green continent corners & smiling footboard (faithful to Jenna's Row 1!)
      shape(rectPts(-126, -72, 252, 72), { fill: PLP.eveOcean, stroke: INK, lwPx: 4.2, smooth: .08 });
      shape([[-124, -72], [-72, -72], [-86, -42], [-124, -36]], { fill: PLP.eveLand, stroke: INK, lwPx: 2.6, smooth: .3 });
      shape([[124, -72], [72, -72], [84, -44], [124, -38]], { fill: PLP.eveLand, stroke: INK, lwPx: 2.6, smooth: .3 });
      // Cute smiling face on footboard
      circle(-22, -36, 5, { fill: INK, stroke: null });
      circle(22, -36, 5, { fill: INK, stroke: null });
      ellipse(-34, -28, 7, 4, { fill: rgba(PLP.blush, .75), stroke: null });
      ellipse(34, -28, 7, 4, { fill: rgba(PLP.blush, .75), stroke: null });
      line([[-10, -30], [0, -22], [10, -30]], { stroke: INK, lwPx: 3.2, smooth: true });
    });
  }

  // SET 3: 3D Cozy Kitchen (warm cream walls, checkered tile floor, black stove, wall clock, counter)
  function drawKitchenBg(P, t, o = {}) {
    const backZ = 820;
    X.fillStyle = linGrad(0, 0, 0, H, [[0, '#FFF5DC'], [1, '#F6DFB8']]);
    X.fillRect(0, 0, W, H);
    const floor = P.poly([[-580, 0, 100], [580, 0, 100], [580, 0, backZ], [-580, 0, backZ]]);
    if (floor) shape(floor, { fill: '#E8D5B8', stroke: INK, lwPx: 3.5 });
    // Checkered pastel kitchen tiles
    for (let gx = -520; gx < 520; gx += 104) {
      for (let gz = 140; gz < backZ; gz += 110) {
        if (((Math.round(gx / 104) + Math.round(gz / 110)) & 1) === 0) {
          const sq = P.poly([[gx, 0, gz], [gx + 104, 0, gz], [gx + 104, 0, gz + 110], [gx, 0, gz + 110]]);
          if (sq) shape(sq, { fill: 'rgba(180,145,108,.18)', stroke: null });
        }
      }
    }
    const base = P.poly([[-580, 0, backZ], [580, 0, backZ], [580, 18, backZ], [-580, 18, backZ]]);
    if (base) shape(base, { fill: '#FFFDF7', stroke: INK, lwPx: 2.8 });

    P.plane(backZ - 1, () => {
      // Subway tile backsplash band
      shape(rectPts(-540, -195, 1080, 86), { fill: '#FFFBF0', stroke: INK, lwPx: 3 });
      // Wall clock ticking cheerfully
      const cx = -210, cy = -268;
      circle(cx, cy, 38, { fill: '#FFFDF8', stroke: INK, lwPx: 4 });
      for (let i = 0; i < 12; i++) {
        const a = i * TAU / 12;
        line([[cx + Math.cos(a) * 28, cy + Math.sin(a) * 28], [cx + Math.cos(a) * 33, cy + Math.sin(a) * 33]], { stroke: INK, lwPx: 2 });
      }
      line([[cx, cy], [cx + 12, cy - 18]], { stroke: INK, lwPx: 3.6 });
      line([[cx, cy], [cx + Math.cos(t * .6) * 24, cy + Math.sin(t * .6) * 24]], { stroke: '#E2414B', lwPx: 2.5 });
      circle(cx, cy, 4, { fill: INK, stroke: null });

      // Sunny kitchen window on the right
      const wx = 260, wy = -238, ww = 175, wh = 122;
      shape(rectPts(wx - ww / 2, wy - wh / 2, ww, wh), { fill: linGrad(wx, wy - wh / 2, wx, wy + wh / 2, [[0, '#72C8F6'], [1, '#D4F3FF']]), stroke: INK, lwPx: 4 });
      circle(wx + 38, wy - 20, 22, { fill: '#FFE15A', stroke: '#F59E0B', lwPx: 2 });
      line([[wx, wy - wh / 2], [wx, wy + wh / 2]], { stroke: '#FFFDF7', lwPx: 5.5 });
      line([[wx - ww / 2, wy], [wx + ww / 2, wy]], { stroke: '#FFFDF7', lwPx: 5.5 });
      shape(rectPts(wx - ww / 2, wy - wh / 2, ww, wh), { fill: null, stroke: INK, lwPx: 4 });

      // Kitchen counters & iconic black stove (center-left)
      shape(rectPts(-520, -112, 340, 112), { fill: '#B5D4BE', stroke: INK, lwPx: 3.8 });
      shape(rectPts(-525, -122, 350, 14), { fill: '#D9A773', stroke: INK, lwPx: 3.5 });
      shape(rectPts(40, -112, 480, 112), { fill: '#B5D4BE', stroke: INK, lwPx: 3.8 });
      shape(rectPts(35, -122, 490, 14), { fill: '#D9A773', stroke: INK, lwPx: 3.5 });
      if (o.showStove !== false) {
        // Black stove (faithful to Jenna's comic!)
        shape(rectPts(-178, -122, 212, 122), { fill: '#3A3642', stroke: INK, lwPx: 4.5 });
        shape(rectPts(-166, -112, 188, 24), { fill: '#2B2833', stroke: INK, lwPx: 2.5 });
        for (const kx of [-125, -80, -35, 10]) circle(kx, -100, 6.5, { fill: '#E8E2DA', stroke: INK, lwPx: 2 });
        shape(rectPts(-152, -78, 160, 62), { fill: '#524D5C', stroke: INK, lwPx: 3.2 });
        line([[-132, -70], [-12, -70]], { stroke: '#EAE4DC', lwPx: 5 });
      }
    });

    // Sizzling skillet sitting on top of the black stove (optional)
    if (o.stoveSkillet) {
      const [sx, sy, k] = P.p(-72, 126, backZ - 8);
      drawSkillet(sx, sy, k * 1.15, o.stovePancake !== false, t);
    }
  }

  // SET 4: 3D Entryway / Hallway
  function drawHallwayBg(P) {
    const backZ = 800;
    X.fillStyle = linGrad(0, 0, 0, H, [[0, '#F5EBFA'], [1, '#E5D5EF']]);
    X.fillRect(0, 0, W, H);
    const floor = P.poly([[-540, 0, 100], [540, 0, 100], [540, 0, backZ], [-540, 0, backZ]]);
    if (floor) shape(floor, { fill: '#C99666', stroke: INK, lwPx: 3.5 });
    const rug = P.poly([[-220, 1, 380], [220, 1, 380], [220, 1, 660], [-220, 1, 660]]);
    if (rug) shape(rug, { fill: '#E89EB4', stroke: INK, lwPx: 3.2 });
    const base = P.poly([[-540, 0, backZ], [540, 0, backZ], [540, 18, backZ], [-540, 18, backZ]]);
    if (base) shape(base, { fill: '#FFFDF7', stroke: INK, lwPx: 2.8 });
    P.plane(backZ - 1, () => {
      // Wooden front door with frosted glass window & doorbell chime
      shape(rectPts(170, -255, 138, 255), { fill: '#A86D43', stroke: INK, lwPx: 4.5 });
      shape(rectPts(196, -230, 86, 86), { fill: '#CFEFFF', stroke: INK, lwPx: 3.5 });
      circle(192, -120, 7.5, { fill: '#F7C948', stroke: INK, lwPx: 2.4 });
      // Framed picture & coat hooks on left
      shape(rectPts(-265, -240, 120, 92), { fill: '#FFFDF7', stroke: '#8E6248', lwPx: 6 });
      ellipse(-205, -194, 34, 22, { fill: '#8AD0F5', stroke: null });
      shape(rectPts(-310, -124, 150, 16), { fill: '#B57B4C', stroke: INK, lwPx: 3 });
      for (const hx of [-280, -235, -190]) circle(hx, -116, 5, { fill: '#F7C948', stroke: INK, lwPx: 2 });
    });
  }

  // SET 5: 3D Sunny Yard Time-Out Corner (lawn, white fence, leafy garden hedge)
  function drawYardBg(P, t) {
    X.fillStyle = linGrad(0, 0, 0, P.cam.hy + 60, [[0, '#72C8F6'], [1, '#DAF4FF']]);
    X.fillRect(0, 0, W, P.cam.hy + 80);
    circle(1580, 175, 58, { fill: '#FFE15A', stroke: '#F59E0B', lwPx: 4 });
    for (let i = 0; i < 3; i++) {
      const cx = ((300 + i * 560 + t * 14) % (W + 300)) - 150;
      ellipse(cx, 130 + (i % 2) * 45, 76, 30, { fill: 'rgba(255,253,248,.92)', stroke: null });
    }
    const lawn = P.poly([[-1200, 0, 100], [1200, 0, 100], [1200, 0, 1200], [-1200, 0, 1200]]);
    if (lawn) shape(lawn, { fill: linGrad(0, P.cam.hy, 0, H, [[0, '#85D474'], [1, '#58AD4D']]), stroke: null });
    // White picket fence across the back
    P.plane(860, () => {
      shape(rectPts(-760, -108, 1520, 16), { fill: '#FFFDF7', stroke: INK, lwPx: 3.2 });
      shape(rectPts(-760, -48, 1520, 16), { fill: '#FFFDF7', stroke: INK, lwPx: 3.2 });
      for (let x = -720; x <= 720; x += 64) {
        shape([[x - 18, 0], [x - 18, -124], [x, -148], [x + 18, -124], [x + 18, 0]], { fill: '#FFFDF7', stroke: INK, lwPx: 3.2 });
      }
    });
  }

  // Helper to stage a Palm Pal into depthStage(P) with M3 castShadow & lighting
  function stagePal(st, P, t, palKey, pt, o = {}, onAnchor = null) {
    if (!P.visible(pt)) return;
    const [sx, sy, k] = P.p(pt[0], pt[1], pt[2]);
    const sizeMul = palKey === 'eve_dad' || palKey === 'zelie_papa' ? 1.24 : palKey === 'zelie' ? .93 : 1.0;
    const s = UNIT * sizeMul * (o.scale ?? 1.95) * k;
    const mouth = mouthFor(t, palKey, o.restMouth || 'smile', o.mouth);
    const draw = () => {
      const a = palmPals(sx, sy, s, {
        t, pal: palKey, mouth, noShadow: fxEnabled('m3') || o.noShadow, ...o,
      });
      if (o.hat && a.top) drawBrownHat(a.top[0], a.top[1] + s * .35, s * .088, o.hatRot || 0);
      if (o.heartEyes) drawHeartEyes(a, s, 1 + .08 * Math.sin(t * 10));
      if (o.deadpan) drawDeadpanOverlay(a, s);
      if (o.scuffed) drawScuffs(a, s);
      if (o.laughTears) drawLaughTears(a, s, t);
      if (o.angryCloud && a.top) drawAngryCloud(a.top[0], a.top[1] - s * 2.85, s / 15, t);
      if (o.spatula && a.handR) drawSpatula(a.handR[0], a.handR[1], s * .055, -.28 + Math.sin(t * 5) * .12);
      if (onAnchor) onAnchor(a, s);
      return a;
    };
    if (o.noShadow) {
      st.add(pt, draw);
    } else {
      st.char(pt, draw, { foot: [sx, sy + 2], shadow: { scaleY: .22, blur: 2.5 } });
    }
  }

  // ============================================================================
  // SHOT 1 (0–15s): Cover Title Splash & Animated Character Bios
  // ============================================================================
  function shot01_title_and_bios(t, lt) {
    if (lt < 5.5) {
      const P = persp({ x: lerp(-18, 14, ease(lt / 5.5)), y: 112, z: lerp(155, 225, ease(lt / 5.5)), f: 1000, hy: 525 });
      withLight(SUNNY_LIGHT, () => {
        drawAdventureBg(P, t, { earthFront: true, palmTree: true, sunProg: .32 });
        // Glowing diamond portal crest embedded in the brown earth
        const [px, py, pk] = P.p(0, 6, 560);
        bloom(() => {
          shape([[px, py - 56 * pk], [px + 42 * pk, py], [px, py + 56 * pk], [px - 42 * pk, py]],
            { fill: '#63D2FF', stroke: '#1E4E8C', lwPx: 5 });
          shape([[px, py - 32 * pk], [px + 22 * pk, py], [px, py + 32 * pk], [px - 22 * pk, py]],
            { fill: '#E0F7FF', stroke: null });
        }, { radius: 18, strength: .55 });

        const st = depthStage(P);
        stagePal(st, P, t, 'eve', [-96, 0, 520], {
          eyes: 'wide', brows: 'worried', restMouth: 'o', lookX: .25, hat: true, bounce: .35, sway: .3, armL: .5, armR: -.45,
        });
        stagePal(st, P, t, 'zelie', [98, 0, 520], {
          eyes: 'open', restMouth: 'grin', bounce: .65, sway: .4, giggle: .35, armL: .35, armR: -.65,
        });
        st.flush();
      });

      const tk = backOut(seg(lt, .25, 1.05)) * (1 - easeIn(seg(lt, 4.9, 5.5)));
      overlay(() => {
        X.save();
        X.translate(W / 2, 165);
        X.scale(.86 + .14 * tk, .86 + .14 * tk);
        X.globalAlpha = clamp(tk);
        drawText('THE ADVENTURE', 0, 0, 118, '#2A4B7C', '#FFFDF7', 20, FONT_SFX);
        drawText('Palm Pals Adventures #1  ·  By Jenna Safadi', 0, 86, 36, '#7C3E62', '#FFFDF7', 10);
        X.restore();
      });
      return;
    }

    // Character Bio Cards: Eve Earth (5.5–10.2s) & Zelie Pink Lemonade (10.2–15.0s)
    const isEve = lt < 10.2;
    const segT = isEve ? lt - 5.5 : lt - 10.2;
    const pop = backOut(seg(segT, 0, .55));
    const bgA = isEve ? '#CBEFFF' : '#FFD9EC', bgB = isEve ? '#EBF9FF' : '#FFF1F7';
    X.fillStyle = linGrad(0, 0, 0, H, [[0, bgA], [1, bgB]]);
    X.fillRect(0, 0, W, H);
    // Floating sparkle accents
    for (let i = 0; i < 10; i++) {
      const sx = 120 + hash(i * 5.3 + (isEve ? 1 : 9)) * (W - 240);
      const sy = 140 + hash(i * 7.7 + (isEve ? 2 : 8)) * (H - 280) + Math.sin(t * 2 + i) * 14;
      shape(starPts(sx, sy, 18 + (i % 3) * 8, .38, 4), { fill: isEve ? '#FFF08A' : '#FFFFFF', stroke: rgba(INK, .25), lwPx: 2 });
    }
    // Storybook circular spotlight frame
    circle(W * .5, H * .56, 310 * (.92 + .08 * pop), { fill: '#FFFDF8', stroke: isEve ? '#7AC3EB' : '#F682B0', lwPx: 14 });
    const anchors = {};
    withLight(WARM_LIGHT, () => {
      if (isEve) {
        const wave = -.75 + Math.sin(t * 10) * .28;
        anchors.eve = eveEarth(W * .5, H * .75, 42 * (.82 + .18 * pop), {
          t, mouth: mouthFor(t, 'eve', 'grin'), bounce: .55, sway: .3, armL: .35, armR: wave,
        });
      } else {
        anchors.zelie = zelieLemonade(W * .5, H * .77, 38 * (.82 + .18 * pop), {
          t, eyes: segT > 2.2 ? 'happy' : 'open', mouth: mouthFor(t, 'zelie', 'laugh'),
          bounce: .85, giggle: .85, armL: .45 + Math.sin(t * 11) * .22, armR: -.82 + Math.cos(t * 11) * .22,
        });
      }
    });
    captionBanner(isEve ? 'EVE EARTH  ·  10 years old' : 'ZELIE PINK LEMONADE  ·  6 years old', W * .5, 130, pop,
      isEve ? '#FFF6D6' : '#FFF0F6', INK, 42);
    showBubbles(t, anchors, {
      eve: { dx: 360, dy: -165, size: 44 },
      zelie: { dx: 360, dy: -175, size: 42 },
    });
  }

  // ============================================================================
  // SHOT 2 (15–30s): Starry Night → Sunny Morning Wake-Up & Pancake Aroma Dash
  // ============================================================================
  function shot02_wakeup(t, lt) {
    const sunrise = ease(seg(lt, 4.2, 6.2)); // 0 = night (15–19.2s), 1 = bright morning (21.2–30s)
    const P = persp({
      x: lerp(-35, 18, ease(lt / 15)),
      y: 122,
      z: lerp(180, 260, ease(seg(lt, 0, 10))) - ease(seg(lt, 11.5, 15)) * 40,
      f: 1000, hy: 545,
    });
    const anchors = {};
    withLight(sunrise < .45 ? NIGHT_LIGHT : WARM_LIGHT, () => {
      drawBedroomBg(P, t, { day: sunrise, showBed: true });

      const inBed = lt < 11.0;
      const st = depthStage(P);
      if (inBed) {
        const yawn = seg(lt, 5.2, 7.6);
        const sniff = seg(lt, 8.6, 10.6);
        const sleepyEyes = lt < 5.0 ? 'closed' : lt < 7.8 ? 'sleepy' : sniff > .2 ? 'sparkle' : 'open';
        const restM = lt < 5.0 ? 'smile' : lt < 7.2 ? 'O' : 'grin';
        const stretch = Math.sin(yawn * Math.PI);
        stagePal(st, P, t, 'eve', [-30, 56 + stretch * 8, 665], {
          eyes: sleepyEyes, restMouth: restM,
          noFeet: true, noArms: lt < 4.9,
          armL: .3 + stretch * .75, armR: -.3 - stretch * .75,
          emote: lt < 4.8 ? 'zzz' : sniff > .35 ? 'spark' : undefined,
          emoteK: lt < 4.8 ? 1 : sniff,
          noShadow: true,
        }, a => { anchors.eve = a; });
        st.add(620, () => drawEarthBedFront(P));
        st.flush();
      } else {
        // Hops out of bed & rockets out the right doorway!
        st.add(620, () => drawEarthBedFront(P));
        const hop = seg(lt, 11.0, 12.6), dash = easeIn(seg(lt, 13.0, 14.9));
        const ex = lerp(35, 95, ease(hop)) + dash * 540;
        const ez = lerp(600, 520, ease(hop));
        const jump = Math.sin(hop * Math.PI) * 2.4 + (dash > .05 ? Math.abs(Math.sin(t * 22)) * .7 : 0);
        stagePal(st, P, t, 'eve', [ex, 0, ez], {
          eyes: dash > .1 ? 'happy' : 'sparkle', restMouth: 'grin',
          jump, rot: dash * .22, bounce: .6,
          armL: .75, armR: -.75,
        }, a => { anchors.eve = a; });
        st.flush();
        if (dash > .08) {
          const [sx, sy] = P.p(ex, 45, ez);
          drawSpeedLines(sx - 340, sy, sx - 70, sy, 5, INK, .78);
        }
      }

      // Floating warm golden pancake scent wisps wafting from doorway (23–28s)
      if (lt > 7.8 && lt < 13.4) {
        const wk = seg(lt, 7.8, 8.8) * (1 - seg(lt, 12.6, 13.4));
        const [dx, dy] = P.p(280, 110, 760);
        X.save();
        X.globalAlpha = .72 * wk;
        for (let i = 0; i < 3; i++) {
          const off = i * 44, ph = t * 3.5 + i;
          line([
            [dx - off, dy + Math.sin(ph) * 16],
            [dx - 160 - off, dy - 26 + Math.cos(ph) * 20],
            [dx - 330 - off, dy - 10 + Math.sin(ph + 1) * 18],
          ], { stroke: '#F5B841', lwPx: 7, smooth: true });
        }
        X.restore();
      }
    });

    if (lt >= 5.3 && lt <= 7.2) sfx('YAWN!', 1080, 355, 76, '#69A8E8', lt - 5.3);
    if (lt >= 13.3 && lt <= 14.8) sfx('ZOOM!', 940, 420, 96, '#FFE066', lt - 13.3);
    grade({ warmth: lerp(-.18, .12, sunrise), tint: sunrise < .5 ? '#203068' : null, alpha: (1 - sunrise) * .16 });
    showBubbles(t, anchors, { eve: { dx: 290, dy: -165 } });
  }

  // ============================================================================
  // SHOT 3 (30–47s): Sizzling Pancakes, High Flip Toss & Doorbell!
  // ============================================================================
  function shot03_pancakes_and_doorbell(t, lt) {
    const P = persp({
      x: lerp(-25, 15, ease(lt / 17)),
      y: 120,
      z: lerp(215, 275, ease(seg(lt, 0, 10))),
      f: 1000, hy: 540,
    });
    const anchors = {};
    withLight(WARM_LIGHT, () => {
      drawKitchenBg(P, t, { showStove: true, stoveSkillet: lt >= 15.8 });

      const st = depthStage(P);
      // Eve dashes in from left (0–1.0s), then watches Dad flip pancakes
      const eveIn = easeOut(seg(lt, 0, .9));
      const eveX = lerp(-340, 130, eveIn);
      const dadZoom = easeIn(seg(lt, 15.4, 16.9)); // Dad rockets off to get the door!
      const dadX = -95 + dadZoom * 680;
      const tossPhase = seg(lt, 6.2, 8.8); // Parabolic pancake toss high into the air!
      const tossArc = tossPhase > 0 && tossPhase < 1 ? Math.sin(tossPhase * Math.PI) : 0;

      const ding = lt >= 11.0;
      stagePal(st, P, t, 'eve_dad', [dadX, 0, 620], {
        eyes: ding && lt < 15.2 ? 'happy' : tossArc > .1 ? 'happy' : 'open',
        restMouth: ding ? 'grin' : 'smile',
        bounce: .35, sway: .25, rot: dadZoom * .22,
        armL: .22, armR: -.38 - tossArc * .65,
        spatula: ding && lt < 15.6,
      }, (a, s) => {
        anchors.eve_dad = a;
        if (!ding && a.handR) {
          drawSkillet(a.handR[0] + s * 2.1, a.handR[1] - s * .3, s * .058, tossArc < .04, t);
        }
      });

      stagePal(st, P, t, 'eve', [eveX, 0, 600], {
        eyes: ding ? 'open' : tossPhase > .1 ? 'sparkle' : 'open',
        brows: ding && lt > 13.5 ? 'worried' : 'none',
        restMouth: ding && lt > 13.5 ? 'flat' : 'grin',
        lookX: ding ? -.3 : -.65,
        lookY: tossArc > .1 ? -.65 : 0,
        bounce: .45, jump: (1 - eveIn) * .6,
        armL: .55, armR: -.35,
      }, a => { anchors.eve = a; });
      st.flush();

      // Flying golden pancake during toss!
      if (tossArc > .01) {
        const [px, py, pk] = P.p(-45, 78 + tossArc * 168, 605);
        drawPancake(px, py, pk * 1.15, tossPhase * TAU * 1.5, 1);
      }
      if (dadZoom > .08) {
        const [sx, sy] = P.p(dadX, 55, 620);
        drawSpeedLines(sx - 340, sy, sx - 60, sy, 5, INK, .76);
      }
    });

    if (lt >= 11.0 && lt <= 12.6) sfx('DING DONG!', 1480, 260, 86, '#FFE066', lt - 11.0);
    if (lt >= 6.4 && lt <= 8.5) captionBanner('up and down!', 920, 145, seg(lt, 6.4, 6.8) * (1 - seg(lt, 8.1, 8.5)));
    showBubbles(t, anchors, {
      eve: { dx: 240, dy: -180 },
      eve_dad: { dx: -250, dy: -195 },
    });
  }

  // ============================================================================
  // SHOT 4 (47–65s): Sneaking a Pancake Bite, Heart Eyes Daydream & "Shoot!"
  // ============================================================================
  function shot04_sneak_pancake(t, lt) {
    // 47–55.5: Sneaking up to stove, FLIP over hand, MUNCH!
    // 55.5–60.5: Heart eyes & pastel pancake-heaven daydream cloud!
    // 60.5–65.0: Dad calls from hallway → snaps awake, shoves pancake in mouth, dashes right!
    const inDream = lt >= 8.5 && lt < 13.5;
    const snap = lt >= 13.5;
    const P = persp({
      x: lerp(-20, -40, ease(seg(lt, 0, 5))),
      y: 112,
      z: lerp(260, 355, ease(seg(lt, 0, 7))) - (snap ? 45 : 0),
      f: 1000, hy: 535,
    });
    const anchors = {};

    withLight(WARM_LIGHT, () => {
      drawKitchenBg(P, t, { showStove: true, stoveSkillet: lt < 4.8, stovePancake: lt < 4.6 });

      if (inDream) {
        // Pastel dreamy pancake-heaven vignette + floating cloud with giant golden pancake!
        X.save();
        X.fillStyle = 'rgba(255,232,245,.86)';
        X.fillRect(0, 0, W, H);
        for (let i = 0; i < 8; i++) {
          const hx = 180 + hash(i * 4.3) * (W - 360);
          const hy = ((H - ((t * 75 + i * 165) % (H + 140))));
          circle(hx, hy, 18, { fill: 'rgba(255,140,185,.35)', stroke: null });
        }
        // Giant fluffy thought-cloud frame
        for (const [cx, cy, rx, ry] of [[W * .5, H * .44, 430, 210], [W * .32, H * .46, 210, 150], [W * .68, H * .46, 210, 150], [W * .5, H * .30, 250, 130]]) {
          ellipse(cx, cy, rx, ry, { fill: '#FFFDF9', stroke: '#F4A6C4', lwPx: 6 });
        }
        // Bouncing giant golden pancake & joyful heart-eyed Eve!
        const b = Math.abs(Math.sin(t * 5.2));
        drawPancake(W * .58, H * .46 - b * 36, 3.2, Math.sin(t * 4) * .08, 2);
        anchors.eve = eveEarth(W * .38, H * .59, 28, {
          t, eyes: 'open', mouth: mouthFor(t, 'eve', 'laugh'),
          jump: b * 1.4, armL: .75, armR: -.75, noShadow: true,
        });
        drawHeartEyes(anchors.eve, 28, 1 + .1 * Math.sin(t * 11));
        X.restore();
      } else {
        const st = depthStage(P);
        const creep = ease(seg(lt, 0, 4.4));
        const dashOut = easeIn(seg(lt, 16.5, 17.9));
        const ex = lerp(90, -18, creep) + dashOut * 620;
        const flipMoment = lt >= 4.7 && lt < 6.7;
        const munchMoment = lt >= 6.7 && lt < 8.5;
        const shoveMoment = lt >= 14.5 && lt < 16.8;

        stagePal(st, P, t, 'eve', [ex, 0, 620], {
          eyes: flipMoment || snap ? 'wide' : munchMoment ? 'happy' : 'open',
          brows: flipMoment ? 'up' : snap ? 'worried' : 'none',
          restMouth: flipMoment ? 'o' : munchMoment || shoveMoment ? 'O' : 'smile',
          lookX: flipMoment ? -.65 : snap ? .75 : -.55,
          bounce: .4, rot: dashOut * .22,
          armL: flipMoment ? .15 : shoveMoment ? .7 : .35,
          armR: flipMoment ? -.55 : shoveMoment ? -.85 : -.35,
          jump: dashOut > .05 ? Math.abs(Math.sin(t * 22)) * .7 : 0,
        }, (a, s) => {
          anchors.eve = a;
          if (flipMoment && a.handL) {
            drawFloppyPancake(a.handL[0] - s * .3, a.handL[1] + s * .25, s * .06);
          } else if ((munchMoment || shoveMoment) && a.mouth) {
            drawBittenPancake(a.mouth[0] + s * .45, a.mouth[1], s * .055, -.14);
            // Flying crumbs!
            for (let i = 0; i < 4; i++) {
              const cx = a.mouth[0] + (i - 1.5) * 32 + Math.sin(t * 18 + i) * 10;
              const cy = a.mouth[1] - 16 - (i % 2) * 18;
              circle(cx, cy, 5.5, { fill: '#E8A552', stroke: INK, lwPx: 1.8 });
            }
          }
        });
        st.flush();
        if (dashOut > .08) {
          const [sx, sy] = P.p(ex, 45, 620);
          drawSpeedLines(sx - 320, sy, sx - 60, sy, 5, INK, .78);
        }
      }
    });

    // Off-screen Dad call bubble at right edge when snapping out of dream
    if (lt >= 13.4 && lt < 15.8) {
      anchors.eve_dad = { mouth: [W - 40, 260] };
    }
    if (lt >= 4.8 && lt <= 6.2) sfx('FLIP!', 760, 410, 84, '#FFE066', lt - 4.8);
    if (lt >= 6.8 && lt <= 8.2) sfx('MUNCH!', 980, 340, 88, '#FF8DA6', lt - 6.8);
    showBubbles(t, anchors, {
      eve: { dx: inDream ? 290 : 250, dy: -180 },
      eve_dad: { dx: -360, dy: 10 },
    });
  }

  // ============================================================================
  // SHOT 5 (65–82s): Meeting the "Enemy" Zelie & Rival Glare-Off!
  // ============================================================================
  function shot05_meet_enemy(t, lt) {
    const dadsLeave = ease(seg(lt, 9.2, 11.2));
    const zoomIn = ease(seg(lt, 10.6, 13.0));
    const P = persp({
      x: lerp(0, 12, zoomIn),
      y: 112,
      z: lerp(215, 330, zoomIn),
      f: 1000, hy: 535,
    });
    const anchors = {};
    withLight(WARM_LIGHT, () => {
      drawHallwayBg(P);

      // Dramatic pulsing red spotlight ring around Zelie during reveal (67.2–70.6s)!
      const spotK = seg(lt, 2.2, 2.6) * (1 - seg(lt, 5.2, 5.7));
      if (spotK > .02) {
        const [zx, zy, zk] = P.p(175, 42, 600);
        X.save();
        X.globalAlpha = spotK;
        circle(zx, zy, 128 * zk * (1 + .05 * Math.sin(t * 14)),
          { fill: 'rgba(255,224,102,.28)', stroke: '#E2414B', lwPx: 7, dash: [18, 10] });
        X.restore();
      }

      const st = depthStage(P);
      const stare = lt >= 10.2;
      // Eve on left, Dad & Papa in center (walking off-left toward kitchen at 9.2s), Zelie on right
      const eveX = lerp(-215, -92, zoomIn);
      const zelieX = lerp(175, 112, zoomIn);

      stagePal(st, P, t, 'eve', [eveX, 0, 600], {
        eyes: lt < 10.2 ? 'wide' : 'open',
        brows: stare ? 'angry' : lt > 2.2 ? 'worried' : 'none',
        restMouth: stare ? 'frown' : 'flat',
        lookX: .8, bounce: .25,
        armL: stare ? .45 : .2, armR: stare ? -.55 : -.2,
      }, a => { anchors.eve = a; });

      if (dadsLeave < .98) {
        const shift = dadsLeave * -560;
        stagePal(st, P, t, 'eve_dad', [-62 + shift, 0, 625], {
          eyes: 'happy', restMouth: 'grin', bounce: .35,
          armL: .22, armR: -.45,
        }, a => { anchors.eve_dad = a; });
        stagePal(st, P, t, 'zelie_papa', [62 + shift, 0, 625], {
          eyes: 'open', restMouth: 'smile', bounce: .35,
          armL: .2, armR: -.25,
        }, a => { anchors.zelie_papa = a; });
      }

      stagePal(st, P, t, 'zelie', [zelieX, 0, 600], {
        eyes: stare ? 'wide' : 'open',
        brows: stare ? 'angry' : 'none',
        restMouth: stare ? 'frown' : 'smile',
        lookX: stare ? -.85 : -.25,
        bounce: stare ? .5 : .35,
        armL: stare ? .65 : .22, armR: stare ? -.55 : -.22,
      }, a => { anchors.zelie = a; });
      st.flush();
    });

    showBubbles(t, anchors, {
      eve: { dx: -160, dy: -195 },
      zelie: { dx: 185, dy: -195 },
      eve_dad: { dx: -120, dy: -220 },
      zelie_papa: { dx: 150, dy: -230 },
    });
  }

  // ============================================================================
  // SHOT 6 (82–101s): Rival Showdown, Angry Clouds & Warp-Speed Breakfast Table!
  // ============================================================================
  function shot06_showdown_and_breakfast(t, lt) {
    const atTable = lt >= 11.0; // 82–93s Hallway showdown & pancake dash; 93–101s Breakfast Table!
    const anchors = {};

    if (!atTable) {
      const shout = lt >= 4.4 && lt < 7.6;
      const eveZoom = easeIn(seg(lt, 9.0, 10.6));
      const shake = shout ? shakeXY(t, 6) : [0, 0];
      camBegin(W / 2 + shake[0], H / 2 + shake[1], shout ? 1.04 : 1, 0);
      const P = persp({ x: 0, y: 116, z: lerp(285, 250, ease(lt / 11)), f: 1000, hy: 540 });
      withLight(WARM_LIGHT, () => {
        drawHallwayBg(P);
        const st = depthStage(P);
        const ex = -95 + eveZoom * 720;
        stagePal(st, P, t, 'eve', [ex, 0, 600], {
          eyes: eveZoom > .05 ? 'sparkle' : shout ? 'open' : 'open',
          brows: lt < 7.6 ? 'angry' : 'none',
          restMouth: shout ? 'O' : eveZoom > .05 ? 'grin' : 'frown',
          lookX: .8, rot: shout ? .1 : eveZoom * .24,
          armL: shout ? .8 : .65, armR: shout ? -.9 : -.6,
          angryCloud: lt < 7.5,
          bounce: .7,
        }, a => { anchors.eve = a; });

        stagePal(st, P, t, 'zelie', [105, 0, 600], {
          eyes: lt >= 8.5 ? 'wide' : 'open',
          brows: lt < 7.6 ? 'angry' : 'up',
          restMouth: shout ? 'O' : lt >= 8.5 ? 'o' : 'frown',
          lookX: lt >= 8.5 ? .6 : -.8, rot: shout ? -.1 : 0,
          armL: shout ? .9 : .45, armR: shout ? -.8 : -.35,
          angryCloud: lt < 7.5,
          bounce: .6,
        }, a => { anchors.zelie = a; });
        st.flush();
        if (eveZoom > .08) {
          const [sx, sy] = P.p(ex, 45, 600);
          drawSpeedLines(sx - 340, sy, sx - 60, sy, 5, INK, .8);
        }
      });
      camEnd();
      if (lt >= 7.5 && lt < 9.8) anchors.eve_dad = { mouth: [W - 40, 250] };
      showBubbles(t, anchors, {
        eve: { dx: -200, dy: -190 },
        zelie: { dx: 210, dy: -195 },
        eve_dad: { dx: -350, dy: 10 },
      });
      return;
    }

    // 93–101s: Wide 3D Breakfast Table — NOM NOM NOM & "Done! Going to my room!"
    const tblT = lt - 11.0; // 0..8s
    const eveDone = easeIn(seg(tblT, 6.2, 7.8));
    const P = persp({ x: lerp(-15, 18, ease(tblT / 8)), y: 128, z: lerp(155, 190, ease(tblT / 8)), f: 1000, hy: 535 });
    withLight(WARM_LIGHT, () => {
      drawKitchenBg(P, t, { showStove: false });
      const st = depthStage(P);
      // Four chairs behind the table
      const seats = [-235, -80, 80, 235];
      seats.forEach((sx, idx) => {
        const tilt = idx === 3 && eveDone > .08 ? -.28 * easeOut(seg(tblT, 6.3, 7.0)) : 0;
        st.add(640, () => P.billboard(sx, 0, 640, () => {
          X.save();
          X.rotate(tilt);
          shape(rectPts(-36, -126, 72, 68), { fill: '#A8744B', stroke: INK, lwPx: 3.5, smooth: .1 });
          shape(rectPts(-34, -58, 12, 58), { fill: '#8B5E3C', stroke: INK, lwPx: 3 });
          shape(rectPts(22, -58, 12, 58), { fill: '#8B5E3C', stroke: INK, lwPx: 3 });
          X.restore();
        }));
      });

      // Characters seated cleanly behind table (noFeet: true, lifted above pancake stacks!)
      stagePal(st, P, t, 'zelie', [-235, 76, 610], {
        eyes: 'happy', restMouth: 'smile', noFeet: true, noShadow: true, bounce: .35,
      }, a => { anchors.zelie = a; });
      stagePal(st, P, t, 'zelie_papa', [-80, 68, 610], {
        eyes: 'happy', restMouth: 'smile', lookX: tblT > 5.2 ? .7 : 0, noFeet: true, noShadow: true, bounce: .25,
      }, a => { anchors.zelie_papa = a; });
      stagePal(st, P, t, 'eve_dad', [80, 68, 610], {
        eyes: tblT < 5.2 ? 'wide' : 'happy', brows: tblT < 5.2 ? 'worried' : 'none',
        restMouth: 'open', lookX: tblT < 5.2 ? .8 : -.7, noFeet: true, noShadow: true, bounce: .3,
      }, a => { anchors.eve_dad = a; });
      if (eveDone < .98) {
        const nom = tblT < 5.6;
        stagePal(st, P, t, 'eve', [235 + eveDone * 460, 76, 610], {
          eyes: 'happy', restMouth: nom ? (Math.sin(t * 24) > 0 ? 'O' : 'grin') : 'grin',
          sq: nom ? .1 * Math.sin(t * 20) : 0, rot: eveDone * .2,
          armL: nom ? .75 + Math.sin(t * 22) * .2 : .5,
          armR: nom ? -.75 - Math.sin(t * 22) * .2 : -.5,
          noFeet: eveDone < .05, noShadow: true,
        }, a => { anchors.eve = a; });
      }

      // Wooden breakfast table & plates of golden pancakes in front!
      st.add(560, () => P.billboard(0, 0, 560, () => {
        shape(rectPts(-310, -64, 620, 20), { fill: '#D49A62', stroke: INK, lwPx: 4.2 });
        shape(rectPts(-288, -44, 22, 44), { fill: '#9E683B', stroke: INK, lwPx: 3.5 });
        shape(rectPts(266, -44, 22, 44), { fill: '#9E683B', stroke: INK, lwPx: 3.5 });
        // Plates & pancake stacks
        [-215, -72, 72, 215].forEach((px, idx) => {
          ellipse(px, -66, 40, 9, { fill: '#FFFDF8', stroke: INK, lwPx: 2.6 });
          const stack = idx === 3 ? (tblT < 2.5 ? 3 : tblT < 4.5 ? 1 : 0) : 2;
          if (stack > 0) drawPancake(px, -71, .55, 0, stack);
        });
      }));
      st.flush();

      if (eveDone > .08) {
        const [sx, sy] = P.p(235 + eveDone * 460, 95, 610);
        drawSpeedLines(sx - 260, sy, sx - 50, sy, 4, INK, .78);
      }
    });

    if (tblT > .6 && tblT < 4.6) sfx('NOM NOM NOM!', 1580, 250, 62, '#F59E0B', (tblT - .6) % 1.4);
    showBubbles(t, anchors, {
      zelie_papa: { dx: -195, dy: -215 },
      eve_dad: { dx: -25, dy: -225 },
      eve: { dx: -165, dy: -210 },
    });
  }

  // ============================================================================
  // SHOT 7 (101–120s): Mysterious Button → Swirling Blue Portal & Zelie's Leap!
  // ============================================================================
  function shot07_blue_portal(t, lt) {
    const portalOpen = seg(lt, 4.3, 5.4);
    const slapAge = lt - 11.4;
    const shake = slapAge > 0 && slapAge < .45 ? shakeXY(t, 12 * (1 - slapAge / .45)) : [0, 0];
    camBegin(W / 2 + shake[0], H / 2 + shake[1], 1 + (portalOpen > .1 ? .03 * Math.sin(t * 3) : 0), 0);

    const P = persp({ x: lerp(-20, 22, ease(lt / 19)), y: 118, z: lerp(210, 245, ease(seg(lt, 0, 12))), f: 1000, hy: 540 });
    const anchors = {};
    withLight(portalOpen > .2 ? PORTAL_LIGHT : WARM_LIGHT, () => {
      drawBedroomBg(P, t, { day: 1, showBed: false });

      // Mysterious glowing portal button pedestal on the left
      const [bx, by, bk] = P.p(-185, 0, 635);
      shape(rectPts(bx - 36 * bk, by - 72 * bk, 72 * bk, 72 * bk), { fill: '#6C7A89', stroke: INK, lwPx: 3.6 });
      const pressed = lt >= 3.2;
      ellipse(bx, by - (pressed ? 73 : 80) * bk, 24 * bk, 10 * bk, { fill: '#3B82F6', stroke: INK, lwPx: 3.2 });
      if (pressed && lt < 5.0) circle(bx, by - 78 * bk, 46 * bk, { fill: 'rgba(96,165,250,.45)', stroke: null });

      // Swirling cobalt-blue 3D portal on the right!
      const [px, py, pk] = P.p(165, 95, 620);
      if (portalOpen > .01) {
        bloom(() => drawPortal(px, py, 118 * pk, 142 * pk, 'blue', t, portalOpen), { radius: 22, strength: .48 });
      }

      const st = depthStage(P);
      // Eve starts near button, recoils from Zelie's slap, then dives into portal at 17.5–19.0s!
      const eveDive = easeIn(seg(lt, 17.5, 18.85));
      const evePush = slapAge > 0 && slapAge < 2.2 ? Math.sin(Math.min(1, slapAge / .6) * Math.PI) * -55 : 0;
      const eveX = lerp(-85, 165, eveDive) + evePush;
      const eveY = Math.sin(eveDive * Math.PI) * 95;
      const eveScale = 1.95 * (1 - easeIn(seg(lt, 18.2, 18.9)) * .88);

      if (lt < 18.9) {
        stagePal(st, P, t, 'eve', [eveX, eveY, 600], {
          scale: eveScale,
          eyes: lt > 14.5 ? 'open' : portalOpen > .1 ? 'wide' : 'open',
          brows: lt > 14.5 ? 'angry' : portalOpen > .1 ? 'up' : 'none',
          restMouth: lt > 14.5 ? 'O' : portalOpen > .1 ? 'O' : 'smile',
          lookX: .75,
          rot: eveDive * 1.1 + (evePush < -10 ? -.25 : 0),
          armL: lt >= 2.8 && lt < 4.2 ? .95 : .55,
          armR: -.7,
          bounce: .4,
        }, a => { anchors.eve = a; });
      }

      // Zelie bursts in from the left at 9.5s, slaps past Eve at 11.4s, and jumps straight into the portal (13–14.5s)!
      if (lt >= 9.4 && lt < 14.7) {
        const runIn = ease(seg(lt, 9.4, 12.6));
        const leap = ease(seg(lt, 12.6, 14.5));
        const zx = lerp(-430, 25, runIn) + leap * 145;
        const zy = Math.sin(leap * Math.PI) * 115;
        const zScale = 1.95 * (1 - easeIn(seg(lt, 13.8, 14.65)) * .9);
        stagePal(st, P, t, 'zelie', [zx, zy, 585], {
          scale: zScale,
          eyes: 'sparkle', restMouth: 'laugh',
          rot: leap * .85 + .12, giggle: .8,
          armL: .85, armR: -.85,
        }, a => { anchors.zelie = a; });
      } else if (lt >= 14.7 && lt < 15.8) {
        // Zelie's voice calls out from inside the swirling portal!
        anchors.zelie = { mouth: [px, py - 30] };
      }
      st.flush();

      if (eveDive > .1) drawSpeedLines(px - 340, py, px - 55, py, 5, '#3B82F6', .82);
    });
    camEnd();

    if (lt >= 3.2 && lt <= 4.3) sfx('CLICK!', 640, 560, 72, '#FFE066', lt - 3.2);
    if (lt >= 11.4 && lt <= 12.6) sfx('SLAP!', 940, 440, 88, '#FF6B9A', lt - 11.4);
    if (lt >= 18.4) flash(seg(lt, 18.4, 18.95));
    showBubbles(t, anchors, {
      eve: { dx: -210, dy: -190 },
      zelie: { dx: 185, dy: -200 },
    });
  }

  // ============================================================================
  // SHOT 8 (120–139s): Adventure World, Locked Portal & "10 HOURS LATER" Bear Chase!
  // ============================================================================
  function shot08_adventure_world(t, lt) {
    const inTimelapse = lt >= 11.5 && lt < 15.2; // 131.5–135.2s: 10-hour sun sweep & bear chase!
    const exhausted = lt >= 15.2;
    const sunProg = inTimelapse ? lerp(.22, .78, ease((lt - 11.5) / 3.7)) : exhausted ? .78 : .22;
    const shake = inTimelapse && lt > 12.8 && lt < 15.0 ? shakeXY(t, 8) : [0, 0];
    camBegin(W / 2 + shake[0], H / 2 + shake[1], 1, 0);

    const P = persp({
      x: lerp(-25, 25, ease(lt / 19)),
      y: 118,
      z: lerp(180, 235, ease(seg(lt, 0, 10))),
      f: 1000, hy: 520,
    });
    const anchors = {};
    withLight(SUNNY_LIGHT, () => {
      drawAdventureBg(P, t, { deadTree: true, sunProg, treeX: -280, treeZ: 700 });

      // Portal on the right: blue until 5.5s, then slams into LOCKED stone portal with sign!
      const [px, py, pk] = P.p(235, 92, 680);
      const locked = lt >= 5.5;
      drawPortal(px, py, 108 * pk, 132 * pk, locked ? 'locked' : 'blue', t, 1);

      const st = depthStage(P);
      if (inTimelapse) {
        // Hilarious fast-forward bear chase right across the sunny meadow!
        const chase = seg(lt, 12.0, 15.1);
        const runX = lerp(420, -480, chase);
        stagePal(st, P, t, 'eve', [runX - 110, 0, 560], {
          eyes: 'wide', brows: 'worried', restMouth: 'O', hat: true, flip: true,
          jump: Math.abs(Math.sin(t * 20)) * 1.6, rot: -.2, armL: .95, armR: -.95,
        });
        stagePal(st, P, t, 'zelie', [runX + 10, 0, 575], {
          eyes: 'wide', brows: 'worried', restMouth: 'O', flip: true,
          jump: Math.abs(Math.sin(t * 20 + 1.2)) * 1.6, rot: -.22, armL: .95, armR: -.95,
        });
        st.add(615, () => {
          const [bx, by, bk] = P.p(runX + 215, 0, 615);
          drawCartoonBear(bx, by, bk * .92, t);
          drawSpeedLines(bx + 120, by - 90, bx + 310, by - 90, 5, INK, .65);
        });
        st.flush();
      } else {
        // Pop-out landing (0–1.0s), banter, or exhausted collapse (15.2–19s)!
        const popIn = easeOut(seg(lt, 0, .9));
        const ex = exhausted ? -125 : lerp(180, -95, popIn);
        const ey = (1 - popIn) * 85;
        stagePal(st, P, t, 'eve', [ex, ey, 580], {
          eyes: exhausted ? 'sleepy' : locked ? 'open' : 'wide',
          brows: exhausted ? 'worried' : locked ? 'angry' : 'none',
          restMouth: exhausted ? 'frown' : 'open',
          hat: true, hatRot: exhausted ? -.12 : 0, scuffed: exhausted,
          sq: exhausted ? .12 : 0, bounce: exhausted ? .1 : .45,
          armL: exhausted ? -.25 : .5, armR: exhausted ? .25 : -.5,
        }, a => { anchors.eve = a; });

        stagePal(st, P, t, 'zelie', [exhausted ? 55 : 75, 0, 590], {
          eyes: exhausted ? 'sleepy' : 'happy',
          brows: exhausted ? 'worried' : 'none',
          restMouth: exhausted ? 'frown' : 'grin',
          scuffed: exhausted, sq: exhausted ? .1 : 0,
          bounce: exhausted ? .12 : .55,
          armL: exhausted ? -.2 : .65, armR: exhausted ? .2 : -.45,
        }, a => { anchors.zelie = a; });
        st.flush();
      }
    });
    camEnd();

    if (lt < .45) flash(1 - lt / .45);
    if (lt >= 5.5 && lt <= 6.8) sfx('CLANG!', 1360, 340, 82, '#94A3B8', lt - 5.5);
    if (inTimelapse) {
      captionBanner('10 HOURS LATER...', W / 2, 118, seg(lt, 11.5, 11.9), '#FFF4CC', INK, 46);
      if (lt >= 12.8 && lt <= 14.6) sfx('ROAR!!', 1240, 310, 92, '#D97706', lt - 12.8);
    }
    showBubbles(t, anchors, {
      eve: { dx: -220, dy: -210 },
      zelie: { dx: -40, dy: -245 },
    });
  }

  // ============================================================================
  // SHOT 9 (139–156s): Bursting Out Laughing, Making Up & "Under My Hat" / "bro."
  // ============================================================================
  function shot09_laugh_and_key(t, lt) {
    // 0–2.4: HAHAHA! laughing with tears of joy!
    // 2.4–5.6: Warm apology & plushie hand-bump!
    // 5.6–8.2: "My hat is itchy..." scratching hat
    // 8.2–13.6: Lifts hat off → GOLDEN KEY sitting on head! ("Oh! The key! It was under my hat!")
    // 13.6–17.0: Tight comedic zoom-in on Zelie's wide-eyed deadpan "bro."
    const broZoom = ease(seg(lt, 13.8, 14.4));
    const P = persp({
      x: lerp(0, 72, broZoom),
      y: 114,
      z: lerp(265, 395, broZoom),
      f: 1000, hy: 535,
    });
    const anchors = {};
    withLight(SUNNY_LIGHT, () => {
      drawAdventureBg(P, t, { deadTree: true, sunProg: .82, treeX: -290, treeZ: 720 });
      const st = depthStage(P);
      const laughing = lt < 2.4;
      const apologizing = lt >= 2.4 && lt < 5.6;
      const itchy = lt >= 5.6 && lt < 8.1;
      const reveal = lt >= 8.1;
      const holdKey = lt >= 11.8;

      stagePal(st, P, t, 'eve', [-88, 0, 590], {
        eyes: laughing || apologizing ? 'happy' : reveal && !holdKey ? 'wide' : 'open',
        brows: itchy ? 'worried' : 'none',
        restMouth: laughing ? 'laugh' : reveal && !holdKey ? 'O' : 'smile',
        hat: !reveal,
        hatRot: itchy ? Math.sin(t * 22) * .12 : 0,
        laughTears: laughing,
        scuffed: lt < 6.0,
        bounce: laughing ? .95 : .35,
        armL: itchy ? .95 : holdKey ? .5 : .35,
        armR: apologizing ? -.22 : reveal ? -.95 : -.35,
      }, (a, s) => {
        anchors.eve = a;
        if (reveal && !holdKey && a.top) {
          // Shiny golden key sitting right on top of Eve's head + lifted brown hat in right hand!
          const liftK = easeOut(seg(lt, 8.1, 8.7));
          drawGoldKey(a.top[0] - s * .3, a.top[1] - s * .35, s * .09, -.08, liftK);
          if (a.handR) drawBrownHat(a.handR[0] + s * .8 * liftK, a.handR[1] - s * .8 * liftK, s * .085, .42 * liftK);
        } else if (holdKey && a.handR) {
          drawGoldKey(a.handR[0] + s * .6, a.handR[1] - s * .2, s * .088, -.32, .85);
        }
      });

      stagePal(st, P, t, 'zelie', [90, 0, 590], {
        eyes: laughing || apologizing ? 'happy' : 'open',
        restMouth: laughing ? 'laugh' : 'smile',
        laughTears: laughing,
        deadpan: lt >= 13.6,
        scuffed: lt < 6.0,
        bounce: lt >= 13.6 ? 0 : laughing ? .95 : .4,
        armL: apologizing ? .22 : lt >= 13.6 ? -.12 : .35,
        armR: lt >= 13.6 ? .12 : -.35,
      }, a => { anchors.zelie = a; });
      st.flush();
    });

    if (lt >= .2 && lt <= 2.2) sfx('HAHAHA!', W / 2, 240, 96, '#FFE066', lt - .2);
    if (lt >= 8.2 && lt <= 9.6) sfx('DING!', 820, 275, 80, '#F7C948', lt - 8.2);
    showBubbles(t, anchors, {
      eve: { dx: -305, dy: -235 },
      zelie: { dx: broZoom > .5 ? 255 : 225, dy: broZoom > .5 ? -135 : -195, padX: broZoom > .5 ? 105 : 72, size: lt >= 13.6 ? 54 : 40 },
    });
  }

  // ============================================================================
  // SHOT 10 (156–164s): Turning the Key → Radiant Golden Portal Home!
  // ============================================================================
  function shot10_golden_portal(t, lt) {
    const backHome = lt >= 5.2; // 156–161.2s Adventure World → 161.2–164s Eve's Bedroom!
    const anchors = {};
    if (!backHome) {
      const goldOpen = seg(lt, 1.5, 2.5);
      const dive = easeIn(seg(lt, 3.6, 5.0));
      const P = persp({ x: lerp(40, 85, ease(lt / 5.2)), y: 118, z: lerp(225, 270, ease(lt / 5.2)), f: 1000, hy: 525 });
      withLight(goldOpen > .2 ? WARM_LIGHT : SUNNY_LIGHT, () => {
        drawAdventureBg(P, t, { deadTree: true, sunProg: .85, treeX: -320, treeZ: 740 });
        const [px, py, pk] = P.p(165, 95, 630);
        if (goldOpen > .01) {
          bloom(() => drawPortal(px, py, 128 * pk, 152 * pk, 'gold', t, goldOpen), { radius: 26, strength: .62 });
        } else {
          drawPortal(px, py, 114 * pk, 138 * pk, 'locked', t, 1);
          // Golden key turning in the lock!
          const turnRot = ease(seg(lt, .6, 1.35)) * Math.PI * .5;
          drawGoldKey(px - 22 * pk, py + 18 * pk, pk * 1.15, turnRot, .8);
        }

        const st = depthStage(P);
        const ex = lerp(-65, 165, dive), zx = lerp(-175, 165, dive);
        const sc = 1.95 * (1 - easeIn(seg(lt, 4.3, 5.1)) * .88);
        stagePal(st, P, t, 'eve', [ex, Math.sin(dive * Math.PI) * 95, 595], {
          scale: sc, eyes: 'sparkle', restMouth: 'grin', rot: dive * .85, armL: .8, armR: -.85,
        }, a => { anchors.eve = a; });
        stagePal(st, P, t, 'zelie', [zx, Math.sin(dive * Math.PI) * 95, 610], {
          scale: sc, eyes: 'happy', restMouth: 'laugh', rot: dive * .85, armL: .85, armR: -.8,
        }, a => { anchors.zelie = a; });
        st.flush();
        if (dive > .1) drawSpeedLines(px - 360, py, px - 60, py, 5, '#F59E0B', .85);
      });
      if (lt >= .8 && lt <= 1.8) sfx('TURN!', 1220, 340, 82, '#F7C948', lt - .8);
      if (lt >= 4.6) flash(seg(lt, 4.6, 5.18));
      showBubbles(t, anchors, { eve: { dx: -210, dy: -195 } });
      return;
    }

    // 161.2–164s: Tumble out safely onto Eve's bedroom floor ("Home!")
    const homeT = lt - 5.2;
    const P = persp({ x: 0, y: 118, z: lerp(225, 250, ease(homeT / 2.8)), f: 1000, hy: 540 });
    withLight(WARM_LIGHT, () => {
      drawBedroomBg(P, t, { day: 1, showBed: false });
      const [px, py, pk] = P.p(175, 95, 650);
      bloom(() => drawPortal(px, py, 108 * pk, 130 * pk, 'gold', t, 1 - seg(homeT, 1.8, 2.8) * .4), { radius: 20, strength: .45 });
      const land = easeOut(seg(homeT, 0, .8));
      const st = depthStage(P);
      stagePal(st, P, t, 'eve', [lerp(140, -90, land), (1 - land) * 75, 595], {
        eyes: 'happy', restMouth: 'grin', bounce: .65, armL: .8, armR: -.8,
      }, a => { anchors.eve = a; });
      stagePal(st, P, t, 'zelie', [lerp(150, 55, land), (1 - land) * 65, 605], {
        eyes: 'sparkle', restMouth: 'laugh', bounce: .75, armL: .8, armR: -.8,
      }, a => { anchors.zelie = a; });
      st.flush();
    });
    if (homeT < .4) flash(1 - homeT / .4);
    if (homeT >= .2 && homeT <= 1.4) sfx('GASP!', 880, 300, 78, '#FFE066', homeT - .2);
    showBubbles(t, anchors, { zelie: { dx: 195, dy: -190 } });
  }

  // ============================================================================
  // SHOT 11 (164–174s): Busted! Time Out & Best Friends on the Sunny Lawn
  // ============================================================================
  function shot11_timeout_and_friends(t, lt) {
    const inYard = lt >= 3.5; // 164–167.5s Busted in bedroom; 167.5–174s Sunny yard Time Out!
    const anchors = {};
    if (!inYard) {
      const P = persp({ x: 0, y: 122, z: lerp(185, 225, ease(lt / 3.5)), f: 1000, hy: 540 });
      withLight(WARM_LIGHT, () => {
        drawBedroomBg(P, t, { day: 1, showBed: false });
        const [px, py, pk] = P.p(0, 102, 710);
        drawPortal(px, py, 95 * pk, 115 * pk, 'gold', t, Math.max(.1, 1 - lt / 3.5));

        const st = depthStage(P);
        // Stern mustachioed Dads towering in back!
        stagePal(st, P, t, 'eve_dad', [-118, 0, 620], {
          eyes: 'open', brows: 'angry', restMouth: 'flat', bounce: .1, armL: -.18, armR: .18,
        }, a => { anchors.eve_dad = a; });
        stagePal(st, P, t, 'zelie_papa', [118, 0, 620], {
          eyes: 'open', brows: 'angry', restMouth: 'flat', bounce: .1, armL: -.18, armR: .18,
        }, a => { anchors.zelie_papa = a; });
        // Drooping guilty kids in front!
        stagePal(st, P, t, 'eve', [-82, 0, 515], {
          eyes: 'sleepy', brows: 'worried', restMouth: 'frown', sq: .08, armL: -.35, armR: .35,
        }, a => { anchors.eve = a; });
        stagePal(st, P, t, 'zelie', [82, 0, 515], {
          eyes: 'sleepy', brows: 'worried', restMouth: 'frown', sq: .08, armL: -.35, armR: .35,
        }, a => { anchors.zelie = a; });
        st.flush();
      });
      showBubbles(t, anchors, {
        eve_dad: { dx: -180, dy: -200, size: 46 },
        eve: { dx: -210, dy: -165 },
      });
      return;
    }

    // 167.5–174s: Sunny Yard Time Out → 1 HOUR LATER best friends giggling while Dads peek over hedge!
    const yt = lt - 3.5; // 0..6.5s
    const hourLater = yt >= 2.1;
    const P = persp({ x: lerp(-18, 22, ease(yt / 6.5)), y: 118, z: lerp(180, 210, ease(yt / 6.5)), f: 1000, hy: 525 });
    withLight(SUNNY_LIGHT, () => {
      drawYardBg(P, t);
      const st = depthStage(P);
      // Both Dads peeking warmly over the garden hedge on the right once "1 HOUR LATER" kicks in!
      if (hourLater) {
        const peek = easeOut(seg(yt, 2.1, 2.7));
        stagePal(st, P, t, 'zelie_papa', [155, lerp(-10, 42, peek), 710], {
          eyes: 'happy', restMouth: 'smile', lookX: -.65, noFeet: true, noShadow: true, bounce: .2,
        }, a => { anchors.zelie_papa = a; });
        stagePal(st, P, t, 'eve_dad', [285, lerp(-10, 46, peek), 710], {
          eyes: 'happy', restMouth: 'grin', lookX: -.75, noFeet: true, noShadow: true, bounce: .2,
        }, a => { anchors.eve_dad = a; });
        // Low cozy garden hedge in front of Dads' bellies so both smiling faces & squiggly mustaches show clearly!
        st.add(660, () => P.billboard(225, 0, 660, () => {
          shape([[-155, 0], [-158, -32], [-115, -58], [-55, -54], [0, -64], [58, -54], [118, -58], [158, -32], [155, 0]],
            { fill: '#4BA34B', stroke: INK, lwPx: 4, smooth: .52 });
          ellipse(-52, -38, 36, 14, { fill: 'rgba(138,220,126,.45)', stroke: null });
          ellipse(48, -36, 38, 14, { fill: 'rgba(138,220,126,.45)', stroke: null });
        }));
      }

      // Eve & Zelie sitting together on the sunny grass, giggling like best friends!
      stagePal(st, P, t, 'eve', [-135, 0, 560], {
        eyes: 'happy', restMouth: hourLater ? 'laugh' : 'grin',
        lookX: .55, bounce: hourLater ? .75 : .35, sway: .4,
        emote: hourLater ? 'heart' : undefined, emoteK: hourLater ? 1 : 0,
        armL: .45, armR: -.55,
      }, a => { anchors.eve = a; });
      stagePal(st, P, t, 'zelie', [-12, 0, 565], {
        eyes: 'happy', restMouth: hourLater ? 'laugh' : 'grin',
        lookX: -.55, bounce: hourLater ? .8 : .45, giggle: hourLater ? .85 : .2,
        armL: .55, armR: -.45,
      }, a => { anchors.zelie = a; });
      st.flush();
    });

    captionBanner(hourLater ? '1 HOUR LATER' : 'TIME OUT', 265, 105, 1, '#FFF5D6', INK, 38);
    if (hourLater && yt < 4.5) sfx('HA HA HA!', 660, 420, 64, '#FFE066', yt - 2.1);
    showBubbles(t, anchors, {
      zelie: { dx: 185, dy: -190 },
      zelie_papa: { dx: -210, dy: -200 },
      eve_dad: { dx: -170, dy: -210 },
    });
  }

  // ============================================================================
  // SHOT 12 (174–180s): "The End" → "...or is it?" → "JUST KIDDING!" Rainbow Finale
  // ============================================================================
  function shot12_epilogue(t, lt) {
    // 0–1.6s: Cozy storybook "The End" card
    if (lt < 1.6) {
      X.fillStyle = linGrad(0, 0, 0, H, [[0, '#FFF6E8'], [1, '#F6E2C8']]);
      X.fillRect(0, 0, W, H);
      shape(rectPts(90, 80, W - 180, H - 160), { fill: null, stroke: '#D9A773', lwPx: 8, smooth: .06 });
      const k = backOut(seg(lt, 0, .55));
      X.save();
      X.translate(W / 2, H / 2);
      X.scale(.8 + .2 * k, .8 + .2 * k);
      drawText('The End', 0, 0, 148, '#5C3A52', '#FFFDF7', 16, FONT_SFX);
      X.restore();
      return;
    }

    // 1.6–3.2s: Sudden shadowy cliffhanger — glowing crimson eyes & wicked grin!
    if (lt < 3.2) {
      const dt = lt - 1.6;
      X.fillStyle = '#120C1A';
      X.fillRect(0, 0, W, H);
      bloom(() => {
        // Glowing crimson angry eyes peering from the dark
        shape([[W * .5 - 155, H * .40], [W * .5 - 48, H * .44], [W * .5 - 120, H * .49]], { fill: '#EF233C', stroke: null });
        shape([[W * .5 + 155, H * .40], [W * .5 + 48, H * .44], [W * .5 + 120, H * .49]], { fill: '#EF233C', stroke: null });
        // Wicked toothy grin arc
        line([[W * .5 - 140, H * .58], [W * .5, H * .65], [W * .5 + 140, H * .58]], { stroke: '#FF4D6D', lwPx: 11, smooth: true });
      }, { radius: 26, strength: .75 });
      drawText('...or is it?', W / 2, H * .78, 72, '#FFE5EC', '#2B0A18', 10);
      if (dt < .18) flash(.45 * (1 - dt / .18));
      return;
    }

    // 3.2–6.0s: Playful rainbow-heart epilogue splash (faithful to Jenna's Drawing 2!)
    const et = lt - 3.2;
    const pop = backOut(seg(et, 0, .45));
    X.fillStyle = linGrad(0, 0, 0, H, [[0, '#FFF8EE'], [.55, '#FFF0F7'], [1, '#E8F7FF']]);
    X.fillRect(0, 0, W, H);
    // Floating confetti stars
    for (let i = 0; i < 16; i++) {
      const sx = 90 + hash(i * 6.1) * (W - 180);
      const sy = 90 + hash(i * 8.3) * (H - 180) + Math.sin(t * 4 + i) * 14;
      shape(starPts(sx, sy, 14 + (i % 3) * 7, .38, 4), { fill: PLP.sprinkles[i % PLP.sprinkles.length], stroke: INK, lwPx: 1.8 });
    }
    bloom(() => drawRainbowHeart(W * .5, H * .40, 128 * (.8 + .2 * pop), t), { radius: 22, strength: .42 });

    const anchors = {};
    withLight(WARM_LIGHT, () => {
      anchors.eve = eveEarth(W * .35, H * .82, 34 * (.85 + .15 * pop), {
        t, eyes: 'happy', mouth: mouthFor(t, 'eve', 'grin'),
        bounce: .65, sway: .3, armL: .65, armR: -.55,
      });
      anchors.zelie = zelieLemonade(W * .65, H * .83, 31 * (.85 + .15 * pop), {
        t, eyes: 'happy', mouth: mouthFor(t, 'zelie', 'grin'),
        bounce: .7, giggle: .6, armL: .55, armR: -.65,
      });
    });

    drawText("JUST KIDDING — IT'S THE END SO... THE END!", W / 2, 118, 56, '#D93B6A', '#FFFDF7', 14, FONT_SFX);
    drawText('Eve Earth & Zelie  ·  By Jenna Safadi  ·  جنى صفدي', W / 2, H - 62, 36, '#3B5C8A', '#FFFDF7', 10);
    if (et < .25) flash(.6 * (1 - et / .25));
    showBubbles(t, anchors, {
      eve: { dx: -200, dy: -165, size: 48 },
      zelie: { dx: 205, dy: -165, size: 48 },
    });
  }

  scene({
    duration: 180,
    fps: 24,
    bpm: 112,
    shots: [
      [0, shot01_title_and_bios],
      [15, shot02_wakeup],
      [30, shot03_pancakes_and_doorbell],
      [47, shot04_sneak_pancake],
      [65, shot05_meet_enemy],
      [82, shot06_showdown_and_breakfast],
      [101, shot07_blue_portal],
      [120, shot08_adventure_world],
      [139, shot09_laugh_and_key],
      [156, shot10_golden_portal],
      [164, shot11_timeout_and_friends],
      [174, shot12_epilogue],
    ],
  });
})();
