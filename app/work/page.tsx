import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { WorkGrid } from "@/components/sections/work/WorkGrid";
import { copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: copy.meta.work.title,
  description: copy.meta.work.description,
};

export default function WorkPage() {
  const w = copy.work;
  return (
    <>
      <section className="section-lg pt-[calc(var(--header-h)+var(--vw-8))]">
        <div className="container-x">
          <Eyebrow index="00">{w.eyebrow}</Eyebrow>
          <TextReveal
            as="h1"
            text={w.headline}
            highlight={w.highlight}
            delay={0.1}
            className="mt-8 block max-w-[18ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.95] tracking-tight text-balance"
          />
          <Reveal index={1}>
            <p className="mt-8 max-w-[48ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
              {w.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-lg border-t border-line">
        <div className="container-x">
          <WorkGrid />
        </div>
      </section>
    </>
  );
}
