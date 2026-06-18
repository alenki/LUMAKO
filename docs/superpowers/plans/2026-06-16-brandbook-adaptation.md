# Lumako Brandbook Adaptation - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the Lumako site from its dark/blue/serif identity to the brandbook's light + lume-gold + Inter Tight system, and rewrite the English copy to the proof-led "the demo is the pitch" positioning.

**Architecture:** Remap the existing semantic Tailwind v4 `@theme` token *values* (dark→light, blue→lume) so ~90% of components flip automatically; swap fonts in the root layout; fix the handful of components with dark-assuming styles (hero scene, footer, cursor, mono chrome); rewrite `lib/content/*`. The footer becomes the brandbook's single dark "lume glow" band; the CTA band stays light.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (`@theme`) · `next/font/google` · Three.js / React Three Fiber · motion.

**Verification model:** This is a visual reskin + content rewrite, not unit-testable logic. The verification gate for each phase is: `npm run lint`, `npm run typecheck`, `npm run test` (keep the existing suite green), `npm run build`, and a visual pass on every route. TDD-style failing-tests-first does not apply to CSS/copy; do not fabricate unit tests for it.

**Source of truth:** `e:\Desktop\lumako-brandbook.html` and `docs/superpowers/specs/2026-06-16-lumako-brandbook-adaptation-design.md`.

**Per AGENTS.md:** before editing a code area, read the relevant `node_modules/next/dist/docs/` guide. Fonts (`01-app/01-getting-started/13-fonts.md`) and CSS (`.../11-css.md`) were already read for this plan.

---

## File map

**Foundation (must land first, edited by ONE worker - do not parallelize):**
- Modify: `styles/globals.css` - token values, lume aliases, `.label-caps`, selection, noise-veil, glow.
- Modify: `app/layout.tsx` - fonts (Inter Tight), metadata.

**Primitives (independent files, parallel-safe):**
- Modify: `components/ui/Button.tsx` - ink primary + new `lume`/`outline-dark` variants.
- Modify: `components/ui/Logo.tsx` - `Lumako.` Inter Tight.
- Modify: `components/ui/Eyebrow.tsx` - label-caps (Inter Tight, not mono).
- Modify: `components/ui/Tag.tsx` - label-caps, lume active.
- Modify: `components/layout/Cursor.tsx` - dark ring, lume active.

**Hero (3 coupled files, one worker):**
- Modify: `components/sections/home/Hero.tsx`, `components/three/HeroCanvas.tsx`, `components/three/HeroFallback.tsx`.

**Closing bands:**
- Modify: `components/layout/Footer.tsx` - the one dark lume-glow band.
- Modify: `components/sections/home/CtaBand.tsx` - stays light, ink CTA, drop dark glow.

**Content (edited by ONE worker - single files, do not parallelize across these):**
- Modify: `lib/content/site.ts`, `lib/content/copy.ts`, `lib/content/services.ts`, `lib/content/studio.ts`, `lib/content/work.ts`, `lib/content/types.ts`.

**Section reshapes (shape changes, must match the content shapes locked below):**
- Modify: `components/sections/home/Stats.tsx` (→ proof cells), `components/sections/home/Testimonial.tsx` (→ receipts strip).

**Dark-assumption sweep (token/contrast only, parallel-safe groups):**
- Home: `Manifesto.tsx`, `ServicesOverview.tsx`, `ProcessTeaser.tsx`, `SelectedWork.tsx`.
- Work: `WorkCard.tsx`, `WorkGrid.tsx`, `CaseHero.tsx`, `CaseBody.tsx`, `CaseGallery.tsx`, `CaseResults.tsx`, `NextProject.tsx`, `CoverPanel.tsx`.
- Services/Studio/Contact: `ServicesHero.tsx`, `Disciplines.tsx`, `Engagements.tsx`, `ProcessSteps.tsx`, `StudioHero.tsx`, `Values.tsx`, `Team.tsx`, `Recognition.tsx`, `Clients.tsx`, `ContactForm.tsx`, `ContactDetails.tsx`, `Field.tsx`, `SectionHeading.tsx`, `TextReveal.tsx`, `Marquee.tsx`, `Nav.tsx`, `PageTransition.tsx`.

---

## Task 1 - Foundation: tokens (`styles/globals.css`)

**Files:** Modify `styles/globals.css`

- [ ] **Step 1: Replace the `@theme` color/accent block** with the light + lume values.

```css
@theme {
  /* Surfaces - light */
  --color-bg: #ffffff;
  --color-bg-elev: #fafafa;
  --color-card: #f5f5f5;
  --color-card-2: #efefef;

  /* Text - ink on light */
  --color-fg: #0a0a0a;
  --color-fg-muted: #737373;
  --color-fg-dim: #a1a1a1;

  /* Lines - hairline #E5E5E5 */
  --color-line: #e5e5e5;
  --color-line-strong: #d4d4d4;

  /* Accent - lume, the only chroma */
  --color-accent: #d49a2e;
  --color-accent-deep: #9c6e1b;
  --color-accent-soft: rgba(212, 154, 46, 0.14);
  --color-lume-soft: #f4e6c6;

  /* Brand ink fill (buttons/CTA) + footer glow */
  --color-ink: #171717;
  --color-ink-fg: #fafafa;
  --color-glow: rgba(212, 154, 46, 0.4);

  /* Radii - keep base 10px; tighten the big ones */
  --radius: 0.625rem;     /* 10px */
  --radius-lg: 0.625rem;  /* was 1.5rem - brandbook has no large radii */
  --radius-xl: 0.75rem;   /* was 2rem - only slightly softer for nested */
  /* ...keep --color-spark REMOVED, keep easings + the --text-* scale unchanged... */
}
```

Keep the `@theme inline` font block (updated in Task 2), the `:root` fluid spacing, and the `--text-*` scale. **Delete `--color-spark`.** **Set `--header-h` to `3rem`** (brandbook: 48px sticky header).

- [ ] **Step 2: Base styles** - selection + focus + body.

```css
::selection { background: var(--color-accent); color: #1a1206; }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 2px; }
```
Remove `font-feature-settings: "ss01","cv01"` (those were Hanken features) or replace with Inter Tight-safe defaults (omit).

- [ ] **Step 3: Add a `.label-caps` utility** (replaces monospace chrome) and fix the noise/glow helpers.

```css
.label-caps {
  font-family: var(--font-sans);
  font-size: var(--text-mono);
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
}
.glow-accent {
  background: radial-gradient(60% 60% at 50% 40%, var(--color-accent-soft) 0%, transparent 70%);
}
/* noise-veil: screen-blend is invisible on white → multiply, lower opacity */
.noise-veil { opacity: 0.025; mix-blend-mode: multiply; /* keep inset/pointer-events/url */ }
```

- [ ] **Step 4: Add the footer glow band helper** (used by Task 6).

```css
.footer-glow {
  background: linear-gradient(180deg, #18181b 0%, #0a0a0a 100%);
}
.footer-glow::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(60% 120% at 15% 0%, var(--color-glow), rgba(212,154,46,0.08) 45%, transparent 70%);
}
```

- [ ] **Step 5: Verify** - `npm run lint` then `npm run build` compiles CSS without error. Commit: `style(tokens): flip design system to light + lume`.

---

## Task 2 - Foundation: fonts + metadata (`app/layout.tsx`, `globals.css`)

**Files:** Modify `app/layout.tsx`, `styles/globals.css`

- [ ] **Step 1: Swap the font imports** to Inter Tight (one family for display + sans). Remove Fraunces + Hanken. Keep Geist Mono for code only.

```tsx
import { Inter_Tight } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  axis: undefined, // variable weight + italic by default
});
```
Set `<html className={`${interTight.variable} ${GeistMono.variable}`}>`. Remove the `fraunces`/`hanken` consts and their `.variable` usages.

- [ ] **Step 2: Point the theme font vars at Inter Tight** in `globals.css` `@theme inline`:

```css
@theme inline {
  --font-display: var(--font-inter-tight);
  --font-sans: var(--font-inter-tight);
  --font-mono: var(--font-geist-mono);
}
```

- [ ] **Step 3: Update metadata** in `layout.tsx`: `metadataBase` → `https://lumako.com`; title default `"Lumako - Web · AI · Apps"`, template `"%s - Lumako"`; description per copy.meta.home (Task 8); keywords → `["web development","AI products","app development","product studio","Lumako"]`; openGraph siteName/title/description to match. Skip-link `bg-accent text-bg` becomes `bg-ink text-[#fafafa]` (lume skip link would be low-contrast).

- [ ] **Step 4: Verify** - `npm run typecheck` + `npm run build`. The site now renders Inter Tight everywhere `font-display`/`font-sans` are used. Commit: `feat(type): Inter Tight system + light metadata`.

---

## Task 3 - Primitive: Button (`components/ui/Button.tsx`)

**Files:** Modify `components/ui/Button.tsx`

- [ ] **Step 1: Update variants** - primary becomes ink; add `lume` and `outline-dark`.

```tsx
export type ButtonVariant = "primary" | "lume" | "ghost" | "outline-dark" | "link";

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[10px] px-7 py-3 font-medium tracking-tight transition-colors duration-300";
  const map: Record<ButtonVariant, string> = {
    primary: "bg-ink text-[#fafafa] hover:bg-[#2a2a2a]",
    lume: "bg-accent text-[#1a1206] hover:bg-accent-deep",
    ghost: "border border-line bg-transparent text-fg hover:border-line-strong",
    "outline-dark": "border border-white/20 bg-transparent text-[#fafafa] hover:border-white/40",
    link: "relative rounded-none px-0 py-0 text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100",
  };
  return cn(base, map[variant], className);
}
```
Note: add `--color-ink` mapping so `bg-ink`/`text-ink` exist (added in Task 1). Keep the `Button` component body unchanged (href/external/button branches).

- [ ] **Step 2: Verify** - `npm run typecheck`. Confirm `MagneticButton` (wraps `primary`) still compiles. Commit: `feat(button): ink primary + lume/outline-dark variants`.

---

## Task 4 - Primitives: Logo, Eyebrow, Tag, Cursor

**Files:** Modify `components/ui/Logo.tsx`, `components/ui/Eyebrow.tsx`, `components/ui/Tag.tsx`, `components/layout/Cursor.tsx`

- [ ] **Step 1: Logo** - capital `Lumako.`, Inter Tight Medium, ink + lume dot.

```tsx
export function Logo({ className }: Props) {
  return (
    <span className={cn(
      "font-display tracking-tight text-[length:var(--text-2xl)] font-medium text-fg select-none",
      className,
    )}>
      Lumako<span className="text-accent">.</span>
    </span>
  );
}
```
(Remove `lowercase`.)

- [ ] **Step 2: Eyebrow** - Inter Tight label, not mono.

```tsx
export function Eyebrow({ index, children, className }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-3 label-caps", className)}>
      {index ? <span className="text-fg-dim">({index})</span> : null}
      <span>{children}</span>
    </span>
  );
}
```

- [ ] **Step 3: Tag** - label-caps + lume active.

```tsx
const cls = cn(
  "rounded-full border px-4 py-1.5 label-caps transition-colors duration-300",
  active
    ? "border-accent bg-accent-soft !text-fg"
    : "border-line hover:border-line-strong hover:!text-fg",
  className,
);
```

- [ ] **Step 4: Cursor** - dark ring on light; lume active. In `Cursor.tsx`, change the inactive ring color from `rgba(250,250,250,0.4)` to `rgba(10,10,10,0.35)` (two places: the `border-fg/40` class is fine since `--color-fg` is now ink; update the inline `borderColor` fallback string `"rgba(250,250,250,0.4)"` → `"rgba(10,10,10,0.35)"`). Dot stays `bg-accent` (lume).

- [ ] **Step 5: Verify** - `npm run typecheck` + visual check of nav/logo/cursor. Commit: `feat(primitives): Lumako wordmark, label eyebrows, lume cursor`.

---

## Task 5 - Hero re-grade (`Hero.tsx`, `HeroCanvas.tsx`, `HeroFallback.tsx`)

**Files:** Modify all three. Read `node_modules/next/dist/docs` not required (no Next API change). Goal: light scene, ink+lume form, one lume glow, no bloom.

- [ ] **Step 1: `HeroCanvas.tsx`** - recompose for light.
  - Remove `EffectComposer` + `Bloom` import and usage (additive bloom is invisible on white).
  - `Starfield`: change `pointsMaterial` `color="#ffffff"` → `color="#0a0a0a"`, `opacity={0.18}`, and reduce `count` default to `~700` (subtle dark dust).
  - `WireframeForm`: recolor the three shells to ink→lume: outer `color="#0a0a0a" opacity={0.12}`, middle `color="#737373" opacity={0.35}`, inner `color="#d49a2e" opacity={0.95}` (the lume core).
  - Keep `CameraRig`, rotations, `<Canvas>` props (`alpha:true` lets the light page show through).

- [ ] **Step 2: `Hero.tsx`** - flip the legibility wash + CTA.
  - Replace the dark radial wash style with a light one:
    `background: "radial-gradient(120% 80% at 30% 40%, rgba(255,255,255,0), rgba(255,255,255,0.65) 80%)"` so the now-ink headline reads. Add a separate, single lume glow layer behind the canvas:
    `<div className="glow-accent pointer-events-none absolute inset-0" />` (lume-soft, subtle).
  - Secondary CTA: change `<Button variant="ghost">` → `<Button variant="lume">` and label it from `hero.ctaSecondary` (now "See the build"). Primary stays `MagneticButton` (ink).
  - Scroll cue: replace `font-mono ...` classes with `label-caps`; the falling bar `bg-accent` stays (lume).

- [ ] **Step 3: `HeroFallback.tsx`** - light.
  - Luminous core radial: `rgba(212,154,46,0.28) → rgba(212,154,46,0.05) → transparent` (lume).
  - Hairline grid lines: `rgba(255,255,255,0.6)` → `rgba(10,10,10,0.06)`; keep mask. Keep `noise-veil` (now multiply).

- [ ] **Step 4: Verify** - `npm run build`; load `/` on a high-tier device (canvas) and with reduced motion (fallback). Confirm headline/sub/CTAs are legible and only one lume glow shows. Commit: `feat(hero): re-grade WebGL hero to light + lume`.

---

## Task 6 - Footer = the one dark glow band (`components/layout/Footer.tsx`)

**Files:** Modify `components/layout/Footer.tsx`

- [ ] **Step 1: Wrap the footer in the dark band.** Change the `<footer>` to:
  `className="footer-glow relative overflow-hidden text-[#fafafa]"` (uses the `.footer-glow` helper from Task 1; it is `position:relative` already). Remove `border-t border-line bg-bg`.
- [ ] **Step 2: Invert the contents.**
  - Eyebrow + headline: white; muted text uses `text-white/60`.
  - Newsletter input: `text-[#fafafa] placeholder:text-white/40`, underline `border-white/20 focus-within:border-accent`; submit hover → `hover:text-accent`.
  - `FooterCol` titles → `.label-caps` but `text-white/50`; `footer-link` overrides to `text-white/60 hover:text-[#fafafa]` (add an inline class, since the global `.footer-link` is tuned for light).
  - Monumental wordmark: `Lumako` capitalized, gradient `from-white/85 to-white/5`, lume period `text-accent/60`.
  - Bottom meta row: `text-white/40`, border `border-white/10`. Keep "© {year} Lumako - Built in the light." and `{site.tagline}`.
- [ ] **Step 3: Verify** - `npm run build`; confirm the footer is the only dark glow on the page and all text meets contrast on the gradient. Commit: `feat(footer): dark lume-glow closing band`.

---

## Task 7 - CTA band stays light (`components/sections/home/CtaBand.tsx`)

**Files:** Modify `components/sections/home/CtaBand.tsx`

- [ ] **Step 1: Remove the radial glow** so the footer owns the one glow. Delete `<div className="glow-accent absolute inset-0" />` (or replace with nothing). Keep the section light with the ink `MagneticButton`. Headline/sub read from updated copy (Task 8).
- [ ] **Step 2: Verify** - visual: CTA band is flat light, ink button. Commit: `refactor(cta): light band, no second glow`.

---

## Task 8 - Content: `site.ts` + `copy.ts`

**Files:** Modify `lib/content/site.ts`, `lib/content/copy.ts`. Voice = brandbook §06 (show don't sell, plain verbs, receipts).

- [ ] **Step 1: Replace `site.ts` exactly:**

```ts
export const site = {
  name: "Lumako",
  tagline: "Web · AI · Apps - shipped, not proposed",
  email: "hello@lumako.com",
  locale: "Nalchik, KBR → Global",
  timezone: "Europe/Moscow",
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X", href: "https://x.com" },
    { label: "WhatsApp", href: "https://wa.me/" },
    { label: "Telegram", href: "https://t.me/" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
```

- [ ] **Step 2: Replace `copy.ts`** with the brand-voice rewrite. Keep `as const`, keep the `highlight` pattern. **Note the shape changes:** `home.stats` → `home.proof` (array of `{ value: string; label: string }`); `home.testimonial` → `home.receipts` (`{ eyebrow; headline; highlight?; items: string[] }`). Full content:

```ts
export const copy = {
  home: {
    hero: {
      eyebrow: "Web · AI · Apps",
      headline: "Built first. Pitched second.",
      highlight: "Pitched second.",
      sub: "Lumako is a single full-stack practice that ships web, AI, and app products and hands them over working. One operator, one engine - judged by what reaches market, not by the pitch.",
      ctaPrimary: { label: "Start a project", href: "/contact" },
      ctaSecondary: { label: "See the build", href: "/work" },
    },
    manifesto: {
      eyebrow: "The stance",
      headline:
        "The demo is the pitch. Most studios sell a proposal and a promise - Lumako shows a working product first, then names the price. Proof carries the sale.",
      highlight: "The demo is the pitch.",
    },
    services: {
      eyebrow: "What I build",
      headline: "Web, AI, and apps - from one operator on one engine.",
      highlight: "one engine.",
      link: { label: "All services", href: "/services" },
    },
    work: {
      eyebrow: "Selected work",
      headline: "Shipped, not proposed.",
      link: { label: "View all work", href: "/work" },
    },
    process: {
      eyebrow: "How it works",
      headline: "The builder is in the room.",
      sub: "No agency handoff between you and the person writing the code. You talk to the operator who ships it - start to finish.",
      link: { label: "The process", href: "/services" },
    },
    proof: [
      { value: "1.5+ yrs", label: "in production" },
      { value: "Gov + university", label: "delivered builds" },
      { value: "AI competition", label: "won · university" },
      { value: "Web · AI · Apps", label: "one engine" },
    ],
    receipts: {
      eyebrow: "Receipts",
      headline: "The portfolio is the credential.",
      highlight: "the credential.",
      items: [
        "Shipped builds for government bodies and universities.",
        "Won a university AI competition.",
        "1.5+ years live in production.",
        "Live products you can click - not slides.",
      ],
    },
    cta: {
      eyebrow: "Start here",
      headline: "Tell me what you're building.",
      highlight: "building.",
      sub: "Send the problem and what done looks like. You'll get a working direction back - proof before pitch, the outcome before the invoice.",
      button: { label: "Start a project", href: "/contact" },
    },
  },

  work: {
    eyebrow: "Work",
    headline: "Shipped products, doing a job.",
    highlight: "doing a job.",
    sub: "A selection of builds across web, AI, and apps - for businesses that wanted the outcome, not a brochure.",
  },

  services: {
    eyebrow: "Services",
    headline: "Web, AI, and apps - one operator, end to end.",
    highlight: "end to end.",
    sub: "Engage Lumako for the part you need, or the whole build. One person across the stack - no handoff, no telephone game.",
    processEyebrow: "How it works",
    processHeadline: "Demo-first, then pitch.",
    engagementsEyebrow: "Engagements",
    engagementsHeadline: "Ways to work together.",
  },

  studio: {
    eyebrow: "Studio",
    headline: "One operator. The whole stack.",
    highlight: "The whole stack.",
    valuesEyebrow: "What holds",
    teamEyebrow: "Who",
    teamHeadline: "Solo, on purpose.",
    recognitionEyebrow: "Proof",
    clientsEyebrow: "Shipped for",
  },

  contact: {
    eyebrow: "Start a project",
    headline: "Tell me what you're building.",
    highlight: "building.",
    sub: "The more you share, the sharper the first response. Every serious inquiry gets a reply - proof before pitch.",
    budgets: ["< $5k", "$5k-$15k", "$15k-$40k", "$40k+", "Not sure yet"],
    serviceOptions: ["Web", "AI", "Apps", "Brand", "Motion"],
    success: {
      title: "Got it.",
      body: "Message received. Expect a working, specific reply - not a templated pitch.",
    },
  },

  meta: {
    home: {
      title: "Lumako - Web · AI · Apps",
      description:
        "Lumako is a solo full-stack studio that ships web, AI, and app products - and shows the working build before the pitch.",
    },
    work: {
      title: "Work",
      description:
        "Shipped web, AI, and app builds from Lumako - products live in market, doing a job.",
    },
    services: {
      title: "Services",
      description:
        "Web, AI, and apps from one operator, end to end. Demo-first, then pitch.",
    },
    studio: {
      title: "Studio",
      description:
        "Lumako is one full-stack operator shipping web, AI, and apps - proof over promise.",
    },
    contact: {
      title: "Contact",
      description:
        "Start a project with Lumako. Tell me what you're building and you'll get a working direction back.",
    },
  },
} as const;
```

- [ ] **Step 3: Verify** - `npm run typecheck` will now FAIL in `Stats.tsx` and `Testimonial.tsx` (they reference `copy.home.stats`/`.testimonial`). That is expected - Task 9 fixes them. Commit after Task 9. (Do not commit a broken typecheck alone; bundle with Task 9.)

---

## Task 9 - Section reshapes: Stats → proof, Testimonial → receipts

**Files:** Modify `components/sections/home/Stats.tsx`, `components/sections/home/Testimonial.tsx`

- [ ] **Step 1: `Stats.tsx`** - render proof cells (no Counter; values are phrases).

```tsx
import { copy } from "@/lib/content/copy";

export function Stats() {
  return (
    <section className="section border-t border-line">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line md:grid-cols-4">
          {copy.home.proof.map((s) => (
            <div key={s.label} className="bg-bg p-10">
              <div className="font-display text-[length:var(--text-4xl)] font-medium leading-tight tracking-tight text-fg">
                {s.value}
              </div>
              <p className="mt-3 label-caps">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `Testimonial.tsx`** - receipts strip.

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";

export function Testimonial() {
  const r = copy.home.receipts;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <Eyebrow index="05">{r.eyebrow}</Eyebrow>
        <TextReveal
          as="h2"
          text={r.headline}
          highlight={r.highlight}
          className="mt-8 block max-w-[20ch] font-display text-[length:var(--text-5xl)] font-medium leading-[1.05] tracking-tight text-balance"
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2">
          {r.items.map((item, i) => (
            <Reveal key={item} index={i}>
              <li className="flex h-full items-start gap-4 bg-bg p-8">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-[length:var(--text-lg)] text-fg text-pretty">{item}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
```
(The `Testimonial` component/file name is kept; only its content changes.)

- [ ] **Step 3: Verify** - `npm run typecheck` passes again; `npm run build`; `npm run test`. Commit: `feat(content): brand-voice copy + proof/receipts sections`.

---

## Task 10 - Content: services, studio, work

**Files:** Modify `lib/content/types.ts`, `lib/content/services.ts`, `lib/content/studio.ts`, `lib/content/work.ts`

These are illustrative placeholders reframed to the brand's real sectors; do not fabricate named-client specifics beyond the brandbook (gov & university builds, won university AI competition, KSA/UAE clinics·dental·medspa·salons, Dubai real-estate teams). Keep all `types.ts` interfaces intact except the `Discipline` union.

- [ ] **Step 1: `types.ts`** - redefine the union (keep size/shape so nothing else breaks):

```ts
export type Discipline = "Web" | "AI" | "Apps" | "Brand" | "Strategy" | "Motion";
```

- [ ] **Step 2: `services.ts`** - reframe the 6 services around web · AI · apps. Keep the `Service`/`ProcessPhase`/`Engagement` shapes and the `getService` export. New `services` (titles + blurbs + deliverables), brand voice:
  - `web` → "Web - sites & platforms" (marketing sites, booking systems, dashboards, headless CMS, performance).
  - `ai` → "AI - assistants & automation" (WhatsApp/Telegram booking assistants, LLM features, retrieval, internal tools). *(id `ai`, index `02`)*
  - `apps` → "Apps - product builds" (web apps, mobile-web, internal apps, end-to-end product).
  - `brand` → keep, trimmed to fit a solo operator.
  - `strategy` → "Positioning & proof" (find the sharpest version; lead with the demo).
  - `motion` → "Motion & cinematic AI" (Three.js hero work, Higgsfield brand frames).
  Rewrite `processPhases` to the demo-first method (e.g. Scope → Build → Demo → Price → Ship → Support) and `engagements` to solo-operator-appropriate (Project / Retainer / Embedded is fine, reworded to "one operator").

- [ ] **Step 3: `studio.ts`** - replace fabricated team/awards/clients with honest, brandbook-grounded content:
  - `studioManifesto`: solo full-stack operator out of Nalchik shipping web/AI/apps; the portfolio is the credential; show, don't sell.
  - `values`: the brandbook pillars - `Proof.` / `Range.` / `Outcome.` (+ optionally `Solo, stated plainly.`). Bodies from brandbook §01 pillars.
  - `team`: a single entry - `[{ name: "Solo founder", role: "Full-stack - web · AI · apps", accent: "#d49a2e" }]` (founder swaps in their name).
  - `recognition`: `[{ award: "Won - University AI Competition", org: "University", year: "2025" }, { award: "Government & university builds", org: "Delivered", year: "-" }, { award: "1.5+ years in production", org: "Live", year: "-" }]`.
  - `clients`: replace fake brand names with sectors/types - `["Government bodies","Universities","Clinics & dental","Medspa & salons","Real-estate teams","Founders & operators"]`.
  - Recolor any `accent` hex in this file away from blue/teal/purple to lume/neutral (`#d49a2e`, `#737373`, `#0a0a0a`).

- [ ] **Step 4: `work.ts`** - rewrite the 6 case studies as illustrative builds in the brand's sectors (keep `CaseStudy` shape, `getCase`/`getNextCase`/`featuredWork` exports, and the `disciplines` array typed to the new union). Reframe to e.g.: a clinic WhatsApp booking system (Web + AI), a dental/medspa site + reminders (Web + AI), a Dubai real-estate listing platform (Web + Apps), a university AI competition project (AI), a salon booking app (Apps), a government body web build (Web + Brand). Recolor every `accent`/gallery `accent` hex to lume/neutral tones (`#d49a2e`, `#9c6e1b`, `#171717`, `#737373`, `#0a0a0a` - no blue/teal/purple). Keep `results` numeric (the `WorkResult` shape + `CaseResults` Counter still work). Voice = receipts, plain verbs, no "award-winning". Update `disciplines` export list at the bottom to the new union values.

- [ ] **Step 5: Verify** - `npm run typecheck` (the `Discipline` union change surfaces any stragglers), `npm run lint`, `npm run build`. Commit: `feat(content): services/studio/work reframed to web·AI·apps + real proof`.

---

## Task 11 - Dark-assumption sweep (remaining sections)

**Files:** the three groups in the File map. For each file: read it, then fix anything that assumed dark bg / blue accent / monospace chrome:
- Hardcoded `rgba(255,255,255,…)` lines/glows → `rgba(10,10,10,…)` or the `--color-line` token.
- Any literal blue/teal/purple/`#3080ff`/spark hexes → lume or neutral tokens.
- `font-mono` used as *label chrome* (eyebrows, meta, captions) → `.label-caps`. Genuine code/number displays may keep `font-mono`.
- `rounded-2xl`/`rounded-3xl`/`rounded-xl` on cards → `rounded-[10px]`.
- Backdrop blurs over now-light surfaces (`bg-bg/70`, mobile menu `bg-bg/95`) - confirm contrast; keep but verify.
- `Nav.tsx`: mobile-menu links use `font-display font-light` → fine (Inter Tight); ensure active underline `bg-accent` (lume) reads.
- `PageTransition.tsx`/`RouteCurtain`: if it paints a dark curtain, switch to a light or ink curtain consistent with the brand (read first; keep motion, swap color).

- [ ] **Step 1:** Group A (home sections) - fix + visual check `/`.
- [ ] **Step 2:** Group B (work sections) - fix + visual check `/work` and `/work/[slug]`.
- [ ] **Step 3:** Group C (services/studio/contact + shared) - fix + visual check `/services`, `/studio`, `/contact`.
- [ ] **Step 4:** `grep` the repo for leftover `spark`, `#3080ff`, `#1447e6`, `rgba(48,128,255`, `font-fraunces`, `font-hanken`, `Fraunces`, `Hanken` - expect zero. Commit per group: `fix(sweep): light+lume <group> sections`.

---

## Task 12 - Final verification

- [ ] **Step 1:** `npm run lint` - zero errors.
- [ ] **Step 2:** `npm run typecheck` - zero errors.
- [ ] **Step 3:** `npm run test` - existing suite green (check `tests/utils.test.ts`).
- [ ] **Step 4:** `npm run build` - succeeds.
- [ ] **Step 5:** `npm run dev` and visually confirm every route: `/`, `/work`, `/work/aether` (or renamed slug), `/services`, `/studio`, `/contact`. Checklist: light bg everywhere; lume is the only accent; ink primary buttons + exactly one lume button on the hero; footer is the only dark glow; `Lumako.` wordmark; Inter Tight throughout; focus rings lume; no dark-mode remnants; copy reads in the brand voice.
- [ ] **Step 6:** Final commit / ready for review.

---

## Self-review notes (done)
- **Spec coverage:** every spec §1-11 maps to a task (tokens=T1, fonts=T2, buttons=T3, logo/eyebrow/tag/cursor=T4, hero=T5, footer=T6, CTA=T7, content=T8/T10, reshapes=T9, sweep=T11, verify=T12). ✓
- **Shape consistency:** `copy.home.proof` / `copy.home.receipts` are defined in T8 and consumed in T9 with matching keys; `Discipline` union defined in T10.S1 before use in services/work. ✓
- **Known intentional red:** T8 leaves typecheck failing until T9 - explicitly bundled. ✓
