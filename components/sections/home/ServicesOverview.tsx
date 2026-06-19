"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
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

/** Splits "Web - sites & platforms" into a discipline tag + sentence-case heading. */
function splitTitle(title: string) {
  const [tag, ...rest] = title.split(" - ");
  const heading = rest.join(" - ");
  return {
    tag,
    heading: heading ? heading.charAt(0).toUpperCase() + heading.slice(1) : title,
  };
}

/** One discipline: a centered living diagram over a left-aligned caption block.
 *  The diagram draws once on scroll-in and idles only while the column is on screen. */
function DisciplineColumn({
  service,
  reduce,
  mounted,
}: {
  service: Service;
  reduce: boolean;
  mounted: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const live = useInView(ref, { margin: "0px 0px -10% 0px" });
  const Diagram = serviceDiagrams[service.id];
  const { tag, heading } = splitTitle(service.title);

  return (
    <div ref={ref} className="group flex flex-col">
      {/* large centered living diagram */}
      <div className="mx-auto aspect-square w-full max-w-[30rem]">
        <div className="grid h-full w-full place-items-center">
          {mounted && Diagram && (
            <Diagram active={drawn || reduce} idle={live && !reduce} reduce={reduce} />
          )}
        </div>
      </div>

      {/* left-aligned caption block */}
      <span className="mt-10 label-caps">{tag}</span>
      <h3 className="mt-4 font-[family-name:var(--font-grotesk)] text-[length:var(--text-3xl)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance">
        {heading}
      </h3>
      <p className="mt-5 max-w-[44ch] font-[family-name:var(--font-grotesk)] text-[length:clamp(1.125rem,1.3vw,1.3rem)] leading-relaxed text-[#3f3f3f] text-pretty">
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

  return (
    <section className="section-lg">
      <div className="container-x">
        {/* one big line */}
        <h2 className="max-w-[16ch] font-[family-name:var(--font-grotesk)] text-[length:clamp(2.75rem,6.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.025em] text-balance">
          Let&apos;s build something.
        </h2>

        {/* three-discipline gallery */}
        <div className="mt-20 grid gap-x-[var(--col-gap)] gap-y-20 md:mt-28 md:grid-cols-3">
          {featured.map((svc) => (
            <DisciplineColumn key={svc.id} service={svc} reduce={reduce} mounted={mounted} />
          ))}
        </div>
      </div>
    </section>
  );
}
