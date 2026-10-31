# Scene 20b: The Broccoli Directive 2.0

> Later on Halloween night. The kids pull the sheet off Robo-Safadi and switch him back on. While he was off, his firmware "updated" from the YouToon analytics ([scene 47](../../the_trolls/scene47_troll_analytics/README.md)): **SILLY SELLS**. He has a new directive. Four little monsters come knocking: the kids in Alma's costumes from [The Trolls](../../the_trolls/scene48d_alma_costumes/README.md). His scanners can't see who's inside, so every monster gets a tongue twister: **twist it or eat it.** Danny and Housam nail theirs (CANDY!), and Jenna and Alma flub (BROCCOLI!). Then the winners share their candy, everybody takes a bite of broccoli, and Robo blasts off over the moon: *"Game over, humans! Beep boop! See you next Halloween!"*

| | |
|---|---|
| **Length** | 120 s · 24 fps · 120 bpm (beats at 0.225 + 0.5 n s, bars of 2 s) |
| **Cast** | [Robo-Safadi](../../../characters/robo_safadi/README.md) · [Danny](../../../characters/danny/README.md) (the pumpkin) · [Jenna](../../../characters/jenna/README.md) (the bee) · [Housam](../../../characters/housam/README.md) (the blue bird) · [Alma](../../../characters/alma/README.md) (the pink ghost). Kids and Robo only. |
| **Look** | a music video like [scene 17](../scene17_broccoli_directive/README.md): its `halloween.js` backdrops and props (`uses: ['scene17_broccoli_directive']`), the karaoke along the bottom (Robo's words light up green, the kids' orange) |
| **Costumes** | Alma's real drawings, `../../the_trolls/scene48_the_trolls/costumes/{pumpkin,bee,bird,pink_ghost}.png`, worn over each kid with scene 48d's `costume()`, `springUp()` and `HIDE`. On the POP the drawing flies off and the kid springs up. |
| **Audio** | `audio.mp3`, **"The Broccoli Penalty"**, made with Gemini from [`lyria/PROMPT.txt`](lyria/PROMPT.txt). The karaoke is in `lyrics.js`. The song ends at about 118 s. |

## What the song changed

Gemini didn't follow the prompt everywhere, so the story follows the song:

- **Battles 3 and 4 have new twisters.** *"Leo's lazy lizard leaps"* (sung by a boy, nailed) and *"Molly's messy monkey makes massive chocolate milkshakes"* (sung by a girl, flubbed). So the blue bird is Housam and he wins. The pink ghost is Alma and she gets the broccoli. A twister doesn't have to be about the person saying it. The picture cards show a lizard and a monkey.
- **There's no "Robo, your turn!"** After the battles, the song repeats the chorus and ends with *"Game over, humans! Beep boop! See you next Halloween!"* The ending moved into the picture: in the second chorus the winners share their candy (Robo's eyes turn to hearts), and on *"or eat broccoli!"* all four take a bite. In the outro Robo eats a candy, and this time nothing glitches (the opposite of 17's ending). Then he blasts off across the moon.

## Song map and shot list

| Time | Section | Lyric | Shot |
|---|---|---|---|
| 0–8.1 | Intro | (spooky riff, whoosh at 6.1) | **dustOff**: *LATER IN HALLOWEEN NIGHT…* A cobwebbed sheet on the porch at night. The four monsters tiptoe in from both sides and yank it off at 6.12. Robo stands dark, and the camera pushes in |
| 8.1–12.2 | Boot-up | *Beep. Boop. Rebooting… Downloading update… Directive two-point-oh!* | **reboot**: a close-up. BEEP turns the eyes on, BOOP lights the antenna, then a REBOOTING / DOWNLOADING UPDATE progress bar. A YouToon card slides in with a rising line: SILLY SELLS! On *Directive* he turns red |
| 12.2–16.0 | | *(two-point-ohhh)* | **title**: THE / BROCCOLI / DIRECTIVE / **2.0** slam in on the beats. Robo hovers in and rushes the lens |
| 16.0–23.8 | Verse | *Four little monsters knocking on my door, my scanners can't see who you are anymore.* | **unknownUnits**: Robo's red night-vision HUD. Reticles lock onto the four monsters (UNIT ?). On *can't* the HUD glitches: ERROR, ? ? ? |
| 23.8–32.2 | | *New directive, here's the deal: twist your tongue, or broccoli's your meal!* | **deal**: a hero shot with a lollipop in one gripper and broccoli in the other. A pink spiral on TWIST YOUR TONGUE, then the broccoli thrusts at the lens: BROCCOLI! |
| 32.2–48.2 | Chorus | *Twist it or eat it! (EAT IT!) Say it five times fast! …* | **chorus**: the sunburst. TWIST IT / OR / EAT IT!, ×5, FAST!, BROCCOLI!, EVERYBODY! The monsters bounce in a row and jump on each EAT IT!, while Robo conducts with a broccoli baton |
| 48.2–60.2 | Battle 1 | *Danny's dizzy cube drops* ×2, then the pumpkin ×2 · CANDY! | **battle(0)**: WHO'S INSIDE? and a reticle on the pumpkin. Robo sings with a picture card (a dizzy Rubik's cube). The pumpkin nails it, bouncing and sparkling. POP at 58.33: Danny, with candy arcing into his bucket |
| 60.2–72.2 | Battle 2 | *Jenna's giraffe giggles, jiggling jelly jars* · *Jenna's jiraffe jiggles… giggly… jelly… JARS?* · BROCCOLI! | **battle(1)**: a giggling giraffe and jelly jars on the card. The bee wobbles and sweats. POP: Jenna, laughing (*hee hee!*), takes the broccoli from the gripper |
| 72.2–84.2 | Battle 3 | *Leo's lazy lizard leaps* ×2, then the bird ×2 · CANDY! | **battle(2)**: a sleepy lizard mid-leap. The blue bird nails it. POP: Housam cheers, and candy falls into his bucket |
| 84.2–96.0 | Battle 4 | *Molly's messy monkey makes massive chocolate milkshakes* · *Molly's… monkey… milk… shake… messy… MONKEY?* · BROCCOLI! | **battle(3)**: a messy monkey and a dripping milkshake. The pink ghost sweats and tangles. POP: Alma, mouth open, gets the broccoli |
| 96.0–112.2 | Chorus | (the chorus again) | **chorus2**: the kids in a row, Robo hovering. Danny tosses candy to Jenna, then Housam to Alma: SHARING! Robo's eyes turn to hearts: SWEET! Then everybody dances in candy confetti, and on *or eat broccoli!* all four take a sporting bite: …AND BROCCOLI! |
| 112.2–120 | Outro | *Game over, humans! Beep boop! See you next Halloween!* | **outro**: night, a huge moon, the kids waving from the hill. A salute; on *Beep boop* he pops a candy in (heart eyes, no glitch). Then he blasts off across the moon. Iris, THE END |

## Timing

- **Beat grid.** Onset strength folded at every tempo from 114 to 122 bpm peaks hard at exactly 120 bpm, with the beat phase at 0.225 s. Every section starts on a bar, `BAR(n) = 0.225 + 2n`.
- **Words.** The vocals were separated from the mix with the Spleeter 2-stem model (sherpa-onnx). Whisper (base.en) was then run on overlapping 1.5–4.5 s windows of the vocal stem to find where each line falls. Inside a line, words sit on vocal onsets (librosa) where they line up, and are spread by syllable where they don't. The battles (*Who's inside?* → twister → try → verdict) and the verdicts at 58.38, 70.72, 82.62 and 94.70 s are what the picture is cut to (`BATTLES` in `scene.js`).
- Fix a word or a time in `lyrics.js` and the karaoke and Robo's mouth follow.
