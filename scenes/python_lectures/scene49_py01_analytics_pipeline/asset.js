// Scene 49: Python lecture, Module 1 · The Analytics Pipeline (BUSN 3030E, lectures/01_analytics_pipeline.ipynb).
// The narration is a voice-over that you record yourself: each line carries the board panel it belongs to, and its
// cue time comes from its word count (lkTiming in lecture_kit.js, paced by `pace`). README.md lists every line with
// its cue time; regenerate that table with `node scripts/lecture_script.mjs scene49_py01_analytics_pipeline`.
asset({
  title: 'Python 01 · The Analytics Pipeline',
  logline: 'Module 1 of Python Programming Skills for Business Analytics, at a black chalkboard: why Python, the five stages of an analytics project, Jupyter notebooks, reproducible work, and a first look at real data.',
  files: ['lecture_kit.js', 'scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/01_analytics_pipeline.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },   // words per second of your delivery, pauses between lines and panels
  narration: [
    { panel: 1, text: "Welcome to Module 1 of Python Programming Skills for Business Analytics: the analytics pipeline." },
    { panel: 1, text: "By the end, you'll be able to describe the stages of an analytics project, work in a Jupyter notebook, and explain what makes an analysis reproducible." },
    { panel: 1, text: "And we'll load our first real dataset, straight from the web." },

    { panel: 2, text: "Why Python? It has become the standard tool for data analysis, for three reasons." },
    { panel: 2, text: "First, readable syntax. Python code reads almost like English, so it's easy to learn and easy to review." },
    { panel: 2, text: "Second, a rich ecosystem. pandas for data, statsmodels for statistics, and seaborn for charts cover the entire workflow." },
    { panel: 2, text: "Third, automation and reproducibility. Unlike point-and-click tools, a script records every step, so anyone can produce the same result again: you, a colleague, or an auditor." },

    { panel: 3, text: "Most analytics projects move through the same five stages." },
    { panel: 3, text: "Acquire: where do the data come from?" },
    { panel: 3, text: "Prepare: are the data clean and in the right shape? That's the work of Modules 3 to 11." },
    { panel: 3, text: "Explore: what do the data look like?" },
    { panel: 3, text: "Model: what relationships explain the outcome? That's Module 13." },
    { panel: 3, text: "And communicate: how do we tell the story?" },

    { panel: 4, text: "We'll do all our work in Jupyter notebooks. A notebook is a document made of cells." },
    { panel: 4, text: "Markdown cells hold formatted text: headings, explanations, notes." },
    { panel: 4, text: "Code cells hold Python. When you run a code cell, the result appears right below it." },
    { panel: 4, text: "Behind the notebook is the kernel: a running Python process that executes your code and remembers every variable." },
    { panel: 4, text: "The number in square brackets next to a cell records the order in which the cells were run." },

    { panel: 5, text: "Let's run something. Type one plus two, and press Shift Enter." },
    { panel: 5, text: "Python shows three. The value of the last line of a cell is displayed automatically." },
    { panel: 5, text: "To display more than one value, or to display text, use the print function." },
    { panel: 5, text: "And a few shortcuts will save you a lot of time.", pause: .4 },
    { panel: 5, text: "Shift Enter runs a cell. Enter and Escape switch modes. A and B insert a cell above or below, M and Y make it Markdown or code, and D twice deletes it." },

    { panel: 6, text: "Next, reproducibility. An analysis is reproducible when anyone can rerun it from scratch and get the same result." },
    { panel: 6, text: "Notebooks make that easy, but also easy to break: the kernel remembers everything, so you can run cells out of order..." },
    { panel: 6, text: "...and get results that don't match the code. Reading from the top, total should be thirty, but it shows thirty-six." },
    { panel: 6, text: "Two habits protect you. First, write notebooks that run from top to bottom: define something before you use it." },
    { panel: 6, text: "Second, check your work with Restart and Run All: a fresh kernel runs every cell in order. Do this before you submit any drill." },

    { panel: 7, text: "A third habit: load data from a stable, shared location, not from a file that lives only on your laptop." },
    { panel: 7, text: "All our course datasets are published on GitHub, so every notebook reads its data directly from the web." },
    { panel: 7, text: "We import pandas as pd, build the address from DATA URL plus the file name, and call read CSV." },
    { panel: 7, text: "Then head shows the first five rows: salaries of city employees in Cambridge, Massachusetts. A few lines of code fetched over seven thousand records." },

    { panel: 8, text: "Let's take a first look. We'll study pandas in Module 12, but these names almost explain themselves." },
    { panel: 8, text: "shape gives the number of rows and columns: seven thousand and twenty-four rows, and seven columns." },
    { panel: 8, text: "columns lists the column names, from fiscal year to total salary." },
    { panel: 8, text: "And max finds the largest total salary: three and a half million dollars." },

    { panel: 9, text: "Three and a half million dollars, for a city employee? That should make any analyst suspicious." },
    { panel: 9, text: "Let's pull up the record behind it. The department is Fire, and the job title is FY18 Settlement." },
    { panel: 9, text: "This is a labor settlement, a lump-sum budget line, not an individual's pay." },
    { panel: 9, text: "That's a first lesson in exploration: always question surprising values before you report them. Here, we'd exclude settlements before computing statistics about pay." },

    { panel: 10, text: "Let's recap." },
    { panel: 10, text: "An analytics project moves through five stages: acquire, prepare, explore, model, and communicate." },
    { panel: 10, text: "A notebook mixes Markdown cells and code cells, and the kernel runs the code and remembers your variables." },
    { panel: 10, text: "Reproducible notebooks run from top to bottom. Use Restart and Run All to verify." },
    { panel: 10, text: "And course datasets load straight from the web, with DATA URL plus the file name." },
    { panel: 10, text: "Next, open the drill for this module. See you in Module 2!" },
  ],
});
