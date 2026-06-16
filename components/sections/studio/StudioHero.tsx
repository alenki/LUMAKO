import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { studioManifesto } from "@/lib/content/studio";
import { copy } from "@/lib/content/copy";

export function StudioHero() {
  const s = copy.studio;
  return (
    <section className="section-lg pt-[calc(var(--header-h)+var(--vw-8))]">
      <div className="container-x">
        <Eyebrow index="01">{s.eyebrow}</Eyebrow>
        <TextReveal
          as="h1"
          text={s.headline}
          highlight={s.highlight}
          delay={0.1}
          className="mt-8 block max-w-[20ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.96] tracking-tight text-balance"
        />

        <div className="mt-20 grid-12">
          <Reveal as="p" className="col-span-12 md:col-span-7">
            <span className="block max-w-[24ch] font-display text-[length:var(--text-4xl)] font-light leading-[1.16] tracking-tight text-fg text-balance">
              {studioManifesto.lead}
            </span>
          </Reveal>
          <div className="col-span-12 flex flex-col gap-6 md:col-start-9 md:col-span-4">
            {studioManifesto.body.map((paragraph, i) => (
              <Reveal
                as="p"
                key={paragraph}
                index={i + 1}
                className="text-[length:var(--text-lg)] text-fg-muted text-pretty"
              >
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
