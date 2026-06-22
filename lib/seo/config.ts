import { copy } from "@/lib/content/copy";

/**
 * Canonical SEO constants. This is the Russian property, deployed at lumako.ru,
 * so every absolute URL is built from here.
 */
export const SITE_URL = "https://lumako.ru";
export const SITE_NAME = "Lumako";
/** og:locale value - matches the document <html lang="ru">. */
export const SITE_LOCALE = "ru_RU";
/** Single source of truth for the site-level description (mirrors the home meta copy). */
export const SITE_DESCRIPTION = copy.meta.home.description;

/** Alt text for the social-share card (kept here so it can be shared without importing next/og). */
export const OG_IMAGE_ALT =
  "Lumako - студия полного цикла: запускаем веб, ИИ и приложения";

/**
 * Search-engine ownership-verification tokens. Read at BUILD time - statically
 * prerendered metadata cannot read Cloudflare Worker runtime bindings, so these come
 * from NEXT_PUBLIC_* build env (the tokens are public - they ship in <head> - so the
 * prefix is harmless). When a token is absent its <meta> tag is omitted, so local dev
 * and CI build with no setup. Verification only unlocks Search Console / Yandex.
 * Webmaster, where the Russia "site region" is assigned (a manual step, not code).
 * See .env.example for the variable names.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
export const YANDEX_VERIFICATION = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
