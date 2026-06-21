"use client";

import { useState } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { ContactForm } from "@/components/sections/contact/ContactForm";

/** Owns the "message sent" flag so the page headline can step aside once the
 *  form is submitted, leaving the confirmation as a clean, centred moment. */
export function ContactView({ headline }: { headline: string }) {
  const [sent, setSent] = useState(false);

  return (
    // The locked 2k reference keeps its editorial left-void: ml-[20%] is the
    // base value, so the headline + form column sits left-of-centre on the
    // widest screens. Below ~2261px - where that 20% indent would otherwise
    // shove the column right-of-centre - it recentres with mx-auto. The
    // crossover is seamless: ml-[20%] already equals dead-centre at ~2261px.
    <div className="max-w-7xl ml-[20%] max-[2261px]:mx-auto">
      {!sent && (
        <header>
          <TextReveal
            as="h1"
            text={headline}
            className="block font-display text-[length:var(--text-7xl)] font-medium leading-[1.02] tracking-tight text-balance"
          />
        </header>
      )}

      <div
        className={
          sent
            ? "flex min-h-[55vh] flex-col justify-center"
            : "mt-16 md:mt-20"
        }
      >
        <ContactForm onSentChange={setSent} />
      </div>
    </div>
  );
}
