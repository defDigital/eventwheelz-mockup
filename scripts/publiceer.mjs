/**
 * Publiceert de gebouwde site naar de gh-pages branch.
 *
 * Draai eerst `npm run verify`, want dit script controleert niets meer.
 * Het gebruikt een losse git worktree, zodat je werkmap onaangeroerd blijft
 * en je niet van branch hoeft te wisselen.
 *
 *   node scripts/publiceer.mjs
 */
import { existsSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { maakRelatieveKopie } from './relatief.mjs';

const DIST = 'dist';
const TUSSEN = 'dist-publiceer';
const WORKTREE = '.gh-pages-worktree';
const BRANCH = 'gh-pages';

const git = (...args) => execFileSync('git', args, { stdio: 'pipe' }).toString().trim();
const gitLive = (...args) => execFileSync('git', args, { stdio: 'inherit' });

if (!existsSync(DIST)) {
  console.error('Geen dist/ gevonden — draai eerst `npm run verify`.');
  process.exit(1);
}

const aangepast = maakRelatieveKopie(DIST, TUSSEN);

// GitHub Pages draait standaard Jekyll, en Jekyll negeert elke map die met
// een underscore begint. Zonder dit bestand verdwijnt /_astro/ met alle css
// en afbeeldingen erin.
writeFileSync(join(TUSSEN, '.nojekyll'), '');

// Verse worktree op de gh-pages branch.
rmSync(WORKTREE, { recursive: true, force: true });
try { git('worktree', 'prune'); } catch {}

const branches = git('branch', '--list', BRANCH);
if (branches) {
  gitLive('worktree', 'add', WORKTREE, BRANCH);
} else {
  gitLive('worktree', 'add', '--orphan', '-b', BRANCH, WORKTREE);
}

// Alles weg behalve .git, dan de nieuwe build erin.
for (const naam of readdirSync(WORKTREE)) {
  if (naam === '.git') continue;
  rmSync(join(WORKTREE, naam), { recursive: true, force: true });
}
execFileSync('cp', ['-R', `${TUSSEN}/.`, WORKTREE]);

const datum = new Date().toISOString().slice(0, 16).replace('T', ' ');
execFileSync('git', ['-C', WORKTREE, 'add', '-A'], { stdio: 'inherit' });

const status = execFileSync('git', ['-C', WORKTREE, 'status', '--porcelain']).toString().trim();
if (status) {
  execFileSync('git', ['-C', WORKTREE, 'commit', '-m', `Mockup bijgewerkt ${datum}`], { stdio: 'inherit' });
  execFileSync('git', ['-C', WORKTREE, 'push', 'origin', BRANCH], { stdio: 'inherit' });
  console.log(`\n✓ Gepubliceerd naar ${BRANCH} (${aangepast} bestanden met relatieve paden).`);
} else {
  console.log('\nGeen wijzigingen ten opzichte van de vorige publicatie.');
}

gitLive('worktree', 'remove', WORKTREE, '--force');
rmSync(TUSSEN, { recursive: true, force: true });
