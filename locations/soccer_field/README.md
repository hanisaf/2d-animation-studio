# County soccer field

> A county park soccer field: striped regulation pitch, goals, bleachers, team shelters, snack bar and scoreboard, shot from both ends and from the air.

## Description

A sunny weekday at the county park. A mown, striped pitch with proper markings sits inside a low white barrier rail, with tall ball-stop fencing behind each goal carrying fabric banners (COUNTY PARKS & REC, SOCCER FIELD 2, PLAY FAIR).
- **Left:** two sections of aluminium bleachers on a concrete apron, with a scattering of fans (`crowd`, and `cheer` to make them bounce).
- **Right:** two team shelters (blue and red roofs, clear panels, a bench, kit bags and an orange water cooler each), then a cinderblock **snack bar** with a striped-awning serving window, restrooms door and schedule board, and a picnic table.
- **Beyond the north fence:** a scoreboard (HOME 0 · GUEST 0).
- **Behind the south fence:** a parking lot with parked cars and vans, a drive out to the road, and a green **COUNTY PARK** sign. It's seen in the reverse (`dir: -1`) views.
- **Around:** four floodlight poles, corner flags, training cones, a ball bag, bins, a tree line at both ends and along the sides, hazy hills and drifting clouds.
- **Light:** afternoon sun from behind the right-hand side. Goals, fences, poles, stands, shelters, buildings, trees and cars cast soft ground shadows, and distant trees fade into the haze.
- **Spectators:** seated fans with 3D legs over the seat edge, varied shirts, hair and caps, and some kids. With `cheer` they bounce and raise their arms, some wave blue or red scarves, and the keenest stand up.
- **Motion:** trees and flags sway, clouds drift, fans cheer. Pass `wind` (0–2) to calm it or make it gusty.

**Mood:** bright, ordinary, community-sport.

## Layout (world units; a person is about 170 tall, 1 unit ≈ 1 cm)

X is right, Y is up (turf = 0), Z runs along the pitch. The **south goal line is Z 0** and the **north goal line is Z 9000**.

| Feature | Where |
|---|---|
| Pitch | touchlines X ±2750, goal lines Z 0 and 9000, halfway Z 4500 |
| Penalty area | X ±2016, 1650 deep · goal area X ±916, 550 deep · spot 1100 out · D radius 915 |
| Centre circle | radius 915 at Z 4500 |
| Goals | 732 wide × 244 high, net 190 deep (south net toward −Z, north toward +Z) |
| Side barrier | white rail at X ±3500, 120 high |
| End fences | chain link 450 high at Z −1000 and Z 10000, banners on the pitch side |
| Bleachers | front row X −3900, 4 rows 85 deep, sections Z 1900–4300 and 4700–7100 |
| Team shelters | X 3000–3440, Z 3000–3700 (blue) and 5300–6000 (red) |
| Snack bar | X 4300–5700, Z 1500–2900, 320 high |
| Scoreboard | X 2100, Z 10500 |
| Light poles | X −4700 / 3800, Z 1500 and 7500, 1800 tall |
| Parking lot | X −3300…2300, Z −2450…−1350 (two rows of stalls, drive out to the left at Z −2100…−1700); park sign X −2600, Z −1200 |
| Tree line | Z −2600…−5800 (south), 12200…15400 (north), X ±7600…10800 (sides) |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Edge of the box (`soccerField.MARK`) | (0, 0, 1800) | centre stage for dialogue |
| Centre spot | (0, 0, 4500) | kick-off |
| Penalty spot (south / north) | (0, 0, 1100) / (0, 0, 7900) | penalty kicks |
| Goalkeeper (south / north) | (0, 0, 90) / (0, 0, 8910) | in the goal mouth |
| Corner flag (south right) | (2650, 0, 100) | corner kicks |
| Touchline, halfway | (2650, 0, 4500) | throw-ins, sideline chat |
| Home bench / Away bench | (3230, 50, 3350) / (3230, 50, 5650) | sitting in the shelters |
| Bleachers · row 2 | (−4074, 94, 3000) | spectators |
| Snack bar window | (4200, 0, 1930) | ordering |
| Behind the south goal | (0, 0, −450) | between goal and fence |

## Camera presets

Every view looks along the pitch (one-point perspective has no pan or yaw): `dir: 1` looks up the pitch toward +Z, `dir: -1` looks back toward −Z. Use the studio's **Copy camera**, or `node render.mjs --location=soccer_field --character=jester_fester`.

| Preset | Camera |
|---|---|
| Behind south goal · down the pitch | `{ x: 0, y: 150, z: -520, f: 900, hy: 560, dir: 1 }` |
| Low · grass level | `{ x: 250, y: 30, z: -450, f: 900, hy: 650, dir: 1 }` |
| Keeper's view | `{ x: 0, y: 160, z: 150, f: 1000, hy: 540, dir: 1 }` |
| Penalty kick | `{ x: 0, y: 130, z: 1500, f: 1300, hy: 600, dir: -1 }` |
| Striker's shoulder | `{ x: -350, y: 170, z: 2300, f: 1000, hy: 560, dir: -1 }` |
| Midfield · centre circle | `{ x: 0, y: 150, z: 3300, f: 1000, hy: 570, dir: 1 }` |
| Midfield · reverse | `{ x: 0, y: 150, z: 5700, f: 1000, hy: 570, dir: -1 }` |
| Corner kick | `{ x: 2100, y: 120, z: -650, f: 1000, hy: 600, dir: 1 }` |
| Touchline · bench side | `{ x: 3050, y: 150, z: 1600, f: 900, hy: 540, dir: 1 }` |
| Stands · along the bleachers | `{ x: -3620, y: 210, z: 1350, f: 900, hy: 540, dir: 1 }` |
| Stands · from the far touchline | `{ x: 2900, y: 260, z: 6900, f: 1000, hy: 520, dir: -1 }` |
| Scoreboard end | `{ x: 700, y: 170, z: 7300, f: 1000, hy: 470, dir: 1 }` |
| Behind north goal · reverse | `{ x: 0, y: 150, z: 9520, f: 900, hy: 560, dir: -1 }` |
| Aerial · behind goal | `{ x: 0, y: 2800, z: -3400, f: 900, hy: 60, dir: 1 }` |
| Aerial · reverse | `{ x: 0, y: 2400, z: 10300, f: 850, hy: -150, dir: -1 }` |
| Aerial · high overhead | `{ x: 0, y: 9000, z: -6000, f: 800, hy: -150, dir: 1 }` |

## API (`soccer_field.js`)

```js
soccerField.back(P, t, o)     // sky, hills, turf, markings, shadows, and every piece farther than o.splitZ
soccerField.front(P, t, o)    // pieces nearer than o.splitZ (nets, fences, shelters, fans…), over the characters; o.toZ stops early
soccerField.MARK, .LEN, .HW, .MID, .GW, .GH, .FX, .ENDS, .spots, .cameras
```

Options (pass the same `o` to both calls):

| Option | Default | Effect |
|---|---|---|
| `splitZ`, `toZ` | everything | depth split for characters (see the lecture hall's multi-character pattern) |
| `wind` | 1 | 0–2: tree sway, corner flags, scarves |
| `crowd` | .3 | 0–1: how full the bleachers are |
| `cheer` | 0 | 0–1: fans bounce and raise their arms, some wave scarves; above .6 the keenest stand |
| `score` | `[0, 0]` | `[home, guest]` on the scoreboard |
| `home`, `guest` | `'HOME'`, `'GUEST'` | team names on the scoreboard |
| `clock` | none | seconds (e.g. `67 * 60 + 12` shows 67:12) or any string; omitted = no clock |

```js
const o = { crowd: .85, cheer: kf(t, [[3, 0], [3.4, 1], [6, 1], [7, .2]]), score: [2, 1], home: 'HAWKS', guest: 'OTTERS', clock: 67 * 60 + t };
``` Works from both directions (`P.depth` ordering). A keeper in the goal mouth sits behind the net when `splitZ` is the keeper's Z and the camera looks at the goal from the pitch, and in front of it from behind the goal.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs, reference art |
| `soccer_field.js` | the 3D set, its spots and camera presets |
