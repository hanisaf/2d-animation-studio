# The Trolls

> *The Trolls*, episode four and the finale, as a music video. Dressed as the monsters Alma drew, the family marches on Dove Creek Elementary and challenges every class to tongue twisters. The heads come off, everyone laughs, and the students ask Princess Pearl, King Neptune and Dragon to take off their costumes too.

| | |
|---|---|
| **Length** | 182.4 s · 24 fps · 120 bpm (the song) |
| **Cast** | the costumed nine: [Professor Safadi](../../../characters/safadi/README.md) (the grumpy top-hat owl) · [Doctor Sami](../../../characters/sami/README.md) (the big bat) · [Danny](../../../characters/danny/README.md) (the fuzzy pumpkin) · [Alma](../../../characters/alma/README.md) (the pink ghost) · [Housam](../../../characters/housam/README.md) (the blue bird) · [Jenna](../../../characters/jenna/README.md) (the buzzy bee) · [Sarah](../../../characters/sarah/README.md) (the stripy cat) · [Roudaynah](../../../characters/roudaynah/README.md) (the skull ghost) · [Dr. G](../../../characters/dr_g/README.md) (broccoli in a sock); the [students](../../../characters/student/README.md); [Princess Pearl](../../../characters/princess_pearl/README.md) · [King Neptune](../../../characters/neptune/README.md) · [Dragon](../../../characters/dragon/README.md) |
| **Locations** | [Dove Creek Elementary](../../../locations/dces/README.md) · [science room](../../../locations/science_room/README.md) (also the math class) · [school library](../../../locations/school_library/README.md) · [school gym](../../../locations/school_gym/README.md); the hallway is drawn in `scene.js` |
| **Costumes** | Alma's real drawing (from [Troll Analytics](../scene47_troll_analytics/README.md)), cut out into `costumes/*.png`. There were eight monsters for nine people, so Dr. G got whatever was left: a broccoli in a sock, drawn in code (`broccoliSock`). |
| **Audio** | `audio.mp3`: "Broccoli Socks, Slippery Shoes", generated with Gemini from [`gemini/PROMPT.md`](gemini/PROMPT.md). The karaoke is in `lyrics.js`. |

## Section map

Every section starts on the song's grid (beats at 0.1 + 0.5 n s). The constants are at the top of `scene.js`.

| Time (s) | Song | Shot (`scene.js`) | What happens |
|---|---|---|---|
| 0–3.3 | intro | `titleShot` | THE TROLLS · THE FINALE on crayon paper; the nine costumes pop up on the beats |
| 3.3–8.1 | "One! Two! Three! Let's go!" | `streetMarch` | the gang marches in step along the sidewalk; the counts slam in on the words |
| 8.1–16.1 | "Listen up closely… what a surprise!" | `heroWalk` | slow-motion low angle, leaves blowing, two students gasp |
| 16.1–20.1 | Verse 1 | `doorsMarch` | marching on the doors |
| 20.1–23.6 | | `doorsBurst` | BAM! The doors fly open |
| 23.6–35.3 | the pumpkin, the owl, the pink ghost, the blue bird | `crewCard` ×4 | heist-movie crew cards: the costume, its nickname, a.k.a. who's inside |
| 35.3–39.4 | "storming the school" | `hallway` | the rest of the crew whizzes past the lockers with name tags |
| 39.4–43.9 | "So line up, you students" | `classEnter` | MONSTERS! in the science room |
| 43.9–47.8 | "a tongue-twister battle" | `vsShot` | THE GRUMPY OWL VS THE WHOLE SCHOOL |
| 47.8–79.8 | Chorus 1 (×2) | `b1`…`b8` | eight 4-second battles (below) |
| 79.8–81.8 | | `toGym` | everyone runs down the hall: GYM → |
| 81.8–85.7 | "Step into the gym" | `gymEnter` | TONGUE-TWISTER TOURNAMENT! The bleachers fill |
| 85.7–87.9 | "a wide monster grin" | `grins` | punch-ins on four grins, one per beat |
| 87.9–89.9 | "Rule number radish!" | `radish` | the broccoli in a sock, a crowned radish |
| 89.9–91.9 | "five times… spinach" | `spinach` | 1× 2× 3× 4× 5×, spinach flies |
| 91.9–93.9 | "Broccoli socks and a slippery shoe" | `slipperyShoe` | WHEEEE! A student slides the length of the court |
| 93.9–96.2 | "I challenge the ghost" | `dareGhost` | A STUDENT VS THE SKULL GHOST |
| 96.2–112.2 | Chorus 2 | `volley` | word volleyball: a twister word arcs across the court on every beat; the score ticks to 4–3 |
| 112.2–115.1 | | `tired` | everyone tongue-tied: TIE! 4–4 |
| 115.1–119.4 | Bridge: "the ultimate test" | `faceOff` | lights down, spotlights: the owl vs the champion student |
| 119.4–123.5 | | `stare` | a western split-screen stand-off, eyes vs eyes |
| 123.5–127.7 | "A dolphin in space wearing bright red shoes" | `space` | King Neptune swims through space in red sneakers |
| 127.7–131.7 | "making the news" | `news` | BREAKING: MONSTERS TWIST DOVE CREEK, and the YouToon views climb from 21 into the millions |
| 131.7–135.7 | "One, two, three, let's go!" | `countdown` | 1 · 2 · 3 · LET'S GO! on the stage side of the gym |
| 135.7–144.1 | "Everyone together now" | `together` | faster and faster, the camera spins… TONGUE-TIED! Everyone flops |
| 144.1–166.6 | Final chorus | `dance` | the dance party: confetti, coloured lights; Pearl, Neptune and Dragon on the stage at the back |
| 166.6–172.5 | "The heads come off" | `reveal` | the costumes pop off one per beat; everyone inside is laughing, and so is the school |
| 172.5–175.6 | "look at the back, on the shelf in the hall" | `backOfHall` | whip-pan to the stage: "Now YOU! Take off your costumes!" |
| 175.6–179.4 | "The dolphin is laughing, the biggest of all!" | `faces` | Pearl: "These ARE our faces!" … and for the first time ever, PEARL LAUGHED |
| 179.4–182.4 | | `theEnd` | the whole gym laughing, THE END, iris out |

### The chorus 1 battles

Each runs 4 s: the challenger's twister, a snap zoom onto the victim's flub, the gag, then the laughs.

| # | Where | Challenger → victim | Twister | Flub and gag |
|---|---|---|---|---|
| 1 | science | the pumpkin → a student | *Fuzzy pumpkins fizz in frizzy flasks!* | "…FIZZY FOAM!" Foam everywhere |
| 2 | science | a student → the owl | *Grumpy owls grow great green grapes!* | "…allow me to EXPLAIN—" NO EXPLAINING! |
| 3 | library | the pink ghost → a student (whispering) | *Shhh… six shy sheep shush sleepy shelves…* | "…AH-CHOO!" Books fly off the shelves |
| 4 | library | a student → the bat (hanging upside down) | *Big black bats bring back blue books!* | "…BONK!" A book avalanche |
| 5 | math | the cat → a student | *Sixty-six sticky sixes stick to six sticks!* | "6! 6! 6! 6!" Sixes explode off the board |
| 6 | math | a student → the skull ghost | *Proper programmers properly prove pi!* | perfect, of course: "…Semicolon." 100%, crickets |
| 7 | gym | the blue bird → a student | *Blue birds bounce big bouncy balls!* | "BOING BOING!" Off his head and into the hoop |
| 8 | gym | a student → the bee | *Busy bees buzz by bright blue bleachers!* | "BZZZZZ!" A double cartwheel |

## Notes for editing (`scene.js`)

- **Timing:** the section constants (`S_…`) and `BT(i)` (battle i) are in seconds into the song. `lyrics.js` has the word times; `trKaraoke` draws the strip on every shot (`withKaraoke`).
- **Costumes:** `monster(name, x, y, k, t, o)` draws a costume standing at screen (x, y) with k px per world unit. The options are `walk`, `hop`, `rot`, `sq`, `spin`, `flip`, `scale`, `angry` (red lightning) and `off` (0–1: it flies off, spinning). `COST` holds each one's height, nickname, crew colour and who's inside. To swap a costume, change its `spr`. To re-cut a sprite, see the crop boxes used for `costumes/` (one PNG per monster, transparent background).
- **The reveal:** in `danceItems`, a costume with `off > 0` draws the real character underneath with `person()`, laughing. `offAt(n)` staggers them one per beat in `REVEAL_ORDER`.
- **Staging:** `staged(set, P, t, opt, items)` sorts the costumes and students (`M(…)` and `K(…)` items) far to near, and interleaves the set's front pieces. Dove Creek's front pieces are drawn once, over everyone.
- **Battles:** `battle(cfg)` is one 4-second exchange. Edit `twist`, `flub` and `gag`, or the two cameras `camA` (two-shot) and `camB` (the victim, snapped to at 1.65 s).
- **Students:** `kid(seed, …, { mood })` with moods `gasp`, `laugh`, `cheer`, `flub`, `talk`, `run` and `flat`. The same seed is always the same kid.
