// locations/alma_bedroom/alma_bedroom.js: Alma's bedroom, tidy or messy (see README.md).
//
// A cosy kid's room in one-point perspective (engine/persp.js), built like the study to be shot from BOTH ends:
//   bed view    cameras with dir: 1 (the default) stand by the door and look toward +Z: the white bed with its pink duvet
//               and heart headboard under ALMA bunting and fairy lights, two nightstands, the window and toy chest on the
//               left, the wardrobe, desk and bookshelf on the right, the round fluffy rug in the middle.
//   door view   cameras with dir: -1 stand at the foot of the bed and look back toward −Z: the door, the DANCE! poster,
//               the dresser with its heart mirror, the bookshelf and desk (screen-left) and the window (screen-right).
// Everything is drawn back-to-front by distance from the camera (P.depth), so the same spots work in either direction.
//
//   almaBedroom.back(P, t, o)    walls, floor, ceiling and every piece farther than o.splitZ (default: everything). Call first.
//   almaBedroom.front(P, t, o)   pieces nearer than o.splitZ (toys on the floor, the bed's footboard…). Call after the characters.
//                                With o.toZ it stops at that depth, for several characters at different depths (far → near).
// o: { splitZ, toZ, messy: 0..1 (0 = tidy, the default; 1 = toys everywhere; in between, the mess builds up toy by toy),
//      lamp: 0..1 (the bedside lamp, the lantern and the fairy lights; default .5),
//      taken: 0..1 (the toys vanish one by one, as if someone carried them all off: 1 = not a toy left, tidy places included) }
// almaBedroom.takeables(messy, taken) lists the toys still out ({ kind, name, x, y, z, rot, sc, col, ord }), so a scene can fly
// each one away just before `taken` passes its ord.
// Pass the same o to back() and front().
//
// Toys: Pearl, Neptune, Jester and Robo-Safadi exist as toys (plush dolphins and two action figures). Tidy, the dolphins sit
// on the pillows and the figures stand on the bookshelf; messy, they are scattered with blocks, a ball, books, crayons,
// a teddy, a car, stacking rings, a jump rope and some laundry. The toys are also exported (almaBedroom.toys) for scenes.
//
// Layout (world): side walls X = ±350, back (door) wall Z = 0, front (bed) wall Z = 900, ceiling Y = 280, white wainscot to Y 90.
// Bed X ±110, Z 680–892 against the front wall, mattress top Y 50. Nightstands at X ±175, Z 815–885. Rug: circle r 150 at (0, 450).
// Left wall: window Z 330–610 (Y 110…240) over the toy chest (Z 400–540). Right wall: bookshelf Z 80–240, desk Z 300–470
// (chair at X 205–245), wardrobe Z 610–830. Back wall: dresser X −290…−130 (mirror above), DANCE! poster, door X 170…270.

const almaBedroom = (() => {
  const HW = 350, BACK = 0, FRONT = 900, CEIL = 280, WAIN = 90;
  const BED = { x0: -110, x1: 110, z0: 680, z1: 892, h: 50 };
  const STAND = { x: 175, w: 35, z0: 815, z1: 885, h: 55 };
  const DRESSER = { x0: -290, x1: -130, z1: 55, h: 85 }, DOOR = { x0: 170, x1: 270, h: 205 };
  const WARD = { x0: 265, z0: 610, z1: 830, h: 235 }, DESK = { x0: 255, z0: 300, z1: 470, h: 70 };
  const SHELF = { x0: 290, z0: 80, z1: 240, h: 150 }, CHEST = { x1: -290, z0: 400, z1: 540, h: 50 };
  const WIN = { z0: 330, z1: 610, y0: 110, y1: 240 }, RUG = { x: 0, z: 450, r: 150 }, CHAIR = { x0: 205, x1: 245, z0: 350, z1: 420 };
  const C = {
    wall: '#F9DDE4', wallLt: '#FCEBEF', wain: '#FFFDFC', wainDk: '#EEE2E6', ceil: '#FFF8F9',
    floor: '#E9CBA3', floorLt: '#F3DCBA', floorDk: '#D2B086',
    white: '#FFFDFD', whiteSh: '#F5ECF0', whiteDk: '#E6D8DF',
    pink: '#F6A6C3', pinkLt: '#FCD3E2', pinkXl: '#FFE8F0', pinkDk: '#E57CA4', hot: '#EC5F95',
    lilac: '#C9B2EE', lilacDk: '#9B7ACB', mint: '#AEE6CB', sky: '#9DD3F2', skyLt: '#E1F3FC', gold: '#F2C440', goldDk: '#B98A22',
    tree: '#7FBF5C', treeDk: '#5E9E45', bulb: '#FFE28A',
    red: '#EE5A5A', orange: '#F6A04A', yellow: '#F6D24A', green: '#6CC46A', blue: '#5A9BE0', purple: '#9A6AD0', brown: '#A8774E', brownDk: '#7E5434',
    line: '#7A5566',
  };
  const S = (pts, o) => shape(pts, { stroke: C.line, lwPx: 1.2, ...o });
  const px = (P, w) => clamp(w * P.cam.f / 1000, .6, 4.5);
  const WHITE = { top: C.white, nz: C.whiteSh, pz: C.whiteSh, side: C.whiteDk };
  const PINK = { top: C.pinkLt, nz: C.pink, pz: C.pink, side: C.pinkDk };

  // ---------- building blocks (as in the study) ----------
  // An axis-aligned box with back-face culling. col: one colour, or { top, nz (faces −Z), pz (faces +Z), side, bot }
  function box(P, x0, x1, y0, y1, z0, z1, col, o = {}) {
    const c = typeof col === 'string' ? { top: mixCol(col, '#ffffff', .18), nz: col, pz: col, side: mixCol(col, '#000000', .1) } : col;
    const cam = P.cam, lw = o.lwPx ?? px(P, 1.1), stroke = o.stroke === undefined ? C.line : o.stroke;
    const face = (pts, fill) => { const q = P.poly(pts); if (q) S(q, { fill, stroke: stroke || fill, lwPx: stroke ? lw : .6 }); };
    if (cam.z < z0) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c.nz ?? c.pz);
    if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c.pz ?? c.nz);
    if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c.side);
    if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c.side);
    if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.top);
    if (cam.y < y0) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.bot ?? c.side);
  }
  // A camera-facing cut-out at a world point, drawn in world units with y pointing down. fn gets k (px per unit).
  function sprite(P, x, y, z, fn) {
    if (!P.visible(z)) return;
    const [sx, sy, k] = P.p(x, y, z); X.save(); X.translate(sx, sy); X.scale(k, k); fn(k); X.restore();
  }
  const readable = (P, x, y, fn) => { X.save(); X.translate(x, y); X.scale(P.dir, 1); fn(); X.restore(); };
  const label = (txt, x, y, size, col, weight = 700) => { X.font = `${weight} ${size}px ${FONT_TALK}`; X.fillStyle = col; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, x, y); };
  const wpoly = (P, x, pts) => P.poly(pts.map(([z, y]) => [x, y, z]));
  const wrect = (P, x, z0, z1, y0, y1) => wpoly(P, x, [[z0, y0], [z1, y0], [z1, y1], [z0, y1]]);
  const fpoly = (P, y, pts) => P.poly(pts.map(([x, z]) => [x, y, z]));                    // flat on a horizontal surface
  function clipTo(q, fn) { X.save(); X.beginPath(); q.forEach(([a, b], i) => i ? X.lineTo(a, b) : X.moveTo(a, b)); X.closePath(); X.clip(); fn(); X.restore(); }
  function glowAt(x, y, rx, ry, col, a) { if (a < .01) return; X.save(); X.globalCompositeOperation = 'lighter'; ellipse(x, y, rx, ry, { fill: radGrad(x, y, 0, Math.max(rx, ry), [[0, rgba(col, a)], [1, rgba(col, 0)]]), stroke: null }); X.restore(); }
  const heartPts = (cx, cy, r) => Array.from({ length: 28 }, (_, i) => { const a = i / 28 * TAU; return [cx + r * .062 * 16 * Math.sin(a) ** 3, cy - r * .062 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]; });
  function shadow(P, x, z, r, y = .3) { const q = P.floorCircle(x, z, r, y, 16); if (q) shape(q, { fill: 'rgba(120,70,90,.16)', stroke: null }); }

  // ---------- the toys (sprite space: world units, y down, origin on the surface under the toy) ----------
  // Simplified, scaled-down versions of the real rigs: same palettes and signature features, plush or plastic proportions.
  // lw: outline width in screen px. Each toy is about 30–45 units: a quarter of Alma's height.
  const TOY = {
    // Princess Pearl as a plush: a sitting rainbow tie-dye dolphin, sky-blue belly, bead eye with lashes, little gold crown.
    pearl(lw, flip = false) {
      const ink = '#5B3552'; X.save(); if (flip) X.scale(-1, 1);
      S([[-9, -4], [-18, -9], [-24, -4], [-19, -1], [-24, 3], [-14, 0]], { fill: '#A9EBCB', stroke: ink, lwPx: lw, smooth: .6 });   // flukes
      const body = [[-10, 0], [5, 0], [11, -6], [12.5, -16], [11, -24], [6, -30], [0, -31], [-5, -28], [-9, -20], [-11, -10]];
      S(body, { fill: linGrad(-11, -2, 10, -30, [[0, '#FBE79B'], [.3, '#A9EBCB'], [.55, '#FBC6A0'], [.78, '#F5A2C6'], [1, '#D4B5EC']]), stroke: null, smooth: true });
      tracePath(body, true, true); X.save(); X.clip();
      for (const [x, y, r, c] of [[-6, -6, 6, '#F5A2C6'], [4, -20, 7, '#FBE79B'], [-4, -24, 5, '#A9EBCB'], [6, -8, 5, '#D4B5EC']]) ellipse(x, y, r, r * .8, { fill: rgba(c, .6), stroke: null });
      ellipse(9, -11, 4.5, 9, { fill: '#A8DDF2', stroke: null });
      X.restore();
      S(body, { fill: null, stroke: ink, lwPx: lw, smooth: true });
      S([[-8, -22], [-14, -21], [-9, -16]], { fill: '#D4B5EC', stroke: ink, lwPx: lw, smooth: .5 });                        // dorsal fin
      S([[10, -26], [17, -25], [18, -22.5], [11, -21]], { fill: '#A8DDF2', stroke: ink, lwPx: lw, smooth: .5 });            // beak
      S([[2, -13], [8, -9], [4, -5]], { fill: '#F5A2C6', stroke: ink, lwPx: lw, smooth: .5 });                                // flipper
      circle(6.5, -23.5, 2.3, { fill: '#1E1620', stroke: null }); circle(7.2, -24.3, .8, { fill: '#fff', stroke: null });
      line([[5, -25.6], [4, -27]], { stroke: '#1E1620', lwPx: lw }); line([[7, -26], [7.2, -27.6]], { stroke: '#1E1620', lwPx: lw });
      ellipse(8.5, -19.5, 2, 1.2, { fill: rgba('#F48DB0', .7), stroke: null });
      S([[-4, -29], [-5, -36], [-2, -32], [0, -37], [2, -32], [5, -35.5], [4, -29]], { fill: '#EDC04D', stroke: '#B98A22', lwPx: lw });   // crown
      for (const [x, c] of [[-2.4, '#F48DB0'], [0, '#5AA9E6'], [2.4, '#F6D24A']]) circle(x, -30.6, .9, { fill: c, stroke: null });
      X.restore();
    },
    // King Neptune as a plush: a long bright-blue dolphin with a rainbow-striped belly and a crooked crown with a starfish.
    neptune(lw, flip = false) {
      const ink = '#1E3657'; X.save(); if (flip) X.scale(-1, 1);
      S([[-20, -6], [-28, -13], [-30, -8], [-25, -5], [-30, -1], [-27, 2]], { fill: '#1786C9', stroke: ink, lwPx: lw, smooth: .5 });   // flukes
      S([[-4, -15], [-9, -23], [-1, -16]], { fill: '#1786C9', stroke: ink, lwPx: lw, smooth: .4 });                         // dorsal fin
      const body = [[-21, -5], [-12, -11], [0, -15], [10, -15.5], [15, -13], [19, -9.5], [27, -7], [27.5, -5], [18, -3], [6, -1], [-8, -1], [-18, -2.5]];
      S(body, { fill: linGrad(0, -16, 0, 0, [[0, '#7BD6FA'], [.45, '#2EB2EE'], [1, '#1786C9']]), stroke: null, smooth: .7 });
      tracePath(body, true, .7); X.save(); X.clip();
      const bands = ['#C9B2EE', '#F4A8C8', '#FBC6A0', '#FBE79B', '#B4EBC8', '#A8DDF2'];
      bands.forEach((c, i) => S([[-18, -2.4 - i * .9], [6, -1.4 - i * 1.1], [20, -3.4 - i * .7], [20, -2.4 - i * .7], [6, -.4 - i * 1.1], [-18, -1.4 - i * .9]], { fill: c, stroke: null }));
      ellipse(9, -13, 6, 2.2, { fill: 'rgba(255,255,255,.35)', stroke: null });
      X.restore();
      S(body, { fill: null, stroke: ink, lwPx: lw, smooth: .7 });
      S([[2, -4], [6, 2], [9, -3]], { fill: '#1786C9', stroke: ink, lwPx: lw, smooth: .4 });                                // flipper
      line([[19, -6.5], [25.5, -5.6]], { stroke: ink, lwPx: lw });                                                          // smile
      circle(15.5, -10, 1.8, { fill: '#11141C', stroke: null }); circle(16, -10.6, .6, { fill: '#fff', stroke: null });
      X.save(); X.translate(10, -15.5); X.rotate(.28);                                                                       // the crooked crown
      S([[-5, 0], [-6, -6], [-3, -3], [0, -7], [3, -3], [6, -6], [5, 0]], { fill: '#F2C440', stroke: '#B98A22', lwPx: lw });
      for (const x of [-6, 0, 6]) circle(x, x ? -6.4 : -7.4, .9, { fill: '#FFF8EE', stroke: null });
      S(starPts(0, -1.8, 2, .45), { fill: '#FF8A5C', stroke: null });
      X.restore(); X.restore();
    },
    // Jester Fester as an action figure: three-point plum/crimson/gold hat with pompoms, striped tunic, curly-toed shoes.
    jester(lw) {
      const ink = '#3B2530', o = { stroke: ink, lwPx: lw };
      for (const sd of [-1, 1]) {                                                                                           // striped legs and shoes
        S(rectPts(sd * 2.6 - 1.5, -9, 3, 7.5), { fill: '#A8284C', ...o });
        for (const y of [-7, -4.5]) S(rectPts(sd * 2.6 - 1.5, y, 3, 1.2), { fill: '#4568B5', stroke: null });
        S([[sd * 2.6 - 1.8, -1.8], [sd * 2.6 + 1.6, -1.8], [sd * 6.5, -1.4], [sd * 7, -3], [sd * 7.8, -2.2], [sd * 6.6, 0], [sd * 2.6 - 1.8, 0]], { fill: '#8E5234', ...o, smooth: .3 });
      }
      for (const sd of [-1, 1]) { S(rectPts(sd * 5.6 - 1.2, -17, 2.4, 7.5), { fill: '#E4AE3E', ...o }); S(rectPts(sd * 5.6 - 1.2, -14, 2.4, 1.6), { fill: '#A8284C', stroke: null }); circle(sd * 5.6, -9, 1.3, { fill: '#F7CBAA', ...o }); }
      const tunic = [[-4.5, -18], [4.5, -18], [5.5, -9], [-5.5, -9]];
      S(tunic, { fill: '#A8284C', ...o });
      tracePath(tunic); X.save(); X.clip(); S(rectPts(-1.4, -18, 2.8, 9), { fill: '#4568B5', stroke: null }); S(rectPts(1.4, -18, 3, 9), { fill: '#E4AE3E', stroke: null }); X.restore();
      S([[-5.5, -9.3], [-4, -7.3], [-2, -9.3], [0, -7.3], [2, -9.3], [4, -7.3], [5.5, -9.3]], { fill: '#E4AE3E', ...o });   // zig-zag hem
      for (const x of [-4, 0, 4]) circle(x, -7, .7, { fill: '#F3C54F', stroke: null });
      S([[-5, -18.5], [-2.5, -17], [0, -18.5], [2.5, -17], [5, -18.5], [0, -20]], { fill: '#E4AE3E', ...o });              // ruffle collar
      circle(0, -23, 4.6, { fill: '#F7CBAA', ...o });                                                                       // head
      for (const sd of [-1, 1]) { ellipse(sd * 3.6, -24.5, 1.4, 1.8, { fill: '#6A3B22', stroke: null }); circle(sd * 1.6, -23.6, 1, { fill: '#fff', stroke: ink, lwPx: lw * .6 }); circle(sd * 1.6, -23.5, .5, { fill: '#5A341E', stroke: null }); }
      circle(0, -22.2, .9, { fill: '#F29A84', stroke: null });
      line([[-1.6, -20.6], [0, -19.8], [1.6, -20.6]], { stroke: ink, lwPx: lw, smooth: true });
      S(rectPts(-4.8, -28.6, 9.6, 1.8), { fill: '#A8284C', ...o });                                                         // headband
      S([[-4.6, -28.4], [-1.5, -28.4], [-4, -33], [-8.5, -35]], { fill: '#6E2D5E', ...o, smooth: .4 });
      S([[4.6, -28.4], [1.5, -28.4], [4, -33], [8.5, -35]], { fill: '#E4AE3E', ...o, smooth: .4 });
      S([[-2, -28.4], [2, -28.4], [.5, -34], [0, -37]], { fill: '#A8284C', ...o, smooth: .4 });
      for (const [x, y, c] of [[-8.5, -35, '#3F5FC4'], [0, -37, '#4FAA4F'], [8.5, -35, '#EF8B2C']]) circle(x, y, 1.5, { fill: c, ...o });
    },
    // Robo-Safadi as an action figure: riveted steel box head with Safadi's hair plate, cyan LED eyes, antenna, tan suit, red tie.
    robo(lw) {
      const ink = '#3B2530', o = { stroke: ink, lwPx: lw };
      for (const sd of [-1, 1]) { S(rectPts(sd * 2.5 - 1.5, -9, 3, 7.5), { fill: '#D4B68C', ...o }); circle(sd * 2.5, -5, .7, { fill: '#8C98A0', stroke: null }); S(rectPts(sd * 2.5 - 2, -1.8, 4.2, 1.8), { fill: '#6E3B22', ...o }); }
      for (const sd of [-1, 1]) {                                                                                           // ribbed flex-tube arms and grippers
        S(rectPts(sd * 6 - 1.1, -17.5, 2.2, 8), { fill: '#BAC4CA', ...o });
        for (let y = -16; y < -10; y += 1.6) line([[sd * 6 - 1.1, y], [sd * 6 + 1.1, y]], { stroke: '#8C98A0', lwPx: lw * .7 });
        S([[sd * 6 - 1.3, -9.5], [sd * 6 + 1.3, -9.5], [sd * 6 + 1.6, -7.6], [sd * 6 - 1.6, -7.6]], { fill: '#8C98A0', ...o });
      }
      S(rectPts(-4.8, -18, 9.6, 9.5), { fill: '#D4B68C', ...o });                                                          // suit box
      S([[-2.2, -18], [2.2, -18], [0, -13]], { fill: '#F2F0EA', stroke: null });
      S([[-.7, -17.4], [.7, -17.4], [.9, -12.6], [0, -11.8], [-.9, -12.6]], { fill: '#C3222F', stroke: null });
      for (const sd of [-1, 1]) S([[sd * 2.2, -18], [sd * 4.6, -18], [sd * 1.2, -12]], { fill: '#E4CDA7', stroke: ink, lwPx: lw * .7 });
      for (const y of [-11.5, -9.8]) circle(0, y, .4, { fill: '#7A5A3A', stroke: null });
      S(rectPts(-6, -28.5, 12, 10), { fill: '#BAC4CA', ...o });                                                            // steel head
      S(rectPts(-6, -28.5, 12, 2.4), { fill: '#DCE3E7', stroke: null });
      for (const sd of [-1, 1]) S(rectPts(sd * 6.9 - .9, -25, 1.8, 3), { fill: '#8C98A0', ...o });                         // bolt ears
      S([[-6.4, -27.6], [-6, -31], [-2, -32.4], [4, -32], [6.6, -30.2], [6.4, -27.6], [3, -28.6], [-1, -28.4]], { fill: '#2E221D', ...o, smooth: .3 });   // the hair plate
      for (const sd of [-1, 1]) { S(rectPts(sd * 2.6 - 1.8, -25.6, 3.6, 3), { fill: '#1E2A33', stroke: ink, lwPx: lw * .6 }); S(rectPts(sd * 2.6 - 1.4, -25.2, 2.8, 2.2), { fill: '#BFF3FF', stroke: null }); S(rectPts(sd * 2.6 - .5, -24.6, 1, 1.1), { fill: '#1E2A33', stroke: null }); }
      S(rectPts(-2.4, -21.2, 4.8, 1.4), { fill: '#1E2A33', stroke: ink, lwPx: lw * .6 }); S(rectPts(-1.8, -20.9, 3.6, .8), { fill: '#BFF3FF', stroke: null });
      line([[1.5, -32.2], [1.8, -35.5]], { stroke: '#8C98A0', lwPx: lw * 1.4 }); circle(1.8, -36, 1, { fill: '#BFF3FF', ...o });   // antenna
    },
    teddy(lw) {
      const o = { stroke: C.line, lwPx: lw }, b = C.brown;
      for (const sd of [-1, 1]) { ellipse(sd * 6, -3, 4, 3.4, { fill: b, ...o }); ellipse(sd * 6.4, -2.6, 2.2, 1.9, { fill: '#E8C9A0', stroke: null }); }
      ellipse(0, -10, 7.5, 8.5, { fill: b, ...o }); ellipse(0, -9, 4.4, 5.4, { fill: '#E8C9A0', stroke: null });
      for (const sd of [-1, 1]) ellipse(sd * 7.5, -12, 2.6, 4.2, { fill: b, ...o, rot: sd * .5 });
      for (const sd of [-1, 1]) { circle(sd * 5, -27, 2.8, { fill: b, ...o }); circle(sd * 5, -27, 1.4, { fill: '#E8C9A0', stroke: null }); }
      circle(0, -21.5, 7, { fill: b, ...o }); ellipse(0, -19.2, 3.2, 2.4, { fill: '#E8C9A0', stroke: null });
      circle(0, -20.2, .9, { fill: '#3B2530', stroke: null }); for (const sd of [-1, 1]) circle(sd * 2.6, -23, .9, { fill: '#3B2530', stroke: null });
      S([[-2.5, -14.2], [2.5, -14.2], [0, -12.5]], { fill: C.hot, stroke: null }); circle(0, -14, 1, { fill: C.hot, stroke: null });   // bow tie
    },
    ball(lw) {
      circle(0, -11, 11, { fill: C.white, stroke: C.line, lwPx: lw });
      X.save(); X.beginPath(); X.arc(0, -11, 11, 0, TAU); X.clip();
      for (const [a, c] of [[-.6, C.hot], [.9, C.yellow], [2.4, C.blue]]) ellipse(Math.cos(a) * 9, -11 + Math.sin(a) * 9, 6, 13, { fill: c, stroke: null, rot: a });
      X.restore();
      S(starPts(0, -11, 3.6, .45), { fill: C.white, stroke: null }); ellipse(-4, -16, 3, 2, { fill: 'rgba(255,255,255,.55)', stroke: null, rot: -.5 });
    },
    car(lw) {
      const o = { stroke: C.line, lwPx: lw };
      S([[-12, -3], [-12, -8], [-6, -9], [-3, -14], [5, -14], [8, -9], [12, -8], [12, -3]], { fill: C.red, ...o });
      S([[-2, -13], [1, -13], [1, -9.5], [-4.5, -9.5]], { fill: C.skyLt, stroke: null }); S([[2.5, -13], [5, -13], [6.6, -9.5], [2.5, -9.5]], { fill: C.skyLt, stroke: null });
      for (const x of [-7, 7]) { circle(x, -3, 3.2, { fill: '#3B3240', ...o }); circle(x, -3, 1.2, { fill: '#C9C2CC', stroke: null }); }
    },
    rings(lw) {
      const o = { stroke: C.line, lwPx: lw };
      S(rectPts(-1.2, -26, 2.4, 24), { fill: C.yellow, ...o });
      ellipse(0, -2, 10, 2.6, { fill: C.purple, ...o });
      [[C.red, 9], [C.orange, 7.8], [C.green, 6.6], [C.blue, 5.4]].forEach(([c, r], i) => ellipse(0, -5 - i * 4.4, r, 2.6, { fill: c, ...o }));
      circle(0, -27, 2.4, { fill: C.pink, ...o });
    },
    pillow(lw, rot = 0) { X.save(); X.rotate(rot); S([[-34, -2], [-34, -20], [0, -22], [34, -20], [34, -2], [0, 0]], { fill: C.white, stroke: C.line, lwPx: lw, smooth: .5 }); line([[-28, -14], [-20, -12]], { stroke: C.whiteDk, lwPx: lw }); X.restore(); },
    shirt(lw) { S([[-14, -1], [-12, -9], [-18, -10], [-12, -14], [-4, -12], [4, -13], [12, -14], [18, -9], [12, -8], [14, -1], [0, 0]], { fill: C.lilac, stroke: C.line, lwPx: lw, smooth: .3 }); S(heartPts(0, -7, 4), { fill: C.pinkDk, stroke: null }); },
    sock(lw) { S([[-8, -4], [-8, -11], [-3, -11], [-3, -4], [5, -3.5], [6, 0], [-7, 0]], { fill: C.mint, stroke: C.line, lwPx: lw, smooth: .3 }); S(rectPts(-8, -11, 5, 2), { fill: C.white, stroke: null }); },
    bookStack(lw) { [[C.purple, 18], [C.mint, 16], [C.hot, 19], [C.sky, 15]].forEach(([c, w], i) => { S(rectPts(-w / 2 + (i % 2) * 1.5, -4.5 * (i + 1), w, 4.5), { fill: c, stroke: C.line, lwPx: lw }); line([[-w / 2 + 2 + (i % 2) * 1.5, -4.5 * i - 2.2], [w / 2 - 2 + (i % 2) * 1.5, -4.5 * i - 2.2]], { stroke: 'rgba(255,255,255,.6)', lwPx: lw }); }); },
    tiara(lw) { S([[-7, 0], [-6, -4], [-3, -2.5], [0, -7], [3, -2.5], [6, -4], [7, 0]], { fill: C.pinkLt, stroke: C.goldDk, lwPx: lw }); circle(0, -4, 1.3, { fill: C.hot, stroke: null }); },
    lamp(lw, lit) {
      glowAt(0, -32, 46, 34, '#FFD7E4', .45 * lit);
      ellipse(0, -2, 7, 2.4, { fill: C.pink, stroke: C.line, lwPx: lw }); S(rectPts(-1.2, -26, 2.4, 24), { fill: C.white, stroke: C.line, lwPx: lw });
      S([[-11, -24], [11, -24], [7, -40], [-7, -40]], { fill: lit > .05 ? '#FFF1F6' : C.pinkXl, stroke: C.line, lwPx: lw });
      for (const x of [-7, 0, 7]) circle(x, -24, 1.4, { fill: C.pink, stroke: null });
    },
    clock(lw) { for (const sd of [-1, 1]) circle(sd * 5, -15, 3, { fill: C.gold, stroke: C.line, lwPx: lw }); circle(0, -9, 8, { fill: C.pink, stroke: C.line, lwPx: lw }); circle(0, -9, 6, { fill: C.white, stroke: null }); line([[0, -9], [0, -13.5]], { stroke: C.line, lwPx: lw }); line([[0, -9], [3, -9]], { stroke: C.line, lwPx: lw }); },
    flowers(lw) { S([[-4, 0], [4, 0], [5, -10], [-5, -10]], { fill: C.skyLt, stroke: C.line, lwPx: lw }); for (const [x, y, c] of [[-5, -18, C.hot], [0, -22, C.yellow], [5, -17, C.lilac]]) { line([[x * .4, -10], [x, y]], { stroke: C.treeDk, lwPx: lw }); S(starPts(x, y, 3.6, .55, 5), { fill: c, stroke: C.line, lwPx: lw * .7, smooth: .6 }); circle(x, y, 1, { fill: C.white, stroke: null }); } },
    musicBox(lw) { S(rectPts(-10, -10, 20, 10), { fill: C.lilac, stroke: C.line, lwPx: lw }); S(rectPts(-11, -13, 22, 3), { fill: C.pink, stroke: C.line, lwPx: lw }); S(heartPts(0, -5, 3), { fill: C.white, stroke: null }); },
    pencilCup(lw) { for (const [x, c] of [[-2.5, C.red], [0, C.blue], [2.5, C.yellow]]) line([[x, -8], [x * 1.4, -17]], { stroke: c, lwPx: lw * 2.2 }); S([[-4.5, 0], [4.5, 0], [5, -9], [-5, -9]], { fill: C.pink, stroke: C.line, lwPx: lw }); },
    crayonBox(lw) { for (const [x, c] of [[-4, C.red], [-1.4, C.blue], [1.2, C.green], [3.8, C.purple]]) S([[x - 1, -8], [x + 1, -8], [x + 1, -12], [x, -13.5], [x - 1, -12]], { fill: c, stroke: null }); S(rectPts(-6, -9, 12, 9), { fill: C.yellow, stroke: C.line, lwPx: lw }); S(rectPts(-6, -6, 12, 2.5), { fill: C.green, stroke: null }); },
  };
  // Draw a toy at a world point, optionally rotated about its base (lying down, tipped over) and scaled.
  function toy(P, name, x, y, z, rot = 0, sc = 1, ...args) {
    if (y < 1) shadow(P, x, z, 14 * sc);
    sprite(P, x, y, z, k => { X.rotate(rot); X.scale(sc, sc); TOY[name](clamp(k * .32, .5, 1.6), ...args); });
  }

  // ---------- room shell ----------
  function stripesPlane(x0, x1) { for (let x = x0 + 14; x < x1; x += 36) S(rectPts(x, -CEIL, 12, CEIL - WAIN), { fill: C.wallLt, stroke: null }); }
  function wainPlane(P, x0, x1) {
    S(rectPts(x0, -WAIN, x1 - x0, WAIN), { fill: C.wain, stroke: null });
    for (let x = x0 + 14; x < x1 - 50; x += 80) S(rectPts(x, -WAIN + 16, 64, WAIN - 34), { fill: null, stroke: C.wainDk, lwPx: px(P, 1.2) });
    S(rectPts(x0, -WAIN - 4, x1 - x0, 6), { fill: C.white, stroke: C.wainDk, lwPx: px(P, .8) });
    S(rectPts(x0, -10, x1 - x0, 10), { fill: C.whiteSh, stroke: null });
  }
  function floor(P) {
    const q = P.poly([[-HW, 0, BACK], [HW, 0, BACK], [HW, 0, FRONT], [-HW, 0, FRONT]]);
    if (q) S(q, { fill: C.floor, stroke: null });
    for (let i = 0; i <= 17; i++) { const x = -HW + i * 41, l = P.line([[x, 0, BACK], [x, 0, FRONT]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .9) }); }
    for (let i = 0; i < 17; i++) for (let z = (hash(i + 4) * 200) | 0; z < FRONT; z += 200) {
      const l = P.line([[-HW + i * 41, 0, z], [-HW + i * 41 + 41, 0, z]]); if (l) line(l, { stroke: C.floorDk, lwPx: px(P, .7) });
      if (hash(i * 5 + z) < .3) { const p = fpoly(P, .2, [[-HW + i * 41 + 2, z + 4], [-HW + i * 41 + 39, z + 4], [-HW + i * 41 + 39, z + 110], [-HW + i * 41 + 2, z + 110]]); if (p) S(p, { fill: C.floorLt, stroke: null, alpha: .45 }); }
    }
    // the round fluffy rug: a scalloped pink edge, white ring, pink field, a ring of hearts
    const scal = P.poly(Array.from({ length: 64 }, (_, i) => { const a = i / 64 * TAU, r = RUG.r + (i % 2 ? 0 : 7); return [RUG.x + Math.cos(a) * r, .4, RUG.z + Math.sin(a) * r]; }));
    if (scal) S(scal, { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, 1), smooth: true });
    for (const [r, col] of [[RUG.r - 14, C.white], [RUG.r - 26, C.pinkLt], [52, C.pinkXl]]) { const d = P.floorCircle(RUG.x, RUG.z, r, .5, 40); if (d) S(d, { fill: col, stroke: null }); }
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, hx = RUG.x + Math.cos(a) * 92, hz = RUG.z + Math.sin(a) * 92, h = fpoly(P, .6, heartPts(0, 0, 9).map(([u, v]) => [hx + u, hz - v])); if (h) S(h, { fill: C.pink, stroke: null }); }
  }
  function ceiling(P) {
    const q = P.poly([[-HW, CEIL, BACK], [HW, CEIL, BACK], [HW, CEIL, FRONT], [-HW, CEIL, FRONT]]);
    if (q) S(q, { fill: C.ceil, stroke: null });
    for (let i = 0; i < 14; i++) { const p = P.p(-HW + 40 + hash(i + 70) * (2 * HW - 80), CEIL, 60 + hash(i + 90) * 780); if (p[2] > 0 && P.visible(60 + hash(i + 90) * 780)) S(starPts(p[0], p[1], 6 * p[2], .45, 5), { fill: '#FFF2B8', stroke: null }); }   // glow-in-the-dark stars
  }
  function sideWalls(P, t, o) {
    for (const sd of [-1, 1]) {
      const x = sd * HW, q = wrect(P, x, BACK, FRONT, 0, CEIL); if (q) S(q, { fill: C.wall, stroke: null });
      for (let z = 10; z < FRONT; z += 36) { const s = wrect(P, x, z, z + 12, WAIN, CEIL); if (s) S(s, { fill: C.wallLt, stroke: null }); }
      const wn = wrect(P, x, BACK, FRONT, 0, WAIN); if (wn) S(wn, { fill: C.wain, stroke: null });
      for (let z = 20; z < FRONT - 60; z += 90) { const p = wrect(P, x, z, z + 70, 16, WAIN - 18); if (p) S(p, { fill: null, stroke: C.wainDk, lwPx: px(P, 1) }); }
      const rail = wrect(P, x, BACK, FRONT, WAIN - 4, WAIN + 2); if (rail) S(rail, { fill: C.white, stroke: C.wainDk, lwPx: px(P, .7) });
      if (sd < 0) wallWindow(P, x, t);
      else corkboard(P, x, o);
    }
  }
  function wallWindow(P, x, t) {
    const w = WIN, q = wrect(P, x, w.z0, w.z1, w.y0, w.y1); if (!q) return;
    clipTo(q, () => {
      const top = Math.min(...q.map(v => v[1])), bot = Math.max(...q.map(v => v[1]));
      S(q, { fill: linGrad(0, top, 0, bot, [[0, C.sky], [1, C.skyLt]]), stroke: null });
      for (let i = 0; i < 3; i++) { const cz = w.z0 + 50 + i * 95 + wob(t, .03, i) * 10, cy = 200 + hash(i + 3) * 25; for (const [dz, dy, r] of [[0, 0, 18], [16, 5, 14], [-16, 4, 13]]) { const c = wpoly(P, x, Array.from({ length: 14 }, (_, j) => { const a = j / 14 * TAU; return [cz + dz + Math.cos(a) * r, cy + dy + Math.sin(a) * r * .6]; })); if (c) S(c, { fill: '#FFFFFF', stroke: null, alpha: .9 }); } }
      for (let i = 0; i < 6; i++) { const cz = w.z0 + i * 55 + hash(i) * 20, cy = w.y0 + 10 + hash(i + 8) * 20, r = 32 + hash(i + 2) * 14; const b = wpoly(P, x, Array.from({ length: 16 }, (_, j) => { const a = j / 16 * TAU; return [cz + Math.cos(a) * r + (i % 2 ? wob(t, .2, i) * 2 : 0), cy + Math.sin(a) * r * .7]; })); if (b) S(b, { fill: i % 2 ? C.tree : C.treeDk, stroke: null }); }
    });
    S(q, { fill: null, stroke: C.white, lwPx: px(P, 5) });
    const mz = (w.z0 + w.z1) / 2, my = (w.y0 + w.y1) / 2;
    for (const l of [P.line([[x, w.y0, mz], [x, w.y1, mz]]), P.line([[x, my, w.z0], [x, my, w.z1]])]) if (l) line(l, { stroke: C.white, lwPx: px(P, 3) });
    const sill = wrect(P, x, w.z0 - 16, w.z1 + 16, w.y0 - 8, w.y0); if (sill) S(sill, { fill: C.white, stroke: C.wainDk, lwPx: px(P, 1) });
    // ruffled pink curtains, tied back, under a scalloped pelmet
    for (const [za, zb, dir] of [[w.z0 - 50, w.z0 + 30, 1], [w.z1 - 30, w.z1 + 50, -1]]) {
      const zi = dir > 0 ? zb : za, zo = dir > 0 ? za : zb, xi = x - sd(x) * 3, sway = wob(t, .15, dir) * 2;
      const c = wpoly(P, xi, [[zo, CEIL - 22], [zi, CEIL - 22], [zi - dir * 26 + sway, 150], [zi + sway, 70], [zi - dir * 10, 58], [zo, 58]]); if (c) S(c, { fill: C.pink, lwPx: px(P, 1.1) });
      for (let k = 1; k < 3; k++) { const f = P.line([[xi, CEIL - 24, lerp(zo, zi, k / 3)], [xi, 150, lerp(zo, zi - dir * 26, k / 3)], [xi, 62, lerp(zo, zi - dir * 10, k / 3)]]); if (f) line(f, { stroke: C.pinkDk, lwPx: px(P, 1.4) }); }
      for (let i = 0; i < 5; i++) { const d = P.p(xi, CEIL - 60 - i * 40, lerp(zo, zi, .5)); if (P.visible(lerp(zo, zi, .5))) circle(d[0], d[1], 2.6 * d[2], { fill: C.white, stroke: null }); }
      const tie = wrect(P, xi - sd(x), Math.min(zo, zi - dir * 26) + 4, Math.max(zo, zi - dir * 26) - 4, 140, 152); if (tie) S(tie, { fill: C.white, lwPx: px(P, .8) });
    }
    const pz = [], z0 = w.z0 - 60, z1 = w.z1 + 60, n = 12;
    for (let i = 0; i <= n; i++) { const z = lerp(z0, z1, i / n); pz.push([z, CEIL - 46], [lerp(z0, z1, (i + .5) / n), CEIL - 54]); }
    pz.length -= 1; pz.push([z1, CEIL - 46], [z1, CEIL - 16], [z0, CEIL - 16]);
    const pel = wpoly(P, x - sd(x) * 6, pz); if (pel) S(pel, { fill: C.pinkDk, lwPx: px(P, 1) });
  }
  const sd = x => Math.sign(x) || 1;
  // A corkboard of Alma's drawings over the desk (right wall).
  function corkboard(P, x, o) {
    const xs = x - 1, b = wrect(P, xs, DESK.z0 + 10, DESK.z1 - 10, 112, 210); if (!b) return;
    S(b, { fill: '#D9A86C', stroke: C.white, lwPx: px(P, 4) });
    [[330, 130, 365, 180, C.white, C.purple], [375, 150, 410, 198, C.pinkXl, C.hot], [420, 122, 452, 165, C.skyLt, C.blue], [345, 186, 400, 204, C.mint, null]].forEach(([za, ya, zb, yb, f, ink], i) => {
      const p = wrect(P, xs - .5, za, zb, ya, yb); if (!p) return; S(p, { fill: f, stroke: C.line, lwPx: px(P, .6) });
      if (ink) { const c = P.line([[xs - 1, ya + 12, za + 8], [xs - 1, ya + 30, (za + zb) / 2], [xs - 1, ya + 14, zb - 8]]); if (c) line(c, { stroke: ink, lwPx: px(P, 1.6), smooth: true }); }
      const pin = P.p(xs - 1, yb - 3, (za + zb) / 2); if (P.visible((za + zb) / 2)) circle(pin[0], pin[1], 2.2 * pin[2], { fill: [C.red, C.yellow, C.green, C.blue][i], stroke: null });
    });
  }
  // Front wall (Z = 900), behind the bed: ALMA bunting, fairy lights and two little pictures. Only seen from the bed view.
  function frontWall(P, t, o) {
    const lit = clamp(o.lamp ?? .5);
    P.plane(FRONT, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null }); stripesPlane(-HW, HW); wainPlane(P, -HW, HW);
      // fairy lights, draped in three loops
      const fl = x => -232 + 14 * Math.abs(Math.sin((x + 300) / 200 * Math.PI));
      line(Array.from({ length: 61 }, (_, i) => { const x = -300 + i * 10; return [x, fl(x)]; }), { stroke: '#6E8A5A', lwPx: px(P, 1) });
      for (let i = 0; i < 20; i++) { const x = -290 + i * 30.5, y = fl(x) + 4, a = lit * (.75 + .25 * wob(t, .7, hash(i))); glowAt(x, y, 14, 14, '#FFE9A8', .5 * a); circle(x, y, 3.4, { fill: mixCol('#F3E3B0', C.bulb, a), stroke: null }); }
      // bunting: A L M A on the middle pennants
      const by = x => -206 + 26 * (1 - (x / 230) ** 2);
      line(Array.from({ length: 47 }, (_, i) => { const x = -230 + i * 10; return [x, by(x)]; }), { stroke: C.line, lwPx: px(P, .8) });
      const flags = [C.lilac, C.pink, C.white, C.mint, C.pink, C.white, C.lilac, C.mint, C.pink], word = { 2: 'A', 3: 'L', 5: 'M', 6: 'A' };
      flags.forEach((c, i) => { const x = -200 + i * 50, y = by(x); S([[x - 18, y], [x + 18, y], [x, y + 36]], { fill: c, stroke: C.line, lwPx: px(P, .8) }); if (word[i]) label(word[i], x, y + 12, 17, C.hot, 700); else circle(x, y + 12, 3, { fill: C.white, stroke: null }); });
      // little framed pictures either side: a rainbow and a music note
      for (const [x, kind] of [[-290, 0], [250, 1]]) {
        S(rectPts(x - 2, -230, 44, 54), { fill: C.white, stroke: C.line, lwPx: px(P, 1) }); S(rectPts(x + 4, -224, 32, 42), { fill: kind ? C.lilac : C.skyLt, stroke: null });
        if (kind) label('♫', x + 20, -203, 26, C.white); else [C.red, C.yellow, C.blue].forEach((c, i) => line(Array.from({ length: 9 }, (_, j) => { const a = Math.PI + j / 8 * Math.PI; return [x + 20 + Math.cos(a) * (13 - i * 3.6), -192 + Math.sin(a) * (13 - i * 3.6)]; }), { stroke: c, lwPx: px(P, 2.4) }));
      }
    });
  }
  // Back wall (Z = 0), the door end: the door, the DANCE! poster and the heart mirror over the dresser. Only seen from the door view.
  function backWall(P, t) {
    P.plane(BACK, () => {
      S(rectPts(-HW, -CEIL, 2 * HW, CEIL), { fill: C.wall, stroke: null }); stripesPlane(-HW, HW); wainPlane(P, -HW, HW);
      const d = DOOR;
      S(rectPts(d.x0 - 10, -d.h - 10, d.x1 - d.x0 + 20, d.h + 10), { fill: C.white, stroke: C.line, lwPx: px(P, 1) });
      S(rectPts(d.x0, -d.h, d.x1 - d.x0, d.h), { fill: C.whiteSh, stroke: C.line, lwPx: px(P, 1) });
      for (const [y, h] of [[-d.h + 16, 90], [-d.h + 118, 70]]) S(rectPts(d.x0 + 14, y, d.x1 - d.x0 - 28, h), { fill: null, stroke: C.whiteDk, lwPx: px(P, 1.4) });
      circle(d.x0 + 14, -98, 4.5, { fill: C.gold, stroke: C.goldDk, lwPx: px(P, .8) });
      readable(P, (d.x0 + d.x1) / 2, -d.h + 50, () => { S(heartPts(0, 0, 24), { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, 1) }); label('ALMA', 0, 2, 13, C.white); });   // a heart door sign
      // the DANCE! poster: Alma's super dance powers
      S(rectPts(-60, -232, 130, 150), { fill: C.purple, stroke: C.line, lwPx: px(P, 1.2) });
      readable(P, 5, -157, () => {
        for (let i = 0; i < 7; i++) S(starPts(-52 + hash(i + 30) * 104, -64 + hash(i + 40) * 128, 3 + hash(i) * 4, .45), { fill: C.yellow, stroke: null });
        [C.red, C.yellow, C.green, C.blue].forEach((c, i) => S(rectPts(-50 + i * 25, 42, 25, 22), { fill: c, stroke: null, alpha: .85 }));    // the light-up dance floor
        label('DANCE!', 0, -30, 30, C.white); label('♪ ♫', 0, 12, 24, C.pinkLt);
      });
    });
  }
  // ---------- furniture ----------
  function bed(P, t, o, m) {
    const B = BED;
    if (P.cam.z < B.z1) P.plane(B.z1 - 2, () => {                                                                              // the arched headboard with a heart
      const arch = [[-122, 0], [-122, -120]]; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; arch.push([Math.cos(a) * 122, -120 + Math.sin(a) * 42]); } arch.push([122, 0]);
      S(arch, { fill: C.white, stroke: C.line, lwPx: px(P, 1.2) });
      S(heartPts(0, -122, 30), { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, 1) });
      for (const x of [-122, 122]) { S(rectPts(x - 7, -134, 14, 134), { fill: C.white, stroke: C.line, lwPx: px(P, 1) }); circle(x, -140, 9, { fill: C.pink, stroke: C.line, lwPx: px(P, 1) }); }
    });
    box(P, B.x0, B.x1, 6, 30, B.z0, B.z1 - 6, WHITE);                                                                         // frame
    box(P, B.x0 + 4, B.x1 - 4, 30, 46, B.z0 + 4, B.z1 - 10, { top: C.white, nz: C.white, pz: C.white, side: C.whiteSh });      // mattress
    const duvet = { top: C.pink, nz: C.pink, pz: C.pink, side: C.pinkDk };
    if (m < .5) {
      box(P, B.x0 - 5, B.x1 + 5, 40, 52, B.z0 - 3, B.z1 - 66, duvet);
      box(P, B.x0 - 5, B.x1 + 5, 40, 53, B.z1 - 66, B.z1 - 52, { top: C.white, nz: C.white, pz: C.white, side: C.whiteSh });   // turned-down sheet
      if (P.cam.y > 52) for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) { const d = P.floorCircle(B.x0 + 14 + i * 48 + (j % 2) * 24, B.z0 + 14 + j * 24, 4, 52.3, 10); if (d) S(d, { fill: C.white, stroke: null }); }
      for (const x of [-50, 50]) sprite(P, x, 52, B.z1 - 32, k => TOY.pillow(clamp(k * .32, .5, 1.6)));
    } else {                                                                                                                   // kicked back, hanging off the side
      for (const x of [-50, 50]) sprite(P, x, 46, B.z1 - 32, k => TOY.pillow(clamp(k * .32, .5, 1.6), x > 0 ? .25 : -.12));
      box(P, B.x0 - 5, B.x1 + 5, 40, 54, B.z0 + 40, B.z1 - 96, duvet);
      if (P.cam.x > B.x1) { const hang = wpoly(P, B.x1 + 6, [[B.z0 + 44, 54], [B.z1 - 100, 54], [B.z1 - 120, 30], [B.z1 - 140, 8], [B.z0 + 90, 12], [B.z0 + 56, 26]]); if (hang) S(hang, { fill: C.pinkDk, lwPx: px(P, 1), smooth: .4 }); }
      for (let i = 0; i < 3; i++) { const d = P.floorCircle(-60 + i * 60, B.z0 + 70 + hash(i) * 50, 4, 54.3, 10); if (d) S(d, { fill: C.white, stroke: null }); }
      sprite(P, -10, 54, B.z0 + 110, () => S([[-60, 0], [-40, -9], [-10, -4], [20, -11], [55, -3], [60, 0]], { fill: C.pink, stroke: C.pinkDk, lwPx: 1, smooth: .5 }));   // rumples
    }
  }
  function footboard(P) {
    const B = BED; if (P.cam.z >= B.z0) return;
    P.plane(B.z0 - 4, () => {
      const top = [[-118, 0], [-118, -34]]; for (let i = 0; i <= 8; i++) { const x = -118 + i * 29.5; top.push([x, -34 - (i % 2 ? 0 : 6)]); } top.push([118, -34], [118, 0]);
      S(top, { fill: C.white, stroke: C.line, lwPx: px(P, 1.2), smooth: .2 });
      S(heartPts(0, -19, 10), { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, .9) });
      for (const x of [-118, 118]) { S(rectPts(x - 6, -52, 12, 52), { fill: C.white, stroke: C.line, lwPx: px(P, 1) }); circle(x, -56, 7, { fill: C.pink, stroke: C.line, lwPx: px(P, 1) }); }
    });
  }
  function nightstand(P, s, o, m) {
    const N = STAND, x0 = s * N.x - N.w, x1 = s * N.x + N.w, lit = clamp(o.lamp ?? .5);
    box(P, x0, x1, 0, N.h, N.z0, N.z1, WHITE);
    if (P.cam.z < N.z0) P.plane(N.z0 - .5, () => { for (let i = 0; i < 2; i++) { S(rectPts(x0 + 7, -N.h + 7 + i * 23, x1 - x0 - 14, 19), { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, .9) }); circle((x0 + x1) / 2, -N.h + 16.5 + i * 23, 2.4, { fill: C.gold, stroke: null }); } });
    if (s < 0) sprite(P, s * N.x - 8, N.h, (N.z0 + N.z1) / 2 + 6, k => TOY.lamp(clamp(k * .32, .5, 1.6), lit));
    else { sprite(P, s * N.x + 10, N.h, (N.z0 + N.z1) / 2 + 8, k => TOY.flowers(clamp(k * .32, .5, 1.6))); sprite(P, s * N.x - 14, N.h, (N.z0 + N.z1) / 2 - 8, k => { X.rotate(m > .5 ? .5 : 0); TOY.clock(clamp(k * .32, .5, 1.6)); }); }
  }
  function dresser(P, m, tk = 0) {
    const D = DRESSER;
    box(P, D.x0, D.x1, 0, D.h, BACK, D.z1, WHITE);
    if (P.cam.z > D.z1) P.plane(D.z1 + .5, () => { for (let i = 0; i < 3; i++) { S(rectPts(D.x0 + 8, -D.h + 8 + i * 25, D.x1 - D.x0 - 16, 21), { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, .9) }); for (const f of [.3, .7]) circle(lerp(D.x0, D.x1, f), -D.h + 18.5 + i * 25, 2.4, { fill: C.gold, stroke: null }); } });
    P.plane(BACK + .5, () => { S(heartPts((D.x0 + D.x1) / 2, -175, 62), { fill: C.white, stroke: C.line, lwPx: px(P, 1.2) }); S(heartPts((D.x0 + D.x1) / 2, -172, 50), { fill: '#DCEFF8', stroke: null }); line([[-240, -200], [-224, -186]], { stroke: '#fff', lwPx: px(P, 3) }); });
    sprite(P, D.x0 + 40, D.h, 28, k => TOY.musicBox(clamp(k * .32, .5, 1.6)));
    sprite(P, D.x1 - 30, D.h, 30, k => TOY.flowers(clamp(k * .32, .5, 1.6)));
    if (m > .35 && tk < TAKE_ORD.tiara) sprite(P, (D.x0 + D.x1) / 2 + 10, D.h, 36, k => { X.rotate(-.3); TOY.tiara(clamp(k * .32, .5, 1.6)); });
    if (m > .55 && tk < TAKE_ORD.sock) sprite(P, D.x1 - 8, D.h - 4, D.z1, k => { X.rotate(.4); TOY.sock(clamp(k * .32, .5, 1.6)); });
  }
  function wardrobe(P, m) {
    const Wd = WARD, mid = (Wd.z0 + Wd.z1) / 2;
    box(P, Wd.x0, HW, 0, Wd.h, Wd.z0, Wd.z1, WHITE);
    box(P, Wd.x0 - 6, HW, Wd.h, Wd.h + 10, Wd.z0 - 6, Wd.z1 + 6, WHITE);
    if (P.cam.x < Wd.x0) {
      for (const [a, b] of [[Wd.z0 + 8, mid - 2], [mid + 2, Wd.z1 - 8]]) {
        const d = wrect(P, Wd.x0 - .5, a, b, 14, Wd.h - 12); if (d) S(d, { fill: C.white, stroke: C.line, lwPx: px(P, .9) });
        for (const [y0, y1] of [[30, 110], [128, Wd.h - 30]]) { const p = wrect(P, Wd.x0 - 1, a + 14, b - 14, y0, y1); if (p) S(p, { fill: C.pinkLt, stroke: C.pinkDk, lwPx: px(P, .8) }); }
      }
      for (const z of [mid - 10, mid + 10]) { const k = P.p(Wd.x0 - 2, 118, z); if (P.visible(z)) circle(k[0], k[1], 3.2 * k[2], { fill: C.gold, stroke: C.goldDk, lwPx: px(P, .6) }); }
      if (m > .45) { const sc = wpoly(P, Wd.x0 - 2, [[mid - 4, 150], [mid + 6, 150], [mid + 10, 110], [mid + 2, 70], [mid + 12, 40], [mid - 2, 44], [mid - 6, 90]]); if (sc) S(sc, { fill: C.lilac, stroke: C.lilacDk, lwPx: px(P, .9), smooth: .4 }); }   // a scarf caught in the doors
    }
  }
  function desk(P, m) {
    const D = DESK, w = { top: C.white, nz: C.whiteSh, pz: C.whiteSh, side: C.whiteSh };
    for (const z of [D.z0 + 8, D.z1 - 8]) box(P, D.x0 + 4, D.x0 + 12, 0, D.h - 6, z - 4, z + 4, PINK, { lwPx: px(P, .8) });
    box(P, D.x0 + 10, HW, 20, D.h - 6, D.z1 - 60, D.z1 - 4, WHITE);                                                          // the drawer unit
    if (P.cam.x < D.x0) { const p = wrect(P, D.x0 + 9.5, D.z1 - 54, D.z1 - 10, 30, D.h - 14); if (p) S(p, { fill: C.pink, stroke: C.pinkDk, lwPx: px(P, .8) }); }
    box(P, D.x0, HW, D.h - 6, D.h, D.z0, D.z1, w);
    const y = D.h, xc = (D.x0 + HW) / 2;
    sprite(P, xc + 20, y, D.z1 - 26, k => TOY.lamp(clamp(k * .32, .5, 1.6), .2));
    sprite(P, xc + 10, y, D.z0 + 30, k => TOY.pencilCup(clamp(k * .32, .5, 1.6)));
    const nb = fpoly(P, y + .3, [[xc - 26, D.z0 + 60], [xc + 20, D.z0 + 60], [xc + 20, D.z0 + 110], [xc - 26, D.z0 + 110]]); if (nb) S(nb, { fill: C.lilac, stroke: C.line, lwPx: px(P, .8) });
    if (m > .3) {                                                                                                             // drawings everywhere and the crayons out
      [[-20, 330, .3, C.white], [10, 395, -.4, C.pinkXl], [-8, 440, .1, C.skyLt]].forEach(([dx, z, r, c]) => { const pts = [[-22, -16], [22, -16], [22, 16], [-22, 16]].map(([u, v]) => [xc + dx + u * Math.cos(r) - v * Math.sin(r), z + u * Math.sin(r) + v * Math.cos(r)]); const p = fpoly(P, y + .5, pts); if (p) S(p, { fill: c, stroke: C.line, lwPx: px(P, .7) }); });
      sprite(P, xc - 18, y, D.z0 + 70, k => { X.rotate(-1.3); TOY.crayonBox(clamp(k * .32, .5, 1.6)); });
    }
  }
  function deskChair(P) {
    const c = CHAIR, legs = [[c.x0 + 4, c.z0 + 4], [c.x1 - 4, c.z0 + 4], [c.x0 + 4, c.z1 - 4], [c.x1 - 4, c.z1 - 4]];
    const back = () => box(P, c.x0 - 6, c.x0 + 2, 46, 112, c.z0 + 2, c.z1 - 2, PINK);
    const seat = () => { for (const [x, z] of legs) box(P, x - 2.5, x + 2.5, 0, 40, z - 2.5, z + 2.5, WHITE, { lwPx: px(P, .6) }); box(P, c.x0, c.x1, 40, 47, c.z0, c.z1, PINK); };
    if (P.cam.x < c.x0) { back(); seat(); } else { seat(); back(); }
    if (P.cam.x < c.x0) { const h = wpoly(P, c.x0 - 6.5, heartPts((c.z0 + c.z1) / 2, 0, 12).map(([z, y]) => [z, 84 - (y - 0)])); if (h) S(h, { fill: C.white, stroke: null }); }
  }
  // An open-fronted bookshelf against the right wall; tidy, every shelf is full; messy, the books are mostly on the floor.
  function bookshelf(P, m) {
    const B = SHELF; box(P, B.x0, HW, 0, B.h, B.z0, B.z1, WHITE);
    if (P.cam.x >= B.x0) return;
    const inner = wrect(P, B.x0 - .4, B.z0 + 6, B.z1 - 6, 6, B.h - 6); if (inner) S(inner, { fill: C.pinkLt, stroke: C.line, lwPx: px(P, .8) });
    const cols = [C.purple, C.hot, C.mint, C.sky, C.yellow, C.lilac, C.orange, C.blue, C.pink, C.green];
    for (const [s, y0] of [[0, 8], [1, 54], [2, 100]]) {
      if (s) { const b = wrect(P, B.x0 - .6, B.z0 + 6, B.z1 - 6, y0 - 4, y0); if (b) S(b, { fill: C.white, stroke: C.line, lwPx: px(P, .6) }); }
      for (let z = B.z0 + 10, i = 0; z < B.z1 - 14; i++) {
        const w = 7 + hash(i * 3.3 + s * 11) * 6, h = 28 + hash(i * 1.7 + s * 5) * 12, gone = m > .25 && hash(i * 2.1 + s * 7.7) < .65;
        if (!gone) { const p = wrect(P, B.x0 - .8, z, z + w, y0, y0 + h); if (p) S(p, { fill: cols[Math.floor(hash(i + s * 13) * cols.length)], stroke: C.line, lwPx: px(P, .6) }); }
        z += w + .5;
      }
    }
  }
  function toyChest(P, m, tk = 0) {
    const Cc = CHEST, x0 = -HW, x1 = Cc.x1;
    box(P, x0, x1, 0, Cc.h - 8, Cc.z0, Cc.z1, WHITE);
    if (P.cam.x > x1) sprite(P, x1 + .5, 24, (Cc.z0 + Cc.z1) / 2, () => S(heartPts(0, 0, 12), { fill: C.pink, stroke: C.pinkDk, lwPx: 1 }));
    if (m < .5) box(P, x0, x1 + 4, Cc.h - 8, Cc.h, Cc.z0 - 4, Cc.z1 + 4, PINK);
    else {                                                                                                                   // lid flung open against the wall, toys spilling over the rim
      const lid = wpoly(P, x0 + 3, [[Cc.z0 - 4, Cc.h - 8], [Cc.z1 + 4, Cc.h - 8], [Cc.z1 + 4, Cc.h + 58], [Cc.z0 - 4, Cc.h + 58]]); if (lid) S(lid, { fill: C.pink, stroke: C.line, lwPx: px(P, 1) });
      const in_ = fpoly(P, Cc.h - 9, [[x0 + 4, Cc.z0 + 4], [x1 - 4, Cc.z0 + 4], [x1 - 4, Cc.z1 - 4], [x0 + 4, Cc.z1 - 4]]); if (in_) S(in_, { fill: '#B98EA0', stroke: null });
      if (tk < TAKE_ORD.chestCar) sprite(P, -320, Cc.h - 12, Cc.z0 + 40, k => { X.rotate(-.5); TOY.car(clamp(k * .32, .5, 1.6)); });
      if (tk < TAKE_ORD.chestRings) sprite(P, -312, Cc.h - 12, Cc.z0 + 90, k => { X.rotate(.4); TOY.rings(clamp(k * .32, .5, 1.6)); });
    }
  }
  function lantern(P, lit) {
    const x = 0, z = 470, y = CEIL - 66;
    const cord = P.line([[x, CEIL, z], [x, y + 22, z]]); if (cord) line(cord, { stroke: C.line, lwPx: px(P, 1) });
    sprite(P, x, y, z, () => {
      glowAt(0, 0, 110, 80, '#FFD7E4', .3 * lit);
      circle(0, 0, 22, { fill: lit > .05 ? '#FFE3EC' : C.pinkLt, stroke: C.line, lwPx: 1.1 });
      for (const r of [8, 15]) ellipse(0, 0, r, 22, { fill: null, stroke: C.pink, lwPx: .9 });
      S(rectPts(-6, -25, 12, 4), { fill: C.white, stroke: C.line, lwPx: .8 });
    });
  }

  // ---------- the toys' two places ----------
  // Each toy has a tidy place (or none: put away in the chest) and a messy place, and a threshold th: it is out once messy ≥ th.
  // [name, tidy [x, y, z, rot] | null, messy [x, y, z, rot], th, scale]
  const TOYS = [
    ['pearl', [-30, 52, 846, 0], [-98, 0, 512, .3], .15, 1.7],
    ['neptune', [36, 52, 842, -.75, true], [30, 54, 758, -.12], .3, 1.6],
    ['jester', [312, SHELF.h, 118, 0], [96, 0, 352, -1.5], .2, 1.7],
    ['robo', [312, SHELF.h, 205, 0], [-150, 0, 290, .45], .4, 1.7],
    ['teddy', [-322, CHEST.h, 470, 0], [-212, 0, 650, -.35], .5, 1.7],
    ['ball', null, [158, 0, 296, 0], .1, 1.4],
    ['ball', null, [-236, 0, 150, 0], .55, 1.1],
    ['car', null, [212, 0, 222, -.15], .35, 1.4],
    ['car', null, [-48, 0, 150, 2.95], .7, 1.3],
    ['rings', null, [122, 0, 628, .2], .45, 1.4],
    ['rings', null, [-246, 0, 400, -.25], .8, 1.2],
    ['bookStack', null, [252, 0, 140, 0], .25, 1.4],
    ['bookStack', null, [-250, 0, 300, .1], .6, 1.2],
    ['pillow', null, [-58, 0, 640, .05], .6, .9],
    ['shirt', null, [196, 0, 700, .1], .55, 1.4],
    ['shirt', null, [-118, 0, 96, -.2], .75, 1.3],
    ['sock', null, [-262, 0, 236, .3], .65, 1.4],
    ['sock', null, [86, 0, 118, -.5], .85, 1.4],
    ['crayonBox', null, [-30, 0, 612, 1.4], .4, 1.4],
  ];
  // [x, y, z, colour, letter, th]: alphabet blocks (18 cubes), on the floor and one on the bed
  const BLOCKS = [[4, 0, 268, C.red, 'A', .1], [28, 0, 290, C.blue, 'B', .2], [-46, 0, 566, C.yellow, 'C', .3], [-46, 18, 566, C.green, 'D', .45], [-20, 0, 590, C.purple, 'E', .6],
    [136, 0, 560, C.orange, 'F', .5], [-40, 54, 740, C.mint, 'G', .7], [-104, 0, 182, C.hot, 'H', .35], [-80, 0, 196, C.blue, 'I', .5], [-92, 18, 188, C.yellow, 'J', .65],
    [62, 0, 150, C.green, 'K', .4], [182, 0, 520, C.red, 'L', .7], [-196, 0, 560, C.purple, 'M', .8], [120, 0, 420, C.yellow, 'N', .9]];
  const BOOKS_OPEN = [[-148, 0, 612, .4, C.hot, .25], [58, 0, 226, -.3, C.blue, .5], [-62, 54, 806, .2, C.purple, .65], [-60, 0, 110, -.6, C.green, .7], [176, 0, 610, .9, C.orange, .85]];   // [x, y, z, rot, cover, th]
  const CRAYONS = [[10, 628, .4, C.red], [26, 618, 1.9, C.blue], [-6, 646, 2.8, C.green], [44, 640, .9, C.purple], [150, 380, 1.2, C.orange], [-120, 420, 2.2, C.yellow],
    [-150, 230, .7, C.hot], [-128, 246, 2.4, C.blue], [-160, 252, 1.6, C.green], [200, 160, .3, C.purple]];

  // `taken`: every toy gets its own moment (ord, 0..1) to vanish, scattered so the room empties all over at once
  const takeOrd = (kind, i) => .04 + .9 * frac((i + { toy: 0, block: 17, book: 41, crayon: 53 }[kind]) * .6180339 + .21);
  const TAKE_ORD = { tiara: .3, sock: .62, chestCar: .78, chestRings: .86, rope: .5 };
  function takeables(m, tk = 0) {
    const out = [], put = (it) => { if (tk < it.ord) out.push(it); };
    TOYS.forEach(([name, tidy, messy, th, sc], i) => { const a = m >= th ? messy : tidy; if (a) put({ kind: 'toy', name, x: a[0], y: a[1], z: a[2], rot: a[3], sc, flip: a[4], ord: takeOrd('toy', i) }); });
    BLOCKS.forEach(([x, y, z, col, letter, th], i) => { if (m >= th) put({ kind: 'block', x, y, z, col, letter, ord: takeOrd('block', i) }); });
    BOOKS_OPEN.forEach(([x, y, z, r, col, th], i) => { if (m >= th) put({ kind: 'book', x, y, z, rot: r, col, ord: takeOrd('book', i) }); });
    CRAYONS.forEach(([x, z, r, col], i) => { if (m >= .2 + i * .07) put({ kind: 'crayon', x, y: 1.5, z, rot: r, col, ord: takeOrd('crayon', i) }); });
    if (m > .35) put({ kind: 'toy', name: 'tiara', x: (DRESSER.x0 + DRESSER.x1) / 2 + 10, y: DRESSER.h, z: 36, rot: -.3, sc: 1, ord: TAKE_ORD.tiara });
    if (m > .55) put({ kind: 'toy', name: 'sock', x: DRESSER.x1 - 8, y: DRESSER.h - 4, z: DRESSER.z1, rot: .4, sc: 1, ord: TAKE_ORD.sock });
    if (m >= .5) { put({ kind: 'toy', name: 'car', x: -320, y: CHEST.h - 12, z: CHEST.z0 + 40, rot: -.5, sc: 1, ord: TAKE_ORD.chestCar }); put({ kind: 'toy', name: 'rings', x: -312, y: CHEST.h - 12, z: CHEST.z0 + 90, rot: .4, sc: 1, ord: TAKE_ORD.chestRings }); }
    return out;
  }

  function block(P, x, y, z, col, letter) {
    const s = 18; box(P, x - s / 2, x + s / 2, y, y + s, z - s / 2, z + s / 2, { top: mixCol(col, '#fff', .3), nz: col, pz: col, side: mixCol(col, '#000', .12) }, { lwPx: px(P, .8) });
    const fz = P.cam.z < z - s / 2 ? z - s / 2 : P.cam.z > z + s / 2 ? z + s / 2 : null;
    if (fz != null) sprite(P, x, y + s / 2, fz, () => label(letter, 0, .5, 13, '#fff', 800));
  }
  function openBook(P, x, y, z, r, cover) {
    const rot = pts => pts.map(([u, v]) => [x + u * Math.cos(r) - v * Math.sin(r), z + u * Math.sin(r) + v * Math.cos(r)]);
    const c = fpoly(P, y + .3, rot([[-24, -15], [24, -15], [24, 15], [-24, 15]])); if (c) S(c, { fill: cover, stroke: C.line, lwPx: px(P, .8) });
    for (const sg of [-1, 1]) { const p = fpoly(P, y + .8, rot([[0, -13], [sg * 22, -14], [sg * 22, 13], [0, 14]])); if (p) S(p, { fill: C.white, stroke: C.line, lwPx: px(P, .6) });
      for (let i = 0; i < 3; i++) { const l = P.line(rot([[sg * 4, -7 + i * 6], [sg * 18, -7 + i * 6]]).map(([a, b]) => [a, y + 1, b])); if (l) line(l, { stroke: C.whiteDk, lwPx: px(P, .8) }); } }
  }
  function jumpRope(P) {
    const pts = Array.from({ length: 24 }, (_, i) => { const u = i / 23; return [140 + u * 110 + Math.sin(u * 9) * 14, .5, 70 + Math.sin(u * 5 + 1) * 40 + u * 50]; });
    const l = P.line(pts); if (l) line(l, { stroke: C.hot, lwPx: px(P, 2.2), smooth: true });
    for (const p of [pts[0], pts[23]]) box(P, p[0] - 2.5, p[0] + 2.5, 0, 5, p[2] - 7, p[2] + 7, C.yellow, { lwPx: px(P, .6) });
  }

  // Every piece gets its far edge in camera depth, so the list sorts correctly from either end of the room.
  function items(P, t, o) {
    const list = [], add = (za, zb, draw, pri = 0) => list.push({ za, zb, draw, pri }), m = clamp(+o.messy || 0), lit = clamp(o.lamp ?? .5), tk = clamp(+o.taken || 0);
    add(BED.z0, BED.z1, () => bed(P, t, o, m), 0);
    add(BED.z0 - 4, BED.z0 - 4, () => footboard(P), 3);
    for (const s of [-1, 1]) add(STAND.z0, STAND.z1, () => nightstand(P, s, o, m), 0);
    add(BACK, DRESSER.z1, () => dresser(P, m, tk), 0);
    add(WARD.z0, WARD.z1, () => wardrobe(P, m), -1);
    add(DESK.z0, DESK.z1, () => desk(P, m), 0);
    add(CHAIR.z0, CHAIR.z1, () => deskChair(P), 1);
    add(SHELF.z0, SHELF.z1, () => bookshelf(P, m), -1);
    add(CHEST.z0, CHEST.z1, () => toyChest(P, m, tk), -1);
    add(470, 470, () => lantern(P, lit), 4);
    TOYS.forEach(([name, tidy, messy, th, sc], i) => {
      const at = m >= th ? messy : tidy; if (!at || tk >= takeOrd('toy', i)) return;
      add(at[2], at[2], () => toy(P, name, at[0], at[1], at[2], at[3], sc, at[4]), 2);
    });
    BLOCKS.forEach(([x, y, z, col, letter, th], i) => { if (m >= th && tk < takeOrd('block', i)) add(z - 9, z + 9, () => { if (!y) shadow(P, x, z, 13); block(P, x, y, z, col, letter); }, 2 + y / 100); });
    BOOKS_OPEN.forEach(([x, y, z, r, cover, th], i) => { if (m >= th && tk < takeOrd('book', i)) add(z + 20, z + 20, () => openBook(P, x, y, z, r, cover), 1.5); });
    CRAYONS.forEach(([x, z, r, c], i) => { if (m >= .2 + i * .07 && tk < takeOrd('crayon', i)) add(z + 8, z + 8, () => { const l = P.line([[x - Math.cos(r) * 7, 1.5, z - Math.sin(r) * 7], [x + Math.cos(r) * 7, 1.5, z + Math.sin(r) * 7]]); if (l) line(l, { stroke: c, lwPx: clamp(3 * P.k(z), .8, 14) }); }, 1.6); });
    if (m >= .75 && tk < TAKE_ORD.rope) add(170, 170, () => jumpRope(P), 1.4);
    for (const it of list) it.key = Math.max(P.depth(it.za), P.depth(it.zb));
    return list.sort((a, b) => b.key - a.key || a.pri - b.pri);
  }

  return {
    MARK: { x: 0, z: 450 }, HW, BACK, FRONT, CEIL, BED, DESK, WARD, SHELF, CHEST, RUG, toys: TOY, takeables,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      floor(P); ceiling(P); sideWalls(P, t, o); backWall(P, t); frontWall(P, t, o);
      const d = !Number.isFinite(o.splitZ) ? -Infinity : P.depth(o.splitZ);               // ±Infinity / unset = draw everything
      for (const it of items(P, t, o)) if (it.key > d) it.draw();
    },
    front(P, t, o = {}) {
      if (!Number.isFinite(o.splitZ)) return;
      const d = P.depth(o.splitZ), stop = o.toZ == null ? -Infinity : P.depth(o.toZ);
      for (const it of items(P, t, o)) if (it.key <= d && it.key > stop) it.draw();
    },
  };
})();

// Registration for the studio's location browser: named spots, camera presets (paste-ready for scene code) and the two
// variants (the studio's Tidy / Messy toggle passes these options to back() and front()).
// Bed cameras look toward the bed (dir 1); door cameras stand at the foot of the bed and look back (dir: -1).
LOCATIONS.alma_bedroom = Object.assign(almaBedroom, {
  variants: { Tidy: { messy: 0 }, Messy: { messy: 1 } },
  spots: {
    'Middle of the rug': { x: 0, y: 0, z: 450 },
    'Sitting on the bed': { x: 0, y: 50, z: 790 },
    'Beside the bed': { x: -165, y: 0, z: 730 },
    'At the desk': { x: 215, y: 0, z: 385 },
    'By the window': { x: -255, y: 0, z: 470 },
    'By the wardrobe': { x: 210, y: 0, z: 690 },
    'At the dresser': { x: -210, y: 0, z: 120 },
    'Doorway': { x: 220, y: 0, z: 50 },
  },
  cameras: {
    'Bed · wide from the door': { x: 0, y: 165, z: 30, f: 620, hy: 560, dir: 1 },
    'Bed · medium': { x: 0, y: 120, z: 380, f: 900, hy: 600, dir: 1 },
    'Bed · close': { x: 0, y: 105, z: 560, f: 1000, hy: 640, dir: 1 },
    'Floor · toy\'s-eye': { x: -20, y: 32, z: 170, f: 760, hy: 470, dir: 1 },

    'Door · from the bed': { x: 0, y: 170, z: 670, f: 620, hy: 540, dir: -1 },
    'Door · dresser': { x: -120, y: 130, z: 420, f: 900, hy: 590, dir: -1 },
    'Desk and bookshelf': { x: -40, y: 130, z: 640, f: 600, hy: 560, dir: -1 },
    'Window and toy chest': { x: -150, y: 120, z: 670, f: 480, hy: 550, dir: -1 },
  },
});
