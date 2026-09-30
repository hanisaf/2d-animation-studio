# Scene 11: The Great Hydration Debate

> After winning their game, Housam and Alma race to the cooler, but Professor Safadi slams the lid: *"Energy drinks? After a game?"* The kids argue eight reasons and win. He lets them drink... and the bottles are full of his Safadi Energy Drink: unsweetened tea.

| | |
|---|---|
| **Length** | 200 s (3:20) · 24 fps |
| **Cast** | [Housam](../../characters/housam/README.md), [Alma](../../characters/alma/README.md), [Professor Safadi](../../characters/safadi/README.md) |
| **Location** | [County soccer field](../../locations/soccer_field/README.md): the sideline by the home bench, the centre circle, and (in a daydream) the north goal |
| **Sound** | Procedural score, three cartoon voices, and two new cues (`whistle`, `gulp`) in `studio/music.js`; no audio files |
| **Source** | The kids' arguments come from the essay *Why Kids Should be Allowed to Have Hydration Drinks* (© 2026 3-Dolphins); the story from `../../../script.md` |

## Synopsis

**The race.** The scoreboard reads HOME 3, AWAY 2 at the whistle. At midfield, Housam and Alma are done in, hands on knees. In a quick insert that nobody notices, Safadi shuts the cooler lid, pats it and strolls off whistling. *"Race you!"* The kids sprint to the cooler, Housam flips the lid, and Safadi walks in and slams it shut.

**The debate.** *"They're not energy drinks... they're hydration drinks!"* Housam cracks his knuckles: *"I have eight reasons."* Safadi sits on the cooler, and the title card slams in. Then come the eight reasons:

1. **Electrolytes.** Housam reads the quote off a paper from his sock, and Safadi's heart pounds.
2. **Instant energy.** Alma's daydream shows Housam rocketing down the pitch to score.
3. **Sugar.** Safadi's chalkboard shows the sugar crash. The kids answer with low-sugar and *ZERO* sugar versions, and with small and big bottles.
4. and 6. **Tournaments and endurance.** The kids put on sunglasses.
5. **Sweat.** Housam wrings out his jersey, and the puddle reaches Safadi's shoe: *"...Noted."*
7. **Kids actually drink it.**
8. **No heavy meal.** Safadi's plate board, then Housam's daydream of a giant sandwich that turns him green. It cuts away before anything happens.

Housam then plugs the sponsor, 3-DOLPHINS, straight to camera until Alma yanks him back. The kids cross their arms in unison while the clock ticks.

**The verdict.** *"That was very convincing."* Safadi steps aside and Housam tosses Alma a bottle. *"To victory!" "To electrolytes!"* The bottles clink, the kids gulp, the frame freezes (Safadi winks at us), and their faces crumple. *"Why does it taste like... leaves?"* The bottle turns to show the sticker: **SAFADI ENERGY DRINK · 100% Unsweetened Tea · 0 Sugar · 0 Fun**. *"You said it yourselves. Zero sugar."*

**The end.** The kids sit on the cooler and sip miserably while Safadi strolls off with his thermos, chuckling. Iris out.

## Script

`asset.js` is the source of truth for line text and times. Big beats:

| Time | Beat |
|---|---|
| 0–3.2 | scoreboard, *FWEEEET!*, FULL TIME |
| 3.2–11 | midfield: "We... did it...", "Last-minute goal...", "Need... drink..." |
| 11–14.2 | insert: Safadi shuts the lid (11.85), pats it and walks off whistling |
| 14.4–18 | "Race you!", the sprint to the cooler |
| 18.3 / 21.4 | lid flips open · Safadi slams it: THUNK |
| 21.9–43.4 | the challenge; knuckle crack 38.0; Safadi sits 42.2 |
| 43.6–46.4 | title card |
| 46.6–60.9 | 1 · electrolytes: sock paper 51, heart push-in 56.9–58.4 |
| 61.2–81 | 2 · instant energy: dream goal 73.9–78.4 (GOAL 76.95) |
| 81.3–97 | 3 · sugar: crash board 81.4, ZERO! 90.0, two bottles 92.2, Safadi's silent "O" 95.3 |
| 97.2–104.8 | 4 + 6 · tournaments, carbs; sunglasses 102.6 |
| 104.9–112.7 | 5 · sweat: wring 108.1, SPLOSH 109.7, "...Noted." |
| 112.9–117.6 | 7 · kids drink more |
| 117.8–128 | 8 · the meal: plate board, dream sandwich 122.8–125 (URP! 124.3) |
| 128.3–137.9 | sponsor break; YOINK at 134.9 |
| 138.1–148.4 | closing; arms crossed 144.6; tick-tock 145.6–148 |
| 148.6–155 | "convincing", "Really?!", "Go ahead"; Safadi stands 153.2 |
| 155.8–158.9 | lid open, grab, toss to Alma 156.9–157.5, PSSHT |
| 159.2–164.8 | toast; CLINK 162.2; gulp 162.5; freeze 163.4 (Safadi winks); crumple 164.2 |
| 165–171.6 | "Mmf?", "...leaves?", "Sad leaves." |
| 171.8–175.6 | label insert: the bottle turns (172.6–173.2), the sticker card |
| 176–192 | the reveal and Safadi's chuckle |
| 192.2–200 | the wide: sipping on the cooler, Safadi walks off with his thermos, iris out |

## Shot list

| Shot fn | Camera | Used for |
|---|---|---|
| `board` | scoreboard close-up | the opening |
| `midfield` | two-shot at midfield (Z 4420) | tired kids, "Race you!" |
| `coolerInsert` | low, just behind the cooler | the secret lid shut |
| `three` | sideline three-shot, keyframed by `THREE` (wide for the sprint, tighter once Safadi sits) | group beats, reactions, the toss |
| `single(who)` | telephoto single, `FRAME[who]` (Safadi right of frame, the kids left) | most lines |
| `safHeart`, `safBoard`, `houSponsor` | singles with a push-in / room for a board / the sponsor framing | beats 1, 3, 8, the sponsor |
| `title` | blurred three-shot + slammed title | title card |
| `dreamGoal` | reverse, behind the north goal, dolly-zoom | Alma's daydream |
| `dreamMeal` | centre circle, telephoto | Housam's daydream |
| `toast` | kids-only two-shot | toast, gulp, freeze, crumple |
| `label` | blurred background + a big bottle | the sticker reveal |
| `finale` | wide on the cooler and the shelter | the ending |

## Notes for editing (`scene.js`)

- **Blocking:** `HOU_T`, `ALM_T` and `SAF_T` are the moves (`[t0, t1, x0, z0, x1, z1]`). `seatK(t)` is Safadi sitting on the cooler, and `lidAt(t)` is the lid angle.
- **Timing constants:** `SLAM1`, `SLAM2`, `SPLASH`, `YANK`, `CROSS`, `TOSS`, `CLINK`, `GULP`, `CRUMPLE`. Move them together with the matching cues in `asset.js`.
- **Props (all in `scene.js`):** `cooler()` (3D, with a hinged lid, ice and caps), `bottle()` (a generic sports bottle with a tea-brown neck and the hidden sticker side), `sunglasses()`, `paper()`, `sweat()`, `puddle()`, the sponsor banner in `extras()`, and the thermos in `finale()`.
- **Rig addition:** Housam gained `eyes: 'squeeze'` and `mouth: 'wobble'` for the tea grimace.
- The bottles carry no real brand. The essay's brand names stay out of the picture.
