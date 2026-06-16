"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { buttonClasses, type ButtonVariant } from "./Button";

type Props = {
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function MagneticButton({
  href,
  variant = "primary",
  className,
  children,
  strength = 0.4,
  onClick,
  type = "button",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 160, damping: 15, mass: 0.1 });

  function handleMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const cls = buttonClasses(variant, className);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        <Link href={href} className={cls} data-cursor>
          {children}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={cls} data-cursor>
          {children}
        </button>
      )}
    </motion.div>
  );
}
