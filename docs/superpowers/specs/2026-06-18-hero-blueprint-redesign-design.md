# Hero redesign - "Drafted, then built" (blueprint → built)

**Date:** 2026-06-18
**Status:** Approved (concept + medium confirmed with user)
**Branch:** `redesign/hero-blueprint`
**Replaces:** the Three.js WebGL hero (`components/three/HeroCanvas.tsx` - nested rotating
wireframe icosahedra + drifting starfield) which the user found generic and not meaningful.

## 1. Goal

Replace the hero animation with a piece that **means something** for this brand and is
**not WebGL**. Lumako's positioning is unusually concrete - *"Built first. Pitched second."*
/ *"The demo is the pitch."* - proof over promise. The new hero turns that into motion: you
watch a **promise (a blueprint) become proof (a built object)**, on a gentle loop. The hero
stops being decoration and becomes a 4-second argument for the whole pitch.

Confirmed in brainstorming:
1. **Meaning:** "the build assembling" - proof coming into being, live.
2. **Subject:** "blueprint → built" - schematic lines self-draw (the plan), then resolve into a
   solid built object (the proof). The promise→proof arc, literal.
3. **Medium:** user delegated the call ("whatever will look better and more creative").
   Decision: **Canvas 2D, no WebGL** - it sheds the WebGL the user disliked, matches the site's
   hairline editorial language exactly, stays razor-crisp at any resolution, and is light enough
   to run on every device tier.

## 2. The concept - "Drafted, then built"

A single abstract **isometric form** is drafted as a hairline blueprint and then resolves into a
built, softly-shaded solid, then loops. One **lume dot** is the only color in the piece.

### 2.1 The loop (~11s, never a hard cut)

| Phase | Time | What happens | Meaning |
|---|---|---|---|
| **Field** | 0-0.6s | A faint, radially-masked measure grid + a baseline fade in - the drafting surface. | The table is set. |
| **Draft** | 0.6-3s | Hairline edges of the form **self-draw** path-by-path (plotter feel). Guide lines overshoot then trim; a few dimension ticks + leader marks appear at corners. All in `#d4d4d4`/`#a1a1a1` hairlines. | The plan / the promise - unbuilt. |
| **Build** | 3-5s | Parts snap to true. Facets **fill** with a soft tonal wash (white → light-gray, reading as light on built surfaces). A soft contact shadow drops beneath; silhouette edges darken gray→**ink** (`#0a0a0a`). Dimension annotations fade out - *you don't ship the scaffolding.* | Promise becomes proof. |
| **Live** | 5-9s | A single **lume dot** (`#d49a2e`) blinks on at one vertex - a "shipped / live" status light (echoes the lume period in the `Lumako.` wordmark). Form holds, breathing faintly, tilting with the pointer. | Shipped. |
| **Loop** | 9-11s | Annotations dissolve, the form rotates a quarter-turn in iso space and re-resolves a slightly different facet arrangement, so no two cycles look identical. Cross-fade back to Draft. | Next build. |

Timings are targets, tuned in implementation. The phase machine is time-driven off the rAF clock
(not wall-clock), so it is deterministic and pausable.

### 2.2 The form

An abstract **isometric layered solid** - a clean monumental object of 2-3 offset slabs/facets.
The layering is a quiet nod to "the whole stack" (web · AI · apps) without ever being a literal
product UI (which would read as generic-SaaS and fight the editorial restraint). Geometry is
defined as a small set of 3D vertices projected to 2D via a fixed isometric/axonometric matrix -
**no 3D engine**, just a projection function. Timeless, geometric, ownable.

## 3. Visual system integration

Uses **only existing tokens** - no new colors:
- Hairlines: `--color-line` `#E5E5E5`, `--color-line-strong` `#D4D4D4`, muted `--color-fg-dim` `#A1A1A1`.
- Built edges/fills: ink `--color-fg` `#0A0A0A`, muted `#737373`, white `--color-surface`, light `--color-card-2`.
- Soft contact shadow: same family as `--shadow-card`.
- The one accent: `--color-lume` `#D49A2E` (the "shipped" dot only). Consistent with the
  in-progress working-tree direction that re-introduces lume as the single sparing signal
  (logo dot, focus ring, active nav, footer glow) - the hero dot is one more sparing use.
- Easing: reuse `--ease-out-expo` `cubic-bezier(0.22,1,0.36,1)`.

Placement/composition is unchanged from today's hero: the form sits **center-right** behind the
asymmetric text (big headline left, eyebrow+sub upper-right, CTAs below). The existing **light
legibility wash** (`Hero.tsx` radial) and **`.noise-veil` grain** stay layered on top, so the
left headline and CTAs remain fully readable. The form is low-contrast by design - backdrop, not
foreground.

## 4. Architecture

### 4.1 New component - `components/hero/HeroBlueprint.tsx` (client)

A self-contained Canvas 2D renderer. Single responsibility: draw the blueprint→built loop into a
full-bleed canvas behind the hero text.

Public surface (kept minimal):
```tsx
export function HeroBlueprint(): JSX.Element
```
- No required props. Reads `prefers-reduced-motion` internally.
- Renders a single `<canvas aria-hidden className="absolute inset-0" />` with
  `pointer-events: none` (decorative).

Internal structure (each a small, testable unit):
- **`geometry.ts`** (co-located, e.g. `components/hero/blueprint/geometry.ts`) - the form's
  vertices/edges/faces + the isometric projection function `project(v3, rotationY) → {x,y}`.
  Pure, no DOM. Independently unit-testable.
- **`phases.ts`** - the phase machine: given elapsed time, returns the current phase + a 0..1
  progress within it, and the eased draw/fill/annotation/dot opacities. Pure, deterministic,
  unit-testable.
- **`HeroBlueprint.tsx`** - the React shell: sets up the canvas, DPR scaling, the rAF loop,
  pointer-parallax state, IntersectionObserver + visibilitychange pause, and calls a `render(ctx,
  state)` draw routine using geometry + phases. The only impure/imperative part.

### 4.2 Rendering & performance

- **Canvas 2D**, sized to its container, scaled by `devicePixelRatio` (capped ~2) for crispness;
  re-measured on `ResizeObserver`.
- **One** `requestAnimationFrame` loop. Pointer parallax via a cheap lerp toward the target tilt.
- **Pauses** when the tab is hidden (`visibilitychange`) and when the hero scrolls out of view
  (`IntersectionObserver`) - no wasted frames, battery-friendly.
- No allocations in the hot path (pre-allocate the projected-point buffers).

### 4.3 Reduced motion & SSR

- `prefers-reduced-motion: reduce` → render a **single static frame** of the *built + live* state
  (object filled, ink edges, lume dot on). No draw, no loop, no parallax.
- Client-only component (`"use client"`); canvas only initializes after mount, so SSR/first paint
  shows nothing heavy (the hero's wash/background covers it). No layout shift - canvas is
  absolutely positioned `inset-0`.

### 4.4 `Hero.tsx` changes

- Swap `HeroCanvas`/`HeroFallback` (and the `dynamic()` import) for `<HeroBlueprint />`.
- **Remove the `useDeviceTier` high-tier gate** - the Canvas 2D piece is cheap enough to run on
  all tiers; reduced-motion is handled inside `HeroBlueprint`. (`showCanvas` logic deleted.)
- Keep everything else: the legibility wash, `.noise-veil`, the asymmetric text layout, CTAs, and
  the scroll cue - all untouched.

## 5. Deletions

- `components/three/HeroCanvas.tsx` and `components/three/HeroFallback.tsx` (and the now-empty
  `components/three/` directory).
- **Dependencies** (verified: `HeroCanvas.tsx` is the *only* source file importing any of these):
  `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`,
  `postprocessing`, `@types/three`. Remove from `package.json` + lockfile.
- **`useDeviceTier`** (and its `DeviceTier` type) in `lib/mediaHooks.ts` is consumed **only** by
  `Hero.tsx` (verified by grep) → becomes dead after the Hero change; remove it. `useCursorEnabled`
  and `useScrolled` stay.
- **`README.md`** documents the `components/three/` directory (`three/ # HeroCanvas + HeroFallback`)
  - update that line to describe `components/hero/` instead.

## 6. Out of scope

- Copy/content (`lib/content/*`) - untouched; Vitest content-invariant + contact-validation tests
  stay green.
- Hero text layout/structure, CTAs, scroll cue - unchanged.
- Every other page and the rest of the design system - unchanged.
- The separate in-progress working-tree lume re-introduction (Nav/Button/Field/Logo/globals) - not
  part of this work; left as-is.
- No new dependencies (Canvas 2D is native).

## 7. Verification

- `npm run typecheck`, `npm run lint`, `npm run test` (must stay green).
- `npm run build` (confirms the removed deps aren't referenced anywhere).
- Visual QA: the loop reads as draft→built→live; legible headline over it at ~1280 / 1920 /
  2560px; no horizontal scroll.
- Reduced-motion: static built state, no animation.
- Performance: rAF pauses when tab hidden / hero off-screen; no jank on a mid-tier laptop.
- A11y: canvas is `aria-hidden` + `pointer-events:none`; focus order and CTAs unaffected.
- Unit tests for the pure `geometry.ts` (projection) and `phases.ts` (phase boundaries/easing).

## 8. Risks

- **"Reads as a blueprint" is a craft risk** - the draft→build→live transition must be legible and
  not muddy. Mitigate: tune timing, keep the form simple (2-3 facets), strong gray→ink contrast
  shift at the Build moment, annotations that clearly fade.
- **Canvas crispness** - must DPR-scale and re-scale on resize, or lines look soft on HiDPI.
- **Loop fatigue** - the quarter-turn re-resolve per cycle keeps it fresh; if still repetitive,
  lengthen the "Live" hold.
- **Legibility over the form** - keep the form low-contrast and center-right; rely on the existing
  wash. Validate the left headline contrast.
- **AGENTS.md:** this is a modified Next.js - read the relevant `node_modules/next/dist/docs/`
  guide (client components / dynamic / fonts as touched) before writing code.
