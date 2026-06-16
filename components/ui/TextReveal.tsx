"use client";

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
  /** Substring of `text` to emphasize in italic accent (e.g. the hero highlight). */
  highlight?: string;
  as?: keyof typeof tags;
  className?: string;
  highlightClassName?: string;
  delay?: number;
  stagger?: number;
};

type Segment = { str: string; hi: boolean };

function segment(text: string, highlight?: string): Segment[] {
  if (!highlight || !text.includes(highlight)) return [{ str: text, hi: false }];
  const i = text.indexOf(highlight);
  return [
    { str: text.slice(0, i), hi: false },
    { str: highlight, hi: true },
    { str: text.slice(i + highlight.length), hi: false },
  ].filter((s) => s.str.length > 0);
}

const word = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.95, ease: easeOutExpo } },
};

/** Editorial word-by-word mask reveal. Each word wipes up from a clipped line. */
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
  const segments = segment(text, highlight);
  const words: { w: string; hi: boolean }[] = [];
  segments.forEach((seg) => {
    seg.str
      .split(" ")
      .filter(Boolean)
      .forEach((w) => words.push({ w, hi: seg.hi }));
  });

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
      {words.map((item, i) => (
        <span
          key={i}
          className="inline-flex overflow-hidden align-bottom leading-[1.05]"
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
    </Tag>
  );
}
