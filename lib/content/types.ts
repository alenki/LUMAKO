export type Discipline =
  | "Strategy"
  | "Brand"
  | "Web"
  | "Product"
  | "Engineering"
  | "Motion";

export interface Service {
  id: string;
  index: string;
  title: string;
  blurb: string;
  deliverables: string[];
}

export interface WorkResult {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface CaseApproach {
  title: string;
  body: string;
}

export interface GalleryPanel {
  caption: string;
  /** Muted tint for the placeholder gradient. */
  accent?: string;
  /** Relative width hint for layout (1 = full, 0.5 = half). */
  span?: 1 | 2;
}

export interface CaseStudy {
  slug: string;
  client: string;
  title: string;
  year: string;
  role: string;
  sector: string;
  disciplines: Discipline[];
  /** Muted tone used for the cover gradient + accents. */
  accent: string;
  /** Optional real cover image (future). */
  cover?: string;
  summary: string;
  challenge: string;
  approach: CaseApproach[];
  gallery: GalleryPanel[];
  results: WorkResult[];
  featured?: boolean;
}

export interface ProcessPhase {
  index: string;
  name: string;
  detail: string;
}

export interface Value {
  title: string;
  body: string;
}

export interface TeamMember {
  name: string;
  role: string;
  /** Muted tone for the portrait placeholder. */
  accent: string;
  photo?: string;
}

export interface Recognition {
  award: string;
  org: string;
  year: string;
}

export interface Engagement {
  name: string;
  blurb: string;
  detail: string[];
}
