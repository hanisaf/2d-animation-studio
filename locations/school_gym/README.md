# School gym

> The DCES gymnasium: a maple basketball court with the DOVES logo at centre court, a wall-mounted hoop under the DOVES scoreboard at one end, a ceiling-hung hoop in front of the school stage at the other, pull-out bleachers, high windows, a climbing rope, a ball cart and tumbling mats.

## Description

The Dove Creek Elementary gym: big, bright and echoey. It's where PE happens, and with the stage at one end, assemblies and the school play happen here too. The school colours are teal, navy and gold, and the team is the **Doves**.
- **Floor:** a varnished **maple court** with boards running its length and a teal border out to the walls. The keys are painted teal and the lines are navy. A white **dove** with an olive sprig sits in the centre circle. The gym lights make soft shiny patches on the varnish, and sunlight from the high windows falls across the window side.
- **Scoreboard end (front wall):** a wall-mounted **hoop** on steel braces in front of a row of blue **safety pads**. Above it is the **DOVE CREEK DOVES scoreboard** (HOME, GUEST, game clock and period, in glowing LED digits, with horn lights that flash on the buzzer). There is also a **GO DOVES!** banner, a caged **wall clock** that runs on scene time, and **BE A GOOD SPORT!** and **TEAMWORK** posters.
- **Stage end (back):** a raised **stage** with a navy front reading ★ DCES ★, stairs on one side and a **DOVE CREEK ELEMENTARY** sign over the proscenium. Its **red velvet curtains** and gold-fringed valance open onto a painted **castle backdrop** with paper stars, left over from the school play. A **hoop hangs from the ceiling** in front of the stage, and it can be winched up for assemblies.
- **Left wall:** four rows of wooden pull-out **bleachers**, teal, navy and gold **pennants** with stars, the **double doors** at the scoreboard end with a projecting **EXIT** sign, and a drinking fountain.
- **Right wall:** a row of high **windows** showing sky, drifting clouds and treetops. The **climbing rope** hangs from the ceiling and sways. Along the wall are the **ball cart** (basketballs on top, red playground balls below), a stack of folded blue **tumbling mats** (Jenna's favourite corner) and some orange cones.
- **Walls and ceiling:** painted block walls to 240 with a teal and gold stripe. Above them are steel **roof trusses** with caged high-bay lights.

**Mood:** bright, loud, sporty. Squeaky sneakers and whistles, or a hush before the curtain goes up.

## Two views

Like the library, the gym is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same spots work either way.

| View | Camera | Sees |
|---|---|---|
| **Scoreboard view** | `dir: 1` (the default), looking toward +Z | the wall-mounted hoop, the scoreboard, the pads and the banners. Use it for games, free throws and the buzzer. |
| **Stage view** | `dir: -1` (the reverse angle), looking back toward −Z | the ceiling-hung hoop, the stage, the curtains and the backdrop. Use it for assemblies and performances. |

The stage and its proscenium are only drawn in the stage view. In the reverse view +X is on screen-left, so the windows are on the left and the bleachers on the right.

## Layout (world units; a person is about 170 tall)

X is right when facing the scoreboard, Y is up (the floor is Y = 0), and Z runs from the stage's back wall to the scoreboard wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±1000 · stage back wall Z = 0 · proscenium wall Z = 300 · scoreboard wall Z = 2600 · ceiling Y 720 |
| Court | X ±760, baselines Z 400 (stage end) and 2500 (scoreboard end), half-court line Z 1450, centre circle r 180 |
| Keys / free-throw lines | X ±185, 580 deep from each baseline (free-throw lines at Z 980 and 1920); three-point arcs r 630 |
| Rims | Y 280, r 23 · stage hoop: board Z 512–520, rim centre Z 545 (hung from the ceiling) · scoreboard hoop: board Z 2380–2388, rim centre Z 2355 (wall braces) |
| Backboards | X ±90, Y 250…355 |
| Scoreboard | X ±280, Y 480…690 on the scoreboard wall; pads X ±720, Y 0…200 |
| Stage | X ±560, Z 0–330, top Y 100 · opening X ±520, Y 100…440 · curtains at Z 120 · stairs X 560…740, Z 140–300 |
| Bleachers | left wall, X −1000…−800, Z 900–2150, rows 0…3 (seat Y 40, 78, 116, 154) |
| Windows | right wall, Z 620–900, 1020–1300, 1420–1700, 1820–2100, Y 470…650 |
| Ball cart | X 820…940, Z 1700–1780 |
| Climbing rope | X 880, Z 1150 |
| Tumbling mats | X 860…1000, Z 2040–2260, 64 tall |
| Doors / fountain | left wall, doors Z 2380–2560 (EXIT sign over them), fountain Z 2240–2310 |
| Trusses + lights | across the gym at Z 600, 1100, 1600, 2100; lights at X −500, 0, 500 |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Center court (`schoolGym.MARK`) | (0, 0, 1450) | on the DOVES logo |
| Free-throw line · scoreboard hoop | (0, 0, 1920) | shooting at the scoreboard hoop |
| Under the scoreboard hoop | (0, 0, 2250) | |
| Free-throw line · stage hoop | (0, 0, 980) | |
| Sideline · bleacher side / window side | (∓650, 0, 1450) | coach, teacher, the kids waiting their turn |
| Bleachers · front row / top row | `schoolGym.bleacher(0)` / `schoolGym.bleacher(3)` | spectators; `bleacher(row, z)` for any row and depth |
| By the ball cart | (760, 0, 1640) | |
| Climbing rope | (850, 0, 1130) | |
| Tumbling mats | (790, 0, 2150) | |
| On stage · centre / left / right | (0 / ∓260, 100, 210) | performers, between the curtain and the stage edge |
| Doorway | (−900, 0, 2470) | arriving or leaving |

## Camera presets

In the studio's location browser (click one, then **Copy camera**; **⇄ Reverse** turns any camera around), or `node render.mjs --location=school_gym --character=housam`:
- **Scoreboard · wide from the baseline** `{ x: 0, y: 190, z: 590, f: 700, hy: 520, dir: 1 }`: establishing
- **Scoreboard · center court** `{ x: 0, y: 150, z: 1000, f: 1000, hy: 580, dir: 1 }`: a character on the logo, the scoreboard behind
- **Scoreboard · close** `{ x: 0, y: 135, z: 1220, f: 1100, hy: 600, dir: 1 }`
- **Scoreboard · free throw** `{ x: 0, y: 140, z: 1500, f: 1100, hy: 560, dir: 1 }`: a shooter on the free-throw line, the hoop above
- **Scoreboard · hoop** `{ x: 0, y: 220, z: 1750, f: 1000, hy: 600, dir: 1 }`: the hoop and the scoreboard
- **Scoreboard · scoreboard** `{ x: 0, y: 260, z: 1500, f: 1100, hy: 820, dir: 1 }`: tilted up for the score
- **Scoreboard · bleachers** `{ x: 250, y: 200, z: 600, f: 800, hy: 520, dir: 1 }`
- **Scoreboard · ball cart & rope** `{ x: 560, y: 150, z: 900, f: 900, hy: 560, dir: 1 }`
- **Stage · wide from the scoreboard end** `{ x: 0, y: 200, z: 2320, f: 700, hy: 500, dir: -1 }`
- **Stage · from center court** `{ x: 0, y: 165, z: 1450, f: 900, hy: 520, dir: -1 }`: the audience's view of an assembly
- **Stage · performer** `{ x: 0, y: 190, z: 500, f: 600, hy: 480, dir: -1 }`: a performer on stage (the camera is past the stage hoop)
- **Stage · hoop** `{ x: 0, y: 220, z: 1150, f: 1000, hy: 600, dir: -1 }`
- **Stage · bleachers** `{ x: 300, y: 200, z: 2300, f: 800, hy: 520, dir: -1 }`

## API (`school_gym.js`)

```js
schoolGym.back(P, t, { splitZ, lights, sun, score, clock, period, buzzer, swish, swishStage, curtain, stageHoopUp, rope })
schoolGym.front(P, t, { splitZ, toZ, ... })   // pieces nearer than splitZ (and farther than toZ, if given); pass the same options
schoolGym.bleacher(row, z = 1500)             // → { x, y, z }: a spectator on bleacher row 0…3 (0 = lowest, nearest the court)
schoolGym.rim(end)                            // → { x, y, z }: rim centre; end 1 = scoreboard hoop, −1 = stage hoop (aim ball arcs here)
schoolGym.MARK, .COURT, .MID, .KEY, .FT, .RIM_Y, .STAGE, .BL, .CART, .HW, .PROS, .FRONT, .CEIL
```

- **Scoreboard:** `score: { home, guest }` (default 0–0), `clock` in seconds (default 600 = 10:00; count it down with `Math.max(0, 600 - t)`), `period` (default 1). `buzzer` from 0 to 1 flashes the board and the horn lights: pass `kick(t, t0)` at the buzzer. The scoreboard is only drawn in the scoreboard view.
- **Swish:** `swish` from 0 to 1 flips the scoreboard hoop's net up and shakes the rim. `swishStage` does the same for the stage hoop. Pass `kick(t, tBasket)`.
- **Stage curtains:** `curtain` from 0 (closed, the default) to 1 (open on the castle backdrop). Animate it with `ease(seg(t, t0, t0 + 2))`.
- **Stage hoop:** `stageHoopUp` from 0 (down, the default) to 1 winches it up toward the ceiling, out of the audience's sight line for assemblies and plays.
- **Lights and sun:** `lights` from 0 to 1 (default 1) controls the glow of the hanging lights and the shine on the floor. `sun` from 0 to 1 (default .7) controls the beams through the high windows.
- **Climbing rope:** `rope` from 0 to 1 swings it, for after someone lets go. If you leave it out, the rope sways gently.
- **Several characters at different depths:** sort them far to near by `P.depth(z)` and interleave `back` / `front` with `toZ`, exactly as in the lecture hall's README. Pass the same options to every call.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `school_gym.js` | the 3D set, its spots and camera presets |
