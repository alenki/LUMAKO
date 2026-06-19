import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  className?: string;
  children?: React.ReactNode;
  /** Real cover image (public path). When set, it renders over the gradient. */
  src?: string;
  alt?: string;
  /** Brand tone shown as the load-in background behind the image. */
  tint?: string;
  /** CSS object-position for the image crop (defaults to "center"). */
  position?: string;
  /** Aspect ratio (width / height) for the panel. Defaults to 16/9. */
  ratio?: number;
  /** Eager-load for above-the-fold covers. */
  priority?: boolean;
};

/**
 * Cover surface for project / portrait imagery. With `src` it renders a real
 * next/image over a brand-tinted backdrop; without one it falls back to the
 * intentional gradient placeholder (grain + faint grid) - used for portraits
 * that have no photo yet. Looks designed either way, never broken.
 */
export function CoverPanel({
  label,
  className,
  children,
  src,
  alt,
  tint,
  position,
  ratio,
  priority,
}: Props) {
  const overImage = Boolean(src);
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#d8d8d7] rounded-[var(--radius)]",
        className,
      )}
      style={{
        aspectRatio: ratio ?? 16 / 9,
        backgroundColor: tint,
        backgroundImage: overImage
          ? undefined
          : `radial-gradient(120% 100% at 75% 15%, rgba(255,255,255,0.55), transparent 48%), linear-gradient(150deg, #e9e9e8 0%, #d6d6d5 55%, #c8c8c7 100%)`,
      }}
    >
      {overImage ? (
        <Image
          src={src!}
          alt={alt ?? ""}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={80}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: position ?? "center" }}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      )}
      <div className="noise-veil" />
      {/* Hairline frame - a crisp inner edge so pale covers (e.g. Melty's cream
          hero) read as a framed, intentional image instead of washing out into
          the white card / near-white page. Invisible over dark/vivid covers,
          essential over light ones. Monochrome, no chroma - stays on-brand. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius)]"
        style={{ boxShadow: "inset 0 0 0 1px rgba(10,10,10,0.08)" }}
      />
      {label ? (
        <span
          className={cn(
            "absolute bottom-5 left-5 right-5 font-display text-[length:var(--text-3xl)] font-semibold leading-tight",
            overImage
              ? "text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
              : "text-fg/90",
          )}
        >
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
