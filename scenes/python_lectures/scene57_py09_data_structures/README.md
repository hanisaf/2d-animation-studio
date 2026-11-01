# Scene 57: Python 09 · Built-In Data Structures

> Module 9 of the Python course, at a black chalkboard: lists, tuples, dictionaries and sets, how to choose between them, and counting word frequencies in a day of news headlines.

| | |
|---|---|
| **Length** | about 5 minutes (the voice ends at 4:53.2; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/09_data_structures.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/09_data_structures.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

The four collection types and their brackets. Lists (adding, removing, sorting, indexing and slicing), tuples and unpacking, dictionaries (lookups, get, items, nested values), the counting pattern with a bar chart, and sets with a Venn diagram of laptop and mouse buyers. The workout cleans a day of headlines, counts words, removes stop words to reveal the trending topics, and repeats it with collections.Counter.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Built-In Data Structures | title card, four goals |
| 02 | Four collection types | list, tuple, dict, set with examples and brackets |
| 03 | Lists | append/extend/insert/pop/remove; sorted vs sort; indexing diagram; assigning through slices |
| 04 | Tuples | a fixed group; immutability; unpacking and swapping |
| 05 | Dictionaries | keys → values; add and update; KeyError vs get; items(); nested values |
| 06 | Counting with a dictionary | counts[grade] = counts.get(grade, 0) + 1, with a bar chart |
| 07 | Sets | removing duplicates; & | - ^ on a Venn diagram; choosing a structure |
| 08 | Workout: trending words | cleaning, splitting, counting and ranking headline words |
| 09 | Workout: without the stop words | a stop-word set; the trending topics; Counter.most_common |
| 10 | Summary | five takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene57_py09_data_structures`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene57_py09_data_structures`.

<!-- narration:start -->
**35 lines · 653 words · voice ends at 4:53.2** (pace: 2.5 words per second).


### Panel 01 · Built-In Data Structures

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 9: built-in data structures. |
| 0:07.8 | Real data come in collections: the prices of all products, the grades of all students, the sales of every region. |
| 0:16.3 | Today: lists and tuples for ordered data, dictionaries to map keys to values, sets for unique values, and counting frequencies, one of the most common operations in analytics. |

### Panel 02 · Four collection types

| Cue | Narration |
|---|---|
| 0:29.1 | Python has four built-in compound types. |
| 0:32.0 | A list is an ordered, changeable collection, in square brackets. A tuple is ordered but unchangeable, in parentheses. |
| 0:39.7 | Curly braces make a dictionary when they hold key-value pairs, and a set otherwise. Note that empty curly braces are an empty dictionary; an empty set is written set(). |

### Panel 03 · Lists

| Cue | Narration |
|---|---|
| 0:52.9 | Lists are mutable: you can add, remove and change items after the list is created. |
| 0:59.4 | append adds one item at the end, extend adds several, and insert puts an item at a position. pop removes and returns the last item, and remove deletes the first matching item. |
| 1:12.7 | sorted returns a new sorted list and leaves the original alone, while the sort method sorts the list in place. |
| 1:21.2 | Indexing and slicing work exactly as with strings. But unlike strings, lists can be modified through them. |

### Panel 04 · Tuples

| Cue | Narration |
|---|---|
| 1:29.6 | A tuple is like a list that can't be changed. Use one for a fixed group of values that belong together, like the latitude and longitude of Athens. |
| 1:41.3 | Assigning to an item raises a TypeError. |
| 1:44.6 | You've already used tuples: a function that returns two values returns a tuple, and x comma y equals unpacks it. Unpacking even swaps two variables in one line. |

### Panel 05 · Dictionaries

| Cue | Narration |
|---|---|
| 1:57.4 | A dictionary maps keys to values. Instead of looking items up by position, you look them up by key, like a word in a dictionary. |
| 2:07.9 | Assigning to a key adds a new entry, or updates an existing one. |
| 2:13.6 | Looking up a missing key raises a KeyError. The get method returns a default value instead. |
| 2:20.5 | keys, values and items give access to the contents, and looping over items visits every entry. Values can even be lists or other dictionaries. |

### Panel 06 · Counting with a dictionary

| Cue | Narration |
|---|---|
| 2:31.7 | Counting with a dictionary is one of the most useful patterns in analytics. |
| 2:37.4 | Loop over the data, and increase the count of each value you see. get with a default of zero handles values seen for the first time. |
| 2:48.3 | Three A's, two B-pluses, two C's, and so on. |

### Panel 07 · Sets

| Cue | Narration |
|---|---|
| 2:53.5 | A set is an unordered collection of unique values. Converting a list to a set removes the duplicates. |
| 3:01.2 | Sets support set algebra. Which customers bought both a laptop and a mouse? That's the intersection. Either one is the union. |
| 3:10.1 | The difference gives laptop but no mouse, and the symmetric difference gives exactly one of the two. |
| 3:17.4 | Choosing a structure: a list to keep items in order and change them, a tuple for a fixed group, a dictionary to look up by name, and a set for unique values. |

### Panel 08 · Workout: trending words

| Cue | Narration |
|---|---|
| 3:31.8 | Workout. News analytics tools scan headlines to find trending topics. Let's build a small one for a day in September 2019. |
| 3:40.7 | First, clean: convert to lower case, so The and the count as one word, and remove punctuation. Then split into words: two hundred fourteen words, a hundred forty-five unique. |
| 3:52.8 | Count each word with a dictionary, and sort the items by their count. |
| 3:58.5 | The top words are small function words, like to, and, the. They carry little information. |

### Panel 09 · Workout: without the stop words

| Cue | Narration |
|---|---|
| 4:06.1 | So text analysts remove them, using a set of stop words. A set makes each membership check fast. |
| 4:13.8 | Without stop words, the trending topics emerge: Hurricane Dorian, California, Brexit, and guns. |
| 4:19.5 | Python's standard library even has a ready-made counter, collections dot Counter, which gives the same ranking in two lines. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:28.7 | To recap. |
| 4:30.6 | Lists are ordered and mutable. Tuples are ordered and immutable, and you can unpack them. |
| 4:37.1 | Dictionaries look values up by key: loop with items, and count with get. |
| 4:42.8 | Sets hold unique values and support set algebra. And indexing and slicing work the same way on lists, tuples, and strings. Next up: Module 10, comprehensions. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the trending-word ranking on panel 9), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
