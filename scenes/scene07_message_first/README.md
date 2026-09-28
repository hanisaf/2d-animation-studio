# Scene 07: The Message Comes First

> In the lecture hall, Professor Safadi reminds the class that AI can make everything move, but the message should get the spotlight. Housam and Alma listen, nod and trade glances without a word.

| | |
|---|---|
| **Length** | 68 s · 24 fps · 1632 frames |
| **Cast** | [Professor Safadi](../../characters/safadi/README.md) (speaks) · [Housam](../../characters/housam/README.md) and [Alma](../../characters/alma/README.md) (silent, seated in row 3) |
| **Location** | [Lecture hall](../../locations/lecture_hall/README.md): Safadi at (−250, 40, 1990) beside the lectern; Housam `seat(3, −66)`, Alma `seat(3, 66, 30)` |
| **Sound** | Safadi's synthesized voice from the `dialogue` in `asset.js`; a quiet synthesized score that swells at "tempted" and nearly stops when he catches himself |
| **Movie** | #7 |

## Synopsis

Safadi stands beside the lectern. Behind him the slide stays simple and still: a sketch becomes a character, with *What am I trying to say?* underneath. He tells the class how much faster AI makes animation. As he gets to how tempting it is to make everything move, his own powers flare up: an aura, orbiting formulas, glowing eyes and an idea bulb. He notices, sweats, switches them off and asks the real question. The camera cuts back and forth between him and Housam and Alma, who listen from row 3: a wide-eyed "wow", nods, a chin-in-hand, a glance around at "more to look at", a shared giggle, and quiet note-taking. After a pause he turns to the camera: *"Give the message the spotlight."* A spotlight closes in around him, he grins, and the scene irises out.

**Theme:** the scene makes its point by holding back. The only big effect is the one Safadi turns off.

## Script

The script's lines are split into bubble-sized pieces. Timings come from `asset.js` → `dialogue`.

| Time | Who | Line / action |
|---|---|---|
| 0.8 | Safadi | "With AI, a sketch can become a *character*…" (palm toward the slide) |
| 4.0 | Safadi | "…and a character can come to *life*." (arms open) |
| 7.5 | Safadi (off-screen) | "Work that once took hours, days, or a team of professionals can now happen *much faster*." Housam leans in, "wow", nods twice; Alma glances at him, then wiggles in her seat with star eyes |
| 13.5 | Safadi | "That opens up *wonderful possibilities*." (arms wide, happy eyes) |
| 16.8 | Safadi | "We can experiment, tell stories, and try ideas we might never have attempted." |
| 21.7 | Safadi | "And once we discover we can make *everything* move…" His powers ramp up and the bulb pops (23.6) |
| 25.1 | Safadi | "…we're *tempted* to make everything move." (full glow) |
| 28.6 | Safadi | He notices, sweats, and the powers switch off |
| 29.4 | Safadi | "But before adding another effect, ask: *what am I trying to say?*" (thinking finger) |
| 34.2 | Safadi (off-screen) | "Does the animation help someone *understand*?" Housam nods |
| 37.4 | Safadi (off-screen) | "Does it make the idea easier to *remember*?" Alma rests her chin on her hand, then nods |
| 40.6 | Safadi (off-screen) | "Or does it just give them *more to look at*?" Both glance around, then at each other; Alma giggles and blushes |
| 44.9 | Safadi | "Sometimes movement makes an idea *clear*." |
| 48.1 | Safadi | "Sometimes a simple image, a few words, or a quiet moment does the job *beautifully*." (hands settle together) |
| 53.9 | Safadi (off-screen) | "Just because we can make something flashy…" Housam takes notes |
| 57.0 | Safadi (off-screen) | "…doesn't mean that's what it *needs*." Both nod slowly and smile |
| 60.8 | Safadi | A pause. He turns to the camera |
| 62.8 | Safadi | "Give the message the *spotlight*." A spotlight closes in; he grins |
| 66.8–68 | | Iris out |

## Shot list

| # | Time | Shot fn | Camera | What |
|---|---|---|---|---|
| 1 | 0–7.3 | `establish` | podium view, wide from the front row, slow push | Safadi, lectern, slide |
| 2 | 7.3–13.2 | `listenA` | classroom view (`dir: -1`), two-shot of row 3 | Housam and Alma react |
| 3 | 13.2–21.7 | `possibilities` | podium, medium | wonderful possibilities |
| 4 | 21.7–34 | `tempted` | podium, medium, push in | powers flare, fizzle out, the real question |
| 5 | 34–44.6 | `listenB` | classroom, slow push | nods, chin-in-hand, glances, giggle |
| 6 | 44.6–53.7 | `quiet` | podium, medium close | clear… quiet… beautifully |
| 7 | 53.7–60.8 | `listenC` | classroom | notes and slow nods |
| 8 | 60.8–68 | `spotlight` | podium, close, slow push | pause, look to camera, spotlight, iris |

## Notes for editing

- **Two directions, one set:** podium shots put the camera in the pit at Z 1330–1680, looking toward +Z. The students sit behind it in row 3 (Z 968), so they're correctly left out of those shots. Classroom shots use `dir: -1` from Z 1440–1520. Safadi is then behind the camera, so his bubble's tail points off the bottom of the frame (`studentShot`).
- **Nods:** the rigs can't pitch the head, so `nod()` drops the eyes and dips the torso (`dy`), with a touch of `tilt`. Adjust `per` (seconds per dip) and `n` (number of dips).
- **Cameras:** `podium()` locks Safadi's feet to a screen height, and `classroom()` locks the students' eye line. To reframe a shot, change its `f`, `z` and the locked screen y.
- **The slide** (`slide()`) doesn't change over time, as the script asks. The boards are left blank.
- **Length:** the script is marked ~60 s, but at readable typing speeds the lines take 68 s. To tighten it, raise `cps` in `asset.js` and move the shot times to match.
