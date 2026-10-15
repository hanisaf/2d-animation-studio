# Scene 22: You Shall See

> A music video, and the payoff of [21 We Already Read a Lot!](../scene21_already_read/README.md). It's the DCES Book Fair, and the writing competition has a royal judge: **Princess Pearl**, who has never laughed in her life. Professor Safadi croons about his three books. Sami, Dragon and Robo-Safadi (with Clawd writing ten thousand pages a second) all get a bored *"…Next."* Then the kids' secret plan steps into the spotlight: **Jester Fester**, the jester Pearl fired, reading his memoir *The Story of My Life*, written with the kids. Housam has done the maths, and Danny is up a ladder with a juggling ball, waiting for one word. Safadi supplies it: *"Allow me to EXPLAIN—"* **BONK.** Pearl laughs for the first time ever, and Fester is **HIRED**. In the tag, Dragon buys all three of Safadi's books, Safadi starts explaining chapter one, and Pearl says: *"Somebody… find me… ANOTHER PROFESSOR."*

*Second scene of the writing-competition arc, and the end of the "Fester is fired" arc that began in [scene 02](../scene02_fired/README.md).*

| | |
|---|---|
| **Length** | 192 s, cut to a 120 BPM scratch arrangement until the real song (`audio.mp3`) exists. The song script for Gemini is in [`SONG.md`](SONG.md) |
| **Cast (all eleven)** | [Professor Safadi](../../characters/safadi/README.md) · [Princess Pearl](../../characters/princess_pearl/README.md) (the judge) · [Jester Fester](../../characters/jester_fester/README.md) · [Housam](../../characters/housam/README.md) · [Alma](../../characters/alma/README.md) · [Jenna](../../characters/jenna/README.md) · [Danny](../../characters/danny/README.md) · [Doctor Sami](../../characters/sami/README.md) · [Dragon](../../characters/dragon/README.md) · [Robo-Safadi](../../characters/robo_safadi/README.md) · [Clawd](../../characters/clawd/README.md) (inside the robot) |
| **Locations** | [School library](../../locations/school_library/README.md), dressed for the Book Fair: bunting, book stalls, a stage on the story rug, and Pearl's pink-and-gold throne wheeled in from the [throne room](../../locations/throne_room/README.md). Big musical moments cut to motion-graphics backdrops (sunbursts, flying pages, spotlights) as in [scene 17](../scene17_broccoli_directive/README.md) |
| **Sound** | The song is the whole soundtrack and every character's voice; karaoke runs along the bottom with the singer's name. For now: a synthesized scratch score and cartoon-voice scratch vocals |
| **Movie** | #22 |

## Why it should travel

- **A real story in three minutes:** a setup, three failures, a secret plan, a twist and a payoff, plus a button after the ending.
- **Every catchphrase pays off:** *"You shall see!"* (scenes 16 and 21), *"…and this is the story of my life"* (scene 01, now triumphant), *"EXPLAIN"* as the trigger word (scenes 19 and 20), *"Eat your broccoli"* (scene 17), Pearl's *"…why?"*, and *"Somebody find me another jester"* (scene 02) flipped into *"ANOTHER PROFESSOR."*
- **The twist is set up in plain sight:** the pre-chorus whispers *"Is the ball up on the ladder?"* in the first 40 seconds. Nobody thinks about it until the BONK.
- **A thumbnail moment:** Pearl, the dolphin who never laughs, cracking up on the beat drop.
- **A chant-able hook:** *"Read it! Write it! Flip it! (BONK!)"* is short enough for kids to shout and to use as a sound.

## Song map and shot list

Times are seconds into the scratch arrangement (120 BPM, one bar = 2 s) that the scene is cut to now. The lyric rows and their times live in [`lyrics.js`](lyrics.js); the story beats in `T_` at the top of [`scene.js`](scene.js) are read from them. Once `audio.mp3` exists, re-time `lyrics.js` to it (as scene 17 did) and the shots, mouths and karaoke follow.

| Time | Section | Lyric | Shot (`scene.js`) |
|---|---|---|---|
| 0–5.8 | Intro | *"By royal decree… the Book Fair is open."* | **fairOpen**: a push down the library from the desk: bunting, the DCES BOOK FAIR banner, Pearl's pink-and-gold throne by the mural, Safadi's and Robo's stalls on the front tables. YOU / SHALL / SEE! slam in on the fanfare |
| 5.8–8.2 | | *"Dazzle me."* | **pearlDecree**: the throne; Pearl, nose up, eyes shut |
| 8.2–10 | | *"Beep. Boop."* | **roboBeep**: Robo's stall, Clawd's hologram on the table, BEEP / BOOP |
| 10–15 | Verse 1 (Safadi) | *"Ladies and gentlemen…"* | **safStall**: Safadi behind his stall, his three books stacked in front; the kids watch from the aisle |
| 15–20 | | *"Mathematics! (Ooh!) Physics! (Ahh!) Astronomy too…"* | **safadiBooksShot**: a gold sunburst; powers on; the three books slam in on their words, then spin to show his face |
| 20–25 | | *"The judge is a princess, the prize is a crown… footnotes"* | **crownShot**: Pearl on her throne and the crown trophy; a FOOTNOTES¹ board and footnotes on footnotes |
| 25–30 | | *"I don't like to brag — (Oh, he's gonna brag!)"* | **safBrag**: the kids cup their mouths; the trophy drops into his PROFESSOR bag, wink |
| 30–35 | Pre-chorus | *"Is everybody ready?" "Is the ball up on the ladder?" "Steady!"* | **huddle** / **ladderUp**: the kids huddle by the back bookcase; Danny climbs the library ladder with a juggling ball |
| 35–37.9 | | *"Children… what exactly are you planning?"* | **safSuspicious**: Safadi, palms up, a sweat drop |
| 37.9–40 | | *"YOU SHALL SEE!"* | **kidsShout**: the kids jump; Danny grins from the top of the ladder |
| 40–56 | Chorus 1 | *"You shall see! Turn the page… Hey! Hey!… Read it! Write it! Flip it! (BONK!)"* | **chorus(0)**: six motion-graphics panels with page-turn wipes: the kids point at the lens; Alma's rainbow floor and a giant flipping book; Sami and Dragon on *Hey!*; Safadi baffled (*?*); READ IT (Housam, *City Spies*) / WRITE IT (Jenna) / FLIP IT (Danny somersaults) / a book slams shut: BONK!; everyone, YOU SHALL SEE! |
| 56–57.5 | Verse 2 | *"Contestant two."* | **pearlCU** |
| 57.5–63.5 | | *"Doctor Sami's Big Book of Boogers!"* | **samiPitch**: Sami on the rug with his green book; AH-CHOO! on *sneezes*, BUUURP! on *burps* |
| 63.5–65.9 | | *"…Ew. Next."* | **pearlMed**: a flipper waves him off; Safadi smug by the throne |
| 65.9–72.2 | | *"A pop-up book that counts by threes!… ACHOO!"* | **dragonPitch**: 3, 6, 9 pop up as paper towers; the sneeze-flame chars the book |
| 72.2–74.1 | | *"…It's on fire. Next."* | **pearlCU** |
| 74.1–84 | | *"PROMPT. RECEIVED. WRITE. A. BEST. SELL. ER."* | **roboPitch**: Robo goes red; Clawd's hologram pops out; pages blast from his mouth faster and faster, EAT YOUR BROCCOLI on every one, until CHAPTER 9,999 fills the lens |
| 84–85.5 | | *"…Why?"* | **pearlBuried**: Pearl under a drift of pages |
| 85.5–94 | Pre-chorus 2 (Pearl) | *"Bored, bored, I'm so royally bored…"* | **pearlBored**: a purple spotlight; she sinks lower each line, yawns, smacks the armrest on *something*; the kids rise into her light: *"Your Majesty… YOU SHALL SEE!"* |
| 94–110 | Chorus 2 | (chorus) | **chorus(1)**: the same six panels in blue; Pearl stays unmoved (*…*); a last-second polaroid of Danny up the ladder, ball in hand, winking |
| 110–117.5 | Bridge (Fester) | *"Hi… it's me. The jester you fired."* | **festerSpot**: the library darkens to one spotlight: Fester, hatless, holding his handmade book; Danny crouched on the ladder right above him |
| 117.5–122 | | *"Jenna drew the pictures, Alma made it dance, Danny wrote the jokes"* | **bookPages**: inside the book: Jenna's sketch of Fester draws itself, Alma dances in the margin, Danny's chicken joke ends in BONK! |
| 122–131.5 | Housam's rap | *"The ladder's two meters, gravity's nine-point-eight…"* | **mathRap**: Housam at a borrowed chalkboard: the ladder, the dotted fall, h = 2 m, g = 9.8, t = √(2h/g) ≈ 0.64 s circled; an inset of Danny waiting |
| 131.5–139.6 | Build | *"It's called… The Story of My Life. Chapter one: a ball fell on my head…"* | **reading** / **audience** / **reading**: Fester reads; CHAPTER cards pop; the kids and Pearl watch |
| 139.6–141.0 | | *"Ah! Allow me to EXPLAIN —"* | **explainCU**: Safadi steps in, powers flaring, bulb on: EXPLAIN! |
| 141.0–141.5 | | *"…now."* | **ladderCU**: Danny lets go |
| 141.5–142 | Silence | — | **fallWide**: the colour drains; everyone looks up; the ball falls Housam's 0.64 s |
| 142–143 | Drop | **BONK!** | **bonkCU**: swirl eyes, stars, a giant BONK!, a white flash |
| 143–146.4 | | *"Ha… ha-ha… HA-HA-HA-HA-HA!"* | **pearlLaugh**: a twitch, a snort, then she laughs so hard she rolls off the throne |
| 146.4–151.5 | | *"SHE LAUGHED! The princess LAUGHED!"* | **party**: everyone jumps; confetti and pages rain; Fester walks over to Pearl |
| 151.5–154.4 | | *"Fester… you're… HIRED!"* | **hired**: Fester kneels; the crown flips from her flipper onto his head: HIRED! |
| 154.4–158 | | *"I'm Jester Fester — and THIS is the story of my life!"* | **triumph**: Fester, crowned, ta-da |
| 158–176.3 | Final chorus | *"You shall see! (Eat your broccoli!)…"* | **finale**: everyone on Alma's rainbow floor: Pearl on her throne, Robo with Clawd on his head singing the counter-line, the Safadi twins, the kids, Fester juggling five balls (none land on his head), Dragon flying laps; YOU SHALL SEE! |
| 176.3–181.1 | Tag | *"…So. Nobody wants my books?" (crickets) "I'll take all three!"* | **tagStall**: Safadi alone at his stall; Dragon swoops in and hugs all three books |
| 181.1–183.5 | | *"Splendid! Now, let me explain chapter one —"* | **tagExplain**: pointer out, powers on |
| 183.5–187.3 | | *"Somebody… find me… ANOTHER PROFESSOR."* | **tagPearl**: deadpan, flipper raised; record scratch |
| 187.3–192 | | *"Beep. Boop."* | **roboTag**: Robo leans into the lens; iris on his eye; THE END (…or is it? You shall see!) |

## Notes for building

- **The soundtrack is a scratch until the real song exists.** `asset.js` has a synthesized 120 BPM `music` score (with the silence before the BONK and the cues), and `scene.js` passes `dialogue: YS_DIALOGUE`, which gives every lyric line cartoon-voice syllables in the singer's voice. To switch to the Gemini song: save it as `audio.mp3`, set `audio: 'audio.mp3'` in `asset.js` and delete `music`, remove the `dialogue` line from `scene({...})`, set `bpm`/`beatOffset` from beat tracking, and re-time `lyrics.js` to the recording.
- **Files:** `props.js` (prefix `ys`: backdrops, the banner, throne, ladder, books, pop-up book, pages, crown and trophy, the maths board, page-turn wipes), `lyrics.js` (the song rows, the singing test that drives mouths, the karaoke), `scene.js` (blocking in `PATH`, poses per character, cameras in `CAM`, the shots).
- **Blocking** (world, library reading view, so +X is screen-left): stage = the story rug (−330, 240); Fester reads at (−430, 190) under the ladder at X −470; Danny perches on the ladder (rung .62, about 155 up); Pearl's throne (170, 270); the kids' audience row at Z 330–345; Safadi's stall = reading table 1 right, Robo's = table 1 left.
- **Check frames** with `node render.mjs --scene=scene22_you_shall_see --sheet=…` and build with `scripts/build_scene.sh scene22_you_shall_see`.
