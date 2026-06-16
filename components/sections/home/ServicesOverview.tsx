"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { services } from "@/lib/content/services";
import { copy } from "@/lib/content/copy";
import type { Service } from "@/lib/content/types";

function ServiceRow({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="group border-t border-line"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      data-cursor
    >
      <div className="flex items-center gap-6 py-8">
        <span className="font-mono text-[length:var(--text-mono)] text-fg-dim">
          {service.index}
        </span>
        <h3 className="font-display text-[length:var(--text-4xl)] font-light tracking-tight text-fg-muted transition-colors duration-300 group-hover:text-fg">
          {service.title}
        </h3>
        <span className="ml-auto text-[length:var(--text-2xl)] text-fg-dim transition-transform duration-300 group-hover:rotate-45 group-hover:text-fg">
          +
        </span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="max-w-[60ch] pb-8 pl-12 text-[length:var(--text-lg)] text-fg-muted text-pretty">
          {service.blurb}
        </p>
      </motion.div>
    </div>
  );
}

export function ServicesOverview() {
  const s = copy.home.services;
  return (
    <section className="section-lg">
      <div className="container-x">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <Eyebrow index="03">{s.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[length:var(--text-4xl)] font-light leading-tight tracking-tight text-balance [&_em]:italic [&_em]:text-fg">
              Everything between the idea and the people who&apos;ll{" "}
              <em>love it.</em>
            </h2>
          </div>
          <div className="col-span-12 md:col-start-9 md:col-span-4 flex items-start">
            <Link
              href={s.link.href}
              data-cursor
              className="group flex items-center gap-2 label-caps transition-colors hover:text-fg"
            >
              {s.link.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-14 border-b border-line">
          {services.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
