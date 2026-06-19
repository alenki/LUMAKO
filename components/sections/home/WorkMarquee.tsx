"use client";

import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

/** One full -100% pass. Slow + linear reads as premium. Tunable in one place. */
const DURATION = "45s";

/** Card cell: fixed responsive width + uniform right margin so the two duplicated
 *  tracks are perfectly periodic and the -100% loop has zero jump. */
const CELL = "me-4 shrink-0 md:me-6 w-[clamp(260px,26vw,400px)]";

/**
 * Full-bleed auto-sliding work rail. The list is rendered twice: the real set
 * plus a visual clone (inert + aria-hidden) so screen-reader and keyboard users
 * meet each project exactly once. Both tracks translate 0 -> -100% in lockstep;
 * when the first scrolls fully off, the identical clone has taken its place, so
 * the reset is seamless. Pause-on-hover/focus and the reduced-motion fallback
 * live in styles/globals.css (.work-marquee + .marquee-track).
 */
export function WorkMarquee({ items }: { items: CaseStudy[] }) {
  return (
    <div className="work-marquee group mt-16">
      <div className="flex w-max">
        <div
          className="marquee-track flex shrink-0"
          style={{ animationDuration: DURATION }}
        >
          {items.map((item) => (
            <div key={item.slug} className={CELL}>
              <WorkSlide item={item} />
            </div>
          ))}
        </div>
        <div
          className="marquee-track flex shrink-0"
          style={{ animationDuration: DURATION }}
          data-marquee-clone="true"
          aria-hidden="true"
          inert
        >
          {items.map((item) => (
            <div key={`${item.slug}-clone`} className={CELL}>
              <WorkSlide item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
