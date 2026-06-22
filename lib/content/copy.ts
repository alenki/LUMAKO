/** Centralized page copy. Headings store optional `highlight` substrings for accent treatment. */
export const copy = {
  home: {
    hero: {
      lines: ["Большинство", "пролистывают.", "Вашу - нет."],
      mark: "нет",
      sub: "Lumako - студия полного цикла: веб, ИИ и приложения, которые запускаем и поддерживаем. Их запоминают, а не пролистывают.",
      ctaPrimary: { label: "Начать проект", href: "/contact" },
      ctaSecondary: { label: "Смотреть работы", href: "/work" },
    },
    work: {
      headline: "Работы, которые мы запустили.",
      link: { label: "Смотреть все работы", href: "/work" },
    },
    studio: {
      // One flowing statement, broken by the mark into a lead + a wide "what we make"
      // line. Both strings carry explicit breaks (the lead after the wordmark, the craft
      // into three length-balanced lines) so each box shrink-wraps to its widest line -
      // which is what lets the section centre cleanly. TextReveal still exposes each
      // joined sentence to a11y. The dot hugs the Latin "Lumako" token.
      lead: "Lumako это студия\nполного цикла",
      craft: "Проектируем, создаём,\nзапускаем веб, ИИ\nи приложения для бизнеса",
    },
  },

  work: {
    eyebrow: "Работы",
    headline: "Избранные работы",
    highlight: "работы",
    sub: "Подборка живых сайтов для реального бизнеса - кофе, рестораны, авто и не только. Каждый запущен и работает - откройте любой и посмотрите в деле.",
  },

  about: {
    // The studio statement - team voice, leads with the work that proves it.
    // Hard breaks (\n) are baked in so the lines set at deliberately uneven
    // lengths (ragged, never boxy); the lume dot hugs the Latin "Lumako" token.
    statement:
      "Lumako - студия полного цикла,\nсоздаём веб, ИИ и приложения.\nПревращаем точные идеи в продукты,\nкоторые запускаются и живут, -\nа потом доказываем делом,\nне обещаниями.",
    // Same statement, re-broken for phone widths so each line still rises from its
    // own clip mask (the >=768 "lines" reveal) instead of one block. The desktop
    // breaks overflow the narrow <768 column (no 12vw indent there), so these are
    // shorter (<=~22 chars) - more lines, but each holds as a single row down to
    // ~375px and staggers up exactly like desktop.
    statementMobile:
      "Lumako - студия\nполного цикла. Создаём\nвеб, ИИ и приложения.\nПревращаем точные\nидеи в продукты,\nкоторые запускаются\nи живут, - а потом\nдоказываем делом,\nне обещаниями.",
    servicesEyebrow: "Наши услуги",
    services: [
      "Веб",
      "ИИ",
      "Приложения",
      "Бренд и айдентика",
      "Позиционирование и доказательства",
      "Моушн и кинематографичный ИИ",
    ],
    careersEyebrow: "Вакансии",
    careers: "Мы всегда рады тем, кто умеет создавать.",
    getInTouch: {
      heading: "Свяжитесь с нами",
      emailLabel: "Напишите нам",
      projectLabel: "Есть проект?",
      projectCta: "Оставить заявку",
    },
  },

  contact: {
    headline: "Давайте начнём разговор.",
    budgets: [
      "до 300 000 ₽",
      "300-700 тыс. ₽",
      "700 тыс.-1,5 млн ₽",
      "от 1,5 млн ₽",
      "Пока не знаю",
    ],
    serviceOptions: ["Веб", "ИИ", "Приложения"],
    success: {
      title: "Принято.",
      body: "Сообщение получено. Ответим по делу и конкретно - без шаблонных презентаций.",
    },
  },

  meta: {
    home: {
      title: "Lumako - Веб · ИИ · Приложения",
      description:
        "Lumako - студия полного цикла: запускаем веб, ИИ и приложения. Судите по запущенным проектам, а не по обещаниям.",
    },
    work: {
      title: "Работы",
      description:
        "Живые сайты, созданные Lumako для реального бизнеса - кофе, рестораны, авто и не только. Каждый запущен и работает.",
    },
    about: {
      title: "О студии",
      description:
        "Lumako - студия полного цикла: создаём веб, ИИ и приложения для реального бизнеса. Судите по запущенным проектам, а не по обещаниям.",
    },
    contact: {
      title: "Контакты",
      description:
        "Начните проект с Lumako. Расскажите, что вы создаёте, - и получите конкретное рабочее направление в ответ.",
    },
  },
} as const;
