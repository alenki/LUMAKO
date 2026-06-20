import type { Metadata } from "next";
import { TextReveal } from "@/components/ui/TextReveal";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: copy.meta.contact.title,
  description: copy.meta.contact.description,
};

export default function ContactPage() {
  const c = copy.contact;
  return (
    <section className="section-lg pt-[calc(var(--header-h)+var(--vw-8))]">
      <div className="container-x">
        {/* Full-width on mobile; from lg up the whole column shifts right by a
            margin that grows with the viewport, so the editorial left void
            scales the way it does at 2k (the 20% reference) instead of snapping
            to it at lg and crowding the headline against the gutter. */}
        <div className="max-w-7xl lg:ml-[10%] xl:ml-[15%] 2xl:ml-[20%]">
          <header>
            <TextReveal
              as="h1"
              text={c.headline}
              className="block font-display text-[length:var(--text-7xl)] font-medium leading-[1.02] tracking-tight text-balance"
            />
          </header>

          <div className="mt-16 md:mt-20">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
