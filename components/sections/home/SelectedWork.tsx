import Link from "next/link";
import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";
import { copy } from "@/lib/content/copy";

export function SelectedWork() {
  const w = copy.home.work;
  return (
    <section className="section-lg">
      <div className="container-x">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <h2 className="font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight">
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
      </div>

      <WorkMarquee items={work} />
    </section>
  );
}
