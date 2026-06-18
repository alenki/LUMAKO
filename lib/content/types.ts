export type Discipline = "Web" | "AI" | "Apps" | "Brand" | "Strategy" | "Motion";

export interface Service {
  id: string;
  index: string;
  title: string;
  blurb: string;
  deliverables: string[];
}

export interface CaseStudy {
  slug: string;
  /** Brand / project name shown as the card title. */
  title: string;
  /** What the business is, e.g. "Specialty coffee & roaster". */
  client: string;
  /** What was built, e.g. "Marketing site". */
  sector: string;
  year: string;
  disciplines: Discipline[];
  /** Brand tone used as the load-in color behind the cover image. */
  accent: string;
  /** Real cover image served from /public, e.g. "/work/balance-coffee.webp". */
  cover: string;
  /** CSS object-position for the cover crop (defaults to "center"). */
  coverPosition?: string;
  /** Live site the card links out to. */
  href: string;
  summary: string;
  featured?: boolean;
}

export interface ProcessPhase {
  index: string;
  name: string;
  detail: string;
}

export interface Engagement {
  name: string;
  blurb: string;
  detail: string[];
}
