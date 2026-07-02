import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/providers/ToasterProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Martua Kevin | Informatics Engineering Graduate & Web Developer",
  description: "Portfolio of Martua Kevin, a passionate Informatics Engineering Graduate and Web Developer building innovative digital solutions.",
  keywords: ["Martua Kevin", "portfolio", "web developer", "software engineer", "indonesia"],
  authors: [{ name: "Martua Kevin" }],
  openGraph: {
    title: "Martua Kevin | Portfolio",
    description: "Portfolio of Martua Kevin, a passionate Informatics Engineering Graduate and Web Developer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
