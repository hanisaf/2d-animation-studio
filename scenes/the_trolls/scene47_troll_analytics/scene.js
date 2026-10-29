// Scene 47: "Troll Analytics". The Trolls, episode three. In his study (desk view, afternoon) Professor Safadi reads a fan
// letter while Doctor Sami looks over his shoulder. He opens his YouToon Studio analytics: 21 views. Then he scrolls, and the
// Tongue Twister videos have millions. Silly sells. The plan: Alma's monster drawings, monster costumes, and tongue-twister
// challenges at school. "That is the silliest thing I heard in ages!" "Exactly." To be continued.
// The fan letter and Alma's drawing are the real pictures (in this folder); the analytics screens are drawn in code.
// Every shot is a pure function of t.
(() => {
  const SST = LOCATIONS.safadi_study, ME = ASSETS.scene.scene47_troll_analytics, LINES = ME.dialogue;
  const ACCENT = { safadi: '#C08A3E', sami: '#3E9C74' };
  const UNIT = { safadi: SAFADI_UNIT, sami: SAMI_UNIT }, RIG = { safadi, sami };
  const img = f => { const i = new Image(); i.src = `${ME.dir}/${f}`; return i; };
  const LETTER = img('fan_letter.webp'), MONSTERS = img('alma_monsters.jpg');
  const ready = i => i.complete && i.naturalWidth > 0;

  // ---------- timing (from the tagged dialogue lines) ----------
  const LINE = tag => LINES.find(l => l.tag === tag), AT = tag => LINE(tag).at;
  const lineDur = l => .25 + l.text.replace(/\*/g, '').length / l.cps + l.hold;
  const typed = l => l.at + .2 + l.text.replace(/\*/g, '').length / l.cps;
  const endOf = tag => LINE(tag).at + lineDur(LINE(tag));
  const LETTER_IN = [2.4, AT('mail') - .3];                                     // the fan letter, full frame
  const LAP1 = [endOf('many') + .5, AT('handful') - .4];                         // analytics for one video: 21 views
  const LAP2 = [endOf('handful') + .4, AT('silly') - .4];                        // channel content, scrolling to the hits
  const SCROLL = [LAP2[0] + .6, LAP2[0] + 5.2], HITS = SCROLL[1];
  const PULL = [endOf('plan'), AT('monsters') - .2];                             // the drawing comes out of the drawer
  const DRAW_IN = [typed(LINE('monsters')) + .3, AT('imagine') - .3];            // Alma's drawing, full frame: time to look
  const IDEA = AT('imagine'), EXACT = AT('exactly'), FREEZE = endOf('exactly') + 1.0, END = FREEZE + 6.4;

  // ---------- helpers ----------
  const inW = (t, a, b) => t > a && t < b;
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const speaking = (who, t) => LINES.some(l => l.speaker === who && t > l.at + .2 && t < typed(l));
  const sayingLine = (tag, t) => inW(t, AT(tag), endOf(tag));

  // ---------- blocking (desk view: the twins behind the desk, the laptop on screen-left) ----------
  const POS = { safadi: [-55, 930], sami: [95, 958] };
  const holdingLetter = t => t < LAP1[0] - .5;
  const holdingDrawing = t => t > PULL[0] + .5 && t < DRAW_IN[1];

  function safadiPose(t) {
    const talk = speaking('safadi', t), say = m => talk ? lipFlap(t, true, m) : m;
    const o = { dy: 1.2, mouth: say('smile'), brows: 'normal', eyes: 'open', lookX: .6, lookY: .1, handL: [-4.4, -13.5], handR: [4.4, -13.5], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (talk) set({ brows: 'up', handR: [5.0, -18.5 + .4 * Math.sin(t * 7)], handPoseR: 'palm' });
    if (holdingLetter(t)) set({ handL: [-3.0, -19.5], handR: [3.0, -19.5], handPoseL: 'fist', handPoseR: 'fist', lookX: 0, lookY: .5, eyes: t < AT('mail') ? 'happy' : 'open', brows: 'up', tilt: .04 * Math.sin(t * .9) });
    if (holdingLetter(t) && t > AT('mail') - .3) set({ handL: [-3.4, -11], handR: [3.4, -11], lookX: t > AT('many') ? .6 : 0, lookY: .1 });   // lowers the letter to talk
    // at the laptop: typing, scrolling
    if (inW(t, endOf('many'), AT('silly'))) { const tap = Math.sin(t * 14);
      set({ handL: [-6.4, -15.4 + .25 * tap], handR: [-2.6, -15.2 - .25 * tap], handPoseL: 'fist', handPoseR: 'fist', lookX: -.7, lookY: .6, turn: -.15, mouth: 'smile', brows: 'up' }); }
    if (inW(t, AT('handful') - .4, endOf('handful') + .4)) set({ mouth: 'frown', brows: 'worried', eyes: 'open', lookX: .5, lookY: .1, dy: 1.4 });   // ouch
    if (inW(t, AT('silly') - .4, AT('silly') + 1.2)) set({ eyes: 'wide', brows: 'up', mouth: say('o'), lookX: .6 });
    if (inW(t, AT('double'), endOf('double'))) set({ handR: [5.6, -22 - .8 * kick(t, AT('double') + .2, 3)], handPoseR: 'fist', brows: 'focused', eyes: 'open', mouth: say('grin'), jump: .3 * kick(t, AT('double') + .2, 6) });   // fist up
    // the drawing: out of the drawer and up for Sami
    if (inW(t, PULL[0], PULL[1] + .5)) { const u = ease(seg(t, PULL[0], PULL[1]));
      set({ handL: [-3.4, lerp(-10, -19.5, u)], handR: [3.4, lerp(-10, -19.5, u)], handPoseL: 'fist', handPoseR: 'fist', lookY: lerp(.8, .3, u), lookX: 0, mouth: 'smirk', brows: 'up' }); }
    if (holdingDrawing(t) && t > PULL[1]) set({ handL: [-3.4, -19.5], handR: [3.4, -19.5], handPoseL: 'fist', handPoseR: 'fist', lookX: .6 });
    // the idea
    if (inW(t, IDEA - .4, endOf('imagine'))) set({ bulb: ease(seg(t, IDEA - .4, IDEA - .1)) * (1 - seg(t, endOf('imagine') - .4, endOf('imagine'))), eyes: t < IDEA + .4 ? 'wide' : 'happy', brows: 'up', jump: .3 * kick(t, IDEA - .4, 6) });
    if (inW(t, endOf('imagine'), EXACT)) set({ mouth: 'smirk', eyes: 'happy', brows: 'up', lookX: .7 });
    if (t > EXACT) { const w = Math.sin(t * 9) > .3; set({ mouth: talk ? say('smirk') : 'smirk', eyes: t > typed(LINE('exactly')) ? 'narrow' : 'open', brows: w ? 'up' : 'quizzical', lookX: .2, lookY: 0, handL: [-1.8, -14.5], handR: [1.8, -14.5], handPoseL: 'fist', handPoseR: 'fist', tilt: -.04 }); }   // fingers steepled, eyebrows going
    return o;
  }
  function samiPose(t) {
    const talk = speaking('sami', t), say = m => talk ? lipFlap(t, true, m) : m;
    const o = { mouth: say('smile'), brows: 'normal', eyes: 'open', lookX: -.6, lookY: .3, lean: .04, handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open' };
    const set = p => Object.assign(o, p);
    if (talk) set({ brows: 'up', handR: [5.3, -12.6 + .4 * Math.sin(t * 7)], handPoseR: 'palm' });
    if (holdingLetter(t) && !talk) set({ lookX: -.7, lookY: .5, lean: .08, eyes: 'happy' });
    if (sayingLine('many', t)) set({ handL: [-5.3, -12.4], handR: [5.3, -12.4], handPoseL: 'palm', handPoseR: 'palm', eyes: 'wide', brows: 'up', mouth: say('grin'), jump: .3 * kick(t, AT('many'), 6) });
    if (inW(t, endOf('many'), AT('handful'))) set({ lookX: -.85, lookY: .6, lean: .12, handR: [.8, -16.1], handPoseR: 'fist', brows: 'quizzical', mouth: 'flat' });   // squinting at the screen
    if (inW(t, AT('handful') - .2, endOf('handful') + .5)) set({ handL: [-1.6, -11], handR: [1.6, -11], handPoseL: 'fist', handPoseR: 'fist', brows: 'worried', mouth: say('frown'), eyes: 'open', lookX: -.5, lookY: .2, dy: .3, tilt: .05 });
    if (inW(t, endOf('handful') + .5, AT('silly'))) set({ lookX: -.85, lookY: .6, lean: .12, brows: 'worried', mouth: 'flat' });
    if (inW(t, AT('silly'), AT('silly') + 2)) set({ eyes: 'wide', brows: 'up', mouth: 'o', lookX: -.6, lookY: .1 });
    if (sayingLine('plan', t)) set({ handL: [-4.6, -15.6], handR: [4.6, -15.6], handPoseL: 'palm', handPoseR: 'palm', brows: 'up' });
    if (holdingDrawing(t) && !talk) set({ lookX: -.6, lookY: .3, lean: .1, eyes: 'happy', mouth: 'grin', brows: 'up' });
    if (sayingLine('cute', t)) set({ handL: [-1.2, -18.4], handR: [1.2, -18.4], handPoseL: 'open', handPoseR: 'open', eyes: 'happy', brows: 'up', tilt: .08 });
    if (inW(t, IDEA, endOf('imagine'))) set({ lookX: -.7, lookY: .1, eyes: 'wide', brows: 'up', mouth: 'o', lean: -.04 * seg(t, IDEA + 2, endOf('imagine')) });
    if (sayingLine('silliest', t)) { const b = Math.abs(Math.sin(t * 10)); set({ handL: [-5.6, -20], handR: [5.6, -20], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', brows: 'up', mouth: say('grin'), dy: -.2 * b, tilt: .05 * Math.sin(t * 5) }); }
    if (t > EXACT) set({ mouth: 'smirk', eyes: 'narrow', brows: Math.sin(t * 9 + 1) > .3 ? 'up' : 'quizzical', lookX: -.3, lookY: 0, lean: .02, handL: [-1.8, -11], handR: [1.8, -11], handPoseL: 'fist', handPoseR: 'fist', tilt: .04 });   // rubbing his hands
    if (t > EXACT && t < typed(LINE('exactly'))) set({ eyes: 'wide', lookX: -.7 });
    return o;
  }

  // ---------- props in hand ----------
  function paperProp(image, A, s, t, w, back) {                                 // a sheet held up in both hands, picture side to the camera
    const a = A.handL, b = A.handR, cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - .4 * s, h = w * (image.naturalHeight / image.naturalWidth || 1.3);
    X.save(); X.translate(cx, cy); X.rotate(.03 * Math.sin(t * 1.7));
    shape(rectPts(-w / 2 + .25 * s, -h * .7 + .3 * s, w, h), { fill: 'rgba(59,37,48,.25)', stroke: null });
    shape(rectPts(-w / 2, -h * .7, w, h), { fill: back, stroke: PAL.ink, lwPx: 2.5 });
    if (ready(image)) { X.save(); X.beginPath(); X.rect(-w / 2, -h * .7, w, h); X.clip(); X.drawImage(image, -w / 2, -h * .7, w, h); X.restore(); }
    shape(rectPts(-w / 2, -h * .7, w, h), { fill: null, stroke: PAL.ink, lwPx: 2.5 });
    X.restore();
  }

  // ---------- the stage ----------
  const SSET = { night: 0, lamp: .7, fire: 1 };
  function stage(t, cam, blur) {
    const P = persp(cam), A = {}, S = {}, o = { ...SSET, splitZ: 925 };
    layer(() => SST.back(P, t, o), { blur });
    for (const name of ['sami', 'safadi']) {                                    // far to near
      const [x, z] = POS[name], [sx, sy, k] = P.p(x, 0, z), s = UNIT[name] * k;
      A[name] = RIG[name](sx, sy, s, { ...(name === 'safadi' ? safadiPose(t) : samiPose(t)), t }); S[name] = s;
    }
    SST.front(P, t, o);
    if (holdingLetter(t)) paperProp(LETTER, A.safadi, S.safadi, t, 5.4 * S.safadi, '#F4F2EC');
    if (holdingDrawing(t) && t > PULL[0] + .9) paperProp(MONSTERS, A.safadi, S.safadi, t, 6.4 * S.safadi, '#FFFFFF');
    return { A, S, P };
  }
  function bubbles(t, A, S) {
    for (const l of LINES) {
      const age = t - l.at; if (age < 0 || age > 9) continue;
      const a = A[l.speaker], s = S[l.speaker], c = { size: 50, maxW: 640, cps: l.cps, hold: l.hold, accent: ACCENT[l.speaker] };
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) { const side = l.speaker === 'sami' ? 1 : -1; callout(l.text, a.mouth[0] + side * 7 * s, a.mouth[1] - .6 * s, age, { ...c, dx: side * 260, dy: -230 }); }
    }
  }
  // over an insert the speaker is off screen: the tail points out of the frame toward them
  function offBubbles(t) {
    for (const l of LINES) {
      const age = t - l.at; if (age < 0 || age > 9) continue;
      const right = l.speaker === 'sami';
      callout(l.text, right ? W - 120 : 120, H + 80, age, { size: 50, maxW: 640, cps: l.cps, hold: l.hold, accent: ACCENT[l.speaker], dx: right ? -320 : 320, dy: -260 });
    }
  }

  // ---------- inserts: the letter and the drawing, full frame ----------
  function paperInsert(t, image, a, b, o) {
    X.fillStyle = o.bg; X.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { const x = hash(i) * W, y = hash(i + 50) * H; circle(x, y, 2 + 3 * hash(i + 9), { fill: o.speck, stroke: null }); }
    const u = ease(seg(t, a, b)), h = H * o.scale, w = h * (image.naturalWidth / image.naturalHeight || .75);
    const pan = lerp(o.pan[0], o.pan[1], u) * h, zoom = lerp(o.zoom[0], o.zoom[1], u);
    X.save(); X.translate(W / 2, H / 2); X.rotate(o.rot + .006 * Math.sin(t * 1.3)); X.scale(zoom, zoom); X.translate(0, -pan);
    shape(rectPts(-w / 2 + 14, -h / 2 + 18, w, h), { fill: 'rgba(40,25,30,.35)', stroke: null });
    if (ready(image)) X.drawImage(image, -w / 2, -h / 2, w, h); else shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#FBF8EE', stroke: null });
    shape(rectPts(-w / 2, -h / 2, w, h), { fill: null, stroke: PAL.ink, lwPx: 5 });
    X.restore();
    flash(1 - seg(t, a, a + .25));
  }
  const letterShot = t => {
    paperInsert(t, LETTER, LETTER_IN[0], LETTER_IN[1], { bg: '#5B3A2A', speck: 'rgba(255,220,170,.06)', scale: 1.9, pan: [-.24, .22], zoom: [1, 1.04], rot: -.02 });
    for (let i = 0; i < 3; i++) { const age = t - (8.2 + i * .6); if (age > 0 && age < 2) overlay(() => {   // little hearts rise from the red one on the page
      X.save(); X.globalAlpha = 1 - age / 2; X.translate(W * .52 + 80 * Math.sin(age * 3 + i), H * .55 - 160 * age); X.scale(1.4, 1.4);
      shape([[0, 8], [-14, -4], [-8, -14], [0, -8], [8, -14], [14, -4]], { fill: '#E5466E', stroke: PAL.ink, lwPx: 2, smooth: .5 }); X.restore(); }); }
  };
  const drawingShot = t => {
    paperInsert(t, MONSTERS, DRAW_IN[0], DRAW_IN[1], { bg: '#3F5A7A', speck: 'rgba(255,255,255,.06)', scale: 1.02, pan: [0, 0], zoom: [1, 1.12], rot: .015 });
    for (let i = 0; i < 6; i++) { const ph = frac(t * .7 + i / 6), a = i / 6 * TAU + t * .3;   // a sparkle or two
      shape(starPts(W / 2 + Math.cos(a) * 470, H / 2 + Math.sin(a) * 420, 16 * Math.sin(ph * Math.PI), .4, 4, 0), { fill: '#FFE45C', stroke: null }); }
    offBubbles(t);
  };

  // ---------- the YouToon Studio screens (drawn in code) ----------
  const UI = { bg: '#FFFFFF', panel: '#F2F2F2', line: '#E3E3E3', ink: '#0F0F0F', grey: '#606060', brand: '#7B4DD8', accent: '#6C5CE7', good: '#1E9E4A' };
  const font = (px, w = 500) => `${w} ${px}px ${FONT_TALK}`;
  function txt(s, x, y, px, col = UI.ink, w = 500, align = 'left') { X.font = font(px, w); X.fillStyle = col; X.textAlign = align; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  const fmt = n => n.toLocaleString('en-US');
  // a laptop filling the frame; the screen area is SCR (screen px)
  const SCR = { x: 150, y: 70, w: 1620, h: 900 };
  function laptopFrame(t, drawScreen) {
    X.fillStyle = '#2A1F1B'; X.fillRect(0, 0, W, H);
    shape(rectPts(SCR.x - 46, SCR.y - 46, SCR.w + 92, SCR.h + 92), { fill: '#1C1C1E', stroke: PAL.ink, lwPx: 6, smooth: .04 });
    X.save(); X.beginPath(); X.rect(SCR.x, SCR.y, SCR.w, SCR.h); X.clip(); X.translate(SCR.x, SCR.y);
    X.fillStyle = UI.bg; X.fillRect(0, 0, SCR.w, SCR.h); drawScreen(t);
    X.restore();
    shape([[0, H], [70, SCR.y + SCR.h + 60], [W - 70, SCR.y + SCR.h + 60], [W, H]], { fill: '#B9BEC4', stroke: PAL.ink, lwPx: 5 });   // the keyboard deck
    X.fillStyle = 'rgba(255,255,255,.05)'; X.beginPath(); X.moveTo(SCR.x, SCR.y); X.lineTo(SCR.x + 500, SCR.y); X.lineTo(SCR.x + 200, SCR.y + SCR.h); X.lineTo(SCR.x, SCR.y + SCR.h); X.fill();   // glass glare
  }
  function topBar() {
    X.fillStyle = UI.bg; X.fillRect(0, 0, SCR.w, 76); line([[0, 76], [SCR.w, 76]], { stroke: UI.line, lwPx: 2 });
    for (let i = 0; i < 3; i++) X.fillRect(30, 26 + i * 10, 26, 4);
    circle(108, 38, 20, { fill: UI.brand, stroke: null }); shape([[100, 27], [100, 49], [119, 38]], { fill: '#FFFFFF', stroke: null });   // the YouToon logo: a film-reel circle
    txt('YouToon', 138, 38, 30, UI.ink, 700); txt('Studio', 262, 38, 30, UI.brand, 700);
    shape(rectPts(SCR.w - 300, 16, 150, 44), { fill: null, stroke: UI.line, lwPx: 2, smooth: .5 }); txt('+ Create', SCR.w - 225, 38, 22, UI.ink, 600, 'center');
    circle(SCR.w - 90, 38, 22, { fill: '#C08A3E', stroke: null }); txt('S', SCR.w - 90, 39, 24, '#FFFFFF', 700, 'center');
  }
  function thumb(x, y, w, h, hue, dur, hot) {
    shape(rectPts(x, y, w, h), { fill: `hsl(${hue},55%,${hot ? 62 : 72}%)`, stroke: null, smooth: .06 });
    shape(rectPts(x, y + h * .62, w, h * .38), { fill: `hsl(${hue + 20},45%,${hot ? 48 : 58}%)`, stroke: null });
    circle(x + w * .35, y + h * .5, h * .18, { fill: '#F3C6A8', stroke: null }); circle(x + w * .65, y + h * .52, h * .16, { fill: '#F3C6A8', stroke: null });
    shape(rectPts(x + w - 70, y + h - 30, 62, 24), { fill: 'rgba(0,0,0,.75)', stroke: null, smooth: .2 }); txt(dur, x + w - 39, y + h - 18, 17, '#FFFFFF', 600, 'center');
  }
  // insert 1: analytics for one video (Screen Time 3 · Game Over!)
  function analyticsScreen(t) {
    const t0 = LAP1[0]; topBar();
    X.fillStyle = UI.bg; X.fillRect(0, 76, 380, SCR.h); line([[380, 76], [380, SCR.h]], { stroke: UI.line, lwPx: 2 });
    txt('←  Channel content', 30, 118, 24, UI.ink, 600);
    thumb(30, 150, 320, 180, 30, '2:17'); txt('Your video', 30, 360, 20, UI.ink, 600); txt('Screen Time 3 - Game Over!', 30, 390, 20, UI.grey);
    ['Details', 'Analytics', 'Editor', 'Comments', 'Languages', 'Claims'].forEach((s, i) => { if (i === 1) shape(rectPts(16, 432 + i * 58, 348, 50), { fill: UI.panel, stroke: null, smooth: .2 }); txt(s, 70, 457 + i * 58, 22, UI.ink, i === 1 ? 700 : 500); circle(42, 457 + i * 58, 9, { fill: null, stroke: UI.ink, lwPx: 3 }); });
    txt('Video analytics', 420, 135, 46, UI.ink, 700);
    shape(rectPts(SCR.w - 230, 108, 200, 52), { fill: UI.panel, stroke: null, smooth: .5 }); txt('Advanced mode', SCR.w - 130, 134, 20, UI.ink, 600, 'center');
    ['Overview', 'Reach', 'Engagement', 'Audience'].forEach((s, i) => { txt(s, 420 + i * 175, 210, 23, i === 1 ? UI.ink : UI.grey, i === 1 ? 700 : 500); });
    shape(rectPts(595, 232, 70, 4), { fill: UI.ink, stroke: null }); txt('Since published', SCR.w - 250, 210, 22, UI.ink, 600);
    line([[400, 244], [SCR.w, 244]], { stroke: UI.line, lwPx: 2 });
    const cards = [['Thumbnail impressions', '1.2K', ''], ['Thumbnail click-through rate', '1.0%', ''], ['Views', '21', '1 more than usual'], ['Unique viewers', '17', '']];
    const cw = (SCR.w - 440) / 4;
    cards.forEach(([k, v, sub], i) => {
      const x = 420 + i * cw, pop = backOut(clamp(seg(t, t0 + .3 + i * .25, t0 + .7 + i * .25)));
      shape(rectPts(x, 270, cw, 150), { fill: i ? UI.panel : UI.bg, stroke: UI.line, lwPx: 2 });
      txt(k, x + cw / 2, 302, 19, UI.grey, 500, 'center');
      X.save(); X.translate(x + cw / 2, 350); X.scale(pop, pop); txt(v, 0, 0, 44, UI.ink, 700, 'center'); X.restore();
      if (sub) txt(sub, x + cw / 2, 396, 17, UI.grey, 500, 'center');
    });
    // the views card gets the spotlight: a circle drawn round the 21
    const vx = 420 + 2.5 * cw, ring = seg(t, t0 + 3.2, t0 + 3.9);
    if (ring > 0) { const pts = []; for (let i = 0; i <= 40 * ring; i++) { const a = -1.2 + i / 40 * TAU * 1.05; pts.push([vx + Math.cos(a) * 80, 350 + Math.sin(a) * 46]); } if (pts.length > 1) line(pts, { stroke: '#D7262E', lwPx: 6, smooth: true }); }
    // the impressions chart draws itself
    const gx = 440, gy = 470, gw = SCR.w - 600, gh = 300, u = seg(t, t0 + .8, t0 + 2.8);
    for (let i = 0; i <= 3; i++) { line([[gx, gy + gh - i * gh / 3], [gx + gw, gy + gh - i * gh / 3]], { stroke: UI.line, lwPx: 2 }); txt(fmt(i * 500), gx + gw + 20, gy + gh - i * gh / 3, 18, UI.grey); }
    for (let d = 0; d <= 7; d++) txt(d === 7 ? '7 days' : String(d), gx + d * gw / 7, gy + gh + 26, 18, UI.grey, 500, 'center');
    const curve = [[0, 0], [.3, 10], [.55, 800], [.85, 820], [1.1, 1000], [1.5, 1070], [2.3, 1080], [2.5, 1180], [3.2, 1180]];
    const pts = curve.filter(p => p[0] <= 3.2 * u).map(([d, v]) => [gx + d * gw / 7, gy + gh - v / 1500 * gh]);
    if (pts.length > 1) line(pts, { stroke: UI.accent, lwPx: 4 });
    shape(rectPts(gx, gy + gh + 60, 140, 50), { fill: UI.panel, stroke: null, smooth: .5 }); txt('See more', gx + 70, gy + gh + 85, 20, UI.ink, 600, 'center');
    cursor(t, [[t0, 900, 600], [t0 + 2.6, 1180, 420], [t0 + 3.6, vx - 20, 380]]);
  }
  // insert 2: channel content, scrolling down to the Tongue Twister videos
  const VIDEOS = [
    ['Juggling in the throne room', '0:42', 34, 40], ['Fired!', '0:51', 19, 10], ['The Riemann Hypothesis', '1:38', 12, 210], ['The Great Debate', '2:05', 27, 120],
    ['Deal With It', '1:12', 23, 95], ['The Dynamics of Mirroring', '3:10', 6, 260], ['Cleaning Up 4: Know Thyself', '2:44', 15, 180], ['Screen Time 3 - Game Over!', '2:17', 21, 30],
    ['Game Night', '2:31', 18, 330], ['Tongue Twisters', '2:46', 1482306, 280, true], ['Super Tongue Twisters', '3:19', 2917554, 300, true],
  ];
  const ROW = 118, LIST_Y = 250;
  function contentScreen(t) {
    topBar();
    txt('Channel content', 60, 135, 46, UI.ink, 700);
    ['Videos', 'Shorts', 'Live', 'Playlists'].forEach((s, i) => txt(s, 60 + i * 150, 200, 23, i ? UI.grey : UI.ink, i ? 500 : 700));
    shape(rectPts(55, 222, 90, 4), { fill: UI.ink, stroke: null });
    const maxScroll = VIDEOS.length * ROW - (SCR.h - LIST_Y - 20), sc = maxScroll * ease(seg(t, SCROLL[0], SCROLL[1]));
    X.save(); X.beginPath(); X.rect(0, LIST_Y, SCR.w, SCR.h - LIST_Y); X.clip();
    VIDEOS.forEach(([title, dur, views, hue, hot], i) => {
      const y = LIST_Y + 50 + i * ROW - sc; if (y < LIST_Y - ROW || y > SCR.h + ROW) return;
      const glow = hot ? ease(seg(t, HITS - .2, HITS + .4)) : 0;
      if (glow > 0) shape(rectPts(20, y - 8, SCR.w - 40, ROW - 6), { fill: rgba('#FFE45C', .35 * glow), stroke: rgba('#E0A800', glow), lwPx: 4, smooth: .08 });
      thumb(60, y, 170, 96, hue, dur, hot);
      txt(title, 260, y + 34, 26, UI.ink, hot ? 700 : 600); txt('Public  ·  The Trolls', 260, y + 70, 19, UI.grey);
      const n = hot ? Math.round(views * ease(seg(t, HITS, HITS + 1.6))) : views;
      txt(fmt(n), SCR.w - 330, y + 48, hot ? 34 : 26, hot && glow > .5 ? UI.good : UI.ink, hot ? 800 : 500, 'right');
      txt('views', SCR.w - 316, y + 50, 19, UI.grey);
      if (hot && glow > .3) { const p = 1 + .12 * Math.sin(t * 9 + i); X.save(); X.translate(SCR.w - 150, y + 46); X.scale(p, p); circle(0, 0, 24, { fill: UI.good, stroke: null }); shape([[0, -14], [-12, 2], [-4, 2], [-4, 14], [4, 14], [4, 2], [12, 2]], { fill: '#FFFFFF', stroke: null }); X.restore(); txt('🔥', SCR.w - 95, y + 46, 34, UI.ink, 500, 'center'); }
      line([[40, y + ROW - 12], [SCR.w - 40, y + ROW - 12]], { stroke: UI.line, lwPx: 1.5 });
    });
    X.restore();
    for (let i = 0; i < 40; i++) {                                              // confetti for the hits
      const age = t - HITS - .3 - hash(i) * .4; if (age < 0 || age > 2.6) continue;
      const x = SCR.w * (.15 + .7 * hash(i + 7)) + 140 * Math.sin(age * 3 + i), y = -20 + age * (260 + 200 * hash(i + 3));
      X.save(); X.translate(x, y); X.rotate(age * 6 + i); shape(rectPts(-8, -4, 16, 8), { fill: ['#FFD34E', '#E5466E', '#6C5CE7', '#1E9E4A', '#FF8A3D'][i % 5], stroke: null }); X.restore();
    }
    cursor(t, [[LAP2[0], 900, 500], [SCROLL[0], 1320, 640], [SCROLL[1], 1320, 640], [SCROLL[1] + .8, 1280, SCR.h - 150]]);
  }
  function cursor(t, keys) {                                                    // the mouse pointer, in screen-area px
    const [x, y] = kf(t, keys.map(([tt, x, y]) => [tt, [x, y]]), ease);
    shape([[x, y], [x, y + 34], [x + 9, y + 26], [x + 16, y + 40], [x + 22, y + 37], [x + 15, y + 24], [x + 26, y + 24]], { fill: '#FFFFFF', stroke: '#111111', lwPx: 2.5 });
  }
  const lap1Shot = t => { laptopFrame(t, analyticsScreen); flash(.6 * (1 - seg(t, LAP1[0], LAP1[0] + .25))); offBubbles(t); };
  const lap2Shot = t => { laptopFrame(t, contentScreen); flash(.6 * (1 - seg(t, LAP2[0], LAP2[0] + .25))); offBubbles(t); };

  // ---------- cameras (desk view) ----------
  const drift = t => [8 * Math.sin(t * .23), 4 * Math.sin(t * .31)];
  const cam = (x, y, z, f, hy) => t => { const [dx, dy] = drift(t); return { x: x + dx, y, z, f, hy: hy + dy, dir: 1 }; };
  const C_WIDE = cam(0, 165, 60, 650, 560), C_TWO = cam(20, 150, 540, 1350, 440), C_SAFADI = cam(-55, 150, 600, 1450, 430), C_SAMI = cam(95, 150, 600, 1450, 430);
  const lerpCam = (a, b, u) => ({ ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f, b.f, u), hy: lerp(a.hy, b.hy, u) });
  const shoot = (t, c, blur) => { const { A, S } = stage(t, c, blur); bubbles(t, A, S); return A; };
  const two = t => shoot(t, C_TWO(t), 1.4), closeSafadi = t => shoot(t, C_SAFADI(t), 2.4), closeSami = t => shoot(t, C_SAMI(t), 2.4);
  function opening(t) { const u = ease(seg(t, 0, 2.4)); shoot(t, lerpCam(C_WIDE(t), C_TWO(t), u), 1.4 * u); }
  // the idea: Safadi close, a thought cloud with the monsters marching off to school
  function ideaShot(t) {
    const A = shoot(t, C_SAFADI(t), 2.4), k = on(t, IDEA + .6, endOf('imagine') + .2, .35); if (k <= .01 || !A.safadi) return;
    overlay(() => {
      const cx = 1400, cy = 250, s = backOut(clamp(k * 1.3));
      for (let i = 0; i < 3; i++) circle(lerp(A.safadi.top[0] + 120, cx - 330, i / 3), lerp(A.safadi.top[1] - 20, cy + 120, i / 3), (10 + 8 * i) * s, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 4 });
      X.save(); X.translate(cx, cy); X.scale(s, s);
      const cloud = []; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; cloud.push([Math.cos(a) * (360 + 26 * Math.sin(i * 2.7)), Math.sin(a) * (230 + 20 * Math.cos(i * 1.9))]); }
      shape(cloud, { fill: '#FFFDF6', stroke: PAL.ink, lwPx: 6, smooth: true });
      if (ready(MONSTERS)) { X.save(); X.beginPath(); X.ellipse(0, 0, 320, 200, 0, 0, TAU); X.clip(); X.drawImage(MONSTERS, -150 + 20 * Math.sin(t * 2), -195, 300, 389); X.restore(); }
      X.save(); X.translate(0, 150); X.rotate(-.05 + .03 * Math.sin(t * 6));
      shape(rectPts(-250, -34, 500, 68), { fill: '#FFE45C', stroke: PAL.ink, lwPx: 5, smooth: .3 });
      X.font = `46px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#6A3FB0'; X.fillText('TONGUE TWISTERS!', 0, 4); X.restore();
      X.restore();
    });
  }
  // the ending: a slow push in on two sly smiles, freeze, card, iris
  function ending(t) {
    const tt = Math.min(t, FREEZE), u = ease(seg(tt, EXACT - .2, FREEZE)), a = C_TWO(tt);
    shoot(tt, { ...a, f: lerp(a.f, 1650, u), hy: lerp(a.hy, 400, u), x: lerp(a.x, 20, u) }, 1.6);
    if (t < FREEZE) return;
    flash(.7 * kick(t, FREEZE, 8));
    overlay(() => {
      const c = backOut(seg(t, FREEZE + .3, FREEZE + .7)); if (c <= 0) return;
      X.save(); X.translate(W / 2, 150); X.rotate(-.04); X.scale(c, c);
      shape(rectPts(-470, -95, 940, 190), { fill: '#FFF4EC', stroke: PAL.ink, lwPx: 8, smooth: .1 });
      X.font = `92px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 14; X.strokeStyle = PAL.ink; X.strokeText('TO BE CONTINUED...', 0, 8); X.fillStyle = '#6A3FB0'; X.fillText('TO BE CONTINUED...', 0, 8);
      X.restore();
    });
    iris(W / 2, H / 2, lerp(1500, 0, easeIn(seg(t, END - 2.2, END - .8))));
  }

  scene({ duration: END, fps: 24, bpm: 96,                                   // id, title, dialogue, music: see asset.js
    shots: [
      [0, opening], [LETTER_IN[0], letterShot], [LETTER_IN[1], two], [AT('many') - .2, closeSami], [endOf('many') - .2, two],
      [LAP1[0], lap1Shot], [LAP1[1], closeSami], [LAP2[0], lap2Shot], [LAP2[1], two],
      [AT('double') - .2, closeSafadi], [AT('plan') - .2, closeSami], [PULL[0], two], [DRAW_IN[0], drawingShot],
      [DRAW_IN[1], ideaShot], [AT('silliest') - .2, closeSami], [EXACT - .2, ending],
    ] });
})();
