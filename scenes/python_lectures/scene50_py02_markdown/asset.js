// Scene 50: Python lecture, Module 2 · Jupyter Notebooks and Markdown (lectures/02_markdown.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene50_py02_markdown).
asset({
  title: 'Python 02 · Jupyter Notebooks and Markdown',
  logline: 'Module 2 of the Python course, at a black chalkboard: writing headings, emphasis, lists, links, quotes, code, tables and math in Markdown, so an analysis reads as clearly as it runs.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/02_markdown.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 2: Jupyter notebooks and the Markdown language." },
    { panel: 1, text: "Today you'll learn to format the text in your notebooks: headings, emphasis, lists, links, images, quotes and code." },
    { panel: 1, text: "We'll also build tables, write math formulas, and combine narrative and code into a readable analytics document." },

    { panel: 2, text: "An analysis is only useful if others can follow it." },
    { panel: 2, text: "Notebooks let you place your explanations right next to the code that produces each result." },
    { panel: 2, text: "Those explanations are written in Markdown, a lightweight language that turns plain text into formatted text with a handful of symbols, like the hash, the asterisk and the dash." },
    { panel: 2, text: "To create a Markdown cell, select a cell and press M. Running the cell renders it, and double-clicking a rendered cell shows its source again." },

    { panel: 3, text: "Let's start with headings. Begin a line with one to six hash signs, followed by a space." },
    { panel: 3, text: "Use one level-one heading for the title, level-two headings for the main sections, and so on." },
    { panel: 3, text: "For emphasis, surround text with two asterisks for bold, one asterisk for italics, or two tildes for strikethrough." },

    { panel: 4, text: "Next, lists. Number the items with a number and a period, or start each item with a dash for bullets." },
    { panel: 4, text: "Indent sub-items by two spaces." },
    { panel: 4, text: "And always leave a blank line before a list, so it isn't merged with the paragraph above it." },

    { panel: 5, text: "A link is written as text in square brackets, followed by the address in parentheses." },
    { panel: 5, text: "An image uses the same syntax, with an exclamation mark in front." },
    { panel: 5, text: "The bracketed text becomes the alternative text, which is shown if the image can't be loaded." },

    { panel: 6, text: "A few more symbols. A line that starts with a greater-than sign is a block quote." },
    { panel: 6, text: "Text between single backticks is inline code." },
    { panel: 6, text: "Three backticks above and below make a code block. Add the language name, like python, for syntax highlighting." },
    { panel: 6, text: "And three dashes on their own line draw a horizontal rule." },

    { panel: 7, text: "Tables are written with pipes between the columns." },
    { panel: 7, text: "The second row separates the header from the body, and it sets the alignment: a colon on the left aligns left, on the right aligns right, and on both sides centers." },
    { panel: 7, text: "One warning: Jupyter treats text between two dollar signs as math. To show a literal dollar sign, write a backslash before it." },

    { panel: 8, text: "Speaking of math: Jupyter renders formulas written in LaTeX notation." },
    { panel: 8, text: "Wrap an inline formula in single dollar signs, like this sample mean." },
    { panel: 8, text: "And wrap a displayed formula, on its own line, in double dollar signs." },

    { panel: 9, text: "Here's a workout. A department exported its course list as plain text." },
    { panel: 9, text: "We convert it to a Markdown table with three columns: number, title and credits, with the credits aligned right." },
    { panel: 9, text: "Each course number becomes a link." },
    { panel: 9, text: "Converting text by hand is tedious and error-prone. Later in the course, pandas will build tables like this for us automatically." },

    { panel: 10, text: "Let's recap the syntax." },
    { panel: 10, text: "Hash signs make headings, asterisks make bold and italics, and numbers or dashes make lists." },
    { panel: 10, text: "Square brackets and parentheses make links, and an exclamation mark turns a link into an image." },
    { panel: 10, text: "A greater-than sign quotes, backticks mark code, pipes build tables, and dollar signs hold math." },
    { panel: 10, text: "Now try the drill, and write your next analysis so that anyone can follow it. See you in Module 3!" },
  ],
});
