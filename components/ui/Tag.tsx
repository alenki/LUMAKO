"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Hairline pill. Renders a button when `onClick` is provided (filters), else a span. */
export function Tag({ children, active, onClick, className }: Props) {
  const cls = cn(
    "rounded-full border px-4 py-1.5 font-mono text-[length:var(--text-mono)] uppercase tracking-wider transition-colors duration-300",
    active
      ? "border-accent bg-accent-soft text-fg"
      : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
    className,
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cls}
        data-cursor
      >
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
}
