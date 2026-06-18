import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Inter Tight label-caps section label, e.g. `WHAT WE BELIEVE`. */
export function Eyebrow({ children, className }: Props) {
  return (
    <span className={cn("inline-flex items-center label-caps", className)}>
      {children}
    </span>
  );
}
