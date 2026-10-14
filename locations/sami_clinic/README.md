# Dr. Sami's clinic

> Doctor Sami's bright clinic office: his desk with a beating heart model and a BRAVE! sticker jar under the X-ray light box and eye chart; an exam table with a paper roll, a heart monitor, a fruit-and-veg mobile and a privacy curtain; a balance scale, a giraffe growth chart and a kids' corner.

## Description

Where Doctor Sami sees his young patients. It's clean, minty and cheerful, made to feel friendly to a nervous kid. Coloured footprint stickers on the floor lead from the door to the exam table.
- **Front (the desk end):** a white desk with mint panels and red hearts. On it are a computer (the back shows a mint star; from behind the desk you see a patient chart with a growth curve), a prescription pad and pen, a pen cup, a rubber duck with a tiny bandage, a **BRAVE! sticker jar** and an anatomical **heart model** that beats in time with the monitor. Dr. Sami's blue rolling chair is behind the desk, and two visitor chairs (orange and blue) face it.
- **Front wall:** a DR. SAMI'S CLINIC sign with hearts, a framed M.D. diploma, an **X-ray light box** showing a cartoon chest X-ray (with an "all clear" gold star), a **Snellen eye chart** (E · F P · T O Z…), a **HEALTHY PLATE** poster with a glass of milk, and a clock.
- **Front corners:** a **sink** counter on the left with a gooseneck tap, a soap pump, glove boxes, a paper-towel dispenser and a wall cupboard. On the right is a **balance-beam scale** with a height rod; its weights slide about a little.
- **Right wall:** a **window** with **blinds** over the trees, with a cactus and a pothos on the sill. Near the scale is a **giraffe growth chart** with colour bands up to 200.
- **Left wall:** the door with a round window, a **WASH YOUR HANDS** poster with soap bubbles drifting up, and a wall diagnostic set (a blood-pressure gauge with its cuff, and an otoscope) by the exam table. A tall plant stands by the wall.
- **Back wall (the exam end):** a teal **exam table** with a raised head end, a strip of paper pulled from its roll, drawers and a step stool. Above it are a shelf of jars (cotton balls, tongue depressors, bandages), a STAY HEALTHY! banner and a **GERMS!** poster with a grumpy green germ. A wall-mounted **heart monitor** scrolls an ECG trace, with a beating heart and the rate.
- **Over the exam table:** a **fruit-and-veg mobile** (apple, broccoli, carrot, banana, strawberry) turning slowly. A ceiling track carries a light-blue **privacy curtain** with little hearts.
- **Kids' corner (back right):** a round yellow table with letter blocks and crayons, two child-size chairs, and a red TOYS box with a teddy bear (bandage on his head, red bow tie).
- **Floor:** pale blue-grey vinyl tiles with speckles. **Ceiling:** light panels.

**Mood:** bright, clean, playful. Nothing scary happens here, except maybe a broccoli lecture.

## Two views

Like the science room, the clinic is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same spots work either way.

| View | Camera | Sees |
|---|---|---|
| **Desk view** | `dir: 1` (the default), from the exam end looking toward +Z | the desk, X-ray box, eye chart, posters, sink, scale, growth chart. Use it for Dr. Sami at his desk. |
| **Exam view** | `dir: -1` (the reverse angle), from behind the desk looking back toward −Z | the exam table, heart monitor, mobile, curtain, kids' corner and the window. Use it for the patients. |

Character rigs always face the camera. In the reverse view +X is on screen-left, so the window and kids' corner are on the left, and the door and wall diagnostic set are on the right.

## Layout (world units; a person is about 170 tall)

X is right when facing the desk, Y is up (the floor is Y = 0), and Z runs from the back (exam) wall to the front (desk) wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±480 · back wall Z = 0 · front wall Z = 1100 · ceiling Y 330 |
| Desk | X −200…200, Z 790–870, top Y 76 |
| Dr. Sami's chair | (0, 1010) |
| Visitor chairs | (−110, 680) orange · (110, 680) blue |
| X-ray light box | X −270…−70, Y 155…285 (front wall) |
| Eye chart / healthy-plate poster | X 110…220 / 270…420 (front wall) |
| Sink counter | X −470…−300, Z 1040–1100, 90 tall; wall cupboard Y 210…285 |
| Scale | (385, 1020), height rod to Y 205 |
| Growth chart | right wall, Z 880–1050, Y 10…215 |
| Window | right wall, Z 380–760, Y 110…290 |
| Door / hand-washing poster / diagnostic set | left wall, Z 820–950 / 590–730 / 300–430 |
| Exam table | X −200…120, Z 30–130, top Y 80 (head end rises to 110); step stool to Z 176 |
| Heart monitor | back wall, centred X 250, Y 170…255 |
| Curtain track | Z 230, X −470…170 |
| Mobile | centred (−40, 85), hanging to Y ≈ 175…200 |
| Kids' table / toy box | (345, 230) / X 360…470, Z 10–80 |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| At the desk (`samiClinic.MARK`) | (0, 0, 940) | Dr. Sami behind the desk: chest and head show above it |
| In front of the desk | (0, 0, 600) | a patient (or a parent) between the visitor chairs |
| At the X-ray box | (−270, 0, 980) | explaining an X-ray |
| On the scale | (385, 0, 1010) | a weigh-in |
| By the growth chart | (420, 0, 930) | "look how tall you are!" |
| At the sink | (−385, 0, 980) | washing hands |
| Reading the eye chart | (150, 0, 480) | |
| By the exam table | (−40, 0, 200) | a patient at the table, in the exam view |
| Head of the exam table | (−250, 0, 110) | Dr. Sami examining |
| Kids corner | (330, 0, 330) | |
| By the window | (400, 0, 570) | |
| Doorway | (−420, 0, 885) | arriving or leaving |

## Camera presets

In the studio's location browser (click one, then **Copy camera**; **⇄ Reverse** turns any camera around), or `node render.mjs --location=sami_clinic --character=sami`:
- **Desk · wide from the exam table** `{ x: 0, y: 165, z: 280, f: 650, hy: 560, dir: 1 }`: establishing
- **Desk · medium** `{ x: 0, y: 140, z: 580, f: 1000, hy: 570, dir: 1 }`: Dr. Sami at his desk, X-ray box and eye chart behind
- **Desk · close** `{ x: 0, y: 140, z: 700, f: 1100, hy: 590, dir: 1 }`
- **Desk · X-ray box** `{ x: -230, y: 160, z: 700, f: 1000, hy: 660, dir: 1 }`
- **Desk · eye chart** `{ x: 160, y: 165, z: 720, f: 1000, hy: 660, dir: 1 }`
- **Desk · scale and growth chart** `{ x: 250, y: 140, z: 650, f: 950, hy: 590, dir: 1 }`
- **Desk · sink** `{ x: -300, y: 140, z: 700, f: 1000, hy: 600, dir: 1 }`
- **Exam · from the desk** `{ x: 0, y: 175, z: 1070, f: 650, hy: 520, dir: -1 }`: the whole room, over Dr. Sami's shoulder
- **Exam · medium** `{ x: -40, y: 140, z: 620, f: 1000, hy: 580, dir: -1 }`: exam table, monitor, mobile
- **Exam · table close** `{ x: -60, y: 130, z: 480, f: 1000, hy: 600, dir: -1 }`
- **Exam · heart monitor** `{ x: 150, y: 175, z: 520, f: 1000, hy: 660, dir: -1 }`
- **Exam · kids corner** `{ x: 250, y: 130, z: 640, f: 1000, hy: 600, dir: -1 }`
- **Exam · window** `{ x: 200, y: 150, z: 980, f: 850, hy: 560, dir: -1 }`

## API (`sami_clinic.js`)

```js
samiClinic.back(P, t, { splitZ, bpm, curtain, blinds, xray })   // everything farther than splitZ
samiClinic.front(P, t, { splitZ, toZ, bpm, curtain, blinds })   // pieces nearer than splitZ (and farther than toZ, if given)
samiClinic.MARK, .spots, .cameras, .DESK, .XRAY, .EXAM, .MON, .TRACK, .SCALE, .SINK, .FRONT, .CEIL
```

- **Heartbeat:** `bpm` (default 72) sets the heart monitor's ECG trace, its beating heart and number, and the heart model on the desk. Raise it for excitement (a sugar rush!), or pass 0 to switch the monitor off. Pass the same value to `back` and `front`.
- **Privacy curtain:** `curtain` from 0 to 1 (default 0) draws the curtain from the left wall across the exam table. Animate it with `ease(seg(t, t0, t0 + 1))` for a reveal. Pass it to both.
- **Blinds:** `blinds` from 0 (shut) to 1 (open; default .75).
- **X-ray:** `xray(t)` replaces the chest X-ray with your own picture. The origin is the light box's top-left, in world units, with y pointing down, and the content is clipped to the 200 × 130 box. For example, a swallowed coin:
  `xray: t => { X.fillStyle = '#16222C'; X.fillRect(40, 8, 120, 116); X.fillStyle = '#FFE9A8'; X.beginPath(); X.arc(100, 70, 12, 0, 7); X.fill(); }`
- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, exactly as in the lecture hall's README.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `sami_clinic.js` | the 3D set, its spots and camera presets |
