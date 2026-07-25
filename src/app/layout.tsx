import type { Metadata } from "next";
import { Outfit, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { MeshBg } from "@/components/mesh-bg";
import { ScrollToTop } from "@/components/scroll-to-top";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = "https://tonnage.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "TONNAGE: living Passports for transport",
    template: "%s · TONNAGE",
  },
  description:
    "TONNAGE turns transport records into living Passports, links evidence to controls and shows engineers what changed since the last review.",
  applicationName: "TONNAGE",
  authors: [{ name: "TONNAGE" }],
  keywords: [
    "transport risk audit",
    "heavy vehicle insurance",
    "fleet compliance",
    "risk engineering",
  ],
  // og/twitter images and the favicon come from app/opengraph-image.tsx and
  // app/icon.svg via the file conventions — no need to declare them here.
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "TONNAGE",
    locale: "en_AU",
    title: "TONNAGE: living Passports for transport",
    description:
      "Turn existing transport records into structured, searchable and actionable risk evidence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TONNAGE: living Passports for transport",
    description:
      "Existing records become a living Passport that shows what changed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${outfit.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[3px] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-40 border-b-[3px] border-double border-rule-strong bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-4 px-6 py-4">
            <Logo size="md" />
            <nav aria-label="Primary" className="flex items-center gap-2">
              <Link
                href="/passport"
                className="hidden px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink sm:inline-flex"
              >
                Passport
              </Link>
              <Link
                href="/visual-evidence"
                className="hidden px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink md:inline-flex"
              >
                Analysis
              </Link>
              <Link
                href="/pricing"
                className="hidden px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink sm:inline-flex"
              >
                Pricing
              </Link>
              <Link href="/audit">
                <Button size="sm">Upload records</Button>
              </Link>
            </nav>
          </div>
        </header>
        <ScrollToTop />
        {children}
        <MeshBg />
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
