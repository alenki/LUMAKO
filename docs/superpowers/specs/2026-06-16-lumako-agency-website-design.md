# Lumako - Web & Product Studio Website · Design Spec

**Date:** 2026-06-16
**Status:** Approved direction (pending spec review)
**Author:** Brainstorm session

---

## 1. Overview

Build an award-winning marketing website for **Lumako**, a craft-forward **web & product design/build studio**. The site must read as **professional** (rigorous grid, typography, and performance discipline) while feeling **boldly creative** (cinematic, surprising, memorable) - the way a top-tier digital agency site should.

**North-star references**
- Aesthetic & palette: `https://leftcoast.refractweb.com/` - dark monochrome luxury + electric-blue accent, fluid `clamp()` type/space system, cinematic 3D hero.
- README aesthetic mandate: avoid AI-slop. No Inter/Roboto/Arial/system fonts, no Space Grotesk, no purple-on-white clichés, no cookie-cutter layouts. Distinctive type, cohesive dark theme, high-impact orchestrated motion, atmospheric backgrounds.

**Success criteria**
- Feels like a real, expensive studio site - not a template.
- One unforgettable signature moment (the 3D hero) + consistent craft everywhere else.
- Smooth 60fps motion, no layout shift, accessible, reduced-motion safe.
- Fully responsive via a fluid scaling system.

---

## 2. The Big Idea

**Concept:** *"Products built in the light."* Lumako (from *lumen*, light) brings clarity and luminosity to digital products. The canvas is a dark void; the brand motif is **light** - glowing hairline wireframes, a luminous blue accent, beams cutting through black. Every section is an object lit in a dark gallery.

**Positioning:** craft-forward web & product studio spanning strategy → brand → interface → engineering. Tone: confident, precise, quietly luxurious, editorial - never salesy.

**Hero headline (direction):** *"We design & build the products people don't forget."* - "don't forget" set in italic Fraunces. (Final copy refined in build.)

---

## 3. Design System

### 3.1 Color tokens (CSS variables)
```
--bg:            #0a0a0a   /* canvas */
--bg-elev:       #111111   /* raised surfaces */
--card:          #161616
--card-2:        #1e1e1e
--fg:            #fafafa   /* primary text */
--fg-muted:      #a1a1a1   /* secondary text */
--fg-dim:        #6b6b6b   /* tertiary / captions */
--line:          rgba(255,255,255,0.10)  /* hairline */
--line-strong:   rgba(255,255,255,0.18)
--accent:        #3080ff   /* electric blue, bright */
--accent-deep:   #1447e6
--accent-soft:   rgba(48,128,255,0.14)   /* glow / wash */
--spark:         #ff6568   /* coral - used 1-2x max for tension */
--radius:        0.625rem
--radius-lg:     1.5rem
--radius-xl:     2rem
```
Blue is the *only* chromatic accent on a monochrome field. Coral is reserved for a single tension point (e.g., live "available" status dot, one key hover state).

### 3.2 Typography
- **Display - Fraunces** (variable; use optical sizing + soft/wonk axes; italic for accent words). High-contrast editorial serif → the "luxury magazine" voice.
- **Body / UI - Hanken Grotesk** (clean, warm, highly readable grotesque).
- **Labels / indices - Geist Mono** (eyebrows, section numbers `(01)`, coordinates, captions, metadata).

Loaded via `next/font` (Fraunces, Hanken Grotesk from Google) + self-hosted **Geist Mono** (`geist` package). No FOUT/CLS.

### 3.3 Fluid scale (clamp-based, mirrors reference philosophy)
```
--text-7xl: clamp(3.0rem, 6vw, 6.5rem)     /* hero display */
--text-6xl: clamp(2.475rem, 3.3vw, 3.3rem)
--text-5xl: clamp(2.025rem, 2.75vw, 2.75rem)
--text-4xl: clamp(1.5rem, 2vw, 2rem)
--text-3xl: clamp(1.2rem, 1.6vw, 1.6rem)
--text-2xl: clamp(.975rem, 1.3vw, 1.3rem)
--text-xl:  clamp(.825rem, 1.1vw, 1.1rem)
--text-base:clamp(.875rem, .95vw, 1rem)
--text-mono-sm: clamp(.7rem, .8vw, .8rem)  /* mono labels */

--vw: clamp(.5rem, .8vw, 1rem)             /* spacing unit */
/* spacing multiples --vw-0_5 .. --vw-8, plus section paddings */
--py-section: calc(var(--vw) * 6)
--py-section-lg: calc(var(--vw) * 8)
--content-w: clamp(40rem, 80vw, 100rem)
--content-w-narrow: clamp(40rem, 70vw, 90rem)
```

### 3.4 Layout
- 12-column grid; generous gutters and negative space.
- Hairline rules (`--line`) to structure sections like an editorial layout.
- Large radii (`--radius-lg/xl`) on feature/case cards; sharp hairlines elsewhere.
- Sticky blurred top nav; monumental footer wordmark.

### 3.5 Motion language
- Signature easing: expo-out `cubic-bezier(.22,1,.36,1)`; durations 0.6-1.2s for reveals.
- **Orchestrated page-load**: staggered masked-text reveals (clip-path + translateY).
- **Lenis** smooth scroll (momentum), scroll-linked parallax on imagery and headings.
- **Custom cursor**: dot + magnetic ring that scales/labels on interactive elements.
- **Page transitions**: electric-blue curtain wipe between routes (Framer Motion, App Router).
- Micro: magnetic buttons, hover image reveals, marquee logo strips, animated stat counters, link underline draws.
- **Accessibility:** all of the above gated behind `prefers-reduced-motion` with tasteful static fallbacks.

---

## 4. Signature Hero (Three.js / React Three Fiber)

A slowly rotating **luminous wireframe form** (abstract lattice / morphing geometry evoking architecture/light) on black, wrapped in a drifting **starfield**, with **selective bloom** postprocessing for glow.
- Interaction: mouse → parallax tilt; scroll → camera dolly pushing *through* the form into the page below.
- Composited on top: mono eyebrow + Fraunces editorial headline + sub + scroll cue, all with staggered reveal synced to scene fade-in.
- **Build:** `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`; canvas dynamically imported with `ssr: false`; suspense fallback = static luminous gradient.
- **Degradation:** `prefers-reduced-motion`, mobile, or low-power → static luminous radial gradient + CSS-animated hairlines (no WebGL). Zero CLS, no jank.

---

## 5. Site Map & Page Content

Shared shell on every route: blurred sticky **nav** (wordmark, links, live local time + "SF / remote" locale detail, "Start a project" CTA), monumental **footer** (giant LUMAKO wordmark, nav, newsletter, socials, colophon/credits), custom cursor, Lenis smooth scroll, page transitions, full SEO + OpenGraph metadata per route.

### / - Home
1. **3D hero** (section 4) + editorial headline.
2. **Manifesto** - short, bold statement of philosophy; mono eyebrow `(what we believe)`.
3. **Services overview** - 6 disciplines as an interactive list/grid with hover reveals.
4. **Selected work** - 3-4 featured case studies, large hover-reveal cards, parallax media.
5. **Process teaser** - numbered phases preview → links to /services.
6. **Stats / proof** - animated counters (projects, years, awards, etc.).
7. **Testimonial** - single large pull-quote, editorial.
8. **CTA band** - "Start a project" with magnetic button → /contact.

### /work - Work index
- Intro + filter (by discipline: Web, Product, Brand, Motion).
- Responsive case grid; each card: cover media (hover reveal/parallax), client, title, disciplines, year.

### /work/[slug] - Case study
- Cinematic title hero (client, role, year, services).
- Overview / challenge / approach (editorial two-column + pull quotes).
- Media gallery (full-bleed + parallax).
- Results (animated metrics).
- Next-project link (large hover transition).

### /services - Services
- Hero statement.
- Six disciplines (Strategy, Brand & Identity, Web Design, Product / UX, Engineering & Build, Motion & 3D) - each expandable with deliverables.
- Numbered **process** (Discover → Define → Design → Build → Launch → Evolve).
- Engagement models (Project / Retainer / Embedded).

### /studio - About
- Manifesto / origin.
- Values (3-4, editorial).
- Founders / team grid (portraits + roles; hover reveal).
- Recognition (awards/press marquee).
- Clients marquee.

### /contact - Contact
- "Start a project" headline.
- Form: name, email, company, budget range, services (multi-select chips), message. Client-side validation + success state. (Wire to a simple API route / mailto fallback; no backend dependency required for v1.)
- Direct details (email), scheduling CTA, socials, live local time.

---

## 6. Tech Stack & Architecture

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS v4** (CSS-first `@theme` with our tokens) · **Framer Motion** (`motion`).
- **three** + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`.
- **Lenis** smooth scroll. `next/font` for Fraunces + Hanken Grotesk; `geist` for Geist Mono.
- Deploy target: Vercel.

**File structure**
```
app/
  layout.tsx            # fonts, providers, cursor, smooth-scroll, transitions
  page.tsx              # Home
  work/page.tsx
  work/[slug]/page.tsx
  services/page.tsx
  studio/page.tsx
  contact/page.tsx
  api/contact/route.ts  # form handler (optional/mailto fallback)
components/
  ui/                   # Button, MagneticButton, Cursor, Marquee, Reveal, Counter, ...
  sections/             # Hero, Manifesto, ServicesOverview, SelectedWork, Stats, CTA, ...
  three/                # HeroCanvas, WireframeForm, Starfield, postprocessing
  layout/               # Nav, Footer, PageTransition, SmoothScroll
lib/
  content/              # typed data: services.ts, work.ts, studio.ts, copy.ts
  motion.ts             # shared variants/easings
  utils.ts
styles/
  globals.css           # tokens, @theme, base
```
Content is **typed data in `lib/content`** so pages stay declarative and copy is centralized.

---

## 7. Imagery

Default to elegant CSS/gradient/noise + the 3D scene so nothing depends on external assets. Optionally generate a **small curated set of on-brand visuals via Higgsfield** (dark, cinematic device mockups + abstract luminous renders) for case studies / section accents. **Confirm before spending Higgsfield credits.** Any generated assets live in `public/`.

---

## 8. Performance & Accessibility

- 3D dynamically imported, `ssr:false`, suspense fallback; bloom kept cheap; pixel-ratio capped.
- Lazy media, explicit dimensions → no CLS. Smooth 60fps target.
- Semantic landmarks, keyboard navigable, `:focus-visible` rings, color-contrast checked.
- `prefers-reduced-motion` fully honored (3D, transitions, parallax all degrade).
- Lighthouse-minded build; verify in-browser before claiming done.

---

## 9. Build / Execution Approach

Ultracode workflow orchestration:
1. Scaffold Next.js + Tailwind v4 + deps + tokens/fonts.
2. Build design-system foundation (tokens, typography, UI primitives, motion lib).
3. Build shared shell (Nav, Footer, Cursor, SmoothScroll, PageTransition).
4. Build pages - parallelize independent routes/sections.
5. Build the Three.js hero (+ degradation path).
6. Polish + **Playwright visual verification** pass across breakpoints; fix; re-verify.

Verification before completion: run dev server, screenshot key routes at desktop/mobile, confirm no console errors, confirm reduced-motion path.

---

## 10. Risks & Mitigations
- **3D perf / SSR** → dynamic import, capped DPR, cheap bloom, mobile fallback.
- **Font loading / CLS** → `next/font` with `display:swap` + size-adjust; self-host mono.
- **Scope (multi-page)** → centralized typed content + reusable sections keep consistency; parallel build with shared design system reviewed first.
- **"Creative vs professional" balance** → discipline in grid/type/perf; creativity concentrated in hero, transitions, and hover moments.

---

## 11. Open Questions (non-blocking)
- Generate Higgsfield imagery, or ship with CSS/gradient placeholders for v1? (Confirm at imagery step.)
- Contact form: real backend/email integration vs client-side + mailto for v1? (Default: client-side validate + API stub/mailto.)
