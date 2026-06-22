import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition, RouteCurtain } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/seo/jsonld";
import {
  SITE_URL,
  GOOGLE_SITE_VERIFICATION,
  YANDEX_VERIFICATION,
} from "@/lib/seo/config";

// Site-wide type: Inter (standard-width grotesk). Loaded as a variable font so the
// full weight range (light -> extrabold) is available across the site.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

// Ownership-verification meta, emitted site-wide only for whichever tokens are present
// in the build env: google -> <meta name="google-site-verification">, yandex -> <meta
// name="yandex-verification">. Kept here (not in socialMeta) because verification isn't
// subject to OG's replace-not-merge rule and only needs to appear once, on the homepage.
const verification: Metadata["verification"] = {
  ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
  ...(YANDEX_VERIFICATION ? { yandex: YANDEX_VERIFICATION } : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Omit the key entirely when no tokens are set, so no empty <meta> is emitted.
  ...(Object.keys(verification).length ? { verification } : {}),
  title: {
    default: "Lumako | Веб · ИИ · Приложения",
    template: "%s | Lumako",
  },
  description:
    "Lumako - студия полного цикла: запускаем веб, ИИ и приложения. Судите по запущенным проектам, а не по обещаниям.",
  applicationName: "Lumako",
  category: "technology",
  authors: [{ name: "Lumako", url: SITE_URL }],
  creator: "Lumako",
  publisher: "Lumako",
  keywords: [
    "разработка сайтов",
    "ИИ-продукты",
    "разработка приложений",
    "продуктовая студия",
    "Lumako",
  ],
  // Default OG/Twitter for any route that doesn't set its own (every page does, via
  // socialMeta) - kept as a complete fallback because Next replaces, not merges, OG.
  openGraph: {
    type: "website",
    siteName: "Lumako",
    locale: "ru_RU",
    url: "/",
    title: "Lumako - Веб · ИИ · Приложения",
    description:
      "Lumako - студия полного цикла: запускаем веб, ИИ и приложения. Судите по запущенным проектам, а не по обещаниям.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumako - Веб · ИИ · Приложения",
    description:
      "Lumako - студия полного цикла: запускаем веб, ИИ и приложения. Судите по запущенным проектам, а не по обещаниям.",
  },
  // robots is set per page in socialMeta() - not here - so the built-in not-found
  // page keeps Next's noindex rather than inheriting index,follow from the layout.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh">
        <JsonLd data={siteGraph()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[#fafafa]"
        >
          Перейти к содержимому
        </a>
        <Providers>
          <SmoothScroll>
            <Cursor />
            <RouteCurtain />
            <Nav />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
