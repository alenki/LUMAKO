import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";

export function Testimonial() {
  const r = copy.home.receipts;
  return (
    <section className="section-lg">
      <div className="container-x">
        <Eyebrow>{r.eyebrow}</Eyebrow>
        <TextReveal
          as="h2"
          text={r.headline}
          highlight={r.highlight}
          className="mt-8 block max-w-[20ch] font-display text-[length:var(--text-5xl)] font-medium leading-[1.05] tracking-tight text-balance"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {r.items.map((item, i) => (
            <Reveal key={item} index={i}>
              <li className="surface-card flex h-full items-start gap-4 p-8">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-fg" />
                <span className="text-[length:var(--text-lg)] text-fg text-pretty">{item}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
