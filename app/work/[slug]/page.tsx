import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { work, getCase, getNextCase } from "@/lib/content/work";
import { CaseHero } from "@/components/sections/work/CaseHero";
import { CaseBody } from "@/components/sections/work/CaseBody";
import { CaseGallery } from "@/components/sections/work/CaseGallery";
import { CaseResults } from "@/components/sections/work/CaseResults";
import { NextProject } from "@/components/sections/work/NextProject";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) {
    return { title: "Work" };
  }
  return {
    title: `${item.title} — ${item.client}`,
    description: item.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  return (
    <>
      <CaseHero item={item} />
      <CaseBody item={item} />
      <CaseGallery item={item} />
      <CaseResults item={item} />
      <NextProject item={getNextCase(slug)} />
    </>
  );
}
