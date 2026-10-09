# Dr. P

A fictional physician in [The Etiquette of Employment](../../scenes/scene16_employment_etiquette/README.md). Dr. P speaks with absolute seriousness even when his response is wildly disproportionate.

His appearance follows [reference.png](reference.png): swept, side-parted brown hair, a clean-shaven adult face with dark eyes and a slight smile, an open-collar light blue shirt with rolled sleeves, a stethoscope, tan trousers, a brown belt, and brown lace-up shoes. The rest pose has his left hand tucked into his pocket and his right hand holding the stethoscope chestpiece. The rig uses adult proportions within the existing 30-unit height.

`patrick(x, y, s, o)` draws a 30-unit-tall character at a screen floor point. `PATRICK_UNIT = 6`. Options: `t`, `mouth` (the shared lip-flap shapes; defaults to `smile`), `brows` (`normal` or `angry`), `blink`, `tilt`, `handL`, and `handR` in local units. Explicit hand targets override the reference pose; targets beyond the arm's reach are clamped by two-bone IK, and hand anchors follow the rendered wrists. Returns screen anchors `head`, `mouth`, `top`, `handL`, and `handR`. Phone props attach to the hand anchors. The character browser includes rest, phone, and warning poses. His voice is low, restrained, and officious.
