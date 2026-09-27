# Scene 06: The prime-number puzzle

> Outside Dove Creek Elementary, Professor Safadi helps Housam and Alma understand the question behind the Riemann hypothesis. They leave with curiosity and joy, while the problem remains open.

| | |
|---|---|
| **Length** | 110 seconds (1:50) · 24 fps |
| **Cast** | [Professor Safadi](../../characters/safadi/README.md), [Housam](../../characters/housam/README.md), [Alma](../../characters/alma/README.md) |
| **Location** | [Dove Creek Elementary](../../locations/dces/README.md), entrance sidewalk |
| **Sound** | Procedural score and three different personality-based cartoon voices; no audio files |
| **Math source** | [Clay Mathematics Institute: Riemann Hypothesis](https://www.claymath.org/millennium/Riemann-Hypothesis/) |

## Synopsis

Housam asks an intimidating question after school. Safadi begins with primes and lets Alma hear their uneven rhythm. They count primes on a glowing board, then compare the step-like count with a smooth trend. When the unfamiliar word *zeta* loses the children, Safadi stops and patiently redraws the idea as a map. The interesting zeros sit in a strip; the hypothesis asks whether all of them lie on its center line, where the real part is one-half. Housam and Alma explain the question back to Safadi, understand that nobody has proved it, and celebrate with a soccer bounce and a little dance.

The number-line, trend curve and zero dots are **teaching sketches**. The plot shows a few illustrative dots on the center line, never a proof that all zeros lie there. “Interesting zeros” in dialogue means *nontrivial zeros*. Clay describes the hypothesis as the claim that all nontrivial zeros of the zeta function have real part one-half and relates those zeros to deviations in the distribution of primes.

## Script and acting beats

| Time | Beat | Story |
|---|---|---|
| 0–8 | The big question | Housam asks about the Riemann hypothesis. Safadi smiles and starts with primes. |
| 8–26 | Prime rhythm | Alma names small primes; golden numbers illuminate irregularly. Housam likens the rhythm to changing soccer passes. |
| 26–39 | Counting | Prime counts climb in steps beside a smooth illustrative trend. Housam notices the wobble. |
| 39–55 | Too much jargon | Zeta appears; both students look lost. Safadi turns down his powers, acknowledges the difficulty and resets. |
| 55–71 | The map | A strip appears between real parts zero and one. Sample zero dots light up on the one-half line. |
| 71–95 | Their own words | Alma identifies one-half. Housam connects the dots to the prime-counting wobble. Safadi says the “all” claim remains unproved. |
| 95–110 | Joyful finish | The students can state the question without claiming a solution. Housam kicks into a happy hop; Alma dances; Safadi encourages their curiosity. |

## Production notes

- `asset.js` is the single source for dialogue text and times; `scene.js` reads it for bubbles and mouth movement. The audio renderer uses those same entries to synthesize each character's syllables.
- Safadi's voice is low, warm and measured. Housam's is quicker and more percussive. Alma's is higher and melodic. Character voice profiles live in their own `asset.js` files.
- The floating board changes through primes, prime count, zeta and the critical strip. It is drawn in screen space in front of the school set. There are six shot sections and no imported images or audio in the animation itself.
- The score lowers during dialogue and rises at the final shared moment.
