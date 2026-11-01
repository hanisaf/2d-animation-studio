// Scene 61: Python lecture, Module 13 · Descriptive Statistics and Regression Analysis (lectures/13_statistics_and_regression.ipynb).
// A black-board lecture built with scene 49's kit (lecture_kit.js). The narration is a voice-over you record yourself:
// README.md lists every line with its cue time (node scripts/lecture_script.mjs scene61_py13_statistics_regression).
asset({
  title: 'Python 13 · Statistics and Regression',
  logline: 'Module 13 of the Python course, at a black chalkboard: describing numeric and categorical variables, comparing groups, correlation, linear regression with statsmodels, and logistic regression for a yes/no outcome.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: [],
  locations: ['lecture_hall'],
  uses: ['scene49_py01_analytics_pipeline'],
  source: 'https://github.com/hanisaf/python-programming-skills/blob/main/lectures/13_statistics_and_regression.ipynb',
  pace: { wps: 2.5, gap: .5, panelGap: 1.1, lead: 4.5 },
  narration: [
    { panel: 1, text: "Welcome to Module 13: descriptive statistics and regression analysis." },
    { panel: 1, text: "Today you'll summarize numeric and categorical variables, compare groups, and measure association with correlation." },
    { panel: 1, text: "Then you'll fit and interpret linear and logistic regressions, and use a fitted model to make predictions." },

    { panel: 2, text: "A US health insurer wants to understand what drives the cost of its policies. The data cover one thousand three hundred thirty-eight policyholders." },
    { panel: 2, text: "For each: age, sex, body mass index, number of children, smoking status, region, and the annual medical charges billed." },
    { panel: 2, text: "describe computes the standard summary statistics for every numeric column: the count, the mean and standard deviation, the minimum and maximum, and the quartiles. The fifty percent quantile is the median." },

    { panel: 3, text: "Look at the charges. The mean is about thirteen thousand two hundred seventy dollars, far above the median of about nine thousand four hundred." },
    { panel: 3, text: "A few very expensive policies pull the mean up. When a distribution is skewed like this, the median is the better description of a typical value." },
    { panel: 3, text: "Each statistic is also a method: mean, median, standard deviation, and quantile, here the ninetieth percentile." },

    { panel: 4, text: "For text columns, describe with exclude equals number reports the number of distinct values and the most frequent one." },
    { panel: 4, text: "value counts gives the full frequency table: a thousand sixty-four non-smokers and two hundred seventy-four smokers." },
    { panel: 4, text: "With normalize equals True, you get proportions instead of counts. The four regions are roughly equal." },

    { panel: 5, text: "groupby splits the rows into groups, applies a statistic to each, and combines the results. Do smokers pay more?" },
    { panel: 5, text: "On average, non-smokers are charged about eight thousand four hundred dollars, and smokers about thirty-two thousand." },
    { panel: 5, text: "Grouping by two columns, and unstacking the inner one, gives a cross-tabulation. In every region, smokers are charged three to four times as much." },

    { panel: 6, text: "The correlation coefficient r measures the strength of the linear association between two numeric variables, from minus one, through zero, to plus one." },
    { panel: 6, text: "corr computes it for every pair of numeric columns. Charges increase with age, r equals zero point three zero, and with BMI, r equals zero point two zero." },
    { panel: 6, text: "The default is Pearson's correlation. The Spearman method is rank-based: less sensitive to outliers, and it also detects curved relationships, as long as they consistently increase or decrease." },

    { panel: 7, text: "Correlation looks at two variables at a time. To estimate the effect of several together, we need regression." },
    { panel: 7, text: "A linear regression models the outcome as a weighted sum of predictors. Ordinary least squares chooses the coefficients that minimize the sum of squared prediction errors." },
    { panel: 7, text: "With statsmodels, describe the model with a formula, outcome tilde predictors, fit it, and inspect the summary." },
    { panel: 7, text: "Four numbers matter most. Each extra year of age adds about two hundred fifty-eight dollars. The p-value is below point zero five, so the effect is statistically significant. And R squared says age alone explains about nine percent of the variation." },

    { panel: 8, text: "Adding predictors is as simple as extending the formula. Text columns become dummy variables, compared with a baseline category." },
    { panel: 8, text: "Holding the rest constant, smokers are charged about twenty-three thousand eight hundred dollars more. Each year of age adds about two fifty-seven, and each BMI point about three thirty-nine." },
    { panel: 8, text: "Sex is small and not significant, with a p-value of point seven. Together, the predictors explain seventy-five percent of the variation." },
    { panel: 8, text: "And predict estimates new cases. Two applicants who differ only in smoking status differ by exactly the smoker coefficient." },

    { panel: 9, text: "Warmup, with the diabetes data: diagnostic measurements for seven hundred sixty-eight women, and whether each was diagnosed with diabetes." },
    { panel: 9, text: "describe reveals something suspicious: a minimum of zero for glucose, blood pressure, skin thickness, insulin and BMI. That's impossible. Zero was used to record a missing measurement, and almost half the insulin values are missing." },
    { panel: 9, text: "About thirty-five percent of the women have diabetes. They have markedly higher glucose, and glucose is the variable most strongly correlated with the outcome." },

    { panel: 10, text: "The outcome is yes or no, so linear regression is a poor fit: it can predict below zero or above one." },
    { panel: 10, text: "Logistic regression models the probability through an S-shaped curve. In statsmodels, replace ols with logit." },
    { panel: 10, text: "Exponentiated coefficients are odds ratios. Each glucose point multiplies the odds of diabetes by one point zero three three. Thirty points multiply them by about two point seven." },
    { panel: 10, text: "For two otherwise identical forty-year-old women, a glucose of one hundred gives a probability of about fourteen percent, and one sixty about fifty-three percent." },

    { panel: 11, text: "To recap." },
    { panel: 11, text: "describe, value counts, groupby and corr summarize and compare your data." },
    { panel: 11, text: "smf dot ols fits a linear regression, and smf dot logit a logistic one. Read the coefficients, their p-values, and R squared, and predict new cases." },
    { panel: 11, text: "And always describe your data before you model it. Next up: Module 14, visualizing relationships and distributions." },
  ],
});
