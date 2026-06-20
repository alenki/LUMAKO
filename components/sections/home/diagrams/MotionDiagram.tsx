"use client";

import { motion } from "motion/react";

/**
 * MOTION - "one deliberate cinematic motion per view."
 * A drafting orrery: concentric orbital rings in measured ink, with exactly one
 * warm body tracing the hero orbit (ring B), trailing a short golden-hour comet.
 * The whole orbit group is tilted -18deg. Everything is ink + hairline; only the
 * gold body and its bound trail carry chroma, and only they ever move.
 */
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease for every self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for the gold settle
const C = 240;

// Ring B = the HERO orbit. Authored as a closed ellipse arc-path so the primary
// self-draw, the gold body's offsetPath travel, and the comet window all share
// one identical geometry.
const BRX = 152;
const BRY = 70;
const RING_B = `M ${C - BRX},${C} a ${BRX},${BRY} 0 1,0 ${BRX * 2},0 a ${BRX},${BRY} 0 1,0 ${-BRX * 2},0`;

// Guide ellipses A (outer) and C (inner) as dotted construction arcs.
function guideEllipse(rx: number, ry: number) {
  return `M ${C - rx},${C} a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 ${-rx * 2},0`;
}

// Hollow reference stations parked on ring B at parametric t (deterministic trig).
const STATIONS = [0, 0.4, 0.72].map((t) => {
  const a = t * Math.PI * 2;
  return { x: C + BRX * Math.cos(a), y: C + BRY * Math.sin(a) };
});

export function MotionDiagram({
  active,
  idle,
  reduce,
}: {
  active: boolean;
  idle: boolean;
  reduce: boolean;
}) {
  const drawn = reduce || active;
  const live = idle && !reduce; // perpetual travel only while live + on-screen

  return (
    <svg
      viewBox="0 0 480 480"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* CONSTRUCTION GUIDES - fade in via opacity only, never pathLength */}
      <motion.g
        initial={false}
        animate={{ opacity: drawn ? 0.5 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO }}
      >
        <line
          x1={40}
          y1={C}
          x2={440}
          y2={C}
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
        <g
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray="1 5"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-18 ${C} ${C})`}
        >
          <line x1={40} y1={C} x2={440} y2={C} />
          <line x1={C} y1={64} x2={C} y2={416} />
          <path d={guideEllipse(186, 86)} />
          <path d={guideEllipse(104, 48)} />
        </g>
      </motion.g>

      {/* TILTED ORBIT SYSTEM */}
      <g transform={`rotate(-18 ${C} ${C})`}>
        {/* PRIMARY ink - the hero orbit self-draws */}
        <motion.path
          d={RING_B}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.3, ease: DRAW, delay: 0.25 }}
        />

        {/* PRIMARY ink - the still core at center */}
        <motion.circle
          cx={C}
          cy={C}
          r={10}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.5}
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: DRAW, delay: 0.7 }}
        />

        {/* NODES - hollow reference stations resolve after the draw */}
        {STATIONS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={2}
            fill="var(--color-card)"
            stroke="var(--color-fg)"
            strokeWidth={1.25}
            initial={false}
            animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: 0.85 + i * 0.06 }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}

        {/* THE ONE GOLD ELEMENT - the warm body + its bound comet, on ring B.
            The comet is a ~14% arc behind the disc, built as three contiguous dash
            windows of ring B with decreasing opacity so the golden-hour light fades
            along its length. Disc and every comet window share ONE linear 7s phase
            (same keyframe shape + transition), so the tail stays locked to the head.
            One full revolution / 7s = the family's signature cinematic travel. */}
        <motion.g
          initial={false}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: 1.1 }}
        >
          {/* comet trail: three contiguous 5% windows trailing the disc, dimming back */}
          {[
            { base: 0.05, opacity: 1 },
            { base: 0.1, opacity: 0.5 },
            { base: 0.15, opacity: 0.22 },
          ].map((seg) => (
            <motion.path
              key={seg.base}
              d={RING_B}
              fill="none"
              stroke="var(--color-lume)"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={seg.opacity}
              pathLength={1}
              strokeDasharray="0.05 0.95"
              initial={false}
              animate={live ? { strokeDashoffset: [seg.base, seg.base - 1] } : { strokeDashoffset: seg.base }}
              transition={live ? { duration: 7, ease: "linear", repeat: Infinity } : { duration: 0 }}
            />
          ))}
          {/* the warm body: a filled lume disc riding the same orbit at the comet head.
              Wrapped in an offset-path group with the disc at local origin so the disc
              center (not a stray base coord) is what travels the path. */}
          <motion.g
            style={{ offsetPath: `path('${RING_B}')`, offsetRotate: "0deg" }}
            initial={false}
            animate={live ? { offsetDistance: ["0%", "100%"] } : { offsetDistance: "0%" }}
            transition={live ? { duration: 7, ease: "linear", repeat: Infinity } : { duration: 0 }}
          >
            <circle cx={0} cy={0} r={5} fill="var(--color-lume)" />
          </motion.g>
        </motion.g>
      </g>
    </svg>
  );
}
