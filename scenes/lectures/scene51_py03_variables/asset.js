// Scene 51: Python lecture, Module 3 · Variables (lectures/03_variables.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene51_py03_variables).
asset({
  title: 'Python 03 · Variables',
  logline: 'Module 3 of the Python course, at a black chalkboard: the anatomy of a Python program, creating and naming variables, variables as references to objects, types and methods, and text typed by a user.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/03_variables.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 3: variables." },
    { panel: 1, text: "Today you'll learn to read the basic syntax of a Python program, and to create, name and reassign variables." },
    { panel: 1, text: "We'll see why Python variables are references to objects, and how to inspect an object's type and call its methods." },

    { panel: 2, text: "Here's a short program. It splits the numbers zero to nine into two groups: those below a midpoint, and those at or above it." },
    { panel: 2, text: "It shows the main rules of Python syntax. Comments start with a hash sign, and Python ignores everything after it." },
    { panel: 2, text: "The end of a line ends a statement. There's no semicolon." },
    { panel: 2, text: "Indentation matters. A colon at the end of a line introduces an indented block: the body of the loop, or the lines that run only when the condition is true. Use four spaces per level." },
    { panel: 2, text: "And parentheses either group an operation, or call a function and pass it arguments." },

    { panel: 3, text: "A variable is a name that refers to a value. You create one with the assignment operator, the equals sign: the name on the left, the value on the right." },
    { panel: 3, text: "Price times quantity gives a revenue of fifty-nine ninety-seven." },
    { panel: 3, text: "The equals sign means assign, not equals. Quantity equals quantity plus one would be nonsense in algebra." },
    { panel: 3, text: "In Python it means: compute quantity plus one, then make quantity refer to the result. Now it's four." },

    { panel: 4, text: "Names may contain letters, digits and underscores, but they can't start with a digit, or be a keyword such as for, if or class." },
    { panel: 4, text: "Names are case sensitive: capital-R Revenue and lowercase revenue are different variables." },
    { panel: 4, text: "By convention, Python programmers write names in lowercase with underscores between words. That's called snake case." },
    { panel: 4, text: "And choose names that describe the content. unit price is better than p, or x one." },

    { panel: 5, text: "Here's an important idea. In Python, a variable doesn't contain a value; it refers, or points, to an object stored in memory." },
    { panel: 5, text: "Python is dynamically typed: the same name can refer to an integer, then to a string, then to a list." },
    { panel: 5, text: "The type belongs to the object, not to the name." },

    { panel: 6, text: "Because variables are references, two names can refer to the same object." },
    { panel: 6, text: "Make a list x, and set y equal to x. Now append four through x... and y shows the four as well. There's only one list." },
    { panel: 6, text: "Numbers and strings, by contrast, can't be changed in place." },
    { panel: 6, text: "x plus five creates a new object, fifteen, and only the name on the left moves to it. y still refers to ten." },

    { panel: 7, text: "Every value in Python is an object with a type. Use the type function to find it: int, str, float." },
    { panel: 7, text: "Objects also carry attributes, which are data, and methods, which are functions attached to the object. Both are accessed with a dot, and methods are called with parentheses." },
    { panel: 7, text: "A string can make an upper-case copy of itself. A float can tell you whether it's a whole number, or give you the fraction it equals: four and a half is nine over two." },
    { panel: 7, text: "A tip: type a name and a dot, then press Tab, to list the methods. Add a question mark to read the documentation." },

    { panel: 8, text: "One more tool. The input function pauses the program and waits for the user to type something." },
    { panel: 8, text: "Whatever the user types comes back as text, a string, even if it looks like a number." },
    { panel: 8, text: "So before doing arithmetic, convert it with int or float. The string thirty-three becomes the number thirty-three point zero." },

    { panel: 9, text: "Let's work out. Assign values of different types, and check each type." },
    { panel: 9, text: "One point zero is a float, not an int: the decimal point is what matters. And two plus four j is a complex number, which we'll rarely need." },
    { panel: 9, text: "Strings support plus, which concatenates, and multiplication by an integer, which repeats." },
    { panel: 9, text: "But Python refuses to subtract strings, or to add a string to a number. Instead of guessing, it raises a TypeError." },
    { panel: 9, text: "Read error messages from the bottom: the last line names the error and explains the problem." },

    { panel: 10, text: "To sum up." },
    { panel: 10, text: "A program is a sequence of statements. Indentation defines blocks, and a hash starts a comment." },
    { panel: 10, text: "Name equals value creates or updates a variable. Use descriptive snake case names." },
    { panel: 10, text: "Variables are references to objects, and two names can share one object. Every object has a type and methods." },
    { panel: 10, text: "And input always returns a string. Next, the drill, and then Module 4: operators." },
  ],
});
