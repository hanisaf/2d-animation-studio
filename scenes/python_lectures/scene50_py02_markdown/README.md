# Scene 50: Python 02 · Jupyter Notebooks and Markdown

> Module 2 of the Python course, at a black chalkboard: writing headings, emphasis, lists, links, quotes, code, tables and math in Markdown, so an analysis reads as clearly as it runs.

| | |
|---|---|
| **Length** | about 4 minutes (the voice ends at 4:06.2; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/02_markdown.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/02_markdown.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

After the push-in, the title card lists four goals. Each syntax panel shows the Markdown source on the left and how it renders on the right: headings and emphasis, lists, links and images, quotes and code, tables (with the dollar-sign warning) and LaTeX math. The workout turns a plain-text course list into a linked table, and a cheat sheet closes the lecture.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Jupyter Notebooks and Markdown | title card, four goals |
| 02 | Why Markdown? | "only useful if others can follow it"; explanation beside code; the symbols # * -; M, run, double-click |
| 03 | Headings and emphasis | # / ## / ### and bold, italic, strikethrough, source → render |
| 04 | Lists | numbered and bulleted lists, two-space sub-items; "leave a blank line before a list" |
| 05 | Links and images | [text](address) and ![alt](address); a link and an image frame with its alt text |
| 06 | Quotes, code, and rules | > quote, `inline code`, a ```python block, --- |
| 07 | Tables | pipe table source → rendered table; the alignment row; the \$ warning |
| 08 | Math with LaTeX | inline $…$ (the sample mean) and displayed $$…$$ |
| 09 | Workout: from plain text to a table | a plain-text course list → a Markdown table with linked course numbers |
| 10 | Summary | the syntax cheat sheet |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene50_py02_markdown`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene50_py02_markdown`.

<!-- narration:start -->
**35 lines · 537 words · voice ends at 4:06.2** (pace: 2.5 words per second).


### Panel 01 · Jupyter Notebooks and Markdown

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 2: Jupyter notebooks and the Markdown language. |
| 0:09.0 | Today you'll learn to format the text in your notebooks: headings, emphasis, lists, links, images, quotes and code. |
| 0:16.7 | We'll also build tables, write math formulas, and combine narrative and code into a readable analytics document. |

### Panel 02 · Why Markdown?

| Cue | Narration |
|---|---|
| 0:25.1 | An analysis is only useful if others can follow it. |
| 0:29.6 | Notebooks let you place your explanations right next to the code that produces each result. |
| 0:36.1 | Those explanations are written in Markdown, a lightweight language that turns plain text into formatted text with a handful of symbols, like the hash, the asterisk and the dash. |
| 0:48.2 | To create a Markdown cell, select a cell and press M. Running the cell renders it, and double-clicking a rendered cell shows its source again. |

### Panel 03 · Headings and emphasis

| Cue | Narration |
|---|---|
| 0:59.8 | Let's start with headings. Begin a line with one to six hash signs, followed by a space. |
| 1:07.1 | Use one level-one heading for the title, level-two headings for the main sections, and so on. |
| 1:14.0 | For emphasis, surround text with two asterisks for bold, one asterisk for italics, or two tildes for strikethrough. |

### Panel 04 · Lists

| Cue | Narration |
|---|---|
| 1:22.8 | Next, lists. Number the items with a number and a period, or start each item with a dash for bullets. |
| 1:31.3 | Indent sub-items by two spaces. |
| 1:33.8 | And always leave a blank line before a list, so it isn't merged with the paragraph above it. |

### Panel 05 · Links and images

| Cue | Narration |
|---|---|
| 1:42.6 | A link is written as text in square brackets, followed by the address in parentheses. |
| 1:49.1 | An image uses the same syntax, with an exclamation mark in front. |
| 1:54.4 | The bracketed text becomes the alternative text, which is shown if the image can't be loaded. |

### Panel 06 · Quotes, code, and rules

| Cue | Narration |
|---|---|
| 2:02.4 | A few more symbols. A line that starts with a greater-than sign is a block quote. |
| 2:09.3 | Text between single backticks is inline code. |
| 2:12.6 | Three backticks above and below make a code block. Add the language name, like python, for syntax highlighting. |
| 2:20.3 | And three dashes on their own line draw a horizontal rule. |

### Panel 07 · Tables

| Cue | Narration |
|---|---|
| 2:26.3 | Tables are written with pipes between the columns. |
| 2:30.0 | The second row separates the header from the body, and it sets the alignment: a colon on the left aligns left, on the right aligns right, and on both sides centers. |
| 2:42.9 | One warning: Jupyter treats text between two dollar signs as math. To show a literal dollar sign, write a backslash before it. |

### Panel 08 · Math with LaTeX

| Cue | Narration |
|---|---|
| 2:53.3 | Speaking of math: Jupyter renders formulas written in LaTeX notation. |
| 2:57.8 | Wrap an inline formula in single dollar signs, like this sample mean. |
| 3:03.1 | And wrap a displayed formula, on its own line, in double dollar signs. |

### Panel 09 · Workout: from plain text to a table

| Cue | Narration |
|---|---|
| 3:09.9 | Here's a workout. A department exported its course list as plain text. |
| 3:15.2 | We convert it to a Markdown table with three columns: number, title and credits, with the credits aligned right. |
| 3:23.3 | Each course number becomes a link. |
| 3:26.2 | Converting text by hand is tedious and error-prone. Later in the course, pandas will build tables like this for us automatically. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 3:36.2 | Let's recap the syntax. |
| 3:38.3 | Hash signs make headings, asterisks make bold and italics, and numbers or dashes make lists. |
| 3:44.8 | Square brackets and parentheses make links, and an exclamation mark turns a link into an image. |
| 3:51.7 | A greater-than sign quotes, backticks mark code, pipes build tables, and dollar signs hold math. |
| 3:58.2 | Now try the drill, and write your next analysis so that anyone can follow it. See you in Module 3! |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the table source on panel 7 and the math source on panel 8), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
