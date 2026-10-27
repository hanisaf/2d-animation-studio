# Robo Invader · Version 2

A playable take on Professor Safadi’s **Robo Invasion** from `scenes/scene32_screen_time`: King Neptune fires rainbow trident bolts at three rows of red-eyed Robo-Safadis, against a purple starfield with scanlines, outlined arcade lettering, a green ground line, and a monitor bezel.

Open `index.html` directly in a browser, or select **Robo Invader · Version 2** in the studio’s Arcade menu. Move with **← / →** or **A / D**, hold **Space** to fire, and press **P / Escape** to pause. Touch buttons support moving and firing together. You have three crowns; each robot earns 350 points. Clear a formation to advance to a faster wave. Losing every crown or letting the robots reach Neptune ends the game.

To share the offline game, copy these three files together:

- `index.html`
- `style.css`
- `runtime.js`

No network connection or studio server is required. Version 1 remains in `games/robo-invaders/`.

Edit `page.html`, `style.css`, `model.js`, and `game.js`, then run `npm run build:game:v2`. The bundle includes the shared engine and original Neptune and Robo-Safadi rigs. Rebuild after changing those dependencies.

Checks:

```sh
node scripts/test-robo-invaders-v2.mjs
CHROME=/path/to/chrome node scripts/test-robo-invaders-v2-browser.mjs
```

The browser check opens a copy of just the distribution files outside the repository, blocks network access, and checks the studio link, rendering, keyboard and touch controls, pause/resume, restart, and phone layout.
