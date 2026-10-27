// scenes/talent_show/scene26_perfect_drop/lyrics.js: the song "The Perfect Drop" as recorded in song.mp3, one row per sung line.
// Row: [id, text, times, opts]. `times` holds the start (seconds into the song) of each word of `text`, from a word-level
// transcription of the recording (faster-whisper, aligned to the lyric sheet) and checked against its loudness. Princess Pearl
// sings every line; the karaoke and her mouth read these rows. Fix a time here and the karaoke, her mouth and the shots follow.
// opts: { end } holds the last word; { karaoke: false } sings without a karaoke line (her "Woo-oo" warm-ups).
// The recording differs from the lyric sheet in places: the intro has two "Woo-oo-oo" runs, and the outro "Let the beat drop
// low… Mic drop!" is half-spoken over the last bar. The music stops dead at 146.9 s; the tail after it is the Neptune teaser.
const PD_BPM = 115, PD_BEAT0 = .365;                                          // beat-tracked from song.mp3
const PD_CHORUS = (c, w) => [
  [`${c}.0`, 'We worked hard and solved it', w[0]],
  [`${c}.1`, 'Yes we solved it, yeah!', w[1]],
  [`${c}.2`, 'No more shortcuts, solved it', w[2]],
  [`${c}.3`, 'Watch us solve it now!', w[3]],
  [`${c}.4`, 'We worked hard and solved it', w[4]],
  [`${c}.5`, 'Yes we solved it, yeah!', w[5]],
  [`${c}.6`, 'No more shortcuts, solved it', w[6]],
  [`${c}.7`, 'Watch us solve it now!', w[7]],
];
const PD_LYRICS = [
  // intro
  ['woo1', 'Woo-oo-oo!', [1.0], { end: 3.38, karaoke: false }],
  ['ready', 'Are you ready for the show?', [3.52, 3.82, 4.12, 4.36, 4.54, 4.66]],
  ['woo2', 'Woo-oo-oo!', [5.66], { end: 7.5, karaoke: false }],
  ['go', 'Here we go!', [7.56, 8.02, 8.16]],
  // verse 1
  ['jenna', 'Jenna spins and cartwheels high', [8.64, 8.98, 9.30, 9.66, 10.20]],
  ['alma', 'Alma tries and hits the sky', [10.84, 11.08, 11.54, 11.78, 12.02, 12.26]],
  ['practiced', 'They both practiced every day', [12.96, 13.10, 13.32, 13.78, 14.34]],
  ['smiling', "Now they're smiling all the way", [15.04, 15.26, 15.44, 15.88, 16.32, 16.56]],
  ['housam', 'Housam kicks the soccer ball', [17.18, 17.58, 17.82, 18.12, 18.52]],
  ['crowd', 'Makes the crowd go crazy, all', [19.26, 19.44, 19.66, 19.98, 20.22, 20.70]],
  ['score', 'Perfect score up on the board', [21.16, 21.70, 22.12, 22.38, 22.70, 22.86]],
  ['reward', 'What a wonderful reward!', [23.50, 23.80, 24.32, 24.64]],
  ...PD_CHORUS('C1', [
    [25.48, 25.80, 26.08, 26.44, 26.56, 27.04], [28.10, 28.42, 28.62, 28.98, 29.30], [29.58, 29.98, 30.20, 30.88, 31.20], [32.30, 32.62, 32.84, 33.22, 33.40],
    [33.80, 34.10, 34.40, 34.72, 34.90, 35.26], [36.44, 36.76, 36.98, 37.32, 37.62], [37.84, 38.34, 38.54, 39.16, 39.48], [40.58, 40.90, 41.22, 41.56, 41.76],
  ]),
  // verse 2
  ['danny', 'Danny takes his magic cube', [42.24, 42.60, 43.02, 43.28, 43.66]],
  ['super', 'Solves it like a super dude', [44.16, 44.70, 44.84, 45.12, 45.36, 45.70]],
  ['puggle', 'Then he does the puggle trick', [46.06, 46.42, 46.78, 47.18, 47.42, 47.92]],
  ['trophies', 'Winning trophies super quick', [48.66, 48.98, 49.34, 49.88]],
  ['drink', 'There is no such magic drink', [50.34, 50.90, 51.10, 51.32, 51.56, 52.04]],
  ['think', 'You just have to stop and think', [52.42, 52.92, 53.22, 53.44, 53.64, 53.94, 54.18]],
  ['practice', 'Practice hard and play your best', [54.84, 55.16, 55.58, 55.76, 56.06, 56.28]],
  ['test', 'That will beat the hardest test', [56.66, 57.14, 57.36, 57.58, 57.86, 58.28]],
  ...PD_CHORUS('C2', [
    [58.72, 59.20, 59.44, 59.82, 59.94, 60.38], [61.48, 61.80, 62.02, 62.36, 62.72], [63.00, 63.38, 63.60, 64.02, 64.60], [65.70, 66.02, 66.24, 66.62, 66.78],
    [67.20, 67.50, 67.76, 68.12, 68.28, 68.68], [69.84, 70.16, 70.36, 70.70, 71.10], [71.34, 71.72, 71.92, 72.64, 72.96], [74.00, 74.32, 74.60, 74.96, 75.14],
  ]),
  // bridge
  ['prof', 'Professor Safadi speaks so clear', [75.54, 75.90, 76.38, 76.82, 77.18]],
  ['ear', 'Listen up and lend an ear', [77.64, 78.06, 78.52, 78.76, 79.02, 79.28]],
  ['shortcut', 'A shortcut does not exist', [79.58, 80.02, 80.44, 80.82, 81.12]],
  ['fist', 'Practice with an open fist', [81.68, 82.24, 82.66, 82.94, 83.30]],
  ['learn', 'Now we know just how to learn', [83.76, 84.26, 84.48, 84.78, 85.00, 85.32, 85.48]],
  ['turn', "That's the only way we turn", [85.90, 86.42, 86.58, 86.98, 87.36, 87.56]],
  ['drop', 'We all did the perfect drop', [87.94, 88.44, 88.70, 88.90, 89.16, 89.58]],
  ['kings', "We're the kings and we won't stop!", [90.02, 90.60, 90.72, 91.06, 91.30, 91.52, 91.86]],
  ...PD_CHORUS('C3', [
    [92.20, 92.60, 92.86, 93.18, 93.34, 93.74], [94.90, 95.22, 95.42, 95.76, 96.12], [96.40, 96.78, 97.00, 97.66, 97.98], [99.08, 99.40, 99.64, 100.00, 100.16],
    [100.54, 100.94, 101.16, 101.52, 101.68, 102.04], [103.24, 103.56, 103.76, 104.12, 104.50], [104.70, 105.12, 105.32, 106.04, 106.82], [107.14, 107.70, 107.98, 108.34, 108.58],
  ]),
  // (guitar solo, 109–125.3)
  ...PD_CHORUS('C4', [
    [125.66, 125.98, 126.24, 126.54, 126.68, 127.12], [128.24, 128.58, 128.80, 129.18, 129.40], [130.00, 130.18, 130.36, 130.78, 131.38], [132.36, 132.82, 133.08, 133.42, 133.58],
    [134.14, 134.34, 134.58, 134.92, 135.06, 135.34], [136.78, 136.88, 137.14, 137.52, 137.76], [138.40, 138.54, 138.68, 138.98, 139.72], [140.76, 141.08, 141.40, 141.72, 141.92],
  ]),
  // outro
  ['low', 'Let the beat drop low…', [143.40, 143.70, 144.02, 144.24, 144.54], { end: 145.2 }],
  ['mic', 'MIC DROP!', [145.70, 146.04], { end: 146.5 }],
].map(([id, text, times, o = {}]) => {
  const words = [], re = /\S+/g; let m, i = 0, last = times[0];
  while ((m = re.exec(text))) { if (/[\wÀ-ɏ]/.test(m[0])) last = times[i++]; words.push([last, m[0]]); }
  if (i !== times.length) throw new Error(`lyrics.js: "${text}" has ${i} words but ${times.length} times`);
  return { id, at: times[0] - .2, text, words, ...o };
}).sort((a, b) => a.at - b.at);

const pdRow = id => PD_LYRICS.find(r => r.id === id) || (() => { throw new Error(`lyrics.js: no line "${id}"`); })();
const pdWordAt = (id, i) => pdRow(id).words.filter(([, w]) => /[\wÀ-ɏ]/.test(w))[i][0];
// How long a word rings out: about its length, cut short by the next word.
const pdWordEnd = (row, i) => {
  const [t, w] = row.words[i], next = row.words.slice(i + 1).find(([tn]) => tn > t);
  if (!next && row.end) return row.end;
  const len = .14 + .07 * w.replace(/[^\wÀ-ɏ]/g, '').length;
  return next ? Math.min(next[0] - .04, t + len) : t + Math.min(len, .7);
};
const pdLineEnd = row => pdWordEnd(row, row.words.length - 1);
// Is Pearl singing at t? (her beak flaps while a word is ringing out)
function pdSinging(t) {
  for (const r of PD_LYRICS) {
    if (t < r.at || t > pdLineEnd(r)) continue;
    for (let i = 0; i < r.words.length; i++) if (t >= r.words[i][0] && t < pdWordEnd(r, i)) return true;
  }
  return false;
}

// The karaoke strip: a dark ribbon along the bottom, Pearl's pink chip on the left, each word lights up gold as it's sung.
function pdKaraoke(t) {
  let row = null;
  for (const r of PD_LYRICS) if (r.karaoke !== false && t >= r.at - .35 && t < pdLineEnd(r) + .55) row = r;
  if (!row) return;
  const words = row.words, fadeIn = clamp((t - row.at + .35) / .25), fadeOut = 1 - clamp((t - pdLineEnd(row) - .3) / .25);
  const a = Math.min(fadeIn, fadeOut); if (a <= 0) return;
  overlay(() => {
    X.save(); X.globalAlpha = a;
    let size = 58; X.font = `${size}px ${FONT_SFX}`;
    const total = words.reduce((s, [, w]) => s + X.measureText(w).width, 0) + size * .36 * (words.length - 1);
    const maxW = W - 560; if (total > maxW) { size *= maxW / total; X.font = `${size}px ${FONT_SFX}`; }
    const ws = words.map(([, w]) => X.measureText(w).width), tot = ws.reduce((s, w) => s + w, 0) + size * .36 * (words.length - 1);
    const cy = H - 74, x0 = W / 2 + 130 - tot / 2;
    X.fillStyle = 'rgba(30,18,34,.62)'; X.beginPath(); X.roundRect(x0 - 40, cy - size * .78, tot + 80, size * 1.56, size * .5); X.fill();
    const name = 'PRINCESS PEARL';
    X.font = `30px ${FONT_SFX}`; const cw = X.measureText(name).width + 34;
    X.save(); X.translate(x0 - 60 - cw, cy); X.rotate(-.04);
    X.fillStyle = '#E26AA6'; X.strokeStyle = '#2B1A26'; X.lineWidth = 5; X.beginPath(); X.roundRect(0, -24, cw, 48, 14); X.fill(); X.stroke();
    X.fillStyle = '#FFFDF4'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(name, cw / 2, 2);
    X.restore();
    X.font = `${size}px ${FONT_SFX}`; X.textBaseline = 'middle'; X.textAlign = 'left'; X.lineJoin = 'round';
    let x = x0;
    words.forEach(([tw, w], i) => {
      const on = t >= tw, age = t - tw, pop = on && age < .25 ? 1 + .1 * Math.sin(age / .25 * Math.PI) : 1;
      X.save(); X.translate(x + ws[i] / 2, cy); X.scale(pop, pop);
      X.lineWidth = size * .2; X.strokeStyle = '#2B1A26'; X.strokeText(w, -ws[i] / 2, 0);
      X.fillStyle = on ? '#FFD84A' : 'rgba(255,253,244,.88)'; X.fillText(w, -ws[i] / 2, 0);
      X.restore();
      x += ws[i] + size * .36;
    });
    X.restore();
  });
}
