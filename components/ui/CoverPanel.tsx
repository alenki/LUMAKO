import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Intentional gradient placeholder standing in for project / portrait imagery.
 * Neutral gray with grain + a faint grid for depth. Looks designed, never
 * broken — real imagery can be layered in later.
 */
export function CoverPanel({ index, label, className, children }: Props) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[#d8d8d7] rounded-[var(--radius)]", className)}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 75% 15%, rgba(255,255,255,0.55), transparent 48%), linear-gradient(150deg, #e9e9e8 0%, #d6d6d5 55%, #c8c8c7 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="noise-veil" />
      {index ? (
        <span className="absolute left-5 top-4 label-caps !text-fg/55">
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
