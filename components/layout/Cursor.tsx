"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useCursorEnabled } from "@/lib/mediaHooks";

/**
 * Custom cursor: a precise dot + a lagging ring that grows over interactive
 * elements (anything with [data-cursor] or a/button). Pointer-fine only.
 */
export function Cursor() {
  const enabled = useCursorEnabled();
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const el = e.target as HTMLElement;
      setActive(!!el.closest("a, button, [data-cursor], input, textarea, label"));
    };
    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[400]"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.25s" }}
    >
      <motion.span
        className="absolute -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-fg"
        style={{ x, y }}
      />
      <motion.span
        className="absolute rounded-full border border-fg/40"
        style={{
          x: ringX,
          y: ringY,
          width: active ? 56 : 32,
          height: active ? 56 : 32,
          marginLeft: active ? -28 : -16,
          marginTop: active ? -28 : -16,
          borderColor: active ? "var(--color-fg)" : "rgba(10,10,10,0.35)",
          transition: "width 0.25s, height 0.25s, margin 0.25s, border-color 0.25s",
        }}
      />
    </div>
  );
}
