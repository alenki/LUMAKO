import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Lumako wordmark - capital Inter Tight Medium with a luminous accent period. */
export function Logo({ className }: Props) {
  return (
    <span
      className={cn(
        "font-display tracking-tight text-[length:var(--text-3xl)] font-medium text-fg select-none",
        className,
      )}
    >
      Lumako<span className="text-lume">.</span>
    </span>
  );
}
