import type { Service, ProcessPhase, Engagement } from "./types";

export const services: Service[] = [
  {
    id: "strategy",
    index: "01",
    title: "Strategy & Positioning",
    blurb:
      "We find the sharpest version of the idea before a single pixel is drawn. Clarity is the cheapest performance gain you'll ever buy.",
    deliverables: [
      "Brand & product strategy",
      "Market & user research",
      "Positioning & messaging",
      "Naming",
      "Roadmaps & north-star definition",
    ],
  },
  {
    id: "brand",
    index: "02",
    title: "Brand & Identity",
    blurb:
      "Identity systems that hold up across every surface — confident at a billboard's scale and a favicon's. Built to be lived in, not just admired.",
    deliverables: [
      "Identity systems",
      "Logo & wordmark",
      "Type & color systems",
      "Art direction",
      "Brand guidelines",
    ],
  },
  {
    id: "web",
    index: "03",
    title: "Web Design",
    blurb:
      "Sites that feel inevitable — fast, considered, and impossible to mistake for anyone else. Editorial craft, engineered to convert.",
    deliverables: [
      "Marketing & campaign sites",
      "Design systems",
      "Editorial & storytelling",
      "Microsites",
      "Headless CMS",
    ],
  },
  {
    id: "product",
    index: "04",
    title: "Product & UX",
    blurb:
      "Interfaces people reach for without thinking. We design the whole arc — from first run to power user — with the same obsessive detail.",
    deliverables: [
      "Product & UX design",
      "Design systems",
      "Prototyping",
      "Dashboards & web apps",
      "Usability & flow design",
    ],
  },
  {
    id: "engineering",
    index: "05",
    title: "Engineering & Build",
    blurb:
      "We don't hand off — we ship. Production front-ends built the way we'd want to maintain them: typed, fast, and accessible by default.",
    deliverables: [
      "Front-end engineering",
      "Next.js & React",
      "Headless & CMS integration",
      "WebGL & motion systems",
      "Performance & accessibility",
    ],
  },
  {
    id: "motion",
    index: "06",
    title: "Motion & 3D",
    blurb:
      "The difference between good and unforgettable is usually motion. Interaction, real-time 3D, and brand animation that earns its frame rate.",
    deliverables: [
      "Interaction design",
      "WebGL / Three.js",
      "Brand & UI motion",
      "Real-time 3D",
      "Prototyped animation",
    ],
  },
];

export const processPhases: ProcessPhase[] = [
  {
    index: "01",
    name: "Discover",
    detail:
      "We immerse — audits, interviews, and a hard look at the market. We leave with the questions worth answering.",
  },
  {
    index: "02",
    name: "Define",
    detail:
      "Strategy, positioning, and scope. We agree on the one thing this work has to do before we make anything.",
  },
  {
    index: "03",
    name: "Design",
    detail:
      "Concept, system, and craft. We design in the medium — real type, real motion, real data — not flat mockups.",
  },
  {
    index: "04",
    name: "Build",
    detail:
      "Engineering in parallel with design. Typed, tested, and reviewed — the polish is in the code, not bolted on.",
  },
  {
    index: "05",
    name: "Launch",
    detail:
      "We ship with you: performance budgets, QA across the matrix, and a launch that doesn't keep anyone up at night.",
  },
  {
    index: "06",
    name: "Evolve",
    detail:
      "Great products are never finished. We measure, sharpen, and keep the system healthy long after go-live.",
  },
];

export const engagements: Engagement[] = [
  {
    name: "Project",
    blurb: "A defined outcome, start to finish.",
    detail: [
      "Fixed scope & timeline",
      "Brand, site, or product build",
      "Typically 6–14 weeks",
    ],
  },
  {
    name: "Retainer",
    blurb: "An ongoing partner on call.",
    detail: [
      "Monthly design + build capacity",
      "Roadmap & iteration",
      "Best for scaling teams",
    ],
  },
  {
    name: "Embedded",
    blurb: "We join your team as one of you.",
    detail: [
      "Dedicated squad",
      "Your tools, your standups",
      "For deep, long-haul work",
    ],
  },
];

export function getService(id: string) {
  return services.find((s) => s.id === id);
}
