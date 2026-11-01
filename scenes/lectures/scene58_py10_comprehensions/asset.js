// Scene 58: Python lecture, Module 10 · Comprehensions (lectures/10_comprehensions.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene58_py10_comprehensions).
asset({
  title: 'Python 10 · Comprehensions',
  logline: 'Module 10 of the Python course, at a black chalkboard: list, set and dictionary comprehensions, filtering and transforming, summarizing with sum, any and all, and the map–filter–reduce pattern.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/10_comprehensions.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 10: comprehensions." },
    { panel: 1, text: "Today you'll build lists with comprehensions instead of loops, filter and transform items inside them, and create sets and dictionaries the same way." },
    { panel: 1, text: "Then we'll summarize data with sum, min, max, any and all, and meet the map, filter, reduce pattern of functional programming." },

    { panel: 2, text: "In Module 7, we built lists with the empty-list-and-append pattern: three lines for the squares of zero to eleven." },
    { panel: 2, text: "A list comprehension says the same thing in a single line." },
    { panel: 2, text: "Read it almost as English: the list of n squared, for each n in range twelve. The general form is: expression, for variable in iterable." },
    { panel: 2, text: "A business example: apply a fifteen percent discount to every price." },

    { panel: 3, text: "Add if at the end to keep only the items that satisfy a condition, like the numbers that aren't multiples of three, or only the large orders." },
    { panel: 3, text: "The loop version shows where each part of the comprehension comes from: the for, the if, and the expression we append." },

    { panel: 4, text: "A conditional expression chooses between two values in a single line: value if condition, else other value." },
    { panel: 4, text: "Placed at the front of a comprehension, it transforms every item, and nothing is dropped: each order becomes large or small." },
    { panel: 4, text: "So remember: if at the end filters. If-else at the front transforms." },

    { panel: 5, text: "A comprehension can hold several for clauses, which behave like nested loops: every size with every color." },
    { panel: 5, text: "Curly braces make a set comprehension, like the distinct remainders after dividing by three." },
    { panel: 5, text: "And a key-colon-value pair makes a dictionary comprehension: each product mapped to its discounted price." },

    { panel: 6, text: "Built-in functions reduce a collection to one value: len, sum, min, max, and any and all, which test whether at least one, or every, item is true." },
    { panel: 6, text: "Combined with a comprehension, they answer analytical questions in one line. When the comprehension is the only argument, drop the brackets. That's a generator expression." },
    { panel: 6, text: "The total of the large orders is six hundred thirty. Is any order above two fifty? Yes. Are all orders positive? Yes." },
    { panel: 6, text: "min, max and sorted accept a key function, so they can find the item with the largest something, like the longest word." },

    { panel: 7, text: "Comprehensions implement two of the three classic operations of functional programming." },
    { panel: 7, text: "Map applies a function to every item. Filter keeps the items that pass a test." },
    { panel: 7, text: "Reduce combines all the items into one value. sum and max are special cases, and functools dot reduce is the general version." },
    { panel: 7, text: "Prefer the specific built-ins when they exist. And keep comprehensions simple: if one spans several lines with nested conditions, a regular loop is easier to read." },

    { panel: 8, text: "Warmup. The dates of January in one comprehension. Then every month: three hundred seventy-two dates, if we ignore month lengths." },
    { panel: 8, text: "A valid date function filters out the dates that don't exist, leaving three hundred sixty-five." },
    { panel: 8, text: "And a dictionary comprehension flips an English to French dictionary into French to English." },

    { panel: 9, text: "Workout. Replace every email address in a message with stars of the same length. A conditional expression transforms each word, and join reassembles them." },
    { panel: 9, text: "What's the longest word? Find the maximum length and filter, or use max with key equals len, or reduce." },
    { panel: 9, text: "And the longest word that isn't an email: a generator expression filters the emails before max sees them." },

    { panel: 10, text: "To recap the patterns." },
    { panel: 10, text: "Transform with f of x, for x in items. Filter with if at the end. Transform conditionally with if-else at the front." },
    { panel: 10, text: "Several for clauses make nested loops. Curly braces make sets and dictionaries." },
    { panel: 10, text: "And reduce with sum, max, any, all, or functools dot reduce. Next up: Module 11, a complete data analysis in pure Python." },
  ],
});
