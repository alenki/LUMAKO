"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// Family easings (defined inline per the shared contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for pops / the gold slide

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
      transition={reduce ? { duration: 0 } : on ? { duration: 0.55, ease: DRAW, delay } : { duration: 0.3, ease: DRAW }}
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
      transition={reduce ? { duration: 0 } : on ? { duration: 0.4, ease: EXPO, delay } : { duration: 0.25, ease: EXPO }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

// One confident phone, centered on (240, 240). The persistent shell (frame, status
// bar, header, tab bar) draws once; the BODY then cycles through three app views -
// feed -> grid -> list - forever, the way a real product gets used. The one gold is
// the active-tab pill, sliding to the live tab as the screen switches.
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

const PERIOD = 2400; // ms each view holds before the app switches
const HOLD = 2600; // ms the first view holds (covers entrance) before cycling starts

export function AppsDiagram({
  active,
  reduce,
}: {
  active: boolean;
  idle: boolean;
  reduce: boolean;
}) {
  const drawn = reduce || active;
  // Cycle once the tile has been seen (active is sticky), so a scroll-flicker can't
  // reset the loop - it switches screens continuously, like the sibling diagrams.
  const cycling = active && !reduce;

  // The view index advances on a timer (only inside timer callbacks). Reduced motion
  // and not-yet-seen both resolve to the first view.
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!cycling) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => setPhase((p) => (p + 1) % VIEWS), PERIOD);
    }, HOLD);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [cycling]);

  const view = cycling ? phase : 0;
  const v0 = drawn && view === 0;
  const v1 = drawn && view === 1;
  const v2 = drawn && view === 2;

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
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: DRAW, delay: 0.2 }}
      />

      {/* (3) SHELL - status bar (island, time, battery), header (title, subtitle,
          avatar), the tab-bar divider + home indicator. Persistent once drawn. */}
      {ink(reduce, roundedRect(CX - 17, 111, 34, 10, 5), drawn, 0.7)}
      {ink(reduce, hLine(IX, IX + 22, 120), drawn, 0.78)}
      {ink(reduce, roundedRect(284, 116, 15, 8, 2), drawn, 0.82)}
      {ink(reduce, hLine(IX, IX + 74, 148), drawn, 0.86, 1.5)}
      {ink(reduce, hLine(IX, IX + 40, 160), drawn, 0.92)}
      {node(reduce, 284, 152, 11, drawn, 0.96)}
      {ink(reduce, hLine(IX, IR, 328), drawn, 1.0, 1)}
      {ink(reduce, hLine(CX - 22, CX + 22, 370), drawn, 1.3)}

      {/* VIEW 0 - feed: a hero card + two list items (thumbnail + title + subtitle). */}
      {ink(reduce, roundedRect(IX, 176, IR - IX, 58, 12), v0, 0.25)}
      {ink(reduce, hLine(IX + 14, IX + 78, 220), v0, 0.34)}
      {[246, 274].map((y, i) => (
        <g key={`v0-${y}`}>
          {ink(reduce, roundedRect(IX, y, 20, 20, 5), v0, 0.3 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 106, y + 6), v0, 0.36 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 86, y + 14), v0, 0.4 + i * 0.07)}
        </g>
      ))}

      {/* VIEW 1 - grid: a 2x2 board of cards. */}
      {GRID.map(([x, y], i) => ink(reduce, roundedRect(x, y, 54, 54, 8), v1, 0.26 + i * 0.06, 1.25, `v1-${i}`))}

      {/* VIEW 2 - list: three rows of icon + title + value. */}
      {[196, 240, 284].map((y, i) => (
        <g key={`v2-${y}`}>
          {ink(reduce, roundedRect(IX, y - 11, 22, 22, 6), v2, 0.26 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 98, y - 3), v2, 0.32 + i * 0.07)}
          {ink(reduce, hLine(IX + 32, IX + 74, y + 7), v2, 0.36 + i * 0.07)}
        </g>
      ))}

      {/* THE ONE GOLD - the active-tab pill. Pops in, then slides to the live tab as
          the screen switches: the single warm subject, always docked, never at rest. */}
      <motion.g
        initial={false}
        animate={{ x: drawn ? TABS[view] : TABS[0], opacity: drawn ? 1 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { x: { duration: 0.5, ease: EXPO }, opacity: { duration: 0.4, ease: EXPO, delay: 1.0 } }
        }
      >
        <rect x={-16} y={335} width={32} height={18} rx={9} fill="var(--color-lume)" />
      </motion.g>

      {/* (4) TAB MARKERS - hollow nodes; the active one reads white-on-gold over the
          pill. Drawn last so they sit on top of the indicator. */}
      {TABS.map((x, i) => node(reduce, x, 344, 3.5, drawn, 1.1 + i * 0.05, `tab-${x}`))}
    </svg>
  );
}
