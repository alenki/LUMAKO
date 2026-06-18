"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { lerp } from "@/lib/utils";
import { buildForm } from "@/components/hero/blueprint/geometry";
import { getPhaseState, STATIC_STATE } from "@/components/hero/blueprint/phases";
import {
  renderBlueprint, DEFAULT_COLORS, type BlueprintColors,
} from "@/components/hero/blueprint/render";

function readColors(): BlueprintColors {
  if (typeof window === "undefined") return DEFAULT_COLORS;
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    line: v("--color-line", DEFAULT_COLORS.line),
    lineStrong: v("--color-line-strong", DEFAULT_COLORS.lineStrong),
    dim: v("--color-fg-dim", DEFAULT_COLORS.dim),
    ink: v("--color-fg", DEFAULT_COLORS.ink),
    muted: v("--color-fg-muted", DEFAULT_COLORS.muted),
    surface: v("--color-surface", DEFAULT_COLORS.surface),
    card2: v("--color-card-2", DEFAULT_COLORS.card2),
    lume: v("--color-lume", DEFAULT_COLORS.lume),
  };
}

/**
 * "Drafted, then built" - a Canvas-2D blueprint that self-draws then resolves
 * into a built solid, on loop. Decorative; pauses off-screen / when hidden.
 */
export function HeroBlueprint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const form = buildForm();
    const colors = readColors();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let dims = { width: 0, height: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dims = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) renderBlueprint(ctx, dims, STATIC_STATE, form, { x: 0, y: 0 }, colors);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduce) {
      return () => ro.disconnect();
    }

    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let rafActive = false;
    // Two independent reasons to pause; the loop runs only when BOTH allow it.
    let onScreen = false; // set by the IntersectionObserver's initial callback
    let docVisible = !document.hidden;

    const frame = (now: number) => {
      if (!rafActive) return;
      if (last === 0) last = now;
      elapsed += (now - last) / 1000;
      last = now;
      pointer.x = lerp(pointer.x, pointer.tx, 0.05);
      pointer.y = lerp(pointer.y, pointer.ty, 0.05);
      renderBlueprint(ctx, dims, getPhaseState(elapsed), form, { x: pointer.x, y: pointer.y }, colors);
      raf = requestAnimationFrame(frame);
    };

    // Start/stop the loop from the composed (onScreen && docVisible) state.
    const sync = () => {
      const shouldRun = onScreen && docVisible;
      if (shouldRun && !rafActive) {
        rafActive = true;
        last = 0; // (re)start without a time jump
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && rafActive) {
        rafActive = false;
        cancelAnimationFrame(raf);
      }
    };

    // The IO's first callback reports the current intersection and kicks the
    // initial frame — so an off-screen mount never renders wasted frames.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      docVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      rafActive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
