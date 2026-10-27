// Scene 16: The Spooky Plan. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
// Robo-Safadi's line is drawn by scene.js on the sketchbook page (no voice; the BZZT and dings are music cues).
asset({
  title: 'The Spooky Plan',
  logline: 'Alma and Jenna plan the spookiest Halloween house on the street; Safadi lectures on candy, and the girls whisper up a robot Safadi with glowing red eyes. "You shall see!" To be continued…',
  files: ['doodles.js', 'scene.js'],            // the sketchbook + doodles, then the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['alma', 'jenna', 'safadi'],            // character ids (the studio links them)
  locations: ['house'],                         // location ids
  dialogue: [
    // the planning
    { at: 3.6, speaker: 'alma', text: 'Halloween is in *one week*!', cps: 17, hold: .6, energy: 1.1 },
    { at: 6.2, speaker: 'jenna', text: 'We need the *spookiest* house on the street!', cps: 18, hold: .5, energy: 1.1 },
    { at: 9.2, speaker: 'alma', text: 'Ghosts! Hiding in the *bushes*!', cps: 17, hold: .5 },
    { at: 12.6, speaker: 'jenna', text: 'Giant *spiders* on the porch!', cps: 17, hold: .5 },
    { at: 15.6, speaker: 'alma', text: 'Black *cats* on the steps!', cps: 17, hold: .4 },
    { at: 18.2, speaker: 'jenna', text: 'Pumpkins! *Lots* of pumpkins!', cps: 17, hold: .4, energy: 1.1 },
    { at: 20.8, speaker: 'alma', text: 'And a *witch*... who crashed into the chimney!', cps: 18, hold: .6 },
    { at: 24.6, speaker: 'jenna', text: 'Hmm... *everybody* has those.', cps: 15, hold: .6, energy: .8 },
    { at: 27.2, speaker: 'alma', text: 'Ooh! A *vampire dolphin*!', cps: 16, hold: .7, kind: 'shout', energy: 1.25 },
    { at: 30.6, speaker: 'jenna', text: 'And a *mummy giraffe*!', cps: 16, hold: .8, energy: 1.2 },
    { at: 34.0, speaker: 'alma', text: 'SPOOKY-CUTE!', cps: 12, hold: .9, kind: 'shout', energy: 1.35, group: ['alma', 'jenna'] },
    { at: 34.0, speaker: 'jenna', text: 'SPOOKY-CUTE!', cps: 12, hold: .9, energy: 1.35, silentBubble: true },
    // the professor
    { at: 38.4, speaker: 'safadi', text: "Good afternoon, ladies! What's going on here?", cps: 18, hold: .5 },
    { at: 41.2, speaker: 'alma', text: "We're planning our *Halloween* decorations!", cps: 18, hold: .5 },
    { at: 43.8, speaker: 'safadi', text: 'Halloween? And why are you so interested in *Halloween*?', cps: 22, hold: .5, energy: .95 },
    { at: 47.0, speaker: 'alma', text: 'CANDY!!!', cps: 10, hold: .8, kind: 'shout', energy: 1.4, group: ['alma', 'jenna'] },
    { at: 47.0, speaker: 'jenna', text: 'CANDY!!!', cps: 10, hold: .8, energy: 1.4, silentBubble: true },
    { at: 48.9, speaker: 'safadi', text: 'Alma... what about your *promise*?', cps: 16, hold: .5, energy: .9 },
    { at: 51.5, speaker: 'alma', text: 'That was for *every day*. Halloween is a *holiday*!', cps: 19, hold: .6 },
    { at: 54.6, speaker: 'safadi', text: 'Ah. May I... *explain* something?', cps: 14, hold: .5, energy: .9 },
    { at: 57.0, speaker: 'jenna', text: 'Uh-oh.', cps: 10, hold: .4, energy: .7 },
    // the lecture
    { at: 58.2, speaker: 'safadi', text: 'Your body is like a car. Food is its *fuel*.', cps: 18, hold: .6 },
    { at: 62.0, speaker: 'safadi', text: 'Fruits and veggies are *super fuel*. But candy...', cps: 18, hold: .3 },
    { at: 65.4, speaker: 'safadi', text: '...a quick *zoom*... then a big *CRASH*.', cps: 16, hold: .6, energy: 1.1 },
    { at: 69.2, speaker: 'safadi', text: 'And sugar feeds the tiny *sugar bugs* on your teeth!', cps: 18, hold: .6 },
    { at: 73.0, speaker: 'alma', text: "Psst... Jenna... I've got the *spookiest* idea.", cps: 17, hold: .4, kind: 'whisper', energy: .45 },
    { at: 75.9, speaker: 'jenna', text: 'Are you thinking what I\'m thinking?', cps: 18, hold: .4, kind: 'whisper', energy: .45 },
    { at: 77.6, speaker: 'safadi', text: 'The key point is *moderation*...', cps: 15, hold: .4 },
    // the cliffhanger
    { at: 87.2, speaker: 'safadi', text: "...What's so funny?", cps: 14, hold: .7, energy: .9 },
    { at: 89.8, speaker: 'alma', text: 'Oh, nothing...', cps: 12, hold: .5, energy: .8, group: ['alma', 'jenna'] },
    { at: 89.8, speaker: 'jenna', text: 'Oh, nothing...', cps: 12, hold: .5, energy: .8, silentBubble: true },
    { at: 91.8, speaker: 'alma', text: 'You *shall* see!', cps: 13, hold: .8, energy: 1.15, group: ['alma', 'jenna'] },
    { at: 91.8, speaker: 'jenna', text: 'You *shall* see!', cps: 13, hold: .8, energy: 1.15, silentBubble: true },
  ],
  music: {
    prompt: 'A sneaky, plucky Halloween underscore: tiptoeing pizzicato bass and celesta in a minor key, a little "wooo" bell on each doodle, a whoosh as Safadi\'s powers switch on, a dry, slow lecture vamp, a hush for the whispers, a robot power-up BZZT and dings on the red eyes, giggly plips, and a sting under "You shall see!" before the to-be-continued hit.',
    bpm: 104, tonic: 60, motif: [5, 2, 4, 5, 3, 2, 0, 1], chords: [5, 3, 4, 5],
    sections: [
      { at: 0, energy: .5 }, { at: 3.4, energy: .35 }, { at: 9.0, energy: .45 }, { at: 24.4, energy: .25 }, { at: 27.0, energy: .55 },
      { at: 34.0, energy: .8 }, { at: 35.6, energy: .35 }, { at: 46.8, energy: .7 }, { at: 48.4, energy: .25 }, { at: 57.6, energy: .4 },
      { at: 65.4, energy: .5 }, { at: 69.0, energy: .3 }, { at: 72.8, energy: .1 }, { at: 79.0, energy: .3 }, { at: 82.0, energy: .7 },
      { at: 85.4, energy: .45 }, { at: 86.8, energy: .1 }, { at: 91.8, energy: .85 }, { at: 93.4, energy: .3 }, { at: 95.4, energy: .9 },
      { at: 96.6, energy: .5 }, { at: 99.4, energy: 0 },
    ],
    cues: [
      { at: 9.7, type: 'whoosh' }, { at: 13.1, type: 'plip' }, { at: 16.1, type: 'scratch' }, { at: 18.7, type: 'pop' }, { at: 19.0, type: 'pop' },
      { at: 19.3, type: 'pop' }, { at: 21.7, type: 'bonk' }, { at: 25.2, type: 'pop' }, { at: 27.9, type: 'ding' }, { at: 31.1, type: 'ding' },
      { at: 34.0, type: 'ding' }, { at: 57.6, type: 'whoosh' }, { at: 58.3, type: 'pop' }, { at: 65.6, type: 'whoosh' }, { at: 67.4, type: 'bonk' },
      { at: 69.2, type: 'pop' }, { at: 82.0, type: 'scratch' }, { at: 82.1, type: 'ding' }, { at: 82.4, type: 'ding' }, { at: 85.8, type: 'plip' },
      { at: 86.3, type: 'plip' }, { at: 86.8, type: 'pop' }, { at: 91.8, type: 'whoosh' }, { at: 92.6, type: 'ding' }, { at: 94.8, type: 'ding' },
      { at: 95.4, type: 'ding' },
    ],
  },
});
