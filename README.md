# Maruti Water Solution — website

Storefront and catalogue site for **Maruti Water Solution**, Botad, Gujarat — domestic RO
purifiers, commercial RO plants and industrial RO plants, ISO 9001:2015.

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:5180>.

```bash
npm run build
```

Output lands in `dist/` (~109 kB JS gzipped, ~9.5 kB CSS gzipped, plus 22 product images at
~846 kB total). Any static host will serve it — configure a SPA rewrite (`/* → /index.html`) so
deep links like `/p/plant-1000-auto` resolve.

## Stack

React 19 · Vite 8 · React Router 7 · Tailwind CSS v4. No UI kit and no icon package — the icon set
is hand-drawn SVG in `src/components/Icons.jsx`.

## Catalogue structure

The product sections follow the client's instruction, mapped onto the supplied V-Tech Aqua 2023
catalogue:

| Section | Catalogue pages | Models |
| --- | --- | --- |
| Domestic | 2–5 | 12 |
| Commercial RO Plant | 6–11 | 12 |
| Industrial RO Plant | 12–14 | 6 |

Every model, price and specification in `src/data/products.js` is transcribed from that catalogue.
Prices are the printed M.R.P., inclusive of taxes. **Models the catalogue prints without a figure
carry `price: null` and render as "Price on request" — never substitute a guessed number.**

Each product also records `sourcePage`, so any figure on the site can be traced back to the page it
came from. The product detail page shows that reference to the customer.

## Pages

| Route | Contents |
| --- | --- |
| `/` | Hero, the three ranges, requirement finder, featured models, how RO works, FAQ |
| `/shop` | All 30 models with range / purification / body-material / budget filters |
| `/p/:slug` | Photo, price, specs, filter stack or bill of materials, enquiry and WhatsApp CTAs |
| `/compare` | Up to three models side by side across 13 catalogue measures |
| `/technology` | The eight-stage sequence, how hardware scales with capacity, service intervals |
| `/support` | Service request, cartridge-schedule calculator, WhatsApp contacts |
| `/about` | What the business does, how it works, where to find it |
| `/quote` | Enquiry form that composes a WhatsApp / phone handover — no online payment |

`/checkout` redirects to `/quote`.

## Enquiries, not checkout

An RO dealer quotes after a site check — capacity, feed water and installation all move the price —
so the basket is an **enquiry list**, not a cart. Submitting composes a pre-filled WhatsApp message
to Ashvin's number. No payment is taken and no card or bank details are collected anywhere.

## Assets

- `public/products/*.webp` — 22 product photographs extracted from the client's own catalogue PDF,
  converted from CMYK to sRGB (CMYK JPEGs render with wrong colours in browsers), background-
  normalised, and re-encoded as WebP.
- `public/brand/*.webp` — the supplied logo artwork, trimmed, plus a white knock-out for dark
  surfaces and the MWS monogram on its own.

The brand blue `#0058d6` is sampled from the logo file. It measures 6.2:1 on white, so it clears
WCAG AA for body text; `--color-blue-ink` (`#0044a8`) is the deeper tone for very small blue text.
Re-skinning the whole site is a matter of changing those token values in `src/index.css`.

## Editing the catalogue

`src/data/products.js` is generated from the verified extraction, but it is a plain file — edit it
directly. Adding an object to `products` automatically propagates to the home grid, shop filters,
mega menu, compare table, footer sitemap and the requirement finder's scoring. Set `image` to a path
under `public/products/`.

## Homepage hero carousel

The right side of the hero rotates one flagship per product category. Which product
represents each category lives in a single file, `src/data/heroShowcase.js`:

```js
export const HERO_FLAGSHIPS = {
  domestic: 'zuric-platinum',
  commercial: 'plant-150',
  industrial: 'plant-1000-auto',
}
```

Change a slug to change what that category shows. Add a category by adding it to
`sections` in `products.js` and adding its flagship slug here — the carousel, its
indicators and the category pill all follow automatically, in catalogue order.

Everything shown (image, name, model, category, price, link) is read from
`products.js`; nothing is duplicated. Products without a printed price simply omit
the price line rather than showing a placeholder.

Behaviour: 5.2s per product, 820ms cross-fade, infinite loop, pause on hover/focus,
click-through to the product page, arrow keys and swipe, and a progress bar that fills
in time with the rotation. Under `prefers-reduced-motion` it falls back to plain
cross-fades with the float and glow switched off. No animation library — plain CSS
keyframes and React state.

## What the site deliberately does not claim

This is a real trading business, so the copy only states things that can be
substantiated from the material you supplied — the catalogue, the plant nameplates and
the logo. It does **not** claim, anywhere:

- a founding year, company history, staff numbers or units sold
- customer testimonials, names, quotes or star ratings
- lab results, removal percentages or any certification beyond ISO 9001:2015
- a free water test, a callback time, or any turnaround or service-level promise
- in-house engineers, held spares stock, or a service coverage area
- that Maruti Water Solution manufactures the plants (they are catalogue products)
- an EMI or finance facility

Service copy is written as an invitation to ask ("Ask us about installation and
servicing") rather than a promise. **If you do offer any of the above, tell me and I
will put it back in as a firm claim** — the wording is hedged only because it was not
verifiable, not because it is untrue.

## Things to confirm before going live

- **Domestic page range.** The brief said "Domestic: pages 7 to 14", but pages 7–14 of the supplied
  catalogue are the commercial and industrial sections. The domestic range here is built from
  pages 2–5, which is where the domestic cabinets actually sit in this file. If domestic is meant to
  come from a different catalogue, send it and the section can be rebuilt.
- **Mars and Jade prices.** The catalogue prints "M.R.P. Rs." with no figure for Mars Gold, Mars
  Silver and Jade. They currently show "Price on request".
- **Catalogue pages 7 and 8** describe near-identical 15 L and 25 L online systems at different
  prices. The photographs differ (open stainless frame on page 7, enclosed cabinet on page 8), so
  both are listed and labelled by build. Confirm that is correct.
- **Product photography rights.** The images come from the supplied V-Tech Aqua catalogue. Confirm
  you are licensed to publish them, or replace them with your own shots.
- **Gold-grade filter list.** The catalogue titles the Gold models "RO + UF + TDS + ALKALINE" but
  lists a UV filter rather than a UF filter in the cartridge line. Both are reproduced as printed.
