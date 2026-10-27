# Scene 25: The Cube Drops

> Danny's turn at the DCES talent show. Alma, Jenna and Housam cheer from the sideline: *"Danny! Make us proud!"* **Part 1:** he tosses his Rubik's cube up and catches it: **10, 5… 0** (*"What is that? Everyone can catch it!"*). **Part 2:** close on the scrambled cube, and he solves it in seconds: **10, 10, 5** (Fester: *"I can juggle, but I can't solve puzzles!"*; Pearl: *"Solving a puzzle is not enough!"*). **Part 3:** he scrambles it again, throws it high, and solves it on the catch. *"A juggle and a puzzle!"* *"A… puggle?"* Everyone laughs. Pearl: *"This puggle is perfect!"* **10, 10, 10.** Golden trophies for all four kids. On stage, the Safadi brothers are proud; Danny confesses he knew the secret potion was a joke (*"I did not imagine it would be broccoli, though!"*) and practiced his cube instead. *"Danny, yours was a mic drop moment."* *"A mic drop? I thought he dropped the cube?"* *"What is a mic drop?"* *"Let me explain!"* *To be continued…*

*After [24 The Competition Begins](../scene24_competition_begins/README.md).*

| | |
|---|---|
| **Length** | 132 s · 24 fps |
| **Cast** | [Danny](../../../characters/danny/README.md) · [Alma](../../../characters/alma/README.md) · [Jenna](../../../characters/jenna/README.md) · [Housam](../../../characters/housam/README.md) · [Dragon](../../../characters/dragon/README.md) · [Jester Fester](../../../characters/jester_fester/README.md) · [Princess Pearl](../../../characters/princess_pearl/README.md) · [Professor Safadi](../../../characters/safadi/README.md) · [Dr. Sami](../../../characters/sami/README.md) · [Students](../../../characters/student/README.md) (the parents) |
| **Location** | [School gym](../../../locations/school_gym/README.md): stage view (`dir: -1`) for the court, the trophies and the talk on stage; scoreboard view (`dir: 1`) for the judges and the audience |
| **Props** | `props.js` (`cd…`): the close-up cube that scrambles and solves, Danny's hands for the close-ups, the golden trophies. The judges' table, chairs, banner, score cards and title tags are **scene 24's** (`cb…`, from its `props.js`), so scene 24 must stay registered |
| **Timing** | `asset.js` lays the script out with `say()` / `beat()` and exports `beats`; `scene.js` reads them |

## Blocking (world units, gym coordinates)

| Who | Where |
|---|---|
| Danny | on the court, X 0, Z 820, foot on his soccer ball |
| Alma, Jenna, Housam | the sideline, X −470 / −370 / −270, Z 780 (screen-right of Danny: the stage view mirrors X) |
| Judges, parents | as in scene 24; the brothers sit in the second row until the trophies |
| Trophy line-up | on stage (Y 100, Z 200): Alma −270, Jenna −110, Housam 70, Danny 230 |
| The talk | on stage: Safadi −380, Alma −240, Jenna −120, Housam 10, Danny 150, Sami 300 |

## Script

| Time | Who | Line / action |
|---|---|---|
| 1.0 | ALMA, JENNA, HOUSAM | **"Danny! Make us *proud*!"** |
| 3.6 | DANNY | **"Everyone! Look at my *Rubik's cube*!"** |
| 6.6 | — | *He tosses the cube up… and catches it. CATCH!* |
| 9.2 | — | *Polite applause. Drumroll.* |
| 11.9 | DRAGON | **"Ooh! What a catch! *10*!"** |
| 14.3 | FESTER | **"Hmm… *5*."** |
| 16.1 | PEARL | **"*Zero.*"** *(record scratch)* |
| 18.1 | PEARL | **"What is that? *Everyone* can catch it!"** |
| 21.4 | DANNY | **"I'm not done yet!"** … **"*Part 2!*"** … **"Everyone… look at my *Rubik's cube*."** |
| 28.5 | — | *Close-up: the cube, SCRAMBLED!* |
| 30.5 | — | *Click-click-click: solved in 3.4 s (a stopwatch tag counts). SOLVED!* |
| 34.7 | — | *Everybody cheers; the kids jump on the sideline.* |
| 38.6 | DRAGON | **"WOW! *10*!"** |
| 40.2 | FESTER | *(a hand on his head)* **"*10*! I can *juggle*, but I can't solve *puzzles*!"** |
| 43.9 | PEARL | **"Hmm. *5*."** … **"Solving a puzzle is *not enough*!"** |
| 48.6 | DANNY | **"I'm not done yet!"** … **"*Part 3!*"** |
| 52.4 | — | *Close-up: he scrambles it again.* |
| 55.4 | — | *A high, spinning throw; a blur of hands on the catch (TWIST! TWIST!)* |
| 59.0 | — | *Close-up, pushing in: the solved cube, sparkling. SOLVED!* |
| 61.4 | — | *Big applause. Drumroll.* |
| 65.3 | DRAGON | **"AMAZING! *10*!"** |
| 67.2 | FESTER | **"*10*! A *juggle* and a *puzzle*!"** |
| 69.9 | DRAGON | **"A… *puggle*?"** |
| 72.1 | — | *Everyone laughs: judges, parents, the brothers. HA HA HA!* |
| 74.7 | PEARL | *(sparkly eyes)* **"This puggle is *perfect*! *10*!"** |
| 77.5 | — | *THE TROPHIES: on stage, one golden trophy each. Alma and Jenna: a jumping rope on top; Housam: a soccer ball; Danny: a Rubik's cube.* |
| 83.9 | SAFADI | **"I'm *so* proud of you, children. You *practiced*, and you *earned* it."** |
| 90.2 | SAMI | **"Danny, I was *so* afraid you wouldn't perform well. You didn't *practice*!"** |
| 96.6 | DANNY | **"I *did*! I knew the secret potion was a *joke*!"** |
| 100.2 | DANNY | *(shudders)* **"I did not imagine it would be *broccoli*, though!"** |
| 104.3 | DANNY | *(trophy up)* **"But I took it as a chance to hone my *Rubik's cube* skills!"** |
| 108.6 | SAFADI | **"You see? With *practice*, you grow your *skill*."** |
| 112.5 | SAFADI | *(wink)* **"But Danny… yours was a *mic drop* moment!"** |
| 116.1 | ALMA | **"A mic drop? I thought he dropped the *cube*?"** |
| 119.9 | SAMI | *(laughs)* **HA HA!** |
| 121.5 | JENNA | **"What is a *mic drop*?"** |
| 123.9 | SAFADI | *(eyes glowing, super-explain powers on)* **"Let me *explain*!"** |
| 126.6 | — | *Freeze. TO BE CONTINUED… Iris out.* |

## Shot list

| Shot | Camera | Used for |
|---|---|---|
| `kids` | `KIDS` | the sideline cheer (THE CUBE DROPS tag), and the kids cheering after the solve |
| `courtMed` / `court` | `COURTM` / `COURT` | Danny's intros and Part 1; the wide for Part 3's high throw |
| `closeup` | an insert over the out-of-focus gym | the scrambled cube, the solve (stopwatch), the rescramble, the solved cube |
| `audWide` / `judges` | `AUDW` / `JUDGES` (dir 1) | applause, the laugh; the drumrolls and score cards |
| `trophies` / `podium` | `STAGEW` / `PODM` | the trophies (THE TROPHIES tag) |
| `talkW` / `samM` / `safM` | `TALKW` / `SAMM` / `SAFM` | the talk on stage: everyone; Danny with Sami; Safadi with Alma and Jenna |
| `ending` | `ENDC` (push in on `SAFM`) | "Let me explain!"; freeze; to be continued |

## Notes

- *"Dr. Safadi laughs"* in the outline is played as **Dr. Sami** (Professor Safadi is the one about to explain).
- The cube's state is one function, `cubeState(t)`: how solved it is, which row is turning and how far. The court shots and the close-ups both read it, so they always agree.
- The stage view mirrors world X on screen, so `lookX` signs and bubble sides in stage-view shots are flipped relative to world positions.
- Next: Safadi explains what a mic drop is.
