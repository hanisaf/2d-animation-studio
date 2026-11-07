// scenes/pokemon/scene64_card_collectors/props.js: the kids' trading cards and the full-frame explainer inserts of scene 64.
// The creatures on the cards are the studio's own (Captain Fin, Blazewyrm, Sproutbun, Starpaw), not real Pokemon.
// Everything is namespaced pk* (scripts share one global scope). Every function is a pure function of its arguments.
//   pkCard(cx, cy, w, ang, o)          a card in screen space: o.kind (creature), o.holo 0..1, o.back, o.promo, o.t, o.alpha
//   pkCardFloor(P, x, z, ang, o)       the same card lying flat on the floor of a perspective set (w = 26 world units)
//   pkBinder(P, x, z, ang, t)          an open binder of nine-pocket pages on the floor
//   pkInsert*(t, t0)                   the full-frame inserts; t0 is the insert's start time
const PK = (() => {
  const C = {
    ink: '#2B2233', frame: '#F3C93E', frameDk: '#C99A1C', frameLt: '#FFE58A', face: '#FFF8E6', box: '#F4ECD8', bar: '#D9CDB2',
    back: '#2F4C9A', backDk: '#1F3270', backLt: '#5B7BD0', star: '#FFD95A',
    fin: '#4A8FE0', finDk: '#2E66B4', finBelly: '#CDEBFF', cape: '#E0413A', capeDk: '#A82A2A', mask: '#22263A',
    drag: '#E0533A', dragDk: '#A93522', dragBelly: '#FFD27A', wing: '#B8402E', flame: '#FFB23A', flameLt: '#FFF1A0',
    sprout: '#7CCB5A', sproutDk: '#4E9A38', sproutBelly: '#E6F6C8', leaf: '#3FA24A',
    cat: '#9A6BD8', catDk: '#6C45A8', catBelly: '#EBDDFF',
    gold: '#F2C440', goldDk: '#B98A22', money: '#4DB86A', moneyDk: '#2F8A48',
  };
  const BG = { fin: ['#BFE6FF', '#6FB4F0'], dragon: ['#FFD8A8', '#F08A5A'], sprout: ['#E4F7C8', '#9ED67A'], star: ['#E8DAFF', '#A98AE8'] };
  const NAME = { fin: 'Captain Fin', dragon: 'Blazewyrm', sprout: 'Sproutbun', star: 'Starpaw' };
  const HP = { fin: 110, dragon: 180, sprout: 60, star: 90 };
  const TYPE = { fin: '#3D86D8', dragon: '#E0533A', sprout: '#52A83E', star: '#9A6BD8' };
  const O = (lw = 1.2) => ({ stroke: C.ink, lwPx: lw });

  function text(s, x, y, size, col, o = {}) {
    X.save(); X.font = `${o.weight ?? 700} ${size}px ${o.font ?? FONT_TALK}`; X.textAlign = o.align ?? 'center'; X.textBaseline = 'middle';
    if (o.outline) { X.lineJoin = 'round'; X.lineWidth = o.outline; X.strokeStyle = o.outlineCol ?? C.ink; X.strokeText(s, x, y); }
    X.fillStyle = col; X.fillText(s, x, y); X.restore();
  }

  // ---------- the creatures, drawn in a 52 × 30 art window centred on (0, 0) ----------
  function finArt(t) {                                             // a superhero dolphin with a red cape and a mask
    const b = Math.sin(t * 3) * 1.2;
    X.save(); X.translate(0, b);
    shape([[-10, -3], [-22, -9 + Math.sin(t * 6) * 2], [-24, 4], [-12, 7]], { fill: C.cape, ...O(1), smooth: true });   // the cape
    shape([[-16, 4], [-8, -7], [6, -9], [16, -4], [21, 0], [15, 3], [4, 7], [-8, 8]], { fill: C.fin, ...O(), smooth: true });
    shape([[-6, 6], [4, 6.5], [13, 2.5], [4, 3], [-6, 3]], { fill: C.finBelly, stroke: null, smooth: true });
    shape([[-1, -8], [2, -14], [5, -8.5]], { fill: C.finDk, ...O(1) });                                                  // the dorsal fin
    shape([[-15, 3], [-21, -2], [-20, 4], [-22, 9], [-14, 6]], { fill: C.finDk, ...O(1), smooth: .3 });                  // the tail
    shape([[6, -5.5], [14, -5], [14, -2], [6, -2.5]], { fill: C.mask, stroke: null, smooth: true });                     // the mask
    circle(10.5, -3.8, 1.3, { fill: '#FFFFFF', stroke: null });
    shape(starPts(0, 1, 3.2, .45, 5), { fill: C.star, ...O(.8) });                                                       // the chest emblem
    X.restore();
  }
  function dragonArt(t) {                                          // a giant red dragon breathing a little flame
    const fl = Math.sin(t * 2) * .5 + .5, wf = Math.sin(t * 4) * 2;
    shape([[-4, -2], [-16, -14 - wf], [-12, -6], [-20, -8 - wf], [-10, 0]], { fill: C.wing, ...O(1), smooth: .2 });     // the far wing
    shape([[-12, 10], [-8, -2], [0, -6], [8, -4], [10, 4], [6, 11]], { fill: C.drag, ...O(), smooth: true });
    shape([[-14, 9], [-22, 12], [-24, 6], [-20, 8]], { fill: C.drag, ...O(1), smooth: true });                            // the tail
    shape([[-6, 9], [-3, 1], [4, 1], [6, 9]], { fill: C.dragBelly, stroke: null, smooth: true });
    shape([[6, -4], [8, -12], [16, -13], [19, -9], [15, -6], [9, -2]], { fill: C.drag, ...O(), smooth: .3 });          // the head
    shape([[9, -12], [8, -17], [12, -13]], { fill: C.dragBelly, ...O(.8) });                                              // a horn
    circle(14, -10.5, 1.2, { fill: C.ink, stroke: null });
    shape([[2, -4], [10, -16 + wf], [8, -6], [14, -10 + wf], [6, 0]], { fill: C.wing, ...O(1), smooth: .2 });           // the near wing
    shape([[19, -9], [24 + 2 * fl, -12], [27 + 3 * fl, -9], [24 + 2 * fl, -6]], { fill: C.flame, stroke: null, smooth: true, alpha: .9 });
    shape([[19.5, -9], [23, -10], [24.5, -9], [23, -8]], { fill: C.flameLt, stroke: null, smooth: true });
  }
  function sproutArt(t) {                                          // a round green bunny with a leaf on its head
    const h = Math.abs(Math.sin(t * 3)) * 2;
    X.save(); X.translate(0, -h);
    for (const s of [-1, 1]) shape([[s * 3, -6], [s * 6, -17], [s * 8, -16], [s * 7, -5]], { fill: C.sprout, ...O(1), smooth: true });
    shape(ellPts(0, 2, 10, 9), { fill: C.sprout, ...O(), smooth: true });
    shape(ellPts(0, 5, 6, 5), { fill: C.sproutBelly, stroke: null, smooth: true });
    shape([[0, -7], [4, -13], [8, -12], [3, -8]], { fill: C.leaf, ...O(.8), smooth: true });
    for (const s of [-1, 1]) circle(s * 3.5, -.5, 1.2, { fill: C.ink, stroke: null });
    shape([[-1.2, 2], [0, 3.2], [1.2, 2]], { fill: null, ...O(.8) });
    X.restore();
  }
  function starArt(t) {                                            // a purple star-cat
    const w = Math.sin(t * 2.5) * 2;
    shape([[8, 6], [16, 2 + w], [18, -4 + w]], { fill: null, stroke: C.catDk, lwPx: 2.2, smooth: true });                 // the tail
    for (const s of [-1, 1]) shape([[s * 4, -6], [s * 9, -14], [s * 9, -4]], { fill: C.cat, ...O(1) });
    shape(ellPts(0, 1, 10, 9), { fill: C.cat, ...O(), smooth: true });
    shape(ellPts(0, 4, 5.5, 4), { fill: C.catBelly, stroke: null, smooth: true });
    shape(starPts(0, -4.5, 3, .45, 5, t), { fill: C.star, ...O(.7) });
    for (const s of [-1, 1]) shape(ellPts(s * 3.6, 0, 1.2, 1.6), { fill: C.ink, stroke: null, smooth: true });
  }
  const ART = { fin: finArt, dragon: dragonArt, sprout: sproutArt, star: starArt };

  // ---------- a card, 63 × 88 local units centred on (0, 0) ----------
  function holoBand(t, x0, y0, w, h, k) {
    const ph = ((t * .35) % 1) * 2.4 - .7, g = X.createLinearGradient(x0 + w * ph - 30, y0, x0 + w * ph + 30, y0 + h);
    ['rgba(255,120,160,0)', 'rgba(255,120,160,.55)', 'rgba(255,240,140,.7)', 'rgba(130,240,255,.6)', 'rgba(190,140,255,.5)', 'rgba(190,140,255,0)']
      .forEach((c, i) => g.addColorStop(i / 5, c));
    X.save(); X.globalAlpha *= k; X.globalCompositeOperation = 'lighter'; X.fillStyle = g; X.fillRect(x0, y0, w, h); X.restore();
  }
  function cardBack(t) {
    shape(rectPts(-31.5, -44, 63, 88), { fill: C.back, ...O(1.6), smooth: .06 });
    shape(rectPts(-27, -39.5, 54, 79), { fill: C.backDk, stroke: C.backLt, lwPx: 1, smooth: .06 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .4; shape([[0, 0], [Math.cos(a) * 30, Math.sin(a) * 40], [Math.cos(a + .25) * 30, Math.sin(a + .25) * 40]], { fill: rgba(C.backLt, .35), stroke: null }); }
    circle(0, 0, 14, { fill: C.back, stroke: C.star, lwPx: 1.4 });
    shape(starPts(0, 0, 11, .45, 5), { fill: C.star, ...O(1) });
  }
  function cardFace(o) {
    const k = o.kind || 'fin', t = o.t ?? 0;
    shape(rectPts(-31.5, -44, 63, 88), { fill: o.promo ? C.frameLt : C.frame, ...O(1.6), smooth: .06 });
    shape(rectPts(-28, -40.5, 56, 81), { fill: C.face, stroke: C.frameDk, lwPx: .8, smooth: .04 });
    text(NAME[k], -25, -35, 6.2, C.ink, { align: 'left', weight: 800 });
    text(`HP ${HP[k]}`, 19, -35, 5, '#C0392B', { weight: 800 });
    circle(25, -35, 2.4, { fill: TYPE[k], ...O(.8) });
    // the art window
    X.save(); X.beginPath(); X.rect(-26, -31, 52, 34); X.clip();
    const g = X.createLinearGradient(0, -31, 0, 3); g.addColorStop(0, BG[k][0]); g.addColorStop(1, BG[k][1]); X.fillStyle = g; X.fillRect(-26, -31, 52, 34);
    for (let i = 0; i < 5; i++) circle(-22 + i * 11, -26 + (i % 2) * 22, 2 + hash(i + 3) * 2.5, { fill: 'rgba(255,255,255,.35)', stroke: null });
    X.save(); X.translate(0, -13); ART[k](t); X.restore();
    if (o.holo) holoBand(t, -26, -31, 52, 34, o.holo);
    X.restore();
    shape(rectPts(-26, -31, 52, 34), { fill: null, stroke: C.frameDk, lwPx: 1 });
    // two attacks
    for (const [y, dmg] of [[11, HP[k] > 100 ? 60 : 20], [24, HP[k] > 100 ? 130 : 50]]) {
      circle(-22, y, 2.2, { fill: TYPE[k], ...O(.6) });
      shape(rectPts(-17, y - 1.6, 26, 3.2), { fill: C.bar, stroke: null, smooth: .5 });
      text(String(dmg), 21, y, 5.5, C.ink, { weight: 800 });
    }
    shape(rectPts(-25, 32, 50, 2), { fill: C.bar, stroke: null, smooth: .5 });
    if (o.promo) { X.save(); X.translate(16, -24); X.rotate(-.25); shape(rectPts(-11, -4, 22, 8), { fill: '#E0413A', ...O(.8), smooth: .3 }); text('PROMO', 0, .3, 4.6, '#FFFFFF', { weight: 800 }); X.restore(); }
    if (o.holo) { X.save(); X.beginPath(); X.rect(-31.5, -44, 63, 88); X.clip(); holoBand(t + .4, -31.5, -44, 63, 88, o.holo * .35); X.restore(); }
  }
  function card(cx, cy, w, ang, o = {}) {
    X.save(); X.translate(cx, cy); X.rotate(ang || 0); X.scale(w / 63, w / 63);
    if (o.alpha != null) X.globalAlpha *= o.alpha;
    if (o.shadow) shape(rectPts(-29, -40, 63, 88), { fill: 'rgba(30,20,40,.22)', stroke: null, smooth: .06 });
    if (o.back) cardBack(o.t ?? 0); else cardFace(o);
    X.restore();
  }

  // ---------- on the floor of a perspective set: an affine map of the card's local plane onto the floor ----------
  function onFloor(P, x, z, ang, w, fn) {
    if (!P.visible(z)) return;
    const c = Math.cos(ang), s = Math.sin(ang), u = w / 63;
    const p0 = P.p(x, .4, z), pu = P.p(x + c * u, .4, z + s * u), pv = P.p(x - s * u, .4, z + c * u);   // local +x and +y (toward the camera: −Z)
    X.save(); X.transform(pu[0] - p0[0], pu[1] - p0[1], -(pv[0] - p0[0]), -(pv[1] - p0[1]), p0[0], p0[1]); fn(); X.restore();
  }
  const cardFloor = (P, x, z, ang, o = {}) => onFloor(P, x, z, ang, 15, () => { if (o.back) cardBack(o.t ?? 0); else cardFace(o); });
  function binder(P, x, z, ang, t) {
    onFloor(P, x, z, ang, 66, () => {
      shape(rectPts(-66, -46, 132, 92), { fill: '#3E5F96', ...O(1.4), smooth: .05 });
      const kinds = ['fin', 'dragon', 'sprout', 'star', 'sprout', 'fin', 'star', 'dragon', 'fin'];
      for (const side of [-1, 1]) {
        shape(rectPts(side < 0 ? -62 : 2, -42, 60, 84), { fill: '#F6F8FB', stroke: '#B9C2D0', lwPx: .8 });
        for (let i = 0; i < 9; i++) { const cx = (side < 0 ? -52 : 12) + (i % 3) * 20, cy = -28 + Math.floor(i / 3) * 28;
          if (hash(i * 7 + side) < .82) { X.save(); X.translate(cx, cy); X.scale(17 / 63, 17 / 63); cardFace({ kind: kinds[(i + (side > 0 ? 4 : 0)) % 9], t, holo: i === 4 && side > 0 ? .8 : 0 }); X.restore(); }
          else shape(rectPts(cx - 8.5, cy - 12, 17, 24), { fill: null, stroke: '#C9D0DA', lwPx: .6, dash: [2, 2] }); }
      }
      for (let i = 0; i < 4; i++) circle(0, -30 + i * 20, 2.2, { fill: '#C9D1D8', ...O(.6) });   // the rings
    });
  }

  // ---------- the full-frame inserts: a pastel panel with a REASON ribbon ----------
  function panelBG(t, c0, c1) {
    const g = X.createRadialGradient(W / 2, H * .42, 80, W / 2, H * .5, W * .7); g.addColorStop(0, c0); g.addColorStop(1, c1);
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 46; i++) { const x = hash(i) * W, y = (hash(i + 50) * H + t * (12 + 20 * hash(i + 9))) % H, r = 4 + 9 * hash(i + 20);
      shape(i % 3 ? ellPts(x, y, r, r, 10) : starPts(x, y, r * 1.4, .45, 5, t + i), { fill: 'rgba(255,255,255,.28)', stroke: null }); }
  }
  function ribbon(txt, sub, t, t0, col) {
    const k = backOut(seg(t, t0, t0 + .45)); if (k <= 0) return;
    X.save(); X.translate(330, 120); X.rotate(-.05); X.scale(k, k);
    shape(rectPts(-250, -58, 500, 116), { fill: col, ...O(6), smooth: .15 });
    text(txt, 0, -10, 64, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 10 });
    if (sub) text(sub, 0, 40, 30, '#FFFFFF', { weight: 800, outline: 6 });
    X.restore();
  }
  const pop = (t, a, d = .35) => backOut(seg(t, a, a + d));

  // 34 BILLION: a counter and a tower of card packs
  function insBillions(t, t0) {
    panelBG(t, '#FFF3C4', '#F6B94A');
    const u = ease(seg(t, t0 + .3, t0 + 2.4)), n = Math.round(34 * u);
    for (let i = 0; i < 14; i++) { const k = pop(t, t0 + .2 + i * .12); if (k <= 0) continue;
      const x = W / 2 + (i % 2 ? 1 : -1) * (300 + (i % 4) * 70) * .9, y = H * .9 - Math.floor(i / 2) * 70;
      card(x, y, 120 * k, (hash(i) - .5) * .5, { kind: ['fin', 'dragon', 'sprout', 'star'][i % 4], t, back: i % 3 === 0, shadow: true }); }
    const k = pop(t, t0 + .1, .5);
    X.save(); X.translate(W / 2, H * .42); X.scale(k, k); X.rotate(-.03 + .02 * Math.sin(t * 3));
    text(`$${n}`, 0, -40, 250, C.money, { font: FONT_SFX, weight: 400, outline: 26 });
    text('BILLION', 0, 140, 130, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 20 });
    X.restore();
    if (t > t0 + 2.4) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t; shape(starPts(W / 2 + Math.cos(a) * 520, H * .42 + Math.sin(a) * 260, 26, .4, 4, t * 3), { fill: '#FFFFFF', stroke: null, alpha: .8 * Math.abs(Math.sin(t * 4 + i)) }); }
    ribbon('LIFETIME SALES', null, t, t0 + .2, '#2F8A48');
  }

  // REASON 1: three creature cards fan out
  function insCreatures(t, t0) {
    panelBG(t, '#FFE8F1', '#F49AC0');
    const kinds = ['sprout', 'fin', 'dragon', 'star'];
    kinds.forEach((kd, i) => { const k = pop(t, t0 + .15 + i * .45, .45); if (k <= 0) return;
      const a = (i - 1.5) * .22, x = W / 2 + (i - 1.5) * 330, y = H * .52 + Math.abs(i - 1.5) * 40 + 8 * Math.sin(t * 2 + i);
      card(x, y, 300 * k, a, { kind: kd, t, holo: kd === 'dragon' ? .8 : 0, shadow: true }); });
    ribbon('REASON 1', 'cute & cool creatures', t, t0, '#D0508E');
  }

  // REASON 2: a holo card hung like a painting in a gallery
  function insArt(t, t0) {
    const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F3E7D8'); g.addColorStop(.78, '#E6D3BC'); g.addColorStop(.78, '#B98E66'); g.addColorStop(1, '#9C7452');
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    // a spotlight
    const sp = X.createRadialGradient(W / 2, H * .44, 40, W / 2, H * .44, 620); sp.addColorStop(0, 'rgba(255,250,225,.75)'); sp.addColorStop(1, 'rgba(255,250,225,0)');
    X.fillStyle = sp; X.fillRect(0, 0, W, H);
    // two "modern art" paintings, blurry and plain, on either side
    for (const s of [-1, 1]) { const x = W / 2 + s * 640, y = H * .42;
      shape(rectPts(x - 150, y - 190, 300, 380), { fill: '#FFFFFF', stroke: '#8A6A3A', lwPx: 14 });
      shape(rectPts(x - 120, y - 160, 240, 320), { fill: s < 0 ? '#E8E2D6' : '#DCE6EA', stroke: null });
      if (s < 0) { shape(rectPts(x - 60, y - 60, 120, 120), { fill: '#C9483F', stroke: null }); }
      else line([[x - 90, y + 80], [x + 70, y - 100]], { stroke: '#3B3B3B', lwPx: 6 });
      text(s < 0 ? '"Red Square"' : '"Line"', x, y + 240, 30, '#6A5440', { weight: 600 }); }
    const k = pop(t, t0 + .1, .6), zoom = 1 + .05 * seg(t, t0, t0 + 6);
    X.save(); X.translate(W / 2, H * .44); X.scale(zoom, zoom);
    shape(rectPts(-250 * k, -320 * k, 500 * k, 640 * k), { fill: C.gold, ...O(6), smooth: .02 });
    shape(rectPts(-222 * k, -292 * k, 444 * k, 584 * k), { fill: '#3A2A1E', stroke: C.goldDk, lwPx: 4 });
    card(0, 0, 380 * k, 0, { kind: 'dragon', t, holo: 1 });
    X.restore();
    for (let i = 0; i < 5; i++) { const a = t * 1.3 + i * 1.26, r = 300 + 40 * Math.sin(t + i);
      shape(starPts(W / 2 + Math.cos(a) * r, H * .44 + Math.sin(a) * r * 1.1, 22 + 8 * Math.sin(t * 5 + i), .35, 4, t * 2), { fill: '#FFFFFF', stroke: null, alpha: .85 }); }
    ribbon('REASON 2', 'beautiful art', t, t0, '#C08A3E');
  }

  // REASON 3: a deck of 60 cards stacks up, then the deck builder on a laptop with price tags
  function insDeck(t, t0) {
    panelBG(t, '#DDF0FF', '#6FA8E8');
    const split = t0 + 4.1;
    if (t < split) {
      const n = Math.round(60 * ease(seg(t, t0 + .2, t0 + 3.0)));
      for (let i = 0; i < n; i++) card(W / 2 - 380 + i * .8, H * .62 - i * 4.4, 260, -.05, { back: true, t });
      if (n > 0) card(W / 2 - 380 + n * .8, H * .62 - n * 4.4, 260, -.05, { kind: 'fin', t });
      const k = pop(t, t0 + .3);
      X.save(); X.translate(W / 2 + 330, H * .5); X.scale(k, k);
      text(String(n), 0, -30, 260, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 26 });
      text('CARDS', 0, 130, 100, C.star, { font: FONT_SFX, weight: 400, outline: 16 });
      X.restore();
      const vs = pop(t, t0 + 3.0, .4); if (vs > 0) { X.save(); X.translate(W / 2 + 330, H * .2); X.scale(vs, vs); X.rotate(-.1); text('BATTLE!', 0, 0, 110, '#FF6B6B', { font: FONT_SFX, weight: 400, outline: 18 }); X.restore(); }
      ribbon('REASON 3', 'it\'s a game!', t, t0, '#2E7D9A');
      return;
    }
    // the deck builder
    const k = pop(t, split, .5), lx = W / 2 - 160, ly = H * .5;
    X.save(); X.translate(lx, ly); X.scale(k, k);
    shape(rectPts(-470, -300, 940, 560), { fill: '#2B2F3A', ...O(6), smooth: .04 });
    shape(rectPts(-440, -272, 880, 504), { fill: '#F7FAFF', stroke: null });
    shape([[-560, 262], [560, 262], [520, 312], [-520, 312]], { fill: '#C9CED8', ...O(6) });
    shape(rectPts(-440, -272, 880, 64), { fill: '#3D86D8', stroke: null });
    text('DECK BUILDER', -410, -240, 40, '#FFFFFF', { align: 'left', weight: 800 });
    text('60 / 60', 400, -240, 36, C.star, { align: 'right', weight: 800 });
    const rows = [['4 × Captain Fin', 'fin'], ['3 × Blazewyrm', 'dragon'], ['4 × Sproutbun', 'sprout'], ['4 × Starpaw', 'star']];
    rows.forEach(([s, kd], i) => { const a = pop(t, split + .4 + i * .3, .3); if (a <= 0) return; const y = -150 + i * 100;
      X.save(); X.globalAlpha *= clamp(a); card(-380, y, 60, 0, { kind: kd, t }); text(s, -330, y, 42, C.ink, { align: 'left', weight: 700 });
      shape(rectPts(180, y - 28, 210, 56), { fill: '#E5F6EA', stroke: C.moneyDk, lwPx: 3, smooth: .4 }); text(`$0.${[25, 75, 10, 50][i]}`, 285, y, 38, C.moneyDk, { weight: 800 }); X.restore(); });
    X.restore();
    // price tags floating up
    for (let i = 0; i < 4; i++) { const a = seg(t, split + 1.4 + i * .5, split + 3.6 + i * .5); if (a <= 0 || a >= 1) continue;
      const x = W - 300 + 90 * Math.sin(i * 2.1), y = H * .85 - a * 600;
      X.save(); X.translate(x, y); X.rotate(-.2 + .1 * i); X.globalAlpha *= 1 - seg(a, .7, 1);
      shape([[-60, -32], [50, -32], [80, 0], [50, 32], [-60, 32]], { fill: '#FFF3C4', ...O(4) }); circle(52, 0, 7, { fill: '#FFFFFF', ...O(2) });
      text('< $1', -8, 2, 36, C.moneyDk, { weight: 800 }); X.restore(); }
    ribbon('REASON 3', 'easy to start', t, split, '#2E7D9A');
  }

  // REASON 4: a special box opens and a glowing PROMO card rises out of it; an EVENT badge
  function insPromo(t, t0) {
    panelBG(t, '#F0E4FF', '#9F7BE0');
    const bx = W / 2 + 200, by = H * .72, open = ease(seg(t, t0 + .9, t0 + 1.5)), rise = backOut(seg(t, t0 + 1.4, t0 + 2.4));
    // the glow and the rising card (behind the box front)
    if (rise > 0) { const gl = X.createRadialGradient(bx, by - 300, 20, bx, by - 300, 460); gl.addColorStop(0, 'rgba(255,245,180,.9)'); gl.addColorStop(1, 'rgba(255,245,180,0)'); X.fillStyle = gl; X.fillRect(0, 0, W, H);
      card(bx, by - 60 - 300 * rise, 300, .04 * Math.sin(t * 2), { kind: 'star', t, holo: 1, promo: true }); }
    // the box
    shape(rectPts(bx - 300, by - 120, 600, 300), { fill: '#6C45A8', ...O(6), smooth: .03 });
    shape(rectPts(bx - 40, by - 120, 80, 300), { fill: C.gold, ...O(4) });
    text('SPECIAL BOX', bx, by + 90, 52, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 10 });
    X.save(); X.translate(bx, by - 120 - 900 * open); X.rotate(.3 * open); X.translate(-320, 0);   // the lid pops off and flies away
    shape(rectPts(0, -50, 640, 56), { fill: '#7E55C2', ...O(6), smooth: .05 }); shape(rectPts(280, -50, 80, 56), { fill: C.gold, ...O(4) }); X.restore();
    // "not in packs": a pack with a big X, and an EVENT badge
    const p1 = pop(t, t0 + 2.4, .4);
    if (p1 > 0) { X.save(); X.translate(330, H * .48); X.scale(p1, p1); X.rotate(-.1);
      shape([[-90, -150], [90, -150], [80, 150], [-80, 150]], { fill: '#3D86D8', ...O(5) }); for (const y of [-150, 150]) shape(rectPts(-95, y - 12, 190, 24), { fill: '#C9D1D8', ...O(4) });
      text('PACK', 0, 0, 52, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 9 });
      line([[-120, -120], [120, 120]], { stroke: '#E0413A', lwPx: 26 }); line([[120, -120], [-120, 120]], { stroke: '#E0413A', lwPx: 26 }); X.restore(); }
    const p2 = pop(t, t0 + 3.3, .4);
    if (p2 > 0) { X.save(); X.translate(W - 230, H * .3); X.scale(p2 * .85, p2 * .85); X.rotate(.08);
      shape(starPts(0, 0, 170, .78, 14), { fill: '#FFB23A', ...O(6) }); text('EVENT', 0, -14, 64, '#FFFFFF', { font: FONT_SFX, weight: 400, outline: 11 }); text('EXCLUSIVE', 0, 44, 30, '#FFFFFF', { weight: 800, outline: 6 }); X.restore(); }
    ribbon('REASON 4', 'promo cards', t, t0, '#994EC4');
  }

  // REASON 5: the card everybody wants, on a pedestal, its price climbing; hands reach in from the edges
  function insMarket(t, t0) {
    panelBG(t, '#E4FFF0', '#5CC48A');
    const px0 = W / 2, py0 = H * .44, u = ease(seg(t, t0 + .6, t0 + 3.6)), price = Math.round(lerp(1, 500, u * u));
    shape([[px0 - 220, H * .86], [px0 + 220, H * .86], [px0 + 170, H * .74], [px0 - 170, H * .74]], { fill: '#F4ECD8', ...O(6) });
    shape(rectPts(px0 - 260, H * .86, 520, 60), { fill: '#E2D5B6', ...O(6) });
    card(px0, py0 + 8 * Math.sin(t * 2), 330, 0, { kind: 'dragon', t, holo: 1 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .7; shape(starPts(px0 + Math.cos(a) * 300, py0 + Math.sin(a) * 330, 18, .35, 4, t * 3), { fill: '#FFFFFF', stroke: null, alpha: .8 }); }
    // the price tag
    X.save(); X.translate(px0 + 330, py0 - 120); X.rotate(.12 + .04 * Math.sin(t * 3));
    shape([[-120, -60], [110, -60], [160, 0], [110, 60], [-120, 60]], { fill: '#FFF3C4', ...O(6) }); circle(112, 0, 12, { fill: '#FFFFFF', ...O(3) });
    text(`$${price}`, -10, 4, 78, C.moneyDk, { font: FONT_SFX, weight: 400, outline: 10, outlineCol: '#FFFFFF' }); X.restore();
    // reaching hands
    for (let i = 0; i < 4; i++) { const s = i % 2 ? 1 : -1, r = ease(seg(t, t0 + 1 + i * .4, t0 + 2 + i * .4)), y = H * (.3 + .35 * Math.floor(i / 2)) + 10 * Math.sin(t * 6 + i);
      const x = s < 0 ? lerp(-120, 330, r) : lerp(W + 120, W - 330, r); X.save(); X.translate(x, y); X.scale(s, 1);
      shape(rectPts(0, -32, 260, 64), { fill: ['#E0413A', '#3D86D8', '#F3C93E', '#7CCB5A'][i], ...O(4) });
      shape(ellPts(-14, 0, 48, 40), { fill: ['#DCA887', '#F2C9A8', '#B98065', '#E8B48F'][i], ...O(4), smooth: true });
      for (let f = 0; f < 3; f++) shape(ellPts(-58, -22 + f * 22, 16, 9), { fill: ['#DCA887', '#F2C9A8', '#B98065', '#E8B48F'][i], ...O(3), smooth: true });
      X.restore(); }
    const w = pop(t, t0 + 3.4, .4); if (w > 0) { X.save(); X.translate(px0, H * .1); X.scale(w, w); text('EVERYBODY WANTS IT!', 0, 0, 72, '#FFD95A', { font: FONT_SFX, weight: 400, outline: 14 }); X.restore(); }
    ribbon('REASON 5', 'a huge market', t, t0, '#2F8A48');
  }

  // the recap: a whiteboard checklist of the five reasons
  function insSummary(t, t0, ticks) {
    X.fillStyle = '#C9D8E8'; X.fillRect(0, 0, W, H);
    shape(rectPts(150, 70, W - 300, H - 160), { fill: '#C9D1D8', ...O(5), smooth: .02 });
    shape(rectPts(180, 100, W - 360, H - 220), { fill: '#FFFFFF', stroke: null });
    shape(rectPts(180, H - 120, W - 360, 30), { fill: '#AEB8C2', ...O(4) });
    text('Why Pokemon cards make BILLIONS', W / 2, 180, 76, '#2F5DB0', { font: FONT_SFX, weight: 400 });
    const items = ['Cute & cool creatures', 'Beautiful art', 'It\'s a game too!', 'Promo cards', 'A huge market'];
    items.forEach((s, i) => { const at = ticks[i], a = clamp((t - at + .4) / .3); if (a <= 0) return; const y = 330 + i * 120;
      X.save(); X.globalAlpha *= a; text(`${i + 1}.`, 330, y, 64, '#C8403A', { font: FONT_SFX, weight: 400 }); text(s, 390, y, 62, '#2B2233', { align: 'left', weight: 700 });
      const ck = backOut(seg(t, at, at + .3)); if (ck > 0) { X.save(); X.translate(1250, y); X.scale(ck, ck); line([[-30, 0], [-6, 26], [40, -34]], { stroke: '#3F9B4F', lwPx: 16 }); X.restore(); }
      X.restore();
      card(1520 + (i % 2) * 90, y + 10, 90, (i - 2) * .12, { kind: ['star', 'dragon', 'fin', 'star', 'dragon'][i], t, holo: i === 1 || i === 4 ? .8 : 0, promo: i === 3, alpha: a }); });
    const fin = pop(t, ticks[4] + 1.2, .5);
    if (fin > 0) { X.save(); X.translate(W / 2 + 330, H - 190); X.rotate(-.06); X.scale(fin, fin); text('= $34 BILLION!', 0, 0, 84, C.money, { font: FONT_SFX, weight: 400, outline: 12 }); X.restore(); }
  }

  return { C, ART, card, cardFloor, binder, insBillions, insCreatures, insArt, insDeck, insPromo, insMarket, insSummary, text };
})();
