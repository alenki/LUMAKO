"use client";

import { motion, useTime, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";

/**
 * The studio section - a full-viewport, type-driven editorial statement. A lead
 * ("Lumako is a full-stack studio"), a small drawn mark, then a wide "what we make"
 * line that carries across at least half the page. Left-indented column, vertically
 * centred in the viewport. Big type, oceans of air. Minimal by design.
 */

// --- Orbital Sphere geometry (viewBox 0 0 60 60) -----------------------------
// A clean wireframe sphere turning about its vertical axis: a fixed outline circle,
// one great-circle meridian that sweeps from edge-on (a vertical line) to face-on
// (half-width R*cos(angle)) - that sweep IS the spin - and a single lume node
// orbiting the equator, brightening at the front and dimming as it rounds the back.
const SPHERE = {
  c: 30, // centre (cx = cy)
  R: 24, // radius
  period: 9, // seconds per revolution - quiet, hypnotic
} as const;

const K = 0.5522847498; // cubic-bezier control offset for a quarter ellipse (kappa)

/** A vertical ellipse centred at (cx,cy) with horizontal radius |rx| and vertical
 *  radius ry, drawn as four cubic segments. Handles rx<=0 (edge-on) via abs. */
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

// Rendered size - a wide, round footprint that sits with the bold type.
const SIZE = { w: 120, h: 120 } as const;
// Stroke weights (viewBox units) - heavy, to match the type around it.
const STROKE = { circle: 4.2, meridian: 3.6 } as const;
// The single lume node, a small dot of this radius.
const NODE_R = 3.8;

/** The lone great-circle meridian. Its projected half-width = R*cos(theta) sweeps
 *  from edge-on (a vertical line) to face-on (the full circle) and back, which reads
 *  as the sphere turning. Solid ink, like the outline circle. */
function Meridian({ theta }: { theta: MotionValue<number> }) {
  const d = useTransform(theta, (t) => ellipsePath(SPHERE.c, SPHERE.c, SPHERE.R * Math.cos(t), SPHERE.R));
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--color-fg)"
      strokeWidth={STROKE.meridian}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/**
 * The mark - an Orbital Sphere. A clean thin-ink wireframe that turns perpetually
 * about its vertical axis (the section's single living gesture): an outline circle,
 * one great-circle meridian sweeping edge-on to face-on, and the one lume node - the
 * section's one sanctioned accent - orbiting the equator, brightening at the front
 * and dimming as it rounds the back. A single useTime clock drives everything through
 * sin/cos, so the loop is seamless by construction: no keyframe restart to flash.
 */
function StudioMark({ reduce }: { reduce: boolean }) {
  // One perpetual clock. sin/cos are exactly periodic, so each derived value returns
  // to itself every revolution. Hooks run unconditionally; the reduced branch below
  // simply ignores the live values and paints a composed static frame.
  const time = useTime();
  const theta = useTransform(time, (ms) => (ms / 1000 / SPHERE.period) * Math.PI * 2);

  // Faint axial sway for a touch of float - same clock, so still seamless.
  const tilt = useTransform(theta, (t) => Math.cos(t) * 3);

  // The lume node orbits the equator: x = R*sin(theta); depth = cos(theta).
  const nodeX = useTransform(theta, (t) => SPHERE.R * Math.sin(t));
  const nodeDepth = useTransform(theta, (t) => Math.cos(t)); // +1 front, -1 behind
  const nodeScale = useTransform(nodeDepth, [-1, 1], [0.55, 1.15]);
  const nodeOpacity = useTransform(nodeDepth, [-1, 0, 1], [0.42, 0.72, 1]);

  // ---- Reduced motion: a composed static three-quarter view (no loop) ----
  if (reduce) {
    const ang = (38 * Math.PI) / 180;
    const nx = SPHERE.c + SPHERE.R * Math.sin(ang); // front-right on the equator
    return (
      <svg width={SIZE.w} height={SIZE.h} viewBox="0 0 60 60" fill="none" aria-hidden="true" className="overflow-visible">
        <circle cx={SPHERE.c} cy={SPHERE.c} r={SPHERE.R} fill="none" stroke="var(--color-fg)" strokeWidth={STROKE.circle} />
        <path
          d={ellipsePath(SPHERE.c, SPHERE.c, SPHERE.R * Math.cos(ang), SPHERE.R)}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE.meridian}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={nx} cy={SPHERE.c} r={NODE_R} fill="var(--color-lume)" />
      </svg>
    );
  }

  // ---- Perpetual loop ----
  return (
    <svg width={SIZE.w} height={SIZE.h} viewBox="0 0 60 60" fill="none" aria-hidden="true" className="overflow-visible">
      <motion.g style={{ rotate: tilt, transformBox: "view-box", transformOrigin: "30px 30px" }}>
        {/* fixed outline circle - the sphere's silhouette */}
        <circle cx={SPHERE.c} cy={SPHERE.c} r={SPHERE.R} fill="none" stroke="var(--color-fg)" strokeWidth={STROKE.circle} />

        {/* the lone meridian, sweeping edge-on to face-on - the spin read */}
        <Meridian theta={theta} />

        {/* the one lume node, orbiting the equator with honest depth (scale + dim as it rounds the back) */}
        <motion.g style={{ x: nodeX, scale: nodeScale, opacity: nodeOpacity, transformBox: "view-box", transformOrigin: "30px 30px" }}>
          <circle cx={SPHERE.c} cy={SPHERE.c} r={NODE_R} fill="var(--color-lume)" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

export function Studio() {
  const s = copy.home.studio;
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative flex min-h-dvh flex-col justify-center py-[clamp(4rem,12vh,8rem)]">
      <div className="container-x">
        <div className="md:pl-[18vw]">
          {/* the lead - the main headline, scaled up to carry the now type-only section */}
          <TextReveal
            as="h2"
            text={s.lead}
            dotAfter="Lumako"
            stagger={0.04}
            className="block max-w-[15ch] font-display text-[length:clamp(3rem,10.5vw,9.75rem)] font-medium leading-[1.0] tracking-[-0.03em] text-balance"
          />

          {/* the mark - the section's single lume accent, set tight to the lines */}
          <div className="mt-6 md:mt-8">
            <StudioMark reduce={reduce} />
          </div>

          {/* the "what we make" statement - same flowing voice a size down. Breaks are
              baked into the copy (see copy.ts) so it sets as three length-balanced lines. */}
          <TextReveal
            as="p"
            text={s.craft}
            delay={0.1}
            stagger={0.028}
            className="mt-6 block max-w-[26ch] font-display text-[length:clamp(2rem,7.5vw,6.75rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
          />
        </div>
      </div>
    </section>
  );
}
