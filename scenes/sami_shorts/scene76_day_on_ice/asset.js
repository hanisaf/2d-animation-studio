asset({
  title: 'A Day on the Ice',
  logline: 'Sami takes his daughter Jenna and her plush giraffe Fafy ice-skating. Jenna finds her balance, shows her tricks, and encourages Dad to try.',
  files: ['scene.js'], docs: 'README.md', cast: ['sami', 'jenna'], locations: ['living_room'],
  music: {
    prompt: 'Warm family cartoon: gentle bell melody and soft chords at home, sparkling playful skating music for the glide, jump and spin, and a tender cheerful finish. Quiet under the dialogue.',
    bpm: 108, tonic: 62, motif: [0, 2, 4, 7, 9, 7, 4, 2], chords: [0, 3, 4, 0],
    sections: [{ at: 0, energy: .28 }, { at: 21, energy: .35 }, { at: 33, energy: .66 }, { at: 43, energy: .78 }, { at: 49, energy: .3 }, { at: 65, energy: .55 }, { at: 68, energy: .1 }],
    cues: [{ at: 17, type: 'pop' }, { at: 40.5, type: 'whoosh' }, { at: 41.5, type: 'ding' }, { at: 48, type: 'ding' }],
  },
  dialogue: [
    { at: 1.5, speaker: 'sami', text: 'Jenna, shall we go ice-skating?', cps: 20, hold: 1.7 },
    { at: 6, speaker: 'jenna', text: 'Yes! Can Fafy come?', cps: 20, hold: 1.8 },
    { at: 10.5, speaker: 'sami', text: 'Of course! Fafy is family.', cps: 20, hold: 1.7 },
    { at: 16, speaker: 'jenna', text: "Jacket on. I'm ready!", cps: 20, hold: 1.6 },
    { at: 22, speaker: 'sami', text: 'I feel wobbly!', cps: 20, hold: 1.7 },
    { at: 26, speaker: 'jenna', text: "Keep practicing. You'll get the hang of it!", cps: 21, hold: 2 },
    { at: 50, speaker: 'sami', text: 'Good job, Jenna! You rock!', cps: 20, hold: 1.8 },
    { at: 55, speaker: 'sami', text: "As for me... I'm too old for those tricks.", cps: 21, hold: 1.7 },
    { at: 60.5, speaker: 'jenna', text: "You're not too old, Dad! Try your best!", cps: 21, hold: 2 },
  ],
});
