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

This is the **content-free base**. Every fact slot is a visible TODO
placeholder (tinted chips / striped plates).

**Next step:** add resume, bios, project write-ups, and images to
`source-material/`, then run the Phase 1 plan (content inventory, site map)
and pour the real content in.

## TODO list (every placeholder on the site)

| # | Item | Where | Notes |
|---|------|-------|-------|
| 1 | Name | `<title>`, nav brand, hero, footer | |
| 2 | Role / discipline kicker | Hero | |
| 3 | Hero lede (strongest true claim) | Hero | 1–2 sentences |
| 4 | Meta description + OG title/description | `<head>` | |
| 5 | OG social card image | `<head>` | 1200×630px |
| 6 | Project entries (name, description, links) | Selected work | one card per project |
| 7 | Project screenshots | Selected work | 1200×750px each |
| 8 | Experience entries (dates, role, employer, description) | Experience | one entry per position |
| 9 | Bio | About | |
| 10 | Headshot | About | 640×800px |
| 11 | Contact email | Contact | as `mailto:` link |
| 12 | Social / professional links | Contact | |

## Deploy

GitHub Pages: Settings → Pages → deploy from branch, root folder.
Netlify: drag the folder onto app.netlify.com/drop — no config needed.
