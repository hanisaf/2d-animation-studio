# Scene 04: The healthy promise

> Walking Alma to school, Professor Safadi explains why healthy food matters. Candy for breakfast? Not after this. *"I promise… every day!"*

| | |
|---|---|
| **Length** | 54.5 s · 24 fps · 1308 frames |
| **Cast** | [Professor Safadi](../../characters/safadi/README.md) · [Alma](../../characters/alma/README.md) |
| **Location** | [Dove Creek Elementary](../../locations/dces/README.md): the front sidewalk (Z ≈ 2100), then the entrance |
| **Audio** | `audio.mp3` in this folder (optional; none yet) · tempo grid 112 BPM (Alma's dance) |
| **Movie** | #4 |

## Synopsis

Morning at DCES. Professor Safadi walks Alma to school along the front sidewalk. He strolls with a measured stride; she skips beside him, licking a giant swirly lollipop. Candy for breakfast? Safadi can't help himself: he has to *explain*.

His powers switch on: glowing eyes, orbiting chalk formulas, and a floating chalkboard that draws a healthy plate. Alma resists ("broccoli tastes like… *trees*!"). A second board shows the sugar spike and crash next to the steady energy of veggies, and her lollipop droops. Then he finds the argument that works on her: healthy food means energy to *dance all day*. Her eyes turn to stars.

At the entrance she hands him the lollipop and promises to eat healthy food every day. She celebrates with a super-dance twirl and skips to the door, waving goodbye. Left alone, Safadi eyes the lollipop and lifts it toward his mouth… catches himself, winks at us: *"…Tomorrow."* Iris-out.

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *Wide: the school. Safadi (walking) and Alma (skipping, lollipop) enter from screen-left along the sidewalk.* |
| 4.5 | SAFADI | **"Alma… is that *candy* for breakfast?"** |
| 9.0 | ALMA | *(big lick, proud)* **"Yep! It's the *best*!"** |
| 12.2 | SAFADI | *(brows up, gentle smile)* **"May I… *explain* something?"** |
| 15.2 | ALMA | *(groans, eyes roll)* **"Uh-oh. An explanation."** |
| 16.5 | — | *They stop walking.* |
| 17.0 | SAFADI | *(powers on: glowing eyes, orbiting formulas)* **"Your body is like a car. Food is the *fuel*. Fruits and veggies are *super fuel*!"** *A board draws a healthy plate.* |
| 24.3 | ALMA | *(arms crossed, pouting)* **"But broccoli tastes like… *trees*!"** |
| 28.4 | SAFADI | **"Candy gives you a quick *zoom*… then a big *crash*."** *The board draws the sugar spike and crash, and veggies holding steady. Alma's lollipop droops.* |
| 34.2 | ALMA | *(thinking, hand on chin)* **"Hmmm…"** |
| 36.3 | SAFADI | *(idea bulb pops)* **"But healthy food gives you energy to *dance*… *all day long*!"** |
| 41.2 | ALMA | *(eyes turn to stars; shout)* **"Dance… *ALL DAY*?!"** |
| 43.3 | ALMA | *(at the entrance, hands him the lollipop, thumbs up)* **"Okay! I *promise* to eat healthy food… *every day*!"** |
| 46.6 | ALMA | *(a super-dance twirl: rainbow floor, sparkles, notes)* |
| 48.2 | ALMA | *(skips to the door, turns, waves)* **"Bye!"** |
| 51.0 | SAFADI | *(alone; lifts the lollipop toward his mouth… freezes)* |
| 52.2 | SAFADI | *(to camera, a wink)* **"…Tomorrow."** |
| 53.4 | — | *Iris-out.* |

## Shot list

**Screen direction:** they walk left → right. Alma is on the left, Safadi on the right; in their two-shots they turn their heads toward each other.

| Time | Shot (`scene.js`) | Camera | What happens |
|---|---|---|---|
| 0.0–4.0 | `establish` | wide on the school, slow pan right | they walk in from screen-left |
| 4.0–16.9 | `walkTalk` | two-shot, trucking right with them | candy for breakfast; "May I explain?"; they stop |
| 16.9–24.0 | `explainPlate` | Safadi medium, board on the right | powers on, the healthy plate |
| 24.0–28.0 | `trees` | Alma medium | "broccoli tastes like trees" |
| 28.0–36.0 | `crash` | two-shot, board above them | spike and crash; "Hmmm…" |
| 36.0–41.0 | `dance` | Safadi medium | idea bulb: energy to dance |
| 41.0–43.0 | `stars` | Alma close, push-in | "Dance… ALL DAY?!" |
| 43.0–50.5 | `promise` | entrance, both full body | the lollipop hand-off, the promise, the twirl, "Bye!" |
| 50.5–54.5 | `tomorrow` | Safadi medium | the lollipop gag, the wink, iris-out |

## Notes for editing (`scene.js`)

- `WALK`: the pair's path along the sidewalk (group centre X over time). The walk and skip phases are tied to distance travelled (`safadiWalk`, `almaSkip`), so their feet never slide.
- `LINES`: each line's start time, speaker, text and callout options. Acting beats key off the same times.
- `safadiPose(t)` and `almaPose(t)` hold each character's acting over the whole scene, so a pose carries across cuts. Shots only choose the camera and the overlays (boards, callouts).
- Boards: `plate` 18.3–24.0 and `crash` 28.8–36.0 (`safadiBoard`).
- Entrance spots: Alma (−120, 0, 2215), Safadi (150, 0, 2200). The door is at Z 2600.
