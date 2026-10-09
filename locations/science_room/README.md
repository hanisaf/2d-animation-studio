# Science room

> The DCES science room: a demo bench with a bubbling flask, whiteboard and periodic table at the front; six lab benches with stools; a skeleton, fume hood, aquarium and a solar-system mobile.

## Description

A bright elementary-school science lab on a sunny day. It is the kind of room where an experiment is always about to go *almost* right.
- **Front (teacher's end):** a long teal **demo bench** with a black top and an atom badge on the front. On it are a microscope, a ring stand holding a round-bottom flask of green liquid over a **Bunsen burner** (the flame flickers, the liquid bubbles and steams), a beaker, a rack of test tubes, a purple Erlenmeyer flask, and a sink with a gooseneck tap. Behind it, the front wall has a **whiteboard** with a marker tray, a **periodic table** poster, coloured **S·C·I·E·N·C·E** letter cards, a clock that ticks with scene time, an atom poster and a LAB RULES sign.
- **Front corners:** a glass-fronted **specimen cabinet** full of coloured jars on the left, with **Mr. Bones** the classroom skeleton on his stand in front of it (he sways a little and waves one hand). A **fume hood** on the right has a fizzing green experiment venting upward.
- **Student area:** three rows of two **lab benches** (teal cabinets, black tops, brass gas taps) with two coloured stools behind each. Each bench has its own experiment: a test-tube rack, a microscope, a baking-soda **volcano** that oozes and spits, flasks and beakers, rock samples with a magnifier, a potted plant. Goggles lie about.
- **Walls:** three big windows on the right look out on the schoolyard trees, above a windowsill counter with a row of **bean sprouts** growing taller from cup to cup. On the left are the door (with a room sign), a cork **bulletin board** of pinned class work, a yellow GOGGLES ON safety poster, and a counter with a **globe** and an **aquarium** (fish swim, weed sways, bubbles rise).
- **Back wall (butter-yellow):** shelves of jars and books, an **OUR SOLAR SYSTEM** poster under a STAY CURIOUS! banner, a row of little lab coats and goggles on hooks, and trash and recycling bins.
- **Ceiling:** light panels and a **solar-system mobile** over the middle of the room. The planets orbit slowly on their strings.
- **Floor:** cream and sage checkerboard tiles.

**Mood:** cheerful, curious, slightly chaotic. Everything bubbles.

## Two views

Like the lecture hall, the room is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same spots work either way.

| View | Camera | Sees |
|---|---|---|
| **Teacher view** | `dir: 1` (the default), among the benches looking toward +Z | demo bench, whiteboard, periodic table, cabinet, Mr. Bones, fume hood. Use it for the teacher. |
| **Classroom view** | `dir: -1` (the reverse angle), from the front looking back toward −Z | the lab benches and stools, windows, aquarium, back wall. Use it for the students. |

Character rigs always face the camera, so show students standing at their benches in the classroom view. In the reverse view +X is on screen-left: the windows are on the left and the aquarium on the right.

## Layout (world units; a person is about 170 tall)

X is right when facing the whiteboard, Y is up (the floor is Y = 0), and Z runs from the back wall to the front wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±560 · back wall Z = 0 · front wall Z = 1400 · ceiling Y 360 |
| Student benches | rows n = 1…3 (1 = front), bench Z `860 − 270·(n−1) − 80` … `860 − 270·(n−1)`, X −470…−110 and 110…470, top Y 72; stools at Z front − 150 |
| Centre aisle | X −110…110 |
| Demo bench | X −300…300, Z 1080–1160, top Y 80; sink at X 200…280 |
| Whiteboard | X −340…340, Y 85…235 (front wall); periodic table above it, X −125…125 |
| Specimen cabinet | X −545…−370, Z 1330–1400, 250 tall |
| Mr. Bones | X −440, Z 1250 |
| Fume hood | X 350…545, Z 1300–1400, 250 tall |
| Windows | right wall, Z 250–450, 550–750, 850–1050, Y 100…300; windowsill counter Z 180–1120, 86 tall |
| Door | left wall, Z 1170–1290, 215 tall |
| Bulletin board / safety poster | left wall, Z 480–960 / 290–420 |
| Left counter, aquarium, globe | Z 220–1000 (86 tall); tank Z 600–800; globe Z 330 |
| Back shelves | X −545…−230, Z 0–45, 270 tall |
| Solar-system mobile | centred on X 0, Z 620, bodies at Y 250…290 |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Demo bench (`scienceRoom.MARK`) | (0, 0, 1230) | the teacher behind the bench: chest and head show above it |
| In front of the demo bench | (0, 0, 960) | full body, presenting to the class |
| At the whiteboard | (−200, 0, 1320) | writing on the board |
| At the fume hood | (430, 0, 1220) | |
| By Mr. Bones | (−330, 0, 1250) | |
| Bench 1 · left / right, Bench 2 · left / right, Bench 3 · center-left | `scienceRoom.bench(n, x)` | a student standing behind a lab bench: the bench hides the legs |
| Center aisle | (0, 0, 560) | walking between the benches |
| Doorway | (−470, 0, 1230) | arriving or leaving |
| By the window / By the aquarium | (±430, 0, 700) | |

## Camera presets

In the studio's location browser (click one, then **Copy camera**; **⇄ Reverse** turns any camera around), or `node render.mjs --location=science_room --character=safadi`:
- **Teacher · wide from the back** `{ x: 0, y: 165, z: 40, f: 700, hy: 560, dir: 1 }`: establishing
- **Teacher · medium** `{ x: 0, y: 135, z: 900, f: 1000, hy: 560, dir: 1 }`: the teacher behind the demo bench, whiteboard behind
- **Teacher · demo close** `{ x: -130, y: 125, z: 980, f: 1000, hy: 560, dir: 1 }`: the bubbling flask and burner
- **Teacher · whiteboard** `{ x: 0, y: 160, z: 760, f: 900, hy: 680, dir: 1 }`: tilted up for the board
- **Teacher · fume hood** `{ x: 330, y: 140, z: 960, f: 1000, hy: 600, dir: 1 }`
- **Teacher · Mr. Bones** `{ x: -420, y: 130, z: 900, f: 1000, hy: 600, dir: 1 }`: skeleton, cabinet and door
- **Classroom · from the board** `{ x: 0, y: 175, z: 1370, f: 700, hy: 520, dir: -1 }`: the whole class, over the demo bench
- **Classroom · bench 1 left / right** `{ x: ∓290, y: 125, z: 1040, f: 1000, hy: 600, dir: -1 }`: a student at a front bench
- **Classroom · bench 2 (over the front row)** `{ x: 0, y: 190, z: 980, f: 1000, hy: 470, dir: -1 }`
- **Classroom · back benches** `{ x: 150, y: 130, z: 720, f: 1000, hy: 580, dir: -1 }`
- **Classroom · aquarium** `{ x: -360, y: 150, z: 1020, f: 1000, hy: 600, dir: -1 }`
- **Classroom · back wall** `{ x: 0, y: 165, z: 560, f: 900, hy: 560, dir: -1 }`

## API (`science_room.js`)

```js
scienceRoom.back(P, t, { splitZ, bubbling, bones, rows, board })   // everything farther than splitZ
scienceRoom.front(P, t, { splitZ, toZ, bubbling, bones, rows })    // pieces nearer than splitZ (and farther than toZ, if given)
scienceRoom.bench(n, x = 0)                           // → { x, y, z }: a student standing behind lab bench row n (1 = front)
scienceRoom.benchFront(n)                             // a bench row's front edge Z (the side facing the teacher)
scienceRoom.MARK, .spots, .cameras, .WB, .DEMO, .HOOD, .CAB, .HW, .FRONT, .CEIL, .BENCH_H
```

- **Experiments:** `bubbling` from 0 to 1 (default 1) scales the Bunsen flame, the bubbles, the steam, the fume-hood fizz and the volcano. Pass 0 for a calm room, or animate it for a "light the burner" moment. Pass the same value to `back` and `front`.
- **Mr. Bones:** `bones` from 0 to 1 makes the skeleton rattle on his stand (pass a `kick(t, t0)` when someone bumps him). Pass it to both `back` and `front`.
- **Clearing the floor:** `rows` (default 3) is how many student bench rows are drawn, counted from the back. `rows: 2` removes the front row and its stools, which opens up Z 600–1080 as a workshop floor (scene 18 builds Robo-Safadi there). Pass it to both `back` and `front`.
- **Whiteboard:** `board(t)` draws your own marker content. The origin is the board's top-left, in world units, with y pointing down, and the content is clipped to the 680 × 150 board. For example:
  `board: t => { X.font = '600 44px ' + FONT_TALK; X.fillStyle = '#2F5FB0'; X.fillText('H₂O', 40, 70); }`
- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, exactly as in the lecture hall's README.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `science_room.js` | the 3D set, its spots and camera presets |
