/** Centralized page copy. Headings store optional `highlight` substrings for accent treatment. */
export const copy = {
  home: {
    hero: {
      lines: ["Most work gets", "scrolled past.", "Yours won't."],
      mark: "won't",
      sub: "Lumako is a full-stack studio - web, AI, and apps that ship and stay live. Built to be remembered, not scrolled past.",
      ctaPrimary: { label: "Start a project", href: "/contact" },
      ctaSecondary: { label: "See the work", href: "/work" },
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
    headline: "Selected works",
    highlight: "works",
    sub: "A selection of live sites, built for real businesses - coffee, dining, auto, and more. Each one shipped and in the wild; open any to see it live.",
  },

  about: {
    // The studio statement - team voice, leads with the work that proves it.
    // Hard breaks (\n) are baked in so the lines set at deliberately uneven
    // lengths (ragged, never boxy); the lume dot hugs "Lumako".
    statement:
      "Lumako is a full-stack studio\nbuilding web, AI, and apps.\nWe turn sharp ideas into products that\nship and stay live - then lead with the\nwork that proves it, not promises.",
    servicesEyebrow: "Our services",
    services: [
      "Web",
      "AI",
      "Apps",
      "Brand & identity",
      "Positioning & proof",
      "Motion & cinematic AI",
    ],
    careersEyebrow: "Careers",
    careers: "We're always glad to meet people who build.",
    getInTouch: {
      heading: "Get in touch",
      emailLabel: "Send us an email",
      projectLabel: "Have a project?",
      projectCta: "Start a brief",
    },
  },

  contact: {
    headline: "Let's start a conversation.",
    budgets: ["< $5k", "$5k-$10k", "$10k-$20k", "$20k+", "Not sure yet"],
    serviceOptions: ["Web", "AI", "Apps"],
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
    about: {
      title: "About",
      description:
        "Lumako is a full-stack studio building web, AI, and apps for real businesses - judged on a track record of shipped work, not promises.",
    },
    contact: {
      title: "Contact",
      description:
        "Start a project with Lumako. Tell us what you're building and you'll get a working direction back.",
    },
  },
} as const;
