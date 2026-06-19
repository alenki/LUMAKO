export const site = {
  name: "Lumako",
  tagline: "Web · AI · Apps - shipped & proven",
  email: "hello@lumako.net",
  locale: "Global",
  timezone: "Europe/Moscow",
  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "WhatsApp", href: "https://wa.me/" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
