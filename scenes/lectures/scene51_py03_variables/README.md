# Scene 51: Python 03 · Variables

> Module 3 of the Python course, at a black chalkboard: the anatomy of a Python program, creating and naming variables, variables as references to objects, types and methods, and text typed by a user.

| | |
|---|---|
| **Length** | about 5½ minutes (the voice ends at 5:24.1; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/03_variables.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/03_variables.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

The midpoint program is annotated rule by rule (comments, one statement per line, colons and indentation, parentheses). Then assignment, naming rules and conventions, and the key idea that names refer to objects: two names can share one list, while arithmetic on a number makes a new object. Types and methods, input() returning text, and a workout on types and TypeErrors follow.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Variables | title card, four goals |
| 02 | Anatomy of a Python program | the midpoint program with comments, statements, colons, indentation and parentheses circled |
| 03 | Creating variables | name = value; price × quantity → 59.97; "= means assign"; quantity = quantity + 1 |
| 04 | Naming variables | rules (✓ / ✗) and conventions (snake_case, descriptive names) |
| 05 | Variables are references | x pointing to an int, then a str, then a list in memory |
| 06 | Two names, one object | a shared list changed through x and seen through y; x = x + 5 makes a new object |
| 07 | Everything is an object | type(); attributes and methods; upper(), is_integer(), as_integer_ratio(); the Tab and ? tip |
| 08 | Values typed by a user | input() returns "33"; float() converts it |
| 09 | Workout: types and errors | types of 4, 3.1415, 1.0, 2+4j, 'Hello'; string + and *; two TypeErrors |
| 10 | Summary | five takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene51_py03_variables`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene51_py03_variables`.

<!-- narration:start -->
**40 lines · 725 words · voice ends at 5:24.1** (pace: 2.5 words per second).


### Panel 01 · Variables

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 3: variables. |
| 0:07.0 | Today you'll learn to read the basic syntax of a Python program, and to create, name and reassign variables. |
| 0:15.1 | We'll see why Python variables are references to objects, and how to inspect an object's type and call its methods. |

### Panel 02 · Anatomy of a Python program

| Cue | Narration |
|---|---|
| 0:24.7 | Here's a short program. It splits the numbers zero to nine into two groups: those below a midpoint, and those at or above it. |
| 0:34.8 | It shows the main rules of Python syntax. Comments start with a hash sign, and Python ignores everything after it. |
| 0:43.3 | The end of a line ends a statement. There's no semicolon. |
| 0:48.2 | Indentation matters. A colon at the end of a line introduces an indented block: the body of the loop, or the lines that run only when the condition is true. Use four spaces per level. |
| 1:02.7 | And parentheses either group an operation, or call a function and pass it arguments. |

### Panel 03 · Creating variables

| Cue | Narration |
|---|---|
| 1:09.9 | A variable is a name that refers to a value. You create one with the assignment operator, the equals sign: the name on the left, the value on the right. |
| 1:22.4 | Price times quantity gives a revenue of fifty-nine ninety-seven. |
| 1:26.5 | The equals sign means assign, not equals. Quantity equals quantity plus one would be nonsense in algebra. |
| 1:33.8 | In Python it means: compute quantity plus one, then make quantity refer to the result. Now it's four. |

### Panel 04 · Naming variables

| Cue | Narration |
|---|---|
| 1:42.6 | Names may contain letters, digits and underscores, but they can't start with a digit, or be a keyword such as for, if or class. |
| 1:52.7 | Names are case sensitive: capital-R Revenue and lowercase revenue are different variables. |
| 1:58.0 | By convention, Python programmers write names in lowercase with underscores between words. That's called snake case. |
| 2:04.9 | And choose names that describe the content. unit price is better than p, or x one. |

### Panel 05 · Variables are references

| Cue | Narration |
|---|---|
| 2:12.9 | Here's an important idea. In Python, a variable doesn't contain a value; it refers, or points, to an object stored in memory. |
| 2:22.2 | Python is dynamically typed: the same name can refer to an integer, then to a string, then to a list. |
| 2:30.7 | The type belongs to the object, not to the name. |

### Panel 06 · Two names, one object

| Cue | Narration |
|---|---|
| 2:36.3 | Because variables are references, two names can refer to the same object. |
| 2:41.6 | Make a list x, and set y equal to x. Now append four through x... and y shows the four as well. There's only one list. |
| 2:52.5 | Numbers and strings, by contrast, can't be changed in place. |
| 2:57.0 | x plus five creates a new object, fifteen, and only the name on the left moves to it. y still refers to ten. |

### Panel 07 · Everything is an object

| Cue | Narration |
|---|---|
| 3:07.8 | Every value in Python is an object with a type. Use the type function to find it: int, str, float. |
| 3:16.3 | Objects also carry attributes, which are data, and methods, which are functions attached to the object. Both are accessed with a dot, and methods are called with parentheses. |
| 3:28.0 | A string can make an upper-case copy of itself. A float can tell you whether it's a whole number, or give you the fraction it equals: four and a half is nine over two. |
| 3:42.1 | A tip: type a name and a dot, then press Tab, to list the methods. Add a question mark to read the documentation. |

### Panel 08 · Values typed by a user

| Cue | Narration |
|---|---|
| 3:52.9 | One more tool. The input function pauses the program and waits for the user to type something. |
| 4:00.2 | Whatever the user types comes back as text, a string, even if it looks like a number. |
| 4:07.5 | So before doing arithmetic, convert it with int or float. The string thirty-three becomes the number thirty-three point zero. |

### Panel 09 · Workout: types and errors

| Cue | Narration |
|---|---|
| 4:16.7 | Let's work out. Assign values of different types, and check each type. |
| 4:22.0 | One point zero is a float, not an int: the decimal point is what matters. And two plus four j is a complex number, which we'll rarely need. |
| 4:33.7 | Strings support plus, which concatenates, and multiplication by an integer, which repeats. |
| 4:39.0 | But Python refuses to subtract strings, or to add a string to a number. Instead of guessing, it raises a TypeError. |
| 4:47.9 | Read error messages from the bottom: the last line names the error and explains the problem. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:55.9 | To sum up. |
| 4:57.8 | A program is a sequence of statements. Indentation defines blocks, and a hash starts a comment. |
| 5:04.7 | Name equals value creates or updates a variable. Use descriptive snake case names. |
| 5:10.4 | Variables are references to objects, and two names can share one object. Every object has a type and methods. |
| 5:18.5 | And input always returns a string. Next, the drill, and then Module 4: operators. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the midpoint program on panel 2 and the TypeErrors on panel 9), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
