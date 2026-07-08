# Portfolio — "Undertow"

Static site: semantic HTML + one CSS file + vanilla JS, plus a vendored
copy of [Lenis](https://github.com/darkroomengineering/lenis)
(`assets/lenis.min.js`, ~16KB) for inertia scrolling — loaded as plain
scripts, no build step. **Fully self-contained**: fonts (Fraunces + Inter,
latin subsets) are served from `assets/fonts/`, so the site makes zero
third-party requests and works offline. Open `index.html` directly or drop
the folder onto GitHub Pages / Netlify as-is.

Also ships: `404.html` (served automatically by GitHub Pages),
`robots.txt` + `sitemap.xml`, per-page canonical URLs and theme-color,
JSON-LD (Person on home/about, ScholarlyArticle on the study pages),
per-study Open Graph cards, SVG + PNG + Apple touch icons, and a print
stylesheet.

## Design system — Undertow

One continuous cool canvas; color lives in large soft gradient pools that
drift with scroll and lean toward the cursor; the page closes by sinking
into a deep petrol field. No cards, no bands. All tokens live in `:root`
at the top of `styles.css`. Motion (scroll drift, masked reveals, weighted
hover, inertia scrolling) is defined in `script.js`; it is fully
progressive — the page is complete with JS off or `prefers-reduced-motion`
on. Taste profile recorded in `CLAUDE.md`.

## Status

**Complete — six pages, one continuous canvas.** All text content is real
and traces to the documents in `source-material/` (resume + two research
papers). A petrol veil sweeps between pages (JS off / reduced motion: no
veil, instant navigation).

- `index.html` — the cover: full-height identity hero, research index
  with stat callouts, a "Currently" line, deep contact close.
- `research.html` — the archive: both studies with data-graphic teasers,
  summaries, and paper PDFs (hosted in `papers/`).
- `aerodynamics.html` — interactive study: pick any of seven surface
  finishes and the flow diagram, readouts, and drag chart settle to that
  finish's reported values (Table 1 of the paper).
- `bitcoin.html` — interactive study: walk Bitcoin's 2011–2013 price arc
  station by station, as recorded in the paper's event chart.
- `about.html` — bio + headshot, experience ledger, education, activities.
- `contact.html` — a full-deep closing page: email, location.

Every page ends with a "Next" ribbon forming a reading loop
(cover → archive → study 01 → study 02 → about → contact → cover). The
optimized resume lives at `source-material/resume-optimized.md`.

## TODO list

**Complete.** All placeholders are resolved: headshot at
`assets/img/headshot.jpg` (swap that one file to update it), OG share card
at `assets/img/og-card.jpg`, favicon at `assets/favicon.svg`. No social
links are listed by choice; contact is email + location.

Deliberate omission: the phone number on the resume is **not** published
on the site (public-web privacy); it remains in the resume documents.

Optional upgrades, whenever available: a sharper headshot (replace the one
file), real SimScale screenshots on `aerodynamics.html`, social links in
the Contact section.

## Deploy — GitHub Pages

1. On github.com → this repo → **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**,
   pick the branch the site lives on, folder **/ (root)**, and Save.
3. The site appears at `https://<user>.github.io/portfolio/` in about a
   minute. The `og:image` meta tags assume that URL — edit them in the
   three HTML files if deploying elsewhere.

Netlify alternative: drag the folder onto app.netlify.com/drop — no config.
