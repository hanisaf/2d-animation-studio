# The Trolls · Who's Inside?

> A third take on the finale of *The Trolls*, to choose between it, [scene 48](../scene48_the_trolls/README.md) and [scene 48b](../scene48b_guess_who/README.md). Seven of Alma's monsters take the stage one at a time, with nothing to give away who is inside. Each sings the audience a tongue-twister riddle. After two beats to guess, the costume pops off and a second twister says who it was. The song, **"Who's Inside?"**, was made with Lyria ([`lyria/`](lyria/README.md)).

| | |
|---|---|
| **Length** | 214 s · 24 fps · 120 bpm (beats at 0 + 0.5 n s, bars of 2 s) |
| **Cast** | only the Safadi brothers and the kids, each in one of Alma's monsters: [Danny](../../../characters/danny/README.md) (the pumpkin) · [Alma](../../../characters/alma/README.md) (the pink ghost) · [Housam](../../../characters/housam/README.md) (the blue bird) · [Jenna](../../../characters/jenna/README.md) (the bee) · [Sarah](../../../characters/sarah/README.md) (the cat) · [Doctor Sami](../../../characters/sami/README.md) (the owl) · [Professor Safadi](../../../characters/safadi/README.md) (the bat). Alma's skull ghost sits this one out. |
| **Location** | the game-show stage, drawn in `scene.js` |
| **Costumes** | Alma's real drawing, cut out into PNGs by [`../scene48b_guess_who/costumes/cut.py`](../scene48b_guess_who/costumes/cut.py) and loaded from that folder. The PNGs are not in git: without them `scene.js` draws crayon stand-ins of each monster. |
| **Audio** | `audio.mp3`, "Who's Inside?", made with Lyria 3 from the riddle timing and lyrics below: the seven riddles in one take, then the encore (recap, dance, laughter) in a second take, joined on the beat at 184 s. How it was made, and how to make another take: [`lyria/README.md`](lyria/README.md). |

## What's different from 48 and 48b

- **No hints at all.** Every costume is drawn the same height, and there are no legs, shoes or hands under it. Nobody's size gives them away either.
- **No words on screen.** There are no speech bubbles and no karaoke, so any recording fits. Each riddle is told with three picture cards. On the reveal the cards flip over and each gets a green tick. The only text in the whole video is the title, the riddle numbers 1–7, Housam's curve equation, Safadi's chalkboard and THE END.
- **One riddle at a time,** each one 24 s (12 bars). The monster drops in. Its twister runs once, then again while the cards spin around it. The lights go down for two beats while the audience guesses. Then POP, and the answer shows off for 5 s.

## The riddle, beat by beat (every riddle, `L_…` in `scene.js`, measured on the song)

| Local time | Bars | What you see | What the song should do |
|---|---|---|---|
| 0–2 | 1 | the costume drops into the spotlight, a ? beside it, the number badge | a hit and "Who's this?" |
| 2–9.5 | ~4 | three picture cards pop in, one per bar | the riddle twister, first time |
| 9.5–17.5 | 4 | the cards spin around the monster, faster and faster; the camera rocks | the same twister again |
| 17.5–18.5 | ½ | lights down, the costume trembles, ? ? and three dots light up | the music drops out |
| 18.5 | | POP: flash, starburst, the costume flies off spinning, the stage turns the answer's colour | the crash; "It's …!" |
| 19.3–20.9 | | the three cards flip over and get a green tick, one per beat | the answer twister |
| 18.5–23.5 | 2½ | the answer shows off (below), its first move at double speed (`SHOW` in `scene.js`) | the answer twister, twice |
| 23.5–24 | | a colour wipe | |

## Sections

| Time (s) | Shot (`scene.js`) | What happens |
|---|---|---|
| 0–6 | `title` | THE TROLLS on crayon paper; the seven costumes pop up one per beat, the same size, a ? over each; WHO'S INSIDE? |
| 6–12 | `onStage` | the curtains open on the seven hopping together; six hop off to the wings and the pumpkin stays in the spotlight |
| 12–36 | `riddle(0)` | 1 · the pumpkin → **Danny** |
| 36–60 | `riddle(1)` | 2 · the pink ghost → **Alma** |
| 60–84 | `riddle(2)` | 3 · the blue bird → **Housam** |
| 84–108 | `riddle(3)` | 4 · the bee → **Jenna** |
| 108–132 | `riddle(4)` | 5 · the cat → **Sarah** |
| 132–156 | `riddle(5)` | 6 · the owl → **Doctor Sami** |
| 156–180 | `riddle(6)` | 7 · the bat → **Professor Safadi**, and his twin slides in |
| 180–190 | `recap` | the seven costumes drop into a line ("All seven monsters line up to dance!"), the encore begins at 184 ("Here they are! Let's give a cheer!"), then they pop off one per half beat to the sung "pop pop pop…" (188.25–189.75): all seven faces |
| 190–208 | `dance` | the crash and the chorus: each one does their own moves, the empty costumes bounce over their heads like beach balls |
| 208–214 | `theEnd` | the music drops out, everyone laughing, THE END, iris out |

## The seven riddles

These are the lyrics Lyria was given (nothing is written on screen); it sings them close to this, with a few slips ("Super Sarah, sighing, spiking"). Each riddle twister is sung twice (2–9.5 s, then again at 9.5–17.5 s). The answer twister starts on the POP.

| # | Costume | Picture cards | Riddle twister | Answer twister | What they show off |
|---|---|---|---|---|---|
| 1 | pumpkin | soccer ball · grass block · block tower | *Fuzzy pumpkin, quick kick tricks, stacks sixty sticky square blocks! Who kicks quick and builds big block towers in his silly socks?* | *It's Danny! Dashing Danny, dribbling, building block by block!* | dribbles across the stage, then a block tower grows beside him, one block per beat |
| 2 | pink ghost | music notes · disco ball · crayon | *Pink ghost glides and twirls and swirls, a sparkly spinning sight! Who dances dizzy disco and drew these monsters late at night?* | *It's Alma! Amazing Alma, the artist who drew us all!* | twirls with her dance powers on; then her drawing pops up beside her and the seven monsters appear on it one by one |
| 3 | blue bird | a curve with a ball · π · trophy | *Blue bird flips the ball up high and figures how it flies! Who counts curves and kicks the goal with numbers in his eyes?* | *It's Housam! High-flying Housam, the hat-trick math whiz!* | juggles, then kicks: the ball flies along a dashed parabola under *y = −x² + 4x*; eureka! |
| 4 | bee | cartwheel · pencil · comic page | *Busy bee bends backwards, bounces, buzzing bright! Who cartwheels quick, then sketches comic heroes left and right?* | *It's Jenna! Jolly Jenna, jumping, drawing jokes!* | a double cartwheel across the stage, a star jump, then she draws her comic |
| 5 | cat | saw · phone · volleyball | *Stripy cat saws sixty sticks and sends a speedy text! Who spikes the ball and shakes her hair, the rebel coming next?* | *It's Sarah! Super Sarah, sawing, spiking, so cool!* | a volleyball spike, woodworking at her bench, then her rebellion hair |
| 6 | owl | stethoscope · heart · broccoli | *Hooting owl with happy hearts says healthy habits, please! Who checks your chest and cheers for greens and broccoli and peas?* | *It's Doctor Sami! Silly, smiley Doctor Sami!* | the stethoscope, then his mint health aura and a healthy-plate board |
| 7 | bat | chalkboard · light bulb · pointer | *Big bat brings big brainy boards, explains, explains, explains! Who proves the problems properly, with pointers, chalk and brains?* | *It's Professor Safadi! …and his twin brother too!* | super explaining: the glow, the idea bulb, a graph board; then Doctor Sami slides in and the brothers laugh together |

Intro (0–12): *Seven little monsters on the stage tonight, / twist your tongue and guess who's hiding inside! / Listen to the riddle, say it fast, say it slow, / one, two, three, here we go!*

Finale (184–214), the encore take: *Here they are! Let's give a cheer! / Pop pop pop pop pop pop pop!* then *Twist it, troll it, now you know, / seven silly monsters in the show!* (sung twice), the music drops out at about 207, laughter, and a short button to the end. (The lines *The professor, the doctor and all of the kids, / tongue-tied and laughing at what we did!* were asked for but not sung.)

## Notes for editing (`scene.js`)

- **Timing:** the section constants (`S_…`, `R0(i)`, `RL`), the riddle's inner beats (`L_RID`, `L_FAST`, `L_GUESS`, `L_POP`, `L_CARDS_OFF`, `L_OUT`) and the recap's pops (`P_POP`), all measured on `audio.mp3`. With a new take of the song, measure it again (`lyria/README.md`) and move them.
- **Riddles:** `RID[name]` holds each riddle's three `clues` (pictures in `ICON`), its colour `col` and `act(x, y, s, t, a)`, which draws the answer at show time `a` (`SHOW(seconds after the POP)`, 0 … 7.5). The order is `ORDER`.
- **Costumes:** `costume(kind, x, y, h, t, o)` draws a drawing standing on (x, y), always `h` px tall (wide ones are fitted to the same width), with `sq`, `rot`, `shake` and `off` (0–1: it flies off). Without the PNGs it draws `STAND[kind]`.
- **Cards:** `cardAt(j, lt)` choreographs the three cards: home slots, the orbit, the row on top, the flip and tick, then away at `L_CARDS_OFF`. `card(icon, …)` draws one. Keep them as pictures only.
