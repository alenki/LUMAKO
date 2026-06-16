import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { values } from "@/lib/content/studio";
import { copy } from "@/lib/content/copy";

export function Values() {
  const s = copy.studio;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <Eyebrow index="02">{s.valuesEyebrow}</Eyebrow>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {values.map((value, i) => (
            <Reveal key={value.title} index={i % 2} className="bg-bg">
              <div className="flex h-full flex-col gap-4 p-10">
                <h3 className="max-w-[16ch] font-display text-[length:var(--text-3xl)] font-light leading-tight tracking-tight text-fg">
                  {value.title}
                </h3>
                <p className="max-w-[44ch] text-[length:var(--text-base)] text-fg-muted text-pretty">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
