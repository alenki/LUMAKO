"use client";

import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** Uniform card shape - the Harmony cover's ratio. Wider covers center-crop to fit. */
const CARD_RATIO = 1916 / 1263;

type Props = {
  item: CaseStudy;
  priority?: boolean;
  className?: string;
};

export function WorkCard({ item, priority, className }: Props) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      aria-label={`${item.title} - ${item.client} (откроет сайт в новой вкладке)`}
      className={cn("group block", className)}
    >
      <div className="surface-card relative overflow-hidden">
        <CoverPanel
          src={item.cover}
          alt={`${item.title} - ${item.sector}`}
          tint={item.accent}
          position={item.coverPosition}
          ratio={CARD_RATIO}
          priority={priority}
        />
        <span className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-line-strong bg-bg/85 text-fg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          ↗
        </span>
      </div>

      <div className="mt-5">
        <h3 className="font-display text-[length:var(--text-3xl)] font-semibold leading-tight tracking-tight text-fg">
          {item.title}
        </h3>
        <p className="mt-1.5 text-fg-muted">
          {item.client} - {item.sector}
        </p>
      </div>
    </a>
  );
}
