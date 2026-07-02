"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Briefcase } from "lucide-react";

type PersonalInfo = {
  name: string;
  role: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  resume_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  profile_images?: { src: string; position?: string; zoom?: number }[] | null;
  stats?: { label: string; value: string }[] | null;
};

export default function About({ personalInfo }: { personalInfo: PersonalInfo | null }) {
  const images = personalInfo?.profile_images?.length ? personalInfo.profile_images : [];
  const stats = personalInfo?.stats?.length ? personalInfo.stats : [];
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      const t = setInterval(() => setImgIdx((p) => (p + 1) % images.length), 3500);
      return () => clearInterval(t);
    }
  }, [images.length]);

  if (!personalInfo) return null;

  const bioParagraphs = (personalInfo.bio || "")
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-28 relative">
      {/* subtle section bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(99,102,241,0.04),transparent)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="section-title">
          <span className="gradient-text">About Me</span>
        </h2>
        <p className="section-subtitle">Get to know more about me and my journey</p>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-14">

          {/* ── Left: Image + Stats ── */}
          <div className="shrink-0 flex flex-col items-center gap-6">
            {/* Image Slideshow */}
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              {/* Rotating border */}
              <div
                className="absolute inset-0 rounded-3xl opacity-60"
                style={{ background: "var(--gradient-primary)", padding: "2px" }}
              >
                <div className="w-full h-full rounded-3xl bg-(--bg-primary)" />
              </div>

              <div className="absolute inset-0.5 rounded-3xl overflow-hidden bg-zinc-900/50 flex items-center justify-center">
                {images.length > 0 ? images.map((img, i) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt={`${personalInfo.name} ${i + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-700 ${
                      i === imgIdx ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      objectPosition: img.position || "center",
                      transform: `scale(${img.zoom || 1})`
                    }}
                    sizes="288px"
                  />
                )) : (
                  <span className="text-zinc-600 text-sm font-medium">No Image</span>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === imgIdx
                          ? "w-6 h-2 bg-violet-500"
                          : "w-2 h-2 bg-zinc-600 hover:bg-zinc-500"
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="glass-card text-center px-4 py-3 min-w-18 flex-1"
                  >
                    <div className="text-xl font-bold gradient-text">{s.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Content ── */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-snug">
              Hello! I&apos;m{" "}
              <span className="gradient-text">{personalInfo.name}</span>
            </h3>

            <div className="space-y-4 text-zinc-400 leading-relaxed mb-8">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>
                  I&apos;m a passionate developer who loves building elegant solutions
                  to complex problems. When I&apos;m not coding, I enjoy exploring
                  new technologies and contributing to open-source projects.
                </p>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {personalInfo.location && (
                <div className="glass-card p-4 flex items-center gap-3">
                  <div className="text-violet-400 p-2 bg-violet-500/10 rounded-lg"><MapPin size={20} /></div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Location</div>
                    <div className="text-sm font-semibold">{personalInfo.location}</div>
                  </div>
                </div>
              )}
              {personalInfo.email && (
                <div className="glass-card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="text-emerald-400 p-2 bg-emerald-500/10 rounded-lg"><Mail size={20} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-zinc-500 mb-0.5">Email</div>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-sm font-semibold truncate block hover:text-violet-400 transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
              )}
              <div className="glass-card p-4 flex items-center gap-3">
                <div className="text-amber-400 p-2 bg-amber-500/10 rounded-lg"><Briefcase size={20} /></div>
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">Status</div>
                  <div className="text-sm font-semibold text-green-400">Open to work</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href="#contact" className="btn-primary">
                Get In Touch
              </Link>
              {personalInfo.resume_url && personalInfo.resume_url !== "#" && (
                <Link
                  href={personalInfo.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
