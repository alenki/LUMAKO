import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CoverPanel } from "@/components/ui/CoverPanel";
import { team } from "@/lib/content/studio";
import { copy } from "@/lib/content/copy";

export function Team() {
  const s = copy.studio;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <Eyebrow index="03">{s.teamEyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight">
          {s.teamHeadline}
        </h2>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.name} index={i % 4} className="group">
              <div className="overflow-hidden rounded-[10px] border border-line">
                <CoverPanel
                  accent={member.accent}
                  className="aspect-[3/4] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-5 font-display text-[length:var(--text-2xl)] font-light leading-tight tracking-tight text-fg">
                {member.name}
              </h3>
              <p className="mt-1.5 label-caps">
                {member.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
