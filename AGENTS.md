<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lumako type & brand

One font family site-wide: **Inter** (variable), wired as `--font-grotesk` → `--font-display` /
`--font-sans` in `styles/globals.css` (`@theme` is the source of truth for all tokens). Geist Mono
is code / ledger only. The canonical text reading is the home "Let's build something" disciplines
section (`components/sections/home/ServicesOverview.tsx`) - match it everywhere:

- **Headings:** `font-medium` for display / section / hero headlines, `font-semibold` for card and
  sub-headings, tight tracking. Never `font-light`. The home hero (`MOST WORK GETS SCROLLED PAST`)
  is the one exception, kept `font-extrabold uppercase`.
- **Body copy:** `text-fg-body` (`--color-fg-body` = `#3f3f3f`) + `leading-relaxed`. Not `text-fg-muted`.
- **Eyebrows / small labels:** the shared `.label-caps` (uppercase, `.18em`, `text-fg-muted`) - keep
  these quiet. Color ladder: `fg` (ink/headings) → `fg-body` (body) → `fg-muted` (labels) → `fg-dim` (fine print).
- **One lume accent** (`#D49A2E`), used minimally: wordmark dot, focus rings, key rules, the single
  footer glow, one lume button per view. Lume *text* must use `lume-deep` (`#9C6E1B`) for contrast.
