import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Lumako wordmark - capital Inter Tight Medium with a luminous accent period. */
export function Logo({ className }: Props) {
  return (
    <span
      className={cn(
        "font-display tracking-tight text-[length:clamp(1.5rem,1.95vw,2rem)] [font-weight:680] md:font-semibold text-fg select-none",
        className,
      )}
    >
      Lumako<span className="text-lume">.</span>
    </span>
  );
}
