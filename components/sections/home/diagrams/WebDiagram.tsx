"use client";

import { motion } from "motion/react";

// Family easings (defined inline, no shared import).
const DRAW = [0.5, 0, 0.3, 1] as const; // HeroMarker pen-ease, for every pathLength self-draw
const EXPO = [0.22, 1, 0.36, 1] as const; // easeOutExpo, for the gold settle/pop

// Deterministic rounded-rect path (one closed sub-path, clockwise from top-left)
// so the primary frame self-draws as a single continuous stroke.
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

// Straight ink as a path (M..L) so it self-draws via pathLength reliably -
// the same grammar ProofDiagram uses for its sightlines. SVG <line> is never
// pathLength-animated anywhere in the family.
const hLine = (x1: number, x2: number, y: number) => `M ${x1},${y} L ${x2},${y}`;

// ONE confident browser window, centered on (240,240). A 324x272 chrome with a
// 34px header bar. Numbers chosen so the interior content sits on a calm
// editorial column inside the safe area.
const FRAME = { x: 78, y: 104, w: 324, h: 272, r: 12 };
const WINDOW = roundedRect(FRAME.x, FRAME.y, FRAME.w, FRAME.h, FRAME.r);

// Header divider hairline (chrome bar bottom edge).
const HEADER_Y = FRAME.y + 34; // 138
// Content padding column inside the chrome.
const PAD = 26;
const CONTENT_X = FRAME.x + PAD; // 104
const CONTENT_R = FRAME.x + FRAME.w - PAD; // 376

// Three evenly-spaced hollow window dots, top-left of the chrome bar - the
// family's hollow-node motif (token card/fg), not colored OS traffic-lights.
const DOTS = [0, 1, 2].map((i) => ({
  cx: FRAME.x + 20 + i * 13,
  cy: FRAME.y + 17,
  r: 3,
}));

// Muted rounded URL / omnibox pill, filling the rest of the chrome bar.
const OMNI = { x: FRAME.x + 74, y: FRAME.y + 10, w: FRAME.w - 100, h: 14, r: 7 };

// Headline rules: two stacked strokes that read as the page title.
const HEADLINE = [
  { x: CONTENT_X, y: HEADER_Y + 30, w: 168 },
  { x: CONTENT_X, y: HEADER_Y + 44, w: 116 },
];

// Clean hero media slot outline (the big balanced rectangle below the headline).
const HERO = { x: CONTENT_X, y: HEADER_Y + 62, w: CONTENT_R - CONTENT_X, h: 92, r: 8 };

// A tidy row of three feature cards along the lower third.
const CARD_ROW_Y = HERO.y + HERO.h + 22; // top of card row
const CARD_GAP = 14;
const CARD_W = (CONTENT_R - CONTENT_X - 2 * CARD_GAP) / 3; // 3 equal columns
const CARD_H = 40;
const CARDS = [0, 1, 2].map((i) => ({
  x: CONTENT_X + i * (CARD_W + CARD_GAP),
  y: CARD_ROW_Y,
  w: CARD_W,
  h: CARD_H,
  r: 6,
}));

// THE ONE GOLD: the primary CTA button, docked at the right of the headline
// block (the natural "act now" position beside the page title).
const CTA = { x: CONTENT_R - 64, y: HEADLINE[0].y - 10, w: 64, h: 24, r: 6 };
const ctaCx = CTA.x + CTA.w / 2; // 344
const ctaCy = CTA.y + CTA.h / 2; // 170

// Symmetric timing: each element retracts over the SAME duration it drew in, so the
// disappear is exactly as slow as the appear. Only the staggered entrance delays are
// dropped on the way out, so the schematic dissolves together - the lighter ink first,
// the long window stroke last - rather than snapping away.

// `shown` (the draw vs retract boolean) and the cycle clock are owned by
// ServicesOverview and shared across all three diagrams, so they stay frame-locked.
export function WebDiagram({ shown, reduce }: { shown: boolean; reduce: boolean }) {
  return (
    <svg
      viewBox="60 60 360 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      {/* (1) CONSTRUCTION GUIDES - content column rails + a section baseline,
          fade in only. The page visibly aligns to a column: built with care. */}
      <motion.g
        initial={false}
        animate={{ opacity: shown ? 0.5 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO }}
      >
        {[CONTENT_X, CONTENT_R].map((x) => (
          <line
            key={x}
            x1={x}
            y1={HEADER_Y + 16}
            x2={x}
            y2={FRAME.y + FRAME.h - 18}
            stroke="var(--color-line)"
            strokeWidth={1}
            strokeDasharray="1 5"
            strokeLinecap="round"
          />
        ))}
        <line
          x1={CONTENT_X}
          y1={HERO.y + HERO.h + 11}
          x2={CONTENT_R}
          y2={HERO.y + HERO.h + 11}
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
      </motion.g>

      {/* (2) PRIMARY SCHEMATIC - the one browser window, self-draws as a single stroke. */}
      <motion.path
        d={WINDOW}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: DRAW, delay: shown ? 0.25 : 0 }}
      />

      {/* (2) PRIMARY - chrome header divider, draws just after the frame. */}
      <motion.path
        d={hLine(FRAME.x, FRAME.x + FRAME.w, HEADER_Y)}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, ease: DRAW, delay: shown ? 0.85 : 0 }}
      />

      {/* (3) SECONDARY INK - the muted URL / omnibox pill, wipes in. */}
      <motion.path
        d={roundedRect(OMNI.x, OMNI.y, OMNI.w, OMNI.h, OMNI.r)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: DRAW, delay: shown ? 0.92 : 0 }}
      />

      {/* (3) SECONDARY INK - headline rules (the page title), wipe in left->right. */}
      {HEADLINE.map((h, i) => (
        <motion.path
          key={`hl${i}`}
          d={hLine(h.x, h.x + h.w, h.y)}
          fill="none"
          stroke="var(--color-fg-muted)"
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: shown ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.5, ease: DRAW, delay: shown ? 0.98 + i * 0.07 : 0 }
          }
        />
      ))}

      {/* (3) SECONDARY INK - clean hero media slot outline, wipes in. */}
      <motion.path
        d={roundedRect(HERO.x, HERO.y, HERO.w, HERO.h, HERO.r)}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: DRAW, delay: shown ? 1.0 : 0 }}
      />

      {/* (3) SECONDARY INK - tidy row of three feature cards, wipe in left->right. */}
      {CARDS.map((c, i) => (
        <motion.path
          key={`card${i}`}
          d={roundedRect(c.x, c.y, c.w, c.h, c.r)}
          fill="none"
          stroke="var(--color-fg-muted)"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: shown ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.55, ease: DRAW, delay: shown ? 1.08 + i * 0.08 : 0 }
          }
        />
      ))}

      {/* (4) NODES - hollow window dots, pop in (the family's hollow-node motif). */}
      {DOTS.map((d, i) => (
        <motion.circle
          key={`dot${i}`}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill="var(--color-card)"
          stroke="var(--color-fg)"
          strokeWidth={1.25}
          initial={false}
          animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.4, ease: EXPO, delay: shown ? 0.95 + i * 0.05 : 0 }
          }
          style={{ transformOrigin: `${d.cx}px ${d.cy}px` }}
        />
      ))}

      {/* THE ONE GOLD ELEMENT - the primary CTA button. Pops in last (EXPO settle)
          and retracts with the rest of the schematic each cycle. The single warm
          subject. */}
      <motion.path
        d={roundedRect(CTA.x, CTA.y, CTA.w, CTA.h, CTA.r)}
        fill="var(--color-lume)"
        initial={false}
        animate={{ scale: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: { duration: 0.55, ease: EXPO, delay: shown ? 1.2 : 0 },
                opacity: { duration: 0.4, ease: EXPO, delay: shown ? 1.2 : 0 },
              }
        }
        style={{ transformOrigin: `${ctaCx}px ${ctaCy}px` }}
      />
    </svg>
  );
}
