"use client";

import type { ComponentType } from "react";
import { WebDiagram } from "./WebDiagram";
import { AiDiagram } from "./AiDiagram";
import { AppsDiagram } from "./AppsDiagram";
import { BrandDiagram } from "./BrandDiagram";
import { ProofDiagram } from "./ProofDiagram";
import { MotionDiagram } from "./MotionDiagram";

/**
 * `active`  - the diagram should be in its fully-drawn state (sticky once shown,
 *             so re-selecting a service never replays the multi-second self-draw).
 * `idle`    - this diagram is the live focus, so it may run its one perpetual idle
 *             loop. Only the selected (desktop) / on-screen (mobile) diagram idles.
 * `reduce`  - reduced motion: render the resolved static frame, no idle.
 * `shown`   - the shared cycle boolean: true while the schematic should be drawn in,
 *             false while retracted / blank. Driven by ONE section-level clock so the
 *             home gallery's diagrams draw / hold / retract / redraw frame-locked.
 * `cycleIndex` - monotonic shared cycle counter (advances once per cycle); AppsDiagram
 *             reads it to pick which app view assembles, keeping the rotation in sync.
 */
export type DiagramProps = {
  active: boolean;
  idle: boolean;
  reduce: boolean;
  shown: boolean;
  cycleIndex: number;
};

/** Maps a service id (see lib/content/services) to its bespoke schematic. */
export const serviceDiagrams: Record<string, ComponentType<DiagramProps>> = {
  web: WebDiagram,
  ai: AiDiagram,
  apps: AppsDiagram,
  brand: BrandDiagram,
  strategy: ProofDiagram,
  motion: MotionDiagram,
};
