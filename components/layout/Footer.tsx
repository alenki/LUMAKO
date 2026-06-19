"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { site } from "@/lib/content/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
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

  return (
    <footer className="relative overflow-hidden bg-bg pb-0 pt-[var(--py-section-lg)]">
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
            wordmark anchored to and bleeding off the bottom edge (footer clips it). */}
        <div className="relative mt-[var(--vw-4)]">
          <div className="mb-[var(--vw-2)] flex justify-end min-[1700px]:absolute min-[1700px]:inset-x-0 min-[1700px]:bottom-[12%] min-[1700px]:z-10 min-[1700px]:mb-0">
            <a href={`mailto:${site.email}`} data-cursor className={linkClass}>
              {site.email}
            </a>
          </div>
          <div className="ml-[calc(var(--vw-2)*-1)] [transform:translateY(0.1em)]">
            <motion.span
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
