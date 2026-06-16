import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { engagements } from "@/lib/content/services";
import { copy } from "@/lib/content/copy";

export function Engagements() {
  const s = copy.services;
  return (
    <section className="border-t border-line section-lg">
      <div className="container-x">
        <div className="max-w-[28ch]">
          <Eyebrow index="03">{s.engagementsEyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight text-balance">
            {s.engagementsHeadline}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {engagements.map((engagement, i) => (
            <Reveal
              key={engagement.name}
              index={i}
              className="flex h-full flex-col rounded-xl border border-line bg-bg-elev p-8"
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
                    <span className="font-mono text-[length:var(--text-mono)] text-accent">
                      ·
                    </span>
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
