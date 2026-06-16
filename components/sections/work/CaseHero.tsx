import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";

type Props = {
  item: CaseStudy;
};

/** Cinematic case-study opener: label meta row, big display title, banner cover, lead. */
export function CaseHero({ item }: Props) {
  const meta = [item.client, item.sector, item.year, item.role];

  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+var(--vw-8))] section-lg">
      <div
        className="glow-accent pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${item.accent}26 0%, transparent 70%)`,
        }}
      />
      <div className="container-x relative">
        <Eyebrow index="01">Case study</Eyebrow>

        <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 label-caps">
          {meta.map((m, i) => (
            <li key={m} className="flex items-center gap-4">
              {i > 0 ? <span className="text-fg-dim">·</span> : null}
              <span>{m}</span>
            </li>
          ))}
        </ul>

        <TextReveal
          as="h1"
          text={item.title}
          delay={0.1}
          className="mt-7 block max-w-[16ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.96] tracking-tight text-balance"
        />

        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-12 md:items-end">
          <Reveal as="figure" index={1} className="md:col-span-8">
            <CoverPanel
              accent={item.accent}
              className="aspect-[16/9] rounded-[10px] border border-line"
            />
          </Reveal>
          <Reveal index={2} className="md:col-span-4">
            <p className="text-[length:var(--text-xl)] text-fg-muted text-pretty">
              {item.summary}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
