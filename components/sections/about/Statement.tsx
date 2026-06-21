import type { CSSProperties } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { copy } from "@/lib/content/copy";

/** The About hero: one monumental studio statement, left-aligned but indented well
 *  into the page and vertically centred in the viewport. Lines are hard-broken at
 *  deliberately uneven lengths (see copy) so the block reads ragged, not boxy. The
 *  lume dot hugs the wordmark. The rightward indent is set via the inline --stmt-pl
 *  var on .stmt-indent (see globals.css) - reliable to tune, no Tailwind JIT needed. */
export function Statement() {
  const a = copy.about;
  return (
    <section className="flex min-h-dvh flex-col justify-center py-[calc(var(--header-h)+var(--vw-6))]">
      <div className="container-x">
        <div className="stmt-indent" style={{ "--stmt-pl": "12vw" } as CSSProperties}>
          {/* >=768: the deliberate ragged hard-break composition, each line rising
              from a clip mask. The font slope is tuned (4.2vw) so the widest line
              clears the indented column without wrapping from 768 up to the locked
              2K layout - where it still resolves to the 6.5rem cap, unchanged. */}
          <TextReveal
            as="h1"
            text={a.statement}
            dotAfter="Lumako"
            reveal="lines"
            delay={0.08}
            stagger={0.09}
            className="hidden font-display text-[length:clamp(2rem,4.2vw,6.5rem)] font-medium leading-[1.32] tracking-[-0.03em] md:block"
          />
          {/* <768: same statement, phone-tuned hard breaks (statementMobile) so each
              line rises from its own clip mask, staggered - the same "lines" reveal as
              >=768. The desktop breaks are too long for the narrow column, so there are
              more (shorter) lines here; the cascade reads identically. */}
          <TextReveal
            as="h1"
            text={a.statementMobile}
            dotAfter="Lumako"
            reveal="lines"
            delay={0.06}
            stagger={0.08}
            className="mx-auto block w-fit text-left font-display text-[length:clamp(1.75rem,7vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.02em] md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
