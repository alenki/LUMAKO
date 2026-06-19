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
 */
export type DiagramProps = { active: boolean; idle: boolean; reduce: boolean };

/** Maps a service id (see lib/content/services) to its bespoke schematic. */
export const serviceDiagrams: Record<string, ComponentType<DiagramProps>> = {
  web: WebDiagram,
  ai: AiDiagram,
  apps: AppsDiagram,
  brand: BrandDiagram,
  strategy: ProofDiagram,
  motion: MotionDiagram,
};
