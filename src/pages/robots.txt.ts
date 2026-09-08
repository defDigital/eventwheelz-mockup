import type { APIRoute } from 'astro';

/** Het productiedomein. Alles wat hier niet op draait is een preview. */
const PRODUCTIE = 'https://eventwheelz.nl';

/**
 * Op het echte domein: alles vrijgeven en naar de sitemap wijzen.
 * Op elke andere host (Netlify-preview, staging): volledig dichtzetten.
 *
 * Afgeleid van de gebouwde site-URL, net als de noindex-meta in de layout,
 * zodat beide altijd hetzelfde zeggen.
 */
export const GET: APIRoute = ({ site }) => {
  const url = site ?? new URL(PRODUCTIE);
  const isPreview = url.hostname !== new URL(PRODUCTIE).hostname;

  const body = isPreview
    ? `# Preview-omgeving — niet indexeren.\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', url).href}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
