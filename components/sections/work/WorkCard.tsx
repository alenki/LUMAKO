"use client";

import Link from "next/link";
import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Props = {
  item: CaseStudy;
  index?: string;
  large?: boolean;
  className?: string;
};

export function WorkCard({ item, index, large, className }: Props) {
  return (
    <Link
      href={`/work/${item.slug}`}
      data-cursor
      className={cn("group block", className)}
    >
      <div className="surface-card surface-card--hover relative overflow-hidden">
        <CoverPanel
          index={index}
          className={cn(
            "transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]",
            large ? "aspect-[16/10]" : "aspect-[4/3]",
          )}
        />
        <span className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-line-strong bg-bg/40 text-fg opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
          ↗
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[length:var(--text-3xl)] font-light leading-tight tracking-tight text-fg transition-colors">
            {item.title}
          </h3>
          <p className="mt-1.5 text-fg-muted">
            {item.client} — {item.sector}
          </p>
        </div>
        <span className="shrink-0 label-caps !text-fg-dim">
          {item.year}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.disciplines.map((d) => (
          <span
            key={d}
            className="rounded-full border border-line px-3 py-1 label-caps"
          >
            {d}
          </span>
        ))}
      </div>
    </Link>
  );
}
