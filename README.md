# Lumako — Web · AI · Apps

The official website for **Lumako**, a solo full-stack studio that ships web, AI, and
app products. A high-end, proof-led marketing site: light monochrome + a single lume-gold
accent, Inter Tight typography, a cinematic (light-graded) Three.js hero, and orchestrated motion.

**Live concept:** "The demo is the pitch."

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **Motion** (Framer Motion) for animation + page transitions
- **Canvas 2D** — the "drafted, then built" blueprint hero (no WebGL deps)
- **Lenis** smooth scroll
- Fonts: **Inter Tight** (display + body) · **Geist Mono** (code only)
- **Vitest** for unit tests

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (Turbopack)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest (utils, content invariants, contact validation)
```

## Routes

| Route | Description |
|---|---|
| `/` | Home — 3D hero, manifesto, services, selected work, process, proof, receipts, CTA |
| `/work` | Filterable case-study index |
| `/work/[slug]` | Case study detail (statically generated) |
| `/services` | Disciplines, process, engagement models |
| `/studio` | Manifesto, values, team, recognition, clients |
| `/contact` | Validated project-inquiry form + studio details |

## Structure

```
app/          # routes, layout, api/contact, sitemap, robots
components/
  layout/     # Nav, Footer, Cursor, SmoothScroll, PageTransition, LocalTime
  ui/         # primitives: Button, MagneticButton, Reveal, TextReveal, Counter, Marquee, Field, CoverPanel…
  hero/       # HeroBlueprint (Canvas 2D) + blueprint/ (geometry, phases, render)
  sections/   # page-specific composed sections (home, work, services, studio, contact)
lib/
  content/    # typed content: services, work, studio, copy, site
  motion.ts   # shared variants + easings
  mediaHooks.ts, utils.ts
styles/
  globals.css # design tokens (@theme), fluid scale, helpers
docs/superpowers/  # design spec + implementation plan
```

## Design notes

- **Accessibility:** semantic landmarks + skip link, keyboard focus rings, `aria-pressed`
  toggles, full `prefers-reduced-motion` support (3D, smooth scroll, transitions, and
  reveals all degrade gracefully). The WebGL hero falls back to a static luminous
  gradient on low-power / touch devices.
- **Performance:** the 3D canvas is client-only (`ssr: false`), DPR-capped, and light-graded
  (no postprocessing bloom); all routes are statically prerendered.
- **Color discipline:** lume gold (`#D49A2E`) is the only accent — wordmark dot, focus rings,
  key rules, and the single dark footer glow. No second accent, no drop shadows, no gradients
  except that one footer glow. Ink primary buttons; one lume button per view.

---

## Frontend aesthetics (project north star)

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on: Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics. Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration. Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic. Avoid generic AI-generated aesthetics:- Overused font families (Inter, Roboto, Arial, system fonts)- Clichéd color schemes (particularly purple gradients on white backgrounds)- Predictable layouts and component patterns- Cookie-cutter design that lacks context-specific character Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
