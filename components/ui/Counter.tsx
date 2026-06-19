"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { easeOutExpo } from "@/lib/motion";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `value` once scrolled into view. */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // Inset only vertically (house convention): a horizontal inset would leave a
  // left/right dead-zone where an element near the gutter never registers in view.
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion() ?? false;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Respect reduced motion: duration 0 settles on the final value instantly
    // (via onUpdate), so there is no visible count-up.
    const controls = animate(0, value, {
      duration: reduce ? 0 : 1.6,
      ease: easeOutExpo,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
