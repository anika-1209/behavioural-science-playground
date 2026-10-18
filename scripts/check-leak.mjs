// P3-1: the bias name must not be in anything the browser loads before the debrief.
// Run after `vite build`: checks that index.html and the entry chunk contain no
// bias name. Debrief chunks are allowed to, since they load only at the reveal.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const debriefDir = 'src/content/debriefs';
const names = readdirSync(debriefDir)
  .filter((f) => /^exp-\d+\.ts$/.test(f))
  .map((f) => readFileSync(join(debriefDir, f), 'utf8').match(/biasName:\s*['"]([^'"]+)['"]/)?.[1])
  .filter(Boolean);

const html = readFileSync('dist/index.html', 'utf8');
const entries = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
const files = [['dist/index.html', html], ...entries.map((p) => [p, readFileSync(join('dist', p), 'utf8')])];

let failed = false;
for (const [file, text] of files) {
  for (const name of names) {
    if (text.toLowerCase().includes(name.toLowerCase())) {
      console.error(`LEAK: "${name}" appears in ${file}`);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log(`No bias names in the initial bundle (${names.length} checked, ${files.length} files).`);
