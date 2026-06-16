"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  as?: "input" | "textarea";
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
};

/** Hairline-underline form field with mono label + accent focus. */
export function Field({
  label,
  name,
  value,
  onChange,
  as = "input",
  type = "text",
  placeholder,
  required,
  error,
  className,
}: Props) {
  const fieldCls = cn(
    "mt-3 w-full bg-transparent border-b py-3 text-[length:var(--text-xl)] text-fg outline-none transition-colors duration-300 placeholder:text-fg-dim focus:border-accent",
    error ? "border-spark" : "border-line",
    as === "textarea" && "min-h-36 resize-none",
  );

  return (
    <label className={cn("block", className)}>
      <span className="font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-fg-muted">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={fieldCls}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={fieldCls}
        />
      )}
      {error ? (
        <span className="mt-2 block font-mono text-[length:var(--text-mono)] text-spark">
          {error}
        </span>
      ) : null}
    </label>
  );
}
