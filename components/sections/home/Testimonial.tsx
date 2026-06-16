import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/lib/content/copy";

export function Testimonial() {
  const t = copy.home.testimonial;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-narrow text-center">
        <Reveal>
          <blockquote className="font-display text-[length:var(--text-4xl)] font-light leading-[1.3] tracking-tight text-balance">
            <span className="text-accent">“</span>
            {t.quote}
            <span className="text-accent">”</span>
          </blockquote>
        </Reveal>
        <Reveal index={1}>
          <div className="mt-10 font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-fg-muted">
            {t.name} — {t.role}, {t.company}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
