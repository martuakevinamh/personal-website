"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

type ExperienceImage = { src: string; position?: string; zoom?: number };

type Experience = {
  id: number;
  title: string;
  organization: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string | null;
  images: ExperienceImage[];
};

export default function ExperienceDetailModal({ exp, onClose }: { exp: Experience; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const images = exp.images || [];
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

  const isPresent = !exp.endDate || exp.endDate === "Sekarang" || exp.endDate.toLowerCase() === "present";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0E0C0A]/80 backdrop-blur-md animate-[fadeIn_0.3s_ease]" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${exp.title} at ${exp.organization}`}
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
                alt={`${exp.organization} - photo ${idx + 1}`}
                fill
                className="object-cover animate-[fadeIn_0.25s_ease]"
                style={{ objectPosition: images[idx].position || "center", transform: `scale(${images[idx].zoom || 1})` }}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous photo"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-[color,background-color,transform]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next photo"
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
                      aria-label={`Show photo ${i + 1}`}
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
            {isPresent ? (
              <span className="flex items-center gap-1.5 bg-black/50 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Present
              </span>
            ) : (
              <span className="bg-black/50 border border-violet-500/30 text-violet-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Completed
              </span>
            )}
            <span className="bg-white/5 border border-white/10 text-stone-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {exp.type}
            </span>
          </div>

          <h2 className="text-3xl font-black mb-1">{exp.title}</h2>
          <h3 className="text-xl font-medium text-violet-400 mb-4">{exp.organization}</h3>

          <div className="flex items-center gap-2 text-sm text-stone-400 mb-8 font-medium tabular-nums">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {exp.startDate} – {isPresent ? "Now" : exp.endDate}
          </div>

          <p className="text-stone-300 text-base leading-relaxed mb-4 whitespace-pre-wrap">
            {exp.description}
          </p>
        </div>
      </div>
    </div>
  );
}
