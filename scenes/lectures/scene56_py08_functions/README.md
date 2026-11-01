# Scene 56: Python 08 · Functions

> Module 8 of the Python course, at a black chalkboard: calling and defining functions, return and docstrings, default and keyword arguments, local variables, lambda, and passing functions to other functions.

| | |
|---|---|
| **Length** | about 5 minutes (the voice ends at 4:41.5; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/08_functions.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/08_functions.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

Calling functions with positional and keyword arguments, then def with parameters, a docstring and return, returning several values, and why to return rather than print. Defaults, keyword arguments and *args/**kwargs; local variables; lambda; functions as arguments and custom sorting with key. The warmup writes mask() and is_number(); the workout generalizes classify() by passing in the test function.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Functions | title card, four goals |
| 02 | Calling functions | print with positional and keyword arguments; help(print) |
| 03 | Defining a function | def, parameters, docstring, return; net_price; summarize() returning three values |
| 04 | return versus print | printing returns None; returning lets you calculate |
| 05 | Default and keyword arguments | net_price with defaults; keywords in any order; *args and **kwargs |
| 06 | Variables inside functions are local | tax exists only inside add_tax; arguments in, return out |
| 07 | lambda and functions as arguments | lambda; apply_twice; sorted with key=abs, key=lambda, key=len |
| 08 | Warmup: masking text | mask() three ways; is_number() two ways |
| 09 | Workout: classify a message | classify(message, is_sensitive=is_number); masking numbers and emails |
| 10 | Summary | five takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene56_py08_functions`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene56_py08_functions`.

<!-- narration:start -->
**34 lines · 625 words · voice ends at 4:41.5** (pace: 2.5 words per second).


### Panel 01 · Functions

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 8: functions. |
| 0:07.0 | A function is a named, reusable block of code. Write a calculation once, use it many times, and break a large problem into small pieces that are easy to test. |
| 0:19.5 | Today you'll define functions with parameters, return values and docstrings, give parameters defaults, write lambdas, and pass functions to other functions. |

### Panel 02 · Calling functions

| Cue | Narration |
|---|---|
| 0:29.5 | You've already called many functions: print, len, type, round. The arguments go inside the parentheses. |
| 0:36.0 | Some arguments are given by position. Others are given by name: keyword arguments, like sep, which sets the separator print puts between values. |
| 0:45.7 | To see which arguments a function accepts, use help, or type the name with a question mark. |

### Panel 03 · Defining a function

| Cue | Narration |
|---|---|
| 0:54.1 | To define a function, write def, the name, the parameters in parentheses, and a colon. The indented body runs each time the function is called. |
| 1:04.6 | return sends the result back to the caller. Net price of eighty, with a twenty-five percent discount, is sixty. |
| 1:12.7 | The string in triple quotes below the def line is a docstring. It documents the function, and help shows it. |
| 1:21.2 | A function can be used anywhere a value can, like inside a sum. And it can return several values at once, which the caller unpacks. |

### Panel 04 · return versus print

| Cue | Narration |
|---|---|
| 1:32.8 | A common mistake: printing instead of returning. |
| 1:36.1 | A function that only prints gives nothing back. It returns None, so its result can't be used in further calculations. |
| 1:44.6 | Prefer return, and print the result where you call the function. |

### Panel 05 · Default and keyword arguments

| Cue | Narration |
|---|---|
| 1:50.6 | Parameters can have default values, which are used when the caller leaves them out. Parameters with defaults must come after those without. |
| 1:59.9 | With no discount and the default tax of eight percent, a hundred dollars becomes a hundred and eight. With a twenty percent discount, eighty-six forty. |
| 2:10.4 | Keyword arguments can be given in any order, and they make calls self-explanatory. |
| 2:16.1 | And star args and double-star kwargs collect any extra arguments, into a tuple and a dictionary. You'll mostly meet them in library documentation. |

### Panel 06 · Variables inside functions are local

| Cue | Narration |
|---|---|
| 2:26.9 | Parameters and variables created inside a function are local. They exist only while the function runs. |
| 2:33.8 | Ask for tax outside add tax, and Python raises a NameError. |
| 2:38.7 | This isolation is a feature. Pass in everything a function needs as arguments, and get everything back through return. |

### Panel 07 · lambda and functions as arguments

| Cue | Narration |
|---|---|
| 2:47.9 | A lambda expression creates a small function in one line. It holds a single expression, whose value is returned automatically. |
| 2:56.4 | Functions are objects too, so they can be passed to other functions. apply twice calls f, then calls f again on the result. |
| 3:06.1 | The most common use is custom sorting. sorted takes an optional key function, which computes the value to sort by: absolute value, or the length of each name. |

### Panel 08 · Warmup: masking text

| Cue | Narration |
|---|---|
| 3:18.9 | Warmup. Write a function mask that hides a string behind asterisks of the same length. |
| 3:25.4 | Then the same function as a lambda, and then with an optional masking character. |
| 3:31.5 | And is number: True if a word has only digits and dashes, with at least one digit. A shorter version removes the dashes and calls isdigit. |

### Panel 09 · Workout: classify a message

| Cue | Narration |
|---|---|
| 3:43.5 | Workout. A function classify hides the sensitive numbers in a message. |
| 3:48.4 | The email address should be hidden too. So we make classify more general, with a parameter is sensitive: a function that decides which words to mask. |
| 3:59.3 | To mask both numbers and emails, pass a lambda that combines the two tests. |
| 4:05.4 | Passing behavior as a parameter made classify reusable: a new kind of sensitive data only needs a new test function. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:15.0 | To recap. |
| 4:16.9 | Define functions with def, document them with a docstring, and send results back with return. |
| 4:23.4 | Parameters can have defaults, and callers can pass arguments by position or by keyword. Variables inside a function are local. |
| 4:31.9 | lambda creates small anonymous functions, and functions can be passed to other functions, like a key for sorted. Next up: Module 9, data structures. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the function definition on panel 3), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
