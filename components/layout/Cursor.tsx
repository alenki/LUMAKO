"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useCursorEnabled } from "@/lib/mediaHooks";

/**
 * The marker cursor - the studio's pen.
 *
 * It is a small dot pinned to the pointer (fast) with a larger ring trailing
 * behind it on a spring (slow), so the ring lags and catches up as you slow down.
 * Both are painted white in `mix-blend-mode: difference`, so they invert against
 * whatever is behind them: black on the light page, white over the dark footer -
 * and pixel-by-pixel at any edge, so only the part actually over a dark area turns
 * white. Holding the button fills the dot out toward the ring.
 *
 * Over a clickable target the SAME rough gold loop the hero draws around a word
 * (see HeroMarker) snaps to wrap that element and self-draws, then un-draws as you
 * leave - the cursor annotates what you are about to click with the hero's hand.
 * Over a text field the reticle becomes a slim I-beam.
 *
 * Gold appears ONLY on hover, keeping lume the rare signal the brandbook demands.
 * Pointer-fine + motion-allowed only (see useCursorEnabled); the whole layer is
 * decorative (aria-hidden) and never intercepts pointer events.
 */

/** Slow-in slow-out curve - matches HeroMarker's pen-drawing feel. */
const DRAW_EASE = [0.5, 0, 0.3, 1] as const;
/** Expo-out, the site's default settle. */
const SETTLE = [0.22, 1, 0.36, 1] as const;
/** The outer ring trails the dot but catches up quickly - the natural frequency
    sqrt(stiffness/mass) is ~2.1x the earlier feel, same near-critical damping. */
const RING_SPRING = { stiffness: 900, damping: 50, mass: 0.7 };

/** How far the loop sits outside the element it wraps. */
const PAD_X = 12;
const PAD_Y = 9;

/** Smooth a ring of points into one open cubic-bezier path (Catmull-Rom). */
function splinePath(points: [number, number][]): string {
  if (points.length < 2) return "";
  const f = (n: number) => n.toFixed(1);
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/**
 * A rough, slightly overshooting hand-drawn loop around (cx, cy) with radii
 * (rx, ry), in absolute client coordinates. The wobble is a deterministic
 * function of the angle (no per-frame randomness) so the loop is stable and
 * never flickers. The sweep runs a little past a full turn so the ends cross,
 * giving the open "marker loop" the hero uses.
 */
function roughLoop(cx: number, cy: number, rx: number, ry: number): string {
  const START = -Math.PI * 0.85; // begin upper-left, like the hero
  const TURNS = Math.PI * 2 + 0.5; // overshoot so the ends cross
  const N = 16;
  const points: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const a = START + TURNS * (i / N);
    const wob = 1 + 0.03 * Math.sin(3 * a + 0.7) + 0.022 * Math.cos(2 * a + 2.1);
    points.push([
      cx + Math.cos(a) * rx * wob,
      cy + Math.sin(a) * ry * wob,
    ]);
  }
  return splinePath(points);
}

/**
 * Build the loop path that wraps an element's box, in DOCUMENT coordinates
 * (the page scroll offset folded into the centre). The loop layer is positioned
 * in document space, so drawing at document coords lets the browser scroll the
 * loop in lockstep with the element - glued to the button, with no per-frame JS
 * and none of the lag a scroll-listener re-measure would add under smooth scroll.
 */
function loopFromRect(rect: DOMRect, scrollX: number, scrollY: number): string {
  return roughLoop(
    rect.left + rect.width / 2 + scrollX,
    rect.top + rect.height / 2 + scrollY,
    Math.max(rect.width / 2 + PAD_X, 16),
    Math.max(rect.height / 2 + PAD_Y, 13),
  );
}

/**
 * True when the element is painted in VIEWPORT space, not page space - i.e. it
 * sits inside a `position: fixed` ancestor (the navbar), so it stays put as the
 * page scrolls. Such a target's loop must live in the fixed layer and skip the
 * scroll offset, or - drawn in document space - it would scroll away from a link
 * that never moves. Walks the ancestor chain; `wrap` calls this only on a fresh
 * target, so the per-node getComputedStyle never lands on a hot path.
 */
function isViewportAnchored(el: Element): boolean {
  for (let node: Element | null = el; node; node = node.parentElement) {
    if (getComputedStyle(node).position === "fixed") return true;
  }
  return false;
}

const TEXT_SELECTOR = "input, textarea, [contenteditable=''], [contenteditable='true']";
const LINK_SELECTOR = "a, button, summary, label, [role='button'], [data-cursor]";
/** Clickable targets that opt out of the gold loop, keeping the plain reticle. */
const QUIET_SELECTOR = "[data-cursor='quiet']";
/** Project covers that swap the reticle for the filled lume "View" disc. */
const VIEW_SELECTOR = "[data-cursor='view']";

type Mode = "rest" | "link" | "text" | "view";

export function Cursor() {
  const enabled = useCursorEnabled();
  const [hidden, setHidden] = useState(true);
  const [mode, setMode] = useState<Mode>("rest");
  const [pressed, setPressed] = useState(false);
  const [loop, setLoop] = useState<string | null>(null);
  // Whether the current loop lives in the fixed (viewport) layer rather than the
  // absolute (document) layer - true for targets inside the fixed navbar.
  const [loopFixed, setLoopFixed] = useState(false);
  const [loopKey, setLoopKey] = useState(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The dot uses x/y directly (pinned to the pointer); the ring trails on a
  // spring, so it lags behind and catches up when the pointer slows.
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);

  // The element the loop currently wraps, so moving within the same target
  // doesn't redraw it. The loop is drawn once in document space and then the
  // browser scrolls it with the page (see loopFromRect), so it stays glued to
  // the element without a scroll handler; it is only re-measured on the next move.
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-cursor");

    const wrap = (el: Element) => {
      targetRef.current = el;
      // A fixed-layer target (the navbar) stays in the viewport as the page
      // scrolls, so draw its loop at viewport coords (no scroll offset) and render
      // it in the fixed layer. Page targets fold the scroll offset in and ride the
      // absolute layer, which the browser scrolls glued to them.
      const fixed = isViewportAnchored(el);
      const rect = el.getBoundingClientRect();
      setLoop(
        fixed
          ? loopFromRect(rect, 0, 0)
          : loopFromRect(rect, window.scrollX, window.scrollY),
      );
      setLoopFixed(fixed);
      setLoopKey((k) => k + 1); // remount the path so it draws from scratch
    };

    // Last pointer position (viewport coords) and whether it is in the window.
    // Plain closure vars: this effect runs once (x/y are stable motion values),
    // so they live for its lifetime without the churn of refs.
    const pointer = { x: -100, y: -100 };
    let inside = false;

    // Decide which mode the element under the pointer warrants, wrapping it if it
    // is a fresh gold-loop target. Shared by pointer moves AND by scroll - where
    // the page slides under a still pointer, so the element beneath it changes
    // with no mousemove to react to.
    const resolve = (el: Element | null) => {
      let next: Mode = "rest";
      if (el?.closest(TEXT_SELECTOR)) {
        next = "text";
        targetRef.current = null;
      } else if (el?.closest(VIEW_SELECTOR)) {
        // Project covers get the filled "View" disc instead of the gold loop.
        next = "view";
        targetRef.current = null;
      } else if (el?.closest(QUIET_SELECTOR)) {
        // Opt-out targets (data-cursor="quiet") keep the plain reticle - no loop.
        targetRef.current = null;
      } else {
        const link = el?.closest(LINK_SELECTOR) ?? null;
        if (link) {
          next = "link";
          if (link !== targetRef.current) wrap(link);
        } else {
          targetRef.current = null;
        }
      }
      setMode((prev) => (prev === next ? prev : next));
    };

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      inside = true;
      // Functional updates bail out on no-ops without an external ref guard -
      // a ref guard can desync from state and pin the cursor hidden forever.
      setHidden((prev) => (prev ? false : prev));
      resolve(e.target instanceof Element ? e.target : null);
    };

    // Scrolling moves the page under a still pointer, so what sits beneath the
    // cursor changes with no mousemove firing. Re-run the hit-test at the last
    // pointer position (rAF-throttled, hit-testing forces layout) so hover state
    // follows the page - both catching a target that scrolls under the cursor and
    // dropping one that scrolls away. The gold loop is still anchored in document
    // space, so it keeps scrolling glued to its target with no re-measure here.
    let scrollRaf = 0;
    const onScroll = () => {
      if (!inside || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        resolve(document.elementFromPoint(pointer.x, pointer.y));
      });
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      inside = false;
      setHidden(true);
      setPressed(false);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    // Same "content moved under a still pointer" case as scroll, but driven by an
    // in-place CSS animation (the work marquee glides its cards under the cursor).
    // The rail fires this each frame so the View disc follows the project actually
    // beneath the cursor instead of sticking to the card that glided away.
    window.addEventListener("lumako:hover-recheck", onScroll, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    window.addEventListener("blur", up);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("lumako:hover-recheck", onScroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", up);
      document.removeEventListener("mouseleave", leave);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const fade = { opacity: hidden ? 0 : 1, transition: "opacity 0.2s" };

  // One loop definition, rendered into whichever layer matches the target's
  // coordinate space (see the two <svg> layers below). Keyed on loopKey so a
  // fresh target remounts the path and self-draws from scratch.
  const loopPath =
    mode === "link" && loop ? (
      <motion.path
        key={loopKey}
        d={loop}
        stroke="var(--color-lume)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.3, ease: DRAW_EASE },
          opacity: { duration: 0.12 },
        }}
      />
    ) : null;

  return (
    // Static wrapper - deliberately NOT a stacking context (no position/z-index).
    // Each element below is `fixed` itself so `mix-blend-mode: difference` blends
    // against the page; wrapping them in a fixed/z-index box would isolate the
    // blend (the reticle would render white and vanish on the light page).
    <div aria-hidden className="pointer-events-none">
      {/* Both elements are white in `mix-blend-mode: difference`, so they invert
          against the page. The ring is painted first so the dot blends cleanly. */}

      {/* Outer ring - trails the dot on a spring and sits well outside it.
          Hidden over text, where the I-beam stands alone. */}
      <motion.svg
        className="fixed left-0 top-0 z-[400] -ml-5 -mt-5 overflow-visible"
        width="40"
        height="40"
        viewBox="-20 -20 40 40"
        fill="none"
        style={{ x: ringX, y: ringY, mixBlendMode: "difference" }}
        initial={false}
        animate={{ opacity: hidden || mode === "text" || mode === "view" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <circle r="17" fill="none" stroke="#fff" strokeWidth="1.5" />
      </motion.svg>

      {/* Inner nib - pinned to the pointer (fast). A slim I-beam over text,
          otherwise a dot that fills out toward the ring while pressed. */}
      {mode === "text" ? (
        <motion.span
          className="fixed left-0 top-0 z-[400] -ml-px -mt-[11px] h-[22px] w-0.5 rounded-full"
          style={{ x, y, background: "#fff", mixBlendMode: "difference" }}
          initial={false}
          animate={{ opacity: hidden ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.svg
          className="fixed left-0 top-0 z-[400] -ml-5 -mt-5 overflow-visible"
          width="40"
          height="40"
          viewBox="-20 -20 40 40"
          fill="none"
          style={{ x, y, mixBlendMode: "difference" }}
          initial={false}
          animate={{ opacity: hidden || mode === "view" ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.circle
            r="3"
            fill="#fff"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={false}
            animate={{ scale: pressed ? 5.2 : 1 }}
            transition={{ duration: pressed ? 0.3 : 0.18, ease: SETTLE }}
          />
        </motion.svg>
      )}

      {/* The gold marker loop wrapping the hovered target. Unlike the reticle
          above (fixed to the viewport, pinned to the pointer), this layer is
          ABSOLUTE - it lives in the page, drawn at the target's document coords -
          so it scrolls glued to the button instead of floating over the viewport. */}
      <svg className="absolute inset-0 z-[400] h-full w-full overflow-visible" fill="none" style={fade}>
        <AnimatePresence>
          {mode === "link" && loop && (
            <motion.path
              key={loopKey}
              d={loop}
              stroke="var(--color-lume)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{
                pathLength: { duration: 0.3, ease: DRAW_EASE },
                opacity: { duration: 0.12 },
              }}
            />
          )}
        </AnimatePresence>
      </svg>

      {/* The "View" disc shown over a project cover (data-cursor="view"). It grows
          out of the reticle: a tiny ink point swells into a full lume coin, warming
          from ink to gold, and the label only resolves once the disc is large
          enough to hold it. Opaque (no blend) so it reads as a sticker laid over
          the photo; dark ink keeps the label crisp on gold. The disc trails the
          pointer on the same ring spring. */}
      <AnimatePresence>
        {mode === "view" && (
          <motion.div
            key="view-disc"
            className="fixed left-0 top-0 z-[400] -ml-12 -mt-12 flex size-24 select-none items-center justify-center rounded-full font-mono"
            style={{
              x: ringX,
              y: ringY,
              color: "var(--color-fg)",
              fontSize: "0.8125rem",
              letterSpacing: "0.06em",
            }}
            initial={{ scale: 0.07, opacity: 0, backgroundColor: "#0a0a0a" }}
            animate={{ scale: pressed ? 0.9 : 1, opacity: 1, backgroundColor: "#d49a2e" }}
            exit={{ scale: 0.07, opacity: 0, backgroundColor: "#0a0a0a" }}
            transition={{ duration: 0.62, ease: SETTLE, opacity: { duration: 0.18 } }}
          >
            {/* Fades in only after the coin has mostly formed. */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: SETTLE, delay: 0.34 }}
            >
              View
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
