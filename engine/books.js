// engine/books.js: comic books. Shared by the studio (browser) and Node scripts (scripts/registry.mjs).
//
// Each comics/<book>/book.js calls book({ title, category, logline, size, style, defaults, comics: ['<comic id>', ...] }).
// Once every book file has run, expandBooks() fills in what the rest of the code reads from REGISTRY:
//   REGISTRY.comics     every comic id, book by book (in REGISTRY.books order)
//   REGISTRY.comicBook  comic id -> book id (a comic's folder is comics/<book>/<id>)

const BOOKS = {};
let CURRENT_BOOK = null;              // set by the loader while a book.js runs

function book(meta) {
  if (!CURRENT_BOOK) throw new Error('book() must be called from a comics/<book>/book.js');
  const dir = `comics/${CURRENT_BOOK}`;
  const at = f => f && (/^(https?:|data:|\/)/.test(f) ? f : `${dir}/${f}`);
  const styleIn = meta.style || {};
  const rawRefs = Array.isArray(styleIn.refs) ? [...styleIn.refs] : (Array.isArray(meta.styleRefs) ? [...meta.styleRefs] : []);
  if (styleIn.castSheet && !rawRefs.includes(styleIn.castSheet)) rawRefs.push(styleIn.castSheet);
  const size = { width: 1700, height: 2200, trim: 'Letter', dpi: 200, ...(meta.size || {}) };
  const defaults = {
    cast: [],
    locations: [],
    illustration: { model: 'gemini-nano-banana-2.1', mode: 'page', resolution: '2K', thinkingLevel: 'medium', chainPreviousPage: false },
    ...(meta.defaults || {}),
    illustration: {
      model: 'gemini-nano-banana-2.1',
      mode: 'page',
      resolution: '2K',
      thinkingLevel: 'medium',
      chainPreviousPage: false,
      ...(meta.defaults?.illustration || {}),
    },
  };
  const castBible = {};
  for (const [cid, raw] of Object.entries(meta.castBible || {})) {
    if (typeof raw === 'string') {
      castBible[cid] = { id: cid, name: cid, description: raw, traits: [], avoid: [], ref: null, rawRef: null };
    } else if (raw && typeof raw === 'object') {
      castBible[cid] = {
        id: cid,
        name: raw.name || cid,
        description: raw.description || '',
        traits: Array.isArray(raw.traits) ? [...raw.traits] : (raw.traits ? [raw.traits] : []),
        avoid: Array.isArray(raw.avoid) ? [...raw.avoid] : (raw.avoid ? [raw.avoid] : []),
        ref: raw.ref ? at(raw.ref) : null,
        rawRef: raw.ref || null,
      };
    }
  }
  const locationRefs = {};
  for (const [lid, rawPath] of Object.entries(meta.locationRefs || {})) {
    if (typeof rawPath === 'string' && rawPath) locationRefs[lid] = at(rawPath);
  }
  const invariants = Array.isArray(meta.invariants) ? meta.invariants.filter(Boolean) : [];
  BOOKS[CURRENT_BOOK] = {
    id: CURRENT_BOOK,
    dir,
    title: CURRENT_BOOK,
    category: '',
    logline: '',
    ...meta,
    size,
    style: {
      prompt: styleIn.prompt || '',
      refs: rawRefs.map(at),
      rawRefs: [...rawRefs],
      castSheet: styleIn.castSheet ? at(styleIn.castSheet) : null,
    },
    castBible,
    invariants,
    locationRefs,
    defaults,
    comics: meta.comics || [],
  };
  return BOOKS[CURRENT_BOOK];
}

function expandBooks() {
  const comicBook = {};
  const books = REGISTRY.books || [];
  for (const bid of books) {
    if (!BOOKS[bid]) throw new Error(`comics/${bid}/book.js did not call book({...})`);
    for (const id of BOOKS[bid].comics) {
      if (comicBook[id]) throw new Error(`comic id "${id}" is in both comics/${comicBook[id]}/ and comics/${bid}/: comic ids must be unique`);
      comicBook[id] = bid;
    }
  }
  REGISTRY.comicBook = comicBook;
  REGISTRY.comics = books.flatMap(bid => BOOKS[bid].comics);
}

const comicDir = id => `comics/${REGISTRY.comicBook[id]}/${id}`;
