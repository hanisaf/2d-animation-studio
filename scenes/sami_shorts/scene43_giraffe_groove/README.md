# Giraffe Groove

> Jenna dances with a big giraffe while holding her small giraffe, Fafy.

| | |
|---|---|
| **Length** | 18 s · 24 fps |
| **Cast** | [Jenna](../../../characters/jenna/README.md), Fafy the plush, and a big friendly giraffe |
| **Location** | A stylized sunset dance clearing |
| **Audio** | Synthesized 112 BPM children’s dance groove |

## Synopsis

Jenna arrives in a warm, flower-filled clearing with Fafy held securely in her left hand. A huge giraffe leans into frame and offers a hoof. Jenna answers with a bounce, and all three giraffes—one big, one plush, and one imagined in Jenna’s joyful movement—fall into a synchronized dance. They sway, step, twirl, and finish in a celebratory pose beneath falling confetti.

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | Jenna bounces in place, holding Fafy. A big giraffe peeks down at her. |
| 3.0 | JENNA + GIRAFFE | They greet each other with matching side-to-side steps. |
| 7.0 | JENNA + GIRAFFE | The dance grows into a disco point and long-neck wave. |
| 12.0 | JENNA + GIRAFFE | Jenna twirls while the giraffe prances in a circle. |
| 16.0 | ALL | Confetti falls and they hit one big final pose; Fafy remains raised in Jenna’s hand. |

## Shot list

| Time | Shot (`scene.js`) | Camera | What happens | Out |
|---|---|---|---|---|
| 0.0–7.0 | `helloDance` | gentle push in | The partners meet and find the beat. | cut on clap |
| 7.0–12.0 | `discoDance` | lively side drift | Jenna points; the giraffe ripples its neck and steps. | sparkle wipe |
| 12.0–18.0 | `finaleDance` | pull wide, then punch in | Twirl, prance, confetti, final pose. | iris out |

## Notes for editing (`scene.js`)

The full-size giraffe is local to this scene. Jenna’s existing rig draws Fafy automatically in her left hand. All dance movement is computed directly from scene time so parallel frame rendering remains deterministic.
