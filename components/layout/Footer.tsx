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

// Socials + email share this (weight is set per-use: socials bold, email medium).
// Size is the locked >=1700 reference (text-2xl); below 1700 they step down to text-xl
// so they sit quieter against the monumental wordmark.
const linkClass =
  "w-fit uppercase tracking-[0.18em] text-[length:var(--text-2xl)] max-[1699px]:text-[length:var(--text-xl)] text-fg";

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
        {/* Socials - right-aligned column on wide screens; at 800 and under the whole
            footer recomposes into a centered stack (socials row, email, wordmark), so
            here they become a centered wrapping row, dropped down (mt) and bolded so they
            anchor the lower composition rather than float at the top. */}
        <nav aria-label="Социальные сети" className="flex flex-col items-end gap-2 max-[801px]:mt-[calc(var(--vw)*10)] max-[801px]:flex-row max-[801px]:flex-wrap max-[801px]:items-center max-[801px]:justify-center max-[801px]:gap-x-8 max-[801px]:gap-y-2">
          {site.socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className={`${linkClass} font-bold`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Closing signature - on wide screens the email is pinned into the
            bottom-right pocket the wordmark leaves open (absolute, just past the dot),
            with the monumental wordmark anchored to and bleeding off the bottom edge
            (footer clips it). This pocket holds from the >=1700 ("2k") reference down to
            801. Two things keep the email clear of the wordmark's dot across that range:
            below 1700 the email steps down to text-xl and the wordmark bleeds flush-left,
            and below 1024 the wordmark itself shrinks (see its font-size) - the dot would
            otherwise grow into the right-pinned email around 950. At 800 and under the
            footer recomposes into a centered stack: socials become a bold centered row
            dropped down (mt), the email is centered in normal flow with the gap opened up
            (vw-8) to separate it from the socials (phones ease back to vw-5), and the
            wordmark centers and fills the width.
            Note the breakpoint pairing: Tailwind v4 max-[N] is strictly < N, so the
            centered side uses max-[801px] (= <=800) to *include* 800, while the pocket
            uses min-[801px] (= >=801) - together they tile 800|801 with no 1px dead zone.
            Spacing BASE values are the >=1700 reference (locked, do not retune); narrower
            widths only override via max-[...] variants, which never apply at >=1700 so the
            reference can't drift. (Keep these as arbitrary min-[]/max-[] variants only -
            mixing min-[801px]: with a named breakpoint like sm: is unreliable: Tailwind
            orders the arbitrary min-[] variant before sm:, so sm: would win and grow the
            reference.) */}
        <div className="relative mt-[var(--vw-4)] max-[801px]:mt-[var(--vw-8)] max-[639px]:mt-[var(--vw-5)]">
          <div className="mb-[var(--vw-3)] flex justify-end max-[801px]:justify-center min-[801px]:absolute min-[801px]:inset-x-0 min-[801px]:bottom-[12%] min-[801px]:z-10 min-[801px]:mb-0">
            <a
              href={`mailto:${site.email}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="quiet"
              className={`${linkClass} font-medium`}
            >
              {site.email}
            </a>
          </div>
          {/* Wordmark bleeds left. >=1700 keeps the locked -vw-2 nudge; 800-1699 cancels
              the left gutter so it hugs the left like it bleeds off the bottom (side bearing
              keeps the L clear of the clip). At 800 and under it cancels BOTH gutters
              (full-bleed) and centers (text-center on the span) so the wordmark fills the
              full viewport width edge to edge. */}
          <div className="ml-[calc(var(--vw-2)*-1)] max-[1699px]:ml-[calc(var(--gutter)*-1)] max-[801px]:mr-[calc(var(--gutter)*-1)] [transform:translateY(0.1em)]">
            <motion.span
              ref={wordmarkRef}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              // The wordmark is the last thing on the page, so a negative bottom
              // viewport margin would park it in a dead zone and never fire. Trigger
              // on a fraction of it being visible instead.
              viewport={{ once: true, amount: 0.2 }}
              variants={wordmarkReveal}
              // Size: base clamp(3rem,20vw,27rem) is the locked reference. Across the
              // 801-1023 pocket range it shrinks via calc(26vw - 3.84rem) - a steeper
              // ramp offset so it equals 20vw exactly at 1024 (continuous, no jump),
              // which pulls the dot left enough for the bottom-pinned email to clear it.
              // At 800 and under it grows to 25vw and centers in the full-bleed wrapper
              // (Lumako. is ~3.8em wide), filling the viewport edge to edge. 25vw is sized
              // so the visible text spans the full width while the lume dot's trailing
              // advance absorbs the overflow - a larger ramp crops the dot at the edge.
              className="block select-none font-display font-semibold leading-[0.8] tracking-[-0.04em] text-fg [font-size:clamp(3rem,20vw,27rem)] min-[801px]:max-[1023px]:[font-size:clamp(3rem,calc(26vw_-_3.84rem),27rem)] max-[801px]:[font-size:clamp(3rem,25vw,27rem)] max-[801px]:text-center"
            >
              Lumako<span className="text-lume -ml-[0.05em]">.</span>
            </motion.span>
          </div>
        </div>
      </div>
    </footer>
  );
}
