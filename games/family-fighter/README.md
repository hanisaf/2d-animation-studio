# Family Fighter

Open `index.html` directly, or visit `games/family-fighter/` through the arcade. Choose one of 13 characters, then beat every other fighter in roster order. Each match is best of three 60-second rounds. After every match, a four-second result countdown plays before the next rival starts automatically, whether you win or lose. Pause also freezes this countdown. Round results show a five-second countdown, then the next round starts automatically. Tied rounds replay automatically after the same countdown. Pausing or leaving the tab freezes the countdown. Match losses advance to the next rival; choosing a fighter starts a new tournament.

Arrows or WASD move, jump and crouch. Z or J punches, X or K kicks, C or L uses the character's special, Space blocks, P pauses. Touch players can slide the joystick in the lower left corner while holding an attack or block in the lower right. Slide diagonally to move and jump or crouch together. The thumb follows your finger and returns to center when released. Controls remain available on hybrid devices. Restart begins a fresh tournament with the selected fighter. Specials cost 40 energy, which recharges. Blocking reduces damage; attacks have windup, range and recovery. Computer rivals approach, attack and sometimes block. Focus loss pauses the game.

Share `index.html`, `style.css` and `runtime.js` together. They work offline without the rest of the repository. Editable sources are `page.html`, `style.css`, `model.js`, `arenas.js`, and `game.js`. Rebuild with `npm run build:family-fighter` after editing sources or rigs.

Validate with `node scripts/test-family-fighter.mjs` and `CHROME=/path/to/chrome node scripts/test-family-fighter-browser.mjs`.

Sound effects accompany attacks, jumps, hits, blocks, round starts and results. Use **Sound: on/off** to mute or enable them. Audio starts after a keyboard or touch gesture, stops on pause or focus loss, and requires no downloaded assets.

## Fight locations

Twelve side-view arenas adapt the studio locations: Pearl’s Throne Room (pastel columns and stained glass), Safadi’s Study (bookcases and chalkboard), Dove Creek Gym (maple court and Doves scoreboard), Ancient Athens (Acropolis and olive trees), County Soccer Field (goals and bleachers), Sami’s Clinic (X-ray and heart monitor), Roman Bath (sea-facing arches, turquoise pool and steam), Science Room (flasks and periodic table), Alma’s Bedroom (fairy lights and heart headboard), Housam’s Bedroom (soccer duvet and laptop), School Library (reading-dragon mural and rainbow rug), and Family House (red brick and columned porch).

The arena changes with each rival, visits each location once across the twelve-match tournament, and stays fixed for all rounds against that rival. Restarting the tournament returns to the throne room. Backgrounds are cached at 1920×1080; all locations share the same combat boundaries and floor. No additional distribution files are needed. Run `CHROME=/path/to/chrome node scripts/test-family-fighter-arenas.mjs` for rendering checks and a contact sheet.

The tournament ends after all twelve rivals, showing total match wins and losses. Winning all twelve earns the family crown. There is no rematch stop.
