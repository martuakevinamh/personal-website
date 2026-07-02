"use client";

import { useState, useEffect, useCallback } from "react";
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const prev = useCallback(() => setIdx((p) => (p - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((p) => (p + 1) % images.length), [images.length]);

  const isPresent = !exp.endDate || exp.endDate === "Sekarang" || exp.endDate.toLowerCase() === "present";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-md animate-[fadeIn_0.3s_ease]" />

      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#12121a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-[modalIn_0.4s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-lg border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/20 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Image Header ── */}
        <div className="relative w-full aspect-video bg-zinc-950 overflow-hidden">
          {images.length > 0 ? (
            <>
              {images.map((img, i) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={`${exp.organization} - ${i + 1}`}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                  style={{ objectPosition: img.position || "center", transform: `scale(${img.zoom || 1})` }}
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority={i === 0}
                />
              ))}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === idx ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-6xl bg-zinc-900/50">
              📁
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#12121a] to-transparent" />
        </div>

        {/* ── Content ── */}
        <div className="p-6 sm:p-8 relative -mt-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {isPresent ? (
              <span className="flex items-center gap-1.5 bg-black/50 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
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
            <span className="bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {exp.type}
            </span>
          </div>

          <h2 className="text-3xl font-black mb-1 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            {exp.title}
          </h2>
          <h3 className="text-xl font-medium text-violet-400 mb-4">{exp.organization}</h3>

          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {exp.startDate} – {isPresent ? "Now" : exp.endDate}
          </div>

          <p className="text-zinc-300 text-base leading-relaxed mb-4 whitespace-pre-wrap">
            {exp.description}
          </p>
        </div>
      </div>
    </div>
  );
}
