"use client";

import Image from "next/image";
import Link from "next/link";
// import { personalInfo } from "@/data/personal"; // Removed static import
// import { socialLinks } from "@/data/social";
import React from "react";

// Define Prop Type matching DB structure (loosely)
type PersonalInfo = {
  name: string;
  role: string; // mapped from DB 'role'
  bio: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  email?: string;
};

// We can still use valid socialLinks from data for icons, but override URLs if present in DB
// Or just use the DB ones directly if we want to dynamicize the icons too (but icons are static in UI helper).
// Let's merge them.

// Helper for social icons
const SocialIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
      </svg>
    ),
  };
  return icons[icon] || null;
};

export default function Hero({ personalInfo }: { personalInfo: PersonalInfo | null }) {
  if (!personalInfo) return null; // or loading state

  // Dynamic social links from DB
  const dynamicSocials = [
    { name: "github", url: personalInfo.github_url, icon: "github" },
    { name: "linkedin", url: personalInfo.linkedin_url, icon: "linkedin" },
    { name: "instagram", url: personalInfo.instagram_url, icon: "instagram" },
  ].filter(s => s.url); // filter out empty

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative pt-20"
    >
      {/* Background Elements */}
      <div className="bg-grid" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      {/* Floating Particles - using static positions to avoid impure function calls */}
      <div className="particles">
        {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pos, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${pos}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${15 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-zinc-400 text-lg mb-2 fade-in">
              Hi, I&apos;m
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 fade-in stagger-1">
              <span className="gradient-text">{personalInfo.name}</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-zinc-300 mb-6 fade-in stagger-2">
              {personalInfo.role}
            </h2>
            <p className="text-zinc-400 max-w-lg mb-8 fade-in stagger-3">
              {/* Fallback for tagline since it's missing in DB currently */}
              Building innovative and impactful digital solutions
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8 fade-in stagger-4">
              <Link href="#contact" className="btn-primary text-center">
                Contact Me
              </Link>
              <Link href="#projects" className="btn-secondary text-center">
                View Projects
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start fade-in stagger-5">
              {dynamicSocials.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500 transition-all duration-300"
                  aria-label={link.name}
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Profile Image */}
          <div className="shrink-0 fade-in">
            <div className="profile-glow w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
              <Image
                src="/images/profile/profile.jpeg"
                alt={personalInfo.name}
                width={320}
                height={320}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
