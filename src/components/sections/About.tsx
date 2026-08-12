"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CrossfadeImage from "@/components/CrossfadeImage";
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
  status?: string | null;
  profile_images?: { src: string; position?: string; zoom?: number }[] | null;
  stats?: { label: string; value: string }[] | null;
};

export default function About({ personalInfo }: { personalInfo: PersonalInfo | null }) {
  const images = personalInfo?.profile_images?.length ? personalInfo.profile_images : [];
  const stats = personalInfo?.stats?.length ? personalInfo.stats : [];
  const [imgIdx, setImgIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance through profile photos every few seconds (pause while hovering)
  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setInterval(() => {
      setImgIdx((p) => (p + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length, paused]);

  // Keep the index in range if the photo list changes
  const safeIdx = images.length ? imgIdx % images.length : 0;
  const nextSrc =
    images.length > 1 ? images[(safeIdx + 1) % images.length].src : undefined;

  if (!personalInfo) return null;

  const bioParagraphs = (personalInfo.bio || "")
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="section-head">
          <p className="section-eyebrow">Profile</p>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know more about me and my journey</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-14">

          {/* ── Left: Image + Stats ── */}
          <div className="shrink-0 flex flex-col items-center gap-6">
            {/* Image — static, manual dots only */}
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              <div className="absolute inset-0 rounded-3xl border border-violet-500/25" aria-hidden="true" />

              <div
                className="absolute inset-0.5 rounded-3xl overflow-hidden bg-stone-900/50 flex items-center justify-center"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {images.length > 0 ? (
                  <CrossfadeImage
                    src={images[safeIdx].src}
                    nextSrc={nextSrc}
                    alt={`${personalInfo.name} photo ${safeIdx + 1}`}
                    objectPosition={images[safeIdx].position || "center"}
                    imageTransform={`scale(${images[safeIdx].zoom || 1})`}
                    sizes="288px"
                  />
                ) : (
                  <span className="text-stone-600 text-sm font-medium">No Image</span>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      aria-label={`Show photo ${i + 1}`}
                      aria-pressed={i === safeIdx}
                      className={`transition-[width,background-color] duration-300 rounded-full ${
                        i === safeIdx
                          ? "w-6 h-2 bg-violet-500"
                          : "w-2 h-2 bg-stone-600 hover:bg-stone-500"
                      }`}
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
                    <div className="text-xl font-bold text-white tabular-nums">{s.value}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Content ── */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-snug">
              Hello! I&apos;m {personalInfo.name}
            </h3>

            <div className="space-y-4 text-stone-400 leading-relaxed mb-8">
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
                  <div className="text-violet-400 p-2 bg-violet-500/10 rounded-lg shrink-0" aria-hidden="true"><MapPin size={20} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-stone-400 mb-0.5">Location</div>
                    <div className="text-sm font-semibold">{personalInfo.location}</div>
                  </div>
                </div>
              )}
              {personalInfo.email && (
                <div className="glass-card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="text-emerald-400 p-2 bg-emerald-500/10 rounded-lg shrink-0" aria-hidden="true"><Mail size={20} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-stone-400 mb-0.5">Email</div>
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
                <div className="text-amber-400 p-2 bg-amber-500/10 rounded-lg shrink-0" aria-hidden="true"><Briefcase size={20} /></div>
                <div className="min-w-0">
                  <div className="text-xs text-stone-400 mb-0.5">Status</div>
                  <div className={`text-sm font-semibold ${personalInfo.status?.toLowerCase().includes('open') ? 'text-green-400' : 'text-violet-400'}`}>
                    {personalInfo.status || "Open to work"}
                  </div>
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
