# A Day on the Ice

Based on the supplied hand-drawn comic: Sami is Jenna's dad **in this chapter**. Jenna brings Fafy, her plush giraffe, to the arena. A wobbly beginning leads to a slalom glide, a low-angle jump, and a 360° orbital spin. Dad cheers, and Jenna reminds him that he can learn too.

## Script and shots

| Time | Action, camera & dialogue |
|---|---|
| 0–15 | **3D Living Room** (`LOCATIONS.living_room`, gentle `lookAt` orbit & foreground coffee-table DoF). Sami: “Jenna, shall we go ice-skating?” Jenna: “Yes! Can Fafy come?” Sami: “Of course! Fafy is family.” |
| 15–21 | **3D Mudroom** (2-point perspective push-in with goldfish bowl, coat rack, frosted door light bloom & foreground doorframe parallax). Jenna zips her pink winter jacket carrying Fafy: “Jacket on. I'm ready!” A `ZIP!` starburst punctuates the action. |
| 21–33 | **360° 3D Ice Arena — First Steps** (2-point camera sweep + dynamic `depthStage` crossing). Fafy watches from the rinkside bench; Sami wears a winter scarf, helmet, and skates: “I feel wobbly!” Jenna glides from behind Sami around the practice cones to in front of him: “Keep practicing. You'll get the hang of it!” |
| 33–39 | **GLIDE!** Tracking 3D slalom with banking camera `roll`. Jenna weaves in front of and behind three skating cones with tapered 3D ice-carve tracks, motion trails, and glossy ice reflections. |
| 39–43 | **JUMP!** Low-angle 3-point perspective hero shot (`pitch` up with overhead rafters and 3D hanging jumbotron). Jenna crouches, launches with ice-spray bursts and motion smear, and lands with a springy bounce (`TA-DA!`). |
| 43–49 | **SPIN!** Full 360° orbital 3D camera around center ice (`lookAt` + elevated crane pitch). The entire rink, fans, board banners (`MINNESOTA · 10,000 LAKES`, `ICE ARENA`, `SKATE CLUB`, `FAFY FAN ZONE`), cones, and 3D helix spin-whoosh ribbons dynamically re-sort via `depthStage(P)` as Jenna finishes facing forward in a blooming star ring. |
| 49–69 | **Finale** (dolly-orbit pull-back). Sami: “Good job, Jenna! You rock!” Then: “As for me... I'm too old for those tricks.” Jenna glides up beside him: “You're not too old, Dad! Try your best!” Dad pushes off and glides forward beside her leaving twin 3D skate tracks. |

## Visual features showcased (M1–M5)

- **M1:** animated 12 fps paper grain, scoped per-object boil (`'sami'` / `'jenna'`), half-res DoF `layer()` blur, 1/4-res `bloom()` on sunbeams/floodlights/sparkles, and shot-level `grade()`.
- **M2:** tapered 3D skate-blade tracks, ice-spray bursts, `ZIP!` rays, 3D helix spin ribbons (`taperStroke`), damped `spring()` motion, sub-frame `trail()` ghosts, and jump `smear()`.
- **M3:** unified directional lighting (`withLight`), projected shadows, and glossy ice reflections (`castShadow`), toggled cleanly with `--no-m3`.
- **M4:** 3D `persp()` cameras (`yaw`, `pitch`, `roll`, `lookAt`), roll-aligned `P.billboard()` props, and `depthStage(P)` dynamic far-to-near interleaving across characters, cones, benches, and 3D spin ribbons.
- **M5:** syllable-synced `lipFlap()` paired with side-anchored `callout()` bubbles.

Uses the existing Sami and Jenna rigs without changing their shared designs. Jenna wears her optional `winter` outfit from the mudroom onward; helmets, skates, and Sami's scarf are scene props.

Open `studio.html?scene=scene76_day_on_ice&play=true` through the local studio, or render with `node render.mjs --scene=scene76_day_on_ice --build`.
