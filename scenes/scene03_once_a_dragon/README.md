# Scene 03: Once a dragon

> *"Once a dragon, always a dragon…"* Juggling outside Dove Creek Elementary, Fester promises a story about Big Baba Head and Alma, then winks.

| | |
|---|---|
| **Length** | 17.5 s · 24 fps · 420 frames |
| **Cast** | [Jester Fester](../../characters/jester_fester/README.md) |
| **Location** | [Dove Creek Elementary](../../locations/dces/README.md): spot *Entrance mark* (0, 0, 2200) |
| **Audio** | `audio.mp3` in this folder (optional; none yet) · tempo grid 100 BPM |
| **Movie** | #3 |

## Synopsis

The school on a sunny morning. The camera opens on the **Entrance** framing: canopy, sign and crosswalk, with Fester small on the mark in front of the doors, already juggling three balls. The camera pushes in to the **Medium** framing while he talks to us, one line at a time, never dropping a ball:

*"Once a dragon… always a dragon! But what is more important… is telling you a story about Big Baba Head and Alma!"*

Line done, he flicks all three balls high. They drop one by one into his hat (*plop, plop, plop*). He turns to camera, gives a thumbs-up and **winks** (*ting!*). The camera eases in on the wink as the iris closes.

**Theme:** a storyteller's hand-off. Fester moves from the castle into the real world and sets up the next story, about Big Baba Head and Alma.

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *Entrance wide: Fester on the mark, juggling three balls.* |
| 1.4 | — | *The camera starts pushing in.* |
| 2.0 | FESTER | **"Once a *dragon*…"** |
| 4.4 | FESTER | *(a bouncy nod)* **"…always a *dragon*!"** |
| 7.1 | FESTER | *(leans in, brows up)* **"But what is *more important*…"** |
| 10.35 | FESTER | *(big grin)* **"…is telling you a story about *Big Baba Head* and *Alma*!"** |
| 14.0 | FESTER | *(flicks the balls up; they drop into his hat)* **plop!** |
| 15.0 | FESTER | *(turns to camera, thumbs up)* |
| 15.3 | FESTER | *(winks)* **ting!** |
| 16.4 | — | *Iris-out on the wink.* |

## Shot list

One continuous shot on a single camera function (`cam`), with no cuts. His feet are pinned to a screen height (`feetY`) while the camera moves, so he stays planted as the frame tightens.

| Time | Shot (`scene.js`) | Camera | What happens | Out |
|---|---|---|---|---|
| 0.0–14.0 | `talk` | hold on **Entrance**, push 1.4–4.4 to **Medium**, slow drift | juggling, four lines | — |
| 14.0–17.5 | `wink` | slow push past **Medium** (z 1840 → 1965) | balls into the hat, thumbs-up, wink | iris-out 16.4–17.5 |

## Notes for editing (`scene.js`)

- `J3`: the cascade (3 balls, `tau` .34). `t0` sits 10 throws before 0, so he is already mid-pattern when the scene opens.
- `LINES`: each line's start time, text and callout options. Retime a line here; the acting beats (`nod`, `lean`) key off the same times.
- `FLING` (14.0): when the balls fly into the hat. `WINK` (15.3): when the wink lands. `IRIS` [16.4, 17.5].
- Camera keys: `CAM_Z` and `FEET` (feet screen-y), from the DCES presets *Entrance* `{ y: 200, z: 1150, hy: 600 }` and *Medium* `{ y: 120, z: 1820, hy: 640 }`.
