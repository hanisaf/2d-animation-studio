// comics/palm_pals_adventures/book.js: the "Palm Pals Adventures" comic book manifest.
book({
  title: 'Palm Pals Adventures',
  category: "Sami's Studio",
  logline: 'Cozy, hilarious plushie comic adventures starring Eve Earth, Zelie Pink Lemonade, and friends — created by Jenna Safadi.',
  size: { width: 1700, height: 2200, trim: 'Letter', dpi: 200 },
  style: {
    prompt: 'Warm hand-painted children’s storybook comic illustration of squishy bean-filled Palm Pals plushies, soft velvety watercolor gouache shading, clean warm-ink linework, expressive kawaii faces, bright cozy pastel palette.',
    refs: ['style_refs/storybook_anchor_1.png'],
    castSheet: 'style_refs/cast_sheet.png',
  },
  castBible: {
    eve: {
      name: 'Eve Earth',
      description: 'Small, round sky-blue planet plushie (#7AC3EB) with stitched green continent patches, cute black bead eyes with white sparkles, rosy pink cheeks, and tiny stubby blue arms and feet.',
      traits: ['10 years old', 'occasionally wears a brown plaid explorer hat'],
      avoid: ['no mustache', 'no human hair or clothes other than the brown plaid hat when scripted'],
      ref: 'style_refs/char_eve.png',
    },
    zelie: {
      name: 'Zelie Pink Lemonade',
      description: 'Small tapered pink lemonade cup plushie (#F682B0) with a fluffy scalloped white foam rim, pink-and-white striped straw on the left, yellow lemon wedge garnish on the right, cute black bead eyes, rosy cheeks, and tiny stubby pink arms and feet.',
      traits: ['6 years old', 'smaller than her Papa'],
      avoid: ['no mustache', 'keep straw pink-striped (never yellow)'],
      ref: 'style_refs/char_zelie.png',
    },
    eve_dad: {
      name: "Eve's Dad",
      description: 'Larger, deeper-ocean blue Earth globe plushie (#4F92C4) with darker green continents, warm bead eyes, rosy cheeks, stubby blue arms and feet, and a bold dark wavy zig-zag squiggly mustache right above his mouth.',
      traits: ['noticeably larger than Eve Earth', 'signature dark wavy squiggly mustache'],
      avoid: ['NEVER draw a smooth curved handlebar mustache — ALWAYS draw a wavy zig-zag squiggly mustache'],
      ref: 'style_refs/char_eve_dad.png',
    },
    zelie_papa: {
      name: "Zelie's Papa",
      description: 'Taller coral-red fruit punch cup plushie (#D95448) with a fluffy cream foam rim, solid golden-yellow straw tilted right, warm bead eyes, rosy cheeks, stubby red arms and feet, and a bold dark wavy zig-zag squiggly mustache right above his mouth.',
      traits: ['noticeably taller than Zelie', 'golden-yellow straw', 'signature dark wavy squiggly mustache'],
      avoid: ['NEVER draw a smooth curved handlebar mustache — ALWAYS draw a wavy zig-zag squiggly mustache', 'no lemon slice'],
      ref: 'style_refs/char_zelie_papa.png',
    },
  },
  invariants: [
    'Both Eve’s Dad and Zelie’s Papa ALWAYS wear a thick, dark, wavy zig-zag squiggly mustache — never a smooth curved handlebar mustache.',
    'Pancakes are plain golden-brown breakfast food with butter/syrup — NEVER draw faces, eyes, or mouths on pancakes.',
    'Keep window time-of-day strictly faithful to the Studio blueprint: starry dark sky + moon ONLY for nighttime panels, bright blue sky + golden sun for daytime panels.',
    'Preserve exact character sizes relative to each other (the two Dads are clearly larger/taller than Eve and Zelie).',
  ],
  locationRefs: {
    bedroom_night: 'style_refs/loc_bedroom_night.png',
    bedroom_day: 'style_refs/loc_bedroom_day.png',
    kitchen: 'style_refs/loc_kitchen.png',
  },
  defaults: {
    cast: ['palm_pals'],
    locations: [],
    illustration: {
      model: 'gemini-nano-banana-2.1',
      mode: 'page',
      resolution: '2K',
      thinkingLevel: 'medium',
      chainPreviousPage: true,
    },
  },
  comics: [
    'the_adventure',
  ],
});
