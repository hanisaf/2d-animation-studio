# Ancient Athens

> The agora of ancient Athens below the Acropolis: a paved limestone square with a round speaker's platform, a Doric stoa, olive trees, a marble bench and a column topped by Athena's owl, and the Parthenon on its rocky hill. Looking back: white houses, terracotta roofs, a little temple and the sea.

## Description

Where Professor Safadi tells the children *"Gnōthi seauton… know thyself"* (scene 30). A sunny, open-air storybook set in the same palette as [the Roman bath](../roman_bath/README.md).
- **Centre:** the **bema**, a round two-step marble platform where the teacher stands, and a wicker **basket of scrolls** beside it.
- **Left:** a long **stoa**, a roofed Doric colonnade with a red-and-blue painted back wall, doors and panels, triglyphs on the architrave and a row of antefixes along the eaves. Two **amphorae** stand in front of it.
- **Right:** **olive trees** that sway in the breeze, a marble **bench**, and a column with **Athena's owl** on top. The owl blinks and now and then turns its head.
- **Back:** a low **terrace wall** with steps up toward the hill, a lower town of white houses with olive bushes and cypresses, and the **Acropolis** on its rock: the **Parthenon**, the Propylaea gateway and the little Erechtheion. Mount Hymettus is a blue ridge behind, and there's a sun and drifting clouds.
- **Reverse (dir −1):** rows of houses with terracotta roofs, the Hephaisteion on a low hill, and the sea toward Piraeus.
- **Sky:** swallows wheel overhead (`birds: 0` turns them off).

## Using it

```js
const AT = LOCATIONS.ancient_athens;
AT.back(P, t, { splitZ });
// characters nearer than splitZ
AT.front(P, t, { splitZ });
```

| Option | What it does |
|---|---|
| `splitZ` / `toZ` | as in every set: `back` draws what's farther than `splitZ`, `front` what's nearer (down to `toZ`) |
| `birds` | 0..1, swallows in the sky (default 1) |

## Layout (world units; a person is about 170 tall)

| Feature | Where |
|---|---|
| Agora paving | X ±760, Z −600..1700, ground Y 0 (open earth beyond) |
| Bema | centre (0, 620); lower step r 140 (Y 0–9), upper step r 105 (Y 9–18) |
| Stoa | back wall X −760, Z −40..1440; columns X −560 at Z 100, 400, 700, 1000, 1300, 300 tall; roof Y 300–360 |
| Terrace wall | Z 1700–1740, Y 0–70, steps X ±130 |
| Lower town | houses and olive bushes Z 2000–3000 |
| Backdrops | Acropolis plane at Z 3200; the town and the sea at Z −3200 |
| Props | olive trees (450, 260), (560, 1080), (−330, 1420) · bench (430, 520–720) · owl column (300, 1300) · amphorae (−430, 140), (−460, 920) · scroll basket (130, 540) |

## Spots

| Spot | (X, Y, Z) |
|---|---|
| On the bema (`ancientAthens.MARK`) | (0, 18, 620) |
| Student 1 (far left) … Student 5 (far right) | (−250, 0, 430) · (−130, 0, 370) · (0, 0, 345) · (130, 0, 370) · (250, 0, 430): an arc in front of the bema |
| In the stoa | (−640, 16, 600) |
| Under the olive tree | (380, 0, 300) |

## Cameras

`Wide · the agora`, `Sage · low angle` (Safadi on the bema against the Parthenon), `Sage · medium`, `Students · reverse` (`dir: -1`, from the bema back at the students: the camera stands where Safadi is, so leave him out of this shot), and `Side · from the stoa`.

## Notes

- Characters have no back view, so for over-the-shoulder shots keep the teacher out of the reverse angle, or cut between `Sage` and `Students`.
- The students in Greek clothes are the [student rig](../../characters/student/README.md) with `outfit: 'greek'`; Professor Safadi uses his own `outfit: 'greek'`.
