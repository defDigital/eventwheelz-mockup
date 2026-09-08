/**
 * Maakt eventwheelz-mockup.zip: de gebouwde site met relatieve paden, zodat
 * Roel de map kan uitpakken en index.html met dubbelklikken kan openen.
 *
 *   node scripts/maak-zip.mjs
 */
import { existsSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { maakRelatieveKopie } from './relatief.mjs';

const DIST = 'dist';
const UIT = 'dist-zip';
const ZIP = 'eventwheelz-mockup.zip';

if (!existsSync(DIST)) {
  console.error('Geen dist/ gevonden — draai eerst `npm run build`.');
  process.exit(1);
}

rmSync(ZIP, { force: true });
const aangepast = maakRelatieveKopie(DIST, UIT);

writeFileSync(join(UIT, 'LEES-MIJ.txt'),
  [
    'Eventwheelz — mockup van de website',
    '',
    'Pak deze map helemaal uit en open daarna index.html in Chrome.',
    'Vanuit de homepage kun je doorklikken naar alle pagina\'s.',
    '',
    'Let op: dit is een mockup. De teksten en foto\'s zijn nog niet definitief',
    'en het offerteformulier verstuurt nog niets.',
    '',
  ].join('\n'));

execFileSync('zip', ['-r', '-q', '-X', `../${ZIP}`, '.'], { cwd: UIT });
rmSync(UIT, { recursive: true, force: true });

const kb = Math.round(statSync(ZIP).size / 1024);
console.log(`✓ ${ZIP} klaar (${kb} kB, ${aangepast} bestanden omgezet naar relatieve paden).`);
