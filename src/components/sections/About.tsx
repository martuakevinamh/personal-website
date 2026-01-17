"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { personalInfo } from "@/data/personal";

// Daftar gambar untuk slideshow - tambahkan path gambar Anda di sini
const profileImages = [
  "/images/profile.jpeg",
  "/images/profile-2.jpeg",
  "/images/profile-3.jpeg",
];

export default function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="section-title">
          <span className="gradient-text">About Me</span>
        </h2>
        <p className="section-subtitle">
          Get to know more about me and my journey
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Slideshow */}
          <div className="shrink-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-2xl rotate-6 opacity-20" />
              <div className="relative glass-card w-full h-full rounded-2xl overflow-hidden">
                {/* Images with fade transition */}
                {profileImages.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${personalInfo.name} - ${index + 1}`}
                    width={320}
                    height={320}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {profileImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-violet-500 w-6"
                        : "bg-zinc-600 hover:bg-zinc-500"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">
              Hello! I&apos;m{" "}
              <span className="gradient-text">{personalInfo.name}</span>
            </h3>

            <div className="space-y-4 text-zinc-400 leading-relaxed">
              {personalInfo.bio.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="glass-card p-4">
                <div className="text-violet-500 mb-2">📍</div>
                <div className="text-sm text-zinc-400">Location</div>
                <div className="font-medium">{personalInfo.location}</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-violet-500 mb-2">✉️</div>
                <div className="text-sm text-zinc-400">Email</div>
                <div className="font-medium text-sm truncate">
                  {personalInfo.email}
                </div>
              </div>
            </div>

            {/* Download CV Button */}
            {personalInfo.resumeUrl && personalInfo.resumeUrl !== "#" && (
              <div className="mt-8">
                <Link
                  href={personalInfo.resumeUrl}
                  className="btn-primary inline-flex items-center gap-2"
                  target="_blank"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download CV
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
