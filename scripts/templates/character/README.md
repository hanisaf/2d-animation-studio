# __TITLE__

<!-- ![__TITLE__ reference](reference.png) -->

> <who they are, in one line>

## Who they are

<Personality, what they want, what they're good and bad at, catchphrase, how they act and speak.>

## Look

<Shape, colours, costume, distinguishing features. Add the palette as a table: part → hex colour.>

## Proportions and scale

About <h> local units tall. `__NAME___UNIT` world units per unit, so in a set use `s = __NAME___UNIT * P.k(Z)`.

## Poses

Registered in `__NAME__.js` (`CHARACTERS.__NAME__.poses`): rest · bounce.

## Rig API (`__NAME__.js`)

```js
const A = __NAME__(x, y, s, { /* pose + face options */ });
// A (screen px): head, mouth
```

## Files

| File | What |
|---|---|
| `asset.js` | manifest: title, logline, files, docs, reference art |
| `__NAME__.js` | the rig + registered poses |
