import type { CaseStudy, Discipline } from "./types";

export const work: CaseStudy[] = [
  {
    slug: "balance-coffee",
    title: "Balance Coffee",
    client: "Specialty coffee & roaster",
    sector: "Marketing site",
    year: "2025",
    disciplines: ["Web", "Brand"],
    accent: "#a1957e",
    cover: "/work/balance-coffee.webp",
    coverPosition: "center top",
    href: "https://balancecoffee.netlify.app/",
    featured: true,
    summary:
      "A warm, editorial site for a specialty coffee shop and roaster - menu, daily, and careers, with a bilingual RU/EN toggle.",
  },
  {
    slug: "master-auto",
    title: "Master Auto",
    client: "Auto customization & detailing",
    sector: "Marketing site",
    year: "2025",
    disciplines: ["Web", "Brand"],
    accent: "#e8261f",
    cover: "/work/master-auto.webp",
    coverPosition: "center",
    href: "https://masterauto.netlify.app/",
    featured: true,
    summary:
      "A bold single-page site for an auto customization and detailing shop - wraps, tint, PPF, ceramic, and tuning, one tap from contact.",
  },
  {
    slug: "melty",
    title: "Melty",
    client: "Dessert café & coffeehouse",
    sector: "Marketing site",
    year: "2025",
    disciplines: ["Web", "Brand"],
    accent: "#4a3026",
    cover: "/work/melty.webp",
    coverPosition: "center top",
    href: "https://melty-cafe.netlify.app/",
    featured: true,
    summary:
      "An elegant site for a Nalchik dessert café - built to show a chocolate-led menu and walk a visitor to the door.",
  },
  {
    slug: "history",
    title: "History",
    client: "Fine-dining restaurant",
    sector: "Marketing & reservations",
    year: "2025",
    disciplines: ["Web", "Brand"],
    accent: "#e8a868",
    cover: "/work/history.webp",
    coverPosition: "center top",
    href: "https://history-rest.netlify.app/",
    featured: true,
    summary:
      "A moody one-page site for a fine-dining restaurant in Nalchik - set the mood, then turn the visitor into a table booking.",
  },
  {
    slug: "okaraf",
    title: "Omar Karaf",
    client: "Personal portfolio",
    sector: "Portfolio site",
    year: "2025",
    disciplines: ["Web", "Brand"],
    accent: "#1a1a1a",
    cover: "/work/okaraf.webp",
    coverPosition: "center",
    href: "https://okaraf.netlify.app/",
    featured: false,
    summary:
      "A monochrome developer portfolio - a fluid marbled hero and project case work, built to win design-led inquiries.",
  },
];

/**
 * Disciplines actually represented in the work, in canonical order - this drives
 * the filter row, so it never shows a chip that would resolve to an empty grid.
 */
const DISCIPLINE_ORDER: Discipline[] = [
  "Web",
  "AI",
  "Apps",
  "Brand",
  "Strategy",
  "Motion",
];
export const disciplines = DISCIPLINE_ORDER.filter((d) =>
  work.some((w) => w.disciplines.includes(d)),
);

export const featuredWork = work.filter((c) => c.featured);
