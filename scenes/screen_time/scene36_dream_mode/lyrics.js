// scenes/screen_time/scene36_dream_mode/lyrics.js: the song "High Scores and Hugs" (audio.mp3, generated with Gemini) as karaoke lines.
// DM_LYRICS: one row per caption line: [text, times, end]. `times` holds the start (seconds into the song) of each word of `text`,
// from a word-level transcription of the recording (faster-whisper) aligned to Gemini's lyric sheet; `end` is when the line clears.
// Lines the recording doesn't sing (the lyric sheet's "Drop a block…", "Block head…", "Block party!", "Warning! Final boss…",
// "One last stand, fire away…") are left out. Fix a time here and the karaoke follows.
const DM_LYRICS = [
  ["Game night is over… close your eyes…", [0.88, 1.44, 1.84, 2.06, 2.66, 3.14, 3.44], 4.03],
  ["(snore) …one more level… (snore)", [4.08, 4.96, 5.14, 5.32, 6.60], 7.43],
  ["Press start! Insert dream!", [7.99, 8.34, 9.64, 9.99], 10.49],
  ["DREAM MODE… GAME ON!", [12.00, 12.55, 13.00, 13.50], 15.25],
  ["Pick a world and let the dream begin,", [15.64, 16.20, 16.46, 16.74, 16.94, 17.10, 17.28, 17.44], 17.97],
  ["when we play together everyone will win!", [18.02, 18.16, 18.28, 18.42, 18.98, 19.34, 19.54], 19.95],
  ["We're chasing all the high scores, flying through the sky,", [20.00, 20.04, 20.24, 20.42, 20.54, 20.70, 20.86, 21.24, 21.42, 21.52], 21.97],
  ["reaching for the stars up so incredibly high!", [22.02, 22.26, 22.40, 22.52, 22.74, 22.94, 23.04, 23.38], 24.13],
  ["World one! Robo Invasion!", [24.24, 24.48, 25.14, 25.44], 26.11],
  ["Mission… research… space!", [26.16, 27.08, 27.43], 27.65],
  ["Blast off past the planets, through the stars we race,", [27.76, 28.30, 28.52, 28.76, 28.92, 29.22, 29.44, 29.52, 29.66, 29.82], 30.09],
  ["we are on a mission researching deep space!", [30.14, 30.18, 30.32, 30.46, 30.54, 31.06, 31.41, 31.76], 31.69],
  ["Wingmen left and right, the formation's tight,", [32.08, 32.44, 32.70, 32.94, 33.26, 33.30, 33.84], 34.07],
  ["flying through the galaxy with all our might!", [34.12, 34.24, 34.42, 34.54, 34.80, 35.08, 35.24, 35.46], 35.95],
  ["Here they come, the robots, marching in a line,", [36.00, 36.18, 36.26, 36.50, 36.58, 36.82, 37.28, 37.42, 37.56], 38.01],
  ["dodging all the obstacles and doing just fine!", [38.06, 38.28, 38.46, 38.56, 38.88, 39.08, 39.20, 39.46], 40.04],
  ["Formulas are flying, we're saving the day,", [40.09, 40.44, 40.54, 40.98, 41.04, 41.22, 41.48], 41.97],
  ["clearing out the bad guys so we can go play!", [42.02, 42.24, 42.46, 42.54, 42.78, 42.98, 43.20, 43.30, 43.50, 43.85], 43.83],
  ["Rainbow shield, nothing getting through!", [44.06, 44.34, 45.00, 45.22, 45.46], 45.95],
  ["Watch a barrel roll and what we can do!", [46.00, 46.15, 46.29, 46.44, 46.76, 47.08, 47.18, 47.28, 47.40], 47.75],
  ["We're the absolute best team that can be found!", [47.80, 48.20, 48.28, 48.62, 48.94, 49.16, 49.32, 49.36, 49.52], 50.15],
  ["Game on! Dream on!", [50.28, 50.44, 50.68, 50.78], 50.97],
  ["Playing all together, level up, one more round, this lasts forever!", [51.02, 51.26, 51.44, 51.86, 51.98, 52.24, 52.44, 52.56, 52.82, 52.98, 53.22], 53.87],
  ["Level clear! Extra life!", [54.28, 54.48, 55.04, 55.39], 55.65],
  ["High score in sight, winning as a team with all our mighty might!", [55.86, 56.16, 56.34, 56.53, 56.71, 56.89, 57.08, 57.26, 57.46, 57.56, 57.74, 57.82, 58.04], 58.57],
  ["World two!", [62.04, 62.44], 63.05],
  ["World Champion!", [63.22, 63.48], 64.13],
  ["Five stars on the screen!", [64.30, 64.46, 64.70, 64.94, 65.02], 65.59],
  ["Kick-off whistle, everyone is in the middle,", [66.00, 66.60, 66.70, 67.02, 67.32, 67.44, 67.52], 67.85],
  ["step-over, step-over, solve another riddle!", [67.90, 68.02, 68.52, 69.10, 69.46], 69.95],
  ["Looking like champions, we're taking it to the court,", [70.00, 70.20, 70.46, 70.72, 70.98, 71.18, 71.30, 71.42, 71.52], 71.87],
  ["showing everybody the importance of this sport!", [71.92, 72.32, 72.60, 72.92, 73.20, 73.36, 73.52], 74.03],
  ["Pass it to the left, pass it to the right,", [74.08, 74.22, 74.32, 74.44, 74.56, 74.90, 75.12, 75.30, 75.42, 75.54], 75.95],
  ["keeping all the action shining in the light!", [76.00, 76.24, 76.44, 76.56, 77.26, 77.26, 77.44, 77.56], 77.99],
  ["Combo two, combo three, four and five,", [78.04, 78.40, 79.08, 79.22, 79.50, 79.62, 79.74], 80.17],
  ["this is how we keep the dreaming team alive!", [80.22, 80.40, 80.56, 80.68, 80.78, 80.92, 81.06, 81.30, 81.46], 81.93],
  ["Bicycle kick in super slow motion,", [82.10, 82.48, 82.72, 83.06, 83.22, 83.40], 83.83],
  ["off the header and into the ocean!", [83.88, 84.20, 84.46, 84.72, 84.98, 85.40, 85.56], 86.03],
  ["GOAL! GOAL! GOAL!", [86.08, 86.86, 87.02], 87.67],
  ["High-five all around, we're the absolute happiest team that can be found!", [88.36, 89.20, 89.46, 89.84, 89.98, 90.06, 90.36, 91.00, 91.28, 91.52, 91.72, 92.00], 92.77],
  ["World three! Craft blocks!", [99.94, 100.46, 101.20, 101.46], 102.09],
  ["Who needs cubes? WE DO!", [102.22, 102.40, 102.62, 103.28, 103.46], 103.99],
  ["Block by block, we are building it tall,", [104.04, 104.24, 104.46, 104.70, 104.92, 105.02, 105.28, 105.50], 105.95],
  ["stronger together and we'll never ever fall!", [106.00, 106.34, 106.64, 106.92, 107.02, 107.22, 107.46], 107.97],
  ["Stack them high, up into the air,", [108.02, 108.16, 108.48, 108.82, 109.14, 109.38, 109.56], 109.89],
  ["creating a world that is incredibly fair!", [109.94, 110.24, 110.56, 110.78, 110.94, 111.06, 111.46], 111.48],
  ["Sssss… something is creeping and getting real near,", [111.53, 111.88, 112.72, 112.92, 113.24, 113.58, 113.74, 113.98], 114.45],
  ["the silliest broccoli is about to appear…", [114.50, 114.56, 114.88, 115.22, 115.48, 115.66, 115.82], 116.27],
  ["BROCCOLI BOOM!", [116.32, 116.67], 116.65],
  ["Flying everywhere in the air,", [117.28, 117.28, 117.58, 117.84, 117.94], 118.19],
  ["but I will eat it all up without any care!", [118.24, 118.32, 118.44, 118.56, 118.72, 118.82, 118.96, 119.10, 119.24, 119.54], 119.85],
  ["Twist it, turn it, a puzzle in the sky,", [119.90, 120.24, 120.58, 120.72, 120.96, 121.06, 121.24, 121.44, 121.52], 121.99],
  ["we are all solving it as we are flying high!", [122.04, 122.18, 122.32, 122.46, 122.76, 122.94, 123.06, 123.20, 123.28, 123.52], 124.21],
  ["Mind blown! Game on! Solving it together,", [124.28, 124.48, 124.66, 124.84, 125.02, 125.24, 125.46], 126.01],
  ["this dreaming team is gonna go on forever!", [126.06, 126.22, 126.54, 126.68, 126.82, 126.96, 127.20, 127.40], 127.95],
  ["Fight Planet! Brother versus brother!", [135.98, 136.42, 137.06, 137.26, 137.50], 138.05],
  ["Round one… fight!", [138.26, 138.48, 139.20], 139.79],
  ["Explain-o-beam! Let me show you what I know!", [140.24, 140.58, 140.96, 141.04, 141.24, 141.46, 141.78, 142.00], 142.49],
  ["Healthy-doken! Watch the apples as they go!", [142.54, 144.24, 144.44, 144.60, 144.78, 144.96, 145.06], 145.67],
  ["Sibling rivalry, it's a battle for the crown,", [147.97, 148.32, 148.52, 148.96, 149.08, 149.24, 149.40, 149.54], 149.83],
  ["but as a family we will never let each other down!", [149.88, 149.98, 150.08, 150.18, 150.28, 150.68, 150.78, 150.96, 151.20, 151.32, 151.48], 151.99],
  ["DOUBLE K.O.!", [152.04, 152.24], 152.71],
  ["We both win when we hug it out,", [152.76, 152.78, 152.98, 153.24, 153.42, 153.54, 153.70, 153.82], 154.17],
  ["that's what family is always all about!", [154.22, 154.48, 154.52, 154.80, 155.08, 155.28, 155.44], 155.99],
  ["High score in love and a champion high-five,", [156.04, 156.16, 156.32, 156.56, 156.74, 156.94, 157.02, 157.24], 157.87],
  ["this is the feeling that makes us feel alive!", [158.02, 158.20, 158.40, 158.54, 158.74, 159.00, 159.20, 159.30, 159.46], 159.84],
  ["Game on! Dream on!", [159.89, 160.24, 160.56, 160.72], 161.19],
  ["Together as a family we're gonna win the day!", [161.96, 161.98, 162.44, 162.54, 162.80, 163.02, 163.20, 163.42, 163.52], 163.97],
  ["Hit after hit, yeah we are almost there,", [164.02, 164.22, 164.50, 164.84, 164.96, 165.18, 165.32, 165.50], 165.97],
  ["high scores and victory are floating in the air—", [166.02, 166.20, 166.38, 166.54, 166.76, 167.02, 167.24, 167.44, 167.56], 168.09],
  ["Game over? Continue?", [168.26, 168.66, 169.28], 169.63],
  ["Nine… eight… seven… six…", [169.68, 171.36, 171.46, 171.56], 172.03],
  ["Wake up! Good morning!", [172.10, 172.36, 172.90, 173.02], 173.49],
  ["What a dream… board games?", [173.54, 173.66, 173.78, 174.00, 174.26], 174.87],
  ["The end.", [175.84, 175.96], 176.24],
];

// The karaoke strip along the bottom: chunky capitals on a dark neon-edged pill; sung words light up gold and the newest word
// pops. No singer names, just the words. Long lines shrink to fit.
function dmKaraoke(t) {
  const row = DM_LYRICS.find(([, w, end]) => t >= w[0] - .4 && t < end + .25);
  if (!row) return;
  const [text, times, end] = row, words = text.split(' ');
  const k = easeOut(seg(t, times[0] - .4, times[0] - .12)) * (1 - easeIn(seg(t, end, end + .25)));
  if (k < .02) return;
  overlay(() => {
    let size = 58; X.save(); X.font = `${size}px ${FONT_SFX}`;
    const txt = words.map(w => w.toUpperCase()), widths = () => txt.map(s => X.measureText(s).width);
    let ws = widths(), sp = size * .3, total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
    if (total > W - 240) { size *= (W - 240) / total; X.font = `${size}px ${FONT_SFX}`; ws = widths(); sp = size * .3; total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1); }
    const y = H - 70 + (1 - k) * 40;
    let x = W / 2 - total / 2;
    X.globalAlpha = k; X.textBaseline = 'middle'; X.textAlign = 'left'; X.lineJoin = 'round';
    X.fillStyle = 'rgba(12,8,28,.66)'; X.beginPath(); X.roundRect(W / 2 - total / 2 - 36, y - size * .72, total + 72, size * 1.36, size * .68); X.fill();
    X.lineWidth = 3; X.strokeStyle = rgba(DM.cyan, .55); X.stroke();
    txt.forEach((s, i) => {
      const ws0 = times[i] ?? times[times.length - 1], on = t >= ws0, age = t - ws0, pop = on ? 1 + .24 * Math.max(0, 1 - age / .22) : 1;
      X.save(); X.translate(x + ws[i] / 2, y - (on ? 6 * Math.max(0, 1 - age / .22) : 0)); X.scale(pop, pop);
      X.lineWidth = size * .2; X.strokeStyle = '#120A1E'; X.strokeText(s, -ws[i] / 2, 0);
      if (on) { X.shadowColor = DM.neon; X.shadowBlur = 16 * Math.max(.35, 1 - age / .6); }
      X.fillStyle = on ? DM.gold : 'rgba(255,248,236,.6)'; X.fillText(s, -ws[i] / 2, 0);
      X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
