# Lumako - Web · AI · Apps

The official website for **Lumako**, a full-stack studio that ships web, AI, and
app products. A high-end, proof-led marketing site: light monochrome + a single lume-gold
accent, Inter typography (weighted headings, dark body), a self-drawing gold SVG marker in the
home hero, and orchestrated motion.

**Live concept:** "The demo is the pitch."

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **Motion** (Framer Motion) for animation + page transitions
- **SVG + Motion** - the self-drawing gold marker in the home hero
- **Lenis** smooth scroll
- Fonts: **Inter** (one variable family - display + body) · **Geist Mono** (code only)
- **Vitest** for unit tests
- **OpenNext + Cloudflare Workers** for deploy (`opennextjs-cloudflare` + `wrangler`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (next build)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest (utils, content invariants, contact validation, hero, marquee…)
```

Deploy targets Cloudflare Workers (via OpenNext), not Vercel:

```bash
npm run preview    # opennextjs-cloudflare build + local Workers preview
npm run deploy     # opennextjs-cloudflare build + deploy to Cloudflare Workers
npm run cf-typegen # regenerate CloudflareEnv types from wrangler.jsonc
```

## Routes

| Route | Description |
|---|---|
| `/` | Home - SVG marker hero, selected work, studio statement, services overview |
| `/work` | Case-study index - a static grid; each card links out to the live project site (new tab) |
| `/about` | Studio statement + get in touch |
| `/contact` | Validated project-inquiry form + studio details |

Case studies link out to the live external sites (`lib/content/work.ts` `href`), so there is no
internal `/work/<slug>` page. Alongside the pages, the app exposes the usual Next.js file-convention
routes: `app/api/contact` (POST inquiry handler), `app/sitemap.ts`, `app/robots.ts`, and the
`app/opengraph-image.tsx` / `app/twitter-image.tsx` social-image generators.

## Structure

```
app/          # routes, layout, api/contact, sitemap, robots, opengraph-image, twitter-image
components/
  layout/     # Nav, Footer, Cursor, SmoothScroll, PageTransition, Providers, LocalTime
  ui/         # primitives: Button, MagneticButton, Reveal, TextReveal, Counter, Marquee, Field, CoverPanel…
  hero/       # HeroMarker - the self-drawing gold marker circle (SVG)
  sections/   # page-specific composed sections (home, work, about, contact)
  seo/        # JsonLd - structured-data injector
lib/
  content/    # typed content: services, work, clients, copy, site (types.ts)
  seo/        # SEO layer: config, metadata (socialMeta), jsonld graphs, og image renderer
  motion.ts   # shared variants + easings
  mediaHooks.ts, utils.ts
styles/
  globals.css # design tokens (@theme), fluid scale, helpers
docs/superpowers/  # design specs + implementation plans
```

## Design notes

- **Accessibility:** semantic landmarks + skip link, keyboard focus rings, `aria-pressed`
  toggles, full `prefers-reduced-motion` support (smooth scroll, transitions, and reveals all
  degrade gracefully; the SVG hero marker renders pre-drawn).
- **Performance:** the home hero is a lightweight self-drawing SVG marker
  (`components/hero/HeroMarker.tsx`) animated with Motion - no WebGL/Three.js, no canvas. All
  routes are statically prerendered; images are served as AVIF/WebP.
- **Color discipline:** lume gold (`#D49A2E`) is the only accent - wordmark dot, focus rings,
  key rules, one lume button per view. No second accent and no drop shadows. The few gradients are
  atmosphere only: the white `.glow-accent` radial behind the hero / CTA, the nav's
  fade-to-transparent wash, and the neutral CoverPanel placeholder fills.
- **Typography:** one family - **Inter** (variable), exposed as `--font-grotesk` and mapped to
  both `--font-display` and `--font-sans`; Geist Mono is reserved for code / the ledger marks.
  The reading is set by the home "Let's build something" disciplines section
  (`ServicesOverview`) and held site-wide:
  - **Headings carry weight, never thinness** - `font-medium` for display / section / hero
    headlines, `font-semibold` for card and sub-headings, tight tracking. The one exception is
    the home hero (`MOST WORK GETS SCROLLED PAST`), kept `font-extrabold uppercase` as the signature.
  - **Body copy** uses `--color-fg-body` (`#3f3f3f`) with `leading-relaxed` - darker and more
    present than the label gray.
  - **Eyebrows / small labels** stay quiet via the shared `.label-caps` (uppercase, `.18em`,
    `--color-fg-muted`). Text-color ladder: `--color-fg` `#0a0a0a` (ink / headings) →
    `--color-fg-body` `#3f3f3f` (body) → `--color-fg-muted` `#737373` (labels / meta) →
    `--color-fg-dim` `#a1a1a1` (fine print).

