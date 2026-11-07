# Pokemon 4 · Everybody Wins

> The finale of the Pokemon series: an epic music video. The brothers' *"You shall see!"* turns out to be a Grand Tournament. Eight trainers bring eight Pokemon to a night stadium, four duels go off on the beat, all eight Pokemon power up for one giant clash, and nobody faints. Professor Safadi and Doctor Sami hand every trainer a trophy. **EVERYBODY WINS!** *The End.*

| | |
|---|---|
| **Length** | 181 s · 24 fps · 134 bpm (the recording's beat grid) |
| **Cast** | [Housam](../../../characters/housam/README.md) · [Alma](../../../characters/alma/README.md) · [Jenna](../../../characters/jenna/README.md) · [Danny](../../../characters/danny/README.md) · [Jester Fester](../../../characters/jester_fester/README.md) · [Princess Pearl](../../../characters/princess_pearl/README.md) · [Neptune](../../../characters/neptune/README.md) · [Dragon](../../../characters/dragon/README.md) · [Professor Safadi](../../../characters/safadi/README.md) · [Doctor Sami](../../../characters/sami/README.md) |
| **Location** | the Grand Tournament stadium, a 2D set in `props.js` (no 3D location) |
| **Audio** | `audio.mp3`: the song "Everybody Wins", generated with Gemini from [SONG.md](SONG.md); its lines and word times are in [lyrics.js](lyrics.js) and drive the karaoke and the mouths |
| **Uses** | scene 65 (`DK.card`), which uses scene 64 (`PK.ART`: Captain Fin, Blazewyrm, Sproutbun, Starpaw) |

## The trainers and their Pokemon

| Trainer | Pokemon | Signature move |
|---|---|---|
| Housam | Blazewyrm (scene 64) | Flame Burst: a fireball with a flame trail |
| Alma | Captain Fin (scene 64) | Tidal Splash: a curling wave |
| Jenna | Sproutbun (scene 64) | Leaf Storm: a spiral of leaves |
| Danny | Starpaw (scene 64) | Star Shower: falling stars |
| Jester Fester | **Bellbop**: a purple imp in a three-point jester hat with bells | Jingle Blast: sound rings and notes |
| Princess Pearl | **Coralia**: a pink royal jellyfish with a crown | Pearl Beam: a rainbow beam |
| Neptune | **Shelldon**: a sea turtle with a gold trident on its shell | Shell Spin: it rams, spinning |
| Dragon | **Puffling**: a puffy pink baby cloud-dragon | Puff Cloud: pink clouds and hearts |

## Synopsis and cut (times are seconds into audio.mp3)

| Time | Song | On screen |
|---|---|---|
| 0–6.8 | orchestral intro | down from the stars into the stadium, fireworks, POKEMON GRAND TOURNAMENT |
| 6.8–15.9 | "Ladies and gentlemen…" (Sami), "Welcome…" (Safadi) | the brothers at the commentary desk |
| 15.9–30.5 | the roll call | each trainer runs into a spotlight on their name and throws a card, and their Pokemon pops out |
| 30.5–43.1 | pre-chorus | all eight trainers in a row, the Pokemon popping in behind them |
| 43.1–56.3 | chorus 1 | **Alma & Captain Fin vs Princess Pearl & Coralia**: arena, duel, both trainers, duel |
| 56.3–68.8 | verse 2 | Neptune sings, Housam raps, then **Blazewyrm vs Shelldon** in the arena and in a duel |
| 68.8–86.8 | pre-chorus 2 + chorus 2 | Jenna ("This time I packed my Energy!", sung twice), Jester Fester, then **Sproutbun vs Bellbop** |
| 86.8–93.0 | "Starpaw — Star Shower", "Puffling, puff!" | Danny, Dragon, then a CLASH |
| 93.0–114.7 | bridge | Pearl's solo · POWER UP! (all eight in a ring) · two four-way split screens · "Brother… look at them." "I see it." |
| 114.7–117.2 | "Three! Two! One!" | eight beams into one orb, each number on its word, a white flash on the drop |
| 117.2–125.4 | the drop | an eight-way melee, a cut on every half bar |
| 125.4–132.6 | breakdown | the smoke clears · "…A TIE?!" · the brothers stand up: "Everybody… is still standing!" |
| 132.6–138.6 | final chorus | the line-up, then EVERYBODY WINS!, confetti and fireworks on the first "Everybody wins!" (136.5) |
| 138.6–161.9 | | a trophy comes down for each trainer, about 2.9 s each. The brothers have left the booth, which stays empty from here on |
| 161.9–172.0 | the names chant | all ten with trophies; each trainer flashes WINS! on their name |
| 172.0–181 | outro | "Say 'win'!" · the photo flash on "Click!" (173.2) and the polaroid · fireworks on "You see?" · THE END on "The end." (177.2) · iris |

Karaoke: the line being sung shows at the bottom, and its words turn yellow as they're sung.

## Notes for editing (`scene.js`, `props.js`)

- **Timing:** `S` at the top of `scene.js` holds the section starts. `ENTER`, `COUNT`, `NAMES_AT`, `PHOTO`, `FW` and `FIN` are read from `lyrics.js` by their words. The beat grid (`EW_BPM` 133.99, `EW_BEAT0` 0.095) drives `pulse(t)`, the on-beat bounce. Fix a time in `lyrics.js` and the karaoke, the mouths and those beats follow.
- **Lyrics:** `lyrics.js` rows are `[who, text, wordTimes, end]`. They come from a word-level transcription of the recording, with wording from the lyric sheet where the transcription garbled it (the names chant is spread evenly). The recording leaves out "(Ready!) Let's go!", sings "This time I packed my Energy!" twice and adds "Come on, let's battle on!"
- **Mouths:** `singing(n, t)` is true while a row that includes `n` is being sung.
- **Trainers:** `trainer(n, x, y, k, t, mood, { dir, sing })` draws any of the ten at a floor point with `k` px per world unit. The moods are `idle`, `cmd`, `cheer`, `trophy`, `wave` and `photo`; the function maps each to the right rig options. Mouths move from the lyrics (`singing`), and `sing: false` keeps someone quiet.
- **Props** (`PG`):
  - The stadium: `PG.stadium(t, { beat, mood, screen, booth })`, drawn inside `camBegin`. `screen` paints the jumbotron, and `booth` draws the commentators in their window.
  - Creatures: `PG.creature(kind, x, y, sc, t, { flip, glow, hit, sq, rot })` and `PG.aura(...)`.
  - Attacks: `PG.fx(kind, ax, ay, bx, by, u, t, size)` draws each creature's signature move, and `PG.impact(...)` the hit.
  - Duels: `PG.duel(t, t0, bar, L, R, { both, start, hpL, hpR })` is one attack per bar, alternating sides.
  - Extras: `PG.trophy`, `PG.confetti` and `PG.firework`.
