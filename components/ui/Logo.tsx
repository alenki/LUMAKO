import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Lumako wordmark — lowercase Fraunces with a luminous accent period. */
export function Logo({ className }: Props) {
  return (
    <span
      className={cn(
        "font-display lowercase tracking-tight text-[length:var(--text-2xl)] font-medium text-fg select-none",
        className,
      )}
    >
      lumako
      <span className="text-accent">.</span>
    </span>
  );
}
