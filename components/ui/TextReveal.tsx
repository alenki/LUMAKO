"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
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

const word = {
  hidden: { y: "130%" },
  show: { y: 0, transition: { duration: 0.95, ease: easeOutExpo } },
};

/** Editorial word-by-word mask reveal. Each word wipes up from a clipped line.
 *  A literal `\n` in `text` forces a hard line break between word groups. */
export function TextReveal({
  text,
  highlight,
  as = "span",
  className,
  highlightClassName = "italic text-fg",
  delay = 0,
  stagger = 0.06,
}: Props) {
  const Tag = tags[as];
  const lines = text.split("\n");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
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
              <span
                key={i}
                className="inline-flex overflow-hidden align-bottom leading-[1.05] pb-[0.18em] -mb-[0.18em]"
              >
                <motion.span
                  variants={word}
                  className={cn("inline-block", item.hi && highlightClassName)}
                >
                  {item.w}
            {i < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </Fragment>
        );
      })}
    </Tag>
  );
}
