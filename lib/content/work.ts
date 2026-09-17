import type { CaseStudy, Discipline } from "./types";

export const work: CaseStudy[] = [
  {
    slug: "harmony-coffee",
    title: "Harmony Coffee",
    client: "Спешелти-кофе и обжарка",
    sector: "Концепт-сайт",
    year: "2025",
    disciplines: ["Веб", "Концепт"],
    accent: "#a1957e",
    cover: "/work/harmony-coffee.webp",
    coverPosition: "center",
    href: "https://lumako.ru/harmonycoffee",
    featured: true,
    summary:
      "Тёплый редакционный сайт для спешелти-кофейни и обжарщика - меню, дейли и вакансии, с двуязычным переключателем RU/EN.",
  },
  {
    slug: "master-auto",
    title: "Master Auto",
    client: "Тюнинг и детейлинг авто",
    sector: "Маркетинговый сайт",
    year: "2025",
    disciplines: ["Веб", "Бренд"],
    accent: "#e8261f",
    cover: "/work/master-auto.webp",
    coverPosition: "top",
    href: "https://lumako.ru/masterauto",
    featured: true,
    summary:
      "Смелый одностраничный сайт для студии тюнинга и детейлинга - оклейка, тонировка, PPF, керамика и тюнинг, в один тап от контакта.",
  },
  {
    slug: "melty",
    title: "Melty",
    client: "Десерт-кафе и кофейня",
    sector: "Маркетинговый сайт",
    year: "2025",
    disciplines: ["Веб", "Бренд"],
    accent: "#4a3026",
    cover: "/work/melty.webp",
    coverPosition: "center",
    href: "https://melty-cafe.ru/",
    featured: true,
    summary:
      "Элегантный сайт для десерт-кафе в Нальчике - создан, чтобы показать шоколадное меню и довести гостя до двери.",
  },
  {
    slug: "esoes",
    title: "ESOES & ÉLI",
    client: "Музыкальный дуэт",
    sector: "Промо-сайт релиза",
    year: "2026",
    disciplines: ["Веб", "Моушн"],
    accent: "#d9a13f",
    cover: "/work/esoes.webp",
    coverPosition: "center",
    href: "https://esoesmusic.ru/",
    featured: true,
    summary:
      "Промо-страница сингла «Гаснет Свет» - интерактивная пластинка, которая крутится, скретчится и играет прямо в браузере, как первое издание на виниле.",
  },
  {
    slug: "okaraf",
    title: "Omar Karaf",
    client: "Личное портфолио",
    sector: "Сайт-портфолио",
    year: "2025",
    disciplines: ["Веб", "Портфолио"],
    accent: "#1a1a1a",
    cover: "/work/okaraf.webp",
    coverPosition: "top",
    href: "https://lumako.ru/okaraf",
    featured: false,
    summary:
      "Монохромное портфолио разработчика - текучий мраморный hero и кейсы проектов, создано, чтобы привлекать клиентов, которым важен дизайн.",
  },
];

/**
 * Disciplines actually represented in the work, in canonical order - this drives
 * the filter row, so it never shows a chip that would resolve to an empty grid.
 */
const DISCIPLINE_ORDER: Discipline[] = [
  "Веб",
  "ИИ",
  "Приложения",
  "Бренд",
  "Стратегия",
  "Моушн",
  "Концепт",
  "Портфолио",
];
export const disciplines = DISCIPLINE_ORDER.filter((d) =>
  work.some((w) => w.disciplines.includes(d)),
);

export const featuredWork = work.filter((c) => c.featured);
