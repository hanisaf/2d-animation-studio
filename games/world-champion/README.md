# World Champion

A 90-second soccer showdown inspired by the World Champion insert in scene32_screen_time. Choose Dr. Sami or Professor Safadi; always face Housam, Danny, Jenna and goalkeeper Alma. Outscore the kids to become World Champion. Both heroes use the same rules.

Open `index.html` directly in a browser, or follow the World Champion card in the arcade. To share offline, copy `index.html`, `style.css` and `runtime.js` together into any folder. No server, network, fonts or studio assets are required at runtime.

Arrows/WASD move. Run into the ball to dribble or tackle. Attack right and defend left. Space shoots; hold up/down to aim. X chips over Alma (best from the penalty area); Shift sprints while stamina lasts. P pauses. Touch buttons support simultaneous movement and actions. Matches pause on blur or when the tab is hidden. Restart begins a fresh match with the chosen hero; Choose player returns to the picker.

Sound effects include kick-off and full-time whistles, kicks, chip shots, tackles, steals, saves, rebounds and goal cheers. Use **Sound: on/off** to mute; ongoing effects stop on pause or when leaving the match. Audio starts after a user gesture and is synthesized locally with Web Audio. Browsers without Web Audio play silently.

Editable sources: `page.html`, `style.css`, `model.js`, `sounds.js`, `game.js`. Rebuild with `npm run build:world-champion`. The original shared character rigs are cached into animation frames at startup.

Verify with `node scripts/test-world-champion.mjs` and `CHROME=/path/to/chrome node scripts/test-world-champion-browser.mjs`.
