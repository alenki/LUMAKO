import { describe, it, expect } from "vitest";
import { work, featuredWork, disciplines } from "@/lib/content/work";
import { services, processPhases } from "@/lib/content/services";

describe("work content invariants", () => {
  it("has exactly 5 projects", () => {
    expect(work.length).toBe(5);
  });
  it("slugs are unique and url-safe", () => {
    const slugs = work.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });
  it("has at least 3 featured projects", () => {
    expect(featuredWork.length).toBeGreaterThanOrEqual(3);
  });
  it("every project has a cover image, a live link, a summary, and disciplines", () => {
    work.forEach((c) => {
      expect(c.cover).toMatch(/^\/work\/.+\.webp$/);
      expect(c.href).toMatch(/^https:\/\/.+/);
      expect(c.summary.length).toBeGreaterThan(0);
      expect(c.disciplines.length).toBeGreaterThan(0);
    });
  });
  it("the filter list contains only disciplines present in the work", () => {
    const present = new Set(work.flatMap((w) => w.disciplines));
    disciplines.forEach((d) => expect(present.has(d)).toBe(true));
    expect(disciplines).toContain("Web");
  });
});

describe("services content invariants", () => {
  it("has exactly 6 services with unique ids", () => {
    expect(services.length).toBe(6);
    expect(new Set(services.map((s) => s.id)).size).toBe(6);
  });
  it("has 6 ordered process phases", () => {
    expect(processPhases.length).toBe(6);
    expect(processPhases.map((p) => p.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
  });
});
