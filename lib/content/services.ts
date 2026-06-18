import type { Service, ProcessPhase, Engagement } from "./types";

export const services: Service[] = [
  {
    id: "web",
    index: "01",
    title: "Web - sites & platforms",
    blurb:
      "Marketing sites, booking systems, and dashboards that load fast and do a job. Typed, accessible, and built the way we'd want to maintain it.",
    deliverables: [
      "Marketing & campaign sites",
      "Booking & scheduling systems",
      "Dashboards & internal tools",
      "Headless CMS",
      "Performance & accessibility",
    ],
  },
  {
    id: "ai",
    index: "02",
    title: "AI - assistants & automation",
    blurb:
      "Assistants that answer on WhatsApp or Telegram, book the appointment, and send the reminder - plus LLM features and retrieval wired into real workflows.",
    deliverables: [
      "WhatsApp & Telegram booking assistants",
      "LLM features in product",
      "Retrieval over your own data",
      "Internal automation tools",
      "Integration with existing systems",
    ],
  },
  {
    id: "apps",
    index: "03",
    title: "Apps - product builds",
    blurb:
      "End-to-end product, from the data model to the screen. Web apps, mobile-web, and internal apps - built whole and handed over working.",
    deliverables: [
      "Web & mobile-web apps",
      "Internal & operations apps",
      "End-to-end product builds",
      "Auth, data, and API work",
      "Maintenance & iteration",
    ],
  },
  {
    id: "brand",
    index: "04",
    title: "Brand & identity",
    blurb:
      "A wordmark, a type and color system, and the rules to use them - enough identity to make the product feel like one thing, held by the team that builds it.",
    deliverables: [
      "Wordmark & identity",
      "Type & color systems",
      "Art direction",
      "Brand guidelines",
      "Asset & template kit",
    ],
  },
  {
    id: "strategy",
    index: "05",
    title: "Positioning & proof",
    blurb:
      "Finding the sharpest version of the idea, then leading with the demo. Clarity is the cheapest performance gain you'll ever buy.",
    deliverables: [
      "Positioning & messaging",
      "Proof & receipts framing",
      "Naming",
      "Scope & roadmap",
      "Demo-first launch plan",
    ],
  },
  {
    id: "motion",
    index: "06",
    title: "Motion & cinematic AI",
    blurb:
      "Three.js hero work and composed AI brand frames - one deliberate motion choice per view, golden-hour light, never gimmicky.",
    deliverables: [
      "Three.js / WebGL hero work",
      "Interaction & UI motion",
      "Cinematic AI brand frames",
      "Real-time 3D",
      "Prototyped animation",
    ],
  },
];

export const processPhases: ProcessPhase[] = [
  {
    index: "01",
    name: "Scope",
    detail:
      "We agree on the problem and what done looks like. One outcome the build has to deliver - written down before anything is made.",
  },
  {
    index: "02",
    name: "Build",
    detail:
      "We build the working thing across the stack - web, AI, app. No handoff, no telephone game: the people planning it write the code.",
  },
  {
    index: "03",
    name: "Demo",
    detail:
      "You get a working product to click, not a deck to imagine. The demo opens the conversation; words only fill the gaps.",
  },
  {
    index: "04",
    name: "Price",
    detail:
      "With the build in front of you, we name the price. Proof carries the sale - the outcome comes before the invoice.",
  },
  {
    index: "05",
    name: "Ship",
    detail:
      "We put it live: performance budget, QA across the matrix, and a handover that leaves the product yours and running.",
  },
  {
    index: "06",
    name: "Support",
    detail:
      "Shipped isn't finished. We stay on to measure, sharpen, and keep the system healthy long after go-live.",
  },
];

export const engagements: Engagement[] = [
  {
    name: "Project",
    blurb: "A defined outcome, start to finish.",
    detail: [
      "Fixed scope & timeline",
      "Web, AI, or app build - shipped",
      "Demo before the price",
    ],
  },
  {
    name: "Retainer",
    blurb: "Our team on call, every month.",
    detail: [
      "Monthly build & iteration capacity",
      "Roadmap and ongoing work",
      "Best for products in motion",
    ],
  },
  {
    name: "Embedded",
    blurb: "Our builders in your room, full-time.",
    detail: [
      "Dedicated, full-stack capacity",
      "Your tools, your standups",
      "For deep, long-haul work",
    ],
  },
];

export function getService(id: string) {
  return services.find((s) => s.id === id);
}
