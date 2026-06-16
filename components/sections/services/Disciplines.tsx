import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/lib/content/services";

export function Disciplines() {
  return (
    <section className="border-t border-line section-lg">
      <div className="container-x">
        {services.map((service) => (
          <Reveal
            key={service.id}
            as="div"
            className="grid gap-x-12 gap-y-8 border-t border-line py-16 first:border-t-0 first:pt-0 md:grid-cols-12"
          >
            <div className="md:col-span-7">
              <span className="label-caps text-fg-dim">
                {service.index}
              </span>
              <h2 className="mt-5 max-w-[14ch] font-display text-[length:var(--text-5xl)] font-light leading-tight tracking-tight text-balance">
                {service.title}
              </h2>
              <p className="mt-6 max-w-[44ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
                {service.blurb}
              </p>
            </div>
            <div className="md:col-span-5">
              <p className="label-caps text-fg-dim">
                Deliverables
              </p>
              <ul className="mt-6 border-t border-line">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-[length:var(--text-lg)] text-fg"
                  >
                    <span className="text-[length:var(--text-mono)] text-accent">
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
