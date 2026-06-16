import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/lib/content/copy";

export function CtaBand() {
  const c = copy.home.cta;
  return (
    <section className="relative overflow-hidden border-t border-line section-lg">
      <div className="container-x relative flex flex-col items-center text-center">
        <Eyebrow index="06">{c.eyebrow}</Eyebrow>
        <TextReveal
          as="h2"
          text={c.headline}
          highlight={c.highlight}
          className="mt-8 block max-w-[18ch] font-display text-[length:var(--text-6xl)] font-light leading-[1.04] tracking-tight text-balance"
        />
        <Reveal index={1}>
          <p className="mx-auto mt-6 max-w-[44ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
            {c.sub}
          </p>
        </Reveal>
        <Reveal index={2}>
          <div className="mt-11">
            <MagneticButton href={c.button.href} strength={0.5}>
              {c.button.label}
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
