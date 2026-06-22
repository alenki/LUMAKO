export const site = {
  name: "Lumako",
  tagline: "Веб · ИИ · Приложения - запускаем и поддерживаем",
  email: "hello@lumako.net",
  locale: "Россия",
  timezone: "Europe/Moscow",
  nav: [
    { label: "Главная", href: "/" },
    { label: "О студии", href: "/about" },
    { label: "Работы", href: "/work" },
    { label: "Контакты", href: "/contact" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "WhatsApp", href: "https://wa.me/" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
