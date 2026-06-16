import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/lib/content/copy";

export function ServicesHero() {
  const s = copy.services;
  return (
    <section className="relative overflow-hidden section-lg pt-[calc(var(--header-h)+var(--vw-8))]">
      <div className="glow-accent absolute inset-0" />
      <div className="container-x relative">
        <Eyebrow index="01">{s.eyebrow}</Eyebrow>
        <TextReveal
          as="h1"
          text={s.headline}
          highlight={s.highlight}
          delay={0.1}
          className="mt-8 block max-w-[18ch] font-display text-[length:var(--text-7xl)] font-light leading-[0.95] tracking-tight text-balance"
        />
        <Reveal index={1}>
          <p className="mt-8 max-w-[48ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
            {s.sub}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
