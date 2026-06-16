# Lumako — Brandbook Adaptation Design

**Date:** 2026-06-16
**Status:** Approved (scope + key calls confirmed with user)
**Source of truth:** `e:\Desktop\lumako-brandbook.html` (Brand System v1.0)

## Goal

Adapt the existing Lumako website to the Lumako Brand System v1.0. This is a full
visual reskin **plus** a content rewrite — not a token-only swap. The current site
is a polished but generic **dark** studio (electric-blue accent, Fraunces serif,
"products people don't forget", fabricated stats + an "Elena Cho" testimonial,
"San Francisco / Remote"). The brandbook defines a **light**, proof-led identity
(lume gold, Inter Tight, "the demo is the pitch", solo founder out of Nalchik,
web · AI · apps).

## Scope (confirmed with user)

**In scope**
- Light + lume **visual system** across all pages and components.
- **Content rewrite (English only)** to the brandbook's positioning and voice.
- Re-grade the existing Three.js hero to light + lume (keep the WebGL investment).

**Out of scope (designed-around, not built now)**
- Bilingual AR/RU "two faces" architecture, i18n, RTL.
- IBM Plex Sans Arabic loading (not needed until Arabic ships).
- Russia-resident hosting / payment-rail split (infra, not web).

## Key decisions (confirmed)

1. **Token strategy — remap values, keep semantic names.** Components already use
   semantic Tailwind v4 classes (`bg-bg`, `text-fg`, `text-accent`, `border-line`),
   so swapping the `@theme` *values* flips ~90% of the site. We do **not** rename
   tokens to brandbook names — no visual benefit, high churn/risk. We add lume
   aliases and then make targeted fixes for the handful of dark-assuming styles.
2. **Fabricated testimonial → receipts strip.** Replace the "Elena Cho / Aether"
   quote with the brandbook's real proof, framed as receipts (gov & university
   builds · won university AI competition · 1.5+ yrs in production · clickable live
   products). Honest and on-brand ("receipts, not adjectives").
3. **Footer is the one glow.** The brandbook permits the dark `#18181B → #0A0A0A`
   gradient + lume radial in **exactly one place**. The **footer** becomes that
   band; the closing **CTA band stays light** with an ink CTA (no second glow).
4. **Hero re-graded to light** (see §6). Keep the `<Canvas>`, parallax, scroll-dolly
   and fallback; recompose the scene because additive bloom/white-stars only read
   on black.

---

## Design by system

### 1. Color tokens — `styles/globals.css` `@theme`

| token | current | new |
|---|---|---|
| `--color-bg` | `#0a0a0a` | `#FFFFFF` |
| `--color-bg-elev` | `#111111` | `#FAFAFA` |
| `--color-card` | `#161616` | `#F5F5F5` |
| `--color-card-2` | `#1e1e1e` | `#EFEFEF` |
| `--color-fg` | `#fafafa` | `#0A0A0A` |
| `--color-fg-muted` | `#a1a1a1` | `#737373` |
| `--color-fg-dim` | `#6b6b6b` | `#A1A1A1` |
| `--color-line` | `rgba(255,255,255,.10)` | `#E5E5E5` |
| `--color-line-strong` | `rgba(255,255,255,.18)` | `#D4D4D4` |
| `--color-accent` | `#3080ff` | **`#D49A2E`** (lume) |
| `--color-accent-deep` | `#1447e6` | `#9C6E1B` (lume-deep) |
| `--color-accent-soft` | `rgba(48,128,255,.14)` | `rgba(212,154,46,.14)` |
| `--color-spark` | `#ff6568` | **removed** (no second accent) |
| *(new)* `--color-lume-soft` | — | `#F4E6C6` |
| *(new)* `--color-ink` | — | `#171717` (button/CTA fill) |
| *(new)* `--color-glow` | — | `rgba(212,154,46,.40)` (footer radial) |

Other token notes:
- **Radius:** base `--radius` is already `0.625rem` (10px ✓). Reduce oversized
  `--radius-lg`/`--radius-xl` toward the 10px base, and tighten `rounded-2xl/3xl`
  usages on cards to `rounded-[10px]` (brandbook: 10px base, 8px nested, 999px pill).
- `::selection` → lume background, ink text (`color:#1A1206`).
- `:focus-visible` already uses `--color-accent` → becomes lume automatically.
  Match brandbook: 2px lume outline, 2px offset.
- `.glow-accent` radial → lume-soft.
- `.noise-veil` uses `mix-blend-mode: screen` (invisible/odd on white) → switch to
  `multiply` at low opacity, or drop where it sat over the dark hero.

### 2. Typography — `app/layout.tsx` + `globals.css`

- Replace `Fraunces` + `Hanken_Grotesk` imports with a single **`Inter_Tight`**
  (`next/font/google`, variable, subsets `["latin"]`, weights via variable axis;
  ital available for the brandbook's italic-accent display treatment).
- `@theme inline`: `--font-display` → Inter Tight, `--font-sans` → Inter Tight.
  Keep `--font-mono` → Geist Mono **only for genuine code blocks**.
- **Eyebrows/labels move monospace → Inter Tight Medium, uppercase, `.18em`.**
  Update the centralized `Eyebrow` component and replace inline `font-mono`
  chrome (nav meta, footer meta, scroll cue) with the label style. This is the
  largest character change: the decorative serif disappears entirely (brandbook:
  "rhythm from scale and weight, never a decorative display face").
- Body weight 400; display/UI weight 500. Tracking: tight on display
  (-.02 to -.035em), wide on caps labels.

### 3. Logo — `components/ui/Logo.tsx` + footer wordmark

- `lumako.` (lowercase Fraunces) → **`Lumako.`** — capital L, Inter Tight Medium,
  `tracking-tight`, ink wordmark, **lume period**.
- Footer monumental wordmark: same change, set **inverse** (white wordmark, lume
  period as a glow) on the dark footer band.
- Clearspace/usage per brandbook (no recolor of the wordmark, lume dot is the only
  variation) — applied as guidance, no enforcement code.

### 4. Buttons — `components/ui/Button.tsx` (+ `MagneticButton`)

Brandbook's default CTA is **ink**, not the accent.
- `primary` → ink fill `#171717`, off-white text `#FAFAFA`, 10px radius, 14px/500,
  **no uppercase**, hover slightly lighter ink.
- **Add `lume` variant** → lume fill, ink text (`#1A1206`); reserved for the single
  most-important action per view.
- `ghost` → transparent fill, 1px `#E5E5E5` border, `#0A0A0A` text (the brandbook
  "outline — light"). Add a dark-surface outline treatment for the footer band
  (transparent, 1px white@20%, white text).
- `link` variant unchanged in structure; underline accent becomes lume.
- `MagneticButton` continues to wrap the ink primary; nav "Start a project" = ink.

### 5. Eyebrow + small chrome — `components/ui/Eyebrow.tsx`

- Convert to Inter Tight Medium, 11px, `.18em`, uppercase, `--color-fg-muted`.
- Optional leading lume dot to match brandbook eyebrow (`• Brand System`).

### 6. Hero re-grade — `Hero.tsx`, `HeroCanvas.tsx`, `HeroFallback.tsx`

The current scene = white starfield + blue/white wireframe icosahedra + additive
**Bloom** on black. Bloom and white stars only read on a dark field. Re-grade:
- **Keep:** `<Canvas>`, `CameraRig` (pointer parallax + scroll dolly), `WireframeForm`
  rotation, the dynamic import + fallback, reduced-motion/device-tier gating.
- **Recompose for light:**
  - Page/canvas background is the light surface; **drop `EffectComposer`/`Bloom`**
    (washes to white on light).
  - `WireframeForm` icosahedra → **ink lines** (`#0A0A0A`/zinc) with the innermost
    shell in **lume** (`#D49A2E`) — a dark form built on light, with one lume core.
  - `Starfield` → faint **dark** points (low opacity) or removed; white points
    vanish on white.
  - Behind the form, one **lume radial glow** (the brand's "light captured").
- **Legibility wash** (`Hero.tsx`) flips from a dark radial to a soft **light**
  radial so the now-dark headline/body read against the scene.
- **Scroll cue** accent line → lume; "Scroll" label uses the Inter Tight label style.
- Hero CTAs: primary "Start a project" = ink; **secondary becomes the page's one
  `lume` button**, relabeled **"See the build"** (brandbook's reserved lume action).
- `HeroFallback`: blue-on-dark glow → **lume-soft glow on light**; hairline grid
  lines from white@ to ink@ low opacity; drop/adjust the screen-blend noise.

### 7. Footer = the dark glow band — `components/layout/Footer.tsx`

- Background → `linear-gradient(180deg,#18181B 0%,#0A0A0A 100%)` with a warm
  `rgba(212,154,46,.40)` radial bleeding from one edge (the single sanctioned glow).
- Text → inverse (off-white, muted = white@60%); links → footer-link inverse.
- Newsletter input/underline → inverse with lume focus.
- Monumental wordmark → inverse `Lumako.` with lume period glow.
- Buttons/links use the **outline-dark** treatment.
- Tagline "Built in the light" stays (now literally true) or → a brandbook line;
  keep the meta row (© year, tagline). Update tagline text in §9.

### 8. CTA band stays light — `components/sections/home/CtaBand.tsx`

- Light section, ink primary CTA (no glow — the footer owns the one glow).
- Copy rewrite per §9.

### 9. Content rewrite (English) — `lib/content/*`

**`site.ts`**
- `tagline`: "Web & Product Studio" → **"Web · AI · Apps — shipped, not proposed"**.
- `email`: `hello@lumako.studio` → `hello@lumako.com`.
- `locale`: "San Francisco / Remote" → **"Nalchik, KBR → Global"**.
- `timezone`: `America/Los_Angeles` → **`Europe/Moscow`**.
- `socials`: Instagram · X · WhatsApp · Telegram (drop Dribbble/LinkedIn).
- `nav`: keep Work / Services / Studio / Contact (already sentence case).

**`copy.ts`** — rewrite to brandbook voice ("show, don't sell", plain verbs,
receipts):
- Hero: eyebrow "Web · AI · Apps"; headline **"Built first. Pitched second."**
  (italic-accent the periods); sub = one full-stack practice that ships web, AI,
  and apps and hands them over working; primary "Start a project" (ink),
  secondary **"See the build"** (lume).
- Manifesto: **"The demo is the pitch."** — proof carries the sale.
- Services overview → web · AI · apps from one operator on one engine.
- Stats → **real proof**, reframed (replaces 9+/60+/12/98%): e.g.
  `Gov & university builds` · `1 university AI competition, won` ·
  `1.5+ yrs in production` · `Web · AI · Apps`. (Counter component still works for
  numeric values; non-numeric proof rendered as label cells.)
- Testimonial → **receipts strip** (see §10, `Testimonial.tsx` reshape).
- CTA: closing line in brandbook register; button "Start a project" (ink) or
  "Talk on WhatsApp".
- `meta.*` titles/descriptions → brandbook positioning.
- contact `serviceOptions` → **Web, AI, Apps** (+ supporting as needed);
  `budgets` kept but currency-neutral or removed; success copy in brand voice.

**`services.ts`, `studio.ts`, `work.ts`** — reframe positioning and remove generic
agency language:
- Disciplines → **Web · AI · Apps** as primary, supporting capabilities under them.
- Studio → solo full-stack operator; values = proof / range / outcome; recognition
  = won university AI competition, gov & university delivery, 1.5+ yrs production.
- Work case studies → reframed to the brand's **real sectors** (KSA/UAE clinics,
  dental, medspa, salons; Dubai real-estate broker teams) but kept clearly
  **illustrative placeholders** for names the founder swaps in. We do **not**
  fabricate named-client specifics beyond what the brandbook states.

### 10. Component reshapes touching layout (not just tokens)

- `Testimonial.tsx` → **receipts strip** (proof cells, no quote/avatar).
- `Stats.tsx` → support non-numeric proof labels alongside the numeric counter.
- `Footer.tsx` → dark glow band (§7).
- `Hero*` → light re-grade (§6).
- `Eyebrow.tsx`, `Button.tsx`, `Logo.tsx` → §3–5.

### 11. Dark-assumption sweep (audit all 23 accent/spark files)

Verify and fix any hardcoded dark/blue/white-rgba assumptions in: `Cursor.tsx`,
`PageTransition.tsx`/`RouteCurtain`, `Tag.tsx`, `Field.tsx`, `SectionHeading.tsx`,
`TextReveal.tsx`, `CoverPanel.tsx`, work/services/studio section heroes, and the
mobile menu / nav blur backgrounds. Anything using `bg-bg/70`-style blur over a now
-light page must be re-checked for contrast. Remove all `spark` references.

---

## Implementation order (for the plan)

1. Tokens + base CSS (`globals.css`) — the big flip.
2. Fonts + layout (`layout.tsx`).
3. Primitives: `Button`, `Logo`, `Eyebrow`, `Tag`, `Field`.
4. Hero re-grade (`Hero`, `HeroCanvas`, `HeroFallback`).
5. Footer dark glow band + CTA band light.
6. Content rewrite (`lib/content/*`).
7. Section reshapes (`Testimonial`→receipts, `Stats`).
8. Dark-assumption sweep across remaining sections.
9. Verification: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`,
   visual pass on every route (home, work, work/[slug], services, studio, contact).

## Non-negotiable brandbook rules to honor

- One accent only (lume). No second color. No drop shadows. No gradients except the
  single footer glow. 1px hairlines in `#E5E5E5`. Lume reserved for the wordmark
  dot, focus, key rules, the one footer glow, and one lume button per view.

## Risks / watch-items

- **Hero on light** is the one place needing real design judgment; bloom-based glow
  doesn't translate, so the scene is recomposed (not just recolored). Validate it
  reads well and stays legible.
- **Contrast:** lume (`#D49A2E`) fails small-text contrast on white — use lume-deep
  (`#9C6E1B`) for any lume *text*; lume itself only as fills/rules/dots.
- **AGENTS.md:** read the relevant `node_modules/next/dist/docs/` guide before each
  code area (fonts/CSS already read for this spec).
- Keep tests green; `tests/utils.test.ts` references tokens — check after the swap.
