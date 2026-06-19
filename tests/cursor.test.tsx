import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
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

afterEach(() => {
  vi.restoreAllMocks();
  // jsdom has no elementFromPoint; tests that stub it on document clean up here.
  Reflect.deleteProperty(document, "elementFromPoint");
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

  it("shows the 'View' marker disc - and no gold loop - over a data-cursor='view' target", () => {
    const { container, queryByText } = render(
      <>
        <a href="#" data-cursor="view" data-testid="view">Balance</a>
        <Cursor />
      </>,
    );
    // The disc only exists once the pointer reaches a project.
    expect(queryByText("View")).toBeNull();

    fireEvent.mouseMove(container.querySelector("[data-testid='view']")!);

    expect(queryByText("View")).not.toBeNull(); // the disc label
    expect(container.querySelector("path")).toBeNull(); // not the gold loop
  });

  it("catches the View disc when a project scrolls under a still pointer", async () => {
    // Scrolling slides the page under a motionless cursor, so the element beneath
    // it changes with no mousemove. The cursor must re-hit-test on scroll.
    const { container, findByText, queryByText } = render(
      <>
        <a href="#" data-cursor="view" data-testid="view">Balance</a>
        <span data-testid="blank">elsewhere</span>
        <Cursor />
      </>,
    );
    const link = container.querySelector("[data-testid='view']")!;
    const blank = container.querySelector("[data-testid='blank']")!;

    // Pointer comes to rest over empty space - no disc yet.
    fireEvent.mouseMove(blank, { clientX: 20, clientY: 20 });
    expect(queryByText("View")).toBeNull();

    // The page scrolls a project under the (unmoved) pointer.
    document.elementFromPoint = (() => link) as typeof document.elementFromPoint;
    fireEvent.scroll(window);

    expect(await findByText("View")).not.toBeNull();
  });

  it("drops the View disc when the project scrolls out from under a still pointer", async () => {
    const { container, findByText, queryByText } = render(
      <>
        <a href="#" data-cursor="view" data-testid="view">Balance</a>
        <Cursor />
      </>,
    );
    const link = container.querySelector("[data-testid='view']")!;

    // Pointer rests over the project - the disc shows.
    fireEvent.mouseMove(link, { clientX: 20, clientY: 20 });
    expect(await findByText("View")).not.toBeNull();

    // Without moving the pointer, the project scrolls away (empty space beneath now).
    document.elementFromPoint = (() => document.body) as typeof document.elementFromPoint;
    fireEvent.scroll(window);

    await waitFor(() => expect(queryByText("View")).toBeNull(), { timeout: 2000 });
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

  it("anchors the gold loop in document space (scroll offset folded in) so it scrolls glued to the button", () => {
    // The loop layer is absolutely positioned in the page, so its path is drawn
    // at the target's DOCUMENT coordinates - the scroll offset baked into every
    // point. That is what lets the browser scroll the loop in lockstep with the
    // button, with no scroll listener and no smooth-scroll lag.
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
    Object.defineProperty(window, "scrollX", { value: 0, configurable: true });

    try {
      const { container } = render(
        <>
          <a href="#" data-testid="link">Work</a>
          <Cursor />
        </>,
      );
      fireEvent.mouseMove(container.querySelector("[data-testid='link']")!, {
        clientX: 10,
        clientY: 10,
      });

      const d = container.querySelector("path")?.getAttribute("d") ?? "";
      // Path coords alternate x,y; every y sits near the 500px scroll offset (the
      // target's document position), not near 0 (its viewport position).
      const ys = [...d.matchAll(/-?\d+(?:\.\d+)?/g)]
        .map(Number)
        .filter((_, i) => i % 2 === 1);
      expect(ys.length).toBeGreaterThan(0);
      expect(Math.min(...ys)).toBeGreaterThan(450);
    } finally {
      Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    }
  });

  it("returns nothing on a coarse pointer (no custom cursor)", () => {
    mockMedia({ fine: false });
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });
});
