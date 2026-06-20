import type { Metadata } from "next";
import { Statement } from "@/components/sections/about/Statement";
import { GetInTouch } from "@/components/sections/about/GetInTouch";
import { copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: copy.meta.about.title,
  description: copy.meta.about.description,
};

export default function AboutPage() {
  return (
    <>
      <Statement />
      <GetInTouch />
    </>
  );
}
