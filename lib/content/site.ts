export const site = {
  name: "Lumako",
  tagline: "Web · AI · Apps — shipped, not proposed",
  email: "hello@lumako.com",
  locale: "Nalchik, KBR → Global",
  timezone: "Europe/Moscow",
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X", href: "https://x.com" },
    { label: "WhatsApp", href: "https://wa.me/" },
    { label: "Telegram", href: "https://t.me/" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
