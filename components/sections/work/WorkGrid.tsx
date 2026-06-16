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
      {/* Filter row */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="tablist"
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
        className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.slug}
              layout
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
              <WorkCard item={item} index={`0${i + 1}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
