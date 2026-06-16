"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { easeOutExpo, easeInOutExpo } from "@/lib/motion";

/** Content fade/rise on each route change. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.main
      key={pathname}
      id="main"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.15 }}
    >
      {children}
    </motion.main>
  );
}

/** Ink curtain that retracts upward to reveal each new route. */
export function RouteCurtain() {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[350] origin-top bg-ink"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.8, ease: easeInOutExpo }}
    />
  );
}
