// scenes/talent_show/scene26_perfect_drop/asset.js: what this folder contains (read by the studio and the renderer).
// A music video, the finale of the competition arc (scenes 23–25). The song (song.mp3, generated with Gemini) is the soundtrack
// and Princess Pearl's voice, so there is no synthesized music or dialogue. audio.mp3 is the song plus the teaser's sound
// effects after it (the thud, the drips, the splash, Neptune's cartoon voice) and a re-sung "Hussam" (fix_housam.py), mixed by mix_audio.py.
// The word timings in lyrics.js and the beat grid (115 BPM, first beat 0.365 s) were measured from the recording.
asset({
  title: 'The Perfect Drop',
  logline: 'The finale of the talent show: Princess Pearl, the judge who is never dazzled, takes the mic and sings "The Perfect Drop" while the kids replay their winning tricks, Professor Safadi explains why there are no shortcuts, and Fester shreds a guitar solo (until a ball finds his head). On "MIC DROP!" she drops the mic and the music stops dead. In the silence, a puddle… and Neptune rises out of it, picks up the mic: "KING Neptune is in the house!" THE END.',
  files: ['props.js', 'lyrics.js', 'scene.js'],       // props, the song and karaoke, then the shots
  uses: ['scene22_you_shall_see', 'scene24_competition_begins', 'scene25_cube_drops'], // the ys* effects, the cb* judges' furniture, the cd* cube and trophy
  docs: 'README.md',                                  // synopsis, song map, shot list
  audio: 'audio.mp3',                                 // "The Perfect Drop" (149.8 s) + the coda's sound (to 160.6 s)
  cast: ['princess_pearl', 'jenna', 'alma', 'housam', 'danny', 'safadi', 'sami', 'jester_fester', 'dragon', 'robo_safadi', 'clawd', 'neptune', 'student'],
  locations: ['school_gym'],
});
