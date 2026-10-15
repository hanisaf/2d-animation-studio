// scenes/scene22_you_shall_see/lyrics.js: the song "You Shall See" (SONG.md), one row per sung or spoken line.
// Row: [at, who, text, cps, opts]. `who` is a character id or a group (KIDS, CROWD, ALL). Each word starts at
// at + .2 + (its character index) / cps, which is the same clock the cartoon-voice synthesizer uses, so the karaoke, the
// mouths and the scratch vocals all agree. The times are the scratch arrangement at 120 BPM. When the Gemini track
// arrives (audio.mp3), re-time these rows to it (as scene 17 did) and everything that keys off them follows.
// opts: { karaoke: false } sings without a karaoke line (a backing vocal); { kind: 'whisper' } is quieter.
const YS_KIDS = ['housam', 'alma', 'jenna', 'danny'];
const YS_CROWD = [...YS_KIDS, 'sami', 'dragon'];
const YS_ALL = [...YS_CROWD, 'safadi', 'jester_fester', 'princess_pearl'];
const YS_CHORUS = c => [
  [c + 0.0, YS_CROWD, 'You shall see! (You shall see!)', 13],
  [c + 2.5, YS_CROWD, "Turn the page, turn the page, there's a twist in the story!", 24],
  [c + 5.0, YS_CROWD, 'You shall see! (Hey! Hey!)', 11],
  [c + 7.5, YS_CROWD, 'Nobody knows the ending — not you, not me!', 17],
  [c + 10.5, YS_CROWD, 'Read it! Write it! Flip it! (BONK!)', 13],
  [c + 13.5, YS_CROWD, 'You shall see!', 6],
];
const YS_LYRICS = [
  // intro
  [2.4, 'princess_pearl', 'By royal decree… the Book Fair is open.', 14],
  [6.4, 'princess_pearl', 'Dazzle me.', 8],
  [8.4, 'robo_safadi', 'Beep. Boop.', 9],
  // verse 1: Safadi
  [10.0, 'safadi', 'Ladies and gentlemen, children of all ages,', 18],
  [12.5, 'safadi', "I wrote three books — that's nine hundred pages!", 20],
  [15.0, 'safadi', 'Mathematics! (Ooh!) Physics! (Ahh!) Astronomy too —', 21],
  [17.5, 'safadi', 'With my face on every cover, just for you!', 18],
  [20.0, 'safadi', 'The judge is a princess, the prize is a crown,', 19],
  [22.5, 'safadi', "My footnotes have footnotes, I won't let you down.", 20],
  [25.0, 'safadi', "I don't like to brag —", 14],
  [26.1, YS_KIDS, "(Oh, he's gonna brag!)", 18],
  [27.5, 'safadi', "But that trophy's going home in my professor bag!", 20],
  // pre-chorus
  [30.2, 'alma', '(Psst!) Is everybody ready?', 16, { kind: 'whisper' }],
  [31.9, 'danny', 'Ready!', 10, { kind: 'whisper' }],
  [32.6, 'jenna', 'Is the ball up on the ladder?', 17, { kind: 'whisper' }],
  [34.3, 'housam', 'Steady!', 10, { kind: 'whisper' }],
  [35.2, 'safadi', 'Children… what exactly are you planning?', 16],
  [38.0, YS_KIDS, 'YOU SHALL SEE!', 9],
  ...YS_CHORUS(40),
  // verse 2: the contestants
  [56.0, 'princess_pearl', 'Contestant two.', 9],
  [57.6, 'sami', "Doctor Sami's Big Book of Boogers!", 15],
  [60.3, 'sami', 'Chapter one: sneezes! Chapter two: burps!', 15],
  [63.6, 'princess_pearl', '…Ew. Next.', 7],
  [66.0, 'dragon', 'I made a pop-up book that counts by threes!', 17],
  [69.0, 'dragon', 'Three, six, nine… ah… ah… ACHOO!', 11],
  [72.3, 'princess_pearl', "…It's on fire. Next.", 12],
  [74.2, 'robo_safadi', 'PROMPT. RECEIVED. WRITE. A. BEST. SELL. ER.', 15],
  [77.3, 'clawd', 'Bee-boo-bee-boo-bee!', 16],
  [78.6, 'robo_safadi', 'Ten thousand pages in zero point one!', 22],
  [80.4, 'robo_safadi', 'Chapter one: eat your broccoli!', 26],
  [81.6, 'robo_safadi', 'Chapter two: eat your broccoli!', 28],
  [82.6, 'robo_safadi', 'Chapter nine thousand nine hundred ninety-nine —', 34],
  [84.0, 'princess_pearl', '…Why?', 5],
  // pre-chorus 2: Pearl
  [85.6, 'princess_pearl', "Bored, bored, I'm so royally bored,", 17],
  [88.0, 'princess_pearl', 'Nobody has dazzled the dolphin, my lord.', 19],
  [90.3, 'princess_pearl', 'Somebody, anybody… make me feel something!', 21],
  [92.4, YS_KIDS, 'Your Majesty… YOU SHALL SEE!', 17],
  ...YS_CHORUS(94),
  // bridge: Fester, the kids, Housam's rap
  [110.4, 'jester_fester', "Hi… it's me. The jester you fired.", 11],
  [114.0, 'jester_fester', 'No hat, no job… but I wrote you a book.', 12],
  [117.6, YS_KIDS, 'Jenna drew the pictures, Alma made it dance,', 18],
  [120.3, YS_KIDS, 'Danny wrote the jokes —', 13],
  [122.1, 'housam', '— and I did the math!', 16],
  [123.5, 'housam', "The ladder's two meters, gravity's nine-point-eight,", 28],
  [125.5, 'housam', "Point-six-four seconds, so we can't be late!", 24],
  [127.4, 'housam', "Danny's on the ladder with the ball in his hand,", 26],
  [129.3, 'housam', 'Waiting on a word — one word — he knows the command…', 26],
  // the build, the silence, the BONK
  [131.6, 'jester_fester', 'It\'s called… "The Story of My Life."', 14],
  [134.4, 'jester_fester', 'Chapter one: a ball fell on my head.', 18],
  [136.6, 'jester_fester', 'Chapter two: a ball fell on my head.', 20],
  [138.6, 'jester_fester', 'Chapter three —', 12],
  [139.6, 'safadi', 'Ah! Allow me to EXPLAIN —', 16],
  [140.95, YS_KIDS, '…now.', 8, { kind: 'whisper' }],
  // the drop
  [143.0, 'princess_pearl', 'Ha… ha-ha… HA-HA-HA-HA-HA!', 9],
  [146.4, YS_ALL.filter(w => w !== 'princess_pearl'), 'SHE LAUGHED! (She laughed!) The princess LAUGHED!', 20],
  [149.0, YS_ALL.filter(w => w !== 'princess_pearl'), 'SHE LAUGHED! (She laughed!) The princess LAUGHED!', 20],
  [151.6, 'princess_pearl', "Fester… you're… HIRED!", 9],
  [154.4, 'jester_fester', "I'm Jester Fester — and THIS is the story of my life!", 17],
  // the final chorus, with Robo's counter-line underneath
  [158.0, YS_ALL, 'You shall see! (Eat your broccoli!)', 15],
  [160.4, YS_ALL, "Turn the page, turn the page, there's a twist in the story!", 24],
  [162.9, YS_ALL, 'You shall see! (Eat your broccoli!)', 15],
  [165.3, YS_ALL, 'Nobody knows the ending — not you, not me!', 17],
  [167.8, YS_ALL, 'Read it! Write it! Flip it! (BONK!)', 13],
  [170.6, YS_ALL, 'The best part of the story is the part you never see —', 22],
  [173.3, YS_ALL, 'You shall seeeeee!', 7],
  [159.0, 'robo_safadi', 'Eat your broccoli!', 9, { karaoke: false }],
  [163.9, 'robo_safadi', 'Eat your broccoli!', 9, { karaoke: false }],
  [168.6, 'robo_safadi', 'Beep! Boop!', 8, { karaoke: false }],
  // the tag
  [176.6, 'safadi', '…So. Nobody wants my books?', 12],
  [179.4, 'dragon', "I'll take all three!", 13],
  [181.2, 'safadi', 'Splendid! Now, let me explain chapter one —', 20],
  [183.6, 'princess_pearl', 'Somebody… find me… ANOTHER PROFESSOR.', 12],
  [187.4, 'robo_safadi', 'Beep. Boop.', 8],
].map(([at, who, text, cps, o = {}]) => ({ at, who: Array.isArray(who) ? who : [who], text, cps, ...o }))
 .sort((a, b) => a.at - b.at);

// The words of a row with their start times.
const ysWords = row => { const out = []; const re = /\S+/g; let m; while ((m = re.exec(row.text))) out.push([row.at + .2 + m.index / row.cps, m[0]]); return out; };
const ysLineEnd = row => row.at + .2 + row.text.length / row.cps;
// Is `who` singing at t? (their mouth flaps while a word of theirs is ringing out)
function ysSinging(who, t) {
  for (const r of YS_LYRICS) {
    if (t < r.at || t > ysLineEnd(r) + .15 || !r.who.includes(who)) continue;
    const p = (t - r.at - .2) * r.cps, ch = r.text[Math.floor(p)];
    if (p > 0 && ch && /[\wÀ-ɏ!?]/.test(ch)) return true;
  }
  return false;
}
// The cartoon-voice synthesizer (studio/music.js) reads these. A group line gets one voice per singer, a little quieter.
// (Three voices at most per line keep the offline render quick.)
const YS_DIALOGUE = YS_LYRICS.flatMap(r => r.who.slice(0, 3).map(speaker => ({ at: r.at, speaker, text: r.text, cps: r.cps, hold: .3,
  energy: (r.kind === 'whisper' ? .45 : 1) * (r.who.length > 1 ? .6 : 1) })));

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
