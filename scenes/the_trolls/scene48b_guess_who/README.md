# The Trolls · Guess Who

> A second take on the finale of *The Trolls*, cut to a different song, to choose between it and [scene 48](../scene48_the_trolls/README.md). The family wears Alma's monster drawings as costumes. Only bits of legs, hands and shoes peek out, and the song asks the audience to guess who is inside. No name is ever written on screen: the riddles are told in pictures, and the answer is the reveal.

| | |
|---|---|
| **Length** | 182.4 s · 24 fps · 120 bpm (the song) |
| **Cast** | Professor Safadi (the bat) · Doctor Sami (the owl) · Danny (the pumpkin) · Alma (the pink ghost) · Housam (the blue bird) · Jenna (the bee) · Sarah (the cat) · Roudaynah (the skull ghost) · Dr. G (broccoli in a sock); the students; Princess Pearl · King Neptune · Dragon |
| **Locations** | Dove Creek Elementary · science room (also math) · school library · school gym; the game-show stage for the riddles is drawn in `scene.js` |
| **Costumes** | Alma's real drawing, cut out into `costumes/*.png` (`costumes/cut.py` re-cuts them). Each drawing is worn over the character (`wearer()`): the character is drawn first, then the drawing on top, big enough to hide the face. The twins swap monsters from scene 48: the riddle's bat "loves to explain" and the owl has "big blue wings". |
| **Audio** | `audio.mp3`: "Twist It, Troll It", generated with Gemini. The karaoke is in `lyrics.js`. The recording sings "Now pull off the masks" twice and leaves out "Princess Pearl, King Neptune, and Dragon are free!". |

## Section map

| Time (s) | Song | Shot (`scene.js`) | What happens |
|---|---|---|---|
| 0–8.2 | intro | `title` | WHO'S WHO? The nine monsters pop up, a ? over each |
| 8.2–12 | "Welcome kids to the ultimate test!" | `march` | marching along the sidewalk, real legs underneath |
| 12–16 | "Which monster is who?" | `legsShot` | a low close shot: the feet are the only clue |
| 16–24 | riddle 1: the bat | `batRiddle` | the game-show stage; clue cards ONE FANG, GREEN SPOTS, LOVES TO EXPLAIN |
| 24–31.9 | "…big blue wings? Is it the doctor or professor?" | `twinsRiddle` | the owl joins; a stethoscope card and a chalkboard card swap places like a shell game; LOOK AT THE SHOES! |
| 31.9–48.1 | riddle 2: the pumpkin | `pumpkinRiddle` | THREE EYES, BATS ON A HAT, SPIKY TEETH, CUBES & BLOCKS (a tower drops in), 1×…5×, then a spin |
| 48.1–79.5 | Chorus 1 | `BATTLES` | eight tongue-twister battles in the science room, library, math and gym |
| 79.5–95.9 | riddle 3: the skull ghost | `ghostRiddle` | floating in a "digital space" of falling 0s and 1s; SKULL FACE, CANDY BUCKET, LAPTOP, TECH-MOM?, SISTER? AUNTIE? |
| 95.9–108 | riddle 4: the cat | `catRiddle` | STRIPES & SURPRISE, SCOREBOARD, MAKES THINGS, PLAYS BALL, TALLEST REBEL, WILD HAIR (red lightning), FAMILY |
| 108–112.1 | "Let's see if you can figure out who!" | `lineupShot` | all nine in a row, ? tags that turn into numbers 1–9 |
| 112.1–120.1 | instrumental | `volley` | the gym tournament: word volleyball, the score ticking |
| 120.1–124.1 | | `tie` | TIE! Everyone tongue-tied |
| 124.1–127.3 | | `guess` | LOCK IN YOUR GUESSES! 3 · 2 · 1 |
| 127.3–159.7 | Chorus 2 | `dance` | the dance party; Pearl, Neptune and Dragon on the stage at the back |
| 159.7–166 | "Now pull off the masks and let us see!" | `reveal` | the costumes pop off one per beat; DID YOU GUESS RIGHT? |
| 166–170 | "the professor, the doctor, and all of the kids" | `family` | a pan along the laughing faces |
| 170–174.1 | "look at the back… Take off your costumes" | `backOfHall` | whip-pan to the stage: "Now YOU! Take off your costumes!" |
| 174.1–178.6 | "Wait, these are real? Hip hip hooray!" | `real` | "These ARE our faces!", "Wait… these are REAL?!", and Pearl laughs with Neptune and Dragon |
| 178.6–182.4 | laughter | `theEnd` | THE END, iris out |

## Notes for editing (`scene.js`)

- **No names on screen.** Clue cards (`clue`, pictures in `ICON`) carry at most a couple of words of the sung clue. Keep it that way when adding text.
- **Costumes:** `wearer(name, x, y, k, t, o)` draws the person, then the drawing from low on the legs (`LEG`) to above the head, at least 0.8 of their height wide (`BIG` enlarges drawings with gaps). `off` (0–1) flips it away and the person underneath laughs.
- **Timing:** section constants `S_…` and `row(i)` (word times of lyric line i in `lyrics.js`); the battles are `BT(i)`.
