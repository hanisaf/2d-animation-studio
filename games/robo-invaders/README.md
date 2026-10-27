# Robo Invader · The Ultimate Edition

A playable take on Professor Safadi’s **Robo Invasion** from `scenes/scene32_screen_time`: Your chosen hero fires rainbow bolts at three rows of red-eyed Robo-Safadis, against a purple starfield with scanlines, outlined arcade lettering, and a monitor bezel.

Open `index.html` directly in a browser, or select **Robo Invader · The Ultimate Edition** in the studio’s Arcade menu. Choose **Neptune, Jester Fester, Professor Safadi, Dr Sami, Housam, Alma, Danny, or Jenna** on the opening fighter-selection screen. Click or tap a portrait to see the large preview, then press **Choose hero · Play**. You can also use the arrow keys to select and **Enter** to confirm. Use **Choose hero** to return to selection; **Restart** keeps your current hero. Shooting, robot hits, and player damage have synthesized arcade sound effects; toggle **Sound** to mute them.

Move with **← / →** or **A / D**, hold **Space** to fire, and press **P / Escape** to pause. On touch devices, hold a direction and **ZAP!** together to move while firing. Large controls stay beside the field on landscape phones, with a compact portrait play layout too. You have three crowns; each robot earns 350 points. Clear a formation to advance to a faster wave. Losing every crown or letting the robots reach your hero ends the game.

To share the offline game, copy these three files together:

- `index.html`
- `style.css`
- `runtime.js`

No network connection or studio server is required.

Edit `page.html`, `style.css`, `model.js`, and `game.js`, then run `npm run build:game`. The bundle includes the shared engine and original eight hero rigs and Robo-Safadi rig. Rebuild after changing those dependencies.

Hero artwork is cached before play as a four-second, 12 fps animation. Movement still renders every display frame. Only the current hero's cache is retained (about 37 MiB of raw pixels at 2× density), and restarting reuses it. Switching heroes releases the previous frames when the next game starts.

Checks:

```sh
node scripts/test-robo-invaders.mjs
CHROME=/path/to/chrome node scripts/test-robo-invaders-browser.mjs
```

The browser check opens a copy of just the distribution files outside the repository, blocks network access, and checks the studio link, rendering, keyboard and touch controls, pause/resume, restart, and portrait/landscape phone and tablet layouts, including multi-touch release, cancellation, lost capture, and touch target sizes.
