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
    // Fade the grid in on the first load only; on later cycles the loop phase
    // already leaves it at 1, so hold it there to keep the seam continuous.
    const grid = cycleIndex === 0 ? seg(t, 0, FIELD_END) : 1;
    return state("field", { gridOpacity: grid, rotationTurns: baseTurns });
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
