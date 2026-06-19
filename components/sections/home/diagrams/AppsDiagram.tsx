"use client";

import { motion } from "motion/react";

// Family easings (defined inline per the shared contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for the gold settle / ping

// Deterministic rounded-rect (one closed sub-path, clockwise from top-left) so the
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

// The idea, left -> right: a DATA MODEL (a small table of records) wired to a
// working APP (a phone). Data travels the pipe and the app's action goes live -
// "from the data model to the screen ... built whole and handed over working."
const AXIS = 240; // shared flow height

// (left) data-model card + its three record rows.
const DC = { x: 106, y: 182, w: 92, h: 116, r: 10 };
const DC_IX = DC.x + 12; // inner left
const DC_IR = DC.x + DC.w - 12; // inner right
const ROWS = [234, 254, 274]; // record-row baselines
const DATA_PORT = { x: DC.x + DC.w, y: AXIS }; // where the pipe leaves the table

// (right) the app: a phone frame with a tidy screen + the one gold action.
const PH = { x: 266, y: 144, w: 116, h: 192, r: 18 };
const PH_IX = PH.x + 16; // inner left
const PH_IR = PH.x + PH.w - 16; // inner right
const PH_CX = PH.x + PH.w / 2; // screen center x
const PHONE_PORT = { x: PH.x, y: AXIS }; // where the pipe meets the device

// THE ONE GOLD: the app's primary action, lower third of the screen.
const CTA = { x: PH_CX - 36, y: 281, w: 72, h: 22, r: 11 };
const CTA_CX = PH_CX;
const CTA_CY = CTA.y + CTA.h / 2; // 292

// Idle rhythm: a data record rides the pipe into the app, then the action pings.
const RIDE = 1.5; // seconds for one record to travel table -> action
const GAP = 1.7; // rest between records
const BASE = 1.95; // entrance has fully resolved by here

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
  const live = idle && !reduce; // the perpetual data-flow loop runs only while focused

  return (
    <svg
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION GUIDE - the dotted data pipe between table and app. Fade in
          only; it is the lane the record travels. */}
      <motion.line
        x1={DATA_PORT.x}
        y1={AXIS}
        x2={PHONE_PORT.x}
        y2={AXIS}
        stroke="var(--color-line-strong)"
        strokeWidth={1}
        strokeDasharray="1 5"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: drawn ? 0.7 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut", delay: 0.2 }}
      />

      {/* (2) PRIMARY SCHEMATIC - the two frames self-draw: the data-model card, then
          the app device. */}
      <motion.path
        d={roundedRect(DC.x, DC.y, DC.w, DC.h, DC.r)}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: DRAW, delay: 0.3 }}
      />
      <motion.path
        d={roundedRect(PH.x, PH.y, PH.w, PH.h, PH.r)}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: DRAW, delay: 0.45 }}
      />

      {/* (3) SECONDARY INK - the data-model header rule, wipes in. */}
      <motion.path
        d={hLine(DC_IX, DC_IR, DC.y + 32)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: DRAW, delay: 0.95 }}
      />

      {/* (3) SECONDARY INK - three record rows: a hollow record marker + its field. */}
      {ROWS.map((y, i) => (
        <g key={`rec-${y}`}>
          <motion.path
            d={hLine(DC_IX + 18, DC_IR, y)}
            fill="none"
            stroke="var(--color-fg-muted)"
            strokeWidth={1.25}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: drawn ? 1 : 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.45, ease: DRAW, delay: 1.05 + i * 0.08 }
            }
          />
          <motion.circle
            cx={DC_IX + 6}
            cy={y}
            r={2.75}
            fill="var(--color-card)"
            stroke="var(--color-fg)"
            strokeWidth={1.25}
            initial={false}
            animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: 1.05 + i * 0.08 }
            }
            style={{ transformOrigin: `${DC_IX + 6}px ${y}px` }}
          />
        </g>
      ))}

      {/* (4) NODES - the two pipe ports (table side + device side), the family motif. */}
      {[DATA_PORT, PHONE_PORT].map((p, i) => (
        <motion.circle
          key={`port-${i}`}
          cx={p.x}
          cy={p.y}
          r={3}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: 1.0 + i * 0.08 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        />
      ))}

      {/* (3) SECONDARY INK - the app screen: speaker, title, hero block, a list row,
          and the home indicator. */}
      <motion.path
        d={hLine(PH_CX - 12, PH_CX + 12, PH.y + 10)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: DRAW, delay: 1.15 }}
      />
      <motion.path
        d={hLine(PH_IX, PH_IX + 40, 178)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: DRAW, delay: 1.2 }}
      />
      <motion.path
        d={roundedRect(PH_IX, 192, PH_IR - PH_IX, 44, 6)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: DRAW, delay: 1.28 }}
      />
      <motion.path
        d={hLine(PH_IX, PH_IX + 50, 252)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: DRAW, delay: 1.4 }}
      />
      <motion.path
        d={hLine(PH_CX - 17, PH_CX + 17, 320)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: DRAW, delay: 1.46 }}
      />

      {/* Idle data-flow: an ink record leaves the table, rides the pipe into the app
          and down to the action, then fades as it lands - one in flight at a time.
          Ink, not gold, so the action stays the sole accent. Live (on-screen) only,
          so the static / reduced frame shows only the docked gold action. */}
      {live && (
        <motion.circle
          r={3}
          fill="var(--color-fg)"
          initial={{ cx: DATA_PORT.x, cy: AXIS, opacity: 0 }}
          animate={{
            cx: [DATA_PORT.x, PHONE_PORT.x, PHONE_PORT.x + 44, CTA_CX],
            cy: [AXIS, AXIS, AXIS + 26, CTA_CY],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: RIDE,
            ease: "easeInOut",
            times: [0, 0.38, 0.8, 1],
            repeat: Infinity,
            repeatDelay: GAP,
            delay: BASE,
          }}
        />
      )}

      {/* Idle ping: the action flares as each record lands - the working product
          responding to live data. Live only, timed to arrival. */}
      {live && (
        <motion.path
          d={roundedRect(CTA.x, CTA.y, CTA.w, CTA.h, CTA.r)}
          fill="none"
          stroke="var(--color-lume)"
          strokeWidth={1.25}
          strokeLinejoin="round"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: RIDE + GAP - 0.8,
            delay: BASE + RIDE,
          }}
          style={{ transformOrigin: `${CTA_CX}px ${CTA_CY}px` }}
        />
      )}

      {/* THE ONE GOLD - the app's primary action: a lume button docked in the screen.
          Pops in last with an EXPO settle, then stays. The single warm subject - the
          product, handed over working. */}
      <motion.path
        d={roundedRect(CTA.x, CTA.y, CTA.w, CTA.h, CTA.r)}
        fill="var(--color-lume)"
        initial={false}
        animate={{ scale: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: { duration: 0.55, ease: EXPO, delay: 1.6 },
                opacity: { duration: 0.4, ease: EXPO, delay: 1.6 },
              }
        }
        style={{ transformOrigin: `${CTA_CX}px ${CTA_CY}px` }}
      />
    </svg>
  );
}
