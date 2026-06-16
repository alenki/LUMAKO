import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { processPhases } from "@/lib/content/services";
import { copy } from "@/lib/content/copy";

export function ProcessTeaser() {
  const p = copy.home.process;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow index="05">{p.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight">
              {p.headline}
            </h2>
          </div>
          <p className="text-[length:var(--text-lg)] text-fg-muted text-pretty md:col-span-5">
            {p.sub}
          </p>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
          {processPhases.map((phase, i) => (
            <Reveal as="li" key={phase.index} index={i % 3} className="bg-bg">
              <div className="h-full p-9">
                <span className="font-mono text-[length:var(--text-mono)] tracking-widest text-accent">
                  {phase.index}
                </span>
                <h3 className="mt-5 font-display text-[length:var(--text-3xl)] font-light text-fg">
                  {phase.name}
                </h3>
                <p className="mt-3 text-[length:var(--text-base)] text-fg-muted text-pretty">
                  {phase.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12">
          <Link
            href={p.link.href}
            data-cursor
            className="group inline-flex items-center gap-2 font-mono text-[length:var(--text-mono)] uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
          >
            {p.link.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
