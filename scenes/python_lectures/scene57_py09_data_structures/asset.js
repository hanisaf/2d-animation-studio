// Scene 57: Python lecture, Module 9 · Built-In Data Structures (lectures/09_data_structures.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene57_py09_data_structures).
asset({
  title: 'Python 09 · Built-In Data Structures',
  logline: 'Module 9 of the Python course, at a black chalkboard: lists, tuples, dictionaries and sets, how to choose between them, and counting word frequencies in a day of news headlines.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/09_data_structures.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 9: built-in data structures." },
    { panel: 1, text: "Real data come in collections: the prices of all products, the grades of all students, the sales of every region." },
    { panel: 1, text: "Today: lists and tuples for ordered data, dictionaries to map keys to values, sets for unique values, and counting frequencies, one of the most common operations in analytics." },

    { panel: 2, text: "Python has four built-in compound types." },
    { panel: 2, text: "A list is an ordered, changeable collection, in square brackets. A tuple is ordered but unchangeable, in parentheses." },
    { panel: 2, text: "Curly braces make a dictionary when they hold key-value pairs, and a set otherwise. Note that empty curly braces are an empty dictionary; an empty set is written set()." },

    { panel: 3, text: "Lists are mutable: you can add, remove and change items after the list is created." },
    { panel: 3, text: "append adds one item at the end, extend adds several, and insert puts an item at a position. pop removes and returns the last item, and remove deletes the first matching item." },
    { panel: 3, text: "sorted returns a new sorted list and leaves the original alone, while the sort method sorts the list in place." },
    { panel: 3, text: "Indexing and slicing work exactly as with strings. But unlike strings, lists can be modified through them." },

    { panel: 4, text: "A tuple is like a list that can't be changed. Use one for a fixed group of values that belong together, like the latitude and longitude of Athens." },
    { panel: 4, text: "Assigning to an item raises a TypeError." },
    { panel: 4, text: "You've already used tuples: a function that returns two values returns a tuple, and x comma y equals unpacks it. Unpacking even swaps two variables in one line." },

    { panel: 5, text: "A dictionary maps keys to values. Instead of looking items up by position, you look them up by key, like a word in a dictionary." },
    { panel: 5, text: "Assigning to a key adds a new entry, or updates an existing one." },
    { panel: 5, text: "Looking up a missing key raises a KeyError. The get method returns a default value instead." },
    { panel: 5, text: "keys, values and items give access to the contents, and looping over items visits every entry. Values can even be lists or other dictionaries." },

    { panel: 6, text: "Counting with a dictionary is one of the most useful patterns in analytics." },
    { panel: 6, text: "Loop over the data, and increase the count of each value you see. get with a default of zero handles values seen for the first time." },
    { panel: 6, text: "Three A's, two B-pluses, two C's, and so on." },

    { panel: 7, text: "A set is an unordered collection of unique values. Converting a list to a set removes the duplicates." },
    { panel: 7, text: "Sets support set algebra. Which customers bought both a laptop and a mouse? That's the intersection. Either one is the union." },
    { panel: 7, text: "The difference gives laptop but no mouse, and the symmetric difference gives exactly one of the two." },
    { panel: 7, text: "Choosing a structure: a list to keep items in order and change them, a tuple for a fixed group, a dictionary to look up by name, and a set for unique values." },

    { panel: 8, text: "Workout. News analytics tools scan headlines to find trending topics. Let's build a small one for a day in September 2019." },
    { panel: 8, text: "First, clean: convert to lower case, so The and the count as one word, and remove punctuation. Then split into words: two hundred fourteen words, a hundred forty-five unique." },
    { panel: 8, text: "Count each word with a dictionary, and sort the items by their count." },
    { panel: 8, text: "The top words are small function words, like to, and, the. They carry little information." },

    { panel: 9, text: "So text analysts remove them, using a set of stop words. A set makes each membership check fast." },
    { panel: 9, text: "Without stop words, the trending topics emerge: Hurricane Dorian, California, Brexit, and guns." },
    { panel: 9, text: "Python's standard library even has a ready-made counter, collections dot Counter, which gives the same ranking in two lines." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "Lists are ordered and mutable. Tuples are ordered and immutable, and you can unpack them." },
    { panel: 10, text: "Dictionaries look values up by key: loop with items, and count with get." },
    { panel: 10, text: "Sets hold unique values and support set algebra. And indexing and slicing work the same way on lists, tuples, and strings. Next up: Module 10, comprehensions." },
  ],
});
