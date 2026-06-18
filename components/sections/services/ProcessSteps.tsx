import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { processPhases } from "@/lib/content/services";
import { copy } from "@/lib/content/copy";

export function ProcessSteps() {
  const s = copy.services;
  return (
    <section className="section-lg">
      <div className="container-x">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <Eyebrow>{s.processEyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight text-balance">
              {s.processHeadline}
            </h2>
          </div>
        </div>

        <ol className="mt-16 border-t border-line">
          {processPhases.map((phase, i) => (
            <Reveal
              as="li"
              key={phase.index}
              index={i % 3}
              className="grid-12 items-baseline gap-y-3 border-b border-line py-10"
            >
              <span className="label-caps col-span-12 md:col-span-1 text-fg-dim">
                {phase.index}
              </span>
              <h3 className="col-span-12 md:col-span-4 font-display text-[length:var(--text-4xl)] font-light leading-tight tracking-tight">
                {phase.name}
              </h3>
              <p className="col-span-12 md:col-span-7 max-w-[52ch] text-[length:var(--text-lg)] text-fg-muted text-pretty">
                {phase.detail}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
