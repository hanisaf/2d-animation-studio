# Students

> The kids of Dove Creek Elementary: the crowd at a book fair, an audience at story time, a hallway full of backpacks. One rig, endless faces.

Side characters, built for crowds. A seed picks everything that makes one kid look different from the next: skin tone, hair style and colour, eye colour, clothes (tee, stripes, hoodie, sweater or dress; pants, shorts or skirt), shoes, glasses, a cap, a bow, a backpack, freckles and height. They're drawn in the same style and at the same scale as [Danny](../danny/README.md) (about 122 world units tall), so they stand naturally beside the main kids.

## Look

- **Hair:** `short` · `spiky` · `curly` · `afro` · `bob` · `ponytail` · `pigtails` · `long` · `buzz` · `hijab`
- **Skin:** seven tones, from light to deep brown. **Eyes:** brown, dark, blue, green, hazel.
- **Clothes:** flat, saturated colours from a shared palette (`STU`), with plum ink outlines.

## Rig API (`student.js`)

```js
const look = studentLook(seed);            // a stable random kid; or build/modify the object yourself
const A = student(x, y, s, {
  look,                                    // or seed: n (studentLook(n) is used)
  // body
  dy, jump, lean, tilt, turn, rot, sq, flip, breathe,
  sit,                                     // 0..1: 1 = cross-legged on the floor (story time)
  handL: [x, y], handR: [x, y],            // IK wrist targets, local units (as Danny)
  handPoseL, handPoseR,                    // 'open' | 'palm' | 'point' | 'fist'
  footL, footR,
  // face
  eyes,                                    // open | wide | happy | closed | sleepy | squeeze | star
  lookX, lookY, blink,
  brows,                                   // normal | up | worried | angry
  mouth,                                   // smile | grin | open | o | O | flat | frown | yawn (lipFlap works)
  blush,
  emote, emoteK,                           // 'zzz' | 'heart' | '!' | '?'
  outfit,                                  // default, or 'greek' (also settable as look.outfit)
});
// A (screen px): head, mouth, top, eyeL, eyeR, chest, belly, handL, handR, footL, footR

studentWalk(p, k)                          // walk-cycle pose options: p = distance / ~40 world units, k = stride 0..1
```

- **Greek outfit** (`outfit: 'greek'`, for the *Know thyself* story in scene 30): a knee-length chiton pinned at the shoulders, with a meander hem and a belt in a contrasting colour, an optional sash, bare arms and leather sandals. Each kid gets either a laurel wreath or a hair ribbon (a gold band over a hijab). Caps, glasses, bows and backpacks come off. The seed picks the colours as well (`look.robeCol`, `look.trimCol`, `look.wreath`, `look.sash`), so the same kid always wears the same chiton. Poses: `greek`, `greek · teach us!`, `greek · astronomy`, `greek · puzzled` (fist under the chin, "?"), `greek · story time`, `greek · class` (the five dancers from scene 24, seeds 31 · 44 · 52 · 67 · 73).
- Use `s = STUDENT_UNIT * P.k(Z)` in a set. `look.h` (0.9–1.1) scales the kid, so multiply by it for anything sized to the body.
- Pass `seed` as well as `look`: it also staggers blinks and breathing, so a crowd doesn't blink in unison.
- **Voice:** give lines `speaker: 'student'` (a chirpy kid voice in `asset.js`). Scene 21c adds `who: 's3'` to say which student's mouth the bubble comes from.

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs, the crowd voice |
| `student.js` | the rig, `studentLook`, `studentWalk` and the registered poses (`rest`, `cheer`, `story time`, `asleep`, `walk`, `hand up`, `crowd`, and the `greek · …` set) |
