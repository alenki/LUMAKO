"use client";

import { motion } from "motion/react";

/** Rough, slightly overshooting hand-drawn loop, in a 370x170 viewBox sized to the word. */
const RING_D =
  "M 30,98 C 26,44 120,20 205,24 C 296,28 350,58 340,96 C 330,134 244,154 158,151 C 74,148 18,120 30,78 C 38,46 96,32 168,30";

/** Slow-in slow-out curve for the pen-drawing feel. */
const DRAW_EASE = [0.5, 0, 0.3, 1] as const;

type HeroMarkerProps = {
  /** The word to encircle (rendered as the visible text). */
  word: string;
  /** Start the draw. Ignored when `reduce` is true (then it renders pre-drawn). */
  draw: boolean;
  /** Reduced-motion: render the circle fully drawn, no animation. */
  reduce: boolean;
};

/**
 * A word wrapped by a single self-drawing gold marker circle - the hero's one
 * lume accent. The SVG is decorative (aria-hidden) and overflows the word box,
 * so the consuming line must not clip it once the circle draws.
 */
export function HeroMarker({ word, draw, reduce }: HeroMarkerProps) {
  const drawn = reduce || draw;
  return (
    <span className="relative inline-block whitespace-nowrap">
      {word}
      <svg
        aria-hidden="true"
        viewBox="0 0 370 170"
        className="absolute"
        style={{
          left: "-9%",
          top: "-26%",
          width: "118%",
          height: "158%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <motion.path
          d={RING_D}
          fill="none"
          stroke="var(--color-lume)"
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.45, ease: DRAW_EASE }}
        />
      </svg>
    </span>
  );
}
