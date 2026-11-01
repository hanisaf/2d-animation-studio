// Scene 59: Python lecture, Module 11 · Putting It Together: A Data Analysis in Pure Python (lectures/11_data_analysis.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene59_py11_data_analysis).
asset({
  title: 'Python 11 · Data Analysis in Pure Python',
  logline: 'Module 11 of the Python course, at a black chalkboard: reading CSV and JSON into lists of dictionaries, cleaning money values, answering eight questions about Internet companies, and presenting a formatted report.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/11_data_analysis.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 11: putting it together, with a data analysis in pure Python." },
    { panel: 1, text: "We'll read CSV and JSON data into lists of dictionaries, clean the raw values with functions, answer questions with loops, comprehensions and dictionaries, and present the results in a report." },
    { panel: 1, text: "We'll use only the tools from Modules 3 to 10. Doing an analysis by hand once shows exactly what libraries like pandas automate for us." },

    { panel: 2, text: "Tabular data, like a spreadsheet or a database table, is a collection of records that share the same fields." },
    { panel: 2, text: "In pure Python, a natural representation is a list of dictionaries: one dictionary per record, mapping field names to values." },
    { panel: 2, text: "data zero is the first record, data zero country is one of its fields, and a comprehension over the records gives a whole column." },

    { panel: 3, text: "A CSV file, for comma-separated values, stores one record per line, with a header line that names the fields." },
    { panel: 3, text: "We download the file with urlopen, and csv dot DictReader turns each line into a dictionary. Twenty records." },
    { panel: 3, text: "Why not just split each line on commas? Because real CSV files can have commas inside quoted fields, like Athens comma Georgia. The csv module handles that correctly." },

    { panel: 4, text: "JSON is the most common format for data exchanged between web applications. JSON objects look just like Python dictionaries." },
    { panel: 4, text: "These files store one JSON object per line, and json dot loads converts each line. Values keep their types, and JSON's null becomes None." },
    { panel: 4, text: "Each course stores the id of its current instructor. A dictionary that looks instructors up by id lets us combine the two files. That's a join, the same operation that connects database tables." },

    { panel: 5, text: "Now our case: large technology and Internet companies in 2015. Market capitalization, cash and revenue are in billions of dollars." },
    { panel: 5, text: "Private companies don't publish cash or revenue, so those values are missing, and shown as a dollar sign and a dash." },
    { panel: 5, text: "We'll clean the data, then answer eight questions: averages, ratios, missing values, counts and totals per country." },

    { panel: 6, text: "The raw values are strings with a dollar sign and extra spaces." },
    { panel: 6, text: "A function to dollars strips the spaces and the dollar sign, returns None for a dash, and multiplies by one billion. Underscores in the number literal just make it readable." },
    { panel: 6, text: "A second function cleans a whole record, and a comprehension applies it to every record. Small functions are easy to test, one value at a time." },

    { panel: 7, text: "Missing values need care: we can't add None to a number. So an average helper keeps only the values that are present." },
    { panel: 7, text: "The average market cap is about a hundred thirty-eight billion dollars, and the average cash about thirty billion." },
    { panel: 7, text: "The cash to revenue ratio exists only for companies that report both. It averages zero point nine one, and three companies sit below one half: Amazon, JD dot com and Netflix." },
    { panel: 7, text: "And five companies don't report cash." },

    { panel: 8, text: "Companies per country is the counting pattern from Module 9: twelve in the USA, seven in China, and one in Japan." },
    { panel: 8, text: "The company whose name starts with a lower-case letter? eBay." },
    { panel: 8, text: "And a dictionary comprehension totals the market capitalization for each country." },

    { panel: 9, text: "Numbers like two trillion one hundred and one billion, written out in full, are hard to read." },
    { panel: 9, text: "A short formatted report, with aligned columns, billions, and each country's share, is much easier to share." },
    { panel: 9, text: "US companies account for seventy-six percent of the value, a pattern that a chart would make even clearer. Charts come in Modules 14 and 15." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "A list of dictionaries is a simple, flexible representation of tabular data. DictReader and json dot loads build it, and urlopen reads from the web." },
    { panel: 10, text: "Clean data with small, testable functions, and handle missing values explicitly." },
    { panel: 10, text: "Counting and grouping are dictionary patterns; filtering and transforming are comprehension patterns. Doing all this by hand takes effort. Starting with Module 12, pandas will do most of it in a single line." },
  ],
});
