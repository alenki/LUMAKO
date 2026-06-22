import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { Studio } from "@/components/sections/home/Studio";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeGraph } from "@/lib/seo/jsonld";
import { socialMeta } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION } from "@/lib/seo/config";

// No `title` here: the home page keeps the root layout's default <title>. Only the
// invisible canonical + OG/Twitter tags are added.
export const metadata: Metadata = socialMeta({
  ogTitle: "Lumako - Веб · ИИ · Приложения",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <Hero />
      <SelectedWork />
      <Studio />
      <ServicesOverview />
    </>
  );
}
