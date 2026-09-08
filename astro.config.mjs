// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Het echte domein is de standaard. Een preview zet SITE_URL naar de host
 * waar hij draait, zodat canonical, og:url en de sitemap niet naar de
 * bestaande site van de klant wijzen.
 *
 *   SITE_URL=https://ergens.example npm run build
 *
 * De layout leidt uit deze URL af of de pagina op noindex moet.
 */
const SITE = process.env.SITE_URL ?? 'https://eventwheelz.nl';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',

  // format:'file' geeft /voertuigen.html in plaats van /voertuigen/index.html.
  // Samen met relatieve links werkt de gebouwde map daardoor ook los in een
  // ZIP, met dubbelklikken vanaf de schijf. Dat is nu de manier waarop Roel
  // de mockup krijgt.
  build: { format: 'file' },

  // Bewust geen image.layout of image.responsiveStyles: die zetten een
  // [data-astro-image]-regel op elke <Image> die qua specificiteit wint van
  // onze eigen classes. Geef elke <Image> zijn eigen widths, sizes en maten.
  integrations: [sitemap()],
});
