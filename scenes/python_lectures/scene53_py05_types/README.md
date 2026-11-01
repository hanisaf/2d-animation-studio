# Scene 53: Python 05 · Built-In Types

> Module 5 of the Python course, at a black chalkboard: integers and floats, why 0.1 + 0.2 is not 0.3, converting between types, None, truthiness, and formatting numbers with f-strings.

| | |
|---|---|
| **Length** | about 5 minutes (the voice ends at 4:53.7; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/05_types.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/05_types.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

The table of simple types, unlimited integers, and / versus //. Floats in binary make 0.1 + 0.2 miss 0.3, so never compare floats with == and round only for display. Conversions (int truncates), None, truthiness (None, zero and empty are False), and f-string format specifications. The warmup builds a sentence three ways; the workout prints a one-line sales report and meets round(2.675, 2).

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Built-In Types | title card, four goals |
| 02 | Simple types | int, float, complex, bool, str, NoneType; 2 ** 200; 6 / 2 vs 6 // 2 |
| 03 | Floats are approximations | scientific notation; 0.1 in binary; 0.1 + 0.2; two rules |
| 04 | Converting between types | float(), int() truncates, round(), str(), int(); a ValueError |
| 05 | None | None means "no value"; print returns None; if value is None |
| 06 | Booleans and truthiness | falsy vs truthy values; if user_text: |
| 07 | Formatting with f-strings | the parts of an f-string; :.2f, :, , :,.2f, :.1% |
| 08 | Warmup: a sentence from data | concatenation, format(), f-string; int() truncates vs :.0f rounds |
| 09 | Workout: a one-line report | revenue and growth in one f-string; round(2.675, 2) → 2.67 |
| 10 | Summary | six takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene53_py05_types`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene53_py05_types`.

<!-- narration:start -->
**36 lines · 653 words · voice ends at 4:53.7** (pace: 2.5 words per second).


### Panel 01 · Built-In Types

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 5: built-in types. |
| 0:07.4 | Today we'll work with Python's simple types: integers, floats, strings, Booleans and None. |
| 0:13.1 | You'll see why floating-point arithmetic can be slightly inexact, convert values between types, predict the truth value of any object, and format numbers for display. |

### Panel 02 · Simple types

| Cue | Narration |
|---|---|
| 0:24.7 | Python's simple, or scalar, types each hold a single value. |
| 0:29.2 | int for whole numbers, float for real numbers, complex for complex numbers, bool for True and False, str for text, and NoneType, whose only value is None. |
| 0:40.5 | Python integers have unlimited precision. Two to the power two hundred is no problem. |
| 0:46.6 | Dividing two integers with a single slash always gives a float, even when the result is whole. Use floor division to keep an integer. |

### Panel 03 · Floats are approximations

| Cue | Narration |
|---|---|
| 0:57.8 | Floats store fractional numbers, in decimal or in scientific notation, where e means times ten to the power. |
| 1:05.5 | But floats are approximations. Computers store them in binary, and most decimal fractions, like zero point one, have no exact binary form. |
| 1:14.8 | So zero point one plus zero point two is not exactly zero point three. |
| 1:20.9 | Two rules for business analytics. Never test floats for exact equality: round first, or use math dot isclose. And round only for display, at the very end. |

### Panel 04 · Converting between types

| Cue | Narration |
|---|---|
| 1:33.3 | The type names double as conversion functions. |
| 1:36.6 | float of three gives three point zero. int of three point nine nine gives three: it truncates toward zero, it does not round. Rounding is a separate function. |
| 1:48.3 | str turns a number into text, and int turns text into a number. |
| 1:54.0 | A conversion that makes no sense, like int of the words forty-two, raises a ValueError. |

### Panel 05 · None

| Cue | Narration |
|---|---|
| 2:01.6 | None is the single value of type NoneType. It stands for nothing, or missing. |
| 2:07.7 | A function that doesn't explicitly return a value returns None. Even print: it displays text, but returns None. |
| 2:15.4 | To check for it, use the identity operator: if value is None. |

### Panel 06 · Booleans and truthiness

| Cue | Narration |
|---|---|
| 2:21.8 | Comparisons produce Booleans. And every object has a truth value, which the bool function reveals. |
| 2:28.3 | The rule is simple: None, zero, and empty things are False. Everything else is True. |
| 2:34.8 | That lets you write conditions compactly. If the user typed nothing, the empty string is False, and we ask again. |

### Panel 07 · Formatting with f-strings

| Cue | Narration |
|---|---|
| 2:44.4 | To display numbers nicely, use an f-string: a string with an f before the opening quote. Expressions in curly braces are evaluated and inserted. |
| 2:54.5 | A format specification after a colon controls the display. Point two f shows two decimals. A comma adds thousands separators. And point one percent shows a percentage with one decimal. |
| 3:07.0 | Formatting changes only how a value is displayed. The variable keeps its full precision. |

### Panel 08 · Warmup: a sentence from data

| Cue | Narration |
|---|---|
| 3:14.2 | Warmup. Combine a student's name and grade into one sentence. |
| 3:18.7 | Concatenation needs str to convert the number. The format method works too. But the f-string is the shortest and most readable, and it's the style we'll use from now on. |
| 3:31.2 | Careful with whole percentages: int truncates, while the format specification rounds. For a grade of eighty-eight point six, int gives eighty-eight, and point zero f gives eighty-nine. |

### Panel 09 · Workout: a one-line report

| Cue | Narration |
|---|---|
| 3:43.6 | Workout. A store sold twelve hundred and fifty units at nineteen ninety-nine each, up from eleven hundred units the month before. |
| 3:52.5 | Revenue is units times price, and growth is the change divided by the previous units. |
| 3:59.0 | One f-string prints both: revenue with a thousands separator and two decimals, and growth as a percentage with one decimal. |
| 4:07.5 | And a rounding curiosity: round of two point six seven five, to two decimals, gives two point six seven, because that literal is stored just below two point six seven five. Another reason to round only at the end. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:24.7 | To recap. |
| 4:26.6 | int and float hold numbers. Slash always returns a float, double slash keeps integers. |
| 4:32.7 | Floats are approximations: don't compare them with double equals, and round only for display. |
| 4:38.8 | Convert with int, float, str and bool. None means no value: test it with is None. None, zero and empty things are falsy. |
| 4:48.5 | And f-strings are the way to format output. Next up: Module 6, strings. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the f-string on panel 7 and the report code on panel 9), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
