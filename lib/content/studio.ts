import type { Value, TeamMember, Recognition } from "./types";

export const studioManifesto = {
  lead: "We're a small studio with an unfashionable belief: that the web can still feel made — by people, for people, with care you can feel.",
  body: [
    "Lumako designs and builds digital products end to end. No handoffs to lose the thread, no agency theater. The people who shape the strategy are the people who draw the screens and ship the code.",
    "We work with founders and teams who treat their product as a craft — and want a partner who treats it the same way.",
  ],
};

export const values: Value[] = [
  {
    title: "Clarity is a feature.",
    body: "The hardest, most valuable work is making the complicated feel obvious. We chase clarity before decoration — every time.",
  },
  {
    title: "Craft compounds.",
    body: "The thousand small decisions are the work. Kerning, easing, the empty state — they add up to the feeling of inevitability.",
  },
  {
    title: "We ship what we design.",
    body: "Design and engineering aren't a relay race. We hold the whole thing, so nothing precious gets lost in translation.",
  },
  {
    title: "Light over noise.",
    body: "We'd rather make one quiet, exact thing than ten loud ones. Restraint is a competitive advantage.",
  },
];

export const team: TeamMember[] = [
  { name: "Mara Vance", role: "Founder & Creative Director", accent: "#3080ff" },
  { name: "Theo Okonkwo", role: "Design Director", accent: "#19c39b" },
  { name: "Ines Halvorsen", role: "Engineering Lead", accent: "#8b5cf6" },
  { name: "Daniel Reyes", role: "Strategy Lead", accent: "#e8a13c" },
];

export const recognition: Recognition[] = [
  { award: "Site of the Day", org: "Awwwards", year: "2025" },
  { award: "FWA of the Day", org: "The FWA", year: "2025" },
  { award: "Best UI Design", org: "CSS Design Awards", year: "2024" },
  { award: "Webby Nominee", org: "The Webbys", year: "2024" },
  { award: "Site of the Month", org: "Awwwards", year: "2024" },
  { award: "Developer Award", org: "Awwwards", year: "2023" },
];

export const clients = [
  "Aether",
  "Volta",
  "Marrow & Co",
  "Corder",
  "Lumen Atlas",
  "Soleil",
  "Northwind",
  "Faro",
  "Cobalt",
  "Meridian",
  "Halcyon",
  "Verdant",
];
