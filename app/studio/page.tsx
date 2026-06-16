import type { Metadata } from "next";
import { StudioHero } from "@/components/sections/studio/StudioHero";
import { Values } from "@/components/sections/studio/Values";
import { Team } from "@/components/sections/studio/Team";
import { Recognition } from "@/components/sections/studio/Recognition";
import { Clients } from "@/components/sections/studio/Clients";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: copy.meta.studio.title,
  description: copy.meta.studio.description,
};

export default function StudioPage() {
  return (
    <>
      <StudioHero />
      <Values />
      <Team />
      <Recognition />
      <Clients />
      <CtaBand />
    </>
  );
}
