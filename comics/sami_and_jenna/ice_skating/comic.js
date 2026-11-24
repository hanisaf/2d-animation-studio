// comics/sami_and_jenna/ice_skating/comic.js
// Code-rendered 9-panel comic page built with Safadi Animation Studio rigs (sami.js, jenna.js, engine/core.js, engine/comic.js).
// Registers itself via comic({...}) with clean art (`draw`) vs declarative `lettering` separation.

(() => {
  const INK = COMIC_INK;

  // ---------- Character gear & prop helpers ----------

  // Draw Fafy standalone using Jenna's canonical jeGiraffe rig
  function drawFafyStandalone(x, y, s, opts = {}) {
    const lw = clamp(s * 0.12, 1.2, 4.0) / s;
    X.save();
    X.translate(x, y);
    if (!opts.noShadow) {
      ellipse(0, 2, s * 1.45, s * 0.35, { fill: 'rgba(40, 20, 30, 0.2)', stroke: null });
    }
    X.scale(s * (opts.flip ? -1 : 1), s);
    X.translate(0, -4.2); // lift so hooves touch y=0
    if (opts.rot) X.rotate(opts.rot);
    withBoil(0, () => {
      jeGiraffe(lw, false);
    });
    X.restore();
  }

  // Draw white figure skates on Jenna's feet anchors or black skates on Sami's feet
  function drawIceSkate(ax, ay, scale, sd, style = 'white') {
    X.save();
    X.translate(ax, ay);
    X.scale(scale * sd, scale);
    const bootFill = style === 'white' ? '#FFFFFF' : '#2D3440';
    const bootShade = style === 'white' ? '#DCE7F2' : '#1E232B';
    const soleFill = style === 'white' ? '#C79B74' : '#4E5869';
    const laceCol = style === 'white' ? '#E48FB0' : '#DCE4EF';
    const lw = 0.2;

    shape([[-1.1, 0.95], [1.45, 0.95], [1.65, 0.65], [1.5, 0.72], [1.25, 0.8], [-1.05, 0.8]], {
      fill: '#D8E6F2', stroke: INK, lw: lw * 0.85,
    });
    line([[-0.6, 0.45], [-0.6, 0.85]], { stroke: INK, lw: 0.26 });
    line([[0.75, 0.45], [0.75, 0.85]], { stroke: INK, lw: 0.26 });

    shape([
      [-0.95, -1.55], [0.15, -1.55], [0.45, -0.55], [1.25, -0.25],
      [1.38, 0.25], [1.1, 0.5], [-0.95, 0.5], [-1.05, -0.5],
    ], { fill: bootFill, stroke: INK, lw, smooth: 0.35 });

    shape([[-0.9, -1.45], [0.1, -1.45], [0.15, -1.0], [-0.92, -1.0]], { fill: bootShade, stroke: null });
    shape([[-1.0, 0.25], [1.32, 0.25], [1.15, 0.52], [-0.95, 0.52]], { fill: soleFill, stroke: INK, lw: lw * 0.75 });
    line([[0.05, -1.2], [0.45, -1.1]], { stroke: laceCol, lw: 0.16 });
    line([[0.15, -0.85], [0.55, -0.75]], { stroke: laceCol, lw: 0.16 });
    line([[0.32, -0.5], [0.72, -0.4]], { stroke: laceCol, lw: 0.16 });
    X.restore();
  }

  // Draw Jenna's cozy pastel teal-and-pink zip-up winter jacket hanging on a hook
  function drawWinterJacketProp(x, y, s) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);
    const jFill = '#6CC2D4', jDk = '#4BA1B5', trim = '#F49BB8', lw = 0.2;
    shape([[-2.4, -3.0], [-4.8, -0.2], [-4.1, 0.9], [-2.0, -1.3]], { fill: jFill, stroke: INK, lw, smooth: 0.3 });
    shape([[2.4, -3.0], [4.8, -0.2], [4.1, 0.9], [2.0, -1.3]], { fill: jFill, stroke: INK, lw, smooth: 0.3 });
    shape([[-4.8, -0.2], [-4.1, 0.9], [-3.7, 0.45], [-4.4, -0.6]], { fill: trim, stroke: INK, lw: lw * 0.8 });
    shape([[4.8, -0.2], [4.1, 0.9], [3.7, 0.45], [4.4, -0.6]], { fill: trim, stroke: INK, lw: lw * 0.8 });
    shape([[-2.5, -3.3], [2.5, -3.3], [2.8, 2.3], [-2.8, 2.3]], { fill: jFill, stroke: INK, lw, smooth: 0.25 });
    shape([[-1.6, -3.3], [0, -4.1], [1.6, -3.3], [1.1, -2.5], [0, -2.8], [-1.1, -2.5]], { fill: trim, stroke: INK, lw, smooth: 0.35 });
    line([[0, -2.7], [0, 2.25]], { stroke: INK, lw: 0.16 });
    circle(0, -1.9, 0.25, { fill: '#FFE066', stroke: INK, lw: 0.12 });
    shape([[-2.1, 0.2], [-0.7, 0.2], [-0.7, 1.5], [-2.1, 1.5]], { fill: jDk, stroke: INK, lw: 0.14, smooth: 0.2 });
    shape([[0.7, 0.2], [2.1, 0.2], [2.1, 1.5], [0.7, 1.5]], { fill: jDk, stroke: INK, lw: 0.14, smooth: 0.2 });
    shape([[-2.8, 1.85], [2.8, 1.85], [2.8, 2.45], [-2.8, 2.45]], { fill: trim, stroke: INK, lw: 0.16 });
    X.restore();
  }

  // Draw Jenna with optional winter jacket, snow pants, skating helmet, and white figure skates
  function drawJennaWithGear(x, y, s, opts = {}) {
    const scale = s * JENNA_SCALE;
    const flip = opts.flip ? -1 : 1;
    const air = opts.jump || 0;
    const hipY = -10.0 + (opts.dy || 0);
    const lean = opts.lean || 0;
    const cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];
    const lw = clamp(scale * 0.12, 1.2, 4.5) / scale;
    const wearPants = opts.pants ?? !!opts.skates;

    let A = {};
    if (wearPants && opts.jacket) {
      const pantsFill = '#7E5E8C', pantsDk = '#5E426B';
      const jFill = '#6CC2D4', jDk = '#4BA1B5', trim = '#F49BB8';
      X.save();
      X.translate(x, y);
      X.scale(scale * flip, scale);
      if (!opts.noShadow) {
        const f = 1 - clamp(air / 14) * 0.55;
        ellipse(0, 0.12, 3.2 * f, 0.6 * f, { fill: 'rgba(40,20,30,.28)', stroke: null });
      }
      X.translate(0, -air);
      if (opts.sq) X.scale(1 + opts.sq * 0.55, 1 - opts.sq);

      withBoil(0, () => {
        [[-1, opts.footL || [-1.25, -0.65]], [1, opts.footR || [1.25, -0.65]]].forEach(([sd, f]) => {
          const hp = tl(sd * 1.15, 0.2);
          const { joint, end } = ik2(hp, f, 4.75, 4.75, [sd * 0.15, 1]);
          jeLimb([hp, joint, end], 2.05, pantsFill, lw);
          line([[lerp(hp[0], joint[0], 0.15) + sd * 0.3, lerp(hp[1], joint[1], 0.15)], [joint[0] + sd * 0.25, joint[1]], [end[0] + sd * 0.2, end[1] - 0.4]], { stroke: pantsDk, lw: lw * 0.75 });
          line([[joint[0] - 0.7, joint[1]], [joint[0] + 0.7, joint[1]]], { stroke: pantsDk, lw: lw * 0.6 });
          A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
        });

        X.save();
        X.translate(0, hipY);
        X.rotate(lean);
        shape([[-2.55, -0.4], [2.55, -0.4], [2.75, 1.5], [0, 1.85], [-2.75, 1.5]], { fill: pantsFill, stroke: JE.ink, lw, smooth: 0.25 });
        shape([[-0.95, -8.3], [0.95, -8.3], [1.15, -6.7], [0, -6.3], [-1.15, -6.7]], { fill: JE.skin, stroke: JE.ink, lw, smooth: 0.4 });
        shape([[-0.95, -8.3], [0.95, -8.3], [0.9, -7.5], [0, -7.15]], { fill: JE.skinDk, stroke: null, smooth: 0.4 });
        const jBody = [
          [-2.9, -6.5], [-1.3, -7.1], [0, -6.7], [1.3, -7.1], [2.9, -6.5],
          [3.35, -3.0], [3.5, 0.3], [0, 0.55], [-3.5, 0.3], [-3.35, -3.0],
        ];
        shape(jBody, { fill: jFill, stroke: INK, lw, smooth: 0.35 });
        line([[-3.05, -4.4], [3.05, -4.4]], { stroke: jDk, lw: lw * 0.65 });
        line([[-3.25, -2.1], [3.25, -2.1]], { stroke: jDk, lw: lw * 0.65 });
        shape([[-1.6, -7.1], [0, -6.5], [1.6, -7.1], [1.35, -6.0], [0, -5.65], [-1.35, -6.0]], { fill: trim, stroke: INK, lw: lw * 0.9, smooth: 0.35 });
        shape([[-3.45, -0.3], [3.45, -0.3], [3.5, 0.5], [-3.5, 0.5]], { fill: trim, stroke: INK, lw: lw * 0.85, smooth: 0.2 });
        line([[0, -5.75], [0, 0.45]], { stroke: INK, lw: lw * 0.95 });
        circle(0.15, -4.9, 0.34, { fill: '#FFE066', stroke: INK, lw: lw * 0.65 });
        shape([[-2.65, -1.8], [-1.05, -1.8], [-1.05, -0.55], [-2.65, -0.55]], { fill: jDk, stroke: INK, lw: lw * 0.65, smooth: 0.25 });
        shape([[1.05, -1.8], [2.65, -1.8], [2.65, -0.55], [1.05, -0.55]], { fill: jDk, stroke: INK, lw: lw * 0.65, smooth: 0.25 });
        A.chest = toPx(0, -5.5);
        A.belly = toPx(0, -2);
        X.restore();

        const hasGiraffe = opts.giraffe !== false;
        const armSpecs = [
          [-1, opts.handL || tl(hasGiraffe ? -1.6 : -2.65, hasGiraffe ? -3.4 : -1.1), opts.handPoseL || (hasGiraffe ? 'grip' : 'hip')],
          [1, opts.handR || tl(2.65, -1.1), opts.handPoseR || 'hip'],
        ];
        armSpecs.forEach(([sd, tg, pose]) => {
          const sh = tl(sd * 3.0, -6.3);
          const { joint, end } = ik2(sh, tg, 3.5, 3.5, [sd * 1, 0.5]);
          const wrist = mixPt(joint, end, 0.86);
          line([sh, joint, wrist], { stroke: INK, lw: 1.9 + lw * 2, lineCap: 'round', lineJoin: 'round' });
          line([sh, joint, wrist], { stroke: jFill, lw: 1.9, lineCap: 'round', lineJoin: 'round' });
          const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
          circle(wrist[0], wrist[1], 0.98, { fill: trim, stroke: INK, lw: lw * 0.8 });
          if (sd < 0 && hasGiraffe) {
            X.save();
            X.translate(end[0] + 0.3, end[1]);
            X.rotate(lean);
            jeGiraffe(lw, false);
            X.restore();
            jeHand(end, 0, sd, 'grip', lw);
          } else {
            jeHand(end, ang, sd, pose, lw);
          }
          A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang) * 0.5, end[1] + Math.sin(ang) * 0.5);
        });

        X.save();
        X.translate(0, hipY);
        X.rotate(lean);
        X.translate(0, -6.0);
        X.rotate(opts.tilt || 0);
        X.translate(0, -6.35);
        X.scale(1.25, 1.25);
        jeHead(opts, 0, lw, A, opts.hairSwing || 0);
        A.top = toPx(0, -4.6);
        X.restore();
      });
      X.restore();
    } else {
      A = jenna(x, y, s, { ...opts, boil: 0 });

      if (opts.jacket) {
        const jFill = '#6CC2D4', jDk = '#4BA1B5', trim = '#F49BB8';
        X.save();
        X.translate(x, y);
        X.scale(scale * flip, scale);
        X.translate(0, -air);
        if (opts.sq) X.scale(1 + opts.sq * 0.55, 1 - opts.sq);

        X.save();
        X.translate(0, hipY);
        X.rotate(lean);
        const jBody = [
          [-2.9, -6.5], [-1.3, -7.1], [0, -6.7], [1.3, -7.1], [2.9, -6.5],
          [3.35, -3.0], [3.5, 0.3], [0, 0.55], [-3.5, 0.3], [-3.35, -3.0],
        ];
        shape(jBody, { fill: jFill, stroke: INK, lw, smooth: 0.35 });
        line([[-3.05, -4.4], [3.05, -4.4]], { stroke: jDk, lw: lw * 0.65 });
        line([[-3.25, -2.1], [3.25, -2.1]], { stroke: jDk, lw: lw * 0.65 });
        shape([[-1.6, -7.1], [0, -6.5], [1.6, -7.1], [1.35, -6.0], [0, -5.65], [-1.35, -6.0]], { fill: trim, stroke: INK, lw: lw * 0.9, smooth: 0.35 });
        shape([[-3.45, -0.3], [3.45, -0.3], [3.5, 0.5], [-3.5, 0.5]], { fill: trim, stroke: INK, lw: lw * 0.85, smooth: 0.2 });
        line([[0, -5.75], [0, 0.45]], { stroke: INK, lw: lw * 0.95 });
        circle(0.15, -4.9, 0.34, { fill: '#FFE066', stroke: INK, lw: lw * 0.65 });
        shape([[-2.65, -1.8], [-1.05, -1.8], [-1.05, -0.55], [-2.65, -0.55]], { fill: jDk, stroke: INK, lw: lw * 0.65, smooth: 0.25 });
        shape([[1.05, -1.8], [2.65, -1.8], [2.65, -0.55], [1.05, -0.55]], { fill: jDk, stroke: INK, lw: lw * 0.65, smooth: 0.25 });
        X.restore();

        const hasGiraffe = opts.giraffe !== false;
        const armSpecs = [
          [-1, opts.handL || tl(hasGiraffe ? -1.6 : -2.65, hasGiraffe ? -3.4 : -1.1), opts.handPoseL || (hasGiraffe ? 'grip' : 'hip')],
          [1, opts.handR || tl(2.65, -1.1), opts.handPoseR || 'hip'],
        ];
        armSpecs.forEach(([sd, tg, pose]) => {
          const sh = tl(sd * 3.0, -6.3);
          const { joint, end } = ik2(sh, tg, 3.5, 3.5, [sd * 1, 0.5]);
          const wrist = mixPt(joint, end, 0.86);
          line([sh, joint, wrist], { stroke: INK, lw: 1.9 + lw * 2, lineCap: 'round', lineJoin: 'round' });
          line([sh, joint, wrist], { stroke: jFill, lw: 1.9, lineCap: 'round', lineJoin: 'round' });
          const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
          circle(wrist[0], wrist[1], 0.98, { fill: trim, stroke: INK, lw: lw * 0.8 });
          if (sd < 0 && hasGiraffe) {
            X.save();
            X.translate(end[0] + 0.3, end[1]);
            X.rotate(lean);
            jeGiraffe(lw, false);
            X.restore();
            jeHand(end, 0, sd, 'grip', lw);
          } else {
            jeHand(end, ang, sd, pose, lw);
          }
        });

        X.save();
        X.translate(0, hipY);
        X.rotate(lean);
        X.translate(0, -6.0);
        X.rotate(opts.tilt || 0);
        X.translate(0, -6.35);
        X.scale(1.25, 1.25);
        jeHead(opts, 0, lw, A, opts.hairSwing || 0);
        X.restore();

        X.restore();
      }
    }

    if (opts.helmet) {
      const hlw = clamp(scale * 0.12, 1.2, 4.2) / scale;
      X.save();
      X.translate(x, y);
      X.scale(scale * flip, scale);
      X.translate(0, -air);
      if (opts.sq) X.scale(1 + opts.sq * 0.55, 1 - opts.sq);
      X.translate(0, hipY);
      X.rotate(lean);
      X.translate(0, -6.0);
      X.rotate(opts.tilt || 0);
      X.translate(0, -5.6);
      X.scale(1.25, 1.25);

      line([[-2.65, 0.6], [-2.15, 2.75], [0, 3.55], [2.15, 2.75], [2.65, 0.6]], {
        stroke: '#E48FB0', lw: 0.25, smooth: 0.6,
      });

      const shell = [
        [-3.55, 0.1], [-3.75, -1.65], [-3.0, -3.35], [-1.3, -4.4],
        [0.1, -4.6], [1.6, -4.3], [3.15, -3.2], [3.75, -1.55],
        [3.55, 0.15], [2.5, -0.95], [0, -1.35], [-2.5, -0.95],
      ];
      shape(shell, { fill: '#F7C6DF', stroke: INK, lw: hlw * 0.9, smooth: 0.45 });
      shape([[-2.1, -3.05], [-0.4, -3.85], [1.3, -3.45], [0.6, -2.75], [-1.4, -2.55]], {
        fill: 'rgba(255, 255, 255, 0.55)', stroke: null, smooth: 0.5,
      });
      shape([[-1.85, -2.9], [-0.7, -3.2], [-0.85, -2.3], [-1.95, -2.15]], { fill: '#A8DCEB', stroke: INK, lw: hlw * 0.55, smooth: 0.3 });
      shape([[0.55, -3.15], [1.75, -2.8], [1.8, -2.05], [0.7, -2.25]], { fill: '#A8DCEB', stroke: INK, lw: hlw * 0.55, smooth: 0.3 });
      shape(starPts(0, -2.0, 0.55, 0.45, 5), { fill: '#FFE26A', stroke: INK, lw: hlw * 0.45 });
      line([[-3.45, -0.05], [-2.4, -0.95], [0, -1.32], [2.4, -0.95], [3.45, -0.05]], {
        stroke: '#E07FA9', lw: 0.32, smooth: 0.5,
      });
      X.restore();
    }

    const localA = {};
    for (const [k, v] of Object.entries(A)) localA[k] = toPanelLocal(v);

    if (opts.skates && localA.footL && localA.footR) {
      drawIceSkate(localA.footL[0], localA.footL[1] + scale * 0.15, scale * 1.05, -1 * flip, 'white');
      drawIceSkate(localA.footR[0], localA.footR[1] + scale * 0.15, scale * 1.05, 1 * flip, 'white');
    }

    return localA;
  }

  // Draw Dr. Sami with optional ice skates and winter skating gear
  function drawSamiWithSkates(x, y, s, opts = {}) {
    const flip = opts.flip ? -1 : 1;
    const lw = clamp(s * 0.15, 1.6, 5.5) / s;
    const air = opts.jump || 0;
    const hipY = SM_HIP + (opts.dy || 0);
    const lean = opts.lean || 0;
    const cl = Math.cos(lean), sl = Math.sin(lean);
    const tl = (px, py) => [px * cl - py * sl, hipY + px * sl + py * cl];

    let A = {};
    if (opts.winterGear) {
      X.save();
      X.translate(x, y);
      X.scale(s * flip, s);
      if (!opts.noShadow) {
        const f = 1 - clamp(air / 22) * 0.55;
        ellipse(0, 0.15, 4.4 * f, 0.85 * f, { fill: 'rgba(40,20,30,.28)', stroke: null });
      }
      X.translate(0, -air);
      if (opts.rot) { X.translate(0, -12); X.rotate(opts.rot); X.translate(0, 12); }
      if (opts.sq) X.scale(1 + opts.sq * 0.55, 1 - opts.sq);

      withBoil(0, () => {
        const pants = '#3D4756', pantsDk = '#2B3340';
        const coat = '#375E8C', coatDk = '#27466B', coatLt = '#527FB2', cuff = '#2A3F59';

        [[-1, opts.footL || [-1.25, -0.8]], [1, opts.footR || [1.25, -0.8]]].forEach(([sd, f]) => {
          const hp = tl(sd * 1.15, -0.2);
          const { joint, end } = ik2(hp, f, 3.75, 3.7, [sd * 0.15, 0.1]);
          smLimb([hp, joint, end], 2.35, pants, lw);
          line([[lerp(hp[0], joint[0], 0.15) + sd * 0.25, lerp(hp[1], joint[1], 0.15)], [joint[0] + sd * 0.2, joint[1]], [end[0] + sd * 0.15, end[1] - 0.5]], { stroke: pantsDk, lw: lw * 0.85 });
          line([[joint[0] - 0.85, joint[1]], [joint[0] + 0.85, joint[1]]], { stroke: pantsDk, lw: lw * 0.65 });
        });

        X.save();
        X.translate(0, hipY);
        X.rotate(lean);
        const jBody = [
          [-3.25, -7.8], [-1.6, -8.6], [0, -8.2], [1.6, -8.6], [3.25, -7.8],
          [3.65, -4.0], [3.55, 0.45], [0, 0.75], [-3.55, 0.45], [-3.65, -4.0],
        ];
        shape(jBody, { fill: coat, stroke: SM.ink, lw, smooth: 0.35 });
        line([[-3.35, -5.6], [3.35, -5.6]], { stroke: coatDk, lw: lw * 0.75 });
        line([[-3.55, -3.1], [3.55, -3.1]], { stroke: coatDk, lw: lw * 0.75 });
        line([[-3.5, -0.8], [3.5, -0.8]], { stroke: coatDk, lw: lw * 0.75 });
        shape([[-1.85, -8.6], [0, -7.85], [1.85, -8.6], [1.6, -7.2], [0, -6.7], [-1.6, -7.2]], { fill: coatLt, stroke: SM.ink, lw: lw * 0.9, smooth: 0.3 });
        shape([[-3.5, -0.1], [3.5, -0.1], [3.55, 0.7], [-3.55, 0.7]], { fill: cuff, stroke: SM.ink, lw: lw * 0.85 });
        line([[0, -7.1], [0, 0.7]], { stroke: SM.ink, lw: lw * 1.0 });
        circle(0.18, -6.4, 0.3, { fill: '#E8EEF5', stroke: SM.ink, lw: lw * 0.6 });
        shape([[-2.85, -2.5], [-1.05, -2.5], [-1.05, -0.9], [-2.85, -0.9]], { fill: coatDk, stroke: SM.ink, lw: lw * 0.65, smooth: 0.25 });
        shape([[1.05, -2.5], [2.85, -2.5], [2.85, -0.9], [1.05, -0.9]], { fill: coatDk, stroke: SM.ink, lw: lw * 0.65, smooth: 0.25 });

        A.chest = toPx(0, -6.5);
        A.belly = toPx(0, -2.5);
        shape(rectPts(-0.75, -9.4, 1.5, 1.2), { fill: SM.skin, stroke: SM.ink, lw });

        X.save();
        X.translate(0, -8.9);
        X.rotate(opts.tilt || 0);
        X.scale(1.1, 1.1);
        X.translate(0, -5.55);
        smHead(opts, 0, lw, A);

        if (opts.helmet !== false) {
          line([[-3.65, 1.3], [-2.95, 4.25], [0, 5.55], [2.95, 4.25], [3.65, 1.3]], {
            stroke: '#27466B', lw: 0.34, smooth: 0.6,
          });
          const shell = [
            [-4.35, -1.2], [-4.55, -3.2], [-3.75, -5.25], [-1.85, -6.35],
            [0, -6.6], [1.85, -6.35], [3.75, -5.25], [4.55, -3.2],
            [4.35, -1.2], [3.1, -2.45], [0, -2.85], [-3.1, -2.45],
          ];
          shape(shell, { fill: '#4E7EB5', stroke: SM.ink, lw: lw * 0.95, smooth: 0.45 });
          shape([[-2.4, -4.95], [-0.4, -5.8], [1.8, -5.3], [1.0, -4.5], [-1.6, -4.3]], {
            fill: 'rgba(255, 255, 255, 0.42)', stroke: null, smooth: 0.5,
          });
          shape([[-2.45, -4.45], [-0.9, -4.8], [-1.05, -3.8], [-2.55, -3.65]], { fill: '#27466B', stroke: SM.ink, lw: lw * 0.55, smooth: 0.25 });
          shape([[0.9, -4.8], [2.45, -4.45], [2.55, -3.65], [1.05, -3.8]], { fill: '#27466B', stroke: SM.ink, lw: lw * 0.55, smooth: 0.25 });
          line([[-4.2, -1.35], [-3.0, -2.45], [0, -2.82], [3.0, -2.45], [4.2, -1.35]], {
            stroke: '#27466B', lw: 0.38, smooth: 0.5,
          });
        }
        X.restore();
        X.restore();

        [[-1, opts.handL || [-4.4, -8.1], opts.handPoseL || 'open'], [1, opts.handR || [4.4, -8.1], opts.handPoseR || 'open']].forEach(([sd, tg, pose]) => {
          const sh = tl(sd * 2.95, -7.2);
          const { joint, end } = ik2(sh, tg, 3.75, 3.45, [sd * 0.25, 1]);
          const ang = Math.atan2(end[1] - joint[1], end[0] - joint[0]);
          const wrist = mixPt(joint, end, 0.88);
          smLimb([sh, joint, wrist], 1.95, coat, lw);
          circle(wrist[0], wrist[1], 0.98, { fill: cuff, stroke: SM.ink, lw: lw * 0.85 });
          smHand(end, ang, sd, pose, lw, opts, 0);
          A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0] + Math.cos(ang) * 0.6, end[1] + Math.sin(ang) * 0.6);
        });
      });

      A.top = toPx(0, -30.5);
      X.restore();
      if (opts.emote && (opts.emoteK ?? 1) > 0.02) smEmote(opts.emote, A, s, opts.emoteK ?? 1, 0);
    } else {
      A = sami(x, y, s, { ...opts, boil: 0, breathe: false });
    }

    if (opts.skates) {
      const fL = opts.footL || [-1.25, -0.8];
      const fR = opts.footR || [1.25, -0.8];
      const fxL = x + fL[0] * s * flip;
      const fyL = y + (fL[1] - air) * s + s * 0.25;
      const fxR = x + fR[0] * s * flip;
      const fyR = y + (fR[1] - air) * s + s * 0.25;
      drawIceSkate(fxL, fyL, s * 1.18, -1 * flip, 'black');
      drawIceSkate(fxR, fyR, s * 1.18, 1 * flip, 'black');
    }

    const localA = {};
    for (const [k, v] of Object.entries(A)) localA[k] = toPanelLocal(v);
    return localA;
  }

  // Pet female goldfish in a round glass fishbowl on a wooden stand
  function drawFishbowl(x, y, s) {
    X.save();
    X.translate(x, y);
    X.scale(s, s);

    shape(rectPts(-26, 24, 52, 82), { fill: '#C99768', stroke: INK, lwPx: 3.5 });
    shape(rectPts(-32, 18, 64, 10), { fill: '#DFB081', stroke: INK, lwPx: 3.5 });
    shape(rectPts(-18, 38, 36, 22), { fill: '#B88454', stroke: INK, lwPx: 2.5 });
    circle(0, 49, 3.5, { fill: '#FFE27A', stroke: INK, lwPx: 2 });

    const bowlR = 31;
    const bowlCy = -9;
    circle(0, bowlCy, bowlR, { fill: 'rgba(182, 234, 252, 0.85)', stroke: INK, lwPx: 3.5 });
    X.save();
    X.beginPath();
    X.arc(0, bowlCy, bowlR - 2, 0, TAU);
    X.clip();
    const wg = linGrad(0, bowlCy - 20, 0, bowlCy + bowlR, [[0, '#C7EEFC'], [0.6, '#90D7F5'], [1, '#6AC4EB']]);
    X.fillStyle = wg;
    X.fillRect(-bowlR, bowlCy - 18, bowlR * 2, bowlR * 2);
    ellipse(0, bowlCy - 18, 28, 5, { fill: '#E5F7FF', stroke: '#6BBCE0', lwPx: 1.8 });

    const pebbles = [
      [-18, 18, 6, 4, '#F5A6B8'], [-9, 19, 6.5, 4.2, '#FFE07A'], [0, 20, 7, 4, '#A4D8F0'],
      [10, 19, 6, 4, '#F5B582'], [18, 17, 5.5, 3.8, '#C9B2EB'], [-13, 15, 5, 3.5, '#9EDB9E'], [7, 15, 5, 3.5, '#F5A6B8'],
    ];
    pebbles.forEach(([px, py, rx, ry, col]) => ellipse(px, py, rx, ry, { fill: col, stroke: INK, lwPx: 1.4 }));

    line([[-18, 16], [-21, 5], [-16, -5]], { stroke: '#4BA864', lwPx: 4, smooth: true });
    line([[18, 16], [22, 6], [17, -4]], { stroke: '#4BA864', lwPx: 3.8, smooth: true });
    ellipse(-19, 3, 4.5, 2.5, { fill: '#6CC982', stroke: null, rot: -0.5 });
    ellipse(20, 4, 4.5, 2.5, { fill: '#6CC982', stroke: null, rot: 0.5 });

    shape([[-10, -5], [-21, -13], [-24, -7], [-17, -4], [-23, 1], [-19, 6], [-10, -1]], {
      fill: '#FFB647', stroke: INK, lwPx: 2, smooth: 0.45,
    });
    shape([[-6, -11], [-2, -18], [5, -16], [7, -10]], { fill: '#FFB647', stroke: INK, lwPx: 1.9, smooth: 0.5 });
    shape([[-3, 3], [-6, 9], [1, 8], [3, 3]], { fill: '#FFB647', stroke: INK, lwPx: 1.8, smooth: 0.4 });
    ellipse(1, -4, 13.5, 9.5, { fill: '#FF9F38', stroke: INK, lwPx: 2.4 });
    ellipse(3, -1, 8.5, 4.8, { fill: '#FFD073', stroke: null });
    ellipse(-1, -1, 5, 2.8, { fill: '#FFC259', stroke: INK, lwPx: 1.6, rot: 0.35 });
    circle(8, -6.5, 4.2, { fill: '#FFFFFF', stroke: INK, lwPx: 1.8 });
    circle(8.8, -6.5, 2.6, { fill: INK, stroke: null });
    circle(9.7, -7.6, 1.05, { fill: '#FFFFFF', stroke: null });
    circle(7.8, -5.3, 0.55, { fill: '#FFFFFF', stroke: null });
    line([[5.8, -9.8], [4.5, -11.6]], { stroke: INK, lwPx: 1.6 });
    line([[7.8, -10.6], [7.5, -12.6]], { stroke: INK, lwPx: 1.6 });
    ellipse(6.5, -1.8, 2.7, 1.5, { fill: '#FF7FA0', stroke: null, alpha: 0.75 });
    line([[9.5, -1.5], [11.8, -0.6], [13.4, -2.0]], { stroke: INK, lwPx: 1.9, smooth: true });

    circle(15, -14, 2.8, { fill: '#FFFFFF', stroke: '#5AAED6', lwPx: 1.3 });
    circle(18, -21, 2.1, { fill: '#FFFFFF', stroke: '#5AAED6', lwPx: 1.2 });
    circle(14, -25, 1.4, { fill: '#FFFFFF', stroke: '#5AAED6', lwPx: 1.1 });
    X.restore();

    ellipse(0, bowlCy - bowlR + 4, 21, 4.5, { fill: 'rgba(235, 249, 255, 0.9)', stroke: INK, lwPx: 3 });
    line([[-22, -16], [-24, -4], [-20, 6]], { stroke: 'rgba(255,255,255,0.8)', lwPx: 3.5, smooth: true });
    shape(rectPts(-16, 16, 32, 4), { fill: '#DCEEF7', stroke: INK, lwPx: 2.5 });
    X.restore();
  }

  // ---------- Panel Backgrounds ----------

  function drawLivingRoomBg(pw, ph) {
    const wall = linGrad(0, 0, 0, ph * 0.72, [[0, '#FFF5E1'], [1, '#F8E4C1']]);
    X.fillStyle = wall;
    X.fillRect(0, 0, pw, ph * 0.74);

    X.fillStyle = '#F2DAB4';
    X.fillRect(0, ph * 0.56, pw, ph * 0.18);
    line([[0, ph * 0.56], [pw, ph * 0.56]], { stroke: '#D5B58A', lwPx: 3.5 });

    const wx = pw * 0.14, wy = ph * 0.14, ww = 190, wh = 145;
    shape(rectPts(wx, wy, ww, wh), { fill: '#BFE8FA', stroke: INK, lwPx: 4 });
    shape([[wx, wy + wh], [wx, wy + wh - 34], [wx + ww * 0.45, wy + wh - 46], [wx + ww, wy + wh - 28], [wx + ww, wy + wh]], {
      fill: '#FFFFFF', stroke: null, smooth: true,
    });
    line([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], { stroke: '#FFFDF8', lwPx: 8 });
    line([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], { stroke: '#FFFDF8', lwPx: 8 });
    shape(rectPts(wx, wy, ww, wh), { fill: null, stroke: INK, lwPx: 4 });
    shape([[wx - 22, wy - 8], [wx + 24, wy - 8], [wx + 12, wy + wh + 14], [wx - 26, wy + wh + 14]], { fill: '#F0A4B8', stroke: INK, lwPx: 3 });
    shape([[wx + ww - 24, wy - 8], [wx + ww + 22, wy - 8], [wx + ww + 26, wy + wh + 14], [wx + ww - 12, wy + wh + 14]], { fill: '#F0A4B8', stroke: INK, lwPx: 3 });

    shape(rectPts(pw * 0.84, ph * 0.15, 110, 84), { fill: '#E8C58E', stroke: INK, lwPx: 3.5 });
    shape(rectPts(pw * 0.84 + 10, ph * 0.15 + 10, 90, 64), { fill: '#C8E6F5', stroke: INK, lwPx: 2 });
    circle(pw * 0.84 + 72, ph * 0.15 + 28, 10, { fill: '#FFE26A', stroke: null });
    shape([[pw * 0.84 + 10, ph * 0.15 + 74], [pw * 0.84 + 42, ph * 0.15 + 42], [pw * 0.84 + 78, ph * 0.15 + 62], [pw * 0.84 + 100, ph * 0.15 + 74]], { fill: '#7CB87C', stroke: null });

    X.fillStyle = '#D9A773';
    X.fillRect(0, ph * 0.72, pw, ph * 0.28);
    X.fillStyle = '#FFFDF8';
    X.fillRect(0, ph * 0.71, pw, 12);
    line([[0, ph * 0.71], [pw, ph * 0.71]], { stroke: INK, lwPx: 3 });
    line([[0, ph * 0.735], [pw, ph * 0.735]], { stroke: INK, lwPx: 2.5 });
    for (let i = 1; i <= 3; i++) {
      const fy = ph * 0.735 + i * 28;
      line([[0, fy], [pw, fy]], { stroke: 'rgba(120, 74, 38, 0.22)', lwPx: 2 });
    }

    ellipse(pw * 0.48, ph * 0.87, pw * 0.34, 42, { fill: '#F5CAD6', stroke: '#DF9BB0', lwPx: 4 });
    ellipse(pw * 0.48, ph * 0.87, pw * 0.29, 32, { fill: '#FBE0E8', stroke: null });
  }

  function drawMudRoomBg(pw, ph) {
    X.fillStyle = '#E8F2EC';
    X.fillRect(0, 0, pw, ph * 0.76);
    X.fillStyle = '#FFFBF2';
    X.fillRect(0, ph * 0.42, pw, ph * 0.34);
    for (let x = 24; x < pw; x += 36) {
      line([[x, ph * 0.42], [x, ph * 0.76]], { stroke: 'rgba(130, 145, 138, 0.24)', lwPx: 2 });
    }
    shape(rectPts(0, ph * 0.38, pw, 18), { fill: '#D4A373', stroke: INK, lwPx: 3 });
    [pw * 0.2, pw * 0.44, pw * 0.68, pw * 0.86].forEach(hx => {
      circle(hx, ph * 0.41, 6, { fill: '#6E5A52', stroke: INK, lwPx: 2 });
    });
    shape([[pw * 0.83, ph * 0.41], [pw * 0.90, ph * 0.41], [pw * 0.93, ph * 0.60], [pw * 0.81, ph * 0.60]], {
      fill: '#E57A6B', stroke: INK, lwPx: 3, smooth: 0.2,
    });
    X.fillStyle = '#D7D2CA';
    X.fillRect(0, ph * 0.76, pw, ph * 0.24);
    line([[0, ph * 0.76], [pw, ph * 0.76]], { stroke: INK, lwPx: 3.5 });
    for (let x = 0; x < pw; x += 68) {
      line([[x, ph * 0.76], [x - 24, ph]], { stroke: 'rgba(90, 80, 74, 0.22)', lwPx: 2 });
    }
  }

  function drawDoorwayBg(pw, ph) {
    X.fillStyle = '#FCEFD9';
    X.fillRect(0, 0, pw, ph * 0.76);
    const dx = pw * 0.62, dy = ph * 0.14, dw = pw * 0.32, dh = ph * 0.62;
    shape(rectPts(dx, dy, dw, dh), { fill: '#9DD4F0', stroke: INK, lwPx: 4 });
    shape([[dx, dy + dh], [dx, dy + dh - 50], [dx + dw * 0.5, dy + dh - 64], [dx + dw, dy + dh - 44], [dx + dw, dy + dh]], {
      fill: '#FFFFFF', stroke: null, smooth: true,
    });
    shape([[dx + dw * 0.75, dy + dh - 130], [dx + dw * 0.56, dy + dh - 56], [dx + dw * 0.94, dy + dh - 56]], {
      fill: '#4C8C64', stroke: INK, lwPx: 2.5,
    });
    shape(rectPts(dx, dy, dw, dh), { fill: null, stroke: '#B88454', lwPx: 10 });
    shape(rectPts(dx, dy, dw, dh), { fill: null, stroke: INK, lwPx: 3.5 });

    X.fillStyle = '#D9A773';
    X.fillRect(0, ph * 0.76, pw, ph * 0.24);
    line([[0, ph * 0.76], [pw, ph * 0.76]], { stroke: INK, lwPx: 3.5 });
    shape([[pw * 0.58, ph * 0.80], [pw * 0.92, ph * 0.80], [pw * 0.95, ph * 0.92], [pw * 0.54, ph * 0.92]], {
      fill: '#B87C4C', stroke: INK, lwPx: 3,
    });
  }

  function drawTinySkater(x, y, s, coatCol, flip = false) {
    X.save();
    X.translate(x, y);
    X.scale(s * (flip ? -1 : 1), s);
    ellipse(0, 12, 10, 2.5, { fill: 'rgba(60, 100, 130, 0.2)', stroke: null });
    line([[-3, 2], [-7, 10]], { stroke: INK, lwPx: 3 });
    line([[3, 2], [8, 10]], { stroke: INK, lwPx: 3 });
    shape([[-6, -9], [6, -9], [7, 3], [-7, 3]], { fill: coatCol, stroke: INK, lwPx: 2.2, smooth: 0.2 });
    circle(0, -15, 6.5, { fill: '#F4C4A4', stroke: INK, lwPx: 2.2 });
    shape([[-7, -17], [0, -23], [7, -17]], { fill: '#E56B8B', stroke: INK, lwPx: 2 });
    X.restore();
  }

  function drawIceArenaBg(pw, ph, opts = {}) {
    const detailed = opts.detailed !== false;
    const horizon = ph * (opts.horizonFrac ?? 0.52);

    const topWall = linGrad(0, 0, 0, horizon, [[0, '#DCEAF5'], [1, '#EEF6FC']]);
    X.fillStyle = topWall;
    X.fillRect(0, 0, pw, horizon);

    for (let x = 90; x < pw; x += 260) {
      line([[x, 0], [x, horizon * 0.22]], { stroke: '#9EB4C7', lwPx: 3 });
      shape([[x - 24, horizon * 0.22], [x + 24, horizon * 0.22], [x + 32, horizon * 0.27], [x - 32, horizon * 0.27]], {
        fill: '#FFFBE0', stroke: INK, lwPx: 2.5,
      });
    }

    const glassTop = horizon - ph * 0.21;
    X.fillStyle = '#C9DFEE';
    X.fillRect(0, glassTop, pw, horizon - glassTop);
    for (let x = 0; x < pw; x += 155) {
      line([[x, glassTop], [x, horizon]], { stroke: 'rgba(255,255,255,0.65)', lwPx: 5 });
    }
    line([[0, glassTop], [pw, glassTop]], { stroke: '#8AA8C0', lwPx: 4 });

    if (detailed) {
      const sx = pw * 0.28, sy = glassTop + 14;
      circle(sx, sy, 16, { fill: '#F4C4A4', stroke: INK, lwPx: 2.8 });
      shape([[sx - 16, sy - 4], [sx, sy - 22], [sx + 16, sy - 4]], { fill: '#5B4034', stroke: INK, lwPx: 2.5, smooth: 0.4 });
      circle(sx - 5, sy - 2, 2, { fill: INK, stroke: null });
      circle(sx + 5, sy - 2, 2, { fill: INK, stroke: null });
      line([[sx - 5, sy + 5], [sx, sy + 9], [sx + 5, sy + 5]], { stroke: INK, lwPx: 2, smooth: true });
      line([[sx - 15, sy + 14], [sx - 26, sy - 4]], { stroke: '#E07A96', lwPx: 6 });
      line([[sx + 15, sy + 14], [sx + 26, sy - 4]], { stroke: '#E07A96', lwPx: 6 });

      const fx = pw * 0.50, fy = glassTop + 8, fw = 156, fh = horizon - glassTop - 8;
      shape(rectPts(fx, fy, fw, fh), { fill: '#FFF4DA', stroke: INK, lwPx: 3.5 });
      for (let i = 0; i < 6; i++) {
        shape(rectPts(fx + i * (fw / 6), fy, fw / 6, 22), {
          fill: i % 2 === 0 ? '#E85D68' : '#FFFFFF', stroke: INK, lwPx: 2,
        });
      }
      shape(rectPts(fx + 26, fy + 24, fw - 52, 26), { fill: '#FFE26A', stroke: INK, lwPx: 2.5 });
      X.save();
      X.font = `700 18px ${FONT_COMIC}`;
      X.fillStyle = INK;
      X.textAlign = 'center';
      X.textBaseline = 'middle';
      X.fillText('FOOD', fx + fw / 2, fy + 38);
      X.restore();
      shape(rectPts(fx + 16, fy + 56, fw - 32, fh - 60), { fill: '#7A5442', stroke: INK, lwPx: 2.5 });
      circle(fx + fw / 2, fy + 76, 11, { fill: '#F4C4A4', stroke: INK, lwPx: 2 });
      shape(rectPts(fx + fw / 2 - 12, fy + 87, 24, 16), { fill: '#5DA6D6', stroke: INK, lwPx: 2 });
      shape(rectPts(fx + 26, fy + 85, 11, 14), { fill: '#F49BB8', stroke: INK, lwPx: 1.8 });
      shape(rectPts(fx + fw - 37, fy + 85, 11, 14), { fill: '#79C99E', stroke: INK, lwPx: 1.8 });
    }

    const boardH = ph * 0.13;
    const iceTop = horizon + boardH;
    X.fillStyle = '#FFFFFF';
    X.fillRect(0, horizon, pw, boardH);
    X.fillStyle = '#3B82C4';
    X.fillRect(0, horizon, pw, 9);
    X.fillStyle = '#F7CF52';
    X.fillRect(0, iceTop - 11, pw, 11);
    line([[0, horizon], [pw, horizon]], { stroke: INK, lwPx: 3.5 });
    line([[0, iceTop], [pw, iceTop]], { stroke: INK, lwPx: 3.5 });

    if (detailed) {
      const mx = 22, my = horizon - 38, mw = 216, mh = 112;
      shape(rectPts(mx, my, mw, mh), { fill: '#EBF7FF', stroke: INK, lwPx: 4 });
      shape(rectPts(mx + 6, my + 6, mw - 12, mh - 12), { fill: null, stroke: '#3B82C4', lwPx: 2.5 });
      shape([[mx + 8, my + mh - 10], [mx + 60, my + mh - 24], [mx + 130, my + mh - 14], [mx + mw - 8, my + mh - 24], [mx + mw - 8, my + mh - 8], [mx + 8, my + mh - 8]], {
        fill: '#7CC6EE', stroke: null, smooth: true,
      });
      X.save();
      X.fillStyle = '#1E4C7A';
      X.textAlign = 'center';
      X.textBaseline = 'middle';
      X.font = `700 22px ${FONT_COMIC}`;
      X.fillText('MINNESOTA', mx + mw / 2, my + 34);
      X.font = `700 20px ${FONT_COMIC}`;
      X.fillStyle = '#2A72A8';
      X.fillText('10,000 LAKES', mx + mw / 2, my + 62);
      X.restore();
    }

    const iceGrad = linGrad(0, iceTop, 0, ph, [[0, '#D7F0FC'], [0.45, '#EBF8FF'], [1, '#CBEAF9']]);
    X.fillStyle = iceGrad;
    X.fillRect(0, iceTop, pw, ph - iceTop);

    line([[0, iceTop + (ph - iceTop) * 0.25], [pw, iceTop + (ph - iceTop) * 0.25]], {
      stroke: 'rgba(218, 72, 92, 0.22)', lwPx: 6,
    });
    ellipse(pw * 0.5, iceTop + (ph - iceTop) * 0.56, pw * 0.16, (ph - iceTop) * 0.22, {
      fill: null, stroke: 'rgba(65, 128, 210, 0.2)', lwPx: 5,
    });

    X.save();
    X.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    X.lineWidth = 18;
    for (let i = 0; i < 4; i++) {
      const sx = pw * (0.12 + i * 0.25);
      X.beginPath();
      X.moveTo(sx, iceTop + 12);
      X.lineTo(sx - 65, ph - 10);
      X.stroke();
    }
    X.restore();

    for (let i = 0; i < 6; i++) {
      const ax = pw * (0.1 + hash(i + 11) * 0.8);
      const ay = iceTop + 26 + hash(i + 23) * (ph - iceTop - 48);
      line([[ax - 45, ay], [ax, ay + 10], [ax + 50, ay - 6]], {
        stroke: 'rgba(255, 255, 255, 0.72)', lwPx: 2.2, smooth: true,
      });
    }

    if (detailed) {
      drawTinySkater(118, iceTop + 22, 1.35, '#8F7AE8', false);
      drawTinySkater(pw * 0.62, iceTop + 14, 0.9, '#F48FB1', false);
      drawTinySkater(pw * 0.66, iceTop + 18, 0.8, '#66BFA6', true);
    }
  }

  // ---------- Declarative Comic Definition ----------

  comic({
    width: 1700,
    height: 2200,
    paper: '#FFFDF7',
    margin: 52,
    gutter: 20,
    pages: [
      {
        id: 'page-01',
        masthead: {
          title: 'SAMI & JENNA: ICE SKATING ADVENTURE!',
          subtitle: 'Featuring Fafy the Giraffe · Based on Jenna’s Original Comic',
        },
        rows: [
          // ROW 1 — PANEL 1: AT HOME
          {
            height: 378,
            panels: [
              {
                id: 'p1_at_home',
                weight: 1,
                cast: ['sami', 'jenna'],
                prompt: 'Cozy warm family living room with snowy winter window and oval pastel rug; Jenna holds plush giraffe Fafy while Dr. Sami smiles warmly in his white coat.',
                draw(pw, ph) {
                  drawLivingRoomBg(pw, ph);
                  drawJennaWithGear(pw * 0.40, ph * 0.91, 7.6, {
                    giraffe: true,
                    eyes: 'happy',
                    mouth: 'grin',
                    brows: 'up',
                    lookX: 0.6,
                    handL: [-2.2, -13.2],
                    handR: [3.2, -12.8],
                    handPoseR: 'palm',
                  });
                  drawSamiWithSkates(pw * 0.60, ph * 0.92, 9.8, {
                    eyes: 'happy',
                    mouth: 'grin',
                    lookX: -0.6,
                    handL: [-5.4, -12.6],
                    handR: [5.0, -11.4],
                    handPoseL: 'palm',
                    handPoseR: 'open',
                  });
                },
                lettering: {
                  captions: [{ text: 'AT HOME', x: 14, y: 14, size: 22 }],
                  bubbles: [
                    { speaker: 'sami', text: 'Jenna, should we go on a walk?', cx: 0.82, cy: 0.23, tx: 0.621, ty: 0.391, size: 23, maxW: 310 },
                    { speaker: 'jenna', text: 'Yes! Can I bring Fafy?', cx: 0.20, cy: 0.29, tx: 0.382, ty: 0.472, size: 23, maxW: 250 },
                    { speaker: 'sami', text: 'Of course! Fafy is family.', cx: 0.82, cy: 0.59, tx: 0.623, ty: 0.439, size: 23, maxW: 280, tailCurve: -12 },
                    { speaker: 'jenna', text: 'Just wait, I need my jacket just in case I get cold!', cx: 0.18, cy: 0.68, tx: 0.380, ty: 0.520, size: 21, maxW: 300, tailCurve: -14 },
                  ],
                },
              },
            ],
          },

          // ROW 2 — PANELS 2, 3, 4: MUD ROOM · ZIP! · BYE FISHY / LET'S GO ICE SKATING!
          {
            height: 352,
            panels: [
              {
                id: 'p2_mud_room',
                width: 496,
                cast: ['jenna'],
                prompt: 'Cozy mint-walled mud room with coat hooks; Jenna reaches for her teal-and-pink winter jacket while plush giraffe Fafy sits waiting on the floor.',
                draw(pw, ph) {
                  drawMudRoomBg(pw, ph);
                  drawFafyStandalone(pw * 0.20, ph * 0.90, 15.0);
                  drawWinterJacketProp(pw * 0.78, ph * 0.53, 17);
                  drawJennaWithGear(pw * 0.49, ph * 0.91, 7.6, {
                    giraffe: false,
                    eyes: 'open',
                    mouth: 'smile',
                    lookX: 0.75,
                    lean: 0.08,
                    handL: [-2.8, -11.6],
                    handR: [5.0, -15.8],
                    handPoseR: 'open',
                  });
                },
                lettering: {
                  captions: [{ text: 'MUD ROOM', x: 14, y: 14, size: 20 }],
                },
              },
              {
                id: 'p3_zip_ready',
                width: 410,
                cast: ['jenna'],
                prompt: 'Jenna happily zipping up her teal-and-pink winter jacket in the mud room while holding Fafy.',
                draw(pw, ph) {
                  drawMudRoomBg(pw, ph);
                  drawJennaWithGear(pw * 0.40, ph * 0.91, 7.5, {
                    jacket: true,
                    giraffe: true,
                    eyes: 'happy',
                    mouth: 'grin',
                    brows: 'up',
                    handL: [-2.2, -13.0],
                    handR: [0.6, -13.2],
                    handPoseR: 'fist',
                  });
                },
                lettering: {
                  sfx: [{ text: 'ZIP!', x: 0.77, y: 0.56, size: 50, rot: -0.14, fill: '#FFD84D' }],
                  bubbles: [
                    { speaker: 'jenna', text: "I'm ready!", cx: 0.44, cy: 0.16, tx: 0.415, ty: 0.355, size: 24, maxW: 190 },
                  ],
                },
              },
              {
                id: 'p4_doorway',
                weight: 1,
                cast: ['sami', 'jenna'],
                prompt: 'Warm hallway doorway opening to snowy Minnesota yard; Jenna in winter jacket waves to a cute goldfish in a glass bowl while Dr. Sami points cheerfully outside.',
                draw(pw, ph) {
                  drawDoorwayBg(pw, ph);
                  drawFishbowl(pw * 0.12, ph * 0.65, 1.05);
                  drawJennaWithGear(pw * 0.34, ph * 0.91, 7.0, {
                    jacket: true,
                    giraffe: true,
                    eyes: 'happy',
                    mouth: 'smile',
                    lookX: -0.7,
                    handL: [-3.9, -15.8],
                    handR: [2.8, -12.0],
                  });
                  drawSamiWithSkates(pw * 0.58, ph * 0.92, 9.0, {
                    eyes: 'happy',
                    mouth: 'grin',
                    brows: 'up',
                    handL: [-4.4, -10.5],
                    handR: [5.6, -14.8],
                    handPoseR: 'point',
                  });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'jenna', text: 'Bye, fishy!', cx: 0.25, cy: 0.16, tx: 0.325, ty: 0.407, size: 22, maxW: 170 },
                    { speaker: 'sami', text: "Let's go ice skating!", cx: 0.785, cy: 0.23, tx: 0.629, ty: 0.396, size: 22, maxW: 190 },
                  ],
                },
              },
            ],
          },

          // ROW 3 — PANEL 5: ICE ARENA
          {
            height: 458,
            panels: [
              {
                id: 'p5_ice_arena',
                weight: 1,
                cast: ['sami', 'jenna'],
                prompt: 'Bright Minnesota indoor ice skating rink with 10,000 Lakes board sign, FOOD concession stand, cheering fan behind glass, Fafy plush watching, Jenna gliding confidently in pastel jacket and pink helmet, and Dr. Sami wobbling comically in navy puffer jacket and blue helmet.',
                draw(pw, ph) {
                  drawIceArenaBg(pw, ph, { detailed: true, horizonFrac: 0.44 });
                  drawFafyStandalone(pw * 0.21, ph * 0.78, 16.5);
                  line([[pw * 0.26, ph * 0.89], [pw * 0.34, ph * 0.91], [pw * 0.42, ph * 0.88]], {
                    stroke: '#FFFFFF', lwPx: 5, smooth: true,
                  });
                  drawJennaWithGear(pw * 0.41, ph * 0.84, 8.2, {
                    jacket: true,
                    helmet: true,
                    skates: true,
                    giraffe: false,
                    eyes: 'happy',
                    mouth: 'smile',
                    lookX: 0.75,
                    lean: 0.08,
                    footL: [-2.4, -0.7],
                    footR: [2.4, -0.5],
                    handL: [-4.6, -13.0],
                    handR: [5.4, -14.0],
                    handPoseR: 'palm',
                  });
                  drawSamiWithSkates(pw * 0.73, ph * 0.86, 10.0, {
                    winterGear: true,
                    helmet: true,
                    skates: true,
                    eyes: 'wide',
                    brows: 'worried',
                    mouth: 'wobble',
                    lean: -0.09,
                    tilt: 0.07,
                    footL: [-2.5, -0.6],
                    footR: [2.7, -0.5],
                    handL: [-6.4, -14.2],
                    handR: [6.4, -13.6],
                    handPoseL: 'open',
                    handPoseR: 'open',
                    emote: 'sweat',
                    emoteK: 1,
                  });
                  [
                    [[pw * 0.65, ph * 0.85], [pw * 0.64, ph * 0.88], [pw * 0.66, ph * 0.90]],
                    [[pw * 0.81, ph * 0.84], [pw * 0.82, ph * 0.87], [pw * 0.80, ph * 0.89]],
                    [[pw * 0.64, ph * 0.56], [pw * 0.63, ph * 0.60]],
                    [[pw * 0.82, ph * 0.57], [pw * 0.83, ph * 0.61]],
                  ].forEach(pts => line(pts, { stroke: INK, lwPx: 3.5, smooth: true }));
                },
                lettering: {
                  captions: [{ text: 'ICE ARENA', x: -16, y: -58, size: 22, align: 'right' }],
                  bubbles: [
                    { speaker: 'spectator', text: 'Woo!', cx: 0.35, cy: 0.15, tx: 0.295, ty: 0.24, size: 19, maxW: 90, padX: 14, padY: 8 },
                    { speaker: 'jenna', text: 'Woo!', cx: 0.295, cy: 0.45, tx: 0.396, ty: 0.457, size: 24, maxW: 110, padX: 18, padY: 10, tailCurve: 10 },
                    { speaker: 'jenna', text: "Don't worry, once you practice you will get the hang of it!", cx: 0.53, cy: 0.14, tx: 0.429, ty: 0.400, size: 22, maxW: 380 },
                    { speaker: 'sami', text: 'I feel wobbly!', cx: 0.89, cy: 0.34, tx: 0.746, ty: 0.421, size: 26, maxW: 190 },
                  ],
                },
              },
            ],
          },

          // ROW 4 — PANELS 6, 7, 8: JENNA'S TRICKS (Dip! · Jump! · Turn!)
          {
            height: 358,
            panels: [
              {
                id: 'p6_dip',
                weight: 1,
                cast: ['jenna'],
                prompt: 'Jenna gliding low in a playful crouching dip trick on glossy ice in winter jacket, snow pants, pink helmet, and white figure skates.',
                draw(pw, ph) {
                  drawIceArenaBg(pw, ph, { detailed: false, horizonFrac: 0.34 });
                  line([[pw * 0.14, ph * 0.87], [pw * 0.44, ph * 0.87]], { stroke: '#FFFFFF', lwPx: 5 });
                  line([[pw * 0.18, ph * 0.91], [pw * 0.48, ph * 0.91]], { stroke: '#FFFFFF', lwPx: 5 });
                  drawJennaWithGear(pw * 0.54, ph * 0.85, 8.8, {
                    jacket: true,
                    helmet: true,
                    skates: true,
                    giraffe: false,
                    dy: 3.4,
                    lean: 0.06,
                    eyes: 'happy',
                    mouth: 'smile',
                    footL: [-1.7, -0.6],
                    footR: [1.7, -0.6],
                    handL: [-2.2, -10.5],
                    handR: [2.2, -10.5],
                    handPoseL: 'fist',
                    handPoseR: 'fist',
                  });
                },
                lettering: {
                  sfx: [{ text: 'DIP!', x: 0.24, y: 0.16, size: 50, rot: -0.08, fill: '#6CC2D4' }],
                },
              },
              {
                id: 'p7_jump',
                weight: 1,
                cast: ['jenna'],
                prompt: 'Jenna leaping joyfully high off the ice in a star jump with motion lines and sparkles.',
                draw(pw, ph) {
                  drawIceArenaBg(pw, ph, { detailed: false, horizonFrac: 0.34 });
                  line([[pw * 0.28, ph * 0.86], [pw * 0.34, ph * 0.72]], { stroke: INK, lwPx: 4 });
                  line([[pw * 0.33, ph * 0.88], [pw * 0.38, ph * 0.75]], { stroke: INK, lwPx: 3.5 });
                  shape(starPts(pw * 0.80, ph * 0.24, 15, 0.45, 5), { fill: '#FFE26A', stroke: INK, lwPx: 2.5 });
                  shape(starPts(pw * 0.86, ph * 0.38, 10, 0.45, 5), { fill: '#A8DCEB', stroke: INK, lwPx: 2 });
                  drawJennaWithGear(pw * 0.54, ph * 0.85, 8.4, {
                    jacket: true,
                    helmet: true,
                    skates: true,
                    giraffe: false,
                    jump: 4.5,
                    eyes: 'happy',
                    mouth: 'grin',
                    brows: 'up',
                    footL: [-3.2, -1.6],
                    footR: [3.2, -1.6],
                    handL: [-5.8, -17.2],
                    handR: [5.8, -17.2],
                    handPoseL: 'palm',
                    handPoseR: 'palm',
                    hairSwing: -0.5,
                  });
                },
                lettering: {
                  sfx: [{ text: 'JUMP!', x: 0.25, y: 0.16, size: 50, rot: -0.09, fill: '#FF7EA5' }],
                },
              },
              {
                id: 'p8_turn',
                weight: 1,
                cast: ['jenna'],
                prompt: 'Jenna spinning gracefully on figure skates with curved swirl motion lines and a circular skate track carved in the ice.',
                draw(pw, ph) {
                  drawIceArenaBg(pw, ph, { detailed: false, horizonFrac: 0.34 });
                  ellipse(pw * 0.54, ph * 0.87, 94, 18, { fill: null, stroke: '#FFFFFF', lwPx: 5 });
                  line([[pw * 0.25, ph * 0.54], [pw * 0.22, ph * 0.62], [pw * 0.29, ph * 0.68]], { stroke: INK, lwPx: 4, smooth: true });
                  line([[pw * 0.29, ph * 0.57], [pw * 0.27, ph * 0.63], [pw * 0.32, ph * 0.66]], { stroke: INK, lwPx: 3, smooth: true });
                  line([[pw * 0.83, ph * 0.52], [pw * 0.86, ph * 0.60], [pw * 0.79, ph * 0.66]], { stroke: INK, lwPx: 4, smooth: true });
                  line([[pw * 0.79, ph * 0.55], [pw * 0.81, ph * 0.61], [pw * 0.76, ph * 0.64]], { stroke: INK, lwPx: 3, smooth: true });
                  drawJennaWithGear(pw * 0.54, ph * 0.85, 8.6, {
                    jacket: true,
                    helmet: true,
                    skates: true,
                    giraffe: false,
                    lean: -0.05,
                    hairSwing: 1.1,
                    eyes: 'happy',
                    mouth: 'smile',
                    footL: [-1.1, -0.5],
                    footR: [1.1, -0.7],
                    handL: [-2.4, -13.6],
                    handR: [2.4, -13.6],
                    handPoseL: 'fist',
                    handPoseR: 'fist',
                  });
                },
                lettering: {
                  sfx: [{ text: 'TURN!', x: 0.26, y: 0.16, size: 50, rot: -0.07, fill: '#FFB84D' }],
                },
              },
            ],
          },

          // ROW 5 — PANEL 9: FINALE
          {
            height: 404,
            panels: [
              {
                id: 'p9_finale',
                weight: 1,
                cast: ['sami', 'jenna'],
                prompt: 'Heartwarming finale on the ice rink: Dr. Sami gives a proud thumbs-up, Fafy stands in the center, and Jenna stops with a sparkly spray of ice shavings while encouraging her dad.',
                draw(pw, ph) {
                  drawIceArenaBg(pw, ph, { detailed: false, horizonFrac: 0.36 });
                  drawFafyStandalone(pw * 0.52, ph * 0.78, 13.5);
                  [
                    [pw * 0.23, ph * 0.18, 13, '#FFE26A'],
                    [pw * 0.67, ph * 0.18, 12, '#FFE26A'],
                    [pw * 0.95, ph * 0.52, 11, '#FF9EBB'],
                  ].forEach(([sx, sy, r, c]) => shape(starPts(sx, sy, r, 0.45, 5), { fill: c, stroke: INK, lwPx: 2.2 }));

                  drawSamiWithSkates(pw * 0.13, ph * 0.89, 9.8, {
                    winterGear: true,
                    helmet: true,
                    skates: true,
                    eyes: 'happy',
                    mouth: 'grin',
                    brows: 'up',
                    lookX: 0.6,
                    handL: [-5.4, -14.8],
                    handR: [5.4, -14.8],
                    handPoseL: 'palm',
                    handPoseR: 'thumb',
                  });

                  const sprayX = pw * 0.73, sprayY = ph * 0.88;
                  for (let i = 0; i < 6; i++) {
                    const ang = -0.35 - i * 0.24;
                    const dist = 28 + (i % 3) * 14;
                    line([[sprayX, sprayY], [sprayX - Math.cos(ang) * dist, sprayY + Math.sin(ang) * dist]], {
                      stroke: '#FFFFFF', lwPx: 4.5,
                    });
                    circle(sprayX - Math.cos(ang) * (dist + 7), sprayY + Math.sin(ang) * (dist + 7), 4.5, {
                      fill: '#FFFFFF', stroke: '#8CCCEB', lwPx: 1.8,
                    });
                  }

                  drawJennaWithGear(pw * 0.85, ph * 0.86, 8.2, {
                    jacket: true,
                    helmet: true,
                    skates: true,
                    giraffe: false,
                    dy: 1.8,
                    lean: -0.06,
                    eyes: 'happy',
                    mouth: 'grin',
                    lookX: -0.75,
                    footL: [-4.2, -0.5],
                    footR: [2.8, -0.6],
                    handL: [-5.0, -12.6],
                    handR: [4.8, -12.2],
                    handPoseL: 'palm',
                    handPoseR: 'open',
                  });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'sami', text: 'Good job Jenna, you rock! As for me, I am too old for these tricks...', cx: 0.43, cy: 0.27, tx: 0.154, ty: 0.410, size: 25, maxW: 480 },
                    { speaker: 'jenna', text: "You're not old! Try your best and you will get it!", cx: 0.83, cy: 0.20, tx: 0.843, ty: 0.400, size: 22, maxW: 320 },
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
