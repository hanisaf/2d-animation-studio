# Scene 01: Juggling in the throne room

> *"I'm Jester Fester… and this is the story of my life!"* He juggles, flings the balls into the chandelier, and they come back down on his head.

| | |
|---|---|
| **Length** | 30 s · 24 fps · 720 frames |
| **Cast** | [Jester Fester](../../characters/jester_fester/README.md) |
| **Location** | [Throne room](../../locations/throne_room/README.md), on the stage mark (0, 0, 1200) |
| **Audio** | `audio.mp3` in this folder (optional; none yet) · tempo grid 100 BPM |
| **Movie** | #1 |

## Synopsis

The empty throne room glows in the morning light. Jester Fester tumbles out from behind a column, somersaults down the carpet and lands in a proud ta-da. With a pop, three balls fly out of his hat and he starts to juggle, introducing himself to the audience. He tosses the balls sky-high, pulls two more from his hat and juggles five, grandly announcing that this is the story of his life.

To finish, he flings all five balls up and strikes a pose… but they lodge in the chandelier. He waits. He looks up. One by one they drop onto his head: BONK, BONK, BONK, BONK. Dizzy, he recovers, straightens his hat and gives the camera a sheepish shrug. The last ball finally drops and lands perfectly balanced on his hat. Wink, thumbs up, iris-out.

**Theme:** Fester's life in one routine: talent, pride, a fall, and a grin anyway.

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *The empty throne room. Light shafts, dust motes, swaying chandeliers.* |
| 2.4 | FESTER | *(tumbles out from behind a column, two somersaults, lands)* Ta-da! *(sparkles, bells jingle)* |
| 5.5 | — | **POP!** *Three balls shoot out of his hat into his hands.* |
| 8.2 | FESTER | (callout) **"I'm Jester Fester…"** *(juggling three balls; winks at us)* |
| 13.0 | — | **WHOOSH!** *He flings them up out of frame.* **POP!** *Two more from the hat.* |
| 14.45 | FESTER | (callout) **"…and this is the story of my life!"** *(juggling five; winks)* |
| 20.5 | — | *He flings all five high and holds his ta-da.* **DING!** *They lodge in the chandelier.* |
| 22.8 | FESTER | *(opens his eyes, looks up)* **?** |
| 23.35 | — | **BONK! BONK! BONK! BONK!** |
| 24.4 | FESTER | *(dizzy: swirl eyes, stars circling)* |
| 26.4 | FESTER | *(shakes it off, fixes his hat, shrugs at the camera: story of my life)* |
| 28.75 | — | *plip!* *The last ball lands balanced on his hat.* |
| 29.1 | FESTER | *(grin, wink, thumbs up)* |
| 29.3 | — | *Iris-out.* |

## Shot list

| Time | Shot (`scene.js`) | Camera | What happens | Out |
|---|---|---|---|---|
| 0.0–7.5 | `entrance` | `camA`: wide, slow push down the carpet (continuous with the next shot) | Empty hall; Fester hops out from behind the left column, two somersaults, lands on the mark, ta-da, then the hat POPs out three balls into his hands | Juggling starts on an anticipation crouch |
| 7.5–14.0 | `juggle3` | `camA` continues into a medium full shot | 3-ball cascade, eyes tracking the top ball; callout 1; a wink; WHOOSH fling + POP two more balls | Cut on the catch |
| 14.0–20.5 | `juggle5` | `camB`: low heroic angle, slow push and pan | 5-ball cascade; callout 2; a wink | Cut on the fling |
| 20.5–23.3 | `fling` | `camC`: tilts up to the chandelier and back down | Balls lodge in the chandelier (DING, it swings); Fester holds his pose, then "?" | — |
| 23.3–26.4 | `bonks` | `camC` + shake on each hit | BONK ×4 (squash, grimace, hat knocked askew), then dizzy | — |
| 26.4–30.0 | `finale` | `camD`: slow push onto his face | Recovery, hat fix, shrug; the last ball lands on his hat; wink + thumbs up; iris-out | Black |

## Notes for editing (`scene.js`)

| Constant | Value | Meaning |
|---|---|---|
| `JX, JZ` | 0, 1200 | Fester's mark (the throne room's `MARK`) |
| `J3` | `{ n: 3, tau: .34, h: 17, t0: 7.5 }` | 3-ball cascade: throw interval, height, first throw |
| `J5` | `{ n: 5, tau: .26, h: 24, t0: 14 - 10 * .26 }` | 5-ball cascade, already mid-pattern at the cut |
| `HITS` | `[23.35, 23.7, 24.05, 24.4]` | bonk times (move these onto the beat when the song arrives) |
| `LAST` | `{ rel: 28.3, land: 28.75 }` | the ball that lands on his hat |
| `ROOM.chandKick` | `[21.25, .13]` | when the chandelier gets knocked swinging |
| `TILT` | 1600 | how far `camC` tilts up to find the chandelier |

- Cameras `camA`–`camD` solve `hy` so his feet sit at a chosen screen height while the camera moves.
- The set is softened with `layer(..., { blur })` as the camera closes in.
