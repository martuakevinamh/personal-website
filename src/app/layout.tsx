import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Personal Website",
  description: "Welcome to my portfolio. I am a Full Stack Developer passionate about creating modern and innovative web applications.",
  keywords: ["portfolio", "web developer", "full stack", "next.js", "react"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Portfolio | Personal Website",
    description: "Welcome to my portfolio. I am a Full Stack Developer passionate about creating modern and innovative web applications.",
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
      </body>
    </html>
  );
}
