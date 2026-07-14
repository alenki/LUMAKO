"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { WorkSlide } from "@/components/sections/work/WorkSlide";
import type { CaseStudy } from "@/lib/content/types";

/** One full -100% pass. Slow + linear reads as premium. Tunable in one place;
 *  the drag/wheel scrubbing below converts pointer pixels into this timeline. */
const DURATION_MS = 45_000;
const DURATION = `${DURATION_MS}ms`;
/** Touch-primary devices (coarse pointer) opt out of the drag/scrub layer below - a
 *  finger swipe should pan the page, not grab the rail. With no hand-scrubbing to
 *  jump ahead, the ambient pass runs a bit quicker there so the full set of projects
 *  comes round sooner. React owns this: `coarse` (below) drives the tracks' duration
 *  reactively, so a re-render can never reset it back to DURATION. */
const TOUCH_DURATION_MS = 30_000;
const TOUCH_DURATION = `${TOUCH_DURATION_MS}ms`;

/** SSR-safe `(pointer: coarse)` read, mirroring lib/useReducedMotion: `false` on the
 *  server and the first client render so hydration matches, then the real value after
 *  mount (one post-hydration re-render). matchMedia can be absent (jsdom), so every
 *  read is guarded; the subscription also picks up a live pointer-type change. */
const subscribeCoarse = (onChange: () => void) => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mql = window.matchMedia("(pointer: coarse)");
  mql.addEventListener?.("change", onChange);
  return () => mql.removeEventListener?.("change", onChange);
};
const getCoarse = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;
const getServerCoarse = () => false;
/** On hover the rail keeps gliding, slower so you can read it - not a dead stop.
 *  Why not slower: the render pipeline is smooth at any speed (steady fps, sub-pixel
 *  AA verified), but a near-stop crawl (<~10px/s) moves the detail-rich cover
 *  screenshots a tiny fraction of a pixel per frame, and on a 1x-DPI display the eye
 *  reads slow-crawling fine detail as shimmer/judder. At full speed that detail moves
 *  fast enough to blur into clean motion. 0.4 (~25px/s) keeps an obvious "slowed to
 *  read" cue while moving fast enough to glide smoothly. Speed is the only real lever
 *  here - tune this one number to trade slowness against smoothness. */
const HOVER_RATE = 0.4;

/** A press becomes a drag only past this travel; under it, it stays a click. */
const DRAG_THRESHOLD_PX = 8;
/** Release velocity (px/ms) above which a flick keeps the rail coasting. */
const FLICK_MIN_VELOCITY = 0.15;
/** A flick must release within this of the last move - a pointer held still keeps
 *  stale velocity from its earlier travel and must not launch a coast. */
const FLICK_MAX_STALL_MS = 90;
/** Coast decay time constant (ms): velocity falls to 1/e each half-second, so a
 *  moderate flick carries about one card and a hard one clears a couple. */
const COAST_TAU_MS = 500;
/** Near-stop floor (px/ms): a backward flick (against the glide) eases to here
 *  before the ambient advance resumes, and it backstops the forward hand-off too.
 *  A forward flick hands back earlier - the moment it slows to the auto-slide speed
 *  (see coastFrame), so the rail never crawls below its own ambient pace. */
const COAST_MIN_VELOCITY = 0.01;

/** Card cell: fixed responsive width + uniform right margin so the two duplicated
 *  tracks are perfectly periodic and the -100% loop has zero jump. `marquee-cell`
 *  promotes each cell to its own pixel-snapped compositor layer (globals.css) so the
 *  gliding track translates clean per-card textures instead of resampling one giant
 *  texture - which is what bled white sub-pixel seams between cards on hover.
 *
 *  Width: the 920px cap pins the finished 2k reference (it's reached at any width
 *  >=2000px), so the vw term only drives sizing on smaller screens - tuning it down
 *  (52 -> 46vw) shrinks the cards on sub-2k laptops/tablets without touching 2k. */
const CELL = "marquee-cell me-5 shrink-0 md:me-8 w-[clamp(380px,46vw,920px)]";

/**
 * Full-bleed auto-sliding work rail. The list is rendered twice: the real set
 * plus a visual clone (inert + aria-hidden) so screen-reader and keyboard users
 * meet each project exactly once. Both tracks translate 0 -> -100% in lockstep;
 * when the first scrolls fully off, the identical clone has taken its place, so
 * the reset is seamless.
 *
 * On precise-pointer devices the rail is also directly drivable - people
 * instinctively try to grab it, so every such gesture works (.is-draggable in
 * globals.css owns the touch-action / cursor side). Touch-primary devices (coarse
 * pointer) opt out of this scrub layer entirely - a finger swipe should pan the
 * page, not fight the rail - and instead run the ambient pass a bit quicker
 * (TOUCH_DURATION). Everything below scrubs the SAME keyframe animation via the Web
 * Animations API (seeking currentTime on both tracks), so the seamless -100%
 * loop, the compositor pipeline and the hover spotlight stay untouched:
 * - Drag (mouse or touch) past a small threshold grabs the rail 1:1; the press
 *   freezes the auto-advance, and a real drag swallows the card click on
 *   release so browsing never opens a project by accident.
 * - A flick keeps it coasting with exponential decay, then hands back to the
 *   ambient glide.
 * - Horizontal wheel / trackpad deltas scrub it like a native scroller;
 *   vertical wheel (and vertical touch pans, via touch-action) stay with the
 *   page.
 *
 * Hover slows the rail to a drift (instead of the CSS :hover pause, which stays
 * as a no-JS fallback): the live animation's playback rate is eased down with no
 * position jump, and the inline play-state override keeps it running past the
 * stylesheet's pause. Keyboard focus still pauses outright (globals.css), and
 * reduced-motion swaps the whole thing for a native scroll row - the JS layer
 * (glide AND drag) stays off there.
 *
 * Because the rail keeps gliding under a possibly-still pointer, the hover
 * spotlight cannot ride CSS :hover (which the browser only re-evaluates on pointer
 * movement, so it sticks to the card that was under a motionless cursor). While
 * gliding we re-hit-test the pointer each frame and mark the card actually beneath
 * it .is-hovered for the stylesheet to light (see the .js-hover-active rules).
 */
export function WorkMarquee({ items }: { items: CaseStudy[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Touch-primary devices render the quicker TOUCH_DURATION instead of DURATION.
  // `false` on the server and the first client render (hydration-safe), then the real
  // value after mount - the effect below reads the same query directly to gate drag.
  const coarse = useSyncExternalStore(subscribeCoarse, getCoarse, getServerCoarse);

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

    if (typeof window.matchMedia !== "function") return;
    // Reduced motion swaps the marquee for a native hand-scrollable row
    // (globals.css) - no animation to glide or scrub, so the JS layer stays off.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const finePointer = window.matchMedia("(hover: hover)").matches;
    // A coarse primary pointer means a touch-first device (phone / tablet). The
    // drag/flick/wheel scrub below is for precise pointers only; hybrids that keep a
    // fine primary pointer (touch laptops) still report `fine` and keep the gesture.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const tracks = Array.from(
      root.querySelectorAll<HTMLElement>(".marquee-track"),
    );

    // Touch devices: skip the entire scrub layer. Without `.is-draggable` the rail
    // keeps its default touch-action, so a finger swipe pans the page instead of
    // fighting the rail, and a horizontal swipe does nothing (there's no scrub to
    // drive). The quicker TOUCH_DURATION is applied in render via `coarse`; here we
    // just bail before wiring any listeners, so there's nothing to tear down and the
    // bare return leaves no cleanup for this path.
    if (coarsePointer) return;

    // ---------------------------------------------------------------------
    // Playback control, shared by the hover glide and the drag/coast layer.
    // ---------------------------------------------------------------------
    let hovering = false; // fine pointer inside the rail
    let dragging = false; // pointer down and past the drag threshold
    let coasting = false; // still travelling from a flick after release
    type DragSession = {
      id: number;
      startX: number;
      lastX: number;
      lastTs: number;
      velocity: number; // px/ms, EMA-smoothed; sign = pointer direction
      downAnchor: Element | null; // the card pressed - the only focus we may release
    };
    let session: DragSession | null = null;
    let suppressClick = false;

    /** One place decides the rail's speed. While the user drives it (press, drag
     *  or coast) the automatic advance is frozen at rate 0 so it cannot fight the
     *  gesture - the motion comes from seeking currentTime instead. The inline
     *  play-state override keeps the stylesheet's :hover pause from stacking its
     *  own state on top; rate alone expresses everything. */
    const applyRate = () => {
      const scrubbed = session !== null || coasting;
      const glide = !scrubbed && hovering;
      const rate = scrubbed ? 0 : glide ? HOVER_RATE : 1;
      for (const track of tracks) {
        track.style.animationPlayState = scrubbed || glide ? "running" : "";
        // updatePlaybackRate retimes in place (no jump); older engines fall back.
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

    /** Seek every track animation by a content displacement in px (positive =
     *  forward, cards moving left), wrapped into one iteration so the infinite
     *  loop never sees a negative or out-of-range time. Seeking both tracks to
     *  the SAME time also re-locks the clone to the real set on every gesture. */
    const scrubBy = (dxPx: number) => {
      const width = tracks[0]?.offsetWidth ?? 0;
      if (!width) return;
      const anims = tracks.flatMap((t) =>
        typeof t.getAnimations === "function" ? t.getAnimations() : [],
      );
      if (!anims.length) return;
      const base = Number(anims[0].currentTime ?? 0) || 0;
      const next =
        (((base + (dxPx / width) * DURATION_MS) % DURATION_MS) + DURATION_MS) %
        DURATION_MS;
      for (const anim of anims) anim.currentTime = next;
    };

    // ---- Coast: momentum after a flick ----
    let coastRaf = 0;
    let coastVelocity = 0;
    let lastCoastTs = 0;

    const stopCoast = () => {
      coasting = false;
      if (coastRaf) cancelAnimationFrame(coastRaf);
      coastRaf = 0;
    };

    const coastFrame = (ts: number) => {
      // Clamp the step so a background-tab stall cannot teleport the rail.
      // Floor at 0 so a rAF timestamp that predates startCoast's clock read can
      // never back-scrub, and cap the step so a background-tab stall can't teleport.
      const dt = Math.min(Math.max(ts - lastCoastTs, 0), 64);
      lastCoastTs = ts;
      scrubBy(-coastVelocity * dt);
      coastVelocity *= Math.exp(-dt / COAST_TAU_MS);
      // Hand the rail back to the ambient advance the moment the coast has decayed
      // TO it - not once it has crawled to a near-stop far below it. A forward flick
      // (coastVelocity < 0, moving WITH the -100% timeline) shares the auto-advance's
      // direction, so once its forward speed falls to the speed the rail will resume
      // at, the two are indistinguishable: switch there and the motion is continuous
      // (no sub-auto-speed crawl, no snap back up to speed). Match that threshold to
      // what applyRate() will pick next - the hover glide runs slower than full speed.
      // A backward flick opposes the advance, so it still eases to the near-stop floor.
      const width = tracks[0]?.offsetWidth ?? 0;
      const resumeVelocity = width
        ? (width / DURATION_MS) * (hovering ? HOVER_RATE : 1)
        : 0;
      const settled =
        Math.abs(coastVelocity) < COAST_MIN_VELOCITY ||
        (coastVelocity < 0 && -coastVelocity <= resumeVelocity);
      if (settled) {
        stopCoast();
        applyRate();
        return;
      }
      coastRaf = requestAnimationFrame(coastFrame);
    };

    const startCoast = (velocity: number) => {
      coastVelocity = velocity;
      coasting = true;
      lastCoastTs = performance.now();
      applyRate();
      coastRaf = requestAnimationFrame(coastFrame);
    };

    // ---- Drag-to-slide (mouse and touch; touch-action: pan-y leaves vertical
    //      pans to the browser, which then cancels the pointer stream) ----
    const onDown = (e: PointerEvent) => {
      if (e.isPrimary === false || e.button > 0) return;
      // One drag pointer at a time: a second finger (or button) never hijacks a
      // live session, so the `dragging` flag can't leak from one pointer to another.
      if (session) return;
      // Re-arm the one-shot click guard on every fresh press - a click-less touch
      // drag leaves it set, and it must not swallow an unrelated later click.
      suppressClick = false;
      stopCoast(); // grabbing the rail catches it mid-coast
      session = {
        id: e.pointerId ?? -1,
        startX: e.clientX,
        lastX: e.clientX,
        lastTs: performance.now(),
        velocity: 0,
        downAnchor: e.target instanceof Element ? e.target.closest("a") : null,
      };
      applyRate(); // a press freezes the rail - it is being held
    };

    const onDragMove = (e: PointerEvent) => {
      if (!session || (e.pointerId ?? -1) !== session.id) return;
      if (!dragging) {
        if (Math.abs(e.clientX - session.startX) < DRAG_THRESHOLD_PX) return;
        dragging = true;
        root.classList.add("is-dragging");
        // From here the gesture owns the pointer: moves keep arriving outside
        // the rail, and the release click is swallowed below.
        try {
          root.setPointerCapture?.(session.id);
        } catch {
          // jsdom / a pointer that already left - dragging still works inside.
        }
      }
      // The rail follows the finger: pointer left = timeline forward. lastX only
      // advances past the threshold, so the first scrub snaps the rail to the
      // finger's full travel and nothing is lost to the dead zone.
      const dx = e.clientX - session.lastX;
      scrubBy(-dx);
      const now = performance.now();
      const dt = now - session.lastTs;
      if (dt > 0) {
        const instant = dx / dt;
        // EMA smooths jittery per-event deltas into the gesture's velocity; the
        // first sample seeds it so short flicks are not underestimated.
        session.velocity =
          session.velocity === 0
            ? instant
            : session.velocity * 0.8 + instant * 0.2;
      }
      session.lastX = e.clientX;
      session.lastTs = now;
    };

    const endDrag = (e: PointerEvent, canceled: boolean) => {
      if (!session || (e.pointerId ?? -1) !== session.id) return;
      const wasDragging = dragging;
      const downAnchor = session.downAnchor;
      // Only a release still in motion is a flick - a pointer that stalled and
      // lifted wants the rail exactly where it was left.
      const flick =
        !canceled && performance.now() - session.lastTs < FLICK_MAX_STALL_MS
          ? session.velocity
          : 0;
      session = null;
      dragging = false;
      root.classList.remove("is-dragging");
      if (wasDragging && !canceled) {
        // A real drag must not open the card under the pointer on release.
        suppressClick = true;
        // Chromium focuses the pressed card on pointerdown, and focus-within pauses
        // the rail (globals.css, for keyboard users) - left alone, one drag would
        // look like it killed the marquee. Release ONLY that press-focus, so a
        // keyboard user's own focus elsewhere in the rail is never stolen (Firefox
        // and Safari don't focus links on press, so activeElement stays theirs).
        if (downAnchor && document.activeElement === downAnchor) {
          (downAnchor as HTMLElement).blur();
        }
        if (Math.abs(flick) >= FLICK_MIN_VELOCITY) startCoast(flick);
      }
      applyRate();
    };
    const onUp = (e: PointerEvent) => endDrag(e, false);
    const onCancel = (e: PointerEvent) => endDrag(e, true);

    /** Swallow exactly one click after a real drag (capture phase, so the card's
     *  navigation never sees it). Re-armed press-by-press in onDown. */
    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      // Keyboard / programmatic activations arrive with detail 0 and are never a
      // drag artifact; only a real pointer click (detail > 0) is the one to eat. A
      // click-less touch drag can leave the guard armed, and this keeps it from
      // swallowing a later keyboard Enter/Space on a card.
      if (e.detail === 0) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    /** Links and images would start a native HTML5 drag a few px into the
     *  gesture, stealing the pointer stream mid-drag. While a press is live the
     *  gesture wins; selection is likewise a caret concern, not a grab. */
    const onNativeDragStart = (e: Event) => {
      if (session) e.preventDefault();
    };
    const onSelectStart = (e: Event) => {
      if (session) e.preventDefault();
    };

    /** Trackpads emit the horizontal swipe people already aim at the rail. Only a
     *  clearly horizontal gesture is claimed (and scrubs like a native scroller);
     *  vertical wheel keeps scrolling the page. */
    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? root.clientWidth : 1;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      stopCoast();
      applyRate();
      scrubBy(e.deltaX * unit);
    };

    root.classList.add("is-draggable");
    root.addEventListener("pointerdown", onDown, { passive: true });
    root.addEventListener("pointermove", onDragMove, { passive: true });
    // Release handling lives on window: if pointer capture is unavailable the
    // pointer can be let go outside the rail, and the session must still close.
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onCancel, { passive: true });
    root.addEventListener("click", onClickCapture, true);
    root.addEventListener("dragstart", onNativeDragStart);
    root.addEventListener("selectstart", onSelectStart);
    root.addEventListener("wheel", onWheel, { passive: false });

    // ---------------------------------------------------------------------
    // Glide-on-hover + JS spotlight: fine pointers only.
    // ---------------------------------------------------------------------
    //
    // The stylesheet's :hover spotlight (dim every card, keep the hovered one
    // lit) reads the right card only while the rail is paused - the no-JS /
    // coarse-pointer fallback. Here the rail keeps GLIDING under a possibly-
    // still pointer, and CSS :hover does not re-evaluate when content moves
    // under a motionless cursor: it sticks to whatever card was under the
    // cursor when it stopped, so that card stays lit long after it has glided
    // away. With .js-hover-active set, globals.css ignores :hover and follows
    // the .is-hovered card we re-resolve below every frame.
    const pointer = { x: -1, y: -1 };
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
      raf = hovering ? requestAnimationFrame(sample) : 0;
      if (!hovering) return;
      const el = document.elementFromPoint(pointer.x, pointer.y);
      const card = el?.closest("a");
      setLit(card && root.contains(card) ? card : null);
      // The custom cursor's "View" disc reads the hovered project the same way and
      // would likewise stick to the card that glided off; nudge it to re-hit-test
      // at its own last pointer position (it already does this on scroll).
      window.dispatchEvent(new Event("lumako:hover-recheck"));
    };

    const onHoverMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const enter = (e: PointerEvent) => {
      onHoverMove(e);
      hovering = true;
      applyRate();
      if (!raf) raf = requestAnimationFrame(sample);
    };
    const leave = () => {
      hovering = false;
      applyRate();
      setLit(null);
      window.dispatchEvent(new Event("lumako:hover-recheck"));
    };

    if (finePointer) {
      root.classList.add("js-hover-active");
      root.addEventListener("pointerenter", enter);
      root.addEventListener("pointermove", onHoverMove, { passive: true });
      root.addEventListener("pointerleave", leave);
    }

    return () => {
      if (finePointer) {
        root.removeEventListener("pointerenter", enter);
        root.removeEventListener("pointermove", onHoverMove);
        root.removeEventListener("pointerleave", leave);
        hovering = false; // a frame already queued before teardown bails, never re-queues
        if (raf) cancelAnimationFrame(raf);
        setLit(null);
        root.classList.remove("js-hover-active");
      }
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      root.removeEventListener("click", onClickCapture, true);
      root.removeEventListener("dragstart", onNativeDragStart);
      root.removeEventListener("selectstart", onSelectStart);
      root.removeEventListener("wheel", onWheel);
      stopCoast();
      session = null;
      root.classList.remove("is-draggable", "is-dragging");
    };
  }, []);

  return (
    <div ref={rootRef} className="work-marquee group mt-16">
      <div className="flex w-max">
        <div
          className="marquee-track flex shrink-0"
          style={{ animationDuration: coarse ? TOUCH_DURATION : DURATION }}
        >
          {items.map((item) => (
            <div key={item.slug} className={CELL}>
              <WorkSlide item={item} />
            </div>
          ))}
        </div>
        <div
          className="marquee-track flex shrink-0"
          style={{ animationDuration: coarse ? TOUCH_DURATION : DURATION }}
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
