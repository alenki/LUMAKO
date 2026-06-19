import { Hero } from "@/components/sections/home/Hero";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { Studio } from "@/components/sections/home/Studio";

export default function Home() {
  return (
    <>
      <Hero />
      <Studio />
      <SelectedWork />
      <ServicesOverview />
    </>
  );
}
