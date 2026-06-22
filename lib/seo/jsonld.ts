import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./config";
import { site } from "@/lib/content/site";
import { work } from "@/lib/content/work";
import { copy } from "@/lib/content/copy";

/**
 * Structured-data (schema.org JSON-LD) builders.
 *
 * The site-wide graph (Organization + WebSite) is emitted once in the root layout;
 * per-page graphs only reference those nodes by `@id`, so consumers merge them into
 * one entity model without duplication. Every absolute URL is built from SITE_URL.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

type Json = Record<string, unknown>;
const CONTEXT = "https://schema.org";

function organization(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    email: site.email,
    description: SITE_DESCRIPTION,
    slogan: site.tagline,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: `${SITE_URL}/icon.png`,
      contentUrl: `${SITE_URL}/icon.png`,
    },
    image: { "@id": LOGO_ID },
    areaServed: "Россия",
    // Country-level address (no street/city - the target is Russia-wide): a
    // machine-readable ISO country signal that corroborates the Yandex.Webmaster
    // region assignment, which moderators cross-check against on-site structured data.
    address: { "@type": "PostalAddress", addressCountry: "RU" },
    knowsAbout: [
      "Разработка сайтов",
      "ИИ-ассистенты и автоматизация",
      "Разработка приложений",
      "Бренд и айдентика",
      "Позиционирование и доказательства",
      "Моушн и кинематографичный ИИ",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "customer support",
      availableLanguage: ["Russian"],
    },
    // sameAs is intentionally omitted: the social links in content are placeholders
    // (generic homepages), not verified Lumako profiles. Add them here once real.
  };
}

function website(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "ru",
    publisher: { "@id": ORG_ID },
  };
}

/** Site-wide identity graph - rendered once in the root layout. */
export function siteGraph(): Json {
  return { "@context": CONTEXT, "@graph": [organization(), website()] };
}

function breadcrumb(path: string, name: string): Json {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

function webPage(opts: {
  path: string;
  type: string;
  name: string;
  description: string;
  hasBreadcrumb?: boolean;
  mainEntity?: Json;
}): Json {
  // Home uses the slash-less form to match its canonical / og:url exactly.
  const url = opts.path === "/" ? SITE_URL : `${SITE_URL}${opts.path}`;
  return {
    "@type": opts.type,
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "ru",
    ...(opts.hasBreadcrumb
      ? { breadcrumb: { "@id": `${SITE_URL}${opts.path}#breadcrumb` } }
      : {}),
    ...(opts.mainEntity ? { mainEntity: opts.mainEntity } : {}),
  };
}

export function homeGraph(): Json {
  return {
    "@context": CONTEXT,
    "@graph": [
      webPage({
        path: "/",
        type: "WebPage",
        name: `${SITE_NAME} - Веб · ИИ · Приложения`,
        description: SITE_DESCRIPTION,
        mainEntity: { "@id": ORG_ID },
      }),
    ],
  };
}

export function aboutGraph(): Json {
  return {
    "@context": CONTEXT,
    "@graph": [
      webPage({
        path: "/about",
        type: "AboutPage",
        name: `О студии | ${SITE_NAME}`,
        description: copy.meta.about.description,
        hasBreadcrumb: true,
        mainEntity: { "@id": ORG_ID },
      }),
      breadcrumb("/about", "О студии"),
    ],
  };
}

export function contactGraph(): Json {
  return {
    "@context": CONTEXT,
    "@graph": [
      webPage({
        path: "/contact",
        type: "ContactPage",
        name: `Контакты | ${SITE_NAME}`,
        description: copy.meta.contact.description,
        hasBreadcrumb: true,
        mainEntity: { "@id": ORG_ID },
      }),
      breadcrumb("/contact", "Контакты"),
    ],
  };
}

export function workGraph(): Json {
  const itemList: Json = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/work#worklist`,
    name: "Избранные работы Lumako",
    numberOfItems: work.length,
    itemListElement: work.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        // The works are shipped, live websites - WebSite (a CreativeWork subtype)
        // models them more precisely than the generic CreativeWork.
        "@type": "WebSite",
        name: c.title,
        url: c.href,
        image: `${SITE_URL}${c.cover}`,
        about: { "@type": "Thing", name: c.client },
        dateCreated: c.year,
        keywords: c.disciplines.join(", "),
        creator: { "@id": ORG_ID },
      },
    })),
  };

  return {
    "@context": CONTEXT,
    "@graph": [
      webPage({
        path: "/work",
        type: "CollectionPage",
        name: `Работы | ${SITE_NAME}`,
        description: copy.meta.work.description,
        hasBreadcrumb: true,
        mainEntity: { "@id": `${SITE_URL}/work#worklist` },
      }),
      breadcrumb("/work", "Работы"),
      itemList,
    ],
  };
}
