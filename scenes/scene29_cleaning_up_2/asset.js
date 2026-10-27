// Scene 29: Cleaning Up 2 · The Helping Hands. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'Cleaning Up 2 · The Helping Hands',
  logline: 'Picking up right after Housam\'s "EUREKA!": Alma asks what eureka means. "In old Greece…" In Housam\'s story, Professor Safadi shouts "EUREKA!" in a Greek bathtub: he found the soap. Then Housam\'s real idea: program Robo-Safadi to clean up, and let the LLM decide where the toys go. "Clean up Alma\'s room." The robot swallows every toy into his chest. "Room clean up!" "But my toys are gone!" Professor Safadi comes in: "Wonderful job!" "But we have a small problem… Allow me to explain!" To be continued…',
  files: ['scene.js'],
  uses: ['scene19_if_else_explain', 'scene28_cleaning_up'], // ieEditor and the cu* board games
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['alma', 'housam', 'jenna', 'danny', 'safadi', 'sami', 'robo_safadi', 'clawd'],
  locations: ['alma_bedroom', 'roman_bath'],
  dialogue: [
    // Alma's bedroom, half cleaned up
    { at: 0.8, speaker: 'alma', text: 'What is *eureka*?', cps: 13, hold: .7, energy: 1.0 },
    { at: 3.3, speaker: 'housam', text: 'In old *Greece*...', cps: 10, hold: .9, energy: .85 },
    // Housam's story: the bathhouse
    { at: 12.0, speaker: 'safadi', text: 'EUREKA!', cps: 9, hold: 1.0, kind: 'shout', energy: 1.5 },
    { at: 16.4, speaker: 'sami', text: 'Brother, what did you *find*?', cps: 16, hold: .6, energy: 1.1 },
    { at: 19.3, speaker: 'safadi', text: 'The *soap*!', cps: 10, hold: .9, kind: 'shout', energy: 1.3 },
    // back in the bedroom
    { at: 24.7, speaker: 'housam', text: 'HA HA HA HA!', cps: 12, hold: 1.2, kind: 'shout', energy: 1.3, group: ['jenna', 'danny', 'housam', 'alma'] },
    { at: 24.7, speaker: 'danny', text: 'HA HA HA HA!', cps: 12, hold: 1.2, energy: 1.3, silentBubble: true },
    { at: 24.8, speaker: 'jenna', text: 'HA HA HA HA!', cps: 12, hold: 1.2, energy: 1.2, silentBubble: true },
    { at: 24.9, speaker: 'alma', text: 'HA HA HA HA!', cps: 12, hold: 1.2, energy: 1.2, silentBubble: true },
    // Housam's real idea
    { at: 29.4, speaker: 'alma', text: 'And how about *you*, genius! What did *you* find?', cps: 16, hold: .6, energy: 1.1 },
    { at: 33.2, speaker: 'housam', text: 'We can program *Robo-Safadi* to clean up the room!', cps: 17, hold: .6, energy: 1.2 },
    { at: 37.0, speaker: 'danny', text: "But don't we need to tell it *where* to put the toys?", cps: 17, hold: .6 },
    { at: 41.0, speaker: 'housam', text: 'No need, we let the *LLM* decide!', cps: 16, hold: .6, energy: 1.1 },
    { at: 44.0, speaker: 'jenna', text: "I don't know what the *LLM* is, but this sounds like a *great idea*!", cps: 18, hold: .6, energy: 1.1 },
    { at: 48.5, speaker: 'housam', text: 'I will bring *Robo-Safadi* from my room!', cps: 16, hold: .5, energy: 1.15 },
    // plugged in and programmed
    { at: 63.0, speaker: 'alma', text: "Let us hope it doesn't go *haywire*!", cps: 16, hold: .6, energy: .95 },
    { at: 66.0, speaker: 'housam', text: 'Guaranteed! This is the new *frontier model* with many *guardrails*.', cps: 17, hold: .6, energy: 1.1 },
    { at: 70.6, speaker: 'danny', text: 'Housam, you are a *genius*!', cps: 15, hold: .5, energy: 1.25 },
    { at: 73.0, speaker: 'jenna', text: 'YEAH!', cps: 10, hold: .7, kind: 'shout', energy: 1.35, group: ['jenna', 'danny', 'alma'] },
    { at: 73.0, speaker: 'danny', text: 'YEAH!', cps: 10, hold: .7, energy: 1.35, silentBubble: true },
    { at: 73.0, speaker: 'alma', text: 'YEAH!', cps: 10, hold: .7, energy: 1.35, silentBubble: true },
    // clean-up time
    { at: 75.4, speaker: 'clawd', text: 'Boopy boop!', cps: 9, hold: .6, kind: 'robot', energy: 1.2 },
    { at: 80.6, speaker: 'alma', text: 'Clean up!', cps: 10, hold: .8, kind: 'shout', energy: 1.4 },
    { at: 89.8, speaker: 'robo_safadi', text: 'ROOM CLEAN UP!', cps: 11, hold: .8, kind: 'robot', energy: 1.2 },
    { at: 92.0, speaker: 'alma', text: 'But... my *toys* are gone!', cps: 13, hold: .8, energy: .75 },
    { at: 95.0, speaker: 'housam', text: 'Let us play *Oligarchy*!', cps: 14, hold: .6, kind: 'shout', energy: 1.3, group: ['housam', 'danny'] },
    { at: 95.0, speaker: 'danny', text: 'Let us play *Oligarchy*!', cps: 14, hold: .6, energy: 1.3, silentBubble: true },
    { at: 97.6, speaker: 'jenna', text: 'But Alma is *sad*... Robo-Safadi took her *toys*.', cps: 17, hold: .6, energy: .85 },
    // the professor comes back
    { at: 103.2, speaker: 'safadi', text: 'Ahh, room *cleaned*! Wonderful job!', cps: 16, hold: .6, energy: 1.1 },
    { at: 106.1, speaker: 'housam', text: 'But we have a *small problem*...', cps: 15, hold: .5, energy: .85 },
    { at: 108.8, speaker: 'safadi', text: 'What is it?', cps: 13, hold: .6 },
    { at: 110.6, speaker: 'housam', text: 'Allow me to *explain*!', cps: 13, hold: .8, energy: 1.2 },
  ],
  music: {
    prompt: 'Picks up the clean-up march, then turns storybook: a curious plip on "What is eureka?", a harp glissando into old Greece, a sunny lyre-and-flute bath tune with bubbles, a bright ding and a splash on "EUREKA!", a hurried whoosh as Sami runs in, a ta-da ding on "The soap!", a slippery whoosh and a plop as the soap gets away, a harp glissando back to the bedroom, and a bouncy full-band laugh groove. Then a scheming coding vamp for Housam\'s plan, a hurried whoosh out and a door-and-whoosh back in, clicky typing, a confident lift for the guardrails and a YEAH! hit, boopy beeps as Clawd wakes, a pop as the laptop is unplugged and a clack as it shuts, a ding on Alma\'s "Clean up!", a power-up whoosh, a frantic pop-pop-pop as every toy is sucked into the robot, a bright SHING when the room is spotless, a sad deflated drop for Alma\'s toys, a power-down scratch, a cheeky lift for Oligarchy, a gentle knock and warm cello for Professor Safadi, a hush, and the to-be-continued hit on "Allow me to explain!"',
    bpm: 112, tonic: 62, motif: [0, 4, 7, 9, 7, 4, 2, 4], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .3 }, { at: 3.3, energy: .18 }, { at: 5.6, energy: .1 }, { at: 7.2, energy: .45 }, { at: 9.6, energy: .25 },
      { at: 12.0, energy: .9 }, { at: 13.6, energy: .5 }, { at: 16.4, energy: .3 }, { at: 19.3, energy: .7 }, { at: 21.0, energy: .2 },
      { at: 22.8, energy: .15 }, { at: 24.6, energy: .85 }, { at: 29.4, energy: .35 }, { at: 33.2, energy: .55 }, { at: 37.0, energy: .3 },
      { at: 41.0, energy: .5 }, { at: 48.5, energy: .6 }, { at: 51.6, energy: .45 }, { at: 53.6, energy: .12 }, { at: 54.4, energy: .55 },
      { at: 59.0, energy: .4 }, { at: 63.0, energy: .2 }, { at: 66.0, energy: .55 }, { at: 73.0, energy: .9 }, { at: 74.4, energy: .35 }, { at: 77.4, energy: .25 }, { at: 80.6, energy: .55 },
      { at: 82.6, energy: .8 }, { at: 83.8, energy: 1 }, { at: 89.2, energy: .6 }, { at: 92.0, energy: .1 }, { at: 95.0, energy: .6 },
      { at: 97.6, energy: .15 }, { at: 100.8, energy: .35 }, { at: 106.1, energy: .15 }, { at: 110.6, energy: .6 }, { at: 112.2, energy: .2 },
      { at: 114.2, energy: .9 }, { at: 115.8, energy: .5 }, { at: 120.2, energy: 0 },
    ],
    cues: [
      { at: 1.0, type: 'plip' }, { at: 5.6, type: 'harp' }, { at: 8.0, type: 'pop' }, { at: 8.9, type: 'pop' }, { at: 10.4, type: 'plip' },
      { at: 11.8, type: 'ding' }, { at: 12.0, type: 'splash' }, { at: 14.0, type: 'whoosh' }, { at: 19.1, type: 'ding' }, { at: 19.15, type: 'pop' },
      { at: 21.0, type: 'whoosh' }, { at: 21.9, type: 'splash', level: .6 }, { at: 22.2, type: 'bonk' }, { at: 22.8, type: 'harp' },
      { at: 24.6, type: 'ding' }, { at: 26.6, type: 'pop' }, { at: 27.6, type: 'pop' }, { at: 28.6, type: 'pop' },
      { at: 33.4, type: 'ding' }, { at: 41.2, type: 'plip' }, { at: 51.7, type: 'whoosh' }, { at: 53.8, type: 'cricket' }, { at: 54.4, type: 'whoosh' },
      { at: 58.4, type: 'pop' }, { at: 70.8, type: 'ding' }, { at: 73.0, type: 'ding' }, { at: 75.2, type: 'plip' }, { at: 75.6, type: 'pop' }, { at: 76.0, type: 'plip' },
      { at: 77.9, type: 'pop' }, { at: 78.6, type: 'bonk' }, { at: 79.6, type: 'plip' }, { at: 80.6, type: 'ding' },
      { at: 82.7, type: 'whoosh' }, { at: 83.3, type: 'scratch' },
      { at: 84.1, type: 'pop' }, { at: 84.7, type: 'pop' }, { at: 85.3, type: 'pop' }, { at: 85.8, type: 'pop' }, { at: 86.3, type: 'pop' }, { at: 86.8, type: 'pop' },
      { at: 87.2, type: 'pop' }, { at: 87.6, type: 'pop' }, { at: 88.0, type: 'pop' }, { at: 88.4, type: 'pop' }, { at: 89.1, type: 'bonk' }, { at: 89.3, type: 'ding' },
      { at: 92.4, type: 'bonk' }, { at: 94.4, type: 'scratch' }, { at: 95.2, type: 'pop' }, { at: 100.9, type: 'whoosh' }, { at: 103.4, type: 'ding' },
      { at: 109.4, type: 'plip' }, { at: 110.8, type: 'ding' }, { at: 112.6, type: 'plip' }, { at: 114.2, type: 'ding' }, { at: 114.5, type: 'ding' },
    ],
  },
});
