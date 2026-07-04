import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/providers/ToasterProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BASE_URL = "https://martuakevin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Martua Kevin — Web Developer & Engineer",
    template: "%s | Martua Kevin",
  },
  description:
    "Portfolio of Martua Kevin, an Informatics Engineering Graduate from ITERA, Indonesia. Specializing in web development with Next.js, Python & Deep Learning.",
  keywords: [
    "Martua Kevin",
    "portfolio",
    "web developer",
    "software engineer",
    "informatics",
    "Next.js",
    "Python",
    "Deep Learning",
    "YOLO",
    "Supabase",
    "Indonesia",
    "ITERA",
  ],
  authors: [{ name: "Martua Kevin", url: BASE_URL }],
  creator: "Martua Kevin",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Martua Kevin Portfolio",
    title: "Martua Kevin — Web Developer & Engineer",
    description:
      "Informatics Engineering Graduate from ITERA, Indonesia. Building web apps with Next.js, Python & Deep Learning.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Martua Kevin Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Martua Kevin — Web Developer & Engineer",
    description:
      "Informatics Engineering Graduate from ITERA. Building with Next.js, Python & Deep Learning.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

/** JSON-LD Structured Data — helps Google understand who you are */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Martua Kevin Andreas Mual H. Lubis",
  alternateName: "Martua Kevin",
  url: BASE_URL,
  jobTitle: "Informatics Engineering Graduate & Web Developer",
  description:
    "Informatics Engineering Graduate from ITERA with expertise in Web Development, Python, and Deep Learning.",
  sameAs: [
    "https://github.com/kevinlubis",
    "https://linkedin.com/in/martuakevin",
    "https://instagram.com/martuakevin",
  ],
  knowsAbout: ["Web Development", "Next.js", "Python", "Deep Learning", "YOLO", "Supabase"],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Institut Teknologi Sumatera",
    alternateName: "ITERA",
    url: "https://itera.ac.id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <ToasterProvider />
        <Analytics />
      </body>
    </html>
  );
}
