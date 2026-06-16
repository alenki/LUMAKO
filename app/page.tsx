import { Hero } from "@/components/sections/home/Hero";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { ProcessTeaser } from "@/components/sections/home/ProcessTeaser";
import { Stats } from "@/components/sections/home/Stats";
import { Testimonial } from "@/components/sections/home/Testimonial";
import { CtaBand } from "@/components/sections/home/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ServicesOverview />
      <SelectedWork />
      <ProcessTeaser />
      <Stats />
      <Testimonial />
      <CtaBand />
    </>
  );
}
