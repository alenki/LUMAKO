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
