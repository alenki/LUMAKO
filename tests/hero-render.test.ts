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
