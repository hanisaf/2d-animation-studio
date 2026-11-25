// comics/palm_pals_adventures/the_adventure/comic.js
// 8-page Studio Edition comic book adaptation of Jenna Safadi's "The Adventure"
// starring Eve Earth & Zelie Pink Lemonade (Palm Pals Adventures #1).
// Clean visual art (`draw`) vs declarative `lettering` separation for per-panel Gemini mode.

(() => {
  const INK = COMIC_INK;

  // ---------- Reusable Props & Visual Gag Helpers ----------

  function drawSpeedLines(x0, y0, x1, y1, count = 4, col = INK) {
    const dx = x1 - x0, dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    for (let i = 0; i < count; i++) {
      const off = (i - (count - 1) / 2) * 18;
      const trim = (i % 2) * 0.14;
      line([
        [x0 + nx * off + dx * trim, y0 + ny * off + dy * trim],
        [x1 + nx * off - dx * trim * 0.5, y1 + ny * off - dy * trim * 0.5],
      ], { stroke: col, lwPx: 3.2 - (i % 2) * 0.8 });
    }
  }

  function drawAngryCloud(x, y, s = 1) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);
    ellipse(0, 0, 38, 18, { fill: 'rgba(42, 32, 46, 0.22)', stroke: null });
    X.strokeStyle = '#2B1F2E';
    X.lineWidth = 4.2;
    X.lineCap = 'round';
    X.lineJoin = 'round';
    X.beginPath();
    X.moveTo(-34, 6);
    const pts = [
      [-18, -10], [28, -8], [-26, 0], [32, -2], [-20, 8], [26, 6], [-12, -14], [18, -12], [-6, 10],
    ];
    for (const [px, py] of pts) X.lineTo(px, py);
    X.stroke();
    X.restore();
  }

  function drawBrownHat(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    const crown = [
      [-34, 4], [-28, -32], [-14, -44], [0, -47], [14, -44], [28, -32], [34, 4],
    ];
    X.save();
    tracePath(crown, true, 0.45);
    X.fillStyle = linGrad(-20, -45, 22, 5, [[0, '#B8845A'], [0.5, '#9A6740'], [1, '#774B2C']]);
    X.fill();
    X.clip();
    for (let gx = -26; gx <= 26; gx += 13) {
      line([[gx, -48], [gx, 8]], { stroke: '#5B3720', lwPx: 2.6 });
    }
    for (let gy = -34; gy <= 0; gy += 12) {
      line([[-38, gy], [38, gy]], { stroke: '#5B3720', lwPx: 2.6 });
    }
    X.restore();
    shape(crown, { fill: null, stroke: INK, lwPx: 3.4, smooth: 0.45 });
    // Hat band
    shape(rectPts(-34, -8, 68, 10), { fill: '#5C3822', stroke: INK, lwPx: 2.6 });
    // Wide stitched brim
    ellipse(0, 6, 52, 13, { fill: '#A8744B', stroke: INK, lwPx: 3.4 });
    line([[-38, 6], [-14, 11], [14, 11], [38, 6]], { stroke: '#6E4528', lwPx: 2.2, smooth: true });
    X.restore();
  }

  function drawGoldKey(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    // Shaft & teeth
    shape(rectPts(8, -5, 44, 10), { fill: '#F7C948', stroke: INK, lwPx: 3 });
    shape(rectPts(32, 4, 8, 12), { fill: '#F7C948', stroke: INK, lwPx: 2.8 });
    shape(rectPts(43, 4, 8, 16), { fill: '#F7C948', stroke: INK, lwPx: 2.8 });
    // Bow ring
    circle(-4, 0, 15, { fill: '#FFE066', stroke: INK, lwPx: 3.2 });
    circle(-4, 0, 6.5, { fill: '#FFFDF7', stroke: INK, lwPx: 2.6 });
    // Shine dot
    circle(-9, -6, 2.5, { fill: '#FFFFFF', stroke: null });
    X.restore();
  }

  function drawPancake(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    ellipse(0, 5, 36, 20, { fill: '#C87D36', stroke: INK, lwPx: 3 });
    ellipse(0, 0, 35, 19, { fill: '#E8A552', stroke: INK, lwPx: 3 });
    ellipse(-5, -3, 24, 11, { fill: '#F4C174', stroke: null });
    // Melting yellow butter pat on top
    shape([[-9, -9], [9, -9], [11, -1], [-7, -1]], { fill: '#FFF08A', stroke: INK, lwPx: 2 });
    X.restore();
  }

  // Warm floppy pancake partially draping/flopping downward over a hand
  function drawFloppyPancake(x, y, s = 1) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);
    // Underside toasted rim where it flops down
    shape([
      [-34, 24], [-30, 4], [-14, -12], [12, -13], [32, -3], [28, 10],
      [10, 12], [-8, 10], [-18, 28], [-28, 30],
    ], { fill: '#C87D36', stroke: INK, lwPx: 3, smooth: 0.48 });
    // Soft golden top surface folded over the hand
    shape([
      [-32, 20], [-28, 1], [-13, -14], [12, -15], [31, -5], [26, 6],
      [8, 7], [-10, 5], [-19, 23], [-27, 25],
    ], { fill: '#E8A552', stroke: INK, lwPx: 2.8, smooth: 0.48 });
    // Highlight on upper curve & fold crease
    ellipse(4, -7, 16, 5.5, { fill: '#F4C174', stroke: null, rot: 0.08 });
    line([[-12, -1], [-18, 10]], { stroke: '#B66C29', lwPx: 2.4, smooth: true });
    X.restore();
  }

  // Bitten golden pancake piece sticking out of a mouth (with scalloped bite mark)
  function drawBittenPancake(x, y, s = 1, rot = 0) {
    X.save();
    X.translate(x, y);
    X.rotate(rot);
    X.scale(s, s);
    const pts = [
      [-18, -10], [4, -14], [24, -8], [28, 2], [20, 12], [0, 14],
      [-14, 10], [-10, 4], [-16, 0], [-11, -5],
    ];
    shape(pts, { fill: '#C87D36', stroke: INK, lwPx: 2.8, smooth: 0.35 });
    X.translate(0, -3);
    shape(pts, { fill: '#E8A552', stroke: INK, lwPx: 2.6, smooth: 0.35 });
    ellipse(6, -2, 12, 5.5, { fill: '#F4C174', stroke: null });
    X.restore();
  }

  function drawSkillet(x, y, s = 1, hasPancake = true, sizzle = true) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);
    // Handle
    shape(rectPts(-62, -6, 36, 11), { fill: '#4A4652', stroke: INK, lwPx: 3 });
    // Pan body
    ellipse(0, 4, 34, 13, { fill: '#35323D', stroke: INK, lwPx: 3 });
    ellipse(0, 0, 32, 11, { fill: '#575363', stroke: INK, lwPx: 2.5 });
    if (hasPancake) {
      ellipse(0, -1, 22, 7.5, { fill: '#E8A552', stroke: INK, lwPx: 2.2 });
      ellipse(-3, -2, 13, 4, { fill: '#F5C67E', stroke: null });
    }
    if (sizzle) {
      for (const sx of [-14, 0, 14]) {
        line([[sx, -14], [sx - 4, -24], [sx + 3, -34]], { stroke: 'rgba(130, 120, 135, 0.7)', lwPx: 2.4, smooth: true });
      }
    }
    X.restore();
  }

  function drawPortal(x, y, rx, ry, variant = 'blue') {
    X.save();
    X.translate(x, y);
    if (variant === 'locked') {
      // Dormant stone/dark portal ring with lock plaque
      ellipse(0, 0, rx, ry, { fill: '#4A5568', stroke: INK, lwPx: 5 });
      ellipse(0, 0, rx * 0.84, ry * 0.84, { fill: '#2D3748', stroke: INK, lwPx: 3.5 });
      // Subtle swirl lines inside dormant ring
      for (let i = 0; i < 3; i++) {
        ellipse(0, 0, rx * (0.64 - i * 0.16), ry * (0.64 - i * 0.16), { fill: null, stroke: 'rgba(160, 195, 230, 0.28)', lwPx: 3 });
      }
      // Wooden plaque nailed to portal
      shape(rectPts(-rx * 0.66, -ry * 0.34, rx * 1.32, ry * 0.66), { fill: '#F6E7C8', stroke: INK, lwPx: 4 });
      // Golden keyhole in bottom center of plaque
      circle(0, ry * 0.14, 11, { fill: '#F7C948', stroke: INK, lwPx: 2.8 });
      circle(0, ry * 0.12, 4, { fill: '#2D222B', stroke: null });
      shape([[-2.5, ry * 0.14], [2.5, ry * 0.14], [4, ry * 0.24], [-4, ry * 0.24]], { fill: '#2D222B', stroke: null });
      // Small diegetic sign text (part of the comic prop itself)
      X.fillStyle = INK;
      X.font = `700 ${Math.round(rx * 0.16)}px ${FONT_COMIC}`;
      X.textAlign = 'center';
      X.textBaseline = 'middle';
      X.fillText('FIND THE KEY', 0, -ry * 0.16);
      X.fillText('TO OPEN PORTAL', 0, -ry * 0.01);
      X.restore();
      return;
    }

    const isGold = variant === 'gold';
    const outer = isGold ? '#F59E0B' : '#1D4ED8';
    const mid = isGold ? '#FCD34D' : '#3B82F6';
    const core = isGold ? '#FEF9C3' : '#BFDBFE';
    const glow = isGold ? 'rgba(252, 211, 77, 0.38)' : 'rgba(59, 130, 246, 0.34)';

    ellipse(0, 0, rx * 1.18, ry * 1.16, { fill: glow, stroke: null });
    ellipse(0, 0, rx, ry, { fill: outer, stroke: INK, lwPx: 4.5 });
    ellipse(0, 0, rx * 0.78, ry * 0.78, { fill: mid, stroke: null });
    ellipse(0, 0, rx * 0.5, ry * 0.5, { fill: core, stroke: null });

    // Spiraling vortex arcs
    X.strokeStyle = isGold ? '#FFFBEB' : '#E0F2FE';
    X.lineWidth = 4;
    X.lineCap = 'round';
    for (let k = 0; k < 4; k++) {
      X.beginPath();
      const a0 = k * (Math.PI / 2) + 0.3;
      for (let step = 0; step <= 24; step++) {
        const u = step / 24;
        const ang = a0 + u * 3.6;
        const rFrac = 0.18 + u * 0.74;
        const px = Math.cos(ang) * rx * rFrac;
        const py = Math.sin(ang) * ry * rFrac;
        if (step === 0) X.moveTo(px, py);
        else X.lineTo(px, py);
      }
      X.stroke();
    }
    // Sparkles around rim
    for (let i = 0; i < 6; i++) {
      const a = i * (TAU / 6) + 0.4;
      const sx = Math.cos(a) * rx * 1.06;
      const sy = Math.sin(a) * ry * 1.04;
      shape(starPts(sx, sy, 9, 0.35, 4), { fill: '#FFFDF5', stroke: INK, lwPx: 1.6 });
    }
    X.restore();
  }

  function drawRainbowHeart(x, y, r = 46) {
    const drawHeartPath = (scale) => {
      const rr = r * scale;
      X.beginPath();
      X.moveTo(0, rr * 0.85);
      X.bezierCurveTo(-rr * 1.2, rr * 0.16, -rr * 1.12, -rr * 0.82, -rr * 0.48, -rr * 0.82);
      X.bezierCurveTo(-rr * 0.14, -rr * 0.82, 0, -rr * 0.42, 0, -rr * 0.32);
      X.bezierCurveTo(0, -rr * 0.42, rr * 0.14, -rr * 0.82, rr * 0.48, -rr * 0.82);
      X.bezierCurveTo(rr * 1.12, -rr * 0.82, rr * 1.2, rr * 0.16, 0, rr * 0.85);
      X.closePath();
    };
    X.save();
    X.translate(x, y);
    const cols = ['#FF6B9A', '#FFB347', '#FFE066', '#6EC86B', '#68BCEB', '#B388EB'];
    cols.forEach((col, i) => {
      drawHeartPath(1 - i * 0.13);
      X.fillStyle = col;
      X.fill();
      if (i === 0) {
        X.strokeStyle = INK;
        X.lineWidth = 4.5;
        X.lineJoin = 'round';
        X.stroke();
      }
    });
    circle(-r * 0.36, -r * 0.34, r * 0.13, { fill: 'rgba(255,255,255,0.75)', stroke: null });
    X.restore();
  }

  // ---------- Character Helpers (Canonical Palm Pals + Story Accessories & Dads) ----------

  function drawScuffs(x, y, s) {
    // Cute dusty adventure scuffs & tiny bandage for "10 hours later"
    for (const [dx, dy, ang] of [[-2.3, -5.2, -0.3], [2.4, -4.6, 0.25], [-1.2, -1.6, 0.15]]) {
      X.save();
      X.translate(x + dx * s, y + dy * s);
      X.rotate(ang);
      line([[-s * 0.45, -s * 0.18], [s * 0.45, -s * 0.18]], { stroke: '#7D5B47', lwPx: 2.2 });
      line([[-s * 0.35, s * 0.12], [s * 0.35, s * 0.12]], { stroke: '#7D5B47', lwPx: 2.0 });
      X.restore();
    }
    // Tiny cute bandage on forehead
    X.save();
    X.translate(x + s * 1.5, y - s * 5.8);
    X.rotate(-0.22);
    shape(rectPts(-s * 0.9, -s * 0.36, s * 1.8, s * 0.72), { fill: '#FCE2C4', stroke: INK, lwPx: 2 });
    shape(rectPts(-s * 0.3, -s * 0.34, s * 0.6, s * 0.68), { fill: '#FFF5EA', stroke: null });
    X.restore();
  }

  function drawLaughTears(x, y, s) {
    for (const sd of [-1, 1]) {
      ellipse(x + sd * s * 3.1, y - s * 3.9, s * 0.55, s * 0.28, {
        fill: '#78D5FF', stroke: INK, lwPx: 1.8, rot: sd * 0.35,
      });
      ellipse(x + sd * s * 4.3, y - s * 3.2, s * 0.36, s * 0.2, {
        fill: '#78D5FF', stroke: INK, lwPx: 1.5, rot: sd * 0.5,
      });
    }
  }

  function drawEve(x, y, s, opts = {}) {
    const air = (opts.jump || 0) * s;
    const drawY = y - s * 0.42;
    const rigY = opts.noFeet ? drawY : drawY + s * 0.62;
    if (!opts.noShadow) {
      ellipse(x, y + s * 0.65, s * 4.1, s * 0.82, { fill: 'rgba(42, 24, 38, 0.2)', stroke: null });
    }
    const A = eveEarth(x, rigY, s, { boil: 0, noShadow: true, ...opts });

    // Optional heart eyes (for pancake bliss!)
    if (opts.heartEyes) {
      for (const sd of [-1, 1]) {
        const hx = x + sd * s * 1.4;
        const hy = drawY - air - s * 3.7;
        const r = s * 0.92;
        X.save();
        X.translate(hx, hy);
        X.beginPath();
        X.moveTo(0, r * 0.8);
        X.bezierCurveTo(-r * 1.15, r * 0.15, -r * 1.05, -r * 0.78, -r * 0.45, -r * 0.78);
        X.bezierCurveTo(-r * 0.12, -r * 0.78, 0, -r * 0.38, 0, -r * 0.28);
        X.bezierCurveTo(0, -r * 0.38, r * 0.12, -r * 0.78, r * 0.45, -r * 0.78);
        X.bezierCurveTo(r * 1.05, -r * 0.78, r * 1.15, r * 0.15, 0, r * 0.8);
        X.closePath();
        X.fillStyle = '#FF5C93';
        X.fill();
        X.strokeStyle = INK;
        X.lineWidth = Math.max(2, s * 0.12);
        X.stroke();
        X.restore();
      }
    }
    if (opts.scuffed) drawScuffs(x, drawY - air, s);
    if (opts.laughTears) drawLaughTears(x, drawY - air, s);
    if (opts.angryCloud) drawAngryCloud(x, drawY - air - s * 10.7, s / 16);

    // Optional brown plaid explorer hat
    if (opts.hat) {
      drawBrownHat(x, drawY - air - s * 7.55, s * 0.088, opts.hatRot || 0);
    }
    // Optional lifted hat revealing golden key on Eve's head!
    if (opts.keyOnHead) {
      drawGoldKey(x - s * 0.9, drawY - air - s * 8.95, s * 0.085, -0.06);
      drawBrownHat(x + s * 5.2, drawY - air - s * 2.2, s * 0.082, 0.45);
    }
    if (opts.holdPancake) {
      drawPancake(x + s * 4.8 * (opts.flip ? -1 : 1), drawY - air - s * 3.8, s * 0.055, -0.15);
    }
    if (opts.holdKey) {
      drawGoldKey(x + s * 4.8, drawY - air - s * 3.6, s * 0.075, -0.3);
    }
    return A;
  }

  function drawZelie(x, y, s, opts = {}) {
    const air = (opts.jump || 0) * s;
    const drawY = y - s * 0.42;
    const rigY = opts.noFeet ? drawY : drawY + s * 0.62;
    if (!opts.noShadow) {
      ellipse(x, y + s * 0.65, s * 3.6, s * 0.78, { fill: 'rgba(42, 24, 38, 0.2)', stroke: null });
    }
    const A = zelieLemonade(x, rigY, s, { boil: 0, noShadow: true, ...opts });

    // Optional wide-eyed deadpan "bro." expression overlay
    if (opts.deadpan) {
      const cy = drawY - air - s * 3.85;
      for (const sd of [-1, 1]) {
        const ex = x + sd * s * 1.42;
        circle(ex, cy, s * 0.92, { fill: '#FFFDF8', stroke: INK, lwPx: clamp(s * 0.14, 2, 4) });
        circle(ex, cy, s * 0.28, { fill: INK, stroke: null });
      }
      // Flat tiny deadpan mouth over pink cup
      shape(rectPts(x - s * 1.1, cy + s * 0.45, s * 2.2, s * 0.9), { fill: PLP.zelieCup, stroke: null });
      line([[x - s * 0.65, cy + s * 0.85], [x + s * 0.65, cy + s * 0.85]], { stroke: INK, lwPx: clamp(s * 0.15, 2.2, 4) });
    }

    if (opts.scuffed) drawScuffs(x, drawY - air, s);
    if (opts.laughTears) drawLaughTears(x, drawY - air, s);
    if (opts.angryCloud) drawAngryCloud(x, drawY - air - s * 13.0, s / 16);
    return A;
  }

  // Eve's Dad — canonical promoted Palm Pals parent rig (`eveDad`) + optional spatula
  function drawEveDad(x, y, s, opts = {}) {
    const drawY = y - s * 0.45;
    const rigY = opts.noFeet ? drawY : drawY + s * 0.64;
    const flip = opts.flip ? -1 : 1;

    if (!opts.noShadow) {
      ellipse(x, y + s * 0.72, s * 4.5, s * 0.88, { fill: 'rgba(42, 24, 38, 0.22)', stroke: null });
    }
    const A = eveDad(x, rigY, s, { boil: 0, noShadow: true, blink: false, ...opts });

    // Optional spatula in hand
    if (opts.spatula) {
      X.save();
      X.translate(x + s * 4.8 * flip, drawY - s * 4.2);
      X.rotate(-0.35 * flip);
      shape(rectPts(-3, -24, 6, 26), { fill: '#6D5854', stroke: INK, lwPx: 2.2 });
      shape(rectPts(-11, -38, 22, 16), { fill: '#B8C2CC', stroke: INK, lwPx: 2.4 });
      line([[-5, -34], [-5, -26]], { stroke: INK, lwPx: 1.6 });
      line([[5, -34], [5, -26]], { stroke: INK, lwPx: 1.6 });
      X.restore();
    }
    return A;
  }

  // Zelie's Papa — canonical promoted Palm Pals parent rig (`zeliePapa`)
  function drawZeliePapa(x, y, s, opts = {}) {
    const drawY = y - s * 0.45;
    const rigY = opts.noFeet ? drawY : drawY + s * 0.64;

    if (!opts.noShadow) {
      ellipse(x, y + s * 0.72, s * 3.9, s * 0.85, { fill: 'rgba(42, 24, 38, 0.22)', stroke: null });
    }
    return zeliePapa(x, rigY, s, { boil: 0, noShadow: true, blink: false, ...opts });
  }

  // ---------- Background Painters ----------

  function drawBedroomBg(pw, ph, opts = {}) {
    const floorY = ph * 0.76;
    // Warm terracotta/peach wall matching Jenna's Row 1!
    X.fillStyle = linGrad(0, 0, 0, floorY, [[0, '#F4C4A0'], [1, '#E9AC82']]);
    X.fillRect(0, 0, pw, floorY);

    // Bedroom window: starry night sky with moon (default) OR bright morning sky with sun (opts.day)
    const wx = pw * 0.54, wy = ph * 0.12, ww = pw * 0.34, wh = ph * 0.28;
    if (opts.day) {
      const daySky = linGrad(wx, wy, wx, wy + wh, [[0, '#72C4F2'], [0.65, '#A9DFFA'], [1, '#DDF4FF']]);
      X.fillStyle = daySky;
      X.fillRect(wx, wy, ww, wh);
      // Warm golden morning sun with rays (upper-right by default, or upper-left if opts.sunLeft)
      const sx = wx + ww * (opts.sunLeft ? 0.26 : 0.74), sy = wy + wh * 0.28, sr = Math.min(ww, wh) * 0.14;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        line([
          [sx + Math.cos(a) * (sr * 1.25), sy + Math.sin(a) * (sr * 1.25)],
          [sx + Math.cos(a) * (sr * 1.85), sy + Math.sin(a) * (sr * 1.85)],
        ], { stroke: '#FFE26A', lwPx: 3.5 });
      }
      circle(sx, sy, sr, { fill: '#FFE259', stroke: '#F0B429', lwPx: 2 });
      // Soft puffy morning cloud in opposite lower pane
      const clX = opts.sunLeft ? 0.74 : 0.28;
      ellipse(wx + ww * clX, wy + wh * 0.72, ww * 0.16, wh * 0.08, { fill: 'rgba(255,255,255,0.9)', stroke: null });
      ellipse(wx + ww * (clX - 0.08), wy + wh * 0.75, ww * 0.11, wh * 0.06, { fill: 'rgba(255,255,255,0.9)', stroke: null });
    } else {
      const nightSky = linGrad(wx, wy, wx, wy + wh, [[0, '#1C396B'], [1, '#2D5A9E']]);
      X.fillStyle = nightSky;
      X.fillRect(wx, wy, ww, wh);
      // Tiny twinkling night stars
      for (const [fx, fy] of [[0.72, 0.22], [0.84, 0.36], [0.66, 0.72], [0.22, 0.76], [0.80, 0.80]]) {
        circle(wx + ww * fx, wy + wh * fy, 2.2, { fill: '#FFF9D6', stroke: null });
      }
      // Glowing night moon
      circle(wx + ww * 0.28, wy + wh * 0.28, Math.min(ww, wh) * 0.13, { fill: '#FFF0A6', stroke: null });
    }
    line([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], { stroke: '#FFF7EB', lwPx: 6 });
    line([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], { stroke: '#FFF7EB', lwPx: 6 });
    shape(rectPts(wx, wy, ww, wh), { fill: null, stroke: INK, lwPx: 4 });

    // Cute wavy wall poster on left
    const px = pw * 0.1, py = ph * 0.14, pW = pw * 0.26, pH = ph * 0.24;
    shape(rectPts(px, py, pW, pH), { fill: '#F7C2D4', stroke: INK, lwPx: 3.5 });
    shape([
      [px + pW * 0.3, py], [px + pW * 0.72, py], [px + pW * 0.58, py + pH * 0.5],
      [px + pW * 0.74, py + pH], [px + pW * 0.26, py + pH], [px + pW * 0.42, py + pH * 0.5],
    ], { fill: '#5DA6DE', stroke: INK, lwPx: 2.5, smooth: 0.4 });

    // Wooden floor
    X.fillStyle = '#D5A272';
    X.fillRect(0, floorY, pw, ph - floorY);
    line([[0, floorY], [pw, floorY]], { stroke: INK, lwPx: 3.5 });
    for (let i = 1; i <= 3; i++) {
      line([[0, floorY + i * 38], [pw, floorY + i * 38]], { stroke: 'rgba(110, 68, 34, 0.2)', lwPx: 2 });
    }

    // Optional nightstand with lamp & mug on left
    if (opts.nightstand) {
      const nx = pw * 0.06, ny = floorY - 82, nw = 84, nh = 88;
      shape(rectPts(nx, ny, nw, nh), { fill: '#E3B279', stroke: INK, lwPx: 3.5 });
      line([[nx + 8, ny + 34], [nx + nw - 8, ny + 34]], { stroke: INK, lwPx: 2.5 });
      circle(nx + nw / 2, ny + 18, 4.5, { fill: '#FFF08A', stroke: INK, lwPx: 2 });
      // Tiny bedside lamp
      shape(rectPts(nx + 44, ny - 26, 8, 26), { fill: '#946B49', stroke: INK, lwPx: 2.2 });
      shape([[nx + 30, ny - 24], [nx + 66, ny - 24], [nx + 58, ny - 48], [nx + 38, ny - 48]], { fill: '#FFE27A', stroke: INK, lwPx: 2.6 });
      // Tiny blue mug
      shape(rectPts(nx + 12, ny - 20, 18, 20), { fill: '#8CCDF0', stroke: INK, lwPx: 2.2 });
    }
  }

  function drawEarthBed(x, y, w, h) {
    // Cozy Earth-themed bed with smiling face on footboard (faithful to Jenna's Row 1!)
    // White pillow at right
    shape(rectPts(x + w * 0.66, y - h * 0.36, w * 0.28, h * 0.42), { fill: '#FFFDF8', stroke: INK, lwPx: 3.5 });
    // Mattress & Earth blanket
    shape(rectPts(x, y, w, h), { fill: '#7AC3EB', stroke: INK, lwPx: 4 });
    // Green continent patches on blanket corners
    shape([[x + 3, y + 3], [x + w * 0.26, y + 3], [x + w * 0.16, y + h * 0.5], [x + 3, y + h * 0.44]], { fill: '#6EC86B', stroke: '#4EA54E', lwPx: 2, smooth: 0.4 });
    shape([[x + w - 3, y + 3], [x + w * 0.74, y + 3], [x + w * 0.84, y + h * 0.42], [x + w - 3, y + h * 0.36]], { fill: '#6EC86B', stroke: '#4EA54E', lwPx: 2, smooth: 0.4 });
    // Cute smiling face right on the bed front!
    const cx = x + w * 0.48, cy = y + h * 0.56;
    circle(cx - 18, cy - 8, 4.2, { fill: INK, stroke: null });
    circle(cx + 18, cy - 8, 4.2, { fill: INK, stroke: null });
    ellipse(cx - 32, cy + 4, 8, 5, { fill: 'rgba(246, 154, 179, 0.75)', stroke: null });
    ellipse(cx + 32, cy + 4, 8, 5, { fill: 'rgba(246, 154, 179, 0.75)', stroke: null });
    line([[cx - 9, cy + 2], [cx, cy + 12], [cx + 9, cy + 2]], { stroke: INK, lwPx: 3, smooth: true });
  }

  function drawKitchenBg(pw, ph, opts = {}) {
    const floorY = ph * 0.76;
    X.fillStyle = linGrad(0, 0, 0, floorY, [[0, '#FFF8EA'], [1, '#F7EAD2']]);
    X.fillRect(0, 0, pw, floorY);

    // Soft pastel tile backsplash stripe
    X.fillStyle = '#EFE3CE';
    X.fillRect(0, floorY - 96, pw, 96);
    line([[0, floorY - 96], [pw, floorY - 96]], { stroke: '#D3BEA0', lwPx: 3 });

    // Round wall clock (as drawn in Jenna's Row 2!)
    if (opts.clock !== false) {
      const cx = pw * (opts.clockX ?? 0.22), cy = ph * 0.16;
      circle(cx, cy, 34, { fill: '#FFFDF8', stroke: INK, lwPx: 3.5 });
      line([[cx, cy], [cx, cy - 18]], { stroke: INK, lwPx: 3 });
      line([[cx, cy], [cx + 14, cy + 6]], { stroke: INK, lwPx: 2.8 });
      circle(cx, cy, 3.5, { fill: INK, stroke: null });
    }

    // Kitchen floor
    X.fillStyle = '#E1CEB5';
    X.fillRect(0, floorY, pw, ph - floorY);
    line([[0, floorY], [pw, floorY]], { stroke: INK, lwPx: 4 });

    // Charcoal kitchen stove
    if (opts.stove) {
      const sx = pw * (opts.stoveX ?? 0.08), sy = floorY - 122, sw = 152, sh = 128;
      shape(rectPts(sx, sy, sw, sh), { fill: '#4B4854', stroke: INK, lwPx: 4 });
      shape(rectPts(sx + 10, sy + 42, sw - 20, 68), { fill: '#33303B', stroke: INK, lwPx: 3 });
      // Oven window glow
      shape(rectPts(sx + 24, sy + 54, sw - 48, 42), { fill: '#646070', stroke: INK, lwPx: 2.5 });
      // Burners & knobs
      for (let i = 0; i < 4; i++) {
        circle(sx + 28 + i * 32, sy + 20, 8, { fill: '#2B2832', stroke: '#9A96A6', lwPx: 2 });
      }
      if (opts.stovePan) {
        drawSkillet(sx + sw * 0.65, sy - 6, 1.05, opts.stovePan !== 'empty', true);
      }
    }
  }

  function drawHallwayBg(pw, ph, tint = '#FFF5E8') {
    const floorY = ph * 0.78;
    X.fillStyle = linGrad(0, 0, 0, floorY, [[0, tint], [1, '#F5E4CF']]);
    X.fillRect(0, 0, pw, floorY);
    X.fillStyle = '#EAD4BA';
    X.fillRect(0, floorY - 64, pw, 64);
    line([[0, floorY - 64], [pw, floorY - 64]], { stroke: '#CBB195', lwPx: 3 });
    X.fillStyle = '#D5A272';
    X.fillRect(0, floorY, pw, ph - floorY);
    line([[0, floorY], [pw, floorY]], { stroke: INK, lwPx: 3.8 });
  }

  function drawAdventureWorldBg(pw, ph, opts = {}) {
    const groundY = ph * (opts.groundFrac ?? 0.75);
    // Sky
    const sky = linGrad(0, 0, 0, groundY, opts.sunset
      ? [[0, '#78BCE8'], [0.65, '#C4E4F8'], [1, '#FCE7BE']]
      : [[0, '#6BC0F0'], [0.6, '#A6DCF8'], [1, '#D8F1FD']]);
    X.fillStyle = sky;
    X.fillRect(0, 0, pw, groundY);

    // Bright yellow sun with golden rays (matches Jenna's centerpiece cover!)
    if (opts.sun) {
      const sx = pw * 0.16, sy = ph * 0.24, sr = Math.min(pw, ph) * 0.12;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        line([
          [sx + Math.cos(a) * (sr * 1.18), sy + Math.sin(a) * (sr * 1.18)],
          [sx + Math.cos(a) * (sr * 1.85), sy + Math.sin(a) * (sr * 1.85)],
        ], { stroke: '#FFE054', lwPx: 14 });
      }
      circle(sx, sy, sr, { fill: '#FFE259', stroke: '#F0B429', lwPx: 4 });
    }

    // Fluffy clouds
    if (opts.clouds !== false) {
      const drawCloud = (cx, cy, cs) => {
        ellipse(cx, cy, 46 * cs, 24 * cs, { fill: '#FFFDF8', stroke: null });
        ellipse(cx - 32 * cs, cy + 6 * cs, 30 * cs, 18 * cs, { fill: '#FFFDF8', stroke: null });
        ellipse(cx + 34 * cs, cy + 6 * cs, 32 * cs, 18 * cs, { fill: '#FFFDF8', stroke: null });
      };
      drawCloud(pw * 0.68, ph * 0.22, opts.cover ? 1.5 : 0.95);
      if (opts.cover) drawCloud(pw * 0.42, ph * 0.16, 0.9);
    }

    // Distant soaring birds
    if (opts.birds) {
      for (const [bx, by, bs] of [[0.62, 0.15, 1.0], [0.74, 0.19, 0.85], [0.54, 0.28, 0.7]]) {
        const px = pw * bx, py = ph * by;
        line([[px - 24 * bs, py + 6 * bs], [px - 8 * bs, py - 8 * bs], [px, py + 4 * bs], [px + 10 * bs, py - 8 * bs], [px + 24 * bs, py + 6 * bs]], {
          stroke: INK, lwPx: 4 * bs, smooth: true,
        });
      }
    }

    // Leafy tree on left (cover) or bare adventure tree (portal clearing)
    if (opts.leafyTree) {
      const tx = pw * 0.11, ty = groundY;
      shape([[tx - 16, ty], [tx - 10, ty - 220], [tx + 12, ty - 220], [tx + 20, ty]], { fill: '#8C5835', stroke: INK, lwPx: 4 });
      line([[tx + 4, ty - 140], [tx + 68, ty - 195]], { stroke: '#8C5835', lwPx: 14 });
      circle(tx - 6, ty - 245, 74, { fill: '#4E9A4E', stroke: INK, lwPx: 4.5 });
      circle(tx - 32, ty - 262, 34, { fill: '#6CC264', stroke: null });
    } else if (opts.bareTree) {
      const tx = pw * (opts.treeX ?? 0.16), ty = groundY;
      line([[tx, ty + 8], [tx, ty - 175]], { stroke: '#9E6842', lwPx: 16 });
      line([[tx, ty - 125], [tx - 46, ty - 172]], { stroke: '#9E6842', lwPx: 10 });
      line([[tx, ty - 110], [tx + 44, ty - 158]], { stroke: '#9E6842', lwPx: 10 });
    }

    // Palm tree on right (cover)
    if (opts.palmTree) {
      const px = pw * 0.86, py = groundY;
      line([[px, py + 6], [px + 10, py - 145], [px - 8, py - 265]], { stroke: '#7A4E32', lwPx: 22, smooth: true });
      const topX = px - 8, topY = py - 265;
      for (const [dx, dy] of [[-105, -24], [-86, -68], [-22, -90], [66, -72], [102, -18], [68, 22]]) {
        line([[topX, topY], [topX + dx * 0.55, topY + dy * 0.8 - 18], [topX + dx, topY + dy]], {
          stroke: '#3C7A42', lwPx: 18, smooth: true,
        });
      }
    }

    // Rich brown earth foreground
    X.fillStyle = linGrad(0, groundY, 0, ph, [[0, '#9B653C'], [0.45, '#82502E'], [1, '#683D21']]);
    X.fillRect(0, groundY, pw, ph - groundY);
    line([[0, groundY], [pw, groundY]], { stroke: INK, lwPx: 4.5 });

    // Diamond portal crest in foreground soil (cover)
    if (opts.crest) {
      const cx = pw * 0.5, cy = groundY + (ph - groundY) * 0.52;
      shape([[cx, cy - 58], [cx + 76, cy], [cx, cy + 58], [cx - 76, cy]], {
        fill: '#C49A6C', stroke: INK, lwPx: 5,
      });
      shape([[cx, cy - 42], [cx + 56, cy], [cx, cy + 42], [cx - 56, cy]], {
        fill: '#E8CFA8', stroke: INK, lwPx: 3,
      });
      // Crack/portal rune lines inside diamond
      line([[cx - 24, cy - 6], [cx - 4, cy + 4], [cx + 16, cy - 12], [cx + 28, cy + 6]], { stroke: INK, lwPx: 3.5 });
      line([[cx - 4, cy + 4], [cx + 6, cy + 22]], { stroke: INK, lwPx: 3.5 });
    }
  }

  function drawTimeoutBg(pw, ph) {
    const floorY = ph * 0.78;
    X.fillStyle = linGrad(0, 0, 0, floorY, [[0, '#F7F3E9'], [1, '#EAE2D2']]);
    X.fillRect(0, 0, pw, floorY);
    // Green grass / rug strip at bottom matching Jenna's Row 10!
    X.fillStyle = '#539E5C';
    X.fillRect(0, floorY, pw, ph - floorY);
    line([[0, floorY], [pw, floorY]], { stroke: INK, lwPx: 4 });
  }

  // ---------- 8-PAGE COMIC DEFINITION ----------

  comic({
    paper: '#FFFDF7',
    margin: 52,
    bottomMargin: 54,
    gutter: 20,
    pages: [
      // =========================================================================
      // PAGE 1 — COVER SPLASH & MEET THE PALS (Centerpiece from Drawing 1)
      // =========================================================================
      {
        id: 'page-01',
        masthead: {
          title: 'PALM PALS ADVENTURES',
          subtitle: 'Issue #1 · Created by Jenna Safadi',
          titleSize: 44,
        },
        rows: [
          {
            weight: 1.85,
            panels: [
              {
                id: 'p1_cover_splash',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'Storybook comic cover splash in a sunny adventure clearing: radiant yellow sun with rays, fluffy clouds, birds, a leafy green tree on the left, a palm tree on the right, brown earth ground with a diamond portal rune crest. Eve Earth (blue plushie globe wearing a brown plaid explorer hat, worried) and Zelie Pink Lemonade (pink plushie lemonade cup with foam, lemon slice, striped straw, looking nervous) stand side-by-side.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph, {
                    sun: true, clouds: true, birds: true, leafyTree: true, palmTree: true, crest: true, cover: true, groundFrac: 0.72,
                  });
                  drawEve(pw * 0.39, ph * 0.71, 25, {
                    hat: true, eyes: 'open', brows: 'worried', mouth: 'frown', lookX: 0.3,
                  });
                  drawZelie(pw * 0.63, ph * 0.71, 24, {
                    eyes: 'wide', brows: 'worried', mouth: 'o', lookX: -0.35, armL: 0.55, armR: -0.5,
                  });
                },
                lettering: {
                  sfx: [
                    { text: 'THE ADVENTURE', x: 0.52, y: 0.14, size: 102, rot: -0.025, fill: '#FFE259', outline: '#FFFDF8' },
                  ],
                  captions: [
                    { text: 'BY JENNA SAFADI', x: 24, y: -66, size: 28, fill: '#FFF1A8' },
                  ],
                },
              },
            ],
          },
          {
            weight: 1.0,
            panels: [
              {
                id: 'p1_bio_eve',
                weight: 1,
                cast: ['eve'],
                prompt: 'Bright pastel sky-blue character bio portrait card of Eve Earth, a cheerful squishy blue-and-green plushie globe waving warmly with rosy cheeks and a big smile.',
                draw(pw, ph) {
                  X.fillStyle = linGrad(0, 0, 0, ph, [[0, '#E8F7FF'], [1, '#CBEBFB']]);
                  X.fillRect(0, 0, pw, ph);
                  // Soft sunburst polka backdrop
                  circle(pw * 0.5, ph * 0.56, 200, { fill: 'rgba(255,255,255,0.52)', stroke: null });
                  drawEve(pw * 0.5, ph * 0.78, 28, {
                    eyes: 'open', mouth: 'grin', armR: -0.95, armL: 0.4,
                  });
                },
                lettering: {
                  captions: [
                    { text: 'EVE EARTH', x: 20, y: 18, size: 30, fill: '#FFF1A8' },
                    { text: '10 YEARS OLD', x: -20, y: -62, size: 24, align: 'right', fill: '#D5F0FF' },
                  ],
                },
              },
              {
                id: 'p1_bio_zelie',
                weight: 1,
                cast: ['zelie'],
                prompt: 'Bright pastel pink character bio portrait card of Zelie Pink Lemonade, a bubbly squishy pink lemonade cup plushie with white foam, lemon slice, and striped straw grinning cheerfully.',
                draw(pw, ph) {
                  X.fillStyle = linGrad(0, 0, 0, ph, [[0, '#FFF0F6'], [1, '#FDD4E4']]);
                  X.fillRect(0, 0, pw, ph);
                  circle(pw * 0.44, ph * 0.56, 200, { fill: 'rgba(255,255,255,0.52)', stroke: null });
                  drawZelie(pw * 0.42, ph * 0.81, 25, {
                    eyes: 'happy', mouth: 'laugh', armR: -0.85, armL: 0.45,
                  });
                },
                lettering: {
                  captions: [
                    { text: 'ZELIE PINK LEMONADE', x: 20, y: 18, size: 28, fill: '#FFF1A8' },
                    { text: '6 YEARS OLD', x: -20, y: -62, size: 24, align: 'right', fill: '#FFE0EC' },
                  ],
                  bubbles: [
                    { speaker: 'Zelie', text: 'Just call me Zelie', cx: 0.74, cy: 0.34, tx: 0.54, ty: 0.56, size: 26, maxW: 230 },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 2 — GOOD MORNING & PANCAKES! (Rows 1–2 of Drawing 1 · 9 panels)
      // =========================================================================
      {
        id: 'page-02',
        masthead: {
          title: 'THE ADVENTURE',
          subtitle: 'Page 2 · Good Morning & Pancakes!',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p2_asleep',
                weight: 1,
                cast: ['eve'],
                location: 'bedroom_night',
                prompt: 'Cozy peach-walled bedroom at night: deep starry night sky with a glowing yellow moon visible through the window, wavy wall poster, wooden nightstand with glowing yellow lamp and mug, and Eve Earth peacefully asleep tucked inside his smiling Earth-themed bed.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { nightstand: true, day: false });
                  drawEve(pw * 0.62, ph * 0.70, 14, { eyes: 'closed', mouth: 'smile', noFeet: true, noArms: true, noShadow: true });
                  drawEarthBed(pw * 0.32, ph * 0.62, pw * 0.58, ph * 0.22);
                },
                lettering: {
                  sfx: [{ text: 'ZZZZ', x: 0.72, y: 0.44, size: 46, rot: -0.08, fill: '#9DD6FA' }],
                },
              },
              {
                id: 'p2_yawn',
                weight: 1,
                cast: ['eve'],
                location: 'bedroom_day',
                prompt: 'Bright morning in Eve Earth\'s bedroom: sunny sky-blue daytime sky and a glowing golden sun with rays shining through the window as Eve wakes up in his Earth-themed bed, stretching his stubby blue plushie arms with a big sleepy yawn.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { nightstand: true, day: true });
                  drawEve(pw * 0.60, ph * 0.69, 15, { eyes: 'sleepy', mouth: 'O', armL: -0.95, armR: 0.95, noFeet: true, noShadow: true });
                  drawEarthBed(pw * 0.32, ph * 0.62, pw * 0.58, ph * 0.22);
                },
                lettering: {
                  sfx: [{ text: 'YAWN', x: 0.76, y: 0.42, size: 42, rot: 0.08, fill: '#FFE270' }],
                  bubbles: [{ speaker: 'Eve', text: 'Mmm...', cx: 0.34, cy: 0.24, tx: 0.54, ty: 0.48, size: 24, maxW: 160 }],
                },
              },
              {
                id: 'p2_intro',
                weight: 1,
                cast: ['eve'],
                location: 'bedroom_day',
                prompt: 'Bright sunny morning in Eve Earth\'s bedroom with blue daytime sky and golden sun shining through the window: Eve hops cheerfully out of bed on the bedroom floor, waving happily directly at the reader.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true });
                  drawEarthBed(pw * 0.08, ph * 0.62, pw * 0.40, ph * 0.20);
                  drawEve(pw * 0.72, ph * 0.80, 18, { eyes: 'open', mouth: 'grin', armR: -1.0, armL: 0.4, jump: 0.35 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'Oh! Hi, my name is Eve Earth!', cx: 0.48, cy: 0.22, tx: 0.68, ty: 0.48, size: 24, maxW: 290 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p2_dash',
                weight: 1,
                cast: ['eve'],
                prompt: 'Eve Earth dashing excitedly to the right out of his bedroom hallway toward the kitchen, trailing bold comic speed lines.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph, '#F7D2B2');
                  drawSpeedLines(pw * 0.12, ph * 0.64, pw * 0.60, ph * 0.64, 5);
                  drawEve(pw * 0.74, ph * 0.78, 19, { eyes: 'happy', mouth: 'grin', rot: 0.14, armL: 0.7, armR: -0.7 });
                },
                lettering: {
                  sfx: [{ text: 'ZOOM!', x: 0.34, y: 0.30, size: 54, rot: -0.1, fill: '#7AC3EB' }],
                },
              },
              {
                id: 'p2_whats_for_breakfast',
                weight: 1,
                cast: ['eve', 'eve_dad'],
                location: 'kitchen',
                prompt: 'Cozy kitchen with wall clock and black stove. Eve\'s Dad (a bigger, deeper-blue Earth globe plushie with a cute squiggly mustache) holds a sizzling frying pan while little Eve Earth runs up asking what is for breakfast.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { stove: true, stoveX: 0.04 });
                  drawEveDad(pw * 0.39, ph * 0.78, 18.5, { eyes: 'open', mouth: 'smile', armR: -0.2 });
                  drawSkillet(pw * 0.61, ph * 0.67, 0.78, true, true);
                  drawEve(pw * 0.82, ph * 0.80, 14.5, { eyes: 'open', mouth: 'open', lookX: -0.6, armL: 0.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: "Hey Daddy, what's for breakfast?", cx: 0.60, cy: 0.22, tx: 0.78, ty: 0.56, size: 23, maxW: 290 },
                  ],
                  sfx: [{ text: 'sss', x: 0.62, y: 0.53, size: 28, rot: -0.06, fill: '#FFB347' }],
                },
              },
              {
                id: 'p2_pancakes',
                weight: 1,
                cast: ['eve_dad'],
                location: 'kitchen',
                prompt: 'Close-up in the kitchen: Eve\'s Dad (larger Earth globe plushie with a squiggly mustache) grins proudly while holding up a sizzling frying pan with a golden pancake.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { clockX: 0.80 });
                  drawEveDad(pw * 0.38, ph * 0.80, 22, { eyes: 'happy', mouth: 'grin', armR: -0.35 });
                  drawSkillet(pw * 0.74, ph * 0.64, 1.15, true, true);
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: 'Pancakes!', cx: 0.44, cy: 0.24, tx: 0.40, ty: 0.46, size: 30, maxW: 240 },
                  ],
                  sfx: [{ text: 'SSSS', x: 0.78, y: 0.45, size: 34, rot: 0.08, fill: '#FF9E44' }],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p2_flip_toss',
                weight: 1,
                cast: ['eve', 'eve_dad'],
                location: 'kitchen',
                prompt: 'In the kitchen, Eve\'s Dad (larger Earth globe plushie with a squiggly mustache) stands on the left tossing a golden pancake high in the air above his frying pan while little Eve Earth watches from the right with starry sparkle eyes.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { clock: false });
                  drawEveDad(pw * 0.25, ph * 0.80, 17.5, { eyes: 'happy', mouth: 'grin', armR: -0.35 });
                  drawSkillet(pw * 0.50, ph * 0.67, 0.86, false, false);
                  // Airborne flipping pancake tossed by Dad!
                  line([[pw * 0.50, ph * 0.55], [pw * 0.50, ph * 0.43]], { stroke: INK, lwPx: 2.5, dash: [6, 5] });
                  drawPancake(pw * 0.50, ph * 0.37, 0.78, -0.18);
                  drawEve(pw * 0.79, ph * 0.82, 15.5, { eyes: 'sparkle', mouth: 'grin', lookX: -0.7, lookY: -0.75, armL: 0.7 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'Oooh, yummy!', cx: 0.74, cy: 0.22, tx: 0.78, ty: 0.54, size: 24, maxW: 210 },
                  ],
                  captions: [
                    { text: 'up and down!', x: 16, y: 16, size: 20, fill: '#FFF1A8' },
                  ],
                },
              },
              {
                id: 'p2_doorbell',
                weight: 1,
                cast: ['eve', 'eve_dad'],
                location: 'kitchen',
                prompt: 'Kitchen doorbell rings! Eve\'s Dad (with squiggly mustache) holds up a spatula excitedly while little Eve Earth narrows his eyebrows in suspicion thinking to himself.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { stove: true, stoveX: 0.04, clock: false });
                  drawEveDad(pw * 0.46, ph * 0.80, 18.5, { eyes: 'happy', mouth: 'grin', spatula: true });
                  drawEve(pw * 0.80, ph * 0.82, 14.5, { eyes: 'open', brows: 'angry', mouth: 'frown', lookX: -0.4 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: 'Oooh, the guests are here!', cx: 0.48, cy: 0.15, tx: 0.46, ty: 0.45, size: 22, maxW: 270 },
                    { speaker: 'Eve', text: 'Guests?', cx: 0.78, cy: 0.37, tx: 0.80, ty: 0.58, size: 21, maxW: 150, thought: true },
                  ],
                  sfx: [{ text: 'DING DONG!', x: 0.22, y: 0.42, size: 28, rot: -0.07, fill: '#FFE066' }],
                },
              },
              {
                id: 'p2_get_door',
                weight: 1,
                cast: ['eve', 'eve_dad'],
                location: 'kitchen',
                prompt: 'Eve\'s Dad dashes off to the right (speed lines) leaving the frying pan on the stove; Eve Earth stands next to the unattended stove with a sneaky curious look.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { stove: true, stoveX: 0.06, stovePan: true, clockX: 0.22 });
                  drawSpeedLines(pw * 0.68, ph * 0.68, pw * 0.96, ph * 0.68, 4);
                  drawEve(pw * 0.52, ph * 0.80, 17, { eyes: 'open', brows: 'up', mouth: 'flat', lookX: -0.8 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: "I'll get the door!", cx: 0.68, cy: 0.20, tx: 0.92, ty: 0.48, size: 24, maxW: 230 },
                  ],
                  captions: [
                    { text: 'Hmmm...', x: 0.44, y: 0.40, size: 23, fill: '#FFF1A8' },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 3 — SNEAKING A BITE & MEETING THE "ENEMY" (Rows 3–5 · 9 panels)
      // =========================================================================
      {
        id: 'page-03',
        masthead: {
          title: 'THE ADVENTURE',
          subtitle: 'Page 3 · Sneaking a Bite & Meeting the "Enemy"',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p3_maybe',
                weight: 1,
                cast: ['eve'],
                location: 'kitchen',
                prompt: 'Eve Earth creeps up beside the black kitchen stove, staring wide-eyed at the warm pancake sizzling in the skillet.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { stove: true, stoveX: 0.08, stovePan: true, clock: false });
                  drawEve(pw * 0.64, ph * 0.80, 19, { eyes: 'open', brows: 'worried', mouth: 'o', lookX: -0.8 });
                },
                lettering: {
                  captions: [{ text: 'Maybe...', x: 20, y: 18, size: 28, fill: '#FFF1A8' }],
                },
              },
              {
                id: 'p3_just_a',
                weight: 1,
                cast: ['eve'],
                location: 'kitchen',
                prompt: 'Eve Earth looks slightly startled with wide eyes and raised brows as a warm golden pancake partially flops and drapes over his outstretched stubby blue plushie hand.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { clock: false });
                  drawEve(pw * 0.57, ph * 0.80, 21, { eyes: 'wide', brows: 'up', mouth: 'o', lookX: -0.7, armL: 0.15, armR: -0.5 });
                  // Subtle startle lines above Eve's head
                  line([[pw * 0.44, ph * 0.43], [pw * 0.40, ph * 0.39]], { stroke: INK, lwPx: 3 });
                  line([[pw * 0.56, ph * 0.40], [pw * 0.56, ph * 0.35]], { stroke: INK, lwPx: 3 });
                  line([[pw * 0.69, ph * 0.43], [pw * 0.73, ph * 0.39]], { stroke: INK, lwPx: 3 });
                  // Warm golden pancake partially flopping over Eve's left outstretched hand
                  drawFloppyPancake(pw * 0.34, ph * 0.68, 1.15);
                },
                lettering: {
                  captions: [{ text: 'Just a...', x: 20, y: 18, size: 28, fill: '#FFF1A8' }],
                  sfx: [{ text: 'FLIP!', x: 0.27, y: 0.48, size: 40, rot: -0.14, fill: '#FFB347' }],
                },
              },
              {
                id: 'p3_bite',
                weight: 1,
                cast: ['eve'],
                location: 'kitchen',
                prompt: 'Eve Earth takes a giant happy chomp of pancake, with a bitten golden piece of pancake sticking right out of his mouth and crumbs flying around.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { clock: false });
                  drawEve(pw * 0.52, ph * 0.82, 22, { eyes: 'happy', mouth: 'O', armL: -0.45, armR: 0.45 });
                  // Bitten piece of golden pancake sticking cleanly out of Eve's mouth (below his eyes)
                  drawBittenPancake(pw * 0.55, ph * 0.735, 0.78, 0.14);
                  // Flying pancake crumbs
                  for (const [cx, cy] of [[0.30, 0.56], [0.74, 0.54], [0.70, 0.68], [0.34, 0.68]]) {
                    circle(pw * cx, ph * cy, 5.5, { fill: '#E8A552', stroke: INK, lwPx: 1.8 });
                  }
                },
                lettering: {
                  captions: [{ text: '...bite!', x: 20, y: 18, size: 28, fill: '#FFF1A8' }],
                  sfx: [{ text: 'MUNCH!', x: 0.64, y: 0.36, size: 46, rot: 0.08, fill: '#FF7EA5' }],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p3_heart_eyes',
                weight: 1,
                cast: ['eve'],
                prompt: 'Eve Earth in pure pancake bliss with giant pink heart eyes and rosy cheeks floating in pastel sparkles.',
                draw(pw, ph) {
                  X.fillStyle = linGrad(0, 0, 0, ph, [[0, '#FFF0F6'], [1, '#FFE4EE']]);
                  X.fillRect(0, 0, pw, ph);
                  for (const [sx, sy] of [[0.18, 0.32], [0.82, 0.30], [0.22, 0.72], [0.80, 0.70]]) {
                    shape(starPts(pw * sx, ph * sy, 14, 0.36, 4), { fill: '#FFE066', stroke: INK, lwPx: 2 });
                  }
                  drawEve(pw * 0.50, ph * 0.82, 23, { heartEyes: true, mouth: 'laugh', armL: -0.6, armR: 0.6 });
                },
                lettering: {
                  captions: [{ text: 'Mmm!!', x: 20, y: 18, size: 30, fill: '#FFD5E5' }],
                },
              },
              {
                id: 'p3_daydream',
                weight: 1,
                cast: ['eve'],
                location: 'kitchen',
                prompt: 'Eve Earth stands with eyes closed smiling blissfully while a big fluffy thought cloud above him shows him bouncing joyfully beside a giant fluffy golden pancake with a pat of butter.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { clock: false });
                  drawEve(pw * 0.28, ph * 0.84, 15.5, { eyes: 'closed', mouth: 'smile' });
                  // Thought cloud bubbles
                  circle(pw * 0.38, ph * 0.56, 9, { fill: '#FFFDF8', stroke: INK, lwPx: 3 });
                  circle(pw * 0.45, ph * 0.48, 13, { fill: '#FFFDF8', stroke: INK, lwPx: 3 });
                  // Big fluffy thought cloud
                  const cx = pw * 0.60, cy = ph * 0.42;
                  ellipse(cx, cy, 150, 96, { fill: '#FFFDF8', stroke: INK, lwPx: 4 });
                  drawPancake(cx - 46, cy + 6, 1.05, -0.06);
                  drawEve(cx + 52, cy + 36, 10, { eyes: 'happy', mouth: 'grin', jump: 0.6, noShadow: true });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: 'Eve Earth! Eve Earth!!', cx: 0.50, cy: 0.14, tx: 0.92, ty: 0.24, size: 22, maxW: 280 },
                  ],
                },
              },
              {
                id: 'p3_coming',
                weight: 1,
                cast: ['eve'],
                location: 'kitchen',
                prompt: 'Eve Earth snaps out of his daydream looking startled, hurriedly shoving the rest of the golden pancake into his wide-open mouth with his stubby blue hand while calling out "Shoot! I am coming!" toward the hallway.',
                draw(pw, ph) {
                  drawKitchenBg(pw, ph, { clock: false });
                  // Draw left stubby arm raised in startle behind Eve, suppress default arms so right arm reaches across to mouth
                  ellipse(pw * 0.31, ph * 0.70, 19, 12, { fill: PLP.eveOcean, stroke: INK, lwPx: 3.2, rot: 0.5 });
                  drawEve(pw * 0.48, ph * 0.82, 19.5, { eyes: 'wide', brows: 'worried', mouth: 'O', noArms: true });
                  // Remaining golden pancake piece being hurriedly shoved squarely into Eve's mouth
                  drawBittenPancake(pw * 0.515, ph * 0.745, 0.84, -0.14);
                  // Right stubby blue plushie hand reaching in to stuff the pancake into his mouth + motion lines
                  ellipse(pw * 0.585, ph * 0.755, 19, 12, { fill: PLP.eveOcean, stroke: INK, lwPx: 3.2, rot: -0.18 });
                  line([[pw * 0.64, ph * 0.72], [pw * 0.71, ph * 0.69]], { stroke: INK, lwPx: 2.6 });
                  line([[pw * 0.65, ph * 0.77], [pw * 0.72, ph * 0.77]], { stroke: INK, lwPx: 2.6 });
                  // Tiny flying crumbs from stuffing it in
                  circle(pw * 0.41, ph * 0.72, 4.2, { fill: '#E8A552', stroke: INK, lwPx: 1.6 });
                  circle(pw * 0.62, ph * 0.67, 3.8, { fill: '#E8A552', stroke: INK, lwPx: 1.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: 'Eve Earth, come meet the guests!', cx: 0.50, cy: 0.16, tx: 0.94, ty: 0.26, size: 21, maxW: 300 },
                    { speaker: 'Eve', text: 'Shoot! I am coming!', cx: 0.48, cy: 0.38, tx: 0.48, ty: 0.54, size: 22, maxW: 250 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p3_meet_guests',
                weight: 1,
                cast: ['eve', 'zelie', 'eve_dad', 'zelie_papa'],
                prompt: 'Entryway: Eve\'s Dad (larger Earth globe with squiggly mustache) gestures cheerfully to the two guests — Zelie\'s tall crimson-coral Papa cup plushie (with a squiggly mustache) and Zelie Pink Lemonade (circled with a dramatic red spotlight ring). Little Eve Earth freezes in shock on the left.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph);
                  drawEve(pw * 0.16, ph * 0.82, 13.5, { eyes: 'wide', mouth: 'flat', lookX: 0.9 });
                  drawEveDad(pw * 0.39, ph * 0.82, 15.5, { eyes: 'happy', mouth: 'grin', armR: -0.3 });
                  drawZeliePapa(pw * 0.63, ph * 0.82, 15.5, { eyes: 'open', mouth: 'smile' });
                  // Dramatic spotlight circle around Zelie!
                  circle(pw * 0.84, ph * 0.72, 74, { fill: 'rgba(255, 224, 102, 0.25)', stroke: '#E2414B', lwPx: 4, dash: [10, 6] });
                  drawZelie(pw * 0.84, ph * 0.82, 13, { eyes: 'open', mouth: 'smile' });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: 'Here are the guests!', cx: 0.56, cy: 0.18, tx: 0.42, ty: 0.46, size: 23, maxW: 240 },
                  ],
                  captions: [
                    { text: 'No.', x: 18, y: 18, size: 28, fill: '#FFD5D5' },
                  ],
                },
              },
              {
                id: 'p3_enemy',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'Eve Earth and Zelie Pink Lemonade face off in the hallway glaring furiously at each other.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph, '#FDEAE6');
                  drawEve(pw * 0.30, ph * 0.82, 19, { eyes: 'open', brows: 'angry', mouth: 'frown', lookX: 0.8 });
                  drawZelie(pw * 0.72, ph * 0.82, 17.5, { eyes: 'open', brows: 'angry', mouth: 'frown', lookX: -0.8 });
                },
                lettering: {
                  captions: [
                    { text: 'No way, no way... it was\nmy enemy: Zelie.', x: 18, y: 18, size: 24, maxW: 440, fill: '#FFF1A8' },
                  ],
                },
              },
              {
                id: 'p3_papa_table',
                weight: 1,
                cast: ['eve', 'zelie', 'zelie_papa'],
                prompt: 'Zelie\'s tall crimson-coral Papa plushie (with a squiggly mustache) smiles down at Zelie as he heads toward the dining table, while Eve Earth stands on the left frowning.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph);
                  drawEve(pw * 0.22, ph * 0.82, 15.5, { eyes: 'open', brows: 'worried', mouth: 'frown', lookX: 0.7 });
                  drawZelie(pw * 0.52, ph * 0.82, 15.5, { eyes: 'happy', mouth: 'smile', lookX: 0.6 });
                  drawZeliePapa(pw * 0.80, ph * 0.82, 17.5, { eyes: 'happy', mouth: 'grin', lookX: -0.5 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Papa', text: 'Honey, I will be at the table.', cx: 0.64, cy: 0.16, tx: 0.78, ty: 0.42, size: 21, maxW: 250 },
                    { speaker: 'Zelie', text: 'Ok, Papa!', cx: 0.36, cy: 0.38, tx: 0.50, ty: 0.54, size: 22, maxW: 170 },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 4 — RIVAL SHOWDOWN & BREAKFAST RUSH (Rows 5–7 · 8 panels)
      // =========================================================================
      {
        id: 'page-04',
        masthead: {
          title: 'THE ADVENTURE',
          subtitle: 'Page 4 · Rival Showdown & Breakfast Rush',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p4_doing_here',
                weight: 1.15,
                cast: ['eve', 'zelie'],
                prompt: 'Hallway standoff: Zelie Pink Lemonade points accusingly at Eve Earth, and Eve Earth deadpans back with unimpressed eyes.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph);
                  drawEve(pw * 0.30, ph * 0.84, 18.5, { eyes: 'open', brows: 'up', mouth: 'flat', lookX: 0.7, armR: -0.5 });
                  drawZelie(pw * 0.72, ph * 0.84, 17.5, { eyes: 'wide', brows: 'angry', mouth: 'O', lookX: -0.8, armL: 0.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Zelie', text: 'Eve Earth, what are you doing here?!', cx: 0.64, cy: 0.16, tx: 0.72, ty: 0.46, size: 21, maxW: 300 },
                    { speaker: 'Eve', text: 'This is my house, what do you think?!', cx: 0.36, cy: 0.38, tx: 0.32, ty: 0.58, size: 21, maxW: 290 },
                  ],
                },
              },
              {
                id: 'p4_angry_clouds',
                weight: 0.85,
                cast: ['eve', 'zelie'],
                prompt: 'Comedy beat: Eve Earth and Zelie Pink Lemonade stand side-by-side fuming furiously with tangled black scribble storm clouds hovering above both their heads.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph, '#F9E1DF');
                  drawEve(pw * 0.31, ph * 0.82, 18, { eyes: 'open', brows: 'angry', mouth: 'frown', angryCloud: true });
                  drawZelie(pw * 0.70, ph * 0.82, 16.5, { eyes: 'open', brows: 'angry', mouth: 'frown', angryCloud: true });
                },
                lettering: {},
              },
              {
                id: 'p4_invited',
                weight: 1.0,
                cast: ['eve', 'zelie'],
                prompt: 'Eve Earth leans forward complaining while Zelie Pink Lemonade puffs up indignantly snapping back.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph);
                  drawEve(pw * 0.30, ph * 0.84, 18, { eyes: 'open', brows: 'worried', mouth: 'open', lookX: 0.7, rot: 0.06 });
                  drawZelie(pw * 0.72, ph * 0.84, 17, { eyes: 'open', brows: 'angry', mouth: 'grin', lookX: -0.7, armL: 0.6, armR: -0.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'Why do you have to come...', cx: 0.34, cy: 0.18, tx: 0.32, ty: 0.52, size: 22, maxW: 220 },
                    { speaker: 'Zelie', text: 'I was invited!', cx: 0.72, cy: 0.34, tx: 0.72, ty: 0.52, size: 23, maxW: 190 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p4_shouting',
                weight: 1.05,
                cast: ['eve', 'zelie'],
                prompt: 'Explosive comic shouting match! Eve Earth and Zelie Pink Lemonade lean toward each other yelling at full volume over a spiky pink/orange starburst background.',
                draw(pw, ph) {
                  X.fillStyle = '#FFE3D8';
                  X.fillRect(0, 0, pw, ph);
                  // Spiky comic tension burst
                  shape(starPts(pw * 0.5, ph * 0.58, pw * 0.44, 0.7, 14), { fill: '#FFF4C4', stroke: null });
                  drawEve(pw * 0.28, ph * 0.84, 21, { eyes: 'open', brows: 'angry', mouth: 'laugh', rot: 0.14, armR: -0.9 });
                  drawZelie(pw * 0.72, ph * 0.84, 19.5, { eyes: 'open', brows: 'angry', mouth: 'laugh', rot: -0.14, armL: 0.9 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: "YOU'RE SO ANNOYING!", cx: 0.34, cy: 0.18, tx: 0.30, ty: 0.52, size: 26, maxW: 320, fill: '#FFF4B8' },
                    { speaker: 'Zelie', text: "I DON'T CARE!", cx: 0.70, cy: 0.36, tx: 0.72, ty: 0.52, size: 26, maxW: 260, fill: '#FFE2EC' },
                  ],
                },
              },
              {
                id: 'p4_time_breakfast',
                weight: 0.95,
                cast: ['eve', 'zelie'],
                prompt: 'Eve Earth and Zelie pause mid-argument and look toward the right as Dad calls them to breakfast from off-panel.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph);
                  drawEve(pw * 0.26, ph * 0.84, 18.5, { eyes: 'wide', mouth: 'o', lookX: 0.9 });
                  drawZelie(pw * 0.56, ph * 0.84, 17.5, { eyes: 'open', mouth: 'flat', lookX: 0.9 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dad', text: 'Kids! Time for breakfast!', cx: 0.68, cy: 0.22, tx: 0.96, ty: 0.34, size: 25, maxW: 300 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p4_pancake_zoom',
                weight: 0.88,
                cast: ['eve', 'zelie'],
                prompt: 'Eve Earth blasts off to the right in a blur of speed lines shouting excitedly, leaving Zelie Pink Lemonade standing behind looking totally confused.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph);
                  drawZelie(pw * 0.24, ph * 0.84, 17, { eyes: 'open', brows: 'up', mouth: 'flat', lookX: 0.9 });
                  drawSpeedLines(pw * 0.42, ph * 0.70, pw * 0.64, ph * 0.70, 4);
                  drawEve(pw * 0.78, ph * 0.80, 17.5, { eyes: 'happy', mouth: 'laugh', rot: 0.18, jump: 0.5 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Zelie', text: 'Since when did he love pancakes?', cx: 0.40, cy: 0.20, tx: 0.26, ty: 0.50, size: 19, maxW: 210, thought: true },
                    { speaker: 'Eve', text: 'Yessss!', cx: 0.78, cy: 0.36, tx: 0.78, ty: 0.52, size: 28, maxW: 180 },
                  ],
                },
              },
              {
                id: 'p4_table_feast',
                weight: 1.06,
                cast: ['eve', 'zelie', 'eve_dad', 'zelie_papa'],
                prompt: 'Cozy breakfast table loaded with stacks of golden pancakes: Zelie, Zelie\'s Papa, and Eve\'s Dad eat calmly while Eve Earth gobbles pancakes at frantic cartoon speed.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph, '#FFF6E3');
                  const ty = ph * 0.72;
                  // Chairs behind table
                  for (const cx of [0.14, 0.35, 0.58, 0.82]) {
                    shape(rectPts(pw * cx - 34, ty - 95, 68, 96), { fill: '#D5A272', stroke: INK, lwPx: 3 });
                  }
                  // Plushies seated at table
                  drawZelie(pw * 0.15, ty + 6, 11.5, { eyes: 'open', mouth: 'smile', noShadow: true, noFeet: true });
                  drawZeliePapa(pw * 0.36, ty + 10, 13.5, { eyes: 'happy', mouth: 'smile', noShadow: true, noFeet: true });
                  drawEveDad(pw * 0.58, ty + 10, 13.5, { eyes: 'wide', brows: 'worried', mouth: 'open', noShadow: true, noFeet: true });
                  drawEve(pw * 0.82, ty + 6, 12.5, { eyes: 'happy', mouth: 'O', sq: 0.1, noShadow: true, noFeet: true });
                  // Dining table & tablecloth
                  shape(rectPts(pw * 0.06, ty, pw * 0.88, 22), { fill: '#B67D4B', stroke: INK, lwPx: 3.5 });
                  shape(rectPts(pw * 0.10, ty + 22, pw * 0.80, ph - ty - 22), { fill: '#88C4DC', stroke: INK, lwPx: 3.5 });
                  // Plates of pancakes on table
                  for (const px of [0.18, 0.38, 0.58, 0.78]) {
                    ellipse(pw * px, ty - 2, 34, 9, { fill: '#FFFDF8', stroke: INK, lwPx: 2.5 });
                    ellipse(pw * px, ty - 7, 24, 6, { fill: '#E8A552', stroke: INK, lwPx: 2 });
                  }
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Papa', text: 'Mm!', cx: 0.24, cy: 0.16, tx: 0.34, ty: 0.42, size: 22, maxW: 110 },
                    { speaker: 'Dad', text: "Slow down, Eve Earth! Don't choke!", cx: 0.66, cy: 0.18, tx: 0.58, ty: 0.44, size: 20, maxW: 270 },
                  ],
                  sfx: [{ text: 'NOM NOM NOM', x: 0.76, y: 0.40, size: 26, rot: -0.06, fill: '#FFB347' }],
                },
              },
              {
                id: 'p4_done_room',
                weight: 1.06,
                cast: ['zelie', 'eve_dad', 'zelie_papa'],
                prompt: 'Same wide breakfast table: Zelie Pink Lemonade is happily eating her pancakes with a fork on the left, while Zelie\'s Papa and Eve\'s Dad lean toward each other chatting cheerfully in the middle — everyone completely ignoring Eve Earth, whose plate is empty and tilted chair trails speed lines off-panel to the right.',
                draw(pw, ph) {
                  drawHallwayBg(pw, ph, '#FFF6E3');
                  const ty = ph * 0.72;
                  // Same chair spacing as Panel 7 (with Eve's chair tilted from bolting!)
                  for (const cx of [0.14, 0.35, 0.58]) {
                    shape(rectPts(pw * cx - 34, ty - 95, 68, 96), { fill: '#D5A272', stroke: INK, lwPx: 3 });
                  }
                  X.save();
                  X.translate(pw * 0.84, ty - 2);
                  X.rotate(0.18);
                  shape(rectPts(-32, -92, 64, 94), { fill: '#D5A272', stroke: INK, lwPx: 3 });
                  X.restore();

                  // Zelie happily focused on eating her pancakes
                  drawZelie(pw * 0.15, ty + 6, 11.5, { eyes: 'happy', mouth: 'O', lookY: 0.4, armR: -0.7, noShadow: true, noFeet: true });
                  // Little fork lifting a bite of pancake up toward Zelie
                  line([[pw * 0.21, ty - 16], [pw * 0.19, ty - 34]], { stroke: '#7A8290', lwPx: 3 });
                  circle(pw * 0.19, ty - 36, 6, { fill: '#E8A552', stroke: INK, lwPx: 1.8 });

                  // Both Dads turned toward each other, chatting happily & ignoring Eve
                  drawZeliePapa(pw * 0.36, ty + 10, 13.5, { eyes: 'happy', mouth: 'open', lookX: 0.85, rot: 0.06, noShadow: true, noFeet: true });
                  drawEveDad(pw * 0.58, ty + 10, 13.5, { eyes: 'open', mouth: 'grin', lookX: -0.85, rot: -0.06, noShadow: true, noFeet: true });
                  // Subtle animated chat arcs between the two Dads
                  line([[pw * 0.45, ty - 108], [pw * 0.47, ty - 118], [pw * 0.49, ty - 108]], { stroke: '#8A6B5C', lwPx: 2.5, smooth: true });
                  line([[pw * 0.44, ty - 95], [pw * 0.50, ty - 95]], { stroke: '#8A6B5C', lwPx: 2.2, dash: [4, 4] });

                  // Dining table & tablecloth matching Panel 7
                  shape(rectPts(pw * 0.06, ty, pw * 0.88, 22), { fill: '#B67D4B', stroke: INK, lwPx: 3.5 });
                  shape(rectPts(pw * 0.10, ty + 22, pw * 0.80, ph - ty - 22), { fill: '#88C4DC', stroke: INK, lwPx: 3.5 });
                  // Plates: pancakes left for Zelie & Dads, totally empty plate for Eve!
                  for (const [px, hasFood] of [[0.18, true], [0.38, true], [0.58, true], [0.78, false]]) {
                    ellipse(pw * px, ty - 2, 34, 9, { fill: '#FFFDF8', stroke: INK, lwPx: 2.5 });
                    if (hasFood) ellipse(pw * px, ty - 7, 24, 6, { fill: '#E8A552', stroke: INK, lwPx: 2 });
                  }
                  // Speed lines showing Eve rocketing out to the right
                  drawSpeedLines(pw * 0.72, ph * 0.54, pw * 0.97, ph * 0.54, 4);
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: "Done! I'm going to my room!", cx: 0.62, cy: 0.20, tx: 0.95, ty: 0.44, size: 22, maxW: 280 },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 5 — THE PORTAL! (Rows 7–8 of Drawing 1 · 8 panels)
      // =========================================================================
      {
        id: 'page-05',
        masthead: {
          title: 'THE ADVENTURE',
          subtitle: 'Page 5 · The Portal!',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p5_test_this',
                weight: 1,
                cast: ['eve'],
                location: 'bedroom_day',
                prompt: 'Daytime in Eve Earth\'s peach-walled bedroom (bright blue daytime sky and golden sun shining through the window): Eve presses a glowing red button on a small gadget box on the floor with curious determination.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true });
                  drawEve(pw * 0.42, ph * 0.82, 20, { eyes: 'open', brows: 'up', mouth: 'flat', lookX: 0.7, armR: -0.1 });
                  // Mysterious portal remote box
                  shape(rectPts(pw * 0.64, ph * 0.68, 66, 46), { fill: '#D9E4EC', stroke: INK, lwPx: 3.5 });
                  circle(pw * 0.64 + 33, ph * 0.68 + 23, 14, { fill: '#EF4444', stroke: INK, lwPx: 3 });
                },
                lettering: {
                  captions: [{ text: "IN EVE EARTH'S ROOM", x: 16, y: 16, size: 22, fill: '#FFF1A8' }],
                  bubbles: [
                    { speaker: 'Eve', text: "Hmm... let's test this!", cx: 0.52, cy: 0.24, tx: 0.44, ty: 0.48, size: 23, maxW: 270 },
                  ],
                  sfx: [{ text: 'CLICK!', x: 0.74, y: 0.55, size: 36, rot: 0.1, fill: '#FFE066' }],
                },
              },
              {
                id: 'p5_portal_opens',
                weight: 1,
                cast: ['eve'],
                location: 'bedroom_day',
                prompt: 'Daytime in Eve Earth\'s bedroom (sunny blue sky and golden sun visible through the window): a glowing swirling cobalt-blue portal vortex rips open! Eve gasps wide-eyed.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true });
                  drawPortal(pw * 0.72, ph * 0.62, 110, 142, 'blue');
                  drawEve(pw * 0.28, ph * 0.82, 19, { eyes: 'wide', brows: 'up', mouth: 'O', lookX: 0.8, armR: -0.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'Woah! A portal?!', cx: 0.38, cy: 0.20, tx: 0.30, ty: 0.50, size: 25, maxW: 240 },
                  ],
                },
              },
              {
                id: 'p5_zelie_jumps',
                weight: 1,
                cast: ['eve', 'zelie'],
                location: 'bedroom_day',
                prompt: 'Daytime in Eve\'s bedroom (sunny blue sky and golden sun through the window): Zelie Pink Lemonade bursts in, smacks past Eve Earth, and dives eagerly toward the swirling blue portal.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true });
                  drawPortal(pw * 0.82, ph * 0.66, 82, 122, 'blue');
                  drawSpeedLines(pw * 0.06, ph * 0.72, pw * 0.36, ph * 0.72, 4);
                  drawEve(pw * 0.34, ph * 0.84, 16, { eyes: 'closed', brows: 'angry', mouth: 'O', rot: -0.22 });
                  drawZelie(pw * 0.62, ph * 0.80, 16.5, { eyes: 'sparkle', mouth: 'laugh', rot: 0.22, jump: 0.5, armL: 0.8 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Zelie', text: 'Hi! Oooo!', cx: 0.70, cy: 0.16, tx: 0.64, ty: 0.44, size: 23, maxW: 190 },
                    { speaker: 'Eve', text: 'Zelie, no!', cx: 0.26, cy: 0.30, tx: 0.34, ty: 0.56, size: 23, maxW: 170 },
                  ],
                  sfx: [{ text: 'SLAP!', x: 0.48, y: 0.46, size: 36, rot: -0.15, fill: '#FF6B9A' }],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p5_going_in',
                weight: 1.05,
                cast: ['eve'],
                location: 'bedroom_day',
                prompt: 'Daytime in Eve\'s bedroom (sunny blue sky and golden sun through the window): Eve Earth groans furiously on the left while Zelie has just zipped straight into the glowing swirling blue portal on the right (trailing speed lines into the portal, Zelie already gone inside).',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true });
                  drawPortal(pw * 0.74, ph * 0.66, 138, 152, 'blue');
                  drawSpeedLines(pw * 0.44, ph * 0.70, pw * 0.66, ph * 0.66, 4);
                  drawEve(pw * 0.25, ph * 0.84, 22, { eyes: 'closed', brows: 'angry', mouth: 'O', rot: -0.06, armL: 0.7, armR: -0.7 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'ARRG!', cx: 0.26, cy: 0.18, tx: 0.25, ty: 0.50, size: 32, maxW: 200, fill: '#FFF4B8' },
                    { speaker: 'Zelie', text: "I'm going in!", cx: 0.72, cy: 0.20, tx: 0.74, ty: 0.52, size: 25, maxW: 220 },
                  ],
                },
              },
              {
                id: 'p5_get_her',
                weight: 0.95,
                cast: ['eve'],
                location: 'bedroom_day',
                prompt: 'Daytime in Eve\'s bedroom (sunny blue sky and golden sun through the window): action shot of the swirling blue portal vortex with dramatic comic speed lines diving right into the glowing center.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true });
                  drawPortal(pw * 0.68, ph * 0.64, 148, 162, 'blue');
                  drawSpeedLines(pw * 0.16, ph * 0.76, pw * 0.58, ph * 0.66, 6);
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'I guess I have to get her.', cx: 0.38, cy: 0.22, tx: 0.58, ty: 0.48, size: 25, maxW: 300 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p5_nice_hat',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'Sunny outdoor adventure clearing with a bare brown tree. Eve Earth stands grumpy mysteriously wearing a brown plaid explorer hat; Zelie Pink Lemonade grins cheekily complimenting his hat.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph, { bareTree: true, treeX: 0.14 });
                  drawEve(pw * 0.32, ph * 0.84, 17, { hat: true, eyes: 'open', brows: 'angry', mouth: 'frown', lookX: 0.7 });
                  drawZelie(pw * 0.72, ph * 0.84, 16.5, { eyes: 'happy', mouth: 'grin', lookX: -0.7 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: "Zelie! Let's go back!", cx: 0.34, cy: 0.16, tx: 0.32, ty: 0.44, size: 22, maxW: 230 },
                    { speaker: 'Zelie', text: 'Nice hat.', cx: 0.74, cy: 0.30, tx: 0.72, ty: 0.50, size: 23, maxW: 170 },
                  ],
                },
              },
              {
                id: 'p5_locked_portal',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'In the outdoor adventure clearing, the portal is now dormant and locked with a wooden sign plaque reading FIND THE KEY TO OPEN PORTAL. Eve Earth (in his brown hat) growls while Zelie tells him to start looking.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph, { bareTree: true, treeX: 0.44 });
                  drawPortal(pw * 0.24, ph * 0.62, 102, 128, 'locked');
                  drawEve(pw * 0.56, ph * 0.84, 14.5, { hat: true, eyes: 'open', brows: 'angry', mouth: 'frown' });
                  drawZelie(pw * 0.82, ph * 0.84, 14.5, { eyes: 'open', brows: 'angry', mouth: 'open', lookX: -0.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Zelie', text: "Look, dummy! Let's look!", cx: 0.70, cy: 0.16, tx: 0.82, ty: 0.48, size: 21, maxW: 240 },
                    { speaker: 'Eve', text: 'Grr... ugh, fine.', cx: 0.44, cy: 0.34, tx: 0.54, ty: 0.52, size: 20, maxW: 195 },
                  ],
                },
              },
              {
                id: 'p5_ten_hours',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: '10 hours later in the late-afternoon adventure clearing: Eve Earth (in brown plaid hat) and Zelie Pink Lemonade are exhausted, scuffed, dusty, and wearing tiny bandages after searching everywhere.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph, { bareTree: true, treeX: 0.12, sunset: true });
                  drawEve(pw * 0.30, ph * 0.86, 15.5, { hat: true, scuffed: true, eyes: 'sleepy', brows: 'angry', mouth: 'frown' });
                  drawZelie(pw * 0.75, ph * 0.86, 15, { scuffed: true, eyes: 'closed', brows: 'angry', mouth: 'O' });
                },
                lettering: {
                  captions: [{ text: '10 HOURS LATER', x: 14, y: 12, size: 20, fill: '#FFF1A8' }],
                  bubbles: [
                    { speaker: 'Eve', text: 'We did not find the key. I hate looking!', cx: 0.42, cy: 0.19, tx: 0.24, ty: 0.50, size: 18, maxW: 265 },
                    { speaker: 'Zelie', text: 'We got attacked by a bear!', cx: 0.71, cy: 0.35, tx: 0.75, ty: 0.57, size: 18, maxW: 205 },
                    { speaker: 'Eve', text: 'And much more...', cx: 0.43, cy: 0.49, tx: 0.35, ty: 0.60, size: 18, maxW: 195 },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 6 — UNDER MY HAT & HEADING HOME! (Row 9 of Drawing 1 · 8 panels)
      // =========================================================================
      {
        id: 'page-06',
        masthead: {
          title: 'THE ADVENTURE',
          subtitle: 'Page 6 · Under My Hat & Heading Home!',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p6_laughing',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'In the sunlit adventure clearing, Eve Earth (wearing brown plaid hat) and Zelie Pink Lemonade suddenly burst out laughing so hard joyful blue tears fly from their eyes.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph, { bareTree: true, treeX: 0.14 });
                  drawEve(pw * 0.34, ph * 0.84, 18, { hat: true, eyes: 'happy', mouth: 'laugh', laughTears: true, rot: -0.08 });
                  drawZelie(pw * 0.72, ph * 0.84, 17, { eyes: 'happy', mouth: 'laugh', laughTears: true, rot: 0.1 });
                },
                lettering: {
                  sfx: [{ text: 'HAHAHA!', x: 0.52, y: 0.24, size: 62, rot: -0.06, fill: '#FFE066' }],
                },
              },
              {
                id: 'p6_sorry',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'Warm friendship moment in the adventure clearing: Eve Earth (in brown hat) and Zelie Pink Lemonade smile gently and pat each other apologetically.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph, { bareTree: true, treeX: 0.12 });
                  drawEve(pw * 0.36, ph * 0.84, 18, { hat: true, eyes: 'happy', mouth: 'smile', armR: -0.2 });
                  drawZelie(pw * 0.66, ph * 0.84, 17, { eyes: 'happy', mouth: 'smile', armL: 0.2 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'Sorry, Zelie.', cx: 0.30, cy: 0.18, tx: 0.34, ty: 0.44, size: 22, maxW: 190 },
                    { speaker: 'Zelie', text: "Sorry, Eve Earth. You're fun!", cx: 0.68, cy: 0.32, tx: 0.66, ty: 0.52, size: 21, maxW: 240 },
                  ],
                },
              },
              {
                id: 'p6_itchy_hat',
                weight: 1,
                cast: ['eve'],
                prompt: 'Close-up of Eve Earth squinting uncomfortably and reaching a stubby blue hand up toward his itchy brown plaid explorer hat.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph);
                  drawEve(pw * 0.50, ph * 0.84, 21, { hat: true, eyes: 'open', brows: 'worried', mouth: 'frown', armR: -1.1 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'My hat is itchy...', cx: 0.50, cy: 0.18, tx: 0.50, ty: 0.42, size: 24, maxW: 260 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p6_key_reveal',
                weight: 1,
                cast: ['eve'],
                prompt: 'Comedic reveal! Eve Earth lifts off his brown plaid explorer hat, revealing a shiny golden key sitting right on top of his head with sparkles!',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph);
                  // Sparkles around the discovered golden key!
                  for (const [sx, sy] of [[0.36, 0.44], [0.58, 0.42], [0.47, 0.38]]) {
                    shape(starPts(pw * sx, ph * sy, 13, 0.35, 4), { fill: '#FFF08A', stroke: INK, lwPx: 2 });
                  }
                  drawEve(pw * 0.46, ph * 0.84, 21, { keyOnHead: true, eyes: 'wide', mouth: 'O', armR: -0.3 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: 'Oh, the key! It was under my hat!', cx: 0.50, cy: 0.18, tx: 0.46, ty: 0.46, size: 24, maxW: 380 },
                  ],
                },
              },
              {
                id: 'p6_bro',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'Comedy beat: Eve Earth grins sheepishly holding the golden key while Zelie Pink Lemonade stares at him in total wide-eyed deadpan disbelief.',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph);
                  drawEve(pw * 0.32, ph * 0.84, 20, { eyes: 'happy', mouth: 'grin', holdKey: true, armL: 0.4 });
                  drawZelie(pw * 0.72, ph * 0.84, 19, { deadpan: true });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve', text: "Sorry, I didn't know!", cx: 0.34, cy: 0.20, tx: 0.32, ty: 0.50, size: 24, maxW: 280 },
                    { speaker: 'Zelie', text: 'bro.', cx: 0.74, cy: 0.24, tx: 0.72, ty: 0.48, size: 30, maxW: 160 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p6_turn_key',
                weight: 1,
                cast: ['eve'],
                prompt: 'Dramatic close-up of Eve Earth\'s stubby sky-blue plushie hand inserting the shiny golden key into the portal lock plaque and turning it.',
                draw(pw, ph) {
                  X.fillStyle = '#334155';
                  X.fillRect(0, 0, pw, ph);
                  // Large close-up wooden lock plaque
                  shape(rectPts(pw * 0.12, ph * 0.16, pw * 0.58, ph * 0.68), { fill: '#F6E7C8', stroke: INK, lwPx: 5 });
                  // Brass keyhole plate
                  circle(pw * 0.44, ph * 0.56, 42, { fill: '#F7C948', stroke: INK, lwPx: 4 });
                  circle(pw * 0.44, ph * 0.54, 14, { fill: '#2D222B', stroke: null });
                  // Golden key turned into lock by blue plushie hand gripping the bow
                  drawGoldKey(pw * 0.60, ph * 0.56, 1.55, Math.PI);
                  ellipse(pw * 0.71, ph * 0.56, 46, 32, { fill: PLP.eveOcean, stroke: INK, lwPx: 4.5 });
                  // Turning motion arc
                  X.save();
                  X.strokeStyle = '#FFE066';
                  X.lineWidth = 5;
                  X.beginPath();
                  X.arc(pw * 0.44, ph * 0.56, 68, -0.8, 0.6);
                  X.stroke();
                  X.restore();
                },
                lettering: {
                  sfx: [{ text: 'TURN!', x: 0.68, y: 0.24, size: 52, rot: 0.08, fill: '#FFE066' }],
                },
              },
              {
                id: 'p6_gold_portal',
                weight: 1,
                cast: [],
                prompt: 'A radiant swirling GOLDEN portal blasts open in the adventure clearing with comic speed lines as Eve and Zelie leap joyfully through!',
                draw(pw, ph) {
                  drawAdventureWorldBg(pw, ph);
                  drawPortal(pw * 0.36, ph * 0.60, 128, 152, 'gold');
                  drawSpeedLines(pw * 0.54, ph * 0.64, pw * 0.90, ph * 0.60, 5);
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Eve & Zelie', text: 'Yay!!', cx: 0.72, cy: 0.22, tx: 0.52, ty: 0.48, size: 32, maxW: 200, fill: '#FFF7C4' },
                  ],
                },
              },
              {
                id: 'p6_home',
                weight: 1,
                cast: ['eve', 'zelie'],
                location: 'bedroom_night',
                prompt: 'Eve Earth and Zelie Pink Lemonade pop safely back onto Eve\'s cozy bedroom floor, beaming with huge relief.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph);
                  drawEve(pw * 0.34, ph * 0.84, 18, { eyes: 'happy', mouth: 'grin', jump: 0.4 });
                  drawZelie(pw * 0.70, ph * 0.84, 17, { eyes: 'happy', mouth: 'laugh', jump: 0.4 });
                },
                lettering: {
                  sfx: [{ text: 'GASP!', x: 0.28, y: 0.42, size: 34, rot: -0.08, fill: '#9DD6FA' }],
                  bubbles: [
                    { speaker: 'Eve & Zelie', text: 'Home!!', cx: 0.62, cy: 0.20, tx: 0.68, ty: 0.48, size: 28, maxW: 190 },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 7 — TIME OUT, BEST FRIENDS & CLIFFHANGER (Row 10 · 6 panels)
      // =========================================================================
      {
        id: 'page-07',
        masthead: {
          title: 'THE ADVENTURE',
          subtitle: 'Page 7 · Time Out & Best Friends',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p7_busted',
                weight: 1.15,
                cast: ['eve', 'zelie', 'eve_dad', 'zelie_papa'],
                location: 'bedroom_day',
                prompt: 'Daytime in Eve\'s room (bright blue daytime sky and golden sun shining through the window): right outside the fading golden portal, Eve\'s Dad and Zelie\'s Papa (both with squiggly mustaches) stand waiting sternly while little Eve Earth and Zelie Pink Lemonade droop sheepishly.',
                draw(pw, ph) {
                  drawBedroomBg(pw, ph, { day: true, sunLeft: true });
                  drawPortal(pw * 0.14, ph * 0.66, 72, 114, 'gold');
                  drawZelie(pw * 0.32, ph * 0.84, 14.5, { eyes: 'open', brows: 'worried', mouth: 'frown' });
                  drawEve(pw * 0.50, ph * 0.84, 15, { eyes: 'open', brows: 'worried', mouth: 'frown' });
                  drawEveDad(pw * 0.70, ph * 0.84, 18.5, { eyes: 'open', brows: 'angry', mouth: 'flat', lookX: -0.6 });
                  drawZeliePapa(pw * 0.88, ph * 0.84, 18.5, { eyes: 'open', brows: 'angry', mouth: 'flat', lookX: -0.6 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Dads', text: 'Time out.', cx: 0.76, cy: 0.20, tx: 0.74, ty: 0.46, size: 28, maxW: 220 },
                    { speaker: 'Kids', text: 'Awww!', cx: 0.38, cy: 0.36, tx: 0.44, ty: 0.58, size: 24, maxW: 160 },
                  ],
                },
              },
              {
                id: 'p7_timeout_sit',
                weight: 0.85,
                cast: ['eve', 'zelie'],
                prompt: 'Quiet comedy beat: Eve Earth and Zelie Pink Lemonade sit quietly side-by-side in the Time Out corner looking bashful.',
                draw(pw, ph) {
                  drawTimeoutBg(pw, ph);
                  drawEve(pw * 0.36, ph * 0.84, 18, { eyes: 'open', mouth: 'flat', lookX: 0.6 });
                  drawZelie(pw * 0.68, ph * 0.84, 17, { eyes: 'open', mouth: 'smile', lookX: -0.6 });
                },
                lettering: {
                  captions: [{ text: 'TIME OUT', x: 0.5, y: 24, size: 32, align: 'center', fill: '#FFF1A8' }],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p7_lets_talk',
                weight: 0.9,
                cast: ['eve', 'zelie'],
                prompt: 'In Time Out, Zelie Pink Lemonade turns to Eve Earth with a warm bright smile inviting him to chat, and Eve beams happily back.',
                draw(pw, ph) {
                  drawTimeoutBg(pw, ph);
                  drawEve(pw * 0.34, ph * 0.84, 19, { eyes: 'happy', mouth: 'grin', lookX: 0.7 });
                  drawZelie(pw * 0.68, ph * 0.84, 18, { eyes: 'happy', mouth: 'laugh', lookX: -0.7 });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'Zelie', text: "Hey Eve Earth, let's talk!", cx: 0.64, cy: 0.18, tx: 0.68, ty: 0.46, size: 23, maxW: 270 },
                    { speaker: 'Eve', text: 'Ok! Yeah!', cx: 0.30, cy: 0.36, tx: 0.34, ty: 0.56, size: 23, maxW: 180 },
                  ],
                },
              },
              {
                id: 'p7_spying_dads',
                weight: 1.1,
                cast: ['eve', 'zelie', 'eve_dad', 'zelie_papa'],
                prompt: 'One hour later: Eve Earth and Zelie Pink Lemonade sit laughing together happily in the middle while Eve\'s Dad peeks around the left wall and Zelie\'s Papa peeks around the right wall smiling warmly.',
                draw(pw, ph) {
                  drawTimeoutBg(pw, ph);
                  // Kids laughing happily in the center
                  drawEve(pw * 0.42, ph * 0.85, 16, { eyes: 'happy', mouth: 'laugh' });
                  drawZelie(pw * 0.60, ph * 0.85, 15.5, { eyes: 'happy', mouth: 'laugh' });
                  // Eve's Dad peeking happily from the left edge
                  drawEveDad(pw * 0.08, ph * 0.84, 18.5, { eyes: 'happy', mouth: 'grin', rot: 0.24, noShadow: true });
                  // Zelie's Papa peeking happily from the right edge
                  drawZeliePapa(pw * 0.93, ph * 0.84, 18.5, { eyes: 'happy', mouth: 'grin', rot: -0.24, noShadow: true });
                },
                lettering: {
                  captions: [{ text: '1 HOUR LATER', x: -16, y: 14, size: 22, align: 'right', fill: '#FFF1A8' }],
                  bubbles: [
                    { speaker: 'Papa', text: 'Should we tell them time out is over?', cx: 0.71, cy: 0.17, tx: 0.87, ty: 0.46, size: 20, maxW: 280 },
                    { speaker: 'Dad', text: "Nah — plus now they're friends!", cx: 0.30, cy: 0.32, tx: 0.14, ty: 0.52, size: 21, maxW: 260 },
                  ],
                  sfx: [{ text: 'HA HA HA', x: 0.52, y: 0.54, size: 32, rot: -0.05, fill: '#FF7EA5' }],
                },
              },
            ],
          },
          {
            weight: 0.95,
            panels: [
              {
                id: 'p7_the_end',
                weight: 1.05,
                cast: [],
                prompt: 'Warm pastel cream storybook ending card with delicate corner stars and soft golden glow, ready for "The End" lettering.',
                draw(pw, ph) {
                  X.fillStyle = linGrad(0, 0, 0, ph, [[0, '#FFF9EB'], [1, '#FCECC8']]);
                  X.fillRect(0, 0, pw, ph);
                  for (const [sx, sy] of [[0.14, 0.22], [0.86, 0.22], [0.16, 0.78], [0.84, 0.78]]) {
                    shape(starPts(pw * sx, ph * sy, 18, 0.38, 5), { fill: '#FFE066', stroke: INK, lwPx: 2.5 });
                  }
                },
                lettering: {
                  sfx: [{ text: 'THE END', x: 0.50, y: 0.50, size: 112, rot: -0.03, fill: '#7AC3EB', outline: '#FFFDF8' }],
                },
              },
              {
                id: 'p7_or_is_it',
                weight: 0.95,
                cast: [],
                prompt: 'Dramatic shadowy cliffhanger panel: deep midnight background with a pair of glowing crimson slanted mischievous eyes and a cheeky red grin peering out of the dark.',
                draw(pw, ph) {
                  X.fillStyle = linGrad(0, 0, 0, ph, [[0, '#1A1324'], [1, '#0E0A16']]);
                  X.fillRect(0, 0, pw, ph);
                  const cx = pw * 0.5, cy = ph * 0.40;
                  // Slanted glowing red eyes (matching Jenna's spooky cliffhanger!)
                  shape([[cx - 130, cy - 42], [cx - 32, cy + 16], [cx - 72, cy + 32], [cx - 126, cy - 6]], {
                    fill: '#E5483B', stroke: '#FFB4A2', lwPx: 3.5, smooth: 0.3,
                  });
                  shape([[cx + 130, cy - 42], [cx + 32, cy + 16], [cx + 72, cy + 32], [cx + 126, cy - 6]], {
                    fill: '#E5483B', stroke: '#FFB4A2', lwPx: 3.5, smooth: 0.3,
                  });
                  // Cheeky crimson shield-like grin below
                  shape([[cx - 38, cy + 88], [cx + 38, cy + 88], [cx + 34, cy + 132], [cx, cy + 152], [cx - 34, cy + 132]], {
                    fill: '#D93B30', stroke: '#FFB4A2', lwPx: 3.5, smooth: 0.35,
                  });
                },
                lettering: {
                  captions: [
                    { text: '...or is it?', x: -24, y: -66, size: 32, align: 'right', fill: '#2B1F36', color: '#FFE066', borderWidth: 3 },
                  ],
                },
              },
            ],
          },
        ],
      },

      // =========================================================================
      // PAGE 8 — EPILOGUE PUNCHLINE (Drawing 2 — "Just Kidding, It's The End!")
      // =========================================================================
      {
        id: 'page-08',
        masthead: {
          title: 'PALM PALS ADVENTURES',
          subtitle: 'Page 8 · Epilogue',
          titleSize: 38,
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p8_just_kidding',
                weight: 1,
                cast: ['eve', 'zelie'],
                prompt: 'Joyful full-page storybook epilogue splash on a warm pastel sky-to-cream background with floating confetti and golden doodles: Eve Earth and Zelie Pink Lemonade stand smiling warmly side-by-side beneath a vibrant multicolored rainbow heart.',
                draw(pw, ph) {
                  X.fillStyle = linGrad(0, 0, 0, ph, [[0, '#FFF8EE'], [0.55, '#FFFDF9'], [1, '#FDEFF5']]);
                  X.fillRect(0, 0, pw, ph);

                  // Soft celebratory backdrop glow behind the two best friends
                  ellipse(pw * 0.5, ph * 0.62, 540, 320, { fill: 'rgba(182, 232, 255, 0.25)', stroke: null });

                  // Playful golden celebratory squiggle flourish near bottom (nod to Jenna's yellow marker flourish!)
                  line([
                    [pw * 0.26, ph * 0.84], [pw * 0.72, ph * 0.82],
                    [pw * 0.30, ph * 0.87], [pw * 0.70, ph * 0.86],
                    [pw * 0.36, ph * 0.90], [pw * 0.66, ph * 0.89],
                  ], { stroke: 'rgba(245, 200, 66, 0.55)', lwPx: 10, smooth: true });

                  // Sparkles & confetti
                  const stars = [[0.14, 0.22], [0.86, 0.20], [0.12, 0.58], [0.88, 0.56], [0.22, 0.86], [0.80, 0.85]];
                  stars.forEach(([sx, sy], i) => {
                    shape(starPts(pw * sx, ph * sy, 18, 0.38, 5), {
                      fill: i % 2 === 0 ? '#FFE066' : '#FF9EBB', stroke: INK, lwPx: 2.5,
                    });
                  });

                  // Vibrant rainbow heart floating between Eve Earth and Zelie!
                  drawRainbowHeart(pw * 0.51, ph * 0.46, 70);

                  // Eve Earth & Zelie Pink Lemonade best-friends portrait
                  drawEve(pw * 0.35, ph * 0.72, 34, { eyes: 'happy', mouth: 'smile', armR: -0.45, armL: 0.45 });
                  drawZelie(pw * 0.66, ph * 0.73, 31, { eyes: 'happy', mouth: 'smile', armL: 0.45, armR: -0.45 });
                },
                lettering: {
                  sfx: [
                    { text: 'JUST KIDDING!', x: 0.50, y: 0.11, size: 108, rot: -0.02, fill: '#FF7EA5', outline: '#FFFDF8' },
                    { text: 'THE END', x: 0.50, y: 0.27, size: 118, rot: 0.015, fill: '#7AC3EB', outline: '#FFFDF8' },
                  ],
                  captions: [
                    { text: "IT'S THE END, SO...", x: 0.50, y: 0.175, size: 32, align: 'center', fill: '#FFF1A8' },
                    { text: 'EVE EARTH AND ZELIE', x: 0.50, y: 0.77, size: 36, align: 'center', fill: '#E8F7FF' },
                    { text: 'By Jenna Safadi  ·  جنى صفدي', x: 0.50, y: -76, size: 30, align: 'center', fill: '#FFE2EC' },
                  ],
                  bubbles: [
                    { speaker: 'Eve', text: 'The.', cx: 0.36, cy: 0.45, tx: 0.36, ty: 0.54, size: 30, maxW: 160 },
                    { speaker: 'Zelie', text: 'end.', cx: 0.65, cy: 0.45, tx: 0.65, ty: 0.53, size: 30, maxW: 160 },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  });
})();
