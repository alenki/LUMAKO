import type { Metadata } from "next";
import { SITE_NAME, SITE_LOCALE, OG_IMAGE_ALT } from "./config";

/** Indexing directives - applied per page (not in the root layout) so the built-in
 *  404/not-found page keeps Next's noindex instead of inheriting index,follow. */
const ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

/**
 * Full per-page invisible metadata block: self-referencing canonical, complete
 * Open Graph / Twitter cards, and robots directives.
 *
 * Next merges metadata shallowly: any segment that sets `openGraph` REPLACES the
 * parent's entirely, so every page must carry the full OG block - including the
 * social image. The image is only added for non-home routes: the home route already
 * gets it from the root-segment `opengraph-image`/`twitter-image` file convention,
 * and adding it again here would emit a duplicate `og:image`. Child routes have no
 * such file, so they must declare it explicitly or their shares lose the preview.
 *
 * This helper never sets `title`/`description` at the top level, so each page keeps
 * its own (visible) <title> untouched; the strings passed here only feed the
 * invisible OG/Twitter tags and the self-referencing canonical.
 *
 * `path` is a leading-slash route ("/" for home); it resolves against `metadataBase`.
 */
export function socialMeta(opts: {
  ogTitle: string;
  description: string;
  path: string;
}): Metadata {
  const { ogTitle, description, path } = opts;
  const isHome = path === "/";

  return {
    alternates: {
      canonical: path,
      // Self-referencing hreflang for the standalone RU property: declares "Russian
      // content for the RU region" without coupling to the separate lumako.net build.
      // Both keys resolve against metadataBase -> absolute lumako.ru hrefs. Yandex
      // requires hreflang in <head> (it dropped sitemap-hreflang support); Google reads
      // either - the sitemap (app/sitemap.ts) declares the same pair for consistency.
      languages: { "ru-RU": path, "x-default": path },
    },
    robots: ROBOTS,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: path,
      title: ogTitle,
      description,
      ...(isHome
        ? {}
        : {
            images: [
              {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: OG_IMAGE_ALT,
                type: "image/png",
              },
            ],
          }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(isHome ? {} : { images: ["/twitter-image"] }),
    },
  };
}
