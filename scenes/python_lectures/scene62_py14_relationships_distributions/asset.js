// Scene 62: Python lecture, Module 14 · Visualizing Statistical Relationships and Distributions
// (lectures/14_relationships_and_distributions.ipynb). A black-board lecture built with scene 49's kit (lecture_kit.js).
// The narration is a voice-over you record yourself: README.md lists every line with its cue time
// (node scripts/lecture_script.mjs scene62_py14_relationships_distributions).
asset({
  title: 'Python 14 · Relationships and Distributions',
  logline: 'Module 14 of the Python course, at a black chalkboard: scatter and line plots with seaborn, hue, style, size and facets, histograms, KDEs and ECDFs, joint and pair plots, and what the insurance data look like.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/14_relationships_and_distributions.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 14: visualizing statistical relationships and distributions." },
    { panel: 1, text: "A good chart reveals patterns that a table of numbers hides. Today you'll draw scatter and line plots, and encode more variables with color, style, size and small multiples." },
    { panel: 1, text: "You'll visualize distributions with histograms, density curves and ECDFs, explore many variables at once, and label figures so they stand on their own." },

    { panel: 2, text: "seaborn is a plotting library built on matplotlib that works directly with pandas DataFrames. You name the columns to put on each axis, and seaborn handles the rest." },
    { panel: 2, text: "set theme applies a clean style to every figure. And seaborn ships with example datasets, like tips: two hundred forty-four restaurant bills, with the tip, the party size, and details of the visit." },

    { panel: 3, text: "relplot, the relational plot, draws a scatter plot by default: one point per row. Larger bills come with larger tips." },
    { panel: 3, text: "A third variable can be mapped to color with hue, and to the marker shape with style. Using both for the same variable keeps the plot readable in black and white, and for color-blind readers." },
    { panel: 3, text: "A numeric variable can be mapped to the size of the points. But less is more: two or three variables per plot is usually the limit." },

    { panel: 4, text: "When the x variable is time, a line plot emphasizes continuity. The flights data count monthly airline passengers from 1949 to 1960." },
    { panel: 4, text: "Each year has twelve observations, so seaborn aggregates them: the line shows the mean, and the band a ninety-five percent confidence interval." },
    { panel: 4, text: "Mapping month to hue draws one line per month instead, and reveals the seasonal pattern: passengers grew every year, and summer was always busiest." },

    { panel: 5, text: "To show how a relationship depends on a category, draw one panel per category with col and row. These small multiples share their axes, which makes comparison easy." },
    { panel: 5, text: "col wrap wraps many panels into rows, and height and aspect set the size of each panel." },
    { panel: 5, text: "A figure in a report must stand on its own. The grid object that relplot returns sets clear axis labels, units included, and a title." },

    { panel: 6, text: "Before modeling a variable, look at its distribution: its range, center, shape, and outliers. displot draws a histogram by default." },
    { panel: 6, text: "Penguin flipper lengths have two peaks. The distribution is bimodal, a hint that the data mix different groups." },
    { panel: 6, text: "The bin size can change the story, so check a few choices with binwidth or bins." },
    { panel: 6, text: "Mapping species to hue draws one histogram per group, and the two peaks turn out to come from the species. Stacking, outlines, and density scaling help compare groups." },

    { panel: 7, text: "A kernel density estimate replaces the bars with a smooth curve. It's often easier to compare several groups with KDEs." },
    { panel: 7, text: "bw adjust controls the smoothness. But beware: a KDE is always smooth, and it can spill into impossible values, like negative restaurant bills. cut equals zero stops it at the data." },
    { panel: 7, text: "An ECDF plots, for each value, the share of observations at or below it. No bins or bandwidth to choose, and the median is where the curve crosses one half." },

    { panel: 8, text: "To explore many variables at once, jointplot combines a scatter plot with the distribution of each variable in the margins." },
    { panel: 8, text: "And pairplot draws every pairwise scatter plot, with each distribution on the diagonal. It's a quick first look at a new dataset." },
    { panel: 8, text: "To choose: scatter for two numeric variables, line for change over time, displot for a distribution, hue or facets for groups, and pairplot for a first look." },

    { panel: 9, text: "Warmup, with Gapminder. GDP per capita against life expectancy crowds most countries on the left, because GDP is highly skewed." },
    { panel: 9, text: "A logarithmic scale spreads them out, and reveals a roughly linear relationship." },
    { panel: 9, text: "For 2007, map population to the size of the points: that's the famous Gapminder bubble chart. And over time, life expectancy rose on every continent, though Africa's progress stalled in the 1990s." },

    { panel: 10, text: "Workout. Back to the insurance data from Module 13. A pair plot colored by smoking status shows smokers charged more at every age, in distinct bands." },
    { panel: 10, text: "Focus on BMI and charges. For non-smokers, BMI barely matters. For smokers, charges jump sharply around a BMI of thirty, the clinical threshold for obesity." },
    { panel: 10, text: "The pattern is the same for women and men, which agrees with the regression. But the chart shows something the linear model missed: the effect of BMI depends on smoking. That's an interaction." },

    { panel: 11, text: "To recap." },
    { panel: 11, text: "relplot draws scatter and line plots, with hue, style, size, col and row." },
    { panel: 11, text: "displot draws histograms, KDEs and ECDFs. jointplot and pairplot show many variables at once." },
    { panel: 11, text: "And label your figures so they stand on their own. Next up, the final module: categorical data and regression plots." },
  ],
});
