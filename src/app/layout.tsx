import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { Toaster } from "@/components/ui/sonner";
import { SkipLink } from "@/components/skip-link";
import { getPersonJsonLd } from "@/lib/person-json-ld";
import { PROFILE_DATA, SITE_URL } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/resume-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Senior Full-Stack Developer and Azure AI Engineer (AI-102) with 12+ years of experience. Next.js, React, TypeScript, FastAPI, Python 3.12+, Azure AI, Generative AI, RAG, LangGraph, Temporal, MCP and cloud-native architecture.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Qasir Mehmood — Senior Full-Stack Developer & Azure AI Engineer",
    template: "%s | Qasir Mehmood",
  },
  description,
  keywords: SEO_KEYWORDS.split(",").map((k) => k.trim()),
  authors: [{ name: PROFILE_DATA.name, url: SITE_URL }],
  creator: PROFILE_DATA.name,
  alternates: {
    canonical: SITE_URL,
    types: {
      "text/plain": `${SITE_URL}/resume.txt`,
    },
  },
  openGraph: {
    title: "Qasir Mehmood — Senior Full-Stack Developer & Azure AI Engineer",
    description,
    url: SITE_URL,
    siteName: PROFILE_DATA.name,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Qasir Mehmood — Senior Full-Stack Developer & Azure AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qasir Mehmood — Senior Full-Stack Developer & Azure AI Engineer",
    description,
    images: ["/opengraph-image"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = getPersonJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Toaster />
      </body>
    </html>
  );
}
