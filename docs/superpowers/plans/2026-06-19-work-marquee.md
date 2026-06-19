# Work Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static, staggered work grid on the home page with a continuously auto-sliding, full-bleed marquee of all five projects, each shown as a sparse cover card (image + name + category tags).

**Architecture:** A new client `WorkMarquee` renders the project list twice (real set + an `inert`/`aria-hidden` clone) inside two `.marquee-track` rails that animate `translateX(0 -> -100%)` in lockstep, reusing the marquee keyframes + hover-pause already in `styles/globals.css`. A new sparse `WorkSlide` card is the unit shown in the rail; the existing rich `WorkCard` is left untouched for the `/work` page. The server `SelectedWork` section keeps its header and mounts the marquee full-bleed below it.

**Tech Stack:** Next 16 (React 19), Tailwind v4 (utility classes + `styles/globals.css`), `motion` (not needed here - animation is pure CSS), Vitest + @testing-library/react (jsdom).

---

## House rules (apply to every file)

- No em-dashes anywhere (code, comments, copy). Write " - " (space hyphen space). A repo script rewrites em-dashes; do not introduce them.
- Match surrounding style: double quotes, `cn`/Tailwind utilities, `@/` import alias.
- Commit messages end with the trailer:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

## File structure

- Create `components/sections/work/WorkSlide.tsx` - sparse cover card (cover + name + discipline chips), links out to the live site. Presentational, no hooks.
- Create `components/sections/home/WorkMarquee.tsx` - `"use client"` rail: real set + inert clone, two `.marquee-track`s, full-bleed.
- Create `tests/work-marquee.test.tsx` - covers `WorkSlide`, `WorkMarquee`, and the `SelectedWork` wiring. Mocks `next/image`.
- Modify `styles/globals.css` - add keyboard focus-within pause + the `.work-marquee` full-bleed/reduced-motion rules.
- Modify `components/sections/home/SelectedWork.tsx` - drop the grid, mount `<WorkMarquee items={work} />`, switch import from `featuredWork` to `work`.

Reference facts (already verified in the codebase):
- `work` is exported from `lib/content/work.ts` and has 5 items (Balance Coffee, Master Auto, Melty, History, Omar Karaf). `CaseStudy` type is in `lib/content/types.ts`.
- `CoverPanel` (`components/ui/CoverPanel.tsx`) takes `{ src, alt, tint, position, ratio, priority }`.
- `globals.css` already defines `@keyframes marquee` (`translateX(0) -> translateX(-100%)`), `.marquee-track` (linear/infinite, no duration set - duration MUST be supplied inline), and `.group:hover .marquee-track { animation-play-state: paused; }`. There is a global `prefers-reduced-motion` block that force-shrinks all animation durations.
- Utility classes available: `surface-card`, `surface-card--hover`, `label-caps`, `container-x`, `grid-12`, `section-lg`, `font-display`. Color tokens: `border-line`, `border-line-strong`, `text-fg`, `bg-bg`.

---

## Task 1: WorkSlide card (sparse cover + name + tags)

**Files:**
- Create: `components/sections/work/WorkSlide.tsx`
- Test: `tests/work-marquee.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/work-marquee.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

// next/image needs the Next build runtime; stub it so these stay unit-level.
vi.mock("next/image", () => ({
  default: ({ src, alt = "" }: { src: string; alt?: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const ITEM: CaseStudy = {
  slug: "balance-coffee",
  title: "Balance Coffee",
  client: "Specialty coffee & roaster",
  sector: "Concept site",
  year: "2025",
  disciplines: ["Web", "Brand"],
  accent: "#a1957e",
  cover: "/work/balance-coffee.webp",
  coverPosition: "center",
  href: "https://balancecoffee.netlify.app/",
  featured: true,
  summary: "A warm, editorial site.",
};

describe("WorkSlide", () => {
  it("links out to the live site in a new tab, with the view cursor", () => {
    const { container } = render(<WorkSlide item={ITEM} />);
    const a = container.querySelector("a")!;
    expect(a.getAttribute("href")).toBe(ITEM.href);
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
    expect(a.getAttribute("data-cursor")).toBe("view");
    expect(a.getAttribute("aria-label")).toContain("opens the live site");
  });

  it("shows the project name and a chip per discipline (no client/sector or year)", () => {
    const { container } = render(<WorkSlide item={ITEM} />);
    expect(container.querySelector("h3")?.textContent).toBe("Balance Coffee");
    const chips = [...container.querySelectorAll("span")].map((s) => s.textContent);
    expect(chips).toContain("Web");
    expect(chips).toContain("Brand");
    // sparse: the rich card's metadata must not appear
    expect(container.textContent).not.toContain("Concept site");
    expect(container.textContent).not.toContain("2025");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/work-marquee.test.tsx`
Expected: FAIL - cannot resolve `@/components/sections/work/WorkSlide` (module does not exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `components/sections/work/WorkSlide.tsx`:

```tsx
import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";

/** Uniform card shape - the Balance cover's ratio. Wider covers center-crop to fit. */
const CARD_RATIO = 1916 / 1263;

/**
 * Sparse work card for the home marquee: cover image, then the project name with
 * small discipline chips. Links out to the live site. The richer WorkCard stays
 * the unit for the /work grid.
 */
export function WorkSlide({ item }: { item: CaseStudy }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      aria-label={`${item.title} - ${item.client} (opens the live site in a new tab)`}
      className="group/slide block"
    >
      <div className="surface-card surface-card--hover relative overflow-hidden">
        <CoverPanel
          src={item.cover}
          alt={`${item.title} - ${item.sector}`}
          tint={item.accent}
          position={item.coverPosition}
          ratio={CARD_RATIO}
        />
        <span className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-line-strong bg-bg/40 text-fg opacity-0 backdrop-blur-md transition-all duration-500 group-hover/slide:opacity-100">
          ↗
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="font-display text-[length:var(--text-2xl)] font-light leading-tight tracking-tight text-fg">
          {item.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {item.disciplines.map((d) => (
            <span
              key={d}
              className="rounded-full border border-line px-3 py-1 label-caps"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/work-marquee.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/work/WorkSlide.tsx tests/work-marquee.test.tsx
git commit -m "feat(work): sparse WorkSlide card for the home marquee

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: WorkMarquee rail (real set + inert clone, auto-scroll)

**Files:**
- Create: `components/sections/home/WorkMarquee.tsx`
- Test: `tests/work-marquee.test.tsx` (append a `describe`)

- [ ] **Step 1: Write the failing test**

Append to `tests/work-marquee.test.tsx`:

```tsx
import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";

describe("WorkMarquee", () => {
  it("renders every project once in the real (non-clone) track", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    const titles = [...real.querySelectorAll("h3")].map((h) => h.textContent);
    expect(titles.length).toBe(work.length);
    work.forEach((item) => expect(titles).toContain(item.title));
  });

  it("links each real card to its live href in document order", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    const links = [...real.querySelectorAll("a")];
    expect(links.length).toBe(work.length);
    links.forEach((a, i) => expect(a.getAttribute("href")).toBe(work[i].href));
  });

  it("duplicates the set into an inert, aria-hidden clone (each project hit once by SR/keyboard)", () => {
    const { container } = render(<WorkMarquee items={work} />);
    expect(container.querySelectorAll(".marquee-track").length).toBe(2);
    const clone = container.querySelector("[data-marquee-clone]")!;
    expect(clone.getAttribute("aria-hidden")).toBe("true");
    expect(clone.hasAttribute("inert")).toBe(true);
  });

  it("gives each track an animation-duration inline (the .marquee-track class sets none)", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const tracks = [...container.querySelectorAll<HTMLElement>(".marquee-track")];
    tracks.forEach((t) => expect(t.style.animationDuration).not.toBe(""));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/work-marquee.test.tsx`
Expected: FAIL - cannot resolve `@/components/sections/home/WorkMarquee`.

- [ ] **Step 3: Write minimal implementation**

Create `components/sections/home/WorkMarquee.tsx`:

```tsx
"use client";

import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

/** One full -100% pass. Slow + linear reads as premium. Tunable in one place. */
const DURATION = "45s";

/** Card cell: fixed responsive width + uniform right margin so the two duplicated
 *  tracks are perfectly periodic and the -100% loop has zero jump. */
const CELL = "me-4 shrink-0 md:me-6 w-[clamp(260px,26vw,400px)]";

/**
 * Full-bleed auto-sliding work rail. The list is rendered twice: the real set
 * plus a visual clone (inert + aria-hidden) so screen-reader and keyboard users
 * meet each project exactly once. Both tracks translate 0 -> -100% in lockstep;
 * when the first scrolls fully off, the identical clone has taken its place, so
 * the reset is seamless. Pause-on-hover/focus and the reduced-motion fallback
 * live in styles/globals.css (.work-marquee + .marquee-track).
 */
export function WorkMarquee({ items }: { items: CaseStudy[] }) {
  return (
    <div className="work-marquee group mt-16">
      <div className="flex w-max">
        <div
          className="marquee-track flex shrink-0"
          style={{ animationDuration: DURATION }}
        >
          {items.map((item) => (
            <div key={item.slug} className={CELL}>
              <WorkSlide item={item} />
            </div>
          ))}
        </div>
        <div
          className="marquee-track flex shrink-0"
          style={{ animationDuration: DURATION }}
          data-marquee-clone="true"
          aria-hidden="true"
          inert
        >
          {items.map((item) => (
            <div key={`${item.slug}-clone`} className={CELL}>
              <WorkSlide item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/work-marquee.test.tsx`
Expected: PASS (all WorkSlide + WorkMarquee tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/home/WorkMarquee.tsx tests/work-marquee.test.tsx
git commit -m "feat(work): auto-sliding WorkMarquee rail with inert clone

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: globals.css - focus pause, full-bleed clip, reduced-motion fallback

**Files:**
- Modify: `styles/globals.css` (insert right after the existing `.group:hover .marquee-track { ... }` rule, i.e. after the current line `}` that closes it, before the `prefers-reduced-motion` section)

- [ ] **Step 1: Add the CSS**

Find this existing block in `styles/globals.css`:

```css
.group:hover .marquee-track {
  animation-play-state: paused;
}
```

Insert immediately after it:

```css
/* Pause the rail when a keyboard user focuses a card inside it */
.group:focus-within .marquee-track {
  animation-play-state: paused;
}

/* Work marquee: full-bleed auto-scroller. Clip the off-screen tracks on the X
   axis only, so card hover shadows still breathe vertically. */
.work-marquee {
  overflow-x: clip;
}

/* Reduced motion: stop the scroll, drop the visual clone, and let the row be
   scrolled by hand so every project stays reachable. animation: none wins over
   the global reduced-motion duration override because it clears animation-name. */
@media (prefers-reduced-motion: reduce) {
  .work-marquee {
    overflow-x: auto;
  }
  .work-marquee .marquee-track {
    animation: none !important;
  }
  .work-marquee [data-marquee-clone] {
    display: none;
  }
}
```

- [ ] **Step 2: Verify the stylesheet still parses (typecheck is unaffected; build compiles CSS)**

Run: `npm run build`
Expected: build succeeds (no CSS/parse error). If the dev server is running instead, the page hot-reloads without a stylesheet error in the terminal.

- [ ] **Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "feat(work): marquee focus-pause + full-bleed clip + reduced-motion fallback

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Wire SelectedWork to the marquee

**Files:**
- Modify: `components/sections/home/SelectedWork.tsx`
- Test: `tests/work-marquee.test.tsx` (append a `describe`)

- [ ] **Step 1: Write the failing test**

Append to `tests/work-marquee.test.tsx`:

```tsx
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { copy } from "@/lib/content/copy";

describe("SelectedWork", () => {
  it("keeps the section header and the view-all link", () => {
    const { container, getByRole } = render(<SelectedWork />);
    expect(container.querySelector("h2")?.textContent).toBe(copy.home.work.headline);
    const link = getByRole("link", { name: new RegExp(copy.home.work.link.label, "i") });
    expect(link.getAttribute("href")).toBe(copy.home.work.link.href);
  });

  it("mounts the marquee with all projects (no static grid)", () => {
    const { container } = render(<SelectedWork />);
    expect(container.querySelector(".work-marquee")).not.toBeNull();
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    expect(real.querySelectorAll("h3").length).toBe(work.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/work-marquee.test.tsx`
Expected: FAIL - `.work-marquee` is null (SelectedWork still renders the old grid), and/or the header assertions fail.

- [ ] **Step 3: Rewrite SelectedWork**

Replace the entire contents of `components/sections/home/SelectedWork.tsx` with:

```tsx
import Link from "next/link";
import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";
import { copy } from "@/lib/content/copy";

export function SelectedWork() {
  const w = copy.home.work;
  return (
    <section className="section-lg">
      <div className="container-x">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <h2 className="font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight">
              {w.headline}
            </h2>
          </div>
          <div className="col-span-12 md:col-start-9 md:col-span-4 flex md:justify-end pb-1">
            <Link
              href={w.link.href}
              data-cursor
              className="group flex items-center gap-2 label-caps transition-colors hover:text-fg"
            >
              {w.link.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <WorkMarquee items={work} />
    </section>
  );
}
```

Note: `Reveal`, `WorkCard`, `featuredWork`, and `cn` are no longer imported here. The marquee is rendered outside `container-x` so it bleeds to both viewport edges.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/work-marquee.test.tsx`
Expected: PASS (WorkSlide + WorkMarquee + SelectedWork).

- [ ] **Step 5: Commit**

```bash
git add components/sections/home/SelectedWork.tsx tests/work-marquee.test.tsx
git commit -m "feat(work): swap the static work grid for the auto-sliding marquee

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: no errors. (Watch for the `inert` prop - it is valid on React 19 / `@types/react@19`. If TS flags it, confirm `@types/react` is v19; do not cast it away.)

- [ ] **Step 2: Full test suite**

Run: `npm test`
Expected: all suites pass, including the existing `cursor`, `hero`, `language-toggle`, etc., plus the new `work-marquee`.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: clean (no unused-import errors in `SelectedWork.tsx` - the removed imports were deleted in Task 4).

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual visual check (dev server)**

Run: `npm run dev`, open the home page. Confirm:
- The work cards scroll continuously, right to left, edge to edge, with cards peeking at both edges.
- Hovering anywhere on the rail pauses the scroll; the `↗` badge fades in on the hovered card; the custom "View" cursor shows.
- Tabbing into a card pauses the scroll and focuses a real (not duplicated) card; each project is reached once.
- With OS "reduce motion" on, the rail does not auto-scroll and can be scrolled horizontally by hand; all five projects are reachable.

- [ ] **Step 6: Commit (only if Step 1-4 required any fix)**

```bash
git add -A
git commit -m "fix(work): resolve verification findings for the work marquee

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-review notes (author)

- Spec coverage: header kept (Task 4); all 5 projects (Task 4 passes `work`); sparse name+tags card (Task 1); two-track seamless -100% loop reusing existing keyframes (Task 2); pause on hover (existing CSS) + focus-within (Task 3); reduced-motion scrollable fallback (Task 3); clone inert/aria-hidden (Task 2); full-bleed clip (Task 3); tests for render/links/clone (Tasks 1, 2, 4). Out-of-scope items (drag, RTL) intentionally absent.
- Type consistency: `CELL` and `DURATION` are the only shared constants, used identically in both tracks. `data-marquee-clone` is the single selector contract between `WorkMarquee` (sets it) and `globals.css` + tests (read it). `.marquee-track` and `.work-marquee` class names match across component, CSS, and tests.
- No placeholders: every step has concrete code/commands and expected output.
