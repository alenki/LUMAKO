"use client";

import { cn } from "@/lib/utils";

type Props = {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** When present, the box turns error-red and the message renders below. */
  error?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Hairline consent checkbox. The `<input>` fills the box (`appearance-none`), so
 * the global `:focus-visible` lume outline lands on the box directly; ink fill on
 * select matches the Tag active state, with a real inline-SVG check revealed via
 * `peer-checked`. The label text (children) may contain a link - give that link
 * `onClick={(e) => e.stopPropagation()}` so opening it doesn't toggle consent.
 */
export function Checkbox({
  name,
  checked,
  onChange,
  error,
  children,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 inline-flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            className={cn(
              "peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[5px] border bg-transparent transition-colors duration-200 checked:border-ink checked:bg-ink",
              error ? "border-error" : "border-line-strong",
            )}
          />
          <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none relative h-3 w-3 scale-50 text-[#fafafa] opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100"
          >
            <path
              d="M2.5 6.2 5 8.5 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <label
          htmlFor={name}
          data-cursor="quiet"
          className="cursor-pointer text-[length:var(--text-base)] leading-relaxed text-fg-body"
        >
          {children}
        </label>
      </div>
      {error ? (
        <span className="mt-2 block label-caps !text-error">{error}</span>
      ) : null}
    </div>
  );
}
