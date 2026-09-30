import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Kiteframe — fictional motion CI",
  description:
    "Fictional product · portfolio demo. A launch page for Kiteframe, an invented motion-budget profiler.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={syne.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
