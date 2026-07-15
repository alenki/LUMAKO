"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { HeroMarker } from "@/components/hero/HeroMarker";
import { splitOnWord } from "@/lib/markWord";
import { copy } from "@/lib/content/copy";
import { easeOutExpo, easeOutSoft } from "@/lib/motion";

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
          {/* Two wide lines - the binding one is "ПОДНИМАЕТ ИМЯ." (~9.17em). The type is
              WIDTH-driven: 9.6vw holds that line at ~0.88 of the content box (a ~5-6% gutter
              on every screen), capped at 210px so ultrawide (>=~2190px) stops growing. It
              stays nowrap down to 760px so the two lines never break; true mobile (<=760px)
              switches to whitespace-normal at a smaller clamp so the long line can wrap on
              the narrowest phones instead of overflowing. */}
          <h1 className="font-display font-extrabold uppercase leading-[0.85] max-[760px]:leading-[0.9] tracking-[-0.05em] whitespace-nowrap text-[length:clamp(46px,9.6vw,210px)] max-[760px]:whitespace-normal max-[760px]:text-[length:clamp(30px,9vw,210px)]">
            {lines.map((line, i) => {
              const isLast = i === lastIdx;
              return (
                // Each line slides up from beneath a clipping mask. The pt/-mt and
                // pb/-mb pairs give the tight leading-[0.85] caps clip headroom
                // without changing the line rhythm (each pad + equal negative margin
                // cancels). The top gets extra room (0.3em) because Cyrillic uppercase
                // accents - the Ё diaeresis, the Й breve - rise ~0.22em above cap
                // height and would otherwise be sliced by overflow-hidden. The marked
                // last line overflows its box (the drawn circle), so once it settles
                // into place we stop clipping it.
                <span
                  key={line}
                  className="block overflow-hidden pt-[0.3em] -mt-[0.3em] pb-[0.1em] -mb-[0.1em]"
                  style={isLast && revealed ? { overflow: "visible" } : undefined}
                >
                  <motion.span
                    className="block will-change-transform"
                    initial={reduce ? false : { y: "130%" }}
                    animate={{ y: "0%" }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.95, ease: easeOutExpo, delay: 0.15 + i * 0.14 }
                    }
                    onAnimationComplete={
                      !reduce && isLast ? () => setRevealed(true) : undefined
                    }
                  >
                    {isLast && marked ? (
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
              );
            })}
          </h1>
        </div>

        {/* lower band: descriptor + CTAs (left), scroll cue (right). At >=481px the cue
            holds the bottom-right corner on the same row as the CTAs. On small phones
            (<=480px) the band stacks so the buttons keep their natural row and the cue
            drops below them, still pinned right (self-end). */}
        <div className="flex items-end justify-between gap-x-10 pb-[clamp(22px,3vw,42px)] max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-y-6">
          <motion.div
            className="max-w-[46ch]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOutSoft, delay: 1.1 }}
          >
            <p className="text-[length:var(--text-xl)] text-fg-body leading-relaxed text-pretty">{hero.sub}</p>
            {/* Below 360px the two CTAs would wrap onto separate rows, so we shrink
                them a touch (max-[360px] only - base stays the locked reference) to
                hold them side by side. */}
            <div className="mt-6 flex flex-wrap gap-3 max-[360px]:gap-2">
              <Button
                href={hero.ctaPrimary.href}
                variant="primary"
                className="max-[360px]:px-4 max-[360px]:py-2.5 max-[360px]:text-[13px]"
              >
                {hero.ctaPrimary.label}
              </Button>
              <Button
                href={hero.ctaSecondary.href}
                variant="ghost"
                className="max-[360px]:px-4 max-[360px]:py-2.5 max-[360px]:text-[13px]"
              >
                {hero.ctaSecondary.label} &rarr;
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="shrink-0 max-[480px]:self-end"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOutSoft, delay: 1.4 }}
          >
            <span className="label-caps flex items-center gap-3">
              Вниз
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
