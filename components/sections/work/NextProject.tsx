import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";

type Props = {
  /** Already resolved to the next case study. */
  item: CaseStudy;
};

/** Full-width cinematic link to the next project. */
export function NextProject({ item }: Props) {
  return (
    <section className="border-t border-line">
      <Link
        href={`/work/${item.slug}`}
        data-cursor
        className="group block section-lg"
      >
        <div className="container-x grid gap-x-12 gap-y-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <Eyebrow index="06">Next project</Eyebrow>
            <h2 className="mt-8 font-display text-[length:var(--text-7xl)] font-light leading-[0.96] tracking-tight text-balance text-fg-muted transition-colors duration-500 group-hover:text-fg">
              {item.title}
            </h2>
            <p className="mt-7 max-w-[44ch] text-[length:var(--text-lg)] text-fg-muted text-pretty">
              {item.client} — {item.sector}
            </p>
            <span className="mt-9 inline-flex items-center gap-3 font-mono text-[length:var(--text-mono)] uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg">
              View case study
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>

          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-xl border border-line">
              <CoverPanel
                accent={item.accent}
                className="aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
              />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
