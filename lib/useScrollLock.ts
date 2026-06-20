"use client";

import { useEffect } from "react";
import { setSmoothScrollPaused } from "@/components/layout/SmoothScroll";

/**
 * Freeze background scrolling while `locked` is true - for full-screen overlays.
 *
 * Pins `<body>` with `position: fixed` and an offset equal to the current scroll
 * (the iOS-Safari-proof technique: plain `overflow: hidden` still rubber-bands the
 * page behind a fixed overlay on touch), and pauses Lenis so the wheel can't drive
 * the locked page on hybrid trackpad devices. On unlock it restores the inline
 * styles it touched and snaps the window back to where it was - so the page never
 * jumps when the menu closes.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    setSmoothScrollPaused(true);
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      setSmoothScrollPaused(false);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      // Explicit "instant" - the two-arg form resolves to behavior:"auto", which
      // inherits the global `html { scroll-behavior: smooth }`, so the page would
      // visibly smooth-scroll back down to the restored offset instead of snapping.
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
    };
  }, [locked]);
}
