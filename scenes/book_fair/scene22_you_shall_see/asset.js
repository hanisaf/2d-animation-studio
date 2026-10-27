// scenes/book_fair/scene22_you_shall_see/asset.js: what this folder contains (read by the studio and the renderer).
// A music video for the whole cast: the song (audio.mp3, generated with Gemini from SONG.md) is the soundtrack and every
// character's voice, so there is no synthesized music or dialogue. The word timings in lyrics.js and the beat grid
// (117.46 BPM, first beat 0.058 s) were measured from the recording; scene.js reads its beats from them.
asset({
  title: 'You Shall See',
  logline: 'The DCES Book Fair, judged by Princess Pearl, who has never laughed. Safadi, Sami, Dragon and Robo-Safadi all get "…Next." Then the kids\' secret plan: Jester Fester reads his memoir while Danny waits up the ladder with a juggling ball for one word. "Allow me to EXPLAIN—" BONK. Pearl laughs. Fester is HIRED. "Somebody… find me… ANOTHER PROFESSOR."',
  files: ['props.js', 'lyrics.js', 'scene.js'],       // props + backdrops, the song and karaoke, then the shots
  docs: 'README.md',                                  // synopsis, song map, shot list
  audio: 'audio.mp3',                                 // "You Shall See" (183 s)
  cast: ['safadi', 'princess_pearl', 'jester_fester', 'housam', 'alma', 'jenna', 'danny', 'sami', 'dragon', 'robo_safadi', 'clawd'],
  locations: ['school_library'],
});
