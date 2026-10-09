// characters/clawd/clawd.js: Clawd, the little clay-orange AI (a large language model), ported from PDoomVideo/src/clawd.js
// to this studio's flat-cartoon style. Description and look live in README.md.
//
// clawd(x, y, s, o) → anchors. (x, y) = floor point between his feet (screen px), s = px per local unit.
// Local units (as in PDoomVideo): the body block spans x −5…5, y −8…−2; four stubby legs reach y 0; two slit eyes at
// x −3 and 2 (1 wide), y −7…−5; arms pivot at (±4.9, −4.5) and are 2.2 long. He is 8 units tall, 10 wide.
// In a perspective set use s = CLAWD_UNIT * P.k(Z) (CLAWD_UNIT = 5: a 40-world-unit desk buddy; pass a bigger s to scale him up).
//
// Pose     dy (+ = down) · jump (units up) · sq (squash, − = stretch) · rot · flip · sx (horizontal scale, for spins)
//          aL / aR: arm angles (rad, 0 = straight out, + = raised) · walk (phase: the legs step) · bounce (0..1 idle bob)
// Face     eyes: 'normal' | 'look' | 'happy' | 'closed' | 'wink' | 'narrow' | 'spark' | 'swirl' | 'heart' | 'x' | 'red' | 'dot'
//          lookX / lookY (−1..1, for 'normal' and 'look') · squint (0..1) · blink (auto unless false)
//          mouth: none | 'smile' | 'grin' | 'o' | 'O' | 'flat' | 'wobble' | 'cat' · blush
// Look     holo (0..1): a cyan hologram glow and scan lines (he lives in the laptop) · alpha
// Extras   emote: '!' | '?' | 'sweat' | 'heart' | 'spark' | 'music' with emoteK (0..1 pop) · armL / armR (fn(s) drawn at the arm tip)
//
// Returns screen anchors: { head, mouth, top, eyeL, eyeR, chest, handL, handR, footL, footR }

const CLAWD_UNIT = 5;
const CL = { clay: '#D97757', clayDk: '#A84D33', clayLt: '#F2A283', ink: '#2B2233', cream: '#FFF5E2', rose: '#E27A92',
  ochre: '#E8AA38', sky: '#8EC3E6', holo: '#7FE3FF', red: '#FF2F4A' };

function clawd(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, lw = clamp(s * .16, 1.4, 6) / s, holo = clamp(o.holo || 0);
  const bob = (o.bounce || 0) * Math.abs(Math.sin(t * 4.2)) * .5;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (o.alpha != null) X.globalAlpha *= clamp(o.alpha);
  if (!o.noShadow && !holo) { const f = 1 - clamp((o.jump || 0) / 8) * .5; ellipse(0, .15, 5.6 * f, .9 * f, { fill: 'rgba(40,20,30,.25)', stroke: null }); }
  if (holo > .01) {                                                       // the hologram: a soft cyan aura behind him
    X.save(); X.globalAlpha *= .55 * holo; ellipse(0, -4.4, 8.2, 6.2, { fill: radGrad(0, -4.4, 1, 8.2, [[0, rgba(CL.holo, .9)], [1, rgba(CL.holo, 0)]]), stroke: null }); X.restore();
  }
  X.translate(0, (o.dy || 0) - (o.jump || 0) - bob);
  if (o.rot) { X.translate(0, -4); X.rotate(o.rot); X.translate(0, 4); }
  const sq = o.sq || 0; X.scale((o.sx ?? 1) * (1 + sq * .6), 1 - sq);

  withBoil(o.boil ?? .6, () => {
    const ink = { stroke: CL.ink, lw };
    // legs first, so the body overlaps their tops
    [-4, -2, 1, 3].forEach((lx, i) => {
      let h = 2.2;
      if (o.walk != null) { const ph = Math.sin((o.walk + (i % 2 ? .5 : 0)) * TAU); if (ph > 0) h = 2.2 - ph * .9; }
      shape(rectPts(lx, -2.4, 1, h), { fill: CL.clayDk, ...ink, lw: lw * .85 });
      if (i === 0) A.footL = toPx(lx + .5, -2.4 + h); if (i === 3) A.footR = toPx(lx + .5, -2.4 + h);
    });
    // arms: stubby blocks pivoting at the body's sides
    const arm = (sd, a, hook) => {
      X.save(); X.translate(sd * 4.9, -4.5); X.rotate(sd < 0 ? a : -a);
      shape(rectPts(sd < 0 ? -2.2 : 0, -.5, 2.2, 1), { fill: CL.clay, ...ink, lw: lw * .85 });
      A[sd < 0 ? 'handL' : 'handR'] = toPx(sd * 2.2, 0);
      if (hook) { X.translate(sd * 2.2, 0); if (sd < 0) X.scale(-1, 1); hook(s); }
      X.restore();
    };
    arm(-1, o.aL ?? .2, o.armL); arm(1, o.aR ?? .2, o.armR);
    // the body: flat clay, a light pool up top, a darker band along the bottom, ink outline
    const body = rectPts(-5, -8, 10, 6);
    shape(body, { fill: CL.clay, stroke: null });
    shape(ellPts(-1.6, -6.4, 3.4, 1.5, 18, -.08), { fill: rgba(CL.clayLt, .75), stroke: null });
    shape(rectPts(-4.8, -3.8, 9.6, 1.6), { fill: rgba(CL.clayDk, .45), stroke: null });
    shape(body, { fill: null, ...ink });
    if (o.blush) for (const bx of [-3.6, 3.6]) ellipse(bx, -4.6, .8, .4, { fill: rgba(CL.rose, .7), stroke: null });
    clawdEyes(o, t, lw, A);
    clawdMouth(o.mouth, lw);
    if (holo > .01) {                                                     // scan lines and a cyan rim
      X.save(); X.beginPath(); X.rect(-5, -8, 10, 6); X.clip();
      for (let i = 0; i < 12; i++) { const yy = -8 + frac(i / 12 + t * .35) * 6; line([[-5, yy], [5, yy]], { stroke: rgba('#FFFFFF', .22 * holo), lw: .12 }); }
      X.restore();
      shape(body, { fill: null, stroke: rgba(CL.holo, .9 * holo), lw: lw * 1.6 });
    }
    A.head = toPx(0, -5); A.mouth = toPx(0, -4.3); A.top = toPx(0, -8); A.chest = toPx(0, -4); A.eyeL = toPx(-2.5, -6); A.eyeR = toPx(2.5, -6);
  });
  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .01) clawdEmote(o.emote, A, s, o.emoteK ?? 1, t);
  return A;
}

function clawdEyes(o, t, lw, A) {
  const e = o.eyes || 'normal', sqz = clamp(o.squint || 0), ink = CL.ink;
  const blink = o.blink !== false && (e === 'normal' || e === 'look') && ((t * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
  if (sqz > .8) { for (const ex of [-3, 2]) line([[ex - .3, -5.9], [ex + 1.3, -5.9]], { stroke: ink, lw: lw * 1.3 }); return; }
  X.save(); if (sqz > 0) { X.translate(0, -6); X.scale(1 + sqz * .15, 1 - sqz); X.translate(0, 6); }
  for (const ex of [-3, 2]) {
    const x0 = ex, y0 = -7, cx = x0 + .5;
    if (e === 'normal' || e === 'look') {
      const lx = (o.lookX || 0) * .5, ly = (o.lookY || 0) * .4;
      if (blink) line([[x0 - .2, y0 + 1.5], [x0 + 1.2, y0 + 1.5]], { stroke: ink, lw: lw * 1.3 });
      else { shape(rectPts(x0 + lx, y0 + ly, 1, 2), { fill: ink, stroke: null }); ellipse(x0 + lx + .32, y0 + ly + .42, .17, .24, { fill: CL.cream, stroke: null }); }
    } else if (e === 'happy') line([[x0 - .4, y0 + 1.7], [cx, y0 + .5], [x0 + 1.4, y0 + 1.7]], { stroke: ink, lw: lw * 1.5 });
    else if (e === 'closed') line([[x0 - .4, y0 + 1.2], [cx, y0 + 1.6], [x0 + 1.4, y0 + 1.2]], { stroke: ink, lw: lw * 1.4, smooth: true });
    else if (e === 'wink') { if (ex < 0) line([[x0 - .4, y0 + 1.7], [cx, y0 + .5], [x0 + 1.4, y0 + 1.7]], { stroke: ink, lw: lw * 1.5 }); else shape(rectPts(x0, y0, 1, 2), { fill: ink, stroke: null }); }
    else if (e === 'narrow') shape(rectPts(x0 - .1, y0 + .9, 1.2, .7), { fill: ink, stroke: null });
    else if (e === 'dot') ellipse(cx, y0 + 1, .45, .55, { fill: ink, stroke: null });
    else if (e === 'spark') {
      circle(cx, y0 + 1, 1.5, { fill: rgba(CL.ochre, .4), stroke: null });
      shape(starPts(cx, y0 + 1, 1.35 * (1 + .12 * Math.sin(t * 14))), { fill: CL.cream, stroke: ink, lw: lw * .7 });
    } else if (e === 'red') {
      circle(cx, y0 + 1, 1.7, { fill: rgba(CL.red, .35), stroke: null });
      shape(rectPts(x0 - .1, y0, 1.2, 2), { fill: CL.red, stroke: ink, lw: lw * .6 });
    } else if (e === 'heart') shape(ellPts(cx, y0 + 1, .9, .9, 4, Math.PI / 4), { fill: '#E2476E', stroke: ink, lw: lw * .6 });
    else if (e === 'x') { line([[x0 - .3, y0 + .2], [x0 + 1.3, y0 + 1.8]], { stroke: ink, lw: lw * 1.3 }); line([[x0 + 1.3, y0 + .2], [x0 - .3, y0 + 1.8]], { stroke: ink, lw: lw * 1.3 }); }
    else if (e === 'swirl') {
      const sp = []; for (let k = 0; k < 16; k++) { const a = k * .7 + t * 6 * (ex < 0 ? 1 : -1), r = k * .06; sp.push([cx + Math.cos(a) * r, y0 + 1 + Math.sin(a) * r]); }
      line(sp, { stroke: ink, lw: lw * .9, smooth: true });
    }
  }
  X.restore();
}

function clawdMouth(m, lw) {
  if (!m) return;
  const ink = CL.ink;
  if (m === 'o') ellipse(0, -4.3, .45, .5, { fill: ink, stroke: null });
  else if (m === 'O') ellipse(0, -4.1, .8, .95, { fill: '#4A1F2A', stroke: ink, lw: lw * .8 });
  else if (m === 'smile') line([[-.8, -4.6], [0, -4.1], [.8, -4.6]], { stroke: ink, lw: lw * 1.1, smooth: true });
  else if (m === 'grin') shape([[-1.3, -4.8], [1.3, -4.8], [.9, -3.9], [-.9, -3.9]], { fill: '#4A1F2A', stroke: ink, lw: lw * .8 });
  else if (m === 'flat') line([[-.7, -4.4], [.7, -4.4]], { stroke: ink, lw: lw * 1.1 });
  else if (m === 'wobble') line([[-1, -4.4], [-.5, -4.7], [0, -4.4], [.5, -4.7], [1, -4.4]], { stroke: ink, lw: lw, smooth: true });
  else if (m === 'cat') line([[-.9, -4.5], [-.45, -4.1], [0, -4.5], [.45, -4.1], [.9, -4.5]], { stroke: ink, lw: lw, smooth: true });
}

function clawdEmote(kind, A, s, k, t) {
  const p = backOut(k); if (p < .02) return;
  const [hx, hy] = A.top;
  overlay(() => {
    X.save(); X.translate(hx + s * 5.6, hy - s * 1.6 + wob(t, 1.5) * s * .2); X.scale(p, p);
    if (kind === 'sweat') shape([[0, -1.6 * s], [.9 * s, .2 * s], [0, .9 * s], [-.9 * s, .2 * s]], { fill: CL.sky, stroke: CL.ink, lwPx: 3, smooth: true });
    else if (kind === 'heart') shape(ellPts(0, 0, 1.4 * s, 1.4 * s, 4, Math.PI / 4), { fill: '#E2476E', stroke: CL.ink, lwPx: 3 });
    else if (kind === 'spark') shape(starPts(0, 0, 1.8 * s), { fill: CL.cream, stroke: CL.ink, lwPx: 3 });
    else {
      const txt = kind === 'music' ? '♪' : kind, size = s * 3.4;
      X.rotate(.12); X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = size * .14; X.strokeStyle = CL.ink; X.strokeText(txt, 0, 0); X.fillStyle = kind === '?' ? CL.sky : CL.ochre; X.fillText(txt, 0, 0);
    }
    X.restore();
  });
}

// Registration: the studio's character browser and model sheets read this.
CHARACTERS.clawd = {
  draw: clawd, unit: CLAWD_UNIT, palette: CL, size: [12, 9],
  poses: {
    'rest': (x, y, s, t) => clawd(x, y, s, { t, bounce: .4 }),
    'wave': (x, y, s, t) => clawd(x, y, s, { t, aR: 1.2 + .45 * Math.sin(t * 9), mouth: 'smile', eyes: 'happy' }),
    'talk': (x, y, s, t) => clawd(x, y, s, { t, mouth: frac(t * 4) < .5 ? 'o' : 'smile', aL: .5 + .3 * Math.sin(t * 3), lookX: .4 }),
    'hologram': (x, y, s, t) => clawd(x, y, s, { t, holo: 1, bounce: .5, mouth: 'smile' }),
    'thinking': (x, y, s, t) => clawd(x, y, s, { t, eyes: 'look', lookX: .7, lookY: -.8, aR: 1.6, mouth: 'flat', emote: '?', emoteK: .5 + .5 * Math.sin(t * 2) }),
    'idea!': (x, y, s, t) => clawd(x, y, s, { t, eyes: 'spark', aL: 1.4, aR: 1.4, jump: Math.abs(Math.sin(t * 4)) * 1.5, mouth: 'grin', emote: '!', emoteK: 1 }),
    'mischief': (x, y, s, t) => clawd(x, y, s, { t, eyes: 'narrow', mouth: 'cat', aL: .9 + .2 * Math.sin(t * 8), aR: .9 - .2 * Math.sin(t * 8), rot: .05 * Math.sin(t * 3) }),
    'haywire': (x, y, s, t) => clawd(x, y, s, { t, eyes: 'swirl', mouth: 'wobble', rot: .12 * Math.sin(t * 13), aL: 1.5 * Math.sin(t * 11), aR: 1.5 * Math.cos(t * 9), sq: .08 * Math.sin(t * 17) }),
    'laugh': (x, y, s, t) => clawd(x, y, s, { t, eyes: 'happy', mouth: 'grin', sq: .1 * Math.abs(Math.sin(t * 12)), aL: .6, aR: .6 }),
    'walk': (x, y, s, t) => clawd(x, y, s, { t, walk: t * 2, dy: -.3 * Math.abs(Math.sin(t * TAU * 2)), aL: .3 * Math.sin(t * TAU), aR: -.3 * Math.sin(t * TAU) }),
  },
};
