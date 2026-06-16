"use client";

import { MotionConfig } from "motion/react";

/** Global motion config — honors the user's reduced-motion preference everywhere. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
