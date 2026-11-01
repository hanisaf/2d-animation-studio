#!/usr/bin/env node
// scripts/lecture_script.mjs: write a Python lecture's voice-over script into its README.md.
//
//   node scripts/lecture_script.mjs scene49_py01_analytics_pipeline [--print]
//
// Reads the scene's asset.js (narration + pace), times every line the same way the scene does (lkTiming in
// scenes/python_lectures/scene49_py01_analytics_pipeline/lecture_kit.js), and replaces the block between
//   <!-- narration:start -->  and  <!-- narration:end -->
// in the scene's README.md with the script: one table per board panel, each line with its cue time.
// --print writes the block to stdout instead. Run it after you change the narration or the pace.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const [id, ...flags] = process.argv.slice(2);
if (!id) { console.error('usage: node scripts/lecture_script.mjs <scene id> [--print]'); process.exit(1); }
const series = readFileSync('registry.js', 'utf8').match(/series: \[([\s\S]*?)\]/)[1].match(/'([^']+)'/g).map(s => s.slice(1, -1));
const dir = series.map(s => `scenes/${s}/${id}`).find(d => existsSync(`${d}/asset.js`));
if (!dir) { console.error(`no scene folder for ${id}`); process.exit(1); }

const ctx = { console, Math };
vm.createContext(ctx);
vm.runInContext(readFileSync('scenes/python_lectures/scene49_py01_analytics_pipeline/lecture_kit.js', 'utf8') + '\n;this.lkTiming = lkTiming; this.lkWords = lkWords;', ctx);
let meta; ctx.asset = m => { meta = m; };
vm.runInContext(readFileSync(`${dir}/asset.js`, 'utf8'), ctx);
const lines = ctx.lkTiming(meta.narration, meta.pace);
const titles = (() => {                                     // panel titles, read from scene.js (`{ title: '…', draw`)
  const src = readFileSync(`${dir}/scene.js`, 'utf8');
  return [...src.matchAll(/\{\s*title:\s*(['"])(.*?)\1\s*,\s*draw/g)].map(m => m[2].replace(/\\'/g, "'"));
})();

const mmss = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
const last = lines[lines.length - 1], words = lines.reduce((s, l) => s + ctx.lkWords(l.text), 0);
const out = [];
out.push(`**${lines.length} lines · ${words} words · voice ends at ${mmss(last.at + last.dur)}** (pace: ${meta.pace?.wps ?? 2.45} words per second).`, '');
let panel = 0;
for (const l of lines) {
  if (l.panel !== panel) {
    panel = l.panel;
    out.push('', `### Panel ${String(panel).padStart(2, '0')} · ${titles[panel - 1] ?? ''}`, '', '| Cue | Narration |', '|---|---|');
  }
  out.push(`| ${mmss(l.at)} | ${l.text.replace(/\|/g, '\\|')} |`);
}
const block = out.join('\n');
if (flags.includes('--print')) { console.log(block); process.exit(0); }

const readme = `${dir}/README.md`, src = readFileSync(readme, 'utf8');
const re = /(<!-- narration:start -->)[\s\S]*?(<!-- narration:end -->)/;
if (!re.test(src)) { console.error(`${readme} has no <!-- narration:start --> … <!-- narration:end --> block`); process.exit(1); }
writeFileSync(readme, src.replace(re, `$1\n${block}\n$2`));
console.log(`${readme}: ${lines.length} lines, voice ends at ${mmss(last.at + last.dur)}`);
