# The Trolls · Who's Inside? (Alma's Costumes)

> A fourth take on the finale of *The Trolls*, a variation on [scene 48c](../scene48c_who_is_inside/README.md). The song, the seven riddles, the picture cards and the shots are 48c's. The difference is the costumes. Every monster is Alma's real drawing (the cut-outs in [`../scene48_the_trolls/costumes/`](../scene48_the_trolls/costumes)), worn over the person as in [scene 48](../scene48_the_trolls/README.md). Each drawing is big enough to hide its wearer completely. On the POP the drawing flies off and the person inside springs up out of it.

| | |
|---|---|
| **Length** | 214 s · 24 fps · 120 bpm, the same timing as 48c (its section and riddle constants are unchanged) |
| **Cast** | [Danny](../../../characters/danny/README.md) (the pumpkin) · [Alma](../../../characters/alma/README.md) (the pink ghost) · [Housam](../../../characters/housam/README.md) (the blue bird) · [Jenna](../../../characters/jenna/README.md) (the bee) · [Sarah](../../../characters/sarah/README.md) (the cat) · [Doctor Sami](../../../characters/sami/README.md) (the owl) · [Professor Safadi](../../../characters/safadi/README.md) (the bat) |
| **Costumes** | `../scene48_the_trolls/costumes/*.png`, cut from Alma's drawing by that folder's `cut.py`. There are no code-drawn stand-ins. A costume that hasn't loaded draws nothing, its wearer included, so nobody is given away. |
| **Audio and karaoke** | 48c's `audio.mp3` and `lyrics.js` (`uses: ['scene48c_who_is_inside']` in `asset.js`) |

## What's different from 48c

- **The costumes are worn.** 48c shows an empty drawing and has the person appear on the POP. Here the person is inside the drawing the whole time, moving with it: they drop in, bounce on the beat, wobble and shake together.
- **Bigger drawings.** A riddle's drawing is 720 px tall (48c's were 560), roughly 1.3 to 1.7 times the height of the person inside. The wide ones (the bird and the bat) are capped at 1.4 × that height in width. All seven are still the same height, so their size gives nothing away.
- **Nothing peeks out.** Some of the drawings have gaps between their legs (the cat, the bat, the bird). So each wearer is tucked into the solid part of their drawing: scaled down a little and lifted off the floor, by the amounts in `HIDE`. Those numbers were measured on the PNGs' alpha channel against each person's outline (grown by 7 px for safety), so not a pixel of them shows. To keep the person at centre stage, the drawing is shifted sideways instead of the person.
- **The POP springs them out.** In 0.3 s (`springUp`) the wearer grows from tucked to full size and drops to the floor, under the flash, while the drawing flies off over them.
- **The recap is worn too.** The seven drop into a line (360 px drawings, with the camera pulled back a little), each with its wearer inside. On the sung "pop pop pop…" they spring out one per half beat, and the flying drawings are drawn on top.
- The title, the dance (the empty drawings bounce like beach balls) and THE END are as in 48c, with the cut-outs.

## Notes for editing (`scene.js`)

- `costume(kind, x, y, h, t, { who, sq, rot, shake, off })` draws the drawing `h` px tall. With `who`, it also draws that person inside, standing at `x`, at scale `sOf(who, BASE · h / COSTUME_H)` × `HIDE[kind].c`. Once `off` > 0 the caller draws the person, usually through `springUp(name, x, y, h, u, fn)`.
- `HIDE[kind]` = `{ c, fx, fy }`: how far the wearer is tucked (`c`), and where their feet sit, as fractions of the drawing's width and height from the middle of its bottom edge. Measure these again if you change a drawing, `COSTUME_H` against `BASE`, the 1.4 width cap in `fit()`, or a wearer's rest pose. The method: render the person's outline on a transparent canvas, then search, from the least tucked and most centred placement outwards, for one where the drawing's alpha covers every pixel.
- All the other timing, riddles, cards and acts work as described in [48c's README](../scene48c_who_is_inside/README.md#notes-for-editing-scenejs).
