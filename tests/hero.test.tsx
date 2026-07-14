import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { Hero } from "@/components/sections/home/Hero";
import { copy } from "@/lib/content/copy";

// jsdom lacks matchMedia (motion's useReducedMotion needs it).
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }
});

describe("Hero", () => {
  it("renders the full statement, the marked word, and both CTAs", () => {
    const { container, getByRole } = render(<Hero />);

    // Data-driven: the statement lives in lib/content/copy.ts, so copy edits
    // must not strand this test on stale strings.
    const h1 = container.querySelector("h1");
    copy.home.hero.lines.forEach((line) =>
      expect(h1?.textContent).toContain(line),
    );
    expect(h1?.textContent).toContain(copy.home.hero.mark);

    const start = getByRole("link", { name: /начать проект/i });
    expect(start.getAttribute("href")).toBe("/contact");
    const work = getByRole("link", { name: /смотреть работы/i });
    expect(work.getAttribute("href")).toBe("/work");

    const svg = container.querySelector("h1 svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render its own navigation (the layout owns the navbar)", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("nav")).toBeNull();
  });
});
