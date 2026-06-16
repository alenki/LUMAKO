import type { Value, TeamMember, Recognition } from "./types";

export const studioManifesto = {
  lead: "Lumako is one full-stack operator out of Nalchik, shipping web, AI, and app products and handing them over working.",
  body: [
    "Not a vendor, not a freelancer-for-hire, not a deck. A single practice that builds across the whole stack — web, AI, apps — and is judged by what reaches market. The person who scopes the work is the person who writes the code and ships it.",
    "The portfolio is the credential: government and university builds, a won university AI competition, 1.5+ years in production. Show, don't sell — the demo opens every conversation and the work does the arguing.",
  ],
};

export const values: Value[] = [
  {
    title: "Proof.",
    body: "Shipped work for government bodies and universities, a won university AI competition, 1.5+ years in production. The portfolio is the credential — not a résumé, not a pitch deck.",
  },
  {
    title: "Range.",
    body: "Web, AI, and apps from one operator on one engine. Not a menu of outsourced specialists — a single practice that builds across the whole stack and hands it over finished.",
  },
  {
    title: "Outcome.",
    body: "The deliverable is a product live in market, doing a job — not a retainer of activity or a slide library. Measured by what ships and what it moves.",
  },
  {
    title: "Solo, stated plainly.",
    body: "One operator is a feature, not a thing to hide: one point of contact, no handoff between you and the person building. The builder is in the room.",
  },
];

export const team: TeamMember[] = [
  { name: "Solo founder", role: "Full-stack — web · AI · apps", accent: "#d49a2e" },
];

export const recognition: Recognition[] = [
  { award: "Won — University AI Competition", org: "University", year: "2025" },
  { award: "Government & university builds", org: "Delivered", year: "—" },
  { award: "1.5+ years in production", org: "Live", year: "—" },
];

export const clients = [
  "Government bodies",
  "Universities",
  "Clinics & dental",
  "Medspa & salons",
  "Real-estate teams",
  "Founders & operators",
];
