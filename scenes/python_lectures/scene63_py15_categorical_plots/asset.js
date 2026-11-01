// Scene 63: Python lecture, Module 15 · Visualizing Categorical Data and Regression Models
// (lectures/15_categorical_and_regression_plots.ipynb). A black-board lecture built with scene 49's kit (lecture_kit.js).
// The narration is a voice-over you record yourself: README.md lists every line with its cue time
// (node scripts/lecture_script.mjs scene63_py15_categorical_plots).
asset({
  title: 'Python 15 · Categorical Data and Regression Plots',
  logline: 'Module 15, the last of the Python course, at a black chalkboard: strip, swarm, box, violin, bar, point and count plots, regression plots and their diagnostics, and an open-ended look at 37,000 marathon runners.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/15_categorical_and_regression_plots.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 15, our final module: visualizing categorical data and regression models." },
    { panel: 1, text: "Many business questions compare categories: sales by region, satisfaction by product line, salaries by department." },
    { panel: 1, text: "Today: plots that compare groups, plots that show estimates, regression plots and their diagnostics, and an open-ended analysis of real data." },

    { panel: 2, text: "seaborn's catplot handles categories with one interface, just as relplot and displot did. The kind parameter picks the plot." },
    { panel: 2, text: "Categorical scatter plots show every observation. Distribution plots show the shape of each group. And estimate plots show one summary number per group." },

    { panel: 3, text: "A strip plot draws every observation, with a little random jitter so points in the same category don't hide each other." },
    { panel: 3, text: "A swarm plot arranges the points so they never overlap. It shows the distribution more faithfully, but works only for small datasets." },
    { panel: 3, text: "When category names are long or many, swap x and y to put them on the vertical axis, and use order to set their order." },

    { panel: 4, text: "With more data, summaries work better. A box plot shows the median, the quartiles, which hold the middle half of the data, and whiskers that reach at most one and a half box heights beyond the box. Points beyond them are potential outliers." },
    { panel: 4, text: "Adding hue places the boxes of each subgroup side by side." },
    { panel: 4, text: "A violin plot replaces the box with a mirrored density curve. With two hue levels, split puts one on each side. And layering a swarm on a light violin combines the summary with the raw data." },

    { panel: 5, text: "Sometimes one number per category is all the reader needs. A bar plot shows each group's mean, with an error bar for its ninety-five percent confidence interval." },
    { panel: 5, text: "For the Titanic, survived is zero or one, so its mean is the survival rate." },
    { panel: 5, text: "A count plot shows the number of observations in each category: a histogram for categories." },
    { panel: 5, text: "A point plot connects the estimates of each hue level with a line, so slopes reveal interactions. Women's survival dropped sharply in third class; men's was low in every class." },

    { panel: 6, text: "lmplot draws a scatter plot, fits the linear regression y on x, and draws the line with a ninety-five percent confidence band. It's the visual counterpart of Module 13's regressions." },
    { panel: 6, text: "When x takes only a few values, x estimator replaces each column of points with its mean and confidence interval." },
    { panel: 6, text: "And hue and col fit a separate line for each group, to show whether the relationship differs between groups." },

    { panel: 7, text: "Anscombe's quartet is four small datasets with nearly identical means, variances, correlations and regression lines, and completely different patterns. Always plot your data." },
    { panel: 7, text: "Dataset two is curved: a polynomial of order two fits it almost perfectly. Dataset three has one outlier, and a robust regression down-weights it." },
    { panel: 7, text: "A residual plot shows the errors of a linear fit. If the model is right, they scatter randomly around zero. For dataset two, they form an arch: an upside-down U that reveals the curve." },
    { panel: 7, text: "For a yes-or-no outcome, logistic equals True draws the estimated probability. Surprisingly, larger bills are less likely to get a generous tip, in percentage terms." },

    { panel: 8, text: "Warmup: more than a thousand exoplanets discovered up to 2014. A count plot shows the discoveries per year." },
    { panel: 8, text: "aspect makes the figure wider, and set xticklabels with step five labels every fifth year." },
    { panel: 8, text: "Broken down by method, the transit method, which detects a star dimming as a planet passes in front, took over after the Kepler space telescope launched in 2009." },

    { panel: 9, text: "Workout: the results of more than thirty-seven thousand marathon runners, with age, gender, the half-way time, called the split, and the finishing time." },
    { panel: 9, text: "The times are text. to timedelta converts them to durations, and total seconds expresses them in seconds." },
    { panel: 9, text: "The dotted line marks a perfectly steady pace, where the finish is exactly twice the split. Nearly all runners are above it: they slowed down in the second half." },
    { panel: 9, text: "The split fraction measures the slowdown: zero for a steady pace, positive when the second half was slower. Only two hundred fifty-one runners, under one percent, ran a negative split." },

    { panel: 10, text: "Is the split fraction related to the other variables? It doesn't depend much on age, but faster runners keep a more even pace." },
    { panel: 10, text: "Compared with density curves, a larger share of men than women run close to an even split." },
    { panel: 10, text: "Split violins by age decade show the difference among runners in their twenties to fifties. The oldest group is tiny, so its violins rest on very few runners." },
    { panel: 10, text: "And a regression by gender shows that runners who finish in under about fifteen thousand seconds, just over four hours, mostly stay below a split fraction of zero point one." },

    { panel: 11, text: "To recap." },
    { panel: 11, text: "catplot draws categorical plots: strip, swarm, box, violin, boxen, bar, point and count. lmplot draws regression fits, with order, robust and logistic options, and residplot checks the residuals." },
    { panel: 11, text: "Over fifteen modules, you've moved through the whole analytics pipeline: writing Python, organizing data in structures and DataFrames, modeling it with statistics, and communicating with visualizations." },
    { panel: 11, text: "These skills are the foundation for more advanced analytics, and for any data-driven role. Thank you, and congratulations!" },
  ],
});
