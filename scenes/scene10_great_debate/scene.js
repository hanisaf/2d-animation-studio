// Scene 10: "The Great Debate". Outside DCES Safadi declares that kids should read books, not play video games, and
// Housam takes him on. A flash of Safadi's power moves everyone into the lecture hall: the debaters on stage (podium
// view), the two front-wall boards as the BOOKS / GAMES scoreboard, and Alma, Fester and Dragon in row 1 (the reverse
// classroom view), their heads turning to whoever is talking. The vote goes to Housam, then: "…thirty minutes a day."
// Every shot is a pure function of t. Dialogue lives in asset.js and drives the bubbles, mouths and voices.
(() => {
  const D = LOCATIONS.dces, HALL = LOCATIONS.lecture_hall, LINES = ASSETS.scene.scene10_great_debate.dialogue;
  const FLOOR = HALL.STAGE.y;
  // ---- the hall: debaters on stage, audience in row 1 ----
  const SAF = { x: -250, y: FLOOR, z: 1925 }, HOU = { x: 250, y: FLOOR, z: 1925 };   // at the front of the stage
  const FES = HALL.seat(1, 175), ALM = HALL.seat(1, 0, 42), DRG = HALL.seat(1, -195);
  // ---- outside DCES: everyone on the entrance plaza ----
  const OUT = { housam: { x: -330, z: 2150 }, safadi: { x: -90, z: 2190 }, alma: { x: 135, z: 2140 }, jester_fester: { x: 285, z: 2165 }, dragon: { x: 465, z: 2200 } };
  const HALL_AT = 17.3;                                         // the flash cut into the lecture hall
  const ACCENT = { safadi: PAL.crimson, housam: '#3766BD', alma: '#994EC4', jester_fester: PAL.plum, dragon: '#258343' };
  // The scoreboard: [time the chalk lands, text]. Books = Safadi's points, Games = Housam's.
  const BOOKS = [[21.0, 'Games are mindless'], [41.4, 'Games isolate kids'], [63.0, 'Books build brains'], [85.8, 'Link ≠ cause ✓']];
  const GAMES = [[33.0, 'Info processing'], [51.6, 'Teamwork'], [75.4, 'Puzzles'], [78.6, 'Working memory'], [90.0, 'Stress relief'], [93.2, 'A game for everyone']];
  const VOTES = [106.6, 107.0, 107.4];                          // Alma, Fester, Dragon
  const TOSS = 56.35, BONK = 57.3;                              // Fester's ball
  const CHEER = 114.0, SCRATCH = 120.9;

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who || l.kind === 'think') return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));   // 0 → 1 → 0 envelope
  const mix = (a, b, k) => mixPt(a, b, clamp(k));
  const nod = (t, t0, n = 2, per = .5) => { const u = (t - t0) / per; return u > 0 && u < n ? Math.sin(Math.PI * (u % 1)) : 0; };
  const nodPose = v => ({ lookY: .6 * v, dy: .3 * v, tilt: .025 * v });
  const inHall = t => t >= HALL_AT;
  // Which debater has the floor: +1 Safadi, −1 Housam (eased across each hand-over). The audience's heads follow it.
  const DEBATE = LINES.filter(l => l.speaker === 'safadi' || l.speaker === 'housam');
  function floorSide(t) {
    let i = -1; for (let j = 0; j < DEBATE.length; j++) if (DEBATE[j].at <= t) i = j;
    if (i < 0) return 1;
    const side = l => l.speaker === 'safadi' ? 1 : -1, prev = i > 0 ? side(DEBATE[i - 1]) : 1;
    return lerp(prev, side(DEBATE[i]), ease(seg(t, DEBATE[i].at, DEBATE[i].at + .35)));
  }
  const celebrating = t => t >= CHEER && t < SCRATCH;
  const deflated = t => t >= SCRATCH;

  // ---------- props ----------
  const BOOK_COLS = ['#C3222F', '#3F5FC4', '#4FAA4F', '#E4AE3E', '#8C5CC8'];
  function bookStack(x, y, s, n = 5, t = 0) {                   // (x, y) = bottom centre, s = px per unit
    for (let i = 0; i < n; i++) {
      const w = (5.2 - .35 * (i % 3)) * s, h = 1.05 * s, off = (hash(i * 3.3) - .5) * .8 * s, yy = y - (i + 1) * h;
      shape(rectPts(x - w / 2 + off, yy, w, h), { fill: BOOK_COLS[i % BOOK_COLS.length], stroke: PAL.ink, lwPx: clamp(s * .16, 1.4, 3.2) });
      line([[x - w / 2 + off + .5 * s, yy + h * .5], [x + w / 2 + off - .5 * s, yy + h * .5]], { stroke: 'rgba(255,245,220,.7)', lwPx: clamp(s * .1, 1, 2) });
    }
  }
  function book(x, y, s, ang = 0) {
    X.save(); X.translate(x, y); X.rotate(ang);
    shape(rectPts(-2.6 * s, -1.9 * s, 5.2 * s, 3.8 * s), { fill: BOOK_COLS[1], stroke: PAL.ink, lwPx: clamp(s * .16, 1.4, 3.2) });
    line([[-2.1 * s, -1.9 * s], [-2.1 * s, 1.9 * s]], { stroke: 'rgba(255,245,220,.8)', lwPx: clamp(s * .12, 1, 2.4) });
    X.restore();
  }
  // Safadi's mime: a glowing chalk gamepad between his hands
  function gamepad(cx, cy, s, t, k) {
    if (k < .01) return;
    overlay(() => {
      X.save(); X.translate(cx, cy); X.scale(k * s, k * s); X.globalAlpha = k;
      X.shadowColor = SF.glow; X.shadowBlur = 18;
      shape([[-4.4, -1.4], [4.4, -1.4], [5.2, 1.6], [3.6, 2.4], [2, .9], [-2, .9], [-3.6, 2.4], [-5.2, 1.6]], { fill: 'rgba(35,67,58,.55)', stroke: SF.glow, lwPx: 3, smooth: true });
      line([[-3.4, -.25], [-1.8, -.25]], { stroke: SF.chalk, lwPx: 3 }); line([[-2.6, -1.05], [-2.6, .55]], { stroke: SF.chalk, lwPx: 3 });
      [[2.4, -.8], [3.3, -.1], [1.5, -.1], [2.4, .6]].forEach(([x, y], i) => circle(x, y, .34 + .1 * (Math.floor(t * 8 + i) % 2), { fill: SF.glowGold, stroke: null }));
      X.restore();
    });
  }
  // Housam's Breath of the Wild inventory: little chalk icons pop over his notebook, one per item
  const ICON_T = [28.5, 29.0, 29.5, 30.0, 30.5];
  function botwIcons(cx, cy, s, t) {
    const k0 = on(t, 28.4, 33.4, .25);
    if (k0 < .01) return;
    overlay(() => ICON_T.forEach((t0, i) => {
      const k = backOut(seg(t, t0, t0 + .3)) * k0; if (k < .01) return;
      const x = cx + (i - 2) * 4.6 * s, y = cy - (7.5 + 1.2 * Math.sin(i * 1.7 + t * 2)) * s, r = 1.9 * s * k;
      X.save(); X.translate(x, y);
      circle(0, 0, r * 1.25, { fill: 'rgba(35,67,58,.85)', stroke: SF.glow, lwPx: 3 });
      const st = { stroke: SF.chalk, lwPx: clamp(s * .3, 2, 5) };
      if (i === 0) { line([[-r * .6, r * .6], [r * .6, -r * .6]], st); line([[-r * .55, r * .05], [-r * .05, r * .55]], st); }       // sword
      if (i === 1) { line([[-r * .7, r * .7], [r * .5, -r * .5]], st); shape([[r * .7, -r * .7], [r * .25, -r * .55], [r * .55, -r * .25]], { fill: SF.chalk, stroke: null }); }   // spear
      if (i === 2) { X.beginPath(); X.arc(-r * .3, 0, r * .75, -1.2, 1.2); X.strokeStyle = SF.chalk; X.lineWidth = st.lwPx; X.stroke(); line([[-r * .03, -r * .7], [-r * .03, r * .7]], { ...st, lwPx: st.lwPx * .5 }); }   // bow
      if (i === 3) shape([[-r * .55, -r * .6], [r * .55, -r * .6], [r * .5, r * .1], [0, r * .7], [-r * .5, r * .1]], { fill: 'rgba(255,214,107,.35)', ...st });   // shield
      if (i === 4) { circle(-r * .15, -r * .15, r * .45, { fill: '#D98F5B', stroke: SF.chalk, lwPx: st.lwPx * .7 }); line([[r * .15, r * .15], [r * .6, r * .6]], st); }   // drumstick
      X.restore();
    }));
  }
  // "58,000,000,000,000,000": the number unrolls across the frame, digit by digit
  function quadrillion(t) {
    const txt = '58,000,000,000,000,000', k = seg(t, 66.9, 68.9), fade = 1 - ease(seg(t, 70.6, 71.2));
    if (k <= 0 || fade <= 0) return;
    overlay(() => {
      X.save(); X.globalAlpha = fade; X.font = `700 118px ${SF_CHALK}`; X.textBaseline = 'middle';
      const n = Math.ceil(txt.length * k), shown = txt.slice(0, n), full = X.measureText(txt).width;
      const x0 = W / 2 - full / 2 + 60 * (1 - ease(k)), y = 250 + 10 * Math.sin(t * 3);
      X.shadowColor = SF.glowGold; X.shadowBlur = 26; X.lineJoin = 'round';
      X.lineWidth = 16; X.strokeStyle = 'rgba(35,67,58,.9)'; X.strokeText(shown, x0, y);
      X.fillStyle = SF.glowGold; X.fillText(shown, x0, y);
      X.shadowBlur = 0; X.font = `700 44px ${FONT_TALK}`; X.fillStyle = '#FFFDF4'; X.textAlign = 'center';
      if (t > 68.9) { X.globalAlpha = fade * ease(seg(t, 68.9, 69.3)); X.lineWidth = 8; X.strokeStyle = PAL.ink; X.strokeText('wrong answers!', W / 2, y + 100); X.fillText('wrong answers!', W / 2, y + 100); }
      X.restore();
    });
  }
  // "30 min / day": a glowing chalk card by Safadi's raised finger
  function limitCard(x, y, t) {
    const k = on(t, 119.0, 123.9, .35);
    if (k < .01) return;
    overlay(() => {
      X.save(); X.translate(x, y + 6 * Math.sin(t * 2)); X.scale(backOut(k), backOut(k)); X.rotate(-.05);
      X.shadowColor = SF.glow; X.shadowBlur = 24;
      shape(rectPts(-230, -80, 460, 160), { fill: linGrad(0, -80, 0, 80, [[0, SF.board], [1, SF.boardDk]]), stroke: SF.glow, lwPx: 5 });
      X.shadowBlur = 0; X.fillStyle = SF.glowGold; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.font = `700 70px ${SF_CHALK}`; X.fillText('30 min / day', 0, 4);
      X.restore();
    });
  }

  // ---------- the scoreboard (drawn on the front-wall boards, world units, origin top-left, y down) ----------
  function chalkLine(txt, x, y, px, t0, t, col = SF.chalk, maxW = 400) {
    const k = seg(t, t0, t0 + .6); if (k <= 0) return;
    X.save(); X.font = `700 ${px}px ${SF_CHALK}`; X.textBaseline = 'middle'; X.textAlign = 'left';
    const w = Math.min(X.measureText(txt).width, maxW);
    X.beginPath(); X.rect(x - 10, y - px, (w + 20) * k, px * 2); X.clip();
    X.fillStyle = col; X.fillText(txt, x, y, maxW);
    X.restore();
  }
  function scoreBoard(title, items, t0, tallies) {
    return t => {
      if (t < t0) return;
      chalkLine(title, 30, 62, 66, t0, t, SF.glowGold);
      if (t > t0 + .3) line([[30, 104], [30 + 400 * ease(seg(t, t0 + .3, t0 + .8)), 104]], { stroke: SF.glow, lwPx: 4 });
      items.forEach(([at, txt], i) => {
        const gold = txt.includes('✓');
        chalkLine('• ' + txt, 30, 165 + i * 64, 42, at, t, gold ? SF.glowGold : SF.chalk, 410);
      });
      (tallies || []).forEach((at, i) => {
        const k = ease(seg(t, at, at + .25)); if (k <= 0) return;
        line([[300 + i * 30, 30], [300 + i * 30, 30 + 64 * k]], { stroke: SF.glowGold, lwPx: 9 });
      });
    };
  }
  const HALL_O = { screen: 0, projector: 0, boardL: scoreBoard('BOOKS', BOOKS, 18.5), boardR: scoreBoard('GAMES', GAMES, 18.9, VOTES) };

  // ======================================================================================
  // Safadi
  // ======================================================================================
  function safadiPose(t) {
    const talk = speaking('safadi', t);
    const o = { turn: .08 * Math.sin(t * .23), lookX: .2 + .15 * Math.sin(t * .31), lookY: 0, brows: 'normal',
      mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']),
      handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const toHousam = (k = 1) => { o.turn = lerp(o.turn, .3, k); o.lookX = lerp(o.lookX, .8, k); };
    const to = (h, p, k, which = 'R') => { o['hand' + which] = mix(o['hand' + which], p, k); if (k > .5) o['handPose' + which] = h; };
    if (!inHall(t)) {
      // outside DCES: the stack of books rides on his left arm
      Object.assign(o, { handL: [-3.3, -11.6], handPoseL: 'fist', lookX: .35, lookY: .15 });
      o.dy = .5 * kick(t, 5.6, 6);
      to('palm', [5.3, -12.6], on(t, 2.6, 5.4));
      to('point', [5.8, -21.4], on(t, 6.0, 9.8)); if (t > 6 && t < 9.8) o.brows = 'up';
      if (t > 7.6 && t < 9.8) o.eyes = 'narrow';
      if (t >= 9.9 && t < 12.5) Object.assign(o, { turn: -.3, lookX: -.8, lookY: .1, brows: t < 11.8 ? 'quizzical' : 'up', mouth: talk ? o.mouth : t < 11.8 ? 'o' : 'grin' });
      if (t >= 12.5 && t < 14.9) Object.assign(o, { eyes: 'happy', brows: 'up', bulb: ease(seg(t, 12.6, 12.85)) * (1 - ease(seg(t, 14.4, 14.8))), turn: -.15, lookX: -.4, mouth: lipFlap(t, talk, 'grin') });
      if (t >= 14.9) {
        const pw = ease(seg(t, 15.4, 16.9));
        to('point', [6.4, -17.8], ease(seg(t, 14.9, 15.2)));
        Object.assign(o, { power: pw, eyes: pw > .5 ? 'glow' : 'happy', brows: 'up', turn: .1, lookX: .5, lookY: -.2, mouth: lipFlap(t, talk, 'grin') });
      }
      return o;
    }
    // --- the lecture hall ---
    // arriving: the power fades as the boards write their titles
    if (t < 21.6) {
      const pw = 1 - ease(seg(t, HALL_AT, 19.4));
      Object.assign(o, { power: pw, eyes: pw > .5 ? 'glow' : 'open', brows: 'up' });
      to('palm', [5.6, -14.2], on(t, HALL_AT, 19.2, .2));
      to('palm', [5.3, -12.6], on(t, 19.3, 21.5));
      if (t > 20.1) o.mouth = talk ? o.mouth : 'smirk';
    }
    // "Left, right, dodge, shoot, repeat!": the button-mashing mime
    const mash = on(t, 21.7, 24.7, .25);
    if (mash > 0) {
      const j = .35 * Math.sin(t * 40), j2 = .35 * Math.sin(t * 37 + 1);
      o.handL = mix(o.handL, [-1.9 + j, -11.4 + j2], mash); o.handR = mix(o.handR, [1.9 - j2, -11.4 + j], mash);
      if (mash > .5) Object.assign(o, { handPoseL: 'fist', handPoseR: 'fist', eyes: 'narrow', lookY: .45, lookX: .25 * Math.sin(t * 9), brows: 'focused', tilt: .03 * Math.sin(t * 6) });
    }
    // listening to Housam
    const listening = (a, b) => t >= a && t < b;
    if (listening(24.8, 36.8) || listening(42.2, 58.6) || listening(63.8, 79.4) || listening(85.4, 94.0)) {
      toHousam(ease(seg(t, 24.8, 25.2)));
      if (t >= 24.8 && t < 36.8) { to('fist', [.8, -16.1], on(t, 28.0, 33.4)); if (t > 28 && t < 33.4) o.brows = 'quizzical'; if (t > 34.2) Object.assign(o, { eyes: 'happy', mouth: 'grin' }); }
      if (t >= 42.2 && t < 58.6) {
        const cross = on(t, 42.6, 51.2, .4);
        o.handL = mix(o.handL, [1.8, -11.4], cross); o.handR = mix(o.handR, [-1.8, -11.0], cross);
        if (cross > .5) Object.assign(o, { handPoseL: 'fist', handPoseR: 'fist', brows: 'quizzical', mouth: 'flat' });
        if (t > 49.5 && t < 51.2) Object.assign(o, { brows: 'worried', eyes: 'wide', mouth: 'o' });
        if (t > 52.4) Object.assign(o, { eyes: 'happy', mouth: 'smile' });
      }
      if (t >= 63.8 && t < 79.4) {
        if (t > 66.6 && t < 71) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'O', lookY: -.6, lookX: .3, emote: '!', emoteK: on(t, 67, 68.4, .15) });
        if (t > 76 && t < 79.4) Object.assign(o, { brows: 'focused', mouth: 'flat' }, { handR: [.8, -16.1], handPoseR: 'fist' });
      }
      if (t >= 85.4 && t < 94) {
        if (t < 87.6) Object.assign(o, { eyes: 'happy', mouth: 'grin', brows: 'up' }, nodPose(nod(t, 86.2, 2, .45)));
        else Object.assign(o, { brows: 'worried', mouth: 'flat', emote: t > 92.6 ? 'sweat' : null, emoteK: ease(seg(t, 92.6, 92.9)) });
      }
    }
    // "Reading together builds friendships. Games isolate kids."
    if (t >= 36.8 && t < 42.2) {
      const warm = on(t, 37.0, 39.8);
      o.handL = mix(o.handL, [-5.3, -12.4], warm); o.handR = mix(o.handR, [5.3, -12.4], warm);
      if (warm > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', brows: 'up' });
      to('point', [5.8, -21.4], on(t, 40.0, 42.2)); if (t > 40) o.brows = 'up';
    }
    // "Books make you think. Games make you… well… dumber."
    if (t >= 58.6 && t < 63.8) {
      to('point', [5.8, -21.4], on(t, 58.8, 60.8)); if (t < 60.8) o.brows = 'up';
      if (t >= 61) {
        to('palm', [5.3, -12.6], on(t, 61.1, 63.8));
        Object.assign(o, { eyes: t > 61.8 ? 'narrow' : 'open', mouth: talk ? o.mouth : 'smirk', brows: 'up', lookX: .5, turn: .1 });
      }
    }
    // "Aha! A link is not a cause! Maybe smart kids just like games."
    if (t >= 79.4 && t < 85.4) {
      const pw = on(t, 79.6, 85.2, .4);
      to('point', [5.8, -21.4], on(t, 79.6, 82.3));
      Object.assign(o, { power: .75 * pw, eyes: pw > .6 && t < 81.4 ? 'glow' : 'happy', brows: 'up', bulb: ease(seg(t, 79.7, 79.95)) * (1 - ease(seg(t, 81.9, 82.3))),
        mouth: lipFlap(t, talk, 'grin'), turn: .15, lookX: .5 });
      if (t >= 82.3) { to('palm', [5.3, -12.6], on(t, 82.4, 85.3)); o.eyes = 'narrow'; }
    }
    // the vote: "Very well! Time to vote. Which side was more compelling? Who votes for books?"
    if (t >= 94.0 && t < 108.2) {
      Object.assign(o, { turn: -.05, lookX: 0, lookY: .05 });
      const both = on(t, 94.2, 99.2);
      o.handL = mix(o.handL, [-5.3, -12.4], both); o.handR = mix(o.handR, [5.3, -12.4], both);
      if (both > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', brows: 'up' });
      const raise = ease(seg(t, 99.6, 100.0)) * (1 - ease(seg(t, 103.5, 104.0)));
      o.handR = mix(o.handR, [6.2, -28.5], raise); if (raise > .5) o.handPoseR = 'palm';
      if (t > 99.6 && t < 101.4) Object.assign(o, { eyes: 'happy', mouth: lipFlap(t, talk, 'grin') });
      if (t >= 101.4 && t < 104) Object.assign(o, { mouth: 'flat', eyes: 'open', lookX: .6 * Math.sin((t - 101.4) * 2.6), brows: 'worried', emote: t > 102.6 ? 'sweat' : null, emoteK: ease(seg(t, 102.6, 102.9)) });
      if (t >= 104) { to('palm', [5.6, -14.2], on(t, 104.2, 106.4)); o.brows = 'up'; }
      if (t >= 106.4) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'O', dy: .4 * kick(t, 106.6, 5) });
    }
    // "Hmm… all of you?": puzzled, hand to chin, squinting at the GAMES board
    if (t >= 108.2 && t < 111.2) {
      to('fist', [.8, -16.1], ease(seg(t, 108.3, 108.7)));
      Object.assign(o, { brows: 'quizzical', eyes: t > 109.8 ? 'narrow' : 'open', turn: .3, lookX: .85, lookY: -.55, tilt: .05,
        emote: '?', emoteK: on(t, 108.4, 111.1, .15), mouth: talk ? o.mouth : 'flat' });
    }
    // "Fine. You can play video games.": the sigh
    if (t >= 111.2 && t < 118.0) {
      const sigh = on(t, 111.2, 112.3, .35);
      Object.assign(o, { dy: .7 * sigh, eyes: sigh > .5 ? 'closed' : 'open', brows: 'worried', lookX: 0, turn: 0 });
      const shrug = on(t, 112.1, 114.2);
      o.handL = mix(o.handL, [-5.3, -13.4], shrug); o.handR = mix(o.handR, [5.3, -13.4], shrug);
      if (shrug > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', brows: 'up', mouth: lipFlap(t, talk, 'smile') });
      if (t > 114.2) Object.assign(o, { mouth: 'smirk', eyes: 'happy', brows: 'up' });
    }
    // "…Thirty minutes a day."
    if (t >= 118.0 && t < 124.2) {
      to('point', [5.8, -21.4], on(t, 118.1, 123.8));
      Object.assign(o, { eyes: t > 118.9 ? 'narrow' : 'open', brows: 'up', mouth: lipFlap(t, talk, 'smirk'), turn: 0, lookX: 0, power: .25 * on(t, 118.8, 123.6) });
    }
    // the chuckle, a book tucked under his arm
    if (t >= 124.2) {
      const laugh = Math.abs(Math.sin((t - 124.3) * 9)) * (1 - seg(t, 126.6, 127.2));
      Object.assign(o, { eyes: 'happy', brows: 'up', mouth: talk ? (laugh > .5 ? 'grin' : 'open') : 'grin', dy: .28 * laugh, turn: .05, lookX: .1,
        handL: [-3.0, -11.8], handPoseL: 'fist', handR: [1.8, -9.4], handPoseR: 'fist' });
    }
    return o;
  }

  // ======================================================================================
  // Housam
  // ======================================================================================
  function housamPose(t) {
    const talk = speaking('housam', t);
    const o = { turn: -.22, lookX: -.6, lookY: -.05, brows: 'normal', mouth: lipFlap(t, talk, 'smile', ['smile', 'open', 'grin', 'o']),
      handL: [-2.6, -15.2], handR: [4.2, -12.0], handPoseL: 'open', handPoseR: 'open' };
    const to = (h, p, k) => { o.handR = mix(o.handR, p, k); if (k > .5) o.handPoseR = h; };
    if (!inHall(t)) {
      Object.assign(o, { handL: [-4.4, -12.4], lookX: .4 });
      if (t < 9.9) Object.assign(o, { footR: [2.4, -2.1], handL: [-4.9, -13], handR: [4.8, -13], mouth: 'grin', lookY: .75, lookX: .2, turn: 0, brows: 'focused' });
      else {
        Object.assign(o, { footR: [3.2, -2.5], turn: .28, lookX: .75, lookY: -.3, brows: 'focused', mouth: talk ? o.mouth : 'smirk' });
        to('palm', [5.2, -17.0], on(t, 10.2, 12.4));
        if (t > 12.6) Object.assign(o, { mouth: 'grin', brows: 'up' });
        if (t > 14.9) Object.assign(o, { eyes: 'wide', lookY: -.5 });
      }
      return o;
    }
    // --- the lecture hall: notebook in his left hand, facing Safadi (screen-left) ---
    if (t < 24.8) { if (t > 22) Object.assign(o, { mouth: 'smirk', brows: 'up' }); }
    if (t >= 24.8 && t < 36.8) {
      Object.assign(o, { turn: -.08, lookX: -.2 });
      to('point', [4.6, -24.0], on(t, 25.0, 28.0));
      to('palm', [5.4, -17.0], on(t, 28.2, 31.1)); if (t > 28.2 && t < 31.1) Object.assign(o, { lookY: -.6, lookX: .2 });
      to('point', [4.0, -27.2], on(t, 31.2, 33.8)); if (t > 31.2 && t < 33.8) o.brows = 'up';
      if (t > 34.0) Object.assign(o, { eyes: 'happy', mouth: 'grin', turn: .1, lookX: .3 });
    }
    if (t >= 36.8 && t < 42.2) Object.assign(o, { brows: 'focused', mouth: 'flat' }, nodPose(nod(t, 38.2, 2, .5)));
    if (t >= 42.2 && t < 52.4) {
      Object.assign(o, { turn: -.1, lookX: -.3 });
      to('palm', [5.4, -17.0], on(t, 42.4, 47.8));
      to('point', [4.6, -24.0], on(t, 48.3, 52.2)); if (t > 48.3) Object.assign(o, { eyes: 'wide', brows: 'up' });
    }
    if (t >= 58.6 && t < 63.8) { if (t > 61) Object.assign(o, { brows: 'up', mouth: 'smirk', lookX: -.8 }); }
    if (t >= 63.8 && t < 72) {
      Object.assign(o, { turn: -.05, lookX: -.2 });
      to('point', [4.6, -24.0], on(t, 64.0, 66.3));
      const wide = on(t, 66.4, 70.6);
      o.handR = mix(o.handR, [5.6, -19.0], wide); if (wide > .5) Object.assign(o, { handPoseR: 'palm', eyes: 'wide', brows: 'up', jump: .5 * kick(t, 66.5, 4), lookY: -.4 });
    }
    if (t >= 75.0 && t < 79.4) { to('point', [4.0, -27.2], on(t, 75.2, 79.2)); Object.assign(o, { brows: 'up', turn: -.05, lookX: -.2 }); }
    if (t >= 79.4 && t < 85.4) Object.assign(o, { eyes: t < 82 ? 'wide' : 'open', brows: t < 82 ? 'up' : 'worried', mouth: 'o' });
    if (t >= 85.4 && t < 94) {
      if (t < 87.8) { Object.assign(o, { mouth: talk ? o.mouth : 'smile', brows: 'up' }, nodPose(nod(t, 85.7, 1, .6))); to('palm', [5.2, -14.0], on(t, 85.6, 87.8)); }
      to('palm', [5.4, -17.0], on(t, 88.0, 90.4));
      const sweep = on(t, 90.5, 93.8);
      if (sweep > 0) { to('palm', [5.8, -18.5], sweep); Object.assign(o, { turn: 0, lookX: 0, lookY: -.1, eyes: t > 91.6 ? 'happy' : 'open', mouth: lipFlap(t, talk, 'grin') }); }
    }
    if (t >= 106.4 && t < SCRATCH) Object.assign(o, { mouth: 'grin', eyes: 'happy', brows: 'up' });
    if (celebrating(t)) {
      const hop = Math.abs(Math.sin((t - CHEER) * 5.5));
      Object.assign(o, { jump: 1.6 * hop, handR: [4.1, -25.5], handPoseR: 'fist', turn: 0, lookX: 0 });
    }
    if (deflated(t)) {
      const k = ease(seg(t, SCRATCH, SCRATCH + .5));
      Object.assign(o, { dy: .9 * k, lean: .05 * k, mouth: t < SCRATCH + .6 ? 'o' : 'frown', eyes: t < SCRATCH + .6 ? 'wide' : 'open', brows: 'worried', lookY: .35 * k, lookX: -.1,
        handR: mix([4.1, -25.5], [4.2, -10.4], k), handL: mix([-2.6, -15.2], [-3.4, -11.6], k) });
    }
    return o;
  }

  // ======================================================================================
  // The audience: Alma, Fester, Dragon (outside DCES standing; in the hall seated in row 1)
  // ======================================================================================
  // In the classroom view Safadi (world X −250) is screen-right and Housam screen-left: + side = look screen-right.
  function watch(o, t, amt = .55) { const s = floorSide(t); o.lookX = amt * s; o.turn = .14 * s; }

  function almaPose(t) {
    const talk = speaking('alma', t);
    const o = { turn: 0, lookX: 0, lookY: -.15, brows: 'up', mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']),
      handL: [-2.8, -6.9], handR: [2.8, -6.9], handPoseL: 'open', handPoseR: 'open', hairSwing: .08 * wob(t, .4) };
    if (!inHall(t)) {
      Object.assign(o, { handL: [-3.4, -4.9], handR: [3.4, -4.9], lookX: -.5, turn: -.15 });
      if (t > 6.6 && t < 10) Object.assign(o, { brows: 'worried', mouth: 'o', eyes: 'wide', lookX: -.7 });
      if (t >= 10 && t < 12.6) Object.assign(o, { lookX: -.9, turn: -.3, brows: 'up', mouth: 'o' });
      if (t >= 12.6) Object.assign(o, { eyes: t > 14.9 ? 'star' : 'happy', mouth: 'grin', handL: [-1.1, -11.6], handR: [1.1, -11.6], handPoseL: 'palm', handPoseR: 'palm', jump: .5 * kick(t, 15.1, 4) });
      return o;
    }
    watch(o, t, .6); o.lookY = -.2;
    if (t >= 28 && t < 33.8) o.eyes = 'wide';
    if (t >= 34 && t < 36.8) Object.assign(o, { lookX: -.7, turn: -.2, eyes: 'happy', mouth: 'grin' });      // giggles at Dragon (screen-right is +; Dragon is screen-right)
    // "Like dancing with a partner!": a little sway with sparkles
    if (t >= 52.4 && t < 55.2) Object.assign(o, almaDance(t, 'sway', { bpm: 104, k: .7 }), { power: .55 * on(t, 52.5, 55.1), eyes: 'happy', mouth: lipFlap(t, talk, 'grin'), lookX: 0 });
    if (t >= 55.2 && t < 58.6) {
      Object.assign(o, { lookX: -.8, turn: -.25 });                                     // Fester is screen-left
      if (t > BONK) { const ch = on(t, BONK, 58.2, .15); o.handL = mix(o.handL, [-1.1, -11.6], ch); o.handR = mix(o.handR, [1.1, -11.6], ch); if (ch > .5) Object.assign(o, { handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', mouth: 'O' }); }
      if (t > 58.1) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
    }
    if (t >= 69.6 && t < 75) {
      Object.assign(o, { lookX: .8, turn: .25, lookY: -.1 });
      if (t >= 72.6) { o.handR = mix(o.handR, [4.8, -7.8], on(t, 72.8, 74.9)); o.handPoseR = 'palm'; o.eyes = 'happy'; o.mouth = lipFlap(t, talk, 'grin'); }
    }
    if (t >= 101.4 && t < 104.2) Object.assign(o, { lookX: -.5 + .9 * seg(t, 102, 103.4), eyes: 'open', mouth: 'flat', brows: 'normal', handL: [-.6, -6.2], handR: [.6, -6.2] });
    if (t >= VOTES[0] - .2 && t < CHEER) {
      const up = ease(seg(t, VOTES[0] - .2, VOTES[0] + .1)) * (1 - ease(seg(t, 110.6, 111.2)));
      o.handR = mix(o.handR, [4.4, -12.6], up); if (up > .5) o.handPoseR = 'palm';
      Object.assign(o, { eyes: 'happy', mouth: 'grin', jump: .6 * kick(t, VOTES[0], 4), lookX: .5, turn: .1 });
      if (t > 111.4) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'o' });
    }
    if (celebrating(t)) Object.assign(o, almaDance(t, 'bounce', { bpm: 104, k: ease(seg(t, CHEER, CHEER + .4)) }), { power: ease(seg(t, CHEER, CHEER + .5)), eyes: 'star', mouth: lipFlap(t, talk, 'grin'), lookX: .3 });
    if (deflated(t)) {
      const k = ease(seg(t, SCRATCH, SCRATCH + .4));
      Object.assign(o, { power: 1 - ease(seg(t, SCRATCH, SCRATCH + .35)), eyes: t < SCRATCH + .6 ? 'wide' : 'open', mouth: t < SCRATCH + .6 ? 'O' : lipFlap(t, talk, 'frown', ['frown', 'o', 'frown']),
        brows: 'worried', dy: .6 * k, lookY: .2, lookX: .4, handL: [-2.8, -6.9], handR: [2.8, -6.9], hairSwing: 0 });
    }
    return o;
  }

  function jesterPose(t) {
    const talk = speaking('jester_fester', t);
    const o = { turn: 0, lookX: 0, lookY: 0, brows: 'normal', mouth: lipFlap(t, talk, 'grin'),
      handL: [-3.3, -9.8], handR: [3.3, -9.8], handPoseL: 'open', handPoseR: 'open', hatSway: [.3 * wob(t, .5), 0] };
    if (!inHall(t)) {
      Object.assign(o, { handL: [-3.3, -8.4], handR: [3.3, -8.4], lookX: -.6, turn: -.15 });
      if (t > 6.8 && t < 10.2) Object.assign(o, { mouth: 'O', eyes: 'wide', brows: 'up', emote: '!', emoteK: on(t, 7.3, 9.6, .15), dy: .4 * kick(t, 7.3, 5) });
      if (t >= 10.2 && t < 12.6) Object.assign(o, { lookX: -.9, turn: -.3, mouth: 'o', brows: 'up' });
      if (t >= 12.6) { const ta = ease(seg(t, 12.9, 13.2)); o.handL = mix(o.handL, [-5.3, -15.4], ta); o.handR = mix(o.handR, [5.3, -15.4], ta); Object.assign(o, { eyes: 'happy', brows: 'up', mouth: 'grin', turn: 0 }); }
      return o;
    }
    watch(o, t, .55);
    // "Or juggling with a partner!": ta-da, then the toss… BONK
    if (t >= 54.8 && t < 58.6) {
      const tada = on(t, 54.9, TOSS, .25);
      o.handL = mix(o.handL, [-5.3, -15.4], tada); o.handR = mix(o.handR, [5.3, -15.4], tada);
      Object.assign(o, { lookX: -.1, turn: 0, eyes: 'happy', brows: 'up' });
      const toss = on(t, TOSS - .1, TOSS + .35, .12);
      o.handR = mix(o.handR, [4.4, -19.0], toss); if (toss > .3) o.handPoseR = 'open';
      if (t > TOSS + .2 && t < BONK) Object.assign(o, { lookY: -1, eyes: 'wide', mouth: 'grin', brows: 'up' });
      if (t >= BONK) {
        const bk = kick(t, BONK, 7), dizzy = t > BONK + .2;
        Object.assign(o, { sq: .25 * bk, dy: .8 * bk, eyes: dizzy ? 'swirl' : 'squeeze', mouth: dizzy ? 'wobble' : 'teeth', stars: dizzy ? ease(seg(t, BONK + .2, BONK + .5)) : 0,
          hatAskew: .3, tilt: dizzy ? .1 * Math.sin(t * 5.2) : 0, lookY: 0 });
      }
    }
    if (t >= 69.6 && t < 75) Object.assign(o, { lookX: .7, turn: .2, eyes: t > 71.8 ? 'happy' : 'open', mouth: t > 71.8 ? 'grin' : 'smile' });
    if (t >= 101.4 && t < 104.2) Object.assign(o, { lookX: .5 * Math.sin((t - 101.4) * 2.2), mouth: 'flat', eyes: 'open', emote: t > 102.4 && t < 103.8 ? 'sweat' : null, emoteK: on(t, 102.4, 103.8, .15) });
    if (t >= VOTES[1] - .2 && t < CHEER) {
      const up = ease(seg(t, VOTES[1] - .2, VOTES[1] + .1)) * (1 - ease(seg(t, 110.6, 111.2)));
      o.handL = mix(o.handL, [-5.3, -16.4], up); o.handR = mix(o.handR, [5.3, -16.4], up);
      Object.assign(o, { eyes: 'happy', brows: 'up', mouth: 'grin', dy: -.5 * kick(t, VOTES[1], 4), hatSway: [.8 * Math.sin(t * 9) * up, 0] });
    }
    if (celebrating(t)) {
      const hop = Math.abs(Math.sin((t - CHEER) * 5.2));
      Object.assign(o, { jump: 2.2 * hop, handL: [-5.3, -16.4], handR: [5.3, -16.4], eyes: 'happy', brows: 'up', mouth: 'grin', hatSway: [.8 * Math.sin(t * 10), .4], emote: 'music', emoteK: ease(seg(t, CHEER + .3, CHEER + .6)) });
    }
    if (deflated(t)) {
      const k = ease(seg(t, SCRATCH, SCRATCH + .5));
      Object.assign(o, { hatDroop: k, eyes: t < SCRATCH + .6 ? 'wide' : 'open', mouth: t < SCRATCH + .6 ? 'O' : 'frown', brows: 'worried', dy: .7 * k, lean: .04 * k,
        lookY: .3, lookX: .3, handL: [-3.3, -9.8], handR: [3.3, -9.8], hatSway: [0, 0] });
    }
    return o;
  }

  function dragonPose(t) {
    const talk = speaking('dragon', t);
    const o = { lookX: 0, lookY: -.1, eyes: 'open', mouth: lipFlap(t, talk, 'smile', ['open', 'o', 'grin', 'smile']), wings: .18, flap: 0,
      tailSwing: .4 * wob(t, .5), headTilt: .06 * Math.sin(t * .4), noShadow: inHall(t) };
    if (!inHall(t)) {
      Object.assign(o, { lookX: -.6, headTilt: -.08 });
      if (t > 6.8 && t < 10.2) Object.assign(o, { eyes: 'wide', mouth: 'o', brows: 'up', question: on(t, 7.4, 10, .2) });
      if (t >= 10.2 && t < 12.6) Object.assign(o, { lookX: -.9, eyes: 'wide' });
      if (t >= 12.6) Object.assign(o, { eyes: 'happy', mouth: 'grin', wings: lerp(.18, .7, ease(seg(t, 13, 13.6))), flap: .5 * wob(t, 2.2) * seg(t, 13, 13.6), jump: .8 * Math.abs(Math.sin((t - 13) * 4)) * seg(t, 13, 13.4) });
      return o;
    }
    watch(o, t, .55); o.headTilt += .08 * floorSide(t);
    if (t >= 33.9 && t < 36.8) Object.assign(o, { eyes: 'happy', mouth: lipFlap(t, talk, 'grin'), cheeks: true, headTilt: .15, lookX: 0 });
    if (t >= 52.4 && t < 58.6) Object.assign(o, { lookX: -.7, headTilt: -.12, eyes: t > BONK ? 'wide' : 'happy', mouth: t > BONK ? 'o' : 'smile' });  // watching Alma, then Fester (both screen-left)
    if (t >= 69.6 && t < 75) {
      Object.assign(o, { question: on(t, 69.8, 72.4, .2), headTilt: .16, lookY: -.55, lookX: .2, mouth: lipFlap(t, talk, 'smile') });
      if (t >= 72.8) Object.assign(o, { question: 0, lookX: -.7, lookY: 0, eyes: 'happy', cheeks: true, mouth: 'grin' });
    }
    if (t >= 101.4 && t < 104.2) {
      const half = on(t, 102.3, 103.5, .3);
      Object.assign(o, { wings: lerp(.18, .5, half), lookX: half > .3 ? -.7 : .3, eyes: half > .3 ? 'wide' : 'open', mouth: 'smile' });
    }
    if (t >= VOTES[2] - .2 && t < CHEER) {
      const up = ease(seg(t, VOTES[2] - .2, VOTES[2] + .15)) * (1 - ease(seg(t, 110.6, 111.2)));
      Object.assign(o, { wings: lerp(.18, 1, up), flap: .6 * wob(t, 2.6) * up, jump: 1.2 * kick(t, VOTES[2], 4), eyes: 'happy', mouth: 'grin', lookX: .4 });
    }
    if (celebrating(t)) {
      const k = ease(seg(t, CHEER, CHEER + .6));
      Object.assign(o, dragonFlight(t, { speed: 2.6, lift: 8 * k }), { eyes: 'happy', mouth: 'grin', cheeks: true, lookX: .2 });
      o.fly *= k; o.wings = lerp(.2, o.wings ?? 1, k);
    }
    if (deflated(t)) {
      const air = celebrating(SCRATCH - 1e-3) ? 1 : 0, drop = seg(t, SCRATCH + .15, SCRATCH + .5), k = ease(seg(t, SCRATCH, SCRATCH + .4));
      const f = dragonFlight(SCRATCH, { speed: 2.6, lift: 8 });
      Object.assign(o, { jump: (f.jump ?? 5) * (1 - drop * drop) * air, fly: (f.fly ?? 1) * (1 - drop), wings: lerp(.9, .08, k), flap: 0,
        sq: .25 * kick(t, SCRATCH + .5, 6), eyes: t < SCRATCH + .6 ? 'wide' : 'open', mouth: t < SCRATCH + .6 ? 'o' : 'pout', lookY: .5, lookX: .2, headTilt: -.12 });
    }
    return o;
  }

  // ======================================================================================
  // Callouts
  // ======================================================================================
  // anchors: { speaker: { x, y, dx, dy } }. A speaker missing from the shot talks from off-screen (edge fallback).
  function drawLines(t, anchors, off = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < -.05 || age > 12) continue;
      const a = anchors[l.speaker] ?? off[l.speaker] ?? off.default;
      if (!a) continue;
      callout(l.text, a.x, a.y, age, { dx: a.dx, dy: a.dy, size: a.size ?? 48, maxW: a.maxW ?? 600, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] });
    }
  }
  const mouthAt = (c, dx, dy, ox = 0, oy = 0, extra = {}) => c && ({ x: c.A.mouth[0] + ox * c.s, y: c.A.mouth[1] + oy * c.s, dx, dy, ...extra });

  // ======================================================================================
  // Shots
  // ======================================================================================
  const put = (P, p, rig, unit, o) => { const [sx, sy, k] = P.p(p.x, p.y ?? 0, p.z), s = unit * k; return { A: rig(sx, sy, s, o), s, sx, sy }; };

  // ---------- outside DCES ----------
  function dcesShot(t, cam, blur) {
    const P = persp(cam);
    layer(() => D.back(P, t, { splitZ: 2139, wind: .8 }), { blur });
    const RIG = { housam: [housam, HOUSAM_UNIT, housamPose], safadi: [safadi, SAFADI_UNIT, safadiPose], alma: [alma, ALMA_UNIT, almaPose],
      jester_fester: [jester, JF_UNIT, jesterPose], dragon: [dragon, DRAGON_UNIT, dragonPose] };
    const C = {};
    Object.keys(OUT).sort((a, b) => OUT[b].z - OUT[a].z).forEach(id => {
      const [rig, unit, pose] = RIG[id], c = put(P, OUT[id], rig, unit, pose(t)); C[id] = c;
      if (id === 'housam') {
        const kick9 = t < 9.9;                                              // keepy-uppy, then he traps the ball under his foot
        const h = kick9 ? 2.1 + 2.1 * Math.abs(Math.sin(t * 3.1)) : 1.35;
        housamBall(c.sx + (kick9 ? 3.7 : 3.4) * c.s, c.sy - h * c.s, c.s, { spin: kick9 ? t * 4 : 9.9 * 4 });
      }
      if (id === 'safadi') bookStack(c.A.handL[0] + .6 * c.s, c.A.handL[1] + 1.2 * c.s, c.s * .95, 5, t);
    });
    D.front(P, t, { splitZ: 2139, wind: .8 });
    sfx('THUD!', C.safadi.A.handL[0] - 120, C.safadi.A.handL[1] - 40, 62, PAL.goldLt, t - 5.6, { life: .7, rot: -.12 });
    drawLines(t, {
      safadi: mouthAt(C.safadi, 150, -290, 1.4, -.8, { maxW: 560 }),
      housam: mouthAt(C.housam, 170, -270, 1.2, -.6, { maxW: 480 }),
    });
    // Safadi's power flares… flash… into the lecture hall
    flash(ease(seg(t, 16.6, HALL_AT)));
  }
  function dcesCam(t) {
    const z = t < 10 ? lerp(1540, 1630, ease(seg(t, 0, 10))) : lerp(1840, 1880, ease(seg(t, 10, HALL_AT)));
    const x = t < 10 ? 60 : lerp(-195, -180, seg(t, 10, HALL_AT)), y = 140, f = 1000, feet = t < 10 ? 1010 : 1050;
    return { x, y, z, f, hy: feet - y * f / (2170 - z) };
  }
  const dcesWide = t => dcesShot(t, dcesCam(t), .6);
  const dcesTwo = t => dcesShot(t, dcesCam(t), 2.2);

  // ---------- the stage (podium view) ----------
  // Lock the stage floor (at Z 1990) to screen y `feet` while the camera drifts.
  function podium(x, z, f, camY, feet) { const k = f / (SAF.z - z); return { x, y: camY, z, f, hy: feet - (camY - FLOOR) * k }; }
  function stageShot(t, cam, blur, frame) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { ...HALL_O, splitZ: SAF.z }), { blur });
    const hp = housamPose(t), h = put(P, HOU, housam, HOUSAM_UNIT, hp);
    housamNotebook(h.A.handL[0] + .1 * h.s, h.A.handL[1] - 1.15 * h.s, h.s, { ang: -.12 + .06 * Math.sin(t * .8) });
    const sf = put(P, SAF, safadi, SAFADI_UNIT, safadiPose(t));
    HALL.front(P, t, { splitZ: SAF.z });
    // the books: stacked on the lectern top; at the end one rides under Safadi's arm
    const [lx, ly, lk] = P.p(HALL.LECTERN.x + 10, 118, (HALL.LECTERN.z0 + HALL.LECTERN.z1) / 2);
    bookStack(lx, ly, lk * 5.4, t >= 124.2 ? 4 : 5, t);
    if (t >= 124.2) book(sf.A.handL[0] + .4 * sf.s, sf.A.handL[1] - 1.2 * sf.s, sf.s * .95, -.25);
    gamepad((sf.A.handL[0] + sf.A.handR[0]) / 2, (sf.A.handL[1] + sf.A.handR[1]) / 2 - .4 * sf.s, sf.s, t, on(t, 21.9, 24.6, .25));
    botwIcons(h.A.handL[0] - 9 * h.s, h.A.handL[1] + 4 * h.s, h.s, t);   // to his left, clear of his face
    flash(1 - ease(seg(t, HALL_AT, HALL_AT + .6)));
    return { P, sf, h, frame };
  }
  const EDGE_L = { x: -40, y: 560, dx: 330, dy: -300 }, EDGE_R = { x: W + 40, y: 560, dx: -330, dy: -300 }, BOTTOM = { x: W / 2, y: H + 60, dx: 0, dy: -300 };
  function wideShot(t, cam, blur = .8) {
    const { sf, h } = stageShot(t, cam, blur);
    drawLines(t, { safadi: mouthAt(sf, 110, -250, 1.2, -.6, { size: 44, maxW: 520 }), housam: mouthAt(h, -110, -250, -1, -.6, { size: 44, maxW: 520 }) }, { default: BOTTOM });
    return { sf, h };
  }
  function safadiMed(t, cam, blur = 2) {
    const { sf } = stageShot(t, cam, blur);
    drawLines(t, { safadi: mouthAt(sf, 360, -110, 3.4, -.3, { size: 50, maxW: 600 }) }, { housam: EDGE_R, default: BOTTOM });
    if (t >= 118.0) limitCard(sf.A.handR[0] + 400, sf.A.handR[1] + 230, t);
    return sf;
  }
  function housamMed(t, cam, blur = 2) {
    const { h } = stageShot(t, cam, blur);
    drawLines(t, { housam: mouthAt(h, -360, -110, -2.8, -.3, { size: 50, maxW: 600 }) }, { safadi: EDGE_L, default: BOTTOM });
    quadrillion(t);
    return h;
  }

  // ---------- the audience (classroom view, row 1) ----------
  function classroom(x, z, f, camY, eyes) { const k = f / (z - ALM.z); return { x, y: camY, z, f, hy: eyes - (camY - 205) * k, dir: -1 }; }
  function audienceShot(t, cam, blur = 2.2) {
    const P = persp(cam);
    layer(() => HALL.back(P, t, { ...HALL_O, splitZ: ALM.z }), { blur });
    const d = put(P, DRG, dragon, DRAGON_UNIT, dragonPose(t));
    const j = put(P, FES, jester, JF_UNIT, jesterPose(t));
    const a = put(P, ALM, alma, ALMA_UNIT, almaPose(t));
    HALL.front(P, t, { splitZ: ALM.z });
    // Fester's ball: up from his hand, down onto his hat, then off toward the aisle
    if (t >= TOSS && t < BONK + 1.4) {
      const r = BALL_R * j.s * 1.2, tip = j.A.hatTip, hand = [j.A.head[0] + 5 * j.s, j.A.head[1] - 1 * j.s];
      let bx, by;
      if (t < BONK) { const f = seg(t, TOSS, BONK); bx = lerp(hand[0], tip[0], f); by = lerp(hand[1], tip[1] - r, f) - 9 * j.s * 4 * f * (1 - f); }
      else { const u = t - BONK; bx = tip[0] + 260 * u; by = tip[1] - r - 520 * u + 900 * u * u; }
      jugglerBall(bx, by, r, JUGGLE_COLS[0], t * 7);
      sfx('BONK!', tip[0] + 150, tip[1] - 70, 96, PAL.goldLt, t - BONK, { life: .8, rot: .12 });
    }
    // off-screen debaters: Safadi from bottom-right, Housam from bottom-left
    drawLines(t, {
      alma: mouthAt(a, -40, -300, 0, -.6, { maxW: 520 }),
      jester_fester: mouthAt(j, -120, -290, -1, -.6, { maxW: 520 }),
      dragon: mouthAt(d, 60, -300, .5, -.6, { maxW: 520 }),
    }, { safadi: { x: W - 260, y: H + 80, dx: -60, dy: -290 }, housam: { x: 260, y: H + 80, dx: 60, dy: -290 } });
    if (t >= 101.4 && t < 104.2) sfx('chirp… chirp…', W / 2, 130, 44, '#CFE8B8', t - 101.6, { life: 2.3, rot: -.04 });
    if (t >= SCRATCH && t < SCRATCH + 1) sfx('SCRRRATCH!', W / 2, 180, 110, '#FF6B6B', t - SCRATCH, { life: .9, rot: -.08 });
    return { a, j, d, P };
  }

  // ======================================================================================
  // Cameras and the shot list
  // ======================================================================================
  const WIDE = t => ({ x: 20 * Math.sin(t * .05), y: 150, z: 1450 + 10 * Math.sin(t * .07), f: 1000, hy: 0 });
  const wideCam = (t, zOff = 0) => { const c = WIDE(t); c.z += zOff; const k = c.f / (SAF.z - c.z); c.hy = 1065 - (c.y - FLOOR) * k; return c; };
  const safCam = (t, a, b, z0 = 1470, z1 = 1500) => podium(-120 + 8 * Math.sin(t * .2), lerp(z0, z1, ease(seg(t, a, b))), 1500, 215, 1060);
  const houCam = (t, a, b, z0 = 1470, z1 = 1500) => podium(120 + 8 * Math.sin(t * .2), lerp(z0, z1, ease(seg(t, a, b))), 1500, 215, 1060);
  const audCam = (t, a, b, z0 = 1760, z1 = 1790) => classroom(8 * Math.sin(t * .2), lerp(z0, z1, ease(seg(t, a, b))), 1300, 190, 440);

  const wide = (a, b, zOff = 0) => t => wideShot(t, wideCam(t, zOff));
  const sMed = (a, b) => t => safadiMed(t, safCam(t, a, b));
  const hMed = (a, b) => t => housamMed(t, houCam(t, a, b));
  const aud = (a, b) => t => audienceShot(t, audCam(t, a, b));
  // the scratch: a punch-in on the audience, then "Awww…" (all four voices; one bubble, from Alma)
  const deflate = t => {
    const punch = 1 + .06 * easeOut(seg(t, SCRATCH, SCRATCH + .2));
    camBegin(W / 2, H / 2, punch, 0);
    const r = audienceShot(t, audCam(t, SCRATCH, 123.9, 1800, 1830));
    camEnd();
    return r;
  };
  // the final two-shot: Housam slumped, Safadi chuckling; iris out on Safadi
  const finale = t => {
    const { sf } = stageShot(t, podium(lerp(-40, -80, ease(seg(t, 123.9, 128))), lerp(1440, 1480, ease(seg(t, 123.9, 128))), 1150, 230, 1040), 1.4);
    drawLines(t, { safadi: mouthAt(sf, 260, -240, 1.6, -.6, { size: 50, maxW: 560 }) }, {});
    iris(sf.A.head[0], sf.A.head[1], lerp(1900, 0, easeIn(seg(t, 126.7, 127.9))));
  };

  scene({ duration: 128, fps: 24, bpm: 104,                // id, title, dialogue, music: see asset.js
    shots: [
      [0, dcesWide], [10, dcesTwo],
      [HALL_AT, wide()], [21.6, sMed(21.6, 24.8)], [24.8, hMed(24.8, 32.3)], [32.3, wide(0, 0, -40)], [33.9, aud(33.9, 36.8)],
      [36.8, sMed(36.8, 40.8)], [40.8, wide()], [42.2, hMed(42.2, 51.3)], [51.3, wide(0, 0, -40)], [52.4, aud(52.4, 58.6)],
      [58.6, sMed(58.6, 62.4)], [62.4, wide()], [63.8, hMed(63.8, 69.6)], [69.6, aud(69.6, 75)], [75, wide(0, 0, -40)],
      [79.4, sMed(79.4, 85.4)], [85.4, wide()], [94, sMed(94, 101.4)], [101.4, aud(101.4, 104)], [104, sMed(104, 106)],
      [106, aud(106, 108.2)], [108.2, wide(0, 0, 60)], [111.2, sMed(111.2, 113.8)], [113.8, aud(113.8, 117.9)],
      [117.9, sMed(117.9, SCRATCH)], [SCRATCH, deflate], [123.9, finale],
    ] });
})();
