# Scene 52: Python 04 · Operators

> Module 4 of the Python course, at a black chalkboard: arithmetic and its order, augmented assignment, comparisons and Boolean logic, identity and membership, and what + and * mean for strings and lists.

| | |
|---|---|
| **Length** | about 5 minutes (the voice ends at 5:06.4; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/04_operators.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/04_operators.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

The arithmetic table and the order of operations, then floor division and modulus (135 minutes = 2 h 15 min), compound interest, and a balance updated with +=, -= and *=. Comparisons (with = versus ==), the truth table for and/or/not and a loan approval, identity versus equality and membership, and operators on strings and lists. The workout writes an odd-number test two ways and turns a tennis decision tree into one Boolean expression.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Operators | title card, four goals |
| 02 | Arithmetic operators | the seven operators with examples; order of operations; 2 + 4 * 5 vs (2 + 4) * 5 |
| 03 | Floor division, modulus, and powers | 135 minutes → 2 hours 15 minutes; $1,000 at 5% for 10 years ≈ $1,629 |
| 04 | Augmented assignment | a += b means a = a + b; a balance 100 → 125 → 85 → 86.7 |
| 05 | Comparison operators | the comparison table; = assigns, == compares; inventory examples; chained comparisons |
| 06 | Boolean operators | truth table for and / or / not; a loan approval |
| 07 | Identity and membership | a == b but a is not b; use is for None; in with lists and strings |
| 08 | Operators on strings and lists | + joins, * repeats; TypeError and its fixes; comparing strings by character code |
| 09 | Workout | odd-number test two ways; the tennis decision tree as one Boolean expression |
| 10 | Summary | five takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene52_py04_operators`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene52_py04_operators`.

<!-- narration:start -->
**39 lines · 681 words · voice ends at 5:06.4** (pace: 2.5 words per second).


### Panel 01 · Operators

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 4: operators. |
| 0:07.0 | Today you'll calculate with arithmetic operators and control their order, and update variables with augmented assignment. |
| 0:13.9 | You'll compare values, combine conditions with and, or and not, test identity and membership, and predict how operators behave on strings and lists. |

### Panel 02 · Arithmetic operators

| Cue | Narration |
|---|---|
| 0:24.7 | Python has seven arithmetic operators: addition, subtraction, multiplication, true division, floor division, the modulus or remainder, and exponentiation. |
| 0:32.4 | Seven divided by two is three point five. Floor division drops the fraction and gives three, and the remainder is one. |
| 0:41.3 | Python follows the usual order of operations: exponents first, then multiplication and division, then addition and subtraction. |
| 0:48.6 | So two plus four times five is twenty-two. Use parentheses whenever the order isn't obvious: two plus four, times five, is thirty. |

### Panel 03 · Floor division, modulus, and powers

| Cue | Narration |
|---|---|
| 0:59.0 | Floor division and modulus are a natural pair. A call lasted one hundred thirty-five minutes. How many full hours, and how many minutes left over? |
| 1:09.5 | Floor division by sixty gives two hours, and the remainder gives fifteen minutes. |
| 1:15.2 | Exponentiation appears in many financial formulas. A thousand dollars invested for ten years at five percent grows to one thousand times one point oh five to the tenth power... |
| 1:27.3 | ...about sixteen hundred and twenty-nine dollars. |

### Panel 04 · Augmented assignment

| Cue | Narration |
|---|---|
| 1:31.3 | Updating a variable with its own value is so common that Python has a shorthand for every arithmetic operator. |
| 1:39.4 | a plus-equals b means a equals a plus b, and the same works for minus, times and the rest. |
| 1:47.5 | A balance starts at one hundred. Deposit twenty-five, withdraw forty, and add two percent interest. The balance is eighty-six seventy. |

### Panel 05 · Comparison operators

| Cue | Narration |
|---|---|
| 1:57.1 | Comparison operators return a Boolean value: True or False. |
| 2:01.2 | Double equals tests equality, exclamation-equals tests inequality, and there are less than, greater than, and their or-equal versions. |
| 2:08.9 | Don't confuse a single equals, which assigns, with a double equals, which compares. |
| 2:14.6 | With an inventory of twenty-five, inventory equals twenty-five is True, and inventory less than ten is False. Inventory modulo two equals one is True, so twenty-five is odd. |
| 2:26.3 | And comparisons can be chained, just as in mathematics: fifteen is less than inventory, which is less than thirty. |

### Panel 06 · Boolean operators

| Cue | Narration |
|---|---|
| 2:35.5 | Combine conditions with and, or, and not. |
| 2:38.8 | And is True only when both sides are True. Or is True when at least one side is. Not flips a value. |
| 2:48.1 | A lender approves a loan when the credit score is at least six eighty and the income is at least forty thousand. Both hold, so the answer is True. |

### Panel 07 · Identity and membership

| Cue | Narration |
|---|---|
| 3:01.3 | The identity operator, is, checks whether two names refer to the same object. In, checks membership. |
| 3:08.2 | Two lists can have equal contents and still be different objects: a double-equals b is True, but a is b is False. |
| 3:17.5 | In practice, use double equals to compare values, and reserve is for checking against the special value None. |
| 3:25.2 | Membership works with lists and with strings: two is in the list one two three, and there is in hello there. |

### Panel 08 · Operators on strings and lists

| Cue | Narration |
|---|---|
| 3:35.2 | Some operators work on other types, with a meaning adapted to the type. |
| 3:40.9 | Plus joins two strings or two lists, and times repeats them. |
| 3:45.8 | But you can't add a number to a list or to a string. Wrap the number in a list, or convert it with str. |
| 3:55.9 | Strings are compared character by character, by character code: alphabetical for letters of the same case, but every uppercase letter comes before every lowercase one. |

### Panel 09 · Workout

| Cue | Narration |
|---|---|
| 4:07.5 | Workout. The code picks a random number from one to ten. Write a Boolean expression that is True when it's odd. |
| 4:16.4 | Two approaches: arithmetic, with the remainder after dividing by two, or membership, in the list of odd numbers. |
| 4:24.1 | Next, a tennis club decides whether to play with this decision tree. |
| 4:29.4 | Each path to play becomes one condition joined with and, and the three paths are joined with or. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:38.2 | To recap. |
| 4:40.1 | Arithmetic uses plus, minus, times, divide, floor divide, modulus and power. Use parentheses to make the order explicit. |
| 4:47.8 | x plus-equals one is shorthand for x equals x plus one. |
| 4:52.7 | Comparisons return True or False and can be chained. Combine them with and, or, and not. |
| 4:59.6 | Double equals compares values, is compares identity, and in tests membership. Next up: Module 5, built-in types. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (none), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
