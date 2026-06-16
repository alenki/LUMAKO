import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { engagements } from "@/lib/content/services";
import { copy } from "@/lib/content/copy";

export function Engagements() {
  const s = copy.services;
  return (
    <section className="section-lg">
      <div className="container-x">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <Eyebrow index="03">{s.engagementsEyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight text-balance">
              {s.engagementsHeadline}
            </h2>
          </div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {engagements.map((engagement, i) => (
            <Reveal
              key={engagement.name}
              index={i}
              className="surface-card flex h-full flex-col p-10"
            >
              <h3 className="font-display text-[length:var(--text-3xl)] font-light tracking-tight">
                {engagement.name}
              </h3>
              <p className="mt-3 text-[length:var(--text-lg)] text-fg-muted text-pretty">
                {engagement.blurb}
              </p>
              <ul className="mt-8 border-t border-line">
                {engagement.detail.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 border-b border-line py-3 text-[length:var(--text-base)] text-fg-muted"
                  >
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-fg translate-y-[-1px]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
