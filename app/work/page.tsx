import type { Metadata } from "next";
import { TextReveal } from "@/components/ui/TextReveal";
import { WorkGrid } from "@/components/sections/work/WorkGrid";
import { copy } from "@/lib/content/copy";
import { JsonLd } from "@/components/seo/JsonLd";
import { workGraph } from "@/lib/seo/jsonld";
import { socialMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: copy.meta.work.title,
  description: copy.meta.work.description,
  ...socialMeta({
    ogTitle: "Работы | Lumako",
    description: copy.meta.work.description,
    path: "/work",
  }),
};

export default function WorkPage() {
  const w = copy.work;
  return (
    <>
      <JsonLd data={workGraph()} />
      {/* Explicit padding (not .section-lg) so the headline-to-grid gap is tight:
          top keeps the section-lg offset that clears the header, bottom is small. */}
      <section className="pt-[var(--py-section-lg)] pb-[var(--vw-5)]">
        <div className="container-x">
          <div className="grid-12 items-end">
            <div className="col-span-12 md:col-span-7">
              <TextReveal
                as="h1"
                text={w.headline}
                delay={0.1}
                className="block font-display text-[length:var(--text-7xl)] font-medium leading-[0.95] tracking-tight text-balance"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[var(--vw-3)] pb-[var(--py-section-lg)]">
        <div className="container-x">
          <WorkGrid />
        </div>
      </section>
    </>
  );
}
