# Work marquee - design

Date: 2026-06-19
Status: Approved

## Goal

Replace the static, staggered two-column work grid on the home page with a
continuously auto-sliding horizontal marquee, matching the supplied reference:
landscape cover cards that scroll on their own, each labelled with the project
name and small category tag chips, peeking at both edges of the viewport.

## Scope

Only the card layout inside the work section changes. The section header is
kept verbatim:

- headline: `copy.home.work.headline` ("Shipped, not proposed.")
- link: `copy.home.work.link` ("View all work" -> `/work`)

The static `featuredWork` grid of rich `WorkCard`s is removed in favour of a
full-bleed marquee that shows all five `work` items.

## Decisions

- Card labels: reference style - project name + small `Web` / `Brand` tag
  chips only. No client/sector line, no year.
- Content: all five projects from `work` (includes the Omar Karaf portfolio
  piece), for a fuller loop before it repeats.
- Motion: pure CSS animation (no JS-driven animation), continuous and linear.
- Drag-to-scrub: out of scope. Auto-slide plus pause-on-hover covers the ask.
- RTL direction flip for the Arabic toggle: out of scope. Marquee scrolls
  leftward (LTR) for now; can be revisited when the language toggle drives
  document direction.

## Architecture

Three small, isolated units:

### `components/sections/home/SelectedWork.tsx` (server component, edited)

Stays the section. Renders the existing header grid (headline + "View all
work" link) inside `container-x`, then renders `<WorkMarquee items={work} />`
full-bleed below it. Keeps server rendering for the header.

The section element keeps `section-lg` and gains `overflow-hidden` so the
full-bleed track is clipped to the viewport.

### `components/sections/home/WorkMarquee.tsx` (new, client component)

`"use client"`. The full-bleed animated track.

- Props: `{ items: CaseStudy[] }`.
- Renders the item list **twice**, back to back, inside a flex track: the
  first set is the real content; the second set is a visual clone marked
  `aria-hidden` and removed from the tab order.
- The track animates `translateX(0)` -> `translateX(-50%)`, `linear`,
  `infinite`, via a CSS class + keyframes (defined in the global stylesheet).
- Each card cell carries a uniform right margin so the two duplicated sets are
  perfectly periodic; `-50%` lands the first clone exactly where the first real
  card began, giving a seamless, jump-free loop.
- Pause on hover and on keyboard focus-within by toggling
  `animation-play-state: paused` (CSS, via `:hover` / `:focus-within` on the
  track wrapper - no JS state needed).
- `prefers-reduced-motion: reduce`: the animation is disabled and the wrapper
  becomes a normal horizontally scrollable row (`overflow-x: auto`) so all
  content stays reachable. Handled in CSS via the media query.

### `components/sections/work/WorkSlide.tsx` (new)

One sparse card. Plain presentational markup (no hooks), placed next to
`WorkCard`. `WorkCard` is left untouched so the `/work` page keeps its rich
cards.

- Props: `{ item: CaseStudy }`.
- Anchor opening `item.href` in a new tab (`target="_blank"`,
  `rel="noopener noreferrer"`), with `data-cursor="view"` and the same
  descriptive `aria-label` pattern as `WorkCard` ("... opens the live site in
  a new tab").
- Cover via existing `CoverPanel` with the existing `CARD_RATIO` (1916 / 1263),
  `tint={item.accent}`, `position={item.coverPosition}`.
- Keeps the corner `↗` hover badge from `WorkCard` for consistency.
- Below the cover: project name (`font-display`, light) + the discipline chips
  rendered with the existing chip styling (rounded, bordered, `label-caps`).

## Layout & sizing

- Header: inside `container-x` (unchanged grid).
- Marquee: full-bleed (rendered outside `container-x`), top margin to match the
  current `mt-16` rhythm.
- Card width: `clamp(280px, 32vw, 460px)` so roughly 3-4 cards show across a
  desktop viewport and it scales down on mobile. Landscape via `CARD_RATIO`.
- Inter-card spacing: uniform right margin on each cell (the marquee periodicity
  depends on this being uniform; do not use flex `gap`, which breaks the `-50%`
  math by half a gap).
- Edges: hard cut at the viewport edge (no fade), matching the reference.

## Accessibility

- Real set: normal links, focusable, read once by screen readers.
- Clone set: `aria-hidden="true"` and not focusable (so projects are not
  announced or tabbed through twice).
- Pause-on-focus-within keeps the row still while a keyboard user tabs across
  the real cards.
- Reduced-motion users get a static, manually scrollable row.

## CSS

Add marquee keyframes + helper classes to `styles/globals.css` (where the
existing design tokens / utilities live). Expose duration as a CSS custom
property (`--marquee-duration`, default ~45s) so speed is tunable in one place.
Disable the animation and enable horizontal scroll under
`prefers-reduced-motion: reduce`.

## Tests

- New test for `WorkMarquee`:
  - renders all five projects (by title),
  - each card links to its live `href`,
  - the cloned (second) set is `aria-hidden`.
- Update or remove any existing test that asserts the old `SelectedWork` grid
  structure.

## Files touched

- Edit: `components/sections/home/SelectedWork.tsx`
- New: `components/sections/home/WorkMarquee.tsx`
- New: `components/sections/work/WorkSlide.tsx`
- Edit: `styles/globals.css` (marquee keyframes + classes)
- New / edit: marquee test under `tests/`
