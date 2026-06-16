"use client";
import { motion, useReducedMotion } from "motion/react";
import { clients } from "@/lib/content/studio";

// fixed positions (top%, left%, rotateDeg) around the panel edges — 6 chips
const SPOTS = [
  { top: "8%", left: "6%", r: -8 },
  { top: "14%", left: "84%", r: 7 },
  { top: "62%", left: "3%", r: 5 },
  { top: "70%", left: "88%", r: -6 },
  { top: "30%", left: "92%", r: 10 },
  { top: "78%", left: "40%", r: -4 },
];

export function LogoChips() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
      {clients.slice(0, SPOTS.length).map((name, i) => {
        const s = SPOTS[i];
        return (
          <motion.span
            key={name}
            className="absolute rounded-2xl bg-[var(--color-surface)] px-4 py-2 text-[length:var(--text-mono)] font-medium tracking-tight text-fg-muted shadow-[var(--shadow-card)]"
            style={{ top: s.top, left: s.left, rotate: `${s.r}deg` }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 * i }}
          >
            {name}
          </motion.span>
        );
      })}
    </div>
  );
}
