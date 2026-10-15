# Professor Safadi's study

> Professor Safadi's study at home: a big partners desk with a lamp, laptop, Newton's cradle and a mug of tea under a chalkboard full of primes; a crackling fireplace between built-in bookcases, two leather armchairs over a chess table, a library ladder, a globe and a grandfather clock.

## Description

Where the professor thinks. It is a warm, wood-panelled room with deep green walls, a beamed ceiling and a lot of books. Everything in it is slightly too tidy, except the chalkboard.
- **Front (the desk end):** a big two-pedestal **partners desk** with a leather blotter. On it are a brass **desk lamp**, a **laptop** (from the desk view you see the lid with a light-bulb sticker; from behind the desk you see tonight's PRIMES slide), a pile of books, a stack of papers with a red pen, a pen cup, a **mug of tea** marked ?! (steaming: a Safadi Energy Drink) and a **Newton's cradle** that clicks back and forth. Behind the desk stands a tufted oxblood **desk chair**.
- **Front wall:** a framed **chalkboard** with a chalk ledge and eraser. It shows ζ(s) = Σ 1/nˢ, the first primes, *Re(s) = ½ ?* in gold chalk and a rising π(x) graph in glowing cyan. Three framed **diplomas** hang either side, with a Prof. Safadi nameplate.
- **Front corners:** a **grandfather clock** on the left (the hands keep scene time; the pendulum swings once a second) and a big leafy **plant** on the right.
- **Left wall:** floor-to-cornice **bookcases** of gilt-banded books, with a brass rail and a rolling **library ladder**. A **globe** on a tripod stand turns slowly in front of them.
- **Right wall:** a wide **window** onto the garden trees, with red velvet curtains tied back under a pelmet. It's afternoon by default, or a starry night with a crescent moon. The panelled **door** is nearer the desk.
- **Back wall (the fireside):** a stone **fireplace** with a crackling fire, sparks and a fire screen. On the mantel are two candles, a family photo, a trophy, an hourglass and a landscape photo. Above it hangs a painting of a **golden spiral** over a calm sea. Built-in **bookcases** stand either side.
- **Fireside:** two leather **club armchairs** face each other across a pedestal **chess table** with a game in progress, on a red and navy **rug** with a gold medallion.
- **Ceiling:** dark wooden beams and a brass **pendant lamp** over the rug.
- **Floor:** honey-brown planks.

**Mood:** warm, scholarly, cosy. A good place to *explain* something.

## Two views

Like the science room, the study is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same spots work either way.

| View | Camera | Sees |
|---|---|---|
| **Desk view** | `dir: 1` (the default), from the fireside looking toward +Z | desk, chalkboard, diplomas, grandfather clock, plant. Use it for Safadi at his desk. |
| **Fireside view** | `dir: -1` (the reverse angle), from behind the desk looking back toward −Z | fireplace and mantel, the painting, the back bookcases, the armchairs and chess table, the rug. Use it for visitors, or for a fireside chat. |

Character rigs always face the camera. In the reverse view +X is on screen-left, so the window is on the left and the long bookcases and ladder are on the right.

## Layout (world units; a person is about 170 tall)

X is right when facing the desk, Y is up (the floor is Y = 0), and Z runs from the back (fireplace) wall to the front (chalkboard) wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±450 · back wall Z = 0 · front wall Z = 1100 · ceiling Y 340 · wainscot panelling to Y 110 |
| Desk | X −220…220, Z 760–860, top Y 78 |
| Desk chair | X −45…45, Z 985–1050, back 150 tall |
| Chalkboard | X −250…250, Y 130…290 (front wall); diplomas either side |
| Grandfather clock | X −435…−345, Z 1045–1100, 240 tall |
| Plant | (385, 1050) |
| Left-wall bookcases | Z 150–950, 45 deep, 320 tall; ladder at Z 560 |
| Globe | (−320, 690) |
| Window | right wall, Z 380–760, Y 110…300; curtains either side |
| Door | right wall, Z 860–990, 220 tall |
| Fireplace | X −150…150, Z 0–40, 150 tall; mantel at Y 150 (X ±175, out to Z 58); hearth slab to Z 100 |
| Back bookcases | X −440…−190 and 190…440, Z 0–38, 280 tall |
| Armchairs | X −275…−185 and 185…275, Z 215–305 |
| Chess table | (0, 270), top Y 56 |
| Rug | X −300…300, Z 230–700 |
| Pendant lamp | (0, 250, 470) |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| At the desk (`safadiStudy.MARK`) | (0, 0, 930) | Safadi behind the desk: chest and head show above it |
| In front of the desk | (0, 0, 650) | a visitor at the desk, full body |
| At the chalkboard | (300, 0, 990) | |
| By the grandfather clock | (−300, 0, 980) | |
| By the globe | (−250, 0, 620) | |
| Middle of the rug | (0, 0, 480) | |
| Beside the left / right armchair | (∓230, 0, 370) | the fireside chat |
| At the fireplace | (0, 0, 150) | |
| By the bookcases | (−330, 0, 480) | |
| By the window | (340, 0, 570) | |
| Doorway | (370, 0, 925) | arriving or leaving |

## Camera presets

In the studio's location browser (click one, then **Copy camera**; **⇄ Reverse** turns any camera around), or `node render.mjs --location=safadi_study --character=safadi`:
- **Desk · wide from the fire** `{ x: 0, y: 165, z: 60, f: 650, hy: 560, dir: 1 }`: establishing, over the chess table
- **Desk · medium** `{ x: 0, y: 140, z: 560, f: 1000, hy: 570, dir: 1 }`: Safadi at his desk, chalkboard behind
- **Desk · close** `{ x: 0, y: 140, z: 690, f: 1100, hy: 590, dir: 1 }`
- **Desk · chalkboard** `{ x: 0, y: 175, z: 520, f: 900, hy: 700, dir: 1 }`: tilted up for the board
- **Desk · grandfather clock** `{ x: -260, y: 150, z: 660, f: 1000, hy: 600, dir: 1 }`
- **Desk · bookcase side** `{ x: -250, y: 150, z: 240, f: 800, hy: 560, dir: 1 }`: along the bookcases and ladder to the desk
- **Fireside · from the desk** `{ x: 0, y: 175, z: 1070, f: 650, hy: 520, dir: -1 }`: the whole room, over Safadi's shoulder
- **Fireside · medium** `{ x: 0, y: 140, z: 720, f: 1000, hy: 580, dir: -1 }`: fireplace, armchairs and chess table
- **Fireside · mantel** `{ x: 0, y: 165, z: 470, f: 1000, hy: 640, dir: -1 }`
- **Fireside · left / right armchair** `{ x: ∓120, y: 130, z: 640, f: 1000, hy: 600, dir: -1 }`
- **Fireside · window** `{ x: 200, y: 150, z: 900, f: 850, hy: 560, dir: -1 }`: the curtained window on the left, the fire ahead
- **Fireside · bookcases and ladder** `{ x: -300, y: 150, z: 900, f: 800, hy: 560, dir: -1 }`

## API (`safadi_study.js`)

```js
safadiStudy.back(P, t, { splitZ, fire, lamp, night, cradle, board })   // everything farther than splitZ
safadiStudy.front(P, t, { splitZ, toZ, fire, lamp, night, cradle })    // pieces nearer than splitZ (and farther than toZ, if given)
safadiStudy.MARK, .spots, .cameras, .BOARD, .DESK, .CLOCK, .FIRE, .MANTEL, .ARM, .RUG, .FRONT, .CEIL
```

- **Fire:** `fire` from 0 to 1 (default 1) scales the flames, sparks and the firelight on the floor. Pass 0 for a cold hearth, or animate it for "light the fire". Pass the same value to `back` and `front`.
- **Lamps:** `lamp` from 0 to 1 (default .6) is the glow of the desk lamp, the pendant and the mantel candles (0 blows the candles out). Pass it to both.
- **Night:** `night` from 0 to 1 (default 0) turns the window from an afternoon garden into a starry night with a crescent moon. Animate it for "it got late". It pairs well with `lamp: 1`.
- **Newton's cradle:** `cradle: false` stops it, for a quiet moment (or a "the cradle stops" beat).
- **Tea:** `tea: false` stops the steam from the mug (the tea has gone cold: a "worked all night" beat).
- **Chalkboard:** `board(t)` replaces the prime-number board with your own chalk. The origin is the board's top-left, in world units, with y pointing down, and the content is clipped to the 500 × 160 board. For example:
  `board: t => { X.font = '600 44px ' + FONT_TALK; X.fillStyle = '#FFFDF4'; X.fillText('Why is the sky blue?', 30, 90); }`
- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, exactly as in the lecture hall's README.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `safadi_study.js` | the 3D set, its spots and camera presets |
