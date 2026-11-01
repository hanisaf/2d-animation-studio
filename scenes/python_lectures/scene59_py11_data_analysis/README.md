# Scene 59: Python 11 · Data Analysis in Pure Python

> Module 11 of the Python course, at a black chalkboard: reading CSV and JSON into lists of dictionaries, cleaning money values, answering eight questions about Internet companies, and presenting a formatted report.

| | |
|---|---|
| **Length** | about 5 minutes (the voice ends at 4:49.7; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/11_data_analysis.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/11_data_analysis.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

A table becomes a list of dictionaries. CSV files load with csv.DictReader, JSON lines with json.loads, and a dictionary lookup joins courses to instructors. The Internet companies case lists eight questions; small functions clean the money fields; averages that skip None, ratios, counts and totals per country answer them; and an aligned report with a share bar communicates the result.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Data Analysis in Pure Python | title card, four goals |
| 02 | Records as dictionaries | a table → a list of dicts; a record, a field, a column |
| 03 | Reading CSV files | the raw file; urlopen + csv.DictReader; why not split(",") |
| 04 | Reading JSON and joining | json.loads per line; instructor_by_id; the joined course list |
| 05 | The case: Internet companies (2015) | the raw table, private companies, and eight questions |
| 06 | Extract, transform, load | to_dollars() and clean_record() |
| 07 | Analytics: averages and ratios | average() skipping None; questions 1–5 with their answers |
| 08 | Analytics: counting and grouping | companies and market cap per country; eBay |
| 09 | Communicating the results | a formatted report and a share bar: USA 76% |
| 10 | Summary | five takeaways |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene59_py11_data_analysis`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene59_py11_data_analysis`.

<!-- narration:start -->
**32 lines · 648 words · voice ends at 4:49.7** (pace: 2.5 words per second).


### Panel 01 · Data Analysis in Pure Python

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 11: putting it together, with a data analysis in pure Python. |
| 0:10.6 | We'll read CSV and JSON data into lists of dictionaries, clean the raw values with functions, answer questions with loops, comprehensions and dictionaries, and present the results in a report. |
| 0:23.1 | We'll use only the tools from Modules 3 to 10. Doing an analysis by hand once shows exactly what libraries like pandas automate for us. |

### Panel 02 · Records as dictionaries

| Cue | Narration |
|---|---|
| 0:34.7 | Tabular data, like a spreadsheet or a database table, is a collection of records that share the same fields. |
| 0:42.8 | In pure Python, a natural representation is a list of dictionaries: one dictionary per record, mapping field names to values. |
| 0:51.3 | data zero is the first record, data zero country is one of its fields, and a comprehension over the records gives a whole column. |

### Panel 03 · Reading CSV files

| Cue | Narration |
|---|---|
| 1:02.5 | A CSV file, for comma-separated values, stores one record per line, with a header line that names the fields. |
| 1:10.6 | We download the file with urlopen, and csv dot DictReader turns each line into a dictionary. Twenty records. |
| 1:18.3 | Why not just split each line on commas? Because real CSV files can have commas inside quoted fields, like Athens comma Georgia. The csv module handles that correctly. |

### Panel 04 · Reading JSON and joining

| Cue | Narration |
|---|---|
| 1:31.1 | JSON is the most common format for data exchanged between web applications. JSON objects look just like Python dictionaries. |
| 1:39.2 | These files store one JSON object per line, and json dot loads converts each line. Values keep their types, and JSON's null becomes None. |
| 1:49.3 | Each course stores the id of its current instructor. A dictionary that looks instructors up by id lets us combine the two files. That's a join, the same operation that connects database tables. |

### Panel 05 · The case: Internet companies (2015)

| Cue | Narration |
|---|---|
| 2:04.1 | Now our case: large technology and Internet companies in 2015. Market capitalization, cash and revenue are in billions of dollars. |
| 2:12.6 | Private companies don't publish cash or revenue, so those values are missing, and shown as a dollar sign and a dash. |
| 2:21.5 | We'll clean the data, then answer eight questions: averages, ratios, missing values, counts and totals per country. |

### Panel 06 · Extract, transform, load

| Cue | Narration |
|---|---|
| 2:29.9 | The raw values are strings with a dollar sign and extra spaces. |
| 2:35.2 | A function to dollars strips the spaces and the dollar sign, returns None for a dash, and multiplies by one billion. Underscores in the number literal just make it readable. |
| 2:47.7 | A second function cleans a whole record, and a comprehension applies it to every record. Small functions are easy to test, one value at a time. |

### Panel 07 · Analytics: averages and ratios

| Cue | Narration |
|---|---|
| 2:59.7 | Missing values need care: we can't add None to a number. So an average helper keeps only the values that are present. |
| 3:09.0 | The average market cap is about a hundred thirty-eight billion dollars, and the average cash about thirty billion. |
| 3:16.7 | The cash to revenue ratio exists only for companies that report both. It averages zero point nine one, and three companies sit below one half: Amazon, JD dot com and Netflix. |
| 3:29.6 | And five companies don't report cash. |

### Panel 08 · Analytics: counting and grouping

| Cue | Narration |
|---|---|
| 3:33.6 | Companies per country is the counting pattern from Module 9: twelve in the USA, seven in China, and one in Japan. |
| 3:42.5 | The company whose name starts with a lower-case letter? eBay. |
| 3:47.0 | And a dictionary comprehension totals the market capitalization for each country. |

### Panel 09 · Communicating the results

| Cue | Narration |
|---|---|
| 3:53.0 | Numbers like two trillion one hundred and one billion, written out in full, are hard to read. |
| 4:00.3 | A short formatted report, with aligned columns, billions, and each country's share, is much easier to share. |
| 4:07.6 | US companies account for seventy-six percent of the value, a pattern that a chart would make even clearer. Charts come in Modules 14 and 15. |

### Panel 10 · Summary

| Cue | Narration |
|---|---|
| 4:19.2 | To recap. |
| 4:21.1 | A list of dictionaries is a simple, flexible representation of tabular data. DictReader and json dot loads build it, and urlopen reads from the web. |
| 4:31.6 | Clean data with small, testable functions, and handle missing values explicitly. |
| 4:36.5 | Counting and grouping are dictionary patterns; filtering and transforming are comprehension patterns. Doing all this by hand takes effort. Starting with Module 12, pandas will do most of it in a single line. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the cleaning functions on panel 6), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
