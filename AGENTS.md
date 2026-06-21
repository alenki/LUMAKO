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

# Commands

```bash
npm run dev        # next dev - http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit (strict)
npm run lint       # eslint (next core-web-vitals + typescript)
npm run test       # vitest run (jsdom + RTL)
```

- **Single test:** `npx vitest run tests/utils.test.ts` (one file) or `npx vitest run -t "name"`
  (one test by name). `npx vitest` (no `run`) for watch mode.
- **Deploy** targets Cloudflare Workers via OpenNext, not Vercel:
  `npm run preview` (local Workers runtime) and `npm run deploy` both run
  `opennextjs-cloudflare build` first. After changing `wrangler.jsonc` bindings, run
  `npm run cf-typegen` to regenerate `cloudflare-env.d.ts`.
- Shell is **PowerShell on Windows** - use PowerShell syntax for any shell work.

# Architecture

A statically-prerendered marketing site (Next 16 App Router, React 19, TS strict) deployed to
**Cloudflare Workers via OpenNext** (`open-next.config.ts` -> `.open-next/worker.js`, served by
`wrangler.jsonc`). `@/*` path alias maps to the repo root. There is no DB and no client state
library; the only server logic is the contact route.

- **Content is data, not markup.** `lib/content/*` is the single source of truth - `work.ts`
  (case studies), `services.ts`, `copy.ts`, `clients.ts`, `site.ts`, all typed by
  `lib/content/types.ts`. Pages under `app/` compose presentational sections from
  `components/sections/<page>/` and feed them this data; don't hardcode copy or work items in
  components. Routes are just `/`, `/work`, `/about`, `/contact` plus `app/sitemap.ts` /
  `app/robots.ts` - `/work` is a single index (no `[slug]` detail route), and case-study cards
  link out to live sites via `CaseStudy.href`.
- **Contact pipeline.** `ContactForm` -> `POST app/api/contact/route.ts`. Validation lives in
  `components/sections/contact/validation.ts` and is shared by client and server. The route has a
  honeypot (`website` field), formats mail via `email.ts`, and sends through the Cloudflare
  **Email Routing `EMAIL` binding**. Secrets (`CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) come from
  `.dev.vars` locally / Worker secrets in prod - when the binding or secrets are absent it logs the
  submission and returns success, so local dev needs no setup.
- **SEO.** `lib/seo/*` owns canonical URLs and metadata. Key gotcha: **Next replaces (not merges)
  `openGraph` per route segment**, so every page must emit a full OG block via the `socialMeta()`
  helper (`lib/seo/metadata.ts`). `lib/seo/config.ts` is the single source for `SITE_URL`
  (`lumako.net`). JSON-LD is injected by `components/seo/JsonLd.tsx` from `lib/seo/jsonld.ts`;
  `app/opengraph-image.tsx` / `app/twitter-image.tsx` render the social images.
- **Styling.** Tailwind v4, CSS-first. `styles/globals.css` `@theme` is the source of truth for
  all tokens (colors, the fluid `--text-*` scale, easings); fluid spacing uses the `--vw` custom
  properties and `.label-caps` is the shared eyebrow utility. Class merging via `cn()` in
  `lib/utils.ts`.
- **Motion.** Shared variants and signature easings live in `lib/motion.ts` (reuse `fadeUp` /
  `focusIn`, don't redefine). Lenis smooth scroll, the custom `Cursor`, and `PageTransition` /
  `RouteCurtain` are wired once in `app/layout.tsx`. All motion must respect reduced-motion
  (`lib/useReducedMotion.ts`).
- **Responsive convention (locked >=1700px reference).** Base Tailwind classes hold the tuned
  >=1700px reference layout; adapt *downward* with `max-[...]` variants only. Do not mix
  `min-[1700px]:` with `sm:` - Tailwind v4 orders `min-[]` before `sm:`, which drifts the
  reference layout.

> Note: `README.md` is partly stale (it describes a Three.js/WebGL hero and a `/work/[slug]`
> route). Neither exists - the hero is a self-drawing SVG (`components/hero/HeroMarker.tsx`) and
> there is no slug route. Trust the code over the README for routes and the hero.
