import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

// next/image needs the Next build runtime; stub it so these stay unit-level.
vi.mock("next/image", () => ({
  default: ({ src, alt = "" }: { src: string; alt?: string }) => (
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
