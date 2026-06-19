"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { easeOutExpo } from "@/lib/motion";
import { copy } from "@/lib/content/copy";

/**
 * The studio section - Lumako's identity + proof moment, sitting between the work
 * gallery and the services overview. Built in the house drafting language: a
 * confident statement, a self-drawing "ledger" rule carrying the two honest
 * count-up numbers and the real receipts, then a two-column manifesto. The single
 * lume register tick on the rule is the only signal color in the section.
 */
export function Studio() {
  const s = copy.home.studio;
  const reduce = useReducedMotion() ?? false;

  // Reveal-on-scroll, once, slightly early - matches the house viewport timing.
  const viewport = { once: true, margin: "-15%" } as const;

  return (
    <section className="section-lg">
      <div className="container-x">
        {/* the statement */}
        <div className="max-w-[19ch]">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <TextReveal
            as="h2"
            text={s.statement}
            highlight={s.highlight}
            className="mt-6 block font-display text-[length:var(--text-6xl)] font-light leading-[1.02] tracking-[-0.02em] text-balance"
          />
        </div>

        {/* the ledger - a drafted, measured record that draws on scroll-in */}
        <div className="mt-16 md:mt-24">
          {/* the rule self-draws left -> right; one lume register tick fades in at the origin */}
          <div className="relative h-px w-full">
            <motion.span
              aria-hidden
              className="absolute inset-0 origin-left bg-[var(--color-line-strong)]"
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={reduce ? { duration: 0 } : { duration: 1.1, ease: easeOutExpo }}
            />
            <motion.span
              aria-hidden
              className="absolute left-0 top-1/2 h-3.5 w-px -translate-y-1/2 bg-[var(--color-lume-deep)]"
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: easeOutExpo, delay: 0.9 }}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-12 md:items-end">
            {/* the two honest numbers */}
            <div className="flex gap-x-10 sm:gap-x-16 md:col-span-7 md:gap-x-24">
              {s.ledger.map((n) => (
                <div key={n.label}>
                  <Counter
                    value={n.value}
                    suffix={n.suffix}
                    className="block font-display font-medium tabular-nums leading-[0.85] tracking-[-0.03em] text-[length:clamp(3rem,6.5vw,5.5rem)]"
                  />
                  <p className="mt-4 label-caps">{n.label}</p>
                </div>
              ))}
            </div>

            {/* the receipts, plotted as register marks */}
            <ul className="space-y-3 md:col-span-4 md:col-start-9">
              {s.receipts.map((r) => (
                <li
                  key={r}
                  className="flex items-baseline gap-3 font-mono text-[length:var(--text-mono)] tracking-wide text-fg-muted"
                >
                  <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-[var(--color-line-strong)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* the manifesto */}
        <Reveal as="div" className="grid-12 mt-16 gap-y-8 md:mt-24">
          <p className="col-span-12 text-[length:var(--text-lg)] text-fg-muted text-pretty md:col-span-5">
            {s.body[0]}
          </p>
          <div className="col-span-12 md:col-span-5 md:col-start-7">
            <p className="text-[length:var(--text-lg)] text-fg-muted text-pretty">{s.body[1]}</p>
            <Link
              href={s.link.href}
              data-cursor
              className="group mt-8 inline-flex items-center gap-2 label-caps transition-colors hover:text-fg"
            >
              {s.link.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
