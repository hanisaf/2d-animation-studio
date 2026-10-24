// characters/student/student.js: the DCES students, a crowd of side characters built from one parameterized rig.
//
// student(x, y, s, o) → anchors. (x, y) = floor point between the feet (screen px), s = px per local unit.
// Local units match Danny: feet y 0, hips −8.3, shoulders −14.5, eyes ≈ −22, hair top ≈ −29 (× look.h).
// o.look (from studentLook(seed), or your own object) picks the kid; everything else is the usual pose and face:
//   dy, jump, lean, tilt, turn, rot, sq, flip, breathe · handL/handR [x, y] IK targets, handPoseL/R: 'open' | 'palm' | 'point' | 'fist'
//   footL/footR · sit: 0..1 (1 = cross-legged on the floor, for story time)
//   outfit: 'greek' (or look.outfit): a knee-length chiton in look.robeCol with a look.trimCol hem and belt, bare arms, sandals,
//     a laurel wreath or a hair ribbon (look.wreath), an optional sash (look.sash); caps, glasses, bows and backpacks come off
//   eyes: 'open' | 'wide' | 'happy' | 'closed' | 'sleepy' | 'squeeze' | 'star' · lookX, lookY, blink · brows: 'normal' | 'up' | 'worried' | 'angry'
//   mouth: 'smile' | 'grin' | 'open' | 'o' | 'O' | 'flat' | 'frown' | 'yawn' (lipFlap works) · blush · emote, emoteK
// Anchors: head, mouth, top, eyeL, eyeR, chest, belly, handL, handR, footL, footR.

const STUDENT_UNIT = 4.2;   // ≈ 122 world units tall at look.h = 1, like Danny
const STU = {
  ink: '#3B2530', eyeWhite: '#FFF9F2', mouth: '#843C45',
  skins: ['#FBE0CF', '#F3CDB0', '#E6B48C', '#CC9367', '#A86E44', '#7E4E2E', '#5C3722'],
  hairs: ['#2A1E1A', '#47301F', '#6E4424', '#A8692E', '#E2BE69', '#161212', '#8A3A1E'],
  tops: ['#E25A5A', '#F2A33A', '#F2D04A', '#5BB56A', '#3F9FD8', '#5168C9', '#9A62D0', '#E77FB3', '#3BB3A8', '#F5F1E6'],
  bottoms: ['#3A4F7A', '#2F3B52', '#6B5B4A', '#4F6B3A', '#7A3A52', '#5A6E8E', '#2E2E36'],
  shoes: ['#E8E4DC', '#D34B4B', '#3B5BA8', '#2E2E36', '#E9A23B', '#6BB86B'],
  irises: ['#6B4423', '#3E2A1B', '#4A7A9A', '#5C7A3A', '#7A5A2A'],
  hairStyles: ['short', 'spiky', 'curly', 'afro', 'bob', 'ponytail', 'pigtails', 'long', 'buzz', 'hijab'],
  // the Greek outfit: linen, saffron, terracotta, sky and olive chitons; contrasting hems
  robes: ['#F7F1E3', '#F4E2B8', '#E9A23B', '#D9764E', '#7FB2DE', '#9DB86A', '#C79BD8', '#EE8E8E'],
  trims: ['#3F6FB0', '#C9653E', '#E3B03A', '#3BB3A8', '#8E3A52'],
  leaf: '#6E9A45', leafDk: '#4A7330', sandal: '#9A6236', sandalDk: '#6B4022',
};
// a stable random kid: skin, hair (style and colour), clothes, accessories and height, all from one seed
function studentLook(seed = 0) {
  const r = i => hash(seed * 13.37 + i * 7.11), pick = (arr, i) => arr[Math.floor(r(i) * arr.length) % arr.length];
  const hair = pick(STU.hairStyles, 1), longHair = ['bob', 'ponytail', 'pigtails', 'long'].includes(hair);
  const top = r(4) < .2 && longHair ? 'dress' : pick(['tee', 'tee', 'stripes', 'hoodie', 'sweater'], 5);
  return {
    skin: pick(STU.skins, 2), hairCol: pick(STU.hairs, 3), hair, iris: pick(STU.irises, 13),
    top, topCol: pick(STU.tops, 6), topCol2: pick(STU.tops, 7),
    bottom: top === 'dress' ? 'none' : longHair && r(8) < .4 ? 'skirt' : r(8) < .7 ? 'pants' : 'shorts', bottomCol: pick(STU.bottoms, 9), shoe: pick(STU.shoes, 10),
    glasses: r(11) < .22, cap: ['short', 'spiky', 'buzz'].includes(hair) && r(12) < .3, capCol: pick(STU.tops, 14),
    bow: longHair && r(15) < .45, bowCol: pick(['#E25A8A', '#F2D04A', '#9A62D0', '#3F9FD8'], 16), backpack: r(17) < .45, packCol: pick(STU.tops, 18),
    freckles: r(19) < .25, scarf: hair === 'hijab' ? pick(['#5168C9', '#9A62D0', '#3BB3A8', '#E25A5A', '#2E2E36'], 20) : null,
    h: .9 + .2 * r(21),
    robeCol: pick(STU.robes, 22), trimCol: pick(STU.trims, 23), wreath: r(24) < .5, sash: r(25) < .4,
  };
}

function student(x, y, s, o = {}) {
  const t = o.t ?? T, L = o.look || studentLook(o.seed ?? 0), A = {}, lw = clamp(s * .13, 1.4, 5) / s;
  const sit = clamp(o.sit || 0), air = o.jump || 0, dy = (o.dy || 0) + 5.0 * sit;
  X.save(); X.translate(x, y); X.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) { const q = 1 - clamp(air / 12) * .4; ellipse(0, .18, (3.7 + 1.6 * sit) * q, .68 * q, { fill: 'rgba(32,26,38,.22)', stroke: null }); }
  X.scale(L.h, L.h);
  X.translate(0, -air);
  if (o.rot) { X.translate(0, -10); X.rotate(o.rot); X.translate(0, 10); }
  if (o.sq) X.scale(1 + o.sq * .45, 1 - o.sq);
  withBoil(o.boil ?? .45, () => {
    const greek = (o.outfit ?? L.outfit) === 'greek';
    const hipY = -8.25 + dy, legCol = greek || L.bottom === 'shorts' || L.bottom === 'skirt' || L.bottom === 'none' ? L.skin : L.bottomCol;
    // legs: standing (IK to the ankle targets) or folded cross-legged
    [[-1, o.footL || [-1.5, -1.05]], [1, o.footR || [1.5, -1.05]]].forEach(([sd, target]) => {
      const hip = [sd * 1.25, hipY];
      if (sit > .5) {
        const knee = [sd * 4.0, -1.5], foot = [-sd * 1.0, -.8];
        stuLimb([hip, knee, foot], 2.1, L.bottom === 'pants' && !greek ? L.bottomCol : L.skin, lw);
        if (L.bottom === 'shorts' && !greek) stuLimb([hip, mixPt(hip, knee, .5)], 2.3, L.bottomCol, lw);
        if (greek) stuSandal(foot, -sd, lw, L.skin, .8); else stuShoe(foot, -sd, lw, L.shoe, .8);
        A[sd < 0 ? 'footL' : 'footR'] = toPx(...foot);
        return;
      }
      const { joint, end } = ik2(hip, target, 3.5, 3.76, [sd * .55, .12]);
      stuLimb([hip, joint, end], 2.0, legCol, lw);
      if (!greek && L.bottom === 'shorts') stuLimb([hip, mixPt(hip, joint, .75)], 2.3, L.bottomCol, lw);
      if (!greek && L.bottom === 'pants') circle(joint[0], joint[1], .9, { fill: L.bottomCol, stroke: null });
      if (greek) stuSandal(end, sd, lw, L.skin, 1); else stuShoe(end, sd, lw, L.shoe, 1);
      A[sd < 0 ? 'footL' : 'footR'] = toPx(end[0], end[1]);
    });
    X.save(); X.translate(0, dy); X.translate(0, -8.6); X.rotate(o.lean || 0); X.translate(0, 8.6);
    if (L.backpack && !greek) { shape(rectPts(-3.6, -15.2, 7.2, 6.4), { fill: L.packCol, stroke: STU.ink, lw, smooth: .3 }); }
    // skirt / shorts top / dress, then the shirt
    if (greek) { /* the chiton is drawn whole, with the shirt */ }
    else if (L.bottom === 'skirt' || L.top === 'dress') {
      const col = L.top === 'dress' ? L.topCol : L.bottomCol;
      shape([[-2.7, -10.3], [2.7, -10.3], [3.6 + sit, -6.2], [0, -5.8], [-3.6 - sit, -6.2]], { fill: col, stroke: STU.ink, lw, smooth: .25 });
    } else shape([[-2.65, -10.1], [2.65, -10.1], [2.55, -7.5], [.6, -7.5], [0, -8.2], [-.6, -7.5], [-2.55, -7.5]], { fill: L.bottomCol, stroke: STU.ink, lw: lw * .8, smooth: .3 });
    const breath = o.breathe === false ? 0 : .025 * wob(t, .35, (o.seed || 0) * .3);
    X.save(); X.translate(0, -14); X.scale(1 + breath, 1 + breath); X.translate(0, 14);
    if (greek) stuChiton(L, lw, sit); else stuShirt(L, lw);
    A.chest = toPx(0, -13.5); A.belly = toPx(0, -11.3);
    X.restore();
    shape(rectPts(-.82, -17.1, 1.64, 2.1), { fill: L.skin, stroke: STU.ink, lw, smooth: .3 });
    X.save(); X.translate(0, -22.3); X.rotate(o.tilt || 0);
    stuHead(o, greek ? { ...L, glasses: false, cap: false, bow: false } : L, t, lw, A);
    if (greek) stuWreath(L, o.turn || 0, lw);
    A.top = toPx(0, -6.9);
    X.restore();
    // arms: two-bone IK, sleeves to the elbow (hoodies and sweaters to the wrist)
    const defHand = sit > .5 ? [[-3.0, -6.4], [3.0, -6.4]] : [[-3.5, -9.8], [3.5, -9.8]];
    [[-1, o.handL || defHand[0], o.handPoseL || 'open'], [1, o.handR || defHand[1], o.handPoseR || 'open']].forEach(([sd, target, pose]) => {
      const shoulder = [sd * 2.7, -14.45], { joint, end } = ik2(shoulder, target, 2.5, 3.0, [sd * .8, .25]);
      const longSleeve = !greek && (L.top === 'hoodie' || L.top === 'sweater');
      stuLimb([shoulder, joint, end], .89, L.skin, lw);
      if (greek) stuLimb([shoulder, mixPt(shoulder, joint, .42)], 1.6, L.robeCol, lw);
      else stuLimb(longSleeve ? [shoulder, joint, mixPt(joint, end, .8)] : [shoulder, mixPt(shoulder, joint, .6)], 1.5, L.topCol, lw);
      stuHand(end, Math.atan2(end[1] - joint[1], end[0] - joint[0]), sd, pose, lw, L.skin);
      A[sd < 0 ? 'handL' : 'handR'] = toPx(end[0], end[1]);
    });
    X.restore();
  });
  X.restore();
  if (o.emote && (o.emoteK ?? 1) > .01) stuEmote(o.emote, A.top[0] + 4 * s * L.h, A.top[1] - 1 * s, s * L.h * (o.emoteK ?? 1), t);
  return A;
}

function stuLimb(points, width, fill, lw) {
  withBoil(0, () => { line(points, { stroke: STU.ink, lw: width + lw * 1.8 }); line(points, { stroke: fill, lw: width }); });
}
function stuShoe(p, sd, lw, col, k) {
  X.save(); X.translate(p[0], p[1]); X.scale(sd * 1.3 * k, 1.3 * k);
  shape([[-.7, -.22], [-.48, -.63], [.17, -.75], [.64, -.43], [1.03, .03], [.98, .43], [.49, .62], [-.55, .53], [-.83, .23]], { fill: col, stroke: STU.ink, lw, smooth: .55 });
  line([[-.8, .35], [1.0, .35]], { stroke: 'rgba(255,255,255,.7)', lw: .18 });
  X.restore();
}
function stuHand(p, ang, sd, pose, lw, skin) {
  X.save(); X.translate(p[0], p[1]); X.rotate(ang); if (sd < 0) X.scale(1, -1);
  shape([[-.2, -.48], [.35, -.54], [.79, -.3], [.9, .16], [.56, .55], [0, .49]], { fill: skin, stroke: STU.ink, lw, smooth: .7 });
  if (pose === 'point') stuLimb([[.65, -.16], [1.55, -.19]], .23, skin, lw * .55);
  else if (pose !== 'fist') {
    const spread = pose === 'palm' ? .3 : .13;
    [[.7, -.29], [.85, -.06], [.84, .17]].forEach(([ex, ey], i) => stuLimb([[ex, ey], [ex + .45, ey + (i - 1) * spread]], .19, skin, lw * .45));
    stuLimb([[.1, .33], [.5, .82]], .24, skin, lw * .45);
  }
  X.restore();
}
function stuShirt(L, lw) {
  const body = [[-1.1, -15.5], [-2.6, -15.2], [-3.05, -13.8], [-2.95, -10.05], [-2.1, -9.85], [0, -9.8], [2.1, -9.85], [2.95, -10.05], [3.05, -13.8], [2.6, -15.2], [1.1, -15.5]];
  shape(body, { fill: L.topCol, stroke: STU.ink, lw, smooth: .4 });
  X.save(); tracePath(body, true, .4); X.clip();
  if (L.top === 'stripes') for (let i = 0; i < 3; i++) shape(rectPts(-3.2, -14.2 + i * 1.5, 6.4, .6), { fill: L.topCol2, stroke: null });
  if (L.top === 'hoodie') { shape(rectPts(-1.6, -12.2, 3.2, 1.6), { fill: 'rgba(0,0,0,.12)', stroke: STU.ink, lw: lw * .5 }); line([[-.5, -15.2], [-.6, -13.4]], { stroke: '#F5F1E6', lw: .15 }); line([[.5, -15.2], [.6, -13.4]], { stroke: '#F5F1E6', lw: .15 }); }
  if (L.top === 'sweater') shape(rectPts(-3.2, -10.7, 6.4, .9), { fill: 'rgba(0,0,0,.14)', stroke: null });
  if (L.top === 'tee') circle(.9, -13.3, .7, { fill: L.topCol2, stroke: null });
  X.restore();
  if (L.top === 'hoodie') shape([[-2.3, -15.6], [0, -14.7], [2.3, -15.6], [1.6, -16.3], [-1.6, -16.3]], { fill: L.topCol, stroke: STU.ink, lw: lw * .7, smooth: .4 });
  else shape([[-1.0, -15.55], [0, -14.85], [1.0, -15.55]], { fill: L.skin, stroke: STU.ink, lw: lw * .6, smooth: .4 });
  if (L.backpack) [-1, 1].forEach(sd => line([[sd * 1.9, -15.3], [sd * 2.1, -11.2]], { stroke: L.packCol, lw: .55 }));
}

// The Greek outfit (outfit: 'greek'): a knee-length chiton pinned at both shoulders, with a patterned hem, a belt and an
// optional sash. sit widens the skirt over folded legs.
function stuChiton(L, lw, sit) {
  const f = 1.4 * clamp(sit), dk = mixCol(L.robeCol, '#5A3A40', .22);
  const body = [[-1.1, -15.5], [-2.7, -15.3], [-3.1, -13.8], [-2.85, -10.7], [-3.25 - f * .5, -8.2], [-3.85 - f, -5.3], [-2.0 - f * .5, -5.0], [0, -5.1], [2.0 + f * .5, -5.0], [3.85 + f, -5.3], [3.25 + f * .5, -8.2], [2.85, -10.7], [3.1, -13.8], [2.7, -15.3], [1.1, -15.5]];
  shape(body, { fill: L.robeCol, stroke: STU.ink, lw, smooth: .35 });
  X.save(); tracePath(body, true, .35); X.clip();
  withBoil(0, () => {
    [-1, 1].forEach(sd => shape([[sd * 3.9, -15.6], [sd * 2.6, -15.6], [sd * 2.3, -4.8], [sd * (4.2 + f), -4.8]], { fill: rgba(dk, .35), stroke: null }));
    [-1.6, -.5, .6, 1.7].forEach((x, i) => line([[x * .9, -9.8], [x * 1.05 + (i % 2 ? .1 : -.1), -7.4], [x * (1.2 + f * .2), -5.4]], { stroke: dk, lw: lw * 1.0, smooth: true }));   // skirt folds
    line([[-.9, -15.2], [-.6, -11.2]], { stroke: dk, lw: lw * .8 }); line([[.9, -15.2], [.6, -11.2]], { stroke: dk, lw: lw * .8 });
    shape([[-4.4 - f, -6.0], [4.4 + f, -6.0], [4.4 + f, -4.6], [-4.4 - f, -4.6]], { fill: L.trimCol, stroke: null });                // the hem band
    for (let i = 0; i < 8; i++) { const x = -3.4 - f + i * (6.8 + 2 * f) / 7.5; line([[x, -5.0], [x, -5.6], [x + .4, -5.6], [x + .4, -5.3]], { stroke: '#FFF9F2', lw: lw * .55 }); }   // a little meander
  });
  X.restore();
  shape([[-1.05, -15.5], [0, -14.4], [1.05, -15.5]], { fill: L.skin, stroke: STU.ink, lw: lw * .7, smooth: .5 });                  // the neckline
  shape([[-2.9, -11.2], [2.9, -11.2], [2.86, -10.45], [-2.86, -10.45]], { fill: L.trimCol, stroke: STU.ink, lw: lw * .7 });       // the belt
  if (L.sash) {
    const sash = [[-2.6, -15.3], [-1.4, -15.5], [3.0, -11.0], [2.9, -10.0], [2.2, -10.3]];
    shape(sash, { fill: L.trimCol, stroke: STU.ink, lw: lw * .8, smooth: .25 });
  }
  [-1, 1].forEach(sd => circle(sd * 2.0, -15.15, .3, { fill: '#E3B03A', stroke: STU.ink, lw: lw * .5 }));                         // shoulder pins
}
// A laurel wreath round the head (look.wreath) or a ribbon in the hair. Call it inside stuHead's transform (head-local units). The hijab gets a
// gold band instead.
function stuWreath(L, turn, lw) {
  X.save();
  if (L.hair === 'hijab') { line([[-4.9, -2.4], [-2.6, -4.6], [0, -5.1], [2.6, -4.6], [4.9, -2.4]].map(([x, y]) => [x - turn * .3, y]), { stroke: '#E3B03A', lw: .5, smooth: true }); X.restore(); return; }
  const lift = L.hair === 'afro' ? 1.4 : L.hair === 'spiky' ? .8 : 0, wide = L.hair === 'afro' ? 1.25 : 1.05;
  if (!L.wreath) {
    line([[-4.9, -2.0], [-3.0, -4.4 - lift * .5], [0, -5.0 - lift * .6], [3.0, -4.4 - lift * .5], [4.9, -2.0]].map(([x, y]) => [x * wide / 1.05 - turn * .3, y]), { stroke: STU.ink, lw: .95, smooth: true });
    line([[-4.9, -2.0], [-3.0, -4.4 - lift * .5], [0, -5.0 - lift * .6], [3.0, -4.4 - lift * .5], [4.9, -2.0]].map(([x, y]) => [x * wide / 1.05 - turn * .3, y]), { stroke: L.trimCol, lw: .6, smooth: true });
    X.restore(); return;
  }
  const pts = [[-4.3, -.6], [-4.5, -2.5], [-4.0, -4.4], [-2.8, -5.9], [-1.1, -6.7], [-.15, -6.9]].map(([x, y]) => [x * wide, y - lift * (1 - (y + 6.9) / 6.3 * .3)]);
  const leaf = (x, y, ang, col) => { X.save(); X.translate(x, y); X.rotate(ang); shape(ellPts(.6, 0, .66, .3, 10), { fill: col, stroke: STU.ink, lw: lw * .6, smooth: true }); X.restore(); };
  for (const sd of [-1, 1]) {
    const br = pts.map(([x, y]) => [sd * x - turn * .35, y]);
    line(br, { stroke: STU.leafDk, lw: lw * 1.1, smooth: true });
    for (let i = 0; i < br.length - 1; i++) {
      const [x0, y0] = br[i], [x1, y1] = br[i + 1], g = Math.atan2(y1 - y0, x1 - x0);
      leaf(x0, y0, g - sd * .75, STU.leafDk); leaf(x0, y0, g + sd * .75, STU.leaf);
      leaf(lerp(x0, x1, .5), lerp(y0, y1, .5), g + sd * .6, STU.leaf);
    }
  }
  X.restore();
}
// A leather sandal: a bare foot on a sole, with straps over the toes and round the ankle (sized like stuShoe).
function stuSandal(p, sd, lw, skin, k) {
  X.save(); X.translate(p[0], p[1]); X.scale(sd * 1.3 * k, 1.3 * k);
  shape([[-.8, .3], [-.78, .6], [1.0, .6], [1.1, .32]], { fill: STU.sandalDk, stroke: STU.ink, lw, smooth: .5 });
  shape([[-.7, .32], [-.65, -.38], [-.25, -.7], [.4, -.6], [.9, -.2], [1.05, .32]], { fill: skin, stroke: STU.ink, lw, smooth: .7 });
  line([[-.4, -.3], [.75, .1]], { stroke: STU.sandal, lw: lw * 2.2 }); line([[-.6, .02], [.95, .3]], { stroke: STU.sandal, lw: lw * 2.2 });
  line([[-.55, -.85], [-.38, -.38]], { stroke: STU.sandal, lw: lw * 2.0 });
  X.restore();
}

function stuHead(o, L, t, lw, A) {
  const turn = clamp(o.turn || 0, -1, 1), shift = turn * .62, hc = L.hairCol;
  // hair behind the head
  if (L.hair === 'long') shape([[-5.2, -2.5], [-5.4, 4.5], [-4.2, 7.6], [4.2, 7.6], [5.4, 4.5], [5.2, -2.5]], { fill: hc, stroke: STU.ink, lw, smooth: .5 });
  if (L.hair === 'bob') shape([[-5.3, -2.5], [-5.3, 3.4], [-4.0, 4.4], [4.0, 4.4], [5.3, 3.4], [5.3, -2.5]], { fill: hc, stroke: STU.ink, lw, smooth: .5 });
  if (L.hair === 'afro') circle(0, -1.6, 6.9, { fill: hc, stroke: STU.ink, lw });
  if (L.hair === 'ponytail') { shape([[3.6, -4.8], [6.6, -3.6], [7.2, .6], [6.0, 3.2], [5.2, .2], [4.4, -2.4]], { fill: hc, stroke: STU.ink, lw, smooth: .5 }); }
  if (L.hair === 'pigtails') [-1, 1].forEach(sd => shape([[sd * 4.4, -3.2], [sd * 6.8, -2.0], [sd * 7.2, 1.8], [sd * 6.0, 3.4], [sd * 5.1, .4]], { fill: hc, stroke: STU.ink, lw, smooth: .5 }));
  if (L.hair === 'hijab') shape([[-5.6, -3.0], [-5.8, 3.0], [-4.6, 7.4], [0, 8.4], [4.6, 7.4], [5.8, 3.0], [5.6, -3.0], [3.8, -6.2], [0, -7.0], [-3.8, -6.2]], { fill: L.scarf, stroke: STU.ink, lw, smooth: .5 });
  if (L.hair !== 'hijab') [-1, 1].forEach(sd => ellipse(sd * 4.63 - turn * .23, .68, .75, 1.12, { fill: L.skin, stroke: STU.ink, lw }));
  const face = [[0, -5.3], [3.35, -4.8], [4.55, -2.8], [4.7, .55], [4.27, 2.65], [3.25, 4.17], [1.42, 5.0], [0, 5.1], [-1.42, 5.0], [-3.25, 4.17], [-4.27, 2.65], [-4.7, .55], [-4.55, -2.8], [-3.35, -4.8]];
  shape(face, { fill: L.skin, stroke: STU.ink, lw, smooth: .8 });
  X.save(); tracePath(face, true, .8); X.clip(); ellipse(0, 5, 3.6, 1.25, { fill: 'rgba(0,0,0,.08)', stroke: null }); X.restore();
  [-1, 1].forEach(sd => ellipse(sd * 3.18 + shift * .35, 2.28, .9, .47, { fill: rgba('#D88B78', .24 * (o.blush ?? 1)), stroke: null }));
  if (L.freckles) [-1, 1].forEach(sd => [[0, 0], [.5, .3], [-.4, .35]].forEach(([fx, fy]) => circle(sd * 2.9 + shift * .35 + fx, 1.6 + fy, .12, { fill: '#A0603A', stroke: null })));
  [-1, 1].forEach(sd => {
    const ex = sd * 2.12 + shift, ey = .16;
    stuEye(ex, ey, o, L, t, sd, lw); A[sd < 0 ? 'eyeL' : 'eyeR'] = toPx(ex, ey);
    const b = o.brows || 'normal', raise = b === 'up' ? -.52 : b === 'angry' ? .3 : b === 'worried' ? (sd < 0 ? -.36 : .05) * (o.flip ? -1 : 1) : 0, inner = b === 'angry' ? .45 : b === 'worried' ? -.25 : 0;
    line([[ex - .9 * sd, -1.75 + raise - inner * (sd < 0 ? 0 : 1)], [ex + .9 * sd, -1.75 + raise - inner * (sd < 0 ? 1 : 0)]].map(p => p), { stroke: L.hair === 'hijab' ? '#34252B' : L.hairCol, lw: .42 });
  });
  if (L.glasses) { [-1, 1].forEach(sd => circle(sd * 2.12 + shift, .16, 1.55, { fill: null, stroke: '#2E2E36', lw: .28 })); line([[-.6 + shift, 0], [.6 + shift, 0]], { stroke: '#2E2E36', lw: .25 }); }
  ellipse(shift * 1.12, 2.01, .44, .36, { fill: 'rgba(0,0,0,.14)', stroke: null });
  stuMouth(o.mouth || 'smile', shift, lw);
  A.mouth = toPx(shift, 3.36); A.head = toPx(0, 0);
  // hair on top (the fringe)
  const fringe = {
    short: [[-4.6, -1.2], [-4.8, -3.6], [-3.6, -5.6], [-1.2, -6.6], [1.6, -6.5], [3.8, -5.4], [4.8, -3.2], [4.5, -1.2], [3.6, -3.4], [1.6, -4.2], [-.6, -3.8], [-2.8, -3.6], [-3.8, -2.4]],
    spiky: [[-4.6, -1.4], [-5.2, -4.6], [-3.6, -5.0], [-3.2, -7.4], [-1.4, -6.0], [0, -8.2], [1.2, -6.2], [3.0, -7.6], [3.4, -5.2], [5.2, -4.4], [4.5, -1.4], [3.0, -3.6], [0, -3.6], [-3.0, -3.4]],
    curly: [[-4.8, -.8], [-5.4, -3.2], [-4.4, -5.4], [-2.6, -6.8], [0, -7.2], [2.6, -6.8], [4.4, -5.4], [5.4, -3.2], [4.8, -.8], [3.6, -2.4], [1.8, -3.2], [0, -2.8], [-1.8, -3.2], [-3.6, -2.4]],
    afro: [[-4.7, -1.0], [-4.4, -3.6], [-2.4, -4.6], [0, -4.2], [2.4, -4.6], [4.4, -3.6], [4.7, -1.0], [5.6, -3.0], [3.6, -6.2], [0, -7.2], [-3.6, -6.2], [-5.6, -3.0]],
    bob: [[-5.3, 1.2], [-5.0, -3.4], [-3.4, -5.8], [0, -6.8], [3.4, -5.8], [5.0, -3.4], [5.3, 1.2], [4.3, -1.6], [3.0, -3.0], [.6, -3.4], [-1.0, -2.6], [-3.4, -3.0], [-4.3, -1.6]],
    long: [[-5.2, 1.0], [-5.0, -3.4], [-3.4, -5.8], [0, -6.8], [3.4, -5.8], [5.0, -3.4], [5.2, 1.0], [4.2, -2.0], [2.2, -3.8], [0, -3.2], [-2.2, -3.8], [-4.2, -2.0]],
    ponytail: [[-4.7, -1.0], [-4.9, -3.6], [-3.4, -5.8], [0, -6.6], [3.4, -5.8], [4.9, -3.6], [4.7, -1.0], [3.8, -3.2], [1.0, -4.0], [-1.6, -3.6], [-3.8, -2.8]],
    pigtails: [[-4.7, -1.0], [-4.9, -3.6], [-3.4, -5.8], [0, -6.6], [3.4, -5.8], [4.9, -3.6], [4.7, -1.0], [3.8, -3.2], [.4, -3.6], [0, -4.4], [-.4, -3.6], [-3.8, -3.2]],
    buzz: [[-4.6, -1.6], [-4.5, -3.8], [-3.0, -5.5], [0, -6.0], [3.0, -5.5], [4.5, -3.8], [4.6, -1.6], [3.8, -3.6], [0, -4.4], [-3.8, -3.6]],
  }[L.hair];
  if (fringe) shape(fringe, { fill: L.hair === 'buzz' ? mixCol(hc, L.skin, .35) : hc, stroke: STU.ink, lw, smooth: L.hair === 'spiky' ? .15 : .55 });
  if (L.hair === 'curly' || L.hair === 'afro') for (let i = 0; i < 7; i++) circle(-3.6 + i * 1.2, -5.2 - 1.2 * Math.sin(i / 6 * Math.PI) - (L.hair === 'afro' ? 1.2 : 0), .9, { fill: hc, stroke: null });
  if (L.hair === 'hijab') shape([[-4.9, -1.0], [-4.6, -4.0], [-2.6, -5.8], [0, -6.2], [2.6, -5.8], [4.6, -4.0], [4.9, -1.0], [4.0, -3.4], [0, -4.6], [-4.0, -3.4]], { fill: L.scarf, stroke: STU.ink, lw, smooth: .55 });
  if (L.cap) { shape([[-4.9, -3.2], [-4.4, -5.8], [-1.6, -7.2], [1.6, -7.2], [4.4, -5.8], [4.9, -3.2]], { fill: L.capCol, stroke: STU.ink, lw, smooth: .5 }); shape([[-1.0, -3.4], [6.6, -3.4], [6.4, -2.6], [-1.0, -2.8]], { fill: L.capCol, stroke: STU.ink, lw, smooth: .3 }); }
  if (L.bow) { const bx = L.hair === 'ponytail' ? 4.4 : -3.4, by = -5.0; shape([[bx, by], [bx - 1.6, by - 1.0], [bx - 1.6, by + 1.0]], { fill: L.bowCol, stroke: STU.ink, lw: lw * .7 }); shape([[bx, by], [bx + 1.6, by - 1.0], [bx + 1.6, by + 1.0]], { fill: L.bowCol, stroke: STU.ink, lw: lw * .7 }); circle(bx, by, .45, { fill: L.bowCol, stroke: STU.ink, lw: lw * .6 }); }
}
function stuEye(cx, cy, o, L, t, sd, lw) {
  let kind = o.eyes || 'open';
  if (kind === 'happy' || kind === 'closed') return line([[cx - 1.05, cy + .17], [cx, cy + (kind === 'happy' ? -.44 : .37)], [cx + 1.05, cy + .17]], { stroke: STU.ink, lw: lw * 1.8, smooth: true });
  if (kind === 'squeeze') { const d = sd < 0 ? 1 : -1; return line([[cx - d * .85, cy - .6], [cx + d * .6, cy], [cx - d * .85, cy + .6]], { stroke: STU.ink, lw: lw * 1.9 }); }
  if (kind === 'star') return shape(starPts(cx, cy, 1.3, .45, 5), { fill: '#F7D57A', stroke: STU.ink, lw });
  const wide = kind === 'wide' ? 1.15 : 1, rx = 1.2, ry = 1.33 * wide;
  ellipse(cx, cy, rx, ry, { fill: STU.eyeWhite, stroke: STU.ink, lw });
  const ix = cx + clamp(o.lookX || 0, -1, 1) * .35 * (o.flip ? -1 : 1), iy = cy + .08 + clamp(o.lookY || 0, -1, 1) * .3;
  X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); X.clip();
  circle(ix, iy, .82, { fill: L.iris, stroke: null }); circle(ix, iy, .52, { fill: '#1E1614', stroke: null }); circle(ix - .3, iy - .36, .26, { fill: '#FFFFFF', stroke: null });
  const ph = (t + 1.3 + (o.seed || 0) * .71) % 3.6;
  let lid = clamp(o.blink ?? (ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0));
  if (kind === 'sleepy') lid = Math.max(lid, .62);
  if (lid > .02) shape(rectPts(cx - 1.4, cy - 1.55, 2.8, 2.9 * lid), { fill: L.skin, stroke: null });
  X.restore();
  if (kind === 'sleepy') line([[cx - 1.15, cy - 1.33 + 2.9 * lid - .1], [cx + 1.15, cy - 1.33 + 2.9 * lid - .1]], { stroke: STU.ink, lw: lw * 1.1 });
  line([[cx - 1.12, cy - .34], [cx - .72, cy - 1.12 * wide], [cx + .25, cy - 1.31 * wide], [cx + 1.08, cy - .53]], { stroke: STU.ink, lw: lw * 1.15, smooth: true });
}
function stuMouth(kind, x, lw) {
  if (kind === 'smile' || kind === 'smirk') line([[x - 1.1, 2.8], [x - .5, 3.13], [x + .2, 3.22], [x + 1.12, kind === 'smirk' ? 2.87 : 2.8]], { stroke: STU.mouth, lw: lw * 1.35, smooth: true });
  else if (kind === 'grin' || kind === 'open') {
    shape([[x - 1.25, 2.7], [x, 2.89], [x + 1.3, 2.7], [x + .9, 3.73], [x, 3.94], [x - .9, 3.73]], { fill: STU.mouth, stroke: STU.ink, lw, smooth: .7 });
    if (kind === 'grin') shape(rectPts(x - 1.04, 2.7, 2.08, .48), { fill: STU.eyeWhite, stroke: null });
  } else if (kind === 'o') ellipse(x, 3.25, .36, .5, { fill: STU.mouth, stroke: STU.ink, lw });
  else if (kind === 'O' || kind === 'yawn') ellipse(x, 3.4, kind === 'yawn' ? 1.0 : .7, kind === 'yawn' ? 1.2 : .85, { fill: STU.mouth, stroke: STU.ink, lw });
  else if (kind === 'flat') line([[x - .83, 3.21], [x + .83, 3.21]], { stroke: STU.mouth, lw: lw * 1.25 });
  else if (kind === 'frown') line([[x - 1, 3.55], [x, 3.04], [x + 1, 3.55]], { stroke: STU.mouth, lw: lw * 1.25, smooth: true });
}
function stuEmote(kind, x, y, s, t) {
  if (kind === 'zzz') {
    X.save(); X.font = `700 ${2.2 * s}px ${FONT_TALK}`; X.textAlign = 'center'; X.fillStyle = '#5A6E8E';
    for (let i = 0; i < 3; i++) { const u = frac(t * .5 + i / 3); X.globalAlpha = Math.sin(u * Math.PI); X.fillText('z', x + u * 2.5 * s, y - u * 4 * s, s * 4); }
    X.restore(); return;
  }
  if (kind === 'heart') return shape([[x, y + 1.0 * s], [x - 1.15 * s, y - .05 * s], [x - .95 * s, y - .8 * s], [x - .35 * s, y - .95 * s], [x, y - .45 * s], [x + .35 * s, y - .95 * s], [x + .95 * s, y - .8 * s], [x + 1.15 * s, y - .05 * s]], { fill: '#F06C8E', stroke: STU.ink, lwPx: 2, smooth: .5 });
  X.save(); X.font = `${2.6 * s}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineWidth = .5 * s; X.strokeStyle = STU.ink; X.strokeText(kind, x, y); X.fillStyle = '#FFE066'; X.fillText(kind, x, y); X.restore();
}

// walk-cycle pose options (spread them into student): p = steps travelled (distance / ~44 world units), k = stride 0..1
function studentWalk(p, k = 1) {
  const q = Math.sin(p * Math.PI);
  return { footL: [-1.5 + .7 * k * q, -1.05 - 1.8 * k * Math.max(0, q)], footR: [1.5 - .7 * k * q, -1.05 - 1.8 * k * Math.max(0, -q)],
    handL: [-3.8 - .6 * k * q, -10.4], handR: [3.8 - .6 * k * q, -10.4], dy: .2 * k * Math.abs(q), lean: .03 * k };
}

// Registration: the studio's character browser and model sheets read this.
CHARACTERS.student = {
  draw: student, unit: STUDENT_UNIT, size: [14, 30],
  poses: {
    'rest': (x, y, s, t) => student(x, y, s, { t, seed: 1, mouth: 'smile' }),
    'cheer': (x, y, s, t) => student(x, y, s, { t, seed: 2, handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', mouth: 'grin', jump: 1.2 * Math.abs(Math.sin(t * 3)) }),
    'story time': (x, y, s, t) => student(x, y, s, { t, seed: 3, sit: 1, eyes: 'star', mouth: 'O', lookY: -.5 }),
    'asleep': (x, y, s, t) => student(x, y, s, { t, seed: 4, sit: 1, eyes: 'closed', mouth: 'o', tilt: .25 + .05 * Math.sin(t * 1.5), emote: 'zzz' }),
    'walk': (x, y, s, t) => student(x, y, s, { t, seed: 6, ...studentWalk(t * 2.4), mouth: 'grin' }),
    'hand up': (x, y, s, t) => student(x, y, s, { t, seed: 5, handR: [4.0, -22], handPoseR: 'palm', mouth: 'grin', brows: 'up' }),
    'greek': (x, y, s, t) => student(x, y, s, { t, seed: 31, outfit: 'greek', mouth: 'smile' }),
    'greek · teach us!': (x, y, s, t) => student(x, y, s, { t, seed: 44, outfit: 'greek', handR: [4.0, -21.5], handPoseR: 'palm', handL: [-3.2, -12.6], handPoseL: 'fist', mouth: lipFlap(t, true), brows: 'up', eyes: 'wide', jump: .5 * Math.max(0, Math.sin(t * 6)) }),
    'greek · astronomy': (x, y, s, t) => student(x, y, s, { t, seed: 52, outfit: 'greek', handR: [3.6, -20.6], handPoseR: 'point', lookY: -.9, lookX: .4, tilt: -.12, mouth: 'O', eyes: 'star' }),
    'greek · puzzled': (x, y, s, t) => student(x, y, s, { t, seed: 67, outfit: 'greek', handR: [1.5, -16.3 - .15 * Math.max(0, Math.sin(t * 5))], handPoseR: 'fist', handL: [.9, -11.9], handPoseL: 'open', tilt: .14, brows: 'worried', mouth: 'flat', lookX: -.6, emote: '?' }),
    'greek · story time': (x, y, s, t) => student(x, y, s, { t, seed: 73, outfit: 'greek', sit: 1, eyes: 'star', mouth: 'O', lookY: -.5 }),
    'greek · class': (x, y, s, t) => { let A; [31, 44, 52, 67, 73].forEach((seed, i) => { A = student(x + (i - 2) * 10 * s, y, s, { t, seed, outfit: 'greek', mouth: 'grin', handR: i % 2 ? [4.0, -20.5] : undefined, handPoseR: 'palm' }); }); return A; },
    'crowd': (x, y, s, t) => { let A; for (let i = 0; i < 6; i++) A = student(x + (i - 2.5) * 9 * s, y, s, { t, seed: 10 + i, mouth: 'grin', handR: i % 2 ? [4.0, -20] : undefined, handPoseR: 'palm' }); return A; },
  },
};
