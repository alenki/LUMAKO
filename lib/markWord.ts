/**
 * Split a line around the first occurrence of `word`, so the caller can wrap
 * that word in a marker. Returns null when the word is not present (caller then
 * renders the plain line).
 */
export function splitOnWord(
  line: string,
  word: string,
): { before: string; word: string; after: string } | null {
  const idx = line.indexOf(word);
  if (idx === -1) return null;
  return {
    before: line.slice(0, idx),
    word,
    after: line.slice(idx + word.length),
  };
}
