"use client";

import { motion, useTime, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";

/**
 * The studio section - a full-viewport, type-driven editorial statement. A lead
 * ("Lumako is a full-stack studio"), a small living mark, then a wide "what we make"
 * line that carries across at least half the page. Left-indented column, vertically
 * centred in the viewport. Big type, oceans of air. Minimal by design.
 */

// --- The Living Mark (viewBox 0 0 60 60) -------------------------------------
// One wireframe that perpetually re-forms itself, flowing through a vocabulary of
// geometric "stations" - a sphere, a cluster of bubbles, a spool, a lens, a ringed
// planet - all built from circles and ellipses. THREE persistent ellipse "slots"
// carry the whole vocabulary: each station just reassigns the three lines a new role,
// so every line is always present and solid (no fades, no gray), and one form morphs
// cleanly into the next by interpolating centre + radii on a single clock - the loop is
// seamless by construction. The whole mark also turns slowly, on its own period, so it
// spins (the cluster's bubbles and the planet's moon orbit) and never repeats exactly.
// Pure black ink: the section's one sanctioned lume accent is the "Lumako." wordmark dot.

const C = 30; // centre (cx = cy)
const PER_STATION = 1.25; // seconds per station beat (a hold + the morph to the next)
const HOLD = 0.28; // fraction of each beat spent resting at the state before moving on
const ROT_PERIOD = 9; // seconds per full turn of the whole mark - a gentle, deliberate spin
const STROKE = 4.4; // single heavy weight (viewBox units), so every line matches

const K = 0.5522847498; // cubic-bezier control offset for a quarter ellipse (kappa)

/** A vertical ellipse centred at (cx,cy) with horizontal radius |rx| and vertical
 *  radius ry, drawn as four cubic segments. Handles rx<=0 (edge-on) via abs, so a
 *  collapsing meridian reads as a clean vertical line. Every slot uses this same
 *  four-cubic structure, which is what lets one path morph smoothly into another. */
function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  const a = Math.abs(rx);
  const ox = a * K;
  const oy = ry * K;
  return (
    `M ${cx + a} ${cy} ` +
    `C ${cx + a} ${cy + oy} ${cx + ox} ${cy + ry} ${cx} ${cy + ry} ` +
    `C ${cx - ox} ${cy + ry} ${cx - a} ${cy + oy} ${cx - a} ${cy} ` +
    `C ${cx - a} ${cy - oy} ${cx - ox} ${cy - ry} ${cx} ${cy - ry} ` +
    `C ${cx + ox} ${cy - ry} ${cx + a} ${cy - oy} ${cx + a} ${cy}`
  );
}

// Rendered footprint - fluid, so the mark scales with the section's type instead of
// looming at a fixed 120px once the copy shrinks below the locked 2k reference. The
// clamp mirrors the "what we make" line's clamp scaled by 1.111x (120px / 108px), the
// proportion the mark holds against that line at the reference - so it stays exactly
// 1.111x the craft line at every width and shrinks in lockstep with the type.
const MARK_SIZE = "size-[clamp(3.333rem,8.333vw,7.5rem)] overflow-visible";

// One ellipse slot's state. Three of these compose a station.
type Slot = { cx: number; cy: number; rx: number; ry: number };
type Station = [Slot, Slot, Slot];

/** Build a slot, defaulting to a centred circle. */
const ring = (rx: number, ry = rx, cx = C, cy = C): Slot => ({ cx, cy, rx, ry });

// The cyclic loop of stations. Three lines [a, b, c] are reassigned a role at each one;
// where a station only needs two lines (sphere, lens) the third rides exactly on another,
// so it stays solid black and then splits away into the next form. The lines that move
// off-centre (bubbles, moon) are carried around by the mark's slow turn - that is the spin.
const STATIONS: readonly Station[] = [
  // 0 - SPHERE: outline circle + meridian (the third line hides on the meridian)
  [ring(24), ring(13, 24), ring(13, 24)],
  // 1 - CLUSTER: the outline holds while the two inner lines become bubbles, one large
  //     upper-left, one small lower-right - the turn orbits them around the centre
  [ring(24), ring(11, 11, 23, 23), ring(6.5, 6.5, 39, 39)],
  // 2 - SPOOL: the outline flattens to a waist ellipse pinched by a top and bottom circle
  [ring(15, 6), ring(9, 9, C, C - 13), ring(9, 9, C, C + 13)],
  // 3 - LENS: two equal circles overlapping (the third rides on the left circle)
  [ring(19, 19, C - 7), ring(19, 19, C + 7), ring(19, 19, C - 7)],
  // 4 - PLANET: a planet, a wide ring across it, and a small moon set off the ring
  [ring(12, 12), ring(24, 7), ring(4.5, 4.5, C + 18, C - 12)],
];

// Smoothstep - eased station crossings with zero velocity at each end, so each beat
// glides to a stop, holds, and accelerates away without a snap, and the loop stays seamless.
const ease = (x: number) => x * x * (3 - 2 * x);

// One reusable scratch slot. blend() mutates and returns it; each transform reads the
// primitives it needs and returns a fresh string, so nothing downstream shares this
// reference (motion's change detection stays intact) and no slot is allocated per frame.
// Safe because transforms run synchronously, one at a time, on the main thread.
const scratch: Slot = { cx: 0, cy: 0, rx: 0, ry: 0 };

/** Resolve slot `i` at clock time `ms`: the current station blended into the next.
 *  Each beat first holds at the current station (the first HOLD of the beat), then eases
 *  across to the next. Periodic by construction - floor(t) stays an exact integer for the
 *  page's lifetime, so the loop never drifts, jumps, or NaNs. */
function blend(ms: number, i: number): Slot {
  const k = STATIONS.length;
  const t = ms / 1000 / PER_STATION;
  const base = Math.floor(t);
  const frac = t - base;
  const f = ease(frac <= HOLD ? 0 : (frac - HOLD) / (1 - HOLD));
  const a = STATIONS[((base % k) + k) % k][i];
  const b = STATIONS[(((base % k) + k) % k + 1) % k][i];
  scratch.cx = a.cx + (b.cx - a.cx) * f;
  scratch.cy = a.cy + (b.cy - a.cy) * f;
  scratch.rx = a.rx + (b.rx - a.rx) * f;
  scratch.ry = a.ry + (b.ry - a.ry) * f;
  return scratch;
}

/** One animated stroke - derives its path straight off the shared clock, so there is no
 *  per-frame allocation beyond the path string SVG requires. Solid black, never dimmed. */
function Stroke({ time, i }: { time: MotionValue<number>; i: number }) {
  const d = useTransform(time, (ms) => {
    const s = blend(ms, i);
    return ellipsePath(s.cx, s.cy, s.rx, s.ry);
  });
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--color-fg)"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** The animated mark. Lives in its own component so the reduced-motion path can avoid
 *  mounting it entirely (and so registers no animation frame). A single useTime clock
 *  drives both the morph and the slow turn; the turn runs on its own period (not the
 *  morph's), so the two drift against each other and the mark never repeats exactly. */
function MorphMark() {
  const time = useTime();
  const rotate = useTransform(time, (ms) => (ms / 1000 / ROT_PERIOD) * 360);
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden="true" className={MARK_SIZE}>
      <motion.g style={{ rotate, transformBox: "view-box", transformOrigin: "30px 30px" }}>
        <Stroke time={time} i={0} />
        <Stroke time={time} i={1} />
        <Stroke time={time} i={2} />
      </motion.g>
    </svg>
  );
}

/** Reduced motion: a composed static frame (station 0, the sphere) - visually identical to
 *  the morph's time=0, rotation=0 first frame, so swapping to it is invisible. Solid black ink. */
function StaticMark() {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden="true" className={MARK_SIZE}>
      <circle cx={C} cy={C} r={24} fill="none" stroke="var(--color-fg)" strokeWidth={STROKE} />
      <path
        d={ellipsePath(C, C, 13, 24)}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The mark - a Living Mark. `reduce` comes from the SSR-safe useReducedMotion (false on
 * the server and first client render), so the morph renders first and matches the server;
 * after hydration, reduced-motion users swap to the static frame - which equals the morph's
 * time=0 first frame, so the swap is invisible - and the clock unmounts with MorphMark.
 */
function StudioMark({ reduce }: { reduce: boolean }) {
  if (reduce) return <StaticMark />;
  return <MorphMark />;
}

export function Studio() {
  const s = copy.home.studio;
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative flex min-h-dvh flex-col justify-center py-[clamp(4rem,12vh,8rem)]">
      <div className="container-x">
        {/* The editorial left-indent is a wide-screen flourish that holds its full 18vw
            on desktop, then tapers smoothly to a full-width column as the window narrows -
            no hard breakpoint, so the block never snaps to the left edge. The taper is fit
            to a measured envelope (the widest "what we make" line must not orphan); see
            .studio-indent in globals.css for the full rationale. */}
        <div className="studio-indent">
          {/* the lead - the main headline, scaled up to carry the now type-only section */}
          <TextReveal
            as="h2"
            text={s.lead}
            dotAfter="Lumako"
            stagger={0.04}
            className="block max-w-[15ch] font-display text-[length:clamp(3rem,9.3vw,8.75rem)] font-medium leading-[1.0] tracking-[-0.03em] text-balance"
          />

          {/* the mark - the section's single living gesture, set tight to the lines */}
          <div className="mt-2 md:mt-3">
            <StudioMark reduce={reduce} />
          </div>

          {/* the "what we make" statement - same flowing voice. At >=640px it sets a size
              down from the lead with the hand-baked, length-balanced breaks (see copy.ts) -
              the locked reference. On phones (<640px) it grows to match the lead, and the
              baked breaks are stripped so it auto-wraps with text-pretty - at the bigger
              type a hard break would orphan a word ("...build, and" / "and"), so we let it
              flow and never leave a line a single word. Both share one clamp, so the size is
              continuous across the swap; only the wrapping changes. */}
          <TextReveal
            as="p"
            text={s.craft}
            delay={0.1}
            stagger={0.028}
            className="mt-2 block max-w-[26ch] font-display text-[length:clamp(3rem,7.5vw,6.75rem)] font-semibold leading-[1.06] tracking-[-0.02em] max-[639px]:hidden"
          />
          {/* On phones the craft matches the lead's size, so it also takes the lead's
              font-medium weight (not the desktop sub-heading semibold) and its tracking,
              so the two blocks read as one weight - no "thicker" mismatch at equal size. */}
          <TextReveal
            as="p"
            text={s.craft.replace(/\n/g, " ")}
            delay={0.1}
            stagger={0.028}
            className="mt-2 hidden max-w-[26ch] font-display text-[length:clamp(3rem,7.5vw,6.75rem)] font-medium leading-[1.06] tracking-[-0.03em] text-pretty max-[639px]:block"
          />
        </div>
      </div>
    </section>
  );
}
