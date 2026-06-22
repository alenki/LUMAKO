import type { Metadata } from "next";
import { ContactView } from "@/components/sections/contact/ContactView";
import { copy } from "@/lib/content/copy";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactGraph } from "@/lib/seo/jsonld";
import { socialMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: copy.meta.contact.title,
  description: copy.meta.contact.description,
  ...socialMeta({
    ogTitle: "Контакты | Lumako",
    description: copy.meta.contact.description,
    path: "/contact",
  }),
};

export default function ContactPage() {
  const c = copy.contact;
  return (
    <section className="section-lg pt-[calc(var(--header-h)+var(--vw-8))]">
      <JsonLd data={contactGraph()} />
      <div className="container-x">
        <ContactView headline={c.headline} />
      </div>
    </section>
  );
}
