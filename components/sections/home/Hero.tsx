"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { HeroFallback } from "@/components/three/HeroFallback";
import { TextReveal } from "@/components/ui/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/content/copy";
import { easeOutExpo } from "@/lib/motion";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function Hero() {
  const tier = useDeviceTier();
  const reduce = useReducedMotion();
  const showCanvas = tier === "high" && !reduce;
  const { hero } = copy.home;

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      <div className="absolute inset-0">
        {showCanvas ? <HeroCanvas /> : <HeroFallback />}
      </div>
      {/* legibility wash + grain over the scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 40%, rgba(10,10,10,0.2), rgba(10,10,10,0.75) 80%)",
        }}
      />
      <div className="noise-veil" />

      <div className="container-x relative z-10 pt-[var(--header-h)]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.4 }}
        >
          <Eyebrow index="01">{hero.eyebrow}</Eyebrow>
        </motion.div>

        <TextReveal
          as="h1"
          text={hero.headline}
          highlight={hero.highlight}
          delay={0.55}
          className="mt-8 block max-w-[20ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.95] tracking-tight text-balance"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 1.1 }}
          className="mt-8 max-w-[46ch] text-[length:var(--text-xl)] text-fg-muted text-pretty"
        >
          {hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 1.25 }}
          className="mt-11 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href={hero.ctaPrimary.href}>
            {hero.ctaPrimary.label}
          </MagneticButton>
          <Button href={hero.ctaSecondary.href} variant="ghost">
            {hero.ctaSecondary.label}
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <span className="flex flex-col items-center gap-3 font-mono text-[length:var(--text-mono)] uppercase tracking-[0.3em] text-fg-dim">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-accent" />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
