# Clawd

> A little clay-orange block of an AI with two slit eyes and four stubby legs: the large language model that lives in Housam's laptop.

## Who he is

Clawd is the **large language model** Housam and Danny plug into Robo-Safadi (scene 19, *If, Else, Explain!*). He lives in the laptop and pops out of it as a hologram whenever he's needed. Give him a beginning, the *prompt*, and he follows it somewhere nobody predicted.

- **Wants:** a good prompt. He loves anything that says *surprising*.
- **Powers:** unpredictable output. Ask him for something and out comes a rubber duck, a rainbow, a dice, a fish, a star…
- **Personality:** eager, curious, a little mischievous. He reads every prompt very carefully (eyes down, lips moving), lights up with star eyes when he gets it, and goes swirly-eyed when the prompt says *haywire*.
- **Voice and acting:** he doesn't talk in words. He chirps (the `robot` voice style at a high pitch), waves his stubby arms, and does squash-and-stretch "takes".

He was first designed for **PDoomVideo** (`PDoomVideo/src/clawd.js`, painted watercolour). This is the same silhouette and the same moods, redrawn flat with ink outlines to match the Jester Fester studio.

## Look

| Part | Colour |
|---|---|
| Clay (body, arms) / light pool / dark (legs, base band) | `#D97757` / `#F2A283` / `#A84D33` |
| Ink (outline, eyes) | `#2B2233` |
| Hologram glow | `#7FE3FF` |

A 10 × 6 rounded block body, two tall slit eyes with a highlight, four stubby legs, two stubby arms that pivot at his sides. No neck, no nose, no hair.

## Proportions and scale

He is **8 local units** tall and 10 wide. The body spans x −5…5, y −8…−2; the legs reach y 0; the eyes sit at x −3 and 2 (1 wide), y −7…−5; the arms pivot at (±4.9, −4.5) and are 2.2 long. `CLAWD_UNIT = 5` world units per unit, so in a set he's a 40-unit desk buddy (he stands on the AV cart in scene 19). Pass a bigger `s` to scale him up; in the laptop-screen inserts he's drawn at 26 px per unit.

## Poses

Registered in `clawd.js` (`CHARACTERS.clawd.poses`), shown on the model sheet (`node render.mjs --modelsheet=clawd`):

rest · wave · talk · hologram · thinking · idea! · mischief · haywire · laugh · walk

## Rig API (`clawd.js`)

```js
const A = clawd(x, y, s, {
  // pose:  dy, jump, sq (squash; − stretches), rot, flip, sx, aL / aR (arm angles; + raises), walk (leg phase), bounce (idle bob)
  // face:  eyes: 'normal' | 'look' | 'happy' | 'closed' | 'wink' | 'narrow' | 'spark' | 'swirl' | 'heart' | 'x' | 'red' | 'dot'
  //        lookX, lookY, squint, blink (false to stop the auto-blink)
  //        mouth: 'smile' | 'grin' | 'o' | 'O' | 'flat' | 'wobble' | 'cat', blush
  // look:  holo (0..1: cyan aura, scan lines, glowing rim), alpha
  // extra: emote: '!' | '?' | 'sweat' | 'heart' | 'spark' | 'music', emoteK; armL / armR (fn(s) drawn at the arm tip)
});
// A (screen px): head, mouth, top, eyeL, eyeR, chest, handL, handR, footL, footR
```

- **Mood changes:** go through a `squint` (eyes squash shut) and a little `sq` take before landing a new `eyes`, as in PDoomVideo.
- **As the LLM:** `holo: 1` with `bounce` for an idle hover; `eyes: 'look', lookY: 1` reads a prompt; `'spark'` gets it; `'swirl'` + `rot` / `sq` jitter goes haywire; `'narrow'` + `mouth: 'cat'` is mischief.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs, the chirpy `robot` voice |
| `clawd.js` | the rig, his eyes, mouths and emotes, and the registered poses |
