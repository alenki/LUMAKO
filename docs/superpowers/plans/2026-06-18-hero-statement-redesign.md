# Hero "Yours won't" Statement Redesign - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Canvas-2D "blueprint" hero with a giant uppercase typographic statement - *"Most work gets / scrolled past. / Yours won't."* - where the word *won't* is encircled by a single self-drawing gold marker.

**Architecture:** A rewritten client `Hero` section renders the headline line-by-line with Framer Motion mask-rise reveals; when the last line lands it flips a `revealed` state that (a) releases the line masks so the marker can overflow and (b) triggers a `HeroMarker` SVG whose path draws in via Framer Motion `pathLength`. A pure `splitOnWord` helper wraps the marked word. The old `HeroBlueprint` canvas stack and its four tests are deleted.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Motion v12 (`motion/react`), Tailwind CSS v4, Vitest + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-06-18-hero-statement-redesign-design.md`

---

## File Structure

- `lib/markWord.ts` (new) - pure `splitOnWord(line, word)` helper. One responsibility: segment a line around a word.
- `components/hero/HeroMarker.tsx` (new) - the word + its self-drawing gold circle (decorative SVG). Owns the draw/reduced-motion logic.
- `components/sections/home/Hero.tsx` (rewrite) - the hero section: background atmosphere, the line-revealed headline, the lower band (descriptor + CTAs + scroll cue). No nav, no canvas.
- `lib/content/copy.ts` (modify) - restructure `home.hero` to `{ lines, mark, sub, ctaPrimary, ctaSecondary }`.
- `README.md` (modify) - tech/structure bullets that named the blueprint hero.
- Deletions: `components/hero/HeroBlueprint.tsx`, `components/hero/blueprint/{geometry,phases,render}.ts`, and tests `tests/{hero-blueprint.test.tsx,hero-phases.test.ts,hero-geometry.test.ts,hero-render.test.ts}`.
- New tests: `tests/markWord.test.ts`, `tests/hero-marker.test.tsx`, `tests/hero-content.test.ts`, `tests/hero.test.tsx`.

**Commands:** single file → `npx vitest run <path>`; full suite → `npm test`; also `npm run lint`, `npm run typecheck`, `npm run build`.

---

## Task 1: `splitOnWord` pure helper

**Files:**
- Create: `lib/markWord.ts`
- Test: `tests/markWord.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/markWord.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { splitOnWord } from "@/lib/markWord";

describe("splitOnWord", () => {
  it("splits a line into before / word / after around the first match", () => {
    expect(splitOnWord("Yours won't.", "won't")).toEqual({
      before: "Yours ",
      word: "won't",
      after: ".",
    });
  });

  it("returns null when the word is absent", () => {
    expect(splitOnWord("Yours win.", "won't")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/markWord.test.ts`
Expected: FAIL - cannot resolve `@/lib/markWord` (module does not exist).

- [ ] **Step 3: Write the minimal implementation**

Create `lib/markWord.ts`:

```ts
/**
 * Split a line around the first occurrence of `word`, so the caller can wrap
 * that word in a marker. Returns null when the word is not present (caller then
 * renders the plain line).
 */
export function splitOnWord(
  line: string,
  word: string,
): { before: string; word: string; after: string } | null {
  const idx = line.indexOf(word);
  if (idx === -1) return null;
  return {
    before: line.slice(0, idx),
    word,
    after: line.slice(idx + word.length),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/markWord.test.ts`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add lib/markWord.ts tests/markWord.test.ts
git commit -m "feat(hero): splitOnWord helper for marking a word in a line"
```

---

## Task 2: `HeroMarker` component (word + self-drawing gold circle)

**Files:**
- Create: `components/hero/HeroMarker.tsx`
- Test: `tests/hero-marker.test.tsx`

The marker draws via Framer Motion `pathLength` (JS-driven, measures the real path length - reliable where SMIL failed during prototyping, and integrates with the hero's Motion timeline). One clean gold stroke: no second/faint pass, no traveling dot.

- [ ] **Step 1: Write the failing test**

Create `tests/hero-marker.test.tsx`:

```tsx
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { HeroMarker } from "@/components/hero/HeroMarker";

// jsdom lacks matchMedia, which motion may probe.
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }
});

describe("HeroMarker", () => {
  it("renders the word and a decorative, non-interactive circle", () => {
    const { container } = render(<HeroMarker word="won't" draw={false} reduce={false} />);
    expect(container.textContent).toContain("won't");
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.style.pointerEvents).toBe("none");
    expect(svg?.querySelector("path")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/hero-marker.test.tsx`
Expected: FAIL - cannot resolve `@/components/hero/HeroMarker`.

- [ ] **Step 3: Write the implementation**

Create `components/hero/HeroMarker.tsx`:

```tsx
"use client";

import { motion } from "motion/react";

/** Rough, slightly overshooting hand-drawn loop, in a 370x170 viewBox sized to the word. */
const RING_D =
  "M 30,98 C 26,44 120,20 205,24 C 296,28 350,58 340,96 C 330,134 244,154 158,151 C 74,148 18,120 30,78 C 38,46 96,32 168,30";

type HeroMarkerProps = {
  /** The word to encircle (rendered as the visible text). */
  word: string;
  /** Start the draw. Ignored when `reduce` is true (then it renders pre-drawn). */
  draw: boolean;
  /** Reduced-motion: render the circle fully drawn, no animation. */
  reduce: boolean;
};

/**
 * A word wrapped by a single self-drawing gold marker circle - the hero's one
 * lume accent. The SVG is decorative (aria-hidden) and overflows the word box,
 * so the consuming line must not clip it once the circle draws.
 */
export function HeroMarker({ word, draw, reduce }: HeroMarkerProps) {
  const drawn = reduce || draw;
  return (
    <span className="relative inline-block whitespace-nowrap">
      {word}
      <svg
        aria-hidden="true"
        viewBox="0 0 370 170"
        className="absolute"
        style={{
          left: "-9%",
          top: "-26%",
          width: "118%",
          height: "158%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <motion.path
          d={RING_D}
          fill="none"
          stroke="var(--color-lume)"
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.45, ease: [0.5, 0, 0.3, 1] }}
        />
      </svg>
    </span>
  );
}
```

Notes for the implementer:
- `initial={false}` makes the path mount at its current `animate` value (no enter animation): `pathLength 0` when `draw` is false, so nothing shows until `draw` flips to true. Framer Motion handles the `strokeDasharray`/`strokeDashoffset` math from the measured length - do **not** set those by hand.
- When `reduce` is true the path mounts at `pathLength 1` (fully drawn) with a zero-duration transition.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/hero-marker.test.tsx`
Expected: PASS (1 passed).

- [ ] **Step 5: Commit**

```bash
git add components/hero/HeroMarker.tsx tests/hero-marker.test.tsx
git commit -m "feat(hero): HeroMarker - word with a self-drawing gold circle"
```

---

## Task 3: New hero copy + rewritten `Hero` section

This task is coupled: changing the `home.hero` shape breaks the old `Hero.tsx` at typecheck, so the copy change and the rewrite land together. `HeroMarker` and `splitOnWord` from Tasks 1-2 already exist.

**Files:**
- Modify: `lib/content/copy.ts` (the `home.hero` object, currently lines 4-11)
- Rewrite: `components/sections/home/Hero.tsx`
- Test: `tests/hero-content.test.ts` (new), `tests/hero.test.tsx` (new)

- [ ] **Step 1: Write the failing content test**

Create `tests/hero-content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { copy } from "@/lib/content/copy";

describe("home hero copy", () => {
  const { hero } = copy.home;

  it("has three non-empty statement lines", () => {
    expect(hero.lines).toHaveLength(3);
    hero.lines.forEach((line) => expect(line.length).toBeGreaterThan(0));
  });

  it("marks a word that appears in the last line", () => {
    expect(hero.mark.length).toBeGreaterThan(0);
    expect(hero.lines[hero.lines.length - 1]).toContain(hero.mark);
  });

  it("has a descriptor and two CTAs pointing at contact and work", () => {
    expect(hero.sub.length).toBeGreaterThan(0);
    expect(hero.ctaPrimary.href).toBe("/contact");
    expect(hero.ctaSecondary.href).toBe("/work");
  });
});
```

- [ ] **Step 2: Write the failing render test**

Create `tests/hero.test.tsx`:

```tsx
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { Hero } from "@/components/sections/home/Hero";

// jsdom lacks matchMedia (motion's useReducedMotion needs it).
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }
});

describe("Hero", () => {
  it("renders the full statement, the marked word, and both CTAs", () => {
    const { container, getByRole } = render(<Hero />);

    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("Most work gets");
    expect(h1?.textContent).toContain("scrolled past.");
    expect(h1?.textContent).toContain("won't");

    const start = getByRole("link", { name: /start a project/i });
    expect(start.getAttribute("href")).toBe("/contact");
    const work = getByRole("link", { name: /see the work/i });
    expect(work.getAttribute("href")).toBe("/work");

    // marker is decorative
    const svg = container.querySelector("h1 svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render its own navigation (the layout owns the navbar)", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("nav")).toBeNull();
  });
});
```

- [ ] **Step 3: Run both tests to verify they fail**

Run: `npx vitest run tests/hero-content.test.ts tests/hero.test.tsx`
Expected: FAIL - `hero.lines`/`hero.mark` are undefined (content test) and the headline text / CTA hrefs don't match yet (render test).

- [ ] **Step 4: Update the hero copy**

In `lib/content/copy.ts`, replace the `home.hero` object (currently lines 4-11) with:

```ts
    hero: {
      lines: ["Most work gets", "scrolled past.", "Yours won't."],
      mark: "won't",
      sub: "Lumako is a solo full-stack studio - web, AI, and apps that ship and stay live. Built to be remembered, not scrolled past.",
      ctaPrimary: { label: "Start a project", href: "/contact" },
      ctaSecondary: { label: "See the work", href: "/work" },
    },
```

(Removes `eyebrow`, `headline`, and `highlight`. Use a straight ASCII apostrophe in `won't` so `mark` matches the line exactly. Keep the house ` - ` hyphen, never an em-dash.)

- [ ] **Step 5: Rewrite the Hero section**

Replace the entire contents of `components/sections/home/Hero.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { HeroMarker } from "@/components/hero/HeroMarker";
import { splitOnWord } from "@/lib/markWord";
import { copy } from "@/lib/content/copy";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Hero() {
  const { hero } = copy.home;
  const reduce = useReducedMotion() ?? false;
  // When the last line finishes rising we release the line masks (so the circle
  // can overflow) and trigger the marker draw. Pre-revealed under reduced motion.
  const [revealed, setRevealed] = useState(reduce);

  const lines = hero.lines;
  const lastIdx = lines.length - 1;
  const marked = splitOnWord(lines[lastIdx], hero.mark);

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden pt-[var(--header-h)]">
      {/* atmosphere only - the gold circle is the single accent */}
      <div className="glow-accent pointer-events-none absolute inset-0" />
      <div className="noise-veil" />

      <div className="container-x relative z-10 flex flex-1 flex-col">
        {/* headline fills the available height */}
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-[-0.05em] text-[length:clamp(46px,10.8vw,210px)]">
            {lines.map((line, i) => (
              <span
                key={i}
                className={cn(
                  "block pb-[0.04em]",
                  revealed ? "overflow-visible" : "overflow-hidden",
                )}
              >
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "112%" }}
                  animate={{ y: 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 1, ease: easeOutExpo, delay: 0.3 + i * 0.12 }
                  }
                  onAnimationComplete={
                    !reduce && i === lastIdx ? () => setRevealed(true) : undefined
                  }
                >
                  {i === lastIdx && marked ? (
                    <>
                      {marked.before}
                      <HeroMarker word={marked.word} draw={revealed} reduce={reduce} />
                      {marked.after}
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* lower band: descriptor + CTAs (left), scroll cue (right) */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pb-[clamp(22px,3vw,42px)]">
          <motion.div
            className="max-w-[46ch]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOutExpo, delay: 1.1 }}
          >
            <p className="text-[length:var(--text-xl)] text-fg-muted text-pretty">{hero.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={hero.ctaPrimary.href} variant="primary">
                {hero.ctaPrimary.label}
              </Button>
              <Button href={hero.ctaSecondary.href} variant="ghost">
                {hero.ctaSecondary.label} &rarr;
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOutExpo, delay: 1.4 }}
          >
            <span className="label-caps flex items-center gap-3">
              Scroll
              <span className="relative h-9 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-fg" />
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

Notes for the implementer:
- No `<nav>` here - the navbar comes from the layout (`components/layout/Nav.tsx`).
- The CTAs are `variant="primary"` (ink) and `variant="ghost"` (bordered) - intentionally **no** lume button, so the gold circle stays the only accent.
- The `scrollcue` keyframe already exists in `styles/globals.css`.

- [ ] **Step 6: Run the new tests to verify they pass**

Run: `npx vitest run tests/hero-content.test.ts tests/hero.test.tsx`
Expected: PASS (content: 3 passed; hero: 2 passed).

- [ ] **Step 7: Typecheck (the copy shape change must not break other consumers)**

Run: `npm run typecheck`
Expected: no errors. If an error points at a removed `home.hero` field, the only app consumer is this file - confirm with `git grep -nE "hero\.(headline|eyebrow|highlight)"` (should return nothing under `app/`, `components/`, `lib/`).

- [ ] **Step 8: Commit**

```bash
git add lib/content/copy.ts components/sections/home/Hero.tsx tests/hero-content.test.ts tests/hero.test.tsx
git commit -m "feat(hero): rebuild hero as the 'Yours won't' statement"
```

---

## Task 4: Delete the blueprint stack, its tests, and update the README

Now that `Hero.tsx` no longer imports `HeroBlueprint`, the entire blueprint stack is dead.

**Files:**
- Delete: `components/hero/HeroBlueprint.tsx`
- Delete: `components/hero/blueprint/geometry.ts`, `components/hero/blueprint/phases.ts`, `components/hero/blueprint/render.ts`
- Delete: `tests/hero-blueprint.test.tsx`, `tests/hero-phases.test.ts`, `tests/hero-geometry.test.ts`, `tests/hero-render.test.ts`
- Modify: `README.md` (lines 16 and 56)

- [ ] **Step 1: Confirm there are no remaining importers**

Run: `git grep -nE "HeroBlueprint|hero/blueprint"`
Expected: matches only in the files about to be deleted (`HeroBlueprint.tsx`, `blueprint/render.ts`, the four test files) and in `docs/` (historical specs/plans - leave those). If anything under `app/`, `components/`, or `lib/` still imports them, stop and resolve first.

- [ ] **Step 2: Delete the component, the blueprint folder, and the four tests**

```bash
git rm components/hero/HeroBlueprint.tsx \
       components/hero/blueprint/geometry.ts \
       components/hero/blueprint/phases.ts \
       components/hero/blueprint/render.ts \
       tests/hero-blueprint.test.tsx \
       tests/hero-phases.test.ts \
       tests/hero-geometry.test.ts \
       tests/hero-render.test.ts
```

(If `components/hero/blueprint/` is now empty, `git rm` already removed its files; remove the empty dir if your OS left it behind.)

- [ ] **Step 3: Update the README**

In `README.md`, replace line 16:

```
- **Canvas 2D** - the "drafted, then built" blueprint hero (no WebGL deps)
```

with:

```
- **SVG + Motion** - the self-drawing gold marker in the home hero
```

And replace line 56:

```
  hero/       # HeroBlueprint (Canvas 2D) + blueprint/ (geometry, phases, render)
```

with:

```
  hero/       # HeroMarker - the self-drawing gold marker circle (SVG)
```

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: PASS, with no test files referencing the deleted modules. Remaining hero-related tests: `tests/markWord.test.ts`, `tests/hero-marker.test.tsx`, `tests/hero-content.test.ts`, `tests/hero.test.tsx`.

- [ ] **Step 5: Lint, typecheck, and build clean**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: all succeed; no unused-import or unresolved-module errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(hero): delete dead blueprint canvas stack + its tests"
```

---

## Final Verification (manual)

After Task 4, run the app and confirm the spec's behavior:

- [ ] `npm run dev`, open the homepage. Watch the entry: headline rises line-by-line, then a **single gold circle draws itself** around *won't* - **uncropped** top and bottom, **no dot**, **no faint second ring**.
- [ ] Resize to ~1280, ~1440, and >=1920 widths: the headline scales up and the longest line ("MOST WORK GETS") never overflows or clips. Check a narrow mobile width too (nav still from layout, scroll cue may wrap).
- [ ] The gold circle is the **only** lume on screen (CTAs are ink + ghost; the logo dot in the nav is the only other gold).
- [ ] Enable OS "reduce motion" and reload: headline is static and the circle is **pre-drawn** (no rise, no draw).
- [ ] Tab through: the CTAs show the lume-deep focus ring; "Skip to content" still works.

---

## Self-Review Notes (author)

- **Spec coverage:** statement + marker (Tasks 2-3), copy restructure (Task 3), single-accent CTAs (Task 3), line-reveal + mask-release + draw choreography (Task 3 Hero), reduced motion (Tasks 2-3), blueprint + test removal + README (Task 4), verification (final section). The spec's "CSS stroke-dashoffset" draw is realized with Framer Motion `pathLength` (JS-driven, measured length, not SMIL) - same intent, better timeline integration and no length-guessing; called out in Task 2.
- **Type consistency:** `splitOnWord` returns `{ before, word, after } | null` and is consumed exactly that way in `Hero`. `HeroMarker` props `{ word, draw, reduce }` match the call site. `home.hero` exposes `lines`, `mark`, `sub`, `ctaPrimary`, `ctaSecondary`, all consumed in `Hero`.
- **No placeholders:** every code/edit step shows complete content and exact commands.
