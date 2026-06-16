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
    "rounded-full border px-4 py-1.5 label-caps transition-colors duration-300",
    active
      ? "border-ink bg-ink text-[#fafafa]"
      : "border-line hover:border-line-strong hover:!text-fg",
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
