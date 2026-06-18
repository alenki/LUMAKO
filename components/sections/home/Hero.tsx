"use client";

import { motion } from "motion/react";
import { HeroBlueprint } from "@/components/hero/HeroBlueprint";
import { TextReveal } from "@/components/ui/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/content/copy";
import { easeOutExpo } from "@/lib/motion";

export function Hero() {
  const { hero } = copy.home;

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      {/* white legibility wash behind the scene - the lume glow lives only in the footer */}
      <div className="glow-accent pointer-events-none absolute inset-0" />
      <div className="absolute inset-0">
        <HeroBlueprint />
      </div>
      {/* legibility wash + grain over the scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 40%, rgba(255,255,255,0), rgba(255,255,255,0.45) 80%)",
        }}
      />
      <div className="noise-veil" />

      <div className="container-x relative z-10 pt-[var(--header-h)]">
        <div className="grid-12 items-end gap-y-10">
          {/* LEFT column - headline + CTAs */}
          <div className="col-span-12 md:col-span-7">
            <TextReveal
              as="h1"
              text={hero.headline}
              highlight={hero.highlight}
              delay={0.55}
              className="block max-w-[22ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.95] tracking-tight text-balance"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 1.25 }}
              className="mt-11 flex flex-wrap items-center gap-4"
            >
              <MagneticButton href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
              </MagneticButton>
              <Button href={hero.ctaSecondary.href} variant="lume">
                {hero.ctaSecondary.label}
              </Button>
            </motion.div>
          </div>

          {/* RIGHT column - eyebrow + supporting paragraph */}
          <div className="col-span-12 md:col-start-9 md:col-span-4 order-first md:order-none">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.4 }}
            >
              <Eyebrow index="01">{hero.eyebrow}</Eyebrow>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 1.1 }}
              className="mt-8 max-w-[46ch] text-[length:var(--text-xl)] text-fg-muted text-pretty"
            >
              {hero.sub}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <span className="label-caps flex flex-col items-center gap-3">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-fg" />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
