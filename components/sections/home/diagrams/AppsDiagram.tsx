"use client";

import { motion } from "motion/react";

// Family easings (defined inline per the shared contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for pops / the gold settle

// Symmetric timing (shared with WebDiagram): each element retracts over the SAME
// duration it drew in, so the disappear is exactly as slow as the appear. Only the
// staggered entrance delays are dropped on the way out.

// Deterministic rounded-rect (one closed sub-path, clockwise from top-left) so each
// frame self-draws as a single continuous stroke - same grammar as WebDiagram.
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

// Straight ink as a path so it self-draws via pathLength (SVG <line> never is).
const hLine = (x1: number, x2: number, y: number) => `M ${x1},${y} L ${x2},${y}`;

// A muted hairline of app content that self-draws in and retracts out. Plain
// function (not a component) so phase re-renders reconcile in place, never remount.
function ink(reduce: boolean, d: string, on: boolean, delay = 0, w = 1.25, key?: string) {
  return (
    <motion.path
      key={key}
      d={d}
      fill="none"
      stroke="var(--color-fg-muted)"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ pathLength: on ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, ease: DRAW, delay: on ? delay : 0 }}
    />
  );
}

// A hollow node (avatar / tab markers) that pops in and out.
function node(reduce: boolean, cx: number, cy: number, r: number, on: boolean, delay = 0, key?: string) {
  return (
    <motion.circle
      key={key}
      cx={cx}
      cy={cy}
      r={r}
      fill="var(--color-card)"
      stroke="var(--color-fg-muted)"
      strokeWidth={1.25}
      initial={false}
      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: on ? delay : 0 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

// One confident phone, centered on (240, 240). The whole device - frame, status
// bar, header, tab bar, and the active app BODY - self-draws, holds, retracts, and
// redraws each cycle (the shared WebDiagram rhythm). Successive cycles step through
// three app views - feed -> grid -> list - so the product still reads as "in use",
// now in perfect lockstep with the sibling diagrams. The one gold is the active-tab pill.
const PH = { x: 162, y: 96, w: 156, h: 288, r: 28 };
const CX = PH.x + PH.w / 2; // 240
const IX = PH.x + 20; // 182 inner left
const IR = PH.x + PH.w - 20; // 298 inner right
const TABS = [200, 240, 280]; // tab x positions
const GRID: [number, number][] = [
  [IX, 176],
  [IX + 62, 176],
  [IX, 238],
  [IX + 62, 238],
];
const VIEWS = 3;

// `shown` (the draw vs retract boolean) and the cycle clock are owned by
// ServicesOverview and shared across all three diagrams, so they stay frame-locked.
// `cycleIndex` (the shared per-cycle counter) steps the app view, so the rotation
// advances in time with every redraw.
export function AppsDiagram({
  shown,
  cycleIndex,
  reduce,
}: {
  shown: boolean;
  cycleIndex: number;
  reduce: boolean;
}) {
  const view = cycleIndex % VIEWS; // which app view this cycle - held steady through the
  // retract (the shared clock advances cycleIndex only in the blank gap) so the gold pill
  // never jumps tabs mid-fade; reduced motion / off-screen both resolve to cycleIndex 0.
  const v0 = shown && view === 0;
  const v1 = shown && view === 1;
  const v2 = shown && view === 2;

  return (
    <svg
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (2) PRIMARY SCHEMATIC - the device, self-draws as one continuous stroke. */}
      <motion.path
        d={roundedRect(PH.x, PH.y, PH.w, PH.h, PH.r)}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: DRAW, delay: shown ? 0.2 : 0 }}
      />

      {/* (3) SHELL - status bar (island, time, battery), header (title, subtitle,
          avatar), the tab-bar divider + home indicator. Draws + retracts each cycle. */}
      {ink(reduce, roundedRect(CX - 17, 111, 34, 10, 5), shown, 0.7)}
      {ink(reduce, hLine(IX, IX + 22, 120), shown, 0.78)}
      {ink(reduce, roundedRect(284, 116, 15, 8, 2), shown, 0.82)}
      {ink(reduce, hLine(IX, IX + 74, 148), shown, 0.86, 1.5)}
      {ink(reduce, hLine(IX, IX + 40, 160), shown, 0.92)}
      {node(reduce, 284, 152, 11, shown, 0.96)}
      {ink(reduce, hLine(IX, IR, 328), shown, 1.0, 1)}
      {ink(reduce, hLine(CX - 22, CX + 22, 370), shown, 1.3)}

      {/* VIEW 0 - feed: a hero card + two list items (thumbnail + title + subtitle). */}
      {ink(reduce, roundedRect(IX, 176, IR - IX, 58, 12), v0, 0.95)}
      {ink(reduce, hLine(IX + 14, IX + 78, 220), v0, 1.04)}
      {[246, 274].map((y, i) => (
        <g key={`v0-${y}`}>
          {ink(reduce, roundedRect(IX, y, 20, 20, 5), v0, 1.0 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 106, y + 6), v0, 1.06 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 86, y + 14), v0, 1.1 + i * 0.07)}
        </g>
      ))}

      {/* VIEW 1 - grid: a 2x2 board of cards. */}
      {GRID.map(([x, y], i) => ink(reduce, roundedRect(x, y, 54, 54, 8), v1, 0.96 + i * 0.06, 1.25, `v1-${i}`))}

      {/* VIEW 2 - list: three rows of icon + title + value. */}
      {[196, 240, 284].map((y, i) => (
        <g key={`v2-${y}`}>
          {ink(reduce, roundedRect(IX, y - 11, 22, 22, 6), v2, 0.96 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 98, y - 3), v2, 1.02 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 74, y + 7), v2, 1.06 + i * 0.07)}
        </g>
      ))}

      {/* THE ONE GOLD - the active-tab pill, docked under the live view's tab. Pops
          in last (EXPO settle) and retracts with the device each cycle; successive
          cycles plant it under the next tab as the view advances. */}
      <motion.rect
        x={TABS[view] - 16}
        y={335}
        width={32}
        height={18}
        rx={9}
        fill="var(--color-lume)"
        initial={false}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: shown ? 1.0 : 0 }}
        style={{ transformOrigin: `${TABS[view]}px 344px` }}
      />

      {/* (4) TAB MARKERS - hollow nodes; the active one reads white-on-gold over the
          pill. Drawn last so they sit on top of the indicator. */}
      {TABS.map((x, i) => node(reduce, x, 344, 3.5, shown, 1.1 + i * 0.05, `tab-${x}`))}
    </svg>
  );
}
