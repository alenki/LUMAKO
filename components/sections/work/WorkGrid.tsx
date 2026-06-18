"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Tag } from "@/components/ui/Tag";
import { WorkCard } from "@/components/sections/work/WorkCard";
import { work, disciplines } from "@/lib/content/work";
import { easeOutExpo } from "@/lib/motion";
import type { Discipline } from "@/lib/content/types";

type Filter = Discipline | "All";

export function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All"
      ? work
      : work.filter((item) => item.disciplines.includes(filter));

  return (
    <div>
      <h2 className="sr-only">All projects</h2>
      {/* Filter row */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter work by discipline"
      >
        <Tag active={filter === "All"} onClick={() => setFilter("All")}>
          All
        </Tag>
        {disciplines.map((d) => (
          <Tag key={d} active={filter === d} onClick={() => setFilter(d)}>
            {d}
          </Tag>
        ))}
      </div>

      {/* Animated grid */}
      <motion.div
        layout
        className="grid-12 mt-16 gap-x-8 gap-y-12"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.slug}
              layout
              className="col-span-12 md:col-span-6"
              initial={{ opacity: 0, y: 28 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: i * 0.06, ease: easeOutExpo },
              }}
              exit={{
                opacity: 0,
                y: 12,
                transition: { duration: 0.35, ease: easeOutExpo },
              }}
            >
              <WorkCard item={item} index={`0${i + 1}`} priority={i === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
