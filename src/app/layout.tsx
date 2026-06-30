import type { Metadata } from "next";
import { Source_Sans_3, Libre_Baskerville, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paperas — Peer-Reviewed Academic Journal",
  description: "A peer-reviewed journal committed to open access, rigorous review, and scholarly excellence. Advancing research in India and beyond.",
  keywords: ["academic journal", "peer review", "research", "open access", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${libreBaskerville.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-background font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}