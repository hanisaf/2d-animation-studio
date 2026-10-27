// scenes/book_fair/scene22_you_shall_see/lyrics.js: the song "You Shall See" as recorded in audio.mp3, one row per sung or spoken line.
// Row: [id, who, text, times, opts]. `times` holds the start (seconds into audio.mp3) of each word of `text`, measured from a
// word-level transcription of the recording and checked against its loudness; a token with no letters (a dash) lights up
// with the word before it. `who` is a character id or a group (KIDS, CROWD, ALL). `id` names a line the scene's beats are
// read from (null when nothing keys off it). Fix a time here and the karaoke, the mouths and the shots that use it follow.
// opts: { karaoke: false } sings without a karaoke line (a backing vocal); { kind: 'whisper' } is quieter; { end } holds the last word.
// The recording differs from SONG.md in places: it has no "(Psst!)", "Steady!", kids' "YOU SHALL SEE!" before the choruses,
// "…Why?", "Your Majesty…", "(She laughed!)", nor "The best part of the story…" / "You shall seeeee!". Those lines are left out.
const YS_BPM = 117.46, YS_BEAT0 = 0.058;                                     // beat-tracked from audio.mp3
const YS_KIDS = ['housam', 'alma', 'jenna', 'danny'];
const YS_CROWD = [...YS_KIDS, 'sami', 'dragon'];
const YS_ALL = [...YS_CROWD, 'safadi', 'jester_fester', 'princess_pearl'];
const YS_CHORUS = (c, who, w) => [
  [`${c}.0`, who, 'You shall see! (You shall see!)', w[0]],
  [`${c}.1`, who, "Turn the page, turn the page, there's a twist in the story!", w[1]],
  [`${c}.2`, who, w[2].length === 5 ? 'You shall see! (Hey! Hey!)' : 'You shall see! (You shall see!)', w[2]],
  [`${c}.3`, who, 'Nobody knows the ending — not you, not me!', w[3]],
  [`${c}.4`, who, 'Read it! Write it! Flip it! (BONK!)', w[4]],
  ...(w[5] ? [[`${c}.5`, who, 'You shall see!', w[5]]] : []),
];
const YS_LYRICS = [
  // intro
  ['decree', 'princess_pearl', 'By royal decree… the Book Fair is open.', [2.18, 2.40, 2.76, 3.38, 3.46, 3.72, 4.02, 4.45]],
  ['dazzle', 'princess_pearl', 'Dazzle me.', [5.90, 6.45]],
  ['beep', 'robo_safadi', 'Beep. Boop.', [8.90, 9.50]],
  // verse 1: Safadi
  ['ladies', 'safadi', 'Ladies and gentlemen, children of all ages,', [11.62, 12.18, 12.48, 13.00, 13.18, 13.40, 13.52]],
  [null, 'safadi', "I wrote three books — that's nine hundred pages!", [13.90, 14.00, 14.12, 14.40, 14.75, 15.00, 15.18, 15.44]],
  ['maths', 'safadi', 'Mathematics! (Ooh!) Physics! (Ahh!) Astronomy too —', [16.18, 17.02, 17.48, 18.14, 18.56, 19.10]],
  ['face', 'safadi', 'With my face on every cover, just for you!', [19.44, 19.66, 19.92, 20.20, 20.52, 20.86, 21.32, 21.64, 21.94]],
  ['crown', 'safadi', 'The judge is a princess, the prize is a crown,', [22.30, 22.54, 22.72, 22.90, 23.00, 23.84, 23.98, 24.42, 24.84, 25.04]],
  ['foot', 'safadi', "My footnotes have footnotes, I won't let you down.", [26.02, 26.20, 26.80, 26.92, 27.62, 27.70, 27.98, 28.18, 28.38]],
  ['brag', 'safadi', "I don't like to brag —", [28.78, 29.12, 29.24, 29.38, 29.52]],
  ['gonna', YS_KIDS, "(Oh, he's gonna brag!)", [29.92, 30.60, 30.80, 30.94]],
  ['trophy', 'safadi', "But that trophy's going home in my professor bag!", [31.50, 31.68, 31.94, 32.50, 32.78, 33.28, 33.44, 33.68, 34.10]],
  // pre-chorus
  ['ready', 'alma', 'Is everybody ready?', [34.90, 35.00, 35.34], { kind: 'whisper' }],
  [null, 'danny', 'Ready!', [36.08], { kind: 'whisper' }],
  ['ladder', 'jenna', 'Is the ball up on the ladder?', [36.72, 36.86, 37.02, 37.14, 37.22, 37.40, 37.50], { kind: 'whisper' }],
  ['planning', 'safadi', 'Children… what exactly are you planning?', [37.96, 38.58, 38.70, 39.24, 39.72, 39.92]],
  ...YS_CHORUS('C1', YS_CROWD, [
    [41.42, 41.64, 41.90, 43.26, 43.52, 43.88],
    [44.90, 45.42, 45.66, 46.00, 46.18, 46.36, 46.68, 46.92, 47.02, 47.22, 47.66, 47.90],
    [49.48, 49.66, 49.90, 50.56, 50.98],
    [51.40, 51.76, 52.16, 52.40, 53.00, 53.30, 53.58, 53.88],
    [54.05, 54.22, 54.55, 54.66, 55.05, 55.12, 55.30],
    [55.62, 55.72, 55.94],
  ]),
  // verse 2: the contestants
  ['contestant', 'princess_pearl', 'Contestant two.', [56.40, 56.94]],
  ['boogers', 'sami', "Doctor Sami's Big Book of Boogers!", [57.70, 58.40, 59.00, 59.18, 59.36, 59.48]],
  ['sneezes', 'sami', 'Chapter one: sneezes! Chapter two: burps!', [60.04, 60.22, 60.44, 60.90, 61.18, 61.46]],
  ['ew', 'princess_pearl', '…Ew. Next.', [62.02, 62.58]],
  ['popup', 'dragon', 'I made a pop-up book that counts by threes!', [63.18, 63.28, 63.40, 63.52, 63.92, 64.20, 64.40, 64.70, 64.92]],
  ['three', 'dragon', 'Three, six, nine… ah… ah… ACHOO!', [65.92, 66.16, 66.40, 66.66, 66.94, 67.40]],
  ['fire', 'princess_pearl', "…It's on fire. Next.", [67.98, 68.34, 68.46, 68.84]],
  ['prompt', 'robo_safadi', 'PROMPT. RECEIVED. WRITE. A. BEST. SELL. ER.', [69.86, 70.52, 71.02, 71.20, 71.52, 72.02, 72.64]],
  ['clawd', 'clawd', 'Bee-boo-bee-boo-bee!', [73.20], { end: 74.0 }],
  ['pages', 'robo_safadi', 'Ten thousand pages in zero point one!', [74.16, 74.30, 74.44, 74.80, 75.02, 75.30, 75.70]],
  [null, 'robo_safadi', 'Chapter one: eat your broccoli!', [76.02, 76.26, 76.82, 76.92, 77.00]],
  [null, 'robo_safadi', 'Chapter two: eat your broccoli!', [77.98, 78.28, 78.74, 78.90, 79.04]],
  [null, 'robo_safadi', 'Chapter nine thousand nine hundred ninety-nine —', [79.96, 80.32, 80.68, 81.08, 81.48, 81.86], { end: 83.3 }],
  // pre-chorus 2: Pearl
  ['bored', 'princess_pearl', "Bored, bored, I'm so royally bored,", [83.85, 84.95, 85.85, 86.04, 86.36, 87.00]],
  [null, 'princess_pearl', 'Nobody has dazzled the dolphin, my lord.', [87.80, 88.40, 88.84, 89.66, 89.92, 90.80, 91.08]],
  ['somebody', 'princess_pearl', 'Somebody, anybody…', [91.98, 92.82]],
  ...YS_CHORUS('C2', YS_CROWD, [
    [93.38, 93.62, 93.90, 95.28, 95.54, 95.88],
    [96.80, 97.40, 97.68, 98.00, 98.16, 98.36, 98.74, 98.92, 99.02, 99.22, 99.68, 99.90],
    [101.52, 101.66, 101.92, 102.54, 102.98],
    [103.40, 103.84, 104.16, 104.40, 105.00, 105.28, 105.76, 105.94],
    [106.14, 106.24, 106.54, 106.68, 107.04, 107.16, 107.30],
    [107.60, 107.70, 107.94],
  ]),
  // bridge: Fester, the kids, Housam's rap
  ['fester', 'jester_fester', "Hi… it's me. The jester you fired.", [111.90, 112.42, 112.56, 112.94, 113.00, 113.24, 113.38]],
  ['nohat', 'jester_fester', 'No hat, no job… but I wrote you a book.', [113.82, 113.94, 114.28, 114.40, 114.82, 114.92, 115.02, 115.16, 115.30, 115.38]],
  ['jennaDrew', YS_KIDS, 'Jenna drew the pictures, Alma made it dance,', [115.96, 116.22, 116.38, 116.48, 117.04, 117.26, 117.40, 117.50]],
  ['dannyJokes', YS_KIDS, 'Danny wrote the jokes —', [118.02, 118.20, 118.36, 118.48]],
  ['math', 'housam', '— and I did the math!', [119.02, 119.12, 119.22, 119.40, 119.52]],
  [null, 'housam', "The ladder's two meters, gravity's nine-point-eight,", [119.66, 119.80, 120.08, 120.22, 120.58, 120.98]],
  ['point', 'housam', "Point-six-four seconds, so we can't be late!", [121.82, 122.42, 122.86, 122.92, 123.00, 123.34, 123.38]],
  ['ladderLine', 'housam', "Danny's on the ladder with the ball in his hand,", [124.02, 124.34, 124.42, 124.54, 124.72, 124.90, 125.02, 125.20, 125.30, 125.42]],
  ['waiting', 'housam', 'Waiting on a word — one word — he knows the command…', [125.76, 126.02, 126.14, 126.28, 126.52, 126.62, 126.88, 127.00, 127.14, 127.28]],
  // the build, the silence, the BONK
  ['called', 'jester_fester', 'It\'s called… "The Story of My Life."', [127.86, 128.02, 128.20, 128.48, 128.72, 128.92, 129.04]],
  ['ch1', 'jester_fester', 'Chapter one: a ball fell on my head.', [129.68, 129.92, 130.18, 130.30, 130.52, 130.64, 130.84, 131.00]],
  ['ch2', 'jester_fester', 'Chapter two: a ball fell on my head.', [131.60, 131.90, 132.22, 132.28, 132.50, 132.68, 132.84, 133.00]],
  ['ch3', 'jester_fester', 'Chapter three —', [134.00, 134.55]],
  ['allow', 'safadi', 'Ah! Allow me to EXPLAIN —', [135.90, 136.85, 137.45, 138.30, 138.84], { end: 139.6 }],
  ['now', YS_KIDS, '…now.', [140.36], { kind: 'whisper' }],
  // the drop (BONK at 140.97, the beat drops at 142.0)
  ['haha', 'princess_pearl', 'Ha… ha-ha… HA-HA-HA-HA-HA!', [141.10, 141.75, 142.05], { end: 144.2 }],
  ['laughed', YS_ALL.filter(w => w !== 'princess_pearl'), 'SHE LAUGHED! The princess LAUGHED!', [144.40, 144.88, 145.78, 145.88, 146.54]],
  ['laughed2', YS_ALL.filter(w => w !== 'princess_pearl'), 'SHE LAUGHED! The princess LAUGHED!', [147.70, 148.00, 148.80, 148.95, 149.54]],
  ['hired', 'princess_pearl', "Fester… you're… HIRED!", [150.90, 151.78, 151.94]],
  ['triumph', 'jester_fester', "I'm Jester Fester — and THIS is the story of my life!", [152.30, 152.52, 153.00, 153.68, 153.98, 154.36, 154.66, 154.90, 155.38, 155.76, 155.96]],
  // the final chorus, with Robo's counter-line underneath
  ...YS_CHORUS('F', YS_ALL, [
    [156.56, 156.78, 156.90, 157.42, 157.54, 157.88],
    [159.20, 159.36, 159.70, 160.04, 160.20, 160.36, 160.78, 160.94, 161.02, 161.22, 161.64, 161.90],
    [163.02, 163.62, 163.90, 164.56, 164.66, 164.92],
    [165.46, 165.70, 166.18, 166.42, 167.08, 167.28, 167.76, 167.90],
    [168.30, 168.40, 168.64, 168.66, 169.02, 169.18, 169.80],
  ]),
  [null, 'robo_safadi', 'Eat your broccoli!', [158.56, 158.74, 158.98], { karaoke: false }],
  // the tag
  ['nobody', 'safadi', '…So. Nobody wants my books?', [170.56, 171.32, 171.58, 171.78, 171.94]],
  ['take', 'dragon', "I'll take all three!", [172.86, 173.00, 173.14, 173.30]],
  ['splendid', 'safadi', 'Splendid! Now, let me explain chapter one —', [173.94, 174.60, 174.70, 174.78, 174.88, 175.20, 175.44]],
  ['another', 'princess_pearl', 'Somebody… find me… ANOTHER PROFESSOR.', [176.04, 176.38, 176.68, 176.90, 177.22], { end: 177.9 }],
  ['beepEnd', 'robo_safadi', 'Beep. Boop.', [178.98, 179.55]],
].map(([id, who, text, times, o = {}]) => {
  const words = [], re = /\S+/g; let m, i = 0, last = times[0];
  while ((m = re.exec(text))) { if (/[\wÀ-ɏ]/.test(m[0])) last = times[i++]; words.push([last, m[0]]); }
  if (i !== times.length) throw new Error(`lyrics.js: "${text}" has ${i} words but ${times.length} times`);
  return { id, at: times[0] - .2, who: Array.isArray(who) ? who : [who], text, words, ...o };
}).sort((a, b) => a.at - b.at);

// The words of a row with their start times, and a line by id.
const ysWords = row => row.words;
const ysRow = id => YS_LYRICS.find(r => r.id === id) || (() => { throw new Error(`lyrics.js: no line "${id}"`); })();
const ysWordAt = (id, i) => ysRow(id).words.filter(([, w]) => /[\wÀ-ɏ]/.test(w))[i][0];
// How long a word rings out: about its length, cut short by the next word.
const ysWordEnd = (row, i) => {
  const [t, w] = row.words[i], next = row.words.slice(i + 1).find(([tn]) => tn > t);
  if (!next && row.end) return row.end;
  const len = .12 + .07 * w.replace(/[^\wÀ-ɏ]/g, '').length;
  return next ? Math.min(next[0] - .04, t + len) : t + Math.min(len, .7);
};
const ysLineEnd = row => ysWordEnd(row, row.words.length - 1);
// Is `who` singing at t? (their mouth flaps while a word of theirs is ringing out)
function ysSinging(who, t) {
  for (const r of YS_LYRICS) {
    if (t < r.at || t > ysLineEnd(r) || !r.who.includes(who)) continue;
    for (let i = 0; i < r.words.length; i++) if (t >= r.words[i][0] && t < ysWordEnd(r, i)) return true;
  }
  return false;
}

// The singers' name chips and colours.
const YS_SINGER = {
  safadi: ['PROF. SAFADI', '#C0443F'], princess_pearl: ['PRINCESS PEARL', '#E26AA6'], jester_fester: ['JESTER FESTER', '#7A3FA0'],
  housam: ['HOUSAM', '#3E6FB0'], alma: ['ALMA', '#994EC4'], jenna: ['JENNA', '#D0508E'], danny: ['DANNY', '#2E5C9A'],
  sami: ['DR. SAMI', '#2E9C7A'], dragon: ['DRAGON', '#4E9A3A'], robo_safadi: ['ROBO-SAFADI', '#D23A3A'], clawd: ['CLAWD', '#D97757'],
};
function ysSingerChip(who) {
  if (who.length === 1) return YS_SINGER[who[0]] || [who[0].toUpperCase(), '#555'];
  if (who.length >= 8) return ['EVERYBODY', '#E39A1E'];
  if (who.length === 4 && YS_KIDS.every(k => who.includes(k))) return ['THE KIDS', '#3FA7A0'];
  return ['EVERYBODY', '#E39A1E'];
}

// The karaoke strip: a cream ribbon along the bottom, the singer's chip on the left, each word lights up as it's sung.
function ysKaraoke(t) {
  let row = null;
  for (const r of YS_LYRICS) if (r.karaoke !== false && t >= r.at - .35 && t < ysLineEnd(r) + .55) row = r;
  if (!row) return;
  const words = ysWords(row), fadeIn = clamp((t - row.at + .35) / .25), fadeOut = 1 - clamp((t - ysLineEnd(row) - .3) / .25);
  const a = Math.min(fadeIn, fadeOut); if (a <= 0) return;
  const [name, col] = ysSingerChip(row.who), whisper = row.kind === 'whisper';
  overlay(() => {
    X.save(); X.globalAlpha = a;
    let size = whisper ? 46 : 58; X.font = `${size}px ${FONT_SFX}`;
    const gap = size * .3, widths = words.map(([, w]) => X.measureText(w).width), total = widths.reduce((s, w) => s + w, 0) + gap * (words.length - 1);
    const maxW = W - 520; if (total > maxW) { size *= maxW / total; X.font = `${size}px ${FONT_SFX}`; }
    const ws = words.map(([, w]) => X.measureText(w).width), tot = ws.reduce((s, w) => s + w, 0) + size * .36 * (words.length - 1);
    const cy = H - 74, x0 = W / 2 + 120 - tot / 2;
    // ribbon
    X.fillStyle = 'rgba(30,18,34,.62)'; X.beginPath(); X.roundRect(x0 - 40, cy - size * .78, tot + 80, size * 1.56, size * .5); X.fill();
    // chip
    X.font = `30px ${FONT_SFX}`; const cw = X.measureText(name).width + 34;
    X.save(); X.translate(x0 - 60 - cw, cy); X.rotate(-.04);
    X.fillStyle = col; X.strokeStyle = '#2B1A26'; X.lineWidth = 5; X.beginPath(); X.roundRect(0, -24, cw, 48, 14); X.fill(); X.stroke();
    X.fillStyle = '#FFFDF4'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(name, cw / 2, 2);
    X.restore();
    // words
    X.font = `${size}px ${FONT_SFX}`; X.textBaseline = 'middle'; X.textAlign = 'left'; X.lineJoin = 'round';
    let x = x0;
    words.forEach(([tw, w], i) => {
      const on = t >= tw, age = t - tw, pop = on && age < .25 ? 1 + .1 * Math.sin(age / .25 * Math.PI) : 1;
      X.save(); X.translate(x + ws[i] / 2, cy); X.scale(pop, pop);
      X.lineWidth = size * .2; X.strokeStyle = '#2B1A26'; X.strokeText(w, -ws[i] / 2, 0);
      X.fillStyle = on ? (whisper ? '#CFE9FF' : '#FFD84A') : 'rgba(255,253,244,.88)'; X.fillText(w, -ws[i] / 2, 0);
      X.restore();
      x += ws[i] + size * .36;
    });
    X.restore();
  });
}
