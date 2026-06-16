import type { CaseStudy } from "./types";

export const work: CaseStudy[] = [
  {
    slug: "clinic-booking",
    client: "Clinic group",
    title: "Books the appointment on WhatsApp",
    year: "2025",
    role: "Web, AI",
    sector: "Clinics & dental",
    disciplines: ["Web", "AI"],
    accent: "#d49a2e",
    featured: true,
    summary:
      "A booking system for an appointment-led clinic group: a WhatsApp assistant that answers, books the slot, and sends the reminder — wired into a site that loads fast.",
    challenge:
      "The clinics ran on phone tag and a calendar nobody trusted. Front-desk staff lost hours confirming and reminding, and after-hours messages went unanswered until morning. They needed a system that answered the moment a patient wrote — not a brochure.",
    approach: [
      {
        title: "The assistant does the whole job",
        body: "It answers on WhatsApp, books the appointment against real availability, and sends the reminder. That's the entire flow — no app to install, no form to abandon.",
      },
      {
        title: "Availability you can trust",
        body: "Slots sync with the clinic calendar in real time, so the assistant never offers a time that's gone. Staff see every booking land where they already work.",
      },
      {
        title: "A site that backs it up",
        body: "A fast, plain marketing site carries the proof and the booking link. Typed, accessible, and quick on a mid-range phone over mobile data.",
      },
    ],
    gallery: [
      { caption: "WhatsApp booking flow", accent: "#d49a2e", span: 2 },
      { caption: "Site — services & booking", accent: "#9c6e1b", span: 1 },
      { caption: "Reminder & confirmation", accent: "#737373", span: 1 },
      { caption: "Availability sync", accent: "#171717", span: 2 },
    ],
    results: [
      { label: "Bookings handled by assistant", value: 72, suffix: "%" },
      { label: "Front-desk hours saved / wk", value: 11, suffix: "" },
      { label: "After-hours reply time", value: 0, prefix: "<", suffix: "min" },
    ],
  },
  {
    slug: "dental-medspa",
    client: "Dental & medspa",
    title: "A site that fills the chair",
    year: "2025",
    role: "Web, AI",
    sector: "Medspa & dental",
    disciplines: ["Web", "AI"],
    accent: "#9c6e1b",
    featured: true,
    summary:
      "A site and reminder system for a dental and medspa practice — built so a curious visitor becomes a confirmed appointment without a phone call.",
    challenge:
      "The practice looked premium in person and generic online. Inquiries arrived through a contact form that nobody chased, and no-shows ate into a fully booked week. The brand needed to feel as considered as the room — and the funnel needed to close itself.",
    approach: [
      {
        title: "Premium, plainly",
        body: "An editorial site that reads like the practice feels — warm, exact, fast. Treatments and proof up front, booking always one tap away.",
      },
      {
        title: "Reminders that cut no-shows",
        body: "Automated confirmations and reminders go out on the channel patients already use. Fewer empty slots, less front-desk chasing.",
      },
      {
        title: "Inquiries that don't go cold",
        body: "Every inquiry gets an instant, specific reply and a route to book — not a form sitting in an inbox until Monday.",
      },
    ],
    gallery: [
      { caption: "Identity & site system", accent: "#9c6e1b", span: 2 },
      { caption: "Treatments & proof", accent: "#d49a2e", span: 1 },
      { caption: "Booking flow", accent: "#737373", span: 1 },
      { caption: "Reminder sequence", accent: "#0a0a0a", span: 2 },
    ],
    results: [
      { label: "No-show reduction", value: 38, prefix: "−", suffix: "%" },
      { label: "Inquiry-to-booking", value: 46, suffix: "%" },
      { label: "Lighthouse perf", value: 99, suffix: "/100" },
    ],
  },
  {
    slug: "dubai-listings",
    client: "Real-estate team",
    title: "Listings that move at volume",
    year: "2025",
    role: "Web, Apps",
    sector: "Real-estate · Dubai",
    disciplines: ["Web", "Apps"],
    accent: "#171717",
    featured: true,
    summary:
      "A listing platform for a Dubai broker team working at volume — fast to publish, fast to share, and built for agents who live in their tools.",
    challenge:
      "The team pushed dozens of listings a week across chats and portals, re-keying the same details everywhere. Leads slipped between agents and nobody could say which listing pulled them. They needed one place to publish and share, not five.",
    approach: [
      {
        title: "Publish once, share anywhere",
        body: "Agents enter a listing once and get a clean, shareable page and a portal feed from the same record. No re-keying, no stale copies.",
      },
      {
        title: "Built for how agents work",
        body: "A tool-fluent, Russian-speaking team gets keyboard-fast entry, instant share links, and a dashboard that loads at volume.",
      },
      {
        title: "Leads that land somewhere",
        body: "Every inquiry attaches to its listing and its agent, so the team can see what's pulling and follow up before the lead cools.",
      },
    ],
    gallery: [
      { caption: "Listing dashboard", accent: "#171717", span: 2 },
      { caption: "Shareable listing page", accent: "#737373", span: 1 },
      { caption: "Agent & lead view", accent: "#9c6e1b", span: 1 },
      { caption: "Publish flow", accent: "#d49a2e", span: 2 },
    ],
    results: [
      { label: "Time to publish a listing", value: 70, prefix: "−", suffix: "%" },
      { label: "Listings live", value: 1400, suffix: "+" },
      { label: "Leads attributed", value: 100, suffix: "%" },
    ],
  },
  {
    slug: "ai-competition",
    client: "University",
    title: "The build that won the room",
    year: "2025",
    role: "AI",
    sector: "AI · competition",
    disciplines: ["AI"],
    accent: "#d49a2e",
    summary:
      "A working AI product built for a university competition — and it won. A demo that argued for itself in front of judges, not a slide deck about one.",
    challenge:
      "A competition rewards the team that shows something real under a deadline. Most entries pitch an idea; the goal here was to walk in with a product that already worked end to end and let the judges click it.",
    approach: [
      {
        title: "Ship a real thing, not a concept",
        body: "Scoped to one outcome the model had to deliver, then built whole — data, model, and interface — so the demo was the entry.",
      },
      {
        title: "Retrieval over real data",
        body: "An LLM feature grounded in actual source data, answering specific questions accurately instead of improvising — credible under judges' scrutiny.",
      },
      {
        title: "The demo did the arguing",
        body: "No promises about what it could become. A working product in front of the room — proof carried the result.",
      },
    ],
    gallery: [
      { caption: "Working product — main view", accent: "#d49a2e", span: 2 },
      { caption: "Retrieval & answers", accent: "#9c6e1b", span: 1 },
      { caption: "Model pipeline", accent: "#171717", span: 1 },
    ],
    results: [
      { label: "Competition result", value: 1, prefix: "#", suffix: "" },
      { label: "Built end to end", value: 1, suffix: " operator" },
      { label: "Live demo at judging", value: 100, suffix: "%" },
    ],
  },
  {
    slug: "salon-booking",
    client: "Salon",
    title: "A booking app the front desk loves",
    year: "2024",
    role: "Apps",
    sector: "Salons",
    disciplines: ["Apps"],
    accent: "#737373",
    summary:
      "A booking app for a busy salon — clients book themselves, staff see the day at a glance, and the calendar finally tells the truth.",
    challenge:
      "The salon juggled a paper book, a phone, and three messaging apps. Double-bookings happened, gaps went unfilled, and nobody had a clean view of the day. They wanted one app that the front desk would actually use.",
    approach: [
      {
        title: "Self-serve booking",
        body: "Clients pick a service, a stylist, and a real open slot — no back-and-forth. The book stops being a bottleneck.",
      },
      {
        title: "The day at a glance",
        body: "Staff see every appointment, gap, and walk-in on one screen, fast enough to check between clients.",
      },
      {
        title: "One source of truth",
        body: "Bookings from every channel land in the same calendar, so double-bookings stop and gaps get filled.",
      },
    ],
    gallery: [
      { caption: "Client booking flow", accent: "#737373", span: 2 },
      { caption: "Front-desk day view", accent: "#9c6e1b", span: 1 },
      { caption: "Stylist schedule", accent: "#d49a2e", span: 1 },
    ],
    results: [
      { label: "Self-served bookings", value: 64, suffix: "%" },
      { label: "Double-bookings", value: 0, suffix: "" },
      { label: "Gaps filled / week", value: 23, suffix: "+" },
    ],
  },
  {
    slug: "gov-portal",
    client: "Government body",
    title: "A public web build, done right",
    year: "2024",
    role: "Web, Brand",
    sector: "Government",
    disciplines: ["Web", "Brand"],
    accent: "#0a0a0a",
    summary:
      "A public-facing web build for a government body — accessible, fast, and clearly organized, with a restrained identity to match.",
    challenge:
      "A public site has to work for everyone, on any device, on any connection — and look the part of the institution behind it. The brief was a build that's legible, accessible by default, and easy to keep up to date.",
    approach: [
      {
        title: "Accessible by default",
        body: "Built to standards from the first commit — keyboard navigation, real contrast, semantic structure. The audience is everyone.",
      },
      {
        title: "A restrained identity",
        body: "A quiet, official wordmark and a clear type and color system — enough brand to feel like one institution, never decorative.",
      },
      {
        title: "Easy to keep current",
        body: "A headless CMS so non-technical staff can publish and update without breaking the build or the layout.",
      },
    ],
    gallery: [
      { caption: "Public site — home", accent: "#0a0a0a", span: 2 },
      { caption: "Identity & type system", accent: "#737373", span: 1 },
      { caption: "Content & CMS", accent: "#9c6e1b", span: 1 },
      { caption: "Accessible components", accent: "#d49a2e", span: 2 },
    ],
    results: [
      { label: "Accessibility score", value: 100, suffix: "/100" },
      { label: "Lighthouse perf", value: 98, suffix: "/100" },
      { label: "Editable by staff", value: 100, suffix: "%" },
    ],
  },
];

export const disciplines = [
  "Web",
  "AI",
  "Apps",
  "Brand",
  "Strategy",
  "Motion",
] as const;

export function getCase(slug: string) {
  return work.find((c) => c.slug === slug);
}

export function getNextCase(slug: string) {
  const i = work.findIndex((c) => c.slug === slug);
  if (i === -1) return work[0];
  return work[(i + 1) % work.length];
}

export const featuredWork = work.filter((c) => c.featured);
