import { describe, it, expect } from "vitest";
import { splitOnWord } from "@/lib/markWord";

describe("splitOnWord", () => {
  it("splits a line into before / word / after around the first match", () => {
    expect(splitOnWord("Yours won't.", "won't")).toEqual({
      before: "Yours ",
      word: "won't",
      after: ".",
    });
  });

  it("returns null when the word is absent", () => {
    expect(splitOnWord("Yours win.", "won't")).toBeNull();
  });
});
