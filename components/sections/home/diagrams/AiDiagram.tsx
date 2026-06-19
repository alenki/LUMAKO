"use client";

import { motion } from "motion/react";

// Family easings (defined inline per family contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for the gold settle/pop

const C = 240; // shared center of the 480 box
const R = 150; // the one orbit: six endpoints evenly spaced around the core
const BOW = 24; // uniform spoke curvature - the gentle pinwheel that reads as flow
const rad = (deg: number) => (deg * Math.PI) / 180;
type Pt = [number, number];
const node = (deg: number): Pt => [C + R * Math.cos(rad(deg)), C + R * Math.sin(rad(deg))];

// Six endpoints on one ring, a node at top and bottom (vertical symmetry). One
// per thing the assistant is wired into: answer, book, remind, retrieve, reason,
// reply. Read as "one model, many real workflows" - not a random constellation.
const ANGLES = [-90, -30, 30, 90, 150, 210] as const;
const NODES: Pt[] = ANGLES.map(node);

// One clean dotted orbit tying the endpoints together (the construction guide).
const ORBIT = `M ${C - R},${C} a ${R},${R} 0 1,0 ${R * 2},0 a ${R},${R} 0 1,0 ${-R * 2},0`;

// Each spoke is a gentle quadratic bowed the SAME rotational way, so the six
// wires read as a calm pinwheel of flow rather than three lines crossing a dot.
// Control point: midpoint of core->node, pushed one consistent perpendicular way.
function ctrlOf([x, y]: Pt): Pt {
  const mx = (C + x) / 2;
  const my = (C + y) / 2;
  const dx = x - C;
  const dy = y - C;
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * BOW, my + (dx / len) * BOW];
}
const CTRL: Pt[] = NODES.map(ctrlOf);

// Spoke path self-draws outward from the core to its endpoint, so the hub
// visibly reaches out and wires itself into every endpoint.
const spoke = (n: Pt, c: Pt) =>
  `M ${C},${C} Q ${c[0].toFixed(2)},${c[1].toFixed(2)} ${n[0].toFixed(2)},${n[1].toFixed(2)}`;

// Sample the bowed spoke at t = node..core, so the idle signal rides the wire
// exactly (piecewise-linear through points on the same quadratic).
function rideXs(n: Pt, c: Pt): number[] {
  return [1, 0.8, 0.6, 0.4, 0.2, 0].map((t) => {
    const u = 1 - t;
    return u * u * C + 2 * u * t * c[0] + t * t * n[0];
  });
}
function rideYs(n: Pt, c: Pt): number[] {
  return [1, 0.8, 0.6, 0.4, 0.2, 0].map((t) => {
    const u = 1 - t;
    return u * u * C + 2 * u * t * c[1] + t * t * n[1];
  });
}

// Idle rhythm: one request -> response per STEP, marching around the ring.
const STEP = 1.3; // seconds between consecutive channels lighting up
const CYCLE = NODES.length * STEP; // full lap of the ring
const BASE = 2.0; // entrance has fully resolved by here

export function AiDiagram({
  active,
  idle,
  reduce,
}: {
  active: boolean;
  idle: boolean;
  reduce: boolean;
}) {
  const drawn = reduce || active;
  const live = idle && !reduce; // run the perpetual message loop only while focused

  return (
    <svg
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION GUIDE: one dotted orbit, fade in only */}
      <motion.path
        d={ORBIT}
        fill="none"
        stroke="var(--color-line-strong)"
        strokeWidth={1}
        strokeDasharray="1 5"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: drawn ? 0.7 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: 0.15 }}
      />

      {/* (2) PRIMARY SCHEMATIC: six spokes self-draw outward from the core */}
      {NODES.map((n, i) => (
        <motion.path
          key={`spoke-${i}`}
          d={spoke(n, CTRL[i])}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.6, ease: DRAW, delay: 0.35 + i * 0.13 }
          }
        />
      ))}

      {/* (4) NODES: hollow endpoints pop in as their spoke lands */}
      {NODES.map(([x, y], i) => (
        <motion.circle
          key={`node-${i}`}
          cx={x}
          cy={y}
          r={4}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: 0.6 + i * 0.13 }
          }
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}

      {/* Idle answer-flares: each endpoint pings gold when its reply lands - the
          assistant answering on that channel, one conversation at a time. */}
      {live &&
        NODES.map(([x, y], i) => (
          <motion.circle
            key={`flare-${i}`}
            cx={x}
            cy={y}
            r={4}
            fill="var(--color-lume)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.55, 0.8] }}
            transition={{
              duration: 0.75,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: CYCLE - 0.75,
              delay: BASE + i * STEP + 1.0,
            }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}

      {/* THE ONE GOLD: the assistant core - soft halo + lume disc. The halo
          breathes while live (alive, listening); the disc is the steady model. */}
      <motion.circle
        cx={C}
        cy={C}
        r={12}
        fill="var(--color-lume-soft)"
        initial={false}
        animate={
          reduce
            ? { opacity: 0.6, scale: 1 }
            : live
              ? { opacity: [0.4, 0.85, 0.4], scale: drawn ? 1 : 0 }
              : { opacity: drawn ? 0.6 : 0, scale: drawn ? 1 : 0 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : live
              ? {
                  scale: { duration: 0.5, ease: EXPO, delay: 0.1 },
                  opacity: { duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.1 },
                }
              : { duration: 0.4, ease: EXPO, delay: 0.1 }
        }
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
      <motion.circle
        cx={C}
        cy={C}
        r={6}
        fill="var(--color-lume)"
        initial={false}
        animate={{ scale: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: 0.1 }}
        style={{ transformOrigin: `${C}px ${C}px` }}
      />

      {/* Idle inbound signals: a lume dot rides each spoke from its endpoint into
          the core, one in flight at a time around the ring - messages arriving. */}
      {live &&
        NODES.map((n, i) => (
          <motion.circle
            key={`signal-${i}`}
            r={2.5}
            fill="var(--color-lume)"
            initial={{ cx: n[0], cy: n[1], opacity: 0 }}
            animate={{
              cx: rideXs(n, CTRL[i]),
              cy: rideYs(n, CTRL[i]),
              opacity: [0, 1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 0.85,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: CYCLE - 0.85,
              delay: BASE + i * STEP,
            }}
          />
        ))}
    </svg>
  );
}
