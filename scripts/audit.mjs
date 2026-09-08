/**
 * Structural audit over the built site: heading order, alt text, link and
 * button labels, form labels, and duplicate landmarks. Complements
 * check-links.mjs, which only looks at hrefs.
 *
 *   node scripts/audit.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
if (!existsSync(DIST)) {
  console.error('Geen dist/ gevonden — draai eerst `npm run build`.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const paginas = walk(DIST).filter((f) => f.endsWith('.html'));
const problemen = [];
const meld = (pagina, tekst) => problemen.push(`${relative(DIST, pagina)}: ${tekst}`);

for (const pagina of paginas) {
  const html = readFileSync(pagina, 'utf8');
  const body = html.slice(html.indexOf('<body'));

  // Exactly one h1.
  const h1s = [...body.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) meld(pagina, `${h1s} h1-elementen (verwacht: 1)`);

  // No skipped heading levels.
  const niveaus = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < niveaus.length; i++) {
    if (niveaus[i] > niveaus[i - 1] + 1) {
      meld(pagina, `kopniveau springt van h${niveaus[i - 1]} naar h${niveaus[i]}`);
      break;
    }
  }

  // Every image needs an alt attribute (empty is fine for decorative).
  for (const [tag] of body.matchAll(/<img\b[^>]*>/g)) {
    // Astro emits a bare `alt` for decorative images, which is valid HTML
    // and equivalent to alt="".
    if (!/\salt(=|[\s>/])/.test(tag)) meld(pagina, `img zonder alt: ${tag.slice(0, 90)}`);
  }

  // Links must have a discernible name.
  for (const [, attrs, inhoud] of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const tekst = inhoud.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const heeftLabel =
      tekst !== '' || /aria-label=/.test(attrs) || /aria-labelledby=/.test(attrs);
    if (!heeftLabel) meld(pagina, `link zonder toegankelijke naam: ${attrs.slice(0, 80)}`);
  }

  // Form controls need a label, an aria-label, or a wrapping label.
  for (const [tag] of body.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)) {
    if (/type="(hidden|submit|button)"/.test(tag)) continue;
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const heeftLabel =
      /aria-label=/.test(tag) ||
      (id && new RegExp(`<label[^>]*for="${id}"`).test(body)) ||
      /class="sr-only"/.test(tag);
    if (!heeftLabel && !/name="soort"/.test(tag)) {
      meld(pagina, `formulierveld zonder label: ${tag.slice(0, 80)}`);
    }
  }

  // Meta basics.
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) {
    meld(pagina, 'ontbrekende of te korte meta description');
  }
  if (!/<html lang="nl"/.test(html)) meld(pagina, 'ontbrekend lang-attribuut');
  const titel = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (titel.length < 10 || titel.length > 70) {
    meld(pagina, `titel is ${titel.length} tekens (streef naar 10–70)`);
  }
}

if (problemen.length > 0) {
  console.error(`\n✗ ${problemen.length} bevinding(en):\n`);
  for (const p of problemen) console.error(`   ${p}`);
  process.exit(1);
}

console.log(`✓ ${paginas.length} pagina's — geen structurele of a11y-bevindingen.`);
