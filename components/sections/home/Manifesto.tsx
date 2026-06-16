import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";

export function Manifesto() {
  const m = copy.home.manifesto;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <Eyebrow index="02">{m.eyebrow}</Eyebrow>
        <TextReveal
          as="p"
          text={m.headline}
          highlight={m.highlight}
          stagger={0.04}
          className="mt-10 block max-w-[26ch] font-display text-[length:var(--text-5xl)] font-light leading-[1.12] tracking-tight text-balance"
        />
      </div>
    </section>
  );
}
