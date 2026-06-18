# Full-width "airy reference" redesign - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every section run full-viewport width (remove the ~1536px cap) and reskin the whole site to the Left Coast reference look - airy, light, full-bleed, asymmetric, white soft-shadow cards on a warm-gray page, gold accent dropped to neutral, 3D hero kept as a full-bleed backdrop.

**Architecture:** A token + layout-primitive change in `styles/globals.css` makes `.container-x` full-width (so every section becomes full-bleed automatically); each section is then restructured onto a 12-column grid into one of five archetypes (asymmetric header / white-card row / text-left-media-right / full-bleed grid / feature panel). No content changes - `lib/content/*` is untouched, so all Vitest content/validation tests stay green.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (CSS-first `@theme`), Motion (Framer Motion), three / R3F, Lenis, Vitest.

**Spec:** `docs/superpowers/specs/2026-06-16-fullwidth-airy-redesign-design.md`

---

## Conventions (read once, applied in every task)

**Standard checks** - run after each task unless noted:
- `npm run typecheck` → expect: no errors.
- `npm run lint` → expect: clean (no new warnings/errors).
- `npm run test` → expect: all pass (content/validation tests are untouched and must stay green).

**Build/visual checks** - run at the end of each phase:
- `npm run build` → expect: success.
- Visual QA: `npm run dev`, then screenshot the affected route at three widths - **1280px** (laptop), **1920px** (desktop), **2560px** (ultrawide) - using the Playwright MCP (`browser_navigate` → `browser_resize` → `browser_take_screenshot`). Confirm: content reaches the gutters (full-bleed), body text stays in a readable sub-column, no horizontal scroll, cards render as white soft-shadow boxes on the gray page, no gold flecks remain.

**Commit cadence:** one commit per task, conventional-commit style, on branch `redesign/full-width-airy`.

**Do not touch:** `lib/content/*`, motion variants in `lib/motion.ts`, `data-cursor` attributes, `Reveal`/`TextReveal` wrappers (keep them), the skip link, reduced-motion handling.

---

## Shared patterns (canonical code - copy these into sections by archetype)

These are the building blocks referenced by name in the section tasks. They use tokens/classes created in Task 1.

**Pattern S - Full-width section shell** (every section). The `.container-x` is now full-width + gutters, so this is the standard wrapper. Drop `border-t border-line` from section wrappers (separation now comes from spacing + gray/white contrast):
```tsx
<section className="section-lg">
  <div className="container-x">
    {/* content placed on .grid-12 */}
  </div>
</section>
```

**Pattern A - Asymmetric header:**
```tsx
<div className="grid-12 items-end gap-y-8">
  <div className="col-span-12 md:col-span-6">
    <Eyebrow index="0X">{eyebrow}</Eyebrow>
    <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-[1.05] tracking-tight text-balance">
      {headline}
    </h2>
  </div>
  <div className="col-span-12 md:col-start-8 md:col-span-5">
    <p className="max-w-[46ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
      {sub}
    </p>
  </div>
</div>
```

**Pattern C - White card** (use the `.surface-card` helper from Task 1):
```tsx
<div className="surface-card p-10">
  {/* card content */}
</div>
```
Interactive cards add hover lift: `className="surface-card surface-card--hover p-10"`.

**Pattern R - White-card row** (replaces every `gap-px … border border-line bg-line` hairline grid):
```tsx
<div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {items.map((it) => (
    <div key={it.id} className="surface-card p-10">…</div>
  ))}
</div>
```

**Pattern M - Text-left / media-right row:**
```tsx
<div className="grid-12 items-center gap-y-10">
  <div className="col-span-12 md:col-span-4">{/* eyebrow + headline + body (max-w-[46ch]) + link */}</div>
  <div className="col-span-12 md:col-start-6 md:col-span-7">{/* media (CoverPanel / image), fills to the gutter */}</div>
</div>
```

**Pattern P - Feature panel** (CTA):
```tsx
<section className="section-lg">
  <div className="container-x">
    <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-card)] px-6 py-28 text-center md:py-36">
      <LogoChips />              {/* floating chips, absolutely positioned (Task 9) */}
      <div className="relative z-10 mx-auto max-w-[34ch]">
        {/* eyebrow + headline + sub + Button */}
      </div>
    </div>
  </div>
</section>
```

---

## Task 1: Foundation - global tokens & layout primitives

**Files:**
- Modify: `styles/globals.css`

- [ ] **Step 1: Invert surfaces + add `--color-surface` in the `@theme` block.** Change the "Surfaces" group and add a surface token:
```css
  /* Surfaces - airy: gray page, white cards */
  --color-bg: #f3f3f2;
  --color-bg-elev: #ffffff;
  --color-card: #ffffff;
  --color-card-2: #f6f6f5;
  --color-surface: #ffffff;
```

- [ ] **Step 2: Neutralize the accent tokens** (drop gold) in `@theme`:
```css
  /* Accent - neutralized to ink (no chroma) */
  --color-accent: #171717;
  --color-accent-deep: #000000;
  --color-accent-soft: rgba(0, 0, 0, 0.05);
  --color-lume-soft: #ececeb;
```
And the brand-ink / glow group:
```css
  --color-ink: #171717;
  --color-ink-fg: #fafafa;
  --color-glow: rgba(0, 0, 0, 0.06);
```

- [ ] **Step 3: Rounder radii** in `@theme` - replace the radius group:
```css
  --radius: 1rem;        /* 16px cards */
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
```

- [ ] **Step 4: Add layout + shadow custom properties** to the `:root` block (after `--header-h`):
```css
  --gutter: clamp(1.25rem, 3.5vw, 4rem);
  --col-gap: clamp(1rem, 2vw, 2rem);
  --radius-panel: 1.5rem;
  --shadow-card: 0 1px 2px rgba(0,0,0,.04), 0 10px 30px rgba(0,0,0,.06);
  --shadow-card-hover: 0 2px 4px rgba(0,0,0,.05), 0 18px 48px rgba(0,0,0,.09);
```
Also increase vertical rhythm for airiness:
```css
  --py-section: calc(var(--vw) * 7);
  --py-section-lg: calc(var(--vw) * 10);
```
(Remove the now-unused `--content-w` and `--content-w-narrow` lines.)

- [ ] **Step 5: Make containers full-width + add grid/card helpers.** Replace the `.container-x` / `.container-narrow` rules with:
```css
.container-x,
.container-narrow {
  width: 100%;
  margin-inline: 0;
  padding-inline: var(--gutter);
}
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--col-gap);
}
.surface-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}
.surface-card--hover {
  transition: box-shadow 0.3s var(--ease-out-expo), transform 0.3s var(--ease-out-expo);
}
.surface-card--hover:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

- [ ] **Step 6: Neutralize glows, selection, focus, footer.** Replace these rules:
```css
::selection { background: #e5e5e5; color: #0a0a0a; }
:focus-visible { outline: 2px solid var(--color-fg); outline-offset: 2px; border-radius: 2px; }
.glow-accent {
  background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.7) 0%, transparent 70%);
}
.footer-glow { position: relative; background: #0a0a0a; }
/* delete the .footer-glow::before gold radial overlay entirely */
```

- [ ] **Step 7: Standard checks.** `npm run typecheck`, `npm run lint`, `npm run test`. Expect all green (CSS-only change).

- [ ] **Step 8: Build + spot visual.** `npm run build` (expect success). `npm run dev`, screenshot `/` at 1920px - confirm the page background is gray, the old centered max-width is gone (content now spans wide), and nothing is broken (sections will look unstyled-asymmetric until later tasks - that's expected).

- [ ] **Step 9: Commit.**
```bash
git add styles/globals.css
git commit -m "feat(redesign): full-width tokens, airy surfaces, grid + card helpers"
```

---

## Task 2: UI primitives - neutralize accent + new radius/shadow

**Files:**
- Modify: `components/ui/Button.tsx`, `components/ui/Tag.tsx`, `components/ui/Field.tsx`, `components/ui/CoverPanel.tsx`, `components/ui/Eyebrow.tsx`

- [ ] **Step 1: Button.** In `buttonClasses`, change `rounded-[10px]` → `rounded-[var(--radius)]`. Repoint the `lume` variant to ink so there's no gold:
```ts
    lume: "bg-ink text-[#fafafa] hover:bg-[#2a2a2a]",
```
Change the `link` variant's underline from `after:bg-accent` → `after:bg-fg`.

- [ ] **Step 2: Tag.** Read the file. Change the active state off `accent-soft`/gold to neutral ink: active = `bg-ink text-[#fafafa] border-ink`; inactive keeps `border-line`. Keep `rounded-full`.

- [ ] **Step 3: Field.** Read the file. Change focus border `focus:border-accent` → `focus:border-fg`; required marker `text-accent` → `text-fg-muted`. Keep the hairline underline style.

- [ ] **Step 4: CoverPanel.** Read the file. Desaturate the inline gradient placeholder: replace any accent-derived gradient stops with neutral grays (e.g. `var(--color-card)` → `var(--color-card-2)`). Where it's used as a media card, ensure it carries `rounded-[var(--radius)]` and (when standalone) `shadow-[var(--shadow-card)]`.

- [ ] **Step 5: Eyebrow.** No change needed (index already uses `text-fg-dim`, which is neutral). Confirm by reading; if it uses any accent, switch to `text-fg-dim`.

- [ ] **Step 6: Standard checks.** Expect green.

- [ ] **Step 7: Commit.**
```bash
git add components/ui/
git commit -m "feat(redesign): neutralize UI primitives (drop gold, new radius/shadow)"
```

---

## Task 3: Nav - full-width bar, top light gradient, neutral active

**Files:**
- Modify: `components/layout/Nav.tsx`

- [ ] **Step 1:** Read the file. The fixed header inner wrapper already uses `.container-x` (now full-width) - keep it. Add the reference's subtle top wash to the header element: `bg-gradient-to-b from-bg/80 to-transparent backdrop-blur-sm` (or a `before` overlay), so the bar reads as a light gradient strip.

- [ ] **Step 2:** Replace the gold active-link treatment with neutral: the active underline `bg-accent` → `bg-fg`; active text color stays `text-fg`, inactive `text-fg-muted`. Keep the scale/animation behavior.

- [ ] **Step 3:** "Contact" pill: ensure it uses the ink Button/pill (`bg-ink text-[#fafafa] rounded-full`). Remove any gold.

- [ ] **Step 4: Standard checks** + screenshot `/` top at 1920px (nav spans edge-to-edge, neutral active state). 

- [ ] **Step 5: Commit.**
```bash
git add components/layout/Nav.tsx
git commit -m "feat(redesign): full-width neutral nav with top wash"
```

---

## Task 4: Footer - full-width dark, flattened to neutral

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1:** Read the file. Keep the `.footer-glow` dark band (now flat neutral via Task 1). Remove the gold dot after the "Lumako" wordmark and any `text-accent`/glow usage → neutral (`text-ink-fg` / `text-white/60`).

- [ ] **Step 2:** Migrate the footer's column layout onto `.grid-12` inside `.container-x` so columns reach the gutters (logo+desc `col-span-4`, link columns distributed, contact right-aligned `col-start-...`). Newsletter focus accent → neutral.

- [ ] **Step 3: Standard checks** + screenshot footer at 1920px (flat dark, full-width, no gold).

- [ ] **Step 4: Commit.**
```bash
git add components/layout/Footer.tsx
git commit -m "feat(redesign): full-width flat-dark footer, gold removed"
```

---

## Task 5: Home - Hero (asymmetric text on full-bleed 3D)

**Files:**
- Modify: `components/sections/home/Hero.tsx`

- [ ] **Step 1:** Keep the full-bleed canvas, glow wrapper (now neutral), and noise veil. Restructure the content `.container-x` onto `.grid-12`:
  - Eyebrow + headline (`TextReveal` h1) in the left column: `col-span-12 md:col-span-7`.
  - Supporting `sub` paragraph in the upper-right: `col-span-12 md:col-start-8 md:col-span-5 md:pt-2`.
  - CTAs row below the headline (still in the left column, `mt-11`).
  Keep all motion props, delays, `MagneticButton`, and the scroll cue.

- [ ] **Step 2:** Confirm the `lume`-variant secondary CTA now renders ink (from Task 2) - no gold.

- [ ] **Step 3: Standard checks** + screenshot `/` hero at 1280/1920/2560 (headline left, sub upper-right, full-bleed, neutral bloom).

- [ ] **Step 4: Commit.**
```bash
git add components/sections/home/Hero.tsx
git commit -m "feat(redesign): asymmetric full-bleed hero"
```

---

## Task 6: Home - Manifesto + ServicesOverview

**Files:**
- Modify: `components/sections/home/Manifesto.tsx`, `components/sections/home/ServicesOverview.tsx`

- [ ] **Step 1: Manifesto.** Drop `border-t border-line` from the section. Apply **Pattern A**: eyebrow in left col, the big `TextReveal` headline spanning `md:col-span-9` (manifesto is headline-led; no right sub needed - keep its existing single statement, just widen the column and remove the centering cap).

- [ ] **Step 2: ServicesOverview.** Drop the section `border-t border-line`. Convert the header (eyebrow+headline left, "all services →" link right) to **Pattern A** layout. Keep the accordion `ServiceRow` behavior; rows now span full width - bump the title size and let the `+` sit at the far right (`ml-auto`). Indices stay neutral (`text-fg-dim`). Keep `data-cursor` and motion.

- [ ] **Step 3: Standard checks.**

- [ ] **Step 4: Commit.**
```bash
git add components/sections/home/Manifesto.tsx components/sections/home/ServicesOverview.tsx
git commit -m "feat(redesign): full-width asymmetric manifesto + services list"
```

---

## Task 7: Home - SelectedWork (text + edge-to-edge work cards)

**Files:**
- Modify: `components/sections/home/SelectedWork.tsx`, `components/sections/work/WorkCard.tsx`

- [ ] **Step 1: WorkCard.** Read it. Give the media `rounded-[var(--radius)]` and a soft shadow when it sits on the gray page (`shadow-[var(--shadow-card)]` or wrap media in `.surface-card` with `overflow-hidden`). Discipline tags → neutral (`border-line`, no gold). Keep the hover arrow + `CoverPanel`.

- [ ] **Step 2: SelectedWork.** Drop the section border. Header → **Pattern A**. The work grid spans full width: keep the staggered 2-col offset but let it reach the gutters (`grid-12` with cards at `col-span-12 md:col-span-6`, alternating `md:mt-24` offset). 

- [ ] **Step 3: Standard checks** + screenshot at 1920/2560 (cards reach gutters, soft-shadow media).

- [ ] **Step 4: Commit.**
```bash
git add components/sections/home/SelectedWork.tsx components/sections/work/WorkCard.tsx
git commit -m "feat(redesign): full-width selected work + soft-shadow work cards"
```

---

## Task 8: Home - ProcessTeaser + Stats + Testimonial (white-card rows)

**Files:**
- Modify: `components/sections/home/ProcessTeaser.tsx`, `components/sections/home/Stats.tsx`, `components/sections/home/Testimonial.tsx`

- [ ] **Step 1: Stats.** Replace the hairline grid (`gap-px overflow-hidden rounded-[10px] border border-line bg-line` with `bg-bg` cells) with **Pattern R**: 4 white `.surface-card p-10` cards in a `grid-cols-2 lg:grid-cols-4 gap-5` row. Keep the `value` (display) + `label` (label-caps) content. Optionally add a small neutral icon slot top-left to echo the reference.

- [ ] **Step 2: ProcessTeaser.** Header → **Pattern A**. Phase grid → **Pattern R** white cards (`sm:grid-cols-2 lg:grid-cols-3`), phase indices neutral.

- [ ] **Step 3: Testimonial.** Header stays; convert the benefit-item hairline grid → **Pattern R** white cards; bullet dots neutral (`bg-fg`/`bg-fg-muted`, not gold).

- [ ] **Step 4: Standard checks** + screenshot Stats row at 1920px (4 white shadow cards across full width, reference-style).

- [ ] **Step 5: Commit.**
```bash
git add components/sections/home/ProcessTeaser.tsx components/sections/home/Stats.tsx components/sections/home/Testimonial.tsx
git commit -m "feat(redesign): white-card rows for stats, process, testimonial"
```

---

## Task 9: Home - CtaBand feature panel + floating logo chips

**Files:**
- Create: `components/ui/LogoChips.tsx`
- Modify: `components/sections/home/CtaBand.tsx`

- [ ] **Step 1: Create `LogoChips`.** Renders the `clients` strings (from `@/lib/content/studio`) as small white rounded chips absolutely positioned around the panel at slight rotations, with a subtle entrance + idle float (Motion), gated by `useReducedMotion`. On `< md`, render nothing (the panel stays clean on mobile) - chips are decorative.
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { clients } from "@/lib/content/studio";

// fixed positions (top%, left%, rotateDeg) around the panel edges - 6 chips
const SPOTS = [
  { top: "8%", left: "6%", r: -8 },
  { top: "14%", left: "84%", r: 7 },
  { top: "62%", left: "3%", r: 5 },
  { top: "70%", left: "88%", r: -6 },
  { top: "30%", left: "92%", r: 10 },
  { top: "78%", left: "40%", r: -4 },
];

export function LogoChips() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
      {clients.slice(0, SPOTS.length).map((name, i) => {
        const s = SPOTS[i];
        return (
          <motion.span
            key={name}
            className="absolute rounded-2xl bg-[var(--color-surface)] px-4 py-2 text-[length:var(--text-mono)] font-medium tracking-tight text-fg-muted shadow-[var(--shadow-card)]"
            style={{ top: s.top, left: s.left, rotate: `${s.r}deg` }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 * i }}
          >
            {name}
          </motion.span>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: CtaBand.** Wrap the existing centered content (eyebrow, headline, sub, button) in **Pattern P**: a full-width section → `.container-x` → big rounded `bg-[var(--color-card)]` panel with `<LogoChips />` behind the centered `z-10` content. Keep the existing copy and Button.

- [ ] **Step 3: Standard checks** + screenshot CtaBand at 1280 (no chips) and 1920 (chips around panel). Confirm reduced-motion hides animation.

- [ ] **Step 4: Commit.**
```bash
git add components/ui/LogoChips.tsx components/sections/home/CtaBand.tsx
git commit -m "feat(redesign): CTA feature panel with floating client chips"
```

**Phase check (Home):** `npm run build`; screenshot full `/` scroll at 1920 + 2560; confirm the whole home page reads like the reference (gray page, white cards, full-bleed, no gold).

---

## Task 10: Work index + WorkGrid

**Files:**
- Modify: `app/work/page.tsx`, `components/sections/work/WorkGrid.tsx`

- [ ] **Step 1: `app/work/page.tsx`.** Hero section header → **Pattern A** (de-centered). Drop section `border-t border-line`. The grid section's `.container-x` stays (full-width).

- [ ] **Step 2: WorkGrid.** Make the grid full-bleed: `grid-cols-1 md:grid-cols-2 gap-8` reaching the gutters; keep the Motion `layout`/stagger and the tag filter row (tags neutral via Task 2). Cards use the Task 7 WorkCard.

- [ ] **Step 3: Standard checks** + screenshot `/work` at 1920/2560.

- [ ] **Step 4: Commit.**
```bash
git add app/work/page.tsx components/sections/work/WorkGrid.tsx
git commit -m "feat(redesign): full-bleed work index + grid"
```

---

## Task 11: Case study - CaseHero + CaseBody

**Files:**
- Modify: `components/sections/work/CaseHero.tsx`, `components/sections/work/CaseBody.tsx`

- [ ] **Step 1: CaseHero.** Neutralize the radial accent glow (use neutral/`rgba(0,0,0,.04)` or remove). Keep the meta row + h1; the 12-col image(8)+summary(4) split now spans full width via `.container-x` + `.grid-12`. Image gets `rounded-[var(--radius)]` + soft shadow.

- [ ] **Step 2: CaseBody.** Drop the section `border-t border-line`. Keep the sticky left challenge column (`md:col-span-5`) + right approach list (`md:col-span-7`) on `.grid-12`. Step numbers → neutral (`text-fg` instead of `!text-accent`); keep the per-step hairline `border-b border-line` (structural, fine to keep). Body text capped `max-w-[68ch]`.

- [ ] **Step 3: Standard checks.**

- [ ] **Step 4: Commit.**
```bash
git add components/sections/work/CaseHero.tsx components/sections/work/CaseBody.tsx
git commit -m "feat(redesign): full-width case hero + body, neutral accents"
```

---

## Task 12: Case study - CaseGallery + CaseResults + NextProject

**Files:**
- Modify: `components/sections/work/CaseGallery.tsx`, `components/sections/work/CaseResults.tsx`, `components/sections/work/NextProject.tsx`

- [ ] **Step 1: CaseGallery.** Full-bleed grid: keep the 2-col + `md:col-span-2` spans, widen gaps (`gap-6`/`gap-8`), panels `rounded-[var(--radius)]` + soft shadow.

- [ ] **Step 2: CaseResults.** Replace the hairline metric grid with **Pattern R** white cards (`sm:grid-cols-3`), neutral.

- [ ] **Step 3: NextProject.** Drop section border; apply **Pattern M** (text col + media reaching the gutter); image `rounded-[var(--radius)]` + soft shadow; neutral hover.

- [ ] **Step 4: Standard checks** + `npm run build`; screenshot a case study route (e.g. `/work/<first-slug>`) at 1920/2560.

- [ ] **Step 5: Commit.**
```bash
git add components/sections/work/CaseGallery.tsx components/sections/work/CaseResults.tsx components/sections/work/NextProject.tsx
git commit -m "feat(redesign): full-bleed gallery, white-card results, full-width next-project"
```

---

## Task 13: Services page - Hero + Disciplines + ProcessSteps + Engagements

**Files:**
- Modify: `components/sections/services/ServicesHero.tsx`, `components/sections/services/Disciplines.tsx`, `components/sections/services/ProcessSteps.tsx`, `components/sections/services/Engagements.tsx`

- [ ] **Step 1: ServicesHero.** De-center → **Pattern A** (eyebrow + big headline left, sub upper-right). Neutralize `glow-accent` (already neutral from Task 1).

- [ ] **Step 2: Disciplines.** Each discipline row → full-width `.grid-12` (title+desc `col-span-6`, deliverables list `col-start-8 col-span-5`). `+` bullets neutral. Keep the hairline row separators (structural).

- [ ] **Step 3: ProcessSteps.** Header → **Pattern A**; the ordered list spans full width (`grid-12`, index/title/detail columns). Step index neutral.

- [ ] **Step 4: Engagements.** Header → **Pattern A**; engagement cards → **Pattern R** white cards (`lg:grid-cols-3`); bullet dots + elevated bg → neutral white cards.

- [ ] **Step 5: Standard checks** + `npm run build`; screenshot `/services` at 1920/2560.

- [ ] **Step 6: Commit.**
```bash
git add components/sections/services/
git commit -m "feat(redesign): full-width services page (asymmetric + white cards)"
```

---

## Task 14: Studio page - Hero + Values + Team + Recognition; remove Clients

**Files:**
- Modify: `components/sections/studio/StudioHero.tsx`, `components/sections/studio/Values.tsx`, `components/sections/studio/Team.tsx`, `components/sections/studio/Recognition.tsx`, `app/studio/page.tsx`
- (Leave `components/sections/studio/Clients.tsx` in the repo but unused.)

- [ ] **Step 1: StudioHero.** De-center → **Pattern A** (7-col lead + 5-col body on `.grid-12`).

- [ ] **Step 2: Values.** Hairline grid → **Pattern R** white cards (`sm:grid-cols-2` or `lg:grid-cols-3`).

- [ ] **Step 3: Team.** 4-col photo grid spans full width (`.grid-12` or `grid-cols-2 lg:grid-cols-4`), photo cards `rounded-[var(--radius)]` + soft shadow; keep hover scale; member accent overlay → neutral.

- [ ] **Step 4: Recognition.** Full-width list (`.container-x`); keep the award/org/year rows with hairline separators; neutral.

- [ ] **Step 5: `app/studio/page.tsx`.** Remove `<Clients />` from the composition (its content now lives as chips on the CTA panel). The CTA panel (CtaBand, shared) already ends the page - confirm Studio ends on it. Remove the now-unused `Clients` import.

- [ ] **Step 6: Standard checks** + `npm run build`; screenshot `/studio` at 1920/2560.

- [ ] **Step 7: Commit.**
```bash
git add components/sections/studio/ app/studio/page.tsx
git commit -m "feat(redesign): full-width studio page; fold clients into CTA chips"
```

---

## Task 15: Contact page - full-width form + details

**Files:**
- Modify: `app/contact/page.tsx`, `components/sections/contact/ContactDetails.tsx`, `components/sections/contact/ContactForm.tsx`

- [ ] **Step 1: `app/contact/page.tsx`.** Drop the header centering cap; header → **Pattern A**. The 2-col body (form left, details right) spans full width via `.container-x` + `.grid-12` (form `col-span-12 md:col-span-7`, details `col-start-9 col-span-4`). Drop section `border-t border-line`.

- [ ] **Step 2: ContactDetails.** Neutralize the email hover (`text-accent` → `text-fg`); the detail boxes → `.surface-card` where they read as cards; keep grid divider or convert to gaps.

- [ ] **Step 3: ContactForm.** Neutral field styling already handled in `Field` (Task 2). Success-state card → `.surface-card`; error text neutral-readable (keep a dark/red-neutral? Errors should stay distinguishable - use `text-fg` + bold, NOT gold; a subtle red is acceptable for validation errors since it's a usability signal, but avoid gold). Keep all validation logic untouched (tests depend on it).

- [ ] **Step 4: Standard checks** - pay attention to `npm run test` (contact validation tests must pass) + screenshot `/contact` at 1920/2560.

- [ ] **Step 5: Commit.**
```bash
git add app/contact/page.tsx components/sections/contact/
git commit -m "feat(redesign): full-width contact page, neutral fields"
```

---

## Task 16: Hero canvas - desaturate any gold tint

**Files:**
- Modify: `components/three/HeroCanvas.tsx` (and `components/three/HeroFallback.tsx` if it carries gold)

- [ ] **Step 1:** Read `components/three/HeroCanvas.tsx`. Find any color literals / material colors / light colors that are gold/amber (e.g. `#d49a2e`, `#9c6e1b`, warm hex, or accent-derived). Replace with neutral light values (white / light gray / very faint warm-neutral) so the scene matches the monochrome reference. If full desaturation looks lifeless, keep a *very* faint neutral-warm tint (per spec risk note).

- [ ] **Step 2:** Read `components/three/HeroFallback.tsx`; if it uses `container-x`/gold, ensure neutral + full-bleed consistency.

- [ ] **Step 3: Standard checks** + screenshot `/` hero with canvas active at 1920 (high-tier device emulation) - confirm neutral scene, no gold bloom.

- [ ] **Step 4: Commit.**
```bash
git add components/three/
git commit -m "feat(redesign): desaturate 3D hero to neutral"
```

---

## Task 17: Global gold sweep + full verification

**Files:** any stragglers found.

- [ ] **Step 1: Grep sweep.** Run:
```bash
grep -rniE "accent|glow|d49a2e|9c6e1b|lume-soft|#?gold" components/ app/ styles/
```
Review every hit. Legit remaining uses are only the neutralized token *definitions* in `globals.css` and token *names* (`text-accent` now resolves to ink - acceptable, or convert to `text-fg`/`text-ink` for clarity). Fix any visible gold that slipped through (color literals, gradients, glows). The footer gold dot, nav gold underline, and hairline-grid card patterns should all be gone.

- [ ] **Step 2: Confirm no leftover hairline-grid card pattern.** Run:
```bash
grep -rn "bg-line" components/ app/
```
Each remaining `bg-line` should be an intentional 1px divider, not a card-grid background. Convert any missed card grids to `.surface-card` rows.

- [ ] **Step 3: Full verification.**
```bash
npm run typecheck    # no errors
npm run lint         # clean
npm run test         # all pass
npm run build        # success
```

- [ ] **Step 4: Multi-width + a11y + reduced-motion QA.** With `npm run dev`, for each route (`/`, `/work`, `/work/<slug>`, `/services`, `/studio`, `/contact`) screenshot at **1280 / 1920 / 2560**. Verify:
  - Full-bleed: content reaches the gutters; no centered max-width band; no horizontal scrollbar.
  - Text sub-columns stay readable (~≤72ch) even at 2560.
  - Cards are white soft-shadow boxes on the gray page; no gold anywhere.
  - Focus-visible outline is clearly visible against the gray bg (tab through nav + form).
  - Nav active state is distinguishable without relying on color.
  - With OS reduced-motion on (or emulated), floating chips/reveals don't animate.

- [ ] **Step 5: Commit** (only if Step 1/2 produced fixes).
```bash
git add -A
git commit -m "fix(redesign): final gold-sweep + verification polish"
```

---

## Self-review (author's check against the spec)

- **Spec §3 foundation** → Task 1. ✓ (cap removal, gutter, grid-12, surface inversion, shadows, radii, accent neutralization, glow/selection/focus/footer).
- **Spec §4 card language** → Tasks 8, 12, 13, 14 (Pattern R everywhere a hairline grid existed). ✓
- **Spec §5 archetypes** → A (Tasks 6,8,10,11,13,14,15), B (8,12,13,14), C/M (5,7,11,12), D (7,10,12), E (9). ✓
- **Spec §6 CTA + Clients merge** → Task 9 (LogoChips) + Task 14 (remove Clients from studio). ✓
- **Spec §7 page-by-page** → Home (5-9), Work (10-12), Services (13), Studio (14), Contact (15), Nav (3), Footer (4). ✓
- **Spec §8 primitives** → Task 2 + Eyebrow confirmed. ✓
- **Spec §3.5 hero canvas desaturation** → Task 16. ✓
- **Spec §10 verification** → Task 17 (typecheck/lint/test/build + multi-width + a11y + reduced-motion). ✓
- **Spec §11 risks** → gold sweep (Task 17 Step 1), hero tint fallback (Task 16 Step 1), mobile chips fallback (Task 9 Step 1 hides `< md`), ultrawide line length (capped sub-columns throughout). ✓

**Placeholder scan:** no "TBD/TODO"; foundation + LogoChips have literal code; section tasks give exact patterns + per-component specifics. **Type/name consistency:** `--color-surface`, `--shadow-card`, `.surface-card`, `.surface-card--hover`, `.grid-12`, `--gutter`, `--radius-panel`, `LogoChips`, `clients` - all defined in Task 1/9 and used consistently downstream. ✓
