// Seed missing user settings, including when the home volume already exists.
import { copyFile, mkdir, chmod } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaults = dirname(fileURLToPath(import.meta.url));
const home = process.env.HOME || homedir();
const settings = [
  ['codex/config.toml', '.codex/config.toml'],
  ['claude/settings.json', '.claude/settings.json'],
  ['gemini/settings.json', '.gemini/settings.json'],
];

for (const [source, destination] of settings) {
  const target = join(home, destination);
  await mkdir(dirname(target), { recursive: true });
  try {
    await copyFile(join(defaults, source), target, constants.COPYFILE_EXCL);
    await chmod(target, 0o600);
    console.log('Installed default settings: ' + destination);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}
