// Scene 55: Python lecture, Module 7 · Control Flow (lectures/07_control_flow.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene55_py07_control_flow).
asset({
  title: 'Python 07 · Control Flow',
  logline: 'Module 7 of the Python course, at a black chalkboard: if, elif and else; for and while loops; break, continue and a loop\'s else; the accumulator pattern; and handling errors with try and except.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/07_control_flow.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 7: control flow." },
    { panel: 1, text: "So far our code has run from top to bottom, one line after another. Control flow statements let a program choose between alternatives, and repeat steps." },
    { panel: 1, text: "Today: if, elif and else; for and while loops; break and continue; the accumulator pattern; and handling errors with try and except." },

    { panel: 2, text: "An online store charges shipping based on the order total." },
    { panel: 2, text: "Free at a hundred dollars or more, four ninety-nine at fifty or more, and nine ninety-nine otherwise." },
    { panel: 2, text: "Python checks the conditions from top to bottom, and runs the block under the first one that's True. The rest are skipped. An order of seventy-two fifty pays four ninety-nine." },
    { panel: 2, text: "elif, short for else if, can appear any number of times, and both elif and else are optional." },

    { panel: 3, text: "A for loop runs a block once for each item in a sequence, such as a list, or the characters of a string." },
    { panel: 3, text: "range generates a sequence of integers. range of n counts from zero up to, but not including, n." },
    { panel: 3, text: "range with a start, a stop, and a step gives more control: zero to twenty in steps of five." },

    { panel: 4, text: "Many analyses loop over data while updating a running total or count. That's the accumulator pattern." },
    { panel: 4, text: "Initialize the accumulators before the loop, and update them inside it." },
    { panel: 4, text: "For a week of sales, the total is nine thousand eight hundred and ninety, and three days were above fifteen hundred." },
    { panel: 4, text: "Notice the two levels of indentation: the if is inside the loop, and the count is inside the if." },

    { panel: 5, text: "A while loop repeats as long as its condition stays True. Use it when you don't know in advance how many repetitions you need." },
    { panel: 5, text: "How many years until a thousand dollars at seven percent doubles? Eleven years." },
    { panel: 5, text: "Beware of infinite loops. If the condition never becomes False, the loop never ends. Stop a runaway cell with the stop button, or Kernel, Interrupt Kernel." },

    { panel: 6, text: "Two statements control a loop. break exits the loop immediately. continue skips to the next iteration." },
    { panel: 6, text: "Here break finds the first day with sales above two thousand, and stops looking. enumerate pairs each item with its position." },
    { panel: 6, text: "A loop can also have an else block, which runs only if the loop finished without a break. It's handy for searches." },

    { panel: 7, text: "Errors are a normal part of programming. Python reports them by raising an exception, whose name tells you what went wrong." },
    { panel: 7, text: "NameError for a variable that was never defined, ZeroDivisionError, TypeError for the wrong type, and ValueError for the right type with an unacceptable value." },
    { panel: 7, text: "When you expect that something may fail, like converting values typed by users, wrap it in try and except. Python jumps to the matching except block instead of stopping." },
    { panel: 7, text: "Always name the exceptions you expect. A bare except would also hide bugs you didn't anticipate." },

    { panel: 8, text: "Warmup. A guessing game. Start at one, and loop until you reach the number." },
    { panel: 8, text: "While True loops forever, unless a break ends it. That's a common pattern when the exit test is in the middle of the loop." },
    { panel: 8, text: "And collecting the email addresses in a message is the list version of the accumulator: start with an empty list, and append." },

    { panel: 9, text: "Workout. Find the numbers hidden in a secret message: words where every character is a digit or a dash." },
    { panel: 9, text: "One solution uses a flag: assume each word is a number, until a character proves otherwise." },
    { panel: 9, text: "Another uses for-else: the else block runs only when the inner loop didn't break." },
    { panel: 9, text: "Then a calendar: a loop inside a loop prints every date. With the right month lengths for a leap year, we get three hundred sixty-six dates." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "if, elif, else runs the block of the first true condition. for repeats a block for each item, and range generates integers." },
    { panel: 10, text: "while repeats until its condition is False. break exits a loop, continue skips ahead, and a loop's else runs when no break occurred." },
    { panel: 10, text: "Accumulators start before the loop and update inside it. And try and except handle the errors you anticipate. Next up: Module 8, functions." },
  ],
});
