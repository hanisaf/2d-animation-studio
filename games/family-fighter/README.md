# Family Fighter

Open `index.html` directly, or visit `games/family-fighter/` through the arcade. Choose one of 13 characters, then beat every other fighter in roster order. Each match is best of three 60-second rounds. Tied rounds replay. A lost match can be retried without losing tournament progress; choosing a fighter starts a new tournament.

Arrows or WASD move, jump and crouch. J punches, K kicks, L uses the character's special, Space blocks, P pauses. Touch players can slide on the direction pad while holding an attack or block. Specials cost 40 energy, which recharges. Blocking reduces damage; attacks have windup, range and recovery. Computer rivals approach, attack and sometimes block. Focus loss pauses the game.

Share `index.html`, `style.css` and `runtime.js` together. They work offline without the rest of the repository. Editable sources are `page.html`, `style.css`, `model.js`, and `game.js`. Rebuild with `npm run build:family-fighter` after editing sources or rigs.

Validate with `node scripts/test-family-fighter.mjs` and `CHROME=/path/to/chrome node scripts/test-family-fighter-browser.mjs`.
