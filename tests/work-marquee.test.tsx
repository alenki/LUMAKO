import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
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
