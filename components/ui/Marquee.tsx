"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Seconds per loop. */
  speed?: number;
  reverse?: boolean;
  className?: string;
};

/** Seamless infinite marquee (two identical tracks). Pauses on hover + reduced motion. */
export function Marquee({ children, speed = 36, reverse = false, className }: Props) {
  const style = {
    animationDuration: `${speed}s`,
    animationDirection: reverse ? "reverse" : "normal",
  } as React.CSSProperties;

  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div
        className="marquee-track flex shrink-0 items-center gap-[var(--vw-4)] pr-[var(--vw-4)]"
        style={style}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="marquee-track flex shrink-0 items-center gap-[var(--vw-4)] pr-[var(--vw-4)]"
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
