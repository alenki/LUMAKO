import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition, RouteCurtain } from "@/components/layout/PageTransition";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumako.studio"),
  title: {
    default: "Lumako — Web & Product Studio",
    template: "%s — Lumako",
  },
  description:
    "Lumako is a web & product design and build studio. We design and build the digital products people don't forget.",
  keywords: [
    "web design studio",
    "product design",
    "web development",
    "digital agency",
    "creative studio",
    "Lumako",
  ],
  openGraph: {
    type: "website",
    siteName: "Lumako",
    title: "Lumako — Web & Product Studio",
    description:
      "We design and build the digital products people don't forget.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-bg"
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
