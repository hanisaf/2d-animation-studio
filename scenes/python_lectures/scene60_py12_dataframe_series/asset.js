// Scene 60: Python lecture, Module 12 · DataFrame and Series (lectures/12_dataframe_and_series.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene60_py12_dataframe_series).
asset({
  title: 'Python 12 · DataFrame and Series',
  logline: 'Module 12 of the Python course, at a black chalkboard: pandas Series and DataFrames, selecting with .loc and .iloc, vectorized arithmetic and Boolean masks, avoiding chained assignment, and a first look at the Gapminder data.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/12_dataframe_and_series.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 12: DataFrame and Series." },
    { panel: 1, text: "Today we meet pandas. You'll create Series and DataFrames, select data by label and by position, filter rows and add computed columns." },
    { panel: 1, text: "You'll load a dataset from the web and inspect it, and learn to avoid the most common pitfall when modifying data." },

    { panel: 2, text: "In Module 11, every question took a loop, every missing value needed care, and the output was hard to read." },
    { panel: 2, text: "pandas is the most widely used Python library for tabular data. It provides two main objects." },
    { panel: 2, text: "A Series is a one-dimensional column of values with labels. A DataFrame is a two-dimensional table made of Series that share the same row labels." },
    { panel: 2, text: "By convention, pandas is imported as pd." },

    { panel: 3, text: "A Series has two parts: the values, and the index, the labels on the left. By default, the index counts from zero." },
    { panel: 3, text: "The index can hold any labels. A Series built from a dictionary uses the keys as the index: here, the populations of five states in 2024." },

    { panel: 4, text: "There are two ways to point at an item. dot loc selects by label, and dot iloc selects by integer position, starting at zero." },
    { panel: 4, text: "Both accept slices, but note the difference at the end. Label slices include the end label: Texas to New York includes New York. Position slices exclude the end, as everywhere else in Python." },
    { panel: 4, text: "Square brackets alone also select by label. In pandas 3, brackets with an integer always mean a label, so they raise a KeyError here. The rule of thumb: use loc for labels and iloc for positions." },

    { panel: 5, text: "Arithmetic on a Series applies to every value at once, with no loop needed." },
    { panel: 5, text: "Operations between two Series line up their values by label, not by position. Population divided by area gives each state's density, even though the areas are listed in a different order." },
    { panel: 5, text: "A comparison produces a Series of True and False: a Boolean mask. Put it inside square brackets to keep the rows where it's True." },
    { panel: 5, text: "Combine conditions with ampersand for and, pipe for or, and tilde for not, and wrap each condition in parentheses. The words and and or don't work on a Series." },

    { panel: 6, text: "A DataFrame is a table. One way to build it is from a dictionary of Series, one per column. The rows align by label." },
    { panel: 6, text: "It has an index for the rows, and an index for the columns, and shape gives rows and columns." },
    { panel: 6, text: "One column name in square brackets returns a Series; a list of names returns a DataFrame. And assigning to a new column name computes it for every row." },

    { panel: 7, text: "loc and iloc work in two dimensions: rows, then columns. A colon means all." },
    { panel: 7, text: "One label gives a row, a row and a column give one cell, and lists of labels give a smaller table." },
    { panel: 7, text: "Boolean masks filter DataFrames too, and sort values orders the rows by a column." },

    { panel: 8, text: "Suppose we want to change Florida's area. It's tempting to select the column, and then the row. That's chained assignment, and it's unreliable." },
    { panel: 8, text: "In pandas 3, every selection behaves like a new copy. That rule is called Copy-on-Write. So the assignment changes a temporary copy, and the DataFrame stays the same." },
    { panel: 8, text: "The reliable way is to select the row and the column in a single step with loc. Never chain two selections before an equals sign." },

    { panel: 9, text: "read CSV reads a file straight from the web. This one uses tabs, so we set sep. It's Gapminder: life expectancy, population and GDP per capita for a hundred forty-two countries, every five years." },
    { panel: 9, text: "info summarizes the structure: seventeen hundred and four rows, and each column's type. In pandas 3, text columns have the str type." },
    { panel: 9, text: "Which five countries had the highest life expectancy in 2007? Filter the year, and sort: Japan, Hong Kong, Iceland, Switzerland, and Australia." },
    { panel: 9, text: "And isin tests membership: the US economy grew almost sixfold in real terms between 1952 and 2007." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "Create Series and DataFrames from lists and dictionaries, and inspect them with head, shape, info, index and columns." },
    { panel: 10, text: "Select columns with brackets, and rows and cells with loc for labels and iloc for positions. Filter with masks, and sort with sort values." },
    { panel: 10, text: "Add or change data with a new column, or with loc in a single step. Next up: Module 13, statistics and regression." },
  ],
});
