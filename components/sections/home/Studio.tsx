"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TextReveal } from "@/components/ui/TextReveal";
import { easeOutExpo } from "@/lib/motion";
import { copy } from "@/lib/content/copy";

/**
 * The studio section - a full-viewport, type-driven editorial statement. A lead
 * ("Lumako is a full-stack studio"), a small drawn mark, then a wide "what we make"
 * line that carries across at least half the page. Left-indented column, vertically
 * centred in the viewport. Big type, oceans of air. Minimal by design.
 */

const viewport = { once: true, margin: "-15% 0px -15% 0px" } as const;

/** The mark - a drawn hourglass: two ink trapezoids around a single lume diamond
 *  (the section's one sanctioned accent). Strokes draw in on scroll; the gem pops. */
function StudioMark({ reduce }: { reduce: boolean }) {
  const stroke = (delay: number) => ({
    initial: reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport,
    transition: reduce ? { duration: 0 } : { duration: 0.7, ease: easeOutExpo, delay },
  });
  return (
    <svg
      width="40"
      height="50"
      viewBox="0 0 48 60"
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <motion.path
        d="M9 13 L39 13 L33 22 L15 22 Z"
        stroke="var(--color-fg)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        {...stroke(0)}
      />
      <motion.path
        d="M15 38 L33 38 L39 47 L9 47 Z"
        stroke="var(--color-fg)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        {...stroke(0.18)}
      />
      <motion.path
        d="M24 24 L31 30 L24 36 L17 30 Z"
        fill="var(--color-lume)"
        style={{ transformOrigin: "center" }}
        initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={viewport}
        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: easeOutExpo, delay: 0.6 }}
      />
    </svg>
  );
}

export function Studio() {
  const s = copy.home.studio;
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative flex min-h-dvh flex-col justify-center py-[clamp(4rem,12vh,8rem)]">
      <div className="container-x">
        <div className="md:pl-[18vw]">
          {/* the lead - the main headline, scaled up to carry the now type-only section */}
          <TextReveal
            as="h2"
            text={s.lead}
            stagger={0.04}
            className="block max-w-[15ch] font-display text-[length:clamp(3rem,10.5vw,9.75rem)] font-medium leading-[1.0] tracking-[-0.03em] text-balance"
          />

          {/* the mark - the section's single lume accent, set tight to the lines */}
          <div className="mt-6 md:mt-8">
            <StudioMark reduce={reduce} />
          </div>

          {/* the "what we make" statement - same flowing voice a size down. Breaks are
              baked into the copy (see copy.ts) so it sets as three length-balanced lines. */}
          <TextReveal
            as="p"
            text={s.craft}
            delay={0.1}
            stagger={0.028}
            className="mt-6 block max-w-[26ch] font-display text-[length:clamp(2rem,7.5vw,6.75rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
          />
        </div>
      </div>
    </section>
  );
}
