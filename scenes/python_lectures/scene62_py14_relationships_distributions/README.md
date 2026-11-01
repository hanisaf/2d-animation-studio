# Scene 62: Python 14 · Relationships and Distributions

> Module 14 of the Python course, at a black chalkboard: scatter and line plots with seaborn, hue, style, size and facets, histograms, KDEs and ECDFs, joint and pair plots, and what the insurance data look like.

| | |
|---|---|
| **Length** | about 6 minutes (the voice ends at 5:40.6; the scene runs about 5 s longer for the pull-back) · 24 fps |
| **Cast** | none. The board is the whole show |
| **Location** | [Lecture hall](../../../locations/lecture_hall/README.md) with the **big board** painted solid black (`bigBoard` + `blackBoard`) |
| **Source** | [`lectures/14_relationships_and_distributions.ipynb`](https://github.com/hanisaf/python-programming-skills/blob/main/lectures/14_relationships_and_distributions.ipynb) in *python-programming-skills* (BUSN 3030E, University of Georgia) |
| **Look** | UGA red and black, as in [scene 49](../scene49_py01_analytics_pipeline/README.md): white chalk, with red for keywords, outputs, badges and highlights |
| **Sound** | a voice-over you record yourself (the script is below). No music or effects |

## Synopsis

Every seaborn call is drawn as a chalk sketch of the plot it makes: relplot scatters with hue, style and size; line plots with a confidence band and one line per month; small multiples and a fully labelled figure; histograms, KDEs (and their pitfalls) and ECDFs; joint and pair plots, with a guide to choosing a plot. The warmup takes Gapminder to a log scale and the bubble chart; the workout finds three bands, the BMI-30 jump for smokers, and an interaction.

## Board panels (`scene.js`)

| # | Panel | Builds |
|---|---|---|
| 01 | Relationships and Distributions | title card, four goals |
| 02 | seaborn | imports and set_theme; the tips data |
| 03 | Scatter plots | relplot; hue + style; size; less is more |
| 04 | Line plots | the mean with a 95% band; hue="month" |
| 05 | Small multiples and labels | col="time"; col_wrap; a labelled figure |
| 06 | Histograms | a bimodal histogram; binwidth; one histogram per species |
| 07 | Density curves and ECDFs | KDEs by group; a KDE spilling below $0; ECDFs and the median |
| 08 | Many variables at once | jointplot; pairplot; choosing a plot |
| 09 | Warmup: Gapminder | crowded → log scale → bubble chart |
| 10 | Workout: insurance charges | three bands by age; smokers jump at BMI 30; an interaction |
| 11 | Summary | the function → options table |

## Voice-over script

Record each line so that it **starts at its cue time** (2.5 words per second, ½ s between lines, 1.1 s more before each new panel). Each board element chalks itself on as the line that mentions it begins. To match your own pace, change `pace` in [`asset.js`](asset.js) and run `node scripts/lecture_script.mjs scene62_py14_relationships_distributions`; the same command updates this script after you edit `narration`. To add your recording, save it as `audio.mp3` in this folder, add `audio: 'audio.mp3'` to `asset.js`, and build with `scripts/build_scene.sh scene62_py14_relationships_distributions`.

<!-- narration:start -->
**34 lines · 770 words · voice ends at 5:40.6** (pace: 2.5 words per second).


### Panel 01 · Relationships and Distributions

| Cue | Narration |
|---|---|
| 0:04.5 | Welcome to Module 14: visualizing statistical relationships and distributions. |
| 0:08.6 | A good chart reveals patterns that a table of numbers hides. Today you'll draw scatter and line plots, and encode more variables with color, style, size and small multiples. |
| 0:20.7 | You'll visualize distributions with histograms, density curves and ECDFs, explore many variables at once, and label figures so they stand on their own. |

### Panel 02 · seaborn

| Cue | Narration |
|---|---|
| 0:31.5 | seaborn is a plotting library built on matplotlib that works directly with pandas DataFrames. You name the columns to put on each axis, and seaborn handles the rest. |
| 0:43.2 | set theme applies a clean style to every figure. And seaborn ships with example datasets, like tips: two hundred forty-four restaurant bills, with the tip, the party size, and details of the visit. |

### Panel 03 · Scatter plots

| Cue | Narration |
|---|---|
| 0:58.0 | relplot, the relational plot, draws a scatter plot by default: one point per row. Larger bills come with larger tips. |
| 1:06.5 | A third variable can be mapped to color with hue, and to the marker shape with style. Using both for the same variable keeps the plot readable in black and white, and for color-blind readers. |
| 1:21.0 | A numeric variable can be mapped to the size of the points. But less is more: two or three variables per plot is usually the limit. |

### Panel 04 · Line plots

| Cue | Narration |
|---|---|
| 1:33.0 | When the x variable is time, a line plot emphasizes continuity. The flights data count monthly airline passengers from 1949 to 1960. |
| 1:42.3 | Each year has twelve observations, so seaborn aggregates them: the line shows the mean, and the band a ninety-five percent confidence interval. |
| 1:51.6 | Mapping month to hue draws one line per month instead, and reveals the seasonal pattern: passengers grew every year, and summer was always busiest. |

### Panel 05 · Small multiples and labels

| Cue | Narration |
|---|---|
| 2:02.8 | To show how a relationship depends on a category, draw one panel per category with col and row. These small multiples share their axes, which makes comparison easy. |
| 2:14.5 | col wrap wraps many panels into rows, and height and aspect set the size of each panel. |
| 2:21.8 | A figure in a report must stand on its own. The grid object that relplot returns sets clear axis labels, units included, and a title. |

### Panel 06 · Histograms

| Cue | Narration |
|---|---|
| 2:33.4 | Before modeling a variable, look at its distribution: its range, center, shape, and outliers. displot draws a histogram by default. |
| 2:41.9 | Penguin flipper lengths have two peaks. The distribution is bimodal, a hint that the data mix different groups. |
| 2:49.6 | The bin size can change the story, so check a few choices with binwidth or bins. |
| 2:56.5 | Mapping species to hue draws one histogram per group, and the two peaks turn out to come from the species. Stacking, outlines, and density scaling help compare groups. |

### Panel 07 · Density curves and ECDFs

| Cue | Narration |
|---|---|
| 3:09.3 | A kernel density estimate replaces the bars with a smooth curve. It's often easier to compare several groups with KDEs. |
| 3:17.8 | bw adjust controls the smoothness. But beware: a KDE is always smooth, and it can spill into impossible values, like negative restaurant bills. cut equals zero stops it at the data. |
| 3:30.7 | An ECDF plots, for each value, the share of observations at or below it. No bins or bandwidth to choose, and the median is where the curve crosses one half. |

### Panel 08 · Many variables at once

| Cue | Narration |
|---|---|
| 3:44.3 | To explore many variables at once, jointplot combines a scatter plot with the distribution of each variable in the margins. |
| 3:52.8 | And pairplot draws every pairwise scatter plot, with each distribution on the diagonal. It's a quick first look at a new dataset. |
| 4:02.1 | To choose: scatter for two numeric variables, line for change over time, displot for a distribution, hue or facets for groups, and pairplot for a first look. |

### Panel 09 · Warmup: Gapminder

| Cue | Narration |
|---|---|
| 4:14.5 | Warmup, with Gapminder. GDP per capita against life expectancy crowds most countries on the left, because GDP is highly skewed. |
| 4:23.0 | A logarithmic scale spreads them out, and reveals a roughly linear relationship. |
| 4:28.3 | For 2007, map population to the size of the points: that's the famous Gapminder bubble chart. And over time, life expectancy rose on every continent, though Africa's progress stalled in the 1990s. |

### Panel 10 · Workout: insurance charges

| Cue | Narration |
|---|---|
| 4:42.7 | Workout. Back to the insurance data from Module 13. A pair plot colored by smoking status shows smokers charged more at every age, in distinct bands. |
| 4:53.6 | Focus on BMI and charges. For non-smokers, BMI barely matters. For smokers, charges jump sharply around a BMI of thirty, the clinical threshold for obesity. |
| 5:04.1 | The pattern is the same for women and men, which agrees with the regression. But the chart shows something the linear model missed: the effect of BMI depends on smoking. That's an interaction. |

### Panel 11 · Summary

| Cue | Narration |
|---|---|
| 5:18.9 | To recap. |
| 5:20.8 | relplot draws scatter and line plots, with hue, style, size, col and row. |
| 5:26.5 | displot draws histograms, KDEs and ECDFs. jointplot and pairplot show many variables at once. |
| 5:32.6 | And label your figures so they stand on their own. Next up, the final module: categorical data and regression plots. |
<!-- narration:end -->

## Shots

The kit ([scene 49's `lecture_kit.js`](../scene49_py01_analytics_pipeline/lecture_kit.js)) builds the shots from the narration timing: a push-in from the empty rows at the start, the whole board drifting gently for each panel, close-ups (the BMI chart on panel 10), and a pull-back with a fade to black at the end. See [scene 49](../scene49_py01_analytics_pipeline/README.md#notes-for-editing) for how panels, close-ups and the kit work.
