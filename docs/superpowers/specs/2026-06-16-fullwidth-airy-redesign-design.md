# Full-width "airy reference" redesign - design spec

**Date:** 2026-06-16
**Status:** Approved (pending spec review)
**Scope:** All 5 routes (`/`, `/work`, `/work/[slug]`, `/services`, `/studio`, `/contact`) + shared layout (Nav, Footer) + UI primitives + global tokens.

---

## 1. Goal

Sections are currently capped at `--content-w: clamp(40rem, 86vw, 96rem)` (max 1536px) and centered, leaving large empty margins on wide monitors. The user wants sections to run **full viewport width**, and a redesign in the style of the **Left Coast Design Studio** reference: airy, light, full-bleed, asymmetric, white soft-shadow cards.

**Decisions (from brainstorming):**

1. **Visual style:** Clone the reference look fully - neutral black/white/gray, gold accent dropped, softer/rounder cards, airy whitespace.
2. **Hero:** Keep the 3D WebGL hero as a full-bleed backdrop; restructure the text on top into an asymmetric layout (big headline left, supporting copy upper-right, CTAs below).
3. **Scope:** All pages.
4. **Confirmed opinionated calls:** surface inversion (gray page + white shadow cards) = yes; fold Clients into floating logo chips on the CTA panel = yes.

## 2. Non-goals

- No copy/content changes. `lib/content/*` is untouched; Vitest content-invariant and contact-validation tests must stay green.
- No change to 3D hero geometry, the motion/reveal system, page transitions, smooth scroll, or accessibility guarantees (skip link, focus-visible, reduced-motion).
- No new dependencies.
- No routing/IA changes.

---

## 3. The foundation - global tokens & layout primitives (`styles/globals.css`)

### 3.1 Remove the width cap

- Remove `--content-w` / `--content-w-narrow` as centering caps.
- `.container-x` becomes full-width with gutters only:
  ```css
  .container-x { width: 100%; padding-inline: var(--gutter); margin-inline: 0; }
  ```
- New fluid gutter token: `--gutter: clamp(1.25rem, 3.5vw, 4rem)` (~20px → 64px).
- `.container-narrow` is **repurposed** from a centered narrow container into an in-grid reading-width helper: it keeps full-bleed gutters but its *text children* cap at a readable measure (~`60-72ch`) via utility classes, not a centered wrapper. (Where it was the section wrapper for long text, swap to `.container-x` + a `max-w-[68ch]` text column.)

### 3.2 Grid helper

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```
Sections place content asymmetrically (e.g. headline `col-span-5`, content `col-span-7` / `col-start-7`). Existing 12-col sections (ProcessTeaser, CaseHero, CaseBody, NextProject, StudioHero, Footer) migrate onto this helper.

### 3.3 Surface inversion (airy palette)

| Token | Old | New |
|---|---|---|
| `--color-bg` | `#ffffff` | `#f3f3f2` (warm light gray page) |
| `--color-surface` (new) | - | `#ffffff` (white cards) |
| `--color-bg-elev` | `#fafafa` | `#ffffff` |
| `--color-card` | `#f5f5f5` | `#ffffff` |
| `--shadow-card` (new) | - | `0 1px 2px rgba(0,0,0,.04), 0 10px 30px rgba(0,0,0,.06)` |
| `--shadow-card-hover` (new) | - | `0 2px 4px rgba(0,0,0,.05), 0 18px 48px rgba(0,0,0,.09)` |

### 3.4 Rounder radii

- `--radius` card: `1rem` (16px) - was 10px.
- `--radius-panel` (new): `1.5rem` (24px) for big feature/CTA panels.

### 3.5 Neutralize the accent (drop gold)

- Redefine accent tokens to neutral ink/gray, OR sweep usages to neutral classes. Net effect: eyebrow numbers, list bullets, step indices, the active-nav underline → ink (`--color-fg`) / muted gray, **not** gold.
- Remove/neutralize: `.glow-accent` (→ soft neutral light bloom or removed), footer gold glow + gold dot, gold `::selection` (→ light gray bg + ink text), gold focus outline (→ neutral dark outline, keep 2px visible contrast for a11y).
- **Hero canvas:** keep the scene; desaturate any gold tint in the WebGL materials/glow and the surrounding `glow-accent` wash to a soft neutral bloom. (Verify in `components/three/HeroCanvas.tsx`.)

> A11y guard: focus-visible outline must remain clearly visible against the new gray bg (use `--color-fg` / sufficient contrast). Do not remove focus styling when removing gold.

---

## 4. The card language (single biggest visual change)

Today, "card" sections use a **hairline grid**: `gap-px overflow-hidden rounded-[10px] border border-line bg-line` with `bg-bg` cells (flat boxes split by 1px lines). Replace this pattern **everywhere** with **discrete white cards**:

```
bg-[--color-surface] rounded-2xl shadow-[--shadow-card] p-8/p-10  (real gap-* between cards)
```

floating on the gray page. Applies to: **Stats, Testimonial, CaseResults, Values, ProcessTeaser, Engagements, Team.** Hover lift via `--shadow-card-hover` where the card is interactive.

---

## 5. Section archetypes

Every section maps to one archetype:

- **A. Asymmetric header** - eyebrow + huge headline in a left column (~`col-span-5`), supporting copy or a "view all →" link in the upper-right (`col-start-8 col-span-5`). Used by: Manifesto, ServicesOverview header, ProcessTeaser header, Disciplines, ProcessSteps, Engagements header, StudioHero, CaseBody.
- **B. Full-width card row** - white soft-shadow cards spanning the full width. Used by: Stats (4-up), CaseResults, Values, Team, Testimonial benefits, Engagements cards.
- **C. Text-left / media-right row** - text column one side, image(s) filling the rest to the edge. Used by: SelectedWork, NextProject, CaseHero. Add a reference-style "eyebrow + big headline + body" text column beside large project images.
- **D. Full-bleed grid/gallery** - edge-to-edge. Used by: WorkGrid, CaseGallery, SelectedWork grid.
- **E. Big rounded feature panel** - CtaBand → large rounded light panel (`--radius-panel`), centered headline + button, with **floating brand/logo chips** scattered around (fed by existing client names - see §6).

---

## 6. CTA panel + Clients merge

- `CtaBand` becomes archetype **E**: a full-width section containing a large rounded light panel (inset by gutters). Centered eyebrow + headline + sub + button.
- **Floating chips:** small rounded white chips bearing client names (from `lib/content` clients data already used by `Clients.tsx`), absolutely positioned around the panel at slight rotations, with subtle parallax/entrance motion (respecting reduced-motion). This replaces the standalone `Clients` marquee on the Studio page; on Home the panel gains the chips too.
- `Clients.tsx` marquee is removed from the Studio page composition (Studio ends on the CTA panel). If chip layout proves too noisy on mobile, chips collapse to a simple centered logo/name strip below the button (mobile fallback).

---

## 7. Page-by-page treatment

### Home (`app/page.tsx`)
- **Hero** - 3D backdrop full-bleed; text restructured: big headline left (`col-span-6/7`), eyebrow + sub upper-right (`col-start-8`), CTAs below the headline. Neutral bloom (no gold).
- **Manifesto** - archetype A.
- **ServicesOverview** - archetype A header + full-width expandable service rows (keep accordion behavior; rows span full width, indices neutral).
- **SelectedWork** - archetype C/D: header + edge-to-edge work cards (staggered grid filling width).
- **ProcessTeaser** - archetype A header + archetype B white card row (phase cards).
- **Stats** - archetype B: 4 white cards across full width (reference `$1B / 20+ / …` style).
- **Testimonial** - archetype B card(s).
- **CtaBand** - archetype E (panel + floating chips).

### Work index (`app/work/page.tsx`)
- Hero: asymmetric (eyebrow + headline + sub, de-centered).
- `WorkGrid`: archetype D, full-bleed; `WorkCard` gets white card / soft-shadow treatment on its media + neutral tags.

### Case study (`app/work/[slug]/page.tsx`)
- `CaseHero`: archetype C - meta row + h1, then text summary + full-width image; neutral glow.
- `CaseBody`: archetype A - sticky left challenge column, right approach list (neutral indices, white-card or clean hairline-free steps).
- `CaseGallery`: archetype D full-bleed grid.
- `CaseResults`: archetype B white card row.
- `NextProject`: archetype C.

### Services (`app/services/page.tsx`)
- `ServicesHero`: asymmetric (de-centered).
- `Disciplines`, `ProcessSteps`: archetype A full-width rows (neutral bullets/indices).
- `Engagements`: archetype A header + archetype B white card row.

### Studio (`app/studio/page.tsx`)
- `StudioHero`: archetype A.
- `Values`, `Team`: archetype B white card rows.
- `Recognition`: full-width list (neutral).
- `Clients`: removed (merged into CTA panel chips, §6).

### Contact (`app/contact/page.tsx`)
- Full-width: form in left column, studio details right, both reaching the gutters. Neutral field styling (`Field.tsx`: neutral focus border, neutral required marker).

### Nav (`components/layout/Nav.tsx`)
- Full-width bar with the reference's subtle top light gradient; neutral active state (ink underline / weight change, no gold); dark "Contact" pill (already close).

### Footer (`components/layout/Footer.tsx`)
- Stays the full-width dark band but **flattened to neutral near-black** (gold glow + gold dot removed), columns pushed to the gutters via `.grid-12`.

---

## 8. UI primitive touch-ups

- `Button.tsx` - radius → new card radius; remove the `lume` gold variant styling (map to neutral) or repoint to ink.
- `Tag.tsx` - active state neutral (no `accent-soft`); keep rounded-full.
- `Field.tsx` - focus border + required marker neutral; keep hairline underline.
- `CoverPanel.tsx` - neutral gradient placeholder (desaturate accent); add soft shadow + new radius where used as a card.
- `Eyebrow.tsx` - index color neutral.
- `Counter`, `Reveal`, `TextReveal`, `Marquee`, `Logo` - no visual cap changes; verify no hardcoded gold.

---

## 9. Migration mechanics

- Most sections currently wrap content in `.container-x`. Since `.container-x` becomes full-width, the *width* change is automatic for those; the work is **restructuring inner layout** (asymmetric grids, card swaps) per archetype.
- Search-and-replace targets (from inventory): every `gap-px border border-line bg-line` hairline-grid → white-card pattern; every `text-accent`/`bg-accent`/`accent-soft`/`glow-accent` → neutral; every `rounded-[10px]` → new radius token.
- Keep all `data-cursor`, motion variants, and reveal wrappers intact.

## 10. Verification

- `npm run typecheck`, `npm run lint`, `npm run test` (must stay green - content untouched).
- `npm run build`.
- Visual QA at 3 widths: ~1280px (laptop), ~1920px (desktop), ~2560px+ (ultrawide) - confirm full-bleed, readable text sub-columns, no horizontal scroll (`overflow-x: clip` already on body).
- Reduced-motion check (floating chips, reveals, hero).
- A11y: focus-visible visible on gray bg; nav active state distinguishable without color.

## 11. Risks

- **Gold removal is global** - a missed `text-accent` will read as an off-brand fleck. Mitigate with a final grep sweep for `accent`/`glow` in `components/` + `styles/`.
- **Hero canvas tint** - if the WebGL scene bakes in gold, desaturation needs a shader/material tweak; fall back to keeping a very faint neutral-warm bloom if full desaturation looks dead.
- **Floating chips on mobile** - provide the collapsed fallback (§6).
- **Ultrawide line length** - enforced by capped text sub-columns; verify on the few prose-heavy spots (Manifesto, CaseBody, StudioHero).
