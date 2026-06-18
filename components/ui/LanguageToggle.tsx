"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** Supported locale keys for the language toggle. Exhaustive for now - extend if a third locale is added. */
export type Locale = "en" | "ar";

const OPTIONS: ReadonlyArray<{
  value: Locale;
  label: string;
  lang?: "ar";
  dir?: "rtl";
}> = [
  { value: "en", label: "EN" },
  { value: "ar", label: "عربي", lang: "ar", dir: "rtl" },
];

export function LanguageToggle({
  value,
  onChange,
  className,
}: {
  value: Locale;
  onChange: (next: Locale) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "flex items-center gap-2 text-[length:var(--text-base)] font-medium",
        className,
      )}
    >
      {OPTIONS.map((opt, i) => (
        <Fragment key={opt.value}>
          {i > 0 && (
            <span aria-hidden="true" className="select-none text-fg-dim">
              /
            </span>
          )}
          <button
            type="button"
            data-cursor
            lang={opt.lang}
            dir={opt.dir}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "transition-colors duration-300",
              value === opt.value ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {opt.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
