# Eventwheelz

Mockup van de volledige website voor Eventwheelz, het evenementenmerk van
Unieke Uitjes. Wordt daarna nagebouwd in Webflow. Deze map is dus geen site
die live gaat, maar het ontwerp waar we in Webflow op werken.

Uitgangspunt is `eventwheelz-v3-donker`, de variant die Roel en Frank op
7 september hebben gekozen.

## Vormgeving

Huisstijl van Unieke Uitjes, donkere variant.

| Rol | Kleur |
| --- | --- |
| Pagina | `--navy` `#0a3a6e` |
| Band | `--deep` `#14364a` |
| Accentvlak | `--blue` `#0f4e96` |
| Kaart | `--card-bg` `#0d4380` |
| Accent | `--yellow` `#ffd206` |
| Licht vlak | `--ice` `#ebf6fe` |

Koppen in **Anton**, body in **Open Sans**, allebei zelf gehost in
`public/font/`. Anton vervangt Gill Sans Ultra Bold Condensed, dat een
betaalde letter is waar geen webfont-licentie voor is.

Contrast staat nagerekend in commentaar bovenaan `src/styles/tokens.css`.

## Content

Drie collections, die één op één de drie Webflow CMS-collecties worden. De
velden en hun Webflow-type staan in `src/content.config.ts`. De inhoud zelf
staat in `src/data/*.json`.

| Collection | Items | Bestand |
| --- | --- | --- |
| voertuigen | 4 | `src/data/voertuigen.json` |
| usecases | 3 | `src/data/usecases.json` |
| cases | 3 | `src/data/cases.json` |

De koppelingen tussen de drie zijn `reference()`-velden. Die worden in
Webflow multi-reference. Daardoor toont de pagina van de TukTuk vanzelf bij
welke cases hij heeft gereden, en de pagina van Branded mobility welke
voertuigen daarbij passen.

## Commando's

```bash
npm run dev      # ontwikkelserver
npm run build    # bouwt naar dist/
npm run verify   # bouwt, controleert links en doet de a11y-audit
npm run zip      # verify plus een ZIP die ook zonder server werkt
```

`npm run zip` maakt `eventwheelz-mockup.zip`. Dat is wat Roel krijgt: uitpakken,
`index.html` openen in Chrome en doorklikken. Het script maakt alle absolute
paden relatief, want anders opent de pagina zonder opmaak vanaf de schijf.

## Wat er nog moet gebeuren

**Teksten.** Alles met `PLACEHOLDER` in de JSON-bestanden. De korte teksten en
de USP-sectie zijn wel definitief, die komen uit de goedgekeurde v3 en uit
Roels mail van 7 september.

**Foto's.** Het huidige materiaal komt uit de goedgekeurde v3 en bestaat uit
zeven verschillende beelden, meer niet. Zie `FOTOS.md` voor wat er ontbreekt.

**Specificaties per voertuig.** Aantal personen, actieradius en rijbewijs
staan op `null` en tonen "Nog aanleveren". Die moeten van Roel komen.

**Jaartallen bij de cases.** Staan op `null`, om dezelfde reden.

## Overzetten naar Webflow

Zie `WEBFLOW.md`.
