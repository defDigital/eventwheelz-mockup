/**
 * Build-time guard against the thing that broke the old site: internal
 * links pointing at pages that do not exist. Walks dist/, collects every
 * href, and fails the run on the first dead one.
 *
 *   node scripts/check-links.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

if (!existsSync(DIST)) {
  console.error('Geen dist/ gevonden — draai eerst `npm run build`.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const bestanden = walk(DIST);
const paginas = bestanden.filter((f) => f.endsWith('.html'));

// Every path the built site can actually serve.
const beschikbaar = new Set();
for (const f of bestanden) {
  const rel = '/' + relative(DIST, f).split('\\').join('/');
  beschikbaar.add(rel);
  if (rel.endsWith('.html')) beschikbaar.add(rel.slice(0, -'.html'.length));
  if (rel.endsWith('/index.html')) beschikbaar.add(rel.slice(0, -'index.html'.length) || '/');
}
beschikbaar.add('/');

const hrefs = /(?:href|src)="([^"]+)"/g;
const problemen = [];
let gecontroleerd = 0;

for (const pagina of paginas) {
  const html = readFileSync(pagina, 'utf8');
  for (const [, ruw] of html.matchAll(hrefs)) {
    if (
      ruw.startsWith('http') ||
      ruw.startsWith('mailto:') ||
      ruw.startsWith('tel:') ||
      ruw.startsWith('data:') ||
      ruw.startsWith('#')
    ) {
      continue;
    }
    const pad = ruw.split('#')[0].split('?')[0];
    if (pad === '') continue;
    gecontroleerd++;
    if (!beschikbaar.has(pad)) {
      problemen.push(`${relative(DIST, pagina)} → ${ruw}`);
    }
  }
}

if (problemen.length > 0) {
  console.error(`\n✗ ${problemen.length} kapotte interne link(s):\n`);
  for (const p of [...new Set(problemen)]) console.error(`   ${p}`);
  process.exit(1);
}

console.log(
  `✓ ${gecontroleerd} interne links op ${paginas.length} pagina's — allemaal geldig.`,
);
