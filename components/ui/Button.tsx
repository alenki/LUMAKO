import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "link";

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-300";
  const map: Record<ButtonVariant, string> = {
    primary: "rounded-full bg-accent px-7 py-3 text-bg hover:bg-accent-deep",
    ghost:
      "rounded-full border border-line-strong px-7 py-3 text-fg hover:border-line hover:bg-card",
    link: "relative text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
  };
  return cn(base, map[variant], className);
}

type ButtonProps = {
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  external,
  type = "button",
  onClick,
}: ButtonProps) {
  const cls = buttonClasses(variant, className);
  if (href && !external) {
    return (
      <Link href={href} className={cls} data-cursor>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} data-cursor>
      {children}
    </button>
  );
}
