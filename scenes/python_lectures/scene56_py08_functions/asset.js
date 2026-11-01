// Scene 56: Python lecture, Module 8 · Functions (lectures/08_functions.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene56_py08_functions).
asset({
  title: 'Python 08 · Functions',
  logline: 'Module 8 of the Python course, at a black chalkboard: calling and defining functions, return and docstrings, default and keyword arguments, local variables, lambda, and passing functions to other functions.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/08_functions.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 8: functions." },
    { panel: 1, text: "A function is a named, reusable block of code. Write a calculation once, use it many times, and break a large problem into small pieces that are easy to test." },
    { panel: 1, text: "Today you'll define functions with parameters, return values and docstrings, give parameters defaults, write lambdas, and pass functions to other functions." },

    { panel: 2, text: "You've already called many functions: print, len, type, round. The arguments go inside the parentheses." },
    { panel: 2, text: "Some arguments are given by position. Others are given by name: keyword arguments, like sep, which sets the separator print puts between values." },
    { panel: 2, text: "To see which arguments a function accepts, use help, or type the name with a question mark." },

    { panel: 3, text: "To define a function, write def, the name, the parameters in parentheses, and a colon. The indented body runs each time the function is called." },
    { panel: 3, text: "return sends the result back to the caller. Net price of eighty, with a twenty-five percent discount, is sixty." },
    { panel: 3, text: "The string in triple quotes below the def line is a docstring. It documents the function, and help shows it." },
    { panel: 3, text: "A function can be used anywhere a value can, like inside a sum. And it can return several values at once, which the caller unpacks." },

    { panel: 4, text: "A common mistake: printing instead of returning." },
    { panel: 4, text: "A function that only prints gives nothing back. It returns None, so its result can't be used in further calculations." },
    { panel: 4, text: "Prefer return, and print the result where you call the function." },

    { panel: 5, text: "Parameters can have default values, which are used when the caller leaves them out. Parameters with defaults must come after those without." },
    { panel: 5, text: "With no discount and the default tax of eight percent, a hundred dollars becomes a hundred and eight. With a twenty percent discount, eighty-six forty." },
    { panel: 5, text: "Keyword arguments can be given in any order, and they make calls self-explanatory." },
    { panel: 5, text: "And star args and double-star kwargs collect any extra arguments, into a tuple and a dictionary. You'll mostly meet them in library documentation." },

    { panel: 6, text: "Parameters and variables created inside a function are local. They exist only while the function runs." },
    { panel: 6, text: "Ask for tax outside add tax, and Python raises a NameError." },
    { panel: 6, text: "This isolation is a feature. Pass in everything a function needs as arguments, and get everything back through return." },

    { panel: 7, text: "A lambda expression creates a small function in one line. It holds a single expression, whose value is returned automatically." },
    { panel: 7, text: "Functions are objects too, so they can be passed to other functions. apply twice calls f, then calls f again on the result." },
    { panel: 7, text: "The most common use is custom sorting. sorted takes an optional key function, which computes the value to sort by: absolute value, or the length of each name." },

    { panel: 8, text: "Warmup. Write a function mask that hides a string behind asterisks of the same length." },
    { panel: 8, text: "Then the same function as a lambda, and then with an optional masking character." },
    { panel: 8, text: "And is number: True if a word has only digits and dashes, with at least one digit. A shorter version removes the dashes and calls isdigit." },

    { panel: 9, text: "Workout. A function classify hides the sensitive numbers in a message." },
    { panel: 9, text: "The email address should be hidden too. So we make classify more general, with a parameter is sensitive: a function that decides which words to mask." },
    { panel: 9, text: "To mask both numbers and emails, pass a lambda that combines the two tests." },
    { panel: 9, text: "Passing behavior as a parameter made classify reusable: a new kind of sensitive data only needs a new test function." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "Define functions with def, document them with a docstring, and send results back with return." },
    { panel: 10, text: "Parameters can have defaults, and callers can pass arguments by position or by keyword. Variables inside a function are local." },
    { panel: 10, text: "lambda creates small anonymous functions, and functions can be passed to other functions, like a key for sorted. Next up: Module 9, data structures." },
  ],
});
