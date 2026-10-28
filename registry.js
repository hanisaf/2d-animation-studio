// registry.js: which asset folders exist, and the default movie order. ADD NEW ASSETS HERE (or use scripts/new.sh).
//
// Every asset is a self-contained folder with an asset.js manifest (title, logline, code files, docs, reference art…),
// its code, its README.md and its reference art:
//   characters/<id>/            a character rig (+ its skills and props) · registers itself on CHARACTERS
//   locations/<id>/             a 3D set · registers itself on LOCATIONS
//   scenes/<series>/<id>/       a scene (shots, script, storyboard, optional audio) · calls scene({...})
// Scenes are grouped into series. scenes/<series>/series.js gives the series a title and a category and lists its
// scene folders in order, so adding a scene only touches that series' file. Scene ids stay unique across all series.
// Folders load in this order: characters → locations → scenes, so scenes may use any character or location.

const REGISTRY = {
  characters: ['jester_fester', 'princess_pearl', 'safadi', 'alma', 'dragon', 'housam', 'danny', 'sami', 'jenna', 'robo_safadi', 'clawd', 'student', 'neptune', 'sarah', 'roudaynah', 'patrick'],
  locations: ['throne_room', 'dces', 'lecture_hall', 'soccer_field', 'umn', 'house', 'science_room', 'school_library', 'safadi_study', 'sami_clinic', 'school_gym', 'alma_bedroom', 'roman_bath', 'ancient_athens', 'living_room', 'housam_bedroom', 'meadow-ridge-elementary-school', 'home_clinic'],
  series: [
    // Professor Safadi Studio
    'early_episodes', 'soccer_showdown', 'halloween', 'book_fair', 'talent_show', 'lectures', 'cleaning_up', 'screen_time', 'the_trolls',
    // Sami's studio
    'dr_sami_lessons', 'sami_shorts',
  ],
  movieSeries: ['early_episodes', 'soccer_showdown', 'halloween', 'book_fair', 'talent_show', 'lectures', 'cleaning_up', 'screen_time', 'the_trolls'],   // their scenes, in order, are the default composer order and node render.mjs --movie
  // Filled in from the series files by expandSeries() (engine/series.js): scenes (every scene id), movie (scene ids), sceneSeries (id → series).
};
