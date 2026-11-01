// Scene 54: Python lecture, Module 6 · Strings (lectures/06_strings.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene54_py06_strings).
asset({
  title: 'Python 06 · Strings',
  logline: 'Module 6 of the Python course, at a black chalkboard: creating strings, indexing and slicing, cleaning, searching and replacing text, splitting and joining, and loading a text file from the web.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/06_strings.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 6: strings." },
    { panel: 1, text: "Much of the world's business data is text: customer reviews, emails, product descriptions, server logs." },
    { panel: 1, text: "Today you'll create strings, slice them, clean, search and transform text, split it and join it, and load a text file from the web." },

    { panel: 2, text: "Single and double quotes are equivalent. Pick the one that avoids a clash with the quotes inside the text." },
    { panel: 2, text: "Triple quotes create a multi-line string, like a mailing address." },
    { panel: 2, text: "And a backslash starts an escape sequence for a special character: backslash n for a new line, backslash t for a tab." },

    { panel: 3, text: "A string is a sequence of characters, numbered from zero. Negative indexes count from the end." },
    { panel: 3, text: "A slice, start colon stop, extracts the characters from start up to, but not including, stop. Either end can be left out." },
    { panel: 3, text: "A step of minus one reverses the string." },
    { panel: 3, text: "Strings are immutable: you can't change a character in place. Every string method returns a new string." },

    { panel: 4, text: "String methods change the case: upper, lower, title, capitalize, and swapcase." },
    { panel: 4, text: "Converting to a common case is the standard way to compare text regardless of capitalization." },
    { panel: 4, text: "strip removes whitespace from both ends. lstrip and rstrip work on one end. Given an argument, they remove those characters instead, like leading zeros from an account number." },

    { panel: 5, text: "To search, find returns the index of the first match, or minus one if there's none." },
    { panel: 5, text: "index does the same, but raises an error when the text is missing. count counts the matches." },
    { panel: 5, text: "startswith and endswith test the ends, and the in operator tests membership." },
    { panel: 5, text: "And replace swaps one piece of text for another: the quick brown fox becomes a red fox." },

    { panel: 6, text: "split breaks a string into a list of pieces. With no argument, it splits on any whitespace." },
    { panel: 6, text: "With an argument, it splits on that separator, like the dashes in a date. And splitlines splits at line breaks." },
    { panel: 6, text: "join is the inverse of split: it glues a list of strings together. Note the unusual syntax: the method is called on the separator." },

    { panel: 7, text: "Methods that start with is test what kind of characters a string contains: isdigit for digits only, isalpha for letters only." },
    { panel: 7, text: "And f-strings can align text: a less-than sign aligns left, greater-than aligns right, and a caret centers, followed by a width. That's how to print a tidy report." },

    { panel: 8, text: "Our course datasets live on GitHub. Python's built-in urllib module can download a file." },
    { panel: 8, text: "read returns raw bytes, and decode turns them into a string. The with statement closes the connection automatically." },
    { panel: 8, text: "With the poem in a variable, the tools we've seen apply directly: seven hundred fifty-one characters, twenty-three lines, a hundred and forty-four words." },

    { panel: 9, text: "Workout. Extract the email address from a message." },
    { panel: 9, text: "One solution searches for the boundaries: find the at sign, then the nearest space on each side of it, and slice." },
    { panel: 9, text: "Another splits around the at sign: the user name is the last word before it, and the domain is the first word after it." },
    { panel: 9, text: "Then a cow's speech bubble, drawn with backslashes. The r before the quotes makes a raw string, so backslashes stay ordinary characters." },
    { panel: 9, text: "The wisdom sits between the first and the last double quote. Split and join then collapse the extra whitespace into single spaces." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "Access characters with an index or a slice. Change case with upper, lower and title, and clean with strip and replace." },
    { panel: 10, text: "Search with find, count, startswith, and in. Split text into pieces, and join them back with a separator." },
    { panel: 10, text: "And load text from the web with urlopen, read, and decode. Next up: Module 7, control flow." },
  ],
});
