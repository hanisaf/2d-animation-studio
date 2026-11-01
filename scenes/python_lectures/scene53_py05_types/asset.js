// Scene 53: Python lecture, Module 5 · Built-In Types (lectures/05_types.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene53_py05_types).
asset({
  title: 'Python 05 · Built-In Types',
  logline: 'Module 5 of the Python course, at a black chalkboard: integers and floats, why 0.1 + 0.2 is not 0.3, converting between types, None, truthiness, and formatting numbers with f-strings.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/05_types.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 5: built-in types." },
    { panel: 1, text: "Today we'll work with Python's simple types: integers, floats, strings, Booleans and None." },
    { panel: 1, text: "You'll see why floating-point arithmetic can be slightly inexact, convert values between types, predict the truth value of any object, and format numbers for display." },

    { panel: 2, text: "Python's simple, or scalar, types each hold a single value." },
    { panel: 2, text: "int for whole numbers, float for real numbers, complex for complex numbers, bool for True and False, str for text, and NoneType, whose only value is None." },
    { panel: 2, text: "Python integers have unlimited precision. Two to the power two hundred is no problem." },
    { panel: 2, text: "Dividing two integers with a single slash always gives a float, even when the result is whole. Use floor division to keep an integer." },

    { panel: 3, text: "Floats store fractional numbers, in decimal or in scientific notation, where e means times ten to the power." },
    { panel: 3, text: "But floats are approximations. Computers store them in binary, and most decimal fractions, like zero point one, have no exact binary form." },
    { panel: 3, text: "So zero point one plus zero point two is not exactly zero point three." },
    { panel: 3, text: "Two rules for business analytics. Never test floats for exact equality: round first, or use math dot isclose. And round only for display, at the very end." },

    { panel: 4, text: "The type names double as conversion functions." },
    { panel: 4, text: "float of three gives three point zero. int of three point nine nine gives three: it truncates toward zero, it does not round. Rounding is a separate function." },
    { panel: 4, text: "str turns a number into text, and int turns text into a number." },
    { panel: 4, text: "A conversion that makes no sense, like int of the words forty-two, raises a ValueError." },

    { panel: 5, text: "None is the single value of type NoneType. It stands for nothing, or missing." },
    { panel: 5, text: "A function that doesn't explicitly return a value returns None. Even print: it displays text, but returns None." },
    { panel: 5, text: "To check for it, use the identity operator: if value is None." },

    { panel: 6, text: "Comparisons produce Booleans. And every object has a truth value, which the bool function reveals." },
    { panel: 6, text: "The rule is simple: None, zero, and empty things are False. Everything else is True." },
    { panel: 6, text: "That lets you write conditions compactly. If the user typed nothing, the empty string is False, and we ask again." },

    { panel: 7, text: "To display numbers nicely, use an f-string: a string with an f before the opening quote. Expressions in curly braces are evaluated and inserted." },
    { panel: 7, text: "A format specification after a colon controls the display. Point two f shows two decimals. A comma adds thousands separators. And point one percent shows a percentage with one decimal." },
    { panel: 7, text: "Formatting changes only how a value is displayed. The variable keeps its full precision." },

    { panel: 8, text: "Warmup. Combine a student's name and grade into one sentence." },
    { panel: 8, text: "Concatenation needs str to convert the number. The format method works too. But the f-string is the shortest and most readable, and it's the style we'll use from now on." },
    { panel: 8, text: "Careful with whole percentages: int truncates, while the format specification rounds. For a grade of eighty-eight point six, int gives eighty-eight, and point zero f gives eighty-nine." },

    { panel: 9, text: "Workout. A store sold twelve hundred and fifty units at nineteen ninety-nine each, up from eleven hundred units the month before." },
    { panel: 9, text: "Revenue is units times price, and growth is the change divided by the previous units." },
    { panel: 9, text: "One f-string prints both: revenue with a thousands separator and two decimals, and growth as a percentage with one decimal." },
    { panel: 9, text: "And a rounding curiosity: round of two point six seven five, to two decimals, gives two point six seven, because that literal is stored just below two point six seven five. Another reason to round only at the end." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "int and float hold numbers. Slash always returns a float, double slash keeps integers." },
    { panel: 10, text: "Floats are approximations: don't compare them with double equals, and round only for display." },
    { panel: 10, text: "Convert with int, float, str and bool. None means no value: test it with is None. None, zero and empty things are falsy." },
    { panel: 10, text: "And f-strings are the way to format output. Next up: Module 6, strings." },
  ],
});
