# Scene 20b: The Broccoli Directive 2.0

> One year later, on Halloween night. The kids pull the sheet off Robo-Safadi and switch him on. While he was off, his firmware "updated" from the YouToon analytics ([scene 47](../../the_trolls/scene47_troll_analytics/README.md)): **silly sells**. He has a new directive. The kids come trick-or-treating in Alma's monster costumes ([The Trolls](../../the_trolls/scene48d_alma_costumes/README.md)), and his scanners can't tell who's inside. So every monster gets a tongue twister: **twist it or eat it.** Two kids nail theirs and get candy. Two flub and get broccoli. Then the kids turn the tables: *"Robo, your turn!"* … *"Wed wobot, wubber bwoccoli… BZZT."*

**Status:** treatment. The song isn't generated yet ([`lyria/PROMPT.txt`](lyria/PROMPT.txt)), and there's no `scene.js` yet. The scene isn't listed in `../series.js` until it renders.

| | |
|---|---|
| **Length** | ~120 s · 24 fps · 120 bpm (one bar = 2 s, beats at 0 + 0.5 n) |
| **Cast** | [Robo-Safadi](../../../characters/robo_safadi/README.md) · [Housam](../../../characters/housam/README.md) (the blue bird) · [Alma](../../../characters/alma/README.md) (the pink ghost) · [Jenna](../../../characters/jenna/README.md) (the bee, with Fafy) · [Danny](../../../characters/danny/README.md) (the pumpkin). Kids and Robo only. |
| **Look** | a music video like [scene 17](../scene17_broccoli_directive/README.md): reuse its `halloween.js` backdrops (night sky, moon, bats, pumpkins, tombstones, sunbursts, candy, buckets, broccoli, bowl, HUD, telescoping arm). Open and close on the [house](../../../locations/house/README.md) at night. |
| **Costumes** | Alma's real drawings, `../../the_trolls/scene48_the_trolls/costumes/{bird,pink_ghost,bee,pumpkin}.png`, worn over each kid as in [48d](../../the_trolls/scene48d_alma_costumes/README.md). On the POP the drawing flies off. |
| **Audio** | `audio.mp3`, **"Twist It or Eat It"**, to be made with Lyria from [`lyria/PROMPT.txt`](lyria/PROMPT.txt), using 48c's [`generate.py`](../../the_trolls/scene48c_who_is_inside/lyria/generate.py). |

## Why it works as a sequel

- **Same robot, same hook.** "Everybody eats broccoli" comes back, and the BEEP-BOOP power-on, the HUD lock-on and the telescoping arm all return from 17.
- **The new idea comes from the channel.** The analytics said silly sells, so the robot's new directive is silly: tongue twisters, the format of [45](../../the_trolls/scene45_tongue_twisters/README.md), [46](../../the_trolls/scene46_super_tongue_twisters/README.md) and [48c](../../the_trolls/scene48c_who_is_inside/README.md).
- **It ends the opposite way.** In 17, Robo steals a candy and glitches. Here he glitches from his own twister and lets the candy go, and in the final tag he steals one and nothing breaks.

## Song map and shot list

Times are seconds into the song as planned. Move the constants to the measured take, as 48c did.

| Time | Section | Lyric (who) | Shot |
|---|---|---|---|
| 0–8 | Intro, 4 bars | (spooky riff) | **dustOff**: *ONE YEAR LATER…* The house at night, a sheet-covered shape with cobwebs on the porch. The four kids, already in costume, tug the sheet off on the beat. Robo stands dark, eyes off |
| 8–16 | Boot, 4 bars | *"Beep. Boop. Rebooting… Downloading update… Directive two-point-oh!"* (Robo) | **reboot**: an extreme close-up as in 17's powerOn. A progress bar fills; a YouToon logo and a gold arrow flash past with **SILLY SELLS ↑**. On *two-point-oh* the eyes light up, red to rainbow, and the antenna sparks |
| 16–32 | Verse, 8 bars | *"Four little monsters knocking on my door, / my scanners can't see who you are anymore. / New directive, here's the deal: / twist your tongue, or broccoli's your meal!"* (Robo) | **unknownUnits**: Robo's HUD POV, as in 17's hud, on four monsters with buckets. Each reticle reads **UNKNOWN UNIT ?** On *deal* the gripper arm unfolds and offers a broccoli in one claw and a candy in the other |
| 32–48 | Chorus, 8 bars | *"Twist it or eat it! (EAT IT!) / Say it five times fast! / Twist it or eat it! (EAT IT!) / Or broccoli at last! / Everybody, everybody, twist it… or eat broccoli!"* (Robo, kids shouting the answers) | **chorus**: an orange and violet sunburst, title slams on the beats: TWIST IT / OR / EAT IT. The monsters bounce in a row while Robo conducts with a broccoli baton |
| 48–60 | Battle 1, 6 bars | Sting *"Who's inside?"* · Robo: *"Danny's dizzy cube drops, Danny's dizzy cube drops!"* · the pumpkin, twice as fast: *"Danny's dizzy cube drops, Danny's dizzy cube drops!"* · *"CANDY!"* | **danny**: a VS banner, pumpkin vs Robo. The pumpkin says it perfectly at double speed while solving a Rubik's cube a twist per beat (a callback to [25](../../talent_show/scene25_cube_drops/README.md)). POP: the costume flies off, Danny grins, and a candy drops into his bucket |
| 60–72 | Battle 2, 6 bars | Sting · Robo: *"Jenna's giraffe giggles, jiggling jelly jars!"* · the bee: *"Jenna's jiraffe jiggles… giggly… jelly… JARS?"* · *"BROCCOLI!"* | **jenna**: the bee starts strong and dissolves into giggles. POP: Jenna, laughing. The arm hands a broccoli to her and a tiny one to Fafy |
| 72–84 | Battle 3, 6 bars | Sting · Robo: *"Purple pumpkin, pink ghost, purple pumpkin, pink ghost!"* · the pink ghost, dancing: *"Purple pumpkin, pink ghost, purple pumpkin, pink ghost!"* · *"CANDY!"* | **alma**: her rainbow floor lights up under the pink ghost, one tile per word. She nails it, spins, POP: Alma takes a bow, and a lollipop drops into her bucket |
| 84–96 | Battle 4, 6 bars | Sting · Robo: *"Hussam's hat trick hits the haunted headstone!"* · the blue bird: *"Hussam's hat thick… hits the hunted… hatstone?"* · *"BROCCOLI!"* | **housam**: a graveyard set from 17. He gets the first half right and tangles the second. POP: Housam, sheepish. The broccoli lands on his head like a ball. He juggles it knee, knee, head: no luck, it's still broccoli |
| 96–108 | The turn, 6 bars | Kids: *"Robo… YOUR TURN!"* · kids: *"Red robot, rubber broccoli!"* · Robo, speeding up: *"Red robot, rubber broccoli, wed wobot, wubber bwoccoli, WED WOBOT—"* · *"BZZT!"* | **robosTurn**: the VS banner flips, kids vs Robo. Each repeat is faster, and his eyes spin. Steam vents, the speech module sparks, X eyes. His chest hatch pops open and the year's confiscated candy pours out (his chest hatch, from [29](../../cleaning_up/scene29_cleaning_up_2/README.md)) |
| 108–120 | Final chorus and tag, 6 bars | *"Twist it or eat it! (EAT IT!) / Everybody… eats… broccoli… AND CANDY!"* (all) · laughter | **finale**: candy rain on the sunburst, the kids dance with full buckets, and Robo reboots with green eyes. Each kid takes one sporting bite of broccoli. **Tag:** alone in a spotlight, Robo finds one last candy, looks left and right, eats it… and nothing goes wrong. Thumbs up. The iris closes on THE END |

## Lines to watch for

- **Tongue twisters are short on purpose.** 48c learned that a 50-syllable twister won't fit in two bars. Each one here is 10–14 syllables, so Robo can sing it once in two bars and the kid can repeat it in two.
- **Who wins:** Danny and Alma (practice: the cube and the dance), Jenna and Housam (giggles and rushing). Two and two, so nobody is the punchline twice.
- **The flubs have to be sung as flubs.** The prompt spells them out (*"jiraffe"*, *"hat thick"*, *"hatstone"*, *"wed wobot"*), since Lyria sings what is spelled.
- **Names:** spell Housam as **Hussam** in the lyrics (see [48c's lyria notes](../../the_trolls/scene48c_who_is_inside/lyria/README.md)).

## To do

1. Generate a few takes from `lyria/PROMPT.txt` and keep the best. Measure the beat grid and the section times.
2. Write `lyrics.js` (word times) and `asset.js`/`scene.js`, borrowing `halloween.js` from scene 17 and the costume `wearer()` from 48d.
3. Add `'scene20b_broccoli_reboot'` to `../series.js` and a row to `SERIES.md`.
