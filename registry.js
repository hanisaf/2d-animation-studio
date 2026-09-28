// registry.js: which asset folders exist, and the default movie order. ADD NEW ASSETS HERE (or use scripts/new.sh).
//
// Every asset is a self-contained folder with an asset.js manifest (title, logline, code files, docs, reference art…),
// its code, its README.md and its reference art:
//   characters/<id>/   a character rig (+ its skills and props) · registers itself on CHARACTERS
//   locations/<id>/    a 3D set · registers itself on LOCATIONS
//   scenes/<id>/       a scene (shots, script, storyboard, optional audio) · calls scene({...})
// Folders load in this order: characters → locations → scenes, so scenes may use any character or location.

const REGISTRY = {
  characters: ['jester_fester', 'princess_pearl', 'safadi', 'alma', 'dragon', 'housam'],
  locations: ['throne_room', 'dces', 'lecture_hall'],
  scenes: ['scene01_juggling', 'scene02_fired', 'scene03_once_a_dragon', 'scene04_healthy_promise', 'scene05_dragon_counts', 'scene06_riemann', 'scene07_message_first', 'scene08_multitasking'],
  movie: ['scene01_juggling', 'scene02_fired', 'scene03_once_a_dragon', 'scene04_healthy_promise', 'scene05_dragon_counts', 'scene06_riemann', 'scene07_message_first', 'scene08_multitasking'],        // default composer order and node render.mjs --movie
};
