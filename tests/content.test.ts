import { describe, it, expect } from "vitest";
import { work, featuredWork, getCase, getNextCase } from "@/lib/content/work";
import { services, processPhases } from "@/lib/content/services";

describe("work content invariants", () => {
  it("has at least 6 case studies", () => {
    expect(work.length).toBeGreaterThanOrEqual(6);
  });
  it("slugs are unique and url-safe", () => {
    const slugs = work.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });
  it("has at least 3 featured case studies", () => {
    expect(featuredWork.length).toBeGreaterThanOrEqual(3);
  });
  it("every case has results and a non-empty approach", () => {
    work.forEach((c) => {
      expect(c.results.length).toBeGreaterThan(0);
      expect(c.approach.length).toBeGreaterThan(0);
      expect(c.gallery.length).toBeGreaterThan(0);
    });
  });
  it("getCase resolves and getNextCase cycles", () => {
    expect(getCase("clinic-booking")?.client).toBe("Clinic group");
    expect(getCase("does-not-exist")).toBeUndefined();
    const last = work[work.length - 1].slug;
    expect(getNextCase(last).slug).toBe(work[0].slug);
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
