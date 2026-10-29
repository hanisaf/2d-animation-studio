// scenes/the_trolls/scene48_the_trolls/lyrics.js: the song "Broccoli Socks, Slippery Shoes" (audio.mp3, generated with Gemini from
// gemini/PROMPT.md) as karaoke lines.
// TR_LYRICS: one row per caption line: [text, times, end]. `times` holds the start (seconds into the song) of each word of `text`,
// from a word-level transcription of the recording (faster-whisper) aligned to Gemini's lyric sheet. Where the recognizer heard a
// different number of words, the times are spread evenly between the line's first and last word. The second pass of chorus 1
// (64–80 s) is the first pass shifted by one 16-second phrase: the recognizer loses it in the repetition. Fix a time here and the
// karaoke follows. The song is a steady 120 bpm: beats at 0.1 + 0.5 n s, bars every 2 s.
const TR_LYRICS = [
  ["(One! Two! Three! Let's go!)", [3.46, 4.58, 5.04, 5.48, 6.04], 7.06],
  ["Listen up closely, open your eyes,", [8.22, 8.28, 8.96, 10.08, 10.58, 11.02], 11.61],
  ["The monsters are marching, what a surprise!", [11.66, 12.06, 12.40, 13.00, 13.78, 14.42, 14.72], 15.72],
  ["We are the monsters, we're marching in time,", [16.24, 16.72, 17.19, 17.67, 18.15, 18.63, 19.10, 19.58], 19.75],
  ["Dressed in the costumes and seeking a rhyme.", [20.24, 20.63, 21.03, 21.42, 21.82, 22.21, 22.61, 23.00], 23.55],
  ["A big fuzzy pumpkin with three silly eyes,", [23.62, 23.92, 24.28, 24.88, 25.30, 25.92, 26.28, 26.80], 27.45],
  ["A grumpy old owl in a top-hat disguise.", [27.58, 28.01, 28.45, 28.88, 29.32, 29.75, 30.19, 30.62], 31.25],
  ["The pink ghost is smiling, the blue bird takes flight,", [31.38, 31.78, 32.18, 32.57, 32.97, 33.37, 33.77, 34.16, 34.56, 34.96], 35.25],
  ["We're storming the school with a colorful sight!", [35.36, 35.90, 36.58, 36.86, 37.28, 37.62, 37.98, 38.64], 39.35],
  ["So line up, you students, and get in the ring,", [39.48, 39.90, 40.33, 40.75, 41.18, 41.60, 42.03, 42.45, 42.88, 43.30], 43.45],
  ["It's a tongue-twister battle, let's see what you bring!", [43.94, 44.28, 44.62, 44.96, 45.30, 45.64, 45.98, 46.32, 46.66], 47.70],
  ["Twist it, flip it, say it again!", [47.80, 48.08, 48.35, 48.63, 48.91, 49.18, 49.46], 49.74],
  ["Laugh with your neighbor, tease with a friend!", [49.86, 50.20, 50.40, 50.56, 51.20, 51.24, 51.42, 51.58], 51.78],
  ["Twist it, flip it, get in the groove!", [51.88, 52.22, 52.68, 52.72, 53.26, 53.26, 53.42, 53.58], 53.79],
  ["Watch how the monsters start to move!", [53.84, 54.26, 54.44, 54.58, 54.82, 55.24, 55.54], 55.86],
  ["Twist it, flip it, say it again!", [55.96, 56.20, 56.66, 56.72, 57.20, 57.28, 57.50], 57.81],
  ["Laugh with your neighbor, tease with a friend!", [57.86, 58.08, 58.31, 58.53, 58.75, 58.97, 59.20, 59.42], 59.81],
  ["Twist it, flip it, get in the groove!", [59.86, 60.10, 60.35, 60.59, 60.83, 61.07, 61.32, 61.56], 61.83],
  ["Watch how the monsters start to move!", [61.88, 65.14, 68.39, 71.65, 74.91, 78.16, 81.42], 63.75],
  ["Twist it, flip it, say it again!", [63.80, 64.08, 64.35, 64.63, 64.91, 65.18, 65.46], 65.74],
  ["Laugh with your neighbor, tease with a friend!", [65.86, 66.20, 66.40, 66.56, 67.20, 67.24, 67.42, 67.58], 67.78],
  ["Twist it, flip it, get in the groove!", [67.88, 68.22, 68.68, 68.72, 69.26, 69.26, 69.42, 69.58], 69.79],
  ["Watch how the monsters start to move!", [69.84, 70.26, 70.44, 70.58, 70.82, 71.24, 71.54], 71.86],
  ["Twist it, flip it, say it again!", [71.96, 72.20, 72.66, 72.72, 73.20, 73.28, 73.50], 73.81],
  ["Laugh with your neighbor, tease with a friend!", [73.86, 74.08, 74.31, 74.53, 74.75, 74.97, 75.20, 75.42], 75.81],
  ["Twist it, flip it, get in the groove!", [75.86, 76.10, 76.35, 76.59, 76.83, 77.07, 77.32, 77.56], 77.83],
  ["Watch how the monsters start to move!", [77.88, 81.14, 84.39, 87.65, 90.91, 94.16, 97.42], 81.75],
  ["Step into the gym, let the battles begin,", [81.80, 82.30, 82.81, 83.31, 83.81, 84.31, 84.82, 85.32], 85.55],
  ["With a twist in your tongue and a wide monster grin!", [85.70, 85.90, 86.02, 86.20, 86.40, 86.54, 86.72, 86.88, 86.98, 87.24, 87.60], 87.85],
  ["(Rule number radish! Rule number radish!)", [87.98, 88.24, 88.40, 89.02, 89.26, 89.42], 89.85],
  ["Say that five times while you eat your spinach!", [89.98, 90.20, 90.36, 90.54, 90.80, 90.94, 91.06, 91.28, 91.50], 91.85],
  ["Broccoli socks and a slippery shoe,", [91.96, 92.32, 92.68, 93.04, 93.40, 93.76], 93.91],
  ["I challenge the ghost, now what will you do?", [93.96, 94.16, 94.36, 94.57, 94.77, 94.97, 95.17, 95.38, 95.58], 96.15],
  ["Twist it, flip it, say it again!", [96.26, 96.52, 96.78, 97.04, 97.30, 97.56, 97.82], 98.15],
  ["Laugh with your neighbor, tease with a friend!", [98.22, 98.40, 98.56, 99.12, 99.22, 99.42, 99.58, 99.84], 100.15],
  ["Twist it, flip it, get in the groove!", [100.22, 100.72, 100.76, 101.08, 101.26, 101.42, 101.56, 101.90], 102.15],
  ["Watch how the monsters start to move!", [102.24, 102.42, 102.54, 102.90, 103.24, 103.54, 103.98], 104.15],
  ["Twist it, flip it, say it again!", [104.26, 104.68, 104.74, 105.00, 105.30, 105.50, 105.88], 106.15],
  ["Laugh with your neighbor, tease with a friend!", [106.26, 106.44, 106.60, 107.14, 107.22, 107.42, 107.58, 107.94], 108.15],
  ["Twist it, flip it, get in the groove!", [108.24, 108.70, 108.76, 109.24, 109.24, 109.42, 109.56, 109.88], 110.15],
  ["Watch how the monsters start to move!", [110.24, 110.46, 110.67, 110.89, 111.11, 111.32, 111.54], 112.28],
  ["Now the moment is here, the ultimate test,", [115.18, 115.88, 116.10, 116.56, 116.98, 117.68, 118.08, 118.66], 119.35],
  ["To see which twister is truly the best!", [119.42, 119.94, 120.44, 120.98, 121.42, 121.96, 122.44, 122.98], 123.45],
  ["A dolphin in space wearing bright red shoes,", [123.58, 123.98, 124.38, 124.94, 125.32, 125.90, 126.44, 126.90], 127.55],
  ["Say it so fast that you're making the news!", [127.74, 128.52, 128.66, 128.96, 129.34, 129.64, 129.98, 130.48, 131.02], 131.65],
  ["(One, two, three, let's go!)", [131.78, 132.53, 133.28, 134.03, 134.78], 135.65],
  ["Everyone together now, let it all out,", [136.42, 136.81, 137.20, 137.59, 137.98, 138.37, 138.76], 139.65],
  ["Show the whole world what we're talking about!", [139.78, 140.36, 140.64, 140.98, 141.38, 141.66, 142.02, 142.56], 143.76],
  ["Twist it, flip it, say it again!", [145.66, 146.22, 146.70, 146.72, 147.26, 147.26, 147.46], 147.85],
  ["Laugh with your neighbor, tease with a friend!", [147.90, 148.23, 148.57, 148.90, 149.24, 149.57, 149.91, 150.24], 150.45],
  ["Twist it, flip it, get in the groove!", [150.76, 150.76, 151.28, 151.28, 151.42, 151.60, 151.82, 152.48], 152.83],
  ["Watch how the monsters start to move!", [152.88, 153.27, 153.65, 154.04, 154.43, 154.81, 155.20], 155.35],
  ["Twist it, flip it, say it again!", [156.26, 156.46, 156.67, 156.87, 157.07, 157.28, 157.48], 157.77],
  ["Laugh with your neighbor, tease with a friend!", [157.82, 158.13, 158.44, 158.75, 159.05, 159.36, 159.67, 159.98], 160.21],
  ["Twist it, flip it, get in the groove!", [160.26, 160.58, 160.89, 161.21, 161.53, 161.85, 162.16, 162.48], 162.70],
  ["Watch how the monsters start to move!", [162.86, 163.07, 163.27, 163.48, 163.69, 163.89, 164.10], 165.30],
  ["The heads come off, the laughter rings out,", [167.02, 167.30, 167.59, 167.87, 168.15, 168.43, 168.72, 169.00], 169.31],
  ["That's what a troll's love is all about!", [169.36, 169.75, 170.13, 170.52, 170.90, 171.29, 171.67, 172.06], 172.55],
  ["And look at the back, on the shelf in the hall,", [172.66, 173.00, 173.16, 173.32, 173.62, 173.98, 174.10, 174.48, 174.72, 174.86, 175.22], 175.55],
  ["The dolphin is laughing, the biggest of all!", [175.72, 176.04, 176.37, 176.69, 177.01, 177.33, 177.66, 177.98], 178.60],
];

// The karaoke strip along the bottom: chunky crayon-box capitals on a paper pill; sung words light up and the newest word pops.
function trKaraoke(t) {
  const row = TR_LYRICS.find(([, w, end]) => t >= w[0] - .35 && t < end + .2); if (!row) return;
  const [text, times, end] = row, words = text.split(' '), k = ease(seg(t, times[0] - .35, times[0] - .1)) * (1 - ease(seg(t, end, end + .2)));
  overlay(() => {
    X.save(); X.globalAlpha = k; X.font = `52px ${FONT_SFX}`; X.textBaseline = 'middle';
    const sp = Math.max(X.measureText(' ').width, 20), ws = words.map(w => X.measureText(w).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    const sc = Math.min(1, 1680 / tw), y = H - 70;
    X.translate(W / 2, y); X.scale(sc, sc);
    shape(rectPts(-tw / 2 - 40, -44, tw + 80, 88), { fill: 'rgba(255,250,236,.94)', stroke: PAL.ink, lwPx: 6, smooth: .5 });
    let x = -tw / 2;
    words.forEach((w, i) => {
      const lit = t >= times[i], pop = lit ? 1 + .22 * Math.exp(-(t - times[i]) * 9) : 1;
      X.save(); X.translate(x + ws[i] / 2, 2); X.scale(pop, pop); X.textAlign = 'center';
      X.lineJoin = 'round'; X.lineWidth = 9; X.strokeStyle = lit ? PAL.ink : 'rgba(0,0,0,0)'; if (lit) X.strokeText(w, 0, 0);
      X.fillStyle = lit ? TR_CRAYON[i % TR_CRAYON.length] : '#B9AE9A'; X.fillText(w, 0, 0); X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
const TR_CRAYON = ['#E5466E', '#FF8A3D', '#E0A800', '#4DA650', '#2E7D9A', '#6A3FB0'];
