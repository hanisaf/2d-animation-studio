# Scene 19: If, Else, Explain!

> In the science room, Housam and Danny program Robo-Safadi. Housam explains the **conditional statement** and types an if/else for trick or treat. Danny finds it boring and predictable, so Housam brings in a **large language model**: Clawd pops out of the laptop. They give him a **prompt** (*"Do something interesting and surprising!"*), spice it up (*"Robot goes haywire!"*), and wire it to a third branch triggered by Professor Safadi's favorite word: **"EXPLAIN!"** *To be continued…*

| | |
|---|---|
| **Length** | 110 s · 24 fps · 2640 frames |
| **Cast** | [Housam](../../characters/housam/README.md) (the expert programmer) · [Danny](../../characters/danny/README.md) · [Clawd](../../characters/clawd/README.md) (the LLM, a hologram from the laptop) · [Robo-Safadi](../../characters/robo_safadi/README.md) (powered, unprogrammed) |
| **Location** | [Science room](../../locations/science_room/README.md), teacher view, front bench row cleared (`rows: 2`) as in scene 18 |
| **Sound** | Voices from `dialogue`; a clicky coding groove: dings on each branch, thinking ticks, a sparkly pop for Clawd, random boops for the unpredictable output, a glitchy scratch on "haywire", a big hit on "EXPLAIN!" |
| **Movie** | #19, the follow-up to [18 Some Assembly Required](../scene18_some_assembly/README.md) |

## Synopsis

**The conditional.** The next afternoon. Housam types at a laptop on an AV cart, cabled to Robo-Safadi (powered now, calm cyan eyes, nothing in his head yet). *"So… how are we going to program the trick or treat?"* *"With a conditional statement!"* The laptop projects a hologram over the cart: a condition (*trick?*) and two branches, yes → broccoli, no → candy. *"It creates a branch… based on whether a condition is true. Like… if someone presses the trick button… or the treat button!"* Danny: *"This is awesome, Housam! You're as brainy as Professor Safadi! I wonder why…?"* (a wink at us). They chuckle.

**The if/else.** Insert: the laptop screen. Housam types `if trick: give(broccoli) else: give(candy)`. *"I think this will do."*

**The large language model.** Danny slumps: *"But this is boring… the robot is repetitive and predictable. We want it more fun… more interesting! But how?"* Housam thinks hard (three thought bubbles…) *"We can use a… large language model!"* POP: **Clawd** jumps out of the laptop as a hologram and waves. *"What is that?"* *"An artificial intelligence model… that can create unpredictable output!"* Clawd flings out a dice, a star, a rubber duck, a heart, a note, a question mark, a fish, a rainbow…

**The prompt.** *"How are we going to program it?"* *"We give it a beginning… called a prompt. Then it follows the prompt. What do you want to say?"* (Hologram: PROMPT → LLM → ???.) Insert: Danny dictates, the prompt box fills: *"Do something interesting and surprising!"* Clawd reads it and smiles. *"Hmm… this would work."* The boys look at each other: *"Let's spice it up!"* heh heh heh… Insert: *"Robot goes haywire!"* goes on the end in red. BZZT: Clawd's eyes swirl, then narrow with mischief.

**The trigger.** *"We need another branch to activate the large language model. What would be the trigger?"* The hologram shows three branches: trick?, treat?, ???. Danny thinks: *"Well… this is Robo-Safadi… so we use Professor Safadi's favorite word!"* Together: **"EXPLAIN!"** The ??? lights up EXPLAIN!

**The logic.** Insert: Housam turns `else:` into `elif treat:` and adds `elif explain: llm("Robot goes haywire!")`. Clawd's eyes turn to stars. *"And… done!"* The boys laugh. Behind them, unnoticed, Robo-Safadi's eyes flicker **red** for a moment (bzzt). Freeze. **TO BE CONTINUED…**

**Theme:** a program is a set of branches, and an LLM is a branch you can't predict; what it does depends on the prompt you give it. (So be careful what you prompt.)

## Script

Timings come from `asset.js` → `dialogue` (lines) and the constants at the top of `scene.js` (actions).

| Time | Who | Line / action |
|---|---|---|
| 0.0–2.4 | — | *Across the room to the two-shot: Housam typing at the laptop on the AV cart; Danny beside him; the cable runs to Robo-Safadi.* |
| 2.4 | DANNY | **"So… how are we going to program the *trick or treat*?"** |
| 5.8 | HOUSAM | *(finger up)* **"With a *conditional statement*!"** *The laptop projects a hologram: IF … ELSE.* |
| 8.4 | HOUSAM | **"It creates a *branch*… based on whether a *condition* is true."** *A diamond, trick?, and two arrows: yes / no.* |
| 12.4 | HOUSAM | **"Like… *if* someone presses the *trick* button…"** *The yes branch lights: broccoli.* |
| 15.4 | HOUSAM | **"…*or* the *treat* button!"** *The no branch lights: candy.* |
| 17.9 | DANNY | **"This is *awesome*, Housam! You're as brainy as *Professor Safadi*!"** |
| 21.8 | DANNY | *(hand on chin, to us, a wink)* **"I wonder *why*…?"** |
| 23.8 | BOTH | **"Heh heh heh!"** |
| 26.2–29.8 | — | *Insert, the laptop screen: Housam types the if/else.* |
| 30.0 | HOUSAM | **"I think this will *do*."** |
| 32.6 | DANNY | *(slumping)* **"But this is *boring*… the robot is *repetitive* and *predictable*."** |
| 36.6 | DANNY | **"We want it more *fun*… more *interesting*! But *how*?"** |
| 39.8–42.3 | — | *Housam thinks hard: hand on chin, eyes squeezed, three thought bubbles… "!"* |
| 42.4 | HOUSAM | **"We can use a… *large language model*!"** *POP: Clawd jumps out of the laptop as a hologram and waves.* |
| 45.4 | DANNY | *(pointing at Clawd)* **"A *large language model*! What is *that*?"** |
| 48.2 | HOUSAM | **"It's an *artificial intelligence* model…"** |
| 51.2 | HOUSAM | **"…that can create *unpredictable* output!"** *Clawd flings out a dice, a star, a duck, a heart, a note, a ?, a fish, a rainbow…* |
| 55.6 | DANNY | **"Cool! How are we going to *program* it?"** |
| 58.4 | HOUSAM | **"We give it a beginning… called a *prompt*."** *Hologram: PROMPT →* |
| 61.6 | HOUSAM | **"Then it *follows* the prompt. What do you want to say?"** *→ LLM (Clawd) → ???* |
| 65.4 | DANNY | *(insert: the prompt box fills as he speaks)* **"How about… *Do something interesting and surprising!*"** *Clawd reads it, then smiles.* |
| 69.6 | HOUSAM | *(hand on chin)* **"Hmm… this would *work*."** |
| 72.8 | BOTH | *(a sly look at each other)* **"Let's *spice it up*!"** |
| 74.8 | BOTH | *(whispered)* **"heh heh heh…"** |
| 77.2 | BOTH | *(insert: typed on in red)* **"*Robot goes haywire!*"** *BZZT: Clawd's eyes swirl, then narrow with mischief.* |
| 80.8 | HOUSAM | **"We need another *branch* to activate the large language model."** *Hologram: trick?, treat?, ???* |
| 84.6 | HOUSAM | *(palms up)* **"What would be the *trigger*?"** |
| 87.6 | DANNY | *(thinking)* **"Well… this is *Robo-Safadi*…"** |
| 90.2 | DANNY | *(finger up)* **"…so we use Professor Safadi's *favorite word*!"** |
| 93.4 | BOTH | *(fists up)* **"EXPLAIN!"** *??? lights up EXPLAIN!* |
| 95.2–99.2 | — | *Insert: else: → elif treat:; then elif explain: llm("Robot goes haywire!"). The line glows; Clawd's eyes turn to stars.* |
| 99.6 | HOUSAM | **"And… *done*!"** |
| 101.2 | BOTH | **"HA HA HA HA!"** |
| 102.6 | — | *Behind them, Robo-Safadi's eyes flicker red (bzzt). Nobody notices.* |
| 104.0–110 | — | *Freeze. Card: **TO BE CONTINUED…**; iris out.* |

## Shot list

| Time | Shot (`scene.js`) | Camera | What happens |
|---|---|---|---|
| 0.0–5.6 | `opening` | across the room, dolly in to `TWO` | "How are we going to program the trick or treat?" |
| 5.6–17.7 | `two` | `TWO`: the boys, the cart, the robot; the hologram above | the conditional, explained on the hologram |
| 17.7–23.6 | `dannyMS` | `DANNY_MS` | "as brainy as Professor Safadi… I wonder why?" |
| 23.6–26.2 | `two` | `TWO` | chuckles |
| 26.2–32.4 | `insert1` | the laptop screen | the if/else typed; "I think this will do." |
| 32.4–39.7 | `dannyMS` | `DANNY_MS` | "boring… predictable… but how?" |
| 39.7–42.3 | `housamCU` | `HOUSAM_CU` | Housam thinks hard |
| 42.3–45.2 | `two` | `TWO` | "large language model!"; Clawd pops out |
| 45.2–48.0 | `dannyMS` | `DANNY_MS` | "What is that?" |
| 48.0–55.4 | `clawdShot` | `CLAWD_SHOT`: Housam and Clawd | AI model; unpredictable output (the flying things) |
| 55.4–58.2 | `dannyMS` | `DANNY_MS` | "How are we going to program it?" |
| 58.2–65.2 | `two` | `TWO` | the prompt, on the hologram |
| 65.2–69.4 | `insert2` | the laptop screen, the LLM panel | the prompt typed; Clawd reads it |
| 69.4–72.6 | `housamCU` | `HOUSAM_CU` | "Hmm… this would work." |
| 72.6–77.0 | `both` | `BOTH` | "Let's spice it up!"; heh heh heh |
| 77.0–80.6 | `insert2` | the laptop screen | "Robot goes haywire!"; Clawd glitches |
| 80.6–87.4 | `two` | `TWO` | another branch; "What would be the trigger?" |
| 87.4–93.2 | `dannyMS` | `DANNY_MS` | "Professor Safadi's favorite word!" |
| 93.2–95.2 | `both` | `BOTH` | "EXPLAIN!" |
| 95.2–101.0 | `insert3` | the laptop screen | the final logic; "And… done!" |
| 101.0–110 | `tbc` | `TWO`, frozen at 104.0 | the laugh; the red flicker; TO BE CONTINUED… |

## Notes for editing (`scene.js`)

- **Blocking** (`POS`, `LAPTOP`, `CLAWD_AT`): Danny (−110, 960), Housam (40, 985) behind the AV cart (60, 940, top Y 64), the laptop on the cart at (40, 940), Clawd standing on the cart at (112, 64, 935), Robo-Safadi (240, 990). The cable runs from the laptop to the robot (`ieCable`).
- **Typing hands:** `stage()` measures the laptop's keyboard point first, and Housam's `type()` helper turns it into his local hand targets, so his hands land on the keys from any camera.
- **The hologram** (`HOLO_IF`, `HOLO_PROMPT`, `HOLO_BRANCH`) floats above the cart on the plane Z 1000, centred at (−20, 270), 300 × 140, with a light cone from the laptop. Each page (`holoIf`, `holoPrompt`, `holoBranch`) builds itself in time with the dialogue.
- **The code** is `CODE1` (the if/else) and `CODE2` (the final logic); `insert3` animates `else:` being retyped as `elif treat:`, then types the explain branch. The prompt is `PROMPT_A` + `PROMPT_B` (the red part). The editor and the LLM panel are drawn by `ieEditor` in `props.js`.
- **Clawd's acting** is `clawdPose(t)`: a hovering hologram (`holo: 1`) that waves, flings (`OUTPUT`), reads, schemes (`SPICE`), and sparks on "EXPLAIN!". In the inserts he's drawn big in the LLM panel with his own poses.
- **The tag:** `FLICKER` makes the robot's eyes flick red (`red`, `glitch`) for 0.7 s during the laugh; `FREEZE` stops time for the card.

## Pieces (built)

| Piece | Where | How to use it |
|---|---|---|
| Clawd | [`characters/clawd`](../../characters/clawd/README.md) | the LLM: `clawd(x, y, s, { holo, eyes, mouth, aL, aR, … })` |
| AV cart, laptop, cable | [`props.js`](props.js) | `ieCart(P, X, Z, t)`, `ieLaptop(P, X, Z, t, glow)` (returns the keyboard's screen point), `ieCable(P, from, to)` |
| Hologram panel | [`props.js`](props.js) | `ieHolo(P, Z, cx, cy, w, h, k, fn)`, `ieHoloText(txt, x, y, size)` |
| Code editor insert | [`props.js`](props.js) | `ieEditor(t, { code, chars, hl, panel: 'status' \| 'llm', prompt, promptRed, clawd })`: Python syntax colours, typing cursor, a status or LLM side panel |
| Unpredictable output | [`props.js`](props.js) | `ieItem(kind, x, y, r, rot)`: dice, star, duck, heart, fish, rainbow, or any glyph ('♪', '?') |
| Marker lettering, room whiteboard | scene 18's [`props.js`](../scene18_some_assembly/props.js) (`saMarker`), the set's `board(t)` | the girls' project notes on the wall, now "step 2: SOFTWARE" |
