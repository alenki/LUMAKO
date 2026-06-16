import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import type { CaseStudy } from "@/lib/content/types";

type Props = {
  item: CaseStudy;
};

/** Editorial body: the Challenge block beside the numbered Approach entries. */
export function CaseBody({ item }: Props) {
  return (
    <section className="border-t border-line section-lg">
      <div className="container-x grid gap-x-12 gap-y-14 md:grid-cols-12">
        <div className="md:col-span-5 md:sticky md:top-[calc(var(--header-h)+var(--vw-4))] md:self-start">
          <Eyebrow index="02">Challenge</Eyebrow>
          <Reveal index={1}>
            <p className="mt-8 max-w-[40ch] text-[length:var(--text-2xl)] font-light leading-snug text-fg text-pretty">
              {item.challenge}
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Eyebrow index="03">Approach</Eyebrow>
          <ol className="mt-8 border-t border-line">
            {item.approach.map((step, i) => (
              <Reveal as="li" key={step.title} index={i} className="border-b border-line">
                <div className="grid grid-cols-[auto_1fr] gap-x-6 py-9">
                  <span className="label-caps !text-accent">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <div>
                    <h3 className="font-display text-[length:var(--text-3xl)] font-light leading-tight tracking-tight text-fg">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[52ch] text-[length:var(--text-lg)] text-fg-muted text-pretty">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
