asset({
  title: 'Dr. Sami: When Should CRRT Start?',
  logline: 'A board-style ICU AKI question, a deliberate pause, and an evidence-based lesson on when to defer renal replacement therapy.',
  files: ['scene.js'], docs: 'README.md', cast: ['sami'], locations: ['lecture_hall'],
  dialogue: [
    { at: .7, speaker: 'sami', text: 'A 64-year-old man with diabetic CKD has *septic shock* from pneumonia.', cps: 25, hold: 1.8 },
    { at: 7.2, speaker: 'sami', text: 'He is ventilated and on *norepinephrine*.', cps: 24, hold: 2.0 },
    { at: 14.7, speaker: 'sami', text: 'In 36 hours, creatinine rises from *1.4 to 3.9*.', cps: 24, hold: 1.8 },
    { at: 21.0, speaker: 'sami', text: 'He has been *oliguric for 12 hours*.', cps: 24, hold: 2.0 },
    { at: 28.7, speaker: 'sami', text: 'Potassium 5.1. Bicarbonate 19. pH 7.31. BUN 68.', cps: 25, hold: 1.7 },
    { at: 35.0, speaker: 'sami', text: 'Four liters positive, but oxygenating on *FiO2 0.40*.', cps: 24, hold: 1.8 },
    { at: 42.7, speaker: 'sami', text: 'The ICU asks: *should we start CRRT now?*', cps: 23, hold: 2.0 },
    { at: 49.0, speaker: 'sami', text: 'Read A, B, and C carefully.', cps: 22, hold: 2.0 },
    { at: 56.7, speaker: 'sami', text: 'Now D and E. Which recommendation is best?', cps: 22, hold: 2.2 },
    { at: 76.5, speaker: 'sami', text: 'The answer is *C*.', cps: 20, hold: 1.8 },
    { at: 80.5, speaker: 'sami', text: 'Defer RRT, monitor closely, and start if an urgent indication develops.', cps: 25, hold: 2.0 },
    { at: 88.7, speaker: 'sami', text: 'Severe AKI alone is *not an urgent indication*.', cps: 23, hold: 1.8 },
    { at: 94.5, speaker: 'sami', text: 'There is no refractory potassium, severe acidosis, hypoxemic edema, or uremia.', cps: 27, hold: 1.5 },
    { at: 102.7, speaker: 'sami', text: 'STARRT-AKI found about *44% mortality in both groups*.', cps: 24, hold: 1.8 },
    { at: 108.8, speaker: 'sami', text: 'Accelerated treatment caused more adverse events and RRT dependence.', cps: 26, hold: 1.5 },
    { at: 116.7, speaker: 'sami', text: 'Thirty-eight percent of standard-arm patients *never needed RRT*.', cps: 25, hold: 1.6 },
    { at: 122.5, speaker: 'sami', text: 'AKIKI, IDEAL-ICU, and the Gaudry meta-analysis agree: no survival benefit.', cps: 27, hold: 1.2 },
    { at: 128.7, speaker: 'sami', text: 'ELAIN was a single-center result that larger trials did not reproduce.', cps: 26, hold: 1.3 },
    { at: 134.6, speaker: 'sami', text: 'Modality does not answer timing. If needed on pressors, CRRT is usually favored.', cps: 27, hold: 1.1 },
    { at: 142.5, speaker: 'sami', text: 'Do not wait forever. *AKIKI-2* found no benefit to further delay.', cps: 24, hold: 1.5 },
    { at: 148.2, speaker: 'sami', text: 'A furosemide response predicts risk; it never guarantees dialysis-free recovery.', cps: 27, hold: 1.2 }
  ],
  music: {
    prompt: 'Restrained clinical quiz music with warm marimba, soft pulse, a silent-feeling suspense gap, and a clear resolving chime.',
    bpm: 88, tonic: 60, motif: [0, 2, 4, 2, 7, 4], chords: [0, 5, 3, 4],
    sections: [{at:0,energy:.14},{at:42,energy:.2},{at:68,energy:.035},{at:76,energy:.24},{at:102,energy:.15},{at:142,energy:.1},{at:152,energy:.04}],
    cues: [{at:76.2,type:'ding'},{at:102.3,type:'plip'},{at:152,type:'ding'}]
  }
});
