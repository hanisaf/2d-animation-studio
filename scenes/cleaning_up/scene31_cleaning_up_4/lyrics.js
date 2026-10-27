// scenes/cleaning_up/scene31_cleaning_up_4/lyrics.js: the song "Athens: The Fin-tastic Showdown" as recorded in audio.mp3.
// RVT_LYRICS: one row per karaoke line: [id, who, text, times, end]. `times` holds the start (seconds into the song) of each
// word of `text`, from a word-level transcription of the recording (faster-whisper) corrected to the lyric sheet; `end` is when
// the line's last word dies away. `who` picks the singer's name tag and colour on the karaoke, and whose mouth sings it.
// The recording sings "The chest has burst open with a mighty sound!" (the lyric sheet had it as a sound-effect note) and
// the bracketed sound effects ("Crack! Zap! Ka-chunk!") as words. Fix a time here and the karaoke and the mouths follow.
// RVT_BEATS: the beat times from beat tracking (≈117.5 BPM; Gemini's tempo drifts a little, so the scene pulses on these).
const RVT_LYRICS = [
  // intro
  ['r1', 'robo', 'CLEAN! UP! ATH-ENS!', [5.92, 6.40, 6.94], 7.5],
  ['k1', 'citizens', 'Look out! Run!', [8.26, 8.46, 9.00], 9.3],
  ['r2', 'robo', 'CLEAN! UP! ATH-ENS!', [9.94, 10.40, 11.02], 11.7],
  // verse 1
  ['v1', 'housam', "We've gotta run, we've gotta hide!", [15.68, 16.16, 16.56, 16.86, 17.12, 17.52], 17.76],
  ['v2', 'alma', "He's vacuuming up everyone inside!", [17.86, 18.08, 18.56, 18.80, 19.12], 19.82],
  ['v3', 'jenna', "It's a robotic mess in the public square!", [19.92, 20.08, 20.10, 20.46, 20.80, 21.00, 21.10, 21.36], 21.84],
  ['v4', 'danny', "He's sucking up students from everywhere!", [21.90, 22.06, 22.34, 22.52, 22.80, 23.08], 23.56],
  ['v5', 'housam+jenna', 'To the bathhouse now, we must make haste!', [23.88, 23.98, 24.08, 24.54, 24.76, 25.02, 25.26, 25.56], 26.0],
  ['v6', 'alma+danny', "There's not a single second left to waste!", [26.08, 26.36, 26.48, 26.58, 26.78, 27.02, 27.28, 27.52], 27.68],
  // pre-chorus
  ['p1', 'kids', 'The gears are turning, the vacuum is loud!', [27.68, 28.00, 28.30, 28.52, 28.92, 29.12, 29.40, 29.52], 29.78],
  ['p2', 'kids', "He's sweeping up the entire crowd!", [29.78, 30.06, 30.34, 30.64, 30.90, 31.34], 31.92],
  ['p3', 'kids', 'We need a plan, and we need it fast!', [32.10, 32.32, 32.82, 33.04, 33.54, 33.86, 34.10, 34.54, 34.70], 35.36],
  ['p4', 'kids', 'To make this epic battle last!', [35.36, 35.98, 36.32, 36.58, 37.04, 37.48], 37.92],
  // chorus 1
  ['c1', 'kids', 'Robots vs. Titans! Stand your ground!', [38.22, 39.02, 39.70, 40.16, 40.38, 40.70], 41.32],
  ['c2', 'kids', 'The biggest showdown in this ancient town!', [41.60, 42.04, 42.62, 43.54, 43.88, 44.14, 44.52], 45.26],
  ['c3', 'kids', 'With cogs and gears and mythical might!', [45.80, 46.06, 46.50, 47.00, 47.50, 48.04, 48.60], 49.40],
  ['c4', 'kids', "We're gonna win this colossal fight!", [49.86, 50.14, 50.54, 51.38, 51.86, 52.72], 53.20],
  ['c5', 'kids', 'Robots vs. Titans! Watch the show!', [54.28, 55.04, 55.54, 56.18, 56.50, 56.88], 57.48],
  ['c6', 'kids', "Who will win? We're about to know!", [58.04, 58.38, 58.78, 59.48, 59.54, 59.74, 60.00], 60.44],
  // verse 2
  ['s1', 'safadi', 'Ah, my dear students, why such a fuss?', [61.86, 62.70, 63.04, 63.32, 64.10, 64.30, 64.52, 64.80], 65.4],
  ['s2', 'safadi', "This giant machine shouldn't trouble us!", [65.78, 65.98, 66.48, 67.18, 68.02, 68.50], 69.38],
  ['s3', 'safadi', 'Sit in the water, relax your mind,', [69.94, 70.36, 70.68, 71.02, 71.88, 72.34, 72.72], 73.34],
  ['s4', 'safadi', 'And see what philosophy you can find!', [73.54, 74.02, 74.40, 74.78, 75.46, 76.36, 76.72], 77.36],
  ['s5', 'safadi', 'Gnothi seauton: know thyself, you see!', [77.36, 79.26, 80.18, 80.50, 81.54, 81.92], 82.7],
  ['s6', 'safadi', 'That is the key to true victory!', [86.28, 86.62, 86.78, 86.88, 87.02, 87.18, 87.32], 87.9],
  ['m1', 'sami', "Brother, stop! There's no time to think!", [88.00, 88.50, 88.84, 88.96, 89.04, 89.24, 89.40], 89.9],
  ['m2', 'sami', "The city is right on destruction's brink!", [89.98, 90.12, 90.26, 90.40, 90.56, 90.68, 91.06], 91.4],
  // bridge
  ['b1', 'safadi', 'All right, all right, the lecture must end!', [91.50, 91.80, 92.72, 93.04, 93.88, 94.04, 94.52, 95.04], 95.5],
  ['b2', 'sami', "It's time for a titan we must ascend!", [95.94, 96.16, 96.34, 96.54, 96.68, 96.92, 97.06, 97.36], 97.8],
  ['b3', 'safadi', 'With soap in hand and a watery splash!', [97.94, 98.08, 98.32, 98.56, 98.88, 99.04, 99.14, 99.44], 99.78],
  ['b4', 'sami', "Let's make an entrance and settle this smash!", [100.16, 100.50, 100.80, 101.08, 101.58, 102.02, 102.56, 103.04], 103.5],
  ['b5', 'twins', 'King Neptune! Arise from the sea!', [103.90, 104.08, 104.92, 105.34, 105.76, 106.00], 106.42],
  ['b6', 'twins', 'By the power of the seven seas!', [106.42, 106.74, 107.00, 107.46, 107.88, 108.08, 108.34], 108.68],
  ['x1', 'all', 'Sploosh! Splash! Boom!', [108.74, 109.10, 109.66], 109.95],
  // battle
  ['n1', 'neptune', 'Bow before King Neptune!', [110.00, 110.12, 110.32, 110.54], 110.95],
  ['n2', 'neptune', "Well, you don't have to bow!", [111.06, 111.20, 111.26, 111.40, 111.54, 111.64], 111.9],
  ['n3', 'neptune', 'I am here to save Athens,', [112.14, 112.40, 112.60, 112.74, 112.88, 113.08], 113.6],
  ['n4', 'neptune', 'and I am doing it now!', [113.86, 114.12, 114.44, 114.58, 114.82, 115.06], 115.54],
  ['n5', 'neptune', "That's fin-tastic, wouldn't you say?", [115.96, 116.40, 117.16, 117.38, 117.52], 117.86],
  ['n6', 'neptune', 'This over-sized Hoover is going away!', [118.36, 118.62, 119.30, 119.70, 120.12, 120.64], 121.38],
  ['r3', 'robo', 'CLEAN! UP! ATH-ENS!', [121.84, 122.62, 123.22], 123.96],
  ['r4', 'robo', 'ERROR! MALFUNCTION!', [124.62, 125.42], 125.9],
  ['r5', 'robo', 'Too many people in my chest junction!', [126.14, 126.30, 126.56, 126.82, 127.08, 127.30, 127.50], 127.94],
  ['x2', 'all', 'Crack! Zap! Ka-chunk!', [128.22, 128.62, 129.20], 129.84],
  ['n7', 'neptune', 'With a crack of my trident and a flip of my tail!', [129.90, 130.02, 130.14, 130.36, 130.50, 130.60, 130.88, 131.04, 131.14, 131.24, 131.38, 131.56], 131.9],
  ['n8', 'neptune', 'This giant tin can is destined to fail!', [131.98, 132.10, 132.40, 132.62, 132.86, 133.12, 133.40, 133.60], 134.02],
  ['n9', 'neptune', 'The chest has burst open with a mighty sound!', [134.02, 134.54, 134.80, 135.02, 135.32, 135.74, 136.00, 136.16, 136.70], 137.5],
  // final chorus
  ['f1', 'all', 'Robots vs. Titans! The day has been won!', [138.28, 139.04, 139.32, 139.82, 140.06, 140.40, 140.78, 141.04], 141.4],
  ['f2', 'all', 'The citizens are free and the battle is done!', [141.94, 142.06, 142.62, 143.10, 143.44, 143.84, 144.04, 144.50, 144.84], 145.24],
  ['f3', 'all', 'With a hero from the ocean and kids who stood tall!', [145.80, 146.00, 146.12, 146.44, 146.78, 147.10, 147.50, 148.06, 148.38, 148.66, 148.92], 149.5],
  ['f4', 'all', 'We proved that togetherness can conquer it all!', [149.88, 150.04, 150.42, 150.74, 151.84, 152.08, 152.60, 153.22], 153.64],
  ['f5', 'all', 'Robots vs. Titans! A sight to behold!', [154.30, 155.06, 155.46, 155.88, 156.02, 156.30, 156.70], 157.38],
  ['f6', 'all', 'The greatest adventure that ever was told!', [157.92, 158.06, 158.58, 159.52, 160.02, 160.56, 161.02], 161.36],
  // outro
  ['o1', 'safadi', 'So remember, my friends, when a big job is due,', [161.36, 161.78, 162.82, 162.94, 163.74, 163.86, 164.04, 164.28, 164.70, 165.02], 165.34],
  ['o2', 'safadi', 'The best kind of cleaning is done by… YOU!', [165.88, 165.98, 166.34, 166.74, 166.96, 167.48, 168.02, 168.36, 168.86], 169.4],
  ['o3', 'safadi', 'And of course, knowing oneself!', [170.12, 170.28, 170.38, 170.92, 171.06], 171.5],
  ['o4', 'neptune', "That's fin-tastic!", [171.82, 172.06], 172.6],
];
const RVT_LINE = Object.fromEntries(RVT_LYRICS.map(r => [r[0], r]));
const RVT_BEATS = [
  0.163, 0.697, 1.184, 1.695, 2.183, 2.694, 3.181, 3.669, 4.18, 4.69, 5.201, 5.689, 6.177, 6.664, 7.152, 7.663,
  8.173, 8.707, 9.195, 9.683, 10.194, 10.681, 11.169, 11.68, 12.19, 12.701, 13.189, 13.677, 14.187, 14.675, 15.186, 15.697,
  16.184, 16.695, 17.183, 17.67, 18.181, 18.669, 19.18, 19.691, 20.178, 20.689, 21.177, 21.687, 22.175, 22.686, 23.15, 23.661,
  24.172, 24.683, 25.194, 25.681, 26.146, 26.68, 27.191, 27.678, 28.166, 28.677, 29.187, 29.675, 30.186, 30.697, 31.184, 31.672,
  32.183, 32.694, 33.181, 33.692, 34.18, 34.691, 35.178, 35.689, 36.177, 36.688, 37.175, 37.686, 38.174, 38.684, 39.195, 39.683,
  40.194, 40.681, 41.192, 41.68, 42.191, 42.678, 43.189, 43.7, 44.188, 44.698, 45.186, 45.674, 46.184, 46.695, 47.183, 47.694,
  48.181, 48.692, 49.18, 49.691, 50.178, 50.689, 51.177, 51.688, 52.175, 52.686, 53.174, 53.685, 54.195, 54.706, 55.194, 55.681,
  56.192, 56.68, 57.191, 57.678, 58.189, 58.677, 59.188, 59.675, 60.186, 60.674, 61.185, 61.672, 62.16, 62.694, 63.205, 63.692,
  64.203, 64.691, 65.202, 65.689, 66.2, 66.688, 67.199, 67.686, 68.197, 68.685, 69.195, 69.683, 70.194, 70.705, 71.216, 71.703,
  72.191, 72.702, 73.213, 73.7, 74.211, 74.699, 75.209, 75.697, 76.208, 76.696, 77.206, 77.694, 78.205, 78.716, 79.203, 79.691,
  80.202, 80.689, 81.2, 81.688, 82.199, 82.663, 83.151, 83.638, 84.126, 84.614, 85.101, 85.612, 86.1, 86.61, 87.168, 87.702,
  88.213, 88.723, 89.234, 89.722, 90.233, 90.72, 91.208, 91.719, 92.206, 92.717, 93.228, 93.716, 94.203, 94.714, 95.225, 95.713,
  96.2, 96.711, 97.245, 97.733, 98.22, 98.731, 99.219, 99.73, 100.217, 100.728, 101.216, 101.727, 102.214, 102.725, 103.236, 103.747,
  104.234, 104.722, 105.21, 105.72, 106.208, 106.719, 107.207, 107.717, 108.228, 108.716, 109.227, 109.714, 110.202, 110.713, 111.224, 111.711,
  112.199, 112.71, 113.22, 113.708, 114.219, 114.707, 115.217, 115.728, 116.216, 116.727, 117.214, 117.725, 118.213, 118.724, 119.211, 119.722,
  120.21, 120.721, 121.231, 121.719, 122.207, 122.694, 123.182, 123.693, 124.204, 124.714, 125.202, 125.713, 126.2, 126.711, 127.199, 127.71,
  128.221, 128.708, 129.173, 129.707, 130.218, 130.705, 131.216, 131.704, 132.214, 132.702, 133.19, 133.7, 134.211, 134.699, 135.21, 135.697,
  136.208, 136.719, 137.207, 137.718, 138.205, 138.716, 139.227, 139.714, 140.202, 140.713, 141.224, 141.711, 142.222, 142.71, 143.221, 143.708,
  144.219, 144.707, 145.218, 145.705, 146.216, 146.727, 147.215, 147.725, 148.213, 148.724, 149.211, 149.722, 150.21, 150.721, 151.208, 151.719,
  152.207, 152.718, 153.205, 153.716, 154.227, 154.715, 155.202, 155.713, 156.201, 156.711, 157.222, 157.71, 158.174, 158.685, 159.196, 159.684,
  160.194, 160.682, 161.193, 161.681, 162.191, 162.679, 163.19, 163.677, 164.165, 164.676, 165.164, 165.674, 166.185, 166.696, 167.184, 167.695,
  168.182, 168.67, 169.157, 169.691, 170.249, 170.806, 171.34, 171.851, 172.315,
];

// Singer name tags and colours for the karaoke.
const RVT_WHO = {
  robo: ['ROBO-SAFADI', '#FF4A4A'], citizens: ['CITIZENS', '#F2D9A6'], kids: ['THE KIDS', '#FFC94A'], all: ['EVERYONE', '#FFE27A'],
  housam: ['HOUSAM', '#7FA6FF'], alma: ['ALMA', '#C79BFF'], jenna: ['JENNA', '#FF9CC8'], danny: ['DANNY', '#F2CF5B'],
  'housam+jenna': ['HOUSAM & JENNA', '#B8A8FF'], 'alma+danny': ['ALMA & DANNY', '#E0B3E8'],
  safadi: ['PROFESSOR SAFADI', '#F4C77A'], sami: ['DR. SAMI', '#8AE5B3'], twins: ['SAFADI & SAMI', '#C9E59A'], neptune: ['KING NEPTUNE', '#6FD3FF'],
};
// Is `who` singing at time t? (a word rings for ~.32 s after it starts). Group names count for their members.
function rvtSinging(who, t) {
  for (const [, w, , times, end] of RVT_LYRICS) {
    if (t < times[0] - .05 || t > end) continue;
    if (w !== who && !w.split('+').includes(who) && !(w === 'twins' && (who === 'safadi' || who === 'sami')) &&
        !(w === 'kids' && ['housam', 'alma', 'jenna', 'danny'].includes(who)) && !(w === 'all' && who !== 'robo')) continue;
    if (times.some(x => t >= x && t < x + .32)) return true;
  }
  return false;
}

// The karaoke strip along the bottom: chunky capitals on a dark pill, sung words light up gold, the newest word pops;
// the singer's name tag sits on the pill's top-left corner in their colour.
function rvtKaraoke(t) {
  const row = RVT_LYRICS.find(([, , , w, end]) => t >= w[0] - .45 && t < end + .3);
  if (!row) return;
  const [, who, text, times, end] = row, t0 = times[0], words = text.split(' ');
  const k = easeOut(seg(t, t0 - .45, t0 - .15)) * (1 - easeIn(seg(t, end, end + .3)));
  if (k < .02) return;
  const [name, col] = RVT_WHO[who] || ['', '#FFE27A'];
  overlay(() => {
    let size = 60; X.save(); X.font = `${size}px ${FONT_SFX}`;
    const txt = words.map(w => w.toUpperCase()), measure = () => txt.map(s => X.measureText(s).width);
    let ws = measure(), sp = size * .3, total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
    if (total > W - 260) { size *= (W - 260) / total; X.font = `${size}px ${FONT_SFX}`; ws = measure(); sp = size * .3; total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1); }
    const y = H - 84 + (1 - k) * 40;
    let x = W / 2 - total / 2;
    X.globalAlpha = k; X.textBaseline = 'middle'; X.textAlign = 'left'; X.lineJoin = 'round';
    X.fillStyle = 'rgba(24,12,20,.6)'; X.beginPath(); X.roundRect(W / 2 - total / 2 - 40, y - size * .72, total + 80, size * 1.36, size * .68); X.fill();
    if (name) {
      X.font = `28px ${FONT_SFX}`; const nw = X.measureText(name).width, nx = W / 2 - total / 2 - 20, ny = y - size * .72 - 6;
      X.fillStyle = col; X.beginPath(); X.roundRect(nx, ny - 20, nw + 30, 38, 19); X.fill();
      X.lineWidth = 4; X.strokeStyle = '#1C0F1A'; X.stroke();
      X.fillStyle = '#1C0F1A'; X.fillText(name, nx + 15, ny + 1);
      X.font = `${size}px ${FONT_SFX}`;
    }
    txt.forEach((s, i) => {
      const ws0 = times[i] ?? times[times.length - 1], on = t >= ws0, age = t - ws0, pop = on ? 1 + .26 * Math.max(0, 1 - age / .22) : 1;
      X.save(); X.translate(x + ws[i] / 2, y - (on ? 6 * Math.max(0, 1 - age / .22) : 0)); X.scale(pop, pop);
      X.lineWidth = size * .2; X.strokeStyle = '#1C0F1A'; X.strokeText(s, -ws[i] / 2, 0);
      if (on) { X.shadowColor = col; X.shadowBlur = 18 * Math.max(.35, 1 - age / .6); }
      X.fillStyle = on ? mixCol('#FFE27A', col, .45) : 'rgba(255,248,236,.62)'; X.fillText(s, -ws[i] / 2, 0);
      X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
