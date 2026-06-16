import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { clients } from "@/lib/content/studio";
import { copy } from "@/lib/content/copy";

function ClientName({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-[var(--vw-4)] whitespace-nowrap font-display text-[length:var(--text-5xl)] font-light lowercase tracking-tight text-fg-muted">
      {name}
      <span aria-hidden className="text-[length:var(--text-2xl)] text-accent">
        &bull;
      </span>
    </span>
  );
}

export function Clients() {
  const s = copy.studio;
  const half = Math.ceil(clients.length / 2);
  const rowOne = clients.slice(0, half);
  const rowTwo = clients.slice(half);

  return (
    <section className="section-lg overflow-hidden border-t border-line">
      <div className="container-x">
        <Eyebrow index="05">{s.clientsEyebrow}</Eyebrow>
      </div>

      <div className="mt-14 flex flex-col gap-[var(--vw-3)]">
        <Marquee speed={42}>
          {rowOne.map((name) => (
            <ClientName key={name} name={name} />
          ))}
        </Marquee>
        <Marquee speed={42} reverse>
          {rowTwo.map((name) => (
            <ClientName key={name} name={name} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
