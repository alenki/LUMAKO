"use client";

import { motion } from "motion/react";

// Family easings (defined inline per contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for the gold settle/pop

const C = 240; // shared center of the 480 box
const rad = (deg: number) => (deg * Math.PI) / 180;
const node = (R: number, deg: number): [number, number] => [
  C + R * Math.cos(rad(deg)),
  C + R * Math.sin(rad(deg)),
];

// Shared dotted construction ring (placeholder helper).
const ring = (r: number) =>
  `M ${C - r},${C} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-r * 2},0`;

// 9 peripheral nodes on two construction rings, listed in angular order so the
// pen threads them as a single continuous stroke.
const SCATTER: [number, number][] = (
  [
    [152, -90],
    [104, -55],
    [152, -25],
    [152, 40],
    [104, 70],
    [152, 115],
    [152, 180],
    [104, 200],
    [152, 250],
  ] as const
).map(([R, a]) => node(R, a));

// The 6 outer (R=152) nodes that send synapse-spokes toward the core.
const OUTER: [number, number][] = ([-90, -25, 40, 115, 180, 250] as const).map(
  (a) => node(152, a),
);

// PRIMARY ink: one continuous polyline-of-quadratics. Each segment's control
// point is offset 18px perpendicular to the segment so the wire reads hand-inked,
// then it returns toward the core to close the constellation.
function threadPath(): string {
  const pts = [...SCATTER, [C, C] as [number, number]];
  let d = `M ${SCATTER[0][0].toFixed(2)},${SCATTER[0][1].toFixed(2)}`;
  for (let i = 0; i < SCATTER.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    // perpendicular unit vector, alternating side for an organic woven feel
    const side = i % 2 === 0 ? 1 : -1;
    const cx = mx + (-dy / len) * 18 * side;
    const cy = my + (dx / len) * 18 * side;
    d += ` Q ${cx.toFixed(2)},${cy.toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
  }
  return d;
}

// SECONDARY ink: thin synapse-spokes, each a quadratic with its control point
// pulled 12px toward the core for gentle curvature.
function spokePath([x, y]: [number, number]): string {
  const mx = (x + C) / 2;
  const my = (y + C) / 2;
  const dx = C - mx;
  const dy = C - my;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (dx / len) * 12;
  const cy = my + (dy / len) * 12;
  return `M ${x.toFixed(2)},${y.toFixed(2)} Q ${cx.toFixed(2)},${cy.toFixed(2)} ${C},${C}`;
}

const WIRE = threadPath();

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

  return (
    <svg
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION GUIDES: two dotted rings, fade in only */}
      {[152, 104].map((r) => (
        <motion.path
          key={r}
          d={ring(r)}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray="1 5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: drawn ? 0.5 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO }}
        />
      ))}

      {/* (3) SECONDARY INK: 6 synapse-spokes, draw quickly after the primary wire */}
      {OUTER.map(([x, y], i) => (
        <motion.path
          key={`spoke-${i}`}
          d={spokePath([x, y])}
          fill="none"
          stroke="var(--color-fg-muted)"
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.4, ease: DRAW, delay: 0.85 + i * 0.05 }
          }
        />
      ))}

      {/* (2) PRIMARY SCHEMATIC: one threading pen-stroke through all 9 nodes */}
      <motion.path
        d={WIRE}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.4, ease: DRAW, delay: 0.25 }}
      />

      {/* (4) NODES: hollow -> fired, in stagger following the draw direction */}
      {SCATTER.map(([x, y], i) => (
        <g key={`node-${i}`}>
          <circle cx={x} cy={y} r={3} fill="var(--color-card)" stroke="var(--color-fg)" strokeWidth={1.25} />
          <motion.circle
            cx={x}
            cy={y}
            r={3}
            fill="var(--color-fg)"
            initial={false}
            animate={{ opacity: drawn ? 1 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.06, ease: DRAW, delay: 0.35 + i * 0.06 }
            }
          />
        </g>
      ))}

      {/* THE ONE GOLD: the core answer — soft halo, lume disc, and the inbound pulse */}
      <motion.circle
        cx={C}
        cy={C}
        r={9}
        fill="var(--color-lume-soft)"
        initial={false}
        animate={
          reduce
            ? { opacity: 0.6, scale: 1 }
            : idle
              ? { opacity: [0.4, 0.8, 0.4], scale: drawn ? 1 : 0 }
              : { opacity: drawn ? 0.6 : 0, scale: drawn ? 1 : 0 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : idle
              ? {
                  scale: { duration: 0.5, ease: EXPO, delay: 1.1 },
                  opacity: { duration: 3.2, ease: "easeInOut", repeat: Infinity, delay: 1.1 },
                }
              : { duration: 0.3, ease: EXPO }
        }
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
      <motion.circle
        cx={C}
        cy={C}
        r={5}
        fill="var(--color-lume)"
        initial={false}
        animate={{ scale: drawn ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO, delay: 1.1 }}
        style={{ transformOrigin: `${C}px ${C}px` }}
      />

      {/* Gold pulse-dots: a continuous stream of signals firing inward along the
          synapses into the core - staggered so one is always in flight. */}
      {idle &&
        !reduce &&
        [OUTER[0], OUTER[2], OUTER[4]].map((n, k) => (
          <motion.circle
            key={k}
            r={3}
            fill="var(--color-lume)"
            initial={{ cx: n[0], cy: n[1], opacity: 0 }}
            animate={{ cx: [n[0], C], cy: [n[1], C], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, ease: EXPO, repeat: Infinity, delay: 1.1 + k * 0.6 }}
          />
        ))}
    </svg>
  );
}
