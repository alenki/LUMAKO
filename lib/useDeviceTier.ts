"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "low";

/**
 * Heuristic capability tier used to gate expensive WebGL.
 * "low" → coarse pointer (touch), small viewport, or few CPU cores.
 * Starts "low" on the server/first paint so we never flash a heavy canvas,
 * then upgrades on the client once capabilities are known.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("low");

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setTier(coarse || small || fewCores ? "low" : "high");
  }, []);

  return tier;
}
