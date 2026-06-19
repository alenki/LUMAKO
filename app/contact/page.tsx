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
        <header className="grid-12 items-end">
          <div className="col-span-12 md:col-span-7">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <TextReveal
              as="h1"
              text={c.headline}
              highlight={c.highlight}
              className="mt-8 block font-display text-[length:var(--text-6xl)] font-medium leading-[1.02] tracking-tight text-balance"
            />
          </div>
          {c.sub && (
            <div className="col-span-12 md:col-start-9 md:col-span-4">
              <Reveal index={1}>
                <p className="text-[length:var(--text-xl)] text-fg-body leading-relaxed text-pretty">
                  {c.sub}
                </p>
              </Reveal>
            </div>
          )}
        </header>

        <div className="mt-20 grid-12 gap-y-16">
          <div className="col-span-12 md:col-span-7">
            <ContactForm />
          </div>
          <div className="col-span-12 md:col-start-9 md:col-span-4">
            <ContactDetails />
          </div>
        </div>
      </div>
    </section>
  );
}
