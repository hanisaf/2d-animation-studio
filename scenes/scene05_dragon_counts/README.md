# Scene 05: Dragon Counts by Threes

> In the throne room, Professor Safadi helps third-grader Alma see a multiplication pattern. Dragon watches, tries to help, and becomes part of the lesson.

| | |
|---|---|
| **Length** | 55 s · 24 fps · 1320 frames |
| **Cast** | [Professor Safadi](../../characters/safadi/README.md) · [Alma](../../characters/alma/README.md) · [Dragon](../../characters/dragon/README.md) |
| **Location** | [Throne room](../../locations/throne_room/README.md), in front of the dais |
| **Audio** | `audio.mp3` in this folder (optional; silence until supplied) |
| **Movie** | #5 |

## Synopsis

Alma is puzzled by `4 × 3`. Safadi projects four rows of three glowing dots over the throne room carpet and asks her to look for a pattern. Alma counts by threes and gets twelve. Dragon hovers nearby, studying them with such concentration that three little bubbles escape its nose and settle as a fifth row. Alma notices that one more group adds three, making fifteen. Dragon flaps again and contributes a sixth group; the bubbles eventually bounce onto its horns. Alma predicts eighteen. Safadi names the pattern, while Dragon bows too eagerly, gets its curled tail underfoot, and plops down with a grin.

The visual argument stays consistent: each row has exactly three dots, so adding one row changes the total by exactly three. The board builds `4 × 3 = 12 → 5 × 3 = 15 → 6 × 3 = 18`.

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *Wide throne room. Alma studies `4 × 3` on a card. Safadi stands with her. Dragon hovers by the right columns, upside-down for a moment as it listens.* |
| 0.8 | ALMA | **“Four times three? I keep losing count.”** |
| 7.2 | SAFADI | *(opens a glowing board)* **“Look for a *pattern*. Each row has three.”** *Four rows of three appear.* |
| 15.0 | ALMA | *(points row by row)* **“Three, six, nine, twelve! Four groups of three make twelve.”** *`4 × 3 = 12` appears.* |
| 23.5 | — | *Dragon leans in. Three harmless bubbles float from its snout and settle neatly as a fifth row. Dragon freezes, startled.* |
| 27.0 | ALMA | **“Dragon added one more group!”** |
| 31.0 | ALMA | **“Twelve plus three is fifteen.”** |
| 35.0 | SAFADI | **“Exactly. Five groups of three make fifteen.”** *`5 × 3 = 15` appears.* |
| 41.4 | — | *Dragon flaps to help again. Three new bubbles wobble into a sixth row.* |
| 45.0 | ALMA | **“And the next answer is eighteen!”** *`6 × 3 = 18` appears. The last bubbles spring from the board onto Dragon’s horns, leaving their glowing dots in place.* |
| 49.2 | SAFADI | **“One more group adds three. That’s the pattern!”** |
| 51.0 | — | *Dragon descends and bows. Its tail curls under a paw; a soft seated plop. The horn bubbles pop. Alma laughs. Dragon grins. Iris-out.* |

## Shot list

| Time | Shot (`scene.js`) | Camera and action |
|---|---|---|
| 0–7 | `question` | Wide view down the throne room carpet. Alma holds the problem card; Dragon watches from near the columns. |
| 7–14 | `showRows` | Push to a three-character teaching composition. Safadi raises a hand; the floating board draws four rows. |
| 14–23.5 | `countFour` | Alma taps the rows in order; each total lights up. The first equation resolves. |
| 23.5–31 | `dragonAddsFifth` | Dragon’s first three bubbles become row five. Alma spots the change. |
| 31–40 | `fiveGroups` | The fifth row glows; Alma explains twelve plus three and Safadi names `5 × 3`. |
| 40–49 | `dragonAddsSixth` | A wing flap sends three more bubbles to row six. Alma predicts eighteen. |
| 49–55 | `patternPayoff` | Safadi states the rule; Dragon lands, bows, trips over its tail and grins. Iris-out. |

## Notes for animation

- All poses, camera movement, dot reveals, and bubble paths are computed directly from scene time. The frame can render out of order.
- `4 × 3` means four groups with three dots in each group; then five and six groups use the same three-dot row. The bubbles never change the number of dots per group.
- Safadi’s chalkboard is drawn in screen space so the array remains readable while the perspective camera moves through the set.
- Dragon has no dialogue. Its looks, wing flaps, bubbles and clumsy bow carry the joke without interrupting the lesson.
