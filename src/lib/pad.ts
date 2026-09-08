/**
 * Bouwt een interne link. Root-absoluut, met .html erachter.
 *
 * Waarom met extensie: de mockup wordt ook op een kale statische server
 * bekeken, en die serveert /voertuigen niet vanzelf als /voertuigen.html.
 *
 * Waarom niet relatief: dan zou elke pagina zijn eigen diepte moeten
 * meerekenen, en de linkchecker rekent met absolute paden. Voor de ZIP
 * die Roel krijgt maakt `scripts/maak-zip.mjs` deze links achteraf
 * relatief, zodat dubbelklikken vanaf de schijf ook werkt.
 *
 * De eerste parameter is het pad van de huidige pagina. Die is nu niet
 * meer nodig, maar blijft staan zodat we terug kunnen naar relatieve
 * links zonder elke aanroep aan te passen.
 */
export function link(_huidigPad: string, doel: string): string {
  if (doel === '/' || doel === '') return '/index.html';
  const schoon = doel.replace(/^\/+/, '').replace(/\.html$/, '');
  return '/' + schoon + '.html';
}
