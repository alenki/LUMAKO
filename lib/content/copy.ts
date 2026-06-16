/** Centralized page copy. Headings store optional `highlight` substrings for italic-accent treatment. */
export const copy = {
  home: {
    hero: {
      eyebrow: "Web & Product Studio",
      headline: "We design & build the products people don't forget.",
      highlight: "don't forget.",
      sub: "Lumako is a small studio that takes ideas from strategy to shipped — brand, interface, and engineering held by one team that sweats every detail.",
      ctaPrimary: { label: "Start a project", href: "/contact" },
      ctaSecondary: { label: "See the work", href: "/work" },
    },
    manifesto: {
      eyebrow: "What we believe",
      headline:
        "Software should feel like it was made by someone who cared. So we sweat the details most teams skip — because that's exactly what people remember.",
      highlight: "someone who cared.",
    },
    services: {
      eyebrow: "What we do",
      headline: "Everything between the idea and the people who'll love it.",
      highlight: "love it.",
      link: { label: "All services", href: "/services" },
    },
    work: {
      eyebrow: "Selected work",
      headline: "A few things we're proud of.",
      link: { label: "View all work", href: "/work" },
    },
    process: {
      eyebrow: "How we work",
      headline: "One team, the whole way through.",
      sub: "No handoffs, no telephone game. From the first question to the last commit, the people who plan it make it.",
      link: { label: "Our process", href: "/services" },
    },
    stats: [
      { value: 9, suffix: "+", label: "Years in craft" },
      { value: 60, suffix: "+", label: "Products shipped" },
      { value: 12, suffix: "", label: "Industry awards" },
      { value: 98, suffix: "%", label: "Client return rate" },
    ],
    testimonial: {
      quote:
        "Lumako operate like an in-house team that happens to be better than yours. They held the vision from the first call to the last commit — and the result moved every number that mattered.",
      name: "Elena Cho",
      role: "VP Product",
      company: "Aether",
    },
    cta: {
      eyebrow: "Start here",
      headline: "Let's build something worth remembering.",
      highlight: "worth remembering.",
      sub: "Tell us what you're making. We'll tell you how we'd approach it — no pitch theater.",
      button: { label: "Start a project", href: "/contact" },
    },
  },

  work: {
    eyebrow: "Work",
    headline: "Products, brands, and the occasional obsession.",
    highlight: "obsession.",
    sub: "A selection of recent work across fintech, hospitality, developer tools, and more.",
  },

  services: {
    eyebrow: "Services",
    headline: "We hold the whole thing — strategy to shipped.",
    highlight: "shipped.",
    sub: "Six disciplines, one team. Engage us for the part you need, or the entire arc.",
    processEyebrow: "The process",
    processHeadline: "Six phases, no surprises.",
    engagementsEyebrow: "Engagements",
    engagementsHeadline: "Ways to work together.",
  },

  studio: {
    eyebrow: "Studio",
    headline: "A studio built for the work, not the org chart.",
    highlight: "the work,",
    valuesEyebrow: "What we value",
    teamEyebrow: "The people",
    teamHeadline: "Small on purpose.",
    recognitionEyebrow: "Recognition",
    clientsEyebrow: "In good company",
  },

  contact: {
    eyebrow: "Start a project",
    headline: "Tell us what you're building.",
    highlight: "building.",
    sub: "The more you share, the sharper our first response. We reply to every serious inquiry within two business days.",
    budgets: ["< $25k", "$25k–$50k", "$50k–$100k", "$100k+", "Not sure yet"],
    serviceOptions: [
      "Strategy",
      "Brand",
      "Web",
      "Product",
      "Engineering",
      "Motion",
    ],
    success: {
      title: "Message received.",
      body: "Thanks — we've got it. Expect a thoughtful reply within two business days.",
    },
  },

  meta: {
    home: {
      title: "Lumako — Web & Product Studio",
      description:
        "Lumako is a web & product design and build studio. We design and build the digital products people don't forget.",
    },
    work: {
      title: "Work",
      description:
        "Selected work from Lumako across fintech, hospitality, developer tools, energy, and commerce.",
    },
    services: {
      title: "Services",
      description:
        "Strategy, brand, web, product, engineering, and motion — held end to end by one team.",
    },
    studio: {
      title: "Studio",
      description:
        "Lumako is a small, craft-led studio that designs and builds digital products end to end.",
    },
    contact: {
      title: "Contact",
      description:
        "Start a project with Lumako. Tell us what you're building and we'll tell you how we'd approach it.",
    },
  },
} as const;
