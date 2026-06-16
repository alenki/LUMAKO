/** Centralized page copy. Headings store optional `highlight` substrings for italic-accent treatment. */
export const copy = {
  home: {
    hero: {
      eyebrow: "Web · AI · Apps",
      headline: "Built first. Pitched second.",
      highlight: "Pitched second.",
      sub: "Lumako is a single full-stack practice that ships web, AI, and app products and hands them over working. One operator, one engine — judged by what reaches market, not by the pitch.",
      ctaPrimary: { label: "Start a project", href: "/contact" },
      ctaSecondary: { label: "See the build", href: "/work" },
    },
    manifesto: {
      eyebrow: "The stance",
      headline:
        "The demo is the pitch. Most studios sell a proposal and a promise — Lumako shows a working product first, then names the price. Proof carries the sale.",
      highlight: "The demo is the pitch.",
    },
    services: {
      eyebrow: "What I build",
      headline: "Web, AI, and apps — from one operator on one engine.",
      highlight: "one engine.",
      link: { label: "All services", href: "/services" },
    },
    work: {
      eyebrow: "Selected work",
      headline: "Shipped, not proposed.",
      link: { label: "View all work", href: "/work" },
    },
    process: {
      eyebrow: "How it works",
      headline: "The builder is in the room.",
      sub: "No agency handoff between you and the person writing the code. You talk to the operator who ships it — start to finish.",
      link: { label: "The process", href: "/services" },
    },
    proof: [
      { value: "1.5+ yrs", label: "in production" },
      { value: "Gov + university", label: "delivered builds" },
      { value: "AI competition", label: "won · university" },
      { value: "Web · AI · Apps", label: "one engine" },
    ],
    receipts: {
      eyebrow: "Receipts",
      headline: "The portfolio is the credential.",
      highlight: "the credential.",
      items: [
        "Shipped builds for government bodies and universities.",
        "Won a university AI competition.",
        "1.5+ years live in production.",
        "Live products you can click — not slides.",
      ],
    },
    cta: {
      eyebrow: "Start here",
      headline: "Tell me what you're building.",
      highlight: "building.",
      sub: "Send the problem and what done looks like. You'll get a working direction back — proof before pitch, the outcome before the invoice.",
      button: { label: "Start a project", href: "/contact" },
    },
  },

  work: {
    eyebrow: "Work",
    headline: "Shipped products, doing a job.",
    highlight: "doing a job.",
    sub: "A selection of builds across web, AI, and apps — for businesses that wanted the outcome, not a brochure.",
  },

  services: {
    eyebrow: "Services",
    headline: "Web, AI, and apps — one operator, end to end.",
    highlight: "end to end.",
    sub: "Engage Lumako for the part you need, or the whole build. One person across the stack — no handoff, no telephone game.",
    processEyebrow: "How it works",
    processHeadline: "Demo-first, then pitch.",
    engagementsEyebrow: "Engagements",
    engagementsHeadline: "Ways to work together.",
  },

  studio: {
    eyebrow: "Studio",
    headline: "One operator. The whole stack.",
    highlight: "The whole stack.",
    valuesEyebrow: "What holds",
    teamEyebrow: "Who",
    teamHeadline: "Solo, on purpose.",
    recognitionEyebrow: "Proof",
    clientsEyebrow: "Shipped for",
  },

  contact: {
    eyebrow: "Start a project",
    headline: "Tell me what you're building.",
    highlight: "building.",
    sub: "The more you share, the sharper the first response. Every serious inquiry gets a reply — proof before pitch.",
    budgets: ["< $5k", "$5k–$15k", "$15k–$40k", "$40k+", "Not sure yet"],
    serviceOptions: ["Web", "AI", "Apps", "Brand", "Motion"],
    success: {
      title: "Got it.",
      body: "Message received. Expect a working, specific reply — not a templated pitch.",
    },
  },

  meta: {
    home: {
      title: "Lumako — Web · AI · Apps",
      description:
        "Lumako is a solo full-stack studio that ships web, AI, and app products — and shows the working build before the pitch.",
    },
    work: {
      title: "Work",
      description:
        "Shipped web, AI, and app builds from Lumako — products live in market, doing a job.",
    },
    services: {
      title: "Services",
      description:
        "Web, AI, and apps from one operator, end to end. Demo-first, then pitch.",
    },
    studio: {
      title: "Studio",
      description:
        "Lumako is one full-stack operator shipping web, AI, and apps — proof over promise.",
    },
    contact: {
      title: "Contact",
      description:
        "Start a project with Lumako. Tell me what you're building and you'll get a working direction back.",
    },
  },
} as const;
