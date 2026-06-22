"use client";

import { motion, type Variants } from "motion/react";
import { WorkCard } from "@/components/sections/work/WorkCard";
import { work } from "@/lib/content/work";
import { easeOutExpo, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Cards per row at md+ (col-span-6). */
const COLS = 2;
/** Beat the right card of a row trails the left by, so a row slides into place
 *  one after the other instead of both at once. */
const IN_ROW_STAGGER = 0.12;

/**
 * Each project slides up from below into its slot and fades in - the whole card
 * (cover + caption) moving as one unit on the signature expo-out, so it reads as
 * "sliding into place" rather than a wipe or a pop.
 *
 * Each card is its OWN scroll trigger (whileInView, once), so the cards arrive
 * one after the other as you go down the page: on mobile (one column) every card
 * you reach slides up from the bottom; on desktop the right card of each row
 * trails the left by one beat (`custom` = the visual column) and the rows cascade
 * as they enter view.
 *
 * Only transform (y) + opacity animate - the layout box never changes size, so
 * the locked >=1700px reference is untouched.
 */
const slideUp: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: (column: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
      delay: column * IN_ROW_STAGGER,
    },
  }),
};

export function WorkGrid() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div>
      <h2 className="sr-only">Все проекты</h2>

      {/* Grid of every project, each card sliding up into place as it scrolls in.

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
        {work.map((item, i) => {
          // Visual column at md+. Below md every card is full-width (one column),
          // where this 0/1 alternation is a negligible offset and each card is its
          // own scroll trigger anyway, so each one you reach simply slides up.
          const column = i % COLS;

          if (reduced) {
            // Reduced motion: card present and fully visible, no slide.
            return (
              <div key={item.slug} className="col-span-12 md:col-span-6">
                <WorkCard item={item} priority={i === 0} />
              </div>
            );
          }

          return (
            <motion.div
              key={item.slug}
              className="col-span-12 md:col-span-6"
              variants={slideUp}
              custom={column}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <WorkCard item={item} priority={i === 0} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
