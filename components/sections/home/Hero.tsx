"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { HeroMarker } from "@/components/hero/HeroMarker";
import { splitOnWord } from "@/lib/markWord";
import { copy } from "@/lib/content/copy";
import { easeOutSoft } from "@/lib/motion";

export function Hero() {
  const { hero } = copy.home;
  const reduce = useReducedMotion() ?? false;
  // When the last line finishes settling into place we trigger the marker draw.
  // Pre-revealed under reduced motion so the circle renders immediately.
  const [revealed, setRevealed] = useState(reduce);

  const { lines, mark } = hero;
  const lastIdx = lines.length - 1;
  const marked = splitOnWord(lines[lastIdx], mark);

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden pt-[var(--header-h)]">
      {/* atmosphere only - the gold circle is the single accent */}
      <div className="glow-accent pointer-events-none absolute inset-0" />
      <div className="noise-veil" />

      <div className="container-x relative z-10 flex flex-1 flex-col">
        {/* headline fills the available height */}
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="font-display font-extrabold uppercase leading-[0.85] max-[760px]:leading-[0.9] tracking-[-0.05em] text-[length:clamp(46px,10.8vw,210px)]">
            {lines.map((line, i) => (
              <span key={line} className="block pb-[0.04em]">
                <motion.span
                  className="inline-block"
                  initial={
                    reduce ? false : { opacity: 0, y: "0.3em", filter: "blur(14px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.85, ease: easeOutSoft, delay: 0.15 + i * 0.14 }
                  }
                  onAnimationComplete={
                    !reduce && i === lastIdx ? () => setRevealed(true) : undefined
                  }
                >
                  {i === lastIdx && marked ? (
                    <>
                      {marked.before}
                      <HeroMarker word={marked.word} draw={revealed} reduce={reduce} />
                      {marked.after}
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* lower band: descriptor + CTAs (left), scroll cue (right) */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pb-[clamp(22px,3vw,42px)]">
          <motion.div
            className="max-w-[46ch]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOutSoft, delay: 1.1 }}
          >
            <p className="text-[length:var(--text-xl)] text-fg-muted text-pretty">{hero.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={hero.ctaPrimary.href} variant="primary">
                {hero.ctaPrimary.label}
              </Button>
              <Button href={hero.ctaSecondary.href} variant="ghost">
                {hero.ctaSecondary.label} &rarr;
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOutSoft, delay: 1.4 }}
          >
            <span className="label-caps flex items-center gap-3">
              Scroll
              <span aria-hidden="true" className="relative h-9 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-fg" />
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
