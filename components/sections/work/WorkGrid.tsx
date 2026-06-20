"use client";

import { motion } from "motion/react";
import { WorkCard } from "@/components/sections/work/WorkCard";
import { work } from "@/lib/content/work";
import { easeOutExpo } from "@/lib/motion";

export function WorkGrid() {
  return (
    <div>
      <h2 className="sr-only">All projects</h2>

      {/* Grid of every project, staggered in on load.

          `.grid-12` sets `gap: var(--col-gap)` as an unlayered rule, so it beats
          Tailwind's layered `gap-*` utilities - a plain `gap-y-*` here would be dead.
          We override the two axes inline (inline styles outrank any selector): the
          column gap keeps the system token, while the row gap rides a slightly higher
          floor so a card's caption groups with its own cover and separates clearly from
          the next card down. It still caps at the same 2rem the 2k layout already uses,
          so the reference width is unchanged - only the tighter sizes below it open up. */}
      <div
        className="grid-12"
        style={{
          columnGap: "var(--col-gap)",
          rowGap: "clamp(1.75rem, 0.9rem + 2.6vw, 2rem)",
        }}
      >
        {work.map((item, i) => (
          <motion.div
            key={item.slug}
            className="col-span-12 md:col-span-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, delay: i * 0.06, ease: easeOutExpo },
            }}
          >
            <WorkCard item={item} priority={i === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
