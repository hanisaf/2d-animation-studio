# Dream Mode

> A music video, the finale of the *Screen Time* arc ([32](../scene32_screen_time/README.md) → [33](../scene33_busted/README.md) → [34](../scene34_game_over/README.md) → [35](../scene35_game_night/README.md)). Asleep on the sofa after game night, the Safadi brothers dream they are inside their video games, and the kids, King Neptune, Robo-Safadi, Clawd, Jester Fester, Princess Pearl and Dragon are all in there with them. **PRESS START.** A Z drops into the slot: INSERT DREAM. On the character select screen the brothers pick themselves and the four kids join, one per beat. **World 1, Robo Invasion** (*mission: research… space*): the brothers fly a two-seat rocket with the kids as wingmen and shoot formulas at the marching robots, who bomb back with broccoli, until Housam volleys a ball into the giant robot boss. **World 2, World Champion** (*importance of sport ★★★★★*): Dream Team vs Robo FC with Jester Fester as referee. A pass on every beat, Housam's slow-motion bicycle kick… BONK, off Fester's head, GOAL. **World 3, Craft Blocks** (*"Who needs blocks and cubes?" WE DO*): Danny builds a castle a block per beat, the professor puts a block on his own head, a Broccreeper goes BROCCOLI BOOM and the doctor eats the florets (+1 HEALTH), and Danny solves a mountain-sized Rubik's cube into a rainbow staircase. **World 4, Fight Planet**: brother vs brother, the Explain-o-Beam against the Healthy-doken, DOUBLE K.O.… and a hug: **FAMILY-TY!** Then the final boss rises: **THE ALARM CLOCK**. Everyone attacks; it rings anyway. *CONTINUE? 9… 8…* The screen cracks, and the brothers wake up on the sofa in the morning sun, the kids standing over them with a ringing alarm clock and the board games. Everyone laughs. **THE END.**

| | |
|---|---|
| **Length** | 180 s · 24 fps · cut to a 120 bpm grid (a beat every 0.5 s, a bar every 2 s) so the song can be written to the picture |
| **Audio** | *High Scores and Hugs*, generated with Gemini from [`gemini/PROMPT.md`](gemini/PROMPT.md) (`song_gemini.mp3`, 180.2 s). `audio.mp3` is that song plus two synthesized alarm-clock rings (167.2 s, the boss; 172.05 s, Danny's clock), made by `sfx/make_alarm.py`. The karaoke (words only, no singer names) is in `lyrics.js`, timed from a word-level transcription of the recording. A few beats were re-timed to the song: the boss explosion (53.8 s), *WE DO!* (103.3 s), the Broccoli Boom (116.3 s), the cube solve (124.3 s), the Fight Planet rounds (Round 1 at 137.8 s, the specials from 139.6 s, Double K.O. at 152.0 s), the countdown, and the wake-up |
| **Style** | A video-game music video: every world has its own palette and its own game look (HUD, health bars, score pop-ups, pixel transitions), the camera always moves, and every hit lands on a beat. On-screen text is game text only: titles, HUD, sound effects and puns |
| **Cast** | [Professor Safadi](../../../characters/safadi/README.md) · [Dr. Sami](../../../characters/sami/README.md) · [Housam](../../../characters/housam/README.md) · [Alma](../../../characters/alma/README.md) · [Jenna](../../../characters/jenna/README.md) · [Danny](../../../characters/danny/README.md) · in the dream: [Robo-Safadi](../../../characters/robo_safadi/README.md) (invaders, Robo FC, the boss) · [King Neptune](../../../characters/neptune/README.md) · [Clawd](../../../characters/clawd/README.md) (the guide) · [Jester Fester](../../../characters/jester_fester/README.md) (the referee) · [Princess Pearl](../../../characters/princess_pearl/README.md) (the judge in the stands) · [Dragon](../../../characters/dragon/README.md) (the block carrier) |
| **Locations** | [Living room](../../../locations/living_room/README.md) (night, then morning) · the dream worlds are painted full-frame in `props.js` |

## The rules this scene keeps

- **It's their dream, so it's their games.** The four worlds are the four games of the arc: the twins' *Robo Invasion* and *World Champion* (scene 32), the kids' *Craft Blocks* and *Fight Planet* (scene 32).
- **Callbacks are the puns.** "…space…" becomes the World 1 mission, "…importance of sport!" the World 2 rating, "Who needs blocks and cubes?" the World 3 title, "Brother, you are not as good as I am" the World 4 match, broccoli is the enemy's ammunition, and Fester's ball always finds his head.
- **This time they play together.** In scene 34 the twins lost alone; in the dream every level is won by the brothers and the kids as one team.
- **Palette arc:** night blue (the living room) → CRT black and neon (the menus) → deep space violet (World 1) → stadium floodlight green (World 2) → sky blue and grass (World 3) → orange planet dusk (World 4) → alarm red (the boss) → morning gold (waking up).

## Section map and shot list

Times are seconds. Bars are 2 s at 120 bpm. The "song" column is the brief for the music.

| Time | Section (song) | Shot (`scene.js`) | What happens |
|---|---|---|---|
| 0–8 | **Intro** (soft lullaby, music box, snoring) | `dozing` | The living room at night. The twins snore head to head; their Z's float up, turn into pixel Z's, and the camera pushes into Safadi's dream bubble |
| 8–12 | (a CRT power-on, a coin drop) | `pressStart` | The bubble is a CRT: PRESS START blinks; a big Z drops into the slot: INSERT DREAM |
| 12–16 | (the beat kicks in) | `title` | **DREAM MODE · GAME ON!** slams in on a pixel burst; the twins' faces pop in either side |
| 16–24 | Verse 1 | `select` | Character select: twelve portraits. P1 (gold) lands on the professor, P2 (mint) on the doctor; the kids flash JOINED! one per beat; Clawd's portrait winks: GUIDE. Then SELECT WORLD: four cartridges; the cursor dives into World 1 |
| 24–28 | | `card1` | WORLD 1 · ROBO INVASION · *MISSION: RESEARCH… SPACE* |
| 28–36 | Verse 1 | `spaceFly` | Deep space: the twins in a two-seat rocket, the kids in four little ships in formation, stars streaming, planets sliding past; they bank on the beats |
| 36–44 | Pre-chorus | `invaders` | Robo-Safadi invaders march on the beat and drop broccoli bombs (BROCCOLI INCOMING!); the twins' rocket fires formulas (E=mc², π, √2, Σ): ZAP, +100 |
| 44–50 | | `shields` | Alma's rainbow shield blocks the broccoli; Jenna's ship does a BARREL ROLL; Danny's ship drops a block on a robot: CRUNCH |
| 50–58 | Chorus 1 | `mothership` | The boss: a giant Robo-Safadi, red eyes, health bar. Everyone fires; Housam volleys a ball into his chest: KA-BOOM, broccoli confetti. LEVEL CLEAR! |
| 58–62 | | `warp1` | A pixel wipe into a warp pipe: WORLD 2 |
| 62–66 | Verse 2 | `card2` | WORLD 2 · WORLD CHAMPION · *IMPORTANCE OF SPORT ★★★★★* |
| 66–74 | | `kickoff` | A floodlit stadium, Pearl in the stands with a 10 card. Referee Fester blows the whistle; Dream Team vs Robo FC; the doctor dribbles past two robots with step-overs |
| 74–82 | Pre-chorus | `passes` | A pass on every beat: Sami → Danny → Jenna (a cartwheel header) → Alma → Housam; COMBO ×2, ×3, ×4, ×5 |
| 82–90 | Chorus 2 | `bicycle` | Slow-mo letterbox: Housam's bicycle kick. The robot keeper dives… the ball misses the goal, BONKS Fester's head and bounces in: GOAL!!! Fester, dizzy, shrugs at the camera |
| 90–96 | | `celebrate` | Knee slides and confetti; DREAM TEAM 1 – 0 ROBO FC; Pearl's 10 card |
| 96–100 | | `warp2` | The ball pixelates into a grass block: WORLD 3 |
| 100–104 | Verse 3 | `card3` | WORLD 3 · CRAFT BLOCKS · *"WHO NEEDS BLOCKS AND CUBES?"* crossed out: **WE DO!** |
| 104–112 | | `build` | A blocky meadow: Danny builds a castle a block per beat; Dragon flies in carrying blocks; the professor places one… on his own head: BLOCK HEAD |
| 112–120 | Pre-chorus | `creeper` | A green Broccreeper sneaks up behind the professor: sssss… BROCCOLI BOOM! Florets rain; the doctor catches and munches them: +1 HEALTH |
| 120–128 | Chorus 3 | `cube` | A mountain-sized Rubik's cube; Danny twists it, a face per beat, until it's solved and unfolds into a rainbow staircase: MINE-D BLOWN! |
| 128–136 | | `blockParty` | Everyone dances on the castle (BLOCK PARTY!), Alma's rainbow floor pulsing; then the world crumbles block by block into stars |
| 136–140 | Bridge | `vs` | FIGHT PLANET: a split-screen VS card, **PROF. SAFADI vs DR. SAMI**, lightning down the middle: BROTHER VS BROTHER |
| 140–144 | | `round1` | An orange planet arena under huge rings; health bars; ROUND 1… FIGHT! |
| 144–152 | | `combos` | Explain-o-Beam! (a chalkboard and a formula beam) vs Healthy-doken! (an apple fireball); hits, COMBO ×3; the kids cheer on the sidelines, two for each brother |
| 152–158 | | `doubleKO` | Both specials at once: the beams meet, a white flash, DOUBLE K.O. They sit up, laugh, hug: **FAMILY-TY!** The kids pile on |
| 158–162 | Final chorus | `bossRise` | The planet's ring tilts into a clock face… the ground shakes: FINAL BOSS · THE ALARM CLOCK rises, bells ringing |
| 162–168 | | `bossFight` | Everyone at once: Neptune's rainbow blast, a formula beam, an apple fireball, Housam's ball, Alma's rainbow, Danny's block, Clawd zapping; the boss's health bar drains… and it rings anyway: RIIING! |
| 168–172 | | `continue` | GAME OVER? CONTINUE? 9… 8… 7… the brothers mash buttons; the screen cracks; white flash |
| 172–180 | Outro | `wakeUp` | The living room in morning sun. The kids stand over the sofa with a ringing alarm clock and the board games; the twins jolt awake, look at each other, and everyone laughs. Freeze: THE END |

## Song brief (for Gemini)

- **Tempo and length:** 120 bpm, 180 s, so a bar is 2 s and every section starts on a bar in the table above.
- **Sound:** chiptune pop on top of a real band: 8-bit leads and arpeggios, punchy drums, a big synth bass, with game sounds (coin, power-up, 1-UP, laser, whistle) woven in. A different flavour per world: space synths (World 1), stadium chants and brass (World 2), plinky marimba and a block-stacking groove (World 3), a fighting-game rock riff (World 4), an alarm-bell breakdown (the boss), and a sleepy music-box lullaby for the intro and the wake-up.
- **Story to sing:** two brothers asleep after game night dream they're inside their video games with the kids; level after level they win as one team; the final boss is the morning alarm clock. A chorus hook along the lines of "Game on, dream on, press start, we're playing together", with the puns from the shot list free to use: *research space*, *importance of sport*, *who needs blocks and cubes?*, *family-ty*, *continue?*.
- **Voices:** the twins (warm, older), the four kids (bright), and a game announcer for the titles ("World one!", "Round one… fight!", "Game over?").

## Notes for editing (`scene.js`, `props.js`)

- **Section starts** are the constants at the top of `scene.js` (`S_TITLE`, `S_SELECT`, `S_W1`, …, `S_WAKE`, `END`), and each shot times its beats as offsets from its section start, so when the song arrives a section can be moved by changing one number. `beat(t)` and `onBeat(t, t0)` give the beat grid.
- **The worlds** are drawn by `props.js`: `dmCRT`, `dmSpace`, `dmShip`, `dmStadium`, `dmBlocks`, `dmCube`, `dmPlanet`, `dmClock`, plus the game furniture (`dmHUD`, `dmBar`, `dmPop`, `dmPixelWipe`, `dmCard`). It reuses `stArcade` (scene 32), `rvtSunburst` / `rvtSpeedLines` / `rvtLightning` / `rvtConfetti` (scene 31) and `cuGame` (scene 28, the board-game boxes), so those scenes must stay registered before this one.
- **Characters inside ships** are the full rigs clipped to the cockpit dome (`dmPilot`).
- **The video-game look** is a post-process over each finished frame (`dmGameFX` in `props.js`): a CRT pass (RGB split, barrel curvature, bloom, scanlines, aperture mask, vignette, rounded corners, flicker), off in the living room and on the PRESS START TV and fading out as the brothers wake. `LOOK` in `scene.js` sets it; a pixelated version (`pixel: 6, levels: 8`, which resolves in on the title, glitches at each new world and shatters on the screen crack) was tried and judged too strong. The karaoke is drawn after it, so it stays crisp.
