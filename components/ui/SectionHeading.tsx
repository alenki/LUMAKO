import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/** Inter Tight display heading. Wrap accent words in <em> for italic-accent styling. */
export function SectionHeading({ children, as = "h2", className }: Props) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-display font-light leading-[1.02] tracking-tight text-balance [&_em]:italic [&_em]:text-accent",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
