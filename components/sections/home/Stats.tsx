import { copy } from "@/lib/content/copy";

export function Stats() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {copy.home.proof.map((s) => (
            <div key={s.label} className="surface-card p-10">
              <div className="font-display text-[length:var(--text-4xl)] font-medium leading-tight tracking-tight text-fg">
                {s.value}
              </div>
              <p className="mt-3 label-caps">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
