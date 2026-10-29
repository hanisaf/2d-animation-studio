// Scene 48c: The Trolls · Who's Inside?, a third take on the finale of The Trolls series (scenes 45–47), for a song not made yet.
// Until there is a recording, a placeholder score is synthesized from `music` below, on the same 120 bpm grid as scene.js, so the
// riddles, the drumrolls and the POPs can be previewed. To use a song instead, save it as audio.mp3 here and add `audio: 'audio.mp3'`.
// The costumes are Alma's real drawing, cut out by ../scene48b_guess_who/costumes/cut.py (crayon stand-ins are drawn without them).
const W48C_R0 = i => 12 + 20 * i;                // riddle i starts here (keep in step with S_R and RL in scene.js)
asset({
  title: "The Trolls · Who's Inside?",
  logline: 'The finale of The Trolls as seven riddles. One at a time, seven of Alma\'s monsters take the stage, with nothing at all to give away who is inside. Each sings the audience a tongue-twister riddle, told on screen in picture cards (a soccer ball and a grass block, a disco ball and a crayon, a stethoscope and a broccoli), gives them two beats to guess, then POP: the costume flies off, and the follow-up twister says who it was while they show off. Danny, Alma, Housam, Jenna, Sarah, then the twins: Doctor Sami, and Professor Safadi. Then everyone dances, and the empty costumes bounce over their heads.',
  files: ['scene.js'],                           // the costumes, the stage, the picture clues and the shots
  docs: 'README.md',                             // synopsis, the riddles and their lyrics, section map, notes for editing
  music: {
    prompt: 'Placeholder for timing only (see gemini/PROMPT.md for the song). A bouncy game-show pop groove at 120 bpm: a sting as each monster drops in, a riddle verse that doubles its pace on the repeat, a snare drumroll for the guess, a POP and a cheer for each reveal, and a big dance-party finale.',
    bpm: 120, tonic: 60, motif: [0, 4, 7, 4, 9, 7, 4, 2], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .45 }, { at: 6, energy: .6 },
      ...Array.from({ length: 7 }, (_, i) => [
        { at: W48C_R0(i), energy: .55 }, { at: W48C_R0(i) + 6, energy: .8 }, { at: W48C_R0(i) + 10, energy: .2 }, { at: W48C_R0(i) + 12, energy: .95 }, { at: W48C_R0(i) + 15.5, energy: .7 },
      ]).flat(),
      { at: 152, energy: .6 }, { at: 156, energy: .85 }, { at: 160, energy: 1 }, { at: 174, energy: .5 }, { at: 179, energy: .05 },
    ],
    cues: [
      { at: 4.6, type: 'ding' },
      ...Array.from({ length: 7 }, (_, i) => [
        { at: W48C_R0(i) + .1, type: 'whoosh' }, { at: W48C_R0(i) + .45, type: 'bonk' },
        { at: W48C_R0(i) + 10, type: 'drumroll', dur: 2 }, { at: W48C_R0(i) + 12, type: 'pop' }, { at: W48C_R0(i) + 12.1, type: 'applause', dur: 2.5, level: .7 },
        { at: W48C_R0(i) + 13.1, type: 'ding' }, { at: W48C_R0(i) + 13.6, type: 'ding' }, { at: W48C_R0(i) + 14.1, type: 'ding' },
        { at: W48C_R0(i) + 19.5, type: 'whoosh' },
      ]).flat(),
      ...Array.from({ length: 7 }, (_, i) => ({ at: 156 + .5 * i, type: 'pop' })),
      { at: 156.5, type: 'applause', dur: 4, level: 1 }, { at: 174.3, type: 'ding' }, { at: 174.4, type: 'applause', dur: 4, level: 1 },
    ],
  },
  refs: ['../scene48b_guess_who/costumes/pumpkin.png', '../scene48b_guess_who/costumes/pink_ghost.png', '../scene48b_guess_who/costumes/bird.png', '../scene48b_guess_who/costumes/bee.png',
    '../scene48b_guess_who/costumes/cat.png', '../scene48b_guess_who/costumes/owl.png', '../scene48b_guess_who/costumes/bat.png'],
  cast: ['danny', 'alma', 'housam', 'jenna', 'sarah', 'sami', 'safadi'],
  locations: [],
});
