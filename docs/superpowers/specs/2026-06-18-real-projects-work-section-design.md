# Real projects in the Work section - design

**Date:** 2026-06-18
**Branch:** redesign/hero-blueprint
**Status:** approved (design)

## Context

The Work section currently renders **6 fictional placeholder case studies**
(`lib/content/work.ts`) using gradient placeholders (`CoverPanel`) - the site
ships **zero real imagery**; the `CaseStudy.cover` field exists but is unused.
Cards link to internal `/work/[slug]` case-study pages built from invented
`challenge` / `approach` / `gallery` / `results` content.

The owner has 5 **real, live** builds (screenshots staged in `data/`). We are
replacing the placeholders with these and wiring real cover images.

## Decisions

- **Replace** all 6 placeholders with the 5 real projects (owner's order).
- **Cards link to the live sites** (new tab). The live site is the case study -
  this avoids fabricating metrics for what are brand/marketing builds.
- **Delete** the now-unreachable internal case-study system.
- **Copy** is written from the actual live sites (researched).
- Scope is the **Work area only**. Site-wide positioning copy (home hero / proof
  stats claiming "Web · AI · Apps", "Gov + university", "AI competition won") is
  **out of scope** and flagged separately.

## The 5 projects (final data)

All are **Web · Brand**. Order is owner-specified. `featured` = the 4 client
sites (home "Selected work"); Omar Karaf (owner's own portfolio) shows only in
the full `/work` grid.

| # | slug | title | client (type) | sector (site) | accent | featured | href |
|---|------|-------|---------------|---------------|--------|----------|------|
| 1 | `balance-coffee` | Balance Coffee | Specialty coffee & roaster | Marketing site | `#a1957e` | yes | https://balancecoffee.netlify.app/ |
| 2 | `master-auto` | Master Auto | Auto customization & detailing | Marketing site | `#e8261f` | yes | https://masterauto.netlify.app/ |
| 3 | `melty` | Melty | Dessert café & coffeehouse | Marketing site | `#4a3026` | yes | https://melty-cafe.netlify.app/ |
| 4 | `history` | History | Fine-dining restaurant | Marketing & reservations | `#e8a868` | yes | https://history-rest.netlify.app/ |
| 5 | `okaraf` | Omar Karaf | Personal portfolio | Portfolio site | `#1a1a1a` | no | https://okaraf.netlify.app/ |

Summaries (one line each):

- **Balance Coffee** - A warm, editorial site for a specialty coffee shop and roaster - menu, daily, and careers, with a bilingual RU/EN toggle.
- **Master Auto** - A bold single-page site for an auto customization and detailing shop - wraps, tint, PPF, ceramic, and tuning, one tap from contact.
- **Melty** - An elegant site for a Nalchik dessert café - built to show a chocolate-led menu and walk a visitor to the door.
- **History** - A moody one-page site for a fine-dining restaurant in Nalchik - set the mood, then turn the visitor into a table booking.
- **Omar Karaf** - A monochrome developer portfolio - a fluid marbled hero and project case work, built to win design-led inquiries.

Covers: `public/work/<slug>.webp`. Image source files: `data/*` (kept as
staging). `melty.png` (2.7 MB) is converted to webp to match the others.

## Components & files

### Images
- New `public/work/` with optimized `.webp` covers (one per slug).
- Convert `data/melty.png` → `public/work/melty.webp`; copy the four existing
  `.webp` files in. Originals remain in `data/` (untracked staging).

### `CoverPanel` (`components/ui/CoverPanel.tsx`) - extend, backward-compatible
- Add optional props: `src?`, `alt?`, `tint?`, `priority?`, `position?`.
- When `src` present: render the existing gradient as the backdrop, then a
  `next/image` (`fill`, `object-cover`, `object-position` from `position`),
  with `tint` (project accent) as the load-in background color. `index`/`label`
  overlays become white + soft shadow for legibility over photography.
- When `src` absent: unchanged gradient behavior (used by `studio/Team`).
- `sizes="(min-width: 768px) 50vw, 100vw"`.
- **Must pass `quality={80}`** - `next.config.ts` restricts `images.qualities`
  to `[70, 80, 90]`, and `next/image`'s default (75) is not in that set, which
  errors under Next 16. Set `priority` on the first one or two featured covers.

### `WorkCard` (`components/sections/work/WorkCard.tsx`)
- Replace internal `<Link href="/work/{slug}">` with
  `<a href={item.href} target="_blank" rel="noopener noreferrer">`
  (keep `data-cursor`, the ↗ affordance, hover). Add an accessible label noting
  "opens in new tab". Pass `item.cover`, `alt`, `item.accent`, `position` to
  `CoverPanel`.

### Data (`lib/content/work.ts`, `lib/content/types.ts`)
- Replace the `work` array with the 5 projects above.
- `CaseStudy` type: keep `slug, title, client, sector, year, disciplines,
  accent, cover, summary, featured`; **add** `href` and optional
  `coverPosition`; **remove** `role, challenge, approach, gallery, results`.
- Remove now-unused interfaces `CaseApproach`, `GalleryPanel`, `WorkResult`.
- Remove `getCase` / `getNextCase`. Keep `featuredWork`.
- Derive the filter list from data:
  `disciplines = [...new Set(work.flatMap(w => w.disciplines))]` → renders
  **All · Web · Brand**.

### Remove case-study system
- Delete `app/work/[slug]/page.tsx`.
- Delete `components/sections/work/{CaseHero,CaseBody,CaseGallery,CaseResults,NextProject}.tsx`.

### Copy (`lib/content/copy.ts`)
- Rewrite `copy.work.sub` so it no longer claims "web, AI, and apps". New:
  "A selection of live sites, built for real businesses - each one shipped and
  in the wild. Open any to see it live."
- Leave home/services positioning untouched (out of scope).

### Tests (`tests/content.test.ts`)
- Rewrite the "work content invariants" block to the new model:
  - exactly 5 projects; slugs unique + url-safe;
  - `featuredWork.length >= 3`;
  - every project has a non-empty `summary`, a `cover` under `/work/`, a valid
    `https://…` `href`, and ≥1 discipline.
- Drop the `results`/`approach`/`gallery` and `getCase`/`getNextCase` assertions.
- Leave the "services content invariants" block unchanged.

## Verification
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` all green.
- Run the app; visually confirm covers render on `/` (Selected work) and `/work`,
  that cards open the correct live site in a new tab, and that the filter row
  shows only All · Web · Brand. **Tune `coverPosition` per image** so each brand's
  key composition (wordmark / hero) is framed, not cropped away.

## Out of scope (flagged, not changed)
- Home hero eyebrow/headline and proof stats still say "Web · AI · Apps",
  "Gov + university", "AI competition won" - these no longer match a portfolio
  of café/restaurant/auto/portfolio brand sites. Owner to decide separately.
- `okaraf.webp` is a comparatively low-resolution capture; if it looks soft at
  cover size, flag to owner rather than silently re-capturing (owner supplied it).
