// scenes/halloween/scene20b_broccoli_reboot/lyrics.js: the sung words of "The Broccoli Penalty" with their start times (seconds
// into audio.mp3). One row per karaoke line: [lineEnd, who, [[t, word], ...]], who = 'robo' or 'kids' (the colour the words
// light up in). A line shows from just before its first word until lineEnd. How the times were found: README.md, "Timing".
const BR_LYRICS = [
  // boot-up
  [10.0, 'robo', [[8.20, 'Beep.'], [8.73, 'Boop.'], [9.22, 'Rebooting…']]],
  [11.5, 'robo', [[10.24, 'Downloading'], [11.01, 'update…']]],
  [15.4, 'robo', [[11.67, 'Directive'], [12.19, 'two-point-oh!']]],
  // verse
  [19.8, 'robo', [[16.22, 'Four'], [16.78, 'little'], [17.21, 'monsters'], [17.72, 'knocking'], [18.52, 'on'], [18.71, 'my'], [19.02, 'door,']]],
  [23.8, 'robo', [[19.93, 'My'], [20.22, 'scanners'], [20.76, "can't"], [21.28, 'see'], [21.61, 'who'], [21.94, 'you'], [22.16, 'are'], [22.64, 'anymore.']]],
  [27.2, 'robo', [[24.00, 'New'], [24.56, 'directive,'], [25.72, "here's"], [25.96, 'the'], [26.14, 'deal:']]],
  [31.6, 'robo', [[27.50, 'Twist'], [27.89, 'your'], [28.72, 'tongue,'], [29.71, 'or'], [30.19, "broccoli's"], [30.72, 'your'], [31.03, 'meal!']]],
  // chorus
  [33.5, 'robo', [[32.25, 'Twist'], [32.50, 'it'], [32.69, 'or'], [33.01, 'eat'], [33.25, 'it!']]],
  [34.9, 'kids', [[33.70, 'EAT'], [34.20, 'IT!']]],
  [37.6, 'robo', [[34.95, 'Say'], [35.19, 'it'], [35.73, 'five'], [36.21, 'times'], [36.67, 'fast!']]],
  [39.5, 'robo', [[37.95, 'Twist'], [38.25, 'it'], [38.50, 'or'], [38.72, 'eat'], [39.00, 'it!']]],
  [41.0, 'kids', [[39.66, 'EAT'], [40.20, 'IT!']]],
  [43.9, 'robo', [[41.53, 'Or'], [42.00, 'broccoli'], [42.93, 'at'], [43.23, 'last!']]],
  [48.2, 'robo', [[44.17, 'Everybody,'], [45.22, 'everybody,'], [46.55, 'twist'], [46.68, 'it…'], [46.95, 'or'], [47.23, 'eat'], [47.54, 'broccoli!']]],
  // battle 1: Danny (the pumpkin)
  [49.9, 'kids', [[48.30, "Who's"], [48.75, 'inside?']]],
  [54.0, 'robo', [[50.22, "Danny's"], [50.78, 'dizzy'], [51.69, 'cube'], [52.00, 'drops,'], [52.20, "Danny's"], [52.70, 'dizzy'], [53.20, 'cube'], [53.66, 'drops!']]],
  [58.0, 'kids', [[54.22, "Danny's"], [54.64, 'dizzy'], [55.29, 'cube'], [55.67, 'drops,'], [56.23, "Danny's"], [56.65, 'dizzy'], [57.23, 'cube'], [57.64, 'drops!']]],
  [59.8, 'robo', [[58.38, 'CANDY!']]],
  // battle 2: Jenna (the bee)
  [61.9, 'kids', [[60.51, "Who's"], [60.76, 'inside?']]],
  [66.0, 'robo', [[62.28, "Jenna's"], [62.74, 'giraffe'], [63.24, 'giggles,'], [63.72, 'jiggling'], [64.42, 'jelly'], [65.05, 'jars!']]],
  [70.4, 'kids', [[66.22, "Jenna's"], [66.67, 'jiraffe'], [67.22, 'jiggles…'], [67.89, 'giggly…'], [69.06, 'jelly…'], [69.51, 'JARS?']]],
  [71.9, 'robo', [[70.72, 'BROCCOLI!']]],
  // battle 3: Housam (the blue bird)
  [73.9, 'kids', [[72.23, "Who's"], [72.75, 'inside?']]],
  [78.0, 'robo', [[74.19, "Leo's"], [74.77, 'lazy'], [75.54, 'lizard'], [75.72, 'leaps,'], [76.22, "Leo's"], [76.75, 'lazy'], [77.22, 'lizard'], [77.73, 'leaps!']]],
  [82.0, 'kids', [[78.24, "Leo's"], [78.77, 'lazy'], [79.24, 'lizard'], [79.73, 'leaps,'], [80.17, "Leo's"], [80.56, 'lazy'], [81.15, 'lizard'], [81.57, 'leaps!']]],
  [83.9, 'robo', [[82.62, 'CANDY!']]],
  // battle 4: Alma (the pink ghost)
  [85.6, 'kids', [[84.29, "Who's"], [84.77, 'inside?']]],
  [90.0, 'robo', [[85.71, "Molly's"], [86.22, 'messy'], [86.73, 'monkey'], [87.22, 'makes'], [87.73, 'massive'], [88.19, 'chocolate'], [88.72, 'milkshakes!']]],
  [94.3, 'kids', [[90.22, "Molly's…"], [90.72, 'monkey…'], [91.23, 'milk…'], [91.70, 'shake…'], [92.46, 'messy…'], [93.21, 'MONKEY?']]],
  [96.0, 'robo', [[94.70, 'BROCCOLI!']]],
  // chorus
  [97.6, 'robo', [[96.06, 'Twist'], [96.40, 'it'], [96.71, 'or'], [97.00, 'eat'], [97.23, 'it!']]],
  [98.9, 'kids', [[97.72, 'EAT'], [97.99, 'IT!']]],
  [101.9, 'robo', [[99.45, 'Say'], [99.80, 'it'], [100.67, 'five'], [100.97, 'times'], [101.29, 'fast!']]],
  [103.5, 'robo', [[102.00, 'Twist'], [102.30, 'it'], [102.71, 'or'], [103.04, 'eat'], [103.30, 'it!']]],
  [105.0, 'kids', [[103.65, 'EAT'], [103.98, 'IT!']]],
  [107.9, 'robo', [[106.20, 'Or'], [106.52, 'broccoli'], [107.06, 'at'], [107.23, 'last!']]],
  [112.1, 'robo', [[108.53, 'Everybody,'], [109.21, 'everybody,'], [110.21, 'twist'], [110.55, 'it…'], [111.08, 'or'], [111.24, 'eat'], [111.54, 'broccoli!']]],
  // outro
  [114.0, 'robo', [[112.25, 'Game'], [112.63, 'over,'], [113.24, 'humans!']]],
  [117.2, 'robo', [[113.70, 'Beep'], [114.20, 'boop!'], [114.52, 'See'], [115.06, 'you'], [115.26, 'next'], [115.64, 'Halloween!']]],
];

// The karaoke strip along the bottom, as in scene 17: chunky capitals; Robo's words light up broccoli green, the kids' candy orange.
function brKaraoke(t) {
  const row = BR_LYRICS.find(([end, , w]) => t >= w[0][0] - .4 && t < end + .25);
  if (!row) return;
  const [end, who, words] = row, t0 = words[0][0], lit = who === 'kids' ? '#FFC266' : '#9BEA5A', glow = who === 'kids' ? '#FF9E3D' : '#7CFF6B';
  const k = easeOut(seg(t, t0 - .4, t0 - .12)) * (1 - easeIn(seg(t, end, end + .25)));
  if (k < .02) return;
  overlay(() => {
    const size = 62, y = H - 92 + (1 - k) * 40;
    X.save(); X.font = `${size}px ${FONT_SFX}`; X.textBaseline = 'middle'; X.textAlign = 'left'; X.lineJoin = 'round';
    const txt = words.map(w => w[1].toUpperCase()), sp = size * .32, ws = txt.map(s => X.measureText(s).width);
    const total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1), sc = Math.min(1, (W - 160) / total);
    X.translate(W / 2, y); X.scale(sc, sc); X.translate(-W / 2, -y);
    let x = W / 2 - total / 2;
    X.globalAlpha = k;
    X.fillStyle = 'rgba(20,10,24,.55)'; X.beginPath(); X.roundRect(W / 2 - total / 2 - 40, y - size * .72, total + 80, size * 1.36, size * .68); X.fill();
    txt.forEach((s, i) => {
      const ws0 = words[i][0], on = t >= ws0, age = t - ws0, pop = on ? 1 + .28 * Math.max(0, 1 - age / .22) : 1;
      X.save(); X.translate(x + ws[i] / 2, y - (on ? 6 * Math.max(0, 1 - age / .22) : 0)); X.scale(pop, pop);
      X.lineWidth = size * .2; X.strokeStyle = '#1C0F1A'; X.strokeText(s, -ws[i] / 2, 0);
      if (on) { X.shadowColor = glow; X.shadowBlur = 18 * Math.max(.35, 1 - age / .6); }
      X.fillStyle = on ? lit : 'rgba(255,248,236,.62)'; X.fillText(s, -ws[i] / 2, 0);
      X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
