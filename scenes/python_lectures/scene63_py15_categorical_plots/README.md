# Scene 63: Python 15 · Categorical Data and Regression Plots

> Module 15, the last of the Python course, at a black chalkboard: strip, swarm, box, violin, bar, point and count plots, regression plots and their diagnostics, and an open-ended look at 37,000 marathon runners.

| | |
|---|---|
| **Length** | about 6½ minutes (the voice ends at 6:11.3; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/15_categorical_and_regression_plots.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/15_categorical_and_regression_plots.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

catplot's three families are tabled, then sketched: strip and swarm plots, box plots (with their anatomy), split violins, Titanic survival bars, a count plot and a point plot that reveals an interaction. lmplot draws fits with a confidence band, x_estimator and per-group lines; Anscombe's quartet, order=2, robust=True, a residual arch and a logistic curve show when a straight line is not enough. The warmup counts exoplanets by year; two workout panels analyse marathon pacing. The finale checks off all five pipeline stages: "Thank you, and congratulations!"

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Categorical Data and Regression Plots | title card, four goals |
| 02 | One interface: catplot() | the three families of kind= |
| 03 | Categorical scatter plots | strip, swarm with hue, horizontal with order |
| 04 | Distributions within categories | box anatomy; boxes by smoker; split violins |
| 05 | Estimates within categories | bar plot of Titanic survival; count plot by deck; point plot interaction |
| 06 | Regression plots | lmplot with a 95% band; x_estimator; hue and col |
| 07 | When a straight line is not enough | Anscombe's quartet; order=2; robust=True; the residual arch; logistic=True |
| 08 | Warmup: discovering exoplanets | discoveries per year; Kepler and the transit method |
| 09 | Workout: marathon pacing | times to seconds; final vs 2 × split; the split fraction; 251 negative splits |
| 10 | Workout: who keeps an even pace? | pace vs finish time; men vs women; violins by decade; the 0.1 reference line |
| 11 | Summary and course wrap-up | three takeaways; the five pipeline stages checked; "Thank you, and congratulations!" |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene63_py15_categorical_plots`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene63_py15_categorical_plots`.

<!-- narration:start -->
**37 lines · 843 words · voice ends at 6:11.3** (pace: 2.5 words per second).


### Panel 01 · Categorical Data and Regression Plots

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 15, our final module: visualizing categorical data and regression models. |
| 0:10.2 | Many business questions compare categories: sales by region, satisfaction by product line, salaries by department. |
| 0:16.7 | Today: plots that compare groups, plots that show estimates, regression plots and their diagnostics, and an open-ended analysis of real data. |

### Panel 02 · One interface: catplot()

| Cue | Narration |
|---|---|
| 0:26.7 | seaborn's catplot handles categories with one interface, just as relplot and displot did. The kind parameter picks the plot. |
| 0:34.8 | Categorical scatter plots show every observation. Distribution plots show the shape of each group. And estimate plots show one summary number per group. |

### Panel 03 · Categorical scatter plots

| Cue | Narration |
|---|---|
| 0:45.6 | A strip plot draws every observation, with a little random jitter so points in the same category don't hide each other. |
| 0:54.5 | A swarm plot arranges the points so they never overlap. It shows the distribution more faithfully, but works only for small datasets. |
| 1:03.8 | When category names are long or many, swap x and y to put them on the vertical axis, and use order to set their order. |

### Panel 04 · Distributions within categories

| Cue | Narration |
|---|---|
| 1:15.4 | With more data, summaries work better. A box plot shows the median, the quartiles, which hold the middle half of the data, and whiskers that reach at most one and a half box heights beyond the box. Points beyond them are potential outliers. |
| 1:33.1 | Adding hue places the boxes of each subgroup side by side. |
| 1:38.0 | A violin plot replaces the box with a mirrored density curve. With two hue levels, split puts one on each side. And layering a swarm on a light violin combines the summary with the raw data. |

### Panel 05 · Estimates within categories

| Cue | Narration |
|---|---|
| 1:54.0 | Sometimes one number per category is all the reader needs. A bar plot shows each group's mean, with an error bar for its ninety-five percent confidence interval. |
| 2:05.3 | For the Titanic, survived is zero or one, so its mean is the survival rate. |
| 2:11.8 | A count plot shows the number of observations in each category: a histogram for categories. |
| 2:18.3 | A point plot connects the estimates of each hue level with a line, so slopes reveal interactions. Women's survival dropped sharply in third class; men's was low in every class. |

### Panel 06 · Regression plots

| Cue | Narration |
|---|---|
| 2:31.9 | lmplot draws a scatter plot, fits the linear regression y on x, and draws the line with a ninety-five percent confidence band. It's the visual counterpart of Module 13's regressions. |
| 2:44.4 | When x takes only a few values, x estimator replaces each column of points with its mean and confidence interval. |
| 2:52.9 | And hue and col fit a separate line for each group, to show whether the relationship differs between groups. |

### Panel 07 · When a straight line is not enough

| Cue | Narration |
|---|---|
| 3:02.1 | Anscombe's quartet is four small datasets with nearly identical means, variances, correlations and regression lines, and completely different patterns. Always plot your data. |
| 3:11.8 | Dataset two is curved: a polynomial of order two fits it almost perfectly. Dataset three has one outlier, and a robust regression down-weights it. |
| 3:21.9 | A residual plot shows the errors of a linear fit. If the model is right, they scatter randomly around zero. For dataset two, they form an arch: an upside-down U that reveals the curve. |
| 3:36.0 | For a yes-or-no outcome, logistic equals True draws the estimated probability. Surprisingly, larger bills are less likely to get a generous tip, in percentage terms. |

### Panel 08 · Warmup: discovering exoplanets

| Cue | Narration |
|---|---|
| 3:47.6 | Warmup: more than a thousand exoplanets discovered up to 2014. A count plot shows the discoveries per year. |
| 3:55.3 | aspect makes the figure wider, and set xticklabels with step five labels every fifth year. |
| 4:01.8 | Broken down by method, the transit method, which detects a star dimming as a planet passes in front, took over after the Kepler space telescope launched in 2009. |

### Panel 09 · Workout: marathon pacing

| Cue | Narration |
|---|---|
| 4:14.6 | Workout: the results of more than thirty-seven thousand marathon runners, with age, gender, the half-way time, called the split, and the finishing time. |
| 4:24.3 | The times are text. to timedelta converts them to durations, and total seconds expresses them in seconds. |
| 4:31.6 | The dotted line marks a perfectly steady pace, where the finish is exactly twice the split. Nearly all runners are above it: they slowed down in the second half. |
| 4:43.7 | The split fraction measures the slowdown: zero for a steady pace, positive when the second half was slower. Only two hundred fifty-one runners, under one percent, ran a negative split. |

### Panel 10 · Workout: who keeps an even pace?

| Cue | Narration |
|---|---|
| 4:57.3 | Is the split fraction related to the other variables? It doesn't depend much on age, but faster runners keep a more even pace. |
| 5:07.0 | Compared with density curves, a larger share of men than women run close to an even split. |
| 5:14.3 | Split violins by age decade show the difference among runners in their twenties to fifties. The oldest group is tiny, so its violins rest on very few runners. |
| 5:26.0 | And a regression by gender shows that runners who finish in under about fifteen thousand seconds, just over four hours, mostly stay below a split fraction of zero point one. |

### Panel 11 · Summary and course wrap-up

| Cue | Narration |
|---|---|
| 5:39.6 | To recap. |
| 5:41.5 | catplot draws categorical plots: strip, swarm, box, violin, boxen, bar, point and count. lmplot draws regression fits, with order, robust and logistic options, and residplot checks the residuals. |
| 5:53.2 | Over fifteen modules, you've moved through the whole analytics pipeline: writing Python, organizing data in structures and DataFrames, modeling it with statistics, and communicating with visualizations. |
| 6:04.1 | These skills are the foundation for more advanced analytics, and for any data-driven role. Thank you, and congratulations! |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the residual plot on panel 7), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
