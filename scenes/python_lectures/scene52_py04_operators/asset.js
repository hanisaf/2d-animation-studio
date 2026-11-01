// Scene 52: Python lecture, Module 4 · Operators (lectures/04_operators.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene52_py04_operators).
asset({
  title: 'Python 04 · Operators',
  logline: 'Module 4 of the Python course, at a black chalkboard: arithmetic and its order, augmented assignment, comparisons and Boolean logic, identity and membership, and what + and * mean for strings and lists.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/04_operators.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 4: operators." },
    { panel: 1, text: "Today you'll calculate with arithmetic operators and control their order, and update variables with augmented assignment." },
    { panel: 1, text: "You'll compare values, combine conditions with and, or and not, test identity and membership, and predict how operators behave on strings and lists." },

    { panel: 2, text: "Python has seven arithmetic operators: addition, subtraction, multiplication, true division, floor division, the modulus or remainder, and exponentiation." },
    { panel: 2, text: "Seven divided by two is three point five. Floor division drops the fraction and gives three, and the remainder is one." },
    { panel: 2, text: "Python follows the usual order of operations: exponents first, then multiplication and division, then addition and subtraction." },
    { panel: 2, text: "So two plus four times five is twenty-two. Use parentheses whenever the order isn't obvious: two plus four, times five, is thirty." },

    { panel: 3, text: "Floor division and modulus are a natural pair. A call lasted one hundred thirty-five minutes. How many full hours, and how many minutes left over?" },
    { panel: 3, text: "Floor division by sixty gives two hours, and the remainder gives fifteen minutes." },
    { panel: 3, text: "Exponentiation appears in many financial formulas. A thousand dollars invested for ten years at five percent grows to one thousand times one point oh five to the tenth power..." },
    { panel: 3, text: "...about sixteen hundred and twenty-nine dollars." },

    { panel: 4, text: "Updating a variable with its own value is so common that Python has a shorthand for every arithmetic operator." },
    { panel: 4, text: "a plus-equals b means a equals a plus b, and the same works for minus, times and the rest." },
    { panel: 4, text: "A balance starts at one hundred. Deposit twenty-five, withdraw forty, and add two percent interest. The balance is eighty-six seventy." },

    { panel: 5, text: "Comparison operators return a Boolean value: True or False." },
    { panel: 5, text: "Double equals tests equality, exclamation-equals tests inequality, and there are less than, greater than, and their or-equal versions." },
    { panel: 5, text: "Don't confuse a single equals, which assigns, with a double equals, which compares." },
    { panel: 5, text: "With an inventory of twenty-five, inventory equals twenty-five is True, and inventory less than ten is False. Inventory modulo two equals one is True, so twenty-five is odd." },
    { panel: 5, text: "And comparisons can be chained, just as in mathematics: fifteen is less than inventory, which is less than thirty." },

    { panel: 6, text: "Combine conditions with and, or, and not." },
    { panel: 6, text: "And is True only when both sides are True. Or is True when at least one side is. Not flips a value." },
    { panel: 6, text: "A lender approves a loan when the credit score is at least six eighty and the income is at least forty thousand. Both hold, so the answer is True." },

    { panel: 7, text: "The identity operator, is, checks whether two names refer to the same object. In, checks membership." },
    { panel: 7, text: "Two lists can have equal contents and still be different objects: a double-equals b is True, but a is b is False." },
    { panel: 7, text: "In practice, use double equals to compare values, and reserve is for checking against the special value None." },
    { panel: 7, text: "Membership works with lists and with strings: two is in the list one two three, and there is in hello there." },

    { panel: 8, text: "Some operators work on other types, with a meaning adapted to the type." },
    { panel: 8, text: "Plus joins two strings or two lists, and times repeats them." },
    { panel: 8, text: "But you can't add a number to a list or to a string. Wrap the number in a list, or convert it with str." },
    { panel: 8, text: "Strings are compared character by character, by character code: alphabetical for letters of the same case, but every uppercase letter comes before every lowercase one." },

    { panel: 9, text: "Workout. The code picks a random number from one to ten. Write a Boolean expression that is True when it's odd." },
    { panel: 9, text: "Two approaches: arithmetic, with the remainder after dividing by two, or membership, in the list of odd numbers." },
    { panel: 9, text: "Next, a tennis club decides whether to play with this decision tree." },
    { panel: 9, text: "Each path to play becomes one condition joined with and, and the three paths are joined with or." },

    { panel: 10, text: "To recap." },
    { panel: 10, text: "Arithmetic uses plus, minus, times, divide, floor divide, modulus and power. Use parentheses to make the order explicit." },
    { panel: 10, text: "x plus-equals one is shorthand for x equals x plus one." },
    { panel: 10, text: "Comparisons return True or False and can be chained. Combine them with and, or, and not." },
    { panel: 10, text: "Double equals compares values, is compares identity, and in tests membership. Next up: Module 5, built-in types." },
  ],
});
