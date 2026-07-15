import { describe, it, expect } from "vitest";
import { copy } from "@/lib/content/copy";

describe("home hero copy", () => {
  const { hero } = copy.home;

  it("has two non-empty statement lines", () => {
    expect(hero.lines).toHaveLength(2);
    hero.lines.forEach((line) => expect(line.length).toBeGreaterThan(0));
  });

  it("marks a word that appears in the last line", () => {
    expect(hero.mark.length).toBeGreaterThan(0);
    expect(hero.lines[hero.lines.length - 1]).toContain(hero.mark);
  });

  it("has a descriptor and two CTAs pointing at contact and work", () => {
    expect(hero.sub.length).toBeGreaterThan(0);
    expect(hero.ctaPrimary.href).toBe("/contact");
    expect(hero.ctaSecondary.href).toBe("/work");
  });
});
