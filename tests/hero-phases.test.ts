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

  it("keeps gridOpacity continuous across the loop seam (no pop)", () => {
    const before = getPhaseState(CYCLE - 0.001).gridOpacity; // end of loop → ~1
    const after = getPhaseState(CYCLE).gridOpacity; // start of next field
    expect(Math.abs(after - before)).toBeLessThan(0.02);
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
