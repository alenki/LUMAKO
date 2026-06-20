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

// --- Meridian Gem geometry (viewBox 0 0 48 60) -------------------------------
// The studio's diamond, resolved into a wireframe bipyramid spun about its Y axis.
// Centre (24,30); poles at y=8/52 (vertical radius 22); equator half-width R=14.
// A meridian projects to a vertical ellipse whose horizontal radius is R*cos(angle):
// it passes through true edge-on (rx->0) and reopens - that pass-through IS the spin.
const GEM = {
  cx: 24,
  cy: 30,
  R: 14, // equatorial half-width
  ryM: 22, // meridian vertical radius (pole to equator)
  ryEq: 3.4, // equator belt vertical radius (perspective-flattened)
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

const SILHOUETTE = "M24 8 L38 30 L24 52 L10 30 Z"; // the constant profile of the Y-spinning diamond

// Rendered size (the viewBox stays 48x60; this just scales the whole mark up).
const SIZE = { w: 64, h: 80 } as const;
// Stroke weights (viewBox units) - heavy, to sit with the bold type around it.
const STROKE = { frame: 3.4, meridian: 2.8, belt: 2.6 } as const;
// The single lume node, drawn as a diamond of this half-width.
const NODE_R = 3.4;
const nodePath = (cx: number, cy: number) =>
  `M ${cx} ${cy - NODE_R} L ${cx + NODE_R} ${cy} L ${cx} ${cy + NODE_R} L ${cx - NODE_R} ${cy} Z`;

/** One spinning meridian. `phase` (radians) offsets it around the Y axis; its
 *  projected half-width = R*cos(theta+phase), edge-on twice a turn. Opacity falls
 *  toward edge-on so the wire reads thinner side-on than face-on. */
function Meridian({ theta, phase }: { theta: MotionValue<number>; phase: number }) {
  const d = useTransform(theta, (t) => ellipsePath(GEM.cx, GEM.cy, GEM.R * Math.cos(t + phase), GEM.ryM));
  const opacity = useTransform(theta, (t) => 0.25 + 0.75 * Math.abs(Math.cos(t + phase)));
  return (
    <motion.path
      d={d}
      style={{ opacity }}
      fill="none"
      stroke="var(--color-fg)"
      strokeWidth={STROKE.meridian}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/**
 * The mark - a Meridian Gem. The studio's diamond, resolved into a thin-ink
 * wireframe that turns perpetually about its vertical axis (the section's single
 * living gesture). Two meridians sweep through true edge-on and reopen while the
 * one lume node - the section's one sanctioned accent - orbits the equator,
 * brightening at the front and dimming as it rounds the back. A single useTime
 * clock drives everything through sin/cos, so the loop is seamless by construction:
 * there is no keyframe restart to flash, and velocity is continuous across turns.
 */
function StudioMark({ reduce }: { reduce: boolean }) {
  // One perpetual clock. sin/cos are exactly periodic, so each derived value returns
  // to itself every revolution. Hooks run unconditionally; the reduced branch below
  // simply ignores the live values and paints a composed static frame.
  const time = useTime();
  const theta = useTransform(time, (ms) => (ms / 1000 / GEM.period) * Math.PI * 2);

  // Faint axial sway for a touch of float - same clock, so still seamless.
  const tilt = useTransform(theta, (t) => Math.cos(t) * 4);

  // The lume node orbits the equator: x = R*sin(theta); depth = cos(theta).
  const nodeX = useTransform(theta, (t) => GEM.R * Math.sin(t));
  const nodeDepth = useTransform(theta, (t) => Math.cos(t)); // +1 front, -1 behind
  const nodeScale = useTransform(nodeDepth, [-1, 1], [0.55, 1.15]);
  const nodeOpacity = useTransform(nodeDepth, [-1, 0, 1], [0.42, 0.72, 1]);

  // ---- Reduced motion: a composed static three-quarter view (no loop) ----
  if (reduce) {
    const ang = (38 * Math.PI) / 180;
    const nx = GEM.cx + GEM.R * Math.sin(ang); // 32.62, front-right on the equator
    return (
      <svg width={SIZE.w} height={SIZE.h} viewBox="0 0 48 60" fill="none" aria-hidden="true" className="overflow-visible">
        <path d={SILHOUETTE} fill="none" stroke="var(--color-fg)" strokeWidth={STROKE.frame} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={ellipsePath(GEM.cx, GEM.cy, GEM.R, GEM.ryEq)}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE.belt}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />
        <path
          d={ellipsePath(GEM.cx, GEM.cy, GEM.R * Math.cos(ang), GEM.ryM)}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE.meridian}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.95}
        />
        <path
          d={ellipsePath(GEM.cx, GEM.cy, GEM.R * Math.cos(ang + Math.PI / 2), GEM.ryM)}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE.meridian}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.4}
        />
        <path d={nodePath(nx, GEM.cy)} fill="var(--color-lume)" />
      </svg>
    );
  }

  // ---- Perpetual loop ----
  return (
    <svg width={SIZE.w} height={SIZE.h} viewBox="0 0 48 60" fill="none" aria-hidden="true" className="overflow-visible">
      <motion.g style={{ rotate: tilt, transformBox: "view-box", transformOrigin: "24px 30px" }}>
        {/* fixed silhouette - the constant profile of the Y-spinning diamond */}
        <path d={SILHOUETTE} fill="none" stroke="var(--color-fg)" strokeWidth={STROKE.frame} strokeLinecap="round" strokeLinejoin="round" />

        {/* equator belt - the perspective ring the node rides */}
        <path
          d={ellipsePath(GEM.cx, GEM.cy, GEM.R, GEM.ryEq)}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE.belt}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />

        {/* two spinning meridians, 90deg apart - one reads clearly while the other goes edge-on */}
        <Meridian theta={theta} phase={0} />
        <Meridian theta={theta} phase={Math.PI / 2} />

        {/* the one lume node, orbiting the equator with honest depth (scale + dim as it rounds the back) */}
        <motion.g style={{ x: nodeX, scale: nodeScale, opacity: nodeOpacity, transformBox: "view-box", transformOrigin: "24px 30px" }}>
          <path d={nodePath(GEM.cx, GEM.cy)} fill="var(--color-lume)" />
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
