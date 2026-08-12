import Image from "next/image";
import Link from "next/link";
import { Hand, MapPin, Briefcase, Mail } from "lucide-react";

type PersonalInfo = {
  name: string;
  role: string | null;
  bio: string | null;
  location: string | null;
  status?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  resume_url?: string | null;
  email?: string | null;
  profile_images?: { src: string; position?: string; zoom?: number }[] | null;
};

// Social icon SVGs
function GithubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732a1.751 1.751 0 110-3.502 1.751 1.751 0 010 3.502zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export default function Hero({ personalInfo }: { personalInfo: PersonalInfo | null }) {
  if (!personalInfo) return null;

  const socials = [
    { key: "github", url: personalInfo.github_url, icon: <GithubIcon />, label: "GitHub" },
    { key: "linkedin", url: personalInfo.linkedin_url, icon: <LinkedinIcon />, label: "LinkedIn" },
    { key: "instagram", url: personalInfo.instagram_url, icon: <InstagramIcon />, label: "Instagram" },
  ].filter((s) => s.url);

  const primaryRole = personalInfo.role
    ? personalInfo.role.split("|").map((r) => r.trim()).filter(Boolean)[0]
    : "Software Engineer";

  const status = personalInfo.status || "Open to work";

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      {/* Background — one quiet radial, flat otherwise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_72%_32%,rgba(201,162,39,0.08),transparent)]"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-14 md:gap-20">

          {/* ── Text Content ── */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-stone-400 text-base mb-3 fade-in tracking-widest uppercase font-semibold flex items-center justify-center md:justify-start gap-2">
              <Hand size={18} className="text-amber-400" aria-hidden="true" /> Hello, I&apos;m
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 fade-in stagger-1 leading-tight tracking-tight">
              {personalInfo.name}
            </h1>

            <p className="text-xl md:text-2xl text-stone-300 mb-6 fade-in stagger-2 font-medium">
              {primaryRole}
            </p>

            <p className="text-stone-400 max-w-lg mb-10 fade-in stagger-3 leading-relaxed text-base">
              {personalInfo.bio
                ? personalInfo.bio.split("\n\n")[0].slice(0, 160) + (personalInfo.bio.length > 160 ? "…" : "")
                : "Building innovative and impactful digital solutions with passion and precision."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8 fade-in stagger-4">
              <Link href="#contact" className="btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Me
              </Link>
              <Link href="#projects" className="btn-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-7 7m7-7l-7-7" />
                </svg>
                View Projects
              </Link>
              {personalInfo.resume_url && personalInfo.resume_url !== "#" && (
                <Link href={personalInfo.resume_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume
                </Link>
              )}
            </div>

            {/* Status strip — real data, hairline-divided */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-stone-400 mb-8 fade-in stagger-5">
              {personalInfo.location && (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-violet-400" aria-hidden="true" /> {personalInfo.location}
                  </span>
                  <span className="w-px h-4 bg-white/10" aria-hidden="true" />
                </>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} className="text-violet-400" aria-hidden="true" /> {status}
              </span>
              {personalInfo.email && (
                <>
                  <span className="w-px h-4 bg-white/10" aria-hidden="true" />
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="inline-flex items-center gap-1.5 min-w-0 break-all hover:text-white transition-colors"
                  >
                    <Mail size={14} className="text-violet-400" aria-hidden="true" /> {personalInfo.email}
                  </a>
                </>
              )}
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="flex gap-3 justify-center md:justify-start fade-in stagger-6">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 rounded-full glass flex items-center justify-center text-stone-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 hover:shadow-[0_0_16px_rgba(201,162,39,0.3)] transition-[color,border-color,background-color,box-shadow] duration-300"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Profile Image ── */}
          <div className="shrink-0 fade-in">
            <div className="relative">
              <div className="profile-glow w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden bg-stone-900 flex items-center justify-center">
                {personalInfo.profile_images && personalInfo.profile_images.length > 0 ? (
                  <Image
                    src={personalInfo.profile_images[0].src}
                    alt={personalInfo.name}
                    width={288}
                    height={288}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: personalInfo.profile_images[0].position || "center",
                      transform: `scale(${personalInfo.profile_images[0].zoom || 1})`
                    }}
                    priority
                  />
                ) : (
                  <span className="text-stone-600 text-sm font-medium">No Image</span>
                )}
              </div>

              {/* Status chip */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap glass rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                {status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
