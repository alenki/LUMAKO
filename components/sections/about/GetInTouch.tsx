import Link from "next/link";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";
import { site } from "@/lib/content/site";

// Quiet parenthetical label, lightened for the dark band.
const dimLabel =
  "font-medium uppercase tracking-[0.18em] text-[length:var(--text-mono)] text-[#fafafa]/55";
// The big channel links - brightening on hover.
const bigLink =
  "group inline-flex w-fit items-baseline font-display text-[length:clamp(1.6rem,3.4vw,3rem)] font-medium leading-tight tracking-tight text-[#fafafa]/85 transition-colors duration-300 hover:text-[#fafafa]";

/** The closing contact band: a full-bleed ink panel with a monumental "Get in
 *  touch", the lume dot hugging it, over two channels - email and a brief. */
export function GetInTouch() {
  const g = copy.about.getInTouch;
  return (
    <section className="bg-[#0a0a0a] py-[var(--py-section-lg)] text-[#fafafa]">
      <div className="container-x">
        {/* Indented to match the About statement above (Statement.tsx). */}
        <div className="md:pl-[12vw]">
          <TextReveal
            as="h2"
            text={g.heading}
            dotAfter="touch"
            stagger={0.04}
            className="block font-display text-[length:clamp(3rem,9vw,8.5rem)] font-medium leading-[0.95] tracking-[-0.02em]"
          />

          <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:gap-[var(--vw-8)] md:mt-16">
            <div className="flex flex-col gap-4">
              <span className={dimLabel}>( {g.emailLabel} )</span>
              <a href={`mailto:${site.email}`} data-cursor className={bigLink}>
                {site.email}
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <span className={dimLabel}>( {g.projectLabel} )</span>
              <Link href="/contact" data-cursor className={bigLink}>
                {g.projectCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
