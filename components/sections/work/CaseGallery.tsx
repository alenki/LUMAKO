import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CoverPanel } from "@/components/ui/CoverPanel";
import type { CaseStudy } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Props = {
  item: CaseStudy;
};

/** Editorial grid of project panels, honoring each panel's span hint. */
export function CaseGallery({ item }: Props) {
  return (
    <section className="section-lg">
      <div className="container-x">
        <Eyebrow index="04">Selected frames</Eyebrow>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {item.gallery.map((panel, i) => (
            <Reveal
              as="figure"
              key={panel.caption}
              index={i % 2}
              className={cn(panel.span === 2 && "md:col-span-2")}
            >
              <div className="surface-card overflow-hidden">
                <CoverPanel
                  label={panel.caption}
                  className="aspect-[16/10] rounded-[var(--radius)]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
