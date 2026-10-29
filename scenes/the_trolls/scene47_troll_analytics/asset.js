// Scene 47: Troll Analytics. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// `tag` marks the lines scene.js times its action to (the letter, the two laptop inserts, the drawing, the idea).
asset({
  title: 'Troll Analytics',
  logline: 'In his study Professor Safadi reads a fan letter to Doctor Sami ("It is so heartening to receive fan mail." "So we have many fans?"), then opens his YouToon analytics: 21 views. "So we have a handful of fans?" He scrolls on, and the Tongue Twister videos have millions. "People these days like silly things." "Let us double down on silliness!" The plan: Alma\'s monster drawings, monster costumes, and tongue-twister challenges at school. "That is the silliest thing I heard in ages!" "Exactly." To be continued…',
  files: ['scene.js'],                          // the shots, the letter and drawing props, the YouToon Studio screens
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  refs: ['fan_letter.webp', 'alma_monsters.jpg', 'reference_analytics.webp'],   // the real fan letter and Alma's drawing appear in the video
  cast: ['safadi', 'sami'],
  locations: ['safadi_study'],
  dialogue: [
    { at: 15.3, speaker: 'safadi', text: 'It is so *heartening* to receive fan mail.', cps: 15, hold: 0.5, tag: 'mail' },
    { at: 19.0, speaker: 'sami', text: 'So we have *many* fans?', cps: 13, hold: 0.5, tag: 'many', energy: 1.1 },
    { at: 27.6, speaker: 'sami', text: 'So we have a... *handful* of fans?', cps: 12, hold: 0.6, tag: 'handful', energy: 0.7 },
    { at: 39.7, speaker: 'safadi', text: 'Brother, for some reason the *silly* videos are doing very well.', cps: 16, hold: 0.5, tag: 'silly' },
    { at: 44.6, speaker: 'sami', text: 'People these days like *silly* things.', cps: 14, hold: 0.5 },
    { at: 48.3, speaker: 'safadi', text: 'Let us *double down* on silliness!', cps: 13, hold: 0.5, tag: 'double', energy: 1.2 },
    { at: 51.8, speaker: 'sami', text: 'I agree. What is the *plan*?', cps: 13, hold: 0.5, tag: 'plan' },
    { at: 56.2, speaker: 'safadi', text: '*Alma* drew these monsters.', cps: 13, hold: 0.5, tag: 'monsters' },
    { at: 61.9, speaker: 'sami', text: 'They are *cute*... and *silly*.', cps: 12, hold: 0.6, tag: 'cute' },
    { at: 67.9, speaker: 'safadi', text: 'Imagine we wear these *monster costumes*, go to school and challenge kids to *tongue twisters*!', cps: 17, hold: 0.6, tag: 'imagine', energy: 1.1 },
    { at: 74.5, speaker: 'sami', text: 'That is the *silliest* thing I heard in ages!', cps: 14, hold: 0.6, tag: 'silliest', energy: 1.2 },
    { at: 78.8, speaker: 'safadi', text: '*Exactly.*', cps: 5, hold: 0.8, tag: 'exactly', energy: 0.8 },
  ],
  music: {
    prompt: 'A warm, slightly melancholy fireside waltz on celesta and soft strings while the professor reads a fan letter, a hopeful lift as the laptop opens, a deflating slide and crickets at "21 views", a ticking scroll that builds into a triumphant game-show fanfare with dings and applause when the Tongue Twister videos show millions of views, a sneaky pizzicato plan, a harp for Alma\'s monster drawing, a bright ding for the idea, and a sly two-note sting into to be continued.',
    bpm: 96, tonic: 57, motif: [0, 4, 7, 12, 11, 7, 4, 2], chords: [0, 5, 3, 4],
    sections: [
      { at: 0.0, energy: .35 }, { at: 15.0, energy: .4 }, { at: 21.9, energy: .55 }, { at: 25.3, energy: .15 }, { at: 27.6, energy: .2 },
      { at: 31.5, energy: .45 }, { at: 36.7, energy: 1 }, { at: 39.3, energy: .6 }, { at: 48.3, energy: .8 }, { at: 51.8, energy: .5 },
      { at: 54.6, energy: .45 }, { at: 59.0, energy: .55 }, { at: 67.9, energy: .75 }, { at: 74.5, energy: .9 }, { at: 78.8, energy: .5 },
      { at: 82.4, energy: .6 }, { at: 88.8, energy: 0 },
    ],
    cues: [
      { at: 2.4, type: 'whoosh' }, { at: 15.0, type: 'plip' }, { at: 21.5, type: 'whoosh' }, { at: 22.0, type: 'pop' },
      { at: 25.3, type: 'bonk' }, { at: 25.8, type: 'cricket' }, { at: 26.5, type: 'cricket' }, { at: 27.2, type: 'cricket' },
      { at: 31.6, type: 'whoosh' }, { at: 32.3, type: 'plip' }, { at: 33.3, type: 'plip' }, { at: 34.3, type: 'plip' }, { at: 35.3, type: 'plip' }, { at: 35.9, type: 'drumroll', dur: .8 },
      { at: 36.8, type: 'ding' }, { at: 37.1, type: 'ding' }, { at: 37.4, type: 'ding' }, { at: 37.5, type: 'applause', dur: 2.2 },
      { at: 48.4, type: 'pop' }, { at: 54.9, type: 'whoosh' }, { at: 55.6, type: 'pop' }, { at: 59.0, type: 'harp' },
      { at: 68.1, type: 'ding' }, { at: 74.6, type: 'pop' }, { at: 78.9, type: 'plip' }, { at: 82.4, type: 'ding' }, { at: 82.8, type: 'ding' },
    ],
  },
});
