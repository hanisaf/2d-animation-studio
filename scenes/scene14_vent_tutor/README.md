# Scene 14: A Breath of Innovation

> Doctor Sami introduces Vent-Tutor in the lecture hall: a professional mechanical ventilation simulator that makes patient–ventilator interactions visible through interactive waveforms. His enthusiasm turns a software demonstration into a playful invitation to experiment.

| | |
|---|---|
| **Length** | 68 s · 24 fps · 1632 frames |
| **Cast** | [Doctor Sami](../../characters/sami/README.md) |
| **Location** | [Lecture hall](../../locations/lecture_hall/README.md) |
| **Sound** | Warm, upbeat synthesized underscore and Sami's cartoon voice, synchronized with the speech bubbles |
| **Movie** | #14 |

## Synopsis

Sami welcomes the audience with an open-palmed flourish. A large demonstration display lights up beside him: **vent-tutor**. Three animated traces reveal pressure, flow, and volume. A cursor moves across them, highlighting one moment in the simulated breath.

Sami calls the app a professional simulation of patient–ventilator interactions, then celebrates its interactive waveforms: “Every breath tells a story!” He points as the cursor selects volume control, pressure control, and pressure support in turn. The active tab and the traces change together.

Next, the cursor selects a clinical scenario with changed lung mechanics. A schematic pair of lungs and the waveforms respond. Sami moves his hand as a setting slider travels; the audience sees a before-and-after comparison. Reset returns the demonstration to its starting state. Sami jokes that the simulated patient has infinite patience, then closes with: “Vent-Tutor. Turn curiosity into understanding—one simulated breath at a time.”

## Script and shots

Dialogue timings and wording are defined in `asset.js`; the same entries drive bubbles, mouth animation, and synthesized vocalizations.

| Shot / time | Dialogue / action |
|---|---|
| Welcome · 0–10 | 0.8: “Meet *Vent-Tutor*—a breath of innovation!” 5.2: “A *professional simulator* for mechanical ventilation.” Sami presents the display; camera gently pushes toward the stage. |
| Waveforms · 10–22 | 10.4: “Explore how a *patient and ventilator* interact.” 15.6: “*Interactive waveforms!* Every breath tells a story.” The cursor sweeps across pressure, flow, and volume, with aligned inspection markers. |
| Modes · 22–36 | 22.4: “Explore *different ventilation modes*...” 27.6: “...and watch the simulation respond as you switch!” Tabs cycle through volume control, pressure control, and pressure support. |
| Scenario · 36–44 | 36.4: “Try a *clinical scenario*. Change the lung mechanics.” The scenario selector changes, the lung schematic changes, and traces morph. |
| Settings · 44–54 | 44.4: “Adjust the *settings*. Compare the waveforms.” 49.2: “Ask *what if?* Then try it and see!” Cursor drags a setting slider; a faint earlier trace remains for comparison. |
| Reset · 54–59 | 54.2: “And reset! This patient has *infinite patience*.” Cursor presses Reset; original mode, scenario, and settings return. Sami gives a happy grin. |
| Invitation · 59–68 | 59.4: “*Vent-Tutor.* Turn curiosity into understanding...” 63.6: “...one *simulated breath* at a time.” Camera settles; Sami opens both palms and the display holds the app name and benefit statement. |

## Visual and editing notes

- The app display is an illustrative animation, not a reproduction of an actual Vent-Tutor interface or a working simulator. Waveforms are stylized and omit clinical values; they demonstrate the requested feature categories rather than validated physiology.
- Use one bubble at a time in the left portion of the frame; keep the demonstration unobstructed on the right. Mint, cyan, and gold distinguish the three traces.
- Cursor movement, tabs, scenario changes, slider position, reset, acting, and traces are deterministic functions of scene time. Scrubbing and frames rendered out of order reproduce the same demonstration.
- Spoken claims follow the supplied app description. The scene provides no patient-specific ventilation advice.

## Preview

Open the scene in the studio, or render a contact sheet:

```bash
node render.mjs --scene=scene14_vent_tutor --sheet=3,13,19,24,29,34,40,47,52,57,65 --cols=3 --out=out/scene14_vent_tutor/contact-sheet.jpg
scripts/build_scene.sh scene14_vent_tutor
```
