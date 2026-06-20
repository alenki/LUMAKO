"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import { site } from "@/lib/content/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { setFooterInView } from "@/lib/footerInView";
import { easeOutExpo } from "@/lib/motion";

/** Monumental closing wordmark settles up from a soft blur as it scrolls in. */
const wordmarkReveal: Variants = {
  hidden: { opacity: 0, y: "0.14em", filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

const linkClass =
  "w-fit font-medium uppercase tracking-[0.18em] text-[length:var(--text-2xl)] text-fg";

export function Footer() {
  const reduce = useReducedMotion() ?? false;

  // Tell the nav when the monumental wordmark is approaching. The positive bottom
  // margin grows the viewport downward, so this fires a touch before the wordmark
  // actually reveals - giving the nav time to fade its own wordmark out first.
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const wordmarkInView = useInView(wordmarkRef, { margin: "0px 0px 25% 0px" });

  useEffect(() => {
    setFooterInView(wordmarkInView);
    return () => setFooterInView(false);
  }, [wordmarkInView]);

  return (
    <footer className="relative overflow-hidden bg-bg pb-0 pt-[var(--py-section-lg)] max-[1023px]:pt-[var(--py-section)]">
      <div className="container-x">
        {/* Socials - top right */}
        <nav aria-label="Social" className="flex flex-col items-end gap-2">
          {site.socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className={linkClass}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Closing signature - email pinned to the absolute bottom-right on wide
            screens (where the wordmark leaves a right column), then the monumental
            wordmark anchored to and bleeding off the bottom edge (footer clips it).
            Spacing: the BASE values are the >=1700 ("2k") reference (locked, do not
            retune); sub-1700 widths only override via max-[...] variants - which never
            apply at >=1700, so the reference can't drift. (Mixing min-[1700px]: with a
            named breakpoint like sm: is unreliable here: Tailwind orders the arbitrary
            min-[] variant before sm:, so sm: would win at 2k and grow the reference.)
            Below 1700 the gap opens up (vw-8) so the email separates from the socials
            and drops down beside the wordmark, recreating the 2k top->bottom spread;
            on phones it eases back to vw-5 to stay cohesive. */}
        <div className="relative mt-[var(--vw-4)] max-[1699px]:mt-[var(--vw-8)] max-[639px]:mt-[var(--vw-5)]">
          <div className="mb-[var(--vw-2)] flex justify-end min-[1700px]:absolute min-[1700px]:inset-x-0 min-[1700px]:bottom-[12%] min-[1700px]:z-10 min-[1700px]:mb-0">
            <a
              href={`mailto:${site.email}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="quiet"
              className={linkClass}
            >
              {site.email}
            </a>
          </div>
          <div className="ml-[calc(var(--vw-2)*-1)] [transform:translateY(0.1em)]">
            <motion.span
              ref={wordmarkRef}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              // The wordmark is the last thing on the page, so a negative bottom
              // viewport margin would park it in a dead zone and never fire. Trigger
              // on a fraction of it being visible instead.
              viewport={{ once: true, amount: 0.2 }}
              variants={wordmarkReveal}
              className="block select-none font-display font-semibold leading-[0.8] tracking-[-0.04em] text-fg [font-size:clamp(3rem,20vw,27rem)]"
            >
              Lumako<span className="text-lume -ml-[0.05em]">.</span>
            </motion.span>
          </div>
        </div>
      </div>
    </footer>
  );
}
