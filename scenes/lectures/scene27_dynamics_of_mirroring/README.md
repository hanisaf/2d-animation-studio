# Scene 27: Dynamics of Mirroring

> Alone in the lecture hall, Professor Safadi walks the camera through his paper on mirroring in open-source software, one chalk panel at a time: the mirror mists, the mirror focuses, and projects evolve.

| | |
|---|---|
| **Length** | 319 s (about 5¼ minutes, set by the recorded voice at 1.15× tempo) · 24 fps |
| **Cast** | [Professor Safadi](../../../characters/safadi/README.md), the only character |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big chalkboard** (`bigBoard`). Safadi stands on the pit floor at (−600, 0, 1840), in front of the lectern and left of the board |
| **Source** | Safadi, H. & Tiwana, A. (2026). *Dynamics of Mirroring: Temporal Sequencing of Mirror-Misting and Mirror-Focusing in Open-Source Evolution.* Journal of the Association for Information Systems |
| **Model** | The Observable lesson [Dialysis Access Recirculation](https://observablehq.com/@samisaf/access-recirculation): a presenter beside a large board, numbered panels (`02 / 12`), diagrams that build as he talks, one bubble at a time, a progress strip |
| **Sound** | Safadi speaks every line in Gemini TTS (`gemini-3.1-flash-tts-preview`, voice **Charon**), stored in `voice.js` and `voice/`; a quiet underscore with a soft *plip* at every panel change and a chime at "orchestrating oscillations" |

## Synopsis

The camera starts in the empty rows and finds Safadi beside a wide chalkboard that fills the front wall. He introduces the paper, then works through twelve panels. Each one is erased with a sweep and the next chalks itself on, piece by piece, as he mentions each part: the mirroring hypothesis (Alice and Bob, UI / Logic / Data), the open-source puzzle (a donut that fills to 56%), snapshot versus movie, state versus dynamics (a live Q ruler and a zigzag of focusing and misting), the 2×2 of archetypes with a project wandering A → B → D → C, the data (1,279 projects, 25,947 project-quarters), the three networks, and the three findings with their coefficients. He closes with a mist/focus cycle stamped ANTIFRAGILE, a word for managers, and the paper's last line: *not optimizing configurations, but orchestrating oscillations.* His powers light up for the finale, he says "Thank you!", and the scene irises out on the wide shot.

## Board panels (`board.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Title | title, subtitle, authors, journal; a rolling wave: *misalign → realign → evolve* |
| 02 | The mirroring hypothesis | developer pairs ↔ UI / Logic / Data; Alice and Bob; interfaces glow; the mirror and its dashed correspondences |
| 03 | The puzzle | modular code, specialized developers ⇒ expect mirroring; donut to **56%** (Colfer & Baldwin, 2016); a big **?** |
| 04 | Snapshot… or movie? | the two prior explanations; a polaroid (state) and a film strip whose dot rises and falls (dynamics) |
| 05 | State and dynamics | modularity Q ruler with project / team markers and a live mirroring read-out; the state formula; a quarterly line, green up (focusing) and pink down (misting) |
| 06 | Four states, eight moves | the 2×2 (team × project, monolithic / modular): A, D mirrored; B, C mismatched; misting and focusing hops; the list of all eight moves |
| 07 | The data | 1,279 Java projects · 20 years · 25,947 project-quarters (counters); quarterly codebases being scanned; *no surveys* |
| 08 | Three networks | (a) class architecture, (b) developer → file activity, (c) developer co-change team; Q(a) and Q(c) |
| 09 | Finding 1 | alternating focusing / misting bars; PVAR: state +0.096, focusing −0.414 |
| 10 | Finding 2 | system-wide vs module-level evolution; focusing +0.048 / +0.098, static state −0.179 / −0.378; the mirroring trap (snowflakes) |
| 11 | Finding 3 | 2×2 with B→D, C→D (bold) and B→A (thin); split-sample coefficients |
| 12 | Orchestrating oscillations | MIST ↔ FOCUS cycle, ANTIFRAGILE stamp, advice to managers, the closing line and the Rovelli quote |

## Script

Gestures come from `asset.js` → `dialogue` (each line has `slide` and `gesture`). The times below are from the first layout; the recorded voice re-times them (see `asset.js` for the current values).

| Time | Gesture | Line |
|---|---|---|
| | | **Panel 01: Title** |
| 0:01.0 | wave | Welcome, everyone! Today I want to walk you through a paper Amrit Tiwana and I wrote: *Dynamics of Mirroring*. |
| 0:08.0 | open | It's about how open-source teams and their code *grow up together*. |
| 0:12.6 | up | And it ends with a surprising idea: a little *misalignment* can be good for a project. |
| | | **Panel 02: The mirroring hypothesis** |
| 0:19.5 | board | Let's start with the *mirroring hypothesis*. |
| 0:23.3 | talk | It says the structure of a team should *mirror* the structure of the product it builds. |
| 0:28.9 | board | If Alice builds the user interface and Bob builds the data layer, they barely need to talk... |
| 0:34.9 | talk | ...because the *interface* between their modules does the coordinating for them. |
| 0:40.1 | open | Ties between people line up with dependencies between modules. That's *mirroring*. |
| 0:45.5 | up | It saves scarce attention, and mirrored systems tend to be *more successful*. |
| | | **Panel 03: The puzzle** |
| 0:52.0 | think | But here's the puzzle. Open-source software is famously *modular*... |
| 0:56.9 | talk | ...and its developers specialize. So we'd expect *strong* mirroring. |
| 1:01.6 | board | Yet in a major review, *56%* of studies of open collaboration found *no support* for it. |
| 1:07.1 | shrug | So why does mirroring seem to *vanish* in open source? |
| | | **Panel 04: Snapshot… or movie?** |
| 1:12.8 | board | One answer: the code itself coordinates people, so they don't need to talk. |
| 1:18.1 | board | Another: digital tools stand in for sitting in the same building. |
| 1:22.7 | think | We asked a different question. What if we've been looking at a *snapshot*... |
| 1:27.8 | idea | ...when we should be watching the *movie*? |
| | | **Panel 05: Mirroring: state and dynamics** |
| 1:32.8 | talk | So we separate two things. The *state* of mirroring is how well team and code match *right now*. |
| 1:39.0 | board | We measure each structure's modularity, *Q*: zero for monolithic, one for fully modular. |
| 1:44.7 | board | Mirroring is high when the two Qs are *close* to each other. |
| 1:49.0 | open | The *dynamics* are how that match changes from one quarter to the next. |
| 1:53.8 | board | When the match improves, we call it *mirror focusing*. |
| 1:57.8 | board | When it slips, we call it *mirror misting*, like breath fogging up a mirror. |
| | | **Panel 06: Four states, eight moves** |
| 2:04.2 | board | Picture a two-by-two: team structure across the top, project architecture down the side. |
| 2:10.2 | board | In *A*, a monolithic team builds monolithic code. In *D*, a modular team builds modular code. |
| 2:16.0 | talk | Both are mirrored. *B* and *C* are the mismatches. |
| 2:19.7 | board | Stepping out of A or D *mists* the mirror. Stepping back in *focuses* it. |
| 2:24.5 | up | That's eight possible moves: four mistings and four focusings. |
| | | **Panel 07: The data** |
| 2:30.4 | open | To watch this happen, we went straight to the *source code*. |
| 2:34.9 | board | We studied *1,279* Java projects on GitHub... |
| 2:38.5 | board | ...rebuilding every codebase quarter by quarter: *25,947* project-quarters in all. |
| 2:43.8 | up | No surveys. Every measure comes from the code and the *commit logs* themselves. |
| | | **Panel 08: Three networks every quarter** |
| 2:50.4 | talk | Each quarter, we build three networks. |
| 2:54.0 | board | First, the *architecture*: classes, linked when one uses or inherits from another. |
| 2:59.3 | board | Second, the *activity*: which developers committed to which files. |
| 3:03.9 | board | Third, the *team*: two developers are linked when they change the same file. |
| 3:09.0 | open | The modularity of the first gives us the project architecture. The third gives us the team structure. |
| | | **Panel 09: Finding 1 · the mirror oscillates** |
| 3:16.7 | up | Finding one: the mirror *oscillates*. |
| 3:20.1 | board | As a state, mirroring is a little sticky from one quarter to the next... |
| 3:25.1 | board | ...but focusing is followed by misting, and misting by focusing. The coefficient is *minus 0.41*. |
| 3:31.2 | think | So weak mirroring in a snapshot may really be *strong dynamics* in motion. |
| | | **Panel 10: Finding 2 · focusing drives evolution** |
| 3:37.6 | up | Finding two: *focusing* drives evolution. |
| 3:41.2 | board | We measured two kinds of change. *System-wide*: files added or removed... |
| 3:46.1 | board | ...and *module-level*: code rewritten inside the files that stay. |
| 3:50.6 | board | Mirror focusing pushes both of them *up*, especially change inside modules. |
| 3:55.6 | board | But a high, *static* mirroring state pushes evolution *down*. That's the *mirroring trap*. |
| 4:01.2 | shrug | A perfectly matched project can *freeze* in place. |
| | | **Panel 11: Finding 3 · direction matters** |
| 4:06.3 | up | Finding three: *direction* matters. |
| 4:09.7 | board | Focusing pays off when it lands in *D*: a modular team on modular code. |
| 4:14.5 | board | B to D and C to D boost *both* kinds of evolution. |
| 4:18.3 | board | One exception: B to A helps change *inside* modules, but not across the whole system. |
| | | **Panel 12: Orchestrating oscillations** |
| 4:25.2 | think | So what does it all mean? |
| 4:28.1 | open | Misting isn't a failure. It's how developers *explore*, tinker, and learn other parts of the system. |
| 4:34.3 | talk | Focusing is where that learning gets *put to work*. |
| 4:38.2 | power | Misting is a stressor that makes the project *stronger*. Taleb would call that *antifragile*. |
| 4:43.9 | up | For managers: don't lock the mirror in place. Leave room for *bottom-up* tinkering. |
| 4:49.3 | power | The future of mirroring research lies not in optimizing configurations... |
| 4:54.4 | power | ...but in *orchestrating oscillations*. |
| 4:57.6 | wave | Thank you! |

## Shot list

Shots are listed in `scene.js` → `shots`, keyed to the dialogue (`L(panel, line)`), so they follow the script if timings change.

| Camera | Use |
|---|---|
| `establish` / `outro` | wide from the middle of the empty rows (push in at the start, pull back and iris out at the end) |
| `TWO` | the main teaching two-shot: Safadi on the left third, feet locked, the whole board on the right; bubble over the wall above him |
| `BOARD` | board close-up for dense panels; Safadi is off to the left and his bubble runs along the bottom with its tail off-screen |
| `CLOSE` | medium close-up on Safadi for key points (the puzzle, "movie", each finding, antifragile, the closing line), board softly blurred behind |

## Notes for editing

- **Changing the words:** edit `dialogue` in `asset.js`, then re-record with `node scripts/tts_gemini.mjs scene27_dynamics_of_mirroring` (needs `GEMINI_API_KEY`). Only new or changed lines are sent to Gemini. The script rewrites each line's `at` and `cps` so the bubble types while the line is spoken, with 0.45 s between lines and 1.5 s before a new panel (`tts` in `asset.js`). `tts.tempo` (now 1.15) speeds the takes up without changing pitch; changing it needs no new recording. Panels, gestures, cuts and the music all key off the line times, so everything follows.
- **Panel content:** each panel is a function in `board.js` → `MB_PANELS`. Inside it, `b(i)` is the time since the panel's i-th line started; `mbK(b(i), delay, dur)` gives a 0..1 reveal. Board coordinates are 1320 × 680 world units, y down.
- **Gestures:** `scene.js` → `GESTURES`. Each line blends from the previous gesture over about half a second.
- **Board:** the big chalkboard is a new option on the lecture hall (`bigBoard`), so other scenes can use it too.
