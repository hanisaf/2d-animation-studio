// scenes/the_trolls/scene48c_who_is_inside/lyrics.js: the song "Who's Inside?" (audio.mp3, made with Lyria, see lyria/README.md) as
// karaoke lines.
// WI_LYRICS: one row per caption line: [text, times, end]. `times` holds the start (seconds into the song) of each word of `text`.
// Each line's start and end were timed by Gemini (gemini-pro-latest) on 13 s windows of the recording, given the lyric sheet; the
// riddles all follow one 24 s layout, so a riddle's line that strays more than 0.35 s from the median of the seven takes the median.
// Inside a line the words are spread by syllable count, and the "pop pop…" falls on the measured hits. Fix a time here and the
// karaoke follows. The song is a steady 120 bpm: beats at 0 + 0.5 n s, bars every 2 s. Housam is sung "Hussam".
const WI_LYRICS = [
  ["Seven little monsters on the stage tonight,", [0.05, 0.45, 0.85, 1.25, 1.45, 1.65, 1.85], 2.50],
  ["Twist your tongue and guess who's hiding inside!", [2.55, 2.84, 3.14, 3.44, 3.73, 4.03, 4.32, 4.91], 5.75],
  ["Listen to the riddle, say it fast, say it slow,", [5.80, 6.39, 6.69, 6.98, 7.57, 7.87, 8.17, 8.46, 8.76, 9.05], 9.60],
  ["One, two, three, here we go!", [9.80, 10.24, 10.46, 10.69, 10.91, 11.13], 11.60],
  ["Who's this?", [12.85, 13.18], 13.75],
  ["Fuzzy pumpkin, quick kick tricks, stacks sixty sticky square blocks!", [14.02, 14.49, 14.97, 15.20, 15.44, 15.67, 15.91, 16.38, 16.86, 17.09], 17.58],
  ["Who kicks quick and builds big block towers in his silly socks?", [17.68, 17.96, 18.24, 18.52, 18.80, 19.08, 19.36, 19.64, 20.20, 20.48, 20.76, 21.32], 21.85],
  ["Fuzzy pumpkin, quick kick tricks, stacks sixty sticky square blocks!", [21.95, 22.36, 22.78, 22.99, 23.19, 23.40, 23.61, 24.02, 24.44, 24.64], 25.10],
  ["Who kicks quick and builds big block towers in his silly socks?", [25.20, 25.39, 25.58, 25.76, 25.95, 26.14, 26.33, 26.52, 26.89, 27.08, 27.27, 27.64], 28.08],
  ["Who's inside? Who's inside?", [28.18, 28.45, 28.98, 29.25], 30.03],
  ["It's Danny! Dashing Danny, dribbling, building block by block!", [30.13, 30.32, 30.71, 31.09, 31.48, 31.87, 32.25, 32.44, 32.64], 33.08],
  ["It's Danny! Dashing Danny, dribbling, building block by block!", [33.18, 33.41, 33.87, 34.34, 34.80, 35.26, 35.73, 35.96, 36.19], 36.67],
  ["Who's this?", [36.77, 37.09], 37.67],
  ["Pink ghost glides and twirls and swirls, a sparkly spinning sight!", [37.95, 38.20, 38.44, 38.94, 39.18, 39.43, 39.67, 39.92, 40.17, 40.66, 41.15], 41.65],
  ["Who dances dizzy disco and drew these monsters late at night?", [41.75, 42.00, 42.49, 42.98, 43.48, 43.72, 43.97, 44.22, 44.71, 44.96, 45.20], 45.70],
  ["Pink ghost glides and twirls and swirls, a sparkly spinning sight!", [45.80, 46.01, 46.23, 46.65, 46.86, 47.08, 47.29, 47.50, 47.72, 48.14, 48.57], 49.03],
  ["Who dances dizzy disco and drew these monsters late at night?", [49.13, 49.32, 49.71, 50.09, 50.48, 50.67, 50.86, 51.06, 51.44, 51.63, 51.83], 52.27],
  ["Who's inside? Who's inside?", [52.37, 52.56, 52.94, 53.12], 53.75],
  ["It's Alma! Amazing Alma, the artist who drew us all!", [53.85, 54.08, 54.54, 55.22, 55.68, 55.91, 56.37, 56.59, 56.82, 57.05], 57.53],
  ["It's Alma! Amazing Alma, the artist who drew us all!", [57.63, 57.81, 58.18, 58.74, 59.11, 59.29, 59.66, 59.85, 60.03, 60.22], 60.65],
  ["Who's this?", [60.75, 61.08], 61.65],
  ["Blue bird flips the ball up high and figures how it flies!", [61.95, 62.20, 62.44, 62.69, 62.94, 63.18, 63.43, 63.68, 63.92, 64.66, 64.91, 65.15], 65.65],
  ["Who counts curves and kicks the goal with numbers in his eyes?", [65.75, 66.04, 66.33, 66.91, 67.20, 67.49, 67.78, 68.06, 68.35, 68.93, 69.22, 69.51], 70.05],
  ["Blue bird flips the ball up high and figures how it flies!", [70.15, 70.34, 70.53, 70.71, 70.90, 71.09, 71.28, 71.47, 71.65, 72.22, 72.40, 72.59], 73.03],
  ["Who counts curves and kicks the goal with numbers in his eyes?", [73.13, 73.32, 73.51, 73.90, 74.09, 74.28, 74.47, 74.66, 74.85, 75.24, 75.43, 75.62], 76.06],
  ["Who's inside? Who's inside?", [76.16, 76.43, 76.97, 77.24], 78.03],
  ["It's Housam! High-flying Housam, the hat-trick math whiz!", [78.13, 78.38, 78.87, 79.37, 79.86, 80.11, 80.61, 80.85], 81.35],
  ["It's Housam! High-flying Housam, the hat-trick math whiz!", [81.45, 81.69, 82.16, 82.64, 83.11, 83.35, 83.83, 84.06], 84.55],
  ["Who's this?", [84.65, 84.98], 85.55],
  ["Busy bee bends backwards, bounces, buzzing bright!", [86.17, 86.68, 86.94, 87.20, 87.71, 88.23, 88.74], 89.25],
  ["Who cartwheels quick, then sketches comic heroes left and right?", [89.35, 89.68, 90.33, 90.66, 90.98, 91.63, 92.29, 92.94, 93.27, 93.59], 94.17],
  ["Busy bee bends backwards, bounces, buzzing bright!", [94.27, 94.71, 94.94, 95.16, 95.60, 96.04, 96.49], 96.96],
  ["Who cartwheels quick, then sketches comic heroes left and right?", [97.06, 97.25, 97.63, 97.83, 98.02, 98.40, 98.78, 99.17, 99.36, 99.55], 99.99],
  ["Who's inside? Who's inside?", [100.09, 100.41, 101.06, 101.38], 102.28],
  ["It's Jenna! Jolly Jenna, jumping, drawing jokes!", [102.38, 102.58, 102.98, 103.39, 103.79, 104.19, 104.60], 105.25],
  ["It's Jenna! Jolly Jenna, jumping, drawing jokes!", [105.35, 105.57, 106.01, 106.45, 106.90, 107.34, 107.78], 108.47],
  ["Who's this?", [108.57, 108.89], 109.47],
  ["Stripy cat saws sixty sticks and sends a speedy text!", [109.90, 110.43, 110.69, 110.96, 111.48, 111.75, 112.01, 112.27, 112.54, 113.07], 113.58],
  ["Who spikes the ball and shakes her hair, the rebel coming next?", [113.68, 113.91, 114.36, 114.59, 114.81, 115.04, 115.49, 115.72, 115.94, 116.17, 116.62, 117.07], 117.55],
  ["Stripy cat saws sixty sticks and sends a speedy text!", [117.65, 118.14, 118.39, 118.63, 119.12, 119.37, 119.61, 119.86, 120.10, 120.59], 121.09],
  ["Who spikes the ball and shakes her hair, the rebel coming next?", [121.19, 121.36, 121.69, 121.85, 122.02, 122.18, 122.51, 122.68, 122.84, 123.01, 123.34, 123.67], 124.08],
  ["Who's inside? Who's inside?", [124.18, 124.49, 125.12, 125.43], 126.31],
  ["It's Sarah! Super Sarah, sawing, spiking, so cool!", [126.41, 126.62, 127.04, 127.47, 127.89, 128.31, 128.74, 128.95], 129.41],
  ["It's Sarah! Super Sarah, sawing, spiking, so cool!", [129.51, 129.74, 130.20, 130.66, 131.11, 131.57, 132.03, 132.26], 132.74],
  ["Who's this?", [132.84, 133.17], 133.74],
  ["Hooting owl with happy hearts says healthy habits, please!", [133.82, 134.31, 134.55, 134.80, 135.29, 135.53, 135.78, 136.27, 136.76], 137.25],
  ["Who checks your chest and cheers for greens and broccoli and peas?", [137.35, 137.65, 137.96, 138.26, 138.56, 138.87, 139.17, 139.47, 139.78, 140.08, 140.99, 141.30], 141.85],
  ["Hooting owl with happy hearts says healthy habits, please!", [141.95, 142.39, 142.61, 142.83, 143.27, 143.50, 143.72, 144.16, 144.60], 145.07],
  ["Who checks your chest and cheers for greens and broccoli and peas?", [145.17, 145.36, 145.55, 145.74, 145.93, 146.12, 146.31, 146.50, 146.69, 146.88, 147.45, 147.64], 148.08],
  ["Who's inside? Who's inside?", [148.18, 148.49, 149.11, 149.41], 150.28],
  ["It's Doctor Sami! Silly, smiley Doctor Sami!", [150.38, 150.59, 151.02, 151.45, 151.88, 152.30, 152.73], 153.41],
  ["It's Doctor Sami! Silly, smiley Doctor Sami!", [153.51, 153.73, 154.18, 154.62, 155.07, 155.51, 155.96], 156.65],
  ["Who's this?", [156.75, 157.07], 157.65],
  ["Big bat brings big brainy boards, explains, explains, explains!", [157.95, 158.22, 158.48, 158.75, 159.02, 159.55, 159.82, 160.35, 160.89], 161.67],
  ["Who proves the problems properly, with pointers, chalk and brains?", [161.77, 162.03, 162.56, 162.83, 163.36, 164.15, 164.42, 164.95, 165.21, 165.48], 165.99],
  ["Big bat brings big brainy boards, explains, explains, explains!", [166.09, 166.30, 166.50, 166.71, 166.92, 167.33, 167.54, 167.95, 168.37], 169.03],
  ["Who proves the problems properly, with pointers, chalk and brains?", [169.13, 169.32, 169.70, 169.90, 170.28, 170.85, 171.04, 171.43, 171.62, 171.81], 172.25],
  ["Who's inside? Who's inside?", [172.35, 172.59, 173.06, 173.30], 174.03],
  ["It's Professor Safadi! ...and his twin brother too!", [174.13, 174.36, 175.06, 175.76, 175.99, 176.23, 176.46, 176.93], 177.41],
  ["It's Professor Safadi! ...and his twin brother too!", [177.51, 177.76, 178.51, 179.25, 179.50, 179.75, 180.00, 180.50], 181.00],
  ["Here they are! Let's give a cheer!", [185.13, 185.51, 185.88, 186.64, 187.02, 187.40, 187.77], 188.40],
  ["Pop pop pop pop pop pop pop!", [188.50, 188.75, 189.00, 189.25, 189.50, 189.75, 190.00], 190.40],
  ["Twist it, troll it, now you know,", [191.10, 191.59, 192.09, 192.58, 193.07, 193.56, 194.06], 194.80],
  ["Seven silly monsters in the show!", [194.90, 195.73, 196.57, 197.40, 197.82, 198.23], 198.90],
  ["Twist it, troll it, now you know,", [199.00, 199.46, 199.93, 200.39, 200.86, 201.32, 201.79], 202.50],
  ["Seven silly monsters in the show!", [202.60, 203.57, 204.53, 205.50, 205.98, 206.47], 207.20],
];

// The karaoke strip along the bottom (as in scene 48): chunky crayon-box capitals on a paper pill; sung words light up and the newest
// word pops.
function wiKaraoke(t) {
  const row = WI_LYRICS.find(([, w, end]) => t >= w[0] - .35 && t < end + .2); if (!row) return;
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
      X.fillStyle = lit ? WI_CRAYON[i % WI_CRAYON.length] : '#B9AE9A'; X.fillText(w, 0, 0); X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
const WI_CRAYON = ['#E5466E', '#FF8A3D', '#E0A800', '#4DA650', '#2E7D9A', '#6A3FB0'];
