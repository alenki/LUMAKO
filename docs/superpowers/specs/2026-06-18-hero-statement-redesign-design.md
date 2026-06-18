# Hero redesign - "Yours won't" (bold annotated statement)

**Date:** 2026-06-18
**Status:** Approved (concept, copy, marker, and full composition confirmed with user via visual companion)
**Branch:** `redesign/hero-blueprint`
**Replaces:** the Canvas-2D "blueprint → built" hero (`components/sections/home/Hero.tsx` +
`components/hero/HeroBlueprint.tsx` + `components/hero/blueprint/*`). The user wants the hero
**completely rebuilt** - leading with creativity and attention rather than the "build first,
pitch second" positioning thesis.

## 1. Goal

The current hero leads with the studio's argument (*"Built first. Pitched second. Proof, then
price."*) over a decorative canvas. The user wants the opposite priority: **a hero that grabs
attention first**, high-end and extremely creative, with copy that has nothing to do with the
"build then pitch" framing. Reference set: Hero Collective, (no), Grain & Mortar, Lando Norris,
LUSION, THE LINE, Left Coast.

Chosen direction (confirmed in brainstorming): **Direction 03 - the bold annotated statement**
(the Hero Collective lane, kept inside Lumako's light, monochrome-plus-one-gold brand world). A
massive uppercase typographic statement where the payoff word is hand-circled by a single
self-drawing gold marker. The marker is the hero's one expressive lume moment.

## 2. The statement + marker

**Headline (3 explicit lines, uppercase):**

```
MOST WORK GETS
SCROLLED PAST.
YOURS WON'T.
```

- The word **won't** (last line) is encircled by a rough, hand-drawn **gold marker circle** that
  **draws itself in** after the headline lands.
- Confirmed removals from earlier mockups: **no second/faint "gray ellipse" pass** (single clean
  gold stroke only) and **no traveling nib dot** (just the stroke draw).

**Lower band:**
- Left: one-line studio descriptor +	two CTAs.
  - Descriptor: *"Lumako is a solo full-stack studio - web, AI, and apps that ship and stay live.
    Built to be remembered, not scrolled past."*
  - CTA primary (ink fill - `Button` `variant="primary"`): **Start a project** → `/contact`
  - CTA secondary (ghost - `Button` `variant="ghost"`): **See the work →** → `/work`
- Right: a small **Scroll** cue (caps label + a light pulse falling down a hairline bar).

**Removed vs. today's hero:** the `01 · Web · AI · Apps` eyebrow, the old headline/sub, the
isometric canvas, and the lume CTA button (see §5 color discipline).

## 3. Composition + type

- **Full-bleed**, light warm-gray page (`--color-bg` `#f3f3f2`), `min-height: 100dvh`,
  horizontal padding `--gutter`. Headline is **left-aligned** and owns the screen.
- The Hero component renders **no navigation** - the existing site navbar
  (`components/layout/Nav.tsx`, mounted by the layout) stays exactly as-is. The hero content sits
  under the existing header; reserve header height with `pt-[var(--header-h)]` as today.
- **Headline type:** `font-display` (Inter Tight), weight **800**, `text-transform: uppercase`,
  `line-height: .85` (relaxes to ~.9 below 760px), `letter-spacing: -.05em`,
  `font-size: clamp(46px, 10.8vw, 210px)`. The 10.8vw middle term + tight tracking keep the
  longest line ("MOST WORK GETS") within the content width across breakpoints while the 210px cap
  lets it scale hard on large displays. Line breaks are explicit (not auto-wrapped).
- **Background atmosphere:** the existing light legibility wash (radial white) + `.noise-veil`
  grain, kept subtle so the gold marker is the only loud thing on screen.

## 4. The marker (single gold circle)

- An inline **SVG** positioned over the word "won't" (`position:absolute` inside a
  `position:relative` `.mark` span), `overflow: visible`, `pointer-events: none`,
  `aria-hidden="true"` (decorative).
- One `<path>` - a deliberately rough, slightly overshooting ellipse loop - stroked in
  `--color-lume` `#d49a2e`, `stroke-width ≈ 5.5` (SVG user units in a `0 0 370 170` viewBox so it
  scales with the word), round caps/joins, `fill: none`.
- **Draw mechanism:** CSS `stroke-dashoffset` animation (NOT SMIL - SMIL silently failed to
  render the stroke in the user's browser during prototyping). `stroke-dasharray` and initial
  `stroke-dashoffset` are set to a length **safely greater than the path** (e.g. 1400; measured
  path ≈ 940) so the stroke is fully hidden until it draws, with no leftover sliver. The
  production component should set both to the **measured** `getTotalLength()` for exactness
  (with the large constant as the pre-measure fallback to avoid a flash-of-full-circle).
- Easing: CSS `cubic-bezier(.5, 0, .3, 1)`.

## 5. Color discipline (brandbook)

Per the brandbook ("monochrome, plus one light"; lume on under a fraction of any surface; two
accents at once is a system failure):
- The **gold marker circle is the single lume accent** in the hero (alongside the tiny logo dot
  in the existing nav, which is sanctioned chrome).
- CTAs are therefore **ink + ghost**, NOT a lume button - a gold CTA would split the accent and
  cheapen the gesture. This is a deliberate change from today's lume CTA in the hero.
- Focus rings remain `--color-lume-deep` per `globals.css`.

## 6. Entry choreography (Framer Motion - `motion/react`)

Time-zero is hero mount. Targets (tuned in implementation):

1. **Headline reveal, line-by-line.** Each line is wrapped in an `overflow:hidden` mask; the inner
   line rises `translateY(112% → 0)`, staggered ~**0.30s / 0.42s / 0.54s**, duration ~1s,
   `--ease-out-expo`.
2. **Mask release.** After the last line finishes rising (~**1.55s**), each line's mask switches
   to `overflow: visible` so the circle can overflow the line box (the mask was clipping the
   circle's top/bottom in prototyping). In React this is a state flip on
   `onAnimationComplete`, not the CSS discrete-overflow hack used in the mockup.
3. **Circle draws** ~**1.6s**, duration ~**1.45s** (`cubic-bezier(.5,0,.3,1)`), starting just
   after the mask releases so it is never cropped.
4. **Lower band:** descriptor + CTAs fade-up ~**1.1s**; Scroll cue fades-up ~**1.4s**.

**Reduced motion (`prefers-reduced-motion`):** no rises, no draw - headline is static and the
circle renders **pre-drawn** (`stroke-dashoffset: 0`). Reuse the existing `useReducedMotion` hook.

## 7. Architecture

- **`components/sections/home/Hero.tsx`** - rewritten client component. Owns the section,
  background layers, the headline (with line-reveal), the marker, and the lower band. No canvas,
  no nav.
- **`components/hero/HeroMarker.tsx`** (new) - the decorative SVG circle + its draw/reduced-motion
  logic, isolated so it can be reasoned about and reused. Props: the measured-length handling and
  a `reduce` flag. Keeps `Hero.tsx` focused.
- **Line reveal** - either a tiny local helper that maps the lines array to masked motion spans,
  or inline; small enough to live in `Hero.tsx`.
- **Removed (dead after this change):** `components/hero/HeroBlueprint.tsx` and
  `components/hero/blueprint/*` (geometry, phases, render) - `Hero.tsx` is their only app
  consumer. Their **test files must be removed with them**: `tests/hero-blueprint.test.tsx`,
  `tests/hero-phases.test.ts`, `tests/hero-geometry.test.ts`, `tests/hero-render.test.ts`. Update
  the `README.md` mention of the blueprint hero. `lib/useReducedMotion.ts` stays - it is used by
  other components (`MagneticButton`, `LogoChips`) and by the new hero.
- Reuse existing primitives where they fit: `Button` (`variant="primary"` ink fill,
  `variant="ghost"` bordered), `.label-caps` for the Scroll label, `--ease-out-expo`, the
  `.noise-veil` and `.glow-accent` utilities.

## 8. Content / data changes

`lib/content/copy.ts` → `home.hero` is restructured to carry the new statement:

- `lines: ["Most work gets", "scrolled past.", "Yours won't."]` - the headline, rendered uppercase
  via CSS (stored in sentence case for accessibility/readability).
- `mark: "won't"` - the word in the final line to encircle.
- `sub`: the new descriptor (see §2).
- `ctaPrimary: { label: "Start a project", href: "/contact" }`,
  `ctaSecondary: { label: "See the work", href: "/work" }`.
- Drop `eyebrow` and `highlight` from `home.hero` (no longer used by this hero). The `copy` object
  is `as const`, so its type is **inferred** - there is no hand-written hero interface in
  `lib/content/types.ts` to edit; changing the object updates the type. Just confirm the only
  consumer (`Hero.tsx`) matches the new shape and no other file reads the removed fields.
- House style: hyphens with spaces (` - `), never em-dashes (repo `_dash_fix.mjs` rule).

## 9. Accessibility

- The `<h1>` contains the full readable sentence ("Most work gets scrolled past. Yours won't.")
  as real text; uppercasing is presentational (`text-transform`), so screen readers get natural
  casing. The marker SVG is `aria-hidden`.
- CTAs are real links; keyboard focus shows the lume-deep ring on the light surface.
- Reduced motion fully honored (§6).

## 10. Verification

- `npm run lint` + `npm run build` clean; no unused imports after the blueprint deletion.
- Test suite green after removing the four blueprint test files (no dangling imports of deleted
  modules).
- Manual: load the homepage and confirm the choreography (headline rises → mask releases →
  single gold circle draws uncropped, no dot), at ~1280, ~1440, and ≥1920 widths plus a narrow
  mobile width; confirm the longest line never overflows/clips.
- Toggle `prefers-reduced-motion`: headline static, circle pre-drawn, no animation.
- Confirm the gold circle is the only lume on screen (no lume CTA).

## 11. Out of scope / non-goals

- No dark/cinematic variant (the user kept the light brand world).
- No change to nav, footer, or any section below the hero.
- No new color tokens, fonts, or dependencies (Framer Motion / `motion/react` is already in use).
