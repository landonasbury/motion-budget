import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const title = "Kiteframe — fictional motion CI";
const description =
  "Fictional product · portfolio demo. A launch page for Kiteframe, an invented motion-budget profiler, with CI that fails layout animation and budget regressions.";

export const viewport: Viewport = {
  themeColor: "#12141a",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    siteName: "motion-budget",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Kiteframe, a fictional motion-budget profiler. Portfolio demo artwork.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={syne.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
