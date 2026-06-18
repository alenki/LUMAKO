import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Cursor } from "@/components/layout/Cursor";

/** Mock matchMedia for a given pointer/motion profile. jsdom lacks it. */
function mockMedia({ fine }: { fine: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: q.includes("pointer: fine") ? fine : false, // reduced-motion -> false
    media: q,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  document.documentElement.classList.remove("has-cursor");
  mockMedia({ fine: true });
});

describe("Cursor", () => {
  it("renders a decorative, non-interactive overlay when enabled", () => {
    const { container } = render(<Cursor />);
    const layer = container.querySelector("[aria-hidden]");
    expect(layer).not.toBeNull();
    expect(layer?.className).toContain("pointer-events-none");
    // Marks the document so global CSS hides the native cursor.
    expect(document.documentElement.classList.contains("has-cursor")).toBe(true);
  });

  it("shows the precise nib but draws no gold loop at rest", () => {
    const { container } = render(<Cursor />);
    expect(container.querySelector("circle")).not.toBeNull(); // the reticle nib
    expect(container.querySelector("path")).toBeNull(); // no loop until hover
  });

  it("inverts against the backdrop (mix-blend difference) so it stays visible on dark areas", () => {
    const { container } = render(<Cursor />);
    const reticle = container.querySelector("circle")?.closest("svg");
    expect(reticle?.style.mixBlendMode).toBe("difference");
  });

  it("draws a gold marker loop when the pointer reaches a clickable target", () => {
    const { container } = render(
      <>
        <a href="#" data-testid="link">Work</a>
        <Cursor />
      </>,
    );
    fireEvent.mouseMove(container.querySelector("[data-testid='link']")!);

    const loop = container.querySelector("path");
    expect(loop).not.toBeNull();
    // The annotation is the brand's single lume signal.
    expect(loop?.getAttribute("stroke")).toContain("lume");
  });

  it("keeps the plain reticle - no gold loop - over a data-cursor='quiet' target", () => {
    const { container } = render(
      <>
        <a href="#" data-cursor="quiet" data-testid="quiet">Work</a>
        <Cursor />
      </>,
    );
    fireEvent.mouseMove(container.querySelector("[data-testid='quiet']")!);

    expect(container.querySelector("path")).toBeNull(); // opted out of the loop
    expect(container.querySelector("circle")).not.toBeNull(); // reticle stays
  });

  it("returns nothing on a coarse pointer (no custom cursor)", () => {
    mockMedia({ fine: false });
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });
});
