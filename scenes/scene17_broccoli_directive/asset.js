// scenes/scene17_broccoli_directive/asset.js: what this folder contains (read by the studio and the renderer).
// A music video: the song (audio.mp3) is the soundtrack and Robo-Safadi's voice, so there is no synthesized music or dialogue.
// The lyric timings in lyrics.js and the beat grid in scene.js (bpm 125.98, offset 0.104 s) were measured from the song.
asset({
  title: 'The Broccoli Directive',
  logline: 'Halloween night. Robo-Safadi locks on to four trick-or-treaters, chases Housam, Alma, Jenna and Danny one by one, swaps every candy for broccoli, then catches the Safadi twins with their hands in the candy bowl. "EVERYBODY EATS BROCCOLI."',
  files: ['halloween.js', 'lyrics.js', 'scene.js'],   // backdrops + props, the karaoke, then the shots
  docs: 'README.md',                                   // synopsis, lyric map, shot list
  audio: 'audio.mp3',                                  // "The Broccoli Directive" (117 s)
  cast: ['robo_safadi', 'housam', 'alma', 'jenna', 'danny', 'safadi', 'sami'],
  locations: [],                                       // motion-graphics backdrops, no set
});
