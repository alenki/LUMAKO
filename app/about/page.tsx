import type { Metadata } from "next";
import { Statement } from "@/components/sections/about/Statement";
import { GetInTouch } from "@/components/sections/about/GetInTouch";
import { copy } from "@/lib/content/copy";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutGraph } from "@/lib/seo/jsonld";
import { socialMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: copy.meta.about.title,
  description: copy.meta.about.description,
  ...socialMeta({
    ogTitle: "About | Lumako",
    description: copy.meta.about.description,
    path: "/about",
  }),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutGraph()} />
      <Statement />
      <GetInTouch />
    </>
  );
}
