import { WorkMarquee } from "@/components/sections/home/WorkMarquee";
import { work } from "@/lib/content/work";

export function SelectedWork() {
  return (
    <section className="section-lg">
      <WorkMarquee items={work} />
    </section>
  );
}
