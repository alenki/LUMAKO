/** Centralized page copy. Headings store optional `highlight` substrings for italic-accent treatment. */
export const copy = {
  home: {
    hero: {
      lines: ["Most work gets", "scrolled past.", "Yours won't."],
      mark: "won't",
      sub: "Lumako is a full-stack studio - web, AI, and apps that ship and stay live. Built to be remembered, not scrolled past.",
      ctaPrimary: { label: "Start a project", href: "/contact" },
      ctaSecondary: { label: "See the work", href: "/work" },
    },
    services: {
      eyebrow: "What we build",
      headline: "Web, AI, and apps - from one team on one engine.",
      highlight: "one engine.",
      link: { label: "All services", href: "/services" },
    },
    work: {
      headline: "Work that went live.",
      link: { label: "View all work", href: "/work" },
    },
    studio: {
      // One flowing statement, broken by the mark into a lead + a wide "what we make"
      // line. The craft string carries explicit breaks so it always sets as three
      // length-balanced lines (TextReveal still exposes the joined sentence to a11y).
      lead: "Lumako is a full-stack studio",
      craft: "We design, build, and\nship web, AI, and apps\nfor real businesses",
    },
  },

  work: {
    eyebrow: "Work",
    headline: "Shipped products, doing a job.",
    highlight: "doing a job.",
    sub: "A selection of live sites, built for real businesses - coffee, dining, auto, and more. Each one shipped and in the wild; open any to see it live.",
  },

  services: {
    eyebrow: "Services",
    headline: "Web, AI, and apps - one team, end to end.",
    highlight: "end to end.",
    sub: "Engage Lumako for the part you need, or the whole build. One team across the stack - no handoff, no telephone game.",
    processEyebrow: "How it works",
    processHeadline: "Proof first. Price upfront.",
    engagementsEyebrow: "Engagements",
    engagementsHeadline: "Ways to work together.",
  },

  contact: {
    eyebrow: "Start a project",
    headline: "Tell us what you're building.",
    highlight: "building.",
    sub: "The more you share, the sharper the first response. Every serious inquiry gets a reply - specific and real, never a templated pitch.",
    budgets: ["< $5k", "$5k-$15k", "$15k-$40k", "$40k+", "Not sure yet"],
    serviceOptions: ["Web", "AI", "Apps", "Brand", "Motion"],
    success: {
      title: "Got it.",
      body: "Message received. Expect a working, specific reply - not a templated pitch.",
    },
  },

  meta: {
    home: {
      title: "Lumako - Web · AI · Apps",
      description:
        "Lumako is a full-stack studio that ships web, AI, and app products - judged on a track record of shipped work, not promises.",
    },
    work: {
      title: "Work",
      description:
        "Live sites built by Lumako for real businesses - coffee, dining, auto, and more. Each one shipped and in the wild.",
    },
    services: {
      title: "Services",
      description:
        "Web, AI, and apps from one team, end to end. Proof first, price upfront.",
    },
    contact: {
      title: "Contact",
      description:
        "Start a project with Lumako. Tell us what you're building and you'll get a working direction back.",
    },
  },
} as const;
