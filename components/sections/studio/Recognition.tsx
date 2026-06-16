import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { recognition } from "@/lib/content/studio";
import { copy } from "@/lib/content/copy";

export function Recognition() {
  const s = copy.studio;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <Eyebrow index="04">{s.recognitionEyebrow}</Eyebrow>

        <ul className="mt-14">
          {recognition.map((item, i) => (
            <Reveal as="li" key={`${item.award}-${item.year}`} index={i % 3}>
              <div className="group flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line py-7">
                <h3 className="font-display text-[length:var(--text-2xl)] font-light leading-tight tracking-tight text-fg">
                  {item.award}
                </h3>
                <span className="text-fg-muted">{item.org}</span>
                <span className="ml-auto label-caps text-fg-dim">
                  {item.year}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
