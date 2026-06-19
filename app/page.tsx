import { Hero } from "@/components/sections/home/Hero";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { Studio } from "@/components/sections/home/Studio";
import { CtaBand } from "@/components/sections/home/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Studio />
      <ServicesOverview />
      <CtaBand />
    </>
  );
}
