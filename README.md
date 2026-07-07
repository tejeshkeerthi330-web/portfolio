# Portfolio — "Undertow" base

Static site: semantic HTML + one CSS file + vanilla JS, plus a vendored
copy of [Lenis](https://github.com/darkroomengineering/lenis)
(`assets/lenis.min.js`, ~16KB) for inertia scrolling — loaded as plain
scripts, no build step. Open `index.html` directly or drop the folder onto
GitHub Pages / Netlify as-is.

## Design system — Undertow

One continuous cool canvas; color lives in large soft gradient pools that
drift with scroll and lean toward the cursor; the page closes by sinking
into a deep petrol field. No cards, no bands. All tokens live in `:root`
at the top of `styles.css`. Motion (scroll drift, masked reveals, weighted
hover, inertia scrolling) is defined in `script.js`; it is fully
progressive — the page is complete with JS off or `prefers-reduced-motion`
on. Taste profile recorded in `CLAUDE.md`.

## Status

**Populated, with interactive study explorers.** All text content is real
and traces to the documents in `source-material/` (resume + two research
papers). Both papers are hosted in `papers/` and each has an interactive
explorer page built from its own reported data:

- `aerodynamics.html` — pick any of the seven surface finishes and the
  flow diagram, readouts, and drag chart settle to that finish's simulated
  values (Table 1 of the paper).
- `bitcoin.html` — walk Bitcoin's 2011–2013 price arc station by station,
  as recorded in the paper's event chart.

The home-page research spreads carry static data-graphic teasers (the
papers' own numbers — no stock imagery) linking into the explorers. The
optimized resume lives at `source-material/resume-optimized.md`.

## TODO list (remaining placeholders)

| # | Item | Where | Notes |
|---|------|-------|-------|
| 1 | Headshot | About | 640×800px |
| 2 | Social / professional links | Contact | GitHub, LinkedIn, etc. |
| 3 | OG social card image | `<head>` | 1200×630px |
| 4 | Real favicon | `<head>` | 32×32px |
| 5 | (Optional) SimScale screenshots | aerodynamics.html | real wall-shear/streamline plots could augment the drawn diagram |

Deliberate omission: the phone number on the resume is **not** published
on the site (public-web privacy); it remains in the resume documents.

## Deploy

GitHub Pages: Settings → Pages → deploy from branch, root folder.
Netlify: drag the folder onto app.netlify.com/drop — no config needed.
