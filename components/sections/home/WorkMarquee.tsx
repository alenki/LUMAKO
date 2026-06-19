"use client";

import { useEffect, useRef } from "react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

/** One full -100% pass. Slow + linear reads as premium. Tunable in one place. */
const DURATION = "45s";
/** On hover the rail keeps gliding, just way slower - a calm drift you can read,
 *  not a dead stop. Fraction of full speed. */
const HOVER_RATE = 0.1;

/** Card cell: fixed responsive width + uniform right margin so the two duplicated
 *  tracks are perfectly periodic and the -100% loop has zero jump. */
const CELL = "me-5 shrink-0 md:me-8 w-[clamp(330px,42vw,720px)]";

/**
 * Full-bleed auto-sliding work rail. The list is rendered twice: the real set
 * plus a visual clone (inert + aria-hidden) so screen-reader and keyboard users
 * meet each project exactly once. Both tracks translate 0 -> -100% in lockstep;
 * when the first scrolls fully off, the identical clone has taken its place, so
 * the reset is seamless.
 *
 * Hover slows the rail to a drift (instead of the CSS :hover pause, which stays
 * as a no-JS fallback): the live animation's playback rate is eased down with no
 * position jump, and the inline play-state override keeps it running past the
 * stylesheet's pause. Keyboard focus still pauses outright (globals.css), and
 * reduced-motion disables the animation entirely - both left untouched here.
 */
export function WorkMarquee({ items }: { items: CaseStudy[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window.matchMedia !== "function") return;
    // Touch has no hover; reduced motion drops the animation (see globals.css).
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracks = Array.from(
      root.querySelectorAll<HTMLElement>(".marquee-track"),
    );

    const setSpeed = (rate: number, gliding: boolean) => {
      for (const track of tracks) {
        // Override the stylesheet's :hover pause so the rail keeps moving...
        track.style.animationPlayState = gliding ? "running" : "";
        // ...just much slower. updatePlaybackRate retimes in place (no jump).
        if (typeof track.getAnimations !== "function") continue;
        for (const anim of track.getAnimations()) {
          if (typeof anim.updatePlaybackRate === "function") {
            anim.updatePlaybackRate(rate);
          } else {
            anim.playbackRate = rate;
          }
        }
      }
    };

    const slow = () => setSpeed(HOVER_RATE, true);
    const full = () => setSpeed(1, false);

    root.addEventListener("pointerenter", slow);
    root.addEventListener("pointerleave", full);
    return () => {
      root.removeEventListener("pointerenter", slow);
      root.removeEventListener("pointerleave", full);
    };
  }, []);

  return (
    <div ref={rootRef} className="work-marquee group mt-16">
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
