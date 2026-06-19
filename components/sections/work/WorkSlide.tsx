import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";

/** Uniform card shape - the Balance cover's ratio. Wider covers center-crop to fit. */
const CARD_RATIO = 1916 / 1263;

/**
 * Sparse work card for the home marquee: cover image, then the project name with
 * small discipline chips. Links out to the live site. The richer WorkCard stays
 * the unit for the /work grid.
 */
export function WorkSlide({ item }: { item: CaseStudy }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      aria-label={`${item.title} - ${item.client} (opens the live site in a new tab)`}
      className="group/slide block"
    >
      <div className="surface-card relative overflow-hidden">
        <CoverPanel
          src={item.cover}
          alt={`${item.title} - ${item.sector}`}
          tint={item.accent}
          position={item.coverPosition}
          ratio={CARD_RATIO}
        />
        <span className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-line-strong bg-bg/85 text-fg opacity-0 transition-opacity duration-500 group-hover/slide:opacity-100">
          ↗
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="font-display text-[length:var(--text-2xl)] font-semibold leading-tight tracking-tight text-fg">
          {item.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {item.disciplines.map((d) => (
            <span
              key={d}
              className="rounded-full border border-line px-3 py-1 label-caps"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
