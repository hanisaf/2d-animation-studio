# Scene 26: The Perfect Drop

> A music video, and the finale of the competition arc ([23](../scene23_secret_potion/README.md) → [24](../scene24_competition_begins/README.md) → [25](../scene25_cube_drops/README.md)). After the talent show, the curtain opens on the after-show concert, and the headliner is **Princess Pearl**: the judge who is never dazzled, finally dazzling, golden mic in flipper. She sings every line of *The Perfect Drop* while everyone else performs around her. Jenna and Alma cartwheel, Housam bicycle-kicks, Danny does the puggle, the parents go crazy, Professor Safadi explains why a shortcut does not exist, and Fester shreds a guitar solo with Robo-Safadi on drums (until a ball finds his head). On **"MIC DROP!"** she drops the mic, and the music stops dead. In the silence, water drips into the spotlight… a puddle… and **Neptune** rises out of it, picks up the mic and taps it: *"Testing… testing… KING Neptune is in the house!"* He winks, the iris closes on his starfish: **THE END**.

*Neptune's debut.*

| | |
|---|---|
| **Length** | 160.6 s: the song (`song.mp3`, 149.8 s, generated with Gemini; the music stops at 146.9 s) plus a 14-second silent coda with Neptune |
| **Sound** | `audio.mp3` = the song + the teaser's sound effects and cartoon voices, mixed by [`mix_audio.py`](mix_audio.py) (`python3 scenes/scene26_perfect_drop/mix_audio.py`). The singer says "HOW-sam"; the mix ducks her under that word and lays `housam_vocal.wav` on top, a sung "Hussam" (حسام) made by [`fix_housam.py`](fix_housam.py) (macOS's Arabic voice, re-sung on the song's E4 with the WORLD vocoder). Pearl's is the only singing voice; karaoke runs along the bottom with her name |
| **Cast** | [Princess Pearl](../../../characters/princess_pearl/README.md) (the singer) · [Jenna](../../../characters/jenna/README.md) · [Alma](../../../characters/alma/README.md) · [Housam](../../../characters/housam/README.md) · [Danny](../../../characters/danny/README.md) · [Professor Safadi](../../../characters/safadi/README.md) · [Doctor Sami](../../../characters/sami/README.md) · [Jester Fester](../../../characters/jester_fester/README.md) · [Dragon](../../../characters/dragon/README.md) · [Robo-Safadi](../../../characters/robo_safadi/README.md) · [Clawd](../../../characters/clawd/README.md) · [Neptune](../../../characters/neptune/README.md) (debut) · [Students](../../../characters/student/README.md) (the parents) |
| **Location** | [School gym](../../../locations/school_gym/README.md): the stage view (`dir: -1`) for the concert, with a ★ THE PERFECT DROP ★ banner and Pearl's throne by the curtain; the scoreboard view (`dir: 1`) for the audience and the scoreboard. The choruses and the big musical moments cut to motion-graphics panels, as in [scene 17](../../halloween/scene17_broccoli_directive/README.md) and [scene 22](../../book_fair/scene22_you_shall_see/README.md) |
| **Borrowed props** | Scene 22's backdrops, throne, confetti and page wipes (`ys…`), scene 24's judges' table, chairs and score paddles (`cb…`) and scene 25's cube, hands and trophies (`cd…`), so those scenes must stay registered |

## The rules this scene keeps

- **Pearl sings the whole song.** She's on screen for every line: on her throne in the gym, front and centre in the chorus panels, or in a round **LIVE** picture-in-picture when another character has the spotlight. She holds a golden mic the whole time, until she drops it.
- **Everyone contributes.** Every character from the arc gets a moment that pays off something earlier: the cartwheels and the "secret potion" (scene 23), the bicycle kick and the judges' table (scene 24), the puggle and the trophies (scene 25), Safadi's explicit/tacit lesson (scene 23), Fester's ball-on-the-head gag (scene 01), Robo-Safadi and Clawd (scenes 17–20).
- **The mic drop is real.** The music dies as the mic lands (147.15 s), and the teaser plays in silence.
- **Neptune is set up in plain sight.** On *"We're the kings…"* (91 s), a blue dorsal fin glides across the court in front of the stage.

## Song map and shot list

Times are seconds into the song. Every sung word's start time lives in [`lyrics.js`](lyrics.js) (a word-level transcription of the recording aligned to the lyric sheet); the shots in [`scene.js`](scene.js) read their beats from those lines by id. The beat grid is 115 BPM, first beat 0.365 s.

| Time | Section | Lyric | Shot (`scene.js`) |
|---|---|---|---|
| 0–3.4 | Intro | *"Woo-oo-oo!"* | **darkOpen**: the dark gym, two spotlights sweep the closed curtain; THE PERFECT DROP, *starring Princess Pearl* |
| 3.4–5.6 | | *"Are you ready for the show?"* | **curtainUp**: the curtain opens on Pearl on her throne, mic at her beak; the lights come up |
| 5.6–7.4 | | *"Woo-oo-oo!"* | **wooCU**: Pearl up close, eyes shut, beams behind |
| 7.4–8.5 | | *"Here we go!"* | **hereWeGo**: mic raised; Jenna and Alma skip in from the wings; confetti |
| 8.5–10.7 | Verse 1 | *"Jenna spins and cartwheels high"* | **jennaWheel**: four cartwheels across the front of the stage |
| 10.7–12.9 | | *"Alma tries and hits the sky"* | **almaSky**: one cartwheel, then a star jump so high the camera tilts up after her |
| 12.9–14.9 | | *"They both practiced every day"* | **practiceDays**: calendar pages MON–FRI; Alma flops ✗ ✗ ✗, then lands it ✓ |
| 14.9–17.0 | | *"Now they're smiling all the way"* | **girlsSmile**: the girls flank the throne holding their jump-rope trophies |
| 17.0–19.1 | | *"Housam kicks the soccer ball"* | **housamKick**: the bicycle kick into the stage hoop; SWISH |
| 19.1–21.0 | | *"Makes the crowd go crazy"* | **crowdCrazy**: the parents leap out of their chairs; the Safadi brothers lead the cheering; Pearl's judge's chair sits empty |
| 21.0–23.3 | | *"Perfect score up on the board"* | **perfectScore**: the scoreboard reads 10–10, buzzer; paddles slam up: DRAGON 10, FESTER 10, PEARL 10 |
| 23.3–25.4 | | *"What a wonderful reward!"* | **trophyShine**: the four golden trophies pop up along the stage lip |
| 25.4–42.0 | Chorus 1 | *"We worked hard and solved it…"* | **chorus(0)**: eight panels, one per line: a giant cube face solving behind Pearl · the kids jump on *yeah!* · Housam's ball flattens the SHORTCUT sign · Danny's hands solve the cube (Pearl LIVE) · the girls cartwheel behind Pearl · the grown-ups cheer · the SECRET POTION stamped NO · everyone points down the lens: SOLVED! |
| 42.0–44.0 | Verse 2 | *"Danny takes his magic cube"* | **dannyCube**: Danny beside the throne, the cube sparkling over his head |
| 44.0–45.9 | | *"Solves it like a super dude"* | **superDude**: a red sunburst, a cape, the cube solving in a blur |
| 45.9–48.4 | | *"Then he does the puggle trick"* | **puggleTrick**: thrown high, caught solved: PUGGLE! |
| 48.4–50.2 | | *"Winning trophies super quick"* | **trophyRain**: four trophies slam in on the beat |
| 50.2–52.2 | | *"There is no such magic drink"* | **noDrink**: the brothers' secret potion gets a NO stamp; Sami sips it anyway: BLEECH! |
| 52.2–54.4 | | *"You just have to stop and think"* | **stopThink**: question marks over Safadi, until the bulb lights |
| 54.4–56.4 | | *"Practice hard and play your best"* | **practiceGrid**: four practice panels around a LIVE Pearl |
| 56.4–58.5 | | *"That will beat the hardest test"* | **hardestTest**: THE HARDEST TEST fills itself in; A+ on *test* |
| 58.5–75.2 | Chorus 2 | (chorus) | **chorus(1)**: the same eight panels in blue; Dragon's flame takes the sign |
| 75.2–77.4 | Bridge | *"Professor Safadi speaks so clear"* | **safadiClear**: the gym dims to purple; Safadi steps into a spotlight, powers on |
| 77.4–79.4 | | *"Listen up and lend an ear"* | **lendEar**: everyone cups an ear (shh…) |
| 79.4–81.5 | | *"A shortcut does not exist"* | **noShortcut**: Fester tiptoes toward a SHORTCUT sign… BONK |
| 81.5–83.6 | | *"Practice with an open fist"* | **openFist**: Safadi's fist opens; a solved cube floats up off his palm |
| 83.6–85.7 | | *"Now we know just how to learn"* | **howToLearn**: his chalkboard: BOOKS = the WHAT, PRACTICE = the HOW (scene 23) |
| 85.7–87.7 | | *"That's the only way we turn"* | **onlyWay**: Pearl spins on her throne; the cube wall turns a quarter |
| 87.7–89.8 | | *"We all did the perfect drop"* | **perfectDropSplit**: four panels, four landings on *drop*; the title slams |
| 89.8–92.0 | | *"We're the kings and we won't stop!"* | **kings**: everyone on stage in paper crowns… and a blue fin glides past |
| 92.0–108.9 | Chorus 3 | (chorus) | **chorus(2)**: the panels in magenta; Danny's cube takes the sign |
| 108.9–113.0 | Guitar solo | — | **soloWide**: Fester shreds a jester flying-V; Robo-Safadi on drums; Pearl headbangs, mic high |
| 113.0–115.1 | | — | **roboDrums**: BA-DUM-TSS!, Clawd bouncing alongside |
| 115.1–117.2 | | — | **dragonLoops**: Dragon flies fire-breathing loops over the cheering parents |
| 117.2–119.3 | | — | **brosHeadbang**: the Safadi twins' air guitar |
| 119.3–121.4 | | — | **rainbowDance**: Alma and Jenna on Alma's rainbow floor |
| 121.4–123.6 | | — | **festerSlide**: the knee slide: SKRRRT! |
| 123.6–125.5 | | — | **soloBonk**: the last note… a ball drops from the rig: BONK (124.9). Pearl cracks up |
| 125.5–134.0 | Chorus 4 | (chorus, lines 1–4) | **chorus(3)**: the panels in green, with confetti; Pearl's tail flick takes the sign |
| 134.0–142.3 | | (chorus, lines 5–8) | **finale**: everyone on the rainbow floor: Pearl centre, Robo with Clawd, the twins, the kids' tricks, Fester juggling five, Dragon flying laps; SOLVED! |
| 142.3–145.5 | Outro | *"Let the beat drop low…"* | **beatLow**: the lights go down to one spotlight on Pearl; the kids fade to silhouettes |
| 145.5–146.3 | | *"MIC DROP!"* | **micDropCU**: flipper out, mic up, nose in the air… she lets go |
| 146.3–148.3 | | (silence) | **micFall**: the mic falls in slow motion; THUD (147.15) as the music dies; its light turns red |
| 148.3–150.8 | Teaser | (silence) | **silence**: the empty throne, the mic in its spotlight; drip… drip… a puddle spreads |
| 150.8–154.6 | | *"Testing… testing…"* | **neptuneRise**: SPLOOSH: Neptune rises out of the puddle, ring of water spinning, picks up the mic, tap tap |
| 154.6–160.6 | | *"KING Neptune is in the house!"* | **neptuneKing**: nose up, crown wobbling; he winks, an iris closes on his starfish, THE END on black |

## Notes for building

- **Re-timing:** fix a word time in `lyrics.js` and the karaoke, Pearl's beak and every shot keyed to that line follow. A line's beat is 0.2 s before its first word. The teaser's beats (`T_.thud`, `T_.rise`, `T_.king`…) are at the top of `scene.js` and match `mix_audio.py`; change both together, then re-run the mix.
- **Files:** `props.js` (prefix `pd`: the mic, the guitar, the drum kit, the potion, the SHORTCUT sign, the test paper, calendar pages, the cape, the cube wall, paper crowns, concert beams, the banner, the puddle, the title card), `lyrics.js` (the song rows, `pdSinging`, the karaoke), `scene.js` (Pearl and her mic, the gym stage, the shots), `mix_audio.py` (the soundtrack).
- **Pearl's mic:** `drawPearl(…, mic)` holds it at her beak (`'sing'`, the grip runs back to her flipper), high (`'raise'`), held out (`'out'`), or not at all (`'none'`). Neptune uses the same `beakMic` once he has it.
- **Blocking** (world units, gym stage view, so +X is screen-left): Pearl's throne at (0, 150) on the stage (Y 100), just in front of the curtain; the kids along the front at Z 230–260; Fester at X ±260, Robo-Safadi and the drums at X −380; the mic lands at (−30, 180); Neptune rises at X 110.
- **Check frames** with `node render.mjs --scene=scene26_perfect_drop --sheet=…` and build with `scripts/build_scene.sh scene26_perfect_drop`.
