# Hero "Drafted, then built" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Three.js WebGL hero (rotating wireframe icosahedra) with a Canvas-2D "blueprint → built" loop - schematic lines self-draw (the promise), resolve into a built solid (the proof), one lume "shipped" dot - and delete the now-unused 3D stack.

**Architecture:** A `"use client"` React shell (`HeroBlueprint.tsx`) owns a single `<canvas>`, a `requestAnimationFrame` loop, pointer parallax, and pause-when-offscreen/hidden. All the *logic* lives in three pure, unit-tested modules it drives: `geometry.ts` (form vertices + isometric projection), `phases.ts` (timeline → eased visual state), and `render.ts` (the imperative draw routine). Reduced-motion renders one static "built" frame. No WebGL, no new dependencies.

**Tech Stack:** Next 16 App Router, React 19, TypeScript, Canvas 2D, `motion/react` (reduced-motion only), Vitest + Testing Library, Tailwind v4 tokens (read at runtime via `getComputedStyle`).

**Spec:** `docs/superpowers/specs/2026-06-18-hero-blueprint-redesign-design.md`
**Branch:** `redesign/hero-blueprint` (already created).

---

## File structure

**Create**
- `components/hero/blueprint/geometry.ts` - pure: `Vec3`/`Vec2`/`Face`/`Form`, `project()`, `faceDepth()`, `sortedFaces()`, `buildForm()`, `SHIPPED_VERTEX_INDEX`. No DOM.
- `components/hero/blueprint/phases.ts` - pure: `Phase`/`PhaseState`, phase-boundary constants, `easeOutExpo()`/`easeInOut()`, `getPhaseState()`, `STATIC_STATE`. No DOM.
- `components/hero/blueprint/render.ts` - imperative: `BlueprintColors`/`DEFAULT_COLORS`/`Dims`, `renderBlueprint()`, plus `blend()`/`toneColor()`/`drawField()`/`drawAnnotations()`. Draws into a `CanvasRenderingContext2D`.
- `components/hero/HeroBlueprint.tsx` - `"use client"` React shell: canvas + rAF loop + parallax + observers + reduced-motion static frame + `readColors()`.
- `tests/hero-geometry.test.ts`, `tests/hero-phases.test.ts`, `tests/hero-render.test.ts`, `tests/hero-blueprint.test.tsx`.

**Modify**
- `components/sections/home/Hero.tsx` - swap canvas/fallback for `<HeroBlueprint />`; drop the `useDeviceTier`/reduced-motion gate.
- `lib/mediaHooks.ts` - remove `useDeviceTier` + `DeviceTier` (only `Hero` used them - verified).
- `package.json` + lockfile - remove `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `@types/three`.
- `next.config.ts` - remove `transpilePackages: ["three"]`.
- `README.md` - update the `components/three/` line to `components/hero/`.

**Delete**
- `components/three/HeroCanvas.tsx`, `components/three/HeroFallback.tsx` (and the now-empty `components/three/`).

**Reuse (do NOT re-implement):** `clamp`, `lerp` from `lib/utils.ts`; `useReducedMotion` from `lib/useReducedMotion.ts`.

> **AGENTS.md:** This is a modified Next.js. The relevant guide (`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`) was read for this plan: client components just need `"use client"` at the top; nothing else is unusual here.

---

## Task 1: Pure geometry + isometric projection

**Files:**
- Create: `components/hero/blueprint/geometry.ts`
- Test: `tests/hero-geometry.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/hero-geometry.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  project,
  buildForm,
  sortedFaces,
  SHIPPED_VERTEX_INDEX,
} from "@/components/hero/blueprint/geometry";

describe("project", () => {
  it("maps the world origin to the screen origin", () => {
    const p = project([0, 0, 0], 0, 100, { x: 50, y: 60 });
    expect(p.x).toBeCloseTo(50, 5);
    expect(p.y).toBeCloseTo(60, 5);
  });

  it("is periodic in rotation (0 == 2π)", () => {
    const a = project([1, 0.5, -0.3], 0, 100, { x: 0, y: 0 });
    const b = project([1, 0.5, -0.3], Math.PI * 2, 100, { x: 0, y: 0 });
    expect(a.x).toBeCloseTo(b.x, 4);
    expect(a.y).toBeCloseTo(b.y, 4);
  });

  it("projects a unit X point to the 30° axonometric position", () => {
    const p = project([1, 0, 0], 0, 1, { x: 0, y: 0 });
    expect(p.x).toBeCloseTo(Math.cos(Math.PI / 6), 5); // ~0.866
    expect(p.y).toBeCloseTo(-Math.sin(Math.PI / 6), 5); // y flipped, -0.5
  });
});

describe("buildForm", () => {
  it("produces three stacked boxes: 24 verts, 36 edges, 15 faces", () => {
    const form = buildForm();
    expect(form.vertices).toHaveLength(24);
    expect(form.edges).toHaveLength(36);
    expect(form.faces).toHaveLength(15);
  });

  it("keeps SHIPPED_VERTEX_INDEX inside the vertex list", () => {
    expect(SHIPPED_VERTEX_INDEX).toBeLessThan(buildForm().vertices.length);
  });
});

describe("sortedFaces", () => {
  it("returns every face, ordered back-to-front (non-decreasing depth)", () => {
    const form = buildForm();
    const faces = sortedFaces(form, 0.7);
    expect(faces).toHaveLength(form.faces.length);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/hero-geometry.test.ts`
Expected: FAIL - cannot resolve `@/components/hero/blueprint/geometry`.

- [ ] **Step 3: Write the implementation**

Create `components/hero/blueprint/geometry.ts`:

```ts
/** Pure geometry + isometric projection for the hero blueprint. No DOM. */

export type Vec3 = readonly [number, number, number];
export interface Vec2 {
  x: number;
  y: number;
}

export interface Face {
  /** vertex indices, in winding order */
  loop: number[];
  /** 0..1 lightness for the built fill (1 = lightest / top, lit) */
  tone: number;
}

export interface Form {
  vertices: Vec3[];
  edges: [number, number][];
  faces: Face[];
}

const ISO_ANGLE = Math.PI / 6; // 30° axonometric view

/**
 * Project a 3D point to 2D screen space: rotate around Y by `rotY`, apply a
 * fixed 30° axonometric view, then scale and offset to `origin`. Screen Y grows
 * downward, so the axonometric Y is negated.
 */
export function project(p: Vec3, rotY: number, scale: number, origin: Vec2): Vec2 {
  const [x, y, z] = p;
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  const rx = x * cos - z * sin;
  const rz = x * sin + z * cos;
  const isoX = (rx - rz) * Math.cos(ISO_ANGLE);
  const isoY = (rx + rz) * Math.sin(ISO_ANGLE) - y;
  return { x: origin.x + isoX * scale, y: origin.y - isoY * scale };
}

/** Rotated depth key (larger = nearer the viewer) for painter's-order sorting. */
export function faceDepth(face: Face, vertices: Vec3[], rotY: number): number {
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  let sum = 0;
  for (const i of face.loop) {
    const [x, y, z] = vertices[i];
    sum += x * sin + z * cos + y * 0.0001; // tie-break by height
  }
  return sum / face.loop.length;
}

/** Faces ordered back-to-front for the current rotation. */
export function sortedFaces(form: Form, rotY: number): Face[] {
  return [...form.faces].sort(
    (a, b) => faceDepth(a, form.vertices, rotY) - faceDepth(b, form.vertices, rotY),
  );
}

/** Append one axis-aligned box (8 verts, 12 edges, 6 faces) to the accumulator. */
function addBox(
  acc: Form,
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  topTone: number, sideTone: number,
): void {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, y1 = cy + h / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const b = acc.vertices.length;
  acc.vertices.push(
    [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], // bottom 0..3
    [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], // top    4..7
  );
  const e: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (const [a, c] of e) acc.edges.push([a + b, c + b]);
  acc.faces.push(
    { loop: [4, 5, 6, 7].map((i) => i + b), tone: topTone },          // top (lit)
    { loop: [0, 1, 5, 4].map((i) => i + b), tone: sideTone },         // front
    { loop: [1, 2, 6, 5].map((i) => i + b), tone: sideTone * 0.92 },  // right
    { loop: [3, 2, 6, 7].map((i) => i + b), tone: sideTone },         // back
    { loop: [0, 3, 7, 4].map((i) => i + b), tone: sideTone * 0.92 },  // left
  );
}

/** The hero form: three offset, decreasing slabs - an abstract layered monument. */
export function buildForm(): Form {
  const acc: Form = { vertices: [], edges: [], faces: [] };
  addBox(acc, 0,     -0.9,  0,    2.4, 0.5, 2.4, 0.96, 0.80);
  addBox(acc, 0.25,  -0.25, -0.2, 1.7, 0.5, 1.7, 0.98, 0.84);
  addBox(acc, -0.15, 0.45,  0.25, 1.0, 0.6, 1.0, 1.0,  0.88);
  return acc;
}

/** Vertex for the lume "shipped" dot: top slab (verts 16-23), top-front-right (local 6). */
export const SHIPPED_VERTEX_INDEX = 8 * 2 + 6; // = 22
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/hero-geometry.test.ts`
Expected: PASS (4 suites, all green).

- [ ] **Step 5: Commit**

```bash
git add components/hero/blueprint/geometry.ts tests/hero-geometry.test.ts
git commit -m "feat(hero): pure isometric geometry + projection for blueprint

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Pure phase machine (timeline → visual state)

**Files:**
- Create: `components/hero/blueprint/phases.ts`
- Test: `tests/hero-phases.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/hero-phases.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getPhaseState,
  easeOutExpo,
  STATIC_STATE,
  CYCLE,
} from "@/components/hero/blueprint/phases";

describe("easeOutExpo", () => {
  it("pins endpoints", () => {
    expect(easeOutExpo(0)).toBe(0);
    expect(easeOutExpo(1)).toBe(1);
  });
});

describe("getPhaseState", () => {
  it("starts in the field phase with nothing drawn", () => {
    const s = getPhaseState(0);
    expect(s.phase).toBe("field");
    expect(s.drawProgress).toBe(0);
    expect(s.dotOpacity).toBe(0);
  });

  it("is drafting partway through (wireframe self-drawing)", () => {
    const s = getPhaseState(2);
    expect(s.phase).toBe("draft");
    expect(s.drawProgress).toBeGreaterThan(0);
    expect(s.drawProgress).toBeLessThan(1);
    expect(s.fillOpacity).toBe(0);
  });

  it("is filling during build", () => {
    const s = getPhaseState(4);
    expect(s.phase).toBe("build");
    expect(s.drawProgress).toBe(1);
    expect(s.fillOpacity).toBeGreaterThan(0);
  });

  it("is live and shipped after build", () => {
    const s = getPhaseState(7);
    expect(s.phase).toBe("live");
    expect(s.fillOpacity).toBe(1);
    expect(s.dotOpacity).toBeGreaterThan(0.9);
  });

  it("dissolves during the loop tail", () => {
    const s = getPhaseState(10);
    expect(s.phase).toBe("loop");
    expect(s.fillOpacity).toBeLessThan(1);
  });

  it("accumulates a quarter turn per cycle (continuous across the seam)", () => {
    const s = getPhaseState(CYCLE);
    expect(s.phase).toBe("field");
    expect(s.rotationTurns).toBeCloseTo(0.25, 5);
  });

  it("keeps every opacity within [0,1] across a full sweep", () => {
    for (let t = 0; t <= CYCLE * 2; t += 0.05) {
      const s = getPhaseState(t);
      for (const v of [
        s.gridOpacity, s.drawProgress, s.fillOpacity, s.edgeInk,
        s.annotationOpacity, s.dotOpacity, s.shadowOpacity,
      ]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("STATIC_STATE", () => {
  it("is the fully-built, shipped frame", () => {
    expect(STATIC_STATE.fillOpacity).toBe(1);
    expect(STATIC_STATE.dotOpacity).toBe(1);
    expect(STATIC_STATE.drawProgress).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/hero-phases.test.ts`
Expected: FAIL - cannot resolve `@/components/hero/blueprint/phases`.

- [ ] **Step 3: Write the implementation**

Create `components/hero/blueprint/phases.ts`:

```ts
/** Pure timeline → visual-state machine for the hero blueprint. No DOM. */
import { clamp } from "@/lib/utils";

export type Phase = "field" | "draft" | "build" | "live" | "loop";

export interface PhaseState {
  phase: Phase;
  gridOpacity: number;
  drawProgress: number; // 0..1 wireframe self-draw
  fillOpacity: number; // 0..1 built face fill
  edgeInk: number; // 0..1 gray→ink silhouette
  annotationOpacity: number;
  dotOpacity: number; // lume "shipped" dot
  shadowOpacity: number;
  rotationTurns: number; // 1 = full revolution
}

// Phase boundaries (seconds) within one cycle.
export const FIELD_END = 0.6;
export const DRAFT_END = 3.0;
export const BUILD_END = 5.0;
export const LIVE_END = 9.0;
export const CYCLE = 11.0;

/** easeOutExpo - heavy settle; canvas equivalent of the site's motion bezier. */
export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Smooth in-out for dissolves. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Normalize `t` within [start,end] to a clamped 0..1. */
function seg(t: number, start: number, end: number): number {
  return clamp((t - start) / (end - start), 0, 1);
}

function state(phase: Phase, over: Partial<PhaseState>): PhaseState {
  return {
    phase,
    gridOpacity: 0,
    drawProgress: 0,
    fillOpacity: 0,
    edgeInk: 0,
    annotationOpacity: 0,
    dotOpacity: 0,
    shadowOpacity: 0,
    rotationTurns: 0,
    ...over,
  };
}

/**
 * Visual state at `elapsed` seconds. A quarter turn of rotation accumulates per
 * completed cycle so no two loops resolve the same facets.
 */
export function getPhaseState(elapsed: number): PhaseState {
  const cycleIndex = Math.floor(elapsed / CYCLE);
  const t = elapsed - cycleIndex * CYCLE;
  const baseTurns = cycleIndex * 0.25;

  if (t < FIELD_END) {
    return state("field", { gridOpacity: seg(t, 0, FIELD_END), rotationTurns: baseTurns });
  }
  if (t < DRAFT_END) {
    const p = easeOutExpo(seg(t, FIELD_END, DRAFT_END));
    return state("draft", {
      gridOpacity: 1, drawProgress: p, annotationOpacity: p, rotationTurns: baseTurns,
    });
  }
  if (t < BUILD_END) {
    const p = easeOutExpo(seg(t, DRAFT_END, BUILD_END));
    return state("build", {
      gridOpacity: 1 - p * 0.5, drawProgress: 1, fillOpacity: p, edgeInk: p,
      annotationOpacity: 1 - p, shadowOpacity: p, rotationTurns: baseTurns,
    });
  }
  if (t < LIVE_END) {
    const p = seg(t, BUILD_END, LIVE_END);
    return state("live", {
      gridOpacity: 0.5, drawProgress: 1, fillOpacity: 1, edgeInk: 1,
      dotOpacity: easeOutExpo(clamp(p * 3, 0, 1)), shadowOpacity: 1,
      rotationTurns: baseTurns + p * 0.12,
    });
  }
  const p = easeInOut(seg(t, LIVE_END, CYCLE));
  return state("loop", {
    gridOpacity: 0.5 + p * 0.5, drawProgress: 1, fillOpacity: 1 - p, edgeInk: 1 - p,
    dotOpacity: 1 - p, shadowOpacity: 1 - p,
    rotationTurns: baseTurns + 0.12 + p * 0.13, // reaches baseTurns + 0.25 at the seam
  });
}

/** Static frame for prefers-reduced-motion (the "shipped" look). */
export const STATIC_STATE: PhaseState = {
  phase: "live", gridOpacity: 0.5, drawProgress: 1, fillOpacity: 1, edgeInk: 1,
  annotationOpacity: 0, dotOpacity: 1, shadowOpacity: 1, rotationTurns: 0,
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/hero-phases.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/hero/blueprint/phases.ts tests/hero-phases.test.ts
git commit -m "feat(hero): blueprint phase machine (field→draft→build→live→loop)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Canvas render routine

**Files:**
- Create: `components/hero/blueprint/render.ts`
- Test: `tests/hero-render.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/hero-render.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { renderBlueprint, DEFAULT_COLORS, blend } from "@/components/hero/blueprint/render";
import { buildForm } from "@/components/hero/blueprint/geometry";
import { STATIC_STATE } from "@/components/hero/blueprint/phases";

function makeMockCtx() {
  return {
    clearRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
    closePath: vi.fn(), stroke: vi.fn(), fill: vi.fn(), arc: vi.fn(), ellipse: vi.fn(),
    save: vi.fn(), restore: vi.fn(),
    strokeStyle: "", fillStyle: "", lineWidth: 0, globalAlpha: 1, lineCap: "butt",
  };
}

describe("blend", () => {
  it("interpolates two hex colors to an rgb() string", () => {
    expect(blend("#000000", "#ffffff", 0.5)).toBe("rgb(128, 128, 128)");
    expect(blend("#000000", "#ffffff", 0)).toBe("rgb(0, 0, 0)");
    expect(blend("#000000", "#ffffff", 1)).toBe("rgb(255, 255, 255)");
  });
});

describe("renderBlueprint", () => {
  it("clears and issues stroke + fill draw calls for the built frame", () => {
    const ctx = makeMockCtx();
    renderBlueprint(
      ctx as unknown as CanvasRenderingContext2D,
      { width: 800, height: 600 },
      STATIC_STATE,
      buildForm(),
      { x: 0, y: 0 },
      DEFAULT_COLORS,
    );
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(ctx.stroke).toHaveBeenCalled(); // edges
    expect(ctx.fill).toHaveBeenCalled(); // faces + dot
  });

  it("does not throw on the empty field frame", () => {
    const ctx = makeMockCtx();
    expect(() =>
      renderBlueprint(
        ctx as unknown as CanvasRenderingContext2D,
        { width: 800, height: 600 },
        { phase: "field", gridOpacity: 0, drawProgress: 0, fillOpacity: 0, edgeInk: 0,
          annotationOpacity: 0, dotOpacity: 0, shadowOpacity: 0, rotationTurns: 0 },
        buildForm(),
        { x: 0, y: 0 },
        DEFAULT_COLORS,
      ),
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/hero-render.test.ts`
Expected: FAIL - cannot resolve `@/components/hero/blueprint/render`.

- [ ] **Step 3: Write the implementation**

Create `components/hero/blueprint/render.ts`:

```ts
/** Imperative Canvas-2D draw routine for the hero blueprint. */
import { clamp, lerp } from "@/lib/utils";
import {
  type Form, type Vec2, project, sortedFaces, SHIPPED_VERTEX_INDEX,
} from "@/components/hero/blueprint/geometry";
import { easeOutExpo, type PhaseState } from "@/components/hero/blueprint/phases";

export interface BlueprintColors {
  line: string; lineStrong: string; dim: string; ink: string;
  muted: string; surface: string; card2: string; lume: string;
}

/** Token-matched defaults (keep in sync with styles/globals.css @theme). */
export const DEFAULT_COLORS: BlueprintColors = {
  line: "#e5e5e5", lineStrong: "#d4d4d4", dim: "#a1a1a1", ink: "#0a0a0a",
  muted: "#737373", surface: "#ffffff", card2: "#f6f6f5", lume: "#d49a2e",
};

export interface Dims { width: number; height: number; }

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

/** Linear blend of two hex colors → "rgb(r, g, b)". */
export function blend(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(lerp(pa[0], pb[0], t));
  const g = Math.round(lerp(pa[1], pb[1], t));
  const bl = Math.round(lerp(pa[2], pb[2], t));
  return `rgb(${r}, ${g}, ${bl})`;
}

/** Face fill tone: lower tone = more shaded (grayer), tone 1 = lit surface. */
function toneColor(tone: number, c: BlueprintColors): string {
  return blend(c.dim, c.surface, clamp(tone, 0, 1));
}

/** Faint dot measure-grid with radial alpha falloff around the form. */
function drawField(ctx: CanvasRenderingContext2D, origin: Vec2, scale: number, alpha: number, c: BlueprintColors): void {
  if (alpha <= 0) return;
  const step = scale * 0.5;
  const maxR = scale * 4;
  ctx.save();
  ctx.fillStyle = c.dim;
  for (let gx = -8; gx <= 8; gx++) {
    for (let gy = -6; gy <= 6; gy++) {
      const x = origin.x + gx * step;
      const y = origin.y + gy * step;
      const d = Math.hypot(x - origin.x, y - origin.y);
      const a = alpha * 0.5 * Math.max(0, 1 - d / maxR);
      if (a <= 0.001) continue;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** A single horizontal dimension line with end ticks beneath the form. */
function drawAnnotations(ctx: CanvasRenderingContext2D, origin: Vec2, scale: number, alpha: number, c: BlueprintColors): void {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = c.dim;
  ctx.lineWidth = 1;
  const y = origin.y + scale * 1.7;
  const x0 = origin.x - scale * 1.7;
  const x1 = origin.x + scale * 1.7;
  ctx.beginPath();
  ctx.moveTo(x0, y); ctx.lineTo(x1, y);
  ctx.moveTo(x0, y - 6); ctx.lineTo(x0, y + 6);
  ctx.moveTo(x1, y - 6); ctx.lineTo(x1, y + 6);
  ctx.stroke();
  ctx.restore();
}

/** Draw one frame of the blueprint→built loop. */
export function renderBlueprint(
  ctx: CanvasRenderingContext2D,
  dims: Dims,
  s: PhaseState,
  form: Form,
  pointer: Vec2,
  colors: BlueprintColors,
): void {
  const { width, height } = dims;
  ctx.clearRect(0, 0, width, height);

  const scale = Math.min(width, height) * 0.16;
  const origin: Vec2 = {
    x: width * 0.62 + pointer.x * width * 0.02,
    y: height * 0.54 + pointer.y * height * 0.02,
  };
  const rotY = s.rotationTurns * Math.PI * 2 + pointer.x * 0.25;
  const pts = form.vertices.map((v) => project(v, rotY, scale, origin));

  drawField(ctx, origin, scale, s.gridOpacity, colors);

  // contact shadow
  if (s.shadowOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = s.shadowOpacity * 0.12;
    ctx.fillStyle = colors.ink;
    ctx.beginPath();
    ctx.ellipse(origin.x, origin.y + scale * 1.1, scale * 1.6, scale * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // built faces, back-to-front
  if (s.fillOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = s.fillOpacity;
    for (const face of sortedFaces(form, rotY)) {
      ctx.fillStyle = toneColor(face.tone, colors);
      ctx.beginPath();
      face.loop.forEach((i, k) =>
        k === 0 ? ctx.moveTo(pts[i].x, pts[i].y) : ctx.lineTo(pts[i].x, pts[i].y),
      );
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // self-drawing wireframe edges
  ctx.save();
  ctx.lineCap = "round";
  const n = form.edges.length;
  form.edges.forEach(([a, b], i) => {
    const edgeP = easeOutExpo(clamp(s.drawProgress * n - i, 0, 1));
    if (edgeP <= 0) return;
    const A = pts[a];
    const B = pts[b];
    ctx.globalAlpha = 1;
    ctx.strokeStyle = blend(colors.lineStrong, colors.ink, s.edgeInk);
    ctx.lineWidth = lerp(1, 1.5, s.edgeInk);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(lerp(A.x, B.x, edgeP), lerp(A.y, B.y, edgeP));
    ctx.stroke();
  });
  ctx.restore();

  drawAnnotations(ctx, origin, scale, s.annotationOpacity, colors);

  // lume "shipped" dot
  if (s.dotOpacity > 0) {
    const d = pts[SHIPPED_VERTEX_INDEX];
    ctx.save();
    ctx.globalAlpha = s.dotOpacity;
    ctx.fillStyle = colors.lume;
    ctx.beginPath();
    ctx.arc(d.x, d.y, Math.max(3, scale * 0.07), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/hero-render.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/hero/blueprint/render.ts tests/hero-render.test.ts
git commit -m "feat(hero): canvas render routine for blueprint→built frame

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: HeroBlueprint client component

**Files:**
- Create: `components/hero/HeroBlueprint.tsx`
- Test: `tests/hero-blueprint.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/hero-blueprint.test.tsx`:

```tsx
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { HeroBlueprint } from "@/components/hero/HeroBlueprint";

// jsdom lacks matchMedia (motion's useReducedMotion needs it) and canvas 2d.
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }
});

describe("HeroBlueprint", () => {
  it("renders a decorative, non-interactive canvas", () => {
    const { container } = render(<HeroBlueprint />);
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
    expect(canvas?.style.pointerEvents).toBe("none");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/hero-blueprint.test.tsx`
Expected: FAIL - cannot resolve `@/components/hero/HeroBlueprint`.

(Note: jsdom logs a "Not implemented: HTMLCanvasElement.prototype.getContext" warning - harmless; `getContext` returns `null`, so the effect bails before touching `ResizeObserver`/`IntersectionObserver`.)

- [ ] **Step 3: Write the implementation**

Create `components/hero/HeroBlueprint.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { lerp } from "@/lib/utils";
import { buildForm } from "@/components/hero/blueprint/geometry";
import { getPhaseState, STATIC_STATE } from "@/components/hero/blueprint/phases";
import {
  renderBlueprint, DEFAULT_COLORS, type BlueprintColors,
} from "@/components/hero/blueprint/render";

function readColors(): BlueprintColors {
  if (typeof window === "undefined") return DEFAULT_COLORS;
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    line: v("--color-line", DEFAULT_COLORS.line),
    lineStrong: v("--color-line-strong", DEFAULT_COLORS.lineStrong),
    dim: v("--color-fg-dim", DEFAULT_COLORS.dim),
    ink: v("--color-fg", DEFAULT_COLORS.ink),
    muted: v("--color-fg-muted", DEFAULT_COLORS.muted),
    surface: v("--color-surface", DEFAULT_COLORS.surface),
    card2: v("--color-card-2", DEFAULT_COLORS.card2),
    lume: v("--color-lume", DEFAULT_COLORS.lume),
  };
}

/**
 * "Drafted, then built" - a Canvas-2D blueprint that self-draws then resolves
 * into a built solid, on loop. Decorative; pauses off-screen / when hidden.
 */
export function HeroBlueprint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const form = buildForm();
    const colors = readColors();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let dims = { width: 0, height: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dims = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) renderBlueprint(ctx, dims, STATIC_STATE, form, { x: 0, y: 0 }, colors);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduce) {
      return () => ro.disconnect();
    }

    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      if (last === 0) last = now;
      elapsed += (now - last) / 1000;
      last = now;
      pointer.x = lerp(pointer.x, pointer.tx, 0.05);
      pointer.y = lerp(pointer.y, pointer.ty, 0.05);
      renderBlueprint(ctx, dims, getPhaseState(elapsed), form, { x: pointer.x, y: pointer.y }, colors);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0; // resume without a time jump
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(frame);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/hero-blueprint.test.tsx`
Expected: PASS.

- [ ] **Step 5: Lint the new component (React Compiler purity)**

Run: `npm run lint`
Expected: PASS. If ESLint flags `react-hooks/purity` or `react-hooks/immutability` inside the effect (the rAF loop reads/mutates locals imperatively), add this scoped directive directly under the `"use client"` line (mirrors `HeroCanvas.tsx`'s existing pattern), then re-run lint:

```tsx
/* eslint-disable react-hooks/purity, react-hooks/immutability -- imperative Canvas 2D loop: mutates canvas state and animation locals each frame; correct, idiomatic rAF rendering. */
```

Only add it if lint actually errors (avoids an unused-directive warning).

- [ ] **Step 6: Commit**

```bash
git add components/hero/HeroBlueprint.tsx tests/hero-blueprint.test.tsx
git commit -m "feat(hero): HeroBlueprint client component (canvas loop + reduced-motion)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Wire HeroBlueprint into the hero section

**Files:**
- Modify: `components/sections/home/Hero.tsx` (full replace below)

- [ ] **Step 1: Replace `Hero.tsx` with the blueprint wiring**

This drops the `dynamic()` import, the `HeroCanvas`/`HeroFallback`/`useDeviceTier` usage, and the `showCanvas` gate (reduced-motion is now handled inside `HeroBlueprint`). Everything else - wash, grain, text columns, CTAs, scroll cue - is unchanged. Overwrite `components/sections/home/Hero.tsx` with:

```tsx
"use client";

import { motion } from "motion/react";
import { HeroBlueprint } from "@/components/hero/HeroBlueprint";
import { TextReveal } from "@/components/ui/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/content/copy";
import { easeOutExpo } from "@/lib/motion";

export function Hero() {
  const { hero } = copy.home;

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      {/* white legibility wash behind the scene - the lume glow lives only in the footer */}
      <div className="glow-accent pointer-events-none absolute inset-0" />
      <div className="absolute inset-0">
        <HeroBlueprint />
      </div>
      {/* legibility wash + grain over the scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 40%, rgba(255,255,255,0), rgba(255,255,255,0.65) 80%)",
        }}
      />
      <div className="noise-veil" />

      <div className="container-x relative z-10 pt-[var(--header-h)]">
        <div className="grid-12 items-end gap-y-10">
          {/* LEFT column - headline + CTAs */}
          <div className="col-span-12 md:col-span-7">
            <TextReveal
              as="h1"
              text={hero.headline}
              highlight={hero.highlight}
              delay={0.55}
              className="block max-w-[22ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.95] tracking-tight text-balance"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 1.25 }}
              className="mt-11 flex flex-wrap items-center gap-4"
            >
              <MagneticButton href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
              </MagneticButton>
              <Button href={hero.ctaSecondary.href} variant="lume">
                {hero.ctaSecondary.label}
              </Button>
            </motion.div>
          </div>

          {/* RIGHT column - eyebrow + supporting paragraph */}
          <div className="col-span-12 md:col-start-9 md:col-span-4 order-first md:order-none">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.4 }}
            >
              <Eyebrow index="01">{hero.eyebrow}</Eyebrow>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 1.1 }}
              className="mt-8 max-w-[46ch] text-[length:var(--text-xl)] text-fg-muted text-pretty"
            >
              {hero.sub}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <span className="label-caps flex flex-col items-center gap-3">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-fg" />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
```

> Note: this overwrites a pre-existing uncommitted comment-only edit on line 27 of `Hero.tsx` - intended; the comment is updated above.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS, no errors. (`HeroCanvas`/`HeroFallback`/`useDeviceTier` are still present on disk but no longer imported - that's fine; they're removed in Task 6.)

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/sections/home/Hero.tsx
git commit -m "feat(hero): render HeroBlueprint, drop WebGL canvas + device-tier gate

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Delete the 3D stack and dead code

**Files:**
- Delete: `components/three/HeroCanvas.tsx`, `components/three/HeroFallback.tsx`
- Modify: `lib/mediaHooks.ts` (full replace below), `next.config.ts`, `README.md`, `package.json` (+ lockfile via npm)

- [ ] **Step 1: Delete the Three.js hero files**

```bash
git rm components/three/HeroCanvas.tsx components/three/HeroFallback.tsx
```

(The `components/three/` directory is now empty; `git rm` removes the tracked files.)

- [ ] **Step 2: Remove `useDeviceTier` + `DeviceTier` from `lib/mediaHooks.ts`**

Overwrite `lib/mediaHooks.ts` with (keeps `useCursorEnabled` + `useScrolled`, drops the WebGL-only tier hook):

```ts
"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Subscribe to one or more media queries' change events. */
function mediaSubscribe(queries: string[]) {
  return (cb: () => void) => {
    if (typeof window === "undefined") return noop();
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((m) => m.addEventListener("change", cb));
    return () => mqls.forEach((m) => m.removeEventListener("change", cb));
  };
}

/** Whether the custom cursor should run (precise pointer + motion allowed). */
export function useCursorEnabled(): boolean {
  return useSyncExternalStore(
    mediaSubscribe(["(pointer: fine)", "(prefers-reduced-motion: reduce)"]),
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 24): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return noop();
      window.addEventListener("scroll", cb, { passive: true });
      return () => window.removeEventListener("scroll", cb);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
```

- [ ] **Step 3: Remove the Three.js transpile config**

Edit `next.config.ts` - delete the `transpilePackages` line and its comment so it reads:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities; we keep a small set.
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Update the README directory map**

In `README.md`, replace the line:

```
  three/      # HeroCanvas (R3F scene) + HeroFallback
```

with:

```
  hero/       # HeroBlueprint (Canvas 2D) + blueprint/ (geometry, phases, render)
```

- [ ] **Step 5: Uninstall the 3D dependencies**

Run:

```bash
npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing @types/three
```

Expected: `package.json` dependencies/devDependencies no longer list those six packages, and `package-lock.json` is updated.

- [ ] **Step 6: Verify nothing references the removed code**

Run: `npm run typecheck`
Expected: PASS - no references to `@/components/three/*`, `useDeviceTier`, `three`, or `@react-three/*` remain.

- [ ] **Step 7: Full verification suite**

Run, in order:

```bash
npm run lint
npm run test
npm run build
```

Expected: lint clean; all Vitest suites pass (including the 4 existing content/utils/contact tests + the 4 new hero suites); `next build` completes with no "module not found" errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore(hero): delete Three.js stack, deps, and dead device-tier hook

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Visual QA + tuning pass

**Files:** none required (tuning may touch `phases.ts` constants / `render.ts` magic numbers; commit if changed)

- [ ] **Step 1: Run the dev server and watch one full loop**

Run: `npm run dev`, open the home route. Confirm the narrative reads: **field grid → wireframe self-draws → faces fill + edges darken + shadow drops + annotations fade → lume dot blinks on → gentle hold + quarter-turn → re-draft**. No hard cut at the seam.

- [ ] **Step 2: Legibility + composition**

Confirm the left headline and CTAs stay fully legible over the form at ~1280 / 1920 / 2560px widths, the form sits center-right (not under the headline), and there's no horizontal scroll.

- [ ] **Step 3: Reduced motion**

With OS "reduce motion" on (or DevTools emulate `prefers-reduced-motion: reduce`), reload: a single static built+shipped frame renders, no animation, no parallax.

- [ ] **Step 4: Performance / lifecycle**

Confirm (DevTools Performance): the rAF loop pauses when the tab is hidden and when the hero is scrolled off-screen, and resumes without a time jump. Lines are crisp on a HiDPI display (DPR scaling working).

- [ ] **Step 5: Tune + commit if needed**

If timing/feel needs adjustment, edit only the boundary constants in `phases.ts` (`FIELD_END`/`DRAFT_END`/`BUILD_END`/`LIVE_END`/`CYCLE`) and the layout magic numbers in `render.ts` (`scale`/`origin` factors). Re-run `npm run test` (phase invariants must still pass), then:

```bash
git add -A
git commit -m "polish(hero): tune blueprint loop timing and composition

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-review

**Spec coverage:**
- Blueprint→built loop (Field→Draft→Build→Live→Loop) → Task 2 (`phases.ts`) + Task 3 (`render.ts`) ✓
- Abstract isometric layered form → Task 1 (`buildForm`, 3 slabs) ✓
- Canvas 2D, no WebGL → Tasks 3-4 ✓
- Pure `geometry.ts`/`phases.ts` + React shell split → Tasks 1, 2, 4 ✓
- Token-driven colors via `getComputedStyle` → Task 4 (`readColors`) ✓
- One lume "shipped" dot → Task 1 (`SHIPPED_VERTEX_INDEX`) + Task 3 (dot draw) ✓
- Reduced-motion static frame → Task 2 (`STATIC_STATE`) + Task 4 ✓
- Pause off-screen/hidden, DPR scaling → Task 4 ✓
- `aria-hidden` + `pointer-events:none` → Task 4 ✓
- `Hero.tsx` rewire, drop device-tier gate → Task 5 ✓
- Delete `three/` files + 6 deps + `transpilePackages` + dead `useDeviceTier` + README → Task 6 ✓
- Verification (typecheck/lint/test/build) + visual/reduced-motion/perf/a11y QA → Tasks 6-7 ✓

**Placeholder scan:** No TBD/TODO; every code step has complete code; tuning constants in Task 7 are concrete values in Tasks 2-3, not placeholders. ✓

**Type consistency:** `Form`/`Vec2`/`Vec3`/`Face`/`project`/`sortedFaces`/`SHIPPED_VERTEX_INDEX` (geometry) consumed unchanged by render + component; `PhaseState`/`getPhaseState`/`STATIC_STATE`/`easeOutExpo`/`CYCLE` (phases) consumed unchanged by render + component + tests; `BlueprintColors`/`DEFAULT_COLORS`/`renderBlueprint`/`blend` (render) consumed unchanged by component + tests. `renderBlueprint` signature `(ctx, dims, state, form, pointer, colors)` is identical in render.ts, both render tests, and the component call site. ✓
