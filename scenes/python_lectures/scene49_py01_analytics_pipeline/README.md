# Scene 49: Python 01 · The Analytics Pipeline

> Module 1 of *Python Programming Skills for Business Analytics*, at a black chalkboard: why Python, the five stages of an analytics project, Jupyter notebooks, reproducible work, and a first look at real data.

| | |
|---|---|
| **Length** | about 5½ minutes (the voice ends at 5:29; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/01_analytics_pipeline.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/01_analytics_pipeline.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black: a black slate in a black frame with a red pinstripe, white chalk, and red for code keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects, so the voice has the soundtrack to itself |

## Synopsis

The camera fades in on the empty hall and pushes in until the black board fills the frame. The title chalks itself on: *Module 1 · The Analytics Pipeline*, with the four things the lecture covers. Nine more panels follow, each wiped off with an eraser sweep before the next one writes itself in step with the narration:
- why Python;
- the five pipeline stages;
- a notebook with its kernel;
- running a first cell, with the keyboard shortcuts;
- an out-of-order notebook that shows 36 where 30 was expected, and the two habits that prevent it;
- loading the Cambridge salary data from GitHub;
- `shape`, `columns` and `max()`;
- the suspicious \$3.5 million "salary", which turns out to be a labor settlement.

A summary closes the lecture, and the camera pulls back to the wide shot and fades to black.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | The Analytics Pipeline | MODULE 1, the title, the course name; four numbered goals |
| 02 | Why Python for business analytics? | three columns: readable (`if sales > goal:`), rich ecosystem (pandas · statsmodels · seaborn), reproducible (a script of steps → the same result for you, a colleague, an auditor) |
| 03 | The analytics pipeline | Acquire → Prepare → Explore → Model → Communicate, each with its question and modules; the stage being named turns red |
| 04 | Jupyter notebooks | a notebook with a Markdown cell and two code cells (`revenue = 1200`, `revenue * 3` → 3600); the kernel remembering `revenue → 1200`; the `In [n]` counters circled |
| 05 | Running code | `1 + 2` → 3; two `print()` calls; the shortcuts table (close-up) |
| 06 | Reproducible analytics | three cells run 1 → 2 → 3 out of order: expected 30, shows 36; the two habits and the *Restart & Run All* button |
| 07 | Loading data from the web | GitHub `data/` → the `read_csv` code (close-up) → the first five rows of the Cambridge salaries |
| 08 | A first look at the data | `shape` → (7024, 7); the seven column names; `max()` → 3500000, circled |
| 09 | Question surprising values | \$3,500,000 ?!; the record (close-up), *FY18 Settlement* circled; "a labor settlement ≠ an individual's pay"; the rule in a red box |
| 10 | Summary | the five stages again, three checked takeaways, and what's next |

## Voice-over script

Record each line so that it **starts at its cue time**. The cue times come from the word count of each line at 2.5 words per second (150 words per minute), with ½ s between lines and an extra 1.1 s before each new panel. Each board element chalks itself on as the line that mentions it begins.

**If your delivery is faster or slower,** change `pace` in [`asset.js`](asset.js) (`wps`, `gap`, `panelGap`) and run

```bash
node scripts/lecture_script.mjs scene49_py01_analytics_pipeline
```

That rewrites the script below with new cue times, and the board follows automatically. The same command updates this script after you edit the wording in `asset.js` → `narration`. A `pause` on a line adds that many seconds of silence after it.

**To add your recording to the video,** save it as `audio.mp3` in this folder (one take of the whole lecture, starting at 0:00), and add `audio: 'audio.mp3'` to `asset.js`. Then build with `scripts/build_scene.sh scene49_py01_analytics_pipeline`. The encoder muxes the audio and trims it to the video length.

<!-- narration:start -->
**46 lines · 728 words · voice ends at 5:29.1** (pace: 2.5 words per second).


### Panel 01 · The Analytics Pipeline

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 1 of Python Programming Skills for Business Analytics: the analytics pipeline. |
| 0:10.6 | By the end, you'll be able to describe the stages of an analytics project, work in a Jupyter notebook, and explain what makes an analysis reproducible. |
| 0:21.5 | And we'll load our first real dataset, straight from the web. |

### Panel 02 · Why Python for business analytics?

| Cue | Narration |
|---|---|
| 0:27.5 | Why Python? It has become the standard tool for data analysis, for three reasons. |
| 0:33.6 | First, readable syntax. Python code reads almost like English, so it's easy to learn and easy to review. |
| 0:41.3 | Second, a rich ecosystem. pandas for data, statsmodels for statistics, and seaborn for charts cover the entire workflow. |
| 0:49.0 | Third, automation and reproducibility. Unlike point-and-click tools, a script records every step, so anyone can produce the same result again: you, a colleague, or an auditor. |

### Panel 03 · The analytics pipeline

| Cue | Narration |
|---|---|
| 1:01.0 | Most analytics projects move through the same five stages. |
| 1:05.1 | Acquire: where do the data come from? |
| 1:08.4 | Prepare: are the data clean and in the right shape? That's the work of Modules 3 to 11. |
| 1:16.1 | Explore: what do the data look like? |
| 1:19.4 | Model: what relationships explain the outcome? That's Module 13. |
| 1:23.5 | And communicate: how do we tell the story? |

### Panel 04 · Jupyter notebooks

| Cue | Narration |
|---|---|
| 1:28.3 | We'll do all our work in Jupyter notebooks. A notebook is a document made of cells. |
| 1:35.2 | Markdown cells hold formatted text: headings, explanations, notes. |
| 1:38.9 | Code cells hold Python. When you run a code cell, the result appears right below it. |
| 1:45.8 | Behind the notebook is the kernel: a running Python process that executes your code and remembers every variable. |
| 1:53.5 | The number in square brackets next to a cell records the order in which the cells were run. |

### Panel 05 · Running code

| Cue | Narration |
|---|---|
| 2:02.3 | Let's run something. Type one plus two, and press Shift Enter. |
| 2:07.2 | Python shows three. The value of the last line of a cell is displayed automatically. |
| 2:13.7 | To display more than one value, or to display text, use the print function. |
| 2:19.8 | And a few shortcuts will save you a lot of time. |
| 2:25.1 | Shift Enter runs a cell. Enter and Escape switch modes. A and B insert a cell above or below, M and Y make it Markdown or code, and D twice deletes it. |

### Panel 06 · Reproducible analytics

| Cue | Narration |
|---|---|
| 2:39.5 | Next, reproducibility. An analysis is reproducible when anyone can rerun it from scratch and get the same result. |
| 2:47.2 | Notebooks make that easy, but also easy to break: the kernel remembers everything, so you can run cells out of order... |
| 2:56.1 | ...and get results that don't match the code. Reading from the top, total should be thirty, but it shows thirty-six. |
| 3:04.6 | Two habits protect you. First, write notebooks that run from top to bottom: define something before you use it. |
| 3:12.7 | Second, check your work with Restart and Run All: a fresh kernel runs every cell in order. Do this before you submit any drill. |

### Panel 07 · Loading data from the web

| Cue | Narration |
|---|---|
| 3:23.9 | A third habit: load data from a stable, shared location, not from a file that lives only on your laptop. |
| 3:32.4 | All our course datasets are published on GitHub, so every notebook reads its data directly from the web. |
| 3:40.1 | We import pandas as pd, build the address from DATA URL plus the file name, and call read CSV. |
| 3:48.2 | Then head shows the first five rows: salaries of city employees in Cambridge, Massachusetts. A few lines of code fetched over seven thousand records. |

### Panel 08 · A first look at the data

| Cue | Narration |
|---|---|
| 3:59.4 | Let's take a first look. We'll study pandas in Module 12, but these names almost explain themselves. |
| 4:06.7 | shape gives the number of rows and columns: seven thousand and twenty-four rows, and seven columns. |
| 4:13.6 | columns lists the column names, from fiscal year to total salary. |
| 4:18.5 | And max finds the largest total salary: three and a half million dollars. |

### Panel 09 · Question surprising values

| Cue | Narration |
|---|---|
| 4:25.3 | Three and a half million dollars, for a city employee? That should make any analyst suspicious. |
| 4:32.2 | Let's pull up the record behind it. The department is Fire, and the job title is FY18 Settlement. |
| 4:39.9 | This is a labor settlement, a lump-sum budget line, not an individual's pay. |
| 4:45.6 | That's a first lesson in exploration: always question surprising values before you report them. Here, we'd exclude settlements before computing statistics about pay. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:56.4 | Let's recap. |
| 4:58.3 | An analytics project moves through five stages: acquire, prepare, explore, model, and communicate. |
| 5:04.0 | A notebook mixes Markdown cells and code cells, and the kernel runs the code and remembers your variables. |
| 5:11.7 | Reproducible notebooks run from top to bottom. Use Restart and Run All to verify. |
| 5:17.8 | And course datasets load straight from the web, with DATA URL plus the file name. |
| 5:24.3 | Next, open the drill for this module. See you in Module 2! |
<!-- narration:end -->

## Shot list

The kit ([`lecture_kit.js`](lecture_kit.js)) builds every shot from the narration timing, so the cuts follow the voice.

| Shot | When | Camera |
|---|---|---|
| Opening | 0:00 | fade in on the wide shot from the middle of the rows, then push in until the board fills the frame |
| Board | each new panel | the whole board, about 1700 px wide, drifting a few units sideways and pushing in slowly; the drift alternates direction from panel to panel |
| Close-up | panel 5, lines 4–5 · panel 7, line 3 · panel 9, line 2 | a region of the board fills the frame (the shortcuts, the `read_csv` code, the settlement record), then back to the whole board |
| Closing | 1 s after the last line | pull back to the wide shot and fade to black |

## Notes for editing

- **Panels:** each entry of `panels` in `scene.js` is `{ title, draw(u, b) }`. `b(i)` is the time since the panel's *i*-th narration line began; `lkK(b(i), delay, dur)` gives a 0..1 reveal. Board coordinates are 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
- **Close-ups:** `focus` in `scene.js` lists `{ panel, line, to, rect: [x, y, w, h] }` in board coordinates.
- **The kit:** [`lecture_kit.js`](lecture_kit.js) holds the colours (`LK`), the chalk helpers (`lkText`, `lkCode`, `lkCodeParts`, `lkCell`, `lkTable`, `lkArrow`, `lkLoop`, `lkBadge`, …), the timing (`lkTiming`) and `lecture()`, which builds the board, the eraser sweeps, the header and footer, and the shots. The other Python lectures borrow it through `uses: ['scene49_py01_analytics_pipeline']`.
- **Code font:** code is set in Fira Mono, loaded from Google Fonts with Fredoka and Luckiest Guy.
