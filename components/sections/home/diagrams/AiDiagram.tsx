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

// Symmetric timing (shared with WebDiagram): each element retracts over the SAME
// duration it drew in, so the disappear is exactly as slow as the appear. Only the
// staggered entrance delays are dropped on the way out.

// `shown` (the draw vs retract boolean) and the cycle clock are owned by
// ServicesOverview and shared across all three diagrams, so they stay frame-locked.
export function AiDiagram({ shown, reduce }: { shown: boolean; reduce: boolean }) {
  return (
    <svg
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION GUIDE: one dotted orbit, fades in / out with the cycle */}
      <motion.path
        d={ORBIT}
        fill="none"
        stroke="var(--color-line-strong)"
        strokeWidth={1}
        strokeDasharray="1 5"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: shown ? 0.7 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: shown ? 0.15 : 0 }}
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
          animate={{ pathLength: shown ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.6, ease: DRAW, delay: shown ? 0.35 + i * 0.13 : 0 }
          }
        />
      ))}

      {/* (4) NODES: hollow endpoints pop in as their spoke lands, retract together */}
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
          animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: shown ? 0.6 + i * 0.13 : 0 }
          }
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}

      {/* THE ONE GOLD: the assistant core - soft halo + lume disc. Pops in last
          (EXPO settle) and retracts with the rest of the schematic each cycle. */}
      <motion.circle
        cx={C}
        cy={C}
        r={12}
        fill="var(--color-lume-soft)"
        initial={false}
        animate={{ opacity: shown ? 0.6 : 0, scale: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: shown ? 1.0 : 0 }}
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
      <motion.circle
        cx={C}
        cy={C}
        r={6}
        fill="var(--color-lume)"
        initial={false}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: shown ? 1.1 : 0 }}
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
    </svg>
  );
}
