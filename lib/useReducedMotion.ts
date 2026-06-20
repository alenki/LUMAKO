"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion as useReducedMotionPref } from "motion/react";

// SSR-safe "have we hydrated yet" flag: false on the server and the first client render,
// true thereafter, with no setState-in-effect.
const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

/**
 * The user's reduced-motion preference - SSR-safe. The server can't know the preference
 * (it is browser-only), so the server and the first client render always report `false`,
 * matching each other; the real preference takes over after hydration. Without this, every
 * motion-aware component that renders a different tree under reduced motion would trip a
 * hydration mismatch for reduced-motion users. The cost is one post-hydration re-render.
 */
export function useReducedMotion(): boolean | null {
  const hydrated = useSyncExternalStore(subscribeNoop, getHydrated, getServerHydrated);
  const reduced = useReducedMotionPref();
  return hydrated ? reduced : false;
}
