import type { Metadata } from "next";
import { Cormorant, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

// Every audit score, premium and odometer reading is set in this.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://tonnage.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Tonnage — risk audits that route themselves",
    template: "%s · Tonnage",
  },
  description:
    "Tonnage triages every transport risk audit and sends it to the cheapest tier that can safely clear it, so a handful of engineers can cover a portfolio that would otherwise need thirty.",
  applicationName: "Tonnage",
  authors: [{ name: "Tonnage" }],
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
    siteName: "Tonnage",
    locale: "en_AU",
    title: "Tonnage — risk audits that route themselves",
    description:
      "Most trucks roll straight over the weighbridge. Only some get pulled aside. We do that for risk audits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonnage — risk audits that route themselves",
    description:
      "Most trucks roll straight over the weighbridge. Only some get pulled aside.",
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
      className={`${cormorant.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
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
            <div className="flex items-center gap-2">
              <Link href="/audit">
                <Button size="sm">Start an audit</Button>
              </Link>
            </div>
          </div>
        </header>
        {children}
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
