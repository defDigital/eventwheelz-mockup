/**
 * Maakt van een gebouwde dist/ een kopie waarin alle interne verwijzingen
 * relatief zijn.
 *
 * Astro schrijft absolute paden (/voertuigen.html, /_astro/x.css). Die werken
 * niet als je een pagina vanaf de schijf opent, en ook niet op GitHub Pages,
 * want een projectsite draait daar in een submap en niet in de root.
 * Relatieve paden werken in allebei de gevallen.
 */
import { cpSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const maakRelatief = (tekst, prefix) =>
  tekst
    // href="/x" en src="/x", maar niet //cdn.example.com
    .replace(/((?:href|src)=")\/(?!\/)/g, `$1${prefix}`)
    // url(/x) in css, met of zonder quotes
    .replace(/(url\(\s*['"]?)\/(?!\/)/g, `$1${prefix}`)
    // srcset="/a 400w, /b 800w"
    .replace(/srcset="([^"]+)"/g, (_, waarde) =>
      `srcset="${waarde.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}`)}"`);

/** Kopieert bron naar doel en zet alle paden om. Geeft het aantal bestanden terug. */
export function maakRelatieveKopie(bron, doel) {
  rmSync(doel, { recursive: true, force: true });
  cpSync(bron, doel, { recursive: true });

  let aangepast = 0;
  for (const bestand of walk(doel)) {
    if (!/\.(html|css)$/.test(bestand)) continue;
    const diepte = relative(doel, dirname(bestand)).split('/').filter(Boolean).length;
    const prefix = '../'.repeat(diepte);
    const oud = readFileSync(bestand, 'utf8');
    const nieuw = maakRelatief(oud, prefix);
    if (nieuw !== oud) {
      writeFileSync(bestand, nieuw);
      aangepast++;
    }
  }
  return aangepast;
}
