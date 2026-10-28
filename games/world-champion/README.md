# World Champion

A 90-second soccer showdown inspired by the World Champion insert in scene32_screen_time. Team grown-ups (Dr. Sami and Professor Safadi) faces team kids (Housam, Danny, Jenna and Alma). Choose Team Grown-ups or Team Kids before kickoff. Control follows your team’s ball carrier; when defending or chasing a loose ball, you control your nearest player. The opposing team dribbles and shoots automatically. Other characters support attacks, mark opponents and chase loose balls.

Open `index.html` directly in a browser, or follow the World Champion card in the arcade. To share offline, copy `index.html`, `style.css` and `runtime.js` together into any folder. No server, network, fonts or studio assets are required at runtime.

Arrows/WASD move. Run into the ball to dribble or tackle. Grown-ups attack right; kids attack left. When the ball is loose, control follows your nearest player. C passes to the nearest teammate. Space shoots; hold up/down to aim. X chips the ball (best from the penalty area); Shift sprints while stamina lasts. P pauses. On touch devices, hold the joystick and an action together; slide across the pad to change direction without lifting your steering thumb. Diagonals support moving and aiming together. Phone play layouts keep the field and large controls visible in portrait and landscape. Matches pause on blur or when the tab is hidden. Restart begins a fresh match with the chosen team; Choose team returns to the picker.

Sound effects include kick-off and full-time whistles, kicks, chip shots, tackles, steals, saves, rebounds and goal cheers. Use **Sound: on/off** to mute; ongoing effects stop on pause or when leaving the match. Audio starts after a user gesture and is synthesized locally with Web Audio. Browsers without Web Audio play silently.

Editable sources: `page.html`, `style.css`, `model.js`, `sounds.js`, `game.js`. Rebuild with `npm run build:world-champion`. The original shared character rigs are cached into animation frames at startup.

Verify with `node scripts/test-world-champion.mjs` and `CHROME=/path/to/chrome node scripts/test-world-champion-browser.mjs`.
