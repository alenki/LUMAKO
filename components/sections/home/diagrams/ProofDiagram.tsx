"use client";

import { motion } from "motion/react";

// Family easings (shared across all six plates).
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for the gold settle / pop

const C = 240; // shared center of the 480 box
const R_IN = 56; // inner ranging ring — sightlines stop here
const R_OUT = 104; // outer ranging ring

// Construction ring, drawn with the placeholder's ring() helper.
function ring(r: number) {
  return `M ${C - r},${C} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-r * 2},0`;
}

// 11 deterministic perimeter origins (first 11 of the 12 listed angles).
// Each line runs from its scattered origin straight at C but STOPS at R_IN,
// so the swarm reads as converging vectors, not a starburst. A tiny sine-based
// angular jitter (no PRNG) makes the aim feel hand-set, not mechanical.
const ORIGIN_R = 168;
const SIGHT_ANGLES = [8, 33, 57, 79, 104, 128, 151, 176, 200, 223, 248];
const SIGHTLINES = SIGHT_ANGLES.map((deg, i) => {
  const a = ((deg + Math.sin(i * 2.4) * 2.2) * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    ox: C + cos * ORIGIN_R,
    oy: C + sin * ORIGIN_R,
    ix: C + cos * R_IN,
    iy: C + sin * R_IN,
  };
});

// The lone gold ray drives in from a clean upper-right gap all the way to C.
const GOLD_A = (320 * Math.PI) / 180;
const GOLD_OX = C + Math.cos(GOLD_A) * ORIGIN_R;
const GOLD_OY = C + Math.sin(GOLD_A) * ORIGIN_R;

export function ProofDiagram({
  active,
  idle,
  reduce,
}: {
  active: boolean;
  idle: boolean;
  reduce: boolean;
}) {
  const drawn = reduce || active;

  return (
    <svg
      viewBox="0 0 480 480"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION GUIDES — fade in via opacity only, never pathLength. */}
      <motion.g
        initial={false}
        animate={{ opacity: drawn ? 0.5 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO }}
      >
        {[R_IN, R_OUT].map((r) => (
          <path
            key={r}
            d={ring(r)}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={1}
            strokeDasharray="1 5"
            strokeLinecap="round"
          />
        ))}
        {/* fine full-width / full-height crosshair through C */}
        <path d={`M 78,${C} H 402`} stroke="var(--color-line)" strokeWidth={1} strokeDasharray="1 5" strokeLinecap="round" />
        <path d={`M ${C},78 V 402`} stroke="var(--color-line)" strokeWidth={1} strokeDasharray="1 5" strokeLinecap="round" />
      </motion.g>

      {/* (2) PRIMARY INK — 11 sightlines self-draw inward in a converging sweep, stopping at R_IN. */}
      {SIGHTLINES.map((s, i) => (
        <motion.path
          key={i}
          d={`M ${s.ox.toFixed(2)},${s.oy.toFixed(2)} L ${s.ix.toFixed(2)},${s.iy.toFixed(2)}`}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={1.5}
          strokeLinecap="butt"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.1, ease: DRAW, delay: 0.25 + i * 0.03 }}
        />
      ))}

      {/* (4) NODES — hollow origin marks fire as each sightline lands. */}
      {SIGHTLINES.map((s, i) => (
        <motion.circle
          key={`n${i}`}
          cx={s.ox}
          cy={s.oy}
          r={2}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: 0.4 + i * 0.03 }}
          style={{ transformOrigin: `${s.ox}px ${s.oy}px` }}
        />
      ))}

      {/* (3) SECONDARY INK — small open reticle at C (two 10px ticks), draws after the swarm. */}
      <motion.path
        d={`M ${C - 10},${C} H ${C - 3} M ${C + 3},${C} H ${C + 10} M ${C},${C - 10} V ${C - 3} M ${C},${C + 3} V ${C + 10}`}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="butt"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: DRAW, delay: 0.9 }}
      />

      {/* GOLD — the ONE ray drives the whole way to C (lume-deep, thin line for legibility). */}
      <motion.path
        d={`M ${GOLD_OX.toFixed(2)},${GOLD_OY.toFixed(2)} L ${C},${C}`}
        fill="none"
        stroke="var(--color-lume-deep)"
        strokeWidth={1.5}
        strokeLinecap="butt"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: DRAW, delay: 1.2 }}
      />

      {/* GOLD lock-ring (lume-deep, thin) — idle breathe is the ONLY motion at rest. */}
      <motion.circle
        cx={C}
        cy={C}
        fill="none"
        stroke="var(--color-lume-deep)"
        strokeWidth={1.5}
        initial={false}
        animate={
          reduce
            ? { r: 10, opacity: 1 }
            : !active
              ? { r: 10, opacity: 0 }
              : idle
                ? { r: [10, 13, 10], opacity: 1 }
                : { r: 10, opacity: 1 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                r: idle ? { duration: 3.5, ease: "easeInOut", repeat: Infinity } : { duration: 0.3 },
                opacity: { duration: 0.5, ease: EXPO, delay: 1.9 },
              }
        }
      />

      {/* GOLD bullseye disc — full lume chroma, scales in last with a tiny overshoot, breathes in sync. */}
      <motion.circle
        cx={C}
        cy={C}
        r={4}
        fill="var(--color-lume)"
        initial={false}
        animate={
          reduce
            ? { scale: 1, opacity: 1 }
            : {
                scale: drawn ? 1 : 0,
                opacity: !active ? 0 : idle ? [1, 0.85, 1] : 1,
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: { duration: 0.5, ease: EXPO, delay: 1.9 },
                opacity: idle
                  ? { duration: 3.5, ease: "easeInOut", repeat: Infinity, delay: 2.4 }
                  : { duration: 0.3, ease: EXPO },
              }
        }
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
    </svg>
  );
}
