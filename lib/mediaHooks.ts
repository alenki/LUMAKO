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
