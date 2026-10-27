# Scene 22: You Shall See

> A music video, and the payoff of [21 We Already Read a Lot!](../scene21_already_read/README.md). It's the DCES Book Fair, and the writing competition has a royal judge: **Princess Pearl**, who has never laughed in her life. Professor Safadi croons about his three books. Sami, Dragon and Robo-Safadi (with Clawd writing ten thousand pages a second) all get a bored *"…Next."* Then the kids' secret plan steps into the spotlight: **Jester Fester**, the jester Pearl fired, reading his memoir *The Story of My Life*, written with the kids. Housam has done the maths, and Danny is up a ladder with a juggling ball, waiting for one word. Safadi supplies it: *"Allow me to EXPLAIN—"* **BONK.** Pearl laughs for the first time ever, and Fester is **HIRED**. In the tag, Dragon buys all three of Safadi's books, Safadi starts explaining chapter one, and Pearl says: *"Somebody… find me… ANOTHER PROFESSOR."*

*Second scene of the writing-competition arc, and the end of the "Fester is fired" arc that began in [scene 02](../../early_episodes/scene02_fired/README.md).*

| | |
|---|---|
| **Length** | 183.5 s, cut to the song `audio.mp3` (generated with Gemini from [`SONG.md`](SONG.md); 117.46 BPM) |
| **Cast (all eleven)** | [Professor Safadi](../../../characters/safadi/README.md) · [Princess Pearl](../../../characters/princess_pearl/README.md) (the judge) · [Jester Fester](../../../characters/jester_fester/README.md) · [Housam](../../../characters/housam/README.md) · [Alma](../../../characters/alma/README.md) · [Jenna](../../../characters/jenna/README.md) · [Danny](../../../characters/danny/README.md) · [Doctor Sami](../../../characters/sami/README.md) · [Dragon](../../../characters/dragon/README.md) · [Robo-Safadi](../../../characters/robo_safadi/README.md) · [Clawd](../../../characters/clawd/README.md) (inside the robot) |
| **Locations** | [School library](../../../locations/school_library/README.md), dressed for the Book Fair: bunting, book stalls, a stage on the story rug, and Pearl's pink-and-gold throne wheeled in from the [throne room](../../../locations/throne_room/README.md). Big musical moments cut to motion-graphics backdrops (sunbursts, flying pages, spotlights) as in [scene 17](../../halloween/scene17_broccoli_directive/README.md) |
| **Sound** | The song is the whole soundtrack and every character's voice; karaoke runs along the bottom with the singer's name |
| **Movie** | #22 |

## Why it should travel

- **A real story in three minutes:** a setup, three failures, a secret plan, a twist and a payoff, plus a button after the ending.
- **Every catchphrase pays off:** *"You shall see!"* (scenes 16 and 21), *"…and this is the story of my life"* (scene 01, now triumphant), *"EXPLAIN"* as the trigger word (scenes 19 and 20), *"Eat your broccoli"* (scene 17), Pearl's *"…why?"*, and *"Somebody find me another jester"* (scene 02) flipped into *"ANOTHER PROFESSOR."*
- **The twist is set up in plain sight:** the pre-chorus whispers *"Is the ball up on the ladder?"* in the first 40 seconds. Nobody thinks about it until the BONK.
- **A thumbnail moment:** Pearl, the dolphin who never laughs, cracking up on the beat drop.
- **A chant-able hook:** *"Read it! Write it! Flip it! (BONK!)"* is short enough for kids to shout and to use as a sound.

## Song map and shot list

Times are seconds into `audio.mp3`. Every sung word's start time lives in [`lyrics.js`](lyrics.js) (from a word-level transcription of the recording, checked against its loudness); the story beats in `T_` at the top of [`scene.js`](scene.js) are read from those lines by id, and the beat grid (117.46 BPM, first beat 0.058 s) comes from beat tracking. The few wordless beats were measured from the audio: the band hit before chorus 1 (40.6), the silence (140.55), the BONK (140.97), the drop (142.0) and the record scratch (178.0). The recording leaves out some lines of the lyric sheet below (the kids' shouts before each chorus, *"Steady!"*, *"…Why?"*, *"Your Majesty…"*, *"The best part of the story…"*), so those shots play without them.

| Time | Section | Lyric | Shot (`scene.js`) |
|---|---|---|---|
| 0–5.4 | Intro | *"By royal decree… the Book Fair is open."* | **fairOpen**: a push down the library from the desk: bunting, the DCES BOOK FAIR banner, Pearl's pink-and-gold throne by the mural, Safadi's and Robo's stalls on the front tables. YOU / SHALL / SEE! slam in on the fanfare |
| 5.4–8.3 | | *"Dazzle me."* | **pearlDecree**: the throne; Pearl, nose up, eyes shut |
| 8.3–10 | | *"Beep. Boop."* | **roboBeep**: Robo's stall, Clawd's hologram on the table, BEEP / BOOP |
| 10–16 | Verse 1 (Safadi) | *"Ladies and gentlemen…"* | **safStall**: Safadi behind his stall, his three books stacked in front; the kids watch from the aisle |
| 16–22.1 | | *"Mathematics! (Ooh!) Physics! (Ahh!) Astronomy too…"* | **safadiBooksShot**: a gold sunburst; powers on; the three books slam in on their words, then spin to show his face |
| 22.1–28.6 | | *"The judge is a princess, the prize is a crown… footnotes"* | **crownShot**: Pearl on her throne and the crown trophy; a FOOTNOTES¹ board and footnotes on footnotes |
| 28.6–34.6 | | *"I don't like to brag — (Oh, he's gonna brag!)"* | **safBrag**: the kids cup their mouths; the trophy drops into his PROFESSOR bag, wink |
| 34.6–37.8 | Pre-chorus | *"Is everybody ready?" "Is the ball up on the ladder?" "Steady!"* | **huddle** / **ladderUp**: the kids huddle by the back bookcase; Danny climbs the library ladder with a juggling ball |
| 37.8–40.5 | | *"Children… what exactly are you planning?"* | **safSuspicious**: Safadi, palms up, a sweat drop |
| 40.5–41.2 | | *"YOU SHALL SEE!"* | **kidsShout**: the kids jump; Danny grins from the top of the ladder |
| 41.2–56.2 | Chorus 1 | *"You shall see! Turn the page… Hey! Hey!… Read it! Write it! Flip it! (BONK!)"* | **chorus(0)**: six motion-graphics panels with page-turn wipes: the kids point at the lens; Alma's rainbow floor and a giant flipping book; Sami and Dragon on *Hey!*; Safadi baffled (*?*); READ IT (Housam, *City Spies*) / WRITE IT (Jenna) / FLIP IT (Danny somersaults) / a book slams shut: BONK!; everyone, YOU SHALL SEE! |
| 56.2–57.5 | Verse 2 | *"Contestant two."* | **pearlCU** |
| 57.5–61.8 | | *"Doctor Sami's Big Book of Boogers!"* | **samiPitch**: Sami on the rug with his green book; AH-CHOO! on *sneezes*, BUUURP! on *burps* |
| 61.8–63 | | *"…Ew. Next."* | **pearlMed**: a flipper waves him off; Safadi smug by the throne |
| 63–67.8 | | *"A pop-up book that counts by threes!… ACHOO!"* | **dragonPitch**: 3, 6, 9 pop up as paper towers; the sneeze-flame chars the book |
| 67.8–69.7 | | *"…It's on fire. Next."* | **pearlCU** |
| 69.7–82.9 | | *"PROMPT. RECEIVED. WRITE. A. BEST. SELL. ER."* | **roboPitch**: Robo goes red; Clawd's hologram pops out; pages blast from his mouth faster and faster, EAT YOUR BROCCOLI on every one, until CHAPTER 9,999 fills the lens |
| 82.9–83.5 | | *"…Why?"* | **pearlBuried**: Pearl under a drift of pages |
| 83.5–93.2 | Pre-chorus 2 (Pearl) | *"Bored, bored, I'm so royally bored…"* | **pearlBored**: a purple spotlight; she sinks lower each line, yawns, smacks the armrest on *something*; the kids rise into her light: *"Your Majesty… YOU SHALL SEE!"* |
| 93.2–109.4 | Chorus 2 | (chorus) | **chorus(1)**: the same six panels in blue; Pearl stays unmoved (*…*); a last-second polaroid of Danny up the ladder, ball in hand, winking |
| 109.4–115.8 | Bridge (Fester) | *"Hi… it's me. The jester you fired."* | **festerSpot**: the library darkens to one spotlight: Fester, hatless, holding his handmade book; Danny crouched on the ladder right above him |
| 115.8–118.8 | | *"Jenna drew the pictures, Alma made it dance, Danny wrote the jokes"* | **bookPages**: inside the book: Jenna's sketch of Fester draws itself, Alma dances in the margin, Danny's chicken joke ends in BONK! |
| 118.8–127.7 | Housam's rap | *"The ladder's two meters, gravity's nine-point-eight…"* | **mathRap**: Housam at a borrowed chalkboard: the ladder, the dotted fall, h = 2 m, g = 9.8, t = √(2h/g) ≈ 0.64 s circled; an inset of Danny waiting |
| 127.7–135.7 | Build | *"It's called… The Story of My Life. Chapter one: a ball fell on my head…"* | **reading** / **audience** / **reading**: Fester reads; CHAPTER cards pop; the kids and Pearl watch |
| 135.7–140.2 | | *"Ah! Allow me to EXPLAIN —"* | **explainCU**: Safadi steps in, powers flaring, bulb on: EXPLAIN! |
| 140.2–140.5 | | *"…now."* | **ladderCU**: Danny lets go |
| 140.5–141 | Silence | — | **fallWide**: the colour drains; everyone looks up; the ball falls Housam's 0.64 s |
| 141 | Drop | **BONK!** | **bonkCU**: swirl eyes, stars, a giant BONK!, a white flash |
| 141–144.2 | | *"Ha… ha-ha… HA-HA-HA-HA-HA!"* | **pearlLaugh**: a twitch, a snort, then she laughs so hard she rolls off the throne |
| 144.2–150.7 | | *"SHE LAUGHED! The princess LAUGHED!"* | **party**: everyone jumps; confetti and pages rain; Fester walks over to Pearl |
| 150.7–152.1 | | *"Fester… you're… HIRED!"* | **hired**: Fester kneels; the crown flips from her flipper onto his head: HIRED! |
| 152.1–156.4 | | *"I'm Jester Fester — and THIS is the story of my life!"* | **triumph**: Fester, crowned, ta-da |
| 156.4–170.4 | Final chorus | *"You shall see! (Eat your broccoli!)…"* | **finale**: everyone on Alma's rainbow floor: Pearl on her throne, Robo with Clawd on his head singing the counter-line, the Safadi twins, the kids, Fester juggling five balls (none land on his head), Dragon flying laps; YOU SHALL SEE! |
| 170.4–173.7 | Tag | *"…So. Nobody wants my books?" (crickets) "I'll take all three!"* | **tagStall**: Safadi alone at his stall; Dragon swoops in and hugs all three books |
| 173.7–175.8 | | *"Splendid! Now, let me explain chapter one —"* | **tagExplain**: pointer out, powers on |
| 175.8–178.3 | | *"Somebody… find me… ANOTHER PROFESSOR."* | **tagPearl**: deadpan, flipper raised; record scratch |
| 178.3–183.5 | | *"Beep. Boop."* | **roboTag**: Robo leans into the lens; iris on his eye; THE END (…or is it? You shall see!) |

## Notes for building

- **Re-timing:** fix a word time in `lyrics.js` and the karaoke, the mouths and every shot keyed to that line follow. A line's beat is 0.2 s before its first word.
- **Files:** `props.js` (prefix `ys`: backdrops, the banner, throne, ladder, books, pop-up book, pages, crown and trophy, the maths board, page-turn wipes), `lyrics.js` (the song rows, the singing test that drives mouths, the karaoke), `scene.js` (blocking in `PATH`, poses per character, cameras in `CAM`, the shots).
- **Blocking** (world, library reading view, so +X is screen-left): stage = the story rug (−330, 240); Fester reads at (−430, 190) under the ladder at X −470; Danny perches on the ladder (rung .62, about 155 up); Pearl's throne (170, 270); the kids' audience row at Z 330–345; Safadi's stall = reading table 1 right, Robo's = table 1 left.
- **Check frames** with `node render.mjs --scene=scene22_you_shall_see --sheet=…` and build with `scripts/build_scene.sh scene22_you_shall_see`.
