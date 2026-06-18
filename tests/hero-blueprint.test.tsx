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
