"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TextReveal } from "@/components/ui/TextReveal";
import { serviceDiagrams } from "./diagrams/registry";
import { services } from "@/lib/content/services";
import type { Service } from "@/lib/content/types";

// The three core disciplines featured on the home page (Web, AI, Apps).
const featured = services.slice(0, 3);

// "Is hydrated" via useSyncExternalStore: false on the server + first client paint,
// true afterwards - renders the decorative diagrams client-only without a
// setState-in-effect and keeps SSR/hydration in agreement.
const subscribeNoop = () => () => {};
const snapClient = () => true;
const snapServer = () => false;

// Shared cycle timing (ms): the whole gallery self-draws + holds, then retracts just
// as slowly as it drew in, then redraws - forever. Run from ONE clock below so all
// three diagrams stay frame-locked.
const ON = 3200; // entrance (~1.9s) + hold
const OFF = 700; // blank gap before redraw = the retract length. The slow window/phone
// frames now un-draw in 0.7s (quicker than they draw in), so the whole gallery clears
// together by ~0.7s and the redraw fires the instant the last stroke goes - no slow tail

/** Splits "Web - sites & platforms" into a discipline tag + sentence-case heading. */
function splitTitle(title: string) {
  const [tag, ...rest] = title.split(" - ");
  const heading = rest.join(" - ");
  return {
    tag,
    heading: heading ? heading.charAt(0).toUpperCase() + heading.slice(1) : title,
  };
}

/** One discipline: a centered living diagram over a left-aligned caption block. The
 *  diagram is a pure consumer of the section's shared cycle state, so the three draw,
 *  hold, retract, and redraw in perfect lockstep. */
function DisciplineColumn({
  service,
  reduce,
  mounted,
  active,
  idle,
  shown,
  cycleIndex,
}: {
  service: Service;
  reduce: boolean;
  mounted: boolean;
  active: boolean;
  idle: boolean;
  shown: boolean;
  cycleIndex: number;
}) {
  const Diagram = serviceDiagrams[service.id];
  const { tag, heading } = splitTitle(service.title);

  return (
    <div className="group mx-auto flex w-full max-w-[36rem] flex-col">
      {/* large centered living diagram */}
      <div className="mx-auto aspect-square w-full max-w-[36rem]">
        <div className="grid h-full w-full place-items-center">
          {mounted && Diagram && (
            <Diagram
              active={active}
              idle={idle}
              reduce={reduce}
              shown={shown}
              cycleIndex={cycleIndex}
            />
          )}
        </div>
      </div>

      {/* left-aligned caption block */}
      <span className="mt-10 label-caps">{tag}</span>
      <h3 className="mt-4 font-[family-name:var(--font-grotesk)] text-[length:var(--text-4xl)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance">
        {heading}
      </h3>
      <p className="mt-5 max-w-[44ch] font-[family-name:var(--font-grotesk)] text-[length:clamp(1.25rem,1.45vw,1.5rem)] leading-relaxed text-fg-body text-pretty">
        {service.blurb}
      </p>
      <Link
        href="/work"
        data-cursor
        className="mt-7 inline-flex w-fit self-start items-center gap-2 label-caps transition-colors hover:text-fg"
      >
        See the work
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

export function ServicesOverview() {
  const reduceRaw = useReducedMotion() ?? false;
  const mounted = useSyncExternalStore(subscribeNoop, snapClient, snapServer);
  const reduce = mounted ? reduceRaw : false;

  // ONE in-view observer + ONE timer for the whole gallery row, so every diagram
  // shares a single cycle clock and stays frame-locked (rather than each running its
  // own timer that starts whenever its column happens to cross the threshold).
  const galleryRef = useRef<HTMLDivElement>(null);
  const seen = useInView(galleryRef, { once: true, margin: "-12% 0px -12% 0px" });
  const onScreen = useInView(galleryRef, { margin: "0px 0px -10% 0px" });
  const live = mounted && seen && onScreen && !reduce;

  // The cycle toggles these on a timer (only inside timer callbacks, never
  // synchronously in the effect body). `cycleShown` drives draw vs retract for all
  // three diagrams; `cycleIndex` advances once per cycle (AppsDiagram steps its view).
  const [cycleShown, setCycleShown] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      if (cancelled) return;
      setCycleShown(true); // draw the current frame in
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setCycleShown(false); // retract (cycleIndex held steady so AppsDiagram doesn't jump tabs)
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              setCycleIndex((i) => i + 1); // advance to the next view while blank
              loop(); // redraw with the next view
            }, OFF),
          );
        }, ON),
      );
    };
    timers.push(setTimeout(loop, 0)); // first draw-in is async, off the effect body
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [live]);

  // Shared cycle state, identical for every column → the three move as one.
  const active = (mounted && seen) || reduce; // sticky "has been drawn in"
  const idle = onScreen && !reduce;
  const shown = reduce ? true : live ? cycleShown : false;

  return (
    <section className="section-lg">
      <div className="container-x">
        {/* one big line */}
        <TextReveal
          as="h2"
          text="Let's build something."
          className="max-w-[16ch] font-[family-name:var(--font-grotesk)] text-[length:clamp(2.75rem,6.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.025em] text-balance"
        />

        {/* three-discipline gallery - tracks capped to the reading measure (= the
            diagram width) and pinned to the outer grid lines, so the last column's
            copy reaches the right rule instead of stopping short on wide screens. */}
        <div
          ref={galleryRef}
          className="mt-20 grid gap-x-[var(--col-gap)] gap-y-20 lg:mt-28 lg:justify-between lg:[grid-template-columns:repeat(3,minmax(0,36rem))]"
        >
          {featured.map((svc) => (
            <DisciplineColumn
              key={svc.id}
              service={svc}
              reduce={reduce}
              mounted={mounted}
              active={active}
              idle={idle}
              shown={shown}
              cycleIndex={cycleIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
