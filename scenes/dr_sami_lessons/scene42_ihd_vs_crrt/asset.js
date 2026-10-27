asset({
  title: 'Dr. Sami: iHD or CRRT in Shock?',
  logline: 'A board-style ICU question on initial RRT modality, the 2026 ICRAKI findings, and when CRRT has a physiologic advantage.',
  files: ['scene.js'], docs: 'README.md', cast: ['sami'], locations: ['lecture_hall'],
  dialogue: [
    { at:.7, speaker:'sami', text:'A 64-year-old man is in *septic shock* on norepinephrine.', cps:24, hold:2 },
    { at:7.1, speaker:'sami', text:'He develops *oligoanuric acute kidney injury*.', cps:23, hold:2 },
    { at:14.7, speaker:'sami', text:'This time, he has a clear *indication for RRT*.', cps:23, hold:2 },
    { at:21.0, speaker:'sami', text:'The timing question is settled. Now choose the initial modality.', cps:25, hold:1.7 },
    { at:28.7, speaker:'sami', text:'Intermittent hemodialysis—or continuous renal replacement therapy?', cps:24, hold:1.7 },
    { at:35.1, speaker:'sami', text:'Does that choice affect outcome?', cps:21, hold:2.1 },
    { at:42.7, speaker:'sami', text:'Read A, B, and C carefully.', cps:22, hold:2 },
    { at:49.0, speaker:'sami', text:'Look for the statement that matches the newest randomized evidence.', cps:25, hold:1.5 },
    { at:56.7, speaker:'sami', text:'Now D and E. Which statement is most accurate?', cps:22, hold:2.1 },
    { at:76.5, speaker:'sami', text:'The answer is *B*.', cps:20, hold:1.8 },
    { at:80.4, speaker:'sami', text:'ICRAKI found iHD was not noninferior and had higher 90-day mortality.', cps:25, hold:1.8 },
    { at:88.7, speaker:'sami', text:'This was a multicenter noninferiority trial of *554 critically ill adults*.', cps:26, hold:1.5 },
    { at:95.0, speaker:'sami', text:'MAKE90 was 78.1 percent with iHD versus 71.6 percent with CRRT.', cps:25, hold:1.5 },
    { at:102.7, speaker:'sami', text:'Ninety-day mortality was *63.1 versus 53.5 percent*.', cps:24, hold:1.8 },
    { at:109.1, speaker:'sami', text:'The hazard ratio was 1.30, with a 95 percent confidence interval of 1.04 to 1.63.', cps:27, hold:1.1 },
    { at:116.7, speaker:'sami', text:'Older trials suggested similar mortality and kidney recovery.', cps:24, hold:1.7 },
    { at:122.4, speaker:'sami', text:'ICRAKI challenged that older equivalence paradigm.', cps:23, hold:1.7 },
    { at:128.7, speaker:'sami', text:'Prior evidence never showed that iHD was superior.', cps:23, hold:1.8 },
    { at:134.3, speaker:'sami', text:'And CRRT is generally *preferred*, not contraindicated, during instability.', cps:26, hold:1.3 },
    { at:142.5, speaker:'sami', text:'Faster iHD shifts can worsen osmotic disequilibrium and cerebral edema.', cps:26, hold:1.4 },
    { at:148.3, speaker:'sami', text:'In shock or acute brain injury, modality choice can matter.', cps:24, hold:1.5 }
  ],
  music:{
    prompt:'Restrained medical quiz underscore with warm marimba, low pulse, a suspenseful quiet pause, and a confident resolving chime.',
    bpm:88, tonic:57, motif:[0,3,5,3,7,5], chords:[0,5,3,4],
    sections:[{at:0,energy:.14},{at:42,energy:.2},{at:68,energy:.035},{at:76,energy:.25},{at:88,energy:.16},{at:142,energy:.1},{at:152,energy:.04}],
    cues:[{at:76.2,type:'ding'},{at:102.3,type:'plip'},{at:152,type:'ding'}]
  }
});
