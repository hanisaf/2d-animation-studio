// Scene 21b: Dolphin Royalty. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'Dolphin Royalty',
  logline: 'Housam and Danny reprogram Robo-Safadi so "explain" no longer sends him haywire. Jenna and Alma test it ("Let me EXPLAIN…"), and nothing happens. Sigh. Then the girls unveil their own books for the book fair: Dolphin Royalty, a coloring book with a mini poster, starring Princess Pearl and Jester Fester. Everyone races to the library to write. "You shall see!"',
  files: ['props.js', 'scene.js'],              // the girls' book covers, the mini poster, the story pops; then the shots
  uses: ['scene16_spooky_plan', 'scene18_some_assembly', 'scene19_if_else_explain'], // spkPencil, saMarker and saWrench, and the ie* cart, laptop and editor
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  refs: ['reference/cover_gold.jpg', 'reference/cover_green.jpg', 'reference/mini_poster.jpg'],   // the real books (the covers are redrawn from these)
  cast: ['housam', 'danny', 'jenna', 'alma', 'robo_safadi', 'clawd', 'princess_pearl', 'jester_fester'],
  locations: ['science_room', 'school_library'],
  dialogue: [
    // the fix
    { at: 6.0, speaker: 'jenna', text: 'What are you boys *doing*?', cps: 15, hold: .5, group: ['jenna', 'alma'] },
    { at: 6.0, speaker: 'alma', text: 'What are you boys *doing*?', cps: 15, hold: .5, silentBubble: true },
    { at: 8.4, speaker: 'housam', text: 'We are *reprogramming* Robo-Safadi...', cps: 17, hold: .2 },
    { at: 11.0, speaker: 'danny', text: "...so he doesn't go *haywire* when someone says *explain*!", cps: 18, hold: .4 },
    { at: 17.4, speaker: 'housam', text: 'No more *haywire*.', cps: 13, hold: .5 },
    // the test
    { at: 19.4, speaker: 'alma', text: 'Let *us* test it!', cps: 13, hold: .5, energy: 1.15, group: ['jenna', 'alma'] },
    { at: 19.4, speaker: 'jenna', text: 'Let *us* test it!', cps: 13, hold: .5, energy: 1.15, silentBubble: true },
    { at: 22.4, speaker: 'alma', text: 'Ahem... Let me *EXPLAIN*...', cps: 12, hold: .5, energy: .75, group: ['jenna', 'alma'] },
    { at: 22.4, speaker: 'jenna', text: 'Ahem... Let me *EXPLAIN*...', cps: 12, hold: .5, energy: .75, silentBubble: true },
    { at: 28.8, speaker: 'housam', text: '*Sigh...*', cps: 8, hold: .8, kind: 'whisper', energy: .5, group: ['jenna', 'alma', 'housam', 'danny'] },
    { at: 28.8, speaker: 'danny', text: '*Sigh...*', cps: 8, hold: .8, energy: .5, silentBubble: true },
    { at: 28.8, speaker: 'jenna', text: '*Sigh...*', cps: 8, hold: .8, energy: .5, silentBubble: true },
    { at: 28.8, speaker: 'alma', text: '*Sigh...*', cps: 8, hold: .8, energy: .5, silentBubble: true },
    // the books
    { at: 30.8, speaker: 'alma', text: 'Boys... we are working on writing *new books*...', cps: 18, hold: .2 },
    { at: 33.8, speaker: 'jenna', text: '...to compete with *Professor Safadi* at the *book fair*!', cps: 19, hold: .4, energy: 1.1 },
    { at: 37.2, speaker: 'housam', text: '*Nice!* But what are these books?', cps: 16, hold: .4 },
    { at: 39.8, speaker: 'alma', text: 'TA-DA!', cps: 10, hold: .6, kind: 'shout', energy: 1.4, group: ['jenna', 'alma'] },
    { at: 39.8, speaker: 'jenna', text: 'TA-DA!', cps: 10, hold: .6, energy: 1.4, silentBubble: true },
    { at: 41.4, speaker: 'alma', text: '*Dolphin Royalty*: a coloring book!', cps: 15, hold: .5, energy: 1.1 },
    { at: 45.0, speaker: 'jenna', text: 'With dolphins, stars... and a *servant*!', cps: 16, hold: .4 },
    { at: 48.4, speaker: 'jenna', text: 'And a *mini poster*!', cps: 13, hold: .8, energy: 1.15 },
    { at: 51.6, speaker: 'danny', text: "Cool! Who's in the *story*?", cps: 15, hold: .4 },
    // the fantasy world
    { at: 53.8, speaker: 'alma', text: 'Meet *Princess Pearl*!', cps: 14, hold: .4, energy: 1.2 },
    { at: 56.0, speaker: 'alma', text: 'A rainbow dolphin who *rules* the royal court!', cps: 18, hold: .3 },
    { at: 59.0, speaker: 'alma', text: 'And her jester... *Jester Fester*!', cps: 15, hold: .3, energy: 1.15 },
    { at: 61.8, speaker: 'alma', text: 'His tricks *always* go... *almost* right!', cps: 15, hold: .6 },
    { at: 65.2, speaker: 'jenna', text: 'And you get to *color* them in!', cps: 16, hold: .6, energy: 1.1 },
    { at: 68.0, speaker: 'danny', text: "Whoa! Professor Safadi won't stand a *chance*!", cps: 18, hold: .4, energy: 1.2 },
    { at: 70.8, speaker: 'housam', text: 'Can we write books *too*?', cps: 15, hold: .3 },
    { at: 72.8, speaker: 'jenna', text: 'Of course! To the *library*!', cps: 16, hold: .3, energy: 1.2 },
    { at: 74.8, speaker: 'housam', text: 'TO THE LIBRARY!', cps: 12, hold: .4, kind: 'shout', energy: 1.4, group: ['jenna', 'alma', 'housam', 'danny'] },
    { at: 74.8, speaker: 'danny', text: 'TO THE LIBRARY!', cps: 12, hold: .4, energy: 1.4, silentBubble: true },
    { at: 74.8, speaker: 'jenna', text: 'TO THE LIBRARY!', cps: 12, hold: .4, energy: 1.4, silentBubble: true },
    { at: 74.8, speaker: 'alma', text: 'TO THE LIBRARY!', cps: 12, hold: .4, energy: 1.4, silentBubble: true },
    // the library
    { at: 91.0, speaker: 'jenna', text: 'Professor Safadi... you *shall see*!', cps: 15, hold: .8, energy: 1.2, group: ['jenna', 'alma', 'housam', 'danny'] },
    { at: 91.0, speaker: 'alma', text: 'Professor Safadi... you *shall see*!', cps: 15, hold: .8, energy: 1.2, silentBubble: true },
    { at: 91.0, speaker: 'housam', text: 'Professor Safadi... you *shall see*!', cps: 15, hold: .8, energy: 1.2, silentBubble: true },
    { at: 91.0, speaker: 'danny', text: 'Professor Safadi... you *shall see*!', cps: 15, hold: .8, energy: 1.2, silentBubble: true },
  ],
  music: {
    prompt: 'A bright, sneaky after-school groove: keyboard-tap percussion while the boys reprogram the robot, a door-swing whoosh for the girls, a held breath and a ticking drum roll during the test, a big relieved deflate on the sigh, a fanfare on TA-DA, sparkly pops as Princess Pearl and Jester Fester jump out of the book, a bonk for the ball on Fester\'s head, crayon scribbles for the coloring, a whoosh to the library, a busy pencil-scratching montage, and a cheeky sting into the to-be-continued.',
    bpm: 112, tonic: 62, motif: [0, 4, 7, 9, 7, 4, 2, 4], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .4 }, { at: 2.6, energy: .5 }, { at: 6.0, energy: .45 }, { at: 14.6, energy: .4 }, { at: 19.4, energy: .55 },
      { at: 22.4, energy: .3 }, { at: 25.0, energy: .1 }, { at: 28.8, energy: .35 }, { at: 30.8, energy: .5 }, { at: 39.8, energy: .9 },
      { at: 41.0, energy: .55 }, { at: 51.4, energy: .45 }, { at: 53.8, energy: .7 }, { at: 59.0, energy: .75 }, { at: 64.3, energy: .5 },
      { at: 65.2, energy: .65 }, { at: 68.0, energy: .75 }, { at: 74.8, energy: 1 }, { at: 76.4, energy: .7 }, { at: 79.4, energy: .6 },
      { at: 88.4, energy: .75 }, { at: 91.0, energy: .9 }, { at: 94.2, energy: .9 }, { at: 95.6, energy: .5 }, { at: 99.4, energy: 0 },
    ],
    cues: [
      { at: .9, type: 'plip' }, { at: 1.7, type: 'plip' }, { at: 2.6, type: 'whoosh' }, { at: 15.6, type: 'plip' }, { at: 16.4, type: 'plip' },
      { at: 17.0, type: 'ding' }, { at: 21.6, type: 'plip' }, { at: 25.6, type: 'plip' }, { at: 26.2, type: 'plip' }, { at: 26.8, type: 'plip' },
      { at: 27.5, type: 'ding' }, { at: 28.8, type: 'gulp' }, { at: 39.9, type: 'ding' }, { at: 40.0, type: 'whoosh' }, { at: 48.6, type: 'pop' },
      { at: 54.0, type: 'whoosh' }, { at: 54.3, type: 'pop' }, { at: 59.2, type: 'whoosh' }, { at: 59.5, type: 'pop' }, { at: 64.3, type: 'bonk' },
      { at: 65.8, type: 'scratch' }, { at: 66.6, type: 'scratch' }, { at: 67.6, type: 'ding' }, { at: 75.8, type: 'whoosh' }, { at: 80.0, type: 'scratch' },
      { at: 83.0, type: 'scratch' }, { at: 85.9, type: 'pop' }, { at: 87.0, type: 'plip' }, { at: 89.0, type: 'whoosh' }, { at: 94.2, type: 'ding' },
    ],
  },
});
