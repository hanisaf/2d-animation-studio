# Lecture hall

> A tiered university lecture hall: stage, lectern, chalkboards and projection screen at one end; eight rising rows of red flip seats facing them.

## Description

A bright, modern university hall where Professor Safadi can teach a proper lecture.
- **Podium end:** a wooden stage across the front with two steps up at each end. A lectern with a blue-and-gold open-book crest and a gooseneck mic stands on the left. A table with a laptop and a red coffee mug stands on the right. The front wall holds two green chalkboards with aluminium frames and chalk trays, and a pull-down projection screen between them.
- **Classroom end:** eight tiered rows of red flip seats behind long wooden writing desks, split into three blocks by two stepped aisles with small step lights. A landing at the top has two exit doors. Above it are the projection booth window and a clock whose second hand ticks with scene time.
- **Walls and ceiling:** tall daylight windows on the right wall, wooden acoustic slat panels on the left wall, a wooden dado that climbs with the rows, and a doorway at the front of each side wall. The ceiling has rows of recessed light panels, and a projector hangs over the middle of the hall.

**Mood:** warm, curious, a little grand. It's the place where a big question gets asked out loud.

## Two views

The set is built to be shot from both ends. Every piece is drawn in order of its distance from the camera (`P.depth`), so the same world, spots and characters work in either direction, and a scene can cut between the two.

| View | Camera | Sees |
|---|---|---|
| **Podium view** | `dir: 1` (the default), up in the rows, looking toward +Z | stage, lectern, boards, screen. Use it for the lecturer. |
| **Classroom view** | `dir: -1` (the reverse angle), from the stage, looking back toward −Z | the rising rows, students' faces, back wall, clock. Use it for the students. |

Character rigs always face the camera. In the podium view, a student in the rows would show their face even though they're facing away, so use the classroom view to show students. In the reverse view, +X appears on the left of the screen: the lectern (X −420) is on the right, and the window wall is on the left.

## Layout (world units; a person is about 170 tall)

X is right when facing the podium, Y is up (the pit floor is Y = 0), Z runs from the back wall to the front wall.

| Feature | Where |
|---|---|
| Walls | side walls X = ±850 · back wall Z = 0 · front wall Z = 2300 · ceiling Y 1150 |
| Rows | row *n* (1 = front) has its step at Y = 48·*n*, running Z `1400 − 160·n` … `1560 − 160·n`. Its desk is at the front of the step (top Y + 56) and its seats at the back |
| Seat blocks / aisles | blocks X −820…−330 · −230…230 · 330…820; stepped aisles X ±230…330 |
| Top landing | Z 0–120, Y 384, with exit doors at X ±620 |
| Pit (flat floor) | Z 1400–1880, Y 0 |
| Stage | Z 1880–2300, X ±720, top Y 40 |
| Lectern | X −420, Z 1895–1965, top Y 104 + lid |
| Table | X 330, Z 2040–2130 |
| Boards | left X −800…−340, right X 340…800, Y 250–800 (front wall) |
| Screen | X ±300, hangs from a roller at Y 990, 620 tall when fully down |
| Projector | ceiling, X 0, Z 1070–1140 |

## Spots (where characters go)

| Spot | (X, Y, Z) | Used for |
|---|---|---|
| Stage center (`lectureHall.MARK`) | (0, 40, 2000) | lecturing in the middle of the stage |
| Lectern | (−420, 40, 1995) | behind the lectern: chest and head show above it |
| At the left board / At the right board | (∓470, 40, 2200) | writing at a board |
| Front floor | (0, 0, 1650) | stepping down toward the students |
| Row 1 · center, Row 2 · left, Row 3 · center, Row 4 · right, Row 6 · center | `lectureHall.seat(n, x)` | a seated student: the desk hides their legs |
| Row 3 · center (small, lifted) | `lectureHall.seat(3, 110, 30)` | a small character (Alma): raised so more than her head clears the desk |
| Aisle, row 5 | (−280, 240, 640) | a student walking up or down the steps |
| Top landing | (0, 384, 60) | arriving late at the top doors |

## Camera presets

In the studio's location browser (click one, then **Copy camera**; **⇄ Reverse** turns any camera around):
- **Podium · from the back row** `{ x: 0, y: 600, z: 60, f: 900, hy: 470, dir: 1 }`
- **Podium · mid rows** `{ x: 120, y: 360, z: 800, f: 1000, hy: 560, dir: 1 }`
- **Podium · lectern** `{ x: -300, y: 200, z: 1450, f: 1000, hy: 650, dir: 1 }`
- **Podium · boards** `{ x: 0, y: 420, z: 1150, f: 900, hy: 540, dir: 1 }`
- **Classroom · from the stage** `{ x: 0, y: 230, z: 2250, f: 900, hy: 470, dir: -1 }`
- **Classroom · from the lectern** `{ x: -380, y: 280, z: 2060, f: 900, hy: 430, dir: -1 }` (the lecturer's point of view, mic in the foreground)
- **Classroom · front rows** `{ x: 0, y: 190, z: 1800, f: 1000, hy: 580, dir: -1 }`
- **Classroom · upper rows** `{ x: 250, y: 440, z: 1150, f: 1000, hy: 540, dir: -1 }`

## API (`lecture_hall.js`)

```js
lectureHall.back(P, t, { splitZ, screen: 1, projector: 1, boardL, boardR, slide })   // everything farther than splitZ
lectureHall.front(P, t, { splitZ, toZ })          // pieces nearer than splitZ (and farther than toZ, if given)
lectureHall.seat(n, x = 0, lift = 0)              // → { x, y, z }: a seat in row n (1 = front)
lectureHall.rowY(n), lectureHall.rowFront(n)      // a row's step height and front edge Z
lectureHall.MARK, .spots, .cameras, .BOARD_L, .BOARD_R, .SCREEN, .LECTERN, .STAGE, .HW, .FRONT, .CEIL
```

- **Boards and slides:** `boardL(t)`, `boardR(t)` and `slide(t)` draw your own content. The origin is the surface's top-left, in world units, with y pointing down, and the content is clipped to the surface: boards are 460 × 550, and the slide area is 568 × 570. For example:
  `boardL: t => { X.font = '600 70px ' + FONT_TALK; X.fillStyle = '#F3F1E6'; X.fillText('ζ(s) = 0', 40, 120); }`
- **Screen:** `screen` from 0 (rolled up) to 1 (fully down) animates the pull-down. `projector` from 0 to 1 sets how brightly it glows. The slide is drawn only when the screen is fully down.
- **Several characters in different rows:** sort them far to near by `P.depth(z)` and interleave:

```js
const who = [['alma', L.seat(3, 110, 30)], ['housam', L.seat(2, -200)]].sort((a, b) => P.depth(b[1].z) - P.depth(a[1].z));
lectureHall.back(P, t, { splitZ: who[0][1].z });
who.forEach(([id, s], i) => { /* draw the character at P.p(s.x, s.y, s.z) */ lectureHall.front(P, t, { splitZ: s.z, toZ: who[i + 1]?.[1].z }); });
```

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs (no reference art yet) |
| `lecture_hall.js` | the 3D set, its spots and camera presets |
