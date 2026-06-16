import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ContactDetails } from "@/components/sections/contact/ContactDetails";
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
        <header className="max-w-[34ch]">
          <Eyebrow index="01">{c.eyebrow}</Eyebrow>
          <TextReveal
            as="h1"
            text={c.headline}
            highlight={c.highlight}
            className="mt-8 block font-display text-[length:var(--text-6xl)] font-light leading-[1.02] tracking-tight text-balance"
          />
          <Reveal index={1}>
            <p className="mt-8 max-w-[48ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
              {c.sub}
            </p>
          </Reveal>
        </header>

        <div className="mt-20 grid gap-x-16 gap-y-16 border-t border-line pt-16 md:grid-cols-2">
          <div>
            <ContactForm />
          </div>
          <div className="md:pl-8">
            <ContactDetails />
          </div>
        </div>
      </div>
    </section>
  );
}
