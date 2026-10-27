// Scene 21c: The Book Fair. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// Student lines use speaker 'student' plus `who` (which student: 's0'…'s11') for the bubble. A `group` lists anchors
// (a student id or a character id) for one shared bubble; the other voices in it are silentBubble entries.
asset({
  title: 'The Book Fair',
  logline: 'The book fair opens in the library. Students rush past Professor Safadi\'s stand to grab the kids\' coloring flip books. At story time, Alma tells Fester\'s stories while Safadi explains the Riemann hypothesis to three dozing students (and a snoring Sami). The kids sell out; Safadi sells nothing, and is proud anyway. Alma wishes Pearl and Fester were real. "We can always imagine."',
  files: ['props.js', 'scene.js'],              // the stands, the boards, the story clouds; then the shots
  uses: ['scene21b_dolphin_royalty'],           // the dry* book covers and story pops
  docs: 'README.md',
  cast: ['safadi', 'sami', 'alma', 'jenna', 'housam', 'danny', 'student', 'jester_fester', 'princess_pearl'],
  locations: ['school_library', 'throne_room'],
  dialogue: [
    // the stands
    { at: 1.0, speaker: 'safadi', text: 'Welcome to the *book fair*! *Professor Safadi Explains...* everything!', cps: 20, hold: .3, energy: 1.15 },
    { at: 5.4, speaker: 'sami', text: 'Signed by the author... *and* his twin!', cps: 18, hold: .4 },
    { at: 8.6, speaker: 'jenna', text: '*Dolphin Royalty!* Coloring flip books!', cps: 17, hold: .3, energy: 1.15 },
    { at: 11.6, speaker: 'danny', text: 'Each one comes with a *mini poster*!', cps: 17, hold: .4, energy: 1.1 },
    { at: 14.6, speaker: 'housam', text: 'Here they come!', cps: 14, hold: .5, energy: 1.2 },
    // the rush
    { at: 20.2, speaker: 'student', who: 's3', text: 'Coloring books!', cps: 14, hold: .3, energy: 1.2 },
    { at: 21.8, speaker: 'student', who: 's5', text: 'Is that a *dolphin princess*?', cps: 16, hold: .3 },
    { at: 24.0, speaker: 'student', who: 's1', text: 'I want *two*!', cps: 13, hold: .5, energy: 1.25 },
    { at: 26.4, speaker: 'student', who: 's10', text: 'Hmm... *mathematics*.', cps: 12, hold: .5, energy: .8 },
    { at: 29.0, speaker: 'safadi', text: 'An *excellent* choice!', cps: 15, hold: .6, energy: 1.1 },
    // story time
    { at: 31.6, speaker: 'alma', text: 'Story time! Who wants a story from *Dolphin Royalty*?', cps: 18, hold: .3, energy: 1.2 },
    { at: 35.0, speaker: 'student', who: 's4', text: 'MEEE!', cps: 10, hold: .5, kind: 'shout', energy: 1.4, group: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'] },
    { at: 36.4, speaker: 'safadi', text: 'Story time here too! Gather round for... *mathematics*!', cps: 19, hold: .4 },
    // story one: juggling in the throne room
    { at: 41.0, speaker: 'alma', text: 'Once upon a time, in a royal throne room, lived... *Jester Fester*!', cps: 18, hold: .3 },
    { at: 46.0, speaker: 'alma', text: '"I\'m Jester Fester... and this is the *story of my life*!"', cps: 17, hold: .3, energy: 1.15 },
    { at: 50.5, speaker: 'alma', text: 'He threw the balls up high... and they got stuck in the *chandelier*!', cps: 19, hold: .2 },
    { at: 55.0, speaker: 'alma', text: 'Then... BONK! BONK! BONK!', cps: 12, hold: .3, energy: 1.3 },
    { at: 57.8, speaker: 'student', who: 's2', text: 'HA HA HA!', cps: 10, hold: .6, kind: 'shout', energy: 1.3, group: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'] },
    // Safadi's lesson (from scene 06)
    { at: 60.0, speaker: 'safadi', text: "Let's start with *prime numbers*: two, three, five, seven...", cps: 19, hold: .4 },
    { at: 64.4, speaker: 'safadi', text: 'Their rhythm is *uneven*. Can we predict the *overall pattern*?', cps: 19, hold: .4 },
    { at: 69.0, speaker: 'safadi', text: 'Riemann studied it with a mathematical machine called *zeta*...', cps: 19, hold: .4 },
    { at: 73.4, speaker: 'safadi', text: 'The interesting zeros live in a *strip*... on the line *one-half*!', cps: 19, hold: .5 },
    { at: 78.0, speaker: 'sami', text: 'Zzz... *snrrk*... zzz...', cps: 10, hold: .4, kind: 'whisper', energy: .5 },
    // story two: fired!
    { at: 80.0, speaker: 'alma', text: 'One day, *Princess Pearl* was *sooo* bored...', cps: 16, hold: .3 },
    { at: 83.6, speaker: 'alma', text: '"Why did the chicken cross the road?"', cps: 16, hold: .3, energy: 1.15 },
    { at: 86.6, speaker: 'alma', text: '"...*why*?"', cps: 8, hold: .3, energy: .6 },
    { at: 88.0, speaker: 'alma', text: '"To get to the *other side*!"', cps: 15, hold: .6, energy: 1.2 },
    { at: 90.6, speaker: 'alma', text: '"Fester... you\'re *FIRED*!"', cps: 13, hold: .5, kind: 'shout', energy: 1.35 },
    { at: 92.8, speaker: 'student', who: 's6', text: 'Ohhhh!', cps: 8, hold: .3, energy: 1.1, group: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'] },
    { at: 94.2, speaker: 'alma', text: 'And Fester sighed... "*story of my life*."', cps: 15, hold: .5, energy: .85 },
    { at: 97.6, speaker: 'student', who: 's0', text: 'Again! Again!', cps: 12, hold: .6, kind: 'shout', energy: 1.3, group: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'] },
    // Safadi's ending
    { at: 100.0, speaker: 'safadi', text: '...and *that* is the Riemann hypothesis! Any questions?', cps: 19, hold: .5, energy: 1.15 },
    { at: 105.0, speaker: 'safadi', text: '...Sami?', cps: 9, hold: .3, energy: .8 },
    { at: 106.2, speaker: 'sami', text: "I'm awake! Prime! *Zeta!*", cps: 16, hold: .5, kind: 'shout', energy: 1.35 },
    // the sale
    { at: 109.0, speaker: 'jenna', text: 'Books for sale! Get them while they *last*!', cps: 18, hold: .3, energy: 1.2 },
    { at: 117.4, speaker: 'danny', text: "We're... *SOLD OUT*!", cps: 12, hold: .4, kind: 'shout', energy: 1.4 },
    { at: 119.6, speaker: 'housam', text: 'Every *single* book!', cps: 14, hold: .5, energy: 1.25 },
    { at: 125.0, speaker: 'safadi', text: 'Not... a single book.', cps: 9, hold: .6, energy: .6 },
    // proud
    { at: 131.4, speaker: 'safadi', text: 'Children... I am *so proud* of you.', cps: 14, hold: .5, energy: .95 },
    { at: 135.0, speaker: 'safadi', text: 'You *read* books... and now you *write* books!', cps: 16, hold: .5, energy: 1.15 },
    { at: 139.0, speaker: 'housam', text: 'HOORAY!', cps: 10, hold: .6, kind: 'shout', energy: 1.4, group: ['housam', 'jenna', 'danny'] },
    { at: 139.0, speaker: 'jenna', text: 'HOORAY!', cps: 10, hold: .6, energy: 1.4, silentBubble: true },
    { at: 139.0, speaker: 'danny', text: 'HOORAY!', cps: 10, hold: .6, energy: 1.4, silentBubble: true },
    { at: 142.0, speaker: 'safadi', text: 'Alma, what is going on? You were the *star writer*. Why are you sad?', cps: 17, hold: .5, energy: .8 },
    { at: 148.0, speaker: 'alma', text: 'I just wish Princess Pearl and Jester Fester were *real*...', cps: 15, hold: .6, energy: .7 },
    { at: 153.0, speaker: 'safadi', text: 'We can always *imagine*.', cps: 12, hold: 1.2, energy: .85 },
  ],
  music: {
    prompt: 'A bright book-fair march with a busy crowd hum: a bell and a whoosh as the doors open, a stampede of footsteps, a twinkly storybook waltz for Alma\'s tales (bonks on the bonks, crickets after the chicken joke), a slow sleepy bassoon-like drone under Safadi\'s math with snores, a cash-register flurry for the sale, a lonely cricket at the empty stand, then a warm, tender theme for "I am so proud of you" and a soft music-box sting into the to-be-continued.',
    bpm: 108, tonic: 60, motif: [0, 4, 7, 12, 9, 7, 4, 2], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .55 }, { at: 14.4, energy: .9 }, { at: 20.0, energy: .75 }, { at: 26.0, energy: .45 }, { at: 31.6, energy: .6 },
      { at: 41.0, energy: .55 }, { at: 55.0, energy: .8 }, { at: 60.0, energy: .25 }, { at: 73.4, energy: .12 }, { at: 80.0, energy: .55 },
      { at: 88.6, energy: .15 }, { at: 90.6, energy: .8 }, { at: 94.2, energy: .35 }, { at: 97.6, energy: .8 }, { at: 100.0, energy: .2 },
      { at: 106.2, energy: .6 }, { at: 109.0, energy: .9 }, { at: 117.4, energy: 1 }, { at: 122.0, energy: .1 }, { at: 128.0, energy: .3 },
      { at: 131.4, energy: .45 }, { at: 139.0, energy: .85 }, { at: 141.0, energy: .2 }, { at: 153.0, energy: .45 }, { at: 158.0, energy: .7 },
      { at: 159.4, energy: .35 }, { at: 163.4, energy: 0 },
    ],
    cues: [
      { at: 14.4, type: 'ding' }, { at: 14.6, type: 'whoosh' }, { at: 42.0, type: 'whoosh' }, { at: 47.0, type: 'pop' }, { at: 52.6, type: 'ding' },
      { at: 55.8, type: 'bonk' }, { at: 56.4, type: 'bonk' }, { at: 57.0, type: 'bonk' }, { at: 62.0, type: 'plip' }, { at: 66.0, type: 'plip' },
      { at: 70.0, type: 'plip' }, { at: 75.0, type: 'plip' }, { at: 89.0, type: 'cricket' }, { at: 90.7, type: 'whoosh' }, { at: 98.0, type: 'pop' },
      { at: 106.2, type: 'whistle' }, { at: 112.0, type: 'ding' }, { at: 113.0, type: 'ding' }, { at: 114.0, type: 'ding' }, { at: 115.0, type: 'ding' },
      { at: 116.0, type: 'ding' }, { at: 117.4, type: 'pop' }, { at: 122.6, type: 'cricket' }, { at: 139.0, type: 'pop' }, { at: 155.4, type: 'pop' },
      { at: 158.0, type: 'ding' },
    ],
  },
});
