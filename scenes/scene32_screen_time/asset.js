// Scene 32: Screen Time. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'Screen Time',
  logline: 'The kids promised board games after the clean-up, but Professor Safadi finds all four glued to their tablets. They are done with board games, and still playing together: Craft Blocks and Fight Planet. "Do you remember what I said about video games?" "No." Dr. Sami: "30 minutes per day, and I suppose it is over!" "But you are also on your screen more than 30 minutes a day!" The professor "researches his books" with Robo Invasion; the doctor "looks up medical information" with World Champion. "Go play outside!" The kids trudge out. "Brother, what shall we do now?" "Robo Invasion… or World Champion?" To be continued…',
  files: ['props.js', 'scene.js'],              // the tablets, the game screens, the books; then the shots
  uses: ['scene18_some_assembly', 'scene28_cleaning_up'], // SA colors and cuGameFloor
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['alma', 'jenna', 'housam', 'danny', 'safadi', 'sami', 'robo_safadi', 'neptune'],
  locations: ['alma_bedroom', 'safadi_study', 'sami_clinic'],
  dialogue: [
    // part 1: glued to the screens
    { at: 7.4, speaker: 'safadi', text: 'Children, you said you wanted to play *board games*!', cps: 16, hold: .7, energy: 1.1 },
    { at: 15.6, speaker: 'housam', text: 'We are *done* playing board games...', cps: 13, hold: .6, energy: .55 },
    { at: 18.6, speaker: 'jenna', text: 'But we are *still* playing together!', cps: 15, hold: .6, energy: .7 },
    { at: 21.6, speaker: 'alma', text: 'I am playing *Craft Blocks* with Jenna.', cps: 15, hold: .6, energy: .8 },
    { at: 26.8, speaker: 'housam', text: 'I am playing *Fight Planet* with Danny.', cps: 15, hold: .6, energy: .8 },
    { at: 32.2, speaker: 'safadi', text: 'Do you remember what I said about *video games*?', cps: 16, hold: .7 },
    { at: 36.0, speaker: 'housam', text: 'No.', cps: 5, hold: .9, energy: .5, group: ['jenna', 'danny', 'housam', 'alma'] },
    { at: 36.0, speaker: 'danny', text: 'No.', cps: 5, hold: .9, energy: .5, silentBubble: true },
    { at: 36.0, speaker: 'jenna', text: 'No.', cps: 5, hold: .9, energy: .5, silentBubble: true },
    { at: 36.0, speaker: 'alma', text: 'No.', cps: 5, hold: .9, energy: .5, silentBubble: true },
    { at: 40.8, speaker: 'sami', text: '*30 minutes* per day... and I suppose it is *over*!', cps: 16, hold: .7, energy: 1.1 },
    { at: 45.6, speaker: 'housam', text: 'But you are *also* on your screen more than *30 minutes* a day!', cps: 17, hold: .7, kind: 'shout', energy: 1.3, group: ['jenna', 'danny', 'housam', 'alma'] },
    { at: 45.6, speaker: 'danny', text: 'But you are *also* on your screen more than *30 minutes* a day!', cps: 17, hold: .7, energy: 1.3, silentBubble: true },
    { at: 45.6, speaker: 'jenna', text: 'But you are *also* on your screen more than *30 minutes* a day!', cps: 17, hold: .7, energy: 1.3, silentBubble: true },
    { at: 45.6, speaker: 'alma', text: 'But you are *also* on your screen more than *30 minutes* a day!', cps: 17, hold: .7, energy: 1.3, silentBubble: true },
    // part 2: the professor's research
    { at: 69.0, speaker: 'safadi', text: 'I use it to *research* my books.', cps: 14, hold: .9, energy: .85 },
    // part 3: the doctor's research
    { at: 92.6, speaker: 'sami', text: 'I use it to look up *medical information*.', cps: 14, hold: .9, energy: .85 },
    { at: 97.4, speaker: 'housam', text: 'This is *not fair*!', cps: 11, hold: .7, kind: 'shout', energy: 1.35, group: ['jenna', 'danny', 'housam', 'alma'] },
    { at: 97.4, speaker: 'danny', text: 'This is *not fair*!', cps: 11, hold: .7, energy: 1.35, silentBubble: true },
    { at: 97.4, speaker: 'jenna', text: 'This is *not fair*!', cps: 11, hold: .7, energy: 1.35, silentBubble: true },
    { at: 97.4, speaker: 'alma', text: 'This is *not fair*!', cps: 11, hold: .7, energy: 1.35, silentBubble: true },
    { at: 99.6, speaker: 'safadi', text: 'Your screen time is *up*. Go play *outside*!', cps: 15, hold: .7, energy: 1.15, group: ['safadi', 'sami'] },
    { at: 99.6, speaker: 'sami', text: 'Your screen time is *up*. Go play *outside*!', cps: 15, hold: .7, energy: 1.15, silentBubble: true },
    // part 4: the twins
    { at: 109.6, speaker: 'sami', text: 'Brother... what shall we do *now*?', cps: 14, hold: .7, energy: .8 },
    { at: 112.4, speaker: 'safadi', text: '*Robo Invasion*... or *World Champion*?', cps: 14, hold: .7, energy: 1.0 },
    { at: 115.6, speaker: 'safadi', text: 'HA HA HA!', cps: 9, hold: .8, kind: 'shout', energy: 1.4, group: ['safadi', 'sami'] },
    { at: 115.6, speaker: 'sami', text: 'HA HA HA!', cps: 9, hold: .8, energy: 1.4, silentBubble: true },
  ],
  music: {
    prompt: 'A lazy, hypnotic little chiptune loop that leaks out of the tablets (bleeps and pews), a door knock and a cheerful cello entrance for Professor Safadi that stops dead when he sees the screens, a long awkward hush with crickets and tablet bleeps, two tiny chip-tune stings for Craft Blocks and Fight Planet, a deflated "No.", a second knock for Dr. Sami, a stern tick-tock for "30 minutes", a big indignant hit for the kids\' comeback and a gulp. Then a harp into the study: a serious, scholarly harpsichord that breaks into a full-tilt 8-bit space-invaders march with zaps on every hit, a HIGH SCORE fanfare, a sheepish plucked vamp for "I use it to research my books"; a harp into the clinic: a calm clinic bossa that breaks into a stadium chant, a whistle, a drumroll, a GOAL roar and applause, the same sheepish vamp; a stubborn stomp for "This is not fair!", a firm march to the door, a sulky trudge out, a sly vamp for the twins\' question, a big laugh, and the to-be-continued sting.',
    bpm: 112, tonic: 60, motif: [0, 7, 4, 7, 9, 7, 4, 2], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .3 }, { at: 3.8, energy: .15 }, { at: 4.6, energy: .5 }, { at: 6.4, energy: .05 }, { at: 7.4, energy: .25 },
      { at: 11.0, energy: .05 }, { at: 15.6, energy: .15 }, { at: 21.6, energy: .3 }, { at: 24.4, energy: .55 }, { at: 26.6, energy: .3 },
      { at: 29.6, energy: .55 }, { at: 31.8, energy: .25 }, { at: 36.0, energy: .08 }, { at: 37.8, energy: .4 }, { at: 40.8, energy: .3 },
      { at: 44.6, energy: .5 }, { at: 45.6, energy: .8 }, { at: 49.6, energy: .1 }, { at: 51.4, energy: .2 }, { at: 53.0, energy: .3 },
      { at: 58.2, energy: 1 }, { at: 64.6, energy: .9 }, { at: 67.0, energy: .2 }, { at: 69.0, energy: .2 }, { at: 73.6, energy: .1 },
      { at: 75.0, energy: .2 }, { at: 76.6, energy: .3 }, { at: 81.8, energy: .95 }, { at: 86.2, energy: 1 }, { at: 88.2, energy: .9 },
      { at: 90.6, energy: .2 }, { at: 92.6, energy: .2 }, { at: 97.4, energy: .75 }, { at: 99.6, energy: .6 }, { at: 103.0, energy: .2 },
      { at: 109.4, energy: .15 }, { at: 112.4, energy: .35 }, { at: 115.6, energy: .8 }, { at: 118.2, energy: .9 }, { at: 119.8, energy: .5 },
      { at: 124.0, energy: 0 },
    ],
    cues: [
      { at: .8, type: 'plip' }, { at: 1.9, type: 'pop' }, { at: 2.9, type: 'plip' }, { at: 4.0, type: 'plip' }, { at: 4.3, type: 'plip' },
      { at: 4.8, type: 'whoosh' }, { at: 6.4, type: 'scratch' }, { at: 11.8, type: 'cricket' }, { at: 12.6, type: 'plip' }, { at: 13.4, type: 'bonk' },
      { at: 14.4, type: 'cricket' }, { at: 24.5, type: 'pop' }, { at: 25.3, type: 'pop' }, { at: 29.7, type: 'pop' }, { at: 30.4, type: 'bonk' },
      { at: 36.2, type: 'bonk' }, { at: 37.9, type: 'plip' }, { at: 38.2, type: 'plip' }, { at: 38.6, type: 'whoosh' }, { at: 44.6, type: 'ding' },
      { at: 45.7, type: 'bonk' }, { at: 50.4, type: 'gulp' }, { at: 51.4, type: 'harp' }, { at: 57.0, type: 'whoosh' },
      { at: 58.6, type: 'pop' }, { at: 59.4, type: 'pop' }, { at: 60.2, type: 'pop' }, { at: 60.8, type: 'pop' }, { at: 61.5, type: 'pop' },
      { at: 62.1, type: 'pop' }, { at: 62.8, type: 'pop' }, { at: 63.4, type: 'pop' }, { at: 64.0, type: 'ding' }, { at: 65.6, type: 'ding' },
      { at: 67.0, type: 'harp' }, { at: 71.4, type: 'gulp' }, { at: 75.0, type: 'harp' }, { at: 80.6, type: 'whoosh' }, { at: 82.0, type: 'whistle' },
      { at: 86.0, type: 'drumroll', dur: 1.0 }, { at: 87.0, type: 'ding' }, { at: 87.0, type: 'applause', dur: 3.4 }, { at: 88.4, type: 'ding' },
      { at: 90.6, type: 'harp' }, { at: 95.4, type: 'gulp' }, { at: 97.5, type: 'bonk' }, { at: 99.7, type: 'ding' },
      { at: 103.4, type: 'plip' }, { at: 104.6, type: 'plip' }, { at: 105.8, type: 'plip' }, { at: 106.8, type: 'plip' }, { at: 108.4, type: 'bonk' },
      { at: 113.0, type: 'plip' }, { at: 114.4, type: 'plip' }, { at: 115.6, type: 'ding' }, { at: 118.2, type: 'ding' }, { at: 118.6, type: 'ding' },
    ],
  },
});
