# Scene 09: Housam's Hat Trick

> At the county soccer field, Jester Fester declares himself goalkeeper. Housam scores three trick goals past him (a keepie-uppie volley, a rainbow flick into a chip, and a flying spin volley he works out to *27 degrees*) while Safadi and Alma cheer from the stands. The third goal knocks Fester's hat into the net: a real hat trick.

| | |
|---|---|
| **Length** | 64 s · 24 fps · 1536 frames |
| **Cast** | [Housam](../../characters/housam/README.md) (the tricks, speaks) · [Jester Fester](../../characters/jester_fester/README.md) (goalkeeper, speaks) · [Professor Safadi](../../characters/safadi/README.md) and [Alma](../../characters/alma/README.md) (cheering, speak) |
| **Location** | [County soccer field](../../locations/soccer_field/README.md): the south goal. Housam on the penalty spot (0, 0, 1100); Fester on the goal line (0, 0, 60); Safadi (−3690, 0, 1940) and Alma (−3880, 0, 1860) on the apron in front of the bleachers |
| **Sound** | Voices from the `dialogue` in `asset.js`; an upbeat, sporty score with whooshes on the kicks, dings on the goals, a bonk when the ball clips the hat, and a plip for the ball landing on the hat |
| **Movie** | #9 |

## Synopsis

A crane shot drops from above the parking lot, over the south fence, to look through the empty net at Housam juggling on the penalty spot. Fester cartwheels into the goal in oversized green goalkeeper gloves: *"Never fear… Keeper Fester is here!"* In the stands, Alma and Safadi cheer Housam on.

**Goal 1, keepie-uppie volley.** *"Ready, Fester?"* *"Nothing gets past me!"* Housam juggles foot, knee, head, then volleys. Fester dives the wrong way; the ball tucks into the top corner. From the grass: *"I let you have that one!"* Alma: *"GOOOAL!"*

**Goal 2, rainbow flick and chip.** *"Try this… a rainbow flick!"* The ball rolls up the back of his leg, over his head and down in front of him. He dribbles in and chips it softly. Fester has already hurled himself to one side; the ball floats past his feet and rolls gently into the net. *"Wait… where did it go?"* Safadi: *"A chip shot! Pure genius!"*

**Goal 3, the math volley.** Housam narrows his eyes and sees the geometry: a dashed trajectory and an angle, *θ = 27°*. *"Top corner… 27 degrees."* He flicks the ball up and meets it with a flying spin volley. Fester jumps straight up, and the ball whips over his head, clips his hat off and carries it into the top corner. Fester, suddenly bald on top, stumbles back into the net and gets tangled. The scoreboard flips to HOUSAM 3 – FESTER 0. Safadi: *"Three goals… that's a hat trick!"* Alma: *"Fester lost his hat!"*

**Finale.** Housam walks over with the hat and the ball: *"Good game, Keeper Fester!"* He puts the hat back on Fester's head. Fester, still draped in net, shrugs: *"…and this is the story of my life."* Housam flips the ball up; it lands and balances on Fester's hat. Everybody grins. Iris out.

**Theme:** skill is practice plus thinking; Housam sees the angles. And Fester, as always, is good-natured about losing.

## Script

Timings come from `asset.js` → `dialogue`.

| Time | Who | Line / action |
|---|---|---|
| 0–5 | | crane down over the fence; Housam juggles in the box, the goal is empty |
| 5.3–6.9 | Fester | cartwheels in from screen-left, lands in goal: ta-da, big gloves |
| 7.2 | Fester | "Never fear… *Keeper Fester* is here!" |
| 9.9 | Fester | claps his gloves, drops into a wobbly ready crouch |
| 11.5 | Alma | "Go, Housam, go!" |
| 13.4 | Safadi | "Show us some *magic*!" |
| 16.2 | Housam | "Ready, Fester?" |
| 17.8 | Fester (off-screen) | "Nothing gets past *me*!" |
| 18.2–21.3 | Housam | keepie-uppie: foot, knee, foot, head, knee… volley at 21.3 |
| 21.5–22.3 | Fester | dives the wrong way; GOAL at 21.9 (top corner) |
| 23.4 | Fester | "I *let* you have that one!" |
| 26.1 | Alma | "GOOOAL!" (the crowd cheers) |
| 28.8 | Housam | "Try this… a *rainbow flick*!" |
| 31.0–31.9 | Housam | the rainbow flick; dribbles in; chips at 33.3 |
| 33.5 | Fester | dives far too early; the ball floats past and rolls in at ~35 |
| 35.7 | Fester | "Wait… where did it *go*?" |
| 38.6 | Safadi | "A *chip shot*! Pure genius!" |
| 42.2–45.2 | Housam | math vision: dashed trajectory, *θ = 27°* |
| 42.6 | Housam | "Top corner… *27 degrees*." |
| 45.3 / 46.2 | Housam | flicks it up · flying spin volley |
| 46.6 | | BONK: the ball clips the hat off; ball and hat into the top corner at 47.0 |
| 47.3–49.2 | Fester | pats his bald crown, "!", stumbles back into the net, tangled |
| 51.8 | | scoreboard: HOUSAM 3 – FESTER 0 |
| 52.9 | Safadi | "Three goals… that's a *hat trick*!" |
| 55.6 | Alma | "Fester lost his *hat*!" |
| 58.0 | Housam | "Good game, Keeper Fester!" (puts the hat back on) |
| 60.0 | Fester | "…and this is the story of my life." |
| 61.7 | | the ball lands on the hat and balances: plip! |
| 63–64 | | iris out |

## Shot list

The rigs always face the camera, so the action is cut as shot / reverse shot along the pitch: **Housam** is filmed from the keeper's side (`dir: 1`, telephoto), **Fester** from the shooter's side (`dir: -1`, with Housam behind the camera). The ball's flight is one world-space path, so it leaves one shot and arrives in the next.

| # | Time | Shot fn | Camera | What |
|---|---|---|---|---|
| 1 | 0–5 | `opening` | crane: aerial behind the south goal → through the net | establishing; Housam juggles, the goal is empty |
| 2 | 5–11.2 | `keeperIntro` | reverse on the goal (`dir: -1`), medium-wide | Fester cartwheels in; "Keeper Fester!"; ready crouch |
| 3 | 11.2–16 | `stands` | along the bleachers | Alma and Safadi cheer |
| 4 | 16–21.4 | `trick1` | keeper's POV, telephoto | "Ready?"; keepie-uppie; volley |
| 5 | 21.4–26 | `goal1` | reverse on the goal | wrong-way dive; GOAL; "I let you have that one" |
| 6 | 26–28.6 | `stands` | along the bleachers | "GOOOAL!" |
| 7 | 28.6–33.4 | `trick2` | keeper's POV | rainbow flick; dribble in; chip |
| 8 | 33.4–38.4 | `goal2` | reverse on the goal | early dive; the slow chip rolls in; "where did it go?" |
| 9 | 38.4–42 | `stands` | along the bleachers | "Pure genius!"; Alma dances |
| 10 | 42–46.3 | `trick3` | keeper's POV, pushing in | math vision; flying spin volley |
| 11 | 46.3–51.4 | `goal3` | reverse on the goal, shake on the hit | the hat flies; bald Fester; tangled in the net |
| 12 | 51.4–52.8 | `board` | scoreboard close-up | 2 → 3 |
| 13 | 52.8–57.3 | `stands` | along the bleachers | "hat trick!"; "lost his hat!" |
| 14 | 57.3–64 | `finale` | reverse on the goal, two-shot | the hat goes back on; the catchphrase; the ball lands on the hat; iris |

## Notes for editing

- **Goals, dives and flights** are data at the top of `scene.js`: `K1`–`K3` (kick times), `FLIGHTS` (world paths), and the dive helpers. Change a kick time and the flight and the reverse-shot cut follow it.
- **Score:** `scoreAt(t)` drives the scoreboard in every shot (it is visible, far off, behind the stands).
- **Crowd:** `crowd` is .55; `cheerAt(t)` spikes after each goal.
- **Fester's hat** comes off through the rig's `noHat` option and the `jesterHat()` prop (added for this scene).
