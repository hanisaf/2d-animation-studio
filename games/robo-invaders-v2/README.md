# Robo Invader · Version 2

A playable take on Professor Safadi’s **Robo Invasion** from `scenes/scene32_screen_time`: Your chosen hero fires rainbow bolts at three rows of red-eyed Robo-Safadis, against a purple starfield with scanlines, outlined arcade lettering, and a monitor bezel.

Open `index.html` directly in a browser, or select **Robo Invader · Version 2** in the studio’s Arcade menu. Choose **Neptune, Jester Fester, Professor Safadi, Dr Sami, Housam, Alma, Danny, or Jenna** on the opening fighter-selection screen. Click or tap a portrait to see the large preview, then press **Choose hero · Play**. You can also use the arrow keys to select and **Enter** to confirm. Use **Choose hero** to return to selection; **Restart** keeps your current hero. Shooting, robot hits, and player damage have synthesized arcade sound effects; toggle **Sound** to mute them.

Move with **← / →** or **A / D**, hold **Space** to fire, and press **P / Escape** to pause. Touch buttons support moving and firing together. You have three crowns; each robot earns 350 points. Clear a formation to advance to a faster wave. Losing every crown or letting the robots reach your hero ends the game.

To share the offline game, copy these three files together:

- `index.html`
- `style.css`
- `runtime.js`

No network connection or studio server is required. Version 1 remains in `games/robo-invaders/`.

Edit `page.html`, `style.css`, `model.js`, and `game.js`, then run `npm run build:game:v2`. The bundle includes the shared engine and original eight hero rigs and Robo-Safadi rig. Rebuild after changing those dependencies.

Checks:

```sh
node scripts/test-robo-invaders-v2.mjs
CHROME=/path/to/chrome node scripts/test-robo-invaders-v2-browser.mjs
```

The browser check opens a copy of just the distribution files outside the repository, blocks network access, and checks the studio link, rendering, keyboard and touch controls, pause/resume, restart, and phone layout.
