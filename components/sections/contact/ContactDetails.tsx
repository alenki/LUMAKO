import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LocalTime } from "@/components/layout/LocalTime";
import { site } from "@/lib/content/site";

/** Studio coordinates: email, location, live time, socials — a calm right rail. */
export function ContactDetails() {
  return (
    <div className="flex flex-col gap-12">
      <Reveal>
        <div className="flex flex-col gap-4">
          <Eyebrow index="02">Direct line</Eyebrow>
          <a
            href={`mailto:${site.email}`}
            data-cursor
            className="group block w-fit font-display text-[length:var(--text-4xl)] font-light leading-tight tracking-tight text-fg transition-colors duration-300 hover:text-accent"
          >
            {site.email}
            <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
          <p className="max-w-[40ch] text-[length:var(--text-lg)] text-fg-muted text-pretty">
            Prefer to talk it through? Email us and we&apos;ll find a time to
            jump on a call — no pitch theater, just the work.
          </p>
        </div>
      </Reveal>

      <Reveal index={1}>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
          <div className="bg-bg p-7">
            <span className="font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-fg-dim">
              Based in
            </span>
            <p className="mt-3 text-[length:var(--text-lg)] text-fg">
              {site.locale}
            </p>
          </div>
          <div className="bg-bg p-7">
            <span className="font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-fg-dim">
              Local time
            </span>
            <p className="mt-3">
              <LocalTime className="text-[length:var(--text-lg)] normal-case tracking-normal text-fg" />
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal index={2}>
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-fg-dim">
            Elsewhere
          </span>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="group inline-flex items-center gap-1.5 text-[length:var(--text-lg)] text-fg-muted transition-colors duration-300 hover:text-fg"
                >
                  {social.label}
                  <span className="text-fg-dim transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
