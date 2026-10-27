# Scene 21b: Dolphin Royalty

> In the science room, Housam and Danny reprogram Robo-Safadi so *"explain"* no longer sends him haywire. Jenna and Alma walk in and test it by doing their best Professor Safadi: *"Ahem… Let me EXPLAIN…"* The robot just goes *beep*. Everybody sighs. The girls are writing books to beat Safadi at the book fair. TA-DA: ***Dolphin Royalty***, a coloring book with a mini poster. Alma introduces **Princess Pearl** and **Jester Fester**, who pop out of the book as coloring-page line art (Fester gets bonked), and Jenna colors them in. Everyone races to the library to write. *"Professor Safadi… you shall see!"* *To be continued…*

*The bridge from [21 We Already Read a Lot!](../scene21_already_read/README.md) to [22 You Shall See](../scene22_you_shall_see/README.md).*

| | |
|---|---|
| **Length** | 100 s · 24 fps · 2400 frames |
| **Cast** | [Housam](../../../characters/housam/README.md) · [Danny](../../../characters/danny/README.md) · [Jenna](../../../characters/jenna/README.md) · [Alma](../../../characters/alma/README.md) · [Robo-Safadi](../../../characters/robo_safadi/README.md) · [Clawd](../../../characters/clawd/README.md) (on the laptop) · [Princess Pearl](../../../characters/princess_pearl/README.md) and [Jester Fester](../../../characters/jester_fester/README.md) (as story pops) |
| **Locations** | [Science room](../../../locations/science_room/README.md), teacher view, `rows: 2`, the AV cart and laptop from scene 19 · [School library](../../../locations/school_library/README.md), reading-room view |
| **Sound** | Voices from `dialogue`; a sneaky after-school groove; a drum-roll hush during the test; a gulp on the sigh; a fanfare on TA-DA; pops for the story clouds; a bonk; crayon scratches; a whoosh to the library; a pencil montage |
| **Reference art** | `reference/`: photos of the girls' real books (`cover_gold.jpg`, `cover_green.jpg`) and the mini poster (`mini_poster.jpg`). `props.js` redraws all three in code. |

## Script

| Time | Who | Line / action |
|---|---|---|
| 0.0–6.0 | — | *Across the science room to the wide: Housam types at the laptop; Danny tightens a bolt on Robo-Safadi (clank). Jenna and Alma skip in through the door.* |
| 6.0 | JENNA & ALMA | **"What are you boys *doing*?"** |
| 8.4 | HOUSAM | **"We are *reprogramming* Robo-Safadi…"** |
| 11.0 | DANNY | **"…so he doesn't go *haywire* when someone says *explain*!"** |
| 14.6–19.2 | — | *Insert, the laptop: `llm("Robot goes haywire!")` is backspaced to `stay_calm()  # no more haywire!`; the red "Robot goes haywire!" leaves the prompt; Clawd stops swirling and smiles. DING.* |
| 17.4 | HOUSAM | **"No more *haywire*."** |
| 19.4 | JENNA & ALMA | **"Let *us* test it!"** |
| 21.2 | — | *A sly look between the girls.* |
| 22.4 | JENNA & ALMA | *(Alma, finger up and eyes shut; Jenna strokes an imaginary beard)* **"Ahem… Let me *EXPLAIN*…"** *The boys freeze.* |
| 25.0–28.6 | — | *Close on the robot. Silence. The antenna twitches… the eyes glance left, right… "beep!", happy eyes and a heart.* |
| 28.8 | EVERYONE | *(slumping with relief)* **"*Sigh…*"** |
| 30.8 | ALMA | **"Boys… we are working on writing *new books*…"** |
| 33.8 | JENNA | **"…to compete with *Professor Safadi* at the *book fair*!"** |
| 37.2 | HOUSAM | **"*Nice!* But what are these books?"** |
| 39.8 | JENNA & ALMA | *(books up)* **"TA-DA!"** |
| 41.0–44.6 | ALMA | *Insert: the gold cover.* **"*Dolphin Royalty*: a coloring book!"** |
| 44.6–48.0 | JENNA | *Insert: the green cover.* **"With dolphins, stars… and a *servant*!"** |
| 48.0–51.4 | JENNA | *Insert: the mini poster unfolds.* **"And a *mini poster*!"** |
| 51.6 | DANNY | **"Cool! Who's in the *story*?"** |
| 53.8 | ALMA | **"Meet *Princess Pearl*!"** *A story cloud pops above the girls: Pearl, crowned, drawn as uncolored coloring-page line art.* |
| 56.0 | ALMA | **"A rainbow dolphin who *rules* the royal court!"** |
| 59.0 | ALMA | **"And her jester… *Jester Fester*!"** *A second cloud: Fester, juggling.* |
| 61.8 | ALMA | **"His tricks *always* go… *almost* right!"** *He fumbles; a ball comes down on his head. BONK!* |
| 65.2 | JENNA | **"And you get to *color* them in!"** *A crayon sweeps across the clouds and colors both of them in.* |
| 68.0 | DANNY | **"Whoa! Professor Safadi won't stand a *chance*!"** |
| 70.8 | HOUSAM | **"Can we write books *too*?"** |
| 72.8 | JENNA | **"Of course! To the *library*!"** |
| 74.8 | EVERYONE | **"TO THE LIBRARY!"** *Whoosh wipe.* |
| 76.8–79.4 | — | *The library: the four race in to the reading tables.* |
| 79.6–91.0 | — | *The writing montage: pencils scribble and pages fill. Jenna sketches and Alma colors. Housam gets an idea (a bulb). Danny crumples a draft and tosses it. Time-lapse: the sun goes down, the lamps glow and the stacks grow.* |
| 91.0 | EVERYONE | *(lined up in front of the tables, work held high; a wink)* **"Professor Safadi… you *shall see*!"** |
| 94.2–100 | — | *Freeze. **TO BE CONTINUED…**; iris out.* |

## Shot list

| Time | Shot (`scene.js`) | Camera | What happens |
|---|---|---|---|
| 0.0–8.4 | `opening` | across the room, dolly in to `GROUP` | the boys at work; the girls come in; "What are you doing?" |
| 8.4–14.6 | `boys` | `BOYS` | "reprogramming… haywire… explain" |
| 14.6–19.2 | `insertFix` | the laptop screen | the fix is typed |
| 19.2–25.0 | `girlsMS` | `GIRLS_MS` | "Let us test it!"; the Safadi imitation |
| 25.0–28.6 | `robotCU` | `ROBOT_CU`, a slow push | the test: twitch, glance, beep |
| 28.6–33.8 | `group` | `GROUP` | the sigh; "new books…" |
| 33.8–37.2 | `girlsMS` | `GIRLS_MS` | "…the book fair!" |
| 37.2–39.8 | `boys` | `BOYS` | "what are these books?" |
| 39.8–41.0 | `girlsMS` | `GIRLS_MS` | TA-DA |
| 41.0–51.4 | `coverGold`, `coverGreen`, `poster` | full-frame inserts over the blurred room | the two covers and the mini poster |
| 51.4–53.8 | `boys` | `BOYS` | "Who's in the story?" |
| 53.8–61.6 | `girls` | `GIRLS`: the girls low, the clouds above | Pearl and Fester pop out |
| 61.6–68.0 | `popCU` | `POP_CU`: the two clouds, big | the bonk; the coloring |
| 68.0–72.8 | `boys` | `BOYS` | "won't stand a chance!"; "Can we write books too?" |
| 72.8–76.8 | `groupOut` | `GROUP` + wipe | "To the library!" |
| 76.8–79.6 | `libRun` | `LIB_RUN`: from the desk | the run in |
| 79.6–88.6 | `libWrite`, `libGirls`, `libBoys` | `LIB_W`, `LIB_GIRLS`, `LIB_BOYS` | the writing montage |
| 88.6–91.0 | `libLapse` | `LIB_W` | the time-lapse (clock in the corner) |
| 91.0–100 | `libEnd` | `LIB_END`, a wide lens in front of the tables | "you shall see!"; freeze; card; iris |

## Notes for editing (`scene.js`)

- **Blocking:** the science room uses `POS` (the boys, cart and robot as in scene 19; the girls come in from `DOOR`). In the library, each kid has `LT` (behind a row-1 table, writing) and `L_FRONT` (the finale line-up, a jump cut at `SEE`). `at(name, t)` gives everyone's spot over the whole scene.
- **The test:** `robotPose` plays the tension (`TEST`) and the happy `BEEP`. All four kids' poses hold their breath over the same window.
- **The books:** `bookInHand` draws the real cover (`dryCover`) in the right hand whenever a pose sets `book: 'gold' | 'green'`. `bookAt: 'high'` holds it up beside the head.
- **The story pops:** `pops()` draws the two clouds at `POP` (world space, above the girls), so every science-room camera agrees where they are. Before `COLOR`, the figures are drawn through the `LINEART` filter (grayscale, then pushed toward white, which gives a coloring-page look). During `COLOR`, a zigzag clip wipes the full-color figures in from left to right, with a crayon at the edge. Fester juggles with `cascade` until `DROP`, then the third ball falls onto his head at `BONK`.
- **Library hands:** the writing hand targets (`ctx` in `libStage`) sit just beyond the tables' back edge, so they show above the table top. The paper stacks grow with `paperN`. `LSET` dims the sun and brightens the lamps over `LAPSE`.

## Pieces (built)

| Piece | Where | How to use it |
|---|---|---|
| The girls' books | [`props.js`](props.js) | `dryCover('gold' \| 'green' \| 'poster', x, y, w, ang, { k })`: each one is drawn in its photo's pixel space, so you can check the shapes against `reference/` |
| Kid lettering | [`props.js`](props.js) | `dryScrawl` (handwriting: per-letter tilt, size and baseline) and `dryBubble` (fat bubble letters with an outline) |
| Crayon fill | [`props.js`](props.js) | `dryColor(pts, col)`: a pale wash plus waxy hatching, clipped to the shape |
| Story cloud | [`props.js`](props.js) | `dryPop(cx, cy, r, k, t, fn)`: a puffy cloud with sparkles; `fn` paints the picture inside it |
| Crayon, paper on a table | [`props.js`](props.js) | `dryCrayon(x, y, len, ang, col)`, `dryPaper(P, x, y, z, w, d, ang, { n })` |
| Cart, laptop, editor | scene 19's [`props.js`](../../halloween/scene19_if_else_explain/props.js) | `ieCart`, `ieLaptop`, `ieCable`, `ieEditor` |
