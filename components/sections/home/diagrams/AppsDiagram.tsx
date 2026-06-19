"use client";

import { motion } from "motion/react";

// Family easings (defined inline per the shared contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease, for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo, for the gold settle/pop

const C = 240; // shared center x of the 480 box
const HW = 150; // plate half-width
const HH = 44; // plate half-height (isometric skew)

// Isometric rhombus plate centered at (C, y): left -> top -> right -> bottom -> close.
function plate(y: number) {
  return `M ${C - HW},${y} L ${C},${y - HH} L ${C + HW},${y} L ${C},${y + HH} Z`;
}

// Four tier centers, base (data model) up to apex (screen). 48px depth step.
const Y_MODEL = 312; // data model (secondary ink)
const Y_API = 264; // api / data access
const Y_LOGIC = 216; // logic
const Y_SCREEN = 168; // shipped screen (apex)
const UPPER = [Y_API, Y_LOGIC, Y_SCREEN];

// A filled gold data-diamond: 8x8 square rotated 45deg -> half-diagonal 6 about (C, y).
function diamond(y: number) {
  return `M ${C},${y - 6} L ${C + 6},${y} L ${C},${y + 6} L ${C - 6},${y} Z`;
}

export function AppsDiagram({
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
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION: dotted data-spine threading all four plate centers. Fades in only. */}
      <motion.line
        x1={C}
        y1={356}
        x2={C}
        y2={124}
        stroke="var(--color-line)"
        strokeWidth={1}
        strokeDasharray="1 5"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: drawn ? 0.5 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
      />

      {/* (3) SECONDARY INK: the bottom 'data model' plate. */}
      <motion.path
        d={plate(Y_MODEL)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, ease: DRAW, delay: 0.25 }}
      />

      {/* (2) PRIMARY INK: continuous path stacking the upper three plates, base -> top. */}
      {UPPER.map((y, i) => (
        <motion.path
          key={y}
          d={plate(y)}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 1.3, ease: DRAW, delay: 0.35 + i * 0.1 }
          }
        />
      ))}

      {/* (3) SECONDARY INK: tiny UI content on the shipped 'screen' plate (header + 2 rows). */}
      {[
        { x: C - 30, y: Y_SCREEN - 12, w: 60, h: 5 },
        { x: C - 30, y: Y_SCREEN - 1, w: 44, h: 4 },
        { x: C - 30, y: Y_SCREEN + 8, w: 52, h: 4 },
      ].map((r, i) => (
        <motion.rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={1.5}
          fill="none"
          stroke="var(--color-fg-muted)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.45, ease: EXPO, delay: 0.85 + i * 0.06 }
          }
        />
      ))}

      {/* (4) NODES: hollow markers at each plate's near vertex (C, y + HH). */}
      {[Y_MODEL, ...UPPER].map((y, i) => (
        <motion.circle
          key={y}
          cx={C}
          cy={y + HH}
          r={2.5}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.5, ease: DRAW, delay: 0.7 + i * 0.06 }
          }
          style={{ transformOrigin: `${C}px ${y + HH}px` }}
        />
      ))}

      {/* THE ONE GOLD: data-diamond docked at the apex screen. Materializes with an
          EXPO pop, then idles a calm dip down the stack and back (data round-trip). */}
      <motion.path
        d={diamond(Y_SCREEN)}
        fill="var(--color-lume)"
        initial={false}
        animate={
          reduce
            ? { y: 0, scale: 1, opacity: 1 }
            : !active
              ? { y: 0, scale: 0, opacity: 0 }
              : idle
                ? { y: [0, 144, 0], scale: 1, opacity: 1 }
                : { y: 0, scale: 1, opacity: 1 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: { duration: 0.6, ease: EXPO, delay: 1.0 },
                opacity: { duration: 0.3, ease: EXPO, delay: 1.0 },
                // continuous: the packet rides the spine apex -> base -> apex, forever
                y: idle
                  ? { duration: 4.6, ease: "easeInOut", repeat: Infinity, delay: 1.2 }
                  : { duration: 0.4, ease: EXPO },
              }
        }
        style={{ transformOrigin: `${C}px ${Y_SCREEN}px` }}
      />
    </svg>
  );
}
