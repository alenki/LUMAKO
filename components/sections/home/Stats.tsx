import { Counter } from "@/components/ui/Counter";
import { copy } from "@/lib/content/copy";

export function Stats() {
  return (
    <section className="section border-t border-line">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
          {copy.home.stats.map((s) => (
            <div key={s.label} className="bg-bg p-10">
              <div className="font-display text-[length:var(--text-6xl)] font-light tracking-tight text-fg">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-4 font-mono text-[length:var(--text-mono)] uppercase tracking-widest text-fg-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
