import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/sections/work/WorkCard";
import { featuredWork } from "@/lib/content/work";
import { copy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";

export function SelectedWork() {
  const w = copy.home.work;
  return (
    <section className="section-lg border-t border-line">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="04">{w.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight">
              {w.headline}
            </h2>
          </div>
          <Link
            href={w.link.href}
            data-cursor
            className="group flex items-center gap-2 label-caps transition-colors hover:text-fg"
          >
            {w.link.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-2">
          {featuredWork.map((item, i) => (
            <Reveal
              key={item.slug}
              index={i}
              className={cn(i % 2 === 1 && "md:mt-28")}
            >
              <WorkCard item={item} index={`0${i + 1}`} large />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
