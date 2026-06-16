"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Subscribe to one or more media queries' change events. */
function mediaSubscribe(queries: string[]) {
  return (cb: () => void) => {
    if (typeof window === "undefined") return noop();
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((m) => m.addEventListener("change", cb));
    return () => mqls.forEach((m) => m.removeEventListener("change", cb));
  };
}

export type DeviceTier = "high" | "low";

/**
 * Capability tier used to gate expensive WebGL. "low" → coarse pointer,
 * small viewport, or few CPU cores. SSR/first paint resolves to "low" so we
 * never flash a heavy canvas; upgrades on the client once known.
 */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(
    mediaSubscribe(["(pointer: coarse)", "(max-width: 768px)"]),
    () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.matchMedia("(max-width: 768px)").matches;
      const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
      return coarse || small || fewCores ? "low" : "high";
    },
    () => "low",
  );
}

/** Whether the custom cursor should run (precise pointer + motion allowed). */
export function useCursorEnabled(): boolean {
  return useSyncExternalStore(
    mediaSubscribe(["(pointer: fine)", "(prefers-reduced-motion: reduce)"]),
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 24): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return noop();
      window.addEventListener("scroll", cb, { passive: true });
      return () => window.removeEventListener("scroll", cb);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
