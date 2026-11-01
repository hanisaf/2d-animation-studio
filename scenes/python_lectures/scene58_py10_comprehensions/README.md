# Scene 58: Python 10 · Comprehensions

> Module 10 of the Python course, at a black chalkboard: list, set and dictionary comprehensions, filtering and transforming, summarizing with sum, any and all, and the map–filter–reduce pattern.

| | |
|---|---|
| **Length** | about 4½ minutes (the voice ends at 4:30.0; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/10_comprehensions.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/10_comprehensions.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

The append loop becomes one line, read as English. Filtering with if at the end, transforming with if/else at the front, nested for clauses, and set and dictionary comprehensions. Generator expressions inside sum, any, all and max with a key. Map, filter and reduce are drawn as pictograms. Warmups build calendars and flip a dictionary; the workout masks emails and finds the longest word three ways.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Comprehensions | title card, four goals |
| 02 | List comprehensions | the loop vs the one-liner; [expression for variable in iterable]; a 15% discount |
| 03 | Filtering with a condition | if at the end; the loop equivalent, part by part |
| 04 | Transforming with a conditional expression | value_if_true if condition else value_if_false; filter vs transform |
| 05 | More comprehensions | nested for clauses; a set comprehension; a dictionary comprehension |
| 06 | Summarizing data | len, sum, min, max, any, all; generator expressions; max with key |
| 07 | Map, filter, reduce | pictograms of each; functools.reduce; prefer built-ins and readability |
| 08 | Warmup: dates and dictionaries | January, 372 and 365 dates; flipping e2f into f2e |
| 09 | Workout: words and emails | masking emails; the longest word three ways; excluding emails |
| 10 | Summary | the pattern → syntax table |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene58_py10_comprehensions`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene58_py10_comprehensions`.

<!-- narration:start -->
**33 lines · 599 words · voice ends at 4:30.0** (pace: 2.5 words per second).


### Panel 01 · Comprehensions

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 10: comprehensions. |
| 0:07.0 | Today you'll build lists with comprehensions instead of loops, filter and transform items inside them, and create sets and dictionaries the same way. |
| 0:16.7 | Then we'll summarize data with sum, min, max, any and all, and meet the map, filter, reduce pattern of functional programming. |

### Panel 02 · List comprehensions

| Cue | Narration |
|---|---|
| 0:26.7 | In Module 7, we built lists with the empty-list-and-append pattern: three lines for the squares of zero to eleven. |
| 0:34.8 | A list comprehension says the same thing in a single line. |
| 0:39.7 | Read it almost as English: the list of n squared, for each n in range twelve. The general form is: expression, for variable in iterable. |
| 0:50.2 | A business example: apply a fifteen percent discount to every price. |

### Panel 03 · Filtering with a condition

| Cue | Narration |
|---|---|
| 0:56.2 | Add if at the end to keep only the items that satisfy a condition, like the numbers that aren't multiples of three, or only the large orders. |
| 1:07.5 | The loop version shows where each part of the comprehension comes from: the for, the if, and the expression we append. |

### Panel 04 · Transforming with a conditional expression

| Cue | Narration |
|---|---|
| 1:17.5 | A conditional expression chooses between two values in a single line: value if condition, else other value. |
| 1:24.8 | Placed at the front of a comprehension, it transforms every item, and nothing is dropped: each order becomes large or small. |
| 1:33.7 | So remember: if at the end filters. If-else at the front transforms. |

### Panel 05 · More comprehensions

| Cue | Narration |
|---|---|
| 1:40.1 | A comprehension can hold several for clauses, which behave like nested loops: every size with every color. |
| 1:47.4 | Curly braces make a set comprehension, like the distinct remainders after dividing by three. |
| 1:53.5 | And a key-colon-value pair makes a dictionary comprehension: each product mapped to its discounted price. |

### Panel 06 · Summarizing data

| Cue | Narration |
|---|---|
| 2:01.1 | Built-in functions reduce a collection to one value: len, sum, min, max, and any and all, which test whether at least one, or every, item is true. |
| 2:12.4 | Combined with a comprehension, they answer analytical questions in one line. When the comprehension is the only argument, drop the brackets. That's a generator expression. |
| 2:22.9 | The total of the large orders is six hundred thirty. Is any order above two fifty? Yes. Are all orders positive? Yes. |
| 2:32.2 | min, max and sorted accept a key function, so they can find the item with the largest something, like the longest word. |

### Panel 07 · Map, filter, reduce

| Cue | Narration |
|---|---|
| 2:42.6 | Comprehensions implement two of the three classic operations of functional programming. |
| 2:47.5 | Map applies a function to every item. Filter keeps the items that pass a test. |
| 2:54.0 | Reduce combines all the items into one value. sum and max are special cases, and functools dot reduce is the general version. |
| 3:03.3 | Prefer the specific built-ins when they exist. And keep comprehensions simple: if one spans several lines with nested conditions, a regular loop is easier to read. |

### Panel 08 · Warmup: dates and dictionaries

| Cue | Narration |
|---|---|
| 3:15.3 | Warmup. The dates of January in one comprehension. Then every month: three hundred seventy-two dates, if we ignore month lengths. |
| 3:23.8 | A valid date function filters out the dates that don't exist, leaving three hundred sixty-five. |
| 3:30.3 | And a dictionary comprehension flips an English to French dictionary into French to English. |

### Panel 09 · Workout: words and emails

| Cue | Narration |
|---|---|
| 3:37.5 | Workout. Replace every email address in a message with stars of the same length. A conditional expression transforms each word, and join reassembles them. |
| 3:47.6 | What's the longest word? Find the maximum length and filter, or use max with key equals len, or reduce. |
| 3:55.7 | And the longest word that isn't an email: a generator expression filters the emails before max sees them. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:04.5 | To recap the patterns. |
| 4:06.6 | Transform with f of x, for x in items. Filter with if at the end. Transform conditionally with if-else at the front. |
| 4:15.9 | Several for clauses make nested loops. Curly braces make sets and dictionaries. |
| 4:21.2 | And reduce with sum, max, any, all, or functools dot reduce. Next up: Module 11, a complete data analysis in pure Python. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the general form on panel 2), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
