import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LogoChips } from "@/components/ui/LogoChips";
import { copy } from "@/lib/content/copy";

export function CtaBand() {
  const c = copy.home.cta;
  return (
    <section className="relative overflow-hidden section-lg">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-card)] px-6 py-28 text-center md:py-36">
          <LogoChips />
          <div className="relative z-10 mx-auto max-w-[34ch]">
            <Eyebrow>{c.eyebrow}</Eyebrow>
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
                <Button href={c.button.href} variant="primary">
                  {c.button.label}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
