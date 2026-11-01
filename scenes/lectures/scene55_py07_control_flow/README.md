# Scene 55: Python 07 · Control Flow

> Module 7 of the Python course, at a black chalkboard: if, elif and else; for and while loops; break, continue and a loop's else; the accumulator pattern; and handling errors with try and except.

| | |
|---|---|
| **Length** | about 5 minutes (the voice ends at 5:01.2; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/07_control_flow.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/07_control_flow.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

Shipping costs show if/elif/else as a decision flow. for loops over lists, strings and range(); the accumulator pattern with a bar chart of a week of sales; a while loop doubling an investment; break, continue, enumerate and a loop's else. Exceptions, and try/except naming the errors you expect. Warmups (a guessing game, collecting emails) and a workout (secret numbers two ways, a leap-year calendar) close it.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Control Flow | title card, four goals |
| 02 | Conditional statements | the shipping code and its decision flow; first True wins |
| 03 | for loops and range() | looping over a list and a string; range(n) and range(start, stop, step) |
| 04 | The accumulator pattern | total and big_days over daily sales, with a bar chart |
| 05 | while loops | doubling $1,000 at 7% in 11 years, plotted; beware of infinite loops |
| 06 | break, continue, and a loop's else | skip even numbers; first day above $2,000; for–else |
| 07 | Errors and exceptions | four common exceptions; try/except over user input; name the exceptions |
| 08 | Warmup: loops that stop | while True + break; collecting emails |
| 09 | Workout: secret numbers and a calendar | a flag vs for–else; nested loops for 366 dates |
| 10 | Summary | six takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene55_py07_control_flow`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene55_py07_control_flow`.

<!-- narration:start -->
**35 lines · 673 words · voice ends at 5:01.2** (pace: 2.5 words per second).


### Panel 01 · Control Flow

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 7: control flow. |
| 0:07.4 | So far our code has run from top to bottom, one line after another. Control flow statements let a program choose between alternatives, and repeat steps. |
| 0:18.3 | Today: if, elif and else; for and while loops; break and continue; the accumulator pattern; and handling errors with try and except. |

### Panel 02 · Conditional statements

| Cue | Narration |
|---|---|
| 0:28.7 | An online store charges shipping based on the order total. |
| 0:33.2 | Free at a hundred dollars or more, four ninety-nine at fifty or more, and nine ninety-nine otherwise. |
| 0:40.5 | Python checks the conditions from top to bottom, and runs the block under the first one that's True. The rest are skipped. An order of seventy-two fifty pays four ninety-nine. |
| 0:53.0 | elif, short for else if, can appear any number of times, and both elif and else are optional. |

### Panel 03 · for loops and range()

| Cue | Narration |
|---|---|
| 1:01.8 | A for loop runs a block once for each item in a sequence, such as a list, or the characters of a string. |
| 1:11.5 | range generates a sequence of integers. range of n counts from zero up to, but not including, n. |
| 1:19.2 | range with a start, a stop, and a step gives more control: zero to twenty in steps of five. |

### Panel 04 · The accumulator pattern

| Cue | Narration |
|---|---|
| 1:28.4 | Many analyses loop over data while updating a running total or count. That's the accumulator pattern. |
| 1:35.3 | Initialize the accumulators before the loop, and update them inside it. |
| 1:40.2 | For a week of sales, the total is nine thousand eight hundred and ninety, and three days were above fifteen hundred. |
| 1:49.1 | Notice the two levels of indentation: the if is inside the loop, and the count is inside the if. |

### Panel 05 · while loops

| Cue | Narration |
|---|---|
| 1:58.3 | A while loop repeats as long as its condition stays True. Use it when you don't know in advance how many repetitions you need. |
| 2:08.4 | How many years until a thousand dollars at seven percent doubles? Eleven years. |
| 2:14.1 | Beware of infinite loops. If the condition never becomes False, the loop never ends. Stop a runaway cell with the stop button, or Kernel, Interrupt Kernel. |

### Panel 06 · break, continue, and a loop's else

| Cue | Narration |
|---|---|
| 2:26.1 | Two statements control a loop. break exits the loop immediately. continue skips to the next iteration. |
| 2:33.0 | Here break finds the first day with sales above two thousand, and stops looking. enumerate pairs each item with its position. |
| 2:41.9 | A loop can also have an else block, which runs only if the loop finished without a break. It's handy for searches. |

### Panel 07 · Errors and exceptions

| Cue | Narration |
|---|---|
| 2:52.3 | Errors are a normal part of programming. Python reports them by raising an exception, whose name tells you what went wrong. |
| 3:01.2 | NameError for a variable that was never defined, ZeroDivisionError, TypeError for the wrong type, and ValueError for the right type with an unacceptable value. |
| 3:11.3 | When you expect that something may fail, like converting values typed by users, wrap it in try and except. Python jumps to the matching except block instead of stopping. |
| 3:23.4 | Always name the exceptions you expect. A bare except would also hide bugs you didn't anticipate. |

### Panel 08 · Warmup: loops that stop

| Cue | Narration |
|---|---|
| 3:31.4 | Warmup. A guessing game. Start at one, and loop until you reach the number. |
| 3:37.5 | While True loops forever, unless a break ends it. That's a common pattern when the exit test is in the middle of the loop. |
| 3:47.6 | And collecting the email addresses in a message is the list version of the accumulator: start with an empty list, and append. |

### Panel 09 · Workout: secret numbers and a calendar

| Cue | Narration |
|---|---|
| 3:58.0 | Workout. Find the numbers hidden in a secret message: words where every character is a digit or a dash. |
| 4:06.1 | One solution uses a flag: assume each word is a number, until a character proves otherwise. |
| 4:13.0 | Another uses for-else: the else block runs only when the inner loop didn't break. |
| 4:19.1 | Then a calendar: a loop inside a loop prints every date. With the right month lengths for a leap year, we get three hundred sixty-six dates. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:31.1 | To recap. |
| 4:33.0 | if, elif, else runs the block of the first true condition. for repeats a block for each item, and range generates integers. |
| 4:42.3 | while repeats until its condition is False. break exits a loop, continue skips ahead, and a loop's else runs when no break occurred. |
| 4:52.0 | Accumulators start before the loop and update inside it. And try and except handle the errors you anticipate. Next up: Module 8, functions. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the try/except code on panel 7), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
