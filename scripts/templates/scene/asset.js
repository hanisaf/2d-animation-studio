// scenes/__NAME__/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: '__TITLE__',
  logline: '<the scene in one line>',
  files: ['scene.js'],                          // the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  audio: 'audio.mp3',                           // optional: drop the soundtrack here
  cast: ['jester_fester'],                      // character ids (the studio links them)
  locations: ['throne_room'],                   // location ids
});
