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
          <div className="grid-12 items-end">
            {/* Left: eyebrow + headline */}
            <div className="col-span-12 md:col-span-7">
              <Eyebrow>{w.eyebrow}</Eyebrow>
              <TextReveal
                as="h1"
                text={w.headline}
                highlight={w.highlight}
                delay={0.1}
                className="mt-8 block font-display text-[length:var(--text-7xl)] font-medium leading-[0.95] tracking-tight text-balance"
              />
            </div>

            {/* Right: sub paragraph, anchored to baseline */}
            <Reveal index={1} className="col-span-12 md:col-start-9 md:col-span-4 md:pb-2">
              <p className="text-[length:var(--text-xl)] text-fg-body leading-relaxed text-pretty">
                {w.sub}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-lg">
        <div className="container-x">
          <WorkGrid />
        </div>
      </section>
    </>
  );
}
