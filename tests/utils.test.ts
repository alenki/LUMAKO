import { describe, it, expect } from "vitest";
import { cn, clamp, lerp, mapRange } from "@/lib/utils";

describe("cn", () => {
  it("merges and dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("drops falsy values", () => {
    expect(cn("text-fg", false && "hidden", "font-mono")).toBe(
      "text-fg font-mono",
    );
  });
});

describe("math helpers", () => {
  it("clamps to range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
  it("lerps", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
  it("maps ranges", () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });
});
