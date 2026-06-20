import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";
import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";
import { SelectedWork } from "@/components/sections/home/SelectedWork";

// next/image needs the Next build runtime; stub it so these stay unit-level.
vi.mock("next/image", () => ({
  default: ({ src, alt = "" }: { src: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- intentional test stub for next/image
    <img src={src} alt={alt} />
  ),
}));

const ITEM: CaseStudy = {
  slug: "balance-coffee",
  title: "Balance Coffee",
  client: "Specialty coffee & roaster",
  sector: "Concept site",
  year: "2025",
  disciplines: ["Web", "Brand"],
  accent: "#a1957e",
  cover: "/work/balance-coffee.webp",
  coverPosition: "center",
  href: "https://balancecoffee.netlify.app/",
  featured: true,
  summary: "A warm, editorial site.",
};

describe("WorkSlide", () => {
  it("links out to the live site in a new tab, with the view cursor", () => {
    const { container } = render(<WorkSlide item={ITEM} />);
    const a = container.querySelector("a")!;
    expect(a.getAttribute("href")).toBe(ITEM.href);
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
    expect(a.getAttribute("data-cursor")).toBe("view");
    expect(a.getAttribute("aria-label")).toContain("opens the live site");
  });

  it("shows the project name and a chip per discipline (no client/sector or year)", () => {
    const { container } = render(<WorkSlide item={ITEM} />);
    expect(container.querySelector("h3")?.textContent).toBe("Balance Coffee");
    const chips = [...container.querySelectorAll("span")].map((s) => s.textContent);
    expect(chips).toContain("Web");
    expect(chips).toContain("Brand");
    // sparse: the rich card's metadata must not appear
    expect(container.textContent).not.toContain("Concept site");
    expect(container.textContent).not.toContain("2025");
  });
});

describe("WorkMarquee", () => {
  it("renders every project once in the real (non-clone) track", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    const titles = [...real.querySelectorAll("h3")].map((h) => h.textContent);
    expect(titles.length).toBe(work.length);
    work.forEach((item) => expect(titles).toContain(item.title));
  });

  it("links each real card to its live href in document order", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    const links = [...real.querySelectorAll("a")];
    expect(links.length).toBe(work.length);
    links.forEach((a, i) => expect(a.getAttribute("href")).toBe(work[i].href));
  });

  it("keeps the clone out of SR + tab order, but hit-testable (aria-hidden + tabindex, NOT inert)", () => {
    const { container } = render(<WorkMarquee items={work} />);
    expect(container.querySelectorAll(".marquee-track").length).toBe(2);
    const clone = container.querySelector("[data-marquee-clone]")!;
    expect(clone.getAttribute("aria-hidden")).toBe("true");
    // NOT inert: inert blocks pointer hit-testing, which kills the hover cursor
    // on clone cards once the rail scrolls them into view.
    expect(clone.hasAttribute("inert")).toBe(false);
    // Clone links are pulled out of the tab order; the real cards stay tabbable.
    clone.querySelectorAll("a").forEach((a) => expect(a.tabIndex).toBe(-1));
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    real.querySelectorAll("a").forEach((a) => expect(a.tabIndex).not.toBe(-1));
  });

  it("gives each track an animation-duration inline (the .marquee-track class sets none)", () => {
    const { container } = render(<WorkMarquee items={work} />);
    const tracks = [...container.querySelectorAll<HTMLElement>(".marquee-track")];
    tracks.forEach((t) => expect(t.style.animationDuration).not.toBe(""));
  });
});

describe("WorkMarquee glide-on-hover spotlight", () => {
  // Fine pointer + motion allowed -> the JS glide + re-hit-test path is active.
  function mockHoverMedia() {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("hover: hover"), // reduced-motion query -> false
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  }

  // Drive requestAnimationFrame by hand so we can advance the rail one frame at a
  // time. CoverPanel is static (no rAF of its own), so the only caller is the
  // marquee's own sample loop.
  function manualFrames() {
    let next: FrameRequestCallback | null = null;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      next = cb;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    return () => {
      const cb = next;
      next = null;
      cb?.(0);
    };
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    // jsdom has no elementFromPoint; tests stub it on document - clean up here.
    Reflect.deleteProperty(document, "elementFromPoint");
  });

  it("hands the spotlight to JS (.js-hover-active) when the glide path is live", () => {
    mockHoverMedia();
    manualFrames();
    const { container } = render(<WorkMarquee items={work} />);
    expect(
      container.querySelector(".work-marquee")?.classList.contains("js-hover-active"),
    ).toBe(true);
  });

  it("keeps only the card under a still pointer lit as the rail glides (the bug)", () => {
    mockHoverMedia();
    const step = manualFrames();

    const { container } = render(<WorkMarquee items={work} />);
    const root = container.querySelector<HTMLElement>(".work-marquee")!;
    const cards = [
      ...container.querySelectorAll<HTMLAnchorElement>(
        ".marquee-track:not([data-marquee-clone]) a",
      ),
    ];
    expect(cards.length).toBeGreaterThan(1);

    // Pointer comes to rest over the first card.
    document.elementFromPoint = (() => cards[0]) as typeof document.elementFromPoint;
    fireEvent.pointerEnter(root, { clientX: 120, clientY: 100 });
    step();
    expect(cards[0].classList.contains("is-hovered")).toBe(true);

    // The rail glides a DIFFERENT card under the SAME, unmoved pointer.
    document.elementFromPoint = (() => cards[1]) as typeof document.elementFromPoint;
    step();
    expect(cards[1].classList.contains("is-hovered")).toBe(true);
    // The card that glided away drops its highlight - exactly what was stuck before.
    expect(cards[0].classList.contains("is-hovered")).toBe(false);

    // A gap slides under the pointer: nothing in the rail is lit.
    document.elementFromPoint = (() => document.body) as typeof document.elementFromPoint;
    step();
    expect(cards.some((c) => c.classList.contains("is-hovered"))).toBe(false);

    // Leaving the rail clears the spotlight outright.
    document.elementFromPoint = (() => cards[0]) as typeof document.elementFromPoint;
    step();
    expect(cards[0].classList.contains("is-hovered")).toBe(true);
    fireEvent.pointerLeave(root);
    expect(cards.some((c) => c.classList.contains("is-hovered"))).toBe(false);
  });

  it("pokes the custom cursor to re-hit-test on each glide frame", () => {
    mockHoverMedia();
    const step = manualFrames();
    const recheck = vi.fn();
    window.addEventListener("lumako:hover-recheck", recheck);
    try {
      const { container } = render(<WorkMarquee items={work} />);
      const root = container.querySelector<HTMLElement>(".work-marquee")!;
      document.elementFromPoint = (() =>
        container.querySelector("a")) as typeof document.elementFromPoint;
      fireEvent.pointerEnter(root, { clientX: 40, clientY: 40 });
      step();
      expect(recheck).toHaveBeenCalled();
    } finally {
      window.removeEventListener("lumako:hover-recheck", recheck);
    }
  });
});

describe("SelectedWork", () => {
  it("drops the section header and the view-all link (marquee only)", () => {
    const { container, queryByRole } = render(<SelectedWork />);
    expect(container.querySelector("h2")).toBeNull();
    expect(queryByRole("link", { name: /view all work/i })).toBeNull();
  });

  it("mounts the marquee with all projects (no static grid)", () => {
    const { container } = render(<SelectedWork />);
    expect(container.querySelector(".work-marquee")).not.toBeNull();
    const real = container.querySelector(".marquee-track:not([data-marquee-clone])")!;
    expect(real.querySelectorAll("h3").length).toBe(work.length);
  });
});
