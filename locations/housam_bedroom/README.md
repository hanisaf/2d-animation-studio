# Housam's bedroom

> Housam's soccer-and-maths room: a navy bed with a soccer-ball duvet under his framed #10 jersey, a soccer-pitch rug, a mini goal under the window, shelves of trophies, a desk with his laptop under a whiteboard of trajectories, and a GENIUS AT WORK sign on the door. Tidy, messy, or at night.

## Description

Where [Housam](../../characters/housam/README.md) sleeps, studies and practises. It has pale sky-blue walls with a navy racing stripe, white skirting and a honey-wood floor. It's built like [Alma's bedroom](../alma_bedroom/README.md), so the two rooms cut together.
- **Front (the bed end):** a navy **bed** with a blue duvet printed with white soccer balls, a white pillow and a plush ball on it, and a navy footboard with a big **10**. Above it is his framed **#10 HOUSAM jersey** between a **DOVES** pennant and a **GOAL!** pennant. On the white **nightstand** are a soccer-ball **clock** (its second hand keeps scene time) and a red book.
- **Left wall:** a **window** onto the trees with a navy blind half up, and a white **mini goal** under it with two balls in the net. Nearer the bed are two shelves of **trophies** (gold, silver and bronze) with three **medals** hanging below.
- **Right wall:** a white **desk** with navy legs and drawers. On it are his **laptop** (the lid with the orange Clawd sticker, glowing when it's on), a desk lamp, a pencil cup, a **Rubik's cube** and a stack of books. A blue-and-red **gaming chair** stands at the desk. Above the desk hangs a **whiteboard** of his kind of maths: the parabola of a kicked ball with θ, *h max* and GOAL!, *x² + y² = r²* and *v = d / t*, with three markers on the tray. Further along is a tall navy **wardrobe** with a ball on top.
- **Back wall (the door end):** the white **door** with a yellow **GENIUS AT WORK** sign, a **PRACTICE MAKES PERFECT** stadium poster with floodlights, a white **chest of drawers** with navy drawers (a ball and a pair of cleats on top) and a wicker **laundry hamper**.
- **Middle:** a **soccer-pitch rug**: mown stripes, touchlines, a halfway line, a centre circle and two goal boxes.
- **Ceiling:** a **soccer-ball pendant lamp**.

**Mood:** sporty, clever and a bit competitive. A good place to make a plan, or to code something that goes wrong.

## Tidy and messy

**`messy`** (0..1) is passed to `back()` and `front()`. At 0 (the default) the room is tidy. As it rises, the mess builds up piece by piece (each piece has its own threshold), so animating 0 → 1 is a "the room gets wrecked" beat and 1 → 0 is "tidy-up time". At 1 there are balls, cleats, socks, jerseys (#10 and #7), crumpled maths homework, a worksheet, books and the Rubik's cube on the floor, a jersey and a sock on the bed, a sock on the hamper, and the duvet kicked down the bed.

## Two views

| View | Camera | Sees |
|---|---|---|
| **Bed view** | `dir: 1` (the default), from the door looking toward +Z | the bed under the jersey and pennants, the nightstand, the window, the mini goal and the trophies (left), the desk, whiteboard, gaming chair and wardrobe (right), the pitch rug |
| **Door view** | `dir: -1`, from the foot of the bed looking back toward −Z | the door with its sign, the stadium poster, the chest of drawers, the hamper, the desk and whiteboard (screen-left), the window and goal (screen-right) |

## Options

- **Mess:** `messy` from 0 to 1 (see above).
- **Lamps:** `lamp` from 0 to 1 (default .5) sets the glow of the soccer-ball lamp, the desk lamp and the laptop.
- **Night:** `night` from 0 to 1 turns the window to a starry night.
- **Laptop:** `laptop: false` closes it.
- **Whiteboard:** `board(t)` replaces the maths with your own drawing. The origin is the board's top-left, in world units, with y pointing down, and the content is clipped to `housamBedroom.BOARD.w × BOARD.h` (200 × 110). It's drawn onto the side wall in perspective.

The studio's **Version** chips are Tidy, Messy and Night.

## Layout (world units; a person is about 170 tall, Housam about 168)

X is right when facing the bed, Y is up (the floor is Y = 0), and Z runs from the door wall to the bed wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±340 · back (door) wall Z = 0 · front (bed) wall Z = 880 · ceiling Y 280 · navy stripe Y 118…134 |
| Bed | X −115…105, Z 670–872, mattress top Y 48 |
| Nightstand | X 130…190, Z 810–870, top Y 52 |
| Rug (pitch) | X −150…150, Z 250–630 |
| Window | left wall, Z 260–520, Y 105…235 |
| Mini goal | X −340…−285, Z 290–490, 70 tall |
| Trophy shelves | left wall, Z 580–820, Y 150 and 200 |
| Desk / gaming chair | desk X 250…340, Z 300–520, top Y 72 · chair X 195…240, Z 375–445 |
| Whiteboard | right wall, Z 310–510, Y 115…225 |
| Wardrobe | X 270…340, Z 600–830, 230 tall |
| Chest of drawers / hamper | X −300…−150, Z 0–50 / (−100, 30) |
| Door | back wall, X 170…270, 205 tall |
| Ceiling lamp | (0, 220, 450) |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Centre circle (`housamBedroom.MARK`) | (0, 0, 440) | full body on the rug |
| Sitting on the bed | (−5, 48, 770) | |
| At the desk | (205, 0, 410) | at the laptop |
| In the mini goal | (−290, 0, 390) | a keeper |
| By the trophies | (−250, 0, 700) | showing off |
| By the window | (−240, 0, 330) | |
| By the wardrobe | (210, 0, 700) | |
| Doorway | (220, 0, 50) | arriving or leaving |

## Camera presets

In the studio's location browser (click one, then **Copy camera**), or `node render.mjs --location=housam_bedroom [--variant=Messy]`:
- **Bed · wide from the door** `{ x: 0, y: 165, z: 30, f: 620, hy: 560, dir: 1 }`: establishing, the whole room
- **Bed · medium** `{ x: 0, y: 120, z: 250, f: 900, hy: 590, dir: 1 }`: Housam on the rug, the bed and jersey behind
- **Desk and whiteboard** `{ x: 60, y: 140, z: 200, f: 900, hy: 580, dir: 1 }`
- **Trophies and goal** `{ x: -100, y: 130, z: 200, f: 800, hy: 570, dir: 1 }`
- **Floor · ball's-eye** `{ x: 0, y: 30, z: 150, f: 760, hy: 470, dir: 1 }`: down on the pitch
- **Door · from the bed** `{ x: 0, y: 170, z: 660, f: 620, hy: 540, dir: -1 }`: the whole room from the foot of the bed
- **Door · medium** `{ x: 40, y: 130, z: 420, f: 900, hy: 590, dir: -1 }`: the door, poster and drawers

## API (`housam_bedroom.js`)

```js
housamBedroom.back(P, t, { splitZ, messy, lamp, night, laptop, board })        // everything farther than splitZ
housamBedroom.front(P, t, { splitZ, toZ, messy, lamp, night, laptop, board })  // pieces nearer than splitZ (and farther than toZ, if given)
housamBedroom.MARK, .BED, .DESK, .BOARD, .GOAL, .WARD, .RUG, .CHAIR, .props
```

- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, as in [Alma's bedroom](../alma_bedroom/README.md).
- **Props:** `housamBedroom.props` exports `ball`, `trophy`, `medal`, `cleats`, `sock`, `jersey`, `paper`, `book`, `laptop`, `rubik`, `deskLamp`, `clock` and `pencilCup`, drawn in sprite space (world units, y down, origin under the prop) with an outline width in px, for example `housamBedroom.props.trophy(1.2, '#F2C440')`.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `housam_bedroom.js` | the 3D set, its props, spots, camera presets and the Tidy / Messy / Night versions |
