# CLAUDE.md

## Design taste profile (settled — do not restart from boxes)

- Visual grammar: flowy continuous canvas. No bordered cards, no uniform
  rounded-rectangle grids, no layer-cake of full-width color bands with hard
  seams. Color lives as large soft ambient gradient fields that cross section
  boundaries; sections are announced by rhythm, scale, and whitespace.
- Palette: cool and low-saturation with one confident accent that does
  structural work as a full surface (currently petrol #1E5064 on a blue-gray
  mist canvas). Neutrals always carry a cast — never pure white, pure black,
  or default gray. The page must NOT read the same in grayscale.
- Composition: editorial asymmetry — oversized display type doing structural
  work, offset columns, elements crossing section seams.
- Motion: unhurried, one easing family (slow settle, no overshoot),
  transform/opacity only, native scrolling always honored, few deliberate
  reveals rather than fade-ups on everything, complete static page under
  prefers-reduced-motion.

## Content rules

- Every fact on the site must trace to a file in `source-material/`.
- Missing content gets a visible TODO placeholder with pixel dimensions,
  never an invented stand-in.
