# Alma's bedroom

> Alma's cosy pink-and-white bedroom: a heart-headboard bed under ALMA bunting and fairy lights, a fluffy round rug, a toy chest under the window, a desk, wardrobe, bookshelf and a heart mirror. Tidy, or messy with toys everywhere, including plush Pearl and Neptune and Jester and Robo-Safadi action figures.

## Description

Where Alma lives when she isn't dancing (and where she dances anyway). Blush-pink striped walls over white wainscot, honey wood floor, white furniture with pink drawers and hearts on almost everything.
- **Front (the bed end):** a white **bed** with an arched **heart headboard**, a pink polka-dot **duvet**, a turned-down white sheet and two pillows, and a low scalloped **footboard**. Pink-and-white **nightstands** either side: a pink lamp on the left, a flower vase and a pink alarm clock on the right.
- **Front wall:** **fairy lights** draped in three loops, **A L M A** bunting in lilac, pink, white and mint, and two little framed pictures (a rainbow and a music note).
- **Left wall:** a **window** onto blue sky, clouds and treetops, with ruffled pink **curtains** tied back under a scalloped pelmet. Under it, a white **toy chest** with a pink lid and a heart.
- **Right wall:** an open white **bookshelf** full of colourful books, a white **desk** with pink legs and drawers (lamp, pencil cup, notebook) with a pink heart **chair**, a **corkboard** of Alma's drawings above it, and a tall white **wardrobe** with pink door panels.
- **Back wall (the door end):** the white **door** with a pink ALMA heart sign, a purple **DANCE!** poster with a light-up dance floor (her super dance powers), and a pink **dresser** under a **heart mirror**, with a music box and flowers on top.
- **Middle:** a round, scalloped, fluffy **rug**: pink, white and blush with a ring of hearts.
- **Ceiling:** a pink paper **lantern** and glow-in-the-dark stars.

**Mood:** soft, sweet, a little girly-pop. A safe place: good for bedtime, a secret plan, or a dance break.

## Tidy and messy

The room has two versions, chosen with one option, **`messy`**, passed to `back()` and `front()`:

| Version | Option | What you see |
|---|---|---|
| **Tidy** (default) | `messy: 0` | The bed is made. Plush **Pearl** and **Neptune** sit on the pillows, the **Jester** and **Robo-Safadi** action figures stand on top of the bookshelf, the teddy sits on the toy chest, every book is on the shelf and the chest is shut. |
| **Messy** | `messy: 1` | Toys everywhere. The duvet is kicked back and hanging off the bed, one pillow is on the floor, the toy chest lid is flung open, most books are off the shelf, a scarf is caught in the wardrobe, there are drawings and crayons on the desk and a tiara and a sock on the dresser. On the floor and bed: Pearl, Neptune, Jester (lying down) and Robo-Safadi (tipped over), the teddy, alphabet blocks A–N, two balls, two cars (one upside down), stacking rings, open books and book piles, crayons, a crayon box, a jump rope, T-shirts and socks. |

**`taken`** (0..1) empties the room of toys one by one, tidy places included, as if someone carried them all off (scene 29's robot); `almaBedroom.takeables(messy, taken)` lists the toys still out, with where they are and when each one goes.

`messy` is a number from 0 to 1, like the study's `night` or `fire`. In between, the mess builds up toy by toy (every toy has its own threshold), so animating it from 0 to 1 is a "the room gets wrecked" beat, and 1 → 0 is "tidy-up time". Pass the same value to `back` and `front`.

In the studio's location browser, the **Version** chips (Tidy / Messy) switch between the two; they come from the location's `variants` registration. From the command line: `node render.mjs --location=alma_bedroom --variant=Messy`.

### The character toys

Each one is a simplified, plush-sized version of the real rig, using its palette and signature features (about 30–45 world units before scaling, drawn at 1.6–1.7× in the room: roughly a third of Alma's height):
- **Pearl** (plush): a sitting rainbow tie-dye dolphin (yellow, mint, peach, pink, lavender), sky-blue belly and beak, a bead eye with lashes, a pink blush and a small gold crown with pink, blue and yellow gems.
- **Neptune** (plush): a long bright-blue dolphin with the satin rainbow-striped belly, a long smile, and his crooked homemade gold crown with pearl tips and an orange starfish.
- **Jester Fester** (action figure): the three-point plum / crimson / gold hat with blue, green and orange pompoms, crimson headband, brown hair, rosy nose, striped crimson / gold / blue tunic with a zig-zag hem and bells, striped tights and curly brown shoes.
- **Robo-Safadi** (action figure): the riveted steel box head with Safadi's dark hair plate, cyan LED eyes and mouth, bolt ears and antenna, tan suit with lapels, white shirt and red tie, ribbed flex-tube arms and brown shoes.

The toys are exported as `almaBedroom.toys` (`pearl`, `neptune`, `jester`, `robo`, `teddy`, `ball`, `car`, `rings`, …) so a scene can hold one up or animate it. Each is drawn in sprite space (world units, y down, origin under the toy) and takes an outline width in screen px: `almaBedroom.toys.pearl(1.2)`; the dolphins also take `flip`.

## Two views

Like the study, the room is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same spots work either way.

| View | Camera | Sees |
|---|---|---|
| **Bed view** | `dir: 1` (the default), from the door looking toward +Z | bed, nightstands, bunting and fairy lights, window and toy chest (left), wardrobe, desk and corkboard (right), the rug. |
| **Door view** | `dir: -1`, from the foot of the bed looking back toward −Z | door, DANCE! poster, dresser and heart mirror, the bookshelf and desk (screen-left), the window and toy chest (screen-right). |

## Layout (world units; a person is about 170 tall, Alma about 120)

X is right when facing the bed, Y is up (the floor is Y = 0), and Z runs from the door wall to the bed wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±350 · back (door) wall Z = 0 · front (bed) wall Z = 900 · ceiling Y 280 · wainscot to Y 90 |
| Bed | X −110…110, Z 680–892, mattress top Y 50; headboard to Y 162, footboard Y 34–40 |
| Nightstands | X ±(140…210), Z 815–885, top Y 55 |
| Rug | circle r 150 at (0, 450) |
| Window | left wall, Z 330–610, Y 110…240 |
| Toy chest | X −350…−290, Z 400–540, lid Y 50 |
| Bookshelf | X 290…350, Z 80–240, top Y 150 |
| Desk / chair | desk X 255…350, Z 300–470, top Y 70 · chair X 205…245, Z 350–420 |
| Wardrobe | X 265…350, Z 610–830, 235 tall |
| Dresser | X −290…−130, Z 0–55, top Y 85; heart mirror above |
| Door | back wall, X 170…270, 205 tall |
| Lantern | (0, 214, 470) |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Middle of the rug (`almaBedroom.MARK`) | (0, 0, 450) | Alma, full body; kept clear of toys in the messy version |
| Sitting on the bed | (0, 50, 790) | |
| Beside the bed | (−165, 0, 730) | |
| At the desk | (215, 0, 385) | |
| By the window | (−255, 0, 470) | |
| By the wardrobe | (210, 0, 690) | |
| At the dresser | (−210, 0, 120) | |
| Doorway | (220, 0, 50) | arriving or leaving (a parent at the door: "What happened in here?!") |

## Camera presets

In the studio's location browser (click one, then **Copy camera**), or `node render.mjs --location=alma_bedroom [--variant=Messy]`:
- **Bed · wide from the door** `{ x: 0, y: 165, z: 30, f: 620, hy: 560, dir: 1 }`: establishing, the whole room
- **Bed · medium** `{ x: 0, y: 120, z: 380, f: 900, hy: 600, dir: 1 }`: the bed between the nightstands, wardrobe on the right
- **Bed · close** `{ x: 0, y: 105, z: 560, f: 1000, hy: 640, dir: 1 }`: the pillows, bunting and headboard
- **Floor · toy's-eye** `{ x: -20, y: 32, z: 170, f: 760, hy: 470, dir: 1 }`: down among the toys
- **Door · from the bed** `{ x: 0, y: 170, z: 670, f: 620, hy: 540, dir: -1 }`: the whole room from the foot of the bed
- **Door · dresser** `{ x: -120, y: 130, z: 420, f: 900, hy: 590, dir: -1 }`: door, poster and dresser
- **Desk and bookshelf** `{ x: -40, y: 130, z: 640, f: 600, hy: 560, dir: -1 }`: desk, chair and shelf on the left
- **Window and toy chest** `{ x: -150, y: 120, z: 670, f: 480, hy: 550, dir: -1 }`: the curtained window and the chest on the right

## API (`alma_bedroom.js`)

```js
almaBedroom.back(P, t, { splitZ, messy, lamp })          // everything farther than splitZ
almaBedroom.front(P, t, { splitZ, toZ, messy, lamp })    // pieces nearer than splitZ (and farther than toZ, if given)
almaBedroom.MARK, .BED, .DESK, .WARD, .SHELF, .CHEST, .RUG, .toys
```

- **Tidy / messy:** `messy` from 0 to 1 (default 0). See above.
- **Lamps:** `lamp` from 0 to 1 (default .5) is the glow of the bedside lamp, the lantern and the fairy lights.
- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, exactly as in the lecture hall's README.

```js
const B = LOCATIONS.alma_bedroom, P = persp(B.cameras['Bed · medium']), o = { messy: 1 };
B.back(P, t, { ...o, splitZ: 450 });
alma(...);                                             // Alma on the rug
B.front(P, t, { ...o, splitZ: 450 });
```

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `alma_bedroom.js` | the 3D set, the toys, its spots, camera presets and the Tidy / Messy variants |
