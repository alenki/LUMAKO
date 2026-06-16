import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { processPhases } from "@/lib/content/services";
import { copy } from "@/lib/content/copy";

export function ProcessSteps() {
  const s = copy.services;
  return (
    <section className="border-t border-line section-lg">
      <div className="container-x">
        <div className="max-w-[28ch]">
          <Eyebrow index="02">{s.processEyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight text-balance">
            {s.processHeadline}
          </h2>
        </div>

        <ol className="mt-16 border-t border-line">
          {processPhases.map((phase, i) => (
            <Reveal
              as="li"
              key={phase.index}
              index={i % 3}
              className="grid items-baseline gap-x-10 gap-y-3 border-b border-line py-10 md:grid-cols-12"
            >
              <span className="label-caps !text-accent md:col-span-1">
                {phase.index}
              </span>
              <h3 className="font-display text-[length:var(--text-4xl)] font-light leading-tight tracking-tight md:col-span-4">
                {phase.name}
              </h3>
              <p className="max-w-[52ch] text-[length:var(--text-lg)] text-fg-muted text-pretty md:col-span-7">
                {phase.detail}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
