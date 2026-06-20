"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { easeOutSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

type Props = {
  text: string;
  /** Substring(s) of `text` to emphasize in italic accent - pass an array to accent more than one phrase. */
  highlight?: string | readonly string[];
  as?: keyof typeof tags;
  className?: string;
  highlightClassName?: string;
  /** Seconds before the first letter begins. */
  delay?: number;
  /** Seconds between each letter's reveal - smaller flows faster. */
  stagger?: number;
  /** Word after which to hug the brand's lume accent period (the "Lumako." wordmark dot). Set once. */
  dotAfter?: string;
};

type Segment = { str: string; hi: boolean };

function segment(text: string, highlight?: string | readonly string[]): Segment[] {
  const phrases = (Array.isArray(highlight) ? highlight : highlight ? [highlight] : [])
    .filter((h) => h && text.includes(h));
  if (phrases.length === 0) return [{ str: text, hi: false }];

  const ranges = phrases
    .map((h) => ({ start: text.indexOf(h), end: text.indexOf(h) + h.length }))
    .sort((a, b) => a.start - b.start);

  const out: Segment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue; // skip overlapping accents
    if (r.start > cursor) out.push({ str: text.slice(cursor, r.start), hi: false });
    out.push({ str: text.slice(r.start, r.end), hi: true });
    cursor = r.end;
  }
  if (cursor < text.length) out.push({ str: text.slice(cursor), hi: false });
  return out.filter((s) => s.str.length > 0);
}

type Word = { chars: string[]; hi: boolean };

/** Flatten a line into whole words (each keeping its accent flag) so letters can
 *  animate individually while words stay unbreakable across line wraps. */
function wordsOf(line: string, highlight?: string | readonly string[]): Word[] {
  const words: Word[] = [];
  for (const seg of segment(line, highlight)) {
    for (const w of seg.str.split(" ")) {
      if (w.length) words.push({ chars: Array.from(w), hi: seg.hi });
    }
  }
  return words;
}

/** Editorial letter-by-letter reveal. Each glyph fades and rises a touch while
 *  resolving from a soft blur, staggered so the line settles as a flowing wave.
 *  A literal `\n` in `text` forces a hard line break between word groups.
 *  The full sentence is exposed to assistive tech; the per-letter spans are not.
 *  Reduced motion renders plain, static text. */
export function TextReveal({
  text,
  highlight,
  as = "span",
  className,
  highlightClassName = "italic text-fg",
  delay = 0,
  stagger = 0.07,
  dotAfter,
}: Props) {
  const reduce = useReducedMotion() ?? false;
  const Tag = tags[as];
  const lines = text.split("\n");

  // Reduced motion: plain static text, accent preserved, no per-letter spans.
  if (reduce) {
    let dotPlaced = false;
    return (
      <Tag className={className}>
        {lines.map((line, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            {segment(line, highlight).map((seg, si) => {
              if (seg.hi) {
                return (
                  <span key={si} className={highlightClassName}>
                    {seg.str}
                  </span>
                );
              }
              const at = dotAfter && !dotPlaced ? seg.str.indexOf(dotAfter) : -1;
              if (at === -1) return <Fragment key={si}>{seg.str}</Fragment>;
              dotPlaced = true;
              const end = at + dotAfter!.length;
              return (
                <Fragment key={si}>
                  {seg.str.slice(0, end)}
                  <span className="text-lume">.</span>
                  {seg.str.slice(end)}
                </Fragment>
              );
            })}
          </Fragment>
        ))}
      </Tag>
    );
  }

  const letter: Variants = {
    hidden: { opacity: 0, y: "0.3em", filter: "blur(8px)" },
    show: (i: number) => {
      const at = delay + i * stagger;
      return {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.78,
          ease: easeOutSoft,
          delay: at,
          // Sharpen fast so only the 1-2 leading letters read as blurred,
          // while the fade + rise still settles slowly behind them.
          filter: { duration: 0.14, ease: easeOutSoft, delay: at },
        },
      };
    },
  };

  // One running index across every line so the cascade flows continuously.
  let i = 0;
  // The lume wordmark dot is placed once, after the first matching word.
  let dotPlaced = false;

  return (
    <Tag
      aria-label={lines.join(" ")}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
    >
      {/* aria-hidden wrapper keeps the decorative letters out of the a11y tree;
          the reveal still reaches each glyph via motion's variant context. */}
      <span aria-hidden="true">
        {lines.map((line, li) => {
          const words = wordsOf(line, highlight);
          return (
            <Fragment key={li}>
              {li > 0 && <br />}
              {words.map((word, wi) => {
                const showDot =
                  !!dotAfter && !dotPlaced && word.chars.join("") === dotAfter;
                if (showDot) dotPlaced = true;
                return (
                  <Fragment key={wi}>
                    {/* dot stays inside the word wrapper so it hugs the last glyph, no gap */}
                    <span className="inline-block whitespace-nowrap">
                      {word.chars.map((ch, ci) => (
                        <motion.span
                          key={ci}
                          variants={letter}
                          custom={i++}
                          className={cn("inline-block", word.hi && highlightClassName)}
                        >
                          {ch}
                        </motion.span>
                      ))}
                      {showDot && (
                        <motion.span
                          variants={letter}
                          custom={i++}
                          className="inline-block text-lume"
                        >
                          .
                        </motion.span>
                      )}
                    </span>
                    {wi < words.length - 1 ? " " : null}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </span>
    </Tag>
  );
}
