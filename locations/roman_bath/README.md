# The Roman bath

> A sunny marble bathhouse in old Greece: a round marble tub full of soap bubbles on a low dais, Ionic colonnades, dolphin-and-wave frescoes, a big pool with a bronze lion-head fountain, and three tall arches onto the sea, cypresses and a temple on a hill.

## Description

Where Housam's *Eureka!* story happens (scene 29). Warm cream plaster and white marble, a checkerboard marble floor with terracotta strips along the colonnades, and Mediterranean light pouring in.
- **Foreground:** a round white marble **bathtub** with gold bands, on a low round **dais**, full of turquoise water and **soap bubbles**, with steam drifting up.
- **Sides:** **Ionic colonnades** (four columns a side) under a marble architrave with a gold line; behind them the walls carry a blue **fresco band** with a white running wave and orange **leaping dolphins**.
- **Back:** a big sunken **pool** with sparkling caustics, fed by a bronze **lion-head fountain** whose spout sends rings across the water. Above it, three **arches** look out on a blue sea, green hills, dark **cypresses**, white clouds, the sun and a little **temple** on a hill (a far backdrop, so it slides behind the arches as the camera moves). The frieze over the arches reads **ΛΟΥΤΡΑ** ("baths").
- **Props:** two **amphorae**, a marble **bench** with folded towels, a **lemon tree** in a terracotta pot. Sunbeams fall through the arches across the floor.

## Using it

```js
const BA = LOCATIONS.roman_bath;
BA.back(P, t, { splitZ, bather: () => safadi(...), foam: .75, ripple: t0, steam: 1 });
// characters nearer than splitZ
BA.front(P, t, { splitZ, ...same options });
```

| Option | What it does |
|---|---|
| `bather` | a function that draws whoever is in the tub. The set calls it between the tub's far half (rim, water) and its near half (near water, foam, outer wall), so they sit *in* the water. Stand them on the floor at `TUB` (0, 480) and sink them with their rig's `dy`. |
| `foam` | 0..1, soap bubbles on the tub water (default .7) |
| `ripple` | scene time of a splash: rings spread across the tub water from then on |
| `steam` | 0..1, steam off the tub (default 1) |

## Layout (world units; a person is about 170 tall)

| Feature | Where |
|---|---|
| Hall | X ±520, floor Y 0, ceiling Y 470, back wall Z 1500, front wall Z −420 (one door arch) |
| Arches | back wall, centred on X −300, 0, 300; 190 wide, 330 tall |
| Colonnades | X ±380, columns at Z 160, 560, 960, 1360, 360 tall; architrave Y 360–400 |
| Tub | centre (0, 480), radius 95, rim Y 78, water Y 64; dais radius 128 |
| Pool | X ±300, Z 860–1300; lion fountain at (0, 1335) |
| Props | amphorae (−320, 420), (310, 760) · bench with towels (300, 240–420) · lemon tree (−315, 820) |

## Spots

| Spot | (X, Y, Z) |
|---|---|
| In the tub (`romanBath.MARK`) | (0, 0, 480) |
| Beside the tub (left / right) | (∓175, 0, 440) |
| Left colonnade | (−300, 0, 760) |
| Pool edge | (0, 0, 820) |

## Cameras

`Wide · the hall`, `Tub · medium`, `Tub · close`, `Side · the colonnade`, and `Reverse · from the pool` (`dir: -1`, looking back out toward the front door).
