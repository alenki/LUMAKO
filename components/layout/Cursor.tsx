"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { useCursorEnabled } from "@/lib/mediaHooks";

/**
 * The marker cursor - the studio's pen.
 *
 * At rest it is a precise ink reticle (a ring + center dot) tracking the pointer
 * 1:1, with a faint halo so it reads on both the light page and the dark footer.
 * Over a clickable target the SAME rough gold loop the hero draws around a word
 * (see HeroMarker) snaps to wrap that element and self-draws, then un-draws as
 * you leave - so the cursor annotates what you are about to click with the same
 * hand that draws the hero. Over a text field the reticle becomes a slim I-beam.
 *
 * Gold appears ONLY on hover, never at rest, keeping lume the rare signal the
 * brandbook demands. Pointer-fine + motion-allowed only (see useCursorEnabled);
 * the whole layer is decorative (aria-hidden) and never intercepts pointer events.
 */

/** Slow-in slow-out curve - matches HeroMarker's pen-drawing feel. */
const DRAW_EASE = [0.5, 0, 0.3, 1] as const;

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

/** Build the loop path that wraps an element's current on-screen box. */
function loopFromRect(rect: DOMRect): string {
  return roughLoop(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    Math.max(rect.width / 2 + PAD_X, 16),
    Math.max(rect.height / 2 + PAD_Y, 13),
  );
}

const TEXT_SELECTOR = "input, textarea, [contenteditable=''], [contenteditable='true']";
const LINK_SELECTOR = "a, button, summary, label, [role='button'], [data-cursor]";

type Mode = "rest" | "link" | "text";

export function Cursor() {
  const enabled = useCursorEnabled();
  const [hidden, setHidden] = useState(true);
  const [mode, setMode] = useState<Mode>("rest");
  const [loop, setLoop] = useState<string | null>(null);
  const [loopKey, setLoopKey] = useState(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Refs let the high-frequency move handler avoid redundant state writes.
  const modeRef = useRef<Mode>("rest");
  const hiddenRef = useRef(true);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-cursor");

    const setMode_ = (m: Mode) => {
      if (modeRef.current !== m) {
        modeRef.current = m;
        setMode(m);
      }
    };
    const setHidden_ = (h: boolean) => {
      if (hiddenRef.current !== h) {
        hiddenRef.current = h;
        setHidden(h);
      }
    };

    const wrap = (el: Element) => {
      targetRef.current = el;
      setLoop(loopFromRect(el.getBoundingClientRect()));
      setLoopKey((k) => k + 1); // remount the path so it draws from scratch
    };

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden_(false);

      const el = e.target instanceof Element ? e.target : null;

      if (el?.closest(TEXT_SELECTOR)) {
        targetRef.current = null;
        setMode_("text");
        return;
      }

      const link = el?.closest(LINK_SELECTOR) ?? null;
      if (link) {
        setMode_("link");
        if (link !== targetRef.current) wrap(link);
        return;
      }

      targetRef.current = null;
      setMode_("rest");
    };

    const leave = () => setHidden_(true);

    // Keep the loop glued to its element while the page moves under it.
    let raf = 0;
    const resync = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = targetRef.current;
        if (el && document.contains(el)) setLoop(loopFromRect(el.getBoundingClientRect()));
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", resync, { passive: true });
    window.addEventListener("resize", resync, { passive: true });
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", resync);
      window.removeEventListener("resize", resync);
      document.removeEventListener("mouseleave", leave);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[400]"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.25s" }}
    >
      {/* The gold marker loop wrapping the hovered target. */}
      <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none">
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

      {/* The nib: a precise ink reticle, or a slim I-beam over text. */}
      {mode === "text" ? (
        <motion.span
          className="absolute left-0 top-0 -ml-px -mt-[11px] h-[22px] w-0.5 rounded-full bg-fg"
          style={{ x, y, boxShadow: "0 0 0 0.5px rgba(255,255,255,0.45)" }}
        />
      ) : (
        <motion.svg
          className="absolute left-0 top-0 -ml-[11px] -mt-[11px] overflow-visible"
          width="22"
          height="22"
          viewBox="-11 -11 22 22"
          fill="none"
          style={{ x, y, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.22))" }}
        >
          {/* Halo (legible on the dark footer) under a crisp ink ring + dot. */}
          <circle r="6.5" fill="none" stroke="#ffffff" strokeWidth="3.5" opacity="0.5" />
          <circle r="6.5" fill="none" stroke="var(--color-fg)" strokeWidth="1.5" />
          <circle r="2.4" fill="#ffffff" opacity="0.5" />
          <circle r="1.7" fill="var(--color-fg)" />
        </motion.svg>
      )}
    </div>
  );
}
