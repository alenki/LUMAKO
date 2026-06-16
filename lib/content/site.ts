export const site = {
  name: "Lumako",
  tagline: "Web & Product Studio",
  email: "hello@lumako.studio",
  locale: "San Francisco / Remote",
  timezone: "America/Los_Angeles",
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
