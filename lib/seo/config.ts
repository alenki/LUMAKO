import { copy } from "@/lib/content/copy";

/**
 * Canonical SEO constants. The deployed global/AR face is lumako.net (the RU face
 * lumako.ru is a separate property), so every absolute URL is built from here.
 */
export const SITE_URL = "https://lumako.net";
export const SITE_NAME = "Lumako";
/** og:locale value - matches the document <html lang="en">. */
export const SITE_LOCALE = "en_US";
/** Single source of truth for the site-level description (mirrors the home meta copy). */
export const SITE_DESCRIPTION = copy.meta.home.description;

/** Alt text for the social-share card (kept here so it can be shared without importing next/og). */
export const OG_IMAGE_ALT =
  "Lumako - a full-stack studio shipping web, AI, and app products";
