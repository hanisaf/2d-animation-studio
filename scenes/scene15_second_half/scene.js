// Scene 15: "The Second Half". Half-time, the kids' plan (dribble, don't pass: you can't be offside on your own dribble),
// seven goals (Kids 4 – Adults 3), and the cooler: this time the twins keep the real drinks. The End.
// Same ends as scene 14: Kids defend the south goal (Alma), Adults the north goal (Sami). Everyone moves on world-space
// PATHS, the ball on BALL segments; each shot films the action from the side the players run toward (rigs face the camera).
// Every shot is a pure function of t.
(() => {
  const F = LOCATIONS.soccer_field, LINES = ASSETS.scene.scene15_second_half.dialogue;
  const ACCENT = { safadi: PAL.crimson, sami: '#2E9E6B', housam: '#3766BD', alma: '#994EC4', jenna: '#D0508E', danny: '#3B6FB0', jester_fester: PAL.crimson };
  const HEADW = { safadi: 6.6, sami: 6.6, alma: 6.8, housam: 3.6, jenna: 4.2, danny: 4.6, jester_fester: 3.9 };
  const R = 10;                                                              // ball radius, world units
  // goals: [time the ball crosses the line, 'K' | 'A']
  const GOALS = [[43.4, 'K'], [72.8, 'K'], [89.0, 'A'], [95.7, 'A'], [109.0, 'A'], [120.3, 'K'], [128.2, 'K']];
  const scoreAt = t => GOALS.reduce((s, [g, w]) => t >= g ? (w === 'K' ? [s[0] + 1, s[1]] : [s[0], s[1] + 1]) : s, [0, 0]);
  const O_BASE = t => ({ crowd: .5, score: scoreAt(t), home: 'KIDS', guest: 'ADULTS', ...(t < 3 ? { clock: 'HALF TIME' } : t > 131.2 ? { clock: 'FULL TIME' } : {}) });
  // key moments
  const WHISTLE2H = 31.0, TACKLE = 34.0, PLAN = 35.8, BREAK = 38.0, WAKE_BRO = 41.0, SHOT1 = 42.8;
  const SAVE1 = 53.4, TAP = 57.6, ALMA_GO = 58.8, ICE = 66.4, DREAM = [68.6, 71.6], CHARGE = 70.0, SHOT2 = 72.2;
  const TRIP1 = 84.0, PEN1 = 88.6, BOMB = 92.6, STEAL = 100.0, TRIP2 = 103.0, CARD = [103.9, 106.4], PEN2 = 108.6;
  const CURL = 119.8, FREEKICK = 124.6, SHOT7 = 127.8, FULL = 131.2, LID = 160.6, CLINK = 171.0;

  // ---------- timing helpers ----------
  const speaking = (who, t) => LINES.some(l => { if (l.speaker !== who) return false;
    const p = (t - l.at - .2) * l.cps; return p > 0 && p < l.text.replace(/\*/g, '').length; });
  const on = (t, a, b, r = .3) => ease(seg(t, a, a + r)) * (1 - ease(seg(t, b - r, b)));
  const mix = (a, b, k) => mixPt(a, b, clamp(k));
  const inAny = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
  function lastSpeaker(t, not) {
    let who = null;
    for (const l of LINES) if (l.at <= t && l.speaker !== not && !l.silentBubble) who = l.speaker;
    return who;
  }

  // ---------- where everyone is: [t, x, z] keys, linear between them; a repeated time is a cut (teleport) ----------
  function path(t, keys) {
    let p = 0;
    if (t <= keys[0][0]) return { x: keys[0][1], z: keys[0][2], p: 0, moving: 0, speed: 0 };
    for (let i = 1; i < keys.length; i++) {
      const [t0, x0, z0] = keys[i - 1], [t1, x1, z1] = keys[i], d = t1 > t0 ? Math.hypot(x1 - x0, z1 - z0) : 0;
      if (t < t1) { const u = (t - t0) / (t1 - t0); return { x: lerp(x0, x1, u), z: lerp(z0, z1, u), p: p + d * u, moving: d > 1 ? 1 : 0, speed: d / (t1 - t0), dz: Math.sign(z1 - z0) || undefined }; }
      p += d;
    }
    const k = keys[keys.length - 1]; return { x: k[1], z: k[2], p, moving: 0, speed: 0 };
  }
  const COOL = { x: 2620, z: 3120, w: 90, h: 30, d: 46, lid: 7 };
  const FOUNT = { x: 3970, z: 2330 };
  const PATHS = {
    housam: [[0, 1980, 3090], [31, 1980, 3090], [31, -400, 5200], [BREAK, -400, 5200], [42.6, -300, 7000], [45.6, -250, 7300], [49.6, -250, 7300],
      [49.6, -300, 6300], [72.8, -300, 6300], [74.0, -150, 7000], [80, -150, 7000], [80, -300, 3500], [99.2, -300, 3500], [99.2, -200, 4700],
      [114, -200, 4700], [114, -20, 4480], [118.4, -60, 7300], [122.6, -60, 7300], [122.6, 100, 6400], [125.8, 100, 6400], [127.6, 260, 8000],
      [134, 260, 8000], [134, 0, 6500], [142, 0, 6500], [142, 2400, 3140], [155.4, 2400, 3140], [158.4, 3920, 2380], [175, 3920, 2380]],
    danny: [[0, 2290, 3060], [31, 2290, 3060], [31, 150, 3700], [33.7, 150, 3700], [TACKLE + .1, -20, 3880], [BREAK, -20, 3880], [38.6, 120, 4300],
      [42.6, 100, 7600], [49.6, 100, 7600], [49.6, 250, 6200], [99.2, 250, 6200], [99.2, 100, 3600], [STEAL, 110, 4100], [134, 110, 4100],
      [134, 160, 6480], [142, 160, 6480], [142, 1940, 3140], [155.4, 1940, 3140], [158.4, 3690, 2390], [175, 3690, 2390]],
    jenna: [[0, 1880, 2960], [31, 1880, 2960], [31, -500, 3300], [49.6, -500, 3300], [49.6, -300, 2400], [80, -300, 2400], [80, -240, 1500],
      [134, -240, 1500], [134, -170, 6520], [142, -170, 6520], [142, 2080, 3140], [155.4, 2080, 3140], [158.4, 3800, 2385], [175, 3800, 2385]],
    alma: [[0, 2150, 3100], [31, 2150, 3100], [31, 0, 90], [53.0, 0, 90], [SAVE1, 210, 100], [54.6, 210, 100], [55.6, 0, 90], [ALMA_GO, 0, 90],
      [60.5, 60, 1400], [63.0, 40, 4500], [66.0, 20, 7300], [DREAM[1], 20, 7300], [71.9, 180, 7320], [80, 180, 7320], [80, 0, 90],
      [PEN1, 0, 90], [PEN1 + .4, -230, 100], [90.5, -230, 100], [92, -40, 700], [99.2, -40, 700], [99.2, 0, 90], [101.8, 0, 90], [TRIP2, 30, 1290],
      [107, 30, 1290], [107, 0, 90], [PEN2, 0, 90], [PEN2 + .4, 230, 100], [134, 230, 100], [134, 330, 6460], [142, 330, 6460],
      [142, 2230, 3140], [148.0, 2230, 3140], [148.4, 2300, 3010], [155.4, 2300, 3010], [158.4, 3580, 2370], [175, 3580, 2370]],
    safadi: [[0, 2420, 4420], [31, 2420, 4420], [31, 0, 4500], [31.5, 0, 4500], [TACKLE, -40, 3900], [36.6, -40, 3900], [BREAK, 40, 4100], [38.4, 40, 4100],
      [WAKE_BRO, 60, 6000], [49.6, 60, 6000], [49.6, 60, 3200], [52.8, 40, 1500], [54.5, 40, 1500], [56.0, -430, 140], [59.2, -430, 140],
      [61.5, -200, 1500], [76, -200, 1500], [76, -110, 8650], [80, -110, 8650], [81.6, -110, 7700], [81.6, 60, 3000], [83.9, -185, 1480],
      [86.4, -185, 1480], [86.4, 60, 1420], [87.6, 60, 1420], [PEN1, 10, 1130], [92, 10, 1130], [92, 200, 4800], [99.2, 200, 4800], [99.2, 150, 4200],
      [STEAL, 150, 4200], [TRIP2 - .1, 40, 1450], [107, 40, 1450], [107, 60, 1420], [107.6, 60, 1420], [PEN2, 10, 1130], [111.8, 10, 1130],
      [111.8, 60, 4500], [114, 60, 4500], [114, 60, 4900], [122.6, 60, 4900], [122.6, 400, 5800], [142, 400, 5800], [142, 2770, 3160], [175, 2770, 3160]],
    sami: [[0, 2580, 4440], [31, 2580, 4440], [31, -330, 8880], [49.6, -330, 8880], [49.6, -20, 8900], [65.0, -20, 8900], [66.2, 80, 7650],
      [CHARGE, 80, 7650], [71.4, 0, 7330], [71.8, -100, 7290], [76, -100, 7290], [76, 80, 8700], [92, 80, 8700], [92, -20, 8850], [111.8, -20, 8850],
      [111.8, 200, 4520], [114, 200, 4520], [114, -20, 8900], [120.0, -20, 8900], [120.4, -300, 8900], [122.6, -300, 8900], [122.6, -60, 7170],
      [125.8, -60, 7170], [128.2, -20, 8700], [142, -20, 8700], [142, 2470, 3160], [175, 2470, 3160]],
    jester_fester: [[0, -150, 4600], [31, -150, 4600], [BREAK, -300, 5200], [42.6, -450, 7300], [49.6, -450, 7450], [49.6, -400, 3000], [80, -400, 3000],
      [80, -420, 2200], [84.6, -300, 1700], [86.4, -300, 1700], [86.4, -500, 1600], [99.2, -500, 1600], [99.2, -450, 3000], [103.4, -180, 1340],
      [107, -180, 1340], [107, -500, 1600], [111.8, -500, 1600], [111.8, -300, 4700], [114, -300, 4700], [114, -400, 5600], [122.6, -400, 5600],
      [122.6, -600, 7600], [FULL, -600, 7600], [FULL, -120, 6600], [134, -120, 6600], [134, -380, 6620], [142, -380, 6620], [142, -400, 6600]],
  };
  const AT = n => t => path(t, PATHS[n]);
  const SHOWN = { jester_fester: t => t > 3 && t < 142 };

  // ---------- the ball ----------
  const BALL = [
    { t0: 0, at: [-3000, R, 0] },
    { t0: 31.5, t1: TACKLE, feet: 'safadi', dz: -1 },
    { t0: TACKLE, t1: TACKLE + .25, to: [-8, R, 3858], arc: 6 },
    { t0: BREAK, t1: 42.6, feet: 'danny' },
    { t0: SHOT1, t1: 43.4, to: [230, R, 9010], arc: 30 },
    { t0: 43.4, t1: 43.7, to: [240, R, 9120], arc: 6 },
    { t0: 49.6, t1: 52.8, feet: 'safadi', dz: -1 },
    { t0: 53.0, t1: SAVE1, to: [215, 120, 50], arc: 40 },
    { t0: SAVE1, hold: 'alma' },
    { t0: ALMA_GO, t1: DREAM[1] + .55, feet: 'alma' },
    { t0: SHOT2, t1: 72.8, to: [-250, 150, 9010], arc: 30 },
    { t0: 72.8, t1: 73.1, to: [-260, R, 9130], arc: 6 },
    { t0: 80, t1: TRIP1, feet: 'safadi', dz: -1 },
    { t0: TRIP1, t1: TRIP1 + .5, to: [-60, R, 1500], arc: 20 },
    { t0: 86.4, at: [0, R, 1100] },
    { t0: PEN1, t1: 89.0, to: [250, 60, 0], arc: 15 },
    { t0: 89.0, t1: 89.3, to: [262, R, -140], arc: 6 },
    { t0: 92, at: [-10, R, 8780] },
    { t0: BOMB, t1: 93.8, to: [0, R, 5500], arc: 600 },
    { t0: 93.8, t1: 94.7, to: [0, R, 2800], arc: 350 },
    { t0: 94.7, t1: 95.3, to: [10, R, 900], arc: 180 },
    { t0: 95.3, t1: 95.7, to: [40, 130, 0], arc: 140 },
    { t0: 95.7, t1: 96.0, to: [50, R, -140], arc: 10 },
    { t0: 99.2, t1: STEAL, feet: 'danny' },
    { t0: STEAL, t1: TRIP2, feet: 'safadi', dz: -1 },
    { t0: TRIP2, t1: TRIP2 + .4, to: [-80, R, 1250], arc: 15 },
    { t0: 107, at: [0, R, 1100] },
    { t0: PEN2, t1: 109.0, to: [-250, 60, 0], arc: 15 },
    { t0: 109.0, t1: 109.3, to: [-262, R, -140], arc: 6 },
    { t0: 114, t1: CURL, feet: 'housam' },
    { t0: CURL, t1: 120.3, to: [-330, 205, 9005], arc: 90 },
    { t0: 120.3, t1: 120.6, to: [-340, R, 9140], arc: 6 },
    { t0: 122.6, at: [-60, R, 7215] },
    { t0: FREEKICK, t1: 125.2, to: [100, R, 6440], arc: 30 },
    { t0: 125.8, t1: 127.6, feet: 'housam' },
    { t0: SHOT7, t1: 128.2, to: [230, 60, 9010], arc: 20 },
    { t0: 128.2, t1: 128.5, to: [240, R, 9130], arc: 6 },
    { t0: 134, at: [-3000, R, 0] },
  ];
  function ballAt(t) {
    let i = -1; for (let j = 0; j < BALL.length; j++) if (BALL[j].t0 <= t) i = j;
    if (i < 0) return BALL[0].at;
    const b = BALL[i];
    if (b.at) return b.at;
    if (b.hold) return { hold: b.hold };
    const tt = Math.min(t, b.t1 ?? t);
    if (b.feet) {
      const a = AT(b.feet)(tt), dz = b.dz ?? (a.dz || 1), touch = a.moving ? Math.abs(Math.sin(a.p / 40 * Math.PI)) : 0;
      return [a.x + 16, R + 4 * touch, a.z + dz * (32 + 22 * touch)];
    }
    const from = ballAt(b.t0 - 1e-4), f = from.hold ? (() => { const a = AT(from.hold)(b.t0); return [a.x, R, a.z + 40]; })() : from, u = seg(tt, b.t0, b.t1);
    return [lerp(f[0], b.to[0], u), lerp(f[1], b.to[1], u) + b.arc * 4 * u * (1 - u), lerp(f[2], b.to[2], u)];
  }

  // ---------- props ----------
  function gloves(A, s) {
    for (const h of ['handL', 'handR']) { const [x, y] = A[h];
      shape(ellPts(x, y, 1.25 * s, 1.1 * s, 18), { fill: '#5BD16A', stroke: PAL.ink, lwPx: Math.max(1.5, .2 * s), smooth: true });
      line([[x - .8 * s, y + .35 * s], [x + .8 * s, y + .35 * s]], { stroke: '#2E8B3E', lwPx: Math.max(1.2, .18 * s) }); }
  }
  function whistleProp(A, s, blow) {
    const nx = A.head[0], ny = A.head[1] + 3.2 * s, [hx, hy] = A.handR;
    line([[nx - 1.2 * s, ny], [lerp(nx, hx, .5), Math.max(ny, hy) + 1.2 * s], [hx, hy]], { stroke: '#E0423A', lwPx: Math.max(1.5, .22 * s), smooth: true });
    X.save(); X.translate(hx + (blow ? -.2 : .2) * s, hy - .5 * s); X.rotate(blow ? -.5 : .3); X.scale(s, s);
    shape(rectPts(-.2, -.45, 1.5, .9), { fill: '#D7DDE6', stroke: PAL.ink, lwPx: 2, smooth: .3 });
    circle(-.25, .25, .65, { fill: '#C3CAD5', stroke: PAL.ink, lwPx: 2 });
    X.restore();
  }
  function yellowCard(A, s, k) {
    if (k <= 0) return;
    const [x, y] = A.handL;
    X.save(); X.translate(x, y - 1.6 * s); X.rotate(-.12); X.scale(1.7 * s * backOut(k), 1.7 * s * backOut(k));
    shape(rectPts(-1.1, -1.6, 2.2, 3.2), { fill: '#FFD43B', stroke: PAL.ink, lwPx: 2.5, smooth: .1 });
    line([[-.7, -1.2], [.3, -1.2]], { stroke: 'rgba(255,255,255,.8)', lwPx: 2 });
    X.restore();
  }
  function noseBubble(A, s, t, k) {
    if (k <= 0) return;
    const r = (.5 + 1.1 * (.5 + .5 * Math.sin(t * 2.2))) * s * k, x = A.head[0] + .8 * s + r * .8, y = A.mouth[1] - 1.6 * s;
    circle(x, y, r, { fill: 'rgba(190,230,255,.55)', stroke: 'rgba(80,140,190,.8)', lwPx: 2 });
    circle(x - r * .35, y - r * .35, r * .22, { fill: 'rgba(255,255,255,.85)', stroke: null });
  }
  function floaty(txt, x, y, s, t, k, col = '#CFE6FF') {                       // z's or sweat drops floating off a head
    if (k < .01) return;
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .6 + i / 3), size = (24 + 22 * ph) * Math.max(.5, s / 5);
      overlay(() => { X.save(); X.globalAlpha = k * (1 - ph); X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
        X.lineJoin = 'round'; X.lineWidth = size * .18; X.strokeStyle = PAL.ink; const zx = x + (ph * 3 + i * .4) * s * (i % 2 ? -1 : 1), zy = y - ph * 6 * s;
        X.strokeText(txt, zx, zy); X.fillStyle = col; X.fillText(txt, zx, zy); X.restore(); });
    }
  }
  function sweat(A, s, t, k) {
    if (k < .01) return;
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .9 + i * .37), x = A.head[0] + (i - 1) * 4.2 * s, y = A.head[1] - 5 * s + ph * 6 * s;
      X.save(); X.globalAlpha = k * (1 - ph);
      shape([[x, y - 1.1 * s], [x + .55 * s, y], [x, y + .55 * s], [x - .55 * s, y]], { fill: '#8FD3FF', stroke: PAL.ink, lwPx: 1.5, smooth: .6 });
      X.restore();
    }
  }
  function speedLines(A, s, k, dirX = 1) {
    if (k <= 0) return;
    overlay(() => { X.save(); X.globalAlpha = .55 * k;
      for (let i = 0; i < 6; i++) { const y = A.chest[1] + (i - 2.5) * 2.6 * s + jit(3), x0 = A.chest[0] - dirX * (5 + 2 * hash(i)) * s;
        line([[x0, y], [x0 - dirX * (6 + 5 * hash(i + 9)) * s, y]], { stroke: '#FFFFFF', lwPx: Math.max(2, .35 * s) }); }
      X.restore(); });
  }
  function dust(x, y, s, t, t0) {
    const u = seg(t, t0, t0 + .7); if (u <= 0 || u >= 1) return;
    for (let i = 0; i < 5; i++) circle(x + (i - 2) * 2.2 * s * (1 + u), y - u * 2 * s - hash(i) * s, (1.2 + 2.2 * u) * s, { fill: `rgba(235,225,205,${.7 * (1 - u)})`, stroke: null });
  }
  function thermos(x, y, s) {
    shape(rectPts(x - 1.1 * s, y - 2.6 * s, 2.2 * s, 5.2 * s), { fill: '#C3222F', stroke: PAL.ink, lwPx: 2.5, smooth: .2 });
    shape(rectPts(x - 1.2 * s, y - 3.4 * s, 2.4 * s, 1.0 * s), { fill: '#D9DDE3', stroke: PAL.ink, lwPx: 2.5 });
  }
  // Jenna's stick drawing scratched into the grass: a goal, Sami's X, far-away Safadi's X, and (Housam's idea) a dribble path
  function grassDrawing(P, t) {
    if (t < 12 || t > 31) return;
    const cx = 2110, cz = 2930, d = seg(t, 12.4, 16.5), idea = seg(t, 18.6, 21.0);
    const W3 = (x, z) => P.p(cx + x, 1, cz + z);
    const ln = (pts, a, b, col = 'rgba(70,95,40,.85)', lw = 4) => { const f = seg(d, a, b); if (f <= 0) return; const q = pts.map(([x, z]) => W3(x, z)).map(p => [p[0], p[1]]); line(f < 1 ? polySlice(q, 0, f) : q, { stroke: col, lwPx: lw }); };
    ln([[-130, 120], [130, 120]], 0, .15); ln([[-40, 120], [-40, 150], [40, 150], [40, 120]], .12, .25);
    ln([[-12, 92], [12, 112]], .3, .4); ln([[12, 92], [-12, 112]], .35, .45);                             // Sami
    ln([[-90, -80], [-66, -60]], .5, .6); ln([[-66, -80], [-90, -60]], .55, .65);                         // Safadi
    ln([[60, -110], [30, 40]], .7, .95);                                                                   // a pass… offside
    if (idea > 0) {
      const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([lerp(100, -10, u) + 55 * Math.sin(u * Math.PI * 2), lerp(-120, 118, u)]); }
      const q = pts.map(([x, z]) => W3(x, z)).map(p => [p[0], p[1]]);
      X.save(); X.shadowColor = '#FFD66B'; X.shadowBlur = 14; line(idea < 1 ? polySlice(q, 0, idea) : q, { stroke: '#FFD66B', lwPx: 5, dash: [14, 9] }); X.restore();
    }
  }
  // Housam's math vision: a glowing angle and a dashed path (screen space, around him)
  function mathVision(A, s, t, k, label = 'θ') {
    if (k <= 0) return;
    overlay(() => {
      X.save(); X.globalAlpha = k; X.shadowColor = '#7FE3FF'; X.shadowBlur = 16;
      const [hx, hy] = A.head, r = 9 * s;
      X.strokeStyle = '#BFF4FF'; X.lineWidth = Math.max(2, .35 * s); X.setLineDash([.9 * s, .6 * s]);
      X.beginPath(); X.arc(hx, hy + 2 * s, r, -2.6, -2.6 + 1.9 * seg(k, 0, 1)); X.stroke();
      X.setLineDash([]); X.beginPath(); X.moveTo(hx, hy + 2 * s); X.lineTo(hx + Math.cos(-2.6) * r * 1.2, hy + 2 * s + Math.sin(-2.6) * r * 1.2); X.moveTo(hx, hy + 2 * s); X.lineTo(hx + Math.cos(-.7) * r * 1.2, hy + 2 * s + Math.sin(-.7) * r * 1.2); X.stroke();
      X.font = `700 ${2.6 * s}px ${FONT_TALK}`; X.fillStyle = '#E8FBFF'; X.textAlign = 'center'; X.fillText(label, hx + Math.cos(-1.65) * r * .75, hy + 2 * s + Math.sin(-1.65) * r * .75);
      X.restore();
    });
  }
  // The ice-cream daydream: a cloud over Alma's head with a rainbow cone; pops at the end
  function dreamBubble(A, s, t) {
    const k = backOut(seg(t, DREAM[0], DREAM[0] + .4)), pop = seg(t, DREAM[1], DREAM[1] + .15);
    if (t < DREAM[0] || pop >= 1) return;
    overlay(() => {
      const cx = A.head[0] + 11 * s, cy = A.top[1] - 10 * s, R0 = 10 * s * k * (1 + .3 * pop);
      X.save(); X.globalAlpha = 1 - pop;
      [[A.head[0] + 3 * s, A.top[1] - 1 * s, .9], [A.head[0] + 5 * s, A.top[1] - 3.5 * s, 1.4]].forEach(([x, y, r]) => circle(x, y, r * s * k, { fill: '#FFFFFF', stroke: PAL.ink, lwPx: 3 }));
      const cl = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, w = 1 + .1 * Math.sin(a * 7); cl.push([cx + Math.cos(a) * R0 * 1.25 * w, cy + Math.sin(a) * R0 * w]); }
      shape(cl, { fill: '#FFF9FE', stroke: PAL.ink, lwPx: 4, smooth: true });
      const u = R0 / 7;
      X.translate(cx, cy + .6 * u); X.rotate(.06 * Math.sin(t * 2));
      shape([[-2.2 * u, -1 * u], [2.2 * u, -1 * u], [0, 4.6 * u]], { fill: '#E9B46A', stroke: PAL.ink, lwPx: 3 });
      for (let i = -1; i <= 1; i++) line([[i * 1.3 * u - 1 * u, -.6 * u], [i * 1.3 * u + .6 * u, 2.6 * u]], { stroke: '#C78A3E', lwPx: 2 });
      [['#FF8FB8', 0, -2.3], ['#9BE7C4', -1.5, -3.6], ['#C9A0FF', 1.5, -3.6], ['#FFE08A', 0, -5.0]].forEach(([c, x, y]) => circle(x * u, y * u, 1.6 * u, { fill: c, stroke: PAL.ink, lwPx: 3 }));
      for (let i = 0; i < 14; i++) { const a = hash(i) * TAU, rr = hash(i + 3) * 2.4 * u; X.save(); X.translate(Math.cos(a) * rr * .8, -3.6 * u + Math.sin(a) * rr * .7); X.rotate(hash(i + 7) * 3);
        X.fillStyle = ['#FF5A6E', '#3CC8F0', '#FFD23C', '#7CDA4A'][i % 4]; X.fillRect(-.35 * u, -.12 * u, .7 * u, .24 * u); X.restore(); }
      X.restore();
    });
  }
  // A drinking fountain by the snack bar
  function fountain(P, t, drinking) {
    const { x, z } = FOUNT, k = P.k(z); if (P.depth(z) < 60) return;
    const [bx, by] = P.p(x, 0, z), [tx, ty] = P.p(x, 95, z);
    shape(rectPts(bx - 9 * k, ty, 18 * k, by - ty), { fill: linGrad(bx - 9 * k, 0, bx + 9 * k, 0, [[0, '#9AA7B5'], [1, '#C9D3DE']]), stroke: PAL.ink, lwPx: 2 });
    shape(ellPts(tx, ty, 32 * k, 9 * k, 24), { fill: '#D7E0EA', stroke: PAL.ink, lwPx: 2, smooth: true });
    shape(ellPts(tx, ty - 1 * k, 25 * k, 6 * k, 24), { fill: '#7FB6D9', stroke: null, smooth: true });
    if (drinking) { const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([tx + lerp(-6, 14, u) * k, ty - (4 + 22 * Math.sin(Math.PI * u * .9)) * k]); } line(pts, { stroke: '#BFE7FF', lwPx: Math.max(2, 3 * k) }); }
  }

  // ---------- the cooler and bottles (from scene 11) ----------
  const CO = { body: '#2F7FD0', side: '#2362A8', lid: '#F4F6F8', lidDk: '#C4CEDA', under: '#DDE4EC', inside: '#173A63', ice: '#E6F6FF' };
  const CAPS = ['#FF5A3C', '#3CC8F0', '#FFD23C', '#7CDA4A', '#C86BF0', '#FF8AC8'];
  const lidAt = t => t < 140 ? 0 : 1.95 * backOut(seg(t, LID, LID + .4));
  const bottlesLeft = t => t > 161.6 ? 4 : 6;
  function cooler(P, t) {
    const c = COOL, x0 = c.x - c.w / 2, x1 = c.x + c.w / 2, z0 = c.z - c.d / 2, z1 = c.z + c.d / 2, h = c.h, a = lidAt(t);
    if (P.depth(z0) < 60) return;
    const lw = clamp(2.4 * P.k(c.z) / 2, 1.4, 4.5);
    const face = (pts, fill) => { const q = P.poly(pts); if (q) shape(q, { fill, stroke: PAL.ink, lwPx: lw }); };
    if (P.cam.x < x0) face([[x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0]], CO.side);
    if (P.cam.x > x1) face([[x1, 0, z0], [x1, 0, z1], [x1, h, z1], [x1, h, z0]], CO.side);
    face([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]], CO.body);
    const q = P.poly([[x0 + 10, h * .72, z0], [x1 - 10, h * .72, z0], [x1 - 10, h * .82, z0], [x0 + 10, h * .82, z0]]);
    if (q) shape(q, { fill: 'rgba(255,255,255,.35)', stroke: null });
    if (a > .05 && P.cam.y > h) {
      face([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], CO.inside);
      for (let i = 0; i < 9; i++) { const [ix, iy, ik] = P.p(x0 + 8 + hash(i) * (c.w - 16), h - 2, z0 + 6 + hash(i + 4) * (c.d - 12)); ellipse(ix, iy, 5 * ik, 3 * ik, { fill: CO.ice, stroke: null }); }
      const n = bottlesLeft(t);
      for (let i = 0; i < 6; i++) {
        if (i < 6 - n) continue;
        const bx = x0 + 18 + (i % 3) * 27, bz = z1 - 12 - Math.floor(i / 3) * 18, [cx, cy, ck] = P.p(bx, h + 3, bz);
        ellipse(cx, cy, 4.6 * ck, 2.6 * ck, { fill: CAPS[i], stroke: PAL.ink, lwPx: 1.4 });
      }
    }
    const L = (x, u, v) => { const dz = -u, dy = v, ca = Math.cos(a), sa = Math.sin(a); return [x, h + (-dz * sa + dy * ca), z1 + (dz * ca + dy * sa)]; };
    const lx0 = x0 - 2, lx1 = x1 + 2, D = c.d + 2, T2 = c.lid;
    const quads = [
      { pts: [L(lx0, D, 0), L(lx1, D, 0), L(lx1, D, T2), L(lx0, D, T2)], fill: CO.lidDk },
      { pts: [L(lx0, 0, T2), L(lx1, 0, T2), L(lx1, D, T2), L(lx0, D, T2)], fill: CO.lid },
      { pts: [L(lx0, 0, 0), L(lx1, 0, 0), L(lx1, D, 0), L(lx0, D, 0)], fill: CO.under },
    ];
    quads.map(qd => ({ ...qd, d: qd.pts.reduce((s, p) => s + P.depth(p[2]), 0) / 4 })).sort((a, b) => b.d - a.d).forEach(qd => face(qd.pts, qd.fill));
  }
  // A sports-drink bottle gripped at screen (x, y); s: px per bottle unit. side: 'front' | 'fun' (the 100% label)
  function bottle(x, y, s, o = {}) {
    X.save(); X.translate(x, y); X.rotate(o.ang || 0); X.scale(s * (o.turn ?? 1), s);
    const lw = clamp(s * .12, 1, 3.5) / s, ink = PAL.ink, cap = o.cap || '#FF5A3C';
    const body = [[-1.1, -2.2], [1.1, -2.2], [1.2, -1.2], [1.2, 3.1], [1.0, 3.5], [-1.0, 3.5], [-1.2, 3.1], [-1.2, -1.2]];
    shape([[-1.1, -2.2], [-.55, -3.2], [.55, -3.2], [1.1, -2.2]], { fill: rgba(cap, .55), stroke: ink, lw });
    shape(body, { fill: rgba(cap, .45), stroke: ink, lw, smooth: .3 });
    shape(rectPts(-1.2, -1.0, 2.4, 3.3), { fill: linGrad(0, -1, 0, 2.3, [[0, cap], [1, mixCol(cap, '#000000', .2)]]), stroke: ink, lw: lw * .8 });
    if (o.side === 'fun') {
      shape(rectPts(-1.05, -.8, 2.1, 2.9), { fill: '#FFFDF4', stroke: ink, lw: lw * .7 });
      X.fillStyle = PAL.crimson; X.font = `700 .36px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.fillText('100%', 0, -.4); X.fillText('ELECTROLYTES', 0, .05); X.fillText('100% SUGAR', 0, .65); X.fillText('100% FUN', 0, 1.25);
    } else shape([[.25, -.75], [-.35, .55], [.1, .55], [-.25, 1.9], [.55, .25], [.05, .25], [.4, -.75]], { fill: '#FFF6C8', stroke: ink, lw: lw * .5 });
    line([[-.75, -1.9], [-.75, 3.0]], { stroke: 'rgba(255,255,255,.55)', lw: .22 });
    if (!o.open) shape(rectPts(-.62, -3.95, 1.24, .8), { fill: cap, stroke: ink, lw });
    X.restore();
  }

  // ---------- poses ----------
  const tos = o => (side, p, k, pose) => { o['hand' + side] = mix(o['hand' + side], p, k); if (k > .5 && pose) o['handPose' + side] = pose; };
  const UP = {
    housam: { handL: [-5.2, -24], handR: [5.2, -24], handPoseL: 'fist', handPoseR: 'fist' },
    danny: { handL: [-4.3, -19.3], handR: [4.3, -19.3], handPoseL: 'palm', handPoseR: 'palm' },
    jenna: { handL: [-4.6, -22], handR: [4.6, -22], handPoseL: 'palm', handPoseR: 'palm' },
    alma: { handL: [-5, -11], handR: [5, -11], handPoseL: 'palm', handPoseR: 'palm' },
    safadi: { handL: [-6.2, -21], handR: [6.2, -21], handPoseL: 'fist', handPoseR: 'fist' },
    sami: { handL: [-6.2, -21], handR: [6.2, -21], handPoseL: 'fist', handPoseR: 'fist' },
    jester_fester: { handL: [-5.3, -15.4], handR: [5.3, -15.4], handPoseL: 'open', handPoseR: 'open' },
  };
  const KICK = { housam: [3.6, -4.4], danny: [4.7, -3.7], jenna: [3.2, -3.2], alma: [2.6, -2.6], safadi: [3.8, -5.4], sami: [3.6, -5.0], jester_fester: [3.0, -3.6] };
  const GAIT = {
    housam: (p, k) => housamDribble(p / 44, k), danny: (p, k) => dannyDribble(p / 30, k), jenna: (p, k) => jennaSkip(p / 40, k),
    alma: (p, k) => almaSkip(p / 44, k), safadi: (p, k) => safadiWalk(p / 58, k), sami: (p, k) => samiWalk(p / 52, k),
    jester_fester: (p, k) => { const sn = Math.sin(p / 46 * Math.PI); return { footL: [-1.25, -.85 - 1.6 * Math.max(0, sn)], footR: [1.25, -.85 - 1.6 * Math.max(0, -sn)], dy: .35 * Math.abs(sn), jump: .5 * Math.abs(sn), hatSway: [.6 * sn, .3] }; },
  };
  // When each character kicks, celebrates, falls (a trip or a dive: [t0, t1, world dx sign]) or pants
  const ACT = {
    housam: { kicks: [CURL, SHOT7], celeb: [[43.6, 49.4], [72.9, 76], [120.4, 122.4], [128.3, 130], [FULL + .4, 142]] },
    danny: { kicks: [SHOT1, 99.9], celeb: [[43.6, 49.4], [FULL + .4, 142]], falls: [] },
    jenna: { kicks: [], celeb: [[FULL + .4, 142]] },
    alma: { kicks: [SHOT2], celeb: [[72.9, 76], [FULL + .4, 142]], falls: [[53.0, 54.6, 1], [PEN1, 90.5, -1], [101.8, 104.6, 1], [PEN2, 110.5, 1]] },
    safadi: { kicks: [PEN1, PEN2, 53.0], celeb: [[89.2, 90.6], [109.2, 114]], falls: [[TACKLE, 36.4, -1], [TRIP1, 85.6, 1], [TRIP2, 104.6, -1]] },
    sami: { kicks: [BOMB, FREEKICK], celeb: [], falls: [[71.4, 75.5, -1], [120.0, 122.4, -1]] },
    jester_fester: { kicks: [], celeb: [] },
  };
  function common(name, t, ctx, rest) {
    const at = AT(name)(t), talk = speaking(name, t), ls = lastSpeaker(t, name), A = ACT[name];
    const o = { ...rest, mouth: lipFlap(t, talk, 'smile', ['grin', 'open', 'o', 'smile']), lookX: ls ? ctx.look(ls) : 0, lookY: 0 };
    o.turn = .15 * Math.sign(o.lookX);
    if (ctx.play) { o.lookX = ctx.ball; o.turn = .15 * Math.sign(ctx.ball); o.lookY = .2; }
    if (at.moving) Object.assign(o, GAIT[name](at.p, Math.min(1.5, at.speed / 280)), { mouth: talk ? o.mouth : 'grin' });
    if (talk && !at.moving) tos(o)('R', name === 'alma' ? [4.2, -11.2] : name === 'jester_fester' ? [4.4, -14] : name === 'danny' ? [4.2, -14] : name === 'jenna' ? [3.8, -15] : [5.3, -13.4], 1, name === 'jester_fester' ? 'open' : 'palm');
    for (const k0 of A.kicks) { const k = on(t, k0 - .3, k0 + .25, .1); if (k > 0) { o.footR = mix(o.footR || [1.3, -1], KICK[name], k); o.lean = (o.lean || 0) + .08 * k; } }
    for (const [a, b] of A.celeb) if (t >= a && t < b) { const j = Math.abs(Math.sin((t - a) * 6)); Object.assign(o, UP[name], { jump: 2 * j, eyes: 'happy', mouth: talk ? o.mouth : 'open', lookX: 0, turn: 0 }); }
    for (const [a, b, sx] of (A.falls || [])) {
      if (t < a || t >= b) continue;
      const u = seg(t, a, a + .4), lie = t > a + .4, rise = seg(t, b - .6, b), scr = sx * ctx.dir;
      Object.assign(o, { rot: -1.45 * scr * ease(u) * (1 - ease(rise)), jump: (u < 1 ? 4 * Math.sin(Math.PI * u) : 0) - (lie ? 3 * (1 - rise) : 0), handL: [-4.6, -13], handR: [4.6, -13],
        handPoseL: 'palm', handPoseR: 'palm', eyes: lie ? 'squeeze' : 'wide', mouth: lie ? 'wobble' : 'O', lookX: 0, turn: 0, footL: undefined, footR: undefined, dy: 0 });
    }
    return { o, talk, at, to: tos(o) };
  }

  function housamPose(t, ctx) {
    const { o, talk, to } = common('housam', t, ctx, { footL: [-1.5, -1.05], footR: [1.5, -1.05], handL: [-4.05, -10.7], handR: [4.05, -10.7], handPoseL: 'open', handPoseR: 'open', brows: 'normal' });
    if (t < 31) {                                                            // the huddle
      Object.assign(o, { lookY: .6, lookX: -.3, brows: 'worried', mouth: talk ? o.mouth : 'flat' });
      if (t > 17.6) Object.assign(o, { brows: 'focused', eyes: t < 18.4 ? 'narrow' : 'open', lookY: .5, mouth: talk ? o.mouth : 'smirk' });
      if (t > 24.6 && t < 28.2) to('R', [5.2, -21], 1, 'fist');
      if (t > 28.4) Object.assign(o, UP.housam, { jump: 1.6 * kick(t, 28.6, 5), eyes: 'happy', mouth: talk ? o.mouth : 'grin' });
    }
    if (t > 35.4 && t < 38.0) { to('L', [-5.4, -22], 1, 'palm'); to('R', [5.4, -22 + Math.sin(t * 12)], 1, 'palm'); o.brows = 'up'; o.lookX = ctx.look('danny'); }
    if (t > 70.4 && t < 72.4) { to('L', [-1.6, -21], 1, 'palm'); to('R', [1.6, -21], 1, 'palm'); o.mouth = 'O'; o.lookX = ctx.look('alma'); }
    if (t > 118.4 && t < CURL) Object.assign(o, { eyes: 'narrow', brows: 'focused', mouth: 'smirk', lookY: -.3, lookX: 0, turn: 0 });
    if (t > 142 && t < 160) { o.lookX = ctx.look(lastSpeaker(t, 'housam') || 'safadi'); if (t > 147.6 && t < 148.4) Object.assign(o, GAIT.housam(t * 180, .6)); if (t > 154 && t < 155.4) Object.assign(o, { eyes: 'narrow', mouth: 'smirk', tilt: .06 * Math.sin(t * 8) }); }
    if (t > 158.4) Object.assign(o, { dy: 1.6 * on(t, 158.6, 160.4, .3), lookY: .7, eyes: 'happy', mouth: 'o' });
    return o;
  }
  function dannyPose(t, ctx) {
    const { o, talk, at, to } = common('danny', t, ctx, { handL: [-3.5, -9.8], handR: [3.5, -9.8], brows: 'up' });
    if (at.moving && at.speed > 300) Object.assign(o, { handL: [-4.6, -13], handR: [4.6, -13], handPoseL: 'fist', handPoseR: 'fist', lean: -.12, brows: 'focused' });
    if (t < 31) { Object.assign(o, { lookY: .6, brows: 'worried', mouth: talk ? o.mouth : 'frown' }); if (t > 24.6) Object.assign(o, { brows: 'up', mouth: talk ? o.mouth : 'grin', lookY: 0, lookX: ctx.look('housam') }); if (t > 28.4) Object.assign(o, UP.danny, { jump: 1.6 * kick(t, 28.6, 5), eyes: 'happy' }); }
    const slide = on(t, TACKLE - .3, 34.8, .12);                              // the slide tackle
    if (slide > 0 && t < 34.8) Object.assign(o, { dy: 4.2 * slide, footR: [4.6, -1.4], footL: [-1.4, -.5], lean: -.25 * slide, handL: [-4.2, -11], handR: [3.2, -9], handPoseL: 'palm', brows: 'focused', mouth: 'grin' });
    if (t > 35.0 && t < 35.9) Object.assign(o, { footR: mix([1.5, -1.05], [-1.0, -3.6], on(t, 35.0, 35.9, .2)), lean: .05, lookX: ctx.look('housam') });  // wind-up…
    if (t > 35.9 && t < BREAK) Object.assign(o, { lookX: ctx.look('housam'), eyes: t > 36.8 ? 'happy' : 'wide', brows: 'up', mouth: t > 36.8 ? 'grin' : 'o' });
    if (t > STEAL && t < 101.6) Object.assign(o, { eyes: 'wide', brows: 'worried', mouth: talk ? o.mouth : 'O', jump: .8 * kick(t, STEAL + .1, 6), handL: [-4.6, -15], handR: [4.6, -15], handPoseL: 'palm', handPoseR: 'palm' });
    if (t > FULL + .4 && t < 142) { const w = Math.sin((t - FULL) * 7); Object.assign(o, { eyes: 'wink', mouth: 'grin', handL: [-4.5, -15.6 + 2 * w], handR: [4.5, -15.6 - 2 * w], tilt: .14 * w, jump: .8 * Math.abs(w) }); }
    if (t > 142 && t < 158.4) { o.lookX = ctx.look(lastSpeaker(t, 'danny') || 'safadi'); if (t > 154 && t < 155.4) Object.assign(o, { eyes: 'narrow', mouth: 'smirk' }); }
    if (t > 158.4) Object.assign(o, { lookX: .6, mouth: 'smile' });
    return o;
  }
  function jennaPose(t, ctx) {
    const { o, talk, to } = common('jenna', t, ctx, { handL: [-2.6, -11.6], handR: [2.6, -11.6], handPoseL: 'fist', handPoseR: 'fist', brows: 'up' });
    if (t < 31) {                                                            // crouched over her drawing, stick in hand
      Object.assign(o, { dy: 3.1, footL: [-2.4, -.6], footR: [2.4, -.6], handR: [3.8, -3.2 + .5 * Math.sin(t * 7) * on(t, 12.4, 16.5, .2)], handL: [-3, -9], lookY: .8, lookX: .3, mouth: talk ? o.mouth : 'flat' });
      if (t > 18.4) Object.assign(o, { lookY: -.1, lookX: ctx.look('housam'), brows: 'up', mouth: talk ? o.mouth : 'o' });
      if (t > 28.4) Object.assign(o, UP.jenna, { dy: 0, footL: [-1.25, -.65], footR: [1.25, -.65], jump: 1.6 * kick(t, 28.6, 5), eyes: 'happy', mouth: talk ? o.mouth : 'grin' });
    }
    const trip = on(t, TRIP1 - .3, TRIP1 + .6, .1);
    if (trip > 0) Object.assign(o, { footR: mix([1.25, -.65], [5.6, -1.0], trip), dy: .8 * trip, lean: -.08 * trip, brows: 'up', mouth: 'o', eyes: t > TRIP1 ? 'wide' : 'narrow' });
    if (t > TRIP1 + .6 && t < 88) Object.assign(o, { handL: [-1, -19], handR: [1, -19], handPoseL: 'palm', handPoseR: 'palm', brows: 'worried', mouth: 'o' });
    if (t > FULL + .4 && t < 142) {                                          // cartwheels in the celebration
      Object.assign(o, UP.jenna, { eyes: 'happy', mouth: 'grin', footL: [-2.9, -.8], footR: [2.9, -.8] });
    }
    if (t > 142 && t < 158.4) { o.lookX = ctx.look(lastSpeaker(t, 'jenna') || 'safadi'); if (t > 154 && t < 155.4) Object.assign(o, { eyes: 'wink', mouth: 'smirk' }); }
    if (t > 158.4) Object.assign(o, { lookX: .6, mouth: 'smile' });
    return o;
  }
  function almaPose(t, ctx) {
    const { o, talk, at, to } = common('alma', t, ctx, { handL: [-4.4, -9.2], handR: [4.4, -9.2], handPoseL: 'palm', handPoseR: 'palm', brows: 'normal' });
    if (t < 31) { Object.assign(o, { handL: [-3.4, -4.9], handR: [3.4, -4.9], lookY: .6, brows: 'worried', mouth: talk ? o.mouth : 'frown' }); if (t > 18.4) Object.assign(o, { lookY: 0, lookX: ctx.look('housam'), brows: 'up', mouth: talk ? o.mouth : 'o' }); if (t > 28.4) Object.assign(o, UP.alma, { jump: 1.6 * kick(t, 28.6, 5), eyes: 'happy', mouth: talk ? o.mouth : 'grin' }); }
    if (t > 31 && t < 134 && !at.moving && !ctx.play) o.dy = .4;
    if (t > 54.6 && t < ALMA_GO) {                                           // ball in hand: the throw… no! the plan
      Object.assign(o, { handL: [-1.6, -7.6], handR: [1.6, -7.6], handPoseL: 'palm', handPoseR: 'palm', lookX: ctx.look('jenna') });
      const wind = on(t, 56.6, TAP, .2);
      if (wind > 0) { to('R', [4.6, -12.5], wind, 'palm'); o.lean = .06 * wind; }
      if (t > TAP && t < 58.6) { to('R', [3.6, -16.5 + .4 * Math.sin(t * 20)], 1, 'palm'); Object.assign(o, { eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'o', emote: '!', emoteK: on(t, TAP, 58.6, .1), lookX: 0 }); }
    }
    if (at.moving && t > ALMA_GO && t < 66.2) o.power = .55;
    if (t > 66.2 && t < DREAM[1]) { Object.assign(o, { lookX: ctx.look('sami'), mouth: 'o', brows: 'up' }); if (t > DREAM[0] - .2) Object.assign(o, { eyes: 'heart', mouth: 'grin', tilt: .1 * Math.sin(t * 1.6), handL: [-1.1, -11.6], handR: [1.1, -11.6], handPoseL: 'palm', handPoseR: 'palm', lookX: 0, lookY: -.4, blush: 1 }); }
    if (t >= DREAM[1] && t < SHOT2) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: 'O', jump: 1.2 * kick(t, DREAM[1], 6) });
    if (t > 104.6 && t < 107) Object.assign(o, { handL: [-1.1, -11.6], handR: [1.1, -11.6], brows: 'worried', mouth: talk ? o.mouth : 'wobble', lookX: ctx.look('jester_fester') });
    if (t > 94.6 && t < 96.4 && t > 0) Object.assign(o, { jump: 3.2 * Math.sin(Math.PI * seg(t, 95.2, 95.9)), handL: [-5, -11], handR: [5, -11], eyes: 'wide', mouth: 'O', lookY: -.6 });
    if (t > FULL + .4 && t < 142) Object.assign(o, almaDance(t, 'disco', { bpm: 120 }), { power: .7, eyes: 'star' });
    if (t > 142 && t < 158.4) {
      o.lookX = ctx.look(lastSpeaker(t, 'alma') || 'safadi'); o.dy = 0;
      if (t > 148.0 && t < 154.0) { to('L', [-5, -11], 1, 'palm'); to('R', [5, -11], 1, 'palm'); Object.assign(o, { brows: 'angry', lookX: 0, turn: 0, mouth: talk ? o.mouth : 'flat' }); }
      if (t > 151.8 && t < 154) to('R', [4.9, -13.4], 1, 'point');
    }
    if (t > 158.4) Object.assign(o, { lookX: .6, mouth: 'smile', dy: 0, power: 0 });
    return o;
  }
  function safadiPose(t, ctx) {
    const { o, talk, at, to } = common('safadi', t, ctx, { handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', brows: 'normal' });
    o.mouth = lipFlap(t, talk, 'smile', ['smile', 'open', 'o', 'grin', 'smile']);
    if (t < 31) {                                                            // sitting on the grass, leaning back, thermos in hand
      Object.assign(o, { dy: 4.4, footL: [-3.0, -.45], footR: [3.0, -.45], handL: [-5.6, -7.4], handR: [4.2, -13.4], handPoseL: 'palm', handPoseR: 'fist', lean: -.06, eyes: talk ? 'open' : 'narrow', mouth: talk ? o.mouth : 'smirk', lookX: ctx.look('sami') });
      if (t > 9.6 && t < 12) { const j = Math.sin(t * 11); Object.assign(o, { eyes: 'squeeze', mouth: talk ? o.mouth : 'grin', tilt: .04 * j, lookX: 0 }); }
    }
    if (at.moving && at.speed > 350) { const fl = Math.sin(t * 9); Object.assign(o, { handL: [-5.6, -14 + 3 * fl], handR: [5.6, -14 - 3 * fl], handPoseL: 'fist', handPoseR: 'fist', lean: -.08, brows: 'focused', mouth: talk ? o.mouth : 'teeth' }); }
    if (t > 31.5 && t < TACKLE) Object.assign(o, { eyes: 'happy', mouth: 'o', emote: 'music', emoteK: on(t, 31.6, TACKLE, .2) });   // humming
    if (t > 36.4 && t < BREAK + .4) Object.assign(o, { handL: [-6, -13], handR: [6, -13], handPoseL: 'palm', handPoseR: 'palm', dy: 1.2, brows: 'focused', mouth: 'teeth' });
    if (t > BREAK + .2 && t < 38.8) Object.assign(o, { flip: Math.sin((t - BREAK) * 14) < 0, eyes: 'squeeze', mouth: 'wobble' });
    if (t > 40.6 && t < 42.6) { to('L', [-2.4, -19.6], 1, 'palm'); to('R', [2.4, -19.6], 1, 'palm'); Object.assign(o, { mouth: 'O', brows: 'up', lean: .05 }); }
    if (t > 54.5 && t < ALMA_GO) Object.assign(o, { handL: [-5, -12], handR: [5, -12], handPoseL: 'palm', handPoseR: 'palm', dy: 1, brows: 'focused', mouth: 'grin', lookX: ctx.look('alma') });
    if (t > ALMA_GO && t < 61.5) { to('R', [5.8, -17], 1, 'palm'); Object.assign(o, { brows: 'worried', mouth: talk ? o.mouth : 'O' }); }
    if (t > 61.5 && t < 66) Object.assign(o, { dy: 1.6, handL: [-3, -7.2], handR: [3, -7.2], handPoseL: 'palm', handPoseR: 'palm', mouth: 'open', eyes: 'squeeze', brows: 'worried' });
    if (t > 76 && t < 80) Object.assign(o, { dy: 1.6, handL: [-3, -7.2], handR: [3, -7.2], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'open', eyes: 'open', brows: 'worried', lookX: ctx.look('sami') });
    if (t > 86.4 && t < PEN1 - .3 || t > 107 && t < PEN2 - .3) Object.assign(o, { eyes: 'narrow', mouth: 'smirk', brows: 'up', handL: [-4, -9.2], handR: [4, -9.2], handPoseL: 'fist', handPoseR: 'fist' });
    if (t > 111.8 && t < 114) {                                              // the chest bump
      const b = kick(t, 112.0, 5);
      Object.assign(o, UP.safadi, { jump: 2.2 * b, lean: .12 * b, eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: ctx.look('sami') });
    }
    if (t > 114.4 && t < 115.4) Object.assign(o, { footR: [4.2, -1], dy: 2.2, lean: .1, eyes: 'wide', mouth: 'O', handR: [7, -9] });   // whiff
    if (t > 142 && t < 160) {
      Object.assign(o, { lookX: ctx.look(lastSpeaker(t, 'safadi') || 'housam'), mouth: talk ? o.mouth : 'smile', brows: 'up', eyes: t > 148.4 && t < 154 ? 'wide' : 'happy' });
      if (t > 145 && t < 148) to('L', [-6, -13], 1, 'palm');
      if (t > 154.4 && t < 156.4) Object.assign(o, { handL: [-4.4, -13.3], handR: [4.4, -13.3], handPoseL: 'open', handPoseR: 'open', mouth: 'smirk', eyes: 'narrow' });
    }
    if (t > 160) {                                                            // the cooler, the label, the drink
      Object.assign(o, { lookX: ctx.look('sami'), mouth: talk ? o.mouth : 'smirk', eyes: 'narrow', brows: 'up', handR: [4.6, -12.8], handPoseR: 'fist' });
      if (t < 161.8) { to('L', [-5.6, -6.2], on(t, 160.2, 161.8, .2), 'palm'); o.dy = 1.2 * on(t, 160.2, 161.8, .2); }
      if (t > 168.4 && t < 170.6) Object.assign(o, { eyes: t > 169.4 && t < 170 ? 'wink' : 'happy', lookX: 0, turn: 0 });
      const toast = on(t, 170.4, CLINK + .3, .25); if (toast > 0) to('R', [6.4, -16], toast, 'fist');
      const drink = on(t, 171.4, 173.4, .2); if (drink > 0) { to('R', [1.6, -21.2], drink, 'fist'); Object.assign(o, { tilt: -.12 * drink, eyes: 'closed', mouth: 'o', lookX: 0 }); }
      if (t > 173.4) { const j = Math.abs(Math.sin(t * 11)); Object.assign(o, { eyes: 'squeeze', mouth: talk ? o.mouth : j > .5 ? 'grin' : 'open', dy: .3 * j }); }
    }
    return o;
  }
  function samiPose(t, ctx) {
    const { o, talk, at, to } = common('sami', t, ctx, { handL: [-4.4, -8.1], handR: [4.4, -8.1], handPoseL: 'open', handPoseR: 'open', brows: 'up' });
    o.mouth = lipFlap(t, talk, 'grin', ['grin', 'open', 'o', 'smile']);
    if (t < 31) {
      Object.assign(o, { dy: 4.4, footL: [-3.0, -.45], footR: [3.0, -.45], handL: [-3.6, -25.5], handR: [3.6, -25.5], handPoseL: 'palm', handPoseR: 'palm', eyes: 'happy', lookX: ctx.look('safadi') });
      if (t > 9.6 && t < 12) { const j = Math.sin(t * 11 + 1); Object.assign(o, { eyes: 'squeeze', mouth: talk ? o.mouth : 'grin', tilt: .04 * j, lookX: 0 }); }
    }
    const asleep = t > 31 && t < 44.0;
    if (asleep) Object.assign(o, { tilt: .2 + .02 * Math.sin(t * 2.2), lean: .08, dy: .6 + .15 * Math.sin(t * 2.2), handL: [-1.4, -10.2], handR: [1.4, -10.2], handPoseL: 'fist', handPoseR: 'fist', eyes: 'closed', mouth: 'o', blink: 0, lookX: 0, turn: 0 });
    if (t >= 44.0 && t < 47.6) { Object.assign(o, { jump: 1.6 * kick(t, 44.0, 5), eyes: 'open', brows: 'focused', mouth: talk ? o.mouth : 'smirk', lookX: 0, turn: 0 }); to('R', [6.2, -15], 1, 'point'); }
    if (t > 47.6 && t < 49.6) Object.assign(o, { eyes: 'wide', brows: 'worried', mouth: 'wobble', emote: 'sweat', emoteK: on(t, 45.8, 49.6, .2) });
    if (t > 66.2 && t < CHARGE) { Object.assign(o, { eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: ctx.look('alma'), brows: 'up' }); to('R', [5.6, -13.4], 1, 'palm'); }
    if (t > CHARGE && t < 71.4) Object.assign(o, { handL: [-6, -13], handR: [6, -13], handPoseL: 'palm', handPoseR: 'palm', lean: .1, brows: 'focused', mouth: 'teeth' });
    if (t > 76 && t < 80) Object.assign(o, { dy: 1.6, handL: [-3, -7.2], handR: [3, -7.2], handPoseL: 'palm', handPoseR: 'palm', mouth: talk ? o.mouth : 'open', eyes: 'open', brows: 'worried', lookX: ctx.look('safadi') });
    if (t > 92 && t < BOMB) Object.assign(o, { eyes: 'closed', mouth: 'o' });
    if (t > 96.0 && t < 99.2) Object.assign(o, { eyes: 'wide', brows: 'up', mouth: talk ? o.mouth : 'O', handL: [-1.1, -21], handR: [1.1, -21], handPoseL: 'palm', handPoseR: 'palm', lookX: 0, turn: 0 });
    if (t > 111.8 && t < 114) { const b = kick(t, 112.0, 5); Object.assign(o, UP.sami, { jump: 2.2 * b, lean: -.12 * b, eyes: 'happy', mouth: talk ? o.mouth : 'grin', lookX: ctx.look('safadi') }); }
    if (t > 125.2 && t < 126.8) Object.assign(o, { eyes: 'wide', mouth: talk ? o.mouth : 'o', brows: 'worried', handL: [-1.1, -21], handR: [1.1, -21], handPoseL: 'palm', handPoseR: 'palm' });
    if (t > 160) {
      Object.assign(o, { lookX: ctx.look('safadi'), handL: [-4.6, -12.8], handPoseL: 'fist', brows: 'up' });
      if (t > 163.0 && t < 165.4) Object.assign(o, { brows: 'quizzical', eyes: 'narrow', mouth: talk ? o.mouth : 'flat', handL: [-3.6, -16], lookX: -.3 });
      if (t > 165.4 && t < 168.4) Object.assign(o, { eyes: 'wide', mouth: 'O', brows: 'up' });
      if (t > 168.4 && t < 171.4) Object.assign(o, { eyes: 'happy', mouth: 'grin' });
      const toast = on(t, 170.4, CLINK + .3, .25); if (toast > 0) to('L', [-6.4, -16], toast, 'fist');
      const drink = on(t, 171.4, 173.4, .2); if (drink > 0) { to('L', [-1.6, -21.2], drink, 'fist'); Object.assign(o, { tilt: .12 * drink, eyes: 'closed', mouth: 'o', lookX: 0 }); }
      if (t > 173.4) { const j = Math.abs(Math.sin(t * 11 + 1)); Object.assign(o, { eyes: 'squeeze', mouth: talk ? o.mouth : j > .5 ? 'grin' : 'open', dy: .3 * j }); }
    }
    return o;
  }
  function festerPose(t, ctx) {
    const { o, talk, to } = common('jester_fester', t, ctx, { referee: true, handL: [-3.3, -8.4], handR: [3.6, -10.2], handPoseL: 'open', handPoseR: 'fist', brows: 'up', eyes: 'open' });
    o.mouth = lipFlap(t, talk, 'grin', ['open', 'grin', 'o', 'smile']);
    const blow = t0 => on(t, t0 - .5, t0 + .6, .15);
    const b = Math.max(...WHISTLES.map(blow));
    if (b > 0) { to('R', [.7, -15.3], b, 'fist'); Object.assign(o, { eyes: 'squeeze', mouth: 'o', lookX: 0, turn: 0, hatSway: [0, -.8 * b] }); }
    if (t > 45.4 && t < 47.0) Object.assign(o, UP.jester_fester, { jump: 1.2 * kick(t, 45.6, 5) });
    if (t > 47.2 && t < 49.4) to('L', [-5.3, -15.4], 1, 'open');
    if (t > 85.2 && t < 87 || t > 104.0 && t < 106.6) to('L', [-5.6, -12], 1, 'open');                          // pointing to the spot
    const card = on(t, CARD[0], CARD[1], .15); if (card > 0) { to('L', [-3.6, -19.5], card, 'fist'); o.brows = 'angry'; o.lookX = ctx.look('alma'); }
    if (t > FULL + .5 && t < 134) Object.assign(o, UP.jester_fester, { eyes: 'happy' });
    return o;
  }
  const WHISTLES = [WHISTLE2H, 43.6, 84.6, 89.2, 95.8, 103.6, 109.2, 120.5, 123.0, 128.4, FULL];

  // ---------- drawing everyone ----------
  const CAST = {
    housam: { pose: housamPose, rig: housam, unit: HOUSAM_UNIT },
    danny: { pose: dannyPose, rig: danny, unit: DANNY_UNIT },
    jenna: { pose: jennaPose, rig: jenna, unit: JENNA_UNIT },
    alma: { pose: almaPose, rig: alma, unit: ALMA_UNIT },
    safadi: { pose: safadiPose, rig: safadi, unit: SAFADI_UNIT },
    sami: { pose: samiPose, rig: sami, unit: SAMI_UNIT },
    jester_fester: { pose: festerPose, rig: jester, unit: JF_UNIT },
  };
  const PLAY = [[31.5, 43.8], [49.6, 54], [ALMA_GO, 66.2], [DREAM[1], 73.2], [80, 84.4], [PEN1 - .8, 89.4], [BOMB - .3, 96], [99.2, 103.2], [PEN2 - .8, 109.4], [114, 120.6], [FREEKICK - .4, 128.6]];
  function group(t, cam, blur, o = {}) {
    const P = persp(cam), A = {}, S = {}, SX = {};
    const lastGoal = GOALS.filter(([g]) => g <= t).pop(), cheer = lastGoal ? on(t, lastGoal[0], lastGoal[0] + 3, .3) * (lastGoal[1] === 'K' ? 1 : .5) : 0;
    const pos = {};
    for (const n of Object.keys(CAST)) { pos[n] = AT(n)(t); const [sx] = P.p(pos[n].x, 0, pos[n].z); SX[n] = P.depth(pos[n].z) > 1 ? sx : W / 2; }
    const zs = Object.keys(CAST).filter(n => (!SHOWN[n] || SHOWN[n](t)) && P.depth(pos[n].z) > 60 && SX[n] > -400 && SX[n] < W + 400).map(n => pos[n].z);
    const autoSplit = zs.length ? (cam.dir > 0 ? Math.min(...zs) - 60 : Math.max(...zs) + 60) : (cam.dir > 0 ? 9050 : -50);
    const setO = { ...O_BASE(t), splitZ: o.splitZ ?? autoSplit, cheer: Math.max(cheer, on(t, FULL, 142, .4)), ...(o.set || {}) };
    layer(() => F.back(P, t, setO), { blur });
    const bw = ballAt(t), bsx = Array.isArray(bw) && P.depth(bw[2]) > 1 ? P.p(...bw)[0] : W / 2;
    const items = [];
    if (t > 140) items.push({ z: COOL.z + COOL.d / 2 + 5, draw: () => cooler(P, t) });
    if (t > 140) items.push({ z: FOUNT.z, draw: () => fountain(P, t, t > 158.6 && t < 160.5) });
    if (t > 11 && t < 31) items.push({ z: 2700, draw: () => grassDrawing(P, t) });
    for (const [name, c] of Object.entries(CAST)) {
      if (SHOWN[name] && !SHOWN[name](t)) continue;
      const at = pos[name]; if (P.depth(at.z) < 60) continue;
      const ctx = { dir: P.dir, play: inAny(t, PLAY), look: n => clamp((SX[n] - SX[name]) / 420, -.85, .85), ball: clamp((bsx - SX[name]) / 420, -.85, .85) };
      items.push({ z: at.z, draw: () => {
        const [sx, sy, k] = P.p(at.x, 0, at.z), s = c.unit * k, pose = { ...c.pose(t, ctx), t };
        if (o.freeze) pose.boil = 0;
        if (name === 'alma' && P.dir > 0 && P.cam.z < at.z && at.z < 1000) pose.spin = Math.PI;   // camera behind her goal: we see her back
        const roll = name === 'jenna' && t > FULL + .6 && t < 136.2 ? { a: TAU * 2 * ease(seg(t, FULL + .6, 136.2)) * P.dir, h: 12.5 } : null;
        if (roll) {
          const cy = sy - roll.h * s;
          X.save(); X.translate(sx, cy); X.rotate(roll.a); X.translate(-sx, -cy);
          A[name] = c.rig(sx, sy, s, { ...pose, noShadow: true }); X.restore();
        } else A[name] = c.rig(sx, sy, s, pose);
        S[name] = s;
        props(t, name, A[name], s, sx, sy, at);
      } });
    }
    if (Array.isArray(bw)) items.push({ z: bw[2], draw: () => { if (P.depth(bw[2]) < 40) return; const [bx, by, bk] = P.p(...bw); housamBall(bx, by, HOUSAM_UNIT * bk, { radius: R / HOUSAM_UNIT, spin: t * 9 }); } });
    items.sort((a, b) => P.depth(b.z) - P.depth(a.z)).forEach(it => it.draw());
    F.front(P, t, setO);
    return { A, S, SX, P };
  }
  function props(t, name, A, s, sx, sy, at) {
    if (name === 'alma') {
      if (t > 31 && t < 134) gloves(A, s);
      const bh = ballAt(t); if (bh && bh.hold === 'alma') housamBall((A.handL[0] + A.handR[0]) / 2, A.handL[1] - .8 * s, s, { radius: R / ALMA_UNIT });
      dreamBubble(A, s, t);
    }
    if (name === 'jester_fester') { whistleProp(A, s, WHISTLES.some(w => t > w - .4 && t < w + .5)); yellowCard(A, s, on(t, CARD[0], CARD[1], .15)); }
    if (name === 'sami') {
      const asleep = on(t, 31, 44.0, .3);
      if (t < 44.0 && t > 31) { noseBubble(A, s, t, asleep); floaty('z', A.head[0] + 6 * s, A.top[1], s, t, asleep); }
      if (t > 76 && t < 80) sweat(A, s, t, 1);
    }
    if (name === 'safadi') {
      if (t < 31) thermos(A.handR[0], A.handR[1] - 2 * s, s);
      if (t > 61.5 && t < 66 || t > 76 && t < 80) sweat(A, s, t, 1);
    }
    if (name === 'jenna' && t < 31) {                                          // her stick
      const [hx, hy] = A.handR; line([[hx, hy], [hx + 2.4 * s, hy + 3.2 * s]], { stroke: '#8B5A2B', lwPx: Math.max(2, .4 * s) });
    }
    if (name === 'housam') mathVision(A, s, t, Math.max(on(t, 18.4, 22.4, .3), on(t, 118.6, CURL + .2, .2)), t > 100 ? '27°' : 'θ');
    if (at.moving && at.speed > 520) speedLines(A, s, 1, (at.dz || 1) > 0 ? -1 : 1);
    // bottles at the cooler
    if ((name === 'safadi' || name === 'sami') && t > 161.6) {
      const hand = name === 'safadi' ? 'handR' : 'handL', [hx, hy] = A[hand], bs = s * .7, drink = on(t, 171.4, 173.4, .2), sd = name === 'safadi' ? 1 : -1;
      const turnK = name === 'safadi' ? seg(t, 165.6, 166.2) : 0, turn = Math.cos(Math.PI * turnK);
      bottle(hx, hy - 1.2 * bs, bs, { cap: name === 'safadi' ? CAPS[0] : CAPS[1], open: t > 170, ang: sd * (-.1 + 2.2 * drink), side: turnK > .5 ? 'fun' : 'front', turn: Math.abs(turn) < .05 ? .05 : Math.abs(turn) });
    }
  }

  // ---------- callouts ----------
  function bubbles(t, A, S, SX, o = {}) {
    for (const l of LINES) {
      if (l.silentBubble) continue;
      const age = t - l.at; if (age < 0 || age > 12) continue;
      const c = { size: o.size || 50, maxW: o.maxW || 660, cps: l.cps, hold: l.hold, kind: l.kind, accent: ACCENT[l.speaker] };
      if (l.group) {
        const ms = l.group.map(n => A[n]).filter(a => a && a.mouth[0] > 0 && a.mouth[0] < W);
        if (ms.length) {
          const mx = ms.reduce((a, m) => a + m.mouth[0], 0) / ms.length, my = Math.min(...ms.map(m => m.mouth[1]));
          callout(l.text, mx, my - 60, age, { ...c, size: (o.size || 50) * (l.kind === 'shout' ? 1.35 : 1.1), dx: 0, dy: -220 });
          continue;
        }
      }
      const a = A[l.speaker], s = S[l.speaker];
      if (a && a.mouth[0] > 60 && a.mouth[0] < W - 60) {
        const sx = a.mouth[0], right = o.side ? o.side(l.speaker) > 0 : sx < W * .5, mid = !o.side && sx > W * .38 && sx < W * .62;
        const dx = mid ? (sx < W / 2 ? 140 : -140) : (right ? 1 : -1) * (o.far || 360);
        callout(l.text, sx + (right ? 1 : -1) * (HEADW[l.speaker] || 1.5) * s, a.mouth[1] - .6 * s, age, { ...c, dx: o.dx ?? dx, dy: o.dy ?? (mid ? -330 : -250) });
      } else {
        const side = o.off ? o.off(l.speaker) : Math.sign((SX[l.speaker] ?? W / 2) - W / 2);
        const ex = side < 0 ? -30 : side > 0 ? W + 30 : W * .5, ey = side === 0 ? H + 40 : H * .42;
        callout(l.text, ex, ey, age, { ...c, dx: side < 0 ? 420 : side > 0 ? -420 : 0, dy: side === 0 ? -360 : -160 });
      }
    }
  }

  // ---------- cameras ----------
  const cam = (cx, fz, k, feet, f = 2400, dir = 1, y = 120) => ({ x: cx, y, z: fz - dir * f / k, f, hy: feet - y * k, dir });
  const dr = (t, a = 1) => 10 * a * Math.sin(t * .23);
  const shot = (camFn, blur = 1.6, bo = {}, go = {}) => t => {
    const c = camFn(t), { A, S, SX, P } = group(t, c, blur, go);
    extras(t, A, S, P);
    if (!bo.none) bubbles(t, A, S, SX, bo);
  };
  const track = (who, k, dir, f = 2600, cx = .7, lead = 0) => t => { const a = AT(who)(t); return cam(a.x * cx, a.z + lead, k, 1010, f, dir); };
  function scoreboard(t) {                                                   // the scoreboard close-up (any time)
    const f = 1500, z = 9330 + 40 * Math.sin(t * .2), P = persp({ x: 2100, y: 560, z, f, hy: 545 - 10 * f / (10500 - z), dir: 1 });
    F.back(P, t, { ...O_BASE(t), cheer: .4 });
    const [bx, by] = P.p(2100, 700, 10482), last = GOALS.filter(([g]) => g <= t).pop();
    if (last && t - last[0] < 6 && t > 4) sfx('GOAL!', bx + 420, by - 60, 120, PAL.goldLt, t - last[0] - .8, { life: 2.5, rot: .08 });
  }
  const bench = shot(t => cam(2500 + dr(t), 4430, 3.0, 1040, 2400, 1), 2.2, { size: 52 });
  const huddleCam = shot(t => ({ x: 2100 + dr(t), y: 260, z: 2500, f: 1800, hy: -50, dir: 1 }), 1.2, { size: 50 });
  const tackleCam = shot(t => cam(-20 + dr(t), 3950, 2.3 * (1 + .04 * seg(t, 31, 38)), 1000, 2600, 1), 1.2, { size: 52 });
  const dannyRun = shot(track('danny', 3.0, -1), 1.6, { size: 52 });
  const samiSleep = shot(t => cam(-330, 8880, 3.6, 1030, 2400, 1), 2.2, { size: 54 });
  const goalNorth = shot(t => cam(-192, 7800, 2.0, 900, 3600, -1), .8, { size: 52 }, { splitZ: 8700 });
  const goalNorth2 = shot(t => cam(-250, 7320, 1.58, 930, 3600, -1), .8, { size: 52 }, { splitZ: 8700 });
  const winnerCam = shot(t => cam(100, 8000, 2.25, 930, 3600, -1), .8, { size: 52 }, { splitZ: 8750 });
  const samiCam = shot(t => cam(-180 + dr(t), 8800, 3.0, 1030, 2400, 1), 2.2, { size: 54 });
  const notCam = shot(t => cam(-180 + dr(t), 7450, 2.0, 990, 2400, -1), 1.4, { size: 54 });
  const chargeSouth = shot(t => { const a = AT('safadi')(Math.min(t, 52.8)); return cam(a.x * .5, a.z, 2.3, 1010, 3200, 1); }, 1.4, { size: 52 });
  const southGoal = shot(t => cam(-40 + dr(t), 90, 2.3, 960, 2400, -1), 1.8, { size: 54 });
  const almaRun = shot(t => { const a = AT('alma')(t); return cam(a.x * .6 - 60, a.z, 3.2, 1010, 2600, -1); }, 1.6, { size: 52 });
  const iceCam = shot(t => cam(60 + dr(t), 7480, 2.6, 1010, 2400, 1), 1.8, { size: 52, side: n => n === 'sami' ? 1 : -1, off: () => 1 });
  const tiredCam = shot(t => cam(-15 + dr(t), 8680, 3.2, 1030, 2400, 1), 2.2, { size: 54 });
  const grabCam = shot(t => cam(-110, 8100, 2.6, 1010, 2400, 1), 1.4, { size: 52 });
  const charge2 = shot(t => { const a = AT('safadi')(t); return cam(a.x * .5, Math.max(1450, a.z), 2.3, 1010, 3200, 1); }, 1.4, { size: 52 });
  const penaltyCam = shot(t => ({ x: 60 + dr(t), y: 120, z: -600, f: 2600, hy: 540, dir: 1 }), .8, { size: 52 });
  const refCam = shot(t => cam(-120 + dr(t), 1340, 2.8, 1010, 2400, 1), 1.8, { size: 54 });
  const longBall = shot(t => cam(0, 700, 2.4, 1000, 2400, 1, 160), 1.0, { size: 52 });
  const bumpCam = shot(t => cam(130 + dr(t), 4510, 3.0, 1030, 2400, -1), 2.0, { size: 54 });
  const housamRun = shot(track('housam', 3.0, -1), 1.6, { size: 52 });
  const freeKickCam = shot(t => cam(-80 + dr(t), 6900, 1.6, 990, 2400, 1), 1.2, { size: 52 });
  const fullCam = shot(t => cam(-60 + dr(t), 6600, 2.6, 1010, 2400, -1), 1.6, { size: 54 });
  const celebCam = shot(t => cam(60 + dr(t), 6500, 2.2, 1000, 2400, -1), 1.4, { size: 52 });
  const coolerCam = shot(t => cam(2420 + dr(t), 3140, 2.5 * (1 + .03 * seg(t, 142, 155)), 1010, 2400, 1), 1.8, { size: 52 });
  const fountainCam = shot(t => cam(3660 + dr(t), 2380, 2.6, 1010, 2400, 1), 1.8, { size: 52 });
  const twinsCam = shot(t => cam(2620 + dr(t), 3160, 3.4 * (1 + .04 * seg(t, 160, 175)), 1030, 2400, 1), 2.2, { size: 54 });
  // The label, close up: the bottle turns round
  function label(t) {
    layer(() => group(t, cam(2620, 3160, 4.2, 1030, 2400, 1), 0), { blur: 14, filter: 'brightness(.9)' });
    const spin = seg(t, 165.8, 166.4), turn = Math.cos(Math.PI * spin), side = spin > .5 ? 'fun' : 'front';
    const y = H * .52 + 10 * Math.sin(t * 1.3), s = 120 * (1 + .04 * seg(t, 165.6, 168.6));
    overlay(() => {
      bottle(W * .5, y, s, { cap: CAPS[0], side, turn: Math.abs(turn) < .04 ? .04 : Math.abs(turn), ang: .03 * Math.sin(t) });
      if (t > 166.5) {
        const k = backOut(seg(t, 166.5, 166.85));
        X.save(); X.translate(W * .5 + 520, H * .44); X.scale(k, k); X.rotate(.03);
        shape(rectPts(-380, -190, 760, 380), { fill: '#FFFDF4', stroke: PAL.ink, lwPx: 6 });
        X.textAlign = 'center'; X.textBaseline = 'middle';
        X.font = `64px ${FONT_SFX}`; X.fillStyle = PAL.crimson; X.fillText('100% ELECTROLYTES', 0, -105, 700);
        X.fillText('100% SUGAR', 0, 0, 700); X.fillStyle = '#E8A21A'; X.fillText('100% FUN', 0, 105, 700);
        X.restore();
      }
    });
    sfx('!!', W * .5 - 330, H * .25, 120, PAL.goldLt, t - 166.5, { life: .9 });
  }
  function theEnd(t) {
    twinsCam(t);
    iris(W * .5, H * .45, lerp(1500, 0, easeIn(seg(t, 175.2, 177.0))));
    overlay(() => {
      const k = backOut(seg(t, 177.2, 177.7)); if (k <= 0) return;
      X.save(); X.translate(W / 2, H / 2); X.scale(k, k); X.rotate(-.03);
      X.font = `190px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineJoin = 'round';
      X.lineWidth = 26; X.strokeStyle = PAL.ink; X.strokeText('THE END', 0, 0); X.fillStyle = PAL.ink; X.fillText('THE END', 8, 10); X.fillStyle = PAL.goldLt; X.fillText('THE END', 0, 0);
      X.restore();
    });
  }

  // Sound effects riding on top of any shot
  function extras(t, A, S, P) {
    const fe = A.jester_fester;
    for (const w of WHISTLES) {
      if (fe) sfx(w === FULL ? 'TWEEEET!' : 'TWEET!', fe.head[0] + 9 * S.jester_fester, fe.top[1], 74, '#FFFDF4', t - w, { life: .7, rot: -.06 });
      else sfx('TWEET!', W * .5, H * .15, 90, '#FFFDF4', t - w, { life: .7, rot: .05 });
    }
    for (const [g] of GOALS) sfx('GOAL!', W * .5, H * .3, 190, PAL.goldLt, t - g, { life: 1.1 });
    if (A.danny) { const a = A.danny, s = S.danny; sfx('SWIPE!', a.footR[0], a.footR[1] - 6 * s, 70, PAL.goldLt, t - TACKLE, { life: .6, rot: .08 }); sfx('ZOOM!', a.head[0] - 8 * s, a.head[1], 80, PAL.goldLt, t - BREAK - .1, { life: .7 }); }
    if (A.alma) { const a = A.alma, s = S.alma; sfx('SAVE!', a.head[0], a.top[1] - 4 * s, 120, '#9BF0A8', t - SAVE1, { life: 1.2, rot: -.06 }); sfx('POP!', a.head[0] + 9 * s, a.top[1] - 9 * s, 80, PAL.goldLt, t - DREAM[1], { life: .5 }); }
    if (A.safadi) { const a = A.safadi, s = S.safadi;
      for (const tt of [TRIP1, TRIP2]) { sfx('THUD!', a.belly[0], a.belly[1] + 6 * s, 80, '#FF9A6B', t - tt - .35, { life: .6 }); if (t > tt && t < tt + .9) dust(a.belly[0], a.belly[1] + 8 * s, s, t, tt + .3); }
      sfx('THUD!', a.belly[0], a.belly[1] + 6 * s, 70, '#FF9A6B', t - TACKLE - .3, { life: .5 });
      if (A.jenna) sfx('TRIP!', (A.jenna.footR[0] + a.belly[0]) / 2, A.jenna.footR[1] - 4 * s, 64, PAL.goldLt, t - TRIP1, { life: .5, rot: -.1 });
      sfx('BUMP!', a.head[0] + 6 * s * P.dir, a.head[1] - 4 * s, 80, PAL.goldLt, t - 112.0, { life: .6 }); }
    if (A.sami) { const a = A.sami, s = S.sami; sfx('POP!', a.head[0] + 3 * s, a.mouth[1] - 2 * s, 56, '#CFE6FF', t - 44.0, { life: .5 }); sfx('BOOT!', a.belly[0] + 6 * s, a.belly[1] + 4 * s, 80, '#FF9A6B', t - BOMB, { life: .6 }); sfx('CLINK!', a.head[0] + 9 * s, a.top[1] - 2 * s, 80, PAL.goldLt, t - CLINK, { life: .6 }); }
    if (A.housam) sfx('CURL!', A.housam.head[0], A.housam.top[1] - 8 * S.housam, 64, '#BFF4FF', t - CURL, { life: .8 });
  }

  scene({ duration: 180, fps: 24, bpm: 120,                 // id, title, dialogue, music: see asset.js
    shots: [
      [0, scoreboard], [3.0, bench], [12.0, huddleCam], [31.0, tackleCam], [38.0, dannyRun], [41.6, samiSleep], [42.4, goalNorth],
      [43.8, samiCam], [45.4, notCam], [49.0, scoreboard], [50.4, chargeSouth], [53.0, southGoal], [ALMA_GO, almaRun], [66.0, iceCam],
      [71.6, goalNorth2], [74.6, scoreboard], [76.0, tiredCam], [80.0, grabCam], [81.6, charge2], [84.4, refCam], [86.4, penaltyCam],
      [90.6, scoreboard], [92.0, samiCam], [93.6, longBall], [96.0, samiCam], [98.0, scoreboard], [99.2, charge2], [103.4, refCam],
      [107.0, penaltyCam], [110.6, scoreboard], [111.8, bumpCam], [114.0, housamRun], [118.4, goalNorth2], [121.4, scoreboard],
      [122.6, freeKickCam], [126.0, winnerCam], [130.0, scoreboard], [131.0, fullCam], [134.0, celebCam], [142.0, coolerCam],
      [156.4, fountainCam], [160.0, twinsCam], [165.6, label], [168.4, twinsCam], [175.0, theEnd],
    ] });
})();
