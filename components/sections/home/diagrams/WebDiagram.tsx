"use client";

import { motion } from "motion/react";

// Family easings (defined inline, no shared import).
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease, for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo, for the gold settle/pop

// Deterministic rounded-rect path (one closed sub-path, clockwise from top-left).
function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  const x2 = x + w;
  const y2 = y + h;
  return (
    `M ${x + r},${y} ` +
    `H ${x2 - r} A ${r},${r} 0 0 1 ${x2},${y + r} ` +
    `V ${y2 - r} A ${r},${r} 0 0 1 ${x2 - r},${y2} ` +
    `H ${x + r} A ${r},${r} 0 0 1 ${x},${y2 - r} ` +
    `V ${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`
  );
}

// Three concentric, left-leaning breakpoint frames (outer -> inner draw order).
const FRAMES = [
  roundedRect(70, 96, 340, 288, 10), // desktop
  roundedRect(120, 126, 240, 228, 10), // tablet
  roundedRect(165, 138, 110, 204, 10), // phone
];

// Header hairline inside each frame, at y = top + 22.
const HEADERS = [
  { x1: 70, x2: 410, y: 118 },
  { x1: 120, x2: 360, y: 148 },
  { x1: 165, x2: 275, y: 160 },
];

// Shared baseline rule at y=240 crossing all frames.
const BASELINE = { x1: 70, x2: 410, y: 240 };

// 11 dotted column guides (deterministic), spanning y 110..370.
const COLS = Array.from({ length: 11 }, (_, i) => 70 + (i + 1) * (340 / 12));

// Hollow nodes at the four desktop corners.
const CORNERS = [
  { x: 70, y: 96 },
  { x: 410, y: 96 },
  { x: 70, y: 384 },
  { x: 410, y: 384 },
];

export function WebDiagram({
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
      {/* (1) CONSTRUCTION GUIDES — 12-column grid, fade in left->right, never pathLength. */}
      {COLS.map((x, i) => (
        <motion.line
          key={x}
          x1={x}
          y1={110}
          x2={x}
          y2={370}
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray="1 5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: drawn ? 0.5 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: i * 0.025 }}
        />
      ))}

      {/* (2) PRIMARY SCHEMATIC — three breakpoint frames, self-draw outer->inner. */}
      {FRAMES.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.3, ease: DRAW, delay: 0.25 + i * 0.12 }}
        />
      ))}

      {/* (3) SECONDARY INK — header hairlines, wipe in left->right. */}
      {HEADERS.map((h, i) => (
        <motion.line
          key={`h${i}`}
          x1={h.x1}
          y1={h.y}
          x2={h.x2}
          y2={h.y}
          stroke="var(--color-fg-muted)"
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: DRAW, delay: 0.9 + i * 0.06 }}
        />
      ))}

      {/* (3) SECONDARY INK — shared baseline rule across all frames. */}
      <motion.line
        x1={BASELINE.x1}
        y1={BASELINE.y}
        x2={BASELINE.x2}
        y2={BASELINE.y}
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: DRAW, delay: 1.0 }}
      />

      {/* (4) NODES — hollow dots at the four desktop corners, pop in. */}
      {CORNERS.map((n, i) => (
        <motion.circle
          key={`n${i}`}
          cx={n.x}
          cy={n.y}
          r={2.5}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: 0.95 + i * 0.05 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}

      {/* SECONDARY INK — content rows beneath the hero module on the phone screen. */}
      {[
        { y: 230, w: 84 },
        { y: 242, w: 58 },
        { y: 254, w: 70 },
      ].map((r, i) => (
        <motion.line
          key={`row${i}`}
          x1={178}
          y1={r.y}
          x2={178 + r.w}
          y2={r.y}
          stroke="var(--color-fg-muted)"
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: DRAW, delay: 1.2 + i * 0.07 }}
        />
      ))}

      {/* THE ONE GOLD ELEMENT — the live hero module rendered on the phone screen.
          A restrained content block: scales up from its top edge (EXPO), arrives
          last, then breathes at idle. */}
      <motion.rect
        x={178}
        y={166}
        width={84}
        height={50}
        rx={4}
        fill="var(--color-lume)"
        initial={false}
        animate={
          reduce
            ? { scaleY: 1, opacity: 1 }
            : !active
              ? { scaleY: 0, opacity: 0 }
              : idle
                ? { scaleY: 1, opacity: [1, 0.82, 1] }
                : { scaleY: 1, opacity: 1 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                scaleY: { duration: 0.5, ease: EXPO, delay: 1.1 },
                opacity: idle
                  ? { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1.6 }
                  : { duration: 0.4, ease: EXPO },
              }
        }
        style={{ transformOrigin: "178px 166px" }}
      />

      {/* continuous render-scan: a faint hairline sweeps down the frame, forever */}
      {idle && !reduce && (
        <motion.line
          x1={80}
          y1={0}
          x2={400}
          y2={0}
          stroke="var(--color-line-strong)"
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ y: 108, opacity: 0 }}
          animate={{ y: [108, 372], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, delay: 1.0 }}
        />
      )}
    </svg>
  );
}
