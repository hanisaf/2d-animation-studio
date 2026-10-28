# Initial fighting pose library

Open `studio.html`, select a fighter under Characters, and choose a `fight:` pose. Complete moves loop in the preview. These are rig animations and attack visual effects, ready to use in a future fighting game. Combat rules, hitboxes, projectiles, damage and opponent interactions are not implemented here.

All 13 fighters have 30 complete fighting moves:

- Stance, walk forward/backward, crouch, stand up, jump in place/forward/backward.
- Light/heavy punch, light/heavy kick, low sweep, crouching punch, jumping punch/kick, special.
- High/low block and separate high/low block recoil.
- Head/body/low/air hit reactions, knockdown, grounded hold, get up.
- Victory and defeat.

Every attack animates through windup, strike, follow-through and recovery. Contact occurs around 40% of its duration. Jumps include takeoff, rise, apex, fall and landing in one animation. Walks stay in place for use with game-controlled movement. Jump previews travel a small distance; the game can use `sample()` to decide how to apply that displacement.

| Fighter | Special | Adaptation |
|---|---|---|
| Jester Fester | Jester tumble | Airborne somersault |
| Princess Pearl | Royal rainbow | Flipper strikes and tail sweeps |
| Professor Safadi | Chalk burst | Glowing chalk power |
| Alma | Rainbow rhythm | Dance aura and extended palm |
| Dragon | Wing gust | Paw strikes, tail sweep and spread wings |
| Housam | Power volley | Athletic forward strike |
| Danny | Block breaker | Short forward power strike |
| Doctor Sami | Health pulse | Health aura and palm pulse |
| Jenna | Cartwheel comet | Gymnastics rotation; plush put away |
| Robo-Safadi | Broccoli boost | Charge indicator and powered strike |
| Clawd | Prompt pop | Stubby jabs, leg kicks and hologram pulse |
| Neptune | Tidal burst | Flipper strikes, tail sweeps and water aura |
| Sarah | Rebel spike | Jumping strike and rebellion effects |

## Drawing API

Load the fighter's manifest files in order, just as the studio does. The final `../fighting-poses.js` file registers poses for `CURRENT_ASSET.id` inside a private scope, so manifests can also be concatenated into JavaScript exports.

```js
const fighter = CHARACTERS.sami.fighting;
// seconds since move began; holds final pose when finished.
// x/y are the floor point in pixels, scale is pixels per rig unit.
const anchors = fighter.draw('heavy punch', x, y, scale, seconds, { facing: -1 });
// facing: 1 = right (default), -1 = left; loop: true repeats a move.
fighter.draw('stance', x, y, scale, seconds, { facing: 1, loop: true });
const duration = fighter.durations['heavy punch'];
const state = fighter.sample('heavy punch', .42); // normalized 0–1 progress
// state: options for the rig, lift, dx, angle, power, progress.
```

`draw()` returns screen-space rig anchors and restores the canvas transform. It normalizes Dragon's native left-facing silhouette. Raw rig options in `sample()` use the shared right-facing convention; use `draw()` for species adaptation, floor placement, mirroring and the special effect. The caller should set engine time `T` to the frame time, as in other studio rendering, and flush overlays after drawing the frame.

Dragon's optional `pawL`/`pawR` targets and Clawd's optional `legL`/`legR` targets allow articulated attacks. Omitting them preserves their existing scene poses. Character preview bounds include extended and fallen poses.

Run `CHROME=/path/to/chrome node scripts/test-fighting-poses-browser.mjs` to check registration, every move in both directions, complete-move registration, finite anchors, canvas restoration and deterministic scrubbing. The test writes a visual contact sheet to `out/fighting-poses.png`.
