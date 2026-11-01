# Scene 60: Python 12 · DataFrame and Series

> Module 12 of the Python course, at a black chalkboard: pandas Series and DataFrames, selecting with .loc and .iloc, vectorized arithmetic and Boolean masks, avoiding chained assignment, and a first look at the Gapminder data.

| | |
|---|---|
| **Length** | about 5½ minutes (the voice ends at 5:16.6; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/12_dataframe_and_series.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/12_dataframe_and_series.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

A Series and a DataFrame are sketched, then built from state populations and areas. .loc versus .iloc (label slices include the end; integer brackets are labels in pandas 3), vectorized division aligned by label, Boolean masks, and DataFrame selection, new columns and sorting. Chained assignment is shown failing under Copy-on-Write, fixed with one .loc. Gapminder loads from the web for info(), the top five life expectancies, and US GDP growth.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | DataFrame and Series | title card, four goals |
| 02 | Meet pandas | a Series and a DataFrame sketched; import pandas as pd |
| 03 | Series | values and index; a Series from a dictionary of state populations |
| 04 | Selecting: .loc and .iloc | labels vs positions; inclusive vs exclusive slices; KeyError for population[0] |
| 05 | Vectorized operations and masks | population / area aligned by label; masks; & | ~ |
| 06 | DataFrames | states from two Series; index, columns, shape; a new density column |
| 07 | Selecting rows, cells, and filtering | .loc and .iloc in two dimensions; filtering and sort_values |
| 08 | Avoid chained assignment | the ChainedAssignmentError; Copy-on-Write; one-step .loc |
| 09 | Loading and exploring Gapminder | read_csv with sep="\t"; info(); top five life expectancies; isin |
| 10 | Summary | the task → code table |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene60_py12_dataframe_series`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene60_py12_dataframe_series`.

<!-- narration:start -->
**33 lines · 714 words · voice ends at 5:16.6** (pace: 2.5 words per second).


### Panel 01 · DataFrame and Series

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 12: DataFrame and Series. |
| 0:07.8 | Today we meet pandas. You'll create Series and DataFrames, select data by label and by position, filter rows and add computed columns. |
| 0:17.1 | You'll load a dataset from the web and inspect it, and learn to avoid the most common pitfall when modifying data. |

### Panel 02 · Meet pandas

| Cue | Narration |
|---|---|
| 0:27.1 | In Module 11, every question took a loop, every missing value needed care, and the output was hard to read. |
| 0:35.6 | pandas is the most widely used Python library for tabular data. It provides two main objects. |
| 0:42.5 | A Series is a one-dimensional column of values with labels. A DataFrame is a two-dimensional table made of Series that share the same row labels. |
| 0:53.0 | By convention, pandas is imported as pd. |

### Panel 03 · Series

| Cue | Narration |
|---|---|
| 0:57.4 | A Series has two parts: the values, and the index, the labels on the left. By default, the index counts from zero. |
| 1:06.7 | The index can hold any labels. A Series built from a dictionary uses the keys as the index: here, the populations of five states in 2024. |

### Panel 04 · Selecting: .loc and .iloc

| Cue | Narration |
|---|---|
| 1:18.7 | There are two ways to point at an item. dot loc selects by label, and dot iloc selects by integer position, starting at zero. |
| 1:28.8 | Both accept slices, but note the difference at the end. Label slices include the end label: Texas to New York includes New York. Position slices exclude the end, as everywhere else in Python. |
| 1:42.5 | Square brackets alone also select by label. In pandas 3, brackets with an integer always mean a label, so they raise a KeyError here. The rule of thumb: use loc for labels and iloc for positions. |

### Panel 05 · Vectorized operations and masks

| Cue | Narration |
|---|---|
| 1:58.5 | Arithmetic on a Series applies to every value at once, with no loop needed. |
| 2:04.6 | Operations between two Series line up their values by label, not by position. Population divided by area gives each state's density, even though the areas are listed in a different order. |
| 2:17.5 | A comparison produces a Series of True and False: a Boolean mask. Put it inside square brackets to keep the rows where it's True. |
| 2:27.6 | Combine conditions with ampersand for and, pipe for or, and tilde for not, and wrap each condition in parentheses. The words and and or don't work on a Series. |

### Panel 06 · DataFrames

| Cue | Narration |
|---|---|
| 2:40.8 | A DataFrame is a table. One way to build it is from a dictionary of Series, one per column. The rows align by label. |
| 2:50.9 | It has an index for the rows, and an index for the columns, and shape gives rows and columns. |
| 2:59.0 | One column name in square brackets returns a Series; a list of names returns a DataFrame. And assigning to a new column name computes it for every row. |

### Panel 07 · Selecting rows, cells, and filtering

| Cue | Narration |
|---|---|
| 3:11.8 | loc and iloc work in two dimensions: rows, then columns. A colon means all. |
| 3:17.9 | One label gives a row, a row and a column give one cell, and lists of labels give a smaller table. |
| 3:26.8 | Boolean masks filter DataFrames too, and sort values orders the rows by a column. |

### Panel 08 · Avoid chained assignment

| Cue | Narration |
|---|---|
| 3:34.0 | Suppose we want to change Florida's area. It's tempting to select the column, and then the row. That's chained assignment, and it's unreliable. |
| 3:43.7 | In pandas 3, every selection behaves like a new copy. That rule is called Copy-on-Write. So the assignment changes a temporary copy, and the DataFrame stays the same. |
| 3:55.4 | The reliable way is to select the row and the column in a single step with loc. Never chain two selections before an equals sign. |

### Panel 09 · Loading and exploring Gapminder

| Cue | Narration |
|---|---|
| 4:07.0 | read CSV reads a file straight from the web. This one uses tabs, so we set sep. It's Gapminder: life expectancy, population and GDP per capita for a hundred forty-two countries, every five years. |
| 4:21.1 | info summarizes the structure: seventeen hundred and four rows, and each column's type. In pandas 3, text columns have the str type. |
| 4:30.4 | Which five countries had the highest life expectancy in 2007? Filter the year, and sort: Japan, Hong Kong, Iceland, Switzerland, and Australia. |
| 4:39.7 | And isin tests membership: the US economy grew almost sixfold in real terms between 1952 and 2007. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:48.1 | To recap. |
| 4:50.0 | Create Series and DataFrames from lists and dictionaries, and inspect them with head, shape, info, index and columns. |
| 4:57.7 | Select columns with brackets, and rows and cells with loc for labels and iloc for positions. Filter with masks, and sort with sort values. |
| 5:07.8 | Add or change data with a new column, or with loc in a single step. Next up: Module 13, statistics and regression. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the vectorized division on panel 5), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
