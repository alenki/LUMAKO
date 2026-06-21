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
        {/* The locked 2k reference keeps its editorial left-void: ml-[20%] is the
            base value, so the headline + form column sits left-of-centre on the
            widest screens. Below ~2261px - where that 20% indent would otherwise
            shove the column right-of-centre - it recentres with mx-auto. The
            crossover is seamless: ml-[20%] already equals dead-centre at ~2261px. */}
        <div className="max-w-7xl ml-[20%] max-[2261px]:mx-auto">
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
