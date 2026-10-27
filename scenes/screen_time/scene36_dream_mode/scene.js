// Scene 36: "Dream Mode", a music video, the finale of the Screen Time arc (32–35). Asleep after game night, the Safadi brothers
// dream they're inside their video games with the kids: PRESS START, character select, then four worlds (Robo Invasion, World
// Champion, Craft Blocks, Fight Planet), each won as a team, and a final boss: THE ALARM CLOCK. CONTINUE? The screen cracks and they
// wake up on the sofa to the kids, a ringing clock and the board games. THE END.
// First cut: picture only, on a 120 bpm grid (a beat every .5 s). Every section start is a constant below, and each shot times its
// beats from its own section start, so the cut can be re-timed to the song. Every shot is a pure function of t.
(() => {
  const LR = LOCATIONS.living_room, B = .5;
  // ---------- section starts (seconds) ----------
  const S_START = 8, S_TITLE = 12, S_SELECT = 16, S_W1 = 24, S_FLY = 28, S_INV = 36, S_SHIELD = 44, S_BOSS1 = 50, S_WARP1 = 58;
  const S_W2 = 62, S_KICK = 66, S_PASS = 74, S_BIKE = 82, S_CELEB = 90, S_WARP2 = 96;
  const S_W3 = 100, S_BUILD = 104, S_CREEP = 112, S_CUBE = 120, S_PARTY = 128;
  const S_VS = 136, S_ROUND = 137.8, S_COMBO = 139.6, S_KO = 149.5, S_BOSSRISE = 158, S_BOSSFIGHT = 162, S_CONT = 168, S_WAKE = 172, END = 180;

  // ---------- helpers ----------
  const inW = (t, a, b) => t >= a && t < b;
  const on = (t, a, b, r = .25) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const beatN = (t, t0) => Math.floor((t - t0) / B);                            // whole beats since t0
  const hop = (t, f = 1) => Math.abs(Math.sin((t * 120 / 60) * Math.PI * f));  // a bounce on the beat
  const UNITS = { safadi: SAFADI_UNIT, sami: SAMI_UNIT, housam: HOUSAM_UNIT, alma: ALMA_UNIT, jenna: JENNA_UNIT, danny: DANNY_UNIT };
  const KIDS = ['housam', 'alma', 'jenna', 'danny'];
  const rig = (who, x, y, s, o) => DM_RIG[who](x, y, s, { t: T, noShadow: true, boil: .6, ...DM_BASE[who], ...o });
  const fists = { handL: [-3.6, -17], handR: [3.6, -17], handPoseL: 'fist', handPoseR: 'fist' };
  const cheerPose = (t, ph = 0) => ({ handL: [-5, -18], handR: [5, -18], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', brows: 'up', jump: 1.2 * hop(t + ph * .1) });
  function card(t, t0, n, title, sub, col, bg, extra) {                       // a WORLD n title card
    bg(t); const lt = t - t0;
    X.fillStyle = rgba('#000000', .35); X.fillRect(0, H * .28, W, H * .44);
    dmSlam(`WORLD ${n}`, W / 2, H * .34, 90, '#FFFFFF', t, t0 + .2, 4);
    dmSlam(title, W / 2, H * .48, 170, col, t, t0 + .7, 4, { rot: -.03 });
    const typed = Math.floor(Math.max(0, lt - 1.5) * 18); if (typed > 0) stArcade(sub.slice(0, typed), W / 2, H * .63, 60, '#FFE066');
    if (extra) extra(t, lt);
    dmPixelWipe(seg(t, t0 + 3.5, t0 + 4) * 1, '#000');
  }

  // =====================================================================================================
  // ---------- intro: the living room at night, into the dream ----------
  const SEAT = LR.SOFA.seat, HIP = 8, TWIN = { safadi: [95, 140], sami: [-95, 140] };
  function sofaTwins(P, t, pose) {
    const A = {};
    for (const name of ['safadi', 'sami']) {
      const [x, z] = TWIN[name], [sx, sy, k] = P.p(x, SEAT - HIP * UNITS[name], z);
      A[name] = DM_RIG[name](sx, sy, UNITS[name] * k, { t, footL: [-3.6, -1.3], footR: [3.6, -1.3], handL: [-3.6, -9.0], handR: [3.6, -9.0], ...pose(name) }); A[name].s = UNITS[name] * k;
    }
    return A;
  }
  const asleep = (t, ph) => ({ eyes: 'closed', mouth: Math.sin(t * 2.2 + ph) > 0 ? 'o' : 'flat', tilt: ph ? .3 : -.3, dy: .7, lookY: .5, breathe: 1 });
  function cloud(x, y, rx, ry, fill, t) {                                        // a dream cloud (drawn in place, so the camera zoom applies)
    for (let i = 0; i < 11; i++) { const a = i / 11 * TAU; circle(x + Math.cos(a) * rx, y + Math.sin(a) * ry, Math.min(rx, ry) * .42, { fill, stroke: DM.ink, lwPx: 6 }); }
    for (let i = 0; i < 11; i++) { const a = i / 11 * TAU; circle(x + Math.cos(a) * rx, y + Math.sin(a) * ry, Math.min(rx, ry) * .42 - 3, { fill, stroke: null }); }
    ellipse(x, y, rx, ry, { fill, stroke: null });
  }
  function dozing(t) {
    const zoom = 1 + 7 * easeIn(seg(t, 4.5, 8)), P = persp({ x: 0, y: 140, z: 600, f: 1000, hy: 600, dir: -1 });
    const sfH = P.p(TWIN.safadi[0], 150, TWIN.safadi[1]), bub = [sfH[0] + 40, 240];
    camBegin(lerp(W / 2, bub[0], seg(zoom, 1, 2)), lerp(H / 2, bub[1], seg(zoom, 1, 2)), zoom);
    LR.back(P, t, { splitZ: 140, night: 1, lamp: .35, fan: true });
    const A = sofaTwins(P, t, n => asleep(t, n === 'sami' ? 1.3 : 0));
    LR.front(P, t, { splitZ: 140, night: 1, lamp: .35, fan: true });
    X.fillStyle = 'rgba(20,16,60,.35)'; X.fillRect(-W, -H, 3 * W, 3 * H);
    // the snores: Z's that turn into pixel Z's as they rise
    for (const [name, ph] of [['safadi', 0], ['sami', .5]]) { const R = A[name];
      for (let i = 0; i < 3; i++) { const u = frac(t * .4 + ph + i / 3), x = R.top[0] + (name === 'safadi' ? 1 : -1) * 40 * u, y = R.top[1] - 30 - 220 * u;
        X.save(); X.globalAlpha = Math.sin(Math.PI * u); stArcade('Z', x, y, 40 + 40 * u, u > .5 ? DM.cyan : '#BFD8FF'); X.restore(); } }
    // the dream bubble grows over the professor, showing a glowing game screen
    const k = ease(seg(t, 1.5, 3.5));
    if (k > 0) {
      for (let i = 0; i < 3; i++) circle(lerp(A.safadi.top[0], bub[0], (i + 1) / 4), lerp(A.safadi.top[1], bub[1] + 120, (i + 1) / 4), (8 + i * 8) * k, { fill: '#F4EEFF', stroke: DM.ink, lwPx: 4 });
      cloud(bub[0], bub[1], 230 * k, 150 * k, '#F4EEFF', t);
      X.save(); X.beginPath(); X.ellipse(bub[0], bub[1], 200 * k, 125 * k, 0, 0, TAU); X.clip();
      X.fillStyle = '#05040A'; X.fillRect(bub[0] - 260, bub[1] - 160, 520, 320);
      for (let i = 0; i < 30; i++) circle(bub[0] + (hash(i) - .5) * 400, bub[1] + (hash(i + 9) - .5) * 240, 2, { fill: '#FFFFFF', stroke: null });
      if (frac(t * 2) < .6) stArcade('PRESS START', bub[0], bub[1], 34 * k, DM.gold);
      X.restore();
    }
    camEnd();
    flash(seg(t, 7.2, 8) * .9, '#05040A');
  }

  // ---------- press start ----------
  function pressStart(t) {
    const lt = t - S_START, k = seg(lt, 0, .7);
    dmCRT(t, k, (w, h) => {
      dmStars(t, 90, -40, 0); dmGrid(t, DM.neon, { hy: h * .6 });
      if (lt < 2.2 && frac(t * 2) < .65) stArcade('PRESS START', w / 2, h * .42, 110, DM.gold);
      // a big gold Z-coin drops into the slot
      const slotY = h * .74, u = easeIn(seg(lt, 1.8, 2.6)), cy = lerp(-80, slotY, u), sq = 1 - .5 * kick(lt, 2.6, 10);
      shape(rectPts(w / 2 - 110, slotY - 14, 220, 28), { fill: '#05040A', stroke: DM.gold, lwPx: 6, smooth: .5 });
      stArcade('INSERT DREAM', w / 2, slotY + 70, 46, '#FFFFFF');
      if (lt > 1.8 && lt < 2.75) { X.save(); X.beginPath(); X.rect(0, 0, w, slotY); X.clip(); X.save(); X.translate(w / 2, cy); X.scale(Math.cos(lt * 9) * sq, 1);
        circle(0, 0, 80, { fill: DM.gold, stroke: DM.ink, lwPx: 6 }); stArcade('Z', 0, 4, 90, '#FFF6C8'); X.restore(); X.restore(); }
      if (lt > 2.6) { dmPop('1 CREDIT', w / 2, h * .42, 90, DM.mint, t, S_START + 2.65, 1.4); }
    });
    flash(seg(t, S_TITLE - .3, S_TITLE) * 1);
  }

  // ---------- the title ----------
  function title(t) {
    const lt = t - S_TITLE;
    rvtSunburst(W / 2, H * .45, t, '#1A0A3A', '#2E1260', 20, .2);
    dmStars(t, 80, 0, 0); dmGrid(t, DM.cyan);
    for (const [who, x, d] of [['safadi', 380, 1.4], ['sami', W - 380, 1.6]]) { const k = backOut(seg(lt, d, d + .35)); if (k <= 0) continue;
      X.save(); X.translate(x, H * .72); X.scale(k, k); dmChar(who, 0, 0, 120, { eyes: 'happy', mouth: 'O', brows: 'up', jump: 0 }); X.restore(); }
    dmSlam('DREAM MODE', W / 2, H * .36, 230, DM.neon, t, S_TITLE + .2, 4.2, { rot: -.04 });
    dmSlam('GAME ON!', W / 2, H * .58, 150, DM.gold, t, S_TITLE + 1.0, 4.2, { rot: .03 });
    if (lt > 1) for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, d = 300 + 600 * frac(lt * .6 + i * .07); shape(rectPts(W / 2 + Math.cos(a) * d - 10, H * .45 + Math.sin(a) * d * .6 - 10, 20, 20), { fill: [DM.neon, DM.cyan, DM.gold][i % 3], stroke: null }); }
    dmPixelWipe(seg(t, S_SELECT - .5, S_SELECT) * 1, '#0B0820');
  }

  // ---------- character select, then world select ----------
  const ROSTER = [['safadi', 'PROF. SAFADI'], ['sami', 'DR. SAMI'], ['housam', 'HOUSAM'], ['alma', 'ALMA'], ['jenna', 'JENNA'], ['danny', 'DANNY'],
    ['neptune', 'KING NEPTUNE'], ['robo', 'ROBO-SAFADI'], ['clawd', 'CLAWD'], ['jester', 'FESTER'], ['pearl', 'PEARL'], ['dragon', 'DRAGON']];
  const PW = 230, PH = 230, PX0 = (W - 6 * PW - 5 * 40) / 2, PY = [230, 600];
  const portraitAt = i => [PX0 + (i % 6) * (PW + 40), PY[Math.floor(i / 6)]];
  function select(t) {
    const lt = t - S_SELECT;
    dmBG('#0B0820', '#1A0F3A'); dmGrid(t, DM.neon, { hy: H * .8 });
    if (lt < 4.2) {
      stArcade('SELECT YOUR PLAYER', W / 2, 110, 80, '#FFFFFF');
      ROSTER.forEach(([who, name], i) => {
        const [x, y] = portraitAt(i), pop = backOut(seg(lt, i * .04, i * .04 + .3)); if (pop <= 0) return;
        const joined = i < 6 ? S_SELECT + .5 + i * .5 : 1e9, sel = t > joined, guide = who === 'clawd' && lt > 3.5;
        X.save(); X.translate(x + PW / 2, y + PH / 2); X.scale(pop, pop); X.translate(-PW / 2, -PH / 2);
        shape(rectPts(0, 0, PW, PH), { fill: linGrad(0, 0, 0, PH, [[0, '#3A2A6A'], [1, '#1A1236']]), stroke: '#6A5AAA', lwPx: 5 });
        X.save(); X.beginPath(); X.rect(0, 0, PW, PH); X.clip();
        const big = who === 'neptune' || who === 'pearl' || who === 'dragon' ? 62 : who === 'clawd' ? 70 : 80;
        dmChar(who, PW / 2, PH * .48, big, { eyes: guide ? 'wink' : sel ? 'happy' : undefined, mouth: sel ? 'grin' : undefined });
        X.restore();
        shape(rectPts(0, PH - 44, PW, 44), { fill: rgba('#000', .6), stroke: null }); stArcade(name, PW / 2, PH - 22, name.length > 10 ? 24 : 30, '#FFFFFF');
        X.restore();
        if (i >= 2 && i < 6 && sel) { dmCursor(x, y, PW, PH, `P${i + 1}`, DM.kids[who], t); dmPop('JOINED!', x + PW / 2, y + PH * .5, 44, DM.kids[who], t, joined, .9); }
        if (guide) dmPop('GUIDE', x + PW / 2, y + PH * .5, 50, DM.cyan, t, S_SELECT + 3.5, .8);
      });
      if (t > S_SELECT + .5) dmCursor(...portraitAt(0), PW, PH, 'P1', DM.p1, t);
      if (t > S_SELECT + 1.0) dmCursor(...portraitAt(1), PW, PH, 'P2', DM.p2, t);
      dmPixelWipe(seg(lt, 3.6, 4) * 1, '#0B0820');
      return;
    }
    // SELECT WORLD: four cartridges slide in; the cursor dives into World 1
    stArcade('SELECT WORLD', W / 2, 110, 80, '#FFFFFF');
    const ART = [
      (x, y, w, h) => { X.fillStyle = '#120A2E'; X.fillRect(x - w, y - h, 2 * w, 2 * h); dmStars(t, 20, -20, 0, { r: 1.2 }); dmChar('robo', x, y - h * .05, w * .18, { eyes: 'open', red: 1, mouth: 'teeth' }); },
      (x, y, w, h) => { X.fillStyle = '#3FA34D'; X.fillRect(x - w, y - h, 2 * w, 2 * h); housamBall(x, y - h * .1, 7, { spin: t * 4 }); },
      (x, y, w, h) => { X.fillStyle = '#7EC8FF'; X.fillRect(x - w, y - h, 2 * w, 2 * h); for (let i = 0; i < 4; i++) dmBlock(x - w * .4 + i * w * .2, y + h * .05, w * .2, i % 2 ? 'grass' : 'dirt'); dmBlock(x - w * .1, y - h * .17, w * .2, 'wood'); },
      (x, y, w, h) => { X.fillStyle = '#2A0E4A'; X.fillRect(x - w, y - h, 2 * w, 2 * h); dmPlanet(x, y - h * .05, w * .22, { ring: '#FFE7A8', craters: 2, lw: 3 }); },
    ];
    const CART = [['ROBO INVASION', '#FF5A5A'], ['WORLD CHAMPION', '#FFE066'], ['CRAFT BLOCKS', '#5BC24A'], ['FIGHT PLANET', '#B678E0']];
    const zoomK = easeIn(seg(lt, 6.8, 8));
    CART.forEach(([label, col], i) => {
      const u = backOut(seg(lt, 4.2 + i * .5, 4.6 + i * .5)); if (u <= 0) return;
      const x = 330 + i * 420, y = 560 + 20 * Math.sin(t * 3 + i);
      if (i === 0 && zoomK > 0) return;
      X.save(); X.translate(x, y); X.scale(u, u); dmCartridge(0, 0, 330, label, col, t, ART[i]); X.restore();
    });
    if (lt > 6.2) dmCursor(330 - 175, 560 - 200, 350, 400, 'P1 + P2', DM.p1, t);
    if (zoomK > 0) { const s = lerp(1, 7, zoomK); X.save(); X.translate(lerp(330, W / 2, zoomK), lerp(560, H / 2, zoomK)); X.scale(s, s); dmCartridge(0, 0, 330, 'ROBO INVASION', '#FF5A5A', t, ART[0]); X.restore(); }
    flash(seg(lt, 7.6, 8) * .9, '#FFFFFF');
  }

  // =====================================================================================================
  // ---------- World 1: Robo Invasion ----------
  const spaceBG = (t, o = {}) => { dmBG('#08051C', '#1E1050', '#3A1A6A'); dmStars(t, 140, o.vx ?? -500, 0, { streak: o.streak ?? .05 });
    dmPlanet(((1500 - t * 60) % 2600 + 2600) % 2600 - 300, 260, 120, { c0: '#FFB46B', c1: '#D2472E', ring: '#FFE7A8' });
    dmPlanet(((600 - t * 25) % 2400 + 2400) % 2400 - 200, 820, 70, { c0: '#9AD8FF', c1: '#3A6AD0', craters: 2, lw: 3 }); };
  const card1 = t => card(t, S_W1, 1, 'ROBO INVASION', 'MISSION: RESEARCH... ', '#FF5A5A', tt => spaceBG(tt, { vx: -120 }), (tt, lt) => { dmSlam('SPACE!', W / 2 + 430, H * .63, 90, DM.cyan, tt, S_W1 + 2.6, 1.6, { rot: -.12 }); });
  const twinPilots = (o = {}) => [{ who: 'safadi', o: { eyes: 'happy', mouth: 'grin', ...o.safadi } }, { who: 'sami', o: { eyes: 'happy', mouth: 'grin', ...o.sami } }];
  const kidShip = (who, x, y, s, t, o = {}) => dmShip(x, y, s, DM.kids[who], t, { pilots: [{ who, o: { eyes: 'happy', mouth: 'grin', ...o.pose } }], ...o });
  function spaceFly(t) {
    const lt = t - S_FLY, bar = Math.floor(lt / 2);
    spaceBG(t, { streak: .12 });
    rvtSpeedLines(W * .9, H * .5, t, rgba('#FFFFFF', .06), 24, 500);
    const bank = .12 * Math.sin(lt * Math.PI / 2);
    camBegin(W / 2, H / 2, 1 + .03 * Math.sin(lt), bank * .3);
    const form = [['housam', -520, -230], ['alma', -520, 230], ['jenna', -900, -380], ['danny', -900, 380]];
    form.forEach(([who, dx, dy], i) => { const sw = 30 * Math.sin(t * 2 + i) + (bar % 2 ? 1 : -1) * 20 * Math.sin(lt * Math.PI); kidShip(who, 900 + dx + sw, 540 + dy + 20 * hop(t + i * .1), 42, t, { tilt: bank + .05 * Math.sin(t * 3 + i) }); });
    dmShip(1020 + 40 * Math.sin(t * .8), 520 + 26 * Math.sin(t * 2), 78, DM.p1, t, { tilt: bank, pilots: twinPilots() });
    camEnd();
    dmPop('RESEARCHING SPACE...', W / 2, 140, 64, DM.cyan, t, S_FLY + 1.0, 2.6);
    dmPop('100% COMPLETE!', W / 2, 140, 64, DM.gold, t, S_FLY + 4.0, 2.4);
    if (lt > 6) dmSlam('INCOMING!', W / 2, H * .5, 140, DM.red, t, S_FLY + 6.4, 1.6, { shake: 16 });
  }
  // the invaders: a 3 × 5 grid that steps on the beat; formula shots knock them out one per beat
  const INV_ORDER = [7, 2, 12, 5, 9, 0, 14, 3, 11, 6, 1, 13, 8, 4, 10];
  const invAt = (i, t) => { const st = Math.max(0, beatN(t, S_INV)), tri = st % 8, hx = 50 * (tri <= 4 ? tri : 8 - tri) - 100; return [500 + (i % 5) * 230 + hx, 230 + Math.floor(i / 5) * 190 + 12 * Math.floor(st / 8)]; };
  const invHit = i => S_INV + .9 + INV_ORDER.indexOf(i) * B;
  const FORMULAS = ['E=mc²', 'π', '√2', 'Σ', 'a²+b²', '∞', 'Δx', 'F=ma'];
  function invaders(t) {
    const lt = t - S_INV;
    spaceBG(t, { vx: -60, streak: 0 });
    const shipX = W / 2 + 420 * Math.sin(lt * .9), shipY = 900;
    for (let i = 0; i < 15; i++) {                                               // the robots
      const th = invHit(i), [x, y] = invAt(i, t);
      if (t < th) { const odd = beatN(t, S_INV) % 2;
        rig('robo', x, y, 5.6, { eyes: 'open', red: 1, mouth: 'teeth', brows: 'angry', hum: false, jump: .25 * hop(t), handL: odd ? [-6, -20] : [-6.5, -14], handR: odd ? [6.5, -14] : [6, -20], handPoseL: 'claw', handPoseR: 'claw', antenna: odd ? .3 : -.3 }); }
      // the formula shot that gets it
      const fu = seg(t, th - .45, th); if (fu > 0 && fu < 1) { const sx = lerp(shipX, x, fu), sy = lerp(shipY - 150, y - 60, fu); dmFormula(sx, sy, 48, FORMULAS[INV_ORDER.indexOf(i) % FORMULAS.length], t); }
      dmBoom(x, y - 60, 90, seg(t, th, th + .6)); dmPop('+100', x, y - 120, 46, DM.gold, t, th, .8);
    }
    for (let j = 0; j < 10; j++) {                                               // broccoli bombs on the off-beats
      const tb = S_INV + .75 + j * .75, u = seg(t, tb, tb + 1.4); if (u <= 0 || u >= 1) continue;
      const src = (j * 7) % 15, [x, y] = invAt(src, tb); dmBroccoli(x + 30 * Math.sin(u * 6), lerp(y, H + 60, u), 22, u * 6);
    }
    dmShip(shipX, shipY, 62, DM.p1, t, { tilt: -Math.PI / 2 * 0 - .08 * Math.cos(lt * .9), pilots: twinPilots({ safadi: { eyes: 'open', brows: 'focused' } }) });
    kidShip('housam', 160 + 30 * Math.sin(t * 2), 920, 34, t); kidShip('danny', W - 200 + 30 * Math.sin(t * 2.3), 920, 34, t, { flip: true });
    const score = INV_ORDER.filter(i => t > invHit(i)).length * 100;
    stArcade('SCORE ' + String(score).padStart(6, '0'), 40, 50, 46, '#FFFFFF', 'left'); stArcade('P1 + P2', W - 40, 50, 46, DM.p1, 'right');
    dmSlam('BROCCOLI INCOMING!', W / 2, H * .55, 110, '#5BC24A', t, S_INV + 2.0, 1.6, { shake: 10 });
  }
  function shields(t) {
    const lt = t - S_SHIELD;
    spaceBG(t, { vx: -90, streak: 0 });
    const ax = 760, ay = 760;
    for (let j = 0; j < 14; j++) {                                               // broccoli rain; it bounces off the rainbow
      const tb = S_SHIELD + j * .4, u = seg(t, tb, tb + 1.2); if (u <= 0 || u >= 1) continue;
      const x0 = 520 + (j * 97) % 520, hitU = .55, y = u < hitU ? lerp(-60, ay - 260, u / hitU) : ay - 260 - 500 * (u - hitU) + 900 * (u - hitU) ** 2, x = u < hitU ? x0 : x0 + (x0 < ax ? -1 : 1) * 700 * (u - hitU);
      dmBroccoli(x, y, 26, u * 8); if (Math.abs(u - hitU) < .04) dmPop('BOING!', x, y - 30, 40, '#FFFFFF', t, tb + hitU * 1.2, .6);
    }
    const sk = on(t, S_SHIELD + .3, S_SHIELD + 6, .3);                          // Alma's rainbow shield
    ['#FF6B6B', '#FFB347', '#FFE66D', '#6BD68A', '#5AB4F0', '#B678E0'].forEach((c, i) => { X.save(); X.globalAlpha = .75 * sk; X.beginPath(); X.arc(ax, ay, (300 - i * 18) * sk * (1 + .03 * pulse(t)), Math.PI * 1.05, Math.PI * 1.95); X.lineWidth = 18; X.strokeStyle = c; X.stroke(); X.restore(); });
    kidShip('alma', ax, ay, 56, t, { pose: { eyes: 'star', power: 1 } });
    dmSlam('RAINBOW SHIELD!', ax, 160, 90, '#FFB3E6', t, S_SHIELD + .5, 1.8);
    // Jenna's barrel roll
    const roll = ease(seg(lt, 2.0, 3.2)), jx = lerp(-200, W + 200, seg(lt, 1.4, 4.0)), jy = 380 + 120 * Math.sin(roll * TAU);
    X.save(); X.translate(jx, jy); X.scale(1, Math.cos(roll * TAU)); kidShip('jenna', 0, 0, 46, t); X.restore();
    dmSlam('BARREL ROLL!', 1400, 260, 80, '#F08AC0', t, S_SHIELD + 2.2, 1.6, { rot: .06 });
    // Danny drops a block on a robot
    const rx = 1500, ry = 900, crushed = lt > 4.6;
    if (lt > 3.4) rig('robo', rx, ry, 4.2, { eyes: crushed ? 'x' : 'open', red: crushed ? 0 : 1, mouth: crushed ? 'O' : 'teeth', sq: crushed ? -.45 : 0, hum: false, handL: [-6, -18], handR: [6, -18], handPoseL: 'claw', handPoseR: 'claw' });
    const dx = lerp(W + 200, 1300, ease(seg(lt, 3.4, 4.2))) - 600 * seg(lt, 4.8, 6); kidShip('danny', dx, 300, 46, t, { flip: true });
    if (lt > 4.0) { const u = easeIn(seg(lt, 4.1, 4.6)), by = lerp(330, ry - 70 - 90 * .55, u); dmBlock(rx - 45, by - (crushed ? 0 : 0), 90, 'grass'); }
    if (crushed) { dmSlam('CRUNCH!', rx, ry - 260, 90, '#FFE066', t, S_SHIELD + 4.6, 1.2); }
  }
  function mothership(t) {
    const lt = t - S_BOSS1, dead = S_BOSS1 + 3.8, hpSteps = Math.min(10, Math.max(0, beatN(t, S_BOSS1 + 1))), hp = t > dead ? 0 : 1 - hpSteps * .085;
    spaceBG(t, { vx: -40, streak: 0 });
    rvtSunburst(1300, 420, t, 'rgba(0,0,0,0)', rgba('#FF3A3A', .08 * (t < dead ? 1 : 0)), 16, .1);
    const bx = 1300 + 40 * Math.sin(t * .9), by = 940 + 20 * Math.sin(t * 1.7), boom = seg(t, dead, dead + 1.2);
    if (boom < .5) { const R = rig('robo', bx, by, 26, { eyes: t > dead ? 'x' : 'open', red: t > dead ? 0 : 1, scan: .5 * (t < dead), mouth: t > dead ? 'O' : 'teeth', brows: 'angry', hover: 1, glitch: t > dead ? 1 : 0, hum: false,
        handL: [-7, -22 + 2 * Math.sin(t * 3)], handR: [7, -22 - 2 * Math.sin(t * 3)], handPoseL: 'claw', handPoseR: 'claw', hatch: .3, jump: 0, sq: -.04 * Math.sin(t * 2) });
      // the fleet's shots, one per beat
      for (let i = 0; i < 10; i++) { const ts = S_BOSS1 + 1 + i * B, u = seg(t, ts - .4, ts); if (u <= 0 || u >= 1) continue; dmFormula(lerp(380, R.chest[0] + (hash(i) - .5) * 200, u), lerp(400 + (i % 3) * 200, R.chest[1] + (hash(i * 3) - .5) * 200, u), 50, FORMULAS[i % FORMULAS.length], t); }
      for (let i = 0; i < 10; i++) { const ts = S_BOSS1 + 1 + i * B; dmPop('-8%', R.chest[0] + (hash(i) - .5) * 260, R.chest[1] - 160, 44, DM.red, t, ts, .7); }
      if (t < dead) dmSlam('EAT. YOUR. BROCCOLI.', W / 2, 880, 70, DM.red, t, S_BOSS1 + .3, 1.8);
    }
    for (let i = 0; i < 14; i++) { const u = seg(t, dead, dead + 2.4), a = i / 14 * TAU; if (u <= 0 || u >= 1) continue; dmBroccoli(bx + Math.cos(a) * 900 * easeOut(u), by - 400 + Math.sin(a) * 600 * easeOut(u) + 500 * u * u, 30, u * 9 + i); }
    dmBoom(bx, by - 420, 420, seg(t, dead, dead + 1.2));
    // the fleet on the left; Housam volleys a ball into the boss's chest
    dmShip(330 + 20 * Math.sin(t * 2), 620, 64, DM.p1, t, { pilots: twinPilots({ safadi: { brows: 'focused', eyes: 'open' } }) });
    kidShip('alma', 200, 360, 34, t); kidShip('jenna', 170, 860, 34, t); kidShip('danny', 520, 920, 34, t);
    const vol = S_BOSS1 + 3.2; kidShip('housam', 560 + 120 * ease(seg(lt, 2.2, 3.0)), 300, 40, t, { pose: lt > 2.6 ? { eyes: 'squeeze', mouth: 'O' } : {} });
    if (inW(t, vol - .2, dead)) { const u = seg(t, vol, dead); housamBall(lerp(720, bx, u), lerp(260, by - 430, u) - 120 * Math.sin(Math.PI * u), 6 * (1 + u), { spin: t * 12 }); }
    dmSlam('VOLLEY!', 720, 200, 70, DM.kids.housam, t, vol, 1);
    dmBar(W / 2 - 500, 50, 1000, 34, hp, DM.red, 'BOSS: ROBO-SAFADI MK-II');
    if (t > dead) { dmSlam('KA-BOOM!', bx - 200, 420, 150, '#FFE066', t, dead, 1.2, { shake: 20 }); dmSlam('LEVEL CLEAR!', W / 2, H * .45, 170, DM.mint, t, dead + .5, 2.4); dmPop('1 UP', W / 2, H * .65, 70, DM.gold, t, dead + 1.4, 1.2); }
    flash(.8 * kick(t, dead, 6));
  }
  function warp(t, t0, label, bg) {                                              // a warp pipe swallows the fleet, then a pixel wipe
    const lt = t - t0;
    bg(t);
    const px = W / 2, rise = backOut(seg(lt, 0, .6)), top = H - 420 * rise;
    shape(rectPts(px - 150, top + 70, 300, H), { fill: '#3BB04A', stroke: DM.ink, lwPx: 8 });
    shape(rectPts(px - 190, top, 380, 90), { fill: '#4CCB5C', stroke: DM.ink, lwPx: 8, smooth: .05 });
    line([[px - 100, top + 100], [px - 100, H]], { stroke: rgba('#FFFFFF', .35), lwPx: 18 });
    for (let i = 0; i < 5; i++) { const u = seg(lt, .6 + i * B, 1.1 + i * B), who = ['twins', ...KIDS][i]; if (u >= 1) continue;
      const x = lerp(i % 2 ? 200 : W - 200, px, ease(u)), y = lerp(300 + i * 60, top + 40, easeIn(u)) - 200 * Math.sin(Math.PI * u), s = (who === 'twins' ? 50 : 34) * (1 - .6 * u);
      X.save(); X.beginPath(); X.rect(0, 0, W, top + 20); X.clip();
      if (who === 'twins') dmShip(x, y, s, DM.p1, t, { tilt: 1.2 * u, pilots: twinPilots() }); else kidShip(who, x, y, s, t, { tilt: 1.2 * u, flip: i % 2 === 0 });
      X.restore(); dmPop('WHOOP!', px, top - 40, 40, '#FFFFFF', t, t0 + 1.1 + i * B, .5); }
    if (lt > 3.2) stArcade(label, W / 2, H * .3, 140 * backOut(seg(lt, 3.2, 3.5)), DM.gold);
    dmPixelWipe(seg(lt, 2.8, 3.2) + seg(lt, 3.2, 3.9), '#05040A');
  }
  const warp1 = t => warp(t, S_WARP1, 'WORLD 2', tt => spaceBG(tt, { vx: -60, streak: 0 }));

  // =====================================================================================================
  // ---------- World 2: World Champion ----------
  const GROUND = 880, PS = 11;                                                     // the pitch line; px per local unit on the pitch
  const card2 = t => card(t, S_W2, 2, 'WORLD CHAMPION', 'IMPORTANCE OF SPORT:', '#FFE066', tt => dmStadium(tt, { cx: tt * 40 }), (tt, lt) => {
    for (let i = 0; i < 5; i++) { const k = backOut(seg(lt, 2.2 + i * B * .6, 2.5 + i * B * .6)); if (k > 0) { X.save(); X.translate(W / 2 + 470 + i * 70, H * .63); X.scale(k, k); shape(starPts(0, 0, 32, .45, 5), { fill: DM.gold, stroke: DM.ink, lwPx: 4 }); X.restore(); } } });
  const robo = (x, o = {}) => rig('robo', x, GROUND, 9.4, { eyes: 'open', mouth: 'grin', hum: false, handL: [-6, -14], handR: [6, -14], ...o });
  const scoreHUD = (t, us, them) => { shape(rectPts(30, 24, 560, 74), { fill: rgba('#0B0B14', .78), stroke: '#FFFFFF', lwPx: 3, smooth: .1 });
    stArcade(`DREAM TEAM ${us} - ${them} ROBO FC`, 310, 62, 36, '#FFFFFF'); stArcade(`${String(80 + Math.floor((t - S_KICK) * .6)).padStart(2, '0')}:00`, W - 110, 62, 44, DM.gold); };
  function fester(x, t, o = {}) { return rig('jester', x, GROUND, JF_UNIT * 1.75, { referee: true, ...o }); }
  function pearlStands(t, k = 0) {                                               // Pearl in the front row with her 10 card
    const P0 = [1640, 520], A = rig('pearl', P0[0], P0[1], 8, { sit: 1, eyes: k > .5 ? 'happy' : 'bored', mouth: k > .5 ? 'open' : 'flat', point: k, pointAng: -1.2, crownTilt: .05 * Math.sin(t * 2) });
    if (k > 0) { const x = A.flipper[0], y = A.flipper[1] - 80 * k; shape(rectPts(x - 50, y - 70, 100, 80), { fill: '#FFFFFF', stroke: DM.ink, lwPx: 4 }); stArcade('10', x, y - 30, 60, '#E8572E'); }
  }
  function kickoff(t) {
    const lt = t - S_KICK, cx = 300 * ease(seg(lt, 1.5, 7.5));
    dmStadium(t, { cx, cheer: .3 });
    pearlStands(t, 0);
    const samiX = lerp(200, 1450, ease(seg(lt, 1.2, 7.4))) - cx * .2;
    // two Robo FC defenders get turned inside out by the doctor's step-overs
    for (const [i, rx] of [[0, 780], [1, 1180]]) { const pass = seg(samiX, rx - 140, rx + 80), sp = TAU * ease(pass);
      robo(rx - cx * .2, { eyes: pass > .2 ? 'x' : 'open', mouth: pass > .2 ? 'O' : 'grin', tilt: .2 * Math.sin(sp * 2), jump: .6 * Math.sin(Math.PI * pass), rot: .4 * Math.sin(sp) });
      dmPop('SKILL MOVE!', rx - cx * .2, 380, 48, DM.mint, t, S_KICK + 1.2 + (i ? 4.1 : 2.4), .9); }
    const kick = Math.max(0, Math.sin(lt * 9)), st = Math.sin(lt * Math.PI * 4);
    const SA = rig('sami', samiX, GROUND, PS, { ...samiWalk(samiX / 50, 1), turn: .3, lookX: .5, lookY: .3, brows: 'focused', mouth: 'grin', footR: [2.6 + 2 * st, -.8 * kick], power: .2 });
    housamBall(samiX + 70 + 30 * st, GROUND - 26 - 16 * Math.abs(Math.sin(lt * 6)), 10, { spin: lt * 10 });
    const F = fester(960 - cx * .4, t, { handR: lt < 1.2 ? [1.6, -21] : [5, -18], handPoseR: 'fist', eyes: lt < 1.2 ? 'squeeze' : 'open', mouth: lt < 1.2 ? 'o' : 'grin', lookX: .6 });
    if (lt < 1.4) { circle(F.head[0] + 10, F.head[1] + 50, 12, { fill: '#C0C0C8', stroke: DM.ink, lwPx: 3 }); dmSlam('TWEET!', F.head[0] + 160, F.head[1] - 80, 70, '#FFFFFF', t, S_KICK + .3, 1.1); }
    const mk = SA.top[1] - 30 + 6 * Math.sin(t * 6); shape([[samiX - 18, mk - 26], [samiX + 18, mk - 26], [samiX, mk]], { fill: DM.p2, stroke: '#0B0B14', lwPx: 3 }); stArcade('P2', samiX, mk - 50, 36, DM.p2);
    scoreHUD(t, 0, 0);
    dmSlam('KICK OFF!', W / 2, H * .3, 120, '#FFFFFF', t, S_KICK + .4, 1.4);
  }
  // the pass chain: a pass on every other beat, each player's own flourish
  const PASSERS = [['sami', 200], ['danny', 560], ['jenna', 920], ['alma', 1280], ['housam', 1640]];
  const PASS_T = i => S_PASS + .8 + i * 1.4;
  function passes(t) {
    const lt = t - S_PASS;
    dmStadium(t, { cx: 600 + lt * 20, cheer: .3 + .1 * PASSERS.filter((_, i) => t > PASS_T(i)).length });
    // the coach on the sideline: the professor with his chalkboard of passes
    const C = rig('safadi', 150, GROUND - 260, 6.5, { handR: [5.4, -14], handPoseR: 'palm', eyes: 'happy', mouth: 'grin', brows: 'up', power: .4 });
    safadiBoard(C.handR[0] + 150, C.head[1] - 20, 220, seg(lt, .3, 2), t, { kind: 'passing' });
    stArcade('COACH', 150, GROUND - 160, 30, DM.p1);
    for (let i = 0; i < PASSERS.length; i++) {
      const [who, x] = PASSERS[i], got = PASS_T(i - 1), sent = PASS_T(i), has = t > got && t < sent;
      let o = { eyes: has ? 'open' : 'happy', mouth: 'grin', brows: 'up', lookX: .4, handL: [-4, -11], handR: [4, -11] };
      if (who === 'jenna') { const r = seg(t, sent - .9, sent - .1); if (r > 0 && r < 1) o = { ...o, rot: TAU * ease(r), jump: 3 * Math.sin(Math.PI * r), handL: [-5, -24], handR: [5, -24] }; }
      if (has) o.jump = .4 * hop(t);
      if (Math.abs(t - sent) < .25) o = { ...o, footR: [3.5, -5], lean: -.05, eyes: 'squeeze', mouth: 'O' };
      rig(who, x, GROUND, PS * (who === 'sami' ? 1 : 1.15), o);
      if (i > 0) dmPop(`COMBO x${i + 1}`, x, 330, 52, DM.gold, t, got, 1.1);
    }
    // the ball: on someone's foot, or flying between them
    let bx = PASSERS[0][1] + 60, by = GROUND - 26;
    for (let i = 0; i < PASSERS.length - 1; i++) { const u = seg(t, PASS_T(i), PASS_T(i) + .7);
      if (t > PASS_T(i)) { bx = lerp(PASSERS[i][1] + 60, PASSERS[i + 1][1] + (i === 1 ? 0 : 60), u); by = lerp(GROUND - 26, i === 1 ? GROUND - 420 : GROUND - 26, u) - 260 * Math.sin(Math.PI * u) * (i === 1 ? .4 : 1); } }
    if (t > PASS_T(4)) { const u = seg(t, PASS_T(4), PASS_T(4) + .6); bx = PASSERS[4][1] + 60; by = GROUND - 26 - 500 * Math.sin(Math.PI * u * .5); }
    housamBall(bx, by, 10, { spin: t * 10 });
    if (t > PASS_T(1) - .2 && t < PASS_T(2) + .4) dmSlam('HEADER!', 920, 260, 70, DM.kids.jenna, t, PASS_T(2) - .3, 1);
    scoreHUD(t, 0, 0);
  }
  function bicycle(t) {
    const lt = t - S_BIKE, KICK = S_BIKE + 1.5, BONK = S_BIKE + 3.4, GOAL = S_BIKE + 4.3;
    dmStadium(t, { cx: 1400, cheer: t > GOAL ? 1 : .4 });
    const gx = 1560;
    dmGoalFrame(gx, GROUND, 1.6);
    // Housam, upside-down in the air
    const air = seg(t, KICK - 1, KICK + 1.4), hy = 520 * Math.sin(Math.PI * air);
    rig('housam', 520, GROUND - hy, PS * 1.2, { rot: -Math.PI * ease(seg(t, KICK - 1, KICK + .2)) * (1 - ease(seg(t, KICK + .6, KICK + 1.4))), eyes: 'squeeze', mouth: 'O', brows: 'focused',
      footR: inW(t, KICK - .2, KICK + .3) ? [4, -20] : [2, -4], handL: [-6, -10], handR: [6, -10], handPoseL: 'open', handPoseR: 'open' });
    // the robot keeper dives the wrong way; Fester stands by the post
    const dive = ease(seg(t, KICK + .6, KICK + 1.4)); robo(gx + 60 - 160 * dive, { rot: -1.2 * dive, jump: 3 * Math.sin(Math.PI * dive), eyes: 'wide', mouth: 'O', handL: [-7, -24], handR: [7, -24] });
    const fx = 1220, bonked = t > BONK;
    const F = fester(fx, t, { eyes: bonked ? 'swirl' : 'open', mouth: bonked ? 'wobble' : 'smile', stars: bonked ? 1 : 0, lookX: -.3, lookY: -.3,
      ...(t > GOAL + 1.2 ? { handL: [-6, -13], handR: [6, -13], handPoseL: 'open', handPoseR: 'open', eyes: 'squeeze', mouth: 'grin', brows: 'worried', lookX: 0, lookY: 0, stars: .6 } : {}) });
    // the ball: kick → Fester's head → the net
    let bx, by;
    if (t < KICK) { bx = 560; by = GROUND - hy - 200; }
    else if (t < BONK) { const u = seg(t, KICK, BONK); bx = lerp(600, F.hatBase[0], u); by = lerp(GROUND - 640, F.hatBase[1] - 20, u) - 180 * Math.sin(Math.PI * u); }
    else { const u = seg(t, BONK, GOAL); bx = lerp(F.hatBase[0], gx + 90, u); by = lerp(F.hatBase[1] - 20, GROUND - 120, u) - 260 * Math.sin(Math.PI * u); }
    for (let i = 1; i < 6; i++) circle(bx - (t > KICK ? i * 24 : 0), by + i * 4, 18 - i * 2, { fill: rgba('#FFFFFF', .3 - i * .05), stroke: null });
    housamBall(bx, by, 10, { spin: t * 14 });
    dmGoalFrame(gx, GROUND, 1.6, true);
    dmLetterbox(on(t, S_BIKE, BONK + .3, .4));
    if (t < BONK) stArcade('SLOW-MO', 160, 70, 40, '#FFFFFF', 'left');
    dmSlam('BONK!', F.hatBase[0], F.hatBase[1] - 140, 110, '#FFE066', t, BONK, 1.2, { shake: 12 });
    if (t > GOAL) { rvtConfetti(t, GOAL, 70); dmSlam('GOAL!!!', W / 2, H * .2, 220, frac(t * 4) < .5 ? '#FFE066' : '#FF7A3D', t, GOAL, 4, { shake: 8 }); }
    if (t > GOAL + 1.6) stArcade('...story of my life', F.head[0], F.top[1] - 60, 34, '#FFFFFF');
    scoreHUD(t, t > GOAL ? 1 : 0, 0);
    flash(.6 * kick(t, GOAL, 6));
  }
  function celebrate(t) {
    const lt = t - S_CELEB;
    dmStadium(t, { cx: 900 + lt * 30, cheer: 1 });
    pearlStands(t, ease(seg(lt, 1.6, 2.2)));
    const team = ['sami', 'danny', 'jenna', 'housam', 'alma', 'safadi'];
    team.forEach((who, i) => { const slide = easeOut(seg(lt, .2 + i * .25, 1.4 + i * .25)), x = lerp(-200, 260 + i * 260, slide);
      rig(who, x, GROUND - (slide < 1 ? 0 : 0), PS * (who === 'safadi' || who === 'sami' ? 1 : 1.15), slide < 1 ? { lean: -.12, handL: [-6, -18], handR: [6, -18], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', dy: 2 }
        : cheerPose(t, i)); });
    rvtConfetti(t, S_CELEB - 2, 80);
    scoreHUD(t, 1, 0);
    dmSlam('DREAM TEAM WINS!', W / 2, H * .3, 140, DM.gold, t, S_CELEB + 2.4, 3.4);
    dmPop('IMPORTANCE OF SPORT ★★★★★', W / 2, H * .44, 54, '#FFFFFF', t, S_CELEB + 3.6, 2.2);
  }
  function warp2(t) {                                                              // the ball pixelates into a grass block
    const lt = t - S_WARP2;
    dmStadium(t, { cx: 1100, cheer: .4 });
    X.fillStyle = rgba('#000', .3 * seg(lt, 0, 1)); X.fillRect(0, 0, W, H);
    const s = 10 + 26 * ease(seg(lt, 0, 1.2)), px = W / 2, py = H / 2 + 20 * Math.sin(t * 3), pix = seg(lt, 1.0, 2.2);
    if (pix < 1) { housamBall(px, py, s, { spin: lt * 6 }); const g = Math.floor(lerp(4, 70, pix)); if (pix > 0) for (let gx = -6; gx <= 6; gx++) for (let gy = -6; gy <= 6; gy++) { const x = px + gx * g, y = py + gy * g; if (Math.hypot(gx * g, gy * g) > 26 * s) continue;
      X.fillStyle = (gx + gy) % 2 ? rgba('#FFFFFF', pix) : rgba('#2A2A30', pix * .8); X.fillRect(x - g / 2, y - g / 2, g, g); } }
    else dmBlock(px - 200, py - 200, 400, 'grass', { k: backOut(seg(lt, 2.2, 2.6)) * 1 });
    if (lt > 2.4) stArcade('WORLD 3', W / 2, H * .18, 120 * backOut(seg(lt, 2.4, 2.7)), DM.gold);
    dmPixelWipe(seg(lt, 3.3, 4) * 1, '#5BC24A');
  }

  // =====================================================================================================
  // ---------- World 3: Craft Blocks ----------
  const BK = 96;
  const card3 = t => card(t, S_W3, 3, 'CRAFT BLOCKS', '"WHO NEEDS BLOCKS AND CUBES?"', '#5BC24A', tt => dmBlockWorld(tt, BK), (tt, lt) => {
    const k = seg(lt, 2.8, 3.1); if (k > 0) line([[W / 2 - 520, H * .63 + 10], [W / 2 - 520 + 1040 * k, H * .63 - 10]], { stroke: DM.red, lwPx: 14 });
    dmSlam('WE DO!', W / 2 + 380, H * .78, 120, DM.gold, tt, S_W3 + 3.3, 1.0, { rot: -.1 }); });
  // the castle: 18 blocks, one per beat
  const CASTLE = [[0, 0, 'stone'], [1, 0, 'stone'], [2, 0, 'stone'], [3, 0, 'stone'], [4, 0, 'stone'], [0, 1, 'stone'], [2, 1, 'wood'], [4, 1, 'stone'], [0, 2, 'stone'], [1, 2, 'stone'], [2, 2, 'stone'], [3, 2, 'stone'], [4, 2, 'stone'],
    [0, 3, 'pink'], [2, 3, 'pink'], [4, 3, 'pink'], [2, 4, 'gold'], [1, 1, 'glass']];
  const CX0 = 1060;
  const castleBlocks = (t, gy, t0, o = {}) => CASTLE.forEach(([cx, cy, kind], i) => { const tb = t0 + i * B; if (t < tb) return; dmBlock(CX0 + cx * BK + (o.dx || 0), gy - (cy + 1) * BK + (o.dy ? o.dy(cx, cy) : 0), BK, kind, { k: seg(t, tb, tb + .25) }); });
  function build(t) {
    const lt = t - S_BUILD, gy = dmBlockWorld(t, BK, { ox: lt * 10 });
    castleBlocks(t, gy, S_BUILD + .4);
    const placing = beatN(t, S_BUILD + .4) % 2;
    // Danny the builder, swinging a pickaxe on the beat
    const D = rig('danny', 820, gy, 13, { handR: placing ? [5.5, -20] : [6, -12], handPoseR: 'fist', handL: [-4, -10], eyes: 'happy', mouth: 'grin', brows: 'focused', lookX: .6, jump: .3 * hop(t) });
    line([[D.handR[0], D.handR[1]], [D.handR[0] + 70, D.handR[1] + (placing ? -60 : 30)]], { stroke: '#8A5A35', lwPx: 10 });
    shape([[D.handR[0] + 40, D.handR[1] + (placing ? -90 : 0)], [D.handR[0] + 110, D.handR[1] + (placing ? -30 : 60)]], { fill: null, stroke: '#A8A8B0', lwPx: 16, closed: false });
    dmPop('BUILDER MODE', 820, 300, 50, DM.kids.danny, t, S_BUILD + .6, 1.6);
    // the girls and Sami cheer by the castle; Dragon flies a block in
    rig('alma', 1620, gy, 13, { ...almaDance(t, 'bounce', { bpm: 120 }), eyes: 'happy' });
    rig('jenna', 1790, gy, 12, { ...jennaDance(t, 'bounce', { bpm: 120 }) });
    const dk = seg(lt, 1.0, 5.0), dxp = lerp(-300, CX0 + 2 * BK + 48, ease(dk)), dyp = lerp(160, 260, dk);
    if (dk < 1) { const Dg = rig('dragon', dxp, dyp, 9, { ...dragonFlight(t), fly: 1, wings: 1, mouth: 'grin' }); dmBlock(Dg.pawL[0] - 40, Dg.pawL[1], 80, 'gold'); }
    dmPop('SPECIAL DELIVERY!', 600, 160, 48, '#FFE066', t, S_BUILD + 2.2, 1.6);
    // the professor places a block… on his own head
    const SF = rig('safadi', 300, gy, 12, { handL: [-4, -27], handR: [4, -27], handPoseL: 'open', handPoseR: 'open', eyes: lt > 6.2 ? 'squeeze' : 'happy', mouth: lt > 6.2 ? 'wobble' : 'grin', brows: lt > 6.2 ? 'worried' : 'up', lookY: -.4 });
    const hb = ease(seg(lt, 5.0, 6.0)), bxp = SF.top[0] - 55, byp = lerp(SF.top[1] - 250, SF.top[1] - 108, hb);
    dmBlock(bxp, byp, 110, 'wood');
    dmSlam('BLOCK HEAD!', 300, SF.top[1] - 230, 70, '#FFE066', t, S_BUILD + 6.1, 1.6);
    rig('sami', 520, gy, 12, { eyes: lt > 6.2 ? 'happy' : 'open', mouth: lt > 6.2 ? 'O' : 'smile', handL: [-1, -19], handR: [1, -19], lookX: -.6, jump: lt > 6.2 ? .5 * hop(t) : 0 });
  }
  function creeper(t) {
    const lt = t - S_CREEP, BOOM = S_CREEP + 4.3, gy = dmBlockWorld(t, BK, { ox: 80 });
    castleBlocks(t, gy, -100, { dx: 200 });
    // the creeper sneaks in on the beats
    const step = Math.min(8, beatN(t, S_CREEP)), cx = 1700 - step * 80 - 30 * ease(frac((t - S_CREEP) / B)) * (step < 8), swell = seg(t, BOOM - .9, BOOM);
    if (t < BOOM) { dmCreeper(cx, gy, BK * 1.2, t, { swell }); stArcade('sssss...', cx, gy - BK * 3.6 - 20 * Math.sin(t * 6), 50 + 30 * swell, '#5BC24A'); }
    const SF = rig('safadi', 640, gy, 12, { eyes: t > BOOM ? 'squeeze' : lt > 3.6 ? 'wide' : 'happy', mouth: t > BOOM ? 'O' : lt > 3.6 ? 'O' : 'grin', brows: lt > 3.6 ? 'up' : 'normal',
      lookX: lt > 3.6 ? .9 : -.4, jump: kick(t, BOOM, 4) * 3, rot: .3 * kick(t, BOOM, 3), handL: [-4, -14], handR: [4, -14] });
    dmBlock(SF.top[0] - 55, SF.top[1] - 108 - (t > BOOM ? 300 * seg(t, BOOM, BOOM + 1) : 0), 110, 'wood');
    if (lt < 3.6) dmPop('NICE CASTLE...', 640, SF.top[1] - 160, 44, '#FFFFFF', t, S_CREEP + .6, 2.4);
    dmBoom(cx, gy - BK * 1.5, 380, seg(t, BOOM, BOOM + 1));
    dmSlam('BROCCOLI BOOM!', W / 2, H * .3, 140, '#5BC24A', t, BOOM + .1, 2.4, { shake: 14 });
    flash(.7 * kick(t, BOOM, 7));
    // florets fly; the doctor catches them and munches: +1 HEALTH
    const samiX = 1100, catchT = i => BOOM + 1.2 + i * B;
    for (let i = 0; i < 16; i++) { const u = seg(t, BOOM, BOOM + 2.2), a = -Math.PI * (.15 + .7 * hash(i * 3)), d = 300 + 600 * hash(i);
      if (u <= 0 || u >= 1) continue; if (i < 3 && t > catchT(i) - .2) continue;
      dmBroccoli(cx + Math.cos(a) * d * u, gy - BK * 1.5 + Math.sin(a) * d * u * 1.5 + 900 * u * u, 26, u * 8 + i); }
    const munch = t > BOOM + 1 && Math.floor(t * 8) % 2;
    const SM = rig('sami', samiX, gy, 12, { eyes: t > BOOM + 1 ? 'happy' : 'wide', mouth: t > BOOM + 1 ? (munch ? 'O' : 'grin') : 'o', handR: t > BOOM + 1 ? [1.5, -18] : [5, -20], handPoseR: 'fist', handL: [-5, -20], handPoseL: 'open', jump: .3 * hop(t) });
    for (let i = 0; i < 3; i++) { if (t > catchT(i) && t < catchT(i) + .3) dmBroccoli(SM.mouth[0], SM.mouth[1], 22, 0);
      dmPop('+1 HEALTH', SM.head[0] + 120, SM.top[1] - 40, 46, '#FF6B9A', t, catchT(i), .9);
      if (t > catchT(i)) { const hu = seg(t, catchT(i), catchT(i) + 1); if (hu < 1) shape(starPts(SM.head[0] - 100 + i * 80, SM.top[1] - 60 - 120 * hu, 22, .9, 2, 0), { fill: rgba('#FF6B9A', 1 - hu), stroke: null }); } }
    for (const [who, x] of [['housam', 240], ['alma', 400]]) rig(who, x, gy, 13, { eyes: t > BOOM ? 'wide' : 'open', mouth: t > BOOM ? 'O' : 'smile', handL: [-5, -18], handR: [5, -18], jump: kick(t, BOOM, 4) * 1.5, lookX: .7 });
  }
  function cube(t) {
    const lt = t - S_CUBE, SOLVED = S_CUBE + 4.3, gy = dmBlockWorld(t, BK, { ox: 160, sky0: '#5AB0FF' });
    const steps = Math.min(8, beatN(t, S_CUBE)), k = t > SOLVED ? 1 : steps / 8 * .85, twist = kick(t, S_CUBE + steps * B, 10);
    const unfold = ease(seg(t, SOLVED + .8, SOLVED + 2.2));
    if (unfold < 1) { X.save(); X.translate(W * .56, gy - 330); X.rotate(.03 * twist * (steps % 2 ? 1 : -1)); X.scale(1 - unfold * .9, 1 - unfold * .9); dmCube(0, 0, 330, t, k, { seed: steps }); X.restore(); }
    if (t > SOLVED && t < SOLVED + 1.5) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t; shape(starPts(W * .56 + Math.cos(a) * 420, gy - 330 + Math.sin(a) * 360, 26, .4, 4, t * 3), { fill: '#FFFFFF', stroke: null }); }
    // the rainbow staircase
    const RB = ['red', 'orange', 'yellow', 'green', 'blue', 'pink'];
    for (let i = 0; i < 6; i++) { const ks = seg(t, SOLVED + 1.2 + i * B * .5, SOLVED + 1.5 + i * B * .5); for (let j = 0; j <= i; j++) dmBlock(760 + i * BK * 1.4, gy - (j + 1) * BK * 1.3, BK * 1.3, RB[i], { k: ks }); }
    dmSlam('MINE-D BLOWN!', W / 2, H * .2, 130, DM.gold, t, SOLVED + .1, 2.6);
    // Danny twists it from the ground; then everybody climbs the stairs
    const climbing = t > SOLVED + 2.4;
    const order = ['danny', 'housam', 'alma', 'jenna', 'sami', 'safadi'];
    order.forEach((who, i) => {
      if (!climbing) { if (i > 2) return; const x = [380, 200, 560][i]; rig(who, x, gy, 13, who === 'danny' ? { handL: [-6, -24 + 4 * (steps % 2)], handR: [6, -20 - 4 * (steps % 2)], handPoseL: 'open', handPoseR: 'open', eyes: t > SOLVED ? 'happy' : 'open', brows: 'focused', mouth: 'grin', lookX: .8, lookY: -.4, jump: t > SOLVED ? .8 * hop(t) : 0 }
        : { eyes: t > SOLVED ? 'happy' : 'wide', mouth: 'O', lookX: .7, lookY: -.4, ...(t > SOLVED ? cheerPose(t, i) : {}) }); return; }
      const u = clamp((t - SOLVED - 2.4) / 2.6 - i * .12), stepI = Math.min(5, Math.floor(u * 6)), x = 700 + stepI * BK * 1.4 + 60 + (who === 'safadi' || who === 'sami' ? 0 : 0), y = gy - (stepI + 1) * BK * 1.3;
      if (u <= 0) { rig(who, 420 - i * 60, gy, 12, { eyes: 'happy', mouth: 'grin', jump: .4 * hop(t, 1) }); return; }
      rig(who, x, y + 10, 12, { eyes: 'happy', mouth: 'O', jump: 1.2 * hop(t * 1.5 + i * .1), handL: [-5, -18], handR: [5, -18] });
    });
  }
  function blockParty(t) {
    const lt = t - S_PARTY, CRUMBLE = S_PARTY + 4.4;
    dmBG('#140A30', '#2A1060'); dmStars(t, 120, -20, 0);
    if (t < CRUMBLE + 1.6) rvtSunburst(W / 2, H * .5, t, 'rgba(0,0,0,0)', rgba(['#FF4FD8', '#4FF0FF', '#FFD84A'][beatN(t, S_PARTY) % 3], .18 * (1 - seg(t, CRUMBLE, CRUMBLE + 1.6))), 16, .3);
    const gy = H - 2 * BK, fall = (cx, cy) => { const d = CRUMBLE + (cx * .07 + (4 - cy) * .05) + hash(cx * 9 + cy) * .3; return t < d ? 0 : 1600 * (t - d) ** 2; };
    // a colourful dance floor of blocks pulsing on the beat
    const PALS = ['pink', 'blue', 'yellow', 'green', 'orange', 'red'];
    for (let i = 0; i < 21; i++) for (let j = 0; j < 2; j++) { const kind = PALS[(i + j + beatN(t, S_PARTY)) % 6]; const d = CRUMBLE + i * .06 + j * .1; dmBlock(i * BK - 24, gy + j * BK + (t < d ? 0 : 1600 * (t - d) ** 2), BK, kind); }
    // the castle stage
    CASTLE.forEach(([cx, cy, kind]) => dmBlock(760 + cx * BK, gy - (cy + 1) * BK + fall(cx, cy), BK, kind));
    const dancers = [['danny', 860, 'bounce'], ['housam', 1000, 'bounce'], ['alma', 960, 'disco'], ['jenna', 1110, 'twirl'], ['safadi', 1220, 'bounce'], ['sami', 760, 'bounce']];
    const topY = gy - 3 * BK;
    dancers.forEach(([who, x, mv], i) => { const yy = (who === 'alma' || who === 'jenna' ? topY - 2 * BK : topY) + (t > CRUMBLE + .4 ? 380 * (t - CRUMBLE - .4) ** 2 : 0);
      const pose = who === 'alma' ? { ...almaDance(t, mv, { bpm: 120 }), power: 1, eyes: 'star' } : who === 'jenna' ? jennaDance(t, mv, { bpm: 120 })
        : { handL: [-5, -18 + 4 * Math.sin(t * Math.PI * 2 + i)], handR: [5, -18 - 4 * Math.sin(t * Math.PI * 2 + i)], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', jump: .9 * hop(t + i * .05), tilt: .1 * Math.sin(t * Math.PI) };
      if (t > CRUMBLE + .4) Object.assign(pose, { eyes: 'wide', mouth: 'O', handL: [-6, -24], handR: [6, -24], rot: .4 * Math.sin(i) * seg(t, CRUMBLE + .4, CRUMBLE + 2) });
      rig(who, x + (i - 2.5) * 30, yy, who === 'safadi' || who === 'sami' ? 9 : 10, pose); });
    dmSlam('BLOCK PARTY!', W / 2, H * .18, 150, '#FF4FD8', t, S_PARTY + .3, 3.6);
    dmSlam('UH-OH...', W / 2, H * .18, 120, '#FFFFFF', t, CRUMBLE + .1, 1.6, { shake: 10 });
    if (t > S_VS - 1.4) stArcade('WORLD 4', W / 2, H * .45, 160 * backOut(seg(t, S_VS - 1.4, S_VS - 1.1)), DM.gold);
    dmPixelWipe(seg(t, S_VS - .5, S_VS) * 1, '#0B0820');
  }

  // =====================================================================================================
  // ---------- World 4: Fight Planet ----------
  function vs(t) {
    const lt = t - S_VS, k = easeOut(seg(lt, 0, .5));
    X.fillStyle = '#0B0820'; X.fillRect(0, 0, W, H);
    X.save(); X.beginPath(); X.moveTo(0, 0); X.lineTo(W * .58, 0); X.lineTo(W * .42, H); X.lineTo(0, H); X.closePath(); X.clip();
    X.translate(-W * (1 - k), 0); rvtSunburst(W * .25, H * .55, t, '#C08A2E', '#FFD84A', 14, .2);
    X.save(); X.translate(W * .25, H * .58); dmChar('safadi', 0, 0, 260, { eyes: 'narrow', brows: 'angry', mouth: 'grin', ...fists }); X.restore();
    X.restore();
    X.save(); X.beginPath(); X.moveTo(W * .58, 0); X.lineTo(W, 0); X.lineTo(W, H); X.lineTo(W * .42, H); X.closePath(); X.clip();
    X.translate(W * (1 - k), 0); rvtSunburst(W * .75, H * .55, t, '#2E9A7A', '#5CF2B0', 14, -.2);
    X.save(); X.translate(W * .75, H * .58); dmChar('sami', 0, 0, 260, { eyes: 'narrow', brows: 'angry', mouth: 'grin', ...fists }); X.restore();
    X.restore();
    rvtLightning(W * .58, -20, W * .42, H + 20, Math.floor(t * 12), 10, '#FFFFFF', .9);
    stArcade('PROF. SAFADI', W * .22, H * .8, 80, DM.p1); stArcade('DR. SAMI', W * .78, H * .8, 80, DM.p2);
    dmSlam('VS', W / 2, H * .45, 260, DM.red, t, S_VS + .6, 3.4, { shake: 10 });
    dmSlam('BROTHER VS BROTHER', W / 2, H * .12, 90, '#FFFFFF', t, S_VS + .9, 1.0);
    for (const [who, x, y] of [['housam', 120, 140], ['danny', 300, 140], ['jenna', W - 300, 140], ['alma', W - 120, 140]]) { const p = backOut(seg(lt, 2.4, 2.7)); if (p <= 0) continue;
      X.save(); X.translate(x, y); X.scale(p, p); circle(0, 0, 80, { fill: DM.kids[who], stroke: DM.ink, lwPx: 5 }); X.beginPath(); X.arc(0, 0, 76, 0, TAU); X.clip(); dmChar(who, 0, 6, 58, { eyes: 'happy', mouth: 'O' }); X.restore(); }
  }
  // the fighters: (x, side) with a fighting-stance bounce; o overrides
  const fightPose = (t, o = {}) => ({ ...fists, handR: [4.6, -19], lean: .06, dy: -.3 * hop(t * .5), brows: 'angry', eyes: 'narrow', mouth: 'grin', turn: .25, ...o });
  const FGY = 900, FS = 13;
  function sidelineKids(t, cheer = .5) {
    [['housam', 110, 'safadi'], ['danny', 250, 'safadi'], ['jenna', W - 250, 'sami'], ['alma', W - 110, 'sami']].forEach(([who, x], i) =>
      rig(who, x, FGY + 120, 9, cheer > .6 ? cheerPose(t, i) : { handL: [-5, -18], handR: [5, -18], handPoseL: 'fist', handPoseR: 'fist', eyes: 'happy', mouth: 'O', jump: .5 * hop(t + i * .1) }));
  }
  const hpAt = (t, who) => { let hp = 1; for (const [tt, w, d] of HITS) if (t > tt && w === who) hp -= d; return Math.max(0, hp); };
  const HITS = [[S_COMBO + 2.0, 'sami', .25], [S_COMBO + 4.0, 'safadi', .25], [S_COMBO + 5.5, 'sami', .12], [S_COMBO + 6.0, 'safadi', .12], [S_COMBO + 6.5, 'sami', .12], [S_COMBO + 7.0, 'safadi', .12],
    [S_KO + 2.5, 'sami', .51], [S_KO + 2.5, 'safadi', .51]];
  function fightHUD(t) { dmBar(80, 90, 780, 46, hpAt(t, 'safadi'), DM.p1, 'PROF. SAFADI'); dmBar(W - 860, 90, 780, 46, hpAt(t, 'sami'), DM.p2, 'DR. SAMI', true);
    stArcade(String(Math.max(0, 99 - Math.floor((t - S_ROUND) * 2))), W / 2, 112, 80, '#FFFFFF'); }
  function round1(t) {
    const lt = t - S_ROUND; dmArena(t, { ground: FGY });
    rig('safadi', 620, FGY, FS, fightPose(t, { turn: .3 })); rig('sami', 1300, FGY, FS, fightPose(t + .2, { turn: -.3 }));
    sidelineKids(t, .4); fightHUD(t);
    dmSlam('ROUND 1', W / 2, H * .4, 200, '#FFFFFF', t, S_ROUND + .45, .9);
    dmSlam('FIGHT!', W / 2, H * .42, 280, DM.red, t, S_ROUND + 1.4, .9, { shake: 16 });
  }
  function combos(t) {
    const lt = t - S_COMBO; dmArena(t, { ground: FGY });
    const hit = who => HITS.filter(([tt, w]) => w === who && tt < S_KO).map(([tt]) => kick(t, tt, 6)).reduce((a, b) => a + b, 0);
    const SF = rig('safadi', 600 - 50 * hit('safadi'), FGY, FS, fightPose(t, { power: on(t, S_COMBO, S_COMBO + 2.2), eyes: lt < 2.2 ? 'glow' : hit('safadi') > .3 ? 'squeeze' : 'narrow', lean: -.15 * hit('safadi'), ...(lt < 2.2 ? { handR: [7, -17], handPoseR: 'palm' } : {}) }));
    const SM = rig('sami', 1320 + 50 * hit('sami'), FGY, FS, fightPose(t + .2, { turn: -.3, power: on(t, S_COMBO + 2.4, S_COMBO + 4.2), eyes: inW(lt, 2.4, 4.2) ? 'glow' : hit('sami') > .3 ? 'squeeze' : 'narrow', lean: .15 * hit('sami'), ...(inW(lt, 2.4, 4.2) ? { handL: [-7, -17], handPoseL: 'palm' } : {}) }));
    // the Explain-o-Beam: a chalkboard pops, then a formula beam
    safadiBoard(SF.head[0], SF.top[1] - 170, 260, seg(lt, 0, .8) * (1 - seg(lt, 2.3, 2.5)), t, { kind: 'graph' });
    const bk = on(t, S_COMBO + 1.4, S_COMBO + 2.3, .15); if (bk > 0) { X.save(); X.globalCompositeOperation = 'lighter'; line([SF.handR, [SM.chest[0], SM.chest[1]]], { stroke: rgba('#FFE066', .5 * bk), lwPx: 60 }); line([SF.handR, SM.chest], { stroke: rgba('#FFFFFF', bk), lwPx: 16 }); X.restore();
      for (let i = 0; i < 5; i++) stArcade(FORMULAS[i], lerp(SF.handR[0], SM.chest[0], frac(t * 2 + i / 5)), lerp(SF.handR[1], SM.chest[1], frac(t * 2 + i / 5)) - 30, 34, '#FFF4C8'); }
    dmSlam('EXPLAIN-O-BEAM!', 620, 300, 80, DM.p1, t, S_COMBO + .6, 1.6);
    // the Healthy-doken: an apple fireball
    const au = seg(t, S_COMBO + 3.2, S_COMBO + 4.0); if (au > 0 && au < 1) { const ax = lerp(SM.handL[0], SF.chest[0], au), ay = lerp(SM.handL[1], SF.chest[1], au);
      for (let i = 1; i < 6; i++) circle(ax + i * 26, ay + 4 * Math.sin(t * 30 + i), 40 - i * 6, { fill: rgba('#FF8A3A', .5 - i * .08), stroke: null });
      circle(ax, ay, 46, { fill: '#E8343A', stroke: DM.ink, lwPx: 5 }); shape([[ax, ay - 44], [ax + 26, ay - 70], [ax + 6, ay - 40]], { fill: '#5BC24A', stroke: DM.ink, lwPx: 3 }); }
    dmSlam('HEALTHY-DOKEN!', 1300, 300, 80, DM.p2, t, S_COMBO + 2.8, 1.6);
    for (const [tt, w] of HITS) if (tt < S_KO) { const R = w === 'sami' ? SM : SF; dmBoom(R.chest[0], R.chest[1], 110, seg(t, tt, tt + .5)); dmPop('HIT!', R.head[0], R.top[1] - 60, 54, '#FFFFFF', t, tt, .6); }
    // a rapid exchange of jabs
    dmSlam('COMBO x3!', W / 2, H * .3, 110, DM.gold, t, S_COMBO + 6.6, 1.2);
    sidelineKids(t, .8); fightHUD(t);
  }
  function doubleKO(t) {
    const lt = t - S_KO, MEET = S_KO + 1.2, KO = S_KO + 2.5, UP = S_KO + 3.8, HUG = S_KO + 4.4;
    dmArena(t, { ground: FGY });
    const down = ease(seg(t, KO, KO + .5)) * (1 - ease(seg(t, UP, UP + .5))), hugK = ease(seg(t, HUG, HUG + .8));
    const pose = (who, sd) => t < KO ? fightPose(t, { power: 1, eyes: 'glow', handL: [sd * -1 * 7, -17], handR: [sd * 7, -17], handPoseL: 'palm', handPoseR: 'palm', lean: sd * .08 })
      : t < UP ? { rot: sd * -1.4 * down, eyes: 'closed', mouth: 'wobble', jump: 0 }
      : t < HUG ? { eyes: 'happy', mouth: 'O', brows: 'up', jump: .4 * hop(t) }
      : { eyes: 'happy', mouth: 'grin', brows: 'up', handL: [sd > 0 ? -5 : -6, -15], handR: [sd > 0 ? 6 : 5, -15], tilt: sd * .12, handPoseL: 'open', handPoseR: 'open' };
    const SF = rig('safadi', lerp(600, 860, hugK), FGY, FS, pose('safadi', 1)), SM = rig('sami', lerp(1320, 1060, hugK), FGY, FS, pose('sami', -1));
    if (inW(t, S_KO + .3, KO)) { const mx = W / 2, my = SF.chest[1], k = ease(seg(t, S_KO + .3, MEET));
      X.save(); X.globalCompositeOperation = 'lighter';
      line([SF.handR, [lerp(SF.handR[0], mx, k), my]], { stroke: rgba('#FFE066', .9), lwPx: 40 + 10 * Math.sin(t * 40) }); line([SM.handL, [lerp(SM.handL[0], mx, k), my]], { stroke: rgba('#FF5A5A', .9), lwPx: 40 + 10 * Math.sin(t * 43) });
      X.restore(); if (t > MEET) { shape(starPts(mx + (hash(Math.floor(t * 24)) - .5) * 30, my, 120 + 60 * Math.sin(t * 30), .4, 14, t * 4), { fill: '#FFFFFF', stroke: '#FFE066', lwPx: 6 }); } }
    flash(.95 * kick(t, KO, 4));
    dmSlam('DOUBLE K.O.', W / 2, H * .36, 200, DM.red, t, KO + .2, 1.6, { shake: 14 });
    if (t > HUG + .4) { dmSlam('FAMILY-TY!', W / 2, H * .3, 220, '#FF6B9A', t, HUG + .4, 2.2, { shake: 6 });
      for (let i = 0; i < 8; i++) { const u = frac(t * .5 + i / 8); shape(starPts(W / 2 + (hash(i) - .5) * 600, SF.top[1] - 260 * u, 30, .9, 2, 0), { fill: rgba('#FF6B9A', 1 - u), stroke: null }); } }
    // the kids run in and pile on
    const pile = ease(seg(t, HUG + .6, HUG + 1.4));
    [['housam', 110, 760], ['danny', 250, 820], ['jenna', W - 250, 1100], ['alma', W - 110, 1160]].forEach(([who, x0, x1], i) => { const x = lerp(x0, x1, pile);
      rig(who, x, lerp(FGY + 120, FGY + 60, pile), lerp(9, 11, pile), pile > .9 ? cheerPose(t, i) : { eyes: t > UP ? 'happy' : 'wide', mouth: 'O', handL: [-5, -18], handR: [5, -18], jump: .5 * hop(t + i * .1) }); });
    fightHUD(t);
  }

  // =====================================================================================================
  // ---------- the final boss ----------
  function bossRise(t) {
    const lt = t - S_BOSSRISE, [sx, sy] = shakeXY(t, 14 * seg(lt, .6, 2));
    camBegin(W / 2 - sx, H / 2 - sy, 1, 0);
    dmArena(t, { ground: FGY, tilt: .5 * seg(lt, 0, 2) });
    X.fillStyle = rgba('#FF2A2A', .25 * seg(lt, 0, 1.2) * (.6 + .4 * Math.sin(t * 10))); X.fillRect(0, 0, W, H);
    const rise = ease(seg(lt, 1.6, 3.2)), cr = lerp(120, 300, rise);
    dmClock(lerp(W * .72, W / 2, rise), lerp(H * .3, H * .45, rise), cr, t, { ring: seg(lt, 2.8, 3.2) });
    for (const [who, x, sd] of [['safadi', 520, 1], ['sami', 1400, -1], ['housam', 300, 1], ['danny', 420, 1], ['jenna', 1520, -1], ['alma', 1640, -1]])
      rig(who, x, FGY + (who === 'safadi' || who === 'sami' ? 0 : 80), who === 'safadi' || who === 'sami' ? 11 : 9, { eyes: 'wide', mouth: 'O', brows: 'up', lookX: -sd * .4, lookY: -.5, jump: .3 * hop(t * 2), handL: [-5, -20], handR: [5, -20] });
    camEnd();
    if (frac(t * 2) < .6 && lt < 2) { X.fillStyle = rgba('#FF2A2A', .85); X.fillRect(0, H * .44, W, 140); stArcade('! WARNING !', W / 2, H * .44 + 70, 100, '#FFFFFF'); }
    dmSlam('FINAL BOSS', W / 2, H * .14, 120, DM.red, t, S_BOSSRISE + 2.2, 1.8);
    dmSlam('THE ALARM CLOCK', W / 2, H * .78, 120, DM.gold, t, S_BOSSRISE + 2.6, 1.4);
  }
  // everyone at once: one attack per beat
  const ATTACKS = [['neptune', 'RAINBOW BLAST!'], ['safadi', 'FORMULA!'], ['sami', 'APPLE!'], ['housam', 'VOLLEY!'], ['alma', 'RAINBOW!'], ['danny', 'BLOCK!'], ['jenna', 'CARTWHEEL KICK!'], ['clawd', 'ZAP!'], ['robo', 'FRIENDLY FIRE!']];
  const atkT = i => S_BOSSFIGHT + .4 + i * B * 1.1;
  function bossFight(t) {
    const lt = t - S_BOSSFIGHT, RING = S_BOSSFIGHT + 5.2, CX = 1420, CY = 430, CR = 270;
    dmArena(t, { ground: FGY, tilt: .5 });
    X.fillStyle = rgba('#3A0A1A', .35); X.fillRect(0, 0, W, H);
    const hits = ATTACKS.filter((_, i) => t > atkT(i) + .3).length, hurt = ATTACKS.reduce((a, _, i) => a + kick(t, atkT(i) + .3, 7), 0);
    const ring = t > RING ? 1 : 0;
    dmClock(CX + 20 * hurt, CY, CR, t, { ring: ring || .3 * hurt, hurt: Math.min(1, hurt) });
    // the team on the left
    const knock = ease(seg(t, RING, RING + .6)) * 260;
    const N = rig('neptune', 320 - knock, 700, 9, { sit: 1, trident: true, tridentAng: -.6, power: .8, eyes: 'glow', mouth: 'grin', flip: false });
    const team = [['safadi', 560, 11], ['sami', 700, 11], ['housam', 840, 9], ['alma', 940, 9], ['danny', 1040, 9], ['jenna', 640, 9], ['robo', 180, 7]];
    const A = { neptune: N };
    team.forEach(([who, x, s], i) => { const atk = ATTACKS.findIndex(a => a[0] === who), k = atk >= 0 ? on(t, atkT(atk) - .2, atkT(atk) + .4, .1) : 0;
      A[who] = rig(who, x - knock * (1 - i * .05), (who === 'robo' ? FGY : FGY) + (s < 10 ? 60 : 0) - (who === 'jenna' ? 300 * Math.sin(Math.PI * k) : 0), s,
        t > RING ? { eyes: 'squeeze', mouth: 'O', rot: -.4 * seg(t, RING, RING + .6), handL: [-6, -22], handR: [6, -22] }
        : { eyes: who === 'robo' ? 'heart' : 'narrow', brows: 'angry', mouth: 'grin', power: who === 'alma' ? 1 : .3, handL: [-5, -18], handR: k > 0 ? [7, -18] : [5, -18], handPoseR: k > 0 ? 'palm' : 'fist', handPoseL: 'fist', jump: .3 * hop(t + i * .1), rot: who === 'jenna' ? TAU * k : 0 }); });
    const C = rig('clawd', 300, 300 + 20 * Math.sin(t * 3), 14, { holo: 1, eyes: 'spark', mouth: 'grin', aL: 1.2, aR: 1.2 });
    A.clawd = C;
    ATTACKS.forEach(([who, name], i) => {
      const t0 = atkT(i), u = seg(t, t0, t0 + .3), R = A[who]; if (!R || u <= 0) return;
      const from = who === 'neptune' ? R.tridentTip : R.handR || R.chest || R.head, to = [CX - 60 + (hash(i) - .5) * 120, CY + (hash(i * 3) - .5) * 160];
      if (u < 1) {
        if (who === 'neptune') neptuneBlast(from[0], from[1], to[0], to[1], u, t, 34);
        else if (who === 'housam') housamBall(lerp(from[0], to[0], u), lerp(from[1], to[1], u) - 100 * Math.sin(Math.PI * u), 9, { spin: t * 10 });
        else if (who === 'danny') dmBlock(lerp(from[0], to[0], u) - 40, lerp(from[1], to[1], u) - 40 - 120 * Math.sin(Math.PI * u), 80, 'grass');
        else if (who === 'sami') { circle(lerp(from[0], to[0], u), lerp(from[1], to[1], u), 34, { fill: '#E8343A', stroke: DM.ink, lwPx: 4 }); }
        else if (who === 'safadi') dmFormula(lerp(from[0], to[0], u), lerp(from[1], to[1], u), 50, 'E=mc²', t);
        else { X.save(); X.globalCompositeOperation = 'lighter'; line([from, [lerp(from[0], to[0], u), lerp(from[1], to[1], u)]], { stroke: who === 'alma' ? '#FF9AE6' : who === 'clawd' ? '#7FE3FF' : '#FF6A6A', lwPx: 20 }); X.restore(); }
      }
      dmBoom(to[0], to[1], 110, seg(t, t0 + .3, t0 + .8)); dmPop(name, to[0] - 200, to[1] - 200 - (i % 3) * 50, 44, '#FFFFFF', t, t0, 1.0);
    });
    dmBar(W / 2 - 520, 50, 1040, 36, t > RING ? .05 : 1 - hits * .105, DM.red, 'THE ALARM CLOCK');
    if (t > RING) { dmSlam('RIIIIING!', CX - 520, 230, 170, '#FFE066', t, RING, 2.8, { shake: 24 });
      for (let j = 0; j < 4; j++) { const u = frac((t - RING) * 1.2 + j / 4); X.save(); X.globalAlpha = 1 - u; X.beginPath(); X.arc(CX, CY, CR + 1400 * u, 0, TAU); X.lineWidth = 14; X.strokeStyle = '#FFE066'; X.stroke(); X.restore(); } }
    flash(.6 * kick(t, RING, 5));
  }
  function continueShot(t) {
    const lt = t - S_CONT, CRACK = S_CONT + 3.1;
    X.fillStyle = '#05040A'; X.fillRect(0, 0, W, H);
    dmSlam('GAME OVER?', W / 2, H * .2, 150, DM.red, t, S_CONT + .3, 3.9);
    if (lt > 1.2) { stArcade('CONTINUE?', W / 2, H * .38, 90, '#FFFFFF'); const n = 9 - clamp(beatN(t, S_CONT + 1.6), 0, 3); dmSlam(String(n), W / 2, H * .58, 260, DM.gold, t, S_CONT + 1.6 + (9 - n) * B, B + .05); }
    // the brothers, mashing buttons in a panic
    for (const [who, x] of [['safadi', 520], ['sami', W - 520]]) { const m = Math.sin(t * 40 + x);
      dmChar(who, x, H * .82, 120, { eyes: 'wide', brows: 'worried', mouth: 'wobble', emote: 'sweat', emoteK: 1, handL: [-3 + m, -12], handR: [3 - m, -12], handPoseL: 'fist', handPoseR: 'fist', jump: 0 }); }
    if (t > CRACK) { const u = easeOut(seg(t, CRACK, CRACK + .6));                // the screen cracks
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + hash(i) * .4, pts = [[W / 2, H / 2]]; for (let j = 1; j <= 5; j++) pts.push([W / 2 + Math.cos(a + (hash(i * 9 + j) - .5) * .4) * j * 260 * u, H / 2 + Math.sin(a + (hash(i * 7 + j) - .5) * .4) * j * 200 * u]);
        line(pts, { stroke: '#FFFFFF', lwPx: 5 }); } }
    flash(seg(t, CRACK + .5, S_WAKE) * 1, '#FFFDF6');
  }

  // =====================================================================================================
  // ---------- wake up ----------
  function wakeUp(t) {
    const lt = t - S_WAKE, JOLT = S_WAKE + 1.2, GAMES = S_WAKE + 2.4, LAUGH = S_WAKE + 3.0, FREEZE = S_WAKE + 3.9;
    const tt = Math.min(t, FREEZE), [dx, dy] = [6 * Math.sin(tt * .23), 3 * Math.sin(tt * .31)];
    const P = persp({ x: dx, y: 140, z: 820, f: 1000, hy: 560 + dy, dir: -1 });
    LR.back(P, tt, { splitZ: 140, night: 0, lamp: .2, fan: true });
    const A = sofaTwins(P, tt, name => { const ph = name === 'sami' ? 1.3 : 0;
      if (tt < JOLT) return asleep(tt, ph);
      if (tt < GAMES) return { eyes: 'wide', brows: 'up', mouth: 'O', jump: 1.2 * kick(tt, JOLT, 5), handL: [-6, -20], handR: [6, -20], lookX: name === 'safadi' ? -.6 : .6 };
      if (tt < LAUGH) return { eyes: 'open', brows: 'up', mouth: 'smile', lookX: name === 'safadi' ? .5 : -.5, lookY: .1 };
      return { eyes: 'happy', mouth: 'O', brows: 'up', jump: .5 * hop(tt + ph * .1), handL: [-4, -13], handR: [4, -13], tilt: .05 * Math.sin(tt * 8 + ph) }; });
    LR.front(P, tt, { splitZ: 140, toZ: 300, night: 0, lamp: .2, fan: true });
    // the kids in front of the sofa: Danny with the ringing clock, the others with the board games
    const KPOS = { housam: [350, 300], alma: [210, 380], jenna: [-210, 380], danny: [-350, 300] }, held = {};
    for (const who of ['housam', 'danny', 'alma', 'jenna']) { const [x, z] = KPOS[who], [sx, sy, k] = P.p(x, 0, z), s = UNITS[who] * k;
      const up = ease(seg(tt, GAMES, GAMES + .4));
      const pose = tt < LAUGH ? { eyes: 'happy', mouth: 'grin', brows: 'up', handL: [-3.4, -9], handR: [3.4, -9], handPoseL: 'open', handPoseR: 'open', lookX: lerp(.4, 0, up) * Math.sign(x) }
        : { eyes: 'happy', mouth: 'O', brows: 'up', jump: .7 * hop(tt + x * .001), handL: [-3, -18], handR: [3, -18] };
      if (who === 'danny' && tt < GAMES) Object.assign(pose, { handR: [4, -17], handPoseR: 'fist', mouth: 'grin' });
      held[who] = DM_RIG[who](sx, sy, s, { t: tt, giraffe: false, ...pose }); held[who].s = s; }
    LR.front(P, tt, { splitZ: 300, night: 0, lamp: .2, fan: true });
    // the props in their hands
    const D = held.danny; if (tt < GAMES + .4) { const r = tt < LAUGH ? 1 : 0; dmClock(D.handR[0], D.handR[1] - 30, 46, tt, { ring: tt < JOLT + 1 ? r : .3 }); if (tt < JOLT + 1) dmSlam('RIIING!', D.handR[0], D.handR[1] - 140, 60, '#FFE066', tt, S_WAKE + .1, 2, { shake: 8 }); }
    const games = [['housam', 'oligarchy'], ['alma', 'rainbow'], ['jenna', 'dolphins']];
    for (const [who, kind] of games) { const R = held[who], up = ease(seg(tt, GAMES, GAMES + .4)); if (up <= 0) continue; const gw = 170 * R.s / 10; cuGame(kind, R.chest[0], R.chest[1] + gw * .3 - 30 * (1 - up), gw, .05 * Math.sin(tt * 3), { t: tt }); }
    X.fillStyle = rgba('#FFD890', .12); X.fillRect(0, 0, W, H);                       // morning sun
    if (tt > JOLT) for (const name of ['safadi', 'sami']) dmPop('!', A[name].top[0], A[name].top[1] - 40, 90, '#FFE066', tt, JOLT, .9);
    if (tt > LAUGH) dmPop('HA HA HA!', W / 2, 200, 90, '#FFFFFF', tt, LAUGH, 1.6);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => { const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W / 2, H * .5); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-420, -110, 840, 220), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `130px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 18; X.strokeStyle = PAL.ink; X.strokeText('THE END', 0, 10); X.fillStyle = '#6A3FB0'; X.fillText('THE END', 0, 10); X.restore(); });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 1.4, END - .2))));
  }

  // ---------- the video-game look (post-process) ----------
  // Inside the dream every frame runs through a CRT (dmGameFX in props.js); it fades away as the brothers wake. LOOK sets the strength.
  // With pixel > 1 the frame is also pixelated, resolving in on the title, glitching up at each new world and shattering on the crack.
  const LOOK = { pixel: 1, levels: 0, crt: 1 };
  function lookAt(t) {
    if (t < S_TITLE || t >= S_WAKE + .7) return null;
    if (t >= S_WAKE) { const u = ease(seg(t, S_WAKE, S_WAKE + .7)); return { pixel: LOOK.pixel > 1 ? lerp(12, 1, u) : 1, crt: LOOK.crt * (1 - u) }; }
    if (LOOK.pixel <= 1) return { pixel: 1, crt: LOOK.crt };
    let px = LOOK.pixel + 14 * (1 - ease(seg(t, S_TITLE, S_TITLE + .7)));
    for (const s0 of [S_W1, S_W2, S_W3, S_VS, S_BOSSRISE]) px += 8 * kick(t, s0, 5);
    px += 20 * ease(seg(t, S_CONT + 3.1, S_WAKE));
    return { pixel: px, levels: LOOK.levels, crt: LOOK.crt };
  }
  const withKaraoke = fn => (t, lt, dur) => {                                    // the shot, its overlays, the game look, then crisp captions on top
    fn(t, lt, dur);
    const look = lookAt(t); if (look) { flushOverlays(); dmGameFX(t, look); }
    dmKaraoke(t);
  };
  scene({ duration: END, fps: 24, bpm: 120,
    shots: [
      [0, dozing], [S_START, pressStart], [S_TITLE, title], [S_SELECT, select],
      [S_W1, card1], [S_FLY, spaceFly], [S_INV, invaders], [S_SHIELD, shields], [S_BOSS1, mothership], [S_WARP1, warp1],
      [S_W2, card2], [S_KICK, kickoff], [S_PASS, passes], [S_BIKE, bicycle], [S_CELEB, celebrate], [S_WARP2, warp2],
      [S_W3, card3], [S_BUILD, build], [S_CREEP, creeper], [S_CUBE, cube], [S_PARTY, blockParty],
      [S_VS, vs], [S_ROUND, round1], [S_COMBO, combos], [S_KO, doubleKO],
      [S_BOSSRISE, bossRise], [S_BOSSFIGHT, bossFight], [S_CONT, continueShot], [S_WAKE, wakeUp],
    ].map(([t0, fn]) => [t0, withKaraoke(fn)]) });
})();
