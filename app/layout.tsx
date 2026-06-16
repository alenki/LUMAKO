import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";

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
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
