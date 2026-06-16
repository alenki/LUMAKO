# Lumako Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an award-winning, multi-page marketing website for Lumako — a web & product design/build studio — with a cinematic Three.js hero, Editorial-Luxe typography, dark-monochrome + electric-blue palette, and orchestrated Framer Motion.

**Architecture:** Next.js 15 App Router + TypeScript + Tailwind v4 (CSS-first tokens). A small design-system foundation (tokens, fonts, motion variants, UI primitives) is built first, then a shared shell (nav/footer/cursor/smooth-scroll/page-transitions), then a typed content layer, then the WebGL hero, then pages composed from reusable sections. Verified in-browser with Playwright.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, `motion` (Framer Motion), three + @react-three/fiber + @react-three/drei + @react-three/postprocessing, Lenis, next/font (Fraunces, Hanken Grotesk) + geist (Geist Mono), Vitest (logic units).

**Plan granularity note (conscious adaptation of writing-plans):** This is a large, visual project executed by context-aware agents. Foundational/shared/hard pieces include complete code. Repetitive page-section work is specified as concrete build contracts (exact component name, layout, content source, motion, acceptance criteria) — concrete enough to implement without ambiguity, without pre-writing JSX that would only be re-typed during the build. TDD (Vitest) is applied to pure logic (utils, validation, content invariants); visual correctness is verified via typecheck + `next build` + Playwright screenshots, which is the appropriate "test" for presentation code.

---

## File Structure

```
app/
  layout.tsx              # root: fonts, <head> metadata, Providers, Cursor, SmoothScroll, Nav, Footer, PageTransition
  page.tsx                # Home
  work/page.tsx           # Work index
  work/[slug]/page.tsx    # Case study (+ generateStaticParams, generateMetadata)
  services/page.tsx
  studio/page.tsx
  contact/page.tsx
  api/contact/route.ts    # form handler (validates, returns ok; mailto fallback client-side)
  sitemap.ts / robots.ts  # SEO
  opengraph-image.tsx     # default OG (optional)
components/
  layout/  Nav.tsx  Footer.tsx  PageTransition.tsx  SmoothScroll.tsx  Cursor.tsx  LocalTime.tsx
  ui/      Button.tsx  MagneticButton.tsx  Reveal.tsx  TextReveal.tsx  Counter.tsx  Marquee.tsx
           Eyebrow.tsx  SectionHeading.tsx  Tag.tsx  Field.tsx  Logo.tsx
  three/   HeroCanvas.tsx  WireframeForm.tsx  Starfield.tsx  HeroFallback.tsx
  sections/
    home/  Hero.tsx  Manifesto.tsx  ServicesOverview.tsx  SelectedWork.tsx  ProcessTeaser.tsx  Stats.tsx  Testimonial.tsx  CtaBand.tsx
    work/  WorkGrid.tsx  WorkCard.tsx  CaseHero.tsx  CaseBody.tsx  CaseGallery.tsx  CaseResults.tsx  NextProject.tsx
    services/ ServicesHero.tsx  Disciplines.tsx  ProcessSteps.tsx  Engagements.tsx
    studio/   StudioHero.tsx  Values.tsx  Team.tsx  Recognition.tsx  Clients.tsx
    contact/  ContactForm.tsx  ContactDetails.tsx
lib/
  content/  types.ts  services.ts  work.ts  studio.ts  copy.ts  site.ts
  motion.ts   utils.ts   useReducedMotion.ts   useDeviceTier.ts
styles/
  globals.css            # @import tailwind, @theme tokens, base, fonts hookup, fluid scale, utilities
tests/
  utils.test.ts  content.test.ts  contact-validation.test.ts
```

**Boundaries:** `components/ui` = generic primitives (no business content). `components/sections/*` = composed, content-aware blocks. `lib/content` = the single source of all copy/data (typed). `components/three` = isolated WebGL, dynamically imported. Pages are thin compositions of sections.

---

## Phase 0 — Scaffold & Configuration

### Task 0.1: Initialize Next.js project

**Files:** project root (creates `package.json`, `tsconfig.json`, `next.config.ts`, `app/`, etc.)

- [ ] **Step 1:** Scaffold into the existing repo (run in a temp dir then move, or use `.`). Run:
```bash
npx create-next-app@latest . --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --turbopack
```
If the dir is non-empty, scaffold in `../lumako-init` and copy `app/`, configs (`next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `package.json`, `next-env.d.ts`) into the repo, preserving `README.md`, `.gitignore`, `docs/`.

- [ ] **Step 2:** Install runtime + dev deps. Run:
```bash
npm i motion three lenis geist clsx tailwind-merge
npm i @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @types/three
```

- [ ] **Step 3:** Verify dev server boots. Run: `npm run dev` → open `http://localhost:3000` → expect Next welcome page, no console errors. Stop server.

- [ ] **Step 4:** Add scripts to `package.json`: `"test": "vitest run"`, `"typecheck": "tsc --noEmit"`.

- [ ] **Step 5:** Configure `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: [] },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

- [ ] **Step 6: Commit** `chore: scaffold next.js 15 + tailwind v4 + deps`.

> **Compatibility risk:** @react-three/fiber/drei/postprocessing must match React 19. Install latest; if `npm run build` reports peer/runtime errors, pin to the latest mutually-compatible set (R3F 9.x, drei 10.x, @react-three/postprocessing 3.x). Resolve before Phase 4.

---

### Task 0.2: Design tokens + base CSS (`styles/globals.css`)

**Files:** Create `styles/globals.css`; import it in `app/layout.tsx`; delete the default `app/globals.css` content.

- [ ] **Step 1:** Write `styles/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-bg-elev: #111111;
  --color-card: #161616;
  --color-card-2: #1e1e1e;
  --color-fg: #fafafa;
  --color-fg-muted: #a1a1a1;
  --color-fg-dim: #6b6b6b;
  --color-line: rgba(255,255,255,0.10);
  --color-line-strong: rgba(255,255,255,0.18);
  --color-accent: #3080ff;
  --color-accent-deep: #1447e6;
  --color-accent-soft: rgba(48,128,255,0.14);
  --color-spark: #ff6568;

  --radius: 0.625rem;
  --radius-lg: 1.5rem;
  --radius-xl: 2rem;

  --font-display: var(--font-fraunces);
  --font-sans: var(--font-hanken);
  --font-mono: var(--font-geist-mono);

  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);

  --text-7xl: clamp(3rem, 6vw, 6.5rem);
  --text-6xl: clamp(2.475rem, 3.3vw, 3.3rem);
  --text-5xl: clamp(2.025rem, 2.75vw, 2.75rem);
  --text-4xl: clamp(1.5rem, 2vw, 2rem);
  --text-3xl: clamp(1.2rem, 1.6vw, 1.6rem);
  --text-2xl: clamp(0.975rem, 1.3vw, 1.3rem);
  --text-xl:  clamp(0.825rem, 1.1vw, 1.1rem);
  --text-base:clamp(0.875rem, 0.95vw, 1rem);
}

:root {
  --vw: clamp(0.5rem, 0.8vw, 1rem);
  --vw-0_5: calc(var(--vw) * 0.5);
  --vw-1: var(--vw);
  --vw-2: calc(var(--vw) * 2);
  --vw-3: calc(var(--vw) * 3);
  --vw-4: calc(var(--vw) * 4);
  --vw-6: calc(var(--vw) * 6);
  --vw-8: calc(var(--vw) * 8);
  --py-section: var(--vw-6);
  --py-section-lg: var(--vw-8);
  --content-w: clamp(40rem, 80vw, 100rem);
  --content-w-narrow: clamp(40rem, 70vw, 90rem);
  --header-h: 4rem;
}

* { box-sizing: border-box; }
html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.6;
  overflow-x: hidden;
}
::selection { background: var(--color-accent); color: #fff; }

/* hide native cursor on pointer-fine devices (custom cursor takes over) */
@media (pointer: fine) { html.has-cursor, html.has-cursor * { cursor: none; } }

.font-display { font-family: var(--font-display); }
.font-mono { font-family: var(--font-mono); }

.container-x { width: var(--content-w); max-width: 100%; margin-inline: auto; padding-inline: var(--vw-3); }

/* hairline helpers */
.rule { border-color: var(--color-line); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 2:** In `postcss.config.mjs` confirm `@tailwindcss/postcss` plugin present (create-next-app v15 + tailwind flag sets this).

- [ ] **Step 3:** Verify: temporarily put `<div className="bg-accent text-bg p-vw-3">test</div>` in `app/page.tsx`, run `npm run dev`, confirm blue background renders. Remove test markup.

- [ ] **Step 4: Commit** `feat: design tokens and base styles`.

---

### Task 0.3: Fonts (`app/layout.tsx`)

**Files:** Modify `app/layout.tsx`.

- [ ] **Step 1:** Configure fonts and root layout:
```tsx
import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"], display: "swap", variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});
const hanken = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-hanken" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lumako.studio"),
  title: { default: "Lumako — Web & Product Studio", template: "%s — Lumako" },
  description: "Lumako is a web & product design/build studio. We design & build the products people don't forget.",
  openGraph: { type: "website", siteName: "Lumako" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
> Note: `GeistMono.variable` exposes `--font-geist-mono`. Confirmed by `geist` package.

- [ ] **Step 2:** Verify fonts load: add `<h1 className="font-display text-7xl">Lumako</h1>` to `app/page.tsx`; `npm run dev`; confirm Fraunces serif renders (DevTools → Computed → font-family). Keep as temporary home content for now.

- [ ] **Step 3: Commit** `feat: configure Fraunces, Hanken Grotesk, Geist Mono`.

---

## Phase 1 — Design-System Foundation

### Task 1.1: Utilities + motion library + hooks (with tests)

**Files:** Create `lib/utils.ts`, `lib/motion.ts`, `lib/useReducedMotion.ts`, `lib/useDeviceTier.ts`, `tests/utils.test.ts`.

- [ ] **Step 1 (TDD): Write failing test** `tests/utils.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-fg", false && "hidden", "font-mono")).toBe("text-fg font-mono");
  });
});
```
- [ ] **Step 2:** Run `npm test` → expect FAIL (cn not defined).
- [ ] **Step 3:** Implement `lib/utils.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```
- [ ] **Step 4:** Run `npm test` → expect PASS.
- [ ] **Step 5:** Implement `lib/motion.ts` (shared variants/easings):
```ts
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.08, ease: easeOutExpo } }),
};
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
export const maskReveal = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 16 },
  show: { clipPath: "inset(0 0 0% 0)", y: 0, transition: { duration: 1, ease: easeOutExpo } },
};
```
- [ ] **Step 6:** Implement `lib/useReducedMotion.ts` (re-export `useReducedMotion` from `motion/react`) and `lib/useDeviceTier.ts`:
```ts
"use client";
import { useEffect, useState } from "react";
// returns "high" | "low": low for coarse-pointer/small screens/low cores → drives 3D fallback
export function useDeviceTier() {
  const [tier, setTier] = useState<"high" | "low">("high");
  useEffect(() => {
    const coarse = matchMedia("(pointer: coarse)").matches;
    const small = matchMedia("(max-width: 768px)").matches;
    const cores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setTier(coarse || small || cores ? "low" : "high");
  }, []);
  return tier;
}
```
- [ ] **Step 7: Commit** `feat: utils, motion variants, device/motion hooks`.

### Task 1.2: Primitive components — Reveal, TextReveal, Counter, Marquee, Eyebrow, SectionHeading, Tag, Button, MagneticButton, Logo, Field

For EACH primitive: implement as a focused client/server component, then verify it renders in isolation on a temporary `/sandbox` route, then remove from sandbox. Acceptance contracts:

- [ ] **Reveal** (`components/ui/Reveal.tsx`, client): wraps children, uses `motion.div` with `fadeUp` + `whileInView`/`viewport={{ once: true, margin: "-10%" }}`; respects reduced motion (renders static when reduced). Props: `delay?`, `as?`, `className?`.
- [ ] **TextReveal** (`components/ui/TextReveal.tsx`, client): splits text into lines/words, applies `maskReveal` stagger; prop `text`/`children`, `as` (h1..p), `stagger?`. Reduced-motion → plain text.
- [ ] **Counter** (`components/ui/Counter.tsx`, client): animates number 0→value when in view using `useMotionValue`+`animate`; props `value`, `suffix?`, `decimals?`.
- [ ] **Marquee** (`components/ui/Marquee.tsx`, client): infinite horizontal scroll of children (duplicated track) via CSS/Framer; pauses on reduced motion; props `speed?`, `reverse?`.
- [ ] **Eyebrow** (`components/ui/Eyebrow.tsx`, server): mono uppercase label with leading index, e.g. `(01) — WHAT WE BELIEVE`; props `index?`, `children`. Uses `font-mono text-mono-sm tracking-widest text-fg-muted`.
- [ ] **SectionHeading** (`components/ui/SectionHeading.tsx`, server): Fraunces display heading with optional italic accent span; props `children`, `className`.
- [ ] **Tag** (`components/ui/Tag.tsx`, server): hairline pill chip; props `children`, `active?`.
- [ ] **Button** (`components/ui/Button.tsx`): variants `primary` (blue), `ghost` (hairline), `link` (animated underline). Renders `<a>`/`<Link>` or `<button>`; props `href?`, `variant`, `children`.
- [ ] **MagneticButton** (`components/ui/MagneticButton.tsx`, client): wraps Button; on pointer-fine, translates toward cursor within radius via Framer springs; disabled on reduced motion / coarse pointer.
- [ ] **Logo** (`components/ui/Logo.tsx`, server): "LUMAKO" wordmark (Fraunces, tight tracking) + optional luminous dot; sizes via prop.
- [ ] **Field** (`components/ui/Field.tsx`, client): labeled input/textarea with hairline underline style, focus-visible accent, error text; props `label`, `name`, `type`, `as?`, `error?`.

- [ ] **Verify all:** `npm run typecheck` passes; each rendered once on temp `/sandbox` and screenshotted via Playwright; remove sandbox.
- [ ] **Commit** `feat: ui primitives (reveal, counter, marquee, buttons, fields, headings)`.

---

## Phase 2 — Shared Shell

### Task 2.1: SmoothScroll, Cursor, PageTransition, LocalTime

**Files:** `components/layout/SmoothScroll.tsx`, `Cursor.tsx`, `PageTransition.tsx`, `LocalTime.tsx`.

- [ ] **SmoothScroll** (client): Lenis provider wrapping `children`; raf loop; disabled when `prefers-reduced-motion`. Pattern:
```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```
- [ ] **Cursor** (client): fixed dot + lagging ring following pointer (Framer springs); grows/labels on hover of `[data-cursor]` elements; hidden on coarse pointer + reduced motion; toggles `html.has-cursor`.
- [ ] **PageTransition** (client): `AnimatePresence` keyed on `usePathname()`; electric-blue panel wipe (cover → reveal) on route change; reduced motion → instant. Wraps `{children}` in `app/layout`.
- [ ] **LocalTime** (client): live `HH:MM:SS` (user locale) + label "SF / Remote"; mono.
- [ ] **Verify:** typecheck; smooth scroll + cursor visible in dev; route change shows wipe.
- [ ] **Commit** `feat: smooth scroll, custom cursor, page transitions, local time`.

### Task 2.2: Nav + Footer + layout wiring

**Files:** `components/layout/Nav.tsx`, `Footer.tsx`; modify `app/layout.tsx`.

- [ ] **Nav** (client): sticky, `backdrop-blur-xl bg-bg/70`, hairline bottom border; left Logo; center/right links (Home, Work, Services, Studio) with animated underline + active state via `usePathname`; right: `LocalTime` + `MagneticButton` "Start a project" → /contact; mobile: hamburger → full-screen overlay menu with staggered link reveal. Height `--header-h`.
- [ ] **Footer** (server/client): top CTA row optional; monumental "LUMAKO" wordmark (responsive, near full-width, gradient hairline); columns (Pages, Social, Contact email); newsletter field (client) + success state; bottom colophon row (© year, "Built in the light", credits). Background subtle `from-bg to-bg-elev`.
- [ ] **Wire `app/layout.tsx`:** body → `<SmoothScroll><Cursor/><Nav/><PageTransition>{children}</PageTransition><Footer/></SmoothScroll>`.
- [ ] **Verify:** typecheck; nav/footer render on every route; mobile menu works; Playwright desktop+mobile screenshot.
- [ ] **Commit** `feat: navigation, footer, app shell wiring`.

---

## Phase 3 — Content Data Layer (with tests)

### Task 3.1: Types + content + invariant tests

**Files:** `lib/content/types.ts`, `site.ts`, `services.ts`, `work.ts`, `studio.ts`, `copy.ts`, `tests/content.test.ts`.

- [ ] **Step 1:** Define `types.ts`:
```ts
export type Discipline = "Strategy" | "Brand" | "Web" | "Product" | "Engineering" | "Motion";
export interface Service { id: string; index: string; title: string; blurb: string; deliverables: string[]; }
export interface WorkResult { label: string; value: number; suffix?: string; }
export interface CaseStudy {
  slug: string; client: string; title: string; year: string; role: string;
  disciplines: Discipline[]; cover: string; accent?: string; summary: string;
  challenge: string; approach: string[]; gallery: string[]; results: WorkResult[]; featured?: boolean;
}
export interface ProcessPhase { index: string; name: string; detail: string; }
export interface Value { title: string; body: string; }
export interface TeamMember { name: string; role: string; photo: string; }
```
- [ ] **Step 2:** Populate `services.ts` (6 disciplines w/ real blurbs + deliverables), `work.ts` (≥6 case studies, ≥3 `featured`, unique slugs, plausible results), `studio.ts` (manifesto, 4 values, team, recognition list, clients list), `copy.ts` (hero/manifesto/cta/meta strings per page), `site.ts` (nav links, socials, email, locale). Imagery paths point to `/images/...` (placeholders OK; gradient fallback if missing).
- [ ] **Step 3 (TDD):** `tests/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { work } from "@/lib/content/work";
import { services } from "@/lib/content/services";
describe("content invariants", () => {
  it("work slugs are unique", () => {
    const slugs = work.map(w => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("has at least 3 featured case studies", () => {
    expect(work.filter(w => w.featured).length).toBeGreaterThanOrEqual(3);
  });
  it("has exactly 6 services with unique ids", () => {
    expect(services.length).toBe(6);
    expect(new Set(services.map(s => s.id)).size).toBe(6);
  });
});
```
- [ ] **Step 4:** Run `npm test` → PASS (fix data until green).
- [ ] **Step 5: Commit** `feat: typed content layer (services, work, studio, copy)`.

---

## Phase 4 — Signature Three.js Hero

### Task 4.1: WebGL scene + fallback + composition

**Files:** `components/three/Starfield.tsx`, `WireframeForm.tsx`, `HeroCanvas.tsx`, `HeroFallback.tsx`, `components/sections/home/Hero.tsx`.

- [ ] **HeroFallback** (server): full-bleed black with a luminous radial-gradient (accent), faint CSS-animated hairline grid; used as Suspense fallback AND for low tier/reduced motion.
- [ ] **Starfield** (client/R3F): instanced points drifting slowly; subtle parallax to pointer; count scaled by device tier.
- [ ] **WireframeForm** (client/R3F): luminous wireframe geometry (e.g., `icosahedronGeometry` detail 4 or torus-knot) with thin emissive line material; slow auto-rotation; mouse-parallax tilt via `useFrame`; scroll progress (passed as prop or via Lenis) dollies camera through it.
- [ ] **HeroCanvas** (client): `<Canvas dpr={[1, 1.75]} gl={{ antialias: true }}>` with `<Starfield/>`, `<WireframeForm/>`, and `<EffectComposer><Bloom .../></EffectComposer>` from @react-three/postprocessing (intensity tuned, mipmapBlur). Exported but consumed via `next/dynamic(() => import(...), { ssr: false, loading: HeroFallback })`.
- [ ] **Hero** (`sections/home/Hero.tsx`, client): full-viewport section; renders `HeroCanvas` (dynamic) when `useDeviceTier()==="high"` && not reduced-motion, else `HeroFallback`; overlays composited content — `Eyebrow` ("(web & product studio)"), `TextReveal` headline ("We design & build the products people don't forget." — "don't forget" italic Fraunces), sub paragraph, `MagneticButton` CTA, scroll cue; staggered load orchestration.
- [ ] **Verify:** `npm run dev` → 3D renders, 60fps (DevTools perf), no console errors; toggle reduced-motion (DevTools rendering) → fallback shows; `npm run build` succeeds (no SSR/window errors); Playwright screenshot hero.
- [ ] **Commit** `feat: cinematic webgl hero with graceful fallback`.

---

## Phase 5 — Pages (parallelizable after Phases 0–4)

Each section component pulls from `lib/content`, uses primitives + motion, and is wrapped in `Reveal`/`whileInView`. Each page is a thin composition. Acceptance for every page: typecheck clean, `next build` clean, responsive at 390/768/1440, reduced-motion safe, Playwright screenshot captured.

### Task 5.1: Home (`app/page.tsx` + `sections/home/*`)
- [ ] **Manifesto:** Eyebrow `(01)` + large Fraunces statement w/ italic accents (from `copy.ts`); hairline framing.
- [ ] **ServicesOverview:** Eyebrow `(02)`; interactive list of 6 services — row hover reveals blurb + (optional) accent media; index numbers in mono; link to /services.
- [ ] **SelectedWork:** Eyebrow `(03)`; 3–4 featured `WorkCard`s (large), alternating layout, parallax cover media, hover reveal of title/disciplines; "View all work" link.
- [ ] **ProcessTeaser:** condensed numbered phases → link to /services.
- [ ] **Stats:** 3–4 `Counter`s (e.g., projects, years, awards, NPS) on hairline grid.
- [ ] **Testimonial:** single large Fraunces pull-quote + attribution.
- [ ] **CtaBand:** big "Let's build something unforgettable." + `MagneticButton` → /contact; accent glow.
- [ ] Compose in `app/page.tsx`. **Commit** `feat: home page`.

### Task 5.2: Work index (`app/work/page.tsx` + `sections/work/WorkGrid.tsx`, `WorkCard.tsx`)
- [ ] Intro heading + discipline filter (`Tag` chips, client-side filter state, animated layout via Framer `layout`).
- [ ] Responsive grid of `WorkCard` (cover, client, title, disciplines, year; hover media reveal/parallax; links to `/work/[slug]`). Page metadata via `export const metadata`.
- [ ] **Commit** `feat: work index with filtering`.

### Task 5.3: Case study (`app/work/[slug]/page.tsx` + `sections/work/Case*`)
- [ ] `generateStaticParams` from `work`; `generateMetadata` per case; 404 via `notFound()` for bad slug.
- [ ] `CaseHero` (client, role, year, services, title), `CaseBody` (summary/challenge/approach editorial 2-col + pull quotes), `CaseGallery` (full-bleed + parallax images, gradient placeholders), `CaseResults` (Counters), `NextProject` (large hover link to next case).
- [ ] **Commit** `feat: case study detail pages`.

### Task 5.4: Services (`app/services/page.tsx` + `sections/services/*`)
- [ ] `ServicesHero`, `Disciplines` (6 expandable/accordion or hover-detail blocks w/ deliverables), `ProcessSteps` (Discover→Define→Design→Build→Launch→Evolve, numbered, scroll-revealed), `Engagements` (Project/Retainer/Embedded cards). Metadata.
- [ ] **Commit** `feat: services page`.

### Task 5.5: Studio (`app/studio/page.tsx` + `sections/studio/*`)
- [ ] `StudioHero` (manifesto), `Values` (4, editorial grid), `Team` (portrait grid, hover reveal), `Recognition` (awards `Marquee`), `Clients` (`Marquee`). Metadata.
- [ ] **Commit** `feat: studio page`.

### Task 5.6: Contact (`app/contact/page.tsx`, `sections/contact/*`, `app/api/contact/route.ts`) — with validation tests
- [ ] **Step 1 (TDD):** `tests/contact-validation.test.ts` for a pure `validateContact(data)` in `sections/contact/validation.ts` (required name/email, email regex, message min length → returns `{ ok, errors }`). Write failing test, implement, pass.
- [ ] **ContactForm** (client): `Field`s (name, email, company, budget select, services multi-`Tag`, message); uses `validateContact`; POSTs to `/api/contact`; success state animation; mailto fallback link.
- [ ] **api/contact/route.ts:** validate server-side with same `validateContact`; return `{ ok: true }` (no external email dependency for v1; structured for later integration).
- [ ] **ContactDetails:** email, scheduling CTA, socials, `LocalTime`.
- [ ] **Commit** `feat: contact page with validated form`.

### Task 5.7: SEO endpoints
- [ ] `app/sitemap.ts` (all routes incl. case slugs), `app/robots.ts`, optional `app/opengraph-image.tsx`. **Commit** `feat: sitemap, robots, og`.

---

## Phase 6 — Polish & Verification

### Task 6.1: Cross-cutting QA pass
- [ ] **Responsive sweep:** Playwright screenshot every route at 390×844, 768×1024, 1440×900; fix overflow/spacing/type issues.
- [ ] **Reduced-motion sweep:** emulate `prefers-reduced-motion: reduce`; confirm 3D fallback, no Lenis, instant transitions, static reveals; screenshot.
- [ ] **A11y:** keyboard-tab every route (visible focus rings), landmarks/alt text/labels present, contrast check on `--fg-muted`/`--fg-dim` over `--bg`.
- [ ] **Performance:** `next build`; check bundle; ensure 3D code-split; cap DPR; lazy media; no CLS.
- [ ] **Console:** zero errors/warnings across routes.
- [ ] **Commit** `chore: responsive, a11y, reduced-motion, perf polish`.

### Task 6.2: Final verification (verification-before-completion)
- [ ] Run `npm run typecheck` → clean. Run `npm test` → all green. Run `npm run build` → success.
- [ ] Playwright: navigate all routes, capture final screenshots, confirm hero animates, transitions work, forms validate.
- [ ] Update `README.md` with run instructions (`npm run dev`, stack, structure).
- [ ] **Commit** `docs: readme run instructions`.

---

## Phase 7 — Imagery (optional, confirm first)
- [ ] **Confirm with user** before spending Higgsfield credits. If yes: generate a curated on-brand set (dark cinematic device mockups + abstract luminous renders) for case covers/galleries + studio team/portraits; save to `public/images/`; wire into `work.ts`/`studio.ts`. If no: keep gradient/noise placeholders. **Commit** `feat: brand imagery`.

---

## Self-Review (against spec)

**Spec coverage:** Concept/positioning → copy.ts + Hero/Manifesto (✓). Palette/tokens → Task 0.2 (✓). Type trio → Task 0.3 (✓). Fluid scale → 0.2 (✓). Motion language (easing, masked reveals, Lenis, cursor, page transitions, magnetic, marquee, counters) → Phases 1–2 (✓). 3D hero + degradation → Phase 4 (✓). All 6 routes incl. work/[slug] → Phase 5 (✓). Shared shell (nav/footer/live time) → Phase 2 (✓). Contact form (+api/mailto) → 5.6 (✓). Imagery/Higgsfield + confirm → Phase 7 (✓). Perf/a11y/reduced-motion → Phase 6 (✓). SEO/OG → 0.3 meta + 5.7 (✓). File structure → matches spec §6 (✓).

**Placeholder scan:** Foundational code is complete. Page-section tasks are concrete build contracts (named component, content source, layout, motion, acceptance) per the stated granularity adaptation — not vague TODOs.

**Type consistency:** `cn`, motion variants (`fadeUp`/`stagger`/`maskReveal`), `useDeviceTier`, content interfaces (`Service`/`CaseStudy`/`Discipline`/`ProcessPhase`/`Value`/`TeamMember`), `validateContact` — referenced consistently across tasks. CSS token names (`--color-accent`, `--font-display`, `--text-7xl`, `--vw-*`) match between globals and component usage.
