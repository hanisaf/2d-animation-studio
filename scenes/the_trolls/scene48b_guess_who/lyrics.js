// scenes/the_trolls/scene48b_guess_who/lyrics.js: the song "Twist It, Troll It" (audio.mp3, generated with Gemini) as karaoke lines.
// GW_LYRICS: one row per caption line: [text, times, end]. `times` holds the start (seconds into the song) of each word of `text`,
// from a word-level transcription of the recording (faster-whisper) aligned to Gemini's lyric sheet; where the recognizer heard a
// different number of words, the times are spread evenly between the line's first and last word. The recording sings "Now pull
// off the masks" twice and leaves out the sheet's "Princess Pearl, King Neptune, and Dragon are free!", so those rows follow the
// recording. Fix a time here and the karaoke follows. The song is a steady 120 bpm: beats at 0.1 + 0.5 n s.
const GW_LYRICS = [
  ["Welcome kids to the ultimate test!", [8.32, 9.14, 9.42, 9.84, 10.12, 10.52], 11.83],
  ["Which monster is who? Can you guess the best?", [12.08, 12.32, 12.62, 13.08, 13.94, 14.30, 14.54, 14.78, 15.06], 15.79],
  ["The first one is big with a one-fanged grin!", [16.04, 16.23, 16.43, 16.62, 16.82, 17.02, 17.21, 17.41, 17.60], 18.10],
  ["Guess my name and the game can begin!", [18.14, 18.26, 18.56, 18.76, 18.90, 19.04, 19.20, 19.40], 20.10],
  ["Grey wings flap, green spots on my back!", [20.20, 20.24, 20.46, 20.74, 20.98, 21.22, 21.40, 21.56], 21.90],
  ["I love to explain when I'm on the attack!", [21.92, 22.04, 22.24, 22.40, 22.72, 22.92, 23.14, 23.26, 23.44], 24.00],
  ["Who am I, with my big blue wings?", [24.06, 24.22, 24.46, 24.74, 24.88, 25.06, 25.24, 25.44], 26.00],
  ["Tell me the name that the mystery brings!", [26.06, 26.22, 26.38, 26.56, 26.72, 26.88, 27.04, 27.38], 27.80],
  ["Is it the doctor or professor so grand?", [27.80, 28.05, 28.29, 28.54, 28.78, 29.03, 29.27, 29.52], 30.00],
  ["Try not to trip on the words in your hand!", [30.04, 30.22, 30.40, 30.54, 30.72, 30.90, 31.06, 31.22, 31.42, 31.56], 31.90],
  ["A big brown ball with three silly eyes!", [31.92, 32.04, 32.26, 32.48, 32.78, 33.02, 33.26, 33.46], 34.05],
  ["Guess who is wearing this furry disguise!", [34.10, 34.22, 34.40, 34.54, 34.80, 35.04, 35.28], 36.00],
  ["I've got a blue hat with bats in the air!", [36.06, 36.30, 36.40, 36.54, 36.70, 36.86, 37.06, 37.24, 37.42, 37.56], 38.10],
  ["Spiky white teeth but you don't need to scare!", [38.16, 38.28, 38.56, 38.86, 38.94, 39.06, 39.24, 39.40, 39.54], 39.90],
  ["I like building blocks and Rubik's cubes too!", [39.94, 40.06, 40.24, 40.52, 40.84, 41.06, 41.46, 41.62], 42.05],
  ["Figure me out, that's what you gotta do!", [42.12, 42.28, 42.54, 42.78, 42.94, 43.02, 43.22, 43.46], 43.95],
  ["Say it five times without any mistakes!", [44.00, 44.22, 44.36, 44.52, 44.76, 45.02, 45.34], 46.00],
  ["Let's see the speed that this silly thing takes!", [46.04, 46.26, 46.36, 46.52, 46.74, 46.90, 47.06, 47.40, 47.70], 48.10],
  ["Twist it, troll it, flip it fast!", [48.24, 48.42, 49.30, 49.42, 50.26, 50.40, 50.78], 51.65],
  ["We are the trolls and we're having a blast!", [52.00, 52.30, 52.80, 53.04, 53.36, 53.84, 54.10, 54.56, 54.86], 55.20],
  ["Silly words are spinning around!", [55.28, 56.76, 57.42, 57.88, 58.50], 59.90],
  ["Let's make a laugh out of every sound!", [59.98, 60.56, 60.86, 61.28, 61.46, 61.94, 62.14, 62.74], 63.95],
  ["Say it fast, don't let it slip!", [64.30, 64.48, 64.84, 65.62, 65.96, 66.48, 66.86], 67.55],
  ["This is the ultimate tongue-twister trip!", [67.96, 68.52, 69.08, 69.64, 70.20, 70.76], 71.63],
  ["Laughter is free and it's never a crime!", [72.24, 72.48, 73.06, 73.40, 73.88, 74.12, 74.56, 74.84], 75.71],
  ["Say it with us one more time!", [76.00, 76.36, 76.60, 76.86, 77.10, 77.48, 77.94], 79.23],
  ["A white little ghost with a spooky skull face!", [79.68, 80.02, 80.22, 80.48, 80.70, 80.88, 81.02, 81.34, 81.54], 82.10],
  ["Floating around in a digital space!", [82.18, 82.28, 82.70, 82.88, 83.04, 83.38], 83.70],
  ["With a candy bucket and a laptop in hand!", [83.72, 83.88, 84.04, 84.28, 84.56, 84.90, 85.04, 85.30, 85.54], 86.00],
  ["Who is the smartest tech-mom in the land!", [86.06, 86.27, 86.48, 86.69, 86.91, 87.12, 87.33, 87.54], 87.88],
  ["You better be quick or you're gonna get caught!", [87.90, 88.10, 88.30, 88.50, 88.70, 88.90, 89.10, 89.30, 89.50], 90.00],
  ["Is it a sister or auntie you bought?", [90.06, 90.24, 90.40, 90.54, 90.76, 91.02, 91.30, 91.54], 92.00],
  ["Keep on guessing and don't give away!", [92.06, 92.24, 92.50, 92.80, 93.04, 93.24, 93.40], 93.90],
  ["What these crazy twisters are trying to say!", [93.92, 94.02, 94.22, 94.52, 94.80, 95.04, 95.32, 95.54], 95.90],
  ["A yellow striped cat with a look of surprise!", [95.92, 96.04, 96.26, 96.52, 96.74, 96.90, 97.04, 97.22, 97.34], 98.00],
  ["Watching the scoreboard as time really flies!", [98.06, 98.30, 98.54, 98.82, 99.04, 99.24, 99.50], 99.90],
  ["I love making things and I love playing ball!", [99.92, 100.08, 100.22, 100.50, 100.76, 100.90, 101.06, 101.20, 101.46], 102.00],
  ["Who is the tallest rebel of all!", [102.06, 102.22, 102.40, 102.54, 102.92, 103.28, 103.58], 103.89],
  ["My hair might go crazy if things get too tough!", [103.90, 104.04, 104.22, 104.36, 104.56, 104.82, 105.04, 105.24, 105.38, 105.54], 105.90],
  ["But playing with family is never enough!", [105.92, 106.04, 106.32, 106.54, 106.84, 107.06, 107.32], 108.00],
  ["One more monster and then we are through!", [108.02, 108.22, 108.44, 108.86, 109.06, 109.22, 109.38, 109.52], 110.00],
  ["Let's see if you can figure out who!", [110.04, 110.30, 110.44, 110.54, 110.70, 110.96, 111.22, 111.50], 112.13],
  ["Twist it, troll it, flip it fast!", [127.36, 128.32, 129.36, 129.44, 130.34, 130.44, 130.82], 131.77],
  ["We are the trolls and we're having a blast!", [132.18, 132.32, 132.80, 133.04, 133.36, 133.88, 134.08, 134.56, 134.86], 135.67],
  ["Silly words are spinning around!", [136.32, 136.70, 137.40, 137.90, 138.48], 139.79],
  ["Let's make a laugh out of every sound!", [140.02, 140.54, 140.86, 141.32, 141.44, 141.94, 142.10, 142.86], 143.90],
  ["Say it fast, don't let it slip!", [143.94, 144.46, 144.86, 145.62, 145.98, 146.48, 146.86], 147.53],
  ["This is the ultimate tongue-twister trip!", [148.02, 148.55, 149.08, 149.62, 150.15, 150.68], 151.61],
  ["Laughter is free and it's never a crime!", [152.26, 152.50, 153.06, 153.36, 153.88, 154.12, 154.56, 154.82], 155.79],
  ["Say it with us one more time!", [155.96, 156.34, 156.60, 156.86, 157.10, 157.48, 158.02], 158.95],
  ["Now pull off the masks and let us see!", [159.76, 160.00, 160.26, 160.38, 160.56, 160.92, 161.04, 161.24, 161.46], 161.85],
  ["Now pull off the masks and let us see!", [161.86, 161.96, 162.20, 162.38, 162.54, 162.84, 162.98, 163.24, 163.44], 163.85],
  ["The wonderful family we're meant to be!", [163.88, 164.02, 164.36, 165.00, 165.18, 165.34, 165.52], 165.80],
  ["It's the professor, the doctor, and all of the kids!", [165.86, 166.05, 166.23, 166.42, 166.61, 166.79, 166.98, 167.17, 167.35, 167.54], 167.82],
  ["Laughing together for everything we did!", [167.84, 168.42, 168.72, 169.00, 169.34, 169.52], 170.00],
  ["But wait, look at the back, do you see?", [170.04, 170.25, 170.47, 170.69, 170.90, 171.11, 171.33, 171.54, 171.76], 172.05],
  ["Take off your costumes and join in the play!", [172.10, 172.22, 172.40, 172.54, 172.80, 173.08, 173.26, 173.40, 173.52], 174.10],
  ["Wait, these are real? Hip hip hooray!", [174.16, 174.36, 174.56, 174.76, 174.96, 175.16, 175.36], 176.25],
];

// The karaoke strip along the bottom: crayon-box capitals on a paper pill; sung words light up and the newest word pops.
function gwKaraoke(t) {
  const row = GW_LYRICS.find(([, w, end]) => t >= w[0] - .35 && t < end + .2); if (!row) return;
  const [text, times, end] = row, words = text.split(' '), k = ease(seg(t, times[0] - .35, times[0] - .1)) * (1 - ease(seg(t, end, end + .2)));
  overlay(() => {
    X.save(); X.globalAlpha = k; X.font = `52px ${FONT_SFX}`; X.textBaseline = 'middle';
    const sp = Math.max(X.measureText(' ').width, 20), ws = words.map(w => X.measureText(w).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    const sc = Math.min(1, 1680 / tw);
    X.translate(W / 2, H - 70); X.scale(sc, sc);
    shape(rectPts(-tw / 2 - 40, -44, tw + 80, 88), { fill: 'rgba(255,250,236,.94)', stroke: PAL.ink, lwPx: 6, smooth: .5 });
    let x = -tw / 2;
    words.forEach((w, i) => {
      const lit = t >= times[i], pop = lit ? 1 + .22 * Math.exp(-(t - times[i]) * 9) : 1;
      X.save(); X.translate(x + ws[i] / 2, 2); X.scale(pop, pop); X.textAlign = 'center';
      X.lineJoin = 'round'; X.lineWidth = 9; X.strokeStyle = PAL.ink; if (lit) X.strokeText(w, 0, 0);
      X.fillStyle = lit ? GW_CRAYON[i % GW_CRAYON.length] : '#B9AE9A'; X.fillText(w, 0, 0); X.restore();
      x += ws[i] + sp;
    });
    X.restore();
  });
}
const GW_CRAYON = ['#E5466E', '#FF8A3D', '#E0A800', '#4DA650', '#2E7D9A', '#6A3FB0'];
