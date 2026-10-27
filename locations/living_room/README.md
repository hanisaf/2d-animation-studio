# Living room

> The family living room inside the red-brick [house](../house/README.md): a blue sofa under the family portrait, a big TV over the game console, shelves of board games, a curtained window, an archway to the hall and the stairs, and a ceiling fan. Day, TV on, or evening.

## Description

The room where the family hangs out. It has warm cream walls over a sage-green wainscot, white trim, a honey-oak plank floor and a big terracotta-and-navy rug with a cream medallion.
- **Front (the TV wall):** a big flat-screen **TV** on the wall over a long wooden **media console**, with a game console, two controllers (one black, one coral), a vase of flowers and a family photo. The TV can be off (dark glass with a reflection), on (a cartoon dolphin leaping over the waves) or show your own picture (`tv(t)`).
- **Front corners:** on the right, white **board-game shelves** with *Crazy Dolphins*, *Oligarchy*, *Rainbow Race*, Chess and a puzzle stacked on the bottom shelf, rows of books, a photo, a vase and a FAMILY GAME NIGHT sign. On the left, a **fiddle-leaf fig** in a terracotta pot and a **floor lamp**.
- **Left wall:** a wide three-pane **window** onto the garden trees, with long mustard curtains on a wooden rod. In front of it stands a coral **armchair** with a navy cushion.
- **Right wall:** an arched **opening to the hall**, where you can see the **stairs** going up with their banister, and the white **front door** with a glass panel. Further along is a **gallery of family photos**.
- **Back wall (the sofa end):** a long blue three-seat **sofa** with mustard and coral cushions and a folded throw, under a gold-framed **family portrait** (four smiling faces) and HOME SWEET HOME, between two wall **sconces**. There's a **side table** with a lamp and a mug at the left end of the sofa and a **floor lamp** at the right.
- **Middle:** a wooden **coffee table** with a fruit bowl, the TV remote and magazines on top, and a stack of board games on the shelf underneath.
- **Ceiling:** a wooden **ceiling fan** that turns.

**Mood:** warm, homey and a little cluttered. It's the place for family game night, or for a fight over the TV.

## Two views

| View | Camera | Sees |
|---|---|---|
| **TV view** | `dir: 1` (the default), from the sofa looking toward +Z | the TV and console, the game shelves, the plant and floor lamp, the window and armchair (left), the archway and photos (right), the rug and coffee table |
| **Sofa view** | `dir: -1`, from the TV looking back toward −Z | the sofa under the family portrait, the sconces, the side table and floor lamp, the archway with the stairs (screen-left), the window and armchair (screen-right) |

Character rigs always face the camera. In the reverse view +X is on screen-left.

## Options

Pass the same options to `back()` and `front()`:
- **TV:** `tv: false` (off; the default), `tv: true` (a cartoon), or `tv: t => { … }` to draw your own picture. Your function draws in TV units: the origin is the screen's top-left, y points down, and the content is clipped to `livingRoom.TV.w × TV.h` (250 × 140). When the TV is on, its light spills onto the wall. For example, a video game:
  `tv: t => { X.fillStyle = '#10161F'; X.fillRect(0, 0, 250, 140); X.fillStyle = '#7CFF9B'; X.fillRect(20 + 80 * frac(t), 100, 30, 10); }`
- **Lamps:** `lamp` from 0 to 1 (default .5) sets the glow of the floor lamps, the sconces and the table lamp.
- **Night:** `night` from 0 to 1 (default 0) turns the window (and the glass in the front door) from an afternoon garden into a starry night.
- **Fan:** `fan: false` stops the ceiling fan.

The studio's **Version** chips are Day, TV on and Evening (`night: 1, lamp: 1, tv: true`).

## Layout (world units; a person is about 170 tall)

X is right when facing the TV, Y is up (the floor is Y = 0), and Z runs from the back (sofa) wall to the front (TV) wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±450 · back wall Z = 0 · front wall Z = 1000 · ceiling Y 290 · chair rail Y 95 |
| TV | X −125…125, Y 120…260 (front wall) |
| Media console | X −200…200, Z 950–1000, top Y 52 |
| Board-game shelves | X 250…440, Z 955–1000, 230 tall |
| Plant / floor lamp (TV end) | (−400, 930) / (−340, 960) |
| Sofa | X −220…220, Z 30–135, seat Y 44, back Y 98 |
| Side table / floor lamp (sofa end) | (−280, 40–96) / (290, 70) |
| Coffee table | X −110…110, Z 300–380, top Y 38 |
| Rug | X −270…270, Z 190–640 |
| Window | left wall, Z 420–760, Y 100…250 |
| Armchair | X −430…−330, Z 560–680 |
| Archway to the hall | right wall, Z 140–400, 230 tall; stairs and front door behind it |
| Ceiling fan | (0, 520) |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Middle of the rug (`livingRoom.MARK`) | (0, 0, 470) | |
| On the sofa · left / middle / right | (−130 / 0 / 130, 44, 90) | sitting on the sofa (sofa view) |
| In front of the sofa | (0, 0, 220) | |
| In front of the TV | (0, 0, 820) | blocking the TV (sofa view) |
| By the game shelves | (300, 0, 860) | picking a game |
| By the window | (−330, 0, 480) | |
| In the archway | (400, 0, 270) | arriving or leaving |

## Camera presets

In the studio's location browser (click one, then **Copy camera**), or `node render.mjs --location=living_room [--variant=Evening]`:
- **TV · wide from the sofa** `{ x: 0, y: 165, z: 120, f: 620, hy: 560, dir: 1 }`: establishing, over the coffee table
- **TV · medium** `{ x: 0, y: 130, z: 480, f: 900, hy: 590, dir: 1 }`: the TV, the console and the shelves
- **TV · game shelves** `{ x: 230, y: 140, z: 620, f: 1000, hy: 600, dir: 1 }`
- **TV · window and armchair** `{ x: -150, y: 140, z: 250, f: 700, hy: 560, dir: 1 }`
- **Sofa · wide from the TV** `{ x: 0, y: 170, z: 960, f: 620, hy: 540, dir: -1 }`: the whole room
- **Sofa · medium** `{ x: 0, y: 125, z: 700, f: 900, hy: 590, dir: -1 }`: the family on the sofa
- **Sofa · close** `{ x: 0, y: 110, z: 400, f: 1000, hy: 620, dir: -1 }`
- **Sofa · archway** `{ x: 160, y: 140, z: 760, f: 800, hy: 570, dir: -1 }`: the stairs on the left

## API (`living_room.js`)

```js
livingRoom.back(P, t, { splitZ, lamp, night, fan, tv })       // everything farther than splitZ
livingRoom.front(P, t, { splitZ, toZ, lamp, night, fan, tv })  // pieces nearer than splitZ (and farther than toZ, if given)
livingRoom.MARK, .TV, .CONSOLE, .SHELF, .SOFA, .TABLE, .RUG, .WIN, .ARM, .ARCH, .props
```

- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, as in [Alma's bedroom](../alma_bedroom/README.md).
- **Props:** `livingRoom.props` exports the small props (`plant`, `floorLamp`, `tableLamp`, `gameConsole`, `controller`, `remote`, `fruitBowl`, `magazines`, `mug`, `frame`, `vase`), drawn in sprite space (world units, y down, origin under the prop) with an outline width in px, for example `livingRoom.props.controller(1.2, '#2A2D33')`.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `living_room.js` | the 3D set, its props, spots, camera presets and the Day / TV on / Evening versions |
