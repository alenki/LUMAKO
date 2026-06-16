import { cn } from "@/lib/utils";

type Props = {
  accent?: string;
  index?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Intentional gradient placeholder standing in for project / portrait imagery.
 * Tinted by the item's accent, with grain + a faint grid for depth. Looks
 * designed, never broken — real imagery can be layered in later.
 */
export function CoverPanel({ accent = "#3080ff", index, label, className, children }: Props) {
  return (
    <div
      className={cn("relative overflow-hidden bg-card", className)}
      style={{
        backgroundImage: `radial-gradient(110% 110% at 72% 18%, ${accent}55, transparent 55%), linear-gradient(155deg, ${accent}22, #0a0a0a 72%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="noise-veil" />
      {index ? (
        <span className="absolute left-5 top-4 font-mono text-[length:var(--text-mono)] tracking-widest text-fg/55">
          {index}
        </span>
      ) : null}
      {label ? (
        <span className="absolute bottom-5 left-5 right-5 font-display text-[length:var(--text-3xl)] font-light leading-tight text-fg/90">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
