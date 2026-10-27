# Cleaning Up 4 · Robots vs. Titans

> A music video, the finale of the *Cleaning Up* arc ([28](../scene28_cleaning_up/README.md) → [29](../scene29_cleaning_up_2/README.md) → [30](../scene30_cleaning_up_3/README.md)). Professor Safadi's "know thyself" story comes back, and it's huge. A **giant Robo-Safadi** stomps into ancient Athens, still running Housam's program (*"CLEAN! UP! ATH-ENS!"*), and vacuums the citizens into his chest like toys. Housam, Alma, Jenna and Danny run for it, make a plan, and race to the Roman bathhouse, where Professor Safadi is soaking in his tub and Dr. Sami stands by. Safadi tells them to relax and know themselves. Sami: *"Brother, stop! There's no time to think!"* The robot rips the roof off. The twins summon the titan: **King Neptune** bursts out of the sea, taller than the Acropolis, and fights the robot across the bay. Too many people in his chest junction: the hatch bursts, the citizens float down on Neptune's bubbles, and the robot topples into the sea. Athens dances. Safadi's moral: *"The best kind of cleaning is done by… YOU!"* *"That's fin-tastic!"* **THE END.**

| | |
|---|---|
| **Length** | 175.3 s, cut to the song `audio.mp3` (*Athens: The Fin-tastic Showdown*, generated with Gemini). The music ends at 170.3 s; the last two lines are spoken over the tail |
| **Style** | A music video in the manner of [PDoomVideo](../../../../PDoomVideo/STORYBOARD.md) and [scene 17](../../halloween/scene17_broccoli_directive/README.md): something happens in every shot, the camera always moves and hits on the beat, the jokes are told with pictures, and the karaoke runs along the bottom with the singer's name. Not confined to a set: painted Athens skylines at the scale of giants, the [ancient Athens](../../../locations/ancient_athens/README.md) agora and [the Roman bath](../../../locations/roman_bath/README.md) for the ground-level shots, and Greek-vase motion graphics (black figures on terracotta) for the choruses |
| **Cast** | [Robo-Safadi](../../../characters/robo_safadi/README.md) (giant) · [King Neptune](../../../characters/neptune/README.md) (titan) · [Housam](../../../characters/housam/README.md) · [Alma](../../../characters/alma/README.md) · [Jenna](../../../characters/jenna/README.md) · [Danny](../../../characters/danny/README.md) · [Professor Safadi](../../../characters/safadi/README.md) and [Doctor Sami](../../../characters/sami/README.md) (both in `outfit: 'greek'`) · [Students](../../../characters/student/README.md) (the citizens, in `outfit: 'greek'`) |
| **Locations** | Painted Athens backdrops (`props.js`) · [Ancient Athens](../../../locations/ancient_athens/README.md) · [The Roman bath](../../../locations/roman_bath/README.md) |

## The rules this scene keeps

- **The robot is still running the clean-up program from scene 29.** He treats the citizens exactly like Alma's toys: they spiral into his chest hatch the way the toys did.
- **Size tells the story.** The robot and Neptune are drawn as giants against the city: the robot looms over the Parthenon; Neptune is taller still.
- **Palette arc:** peaceful dawn gold → alarm red and orange (the attack) → terracotta and black (the vase choruses) → bathhouse aqua and marble → cosmic violet (Delphi) → storm indigo (the summoning) → sunset fire (the battle) → golden morning (the celebration) → night stars (the legend) → warm sunset (the moral).
- **Text-light.** The karaoke carries the words. On screen: the title, ΓΝΩΘΙ ΣΕΑΥΤΟΝ (the point of the lesson), and a few big sound effects on the hits (THUD, SHLOOOP, SPLOOSH, CRACK, ZAP, KA-CHUNK).

## Song map and shot list

Times are seconds into `audio.mp3`. Every sung word's start time lives in [`lyrics.js`](lyrics.js) (a word-level transcription of the recording with faster-whisper, corrected to the lyric sheet); the beat times (≈117.5 BPM, drifting slightly) come from beat tracking and live there too.

| Time | Section · singer | Lyric | Shot (`scene.js`) |
|---|---|---|---|
| 0–3.7 | Intro | — | **dawn**: peaceful Athens at sunrise: the Acropolis, white houses, the sea, citizens in the agora, birds. The water in an amphora starts to tremble |
| 3.7–5.75 | | *(Thud! Thud!)* | **thud**: street level: a giant metal oxford slams down, THUD; pots jump, dust rings; the second foot, THUD |
| 5.75–8.1 | Robo-Safadi | *"CLEAN! UP! ATH-ENS!"* | **rise**: tilt up a giant Robo-Safadi towering over the Parthenon against a red sky: eyes go red on CLEAN, the antenna sparks on UP, the chest hatch swings open on ATHENS |
| 8.1–9.8 | citizens & kids | *"Look out! Run!"* | **scatter**: the agora: the citizens and the four kids run in every direction as the robot's shadow sweeps over |
| 9.8–11.95 | Robo-Safadi | *"CLEAN! UP! ATH-ENS!"* | **vacuum**: the beam switches on: a swirling cone from his chest to the ground; citizens lift off, tumble and get sucked in: SHLOOOP |
| 11.95–15.5 | | — | **title**: ROBOTS vs. TITANS on a spinning amphora: the robot's black figure on the left, a trident rising out of painted waves on the right |
| 15.5–17.8 | Housam | *"We've gotta run, we've gotta hide!"* | **housamRun**: a side-scrolling market street; Housam dribbles, the robot strides over the rooftops behind; on *hide* he dives behind a big amphora |
| 17.8–19.85 | Alma | *"He's vacuuming up everyone inside!"* | **almaLook**: Alma close, looking up in horror; behind her citizens spiral up into the beam like her toys did |
| 19.85–21.85 | Jenna | *"It's a robotic mess in the public square!"* | **jennaWheel**: Jenna cartwheels across the square, dodging the beam's red target circle; a statue gets sucked up instead |
| 21.85–23.8 | Danny | *"He's sucking up students from everywhere!"* | **dannyColumn**: Danny clings to a column, blown flat like a flag, as students whoosh past him into the beam |
| 23.8–26.0 | Housam & Jenna | *"To the bathhouse now, we must make haste!"* | **runToCam**: the four kids sprint toward the lens down a colonnaded street; a giant foot lands behind them |
| 26.0–27.6 | Alma & Danny | *"There's not a single second left to waste!"* | **runMap**: a papyrus map of Athens: four kid-head markers race along a dotted line from the agora to the baths, a robot marker stomping after them |
| 27.6–29.7 | the kids | *"The gears are turning, the vacuum is loud!"* | **gears**: inside the robot: brass gears turn, the turbine spins, sound rings pulse on the beat |
| 29.7–32.0 | | *"He's sweeping up the entire crowd!"* | **sweep**: wide: the beam sweeps across a line of citizens like a broom, lifting them one per beat |
| 32.0–35.3 | | *"We need a plan, and we need it fast!"* | **plan**: the kids huddle in an alley; Housam scratches the plan in the dust (robot → bathtub → !) and they nod on the beats |
| 35.3–38.1 | | *"To make this epic battle last!"* | **heroes**: low angle, the four kids stand up in a row, wind in their hair, the robot's red eyes behind; flash |
| 38.1–41.45 | Chorus 1 · kids | *"Robots vs. Titans! Stand your ground!"* | **vaseVS**: the amphora again: black-figure robot and black-figure crowned dolphin face off; the kids' figures plant their feet |
| 41.45–45.6 | | *"The biggest showdown in this ancient town!"* | **showdown**: the skyline at a red sunset: the robot stomping on the left, a whirlpool stirring in the sea on the right, lightning |
| 45.6–49.7 | | *"With cogs and gears and mythical might!"* | **cogsMyth**: a zig-zag split screen: steel gears and a red robot eye on one side, waves and a crown glinting under water on the other; the split jumps on the beats |
| 49.7–54.1 | | *"We're gonna win this colossal fight!"* | **colossal**: on a rooftop the kids show off their powers, one per beat: Alma's rainbow floor, Housam's kick, Jenna's cartwheel, Danny's block |
| 54.1–57.85 | | *"Robots vs. Titans! Watch the show!"* | **watchShow**: the Theatre of Dionysus: rows of citizens in tunics cheer and point; comedy and tragedy masks swing |
| 57.85–61.6 | | *"Who will win? We're about to know!"* | **whoWins**: a black-figure balance scale tips between the robot and Neptune on the beats; a water wipe into the bath |
| 61.6–65.55 | Verse 2 · Safadi | *"Ah, my dear students, why such a fuss?"* | **bathIn**: the bathhouse: the kids burst in panting; Safadi soaks in his bubbly tub, Sami holds a towel |
| 65.55–69.75 | | *"This giant machine shouldn't trouble us!"* | **notTrouble**: Safadi waves it off, twirling his soap; through the arches the giant robot sucks up people in the distance |
| 69.75–73.45 | | *"Sit in the water, relax your mind,"* | **sitWater**: Safadi closes his eyes, zen; bubbles float up with music notes; Danny dips a toe |
| 73.45–77.2 | | *"And see what philosophy you can find!"* | **philosophy**: his powers come on; the steam shapes itself into an owl, a scroll, a star map; the kids look at each other: ? |
| 77.2–83.0 | | *"Gnōthi seauton: know thyself, you see!"* | **gnothi**: the steam opens on a cosmic temple of Apollo at Delphi; ΓΝΩΘΙ ΣΕΑΥΤΟΝ lights up letter by letter on the pediment |
| 83.0–87.85 | | *"That is the key to true victory!"* | **reflect**: the quiet bar: each kid leans over the tub and sees a hero in the water: Alma's rainbow, Housam's ball, Jenna's leap, Danny's block |
| 87.85–91.4 | Sami | *"Brother, stop! There's no time to think! The city is right on destruction's brink!"* | **samiStop**: Sami shakes his brother; on *brink* the roof tears away and the robot's giant face peers in |
| 91.4–95.8 | Bridge · Safadi | *"All right, all right, the lecture must end!"* | **allRight**: Safadi stands up in the tub, sighs, then sets his jaw |
| 95.8–97.85 | Sami | *"It's time for a titan we must ascend!"* | **titanTime**: Sami points out through the arches to the sea; the sky darkens |
| 97.85–100.05 | Safadi | *"With soap in hand and a watery splash!"* | **soapSplash**: Safadi raises the glowing soap like a relic and slams it into the water: SPLASH |
| 100.05–103.75 | Sami | *"Let's make an entrance and settle this smash!"* | **entrance**: the twins on the bathhouse steps facing the stormy sea, auras on, the kids behind them |
| 103.75–106.3 | the twins | *"King Neptune! Arise from the sea!"* | **summon**: both raise their arms; beams of gold and mint shoot to the horizon; the sea spins into a whirlpool |
| 106.3–108.65 | | *"By the power of the seven seas!"* | **sevenSeas**: seven waterspouts rise around the bay, one per beat, rainbow light building |
| 108.65–110.0 | | *(Sploosh! Splash! Boom!)* | **titanRise**: King Neptune bursts out of the sea, taller than the Acropolis, crown, trident and rainbow |
| 110.0–112.0 | Battle · Neptune | *"Bow before King Neptune! Well, you don't have to bow!"* | **bowBefore**: nose up, crown wobbling; the tiny citizens bow; he waves a flipper and they pop back up |
| 112.0–115.8 | | *"I am here to save Athens, and I am doing it now!"* | **surf**: Neptune rides a giant wave into the bay toward the robot; the robot turns, eyes red |
| 115.8–118.2 | | *"That's fin-tastic, wouldn't you say?"* | **finTastic**: Neptune close: a wink, a sparkle, the trident crackles |
| 118.2–121.7 | | *"This over-sized Hoover is going away!"* | **beamClash**: the vacuum beam against the rainbow water blast; they meet in the middle and push back and forth |
| 121.7–124.45 | Robo-Safadi | *"CLEAN! UP! ATH-ENS!"* | **roboClean**: the robot close, red, full power: the vacuum starts drinking Neptune's water |
| 124.45–128.05 | | *"ERROR! MALFUNCTION! Too many people in my chest junction!"* | **overload**: the chest bulges with citizens and seawater; sparks, steam, X eyes |
| 128.05–129.85 | | *(Crack! Zap! Ka-chunk!)* | **crackZap**: three hits, three panels: CRACK (trident lightning), ZAP (sparks), KA-CHUNK (the latch breaks) |
| 129.85–134.0 | Neptune | *"With a crack of my trident and a flip of my tail! This giant tin can is destined to fail!"* | **tailSlap**: a crack of the trident, then a tail-slap that spins the robot's head round |
| 134.0–138.15 | | *"The chest has burst open with a mighty sound!"* | **burst**: the hatch blows open: citizens pour out in an arc and float down in Neptune's bubbles; the robot powers down and topples into the sea |
| 138.15–141.8 | Final chorus · everyone | *"Robots vs. Titans! The day has been won!"* | **dayWon**: golden morning: the robot sits powered-down in the bay with a rubber duck; Neptune poses on him; the kids cheer on the Acropolis steps |
| 141.8–145.65 | | *"The citizens are free and the battle is done!"* | **freed**: bubbles land in the agora and pop; citizens hug and dance |
| 145.65–149.75 | | *"With a hero from the ocean and kids who stood tall!"* | **rideWave**: the kids ride on Neptune's back across the bay |
| 149.75–154.15 | | *"We proved that togetherness can conquer it all!"* | **sirtaki**: everyone in a Greek line dance on Alma's rainbow floor, kicking on the beats |
| 154.15–157.8 | | *"Robots vs. Titans! A sight to behold!"* | **newVase**: the story paints itself onto a new amphora: Neptune, the kids, the robot in the sea |
| 157.8–161.25 | | *"The greatest adventure that ever was told!"* | **legend**: night over Athens: stars join into a dolphin constellation; fireworks |
| 161.25–165.75 | Outro · Safadi | *"So remember, my friends, when a big job is due,"* | **remember**: sunset on the Acropolis steps: Safadi lectures, finger up; the robot in the bay behind |
| 165.75–168.75 | | *"The best kind of cleaning is done by…"* | **sweepUp**: the kids happily sweep up the agora themselves |
| 168.75–170.0 | | *"…YOU!"* | **byYou**: Safadi points straight down the lens |
| 170.0–171.7 | | *"And of course, knowing oneself!"* | **oneself**: hand on heart; the kids roll their eyes |
| 171.7–175.3 | Neptune | *"That's fin-tastic!"* | **finTag**: Neptune pops into frame and winks; the iris closes on his starfish; THE END |

## Notes for editing

- **Files:** `props.js` (prefix `rvt`: the painted Athens skylines, the Parthenon, the sea and waves, the vortex beam, gears, the amphora and black-figure painting, splashes, bubbles, waterspouts, lightning, Delphi, the map, brooms, the rubber duck), `lyrics.js` (`RVT_LYRICS`, `RVT_BEATS`, the karaoke), `scene.js` (the shots).
- **Re-timing:** fix a word time in `lyrics.js` and the karaoke and every mouth that sings it follow. The shots read their hit times from the `L` table at the top of `scene.js`, taken from the same word times.
- **Beats:** `RVT_BEATS` holds the tracked beat times; `bp(t)` pulses on the nearest beat before `t`, so hits stay on the music even where the tempo drifts.
- **Black figures:** the vase shots draw the ordinary rigs into a layer with `filter: brightness(0)`, which turns them into black silhouettes on terracotta.
- **Giants:** the giant robot and Neptune are the ordinary rigs at large `s` against the painted skylines (`rvtSkyline`), so every option (hatch, glitch, power, blast) still works.
