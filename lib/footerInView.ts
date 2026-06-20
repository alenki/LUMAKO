"use client";

import { useSyncExternalStore } from "react";

// There is a single global nav and a single global footer (both mounted once in
// app/layout.tsx), so a module-level store is the simplest, framework-light way to
// let the footer tell the nav when its monumental "Lumako." wordmark is on screen -
// the cue for the nav to retire its own small wordmark so the two never share a frame.
let inView = false;
const listeners = new Set<() => void>();

/** Report whether the footer wordmark is in (or near) the viewport. */
export function setFooterInView(value: boolean): void {
  if (value === inView) return;
  inView = value;
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/** True while the footer's monumental wordmark is in (or near) the viewport. */
export function useFooterInView(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => inView,
    () => false,
  );
}
