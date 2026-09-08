import { defineCollection, reference, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * Deze drie collections zijn één op één de drie CMS-collecties die we in
 * Webflow gaan aanmaken. Elk veld hieronder wordt daar één CMS-veld, met
 * dezelfde naam. Het Webflow-type staat erbij in commentaar, zodat dit
 * bestand meteen de invulinstructie is.
 *
 * Wat we niet weten laten we null. Liever een leeg veld dan een verzonnen
 * getal op de site van een klant.
 */

const voertuigen = defineCollection({
  loader: file('src/data/voertuigen.json'),
  schema: z.object({
    naam: z.string(),                       // Plain text
    slug: z.string(),                       // Slug
    kort: z.string(),                       // Plain text  — tekst op de kaart
    payoff: z.string(),                     // Plain text  — grote regel boven de tekst
    lang: z.array(z.string()),              // Rich text   — tekst op de detailpagina
    faq: z.array(z.object({                 // Rich text of een aparte collectie
      vraag: z.string(),
      antwoord: z.string(),
    })),
    vanafprijs: z.number().nullable(),      // Number
    prijsEenheid: z.string(),               // Plain text  — "per dag"
    inbegrepen: z.array(z.string()),        // Rich text   — wat er in de prijs zit
    hoofdfoto: z.string().nullable(),       // Image
    galerij: z.array(z.string()),           // Multi-image
    aantalPersonen: z.string().nullable(),  // Plain text
    actieradius: z.string().nullable(),     // Plain text
    rijbewijs: z.string().nullable(),       // Plain text
    accuwissel: z.boolean(),                // Switch — bepaalt of de accu-USP geldt
    inzet: z.array(reference('usecases')),  // Multi-reference → Use cases
    volgorde: z.number(),                   // Number — handmatige sortering
  }),
});

const usecases = defineCollection({
  loader: file('src/data/usecases.json'),
  schema: z.object({
    naam: z.string(),                        // Plain text
    slug: z.string(),                        // Slug
    nummer: z.string(),                      // Plain text — "01"
    label: z.string(),                       // Plain text — "Backstage"
    kort: z.string(),                        // Plain text
    payoff: z.string(),                      // Plain text
    lang: z.array(z.string()),               // Rich text
    stappen: z.array(z.object({              // Rich text of een aparte collectie
      titel: z.string(),
      tekst: z.string(),
    })),
    quote: z.object({                        // Plain text, drie velden
      tekst: z.string(),
      naam: z.string(),
      rol: z.string(),
    }).nullable(),
    hoofdfoto: z.string().nullable(),        // Image
    voertuigen: z.array(reference('voertuigen')), // Multi-reference → Voertuigen
    volgorde: z.number(),                    // Number
  }),
});

const cases = defineCollection({
  loader: file('src/data/cases.json'),
  schema: z.object({
    klant: z.string(),                       // Plain text
    slug: z.string(),                        // Slug
    kort: z.string(),                        // Plain text
    opdracht: z.string(),                    // Rich text
    aanpak: z.string(),                      // Rich text
    resultaat: z.string(),                   // Rich text
    verhaal: z.array(z.string()),            // Rich text
    cijfers: z.array(z.object({              // Rich text of een aparte collectie
      getal: z.string(),
      label: z.string(),
    })),
    quote: z.object({
      tekst: z.string(),
      naam: z.string(),
      rol: z.string(),
    }).nullable(),
    logo: z.string().nullable(),             // Image
    foto: z.string().nullable(),             // Image
    fotos: z.array(z.string()),              // Multi-image
    jaar: z.string().nullable(),             // Plain text — leeg tot Roel het aanlevert
    inzet: z.array(reference('usecases')),   // Multi-reference → Use cases
    voertuigen: z.array(reference('voertuigen')), // Multi-reference → Voertuigen
    volgorde: z.number(),                    // Number
  }),
});

export const collections = { voertuigen, usecases, cases };
