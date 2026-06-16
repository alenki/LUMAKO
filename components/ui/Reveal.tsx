"use client";

import { motion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  figure: motion.figure,
} as const;

type Props = {
  children: React.ReactNode;
  /** Stagger position (multiplied into a small delay). */
  index?: number;
  className?: string;
  as?: keyof typeof tags;
};

/** Fade + rise reveal, triggered once when scrolled into view. */
export function Reveal({ children, index = 0, className, as = "div" }: Props) {
  const Tag = tags[as];
  return (
    <Tag
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </Tag>
  );
}
