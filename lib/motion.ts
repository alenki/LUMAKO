import type { Variants } from "motion/react";

/** Signature easing - heavy, expensive expo-out. */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const easeInOutExpo = [0.87, 0, 0.13, 1] as const;
/** Gentle expo-out for reveals - softer deceleration than easeOutExpo, so text
 *  settles into place instead of snapping then crawling. */
export const easeOutSoft = [0.33, 1, 0.68, 1] as const;

/** Default reveal: fade + rise. Use with `custom={index}` for stagger. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.08, ease: easeOutSoft },
  }),
};

/** "Settle into focus" reveal - fade + short rise + de-blur. Smoother and softer
 *  than a hard mask wipe. TextReveal applies the same language per-letter. */
export const focusIn: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutSoft },
  },
};

/** Container that staggers its children's reveal. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Editorial line/word reveal - wipes up from a clipped mask. */
export const maskReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 18 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 1, ease: easeOutExpo },
  },
};

/** Standard whileInView viewport config (reveal once, slightly early). */
export const viewportOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;
