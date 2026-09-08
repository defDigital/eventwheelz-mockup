# Overzetten naar Webflow

Alles in de mockup is gemaakt met het naspelen in Webflow als uitgangspunt.
Dit document is de volgorde waarin je dat het snelst doet.

## 1. Instellingen vooraf

**Breakpoints.** De mockup gebruikt precies die van Webflow: 991, 767 en 479.
Je hoeft dus niets na te stellen.

**Lettertypes.** Upload `public/font/anton-latin.woff2` en
`public/font/opensans-latin.woff2` onder Site settings → Fonts. Anton alleen
voor koppen, Open Sans voor de rest. Open Sans is een variabele letter, dus
één bestand dekt 400, 600 en 700.

**Variabelen.** Maak deze aan, met dezelfde namen als in `src/styles/tokens.css`.

| Naam | Waarde |
| --- | --- |
| navy | `#0a3a6e` |
| blue | `#0f4e96` |
| deep | `#14364a` |
| yellow | `#ffd206` |
| ice | `#ebf6fe` |
| grey | `#3b474f` |
| card-bg | `#0d4380` |
| body | `#d6e4f5` |
| muted | `#b8cfe9` |

## 2. CMS-collecties

Maak ze in deze volgorde aan, want de koppelingen verwijzen naar elkaar.

**1. Use cases** — naam, slug, nummer, label, kort, lang (rich text),
hoofdfoto, volgorde.

**2. Voertuigen** — naam, slug, kort, lang (rich text), vanafprijs (number),
prijs-eenheid, inbegrepen (rich text), hoofdfoto, galerij (multi-image),
aantal personen, actieradius, rijbewijs, accuwissel (switch), volgorde,
**inzet (multi-reference → Use cases)**.

**3. Cases** — klant, slug, kort, verhaal (rich text), logo, foto, jaar,
volgorde, **inzet (multi-reference → Use cases)**,
**voertuigen (multi-reference → Voertuigen)**.

Ga daarna terug naar Use cases en voeg
**voertuigen (multi-reference → Voertuigen)** toe. Die kon er in stap 1 nog
niet in, omdat Voertuigen toen nog niet bestond.

De inhoud staat klaar in `src/data/*.json`.

## 3. Symbols

Deze blokken komen op meerdere pagina's terug. Maak ze één keer.

| Symbol | Bestand in de mockup |
| --- | --- |
| Navbar | `src/components/Header.astro` |
| Footer | `src/components/Footer.astro` |
| CTA-blok | `src/components/CtaBlok.astro` |
| Logobalk | `src/components/Logobalk.astro` |
| Offerteformulier | `src/components/OfferteFormulier.astro` |
| Voertuigkaart | `src/components/VoertuigKaart.astro` |
| Paginakop | `src/components/PaginaKop.astro` |

## 4. Classes

Basisclass plus combo-class die met `is-` begint, zoals Webflow zelf werkt.

```
section          + is-band / is-alt / is-light
button           + is-primary / is-outline
grid             + is-2 / is-3 / is-4
card             card-image, card-body, card-titel, price
panel            panel-body, panel-num
```

Verder: `wrap`, `section-head`, `eyebrow`, `usp-list`, `usp-item`, `usp-num`,
`usp-kop`, `usp-note`, `stats`, `stat`, `stat-num`, `stat-label`, `form`,
`field`, `form-row`, `case-card`, `case-rol`, `chip`, `paneel`, `kruimel`.

## 5. Drie dingen die Webflow niet uit zichzelf doet

**De hero-slider** doet precies wat de native Webflow Slider kan: zes slides,
bolletjes, pijlen, autoplay van 5,2 seconden en pauze bij hover. Gebruik dus
gewoon de Slider-component, niet de code uit `HeroSlider.astro`.

**De logobalk** die doorloopt heeft Webflow niet. Twee opties: een klein stukje
custom code met de keyframe uit `Logobalk.astro`, of een stilstaand logoraster.
De opmaak werkt allebei, want zonder animatie blijft het een nette rij witte
blokjes.

**Vloeiende koptekst.** De mockup gebruikt `clamp()` voor h1, h2 en h3. Dat is
de enige plek. Zet het als custom code in de head, of vul per breakpoint een
vaste maat in. De waarden staan onderaan `src/styles/tokens.css`.

## 6. Niet vergeten

- Het formulier koppelen aan e-mail of CRM. In de mockup doet hij niets.
- De eerste optie van "Type inzet" leeg laten staan, anders komt elke aanvraag
  binnen als "Crew mobility".
- Zichtbare focus op alles wat bedienbaar is. Webflow zet dat niet vanzelf goed.
- `prefers-reduced-motion` respecteren voor de slider en de logobalk.
- De voetnoot bij USP 01 meenemen: die geldt alleen voor E-Choppers,
  E-Fatbikes en E-Steps.
