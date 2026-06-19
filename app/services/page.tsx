import type { Metadata } from "next";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { Disciplines } from "@/components/sections/services/Disciplines";
import { ProcessSteps } from "@/components/sections/services/ProcessSteps";
import { Engagements } from "@/components/sections/services/Engagements";
import { copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: copy.meta.services.title,
  description: copy.meta.services.description,
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <Disciplines />
      <ProcessSteps />
      <Engagements />
    </>
  );
}
