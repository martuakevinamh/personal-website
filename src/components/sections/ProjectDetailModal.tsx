"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

type ProjectImage = { src: string; position: string };

type Project = {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: "ongoing" | "completed" | string;
};

export default function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const images = project.images || [];
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Basic focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [onClose]);

  const prev = useCallback(() => setIdx((p) => (p - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((p) => (p + 1) % images.length), [images.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0E0C0A]/80 backdrop-blur-md animate-[fadeIn_0.3s_ease]" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#161310]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-[modalIn_0.4s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-lg border border-white/10 text-stone-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/20 transition-[color,border-color,background-color] duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Image Header ── */}
        <div className="relative w-full aspect-video bg-stone-950 overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                key={images[idx].src}
                src={images[idx].src}
                alt={`${project.title} - screenshot ${idx + 1}`}
                fill
                className="object-cover animate-[fadeIn_0.25s_ease]"
                style={{ objectPosition: images[idx].position }}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous screenshot"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-[color,background-color,transform]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next screenshot"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-[color,background-color,transform]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Show screenshot ${i + 1}`}
                      aria-pressed={i === idx}
                      className={`h-2 rounded-full transition-[width,background-color,box-shadow] duration-300 ${
                        i === idx ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-700 text-6xl bg-stone-900/50" aria-hidden="true">
              📁
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#161310] to-transparent" aria-hidden="true" />
        </div>

        {/* ── Content ── */}
        <div className="p-6 sm:p-8 relative -mt-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {project.status === "ongoing" && (
              <span className="flex items-center gap-1.5 bg-black/50 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                In Progress
              </span>
            )}
            {project.status === "completed" && (
              <span className="bg-black/50 border border-violet-500/30 text-violet-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Completed
              </span>
            )}
            {project.featured && (
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Star size={12} className="fill-amber-400 inline -mt-0.5 mr-1" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black mb-4">{project.title}</h2>

          <p className="text-stone-300 text-base leading-relaxed mb-8 whitespace-pre-wrap">
            {project.description}
          </p>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-stone-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-35 flex items-center justify-center gap-2 font-semibold bg-violet-500 text-stone-900 hover:bg-violet-400 py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-35 flex items-center justify-center gap-2 font-semibold bg-white/5 text-stone-200 border border-white/10 hover:bg-white/10 hover:border-white/20 py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
