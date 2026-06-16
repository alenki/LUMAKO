import type { CaseStudy } from "./types";

export const work: CaseStudy[] = [
  {
    slug: "aether",
    client: "Aether",
    title: "Banking with a pulse",
    year: "2025",
    role: "Strategy, Brand, Web, Engineering",
    sector: "Fintech",
    disciplines: ["Strategy", "Brand", "Web", "Engineering"],
    accent: "#2f6bff",
    featured: true,
    summary:
      "A full identity and marketing platform for a challenger bank built for people who find finance cold. We gave money a heartbeat.",
    challenge:
      "Aether had a generous product and a forgettable face. Every competitor leaned on the same blue gradients and stock confidence. To win trust without the cliché, the brand had to feel human, precise, and quietly premium — and the site had to load instantly for users on the move.",
    approach: [
      {
        title: "Positioning before pixels",
        body: "We reframed Aether from 'another neobank' to a calm, exacting financial instrument. One promise — clarity — ran through naming, voice, and every screen.",
      },
      {
        title: "A living identity",
        body: "A monospaced numeric system and a responsive 'pulse' motif turned account balances into something that breathes. The logo contracts and expands with real data.",
      },
      {
        title: "Built to feel instant",
        body: "A headless Next.js build with edge rendering and a strict performance budget. The marketing site ships in under a second on a mid-range phone.",
      },
    ],
    gallery: [
      { caption: "Brand system & numeric type", accent: "#2f6bff", span: 2 },
      { caption: "Marketing site — hero", accent: "#1b3a8a", span: 1 },
      { caption: "Product UI — accounts", accent: "#0f1f44", span: 1 },
      { caption: "Motion — the pulse", accent: "#3080ff", span: 2 },
    ],
    results: [
      { label: "Conversion lift", value: 41, suffix: "%" },
      { label: "Lighthouse perf", value: 99, suffix: "/100" },
      { label: "Time to first byte", value: 0.4, prefix: "", suffix: "s" },
    ],
  },
  {
    slug: "volta",
    client: "Volta",
    title: "Charging, reimagined",
    year: "2025",
    role: "Brand, Product, Motion",
    sector: "Energy / Mobility",
    disciplines: ["Brand", "Product", "Motion"],
    accent: "#19c39b",
    featured: true,
    summary:
      "An EV charging network that wanted to feel less like a utility and more like a destination. We designed the app, the brand, and the moment of arrival.",
    challenge:
      "Charging is dead time. Volta wanted to own those twenty minutes — to make pulling up to a charger feel considered instead of clinical — across a mobile app, on-site signage, and a real-time availability map.",
    approach: [
      {
        title: "Energy as a material",
        body: "We built the identity around flow — gradients that move with charge state, a mark that fills as your battery does. The brand literally charges.",
      },
      {
        title: "A map you trust",
        body: "Real-time station availability rendered with a custom WebGL layer — readable at a glance, beautiful at rest, honest under load.",
      },
      {
        title: "Designed for the forecourt",
        body: "High-contrast, glanceable UI tuned for sunlight and one-handed use, with motion that confirms every action without a word.",
      },
    ],
    gallery: [
      { caption: "App — charge in progress", accent: "#19c39b", span: 1 },
      { caption: "Live availability map", accent: "#0e6b58", span: 1 },
      { caption: "Brand — energy gradients", accent: "#13a886", span: 2 },
      { caption: "On-site signage system", accent: "#0a3b32", span: 2 },
    ],
    results: [
      { label: "App store rating", value: 4.8, suffix: "★" },
      { label: "Session engagement", value: 63, suffix: "%" },
      { label: "Stations mapped", value: 1200, prefix: "", suffix: "+" },
    ],
  },
  {
    slug: "marrow",
    client: "Marrow & Co",
    title: "A table worth remembering",
    year: "2024",
    role: "Brand, Web, Motion",
    sector: "Hospitality",
    disciplines: ["Brand", "Web", "Motion"],
    accent: "#c8763c",
    featured: true,
    summary:
      "A brand and reservations experience for a chef-led restaurant group. We made the website taste like the room.",
    challenge:
      "Three restaurants, one rising group, and a booking flow that felt like a parking ticket. Marrow needed an identity with the warmth of the kitchen and a site that turned curiosity into a reservation without friction.",
    approach: [
      {
        title: "The warmth of the room",
        body: "An editorial identity — generous serif type, candle-lit tones, and photography treated like a menu. Premium, never precious.",
      },
      {
        title: "Booking as hospitality",
        body: "We rebuilt reservations as a single, gracious flow. Availability feels like a host offering you a table, not a form rejecting you.",
      },
      {
        title: "Motion with manners",
        body: "Slow, deliberate transitions and dish reveals that respect the food. Nothing bounces; everything settles.",
      },
    ],
    gallery: [
      { caption: "Identity & menu type", accent: "#c8763c", span: 2 },
      { caption: "Site — the rooms", accent: "#6e3f1e", span: 1 },
      { caption: "Reservation flow", accent: "#3d2412", span: 1 },
      { caption: "Editorial photography", accent: "#a85f2e", span: 2 },
    ],
    results: [
      { label: "Booking completion", value: 57, suffix: "%" },
      { label: "Covers per week", value: 2100, suffix: "+" },
      { label: "Press features", value: 14, suffix: "" },
    ],
  },
  {
    slug: "corder",
    client: "Corder",
    title: "Code, in concert",
    year: "2024",
    role: "Product, Engineering, Web",
    sector: "Developer Tools / AI",
    disciplines: ["Product", "Engineering", "Web"],
    accent: "#8b5cf6",
    summary:
      "A product surface and marketing site for an AI pair-programming tool — designed for the most discerning users on earth: developers.",
    challenge:
      "Developers smell marketing fluff instantly. Corder needed a site and product UI that respected the audience: dense where it counts, fast everywhere, and credible enough to earn a trial from skeptics.",
    approach: [
      {
        title: "Show, don't pitch",
        body: "Interactive, real code demos in the hero — not a video, the actual thing. The site is a proof of competence.",
      },
      {
        title: "A calm command surface",
        body: "We designed the product around a keyboard-first, low-chrome interface. Information density without the anxiety.",
      },
      {
        title: "Documentation as a feature",
        body: "Typographic, searchable, fast docs that developers actually want to read — treated with the same care as the landing page.",
      },
    ],
    gallery: [
      { caption: "Marketing site — live demo", accent: "#8b5cf6", span: 2 },
      { caption: "Product — command surface", accent: "#4c2f8a", span: 1 },
      { caption: "Docs system", accent: "#241640", span: 1 },
    ],
    results: [
      { label: "Trial sign-ups", value: 3.2, suffix: "x" },
      { label: "Docs satisfaction", value: 94, suffix: "%" },
      { label: "Bundle size", value: 88, prefix: "−", suffix: "%" },
    ],
  },
  {
    slug: "lumen-atlas",
    client: "Lumen Atlas",
    title: "Mapping the unseen",
    year: "2024",
    role: "Product, Engineering, Motion",
    sector: "Data / Geospatial",
    disciplines: ["Product", "Engineering", "Motion"],
    accent: "#38bdf8",
    summary:
      "A geospatial intelligence platform that turns oceans of sensor data into a single, legible picture. We made the invisible obvious.",
    challenge:
      "Lumen Atlas had extraordinary data and an interface only its engineers could love. Analysts drowned in layers. The product needed to make complex spatial data feel calm, fast, and trustworthy at any zoom.",
    approach: [
      {
        title: "A visual language for data",
        body: "We built a layered cartographic system — color, density, and motion encoding meaning consistently from continent to street.",
      },
      {
        title: "Performance as design",
        body: "A custom WebGL rendering pipeline keeps millions of points at 60fps. Smoothness here isn't polish; it's comprehension.",
      },
      {
        title: "Progressive depth",
        body: "The interface reveals complexity only as you ask for it — glanceable by default, exhaustive on demand.",
      },
    ],
    gallery: [
      { caption: "Platform — global view", accent: "#38bdf8", span: 2 },
      { caption: "Layer & legend system", accent: "#1e6a99", span: 1 },
      { caption: "WebGL point cloud", accent: "#0b3550", span: 1 },
      { caption: "Analyst dashboard", accent: "#2a8cc0", span: 2 },
    ],
    results: [
      { label: "Time to insight", value: 70, prefix: "−", suffix: "%" },
      { label: "Points rendered", value: 4, suffix: "M+" },
      { label: "Frame rate", value: 60, suffix: "fps" },
    ],
  },
  {
    slug: "soleil",
    client: "Soleil",
    title: "Skin, in its best light",
    year: "2023",
    role: "Brand, Web, Product",
    sector: "Beauty / Commerce",
    disciplines: ["Brand", "Web", "Product"],
    accent: "#e8a13c",
    summary:
      "A direct-to-consumer skincare brand and storefront built to feel like sunlight — warm, honest, and quietly scientific.",
    challenge:
      "Soleil entered a category drowning in pastel sameness and inflated claims. The brand had to feel both luxurious and credible, and the storefront had to convert without ever feeling like it was selling.",
    approach: [
      {
        title: "Honest luxury",
        body: "A warm, editorial identity with ingredient transparency at its heart — premium tone, plain-spoken truth.",
      },
      {
        title: "Commerce that breathes",
        body: "A headless storefront with considered pacing — product as ritual, checkout as relief. Speed and calm, together.",
      },
      {
        title: "A routine, not a cart",
        body: "We designed a guided regimen builder that turns a one-off purchase into a relationship.",
      },
    ],
    gallery: [
      { caption: "Brand & packaging", accent: "#e8a13c", span: 2 },
      { caption: "Storefront — product", accent: "#9c6a1f", span: 1 },
      { caption: "Regimen builder", accent: "#4f350f", span: 1 },
    ],
    results: [
      { label: "Conversion rate", value: 4.6, suffix: "%" },
      { label: "Repeat purchase", value: 52, suffix: "%" },
      { label: "AOV lift", value: 28, suffix: "%" },
    ],
  },
];

export const disciplines = [
  "Strategy",
  "Brand",
  "Web",
  "Product",
  "Engineering",
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
