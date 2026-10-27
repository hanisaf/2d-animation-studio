// registry.js: which asset folders exist, and the default movie order. ADD NEW ASSETS HERE (or use scripts/new.sh).
//
// Every asset is a self-contained folder with an asset.js manifest (title, logline, code files, docs, reference art…),
// its code, its README.md and its reference art:
//   characters/<id>/   a character rig (+ its skills and props) · registers itself on CHARACTERS
//   locations/<id>/    a 3D set · registers itself on LOCATIONS
//   scenes/<id>/       a scene (shots, script, storyboard, optional audio) · calls scene({...})
// Folders load in this order: characters → locations → scenes, so scenes may use any character or location.

const REGISTRY = {
  characters: ['jester_fester', 'princess_pearl', 'safadi', 'alma', 'dragon', 'housam', 'danny', 'sami', 'jenna', 'robo_safadi', 'clawd', 'student', 'neptune'],
  locations: ['throne_room', 'dces', 'lecture_hall', 'soccer_field', 'umn', 'house', 'science_room', 'school_library', 'safadi_study', 'sami_clinic', 'school_gym', 'alma_bedroom', 'roman_bath', 'ancient_athens', 'living_room', 'housam_bedroom'],
  scenes: ['scene01_juggling', 'scene02_fired', 'scene03_once_a_dragon', 'scene04_healthy_promise', 'scene05_dragon_counts', 'scene06_riemann', 'scene07_message_first', 'scene08_multitasking', 'scene09_hat_trick', 'scene10_great_debate', 'scene11_hydration_debate', 'scene12_umn', 'scene13_deal_with_it', 'scene14_offside_trap', 'scene15_second_half', 'scene16_spooky_plan', 'scene17_broccoli_directive', 'scene18_some_assembly', 'scene19_if_else_explain', 'scene20_halloween_night', 'scene21_already_read', 'scene21b_dolphin_royalty', 'scene21c_book_fair', 'scene22_you_shall_see', 'scene23_secret_potion', 'scene24_competition_begins', 'scene25_cube_drops', 'scene26_perfect_drop', 'scene27_dynamics_of_mirroring', 'scene28_cleaning_up', 'scene29_cleaning_up_2', 'scene30_cleaning_up_3', 'scene31_cleaning_up_4', 'scene32_screen_time', 'scene33_busted', 'scene34_game_over', 'scene35_game_night', 'scene36_dream_mode'],
  movie: ['scene01_juggling', 'scene02_fired', 'scene03_once_a_dragon', 'scene04_healthy_promise', 'scene05_dragon_counts', 'scene06_riemann', 'scene07_message_first', 'scene08_multitasking', 'scene09_hat_trick', 'scene10_great_debate', 'scene11_hydration_debate', 'scene12_umn', 'scene13_deal_with_it', 'scene14_offside_trap', 'scene15_second_half', 'scene16_spooky_plan', 'scene17_broccoli_directive', 'scene18_some_assembly', 'scene19_if_else_explain', 'scene20_halloween_night', 'scene21_already_read', 'scene21b_dolphin_royalty', 'scene21c_book_fair', 'scene22_you_shall_see', 'scene23_secret_potion', 'scene24_competition_begins', 'scene25_cube_drops', 'scene26_perfect_drop', 'scene27_dynamics_of_mirroring', 'scene28_cleaning_up', 'scene29_cleaning_up_2', 'scene30_cleaning_up_3', 'scene31_cleaning_up_4', 'scene32_screen_time', 'scene33_busted', 'scene34_game_over', 'scene35_game_night', 'scene36_dream_mode'],        // default composer order and node render.mjs --movie
};
