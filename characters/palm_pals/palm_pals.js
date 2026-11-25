// characters/palm_pals/palm_pals.js: Aurora Palm Pals plushies + story family cast in one character rig & panel:
//   - Eve Earth             ('eve' | 'eve_earth')            — soothing sky-blue planet with green continents
//   - Zelie Pink Lemonade   ('zelie' | 'zelle')              — vibrant pink lemonade cup with foam, lemon slice & straw
//   - Kringle Cookie        ('kringle' | 'cringle')          — golden-brown holiday cookie with red & green candy dots
//   - Crumble Cookie        ('crumble' | 'crumble_cookie')   — golden cookie with white frosting & rainbow sprinkles
//   - Bertie Red Bus        ('bertie' | 'barret' | 'red_bus')— squishy London double-decker red bus with windows & LONDON sign
//   - Eve's Dad             ('eve_dad' | 'earth_dad')        — larger deep-blue Earth plushie with a wavy squiggly mustache
//   - Zelie's Papa          ('zelie_papa' | 'papa')          — taller coral-red punch cup plushie with yellow straw & squiggly mustache
//
// palmPals(x, y, s, o) → anchors. (x, y) = floor point beneath the plushie (screen px), s = px per local unit.
// Convenience wrappers: eveEarth, zelieLemonade, kringleCookie, crumbleCookie, bertieRedBus, eveDad, zeliePapa.
// Local units: each plush is ~8.5–9.5 wide and ~8.2–11.2 tall (bean-filled base on y = 0).
// In a perspective set use s = PALM_PALS_UNIT * P.k(Z) (PALM_PALS_UNIT = 4.5 → ~40 world units tall).
//
// Options:
//   pal:    'eve' | 'zelie' | 'kringle' | 'crumble' | 'bertie' | 'eve_dad' | 'zelie_papa' | 'all'  (aliases supported)
//   seed:   number (picks a pal when pal is omitted, and staggers auto-blink / bob phase)
//   Pose:   dy (+ down) · jump (units up) · sq (squash; − stretches) · rot · flip · sx · bounce (0..1 idle bob) · sway (0..1 gentle rock)
//   Limbs:  armL / armR (rad; +armL lifts left hand up, −armR lifts right hand up) · footL / footR (rad) · noArms · noFeet
//   Face:   eyes: 'open' | 'happy' | 'closed' | 'wink' | 'wide' | 'sparkle' | 'star' | 'sleepy'
//           lookX / lookY (−1..1) · blink (0..1 or false) · brows: 'none' | 'up' | 'worried' | 'angry'
//           mouth: 'smile' | 'grin' | 'laugh' | 'open' | 'o' | 'O' | 'flat' | 'frown' | 'cat' (works with lipFlap)
//           blush: true (default) | false | 0..1
//   Extras: emote: 'heart' | 'spark' | '!' | '?' | 'music' | 'zzz' with emoteK (0..1)
//           drive: 0..1 (Bertie Red Bus headlights glow + motion puffs) · giggle: 0..1 (Zelie straw & lemon jiggle)
//
// Returns screen anchors: { head, mouth, top, eyeL, eyeR, handL, handR, footL, footR, chest, center, bottom }

const PALM_PALS_UNIT = 4.5;
const PALM_PALS_LIST = ['eve', 'zelie', 'kringle', 'crumble', 'bertie'];

const PLP = {
  ink: '#352333',
  bead: '#1E1624',
  blush: '#F69AB3',
  blushOnPink: '#FF5C8D',
  blushOnRed: '#FFACC0',
  mouthIn: '#7A2540',
  tongue: '#F58AA6',
  cream: '#FFFBF4',
  // Eve Earth
  eveOcean: '#7AC3EB',
  eveOceanLt: '#B2E4FC',
  eveOceanDk: '#529CC9',
  eveLand: '#6EC86B',
  eveLandLt: '#93DE8B',
  eveLandDk: '#4EA54E',
  // Zelie Pink Lemonade
  zelieCup: '#F682B0',
  zelieCupLt: '#FFB4D2',
  zelieCupDk: '#D65A8C',
  zelieFoam: '#FFFDF8',
  zelieFoamSh: '#EAE0D8',
  zelieStraw: '#ED5890',
  zelieStrawLt: '#FFD7E8',
  zelieLemonRind: '#F7D436',
  zelieLemonPith: '#FFFBE4',
  zelieLemonMeat: '#FFE870',
  // Kringle Cookie
  kringleBase: '#D69755',
  kringleLt: '#EEBF89',
  kringleDk: '#B07134',
  kringleRed: '#E2414B',
  kringleGreen: '#41A85B',
  // Crumble Cookie
  crumbleCrust: '#E6B260',
  crumbleCrustLt: '#F8D493',
  crumbleCrustDk: '#C48C3B',
  crumbleFrost: '#FFFDF7',
  crumbleFrostSh: '#EBE2D5',
  sprinkles: ['#F2689B', '#52B2ED', '#F9D142', '#5AC478', '#AA80E3', '#F7894F'],
  // Bertie Red Bus
  bertieRed: '#DF343C',
  bertieRedLt: '#F76B71',
  bertieRedDk: '#AE1F27',
  bertieWindow: '#B8E4FA',
  bertieWindowDk: '#8BC9EB',
  bertieSign: '#26202E',
  bertieSignTxt: '#FFF3CE',
  bertieStripe: '#FFF6EA',
  bertieWheel: '#352E3C',
  bertieHub: '#8B8296',
  bertieLight: '#FFE775',
  bertieGrill: '#ECE6DE',
  // Story Parents (Palm Pals Adventures)
  eveDadOceanLt: '#7EB7DF',
  eveDadOcean: '#4F92C4',
  eveDadOceanDk: '#326A99',
  eveDadLand: '#4AA158',
  eveDadLandDk: '#2F753B',
  zeliePapaCupLt: '#F07D6D',
  zeliePapaCup: '#D95448',
  zeliePapaCupDk: '#B2362C',
  zeliePapaStraw: '#F7C948',
  mustacheFill: '#4A2F28',
};

function plpResolvePal(pal, seed) {
  if (!pal && seed != null) return PALM_PALS_LIST[((Math.floor(seed) % 5) + 5) % 5];
  const key = String(pal || 'eve').toLowerCase().trim().replace(/[\s-]+/g, '_');
  const map = {
    eve: 'eve', eve_earth: 'eve', earth: 'eve',
    zelie: 'zelie', zelle: 'zelie', zelie_pink_lemonade: 'zelie', pink_lemonade: 'zelie', lemonade: 'zelie',
    kringle: 'kringle', cringle: 'kringle', kringle_cookie: 'kringle', cringle_cookie: 'kringle',
    crumble: 'crumble', crumble_cookie: 'crumble', crumble_cooke: 'crumble',
    bertie: 'bertie', barret: 'bertie', barrett: 'bertie', red_bus: 'bertie',
    bertie_red_bus: 'bertie', barret_red_bus: 'bertie', barret_the_red_bus: 'bertie', bus: 'bertie',
    eve_dad: 'eve_dad', eves_dad: 'eve_dad', earth_dad: 'eve_dad', dad_earth: 'eve_dad',
    zelie_papa: 'zelie_papa', zelies_papa: 'zelie_papa', papa: 'zelie_papa', fruit_punch: 'zelie_papa',
    all: 'all', group: 'all', squad: 'all',
  };
  return map[key] || 'eve';
}

// Organic squishy bean-bag rounded silhouette centered at x = 0, resting flat-ish on y = 0.
function plpPlushPts(rx, h, bottomFlat = .78, topSquish = .92, bumpAmp = 0, bumpSeed = 0) {
  const n = 24, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU - Math.PI / 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    // Wider bean-filled lower belly, softly rounded crown, gentle flattened base
    const widthBoost = sa > 0 ? 1 + .07 * Math.sin(sa * Math.PI) : lerp(topSquish, 1, 1 + sa);
    let px = ca * rx * widthBoost;
    let py = -h * .5 + sa * h * .5;
    if (sa > .35) {
      const k = (sa - .35) / .65;
      py = lerp(py, 0, k * k * (1 - bottomFlat) * 1.15);
    }
    if (bumpAmp > 0) {
      const b = Math.sin(a * 5 + bumpSeed) * bumpAmp + Math.cos(a * 3 - bumpSeed) * bumpAmp * .45;
      px += ca * b;
      py += sa * b * (sa > .6 ? .25 : 1);
    }
    pts.push([px, py]);
  }
  return pts;
}

// Subtle plush velvet fuzz flecks clipped inside the body (deterministic, non-boiling).
function plpFuzz(count, rx, h, seed, lightAlpha = .26, darkAlpha = .1) {
  withBoil(0, () => {
    for (let i = 0; i < count; i++) {
      const u = hash(i * 3.17 + seed) * 2 - 1;
      const v = hash(i * 5.41 + seed);
      const px = u * rx * .84;
      const py = -.65 - v * (h - 1.3);
      const ang = (hash(i * 7.13 + seed) - .5) * 1.4 - .5;
      line([[px, py], [px + Math.cos(ang) * .36, py + Math.sin(ang) * .36]], {
        stroke: i % 3 ? `rgba(255,255,255,${lightAlpha})` : `rgba(45,25,40,${darkAlpha})`,
        lw: .08,
      });
    }
  });
}

// Shared kawaii Palm Pals embroidered face (bead eyes, rosy cheeks, sweet stitched smile).
function plpFace(o, t, lw, A, cfg = {}) {
  const cy = cfg.cy ?? -3.65;
  const eyeDX = cfg.eyeDX ?? 1.45;
  const eyeR = cfg.eyeR ?? .54;
  const cheekDX = cfg.cheekDX ?? eyeDX + .82;
  const cheekY = cfg.cheekY ?? cy + .62;
  const mouthY = cfg.mouthY ?? cy + .72;
  const blushCol = cfg.blushCol ?? PLP.blush;
  const blinkSeed = (o.seed ?? cfg.seed ?? 0) * 1.37;
  const eKind = o.eyes || 'open';
  const lx = clamp(o.lookX || 0, -1, 1) * .18;
  const ly = clamp(o.lookY || 0, -1, 1) * .16;

  // Rosy cheeks
  const blushAmt = o.blush === false ? 0 : (typeof o.blush === 'number' ? clamp(o.blush) : 1);
  if (blushAmt > .01) {
    for (const sd of [-1, 1]) {
      ellipse(sd * cheekDX, cheekY, .66, .38, { fill: rgba(blushCol, .68 * blushAmt), stroke: null });
    }
  }

  // Auto-blink phase (only for open / wide / sparkle eyes)
  const ph = (t + 1.1 + blinkSeed) % 3.6;
  const autoBlink = (eKind === 'open' || eKind === 'wide' || eKind === 'sparkle') && ph < .15 ? Math.sin(ph / .15 * Math.PI) : 0;
  const blinkAmt = o.blink === false ? 0 : (typeof o.blink === 'number' ? clamp(o.blink) : autoBlink);

  // Eyes
  for (const sd of [-1, 1]) {
    const ex = sd * eyeDX, ey = cy;
    const isWinkClosed = eKind === 'wink' && sd > 0;
    if (eKind === 'happy' || isWinkClosed) {
      line([[ex - .56, ey + .18], [ex, ey - .32], [ex + .56, ey + .18]], { stroke: PLP.bead, lw: lw * 1.45, smooth: true });
    } else if (eKind === 'closed' || blinkAmt > .72) {
      line([[ex - .54, ey + .04], [ex, ey + .24], [ex + .54, ey + .04]], { stroke: PLP.bead, lw: lw * 1.35, smooth: true });
    } else if (eKind === 'star') {
      shape(starPts(ex, ey, eyeR * 1.55, .48, 5), { fill: '#FFE15A', stroke: PLP.ink, lw: lw * .75 });
    } else {
      const r = eKind === 'wide' ? eyeR * 1.18 : eyeR;
      const ry = r * (1 - blinkAmt * .75);
      ellipse(ex + lx, ey + ly, r, Math.max(.12, ry), { fill: PLP.bead, stroke: null });
      withBoil(0, () => {
        if (ry > .26) {
          circle(ex + lx - r * .3, ey + ly - ry * .32, r * .32, { fill: '#FFFFFF', stroke: null });
          circle(ex + lx + r * .3, ey + ly + ry * .28, r * .14, { fill: 'rgba(255,255,255,.8)', stroke: null });
          if (eKind === 'sparkle') {
            shape(starPts(ex + lx + r * .22, ey + ly - ry * .2, r * .55, .28, 4), { fill: '#FFFFFF', stroke: null });
          }
        }
      });
      if (eKind === 'sleepy') {
        line([[ex - r * 1.15, ey - r * .15], [ex + r * 1.15, ey - r * .15]], { stroke: PLP.bead, lw: lw * 1.3 });
      }
    }
    // Optional eyebrows (off by default to keep authentic Palm Pals look)
    const bk = o.brows || 'none';
    if (bk !== 'none') {
      const by = ey - eyeR - .55;
      const bPts = {
        up: [[ex - .48, by - .05], [ex, by - .26], [ex + .48, by - .05]],
        worried: [[ex - .48, by + (sd < 0 ? .18 : -.16)], [ex + .48, by + (sd < 0 ? -.16 : .18)]],
        angry: [[ex - .48, by + (sd < 0 ? -.18 : .22)], [ex + .48, by + (sd < 0 ? .22 : -.18)]],
      }[bk] || [[ex - .46, by], [ex, by - .12], [ex + .46, by]];
      line(bPts, { stroke: PLP.ink, lw: lw * 1.15, smooth: true });
    }
    A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(ex, ey);
  }

  // Mouth
  const mk = o.mouth || 'smile';
  if (mk === 'smile') {
    line([[-.64, mouthY - .14], [0, mouthY + .28], [.64, mouthY - .14]], { stroke: PLP.bead, lw: lw * 1.25, smooth: true });
  } else if (mk === 'cat') {
    line([[-.74, mouthY - .1], [-.35, mouthY + .24], [0, mouthY - .06], [.35, mouthY + .24], [.74, mouthY - .1]], { stroke: PLP.bead, lw: lw * 1.15, smooth: true });
  } else if (mk === 'flat') {
    line([[-.55, mouthY + .06], [.55, mouthY + .06]], { stroke: PLP.bead, lw: lw * 1.2 });
  } else if (mk === 'frown') {
    line([[-.6, mouthY + .24], [0, mouthY - .14], [.6, mouthY + .24]], { stroke: PLP.bead, lw: lw * 1.2, smooth: true });
  } else if (mk === 'o') {
    ellipse(0, mouthY + .12, .32, .38, { fill: PLP.mouthIn, stroke: PLP.bead, lw: lw * .85 });
  } else if (mk === 'O') {
    ellipse(0, mouthY + .18, .54, .64, { fill: PLP.mouthIn, stroke: PLP.bead, lw: lw * .9 });
    ellipse(0, mouthY + .52, .32, .2, { fill: PLP.tongue, stroke: null });
  } else {
    // 'grin' | 'open' | 'laugh'
    const mw = mk === 'laugh' ? .96 : mk === 'grin' ? .82 : .68;
    const mh = mk === 'laugh' ? .88 : mk === 'grin' ? .64 : .52;
    shape([[-mw, mouthY - .12], [0, mouthY - .02], [mw, mouthY - .12], [mw * .75, mouthY + mh], [0, mouthY + mh * 1.15], [-mw * .75, mouthY + mh]],
      { fill: PLP.mouthIn, stroke: PLP.bead, lw: lw * .9, smooth: .65 });
    ellipse(0, mouthY + mh * .78, mw * .48, mh * .3, { fill: PLP.tongue, stroke: null });
  }

  A.head = toPx(0, cy - .3);
  A.mouth = toPx(0, mouthY + .1);
}

// Cute stubby bean-stuffed plushie feet (resting on y = 0, tucked behind the lower belly).
function plpDrawFeet(o, t, lw, A, cfg) {
  if (o.noFeet) return;
  const cols = cfg.footCols || cfg.cols;
  const sc = cfg.footScale ?? 1;
  const fx = cfg.footX ?? 1.6;
  const fy = cfg.footY ?? -.62 * sc;
  const seedOff = (o.seed ?? cfg.seed ?? 0) * .85;
  const jumpKick = clamp(o.jump || 0, 0, 1.4) * .22;
  const bounceKick = (o.bounce || 0) * Math.max(0, Math.sin(t * 3.8 + seedOff)) * .08;
  const basePts = [
    [-.86, -.34], [-.30, -.62], [.42, -.58], [.98, -.26],
    [1.08, .12], [.88, .50], [.26, .62], [-.38, .60], [-.90, .42], [-1.00, .06],
  ];

  for (const sd of [-1, 1]) {
    const custom = sd < 0 ? o.footL : o.footR;
    const ang = custom != null ? custom : sd * (jumpKick + bounceKick);
    const pts = basePts.map(([px, py]) => [px * sd * sc, py * sc]);
    X.save();
    X.translate(sd * fx, fy);
    X.rotate(ang);
    X.save();
    tracePath(pts, true, .78);
    X.fillStyle = linGrad(0, -.62 * sc, 0, .62 * sc, [[0, cols.lt], [.42, cols.base], [1, cols.dk]]);
    X.fill();
    X.clip();
    withBoil(0, () => {
      // Soft cozy belly shadow cast onto top of the foot
      ellipse(0, -.52 * sc, 1.05 * sc, .36 * sc, { fill: 'rgba(38,18,34,.2)', stroke: null });
      // Subtle plush sheen on the rounded toe
      ellipse(.42 * sd * sc, -.06 * sc, .36 * sc, .15 * sc, { fill: 'rgba(255,255,255,.28)', stroke: null, rot: sd * .18 });
    });
    X.restore();
    shape(pts, { fill: null, stroke: PLP.ink, lw: lw * .95, smooth: .78 });
    A[sd < 0 ? 'footL' : 'footR'] = toPx(.22 * sd * sc, .44 * sc);
    X.restore();
  }
}

// Cute stubby bean-stuffed plushie arms / mitten-hands (tucked cleanly behind the body sides).
// Angle convention: +armL lifts the left hand up, −armR lifts the right hand up.
function plpDrawArms(o, t, lw, A, cfg) {
  if (o.noArms) return;
  const cols = cfg.armCols || cfg.cols;
  const sc = cfg.armScale ?? 1;
  const ax = cfg.armX ?? 4.0;
  const ay = cfg.armY ?? -3.55;
  const seedOff = (o.seed ?? cfg.seed ?? 0) * .85;
  const wiggle = (o.bounce || 0) * Math.sin(t * 3.8 + seedOff) * .16
    + (o.sway || 0) * Math.sin(t * 2.2 + seedOff) * .12
    + (o.giggle || 0) * Math.sin(t * 14) * .26;
  const jumpLift = clamp(o.jump || 0, 0, 1.5) * .42;
  const defL = cfg.defArmL ?? .26;
  const defR = cfg.defArmR ?? -.26;
  const basePts = [
    [0, -.42], [.55, -.50], [1.18, -.58], [1.56, -.30],
    [1.64, .06], [1.44, .44], [.92, .56], [.32, .48], [0, .40],
  ];

  for (const sd of [-1, 1]) {
    const custom = sd < 0 ? o.armL : o.armR;
    const ang = custom != null
      ? custom
      : (sd < 0 ? defL + jumpLift + wiggle : defR - jumpLift + wiggle);
    const pts = basePts.map(([px, py]) => [px * sd * sc, py * sc]);
    X.save();
    X.translate(sd * ax, ay);
    X.rotate(ang);
    X.save();
    tracePath(pts, true, .78);
    X.fillStyle = linGrad(0, -.6 * sc, 0, .6 * sc, [[0, cols.lt], [.44, cols.base], [1, cols.dk]]);
    X.fill();
    X.clip();
    withBoil(0, () => {
      // Soft shoulder seam shadow where the hand meets the plush body
      ellipse(.06 * sd * sc, 0, .34 * sc, .52 * sc, { fill: 'rgba(40,18,36,.16)', stroke: null });
      // Tiny plush sheen on the upper mitten curve
      ellipse(.92 * sd * sc, -.24 * sc, .46 * sc, .17 * sc, { fill: 'rgba(255,255,255,.3)', stroke: null });
    });
    X.restore();
    shape(pts, { fill: null, stroke: PLP.ink, lw: lw * .95, smooth: .78 });
    A[sd < 0 ? 'handL' : 'handR'] = toPx(1.44 * sd * sc, 0);
    X.restore();
  }
}

// ---------- 1. Eve Earth ----------
function plpDrawEve(o, t, lw, A) {
  const rx = 4.35, h = 8.2;
  const lift = o.noFeet ? 0 : .62;
  const cols = { lt: PLP.eveOceanLt, base: PLP.eveOcean, dk: PLP.eveOceanDk };
  const body = plpPlushPts(rx, h, .76, .95, 0, 1);

  plpDrawFeet(o, t, lw, A, { cols, footX: 1.58, seed: 1 });

  X.save();
  X.translate(0, -lift);
  plpDrawArms(o, t, lw, A, { cols, armX: 3.95, armY: -3.55, seed: 1 });

  X.save();
  tracePath(body, true, .9);
  X.fillStyle = linGrad(-2, -h, 2, 0, [[0, PLP.eveOceanLt], [.38, PLP.eveOcean], [1, PLP.eveOceanDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    // Soft plush highlight on top-left ocean
    ellipse(-1.4, -6.2, 2.3, 1.3, { fill: 'rgba(255,255,255,.32)', stroke: null, rot: -.22 });
    // Green sewn continent patches framing the face cleanly
    const continents = [
      // Left Americas-inspired patch
      [[-4.8, -6.4], [-3.2, -7.2], [-1.7, -6.3], [-1.4, -5.0], [-2.5, -4.1], [-2.0, -2.9], [-2.6, -1.6], [-4.1, -1.7], [-4.9, -3.5]],
      // Upper-right Eurasia-inspired patch
      [[1.1, -7.8], [3.1, -7.4], [4.7, -5.8], [4.8, -3.9], [3.5, -3.6], [2.4, -4.5], [1.6, -5.5], [.9, -6.5]],
      // Top small northern island
      [[-.8, -8.5], [.6, -8.4], [.9, -7.4], [-.1, -7.1], [-1.1, -7.5]],
      // Lower-right Australia-inspired island
      [[2.3, -2.5], [3.8, -2.4], [4.4, -1.2], [3.4, -.3], [2.1, -.7], [1.9, -1.7]],
      // Tiny lower-left landmass tip
      [[-3.6, -1.1], [-2.3, -.9], [-2.1, .2], [-3.8, .2]],
    ];
    for (const cPts of continents) {
      shape(cPts, { fill: PLP.eveLand, stroke: PLP.eveLandDk, lw: lw * .65, smooth: .7 });
      // Delicate plush patch stitch dashes inside
      shape(cPts, { fill: null, stroke: rgba(PLP.eveLandLt, .55), lw: lw * .35, smooth: .7, dash: [.32, .34] });
    }
    // Lower bean-weighted belly soft shading
    ellipse(0, .1, 4.4, 1.5, { fill: 'rgba(30,75,110,.16)', stroke: null });
    plpFuzz(42, rx, h, 11, .24, .08);
  });
  X.restore();

  shape(body, { fill: null, stroke: PLP.ink, lw, smooth: .9 });
  plpFace(o, t, lw, A, { cy: -3.7, eyeDX: 1.4, cheekDX: 2.2, mouthY: -2.95, seed: 1 });
  A.top = toPx(0, -h);
  A.chest = toPx(0, -2.6);
  A.center = toPx(0, -h * .5);
  X.restore();
  A.bottom = toPx(0, 0);
}

// ---------- 2. Zelie Pink Lemonade ----------
function plpDrawZelie(o, t, lw, A) {
  const cupH = 7.6;
  const lift = o.noFeet ? 0 : .62;
  const cols = { lt: PLP.zelieCupLt, base: PLP.zelieCup, dk: PLP.zelieCupDk };
  const jig = (o.giggle || 0) * Math.sin(t * 14) * .12 + (o.bounce || 0) * Math.sin(t * 4.5) * .05;

  plpDrawFeet(o, t, lw, A, { cols, footX: 1.42, footScale: .96, seed: 2 });

  X.save();
  X.translate(0, -lift);
  plpDrawArms(o, t, lw, A, { cols, armX: 3.48, armY: -3.5, armScale: .95, defArmL: .18, defArmR: -.18, seed: 2 });

  // Pink striped straw sticking out of the foam (behind foam rim)
  X.save();
  X.translate(-1.35, -7.3);
  X.rotate(-.24 + jig);
  const strawPts = [[-.44, .4], [-.44, -3.55], [.44, -3.55], [.44, .4]];
  X.save();
  tracePath(strawPts, true, false);
  X.fillStyle = linGrad(-.45, 0, .45, 0, [[0, PLP.zelieStrawLt], [.3, PLP.zelieStraw], [1, '#C93E74']]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    for (let i = -1; i < 6; i++) {
      const sy = -3.4 + i * .72;
      shape([[-.6, sy], [.6, sy - .34], [.6, sy - .12], [-.6, sy + .22]], { fill: PLP.zelieStrawLt, stroke: null });
    }
  });
  X.restore();
  shape(strawPts, { fill: null, stroke: PLP.ink, lw: lw * .9 });
  ellipse(0, -3.55, .44, .18, { fill: '#C0396D', stroke: PLP.ink, lw: lw * .75 });
  X.restore();

  // Yellow plush lemon slice perched on top-right rim (behind front foam curl)
  X.save();
  X.translate(2.2, -7.65);
  X.rotate(.44 - jig * 1.2);
  const lemonOuter = [];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + (i / 14) * Math.PI;
    lemonOuter.push([Math.cos(a) * 2.1, Math.sin(a) * 2.0]);
  }
  lemonOuter.push([2.1, .35], [-2.1, .35]);
  shape(lemonOuter, { fill: PLP.zelieLemonRind, stroke: PLP.ink, lw: lw * .95, smooth: .35 });
  const lemonPith = [];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + (i / 14) * Math.PI;
    lemonPith.push([Math.cos(a) * 1.78, Math.sin(a) * 1.7]);
  }
  lemonPith.push([1.78, .22], [-1.78, .22]);
  shape(lemonPith, { fill: PLP.zelieLemonPith, stroke: null, smooth: .35 });
  const lemonMeat = [];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + (i / 14) * Math.PI;
    lemonMeat.push([Math.cos(a) * 1.48, Math.sin(a) * 1.4]);
  }
  lemonMeat.push([1.48, .12], [-1.48, .12]);
  shape(lemonMeat, { fill: PLP.zelieLemonMeat, stroke: null, smooth: .35 });
  withBoil(0, () => {
    for (let i = 1; i <= 4; i++) {
      const a = Math.PI + (i / 5) * Math.PI;
      line([[0, .08], [Math.cos(a) * 1.55, Math.sin(a) * 1.48]], { stroke: PLP.zelieLemonPith, lw: .18 });
    }
  });
  X.restore();

  // Tapered plush pink lemonade cup body (rounded bean-filled base on y = 0)
  const cup = [
    [-3.75, -7.25], [0, -7.45], [3.75, -7.25],
    [3.88, -5.2], [3.72, -2.5], [3.15, -.65],
    [1.7, -.04], [0, 0], [-1.7, -.04],
    [-3.15, -.65], [-3.72, -2.5], [-3.88, -5.2],
  ];
  X.save();
  tracePath(cup, true, .72);
  X.fillStyle = linGrad(-3.5, -cupH, 3.5, 0, [[0, PLP.zelieCupLt], [.42, PLP.zelieCup], [1, PLP.zelieCupDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    // Glossy pink lemonade highlight & subtle bubbly ice-cube accents
    ellipse(-2.1, -4.6, 1.15, 2.2, { fill: 'rgba(255,255,255,.24)', stroke: null, rot: -.08 });
    // Cute subtle floating pink bubbles along edges (clear of face)
    [[-2.65, -5.7, .34], [2.75, -5.5, .3], [2.45, -1.65, .28], [-2.4, -1.5, .24], [3.0, -3.1, .22]].forEach(([bx, by, br]) => {
      circle(bx, by, br, { fill: 'rgba(255,235,244,.34)', stroke: null });
    });
    ellipse(0, .15, 3.6, 1.35, { fill: 'rgba(130,30,70,.16)', stroke: null });
    plpFuzz(34, 3.6, cupH, 23, .22, .08);
  });
  X.restore();
  shape(cup, { fill: null, stroke: PLP.ink, lw, smooth: .72 });

  // Fluffy scalloped white foam / whipped ice rim across top of cup
  const foam = [
    [-4.05, -7.1], [-3.75, -8.05], [-2.65, -8.45], [-1.55, -8.15],
    [-.45, -8.65], [.75, -8.55], [1.75, -8.2], [2.95, -8.4],
    [3.88, -7.95], [4.08, -7.05], [3.45, -6.55], [2.25, -6.78],
    [1.1, -6.48], [0, -6.72], [-1.15, -6.48], [-2.35, -6.76], [-3.48, -6.55],
  ];
  X.save();
  tracePath(foam, true, .75);
  X.fillStyle = linGrad(0, -8.7, 0, -6.4, [[0, PLP.zelieFoam], [.7, PLP.zelieFoam], [1, PLP.zelieFoamSh]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    ellipse(0, -6.45, 4.2, .55, { fill: rgba(PLP.zelieFoamSh, .7), stroke: null });
  });
  X.restore();
  shape(foam, { fill: null, stroke: PLP.ink, lw: lw * .95, smooth: .75 });

  plpFace(o, t, lw, A, { cy: -3.85, eyeDX: 1.42, cheekDX: 2.22, mouthY: -3.1, blushCol: PLP.blushOnPink, seed: 2 });
  A.top = toPx(0, -10.8);
  A.chest = toPx(0, -2.5);
  A.center = toPx(0, -4.1);
  X.restore();
  A.bottom = toPx(0, 0);
}

// ---------- 3. Kringle Cookie (Holiday Cookie with Red & Green Candy Dots) ----------
function plpDrawKringle(o, t, lw, A) {
  const rx = 4.45, h = 8.15;
  const lift = o.noFeet ? 0 : .62;
  const cols = { lt: PLP.kringleLt, base: PLP.kringleBase, dk: PLP.kringleDk };
  const body = plpPlushPts(rx, h, .76, .95, .11, 1.4);

  plpDrawFeet(o, t, lw, A, { cols, footX: 1.62, seed: 3 });

  X.save();
  X.translate(0, -lift);
  plpDrawArms(o, t, lw, A, { cols, armX: 4.08, armY: -3.55, seed: 3 });

  X.save();
  tracePath(body, true, .92);
  X.fillStyle = linGrad(-2.2, -h, 2.2, 0, [[0, PLP.kringleLt], [.4, PLP.kringleBase], [1, PLP.kringleDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    // Soft baked cookie highlight & toasted rim shade
    ellipse(-1.4, -6.0, 2.5, 1.4, { fill: 'rgba(255,244,220,.3)', stroke: null, rot: -.18 });
    ellipse(0, .15, 4.5, 1.5, { fill: 'rgba(95,48,14,.2)', stroke: null });
    // Subtle baked cookie texture crumbs
    for (let i = 0; i < 20; i++) {
      const cx = (hash(i * 4.7 + 31) * 2 - 1) * 3.7;
      const cy = -.7 - hash(i * 6.1 + 31) * 6.8;
      circle(cx, cy, .11 + hash(i * 2.3) * .08, { fill: rgba(PLP.kringleDk, .42), stroke: null });
    }
    plpFuzz(38, rx, h, 37, .2, .09);
  });
  X.restore();
  shape(body, { fill: null, stroke: PLP.ink, lw, smooth: .92 });

  // Festive red & green candy dot sprinkles framing the face
  const dots = [
    [-2.45, -6.25, .52, PLP.kringleRed],
    [-.45, -6.85, .5, PLP.kringleGreen],
    [1.85, -6.45, .52, PLP.kringleRed],
    [3.15, -4.85, .48, PLP.kringleGreen],
    [-3.25, -4.65, .48, PLP.kringleGreen],
    [-2.75, -1.65, .5, PLP.kringleRed],
    [-.4, -1.15, .48, PLP.kringleGreen],
    [2.35, -1.55, .52, PLP.kringleRed],
    [3.1, -2.75, .44, PLP.kringleRed],
  ];
  for (const [dx, dy, dr, col] of dots) {
    circle(dx, dy, dr, { fill: col, stroke: PLP.ink, lw: lw * .72 });
    withBoil(0, () => {
      circle(dx - dr * .3, dy - dr * .3, dr * .24, { fill: 'rgba(255,255,255,.78)', stroke: null });
    });
  }

  plpFace(o, t, lw, A, { cy: -3.85, eyeDX: 1.46, cheekDX: 2.26, mouthY: -3.1, seed: 3 });
  A.top = toPx(0, -h);
  A.chest = toPx(0, -2.5);
  A.center = toPx(0, -h * .5);
  X.restore();
  A.bottom = toPx(0, 0);
}

// ---------- 4. Crumble Cookie (Frosted Cookie with Rainbow Sprinkles) ----------
function plpDrawCrumble(o, t, lw, A) {
  const rx = 4.45, h = 8.15;
  const lift = o.noFeet ? 0 : .62;
  const cols = { lt: PLP.crumbleCrustLt, base: PLP.crumbleCrust, dk: PLP.crumbleCrustDk };
  const body = plpPlushPts(rx, h, .76, .95, .1, 2.6);

  plpDrawFeet(o, t, lw, A, { cols, footX: 1.62, seed: 4 });

  X.save();
  X.translate(0, -lift);
  plpDrawArms(o, t, lw, A, { cols, armX: 4.08, armY: -3.55, seed: 4 });

  // Warm golden-yellow cookie crust
  X.save();
  tracePath(body, true, .92);
  X.fillStyle = linGrad(-2, -h, 2, 0, [[0, PLP.crumbleCrustLt], [.42, PLP.crumbleCrust], [1, PLP.crumbleCrustDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    ellipse(0, .15, 4.5, 1.5, { fill: 'rgba(110,65,15,.18)', stroke: null });
    plpFuzz(34, rx, h, 49, .22, .08);
  });
  X.restore();
  shape(body, { fill: null, stroke: PLP.ink, lw, smooth: .92 });

  // Fluffy scalloped snowy-white frosting cloud covering the front (leaving golden crust peeking around the rim)
  const frost = [];
  const fN = 28;
  for (let i = 0; i < fN; i++) {
    const a = (i / fN) * TAU - Math.PI / 2;
    const wave = 1 + .055 * Math.sin(a * 7 + .4);
    const fx = Math.cos(a) * 3.5 * wave;
    const fy = -4.22 + Math.sin(a) * 3.12 * wave;
    frost.push([fx, fy]);
  }
  X.save();
  tracePath(frost, true, .88);
  X.fillStyle = linGrad(0, -7.5, 0, -.9, [[0, PLP.crumbleFrost], [.78, PLP.crumbleFrost], [1, PLP.crumbleFrostSh]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    ellipse(-1.1, -6.1, 2.0, .95, { fill: 'rgba(255,255,255,.7)', stroke: null, rot: -.18 });
    plpFuzz(22, 3.3, 6.2, 53, .35, .05);
  });
  X.restore();
  shape(frost, { fill: null, stroke: PLP.ink, lw: lw * .8, smooth: .88 });

  // Colorful rainbow confetti sprinkles scattered on the frosting around the face
  const spr = [
    [-2.15, -6.15, .52, 0],
    [-.65, -6.65, -.38, 1],
    [.85, -6.55, .42, 2],
    [2.25, -5.85, -.55, 3],
    [-2.85, -4.85, -.68, 4],
    [2.85, -4.55, .62, 5],
    [-2.55, -2.25, .48, 2],
    [-1.15, -1.65, -.3, 0],
    [.45, -1.55, .36, 1],
    [1.95, -1.85, -.48, 4],
    [2.65, -2.95, .75, 3],
    [-.05, -5.85, -.25, 5],
  ];
  withBoil(0, () => {
    for (const [sx, sy, rot, ci] of spr) {
      const col = PLP.sprinkles[ci % PLP.sprinkles.length];
      const dx = Math.cos(rot) * .34, dy = Math.sin(rot) * .34;
      line([[sx - dx, sy - dy], [sx + dx, sy + dy]], { stroke: PLP.ink, lw: .42 });
      line([[sx - dx, sy - dy], [sx + dx, sy + dy]], { stroke: col, lw: .26 });
    }
  });

  plpFace(o, t, lw, A, { cy: -3.95, eyeDX: 1.42, cheekDX: 2.18, mouthY: -3.22, seed: 4 });
  A.top = toPx(0, -h);
  A.chest = toPx(0, -2.5);
  A.center = toPx(0, -h * .5);
  X.restore();
  A.bottom = toPx(0, 0);
}

// ---------- 5. Bertie Red Bus (London Double-Decker Red Bus) ----------
function plpDrawBertie(o, t, lw, A) {
  const drive = clamp(o.drive || 0);
  const cols = { lt: PLP.bertieRedLt, base: PLP.bertieRed, dk: PLP.bertieRedDk };

  // Cute puff clouds when driving
  if (drive > .05) {
    withBoil(0, () => {
      for (let i = 0; i < 3; i++) {
        const u = frac(t * 1.4 + i / 3);
        const px = -5.6 - u * 2.2;
        const py = -1.2 - u * 1.4 - Math.sin(u * Math.PI) * .35;
        const pr = (.34 + u * .38) * Math.sin(u * Math.PI) * drive;
        if (pr > .06) circle(px, py, pr, { fill: 'rgba(255,252,246,.82)', stroke: rgba(PLP.ink, .35), lw: lw * .55 });
      }
    });
  }

  // Soft stubby plush wheels tucked under the bottom corners (resting on y = 0)
  for (const sd of [-1, 1]) {
    const wx = sd * 2.85, wy = -.72;
    ellipse(wx, wy, 1.05, .72, { fill: PLP.bertieWheel, stroke: PLP.ink, lw: lw * .9 });
    circle(wx, wy, .32, { fill: PLP.bertieHub, stroke: null });
    A[sd < 0 ? 'footL' : 'footR'] = toPx(wx, 0);
  }

  // Cute stubby plushie arms matching the Palm Pals pack
  plpDrawArms(o, t, lw, A, { cols, armX: 4.35, armY: -3.45, armScale: .96, defArmL: .22 + drive * .32, defArmR: -.22 - drive * .32, seed: 5 });

  // Cute tiny plush wing mirrors perched beside the upper deck
  for (const sd of [-1, 1]) {
    line([[sd * 4.25, -6.55], [sd * 4.72, -6.78]], { stroke: PLP.ink, lw: lw * .85 });
    ellipse(sd * 4.82, -6.92, .34, .50, { fill: PLP.bertieRed, stroke: PLP.ink, lw: lw * .82 });
  }

  // Main pillowy rounded-rectangle London double-decker bus body
  const bus = [
    [-3.85, -8.85], [0, -9.02], [3.85, -8.85],
    [4.48, -8.0], [4.62, -4.8], [4.5, -1.65],
    [3.9, -.75], [0, -.64], [-3.9, -.75],
    [-4.5, -1.65], [-4.62, -4.8], [-4.48, -8.0],
  ];
  X.save();
  tracePath(bus, true, .55);
  X.fillStyle = linGrad(-2.5, -9, 2.5, -.6, [[0, PLP.bertieRedLt], [.38, PLP.bertieRed], [1, PLP.bertieRedDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    // Roof plush sheen
    ellipse(-1.2, -8.25, 2.6, .62, { fill: 'rgba(255,255,255,.26)', stroke: null });
    // Classic cream horizontal London bus belt stripe between decks
    shape(rectPts(-5, -5.3, 10, .82), { fill: PLP.bertieStripe, stroke: null });
    // Lower bumper shade
    shape(rectPts(-5, -1.25, 10, .8), { fill: 'rgba(90,10,16,.24)', stroke: null });
    plpFuzz(34, 4.3, 8.2, 67, .2, .08);
  });
  X.restore();
  shape(bus, { fill: null, stroke: PLP.ink, lw, smooth: .55 });

  // Upper deck double-decker windows (two side-by-side rounded stitched panes)
  for (const sd of [-1, 1]) {
    const x0 = sd < 0 ? -3.65 : .28;
    const wPts = [
      [x0 + .22, -7.95], [x0 + 3.15, -7.95], [x0 + 3.37, -7.72],
      [x0 + 3.37, -6.15], [x0 + 3.15, -5.92], [x0 + .22, -5.92],
      [x0, -6.15], [x0, -7.72],
    ];
    X.save();
    tracePath(wPts, true, .25);
    X.fillStyle = linGrad(x0, -8, x0, -5.9, [[0, '#D4F0FF'], [.55, PLP.bertieWindow], [1, PLP.bertieWindowDk]]);
    X.fill();
    X.clip();
    withBoil(0, () => {
      shape([[x0 + .45, -8.1], [x0 + 1.15, -8.1], [x0 + .35, -5.8], [x0 - .2, -5.8]], { fill: 'rgba(255,255,255,.45)', stroke: null });
      shape([[x0 + 1.45, -8.1], [x0 + 1.75, -8.1], [x0 + .95, -5.8], [x0 + .65, -5.8]], { fill: 'rgba(255,255,255,.32)', stroke: null });
    });
    X.restore();
    shape(wPts, { fill: null, stroke: PLP.ink, lw: lw * .8, smooth: .25 });
  }

  // Destination sign plaque reading "LONDON" centered on the stripe
  shape(rectPts(-2.35, -5.42, 4.7, 1.06), { fill: PLP.bertieSign, stroke: PLP.ink, lw: lw * .72, smooth: .15 });
  withBoil(0, () => {
    X.save();
    X.font = `700 .78px ${FONT_TALK}`;
    X.fillStyle = PLP.bertieSignTxt;
    X.textAlign = 'center';
    X.textBaseline = 'middle';
    X.fillText('LONDON', 0, -4.87);
    X.restore();
  });

  // Cheerful glowing headlights & neat front radiator grill
  for (const sd of [-1, 1]) {
    const hx = sd * 3.18, hy = -1.78;
    if (drive > .05) {
      circle(hx, hy, .98, { fill: rgba('#FFF099', .38 * drive), stroke: null });
    }
    circle(hx, hy, .56, { fill: PLP.bertieLight, stroke: PLP.ink, lw: lw * .78 });
    withBoil(0, () => circle(hx - .16, hy - .16, .16, { fill: '#FFFFFF', stroke: null }));
  }
  shape(rectPts(-1.35, -1.95, 2.7, .72), { fill: PLP.bertieGrill, stroke: PLP.ink, lw: lw * .68, smooth: .15 });
  withBoil(0, () => {
    for (const gx of [-.68, 0, .68]) {
      line([[gx, -1.82], [gx, -1.36]], { stroke: rgba(PLP.ink, .65), lw: lw * .52 });
    }
  });

  plpFace(o, t, lw, A, { cy: -3.45, eyeDX: 1.5, cheekDX: 2.38, cheekY: -2.85, mouthY: -2.76, blushCol: PLP.blushOnRed, seed: 5 });
  A.top = toPx(0, -9.02);
  A.chest = toPx(0, -2.5);
  A.center = toPx(0, -4.7);
  A.bottom = toPx(0, 0);
}

// Shared wavy squiggly mustache for Palm Pals parent characters (canonical signature trait).
function plpSquigglyMustache(cy, halfW, lw) {
  const sx = halfW / 2.18;
  const stache = [
    [-2.18 * sx, cy - .20], [-1.85 * sx, cy + .28], [-1.32 * sx, cy - .18], [-0.74 * sx, cy + .18],
    [-0.22 * sx, cy - .14], [0, cy], [0.22 * sx, cy - .14],
    [0.74 * sx, cy + .18], [1.32 * sx, cy - .18], [1.85 * sx, cy + .28], [2.18 * sx, cy - .20],
  ];
  line(stache, { stroke: PLP.ink, lw: lw * 2.55, smooth: true });
  line(stache, { stroke: PLP.mustacheFill, lw: lw * 1.15, smooth: true });
}

// ---------- 6. Eve's Dad (Larger Deep-Ocean Earth Globe Plushie with Squiggly Mustache) ----------
function plpDrawEveDad(o, t, lw, A) {
  const rx = 4.5, h = 8.6;
  const lift = o.noFeet ? 0 : .64;
  const cols = { lt: PLP.eveDadOceanLt, base: PLP.eveDadOcean, dk: PLP.eveDadOceanDk };
  const body = plpPlushPts(rx, h, .76, .95, 0, 2);

  plpDrawFeet(o, t, lw, A, { cols, footX: 1.72, footScale: 1.04, seed: 9 });

  X.save();
  X.translate(0, -lift);
  plpDrawArms(o, t, lw, A, { cols, armX: 4.12, armY: -3.75, armScale: 1.04, defArmL: .22, defArmR: -.22, seed: 9 });

  X.save();
  tracePath(body, true, .9);
  X.fillStyle = linGrad(-2.2, -h, 2.2, 0, [[0, PLP.eveDadOceanLt], [.4, PLP.eveDadOcean], [1, PLP.eveDadOceanDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    ellipse(-1.4, -6.5, 2.3, 1.25, { fill: 'rgba(255,255,255,.25)', stroke: null, rot: -.2 });
    const continents = [
      [[-4.9, -6.7], [-3.0, -7.6], [-1.5, -6.5], [-1.3, -5.0], [-2.5, -4.0], [-2.0, -2.6], [-3.8, -1.7], [-4.9, -3.6]],
      [[1.0, -8.2], [3.3, -7.8], [4.8, -5.9], [4.9, -3.9], [3.4, -3.5], [2.2, -4.6], [1.2, -6.1]],
      [[2.1, -2.4], [3.9, -2.3], [4.5, -1.0], [3.3, -.2], [1.9, -.8]],
    ];
    for (const cPts of continents) {
      shape(cPts, { fill: PLP.eveDadLand, stroke: PLP.eveDadLandDk, lw: lw * .65, smooth: .7 });
    }
    ellipse(0, .15, 4.5, 1.5, { fill: 'rgba(18,48,78,.2)', stroke: null });
    plpFuzz(38, rx, h, 71, .2, .08);
  });
  X.restore();

  shape(body, { fill: null, stroke: PLP.ink, lw, smooth: .9 });
  plpFace({ blush: .65, ...o }, t, lw, A, {
    cy: -4.35, eyeDX: 1.48, cheekDX: 2.35, cheekY: -3.55, mouthY: -2.55, seed: 9,
  });
  if (o.mustache !== false) plpSquigglyMustache(-3.42, 2.18, lw);
  A.top = toPx(0, -h);
  A.chest = toPx(0, -2.6);
  A.center = toPx(0, -h * .5);
  X.restore();
  A.bottom = toPx(0, 0);
}

// ---------- 7. Zelie's Papa (Taller Coral-Red Punch Cup Plushie with Yellow Straw & Squiggly Mustache) ----------
function plpDrawZeliePapa(o, t, lw, A) {
  const lift = o.noFeet ? 0 : .64;
  const cols = { lt: PLP.zeliePapaCupLt, base: PLP.zeliePapaCup, dk: PLP.zeliePapaCupDk };
  const jig = (o.bounce || 0) * Math.sin(t * 4.2) * .04;

  plpDrawFeet(o, t, lw, A, { cols, footX: 1.56, footScale: 1.02, seed: 12 });

  X.save();
  X.translate(0, -lift);
  plpDrawArms(o, t, lw, A, { cols, armX: 3.65, armY: -4.0, armScale: 1.02, defArmL: .16, defArmR: -.16, seed: 12 });

  // Golden-yellow straw sticking out of foam
  X.save();
  X.translate(1.4, -8.3);
  X.rotate(.22 + jig);
  const straw = [[-.46, .4], [-.46, -3.2], [.46, -3.2], [.46, .4]];
  shape(straw, { fill: PLP.zeliePapaStraw, stroke: PLP.ink, lw: lw * .9 });
  X.restore();

  // Tall coral-red fruit punch cup body
  const cup = [
    [-3.85, -8.3], [0, -8.5], [3.85, -8.3],
    [4.05, -5.8], [3.9, -2.8], [3.3, -.7],
    [1.75, -.04], [0, 0], [-1.75, -.04],
    [-3.3, -.7], [-3.9, -2.8], [-4.05, -5.8],
  ];
  X.save();
  tracePath(cup, true, .72);
  X.fillStyle = linGrad(-3.5, -8.5, 3.5, 0, [[0, PLP.zeliePapaCupLt], [.42, PLP.zeliePapaCup], [1, PLP.zeliePapaCupDk]]);
  X.fill();
  X.clip();
  withBoil(0, () => {
    ellipse(-2.1, -5.2, 1.15, 2.5, { fill: 'rgba(255,255,255,.22)', stroke: null, rot: -.06 });
    ellipse(0, .15, 3.8, 1.4, { fill: 'rgba(110,20,18,.18)', stroke: null });
    plpFuzz(34, 3.8, 8.5, 83, .2, .08);
  });
  X.restore();
  shape(cup, { fill: null, stroke: PLP.ink, lw, smooth: .72 });

  // Cream foam rim
  const foam = [
    [-4.1, -8.1], [-3.6, -9.0], [-2.1, -9.2], [-.5, -9.4], [1.2, -9.25], [2.9, -9.1], [4.0, -8.7],
    [4.1, -8.0], [3.2, -7.5], [1.5, -7.7], [0, -7.45], [-1.6, -7.7], [-3.4, -7.5],
  ];
  shape(foam, { fill: PLP.zelieFoam, stroke: PLP.ink, lw: lw * .9, smooth: .7 });

  plpFace({ blush: .55, ...o }, t, lw, A, {
    cy: -4.75, eyeDX: 1.48, cheekDX: 2.3, cheekY: -3.95, mouthY: -2.95, blushCol: PLP.blushOnRed, seed: 12,
  });
  if (o.mustache !== false) plpSquigglyMustache(-3.82, 2.15, lw);
  A.top = toPx(0, -11.4);
  A.chest = toPx(0, -2.7);
  A.center = toPx(0, -4.7);
  X.restore();
  A.bottom = toPx(0, 0);
}

// Emotes (pure vector / text overlays, SVG-export safe)
function plpEmote(kind, A, s, k, t) {
  const p = backOut(k);
  if (p < .02 || !A.top) return;
  const [tx, ty] = A.top;
  overlay(() => {
    X.save();
    X.translate(tx + s * 3.6, ty - s * .9 + wob(t, 1.4) * s * .22);
    X.scale(p, p);
    if (kind === 'heart') {
      shape([
        [0, 1.0 * s], [-1.15 * s, -.05 * s], [-.95 * s, -.85 * s], [-.35 * s, -1.0 * s],
        [0, -.45 * s], [.35 * s, -1.0 * s], [.95 * s, -.85 * s], [1.15 * s, -.05 * s],
      ], { fill: '#F26B94', stroke: PLP.ink, lwPx: 2.4, smooth: .5 });
    } else if (kind === 'spark') {
      shape(starPts(0, 0, 1.35 * s, .34, 4), { fill: '#FFF08A', stroke: PLP.ink, lwPx: 2.2 });
    } else if (kind === 'zzz') {
      X.font = `700 ${1.8 * s}px ${FONT_TALK}`;
      X.textAlign = 'center';
      X.fillStyle = '#5B7296';
      for (let i = 0; i < 3; i++) {
        const u = frac(t * .45 + i / 3);
        X.globalAlpha *= Math.sin(u * Math.PI);
        X.fillText('z', u * 1.6 * s, -u * 2.6 * s);
      }
    } else {
      const txt = kind === 'music' ? '♪' : kind, sz = s * 2.5;
      X.rotate(.1);
      X.font = `${sz}px ${FONT_SFX}`;
      X.textAlign = 'center';
      X.textBaseline = 'middle';
      X.lineJoin = 'round';
      X.lineWidth = sz * .14;
      X.strokeStyle = PLP.ink;
      X.strokeText(txt, 0, 0);
      X.fillStyle = kind === '?' ? '#7DC6F0' : '#FFE066';
      X.fillText(txt, 0, 0);
    }
    X.restore();
  });
}

// Group portrait of all 5 Palm Pals arranged neatly in two cozy rows so they fit inside [12, 12] local units.
function plpDrawGroup(x, y, s, o = {}) {
  const t = o.t ?? T;
  const party = !!o.party;
  const sub = s * .37;
  const layout = [
    // Back row (slightly raised, nestled behind front row)
    { pal: 'eve', dx: -2.55, dy: -3.95, ph: 0 },
    { pal: 'zelie', dx: 2.55, dy: -3.95, ph: .2 },
    // Front row
    { pal: 'kringle', dx: -4.55, dy: 0, ph: .4 },
    { pal: 'crumble', dx: 0, dy: .22, ph: .6 },
    { pal: 'bertie', dx: 4.55, dy: 0, ph: .8 },
  ];
  const anchors = {};
  for (const item of layout) {
    const wave = party ? Math.max(0, Math.sin((t * 1.45 - item.ph) * TAU)) : 0;
    const opts = {
      t,
      bounce: party ? .9 : .32,
      sway: party ? .6 : .25,
      jump: party ? wave * 1.1 : 0,
      sq: party ? -.08 * wave + .09 * Math.max(0, -Math.sin((t * 1.45 - item.ph) * TAU)) : 0,
      armL: party ? .28 + wave * .55 : undefined,
      armR: party ? -.28 - wave * .55 : undefined,
      eyes: party && wave > .45 ? 'happy' : (o.eyes || 'open'),
      mouth: party ? (wave > .35 ? 'grin' : 'smile') : (o.mouth || 'smile'),
      giggle: item.pal === 'zelie' && party ? 1 : 0,
      drive: item.pal === 'bertie' && party ? .9 : 0,
      emote: party && item.pal === 'zelie' ? 'music' : (party && item.pal === 'eve' ? 'heart' : undefined),
      emoteK: party ? .85 : 0,
      seed: Math.round(item.ph * 10),
      boil: o.boil,
      noShadow: o.noShadow,
    };
    anchors[item.pal] = palmPals(x + item.dx * s, y + item.dy * s, sub, { ...opts, pal: item.pal });
  }
  return { ...anchors.crumble, pals: anchors };
}

// Main rig function: draws any of the 5 Palm Pals (or 'all' for the 5-pal group).
function palmPals(x, y, s, o = {}) {
  const pal = plpResolvePal(o.pal, o.seed);
  if (pal === 'all') return plpDrawGroup(x, y, s, o);

  const t = o.t ?? T;
  const A = {};
  const lw = clamp(s * .15, 1.3, 4.8) / s;
  const seedOff = (o.seed ?? PALM_PALS_LIST.indexOf(pal)) * .85;
  const bouncePhase = Math.sin(t * 3.8 + seedOff);
  const bob = (o.bounce || 0) * Math.abs(bouncePhase) * .36;
  const bounceSq = (o.bounce || 0) * .045 * (1 - Math.abs(bouncePhase));
  const swayRot = (o.sway || 0) * Math.sin(t * 2.2 + seedOff) * .065;
  const air = (o.jump || 0) + bob;

  X.save();
  X.translate(x, y);
  X.scale(s * (o.flip ? -1 : 1), s);
  if (o.alpha != null) X.globalAlpha *= clamp(o.alpha);

  // Ground shadow
  if (!o.noShadow) {
    const f = 1 - clamp(air / 9) * .45;
    const shRx = (pal === 'zelie' || pal === 'zelie_papa') ? 3.7 : (pal === 'bertie' || pal === 'eve_dad') ? 4.5 : 4.2;
    ellipse(0, .18, shRx * f, .78 * f, { fill: 'rgba(42,24,38,.22)', stroke: null });
  }

  X.translate(0, (o.dy || 0) - air);
  const totalRot = (o.rot || 0) + swayRot;
  if (totalRot) {
    X.translate(0, -4.0);
    X.rotate(totalRot);
    X.translate(0, 4.0);
  }
  const sq = (o.sq || 0) + bounceSq;
  X.scale((o.sx ?? 1) * (1 + sq * .55), 1 - sq);

  withBoil(o.boil ?? .55, () => {
    if (pal === 'eve') plpDrawEve(o, t, lw, A);
    else if (pal === 'zelie') plpDrawZelie(o, t, lw, A);
    else if (pal === 'kringle') plpDrawKringle(o, t, lw, A);
    else if (pal === 'crumble') plpDrawCrumble(o, t, lw, A);
    else if (pal === 'eve_dad') plpDrawEveDad(o, t, lw, A);
    else if (pal === 'zelie_papa') plpDrawZeliePapa(o, t, lw, A);
    else plpDrawBertie(o, t, lw, A);
  }, 'palm_pal_' + pal);

  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .02) plpEmote(o.emote, A, s, o.emoteK ?? 1, t);
  return A;
}

// Convenience single-character wrappers for scenes and comics
const eveEarth = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'eve' });
const zelieLemonade = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'zelie' });
const kringleCookie = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'kringle' });
const crumbleCookie = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'crumble' });
const bertieRedBus = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'bertie' });
const eveDad = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'eve_dad' });
const zeliePapa = (x, y, s, o = {}) => palmPals(x, y, s, { ...o, pal: 'zelie_papa' });

// Registration: one Studio character panel with the Palm Pals pack + story parents.
CHARACTERS.palm_pals = {
  draw: palmPals,
  unit: PALM_PALS_UNIT,
  palette: PLP,
  size: [12, 12],
  poses: {
    'all five': (x, y, s, t) => palmPals(x, y, s, { t, pal: 'all' }),
    'Eve Earth': (x, y, s, t) => eveEarth(x, y, s, { t, sway: .55, bounce: .25 }),
    'Zelie Pink Lemonade': (x, y, s, t) => zelieLemonade(x, y, s, { t, bounce: .55, sway: .35, mouth: 'smile' }),
    'Kringle Cookie': (x, y, s, t) => kringleCookie(x, y, s, { t, bounce: .38, sway: .4 }),
    'Crumble Cookie': (x, y, s, t) => crumbleCookie(x, y, s, { t, bounce: .45, sway: .45 }),
    'Bertie Red Bus': (x, y, s, t) => bertieRedBus(x, y, s, { t, bounce: .4, sway: .25 }),
    "Eve's Dad": (x, y, s, t) => eveDad(x, y, s, { t, sway: .3, bounce: .2 }),
    "Zelie's Papa": (x, y, s, t) => zeliePapa(x, y, s, { t, sway: .3, bounce: .25 }),
    'party bounce': (x, y, s, t) => palmPals(x, y, s, { t, pal: 'all', party: true }),
    'Eve · calm': (x, y, s, t) => eveEarth(x, y, s, { t, eyes: 'happy', mouth: 'smile', sway: .7, emote: 'heart', emoteK: .75 + .25 * Math.sin(t * 2.6) }),
    'Zelie · giggle': (x, y, s, t) => zelieLemonade(x, y, s, { t, eyes: 'happy', mouth: 'laugh', giggle: 1, bounce: 1, sq: .08 * Math.abs(Math.sin(t * 9)), emote: 'music', emoteK: 1 }),
    'Kringle · cheer': (x, y, s, t) => kringleCookie(x, y, s, { t, eyes: 'sparkle', mouth: 'grin', armL: .78, armR: -.78, jump: 1.15 * Math.abs(Math.sin(t * 3.6)), emote: 'spark', emoteK: 1 }),
    'Crumble · talk': (x, y, s, t) => crumbleCookie(x, y, s, { t, mouth: lipFlap(t + .22, true, 'smile', ['open', 'o', 'grin', 'smile']), armL: .22 + .28 * Math.sin(t * 5.2), armR: -.22 + .24 * Math.cos(t * 4.4), lookX: .38 * Math.cos(t * 1.8), rot: -.05 + .04 * Math.sin(t * 3), bounce: .55 }),
    'Bertie · drive': (x, y, s, t) => bertieRedBus(x, y, s, { t, drive: 1, eyes: 'happy', mouth: 'grin', bounce: .85, rot: .05 * Math.sin(t * 7.5), sq: .06 * Math.abs(Math.sin(t * 7.5)) }),
  },
};
