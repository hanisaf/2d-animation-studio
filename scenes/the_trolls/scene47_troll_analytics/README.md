# Troll Analytics

> *The Trolls*, episode three. Professor Safadi reads fan mail, checks his YouToon analytics, and discovers that silly sells. With Doctor Sami and a page of Alma's monster drawings, the twins hatch the silliest plan in ages.

| | |
|---|---|
| **Length** | 89 s · 24 fps · 96 bpm |
| **Cast** | [Professor Safadi](../../../characters/safadi/README.md) · [Doctor Sami](../../../characters/sami/README.md) |
| **Location** | [Professor Safadi's study](../../../locations/safadi_study/README.md) (desk view, afternoon) |
| **Props** | the real fan letter (`fan_letter.webp`) and Alma's monster drawing (`alma_monsters.jpg`), held up and shown full frame; the YouToon Studio screens, drawn in code after `reference_analytics.webp` |
| **Audio** | synthesized: cartoon voices from `dialogue`, music from `music` in `asset.js` |

## Synopsis

Professor Safadi sits at his desk reading a fan letter, Doctor Sami at his shoulder. We read it with him: *"Ah, my dear students, why such a fuss? … gnothi seauton, know thyself, you see!"* "It is so heartening to receive fan mail." "So we have many fans?"

He opens YouToon Studio. *Screen Time 3 · Game Over!*: 1.2K impressions, a 1.0% click-through rate, **21 views** (circled in red; crickets). "So we have a… handful of fans?" He scrolls through the channel: 34 views, 19, 12, 6… then *Tongue Twisters* and *Super Tongue Twisters* light up gold and count up into the millions, with green arrows, fire and confetti. "Brother, for some reason the silly videos are doing very well." "People these days like silly things." "Let us double down on silliness!" "I agree. What is the plan?"

Safadi pulls a sheet out of the desk drawer. "Alma drew these monsters." (Alma's drawing, full frame.) "They are cute… and silly." His idea bulb pops and a thought cloud fills with the monsters and TONGUE TWISTERS!: "Imagine we wear these monster costumes, go to school and challenge kids to tongue twisters!" "That is the silliest thing I heard in ages!" "Exactly." Two sly smiles, eyebrows going. *To be continued…*

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0 | — | *Wide on the study from the fire, pushing in to the desk. Safadi reads a letter; Sami leans in.* |
| 2.4 | — | *INSERT: the fan letter, panning down the page; little hearts rise from the red one.* |
| 15.3 | SAFADI | *(lowering the letter)* **"It is so heartening to receive fan mail."** |
| 19.0 | SAMI | **"So we have many fans?"** |
| 21.9 | — | *INSERT, laptop: YouToon Studio · Video analytics · Reach. The cards pop in, the impressions chart draws itself, a red circle goes round 21 views. Crickets.* |
| 27.6 | SAMI | *(deflating)* **"So we have a… handful of fans?"** |
| 31.5 | — | *INSERT, laptop: Channel content, scrolling past views in the tens… then Tongue Twisters (1,482,306) and Super Tongue Twisters (2,917,554) glow, count up, confetti.* |
| 39.7 | SAFADI | *(wide-eyed)* **"Brother, for some reason the silly videos are doing very well."** |
| 44.6 | SAMI | **"People these days like silly things."** |
| 48.3 | SAFADI | *(fist up)* **"Let us double down on silliness!"** |
| 51.8 | SAMI | **"I agree. What is the plan?"** |
| 54.6 | — | *Safadi lifts a sheet out of the drawer.* |
| 56.2 | SAFADI | **"Alma drew these monsters."** |
| 59.0 | — | *INSERT: Alma's drawing, slow push in, sparkles.* |
| 61.9 | SAMI | *(off)* **"They are cute… and silly."** |
| 67.9 | SAFADI | *(the idea bulb; a thought cloud of monsters and TONGUE TWISTERS!)* **"Imagine we wear these monster costumes, go to school and challenge kids to tongue twisters!"** |
| 74.5 | SAMI | *(hands up, delighted)* **"That is the silliest thing I heard in ages!"** |
| 78.8 | SAFADI | **"Exactly."** *(Both smile slyly, eyebrows waggling; slow push in.)* |
| 82.4 | — | *Freeze. TO BE CONTINUED… Iris out.* |

## Shot list

| Time | Shot (`scene.js`) | What happens |
|---|---|---|
| 0.0–2.4 | `opening` | desk wide → two-shot |
| 2.4–15.0 | `letterShot` | the fan letter, full frame |
| 15.0–21.9 | `two` / `closeSami` | fan mail, "many fans?" |
| 21.9–27.2 | `lap1Shot` | the analytics page: 21 views |
| 27.2–31.5 | `closeSami` | "a handful of fans?" |
| 31.5–39.3 | `lap2Shot` | the channel list scrolls to the hits |
| 39.3–59.0 | `two` / `closeSafadi` / `closeSami` | silly sells, the plan, the drawing comes out |
| 59.0–67.6 | `drawingShot` | Alma's monsters, full frame |
| 67.6–74.3 | `ideaShot` | the bulb and the thought cloud |
| 74.3–78.6 | `closeSami` | "the silliest thing" |
| 78.6–88.8 | `ending` | "Exactly.", the push in, the freeze, the card, the iris |

## Notes for editing (`scene.js`)

- **Timing comes from the dialogue.** The inserts and actions are placed around tagged lines in `asset.js` (`mail`, `many`, `handful`, `silly`, `double`, `plan`, `monsters`, `cute`, `imagine`, `silliest`, `exactly`): `LETTER_IN`, `LAP1`, `LAP2` (with `SCROLL` and `HITS`), `PULL`, `DRAW_IN`, `IDEA`, `FREEZE`.
- **The pictures:** `img()` loads `fan_letter.webp` and `alma_monsters.jpg` from this folder when the scene loads; `paperProp` draws one in Safadi's hands, `paperInsert` full frame. Until a picture has loaded, a blank sheet stands in.
- **YouToon Studio** is drawn in screen space inside `laptopFrame`: `analyticsScreen` (the numbers in `cards`, the chart in `curve`) and `contentScreen` (the rows in `VIDEOS`; `hot` rows glow and count up). `cursor` moves the pointer through keyframes.
- **Off-screen lines:** over an insert, `offBubbles` points the tail out of the frame (Sami to the right, Safadi to the left).
- **Blocking:** Safadi at (−55, 930), seated behind the desk; Sami at (95, 958), standing. The laptop is on the desk at screen-left, so looking at it is `lookX < 0`.
