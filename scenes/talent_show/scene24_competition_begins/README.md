# Scene 24: The Competition Begins

> Talent-show night in the DCES gym. The judges are **Dragon**, **Jester Fester** and **Princess Pearl**; the Safadi brothers sit among the parents. The group dance ends the group round and the parents love it, but the judges don't: **9, 7… 3** (*"Somebody blinked off the beat. I saw it."*). Then the individual talents, each kid introducing themself in their own funny way. **Alma** (*"I love dancing, drawing… and falling over"*) cartwheels for **10, 9, 8**. **Jenna** (*"my brain thinks the ceiling is the floor!"*) cartwheels even better for **10, 9, 9**. **Housam** (*"a soccer player… in a basketball gym. This ball is so confused."*) bicycle-kicks the ball into the basketball hoop for **10, 10, 9**. Then **Danny** dribbles in with his Rubik's cube (*"…and I can drink broccoli juice without crying. …Almost."*), and Doctor Sami panics: maybe they should have made him practice instead. *"Don't worry, brother. Danny is smart. I'm sure he will make us proud."* *"I hope so…"* *To be continued…*

*After [23 The Secret Potion](../scene23_secret_potion/README.md).*

| | |
|---|---|
| **Length** | 170 s · 24 fps · 4080 frames |
| **Cast** | [Princess Pearl](../../../characters/princess_pearl/README.md) · [Jester Fester](../../../characters/jester_fester/README.md) (judge and announcer) · [Dragon](../../../characters/dragon/README.md) · [Professor Safadi](../../../characters/safadi/README.md) · [Dr. Sami](../../../characters/sami/README.md) · [Alma](../../../characters/alma/README.md) · [Jenna](../../../characters/jenna/README.md) · [Housam](../../../characters/housam/README.md) · [Danny](../../../characters/danny/README.md) · [Students](../../../characters/student/README.md) (the five dancers; the parents are the same rig scaled up 1.3×) |
| **Location** | [School gym](../../../locations/school_gym/README.md): stage view (`dir: -1`) for the performers, scoreboard view (`dir: 1`) for the judges and the audience. Curtains open; the stage hoop stays winched up until Housam's act |
| **Sound** | Voices from `dialogue`; a clap-along talent-show groove; `applause` after every act and a `drumroll` before every score (both new cue types in `studio/music.js`); a ding per score card, a record scratch on Pearl's 3, whooshes on the cartwheels, a winch scratch when the hoop comes down, a bonk and a ding for the bicycle kick |
| **Timing** | `asset.js` lays the script out on one timeline (`say()` / `beat()`) and exports every start time as `beats`; `scene.js` reads them, so editing a line moves everything after it |

## Blocking (world units, gym coordinates)

| Who / what | Where |
|---|---|
| Dancers, Alma, Jenna | on stage, Y 100, Z 200. Dancers at X −300…300; Alma cartwheels X 300 → −150; Jenna X 330 → −270, one back to −120, then the aerial |
| Housam, Danny | on the court, Z 820. Housam bicycle-kicks from X 130 into the stage hoop (rim (0, 280, 545)) |
| Judges' table (`props.js`) | X ±340, Z 1180–1240, 62 high, facing the stage. Dragon X −215, Fester X 0, Pearl X 215 (on a cushion, Y 46), all at Z 1262 |
| Audience chairs | rows at Z 1480 / 1600 / 1720, X ±120…600 (centre aisle). Safadi (480) and Sami (600) in the second row, clear of Pearl's tall chair in the wide shot; the front-row chairs in front of them are left out so their shot is clear |

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *Five students dance on stage: arm waves, step-claps, a jumping wave, disco points, a spin. Finale pose.* |
| 10.0 | — | *The parents applaud; the Safadi brothers clap in the second row.* |
| 13.2 | — | *Drumroll. The judges raise their score cards.* |
| 14.2 | DRAGON | **"Wonderful! I give it a *9*!"** |
| 16.7 | FESTER | **"Nice moves… *7*."** |
| 18.8 | PEARL | **"*3.*"** |
| 20.5 | PEARL | **"Somebody blinked off the beat. I *saw* it."** |
| 23.8 | DANCERS | **"Awwww…"** |
| 25.7 | FESTER | **"And now… the *individual* talents!"** |
| 28.8 | FESTER | **"First up… *ALMA!*"** |
| 31.0 | — | *Alma skips on stage.* |
| 33.0 | ALMA | **"Hi! I'm *Alma*! I love dancing, drawing…"** |
| 36.5 | ALMA | **"…and *falling over*."** |
| 39.1 | ALMA | **"But today, I am *skipping* the falling-over part!"** |
| 42.8 | SAFADI | *(standing, hands cupped)* **"Go Alma! Make us *proud*!"** |
| 45.3 | — | *Alma: three cartwheels in a row, then TA-DA!* |
| 50.9 | — | *Applause.* |
| 53.7 | — | *Drumroll.* |
| 54.6 | DRAGON | **"Ooh! A perfect *10*!"** |
| 56.7 | FESTER | **"Lovely! *9*!"** |
| 58.4 | PEARL | **"Hmm. Not bad. *8*."** |
| 60.7 | FESTER | **"Next up… *JENNA!*"** |
| 62.9 | — | *Jenna skips on stage.* |
| 65.0 | JENNA | **"Hi, I'm *Jenna*! I've done so many cartwheels…"** |
| 68.8 | JENNA | *(points up, then down, wobbling)* **"…my brain thinks the *ceiling* is the *floor*!"** |
| 72.6 | SAMI | *(standing)* **"Go Jenna! Make us *proud*!"** |
| 75.2 | — | *Jenna: four cartwheels, one back, then an aerial twirl. WOW! TA-DA!* |
| 82.6 | — | *Applause.* |
| 85.4 | — | *Drumroll.* |
| 86.3 | DRAGON | **"WOW! *10*!"** |
| 87.9 | FESTER | **"Amazing! *9*!"** |
| 89.7 | PEARL | *(sparkly eyes)* **"Ooh! Now *that* was elegant. *9*!"** |
| 92.6 | FESTER | **"Next up… *HOUSAM!*"** |
| 94.9 | — | *The stage hoop winches down. Housam dribbles onto the court.* |
| 97.5 | HOUSAM | **"Hey! I'm *Housam*. I'm a *soccer* player…"** |
| 100.9 | HOUSAM | *(holding up the ball; a "?" pops over it)* **"…in a *basketball* gym. This ball is *so* confused."** |
| 104.9 | SAFADI | *(standing)* **"Go Housam! Make us *proud*!"** |
| 107.5 | — | *Housam: zig-zag dribbles, flicks the ball up, a BICYCLE KICK… SWISH! into the stage hoop.* |
| 115.1 | — | *Applause; gasps.* |
| 117.9 | — | *Drumroll.* |
| 118.8 | DRAGON | *(fluttering up off the floor)* **"*10*! Right in the hoop!"** |
| 121.1 | FESTER | **"*10*! Even *I* can't do that!"** |
| 123.6 | PEARL | **"Bravo! *9*!"** |
| 125.3 | FESTER | **"And last but not least… *DANNY!*"** |
| 128.3 | — | *Danny dribbles in, Rubik's cube held high, and traps the ball under his foot.* |
| 131.3 | DANNY | **"Hi! I'm *Danny*! I can dribble, I can solve a *Rubik's cube*…"** |
| 135.5 | DANNY | **"…and I can drink *broccoli juice* without crying."** |
| 139.2 | DANNY | *(shudders)* **"…Almost."** |
| 141.4 | — | *In the audience, Doctor Sami's face falls. Sweat.* |
| 142.6 | SAMI | **"Brother… maybe we should *not* have given him *broccoli juice*…"** |
| 147.3 | SAMI | **"…and insisted he *practiced* instead!"** |
| 150.7 | SAMI | **"I'm *so* afraid Danny won't do well in the competition!"** |
| 154.8 | SAFADI | *(a hand toward his brother)* **"Don't worry, brother. Danny is *smart*."** |
| 158.2 | SAFADI | **"I'm sure he will make us *proud*."** |
| 161.5 | SAMI | **"I hope so…"** *(gulp)* |
| 164.0 | — | *Back on the court: Danny, foot on the ball, cube in hand, ready. Freeze. TO BE CONTINUED… Iris out.* |

## Shot list

| Shot | Camera (`scene.js`) | Used for |
|---|---|---|
| `opening` / `danceMed` | `STAGEW` → `DANCEM` | the group dance (with a THE TALENT SHOW tag) |
| `audWide` | `AUDW` (dir 1) | every round of applause: the judges in front, all the parents behind |
| `judges` | `JUDGES` (dir 1, crowd blurred) | the drumroll and the three score cards, left to right |
| `individual` / `fester` | `FESTER` (dir 1) | Fester announces each act (an INDIVIDUAL TALENTS tag on the first) |
| `stageWide` | `STAGEW` | entrances, the dancers' *awww* |
| `intro(who)` | `INTRO` | Alma's and Jenna's introductions, in a spotlight |
| `actShot` | `DANCEM` | the cartwheels |
| `court` / `courtMed` | `COURT` / `COURTM` | Housam and Danny: entrances, intros, the bicycle kick |
| `bros` | `BROSC` (dir 1) | *"Go …, make us proud!"* and the closing exchange |
| `ending` | `ENDC` | Danny, ready; freeze; to be continued |

## Notes

- Score cards are `cbScoreCard` paddles: Fester holds his in his right hand, Dragon in a paw, Pearl in her flipper (`point: 1`). The number's colour shows the score (red 3, orange 7, teal 8–9, gold with sparkles for 10).
- The parents are `student` rigs (seeded, backpacks off, 1.3× tall) on folding chairs; they clap during each `clap` window with staggered phases.
- Rotating moves (cartwheels, the aerial, the bicycle kick) spin the whole rig about its middle, as in scene 23.
- Danny's performance is the next scene.
