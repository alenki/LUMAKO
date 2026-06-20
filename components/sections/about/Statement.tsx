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
          <TextReveal
            as="h1"
            text={a.statement}
            dotAfter="Lumako"
            reveal="lines"
            delay={0.08}
            stagger={0.09}
            className="block font-display text-[length:clamp(2.4rem,4.8vw,6.5rem)] font-medium leading-[1.32] tracking-[-0.03em]"
          />
        </div>
      </div>
    </section>
  );
}
