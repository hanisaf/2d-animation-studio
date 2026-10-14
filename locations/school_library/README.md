# School library

> The DCES school library: a circulation desk under the BOOK OF THE MONTH board, reading tables with green lamps, walls of bookcases, a sunny window seat, a rainbow story-corner rug with beanbags and a mural of a dragon reading in a tree.

## Description

The Dove Creek Elementary library on a bright afternoon. It's quiet, warm and a bit magical: sunbeams slant through the windows, dust motes drift in them, and every wall is full of books.
- **Front (librarian's end):** a long wooden **circulation desk** with a green CHECK OUT HERE sign and a RETURNS slot on the front. On top are a computer (from behind the desk you see the catalogue search screen), a pencil cup, a date stamp and ink pad, a stack of returned books and a **desk bell** that jumps when someone rings it. Behind it, the front wall has a cork **BOOK OF THE MONTH** board with pinned covers and "I loved it!" cards, coloured **L·I·B·R·A·R·Y** letter cards, a clock that ticks with scene time, a QUIET PLEASE sign and a navy WHOO'S READING? owl poster.
- **Front corners:** a wooden **card catalog** with rows of little drawers on the left. **Hoot**, the library's plush owl in a graduation cap, sits on top next to a potted plant, and he blinks now and then. On the right is a **NEW BOOKS!** face-out display, with a red rolling **book cart** in front of it.
- **Reading area:** two rows of two oak **reading tables**, each with a green banker's **lamp**, open books (a page turns over every few seconds) and book stacks. Each table has a coloured school chair on each long side.
- **Walls:** the left wall is one long run of tall **bookcases**, with a string of paper pennants above and the door (with a room sign) at the front. The right wall has three big **windows** onto the schoolyard trees. Under them is a low bookcase that doubles as a **window seat**, with cushions, and sunlight falls across the carpet in front of it.
- **Back wall (pale blue):** two tall bookcases under STORY CORNER and FICTION A–Z signs. Between them is the **READING IS AN ADVENTURE!** mural: a big tree with a little green dragon curled on a branch reading a book while letters float up out of it.
- **Story corner (back left):** a round **rainbow rug** with three **beanbags**. Yellow **picture-book bins** with face-out books are on the back right.
- **Ceiling:** light panels and two strings of colourful **bunting** that sway a little.
- **Floor:** blue carpet squares.

**Mood:** cosy, hushed, sunlit. A place where stories start.

## Two views

Like the science room, the library is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same spots work either way.

| View | Camera | Sees |
|---|---|---|
| **Desk view** | `dir: 1` (the default), among the tables looking toward +Z | circulation desk, BOOK OF THE MONTH board, LIBRARY letters, card catalog and Hoot, NEW BOOKS display, book cart. Use it for the librarian. |
| **Reading-room view** | `dir: -1` (the reverse angle), from the desk looking back toward −Z | reading tables and lamps, back bookcases, mural, story corner, picture-book bins, window seat. Use it for the readers. |

Character rigs always face the camera, so put readers on the far side of a table from the camera: `table(n, x)` (the back side) in the reading-room view, `table(n, x, 1)` (the desk side) in the desk view. The table then hides their legs. In the reverse view +X is on screen-left: the windows are on the left and the long bookcases on the right.

## Layout (world units; a person is about 170 tall)

X is right when facing the desk, Y is up (the floor is Y = 0), and Z runs from the back wall to the front wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±600 · back wall Z = 0 · front wall Z = 1400 · ceiling Y 380 |
| Reading tables | rows n = 1…2 (1 = nearer the desk), table Z `900 − 300·(n−1) − 110` … `900 − 300·(n−1)`, X −450…−150 and 150…450, top Y 68; chairs 70 behind and 70 in front of each table |
| Centre aisle | X −150…150 |
| Circulation desk | X −280…280, Z 1080–1170, top Y 100 |
| BOOK OF THE MONTH board | X −280…280, Y 150…280 (front wall); LIBRARY letters above it |
| Card catalog (+ Hoot) | X −590…−440, Z 1320–1400, 130 tall |
| NEW BOOKS display | X 420…590, Z 1330–1400, 200 tall |
| Book cart | X 380…500, Z 1150–1210 |
| Left-wall bookcases | Z 140–1020, 48 deep, 240 tall |
| Door | left wall, Z 1130–1260, 215 tall |
| Windows | right wall, Z 220–440, 540–760, 860–1080, Y 130…320; window-seat shelf Z 180–1120, 100 tall |
| Back bookcases | X −590…−170 and 170…590, Z 0–44, 260 tall; mural X −160…160 between them |
| Story rug | centred X −340, Z 250, radius 150; beanbags around it |
| Picture-book bins | X 170…470, Z 190–250, 58 tall |
| Bunting | across the room at Z 420 and Z 820 |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Circulation desk (`schoolLibrary.MARK`) | (0, 0, 1240) | the librarian behind the desk: chest and head show above it |
| In front of the desk | (0, 0, 1010) | checking out a book, full body |
| By the card catalog | (−380, 0, 1260) | |
| By the book cart | (330, 0, 1180) | |
| Table 1 · left / right, Table 2 · left / right | `schoolLibrary.table(n, x)` | a reader behind a table in the reading-room view: the table hides the legs |
| Table 1 · left / right (desk side) | `schoolLibrary.table(n, x, 1)` | a reader behind a table in the desk view |
| Center aisle | (0, 0, 700) | walking between the tables |
| Story corner | (−330, 0, 280) | on the rainbow rug |
| Picture-book bins | (320, 0, 320) | |
| By the windows / By the bookcases | (470, 0, 650) / (−470, 0, 640) | |
| Doorway | (−500, 0, 1195) | arriving or leaving |

## Camera presets

In the studio's location browser (click one, then **Copy camera**; **⇄ Reverse** turns any camera around), or `node render.mjs --location=school_library --character=safadi`:
- **Desk · wide from the back** `{ x: 0, y: 170, z: 40, f: 700, hy: 560, dir: 1 }`: establishing
- **Desk · medium** `{ x: 0, y: 140, z: 880, f: 1000, hy: 560, dir: 1 }`: the librarian behind the desk, the board behind
- **Desk · close** `{ x: 0, y: 135, z: 1010, f: 1100, hy: 600, dir: 1 }`
- **Desk · board** `{ x: 0, y: 170, z: 760, f: 900, hy: 700, dir: 1 }`: tilted up for the BOOK OF THE MONTH board
- **Desk · card catalog** `{ x: -400, y: 130, z: 980, f: 1000, hy: 600, dir: 1 }`: Hoot, the catalog, the door
- **Desk · new books** `{ x: 380, y: 140, z: 960, f: 1000, hy: 600, dir: 1 }`: the display and the book cart
- **Tables · bookcase side** `{ x: -350, y: 150, z: 350, f: 900, hy: 560, dir: 1 }`: down the long bookcases to the desk
- **Reading room · from the desk** `{ x: 0, y: 180, z: 1370, f: 700, hy: 520, dir: -1 }`: the whole room, over the desk
- **Reading room · table 1 left / right** `{ x: ∓300, y: 125, z: 1050, f: 1000, hy: 600, dir: -1 }`: a reader at a front table
- **Reading room · over the tables** `{ x: 0, y: 200, z: 1000, f: 1000, hy: 470, dir: -1 }`
- **Reading room · story corner** `{ x: -200, y: 175, z: 560, f: 800, hy: 470, dir: -1 }`: the rug and beanbags
- **Reading room · picture books** `{ x: 200, y: 165, z: 560, f: 800, hy: 500, dir: -1 }`
- **Reading room · mural** `{ x: 0, y: 170, z: 620, f: 900, hy: 600, dir: -1 }`
- **Reading room · window seat** `{ x: 220, y: 140, z: 1080, f: 900, hy: 570, dir: -1 }`

## API (`school_library.js`)

```js
schoolLibrary.back(P, t, { splitZ, sun, lamps, ding, board })   // everything farther than splitZ
schoolLibrary.front(P, t, { splitZ, toZ, sun, lamps, ding })    // pieces nearer than splitZ (and farther than toZ, if given)
schoolLibrary.table(n, x = 0, side = -1)    // → { x, y, z }: a reader at table row n (1 = nearer the desk); side 1 = the desk side (for desk-view shots)
schoolLibrary.tableFront(n)                 // a table row's front edge Z (the side facing the desk)
schoolLibrary.MARK, .spots, .cameras, .BOARD, .DESK, .CAT, .NEWB, .CART, .FRONT, .CEIL, .TABLE_H
```

- **Sunlight:** `sun` from 0 to 1 (default 1) sets the sunbeams, the light on the carpet and the dust motes. Pass 0 for a grey day or after school, or animate it for clouds passing. Pass the same value to `back` and `front`.
- **Table lamps:** `lamps` from 0 to 1 (default .5) is the warm glow of the green banker's lamps. Pass it to both.
- **Desk bell:** `ding` from 0 to 1 makes the bell jump and ring. Pass a `kick(t, t0)` when someone taps it, to both `back` and `front`.
- **BOOK OF THE MONTH board:** `board(t)` replaces the pinned covers with your own content. The origin is the board's top-left, in world units, with y pointing down, and the content is clipped to the 560 × 130 board. For example:
  `board: t => { X.font = '600 40px ' + FONT_TALK; X.fillStyle = '#C0443F'; X.fillText('Dragon Tales', 120, 80); }`
- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, exactly as in the lecture hall's README.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `school_library.js` | the 3D set, its spots and camera presets |
