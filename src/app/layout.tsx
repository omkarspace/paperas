import type { Metadata } from "next";
import { Inter, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageTransition } from "@/components/shared/page-transition";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s | Paperas",
    default: "Paperas - Peer-Reviewed Academic Journal",
  },
  description:
    "Paperas is an open access academic publishing platform for peer-reviewed journals, research papers, and scholarly articles by Research Verse Journal and Publication House of India.",
  keywords: [
    "academic publishing",
    "peer-reviewed journal",
    "open access",
    "research papers",
    "scholarly articles",
    "scientific journal",
    "academic publishing platform",
    "Research Verse Journal",
    "publication house of India",
    "online journal",
    "research publication",
    "academic research",
  ],
  authors: [{ name: "Research Verse Journal" }],
  creator: "Research Verse Journal And Publication House Of India",
  publisher: "Research Verse Journal And Publication House Of India",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Paperas",
    title: "Paperas - Peer-Reviewed Academic Journal",
    description:
      "An open access academic publishing platform for peer-reviewed journals, research papers, and scholarly articles.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Paperas - Peer-Reviewed Academic Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paperas - Peer-Reviewed Academic Journal",
    description:
      "An open access academic publishing platform for peer-reviewed journals, research papers, and scholarly articles.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: "",
    other: {
      bing: "",
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Paperas",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
          <header>
            <Navbar />
          </header>
          <main id="main-content" className="flex-1 pt-24">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          </SessionProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
