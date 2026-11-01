# Scene 54: Python 06 · Strings

> Module 6 of the Python course, at a black chalkboard: creating strings, indexing and slicing, cleaning, searching and replacing text, splitting and joining, and loading a text file from the web.

| | |
|---|---|
| **Length** | about 4½ minutes (the voice ends at 4:29.1; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/06_strings.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/06_strings.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

Quotes, triple quotes and escape sequences; "Analytics" laid out with positive and negative indexes for slicing; immutability. Case methods and strip(), searching with find/index/count/startswith/in, replace(), split() and join(), isdigit()/isalpha() and f-string alignment. A poem loads from GitHub and gets counted. The workout extracts an email address two ways and the wisdom from an ASCII-art cow.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Strings | title card, four goals |
| 02 | Creating strings | single vs double quotes; triple quotes; \n \t \" \\ |
| 03 | Indexing and slicing | "Analytics" with its indexes; slices; reversed; item assignment fails |
| 04 | Changing case and cleaning | upper/lower/title/capitalize/swapcase; strip, lstrip("0") |
| 05 | Searching and replacing | find, index, count, startswith, endswith, in, replace |
| 06 | Splitting and joining | split(), split("-"), splitlines(); "--".join(…) |
| 07 | Inspecting and aligning text | isdigit/isalpha; f-string < > ^ alignment |
| 08 | Loading text from the web | urlopen → read → decode; characters, lines and words of a poem |
| 09 | Workout: extracting text | an email two ways; the cow's wisdom with a raw string |
| 10 | Summary | the task → tool table |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene54_py06_strings`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene54_py06_strings`.

<!-- narration:start -->
**34 lines · 594 words · voice ends at 4:29.1** (pace: 2.5 words per second).


### Panel 01 · Strings

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 6: strings. |
| 0:07.0 | Much of the world's business data is text: customer reviews, emails, product descriptions, server logs. |
| 0:13.5 | Today you'll create strings, slice them, clean, search and transform text, split it and join it, and load a text file from the web. |

### Panel 02 · Creating strings

| Cue | Narration |
|---|---|
| 0:24.7 | Single and double quotes are equivalent. Pick the one that avoids a clash with the quotes inside the text. |
| 0:32.8 | Triple quotes create a multi-line string, like a mailing address. |
| 0:37.3 | And a backslash starts an escape sequence for a special character: backslash n for a new line, backslash t for a tab. |

### Panel 03 · Indexing and slicing

| Cue | Narration |
|---|---|
| 0:47.7 | A string is a sequence of characters, numbered from zero. Negative indexes count from the end. |
| 0:54.6 | A slice, start colon stop, extracts the characters from start up to, but not including, stop. Either end can be left out. |
| 1:03.9 | A step of minus one reverses the string. |
| 1:07.6 | Strings are immutable: you can't change a character in place. Every string method returns a new string. |

### Panel 04 · Changing case and cleaning

| Cue | Narration |
|---|---|
| 1:16.0 | String methods change the case: upper, lower, title, capitalize, and swapcase. |
| 1:20.9 | Converting to a common case is the standard way to compare text regardless of capitalization. |
| 1:27.4 | strip removes whitespace from both ends. lstrip and rstrip work on one end. Given an argument, they remove those characters instead, like leading zeros from an account number. |

### Panel 05 · Searching and replacing

| Cue | Narration |
|---|---|
| 1:40.2 | To search, find returns the index of the first match, or minus one if there's none. |
| 1:47.1 | index does the same, but raises an error when the text is missing. count counts the matches. |
| 1:54.4 | startswith and endswith test the ends, and the in operator tests membership. |
| 1:59.7 | And replace swaps one piece of text for another: the quick brown fox becomes a red fox. |

### Panel 06 · Splitting and joining

| Cue | Narration |
|---|---|
| 2:08.1 | split breaks a string into a list of pieces. With no argument, it splits on any whitespace. |
| 2:15.4 | With an argument, it splits on that separator, like the dashes in a date. And splitlines splits at line breaks. |
| 2:23.9 | join is the inverse of split: it glues a list of strings together. Note the unusual syntax: the method is called on the separator. |

### Panel 07 · Inspecting and aligning text

| Cue | Narration |
|---|---|
| 2:35.1 | Methods that start with is test what kind of characters a string contains: isdigit for digits only, isalpha for letters only. |
| 2:44.0 | And f-strings can align text: a less-than sign aligns left, greater-than aligns right, and a caret centers, followed by a width. That's how to print a tidy report. |

### Panel 08 · Loading text from the web

| Cue | Narration |
|---|---|
| 2:56.8 | Our course datasets live on GitHub. Python's built-in urllib module can download a file. |
| 3:02.9 | read returns raw bytes, and decode turns them into a string. The with statement closes the connection automatically. |
| 3:10.6 | With the poem in a variable, the tools we've seen apply directly: seven hundred fifty-one characters, twenty-three lines, a hundred and forty-four words. |

### Panel 09 · Workout: extracting text

| Cue | Narration |
|---|---|
| 3:21.4 | Workout. Extract the email address from a message. |
| 3:25.1 | One solution searches for the boundaries: find the at sign, then the nearest space on each side of it, and slice. |
| 3:34.0 | Another splits around the at sign: the user name is the last word before it, and the domain is the first word after it. |
| 3:44.1 | Then a cow's speech bubble, drawn with backslashes. The r before the quotes makes a raw string, so backslashes stay ordinary characters. |
| 3:53.4 | The wisdom sits between the first and the last double quote. Split and join then collapse the extra whitespace into single spaces. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:03.8 | To recap. |
| 4:05.7 | Access characters with an index or a slice. Change case with upper, lower and title, and clean with strip and replace. |
| 4:14.6 | Search with find, count, startswith, and in. Split text into pieces, and join them back with a separator. |
| 4:22.3 | And load text from the web with urlopen, read, and decode. Next up: Module 7, control flow. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the ASCII-art cow on panel 9), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
