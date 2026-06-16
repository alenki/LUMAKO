import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import type { CaseStudy } from "@/lib/content/types";

type Props = {
  item: CaseStudy;
};

/** White-card row of outcome metrics with counting display numbers. */
export function CaseResults({ item }: Props) {
  return (
    <section className="section-lg">
      <div className="container-x">
        <Eyebrow index="05">Results</Eyebrow>
        <dl className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {item.results.map((r, i) => (
            <Reveal as="div" key={r.label} index={i} className="surface-card p-10">
              <div className="flex h-full flex-col justify-between gap-10">
                <dd className="font-display text-[length:var(--text-6xl)] font-light leading-none tracking-tight text-fg">
                  <Counter
                    value={r.value}
                    prefix={r.prefix}
                    suffix={r.suffix}
                    decimals={Number.isInteger(r.value) ? 0 : 1}
                  />
                </dd>
                <dt className="label-caps">
                  {r.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
