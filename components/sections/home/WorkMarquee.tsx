"use client";

import { useEffect, useRef } from "react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

/** One full -100% pass. Slow + linear reads as premium. Tunable in one place. */
const DURATION = "45s";
/** On hover the rail keeps gliding, slower so you can read it - not a dead stop.
 *  Why not slower: the render pipeline is smooth at any speed (steady fps, sub-pixel
 *  AA verified), but a near-stop crawl (<~10px/s) moves the detail-rich cover
 *  screenshots a tiny fraction of a pixel per frame, and on a 1x-DPI display the eye
 *  reads slow-crawling fine detail as shimmer/judder. At full speed that detail moves
 *  fast enough to blur into clean motion. 0.4 (~25px/s) keeps an obvious "slowed to
 *  read" cue while moving fast enough to glide smoothly. Speed is the only real lever
 *  here - tune this one number to trade slowness against smoothness. */
const HOVER_RATE = 0.4;

/** Card cell: fixed responsive width + uniform right margin so the two duplicated
 *  tracks are perfectly periodic and the -100% loop has zero jump. `marquee-cell`
 *  promotes each cell to its own pixel-snapped compositor layer (globals.css) so the
 *  gliding track translates clean per-card textures instead of resampling one giant
 *  texture - which is what bled white sub-pixel seams between cards on hover. */
const CELL = "marquee-cell me-5 shrink-0 md:me-8 w-[clamp(330px,42vw,720px)]";

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
 *
 * Because the rail keeps gliding under a possibly-still pointer, the hover
 * spotlight cannot ride CSS :hover (which the browser only re-evaluates on pointer
 * movement, so it sticks to the card that was under a motionless cursor). While
 * gliding we re-hit-test the pointer each frame and mark the card actually beneath
 * it .is-hovered for the stylesheet to light (see the .js-hover-active rules).
 */
export function WorkMarquee({ items }: { items: CaseStudy[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Keep the visual clone out of the tab order (it is aria-hidden too) WITHOUT
    // `inert`: inert also blocks pointer hit-testing, which silently kills the
    // hover cursor on every clone card once the rail scrolls them into view.
    root
      .querySelector("[data-marquee-clone]")
      ?.querySelectorAll("a")
      .forEach((a) => {
        a.tabIndex = -1;
      });

    // Glide-on-hover: fine pointers only; reduced motion drops the animation.
    if (typeof window.matchMedia !== "function") return;
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

    // Hand the hover spotlight over to JS. The stylesheet's :hover spotlight (dim
    // every card, keep the hovered one lit) reads the right card only while the
    // rail is paused - the no-JS / reduced-motion / coarse-pointer fallback. Here
    // the rail keeps GLIDING under a possibly-still pointer, and CSS :hover does
    // not re-evaluate when content moves under a motionless cursor: it sticks to
    // whatever card was under the cursor when it stopped, so that card stays lit
    // long after it has glided away. With .js-hover-active set, globals.css ignores
    // :hover and follows the .is-hovered card we re-resolve below every frame.
    root.classList.add("js-hover-active");

    const pointer = { x: -1, y: -1 };
    let inside = false;
    let raf = 0;
    let lit: Element | null = null;

    const setLit = (next: Element | null) => {
      if (next === lit) return;
      lit?.classList.remove("is-hovered");
      next?.classList.add("is-hovered");
      lit = next;
    };

    // Re-hit-test the last pointer position each frame while the rail glides, so
    // the lit card is always the one ACTUALLY under the cursor - tracking cards as
    // they slide beneath a still pointer, and dropping the highlight in the gaps.
    const sample = () => {
      raf = inside ? requestAnimationFrame(sample) : 0;
      if (!inside) return;
      const el = document.elementFromPoint(pointer.x, pointer.y);
      const card = el?.closest("a");
      setLit(card && root.contains(card) ? card : null);
      // The custom cursor's "View" disc reads the hovered project the same way and
      // would likewise stick to the card that glided off; nudge it to re-hit-test
      // at its own last pointer position (it already does this on scroll).
      window.dispatchEvent(new Event("lumako:hover-recheck"));
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const enter = (e: PointerEvent) => {
      onMove(e);
      inside = true;
      slow();
      if (!raf) raf = requestAnimationFrame(sample);
    };
    const leave = () => {
      inside = false;
      full();
      setLit(null);
      window.dispatchEvent(new Event("lumako:hover-recheck"));
    };

    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", leave);
      inside = false; // a frame already queued before teardown bails, never re-queues
      if (raf) cancelAnimationFrame(raf);
      setLit(null);
      root.classList.remove("js-hover-active");
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
