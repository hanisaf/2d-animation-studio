# Scene 61: Python 13 · Statistics and Regression

> Module 13 of the Python course, at a black chalkboard: describing numeric and categorical variables, comparing groups, correlation, linear regression with statsmodels, and logistic regression for a yes/no outcome.

| | |
|---|---|
| **Length** | about 6 minutes (the voice ends at 5:46.1; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/13_statistics_and_regression.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/13_statistics_and_regression.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

The insurance data are described: the describe() table, a right-skewed histogram where the mean beats the median, categorical counts and proportions, and group comparisons (smokers pay 3–4×). Correlation is drawn on a −1…+1 scale with the correlation matrix. A least-squares line on a scatter explains OLS and the four key numbers; the multiple regression adds smoking, BMI and region and predicts two applicants. The diabetes warmup finds zeros that mean "missing", and the workout fits a logistic S-curve with odds ratios and predicted probabilities.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Statistics and Regression | title card, four goals |
| 02 | Describing numeric variables | the seven variables; the describe() table; 50% = the median |
| 03 | Skewed data: mean versus median | a right-skewed histogram with mean and median; single-statistic methods |
| 04 | Describing categorical variables | describe(exclude="number"); smoker counts; region proportions |
| 05 | Comparing groups | groupby smoker: $8,434 vs $32,050; region × smoker table |
| 06 | Correlation | the r scale with sketches; the correlation matrix; Pearson vs Spearman |
| 07 | Linear regression | the equation; least squares on a scatter; smf.ols; coef, intercept, p-value, R² |
| 08 | Multiple regression and prediction | the coefficient table; R² = 0.751; two applicants |
| 09 | Warmup: the diabetes data | zeros as missing values; outcome share; glucose by outcome |
| 10 | Workout: logistic regression | the S-curve; odds ratios; 13.6% vs 53.1% |
| 11 | Summary | the task → code table |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene61_py13_statistics_regression`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene61_py13_statistics_regression`.

<!-- narration:start -->
**37 lines · 780 words · voice ends at 5:46.1** (pace: 2.5 words per second).


### Panel 01 · Statistics and Regression

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 13: descriptive statistics and regression analysis. |
| 0:08.6 | Today you'll summarize numeric and categorical variables, compare groups, and measure association with correlation. |
| 0:14.7 | Then you'll fit and interpret linear and logistic regressions, and use a fitted model to make predictions. |

### Panel 02 · Describing numeric variables

| Cue | Narration |
|---|---|
| 0:23.1 | A US health insurer wants to understand what drives the cost of its policies. The data cover one thousand three hundred thirty-eight policyholders. |
| 0:32.8 | For each: age, sex, body mass index, number of children, smoking status, region, and the annual medical charges billed. |
| 0:40.9 | describe computes the standard summary statistics for every numeric column: the count, the mean and standard deviation, the minimum and maximum, and the quartiles. The fifty percent quantile is the median. |

### Panel 03 · Skewed data: mean versus median

| Cue | Narration |
|---|---|
| 0:54.9 | Look at the charges. The mean is about thirteen thousand two hundred seventy dollars, far above the median of about nine thousand four hundred. |
| 1:05.0 | A few very expensive policies pull the mean up. When a distribution is skewed like this, the median is the better description of a typical value. |
| 1:15.9 | Each statistic is also a method: mean, median, standard deviation, and quantile, here the ninetieth percentile. |

### Panel 04 · Describing categorical variables

| Cue | Narration |
|---|---|
| 1:23.9 | For text columns, describe with exclude equals number reports the number of distinct values and the most frequent one. |
| 1:32.0 | value counts gives the full frequency table: a thousand sixty-four non-smokers and two hundred seventy-four smokers. |
| 1:38.9 | With normalize equals True, you get proportions instead of counts. The four regions are roughly equal. |

### Panel 05 · Comparing groups

| Cue | Narration |
|---|---|
| 1:46.9 | groupby splits the rows into groups, applies a statistic to each, and combines the results. Do smokers pay more? |
| 1:55.0 | On average, non-smokers are charged about eight thousand four hundred dollars, and smokers about thirty-two thousand. |
| 2:01.9 | Grouping by two columns, and unstacking the inner one, gives a cross-tabulation. In every region, smokers are charged three to four times as much. |

### Panel 06 · Correlation

| Cue | Narration |
|---|---|
| 2:13.1 | The correlation coefficient r measures the strength of the linear association between two numeric variables, from minus one, through zero, to plus one. |
| 2:22.8 | corr computes it for every pair of numeric columns. Charges increase with age, r equals zero point three zero, and with BMI, r equals zero point two zero. |
| 2:34.5 | The default is Pearson's correlation. The Spearman method is rank-based: less sensitive to outliers, and it also detects curved relationships, as long as they consistently increase or decrease. |

### Panel 07 · Linear regression

| Cue | Narration |
|---|---|
| 2:47.3 | Correlation looks at two variables at a time. To estimate the effect of several together, we need regression. |
| 2:55.0 | A linear regression models the outcome as a weighted sum of predictors. Ordinary least squares chooses the coefficients that minimize the sum of squared prediction errors. |
| 3:05.9 | With statsmodels, describe the model with a formula, outcome tilde predictors, fit it, and inspect the summary. |
| 3:13.2 | Four numbers matter most. Each extra year of age adds about two hundred fifty-eight dollars. The p-value is below point zero five, so the effect is statistically significant. And R squared says age alone explains about nine percent of the variation. |

### Panel 08 · Multiple regression and prediction

| Cue | Narration |
|---|---|
| 3:31.2 | Adding predictors is as simple as extending the formula. Text columns become dummy variables, compared with a baseline category. |
| 3:39.3 | Holding the rest constant, smokers are charged about twenty-three thousand eight hundred dollars more. Each year of age adds about two fifty-seven, and each BMI point about three thirty-nine. |
| 3:51.4 | Sex is small and not significant, with a p-value of point seven. Together, the predictors explain seventy-five percent of the variation. |
| 4:00.3 | And predict estimates new cases. Two applicants who differ only in smoking status differ by exactly the smoker coefficient. |

### Panel 09 · Warmup: the diabetes data

| Cue | Narration |
|---|---|
| 4:09.5 | Warmup, with the diabetes data: diagnostic measurements for seven hundred sixty-eight women, and whether each was diagnosed with diabetes. |
| 4:17.6 | describe reveals something suspicious: a minimum of zero for glucose, blood pressure, skin thickness, insulin and BMI. That's impossible. Zero was used to record a missing measurement, and almost half the insulin values are missing. |
| 4:32.1 | About thirty-five percent of the women have diabetes. They have markedly higher glucose, and glucose is the variable most strongly correlated with the outcome. |

### Panel 10 · Workout: logistic regression

| Cue | Narration |
|---|---|
| 4:43.3 | The outcome is yes or no, so linear regression is a poor fit: it can predict below zero or above one. |
| 4:52.2 | Logistic regression models the probability through an S-shaped curve. In statsmodels, replace ols with logit. |
| 4:58.7 | Exponentiated coefficients are odds ratios. Each glucose point multiplies the odds of diabetes by one point zero three three. Thirty points multiply them by about two point seven. |
| 5:10.4 | For two otherwise identical forty-year-old women, a glucose of one hundred gives a probability of about fourteen percent, and one sixty about fifty-three percent. |

### Panel 11 · Summary

| Cue | Narration |
|---|---|
| 5:21.6 | To recap. |
| 5:23.5 | describe, value counts, groupby and corr summarize and compare your data. |
| 5:28.4 | smf dot ols fits a linear regression, and smf dot logit a logistic one. Read the coefficients, their p-values, and R squared, and predict new cases. |
| 5:39.3 | And always describe your data before you model it. Next up: Module 14, visualizing relationships and distributions. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (none), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
