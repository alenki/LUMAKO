import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  children: React.ReactNode;
  className?: string;
};

/** Inter Tight label-caps section label: `(01) — WHAT WE BELIEVE`. */
export function Eyebrow({ index, children, className }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-3 label-caps", className)}>
      {index ? <span className="text-fg-dim">({index})</span> : null}
      <span>{children}</span>
    </span>
  );
}
