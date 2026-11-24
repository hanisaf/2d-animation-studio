// scripts/registry.mjs: read registry.js, scene series files, and comic book files in Node (engine/series.js & engine/books.js).
//   import { REGISTRY, SERIES, BOOKS, sceneDir, comicDir } from './scripts/registry.mjs';
// Paths are relative to the project root, whatever the working directory.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => readFileSync(resolve(root, f), 'utf8');
const ctx = vm.createContext({});
vm.runInContext(read('engine/series.js') + '\n' + read('engine/books.js') + '\n' + read('registry.js'), ctx);
for (const sid of vm.runInContext('REGISTRY.series', ctx)) {
  vm.runInContext(`CURRENT_SERIES = ${JSON.stringify(sid)};`, ctx);
  vm.runInContext(read(`scenes/${sid}/series.js`), ctx, { filename: `scenes/${sid}/series.js` });
}
vm.runInContext('CURRENT_SERIES = null; expandSeries();', ctx);
for (const bid of vm.runInContext('REGISTRY.books || []', ctx)) {
  vm.runInContext(`CURRENT_BOOK = ${JSON.stringify(bid)};`, ctx);
  vm.runInContext(read(`comics/${bid}/book.js`), ctx, { filename: `comics/${bid}/book.js` });
}
vm.runInContext('CURRENT_BOOK = null; expandBooks();', ctx);

export const REGISTRY = vm.runInContext('REGISTRY', ctx);
export const SERIES = vm.runInContext('SERIES', ctx);
export const BOOKS = vm.runInContext('BOOKS', ctx);
export const sceneDir = id => vm.runInContext('sceneDir', ctx)(id);
export const comicDir = id => vm.runInContext('comicDir', ctx)(id);
