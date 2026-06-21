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
import { SITE_URL } from "@/lib/seo/config";

// Site-wide type: Inter (standard-width grotesk). Loaded as a variable font so the
// full weight range (light -> extrabold) is available across the site.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lumako | Web · AI · Apps",
    template: "%s | Lumako",
  },
  description:
    "Lumako is a full-stack studio that ships web, AI, and app products - judged on a track record of shipped work, not promises.",
  applicationName: "Lumako",
  category: "technology",
  authors: [{ name: "Lumako", url: SITE_URL }],
  creator: "Lumako",
  publisher: "Lumako",
  keywords: [
    "web development",
    "AI products",
    "app development",
    "product studio",
    "Lumako",
  ],
  // Default OG/Twitter for any route that doesn't set its own (every page does, via
  // socialMeta) - kept as a complete fallback because Next replaces, not merges, OG.
  openGraph: {
    type: "website",
    siteName: "Lumako",
    locale: "en_US",
    url: "/",
    title: "Lumako - Web · AI · Apps",
    description:
      "Lumako is a full-stack studio that ships web, AI, and app products - judged on a track record of shipped work, not promises.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumako - Web · AI · Apps",
    description:
      "Lumako is a full-stack studio that ships web, AI, and app products - judged on a track record of shipped work, not promises.",
  },
  // robots is set per page in socialMeta() - not here - so the built-in not-found
  // page keeps Next's noindex rather than inheriting index,follow from the layout.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh">
        <JsonLd data={siteGraph()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[#fafafa]"
        >
          Skip to content
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
