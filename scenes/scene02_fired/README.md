# Scene 02: Fired!

> Fester tells Princess Pearl a chicken joke. She is not amused: *"Fester… you're FIRED! Somebody find me another jester!"*

| | |
|---|---|
| **Length** | 37 s · 24 fps · 888 frames |
| **Cast** | [Princess Pearl](../../characters/princess_pearl/README.md) (on the throne) · [Jester Fester](../../characters/jester_fester/README.md) (before the dais) |
| **Location** | [Throne room](../../locations/throne_room/README.md): spots *Throne seat* (0, 258, 2275) and *Before the dais* (−200, 0, 1880) |
| **Audio** | `audio.mp3` in this folder (optional; none yet) · tempo grid 100 BPM |
| **Movie** | #2 |

## Synopsis

Princess Pearl slumps on her throne, bored out of her plush mind. Fester bounds in with a somersault and a ta-da, and tries his best material: "Why did the chicken cross the road?" Pearl, heavy-lidded, manages a flat "…why?" "To get to the other side!" Fester cracks himself up. Pearl doesn't. Crickets. She rolls her eyes.

Sweating, Fester tries to save it: "W-wait! I can juggle!" He pops three balls from his hat. Pearl answers with an enormous yawn, then points a flipper: "Fester… you're FIRED!" The balls rain down around the frozen jester and his hat wilts. Pearl turns her nose up and away: "Somebody find me another jester!"

Alone on the carpet, Fester stands in his drooping hat. A single ball rolls up and taps his shoe. He sighs, a small shrug: "…story of my life." Iris-out.

**Theme:** the first real setback. It sets up the series' next beat: the search for a new jester, and Fester's comeback.

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *Wide: Pearl slumps on the throne, bored, tail swishing.* |
| 1.1 | FESTER | *(hops in, somersaults, lands before the dais)* Ta-da! ♪ |
| 5.0 | FESTER | *(jazz hands)* **"Your Highness! Why did the chicken cross the road?"** |
| 10.0 | PEARL | *(a slow blink)* |
| 10.9 | PEARL | *(deadpan)* **"…why?"** |
| 12.8 | FESTER | **"To get to the other side!"** |
| 14.6 | FESTER | *(clutching his belly)* **HA! HA! HA!** |
| 16.9 | — | *chirp… chirp…* |
| 18.2 | PEARL | *(rolls her eyes; tail flick)* |
| 19.7 | FESTER | *(sweat drop, awkward grin)* |
| 20.2 | FESTER | **"W-wait! I can juggle!"** **POP!** *(three balls from the hat)* |
| 24.3 | PEARL | *(an ENORMOUS yawn)* |
| 25.45 | PEARL | *(glares, points a flipper; shout)* **"Fester… you're FIRED!"** |
| 27.45 | FESTER | *(freezes, jaw drops; the balls rain down: thud, bonk, boing; his hat wilts)* |
| 30.95 | PEARL | *(turns her nose up and away)* **"Somebody find me another jester!"** |
| 34.9 | — | *A ball rolls up and taps his shoe.* |
| 35.3 | FESTER | (thought bubble) **"…story of my life."** *(small shrug)* |
| 36.25 | — | *Iris-out.* |

## Shot list

Coverage: a wide establishing shot, then shot / reverse-shot. **Screen direction:** Fester looks screen-right up at her; she faces screen-left down at him (until she turns away). In Fester's shots she stays softly visible in the background.

| Time | Shot (`scene.js`) | Camera | Beat |
|---|---|---|---|
| 0.0–4.6 | `establish` | `camWide`: slow push down the carpet | Setup: bored Pearl, Fester's entrance |
| 4.6–9.6 | `joke` | `camF`: Fester, knees up; Pearl soft behind | The joke |
| 9.6–12.6 | `why` | `camP`: Pearl close-up | Deadpan |
| 12.6–16.6 | `punchline` | `camF` | The punchline bombs; he laughs anyway |
| 16.6–19.6 | `crickets` | `camP` | Crickets, eye-roll |
| 19.6–24.2 | `juggle` | `camF` | Last try: juggling |
| 24.2–27.4 | `fired` | `camP` + push-in and shake on "FIRED" | The decision |
| 27.4–30.4 | `shock` | `camF`: full body (the floor matters) | Shock: balls rain down, hat wilts |
| 30.4–33.8 | `another` | `camP` | Dismissal |
| 33.8–37.0 | `alone` | `camF`: full body, slow push | Callback to scene 01, iris-out |

## Notes for editing (`scene.js`)

| Constant | Value | Meaning |
|---|---|---|
| `FX, FZ` | −200, 1880 | Fester's mark (spot *Before the dais*) |
| `PZ, SEAT_Y` | 2275, 258 | Pearl on the throne cushion (spot *Throne seat*) |
| `J3` | `{ n: 3, tau: .34, h: 15, t0: 21.6 }` | his juggling in `juggle` |
| `FIRE` (in `fired`) | 26.3 | the push-in and shake on "FIRED" |

Cameras:
- `camWide(t)` is the establishing shot.
- `camF(t, t0, t1, push, x, feet)` is Fester's medium shot. With `feet = 1150` he's framed from the knees up, which keeps Pearl visible; use ≈ 1020 when the floor matters.
- `camP(t, t0, t1, push, extraZ)` is Pearl's close-up.

Other techniques:
- Pearl's mouth is found with `measure()` before she is drawn, so her speech bubble can decide her lip-flap.
- The balls in `shock` bounce with the closed-form `dropY()`.
