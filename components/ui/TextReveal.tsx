"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { focusIn } from "@/lib/motion";
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
  delay?: number;
  stagger?: number;
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

/** Editorial word-by-word reveal. Each word fades and rises a touch while
 *  resolving from a soft blur - settling into focus rather than snapping up.
 *  A literal `\n` in `text` forces a hard line break between word groups.
 *  Reduced motion renders plain, static text. */
export function TextReveal({
  text,
  highlight,
  as = "span",
  className,
  highlightClassName = "italic text-fg",
  delay = 0,
  stagger = 0.045,
}: Props) {
  const reduce = useReducedMotion() ?? false;
  const Tag = tags[as];
  const lines = text.split("\n");

  // When motion is allowed, the container orchestrates a staggered child reveal;
  // otherwise it renders inert and the words show immediately.
  const container = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, margin: "-10%" },
        variants: {
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        },
      };

  return (
    <Tag className={className} {...container}>
      {lines.map((line, li) => {
        const words: { w: string; hi: boolean }[] = [];
        segment(line, highlight).forEach((seg) => {
          seg.str
            .split(" ")
            .filter(Boolean)
            .forEach((w) => words.push({ w, hi: seg.hi }));
        });
        return (
          <Fragment key={li}>
            {li > 0 && <br />}
            {words.map((item, i) => (
              <Fragment key={i}>
                <motion.span
                  variants={reduce ? undefined : focusIn}
                  className={cn("inline-block", item.hi && highlightClassName)}
                >
                  {item.w}
                </motion.span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </Tag>
  );
}
