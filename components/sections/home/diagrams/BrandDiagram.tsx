"use client";

import { motion } from "motion/react";

// Family easings (defined inline per contract).
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo for the gold settle/pop

const C = 240; // shared center of the 480 box
const PHI = 1.618033988749895;
const r2 = (n: number) => Math.round(n * 100) / 100;

// A full circle path centered at (cx,cy), same arc grammar as the family ring().
const circlePath = (cx: number, cy: number, r: number) =>
  `M ${r2(cx - r)},${r2(cy)} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-r * 2},0`;

// (1) FLOWER OF LIFE — 19 circles on a hex lattice (spacing S; adjacent circles
// pass through each other's centers). Kept where a^2+ab+b^2 <= 4, then sorted by
// distance so the lattice blooms from the center outward.
const S = 54;
const SQRT3 = Math.sqrt(3);
const FLOWER: { x: number; y: number; d: number }[] = [];
for (let a = -2; a <= 2; a++) {
  for (let b = -2; b <= 2; b++) {
    const d2 = a * a + a * b + b * b;
    if (d2 > 4) continue;
    FLOWER.push({
      x: r2(C + (a + b / 2) * S),
      y: r2(C + (b * SQRT3) / 2 * S),
      d: Math.sqrt(d2),
    });
  }
}
FLOWER.sort((p, q) => p.d - q.d);

const BOUND = circlePath(C, C, 160);

// (2) PRIMARY = GOLD — a true logarithmic golden spiral: radius grows by PHI every
// quarter turn (r = a*e^(K*theta)), sampled as a smooth polyline from the eye out.
const K = Math.log(PHI) / (Math.PI / 2);
function goldenSpiral() {
  const thetaMax = 2.6 * 2 * Math.PI; // 2.6 turns
  const a = 150 / Math.exp(K * thetaMax); // end the outermost turn at radius 150
  const N = 168;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * thetaMax;
    const r = a * Math.exp(K * th);
    const x = r2(C + r * Math.cos(th));
    const y = r2(C + r * Math.sin(th));
    d += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
  }
  return d;
}
const SPIRAL = goldenSpiral();

export function BrandDiagram({
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
      {/* The whole mandala turns once every 90s while live — the single calm motion. */}
      <motion.g
        animate={reduce ? undefined : idle ? { rotate: 360 } : { rotate: 0 }}
        transition={idle ? { duration: 90, ease: "linear", repeat: Infinity } : { duration: 0 }}
        style={{ transformOrigin: `${C}px ${C}px` }}
      >
        {/* (1) CONSTRUCTION: containment ring, fades in only */}
        <motion.path
          d={BOUND}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray="1 5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: drawn ? 0.6 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EXPO }}
        />

        {/* (1) FLOWER OF LIFE: delicate ink lattice, blooms from the center out */}
        {FLOWER.map((p, i) => (
          <motion.path
            key={i}
            d={circlePath(p.x, p.y, S)}
            fill="none"
            stroke="var(--color-line-strong)"
            strokeWidth={1.1}
            strokeLinecap="butt"
            initial={false}
            animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 0.9 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    pathLength: { duration: 1.0, ease: DRAW, delay: 0.1 + i * 0.045 },
                    opacity: { duration: 0.3, delay: 0.1 + i * 0.045 },
                  }
            }
          />
        ))}

        {/* (2) PRIMARY = GOLD (sanctioned inversion): the golden spiral LEADS,
            drawing from the eye outward as one continuous lume-deep stroke */}
        <motion.path
          d={SPIRAL}
          fill="none"
          stroke="var(--color-lume-deep)"
          strokeWidth={1.6}
          strokeLinecap="butt"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.7, ease: DRAW, delay: 0.35 }}
        />
      </motion.g>

      {/* GOLD EYE: the spiral's fixed origin at center — pops last, holds while the
          mandala turns. Reads as one gold subject with the spiral. */}
      <motion.circle
        cx={C}
        cy={C}
        r={3.5}
        fill="var(--color-lume)"
        initial={false}
        animate={
          reduce
            ? { opacity: 1, scale: 1 }
            : idle
              ? { opacity: [0.75, 1, 0.75], scale: drawn ? 1 : 0 }
              : { opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : idle
              ? {
                  scale: { duration: 0.5, ease: EXPO, delay: 1.4 },
                  opacity: { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1.4 },
                }
              : { duration: 0.3, ease: EXPO }
        }
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
    </svg>
  );
}
