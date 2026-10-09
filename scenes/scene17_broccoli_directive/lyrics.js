// scenes/scene17_broccoli_directive/lyrics.js: the sung words with their start times (seconds into audio.mp3), from a
// word-level transcription of the song. One row per karaoke line: [lineEnd, [[t, word], ...]]. A line shows from a beat
// before its first word until lineEnd. Fix a word or a time here and the karaoke follows.
const BD_LYRICS = [
  [8.3, [[4.26, 'Beep'], [5.38, 'boop.'], [6.44, 'Sensors'], [7.56, 'locked.']]],
  [18.3, [[14.94, 'Night'], [15.50, 'mode,'], [16.20, 'visual'], [16.70, 'lock'], [17.22, 'active.']]],
  [21.8, [[18.58, 'Trick'], [19.30, 'or'], [19.82, 'treat,'], [20.50, 'data'], [20.94, 'received.']]],
  [26.2, [[22.00, 'Sugar'], [23.50, 'intake'], [24.34, 'levels'], [25.20, 'are'], [25.58, 'critical.']]],
  [29.9, [[26.44, 'Compliance'], [27.32, 'protocol'], [27.96, 'now'], [28.52, 'fully'], [28.92, 'engaged.']]],
  [34.1, [[30.18, 'Food'], [30.90, 'is'], [31.36, 'fuel'], [31.92, 'for'], [32.68, 'your'], [33.04, 'body.']]],
  [37.2, [[34.40, 'Candy'], [34.92, 'makes'], [35.62, 'you'], [36.02, 'crash.']]],
  [41.0, [[37.64, 'Eat'], [38.46, 'your'], [38.88, 'broccoli.']]],
  [44.1, [[41.26, 'Eat,'], [42.38, 'eat,'], [42.86, 'eat,'], [43.30, 'eat.']]],
  [47.6, [[44.38, 'Everybody'], [45.38, 'eats'], [46.16, 'broccoli.']]],
  [57.0, [[52.70, 'System'], [53.70, 'sweeps'], [54.70, 'detecting'], [56.06, 'sugar'], [56.54, 'traces.']]],
  [59.9, [[57.26, 'Carbon-based'], [58.34, 'units'], [58.94, 'must'], [59.22, 'comply.']]],
  [64.4, [[60.06, 'Green'], [61.28, 'nutrition'], [62.20, 'is'], [62.62, 'non-negotiable.']]],
  [68.4, [[64.62, 'Target'], [65.28, 'locked.'], [66.28, 'Prepare'], [66.62, 'for'], [67.12, 'delivery.']]],
  [86.6, [[83.02, 'Eat'], [84.14, 'your'], [84.62, 'broccoli.']]],
  [89.9, [[86.88, 'Eat,'], [88.18, 'eat,'], [88.58, 'eat,'], [89.02, 'eat.']]],
  [93.4, [[90.18, 'Everybody'], [91.30, 'eats'], [91.86, 'broccoli.']]],
  [101.4, [[98.26, 'Mission'], [99.66, 'complete.']]],
  [105.3, [[101.78, 'Eat'], [103.18, 'your'], [103.66, 'broccoli.']]],
  [109.2, [[105.52, 'Everybody'], [106.50, 'eats'], [107.20, 'broccoli.']]],
];

// The karaoke strip along the bottom: chunky capitals, sung words light up broccoli green, the newest word pops.
function bdKaraoke(t) {
  const row = BD_LYRICS.find(([end, w]) => t >= w[0][0] - .45 && t < end + .3);
  if (!row) return;
  const [end, words] = row, t0 = words[0][0];
  const k = easeOut(seg(t, t0 - .45, t0 - .15)) * (1 - easeIn(seg(t, end, end + .3)));
  if (k < .02) return;
  overlay(() => {
    const size = 62, y = H - 92 + (1 - k) * 40;
    X.save(); X.font = `${size}px ${FONT_SFX}`; X.textBaseline = 'middle'; X.textAlign = 'left'; X.lineJoin = 'round';
    const txt = words.map(w => w[1].toUpperCase()), sp = size * .32, ws = txt.map(s => X.measureText(s).width);
    const total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
    let x = W / 2 - total / 2;
    X.globalAlpha = k;
    // a soft dark pill behind the line so it reads on any backdrop
    X.fillStyle = 'rgba(20,10,24,.55)'; X.beginPath(); X.roundRect(W / 2 - total / 2 - 40, y - size * .72, total + 80, size * 1.36, size * .68); X.fill();
    txt.forEach((s, i) => {
      const ws0 = words[i][0], on = t >= ws0, age = t - ws0, pop = on ? 1 + .28 * Math.max(0, 1 - age / .22) : 1;
      X.save(); X.translate(x + ws[i] / 2, y - (on ? 6 * Math.max(0, 1 - age / .22) : 0)); X.scale(pop, pop);
      X.lineWidth = size * .2; X.strokeStyle = '#1C0F1A'; X.strokeText(s, -ws[i] / 2, 0);
      if (on) { X.shadowColor = '#7CFF6B'; X.shadowBlur = 18 * Math.max(.35, 1 - age / .6); }
      X.fillStyle = on ? '#9BEA5A' : 'rgba(255,248,236,.62)'; X.fillText(s, -ws[i] / 2, 0);
      X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
