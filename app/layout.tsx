import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition, RouteCurtain } from "@/components/layout/PageTransition";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumako.com"),
  title: {
    default: "Lumako | Web · AI · Apps",
    template: "%s | Lumako",
  },
  description:
    "Lumako is a full-stack studio that ships web, AI, and app products - and shows the working build before the pitch.",
  keywords: [
    "web development",
    "AI products",
    "app development",
    "product studio",
    "Lumako",
  ],
  openGraph: {
    type: "website",
    siteName: "Lumako",
    title: "Lumako - Web · AI · Apps",
    description:
      "Lumako is a full-stack studio that ships web, AI, and app products - and shows the working build before the pitch.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh">
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
