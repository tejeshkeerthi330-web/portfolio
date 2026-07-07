# Portfolio — base scaffold

Static site: semantic HTML + one CSS file + a few lines of vanilla JS
(mobile nav). No frameworks, no build step. Open `index.html` directly or
drop the folder onto GitHub Pages / Netlify as-is.

## Status

This is the **content-free base**. Every fact slot is a visible TODO
placeholder (yellow striped/highlighted). The design system lives entirely
in CSS custom properties at the top of `styles.css`, so the real design
direction — chosen after source documents arrive — is applied by swapping
tokens, not rewriting rules.

**Next step:** add resume, bios, project write-ups, and images to
`source-material/`, then run the Phase 1 plan (content inventory, site map,
three design directions).

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
