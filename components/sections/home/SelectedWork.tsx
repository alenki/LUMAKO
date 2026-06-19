import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/sections/work/WorkCard";
import { featuredWork } from "@/lib/content/work";
import { copy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";

export function SelectedWork() {
  const w = copy.home.work;
  return (
    <section className="section-lg">
      <div className="container-x">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <h2 className="font-display text-[length:clamp(2.75rem,6.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.025em] text-balance">
              {w.headline}
            </h2>
          </div>
          <div className="col-span-12 md:col-start-9 md:col-span-4 flex md:justify-end pb-1">
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
        </div>

        <div className="grid-12 mt-16 gap-y-12 md:gap-y-0">
          {featuredWork.map((item, i) => (
            <Reveal
              key={item.slug}
              index={i}
              className={cn(
                "col-span-12 md:col-span-6",
                i % 2 === 1 && "md:mt-24",
              )}
            >
              <WorkCard item={item} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
