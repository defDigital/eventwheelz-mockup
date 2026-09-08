import type { ImageMetadata } from 'astro';

/**
 * De collections verwijzen naar een bestandsnaam ('voertuig-tuktuks.jpg'),
 * net zoals een Webflow CMS-veld naar een afbeelding wijst. Deze twee
 * helpers zoeken daar het geoptimaliseerde bestand bij.
 */
const fotos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/foto/*.{jpg,jpeg,png}', { eager: true });
const logos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/logo/*.{png,svg}', { eager: true });

export function foto(naam: string | null): ImageMetadata | undefined {
  if (!naam) return undefined;
  return fotos[`/src/assets/foto/${naam}`]?.default;
}

export function logo(naam: string | null): ImageMetadata | undefined {
  if (!naam) return undefined;
  return logos[`/src/assets/logo/${naam}`]?.default;
}
