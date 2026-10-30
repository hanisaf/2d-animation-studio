// scenes/__SERIES__/__NAME__/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: '__TITLE__',
  logline: '<the scene in one line>',
  files: ['scene.js'],                          // the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  audio: 'audio.mp3',                           // optional: drop the soundtrack here
  cast: ['jester_fester'],                      // every character the scene draws (the studio loads them with it)
  locations: ['throne_room'],                   // every location the scene draws
});
