# Palm Pals

> Five squishy, palm-sized bean-filled plushies in one pack: **Eve Earth**, **Zelie Pink Lemonade**, **Kringle Cookie**, **Crumble Cookie**, and **Bertie Red Bus**.

## Who they are

Based on Aurora World's [Palm Pals](https://palmpals.com/products/) plush collection, all five pocket-sized characters live together in a single studio character panel so you can browse them individually or as a group, drop them into scenes, or feature them in comics.

| Plush | `pal` key (aliases) | Theme & Personality | Look |
|---|---|---|---|
| **Eve Earth** | `'eve'` (`'eve_earth'`) | Galactic · *Grounded* — calm, caring guardian of tranquility | Soothing sky-blue ocean globe with stitched green continent patches, bead eyes, rosy cheeks, sweet smile |
| **Zelie Pink Lemonade** | `'zelie'` (`'zelle'`) | Cravings · *Giggly* — bubbly, sunny, infectious laugh | Vibrant pink lemonade cup with fluffy white foam rim, bright yellow lemon slice garnish, striped pink straw |
| **Kringle Cookie** | `'kringle'` (`'cringle'`) | Seasonal · *Nice* — festive holiday cookie baked with joy | Warm golden-brown cookie dotted with glossy red and green candy sprinkles, rosy cheeks, warm smile |
| **Crumble Cookie** | `'crumble'` (`'crumble_cookie'`) | Cravings · *Crumbly* — cheerful, playful, delightfully messy | Golden-yellow baked cookie crust topped with scalloped creamy-white frosting and colorful rainbow sprinkles |
| **Bertie Red Bus** | `'bertie'` (`'barret'`, `'red_bus'`) | Momento · *Travel* — classic London double-decker bus | Pillowy pillar-box red bus with sky-blue upper windows, cream belt stripe, `LONDON` sign, glowing headlights, front grill, soft stubby black wheels |
| **Eve's Dad** | `'eve_dad'` (`'earth_dad'`) | *Palm Pals Adventures* — warm, protective pancake-flipping dad | Larger deeper-ocean Earth globe plushie (`#4F92C4`) with darker green continents and signature dark wavy **squiggly mustache** |
| **Zelie's Papa** | `'zelie_papa'` (`'papa'`, `'fruit_punch'`) | *Palm Pals Adventures* — cheerful, affectionate dad | Taller coral-red fruit punch cup plushie (`#D95448`) with cream foam rim, golden-yellow straw, and signature dark wavy **squiggly mustache** |

## Look & palette (`PLP`)

| Character | Main Colours |
|---|---|
| Shared ink & face | Outline `#352333`, bead eyes `#1E1624`, blush `#F69AB3` (`#FF5C8D` on pink, `#FFACC0` on red) |
| Eve Earth | Ocean `#7AC3EB` (`#B2E4FC` / `#529CC9`), continents `#6EC86B` (`#4EA54E`) |
| Zelie Pink Lemonade | Cup `#F682B0`, foam `#FFFDF8`, straw `#ED5890`, lemon `#F7D436` / `#FFE870` |
| Kringle Cookie | Baked brown `#D69755`, holiday candy dots `#E2414B` & `#41A85B` |
| Crumble Cookie | Golden crust `#E6B260`, frosting `#FFFDF7`, rainbow sprinkles (`PLP.sprinkles`) |
| Bertie Red Bus | London red `#DF343C`, windows `#B8E4FA`, sign `#26202E` / `#FFF3CE`, headlights `#FFE775` |

## Proportions and scale

Each Palm Pal is roughly **8.5–9.5 local units wide** and **8.2–11 local units tall**, with its bean-weighted base resting at `y = 0`. `PALM_PALS_UNIT = 4.5` world units per local unit puts them at ~40 world units tall in 3D sets (palm-sized / desk-buddy scale, matching [Clawd](../clawd/README.md)). Pass a larger `s` for close-up inserts.

## Poses

Registered in `palm_pals.js` (`CHARACTERS.palm_pals.poses`), arranged in a balanced 6 × 2 model sheet (`node render.mjs --modelsheet=palm_pals`):

- **Row 1 (Lineup & Classics):** `all five` · `Eve Earth` · `Zelie Pink Lemonade` · `Kringle Cookie` · `Crumble Cookie` · `Bertie Red Bus`
- **Row 2 (Animated Actions):** `party bounce` · `Eve · calm` · `Zelie · giggle` · `Kringle · cheer` · `Crumble · talk` · `Bertie · drive`

## Rig API (`palm_pals.js`)

```js
// Draw any pal via palmPals() or its dedicated helper:
const A = palmPals(x, y, s, {
  pal: 'eve',            // 'eve' | 'zelie' | 'kringle' | 'crumble' | 'bertie' | 'all'
                         // aliases also accepted: 'zelle', 'cringle', 'barret', 'red_bus'
  // body motion
  dy, jump, sq, rot, flip, sx, bounce, sway, alpha, noShadow, boil,
  // cute plushie limbs
  armL, armR,            // hand angles in rad (+armL lifts left hand up, -armR lifts right hand up)
  footL, footR,          // foot angles in rad
  noArms, noFeet,        // hide arms or feet (e.g. tucked under a blanket or behind a table)
  // face
  eyes: 'open',          // 'open' | 'happy' | 'closed' | 'wink' | 'wide' | 'sparkle' | 'star' | 'sleepy'
  lookX, lookY, blink,   // lookX/Y in -1..1; blink: 0..1 or false
  brows: 'none',         // 'none' | 'up' | 'worried' | 'angry'
  mouth: 'smile',        // 'smile' | 'grin' | 'laugh' | 'open' | 'o' | 'O' | 'flat' | 'frown' | 'cat' (lipFlap works)
  blush: true,           // true | false | 0..1
  // extras
  emote, emoteK,         // 'heart' | 'spark' | '!' | '?' | 'music' | 'zzz'
  giggle: 0,             // Zelie: straw & lemon wiggle (0..1)
  drive: 0,              // Bertie: headlight glow & puff clouds (0..1)
  party: false,          // pal: 'all' celebratory group bounce
});
// A (screen px): { head, mouth, top, eyeL, eyeR, handL, handR, footL, footR, chest, center, bottom }

// Dedicated convenience wrappers:
eveEarth(x, y, s, o);
zelieLemonade(x, y, s, o);
kringleCookie(x, y, s, o);
crumbleCookie(x, y, s, o);
bertieRedBus(x, y, s, o);
eveDad(x, y, s, o);
zeliePapa(x, y, s, o);
```

## Files

| File | What |
|---|---|
| `asset.js` | Manifest: title, logline, files, docs, plushie voice profile |
| `palm_pals.js` | All five Palm Pals rigs, shared kawaii face, group layout, convenience wrappers, and 12 registered poses |
